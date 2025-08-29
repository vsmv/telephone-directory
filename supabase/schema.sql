-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'regular' CHECK (role IN ('admin', 'regular')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
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
    
    -- Unique constraint on extension and email combination
    UNIQUE(extension, email)
);



-- Create indexes for better performance
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_department ON contacts(department);
CREATE INDEX idx_contacts_designation ON contacts(designation);
CREATE INDEX idx_contacts_extension ON contacts(extension);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_search ON contacts USING gin(to_tsvector('english', name || ' ' || department || ' ' || designation || ' ' || email));

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'regular');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample data
INSERT INTO contacts (name, department, designation, phone_number, extension, email, location, institution) VALUES
('DR. PRASHANT BHAT', 'Medical Administration', 'Doctor', '-7671', '5042', 'prashant.bhat@actrec.gov.in', 'Second Floor', 'ACTREC'),
('MRS. PRAGATI', 'Medical Administration', 'MS Office', '-7671', '5674', 'pragati@actrec.gov.in', 'Second Floor', 'ACTREC'),
('DR. RAJESH KUMAR', 'Oncology Research', 'Senior Researcher', '-7672', '5100', 'rajesh.kumar@actrec.gov.in', 'Third Floor', 'ACTREC'),
('MS. PRIYA SHARMA', 'IT Department', 'System Administrator', '-7673', '5200', 'priya.sharma@actrec.gov.in', 'First Floor', 'ACTREC'),
('DR. ANITA DESAI', 'Bioinformatics', 'Principal Investigator', '-7674', '5300', 'anita.desai@actrec.gov.in', 'Fourth Floor', 'ACTREC');

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies for contacts (all authenticated users can read, only admins can modify)
CREATE POLICY "Authenticated users can view contacts" ON contacts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert contacts" ON contacts
    FOR INSERT TO authenticated 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update contacts" ON contacts
    FOR UPDATE TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete contacts" ON contacts
    FOR DELETE TO authenticated 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

