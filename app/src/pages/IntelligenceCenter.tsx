import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  RefreshCw, 
  Shuffle, 
  Users, 
  ShieldAlert, 
  ListTodo, 
  Activity 
} from 'lucide-react';
import { api } from '../services/api';
import { IntelligenceCenterResponse } from '../types.ts';

export const IntelligenceCenter: React.FC = () => {
  const [intel, setIntel] = useState<IntelligenceCenterResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchIntel = async () => {
    setLoading(true);
    try {
      const res = await api.getIntelligenceCenter();
      setIntel(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntel();
  }, []);

  if (loading || !intel) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Fetching Command Intelligence...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto p-6 space-y-6 select-none">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Intelligence Center</h1>
          <p className="text-xs text-slate-400">Synthesized threat alerts, repeat offender tracking, and AI tactical action plans</p>
        </div>
        <button
          onClick={fetchIntel}
          className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition"
        >
          <RefreshCw className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Grid Layout for Intelligence panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Today's Alerts & Recent updates */}
        <div className="space-y-6">
          {/* Today's Crime Alerts */}
          <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <AlertOctagon className="h-4.5 w-4.5 text-red-500" />
              <span>Today's Tactical Alerts</span>
            </div>
            <div className="space-y-3.5">
              {intel.today_alerts.map((al, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg flex items-start space-x-3 text-xs">
                  <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${al.severity === 'High' ? 'bg-red-500 pulse-signal' : 'bg-amber-500'}`} />
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-500 font-semibold font-mono">{al.time}</span>
                    <p className="text-slate-300 leading-relaxed">{al.alert}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Updates */}
          <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <Activity className="h-4.5 w-4.5 text-blue-500" />
              <span>Log Updates</span>
            </div>
            <div className="space-y-3.5">
              {intel.recent_updates.map((up, idx) => (
                <div key={idx} className="text-xs space-y-0.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-550">
                    <span className="font-semibold">{up.title}</span>
                    <span>{up.timestamp}</span>
                  </div>
                  <p className="text-slate-400 leading-normal">{up.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Emerging patterns & organized crime alerts */}
        <div className="space-y-6">
          {/* Emerging Crime Patterns */}
          <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <Shuffle className="h-4.5 w-4.5 text-purple-500" />
              <span>Emerging Crime Patterns</span>
            </div>
            <div className="space-y-3.5">
              {intel.emerging_patterns.map((pat, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-850 p-3.5 rounded-lg space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{pat.pattern_name}</span>
                    <span className="text-[9px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1 py-0.2 rounded font-bold">
                      {pat.crimes_count} Cases
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 uppercase font-semibold">Active in: {pat.district}</p>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{pat.mo_description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Organized Crime Alerts */}
          <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <ShieldAlert className="h-4.5 w-4.5 text-red-500" />
              <span>Organized Crime Warnings</span>
            </div>
            <div className="space-y-3">
              {intel.organized_crime_alerts.map((org, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-slate-200 font-semibold">{org.gang_name}</span>
                    <p className="text-[10px] text-slate-500 leading-normal">Zone: {org.active_zone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold bg-red-600/10 border border-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                      Risk: {org.risk_score}
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">{org.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Recommendations & repeat offenders */}
        <div className="space-y-6">
          {/* Tactical Recommendations */}
          <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <ListTodo className="h-4.5 w-4.5 text-blue-500" />
              <span>Tactical Action Recommendations</span>
            </div>
            <div className="space-y-3">
              {intel.recommendations.map((rec, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 border-l-2 border-l-blue-500 p-3 rounded-lg text-xs leading-relaxed">
                  <p className="text-slate-300 font-semibold">{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Repeat Offenders */}
          <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <Users className="h-4.5 w-4.5 text-emerald-500" />
              <span>Active Repeat Offenders</span>
            </div>
            <div className="space-y-3.5">
              {intel.repeat_offenders.map((off, idx) => (
                <div key={idx} className="bg-slate-950/60 border border-slate-850 p-3 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <span className="text-white font-semibold">{off.name}</span>
                    <p className="text-[10px] text-slate-500 leading-normal">MO: {off.mo_style}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px]">
                      {off.cases_linked} Cases
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Status: {off.last_status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default IntelligenceCenter;
