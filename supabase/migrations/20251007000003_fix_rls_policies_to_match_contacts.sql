-- Fix RLS policies for learning_plans and patentable_ideas to match contacts pattern

-- Drop existing policies for learning_plans
DROP POLICY IF EXISTS "Users can view their own learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Users can insert their own learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Users can update their own learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Users can delete their own learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Authenticated users can view learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Authenticated users can insert learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Authenticated users can update learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Authenticated users can delete learning_plans" ON learning_plans;

-- Create new policies for learning_plans that match contacts pattern
CREATE POLICY "Authenticated users can view learning_plans" ON learning_plans
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert learning_plans" ON learning_plans
    FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can update learning_plans" ON learning_plans
    FOR UPDATE TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can delete learning_plans" ON learning_plans
    FOR DELETE TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ));

-- Drop existing policies for patentable_ideas
DROP POLICY IF EXISTS "Users can view their own patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Users can insert their own patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Users can update their own patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Users can delete their own patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Authenticated users can view patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Authenticated users can insert patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Authenticated users can update patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Authenticated users can delete patentable_ideas" ON patentable_ideas;

-- Create new policies for patentable_ideas that match contacts pattern
CREATE POLICY "Authenticated users can view patentable_ideas" ON patentable_ideas
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert patentable_ideas" ON patentable_ideas
    FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can update patentable_ideas" ON patentable_ideas
    FOR UPDATE TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can delete patentable_ideas" ON patentable_ideas
    FOR DELETE TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ));