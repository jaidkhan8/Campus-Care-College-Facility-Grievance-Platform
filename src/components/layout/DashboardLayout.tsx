import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../common/Sidebar';
import { DashboardHeader } from '../common/DashboardHeader';
import { RightPanel } from '../common/RightPanel';
import { CreateComplaintModal } from '../student/CreateComplaintModal';
import { TrackComplaintModal } from '../complaint/TrackComplaintModal';
import { ComplaintDetailModal } from '../complaint/ComplaintDetailModal';
import { useComplaints } from '../../context/ComplaintContext';
import { Complaint } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentTab: string;
  onNavigate: (tab: string) => void;
  showRightPanel?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentTab,
  onNavigate,
  showRightPanel = true
}) => {
  const { currentUser } = useAuth();
  const { complaints } = useComplaints();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const handleOpenComplaintByTicket = (ticketIdOrEntity: string) => {
    const match = complaints.find(
      c =>
        c.ticketId.toLowerCase() === ticketIdOrEntity.toLowerCase() ||
        c.id.toString() === ticketIdOrEntity
    );
    if (match) {
      setSelectedComplaint(match);
    } else {
      setIsTrackModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* 1. Slim Dark Vertical Sidebar (70-80px collapsible) */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={onNavigate}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenCreateComplaint={() => setIsCreateModalOpen(true)}
        onOpenTrackComplaint={() => setIsTrackModalOpen(true)}
      />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dashboard Inner Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 max-w-[1600px] w-full mx-auto">
          
          {/* 2. Main Dashboard Content Column */}
          <main className="flex-1 min-w-0">
            {/* Top Greeting & User Header */}
            <DashboardHeader
              onOpenCreateComplaint={() => setIsCreateModalOpen(true)}
              onOpenTrackComplaint={() => setIsTrackModalOpen(true)}
              onNavigate={onNavigate}
            />

            {/* Dynamic View Children */}
            {children}
          </main>

          {/* 3. Right-Side Panel (Calendar, Upcoming Schedule, Recent Activity) */}
          {showRightPanel && (
            <div className="w-full lg:w-80 shrink-0">
              <RightPanel
                onOpenComplaint={handleOpenComplaintByTicket}
                onOpenNewComplaint={() => setIsCreateModalOpen(true)}
              />
            </div>
          )}

        </div>
      </div>

      {/* New Complaint Modal */}
      {isCreateModalOpen && (
        <CreateComplaintModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onNavigateToComplaints={() => {
            onNavigate('complaints');
            setIsCreateModalOpen(false);
          }}
        />
      )}

      {/* Track Complaint Modal */}
      {isTrackModalOpen && (
        <TrackComplaintModal
          isOpen={isTrackModalOpen}
          onClose={() => setIsTrackModalOpen(false)}
          onSelectComplaint={c => setSelectedComplaint(c)}
        />
      )}

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailModal
          isOpen={Boolean(selectedComplaint)}
          onClose={() => setSelectedComplaint(null)}
          complaint={selectedComplaint}
        />
      )}
    </div>
  );
};
