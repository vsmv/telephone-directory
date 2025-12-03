import { supabase } from './supabase';

export interface Contact {
  id: string;
  name: string;
  department: string;
  designation: string;
  phone_number: string;
  extension: string;
  email: string;
  location: string;
  institution: string;
  created_at: string;
  updated_at: string;
}

export interface ContactInsert {
  name: string;
  department: string;
  designation: string;
  phone_number: string;
  extension: string;
  email: string;
  location: string;
  institution: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'regular';
  created_at: string;
  updated_at: string;
}

export interface UserProfileInsert {
  id: string;
  email: string;
  role?: 'admin' | 'regular';
}

// STAGING DATABASE SERVICE - ALL OPERATIONS USE STAGING DB ONLY
class ContactService {
  private async isConnected(): Promise<boolean> {
    try {
      console.log('🔍 Testing STAGING database connection...');
      const { data, error } = await supabase.from('contacts').select('count').limit(1);
      const connected = !error;
      console.log(connected ? '✅ STAGING database connected' : '❌ STAGING database disconnected');
      return connected;
    } catch {
      console.log('❌ STAGING database connection failed');
      return false;
    }
  }

  async getContacts(searchTerm?: string, filters?: { department?: string; designation?: string; location?: string; institution?: string }): Promise<{ data: Contact[] | null; error: string | null }> {
    try {
      console.log('📖 Reading contacts via API');
      
      const response = await fetch('/api/contacts');
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to fetch contacts' };
      }
      
      let data = result.data || [];
      
      // Apply client-side filtering if needed
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        data = data.filter((contact: Contact) => 
          contact.name.toLowerCase().includes(term) ||
          contact.department.toLowerCase().includes(term) ||
          contact.designation.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          contact.phone_number.toLowerCase().includes(term) ||
          contact.extension.toLowerCase().includes(term) ||
          contact.location.toLowerCase().includes(term) ||
          contact.institution.toLowerCase().includes(term)
        );
      }
      
      if (filters) {
        if (filters.department) {
          data = data.filter((contact: Contact) => 
            contact.department.toLowerCase().includes(filters.department!.toLowerCase())
          );
        }
        if (filters.designation) {
          data = data.filter((contact: Contact) => 
            contact.designation.toLowerCase().includes(filters.designation!.toLowerCase())
          );
        }
        if (filters.location) {
          data = data.filter((contact: Contact) => 
            contact.location.toLowerCase().includes(filters.location!.toLowerCase())
          );
        }
        if (filters.institution) {
          data = data.filter((contact: Contact) => 
            contact.institution.toLowerCase().includes(filters.institution!.toLowerCase())
          );
        }
      }
      
