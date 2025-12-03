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
import { Key, RefreshCw, User, Shield, Loader2, Users, Copy, CheckCircle2, X, Check } from "lucide-react";

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

    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newPassword })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to reset password');
      }

      setPasswordResetResult({
        email: user.email,
        password: newPassword
      });

      toast({
        title: "✅ Password Reset Successful",
        description: `Password updated in database for ${user.email}`,
        duration: 3000
      });
    } catch (error) {
      toast({
        title: "❌ Password Reset Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

    try {
      const passwords = selectedUsers.map(() => generatePassword());

      const response = await fetch('/api/users/bulk-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userIds: selectedUsers,
          passwords 
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error('Failed to reset passwords');
      }

      const passwordResets = result.results
        .filter((r: any) => r.success)
        .map((r: any) => ({
          email: r.email,
          password: r.password
        }));

      setBulkPasswordResetResult(passwordResets);

      toast({
        title: "✅ Bulk Password Reset Complete",
        description: `Successfully updated ${passwordResets.length} passwords in database`,
        duration: 3000
      });

      setSelectedUsers([]);
    } catch (error) {
      toast({
        title: "❌ Bulk Password Reset Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const updateUser = async (userId: string, newRole: 'admin' | 'regular') => {  
    const currentUser = users.find(u => u.id === userId);
    if (!currentUser) return;

    // Check if we're trying to remove the last admin
    if (newRole === 'regular' && currentUser.role === 'admin') {
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

    setLoading(true);
    const { data, error } = await userService.updateUser(userId, { role: newRole });

    if (error) {
      toast({
        title: "Error Updating User",
        description: error,
        variant: "destructive"
      });
    } else if (data) {
      setUsers(users.map(u => u.id === data.id ? data : u));
      toast({
        title: "✅ User Updated",
        description: `Role changed to ${newRole === 'admin' ? 'Administrator' : 'Regular User'}`,
        duration: 3000
      });
    }

    setLoading(false);
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      // Deselect all
      setSelectedUsers([]);
    } else {
      // Select all EXCEPT if it's the last admin
      const selectableUsers = users.filter(u => {
        // If only 1 admin exists and this user is that admin, don't allow selection
        if (u.role === 'admin' && adminCount <= 1) {
          return false;
        }
        return true;
      });
      
      if (selectableUsers.length < users.length) {
        toast({
          title: "⚠️ Last Admin Protected",
          description: "The last administrator cannot be selected for bulk operations to protect system access.",
          duration: 4000
        });
      }
      
      setSelectedUsers(selectableUsers.map(u => u.id));
    }
  };

  const adminCount = users.filter(u => u.role === 'admin').length;
  const regularCount = users.filter(u => u.role === 'regular').length;

  console.log('User counts - Total:', users.length, 'Admins:', adminCount, 'Regular:', regularCount);

  return (
    <div className="space-y-6">
      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 border-violet-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-violet-700 mb-1">Administrators</p>
                <p className="text-3xl font-bold text-violet-900">{adminCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 border-cyan-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-cyan-700 mb-1">Regular Users</p>
                <p className="text-3xl font-bold text-cyan-900">{regularCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100 border-emerald-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-emerald-900">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
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

      {/* System Users */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                System Users ({users.length})
              </CardTitle>
              <CardDescription className="text-indigo-50">
                Users are automatically created from contacts. Manage roles and reset passwords.
              </CardDescription>
            </div>
            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-3">
                <Select
                  value={bulkRoleUpdate}
                  onValueChange={(value: 'admin' | 'regular') => setBulkRoleUpdate(value)}
                  disabled={loading}
                >
                  <SelectTrigger className="w-48 bg-white text-gray-900">
                    <SelectValue placeholder="Change role to..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
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
                  disabled={loading || !bulkRoleUpdate}
                  size="sm"
                  className="bg-white text-purple-700 border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400 font-semibold shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />}
                  Update ({selectedUsers.length})
                </Button>

                <Button
                  onClick={resetMultiplePasswords}
                  disabled={loading}
                  size="sm"
                  className="bg-white text-rose-700 border-2 border-rose-300 hover:bg-rose-50 hover:border-rose-400 font-semibold shadow-lg"
                >
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  Reset Passwords ({selectedUsers.length})
                </Button>
              </div>
            )}
          </div>
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
            <>
              {/* Select All Button */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={loading}
                  className="bg-white hover:bg-indigo-50 border-indigo-300 text-indigo-700"
                >
                  {selectedUsers.length === users.length ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Select All
                    </>
                  )}
                </Button>
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} of {users.length} selected
                </span>
              </div>

              <div className="space-y-4">
              {users.map((user) => {
                const initials = user.email.split('@')[0].substring(0, 2).toUpperCase();
                return (
                <div key={user.id} className="flex items-center justify-between p-4 border-2 rounded-xl hover:shadow-md transition-shadow duration-200 border-gray-200 bg-white">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        // Prevent selecting the last admin
                        if (user.role === 'admin' && adminCount <= 1) {
                          e.preventDefault();
                          toast({
                            title: "⚠️ Cannot Select Last Admin",
                            description: "The system must have at least one administrator. This user cannot be selected for bulk operations.",
                            variant: "destructive",
                            duration: 4000
                          });
                          return;
                        }
                        
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="w-4 h-4"
                      disabled={user.role === 'admin' && adminCount <= 1}
                      title={user.role === 'admin' && adminCount <= 1 ? "Cannot select the last administrator" : ""}
                    />
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500' 
                        : 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500'
                    }`}>
                      {initials}
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
                    {/* Role toggle button - disabled only for last admin trying to demote */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log('Toggling role for user:', user.id, 'current role:', user.role);
                        const newRole = user.role === 'admin' ? 'regular' : 'admin';
                        updateUser(user.id, newRole);
                      }}
                      disabled={loading || (user.role === 'admin' && adminCount <= 1)}
                      title={
                        user.role === 'admin' 
                          ? (adminCount <= 1 ? '⚠️ Cannot remove last admin - promote another user first' : 'Change to Regular User') 
                          : '✅ Promote to Administrator'
                      }
                      className={user.role === 'admin' ? 'border-purple-400 text-purple-700 hover:bg-purple-50' : 'border-blue-400 text-blue-700 hover:bg-blue-50'}
                    >
                      <Shield className="w-4 h-4" />
                    </Button>
                    {/* Password reset button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resetPassword(user.id)}
                      disabled={loading}
                      title="Reset Password"
                    >
                      <Key className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                );
              })}
              </div>
            </>
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
                      onClick={() => copyToClipboard(`${passwordResetResult.email}: ${passwordResetResult.password}`)}
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
                  copyToClipboard(`${passwordResetResult.email}: ${passwordResetResult.password}`);
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