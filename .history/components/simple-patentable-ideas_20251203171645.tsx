"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Lightbulb, Loader2, Edit, Trash2, Save, X } from 'lucide-react';

// Patent Idea Categories
const PATENT_CATEGORIES = [
  'Medical Device',
  'Diagnostic Tool',
  'Treatment Method',
  'Research Method',
  'Software/Algorithm',
  'Process Improvement',
  'Lab Equipment',
  'Data Analysis',
  'Other'
];

// Patent Idea Status Options
const PATENT_STATUS = [
  { value: 'draft', label: 'Draft' },
  { value: 'under-review', label: 'Under Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'filed', label: 'Filed' },
  { value: 'granted', label: 'Granted' },
  { value: 'rejected', label: 'Rejected' }
];

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
    category: '',
    status: 'draft'
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
          category: '',
          status: 'draft'
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

  // Calculate status counts from filtered ideas
  const draftCount = filteredIdeas.filter(i => i.status === 'draft').length;
  const underReviewCount = filteredIdeas.filter(i => i.status === 'under-review').length;
  const approvedCount = filteredIdeas.filter(i => i.status === 'approved').length;
  const filedCount = filteredIdeas.filter(i => i.status === 'filed').length;
  const grantedCount = filteredIdeas.filter(i => i.status === 'granted').length;

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 border-amber-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-700 mb-1">{userRole === 'admin' ? 'Total Ideas' : 'My Ideas'}</p>
                <p className="text-3xl font-bold text-amber-900">{filteredIdeas.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-100 border-slate-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Draft</p>
                <p className="text-3xl font-bold text-slate-900">{draftCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 border-blue-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Under Review</p>
                <p className="text-3xl font-bold text-blue-900">{underReviewCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 border-green-200 hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Granted</p>
                <p className="text-3xl font-bold text-green-900">{grantedCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Idea Form */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white">
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
              <Select
                value={newIdea.category}
                onValueChange={(value) => setNewIdea({ ...newIdea, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {PATENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddIdea} disabled={loading} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Add Idea
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ideas List */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 text-white">
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
                <Card key={idea.id} className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
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
                          <Select
                            value={editForm.category || ''}
                            onValueChange={(value) => setEditForm({...editForm, category: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {PATENT_CATEGORIES.map((cat) => (
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
                              {PATENT_STATUS.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleUpdateIdea(idea.id)} disabled={loading} className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white">
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
                              setEditForm({ title: idea.title, description: idea.description, category: idea.category, status: idea.status });
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