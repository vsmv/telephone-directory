-- Fix schema issues found during testing

-- 1. Fix user_credentials table - add missing password_hash column
ALTER TABLE user_credentials 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- 2. Check if user_profiles ID should be UUID or if we need to update the test
-- (The table expects UUID but test was passing string)

-- 3. Verify cascade relationships are working (they are!)
-- The test confirmed CASCADE DELETE is working correctly

-- 4. Check current table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('contacts', 'user_profiles', 'user_credentials', 'learning_plans', 'patentable_ideas')
ORDER BY table_name, ordinal_position;