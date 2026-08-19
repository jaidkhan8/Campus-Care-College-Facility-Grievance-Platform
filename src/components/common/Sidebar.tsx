import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useToast } from './Toast';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Search,
  CheckCircle2,
  HelpCircle,
  Settings,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Shield,
  Wrench,
  Users,
  Layers,
  ShieldCheck,
  Code2,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onOpenCreateComplaint?: () => void;
  onOpenTrackComplaint?: () => void;
  onOpenNotifications?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  isOpen,
  onToggle,
  onOpenCreateComplaint,
  onOpenTrackComplaint,
  onOpenNotifications
}) => {
  const { currentUser, logout } = useAuth();
  const { complaints, auditLogs } = useComplaints();
  const toast = useToast();

  if (!currentUser) return null;

  const role = currentUser.role;

  // Counts
  const myComplaintsCount = complaints.filter(
    c => c.studentId === currentUser.id || c.studentEmail === currentUser.email
  ).length;

  const assignedTechCount = complaints.filter(
    c => c.assignment?.technicianId === currentUser.id && c.status !== 'RESOLVED' && c.status !== 'CLOSED'
  ).length;

  const resolvedCount = complaints.filter(
    c =>
      (c.studentId === currentUser.id || role === 'ADMIN' || c.assignment?.technicianId === currentUser.id) &&
      (c.status === 'RESOLVED' || c.status === 'CLOSED')
  ).length;

  const totalAllCount = complaints.length;

  // Role-based Nav Structure
  const getNavItems = () => {
    if (role === 'ADMIN') {
      return [
        {
          id: 'default',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
          badge: null
        },
        {
          id: 'complaints',
          label: 'Complaint Queue',
          icon: <FileText className="w-5 h-5 shrink-0" />,
          badge: totalAllCount
        },
        {
          id: 'track',
          label: 'Track Complaint',
          icon: <Search className="w-5 h-5 shrink-0" />,
          isAction: 'track',
          badge: null
        },
        {
          id: 'technicians',
          label: 'Technicians & Users',
          icon: <Users className="w-5 h-5 shrink-0" />,
          badge: null
        },
        {
          id: 'admin-categories',
          label: 'Categories & SLA',
          icon: <Layers className="w-5 h-5 shrink-0" />,
          badge: null
        },
        {
          id: 'admin-audit',
          label: 'Audit & Security',
          icon: <ShieldCheck className="w-5 h-5 shrink-0" />,
          badge: auditLogs.length > 0 ? auditLogs.length : null
        },
        {
          id: 'resolution-history',
          label: 'Resolution History',
          icon: <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />,
          badge: resolvedCount > 0 ? resolvedCount : null
        },
        {
          id: 'learning',
          label: 'Help & Support',
          icon: <HelpCircle className="w-5 h-5 shrink-0" />,
          badge: null
        },
        {
          id: 'profile',
          label: 'Settings',
          icon: <Settings className="w-5 h-5 shrink-0" />,
          badge: null
        }
      ];
    }

    if (role === 'TECHNICIAN') {
      return [
        {
          id: 'default',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
          badge: null
        },
        {
          id: 'complaints',
          label: 'Assigned Work',
          icon: <Wrench className="w-5 h-5 shrink-0" />,
          badge: assignedTechCount
        },
        {
          id: 'track',
          label: 'Track Complaint',
          icon: <Search className="w-5 h-5 shrink-0" />,
          isAction: 'track',
          badge: null
        },
        {
          id: 'resolution-history',
          label: 'Resolution History',
          icon: <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />,
          badge: resolvedCount > 0 ? resolvedCount : null
        },
        {
          id: 'learning',
          label: 'Help & Support',
          icon: <HelpCircle className="w-5 h-5 shrink-0" />,
          badge: null
        },
        {
          id: 'profile',
          label: 'Settings',
          icon: <Settings className="w-5 h-5 shrink-0" />,
          badge: null
        }
      ];
    }

    // Default: Student Navigation strictly per prompt
    return [
      {
        id: 'default',
        label: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
        badge: null
      },
      {
        id: 'complaints',
        label: 'My Complaints',
        icon: <FileText className="w-5 h-5 shrink-0" />,
        badge: myComplaintsCount > 0 ? myComplaintsCount : null
      },
      {
        id: 'new-complaint',
        label: 'New Complaint',
        icon: <PlusCircle className="w-5 h-5 shrink-0 text-indigo-400" />,
        isAction: 'create',
        badge: null
      },
      {
        id: 'track',
        label: 'Track Complaint',
        icon: <Search className="w-5 h-5 shrink-0" />,
        isAction: 'track',
        badge: null
      },
      {
        id: 'resolution-history',
        label: 'Resolution History',
        icon: <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />,
        badge: resolvedCount > 0 ? resolvedCount : null
      },
      {
        id: 'learning',
        label: 'Help & Support',
        icon: <HelpCircle className="w-5 h-5 shrink-0" />,
        badge: null
      },
      {
        id: 'profile',
        label: 'Settings',
        icon: <Settings className="w-5 h-5 shrink-0" />,
        badge: null
      }
    ];
  };

  const navItems = getNavItems();

  const handleItemClick = (item: ReturnType<typeof getNavItems>[0]) => {
    if (item.isAction === 'create') {
      if (onOpenCreateComplaint) onOpenCreateComplaint();
      return;
    }
    if (item.isAction === 'track') {
      if (onOpenTrackComplaint) onOpenTrackComplaint();
      return;
    }
    if (item.id === 'technicians' && role === 'ADMIN') {
      onNavigate('admin-users');
      return;
    }
    onNavigate(item.id);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Slim Dark Vertical Sidebar */}
      <aside
        id="campus-care-sidebar"
        className={`fixed md:sticky top-0 z-40 h-screen bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out shrink-0 select-none shadow-2xl ${
          isOpen
            ? 'translate-x-0 w-64'
            : '-translate-x-full md:translate-x-0 md:w-[76px]'
        }`}
      >
        {/* Top Logo / Brand Section */}
        <div className="h-16 flex items-center px-4.5 border-b border-slate-800/80 bg-slate-950/50 justify-between">
          <div
            onClick={() => onNavigate('default')}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          >
            {/* Campus Care Logo Icon */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform shrink-0">
              <span className="text-xl">🏛️</span>
            </div>

            {isOpen && (
              <div className="min-w-0 transition-opacity duration-200">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight leading-none">
                    Campus Care
                  </span>
                </div>
                <p className="text-[10px] text-indigo-300 font-medium tracking-wide truncate mt-0.5">
                  Campus Support Portal
                </p>
              </div>
            )}
          </div>

          {/* Toggle button on expanded */}
          {isOpen && (
            <button
              onClick={onToggle}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden md:block"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto scrollbar-none">
          {navItems.map(item => {
            const isActive =
              (item.id === 'default' &&
                (currentTab === 'default' ||
                  currentTab === 'student-dashboard' ||
                  currentTab === 'admin-dashboard' ||
                  currentTab === 'technician-dashboard')) ||
              (item.id === 'complaints' &&
                (currentTab === 'complaints' ||
                  currentTab === 'student-complaints' ||
                  currentTab === 'admin-complaints')) ||
              (item.id === 'technicians' &&
                (currentTab === 'technicians' || currentTab === 'admin-users')) ||
              currentTab === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  } ${!isOpen ? 'justify-center px-0' : ''}`}
                >
                  <span
                    className={`${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </span>

                  {isOpen && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {isOpen && item.badge !== null && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-700 text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Floating Tooltip when collapsed */}
                {!isOpen && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex items-center pointer-events-none">
                    <div className="bg-slate-950 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-800 whitespace-nowrap">
                      {item.label}
                      {item.badge !== null && (
                        <span className="ml-1.5 text-[10px] bg-indigo-600 px-1.5 py-0.2 rounded-full font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Section: Notifications, Settings, Logout */}
        <div className="p-3 border-t border-slate-800/80 space-y-1 bg-slate-950/40">
          
          {/* Notifications button */}
          <div className="relative group">
            <button
              onClick={onOpenNotifications || (() => toast.info('Notifications', 'No new unread alerts.'))}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/70 transition-colors ${
                !isOpen ? 'justify-center px-0' : ''
              }`}
            >
              <div className="relative shrink-0">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500" />
              </div>
              {isOpen && <span className="truncate">Notifications</span>}
            </button>
            {!isOpen && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex items-center pointer-events-none">
                <div className="bg-slate-950 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-800 whitespace-nowrap">
                  Notifications
                </div>
              </div>
            )}
          </div>

          {/* Logout button */}
          <div className="relative group">
            <button
              onClick={() => {
                logout();
                onNavigate('login');
                toast.info('Logged Out', 'Signed out successfully.');
              }}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors ${
                !isOpen ? 'justify-center px-0' : ''
              }`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {isOpen && <span className="truncate">Logout</span>}
            </button>
            {!isOpen && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 hidden group-hover:flex items-center pointer-events-none">
                <div className="bg-slate-950 text-rose-300 text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-800 whitespace-nowrap">
                  Logout
                </div>
              </div>
            )}
          </div>

          {/* Expand Toggle icon when collapsed */}
          {!isOpen && (
            <div className="pt-2 flex justify-center">
              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-colors"
                title="Expand sidebar"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
