-- Temporarily disable RLS for learning_plans and patentable_ideas to test data access

-- Disable RLS on learning_plans
ALTER TABLE learning_plans DISABLE ROW LEVEL SECURITY;

-- Disable RLS on patentable_ideas  
ALTER TABLE patentable_ideas DISABLE ROW LEVEL SECURITY;

-- Also ensure contacts RLS is disabled for consistency
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;