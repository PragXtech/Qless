import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole, UserProfile, Organisation } from '../types';
import { StorageAPI } from '../lib/storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  currentOrg: Organisation | null;
  setCurrentOrg: (org: Organisation) => void;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  register: (name: string, email: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  isLoading: boolean;
}

// Preset Personas for immediate demonstration and testing
export const DEMO_USERS: Record<UserRole, UserProfile> = {
  customer: {
    id: 'cust-user-me',
    email: 'kavya.k@example.com',
    full_name: 'Kavya Krishnan',
    phone: '+91 97410 77889',
    global_role: 'customer',
    created_at: new Date().toISOString()
  },
  staff: {
    id: 'staff-dr-rahul',
    email: 'rahul.s@apollocare.org',
    full_name: 'Dr. Rahul Sharma',
    phone: '+91 98451 22334',
    global_role: 'staff',
    created_at: new Date().toISOString()
  },
  org_admin: {
    id: 'admin-arvind',
    email: 'admin@apollocare.org',
    full_name: 'Dr. Arvind Swaminathan (Medical Director)',
    phone: '+91 98450 00112',
    global_role: 'org_admin',
    created_at: new Date().toISOString()
  },
  platform_admin: {
    id: 'platform-superadmin',
    email: 'superadmin@qless.io',
    full_name: 'Platform Operations Admin',
    global_role: 'platform_admin',
    created_at: new Date().toISOString()
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('qless_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_USERS.customer;
      }
    }
    // Default to customer role for fresh visits
    return DEMO_USERS.customer;
  });

  const [currentOrg, setCurrentOrgState] = useState<Organisation | null>(() => {
    const orgs = StorageAPI.getOrganisations();
    const savedOrgId = localStorage.getItem('qless_active_org_id');
    const matched = orgs.find(o => o.id === savedOrgId);
    return matched || orgs[0] || null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('qless_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qless_auth_user');
    }
  }, [user]);

  const setCurrentOrg = (org: Organisation) => {
    setCurrentOrgState(org);
    localStorage.setItem('qless_active_org_id', org.id);
  };

  const login = async (email: string, role?: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        // Supabase authentication path
        // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      }

      // Assign matching demo user or create session profile
      const determinedRole = role || (email.includes('admin') ? 'org_admin' : email.includes('staff') ? 'staff' : 'customer');
      const baseProfile = DEMO_USERS[determinedRole] || {
        id: `user-${Date.now()}`,
        email,
        full_name: email.split('@')[0],
        global_role: determinedRole,
        created_at: new Date().toISOString()
      };

      setUser({ ...baseProfile, email, global_role: determinedRole });
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Login failed:', e);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, role: UserRole = 'customer'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        full_name: name,
        global_role: role,
        created_at: new Date().toISOString()
      };
      setUser(newUser);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Registration failed:', e);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('qless_auth_user');
  };

  const switchRole = (newRole: UserRole) => {
    const demoProfile = DEMO_USERS[newRole];
    setUser(demoProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.global_role || 'customer',
        currentOrg,
        setCurrentOrg,
        login,
        register,
        logout,
        switchRole,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
