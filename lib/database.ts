import { supabase } from './supabase';
import type { Database } from './supabase';

export type Contact = Database['public']['Tables']['contacts']['Row'];
export type ContactInsert = Database['public']['Tables']['contacts']['Insert'];
export type ContactUpdate = Database['public']['Tables']['contacts']['Update'];

// Additional types for bioinformatics features
export type PatentableIdea = {
  id: string;
  title: string;
  description: string;
  category: string;
  dateAdded: string;
};

export type LearningPlan = {
  id: string;
  title: string;
  description: string;
  category: string;
  dateAdded: string;
};

// Sample fallback data when Supabase is not configured - Single contact for production
const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'DR. PRASHANT BHAT',
    department: 'Medical Administration',
    designation: 'Doctor',
    phone_number: '-7671',
    extension: '5042',
    email: 'prashant.bhat@actrec.gov.in',
    location: 'Second Floor',
    institution: 'ACTREC',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Helper function to check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return url.includes('supabase.co') && !url.includes('your-project-ref') && 
         key.length > 20 && !key.includes('your-anon-key');
}

// Client-side search function for fallback data
function searchSampleContacts(searchTerm?: string): Contact[] {
  if (!searchTerm || !searchTerm.trim()) {
    return sampleContacts;
  }

  const term = searchTerm.trim().toLowerCase();
  
  // Process wildcard characters
  let searchPattern = term;
  
  if (term.includes('*') || term.includes('?')) {
    // Convert wildcards to regex patterns
    searchPattern = term
      .replace(/\*/g, '.*')  // * becomes .*
      .replace(/\?/g, '.');  // ? becomes .
  } else {
    // For regular search, add .* wildcards for partial matching
    searchPattern = `.*${term}.*`;
  }
  
  const regex = new RegExp(searchPattern, 'i');
  
  return sampleContacts.filter(contact => 
    regex.test(contact.name) ||
    regex.test(contact.department) ||
    regex.test(contact.designation) ||
    regex.test(contact.email) ||
    regex.test(contact.phone_number) ||
    regex.test(contact.extension) ||
    regex.test(contact.location) ||
    regex.test(contact.institution)
  );
}

