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
  private authToken: string | null = null;

  getAuthToken(): string | null {
    if (this.authToken) {
      return this.authToken;
    }
    // Try to get from localStorage
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('authToken');
      return this.authToken;
    }
    return null;
  }

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
    try {
      // Call the login API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (!response.ok || result.error) {
        return { user: null, error: result.error || 'Login failed' };
      }

      this.currentUser = result.user;
      this.authToken = result.token;

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('mockUser', JSON.stringify(this.currentUser));
        localStorage.setItem('authToken', this.authToken);
      }

      return { user: this.currentUser, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'An error occurred during login' };
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    this.authToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockUser');
      localStorage.removeItem('authToken');
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