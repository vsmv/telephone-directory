# PowerShell script to setup GitHub repository
# Run this in PowerShell (not batch)

Write-Host "Setting up GitHub repository..." -ForegroundColor Green

# Check if gh CLI is installed
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "GitHub CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "winget install GitHub.cli" -ForegroundColor Yellow
    exit 1
}

# Initialize git repository
Write-Host "Initializing Git repository..." -ForegroundColor Blue
git init

# Add all files
Write-Host "Adding files..." -ForegroundColor Blue
git add .

# Initial commit
Write-Host "Creating initial commit..." -ForegroundColor Blue
git commit -m "Initial commit: ACTREC Telephone Directory with deployment workflow"

# Authenticate with GitHub (if not already done)
Write-Host "Checking GitHub authentication..." -ForegroundColor Blue
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please authenticate with GitHub:" -ForegroundColor Yellow
    gh auth login
}

# Create GitHub repository
Write-Host "Creating GitHub repository..." -ForegroundColor Blue
gh repo create telephone-directory --public --description "ACTREC Consolidated Telephone Directory"

# Set main branch and add remote
Write-Host "Setting up remote..." -ForegroundColor Blue
git branch -M main
$username = gh api user --jq .login
git remote add origin "https://github.com/$username/telephone-directory.git"

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Blue
git push -u origin main

# Create development branches
Write-Host "Creating development branches..." -ForegroundColor Blue
git checkout -b develop
git push -u origin develop

git checkout -b staging
git push -u origin staging

git checkout main

Write-Host "Repository created successfully!" -ForegroundColor Green
Write-Host "Repository URL: https://github.com/$username/telephone-directory" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Set up Vercel staging environment" -ForegroundColor White
Write-Host "2. Configure Supabase projects" -ForegroundColor White  
Write-Host "3. Deploy to OVHcloud VPS" -ForegroundColor White