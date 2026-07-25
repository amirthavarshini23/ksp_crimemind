import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ShieldAlert, Award } from 'lucide-react';

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

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("KSP Identity Recovery System: Please contact your district System Administrator or DIU team to reset credentials.");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-950 select-none font-sans relative overflow-hidden">
      {/* Decorative backdrop glow elements */}
      <div className="absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-2xl backdrop-blur-md relative z-10 space-y-6">
        
        {/* KSP Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-blue-600/10 p-3 rounded-2xl border border-blue-500/20 text-blue-500 mb-2">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-white flex items-center justify-center space-x-1.5">
            <span>CrimeMind AI</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold flex items-center justify-center space-x-1">
            <Award className="h-3.5 w-3.5 text-blue-500/80" />
            <span>Karnataka State Police</span>
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="border border-red-500/20 bg-red-500/5 p-3.5 rounded-xl flex items-start space-x-2.5 text-red-400 text-xs">
            <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
              Officer Email ID
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. investigator.raj@ksp.gov.in"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
              Access Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
          </div>

          {/* Role Selection Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
              Select Investigation Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-3 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            >
              <option value="Investigator">Investigator (Rajkumar)</option>
              <option value="Supervisor">Supervisor (ACP Patil)</option>
              <option value="Crime Analyst">Crime Analyst (Swati Deshpande)</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 select-none">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-blue-500 focus:ring-blue-500 h-3.5 w-3.5"
              />
              <span>Remember Device</span>
            </label>
            <button
              onClick={handleForgotPassword}
              className="text-blue-400 hover:underline focus:outline-none"
            >
              Forgot Credentials?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800/50 text-white rounded-xl py-3.5 text-xs font-semibold tracking-wide transition duration-200 mt-2 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Securing Connection...</span>
              </>
            ) : (
              <span>Authenticate and Login</span>
            )}
          </button>
        </form>

        <p className="text-[10px] text-slate-600 text-center leading-relaxed max-w-xs mx-auto">
          Warning: Unauthorized access to the CrimeMind AI platform is strictly monitored and prosecuted under the Indian Information Technology Act.
        </p>

      </div>
    </div>
  );
};
export default Login;
