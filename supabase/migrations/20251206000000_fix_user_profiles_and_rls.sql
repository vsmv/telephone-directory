-- =================================================================
-- FIX USER PROFILES TABLE AND RLS POLICIES
-- Created: 2025-12-06
-- Purpose: Correct the schema for user_profiles to link it to auth.users,
--          create a trigger to sync new users, and implement
--          secure RLS policies for user profiles.
-- =================================================================

-- Step 1: Drop the existing user_profiles table.
-- This is a destructive action, but necessary because the primary key
-- and its relationship to auth.users is incorrect.
DROP TABLE IF EXISTS public.user_profiles;

-- Step 2: Re-create the user_profiles table with the correct schema.
-- The 'id' column now directly references 'auth.users.id', ensuring
-- data integrity. The ON DELETE CASCADE will automatically remove a
-- user's profile if their auth record is deleted.
CREATE TABLE public.user_profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'regular' NOT NULL CHECK (role IN ('admin', 'regular')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments for documentation
COMMENT ON TABLE public.user_profiles IS 'Stores user-specific public data, including roles, linked to authentication records.';

-- Step 3: Create a trigger function to automatically create a user profile
-- for new sign-ups. This is a critical step for keeping auth and user
-- data in sync.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'regular'); -- New users default to 'regular'
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Attach the trigger to the auth.users table.
-- This trigger will fire after a new user is created.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Re-insert seed data for admin and test users.
-- This ensures that the essential users exist in the new table structure.
-- We manually specify the UUIDs to match existing auth users.
-- Replace the UUIDs with the actual UUIDs from your `auth.users` table.
-- You can get them by running: SELECT id, email FROM auth.users;

-- IMPORTANT: You MUST replace these placeholder UUIDs with the actual IDs
-- from your `auth.users` table for 'admin@actrec.gov.in' and 'user@actrec.gov.in'.
-- For now, we will assume these users exist and we can add them to the user_profiles table
-- This may fail if the user does not exist in auth.users table.

DO $$
DECLARE
  admin_id UUID;
  user_id UUID;
BEGIN
  -- Get the UUID of the admin user
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@actrec.gov.in';
  -- Get the UUID of the test user
  SELECT id INTO user_id FROM auth.users WHERE email = 'user@actrec.gov.in';

  -- Insert admin profile only if the user exists
  IF admin_id IS NOT NULL THEN
    INSERT INTO public.user_profiles (id, email, role)
    VALUES (admin_id, 'admin@actrec.gov.in', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  END IF;

  -- Insert regular user profile only if the user exists
  IF user_id IS NOT NULL THEN
    INSERT INTO public.user_profiles (id, email, role)
    VALUES (user_id, 'user@actrec.gov.in', 'regular')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;


-- Step 6: Enable Row Level Security (RLS) on the new table.
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 7: Create secure RLS policies for the user_profiles table.
-- Drop any old policies if they exist from a previous version
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role has full access" ON public.user_profiles;

-- Policy 1: Users can view their own profile.
-- The `auth.uid()` function provides the ID of the currently authenticated user.
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy 2: Admins can view all profiles.
-- This checks for the 'admin' role in the user's own profile.
CREATE POLICY "Admins can view all profiles"
  ON public.user_profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Policy 3: Allow service_role to bypass RLS.
-- This is crucial for server-side operations like the login route.
CREATE POLICY "Service role has full access"
  ON public.user_profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Step 8: Grant usage on schema and tables to necessary roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.user_profiles TO anon, authenticated, service_role;

-- =================================================================
-- VERIFICATION
-- =================================================================
-- 1. Check if RLS is enabled on user_profiles.
-- 2. List the policies for user_profiles to confirm they are correct.
-- =================================================================
