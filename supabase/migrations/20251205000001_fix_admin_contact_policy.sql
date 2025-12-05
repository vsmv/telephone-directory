-- =====================================================
-- FIX ADMIN RLS POLICY FOR CONTACT MANAGEMENT
-- Created: 2025-12-05
-- Purpose: Allow admins to manage contacts via JWT role claim
-- =====================================================

-- Drop the problematic policy
DROP POLICY IF EXISTS "admin_manage_contacts" ON contacts;

-- Add an updated policy that checks JWT role directly
CREATE POLICY "admin_manage_contacts"
ON contacts
FOR ALL
TO authenticated
USING (
    current_setting('request.jwt.claims')::jsonb->>'role' = 'admin'
)
WITH CHECK (
    current_setting('request.jwt.claims')::jsonb->>'role' = 'admin'
);

-- =====================================================
-- VERIFICATION
-- =====================================================

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
