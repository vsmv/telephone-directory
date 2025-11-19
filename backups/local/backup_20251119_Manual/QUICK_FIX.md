# Quick Fix - Data Not Displaying

## The Problems Found
1. **Row Level Security (RLS)** blocks anonymous users from reading data
2. **Column name mismatch** - Code uses `date_added`/`last_modified` but database has `created_at`/`updated_at`

## Status
✅ **Code Fixed** - Column names corrected in TypeScript interfaces
⚠️ **Database Fix Needed** - RLS policies still block anonymous access

## The Fix (Choose One)

### Option A: Disable RLS (Fastest - 30 seconds)

1. Go to https://supabase.com/dashboard
2. Open your project
3. Click **SQL Editor** → **New Query**
4. Paste and run:

```sql
ALTER TABLE learning_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE patentable_ideas DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
```

5. Done! Refresh your app.

### Option B: Add Public Read Policy (Better for Production)

1. Go to https://supabase.com/dashboard
2. Open your project  
3. Click **SQL Editor** → **New Query**
4. Paste and run the SQL from `fix-rls-policies.sql`
5. Done! Refresh your app.

## Verify It Worked

```bash
node test-supabase-connection.js
```

Should show:
```
✅ Contacts: 5 records found
✅ Learning Plans: 5 records found  
✅ Patentable Ideas: 5 records found
```

## Why This Happened

Your RLS policies only allow **authenticated** users to read data, but your app uses the **anon** key without authentication.

## That's It!

No code changes needed. Just run the SQL and refresh your browser.
