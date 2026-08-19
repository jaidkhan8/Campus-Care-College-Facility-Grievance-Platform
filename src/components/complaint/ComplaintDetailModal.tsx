import React from 'react';
import { Complaint } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/StatusBadge';
import {
  X,
  MapPin,
  Calendar,
  User,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  ShieldAlert,
  Star,
  Award
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  isOpen,
  onClose
}) => {
  if (!isOpen || !complaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        id="complaint-detail-dialog"
        className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scale-in"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
              {complaint.ticketId}
            </span>
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
            {complaint.satisfactionRating && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{complaint.satisfactionRating}/5 Rating</span>
              </span>
            )}
          </div>
          <button
            id="close-complaint-detail-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Title & Metadata */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{complaint.title}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-medium text-slate-700">{complaint.categoryName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{complaint.location || 'Campus Main Ground'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Reported: {new Date(complaint.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Student: {complaint.studentName} ({complaint.studentDepartment || 'Student'})</span>
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/70">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500" />
              Detailed Problem Description
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {complaint.description}
            </p>
          </div>

          {/* Attached Image if any */}
          {complaint.imageUrl && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Attached Photo / Proof
              </h4>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 max-h-72 flex items-center justify-center">
                <img
                  src={complaint.imageUrl}
                  alt="Complaint attachment"
                  className="w-full h-full object-cover max-h-72 hover:scale-102 transition-transform duration-200"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

          {/* Student Satisfaction Rating & Feedback Card if closed */}
          {complaint.satisfactionRating && (
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4 text-emerald-600" />
                  Student Verification & Rating
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= (complaint.satisfactionRating || 0)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              {complaint.closureFeedback && (
                <p className="text-xs text-emerald-900 italic bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                  "{complaint.closureFeedback}"
                </p>
              )}
            </div>
          )}

          {/* Technician Assignment Card */}
          {complaint.assignment && (
            <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-900 font-semibold text-sm">
                  <Wrench className="w-4 h-4 text-blue-600" />
                  Assigned Technician
                </div>
                <span className="text-xs text-blue-600">
                  {new Date(complaint.assignment.assignedAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-2 text-xs text-blue-800 space-y-1">
                <p>
                  <strong>Technician:</strong> {complaint.assignment.technicianName} ({complaint.assignment.technicianEmail})
                </p>
                <p>
                  <strong>Assigned by:</strong> {complaint.assignment.assignedByName}
                </p>
                {complaint.assignment.notes && (
                  <p className="mt-1 pt-1 border-t border-blue-200/50">
                    <strong>Admin Instructions:</strong> {complaint.assignment.notes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Progress Timeline History */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              Activity & Resolution Timeline
            </h4>

            <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
              {complaint.timelineUpdates.map((item, idx) => (
                <div key={item.id || idx} className="relative">
                  {/* Timeline dot icon */}
                  <div className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] ${
                    item.newStatus === 'RESOLVED' || item.newStatus === 'CLOSED'
                      ? 'bg-emerald-600 text-white'
                      : item.newStatus === 'IN_PROGRESS'
                      ? 'bg-indigo-600 text-white'
                      : item.newStatus === 'ASSIGNED'
                      ? 'bg-blue-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}>
                    {item.newStatus === 'RESOLVED' || item.newStatus === 'CLOSED' ? '✓' : idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800">{item.updaterName || 'System'}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase font-semibold">
                        {item.updaterRole || 'USER'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      {item.remarks}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            id="dismiss-complaint-detail-btn"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
