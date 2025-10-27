-- Add status column to patentable_ideas table
ALTER TABLE patentable_ideas
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'draft';

-- Add target_completion_date column to learning_plans if not exists (backup)
ALTER TABLE learning_plans
ADD COLUMN IF NOT EXISTS target_completion_date DATE;

-- Update existing records to have proper status values
UPDATE patentable_ideas
SET status = 'draft'
WHERE status IS NULL OR status = '';

-- Update existing records to have proper status values for learning_plans
UPDATE learning_plans
SET status = 'not-started'
WHERE status IS NULL OR status = '';
