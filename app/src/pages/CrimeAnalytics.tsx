import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  CartesianGrid, 
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, Compass, Grid } from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsSummaryResponse } from '../types.ts';

export const CrimeAnalytics: React.FC = () => {
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

  if (loading || !data) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Compiling Crime statistics...
          </span>
        </div>
      </div>
    );
  }

  // Format distributions for recharts
  const typeData = Object.entries(data.crime_type_distribution).map(([name, value]) => ({ name, value }));
  const districtData = Object.entries(data.district_distribution).map(([name, value]) => ({ name, value }));

  const BAR_COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#EC4899', '#F59E0B'];

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">Crime Analytics Dashboard</h1>
        <p className="text-xs text-slate-400">Statistical evaluations, hotspot frequencies, and pattern metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Crime trend line chart */}
        <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider">
            <TrendingUp className="h-4.5 w-4.5 text-blue-500" />
            <span>Monthly Crime Trends (KSP)</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthly_trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#F3F4F6', fontSize: '11px' }} 
                />
                <Line type="monotone" dataKey="crimes" name="Reported" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="solved" name="Solved" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crime Type distribution */}
        <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider">
            <BarChart3 className="h-4.5 w-4.5 text-emerald-500" />
            <span>Distribution by Crime Type</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#F3F4F6', fontSize: '11px' }} 
                />
                <Bar dataKey="value" name="Incidents" radius={[4, 4, 0, 0]}>
                  {typeData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Breakdown */}
        <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider">
            <Compass className="h-4.5 w-4.5 text-amber-500" />
            <span>District-wise Analysis</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={districtData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#F3F4F6', fontSize: '11px' }} 
                />
                <Bar dataKey="value" name="FIRs" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hour Heatmap Grid */}
        <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider">
            <Grid className="h-4.5 w-4.5 text-purple-500" />
            <span>Active Incident Hours (Temporal Heatmap)</span>
          </div>
          <div className="grid grid-cols-6 gap-2 pt-2">
            {[
              { label: '00:00 - 04:00', load: 'Low', color: 'bg-slate-950/80 border border-slate-850 text-slate-500' },
              { label: '04:00 - 08:00', load: 'Low', color: 'bg-slate-950/80 border border-slate-850 text-slate-500' },
              { label: '08:00 - 12:00', load: 'High', color: 'bg-blue-600/20 border border-blue-500/30 text-blue-400 font-semibold glow-blue' },
              { label: '12:00 - 16:00', load: 'Critical', color: 'bg-red-500/20 border border-red-500/30 text-red-400 font-semibold glow-red pulse-signal' },
              { label: '16:00 - 20:00', load: 'Medium', color: 'bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold' },
              { label: '20:00 - 00:00', load: 'Medium', color: 'bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold' }
            ].map((cell, idx) => (
              <div key={idx} className={`p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-1 ${cell.color}`}>
                <span className="text-[9px] uppercase tracking-wider">{cell.label}</span>
                <span className="text-xs font-bold">{cell.load}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 leading-normal">
            * Temporal hotspots isolated: Daylight chain-snatching peaks in afternoon (12:00 - 16:00) hours. Cyber OTP vishing scams peak in morning (08:00 - 12:00).
          </p>
        </div>

      </div>
    </div>
  );
};
export default CrimeAnalytics;
