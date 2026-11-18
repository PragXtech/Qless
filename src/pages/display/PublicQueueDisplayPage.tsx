import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { StorageAPI } from '../../lib/storage';
import { SoundEffects } from '../../lib/soundEffects';
import { 
  Clock, 
  Radio, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Building2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const PublicQueueDisplayPage: React.FC = () => {
  const { currentOrg } = useAuth();
  const orgId = currentOrg?.id || 'org-apollo-1';
  const { tokens, counters } = useQueue();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  // Live Clock updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Currently serving tokens (strictly NO PII displayed!)
  const servingTokens = tokens.filter(t => 
    t.organisation_id === orgId && 
    (t.status === 'serving' || t.status === 'called')
  );

  // Next tokens in queue (strictly NO PII displayed!)
  const nextTokens = tokens
    .filter(t => t.organisation_id === orgId && (t.status === 'waiting' || t.status === 'approaching'))
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 sm:p-10 select-none">
      {/* Top Header Bar */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold text-xl shadow-glow">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
                {currentOrg?.name || 'Qless Central Display'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-900/80 text-brand-300 border border-brand-700/60 uppercase">
                Public Display
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Central Medical Campus • Live Real-Time Queue
            </p>
          </div>
        </div>

        {/* Live Clock & Fullscreen Controls */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <span className="text-xs text-slate-400">
              {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
            <button
              onClick={() => {
                setAudioEnabled(!audioEnabled);
                SoundEffects.playChime();
              }}
              className={`p-2.5 rounded-xl border border-slate-800 transition-colors ${
                audioEnabled ? 'bg-brand-500/20 text-brand-400 border-brand-500/40' : 'text-slate-500'
              }`}
              title={audioEnabled ? 'Chime sound enabled' : 'Chime sound muted'}
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Display Body */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 flex-1 items-start">
        {/* Left Section: NOW SERVING (Large prominent cards) */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            <Radio className="w-4 h-4 animate-ping" />
            <span>NOW SERVING</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {counters.map(cnt => {
              const serving = tokens.find(t => t.id === cnt.current_token_id);

              return (
                <div
                  key={cnt.id}
                  className={`p-6 rounded-3xl border transition-all ${
                    serving
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-brand-950/60 border-brand-500/60 shadow-glow'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                      {cnt.name}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Window {cnt.counter_number}
                    </span>
                  </div>

                  <div className="text-center py-4">
                    <div className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white">
                      {serving ? serving.token_number : '—'}
                    </div>
                    <span className="text-xs font-semibold text-brand-400 uppercase tracking-widest block mt-2">
                      {serving ? (serving.status === 'called' ? 'Please Proceed to Window' : 'In Consultation') : 'Counter Ready'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Section: NEXT TOKENS LIST */}
        <section className="lg:col-span-4 bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              NEXT IN LINE
            </span>
            <span className="text-xs text-slate-500">
              Please Prepare
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {nextTokens.length > 0 ? (
              nextTokens.map((t, idx) => (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    idx === 0
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950/80 border-slate-800/80 text-slate-200'
                  }`}
                >
                  <div className="text-2xl font-black font-mono">
                    {t.token_number}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {idx === 0 ? 'Approaching' : `Wait ~${t.estimated_wait_minutes}m`}
                  </span>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-xs text-slate-500">
                No waiting tokens in queue.
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Bottom Ticker & Privacy Guarantee */}
      <footer className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Privacy Protected: Personal details are never revealed on public displays.
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span>Track on your phone at <strong>qless.app</strong></span>
          <span>© Qless Multi-Tenant Display</span>
        </div>
      </footer>
    </div>
  );
};
