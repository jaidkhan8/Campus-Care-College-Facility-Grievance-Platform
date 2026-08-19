import { User, Category, Complaint, AuditLog } from '../types';

export interface UpcomingEvent {
  id: string;
  time: string;
  title: string;
  location: string;
  category: string;
  date: string; // YYYY-MM-DD
  type: 'inspection' | 'maintenance' | 'audit' | 'network';
}

export const SEED_CATEGORIES: Category[] = [
  { id: 1, name: 'Internet/WiFi', description: 'Campus network outages, slow connectivity, router & access point failures', icon: 'Wifi', slaHours: 6 },
  { id: 2, name: 'Electrical', description: 'Lighting, power outlets, wiring, circuit breakers, and fans', icon: 'Zap', slaHours: 8 },
  { id: 3, name: 'Hostel', description: 'Room maintenance, plumbing, water supply, locks, and beds', icon: 'Home', slaHours: 4 },
  { id: 4, name: 'Classroom', description: 'Projectors, smartboards, desks, air conditioning, and podium audio', icon: 'Monitor', slaHours: 12 },
  { id: 5, name: 'Library', description: 'Study zone facilities, quiet area power, book lookup terminals', icon: 'BookOpen', slaHours: 18 },
  { id: 6, name: 'Cleaning', description: 'Washrooms, hallways, cafeterias, and waste disposal', icon: 'Sparkles', slaHours: 4 },
  { id: 7, name: 'Other', description: 'General campus utilities, accessibility, and infrastructure requests', icon: 'HelpCircle', slaHours: 48 },
];

export const SEED_USERS: User[] = [
  {
    id: 1,
    uid: 'ADM-2024-001',
    name: 'Dr. Arthur Pendelton',
    email: 'admin@culkomail.in',
    role: 'ADMIN',
    department: 'Campus Facilities & Operations',
    phone: '+91 98765 00001',
    isActive: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 2,
    uid: 'TECH-2025-014',
    name: 'Alex Miller',
    email: 'alex.tech@culkomail.in',
    role: 'TECHNICIAN',
    department: 'Electrical Maintenance',
    phone: '+91 98765 00014',
    isActive: true,
    createdAt: '2026-01-15T09:30:00Z',
  },
  {
    id: 3,
    uid: 'TECH-2025-022',
    name: 'Sarah Chen',
    email: 'sarah.tech@culkomail.in',
    role: 'TECHNICIAN',
    department: 'IT & Network Infrastructure',
    phone: '+91 98765 00022',
    isActive: true,
    createdAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 4,
    uid: 'TECH-2025-039',
    name: 'David Kumar',
    email: 'david.tech@culkomail.in',
    role: 'TECHNICIAN',
    department: 'Civil Works & Plumbing',
    phone: '+91 98765 00039',
    isActive: true,
    createdAt: '2026-01-18T11:00:00Z',
  },
  {
    id: 5,
    uid: 'STU-2026-1042',
    name: 'Emily Watson',
    email: 'emily.student@culkomail.in',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    phone: '+91 98765 11042',
    isActive: true,
    createdAt: '2026-02-01T14:20:00Z',
  },
  {
    id: 6,
    uid: 'STU-2026-1088',
    name: 'Rahul Sharma',
    email: 'rahul.student@culkomail.in',
    role: 'STUDENT',
    department: 'Mechanical Engineering',
    phone: '+91 98765 11088',
    isActive: true,
    createdAt: '2026-02-05T16:45:00Z',
  },
  {
    id: 7,
    uid: 'STU-2026-1150',
    name: 'Jessica Taylor',
    email: 'jessica.student@culkomail.in',
    role: 'STUDENT',
    department: 'Biotechnology',
    phone: '+91 98765 11150',
    isActive: true,
    createdAt: '2026-02-10T11:15:00Z',
  }
];

export const SEED_UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    id: 'evt-1',
    time: '10:00 AM',
    title: 'Electrical inspection',
    location: 'Block A',
    category: 'Electrical',
    date: '2026-08-14',
    type: 'inspection'
  },
  {
    id: 'evt-2',
    time: '12:30 PM',
    title: 'WiFi maintenance',
    location: 'Library',
    category: 'Internet/WiFi',
    date: '2026-08-14',
    type: 'network'
  },
  {
    id: 'evt-3',
    time: '03:00 PM',
    title: 'Hostel maintenance',
    location: 'Block C',
    category: 'Hostel',
    date: '2026-08-15',
    type: 'maintenance'
  },
  {
    id: 'evt-4',
    time: '11:00 AM',
    title: 'HVAC Air Filter Replacement',
    location: 'Science Complex',
    category: 'Classroom',
    date: '2026-08-18',
    type: 'maintenance'
  },
  {
    id: 'evt-5',
    time: '02:00 PM',
    title: 'Fire Alarm Safety Testing',
    location: 'Engineering Building',
    category: 'Electrical',
    date: '2026-08-22',
    type: 'inspection'
  }
];

