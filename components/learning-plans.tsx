import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { LearningPlan, LearningPlanInsert, learningPlansService } from '@/lib/ideas-and-plans';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

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
    status: 'In Progress'
  });

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, [userEmail]);

  const loadPlans = async () => {
    setLoading(true);
    const { data, error } = await learningPlansService.getPlansByEmail(userEmail);
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
  };

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
        status: 'In Progress'
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

  return (
    <div className="space-y-4">
      {/* Add New Plan Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Learning Plan</CardTitle>
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
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
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
              <Plus className="w-4 h-4 mr-2" />
              Add Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans List */}
      <div className="space-y-4">
        {plans.map(plan => (
          <Card key={plan.id}>
            <CardContent className="pt-6">
              {editing === plan.id ? (
                <div className="space-y-4">
                  <Input
                    value={plan.title}
                    onChange={e => setPlans(plans.map(p => 
                      p.id === plan.id ? { ...p, title: e.target.value } : p
                    ))}
                  />
                  <Textarea
                    value={plan.description}
                    onChange={e => setPlans(plans.map(p => 
                      p.id === plan.id ? { ...p, description: e.target.value } : p
                    ))}
                  />
                  <Input
                    value={plan.category}
                    onChange={e => setPlans(plans.map(p => 
                      p.id === plan.id ? { ...p, category: e.target.value } : p
                    ))}
                  />
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
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={plan.target_completion_date || ''}
                    onChange={e => setPlans(plans.map(p =>
                      p.id === plan.id ? { ...p, target_completion_date: e.target.value } : p
                    ))}
                  />
                  <div className="space-x-2">
                    <Button onClick={() => handleUpdatePlan(plan.id, {
                      title: plan.title,
                      description: plan.description,
                      category: plan.category,
                      status: plan.status as any,
                      target_completion_date: plan.target_completion_date
                    })}>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{plan.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                      <p className="text-sm text-gray-500 mt-1">Category: {plan.category}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Select
                          value={plan.status}
                          onValueChange={value => handleStatusChange(plan.id, value as any)}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Added: {new Date(plan.date_added).toLocaleDateString()}
                        {plan.target_completion_date && 
                          ` | Target: ${new Date(plan.target_completion_date).toLocaleDateString()}`
                        }
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="icon" onClick={() => setEditing(plan.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeletePlan(plan.id)}>
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
    </div>
  );
}