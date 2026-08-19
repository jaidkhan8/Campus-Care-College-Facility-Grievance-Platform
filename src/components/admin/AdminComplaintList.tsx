import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { Complaint, ComplaintPriority, ComplaintStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import { ComplaintDetailModal } from '../complaint/ComplaintDetailModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { useToast } from '../common/Toast';
import {
  Search,
  Wrench,
  Trash2,
  Calendar,
  MapPin,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  Filter
} from 'lucide-react';

interface AdminComplaintListProps {
  initialStatusFilter?: string;
}

export const AdminComplaintList: React.FC<AdminComplaintListProps> = ({ initialStatusFilter = 'ALL' }) => {
  const { complaints, categories, assignComplaint, updateStatus, updatePriority, deleteComplaint } = useComplaints();
  const { allUsers } = useAuth();
  const toast = useToast();

  const technicians = allUsers.filter(u => u.role === 'TECHNICIAN');

  // Search and Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [technicianFilter, setTechnicianFilter] = useState<string>('ALL');

  // Modal states
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Assign Technician Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [complaintToAssign, setComplaintToAssign] = useState<Complaint | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<number>(technicians[0]?.id || 0);
  const [assignNotes, setAssignNotes] = useState('');

  // Status/Priority Change Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [complaintToUpdate, setComplaintToUpdate] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('IN_PROGRESS');
  const [statusRemarks, setStatusRemarks] = useState('');

  // Delete Confirm Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState<Complaint | null>(null);

  // Filtering Logic
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || c.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'ALL' || c.categoryId.toString() === categoryFilter;
    const matchesTechnician =
      technicianFilter === 'ALL' ||
      (technicianFilter === 'UNASSIGNED' && !c.assignment) ||
      (c.assignment && c.assignment.technicianId.toString() === technicianFilter);

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesTechnician;
  });

  const handleOpenAssign = (complaint: Complaint) => {
    setComplaintToAssign(complaint);
    setSelectedTechId(complaint.assignment?.technicianId || technicians[0]?.id || 0);
    setAssignNotes(complaint.assignment?.notes || '');
    setAssignModalOpen(true);
  };

  const handleConfirmAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintToAssign || !selectedTechId) return;
    await assignComplaint(complaintToAssign.id, Number(selectedTechId), assignNotes);
    toast.success('Technician Assigned', `Ticket #${complaintToAssign.ticketId} has been assigned.`);
    setAssignModalOpen(false);
    setComplaintToAssign(null);
  };

  const handleOpenStatus = (complaint: Complaint) => {
    setComplaintToUpdate(complaint);
    setNewStatus(complaint.status);
    setStatusRemarks('');
    setStatusModalOpen(true);
  };

  const handleConfirmStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintToUpdate) return;
    await updateStatus(complaintToUpdate.id, newStatus, statusRemarks || `Admin updated status to ${newStatus}`);
    toast.success('Status Updated', `Ticket #${complaintToUpdate.ticketId} updated to ${newStatus}.`);
    setStatusModalOpen(false);
    setComplaintToUpdate(null);
  };

  const handleOpenDelete = (complaint: Complaint) => {
    setComplaintToDelete(complaint);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!complaintToDelete) return;
    await deleteComplaint(complaintToDelete.id);
    toast.success('Ticket Deleted', `Ticket #${complaintToDelete.ticketId} removed.`);
    setDeleteModalOpen(false);
    setComplaintToDelete(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Campus Complaints Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete administrative triage, technician dispatching, and audit log oversight.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 font-medium">
          Showing <strong className="text-indigo-600 font-semibold">{filteredComplaints.length}</strong> of {complaints.length} tickets
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full md:flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="admin-search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID (e.g. ELEC-89101), student, description, or room..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden text-slate-700"
            >
              <option value="ALL">Status: All</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>

            <select
              id="filter-priority-select"
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden text-slate-700"
            >
              <option value="ALL">Priority: All</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            <select
              id="filter-category-select"
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden text-slate-700"
            >
              <option value="ALL">Category: All</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id.toString()}>{cat.name}</option>
              ))}
            </select>

            <select
              id="filter-technician-select"
              value={technicianFilter}
              onChange={e => setTechnicianFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden text-slate-700"
            >
              <option value="ALL">Technician: All</option>
              <option value="UNASSIGNED">Unassigned</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.id.toString()}>{tech.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredComplaints.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No complaints found matching current query and filter conditions.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Tech</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {filteredComplaints.map(complaint => (
                  <tr key={complaint.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Ticket & Category */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      <div>{complaint.ticketId}</div>
                      <div className="text-[10px] text-slate-500 font-sans font-medium">{complaint.categoryName}</div>
                    </td>

                    {/* Title & Location */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 line-clamp-1">{complaint.title}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{complaint.location || 'Campus'}</span>
                        <span>•</span>
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Student */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{complaint.studentName}</div>
                      <div className="text-[10px] text-slate-500">{complaint.studentDepartment || 'Student'}</div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <PriorityBadge priority={complaint.priority} size="sm" />
                        {/* Quick priority change dropdown */}
                        <div className="relative group">
                          <button
                            title="Quick Change Priority"
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          <div className="absolute left-0 mt-1 hidden group-hover:block w-28 bg-white shadow-xl rounded-lg border border-slate-200 py-1 z-30">
                            {(['LOW', 'MEDIUM', 'HIGH'] as ComplaintPriority[]).map(p => (
                              <button
                                key={p}
                                onClick={() => {
                                  updatePriority(complaint.id, p);
                                  toast.info('Priority Updated', `Ticket #${complaint.ticketId} priority set to ${p}`);
                                }}
                                className={`w-full px-2.5 py-1 text-left text-[11px] hover:bg-slate-50 font-semibold ${
                                  complaint.priority === p ? 'text-indigo-600 font-bold' : 'text-slate-700'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={complaint.status} size="sm" />
                    </td>

                    {/* Assigned Tech */}
                    <td className="py-3.5 px-4">
                      {complaint.assignment ? (
                        <div className="space-y-0.5">
                          <div className="font-semibold text-blue-700">{complaint.assignment.technicianName}</div>
                          <div className="text-[10px] text-slate-400">{complaint.assignment.technicianEmail}</div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenAssign(complaint)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-lg transition-colors"
                        >
                          <Wrench className="w-3 h-3 text-amber-600" />
                          Assign Tech
                        </button>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          id={`view-detail-btn-${complaint.id}`}
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setIsDetailOpen(true);
                          }}
                          title="View Full Timeline Details"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          id={`assign-tech-btn-${complaint.id}`}
                          onClick={() => handleOpenAssign(complaint)}
                          title="Assign / Reassign Technician"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Wrench className="w-4 h-4" />
                        </button>

                        <button
                          id={`update-status-btn-${complaint.id}`}
                          onClick={() => handleOpenStatus(complaint)}
                          title="Override Status & Log Remarks"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>

                        <button
                          id={`delete-complaint-btn-${complaint.id}`}
                          onClick={() => handleOpenDelete(complaint)}
                          title="Delete / Inappropriate"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Assign Technician Modal */}
      {assignModalOpen && complaintToAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50/80">
              <h3 className="text-base font-bold text-slate-900">Assign Technician</h3>
              <p className="text-xs text-slate-500 mt-0.5">Ticket: <strong className="font-mono text-indigo-600">{complaintToAssign.ticketId}</strong> — {complaintToAssign.title}</p>
            </div>

            <form onSubmit={handleConfirmAssign} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">
                  Select Technician *
                </label>
                <select
                  value={selectedTechId}
                  onChange={e => setSelectedTechId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                >
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>
                      {tech.name} — {tech.department || 'Maintenance'} ({tech.phone || 'On-call'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">
                  Assignment Instructions / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  value={assignNotes}
                  onChange={e => setAssignNotes(e.target.value)}
                  placeholder="e.g. Inspect before 2 PM, bring 16A modular socket replacements..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none placeholder:text-slate-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-[0.98]"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Status Override Modal */}
      {statusModalOpen && complaintToUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50/80">
              <h3 className="text-base font-bold text-slate-900">Change Status & Audit Log</h3>
              <p className="text-xs text-slate-500 mt-0.5">Ticket: <strong className="font-mono text-indigo-600">{complaintToUpdate.ticketId}</strong></p>
            </div>

            <form onSubmit={handleConfirmStatus} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">
                  New Status *
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">
                  Reason / Remarks for Status Change *
                </label>
                <textarea
                  required
                  rows={3}
                  value={statusRemarks}
                  onChange={e => setStatusRemarks(e.target.value)}
                  placeholder="Provide audit notes for this status change..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none placeholder:text-slate-400"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-[0.98]"
                >
                  Update & Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedComplaint(null);
        }}
      />

      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Complaint Ticket"
        message={`Are you sure you want to permanently delete ticket ${complaintToDelete?.ticketId}? This action cannot be undone and will delete related assignment and audit logs.`}
        confirmLabel="Delete Permanently"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};
