-- Allow anonymous users to read learning_plans and patentable_ideas
-- This enables the public pages to display data without authentication

-- Add anon read policies for learning_plans
CREATE POLICY "Anonymous users can view learning_plans" 
ON learning_plans
FOR SELECT 
TO anon 
USING (true);

-- Add anon read policies for patentable_ideas
CREATE POLICY "Anonymous users can view patentable_ideas" 
ON patentable_ideas
FOR SELECT 
TO anon 
USING (true);

-- Add anon read policies for contacts (if not already present)
DROP POLICY IF EXISTS "Anonymous users can view contacts" ON contacts;
CREATE POLICY "Anonymous users can view contacts" 
ON contacts
FOR SELECT 
TO anon 
USING (true);