// Contact Management Functions
export const contactService = {
  // Get all contacts with optional search and wildcard support
  async getContacts(searchTerm?: string) {
    // Use fallback data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using sample data');
      const data = searchSampleContacts(searchTerm);
      return { data, error: null };
    }

    try {
      let query = supabase
        .from('contacts')
        .select('*')
        .order('name');

      if (searchTerm && searchTerm.trim()) {
        const term = searchTerm.trim();
        
        // Process wildcard characters
        // * = match any characters, ? = match single character
        let searchPattern = term;
        
        // Handle wildcard patterns
        if (term.includes('*') || term.includes('?')) {
          // Convert wildcards to SQL LIKE patterns
          searchPattern = term
            .replace(/\*/g, '%')  // * becomes %
            .replace(/\?/g, '_'); // ? becomes _
        } else {
          // For regular search, add % wildcards for partial matching
          searchPattern = `%${term}%`;
        }
        
        // Search across all relevant fields with wildcard support
        query = query.or(
          `name.ilike.${searchPattern},` +
          `department.ilike.${searchPattern},` +
          `designation.ilike.${searchPattern},` +
          `email.ilike.${searchPattern},` +
          `phone_number.ilike.${searchPattern},` +
          `extension.ilike.${searchPattern},` +
          `location.ilike.${searchPattern},` +
          `institution.ilike.${searchPattern}`
        );
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching contacts:', error);
      // Fallback to sample data if Supabase query fails
      console.warn('Supabase query failed, using sample data');
      const data = searchSampleContacts(searchTerm);
      return { data, error: null };
    }
  },

  // Advanced search with multiple filters
  async searchContacts(filters: {
    name?: string;
    department?: string;
    designation?: string;
    email?: string;
    phone?: string;
    extension?: string;
    location?: string;
    institution?: string;
  }) {
    // Use fallback data if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, using sample data for advanced search');
      // For simplicity, use basic search on the first non-empty filter
      const firstFilter = Object.values(filters).find(f => f && f.trim());
      const data = searchSampleContacts(firstFilter);
      return { data, error: null };
    }

    try {
      let query = supabase
        .from('contacts')
        .select('*')
        .order('name');

      // Apply filters if provided
      if (filters.name) {
        const pattern = filters.name.includes('*') || filters.name.includes('?') 
          ? filters.name.replace(/\*/g, '%').replace(/\?/g, '_')
          : `%${filters.name}%`;
        query = query.ilike('name', pattern);
      }
      
      if (filters.department) {
        const pattern = filters.department.includes('*') || filters.department.includes('?')
          ? filters.department.replace(/\*/g, '%').replace(/\?/g, '_')
          : `%${filters.department}%`;
        query = query.ilike('department', pattern);
      }
      
      if (filters.designation) {
        const pattern = filters.designation.includes('*') || filters.designation.includes('?')
          ? filters.designation.replace(/\*/g, '%').replace(/\?/g, '_')
          : `%${filters.designation}%`;
        query = query.ilike('designation', pattern);
      }
      
      if (filters.email) {
        const pattern = filters.email.includes('*') || filters.email.includes('?')
          ? filters.email.replace(/\*/g, '%').replace(/\?/g, '_')
          : `%${filters.email}%`;
        query = query.ilike('email', pattern);
      }
      
      if (filters.phone) {
        const pattern = filters.phone.includes('*') || filters.phone.includes('?')
          ? filters.phone.replace(/\*/g, '%').replace(/\?/g, '_')
          : `%${filters.phone}%`;
        query = query.ilike('phone_number', pattern);
      }
      
      if (filters.extension) {
        const pattern = filters.extension.includes('*') || filters.extension.includes('?')
          ? filters.extension.replace(/\*/g, '%').replace(/\?/g, '_')
          : `%${filters.extension}%`;
        query = query.ilike('extension', pattern);
      }
      
      if (filters.location) {
        const pattern = filters.location.includes('*') || filters.location.includes('?')
          ? filters.location.replace(/\*/g, '%').replace(/\?/g, '_')
          : `%${filters.location}%`;
        query = query.ilike('location', pattern);
      }
      
      if (filters.institution) {
        const pattern = filters.institution.includes('*') || filters.institution.includes('?')
          ? filters.institution.replace(/\*/g, '%').replace(/\?/g, '_')
          : `%${filters.institution}%`;
        query = query.ilike('institution', pattern);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error searching contacts:', error);
      // Fallback to sample data if Supabase query fails
      const firstFilter = Object.values(filters).find(f => f && f.trim());
      const data = searchSampleContacts(firstFilter);
      return { data, error: null };
    }
  },

  // Get single contact by ID
  async getContact(id: string) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching contact:', error);
      return { data: null, error };
    }
  },

  // Create new contact
  async createContact(contact: ContactInsert) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert(contact)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating contact:', error);
      return { data: null, error };
    }
  },

  // Update single contact
  async updateContact(id: string, updates: ContactUpdate) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating contact:', error);
      return { data: null, error };
    }
  },

  // Delete single contact
  async deleteContact(id: string) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting contact:', error);
      return { error };
    }
  },

  // Delete multiple contacts
  async deleteMultipleContacts(ids: string[]) {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting multiple contacts:', error);
      return { error };
    }
  },

  // Update multiple contacts
  async updateMultipleContacts(ids: string[], updates: ContactUpdate) {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .in('id', ids)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating multiple contacts:', error);
      return { data: null, error };
    }
  },

  // FIXED: Bulk insert contacts with proper duplicate handling
  async bulkInsertContacts(contacts: ContactInsert[]) {
    console.log(`🔍 Processing ${contacts.length} contact(s) for duplicate detection`);
    
    // Use fallback logic if Supabase is not configured
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase not configured, using demo mode with sample data');
      
      const results = {
        inserted: [] as Contact[],
        skipped: [] as { contact: ContactInsert; reason: string }[]
      };

      for (const contact of contacts) {
        // Check for duplicates in sample data
        const isDuplicate = sampleContacts.some(existing => 
          existing.extension === contact.extension || existing.email === contact.email
        );

        if (isDuplicate) {
          const duplicateField = sampleContacts.find(existing => 
            existing.extension === contact.extension
          ) ? 'Extension' : 'Email';
          
          results.skipped.push({
            contact,
            reason: `Duplicate ${duplicateField}: ${duplicateField === 'Extension' ? contact.extension : contact.email} already exists`
          });
          console.log(`❌ Demo: Duplicate found - ${contact.name} (${duplicateField})`);
        } else {
          // Create a new contact with generated ID
          const newContact: Contact = {
            ...contact,
            id: `demo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          results.inserted.push(newContact);
          console.log(`✅ Demo: Added ${contact.name}`);
        }
      }

      console.log(`📊 Demo results: ${results.inserted.length} inserted, ${results.skipped.length} skipped`);
      return { data: results, error: null };
    }

    try {
      const results = {
        inserted: [] as Contact[],
        skipped: [] as { contact: ContactInsert; reason: string }[]
      };

      // Process each contact individually for proper duplicate detection
      for (const contact of contacts) {
        console.log(`🔍 Checking duplicates for: ${contact.name}`);
        
        // FIXED: Proper Supabase duplicate check query
        const { data: existingContacts, error: fetchError } = await supabase
          .from('contacts')
          .select('id, name, extension, email')
          .or(`extension.eq.${contact.extension},email.eq.${contact.email}`);

        if (fetchError) {
          console.error('❌ Error checking duplicates:', fetchError);
          results.skipped.push({
            contact,
            reason: `Database error: ${fetchError.message}`
          });
          continue;
        }

        // Check for duplicates
        if (existingContacts && existingContacts.length > 0) {
          const duplicateByExtension = existingContacts.find(existing => 
            existing.extension === contact.extension
          );
          const duplicateByEmail = existingContacts.find(existing => 
            existing.email === contact.email
          );
          
          let duplicateField = '';
          let duplicateValue = '';
          
          if (duplicateByExtension) {
            duplicateField = 'Extension';
            duplicateValue = contact.extension;
          } else if (duplicateByEmail) {
            duplicateField = 'Email';
            duplicateValue = contact.email;
          }
          
          results.skipped.push({
            contact,
            reason: `Duplicate ${duplicateField}: ${duplicateValue} already exists`
          });
          
          console.log(`❌ Duplicate found for ${contact.name}: ${duplicateField} = ${duplicateValue}`);
          continue;
        }

        // No duplicates found, insert the contact
        try {
          const { data: insertedContact, error: insertError } = await supabase
            .from('contacts')
            .insert({
              name: contact.name,
              department: contact.department,
              designation: contact.designation,
              phone_number: contact.phone_number,
              extension: contact.extension,
              email: contact.email,
              location: contact.location,
              institution: contact.institution,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (insertError) {
            console.error(`❌ Error inserting ${contact.name}:`, insertError);
            results.skipped.push({
              contact,
              reason: `Insert failed: ${insertError.message}`
            });
          } else if (insertedContact) {
            results.inserted.push(insertedContact);
            console.log(`✅ Successfully inserted: ${contact.name}`);
          }
        } catch (insertException) {
          console.error(`💥 Exception inserting ${contact.name}:`, insertException);
          results.skipped.push({
            contact,
            reason: `Insert exception: ${insertException instanceof Error ? insertException.message : 'Unknown error'}`
          });
        }
      }

      console.log(`📊 Final results: ${results.inserted.length} inserted, ${results.skipped.length} skipped`);
      return { data: results, error: null };
      
    } catch (error) {
      console.error('💥 Critical error in bulk insert:', error);
      return { data: null, error: `Bulk insert failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }
};

// Authentication service
export const authService = {
  // Get current user profile
  async getCurrentUserProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'No authenticated user' };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }
  },

  // Check if current user is admin
  async isAdmin() {
    const { data: profile } = await this.getCurrentUserProfile();
    return profile?.role === 'admin';
  },

  // Sign in with email/password (for demo purposes)
  async signInWithCredentials(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error };
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      return { error };
    }
  }
};

