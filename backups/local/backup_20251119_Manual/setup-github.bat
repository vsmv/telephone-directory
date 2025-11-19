@echo off
REM Windows Batch file to setup GitHub repository
REM Run this in Command Prompt (cmd)

echo Setting up GitHub repository...

REM Check if gh CLI is installed
gh --version >nul 2>&1
if errorlevel 1 (
    echo GitHub CLI not found. Please install it first:
    echo winget install GitHub.cli
    pause
    exit /b 1
)

REM Initialize git repository
echo Initializing Git repository...
git init

REM Add all files
echo Adding files...
git add .

REM Initial commit
echo Creating initial commit...
git commit -m "Initial commit: ACTREC Telephone Directory with deployment workflow"

REM Check GitHub authentication
echo Checking GitHub authentication...
gh auth status >nul 2>&1
if errorlevel 1 (
    echo Please authenticate with GitHub:
    gh auth login
)

REM Create GitHub repository
echo Creating GitHub repository...
gh repo create telephone-directory --public --description "ACTREC Consolidated Telephone Directory"

REM Set main branch and add remote
echo Setting up remote...
git branch -M main

REM Get username and set remote
for /f %%i in ('gh api user --jq .login') do set USERNAME=%%i
git remote add origin https://github.com/%USERNAME%/telephone-directory.git

REM Push to GitHub
echo Pushing to GitHub...
git push -u origin main

REM Create development branches
echo Creating development branches...
git checkout -b develop
git push -u origin develop

git checkout -b staging
git push -u origin staging

git checkout main

echo Repository created successfully!
echo Repository URL: https://github.com/%USERNAME%/telephone-directory
echo.
echo Next steps:
echo 1. Set up Vercel staging environment
echo 2. Configure Supabase projects
echo 3. Deploy to OVHcloud VPS
pause