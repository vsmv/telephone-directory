-- Complete Database Schema for ACTREC Telephone Directory System
-- This script creates all necessary tables with proper columns and relationships

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CONTACTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    department VARCHAR(255),
    designation VARCHAR(255),
    location VARCHAR(255),
    extension VARCHAR(10),
    mobile VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_department ON contacts(department);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);

-- =====================================================
-- USER PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'regular' CHECK (role IN ('admin', 'regular')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);


-- =====================================================
-- LEARNING PLANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS learning_plans (
    email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed', 'archived')),
    target_completion_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (email, title)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_learning_plans_email ON learning_plans(email);
CREATE INDEX IF NOT EXISTS idx_learning_plans_category ON learning_plans(category);
CREATE INDEX IF NOT EXISTS idx_learning_plans_status ON learning_plans(status);
CREATE INDEX IF NOT EXISTS idx_learning_plans_created_at ON learning_plans(created_at);

-- =====================================================
-- PATENTABLE IDEAS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS patentable_ideas (
    email VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (email, title)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_patentable_ideas_email ON patentable_ideas(email);
CREATE INDEX IF NOT EXISTS idx_patentable_ideas_category ON patentable_ideas(category);
CREATE INDEX IF NOT EXISTS idx_patentable_ideas_status ON patentable_ideas(status);
CREATE INDEX IF NOT EXISTS idx_patentable_ideas_created_at ON patentable_ideas(created_at);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_learning_plans_updated_at BEFORE UPDATE ON learning_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_patentable_ideas_updated_at BEFORE UPDATE ON patentable_ideas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE patentable_ideas ENABLE ROW LEVEL SECURITY;

-- Contacts policies (accessible to authenticated users)
CREATE POLICY "Authenticated users can view contacts" ON contacts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert contacts" ON contacts FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update contacts" ON contacts FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete contacts" ON contacts FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- User profiles policies
CREATE POLICY "Authenticated users can view user_profiles" ON user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert user_profiles" ON user_profiles FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update user_profiles" ON user_profiles FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete user_profiles" ON user_profiles FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));



-- Learning plans policies (accessible to authenticated users)
CREATE POLICY "Authenticated users can view learning_plans" ON learning_plans FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert learning_plans" ON learning_plans FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update learning_plans" ON learning_plans FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete learning_plans" ON learning_plans FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- Patentable ideas policies (accessible to authenticated users)
CREATE POLICY "Authenticated users can view patentable_ideas" ON patentable_ideas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert patentable_ideas" ON patentable_ideas FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update patentable_ideas" ON patentable_ideas FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete patentable_ideas" ON patentable_ideas FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Insert sample admin user
INSERT INTO user_profiles (email, role) VALUES ('admin@actrec.gov.in', 'admin') ON CONFLICT (email) DO NOTHING;


-- Insert sample contacts
INSERT INTO contacts (name, email, phone, department, designation, location, extension, mobile) VALUES 
('Dr. Rajesh Kumar', 'rajesh.kumar@actrec.gov.in', '022-27405000', 'Oncology', 'Senior Consultant', 'Main Building', '5001', '9876543210'),
('Dr. Priya Sharma', 'priya.sharma@actrec.gov.in', '022-27405001', 'Radiology', 'Associate Professor', 'Diagnostic Wing', '5002', '9876543211'),
('Mr. Amit Patel', 'amit.patel@actrec.gov.in', '022-27405002', 'Administration', 'Manager', 'Admin Block', '5003', '9876543212')
ON CONFLICT (email) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE contacts IS 'Employee contact directory for ACTREC';
COMMENT ON TABLE user_profiles IS 'User profiles with role-based access control';

COMMENT ON TABLE learning_plans IS 'Employee learning and development plans';
COMMENT ON TABLE patentable_ideas IS 'Research ideas and patent submissions';