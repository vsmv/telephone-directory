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
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
// Remove the import of ideas-and-plans service since we'll use the database service directly

export default function SimpleLearningPlans() {
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAuth();

  console.log('👤 SimpleLearningPlans: Auth state:', { user, isAdmin, userEmail: user?.email, authLoading });

  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("__all__");
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<LearningPlan | null>(null);
  const [newPlan, setNewPlan] = useState<LearningPlanInsert>({
    email: user?.email || '',
    title: '',
    description: '',
    category: '',
    status: 'in-progress',
    target_completion_date: undefined
  });

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setNewPlan(prev => ({ ...prev, email: user.email }));
    }
  }, [user?.email]);

  // Load users for admin dropdown
  const loadUsers = useCallback(async () => {
    if (!isAdmin) return;
    
    try {
      const { data, error } = await userService.getUsers();
      if (error) {
        console.error('❌ Error loading users:', error);
        toast({
          title: "Error Loading Users",
          description: "Failed to load users for filtering",
          variant: "destructive"
        });
      } else if (data) {
        setUsers(data.filter(u => u.email !== 'admin@actrec.gov.in')); // Exclude admin user
      }
    } catch (err) {
      console.error('💥 Unexpected error loading users:', err);
    }
  }, [isAdmin, toast]);

  // Load plans from database - EXACT Contact Management pattern
  const loadPlans = useCallback(async () => {
    console.log('🔄 SimpleLearningPlans: Starting to load plans...');
    
    if (!user?.email) {
      console.log('⚠️ SimpleLearningPlans: No user email available');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      let data, error;
      
      if (isAdmin) {
        // Admin can see all plans or filtered by selected user
        console.log('👑 SimpleLearningPlans: Admin user, fetching plans');
        const result = await learningPlansService.getPlansByEmail(user.email);
        data = result.data;
        error = result.error;
        console.log('👑 Admin plans result:', { data, error, count: data?.length });
        
        // Filter by selected user if one is chosen (and not "All Users")
        if (data && selectedUser && selectedUser !== "__all__") {
          data = data.filter((plan: LearningPlan) => plan.email === selectedUser);
        }
      } else {
        // Regular user can only see their own plans
        console.log('👤 SimpleLearningPlans: Regular user, fetching plans for:', user.email);
        // Use the service that fetches plans for a specific email
        const result = await learningPlansService.getPlansByEmail(user.email);
        data = result.data;
        error = result.error;
        console.log('👤 User plans result:', { data, error, count: data?.length });
      }
      
      console.log('📚 SimpleLearningPlans: Service result:', { data, error, count: data?.length });
      
      if (error) {
        console.error('❌ SimpleLearningPlans: Error loading plans:', error);
        toast({
          title: "Error Loading Plans",
          description: "Failed to load plans from database",
          variant: "destructive"
        });
      } else if (data) {
        console.log('✅ SimpleLearningPlans: Setting plans:', data);
        console.log('✅ SimpleLearningPlans: First plan:', data[0]);
        console.log('✅ SimpleLearningPlans: Plans array length:', data.length);
        setPlans(data);
      } else {
        console.log('⚠️ SimpleLearningPlans: No data returned');
        setPlans([]);
      }
    } catch (err) {
      console.error('💥 SimpleLearningPlans: Unexpected error:', err);
      toast({
        title: "Error Loading Plans",
        description: "An unexpected error occurred while loading plans",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  }, [user?.email, isAdmin, selectedUser, toast]);

  // Load users and plans on component mount
  useEffect(() => {
    console.log('🔄 SimpleLearningPlans: useEffect triggered', { authLoading, userEmail: user?.email });
    if (!authLoading && user?.email) {
      console.log('🔄 SimpleLearningPlans: Calling loadPlans');
      if (isAdmin) {
        loadUsers();
      }
      loadPlans();
    } else {
      console.log('🔄 SimpleLearningPlans: Skipping loadPlans', { authLoading, userEmail: user?.email });
    }
  }, [loadPlans, loadUsers, authLoading, user?.email, isAdmin]);

  // Reload plans when selected user changes
  useEffect(() => {
    if (isAdmin && user?.email) {
      loadPlans();
    }
  }, [selectedUser, loadPlans, isAdmin, user?.email]);

  // Add plan function - EXACT Contact Management pattern
  const addPlan = async () => {
    if (editingPlan) {
      await updatePlan();
      return;
    }

    if (!newPlan.title || !newPlan.description || !newPlan.category) {
      toast({
        title: "Validation Error",
        description: "Title, description, and category are required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { data, error } = await learningPlansService.createPlan(newPlan);
    
    if (error) {
      toast({
        title: "Error Adding Plan",
        description: String(error) || "Failed to add plan",
        variant: "destructive"
      });
    } else if (data) {
      setPlans([data, ...plans]);
      setNewPlan({
        email: user?.email || '',
        title: '',
        description: '',
        category: '',
        status: 'in-progress',
        target_completion_date: undefined
      });
      toast({
        title: "Plan Added",
        description: `${data.title} has been added successfully`
      });
    }
    
    setLoading(false);
  };

  // Update plan function
  const updatePlan = async () => {
    if (!editingPlan) return;

    if (!editingPlan.title || !editingPlan.description || !editingPlan.category) {
      toast({
        title: "Validation Error",
        description: "Title, description, and category are required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const normalizedStatus =
      editingPlan.status === 'In Progress' ? 'in-progress' :
      editingPlan.status === 'Completed' ? 'completed' :
      editingPlan.status === 'On Hold' ? 'archived' :
      (editingPlan.status === 'not-started' || editingPlan.status === 'in-progress' || editingPlan.status === 'completed' || editingPlan.status === 'archived') ? editingPlan.status : 'not-started';

    const payload = {
      title: editingPlan.title,
      description: editingPlan.description,
      category: editingPlan.category,
      status: normalizedStatus as 'not-started' | 'in-progress' | 'completed' | 'archived',
      target_completion_date: editingPlan.target_completion_date || undefined
    };

    const { data, error } = await learningPlansService.updatePlan(
      editingPlan.id,
      payload
    );
    
    if (error) {
      toast({
        title: "Error Updating Plan",
        description: String(error) || "Failed to update plan",
        variant: "destructive"
      });
    } else if (data) {
      setPlans(plans.map(plan => 
        plan.id === editingPlan.id ? data : plan
      ));
      setEditingPlan(null);
      toast({
        title: "Plan Updated",
        description: `${data.title} has been updated successfully`
      });
    }
    
    setLoading(false);
  };

  // Delete plan function
  const deletePlan = async (id: string) => {
    setLoading(true);
    const { error } = await learningPlansService.deletePlan(id);
    
    if (error) {
      toast({
        title: "Error Deleting Plan",
        description: String(error) || "Failed to delete plan",
        variant: "destructive"
      });
    } else {
      setPlans(plans.filter(plan => plan.id !== id));
      toast({
        title: "Plan Deleted",
        description: `Plan has been deleted successfully`
      });
    }
    
    setLoading(false);
  };

  // Reset filter
  const resetFilter = () => {
    setSelectedUser('__all__');
  };

  // Debug log for rendering
  console.log('🎨 SimpleLearningPlans: Rendering with plans:', plans, 'length:', plans.length, 'loading:', loading);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Add/Edit Plan Form - EXACT Contact Management pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingPlan ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {editingPlan ? "Edit Learning Plan" : "Add New Learning Plan"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={editingPlan?.title || newPlan.title}
                onChange={(e) => editingPlan 
                  ? setEditingPlan({...editingPlan, title: e.target.value})
                  : setNewPlan(prev => ({...prev, title: e.target.value}))
                }
                placeholder="Professional Development Plan"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={editingPlan?.description || newPlan.description || ''}
                onChange={(e) => editingPlan
                  ? setEditingPlan({...editingPlan, description: e.target.value})
                  : setNewPlan(prev => ({...prev, description: e.target.value}))
                }
                placeholder="Comprehensive learning plan description"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={editingPlan?.category || newPlan.category || ''}
                  onChange={(e) => editingPlan
                    ? setEditingPlan({...editingPlan, category: e.target.value})
                    : setNewPlan(prev => ({...prev, category: e.target.value}))
                  }
                  placeholder="Professional"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={editingPlan?.status || newPlan.status || 'in-progress'}
                  onChange={(e) => {
                    const status = e.target.value as 'not-started' | 'in-progress' | 'completed' | 'archived';
                    editingPlan
                      ? setEditingPlan({...editingPlan, status})
                      : setNewPlan(prev => ({...prev, status}));
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="archived">On Hold</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="target_date">Target Completion Date</Label>
              <Input
                id="target_date"
                type="date"
                value={editingPlan?.target_completion_date || newPlan.target_completion_date || ''}
                onChange={(e) => editingPlan
                  ? setEditingPlan({...editingPlan, target_completion_date: e.target.value})
                  : setNewPlan(prev => ({...prev, target_completion_date: e.target.value}))
                }
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={addPlan} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                {editingPlan ? 'Update Plan' : 'Add Plan'}
              </Button>
              {editingPlan && (
                <Button variant="outline" onClick={() => setEditingPlan(null)} disabled={loading}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans List - EXACT Contact Management pattern */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Learning Plans ({plans.length})</CardTitle>
            {isAdmin && (
              <div className="flex items-center gap-2">
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">All Users</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.email} value={user.email}>
                        {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedUser && selectedUser !== "__all__" && (
                  <Button variant="outline" size="sm" onClick={resetFilter}>
                    Clear
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading plans...</span>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No learning plans found. Add your first plan to get started.
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {plans.map((plan) => (
                <div key={plan.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{plan.title}</h3>
                        {isAdmin && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {plan.email}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>Category: {plan.category}</span>
                        <span>Status: {plan.status}</span>
                        {plan.target_completion_date && (
                          <span>Target: {new Date(plan.target_completion_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log('🖊️ Editing plan:', plan);
                          setEditingPlan(plan);
                          // Scroll to top form
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        disabled={loading}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePlan(plan.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}