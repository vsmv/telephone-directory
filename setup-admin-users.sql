-- Setup Admin Users for RBAC
-- Run this script in Supabase SQL Editor to create admin users

-- 1. Update existing user to admin role
-- Replace 'your-email@actrec.gov.in' with the actual admin email
UPDATE user_profiles 
SET role = 'admin', 
    updated_at = NOW()
WHERE email = 'admin@actrec.gov.in';

-- 2. Verify the update
SELECT id, email, role, created_at, updated_at 
FROM user_profiles 
WHERE role = 'admin';

-- 3. If you need to create a new admin user (optional)
-- Uncomment and modify the following:
/*
INSERT INTO user_profiles (id, email, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'newadmin@actrec.gov.in',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE 
SET role = 'admin', updated_at = NOW();
*/

-- 4. View all users and their roles
SELECT 
  email, 
  role,
  created_at,
  CASE 
    WHEN role = 'admin' THEN '👑 Admin'
    WHEN role = 'regular' THEN '👤 Regular User'
    ELSE '❓ Unknown'
  END as role_display
FROM user_profiles
ORDER BY role DESC, email;

-- 5. Count users by role
SELECT 
  role,
  COUNT(*) as user_count
FROM user_profiles
GROUP BY role
ORDER BY role;
