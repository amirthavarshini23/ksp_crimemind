import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Briefcase, 
  FolderSearch, 
  ListTodo, 
  MessageSquareCode, 
  Scale, 
  Gauge, 
  Clock, 
  Plus, 
  Paperclip,
  CheckSquare,
  Square
} from 'lucide-react';
import { api } from '../services/api';
import { GraphViewer } from '../components/GraphViewer';
import { CaseFolderDetailResponse, CaseTask } from '../types.ts';

export const CaseFolderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const caseId = parseInt(id || '1');

  const [data, setData] = useState<CaseFolderDetailResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newNote, setNewNote] = useState<string>('');
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [submittingNote, setSubmittingNote] = useState<boolean>(false);
  const [activeTimelineTab, setActiveTimelineTab] = useState<'investigation' | 'evidence'>('investigation');

  const fetchDetail = async () => {
    try {
      const res = await api.getCaseDetail(caseId);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [caseId]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !data) return;
    setSubmittingNote(true);
    try {
      const added = await api.addCaseNote(caseId, newNote);
      setData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          notes: [added, ...prev.notes]
        };
      });
      setNewNote('');
    } catch (e) {
      console.error(e);
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleToggleTask = async (taskId: number) => {
    if (!data) return;
    // Optimistic UI update
    setData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.rowid === taskId ? { ...t, completed: !t.completed } : t)
      };
    });
    try {
      await api.toggleCaseTask(caseId, taskId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim() || !data) return;
    const mockNewTask: CaseTask = {
      rowid: Math.floor(Math.random() * 1000) + 10,
      case_folder_id: caseId,
      task: newTaskName,
      completed: false
    };
    setData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: [...prev.tasks, mockNewTask]
      };
    });
    setNewTaskName('');
  };

  const getConfidenceLevelText = (val: number) => {
    if (val >= 0.90) return 'High Certainty';
    if (val >= 0.70) return 'Moderate Grounds';
    return 'Weak Linkage';
  };

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Compiling Digital Case Dossier...
          </span>
        </div>
      </div>
    );
  }

  // Calculate task counts for progress
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex-1 bg-slate-950 overflow-hidden flex flex-col h-full">
      {/* Title Bar Header */}
      <div className="h-16 border-b border-slate-800 bg-slate-950/30 px-6 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/cases')}
            className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-blue-500" />
            <h1 className="font-display font-bold text-lg text-white">
              Dossier: {data.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            data.status === 'Active' ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {data.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Workspace Workspace Grid Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: AI Case Summary, Timelines, Similar Cases */}
        <div className="w-1/3 border-r border-slate-850 p-5 overflow-y-auto space-y-6 flex flex-col h-full shrink-0">
          
          {/* AI Case Summary */}
          <div className="bg-slate-900/30 border border-slate-800 p-4.5 rounded-xl space-y-2.5">
            <div className="flex items-center space-x-1.5 text-xs text-white font-semibold uppercase tracking-wider select-none">
              <MessageSquareCode className="h-4 w-4 text-blue-500" />
              <span>AI Case Summary</span>
            </div>
            <p className="text-xs text-slate-350 leading-relaxed font-sans">
              {data.summary}
            </p>
          </div>

          {/* Timeline Tabs */}
          <div className="border border-slate-800 p-4.5 rounded-xl space-y-4 flex-1 flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2.5 shrink-0 select-none">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTimelineTab('investigation')}
                  className={`text-xs font-semibold uppercase tracking-wider pb-1 transition ${
                    activeTimelineTab === 'investigation' ? 'text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Investigation Timeline
                </button>
                <button
                  onClick={() => setActiveTimelineTab('evidence')}
                  className={`text-xs font-semibold uppercase tracking-wider pb-1 transition ${
                    activeTimelineTab === 'evidence' ? 'text-white border-b-2 border-blue-500' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Evidence Timeline
                </button>
              </div>
              <Clock className="h-4 w-4 text-slate-600" />
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[350px]">
              {(activeTimelineTab === 'investigation' ? data.timeline : data.evidence_timeline).map((event) => (
                <div key={event.id} className="relative pl-4 border-l border-slate-850 space-y-0.5">
                  <span className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border border-slate-900 inline-block ${
                    event.type === 'FIR' ? 'bg-amber-500' :
                    event.type === 'Arrest' ? 'bg-red-500' :
                    event.type === 'Evidence' ? 'bg-purple-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-semibold font-mono">{event.date}</span>
                    <span className="text-slate-650 font-bold uppercase tracking-wider">{event.type}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-200">{event.title}</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed">{event.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Cases Finder */}
          <div className="bg-slate-900/10 border border-slate-800 p-4.5 rounded-xl space-y-3 select-none">
            <div className="flex items-center space-x-1.5 text-xs text-white font-semibold uppercase tracking-wider">
              <FolderSearch className="h-4 w-4 text-emerald-500" />
              <span>Similar Case Matches</span>
            </div>
            <div className="space-y-2">
              {data.related_cases.map((match, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 min-w-0 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-white font-bold truncate">{match.fir_number}</span>
                      <span className="text-[9px] text-emerald-400 font-semibold bg-emerald-500/10 px-1 py-0.2 rounded shrink-0">
                        {(match.similarity * 100).toFixed(0)}% Match
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate leading-relaxed">MO: {match.matching_mo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Full screen knowledge graph */}
        <div className="flex-1 p-5 flex flex-col space-y-3 h-full overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold select-none">
            <div className="flex items-center space-x-2">
              <Paperclip className="h-4 w-4 text-blue-500" />
              <span>Interactive Relationship Graph (Accused, phone records, bank cards)</span>
            </div>
            <span className="text-[10px] text-slate-500">Click nodes to inspect attributes</span>
          </div>
          <div className="flex-1 h-full">
            <GraphViewer elements={data.graph} />
          </div>
        </div>

        {/* Right Column: Notes, Tasks, Court, Progress */}
        <div className="w-1/3 border-l border-slate-850 p-5 overflow-y-auto space-y-6 flex flex-col h-full shrink-0">
          
          {/* Progress and Scores */}
          <div className="grid grid-cols-2 gap-4 shrink-0 select-none">
            {/* Court Status */}
            <div className="border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-1 text-[10px] text-slate-500 uppercase font-semibold">
                <Scale className="h-3.5 w-3.5" />
                <span>Court status</span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium leading-relaxed truncate">{data.court_status}</p>
            </div>

            {/* Evidence Confidence */}
            <div className="border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center space-x-1 text-[10px] text-slate-500 uppercase font-semibold">
                <Gauge className="h-3.5 w-3.5" />
                <span>Evidence confidence</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-white">{(data.evidence_confidence * 100).toFixed(0)}%</span>
                <span className="text-[9px] text-slate-400">{getConfidenceLevelText(data.evidence_confidence)}</span>
              </div>
            </div>
          </div>

          {/* Investigation Progress Tracker */}
          <div className="border border-slate-800 p-4 rounded-xl space-y-2.5 select-none shrink-0">
            <div className="flex justify-between items-center text-[10px] text-slate-500 uppercase font-semibold">
              <span>Investigation Progress</span>
              <span className="text-white font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-850 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>{completedTasks} of {totalTasks} checklist items completed</span>
            </div>
          </div>

          {/* Checklist Tasks */}
          <div className="border border-slate-800 p-4 rounded-xl flex flex-col min-h-[220px]">
            <div className="flex items-center space-x-1.5 text-xs text-white font-semibold uppercase tracking-wider pb-2 border-b border-slate-800 select-none">
              <ListTodo className="h-4 w-4 text-blue-500" />
              <span>Investigation Checklist</span>
            </div>
            
            {/* List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1">
              {data.tasks.map(t => (
                <div 
                  key={t.rowid} 
                  className="flex items-start space-x-2.5 cursor-pointer text-xs group"
                  onClick={() => handleToggleTask(t.rowid)}
                >
                  <button className="text-slate-500 group-hover:text-blue-400 mt-0.5">
                    {t.completed ? <CheckSquare className="h-4 w-4 text-blue-500" /> : <Square className="h-4 w-4" />}
                  </button>
                  <span className={`leading-tight ${t.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                    {t.task}
                  </span>
                </div>
              ))}
            </div>

            {/* Task Add Form */}
            <form onSubmit={handleAddTask} className="flex items-center space-x-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                value={newTaskName}
                onChange={e => setNewTaskName(e.target.value)}
                placeholder="Add checklist item..."
                className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-[11px] text-slate-350 focus:outline-none"
              />
              <button type="submit" className="p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">
                <Plus className="h-4.5 w-4.5" />
              </button>
            </form>
          </div>

          {/* Officer Notes Logger */}
          <div className="border border-slate-800 p-4 rounded-xl flex flex-col flex-1 min-h-[280px]">
            <div className="text-xs text-white font-semibold uppercase tracking-wider pb-2 border-b border-slate-800 select-none">
              Officer Notes
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto space-y-3 my-3 pr-1">
              {data.notes.length === 0 ? (
                <p className="text-[10px] text-slate-500 italic select-none">No investigation notes saved yet.</p>
              ) : (
                data.notes.map(note => (
                  <div key={note.rowid} className="bg-slate-950/40 border border-slate-850/50 p-2.5 rounded-lg text-[10px]">
                    <div className="flex justify-between text-slate-500 font-semibold mb-1">
                      <span>{note.username}</span>
                      <span className="font-mono">{note.created_time.substring(11, 16)}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{note.note_content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add note form */}
            <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-slate-800">
              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder="Log a new detail... AI will ingest this context during query runs."
                className="w-full h-16 bg-slate-950 border border-slate-850 rounded-lg p-2 text-[11px] text-slate-350 placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                disabled={submittingNote}
              />
              <button
                type="submit"
                disabled={!newNote.trim() || submittingNote}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-semibold rounded-lg text-xs transition duration-200"
              >
                {submittingNote ? 'Saving note...' : 'Save Note Details'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
export default CaseFolderDetail;
