import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Paperclip,
  Bot,
  AtSign,
  Users,
  FileText
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { WorkspaceMessage, TeamMember } from '../types.ts';

interface WorkspaceChatProps {
  caseId: number;
  caseTitle: string;
}

export const WorkspaceChat: React.FC<WorkspaceChatProps> = ({ caseId, caseTitle: _caseTitle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<WorkspaceMessage[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [msgs, mems] = await Promise.all([
        api.getWorkspaceMessages(caseId),
        api.getWorkspaceMembers(caseId),
      ]);
      setMessages(msgs);
      setMembers(mems);
      setLoading(false);
      api.recordPresence(caseId);
    };
    load();
  }, [caseId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    const msg = await api.postWorkspaceMessage(caseId, input.trim());
    setMessages(prev => [...prev, msg]);
    setInput('');
    setSending(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === '@') {
      setShowMentions(true);
    }
  };

  const handleMentionSelect = (member: TeamMember) => {
    setInput(prev => prev + `@${member.name} `);
    setShowMentions(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await api.uploadWorkspaceAttachment(caseId, file);
    const attachMsg = await api.postWorkspaceMessage(caseId, `📎 Uploaded file: ${file.name}`);
    setMessages(prev => [...prev, attachMsg]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderMessageText = (text: string) => {
    // Highlight @mentions
    const parts = text.split(/(@\w[\w\s]*?)(?=\s|$|,|\.)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="text-blue-400 font-semibold bg-blue-500/10 px-1 rounded">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const formatTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Group messages by date
  const groupedMessages: { date: string; msgs: WorkspaceMessage[] }[] = [];
  messages.forEach(m => {
    const dateKey = formatDate(m.created_time);
    const existing = groupedMessages.find(g => g.date === dateKey);
    if (existing) existing.msgs.push(m);
    else groupedMessages.push({ date: dateKey, msgs: [m] });
  });

  const getRoleColor = (role: string) => {
    const r = role.toLowerCase();
    if (r.includes('super')) return 'text-amber-400';
    if (r.includes('analyst')) return 'text-emerald-400';
    if (r.includes('admin')) return 'text-red-400';
    return 'text-blue-400';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="uppercase tracking-wider font-semibold text-[10px]">Loading discussion...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600/10 p-1.5 rounded-lg border border-blue-500/20">
            <Users className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Team Discussion</h3>
            <p className="text-[9px] text-slate-500">{members.filter(m => m.status === 'Online').length} online · {members.length} members</p>
          </div>
        </div>
        <div className="flex items-center -space-x-2">
          {members.slice(0, 4).map(m => (
            <div
              key={m.user_id}
              title={`${m.name} (${m.role}) — ${m.status}`}
              className={`h-7 w-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px] font-bold ${
                m.status === 'Online' ? 'bg-blue-600/20 text-blue-400' : 'bg-slate-800 text-slate-500'
              }`}
            >
              {getInitials(m.name)}
            </div>
          ))}
          {members.length > 4 && (
            <div className="h-7 w-7 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[9px] text-slate-400 font-bold">
              +{members.length - 4}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {groupedMessages.map(group => (
          <div key={group.date}>
            {/* Date Separator */}
            <div className="flex items-center space-x-3 my-3 select-none">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-[9px] text-slate-500 font-semibold uppercase tracking-widest">{group.date}</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Messages */}
            {group.msgs.map(msg => {
              const isOwn = user?.rowid === msg.sender_id;
              const isSharedAi = !!msg.shared_chat_id;

              return (
                <div key={msg.rowid} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2.5`}>
                  <div className={`max-w-[80%] flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                    {/* Avatar */}
                    {!isOwn && (
                      <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[9px] font-bold text-blue-400 shrink-0 mr-2">
                        {getInitials(msg.sender_name)}
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`rounded-xl px-3.5 py-2.5 ${
                      isOwn
                        ? 'bg-blue-600/15 border border-blue-500/20'
                        : isSharedAi
                        ? 'bg-purple-600/10 border border-purple-500/20'
                        : 'bg-slate-800/60 border border-slate-750'
                    }`}>
                      {!isOwn && (
                        <div className="flex items-center space-x-1.5 mb-1">
                          <span className="text-[10px] font-bold text-white">{msg.sender_name}</span>
                          <span className={`text-[9px] font-semibold ${getRoleColor(msg.sender_role)}`}>
                            {msg.sender_role}
                          </span>
                        </div>
                      )}

                      {isSharedAi && (
                        <div className="flex items-center space-x-1 mb-1.5 text-purple-400">
                          <Bot className="h-3 w-3" />
                          <span className="text-[9px] font-semibold uppercase tracking-wider">Shared AI Insight</span>
                        </div>
                      )}

                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {renderMessageText(msg.message_text)}
                      </p>

                      {msg.has_attachment && (
                        <div className="mt-1.5 flex items-center space-x-1 text-[9px] text-blue-400 bg-blue-500/5 px-2 py-1 rounded-md">
                          <FileText className="h-3 w-3" />
                          <span>Attachment</span>
                        </div>
                      )}

                      <span className="text-[9px] text-slate-500 mt-1 block text-right">
                        {formatTime(msg.created_time)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* @Mention Popup */}
      {showMentions && (
        <div className="mx-4 mb-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden">
          <div className="px-3 py-1.5 border-b border-slate-700 text-[9px] text-slate-400 uppercase tracking-wider font-semibold select-none">
            Mention a team member
          </div>
          {members.map(m => (
            <button
              key={m.user_id}
              onClick={() => handleMentionSelect(m)}
              className="w-full text-left px-3 py-2 hover:bg-slate-700/60 text-xs text-slate-300 flex items-center space-x-2 transition"
            >
              <AtSign className="h-3 w-3 text-blue-400" />
              <span className="font-semibold">{m.name}</span>
              <span className="text-[9px] text-slate-500">({m.role})</span>
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-slate-800 shrink-0">
        <div className="flex items-center space-x-2 bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-1.5">
          {/* Attachment Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-slate-500 hover:text-blue-400 transition"
            title="Attach file"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.csv"
          />

          {/* Mention Button */}
          <button
            onClick={() => setShowMentions(!showMentions)}
            className="p-1.5 text-slate-500 hover:text-blue-400 transition"
            title="Mention team member"
          >
            <AtSign className="h-4 w-4" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowMentions(false)}
            placeholder="Type a message to the investigation team..."
            className="flex-1 bg-transparent text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
            disabled={sending}
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceChat;
