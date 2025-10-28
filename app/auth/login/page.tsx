"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Lock, User, Search as SearchIcon, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    userId: "",
    password: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Convert user ID to email format for auth service
      const email = credentials.userId.includes('@') 
        ? credentials.userId 
        : `${credentials.userId}@actrec.gov.in`;
      
      const { user, error } = await login(email, credentials.password);
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error,
          variant: "destructive"
        });
      } else if (user) {
        toast({
          title: "Login Successful",
          description: `Welcome, ${user.role === 'admin' ? 'Administrator' : 'User'}!`
        });
        
        // Redirect based on role
        if (user.role === 'admin') {
          router.push("/dashboard");
        } else {
          router.push("/search");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl">User Login</CardTitle>
            <CardDescription>
              Access the ACTREC Telephone Directory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="userId"
                    type="text"
                    placeholder="Enter your user ID or email"
                    value={credentials.userId}
                    onChange={(e) => setCredentials(prev => ({ ...prev, userId: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center text-sm text-gray-600">
                <p className="font-medium mb-2">Demo Credentials:</p>
                <div className="space-y-1">
                  <p><strong>Admin:</strong> admin / admin123</p>
                  <p><strong>Regular User:</strong> user / user123</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Section */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <SearchIcon className="w-5 h-5" />
              Public Search
            </CardTitle>
            <CardDescription>
              Search the directory without logging in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search Contacts</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search by name, department, email, etc."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" variant="secondary">
                Search Directory
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}