-- Fix phone_number NOT NULL constraint
-- This allows contacts to be created without phone numbers

ALTER TABLE contacts ALTER COLUMN phone_number DROP NOT NULL;

-- Verify the change
SELECT 
  column_name, 
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'contacts' 
AND column_name = 'phone_number';
