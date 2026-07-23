import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Users, 
  Activity, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { api } from '../services/api';
import { MapViewer } from '../components/MapViewer';
import { GraphViewer } from '../components/GraphViewer';
import { AnalyticsSummaryResponse } from '../types.ts';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AnalyticsSummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.getAnalytics();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleSelectCaseFromMap = (firId: number) => {
    // If id is linked to Mysuru gold robbery Pulsar Gang (fir 2/4/5), navigate to case 1
    // If linked to cyber (fir 1/6), navigate to case 2
    if ([2, 4, 5].includes(firId)) {
      navigate('/cases/1');
    } else {
      navigate('/cases/2');
    }
  };

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Loading AI Command Center...
          </span>
        </div>
      </div>
    );
  }

  // Sample static subgraph elements for mini view
  const miniGraphElements = {
    nodes: [
      { data: { id: "c1", label: "Pulsar Gang", type: "Folder" as const } },
      { data: { id: "f2", label: "FIR 102/2026", type: "FIR" as const } },
      { data: { id: "a2", label: "Basavaraj", type: "Accused" as const, details: { status: "Absconding", age: 34 } } }
    ],
    edges: [
      { data: { id: "e1", source: "a2", target: "f2", label: "Suspect" } }
    ]
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto p-6 space-y-6">
      {/* Title Header */}
      <div className="flex justify-between items-center select-none">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">AI Command Center</h1>
          <p className="text-xs text-slate-400">Real-time crime analysis and agentic situational overview for Karnataka State Police</p>
        </div>
        <button
          onClick={() => navigate('/intelligence')}
          className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600/10 border border-blue-500/20 text-blue-400 hover:text-white hover:bg-blue-600 rounded-lg text-xs font-semibold transition duration-200"
        >
          <span>Intelligence Center</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Aggregate metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 select-none">
        {[
          { label: 'Total Registered FIRs', value: data.total_firs, icon: FileText, color: 'text-blue-500 bg-blue-500/5 border-blue-500/10' },
          { label: 'Cases Pending Status', value: data.pending_firs, icon: Clock, color: 'text-amber-500 bg-amber-500/5 border-amber-500/10' },
          { label: 'Solved Investigations', value: data.solved_firs, icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' },
          { label: 'Repeat Offenders Flagged', value: data.repeat_offenders_count, icon: Users, color: 'text-red-500 bg-red-500/5 border-red-500/10' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`p-4 rounded-xl border ${stat.color} flex items-center justify-between`}>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{stat.label}</span>
                <p className="text-2xl font-bold font-display text-white">{stat.value}</p>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Workspace Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[480px]">
        {/* Large Hotspot Map */}
        <div className="lg:col-span-2 flex flex-col space-y-2 h-full">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold select-none">
            <Activity className="h-4 w-4 text-blue-500" />
            <span>Interactive Crime Hotspot Map (Karnataka State Police)</span>
          </div>
          <div className="flex-1 h-full">
            <MapViewer hotspots={data.hotspots} onSelectFir={handleSelectCaseFromMap} />
          </div>
        </div>

        {/* Live Subgraph Relationship Panel */}
        <div className="flex flex-col space-y-2 h-full">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold select-none">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            <span>Overlapping Entities Network</span>
          </div>
          <div className="flex-1 h-full">
            <GraphViewer elements={miniGraphElements} onSelectNode={(node) => handleSelectCaseFromMap(1)} />
          </div>
        </div>
      </div>

      {/* Bottom widgets: Alerts and Trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
        {/* Active Alerts */}
        <div className="md:col-span-2 border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs text-white font-semibold uppercase tracking-wider">Operational Alerts</span>
            <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded font-bold">2 CRITICAL</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 text-xs">
              <span className="h-2 w-2 rounded-full bg-red-500 mt-1.5 pulse-signal" />
              <div className="flex-1 space-y-0.5">
                <span className="text-slate-300 font-semibold">Mandya Toll ANPR Warning</span>
                <p className="text-slate-500">Black Pulsar motorcycle model associated with robbery spotted crossing Mandya city bounds. Local interceptors deployed.</p>
              </div>
              <span className="text-[10px] text-slate-600 font-medium">9 mins ago</span>
            </div>
            <div className="flex items-start space-x-3 text-xs">
              <span className="h-2 w-2 rounded-full bg-amber-500 mt-1.5" />
              <div className="flex-1 space-y-0.5">
                <span className="text-slate-300 font-semibold">Cyber vishing activity spike</span>
                <p className="text-slate-500">Multiple spoofing SBI KYC phone calls originating from RT Nagar cell tower cluster reported by citizens.</p>
              </div>
              <span className="text-[10px] text-slate-600 font-medium">1 hr ago</span>
            </div>
          </div>
        </div>

        {/* Quick statistics summary */}
        <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
          <div className="flex items-center space-x-1.5 text-xs text-white font-semibold uppercase tracking-wider border-b border-slate-800 pb-3">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span>District Status</span>
          </div>
          <div className="space-y-2.5">
            {Object.entries(data.district_distribution).map(([dist, count]) => (
              <div key={dist} className="text-xs flex items-center justify-between">
                <span className="text-slate-400">{dist}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full" 
                      style={{ width: `${(count / data.total_firs) * 100}%` }}
                    />
                  </div>
                  <span className="text-slate-200 font-semibold font-mono">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
