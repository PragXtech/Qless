import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { StorageAPI } from '../../lib/storage';
import { StaffAvailability, QueueToken, PriorityLevel } from '../../types';
import { 
  Briefcase, 
  User, 
  MapPin, 
  Play, 
  CheckCircle2, 
  PhoneOff, 
  SkipForward, 
  PauseCircle, 
  PlayCircle, 
  Clock, 
  RotateCcw, 
  Radio, 
  Sparkles,
  AlertCircle,
  UserPlus,
  ShieldCheck
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const { currentOrg, user } = useAuth();
  const orgId = currentOrg?.id || 'org-apollo-1';
  const { 
    tokens, 
    counters, 
    staff, 
    callNext, 
    startServing, 
    completeService, 
    markMissed, 
    generateToken 
  } = useQueue();

  // Find this staff member's record
  const currentStaff = staff.find(s => s.user_id === user?.id || s.id === user?.id) || staff[0];
  const assignedCounter = counters.find(c => c.id === currentStaff?.assigned_counter_id) || counters[0];

  const [availability, setAvailability] = useState<StaffAvailability>(currentStaff?.availability_status || 'available');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showWalkinModal, setShowWalkinModal] = useState(false);

  // Walk-in assisted form state
  const [walkinName, setWalkinName] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinPriority, setWalkinPriority] = useState<PriorityLevel>('normal');

  // Currently assigned token for this counter
  const activeServingToken = tokens.find(t => 
    t.counter_id === assignedCounter?.id && 
    (t.status === 'serving' || t.status === 'called')
  );

  // Queue of waiting tokens for this service
  const waitingTokens = tokens.filter(t => 
    (currentStaff?.assigned_service_id ? t.service_id === currentStaff.assigned_service_id : true) &&
    (t.status === 'waiting' || t.status === 'approaching')
  );

  const completedToday = tokens.filter(t => 
    t.served_by_staff_id === currentStaff?.id && 
    t.status === 'completed'
  );

  const handleAvailabilityChange = (newStatus: StaffAvailability) => {
    setAvailability(newStatus);
    if (currentStaff) {
      StorageAPI.updateStaffAvailability(currentStaff.id, newStatus);
    }
  };

  const handleToggleCounterPause = () => {
    if (!assignedCounter) return;
    const updated = { ...assignedCounter, is_paused: !assignedCounter.is_paused };
    StorageAPI.updateCounter(updated);
    setFeedbackMessage(updated.is_paused ? 'Counter paused. Customers will be directed to other counters.' : 'Counter resumed and active.');
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleCallNext = () => {
    if (!currentStaff || !assignedCounter) return;
    if (assignedCounter.is_paused) {
      setFeedbackMessage('Cannot call customers while counter is paused.');
      return;
    }
    const res = callNext(currentStaff.id, assignedCounter.id);
    if (res.success && res.token) {
      setFeedbackMessage(`Token ${res.token.token_number} called to ${assignedCounter.name}!`);
    } else {
      setFeedbackMessage(res.error || 'No customers waiting in queue.');
    }
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleStartServing = () => {
    if (!activeServingToken) return;
    const res = startServing(activeServingToken.id);
    if (res.success) {
      setFeedbackMessage(`Consultation started for ${activeServingToken.token_number}`);
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleComplete = () => {
    if (!activeServingToken) return;
    const res = completeService(activeServingToken.id);
    if (res.success) {
      setFeedbackMessage(`Token ${activeServingToken.token_number} marked completed.`);
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleMissed = () => {
    if (!activeServingToken) return;
    const res = markMissed(activeServingToken.id);
    if (res.success) {
      setFeedbackMessage(`Token ${activeServingToken.token_number} marked as missed.`);
    }
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !assignedCounter) return;

    const res = generateToken({
      branchId: assignedCounter.branch_id,
      serviceId: currentStaff?.assigned_service_id || 'srv-apollo-gen',
      customerName: walkinName,
      customerPhone: walkinPhone,
      entryChannel: 'receptionist',
      priority: walkinPriority
    });

    if (res.success && res.token) {
      setFeedbackMessage(`Walk-in Token ${res.token.token_number} issued for ${walkinName}!`);
      setWalkinName('');
      setWalkinPhone('');
      setShowWalkinModal(false);
    }
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Staff Header Card */}
      <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-border-light dark:border-border-dark p-6 sm:p-8 shadow-premium">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 text-white flex items-center justify-center font-bold text-xl shadow-subtle shrink-0">
              <Briefcase className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-text-mainLight dark:text-text-mainDark font-sans">
                  {currentStaff?.full_name || 'Staff Member'}
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300">
                  STAFF ACTIVE
                </span>
              </div>
              <p className="text-xs text-text-secLight flex flex-wrap items-center gap-3">
                <span>Org: <strong>{currentOrg?.name}</strong></span>
                <span>Counter: <strong className="text-brand-600">{assignedCounter?.name} (No. {assignedCounter?.counter_number})</strong></span>
                <span>Service: <strong>{currentStaff?.service_name || 'General OPD Consultation'}</strong></span>
              </p>
            </div>
          </div>

          {/* Availability Selector & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-xs">
              {(['available', 'busy', 'on_break', 'offline'] as StaffAvailability[]).map(st => (
                <button
                  key={st}
                  onClick={() => handleAvailabilityChange(st)}
                  className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${
                    availability === st
                      ? st === 'available'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : st === 'busy'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : st === 'on_break'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-slate-500 text-white shadow-sm'
                      : 'text-text-secLight hover:text-text-mainLight'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowWalkinModal(true)}
              className="px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Assisted Walk-In</span>
            </button>
          </div>
        </div>

        {/* Counter Status & Summary Ribbon */}
        <div className="mt-6 pt-6 border-t border-border-light dark:border-border-dark grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-dark">
            <span className="text-text-secLight block">Queue Waiting</span>
            <strong className="text-xl font-bold text-text-mainLight dark:text-text-mainDark">
              {waitingTokens.length}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-dark">
            <span className="text-text-secLight block">Serving Right Now</span>
            <strong className="text-xl font-bold text-brand-600 dark:text-brand-400 font-mono">
              {activeServingToken ? activeServingToken.token_number : 'Idle'}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-dark">
            <span className="text-text-secLight block">Completed Today</span>
            <strong className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {completedToday.length}
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-border-light dark:border-border-dark flex items-center justify-between">
            <div>
              <span className="text-text-secLight block">Counter Status</span>
              <strong className={`text-sm font-bold ${assignedCounter?.is_paused ? 'text-amber-500' : 'text-emerald-500'}`}>
                {assignedCounter?.is_paused ? 'Paused' : 'Active'}
              </strong>
            </div>
            <button
              onClick={handleToggleCounterPause}
              className={`p-1.5 rounded-lg border text-xs font-semibold ${
                assignedCounter?.is_paused 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
            >
              {assignedCounter?.is_paused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMessage && (
        <div className="bg-brand-500 text-white p-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-premium animate-in fade-in">
          <Sparkles className="w-4 h-4" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Counter Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Customer Service Card */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-border-light dark:border-border-dark p-6 shadow-premium">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-text-secLight">
                CURRENT CUSTOMER AT DESK
              </h2>
              {activeServingToken && (
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                  activeServingToken.status === 'serving'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                }`}>
                  {activeServingToken.status}
                </span>
              )}
            </div>

            {activeServingToken ? (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-b from-brand-50/60 to-transparent dark:from-brand-950/20 dark:to-transparent border border-brand-100 dark:border-brand-900/40 text-center">
                  <span className="text-xs text-text-secLight block mb-1">
                    Token in Consultation
                  </span>
                  <div className="text-6xl font-black font-mono text-text-mainLight dark:text-text-mainDark">
                    {activeServingToken.token_number}
                  </div>
                  <div className="mt-2 text-sm font-bold text-text-mainLight dark:text-text-mainDark">
                    {activeServingToken.customer_name}
                  </div>
                  <p className="text-xs text-text-secLight">
                    Joined at {new Date(activeServingToken.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {activeServingToken.entry_channel.toUpperCase()}
                  </p>
                  {activeServingToken.priority !== 'normal' && (
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-red-100 text-red-700">
                      {activeServingToken.priority} Priority
                    </span>
                  )}
                </div>

                {/* Counter Operation Action Buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {activeServingToken.status === 'called' ? (
                    <button
                      onClick={handleStartServing}
                      className="col-span-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                    >
                      <Play className="w-4 h-4" /> Start Serving
                    </button>
                  ) : (
                    <button
                      onClick={handleComplete}
                      className="col-span-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark Completed
                    </button>
                  )}

                  <button
                    onClick={handleMissed}
                    className="py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:text-red-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors border border-red-200 dark:border-red-900"
                  >
                    <PhoneOff className="w-3.5 h-3.5" /> No-Show / Missed
                  </button>

                  <button
                    onClick={handleCallNext}
                    className="py-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/30 dark:hover:bg-brand-950/50 dark:text-brand-300 font-bold text-xs flex items-center justify-center gap-1 transition-colors border border-brand-200 dark:border-brand-800"
                  >
                    <SkipForward className="w-3.5 h-3.5" /> Call Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-text-secLight flex items-center justify-center mx-auto">
                  <Clock className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-mainLight dark:text-text-mainDark">
                    Counter Ready for Next Customer
                  </h3>
                  <p className="text-xs text-text-secLight max-w-sm mx-auto mt-1">
                    There is currently no customer being served at this desk. Press Call Next to summon the next queued token.
                  </p>
                </div>
                <button
                  onClick={handleCallNext}
                  disabled={waitingTokens.length === 0 || assignedCounter?.is_paused}
                  className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Radio className="w-4 h-4" />
                  <span>Call Next Token ({waitingTokens.length} waiting)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Waiting Queue List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-border-light dark:border-border-dark p-6 shadow-premium">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-text-mainLight dark:text-text-mainDark flex items-center gap-2">
                <span>Waiting Queue</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-text-secLight">
                  {waitingTokens.length}
                </span>
              </h3>
              <span className="text-[11px] text-text-secLight">
                Priority Ordered
              </span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {waitingTokens.length > 0 ? (
                waitingTokens.map((t, idx) => (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                      idx === 0 
                        ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800' 
                        : 'bg-slate-50 dark:bg-slate-800/40 border-border-light dark:border-border-dark'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 font-mono font-bold text-text-mainLight dark:text-text-mainDark flex items-center justify-center border border-border-light dark:border-border-dark shadow-sm">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-sm font-mono text-text-mainLight dark:text-text-mainDark">
                            {t.token_number}
                          </strong>
                          {t.priority !== 'normal' && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-red-100 text-red-700">
                              {t.priority}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-text-secLight block">
                          {t.customer_name} • {t.is_appointment ? 'Appointment' : 'Walk-in'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] text-text-secLight font-medium">
                      Wait: ~{t.estimated_wait_minutes}m
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-text-secLight">
                  No customers waiting for this service.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Receptionist Assisted Walk-In Modal */}
      {showWalkinModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-border-light dark:border-border-dark p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                RECEPTIONIST DESK REGISTRATION
              </span>
              <h3 className="text-lg font-bold text-text-mainLight dark:text-text-mainDark mt-0.5">
                Register Walk-in Customer
              </h3>
            </div>

            <form onSubmit={handleWalkinSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-secLight font-medium mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  value={walkinName}
                  onChange={e => setWalkinName(e.target.value)}
                  placeholder="e.g. Anand Murthy"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-text-secLight font-medium mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={walkinPhone}
                  onChange={e => setWalkinPhone(e.target.value)}
                  placeholder="+91 98450 00000"
                  className="w-full px-3 py-2 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-text-secLight font-medium mb-1">Priority Classification</label>
                <select
                  value={walkinPriority}
                  onChange={e => setWalkinPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3 py-2 rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                >
                  <option value="normal">Normal Walk-In</option>
                  <option value="accessibility">Senior Citizen / Accessibility Need</option>
                  <option value="emergency">Triage / Verified Emergency</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowWalkinModal(false)}
                  className="px-4 py-2 rounded-xl text-text-secLight hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-md"
                >
                  Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
