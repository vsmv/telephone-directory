@echo off
title ACTREC Telephone Directory Demo Recorder

echo =====================================================
echo ACTREC Telephone Directory Demo Recording Tool
echo =====================================================

:menu
echo.
echo Please select a demo to record:
echo.
echo 1. Test Connection
echo 2. Admin Role Demo
echo 3. User Role Demo
echo 4. Public Search Demo
echo 5. Full Demo Suite (All Roles)
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto test
if "%choice%"=="2" goto admin
if "%choice%"=="3" goto user
if "%choice%"=="4" goto public
if "%choice%"=="5" goto full
if "%choice%"=="6" goto exit

echo Invalid choice. Please try again.
goto menu

:test
echo Testing connection to application...
node scripts/recordings/test-connection.js
pause
goto menu

:admin
echo Starting Admin Role Demo...
echo Please start your screen recorder now, then press any key to continue
pause
node scripts/recordings/admin-demo.js
echo Admin demo completed.
pause
goto menu

:user
echo Starting User Role Demo...
echo Please start your screen recorder now, then press any key to continue
pause
node scripts/recordings/user-demo.js
echo User demo completed.
pause
goto menu

:public
echo Starting Public Search Demo...
echo Please start your screen recorder now, then press any key to continue
pause
node scripts/recordings/public-search-demo.js
echo Public search demo completed.
pause
goto menu

:full
echo Starting Full Demo Suite...
echo Please start your screen recorder now, then press any key to continue
pause
node scripts/recordings/full-demo.js
echo All demos completed.
pause
goto menu

:exit
echo Thank you for using the ACTREC Telephone Directory Demo Recorder!
exit /b