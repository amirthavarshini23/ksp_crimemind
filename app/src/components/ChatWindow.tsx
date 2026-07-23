import React, { useEffect, useRef } from 'react';
import { 
  FolderOpen, 
  Network, 
  SearchCode, 
  FileDown, 
  MapPin, 
  Activity, 
  Bot, 
  User 
} from 'lucide-react';
import { ChatMessage } from '../types.ts';

interface ChatWindowProps {
  messages: ChatMessage[];
  loading: boolean;
  onQuickAction: (actionType: string, message: ChatMessage) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, loading, onQuickAction }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const quickActions = [
    { type: 'open_folder', label: 'Open Case Folder', icon: FolderOpen },
    { type: 'view_graph', label: 'View Graph', icon: Network },
    { type: 'similar_cases', label: 'Find Similar', icon: SearchCode },
    { type: 'export_pdf', label: 'Export PDF', icon: FileDown },
    { type: 'view_hotspots', label: 'Hotspots', icon: MapPin },
    { type: 'analyze_pattern', label: 'Analyze Pattern', icon: Activity }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3">
          <Bot className="h-10 w-10 text-slate-600" />
          <div className="text-center">
            <h3 className="font-semibold text-slate-400">Agentic Crime Intelligence</h3>
            <p className="text-xs max-w-sm mt-1 leading-relaxed">
              Enter queries in English or Kannada. CrimeMind AI will semantic search records and resolve coordinates, suspect logs, and next steps.
            </p>
          </div>
        </div>
      ) : (
        messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div key={msg.id} className={`flex space-x-3.5 ${isAI ? '' : 'justify-end'}`}>
              {/* Avatar Icon */}
              {isAI && (
                <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Bot className="h-4.5 w-4.5 text-blue-400" />
                </div>
              )}

              {/* Message Content Bubble */}
              <div className="flex flex-col space-y-2 max-w-[70%]">
                <div className={`p-4 rounded-xl border text-sm leading-relaxed ${
                  isAI
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-blue-600 text-white border-blue-500 font-medium'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Quick actions panel underneath AI messages */}
                {isAI && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {quickActions.map((act) => {
                      const Icon = act.icon;
                      return (
                        <button
                          key={act.type}
                          onClick={() => onQuickAction(act.type, msg)}
                          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 hover:bg-slate-800 text-[10px] font-semibold text-slate-400 hover:text-white transition duration-200"
                        >
                          <Icon className="h-3 w-3" />
                          <span>{act.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {!isAI && (
                <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                  <User className="h-4.5 w-4.5 text-slate-400" />
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Reasoning Loading Skeletons */}
      {loading && (
        <div className="flex space-x-3.5">
          <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
            <Bot className="h-4.5 w-4.5 text-blue-400" />
          </div>
          <div className="space-y-2 w-1/2">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center space-x-3">
              {/* Spinning status icon */}
              <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider animate-pulse">
                Orchestrating Agents (Planner, Search, Copilot)...
              </span>
            </div>
            <div className="h-3 bg-slate-800 rounded w-full animate-pulse" />
            <div className="h-3 bg-slate-800 rounded w-5/6 animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatWindow;
