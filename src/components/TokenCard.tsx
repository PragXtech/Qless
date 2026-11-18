import React, { useState } from 'react';
import { QueueToken } from '../types';
import { useQueue } from '../context/QueueContext';
import { calculateWaitTimePrediction } from '../lib/predictionEngine';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  ShieldAlert, 
  QrCode, 
  RotateCcw, 
  Hourglass, 
  Radio, 
  X,
  Phone,
  Sparkles
} from 'lucide-react';

interface TokenCardProps {
  token: QueueToken;
  isDetailed?: boolean;
}

export const TokenCard: React.FC<TokenCardProps> = ({ token, isDetailed = true }) => {
  const { cancelToken, requestRecovery, requestDelay, tokens } = useQueue();
  const [showQr, setShowQr] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Calculate live dynamic queue position & people ahead
  const sameServiceWaiting = tokens.filter(t => 
    t.service_id === token.service_id && 
    (t.status === 'waiting' || t.status === 'approaching')
  );
  
  const tokenIndex = sameServiceWaiting.findIndex(t => t.id === token.id);
  const peopleAhead = tokenIndex >= 0 ? tokenIndex : 0;
  const position = tokenIndex >= 0 ? tokenIndex + 1 : 1;

  // Currently serving token for this service
  const currentServing = tokens.find(t => 
    t.service_id === token.service_id && 
    (t.status === 'serving' || t.status === 'called')
  );

  // Dynamic wait time prediction range
  const prediction = calculateWaitTimePrediction(
    token.organisation_id, 
    token.service_id, 
    token.id
  );

  // Status visual badge styling with color-blind safe text
  const getStatusBadge = () => {
    switch (token.status) {
      case 'serving':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Currently Serving (Counter {token.counter_number || 1})
          </span>
        );
      case 'called':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700 animate-bounce">
            <Radio className="w-3.5 h-3.5 text-amber-600" /> Now Called to Counter {token.counter_number}!
          </span>
        );
      case 'approaching':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-300 dark:border-orange-700">
            <AlertCircle className="w-3.5 h-3.5 text-orange-600" /> Turn Approaching (Next in Line)
          </span>
        );
      case 'waiting':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
            <Clock className="w-3.5 h-3.5 text-blue-600" /> Waiting in Queue
          </span>
        );
      case 'missed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border border-red-300 dark:border-red-700">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" /> Missed Turn
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Service Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {token.status}
          </span>
        );
    }
  };

  const handleNearby = () => {
    setActionMessage('Staff has been notified that you are at the waiting lobby!');
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleExtraTime = () => {
    requestDelay(token.id, 10);
    setActionMessage('+10 minutes extra waiting buffer requested. Position adjusted gently.');
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleCancel = () => {
    if (window.confirm(`Are you sure you want to cancel token ${token.token_number}?`)) {
      cancelToken(token.id);
    }
  };

  const handleReentry = () => {
    const res = requestRecovery(token.id);
    setActionMessage(res.message);
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-premium relative overflow-hidden transition-all">
      {/* Decorative Brand Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-700 via-brand-500 to-brand-300" />

      {/* Header Info */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <span className="text-[11px] font-semibold text-text-secLight dark:text-text-secDark uppercase tracking-wider">
            {token.org_name || 'Active Organisation'}
          </span>
          <h3 className="text-lg font-bold text-text-mainLight dark:text-text-mainDark">
            {token.service_name || 'Consultation Service'}
          </h3>
          <p className="text-xs text-text-secLight dark:text-text-secDark flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-brand-500" /> {token.branch_name || 'Main Campus'}
          </p>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {/* Hero Token Display */}
      <div className="bg-gradient-to-b from-brand-50/50 to-transparent dark:from-brand-950/20 dark:to-transparent rounded-2xl p-6 text-center border border-brand-100 dark:border-brand-900/40 mb-6">
        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-widest block mb-1">
          Your Digital Token
        </span>
        <div className="text-5xl font-black tracking-tight text-text-mainLight dark:text-text-mainDark font-mono mb-2">
          {token.token_number}
        </div>
        <p className="text-xs text-text-secLight dark:text-text-secDark">
          Issued at {new Date(token.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {token.entry_channel.toUpperCase()}
        </p>

        {token.priority !== 'normal' && (
          <span className="inline-block mt-2 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
            {token.priority} Priority
          </span>
        )}
      </div>

      {/* Queue Metrics Grid */}
      {token.status !== 'completed' && token.status !== 'cancelled' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-border-light dark:border-border-dark">
            <span className="text-[11px] text-text-secLight block">Queue Position</span>
            <span className="text-xl font-bold text-text-mainLight dark:text-text-mainDark">
              #{position}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-border-light dark:border-border-dark">
            <span className="text-[11px] text-text-secLight block">People Ahead</span>
            <span className="text-xl font-bold text-brand-600 dark:text-brand-400">
              {peopleAhead}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-border-light dark:border-border-dark">
            <span className="text-[11px] text-text-secLight block">Now Serving</span>
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {currentServing ? currentServing.token_number : 'None'}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-text-secLight">Estimated Wait</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                prediction.confidenceLevel === 'high' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {prediction.confidenceLevel}
              </span>
            </div>
            <span className="text-sm font-bold text-text-mainLight dark:text-text-mainDark block mt-0.5">
              {prediction.formattedRange}
            </span>
          </div>
        </div>
      )}

      {/* Recovery Box for Missed Tokens */}
      {token.status === 'missed' && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
                You Missed Your Turn
              </h4>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1 leading-relaxed">
                Your token was called while you were away. In accordance with organisation policy, you can request re-entry and be reinstated in fair order without starting over from scratch.
              </p>
              <button
                onClick={handleReentry}
                className="mt-3 px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Request Queue Re-Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="bg-brand-50 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-700 text-brand-800 dark:text-brand-200 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-500 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Customer Action Buttons */}
      {isDetailed && token.status !== 'completed' && token.status !== 'cancelled' && token.status !== 'missed' && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-light dark:border-border-dark">
          <button
            onClick={handleNearby}
            className="px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50 text-brand-700 dark:text-brand-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" /> I Am Nearby
          </button>

          <button
            onClick={handleExtraTime}
            className="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-800 text-text-mainLight dark:text-text-mainDark text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Hourglass className="w-3.5 h-3.5 text-text-secLight" /> Request Extra Time (+10m)
          </button>

          <button
            onClick={() => setShowQr(!showQr)}
            className="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-slate-800 text-text-mainLight dark:text-text-mainDark text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-text-secLight" /> {showQr ? 'Hide QR' : 'Show Token QR'}
          </button>

          <button
            onClick={handleCancel}
            className="px-3 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-medium ml-auto flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancel Token
          </button>
        </div>
      )}

      {/* QR Code Presentation Drawer */}
      {showQr && (
        <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
            <QRCodeSVG 
              value={`https://qless.app/track?token=${token.token_number}&id=${token.id}`}
              size={140}
              level="M"
            />
          </div>
          <p className="text-[11px] text-text-secLight mt-2 text-center">
            Scan to track token <strong>{token.token_number}</strong> or present at service counter.
          </p>
        </div>
      )}
    </div>
  );
};
