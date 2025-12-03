-- Fix user_credentials RLS - Remove ALL policies and create ONLY service_role access
-- This ensures credentials are NEVER accessible to anonymous or authenticated users

-- First, disable RLS temporarily to drop all policies
ALTER TABLE user_credentials DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies (if any exist)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'user_credentials'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON user_credentials', r.policyname);
    END LOOP;
END $$;

-- Re-enable RLS
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;

-- Create ONLY service_role policy (no anon, no authenticated)
CREATE POLICY "service_role_full_access_user_credentials"
ON user_credentials
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Verify - should show ONLY 1 policy for user_credentials
SELECT 
    tablename,
    policyname,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_credentials'
ORDER BY policyname;

-- Verify RLS is enabled
SELECT 
    tablename,
    CASE WHEN rowsecurity THEN '✅ RLS Enabled' ELSE '❌ RLS Disabled' END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_credentials';
