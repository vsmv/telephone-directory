# ACTREC Telephone Directory - User Manual

**Version:** 1.0  
**Application:** ACTREC Consolidated Telephone Directory  
**Date:** August 26, 2025  
**Target Users:** ACTREC Staff, Researchers, and Administrators  

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Homepage Overview](#2-homepage-overview)
3. [User Authentication](#3-user-authentication)
4. [Search Directory](#4-search-directory)
5. [Admin Dashboard](#5-admin-dashboard)
6. [Contact Management](#6-contact-management)
7. [Bulk Operations](#7-bulk-operations)
8. [Bioinformatics Extension](#8-bioinformatics-extension)
9. [Troubleshooting](#9-troubleshooting)
10. [Appendices](#10-appendices)

---

## 1. Getting Started

### 1.1 System Requirements
- **Web Browser:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Internet Connection:** Required for cloud-hosted version
- **Screen Resolution:** Minimum 1024x768 (Responsive design supports mobile)
- **JavaScript:** Must be enabled

### 1.2 Accessing the Application

**Production URL:** `https://your-domain.vercel.app` (when deployed)  
**Development URL:** `http://localhost:3000` (for local development)

### 1.3 Demo Credentials

The application comes with pre-configured demo accounts for testing:

| Role | Username/Email | Password | Access Level |
|------|----------------|----------|--------------|
| **Administrator** | admin | admin123 | Full CRUD access, Bulk operations, Bio-extension |
| **Regular User** | user | user123 | Read-only access, Search functionality |

> **⚠️ Security Note:** Change these credentials in production deployment.

---

## 2. Homepage Overview

### 2.1 Landing Page

When you first access the application, you'll see the main landing page:

**📷 Screenshot Description:**
- **Header:** "ACTREC Consolidated Telephone Directory"
- **Subtitle:** "Advanced Centre for Treatment, Research, and Education in Cancer"
- **Three Main Action Cards:**
  1. 🔐 User Login (Blue card)
  2. 🔍 Search Directory (Green card)
  3. ⚙️ Admin Dashboard (Purple card)

**Key Features Visible:**
- Clean, professional design with gradient background
- Demo login credentials displayed for easy access
- Sample contact data preview
- Responsive layout for desktop and mobile devices

### 2.2 Navigation Options

From the homepage, you can:

1. **Login** - Access role-based features
2. **Search** - Find contacts without authentication (limited access)
3. **Admin Dashboard** - Full management capabilities (requires admin login)

---

## 3. User Authentication

### 3.1 Accessing the Login Page

**Step 1:** Click on the "🔐 User Login" card from the homepage

**📷 Screenshot Description:**
- Login form with email/username field
- Password field with secure input
- "Login" button
- "Back to Home" button
- Clean, centered form design

### 3.2 Login Process

**Step 2:** Enter your credentials

**For Administrator Access:**
```
Username: admin
Password: admin123
```

**For Regular User Access:**
```
Username: user  
Password: user123
```

**Step 3:** Click "Login" button

### 3.3 Authentication States

**Successful Login:**
- Redirected to appropriate dashboard
- Session maintained for secure access
- User role determines available features

**Failed Login:**
- Error message displayed
- Form remains accessible for retry
- Security measures prevent brute force attacks

---

## 4. Search Directory

### 4.1 Accessing Search Function

**From Homepage:** Click "🔍 Search Directory" card
**From Any Page:** Use navigation menu

### 4.2 Basic Search

**📷 Screenshot Description:**
- Search input field with placeholder "Search contacts..."
- Real-time search results display
- Contact cards showing key information
- Pagination controls (if many results)

**Step-by-Step Search:**

**Step 1:** Enter search term in the search box
- **Examples:** "Doctor", "Medical", "5042", "@actrec.gov.in"

**Step 2:** Results appear in real-time (500ms debounce)
- Contact cards display automatically
- No need to press Enter or click search button

### 4.3 Advanced Search Features

#### 4.3.1 Wildcard Search Patterns

The application supports advanced wildcard searching:

| Pattern | Description | Example | Results |
|---------|-------------|---------|---------|
| `*` | Matches any characters | `Doctor*` | All contacts starting with "Doctor" |
| `?` | Matches single character | `Dr. ?hat` | Matches "Dr. Bhat" |
| `*word*` | Contains word | `*Admin*` | All contacts containing "Admin" |

**📷 Screenshot Description:**
- Search input showing wildcard pattern
- Results filtered by pattern match
- Highlighted matching text in results

#### 4.3.2 Multi-Field Search

Search across all contact fields simultaneously:
- **Name:** DR. PRASHANT BHAT
- **Department:** Medical Administration  
- **Designation:** Doctor
- **Phone/Extension:** 5042
- **Email:** prashant.bhat@actrec.gov.in
- **Location:** Second Floor, ACTREC
- **Institution:** ACTREC

### 4.4 Search Results Display

**📷 Screenshot Description:**
Each contact card shows:
- 👤 **Contact Name** (prominently displayed)
- 🏢 **Department & Designation**
- 📞 **Phone Number & Extension**
- 📧 **Email Address** (clickable mailto link)
- 📍 **Location & Institution**

### 4.5 Search Performance

- **Real-time Results:** Updates as you type (500ms debounce)
- **Case-Insensitive:** "medical" matches "Medical Administration"
- **Partial Matching:** "Admin" finds "Medical Administration"
- **Fast Response:** Results appear within 100-200ms

---

## 5. Admin Dashboard

### 5.1 Accessing Admin Dashboard

**Prerequisites:** Must be logged in with Administrator credentials

**Step 1:** Login as admin (admin/admin123)
**Step 2:** Click "⚙️ Admin Dashboard" or navigate after login

### 5.2 Dashboard Overview

**📷 Screenshot Description:**
- **Header:** "Admin Dashboard" with user info
- **Navigation Tabs:**
  1. Contact Management
  2. Bulk Operations  
  3. Patentable Ideas
  4. Learning Plans
  5. Settings
- **Statistics:** Total contacts, system status
- **Quick Actions:** Add contact, export data, etc.

### 5.3 Dashboard Navigation

**Tab Structure:**
Each tab provides specific functionality:
- **Active Tab:** Highlighted with blue accent
- **Tab Content:** Updates dynamically
- **Responsive Design:** Stacks vertically on mobile

---

## 6. Contact Management

### 6.1 View All Contacts

**📷 Screenshot Description:**
- **Left Panel:** Add/Edit contact form
- **Right Panel:** Current contacts list
- **Contact Cards:** Checkbox for selection, Edit/Delete buttons
- **Bulk Actions:** Available when contacts selected

### 6.2 Adding New Contacts

#### 6.2.1 Contact Form Fields

**Required Fields (marked with *):**
- **Full Name*** - Example: "DR. PRASHANT BHAT"
- **Extension*** - Example: "5042"
- **Email*** - Example: "prashant.bhat@actrec.gov.in"

**Optional Fields:**
- **Department** - Example: "Medical Administration"
- **Designation** - Example: "Doctor"
- **Phone Number** - Example: "-7671"
- **Location** - Example: "Second Floor, ACTREC"
- **Institution** - Example: "ACTREC" (pre-filled)

#### 6.2.2 Add Contact Process

**Step 1:** Fill in the contact form
**📷 Screenshot Description:**
- Form fields with labels and placeholders
- Required field indicators (*)
- Validation messages for errors

**Step 2:** Click "Add Contact" button
**Step 3:** Confirmation message appears
**Step 4:** Contact appears in the contacts list

### 6.3 Editing Existing Contacts

**Step 1:** Click the "Edit" button (✏️) on any contact card
**Step 2:** Form populates with existing data
**📷 Screenshot Description:**
- Form shows "Edit Contact" title
- All fields filled with current values
- "Update Contact" and "Cancel" buttons visible

**Step 3:** Modify desired fields
**Step 4:** Click "Update Contact"
**Step 5:** Changes reflected immediately in the list

### 6.4 Deleting Contacts

#### 6.4.1 Single Contact Deletion

**Step 1:** Click the "Delete" button (🗑️) on any contact card
**Step 2:** Confirmation dialog appears
**Step 3:** Confirm deletion
**Step 4:** Contact removed from list

#### 6.4.2 Bulk Contact Deletion

**Step 1:** Select multiple contacts using checkboxes
**📷 Screenshot Description:**
- Selected contacts highlighted
- Bulk actions panel appears
- "Delete Selected (X)" button visible

**Step 2:** Click "Delete Selected (X)" where X is the count
**Step 3:** Confirm bulk deletion
**Step 4:** All selected contacts removed

### 6.5 Bulk Contact Editing

**Step 1:** Select multiple contacts using checkboxes
**Step 2:** Bulk edit panel appears automatically
**📷 Screenshot Description:**
- Bulk edit form with common fields:
  - Department
  - Location  
  - Institution
- "Update Selected" button
- Note about empty fields being unchanged

**Step 3:** Enter new values for fields to update
**Step 4:** Click "Update Selected"
**Step 5:** All selected contacts updated with new values

---

## 7. Bulk Operations

### 7.1 Accessing Bulk Operations

**Navigation:** Admin Dashboard → "Bulk Operations" tab

### 7.2 CSV Upload (Bulk Import)

#### 7.2.1 Preparing CSV File

**Required CSV Format:**
```csv
Name,Department,Designation,Phone Number,Extension,Email,Location,Institution
DR. JOHN DOE,Oncology,Doctor,-7674,5045,john.doe@actrec.gov.in,Third Floor,ACTREC
DR. JANE SMITH,Bioinformatics,Research Scientist,-7675,5046,jane.smith@actrec.gov.in,Fourth Floor,ACTREC
```

**📷 Screenshot Description:**
- CSV format example displayed
- Requirements list:
  - Headers must match exactly
  - Extension + Email combination used for duplicate detection
  - All required fields must be present

#### 7.2.2 Upload Process

**Step 1:** Click "Choose CSV File" button
**📷 Screenshot Description:**
- File upload area
- "Choose CSV File" button
- Format requirements listed
- File size limit (5MB) mentioned

**Step 2:** Select your CSV file
**Step 3:** File uploads and processes automatically
**Step 4:** Results summary displays:
- **Success Message:** "X contacts added successfully"
- **Duplicates:** "Y skipped due to duplicates"
- **Errors:** Any validation issues

#### 7.2.3 Duplicate Handling

**Automatic Duplicate Detection:**
- Based on Extension + Email combination
- Duplicates skipped, not overwritten
- Detailed report of skipped records provided

**📷 Screenshot Description:**
- Upload results panel showing:
  - Green: "5 contacts added successfully"
  - Yellow: "2 skipped due to duplicates"
  - List of duplicate details

### 7.3 CSV Export (Bulk Download)

**Step 1:** Click "Export All Contacts (X)" button
**📷 Screenshot Description:**
- Export button showing total count
- File download information
- CSV format compatibility note

**Step 2:** File downloads automatically
**File Details:**
- **Format:** CSV with all contact fields
- **Filename:** `actrec_contacts_YYYY-MM-DD.csv`
- **Compatible:** With bulk upload format

---

## 8. Bioinformatics Extension

### 8.1 Overview

The bioinformatics extension supports ACTREC's research by providing:
- **Patentable Ideas Storage:** Secure storage for innovative concepts
- **Learning Plans:** Step-by-step collaboration guides
- **Research Integration:** Links to oncology and dementia research workflows

### 8.2 Patentable Ideas

#### 8.2.1 Accessing Patentable Ideas

**Navigation:** Admin Dashboard → "Patentable Ideas" tab
**Access Level:** Administrator only

#### 8.2.2 Adding Patentable Ideas

**📷 Screenshot Description:**
- **Left Panel:** Add idea form
- **Right Panel:** Stored ideas list
- Form fields clearly labeled

**Step 1:** Fill in the idea form
- **Idea Title** - Example: "AI-driven semantic search for bioinformatics profiles"
- **Category** - Example: "AI Integration"
- **Description** - Detailed concept explanation

**Step 2:** Click "Add Patentable Idea"
**Step 3:** Idea stored securely with encryption
**Step 4:** Appears in stored ideas list with date added

#### 8.2.3 Example Patentable Ideas

**Tested Examples:**
1. **"AI for drug discovery in dementia via protein analysis"**
   - Category: AI Integration
   - Description: AI-integrated semantic search for PDB-linked contacts in dementia therapeutics

2. **"Automated duplicate check for protein database-linked contacts"**
   - Category: Database Integration
   - Description: Oncology drug discovery contact validation system

### 8.3 Learning Plans

#### 8.3.1 Accessing Learning Plans

**Navigation:** Admin Dashboard → "Learning Plans" tab

#### 8.3.2 Creating Learning Plans

**📷 Screenshot Description:**
- Form for creating step-by-step guides
- Multi-line text area for detailed instructions
- Category selection for research type

**Step 1:** Fill in the learning plan form
- **Plan Title** - Example: "Oncology Expert Collaboration Guide"
- **Category** - Example: "Research Collaboration"
- **Step-by-Step Guide** - Detailed instructions

**Step 2:** Click "Add Learning Plan"
**Step 3:** Plan stored and available for reference

#### 8.3.3 Example Learning Plans

**Research Collaboration Guide:**
```
Step 1: Search 'Department: Medical Administration'
Step 2: Filter results by specialty
Step 3: Contact protein analysis experts
Step 4: Schedule collaboration meeting
```

**Protein Analysis Workflow:**
```
Step 1: Search 'Location: Second Floor' for dementia research labs
Step 2: Analyze results for protein analysis collaborators
Step 3: Integrate with drug discovery workflows
```

### 8.4 Security Features

**Data Protection:**
- **Encryption:** All patentable ideas encrypted at rest
- **Access Control:** Admin-only access to sensitive research data
- **Audit Trail:** All actions logged with timestamps
- **Secure Storage:** Protected against unauthorized access

---

## 9. System Settings

### 9.1 Accessing Settings

**Navigation:** Admin Dashboard → "Settings" tab

### 9.2 Password Management

**📷 Screenshot Description:**
- Password change form
- Current password field
- New password field  
- Confirm password field
- "Update Password" button

**Step 1:** Enter current password
**Step 2:** Enter new password
**Step 3:** Confirm new password
**Step 4:** Click "Update Password"

### 9.3 System Status

**📷 Screenshot Description:**
System status panel showing:
- **Total Contacts:** Current count
- **Patentable Ideas:** Number stored
- **Learning Plans:** Number created
- **System Status:** Operational indicator (Green)

### 9.4 Data Management

**Available Options:**
- **Backup Data:** Export complete system backup
- **System Logs:** View application activity logs
- **User Management:** Add/remove user accounts (future feature)

---

## 10. Troubleshooting

### 10.1 Common Issues

#### 10.1.1 Login Problems

**Issue:** "Invalid credentials" error
**Solutions:**
1. Verify username/password (case-sensitive)
2. Check for extra spaces
3. Use demo credentials: admin/admin123 or user/user123
4. Clear browser cache and cookies
5. Try different browser

**Issue:** Page doesn't load after login
**Solutions:**
1. Check internet connection
2. Refresh the page (F5 or Ctrl+R)
3. Clear browser cache
4. Contact system administrator

#### 10.1.2 Search Issues

**Issue:** No search results found
**Solutions:**
1. Check spelling of search terms
2. Try partial matches (e.g., "Admin" instead of "Administration")
3. Use wildcard patterns (* and ?)
4. Verify data exists in system
5. Try different search terms

**Issue:** Search is slow
**Solutions:**
1. Check internet connection speed
2. Reduce search term length
3. Wait for 500ms debounce to complete
4. Refresh page if performance degrades

#### 10.1.3 Upload Issues

**Issue:** CSV upload fails
**Solutions:**
1. Verify CSV format matches requirements exactly
2. Check file size (must be under 5MB)
3. Ensure all required columns present
4. Remove special characters from data
5. Save as UTF-8 encoded CSV

**Issue:** Duplicate detection not working
**Solutions:**
1. Verify Extension + Email combination uniqueness
2. Check for extra spaces in data
3. Ensure consistent formatting
4. Review duplicate detection rules

### 10.2 Performance Optimization

#### 10.2.1 Browser Optimization

**Recommended Settings:**
- **JavaScript:** Must be enabled
- **Cookies:** Allow for session management
- **Cache:** Clear if experiencing issues
- **Pop-up Blocker:** Disable for file downloads

#### 10.2.2 Network Optimization

**For Best Performance:**
- **Connection:** Stable internet required
- **Speed:** Minimum 1 Mbps recommended
- **Latency:** Lower latency improves response time

### 10.3 Error Messages

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Unique constraint violation" | Duplicate extension/email | Use different extension or email |
| "Invalid file format" | Wrong file type | Upload CSV file only |
| "File size too large" | File over 5MB | Reduce file size or split into smaller files |
| "Network error" | Connection issue | Check internet connection and retry |
| "Session expired" | Timeout | Login again |

### 10.4 Contact Support

**For Technical Issues:**
- **Email:** support@actrec.gov.in
- **Phone:** Contact ACTREC IT Department
- **Documentation:** This user manual
- **Bug Reports:** Include steps to reproduce issue

---

## 11. Appendices

### Appendix A: Keyboard Shortcuts

| Action | Shortcut | Context |
|--------|----------|---------|
| Search Focus | Ctrl + / | Any page |
| Refresh | F5 or Ctrl + R | Any page |
| Back | Alt + ← | Browser navigation |
| Forward | Alt + → | Browser navigation |
| New Tab | Ctrl + T | Browser |
| Close Tab | Ctrl + W | Browser |

### Appendix B: Technical Specifications

**Technology Stack:**
- **Frontend:** Next.js 14.2.32 with React 18
- **UI Framework:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL)
- **Authentication:** Role-based access control
- **File Processing:** CSV import/export
- **Performance:** Turbo mode compilation
- **Security:** Encryption, HTTPS, RLS

**Browser Compatibility:**
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅
- Mobile browsers ✅

### Appendix C: Data Privacy

**Data Handling:**
- **Personal Information:** Stored securely in encrypted database
- **Access Logs:** Maintained for security auditing
- **Data Retention:** As per ACTREC policies
- **Export Rights:** Available through admin functions
- **Deletion Rights:** Contact administrator for data removal

**Privacy Features:**
- **Role-based Access:** Only authorized users can access data
- **Encryption:** All sensitive data encrypted at rest
- **Secure Transmission:** HTTPS for all communications
- **Audit Trail:** All actions logged for accountability

### Appendix D: API Documentation

**For Developers:**
- **Base URL:** `https://your-domain.com/api`
- **Authentication:** JWT tokens
- **Rate Limiting:** 1000 requests/hour per user
- **Documentation:** Available at `/api/docs`

**Available Endpoints:**
- `GET /api/contacts` - List all contacts
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact
- `POST /api/contacts/bulk` - Bulk upload
- `GET /api/search?q=term` - Search contacts

---

## Quick Reference Card

### Essential Actions

| Task | Steps | Location |
|------|-------|----------|
| **Login** | Homepage → Login → Enter credentials | Top of page |
| **Search** | Homepage → Search → Type query | Any page |
| **Add Contact** | Dashboard → Contact Management → Fill form → Add | Admin only |
| **Bulk Upload** | Dashboard → Bulk Operations → Choose file | Admin only |
| **Export Data** | Dashboard → Bulk Operations → Export button | Admin only |

### Demo Credentials

```
Administrator: admin / admin123
Regular User:  user / user123
```

### Support Information

```
Application: ACTREC Telephone Directory
Version: 1.0
Documentation: This user manual
Support: ACTREC IT Department
```

---

**Document Version:** 1.0  
**Last Updated:** August 26, 2025  
**Next Review:** As needed for updates  
**Prepared By:** Qoder AI Documentation System  

*This user manual covers all functionalities of the ACTREC Telephone Directory application. For technical support or feature requests, please contact the ACTREC IT Department.*