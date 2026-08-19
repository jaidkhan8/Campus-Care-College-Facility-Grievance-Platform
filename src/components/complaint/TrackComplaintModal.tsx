import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { Complaint, ComplaintStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import {
  Search,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  User,
  Calendar,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface TrackComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTicketId?: string;
  onSelectComplaint?: (complaint: Complaint) => void;
}

export const TrackComplaintModal: React.FC<TrackComplaintModalProps> = ({
  isOpen,
  onClose,
  initialTicketId = '',
  onSelectComplaint
}) => {
  const { complaints } = useComplaints();
  const [ticketQuery, setTicketQuery] = useState(initialTicketId);
  const [searchedComplaint, setSearchedComplaint] = useState<Complaint | null>(() => {
    if (!initialTicketId) return null;
    return (
      complaints.find(
        c => c.ticketId.toLowerCase() === initialTicketId.toLowerCase().trim()
      ) || null
    );
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialTicketId));

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketQuery.trim()) return;

    const match = complaints.find(
      c =>
        c.ticketId.toLowerCase() === ticketQuery.toLowerCase().trim() ||
        c.id.toString() === ticketQuery.trim()
    );

    setSearchedComplaint(match || null);
    setHasSearched(true);
  };

  const getStatusStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'PENDING':
        return 0;
      case 'ASSIGNED':
        return 1;
      case 'IN_PROGRESS':
        return 2;
      case 'RESOLVED':
        return 3;
      case 'CLOSED':
        return 4;
      default:
        return 0;
    }
  };

  const steps = [
    { title: 'Submitted', desc: 'Complaint logged in portal' },
    { title: 'Reviewed', desc: 'Admin triaged request' },
    { title: 'Assigned', desc: 'Technician dispatched' },
    { title: 'In Progress', desc: 'Active maintenance work' },
    { title: 'Resolved', desc: 'Issue resolved & verified' }
  ];

  const currentStep = searchedComplaint ? getStatusStepIndex(searchedComplaint.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Track Complaint Status</h2>
              <p className="text-xs text-slate-500">Search any campus grievance by ticket ID</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-slate-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ticketQuery}
                onChange={e => setTicketQuery(e.target.value)}
                placeholder="Enter Ticket ID (e.g. CMP-1024, CMP-1023)..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:font-sans placeholder:text-slate-400"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-xs transition-all"
            >
              Track
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-500">
            <span className="font-medium">Recent Tickets:</span>
            {['CMP-1024', 'CMP-1023', 'CMP-1022'].map(id => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setTicketQuery(id);
                  const match = complaints.find(c => c.ticketId.toLowerCase() === id.toLowerCase());
                  setSearchedComplaint(match || null);
                  setHasSearched(true);
                }}
                className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 font-mono text-[10px] font-semibold transition-colors"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {searchedComplaint ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              
              {/* Ticket Card Summary */}
              <div className="p-4 rounded-xl border border-slate-200/90 bg-white shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                      {searchedComplaint.ticketId}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                      {searchedComplaint.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <PriorityBadge priority={searchedComplaint.priority} size="sm" />
                    <StatusBadge status={searchedComplaint.status} size="sm" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  {searchedComplaint.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
                    <span className="font-semibold text-slate-700">{searchedComplaint.categoryName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                    <span className="font-semibold text-slate-700 truncate block">{searchedComplaint.location || 'Campus'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Tech</span>
                    <span className="font-semibold text-slate-700">
                      {searchedComplaint.assignment?.technicianName || 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80">
                <h4 className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wider">
                  Resolution Progress
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {searchedComplaint.timelineUpdates.map((update, idx) => (
                    <div key={update.id} className="relative">
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            {update.updaterRole === 'STUDENT' ? 'Student Action' : update.updaterRole === 'ADMIN' ? 'Admin Triage' : 'Technician Update'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-0.5 text-[11px] leading-snug">
                          {update.remarks}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open full details action */}
              {onSelectComplaint && (
                <div className="pt-2 text-right">
                  <button
                    onClick={() => {
                      onSelectComplaint(searchedComplaint);
                      onClose();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Open Full Ticket Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          ) : hasSearched ? (
            <div className="py-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No complaint found</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                We could not find any complaint with Ticket ID "{ticketQuery}". Please verify the number and try again.
              </p>
            </div>
          ) : (
            <div className="py-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Search Your Ticket</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Enter your ticket number above to view real-time technician notes, progress, and resolution history.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
