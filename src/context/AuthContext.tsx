import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AppMode } from '../types';
import { SEED_USERS } from '../data/seedData';

export const COLLEGE_EMAIL_DOMAIN = '@culkomail.in';
export const INVALID_EMAIL_ERROR = 'Please use your official college email address ending with @culkomail.in.';

export const isCollegeEmail = (email: string): boolean => {
  if (!email) return false;
  return email.toLowerCase().trim().endsWith(COLLEGE_EMAIL_DOMAIN);
};

export interface LoginCredentials {
  email: string;
  uid: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  uid: string;
  password?: string;
  department?: string;
  phone?: string;
}

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  isAuthenticated: boolean;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  toggleAppMode: () => void;
  canSwitchRole: boolean;
  login: (email: string, uid: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => boolean;
  switchDemoUser: (roleOrName: UserRole | string) => boolean;
  updateUserProfile: (data: Partial<User>) => void;
  updateUserRole: (userId: number, newRole: UserRole) => boolean;
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => { success: boolean; user?: User; error?: string };
  allUsers: User[];
  checkPermission: (requiredRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'smart_campus_auth_user_v2';
const TOKEN_STORAGE_KEY = 'smart_campus_auth_token_v2';
const USERS_STORAGE_KEY = 'smart_campus_users_list_v2';
const APP_MODE_STORAGE_KEY = 'smart_campus_app_mode';

// Helper to sanitize and normalize users
const normalizeUser = (user: User, index: number): User => {
  let email = user.email ? user.email.toLowerCase().trim() : '';
  if (!email.endsWith(COLLEGE_EMAIL_DOMAIN)) {
    const prefix = email.split('@')[0] || `user${index + 1}`;
    email = `${prefix}${COLLEGE_EMAIL_DOMAIN}`;
  }

  let uid = user.uid?.trim();
  if (!uid) {
    if (user.role === 'ADMIN') uid = `ADM-2024-${String(index + 1).padStart(3, '0')}`;
    else if (user.role === 'TECHNICIAN') uid = `TECH-2025-${String(index + 10).padStart(3, '0')}`;
    else uid = `STU-2026-${String(1000 + index + 1)}`;
  }

  return {
    ...user,
    email,
    uid
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appMode, setAppModeState] = useState<AppMode>(() => {
    try {
      const stored = localStorage.getItem(APP_MODE_STORAGE_KEY);
      return stored === 'PRODUCTION' ? 'PRODUCTION' : 'DEMO';
    } catch {
      return 'DEMO';
    }
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed: User[] = JSON.parse(stored);
        return parsed.map((u, i) => normalizeUser(u, i));
      }
      return SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return normalizeUser(parsed, 4);
      }
      return SEED_USERS[4]; // Default to Student Emily Watson (STU-2026-1042)
    } catch {
      return SEED_USERS[4];
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || 'mock-jwt-token-campus-2026';
    } catch {
      return 'mock-jwt-token-campus-2026';
    }
  });

  const setAppMode = (mode: AppMode) => {
    setAppModeState(mode);
    try {
      localStorage.setItem(APP_MODE_STORAGE_KEY, mode);
    } catch (e) {
      console.error(e);
    }
  };

  const toggleAppMode = () => {
    const nextMode = appMode === 'DEMO' ? 'PRODUCTION' : 'DEMO';
    setAppMode(nextMode);
  };

  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
    } catch (e) {
      console.error(e);
    }
  }, [allUsers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
        localStorage.setItem(TOKEN_STORAGE_KEY, token || 'mock-jwt-token-campus-2026');
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser, token]);

  const login = async (
    email: string,
    uid: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanUid = uid.trim().toUpperCase();

    // 1. Mandatory Email Validation
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your college email address.' };
    }
    if (!isCollegeEmail(cleanEmail)) {
      return { success: false, error: INVALID_EMAIL_ERROR };
    }

    // 2. Mandatory UID Validation
    if (!cleanUid) {
      return { success: false, error: 'Please enter your official College UID.' };
    }

    // 3. User Lookup
    const user = allUsers.find(
      u => u.email.toLowerCase().trim() === cleanEmail && u.uid.toUpperCase().trim() === cleanUid
    );

    if (!user) {
      // Check if email exists with another UID or vice versa for better UX messaging
      const emailMatch = allUsers.find(u => u.email.toLowerCase().trim() === cleanEmail);
      if (emailMatch) {
        return {
          success: false,
          error: `UID mismatch for ${cleanEmail}. Please verify your official College UID.`
        };
      }
      return {
        success: false,
        error: 'No authorized college user found with this College Email and UID combination.'
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: 'This account has been deactivated by campus administration. Please contact the college authority.'
      };
    }

    setCurrentUser(user);
    setToken(`jwt-token-${user.role.toLowerCase()}-${user.id}-${Date.now()}`);
    return { success: true };
  };

  const register = async (data: RegisterCredentials): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = data.email.toLowerCase().trim();
    const cleanUid = data.uid.trim().toUpperCase();
    const cleanName = data.name.trim();

    // 1. Mandatory Name Validation
    if (!cleanName) {
      return { success: false, error: 'Please provide your full legal name.' };
    }

    // 2. Mandatory College Email Validation
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your official college email address.' };
    }
    if (!isCollegeEmail(cleanEmail)) {
      return { success: false, error: INVALID_EMAIL_ERROR };
    }

    // 3. Mandatory UID Validation
    if (!cleanUid) {
      return { success: false, error: 'Please provide your College UID issued by the institution.' };
    }

    // 4. Check for duplicates
    const emailExists = allUsers.some(u => u.email.toLowerCase().trim() === cleanEmail);
    if (emailExists) {
      return {
        success: false,
        error: `A user with email ${cleanEmail} is already registered. Please proceed to login.`
      };
    }

    const uidExists = allUsers.some(u => u.uid.toUpperCase().trim() === cleanUid);
    if (uidExists) {
      return {
        success: false,
        error: `College UID ${cleanUid} is already in use. Please check your credential details.`
      };
    }

    // 5. Automatic role assignment: ALL newly registered users are assigned 'STUDENT'.
    // Manual role selection is strictly forbidden. Role upgrades to TECHNICIAN or ADMIN
    // must be authorized and performed by the College Authority in the database.
    const newUser: User = {
      id: Math.max(...allUsers.map(u => u.id), 0) + 1,
      uid: cleanUid,
      name: cleanName,
      email: cleanEmail,
      role: 'STUDENT',
      department: data.department?.trim() || 'General Academic Branch',
      phone: data.phone?.trim() || '+91 98765 00000',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    setCurrentUser(newUser);
    setToken(`jwt-token-student-${newUser.id}-${Date.now()}`);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
  };

  const canSwitchRole = appMode === 'DEMO';

  const switchRole = (role: UserRole): boolean => {
    if (appMode === 'PRODUCTION') {
      return false;
    }
    const targetUser = allUsers.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      setToken(`jwt-token-${targetUser.role.toLowerCase()}-${targetUser.id}-${Date.now()}`);
      return true;
    }
    return false;
  };

  const switchDemoUser = (roleOrName: UserRole | string): boolean => {
    if (appMode === 'PRODUCTION') {
      return false;
    }
    // Check if matching role
    const byRole = allUsers.find(u => u.role === roleOrName);
    if (byRole) {
      setCurrentUser(byRole);
      setToken(`jwt-token-${byRole.role.toLowerCase()}-${byRole.id}-${Date.now()}`);
      return true;
    }
    // Check if matching name or email
    const byNameOrEmail = allUsers.find(
      u => u.name.toLowerCase().includes(roleOrName.toLowerCase()) || u.email.toLowerCase().includes(roleOrName.toLowerCase())
    );
    if (byNameOrEmail) {
      setCurrentUser(byNameOrEmail);
      setToken(`jwt-token-${byNameOrEmail.role.toLowerCase()}-${byNameOrEmail.id}-${Date.now()}`);
      return true;
    }
    return false;
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
  };

  const updateUserRole = (userId: number, newRole: UserRole): boolean => {
    // Only administrators can change roles for users
    if (currentUser?.role !== 'ADMIN') {
      return false;
    }
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const updatedUser = { ...u, role: newRole };
          if (currentUser?.id === userId) {
            setCurrentUser(updatedUser);
          }
          return updatedUser;
        }
        return u;
      })
    );
    return true;
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; user?: User; error?: string } => {
    const cleanEmail = userData.email.toLowerCase().trim();
    const cleanUid = userData.uid.trim().toUpperCase();

    if (!isCollegeEmail(cleanEmail)) {
      return { success: false, error: INVALID_EMAIL_ERROR };
    }

    if (!cleanUid) {
      return { success: false, error: 'Please provide a valid College UID.' };
    }

    if (allUsers.some(u => u.email.toLowerCase().trim() === cleanEmail)) {
      return { success: false, error: `Email ${cleanEmail} is already registered.` };
    }

    if (allUsers.some(u => u.uid.toUpperCase().trim() === cleanUid)) {
      return { success: false, error: `UID ${cleanUid} is already in use.` };
    }

    const newUser: User = {
      ...userData,
      email: cleanEmail,
      uid: cleanUid,
      id: Math.max(...allUsers.map(u => u.id), 0) + 1,
      createdAt: new Date().toISOString()
    };

    setAllUsers(prev => [...prev, newUser]);
    return { success: true, user: newUser };
  };

  const checkPermission = (requiredRoles: UserRole[]): boolean => {
    if (!currentUser) return false;
    return requiredRoles.includes(currentUser.role);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        isAuthenticated: !!currentUser,
        appMode,
        setAppMode,
        toggleAppMode,
        canSwitchRole,
        login,
        register,
        registerUser: register,
        logout,
        switchRole,
        switchDemoUser,
        updateUserProfile,
        updateUserRole,
        createUser,
        allUsers,
        checkPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

