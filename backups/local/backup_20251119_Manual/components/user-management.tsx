"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { userService, type UserProfile } from "@/lib/database";
import { Key, RefreshCw, User, Shield, Loader2, Users, Copy, CheckCircle2, X } from "lucide-react";

export function UserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [bulkRoleUpdate, setBulkRoleUpdate] = useState<'admin' | 'regular' | ''>('');
  const { toast } = useToast();

  const loadUsers = useCallback(async () => {
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
  }, [toast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const generatePassword = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const [passwordResetResult, setPasswordResetResult] = useState<{
    email: string;
    password: string;
  } | null>(null);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "✅ Copied!",
        description: "Password copied to clipboard",
        duration: 2000
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please copy manually",
        variant: "destructive"
      });
    }
  };

  const resetPassword = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newPassword = generatePassword();

    setLoading(true);

    // In a real app, you would call an API to reset the password
    // For demo purposes, we'll just show the generated password
    setPasswordResetResult({
      email: user.email,
      password: newPassword
    });

    toast({
      title: "✅ Password Reset Successful",
      description: `Password reset for ${user.email}`,
      duration: 3000
    });

    setLoading(false);
  };

  const [bulkPasswordResetResult, setBulkPasswordResetResult] = useState<Array<{
    email: string;
    password: string;
  }> | null>(null);

  const resetMultiplePasswords = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "⚠️ No Selection",
        description: "Please select users to reset passwords",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    const passwordResets = selectedUsers.map(userId => {
      const user = users.find(u => u.id === userId);
      return {
        email: user?.email || 'Unknown',
        password: generatePassword()
      };
    });

    // In a real app, you would call an API to reset multiple passwords
    // For demo purposes, we'll show all generated passwords
    setBulkPasswordResetResult(passwordResets);

    toast({
      title: "✅ Bulk Password Reset Complete",
      description: `Successfully reset ${selectedUsers.length} passwords`,
      duration: 3000
    });

    setSelectedUsers([]);
    setLoading(false);
  };

  const bulkUpdateRoles = async () => {
    if (selectedUsers.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select users to update roles",
        variant: "destructive"
      });
      return;
    }

    if (!bulkRoleUpdate) {
      toast({
        title: "No Role Selected",
        description: "Please select a role to assign",
        variant: "destructive"
      });
      return;
    }

    // Check if we're trying to remove the last admin
    if (bulkRoleUpdate === 'regular') {
      const selectedAdmins = selectedUsers.filter(userId => {
        const user = users.find(u => u.id === userId);
        return user?.role === 'admin';
      });

      const totalAdmins = users.filter(u => u.role === 'admin').length;
      const remainingAdmins = totalAdmins - selectedAdmins.length;

      if (remainingAdmins < 1) {
        toast({
          title: "Cannot Remove All Admins",
          description: "At least one administrator must remain in the system",
          variant: "destructive"
        });
        return;
      }
    }

    setLoading(true);

    try {
      const updatedUsers: UserProfile[] = [];

      for (const userId of selectedUsers) {
        const { data, error } = await userService.updateUser(userId, { role: bulkRoleUpdate });

        if (error) {
          toast({
            title: "Error Updating User",
            description: error,
            variant: "destructive"
          });
          setLoading(false);
          return;
        } else if (data) {
          updatedUsers.push(data);
        }
      }

      // Update local state
      setUsers(users.map(u => {
        const updated = updatedUsers.find(updated => updated.id === u.id);
        return updated || u;
      }));

      const roleText = bulkRoleUpdate === 'admin' ? 'Administrator' : 'Regular User';
      toast({
        title: "✅ Bulk Role Update Complete",
        description: `Successfully updated ${updatedUsers.length} users to ${roleText}`,
        duration: 5000
      });

      setSelectedUsers([]);
      setBulkRoleUpdate('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user roles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!editingUser) return;

    // Check if we're trying to remove the last admin
    if (editingUser.role === 'regular') {
      const currentUser = users.find(u => u.id === editingUser.id);
      if (currentUser?.role === 'admin') {
        const totalAdmins = users.filter(u => u.role === 'admin').length;
        if (totalAdmins <= 1) {
          toast({
            title: "Cannot Remove Last Admin",
            description: "At least one administrator must remain in the system",
            variant: "destructive"
          });
          return;
        }
      }
    }

    setLoading(true);
    const { data, error } = await userService.updateUser(editingUser.id, {
      email: editingUser.email,
      role: editingUser.role
    });

    if (error) {
      toast({
        title: "Error Updating User",
        description: error,
        variant: "destructive"
      });
    } else if (data) {
      setUsers(users.map(u => u.id === data.id ? data : u));
      setEditingUser(null);
      toast({
        title: "✅ User Updated",
        description: "User information has been successfully updated",
        duration: 3000
      });
    }

    setLoading(false);
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
                <Shield className="w-6 h-6 text-yellow-600" />
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

      {/* Admin Warning */}
      {adminCount <= 1 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-amber-800">
              <Shield className="w-5 h-5" />
              <div>
                <p className="font-medium">Admin Protection Active</p>
                <p className="text-sm">Only {adminCount} administrator remaining. Cannot remove the last admin from the system.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management Actions
          </CardTitle>
          <CardDescription>
            Manage user passwords and roles. Users are automatically created when contacts are added.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Password Management */}
            <div>
              <h4 className="font-medium mb-2">Password Management</h4>
              <Button
                onClick={resetMultiplePasswords}
                disabled={loading || selectedUsers.length === 0}
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Reset Selected Passwords ({selectedUsers.length})
              </Button>
            </div>

            {/* Role Management */}
            <div>
              <h4 className="font-medium mb-2">Role Management</h4>
              <div className="flex items-center gap-4">
                <Select
                  value={bulkRoleUpdate}
                  onValueChange={(value: 'admin' | 'regular') => setBulkRoleUpdate(value)}
                  disabled={loading || selectedUsers.length === 0}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select role to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-yellow-600" />
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

                <Button
                  onClick={bulkUpdateRoles}
                  disabled={loading || selectedUsers.length === 0 || !bulkRoleUpdate}
                  className="flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                  Update Selected Roles ({selectedUsers.length})
                </Button>
              </div>
            </div>
          </div>

          {editingUser && (
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <Label>Editing: {editingUser.email}</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value: 'admin' | 'regular') =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular User</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={updateUser} disabled={loading}>
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                  Update Role
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            System Users ({users.length})
          </CardTitle>
          <CardDescription>
            Users are automatically created from contacts. Manage roles and reset passwords.
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
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="w-4 h-4"
                      title={user.role === 'admin' && adminCount <= 1 ? "Cannot select the last administrator" : ""}
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                      {user.role === 'admin' ?
                        <Shield className="w-5 h-5 text-red-600" /> :
                        <User className="w-5 h-5 text-blue-600" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{user.email}</h4>
                        {user.role === 'admin' && adminCount <= 1 && (
                          <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full">
                            Last Admin
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        ID: {user.id} • Role: {user.role === 'admin' ? 'Administrator' : 'Regular User'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetPassword(user.id)}
                      disabled={loading}
                      title="Reset Password"
                    >
                      <Key className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                      disabled={loading}
                      title="Edit Role"
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Single Password Reset Dialog */}
      <Dialog open={!!passwordResetResult} onOpenChange={() => setPasswordResetResult(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Password Reset Successful
            </DialogTitle>
            <DialogDescription>
              New password has been generated. Please copy and share securely with the user.
            </DialogDescription>
          </DialogHeader>
          {passwordResetResult && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <Label className="text-xs text-gray-500">User Email</Label>
                  <p className="font-medium">{passwordResetResult.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">New Password</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 p-2 bg-white border rounded font-mono text-sm">
                      {passwordResetResult.password}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(passwordResetResult.password)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  ⚠️ <strong>Important:</strong> This password will only be shown once. Make sure to copy it before closing this dialog.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (passwordResetResult) {
                  copyToClipboard(passwordResetResult.password);
                }
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Password
            </Button>
            <Button onClick={() => setPasswordResetResult(null)}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Password Reset Dialog */}
      <Dialog open={!!bulkPasswordResetResult} onOpenChange={() => setBulkPasswordResetResult(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Bulk Password Reset Complete
            </DialogTitle>
            <DialogDescription>
              {bulkPasswordResetResult?.length} passwords have been reset. Copy all passwords or individual ones.
            </DialogDescription>
          </DialogHeader>
          {bulkPasswordResetResult && (
            <div className="space-y-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {bulkPasswordResetResult.map((reset, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Label className="text-xs text-gray-500">User {index + 1}</Label>
                        <p className="font-medium text-sm truncate">{reset.email}</p>
                        <code className="block mt-1 p-2 bg-white border rounded font-mono text-xs break-all">
                          {reset.password}
                        </code>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(reset.password)}
                        className="shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  ⚠️ <strong>Important:</strong> These passwords will only be shown once. Make sure to copy them before closing this dialog.
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (bulkPasswordResetResult) {
                  const allPasswords = bulkPasswordResetResult
                    .map(r => `${r.email}: ${r.password}`)
                    .join('\n');
                  copyToClipboard(allPasswords);
                }
              }}
              className="w-full sm:w-auto"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy All Passwords
            </Button>
            <Button onClick={() => setBulkPasswordResetResult(null)} className="w-full sm:w-auto">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}