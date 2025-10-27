# ACTREC Telephone Directory - Screenshot Capture Guide

This guide helps you capture screenshots of all key functionalities for documentation purposes.

## Prerequisites
- Application running at `http://localhost:3000` (development) or your deployed URL
- Screen capture tool ready (Windows Snipping Tool, macOS Screenshot, or browser developer tools)
- Demo credentials available: admin/admin123 and user/user123

## Screenshot Checklist

### 1. Homepage (Landing Page)
**URL:** `http://localhost:3000`
**What to capture:**
- [ ] Full page showing gradient background
- [ ] Main title: "ACTREC Consolidated Telephone Directory"
- [ ] Three action cards: Login, Search, Admin Dashboard
- [ ] Demo credentials section
- [ ] Sample contact data preview

**Screenshot name:** `01-homepage-overview.png`

### 2. Login Page
**URL:** `http://localhost:3000/auth/login`
**What to capture:**
- [ ] Login form with username/email field
- [ ] Password field (with placeholder dots)
- [ ] Login button and Back to Home button
- [ ] Clean, centered design

**Screenshot name:** `02-login-page.png`

### 3. Search Directory - Empty State
**URL:** `http://localhost:3000/search`
**What to capture:**
- [ ] Search input field with placeholder text
- [ ] Empty results area
- [ ] Search instructions or help text
- [ ] Navigation elements

**Screenshot name:** `03-search-empty.png`

### 4. Search Directory - With Results
**Steps:**
1. Go to `http://localhost:3000/search`
2. Type "Doctor" in search box
3. Wait for results to appear

**What to capture:**
- [ ] Search input with "Doctor" typed
- [ ] Contact cards showing search results
- [ ] Contact information displayed (name, department, phone, email, location)
- [ ] Real-time search in action

**Screenshot name:** `04-search-results.png`

### 5. Wildcard Search Example
**Steps:**
1. Go to search page
2. Type "Doctor*" in search box
3. Capture results showing wildcard functionality

**What to capture:**
- [ ] Search input showing wildcard pattern "Doctor*"
- [ ] Results filtered by wildcard pattern
- [ ] Multiple matching contacts

**Screenshot name:** `05-wildcard-search.png`

### 6. Admin Login Process
**Steps:**
1. Go to login page
2. Enter "admin" in username field
3. Enter "admin123" in password field
4. **Don't click login yet - capture the filled form**

**What to capture:**
- [ ] Form fields populated with admin credentials
- [ ] Both username and password fields visible
- [ ] Cursor ready to click Login button

**Screenshot name:** `06-admin-login-form.png`

### 7. Admin Dashboard Overview
**Steps:**
1. Complete admin login (click Login button)
2. Navigate to dashboard or get redirected automatically

**What to capture:**
- [ ] Dashboard header with "Admin Dashboard"
- [ ] Tab navigation: Contact Management, Bulk Operations, Patentable Ideas, Learning Plans, Settings
- [ ] Active tab highlighted
- [ ] Welcome message or user info

**Screenshot name:** `07-admin-dashboard-overview.png`

### 8. Contact Management Tab
**URL:** Admin Dashboard → Contact Management tab
**What to capture:**
- [ ] Left panel: Add/Edit contact form with all fields
- [ ] Right panel: Current contacts list
- [ ] Contact cards with checkboxes, edit/delete buttons
- [ ] Bulk operations area (if contacts selected)

**Screenshot name:** `08-contact-management.png`

### 9. Add New Contact Form
**Steps:**
1. Stay in Contact Management tab
2. Fill out the add contact form with sample data:
   - Name: "DR. JOHN DOE"
   - Department: "Oncology"
   - Designation: "Doctor"
   - Phone: "-7674"
   - Extension: "5045"
   - Email: "john.doe@actrec.gov.in"
   - Location: "Third Floor"
   - Institution: "ACTREC"

**What to capture:**
- [ ] Form completely filled out
- [ ] All field labels visible
- [ ] Required field indicators (*)
- [ ] "Add Contact" button ready to click

