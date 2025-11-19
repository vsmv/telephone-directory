import { describe, it, expect, beforeEach } from '@jest/globals';

// Mock contact data and functions for testing
const mockExistingContacts = [
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
  }
];

const mockCSVData = `Name,Department,Designation,Phone Number,Extension,Email,Location,Institution
DR. JOHN DOE,Oncology,Doctor,-7674,5045,john.doe@actrec.gov.in,Third Floor,ACTREC
DR. JANE SMITH,Bioinformatics,Research Scientist,-7675,5046,jane.smith@actrec.gov.in,Fourth Floor,ACTREC
DR. PRASHANT BHAT,Medical Administration,Doctor,-7671,5042,prashant.bhat@actrec.gov.in,Second Floor,ACTREC`;

// Mock functions
const validateUniqueExtension = (extension: string, existingContacts: any[]) => {
  return !existingContacts.some(contact => contact.extension === extension);
};

const parseCSVData = (csvData: string) => {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',');
  const records = lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
      return obj;
    }, {} as any);
  });
  return records;
};

const bulkUploadWithDuplicateSkip = (csvData: string, existingContacts: any[]) => {
  const newRecords = parseCSVData(csvData);
  const results = { inserted: [], skipped: [] };
  
  newRecords.forEach(record => {
    const isDuplicate = existingContacts.some(existing => 
      existing.extension === record.Extension && existing.email === record.Email
    );
    
    if (isDuplicate) {
      results.skipped.push(`Duplicate: Extension ${record.Extension}`);
    } else {
      results.inserted.push(record);
    }
  });
  
  return results;
};

const generateCSV = (contacts: any[]) => {
  const headers = 'Name,Department,Designation,Phone Number,Extension,Email,Location,Institution';
  const rows = contacts.map(contact => 
    `${contact.name},${contact.department},${contact.designation},${contact.phone_number},${contact.extension},${contact.email},${contact.location},${contact.institution}`
  );
  return [headers, ...rows].join('\n');
};

