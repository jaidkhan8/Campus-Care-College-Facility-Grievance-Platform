import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { UserRole } from '../../types';
import {
  Bell,
  GraduationCap,
  Shield,
  Wrench,
  LogOut,
  RotateCcw,
  BookOpen,
  Code2,
  Menu,
  ChevronDown,
  User as UserIcon
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate, onToggleSidebar }) => {
  const { currentUser, logout, switchRole } = useAuth();
  const { resetToSeedData, stats } = useComplaints();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'TECHNICIAN':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'STUDENT':
      default:
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-3.5 h-3.5" />;
      case 'TECHNICIAN':
        return <Wrench className="w-3.5 h-3.5" />;
      case 'STUDENT':
      default:
        return <GraduationCap className="w-3.5 h-3.5" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Brand and Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          <button
            id="sidebar-toggle-btn"
            onClick={onToggleSidebar}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div 
            onClick={() => onNavigate('landing')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-base tracking-tight leading-none">SmartCampus</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">Portal</span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Complaint & Triage Management</p>
            </div>
          </div>
        </div>

        {/* Center: Quick Learning Mode & API Explorer tabs */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            id="nav-learning-hub-btn"
            onClick={() => onNavigate('learning')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'learning'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
            Interview & Architecture Guide
          </button>

          <button
            id="nav-api-explorer-btn"
            onClick={() => onNavigate('api-explorer')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'api-explorer'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/50'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            API & Postman Tester
          </button>
        </div>

        {/* Right Side: Role Quick Switcher, Seed Reset, and User Profile */}
        <div className="flex items-center gap-2.5">
          {/* Quick Role Switcher for Interview / Testing */}
          <div className="relative">
            <button
              id="role-switch-dropdown-btn"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors border border-slate-200/70"
            >
              <span className="text-slate-500 text-[11px] hidden sm:inline">Role:</span>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[11px] font-semibold ${currentUser ? getRoleColor(currentUser.role) : ''}`}>
                {currentUser ? getRoleIcon(currentUser.role) : null}
                {currentUser?.role}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch User View
                </div>
                <button
                  id="switch-to-student-btn"
                  onClick={() => {
                    switchRole('STUDENT');
                    setShowRoleMenu(false);
                    onNavigate('student-dashboard');
                  }}
                  className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 text-slate-700"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <div>
                    <div className="font-semibold">Student (Emily Watson)</div>
                    <div className="text-[10px] text-slate-400">File complaints, track status</div>
                  </div>
                </button>
                <button
                  id="switch-to-admin-btn"
                  onClick={() => {
                    switchRole('ADMIN');
                    setShowRoleMenu(false);
                    onNavigate('admin-dashboard');
                  }}
                  className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 text-slate-700"
                >
                  <Shield className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="font-semibold">Admin (Dr. Arthur)</div>
                    <div className="text-[10px] text-slate-400">Triage, assign technicians, stats</div>
                  </div>
                </button>
                <button
                  id="switch-to-tech-btn"
                  onClick={() => {
                    switchRole('TECHNICIAN');
                    setShowRoleMenu(false);
                    onNavigate('technician-dashboard');
                  }}
                  className="w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-slate-50 text-slate-700"
                >
                  <Wrench className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="font-semibold">Technician (Alex Miller)</div>
                    <div className="text-[10px] text-slate-400">Resolve tasks, add remarks</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Reset Seed Data Button */}
          <button
            id="reset-seed-data-btn"
            onClick={() => {
              if (window.confirm('Reset complaints database to initial seed dataset?')) {
                resetToSeedData();
              }
            }}
            title="Reset test data to initial seed records"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* User Profile / Menu */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden xl:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">{currentUser?.name}</div>
                <div className="text-[10px] text-slate-500 leading-tight">{currentUser?.department || currentUser?.email}</div>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-800">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                </div>
                
                <button
                  id="view-profile-btn"
                  onClick={() => {
                    onNavigate('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  My Profile & Credentials
                </button>

                <button
                  id="header-logout-btn"
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                    onNavigate('login');
                  }}
                  className="w-full px-3.5 py-2 text-left text-xs flex items-center gap-2 text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
