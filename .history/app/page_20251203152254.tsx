import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Settings, Phone, Mail, MapPin, Building, Users, FileText, Lock, Zap, CheckCircle2, ArrowRight, Lightbulb, GraduationCap, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      {/* ... existing hero section code ... */}
      
      {/* About Section */}
      <div className="bg-white py-20">
        {/* ... existing about section code ... */}
      </div>

      {/* How to Use Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Use</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Follow these simple steps to get started with the ACTREC Telephone Directory
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* For Regular Users */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Users className="w-6 h-6 text-blue-600" />
                  For Regular Users
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Search Directory</h4>
                      <p className="text-gray-600 text-sm">Click "Search Directory" to browse contacts without logging in</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Use Advanced Filters</h4>
                      <p className="text-gray-600 text-sm">Filter by department, designation, location, or institution</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600 font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">View Contact Details</h4>
                      <p className="text-gray-600 text-sm">Get phone, email, extension, and location information</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* For Administrators */}
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  For Administrators
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-600 font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Login with Credentials</h4>
                      <p className="text-gray-600 text-sm">Use your email and password to access admin features</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-600 font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Manage Contacts</h4>
                      <p className="text-gray-600 text-sm">Create, update, or delete contacts. Import/export via CSV</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 text-purple-600 font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Manage Users</h4>
                      <p className="text-gray-600 text-sm">Control user roles, reset passwords, and manage permissions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Benefits</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how the ACTREC Telephone Directory improves communication and efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap className="w-6 h-6" />, title: "Instant Access", desc: "Find contact information in seconds with real-time search" },
              { icon: <Lock className="w-6 h-6" />, title: "Secure & Private", desc: "Row-level security ensures data protection and privacy" },
              { icon: <Users className="w-6 h-6" />, title: "Centralized Data", desc: "Single source of truth for all organizational contacts" },
              { icon: <FileText className="w-6 h-6" />, title: "Easy Bulk Operations", desc: "Import, export, and manage multiple contacts at once" },
              { icon: <CheckCircle2 className="w-6 h-6" />, title: "Always Updated", desc: "Real-time synchronization keeps information current" },
              { icon: <ArrowRight className="w-6 h-6" />, title: "User-Friendly", desc: "Intuitive design requires minimal training" }
            ].map((benefit, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sample Contact */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-2xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Phone className="w-6 h-6" />
                Sample Contact Entry
              </CardTitle>
              <CardDescription className="text-base">
                Example of detailed contact information stored in the directory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">PB</span>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-bold text-xl text-gray-900">DR. PRASHANT BHAT</h4>
                      <Badge variant="secondary" className="mt-1">Medical Administration</Badge>
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">-7671 (Ext: 5042)</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-sm">prashant.bhat@actrec.gov.in</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Second Floor</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
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

      {/* Footer */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white text-sm">
            © 2025 ACTREC Telephone Directory • Built with Next.js & Supabase
          </p>
        </div>
      </div>
    </div>
  );
}