# 🔐 FIX ADMIN LOGIN - SERVICE ROLE KEY MISSING

## ❌ PROBLEM IDENTIFIED
The admin login is failing because the **SUPABASE_SERVICE_ROLE_KEY** is not configured in `.env.local`.

The login system uses Supabase Auth which requires the service role key for:
- User authentication
- Fetching user profiles
- Admin operations

---

## ✅ SOLUTION: Add Service Role Key

### Step 1: Get Service Role Key from Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your **staging project**: `pcrukmbtjyuuzwszsdsl`
3. Navigate to: **Project Settings** → **API**
4. Find the **service_role** key (NOT the anon key)
5. Copy the entire key

**Screenshot location in dashboard:**
```
Settings → API → Project API keys → service_role (secret)
```

⚠️ **IMPORTANT:** The service_role key is SECRET and should NEVER be committed to Git!

---

### Step 2: Update .env.local File

Open the file:
```
c:\D\Jeyarish Projects\Telephone Directory\telephone-directory-old\.env.local
```

Add this line (replace with your actual service role key):
```env
# Supabase Staging Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pcrukmbtjyuuzwszsdsl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTg0ODMsImV4cCI6MjA3MjAzNDQ4M30.iR_SFZiXYLVgeXvAMDo4H_SwVdrwaIWQtzI08UeaNYI

# Service Role Key - REQUIRED for authentication
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE
```

---

### Step 3: Restart Development Server

After updating `.env.local`:

```cmd
# Stop the current server (Ctrl+C in the terminal)
# Then restart:
npm run dev
```

---

## 🧪 VERIFY THE FIX

### Test 1: Check Environment Configuration
Visit: `http://localhost:3000/api/debug-auth`

**Expected Response:**
```json
{
  "success": true,
  "environment": {
    "hasUrl": true,
    "hasServiceKey": true,  ← Should be TRUE now
    "url": "https://pcrukmbtjyuuzwszsdsl.supabase.co"
  },
  "authUsers": {
    "count": X,
    "users": [...]
  }
}
```

### Test 2: Try Admin Login Again
Visit: `http://localhost:3000/auth/login`

**Try these credentials:**

**Option 1: Email-based login**
- Email: `admin@actrec.gov.in` (or whatever admin email exists)
- Password: `admin123`

**Option 2: Check what users exist**
First check the debug-auth API to see what email addresses are registered.

---

## 🔍 ALTERNATIVE: Check Existing Users

If you're not sure what credentials to use, let's check what users exist in the database.

### Option A: Via Supabase Dashboard
1. Go to Supabase Dashboard
2. Navigate to: **Authentication** → **Users**
3. See list of all registered users
4. Note their email addresses

### Option B: Via API
Visit: `http://localhost:3000/api/debug-auth`
This will show all users in the system.

---

## 📝 CREATE ADMIN USER (If Needed)

If no admin user exists in Supabase Auth, you need to create one:

### Method 1: Via Supabase Dashboard
1. Go to: **Authentication** → **Users**
2. Click **"Add user"**
3. Enter:
   - Email: `admin@actrec.gov.in`
   - Password: `admin123`
   - Auto Confirm User: ✅ YES
4. Click **"Create user"**

### Method 2: Via SQL (Supabase SQL Editor)
```sql
-- This will be handled by the application's signup flow
-- For now, use the dashboard method above
```

After creating the user in Auth, you also need to create a profile:

```sql
-- Insert into user_profiles table
INSERT INTO user_profiles (id, email, role)
VALUES (
  'USER_ID_FROM_AUTH',  -- Get this from the auth.users table
  'admin@actrec.gov.in',
  'admin'
);
```

---

## 🎯 QUICK FIX CHECKLIST

- [ ] Get service_role key from Supabase Dashboard
- [ ] Add SUPABASE_SERVICE_ROLE_KEY to .env.local
- [ ] Restart dev server (npm run dev)
- [ ] Test: http://localhost:3000/api/debug-auth
- [ ] Verify hasServiceKey: true
- [ ] Check what users exist
- [ ] Create admin user if needed (via Dashboard)
- [ ] Try login again

---

## 🚨 COMMON ISSUES

### Issue 1: "Invalid email or password"
**Causes:**
- User doesn't exist in Supabase Auth
- Wrong password
- Email mismatch (check case sensitivity)

**Solution:**
- Check debug-auth API to see existing users
- Create user via Supabase Dashboard
- Ensure user has matching profile in user_profiles table

### Issue 2: "User profile not found"
**Cause:** User exists in auth.users but not in user_profiles table

**Solution:**
```sql
-- Insert profile for existing auth user
INSERT INTO user_profiles (id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'admin@actrec.gov.in';
```

### Issue 3: Service key still not working
**Cause:** Server hasn't restarted to pick up new environment variable

**Solution:**
- Fully stop the dev server (Ctrl+C)
- Wait 2 seconds
- Restart: npm run dev

---

## 📞 NEXT STEPS

1. **Add the service role key to .env.local**
2. **Restart the server**
3. **Visit http://localhost:3000/api/debug-auth** to check configuration
4. **Report back what you see** - I'll help you create the admin user if needed

---

**File to edit:** `.env.local`
**Line to add:** `SUPABASE_SERVICE_ROLE_KEY=your_actual_key_here`
**Where to get key:** Supabase Dashboard → Project Settings → API → service_role

Let me know once you've added the key and restarted the server!
