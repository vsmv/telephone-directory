import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
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
        };
        Insert: {
          id?: string;
          name: string;
          department: string;
          designation: string;
          phone_number: string;
          extension: string;
          email: string;
          location: string;
          institution: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          department?: string;
          designation?: string;
          phone_number?: string;
          extension?: string;
          email?: string;
          location?: string;
          institution?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'regular';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'admin' | 'regular';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'regular';
          created_at?: string;
          updated_at?: string;
        };
      };
      bioinformatics_ideas: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: 'patentable' | 'learning_plan';
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: 'patentable' | 'learning_plan';
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: 'patentable' | 'learning_plan';
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};