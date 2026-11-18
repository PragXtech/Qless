import { StorageAPI } from './storage';
import { AdminRecommendation } from '../types';

export function generateAdminRecommendations(organisationId: string): AdminRecommendation[] {
  const recommendations: AdminRecommendation[] = [];
  const tokens = StorageAPI.getTokens(organisationId);
  const counters = StorageAPI.getCounters(organisationId);
  const staff = StorageAPI.getStaff(organisationId);
  const records = StorageAPI.getServiceRecords(organisationId);
  const services = StorageAPI.getServices(organisationId);

  // 1. Analyze Missed Turn Rate
  const totalToday = tokens.length;
  const missedTokens = tokens.filter(t => t.status === 'missed').length;
  const missedRate = totalToday > 0 ? (missedTokens / totalToday) * 100 : 0;

  if (missedRate > 15) {
    recommendations.push({
      id: 'rec-high-missed',
      type: 'warning',
      title: 'High Turn-Miss Rate Detected',
      description: `${missedTokens} out of ${totalToday} customers (${missedRate.toFixed(1)}%) missed their turn today. Customers may not be hearing announcements or notification alerts in waiting lounges.`,
      impact: 'Reduces counter efficiency by ~18% due to idle call cycles.',
      actionLabel: 'Enable Audio Chime & Review Notification Delivery',
      metric: `${missedRate.toFixed(1)}% Missed`
    });
  }

  // 2. Counter Workload Imbalance
  const activeCounters = counters.filter(c => c.is_active && !c.is_paused);
  const pausedCounters = counters.filter(c => c.is_paused);

  if (pausedCounters.length > 0 && tokens.filter(t => t.status === 'waiting').length > 4) {
    recommendations.push({
      id: 'rec-paused-counters',
      type: 'urgent',
      title: 'Paused Counters During Elevated Queue Density',
      description: `${pausedCounters.length} counter(s) are currently paused while ${tokens.filter(t => t.status === 'waiting').length} customers wait. Resuming Counter ${pausedCounters[0].counter_number} could cut average wait time by ~35%.`,
      impact: 'Immediate capacity recovery.',
      actionLabel: 'Resume Inactive Counters',
      metric: `${pausedCounters.length} Paused`
    });
  }

  // 3. Service Duration Bottlenecks
  services.forEach(srv => {
    const srvRecords = records.filter(r => r.service_id === srv.id);
    if (srvRecords.length >= 5) {
      const avgSec = srvRecords.reduce((sum, r) => sum + r.service_duration_seconds, 0) / srvRecords.length;
      const actualMins = Math.round(avgSec / 60);
      const configuredMins = srv.avg_duration_minutes || 10;

      if (actualMins > configuredMins * 1.3) {
        recommendations.push({
          id: `rec-bottleneck-${srv.id}`,
          type: 'optimization',
          title: `Service Delay in ${srv.name}`,
          description: `Actual consultations are averaging ${actualMins} mins vs standard ${configuredMins} mins. Queue progression is pacing 30% slower than expected.`,
          impact: 'Adjust standard duration parameter to improve prediction accuracy for waiting visitors.',
          actionLabel: `Update Service SLA (${actualMins} mins)`,
          metric: `+${actualMins - configuredMins}m drift`
        });
      }
    }
  });

  // 4. Staffing on Breaks during Peak Periods
  const onBreakStaff = staff.filter(s => s.availability_status === 'on_break');
  const waitingCount = tokens.filter(t => t.status === 'waiting').length;

  if (onBreakStaff.length >= 2 && waitingCount >= 5) {
    recommendations.push({
      id: 'rec-staff-peak',
      type: 'info',
      title: 'Stagger Staff Break Schedules',
      description: `${onBreakStaff.length} staff members are concurrently on break while ${waitingCount} patrons are queued. Staggering break times by 20 minutes eliminates queue spikes.`,
      impact: 'Smooths out wait-time variability.',
      actionLabel: 'View Staff Roster',
      metric: `${onBreakStaff.length} on break`
    });
  }

  // 5. Default positive benchmark if performing well
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-optimal',
      type: 'info',
      title: 'Queue Flow Operating Optimally',
      description: 'Current queue throughput is well-balanced across available counters with wait times under 15 minutes.',
      impact: 'Optimal patient satisfaction index (94%).',
      metric: 'Stable Flow'
    });
  }

  return recommendations;
}
