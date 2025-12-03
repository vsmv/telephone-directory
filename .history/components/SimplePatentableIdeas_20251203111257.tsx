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
import { patentableIdeasService, type PatentableIdea } from '@/lib/ideas-and-plans';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { Plus, Edit, Trash2, Loader2, Save, X } from 'lucide-react';

interface EditFormState {
  title: string;
  description: string;
  category: string;
}

export default function SimplePatentableIdeas() {
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();
  
  const [ideas, setIdeas] = useState<PatentableIdea[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("__all__");
  const [loading, setLoading] = useState(false);
  const [editingIdea, setEditingIdea] = useState<PatentableIdea | null>(null);
  const [newIdea, setNewIdea] = useState({ title: '', description: '', category: '' });

  const loadIdeas = useCallback(async () => {
    if (!user?.email) return;
    setLoading(true);
    const { data } = await patentableIdeasService.getIdeasByEmail(user.email);
    if (data) {
      const filtered = selectedUser === "__all__" 
        ? data 
        : data.filter((idea: PatentableIdea) => idea.email === selectedUser);
      setIdeas(filtered);
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
      loadIdeas();
      if (isAdmin) loadUsers();
    }
  }, [user?.email, isAdmin, loadIdeas, loadUsers]);

  const handleAdd = async () => {
    if (!newIdea.title || !newIdea.description || !newIdea.category) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await patentableIdeasService.createIdea({
      ...newIdea,
      email: user?.email || ''
    });
    if (data) {
      setIdeas([data, ...ideas]);
      setNewIdea({ title: '', description: '', category: '' });
      toast({ title: "Success", description: "Idea added successfully" });
    } else {
      toast({ title: "Error", description: error || "Failed to add idea", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!editingIdea) return;
    if (!editingIdea.title || !editingIdea.description || !editingIdea.category) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { data, error } = await patentableIdeasService.updateIdea(editingIdea.id, {
      title: editingIdea.title,
      description: editingIdea.description,
      category: editingIdea.category
    });
    if (data) {
      setIdeas(ideas.map((i: PatentableIdea) => i.id === editingIdea.id ? data : i));
      setEditingIdea(null);
      toast({ title: "Success", description: "Idea updated successfully" });
    } else {
      toast({ title: "Error", description: error || "Failed to update", variant: "destructive" });
    }
    setLoading(false);
  };

  const handleEditIdea = (idea: PatentableIdea) => {
    setEditingIdea(idea);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    const { error } = await patentableIdeasService.deleteIdea(id);
    if (!error) {
      setIdeas(ideas.filter((i: PatentableIdea) => i.id !== id));
      toast({ title: "Success", description: "Idea deleted successfully" });
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
            Add New Patentable Idea
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input
              value={newIdea.title}
              onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
              placeholder="Enter idea title"
            />
          </div>
          <div>
            <Label>Description *</Label>
            <Textarea
              value={newIdea.description}
              onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
              placeholder="Enter description"
              rows={4}
            />
          </div>
          <div>
            <Label>Category *</Label>
            <Input
              value={newIdea.category}
              onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
              placeholder="Enter category"
            />
          </div>
          <Button onClick={handleAdd} disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Idea
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Patentable Ideas ({ideas.length})</CardTitle>
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
          ) : ideas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No patentable ideas found</div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {ideas.map((idea: PatentableIdea) => (
                <div key={idea.id} className="border rounded-lg p-4">
                  {editingIdea?.id === idea.id ? (
                    // EDIT MODE - Inline
                    <div className="space-y-3">
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={editingIdea.title}
                          onChange={(e) => setEditingIdea({...editingIdea, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={editingIdea.description}
                          onChange={(e) => setEditingIdea({...editingIdea, description: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label>Category</Label>
                        <Input
                          value={editingIdea.category}
                          onChange={(e) => setEditingIdea({...editingIdea, category: e.target.value})}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdate} disabled={loading}>
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingIdea(null)}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // VIEW MODE
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold">{idea.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{idea.description}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>Category: {idea.category}</span>
                          <span>Created: {new Date(idea.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button variant="ghost" size="sm" onClick={() => setEditingIdea(idea)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(idea.id)}>
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

      {/* Edit Idea Dialog */}
      <Dialog open={!!editingIdea} onOpenChange={() => setEditingIdea(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Patentable Idea</DialogTitle>
            <DialogDescription>
              Make changes to the idea information below.
            </DialogDescription>
          </DialogHeader>
          {editingIdea && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editingIdea.title}
                  onChange={(e) => setEditingIdea({...editingIdea, title: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editingIdea.description}
                  onChange={(e) => setEditingIdea({...editingIdea, description: e.target.value})}
                  className="col-span-3"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Input
                  id="category"
                  value={editingIdea.category}
                  onChange={(e) => setEditingIdea({...editingIdea, category: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingIdea(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
