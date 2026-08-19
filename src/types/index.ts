/**
 * Core Domain Types & Enums for Smart Campus Complaint & Grievance Management System
 */

export type UserRole = 'STUDENT' | 'ADMIN' | 'TECHNICIAN';
export type Role = UserRole;

export type AppMode = 'DEMO' | 'PRODUCTION';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export type ComplaintStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface User {
  id: number;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  slaHours?: number;
}

export interface ComplaintUpdate {
  id: number;
  complaintId: number;
  updatedBy: number;
  updaterName?: string;
  updaterRole?: UserRole;
  previousStatus?: ComplaintStatus | null;
  newStatus: ComplaintStatus;
  remarks: string;
  createdAt: string;
}

export interface ComplaintAssignment {
  id: number;
  complaintId: number;
  technicianId: number;
  technicianName: string;
  technicianEmail: string;
  assignedBy: number;
  assignedByName: string;
  assignedAt: string;
  notes?: string;
}

export interface Complaint {
  id: number;
  ticketId: string;
  studentId: number;
  studentName: string;
  studentEmail: string;
  studentDepartment?: string;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  location?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  satisfactionRating?: number;
  closingFeedback?: string;
  assignment?: ComplaintAssignment;
  timelineUpdates: ComplaintUpdate[];
}

export interface AuditLog {
  id: number;
  action: string;
  entityType: 'COMPLAINT' | 'USER' | 'ASSIGNMENT' | 'CATEGORY' | 'AUTH';
  entityId: string | number;
  userId: number;
  userName: string;
  userRole: UserRole;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  closed: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  avgResolutionHours: number;
}

