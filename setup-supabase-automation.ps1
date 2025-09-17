# ACTREC Telephone Directory - Supabase Automation Script
# This script automates Docker setup, Supabase CLI installation, and project management

param(
    [string]$Action = "menu",
    [string]$ProjectRef = "",
    [string]$DatabasePassword = ""
)

# Colors for output
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Blue = "`e[34m"
$Magenta = "`e[35m"
$Cyan = "`e[36m"
$White = "`e[37m"
$Reset = "`e[0m"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = $White)
    Write-Host "$Color$Message$Reset"
}

function Show-Header {
    Clear-Host
    Write-ColorOutput "╔══════════════════════════════════════════════════════════════╗" $Cyan
    Write-ColorOutput "║                 ACTREC TELEPHONE DIRECTORY                   ║" $Cyan
    Write-ColorOutput "║              Supabase Automation Script v1.0                ║" $Cyan
    Write-ColorOutput "║                                                              ║" $Cyan
    Write-ColorOutput "║  🚀 Automates Docker, Supabase CLI, and Project Setup      ║" $Cyan
    Write-ColorOutput "╚══════════════════════════════════════════════════════════════╝" $Cyan
    Write-Host ""
}

function Test-Prerequisites {
    Write-ColorOutput "🔍 Checking Prerequisites..." $Yellow
    
    # Check Docker
    try {
        $dockerVersion = docker --version 2>$null
        if ($dockerVersion) {
            Write-ColorOutput "✅ Docker: $dockerVersion" $Green
        } else {
            throw "Docker not found"
        }
    } catch {
        Write-ColorOutput "❌ Docker not installed or not running" $Red
        Write-ColorOutput "📥 Please install Docker Desktop from: https://www.docker.com/products/docker-desktop" $Yellow
        return $false
    }
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-ColorOutput "✅ Node.js: $nodeVersion" $Green
        } else {
            throw "Node.js not found"
        }
    } catch {
        Write-ColorOutput "❌ Node.js not installed" $Red
        Write-ColorOutput "📥 Please install Node.js from: https://nodejs.org/" $Yellow
        return $false
    }
    
    # Check npm
    try {
        $npmVersion = npm --version 2>$null
        if ($npmVersion) {
            Write-ColorOutput "✅ npm: v$npmVersion" $Green
        }
    } catch {
        Write-ColorOutput "⚠️  npm not found" $Yellow
    }
    
    return $true
}

function Install-SupabaseCLI {
    Write-ColorOutput "📦 Installing Supabase CLI..." $Yellow
    
    try {
        # Check if already installed
        $supabaseVersion = npx supabase --version 2>$null
        if ($supabaseVersion) {
            Write-ColorOutput "✅ Supabase CLI already installed: $supabaseVersion" $Green
            return $true
        }
    } catch {
        # Not installed, proceed with installation
    }
    
    Write-ColorOutput "⬇️  Installing Supabase CLI via npx..." $Blue
    
    # Test npx supabase
    try {
        $result = npx supabase --version
        Write-ColorOutput "✅ Supabase CLI installed successfully: $result" $Green
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to install Supabase CLI" $Red
        return $false
    }
}

function Start-DockerServices {
    Write-ColorOutput "🐳 Starting Docker services..." $Yellow
    
    try {
        # Check if Docker is running
        docker info 2>$null | Out-Null
        Write-ColorOutput "✅ Docker is running" $Green
    } catch {
        Write-ColorOutput "❌ Docker is not running. Please start Docker Desktop." $Red
        return $false
    }
    
    return $true
}

function Initialize-SupabaseProject {
    Write-ColorOutput "🚀 Initializing Supabase project..." $Yellow
    
    if (Test-Path "supabase") {
        Write-ColorOutput "✅ Supabase project already initialized" $Green
        return $true
    }
    
    try {
        npx supabase init
        Write-ColorOutput "✅ Supabase project initialized" $Green
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to initialize Supabase project" $Red
        return $false
    }
}

function Start-LocalSupabase {
    Write-ColorOutput "🏃 Starting local Supabase..." $Yellow
    
    try {
        npx supabase start
        Write-ColorOutput "✅ Local Supabase started successfully" $Green
        
        # Show connection details
        Write-ColorOutput "`n📋 Local Supabase Details:" $Cyan
        npx supabase status
        
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to start local Supabase" $Red
        return $false
    }
}

function Stop-LocalSupabase {
    Write-ColorOutput "🛑 Stopping local Supabase..." $Yellow
    
    try {
        npx supabase stop
        Write-ColorOutput "✅ Local Supabase stopped" $Green
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to stop local Supabase" $Red
        return $false
    }
}

function Connect-RemoteSupabase {
    param([string]$ProjectRef, [string]$DatabasePassword)
    
    if (-not $ProjectRef) {
        $ProjectRef = Read-Host "Enter your Supabase project reference (e.g., pcrukmbtjyuuzwszsdsl)"
    }
    
    if (-not $DatabasePassword) {
        $DatabasePassword = Read-Host "Enter your database password" -AsSecureString
        $DatabasePassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($DatabasePassword))
    }
    
    Write-ColorOutput "🔗 Connecting to remote Supabase project..." $Yellow
    
    try {
        npx supabase login
        npx supabase link --project-ref $ProjectRef --password $DatabasePassword
        Write-ColorOutput "✅ Connected to remote Supabase project" $Green
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to connect to remote Supabase" $Red
        return $false
    }
}

