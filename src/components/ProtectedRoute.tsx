import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['customer', 'staff', 'org_admin', 'platform_admin'] 
}) => {
  const { user, role, switchRole } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role authorization
  if (!allowedRoles.includes(role)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface-cardLight dark:bg-surface-cardDark rounded-2xl p-8 border border-red-200 dark:border-red-900/50 shadow-premium text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-text-mainLight dark:text-text-mainDark mb-2">
            Access Restricted
          </h2>
          <p className="text-xs text-text-secLight dark:text-text-secDark mb-6 leading-relaxed">
            Your current account role is <strong className="text-brand-500 uppercase">{role}</strong>. This section requires <strong className="text-text-mainLight dark:text-text-mainDark">{allowedRoles.join(' or ')}</strong> privileges.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 mb-6 text-left border border-border-light dark:border-border-dark text-xs">
            <p className="font-semibold text-text-mainLight dark:text-text-mainDark mb-1">
              Demo Quick-Switch:
            </p>
            <p className="text-text-secLight mb-2 text-[11px]">
              Since you are evaluating Qless in demo mode, you can elevate your persona immediately:
            </p>
            <div className="flex flex-wrap gap-2">
              {allowedRoles.map(targetRole => (
                <button
                  key={targetRole}
                  onClick={() => switchRole(targetRole)}
                  className="px-2.5 py-1 rounded bg-brand-500 hover:bg-brand-600 text-white text-xs font-medium transition-colors"
                >
                  Switch to {targetRole.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/customer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Portal
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
