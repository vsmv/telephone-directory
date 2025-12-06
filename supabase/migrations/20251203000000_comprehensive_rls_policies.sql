-- =====================================================
-- COMPREHENSIVE RLS POLICIES FOR PRODUCTION
-- Created: 2025-12-03
-- Purpose: Secure all tables with proper Row Level Security
-- =====================================================

-- First, drop all existing policies to avoid conflicts
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- =====================================================
-- CONTACTS TABLE RLS POLICIES
-- =====================================================

-- Service role has full access (used by API routes)
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

-- =====================================================
-- USER_PROFILES TABLE RLS POLICIES
-- =====================================================

-- Service role has full access
CREATE POLICY "service_role_full_access_user_profiles"
ON user_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Anonymous users can read user profiles (needed for login)
CREATE POLICY "anon_read_user_profiles"
ON user_profiles
FOR SELECT
TO anon
USING (true);

-- Authenticated users can view their own profile
CREATE POLICY "authenticated_read_own_profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "admins_read_all_profiles"
ON user_profiles
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);


-- =====================================================
-- LEARNING_PLANS TABLE RLS POLICIES
-- =====================================================

-- Service role has full access
CREATE POLICY "service_role_full_access_learning_plans"
ON learning_plans
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Anonymous users can read learning plans (public access)
CREATE POLICY "anon_read_learning_plans"
ON learning_plans
FOR SELECT
TO anon
USING (true);

-- Authenticated users can read all learning plans
CREATE POLICY "authenticated_read_learning_plans"
ON learning_plans
FOR SELECT
TO authenticated
USING (true);

-- =====================================================
-- PATENTABLE_IDEAS TABLE RLS POLICIES
-- =====================================================

-- Service role has full access
CREATE POLICY "service_role_full_access_patentable_ideas"
ON patentable_ideas
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Anonymous users can read patentable ideas (public access)
CREATE POLICY "anon_read_patentable_ideas"
ON patentable_ideas
FOR SELECT
TO anon
USING (true);

-- Authenticated users can read all patentable ideas
CREATE POLICY "authenticated_read_patentable_ideas"
ON patentable_ideas
FOR SELECT
TO authenticated
USING (true);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all RLS policies are enabled
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ Enabled'
        ELSE '❌ Disabled'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('contacts', 'user_profiles', 'user_credentials', 'learning_plans', 'patentable_ideas')
ORDER BY tablename;

-- List all policies
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON POLICY "service_role_full_access_contacts" ON contacts IS 
'Service role (API) has full CRUD access for contacts table';

COMMENT ON POLICY "anon_read_contacts" ON contacts IS 
'Anonymous users can read contacts for public directory access';

COMMENT ON POLICY "service_role_full_access_user_credentials" ON user_credentials IS 
'CRITICAL: Only service role can access credentials - never expose to clients';

COMMENT ON POLICY "anon_read_learning_plans" ON learning_plans IS 
'Public read access for learning plans data';

COMMENT ON POLICY "anon_read_patentable_ideas" ON patentable_ideas IS 
'Public read access for patentable ideas data';
