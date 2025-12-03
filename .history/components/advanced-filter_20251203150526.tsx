"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";
import { Contact } from "@/lib/database";

interface AdvancedFilterProps {
  contacts: Contact[];
  onFilterChange: (filters: {
    query: string;
    department?: string;
    designation?: string;
    location?: string;
    institution?: string;
  }) => void;
  onClearFilters: () => void;
}

export default function AdvancedFilter({ contacts, onFilterChange, onClearFilters }: AdvancedFilterProps) {
  const [filters, setFilters] = useState({
    query: "",
    department: "",
    designation: "",
    location: "",
    institution: ""
  });

  const [departments, setDepartments] = useState<string[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<string[]>([]);

  // Extract unique values for filter options
  useEffect(() => {
    if (contacts && contacts.length > 0) {
      const uniqueDepartments = Array.from(new Set(contacts.map(c => c.department).filter(Boolean)));
      const uniqueDesignations = Array.from(new Set(contacts.map(c => c.designation).filter(Boolean)));
      const uniqueLocations = Array.from(new Set(contacts.map(c => c.location).filter(Boolean)));
      const uniqueInstitutions = Array.from(new Set(contacts.map(c => c.institution).filter(Boolean)));
      
      setDepartments(uniqueDepartments.sort());
      setDesignations(uniqueDesignations.sort());
      setLocations(uniqueLocations.sort());
      setInstitutions(uniqueInstitutions.sort());
    }
  }, [contacts]);

  const handleInputChange = (field: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    // Don't call onFilterChange immediately - let parent handle debouncing
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      department: "",
      designation: "",
      location: "",
      institution: ""
    });
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "");

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Advanced Search & Filters
        </CardTitle>
        <CardDescription>
          Refine your search with specific filters for departments, designations, and locations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="query">Search Query</Label>
            <Input
              id="query"
              placeholder="Name, email, phone..."
              value={filters.query}
              onChange={(e) => handleInputChange("query", e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <select
              id="department"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={filters.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="designation">Designation</Label>
            <select
              id="designation"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={filters.designation}
              onChange={(e) => handleInputChange("designation", e.target.value)}
            >
              <option value="">All Designations</option>
              {designations.map(designation => (
                <option key={designation} value={designation}>{designation}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <select
              id="location"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={filters.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <select
              id="institution"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={filters.institution}
              onChange={(e) => handleInputChange("institution", e.target.value)}
            >
              <option value="">All Institutions</option>
              {institutions.map(institution => (
                <option key={institution} value={institution}>{institution}</option>
              ))}
            </select>
          </div>
        </div>
        
        {hasActiveFilters && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}