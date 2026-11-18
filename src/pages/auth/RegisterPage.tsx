import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Clock, User, Mail, Lock, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('customer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const ok = await register(name, email, role);
    if (ok) {
      navigate(role === 'org_admin' ? '/admin' : role === 'staff' ? '/staff' : '/customer');
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
            Create Your Qless Account
          </h2>
          <p className="text-xs text-text-secLight dark:text-text-secDark">
            Join queues, manage tokens, or set up your organisation desk.
          </p>
        </div>

        <div className="bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl border border-border-light dark:border-border-dark p-6 shadow-premium">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-mainLight dark:text-text-mainDark mb-1">
                Account Type
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
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-text-secLight absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ramesh Sundaram"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/60 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                />
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
                  placeholder="ramesh@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/60 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-mainLight dark:text-text-mainDark mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-secLight absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  required
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/60 text-text-mainLight dark:text-text-mainDark focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-4 mt-4 border-t border-border-light dark:border-border-dark text-center text-xs text-text-secLight">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
