import React, { useState, useRef } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { useToast } from '../common/Toast';
import {
  X,
  Upload,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  ArrowRight,
  Plus
} from 'lucide-react';

interface CreateComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onNavigateToComplaints?: () => void;
}

interface ComplaintTypeOption {
  id: string;
  label: string;
  emoji: string;
  categoryMatch: string;
}

const COMPLAINT_TYPES: ComplaintTypeOption[] = [
  { id: 'wifi', label: 'WiFi', emoji: '📶', categoryMatch: 'wifi' },
  { id: 'electricity', label: 'Electricity', emoji: '⚡', categoryMatch: 'electric' },
  { id: 'classroom', label: 'Classroom', emoji: '🏫', categoryMatch: 'classroom' },
  { id: 'hostel', label: 'Hostel', emoji: '🏠', categoryMatch: 'hostel' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹', categoryMatch: 'cleaning' },
  { id: 'other', label: 'Other', emoji: '⋯', categoryMatch: 'other' }
];

export const CreateComplaintModal: React.FC<CreateComplaintModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onNavigateToComplaints
}) => {
  const { categories, createComplaint } = useComplaints();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [selectedTypeId, setSelectedTypeId] = useState<string>('wifi');
  const [complaintTitle, setComplaintTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Status & Success State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    ticketId: string;
    title: string;
    category: string;
  } | null>(null);

  if (!isOpen) return null;

  // Handle Photo Selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB');
        return;
      }
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setSelectedFileName(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Find matching category ID from complaint types
  const getMatchedCategoryId = (): number => {
    const activeType = COMPLAINT_TYPES.find(t => t.id === selectedTypeId);
    if (!activeType) return categories[0]?.id || 1;

    const matched = categories.find(c =>
      c.name.toLowerCase().includes(activeType.categoryMatch)
    );
    return matched ? matched.id : categories[0]?.id || 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!complaintTitle.trim()) {
      setError('Please enter your complaint.');
      return;
    }

    setLoading(true);
    try {
      const categoryId = getMatchedCategoryId();
      const created = await createComplaint({
        title: complaintTitle.trim(),
        description: description.trim() || complaintTitle.trim(),
        categoryId,
        location: location.trim() || 'Campus Grounds',
        imageUrl: imagePreview || undefined
      });

      setSubmittedData({
        ticketId: created.ticketId,
        title: created.title,
        category: created.categoryName
      });

      toast.success('Complaint Submitted', `Ticket ID: ${created.ticketId}`);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForNewComplaint = () => {
    setSubmittedData(null);
    setSelectedTypeId('wifi');
    setComplaintTitle('');
    setDescription('');
    setLocation('');
    handleRemovePhoto();
    setError(null);
  };

  const handleViewMyComplaints = () => {
    onClose();
    if (onNavigateToComplaints) {
      onNavigateToComplaints();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        id="campus-complaint-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {submittedData ? 'Complaint Submitted' : 'Submit a Complaint'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {submittedData
                ? 'Your request has been registered in the campus portal'
                : 'Report a campus maintenance issue in seconds'}
            </p>
          </div>
          <button
            id="close-complaint-modal-button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {submittedData ? (
          /* SUCCESS SCREEN AFTER SUBMISSION */
          <div className="p-6 sm:p-8 space-y-6 text-center">
            {/* Green Success Icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                Complaint submitted successfully!
              </h3>
              <p className="text-xs text-slate-500">
                Our campus facilities team has received your ticket and will assign a technician shortly.
              </p>
            </div>

            {/* Ticket Info Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 text-left space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <span className="text-xs font-semibold text-slate-500">Ticket ID</span>
                <span className="font-mono text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
                  {submittedData.ticketId}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <span className="text-xs font-semibold text-slate-500">Status</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Submitted
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">Complaint</span>
                <span className="font-medium text-slate-800 text-right truncate max-w-[200px]">
                  {submittedData.title}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                id="view-my-complaints-button"
                onClick={handleViewMyComplaints}
                className="w-full py-3 px-5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>View My Complaints</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleResetForNewComplaint}
                className="w-full py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Submit Another Complaint
              </button>
            </div>
          </div>
        ) : (
          /* SIMPLE & PRACTICAL FORM (Under 30 seconds to fill) */
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-left">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2.5 text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Complaint Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Complaint Type
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {COMPLAINT_TYPES.map(type => {
                  const isSelected = selectedTypeId === type.id;
                  return (
                    <button
                      type="button"
                      key={type.id}
                      id={`complaint-type-${type.id}`}
                      onClick={() => setSelectedTypeId(type.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-bold shadow-xs ring-1 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xl leading-none">{type.emoji}</span>
                      <span className="text-[11px] font-semibold truncate w-full text-center">
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Complaint (Single-line input) */}
            <div>
              <label
                htmlFor="complaint-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Complaint
              </label>
              <input
                id="complaint-input"
                type="text"
                required
                value={complaintTitle}
                onChange={e => setComplaintTitle(e.target.value)}
                placeholder="e.g. WiFi not working in Room 302"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400 font-medium text-slate-900"
              />
            </div>

            {/* 3. Description (Simple textarea) */}
            <div>
              <label
                htmlFor="description-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Description
              </label>
              <textarea
                id="description-input"
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Briefly describe the problem..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400 text-slate-900 resize-none"
              />
            </div>

            {/* 4. Location (Single-line input) */}
            <div>
              <label
                htmlFor="location-input"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5"
              >
                Location
              </label>
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Hostel B, Room 302"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400 font-medium text-slate-900"
              />
            </div>

            {/* 5. Photo (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Photo (Optional)
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />

              {!imagePreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl transition-all flex items-center gap-2 shadow-2xs"
                >
                  <Upload className="w-4 h-4 text-slate-500" />
                  <span>Upload Photo</span>
                </button>
              ) : (
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-200 shrink-0">
                    <img
                      src={imagePreview}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {selectedFileName || 'Uploaded Photo'}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium">Ready to upload</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 6. Submit Complaint Button */}
            <div className="pt-2">
              <button
                id="submit-complaint-button"
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <span>Submit Complaint</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