**Screenshot name:** `09-add-contact-form.png`

### 10. Contact Added Successfully
**Steps:**
1. Click "Add Contact" from previous step
2. Wait for success message and contact to appear in list

**What to capture:**
- [ ] Success toast/message showing contact added
- [ ] New contact appearing in the contacts list
- [ ] Form cleared and ready for next entry
- [ ] Updated contact count

**Screenshot name:** `10-contact-added-success.png`

### 11. Edit Contact Form
**Steps:**
1. Click the edit button (✏️) on any existing contact
2. Form should populate with existing data

**What to capture:**
- [ ] Form title changed to "Edit Contact"
- [ ] All fields populated with existing contact data
- [ ] "Update Contact" and "Cancel" buttons visible
- [ ] Form shows edited state

**Screenshot name:** `11-edit-contact-form.png`

### 12. Bulk Selection and Operations
**Steps:**
1. Select multiple contacts using checkboxes
2. Wait for bulk operations panel to appear

**What to capture:**
- [ ] Multiple contacts selected (checkboxes checked)
- [ ] Selected contacts highlighted
- [ ] Bulk operations panel visible
- [ ] "Delete Selected (X)" button showing count
- [ ] Bulk edit fields if available

**Screenshot name:** `12-bulk-operations.png`

### 13. Bulk Upload Tab
**URL:** Admin Dashboard → Bulk Operations tab
**What to capture:**
- [ ] CSV upload area
- [ ] "Choose CSV File" button
- [ ] CSV format requirements listed
- [ ] File size limit information
- [ ] Example CSV format shown

**Screenshot name:** `13-bulk-upload.png`

### 14. CSV Export Feature
**Same tab as above, right panel:**
**What to capture:**
- [ ] "Export All Contacts (X)" button with count
- [ ] Export description and file format info
- [ ] Download instructions

**Screenshot name:** `14-csv-export.png`

### 15. Patentable Ideas Tab
**URL:** Admin Dashboard → Patentable Ideas tab
**Steps:**
1. Fill out the add idea form:
   - Title: "AI for drug discovery in dementia via protein analysis"
   - Category: "AI Integration"
   - Description: "AI-integrated semantic search for PDB-linked contacts in dementia therapeutics"

**What to capture:**
- [ ] Add patentable idea form filled out
- [ ] Stored ideas list (if any exist)
- [ ] Security indicators (🔒)
- [ ] Category selection

**Screenshot name:** `15-patentable-ideas.png`

### 16. Learning Plans Tab
**URL:** Admin Dashboard → Learning Plans tab
**Steps:**
1. Fill out learning plan form:
   - Title: "Oncology Expert Collaboration Guide"
   - Category: "Research Collaboration"
   - Description: Multi-line step-by-step guide

**What to capture:**
- [ ] Learning plan form filled out
- [ ] Multi-line text area with step-by-step content
- [ ] Stored learning plans list
- [ ] Category options

**Screenshot name:** `16-learning-plans.png`

### 17. Settings Tab
**URL:** Admin Dashboard → Settings tab
**What to capture:**
- [ ] Password change form
- [ ] System status panel showing contact counts
- [ ] Current system information
- [ ] Any additional admin settings

**Screenshot name:** `17-settings-tab.png`

### 18. Error Message Examples
**Steps to trigger various errors:**

**A. Invalid Login:**
1. Go to login page
2. Enter wrong credentials
3. Click login
4. Capture error message

**B. Duplicate Contact:**
1. Try adding contact with existing extension
2. Capture validation error

**C. Invalid CSV Upload:**
1. Try uploading non-CSV file
2. Capture upload error

**What to capture:**
- [ ] Error messages with clear text
- [ ] Error styling (red backgrounds, icons)
- [ ] User-friendly error descriptions

**Screenshot name:** `18-error-messages.png`

