import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types.ts';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage or default login
    const savedUser = localStorage.getItem('ksp_crimemind_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('ksp_crimemind_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string) => {
    setLoading(true);
    try {
      const backendUrl = localStorage.getItem('ksp_crimemind_backend_url') || import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('ksp_crimemind_user', JSON.stringify(data));
      } else {
        const err = await response.json();
        throw new Error(err.detail || 'Login failed');
      }
    } catch (e: any) {
      // Offline fallback login for client-only standalone mode
      const username = email.split('@')[0].replace('.', ' ').replace('_', ' ').replace('-', ' ').toUpperCase();
      const offlineUser: UserProfile = {
        rowid: 1,
        email: email,
        username: username,
        role: role as any,
        police_id: `KSP-2026-MOCK-${role.substring(0, 3).toUpperCase()}`,
        created_time: new Date().toISOString()
      };
      setUser(offlineUser);
      localStorage.setItem('ksp_crimemind_user', JSON.stringify(offlineUser));
      if (e.message && e.message !== 'Failed to fetch') {
        throw e;
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ksp_crimemind_user');
  };

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    // Map alternate names to keep check flexible
    const normalizedRole = user.role.replace(" ", "");
    return roles.some(r => r.replace(" ", "").toLowerCase() === normalizedRole.toLowerCase());
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
