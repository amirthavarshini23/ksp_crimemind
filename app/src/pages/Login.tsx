import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Award, UserCheck } from 'lucide-react';
import kspLogo from '../assets/ksp_logo.png';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Investigator');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirection path after successful login
  const fromPath = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !role) {
      setError('Please fill in all credential fields.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      await login(email, password, role);
      navigate(fromPath, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (presetEmail: string, presetRole: string) => {
    setEmail(presetEmail);
    setPassword('password123');
    setRole(presetRole);
    setError(null);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("KSP Identity Recovery System: Please contact your district System Administrator or DIU team to reset credentials.");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 select-none font-sans relative overflow-hidden">
      {/* Decorative backdrop glow elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-slate-900/80 border border-slate-800/80 rounded-2xl shadow-xl shadow-slate-950/50 backdrop-blur-md relative z-10 space-y-6">
        
        {/* KSP Branding Header */}
        <div className="text-center space-y-3">
          <img 
            src={kspLogo} 
            alt="Karnataka State Police CrimeMind AI Logo" 
            className="h-28 w-28 mx-auto rounded-2xl object-contain drop-shadow-lg"
          />
          <h1 className="font-display font-bold text-2xl tracking-tight text-white">
            CrimeMind AI
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-center space-x-1">
            <Award className="h-3.5 w-3.5 text-blue-500/80" />
            <span>Karnataka State Police Access Portal</span>
          </p>
        </div>

        {/* Quick Officer Account Selector Presets */}
        <div className="space-y-1.5">
          <label className="text-[9px] text-slate-500 uppercase font-semibold tracking-wider block text-center">
            Quick Select Officer Profile
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handlePresetSelect('investigator.raj@ksp.gov.in', 'Investigator')}
              className={`p-2 rounded-xl border text-left transition ${
                email === 'investigator.raj@ksp.gov.in'
                  ? 'bg-blue-600/10 border-blue-500 text-white'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <p className="text-[10px] font-bold truncate">Insp. Rajkumar</p>
              <p className="text-[8px] opacity-75 truncate font-mono">Investigator</p>
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('supervisor.patil@ksp.gov.in', 'Supervisor')}
              className={`p-2 rounded-xl border text-left transition ${
                email === 'supervisor.patil@ksp.gov.in'
                  ? 'bg-amber-500/10 border-amber-500 text-white'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <p className="text-[10px] font-bold truncate">ACP Patil</p>
              <p className="text-[8px] opacity-75 truncate font-mono">Supervisor</p>
            </button>

            <button
              type="button"
              onClick={() => handlePresetSelect('analyst.swati@ksp.gov.in', 'Crime Analyst')}
              className={`p-2 rounded-xl border text-left transition ${
                email === 'analyst.swati@ksp.gov.in'
                  ? 'bg-emerald-500/10 border-emerald-500 text-white'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <p className="text-[10px] font-bold truncate">S. Deshpande</p>
              <p className="text-[8px] opacity-75 truncate font-mono">Crime Analyst</p>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="border border-red-500/20 bg-red-500/10 p-3.5 rounded-xl flex items-start space-x-2.5 text-red-400 text-xs">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Email field */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
              Police Officer Email ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. investigator.raj@ksp.gov.in"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
              Access Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Role Selection Dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
              Select Investigation Role Scope
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition [&>option]:bg-slate-950 [&>option]:text-slate-300"
            >
              <option value="Investigator">Investigator (Inspector Rajkumar)</option>
              <option value="Supervisor">Supervisor (ACP Patil)</option>
              <option value="Crime Analyst">Crime Analyst (Swati Deshpande)</option>
              <option value="Administrator">Administrator (SP Ramesh Kumar)</option>
            </select>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5 select-none">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-blue-500 h-3.5 w-3.5"
              />
              <span>Remember Officer Session</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-400 hover:underline focus:outline-none text-[10px]"
            >
              Forgot Credentials?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 text-white rounded-xl py-3 text-xs font-semibold tracking-wide transition duration-200 mt-1 flex items-center justify-center space-x-2 shadow-lg shadow-blue-900/30"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Authenticating Officer...</span>
              </>
            ) : (
              <>
                <UserCheck className="h-4 w-4" />
                <span>Authenticate & Enter Dashboard</span>
              </>
            )}
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center leading-relaxed max-w-xs mx-auto">
          Authorized KSP Personnel Only. Access attempts are audited under the Indian IT Act & Cyber Crime Directives.
        </p>

      </div>
    </div>
  );
};

export default Login;
