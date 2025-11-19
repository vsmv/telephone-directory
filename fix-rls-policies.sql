-- Fix RLS policies to allow anonymous (public) read access
-- Run this in your Supabase SQL Editor

-- Allow anonymous users to view learning_plans
CREATE POLICY IF NOT EXISTS "Anonymous users can view learning_plans" 
ON learning_plans
FOR SELECT 
TO anon 
USING (true);

-- Allow anonymous users to view patentable_ideas
CREATE POLICY IF NOT EXISTS "Anonymous users can view patentable_ideas" 
ON patentable_ideas
FOR SELECT 
TO anon 
USING (true);

-- Allow anonymous users to view contacts
DROP POLICY IF EXISTS "Anonymous users can view contacts" ON contacts;
CREATE POLICY "Anonymous users can view contacts" 
ON contacts
FOR SELECT 
TO anon 
USING (true);

-- Verify policies
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename IN ('learning_plans', 'patentable_ideas', 'contacts')
ORDER BY tablename, policyname;
