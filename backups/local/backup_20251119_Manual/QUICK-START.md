# ACTREC Directory - Quick Start Guide

## 🚀 Immediate Access (5 Minutes)

### Step 1: Access the Application
**Local Development:** `http://localhost:3000`  
**Production (when deployed):** Your deployed URL

### Step 2: Demo Login Credentials
```
👑 Administrator Access:
   Username: admin
   Password: admin123
   
👤 Regular User Access:
   Username: user  
   Password: user123
```

### Step 3: Quick Feature Test

#### ✅ Test Search (No Login Required)
1. Click "🔍 Search Directory"
2. Type: `Doctor`
3. See results instantly

#### ✅ Test Admin Features (Login Required)
1. Click "🔐 User Login"
2. Enter admin credentials
3. Click "Login"
4. Explore admin dashboard tabs

## 📋 Feature Overview

| Feature | Access Level | Description |
|---------|--------------|-------------|
| **Homepage** | Public | Landing page with navigation |
| **Search** | Public | Real-time contact search with wildcards |
| **Login** | All Users | Role-based authentication |
| **Contact Management** | Admin Only | Add/Edit/Delete contacts |
| **Bulk Operations** | Admin Only | CSV upload/download |
| **Patentable Ideas** | Admin Only | Secure research idea storage |
| **Learning Plans** | Admin Only | Research collaboration guides |

## 🎯 Common Tasks

### Search for Contacts
```
1. Go to Search Directory
2. Type search term: "Medical", "Doctor", "5042", "@actrec"
3. Use wildcards: "Doctor*", "*Admin*", "Dr.?"
4. Results appear in real-time
```

### Add New Contact (Admin)
```
1. Login as admin
2. Go to Admin Dashboard → Contact Management
3. Fill required fields: Name*, Extension*, Email*
4. Click "Add Contact"
5. Contact appears in list
```

### Bulk Upload (Admin)
```
1. Prepare CSV with headers: Name,Department,Extension,Email...
2. Go to Admin Dashboard → Bulk Operations  
3. Click "Choose CSV File"
4. Review upload results
5. Check for duplicates and errors
```

## 🔧 Troubleshooting

### Can't Access Application
- ✅ Check URL: `http://localhost:3000`
- ✅ Ensure development server is running
- ✅ Try different browser (Chrome, Firefox, Safari)
- ✅ Clear browser cache and cookies

### Login Issues
- ✅ Use exact credentials: `admin/admin123`
- ✅ Check for extra spaces
- ✅ Ensure caps lock is off
- ✅ Try incognito/private browsing mode

### Search Not Working
- ✅ Wait 500ms for debounce
- ✅ Try shorter search terms
- ✅ Use wildcards: `*term*`
- ✅ Check if sample data is loaded

### Upload Fails
- ✅ Use CSV format only
- ✅ Check file size (under 5MB)  
- ✅ Include required headers exactly
- ✅ Verify data format matches examples

## 📞 Support Information

**Application:** ACTREC Telephone Directory v1.0  
**Documentation:** See USER-MANUAL.md for complete guide  
**Screenshots:** Follow SCREENSHOT-GUIDE.md for visual reference  
**Technical:** See TEST-RESULTS-REPORT.md for testing details  

---

**🎉 Ready to Use!** The application is fully functional with sample data and ready for production deployment.