"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { Lock, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user, error } = await login(email, password);
      
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
        
        // Redirect to home page after login
        router.push("/home");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-400 via-blue-500 to-cyan-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white rounded-t-lg pb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold text-white drop-shadow-lg">User Login</CardTitle>
            <CardDescription className="text-base text-white/90 mt-3">
              Single sign-in for all users • Admin & Regular Users
              <br />
              <span className="text-sm text-white/80">Access the ACTREC Telephone Directory</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-blue-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 pr-11 h-12 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-blue-500 hover:text-blue-700 focus:outline-none transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-blue-100">
              <div className="text-center text-sm text-gray-700">
                <p className="font-semibold mb-3 text-base text-gray-800">Demo Credentials:</p>
                <div className="space-y-2">
                  <div className="bg-white rounded-md p-2 border border-blue-200">
                    <p><span className="font-semibold text-blue-700">Admin:</span> <span className="text-gray-600">admin@actrec.gov.in</span> / <span className="font-mono text-gray-800">admin123</span></p>
                  </div>
                  <div className="bg-white rounded-md p-2 border border-purple-200">
                    <p><span className="font-semibold text-purple-700">Regular User:</span> <span className="text-gray-600">user@actrec.gov.in</span> / <span className="font-mono text-gray-800">user123</span></p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}