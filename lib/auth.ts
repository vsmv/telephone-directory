import { supabase } from './supabase';
import { createClient } from '@supabase/supabase-js';

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

  // Create admin client for database operations
  private supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  getAuthToken(): string | null {
    if (this.authToken) {
      return this.authToken;
    }
    // Try to get from localStorage
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('supabase.auth.token');
      return this.authToken;
    }
    return null;
  }

  async getCurrentUser(): Promise<UserSession | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    // Check Supabase session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Get user profile from database
      const { data: profile } = await this.supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        this.currentUser = {
          id: profile.id,
          email: profile.email,
          role: profile.role
        };
        return this.currentUser;
      }
    }

    // Fallback to localStorage for backward compatibility
    const storedUser = localStorage?.getItem('mockUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      return this.currentUser;
    }

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
        if (this.authToken) {
          localStorage.setItem('supabase.auth.token', this.authToken);
        }
      }

      return { user: this.currentUser, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'An error occurred during login' };
    }
  }

  async logout(): Promise<void> {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    this.currentUser = null;
    this.authToken = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockUser');
      localStorage.removeItem('supabase.auth.token');
    }
  }

  async switchRole(newRole: 'admin' | 'regular'): Promise<void> {
    if (this.currentUser) {
      // Update role in database
      await this.supabaseAdmin
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', this.currentUser.id);

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

  // New method to register users
  async register(email: string, password: string, role: 'admin' | 'regular' = 'regular'): Promise<{ user: UserSession | null; error: string | null }> {
    try {
      // Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError || !authData.user) {
        return { user: null, error: authError?.message || 'Registration failed' };
      }

      // Create user profile
      const { data: profile, error: profileError } = await this.supabaseAdmin
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          role
        })
        .select()
        .single();

      if (profileError || !profile) {
        return { user: null, error: 'Failed to create user profile' };
      }

      const userSession: UserSession = {
        id: profile.id,
        email: profile.email,
        role: profile.role
      };

      return { user: userSession, error: null };
    } catch (error) {
      console.error('Registration error:', error);
      return { user: null, error: 'An error occurred during registration' };
    }
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
