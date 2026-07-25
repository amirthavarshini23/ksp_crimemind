import React, { useState } from 'react';
import { Save, Eye, EyeOff, Server, Key, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [backendUrl, setBackendUrl] = useState(
    localStorage.getItem('ksp_crimemind_backend_url') || 'http://localhost:8000'
  );
  const [geminiKey, setGeminiKey] = useState(
    localStorage.getItem('ksp_gemini_api_key') || ''
  );
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ksp_crimemind_backend_url', backendUrl);
    localStorage.setItem('ksp_gemini_api_key', geminiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex-1 bg-slate-950 overflow-y-auto p-6 space-y-6 select-none">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-2xl text-white">System Settings</h1>
        <p className="text-xs text-slate-400">Configure backend connection, Gemini AI, and user session preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* User Info */}
        {user && (
          <div className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-4">
            <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
              <User className="h-4 w-4 text-blue-500" />
              <span>Active Session</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {[
                { label: 'Officer Name', value: user.username },
                { label: 'Role', value: user.role },
                { label: 'Police ID', value: user.police_id },
                { label: 'Email', value: user.email },
              ].map((item) => (
                <div key={item.label} className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">{item.label}</span>
                  <p className="text-slate-200 font-medium font-mono">{item.value}</p>
                </div>
              ))}
            </div>
            <button
              onClick={logout}
              className="mt-2 px-4 py-2 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 rounded-lg text-xs font-semibold transition"
            >
              End Session & Logout
            </button>
          </div>
        )}

        {/* Backend Configuration */}
        <form onSubmit={handleSave} className="border border-slate-800 bg-slate-900/35 p-5 rounded-xl space-y-5">
          <div className="flex items-center space-x-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2.5">
            <Server className="h-4 w-4 text-emerald-500" />
            <span>Catalyst Backend Configuration</span>
          </div>

          {/* Backend URL */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block">
              Backend API URL (Catalyst Function Endpoint)
            </label>
            <input
              type="url"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="https://your-function.catalyst.zoho.com or http://localhost:8000"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
            />
            <p className="text-[10px] text-slate-600">
              For local development: http://localhost:8000 | For Catalyst deployment: use your function invocation URL
            </p>
          </div>

          {/* Gemini API Key */}
          <div className="space-y-2">
            <label className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider flex items-center space-x-1.5">
              <Key className="h-3 w-3" />
              <span>Gemini API Key</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIza..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 pr-10 text-xs text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-600">
              Your key is stored locally in browser storage and sent via X-Gemini-Key header. Never shared externally.
            </p>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-semibold transition duration-200 ${
              saved
                ? 'bg-emerald-600 border border-emerald-500 text-white'
                : 'bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white'
            }`}
          >
            <Save className="h-4 w-4" />
            <span>{saved ? 'Configuration Saved!' : 'Save Configuration'}</span>
          </button>
        </form>

        {/* Security Notice */}
        <div className="border border-amber-500/20 bg-amber-500/5 p-4 rounded-xl flex items-start space-x-3">
          <Shield className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs text-amber-400 font-semibold">Government Security Notice</p>
            <p className="text-[10px] text-amber-500/70 leading-relaxed">
              CrimeMind AI operates under Karnataka State Police data governance protocols. All AI-generated outputs are clearly labelled as investigative suggestions and must be verified by authorized personnel before operational use. Unauthorized access or data sharing is a criminal offence under the IT Act 2000.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Settings;
