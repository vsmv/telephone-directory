"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { contactService, type Contact } from "@/lib/database";
import { useAuth } from "@/lib/auth";
import { Search, User, Building2, Phone, Mail, MapPin, Loader2, Download } from "lucide-react";

export default function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAdmin } = useAuth();

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
      setContacts([]);
      setFilteredContacts([]);
    } else if (data) {
      setContacts(data);
      setFilteredContacts(data);
    }
    
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Handle search
  const handleSearch = useCallback((term: string) => {
    if (!term.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const searchLower = term.toLowerCase();
    const filtered = contacts.filter(contact => 
      contact.name.toLowerCase().includes(searchLower) ||
      contact.department.toLowerCase().includes(searchLower) ||
      contact.designation.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.phone_number.includes(term) ||
      contact.extension.includes(term) ||
      contact.location.toLowerCase().includes(searchLower)
    );

    setFilteredContacts(filtered);
  }, [contacts]);

  // Real-time search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  const exportCSV = () => {
    if (filteredContacts.length === 0) {
      toast({
        title: "No Data",
        description: "No contacts available to export",
        variant: "destructive"
      });
      return;
    }

    // Simple CSV generation
    const headers = ['Name', 'Department', 'Designation', 'Phone', 'Extension', 'Email', 'Location', 'Institution'];
    const csvContent = [
      headers.join(','),
      ...filteredContacts.map(contact => [
        `"${contact.name}"`,
        `"${contact.department}"`,
        `"${contact.designation}"`,
        `"${contact.phone_number}"`,
        `"${contact.extension}"`,
        `"${contact.email}"`,
        `"${contact.location}"`,
        `"${contact.institution}"`
      ].join(','))
    ].join('\n');

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
    <div className="space-y-6">
      {/* Search Bar */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Search className="w-5 h-5" />
            Search Contacts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by name, department, designation, email, phone, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button
              onClick={() => setSearchTerm("")}
              variant="outline"
            >
              Clear
            </Button>
            {isAdmin && (
              <Button
                onClick={exportCSV}
                disabled={filteredContacts.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-gray-900">
            Search Results ({filteredContacts.length} contacts)
            {searchTerm && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                for &ldquo;{searchTerm}&rdquo;
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-700">Loading contacts...</span>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? "No contacts found matching your search criteria" : "No contacts available"}
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-semibold">
                        {contact.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{contact.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Building2 className="w-4 h-4" />
                            <span>{contact.department}</span>
                          </div>
                          <div className="text-sm text-gray-600">{contact.designation}</div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <Phone className="w-4 h-4" />
                            <span>{contact.phone_number} (Ext: {contact.extension})</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <MapPin className="w-4 h-4" />
                            <span>{contact.location}</span>
                          </div>
                          <div className="text-sm text-gray-600">{contact.institution}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}