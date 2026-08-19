import React, { useState } from 'react';
import { useAuth, INVALID_EMAIL_ERROR } from '../../context/AuthContext';
import {
  Lock,
  Mail,
  Shield,
  GraduationCap,
  Wrench,
  Sparkles,
  ArrowRight,
  Key,
  AlertCircle,
  BadgeCheck,
  CheckCircle2
} from 'lucide-react';

interface LoginPageProps {
  onSwitchToRegister: () => void;
  onContinueAsGuest?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSwitchToRegister }) => {
  const { login, switchDemoUser } = useAuth();

  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanUid = uid.trim().toUpperCase();

    if (!cleanEmail.endsWith('@culkomail.in')) {
      setError(INVALID_EMAIL_ERROR);
      return;
    }

    if (!cleanUid) {
      setError('Please enter your official College UID.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(cleanEmail, cleanUid, password);
      if (!res.success) {
        setError(res.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoUid: string) => {
    setEmail(demoEmail);
    setUid(demoUid);
    setPassword('••••••••');
    setError('');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5 py-6">
      {/* Header */}
      <div className="text-center space-y-1.5">
        <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">College User Authentication</h1>
        <p className="text-xs text-slate-500">
          Strictly authorized portal for college members with <span className="font-semibold text-indigo-600 font-mono">@culkomail.in</span>
        </p>
      </div>

      {/* Mandatory Domain Banner */}
      <div className="p-3 bg-indigo-50/80 border border-indigo-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-indigo-900">
        <Shield className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Official College Email & UID Mandatory:</span>
          <p className="text-[11px] text-indigo-700/90 mt-0.5">
            Only active university credentials ending with <strong className="font-mono text-indigo-900 font-bold">@culkomail.in</strong> and registered UIDs are permitted.
          </p>
        </div>
      </div>

      {/* Demo Quick Logins */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider text-[11px]">
          <span className="flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-indigo-600" />
            Quick Demo Logins
          </span>
          <span className="text-[10px] text-slate-400 font-normal">Auto-fills credentials</span>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              handleQuickFill('emily.student@culkomail.in', 'STU-2026-1042');
              switchDemoUser('STUDENT');
            }}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition-all text-center group"
          >
            <GraduationCap className="w-4 h-4 text-emerald-600 mx-auto mb-1 group-hover:scale-105 transition-transform" />
            <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-800">Student</div>
            <div className="text-[10px] text-slate-400 font-mono">STU-2026-1042</div>
          </button>

          <button
            type="button"
            onClick={() => {
              handleQuickFill('alex.tech@culkomail.in', 'TECH-2025-014');
              switchDemoUser('TECHNICIAN');
            }}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 transition-all text-center group"
          >
            <Wrench className="w-4 h-4 text-blue-600 mx-auto mb-1 group-hover:scale-105 transition-transform" />
            <div className="text-xs font-bold text-slate-800 group-hover:text-blue-800">Technician</div>
            <div className="text-[10px] text-slate-400 font-mono">TECH-2025-014</div>
          </button>

          <button
            type="button"
            onClick={() => {
              handleQuickFill('admin@culkomail.in', 'ADM-2024-001');
              switchDemoUser('ADMIN');
            }}
            className="p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/80 hover:border-indigo-200 transition-all text-center group"
          >
            <Shield className="w-4 h-4 text-indigo-600 mx-auto mb-1 group-hover:scale-105 transition-transform" />
            <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-800">Authority</div>
            <div className="text-[10px] text-slate-400 font-mono">ADM-2024-001</div>
          </button>
        </div>
      </div>

      {/* Traditional Form Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5.5 shadow-2xs space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 font-medium leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                College Email *
              </label>
              <span className="text-[10px] font-bold text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.5 rounded">
                @culkomail.in
              </span>
            </div>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                required
                type="email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="yourname@culkomail.in"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              College UID *
            </label>
            <div className="relative">
              <BadgeCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                required
                type="text"
                value={uid}
                onChange={e => {
                  setUid(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. STU-2026-1042, TECH-2025-014, ADM-2024-001"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400 font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5 text-[11px]">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your college password"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] mt-2"
          >
            {loading ? 'Authenticating UID...' : 'Sign In with College Credentials'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          New college student?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            Register Student Profile
          </button>
        </div>
      </div>
    </div>
  );
};
