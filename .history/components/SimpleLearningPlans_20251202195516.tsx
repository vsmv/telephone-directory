"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userService, type UserProfile } from '@/lib/database';
import { learningPlansService, type LearningPlan, type LearningPlanInsert } from '@/lib/ideas-and-plans';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { Plus, Edit, Trash2, Loader2, Save, X } from 'lucide-react';

export default function SimpleLearningPlans() {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("__all__");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ description: '', category: '', status: 'in-progress' as 'not-started' | 'in-progress' | 'completed' | 'archived' });
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    category: '',
    status: 'in-progress' as 'not-started' | 'in-progress' | 'completed' | 'archived'
  });

  // Load plans
  const loadPlans = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    const { data, error } = await learningPlansService.getPlansByEmail(user.email);
    if (data) {
      const filtered = selectedUser === "__all__" ? data : data.filter(p => p.email === selectedUser);
      setPlans(filtered);
    }
    setLoading(false);
  }, [user?.email, selectedUser]);

  // Load users (admin only)
  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    const { data } = await userService.getUsers();
    if (data) setUsers(data.filter(u => u.email !== 'admin@actrec.gov.in'));
  }, [isAdmin]);

  useEffect(() => {
    if (user?.email) {
      loadPlans();
      if (isAdmin) loadUsers();
    }
  }, [user?.email, isAdmin, loadPlans, loadUsers]);

  // Add new plan
  const handleAdd = async () => {
    if (!newPlan.title || !newPlan.description || !newPlan.category) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await learningPlansService.createPlan({
      ...newPlan,
      email: user?.email || ''
    });
    if (data) {
      setPlans([data, ...plans]);
      setNewPlan({ title: '', description: '', category: '', status: 'in-progress' });
      toast({ title: "Success", description: "Plan added successfully" });
    } else {
      toast({ title: "Error", description: error || "Failed to add plan", variant: "destructive" });
    }
    setLoading(false);
  };

  // Start editing
  const startEdit = (plan: LearningPlan) => {
    setEditingId(plan.id);
    setEditForm({ description: plan.description, category: plan.category, status: plan.status as any });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ description: '', category: '', status: 'in-progress' });
  };

  // Update plan
  const handleUpdate = async (id: string) => {
    if (!editForm.description || !editForm.category) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await learningPlansService.updatePlan(id, {
      description: editForm.description,
      category: editForm.category,
      status: editForm.status as any
    });
    if (data) {
      setPlans(plans.map(p => p.id === id ? data : p));
      setEditingId(null);
      setEditForm({ description: '', category: '', status: 'in-progress' });
      toast({ title: "Success", description: "Plan updated successfully" });
    } else {
      toast({ title: "Error", description: error || "Failed to update", variant: "destructive" });
    }
    setLoading(false);
  };

  // Delete plan
  const handleDelete = async (id: string) => {
    setLoading(true);
    const { error } = await learningPlansService.deletePlan(id);
    if (!error) {
      setPlans(plans.filter(p => p.id !== id));
      toast({ title: "Success", description: "Plan deleted successfully" });
    } else {
      toast({ title: "Error", description: error || "Failed to delete", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Add New Plan Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Learning Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input
              value={newPlan.title}
              onChange={(e) => setNewPlan(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter plan title"
            />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea
              value={newPlan.description}
              onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description"
              rows={4}
            />
          </div>
          <div>
            <Label>Category *</Label>
            <Input
              value={newPlan.category}
              onChange={(e) => setNewPlan(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Enter category"
            />
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={newPlan.status}
              onChange={(e) => setNewPlan(prev => ({ ...prev, status: e.target.value as any }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="archived">On Hold</option>
            </select>
          </div>
          <Button onClick={handleAdd} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Plan
          </Button>
        </CardContent>
      </Card>

      {/* Plans List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Learning Plans ({plans.length})</CardTitle>
            {isAdmin && (
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">All Users</SelectItem>
                  {users.map(u => (
                    <SelectItem key={u.email} value={u.email}>{u.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No learning plans found
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {plans.map(plan => (
                <div key={plan.id} className="border rounded-lg p-4">
                  {editingId === plan.id ? (
                    // EDIT MODE
                    <div className="space-y-3">
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="archived">On Hold</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdate(plan.id)} disabled={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // VIEW MODE
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{plan.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>Category: {plan.category}</span>
                          <span>Status: {plan.status}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button variant="ghost" size="sm" onClick={() => startEdit(plan)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(plan.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
