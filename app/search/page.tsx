"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { contactService, csvService, type Contact } from "@/lib/database";
import { Search, Filter, Download, ArrowLeft, User, Building2, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { useDebounce, useLocalStorage, usePerformanceMonitor } from "@/hooks/use-performance";
import { Loading, LoadingCard } from "@/components/loading";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  // Performance monitoring
  usePerformanceMonitor('SearchPage');

  // Local storage for user preferences
  const [itemsPerPage, setItemsPerPage] = useLocalStorage('search-items-per-page', 10);

  // Debounced search term for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Load all contacts on component mount
  const loadContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await contactService.getContacts();
    
    if (error) {
      toast({
        title: "Error Loading Contacts",
        description: "Failed to load contacts from database",
        variant: "destructive"
      });
      setAllContacts([]);
      setFilteredContacts([]);
    } else if (data) {
      setAllContacts(data);
      setFilteredContacts(data);
    }
    
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSearch = useCallback(async (term?: string) => {
    const searchValue = term !== undefined ? term : searchTerm;
    
    if (!searchValue.trim()) {
      setFilteredContacts(allContacts);
      toast({
        title: "Search Cleared",
        description: "Showing all contacts"
      });
      setCurrentPage(1);
      return;
    }

    setLoading(true);
    const { data, error } = await contactService.getContacts(searchValue.trim());
    
    if (error) {
      toast({
        title: "Search Error",
        description: "Failed to search contacts",
        variant: "destructive"
      });
      setFilteredContacts([]);
    } else if (data) {
      setFilteredContacts(data);
      setCurrentPage(1);
      toast({
        title: "Search Complete",
        description: `Found ${data.length} matching contact(s)`
      });
    }
    
    setLoading(false);
  }, [searchTerm, allContacts, toast]);

  // Real-time search with optimized debouncing
  useEffect(() => {
    if (debouncedSearchTerm.trim() || debouncedSearchTerm === '') {
      handleSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, handleSearch]);

  const handleSort = (field: string) => {
    const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredContacts].sort((a, b) => {
      const aValue = String((a as any)[field]).toLowerCase();
      const bValue = String((b as any)[field]).toLowerCase();
      
      if (direction === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setFilteredContacts(sorted);
  };

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const exportCSV = () => {
    if (filteredContacts.length === 0) {
      toast({
        title: "No Data",
        description: "No contacts available to export",
        variant: "destructive"
      });
      return;
    }

    const csvContent = csvService.generateCSV(filteredContacts);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `actrec_search_results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredContacts.length} contacts to CSV`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contact Directory Search</h1>
              <p className="text-gray-600 mt-2">
                Search across all ACTREC departments and specializations
              </p>
              {(!process.env.NEXT_PUBLIC_SUPABASE_URL || 
                process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref')) && (
                <div className="mt-2 px-3 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm">
                  🔍 Demo Mode: Using sample data. Configure Supabase for full functionality.
                </div>
              )}
            </div>
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Search Interface */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Advanced Search with Wildcards
            </CardTitle>
            <CardDescription>
              Search by name, department, designation, phone, email, location, or institution.
              Use * for multiple characters, ? for single character wildcards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Term</Label>
                  <Input
                    id="search"
                    placeholder="Enter search term (e.g., 'Doctor*', '*medical*', 'prashant.?@*')"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    aria-label="Search contacts by name, department, designation, phone, email, location, or institution"
                    aria-describedby="search-help"
                  />
                  <p id="search-help" className="text-xs text-gray-500 mt-1">
                    Real-time search • Use * for any characters, ? for single character
                  </p>
                </div>
                <div className="flex gap-2 items-end">
                  <Button onClick={() => handleSearch()} disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
                    Search
                  </Button>
                  <Button 
                    variant="secondary" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilteredContacts(allContacts);
                      setCurrentPage(1);
                    }} 
                    disabled={loading}
                  >
                    Clear
                  </Button>
                  <Button variant="outline" onClick={exportCSV} disabled={loading}>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
              
              {/* Wildcard Examples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="text-center">
                  <h4 className="font-medium text-blue-900 mb-1">Wildcard Examples</h4>
                  <p className="text-sm text-blue-700">Doctor* → Starts with &lsquo;Doctor&rsquo;</p>
                  <p className="text-sm text-blue-700">*admin* → Contains &lsquo;admin&rsquo;</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-blue-900 mb-1">Single Character</h4>
                  <p className="text-sm text-blue-700">Dr? → &lsquo;Dr&rsquo; + any 1 char</p>
                  <p className="text-sm text-blue-700">?edical → Any char + &lsquo;edical&rsquo;</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-blue-900 mb-1">Email Search</h4>
                  <p className="text-sm text-blue-700">*@actrec.* → ACTREC emails</p>
                  <p className="text-sm text-blue-700">prashant.* → Starts with &lsquo;prashant.&rsquo;</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                Search Results ({filteredContacts.length} contacts)
                {searchTerm && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    for &ldquo;{searchTerm}&rdquo;
                    {(searchTerm.includes('*') || searchTerm.includes('?')) && 
                      <span className="text-blue-600"> (with wildcards)</span>
                    }
                  </span>
                )}
              </CardTitle>
              <div className="text-sm text-gray-500">
                {totalPages > 0 ? `Page ${currentPage} of ${totalPages}` : 'No pages'}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading contacts...</span>
              </div>
            ) : filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "No contacts found matching your search criteria" : "No contacts available"}
              </div>
            ) : (
              <>
                {/* Results Table */}
                <div className="overflow-x-auto">
                  <table
                    className="w-full border-collapse"
                    role="table"
                    aria-label={`Search results showing ${filteredContacts.length} contacts${searchTerm ? ` for "${searchTerm}"` : ''}`}
                  >
                    <thead>
                      <tr className="border-b" role="row">
                        <th
                          className="text-left p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort("name")}
                          role="columnheader"
                          aria-sort={sortField === "name" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && handleSort("name")}
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" aria-hidden="true" />
                            Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                        <th
                          className="text-left p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort("department")}
                          role="columnheader"
                          aria-sort={sortField === "department" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && handleSort("department")}
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" aria-hidden="true" />
                            Department {sortField === "department" && (sortDirection === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                        <th
                          className="text-left p-3 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleSort("designation")}
                          role="columnheader"
                          aria-sort={sortField === "designation" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && handleSort("designation")}
                        >
                          Designation {sortField === "designation" && (sortDirection === "asc" ? "↑" : "↓")}
                        </th>
                        <th className="text-left p-3" role="columnheader">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" aria-hidden="true" />
                            Contact
                          </div>
                        </th>
                        <th className="text-left p-3" role="columnheader">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" aria-hidden="true" />
                            Location
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedContacts.map((contact) => (
                        <tr key={contact.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{contact.name}</td>
                          <td className="p-3">{contact.department}</td>
                          <td className="p-3">{contact.designation}</td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3 h-3" />
                                {contact.phone_number} (Ext: {contact.extension})
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3 h-3" />
                                {contact.email}
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1 text-sm">
                              <div>{contact.location}</div>
                              <div className="text-gray-500">{contact.institution}</div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredContacts.length)} of {filteredContacts.length} results
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
