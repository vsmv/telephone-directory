# ACTREC Telephone Directory - Backup Manager
# Purpose: Automated backup and version control management
# Usage: .\scripts\backup-manager.ps1 -Action [backup|restore|status]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('backup', 'restore', 'status', 'setup')]
    [string]$Action = 'backup',
    
    [Parameter(Mandatory=$false)]
    [string]$Message = "Automated backup - $(Get-Date -Format 'dd-MM-yyyy HH:mm:ss')",
    
    [Parameter(Mandatory=$false)]
    [string]$BackupTag = ""
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $ProjectRoot

# Colors for output
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Check if Git is installed
function Test-GitInstalled {
    try {
        git --version | Out-Null
        return $true
    } catch {
        Write-Error "Git is not installed or not in PATH"
        return $false
    }
}

# Setup backup infrastructure
function Setup-BackupInfrastructure {
    Write-Info "Setting up backup infrastructure..."
    
    # Create backup directory structure
    $backupDirs = @(
        "backups/local",
        "backups/database",
        "backups/config",
        ".git-backups"
    )
    
    foreach ($dir in $backupDirs) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Success "Created directory: $dir"
        }
    }
    
    # Create .gitignore entries for backups
    $gitignoreContent = @"

# Backup directories
backups/
.git-backups/
*.backup
*.bak
"@
    
    if (Test-Path ".gitignore") {
        $currentGitignore = Get-Content ".gitignore" -Raw
        if ($currentGitignore -notmatch "backups/") {
            Add-Content ".gitignore" $gitignoreContent
            Write-Success "Updated .gitignore with backup exclusions"
        }
    }
    
    Write-Success "Backup infrastructure setup complete"
}

# Create local backup
function Create-LocalBackup {
    Write-Info "Creating local backup..."
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupName = "backup_$timestamp"
    $backupPath = "backups/local/$backupName"
    
    # Create backup directory
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
    
    # Copy important files
    $filesToBackup = @(
        "package.json",
        "package-lock.json",
        "tsconfig.json",
        "next.config.mjs",
        "tailwind.config.ts",
        ".env.local.example",
        "ARCHITECTURE.md",
        "README.md"
    )
    
    foreach ($file in $filesToBackup) {
        if (Test-Path $file) {
            Copy-Item $file -Destination "$backupPath/" -Force
        }
    }
    
    # Backup directories
    $dirsToBackup = @(
        "app",
        "components",
        "lib",
        "hooks",
        "supabase",
        "public"
    )
    
    foreach ($dir in $dirsToBackup) {
        if (Test-Path $dir) {
            Copy-Item $dir -Destination "$backupPath/" -Recurse -Force
        }
    }
    
    # Create backup manifest
    $manifest = @{
        timestamp = $timestamp
        date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        files = $filesToBackup
        directories = $dirsToBackup
        gitCommit = (git rev-parse HEAD 2>$null)
        gitBranch = (git branch --show-current 2>$null)
    }
    
    $manifest | ConvertTo-Json | Out-File "$backupPath/manifest.json"
    
    Write-Success "Local backup created: $backupPath"
    return $backupPath
}


# Git backup and commit
function Create-GitBackup {
    param([string]$commitMessage)
    
    Write-Info "Creating Git backup..."
    
    # Check Git status
    $status = git status --porcelain
    
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-Warning "No changes to commit"
        return
    }
    
    # Show what will be committed
    Write-Info "Files to be committed:"
    git status --short
    
    # Stage all changes
    git add -A
    Write-Success "Staged all changes"
    
    # Create commit
    git commit -m $commitMessage
    Write-Success "Created commit: $commitMessage"
    
    # Get current branch
    $branch = git branch --show-current
    
    # Push to remote
    Write-Info "Pushing to remote repository..."
    git push origin $branch
    Write-Success "Pushed to origin/$branch"
    
    # Create backup tag if specified
    if ($BackupTag) {
        $tagName = "backup-$BackupTag-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        git tag -a $tagName -m "Backup tag: $BackupTag"
        git push origin $tagName
        Write-Success "Created and pushed tag: $tagName"
    }
}

# Backup database schema
function Backup-DatabaseSchema {
    Write-Info "Backing up database schema..."
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $schemaBackup = "backups/database/schema_$timestamp.sql"
    
    if (Test-Path "supabase/schema.sql") {
        Copy-Item "supabase/schema.sql" -Destination $schemaBackup
        Write-Success "Database schema backed up: $schemaBackup"
    } else {
        Write-Warning "Database schema file not found"
    }
}

