"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { userService, type UserProfile } from '@/lib/database';
import { learningPlansService, type LearningPlan } from '@/lib/ideas-and-plans';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { Plus, Edit, Trash2, Loader2, Save, X } from 'lucide-react';

type PlanStatus = 'not-started' | 'in-progress' | 'completed' | 'archived';

interface EditFormState {
  description: string;
  category: string;
  status: PlanStatus;
}

export default function SimpleLearningPlans() {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("__all__");
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LearningPlan | null>(null);
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    category: '',
    status: 'in-progress' as PlanStatus
  });

  const loadPlans = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    const { data } = await learningPlansService.getPlansByEmail(user.email);
    if (data) {
      const filtered = selectedUser === "__all__" 
        ? data 
        : data.filter((plan: LearningPlan) => plan.email === selectedUser);
      setPlans(filtered);
    }
    setLoading(false);
  }, [user?.email, selectedUser]);

  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    const { data } = await userService.getUsers();
    if (data) setUsers(data.filter((u: UserProfile) => u.email !== 'admin@actrec.gov.in'));
  }, [isAdmin]);

  useEffect(() => {
    if (user?.email) {
      loadPlans();
      if (isAdmin) loadUsers();
    }
  }, [user?.email, isAdmin, loadPlans, loadUsers]);

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

  const handleUpdate = async () => {
    if (!editingPlan) return;
    if (!editingPlan.description || !editingPlan.category) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await learningPlansService.updatePlan(editingPlan.id, {
      description: editingPlan.description,
      category: editingPlan.category,
      status: editingPlan.status
    });
    if (data) {
      setPlans(plans.map((p: LearningPlan) => p.id === editingPlan.id ? data : p));
      setEditingPlan(null);
      toast({ title: "Success", description: "Plan updated successfully" });
    } else {
      toast({ title: "Error", description: error || "Failed to update", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const { error } = await learningPlansService.deletePlan(id);
    if (!error) {
      setPlans(plans.filter((p: LearningPlan) => p.id !== id));
      toast({ title: "Success", description: "Plan deleted successfully" });
    } else {
      toast({ title: "Error", description: error || "Failed to delete", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
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
              onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
              placeholder="Enter plan title"
            />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea
              value={newPlan.description}
              onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
              placeholder="Enter description"
              rows={4}
            />
          </div>
          <div>
            <Label>Category *</Label>
            <Input
              value={newPlan.category}
              onChange={(e) => setNewPlan({ ...newPlan, category: e.target.value })}
              placeholder="Enter category"
            />
          </div>
          <div>
            <Label>Status</Label>
            <select
              value={newPlan.status}
              onChange={(e) => setNewPlan({ ...newPlan, status: e.target.value as PlanStatus })}
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
                  {users.map((u: UserProfile) => (
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
            <div className="text-center py-8 text-gray-500">No learning plans found</div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {plans.map((plan: LearningPlan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  {editingPlan?.id === plan.id ? (
                    <div className="space-y-3">
                      <div>
                        <Label>Description</Label>
                        <textarea
                          value={editingPlan.description}
                          onChange={(e) => setEditingPlan({...editingPlan, description: e.target.value})}
                          rows={3}
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <input
                          type="text"
                          value={editingPlan.category}
                          onChange={(e) => setEditingPlan({...editingPlan, category: e.target.value})}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <select
                          value={editingPlan.status}
                          onChange={(e) => setEditingPlan({...editingPlan, status: e.target.value as PlanStatus})}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="not-started">Not Started</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="archived">On Hold</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdate} disabled={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingPlan(null)}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
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
                        <Button variant="ghost" size="sm" onClick={() => setEditingPlan(plan)}>
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
