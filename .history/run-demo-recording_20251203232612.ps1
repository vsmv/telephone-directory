# ACTREC Telephone Directory - Automated Demo with Recording
# Duration: 10 minutes
# Automatically opens browser, starts recording, and guides through demo

param(
    [string]$RecorderType = "xbox"  # Options: xbox, obs, sharex, loom
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ACTREC TELEPHONE DIRECTORY" -ForegroundColor Cyan
Write-Host "  Automated 10-Minute Demo" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if dev server is running
Write-Host "`nChecking dev server..." -ForegroundColor Yellow
$serverRunning = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue

if (-not $serverRunning) {
    Write-Host "❌ ERROR: Dev server not running on port 3000" -ForegroundColor Red
    Write-Host "Please start: npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Dev server is running" -ForegroundColor Green

# Display configuration
Write-Host "`nDemo Configuration:" -ForegroundColor Cyan
Write-Host "  Duration: 10 minutes" -ForegroundColor White
Write-Host "  URL: http://localhost:3000" -ForegroundColor White
Write-Host "  Admin: jeyarish.venki@gmail.com / Welcome123$" -ForegroundColor White
Write-Host "  Test Cases: 10 comprehensive scenarios" -ForegroundColor White
Write-Host "  Recorder: $RecorderType" -ForegroundColor White

# Recording instructions
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  RECORDING SETUP" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow

switch ($RecorderType) {
    "xbox" {
        Write-Host "`nWindows Xbox Game Bar:" -ForegroundColor Cyan
        Write-Host "  1. Press Win + G (opens Game Bar)" -ForegroundColor White
        Write-Host "  2. Click 'Start Recording' OR Win + Alt + R" -ForegroundColor White
        Write-Host "  3. To Stop: Win + Alt + R" -ForegroundColor White
        Write-Host "  4. Saves to: $env:USERPROFILE\Videos\Captures\" -ForegroundColor Gray
        Write-Host "`n⚠️  Press Win + G NOW to prepare..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
    "obs" {
        Write-Host "`nOBS Studio:" -ForegroundColor Cyan
        Write-Host "  1. Open OBS Studio" -ForegroundColor White
        Write-Host "  2. Set Scene: Display Capture" -ForegroundColor White
        Write-Host "  3. Click 'Start Recording'" -ForegroundColor White
        Write-Host "`n⚠️  Start OBS Recording NOW..." -ForegroundColor Yellow
        Start-Sleep -Seconds 7
    }
    "sharex" {
        Write-Host "`nShareX:" -ForegroundColor Cyan
        Write-Host "  1. Open ShareX" -ForegroundColor White
        Write-Host "  2. Capture > Screen Recording" -ForegroundColor White
        Write-Host "  3. Select area to record" -ForegroundColor White
        Write-Host "`n⚠️  Start ShareX Recording NOW..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
    "loom" {
        Write-Host "`nLoom:" -ForegroundColor Cyan
        Write-Host "  1. Open Loom Desktop App" -ForegroundColor White
        Write-Host "  2. Select 'Screen + Camera' or 'Screen Only'" -ForegroundColor White
        Write-Host "  3. Click 'Start Recording'" -ForegroundColor White
        Write-Host "`n⚠️  Start Loom Recording NOW..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}

Write-Host "`n✓ Opening browser in 3 seconds..." -ForegroundColor Green
Start-Sleep -Seconds 3

# Open browser
Start-Process "http://localhost:3000"
Start-Sleep -Seconds 2

# Display demo script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DEMO SCRIPT - FOLLOW THESE STEPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n⏱️  MINUTE 1: Landing & Public Search (0:00-1:00)" -ForegroundColor Yellow
Write-Host "   Actions:" -ForegroundColor White
Write-Host "   • Show landing page with ACTREC branding" -ForegroundColor Gray
Write-Host "   • Highlight 'Search Directory' and 'Login' buttons" -ForegroundColor Gray
Write-Host "   • Click 'Search Directory'" -ForegroundColor Gray
Write-Host "   • Search: 'Medical' (demonstrate public search)" -ForegroundColor Gray
Write-Host "   • Show search results" -ForegroundColor Gray
Write-Host "   • Click 'Back to Home'" -ForegroundColor Gray
Read-Host "`n   Press ENTER when ready for next section"

Write-Host "`n⏱️  MINUTE 2: Admin Login (1:00-2:00)" -ForegroundColor Yellow
Write-Host "   Actions:" -ForegroundColor White
Write-Host "   • Click 'Login' button" -ForegroundColor Gray
Write-Host "   • Enter: jeyarish.venki@gmail.com" -ForegroundColor Gray
Write-Host "   • Enter: Welcome123$" -ForegroundColor Gray
Write-Host "   • Click 'Sign In'" -ForegroundColor Gray
Write-Host "   • Show admin dashboard with ALL tabs:" -ForegroundColor Gray
Write-Host "     - Contact Management" -ForegroundColor DarkGray
Write-Host "     - Bulk Operations" -ForegroundColor DarkGray
Write-Host "     - User Management" -ForegroundColor DarkGray
Write-Host "     - Search" -ForegroundColor DarkGray
Write-Host "     - Learning Plans" -ForegroundColor DarkGray
Write-Host "     - Patentable Ideas" -ForegroundColor DarkGray
Write-Host "     - Settings" -ForegroundColor DarkGray
Read-Host "`n   Press ENTER when ready for next section"

Write-Host "`n⏱️  MINUTE 3-4: Contact Management (2:00-4:00)" -ForegroundColor Yellow
Write-Host "   Actions:" -ForegroundColor White
Write-Host "   • Stay on 'Contact Management' tab" -ForegroundColor Gray
Write-Host "   • Click 'Add Contact'" -ForegroundColor Gray
Write-Host "   • Fill in:" -ForegroundColor Gray
Write-Host "     - Name: DR. DEMO TEST" -ForegroundColor DarkGray
Write-Host "     - Department: Research" -ForegroundColor DarkGray
Write-Host "     - Designation: Scientist" -ForegroundColor DarkGray
Write-Host "     - Phone: -7690, Ext: 5700" -ForegroundColor DarkGray
Write-Host "     - Email: demo.test@actrec.gov.in" -ForegroundColor DarkGray
Write-Host "     - Location: Sixth Floor, Institution: ACTREC" -ForegroundColor DarkGray
Write-Host "   • Click 'Create Contact'" -ForegroundColor Gray
Write-Host "   • Show success message" -ForegroundColor Gray
Write-Host "   • Find contact in list, click 'Edit'" -ForegroundColor Gray
Write-Host "   • Change Extension to: 5750" -ForegroundColor Gray
Write-Host "   • Click 'Update', show success" -ForegroundColor Gray
Write-Host "   • Click 'Delete', confirm deletion" -ForegroundColor Gray
Read-Host "`n   Press ENTER when ready for next section"

Write-Host "`n⏱️  MINUTE 5: Bulk Upload (4:00-5:00)" -ForegroundColor Yellow
Write-Host "   Actions:" -ForegroundColor White
Write-Host "   • Click 'Bulk Operations' tab" -ForegroundColor Gray
Write-Host "   • Scroll to 'Bulk Upload Contacts'" -ForegroundColor Gray
Write-Host "   • Click 'Choose File'" -ForegroundColor Gray
Write-Host "   • Select: sample-contacts.csv" -ForegroundColor Gray
Write-Host "   • Show preview: 5 contacts" -ForegroundColor Gray
Write-Host "   • Click 'Upload Contacts'" -ForegroundColor Gray
Write-Host "   • Wait for success message" -ForegroundColor Gray
Write-Host "   • Go back to 'Contact Management'" -ForegroundColor Gray
Write-Host "   • Scroll to show new contacts added" -ForegroundColor Gray
Read-Host "`n   Press ENTER when ready for next section"

Write-Host "`n⏱️  MINUTE 6: User Management (5:00-6:00)" -ForegroundColor Yellow
Write-Host "   Actions:" -ForegroundColor White
Write-Host "   • Click 'User Management' tab" -ForegroundColor Gray
Write-Host "   • Show existing users list" -ForegroundColor Gray
Write-Host "   • Click 'Add User'" -ForegroundColor Gray
Write-Host "   • Enter:" -ForegroundColor Gray
Write-Host "     - Email: demo.user@actrec.gov.in" -ForegroundColor DarkGray
Write-Host "     - Password: Demo123$" -ForegroundColor DarkGray
Write-Host "     - Role: Regular User" -ForegroundColor DarkGray
Write-Host "   • Click 'Create User'" -ForegroundColor Gray
Write-Host "   • Show success and user in list" -ForegroundColor Gray
Write-Host "   • Find user, click 'Change Role'" -ForegroundColor Gray
Write-Host "   • Change to: Admin" -ForegroundColor Gray
Write-Host "   • Confirm, show role updated" -ForegroundColor Gray
Read-Host "`n   Press ENTER when ready for next section"

Write-Host "`n⏱️  MINUTE 7: Bulk Operations (6:00-7:00)" -ForegroundColor Yellow
Write-Host "   Actions:" -ForegroundColor White
Write-Host "   • In 'User Management' tab" -ForegroundColor Gray
Write-Host "   • Select 2-3 users (checkboxes)" -ForegroundColor Gray
Write-Host "   • Click 'Bulk Change Role'" -ForegroundColor Gray
Write-Host "   • Select: Regular User" -ForegroundColor Gray
Write-Host "   • Confirm, show success" -ForegroundColor Gray
Write-Host "   • Keep users selected" -ForegroundColor Gray
Write-Host "   • Click 'Bulk Reset Password'" -ForegroundColor Gray
Write-Host "   • Enter: NewPass123$" -ForegroundColor Gray
Write-Host "   • Confirm, show success message" -ForegroundColor Gray
Read-Host "`n   Press ENTER when ready for next section"

Write-Host "`n⏱️  MINUTE 8: Learning Plans (7:00-8:00)" -ForegroundColor Yellow
Write-Host "   Actions:" -ForegroundColor White
Write-Host "   • Click 'Learning Plans' tab" -ForegroundColor Gray
Write-Host "   • Click 'Add Learning Plan'" -ForegroundColor Gray
Write-Host "   • Fill in:" -ForegroundColor Gray
Write-Host "     - Title: Advanced NGS Analysis" -ForegroundColor DarkGray
Write-Host "     - Description: Training on next-gen sequencing" -ForegroundColor DarkGray
Write-Host "     - Category: Technical Skills" -ForegroundColor DarkGray
Write-Host "     - Status: In Progress" -ForegroundColor DarkGray
Write-Host "   • Click 'Create'" -ForegroundColor Gray
Write-Host "   • Show plan in list" -ForegroundColor Gray
Write-Host "   • Click 'Edit', change status to 'Completed'" -ForegroundColor Gray
Write-Host "   • Update and show success" -ForegroundColor Gray
Read-Host "`n   Press ENTER when ready for next section"

Write-Host "`n⏱️  MINUTE 9: Patentable Ideas (8:00-9:00)" -ForegroundColor Yellow
Write-Host "   Actions:" -ForegroundColor White
Write-Host "   • Click 'Patentable Ideas' tab" -ForegroundColor Gray
Write-Host "   • Click 'Add Idea'" -ForegroundColor Gray
Write-Host "   • Fill in:" -ForegroundColor Gray
Write-Host "     - Title: AI-Based Cancer Diagnosis" -ForegroundColor DarkGray
Write-Host "     - Description: Machine learning for early detection" -ForegroundColor DarkGray
Write-Host "     - Category: Software/Algorithm" -ForegroundColor DarkGray
Write-Host "     - Status: Under Review" -ForegroundColor DarkGray
Write-Host "   • Click 'Create'" -ForegroundColor Gray
Write-Host "   • Show idea in list" -ForegroundColor Gray
Write-Host "   • Click 'Edit', change status to 'Approved'" -ForegroundColor Gray
Write-Host "   • Update and show success" -ForegroundColor Gray
Read-Host "`n   Press ENTER when ready for next section"

Write-Host "`n⏱️  MINUTE 10: Reports & Summary (9:00-10:00)" -ForegroundColor Yellow
Write-Host "   Actions:" -ForegroundColor White
Write-Host "   • Click 'Settings' tab" -ForegroundColor Gray
Write-Host "   • Show System Statistics:" -ForegroundColor Gray
Write-Host "     - Total Contacts (click number)" -ForegroundColor DarkGray
Write-Host "     - Total Users (click number)" -ForegroundColor DarkGray
Write-Host "     - Admin/Regular counts" -ForegroundColor DarkGray
Write-Host "     - Learning Plans count" -ForegroundColor DarkGray
Write-Host "     - Patentable Ideas count" -ForegroundColor DarkGray
Write-Host "   • Demonstrate drill-down by clicking counts" -ForegroundColor Gray
Write-Host "   • Show Technical Information section" -ForegroundColor Gray
Write-Host "   • Click 'User View' button" -ForegroundColor Gray
Write-Host "   • Show limited regular user view" -ForegroundColor Gray
Write-Host "   • Return to admin, then 'Logout'" -ForegroundColor Gray
Write-Host "   • Show landing page (demo complete)" -ForegroundColor Gray

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  DEMO COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`n📹 Remember to STOP your recording!" -ForegroundColor Yellow
switch ($RecorderType) {
    "xbox" { Write-Host "   Press Win + Alt + R to stop" -ForegroundColor White }
    "obs" { Write-Host "   Click 'Stop Recording' in OBS" -ForegroundColor White }
    "sharex" { Write-Host "   Press hotkey to stop ShareX" -ForegroundColor White }
    "loom" { Write-Host "   Click 'Stop' in Loom" -ForegroundColor White }
}

Write-Host "`n📁 Video saved to:" -ForegroundColor Cyan
switch ($RecorderType) {
    "xbox" { Write-Host "   $env:USERPROFILE\Videos\Captures\" -ForegroundColor White }
    "obs" { Write-Host "   Check your OBS output folder" -ForegroundColor White }
    "sharex" { Write-Host "   Check ShareX Screenshots folder" -ForegroundColor White }
    "loom" { Write-Host "   Available in Loom dashboard (cloud)" -ForegroundColor White }
}

Write-Host "`n✅ Next Steps:" -ForegroundColor Green
Write-Host "   1. Review video quality" -ForegroundColor White
Write-Host "   2. Rename to: ACTREC_Demo_10min_[date].mp4" -ForegroundColor White
Write-Host "   3. Upload to Google Drive/OneDrive" -ForegroundColor White
Write-Host "   4. Share link with ACTREC management" -ForegroundColor White

Write-Host "`n========================================`n" -ForegroundColor Cyan
