"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload, Download, Edit, Trash2, Users } from "lucide-react";
import ContactForm from "@/components/contact-form";
import BulkOperations from "@/components/bulk-operations";


export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("add");

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Administration Panel</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage contacts, perform bulk operations, and maintain the telephone directory database.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Contact
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Bulk Operations
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Manage Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Contact</CardTitle>
              <CardDescription>
                Add a single contact to the directory with validation for unique extensions and emails.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm mode="add" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-6">
          <BulkOperations />
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Existing Records</CardTitle>
              <CardDescription>
                Search, edit, and delete individual or multiple contacts. Includes mass delete operations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Advanced contact management interface</p>
                <p className="text-sm">Features: Search, Edit, Delete, Mass Operations, CSV Management</p>
                <div className="mt-4 text-sm text-left max-w-md mx-auto">
                  <h4 className="font-medium text-gray-700 mb-2">Available Operations:</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Individual contact edit/delete</li>
                    <li>• Bulk select and modify</li>
                    <li>• Mass delete by department/location</li>
                    <li>• CSV-based bulk operations</li>
                    <li>• Advanced search and filtering</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  );
}