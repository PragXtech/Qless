import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Clock, Lock, Mail, ArrowRight, Sparkles, User, Briefcase, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  const from = (location.state as any)?.from?.pathname || (
    role === 'org_admin' ? '/admin' : role === 'staff' ? '/staff' : '/customer'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const ok = await login(email, role);
    if (ok) {
      navigate(from, { replace: true });
    }
  };

  const handleQuickLogin = async (targetRole: UserRole, targetRoute: string) => {
    const demoUser = DEMO_USERS[targetRole];
    const ok = await login(demoUser.email, targetRole);
    if (ok) {
      navigate(targetRoute, { replace: true });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-subtle">
            <Clock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-text-mainLight dark:text-text-mainDark font-sans">
            Welcome Back to Qless
          </h2>
          <p className="text-xs text-text-secLight dark:text-text-secDark">
            Sign in to access your queue tokens, counter controls, or organisation dashboard.
          </p>
        </div>

        {/* Quick Demo Persona Shortcuts */}
        <div className="bg-brand-50/70 dark:bg-brand-950/30 rounded-2xl p-4 border border-brand-200 dark:border-brand-800/60 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Evaluator Sign-In</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('customer', '/customer')}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-brand-200 dark:border-brand-700 text-xs font-semibold text-text-mainLight dark:text-text-mainDark hover:border-brand-500 hover:text-brand-600 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <User className="w-4 h-4 text-brand-500" />
              <span>Customer</span>
            </button>
            <button
              onClick={() => handleQuickLogin('staff', '/staff')}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-brand-200 dark:border-brand-700 text-xs font-semibold text-text-mainLight dark:text-text-mainDark hover:border-brand-500 hover:text-brand-600 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <Briefcase className="w-4 h-4 text-brand-500" />
              <span>Staff Desk</span>
            </button>
            <button
              onClick={() => handleQuickLogin('org_admin', '/admin')}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-brand-200 dark:border-brand-700 text-xs font-semibold text-text-mainLight dark:text-text-mainDark hover:border-brand-500 hover:text-brand-600 transition-all flex flex-col items-center gap-1 shadow-sm"
            >
              <Shield className="w-4 h-4 text-brand-500" />
              <span>Org Admin</span>
            </button>
          </div>
        </div>

        {/* Standard Auth Form */}
        <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-premium">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-mainLight dark:text-text-mainDark mb-1">
                Select Your Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['customer', 'staff', 'org_admin'] as UserRole[]).map(r => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setRole(r)}
                    className={`py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors ${
                      role === r
                        ? 'bg-brand-500 text-white border-brand-500 font-bold'
                        : 'border-border-light dark:border-border-dark text-text-secLight hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-mainLight dark:text-text-mainDark mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-secLight absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/60 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-text-mainLight dark:text-text-mainDark">
                  Password
                </label>
                <span className="text-[11px] text-brand-600 hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-secLight absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/60 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-4 mt-4 border-t border-border-light dark:border-border-dark text-center text-xs text-text-secLight">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-semibold hover:underline">
              Register now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
