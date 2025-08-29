"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { contactService, csvService, type Contact, type ContactInsert, type PatentableIdea, type LearningPlan } from "@/lib/database";
import { 
  Plus, Edit, Trash2, Upload, Download, Search, Settings, 
  Brain, Lightbulb, BookOpen, Save, ArrowLeft, FileText,
  User, Building2, Phone, Mail, MapPin, Loader2
} from "lucide-react";

export default function DashboardPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState<ContactInsert>({
    name: "",
    department: "",
    designation: "",
    phone_number: "",
    extension: "",
    email: "",
    location: "",
    institution: "ACTREC"
  });
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [bulkEditData, setBulkEditData] = useState({
    department: "",
    location: "",
    institution: ""
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<{
    contacts: ContactInsert[];
    errors: string[];
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    current: number;
    total: number;
    stage: string;
  } | null>(null);
  const [patentableIdeas, setPatentableIdeas] = useState<PatentableIdea[]>([]);
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);
  const [newIdea, setNewIdea] = useState<{
    title: string;
    description: string;
    category: string;
  }>({
    title: "",
    description: "",
    category: ""
  });
  const [newLearningPlan, setNewLearningPlan] = useState<{
    title: string;
    description: string;
    category: string;
  }>({
    title: "",
    description: "",
    category: ""
  });
  const router = useRouter();
  const { toast } = useToast();

  const loadContacts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await contactService.getContacts();
    
    if (error) {
      toast({
        title: "Error Loading Contacts",
        description: "Failed to load contacts from database",
        variant: "destructive"
      });
    } else if (data) {
      setContacts(data);
    }
    
    setLoading(false);
  }, [toast]);

  // Load contacts on component mount
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // Contact Management Functions
  const addContact = async () => {
    if (!newContact.name || !newContact.email || !newContact.extension) {
      toast({
        title: "Validation Error",
        description: "Name, email, and extension are required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { data, error } = await contactService.createContact(newContact);
    
    if (error) {
      toast({
        title: "Error Adding Contact",
        description: String(error) || "Failed to add contact",
        variant: "destructive"
      });
    } else if (data) {
      setContacts([...contacts, data]);
      setNewContact({
        name: "",
        department: "",
        designation: "",
        phone_number: "",
        extension: "",
        email: "",
        location: "",
        institution: "ACTREC"
      });
      toast({
        title: "Contact Added",
        description: `${data.name} has been added to the directory`
      });
    }
    
    setLoading(false);
  };

  const updateContact = async () => {
    if (!editingContact) return;
    
    setLoading(true);
    const { data, error } = await contactService.updateContact(editingContact.id, {
      name: editingContact.name,
      department: editingContact.department,
      designation: editingContact.designation,
      phone_number: editingContact.phone_number,
      extension: editingContact.extension,
      email: editingContact.email,
      location: editingContact.location,
      institution: editingContact.institution
    });
    
    if (error) {
      toast({
        title: "Error Updating Contact",
        description: String(error) || "Failed to update contact",
        variant: "destructive"
      });
    } else if (data) {
      setContacts(contacts.map(c => c.id === data.id ? data : c));
      setEditingContact(null);
      toast({
        title: "Contact Updated",
        description: "Contact information has been successfully updated"
      });
    }
    
    setLoading(false);
  };

  const deleteContact = async (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    
    setLoading(true);
    const { error } = await contactService.deleteContact(id);
    
    if (error) {
      toast({
        title: "Error Deleting Contact",
        description: String(error) || "Failed to delete contact",
        variant: "destructive"
      });
    } else {
      setContacts(contacts.filter(c => c.id !== id));
      toast({
        title: "Contact Deleted",
        description: `${contact.name} has been removed from the directory`
      });
    }
    
    setLoading(false);
  };

  const deleteSelectedContacts = async () => {
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
        description: String(error) || "Failed to delete selected contacts",
        variant: "destructive"
      });
    } else {
      setContacts(contacts.filter(c => !selectedContacts.includes(c.id)));
      setSelectedContacts([]);
      toast({
        title: "Bulk Delete Complete",
        description: `${selectedContacts.length} contacts have been deleted`
      });
    }
    
    setLoading(false);
  };

  const updateSelectedContacts = async () => {
    if (selectedContacts.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select contacts to update",
        variant: "destructive"
      });
      return;
    }

    const updates: any = {};
    if (bulkEditData.department) updates.department = bulkEditData.department;
    if (bulkEditData.location) updates.location = bulkEditData.location;
    if (bulkEditData.institution) updates.institution = bulkEditData.institution;

    if (Object.keys(updates).length === 0) {
      toast({
        title: "No Changes",
        description: "Please enter at least one field to update",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { data, error } = await contactService.updateMultipleContacts(selectedContacts, updates);
    
    if (error) {
      toast({
        title: "Error Updating Contacts",
        description: String(error) || "Failed to update selected contacts",
        variant: "destructive"
      });
    } else if (data) {
      // Update the contacts in state
      const updatedContactsMap = new Map(data.map(c => [c.id, c]));
      setContacts(contacts.map(c => updatedContactsMap.get(c.id) || c));
      setSelectedContacts([]);
      setBulkEditData({ department: "", location: "", institution: "" });
      toast({
        title: "Bulk Update Complete",
        description: `${data.length} contacts have been updated`
      });
    }
    
    setLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setCsvPreview(null);
      return;
    }

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      setSelectedFile(null);
      setCsvPreview(null);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    
    // Parse CSV immediately for preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      const { contacts: parsedContacts, errors } = csvService.parseCSVData(csvText);
      setCsvPreview({ contacts: parsedContacts, errors });
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (!selectedFile || !csvPreview) {
      toast({
        title: "No File Selected",
        description: "Please select a valid CSV file first",
        variant: "destructive"
      });
      return;
    }

    if (csvPreview.errors.length > 0) {
      toast({
        title: "CSV Parse Errors",
        description: csvPreview.errors.join('; '),
        variant: "destructive"
      });
      return;
    }

    if (csvPreview.contacts.length === 0) {
      toast({
        title: "No Valid Data",
        description: "No valid contacts found in CSV file",
        variant: "destructive"
      });
      return;
    }

    // Start bulk upload process
    setLoading(true);
    setUploadProgress({ current: 0, total: csvPreview.contacts.length, stage: 'Initializing duplicate detection...' });
    
    toast({
      title: "Upload Started",
      description: `🚀 Processing ${csvPreview.contacts.length} contacts with comprehensive duplicate detection...`,
    });

    const allInserted: Contact[] = [];
    const allSkipped: any[] = [];
    
    try {
      // Process all contacts at once for proper batch duplicate detection
      setUploadProgress({
        current: 0,
        total: csvPreview.contacts.length,
        stage: 'Checking for duplicates in database...'
      });
      
      console.log('🚀 Starting comprehensive bulk upload with duplicate detection');
      
      // Call the fixed database service
      const { data: results, error } = await contactService.bulkInsertContacts(csvPreview.contacts);
      
      if (error) {
        throw new Error(error);
      }
      
      if (results) {
        allInserted.push(...results.inserted);
        allSkipped.push(...results.skipped);
        
        // Update final progress
        setUploadProgress({
          current: csvPreview.contacts.length,
          total: csvPreview.contacts.length,
          stage: 'Upload complete!'
        });
        
        // Show comprehensive results
        const insertedCount = allInserted.length;
        const skippedCount = allSkipped.length;
        
        console.log(`📊 Upload Results:`, {
          inserted: insertedCount,
          skipped: skippedCount,
          details: allSkipped.slice(0, 3)
        });
        
        // Show success message
        if (insertedCount > 0 && skippedCount > 0) {
          const message = `✅ Successfully uploaded ${insertedCount} new contacts\n⚠️ Skipped ${skippedCount} duplicate records`;
          console.log('🎉 UPLOAD RESULTS:', message);
          alert(message);
          toast({
            title: "Upload Complete with Duplicates",
            description: `✅ Successfully uploaded ${insertedCount} new contacts\n⚠️ Skipped ${skippedCount} duplicate records`,
            duration: 6000
          });
        } else if (insertedCount > 0 && skippedCount === 0) {
          const message = `✅ All ${insertedCount} contacts uploaded successfully! No duplicates found.`;
          console.log('🎉 UPLOAD SUCCESS:', message);
          alert(message);
          toast({
            title: "Upload Successful",
            description: message,
            duration: 5000
          });
        } else if (insertedCount === 0 && skippedCount > 0) {
          const message = `⚠️ All ${skippedCount} contacts were already in the database. No new records added.`;
          console.log('⚠️ ALL DUPLICATES:', message);
          alert(message);
          toast({
            title: "All Records Were Duplicates",
            description: message,
            variant: "default",
            duration: 6000
          });
        } else {
          const message = "No contacts were processed. Please check your CSV file.";
          console.error('❌ NO PROCESSING:', message);
          alert(message);
          toast({
            title: "No Records Processed",
            description: message,
            variant: "destructive"
          });
        }
        
        // Show detailed duplicate information if any
        if (skippedCount > 0) {
          setTimeout(() => {
            const duplicateDetails = allSkipped.slice(0, 5).map(item => {
              const name = item.contact?.name || 'Unknown';
              const reason = item.reason || 'Duplicate detected';
              return `• ${name}: ${reason}`;
            }).join('\n');
            
            const moreText = skippedCount > 5 ? `\n• ...and ${skippedCount - 5} more duplicate records` : '';
            
            toast({
              title: "Duplicate Records Details",
              description: `The following records were skipped:\n${duplicateDetails}${moreText}`,
              variant: "default",
              duration: 10000
            });
          }, 2000);
        }
        
        // Refresh contacts list if any were inserted
        if (insertedCount > 0) {
          console.log('🔄 Refreshing contact list with new records...');
          setTimeout(() => {
            loadContacts().catch(console.error);
          }, 1000);
        }
        
      } else {
        throw new Error('No results returned from upload operation');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during upload';
      console.error('💥 UPLOAD ERROR:', errorMessage);
      alert(`❌ Upload Failed: ${errorMessage}`);
      toast({
        title: "Upload Failed",
        description: `❌ Error: ${errorMessage}`,
        variant: "destructive",
        duration: 8000
      });
    } finally {
      // Cleanup
      setLoading(false);
      setUploadProgress(null);
      setSelectedFile(null);
      setCsvPreview(null);
      const fileInput = document.getElementById('csvFile') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const exportContacts = () => {
    if (contacts.length === 0) {
      toast({
        title: "No Data",
        description: "No contacts available to export",
        variant: "destructive"
      });
      return;
    }

    const csvContent = csvService.generateCSV(contacts);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `actrec_contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `Exported ${contacts.length} contacts to CSV`
    });
  };

  // Bioinformatics Extension Functions
  const addPatentableIdea = () => {
    if (!newIdea.title || !newIdea.description) {
      toast({
        title: "Validation Error",
        description: "Title and description are required",
        variant: "destructive"
      });
      return;
    }

    const idea = {
      ...newIdea,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setPatentableIdeas([...patentableIdeas, idea]);
    setNewIdea({ title: "", description: "", category: "" });
    
    toast({
      title: "Patentable Idea Added",
      description: "New bioinformatics idea has been stored securely"
    });
  };

  const addLearningPlan = () => {
    if (!newLearningPlan.title || !newLearningPlan.description) {
      toast({
        title: "Validation Error",
        description: "Title and description are required",
        variant: "destructive"
      });
      return;
    }

    const plan = {
      ...newLearningPlan,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split('T')[0]
    };
    
    setLearningPlans([...learningPlans, plan]);
    setNewLearningPlan({ title: "", description: "", category: "" });
    
    toast({
      title: "Learning Plan Added",
      description: "New research collaboration guide has been created"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage contacts, bulk operations, and bioinformatics extensions
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => router.push('/search')}
              >
                <Search className="w-4 h-4 mr-2" />
                Search Directory
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="contacts">Contact Management</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
            <TabsTrigger value="patents">Patentable Ideas</TabsTrigger>
            <TabsTrigger value="learning">Learning Plans</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Contact Management Tab */}
          <TabsContent value="contacts">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Add/Edit Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {editingContact ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {editingContact ? "Edit Contact" : "Add New Contact"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={editingContact?.name || newContact.name}
                          onChange={(e) => editingContact 
                            ? setEditingContact({...editingContact, name: e.target.value})
                            : setNewContact(prev => ({...prev, name: e.target.value}))
                          }
                          placeholder="DR. JOHN SMITH"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={editingContact?.department || newContact.department}
                          onChange={(e) => editingContact
                            ? setEditingContact({...editingContact, department: e.target.value})
                            : setNewContact(prev => ({...prev, department: e.target.value}))
                          }
                          placeholder="Medical Administration"
                          disabled={loading}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          value={editingContact?.designation || newContact.designation}
                          onChange={(e) => editingContact
                            ? setEditingContact({...editingContact, designation: e.target.value})
                            : setNewContact(prev => ({...prev, designation: e.target.value}))
                          }
                          placeholder="Doctor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={editingContact?.phone_number || newContact.phone_number}
                          onChange={(e) => editingContact
                            ? setEditingContact({...editingContact, phone_number: e.target.value})
                            : setNewContact(prev => ({...prev, phone_number: e.target.value}))
                          }
                          placeholder="-7671"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="extension">Extension *</Label>
                        <Input
                          id="extension"
                          value={editingContact?.extension || newContact.extension}
                          onChange={(e) => editingContact
                            ? setEditingContact({...editingContact, extension: e.target.value})
                            : setNewContact(prev => ({...prev, extension: e.target.value}))
                          }
                          placeholder="5042"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={editingContact?.email || newContact.email}
                          onChange={(e) => editingContact
                            ? setEditingContact({...editingContact, email: e.target.value})
                            : setNewContact(prev => ({...prev, email: e.target.value}))
                          }
                          placeholder="john.smith@actrec.gov.in"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editingContact?.location || newContact.location}
                          onChange={(e) => editingContact
                            ? setEditingContact({...editingContact, location: e.target.value})
                            : setNewContact(prev => ({...prev, location: e.target.value}))
                          }
                          placeholder="Second Floor"
                        />
                      </div>
                      <div>
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          value={editingContact?.institution || newContact.institution}
                          onChange={(e) => editingContact
                            ? setEditingContact({...editingContact, institution: e.target.value})
                            : setNewContact(prev => ({...prev, institution: e.target.value}))
                          }
                          placeholder="ACTREC"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {editingContact ? (
                        <>
                          <Button onClick={updateContact} className="flex-1" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Update Contact
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingContact(null)}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={addContact} className="w-full" disabled={loading}>
                          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                          Add Contact
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Bulk Operations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedContacts.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium mb-3">Bulk Edit ({selectedContacts.length} selected)</h4>
                      <div className="grid grid-cols-1 gap-3">
                        <div>
                          <Label htmlFor="bulkDepartment">Department</Label>
                          <Input
                            id="bulkDepartment"
                            value={bulkEditData.department}
                            onChange={(e) => setBulkEditData(prev => ({...prev, department: e.target.value}))}
                            placeholder="Leave empty to keep existing"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bulkLocation">Location</Label>
                          <Input
                            id="bulkLocation"
                            value={bulkEditData.location}
                            onChange={(e) => setBulkEditData(prev => ({...prev, location: e.target.value}))}
                            placeholder="Leave empty to keep existing"
                            disabled={loading}
                          />
                        </div>
                        <div>
                          <Label htmlFor="bulkInstitution">Institution</Label>
                          <Input
                            id="bulkInstitution"
                            value={bulkEditData.institution}
                            onChange={(e) => setBulkEditData(prev => ({...prev, institution: e.target.value}))}
                            placeholder="Leave empty to keep existing"
                            disabled={loading}
                          />
                        </div>
                        <Button onClick={updateSelectedContacts} disabled={loading}>
                          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Edit className="w-4 h-4 mr-2" />}
                          Update Selected
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="destructive" 
                    onClick={deleteSelectedContacts}
                    disabled={selectedContacts.length === 0 || loading}
                    className="w-full"
                  >
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Delete Selected ({selectedContacts.length})
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Current Contacts ({contacts.length})</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="ml-2">Loading contacts...</span>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {contacts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No contacts found. Add some contacts to get started.
                        </div>
                      ) : (
                        contacts.map((contact) => (
                          <div key={contact.id} className="flex items-center gap-3 p-3 border rounded-lg">
                            <input
                              type="checkbox"
                              checked={selectedContacts.includes(contact.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedContacts([...selectedContacts, contact.id]);
                                } else {
                                  setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                                }
                              }}
                              disabled={loading}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-sm text-gray-500">
                                {contact.department} • Ext: {contact.extension}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingContact(contact)}
                                disabled={loading}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteContact(contact.id)}
                                disabled={loading}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bulk Operations Tab */}
          <TabsContent value="bulk">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Bulk Upload
                  </CardTitle>
                  <CardDescription>
                    Upload contacts via CSV file with duplicate detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="csvFile">Choose CSV File</Label>
                    <Input
                      id="csvFile"
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      disabled={loading}
                    />
                    
                    {/* Selected File Display */}
                    {selectedFile && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">{selectedFile.name}</p>
                            <p className="text-xs text-blue-600">
                              Size: {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedFile(null);
                              setCsvPreview(null);
                              const fileInput = document.getElementById('csvFile') as HTMLInputElement;
                              if (fileInput) fileInput.value = '';
                            }}
                            disabled={loading}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* CSV Preview */}
                    {csvPreview && (
                      <div className="p-4 bg-gray-50 border rounded-lg">
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          CSV Preview
                        </h4>
                        
                        {csvPreview.errors.length > 0 && (
                          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded">
                            <h5 className="text-sm font-medium text-red-800 mb-1">Parsing Errors:</h5>
                            <ul className="text-xs text-red-700 list-disc list-inside">
                              {csvPreview.errors.map((error, index) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {csvPreview.contacts.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                📋 {csvPreview.contacts.length} contacts ready to upload
                              </span>
                              <span className="text-xs text-gray-500">
                                Duplicate checking will be performed
                              </span>
                            </div>
                            
                            {/* Show first few contacts as preview */}
                            <div className="max-h-32 overflow-y-auto text-xs">
                              {csvPreview.contacts.slice(0, 3).map((contact, index) => (
                                <div key={index} className="py-1 border-b border-gray-200 last:border-b-0">
                                  <span className="font-medium">{contact.name}</span>
                                  <span className="text-gray-500 ml-2">Ext: {contact.extension}</span>
                                  <span className="text-gray-500 ml-2">{contact.email}</span>
                                </div>
                              ))}
                              {csvPreview.contacts.length > 3 && (
                                <div className="py-1 text-gray-500 italic">
                                  ...and {csvPreview.contacts.length - 3} more contacts
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Progress Indicator */}
                    {uploadProgress && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">
                            {uploadProgress.stage}
                          </span>
                        </div>
                        <div className="w-full bg-blue-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-blue-700 mt-1">
                          {uploadProgress.current} of {uploadProgress.total} contacts processed
                        </div>
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    <Button 
                      onClick={handleBulkUpload}
                      disabled={!selectedFile || loading || uploadProgress !== null || (csvPreview?.errors?.length || 0) > 0}
                      className="w-full"
                    >
                      {loading || uploadProgress ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {uploadProgress ? uploadProgress.stage : "Processing CSV... Please wait"}
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload {selectedFile ? selectedFile.name : 'CSV File'}
                          {csvPreview && csvPreview.contacts.length > 0 && (
                            <span className="ml-2 text-xs opacity-75">
                              ({csvPreview.contacts.length} contacts)
                            </span>
                          )}
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">CSV Format Requirements:</p>
                    <p>Headers: Name, Department, Designation, Phone Number, Extension, Email, Location, Institution</p>
                    <p>Duplicates detected by Extension + Email combination</p>
                    <p className="text-xs mt-2 text-gray-500">Maximum file size: 5MB</p>
                    {csvPreview && csvPreview.contacts.length > 20 && (
                      <p className="text-xs mt-1 text-orange-600">
                        ⚠️ Large file detected. Processing may take a few moments.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Data
                  </CardTitle>
                  <CardDescription>
                    Download current contact data as CSV
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={exportContacts} className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Contacts ({contacts.length})
                  </Button>
                  <div className="text-sm text-gray-600">
                    <p>Exports all current contacts in CSV format</p>
                    <p>Compatible with bulk upload requirements</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patentable Ideas Tab */}
          <TabsContent value="patents">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    Add Patentable Idea
                  </CardTitle>
                  <CardDescription>
                    Store innovative bioinformatics concepts securely
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ideaTitle">Idea Title</Label>
                    <Input
                      id="ideaTitle"
                      value={newIdea.title}
                      onChange={(e) => setNewIdea(prev => ({...prev, title: e.target.value}))}
                      placeholder="AI-driven semantic search for bioinformatics profiles"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ideaCategory">Category</Label>
                    <Input
                      id="ideaCategory"
                      value={newIdea.category}
                      onChange={(e) => setNewIdea(prev => ({...prev, category: e.target.value}))}
                      placeholder="AI Integration"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ideaDescription">Description</Label>
                    <Textarea
                      id="ideaDescription"
                      value={newIdea.description}
                      onChange={(e) => setNewIdea(prev => ({...prev, description: e.target.value}))}
                      placeholder="Detailed description of the patentable concept..."
                      rows={4}
                    />
                  </div>
                  <Button onClick={addPatentableIdea} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Patentable Idea
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Stored Ideas ({patentableIdeas.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {patentableIdeas.map((idea) => (
                      <div key={idea.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{idea.title}</h3>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {idea.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{idea.description}</p>
                        <p className="text-xs text-gray-500">Added: {idea.dateAdded}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Learning Plans Tab */}
          <TabsContent value="learning">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Add Learning Plan
                  </CardTitle>
                  <CardDescription>
                    Create research collaboration guides
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="planTitle">Plan Title</Label>
                    <Input
                      id="planTitle"
                      value={newLearningPlan.title}
                      onChange={(e) => setNewLearningPlan(prev => ({...prev, title: e.target.value}))}
                      placeholder="Oncology Expert Collaboration Guide"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planCategory">Category</Label>
                    <Input
                      id="planCategory"
                      value={newLearningPlan.category}
                      onChange={(e) => setNewLearningPlan(prev => ({...prev, category: e.target.value}))}
                      placeholder="Research Collaboration"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planDescription">Step-by-Step Guide</Label>
                    <Textarea
                      id="planDescription"
                      value={newLearningPlan.description}
                      onChange={(e) => setNewLearningPlan(prev => ({...prev, description: e.target.value}))}
                      placeholder="Step 1: Search 'Department: Medical Administration'&#10;Step 2: Filter results by specialty..."
                      rows={6}
                    />
                  </div>
                  <Button onClick={addLearningPlan} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Learning Plan
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Plans ({learningPlans.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {learningPlans.map((plan) => (
                      <div key={plan.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium">{plan.title}</h3>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {plan.category}
                          </span>
                        </div>
                        <pre className="text-sm text-gray-600 mb-2 whitespace-pre-wrap">{plan.description}</pre>
                        <p className="text-xs text-gray-500">Added: {plan.dateAdded}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Password Change</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Input type="password" placeholder="Current Password" />
                      <Input type="password" placeholder="New Password" />
                      <Input type="password" placeholder="Confirm New Password" />
                      <Button className="w-full">Update Password</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">System Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Contacts:</span>
                        <span className="font-medium">{contacts.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patentable Ideas:</span>
                        <span className="font-medium">{patentableIdeas.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Learning Plans:</span>
                        <span className="font-medium">{learningPlans.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>System Status:</span>
                        <span className="text-green-600 font-medium">Operational</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}