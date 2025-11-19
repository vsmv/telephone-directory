-- ============================================================
-- FIX FOR DATA DISPLAY ISSUE
-- Run this in Supabase SQL Editor
-- ============================================================

-- This will allow your app to read data using the anonymous key
-- Choose ONE of the two options below:

-- ============================================================
-- OPTION 1: Disable RLS (Fastest - Recommended for Testing)
-- ============================================================
-- Uncomment these 3 lines to disable RLS:

-- ALTER TABLE learning_plans DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE patentable_ideas DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- OPTION 2: Add Anonymous Read Policies (Production Ready)
-- ============================================================
-- Uncomment these lines to add anon read policies:

-- CREATE POLICY IF NOT EXISTS "anon_read_learning_plans" 
-- ON learning_plans FOR SELECT TO anon USING (true);

-- CREATE POLICY IF NOT EXISTS "anon_read_patentable_ideas" 
-- ON patentable_ideas FOR SELECT TO anon USING (true);

-- CREATE POLICY IF NOT EXISTS "anon_read_contacts" 
-- ON contacts FOR SELECT TO anon USING (true);

-- ============================================================
-- INSTRUCTIONS:
-- 1. Choose Option 1 OR Option 2 (not both)
-- 2. Remove the -- from the lines you want to run
-- 3. Click "Run" or press Ctrl+Enter
-- 4. Run: node test-after-fix.js to verify
-- 5. Refresh your browser - data will appear!
-- ============================================================
