import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Building,
  Shield,
  Key,
  Database,
  CheckCircle2,
  Lock,
  Save,
  GraduationCap,
  Wrench,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Role } from '../../types';

export const ProfileView: React.FC = () => {
  const { currentUser, switchDemoUser, allUsers, appMode, toggleAppMode } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!currentUser) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    currentUser.name = name;
    currentUser.department = department;
    currentUser.phone = phone;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const getRoleBadge = () => {
    switch (currentUser.role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-xs">
            <Shield className="w-3.5 h-3.5" /> Campus Administrator
          </span>
        );
      case 'TECHNICIAN':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
            <Wrench className="w-3.5 h-3.5" /> Maintenance Technician
          </span>
        );
      case 'STUDENT':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
            <GraduationCap className="w-3.5 h-3.5" /> Campus Student
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Credentials Profile</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review authenticated identity, contact details, role permissions, and environment modes.
          </p>
        </div>

        {/* Mode Pill Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAppMode}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border font-bold text-xs transition-all shadow-xs ${
              appMode === 'DEMO'
                ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            {appMode === 'DEMO' ? (
              <>
                <ToggleLeft className="w-5 h-5 text-amber-600" />
                <span>Demo Mode (Active)</span>
              </>
            ) : (
              <>
                <ToggleRight className="w-5 h-5 text-emerald-600" />
                <span>Production Mode (Active)</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card & Quick Switcher */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mx-auto shadow-xs">
              {currentUser.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.email}</p>
            </div>

            <div className="flex justify-center">{getRoleBadge()}</div>

            <div className="pt-4 border-t border-slate-100 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">College UID:</span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {currentUser.uid || 'STU-2026-0000'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Email Domain:</span>
                <span className="font-mono font-bold text-slate-800">@culkomail.in</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold text-slate-800">{currentUser.department || 'General'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Mode:</span>
                <span className={`font-bold ${appMode === 'DEMO' ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {appMode === 'DEMO' ? 'Demo Sandbox' : 'Production Enforced'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-400">Auth Status:</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active Session
                </span>
              </div>
            </div>
          </div>

          {/* Quick Role Switcher for Demonstration */}
          {appMode === 'DEMO' ? (
            <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">
                    Demo Role Switcher
                  </h3>
                </div>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  Testing
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Select a persona to test role-specific dashboards & permissions instantly:
              </p>

              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => switchDemoUser('STUDENT')}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors ${
                    currentUser.role === 'STUDENT'
                      ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div>Emily Watson (Student)</div>
                      <div className="text-[10px] text-slate-400 font-mono">STU-2026-1042</div>
                    </div>
                  </div>
                  {currentUser.role === 'STUDENT' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <button
                  onClick={() => switchDemoUser('TECHNICIAN')}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors ${
                    currentUser.role === 'TECHNICIAN'
                      ? 'bg-blue-500/30 text-blue-200 border border-blue-400/40'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-400" />
                    <div>
                      <div>Alex Miller (Technician)</div>
                      <div className="text-[10px] text-slate-400 font-mono">TECH-2025-014</div>
                    </div>
                  </div>
                  {currentUser.role === 'TECHNICIAN' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                </button>

                <button
                  onClick={() => switchDemoUser('ADMIN')}
                  className={`w-full p-2.5 rounded-xl text-xs font-bold text-left flex items-center justify-between transition-colors ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-purple-500/30 text-purple-200 border border-purple-400/40'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <div>
                      <div>Dr. Arthur Pendelton (Authority)</div>
                      <div className="text-[10px] text-slate-400 font-mono">ADM-2024-001</div>
                    </div>
                  </div>
                  {currentUser.role === 'ADMIN' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Production Mode Active</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                User role is strictly locked to your institutional record in the database. Role switching is disabled in Production Mode.
              </p>
            </div>
          )}
        </div>

        {/* Edit Details & Security Details (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          {/* Edit Details Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Personal Profile Details</span>
            </h3>

            {savedSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Profile changes updated successfully.
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Department / Branch</label>
                  <input
                    type="text"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Role Permissions Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Role Permissions & Access Rights ({currentUser.role})</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px]">
                    <th className="py-2 px-3">Module Feature</th>
                    <th className="py-2 px-3 text-center">Student</th>
                    <th className="py-2 px-3 text-center">Technician</th>
                    <th className="py-2 px-3 text-center">Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                  <tr>
                    <td className="py-2 px-3 font-medium">Create Complaints & Upload Proof</td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2 px-3 text-center text-slate-300">-</td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">View Own Complaints & Track Status</td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2 px-3 text-center text-slate-300">-</td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓ (All)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Close Resolved Ticket & Give Rating</td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2 px-3 text-center text-slate-300">-</td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Accept Assigned Jobs & Post Timeline Updates</td>
                    <td className="py-2 px-3 text-center text-slate-300">-</td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-2 px-3 text-center text-emerald-600 font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Assign Complaints & Manage Technicians</td>
                    <td className="py-2 px-3 text-center text-slate-300">-</td>
                    <td className="py-2 px-3 text-center text-slate-300">-</td>
                    <td className="py-2 px-3 text-center text-purple-600 font-bold">✓</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Category SLA Config & Audit Logs</td>
                    <td className="py-2 px-3 text-center text-slate-300">-</td>
                    <td className="py-2 px-3 text-center text-slate-300">-</td>
                    <td className="py-2 px-3 text-center text-purple-600 font-bold">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* MySQL & JWT Token Inspector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600" />
              <span>Backend Auth State (FastAPI + JWT + MySQL)</span>
            </h3>

            <p className="text-xs text-slate-500 leading-relaxed">
              In this production architecture, authentications issue an <code>HS256</code> signed JSON Web Token stored securely in authorization headers. Passwords in MySQL are hashed using <code>bcrypt</code> with salting.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-1.5 overflow-x-auto">
              <div className="text-slate-400">// Decoded JWT Payload Simulation</div>
              <div>{`{`}</div>
              <div className="pl-4"><span className="text-indigo-400">"sub"</span>: <span className="text-emerald-300">"{currentUser.email}"</span>,</div>
              <div className="pl-4"><span className="text-indigo-400">"user_id"</span>: <span className="text-amber-300">{currentUser.id}</span>,</div>
              <div className="pl-4"><span className="text-indigo-400">"role"</span>: <span className="text-emerald-300">"{currentUser.role}"</span>,</div>
              <div className="pl-4"><span className="text-indigo-400">"app_mode"</span>: <span className="text-emerald-300">"{appMode}"</span>,</div>
              <div className="pl-4"><span className="text-indigo-400">"name"</span>: <span className="text-emerald-300">"{currentUser.name}"</span>,</div>
              <div className="pl-4"><span className="text-indigo-400">"exp"</span>: <span className="text-amber-300">{Math.floor(Date.now() / 1000) + 86400}</span></div>
              <div>{`}`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
