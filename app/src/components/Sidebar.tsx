import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Briefcase, 
  Network, 
  BarChart3, 
  AlertOctagon, 
  Settings as SettingsIcon,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { to: '/', label: 'AI Command Center', icon: LayoutDashboard },
    { to: '/chat', label: 'Intelligence Chat', icon: MessageSquare },
    { to: '/cases', label: 'Cases & Folders', icon: Briefcase },
    { to: '/graph', label: 'Knowledge Graph', icon: Network },
    { to: '/analytics', label: 'Crime Analytics', icon: BarChart3 },
    { to: '/intelligence', label: 'Intelligence Center', icon: AlertOctagon },
    { to: '/settings', label: 'System Settings', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-full select-none">
      <div className="flex flex-col">
        {/* Header Logo */}
        <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
          <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
          </div>
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
          {navItems.map((item) => {
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
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 m-4 rounded-xl border">
          <div className="flex items-center space-x-3">
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
        </div>
      )}
    </aside>
  );
};
export default Sidebar;
