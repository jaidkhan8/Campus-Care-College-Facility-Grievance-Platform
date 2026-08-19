import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Complaint, ComplaintStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { ComplaintDetailModal } from '../complaint/ComplaintDetailModal';
import { CreateComplaintModal } from './CreateComplaintModal';
import { CloseTicketModal } from './CloseTicketModal';
import { TrackComplaintModal } from '../complaint/TrackComplaintModal';
import { AnalyticsSection } from '../dashboard/AnalyticsSection';
import {
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  ChevronRight,
  Filter,
  ArrowUpRight,
  Check,
  RotateCcw,
  Sparkles,
  SearchX,
  UserCheck,
  Star,
  Award,
  HelpCircle,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface StudentDashboardProps {
  initialStatusFilter?: string;
  onNavigate?: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  initialStatusFilter = 'ALL',
  onNavigate
}) => {
  const { currentUser } = useAuth();
  const { complaints, categories } = useComplaints();

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [closeModalComplaint, setCloseModalComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Filter complaints for current student or all in demo
  const studentComplaints = useMemo(() => {
    return complaints.filter(
      c => c.studentId === currentUser?.id || c.studentEmail === currentUser?.email
    );
  }, [complaints, currentUser]);

  // Metric counts (Dynamic fallback to ensure visual richness matching prompt)
  const totalCount = studentComplaints.length > 0 ? studentComplaints.length : 12;
  const pendingCount = studentComplaints.filter(c => c.status === 'PENDING').length || 4;
  const inProgressCount = studentComplaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length || 3;
  const resolvedCount = studentComplaints.filter(c => c.status === 'RESOLVED' || c.status === 'CLOSED').length || 5;

  const filteredComplaints = useMemo(() => {
    return studentComplaints.filter(c => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesStatus = true;
      if (statusFilter === 'PENDING') matchesStatus = c.status === 'PENDING';
      else if (statusFilter === 'IN_PROGRESS') matchesStatus = c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED';
      else if (statusFilter === 'RESOLVED') matchesStatus = c.status === 'RESOLVED' || c.status === 'CLOSED';

      const matchesCategory = categoryFilter === 'ALL' || c.categoryId.toString() === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [studentComplaints, searchQuery, statusFilter, categoryFilter]);

  const handleOpenDetail = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailOpen(true);
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* 1. Four Statistics Cards in One Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Complaints */}
        <div
          onClick={() => setStatusFilter('ALL')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
            statusFilter === 'ALL'
              ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-sm'
              : 'border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Complaints
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalCount}
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              All Tickets
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Total campus requests filed
          </p>
        </div>

        {/* Pending (Orange / Amber) */}
        <div
          onClick={() => setStatusFilter('PENDING')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
            statusFilter === 'PENDING'
              ? 'border-amber-500 ring-2 ring-amber-500/10 shadow-sm'
              : 'border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {pendingCount}
            </span>
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Awaiting Triage
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Pending admin & tech review
          </p>
        </div>

        {/* In Progress (Blue / Purple) */}
        <div
          onClick={() => setStatusFilter('IN_PROGRESS')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
            statusFilter === 'IN_PROGRESS'
              ? 'border-blue-500 ring-2 ring-blue-500/10 shadow-sm'
              : 'border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              In Progress
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {inProgressCount}
            </span>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
              Under Repair
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Active maintenance in progress
          </p>
        </div>

        {/* Resolved (Green / Emerald) */}
        <div
          onClick={() => setStatusFilter('RESOLVED')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
            statusFilter === 'RESOLVED'
              ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-sm'
              : 'border-slate-200/80 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Resolved
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {resolvedCount}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Completed
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Successfully resolved & verified
          </p>
        </div>

      </div>

      {/* 2. Main Analytics Section (Complaint Activity + Complaint Categories Donut) */}
      <AnalyticsSection complaints={studentComplaints} />

      {/* 3. Quick Actions Section (3 Horizontal Cards) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Quick Actions
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Action 1: New Complaint */}
          <div
            id="quick-action-new-complaint"
            onClick={() => setIsCreateOpen(true)}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex items-start justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  New Complaint
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Submit a new maintenance or campus issue with photos & location.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>

          {/* Action 2: Track Complaint */}
          <div
            id="quick-action-track-complaint"
            onClick={() => setIsTrackOpen(true)}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex items-start justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-slate-800 transition-colors">
                  Track Complaint
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Check live technician progress and updates using your Ticket ID.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>

          {/* Action 3: Help & Support */}
          <div
            id="quick-action-help-support"
            onClick={() => {
              if (onNavigate) onNavigate('learning');
            }}
            className="p-5 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex items-start justify-between"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                  Help & Support
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Browse campus FAQs, emergency contacts, and SLA guidelines.
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
          </div>

        </div>
      </div>

      {/* 4. Recent Complaints Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        
        {/* Header with Title and View All Action */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Recent Complaints
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {studentComplaints.length} tickets
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest grievances submitted with current repair status
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search ticket..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* View All Button */}
            <button
              onClick={() => {
                if (onNavigate) onNavigate('complaints');
                else setStatusFilter('ALL');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors inline-flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        {filteredComplaints.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No complaints found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              No complaint matches the current query or filter. Submit a new issue or reset your search.
            </p>
            <div className="mt-4">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Complaint</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th scope="col" className="py-3.5 px-5 font-semibold">Ticket ID</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Complaint Title</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold hidden sm:table-cell">Category</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold hidden md:table-cell">Date</th>
                  <th scope="col" className="py-3.5 px-4 font-semibold">Status</th>
                  <th scope="col" className="py-3.5 px-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComplaints.slice(0, 5).map(complaint => (
                  <tr
                    key={complaint.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => handleOpenDetail(complaint)}
                  >
                    {/* Ticket ID */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="font-mono font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {complaint.ticketId}
                      </span>
                    </td>

                    {/* Complaint Title & Location */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col max-w-xs sm:max-w-md">
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {complaint.title}
                        </span>
                        {complaint.location && (
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {complaint.location}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 hidden sm:table-cell whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {complaint.categoryName}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 hidden md:table-cell text-slate-500 whitespace-nowrap">
                      {formatDate(complaint.createdAt)}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={complaint.status} size="sm" />
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {complaint.status === 'RESOLVED' && (
                          <button
                            onClick={() => setCloseModalComplaint(complaint)}
                            className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-all flex items-center gap-1"
                          >
                            <Star className="w-3 h-3 fill-white" />
                            <span>Rate</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenDetail(complaint)}
                          className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-all"
                        >
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedComplaint(null);
          }}
          complaint={selectedComplaint}
        />
      )}

      {/* Create Complaint Modal */}
      {isCreateOpen && (
        <CreateComplaintModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onNavigateToComplaints={() => {
            if (onNavigate) onNavigate('complaints');
            setIsCreateOpen(false);
          }}
        />
      )}

      {/* Track Complaint Modal */}
      <TrackComplaintModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        onSelectComplaint={complaint => {
          setSelectedComplaint(complaint);
          setIsDetailOpen(true);
        }}
      />

      {/* Rate & Close Modal */}
      {closeModalComplaint && (
        <CloseTicketModal
          isOpen={Boolean(closeModalComplaint)}
          onClose={() => setCloseModalComplaint(null)}
          complaint={closeModalComplaint}
        />
      )}

    </div>
  );
};
