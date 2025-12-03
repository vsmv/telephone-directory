# 🎬 ACTREC Demo - Quick Reference Card

## 🚀 AUTOMATED DEMO SCRIPTS (NEW!)

### Windows (PowerShell):
```powershell
# Default (Xbox Game Bar)
.\run-demo-recording.ps1

# With OBS Studio
.\run-demo-recording.ps1 -RecorderType obs

# With ShareX
.\run-demo-recording.ps1 -RecorderType sharex

# With Loom
.\run-demo-recording.ps1 -RecorderType loom
```

### Linux/Mac (Bash):
```bash
# Make executable (first time only)
chmod +x run-demo-recording.sh

# Default (SimpleScreenRecorder)
./run-demo-recording.sh

# With OBS Studio
./run-demo-recording.sh obs

# With Kazam (Linux)
./run-demo-recording.sh kazam

# With QuickTime (Mac)
./run-demo-recording.sh quicktime
```

**What the scripts do:**
- ✅ Check dev server is running
- ✅ Open browser automatically
- ✅ Guide you through each demo step
- ✅ Pause between sections (press ENTER to continue)
- ✅ Total duration: 10 minutes

---

## 🔑 Login Credentials

**Admin Account:**
- Email: `jeyarish.venki@gmail.com`
- Password: `Welcome123$`

**Test User (to create during demo):**
- Email: `test.user@actrec.gov.in`
- Password: `Test123$`

---

## 🌐 URLs

- **Application:** http://localhost:3000
- **Direct Login:** http://localhost:3000/auth/login
- **Direct Search:** http://localhost:3000/search
- **Admin Dashboard:** http://localhost:3000/admin (requires admin login)

---

## 📹 Recommended Screen Recorders

### Option 1: Windows Xbox Game Bar (Built-in - Free)
- **Start:** Press `Win + G`
- **Record:** Click record button or `Win + Alt + R`
- **Stop:** `Win + Alt + R` again
- **Location:** `C:\Users\[YourName]\Videos\Captures\`
- **Format:** MP4
- ✅ **Best for:** Quick recording, no install needed

### Option 2: OBS Studio (Free - Best Quality)
- **Download:** https://obsproject.com/
- **Pros:** Professional quality, many options
- **Cons:** Requires setup
- ✅ **Best for:** High-quality professional demo

### Option 3: ShareX (Free - Easy)
- **Download:** https://getsharex.com/
- **Pros:** Very lightweight, easy to use
- **Cons:** Basic features
- ✅ **Best for:** Simple, quick recording

### Option 4: Loom (Free/Paid)
- **Website:** https://www.loom.com/
- **Pros:** Cloud-based, easy sharing, webcam overlay
- **Cons:** Free plan has limits
- ✅ **Best for:** Instant sharing with management

---

## 📊 Test Case Quick List

| # | Test Case | Time | Key Actions |
|---|-----------|------|-------------|
| 1 | Landing Page & Public Search | 2m | Show public access, search without login |
| 2 | Admin Login & Dashboard | 2m | Login, show all admin tabs |
| 3 | Single Contact Creation | 3m | Create one contact with all fields |
| 4 | Contact Edit & Delete | 2m | Edit then delete a contact |
| 5 | Bulk Contact Upload | 3m | Import 5 contacts from CSV |
| 6 | Bulk Contact Export | 2m | Download all contacts as CSV |
| 7 | Create User | 3m | Create new regular user |
| 8 | Single Role Change | 2m | Change user role admin ↔ regular |
| 9 | Single Password Reset | 2m | Reset one user's password |
| 10 | Bulk User Operations | 3m | Bulk role change, password reset, delete |
| 11 | Learning Plans | 4m | Create, edit, delete learning plan |
| 12 | Patentable Ideas | 4m | Create, edit, delete patentable idea |
| 13 | Admin Settings & Reports | 5m | Show statistics, clickable counts |
| 14 | Search Functionality | 3m | Advanced search with filters |
| 15 | User View (Regular User) | 3m | Show limited regular user access |
| 16 | Logout & Security | 1m | Logout, verify protected routes |

**Total Time:** ~45-50 minutes

---

## 🎯 Demo Recording Strategy

### Recommended Split (3 Videos):

**Video 1: Contact Management (15 min)**
- Test Cases 1-6
- Landing page → Login → Contact CRUD → Bulk operations

**Video 2: User Management (15 min)**
- Test Cases 7-10
- User creation → Role changes → Password resets → Bulk operations

**Video 3: Advanced Features (20 min)**
- Test Cases 11-16
- Learning Plans → Ideas → Reports → Search → Security

---

## ✅ Pre-Recording Checklist

**Technical Setup:**
- [ ] Dev server running: http://localhost:3000
- [ ] Check: Landing page loads
- [ ] Check: Can login with admin credentials
- [ ] Check: Database connected (contacts load)
- [ ] File ready: `sample-contacts.csv` in root folder

**Recording Setup:**
- [ ] Screen recorder tested
- [ ] Audio working (if narrating)
- [ ] Browser at 100% zoom
- [ ] Close unnecessary tabs/windows
- [ ] Close notifications (Do Not Disturb mode)
- [ ] Full screen browser (F11) or maximize window

**Presentation Setup:**
- [ ] Script printed or on second screen
- [ ] Test data prepared
- [ ] Credentials written down
- [ ] Glass of water nearby
- [ ] Good lighting (if webcam)

---

## 🎤 Narration Script (Optional)

### Opening (30 seconds):
> "Hello, this is a demonstration of the ACTREC Telephone Directory System. This application provides comprehensive contact management, user administration, and research collaboration tools for ACTREC staff. Let me show you the key features."

### During Demo:
- State each test case clearly: "Test Case 3: Bulk Contact Upload"
- Explain what you're doing: "Now I'm uploading 5 contacts from a CSV file"
- Point out success messages: "Notice the confirmation message"
- Highlight key features: "This shows all contacts were imported successfully"

### Closing (30 seconds):
> "This concludes the demonstration. We've covered all major features including contact management, user administration, learning plans, patentable ideas, and comprehensive reporting. The system is ready for production use at ACTREC."

---

## 🔧 Troubleshooting During Demo

**If login fails:**
- Check credentials are typed correctly
- Check dev server is still running
- Check database connection in terminal

**If page doesn't load:**
- Check URL is http://localhost:3000
- Refresh page (F5)
- Check terminal for errors

**If feature doesn't work:**
- Take note and continue
- Come back to it at end if time permits
- Document issue for post-demo review

---

## 📤 After Recording

**Video Files:**
1. Check video quality (playable, audio clear)
2. Rename files descriptively:
   - `ACTREC_Demo_Part1_ContactManagement.mp4`
   - `ACTREC_Demo_Part2_UserManagement.mp4`
   - `ACTREC_Demo_Part3_AdvancedFeatures.mp4`

**Share with ACTREC Management:**
- Upload to Google Drive / OneDrive / SharePoint
- Generate shareable links
- Include this reference card
- Include full demo script: `DEMO-TEST-SCRIPT.md`

---

## 📞 Support Contacts

**Developer:** Jeyarish
**Project:** ACTREC Telephone Directory
**Demo Date:** December 2025
**Version:** 1.0.0

---

**Good luck with your demo! 🎬**
