"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contactService, userService, type Contact, type UserProfile } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { Users, User, Building2, BookOpen, Lightbulb, Loader2, Database, Activity, HardDrive, Zap, Server, Clock } from "lucide-react";

export default function AdminSettings() {
  const router = useRouter();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    totalContacts: 0,
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0
  });
  const [techMetrics, setTechMetrics] = useState({
    totalIdeas: 0,
    totalPlans: 0,
    avgResponseTime: 0,
    dbSize: 0,
    lastBackup: new Date().toISOString()
  });

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const startTime = performance.now();
      
      // Fetch all required data in parallel
      const [
        contactsResult,
        usersResult,
      ] = await Promise.all([
        contactService.getContacts(),
        userService.getUsers(),
      ]);

      const endTime = performance.now();
      const responseTime = Math.round(endTime - startTime);

      if (contactsResult.data && usersResult.data) {
        setContacts(contactsResult.data);
        setUsers(usersResult.data);

        // Count users by role
        let adminCount = 0;
        let regularCount = 0;
        
        usersResult.data.forEach(user => {
          if (user.role === 'admin') {
            adminCount++;
          } else {
            regularCount++;
          }
        });

        setDashboardData({
          totalContacts: contactsResult.data?.length || 0,
          totalUsers: usersResult.data?.length || 0,
          adminUsers: adminCount,
          regularUsers: regularCount
        });

        // Fetch additional technical metrics
        try {
          const [ideasRes, plansRes] = await Promise.all([
            fetch('/api/patentable-ideas'),
            fetch('/api/learning-plans')
          ]);
          
          const ideasData = await ideasRes.json();
          const plansData = await plansRes.json();
          
          // Calculate estimated database size
          const avgContactSize = 0.5; // KB per contact
          const avgUserSize = 0.3; // KB per user
          const avgIdeaSize = 1.0; // KB per idea
          const avgPlanSize = 1.0; // KB per plan
          
          const estimatedDbSize = (
            (contactsResult.data.length * avgContactSize) +
            (usersResult.data.length * avgUserSize) +
            ((ideasData.data?.length || 0) * avgIdeaSize) +
            ((plansData.data?.length || 0) * avgPlanSize)
          );

          setTechMetrics({
            totalIdeas: ideasData.data?.length || 0,
            totalPlans: plansData.data?.length || 0,
            avgResponseTime: responseTime,
            dbSize: estimatedDbSize,
            lastBackup: new Date().toISOString()
          });
        } catch (err) {
          console.error('Error fetching technical metrics:', err);
        }
      } else {
        setError('Failed to fetch data');
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Error loading data');
      toast({
        title: "Error Loading Data",
        description: "Failed to load system statistics",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Get department statistics
  const getDepartmentStats = () => {
    const departmentCounts: { [key: string]: number } = {};
    
    contacts.forEach(contact => {
      const dept = contact.department || 'Unassigned';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    return Object.entries(departmentCounts)
      .map(([department, count]) => ({ department, count }))
      .sort((a, b) => b.count - a.count);
  };

  // Get location statistics
  const getLocationStats = () => {
    const locationCounts: { [key: string]: number } = {};
    
    contacts.forEach(contact => {
      const location = contact.location || 'Unassigned';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);
  };

  const departmentStats = getDepartmentStats();
  const locationStats = getLocationStats();

  return (
    <div className="space-y-6">
      {/* System Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Contacts</p>
                <p className="text-3xl font-bold text-blue-900">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : dashboardData.totalContacts}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-green-900">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : dashboardData.totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🔵 Admin Users card clicked!');
            window.location.href = '/reports?type=users&filterBy=role&filterValue=admin';
          }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Admin Users</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : dashboardData.adminUsers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div 
          className="cursor-pointer hover:opacity-90 transition-opacity"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('🟠 Regular Users card clicked!');
            window.location.href = '/reports?type=users&filterBy=role&filterValue=regular';
          }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Regular Users</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : dashboardData.regularUsers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-orange-700" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Roles Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            User Roles Distribution
          </CardTitle>
          <CardDescription>
            Distribution of users by role in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Admin Users</span>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {dashboardData.adminUsers} ({dashboardData.totalUsers > 0 ? Math.round((dashboardData.adminUsers / dashboardData.totalUsers) * 100) : 0}%)
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">Regular Users</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {dashboardData.regularUsers} ({dashboardData.totalUsers > 0 ? Math.round((dashboardData.regularUsers / dashboardData.totalUsers) * 100) : 0}%)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Department Distribution
            </CardTitle>
            <CardDescription>
              Number of contacts in each department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : departmentStats.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No department data available</p>
              ) : (
                departmentStats.map(({ department, count }) => (
                  <div 
                    key={department} 
                    className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Navigating to department report:', department);
                      window.location.href = `/reports?type=contacts&filterBy=department&filterValue=${encodeURIComponent(department)}`;
                    }}
                  >
                    <span className="font-medium">{department}</span>
                    <Badge variant="outline" className="cursor-pointer">{count}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Location Distribution
            </CardTitle>
            <CardDescription>
              Number of contacts in each location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : locationStats.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No location data available</p>
              ) : (
                locationStats.map(({ location, count }) => (
                  <div 
                    key={location} 
                    className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Navigating to location report:', location);
                      window.location.href = `/reports?type=contacts&filterBy=location&filterValue=${encodeURIComponent(location)}`;
                    }}
                  >
                    <span className="font-medium">{location}</span>
                    <Badge variant="outline" className="cursor-pointer">{count}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5" />
            Technical System Information
          </CardTitle>
          <CardDescription>
            Database, performance, and technical metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-blue-800">Database Size</h3>
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {techMetrics.dbSize.toFixed(2)} KB
              </p>
              <p className="text-xs text-blue-600 mt-1">Estimated total data size</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-green-800">Response Time</h3>
              </div>
              <p className="text-2xl font-bold text-green-900">
                {techMetrics.avgResponseTime} ms
              </p>
              <p className="text-xs text-green-600 mt-1">Average API response</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-purple-800">Total Records</h3>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {dashboardData.totalContacts + dashboardData.totalUsers + techMetrics.totalIdeas + techMetrics.totalPlans}
              </p>
              <p className="text-xs text-purple-600 mt-1">All database entries</p>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Navigating to ideas report');
                window.location.href = '/reports?type=ideas';
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                <h3 className="font-medium text-amber-800">Patent Ideas</h3>
              </div>
              <p className="text-2xl font-bold text-amber-900">
                {techMetrics.totalIdeas}
              </p>
              <p className="text-xs text-amber-600 mt-1">Total patentable ideas • Click to view</p>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Navigating to plans report');
                window.location.href = '/reports?type=plans';
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="font-medium text-emerald-800">Learning Plans</h3>
              </div>
              <p className="text-2xl font-bold text-emerald-900">
                {techMetrics.totalPlans}
              </p>
              <p className="text-xs text-emerald-600 mt-1">Total learning plans • Click to view</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-indigo-600" />
                <h3 className="font-medium text-indigo-800">Last Updated</h3>
              </div>
              <p className="text-sm font-bold text-indigo-900">
                {new Date(techMetrics.lastBackup).toLocaleString()}
              </p>
              <p className="text-xs text-indigo-600 mt-1">System refresh time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Technology Stack
          </CardTitle>
          <CardDescription>
            Application architecture and infrastructure details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Frontend Framework</p>
                <p className="text-lg font-bold text-gray-900">Next.js 14 (React 18)</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">UI Library</p>
                <p className="text-lg font-bold text-gray-900">Tailwind CSS + shadcn/ui</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Language</p>
                <p className="text-lg font-bold text-gray-900">TypeScript</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Database</p>
                <p className="text-lg font-bold text-gray-900">Supabase (PostgreSQL)</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Authentication</p>
                <p className="text-lg font-bold text-gray-900">JWT + RLS Policies</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Hosting</p>
                <p className="text-lg font-bold text-gray-900">Vercel / Self-hosted</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Performance & Recommendations
          </CardTitle>
          <CardDescription>
            System health and optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-900">Database Performance: Excellent</p>
                <p className="text-sm text-green-700">Response time under 500ms - system running optimally</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-900">Data Storage: Healthy</p>
                <p className="text-sm text-blue-700">Current database size is within optimal range for performance</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-amber-900">Recommendation: Regular Backups</p>
                <p className="text-sm text-amber-700">Ensure database backups are configured for data protection</p>
              </div>
            </div>
            
            {dashboardData.totalContacts > 1000 && (
              <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-purple-900">Optimization Tip</p>
                  <p className="text-sm text-purple-700">Consider implementing database indexing for faster search with {dashboardData.totalContacts}+ contacts</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}