import React from 'react';
import { ShieldAlert, BookOpen, GitCommit, ListTodo } from 'lucide-react';
import { EvidenceUsed } from '../types.ts';

interface ExplainablePanelProps {
  confidence: number;
  evidenceUsed: EvidenceUsed[];
  reasoningPath: string[];
  recommendations: string[];
}

export const ExplainablePanel: React.FC<ExplainablePanelProps> = ({
  confidence,
  evidenceUsed,
  reasoningPath,
  recommendations
}) => {
  // Determine color theme for confidence score
  const getConfidenceColor = (val: number) => {
    if (val >= 0.85) return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
    if (val >= 0.65) return 'text-amber-500 border-amber-500/20 bg-amber-500/5';
    return 'text-red-500 border-red-500/20 bg-red-500/5';
  };

  return (
    <div className="w-80 border-l border-slate-800 bg-slate-900/40 flex flex-col p-4 overflow-y-auto space-y-5 h-full shrink-0 select-none">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        <ShieldAlert className="h-4.5 w-4.5 text-blue-500" />
        <h2 className="font-display font-semibold text-xs text-white uppercase tracking-wider">
          AI Intelligence Panel
        </h2>
      </div>

      {/* Confidence Score Widget */}
      <div className={`p-4 rounded-xl border ${getConfidenceColor(confidence)} flex items-center justify-between`}>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Grounded Confidence</span>
          <span className="text-xl font-bold font-display">{(confidence * 100).toFixed(0)}%</span>
        </div>
        <div className="text-[10px] text-slate-500 font-semibold max-w-[120px] text-right leading-tight">
          Score derived from semantic RAG index match.
        </div>
      </div>

      {/* Grounded Evidence List */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold">
          <BookOpen className="h-3.5 w-3.5 text-slate-500" />
          <span>Evidence Grounding</span>
        </div>
        <div className="space-y-1.5">
          {evidenceUsed.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic">No static records used for this response.</p>
          ) : (
            evidenceUsed.map((ev, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-850 p-2.5 rounded-lg text-[10px] leading-relaxed">
                <div className="flex justify-between items-center mb-1 font-semibold">
                  <span className="text-slate-300 truncate mr-2">{ev.fir_number}</span>
                  <span className="text-blue-500 shrink-0 text-[8px] bg-blue-600/10 border border-blue-500/20 px-1 py-0.2 rounded uppercase">
                    {ev.type}
                  </span>
                </div>
                <p className="text-slate-450">{ev.description}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reasoning Path Steps */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold">
          <GitCommit className="h-3.5 w-3.5 text-slate-500" />
          <span>Reasoning Agent Path</span>
        </div>
        <div className="relative pl-3 border-l border-slate-800 space-y-3">
          {reasoningPath.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic">Sequential path tracker not initialized.</p>
          ) : (
            reasoningPath.map((step, idx) => (
              <div key={idx} className="relative text-[10px] leading-normal text-slate-400">
                <span className="absolute -left-[16.5px] top-1 h-2 w-2 rounded-full bg-slate-800 border border-slate-650 inline-block" />
                {step}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Copilot Suggestions */}
      <div className="space-y-2">
        <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold">
          <ListTodo className="h-3.5 w-3.5 text-slate-500" />
          <span>Investigative Suggestions</span>
        </div>
        <div className="space-y-2">
          {recommendations.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic">No proactive guidelines computed.</p>
          ) : (
            recommendations.map((rec, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-[10px] leading-relaxed border-l-2 border-l-blue-500">
                <p className="text-slate-300 font-medium">
                  {rec}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default ExplainablePanel;
