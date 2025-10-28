-- Add status and target_completion_date columns to learning_plans if they don't exist
ALTER TABLE learning_plans
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'not-started',
ADD COLUMN IF NOT EXISTS target_completion_date DATE;

-- Update RLS policies for patentable_ideas
DROP POLICY IF EXISTS "Authenticated users can view patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Admins can insert patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Admins can update patentable_ideas" ON patentable_ideas;
DROP POLICY IF EXISTS "Admins can delete patentable_ideas" ON patentable_ideas;

CREATE POLICY "Users can view their own patentable_ideas" ON patentable_ideas
    FOR SELECT USING (auth.email() = email);

CREATE POLICY "Users can insert their own patentable_ideas" ON patentable_ideas
    FOR INSERT WITH CHECK (auth.email() = email);

CREATE POLICY "Users can update their own patentable_ideas" ON patentable_ideas
    FOR UPDATE USING (auth.email() = email);

CREATE POLICY "Users can delete their own patentable_ideas" ON patentable_ideas
    FOR DELETE USING (auth.email() = email);

-- Update RLS policies for learning_plans
DROP POLICY IF EXISTS "Authenticated users can view learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Admins can insert learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Admins can update learning_plans" ON learning_plans;
DROP POLICY IF EXISTS "Admins can delete learning_plans" ON learning_plans;

CREATE POLICY "Users can view their own learning_plans" ON learning_plans
    FOR SELECT USING (auth.email() = email);

CREATE POLICY "Users can insert their own learning_plans" ON learning_plans
    FOR INSERT WITH CHECK (auth.email() = email);

CREATE POLICY "Users can update their own learning_plans" ON learning_plans
    FOR UPDATE USING (auth.email() = email);

CREATE POLICY "Users can delete their own learning_plans" ON learning_plans
    FOR DELETE USING (auth.email() = email);
