"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { contactService, userService, type Contact, type UserProfile } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { Users, User, Building2, BookOpen, Lightbulb, Loader2 } from "lucide-react";

export default function AdminSettings() {
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

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch all required data in parallel
      const [
        contactsResult,
        usersResult,
      ] = await Promise.all([
        contactService.getContacts(),
        userService.getUsers(),
      ]);

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
  }, []);

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
                  <div key={department} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <span className="font-medium">{department}</span>
                    <Badge variant="outline">{count}</Badge>
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
                  <div key={location} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <span className="font-medium">{location}</span>
                    <Badge variant="outline">{count}</Badge>
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
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Overview of system configuration and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">System Status</h3>
              <p className="text-sm text-blue-700">
                All systems operational
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Database Connection</h3>
              <p className="text-sm text-green-700">
                Connected to staging database
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}