# 📋 Comprehensive Manual Test Checklist

## Test Environment
- **URL**: http://localhost:3000
- **Admin Credentials**: admin@actrec.gov.in / Admin@123
- **Test Date**: December 3, 2025

---

## ✅ Test Execution Checklist

### 🔐 1. Authentication Tests

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| **Admin Login** | 1. Navigate to http://localhost:3000<br>2. Enter admin credentials<br>3. Click Login | Dashboard loads with "ADMIN" badge visible | ☐ |

---

### 👥 2. User Management - Single Operations

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| **Single User Creation** | 1. Go to User Management tab<br>2. Fill email: `test${timestamp}@actrec.gov.in`<br>3. Fill password: `Test@123`<br>4. Click Create User | User appears in list with "regular" role | ☐ |
| **Single Role Change** | 1. Find test user in list<br>2. Change role dropdown from "regular" to "admin"<br>3. Verify change | Role updates to "admin" successfully | ☐ |
| **Single Password Reset** | 1. Find test user<br>2. Click Reset Password button<br>3. Confirm action | Success message, new password generated | ☐ |
| **Single User Edit** | 1. Find test user<br>2. Click Edit button<br>3. Modify email/password<br>4. Save | Changes saved successfully | ☐ |
| **Single User Delete** | 1. Find test user<br>2. Click Delete button<br>3. Confirm deletion | User removed from list | ☐ |

---

### 👥 3. User Management - Bulk Operations

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| **Bulk User Creation** | 1. Go to User Management<br>2. Prepare CSV: email,password,role<br>3. Upload file<br>4. Click Import | All users from CSV created | ☐ |
| **Select All Users** | 1. Click "Select All" button<br>2. Verify all non-admin users selected | All checkboxes checked except last admin | ☐ |
| **Deselect All Users** | 1. Click "Deselect All" button | All checkboxes unchecked | ☐ |
| **Bulk Role Change** | 1. Select 2-3 regular users<br>2. Choose new role from dropdown<br>3. Click Change Role | Selected users' roles updated | ☐ |
| **Bulk Password Reset** | 1. Select 2-3 users<br>2. Click Reset Password (bulk)<br>3. Confirm | New passwords generated for all selected | ☐ |
| **Bulk Delete Protection** | 1. Try to select last admin user<br>2. Attempt bulk delete | Admin checkbox disabled, cannot be selected | ☐ |
| **Bulk Delete Regular Users** | 1. Select 2-3 regular users<br>2. Click Delete Selected<br>3. Confirm | Selected users deleted, count updated | ☐ |

---

### 💡 4. Patentable Ideas Management

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| **Add Patentable Idea** | 1. Go to Patentable Ideas tab<br>2. Fill Title: "Test Idea"<br>3. Fill Description<br>4. Select Category: "Software/Algorithm"<br>5. Click Add Idea | Idea appears in list with "draft" status | ☐ |
| **Edit Patentable Idea** | 1. Find test idea<br>2. Click Edit button<br>3. Modify description<br>4. Change status to "under-review"<br>5. Click Save | Changes saved successfully | ☐ |
| **Change Idea Status** | 1. Find test idea<br>2. Click Edit<br>3. Change status to "approved"<br>4. Save | Status updated in card | ☐ |
| **Select All Ideas** | 1. Click "Select All" button<br>2. Verify all ideas selected | All idea checkboxes checked, counter shows X of Y | ☐ |
| **Deselect All Ideas** | 1. Click "Deselect All" button | All checkboxes unchecked | ☐ |
| **Delete Single Idea** | 1. Find test idea<br>2. Click Delete button<br>3. Confirm | Idea removed from list | ☐ |
| **Bulk Delete Ideas** | 1. Select 2+ ideas<br>2. Click Delete Selected<br>3. Confirm | Selected ideas deleted | ☐ |

---

