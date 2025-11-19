# RBAC Implementation Complete

## Overview
Implemented comprehensive Role-Based Access Control (RBAC) for learning plans, patentable ideas, and contact profile editing.

## Access Control Rules

### Admin Users
**Learning Plans & Patentable Ideas:**
- ✅ Can view ALL users' plans and ideas (read-only for others)
- ✅ Can create their own plans and ideas
- ✅ Can edit ONLY their own plans and ideas
- ✅ Can delete ONLY their own plans and ideas
- ❌ CANNOT edit or delete other users' plans and ideas

**Contacts:**
- ✅ Full access to all contact management features
- ✅ Can edit any contact record
- ✅ Can perform bulk operations

### Regular Users
**Learning Plans & Patentable Ideas:**
- ✅ Can view ONLY their own plans and ideas
- ✅ Can create their own plans and ideas
- ✅ Can edit their own plans and ideas
- ✅ Can delete their own plans and ideas
- ❌ CANNOT see other users' plans and ideas

**Contact Profile:**
- ✅ Can edit their own contact information
- ❌ CANNOT edit: Name, Extension, Email (locked fields)
- ✅ CAN edit: Department, Designation, Phone Number, Location, Institution
- ❌ CANNOT edit other users' contacts

**Other Features:**
- ✅ Can search directory
- ✅ Can change password
- ❌ No access to user management
- ❌ No access to bulk operations

## Implementation Details

### API Routes Updated

#### `/api/learning-plans/route.ts`
- Added `getUserFromRequest()` helper to extract user from auth token
- **GET**: Filters results by user role (regular users see only their own)
- **PUT**: Validates ownership before allowing updates
- **DELETE**: Validates ownership before allowing deletion
- Returns 401 for unauthenticated requests
- Returns 403 for unauthorized operations

#### `/api/patentable-ideas/route.ts`
- Added `getUserFromRequest()` helper to extract user from auth token
- **GET**: Filters results by user role (regular users see only their own)
- **PUT**: Validates ownership before allowing updates
- **DELETE**: Validates ownership before allowing deletion
- Returns 401 for unauthenticated requests
- Returns 403 for unauthorized operations

#### `/api/contacts/route.ts`
- Added `getUserFromRequest()` helper to extract user from auth token
- **PUT**: 
  - Regular users can only edit their own contact (matched by email)
  - Regular users cannot change: `name`, `extension`, `email`
  - Admins have full edit access
- Returns 403 with descriptive error messages for violations

### Components Updated

#### `components/simple-learning-plans.tsx`
- Added `supabase` import for auth token access
- All API calls now include `Authorization: Bearer <token>` header
- Edit/Delete buttons only shown when `plan.email === userEmail`
- Better error handling with descriptive messages from API

#### `components/simple-patentable-ideas.tsx`
- Added `supabase` import for auth token access
- All API calls now include `Authorization: Bearer <token>` header
- Edit/Delete buttons only shown when `idea.email === userEmail`
- Better error handling with descriptive messages from API

## Security Features

### Authentication
- All API routes validate JWT tokens via `Authorization` header
- Tokens verified using Supabase service role client
- User role fetched from database for each request

### Authorization
- Ownership validation on all update/delete operations
- Role-based filtering on GET operations
- Field-level restrictions for regular users editing contacts

### Error Messages
- Clear, user-friendly error messages
- Distinguishes between authentication (401) and authorization (403) errors
- Specific messages for locked fields

## Testing Recommendations

### Test as Admin
1. Create a learning plan/idea
2. Verify you can see all users' plans/ideas
3. Try to edit another user's plan/idea (should fail with 403)
4. Verify you can edit/delete your own plans/ideas
5. Edit any contact record (should succeed)

### Test as Regular User
1. Create a learning plan/idea
2. Verify you only see your own plans/ideas
3. Verify edit/delete buttons only appear on your items
4. Try to edit your contact profile
5. Verify Name, Extension, Email fields are locked
6. Verify you can edit other fields (Department, Location, etc.)

### Test Unauthorized Access
1. Try API calls without auth token (should return 401)
2. Try to edit another user's data (should return 403)
3. Try to change locked fields as regular user (should return 403)

## Database Schema Requirements

### User Profiles Table (`user_profiles`)
Must have columns:
- `id` (UUID, primary key)
- `email` (text)
- `role` (text: 'admin' or 'regular')

**Creating Admin Users:**
```sql
-- Update an existing user to admin role
UPDATE user_profiles 
SET role = 'admin' 
WHERE email = 'admin@actrec.gov.in';

-- Or insert a new admin user
INSERT INTO user_profiles (id, email, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@actrec.gov.in',
  'admin',
  NOW(),
  NOW()
);
```

### Learning Plans Table
Must have column:
- `email` (text, references user email)

### Patentable Ideas Table
Must have column:
- `email` (text, references user email)

### Contacts Table
Must have column:
- `email` (text, references user email)

## Future Enhancements

1. **Audit Logging**: Track who edited what and when
2. **Granular Permissions**: More fine-grained permission system
3. **Team/Group Access**: Allow sharing plans/ideas within teams
4. **Approval Workflow**: Require admin approval for certain changes
5. **Field-Level Permissions**: Configure which fields each role can edit
6. **Session Management**: Add session timeout and refresh logic

## Important Notes

### Current Authentication System
The application currently uses a **mock authentication system** with localStorage for demo purposes. The RBAC implementation is ready for production but requires:

1. **Supabase Auth Integration**: Replace mock auth with real Supabase authentication
2. **Session Management**: Implement proper JWT token handling
3. **Admin User Creation**: Create admin users in `user_profiles` table with `role = 'admin'`

### Implementation Details
- All ownership checks use email matching (email in record === user email)
- Admin role is determined by `role` field in `user_profiles` table
- Auth tokens should be obtained from Supabase session on client side
- Service role key used on server side for database operations
- RLS policies remain active for additional security layer

### Migration from Mock Auth to Real Auth
When ready to use real authentication:
1. Update `lib/auth.ts` to use Supabase auth instead of localStorage
2. Ensure all users have corresponding records in `user_profiles` table
3. Set appropriate roles in `user_profiles` table
4. Test authentication flow with real JWT tokens
