import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  MessageSquare,
  ListChecks,
  Activity,
  Briefcase,
  ChevronRight,
  Radio,
  Shield,
  Clock,
  FileText,
  User
} from 'lucide-react';
import { api } from '../services/api';
import { WorkspaceChat } from '../components/WorkspaceChat';
import { TaskBoard } from '../components/TaskBoard';
import { CaseFolder, TeamMember } from '../types.ts';

type TabKey = 'discussion' | 'tasks' | 'activity';

export const InvestigationCollaboration: React.FC = () => {

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [cases, setCases] = useState<CaseFolder[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('discussion');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);

  // Load cases
  useEffect(() => {
    const loadCases = async () => {
      setLoadingCases(true);
      const data = await api.getCases();
      setCases(data);
      // Check if a case ID is in the URL search params
      const paramCaseId = searchParams.get('case');
      if (paramCaseId) {
        setSelectedCaseId(parseInt(paramCaseId));
      } else if (data.length > 0) {
        setSelectedCaseId(data[0].rowid);
      }
      setLoadingCases(false);
    };
    loadCases();
  }, []);

  // Load workspace data when case changes
  useEffect(() => {
    if (!selectedCaseId) return;
    const loadWorkspaceData = async () => {
      setLoadingFeed(true);
      const [mems, feed] = await Promise.all([
        api.getWorkspaceMembers(selectedCaseId),
        api.getWorkspaceFeed(selectedCaseId),
      ]);
      setMembers(mems);
      setActivityFeed(feed);
      setLoadingFeed(false);
    };
    loadWorkspaceData();
  }, [selectedCaseId]);

  const handleCaseSelect = (caseId: number) => {
    setSelectedCaseId(caseId);
    setSearchParams({ case: String(caseId) });
  };

  const selectedCase = cases.find(c => c.rowid === selectedCaseId);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'CASE_ASSIGNED': return <Shield className="h-3.5 w-3.5 text-blue-400" />;
      case 'EVIDENCE_UPLOAD': return <FileText className="h-3.5 w-3.5 text-purple-400" />;
      case 'NOTE_ADDED': return <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />;
      case 'TASK_COMPLETED': return <ListChecks className="h-3.5 w-3.5 text-amber-400" />;
      default: return <Activity className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  const formatTimeAgo = (isoStr: string) => {
    const diff = Date.now() - new Date(isoStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'discussion', label: 'Team Discussion', icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { key: 'tasks', label: 'Task Board', icon: <ListChecks className="h-3.5 w-3.5" /> },
    { key: 'activity', label: 'Activity Feed', icon: <Activity className="h-3.5 w-3.5" /> },
  ];

  const getInitials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  if (loadingCases) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-500">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] uppercase tracking-wider font-semibold">Loading workspaces...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-slate-950 overflow-hidden h-full">
      {/* Left Sidebar: Case Selection */}
      <div className="w-72 border-r border-slate-800 flex flex-col h-full shrink-0">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 select-none">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-600/10 p-2 rounded-lg border border-purple-500/20">
              <Users className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Collaboration</h2>
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Investigation Workspaces</p>
            </div>
          </div>
        </div>

        {/* Case List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cases.length === 0 ? (
            <div className="text-center py-10 text-slate-600 text-xs italic select-none">
              No active case folders found.
            </div>
          ) : (
            cases.map(c => (
              <button
                key={c.rowid}
                onClick={() => handleCaseSelect(c.rowid)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 group ${
                  selectedCaseId === c.rowid
                    ? 'bg-blue-600/10 border border-blue-500/30'
                    : 'border border-transparent hover:bg-slate-800/40 hover:border-slate-700/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Briefcase className={`h-4 w-4 shrink-0 ${
                      selectedCaseId === c.rowid ? 'text-blue-400' : 'text-slate-500'
                    }`} />
                    <div className="min-w-0">
                      <h4 className={`text-xs font-semibold truncate ${
                        selectedCaseId === c.rowid ? 'text-white' : 'text-slate-300'
                      }`}>
                        {c.title}
                      </h4>
                      <p className="text-[9px] text-slate-500 truncate mt-0.5">
                        {c.summary.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`h-3.5 w-3.5 shrink-0 mt-0.5 transition ${
                    selectedCaseId === c.rowid ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'
                  }`} />
                </div>
                <div className="flex items-center justify-between mt-2 text-[9px]">
                  <span className={`px-1.5 py-0.5 rounded font-bold ${
                    c.status === 'Active'
                      ? 'bg-blue-500/10 text-blue-400'
                      : c.status === 'Solved'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-slate-700/30 text-slate-400'
                  }`}>
                    {c.status}
                  </span>
                  <span className="text-slate-500 font-mono">Risk: {c.risk_score}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Team Members Panel */}
        {selectedCaseId && (
          <div className="p-3 border-t border-slate-800 select-none">
            <div className="flex items-center space-x-1 text-[9px] text-slate-500 uppercase tracking-wider font-semibold mb-2">
              <Radio className="h-3 w-3" />
              <span>Case Team</span>
            </div>
            <div className="space-y-1.5">
              {members.map(m => (
                <div key={m.user_id} className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-slate-800/30 transition">
                  <div className="relative">
                    <div className="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[8px] font-bold text-blue-400">
                      {getInitials(m.name)}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 ${
                      m.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-600'
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold text-slate-300 truncate">{m.name}</p>
                    <p className="text-[8px] text-slate-500">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedCase ? (
          <>
            {/* Case Header Bar */}
            <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <div>
                  <h2 className="text-sm font-bold text-white">{selectedCase.title}</h2>
                  <p className="text-[9px] text-slate-500">Workspace ID: CF-{selectedCase.rowid} · Created: {selectedCase.created_time.substring(0, 10)}</p>
                </div>
              </div>

              {/* Quick action: open in Case Folder detail */}
              <button
                onClick={() => navigate(`/cases/${selectedCase.rowid}`)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold rounded-lg border border-slate-700 transition"
              >
                <Briefcase className="h-3 w-3" />
                <span>Open Case Dossier</span>
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-5 border-b border-slate-800 flex items-center space-x-1 shrink-0 select-none">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center space-x-1.5 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition border-b-2 ${
                    activeTab === tab.key
                      ? 'text-white border-blue-500'
                      : 'text-slate-500 border-transparent hover:text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'discussion' && (
                <WorkspaceChat caseId={selectedCaseId!} caseTitle={selectedCase.title} />
              )}

              {activeTab === 'tasks' && (
                <TaskBoard caseId={selectedCaseId!} />
              )}

              {activeTab === 'activity' && (
                <div className="h-full overflow-y-auto p-5">
                  <div className="max-w-2xl mx-auto space-y-3">
                    <div className="flex items-center space-x-2 mb-4 select-none">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <h3 className="text-sm font-bold text-white">Activity Timeline</h3>
                      <span className="text-[9px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded font-semibold">
                        {activityFeed.length} events
                      </span>
                    </div>

                    {loadingFeed ? (
                      <div className="flex items-center justify-center py-10">
                        <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : activityFeed.length === 0 ? (
                      <div className="text-center py-12 text-slate-600 text-xs italic select-none">
                        No activity recorded yet for this workspace.
                      </div>
                    ) : (
                      activityFeed.map((event, idx) => (
                        <div
                          key={event.rowid || idx}
                          className="relative pl-8 pb-4 border-l border-slate-800 last:border-l-transparent"
                        >
                          {/* Timeline Dot */}
                          <div className="absolute -left-[9px] top-1 h-[18px] w-[18px] rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                            {getActivityIcon(event.activity_type)}
                          </div>

                          {/* Event Card */}
                          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <User className="h-3 w-3 text-slate-500" />
                                <span className="text-[10px] font-bold text-slate-300">{event.user_name}</span>
                                <span className="text-[9px] font-semibold text-blue-400/60 bg-blue-500/5 px-1.5 rounded">
                                  {event.activity_type.replace(/_/g, ' ')}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-[9px] text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimeAgo(event.created_time)}</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{event.description}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-600">
            <div className="text-center space-y-3 select-none">
              <Users className="h-12 w-12 mx-auto text-slate-700" />
              <h3 className="text-sm font-semibold text-slate-400">Select a Case Folder</h3>
              <p className="text-xs text-slate-600 max-w-xs">
                Choose an active investigation from the sidebar to access its collaboration workspace.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestigationCollaboration;
