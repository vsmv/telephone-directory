-- Enable RLS on ALL tables and verify status
-- This fixes the "RLS is disabled" warning in Supabase

-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE patentable_ideas ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled on all tables
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ RLS Enabled'
        ELSE '❌ RLS Disabled'
    END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('contacts', 'user_profiles', 'user_credentials', 'learning_plans', 'patentable_ideas')
ORDER BY tablename;
