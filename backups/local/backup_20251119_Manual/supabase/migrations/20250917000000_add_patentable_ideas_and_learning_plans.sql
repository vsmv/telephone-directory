-- Check if tables exist and drop them if they do
DROP TABLE IF EXISTS public.patentable_ideas;
DROP TABLE IF EXISTS public.learning_plans;

-- Create PatentableIdeas table with email as foreign key
CREATE TABLE public.patentable_ideas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    category VARCHAR,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patentable_ideas_contact 
        FOREIGN KEY (email) 
        REFERENCES public.contacts(email)
        ON DELETE CASCADE
);

-- Create LearningPlans table with email as foreign key
CREATE TABLE public.learning_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    category VARCHAR,
    status VARCHAR DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Completed', 'On Hold')),
    target_completion_date DATE,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_learning_plans_contact 
        FOREIGN KEY (email) 
        REFERENCES public.contacts(email)
        ON DELETE CASCADE
);

-- Add indexes for better query performance
CREATE INDEX idx_patentable_ideas_email ON public.patentable_ideas(email);
CREATE INDEX idx_learning_plans_email ON public.learning_plans(email);

-- Create or replace function to update last_modified timestamp
CREATE OR REPLACE FUNCTION update_last_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for last_modified timestamp
DROP TRIGGER IF EXISTS update_patentable_ideas_last_modified ON public.patentable_ideas;
CREATE TRIGGER update_patentable_ideas_last_modified
    BEFORE UPDATE ON public.patentable_ideas
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified();

DROP TRIGGER IF EXISTS update_learning_plans_last_modified ON public.learning_plans;
CREATE TRIGGER update_learning_plans_last_modified
    BEFORE UPDATE ON public.learning_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified();

-- Add RLS (Row Level Security) policies
ALTER TABLE public.patentable_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for patentable_ideas
CREATE POLICY "Users can view their own patentable ideas"
    ON public.patentable_ideas
    FOR SELECT
    USING (auth.email() = email);

CREATE POLICY "Users can insert their own patentable ideas"
    ON public.patentable_ideas
    FOR INSERT
    WITH CHECK (auth.email() = email);

CREATE POLICY "Users can update their own patentable ideas"
    ON public.patentable_ideas
    FOR UPDATE
    USING (auth.email() = email);

CREATE POLICY "Users can delete their own patentable ideas"
    ON public.patentable_ideas
    FOR DELETE
    USING (auth.email() = email);

-- Create policies for learning_plans
CREATE POLICY "Users can view their own learning plans"
    ON public.learning_plans
    FOR SELECT
    USING (auth.email() = email);

CREATE POLICY "Users can insert their own learning plans"
    ON public.learning_plans
    FOR INSERT
    WITH CHECK (auth.email() = email);

CREATE POLICY "Users can update their own learning plans"
    ON public.learning_plans
    FOR UPDATE
    USING (auth.email() = email);

CREATE POLICY "Users can delete their own learning plans"
    ON public.learning_plans
    FOR DELETE
    USING (auth.email() = email);