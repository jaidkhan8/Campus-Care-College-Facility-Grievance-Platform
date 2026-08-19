import React from 'react';
import { ComplaintStatus, ComplaintPriority } from '../../types';
import { Clock, CheckCircle2, AlertCircle, Wrench, ShieldAlert, ArrowDownCircle, MinusCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-medium tracking-tight',
    md: 'px-2.5 py-1 text-xs font-semibold tracking-tight',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  }[size];

  switch (status) {
    case 'PENDING':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs ${sizeClasses}`}>
          {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          <span>Pending</span>
        </span>
      );
    case 'ASSIGNED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/90 shadow-2xs ${sizeClasses}`}>
          {showIcon && <Wrench className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
          <span>Assigned</span>
        </span>
      );
    case 'IN_PROGRESS':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200/90 shadow-2xs ${sizeClasses}`}>
          {showIcon && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
          )}
          <span>In Progress</span>
        </span>
      );
    case 'RESOLVED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/90 shadow-2xs ${sizeClasses}`}>
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
          <span>Resolved</span>
        </span>
      );
    default:
      return null;
  }
};

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md', showIcon = true }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] font-medium tracking-tight',
    md: 'px-2.5 py-1 text-xs font-semibold tracking-tight',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  }[size];

  switch (priority) {
    case 'HIGH':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/90 shadow-2xs ${sizeClasses}`}>
          {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
          <span>High Priority</span>
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs ${sizeClasses}`}>
          {showIcon && <MinusCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
          <span>Medium</span>
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs ${sizeClasses}`}>
          {showIcon && <ArrowDownCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />}
          <span>Low</span>
        </span>
      );
    default:
      return null;
  }
};

