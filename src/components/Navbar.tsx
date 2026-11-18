import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { StorageAPI } from '../lib/storage';
import { 
  Clock, 
  Sun, 
  Moon, 
  Building2, 
  LogOut, 
  User, 
  Menu, 
  X,
  ChevronDown,
  Layers,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, logout, currentOrg, setCurrentOrg } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

  const orgs = StorageAPI.getOrganisations();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Customer Portal', path: '/customer' },
    { label: 'Staff Portal', path: '/staff' },
    { label: 'Admin Portal', path: '/admin' },
    { label: 'Public Display', path: '/display', external: false },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-cardLight/90 dark:bg-surface-cardDark/90 backdrop-blur-md border-b border-border-light dark:border-border-dark transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-500 to-brand-400 flex items-center justify-center text-white shadow-subtle shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-text-mainLight dark:text-text-mainDark font-sans">
                  Q<span className="text-brand-500">less</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-700/50">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] text-text-secLight dark:text-text-secDark font-medium leading-none -mt-0.5">
                Never Wait Without Knowing
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/30 font-semibold'
                    : 'text-text-secLight dark:text-text-secDark hover:text-text-mainLight dark:hover:text-text-mainDark hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Organisation Selector */}
            <div className="relative">
              <button
                onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-text-mainLight dark:text-text-mainDark hover:border-brand-400 transition-colors"
                title="Switch Active Organisation (Multi-Tenant)"
              >
                <Building2 className="w-3.5 h-3.5 text-brand-500" />
                <span className="max-w-[120px] truncate">{currentOrg?.name || 'Select Org'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-text-secLight" />
              </button>

              {orgDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl shadow-premium bg-surface-cardLight dark:bg-surface-cardDark border border-border-light dark:border-border-dark p-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                  onClick={() => setOrgDropdownOpen(false)}
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold text-text-secLight uppercase tracking-wider">
                    Select Organisation (Tenant)
                  </div>
                  {orgs.map(org => (
                    <button
                      key={org.id}
                      onClick={() => setCurrentOrg(org)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex flex-col gap-0.5 transition-colors ${
                        currentOrg?.id === org.id
                          ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 font-semibold'
                          : 'text-text-mainLight dark:text-text-mainDark hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <span className="truncate">{org.name}</span>
                      <span className="text-[10px] text-text-secLight capitalize">{org.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-lg border border-border-light dark:border-border-dark text-text-secLight dark:text-text-secDark hover:text-brand-500 hover:border-brand-400 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User / Auth Indicator */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-border-light dark:border-border-dark">
                <div className="flex flex-col text-right">
                  <span className="text-xs font-semibold text-text-mainLight dark:text-text-mainDark leading-tight">
                    {user.full_name}
                  </span>
                  <span className="text-[10px] font-medium capitalize text-brand-600 dark:text-brand-400">
                    {user.global_role.replace('_', ' ')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="p-1.5 rounded-lg text-text-secLight hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-mainLight dark:text-text-mainDark hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-500 hover:bg-brand-600 text-white shadow-sm transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg border border-border-light dark:border-border-dark text-text-secLight"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-mainLight dark:text-text-mainDark"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pt-2 pb-4 bg-surface-cardLight dark:bg-surface-cardDark border-b border-border-light dark:border-border-dark space-y-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300 font-bold'
                  : 'text-text-secLight dark:text-text-secDark'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border-light dark:border-border-dark flex items-center justify-between">
            <div className="text-xs text-text-secLight">
              Active Tenant: <strong className="text-text-mainLight dark:text-text-mainDark">{currentOrg?.name}</strong>
            </div>
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/login');
                }}
                className="text-xs text-red-500 font-medium"
              >
                Log Out
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-brand-500"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
