-- =====================================================
-- ADD ADMIN POLICY FOR CONTACT MANAGEMENT
-- Created: 2025-12-05
-- Purpose: Allow admins to insert, update, and delete contacts
-- =====================================================

-- Drop existing admin policy if it exists
DROP POLICY IF EXISTS "admin_manage_contacts" ON contacts;

-- Create policy that allows admins to perform all operations on contacts
CREATE POLICY "admin_manage_contacts"
ON contacts
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- List all policies on contacts table to verify
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
