-- Temporarily disable RLS for learning_plans and patentable_ideas to match contacts behavior

-- Disable RLS on learning_plans
ALTER TABLE learning_plans DISABLE ROW LEVEL SECURITY;

-- Disable RLS on patentable_ideas  
ALTER TABLE patentable_ideas DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on contacts to be consistent
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;