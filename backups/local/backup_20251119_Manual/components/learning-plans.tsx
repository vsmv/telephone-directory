"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { LearningPlan, LearningPlanInsert, learningPlansService } from '@/lib/ideas-and-plans';
import { Plus, Edit, Trash2, Save, BookOpen, Loader2 } from 'lucide-react';

interface LearningPlansProps {
  userEmail: string;
}

export function LearningPlans({ userEmail }: LearningPlansProps) {
  const { toast } = useToast();
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState<LearningPlanInsert>({
    email: userEmail,
    title: '',
    description: '',
    category: '',
    status: 'not-started'
  });

  const loadPlans = useCallback(async () => {
    setLoading(true);
    // Fetch ALL plans (not filtered by email) - admin can see all
    const { data, error } = await learningPlansService.getAllPlans();
    if (error) {
      toast({
        title: 'Error Loading Plans',
        description: error.message,
        variant: 'destructive'
      });
    } else if (data) {
      setPlans(data);
    }
    setLoading(false);
  }, [toast]);

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleAddPlan = async () => {
    if (!newPlan.title) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive'
      });
      return;
    }

    const { data, error } = await learningPlansService.createPlan(newPlan);
    if (error) {
      toast({
        title: 'Error Adding Plan',
        description: error.message,
        variant: 'destructive'
      });
    } else if (data) {
      setPlans([data, ...plans]);
      setNewPlan({
        email: userEmail,
        title: '',
        description: '',
        category: '',
        status: 'not-started'
      });
      toast({
        title: 'Success',
        description: 'Learning plan added successfully'
      });
    }
  };

  const handleUpdatePlan = async (id: string, updates: Partial<LearningPlanInsert>) => {
    const { data, error } = await learningPlansService.updatePlan(id, updates);
    if (error) {
      toast({
        title: 'Error Updating Plan',
        description: error.message,
        variant: 'destructive'
      });
    } else if (data) {
      setPlans(plans.map(plan => plan.id === id ? data : plan));
      setEditing(null);
      toast({
        title: 'Success',
        description: 'Learning plan updated successfully'
      });
    }
  };

  const handleDeletePlan = async (id: string) => {
    const { error } = await learningPlansService.deletePlan(id);
    if (error) {
      toast({
        title: 'Error Deleting Plan',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      setPlans(plans.filter(plan => plan.id !== id));
      toast({
        title: 'Success',
        description: 'Learning plan deleted successfully'
      });
    }
  };

  const handleStatusChange = async (id: string, status: 'In Progress' | 'Completed' | 'On Hold') => {
    const { data, error } = await learningPlansService.updatePlanStatus(id, status);
    if (error) {
      toast({
        title: 'Error Updating Status',
        description: error.message,
        variant: 'destructive'
      });
    } else if (data) {
      setPlans(plans.map(plan => plan.id === id ? data : plan));
      toast({
        title: 'Success',
        description: 'Learning plan status updated successfully'
      });
    }
  };

  const inProgressCount = plans.filter(p => p.status === 'in-progress').length;
  const completedCount = plans.filter(p => p.status === 'completed').length;
  const onHoldCount = plans.filter(p => p.status === 'not-started').length;

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
                <p className="text-sm text-gray-600">Total Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{inProgressCount}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{onHoldCount}</p>
                <p className="text-sm text-gray-600">Not Started</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Plan Form */}
      <Card>
        <CardHeader>
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
                value={newPlan.description || ''}
                onChange={e => setNewPlan({ ...newPlan, description: e.target.value })}
                placeholder="Enter plan description"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newPlan.category || ''}
                onChange={e => setNewPlan({ ...newPlan, category: e.target.value })}
                placeholder="Enter plan category"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={newPlan.status}
                onValueChange={value => setNewPlan({ ...newPlan, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetDate">Target Completion Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={newPlan.target_completion_date || ''}
                onChange={e => setNewPlan({ ...newPlan, target_completion_date: e.target.value })}
              />
            </div>
            <Button onClick={handleAddPlan} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Add Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            All Learning Plans ({plans.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading plans...</span>
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No learning plans found</p>
              <p className="text-sm">Add your first plan using the form above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map(plan => (
                <Card key={plan.id}>
                  <CardContent className="pt-6">
                    {editing === plan.id ? (
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={plan.title}
                            onChange={e => setPlans(plans.map(p => 
                              p.id === plan.id ? { ...p, title: e.target.value } : p
                            ))}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={plan.description}
                            onChange={e => setPlans(plans.map(p => 
                              p.id === plan.id ? { ...p, description: e.target.value } : p
                            ))}
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Input
                            value={plan.category}
                            onChange={e => setPlans(plans.map(p => 
                              p.id === plan.id ? { ...p, category: e.target.value } : p
                            ))}
                          />
                        </div>
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={plan.status}
                            onValueChange={value => setPlans(plans.map(p =>
                              p.id === plan.id ? { ...p, status: value as 'In Progress' | 'Completed' | 'On Hold' } : p
                            ))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="not-started">Not Started</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Target Completion Date</Label>
                          <Input
                            type="date"
                            value={plan.target_completion_date || ''}
                            onChange={e => setPlans(plans.map(p =>
                              p.id === plan.id ? { ...p, target_completion_date: e.target.value } : p
                            ))}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdatePlan(plan.id, {
                            title: plan.title,
                            description: plan.description,
                            category: plan.category,
                            status: plan.status as any,
                            target_completion_date: plan.target_completion_date
                          })} disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save
                          </Button>
                          <Button variant="outline" onClick={() => setEditing(null)} disabled={loading}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{plan.title}</h3>
                            <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                            <div className="flex items-center gap-4 mt-3">
                              <span className="text-sm text-gray-500">
                                <strong>Category:</strong> {plan.category || 'Uncategorized'}
                              </span>
                              <span className="text-sm text-gray-500">
                                <strong>Email:</strong> {plan.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <Label className="text-sm">Status:</Label>
                              <Select
                                value={plan.status}
                                onValueChange={value => handleStatusChange(plan.id, value as any)}
                                disabled={loading}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="not-started">Not Started</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Added: {new Date(plan.created_at).toLocaleDateString()} • 
                              Last Modified: {new Date(plan.updated_at).toLocaleDateString()}
                              {plan.target_completion_date && 
                                ` • Target: ${new Date(plan.target_completion_date).toLocaleDateString()}`
                              }
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="icon" onClick={() => setEditing(plan.id)} disabled={loading}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeletePlan(plan.id)} disabled={loading}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}