// CSV parsing utilities
export const csvService = {
  // Parse CSV data and validate headers
  parseCSVData(csvText: string): { contacts: ContactInsert[]; errors: string[] } {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const requiredHeaders = ['Name', 'Department', 'Designation', 'Phone Number', 'Extension', 'Email', 'Location', 'Institution'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      return {
        contacts: [],
        errors: [`Missing required headers: ${missingHeaders.join(', ')}`]
      };
    }

    const contacts: ContactInsert[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Invalid number of columns`);
        continue;
      }

      const contact: ContactInsert = {
        name: values[headers.indexOf('Name')] || '',
        department: values[headers.indexOf('Department')] || '',
        designation: values[headers.indexOf('Designation')] || '',
        phone_number: values[headers.indexOf('Phone Number')] || '',
        extension: values[headers.indexOf('Extension')] || '',
        email: values[headers.indexOf('Email')] || '',
        location: values[headers.indexOf('Location')] || '',
        institution: values[headers.indexOf('Institution')] || 'ACTREC'
      };

      // Validate required fields
      if (!contact.name || !contact.extension || !contact.email) {
        errors.push(`Row ${i + 1}: Missing required fields (Name, Extension, Email)`);
        continue;
      }

      contacts.push(contact);
    }

    return { contacts, errors };
  },

  // Generate CSV from contacts
  generateCSV(contacts: Contact[]): string {
    const headers = ['Name', 'Department', 'Designation', 'Phone Number', 'Extension', 'Email', 'Location', 'Institution'];
    const rows = contacts.map(contact => [
      contact.name,
      contact.department,
      contact.designation,
      contact.phone_number,
      contact.extension,
      contact.email,
      contact.location,
      contact.institution
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
};