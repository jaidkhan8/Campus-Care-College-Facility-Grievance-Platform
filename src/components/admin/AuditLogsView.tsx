import React, { useState } from 'react';
import { useComplaints } from '../../context/ComplaintContext';
import { AuditLog } from '../../types';
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  Activity,
  FileText,
  Tag,
  Key,
  Shield,
  RotateCcw
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useComplaints();
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(log.entityId).toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.ipAddress && log.ipAddress.includes(searchQuery));

    const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter;

    return matchesSearch && matchesEntity;
  });

  const getActionBadge = (action: string) => {
    if (action.includes('CREATE') || action.includes('FILE')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {action}
        </span>
      );
    }
    if (action.includes('ASSIGN')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          {action}
        </span>
      );
    }
    if (action.includes('STATUS') || action.includes('UPDATE')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          {action}
        </span>
      );
    }
    if (action.includes('CLOSE')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          {action}
        </span>
      );
    }
    if (action.includes('DELETE')) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          {action}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        {action}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="text-[10px] font-semibold text-purple-700">Admin</span>;
      case 'TECHNICIAN':
        return <span className="text-[10px] font-semibold text-blue-700">Tech</span>;
      case 'STUDENT':
      default:
        return <span className="text-[10px] font-semibold text-emerald-700">Student</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              System Audit & Security Logs
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Immutable trace of complaint creation, technician dispatches, status transitions, and administrative overrides.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 font-medium">
          Logged Events: <strong className="text-indigo-600 font-semibold">{filteredLogs.length}</strong> entries
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search action, user, ticket ID, IP address, or details..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={entityFilter}
              onChange={e => setEntityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden text-slate-700"
            >
              <option value="ALL">All Entity Types</option>
              <option value="COMPLAINT">Complaint Events</option>
              <option value="ASSIGNMENT">Dispatch Events</option>
              <option value="USER">User & Auth Events</option>
              <option value="CATEGORY">Category & SLA</option>
              <option value="SYSTEM">System Events</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No audit logs found matching current query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details & Remarks</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Timestamp */}
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      <div className="font-mono text-[11px] font-semibold text-slate-700">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Actor */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{log.userName}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {getRoleBadge(log.userRole)}
                        <span className="text-[10px] text-slate-400 font-mono">#{log.userId}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>

                    {/* Entity */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px]">
                      <span className="text-slate-500">{log.entityType}:</span>{' '}
                      <strong className="text-indigo-600">{log.entityId}</strong>
                    </td>

                    {/* Details */}
                    <td className="py-3 px-4 max-w-md">
                      <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                        {log.details}
                      </p>
                    </td>

                    {/* IP Address */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[11px] text-slate-400">
                      {log.ipAddress || '10.20.1.104'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
