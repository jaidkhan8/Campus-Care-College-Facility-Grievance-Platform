import React from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  Wrench,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Zap,
  Wifi,
  Monitor,
  Home,
  BookOpen,
  Sparkles,
  Bus,
  HelpCircle,
  Users,
  FileText
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (tab: string) => void;
  onSelectComplaint?: (complaintId: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { complaints, stats, categories } = useComplaints();

  const urgentComplaints = complaints.filter(
    c => c.priority === 'HIGH' && c.status !== 'RESOLVED'
  );

  const pendingTriage = complaints.filter(c => c.status === 'PENDING');

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'electrical': return <Zap className="w-3.5 h-3.5 text-amber-600" />;
      case 'internet/wifi': return <Wifi className="w-3.5 h-3.5 text-blue-600" />;
      case 'classroom': return <Monitor className="w-3.5 h-3.5 text-indigo-600" />;
      case 'hostel': return <Home className="w-3.5 h-3.5 text-emerald-600" />;
      case 'library': return <BookOpen className="w-3.5 h-3.5 text-purple-600" />;
      case 'cleaning': return <Sparkles className="w-3.5 h-3.5 text-cyan-600" />;
      case 'transport': return <Bus className="w-3.5 h-3.5 text-orange-600" />;
      default: return <HelpCircle className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Top Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Campus Triage & Operations Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time breakdown of campus infrastructure complaints, technician dispatching, and resolution rates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="admin-view-technicians-btn"
            onClick={() => onNavigate('admin-users')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>Technicians</span>
          </button>

          <button
            id="admin-manage-all-btn"
            onClick={() => onNavigate('admin-complaints')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-[0.98]"
          >
            <span>Manage All Tickets ({stats.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4 Clean Statistics Cards in One Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Complaints */}
        <div 
          onClick={() => onNavigate('admin-complaints')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Complaints
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {stats.total}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            All registered campus tickets
          </p>
        </div>

        {/* Pending Triage */}
        <div 
          onClick={() => onNavigate('admin-complaints')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {stats.pending}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Awaiting triage & technician assignment
          </p>
        </div>

        {/* In Progress */}
        <div 
          onClick={() => onNavigate('admin-complaints')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {stats.inProgress + stats.assigned}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Under active technician maintenance
          </p>
        </div>

        {/* Resolved */}
        <div 
          onClick={() => onNavigate('admin-complaints')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Resolved
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {stats.resolved}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {resolutionRate}% resolution success rate
          </p>
        </div>

      </div>

      {/* Two Column Layout: Urgent Triage Queue & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Triage Queue (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pending Triage Queue ({pendingTriage.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('admin-complaints')}
                className="text-xs text-indigo-600 font-semibold hover:text-indigo-700"
              >
                View all tickets →
              </button>
            </div>

            {pendingTriage.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
                No complaints are currently waiting for triage. All assigned!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingTriage.slice(0, 5).map(item => (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {item.ticketId}
                        </span>
                        <PriorityBadge priority={item.priority} size="sm" />
                        <span className="text-xs text-slate-500">{item.categoryName}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        From <strong>{item.studentName}</strong> • {item.location || 'Campus'}
                      </p>
                    </div>

                    <button
                      onClick={() => onNavigate('admin-complaints')}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg shrink-0 transition-all"
                    >
                      Assign Tech
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* High Priority Critical Items */}
          {urgentComplaints.length > 0 && (
            <div className="bg-white rounded-2xl border border-rose-200/90 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-rose-100 bg-rose-50/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                    High-Priority Active Issues ({urgentComplaints.length})
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                  Critical
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {urgentComplaints.map(item => (
                  <div key={item.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700">{item.ticketId}</span>
                        <StatusBadge status={item.status} size="sm" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                      <div className="text-[11px] text-slate-500">
                        Location: {item.location} • {item.assignment ? `Assigned to ${item.assignment.technicianName}` : 'Unassigned'}
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('admin-complaints')}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg shrink-0 transition-colors"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Breakdown (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Category Distribution
            </h3>

            <div className="space-y-3.5">
              {categories.map(cat => {
                const count = stats.byCategory[cat.name] || 0;
                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        {getCategoryIcon(cat.name)}
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-semibold text-slate-900">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Clean Quick Info Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              Audit & SLA Compliance
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every status transition, technician dispatch, and resolution note is logged in real-time with user IDs and timestamps.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
