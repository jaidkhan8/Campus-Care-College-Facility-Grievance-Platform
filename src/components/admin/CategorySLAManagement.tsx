import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { Category } from '../../types';
import { useToast } from '../common/Toast';
import {
  Layers,
  Plus,
  Clock,
  Edit2,
  Check,
  Zap,
  Wifi,
  Monitor,
  Home,
  BookOpen,
  Sparkles,
  Bus,
  HelpCircle,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const CategorySLAManagement: React.FC = () => {
  const { categories, addCategory, updateCategory, complaints } = useComplaints();
  const toast = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // New Category State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slaHours, setSlaHours] = useState(24);

  const getCategoryIcon = (catName: string) => {
    switch (catName.toLowerCase()) {
      case 'electrical': return <Zap className="w-4 h-4 text-amber-600" />;
      case 'internet/wifi': return <Wifi className="w-4 h-4 text-blue-600" />;
      case 'classroom': return <Monitor className="w-4 h-4 text-indigo-600" />;
      case 'hostel': return <Home className="w-4 h-4 text-emerald-600" />;
      case 'library': return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'cleaning': return <Sparkles className="w-4 h-4 text-cyan-600" />;
      case 'transport': return <Bus className="w-4 h-4 text-orange-600" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await addCategory({
        name: name.trim(),
        description: description.trim() || 'Standard campus maintenance category',
        slaHours: Number(slaHours) || 24
      });
      toast.success('Category Created', `New category "${name}" with ${slaHours}h SLA added.`);
      setIsAddModalOpen(false);
      setName('');
      setDescription('');
      setSlaHours(24);
    } catch {
      toast.error('Error', 'Failed to add category.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      await updateCategory(editingCategory.id, {
        name: editingCategory.name,
        description: editingCategory.description,
        slaHours: editingCategory.slaHours || 24
      });
      toast.success('SLA Updated', `Category "${editingCategory.name}" updated successfully.`);
      setEditingCategory(null);
    } catch {
      toast.error('Error', 'Failed to update category.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Categories & SLA Benchmark Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure campus maintenance departments, dispatch routing rules, and Service Level Agreement (SLA) resolution targets.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all flex items-center gap-1.5 self-start sm:self-auto active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Maintenance Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => {
          const complaintCount = complaints.filter(c => c.categoryId === category.id).length;
          const activeCount = complaints.filter(c => c.categoryId === category.id && c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;
          const sla = category.slaHours || 24;

          return (
            <div
              key={category.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center">
                    {getCategoryIcon(category.name)}
                  </div>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Edit Category & SLA"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{category.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {category.description || 'Campus facility & maintenance triage category.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                  <Clock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>SLA: <strong className="text-slate-900">{sla}h Target</strong></span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {activeCount} active ({complaintCount} total)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50/80">
              <h3 className="text-base font-bold text-slate-900">Add Maintenance Category</h3>
              <p className="text-xs text-slate-500 mt-0.5">Create a department category and define its resolution SLA.</p>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Category Name *</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. HVAC / Air Conditioning"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Scope of work and equipment covered..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Resolution SLA Target (Hours) *</label>
                <input
                  required
                  type="number"
                  min={1}
                  max={168}
                  value={slaHours}
                  onChange={e => setSlaHours(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  e.g., 6 hours for emergency electrical, 24 hours for plumbing, 48 hours for carpentry.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-[0.98]"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50/80">
              <h3 className="text-base font-bold text-slate-900">Edit Category SLA</h3>
              <p className="text-xs text-slate-500 mt-0.5">Modify resolution target and description for {editingCategory.name}.</p>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Category Name *</label>
                <input
                  required
                  type="text"
                  value={editingCategory.name}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.description || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Resolution SLA Target (Hours) *</label>
                <input
                  required
                  type="number"
                  min={1}
                  max={168}
                  value={editingCategory.slaHours || 24}
                  onChange={e => setEditingCategory({ ...editingCategory, slaHours: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors active:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all active:scale-[0.98]"
                >
                  Save SLA Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