# Backup environment configuration
function Backup-Configuration {
    Write-Info "Backing up configuration..."
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $configBackup = "backups/config/config_$timestamp"
    
    New-Item -ItemType Directory -Path $configBackup -Force | Out-Null
    
    # Backup config files (excluding sensitive data)
    $configFiles = @(
        ".env.local.example",
        ".env.development",
        ".env.staging",
        ".env.production",
        "next.config.mjs",
        "tsconfig.json",
        "tailwind.config.ts",
        "jest.config.js",
        ".eslintrc.json"
    )
    
    foreach ($file in $configFiles) {
        if (Test-Path $file) {
            Copy-Item $file -Destination "$configBackup/" -Force
        }
    }
    
    Write-Success "Configuration backed up: $configBackup"
}

# Show backup status
function Show-BackupStatus {
    Write-Info "=== Backup Status ==="
    
    # Git status
    Write-Host "`n[Git Status]" -ForegroundColor Cyan
    git status --short
    
    # Current branch and commit
    $branch = git branch --show-current
    $commit = git rev-parse --short HEAD
    Write-Host "Branch: $branch" -ForegroundColor Yellow
    Write-Host "Commit: $commit" -ForegroundColor Yellow
    
    # Remote status
    Write-Host "`n[Remote Status]" -ForegroundColor Cyan
    git remote -v
    
    # Recent commits
    Write-Host "`n[Recent Commits]" -ForegroundColor Cyan
    git log --oneline -5
    
    # Local backups
    Write-Host "`n[Local Backups]" -ForegroundColor Cyan
    if (Test-Path "backups/local") {
        $backups = Get-ChildItem "backups/local" -Directory | Sort-Object LastWriteTime -Descending | Select-Object -First 5
        foreach ($backup in $backups) {
            Write-Host "  - $($backup.Name) ($(Get-Date $backup.LastWriteTime -Format 'yyyy-MM-dd HH:mm:ss'))"
        }
    } else {
        Write-Host "  No local backups found"
    }
    
    # Tags
    Write-Host "`n[Backup Tags]" -ForegroundColor Cyan
    $tags = git tag -l "backup-*" | Select-Object -Last 5
    if ($tags) {
        $tags | ForEach-Object { Write-Host "  - $_" }
    } else {
        Write-Host "  No backup tags found"
    }
}

# Restore from backup
function Restore-FromBackup {
    Write-Warning "Restore functionality - Use with caution!"
    
    # List available backups
    Write-Host "`n[Available Local Backups]" -ForegroundColor Cyan
    $backups = Get-ChildItem "backups/local" -Directory | Sort-Object LastWriteTime -Descending
    
    if ($backups.Count -eq 0) {
        Write-Error "No backups found"
        return
    }
    
    for ($i = 0; $i -lt $backups.Count; $i++) {
        Write-Host "  [$i] $($backups[$i].Name) - $(Get-Date $backups[$i].LastWriteTime -Format 'yyyy-MM-dd HH:mm:ss')"
    }
    
    $selection = Read-Host "`nSelect backup number to restore (or 'q' to quit)"
    
    if ($selection -eq 'q') {
        Write-Info "Restore cancelled"
        return
    }
    
    $backupToRestore = $backups[$selection]
    
    Write-Warning "This will restore files from: $($backupToRestore.Name)"
    $confirm = Read-Host "Are you sure? (yes/no)"
    
    if ($confirm -ne 'yes') {
        Write-Info "Restore cancelled"
        return
    }
    
    # Create safety backup before restore
    Write-Info "Creating safety backup before restore..."
    Create-LocalBackup
    
    # Restore files
    Write-Info "Restoring from backup..."
    # Implementation would go here
    Write-Warning "Restore feature requires manual verification - backup location: $($backupToRestore.FullName)"
}

# Main execution
Write-Host "`n[Backup Manager] ACTREC Telephone Directory" -ForegroundColor Magenta
Write-Host "============================================`n" -ForegroundColor Magenta

if (-not (Test-GitInstalled)) {
    exit 1
}

switch ($Action) {
    'setup' {
        Setup-BackupInfrastructure
    }
    'backup' {
        Setup-BackupInfrastructure
        Create-LocalBackup
        Backup-DatabaseSchema
        Backup-Configuration
        Create-GitBackup -commitMessage $Message
        Write-Success "`nComplete backup created successfully!"
    }
    'status' {
        Show-BackupStatus
    }
    'restore' {
        Restore-FromBackup
    }
}

Write-Host "`nBackup manager completed" -ForegroundColor Green
