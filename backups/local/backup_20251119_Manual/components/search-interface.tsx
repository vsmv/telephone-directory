"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Phone, Mail, MapPin, Building } from "lucide-react";
import { Contact } from "@/lib/types";

interface SearchInterfaceProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  contacts: Contact[];
  loading: boolean;
}

export default function SearchInterface({
  searchQuery,
  setSearchQuery,
  contacts,
  loading,
}: SearchInterfaceProps) {
  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by name, department, designation, phone, email, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Search across all fields including name, department, designation, phone number, extension, email, location, and institution.
        </p>
      </div>

      {/* Search Results */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Searching...</p>
        </div>
      )}

      {!loading && searchQuery && contacts.length === 0 && (
        <div className="text-center py-8">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or check the spelling.
          </p>
        </div>
      )}

      {!loading && contacts.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Search Results ({contacts.length} found)
            </h2>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{contact.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {contact.designation} • {contact.department}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{contact.phone_number}</span>
                    {contact.extension && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        Ext: {contact.extension}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{contact.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{contact.institution}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {!searchQuery && (
        <div className="text-center py-12">
          <Search className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Welcome to ACTREC Telephone Directory
          </h3>
          <p className="mt-2 text-gray-600 max-w-md mx-auto">
            Search for contacts across departments including Medical Administration, 
            IT, and research divisions. Perfect for oncology and dementia research collaboration.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900">Quick Search Tips</h4>
              <p className="text-sm text-blue-700 mt-1">
                Try &ldquo;Doctor&rdquo; for medical staff or &ldquo;IT&rdquo; for technical support
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900">Research Focus</h4>
              <p className="text-sm text-green-700 mt-1">
                Find experts in oncology, protein analysis, and dementia research
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900">Collaboration</h4>
              <p className="text-sm text-purple-700 mt-1">
                Connect with bioinformatics and drug discovery teams
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}