import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Shield,
  Wrench,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  BookOpen,
  Plus
} from 'lucide-react';

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onGoToLearning: () => void;
  onOpenReportComplaint?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onGoToRegister,
  onGoToLearning,
  onOpenReportComplaint
}) => {
  const { switchDemoUser } = useAuth();

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6">
      {/* Clean SaaS Hero Section */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-xs text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold mb-5">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Campus Grievance & Maintenance Management</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight max-w-2xl mx-auto leading-tight">
          Smart campus operations, incident triage, and fast maintenance dispatch.
        </h1>

        <p className="mt-3 text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Report facility issues, track maintenance orders in real time, and oversee campus infrastructure with role-based workflows for students, technicians, and administrators.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {onOpenReportComplaint && (
            <button
              id="hero-report-complaint-btn"
              onClick={onOpenReportComplaint}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <div className="w-4 h-4 rounded-md bg-white/20 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-white stroke-[3]" />
              </div>
              <span>Report Campus Complaint</span>
            </button>
          )}

          <button
            id="hero-student-demo-btn"
            onClick={() => switchDemoUser('STUDENT')}
            className="px-4.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Launch Student Portal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            id="hero-admin-demo-btn"
            onClick={() => switchDemoUser('ADMIN')}
            className="px-4.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold text-xs border border-slate-200 shadow-2xs transition-all flex items-center gap-2"
          >
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Admin Control Center</span>
          </button>

          <button
            id="hero-learning-btn"
            onClick={onGoToLearning}
            className="px-4.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-700 font-semibold text-xs border border-slate-200 shadow-2xs transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Help & Knowledge Base</span>
          </button>
        </div>
      </div>

      {/* 3 Role Experience Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Student Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 hover:border-slate-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Student Grievance Filing</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Submit hostel, lab, classroom, or WiFi issues with location and priority tags. Track progress in real time.
            </p>
          </div>
          <button
            onClick={() => switchDemoUser('STUDENT')}
            className="w-full py-2 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            <span>Try as Student (Emily)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Technician Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 hover:border-slate-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Field Service Technician</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              View assigned work orders, update status to In Progress, and record resolution diagnostic remarks.
            </p>
          </div>
          <button
            onClick={() => switchDemoUser('TECHNICIAN')}
            className="w-full py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-700 hover:text-blue-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            <span>Try as Technician (Alex)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Admin Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-4 hover:border-slate-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Campus Administrator</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Triage new tickets, dispatch technicians based on domain expertise, oversee SLA metrics, and manage user accounts.
            </p>
          </div>
          <button
            onClick={() => switchDemoUser('ADMIN')}
            className="w-full py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-800 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            <span>Try as Admin (Dr. Arthur)</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
