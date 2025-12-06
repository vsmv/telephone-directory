# ACTREC Telephone Directory - Debug & Run Guide
## Supabase Staging Database Configuration

**Date:** December 5, 2025
**Environment:** Local Development → Staging Database → Vercel Deployment

---

## ✅ COMPLETED STEPS

### 1. Environment Configuration
- ✅ **Staging Database URL:** `https://pcrukmbtjyuuzwszsdsl.supabase.co`
- ✅ **Environment File:** `.env.local` created from `.env.staging`
- ✅ **Configuration:** Copied staging credentials to local environment

### 2. Test API Created
- ✅ **File:** `app/api/test-staging/route.ts`
- ✅ **Purpose:** Test Supabase staging database connection
- ✅ **Features:**
  - Connection test
  - Count contacts, users, learning plans, patentable ideas
  - Error handling
  - Detailed logging

---

## 🔧 NEXT STEPS TO COMPLETE

### Step 1: Install Dependencies
```cmd
cd "c:\D\Jeyarish Projects\Telephone Directory\telephone-directory-old"
npm install
```

**Expected Output:**
- Dependencies installed successfully
- No errors or warnings

### Step 2: Verify Environment Variables
```cmd
type .env.local
```

**Should contain:**
```
# Supabase Staging Configuration
NEXT_PUBLIC_SUPABASE_URL=https://pcrukmbtjyuuzwszsdsl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Run Development Server
```cmd
npm run dev
```

**Expected Output:**
```
> telephone-directory@1.0.0 dev
> next dev -p 3000

  ▲ Next.js 14.2.32
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### Step 4: Test Staging Database Connection
**Open in browser:** `http://localhost:3000/api/test-staging`

**Expected JSON Response:**
```json
{
  "success": true,
  "message": "Supabase Staging Database Connected Successfully",
  "database": {
    "url": "https://pcrukmbtjyuuzwszsdsl.supabase.co",
    "environment": "staging"
  },
  "statistics": {
    "contacts": 10,
    "users": 5,
    "learningPlans": 3,
    "patentableIdeas": 2
  },
  "errors": {
    "contacts": null,
    "users": null,
    "learningPlans": null,
    "patentableIdeas": null
  },
  "timestamp": "2025-12-05T07:54:42.000Z"
}
```

### Step 5: Test Main Application
**Open in browser:** `http://localhost:3000`

**Expected:**
- Landing page loads successfully
- Purple/violet gradient background
- Three action cards visible:
  1. 🔐 User Login
  2. 🔍 Search Directory
  3. ⚙️ Admin Dashboard

### Step 6: Test Authentication
**Navigate to:** `http://localhost:3000/auth/login`

**Test Credentials:**
- **Admin:** `admin` / `admin123`
- **Regular User:** `user` / `user123`

**Expected:**
- Successful login
- Redirect to dashboard
- User session maintained

### Step 7: Test Search Functionality
**Navigate to:** `http://localhost:3000/search`

**Test Searches:**
1. Search for "Doctor"
2. Search for "Medical"
3. Search for email pattern "@actrec.gov.in"
4. Search for extension "5042"

**Expected:**
- Real-time search results
- Contact cards display correctly
- All fields visible (name, dept, designation, phone, email, location)

### Step 8: Test Admin Dashboard (Admin Login Required)
**Navigate to:** `http://localhost:3000/dashboard`

**Test Features:**
1. **Contact Management:**
   - Add new contact
   - Edit existing contact
   - Delete contact
   - Bulk select contacts

2. **Bulk Operations:**
   - Upload CSV file
   - Export contacts to CSV
   - Duplicate detection

3. **Bioinformatics Extension:**
   - Add patentable idea
   - Create learning plan
   - View stored ideas/plans

**Expected:**
- All CRUD operations work
- Data persists to staging database
- No errors in console

---

## 🧪 TESTING CHECKLIST

### Database Connection Tests
- [ ] Staging database connects successfully
- [ ] All tables accessible (contacts, user_profiles, learning_plans, patentable_ideas)
- [ ] Row counts return correctly
- [ ] No RLS policy errors

### Frontend Tests
- [ ] Landing page loads
- [ ] Navigation works
- [ ] Responsive design (desktop/mobile)
- [ ] No console errors

### Authentication Tests
- [ ] Admin login works
- [ ] Regular user login works
- [ ] Session persists
- [ ] Logout works
- [ ] Password reset (if implemented)

### Contact Management Tests
- [ ] View all contacts
- [ ] Add single contact
- [ ] Edit contact
- [ ] Delete contact
- [ ] Bulk select
- [ ] Bulk edit
- [ ] Bulk delete

