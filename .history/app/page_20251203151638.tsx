import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Settings, Phone, Mail, MapPin, Building, Users, FileText, Lock, Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Hero Section */}
      <div className="flex items-center justify-center p-4 pt-16 pb-20">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-lg">ACTREC Directory System</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Telephone Directory
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Advanced Centre for Treatment, Research, and Education in Cancer
              <br />
              <span className="text-lg opacity-80">Comprehensive contact management and organizational tools</span>
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid gap-8 md:grid-cols-2 mb-16 max-w-3xl mx-auto">
            <Link href="/auth/login" className="group">
              <Card className="h-full bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Shield className="w-10 h-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">User Login</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Single sign-in for all users
                    <br />
                    <span className="text-sm text-gray-500">Admin & Regular Users</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl py-6 text-lg">
                    Sign In
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/search" className="group">
              <Card className="h-full bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <Search className="w-10 h-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">Search Directory</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Public directory search
                    <br />
                    <span className="text-sm text-gray-500">No login required</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl py-6 text-lg">
                    Search Now
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About the Application</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive contact management system designed specifically for ACTREC to streamline communication and enhance organizational efficiency.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Advanced Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Search across all fields including name, department, designation, phone, email, location, and institution with real-time filtering.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Administrators can manage user roles, reset passwords, and control access with comprehensive security features.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Contact Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Create, update, and delete contacts with bulk operations and CSV import/export capabilities.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-rose-600" />
                </div>
                <CardTitle className="text-xl">Secure Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Row-level security policies ensure data protection with role-based access control for sensitive information.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl">Fast Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Optimized queries, debounced search, and efficient caching for instant results even with large datasets.</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-xl">Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Intuitive interface with responsive design that works seamlessly on desktop, tablet, and mobile devices.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

        {/* Sample Contact */}
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Sample Contact Data
            </CardTitle>
            <CardDescription>
              Example of contact information stored in the directory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-lg">PB</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">DR. PRASHANT BHAT</h4>
                    <Badge variant="secondary" className="mt-1">Medical Administration</Badge>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>-7671 (Ext: 5042)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>prashant.bhat@actrec.gov.in</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Second Floor</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building className="w-4 h-4" />
                      <span>ACTREC</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-100">
          <p className="text-sm">
            © 2025 ACTREC Telephone Directory • Built with Next.js & Supabase
          </p>
        </div>
      </div>
    </div>