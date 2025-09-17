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
      console.log('📖 Reading contacts from STAGING database');
      
      let query = supabase.from('contacts').select('*').order('name');
      
      // Apply search term filter
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,department.ilike.%${searchTerm}%,designation.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%,extension.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,institution.ilike.%${searchTerm}%`);
      }
      
      // Apply additional filters
      if (filters) {
        if (filters.department) {
          query = query.ilike('department', `%${filters.department}%`);
        }
        if (filters.designation) {
          query = query.ilike('designation', `%${filters.designation}%`);
        }
        if (filters.location) {
          query = query.ilike('location', `%${filters.location}%`);
        }
        if (filters.institution) {
          query = query.ilike('institution', `%${filters.institution}%`);
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Failed to read from STAGING database:', error);
        return { data: null, error: error.message };
      }
      
      console.log(`✅ Retrieved ${data?.length || 0} contacts from STAGING database`);
      return { data, error: null };
    } catch (error: any) {
      console.error('💥 STAGING database read error:', error);
      return { data: null, error: error.message };
    }
  }

  async createContact(contact: ContactInsert): Promise<{ data: Contact | null; error: string | null }> {
    try {
      console.log('➕ Creating contact in STAGING database:', contact.name);
      
      // Check for duplicate email
      const { data: emailExists } = await supabase
        .from('contacts')
        .select('id, name')
        .eq('email', contact.email)
        .limit(1);
      
      if (emailExists && emailExists.length > 0) {
        return { data: null, error: `Email ${contact.email} is already used by ${emailExists[0].name}` };
      }
      
      // Check for duplicate extension
      const { data: extensionExists } = await supabase
        .from('contacts')
        .select('id, name')
        .eq('extension', contact.extension)
        .limit(1);
      
      if (extensionExists && extensionExists.length > 0) {
        return { data: null, error: `Extension ${contact.extension} is already used by ${extensionExists[0].name}` };
      }

      // Default institution to ACTREC if empty
      const contactToInsert = {
        ...contact,
        institution: contact.institution || 'ACTREC'
      };

      // Create contact in STAGING database
      const { data, error } = await supabase
        .from('contacts')
        .insert([contactToInsert])
        .select()
        .single();
      
      if (error) {
        console.error('❌ Failed to create contact in STAGING database:', error);
        return { data: null, error: error.message };
      }

      // Auto-create user profile in STAGING database
      if (data) {
        const { error: userError } = await supabase
          .from('user_profiles')
          .insert([{
            id: data.id,
            email: contact.email,
            role: 'regular'
          }]);
        
        if (userError) {
          console.warn('⚠️ Failed to create user profile in STAGING database:', userError.message);
        } else {
          console.log('✅ User profile created in STAGING database');
        }
      }
      
      console.log('✅ Contact created successfully in STAGING database');
      return { data, error: null };
    } catch (error: any) {
      console.error('💥 STAGING database create error:', error);
      return { data: null, error: error.message };
    }
  }

  async updateContact(id: string, updates: Partial<ContactInsert>): Promise<{ data: Contact | null; error: string | null }> {
    try {
      console.log(`📝 Updating contact ${id} in STAGING database`);
      
      // Check for duplicate extension if extension is being updated
      if (updates.extension) {
        const { data: existing } = await supabase
          .from('contacts')
          .select('id, name')
          .eq('extension', updates.extension)
          .neq('id', id);
        
        if (existing && existing.length > 0) {
          return { data: null, error: `Extension ${updates.extension} is already used by ${existing[0].name}` };
        }
      }
      
      // Check for duplicate email if email is being updated
      if (updates.email) {
        const { data: existing } = await supabase
          .from('contacts')
          .select('id, name')
          .eq('email', updates.email)
          .neq('id', id);
        
        if (existing && existing.length > 0) {
          return { data: null, error: `Email ${updates.email} is already used by ${existing[0].name}` };
        }
      }
      
      const { data, error } = await supabase
        .from('contacts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('❌ Failed to update contact in STAGING database:', error);
        return { data: null, error: error.message };
      }
      
      console.log('✅ Contact updated successfully in STAGING database');
      return { data, error: null };
    } catch (error: any) {
      console.error('💥 STAGING database update error:', error);
      return { data: null, error: error.message };
    }
  }

  async deleteContact(id: string): Promise<{ error: string | null }> {
    try {
      console.log(`🗑️ Deleting contact ${id} from STAGING database`);
      
      // Delete from contacts table in STAGING database
      const { error: contactError } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (contactError) {
        console.error('❌ Failed to delete contact from STAGING database:', contactError);
        return { error: `Failed to delete contact: ${contactError.message}` };
      }

      // Also delete from user_profiles table in STAGING database
      const { error: userError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);
      
      if (userError) {
        console.warn('⚠️ Failed to delete user profile from STAGING database:', userError);
      }
      
      console.log('✅ Contact deleted successfully from STAGING database');
      return { error: null };
    } catch (error: any) {
      console.error('💥 STAGING database delete error:', error);
      return { error: `Failed to delete contact: ${error.message}` };
    }
  }

  async deleteMultipleContacts(ids: string[]): Promise<{ error: string | null }> {
    try {
      console.log(`🗑️ Deleting ${ids.length} contacts from STAGING database`);
      
      // Delete from contacts table in STAGING database
      const { error: contactError } = await supabase
        .from('contacts')
        .delete()
        .in('id', ids);
      
      if (contactError) {
        console.error('❌ Failed to delete contacts from STAGING database:', contactError);
        return { error: `Failed to delete contacts: ${contactError.message}` };
      }

      // Also delete from user_profiles table in STAGING database
      const { error: userError } = await supabase
        .from('user_profiles')
        .delete()
        .in('id', ids);
      
      if (userError) {
        console.warn('⚠️ Failed to delete user profiles from STAGING database:', userError);
      }
      
      console.log('✅ Multiple contacts deleted successfully from STAGING database');
      return { error: null };
    } catch (error: any) {
      console.error('💥 STAGING database bulk delete error:', error);
      return { error: `Failed to delete contacts: ${error.message}` };
    }
  }

  async updateMultipleContacts(ids: string[], updates: Partial<ContactInsert>): Promise<{ data: Contact[] | null; error: string | null }> {
    try {
      console.log(`📝 Updating ${ids.length} contacts in STAGING database`);
      
      // Check for duplicate extensions if extension is being updated
      if (updates.extension) {
        const { data: existing } = await supabase
          .from('contacts')
          .select('id, name')
          .eq('extension', updates.extension)
          .not('id', 'in', `(${ids.join(',')})`);
        
        if (existing && existing.length > 0) {
          return { data: null, error: `Extension ${updates.extension} is already used by ${existing[0].name}` };
        }
      }
      
      // Check for duplicate email if email is being updated
      if (updates.email) {
        const { data: existing } = await supabase
          .from('contacts')
          .select('id, name')
          .eq('email', updates.email)
          .not('id', 'in', `(${ids.join(',')})`);
        
        if (existing && existing.length > 0) {
          return { data: null, error: `Email ${updates.email} is already used by ${existing[0].name}` };
        }
      }

      const { data, error } = await supabase
        .from('contacts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .in('id', ids)
        .select();
      
      if (error) {
        console.error('❌ Failed to update contacts in STAGING database:', error);
        return { data: null, error: error.message };
      }
      
      console.log('✅ Multiple contacts updated successfully in STAGING database');
      return { data, error: null };
    } catch (error: any) {
      console.error('💥 STAGING database bulk update error:', error);
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