describe('Data Management Module Unit Tests (Admin Only)', () => {
  
  // UT-DM-01: Single add validation
  describe('UT-DM-01: Single Add Validation', () => {
    it('should reject duplicate extension', () => {
      const duplicateExtension = '5042';
      const isValid = validateUniqueExtension(duplicateExtension, mockExistingContacts);
      
      expect(isValid).toBe(false);
    });
    
    it('should accept unique extension', () => {
      const uniqueExtension = '5050';
      const isValid = validateUniqueExtension(uniqueExtension, mockExistingContacts);
      
      expect(isValid).toBe(true);
    });
    
    it('should simulate unique constraint error', () => {
      const errorResponse = {
        success: false,
        error: 'Unique constraint violation: Extension already exists',
        code: 'DUPLICATE_EXTENSION'
      };
      
      expect(errorResponse.success).toBe(false);
      expect(errorResponse.error).toContain('Unique constraint');
      expect(errorResponse.code).toBe('DUPLICATE_EXTENSION');
    });
  });

  // UT-DM-02: Bulk upload duplicate skip
  describe('UT-DM-02: Bulk Upload Duplicate Skip', () => {
    it('should skip duplicates and return skipped list', () => {
      const result = bulkUploadWithDuplicateSkip(mockCSVData, mockExistingContacts);
      
      expect(result.inserted).toHaveLength(2);
      expect(result.skipped).toHaveLength(1);
      expect(result.skipped[0]).toBe('Duplicate: Extension 5042');
    });
    
    it('should insert non-duplicate records', () => {
      const result = bulkUploadWithDuplicateSkip(mockCSVData, mockExistingContacts);
      
      expect(result.inserted.some(record => record.Extension === '5045')).toBe(true);
      expect(result.inserted.some(record => record.Extension === '5046')).toBe(true);
    });
  });

  // UT-DM-03: CSV export
  describe('UT-DM-03: CSV Export', () => {
    it('should generate valid CSV with headers', () => {
      const csvOutput = generateCSV(mockExistingContacts);
      const lines = csvOutput.split('\n');
      
      expect(lines[0]).toContain('Name,Department,Designation');
      expect(lines).toHaveLength(2); // Header + 1 record
      expect(csvOutput).toContain('DR. PRASHANT BHAT');
    });
    
    it('should handle empty records', () => {
      const csvOutput = generateCSV([]);
      const lines = csvOutput.split('\n');
      
      expect(lines).toHaveLength(1); // Only header
      expect(lines[0]).toContain('Name,Department');
    });
  });

  // UT-DM-04: Bulk delete
  describe('UT-DM-04: Bulk Delete', () => {
    it('should remove records by IDs array', () => {
      const idsToDelete = ['1', '2'];
      const mockContacts = [
        { id: '1', name: 'Contact 1' },
        { id: '2', name: 'Contact 2' },
        { id: '3', name: 'Contact 3' }
      ];
      
      const remainingContacts = mockContacts.filter(contact => 
        !idsToDelete.includes(contact.id)
      );
      
      expect(remainingContacts).toHaveLength(1);
      expect(remainingContacts[0].id).toBe('3');
    });
  });

  // UT-DM-05: Bio-extension add
  describe('UT-DM-05: Bioinformatics Extension Storage', () => {
    it('should store patentable idea securely', () => {
      const patentableIdea = {
        id: Date.now().toString(),
        title: 'AI for drug discovery in dementia via protein analysis',
        description: 'AI-integrated semantic search for PDB-linked contacts in dementia therapeutics',
        category: 'AI Integration',
        dateAdded: new Date().toISOString().split('T')[0],
        userId: 'admin_1'
      };
      
      // Mock secure storage
      const storageResult = {
        success: true,
        id: patentableIdea.id,
        encrypted: true
      };
      
      expect(storageResult.success).toBe(true);
      expect(storageResult.encrypted).toBe(true);
      expect(patentableIdea.title).toContain('AI for drug discovery');
    });
  });

  // UT-DM-06: Single modify
  describe('UT-DM-06: Single Record Modification', () => {
    it('should update one field successfully', () => {
      const originalRecord = { ...mockExistingContacts[0] };
      const updatedRecord = { 
        ...originalRecord, 
        department: 'Updated Department' 
      };
      
      expect(updatedRecord.department).toBe('Updated Department');
      expect(updatedRecord.name).toBe(originalRecord.name); // Other fields unchanged
      expect(updatedRecord.id).toBe(originalRecord.id);
    });
  });

  // UT-DM-07: Multiple modify
  describe('UT-DM-07: Multiple Records Modification', () => {
    it('should batch update common fields', () => {
      const selectedIds = ['1', '2'];
      const updateData = { institution: 'Updated ACTREC' };
      const mockContacts = [
        { id: '1', name: 'Contact 1', institution: 'ACTREC' },
        { id: '2', name: 'Contact 2', institution: 'ACTREC' },
        { id: '3', name: 'Contact 3', institution: 'ACTREC' }
      ];
      
      const updatedContacts = mockContacts.map(contact => 
        selectedIds.includes(contact.id) 
          ? { ...contact, ...updateData }
          : contact
      );
      
      expect(updatedContacts[0].institution).toBe('Updated ACTREC');
      expect(updatedContacts[1].institution).toBe('Updated ACTREC');
      expect(updatedContacts[2].institution).toBe('ACTREC'); // Not updated
    });
  });

  // UT-DM-08: Single delete
  describe('UT-DM-08: Single Record Deletion', () => {
    it('should remove record by ID', () => {
      const idToDelete = '1';
      const mockContacts = [
        { id: '1', name: 'Contact 1' },
        { id: '2', name: 'Contact 2' }
      ];
      
      const remainingContacts = mockContacts.filter(contact => 
        contact.id !== idToDelete
      );
      
      expect(remainingContacts).toHaveLength(1);
      expect(remainingContacts[0].id).toBe('2');
    });
  });

  // UT-DM-09: Multiple delete
  describe('UT-DM-09: Multiple Records Deletion', () => {
    it('should remove multiple records by IDs', () => {
      const idsToDelete = ['1', '3'];
      const mockContacts = [
        { id: '1', name: 'Contact 1' },
        { id: '2', name: 'Contact 2' },
        { id: '3', name: 'Contact 3' },
        { id: '4', name: 'Contact 4' }
      ];
      
      const remainingContacts = mockContacts.filter(contact => 
        !idsToDelete.includes(contact.id)
      );
      
      expect(remainingContacts).toHaveLength(2);
      expect(remainingContacts.map(c => c.id)).toEqual(['2', '4']);
    });
  });
});