import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { StorageAPI } from '../../lib/storage';
import { PriorityLevel } from '../../types';
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  ShieldAlert, 
  HeartHandshake, 
  FileText, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const JoinQueuePage: React.FC = () => {
  const { currentOrg, setCurrentOrg, user } = useAuth();
  const { generateToken } = useQueue();
  const navigate = useNavigate();

  const orgs = StorageAPI.getOrganisations();
  const selectedOrgId = currentOrg?.id || orgs[0].id;
  const branches = StorageAPI.getBranches(selectedOrgId);
  const services = StorageAPI.getServices(selectedOrgId);

  // Form states
  const [selectedBranchId, setSelectedBranchId] = useState<string>(branches[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || '');
  const [entryType, setEntryType] = useState<'walkin' | 'appointment'>('walkin');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [customerName, setCustomerName] = useState<string>(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phone || '+91 97410 77889');
  const [customerEmail, setCustomerEmail] = useState<string>(user?.email || '');
  const [emergencyReason, setEmergencyReason] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedBranchId || !selectedServiceId || !customerName.trim()) {
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (priority === 'emergency' && !emergencyReason.trim()) {
      setErrorMessage('Please provide a medical or urgent verification reason for Emergency Priority.');
      return;
    }

    setIsSubmitting(true);

    const res = generateToken({
      branchId: selectedBranchId,
      serviceId: selectedServiceId,
      customerName,
      customerPhone,
      customerEmail,
      entryChannel: 'portal',
      isAppointment: entryType === 'appointment',
      priority
    });

    setIsSubmitting(false);

    if (res.success && res.token) {
      navigate('/customer');
    } else {
      setErrorMessage(res.error || 'Failed to generate token. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/customer')}
          className="flex items-center gap-1.5 text-xs font-semibold text-text-secLight hover:text-text-mainLight transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
        <span className="text-xs text-text-secLight">
          Step 1 of 1 • Instant Confirmation
        </span>
      </div>

      <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl border border-border-light dark:border-border-dark p-6 sm:p-8 shadow-premium space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            DIGITAL TOKEN ISSUANCE
          </span>
          <h2 className="text-2xl font-extrabold text-text-mainLight dark:text-text-mainDark font-sans mt-0.5">
            Join Queue at {currentOrg?.name}
          </h2>
          <p className="text-xs text-text-secLight dark:text-text-secDark mt-1">
            Fill in your details below to receive an atomic sequence number and live position tracking.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Organisation Selector */}
          <div>
            <label className="block text-xs font-bold text-text-mainLight dark:text-text-mainDark mb-1.5">
              1. Organisation (Tenant)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {orgs.map(org => (
                <button
                  type="button"
                  key={org.id}
                  onClick={() => {
                    setCurrentOrg(org);
                    const bList = StorageAPI.getBranches(org.id);
                    const sList = StorageAPI.getServices(org.id);
                    setSelectedBranchId(bList[0]?.id || '');
                    setSelectedServiceId(sList[0]?.id || '');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    currentOrg?.id === org.id
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-200 ring-2 ring-brand-500/20'
                      : 'border-border-light dark:border-border-dark hover:border-slate-300 text-text-secLight'
                  }`}
                >
                  <Building2 className="w-4 h-4 mb-1 text-brand-500" />
                  <span className="text-xs font-bold block truncate">{org.name}</span>
                  <span className="text-[10px] capitalize opacity-80">{org.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Branch Selector */}
          {branches.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-text-mainLight dark:text-text-mainDark mb-1.5">
                2. Branch Location
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {branches.map(b => (
                  <button
                    type="button"
                    key={b.id}
                    onClick={() => setSelectedBranchId(b.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedBranchId === b.id
                        ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-200 ring-2 ring-brand-500/20'
                        : 'border-border-light dark:border-border-dark text-text-secLight'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mb-1 text-brand-500" />
                    <span className="text-xs font-bold block">{b.name}</span>
                    <span className="text-[10px] opacity-80">{b.address}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Service Selector */}
          <div>
            <label className="block text-xs font-bold text-text-mainLight dark:text-text-mainDark mb-1.5">
              3. Service Required
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {services.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelectedServiceId(s.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between ${
                    selectedServiceId === s.id
                      ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-900/20 ring-2 ring-brand-500/20'
                      : 'border-border-light dark:border-border-dark hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 font-mono font-bold text-xs flex items-center justify-center">
                        {s.code}
                      </span>
                      <strong className="text-xs text-text-mainLight dark:text-text-mainDark">
                        {s.name}
                      </strong>
                    </div>
                    <p className="text-[11px] text-text-secLight">{s.description}</p>
                    {s.required_documents && (
                      <p className="text-[10px] text-brand-600 dark:text-brand-400 font-medium pt-0.5">
                        Required Documents: {s.required_documents.join(', ')}
                      </p>
                    )}
                  </div>

                  <span className="text-[11px] font-semibold text-text-secLight flex items-center gap-1 shrink-0 ml-3">
                    <Clock className="w-3.5 h-3.5 text-brand-500" /> ~{s.avg_duration_minutes}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Entry Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-mainLight dark:text-text-mainDark mb-1.5">
                4. Visit Option
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEntryType('walkin')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    entryType === 'walkin'
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'border-border-light dark:border-border-dark text-text-secLight hover:bg-slate-50'
                  }`}
                >
                  Walk-In Now
                </button>
                <button
                  type="button"
                  onClick={() => setEntryType('appointment')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    entryType === 'appointment'
                      ? 'bg-brand-500 text-white border-brand-500'
                      : 'border-border-light dark:border-border-dark text-text-secLight hover:bg-slate-50'
                  }`}
                >
                  Appointment Slot
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-mainLight dark:text-text-mainDark mb-1.5">
                5. Accessibility Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as PriorityLevel)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
              >
                <option value="normal">Normal Priority</option>
                <option value="accessibility">Accessibility (Senior Citizen / PwD)</option>
                <option value="emergency">Emergency Priority (Requires Verification)</option>
              </select>
            </div>
          </div>

          {priority === 'emergency' && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 text-xs space-y-1.5">
              <span className="font-bold text-red-700 dark:text-red-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Emergency Reason
              </span>
              <input
                type="text"
                value={emergencyReason}
                onChange={e => setEmergencyReason(e.target.value)}
                placeholder="e.g. Acute pain, severe bleeding, or verified triage urgency"
                required
                className="w-full p-2 text-xs rounded-lg border border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 text-text-mainLight dark:text-text-mainDark focus:outline-none"
              />
            </div>
          )}

          {/* Customer Personal Details */}
          <div className="pt-2 border-t border-border-light dark:border-border-dark space-y-3">
            <h4 className="text-xs font-bold text-text-mainLight dark:text-text-mainDark">
              6. Customer Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-text-secLight mb-1">Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-text-secLight mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-text-secLight mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="text-xs text-text-secLight">
              Token will be generated on <strong className="text-text-mainLight dark:text-text-mainDark">Queue {selectedService?.code}</strong>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>{isSubmitting ? 'Generating Token...' : 'Confirm & Generate Token'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
