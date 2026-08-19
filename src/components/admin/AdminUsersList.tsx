import React, { useState } from 'react';
import { useAuth, INVALID_EMAIL_ERROR } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { Role, User } from '../../types';
import {
  Users,
  UserPlus,
  Shield,
  Wrench,
  GraduationCap,
  Mail,
  Phone,
  Building,
  CheckCircle2,
  Lock,
  Search,
  Check,
  BadgeCheck,
  Edit2,
  AlertCircle
} from 'lucide-react';

export const AdminUsersList: React.FC = () => {
  const { allUsers, createUser, updateUserRole, currentUser } = useAuth();
  const { complaints } = useComplaints();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newUid, setNewUid] = useState('');
  const [newRole, setNewRole] = useState<Role>('TECHNICIAN');
  const [newDepartment, setNewDepartment] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError] = useState('');

  // Editing role state
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.uid && u.uid.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.department && u.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    const cleanEmail = newEmail.trim().toLowerCase();
    const cleanUid = newUid.trim().toUpperCase();

    if (!cleanEmail.endsWith('@culkomail.in')) {
      setAddError(INVALID_EMAIL_ERROR);
      return;
    }

    if (!cleanUid) {
      setAddError('Please specify an official College UID.');
      return;
    }

    const res = createUser({
      name: newName.trim(),
      email: cleanEmail,
      uid: cleanUid,
      role: newRole,
      department: newDepartment.trim() || 'Campus Operations',
      phone: newPhone.trim() || '+91 98765 00000',
      isActive: true
    });

    if (!res.success) {
      setAddError(res.error || 'Failed to add user');
      return;
    }

    setAddSuccess(true);
    setTimeout(() => {
      setIsAddModalOpen(false);
      setAddSuccess(false);
      setNewName('');
      setNewEmail('');
      setNewUid('');
      setNewDepartment('');
      setNewPhone('');
    }, 1200);
  };

  const handleRoleUpdate = (userId: number, role: Role) => {
    updateUserRole(userId, role);
    setEditingUserId(null);
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            <Shield className="w-3 h-3 text-purple-600" /> College Authority
          </span>
        );
      case 'TECHNICIAN':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <Wrench className="w-3 h-3 text-blue-600" /> Technician
          </span>
        );
      case 'STUDENT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <GraduationCap className="w-3 h-3 text-emerald-600" /> Student
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">College Authority RBAC Directory</h1>
          <p className="text-xs text-slate-500 mt-1">
            Enforce institutional access, assign technician/authority roles, and verify @culkomail.in credentials.
          </p>
        </div>

        <button
          id="admin-add-user-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Provision College User</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {allUsers.filter(u => u.role === 'ADMIN').length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">College Authorities</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {allUsers.filter(u => u.role === 'TECHNICIAN').length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Field Technicians</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900">
              {allUsers.filter(u => u.role === 'STUDENT').length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Authorized Students</div>
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, @culkomail.in, UID..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">College Authorities</option>
              <option value="TECHNICIAN">Technicians Only</option>
              <option value="STUDENT">Students Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">User & UID</th>
                <th className="py-3 px-4">Assigned Role (Authority Managed)</th>
                <th className="py-3 px-4">Department / Unit</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Ticket Workload</th>
                <th className="py-3 px-4">Role Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
              {filteredUsers.map(user => {
                // Calculate user activity
                let activityText = '';
                if (user.role === 'STUDENT') {
                  const count = complaints.filter(c => c.studentId === user.id || c.studentEmail === user.email).length;
                  activityText = `${count} tickets filed`;
                } else if (user.role === 'TECHNICIAN') {
                  const assignedCount = complaints.filter(c => c.assignment?.technicianId === user.id).length;
                  const activeCount = complaints.filter(c => c.assignment?.technicianId === user.id && c.status !== 'RESOLVED').length;
                  activityText = `${activeCount} active / ${assignedCount} total assigned`;
                } else {
                  activityText = 'Full governance control';
                }

                return (
                  <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500 font-mono">{user.email}</span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.2 rounded font-mono">
                          {user.uid}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {editingUserId === user.id ? (
                        <select
                          value={user.role}
                          onChange={e => handleRoleUpdate(user.id, e.target.value as Role)}
                          className="px-2 py-1 bg-white border border-indigo-400 rounded-lg text-xs font-semibold focus:outline-hidden"
                          autoFocus
                          onBlur={() => setEditingUserId(null)}
                        >
                          <option value="STUDENT">Student</option>
                          <option value="TECHNICIAN">Technician</option>
                          <option value="ADMIN">College Authority</option>
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {getRoleBadge(user.role)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{user.department || 'General'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="font-mono">{user.email}</span>
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{user.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-600">
                      {activityText}
                    </td>

                    <td className="py-3 px-4">
                      <button
                        onClick={() => setEditingUserId(editingUserId === user.id ? null : user.id)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Assign Role</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-in">
            <div className="p-5 border-b border-slate-100 bg-slate-50/80">
              <h3 className="text-base font-bold text-slate-900">Provision College User & Role</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Assign technician, staff, or authority credentials with mandatory @culkomail.in and UID.
              </p>
            </div>

            <form onSubmit={handleAddUser} className="p-5 space-y-3.5 text-xs">
              {addError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-1.5 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{addError}</span>
                </div>
              )}

              {addSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5 font-semibold">
                  <Check className="w-4 h-4" /> User provisioned and role assigned successfully!
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Full Legal Name *
                </label>
                <input
                  required
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                    College Email *
                  </label>
                  <span className="text-[10px] font-bold text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.5 rounded">
                    @culkomail.in
                  </span>
                </div>
                <input
                  required
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="ramesh.tech@culkomail.in"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Official College UID *
                </label>
                <input
                  required
                  type="text"
                  value={newUid}
                  onChange={e => setNewUid(e.target.value)}
                  placeholder="e.g. TECH-2025-045 or ADM-2024-009"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Assigned Role *
                  </label>
                  <select
                    value={newRole}
                    onChange={e => setNewRole(e.target.value as Role)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="TECHNICIAN">Technician</option>
                    <option value="ADMIN">College Authority</option>
                    <option value="STUDENT">Student</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Department
                  </label>
                  <input
                    type="text"
                    value={newDepartment}
                    onChange={e => setNewDepartment(e.target.value)}
                    placeholder="e.g. Electrical Maintenance"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all"
                >
                  Authorize & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