export const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 1,
    ticketId: 'CMP-1024',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 1,
    categoryName: 'Internet/WiFi',
    title: 'WiFi not working in CSE Wing 3',
    description: 'The high-speed SSID "Campus-Secure" frequently drops packets and disconnects every 5 minutes in Computer Lab 3. We cannot load the online code editor during our distributed computing lab.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    location: 'Turing Hall, 3rd Floor Lab 3',
    imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-08-14T09:15:00Z',
    updatedAt: '2026-08-14T10:45:00Z',
    assignment: {
      id: 1,
      complaintId: 1,
      technicianId: 3,
      technicianName: 'Sarah Chen',
      technicianEmail: 'sarah.tech@culkomail.in',
      assignedBy: 1,
      assignedByName: 'Dr. Arthur Pendelton',
      assignedAt: '2026-08-14T09:40:00Z',
      notes: 'Investigate access point AP-04B channel congestion and PoE switch.'
    },
    timelineUpdates: [
      {
        id: 1,
        complaintId: 1,
        updatedBy: 5,
        updaterName: 'Emily Watson',
        updaterRole: 'STUDENT',
        previousStatus: null,
        newStatus: 'PENDING',
        remarks: 'Complaint filed by student with High priority.',
        createdAt: '2026-08-14T09:10:00Z'
      },
      {
        id: 2,
        complaintId: 1,
        updatedBy: 1,
        updaterName: 'Dr. Arthur Pendelton',
        updaterRole: 'ADMIN',
        previousStatus: 'PENDING',
        newStatus: 'ASSIGNED',
        remarks: 'Complaint Reviewed. Assigned to Sarah Chen (IT Infrastructure).',
        createdAt: '2026-08-14T09:40:00Z'
      },
      {
        id: 3,
        complaintId: 1,
        updatedBy: 3,
        updaterName: 'Sarah Chen',
        updaterRole: 'TECHNICIAN',
        previousStatus: 'ASSIGNED',
        newStatus: 'IN_PROGRESS',
        remarks: 'Work Started: Connected diagnostic packet analyzer to rack switch; resetting firmware.',
        createdAt: '2026-08-14T10:15:00Z'
      }
    ]
  },
  {
    id: 2,
    ticketId: 'CMP-1023',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 2,
    categoryName: 'Electrical',
    title: 'Projector not working in Seminar Room B',
    description: 'The ceiling projector HDMI port shows "No Signal Detected" and the bulb indicator flashes amber continuously.',
    priority: 'MEDIUM',
    status: 'PENDING',
    location: 'Block A, Room 204',
    createdAt: '2026-08-14T08:10:00Z',
    updatedAt: '2026-08-14T08:10:00Z',
    timelineUpdates: [
      {
        id: 4,
        complaintId: 2,
        updatedBy: 5,
        updaterName: 'Emily Watson',
        updaterRole: 'STUDENT',
        previousStatus: null,
        newStatus: 'PENDING',
        remarks: 'Complaint submitted and queued for administrative triage.',
        createdAt: '2026-08-14T08:10:00Z'
      }
    ]
  },
  {
    id: 3,
    ticketId: 'CMP-1022',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 6,
    categoryName: 'Cleaning',
    title: 'Room cleaning issue in Study Lounge',
    description: 'Post-group study garbage and spill cleanup required near the whiteboards.',
    priority: 'LOW',
    status: 'RESOLVED',
    location: 'Student Activity Center, 2nd Floor',
    createdAt: '2026-08-13T11:00:00Z',
    updatedAt: '2026-08-14T09:00:00Z',
    resolvedAt: '2026-08-14T09:00:00Z',
    assignment: {
      id: 2,
      complaintId: 3,
      technicianId: 4,
      technicianName: 'David Kumar',
      technicianEmail: 'david.tech@culkomail.in',
      assignedBy: 1,
      assignedByName: 'Dr. Arthur Pendelton',
      assignedAt: '2026-08-13T11:30:00Z',
      notes: 'Sanitation team dispatched.'
    },
    timelineUpdates: [
      {
        id: 5,
        complaintId: 3,
        updatedBy: 5,
        updaterName: 'Emily Watson',
        updaterRole: 'STUDENT',
        previousStatus: null,
        newStatus: 'PENDING',
        remarks: 'Cleaning request logged.',
        createdAt: '2026-08-13T11:00:00Z'
      },
      {
        id: 6,
        complaintId: 3,
        updatedBy: 4,
        updaterName: 'David Kumar',
        updaterRole: 'TECHNICIAN',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'RESOLVED',
        remarks: 'RESOLVED: Sanitation and surface disinfection completed thoroughly.',
        createdAt: '2026-08-14T09:00:00Z'
      }
    ]
  },
  {
    id: 4,
    ticketId: 'CMP-1021',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 3,
    categoryName: 'Hostel',
    title: 'Water geyser temperature sensor failure',
    description: 'Hot water geyser in Hostel Block C Room 312 trips the power switch when heated.',
    priority: 'HIGH',
    status: 'PENDING',
    location: 'Hostel Block C, Room 312',
    createdAt: '2026-08-13T14:30:00Z',
    updatedAt: '2026-08-13T14:30:00Z',
    timelineUpdates: [
      {
        id: 7,
        complaintId: 4,
        updatedBy: 5,
        updaterName: 'Emily Watson',
        updaterRole: 'STUDENT',
        previousStatus: null,
        newStatus: 'PENDING',
        remarks: 'Reported geyser electrical tripping.',
        createdAt: '2026-08-13T14:30:00Z'
      }
    ]
  },
  {
    id: 5,
    ticketId: 'CMP-1020',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 2,
    categoryName: 'Electrical',
    title: 'Flickering LED tube light in study hall',
    description: 'Light fixture #4 flickers continuously, creating eye strain during evening revision.',
    priority: 'LOW',
    status: 'IN_PROGRESS',
    location: 'Library Annex, 1st Floor',
    createdAt: '2026-08-12T16:00:00Z',
    updatedAt: '2026-08-13T10:00:00Z',
    assignment: {
      id: 3,
      complaintId: 5,
      technicianId: 2,
      technicianName: 'Alex Miller',
      technicianEmail: 'alex.tech@culkomail.in',
      assignedBy: 1,
      assignedByName: 'Dr. Arthur Pendelton',
      assignedAt: '2026-08-12T17:00:00Z',
      notes: 'Replace driver ballast.'
    },
    timelineUpdates: [
      {
        id: 8,
        complaintId: 5,
        updatedBy: 2,
        updaterName: 'Alex Miller',
        updaterRole: 'TECHNICIAN',
        previousStatus: 'ASSIGNED',
        newStatus: 'IN_PROGRESS',
        remarks: 'Replacement LED driver requisitioned from stores.',
        createdAt: '2026-08-13T10:00:00Z'
      }
    ]
  },
  {
    id: 6,
    ticketId: 'CMP-1019',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 4,
    categoryName: 'Classroom',
    title: 'Air conditioning cooling ineffective in Lecture Hall 4',
    description: 'AC unit blows ambient air only; thermostat reading stays at 29°C with 60 students seated.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    location: 'Academic Block 1, LH-4',
    createdAt: '2026-08-12T08:30:00Z',
    updatedAt: '2026-08-12T14:00:00Z',
    assignment: {
      id: 4,
      complaintId: 6,
      technicianId: 4,
      technicianName: 'David Kumar',
      technicianEmail: 'david.tech@culkomail.in',
      assignedBy: 1,
      assignedByName: 'Dr. Arthur Pendelton',
      assignedAt: '2026-08-12T09:00:00Z',
      notes: 'Check refrigerant pressure and compressor contactor.'
    },
    timelineUpdates: [
      {
        id: 9,
        complaintId: 6,
        updatedBy: 4,
        updaterName: 'David Kumar',
        updaterRole: 'TECHNICIAN',
        previousStatus: 'ASSIGNED',
        newStatus: 'IN_PROGRESS',
        remarks: 'Cleaning condenser coils and checking R410A gas charge.',
        createdAt: '2026-08-12T14:00:00Z'
      }
    ]
  },
  {
    id: 7,
    ticketId: 'CMP-1018',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 1,
    categoryName: 'Internet/WiFi',
    title: 'Ethernet wall port dead in Dorm Room 302',
    description: 'RJ45 jack does not negotiate link connection with laptop or desktop.',
    priority: 'MEDIUM',
    status: 'PENDING',
    location: 'Hostel Block B, Room 302',
    createdAt: '2026-08-11T19:00:00Z',
    updatedAt: '2026-08-11T19:00:00Z',
    timelineUpdates: [
      {
        id: 10,
        complaintId: 7,
        updatedBy: 5,
        updaterName: 'Emily Watson',
        updaterRole: 'STUDENT',
        previousStatus: null,
        newStatus: 'PENDING',
        remarks: 'Dorm ethernet issue filed.',
        createdAt: '2026-08-11T19:00:00Z'
      }
    ]
  },
  {
    id: 8,
    ticketId: 'CMP-1017',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 7,
    categoryName: 'Other',
    title: 'Shuttle Bus GPS Tracker out of sync on mobile portal',
    description: 'Evening campus shuttle #2 location was lagging by 15 minutes on the map widget.',
    priority: 'LOW',
    status: 'PENDING',
    location: 'North Gate Bus Stop',
    createdAt: '2026-08-11T14:00:00Z',
    updatedAt: '2026-08-11T14:00:00Z',
    timelineUpdates: [
      {
        id: 11,
        complaintId: 8,
        updatedBy: 5,
        updaterName: 'Emily Watson',
        updaterRole: 'STUDENT',
        previousStatus: null,
        newStatus: 'PENDING',
        remarks: 'Submitted telematics issue.',
        createdAt: '2026-08-11T14:00:00Z'
      }
    ]
  },
  {
    id: 9,
    ticketId: 'CMP-1016',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 3,
    categoryName: 'Hostel',
    title: 'Door lock cylinder stuck in hostel room',
    description: 'Key gets jammed upon turning; needs graphite lubrication or new lock cylinder.',
    priority: 'HIGH',
    status: 'RESOLVED',
    location: 'Hostel Block C, Room 312',
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-08-10T15:30:00Z',
    resolvedAt: '2026-08-10T15:30:00Z',
    assignment: {
      id: 5,
      complaintId: 9,
      technicianId: 4,
      technicianName: 'David Kumar',
      technicianEmail: 'david.tech@culkomail.in',
      assignedBy: 1,
      assignedByName: 'Dr. Arthur Pendelton',
      assignedAt: '2026-08-10T10:30:00Z'
    },
    timelineUpdates: [
      {
        id: 12,
        complaintId: 9,
        updatedBy: 4,
        updaterName: 'David Kumar',
        updaterRole: 'TECHNICIAN',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'RESOLVED',
        remarks: 'RESOLVED: Replaced internal brass pin tumbler lock assembly. Tested with master and student keys.',
        createdAt: '2026-08-10T15:30:00Z'
      }
    ]
  },
  {
    id: 10,
    ticketId: 'CMP-1015',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 1,
    categoryName: 'Internet/WiFi',
    title: 'Library e-Resource portal proxy certificate expired',
    description: 'Browser gives SSL certificate security warning when accessing IEEE Xplore database.',
    priority: 'HIGH',
    status: 'RESOLVED',
    location: 'Central Library Digital Wing',
    createdAt: '2026-08-09T08:00:00Z',
    updatedAt: '2026-08-09T11:20:00Z',
    resolvedAt: '2026-08-09T11:20:00Z',
    assignment: {
      id: 6,
      complaintId: 10,
      technicianId: 3,
      technicianName: 'Sarah Chen',
      technicianEmail: 'sarah.tech@culkomail.in',
      assignedBy: 1,
      assignedByName: 'Dr. Arthur Pendelton',
      assignedAt: '2026-08-09T08:15:00Z'
    },
    timelineUpdates: [
      {
        id: 13,
        complaintId: 10,
        updatedBy: 3,
        updaterName: 'Sarah Chen',
        updaterRole: 'TECHNICIAN',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'RESOLVED',
        remarks: 'RESOLVED: Renewed Let\'s Encrypt wildcard certificate on reverse proxy and reloaded Nginx.',
        createdAt: '2026-08-09T11:20:00Z'
      }
    ]
  },
  {
    id: 11,
    ticketId: 'CMP-1014',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 2,
    categoryName: 'Electrical',
    title: 'Lab 202 power strip voltage fluctuations',
    description: 'Bench 5 power strip was causing monitors to reset during load testing.',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    location: 'Science Block B, Room 202',
    createdAt: '2026-08-08T09:30:00Z',
    updatedAt: '2026-08-08T16:00:00Z',
    resolvedAt: '2026-08-08T16:00:00Z',
    assignment: {
      id: 7,
      complaintId: 11,
      technicianId: 2,
      technicianName: 'Alex Miller',
      technicianEmail: 'alex.tech@culkomail.in',
      assignedBy: 1,
      assignedByName: 'Dr. Arthur Pendelton',
      assignedAt: '2026-08-08T10:00:00Z'
    },
    timelineUpdates: [
      {
        id: 14,
        complaintId: 11,
        updatedBy: 2,
        updaterName: 'Alex Miller',
        updaterRole: 'TECHNICIAN',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'RESOLVED',
        remarks: 'RESOLVED: Installed new surge-protected 16A modular distribution block with grounded earth line.',
        createdAt: '2026-08-08T16:00:00Z'
      }
    ]
  },
  {
    id: 12,
    ticketId: 'CMP-1013',
    studentId: 5,
    studentName: 'Emily Watson',
    studentEmail: 'emily.student@culkomail.in',
    studentDepartment: 'Computer Science & Engineering',
    categoryId: 4,
    categoryName: 'Classroom',
    title: 'Smartboard touch calibration offset in Tutorial Room 10',
    description: 'Stylus touches were registering 3 inches to the right on the interactive white board.',
    priority: 'LOW',
    status: 'CLOSED',
    location: 'Academic Complex, TR-10',
    satisfactionRating: 5,
    closingFeedback: 'Fixed immediately by technician! Calibration works perfectly now.',
    createdAt: '2026-08-07T11:00:00Z',
    updatedAt: '2026-08-07T14:30:00Z',
    resolvedAt: '2026-08-07T14:00:00Z',
    closedAt: '2026-08-07T14:30:00Z',
    assignment: {
      id: 8,
      complaintId: 12,
      technicianId: 3,
      technicianName: 'Sarah Chen',
      technicianEmail: 'sarah.tech@culkomail.in',
      assignedBy: 1,
      assignedByName: 'Dr. Arthur Pendelton',
      assignedAt: '2026-08-07T11:30:00Z'
    },
    timelineUpdates: [
      {
        id: 15,
        complaintId: 12,
        updatedBy: 3,
        updaterName: 'Sarah Chen',
        updaterRole: 'TECHNICIAN',
        previousStatus: 'IN_PROGRESS',
        newStatus: 'RESOLVED',
        remarks: 'RESOLVED: Re-aligned optical sensor bar and recalibrated 9-point touch matrix.',
        createdAt: '2026-08-07T14:00:00Z'
      },
      {
        id: 16,
        complaintId: 12,
        updatedBy: 5,
        updaterName: 'Emily Watson',
        updaterRole: 'STUDENT',
        previousStatus: 'RESOLVED',
        newStatus: 'CLOSED',
        remarks: 'Closed by student with 5/5 stars satisfaction rating.',
        createdAt: '2026-08-07T14:30:00Z'
      }
    ]
  }
];

