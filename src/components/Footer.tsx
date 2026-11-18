import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ShieldCheck, Heart, Sparkles, HelpCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-surface-cardDark border-t border-border-light dark:border-border-dark text-text-secLight dark:text-text-secDark text-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-text-mainLight dark:text-text-mainDark font-sans">
                Q<span className="text-brand-500">less</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed">
              Intelligent, inclusive, and predictive queue management platform. Never wait without knowing.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All Queue Services Operational
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-mainLight dark:text-text-mainDark mb-3">
              Portals & Displays
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/customer" className="hover:text-brand-500 transition-colors">Customer Portal</Link>
              </li>
              <li>
                <Link to="/staff" className="hover:text-brand-500 transition-colors">Staff Counter Desk</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-brand-500 transition-colors">Administrator Console</Link>
              </li>
              <li>
                <Link to="/display" className="hover:text-brand-500 transition-colors">Public TV Queue Display</Link>
              </li>
              <li>
                <Link to="/kiosk" className="hover:text-brand-500 transition-colors">Walk-In Kiosk Mode</Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-mainLight dark:text-text-mainDark mb-3">
              For Organisations
            </h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-brand-500 cursor-pointer">Hospitals & Clinics</span></li>
              <li><span className="hover:text-brand-500 cursor-pointer">Retail Banking & Finance</span></li>
              <li><span className="hover:text-brand-500 cursor-pointer">Universities & Admissions</span></li>
              <li><span className="hover:text-brand-500 cursor-pointer">Civic & Government Desks</span></li>
              <li><span className="hover:text-brand-500 cursor-pointer">Diagnostic & Labs</span></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-mainLight dark:text-text-mainDark mb-3">
              Trust & Security
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                <span>Multi-Tenant Row Level Security</span>
              </li>
              <li>
                <Link to="/demo" className="hover:text-brand-500 transition-colors">Interactive 12-Step Demo</Link>
              </li>
              <li><span className="hover:text-brand-500 cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-brand-500 cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-brand-500 cursor-pointer">Accessibility Standards</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} Qless Platform. Built with modern full-stack architecture.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>English</span>
            <span>ಕನ್ನಡ</span>
            <span>हिन्दी</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
