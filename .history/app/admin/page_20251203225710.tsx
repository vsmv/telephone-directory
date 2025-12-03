"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AdminPanel from '@/components/admin-panel';
import { UserManagement } from '@/components/user-management';
import BulkOperations from '@/components/bulk-operations';
import { SimpleLearningPlans } from '@/components/simple-learning-plans';
import { SimplePatentableIdeas } from '@/components/simple-patentable-ideas';
import SearchInterface from '@/components/search-interface';
import AdminSettings from '@/components/admin-settings';
import { useAuth } from "@/lib/auth";
import {
  Building2, User, Loader2,
  BookOpen, Lightbulb, Search, Settings, Users, Upload, Contact
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchContacts, setSearchContacts] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search functionality
  useEffect(() => {
    const searchContactsData = async () => {
      if (!searchQuery.trim()) {
        setSearchContacts([]);
        return;
      }
      
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/contacts?search=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          setSearchContacts(data.data || []);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearchLoading(false);
      }
    };
    
    const debounce = setTimeout(searchContactsData, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Redirect to regular dashboard if not admin
  useEffect(() => {
    if (!authLoading && user && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access denied - administrator privileges required</p>
          <Button onClick={() => router.push('/auth/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">ACTREC Admin Portal</h1>
                  <p className="text-gray-600">
                    Welcome back, {user.email}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard?userView=true')}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                User View
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  // Simple logout - just redirect to login
                  router.push('/auth/login');
                }}
                className="flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Admin Dashboard Tabs */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <Tabs defaultValue="contacts" className="w-full">
              <TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-gray-100 rounded-lg">
                <TabsTrigger
                  value="contacts"
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Contact className="w-4 h-4" />
                  <span className="hidden sm:inline">Contact Management</span>
                  <span className="sm:hidden">Contacts</span>
                </TabsTrigger>
                <TabsTrigger
                  value="bulk"
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Bulk Operations</span>
                  <span className="sm:hidden">Bulk</span>
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">User Management</span>
                  <span className="sm:hidden">Users</span>
                </TabsTrigger>
                <TabsTrigger
                  value="search"
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                  <span className="sm:hidden">Search</span>
                </TabsTrigger>
                <TabsTrigger
                  value="learning"
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Learning Plans</span>
                  <span className="sm:hidden">Learning</span>
                </TabsTrigger>
                <TabsTrigger
                  value="patents"
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span className="hidden sm:inline">Patentable Ideas</span>
                  <span className="sm:hidden">Ideas</span>
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                  <span className="sm:hidden">Settings</span>
                </TabsTrigger>
              </TabsList>

              {/* Contact Management Tab */}
              <TabsContent value="contacts">
                <AdminPanel />
              </TabsContent>

              {/* Bulk Operations Tab */}
              <TabsContent value="bulk">
                <BulkOperations />
              </TabsContent>

              {/* User Management Tab */}
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>

              {/* Search Tab */}
              <TabsContent value="search">
                <SearchInterface 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  contacts={searchContacts}
                  loading={searchLoading}
                />
              </TabsContent>

              {/* Learning Plans Tab */}
              <TabsContent value="learning">
                <SimpleLearningPlans userEmail={user.email} userRole="admin" />
              </TabsContent>

              {/* Patentable Ideas Tab */}
              <TabsContent value="patents">
                <SimplePatentableIdeas userEmail={user.email} userRole="admin" />
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <div className="p-6">
                  <AdminSettings />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}