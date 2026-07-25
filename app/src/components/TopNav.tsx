import React, { useState, useEffect } from 'react';
import { Search, Wifi, WifiOff, FileText, ExternalLink } from 'lucide-react';

import { NotificationBell } from './NotificationBell';

export const TopNav: React.FC = () => {

  const [online, setOnline] = useState<boolean>(true);

  useEffect(() => {
    // Ping API health status to update indicator
    const checkStatus = async () => {
      const backendUrl = localStorage.getItem('ksp_crimemind_backend_url') || import.meta.env.VITE_API_URL || 'http://localhost:8000';
      try {
        const res = await fetch(backendUrl);
        setOnline(res.ok);
      } catch (e) {
        setOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur px-6 flex items-center justify-between select-none shrink-0">
      {/* Search Input */}
      <div className="flex items-center space-x-4 flex-1 max-w-lg">
        <div className="relative w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Global Investigation Search (e.g. suspect name, license plate, phone...)"
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-10 pr-4 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Quick links & Status widgets */}
      <div className="flex items-center space-x-4">
        {/* API connection indicator */}
        <div className="flex items-center space-x-1.5 bg-slate-950/50 border border-slate-800/80 px-3 py-1 rounded-full">
          {online ? (
            <>
              <Wifi className="h-3 w-3 text-emerald-500" />
              <span className="text-[10px] text-slate-400 font-medium">Catalyst Server: Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-red-500 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-medium">Local Mock Engine Active</span>
            </>
          )}
        </div>

        {/* Action Brief button */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 border border-slate-800 px-3 py-1 rounded-lg bg-slate-850 hover:bg-slate-800 transition-all duration-200"
        >
          <FileText className="h-3.5 w-3.5" />
          <span>KSP Portal</span>
          <ExternalLink className="h-2.5 w-2.5" />
        </a>

        {/* Notifications */}
        <NotificationBell />
      </div>
    </header>
  );
};
export default TopNav;
