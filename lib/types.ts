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

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'regular';
  created_at: string;
  updated_at: string;
}


export interface SearchFilters {
  query: string;
  department?: string;
  designation?: string;
  location?: string;
  institution?: string;
}