### Search Tests
- [ ] Basic search works
- [ ] Wildcard search works
- [ ] Multi-field search works
- [ ] Real-time results (500ms debounce)
- [ ] Case-insensitive search

### Bulk Operations Tests
- [ ] CSV upload works
- [ ] Duplicate detection works
- [ ] CSV export works
- [ ] File format validation

### Bioinformatics Tests
- [ ] Add patentable idea
- [ ] View patentable ideas
- [ ] Add learning plan
- [ ] View learning plans
- [ ] Data encryption (verify in DB)

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: "npm install" fails
**Solution:**
```cmd
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Issue 2: Port 3000 already in use
**Solution:**
```cmd
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

### Issue 3: Database connection fails
**Solution:**
1. Verify `.env.local` has correct staging URL
2. Check Supabase dashboard for database status
3. Verify anon key is correct
4. Check RLS policies in Supabase

### Issue 4: Build errors
**Solution:**
```cmd
# Clear Next.js cache
rmdir /s /q .next

# Rebuild
npm run build
```

### Issue 5: TypeScript errors
**Solution:**
```cmd
# Check TypeScript configuration
npx tsc --noEmit

# Fix type errors in reported files
```

---

## 📊 PERFORMANCE BENCHMARKS

### Expected Performance:
- **Page Load:** < 2 seconds
- **Search Response:** < 500ms
- **API Response:** < 200ms
- **Database Query:** < 100ms

### Monitoring:
- Check browser DevTools Network tab
- Monitor console for warnings
- Check Supabase dashboard for query performance

---

## 🚀 DEPLOYMENT WORKFLOW

### After Local Testing Passes:

#### 1. Commit Changes to GitHub
```cmd
git status
git add .
git commit -m "Debug: Verified staging database connection and all features"
git push origin main
```

#### 2. Verify GitHub Sync
- Check: https://github.com/vsmv/telephone-directory
- Ensure latest commit is visible
- Verify all files synced

#### 3. Deploy to Vercel
**Option A: Automatic (if connected)**
- Vercel auto-deploys on push to main
- Check Vercel dashboard for deployment status

**Option B: Manual**
```cmd
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy
vercel --prod
```

#### 4. Configure Vercel Environment Variables
In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://pcrukmbtjyuuzwszsdsl.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `[staging anon key]`
3. Redeploy if needed

#### 5. Test Production Deployment
- Visit Vercel URL
- Test all features
- Verify staging database connection
- Check for any production-specific issues

---

## 📝 TESTING SCRIPT

### Automated Test Commands:
```cmd
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Run comprehensive admin tests
npm run test:e2e:comprehensive

# Run with coverage
npm run test:coverage

# Run quality checks
npm run quality:all
```

### Manual Testing Checklist:
1. ✅ Landing page loads
2. ✅ Login (admin & regular user)
3. ✅ Search functionality
4. ✅ Add contact
5. ✅ Edit contact
6. ✅ Delete contact
7. ✅ Bulk upload CSV
8. ✅ Export CSV
9. ✅ Add patentable idea
10. ✅ Create learning plan
11. ✅ Logout

---

## 🔐 SECURITY CHECKLIST

- [ ] Environment variables not committed to Git
- [ ] `.env.local` in `.gitignore`
- [ ] Staging database RLS policies enabled
- [ ] Admin routes protected
- [ ] HTTPS enforced (Vercel automatic)
- [ ] No sensitive data in console logs
- [ ] JWT tokens properly validated
- [ ] SQL injection protection (Supabase automatic)

---

## 📞 SUPPORT

### If Issues Persist:
1. Check console for errors (F12 in browser)
2. Check terminal for server errors
3. Check Supabase logs in dashboard
4. Review this debug guide
5. Check GitHub issues: https://github.com/vsmv/telephone-directory/issues

### Documentation:
- **README.md** - Project overview
- **DESIGN-DOCUMENT.md** - Architecture details
- **USER-MANUAL.md** - Feature documentation
- **This file** - Debug & deployment guide

---

## ✅ SUCCESS CRITERIA

### Local Development:
- ✅ Server runs on http://localhost:3000
- ✅ Staging database connected
- ✅ All features functional
- ✅ No console errors
- ✅ All tests pass

### Production Deployment:
- ✅ Deployed to Vercel
- ✅ Synced with GitHub
- ✅ Staging database connected
- ✅ All features functional
- ✅ HTTPS enabled
- ✅ Performance acceptable

---

**Last Updated:** December 5, 2025, 1:24 PM IST
**Status:** Ready for local testing
**Next Step:** Run `npm install` and `npm run dev`
