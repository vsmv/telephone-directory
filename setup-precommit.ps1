# PowerShell script to set up pre-commit hook on Windows

Write-Host "Setting up pre-commit hook for Codacy analysis..."

# Check if the hooks directory exists
$hooksDir = "telephone-directory/.git/hooks"
if (!(Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir
}

# Copy the pre-commit hook
$preCommitHook = "telephone-directory/.git/hooks/pre-commit"
if (Test-Path $preCommitHook) {
    Remove-Item $preCommitHook
}

# Create the pre-commit hook as an executable
$preCommitContent = @'
#!/bin/bash

# Pre-commit hook to run Codacy analysis before committing

echo "Running Codacy pre-commit analysis..."

# Check if Codacy CLI is installed
if ! command -v codacy-cli &> /dev/null
then
    echo "Codacy CLI is not installed. Skipping analysis."
    echo "To install Codacy CLI, visit: https://github.com/codacy/codacy-analysis-cli"
    exit 0
fi

# Run Codacy analysis on staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E "\.(js|jsx|ts|tsx|css|html|java|py|go)$" | tr '\n' ' ')

if [ -n "$STAGED_FILES" ]; then
    echo "Analyzing staged files with Codacy..."
    codacy-cli analyze --files $STAGED_FILES
    
    # Check the result
    if [ $? -ne 0 ]; then
        echo "Codacy analysis found issues. Please fix them before committing."
        echo "You can bypass this check with: git commit --no-verify"
        exit 1
    fi
else
    echo "No supported files to analyze."
fi

echo "Codacy analysis completed successfully."
exit 0
'@

$preCommitContent | Out-File -FilePath $preCommitHook -Encoding utf8

Write-Host "Pre-commit hook setup completed!"
Write-Host "Note: The hook will only work if you have Git Bash installed and Codacy CLI installed."