      console.log(`✅ Retrieved ${data.length} contacts via API`);
      return { data, error: null };
    } catch (error: any) {
      console.error('💥 API read error:', error);
      return { data: null, error: error.message };
    }
  }

  async createContact(contact: ContactInsert): Promise<{ data: Contact | null; error: string | null }> {
    try {
      console.log('➕ Creating contact via API:', contact.name);
      
      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { data: null, error: 'Not authenticated' };
      }
      
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(contact)
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to create contact' };
      }
      
      console.log('✅ Contact created successfully via API');
      return { data: result.data, error: null };
    } catch (error: any) {
      console.error('💥 API create error:', error);
      return { data: null, error: error.message };
    }
  }

  async updateContact(id: string, updates: Partial<ContactInsert>): Promise<{ data: Contact | null; error: string | null }> {
    try {
      console.log(`📝 Updating contact ${id} via API`);
      
      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { data: null, error: 'Not authenticated' };
      }
      
      const response = await fetch('/api/contacts', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ id, ...updates })
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to update contact' };
      }
      
      console.log('✅ Contact updated successfully via API');
      return { data: result.data, error: null };
    } catch (error: any) {
      console.error('💥 API update error:', error);
      return { data: null, error: error.message };
    }
  }

  async deleteContact(id: string): Promise<{ error: string | null }> {
    try {
      console.log(`🗑️ Deleting contact ${id} via API`);
      
      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { error: 'Not authenticated' };
      }
      
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      const result = await response.json();
      
      if (!response.ok) {
        return { error: result.error || 'Failed to delete contact' };
      }
      
      console.log('✅ Contact deleted successfully via API');
      return { error: null };
    } catch (error: any) {
      console.error('💥 API delete error:', error);
      return { error: `Failed to delete contact: ${error.message}` };
    }
  }

  async deleteMultipleContacts(ids: string[]): Promise<{ error: string | null }> {
    try {
      console.log(`🗑️ Deleting ${ids.length} contacts via API`);
      
      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { error: 'Not authenticated' };
      }
      
      const response = await fetch('/api/contacts/bulk', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ ids })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { error: result.error || 'Failed to delete contacts' };
      }
      
      console.log('✅ Multiple contacts deleted successfully via API');
      return { error: null };
    } catch (error: any) {
      console.error('💥 API bulk delete error:', error);
      return { error: `Failed to delete contacts: ${error.message}` };
    }
  }

  async updateMultipleContacts(ids: string[], updates: Partial<ContactInsert>): Promise<{ data: Contact[] | null; error: string | null }> {
    try {
      console.log(`📝 Updating ${ids.length} contacts via API`);
      
      // Get session token for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { data: null, error: 'Not authenticated' };
      }
      
      const response = await fetch('/api/contacts/bulk', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ ids, updates })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        return { data: null, error: result.error || 'Failed to update contacts' };
      }
      
      console.log('✅ Multiple contacts updated successfully via API');
      return { data: result.data, error: null };
    } catch (error: any) {
      console.error('💥 API bulk update error:', error);
      return { data: null, error: error.message };
    }
  }

  async bulkInsertContacts(contacts: ContactInsert[]): Promise<{ data: { inserted: Contact[]; skipped: any[] } | null; error: string | null }> {
    try {
      console.log(`📦 BULK INSERT: Processing ${contacts.length} contacts for STAGING database`);
      
      const inserted: Contact[] = [];
      const skipped: any[] = [];
      
      for (const contact of contacts) {
        // Check for duplicate email
        const { data: emailExists } = await supabase
          .from('contacts')
          .select('id, name')
          .eq('email', contact.email)
          .limit(1);
        
        // Check for duplicate extension
        const { data: extensionExists } = await supabase
          .from('contacts')
          .select('id, name')
          .eq('extension', contact.extension)
          .limit(1);
        
        if (emailExists && emailExists.length > 0) {
          console.log(`⚠️ Skipping duplicate email: ${contact.name} (${contact.email}) - already used by ${emailExists[0].name}`);
          skipped.push({
            contact,
            reason: `Email ${contact.email} is already used by ${emailExists[0].name}`
          });
        } else if (extensionExists && extensionExists.length > 0) {
          console.log(`⚠️ Skipping duplicate extension: ${contact.name} (Ext: ${contact.extension}) - already used by ${extensionExists[0].name}`);
          skipped.push({
            contact,
            reason: `Extension ${contact.extension} is already used by ${extensionExists[0].name}`
          });
        } else {
          // Default institution to ACTREC if empty
          const contactToInsert = {
            ...contact,
            institution: contact.institution || 'ACTREC'
          };

          // Insert into STAGING database
          const { data: newContact, error } = await supabase
            .from('contacts')
            .insert([contactToInsert])
            .select()
            .single();
          
          if (error) {
            console.error(`❌ Failed to insert ${contact.name} into STAGING database:`, error);
            skipped.push({
              contact,
              reason: `STAGING database error: ${error.message}`
            });
          } else if (newContact) {
            console.log(`✅ Inserted: ${contact.name} into STAGING database`);
            inserted.push(newContact);
            
            // Auto-create user profile in STAGING database
            const { error: userError } = await supabase
              .from('user_profiles')
              .insert([{
                id: newContact.id,
                email: contact.email,
                role: 'regular'
              }]);
            
            if (userError) {
              console.warn(`⚠️ Failed to create user profile for ${contact.email} in STAGING database:`, userError.message);
            }
          }
        }
      }
      
      console.log(`🎉 BULK INSERT COMPLETE: ${inserted.length} inserted, ${skipped.length} skipped in STAGING database`);
      return { data: { inserted, skipped }, error: null };
    } catch (error: any) {
      console.error('💥 STAGING database bulk insert error:', error);
      return { data: null, error: `STAGING database bulk insert failed: ${error.message}` };
    }
  }
}

