-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table first (as it's referenced by policies)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'regular' CHECK (role IN ('admin', 'regular')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table (as it's referenced by learning_plans and patentable_ideas)
CREATE TABLE contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    extension TEXT NOT NULL,
    email TEXT NOT NULL,
    location TEXT NOT NULL,
    institution TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(extension, email),
    UNIQUE(email)
);

-- Create learning_plans table
CREATE TABLE learning_plans (
    email TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('not-started', 'in-progress', 'completed', 'archived')),
    target_completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (email, title),
    FOREIGN KEY (email) REFERENCES contacts(email) ON DELETE CASCADE
);

-- Create patentable_ideas table
CREATE TABLE patentable_ideas (
    email TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (email, title),
    FOREIGN KEY (email) REFERENCES contacts(email) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_department ON contacts(department);
CREATE INDEX idx_contacts_designation ON contacts(designation);
CREATE INDEX idx_contacts_extension ON contacts(extension);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_search ON contacts USING gin(to_tsvector('english', name || ' ' || department || ' ' || designation || ' ' || email));
CREATE INDEX idx_learning_plans_email ON learning_plans(email);
CREATE INDEX idx_patentable_ideas_email ON patentable_ideas(email);

-- Create user profile creation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'regular');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE patentable_ideas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all user profiles" ON user_profiles
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND role = 'admin'
    ));

-- RLS Policies for contacts
CREATE POLICY "Authenticated users can view contacts" ON contacts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert contacts" ON contacts
    FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can update contacts" ON contacts
    FOR UPDATE TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ));

CREATE POLICY "Admins can delete contacts" ON contacts
    FOR DELETE TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role = 'admin'
    ));

-- RLS Policies for learning_plans
CREATE POLICY "Users can view learning plans" ON learning_plans
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage learning plans" ON learning_plans
    FOR ALL TO authenticated
    USING (email IN (
        SELECT email FROM contacts WHERE EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    ));

-- RLS Policies for patentable_ideas
CREATE POLICY "Users can view patentable ideas" ON patentable_ideas
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage patentable ideas" ON patentable_ideas
    FOR ALL TO authenticated
    USING (email IN (
        SELECT email FROM contacts WHERE EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    ));