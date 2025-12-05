-- =====================================================
-- ENABLE RLS AND ENSURE CORRECT POLICIES FOR CONTACTS
-- Created: 2025-12-05
-- Purpose: Fix RLS configuration to allow admins to manage contacts
-- =====================================================

-- Step 1: Enable RLS on contacts table (if not already enabled)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies on contacts table
DROP POLICY IF EXISTS "anon_read_contacts" ON contacts;
DROP POLICY IF EXISTS "authenticated_read_contacts" ON contacts;
DROP POLICY IF EXISTS "service_role_full_access_contacts" ON contacts;
DROP POLICY IF EXISTS "admin_manage_contacts" ON contacts;

-- Step 3: Create proper policies

-- Service role has full access (used by API routes via service_role_key)
CREATE POLICY "service_role_full_access_contacts"
ON contacts
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Anonymous users can read contacts (public directory)
CREATE POLICY "anon_read_contacts"
ON contacts
FOR SELECT
TO anon
USING (true);

-- Authenticated users can read all contacts
CREATE POLICY "authenticated_read_contacts"
ON contacts
FOR SELECT
TO authenticated
USING (true);

-- Admins can insert, update, delete (this may not be needed since service_role_key is used, but keeping for safety)
CREATE POLICY "admin_manage_contacts"
ON contacts
FOR ALL
TO authenticated
USING (
    COALESCE(current_setting('request.jwt.claims')::jsonb->>'role', '') = 'admin'
)
WITH CHECK (
    COALESCE(current_setting('request.jwt.claims')::jsonb->>'role', '') = 'admin'
);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'contacts';

-- List all policies on contacts table
SELECT
    tablename,
    policyname,
    permissive,
    roles,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'contacts'
ORDER BY policyname;
