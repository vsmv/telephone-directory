"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { contactService, type Contact } from "@/lib/database";
import { Edit, Trash2, Users, Check, X } from "lucide-react";

export default function ContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [bulkEditDialog, setBulkEditDialog] = useState(false);
  const [bulkEditFields, setBulkEditFields] = useState({
    department: "",
    location: "",
    institution: ""
  });
  const { toast } = useToast();

  const loadContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await contactService.getContacts();

    if (error) {
      toast({
        title: "Error Loading Contacts",
        description: error,
        variant: "destructive"
      });
    } else if (data) {
      setContacts(data);
    }

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSelectContact = (id: string) => {
    setSelectedContacts(prev => 
      prev.includes(id) 
        ? prev.filter(contactId => contactId !== id) 
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(contact => contact.id));
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
  };

  const handleDeleteContact = async (id: string) => {
    setLoading(true);
    const { error } = await contactService.deleteContact(id);

    if (error) {
      toast({
        title: "Error Deleting Contact",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Contact Deleted",
        description: "Contact has been successfully deleted"
      });
      loadContacts();
      setSelectedContacts(selectedContacts.filter(contactId => contactId !== id));
    }

    setLoading(false);
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select contacts to delete",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { error } = await contactService.deleteMultipleContacts(selectedContacts);

    if (error) {
      toast({
        title: "Error Deleting Contacts",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Contacts Deleted",
        description: `${selectedContacts.length} contacts have been successfully deleted`
      });
      loadContacts();
      setSelectedContacts([]);
    }

    setLoading(false);
  };

  const handleBulkEdit = async () => {
    if (selectedContacts.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select contacts to edit",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Update each selected contact with the bulk edit fields
    let successCount = 0;
    let errorCount = 0;

    for (const contactId of selectedContacts) {
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) continue;

      const updates: Partial<Contact> = {};
      if (bulkEditFields.department) updates.department = bulkEditFields.department;
      if (bulkEditFields.location) updates.location = bulkEditFields.location;
      if (bulkEditFields.institution) updates.institution = bulkEditFields.institution;

      if (Object.keys(updates).length > 0) {
        const { error } = await contactService.updateContact(contactId, updates);
        
        if (error) {
          console.error(`Failed to update contact ${contactId}:`, error);
          errorCount++;
        } else {
          successCount++;
        }
      }
    }

    if (errorCount > 0) {
      toast({
        title: "Bulk Edit Partially Failed",
        description: `${successCount} contacts updated successfully, ${errorCount} failed`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Bulk Edit Successful",
        description: `${successCount} contacts updated successfully`
      });
    }

    loadContacts();
    setBulkEditDialog(false);
    setSelectedContacts([]);
    setBulkEditFields({ department: "", location: "", institution: "" });

    setLoading(false);
  };

  const handleIndividualEdit = async () => {
    if (!editingContact) return;

    setLoading(true);
    const { error } = await contactService.updateContact(editingContact.id, editingContact);

    if (error) {
      toast({
        title: "Error Updating Contact",
        description: error,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Contact Updated",
        description: "Contact has been successfully updated"
      });
      loadContacts();
      setEditingContact(null);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Selection Controls */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            disabled={loading}
          >
            {selectedContacts.length === contacts.length ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Deselect All
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Select All
              </>
            )}
          </Button>
          <span className="text-sm text-gray-600">
            {selectedContacts.length} of {contacts.length} selected
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkEditDialog(true)}
            disabled={selectedContacts.length === 0 || loading}
          >
            <Edit className="w-4 h-4 mr-2" />
            Bulk Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            disabled={selectedContacts.length === 0 || loading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>

      {/* Contacts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Contacts</CardTitle>
          <CardDescription>
            Edit or delete individual contacts, or perform bulk operations on multiple contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading contacts...</span>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2">No contacts found</p>
              <p className="text-sm">Add contacts using the "Add Contact" tab</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedContacts.length === contacts.length && contacts.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr key={contact.id} className={selectedContacts.includes(contact.id) ? "bg-blue-50" : ""}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => handleSelectContact(contact.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.designation}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.phone_number} {contact.extension && `ext. ${contact.extension}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {contact.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditContact(contact)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Contact Dialog */}
      <Dialog open={!!editingContact} onOpenChange={() => setEditingContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Make changes to the contact information below.
            </DialogDescription>
          </DialogHeader>
          {editingContact && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">
                  Department
                </Label>
                <Input
                  id="department"
                  value={editingContact.department}
                  onChange={(e) => setEditingContact({...editingContact, department: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="designation" className="text-right">
                  Designation
                </Label>
                <Input
                  id="designation"
                  value={editingContact.designation}
                  onChange={(e) => setEditingContact({...editingContact, designation: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editingContact.email}
                  onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={editingContact.phone_number}
                  onChange={(e) => setEditingContact({...editingContact, phone_number: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="extension" className="text-right">
                  Extension
                </Label>
                <Input
                  id="extension"
                  value={editingContact.extension || ""}
                  onChange={(e) => setEditingContact({...editingContact, extension: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Location
                </Label>
                <Input
                  id="location"
                  value={editingContact.location}
                  onChange={(e) => setEditingContact({...editingContact, location: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="institution" className="text-right">
                  Institution
                </Label>
                <Input
                  id="institution"
                  value={editingContact.institution}
                  onChange={(e) => setEditingContact({...editingContact, institution: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingContact(null)}>
              Cancel
            </Button>
            <Button onClick={handleIndividualEdit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Dialog */}
      <Dialog open={bulkEditDialog} onOpenChange={setBulkEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Edit Contacts</DialogTitle>
            <DialogDescription>
              Update the following fields for {selectedContacts.length} selected contacts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bulk-department" className="text-right">
                Department
              </Label>
              <Input
                id="bulk-department"
                value={bulkEditFields.department}
                onChange={(e) => setBulkEditFields({...bulkEditFields, department: e.target.value})}
                placeholder="Leave blank to keep current value"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bulk-location" className="text-right">
                Location
              </Label>
              <Input
                id="bulk-location"
                value={bulkEditFields.location}
                onChange={(e) => setBulkEditFields({...bulkEditFields, location: e.target.value})}
                placeholder="Leave blank to keep current value"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bulk-institution" className="text-right">
                Institution
              </Label>
              <Input
                id="bulk-institution"
                value={bulkEditFields.institution}
                onChange={(e) => setBulkEditFields({...bulkEditFields, institution: e.target.value})}
                placeholder="Leave blank to keep current value"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkEdit} disabled={loading}>
              {loading ? "Updating..." : "Update All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}