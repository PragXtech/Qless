import { StorageAPI } from './storage';
import { CrowdInsight } from '../types';

export interface CrowdAnalysisResult {
  hasSufficientData: boolean;
  totalRecordsAnalyzed: number;
  hourlyTrends: CrowdInsight[];
  busiestDay: string;
  quietestDay: string;
  peakHourRange: string;
  optimalHourRange: string;
  bestVisitingRecommendation: string;
  branchComparisons: {
    branchName: string;
    branchId: string;
    tokenVolume: number;
    avgWaitMinutes: number;
    utilizationPercent: number;
  }[];
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function analyzeCrowdIntelligence(organisationId: string): CrowdAnalysisResult {
  const records = StorageAPI.getServiceRecords(organisationId);
  const branches = StorageAPI.getBranches(organisationId);
  const tokens = StorageAPI.getTokens(organisationId);

  const hasSufficientData = records.length >= 10;

  // Aggregate by hour of day (8 AM to 7 PM)
  const hourlyBuckets: Record<number, { count: number; totalWaitSec: number }> = {};
  for (let h = 8; h <= 19; h++) {
    hourlyBuckets[h] = { count: 0, totalWaitSec: 0 };
  }

  // Aggregate by day of week
  const dayBuckets: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

  records.forEach(r => {
    if (hourlyBuckets[r.hour_of_day]) {
      hourlyBuckets[r.hour_of_day].count += 1;
      hourlyBuckets[r.hour_of_day].totalWaitSec += r.wait_duration_seconds;
    }
    if (r.day_of_week !== undefined) {
      dayBuckets[r.day_of_week] = (dayBuckets[r.day_of_week] || 0) + 1;
    }
  });

  const hourlyTrends: CrowdInsight[] = [];
  let maxVolumeHour = 11;
  let maxVolumeCount = -1;
  let minVolumeHour = 9;
  let minVolumeCount = 999999;

  for (let h = 8; h <= 19; h++) {
    const bucket = hourlyBuckets[h];
    const avgWait = bucket.count > 0 ? Math.round((bucket.totalWaitSec / bucket.count) / 60) : 10;
    
    let level: 'Low' | 'Moderate' | 'Peak' | 'Extreme' = 'Low';
    if (bucket.count > 15 || avgWait > 25) level = 'Extreme';
    else if (bucket.count > 10 || avgWait > 18) level = 'Peak';
    else if (bucket.count > 4 || avgWait > 12) level = 'Moderate';

    if (bucket.count > maxVolumeCount) {
      maxVolumeCount = bucket.count;
      maxVolumeHour = h;
    }
    if (bucket.count < minVolumeCount && h >= 9 && h <= 17) {
      minVolumeCount = bucket.count;
      minVolumeHour = h;
    }

    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayHour = h > 12 ? h - 12 : h;
    const hourLabel = `${displayHour} ${ampm}`;

    hourlyTrends.push({
      dayOfWeek: 'Weekdays',
      hourOfDay: h,
      hourLabel,
      averageWaitMinutes: avgWait,
      customerVolume: bucket.count,
      crowdLevel: level
    });
  }

  // Find busiest and quietest day
  let busiestDayIndex = 1;
  let quietestDayIndex = 2;
  let maxDayCount = -1;
  let minDayCount = 999999;

  Object.entries(dayBuckets).forEach(([dStr, count]) => {
    const d = Number(dStr);
    if (d >= 1 && d <= 5) { // focus on Monday to Friday
      if (count > maxDayCount) {
        maxDayCount = count;
        busiestDayIndex = d;
      }
      if (count < minDayCount) {
        minDayCount = count;
        quietestDayIndex = d;
      }
    }
  });

  const busiestDay = DAY_NAMES[busiestDayIndex];
  const quietestDay = DAY_NAMES[quietestDayIndex];

  const formatHourWindow = (hour: number) => {
    const startAmPm = hour >= 12 ? 'PM' : 'AM';
    const endHour = hour + 1;
    const endAmPm = endHour >= 12 ? 'PM' : 'AM';
    const startH = hour > 12 ? hour - 12 : hour;
    const endH = endHour > 12 ? endHour - 12 : endHour;
    return `${startH} ${startAmPm} – ${endH} ${endAmPm}`;
  };

  const peakHourRange = formatHourWindow(maxVolumeHour);
  const optimalHourRange = formatHourWindow(minVolumeHour);

  const bestVisitingRecommendation = hasSufficientData
    ? `${quietestDay} between ${optimalHourRange} is historically the least crowded period with minimal wait times.`
    : `Historical records are currently accumulating. Based on initial traffic, weekday mornings (9:00 AM – 10:30 AM) have lowest queue density.`;

  // Branch workload comparison
  const branchComparisons = branches.map(b => {
    const branchTokens = tokens.filter(t => t.branch_id === b.id);
    const branchRecords = records.filter(r => r.branch_id === b.id);
    const avgWait = branchRecords.length > 0
      ? Math.round((branchRecords.reduce((s, r) => s + r.wait_duration_seconds, 0) / branchRecords.length) / 60)
      : 12;

    const utilization = Math.min(95, Math.max(30, branchTokens.length * 12));

    return {
      branchName: b.name,
      branchId: b.id,
      tokenVolume: branchTokens.length,
      avgWaitMinutes: avgWait,
      utilizationPercent: utilization
    };
  });

  return {
    hasSufficientData,
    totalRecordsAnalyzed: records.length,
    hourlyTrends,
    busiestDay,
    quietestDay,
    peakHourRange,
    optimalHourRange,
    bestVisitingRecommendation,
    branchComparisons
  };
}
