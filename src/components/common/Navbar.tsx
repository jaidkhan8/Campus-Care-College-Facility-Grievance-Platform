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
  Sparkles,
  Menu,
  X,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  LayoutDashboard,
  FileText,
  Wrench,
  BookOpen,
  Code2,
  Shield,
  GraduationCap,
  ExternalLink,
  Lock,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  Plus
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
  onOpenCreateComplaint?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onToggleSidebar,
  isSidebarOpen,
  onOpenCreateComplaint
}) => {
  const { currentUser, logout, switchDemoUser, appMode, toggleAppMode } = useAuth();
  const { complaints, resetToSeedData } = useComplaints();
  const toast = useToast();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get recent updates from all complaints
  const recentUpdates = complaints
    .flatMap(c =>
      c.timelineUpdates.map(u => ({
        ...u,
        ticketId: c.ticketId,
        complaintTitle: c.title
      }))
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleResetData = () => {
    resetToSeedData();
    setIsProfileDropdownOpen(false);
    toast.success('Database Reset', 'Initial demo seed data restored successfully.');
  };

  const handleRoleSwitch = (role: Role) => {
    if (appMode === 'PRODUCTION') {
      toast.error('Restricted in Production', 'User roles are strictly stored in the database. Role switching is disabled in Production Mode.');
      return;
    }
    switchDemoUser(role);
    setIsProfileDropdownOpen(false);
    onNavigate('default');
    toast.info('Role Switched', `Active persona switched to ${role} (Demo Mode).`);
  };

  const handleToggleMode = () => {
    toggleAppMode();
    const newMode = appMode === 'DEMO' ? 'PRODUCTION' : 'DEMO';
    toast.info('App Mode Toggled', `Switched to ${newMode} Mode.`);
  };

  const getRoleBadge = () => {
    if (!currentUser) return null;
    switch (currentUser.role) {
      case 'ADMIN':
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            Admin
          </span>
        );
      case 'TECHNICIAN':
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Technician
          </span>
        );
      case 'STUDENT':
      default:
        return (
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Student
          </span>
        );
    }
  };

  const navLinks = [
    {
      id: 'default',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: 'technicians',
      label: 'Technicians',
      icon: <Wrench className="w-4 h-4" />
    },
    {
      id: 'learning',
      label: 'Knowledge Base',
      icon: <BookOpen className="w-4 h-4" />
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3">
            {currentUser && onToggleSidebar && (
              <button
                id="sidebar-toggle-button"
                onClick={onToggleSidebar}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              id="header-brand-logo-btn"
              onClick={() => onNavigate(currentUser ? 'default' : 'landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-xs group-hover:bg-indigo-700 transition-colors">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm tracking-tight leading-none group-hover:text-indigo-600 transition-colors">
                    Campus Care
                  </span>
                  
                  {/* Mode Indicator Pill */}
                  {appMode === 'DEMO' ? (
                    <span 
                      title="Demo Mode: Quick persona switching is enabled for evaluation."
                      className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Demo Mode
                    </span>
                  ) : (
                    <span 
                      title="Production Mode: Real DB roles & JWT authorization enforced."
                      className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                    >
                      <Lock className="w-2.5 h-2.5 text-emerald-600" />
                      Production Mode
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-normal mt-0.5 leading-none">
                  Campus Support Portal
                </span>
              </div>
            </button>
          </div>

          {/* Center: Clean Primary Navigation (Desktop) */}
          {currentUser && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => {
                const isActive =
                  currentTab === link.id ||
                  (link.id === 'default' &&
                    (currentTab === 'student-dashboard' ||
                      currentTab === 'admin-dashboard' ||
                      currentTab === 'technician-dashboard')) ||
                  (link.id === 'complaints' &&
                    (currentTab === 'student-complaints' ||
                      currentTab === 'admin-complaints' ||
                      currentTab === 'resolution-history'));

                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => onNavigate(link.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right: Mode Toggle, Notifications & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentUser ? (
              <>
                {/* Mode Switcher Toggle Button (Visible for all or admin) */}
                <button
                  onClick={handleToggleMode}
                  title={`Click to switch to ${appMode === 'DEMO' ? 'Production' : 'Demo'} Mode`}
                  className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                    appMode === 'DEMO'
                      ? 'bg-amber-50/70 border-amber-200 text-amber-800 hover:bg-amber-100/70'
                      : 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
                  }`}
                >
                  {appMode === 'DEMO' ? (
                    <>
                      <ToggleLeft className="w-4 h-4 text-amber-600" />
                      <span>Demo Mode</span>
                    </>
                  ) : (
                    <>
                      <ToggleRight className="w-4 h-4 text-emerald-600" />
                      <span>Production</span>
                    </>
                  )}
                </button>

                {/* Notification Bell with Dropdown */}
                <div className="relative" ref={notificationRef}>
                  <button
                    id="header-notification-btn"
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
                    title="Notifications"
                    aria-label="View notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {recentUpdates.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600" />
                    )}
                  </button>

                  {/* Notification Popover */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-scale-in">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Notifications & Activity</span>
                        <span className="text-[10px] text-slate-400 font-medium">Real-time log</span>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {recentUpdates.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No recent updates
                          </div>
                        ) : (
                          recentUpdates.map(update => (
                            <div key={update.id} className="p-3 hover:bg-slate-50 transition-colors">
                              <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="font-mono font-bold text-indigo-600">{update.ticketId}</span>
                                <span className="text-slate-400 text-[10px]">
                                  {new Date(update.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-xs text-slate-800 font-medium line-clamp-1">{update.complaintTitle}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{update.remarks}</p>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex justify-end">
                        <button
                          onClick={() => {
                            setIsNotificationOpen(false);
                            onNavigate('complaints');
                          }}
                          className="text-xs text-indigo-600 font-semibold hover:text-indigo-700"
                        >
                          View All Complaints →
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Avatar & Dropdown */}
                <div className="relative" ref={profileDropdownRef}>
                  <button
                    id="header-user-profile-btn"
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2.5 p-1 sm:px-2 py-1 rounded-lg hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
                    aria-label="User menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentUser.name.charAt(0)}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-semibold text-slate-900 leading-tight">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight">
                        {currentUser.department || 'Campus Member'}
                      </span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-scale-in">
                      {/* User Bio Header */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                              Current User
                            </span>
                            <h4 className="text-xs font-bold text-slate-900">{currentUser.name}</h4>
                          </div>
                          {getRoleBadge()}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {currentUser.department || 'Computer Science & Engineering'}
                        </p>
                      </div>

                      {/* Main Navigation Items */}
                      <div className="py-1">
                        <button
                          id="dropdown-profile-link"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onNavigate('profile');
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          <span>My Profile & Credentials</span>
                        </button>
                      </div>

                      {/* Role Switcher or Production Guard */}
                      {appMode === 'DEMO' ? (
                        <div className="py-2.5 px-3.5 border-t border-slate-100 bg-amber-50/40">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">
                              Switch Dashboard (Demo Mode)
                            </span>
                            <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold">
                              Testing
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mb-2">
                            Select a role to dynamically change the dashboard and navigation:
                          </p>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              onClick={() => handleRoleSwitch('STUDENT')}
                              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${
                                currentUser.role === 'STUDENT'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              <GraduationCap className="w-3 h-3" />
                              <span>Student</span>
                            </button>
                            <button
                              onClick={() => handleRoleSwitch('TECHNICIAN')}
                              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${
                                currentUser.role === 'TECHNICIAN'
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              <Wrench className="w-3 h-3" />
                              <span>Technician</span>
                            </button>
                            <button
                              onClick={() => handleRoleSwitch('ADMIN')}
                              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex flex-col items-center justify-center gap-0.5 ${
                                currentUser.role === 'ADMIN'
                                  ? 'bg-purple-600 text-white shadow-xs'
                                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              <Shield className="w-3 h-3" />
                              <span>Admin</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="py-2.5 px-3.5 border-t border-slate-100 bg-slate-50/70">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                            <Lock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Production Mode Active</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                            Role is strictly locked to database record. Frontend role switching is disabled.
                          </p>
                        </div>
                      )}

                      {/* Developer & Admin Utilities */}
                      <div className="py-1 border-t border-slate-100">
                        <button
                          onClick={handleToggleMode}
                          className="w-full px-4 py-1.5 text-left text-[11px] text-slate-600 hover:bg-slate-50 flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Settings className="w-3.5 h-3.5 text-slate-400" />
                            <span>Toggle Mode (Demo / Prod)</span>
                          </span>
                          <span className="text-[10px] font-bold text-indigo-600 font-mono">
                            {appMode}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onNavigate('api-explorer');
                          }}
                          className="w-full px-4 py-1.5 text-left text-[11px] text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <Code2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>REST API Sandbox</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onNavigate('learning');
                          }}
                          className="w-full px-4 py-1.5 text-left text-[11px] text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span>Architecture & Viva Q&A</span>
                        </button>
                        <button
                          onClick={handleResetData}
                          className="w-full px-4 py-1.5 text-left text-[11px] text-slate-600 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                          <span>Reset Demo Database</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          id="dropdown-logout-btn"
                          onClick={() => {
                            setIsProfileDropdownOpen(false);
                            logout();
                            onNavigate('landing');
                            toast.info('Logged Out', 'You have been signed out of your account.');
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors font-semibold"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {onOpenCreateComplaint && (
                  <button
                    id="navbar-report-complaint-guest-btn"
                    onClick={onOpenCreateComplaint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Report Complaint</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
