import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search, Building } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Building className="w-12 h-12 text-white" />
          </div>
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-8 py-3 mb-8 shadow-xl">
            <Shield className="w-6 h-6 text-white" />
            <span className="text-white font-bold text-xl">ACTREC Directory System</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-2xl">
            Telephone Directory
          </h1>
          <p className="text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-lg mb-4">
            Advanced Centre for Treatment, Research, and Education in Cancer
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Comprehensive contact management, learning plans, and innovation tracking
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Login Card */}
          <Link href="/auth/login" className="group">
            <Card className="h-full bg-white/98 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-900 mb-3">User Login</CardTitle>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Access your dashboard to manage contacts, learning plans, and patent ideas
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl py-7 text-xl">
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Search Card */}
          <Link href="/search" className="group">
            <Card className="h-full bg-white/98 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-900 mb-3">Search Directory</CardTitle>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Browse and search contact information across all ACTREC departments
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <Button className="w-full bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl py-7 text-xl">
                  Search Now
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-white/90 font-medium text-lg mb-2">
            © 2025 ACTREC Telephone Directory System
          </p>
          <p className="text-white/70 text-sm">
            Built with Next.js, TypeScript & Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* Hero Section */}
      <div className="flex items-center justify-center p-4 pt-16 pb-20">
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Building className="w-10 h-10 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6 shadow-lg">
              <Shield className="w-5 h-5 text-white" />
              <span className="text-white font-semibold text-lg">ACTREC Directory System</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Telephone Directory
            </h1>
            <p className="text-xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Advanced Centre for Treatment, Research, and Education in Cancer
              <br />
              <span className="text-lg text-white/85">Comprehensive contact management and organizational tools</span>
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid gap-8 md:grid-cols-2 mb-16 max-w-3xl mx-auto">
            <Link href="/auth/login" className="group">
              <Card className="h-full bg-white/98 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">Admin / User Login</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Access dashboard features
                    <br />
                    <span className="text-sm text-indigo-600 font-medium">Contacts • Learning Plans • Patent Ideas</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl py-6 text-lg">
                    Sign In to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            <Link href="/search" className="group">
              <Card className="h-full bg-white/98 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                    <Search className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">Search Directory</CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Public directory search
                    <br />
                    <span className="text-sm text-green-600 font-medium">No login required • Instant access</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button className="w-full bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl py-6 text-lg">
                    Search Contacts Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* About Section with gradient background */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              About the Application
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              A comprehensive management system designed for ACTREC to streamline communication, learning, and innovation
            </p>
          </div>

          {/* Main Features Grid - Enhanced with color gradients */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
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

          {/* Secondary Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">User Management</h3>
                <p className="text-sm text-gray-600">Role-based access control and permissions</p>
              </CardContent>
            </Card>

            <Card className="border border-rose-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-red-100 rounded-lg flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure Access</h3>
                <p className="text-sm text-gray-600">Row-level security and encrypted data</p>
              </CardContent>
            </Card>

            <Card className="border border-cyan-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Fast Performance</h3>
                <p className="text-sm text-gray-600">Optimized queries and real-time updates</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How to Use Section - Enhanced with colored backgrounds */}
      <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              How to Use
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Follow these simple steps to get started with the ACTREC System
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* For Regular Users */}
            <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  For Regular Users
                </CardTitle>
                <p className="text-blue-100 text-sm mt-2">Browse contacts and access public information</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold shadow-md">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Search Directory</h4>
                      <p className="text-gray-600 text-sm">Click "Search Directory" button above to browse contacts without logging in</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold shadow-md">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Use Advanced Filters</h4>
                      <p className="text-gray-600 text-sm">Filter by department, designation, location, or institution for precise results</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold shadow-md">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">View Contact Details</h4>
                      <p className="text-gray-600 text-sm">Access phone numbers, emails, extensions, and location information</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Administrators */}
            <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 via-white to-pink-50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="w-6 h-6" />
                  For Administrators
                </CardTitle>
                <p className="text-purple-100 text-sm mt-2">Manage all system features and data</p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold shadow-md">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Login to Dashboard</h4>
                      <p className="text-gray-600 text-sm">Click "Admin / User Login" button above and enter your credentials</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold shadow-md">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Manage Data</h4>
                      <p className="text-gray-600 text-sm">Access Contacts, Learning Plans, and Patent Ideas from dashboard menu</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold shadow-md">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Manage Users & Settings</h4>
                      <p className="text-gray-600 text-sm">Control user roles, reset passwords, import/export data, and configure system</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Key Benefits with colored icons */}
      <div className="bg-gradient-to-br from-white via-purple-50 to-pink-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Key Benefits
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Discover how ACTREC Directory System improves efficiency and innovation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap />, title: "Instant Access", desc: "Find information in seconds with real-time search", color: "from-yellow-400 to-orange-500" },
              { icon: <Lock />, title: "Secure & Private", desc: "Enterprise-grade security with role-based access", color: "from-red-400 to-rose-500" },
              { icon: <Users />, title: "Centralized Hub", desc: "Single platform for contacts, learning, and innovation", color: "from-blue-400 to-indigo-500" },
              { icon: <GraduationCap />, title: "Learning & Development", desc: "Track professional growth and skill enhancement", color: "from-amber-400 to-yellow-500" },
              { icon: <Lightbulb />, title: "Innovation Management", desc: "Capture and develop patent-worthy ideas", color: "from-emerald-400 to-teal-500" },
              { icon: <Target />, title: "Goal Tracking", desc: "Monitor progress and achieve organizational objectives", color: "from-purple-400 to-pink-500" }
            ].map((benefit, index) => (
              <div key={index} className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center mb-4 text-white shadow-lg`}>
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Contact with enhanced styling */}
      <div className="bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-2xl border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Phone className="w-6 h-6" />
                Sample Contact Entry
              </CardTitle>
              <CardDescription className="text-white/90 text-base">
                Example of detailed contact information in the directory
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-100">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-xl">
                    <span className="text-white font-bold text-2xl">PB</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h4 className="font-bold text-2xl text-gray-900">DR. PRASHANT BHAT</h4>
                      <Badge className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0">Medical Administration</Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center gap-3 text-gray-700 bg-white/60 p-3 rounded-lg">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">-7671 (Ext: 5042)</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 bg-white/60 p-3 rounded-lg">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-sm">prashant.bhat@actrec.gov.in</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 bg-white/60 p-3 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Second Floor</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-700 bg-white/60 p-3 rounded-lg">
                        <Building className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">ACTREC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-10">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white font-medium mb-2">
            © 2025 ACTREC Telephone Directory System
          </p>
          <p className="text-white/80 text-sm">
            Built with Next.js, TypeScript & Supabase • Secured with Row-Level Security
          </p>
        </div>
      </div>
    </div>
  );
}
