-- Add RLS policy for user_credentials table to allow service role access
-- This was missing from the original RLS policies migration

-- Service role has full access to user_credentials
CREATE POLICY IF NOT EXISTS "service_role_full_access_user_credentials"
ON user_credentials
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

COMMENT ON POLICY "service_role_full_access_user_credentials" ON user_credentials IS 
'CRITICAL: Only service role can access credentials - never expose to clients';
