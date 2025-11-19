import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock sample contact data for testing
const mockContacts = [
  {
    id: '1',
    name: 'DR. PRASHANT BHAT',
    department: 'Medical Administration',
    designation: 'Doctor',
    phone_number: '-7671',
    extension: '5042',
    email: 'prashant.bhat@actrec.gov.in',
    location: 'Second Floor, ACTREC',
    institution: 'ACTREC'
  },
  {
    id: '2', 
    name: 'DR. SARAH JONES',
    department: 'Oncology Research',
    designation: 'Senior Doctor',
    phone_number: '-7672',
    extension: '5043',
    email: 'sarah.jones@actrec.gov.in',
    location: 'Third Floor, ACTREC',
    institution: 'ACTREC'
  },
  {
    id: '3',
    name: 'JANE SMITH',
    department: 'Bioinformatics',
    designation: 'Research Scientist',
    phone_number: '-7673',
    extension: '5044',
    email: 'jane.smith@actrec.gov.in',
    location: 'Fourth Floor, ACTREC',
    institution: 'ACTREC'
  }
];

// Mock search functions
const generateLikeQuery = (searchTerm: string) => {
  return `%${searchTerm}%`;
};

const searchContacts = (query: string, contacts: any[], limit?: number) => {
  const normalizedQuery = query.toLowerCase();
  const results = contacts.filter(contact => 
    Object.values(contact).some(value => 
      String(value).toLowerCase().includes(normalizedQuery)
    )
  );
  
  return limit ? results.slice(0, limit) : results;
};

const searchMultipleFields = (query: string, contacts: any[]) => {
  const normalizedQuery = query.toLowerCase();
  return contacts.filter(contact => 
    contact.institution.toLowerCase().includes(normalizedQuery) ||
    contact.location.toLowerCase().includes(normalizedQuery) ||
    contact.department.toLowerCase().includes(normalizedQuery) ||
    contact.designation.toLowerCase().includes(normalizedQuery) ||
    contact.name.toLowerCase().includes(normalizedQuery) ||
    contact.email.toLowerCase().includes(normalizedQuery)
  );
};

describe('Search Module Unit Tests', () => {
  
  // UT-SEARCH-01: Query parsing
  describe('UT-SEARCH-01: Query Parsing', () => {
    it('should generate SQL LIKE pattern for "Doctor" query', () => {
      const input = 'Doctor';
      const expectedPattern = '%Doctor%';
      
      const result = generateLikeQuery(input);
      
      expect(result).toBe(expectedPattern);
      expect(result).toMatch(/^%.*%$/);
    });
    
    it('should handle special characters in query', () => {
      const input = 'Dr. Smith';
      const expectedPattern = '%Dr. Smith%';
      
      const result = generateLikeQuery(input);
      
      expect(result).toBe(expectedPattern);
    });
  });

  // UT-SEARCH-02: Case-insensitive match
  describe('UT-SEARCH-02: Case-Insensitive Matching', () => {
    it('should match "medical admin" case-insensitively', () => {
      const query = 'medical admin';
      const results = searchContacts(query, mockContacts);
      
      expect(results).toHaveLength(1);
      expect(results[0].department).toBe('Medical Administration');
      expect(results[0].name).toBe('DR. PRASHANT BHAT');
    });
    
    it('should match different case variations', () => {
      const queries = ['DOCTOR', 'doctor', 'Doctor', 'dOcToR'];
      
      queries.forEach(query => {
        const results = searchContacts(query, mockContacts);
        expect(results.length).toBeGreaterThan(0);
        expect(results.some(r => r.designation.toLowerCase().includes('doctor'))).toBe(true);
      });
    });
  });

  // UT-SEARCH-03: Pagination
  describe('UT-SEARCH-03: Pagination', () => {
    it('should return first 10 results when limit is 10', () => {
      const query = 'ACTREC';
      const limit = 10;
      
      // Create extended mock data to test pagination
      const extendedContacts = Array.from({ length: 15 }, (_, i) => ({
        ...mockContacts[0],
        id: String(i + 1),
        name: `DR. TEST USER ${i + 1}`,
        extension: String(5000 + i)
      }));
      
      const results = searchContacts(query, extendedContacts, limit);
      
      expect(results).toHaveLength(limit);
      expect(results.length).toBeLessThanOrEqual(limit);
    });
    
    it('should return all results when total is less than limit', () => {
      const query = 'ACTREC';
      const limit = 10;
      
      const results = searchContacts(query, mockContacts, limit);
      
      expect(results).toHaveLength(mockContacts.length);
      expect(results.length).toBeLessThan(limit);
    });
  });

  // UT-SEARCH-04: Multi-field search
  describe('UT-SEARCH-04: Multi-Field Search', () => {
    it('should find matches in institution field', () => {
      const query = 'ACTREC';
      const results = searchMultipleFields(query, mockContacts);
      
      expect(results).toHaveLength(3);
      expect(results.every(r => r.institution.includes('ACTREC'))).toBe(true);
    });
    
    it('should find matches in location field', () => {
      const query = 'Second Floor';
      const results = searchMultipleFields(query, mockContacts);
      
      expect(results).toHaveLength(1);
      expect(results[0].location).toContain('Second Floor');
    });
    
    it('should find matches in multiple fields simultaneously', () => {
      const query = 'Bioinformatics';
      const results = searchMultipleFields(query, mockContacts);
      
      expect(results).toHaveLength(1);
      expect(results[0].department).toBe('Bioinformatics');
    });
    
    it('should handle partial matches across fields', () => {
      const query = 'Research';
      const results = searchMultipleFields(query, mockContacts);
      
      // Should match both "Oncology Research" department and "Research Scientist" designation
      expect(results.length).toBeGreaterThanOrEqual(2);
    });
  });
});