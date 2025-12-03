import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Search, Building } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-lavender-200 to-violet-200 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Building className="w-12 h-12 text-purple-700" />
          </div>
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-8 py-3 mb-8 shadow-xl">
            <Shield className="w-6 h-6 text-purple-700" />
            <span className="text-purple-900 font-bold text-xl">ACTREC Directory System</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-purple-900 mb-8 leading-tight drop-shadow-lg">
            Telephone Directory
          </h1>
          <p className="text-2xl text-purple-800 max-w-3xl mx-auto leading-relaxed drop-shadow-md mb-4">
            Advanced Centre for Treatment, Research, and Education in Cancer
          </p>
          <p className="text-lg text-purple-700 max-w-2xl mx-auto">
            Comprehensive contact management, learning plans, and innovation tracking
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Login Card */}
          <Link href="/auth/login" className="group">
            <Card className="h-full bg-white/98 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                  <Shield className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-900 mb-3">User Login</CardTitle>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Access your dashboard to manage contacts, learning plans, and patent ideas
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl py-7 text-xl">
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Search Card */}
          <Link href="/search" className="group">
            <Card className="h-full bg-white/98 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
              <CardHeader className="text-center pb-6 pt-8">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-violet-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-xl">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-3xl text-gray-900 mb-3">Search Directory</CardTitle>
                <CardDescription className="text-gray-600 text-lg leading-relaxed">
                  Browse and search contact information across all ACTREC departments
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl py-7 text-xl">
                  Search Now
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-purple-800 font-medium text-lg mb-2">
            © 2025 ACTREC Telephone Directory System
          </p>
          <p className="text-purple-700 text-sm">
            Built with Next.js, TypeScript & Supabase
          </p>
        </div>
      </div>
    </div>
  );
}
