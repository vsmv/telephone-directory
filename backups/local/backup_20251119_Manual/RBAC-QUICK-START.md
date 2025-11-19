# RBAC Quick Start Guide

## What Was Implemented

Role-Based Access Control (RBAC) has been added to your ACTREC Telephone Directory application with the following rules:

### 🔐 Access Rules

#### Admin Users
- ✅ View ALL learning plans and patentable ideas (including other users')
- ✅ Create their own plans and ideas
- ✅ Edit/Delete ONLY their own plans and ideas
- ❌ Cannot edit/delete other users' plans and ideas
- ✅ Full access to contact management

#### Regular Users
- ✅ View ONLY their own learning plans and patentable ideas
- ✅ Create, edit, and delete their own plans and ideas
- ❌ Cannot see other users' plans and ideas
- ✅ Edit their own contact profile
- ❌ Cannot edit: Name, Extension, Email (locked fields)
- ✅ Can edit: Department, Designation, Phone, Location, Institution

## Setup Instructions

### Step 1: Create Admin Users

Run this SQL in Supabase SQL Editor:

```sql
-- Update existing user to admin
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@actrec.gov.in';

-- Verify
SELECT email, role FROM user_profiles WHERE role = 'admin';
```

Or use the provided script:
```bash
# Run in Supabase SQL Editor
cat setup-admin-users.sql
```

### Step 2: Test the Implementation

1. **Test as Admin:**
   - Login with admin email
   - Go to "Study Plans" or "Patentable Ideas" tab
   - You should see all users' items
   - Try to edit another user's item → Should show error
   - Edit your own item → Should succeed

2. **Test as Regular User:**
   - Login with regular user email
   - Go to "Study Plans" or "Patentable Ideas" tab
   - You should only see your own items
   - Edit/Delete buttons only appear on your items
   - Try editing your contact profile
   - Name, Extension, Email should be locked

### Step 3: Run Automated Tests

```bash
node test-rbac-implementation.js
```

This will verify:
- User roles are set correctly
- Data visibility rules work
- Ownership validation is in place

## Files Modified

### API Routes (Backend)
- `app/api/learning-plans/route.ts` - Added ownership checks
- `app/api/patentable-ideas/route.ts` - Added ownership checks
- `app/api/contacts/route.ts` - Added field restrictions

### Components (Frontend)
- `components/simple-learning-plans.tsx` - Auth tokens + conditional buttons
- `components/simple-patentable-ideas.tsx` - Auth tokens + conditional buttons

### Documentation
- `RBAC-IMPLEMENTATION-COMPLETE.md` - Full technical documentation
- `RBAC-QUICK-START.md` - This file
- `setup-admin-users.sql` - SQL script for admin setup
- `test-rbac-implementation.js` - Automated test script

## How It Works

### Authentication Flow
1. User logs in → Gets JWT token from Supabase
2. Frontend stores token in session
3. All API calls include `Authorization: Bearer <token>` header
4. Backend validates token and extracts user info
5. Backend checks user role and ownership
6. Returns data or error based on permissions

### Ownership Validation
```typescript
// Example: Editing a learning plan
1. User requests to edit plan with ID "abc123"
2. API checks: Does this plan belong to the user?
3. If plan.email === user.email → Allow edit
4. If plan.email !== user.email → Return 403 Forbidden
```

### Role-Based Filtering
```typescript
// Example: Fetching learning plans
1. User requests all learning plans
2. API checks user role
3. If admin → Return all plans
4. If regular → Return only plans where email = user.email
```

## Error Messages

- **401 Unauthorized**: Not logged in or invalid token
- **403 Forbidden**: Logged in but not allowed to perform action
- **404 Not Found**: Resource doesn't exist

## Security Features

✅ JWT token authentication on all API routes
✅ Ownership validation before updates/deletes
✅ Role-based data filtering (regular users see only their data)
✅ Field-level restrictions (regular users can't change name/email/extension)
✅ Clear, user-friendly error messages
✅ Server-side validation (can't be bypassed from frontend)

## Troubleshooting

### "Not authenticated" error
- Check if user is logged in
- Verify Supabase session is active
- Check browser console for auth errors

### "Forbidden" error when editing
- Verify you own the item you're trying to edit
- Check if you're trying to edit locked fields (name/email/extension)
- Confirm your role is set correctly in database

### Can't see any data
- Regular users only see their own data
- Check if data exists with your email
- Verify email in records matches your login email

### Edit/Delete buttons not showing
- This is correct behavior for items you don't own
- Only your own items show edit/delete buttons
- Admins see all items but can only edit their own

## Next Steps

1. ✅ Create admin users in database
2. ✅ Test with both admin and regular user accounts
3. ✅ Verify ownership rules work correctly
4. ✅ Test field restrictions on contact editing
5. 🔄 Consider migrating from mock auth to real Supabase auth
6. 🔄 Add audit logging for sensitive operations
7. 🔄 Implement session timeout and refresh

## Support

For issues or questions:
1. Check `RBAC-IMPLEMENTATION-COMPLETE.md` for technical details
2. Run `node test-rbac-implementation.js` to diagnose issues
3. Check Supabase logs for API errors
4. Verify user roles in `user_profiles` table

---

**Implementation Date**: November 2024
**Status**: ✅ Complete and Ready for Testing
