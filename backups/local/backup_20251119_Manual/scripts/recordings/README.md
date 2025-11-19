# Application Demo Recording Scripts

This directory contains Puppeteer scripts to record demonstrations of the ACTREC Telephone Directory application for client presentation.

## Prerequisites

1. Ensure the application is running on `http://localhost:3001`
2. Make sure all required npm packages are installed (puppeteer is already included)
3. Ensure you have the following demo credentials:
   - Admin: `admin@actrec.gov.in` / `admin123`
   - Regular User: `user@actrec.gov.in` / `user123`

## Available Recording Scripts

### 1. Full Demo Suite
Records all roles and transactions sequentially:
```bash
node scripts/recordings/full-demo.js
```

### 2. Individual Role Demos
- **Admin Role Demo**: `node scripts/recordings/admin-demo.js`
- **User Role Demo**: `node scripts/recordings/user-demo.js`
- **Public Search Demo**: `node scripts/recordings/public-search-demo.js`

### 3. Windows Automated Recording (Recommended for Windows Users)
For Windows users, we provide automated recording scripts that combine Puppeteer automation with Windows Snip:
- **Interactive Windows Recorder**: Double-click `windows-record-demo.bat`
- **PowerShell Script**: `windows-record-demo.ps1`

## What Each Demo Covers

### Admin Role Demo
1. Login as administrator
2. Navigate all dashboard tabs:
   - Contact Management (Add, Edit, Delete)
   - Bulk Operations
   - User Management
   - Search (with CSV export)
   - Learning Plans (Add/Edit)
   - Patentable Ideas (Add/Edit)
   - Settings (Password change)
3. Logout

### User Role Demo
1. Login as regular user
2. Navigate user dashboard tabs:
   - Search
   - Learning Plans (Add/Edit personal plans)
   - Patentable Ideas (Add/Edit personal ideas)
   - Settings (Password change)
3. Logout

### Public Search Demo
1. Access public search without login
2. Perform various search operations:
   - Basic search
   - Wildcard search
   - Search by department
   - Search by email
   - Search by extension
   - Search by location
3. Return to home page

## Running the Demos

### Method 1: Using npm scripts (Cross-platform)
1. Start the application:
   ```bash
   npm run dev
   ```

2. Run a demo script:
   ```bash
   npm run demo:admin     # Admin role demo
   npm run demo:user      # User role demo
   npm run demo:public    # Public search demo
   npm run demo:full      # All demos
   ```

### Method 2: Direct node execution (Cross-platform)
```bash
node scripts/recordings/[script-name].js
```

### Method 3: Windows Automated Recording (Windows Only)
1. Ensure Xbox Game Bar recording is enabled in Windows Settings
2. Start the application: `npm run dev`
3. Double-click `windows-record-demo.bat`
4. Select the desired demo from the menu
5. Follow on-screen instructions
6. Recordings are automatically saved to `Videos\Captures` folder

## Notes

- Demos run in non-headless mode so you can see the actions
- Operations are slowed down for better viewing
- Videos are not automatically saved (Puppeteer video recording requires additional setup)
- For actual video recording, use your system's screen recording software while running these demos
- Windows users can use the automated recording solution for one-click recording

## Troubleshooting

If a demo fails:
1. Ensure the application is running on port 3001
2. Verify demo credentials are correct
3. Check that all required UI elements are present and accessible
4. Increase timeout values in the scripts if needed

For Windows recording issues:
1. Ensure Xbox Game Bar is enabled in Windows Settings
2. Check that Game DVR is enabled
3. Verify sufficient disk space in `Videos\Captures` folder
4. Make sure no other recording is in progress