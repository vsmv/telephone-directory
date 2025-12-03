"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Lightbulb, BookOpen, Users, Building2, MapPin, Loader2, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth';

interface Idea {
  id: string;
  email: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

interface Plan {
  id: string;
  email: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  department: string;
  designation: string;
  phone_number: string;
  extension: string;
  email: string;
  location: string;
  institution: string;
}

interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function ReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get report type and filter from URL params
  const reportType = searchParams.get('type'); // 'ideas', 'plans', 'contacts', 'users'
  const filterBy = searchParams.get('filterBy'); // 'department', 'location', etc.
  const filterValue = searchParams.get('filterValue'); // specific value to filter
  
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  useEffect(() => {
    console.log('Reports page - useEffect triggered', { authLoading, user: !!user, isAdmin, reportType });
    
    // Wait for auth to load before checking
    if (authLoading) {
      console.log('Reports page - Waiting for auth to load...');
      return;
    }
    
    console.log('Reports page - Auth loaded, checking permissions', { hasUser: !!user, isAdmin });
    
    if (!user || !isAdmin) {
      console.log('Reports page - Auth check failed, redirecting to dashboard', { user: !!user, isAdmin });
      router.push('/dashboard');
      return;
    }
    
    console.log('Reports page - Auth OK, loading data for:', reportType);
    loadReportData();
  }, [reportType, filterBy, filterValue, user, isAdmin, authLoading, router]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      if (reportType === 'ideas') {
        const response = await fetch('/api/patentable-ideas');
        const result = await response.json();
        setIdeas(result.data || []);
        setFilteredData(result.data || []);
      } else if (reportType === 'plans') {
        const response = await fetch('/api/learning-plans');
        const result = await response.json();
        setPlans(result.data || []);
        setFilteredData(result.data || []);
      } else if (reportType === 'users') {
        const response = await fetch('/api/users');
        const result = await response.json();
        const allUsers = result.data || [];
        
        // Apply role filter if provided
        if (filterBy === 'role' && filterValue) {
          const filtered = allUsers.filter((user: UserProfile) => user.role === filterValue);
          setUsers(filtered);
          setFilteredData(filtered);
        } else {
          setUsers(allUsers);
          setFilteredData(allUsers);
        }
      } else if (reportType === 'contacts') {
        const response = await fetch('/api/contacts');
        const result = await response.json();
        const allContacts = result.data || [];
        
        // Apply filter if provided
        if (filterBy && filterValue) {
          const filtered = allContacts.filter((contact: Contact) => {
            if (filterBy === 'department') return contact.department === filterValue;
            if (filterBy === 'location') return contact.location === filterValue;
            return true;
          });
          setContacts(filtered);
          setFilteredData(filtered);
        } else {
          setContacts(allContacts);
          setFilteredData(allContacts);
        }
      }
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  useEffect(() => {
    if (!searchTerm) {
      if (reportType === 'ideas') setFilteredData(ideas);
      else if (reportType === 'plans') setFilteredData(plans);
      else if (reportType === 'contacts') setFilteredData(contacts);
      else if (reportType === 'users') setFilteredData(users);
      return;
    }

    const search = searchTerm.toLowerCase();
    if (reportType === 'ideas') {
      setFilteredData(ideas.filter(idea => 
        idea.title.toLowerCase().includes(search) ||
        idea.description.toLowerCase().includes(search) ||
        idea.email.toLowerCase().includes(search) ||
        idea.category.toLowerCase().includes(search)
      ));
    } else if (reportType === 'plans') {
      setFilteredData(plans.filter(plan => 
        plan.title.toLowerCase().includes(search) ||
        plan.description.toLowerCase().includes(search) ||
        plan.email.toLowerCase().includes(search) ||
        plan.category.toLowerCase().includes(search)
      ));
    } else if (reportType === 'users') {
      setFilteredData(users.filter(user => 
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
      ));
    } else if (reportType === 'contacts') {
      setFilteredData(contacts.filter(contact => 
        contact.name.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.department.toLowerCase().includes(search) ||
        contact.location.toLowerCase().includes(search)
      ));
    }
  }, [searchTerm, ideas, plans, contacts, users, reportType]);

  const getReportTitle = () => {
    if (reportType === 'ideas') return 'Patentable Ideas Report';
    if (reportType === 'plans') return 'Learning Plans Report';
    if (reportType === 'users' && filterValue === 'admin') return 'Admin Users';
    if (reportType === 'users' && filterValue === 'regular') return 'Regular Users';
    if (reportType === 'users') return 'All Users';
    if (reportType === 'contacts' && filterBy === 'department') 
      return `Contacts in ${filterValue}`;
    if (reportType === 'contacts' && filterBy === 'location') 
      return `Contacts at ${filterValue}`;
    return 'Report';
  };

  const getReportIcon = () => {
    if (reportType === 'ideas') return <Lightbulb className="w-6 h-6" />;
    if (reportType === 'plans') return <BookOpen className="w-6 h-6" />;
    if (reportType === 'users') return <Users className="w-6 h-6" />;
    if (filterBy === 'department') return <Building2 className="w-6 h-6" />;
    if (filterBy === 'location') return <MapPin className="w-6 h-6" />;
    return <Users className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard?tab=settings')}
              className="bg-white/90 hover:bg-white border-white/50 shadow-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
            <div className="flex items-center gap-3">
              {getReportIcon()}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {getReportTitle()}
              </h1>
            </div>
          </div>
          <Badge variant="outline" className="bg-white/90 px-4 py-2">
            {filteredData.length} Records
          </Badge>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Display */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {reportType === 'ideas' && (
              <div className="grid gap-4">
                {filteredData.map((idea: Idea) => (
                  <Card key={idea.id} className="border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{idea.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            By: {idea.email} • {new Date(idea.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                          {idea.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">{idea.description}</p>
                      <Badge variant="outline">{idea.category}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {reportType === 'plans' && (
              <div className="grid gap-4">
                {filteredData.map((plan: Plan) => (
                  <Card key={plan.id} className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{plan.title}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            By: {plan.email} • {new Date(plan.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
                          {plan.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-3">{plan.description}</p>
                      <Badge variant="outline">{plan.category}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {reportType === 'contacts' && (
              <div className="grid gap-4">
                {filteredData.map((contact: Contact) => (
                  <Card key={contact.id} className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{contact.name}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">{contact.designation}</p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-300 mb-1">
                            {contact.department}
                          </Badge>
                          <Badge variant="outline" className="block">
                            {contact.location}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Phone:</span> {contact.phone_number}
                        </div>
                        <div>
                          <span className="font-medium">Extension:</span> {contact.extension}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {contact.email}
                        </div>
                        <div>
                          <span className="font-medium">Institution:</span> {contact.institution}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {reportType === 'users' && (
              <div className="grid gap-4">
                {filteredData.map((user: UserProfile) => (
                  <Card key={user.id} className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{user.email}</CardTitle>
                          <p className="text-sm text-gray-500 mt-1">User ID: {user.id.substring(0, 8)}...</p>
                        </div>
                        <Badge className={user.role === 'admin' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-orange-100 text-orange-800 border-orange-300'}>
                          {user.role === 'admin' ? 'Admin' : 'Regular User'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredData.length === 0 && (
              <Card className="shadow-lg">
                <CardContent className="py-20 text-center text-gray-500">
                  <p className="text-lg">No records found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
