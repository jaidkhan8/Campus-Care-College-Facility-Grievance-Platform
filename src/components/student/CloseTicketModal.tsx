import React, { useState } from 'react';
import { Complaint } from '../../types';
import { useComplaints } from '../../context/ComplaintContext';
import { useToast } from '../common/Toast';
import {
  CheckCircle2,
  Star,
  X,
  MessageSquare,
  Sparkles,
  Award
} from 'lucide-react';

interface CloseTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaint: Complaint | null;
}

export const CloseTicketModal: React.FC<CloseTicketModalProps> = ({
  isOpen,
  onClose,
  complaint
}) => {
  const { closeComplaint } = useComplaints();
  const toast = useToast();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen || !complaint) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await closeComplaint(complaint.id, rating, feedback.trim());
      toast.success(
        'Complaint Closed & Rated',
        `Ticket #${complaint.ticketId} closed with ${rating}/5 star rating.`
      );
      onClose();
    } catch {
      toast.error('Error', 'Failed to close complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Close Complaint & Rate</h3>
              <p className="text-xs text-slate-500 font-mono">#{complaint.ticketId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Summary Box */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
            <div className="font-bold text-slate-900">{complaint.title}</div>
            <div className="text-[11px] text-slate-500">
              Resolved by: <strong className="text-slate-700">{complaint.assignment?.technicianName || 'Technician'}</strong>
            </div>
          </div>

          {/* 5-Star Rating */}
          <div className="text-center space-y-2 py-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              How satisfied are you with the resolution?
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 rounded-lg hover:scale-110 transition-transform focus:outline-hidden"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        isFilled
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      } transition-colors`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-semibold text-slate-600 block">
              {rating === 5 && '⭐️ Excellent resolution!'}
              {rating === 4 && '👍 Good work, solved properly.'}
              {rating === 3 && '👌 Satisfactory fix.'}
              {rating === 2 && '⚠️ Barely acceptable.'}
              {rating === 1 && '👎 Poor repair quality.'}
            </span>
          </div>

          {/* Optional Feedback */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1.5 text-[11px]">
              Feedback for Technician (Optional)
            </label>
            <textarea
              rows={3}
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="e.g. Technician arrived promptly and fixed the problem cleanly."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors active:scale-[0.98]"
            >
              Keep Open
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Confirm & Close Ticket</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
