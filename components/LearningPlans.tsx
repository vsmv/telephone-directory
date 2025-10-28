import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { LearningPlan } from '@/lib/types';
import * as planService from '@/lib/ideas-and-plans';
import { Pencil, Trash2, Plus, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LearningPlansProps {
  email: string;
  isAdmin?: boolean;
}

export default function LearningPlans({ email, isAdmin = false }: LearningPlansProps) {
  const { toast } = useToast();
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPlan, setEditingPlan] = useState<LearningPlan | null>(null);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    status: 'not-started' | 'in-progress' | 'completed' | 'archived';
    target_completion_date: string;
  }>({
    title: '',
    description: '',
    category: '',
    status: 'not-started',
    target_completion_date: '',
  });

  const loadPlans = async () => {
    setLoading(true);
    try {
      const { data, error } = await planService.getLearningPlans(email);
      if (error) throw error;
      setPlans(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load learning plans',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [email]);

  const handleSubmit = async () => {
    try {
      if (editingPlan) {
        // Update existing plan
        const { error } = await planService.updateLearningPlan(email, editingPlan.title, {
          description: formData.description,
          category: formData.category,
          status: formData.status,
          target_completion_date: formData.target_completion_date || undefined,
        });
        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Learning plan updated successfully',
        });
      } else {
        // Create new plan
        const { error } = await planService.createLearningPlan({
          email,
          ...formData,
        });
        if (error) throw error;
        toast({
          title: 'Success',
          description: 'Learning plan created successfully',
        });
      }
      setShowDialog(false);
      loadPlans();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save learning plan',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (title: string) => {
    try {
      const { error } = await planService.deleteLearningPlan(email, title);
      if (error) throw error;
      toast({
        title: 'Success',
        description: 'Learning plan deleted successfully',
      });
      loadPlans();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete learning plan',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (plan: LearningPlan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      category: plan.category,
      status: plan.status,
      target_completion_date: plan.target_completion_date || '',
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingPlan(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      status: 'not-started' as const,
      target_completion_date: '',
    });
    setShowDialog(true);
  };

  if (loading) {
    return <div>Loading learning plans...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Learning Plans</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.title}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{plan.title}</span>
                <div className="space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(plan.title)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                {plan.category} - {plan.status}
                {plan.target_completion_date && (
                  <div className="flex items-center mt-1 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(plan.target_completion_date).toLocaleDateString()}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{plan.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPlan ? 'Edit Learning Plan' : 'New Learning Plan'}</DialogTitle>
            <DialogDescription>
              {editingPlan
                ? 'Update the learning plan details below'
                : 'Enter the details for your new learning plan'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                disabled={!!editingPlan}
              />
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="category">Category</label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="status">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as 'not-started' | 'in-progress' | 'completed' | 'archived',
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="target_completion_date">Target Completion Date</label>
              <Input
                id="target_completion_date"
                type="date"
                value={formData.target_completion_date}
                onChange={(e) =>
                  setFormData({ ...formData, target_completion_date: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingPlan ? 'Update Plan' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}