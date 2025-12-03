"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Lightbulb, Loader2, Edit, Trash2, Save, X } from 'lucide-react';

interface PatentableIdea {
  id: string;
  email: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface SimplePatentableIdeasProps {
  userEmail: string;
  userRole?: 'admin' | 'regular';
}

export function SimplePatentableIdeas({ userEmail, userRole = 'regular' }: SimplePatentableIdeasProps) {
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<PatentableIdea[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<PatentableIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PatentableIdea>>({});
  const [newIdea, setNewIdea] = useState({
    email: userEmail,
    title: '',
    description: '',
    category: ''
  });

  // Direct fetch - no auth token needed for GET (RLS handles security)
  const loadIdeas = async () => {
    console.log('🔄 Loading patentable ideas...');
    setLoading(true);
    
    try {
      const response = await fetch('/api/patentable-ideas');
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const result = await response.json();
      console.log('📊 Raw result:', result);
      
      if (result.data) {
        console.log(`✅ Got ${result.data.length} patentable ideas`);
        setIdeas(result.data);
        
        // Filter based on user role
        if (userRole === 'admin') {
          // Admin sees all ideas
          setFilteredIdeas(result.data);
        } else {
          // Regular users see only their own ideas
          const userIdeas = result.data.filter((idea: PatentableIdea) => idea.email === userEmail);
          setFilteredIdeas(userIdeas);
        }
      } else {
        console.log('⚠️ No data in result');
        setIdeas([]);
        setFilteredIdeas([]);
      }
    } catch (error) {
      console.error('❌ Error loading ideas:', error);
      toast({
        title: '❌ Error Loading Ideas',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
        duration: 5000
      });
      setIdeas([]);
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    loadIdeas();
  }, []);

  const handleAddIdea = async () => {
    if (!newIdea.title.trim()) {
      toast({
        title: '⚠️ Validation Error',
        description: 'Title is required',
        variant: 'destructive',
        duration: 3000
      });
      return;
    }

    try {
      const response = await fetch('/api/patentable-ideas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newIdea)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      
      if (result.data) {
        setIdeas([result.data, ...ideas]);
        setNewIdea({
          email: userEmail,
          title: '',
          description: '',
          category: ''
        });
        toast({
          title: '✅ Success',
          description: 'Patentable idea added successfully',
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: '❌ Error Adding Idea',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
        duration: 5000
      });
    }
  };

  const handleUpdateIdea = async (id: string) => {
    try {
      const response = await fetch('/api/patentable-ideas', {
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
        setIdeas(ideas.map(idea => idea.id === id ? result.data : idea));
        setFilteredIdeas(filteredIdeas.map(idea => idea.id === id ? result.data : idea));
        setEditing(null);
        setEditForm({});
        toast({
          title: '✅ Success',
          description: 'Patentable idea updated successfully',
          duration: 3000
        });
      }
    } catch (error) {
      toast({
        title: '❌ Error Updating Idea',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
        duration: 5000
      });
    }
  };

  const handleDeleteIdea = async (id: string) => {
    if (!confirm('Are you sure you want to delete this patentable idea?')) {
      return;
    }

    try {
      const response = await fetch(`/api/patentable-ideas?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || `HTTP ${response.status}`);
      }

      setIdeas(ideas.filter(idea => idea.id !== id));
      toast({
        title: '✅ Success',
        description: 'Patentable idea deleted successfully',
        duration: 3000
      });
    } catch (error) {
      toast({
        title: '❌ Error Deleting Idea',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
        duration: 5000
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Debug Info */}
      <Card className="bg-purple-50">
        <CardContent className="p-4">
          <p className="text-sm">
            <strong>Debug:</strong> Loading: {loading ? 'Yes' : 'No'} | 
            Ideas Count: {ideas.length} | 
            API Status: {ideas.length > 0 ? 'Working' : 'Check Console'}
          </p>
        </CardContent>
      </Card>

      {/* Statistics Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{filteredIdeas.length}</p>
              <p className="text-sm text-gray-600">{userRole === 'admin' ? 'Total Patentable Ideas' : 'My Patentable Ideas'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Idea Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Patentable Idea
          </CardTitle>
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
                value={newIdea.description}
                onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                placeholder="Enter idea description"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newIdea.category}
                onChange={e => setNewIdea({ ...newIdea, category: e.target.value })}
                placeholder="Enter idea category"
              />
            </div>
            <Button onClick={handleAddIdea} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Add Idea
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ideas List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            {userRole === 'admin' ? 'All Patentable Ideas' : 'My Patentable Ideas'} ({filteredIdeas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading ideas...</span>
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No patentable ideas found</p>
              <p className="text-sm">{userRole === 'admin' ? 'No ideas in the system yet' : 'Add your first idea using the form above'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredIdeas.map(idea => (
                <Card key={idea.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="pt-6">
                    {editing === idea.id ? (
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
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Input
                            value={editForm.category || ''}
                            onChange={e => setEditForm({...editForm, category: e.target.value})}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdateIdea(idea.id)} disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save
                          </Button>
                          <Button variant="outline" onClick={() => { setEditing(null); setEditForm({}); }} disabled={loading}>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{idea.title}</h3>
                          <p className="text-sm text-gray-600 mt-2">{idea.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-sm text-gray-500">
                              <strong>Category:</strong> {idea.category || 'Uncategorized'}
                            </span>
                            <span className="text-sm text-gray-500">
                              <strong>Status:</strong> {idea.status}
                            </span>
                            <span className="text-sm text-gray-500">
                              <strong>Email:</strong> {idea.email}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(idea.created_at).toLocaleDateString()} • 
                            Updated: {new Date(idea.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        {/* Only show edit/delete buttons if user owns this idea */}
                        {idea.email === userEmail && (
                          <div className="flex gap-2 ml-4">
                            <Button variant="outline" size="icon" onClick={() => { 
                              setEditing(idea.id);
                              setEditForm({ title: idea.title, description: idea.description, category: idea.category });
                            }} disabled={loading}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleDeleteIdea(idea.id)} disabled={loading}>
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
    </div>
  );
}