import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useToast } from './Toast';
import { Role } from '../../types';
import {
  Bell,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
  Shield,
  GraduationCap,
  Wrench,
  CheckCircle2,
  Clock,
  Search,
  RotateCcw,
  Sparkles,
  Lock,
  Calendar,
  Plus
} from 'lucide-react';

interface DashboardHeaderProps {
  onOpenCreateComplaint?: () => void;
  onOpenTrackComplaint?: () => void;
  onOpenNotifications?: () => void;
  onNavigate: (tab: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onOpenCreateComplaint,
  onOpenTrackComplaint,
  onOpenNotifications,
  onNavigate
}) => {
  const { currentUser, logout, switchDemoUser, appMode, toggleAppMode } = useAuth();
  const { complaints, resetToSeedData } = useComplaints();
  const toast = useToast();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  // Dynamic Time of Day Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = currentUser.name.split(' ')[0] || 'User';
    if (hour < 12) return `Good Morning, ${firstName}!`;
    if (hour < 17) return `Good Afternoon, ${firstName}!`;
    return `Good Evening, ${firstName}!`;
  };

  // Fixed or dynamic date (August 14, 2026 as per design context)
  const currentDateFormatted = 'Friday, August 14, 2026';

  const handleRoleChange = (newRole: Role) => {
    if (appMode === 'PRODUCTION') {
      toast.error(
        'Action Restricted',
        'Role switching is disabled in Production Mode. Real database authorization is active.'
      );
      return;
    }
    switchDemoUser(newRole);
    setIsProfileOpen(false);
    toast.info('Role Switched', `Switched active dashboard to ${newRole}.`);
  };

  // Get recent updates
  const recentUpdates = complaints
    .flatMap(c =>
      c.timelineUpdates.map(u => ({
        ...u,
        ticketId: c.ticketId,
        complaintTitle: c.title
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left: Greeting & Current Date */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {getGreeting()}
        </h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          Here's what's happening with your campus requests.
        </p>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mt-1.5">
          <Calendar className="w-3.5 h-3.5" />
          <span>{currentDateFormatted}</span>
        </div>
      </div>

      {/* Right: Quick Search, Report Complaint, Notifications, Profile & Role Switcher */}
      <div className="flex items-center gap-2.5 sm:gap-3 self-start md:self-auto flex-wrap sm:flex-nowrap">
        
        {/* Prominent Report Campus Complaint Button */}
        {onOpenCreateComplaint && (
          <button
            id="header-report-complaint-btn"
            onClick={onOpenCreateComplaint}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer group shrink-0"
          >
            <div className="w-4 h-4 rounded-md bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
              <Plus className="w-3.5 h-3.5 text-white stroke-[3]" />
            </div>
            <span>Report Campus Complaint</span>
          </button>
        )}

        {/* Search / Track Complaint Quick Button */}
        {onOpenTrackComplaint && (
          <button
            onClick={onOpenTrackComplaint}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all shadow-2xs group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
            <span>Track Ticket...</span>
            <kbd className="text-[10px] font-mono bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
              CMP
            </kbd>
          </button>
        )}

        {/* Notifications Bell */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="p-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {/* Notifications Popover */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Notifications</h4>
                  <p className="text-[10px] text-slate-500">Live maintenance & ticket updates</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                  {recentUpdates.length} new
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {recentUpdates.map(u => (
                  <div key={u.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono font-bold text-indigo-600">{u.ticketId}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(u.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold line-clamp-1">{u.complaintTitle}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{u.remarks}</p>
                  </div>
                ))}
              </div>

              <div className="px-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    onNavigate('complaints');
                  }}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View All Tickets →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar, Name, Role & Department Pill */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 sm:pr-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left"
          >
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {currentUser.name.charAt(0)}
            </div>

            {/* Name, Role & Department */}
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide">
                  {currentUser.role === 'ADMIN' ? 'Administrator' : currentUser.role === 'TECHNICIAN' ? 'Technician' : 'Student'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[10px] text-slate-500 max-w-[130px] truncate">
                  {currentUser.department || 'Computer Science'}
                </span>
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* Profile & Role Switch Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              
              {/* User Details */}
              <div className="px-4 py-2.5 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Profile
                </span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">{currentUser.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-slate-600 font-medium">Current Role:</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {currentUser.role === 'ADMIN' ? 'Administrator' : currentUser.role === 'TECHNICIAN' ? 'Technician' : 'Student'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 font-mono truncate">{currentUser.email}</p>
                <p className="text-[11px] text-slate-500">{currentUser.department || 'Computer Science & Engineering'}</p>
              </div>

              {/* Role Switcher Section */}
              <div className="p-3 bg-slate-50/70 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                    Switch Dashboard
                  </span>
                  {appMode === 'DEMO' ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                      Demo Mode
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                      Prod Mode
                    </span>
                  )}
                </div>

                {appMode === 'DEMO' ? (
                  <div className="space-y-1">
                    {[
                      { role: 'STUDENT' as Role, label: 'Student', desc: 'Emily Watson (CS & Eng)' },
                      { role: 'TECHNICIAN' as Role, label: 'Technician', desc: 'Alex Miller (Electrical)' },
                      { role: 'ADMIN' as Role, label: 'Administrator', desc: 'Dr. Arthur Pendelton' }
                    ].map(item => {
                      const isSelected = currentUser.role === item.role;
                      return (
                        <button
                          key={item.role}
                          onClick={() => handleRoleChange(item.role)}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold shadow-xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-white' : 'border-slate-400'
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </span>
                            <div>
                              <div className="text-xs font-semibold">{item.label}</div>
                              <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {item.desc}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Locked in Production. Change user credentials via login.</span>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate('profile');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsNotificationsOpen(true);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <Bell className="w-4 h-4 text-slate-400" />
                  <span>Notifications</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    onNavigate('profile');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </button>
              </div>

              {/* Sign Out */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    logout();
                    onNavigate('login');
                    toast.info('Logged Out', 'Signed out successfully.');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors font-bold"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </header>
  );
};
