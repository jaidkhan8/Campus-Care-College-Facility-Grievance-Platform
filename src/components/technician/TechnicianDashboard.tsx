import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Complaint, ComplaintStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { ComplaintDetailModal } from '../complaint/ComplaintDetailModal';
import { useToast } from '../common/Toast';
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  FileCheck,
  Search,
  ChevronRight,
  TrendingUp,
  FileText,
  User
} from 'lucide-react';

interface TechnicianDashboardProps {
  initialTab?: 'all' | 'active' | 'resolved';
}

export const TechnicianDashboard: React.FC<TechnicianDashboardProps> = ({ initialTab = 'active' }) => {
  const { currentUser } = useAuth();
  const { complaints, updateStatus } = useComplaints();
  const toast = useToast();

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Status Action Modal
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [targetComplaint, setTargetComplaint] = useState<Complaint | null>(null);
  const [nextStatus, setNextStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Filters
  const [tabFilter, setTabFilter] = useState<'ALL' | 'ACTIVE' | 'RESOLVED'>(
    initialTab === 'resolved' ? 'RESOLVED' : initialTab === 'all' ? 'ALL' : 'ACTIVE'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Complaints assigned to this technician
  const myAssignedComplaints = complaints.filter(
    c => c.assignment?.technicianId === currentUser?.id || c.assignment?.technicianEmail === currentUser?.email
  );

  const activeComplaints = myAssignedComplaints.filter(c => c.status !== 'RESOLVED');
  const inProgressComplaints = myAssignedComplaints.filter(c => c.status === 'IN_PROGRESS');
  const assignedPickupComplaints = myAssignedComplaints.filter(c => c.status === 'ASSIGNED');
  const resolvedComplaints = myAssignedComplaints.filter(c => c.status === 'RESOLVED');

  const displayedComplaints = myAssignedComplaints.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()));

    if (tabFilter === 'ACTIVE') return matchesSearch && c.status !== 'RESOLVED';
    if (tabFilter === 'RESOLVED') return matchesSearch && c.status === 'RESOLVED';
    return matchesSearch;
  });

  const handleOpenAction = (complaint: Complaint, status: ComplaintStatus) => {
    setTargetComplaint(complaint);
    setNextStatus(status);
    setRemarks(
      status === 'RESOLVED'
        ? 'Completed maintenance inspection. Replaced faulty component and verified normal operational status.'
        : 'Arrived at site, beginning technical diagnostic and maintenance repair.'
    );
    setActionModalOpen(true);
  };

  const handleConfirmAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetComplaint) return;

    setSubmitting(true);
    try {
      await updateStatus(targetComplaint.id, nextStatus, remarks);
      toast.success(
        nextStatus === 'RESOLVED' ? 'Ticket Resolved' : 'Work Started',
        `Ticket #${targetComplaint.ticketId} status updated to ${nextStatus}.`
      );
      setActionModalOpen(false);
      setTargetComplaint(null);
      setRemarks('');
    } catch {
      toast.error('Update Failed', 'Failed to update ticket status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Compact Dashboard Header */}
      <div 
        id="tech-dashboard-header"
        className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome, {currentUser?.name || 'Technician'}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {currentUser?.department || 'Field Technician'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your assigned work orders, record diagnostic logs, and resolve student grievances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            Assigned Queue: <strong className="text-slate-800">{activeComplaints.length} active</strong>
          </div>
        </div>
      </div>

      {/* 4 Clean Statistics Cards in One Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Assigned */}
        <div 
          onClick={() => setTabFilter('ALL')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:border-slate-300 hover:shadow-xs ${
            tabFilter === 'ALL' ? 'border-slate-400/80 ring-1 ring-slate-400/20' : 'border-slate-200/90 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Assigned
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {myAssignedComplaints.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            All lifetime assigned tickets
          </p>
        </div>

        {/* Action Required (Assigned) */}
        <div 
          onClick={() => setTabFilter('ACTIVE')}
          className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Action Required
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {assignedPickupComplaints.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Awaiting technician pickup
          </p>
        </div>

        {/* In Progress */}
        <div 
          onClick={() => setTabFilter('ACTIVE')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:border-indigo-300 hover:shadow-xs ${
            tabFilter === 'ACTIVE' ? 'border-indigo-400/80 ring-1 ring-indigo-400/20' : 'border-slate-200/90 shadow-2xs'
          }`}
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
            {inProgressComplaints.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Currently undergoing maintenance
          </p>
        </div>

        {/* Completed */}
        <div 
          onClick={() => setTabFilter('RESOLVED')}
          className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer hover:border-emerald-300 hover:shadow-xs ${
            tabFilter === 'RESOLVED' ? 'border-emerald-400/80 ring-1 ring-emerald-400/20' : 'border-slate-200/90 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Completed
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {resolvedComplaints.length}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Successfully resolved & closed
          </p>
        </div>

      </div>

      {/* Main Work Orders Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        
        {/* Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/60 text-xs w-full md:w-auto">
            <button
              id="tech-tab-active"
              onClick={() => setTabFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                tabFilter === 'ACTIVE'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Active Work Orders</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-700 font-bold">
                {activeComplaints.length}
              </span>
            </button>

            <button
              id="tech-tab-resolved"
              onClick={() => setTabFilter('RESOLVED')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                tabFilter === 'RESOLVED'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Resolved Archive</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
                {resolvedComplaints.length}
              </span>
            </button>

            <button
              id="tech-tab-all"
              onClick={() => setTabFilter('ALL')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                tabFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({myAssignedComplaints.length})
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search ticket, room, issue..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Complaints List */}
        {displayedComplaints.length === 0 ? (
          <div className="py-14 px-4 text-center">
            <div className="max-w-sm mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No work orders in this view</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {tabFilter === 'ACTIVE'
                  ? 'You have cleared all active assigned work orders!'
                  : 'No tickets found matching your filter criteria.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {displayedComplaints.map(complaint => (
              <div
                key={complaint.id}
                id={`tech-ticket-${complaint.id}`}
                className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {complaint.ticketId}
                    </span>
                    <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {complaint.categoryName}
                    </span>
                    <PriorityBadge priority={complaint.priority} size="sm" />
                    <StatusBadge status={complaint.status} size="sm" />
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">{complaint.title}</h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {complaint.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-[11px] text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {complaint.location || 'Campus Location'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Reported: {new Date(complaint.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-slate-500">
                      Student: <strong>{complaint.studentName}</strong>
                    </span>
                  </div>

                  {complaint.assignment?.notes && (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-1.5 mt-1">
                      <span className="font-bold shrink-0">Triage Note:</span>
                      <span>{complaint.assignment.notes}</span>
                    </div>
                  )}
                </div>

                {/* Actions & Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0">
                  {complaint.status === 'ASSIGNED' && (
                    <button
                      id={`tech-start-btn-${complaint.id}`}
                      onClick={() => handleOpenAction(complaint, 'IN_PROGRESS')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Start Work</span>
                    </button>
                  )}

                  {complaint.status === 'IN_PROGRESS' && (
                    <button
                      id={`tech-resolve-btn-${complaint.id}`}
                      onClick={() => handleOpenAction(complaint, 'RESOLVED')}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setIsDetailOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 rounded-lg transition-all flex items-center gap-1 justify-center"
                  >
                    <span>Timeline & Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Technician Action Modal */}
      {actionModalOpen && targetComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50/70">
              <h3 className="text-base font-bold text-slate-900">
                {nextStatus === 'RESOLVED' ? 'Complete & Resolve Work Order' : 'Commence Work on Ticket'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Ticket: <strong className="font-mono text-indigo-600">{targetComplaint.ticketId}</strong> — {targetComplaint.title}
              </p>
            </div>

            <form onSubmit={handleConfirmAction} className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Target Status:</span>
                  <StatusBadge status={nextStatus} size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-slate-800">{targetComplaint.location || 'Campus'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-semibold text-slate-800">{targetComplaint.studentName}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700 uppercase text-[11px]">
                    Technician Diagnostic & Repair Remarks *
                  </label>
                </div>

                {/* Quick Remarks Presets */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[10px] text-slate-400 font-semibold self-center">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setRemarks('Inspected site, diagnosed wiring fault, replaced damaged switch and restored power.')}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 border border-slate-200 transition-colors"
                  >
                    Wiring Fixed
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemarks('Cleaned and cleared plumbing blockage. Checked water pressure and verified zero leakage.')}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 border border-slate-200 transition-colors"
                  >
                    Plumbing Restored
                  </button>
                  <button
                    type="button"
                    onClick={() => setRemarks('Reconfigured network gateway switch and tested Wi-Fi signal strength at 85 Mbps.')}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 border border-slate-200 transition-colors"
                  >
                    Network Fixed
                  </button>
                </div>

                <textarea
                  required
                  rows={4}
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Detail the work done, spare parts utilized, and testing completed..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none placeholder:text-slate-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-4.5 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5 ${
                    nextStatus === 'RESOLVED'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {submitting ? (
                    <span>Submitting...</span>
                  ) : nextStatus === 'RESOLVED' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm Resolution</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Update to In Progress</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedComplaint(null);
        }}
      />
    </div>
  );
};
