# Windows PowerShell Script for Automated Demo Recording
# This script combines Puppeteer automation with Windows Snip recording

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("admin", "user", "public", "full")]
    [string]$DemoType,
    
    [string]$OutputPath = ".\recordings"
)

# Ensure output directory exists
if (!(Test-Path $OutputPath)) {
    New-Item -ItemType Directory -Path $OutputPath | Out-Null
}

# Function to start Windows Snip recording
function Start-WindowsSnipRecording {
    param(
        [string]$RecordingName
    )
    
    Write-Host "🎬 Starting Windows Snip recording: $RecordingName" -ForegroundColor Green
    
    # Start Snip & Sketch recording (Windows 10/11)
    # This uses the Xbox Game Bar recording feature
    try {
        # Press Win + G to open Game Bar
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.SendKeys]::SendWait("^{ESC}") # Win key
        Start-Sleep -Seconds 1
        [System.Windows.Forms.SendKeys]::SendWait("g") # G key
        Start-Sleep -Seconds 2
        
        # Press Win + Alt + R to start recording
        [System.Windows.Forms.SendKeys]::SendWait("^{Alt}r")
        Start-Sleep -Seconds 3
        
        Write-Host "✅ Recording started successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Could not start recording automatically. Please start recording manually." -ForegroundColor Yellow
        Write-Host "Press any key after starting recording..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Function to stop Windows Snip recording
function Stop-WindowsSnipRecording {
    Write-Host "⏹️  Stopping recording..." -ForegroundColor Red
    
    try {
        # Press Win + Alt + R to stop recording
        Add-Type -AssemblyName System.Windows.Forms
        [System.Windows.Forms.SendKeys]::SendWait("^{Alt}r")
        Start-Sleep -Seconds 3
        
        Write-Host "✅ Recording stopped successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Could not stop recording automatically. Please stop recording manually." -ForegroundColor Yellow
        Write-Host "Press any key after stopping recording..." -ForegroundColor Yellow
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

# Function to run Puppeteer demo
function Start-PuppeteerDemo {
    param(
        [string]$DemoScript
    )
    
    Write-Host "🤖 Starting Puppeteer demo: $DemoScript" -ForegroundColor Blue
    
    # Run the demo script
    $process = Start-Process -FilePath "node" -ArgumentList $DemoScript -NoNewWindow -PassThru
    
    # Wait for process to complete
    $process.WaitForExit()
    
    if ($process.ExitCode -eq 0) {
        Write-Host "✅ Puppeteer demo completed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Puppeteer demo failed with exit code: $($process.ExitCode)" -ForegroundColor Red
    }
}

# Main execution
Write-Host "🚀 ACTREC Telephone Directory Windows Recording Tool" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "Demo Type: $DemoType" -ForegroundColor Cyan
Write-Host "Output Path: $OutputPath" -ForegroundColor Cyan
Write-Host ""

# Confirm application is running
Write-Host "🔍 Checking if application is running on http://localhost:3001..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Application is running!" -ForegroundColor Green
    } else {
        Write-Host "❌ Application returned status code: $($response.StatusCode)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Application is not running. Please start it with 'npm run dev'" -ForegroundColor Red
    exit 1
}

# Start recording
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$recordingName = "${DemoType}-demo-${timestamp}"

Start-WindowsSnipRecording -RecordingName $recordingName

# Small delay to ensure recording has started
Start-Sleep -Seconds 3

# Run the appropriate demo
switch ($DemoType) {
    "admin" {
        Start-PuppeteerDemo -DemoScript "scripts/recordings/admin-demo.js"
    }
    "user" {
        Start-PuppeteerDemo -DemoScript "scripts/recordings/user-demo.js"
    }
    "public" {
        Start-PuppeteerDemo -DemoScript "scripts/recordings/public-search-demo.js"
    }
    "full" {
        Start-PuppeteerDemo -DemoScript "scripts/recordings/full-demo.js"
    }
}

# Stop recording
Stop-WindowsSnipRecording

Write-Host "🎉 Demo recording completed!" -ForegroundColor Green
Write-Host "📁 Recording saved in Windows Videos/Captures folder" -ForegroundColor Cyan
Write-Host "📝 You can find your recordings in: $env:USERPROFILE\Videos\Captures" -ForegroundColor Cyan