import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Search, Settings, Phone, Mail, MapPin, Building, Users, FileText, Lock, Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
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
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Advanced Centre for Treatment, Research, and Education in Cancer
            <br />
            <span className="text-lg opacity-90">Comprehensive contact management and organizational tools</span>
          </p>
        </div>

        {/* Main Content - Single Unified Login */}
        <div className="grid gap-8 md:grid-cols-2 mb-12 max-w-3xl mx-auto">
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
  );
}