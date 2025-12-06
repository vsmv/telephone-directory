# 🔒 SECURE AUTHENTICATION SETUP GUIDE
## Proper Supabase Auth with RLS Policies

**CRITICAL:** The current login is a temporary workaround that bypasses security.  
This guide will help you set up proper authentication with full security.

---

## ⚠️ CURRENT SECURITY ISSUES

The temporary login implementation:
- ❌ Hardcoded credentials in code (NEVER do this in production!)
- ❌ No password verification for non-admin users
- ❌ Bypasses Supabase Auth
- ❌ Potentially bypasses RLS policies
- ❌ No audit trail

**This is ONLY for local testing. DO NOT deploy this to production!**

---

## ✅ PROPER SECURITY SETUP

### Step 1: Get Service Role Key from Supabase

1. Go to: https://supabase.com/dashboard
2. Select your staging project: `pcrukmbtjyuuzwszsdsl`
3. Navigate to: **Settings** → **API**
4. Find the **service_role** key (secret)
5. Copy the entire key

### Step 2: Add Service Role Key to .env.local

Edit: `c:\D\Jeyarish Projects\Telephone Directory\telephone-directory-old\.env.local`

Add this line:
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE
```

**⚠️ IMPORTANT:** 
- NEVER commit this to Git
- Keep it secret
- Only use server-side

### Step 3: Create Admin User in Supabase Auth

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to Supabase Dashboard
2. Navigate to: **Authentication** → **Users**
3. Click: **"Add user"** or **"Invite user"**
4. Enter:
   - **Email:** `jeyarish.venki@gmail.com`
   - **Password:** `Welcome123$`
   - **Auto Confirm User:** ✅ YES (check this box)
5. Click: **"Create user"** or **"Send invitation"**

#### Option B: Via Supabase SQL Editor

```sql
-- This creates the user in auth.users
-- Note: You cannot set passwords directly via SQL for security
-- Use the dashboard method above instead
```

### Step 4: Link Auth User to User Profile

After creating the user in Auth, link it to the profile:

```sql
-- Get the user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'jeyarish.venki@gmail.com';

-- Update the user_profiles table to use this ID
UPDATE user_profiles 
SET id = 'USER_ID_FROM_ABOVE'
WHERE email = 'jeyarish.venki@gmail.com';
```

**OR** if the trigger is working, the profile should be auto-created.

### Step 5: Restore Proper Login API

Replace the emergency login with the secure version:

```typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SignJWT } from 'jose';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    email = email.toLowerCase().trim();

    // Authenticate using Supabase Auth (SECURE)
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get user profile with RLS policies enforced
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = await new SignJWT({ 
      id: profile.id, 
      email: profile.email, 
      role: profile.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role
      },
      token
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 🔐 RLS POLICIES VERIFICATION

### Check Current RLS Status

Run this in Supabase SQL Editor:

```sql
-- Check if RLS is enabled on all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('contacts', 'user_profiles', 'learning_plans', 'patentable_ideas');

-- List all RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

### Expected RLS Policies

#### contacts table:
- ✅ Authenticated users can SELECT
- ✅ Admins can INSERT/UPDATE/DELETE
- ✅ Service role has full access

#### user_profiles table:
- ✅ Users can view their own profile
- ✅ Admins can view all profiles
- ✅ Service role has full access

#### learning_plans & patentable_ideas:
- ✅ Authenticated users can SELECT
- ✅ Authenticated users can INSERT their own
- ✅ Users can UPDATE/DELETE their own
- ✅ Admins can do everything

### Verify RLS is Working

Test with this API call:

```typescript
// This should FAIL if RLS is working (anon key can't access without auth)
const { data, error } = await supabase
  .from('user_profiles')
  .select('*');
// Expected: error due to RLS
```

---

## 🧪 TESTING SECURE AUTHENTICATION

### Test 1: Verify Service Role Key

Visit: `http://localhost:3000/api/debug-auth`

**Expected:**
```json
{
  "success": true,
  "environment": {
    "hasServiceKey": true  ← Must be TRUE
  },
  "authUsers": {
    "count": 1,
    "users": [
      {
        "email": "jeyarish.venki@gmail.com"
      }
    ]
  }
}
```

### Test 2: Test Secure Login

1. Logout (clear localStorage)
2. Go to: `http://localhost:3000/auth/login`
3. Login with: `jeyarish.venki@gmail.com` / `Welcome123$`
4. Should authenticate via Supabase Auth
5. Check browser console for logs

### Test 3: Verify RLS Policies

Try accessing data without authentication:

```javascript
// In browser console (should fail)
fetch('/api/contacts')
  .then(r => r.json())
  .then(console.log);
// Should return limited data or error due to RLS
```

---

## 📋 SECURITY CHECKLIST

Before deploying to production:

### Environment Security
- [ ] `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (NOT in Git)
- [ ] `.env.local` in `.gitignore`
- [ ] Service role key ONLY used server-side
- [ ] Anon key used client-side

### Authentication Security
- [ ] All users created in Supabase Auth
- [ ] Passwords hashed by Supabase (automatic)
- [ ] No hardcoded credentials in code
- [ ] JWT tokens with expiration
- [ ] Secure token storage (httpOnly cookies recommended)

### Database Security
- [ ] RLS enabled on all tables
- [ ] Policies tested and verified
- [ ] Service role bypasses RLS (for admin operations)
- [ ] Anon/authenticated roles have limited access
- [ ] No direct database access from client

### API Security
- [ ] All admin routes check user role
- [ ] Input validation on all endpoints
- [ ] Rate limiting (consider implementing)
- [ ] CORS configured properly
- [ ] HTTPS enforced (Vercel automatic)

### Audit & Monitoring
- [ ] Login attempts logged
- [ ] Failed login tracking
- [ ] Admin actions logged
- [ ] Error monitoring (Sentry/similar)

---

## 🚨 REMOVE EMERGENCY LOGIN

Once proper auth is working, **IMMEDIATELY** remove the hardcoded credentials:

```typescript
// DELETE THIS ENTIRE SECTION:
const EMERGENCY_ADMIN = {
  email: 'jeyarish.venki@gmail.com',
  password: 'Welcome123$'
};
```

---

## 🎯 DEPLOYMENT SECURITY

### For Vercel Deployment:

1. **Environment Variables:**
   - Add `SUPABASE_SERVICE_ROLE_KEY` in Vercel dashboard
   - Add `JWT_SECRET` (generate a strong random string)
   - Never expose these in client-side code

2. **Supabase Settings:**
   - Configure allowed domains in Supabase dashboard
   - Set up proper CORS
   - Enable email confirmations (optional)
   - Configure password requirements

3. **GitHub:**
   - Ensure `.env.local` is in `.gitignore`
   - Never commit secrets
   - Use GitHub Secrets for CI/CD

---

## 📞 NEXT STEPS

1. ✅ Get service role key from Supabase
2. ✅ Add to `.env.local`
3. ✅ Create admin user in Supabase Auth (via dashboard)
4. ✅ Restart dev server
5. ✅ Test secure login
6. ✅ Verify RLS policies
7. ✅ Remove emergency login code
8. ✅ Test all features
9. ✅ Deploy to Vercel with proper env vars

---

**REMEMBER:** Security is not optional. The current implementation is ONLY for local testing.  
Follow this guide to implement proper security before deploying to production.

**Last Updated:** December 5, 2025  
**Status:** Temporary emergency login active - MUST be replaced with secure auth