export const SEED_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    action: 'TICKET_RESOLVED',
    entityType: 'COMPLAINT',
    entityId: 'CMP-1022',
    userId: 4,
    userName: 'David Kumar',
    userRole: 'TECHNICIAN',
    details: 'Complaint CMP-1022 resolved: Sanitation and spill cleanup completed.',
    timestamp: '2026-08-14T15:36:00Z',
    ipAddress: '10.20.4.88'
  },
  {
    id: 2,
    action: 'TECHNICIAN_ASSIGNMENT',
    entityType: 'ASSIGNMENT',
    entityId: 'CMP-1024',
    userId: 1,
    userName: 'Dr. Arthur Pendelton',
    userRole: 'ADMIN',
    details: 'Technician Sarah Chen assigned to CMP-1024 (WiFi CSE Wing 3).',
    timestamp: '2026-08-14T14:46:00Z',
    ipAddress: '10.20.1.5'
  },
  {
    id: 3,
    action: 'COMPLAINT_CREATED',
    entityType: 'COMPLAINT',
    entityId: 'CMP-1023',
    userId: 5,
    userName: 'Emily Watson',
    userRole: 'STUDENT',
    details: 'Complaint CMP-1023 submitted: Projector not working in Seminar Room B.',
    timestamp: '2026-08-14T12:46:00Z',
    ipAddress: '10.20.8.44'
  },
  {
    id: 4,
    action: 'STATUS_TRANSITION',
    entityType: 'COMPLAINT',
    entityId: 'CMP-1020',
    userId: 2,
    userName: 'Alex Miller',
    userRole: 'TECHNICIAN',
    details: 'Alex Miller started work on CMP-1020: Replacing driver ballast.',
    timestamp: '2026-08-14T10:15:00Z',
    ipAddress: '10.20.4.112'
  },
  {
    id: 5,
    action: 'USER_LOGIN',
    entityType: 'AUTH',
    entityId: 'emily.student@culkomail.in',
    userId: 5,
    userName: 'Emily Watson',
    userRole: 'STUDENT',
    details: 'Student session authenticated successfully with college email.',
    timestamp: '2026-08-14T09:00:00Z',
    ipAddress: '10.20.8.44'
  }
];


