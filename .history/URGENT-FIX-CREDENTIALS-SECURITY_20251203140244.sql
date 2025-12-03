-- =====================================================
-- QUICK FIX: Secure User Credentials Table
-- This addresses the immediate security risk
-- =====================================================

-- Drop all existing policies on user_credentials
DROP POLICY IF EXISTS "Admins can view user_credentials" ON user_credentials;
DROP POLICY IF EXISTS "Admins can insert user_credentials" ON user_credentials;
DROP POLICY IF EXISTS "Admins can update user_credentials" ON user_credentials;
DROP POLICY IF EXISTS "Admins can delete user_credentials" ON user_credentials;
DROP POLICY IF EXISTS "service_role_full_access_user_credentials" ON user_credentials;

-- Ensure RLS is enabled
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;

-- ONLY Service role can access credentials
CREATE POLICY "service_role_only_access"
ON user_credentials
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Verify - this should return 1 policy
SELECT 
    tablename,
    policyname,
    roles
FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'user_credentials';
