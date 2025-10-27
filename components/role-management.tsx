"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { userService, type UserProfile } from "@/lib/database";
import { Shield, User, Crown, Users, Loader2, AlertTriangle } from "lucide-react";

export function RoleManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      const { data, error } = await userService.getUsers();
      
      if (error) {
        toast({
          title: "Error Loading Users",
          description: error,
          variant: "destructive"
        });
      } else if (data) {
        setUsers(data);
      }
      
      setLoading(false);
    };

    loadUsers();
  }, [toast]);

  const updateUserRole = async (userId: string, newRole: 'admin' | 'regular') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Prevent removing the last admin
    if (user.role === 'admin' && newRole === 'regular') {
      const adminCount = users.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        toast({
          title: "Cannot Remove Last Admin",
          description: "At least one admin user must remain in the system",
          variant: "destructive"
        });
        return;
      }
    }

    setUpdatingUser(userId);
    
    const { data, error } = await userService.updateUser(userId, { role: newRole });
    
    if (error) {
      toast({
        title: "Error Updating Role",
        description: error,
        variant: "destructive"
      });
    } else if (data) {
      setUsers(users.map(u => u.id === data.id ? data : u));
      
      const roleText = newRole === 'admin' ? 'Administrator' : 'Regular User';
      toast({
        title: "Role Updated",
        description: `${user.email} is now a ${roleText}`,
        duration: 3000
      });
    }
    
    setUpdatingUser(null);
  };

  const getRoleIcon = (role: 'admin' | 'regular') => {
    return role === 'admin' ? 
      <Crown className="w-5 h-5 text-yellow-600" /> : 
      <User className="w-5 h-5 text-blue-600" />;
  };

  const getRoleColor = (role: 'admin' | 'regular') => {
    return role === 'admin' ? 'bg-yellow-100 border-yellow-200' : 'bg-blue-100 border-blue-200';
  };

  const adminCount = users.filter(u => u.role === 'admin').length;
  const regularCount = users.filter(u => u.role === 'regular').length;

  return (
    <div className="space-y-6">
      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
                <p className="text-sm text-gray-600">Administrators</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{regularCount}</p>
                <p className="text-sm text-gray-600">Regular Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Role Management
          </CardTitle>
          <CardDescription>
            Assign admin or regular user roles. Admins have full access, regular users have limited access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found. Users are created automatically when contacts are added.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Warning about last admin */}
              {adminCount <= 1 && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <div className="text-sm text-amber-800">
                    <strong>Warning:</strong> At least one administrator must remain in the system.
                  </div>
                </div>
              )}

              {users.map((user) => (
                <div key={user.id} className={`flex items-center justify-between p-4 border rounded-lg ${getRoleColor(user.role)}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
                      {getRoleIcon(user.role)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{user.email}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Current Role:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-yellow-200 text-yellow-800' 
                            : 'bg-blue-200 text-blue-800'
                        }`}>
                          {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Select
                      value={user.role}
                      onValueChange={(value: 'admin' | 'regular') => updateUserRole(user.id, value)}
                      disabled={updatingUser === user.id}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">
                          <div className="flex items-center gap-2">
                            <Crown className="w-4 h-4 text-yellow-600" />
                            Administrator
                          </div>
                        </SelectItem>
                        <SelectItem value="regular">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Regular User
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    
                    {updatingUser === user.id && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions Reference</CardTitle>
          <CardDescription>
            Overview of what each role can access and perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Administrator Permissions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-gray-900">Administrator</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Full contact management (CRUD)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Bulk operations (import/export)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>User management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Role management</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Search contacts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Password reset</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Patentable ideas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Study plans</span>
                </div>
              </div>
            </div>

            {/* Regular User Permissions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-900">Regular User</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-500">Contact management (read-only)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-500">Bulk operations (disabled)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-500">User management (disabled)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-500">Role management (disabled)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Search contacts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Password reset</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Patentable ideas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Study plans</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}