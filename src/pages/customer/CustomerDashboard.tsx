import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueue } from '../../context/QueueContext';
import { TokenCard } from '../../components/TokenCard';
import { StorageAPI } from '../../lib/storage';
import { analyzeCrowdIntelligence } from '../../lib/crowdIntelligence';
import { 
  PlusCircle, 
  Clock, 
  History, 
  Bell, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const CustomerDashboard: React.FC = () => {
  const { user, currentOrg } = useAuth();
  const { myActiveToken, tokens, notifications, markNotificationRead } = useQueue();
  const [activeTab, setActiveTab] = useState<'token' | 'history' | 'notifications'>('token');

  // Crowd intelligence recommendation for current organisation
  const crowd = analyzeCrowdIntelligence(currentOrg?.id || 'org-apollo-1');

  // Customer's past tokens across all organisations
  const allTokens = StorageAPI.getAllTokens();
  const historyTokens = allTokens.filter(t => 
    (t.customer_id === user?.id || (user?.email && t.customer_email === user.email)) &&
    ['completed', 'cancelled'].includes(t.status)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-premium relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Customer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-sans">
              Welcome back, {user?.full_name || 'Guest Visitor'}
            </h1>
            <p className="text-xs text-brand-200">
              Active Organisation: <strong>{currentOrg?.name}</strong>
            </p>
          </div>

          <Link
            to="/customer/join"
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-brand-900 font-bold text-xs shadow-md transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4 text-brand-600" />
            <span>Join a New Queue</span>
          </Link>
        </div>

        {/* Crowd Intelligence Banner */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-brand-100">
          <TrendingUp className="w-4 h-4 text-amber-300 shrink-0" />
          <span>
            <strong>Crowd Insight:</strong> {crowd.bestVisitingRecommendation}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border-light dark:border-border-dark pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('token')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'token'
              ? 'bg-brand-500 text-white'
              : 'text-text-secLight hover:text-text-mainLight'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Active Token</span>
          {myActiveToken && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'history'
              ? 'bg-brand-500 text-white'
              : 'text-text-secLight hover:text-text-mainLight'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Queue History ({historyTokens.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${
            activeTab === 'notifications'
              ? 'bg-brand-500 text-white'
              : 'text-text-secLight hover:text-text-mainLight'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notifications ({notifications.filter(n => !n.is_read).length})</span>
        </button>
      </div>

      {/* TAB 1: Active Token */}
      {activeTab === 'token' && (
        <div className="space-y-6">
          {myActiveToken ? (
            <div className="max-w-2xl mx-auto">
              <TokenCard token={myActiveToken} isDetailed={true} />
            </div>
          ) : (
            <div className="text-center py-16 bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl border border-border-light dark:border-border-dark p-8 max-w-lg mx-auto shadow-subtle space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-900/40 text-brand-500 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-text-mainLight dark:text-text-mainDark">
                No Active Queue Token
              </h3>
              <p className="text-xs text-text-secLight dark:text-text-secDark leading-relaxed">
                You do not currently have a waiting or serving token in this organisation. Choose a service to generate your digital token instantly.
              </p>
              <Link
                to="/customer/join"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Join a Queue Now</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Queue History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {historyTokens.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {historyTokens.map(tok => (
                <div
                  key={tok.id}
                  className="bg-surface-cardLight dark:bg-surface-cardDark p-5 rounded-2xl border border-border-light dark:border-border-dark shadow-subtle space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-text-mainLight dark:text-text-mainDark text-base">
                      {tok.token_number}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      tok.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {tok.status}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-mainLight dark:text-text-mainDark">
                      {tok.service_name || 'Consultation Service'}
                    </h4>
                    <p className="text-[11px] text-text-secLight">
                      {new Date(tok.joined_at).toLocaleDateString()} at{' '}
                      {new Date(tok.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {tok.completed_at && (
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium pt-1 border-t border-border-light dark:border-border-dark">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Service successfully completed
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-text-secLight">
              No previous completed or cancelled tokens on record.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Notifications */}
      {activeTab === 'notifications' && (
        <div className="max-w-2xl mx-auto space-y-3">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.is_read
                    ? 'bg-surface-cardLight dark:bg-surface-cardDark border-border-light dark:border-border-dark opacity-75'
                    : 'bg-brand-50/60 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800 ring-1 ring-brand-500/10'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-text-mainLight dark:text-text-mainDark">
                      {n.title}
                    </h4>
                    <span className="text-[10px] text-text-secLight">
                      {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-text-secLight dark:text-text-secDark leading-relaxed">
                    {n.message}
                  </p>
                </div>
                {!n.is_read && (
                  <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1.5" />
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-xs text-text-secLight">
              You're all caught up! No notifications yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
