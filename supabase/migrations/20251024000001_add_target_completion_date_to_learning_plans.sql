-- Add target_completion_date column to learning_plans table

ALTER TABLE learning_plans 
ADD COLUMN IF NOT EXISTS target_completion_date DATE;

-- Add comment for documentation
COMMENT ON COLUMN learning_plans.target_completion_date IS 'Target completion date for the learning plan';