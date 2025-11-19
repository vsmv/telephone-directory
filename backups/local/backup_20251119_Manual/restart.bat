@echo off
echo === ACTREC Directory Clean Restart ===

echo [1/5] Stopping any running Node.js processes...
taskkill /f /im node.exe 2>nul
echo Done.

echo [2/5] Cleaning build artifacts...
if exist .next (
    echo Removing .next directory...
    rmdir /s /q .next 2>nul
)
if exist tsconfig.tsbuildinfo (
    echo Removing tsconfig.tsbuildinfo...
    del tsconfig.tsbuildinfo 2>nul
)
echo Done.

echo [3/5] Clearing npm cache...
npm cache clean --force
echo Done.

echo [4/5] Verifying environment...
echo Node.js version:
node -v
echo npm version:
npm -v
echo Done.

echo [5/5] Starting development server with Turbo mode...
echo Please wait while Next.js rebuilds...
npm run dev

pause