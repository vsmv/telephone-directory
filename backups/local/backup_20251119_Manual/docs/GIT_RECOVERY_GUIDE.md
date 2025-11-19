# Git Recovery & Backup Guide

## Overview
This guide provides comprehensive instructions for maintaining, backing up, and recovering your ACTREC Telephone Directory project.

## Quick Reference

### Daily Backup
```powershell
.\scripts\backup-manager.ps1 -Action backup -Message "Daily backup"
```

### Check Status
```powershell
.\scripts\backup-manager.ps1 -Action status
```

### Create Tagged Backup
```powershell
.\scripts\backup-manager.ps1 -Action backup -BackupTag "before-major-change"
```

---

## Backup Strategy

### 1. Automated Git Backups
**Frequency**: After every significant change

**Command**:
```powershell
git add -A
git commit -m "feat: description of changes"
git push origin main
```

### 2. Local File Backups
**Location**: `backups/local/`

**What's Backed Up**:
- Source code (`/app`, `/components`, `/lib`)
- Configuration files
- Database schema
- Documentation

**Command**:
```powershell
.\scripts\backup-manager.ps1 -Action backup
```

### 3. Database Backups
**Location**: `backups/database/`

**What's Backed Up**:
- `schema.sql`
- Migration files
- Database configuration

### 4. Configuration Backups
**Location**: `backups/config/`

**What's Backed Up**:
- Environment files (example only, not actual secrets)
- TypeScript config
- Next.js config
- ESLint config

---

## Recovery Scenarios

### Scenario 1: Undo Last Commit (Not Pushed)
```powershell
# Undo commit but keep changes
git reset --soft HEAD~1

# Undo commit and discard changes
git reset --hard HEAD~1
```

### Scenario 2: Undo Last Commit (Already Pushed)
```powershell
# Create a new commit that undoes the last one
git revert HEAD
git push origin main
```

### Scenario 3: Recover Deleted File
```powershell
# Find the commit where file was deleted
git log --all --full-history -- path/to/file

# Restore from specific commit
git checkout <commit-hash> -- path/to/file
```

### Scenario 4: Restore Entire Project to Previous State
```powershell
# View commit history
git log --oneline

# Create new branch from specific commit
git checkout -b recovery-branch <commit-hash>

# Or reset current branch (DANGEROUS)
git reset --hard <commit-hash>
git push origin main --force
```

### Scenario 5: Recover from Local Backup
```powershell
# List available backups
.\scripts\backup-manager.ps1 -Action status

# Manually copy files from backups/local/backup_YYYYMMDD_HHMMSS/
```

### Scenario 6: Complete Project Loss
```powershell
# Clone from GitHub
git clone https://github.com/vsmv/telephone-directory.git
cd telephone-directory

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migrations
npm run supabase:reset

# Start development
npm run dev
```

---

## Git Best Practices

### Commit Message Format
```
<type>: <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples**:
```
feat: Add CSV export functionality
fix: Resolve duplicate extension validation
docs: Update API documentation
refactor: Simplify authentication logic
test: Add integration tests for contacts
chore: Update dependencies
```

### Branching Strategy
```
main (production)
  ├── develop (integration)
  │   ├── feature/contact-export
  │   ├── feature/advanced-search
  │   └── bugfix/login-issue
  └── hotfix/critical-security-patch
```

### Before Making Major Changes
```powershell
# 1. Create backup
.\scripts\backup-manager.ps1 -Action backup -BackupTag "before-refactor"

# 2. Create feature branch
git checkout -b feature/my-new-feature

# 3. Make changes and commit frequently
git add .
git commit -m "feat: implement part 1"

# 4. Push to remote
git push origin feature/my-new-feature
```

---

## GitHub Repository Management

### Check Remote Connection
```powershell
git remote -v
# Should show: origin  https://github.com/vsmv/telephone-directory
```

### Update Remote URL (if needed)
```powershell
git remote set-url origin https://github.com/vsmv/telephone-directory.git
```

### Verify Push Access
```powershell
git push origin main --dry-run
```

### Clone Repository (Fresh Start)
```powershell
git clone https://github.com/vsmv/telephone-directory.git
```

---

## Backup Verification

### Verify Git Backup
```powershell
# Check last commit
git log -1

# Verify remote sync
git fetch origin
git status
```

### Verify Local Backup
```powershell
# List backups
Get-ChildItem backups/local -Directory | Sort-Object LastWriteTime -Descending

# Check backup contents
Get-ChildItem backups/local/backup_YYYYMMDD_HHMMSS
```

### Verify Database Backup
```powershell
# Check schema backup
Get-Content backups/database/schema_latest.sql | Select-Object -First 20
```

---

## Emergency Recovery Procedures

### Complete System Failure
1. **Clone from GitHub**:
   ```powershell
   git clone https://github.com/vsmv/telephone-directory.git
   cd telephone-directory
   ```

2. **Install Dependencies**:
   ```powershell
   npm install
   ```

3. **Configure Environment**:
   ```powershell
   cp .env.local.example .env.local
   # Edit with your credentials
   ```

4. **Restore Database**:
   ```powershell
   # Run migrations
   npm run supabase:reset
   ```

5. **Verify**:
   ```powershell
   npm run dev
   ```

### Lost Git History
1. **Check GitHub**:
   - Visit: https://github.com/vsmv/telephone-directory
   - Verify commits are present

2. **Re-clone if needed**:
   ```powershell
   cd ..
   git clone https://github.com/vsmv/telephone-directory.git telephone-directory-recovered
   ```

### Corrupted Local Repository
```powershell
# Verify corruption
git fsck

# If corrupted, re-clone
cd ..
git clone https://github.com/vsmv/telephone-directory.git telephone-directory-fresh
```

---

## Automated Backup Schedule

### Daily Backup (Recommended)
Add to Windows Task Scheduler:
```powershell
# Task: Daily Backup
# Trigger: Daily at 6:00 PM
# Action: powershell.exe -ExecutionPolicy Bypass -File "C:\path\to\scripts\backup-manager.ps1" -Action backup
```

### Pre-Deployment Backup
```powershell
# Before deploying to production
.\scripts\backup-manager.ps1 -Action backup -BackupTag "pre-deployment"
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1
```

---

## Backup Retention Policy

### Local Backups
- **Keep**: Last 30 days
- **Location**: `backups/local/`
- **Cleanup**: Manual or automated script

### Git Commits
- **Keep**: All commits (indefinitely)
- **Location**: GitHub repository
- **Cleanup**: Never delete (use revert instead)

### Database Backups
- **Keep**: Last 90 days
- **Location**: `backups/database/`
- **Cleanup**: Manual

---

## Troubleshooting

### Issue: "Permission denied" when pushing
**Solution**:
```powershell
# Check credentials
git config --global user.name
git config --global user.email

# Re-authenticate with GitHub
# Use Personal Access Token instead of password
```

### Issue: "Merge conflict"
**Solution**:
```powershell
# View conflicts
git status

# Edit conflicted files
# Look for <<<<<<< HEAD markers

# After resolving
git add .
git commit -m "fix: resolve merge conflict"
```

### Issue: "Detached HEAD state"
**Solution**:
```powershell
# Create branch from current state
git checkout -b recovery-branch

# Or return to main
git checkout main
```

---

## Contact & Support

**Repository**: https://github.com/vsmv/telephone-directory  
**Issues**: https://github.com/vsmv/telephone-directory/issues  
**Documentation**: `/docs` directory

---

**Last Updated**: January 2025  
**Version**: 1.0.0
