import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { StorageAPI } from '../../lib/storage';
import { PriorityLevel, Service } from '../../types';
import { 
  Building2, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  Printer, 
  Sparkles, 
  QrCode,
  HeartHandshake
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export const KioskPage: React.FC = () => {
  const { currentOrg } = useAuth();
  const orgId = currentOrg?.id || 'org-apollo-1';
  const { generateToken } = useQueue();
  const navigate = useNavigate();

  const services = StorageAPI.getServices(orgId);
  const branches = StorageAPI.getBranches(orgId);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [generatedToken, setGeneratedToken] = useState<any | null>(null);

  const handlePrintToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const res = generateToken({
      branchId: branches[0]?.id || 'branch-apollo-central',
      serviceId: selectedService.id,
      customerName: name.trim() || 'Kiosk Walk-In',
      customerPhone: phone.trim() || undefined,
      entryChannel: 'kiosk',
      priority
    });

    if (res.success && res.token) {
      setGeneratedToken(res.token);
    }
  };

  const handleResetKiosk = () => {
    setSelectedService(null);
    setPriority('normal');
    setName('');
    setPhone('');
    setGeneratedToken(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between p-6 sm:p-12 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold text-xl shadow-glow">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-sans">
              {currentOrg?.name}
            </h1>
            <p className="text-xs text-brand-300 font-semibold tracking-wider uppercase">
              Self-Service Walk-In Ticket Kiosk
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
        >
          Exit Kiosk Mode
        </button>
      </div>

      {/* Main Kiosk Content */}
      <div className="my-8 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-center">
        {generatedToken ? (
          /* Printed Ticket Presentation */
          <div className="bg-white text-slate-950 rounded-3xl p-8 max-w-md mx-auto w-full shadow-2xl text-center space-y-6 animate-in zoom-in-95">
            <div className="border-b-2 border-dashed border-slate-300 pb-4 space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
                {currentOrg?.name}
              </span>
              <h2 className="text-sm font-semibold text-slate-600">
                {generatedToken.service_name}
              </h2>
            </div>

            <div className="py-4">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-widest block mb-1">
                YOUR TICKET NUMBER
              </span>
              <div className="text-7xl font-black font-mono tracking-tight text-slate-950">
                {generatedToken.token_number}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Estimated Wait: ~{generatedToken.estimated_wait_minutes} mins
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center border border-slate-200">
              <QRCodeSVG 
                value={`https://qless.app/track?token=${generatedToken.token_number}`}
                size={120}
              />
              <span className="text-[11px] text-slate-500 mt-2">
                Scan with phone to track position live
              </span>
            </div>

            <button
              onClick={handleResetKiosk}
              className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-black text-sm tracking-wide uppercase shadow-lg transition-colors"
            >
              Take Ticket & Finish
            </button>
          </div>
        ) : !selectedService ? (
          /* Step 1: Select Service with Large Touch Buttons */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-extrabold font-sans">
                Please Tap Your Service
              </h2>
              <p className="text-sm text-slate-400">
                No login required. Select a department to receive your printed token.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className="p-6 rounded-3xl bg-slate-800/80 hover:bg-brand-900/40 border border-slate-700 hover:border-brand-500 transition-all text-left flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 font-mono font-bold text-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {s.code}
                  </div>
                  <div className="space-y-1">
                    <strong className="text-lg font-bold text-white block">
                      {s.name}
                    </strong>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {s.description}
                    </p>
                    <span className="text-xs text-brand-400 font-semibold block pt-1">
                      Avg wait: ~{s.avg_duration_minutes}m
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Step 2: Confirm Walk-In Ticket Details */
          <div className="bg-slate-800/80 rounded-3xl border border-slate-700 p-8 max-w-xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700">
              <button
                onClick={() => setSelectedService(null)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" /> Change Service
              </button>
              <span className="text-xs font-bold text-brand-400 font-mono">
                Service: {selectedService.name}
              </span>
            </div>

            <form onSubmit={handlePrintToken} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh S"
                  className="w-full p-3.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Mobile Number for SMS (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full p-3.5 text-sm rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Priority Need
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPriority('normal')}
                    className={`p-3 rounded-xl border text-center font-bold ${
                      priority === 'normal' ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    Standard Walk-In
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriority('accessibility')}
                    className={`p-3 rounded-xl border text-center font-bold ${
                      priority === 'accessibility' ? 'bg-brand-500 text-white border-brand-500' : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    Senior / Accessibility
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mt-4"
              >
                <Printer className="w-5 h-5" />
                <span>Print Physical Ticket</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
        Qless Kiosk Terminal • Touch Screen Enabled
      </div>
    </div>
  );
};
