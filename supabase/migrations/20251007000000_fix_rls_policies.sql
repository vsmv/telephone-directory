-- Fix RLS policies for learning_plans and patentable_ideas to match contacts pattern

-- Update RLS policies for learning_plans
DROP POLICY IF EXISTS "Users can view their own learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Users can insert their own learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Users can update their own learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Users can delete their own learning_plans" ON learning_plans;

-- Create new policies that match the contacts pattern
CREATE POLICY "Authenticated users can view learning_plans" ON learning_plans
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert learning_plans" ON learning_plans
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update learning_plans" ON learning_plans
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete learning_plans" ON learning_plans
    FOR DELETE TO authenticated USING (true);

-- Update RLS policies for patentable_ideas
DROP POLICY IF EXISTS "Users can view their own patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Users can insert their own patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Users can update their own patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Users can delete their own patentable_ideas" ON patentable_ideas;

-- Create new policies that match the contacts pattern
CREATE POLICY "Authenticated users can view patentable_ideas" ON patentable_ideas
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert patentable_ideas" ON patentable_ideas
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update patentable_ideas" ON patentable_ideas
    FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete patentable_ideas" ON patentable_ideas
    FOR DELETE TO authenticated USING (true);