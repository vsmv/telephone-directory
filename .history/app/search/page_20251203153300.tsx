"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { contactService, csvService, type Contact } from "@/lib/database";
import { useAuth } from "@/lib/auth";
import { Search, Filter, Download, ArrowLeft, User, Building2, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { useDebounce, useLocalStorage, usePerformanceMonitor } from "@/hooks/use-performance";
import { Loading, LoadingCard } from "@/components/loading";
import AdvancedFilter from "@/components/advanced-filter";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const { hasPermission } = useAuth();
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const filterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Handle advanced filtering with debouncing
  const handleFilterChange = useCallback((filters: {
    query: string;
    department?: string;
    designation?: string;
    location?: string;
    institution?: string;
  }) => {
    setSearchTerm(filters.query);
    
    // Clear previous timeout
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    
    // Debounce the actual filtering to prevent rapid API calls
    filterTimeoutRef.current = setTimeout(() => {
      // Use the new method with filters - pass query as searchTerm
      const { query, ...otherFilters } = filters;
      contactService.getContacts(query || undefined, otherFilters).then(({ data, error }) => {
        if (error) {
          toast({
            title: "Filter Error",
            description: "Failed to filter contacts",
            variant: "destructive"
          });
          setFilteredContacts([]);
        } else if (data) {
          setFilteredContacts(data);
          setCurrentPage(1);
          if (filters.query || filters.department || filters.designation || filters.location || filters.institution) {
            toast({
              title: "Filter Applied",
              description: `Found ${data.length} matching contact(s)`
            });
          }
        }
      });
    }, 500); // 500ms debounce
  }, [toast]);

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
    // Use the new method with filters
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

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilteredContacts(allContacts);
    setCurrentPage(1);
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

  // Check if user has permission to search contacts
  if (!hasPermission('canSearchContacts')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to search contacts.</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Contact Directory Search</h1>
              <p className="text-indigo-100 mt-1">
                Search across all ACTREC departments and specializations
              </p>
            </div>
            <div className="flex gap-3">
              {/* Show dashboard button if user is logged in */}
              {typeof window !== 'undefined' && localStorage.getItem('token') && (
                <Button 
                  onClick={() => router.push('/dashboard')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              )}
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
                className="bg-white/90 hover:bg-white border-white/50 text-indigo-700 hover:text-indigo-800 shadow-md"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* Advanced Filter Component */}
        <AdvancedFilter
          contacts={allContacts}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Search Results */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>
              Search Results ({filteredContacts.length} contacts)
              {searchTerm && (
                <span className="text-sm font-normal text-gray-500 ml-2 block sm:inline">
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
                {/* Results Table - Responsive for mobile */}
                <div className="overflow-x-auto">
                  <table
                    className="w-full border-collapse"
                    role="table"
                    aria-label={`Search results showing ${filteredContacts.length} contacts${searchTerm ? ` for "${searchTerm}"` : ''}`}
                  >
                    <thead>
                      <tr className="border-b" role="row">
                        <th
                          className="text-left p-3 cursor-pointer hover:bg-gray-50 text-sm"
                          onClick={() => handleSort("name")}
                          role="columnheader"
                          aria-sort={sortField === "name" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && handleSort("name")}
                        >
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" aria-hidden="true" />
                            <span className="hidden sm:inline">Name</span>
                            {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                        <th
                          className="text-left p-3 cursor-pointer hover:bg-gray-50 text-sm"
                          onClick={() => handleSort("department")}
                          role="columnheader"
                          aria-sort={sortField === "department" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && handleSort("department")}
                        >
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" aria-hidden="true" />
                            <span className="hidden sm:inline">Department</span>
                            {sortField === "department" && (sortDirection === "asc" ? "↑" : "↓")}
                          </div>
                        </th>
                        <th className="text-left p-3 text-sm hidden md:table-cell" role="columnheader">
                          Designation
                        </th>
                        <th className="text-left p-3 text-sm" role="columnheader">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" aria-hidden="true" />
                            <span className="hidden sm:inline">Contact</span>
                          </div>
                        </th>
                        <th className="text-left p-3 text-sm hidden md:table-cell" role="columnheader">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" aria-hidden="true" />
                            <span className="hidden sm:inline">Location</span>
                          </div>
                        </th>
                        <th className="text-left p-3 text-sm hidden lg:table-cell" role="columnheader">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" aria-hidden="true" />
                            <span className="hidden sm:inline">Institution</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedContacts.map((contact) => (
                        <tr key={contact.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-blue-600 font-semibold text-xs">
                                  {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div>{contact.name}</div>
                                <div className="text-xs text-gray-500 sm:hidden">
                                  {contact.department}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-sm hidden sm:table-cell">
                            {contact.department}
                          </td>
                          <td className="p-3 text-sm hidden md:table-cell">
                            {contact.designation}
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate">{contact.phone_number} (Ext: {contact.extension})</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Mail className="w-3 h-3 flex-shrink-0" />
                                <span className="truncate text-xs">{contact.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell text-sm">
                            {contact.location}
                          </td>
                          <td className="p-3 hidden lg:table-cell text-sm">
                            {contact.institution}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile List View Alternative */}
                <div className="sm:hidden space-y-4 mt-4">
                  {paginatedContacts.map((contact) => (
                    <div key={contact.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-semibold text-sm">
                            {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                          <p className="text-sm text-gray-500">{contact.department}</p>
                          <p className="text-sm text-gray-500">{contact.designation}</p>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2 pl-13">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{contact.phone_number} (Ext: {contact.extension})</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{contact.location}, {contact.institution}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
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