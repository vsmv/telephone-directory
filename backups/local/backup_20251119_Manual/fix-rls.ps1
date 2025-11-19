# PowerShell script to display instructions for fixing RLS policies

Write-Host "`n🔧 RLS Policy Fix for Data Display Issue`n" -ForegroundColor Cyan

Write-Host "PROBLEM:" -ForegroundColor Yellow
Write-Host "  Your tables have Row Level Security (RLS) enabled that blocks anonymous access."
Write-Host "  This is why no data appears in the UI even though 5 records exist.`n"

Write-Host "SOLUTION:" -ForegroundColor Green
Write-Host "  You need to run SQL commands in your Supabase Dashboard.`n"

Write-Host "STEP 1: Open Supabase SQL Editor" -ForegroundColor Cyan
Write-Host "  1. Go to: https://supabase.com/dashboard"
Write-Host "  2. Select your project"
Write-Host "  3. Click 'SQL Editor' in the left sidebar"
Write-Host "  4. Click 'New Query'`n"

Write-Host "STEP 2: Choose a fix method`n" -ForegroundColor Cyan

Write-Host "METHOD 1 - Quick Fix (Disable RLS):" -ForegroundColor Yellow
Write-Host "  Copy and paste this SQL:"
Write-Host ""
Write-Host "  ALTER TABLE learning_plans DISABLE ROW LEVEL SECURITY;" -ForegroundColor White
Write-Host "  ALTER TABLE patentable_ideas DISABLE ROW LEVEL SECURITY;" -ForegroundColor White
Write-Host "  ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;" -ForegroundColor White
Write-Host ""
Write-Host "  Then click 'Run' or press Ctrl+Enter"
Write-Host ""

Write-Host "OR`n" -ForegroundColor Magenta

Write-Host "METHOD 2 - Production Fix (Add Anon Policies):" -ForegroundColor Yellow
Write-Host "  Run the SQL from: fix-rls-policies.sql`n"

Write-Host "STEP 3: Verify the fix" -ForegroundColor Cyan
Write-Host "  Run: node test-supabase-connection.js`n"

Write-Host "STEP 4: Test in browser" -ForegroundColor Cyan
Write-Host "  1. Start dev server: npm run dev"
Write-Host "  2. Open dashboard and check Learning Plans / Patentable Ideas tabs"
Write-Host "  3. Data should now be visible!`n"

Write-Host "📄 For detailed instructions, see: FIX_DATA_DISPLAY_ISSUE.md`n" -ForegroundColor Green

# Ask if user wants to open the SQL file
$response = Read-Host "Would you like to open fix-rls-policies.sql now? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    if (Test-Path "fix-rls-policies.sql") {
        notepad fix-rls-policies.sql
    } else {
        Write-Host "File not found: fix-rls-policies.sql" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Good luck!" -ForegroundColor Green
Write-Host ""
