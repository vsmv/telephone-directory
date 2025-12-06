# GET SUPABASE SERVICE ROLE KEY - STEP BY STEP

## 🎯 Follow These Exact Steps

### 1. Open Supabase Dashboard
- Go to: https://supabase.com/dashboard
- Login if needed

### 2. Select Your Staging Project
- Click on your project: **pcrukmbtjyuuzwszsdsl**
- (The one with URL: https://pcrukmbtjyuuzwszsdsl.supabase.co)

### 3. Navigate to API Settings
- Click on the **Settings** icon (⚙️) in the left sidebar
- Click on **API** in the settings menu

### 4. Find the Service Role Key
- Scroll down to **Project API keys** section
- You'll see two keys:
  - `anon` `public` - This is already in your .env.local ✅
  - `service_role` `secret` - **THIS IS WHAT YOU NEED** ⬅️

### 5. Copy the Service Role Key
- Click the **copy icon** next to the `service_role` key
- It will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (very long)

### 6. Add to .env.local
- Open file: `c:\D\Jeyarish Projects\Telephone Directory\telephone-directory-old\.env.local`
- Add this line at the end:
  ```
  SUPABASE_SERVICE_ROLE_KEY=paste_your_copied_key_here
  ```

### 7. Your .env.local Should Look Like This:
```env
# Supabase Staging Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pcrukmbtjyuuzwszsdsl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcnVrbWJ0anl1dXp3c3pzZHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NTg0ODMsImV4cCI6MjA3MjAzNDQ4M30.iR_SFZiXYLVgeXvAMDo4H_SwVdrwaIWQtzI08UeaNYI
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_ACTUAL_SERVICE_ROLE_KEY_HERE
```

### 8. Restart Development Server
- In your terminal, press **Ctrl+C** to stop the server
- Wait 2 seconds
- Run: `npm run dev`

### 9. Test the Fix
- Go to: http://localhost:3000/dashboard
- Try adding a contact again
- Should work now! ✅

---

## ⚠️ SECURITY WARNING

**NEVER commit the service role key to Git!**
- It's already in `.gitignore` ✅
- Keep it secret
- Only use it server-side
- Don't share it publicly

---

## 🧪 Verify It's Working

After adding the key and restarting:

1. Visit: http://localhost:3000/api/debug-auth
   - Should show: `"hasServiceKey": true`

2. Try adding a contact in the dashboard
   - Should work without errors

3. Check terminal logs
   - Should NOT show the warning about missing service key

---

**Once you've added the key, let me know and we'll test everything!**
