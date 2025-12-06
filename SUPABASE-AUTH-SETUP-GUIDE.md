# 🔐 Supabase Authentication Setup Guide

## 📋 Current Status

✅ **Completed:**
- Migrated authentication system to pure Supabase Auth
- Updated login API to use `signInWithPassword`
- Created registration API endpoint
- Updated auth service with Supabase integration
- Created test scripts for validation

❌ **Issues Identified:**
- Service role key in `.env.local` is the same as anon key (incorrect)
- Existing users from issue documents don't exist in Supabase Auth
- User registration fails due to database configuration issues

## 🚀 Immediate Setup Required

### **Step 1: Get Correct Service Role Key**

1. Go to: https://supabase.com/dashboard/project/pcrukmbtjyuuzwszsdsl
2. Navigate to: **Settings** → **API**
3. Find the **Service Role Key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
4. Update your `.env.local` file:

```bash
# Replace this line with the actual service role key
SUPABASE_SERVICE_ROLE_KEY="your_actual_service_role_key_here"
```

### **Step 2: Create Admin User**

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to: **Authentication** → **Users**
2. Click **"Add user"**
3. Enter:
   - **Email**: `admin@actrec.gov.in`
   - **Password**: `Admin@123`
   - ✅ **Check**: "Auto Confirm User"
4. Click **"Create user"**
5. Note the **User ID** from the created user

#### Option B: Via API (After fixing service role key)

```bash
node scripts/create-test-user.js
```

### **Step 3: Create User Profile**

After creating the user in Supabase Auth, run this SQL in the Supabase SQL Editor:

```sql
-- Create admin profile for the new user
INSERT INTO user_profiles (id, email, role)
SELECT 
    id, 
    email, 
    'admin'
FROM auth.users 
WHERE email = 'admin@actrec.gov.in'
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin',
    updated_at = NOW();
```

### **Step 4: Test the Application**

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000

3. Login with:
   - **Email**: `admin@actrec.gov.in`
   - **Password**: `Admin@123`

## 🔧 Troubleshooting

### **Issue: "Database error saving new user"**

This indicates the `handle_new_user` trigger function may not be working. Solution:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this to check if the function exists:
   ```sql
   SELECT * FROM pg_proc WHERE proname = 'handle_new_user';
   ```

3. If it doesn't exist, run the schema setup from `supabase/schema.sql`

### **Issue: "Invalid login credentials"**

This means the user doesn't exist in Supabase Auth. Solutions:

1. **Check if user exists:**
   ```sql
   SELECT id, email, created_at, email_confirmed_at 
   FROM auth.users 
   WHERE email = 'your-email@example.com';
   ```

2. **Create user manually** (see Step 2 above)

3. **Check email confirmation:**
   - User must have `email_confirmed_at` not null
   - Or use "Auto Confirm User" when creating

### **Issue: Service Role Permissions**

If you get "User not allowed" errors:

1. Verify you're using the correct service role key
2. Check that the key has `service_role` in the JWT payload
3. Ensure the user exists in `auth.users`

## 📊 Architecture Overview

### **New Authentication Flow**

```
User Login → API Route (/api/auth/login) → Supabase Auth → User Profile → JWT Token → Client
```

### **Key Components**

1. **Frontend**: `lib/auth.ts` - Auth service and React hooks
2. **Backend**: `app/api/auth/login/route.ts` - Login API endpoint
3. **Backend**: `app/api/auth/register/route.ts` - Registration API endpoint
4. **Database**: `auth.users` + `user_profiles` tables

### **Security Features**

- ✅ Supabase Auth handles password hashing
- ✅ JWT tokens with proper expiration
- ✅ Row Level Security (RLS) policies
- ✅ Role-based access control
- ✅ Session management

## 🧪 Testing Scripts

### **Test Authentication Flow**
```bash
node scripts/test-auth-flow.js
```

### **Create Test Admin User**
```bash
node scripts/create-test-user.js
```

## 📝 Environment Variables Required

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pcrukmbtjyuuzwszsdsl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here  # ⚠️ MUST BE DIFFERENT FROM ANON_KEY

# Optional
JWT_SECRET=your_jwt_secret_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🎯 Next Steps After Setup

1. **Test login** with created admin user
2. **Verify dashboard access** and permissions
3. **Test user registration** via the application
4. **Run E2E tests** to validate full flow:
   ```bash
   npm run test:e2e
   ```

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js with Supabase](https://supabase.com/docs/guides/frameworks/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🚨 Important Notes

- **Never expose service role key** in client-side code
- **Always use auto-confirm** for development/testing
- **Keep your .env.local file** secure and never commit it
- **Test thoroughly** before deploying to production

Once you complete the setup above, the authentication system should work seamlessly with pure Supabase Auth! 🎉