### 📚 5. Learning Plans Management

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| **Add Learning Plan** | 1. Go to Study Plans tab<br>2. Fill Title: "Test Plan"<br>3. Fill Description<br>4. Select Category: "Technical Skills"<br>5. Click Add Plan | Plan appears with "not-started" status | ☐ |
| **Edit Learning Plan** | 1. Find test plan<br>2. Click Edit button<br>3. Modify description<br>4. Change status to "in-progress"<br>5. Click Save | Changes saved successfully | ☐ |
| **Update Plan Status** | 1. Find test plan<br>2. Click Edit<br>3. Change status to "completed"<br>4. Save | Status updated, stats card reflects change | ☐ |
| **Select All Plans** | 1. Click "Select All" button<br>2. Verify all plans selected | All plan checkboxes checked, counter shows X of Y | ☐ |
| **Deselect All Plans** | 1. Click "Deselect All" button | All checkboxes unchecked | ☐ |
| **Delete Single Plan** | 1. Find test plan<br>2. Click Delete button<br>3. Confirm | Plan removed from list | ☐ |
| **Bulk Delete Plans** | 1. Select 2+ plans<br>2. Click Delete Selected<br>3. Confirm | Selected plans deleted | ☐ |

---

### 🔍 6. UI/UX Features

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| **User Info in Header** | 1. Look at dashboard header<br>2. Verify user email displayed<br>3. Verify ADMIN badge visible | Email and badge visible in header | ☐ |
| **Admin Differentiation** | 1. Go to Contact Management<br>2. Look for contacts with admin emails | Admin contacts have purple background + ADMIN badge | ☐ |
| **Statistics Cards** | 1. Check each tab<br>2. Verify stat cards show correct counts | All counters accurate and updating | ☐ |
| **Search Functionality** | 1. Go to Search tab<br>2. Enter search term<br>3. Verify results | Relevant contacts displayed | ☐ |
| **Responsive Design** | 1. Resize browser window<br>2. Test on mobile viewport | UI adapts properly to screen size | ☐ |

---

### 🛡️ 7. Security & Protection Tests

| Test Case | Steps | Expected Result | Status |
|-----------|-------|----------------|--------|
| **Last Admin Protection** | 1. Identify last admin user<br>2. Try to select for bulk delete<br>3. Try to delete | Checkbox disabled, toast warning shown | ☐ |
| **Role-Based Access** | 1. Login as regular user<br>2. Check available tabs | User Management tab not visible | ☐ |
| **Unauthorized Actions** | 1. As regular user<br>2. Try to access admin features | Access denied or features hidden | ☐ |

---

## 📊 Test Results Summary

### Coverage
- **Total Test Cases**: 35
- **Completed**: ___
- **Passed**: ___
- **Failed**: ___
- **Pass Rate**: ___%

### Critical Issues Found
1. _______________________________
2. _______________________________
3. _______________________________

### Minor Issues Found
1. _______________________________
2. _______________________________
3. _______________________________

### Notes
_______________________________________________
_______________________________________________
_______________________________________________

---

## 🎯 Test Execution Instructions

1. **Start the development server**: `npm run dev`
2. **Open browser**: Navigate to http://localhost:3000
3. **Login as admin**: Use admin@actrec.gov.in / Admin@123
4. **Execute tests**: Follow checklist sequentially
5. **Mark completion**: Check ☑ for each passed test
6. **Document issues**: Note any failures or unexpected behavior
7. **Take screenshots**: Capture evidence for failed tests

---

## 📝 Test Data Templates

### CSV for Bulk User Upload
```csv
email,password,role
bulk1@actrec.gov.in,Bulk@123,regular
bulk2@actrec.gov.in,Bulk@123,regular
bulk3@actrec.gov.in,Bulk@123,regular
```

### Test Credentials
- **Admin**: admin@actrec.gov.in / Admin@123
- **Test User**: testuser@actrec.gov.in / Test@123

---

## ✅ Sign-Off

- **Tester Name**: _______________________
- **Date**: _______________________
- **Signature**: _______________________
- **Overall Status**: ☐ PASS ☐ FAIL ☐ PARTIAL

---

**End of Test Checklist**
