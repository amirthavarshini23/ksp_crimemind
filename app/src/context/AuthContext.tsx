import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types.ts';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
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
    } else {
      // Seed default Investigator session for the hackathon
      const defaultUser: UserProfile = {
        rowid: 1,
        email: "investigator.raj@ksp.gov.in",
        username: "Inspector Rajkumar",
        role: "Investigator",
        police_id: "KSP-2015-BLR-884",
        created_time: "2026-05-01 10:00:00"
      };
      setUser(defaultUser);
      localStorage.setItem('ksp_crimemind_user', JSON.stringify(defaultUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: 'password123' }),
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        localStorage.setItem('ksp_crimemind_user', JSON.stringify(data));
      } else {
        throw new Error('Login failed');
      }
    } catch (e) {
      // Offline fallback login for client-only standalone mode
      const offlineUser: UserProfile = {
        rowid: 1,
        email: email,
        username: email.split('@')[0].toUpperCase(),
        role: email.includes('admin') ? 'Administrator' : email.includes('supervisor') ? 'Supervisor' : email.includes('analyst') ? 'Analyst' : 'Investigator',
        police_id: "KSP-2026-MOCK-999",
        created_time: new Date().toISOString()
      };
      setUser(offlineUser);
      localStorage.setItem('ksp_crimemind_user', JSON.stringify(offlineUser));
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
    return roles.includes(user.role);
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
