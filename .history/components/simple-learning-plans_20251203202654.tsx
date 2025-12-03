"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, BookOpen, Loader2, Edit, Trash2, Save, X, AlertTriangle, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

// Learning Plan Categories
const LEARNING_CATEGORIES = [
  'Technical Skills',
  'Research Methodology',
  'Clinical Training',
  'Laboratory Skills',
  'Data Analysis',
  'Communication',
  'Leadership',
  'Compliance & Ethics',
  'Software/Technology',
  'Other'
];

// Learning Plan Status Options
const LEARNING_STATUS = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'cancelled', label: 'Cancelled' }
];

interface LearningPlan {
  id: string;
  email: string;
  title: string;
  description: string;
  category: string;
  status: string;
  target_completion_date?: string;
  created_at: string;
  updated_at: string;
}

interface SimpleLearningPlansProps {
  userEmail: string;
  userRole?: 'admin' | 'regular';
}

export function SimpleLearningPlans({ userEmail, userRole = 'regular' }: SimpleLearningPlansProps) {
  const { toast } = useToast();
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<LearningPlan>>({});
  const [deleteConfirmPlan, setDeleteConfirmPlan] = useState<LearningPlan | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [newPlan, setNewPlan] = useState({
    email: userEmail,
    title: '',
    description: '',
    category: '',
    status: 'not-started'
  });

  // Direct fetch - no auth token needed for GET (RLS handles security)
  const loadPlans = async () => {
    console.log('🔄 Loading learning plans...');
    setLoading(true);
    
    try {
      const response = await fetch('/api/learning-plans');
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📊 Raw result:', result);
      
      if (result.data) {
        console.log(`✅ Got ${result.data.length} learning plans`);
        setPlans(result.data);
        
        // BOTH admin and regular users see only their OWN plans in this tab
        // Admin sees collective stats in Settings tab instead
        const userPlans = result.data.filter((plan: LearningPlan) => plan.email === userEmail);
        setFilteredPlans(userPlans);
        console.log(`👤 Filtered to ${userPlans.length} plans for ${userEmail}`);
      } else {
        console.log('⚠️ No data in result');
        setPlans([]);
        setFilteredPlans([]);
      }
    } catch (error) {
      console.error('❌ Error loading plans:', error);
      toast({
        title: '❌ Error Loading Plans',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
        duration: 5000
      });
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadPlans();
  }, []);

  const handleAddPlan = async () => {
    if (!newPlan.title.trim()) {
      toast({
        title: '⚠️ Validation Error',
        description: 'Title is required',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }

    try {
      const response = await fetch('/api/learning-plans', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPlan)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.data) {
        setPlans([result.data, ...plans]);
        setNewPlan({
          email: userEmail,
          title: '',
          description: '',
          category: '',
          status: 'not-started'
        });
        toast({
          title: '✅ Success',
          description: 'Learning plan added successfully',
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: '❌ Error Adding Plan',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
        duration: 5000
      });
    }
  };

  const handleUpdatePlan = async (id: string) => {
    try {
      const response = await fetch('/api/learning-plans', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, ...editForm })
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.data) {
        setPlans(plans.map(plan => plan.id === id ? result.data : plan));
        setFilteredPlans(filteredPlans.map(plan => plan.id === id ? result.data : plan));
        setEditing(null);
        setEditForm({});
        toast({
          title: '✅ Success',
          description: 'Learning plan updated successfully',
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: '❌ Error Updating Plan',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
        duration: 5000
      });
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      const response = await fetch(`/api/learning-plans?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      setPlans(plans.filter(plan => plan.id !== id));
      setFilteredPlans(filteredPlans.filter(plan => plan.id !== id));
      setSelectedPlans(selectedPlans.filter(planId => planId !== id));
      toast({
        title: '✅ Success',
        description: 'Learning plan deleted successfully',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: '❌ Error Deleting Plan',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setDeleteConfirmPlan(null);
    }
  };

  const handleSelectPlan = (id: string) => {
    setSelectedPlans(prev => 
      prev.includes(id) ? prev.filter(planId => planId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPlans.length === filteredPlans.length) {
      setSelectedPlans([]);
    } else {
      setSelectedPlans(filteredPlans.map(plan => plan.id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedPlans.map(id => 
          fetch(`/api/learning-plans?id=${id}`, { method: 'DELETE' })
        )
      );

      setPlans(plans.filter(plan => !selectedPlans.includes(plan.id)));
      setFilteredPlans(filteredPlans.filter(plan => !selectedPlans.includes(plan.id)));
      setSelectedPlans([]);
      toast({
        title: '✅ Success',
        description: `${selectedPlans.length} learning plans deleted successfully`,
        duration: 3000
      });
    } catch (error) {
      toast({
        title: '❌ Error Deleting Plans',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setBulkDeleteConfirm(false);
    }
  };

  // Calculate status counts from filtered plans
  const inProgressCount = filteredPlans.filter(p => p.status === 'in-progress').length;
  const completedCount = filteredPlans.filter(p => p.status === 'completed').length;
  const notStartedCount = filteredPlans.filter(p => p.status === 'not-started').length;

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 border-emerald-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-700 mb-1">My Plans</p>
                <p className="text-3xl font-bold text-emerald-900">{filteredPlans.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 border-amber-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700 mb-1">In Progress</p>
                <p className="text-3xl font-bold text-amber-900">{inProgressCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 border-green-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-900">{completedCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 border-slate-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Not Started</p>
                <p className="text-3xl font-bold text-slate-900">{notStartedCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Plan Form */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Learning Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newPlan.title}
                onChange={e => setNewPlan({ ...newPlan, title: e.target.value })}
                placeholder="Enter plan title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newPlan.description}
                onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}
                placeholder="Enter plan description"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={newPlan.category}
                onValueChange={(value) => setNewPlan({ ...newPlan, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {LEARNING_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddPlan} disabled={loading} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Add Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selection Controls */}
      {filteredPlans.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={loading}
            >
              {selectedPlans.length === filteredPlans.length ? (
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
              {selectedPlans.length} of {filteredPlans.length} selected
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setBulkDeleteConfirm(true)}
              disabled={selectedPlans.length === 0 || loading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Plans List */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            My Learning Plans ({filteredPlans.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading plans...</span>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No learning plans found</p>
              <p className="text-sm">Add your first plan using the form above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPlans.map(plan => (
                <Card key={plan.id} className="border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    {editing === plan.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={editForm.title || ''}
                            onChange={e => setEditForm({...editForm, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={editForm.description || ''}
                            onChange={e => setEditForm({...editForm, description: e.target.value})}
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select
                            value={editForm.category || ''}
                            onValueChange={(value) => setEditForm({...editForm, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {LEARNING_CATEGORIES.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={editForm.status || ''}
                            onValueChange={(value) => setEditForm({...editForm, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {LEARNING_STATUS.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleUpdatePlan(plan.id)}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => { setEditing(null); setEditForm({}); }}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{plan.title}</h3>
                          <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm text-gray-500">
                              <strong>Category:</strong> {plan.category || 'Uncategorized'}
                            </span>
                            <span className="text-sm text-gray-500">
                              <strong>Status:</strong> {plan.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              <strong>Email:</strong> {plan.email}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(plan.created_at).toLocaleDateString()}
                            {plan.target_completion_date && 
                              ` • Target: ${new Date(plan.target_completion_date).toLocaleDateString()}`
                            }
                          </p>
                        </div>
                        {/* Only show edit/delete buttons if user owns this plan */}
                        {plan.email === userEmail && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => { 
                                setEditing(plan.id);
                                setEditForm({ title: plan.title, description: plan.description, category: plan.category, status: plan.status });
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteConfirmPlan(plan)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmPlan} onOpenChange={() => setDeleteConfirmPlan(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong className="text-gray-900">{deleteConfirmPlan?.title}</strong>?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmPlan(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmPlan && handleDeletePlan(deleteConfirmPlan.id)}
            >
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}