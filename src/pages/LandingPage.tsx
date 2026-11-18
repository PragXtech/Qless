import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Cpu, 
  Users, 
  QrCode, 
  Layers, 
  CheckCircle2, 
  Building2, 
  BarChart3, 
  Radio, 
  Smartphone,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  HeartHandshake
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { currentOrg } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <QrCode className="w-6 h-6 text-brand-500" />,
      title: 'Smart Digital Tokens',
      desc: 'Join queues seamlessly from your personal smartphone, on-site kiosks, or by scanning physical QR codes.'
    },
    {
      icon: <Radio className="w-6 h-6 text-brand-500" />,
      title: 'Live Queue Tracking',
      desc: 'Watch your real-time queue position progress with instant multi-screen synchronization without refreshing.'
    },
    {
      icon: <Clock className="w-6 h-6 text-brand-500" />,
      title: 'Predictive Waiting Times',
      desc: 'Queueing-theory algorithms calculate realistic wait ranges with data-backed confidence intervals.'
    },
    {
      icon: <Layers className="w-6 h-6 text-brand-500" />,
      title: 'Appointments & Walk-ins',
      desc: 'Intelligent policy merging that balances scheduled appointment slots alongside fair first-come walk-ins.'
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-brand-500" />,
      title: 'Intelligent Queue Recovery',
      desc: 'Never lose your place completely. Missed turns can be reinstated into fair order with transparent re-entry.'
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-brand-500" />,
      title: 'AI Service Assistant',
      desc: 'Powered by Gemini API with multilingual support (English, Kannada, Hindi), document checklists and voice synthesis.'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-brand-500" />,
      title: 'Smart Crowd Insights',
      desc: 'Historical visit-density forecasting guides visitors to optimal, quiet arrival windows throughout the week.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-brand-500" />,
      title: 'Inclusive & Accessible',
      desc: 'Respectful priority queuing for senior citizens, persons with disabilities, and verified medical emergencies.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Join the Queue',
      desc: 'Select your preferred service on your phone, scan an entrance QR code, or tap a self-service walk-in kiosk.'
    },
    {
      number: '02',
      title: 'Track Your Position',
      desc: 'Receive your unique digital token. Monitor your wait-time range, active counter, and receive approaching alerts.'
    },
    {
      number: '03',
      title: 'Get Served on Time',
      desc: 'Step forward only when your token is called to the assigned counter. No crowded, stressful waiting lounges.'
    }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-700/60 text-brand-600 dark:text-brand-300 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Intelligent Queue Management Platform</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-mainLight dark:text-text-mainDark font-sans leading-[1.1]">
              Never Wait <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600">
                Without Knowing.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-text-secLight dark:text-text-secDark leading-relaxed max-w-xl">
              Experience smarter, faster and more transparent queues. Join digitally, track your live position, understand predictive wait times, and make waiting time work for you.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/customer/join"
                className="px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-premium shadow-brand-500/25 hover:shadow-glow flex items-center gap-2 transition-all"
              >
                Join a Queue <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/customer"
                className="px-6 py-3.5 rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-surface-cardDark hover:bg-slate-50 dark:hover:bg-slate-800 text-text-mainLight dark:text-text-mainDark font-semibold text-sm transition-colors"
              >
                Customer Portal
              </Link>
              <Link
                to="/demo"
                className="px-5 py-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 font-semibold text-sm transition-colors"
              >
                Explore 12-Step Demo
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-light dark:border-border-dark max-w-lg">
              <div>
                <span className="text-2xl font-bold text-text-mainLight dark:text-text-mainDark">Multi-Org</span>
                <p className="text-xs text-text-secLight">Isolated Tenant Architecture</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">Real-Time</span>
                <p className="text-xs text-text-secLight">Instant Live Synchronization</p>
              </div>
              <div>
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Gemini AI</span>
                <p className="text-xs text-text-secLight">Checklists & Multilingual</p>
              </div>
            </div>
          </div>

          {/* Right Preview Card Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-surface-cardLight dark:bg-surface-cardDark rounded-3xl border border-border-light dark:border-border-dark shadow-2xl p-6 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-700 via-brand-500 to-indigo-500" />
              
              <div className="flex items-center justify-between pb-4 border-b border-border-light dark:border-border-dark">
                <div>
                  <span className="text-[10px] font-bold text-brand-600 uppercase tracking-widest">
                    LIVE PRODUCT PREVIEW
                  </span>
                  <h3 className="font-bold text-sm text-text-mainLight dark:text-text-mainDark">
                    Apollo Multi-Specialty Hospital
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Counter 2 Active
                </span>
              </div>

              {/* Digital Token Preview */}
              <div className="my-5 p-5 rounded-2xl bg-gradient-to-b from-brand-50/70 to-brand-50/20 dark:from-brand-950/30 dark:to-transparent border border-brand-100 dark:border-brand-900/50 text-center">
                <span className="text-[11px] font-semibold text-text-secLight block mb-1">
                  General OPD Consultation
                </span>
                <div className="text-5xl font-extrabold font-mono text-text-mainLight dark:text-text-mainDark">
                  A024
                </div>
                <p className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold mt-1">
                  Turn Approaching • Please Remain Nearby
                </p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border-light dark:border-border-dark">
                  <span className="text-[10px] text-text-secLight block">Position</span>
                  <strong className="text-sm text-text-mainLight dark:text-text-mainDark">#2</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border-light dark:border-border-dark">
                  <span className="text-[10px] text-text-secLight block">Ahead</span>
                  <strong className="text-sm text-brand-600 dark:text-brand-400">1 person</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-border-light dark:border-border-dark">
                  <span className="text-[10px] text-text-secLight block">Est. Wait</span>
                  <strong className="text-sm text-text-mainLight dark:text-text-mainDark">12–18m</strong>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-border-light dark:border-border-dark">
                <span className="text-text-secLight">Now Serving: <strong className="text-emerald-600">A023</strong></span>
                <span className="text-brand-600 font-semibold flex items-center gap-1">
                  Confidence: High <Sparkles className="w-3 h-3" />
                </span>
              </div>
            </div>

            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
            Intelligent Platform Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-mainLight dark:text-text-mainDark font-sans">
            Engineered for Modern Queueing
          </h2>
          <p className="text-sm text-text-secLight dark:text-text-secDark">
            Combining queueing theory mathematics, multi-tenant isolation, real-time events, and AI guidance into one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark shadow-subtle hover:shadow-premium hover:-translate-y-1 transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-900/40 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-bold text-base text-text-mainLight dark:text-text-mainDark">
                {f.title}
              </h3>
              <p className="text-xs text-text-secLight dark:text-text-secDark leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-50 dark:bg-surface-secondaryDark/40 py-20 border-y border-border-light dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
              Frictionless Customer Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-mainLight dark:text-text-mainDark font-sans">
              How Qless Works in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-surface-cardLight dark:bg-surface-cardDark p-8 rounded-2xl border border-border-light dark:border-border-dark shadow-subtle space-y-4 relative"
              >
                <span className="text-4xl font-black text-brand-500/20 font-mono block">
                  {s.number}
                </span>
                <h3 className="text-lg font-bold text-text-mainLight dark:text-text-mainDark">
                  {s.title}
                </h3>
                <p className="text-xs text-text-secLight dark:text-text-secDark leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Organisations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-300">
                Enterprise & Public Sector
              </span>
              <h2 className="text-3xl sm:text-4xl font-black font-sans leading-tight">
                Empower Your Service Counters with Intelligent Control
              </h2>
              <p className="text-sm text-brand-100 leading-relaxed">
                Whether running a multi-specialty hospital, banking branch network, university administration, or municipal office, Qless eliminates lobby congestion while providing deep analytics.
              </p>

              <ul className="space-y-2.5 text-xs text-brand-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Real-time counter allocation & staff availability monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Strict multi-tenant Row Level Security data isolation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Configurable appointment-to-walkin blending policies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Actionable AI recommendations preventing bottleneck delays</span>
                </li>
              </ul>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/admin"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-brand-900 font-bold text-xs shadow-md transition-colors"
                >
                  Open Administrator Console
                </Link>
                <Link
                  to="/staff"
                  className="px-6 py-3 rounded-xl bg-brand-700/60 hover:bg-brand-700 text-white font-semibold text-xs border border-brand-500/50 transition-colors"
                >
                  Staff Counter Desk
                </Link>
              </div>
            </div>

            <div className="space-y-3 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-300" /> Real Operational Telemetry
              </h4>
              <p className="text-xs text-brand-200 leading-relaxed">
                Every service duration is captured to train the waiting-time prediction engine and identify counter imbalances automatically.
              </p>
              <div className="pt-2 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-black/20 p-3 rounded-xl">
                  <span className="text-[10px] text-brand-300 block">Current Tenant</span>
                  <strong className="text-white text-xs">{currentOrg?.name}</strong>
                </div>
                <div className="bg-black/20 p-3 rounded-xl">
                  <span className="text-[10px] text-brand-300 block">Tenant Security</span>
                  <strong className="text-emerald-300 text-xs">RLS Isolated</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>
      </section>
    </div>
  );
};
