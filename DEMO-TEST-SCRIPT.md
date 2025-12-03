# ACTREC Telephone Directory - Complete Demo Test Script

## 📹 Recording Setup Instructions

### Screen Recording Tools (Choose One):
1. **Windows Built-in (Xbox Game Bar)**
   - Press `Win + G` to open Game Bar
   - Click "Record" button or press `Win + Alt + R`
   - Recording saved to: `C:\Users\[YourName]\Videos\Captures\`

2. **OBS Studio (Recommended - Free)**
   - Download: https://obsproject.com/
   - Better quality and control
   - Can record in multiple formats

3. **ShareX (Free)**
   - Download: https://getsharex.com/
   - Lightweight and easy to use

### Before Recording:
- ✅ Close unnecessary browser tabs
- ✅ Clear browser cache
- ✅ Set browser zoom to 100%
- ✅ Prepare sample CSV file: `sample-contacts.csv`
- ✅ Have test credentials ready
- ✅ Ensure dev server is running: http://localhost:3000

---

## 🎬 Demo Test Cases - Step by Step

### **Preparation Phase**

**Login Credentials:**
- **Admin User**: `jeyarish.venki@gmail.com` / `BXwGRPqu2Fm3`
- **Regular User**: (will create during demo)

**URL to Start:** http://localhost:3000

---

## **Test Case 1: Application Landing Page & Public Search**
⏱️ **Duration:** 2 minutes

### Steps:
1. Navigate to http://localhost:3000
2. Show the landing page with:
   - ACTREC branding
   - Welcome message
   - "Search Directory" and "Login" buttons
3. Click **"Search Directory"**
4. Demonstrate public search (no login required):
   - Search by name: "PRASHANT"
   - Search by department: "Medical"
   - Show search results
   - Click **"Back to Home"** button
5. Return to landing page

**✅ Expected Result:** Public users can search without login, "Back to Home" button visible

---

## **Test Case 2: Admin Login & Dashboard Overview**
⏱️ **Duration:** 2 minutes

### Steps:
1. From landing page, click **"Login"**
2. Enter admin credentials:
   - Email: `jeyarish.venki@gmail.com`
   - Password: `BXwGRPqu2Fm3`
3. Click **"Sign In"**
4. Show Admin Dashboard with tabs:
   - Contact Management
   - Bulk Operations
   - User Management
   - Search
   - Learning Plans
   - Patentable Ideas
   - Settings
5. Show top navigation buttons:
   - "User View"
   - "Logout"

**✅ Expected Result:** Admin successfully logs in and sees all management tabs

---

## **Test Case 3: Single Contact Creation**
⏱️ **Duration:** 3 minutes

### Steps:
1. In Dashboard, ensure **"Contact Management"** tab is active
2. Click **"Add Contact"** button
3. Fill in new contact details:
   - **Name:** DR. DEMO USER
   - **Department:** Research
   - **Designation:** Scientist
   - **Phone Number:** -7680
   - **Extension:** 5600
   - **Email:** demo.user@actrec.gov.in
   - **Location:** Fifth Floor
   - **Institution:** ACTREC
4. Click **"Create Contact"**
5. Verify success message appears
6. Scroll to contact list and verify new contact appears

**✅ Expected Result:** New contact created and visible in the list

---

## **Test Case 4: Contact Edit & Delete**
⏱️ **Duration:** 2 minutes

### Steps:
1. Find the contact just created (DR. DEMO USER)
2. Click **"Edit"** button for that contact
3. Modify:
   - **Designation:** Senior Scientist
   - **Extension:** 5650
4. Click **"Update Contact"**
5. Verify changes are saved
6. Click **"Delete"** button for the same contact
7. Confirm deletion in the dialog
8. Verify contact is removed from list

**✅ Expected Result:** Contact successfully edited and deleted

---

## **Test Case 5: Bulk Contact Upload (CSV Import)**
⏱️ **Duration:** 3 minutes

### Steps:
1. Click on **"Bulk Operations"** tab
2. In the "Bulk Upload Contacts" section
3. Click **"Choose File"** button
4. Select `sample-contacts.csv` file
5. Preview shows:
   - 5 contacts to be imported
   - All field mappings correct
6. Click **"Upload Contacts"**
7. Wait for progress indicator
8. Verify success message: "5 contacts uploaded successfully"
9. Go back to **"Contact Management"** tab
10. Verify all 5 new contacts appear in the list

**✅ Expected Result:** All 5 contacts from CSV imported successfully

---

## **Test Case 6: Bulk Contact Export (CSV Download)**
⏱️ **Duration:** 2 minutes

### Steps:
1. In **"Bulk Operations"** tab
2. Scroll to "Export Data" section
3. Click **"Export All Contacts to CSV"** button
4. Verify file downloads: `actrec_contacts_[date].csv`
5. Open downloaded CSV file in Excel/Notepad
6. Verify all contacts are present with correct data

**✅ Expected Result:** CSV file downloaded with all contact data

---

## **Test Case 7: User Management - Create Single User**
⏱️ **Duration:** 3 minutes

### Steps:
1. Click on **"User Management"** tab
2. Click **"Add User"** button
3. Fill in new user details:
   - **Email:** test.user@actrec.gov.in
   - **Password:** Test123$
   - **Role:** Regular User
4. Click **"Create User"**
5. Verify success message
6. Verify new user appears in user list with "Regular User" role

**✅ Expected Result:** New regular user created successfully

---

## **Test Case 8: Single User Role Change**
⏱️ **Duration:** 2 minutes

### Steps:
1. In **"User Management"** tab
2. Find the user: `test.user@actrec.gov.in`
3. Click **"Change Role"** button
4. Select new role: **Admin**
5. Confirm the change
6. Verify role updated to "Admin" in the user list
7. Click **"Change Role"** again
8. Change back to **Regular User**
9. Verify role reverted

**✅ Expected Result:** User role changes successfully

---

## **Test Case 9: Single User Password Reset**
⏱️ **Duration:** 2 minutes

### Steps:
1. In **"User Management"** tab
2. Find user: `test.user@actrec.gov.in`
3. Click **"Reset Password"** button
4. Enter new password: `NewPass123$`
5. Confirm password reset
6. Verify success message
7. **Optional:** Logout and test login with new password

**✅ Expected Result:** Password reset successfully

---

## **Test Case 10: Bulk User Operations**
⏱️ **Duration:** 3 minutes

### Steps:
1. In **"User Management"** tab
2. **Bulk Role Change:**
   - Select 2-3 users by checking checkboxes
   - Click **"Bulk Change Role"**
   - Select role: Regular User
   - Confirm
   - Verify all selected users' roles changed

3. **Bulk Password Reset:**
   - Keep users selected
   - Click **"Bulk Reset Password"**
   - Enter new password: `Bulk123$`
   - Confirm
   - Verify success message

4. **Bulk Delete:**
   - Select test users created during demo
   - Click **"Bulk Delete Users"**
   - Confirm deletion
   - Verify users removed from list

**✅ Expected Result:** All bulk operations complete successfully

---

## **Test Case 11: Learning Plans Management**
⏱️ **Duration:** 4 minutes

### Steps:
1. Click on **"Learning Plans"** tab
2. **Create Learning Plan:**
   - Click **"Add Learning Plan"**
   - **Title:** Advanced Bioinformatics Training
   - **Description:** Comprehensive training on NGS data analysis
   - **Category:** Technical Skills
   - **Status:** Not Started
   - **Target Date:** (select future date)
   - Click **"Create"**
   - Verify plan appears in list

3. **Edit Learning Plan:**
   - Find the plan just created
   - Click **"Edit"**
   - Change **Status:** In Progress
   - Update **Description:** Add more details
   - Click **"Update"**
   - Verify changes saved

4. **Delete Learning Plan:**
   - Click **"Delete"** for the same plan
   - Confirm deletion
   - Verify plan removed

**✅ Expected Result:** Learning plan created, edited, and deleted successfully

---

## **Test Case 12: Patentable Ideas Management**
⏱️ **Duration:** 4 minutes

### Steps:
1. Click on **"Patentable Ideas"** tab
2. **Create Patentable Idea:**
   - Click **"Add Idea"**
   - **Title:** Novel Cancer Detection Algorithm
   - **Description:** ML-based early detection system using protein markers
   - **Category:** Software/Algorithm
   - **Status:** Draft
   - Click **"Create"**
   - Verify idea appears in list

3. **Edit Patentable Idea:**
   - Find the idea just created
   - Click **"Edit"**
   - Change **Status:** Under Review
   - Update **Description:** Add technical details
   - Click **"Update"**
   - Verify changes saved

4. **Delete Patentable Idea:**
   - Click **"Delete"** for the same idea
   - Confirm deletion
   - Verify idea removed

**✅ Expected Result:** Patentable idea created, edited, and deleted successfully

---

## **Test Case 13: Admin Settings & Reports**
⏱️ **Duration:** 5 minutes

### Steps:
1. Click on **"Settings"** tab
2. Show **System Statistics:**
   - Total Contacts count (clickable)
   - Total Users count (clickable)
   - Admin Users count (clickable)
   - Regular Users count (clickable)
   - Learning Plans count (clickable)
   - Patentable Ideas count (clickable)

3. **Click on each number** to demonstrate drill-down:
   - Click "Total Contacts" → shows contact list
   - Go back, click "Admin Users" → shows admin list
   - Go back, click "Learning Plans" → shows plans list
   - Go back, click "Patentable Ideas" → shows ideas list

4. Show **Activity Log/Recent Actions** (if available)

5. Show **Technical Information:**
   - Next.js version
   - Database status
   - Environment info

**✅ Expected Result:** All reports display correctly with accurate counts and drill-down functionality

---

## **Test Case 14: Search Functionality (Admin View)**
⏱️ **Duration:** 3 minutes

### Steps:
1. Click on **"Search"** tab (admin view with search + dashboard button)
2. Demonstrate searches:
   - Search by name: "PRASHANT"
   - Search by department: "Medical"
   - Search by designation: "Doctor"
   - Search by email domain: "@actrec.gov.in"
   - Search by location: "Floor"

3. Show filtering results in real-time
4. Show pagination (if many results)
5. Demonstrate sorting by columns
6. Click **"Go to Dashboard"** button (admin should see this)

**✅ Expected Result:** Search works across all fields, results update in real-time

---

## **Test Case 15: User View (Regular User Experience)**
⏱️ **Duration:** 3 minutes

### Steps:
1. From admin dashboard, click **"User View"** button
2. Show regular user dashboard with limited tabs:
   - Search
   - Learning Plans (personal only)
   - Patentable Ideas (personal only)
   - ❌ No Contact Management
   - ❌ No Bulk Operations
   - ❌ No User Management
   - ❌ No Settings

3. Show that user can only:
   - Search contacts
   - Manage their own learning plans
   - Manage their own patentable ideas

4. Click **"Back to Dashboard"** to return to admin view

**✅ Expected Result:** Regular users see limited functionality, admin functionality hidden

---

## **Test Case 16: Logout & Security**
⏱️ **Duration:** 1 minute

### Steps:
1. Click **"Logout"** button
2. Verify redirected to login page
3. Try accessing admin URL directly: http://localhost:3000/admin
4. Verify system redirects to login (security check)
5. Try accessing dashboard: http://localhost:3000/dashboard
6. Verify system redirects to login

**✅ Expected Result:** Proper logout and protected routes working

---

## 📊 Demo Summary Checklist

After completing all test cases, verify:

- ✅ **Contact Management:**
  - [x] Single contact create/edit/delete
  - [x] Bulk contact upload (CSV)
  - [x] Bulk contact export (CSV)

- ✅ **User Management:**
  - [x] Single user creation
  - [x] Single role change
  - [x] Single password reset
  - [x] Single user deletion
  - [x] Bulk role changes
  - [x] Bulk password resets
  - [x] Bulk user deletion

- ✅ **Learning Plans:**
  - [x] Create learning plan
  - [x] Edit learning plan
  - [x] Delete learning plan

- ✅ **Patentable Ideas:**
  - [x] Create patentable idea
  - [x] Edit patentable idea
  - [x] Delete patentable idea

- ✅ **Reports & Analytics:**
  - [x] System statistics
  - [x] Clickable counts with drill-down
  - [x] Technical information

- ✅ **Search & Navigation:**
  - [x] Public search (no login)
  - [x] Admin search with full features
  - [x] Advanced filtering

- ✅ **Security & RBAC:**
  - [x] Admin vs Regular user views
  - [x] Protected routes
  - [x] Proper logout

---

## 🎥 Recording Tips

1. **Speak while recording:** Explain what you're doing
2. **Move slowly:** Allow viewers to see actions
3. **Pause briefly:** After each action completes
4. **Show success messages:** Zoom in or highlight
5. **Total estimated time:** 45-60 minutes for all test cases

---

## 📁 Output Files

After recording, you'll have:
- Video file(s): `.mp4` format
- Downloaded CSV: `actrec_contacts_[date].csv`
- Sample CSV: `sample-contacts.csv`

**Recommended:** Split recording into 3 parts:
1. **Part 1:** Contact Management (Test Cases 1-6) - ~15 min
2. **Part 2:** User Management (Test Cases 7-10) - ~15 min  
3. **Part 3:** Plans, Ideas, Reports (Test Cases 11-16) - ~20 min

---

## ✅ Pre-Demo Checklist

Before starting recording:

- [ ] Dev server running: http://localhost:3000
- [ ] Database accessible and populated
- [ ] `sample-contacts.csv` file ready
- [ ] Screen recorder tested and working
- [ ] Browser at 100% zoom
- [ ] Unnecessary tabs closed
- [ ] Admin credentials ready
- [ ] Internet connection stable

**Good luck with your demo! 🎬**
