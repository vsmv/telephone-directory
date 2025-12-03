"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { userService, type UserProfile } from '@/lib/database';
import { patentableIdeasService, type PatentableIdea, type PatentableIdeaInsert } from '@/lib/ideas-and-plans';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
// Remove the import of ideas-and-plans service since we'll use the database service directly

export default function SimplePatentableIdeas() {
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading } = useAuth();

  console.log('👤 SimplePatentableIdeas: Auth state:', { user, isAdmin, userEmail: user?.email, authLoading });
  const [ideas, setIdeas] = useState<PatentableIdea[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("__all__");
  const [loading, setLoading] = useState(true);
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState<PatentableIdeaInsert>({
    email: user?.email || '',
    title: '',
    description: '',
    category: ''
  });

  // Update email when user changes
  useEffect(() => {
    if (user?.email) {
      setNewIdea(prev => ({ ...prev, email: user.email }));
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

  // Load ideas from database - EXACT Contact Management pattern
  const loadIdeas = useCallback(async () => {
    console.log('🔄 SimplePatentableIdeas: Starting to load ideas...');
    
    if (!user?.email) {
      console.log('⚠️ SimplePatentableIdeas: No user email available');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      let data, error;
      
      if (isAdmin) {
        // Admin can see all ideas or filtered by selected user
        console.log('👑 SimplePatentableIdeas: Admin user, fetching ideas');
        const result = await patentableIdeasService.getIdeasByEmail(user.email);
        data = result.data;
        error = result.error;
        console.log('👑 Admin ideas result:', { data, error, count: data?.length });
        
        // Filter by selected user if one is chosen (and not "All Users")
        if (data && selectedUser && selectedUser !== "__all__") {
          data = data.filter((idea: PatentableIdea) => idea.email === selectedUser);
        }
      } else {
        // Regular user can only see their own ideas
        console.log('👤 SimplePatentableIdeas: Regular user, fetching ideas for:', user.email);
        // Use the service that fetches ideas for a specific email
        const result = await patentableIdeasService.getIdeasByEmail(user.email);
        data = result.data;
        error = result.error;
        console.log('👤 User ideas result:', { data, error, count: data?.length });
      }
      
      console.log('💡 SimplePatentableIdeas: Service result:', { data, error, count: data?.length });
      
      if (error) {
        console.error('❌ SimplePatentableIdeas: Error loading ideas:', error);
        toast({
          title: "Error Loading Ideas",
          description: "Failed to load ideas from database",
          variant: "destructive"
        });
      } else if (data) {
        console.log('✅ SimplePatentableIdeas: Setting ideas:', data);
        console.log('✅ SimplePatentableIdeas: First idea:', data[0]);
        console.log('✅ SimplePatentableIdeas: Ideas array length:', data.length);
        setIdeas(data);
      } else {
        console.log('⚠️ SimplePatentableIdeas: No data returned');
        setIdeas([]);
      }
    } catch (err) {
      console.error('💥 SimplePatentableIdeas: Unexpected error:', err);
      toast({
        title: "Error Loading Ideas",
        description: "An unexpected error occurred while loading ideas",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  }, [user?.email, isAdmin, selectedUser, toast]);

  // Load users and ideas on component mount
  useEffect(() => {
    console.log('🔄 SimplePatentableIdeas: useEffect triggered', { authLoading, userEmail: user?.email });
    if (!authLoading && user?.email) {
      console.log('🔄 SimplePatentableIdeas: Calling loadIdeas');
      if (isAdmin) {
        loadUsers();
      }
      loadIdeas();
    } else {
      console.log('🔄 SimplePatentableIdeas: Skipping loadIdeas', { authLoading, userEmail: user?.email });
    }
  }, [loadIdeas, loadUsers, authLoading, user?.email, isAdmin]);

  // Reload ideas when selected user changes
  useEffect(() => {
    if (isAdmin && user?.email) {
      loadIdeas();
    }
  }, [selectedUser, loadIdeas, isAdmin, user?.email]);

  // Add idea function - EXACT Contact Management pattern
  const addIdea = async () => {
    if (!newIdea.title || !newIdea.description || !newIdea.category) {
      toast({
        title: "Validation Error",
        description: "Title, description, and category are required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { data, error } = await patentableIdeasService.createIdea(newIdea);
    
    if (error) {
      toast({
        title: "Error Adding Idea",
        description: String(error) || "Failed to add idea",
        variant: "destructive"
      });
    } else if (data) {
      setIdeas([data, ...ideas]);
      setNewIdea({
        email: user?.email || '',
        title: '',
        description: '',
        category: ''
      });
      toast({
        title: "Idea Added",
        description: `${data.title} has been added successfully`
      });
    }
    
    setLoading(false);
  };

  // Update idea function
  const updateIdea = async (ideaId: string) => {
    const ideaToUpdate = ideas.find(i => i.id === ideaId);
    if (!ideaToUpdate) return;

    if (!ideaToUpdate.title || !ideaToUpdate.description || !ideaToUpdate.category) {
      toast({
        title: "Validation Error",
        description: "Title, description, and category are required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { data, error } = await patentableIdeasService.updateIdea(
      ideaId,
      ideaToUpdate
    );
    
    if (error) {
      toast({
        title: "Error Updating Idea",
        description: String(error) || "Failed to update idea",
        variant: "destructive"
      });
    } else if (data) {
      setIdeas(ideas.map(idea => 
        idea.id === ideaId ? data : idea
      ));
      setEditingIdeaId(null);
      toast({
        title: "Idea Updated",
        description: `${data.title} has been updated successfully`
      });
    }
    
    setLoading(false);
  };

  // Delete idea function
  const deleteIdea = async (id: string) => {
    setLoading(true);
    const { error } = await patentableIdeasService.deleteIdea(id);
    
    if (error) {
      toast({
        title: "Error Deleting Idea",
        description: String(error) || "Failed to delete idea",
        variant: "destructive"
      });
    } else {
      setIdeas(ideas.filter(idea => idea.id !== id));
      toast({
        title: "Idea Deleted",
        description: `Idea has been deleted successfully`
      });
    }
    
    setLoading(false);
  };

  // Reset filter
  const resetFilter = () => {
    setSelectedUser('__all__');
  };

  // Debug log for rendering
  console.log('🎨 SimplePatentableIdeas: Rendering with ideas:', ideas, 'length:', ideas.length, 'loading:', loading);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Add/Edit Idea Form - EXACT Contact Management pattern */}
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
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={newIdea.title}
                onChange={(e) => setNewIdea(prev => ({...prev, title: e.target.value}))}
                placeholder="Innovation Opportunity - AI in Healthcare"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={newIdea.description || ''}
                onChange={(e) => setNewIdea(prev => ({...prev, description: e.target.value}))}
                placeholder="Detailed description of the patentable idea"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={newIdea.category || ''}
                  onChange={(e) => setNewIdea(prev => ({...prev, category: e.target.value}))}
                  placeholder="Technology"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addIdea} disabled={loading} className="flex-1">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                Add Idea
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ideas List - EXACT Contact Management pattern */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Patentable Ideas ({ideas.length})</CardTitle>
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
              <span className="ml-2">Loading ideas...</span>
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No patentable ideas found. Add your first idea to get started.
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ideas.map((idea) => (
                <div key={idea.id} className="border rounded-lg p-4">
                  {editingIdeaId === idea.id ? (
                    // Edit mode - inline editing
                    <div className="space-y-3">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={idea.title}
                          onChange={(e) => setIdeas(ideas.map(i => 
                            i.id === idea.id ? {...i, title: e.target.value} : i
                          ))}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={idea.description}
                          onChange={(e) => setIdeas(ideas.map(i => 
                            i.id === idea.id ? {...i, description: e.target.value} : i
                          ))}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={idea.category}
                          onChange={(e) => setIdeas(ideas.map(i => 
                            i.id === idea.id ? {...i, category: e.target.value} : i
                          ))}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateIdea(idea.id)}
                          disabled={loading}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingIdeaId(null)}
                          disabled={loading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View mode
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{idea.title}</h3>
                          {isAdmin && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {idea.email}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>Category: {idea.category}</span>
                          <span>Created: {new Date(idea.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingIdeaId(idea.id)}
                          disabled={loading}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteIdea(idea.id)}
                          disabled={loading}
                        >
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