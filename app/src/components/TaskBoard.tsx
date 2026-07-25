import React, { useState, useEffect } from 'react';
import {
  ListChecks,
  Plus,
  ChevronDown,
  User,
  CheckCircle2,
  Circle,
  Timer,
  CalendarClock,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { WorkspaceTask, TeamMember } from '../types.ts';

interface TaskBoardProps {
  caseId: number;
}

const COLUMNS: { key: WorkspaceTask['status']; label: string; color: string; icon: React.ReactNode }[] = [
  { key: 'Pending', label: 'Pending', color: 'amber', icon: <Circle className="h-3.5 w-3.5 text-amber-400" /> },
  { key: 'In Progress', label: 'In Progress', color: 'blue', icon: <Timer className="h-3.5 w-3.5 text-blue-400" /> },
  { key: 'Completed', label: 'Completed', color: 'emerald', icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> },
];

const PRIORITY_CONFIG: Record<string, { class: string; badge: string }> = {
  High: { class: 'border-red-500/30 bg-red-500/5', badge: 'bg-red-500/15 text-red-400' },
  Medium: { class: 'border-amber-500/20 bg-amber-500/5', badge: 'bg-amber-500/15 text-amber-400' },
  Low: { class: 'border-slate-700 bg-slate-800/30', badge: 'bg-slate-700/40 text-slate-400' },
};

export const TaskBoard: React.FC<TaskBoardProps> = ({ caseId }) => {

  const [tasks, setTasks] = useState<WorkspaceTask[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    task_title: '',
    description: '',
    assigned_officer_id: 0,
    priority: 'Medium',
    due_date: '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [tks, mems] = await Promise.all([
        api.getWorkspaceTasks(caseId),
        api.getWorkspaceMembers(caseId),
      ]);
      setTasks(tks);
      setMembers(mems);
      setLoading(false);
    };
    load();
  }, [caseId]);

  const handleStatusChange = async (task: WorkspaceTask, newStatus: WorkspaceTask['status']) => {
    // Optimistic UI
    setTasks(prev => prev.map(t => t.rowid === task.rowid ? { ...t, status: newStatus } : t));
    try {
      await api.updateWorkspaceTask(caseId, task.rowid, newStatus, task.priority);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.task_title.trim()) return;
    try {
      const added = await api.addWorkspaceTask(caseId, {
        task_title: newTask.task_title,
        description: newTask.description,
        assigned_officer_id: newTask.assigned_officer_id || undefined,
        priority: newTask.priority,
        due_date: newTask.due_date || new Date(Date.now() + 86400000 * 7).toISOString(),
      });
      setTasks(prev => [...prev, added]);
      setNewTask({ task_title: '', description: '', assigned_officer_id: 0, priority: 'Medium', due_date: '' });
      setShowAddForm(false);
    } catch (e) {
      console.error(e);
    }
  };

  const formatDueDate = (isoStr: string) => {
    const d = new Date(isoStr);
    const now = new Date();
    const diff = d.getTime() - now.getTime();
    const days = Math.ceil(diff / 86400000);
    if (days < 0) return { text: `${Math.abs(days)}d overdue`, overdue: true };
    if (days === 0) return { text: 'Due today', overdue: false };
    if (days === 1) return { text: 'Due tomorrow', overdue: false };
    return { text: `${days}d remaining`, overdue: false };
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="uppercase tracking-wider font-semibold text-[10px]">Loading task board...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-600/10 p-1.5 rounded-lg border border-emerald-500/20">
            <ListChecks className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white">Investigation Tasks</h3>
            <p className="text-[9px] text-slate-500">{completedTasks}/{totalTasks} completed · {progressPercent}%</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1 px-2.5 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/20 text-[10px] font-semibold transition"
        >
          <Plus className="h-3 w-3" />
          <span>New Task</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2 shrink-0">
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddForm && (
        <div className="mx-4 mb-3 bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-white select-none">
            <span>Create Investigation Task</span>
            <button onClick={() => setShowAddForm(false)} className="text-slate-500 hover:text-white transition">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleAddTask} className="space-y-2.5">
            <input
              type="text"
              value={newTask.task_title}
              onChange={e => setNewTask(prev => ({ ...prev, task_title: e.target.value }))}
              placeholder="Task title..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
              required
            />
            <textarea
              value={newTask.description}
              onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description (optional)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 h-14 resize-none"
            />
            <div className="grid grid-cols-3 gap-2">
              <select
                value={newTask.priority}
                onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="High">🔴 High Priority</option>
                <option value="Medium">🟡 Medium Priority</option>
                <option value="Low">🟢 Low Priority</option>
              </select>
              <select
                value={newTask.assigned_officer_id}
                onChange={e => setNewTask(prev => ({ ...prev, assigned_officer_id: parseInt(e.target.value) }))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value={0}>Unassigned</option>
                {members.map(m => (
                  <option key={m.user_id} value={m.user_id}>{m.name}</option>
                ))}
              </select>
              <input
                type="date"
                value={newTask.due_date ? newTask.due_date.substring(0, 10) : ''}
                onChange={e => setNewTask(prev => ({ ...prev, due_date: e.target.value }))}
                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[10px] text-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition"
            >
              Create Task
            </button>
          </form>
        </div>
      )}

      {/* Task Board Columns */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-4 pb-3">
        <div className="flex h-full space-x-3 min-w-[600px]">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.key);
            return (
              <div key={col.key} className="flex-1 flex flex-col min-w-0">
                {/* Column Header */}
                <div className="flex items-center justify-between py-2 px-2 select-none">
                  <div className="flex items-center space-x-1.5">
                    {col.icon}
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{col.label}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-${col.color}-500/10 text-${col.color}-400`}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {colTasks.length === 0 ? (
                    <div className="flex items-center justify-center h-20 border border-dashed border-slate-800 rounded-lg">
                      <span className="text-[9px] text-slate-600 italic">No tasks</span>
                    </div>
                  ) : (
                    colTasks.map(task => {
                      const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['Medium'];
                      const due = formatDueDate(task.due_date);

                      return (
                        <div
                          key={task.rowid}
                          className={`border rounded-xl p-3 space-y-2 transition-all hover:border-blue-500/30 cursor-default ${priorityCfg.class}`}
                        >
                          {/* Priority badge & title */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${priorityCfg.badge}`}>
                                {task.priority}
                              </span>
                              {/* Status change dropdown */}
                              <div className="relative group">
                                <button className="text-[9px] text-slate-500 hover:text-slate-300 flex items-center space-x-0.5 transition">
                                  <span>Move</span>
                                  <ChevronDown className="h-2.5 w-2.5" />
                                </button>
                                <div className="absolute right-0 top-4 hidden group-hover:block bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 w-28 overflow-hidden">
                                  {COLUMNS.filter(c => c.key !== task.status).map(c => (
                                    <button
                                      key={c.key}
                                      onClick={() => handleStatusChange(task, c.key)}
                                      className="w-full text-left px-2.5 py-1.5 text-[10px] text-slate-300 hover:bg-slate-700 flex items-center space-x-1.5 transition"
                                    >
                                      {c.icon}
                                      <span>{c.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <h4 className="text-xs font-semibold text-white leading-tight">
                              {task.task_title}
                            </h4>
                          </div>

                          {/* Description */}
                          {task.description && (
                            <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Footer: Assignee & Due */}
                          <div className="flex items-center justify-between text-[9px] text-slate-500">
                            <div className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span className="font-medium truncate max-w-[100px]">
                                {task.assigned_officer_name || 'Unassigned'}
                              </span>
                            </div>
                            <div className={`flex items-center space-x-1 ${due.overdue ? 'text-red-400' : ''}`}>
                              <CalendarClock className="h-3 w-3" />
                              <span className="font-medium">{due.text}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
