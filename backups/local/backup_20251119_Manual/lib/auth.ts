import { supabase } from './supabase';
import { userService } from './database';

export interface UserSession {
  id: string;
  email: string;
  role: 'admin' | 'regular';
}

export interface RolePermissions {
  canViewContacts: boolean;
  canCreateContacts: boolean;
  canEditContacts: boolean;
  canDeleteContacts: boolean;
  canBulkOperations: boolean;
  canManageUsers: boolean;
  canViewUserManagement: boolean;
  canSearchContacts: boolean;
  canResetPassword: boolean;
  canViewPatentableIdeas: boolean;
  canViewStudyPlans: boolean;
  canManageRoles: boolean;
}

// Define role permissions
export const ROLE_PERMISSIONS: Record<'admin' | 'regular', RolePermissions> = {
  admin: {
    canViewContacts: true,
    canCreateContacts: true,
    canEditContacts: true,
    canDeleteContacts: true,
    canBulkOperations: true,
    canManageUsers: true,
    canViewUserManagement: true,
    canSearchContacts: true,
    canResetPassword: true,
    canViewPatentableIdeas: true,
    canViewStudyPlans: true,
    canManageRoles: true,
  },
  regular: {
    canViewContacts: false,
    canCreateContacts: false,
    canEditContacts: false,
    canDeleteContacts: false,
    canBulkOperations: false,
    canManageUsers: false,
    canViewUserManagement: false,
    canSearchContacts: true,
    canResetPassword: true,
    canViewPatentableIdeas: true,
    canViewStudyPlans: true,
    canManageRoles: false,
  },
};

class AuthService {
  private currentUser: UserSession | null = null;

  async getCurrentUser(): Promise<UserSession | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // In a real app, this would check Supabase auth
    // For demo, we'll simulate based on localStorage only
    const mockUser = localStorage?.getItem('mockUser');
    if (mockUser) {
      this.currentUser = JSON.parse(mockUser);
      return this.currentUser;
    }

    // Return null if no user is logged in
    return null;
  }

  async login(email: string, password: string): Promise<{ user: UserSession | null; error: string | null }> {
    // Mock login logic - in a real app, this would call Supabase auth
    if (email === 'admin@actrec.gov.in' && password === 'admin123') {
      this.currentUser = {
        id: 'demo-admin-1',
        email: 'admin@actrec.gov.in',
        role: 'admin'
      };
    } else if (email === 'user@actrec.gov.in' && password === 'user123') {
      this.currentUser = {
        id: 'demo-user-1',
        email: 'user@actrec.gov.in',
        role: 'regular'
      };
    } else {
      // In a real app, we would check against the database
      // For now, we'll just return an error for unknown credentials
      return { user: null, error: 'Invalid credentials' };
    }

    // Store in localStorage for demo
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
    }

    return { user: this.currentUser, error: null };
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockUser');
    }
  }

  async switchRole(newRole: 'admin' | 'regular'): Promise<void> {
    if (this.currentUser) {
      this.currentUser.role = newRole;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
      }
    }
  }

  getPermissions(role: 'admin' | 'regular'): RolePermissions {
    return ROLE_PERMISSIONS[role];
  }

  hasPermission(permission: keyof RolePermissions, userRole?: 'admin' | 'regular'): boolean {
    const role = userRole || this.currentUser?.role || 'regular';
    return this.getPermissions(role)[permission];
  }
}

export const authService = new AuthService();

// React hook for authentication
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedInUser, error } = await authService.login(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
    }
    return { user: loggedInUser, error };
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const switchRole = async (newRole: 'admin' | 'regular') => {
    await authService.switchRole(newRole);
    const updatedUser = await authService.getCurrentUser();
    setUser(updatedUser);
  };

  const hasPermission = (permission: keyof RolePermissions) => {
    return authService.hasPermission(permission, user?.role);
  };

  const permissions = user ? authService.getPermissions(user.role) : ROLE_PERMISSIONS.regular;

  return {
    user,
    loading,
    login,
    logout,
    switchRole,
    hasPermission,
    permissions,
    isAdmin: user?.role === 'admin',
    isRegular: user?.role === 'regular',
  };
}