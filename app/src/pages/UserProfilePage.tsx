import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  Award,
  Building2,
  MapPin,
  Key,
  Shield,
  Clock,
  Briefcase,
  ListTodo,
  FileText,
  LogOut,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-500">
        <p>No active officer session found.</p>
      </div>
    );
  }

  const getOfficerRank = (role: string) => {
    switch (role) {
      case 'Supervisor': return 'Assistant Commissioner of Police (ACP)';
      case 'Crime Analyst':
      case 'Analyst': return 'Senior Crime Intelligence Analyst';
      case 'Administrator': return 'Superintendent of Police (SP)';
      default: return 'Police Sub-Inspector (PSI)';
    }
  };

  const getOfficerStation = (role: string) => {
    switch (role) {
      case 'Supervisor': return 'Mysuru City Central Command';
      case 'Crime Analyst':
      case 'Analyst': return 'State Cyber Crime Centre, Bengaluru';
      case 'Administrator': return 'KSP Headquarters, Bengaluru';
      default: return 'Cyber Crime PS / Devaraja PS';
    }
  };

  const getOfficerDistrict = (role: string) => {
    switch (role) {
      case 'Supervisor': return 'Mysuru City';
      case 'Crime Analyst':
      case 'Analyst': return 'Bengaluru City';
      case 'Administrator': return 'State Headquarters';
      default: return 'Bengaluru City / Mysuru City';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto p-6 space-y-6">
      {/* Top Header / Back Button */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
            title="Return to Dashboard"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center space-x-2">
              <UserCheck className="h-6 w-6 text-blue-500" />
              <span>Police Officer Account Dossier</span>
            </h1>
            <p className="text-xs text-slate-500">
              Karnataka State Police Identity & Authentication Record
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-900/30 rounded-xl text-xs font-semibold transition"
        >
          <LogOut className="h-4 w-4" />
          <span>Terminate Session</span>
        </button>
      </div>

      {/* Main Profile Hero Banner */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur">
        <div className="absolute -right-10 -bottom-10 h-48 w-48 bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          {/* Avatar & Basic Identity */}
          <div className="flex items-center space-x-5">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl bg-blue-950 border-2 border-blue-500/40 flex items-center justify-center font-display font-bold text-3xl text-blue-500 shadow-xl">
                {user.username.substring(0, 2).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">{user.username}</h2>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Police ID: <span className="text-blue-400 font-semibold">{user.police_id}</span>
              </p>
              <p className="text-xs text-slate-550 font-sans">
                {getOfficerRank(user.role)} · {getOfficerStation(user.role)}
              </p>
            </div>
          </div>

          {/* Security Status Badge */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-2 min-w-[220px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="font-semibold text-white">Status: Active</span>
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded font-bold">
                Verified
              </span>
            </div>
            <div className="text-[11px] text-slate-500 space-y-1 font-mono">
              <p>KGID: KGID-2015-KSP-884</p>
              <p>Clearance: Level 4 (Top Secret)</p>
            </div>
          </div>

        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Official Identity & Contact */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Shield className="h-4.5 w-4.5 text-blue-500" />
            <span>Official Identity & Contact</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center space-x-2">
                <Award className="h-4 w-4 text-slate-550" />
                <span>Full Name</span>
              </span>
              <span className="text-white font-semibold">{user.username}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center space-x-2">
                <Mail className="h-4 w-4 text-slate-550" />
                <span>KSP Email ID</span>
              </span>
              <span className="text-slate-300 font-mono">{user.email}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center space-x-2">
                <Key className="h-4 w-4 text-slate-550" />
                <span>Police ID Number</span>
              </span>
              <span className="text-blue-400 font-mono font-bold">{user.police_id}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center space-x-2">
                <Phone className="h-4 w-4 text-slate-550" />
                <span>Duty Handset</span>
              </span>
              <span className="text-slate-300 font-mono">+91 94808 01000</span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400 flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-550" />
                <span>Account Provisioned</span>
              </span>
              <span className="text-slate-500 font-mono">
                {user.created_time.substring(0, 10)}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Jurisdiction & Command Posting */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center space-x-2 text-sm font-bold text-white border-b border-slate-800 pb-3">
            <Building2 className="h-4.5 w-4.5 text-emerald-500" />
            <span>Jurisdiction & Command Posting</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center space-x-2">
                <Award className="h-4 w-4 text-slate-550" />
                <span>Assigned Rank</span>
              </span>
              <span className="text-white font-semibold">{getOfficerRank(user.role)}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-slate-550" />
                <span>Police Unit / Station</span>
              </span>
              <span className="text-slate-300 font-semibold">{getOfficerStation(user.role)}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-slate-550" />
                <span>District Command</span>
              </span>
              <span className="text-slate-300 font-semibold">{getOfficerDistrict(user.role)}</span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
              <span className="text-slate-400 flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-slate-550" />
                <span>State Cadre</span>
              </span>
              <span className="text-slate-300">Karnataka State Police (KSP)</span>
            </div>

            <div className="flex justify-between items-center py-1.5">
              <span className="text-slate-400 flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-slate-550" />
                <span>Duty Status</span>
              </span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px]">
                ON ACTIVE DUTY
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Statistics Banner */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 text-blue-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">6</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Active Case Workspaces</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-400">
            <ListTodo className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">18</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Investigation Tasks</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex items-center space-x-4">
          <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-200/25 text-purple-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">15</p>
            <p className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Logged Officer Notes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