### 19. Success Messages
**Capture various success scenarios:**
- [ ] Contact added successfully
- [ ] Contact updated successfully
- [ ] Bulk upload completed
- [ ] CSV export initiated
- [ ] Idea stored successfully

**Screenshot name:** `19-success-messages.png`

### 20. Mobile Responsive View
**Steps:**
1. Open browser developer tools (F12)
2. Switch to mobile device simulation
3. Navigate through key pages

**What to capture:**
- [ ] Homepage on mobile
- [ ] Search functionality on mobile
- [ ] Dashboard navigation on mobile
- [ ] Contact forms on mobile

**Screenshot name:** `20-mobile-responsive.png`

## Screenshot Organization

Create a folder structure:
```
Screenshots/
├── 01-Navigation/
│   ├── 01-homepage-overview.png
│   ├── 02-login-page.png
│   └── 03-search-empty.png
├── 02-Search/
│   ├── 04-search-results.png
│   └── 05-wildcard-search.png
├── 03-Admin/
│   ├── 06-admin-login-form.png
│   ├── 07-admin-dashboard-overview.png
│   └── 08-contact-management.png
├── 04-CRUD/
│   ├── 09-add-contact-form.png
│   ├── 10-contact-added-success.png
│   └── 11-edit-contact-form.png
├── 05-Bulk/
│   ├── 12-bulk-operations.png
│   ├── 13-bulk-upload.png
│   └── 14-csv-export.png
├── 06-Bioinformatics/
│   ├── 15-patentable-ideas.png
│   └── 16-learning-plans.png
├── 07-System/
│   ├── 17-settings-tab.png
│   ├── 18-error-messages.png
│   └── 19-success-messages.png
└── 08-Mobile/
    └── 20-mobile-responsive.png
```

## Screenshot Quality Guidelines

### Technical Requirements
- **Resolution:** Minimum 1920x1080 for desktop screenshots
- **Format:** PNG (for crisp UI elements) or JPG (for photographs)
- **Browser:** Use Chrome or Firefox for consistent rendering
- **Zoom:** 100% browser zoom for accurate representation

### Composition Guidelines
- **Full Context:** Include enough surrounding UI for context
- **Focus Areas:** Highlight key features with arrows or callouts if needed
- **Clean State:** Ensure UI is in clean state (no loading indicators unless relevant)
- **Consistent Timing:** Wait for animations/transitions to complete

### Content Guidelines
- **Real Data:** Use meaningful sample data that represents actual usage
- **Privacy:** Avoid real personal information in screenshots
- **Consistency:** Use the same demo data across related screenshots
- **Completeness:** Show both empty states and populated states where relevant

## Post-Screenshot Tasks

### Image Editing (Optional)
1. **Crop:** Remove unnecessary browser chrome if needed
2. **Annotate:** Add callouts, arrows, or highlights for key features
3. **Resize:** Create thumbnail versions if needed
4. **Optimize:** Compress images for web use while maintaining quality

### Documentation Integration
1. **File Naming:** Use descriptive names that match the user manual sections
2. **Alt Text:** Prepare descriptive alt text for accessibility
3. **Captions:** Write clear captions explaining what each screenshot shows
4. **Cross-Reference:** Link screenshots to relevant manual sections

### Version Control
- **Date Screenshots:** Include capture date in metadata
- **Version Tracking:** Re-capture when UI changes
- **Backup:** Keep original high-resolution versions
- **Change Log:** Document when screenshots are updated

## Usage in Documentation

### HTML Integration
```html
<figure>
  <img src="screenshots/01-homepage-overview.png" 
       alt="ACTREC Directory homepage showing main navigation cards and demo credentials">
  <figcaption>Figure 1: Application homepage with main navigation options</figcaption>
</figure>
```

### Markdown Integration
```markdown
![Homepage Overview](screenshots/01-homepage-overview.png)
*Figure 1: Application homepage showing three main action cards and demo login credentials*
```

This screenshot guide ensures comprehensive visual documentation of all application features for user training and reference purposes.