"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Phone, Mail, MapPin, Building, Users, FileText, Lock, Zap, CheckCircle2, Lightbulb, GraduationCap, Target, LayoutDashboard, LogOut, Upload, Download, Key, Edit, Trash2, Database } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<'admin' | 'regular'>('regular');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user role from localStorage
    const userStr = localStorage.getItem('mockUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserRole(user.role || 'regular');
      } catch (error) {
        setUserRole('regular');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('mockUser');
    localStorage.removeItem('authToken');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Header Navigation */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="w-8 h-8 text-white" />
              <h2 className="text-2xl font-bold text-white">ACTREC Directory</h2>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
              <Button 
                onClick={handleLogout}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-6 py-2 mb-6">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-semibold">
              {userRole === 'admin' ? 'Administrator Dashboard' : 'Welcome to ACTREC Directory System'}
            </span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            {userRole === 'admin' ? 'Admin Management Center' : 'Comprehensive Management Platform'}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {userRole === 'admin' 
              ? 'Manage contacts, users, bulk operations, and system administration with full control'
              : 'Manage contacts, track learning plans, and document innovative ideas all in one unified system'
            }
          </p>
        </div>

        {/* Main Features */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Search className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Contact Directory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">Search and manage organizational contacts with advanced filtering capabilities.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Real-time search across all fields
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Department & location filters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    CSV import/export
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Learning Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">Track professional development and training initiatives for continuous growth.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    Create personalized learning paths
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    Track progress & milestones
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    Share knowledge resources
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">Patent Ideas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-3">Document and manage innovative ideas for potential patent applications.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Submit invention disclosures
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Track review status
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Collaborate with team
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* How to Use */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-12">
              How to Use the System
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-blue-300 bg-white shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                  <CardTitle className="text-2xl">Quick Start Guide</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Access Dashboard</h4>
                        <p className="text-sm text-gray-600">Click "Go to Dashboard" to access all features</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">2</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Navigate Features</h4>
                        <p className="text-sm text-gray-600">Use the tabs to switch between Contacts, Learning Plans, and Patent Ideas</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">3</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Manage Data</h4>
                        <p className="text-sm text-gray-600">Create, update, or delete records as needed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-300 bg-white shadow-xl">
                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  <CardTitle className="text-2xl">Key Benefits</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {[
                      "Centralized data management",
                      "Real-time updates and synchronization",
                      "Secure role-based access control",
                      "Easy bulk operations and CSV support",
                      "Professional growth tracking",
                      "Innovation management system"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sample Contact */}
          <Card className="shadow-2xl border-0 overflow-hidden mb-16">
            <CardHeader className="bg-gradient-to-r from-blue-500 via-cyan-600 to-teal-600 text-white">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Phone className="w-6 h-6" />
                Sample Contact Entry
              </CardTitle>
              <CardDescription className="text-white/90">
                Example of contact information in the directory
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-100">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-2xl">PB</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-bold text-2xl text-gray-900">DR. PRASHANT BHAT</h4>
                      <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white">Medical Administration</Badge>
                      <p className="text-gray-600 mt-2"><span className="font-semibold">Designation:</span> Doctor</p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Phone & Extension</p>
                          <span className="font-medium">-7671 (Ext: 5042)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <span className="font-medium text-sm">prashant.bhat@actrec.gov.in</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <span className="font-medium">Second Floor</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-white p-3 rounded-lg">
                        <Building className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-500">Institution</p>
                          <span className="font-medium">ACTREC</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-12 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-50 text-lg mb-8">
              Access your dashboard to begin managing your organization&apos;s data
            </p>
            <Button 
              onClick={() => router.push('/dashboard')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-12 py-6 rounded-xl shadow-xl"
            >
              <LayoutDashboard className="w-6 h-6 mr-3" />
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <p className="font-medium mb-2">© 2025 ACTREC Telephone Directory System</p>
          <p className="text-blue-100 text-sm">Built with Next.js, TypeScript & Supabase</p>
        </div>
      </div>
    </div>
  );
}