class UserService {
  private async isConnected(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  async getUsers(): Promise<{ data: UserProfile[] | null; error: string | null }> {
    try {
      console.log('👥 Reading users from STAGING database');
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('email');
      
      if (error) {
        console.error('❌ Failed to read users from STAGING database:', error);
        return { data: null, error: error.message };
      }
      
      console.log(`✅ Retrieved ${data?.length || 0} users from STAGING database`);
      return { data, error: null };
    } catch (error: any) {
      console.error('💥 STAGING database user read error:', error);
      return { data: null, error: error.message };
    }
  }

  async updateUser(id: string, updates: Partial<UserProfileInsert>): Promise<{ data: UserProfile | null; error: string | null }> {
    try {
      console.log(`👤 Updating user ${id} in STAGING database`);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Failed to update user in STAGING database:', error);
        return { data: null, error: error.message };
      }
      
      console.log('✅ User updated successfully in STAGING database');
      return { data, error: null };
    } catch (error: any) {
      console.error('💥 STAGING database user update error:', error);
      return { data: null, error: error.message };
    }
  }
}

class CSVService {
  parseCSVData(csvText: string): { contacts: ContactInsert[]; errors: string[] } {
    const lines = csvText.split('\n').filter(line => line.trim());
    const contacts: ContactInsert[] = [];
    const errors: string[] = [];
    
    if (lines.length === 0) {
      errors.push('CSV file is empty');
      return { contacts, errors };
    }
    
    const header = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredFields = ['name', 'email', 'extension'];
    
    const missingFields = requiredFields.filter(field => !header.includes(field));
    if (missingFields.length > 0) {
      errors.push(`Missing required columns: ${missingFields.join(', ')}`);
      return { contacts, errors };
    }
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length !== header.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }
      
      const contact: ContactInsert = {
        name: '',
        department: '',
        designation: '',
        phone_number: '',
        extension: '',
        email: '',
        location: '',
        institution: ''
      };
      
      header.forEach((field, index) => {
        const value = values[index] || '';
        switch (field) {
          case 'name': contact.name = value; break;
          case 'department': contact.department = value; break;
          case 'designation': contact.designation = value; break;
          case 'phone_number': case 'phone': contact.phone_number = value; break;
          case 'extension': case 'ext': contact.extension = value; break;
          case 'email': contact.email = value; break;
          case 'location': contact.location = value; break;
          case 'institution': contact.institution = value; break;
        }
      });
      
      if (!contact.name || !contact.email || !contact.extension) {
        errors.push(`Row ${i + 1}: Missing required fields`);
        continue;
      }
      
      contacts.push(contact);
    }
    
    return { contacts, errors };
  }
  
  generateCSV(contacts: Contact[]): string {
    const headers = ['name', 'department', 'designation', 'phone_number', 'extension', 'email', 'location', 'institution'];
    const csvRows = [headers.join(',')];
    
    contacts.forEach(contact => {
      const row = headers.map(header => {
        const value = (contact as any)[header] || '';
        return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
      });
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }
}

// Export services that use STAGING database ONLY
export const contactService = new ContactService();
export const userService = new UserService();
export const csvService = new CSVService();

console.log('🚀 Database services initialized for STAGING database ONLY');
console.log('📍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);