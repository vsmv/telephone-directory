# 🚀 ACTREC Telephone Directory - Supabase Automation Scripts

This repository contains comprehensive automation scripts to set up Docker, Supabase CLI, and manage the ACTREC Telephone Directory project from beginning to end.

## 📋 Available Scripts

### 🖥️ **Windows PowerShell** (Recommended)
```powershell
.\setup-supabase-automation.ps1
```

### 🐧 **Linux/Mac Bash**
```bash
chmod +x setup-supabase-automation.sh
./setup-supabase-automation.sh
```

### 🪟 **Windows CMD/Batch**
```cmd
setup-supabase-automation.bat
```

## 🎯 Features

### ✅ **Automated Setup**
- **Prerequisites Check**: Verifies Docker, Node.js, npm installation
- **Supabase CLI Installation**: Installs via npx automatically
- **Docker Management**: Starts/stops Docker services
- **Project Initialization**: Sets up local Supabase project
- **Schema Deployment**: Deploys database schema automatically

### 🔧 **Interactive Menu**
1. **Check Prerequisites** - Verify all required software
2. **Install Supabase CLI** - Install/verify Supabase CLI
3. **Initialize Local Project** - Set up local Supabase project
4. **Start Local Supabase** - Launch local development environment
5. **Stop Local Supabase** - Stop local services
6. **Connect to Remote Supabase** - Link to staging/production
7. **Deploy Schema** - Push database schema changes
8. **Run SQL Query** - Execute custom SQL queries
9. **Show Project Status** - Display current project state
10. **Full Setup** - Run complete setup (options 1-4)

### 🎨 **User Experience**
- **Colored Output**: Easy-to-read status messages
- **Error Handling**: Comprehensive error checking
- **Progress Indicators**: Clear feedback on operations
- **Cross-Platform**: Works on Windows, Linux, and Mac

## 🚀 Quick Start

### **Option 1: Full Automated Setup**
```bash
# Linux/Mac
./setup-supabase-automation.sh setup

# Windows PowerShell
.\setup-supabase-automation.ps1 -Action setup

# Windows CMD
setup-supabase-automation.bat
# Then select "setup" option
```

### **Option 2: Interactive Menu**
```bash
# Linux/Mac
./setup-supabase-automation.sh

# Windows PowerShell
.\setup-supabase-automation.ps1

# Windows CMD
setup-supabase-automation.bat
```

## 📋 Prerequisites

### **Required Software**
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### **Optional but Recommended**
- **Git** - For version control
- **VS Code** - For code editing

## 🔧 Detailed Usage

### **1. Initial Setup**
```bash
# Run the script
./setup-supabase-automation.sh

# Select "Full Setup" or run individual steps:
# 1. Check Prerequisites
# 2. Install Supabase CLI  
# 3. Initialize Local Project
# 4. Start Local Supabase
```

### **2. Connect to Remote Supabase**
```bash
# Option 6 in menu
# You'll need:
# - Project Reference (e.g., pcrukmbtjyuuzwszsdsl)
# - Database Password
```

### **3. Deploy Schema**
```bash
# Option 7 in menu
# Requires: supabase/schema.sql file
# Pushes schema to connected database
```

### **4. Development Workflow**
```bash
# Start local development
./setup-supabase-automation.sh start

# Check status
./setup-supabase-automation.sh status

# Stop when done
./setup-supabase-automation.sh stop
```

## 🗂️ Project Structure

After running the automation, your project will have:

```
actrec-telephone-directory/
├── supabase/
│   ├── config.toml
│   ├── schema.sql
│   └── migrations/
├── .env.local
├── package.json
├── setup-supabase-automation.ps1
├── setup-supabase-automation.sh
└── setup-supabase-automation.bat
```

## 🔍 Troubleshooting

### **Common Issues**

#### **Docker Not Running**
```bash
# Error: Docker is not running
# Solution: Start Docker Desktop application
```

#### **Port Already in Use**
```bash
# Error: Port 54321 already in use
# Solution: Stop existing Supabase instance
./setup-supabase-automation.sh stop
```

#### **Permission Denied (Linux/Mac)**
```bash
# Error: Permission denied
# Solution: Make script executable
chmod +x setup-supabase-automation.sh
```

#### **PowerShell Execution Policy (Windows)**
```powershell
# Error: Execution policy restriction
# Solution: Allow script execution
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **Reset Everything**
```bash
# Stop all services
npx supabase stop

# Remove Supabase directory
rm -rf supabase

# Re-run setup
./setup-supabase-automation.sh setup
```

## 🌐 Environment Configuration

### **Local Development**
```bash
# Automatically configured by script
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=<generated-key>
```

### **Remote Connection**
```bash
# Configure in .env.local after connecting
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📊 Monitoring & Status

### **Check Everything**
```bash
# Option 9 in menu shows:
# - Supabase services status
# - Docker containers
# - Project file structure
# - Connection details
```

### **Manual Commands**
```bash
# Supabase status
npx supabase status

# Docker containers
docker ps

# Database connection test
npx supabase db query "SELECT version();"
```

## 🔄 Advanced Usage

### **Command Line Arguments**

#### **PowerShell**
```powershell
# Direct actions
.\setup-supabase-automation.ps1 -Action check
.\setup-supabase-automation.ps1 -Action setup
.\setup-supabase-automation.ps1 -Action start
.\setup-supabase-automation.ps1 -Action stop

# With parameters
.\setup-supabase-automation.ps1 -Action connect -ProjectRef "your-ref" -DatabasePassword "your-password"
```

#### **Bash**
```bash
# Direct actions
./setup-supabase-automation.sh check
./setup-supabase-automation.sh setup
./setup-supabase-automation.sh start
./setup-supabase-automation.sh stop

# With parameters
./setup-supabase-automation.sh connect "your-ref" "your-password"
```

### **Custom SQL Queries**
```bash
# Interactive query
./setup-supabase-automation.sh
# Select option 8

# Direct query
npx supabase db query "SELECT * FROM contacts LIMIT 5;"
```

## 🎯 Integration with ACTREC Project

### **After Setup**
1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Access Local Services**
   - **App**: http://localhost:3000
   - **Supabase Studio**: http://localhost:54323
   - **Database**: localhost:54322

3. **Deploy to Production**
   ```bash
   # Connect to remote
   ./setup-supabase-automation.sh connect
   
   # Deploy schema
   ./setup-supabase-automation.sh deploy
   ```

## 🆘 Support

### **Script Issues**
- Check prerequisites are installed
- Ensure Docker is running
- Verify network connectivity
- Check file permissions

### **Supabase Issues**
- Review Supabase documentation
- Check project configuration
- Verify database credentials
- Monitor Docker logs

### **Project Issues**
- Ensure all dependencies installed
- Check environment variables
- Verify database schema
- Review application logs

## 📝 License

This automation script is part of the ACTREC Telephone Directory project and follows the same licensing terms.

---

**🎉 Happy Development!** 

These scripts will get your ACTREC Telephone Directory project up and running quickly with full Supabase integration.