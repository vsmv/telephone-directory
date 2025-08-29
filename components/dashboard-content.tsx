"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, LogOut, Users, Plus, Upload, Download, Settings } from "lucide-react";
import SearchInterface from "@/components/search-interface";
import AdminPanel from "@/components/admin-panel";
import { Contact } from "@/lib/types";

interface DashboardContentProps {
  userRole: string;
}

export default function DashboardContent({ userRole }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const searchContacts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setContacts([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .or(`name.ilike.%${query}%,department.ilike.%${query}%,designation.ilike.%${query}%,phone_number.ilike.%${query}%,extension.ilike.%${query}%,email.ilike.%${query}%,location.ilike.%${query}%,institution.ilike.%${query}%`)
        .order("name");

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [supabase, toast]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      searchContacts(searchQuery);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, searchContacts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                ACTREC Telephone Directory
              </h1>
              <span className="ml-4 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {userRole === "admin" ? "Administrator" : "User"}
              </span>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("search")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "search"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Search Directory
            </button>
            {userRole === "admin" && (
              <button
                onClick={() => setActiveTab("admin")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "admin"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Settings className="h-4 w-4 inline mr-2" />
                Administration
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === "search" && (
          <SearchInterface
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            contacts={contacts}
            loading={loading}
          />
        )}
        {activeTab === "admin" && userRole === "admin" && (
          <AdminPanel />
        )}
      </main>
    </div>
  );
}