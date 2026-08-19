import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComplaintProvider } from './context/ComplaintContext';
import { ToastProvider } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminComplaintList } from './components/admin/AdminComplaintList';
import { AdminUsersList } from './components/admin/AdminUsersList';
import { TechnicianDashboard } from './components/technician/TechnicianDashboard';
import { LearningHub } from './components/learning/LearningHub';
import { ApiExplorer } from './components/explorer/ApiExplorer';
import { ProfileView } from './components/profile/ProfileView';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { LandingPage } from './components/landing/LandingPage';
import { CreateComplaintModal } from './components/student/CreateComplaintModal';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('default');
  const [isGuestCreateModalOpen, setIsGuestCreateModalOpen] = useState(false);

  // If user is not logged in
  if (!currentUser) {
    if (currentTab === 'login') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar 
            currentTab={currentTab} 
            onNavigate={setCurrentTab} 
            onOpenCreateComplaint={() => setIsGuestCreateModalOpen(true)}
          />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <LoginPage
              onSwitchToRegister={() => setCurrentTab('register')}
              onContinueAsGuest={() => setCurrentTab('landing')}
            />
          </main>
          {isGuestCreateModalOpen && (
            <CreateComplaintModal
              isOpen={isGuestCreateModalOpen}
              onClose={() => setIsGuestCreateModalOpen(false)}
              onNavigateToComplaints={() => setCurrentTab('login')}
            />
          )}
        </div>
      );
    }

    if (currentTab === 'register') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar 
            currentTab={currentTab} 
            onNavigate={setCurrentTab} 
            onOpenCreateComplaint={() => setIsGuestCreateModalOpen(true)}
          />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <RegisterPage onSwitchToLogin={() => setCurrentTab('login')} />
          </main>
          {isGuestCreateModalOpen && (
            <CreateComplaintModal
              isOpen={isGuestCreateModalOpen}
              onClose={() => setIsGuestCreateModalOpen(false)}
              onNavigateToComplaints={() => setCurrentTab('login')}
            />
          )}
        </div>
      );
    }

    if (currentTab === 'learning') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar 
            currentTab={currentTab} 
            onNavigate={setCurrentTab} 
            onOpenCreateComplaint={() => setIsGuestCreateModalOpen(true)}
          />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <LearningHub />
          </main>
          {isGuestCreateModalOpen && (
            <CreateComplaintModal
              isOpen={isGuestCreateModalOpen}
              onClose={() => setIsGuestCreateModalOpen(false)}
              onNavigateToComplaints={() => setCurrentTab('login')}
            />
          )}
        </div>
      );
    }

    if (currentTab === 'api-explorer') {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navbar 
            currentTab={currentTab} 
            onNavigate={setCurrentTab} 
            onOpenCreateComplaint={() => setIsGuestCreateModalOpen(true)}
          />
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <ApiExplorer />
          </main>
          {isGuestCreateModalOpen && (
            <CreateComplaintModal
              isOpen={isGuestCreateModalOpen}
              onClose={() => setIsGuestCreateModalOpen(false)}
              onNavigateToComplaints={() => setCurrentTab('login')}
            />
          )}
        </div>
      );
    }

    // Default Landing Page
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar 
          currentTab={currentTab} 
          onNavigate={setCurrentTab} 
          onOpenCreateComplaint={() => setIsGuestCreateModalOpen(true)}
        />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <LandingPage
            onGoToLogin={() => setCurrentTab('login')}
            onGoToRegister={() => setCurrentTab('register')}
            onGoToLearning={() => setCurrentTab('learning')}
            onOpenReportComplaint={() => setIsGuestCreateModalOpen(true)}
          />
        </main>
        {isGuestCreateModalOpen && (
          <CreateComplaintModal
            isOpen={isGuestCreateModalOpen}
            onClose={() => setIsGuestCreateModalOpen(false)}
            onNavigateToComplaints={() => setCurrentTab('login')}
          />
        )}
      </div>
    );
  }

  // Active View Router for Authenticated Users (Wrapped in the 3-Column DashboardLayout)
  const renderDashboardView = () => {
    // 1. Knowledge Base / Help & Support
    if (currentTab === 'learning') {
      return <LearningHub />;
    }

    // 2. REST API Explorer
    if (currentTab === 'api-explorer') {
      return <ApiExplorer />;
    }

    // 3. User Profile & Settings
    if (currentTab === 'profile') {
      return <ProfileView />;
    }

    // 4. Role: STUDENT
    if (currentUser.role === 'STUDENT') {
      if (currentTab === 'resolution-history') {
        return <StudentDashboard initialStatusFilter="RESOLVED" onNavigate={setCurrentTab} />;
      }
      if (currentTab === 'complaints' || currentTab === 'student-complaints') {
        return <StudentDashboard initialStatusFilter="ALL" onNavigate={setCurrentTab} />;
      }
      return <StudentDashboard onNavigate={setCurrentTab} />;
    }

    // 5. Role: TECHNICIAN
    if (currentUser.role === 'TECHNICIAN') {
      if (currentTab === 'resolution-history') {
        return <TechnicianDashboard initialTab="resolved" />;
      }
      return <TechnicianDashboard />;
    }

    // 6. Role: ADMIN
    if (currentUser.role === 'ADMIN') {
      if (currentTab === 'admin-users' || currentTab === 'technicians') {
        return <AdminUsersList />;
      }
      if (currentTab === 'complaints' || currentTab === 'admin-complaints') {
        return <AdminComplaintList />;
      }
      if (currentTab === 'resolution-history') {
        return <AdminComplaintList initialStatusFilter="RESOLVED" />;
      }
      return <AdminDashboard onNavigate={setCurrentTab} />;
    }

    return <StudentDashboard onNavigate={setCurrentTab} />;
  };

  const isFullWidthTab = currentTab === 'learning' || currentTab === 'api-explorer' || currentTab === 'profile' || currentTab === 'admin-users' || currentTab === 'complaints' || currentTab === 'admin-complaints' || currentTab === 'resolution-history';

  return (
    <DashboardLayout
      currentTab={currentTab}
      onNavigate={setCurrentTab}
      showRightPanel={!isFullWidthTab}
    >
      {renderDashboardView()}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ComplaintProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </ComplaintProvider>
    </AuthProvider>
  );
}
