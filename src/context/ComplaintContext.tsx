import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  ComplaintStatus,
  ComplaintPriority,
  Category,
  DashboardStats,
  AuditLog
} from '../types';
import { SEED_COMPLAINTS, SEED_CATEGORIES, SEED_AUDIT_LOGS } from '../data/seedData';
import { useAuth } from './AuthContext';

interface CreateComplaintInput {
  title: string;
  description: string;
  categoryId: number;
  priority?: ComplaintPriority;
  location?: string;
  imageUrl?: string;
}

interface ComplaintContextType {
  complaints: Complaint[];
  categories: Category[];
  auditLogs: AuditLog[];
  stats: DashboardStats;
  createComplaint: (input: CreateComplaintInput) => Promise<Complaint>;
  assignComplaint: (complaintId: number, technicianId: number, notes?: string) => Promise<void>;
  updateStatus: (complaintId: number, newStatus: ComplaintStatus, remarks: string) => Promise<void>;
  updatePriority: (complaintId: number, newPriority: ComplaintPriority) => Promise<void>;
  closeComplaint: (complaintId: number, rating: number, feedback?: string) => Promise<void>;
  deleteComplaint: (complaintId: number) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: number, updates: Partial<Category>) => Promise<void>;
  resetToSeedData: () => void;
  getComplaintById: (id: number) => Complaint | undefined;
  logAuditEvent: (action: string, entityType: AuditLog['entityType'], entityId: string | number, details: string) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const COMPLAINTS_STORAGE_KEY = 'smart_campus_complaints_db';
