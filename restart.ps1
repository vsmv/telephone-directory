# ACTREC Directory Clean Restart Script
Write-Host "=== ACTREC Directory Clean Restart ===" -ForegroundColor Cyan

Write-Host "[1/5] Stopping any running Node.js processes..." -ForegroundColor Yellow
try {
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Write-Host "Done." -ForegroundColor Green
} catch {
    Write-Host "No Node processes to stop." -ForegroundColor Green
}

Write-Host "[2/5] Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "Removed .next directory" -ForegroundColor Green
}
if (Test-Path "tsconfig.tsbuildinfo") {
    Remove-Item -Path "tsconfig.tsbuildinfo" -Force -ErrorAction SilentlyContinue
    Write-Host "Removed tsconfig.tsbuildinfo" -ForegroundColor Green
}
Write-Host "Done." -ForegroundColor Green

Write-Host "[3/5] Clearing npm cache..." -ForegroundColor Yellow
try {
    npm cache clean --force
    Write-Host "Done." -ForegroundColor Green
} catch {
    Write-Host "Cache clean failed, continuing..." -ForegroundColor Yellow
}

Write-Host "[4/5] Verifying environment..." -ForegroundColor Yellow
Write-Host "Node.js version:" -NoNewline
node -v
Write-Host "npm version:" -NoNewline  
npm -v
Write-Host "Done." -ForegroundColor Green

Write-Host "[5/5] Starting development server with Turbo mode..." -ForegroundColor Yellow
Write-Host "Please wait while Next.js rebuilds..." -ForegroundColor Cyan
npm run dev