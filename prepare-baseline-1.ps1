# ACTREC Telephone Directory - Baseline-1 Preparation Script
# Prepares the project for GitHub commit with proper organization

param(
    [string]$CommitMessage = "🎉 Release v1.0 (Baseline-1): Production-ready ACTREC Telephone Directory",
    [switch]$DryRun = $false
)

# Colors for output
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Cyan = "`e[36m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = $Reset)
    Write-Host "$Color$Message$Reset"
}

function Show-Header {
    Clear-Host
    Write-ColorOutput "╔══════════════════════════════════════════════════════════════╗" $Cyan
    Write-ColorOutput "║              ACTREC TELEPHONE DIRECTORY v1.0                ║" $Cyan
    Write-ColorOutput "║                 Baseline-1 Preparation                      ║" $Cyan
    Write-ColorOutput "╚══════════════════════════════════════════════════════════════╝" $Cyan
    Write-Host ""
}

function Test-GitRepository {
    Write-ColorOutput "🔍 Checking Git repository..." $Yellow
    
    if (-not (Test-Path ".git")) {
        Write-ColorOutput "❌ Not a Git repository. Initializing..." $Yellow
        git init
        Write-ColorOutput "✅ Git repository initialized" $Green
    } else {
        Write-ColorOutput "✅ Git repository found" $Green
    }
    
    # Check if remote exists
    $remotes = git remote -v 2>$null
    if (-not $remotes) {
        Write-ColorOutput "⚠️  No remote repository configured" $Yellow
        Write-ColorOutput "💡 Add remote with: git remote add origin <your-repo-url>" $Blue
    } else {
        Write-ColorOutput "✅ Remote repository configured" $Green
        git remote -v
    }
}

function Organize-ProjectFiles {
    Write-ColorOutput "📁 Organizing project files..." $Yellow
    
    # Create directories if they don't exist
    $directories = @(
        "docs",
        "scripts/automation",
        "scripts/database",
        "scripts/testing",
        "deployment"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
        