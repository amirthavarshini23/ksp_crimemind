import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, AlertTriangle, ChevronRight, FolderPlus } from 'lucide-react';
import { api } from '../services/api';
import { CaseFolder } from '../types.ts';

export const Cases: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseFolder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await api.getCases();
        setCases(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (score >= 60) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Accessing Digital File Store...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Central Case Folders</h1>
          <p className="text-xs text-slate-400">Manage digital case dossiers, evidence timelines, and legal workflows</p>
        </div>
        <button
          onClick={() => alert("Creating a new case folder manually. Enter title...")}
          className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 border border-blue-500 text-white hover:bg-blue-500 rounded-lg text-xs font-semibold transition"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Case Folder</span>
        </button>
      </div>

      {/* Case cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((folder) => (
          <div 
            key={folder.rowid}
            className="border border-slate-800 bg-slate-900/35 hover:bg-slate-900/60 p-5 rounded-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all duration-200 cursor-pointer"
            onClick={() => navigate(`/cases/${folder.rowid}`)}
          >
            {/* Header info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4.5 w-4.5 text-blue-500" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    CASE ID: #{folder.rowid}
                  </span>
                </div>
                <div className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getRiskColor(folder.risk_score)}`}>
                  RISK: {folder.risk_score}
                </div>
              </div>
              <h2 className="font-display font-bold text-base text-white hover:text-blue-400 transition">
                {folder.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {folder.summary}
              </p>
            </div>

            {/* Footer metadata */}
            <div className="border-t border-slate-850 pt-3 flex items-center justify-between text-[10px]">
              <div className="text-slate-500 font-medium">
                Registered: <span className="text-slate-350">{String(folder.created_time).substring(0, 10)}</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400 font-semibold">
                <span>Open Dossier</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Cases;