const CATEGORIES_STORAGE_KEY = 'smart_campus_categories_db';
const AUDIT_LOGS_STORAGE_KEY = 'smart_campus_audit_logs_db';

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, allUsers } = useAuth();

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_CATEGORIES;
    } catch {
      return SEED_CATEGORIES;
    }
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    try {
      const stored = localStorage.getItem(COMPLAINTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_COMPLAINTS;
    } catch {
      return SEED_COMPLAINTS;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const stored = localStorage.getItem(AUDIT_LOGS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : SEED_AUDIT_LOGS;
    } catch {
      return SEED_AUDIT_LOGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(complaints));
    } catch (e) {
      console.error('Failed to save complaints to localStorage', e);
    }
  }, [complaints]);

  useEffect(() => {
    try {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(auditLogs));
    } catch (e) {
      console.error('Failed to save audit logs to localStorage', e);
    }
  }, [auditLogs]);

  const logAuditEvent = (
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string | number,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      action,
      entityType,
      entityId,
      userId: currentUser?.id || 0,
      userName: currentUser?.name || 'System / Anonymous',
      userRole: currentUser?.role || 'STUDENT',
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '10.20.1.' + Math.floor(10 + Math.random() * 200)
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Compute live dashboard stats
  const stats: DashboardStats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    assigned: complaints.filter(c => c.status === 'ASSIGNED').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
    closed: complaints.filter(c => c.status === 'CLOSED').length,
    byCategory: complaints.reduce((acc, c) => {
      acc[c.categoryName] = (acc[c.categoryName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byPriority: complaints.reduce((acc, c) => {
      acc[c.priority] = (acc[c.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    avgResolutionHours: 4.8
  };

  const createComplaint = async (input: CreateComplaintInput): Promise<Complaint> => {
    const studentUser = currentUser || {
      id: 1,
      name: 'Guest Student',
      email: 'student@campus.edu',
      role: 'STUDENT' as const,
      department: 'Computer Science'
    };

    const category = categories.find(c => c.id === input.categoryId) || categories[0];
    const shortCat = category.name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, '');
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const ticketId = `${shortCat || 'CMP'}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newComplaint: Complaint = {
      id: complaints.length > 0 ? Math.max(...complaints.map(c => c.id)) + 1 : 1,
      ticketId,
      studentId: studentUser.id,
      studentName: studentUser.name,
      studentEmail: studentUser.email,
      studentDepartment: studentUser.department,
      categoryId: category.id,
      categoryName: category.name,
      title: input.title.trim(),
      description: input.description.trim(),
      priority: input.priority || 'MEDIUM',
      status: 'PENDING',
      location: input.location?.trim() || 'Campus Main Grounds',
      imageUrl: input.imageUrl,
      createdAt: now,
      updatedAt: now,
      timelineUpdates: [
        {
          id: Date.now(),
          complaintId: complaints.length + 1,
          updatedBy: studentUser.id,
          updaterName: studentUser.name,
          updaterRole: studentUser.role,
          previousStatus: null,
          newStatus: 'PENDING',
          remarks: 'Complaint filed and queued for administrative triage.',
          createdAt: now
        }
      ]
    };

    setComplaints(prev => [newComplaint, ...prev]);

    logAuditEvent(
      'COMPLAINT_CREATED',
      'COMPLAINT',
      ticketId,
      `New complaint filed: "${newComplaint.title}" [Category: ${category.name}, Priority: ${newComplaint.priority}]`
    );

    return newComplaint;
  };

  const assignComplaint = async (complaintId: number, technicianId: number, notes?: string) => {
    if (!currentUser) return;
    const technician = allUsers.find(u => u.id === technicianId);
    if (!technician) throw new Error('Selected technician does not exist');

    const now = new Date().toISOString();
    let ticketId = '';

    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== complaintId) return c;
        ticketId = c.ticketId;

        const updatedTimeline = [
          ...c.timelineUpdates,
          {
            id: Date.now(),
            complaintId: c.id,
            updatedBy: currentUser.id,
            updaterName: currentUser.name,
            updaterRole: currentUser.role,
            previousStatus: c.status,
            newStatus: 'ASSIGNED' as ComplaintStatus,
            remarks: `Assigned to technician ${technician.name} (${technician.department || 'Maintenance'}). Notes: ${notes || 'None provided'}`,
            createdAt: now
          }
        ];

        return {
          ...c,
          status: 'ASSIGNED',
          updatedAt: now,
          assignment: {
            id: Date.now(),
            complaintId: c.id,
            technicianId: technician.id,
            technicianName: technician.name,
            technicianEmail: technician.email,
            assignedBy: currentUser.id,
            assignedByName: currentUser.name,
            assignedAt: now,
            notes
          },
          timelineUpdates: updatedTimeline
        };
      })
    );

    logAuditEvent(
      'TECHNICIAN_ASSIGNMENT',
      'ASSIGNMENT',
      ticketId || complaintId,
      `Assigned to ${technician.name} (${technician.department || 'Technician'}). Dispatcher notes: "${notes || 'None'}"`
    );
  };

  const updateStatus = async (complaintId: number, newStatus: ComplaintStatus, remarks: string) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    let ticketId = '';
    let oldStatus: ComplaintStatus = 'PENDING';

    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== complaintId) return c;
        ticketId = c.ticketId;
        oldStatus = c.status;

        const updatedTimeline = [
          ...c.timelineUpdates,
          {
            id: Date.now(),
            complaintId: c.id,
            updatedBy: currentUser.id,
            updaterName: currentUser.name,
            updaterRole: currentUser.role,
            previousStatus: c.status,
            newStatus,
            remarks: `${currentUser.role === 'TECHNICIAN' ? 'Technician Remarks' : 'Status Update'}: ${remarks}`,
            createdAt: now
          }
        ];

        return {
          ...c,
          status: newStatus,
          updatedAt: now,
          resolvedAt: newStatus === 'RESOLVED' ? now : c.resolvedAt,
          timelineUpdates: updatedTimeline
        };
      })
    );

    logAuditEvent(
      'STATUS_TRANSITION',
      'COMPLAINT',
      ticketId || complaintId,
      `Status changed from ${oldStatus} to ${newStatus}. Remarks: "${remarks}"`
    );
  };

  const closeComplaint = async (complaintId: number, rating: number, feedback?: string) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    let ticketId = '';

    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== complaintId) return c;
        ticketId = c.ticketId;

        const updatedTimeline = [
          ...c.timelineUpdates,
          {
            id: Date.now(),
            complaintId: c.id,
            updatedBy: currentUser.id,
            updaterName: currentUser.name,
            updaterRole: currentUser.role,
            previousStatus: c.status,
            newStatus: 'CLOSED' as ComplaintStatus,
            remarks: `Ticket officially closed and verified by Student ${currentUser.name}. Satisfaction Rating: ${rating}/5 Stars. Feedback: "${feedback || 'No additional remarks'}"`,
            createdAt: now
          }
        ];

        return {
          ...c,
          status: 'CLOSED',
          updatedAt: now,
          closedAt: now,
          satisfactionRating: rating,
          closingFeedback: feedback,
          timelineUpdates: updatedTimeline
        };
      })
    );

    logAuditEvent(
      'TICKET_CLOSED',
      'COMPLAINT',
      ticketId || complaintId,
      `Student confirmed resolution. Closed with ${rating}/5 stars. Feedback: "${feedback || 'Satisfied'}"`
    );
  };

  const updatePriority = async (complaintId: number, newPriority: ComplaintPriority) => {
    if (!currentUser) return;
    const now = new Date().toISOString();
    let ticketId = '';
    let oldPriority: ComplaintPriority = 'MEDIUM';

    setComplaints(prev =>
      prev.map(c => {
        if (c.id !== complaintId) return c;
        ticketId = c.ticketId;
        oldPriority = c.priority;

        const updatedTimeline = [
          ...c.timelineUpdates,
          {
            id: Date.now(),
            complaintId: c.id,
            updatedBy: currentUser.id,
            updaterName: currentUser.name,
            updaterRole: currentUser.role,
            previousStatus: c.status,
            newStatus: c.status,
            remarks: `Priority updated from ${c.priority} to ${newPriority} by ${currentUser.name}.`,
            createdAt: now
          }
        ];

        return {
          ...c,
          priority: newPriority,
          updatedAt: now,
          timelineUpdates: updatedTimeline
        };
      })
    );

    logAuditEvent(
      'PRIORITY_UPDATE',
      'COMPLAINT',
      ticketId || complaintId,
      `Priority adjusted from ${oldPriority} to ${newPriority}`
    );
  };

  const deleteComplaint = async (complaintId: number) => {
    const target = complaints.find(c => c.id === complaintId);
    setComplaints(prev => prev.filter(c => c.id !== complaintId));
    if (target) {
      logAuditEvent(
        'COMPLAINT_DELETED',
        'COMPLAINT',
        target.ticketId,
        `Complaint #${target.ticketId} deleted from database`
      );
    }
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    const newCategory: Category = {
      ...categoryData,
      id: Math.max(...categories.map(c => c.id), 0) + 1
    };
    setCategories(prev => [...prev, newCategory]);
    logAuditEvent(
      'CATEGORY_CREATED',
      'CATEGORY',
      newCategory.name,
      `New maintenance category added: "${newCategory.name}" (SLA: ${newCategory.slaHours || 24}h)`
    );
    return newCategory;
  };

  const updateCategory = async (id: number, updates: Partial<Category>) => {
    setCategories(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
    logAuditEvent(
      'CATEGORY_UPDATED',
      'CATEGORY',
      id,
      `Category #${id} attributes updated`
    );
  };

  const resetToSeedData = () => {
    setComplaints(SEED_COMPLAINTS);
    setCategories(SEED_CATEGORIES);
    setAuditLogs(SEED_AUDIT_LOGS);
    localStorage.setItem(COMPLAINTS_STORAGE_KEY, JSON.stringify(SEED_COMPLAINTS));
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(SEED_CATEGORIES));
    localStorage.setItem(AUDIT_LOGS_STORAGE_KEY, JSON.stringify(SEED_AUDIT_LOGS));
  };

  const getComplaintById = (id: number) => {
    return complaints.find(c => c.id === id);
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        categories,
        auditLogs,
        stats,
        createComplaint,
        assignComplaint,
        updateStatus,
        updatePriority,
        closeComplaint,
        deleteComplaint,
        addCategory,
        updateCategory,
        resetToSeedData,
        getComplaintById,
        logAuditEvent,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};

