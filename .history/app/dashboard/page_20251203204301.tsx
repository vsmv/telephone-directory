"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { contactService, csvService, type Contact, type ContactInsert } from "@/lib/database";

// Local types for dashboard functionality
interface PatentableIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  dateAdded: string;
}

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  category: string;
  dateAdded: string;
}
import { UserManagement } from "@/components/user-management";
import { RoleManagement } from "@/components/role-management";
import { SimpleLearningPlans } from "@/components/simple-learning-plans";
import { SimplePatentableIdeas } from "@/components/simple-patentable-ideas";
import { BulkUploadResults } from "@/components/bulk-upload-results";
import AdminSettings from "@/components/admin-settings";
import { useAuth, authService } from "@/lib/auth";
import { patentableIdeasService, learningPlansService } from "@/lib/ideas-and-plans";
import { userService } from "@/lib/database";
import { 
  Plus, Edit, Trash2, Upload, Download, Search, Settings, 
  Brain, Lightbulb, BookOpen, Save, ArrowLeft, FileText,
  User, Building2, Phone, Mail, MapPin, Loader2, Eye, EyeOff, AlertTriangle, Check, X
} from "lucide-react";

// Settings Tab Component
function SettingsTabContent({ user, isAdmin }: { user: any; isAdmin: boolean }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContacts: 0,
    patentableIdeas: 0,
    learningPlans: 0,
    totalUsers: 0
  });
  
  // Password change state
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      if (!user?.email) {
        console.log('⚠️ Settings: No user email available');
        return;
      }
      
      console.log('🔄 Settings: Loading stats for user:', user.email, 'isAdmin:', isAdmin);
      setLoading(true);
      try {
        // For admin: fetch ALL ideas and plans
        // For regular users: fetch only their own ideas and plans
        let ideasResult, plansResult;
        
        if (isAdmin) {
          // Admin gets ALL records
          [ideasResult, plansResult] = await Promise.all([
            patentableIdeasService.getAllIdeas(),
            learningPlansService.getAllPlans()
          ]);
          console.log('👑 Admin fetching ALL ideas and plans');
        } else {
          // Regular user gets only their own records
          [ideasResult, plansResult] = await Promise.all([
            patentableIdeasService.getIdeasByEmail(user.email),
            learningPlansService.getPlansByEmail(user.email)
          ]);
          console.log('👤 User fetching their own ideas and plans');
        }

        console.log('📊 Ideas result:', ideasResult);
        console.log('📊 Plans result:', plansResult);

        // If admin, also fetch total contacts and users
        let totalContacts = 0;
        let totalUsers = 0;
        if (isAdmin) {
          const [contactsResult, usersResult] = await Promise.all([
            contactService.getContacts(),
            userService.getUsers()
          ]);
          totalContacts = contactsResult.data?.length || 0;
          totalUsers = usersResult.data?.length || 0;
          console.log('👑 Admin stats - Contacts:', totalContacts, 'Users:', totalUsers);
        }

        const newStats = {
          totalContacts,
          patentableIdeas: ideasResult.data?.length || 0,
          learningPlans: plansResult.data?.length || 0,
          totalUsers
        };
        
        console.log('✅ Setting stats:', newStats);
        setStats(newStats);
      } catch (error) {
        console.error('❌ Error loading stats:', error);
        toast({
          title: "Error Loading Statistics",
          description: "Failed to load system statistics",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user?.email, isAdmin, toast]);

  const handlePasswordChange = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Validation Error",
        description: "All password fields are required",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New password and confirm password do not match",
        variant: "destructive"
      });
      return;
    }

    if (currentPassword === newPassword) {
      toast({
        title: "Validation Error",
        description: "New password must be different from current password",
        variant: "destructive"
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAuthToken()}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to change password');
      }

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully"
      });

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: "Error Changing Password",
        description: error instanceof Error ? error.message : 'Failed to change password',
        variant: "destructive"
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-700 text-white">
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          System Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <CardTitle className="text-lg">Password Change</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="relative">
                <Input 
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={passwordLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Input 
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-600">Passwords do not match</p>
              )}
              <Button 
                onClick={handlePasswordChange}
                disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md disabled:opacity-50"
              >
                {passwordLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardTitle className="text-lg">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-4">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                <>
                  {isAdmin && (
                    <div className="flex justify-between">
                      <span>Total Contacts:</span>
                      <span className="font-medium">{stats.totalContacts}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{isAdmin ? 'Total Patentable Ideas:' : 'My Patentable Ideas:'}</span>
                    <span className="font-medium">{stats.patentableIdeas}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isAdmin ? 'Total Learning Plans:' : 'My Learning Plans:'}</span>
                    <span className="font-medium">{stats.learningPlans}</span>
                  </div>
                  {isAdmin && (
                    <div className="flex justify-between">
                      <span>Total Users:</span>
                      <span className="font-medium">{stats.totalUsers}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>System Status:</span>
                    <span className="text-green-600 font-medium">Operational</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, hasPermission, permissions, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
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
    institution: ""
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
  const [deleteConfirmContact, setDeleteConfirmContact] = useState<Contact | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

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
        institution: ""
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
    
    try {
      const token = authService.getAuthToken();
      if (!token) {
        toast({
          title: "Error Updating Contact",
          description: "Not authenticated. Please log in again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      const response = await fetch('/api/contacts', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          id: editingContact.id,
          name: editingContact.name,
          department: editingContact.department,
          designation: editingContact.designation,
          phone_number: editingContact.phone_number,
          extension: editingContact.extension,
          email: editingContact.email,
          location: editingContact.location,
          institution: editingContact.institution
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Error Updating Contact",
          description: result.error || "Failed to update contact",
          variant: "destructive"
        });
      } else if (result.data) {
        setContacts(contacts.map(c => c.id === result.data.id ? result.data : c));
        setEditingContact(null);
        toast({
          title: "Contact Updated",
          description: "Contact information has been successfully updated"
        });
      }
    } catch (error) {
      toast({
        title: "Error Updating Contact",
        description: error instanceof Error ? error.message : "Failed to update contact",
        variant: "destructive"
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
    setDeleteConfirmContact(null);
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
    setBulkDeleteConfirm(false);
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.id));
    }
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
    console.log('🔄 Bulk update starting...', { selectedContacts, updates });
    const { data, error } = await contactService.updateMultipleContacts(selectedContacts, updates);
    
    console.log('📊 Bulk update result:', { data, error });
    
    if (error) {
      console.error('❌ Bulk update error:', error);
      toast({
        title: "Error Updating Contacts",
        description: String(error) || "Failed to update selected contacts",
        variant: "destructive"
      });
    } else if (data && data.length > 0) {
      console.log(`✅ Bulk update successful: ${data.length} contacts updated`);
      // Update the contacts in state
      const updatedContactsMap = new Map(data.map(c => [c.id, c]));
      setContacts(contacts.map(c => updatedContactsMap.get(c.id) || c));
      setSelectedContacts([]);
      setBulkEditData({ department: "", location: "", institution: "" });
      toast({
        title: "Bulk Update Complete",
        description: `${data.length} contacts have been updated`
      });
      // Reload contacts to ensure fresh data
      await loadContacts();
    } else {
      console.warn('⚠️ Bulk update returned no data');
      toast({
        title: "Update Issue",
        description: "Update may have succeeded but no data returned. Refreshing...",
        variant: "default"
      });
      // Reload contacts anyway
      await loadContacts();
      setSelectedContacts([]);
      setBulkEditData({ department: "", location: "", institution: "" });
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

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Settings className="w-7 h-7" />
                </div>
                {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
              </h1>
              <p className="text-cyan-100 text-lg ml-15">
                Manage contacts, bulk operations, and bioinformatics extensions
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => router.push('/search')}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all"
              >
                <Search className="w-4 h-4 mr-2" />
                Search Directory
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/home')}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button 
                onClick={async () => {
                  await authService.logout();
                  router.push('/');
                }}
                className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-lg"
              >
                <User className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="contacts" className="space-y-6">
          <TabsList className={`grid w-full bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-lg border-2 border-blue-200 ${
            isAdmin ? 'grid-cols-6' : 'grid-cols-3'
          }`}>
            {hasPermission('canViewContacts') && (
              <TabsTrigger 
                value="contacts"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all"
              >
                Contact Management
              </TabsTrigger>
            )}
            {hasPermission('canBulkOperations') && (
              <TabsTrigger 
                value="bulk"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all"
              >
                Bulk Operations
              </TabsTrigger>
            )}
            {hasPermission('canViewPatentableIdeas') && (
              <TabsTrigger 
                value="patents"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all"
              >
                Patentable Ideas
              </TabsTrigger>
            )}
            {hasPermission('canViewStudyPlans') && (
              <TabsTrigger 
                value="learning"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all"
              >
                Study Plans
              </TabsTrigger>
            )}
            {hasPermission('canViewUserManagement') && (
              <TabsTrigger 
                value="user-management"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all"
              >
                User Management
              </TabsTrigger>
            )}
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-gray-700 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Contact Management Tab - Admin Only */}
          {hasPermission('canViewContacts') && (
            <TabsContent value="contacts" className="space-y-6">
            {/* Statistics Dashboard */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 border-cyan-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-cyan-700 mb-1">Total Contacts</p>
                      <p className="text-3xl font-bold text-cyan-900">{contacts.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-100 border-emerald-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700 mb-1">Selected</p>
                      <p className="text-3xl font-bold text-emerald-900">{selectedContacts.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <Edit className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 border-violet-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-violet-700 mb-1">Departments</p>
                      <p className="text-3xl font-bold text-violet-900">
                        {new Set(contacts.map(c => c.department).filter(d => d)).size}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Add/Edit Contact Form */}
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    {editingContact ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {editingContact ? "Edit Contact" : "Add New Contact"}
                  </CardTitle>
                  <CardDescription className="text-cyan-50">
                    {editingContact ? "Update contact information" : "Fill in the details to add a new contact"}
                  </CardDescription>
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
                          placeholder="DR. PRASHANT BHAT"
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
                          <Button onClick={updateContact} className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md" disabled={loading}>
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Update Contact
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingContact(null)}
                            disabled={loading}
                            className="border-2 border-gray-300 hover:bg-gray-100"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button onClick={addContact} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md" disabled={loading}>
                          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                          Add Contact
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 text-white">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Bulk Update
                    </CardTitle>
                  </div>
                  <CardDescription className="text-indigo-50">
                    Update multiple contacts at once
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Bulk Update Section */}
                  <div className={`p-5 rounded-xl transition-all duration-300 ${
                    selectedContacts.length > 0 
                      ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 shadow-md' 
                      : 'bg-gray-50 border-2 border-gray-200'
                  }`}>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedContacts.length > 0 ? 'bg-blue-500' : 'bg-gray-400'
                      }`}>
                        <Edit className="w-4 h-4 text-white" />
                      </div>
                      <span className={selectedContacts.length > 0 ? 'text-blue-900' : 'text-gray-700'}>
                        Bulk Update
                      </span>
                      <span className={`ml-auto text-sm font-normal px-3 py-1 rounded-full ${
                        selectedContacts.length > 0 ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {selectedContacts.length} selected
                      </span>
                    </h4>
                    {selectedContacts.length === 0 ? (
                      <p className="text-sm text-gray-500">Select contacts below to enable bulk update</p>
                    ) : (
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
                        <Button onClick={updateSelectedContacts} disabled={loading} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md">
                          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Edit className="w-4 h-4 mr-2" />}
                          Update Selected
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-xl border-0 lg:col-span-2 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-700 via-gray-700 to-zinc-800 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Contact Directory ({contacts.length})
                      </CardTitle>
                      <CardDescription className="text-slate-300">
                        Select contacts for bulk operations or edit individually
                      </CardDescription>
                    </div>
                    <div className="flex gap-2 items-center">
                      {contacts.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleSelectAll}
                          disabled={loading}
                          className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
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
                      )}
                      {selectedContacts.length > 0 && (
                        <Button 
                          variant="destructive" 
                          onClick={() => setBulkDeleteConfirm(true)}
                          disabled={loading}
                          className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-lg"
                        >
                          {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                          Delete Selected ({selectedContacts.length})
                        </Button>
                      )}
                    </div>
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
                        contacts.map((contact) => {
                          const initials = contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                          const isSelected = selectedContacts.includes(contact.id);
                          return (
                          <div 
                            key={contact.id} 
                            className={`group flex items-center gap-4 p-4 border-2 rounded-xl transition-all duration-200 hover:shadow-lg ${
                              isSelected 
                                ? 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-md' 
                                : 'border-gray-200 bg-white hover:border-cyan-300 hover:shadow-md'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedContacts([...selectedContacts, contact.id]);
                                } else {
                                  setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                                }
                              }}
                              disabled={loading}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                            
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                              {initials}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">{contact.name}</div>
                              <div className="flex items-center gap-2 mt-1 text-sm">
                                {contact.department && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 border border-violet-200">
                                    <Building2 className="w-3 h-3 mr-1" />
                                    {contact.department}
                                  </span>
                                )}
                                <span className="inline-flex items-center text-gray-600">
                                  <Phone className="w-3 h-3 mr-1" />
                                  Ext: {contact.extension}
                                  </span>
                              </div>
                              {contact.email && (
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                  <Mail className="w-3 h-3" />
                                  {contact.email}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingContact(contact)}
                                disabled={loading}
                                className="hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 hover:border-cyan-400 transition-all"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteConfirmContact(contact)}
                                disabled={loading}
                                className="hover:bg-gradient-to-r hover:from-rose-50 hover:to-red-50 hover:text-red-700 hover:border-red-400 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        );})
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          )}

          {/* Bulk Operations Tab - Admin Only */}
          {hasPermission('canBulkOperations') && (
            <TabsContent value="bulk">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Bulk Upload Card */}
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-300 via-lavender-300 to-violet-300 text-gray-800">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Bulk Upload
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    Upload contacts via CSV file with duplicate detection
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    disabled={loading}
                    className="hidden"
                  />
                  <Button 
                    onClick={() => document.getElementById('csvFile')?.click()}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-400 to-violet-400 hover:from-purple-500 hover:to-violet-500 text-white shadow-md h-12"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {selectedFile ? selectedFile.name : 'Choose CSV File to Upload'}
                  </Button>

                  {/* CSV Preview and Upload Button */}
                  {csvPreview && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-blue-900 mb-1">
                            File Preview: {selectedFile?.name}
                          </p>
                          <p className="text-sm text-blue-700">
                            {csvPreview.contacts.length} contacts ready to upload
                          </p>
                          {csvPreview.errors.length > 0 && (
                            <p className="text-sm text-red-600 mt-1">
                              ⚠️ {csvPreview.errors.length} errors found
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={handleBulkUpload}
                        disabled={loading || csvPreview.errors.length > 0 || csvPreview.contacts.length === 0}
                        className="w-full mt-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-md"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload {csvPreview.contacts.length} Contacts
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {uploadProgress && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                        <p className="font-medium text-amber-900">{uploadProgress.stage}</p>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-amber-700 mt-1">
                        {uploadProgress.current} / {uploadProgress.total} contacts
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 font-medium mb-1">CSV Format:</p>
                    <p className="text-xs text-gray-600">Name, Department, Designation, Phone Number, Extension, Email, Location, Institution</p>
                    <p className="text-xs text-gray-500 mt-2">Max size: 5MB • Duplicate detection enabled</p>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const sampleData = [
                          ['Name', 'Department', 'Designation', 'Phone Number', 'Extension', 'Email', 'Location', 'Institution'],
                          ['John Doe', 'IT Department', 'Senior Developer', '022-12345678', '101', 'john.doe@actrec.gov.in', 'Mumbai', 'ACTREC'],
                          ['Jane Smith', 'HR Department', 'HR Manager', '022-87654321', '102', 'jane.smith@actrec.gov.in', 'Mumbai', 'ACTREC'],
                          ['', '', '', '', '', '', '', '']
                        ];
                        const csv = sampleData.map(row => row.join(',')).join('\n');
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'sample_contacts_template.csv';
                        a.click();
                        window.URL.revokeObjectURL(url);
                      }}
                      className="w-full mt-3"
                    >
                      <Download className="w-3 h-3 mr-2" />
                      Download Sample CSV Template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Export Data Card */}
              <Card className="shadow-xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-300 via-lavender-300 to-violet-300 text-gray-800">
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Data
                  </CardTitle>
                  <CardDescription className="text-gray-700">
                    Download contact database as CSV file
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Button 
                    onClick={exportContacts} 
                    className="w-full bg-gradient-to-r from-purple-400 to-violet-400 hover:from-purple-500 hover:to-violet-500 text-white shadow-md h-12"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All Contacts ({contacts.length})
                  </Button>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 font-medium mb-1">Export Format:</p>
                    <p className="text-xs text-gray-600">CSV file with all contact fields included</p>
                    <p className="text-xs text-gray-500 mt-2">Compatible for bulk re-upload • Auto-download</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          )}

          {/* Patentable Ideas Tab */}
          {hasPermission('canViewPatentableIdeas') && (
            <TabsContent value="patents">
              <SimplePatentableIdeas 
                userEmail={user?.email || 'admin@actrec.gov.in'} 
                userRole={user?.role || 'regular'}
              />
            </TabsContent>
          )}

          {/* Learning Plans Tab */}
          {hasPermission('canViewStudyPlans') && (
            <TabsContent value="learning">
              <SimpleLearningPlans 
                userEmail={user?.email || 'admin@actrec.gov.in'} 
                userRole={user?.role || 'regular'}
              />
            </TabsContent>
          )}

          {/* User Management Tab - Admin Only */}
          {hasPermission('canViewUserManagement') && (
            <TabsContent value="user-management">
              <div>
                <UserManagement />
              </div>
            </TabsContent>
          )}



          {/* Settings Tab */}
          <TabsContent value="settings">
            {isAdmin ? (
              <AdminSettings />
            ) : (
              <SettingsTabContent user={user} isAdmin={isAdmin} />
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmContact} onOpenChange={() => setDeleteConfirmContact(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Confirm Delete
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong className="text-gray-900">{deleteConfirmContact?.name}</strong>?
                <br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteConfirmContact(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleteConfirmContact && deleteContact(deleteConfirmContact.id)}
              >
                Delete Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Confirm Bulk Delete
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong className="text-gray-900">{selectedContacts.length} contacts</strong>?
                <br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBulkDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={deleteSelectedContacts}
              >
                Delete All ({selectedContacts.length})
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
