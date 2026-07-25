import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Briefcase, 
  Network, 
  BarChart3, 
  AlertOctagon, 
  Settings as SettingsIcon,
  Users,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import kspLogo from '../assets/ksp_logo.png';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  roles?: string[]; // If specified, only shown for these roles
}

export const Sidebar: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { to: '/', label: 'AI Command Center', icon: LayoutDashboard },
    { to: '/chat', label: 'Intelligence Chat', icon: MessageSquare },
    { to: '/cases', label: 'Cases & Folders', icon: Briefcase },
    { to: '/collaboration', label: 'Collaboration', icon: Users, roles: ['Investigator', 'Supervisor', 'Administrator', 'Analyst', 'Crime Analyst'] },
    { to: '/graph', label: 'Knowledge Graph', icon: Network },
    { to: '/analytics', label: 'Crime Analytics', icon: BarChart3 },
    { to: '/intelligence', label: 'Intelligence Center', icon: AlertOctagon },
    { to: '/settings', label: 'System Settings', icon: SettingsIcon, roles: ['Administrator'] },
  ];

  // Filter navItems based on user role
  const visibleItems = navItems.filter(item => {
    if (!item.roles) return true; // Visible to everyone
    if (!user) return false;
    return hasRole(item.roles);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-full select-none">
      <div className="flex flex-col">
        {/* Header Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <img src={kspLogo} alt="KSP Logo" className="h-9 w-9 rounded-lg object-contain bg-white/5 p-1 border border-slate-800" />
          <div>
            <h1 className="font-display font-bold text-lg leading-tight tracking-tight text-white">
              CrimeMind AI
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              KSP Agentic Copilot
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 border-l-2 border-blue-500'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer */}
      {user && (
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-3">
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-3 cursor-pointer p-1.5 -m-1.5 rounded-lg hover:bg-slate-800/40 transition-all"
              title="View Profile Dossier"
            >
              <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-500">
                {user.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-white truncate">
                  {user.username}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {user.role} | {user.police_id}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-2.5 w-full flex items-center justify-center space-x-1.5 py-1.5 bg-slate-800 hover:bg-red-600/20 hover:text-red-400 text-slate-400 text-[10px] font-semibold rounded-lg transition border border-slate-700 hover:border-red-500/30"
            >
              <LogOut className="h-3 w-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
