import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { PatentableIdea, PatentableIdeaInsert, patentableIdeasService } from '@/lib/ideas-and-plans';
import { Plus, Edit, Trash2, Save } from 'lucide-react';

interface PatentableIdeasProps {
  userEmail: string;
}

export function PatentableIdeas({ userEmail }: PatentableIdeasProps) {
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<PatentableIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState<PatentableIdeaInsert>({
    email: userEmail,
    title: '',
    description: '',
    category: ''
  });

  const loadIdeas = useCallback(async () => {
    setLoading(true);
    const { data, error } = await patentableIdeasService.getIdeasByEmail(userEmail);
    if (error) {
      toast({
        title: 'Error Loading Ideas',
        description: error.message,
        variant: 'destructive'
      });
    } else if (data) {
      setIdeas(data);
    }
    setLoading(false);
  }, [userEmail, patentableIdeasService, toast]);

  // Load ideas on component mount
  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const handleAddIdea = async () => {
    if (!newIdea.title) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive'
      });
      return;
    }

    const { data, error } = await patentableIdeasService.createIdea(newIdea);
    if (error) {
      toast({
        title: 'Error Adding Idea',
        description: error.message,
        variant: 'destructive'
      });
    } else if (data) {
      setIdeas([data, ...ideas]);
      setNewIdea({
        email: userEmail,
        title: '',
        description: '',
        category: ''
      });
      toast({
        title: 'Success',
        description: 'Patentable idea added successfully'
      });
    }
  };

  const handleUpdateIdea = async (id: string, updates: Partial<PatentableIdeaInsert>) => {
    const { data, error } = await patentableIdeasService.updateIdea(id, updates);
    if (error) {
      toast({
        title: 'Error Updating Idea',
        description: error.message,
        variant: 'destructive'
      });
    } else if (data) {
      setIdeas(ideas.map(idea => idea.id === id ? data : idea));
      setEditing(null);
      toast({
        title: 'Success',
        description: 'Patentable idea updated successfully'
      });
    }
  };

  const handleDeleteIdea = async (id: string) => {
    const { error } = await patentableIdeasService.deleteIdea(id);
    if (error) {
      toast({
        title: 'Error Deleting Idea',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      setIdeas(ideas.filter(idea => idea.id !== id));
      toast({
        title: 'Success',
        description: 'Patentable idea deleted successfully'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Add New Idea Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Patentable Idea</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newIdea.title}
                onChange={e => setNewIdea({ ...newIdea, title: e.target.value })}
                placeholder="Enter idea title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newIdea.description || ''}
                onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                placeholder="Enter idea description"
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newIdea.category || ''}
                onChange={e => setNewIdea({ ...newIdea, category: e.target.value })}
                placeholder="Enter idea category"
              />
            </div>
            <Button onClick={handleAddIdea} disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              Add Idea
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ideas List */}
      <div className="space-y-4">
        {ideas.map(idea => (
          <Card key={idea.id}>
            <CardContent className="pt-6">
              {editing === idea.id ? (
                <div className="space-y-4">
                  <Input
                    value={idea.title}
                    onChange={e => setIdeas(ideas.map(i => 
                      i.id === idea.id ? { ...i, title: e.target.value } : i
                    ))}
                  />
                  <Textarea
                    value={idea.description}
                    onChange={e => setIdeas(ideas.map(i => 
                      i.id === idea.id ? { ...i, description: e.target.value } : i
                    ))}
                  />
                  <Input
                    value={idea.category}
                    onChange={e => setIdeas(ideas.map(i => 
                      i.id === idea.id ? { ...i, category: e.target.value } : i
                    ))}
                  />
                  <div className="space-x-2">
                    <Button onClick={() => handleUpdateIdea(idea.id, {
                      title: idea.title,
                      description: idea.description,
                      category: idea.category
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
                      <h3 className="font-semibold">{idea.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{idea.description}</p>
                      <p className="text-sm text-gray-500 mt-1">Category: {idea.category}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Added: {new Date(idea.date_added).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="icon" onClick={() => setEditing(idea.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteIdea(idea.id)}>
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