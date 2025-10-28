@echo off
title ACTREC Telephone Directory Windows Recorder

echo =====================================================
echo ACTREC Telephone Directory Windows Recording Tool
echo =====================================================

:menu
echo.
echo Please select a demo to record with Windows Snip:
echo.
echo 1. Admin Role Demo
echo 2. User Role Demo
echo 3. Public Search Demo
echo 4. Full Demo Suite (All Roles)
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto admin
if "%choice%"=="2" goto user
if "%choice%"=="3" goto public
if "%choice%"=="4" goto full
if "%choice%"=="5" goto exit

echo Invalid choice. Please try again.
goto menu

:admin
echo Starting Admin Role Demo with Windows Snip Recording...
echo.
echo IMPORTANT: 
echo 1. Make sure Xbox Game Bar recording is enabled
echo 2. The recording will start automatically
echo 3. Do not interact with the computer during recording
echo.
echo Press any key to start the recording...
pause >nul
PowerShell -ExecutionPolicy Bypass -File "%~dp0windows-record-demo.ps1" -DemoType "admin"
echo Admin demo recording completed.
pause
goto menu

:user
echo Starting User Role Demo with Windows Snip Recording...
echo.
echo IMPORTANT: 
echo 1. Make sure Xbox Game Bar recording is enabled
echo 2. The recording will start automatically
echo 3. Do not interact with the computer during recording
echo.
echo Press any key to start the recording...
pause >nul
PowerShell -ExecutionPolicy Bypass -File "%~dp0windows-record-demo.ps1" -DemoType "user"
echo User demo recording completed.
pause
goto menu

:public
echo Starting Public Search Demo with Windows Snip Recording...
echo.
echo IMPORTANT: 
echo 1. Make sure Xbox Game Bar recording is enabled
echo 2. The recording will start automatically
echo 3. Do not interact with the computer during recording
echo.
echo Press any key to start the recording...
pause >nul
PowerShell -ExecutionPolicy Bypass -File "%~dp0windows-record-demo.ps1" -DemoType "public"
echo Public search demo recording completed.
pause
goto menu

:full
echo Starting Full Demo Suite with Windows Snip Recording...
echo.
echo IMPORTANT: 
echo 1. Make sure Xbox Game Bar recording is enabled
echo 2. The recording will start automatically
echo 3. This will take approximately 5-10 minutes
echo 4. Do not interact with the computer during recording
echo.
echo Press any key to start the recording...
pause >nul
PowerShell -ExecutionPolicy Bypass -File "%~dp0windows-record-demo.ps1" -DemoType "full"
echo Full demo suite recording completed.
pause
goto menu

:exit
echo Thank you for using the ACTREC Telephone Directory Windows Recorder!
echo Recordings are saved in your Videos\Captures folder.
exit /b