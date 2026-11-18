import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useQueue } from '../context/QueueContext';
import { UserRole } from '../types';
import { RotateCcw, Sparkles, User, Shield, Briefcase, Monitor, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DemoBanner: React.FC = () => {
  const { role, switchRole, currentOrg, setCurrentOrg } = useAuth();
  const { resetDemoData } = useQueue();
  const navigate = useNavigate();

  const handleRoleSwitch = (newRole: UserRole, targetRoute: string) => {
    switchRole(newRole);
    navigate(targetRoute);
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo queue tokens, counters, and analytics back to the baseline showcase data?')) {
      resetDemoData();
    }
  };

  return (
    <div className="bg-brand-900 text-brand-100 text-xs px-3 py-1.5 border-b border-brand-800 flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-2">
        <span className="bg-brand-500 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wide uppercase flex items-center gap-1 shadow-sm">
          <Sparkles className="w-3 h-3" /> DEMO MODE
        </span>
        <span className="text-brand-200 hidden sm:inline">
          Active Org: <strong className="text-white">{currentOrg?.name}</strong>
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-1.5">
        <span className="text-brand-300 mr-1 hidden md:inline">Switch Persona:</span>
        
        <button
          onClick={() => handleRoleSwitch('customer', '/customer')}
          className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
            role === 'customer' 
              ? 'bg-brand-500 text-white font-semibold' 
              : 'bg-brand-800/80 hover:bg-brand-700 text-brand-200'
          }`}
          title="Switch to Customer view"
        >
          <User className="w-3 h-3" /> Customer
        </button>

        <button
          onClick={() => handleRoleSwitch('staff', '/staff')}
          className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
            role === 'staff' 
              ? 'bg-brand-500 text-white font-semibold' 
              : 'bg-brand-800/80 hover:bg-brand-700 text-brand-200'
          }`}
          title="Switch to Staff Counter view"
        >
          <Briefcase className="w-3 h-3" /> Staff
        </button>

        <button
          onClick={() => handleRoleSwitch('org_admin', '/admin')}
          className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
            role === 'org_admin' 
              ? 'bg-brand-500 text-white font-semibold' 
              : 'bg-brand-800/80 hover:bg-brand-700 text-brand-200'
          }`}
          title="Switch to Administrator view"
        >
          <Shield className="w-3 h-3" /> Admin
        </button>

        <button
          onClick={() => navigate('/display')}
          className="px-2 py-1 rounded bg-brand-800/80 hover:bg-brand-700 text-brand-200 transition-colors flex items-center gap-1"
          title="Open Public Display on Large Screen / TV"
        >
          <Monitor className="w-3 h-3" /> TV Display
        </button>

        <button
          onClick={() => navigate('/kiosk')}
          className="px-2 py-1 rounded bg-brand-800/80 hover:bg-brand-700 text-brand-200 transition-colors flex items-center gap-1"
          title="Open Self-Service Walk-in Kiosk"
        >
          <Smartphone className="w-3 h-3" /> Kiosk
        </button>

        <button
          onClick={() => navigate('/demo')}
          className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-medium transition-colors"
          title="Guided 12-Step Evaluation Walkthrough"
        >
          12-Step Tour
        </button>

        <button
          onClick={handleReset}
          className="px-2 py-1 rounded bg-red-900/60 hover:bg-red-800 text-red-200 transition-colors flex items-center gap-1 ml-1"
          title="Reset sample queue tokens"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>
    </div>
  );
};