function Deploy-Schema {
    Write-ColorOutput "📊 Deploying database schema..." $Yellow
    
    if (-not (Test-Path "supabase/schema.sql")) {
        Write-ColorOutput "❌ Schema file not found: supabase/schema.sql" $Red
        return $false
    }
    
    try {
        # Push migrations
        npx supabase db push
        Write-ColorOutput "✅ Schema deployed successfully" $Green
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to deploy schema" $Red
        return $false
    }
}

function Run-DatabaseQuery {
    param([string]$Query)
    
    if (-not $Query) {
        $Query = Read-Host "Enter SQL query"
    }
    
    Write-ColorOutput "🔍 Executing query..." $Yellow
    
    try {
        npx supabase db query $Query
        return $true
    } catch {
        Write-ColorOutput "❌ Failed to execute query" $Red
        return $false
    }
}

function Show-ProjectStatus {
    Write-ColorOutput "📊 Project Status:" $Cyan
    
    try {
        # Supabase status
        Write-ColorOutput "`n🔧 Supabase Status:" $Blue
        npx supabase status
        
        # Docker containers
        Write-ColorOutput "`n🐳 Docker Containers:" $Blue
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        
        # Project files
        Write-ColorOutput "`n📁 Project Structure:" $Blue
        if (Test-Path "supabase") { Write-ColorOutput "✅ supabase/ directory exists" $Green }
        if (Test-Path "supabase/schema.sql") { Write-ColorOutput "✅ schema.sql exists" $Green }
        if (Test-Path ".env.local") { Write-ColorOutput "✅ .env.local exists" $Green }
        if (Test-Path "package.json") { Write-ColorOutput "✅ package.json exists" $Green }
        
    } catch {
        Write-ColorOutput "❌ Failed to get project status" $Red
    }
}

function Show-Menu {
    Show-Header
    Write-ColorOutput "📋 Available Actions:" $White
    Write-Host ""
    Write-ColorOutput "1️⃣   Check Prerequisites" $Blue
    Write-ColorOutput "2️⃣   Install Supabase CLI" $Blue
    Write-ColorOutput "3️⃣   Initialize Local Project" $Blue
    Write-ColorOutput "4️⃣   Start Local Supabase" $Blue
    Write-ColorOutput "5️⃣   Stop Local Supabase" $Blue
    Write-ColorOutput "6️⃣   Connect to Remote Supabase" $Blue
    Write-ColorOutput "7️⃣   Deploy Schema" $Blue
    Write-ColorOutput "8️⃣   Run SQL Query" $Blue
    Write-ColorOutput "9️⃣   Show Project Status" $Blue
    Write-ColorOutput "🔄   Full Setup (1-4)" $Magenta
    Write-ColorOutput "❌   Exit" $Red
    Write-Host ""
    
    $choice = Read-Host "Select an option"
    
    switch ($choice) {
        "1" { Test-Prerequisites; Pause }
        "2" { Install-SupabaseCLI; Pause }
        "3" { Initialize-SupabaseProject; Pause }
        "4" { Start-LocalSupabase; Pause }
        "5" { Stop-LocalSupabase; Pause }
        "6" { Connect-RemoteSupabase; Pause }
        "7" { Deploy-Schema; Pause }
        "8" { Run-DatabaseQuery; Pause }
        "9" { Show-ProjectStatus; Pause }
        "setup" { 
            Full-Setup
            Pause
        }
        "exit" { 
            Write-ColorOutput "👋 Goodbye!" $Green
            exit 
        }
        default { 
            Write-ColorOutput "❌ Invalid option. Please try again." $Red
            Start-Sleep 2
            Show-Menu 
        }
    }
    
    Show-Menu
}

function Full-Setup {
    Write-ColorOutput "🚀 Running Full Setup..." $Magenta
    
    if (-not (Test-Prerequisites)) {
        Write-ColorOutput "❌ Prerequisites check failed. Please install required software." $Red
        return $false
    }
    
    if (-not (Install-SupabaseCLI)) {
        Write-ColorOutput "❌ Supabase CLI installation failed." $Red
        return $false
    }
    
    if (-not (Start-DockerServices)) {
        Write-ColorOutput "❌ Docker services check failed." $Red
        return $false
    }
    
    if (-not (Initialize-SupabaseProject)) {
        Write-ColorOutput "❌ Supabase project initialization failed." $Red
        return $false
    }
    
    if (-not (Start-LocalSupabase)) {
        Write-ColorOutput "❌ Local Supabase startup failed." $Red
        return $false
    }
    
    Write-ColorOutput "`n🎉 Full setup completed successfully!" $Green
    Write-ColorOutput "📋 Next steps:" $Cyan
    Write-ColorOutput "   • Your local Supabase is running" $White
    Write-ColorOutput "   • Check status with option 9" $White
    Write-ColorOutput "   • Deploy schema with option 7" $White
    Write-ColorOutput "   • Connect to remote with option 6" $White
    
    return $true
}

function Pause {
    Write-Host ""
    Write-ColorOutput "Press any key to continue..." $Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Main execution
switch ($Action.ToLower()) {
    "menu" { Show-Menu }
    "setup" { Full-Setup }
    "check" { Test-Prerequisites }
    "install" { Install-SupabaseCLI }
    "init" { Initialize-SupabaseProject }
    "start" { Start-LocalSupabase }
    "stop" { Stop-LocalSupabase }
    "connect" { Connect-RemoteSupabase -ProjectRef $ProjectRef -DatabasePassword $DatabasePassword }
    "deploy" { Deploy-Schema }
    "status" { Show-ProjectStatus }
    default { Show-Menu }
}