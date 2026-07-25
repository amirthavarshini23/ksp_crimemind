import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, MessageSquare, PlusCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { WorkspaceNotification } from '../types';
import { useAuth } from '../context/AuthContext';

export const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<WorkspaceNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (e) {}
  };

  // Poll notifications
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 12000);
    return () => clearInterval(interval);
  }, [user]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.rowid === id ? { ...n, is_read: true } : n));
    } catch (e) {}
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'MENTION':
        return <MessageSquare className="h-4 w-4 text-blue-400" />;
      case 'TASK_ASSIGNED':
        return <PlusCircle className="h-4 w-4 text-emerald-400" />;
      case 'ATTACHMENT_UPLOAD':
        return <Info className="h-4 w-4 text-purple-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative select-none font-sans" ref={dropdownRef}>
      
      {/* Bell Icon Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition focus:outline-none"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-slate-950 animate-pulse"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <span className="text-xs font-bold text-white tracking-wide uppercase">Investigation Notifications</span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={fetchNotifications}
                className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center space-x-1"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
              {unreadCount > 0 && (
                <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} New
                </span>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-[10px] text-slate-500">
                No active notifications found
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.rowid}
                  className={`p-3 text-[11px] flex items-start space-x-3 transition duration-150 ${
                    notif.is_read ? 'bg-transparent text-slate-400' : 'bg-blue-600/5 text-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0 bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1 space-y-1 min-w-0">
                    <p className="leading-normal font-medium">{notif.message}</p>
                    {notif.case_title && (
                      <p className="text-[9px] text-blue-500 font-semibold uppercase tracking-wider truncate">
                        {notif.case_title}
                      </p>
                    )}
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.rowid)}
                      className="shrink-0 p-1 bg-slate-950 hover:bg-blue-600/10 border border-slate-800 hover:border-blue-500/20 rounded-md text-slate-500 hover:text-blue-400 transition"
                      title="Mark as read"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
};
export default NotificationBell;
