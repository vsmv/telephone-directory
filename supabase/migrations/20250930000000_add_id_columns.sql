-- Add id columns to learning_plans and patentable_ideas tables

-- Add id column to learning_plans
ALTER TABLE learning_plans 
ADD COLUMN id UUID DEFAULT uuid_generate_v4() UNIQUE;

-- Add id column to patentable_ideas  
ALTER TABLE patentable_ideas
ADD COLUMN id UUID DEFAULT uuid_generate_v4() UNIQUE;

-- Update existing records to have unique ids
UPDATE learning_plans SET id = uuid_generate_v4() WHERE id IS NULL;
UPDATE patentable_ideas SET id = uuid_generate_v4() WHERE id IS NULL;

-- Make id columns NOT NULL after updating existing records
ALTER TABLE learning_plans ALTER COLUMN id SET NOT NULL;
ALTER TABLE patentable_ideas ALTER COLUMN id SET NOT NULL;

-- Create indexes on the new id columns
CREATE INDEX idx_learning_plans_id ON learning_plans(id);
CREATE INDEX idx_patentable_ideas_id ON patentable_ideas(id);