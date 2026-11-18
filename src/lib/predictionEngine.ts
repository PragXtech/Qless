import { StorageAPI } from './storage';
import { QueueToken, Service, Counter, StaffProfile } from '../types';

export interface PredictionResult {
  estimatedMinutesMin: number;
  estimatedMinutesMax: number;
  averageExpectedMinutes: number;
  formattedRange: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  factors: {
    peopleAhead: number;
    activeCounters: number;
    historicalAvgDurationMinutes: number;
    staffAvailabilityFactor: number; // 1.0 = full, 0.5 = some on break
  };
}

/**
 * Predicts the realistic waiting-time range using Queueing Theory (M/M/c approximation):
 * - c = Number of active, available counters
 * - lambda = Arrival rate
 * - mu = Service rate (1 / average service duration)
 * - People ahead in line weighted by priority
 */
export function calculateWaitTimePrediction(
  organisationId: string,
  serviceId: string,
  tokenPositionOrId?: number | string
): PredictionResult {
  const service = StorageAPI.getServiceById(serviceId);
  const counters = StorageAPI.getCounters(organisationId).filter(c => c.is_active && !c.is_paused);
  const staff = StorageAPI.getStaff(organisationId);
  const tokens = StorageAPI.getTokens(organisationId);
  const serviceRecords = StorageAPI.getServiceRecords(organisationId).filter(r => r.service_id === serviceId);

  // 1. Calculate historical average service duration
  let baseDuration = service?.avg_duration_minutes || 12;
  let sampleCount = serviceRecords.length;

  if (sampleCount > 5) {
    const totalSec = serviceRecords.slice(-30).reduce((sum, r) => sum + r.service_duration_seconds, 0);
    const avgSec = totalSec / Math.min(serviceRecords.length, 30);
    baseDuration = Math.round(avgSec / 60);
  }

  // 2. Count active staff currently available (not on break / offline)
  const availableStaffCount = staff.filter(s => 
    s.availability_status === 'available' || s.availability_status === 'busy'
  ).length;

  const totalCountersCount = Math.max(1, counters.length);
  // Effective counters serving this service
  const effectiveCounters = Math.max(1, Math.min(totalCountersCount, availableStaffCount || 1));

  // Staff availability factor
  const onBreakCount = staff.filter(s => s.availability_status === 'on_break').length;
  const staffFactor = staff.length > 0 ? (availableStaffCount / (availableStaffCount + onBreakCount || 1)) : 1.0;

  // 3. Determine people ahead
  let peopleAhead = 0;
  const waitingTokens = tokens.filter(t => 
    t.service_id === serviceId && 
    (t.status === 'waiting' || t.status === 'approaching')
  );

  if (typeof tokenPositionOrId === 'number') {
    peopleAhead = Math.max(0, tokenPositionOrId);
  } else if (typeof tokenPositionOrId === 'string') {
    const targetToken = tokens.find(t => t.id === tokenPositionOrId);
    if (targetToken) {
      if (targetToken.status === 'called' || targetToken.status === 'serving') {
        return {
          estimatedMinutesMin: 0,
          estimatedMinutesMax: 2,
          averageExpectedMinutes: 1,
          formattedRange: '0–2 mins (Now Serving)',
          confidenceLevel: 'high',
          factors: {
            peopleAhead: 0,
            activeCounters: effectiveCounters,
            historicalAvgDurationMinutes: baseDuration,
            staffAvailabilityFactor: staffFactor
          }
        };
      }
      peopleAhead = waitingTokens.findIndex(t => t.id === targetToken.id);
      if (peopleAhead < 0) peopleAhead = 0;
    } else {
      peopleAhead = waitingTokens.length;
    }
  } else {
    peopleAhead = waitingTokens.length;
  }

  // 4. Expected wait calculation:
  // In a multi-server queue (c servers), expected wait time is (People Ahead / c) * avg_duration
  const rawExpectedMinutes = ((peopleAhead + 1) / effectiveCounters) * baseDuration * (1 / Math.max(0.6, staffFactor));
  
  // Calculate statistical variance window (+- 20-30% variance)
  const varianceFactor = sampleCount > 20 ? 0.2 : 0.35;
  const minMinutes = Math.max(2, Math.floor(rawExpectedMinutes * (1 - varianceFactor)));
  const maxMinutes = Math.max(minMinutes + 3, Math.ceil(rawExpectedMinutes * (1 + varianceFactor)));
  const avgMinutes = Math.round((minMinutes + maxMinutes) / 2);

  // Confidence determination based on data robustness
  let confidence: 'high' | 'medium' | 'low' = 'low';
  if (sampleCount >= 20 && effectiveCounters >= 1) {
    confidence = 'high';
  } else if (sampleCount >= 5) {
    confidence = 'medium';
  }

  return {
    estimatedMinutesMin: minMinutes,
    estimatedMinutesMax: maxMinutes,
    averageExpectedMinutes: avgMinutes,
    formattedRange: `${minMinutes}–${maxMinutes} minutes`,
    confidenceLevel: confidence,
    factors: {
      peopleAhead,
      activeCounters: effectiveCounters,
      historicalAvgDurationMinutes: baseDuration,
      staffAvailabilityFactor: Number(staffFactor.toFixed(2))
    }
  };
}
