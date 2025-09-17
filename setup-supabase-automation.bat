@echo off
setlocal enabledelayedexpansion

REM ACTREC Telephone Directory - Supabase Automation Script
REM This script automates Docker setup, Supabase CLI installation, and project management

title ACTREC Telephone Directory - Supabase Automation

:header
cls
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                 ACTREC TELEPHONE DIRECTORY                   ║
echo ║              Supabase Automation Script v1.0                ║
echo ║                                                              ║
echo ║  🚀 Automates Docker, Supabase CLI, and Project Setup      ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:menu
echo 📋 Available Actions:
echo.
echo 1️⃣   Check Prerequisites
echo 2️⃣   Install Supabase CLI
echo 3️⃣   Initialize Local Project
echo 4️⃣   Start Local Supabase
echo 5️⃣   Stop Local Supabase
echo 6️⃣   Connect to Remote Supabase
echo 7️⃣   Deploy Schema
echo 8️⃣   Run SQL Query
echo 9️⃣   Show Project Status
echo 🔄   Full Setup (1-4)
echo ❌   Exit
echo.

set /p choice="Select an option: "

if "%choice%"=="1" goto check_prerequisites
if "%choice%"=="2" goto install_supabase_cli
if "%choice%"=="3" goto initialize_project
if "%choice%"=="4" goto start_local_supabase
if "%choice%"=="5" goto stop_local_supabase
if "%choice%"=="6" goto connect_remote
if "%choice%"=="7" goto deploy_schema
if "%choice%"=="8" goto run_query
if "%choice%"=="9" goto show_status
if "%choice%"=="setup" goto full_setup
if "%choice%"=="exit" goto exit_script

echo ❌ Invalid option. Please try again.
timeout /t 2 >nul
goto header

:check_prerequisites
echo.
echo 🔍 Checking Prerequisites...

REM Check Docker
docker --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('docker --version') do echo ✅ Docker: %%i
) else (
    echo ❌ Docker not installed or not running
    echo 📥 Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    goto pause_return
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('node --version') do echo ✅ Node.js: %%i
) else (
    echo ❌ Node.js not installed
    echo 📥 Please install Node.js from: https://nodejs.org/
    goto pause_return
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('npm --version') do echo ✅ npm: v%%i
) else (
    echo ⚠️  npm not found
)

goto pause_return

:install_supabase_cli
echo.
echo 📦 Installing Supabase CLI...

REM Check if already installed
npx supabase --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('npx supabase --version') do echo ✅ Supabase CLI already installed: %%i
    goto pause_return
)

echo ⬇️  Installing Supabase CLI via npx...

npx supabase --version >nul 2>&1
if %errorlevel%==0 (
    for /f "tokens=*" %%i in ('npx supabase --version') do echo ✅ Supabase CLI installed successfully: %%i
) else (
    echo ❌ Failed to install Supabase CLI
)

goto pause_return

:initialize_project
echo.
echo 🚀 Initializing Supabase project...

if exist "supabase" (
    echo ✅ Supabase project already initialized
    goto pause_return
)

npx supabase init
if %errorlevel%==0 (
    echo ✅ Supabase project initialized
) else (
    echo ❌ Failed to initialize Supabase project
)

goto pause_return

:start_local_supabase
echo.
echo 🏃 Starting local Supabase...

REM Check Docker first
docker info >nul 2>&1
if not %errorlevel%==0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    goto pause_return
)

npx supabase start
if %errorlevel%==0 (
    echo ✅ Local Supabase started successfully
    echo.
    echo 📋 Local Supabase Details:
    npx supabase status
) else (
    echo ❌ Failed to start local Supabase
)

goto pause_return

:stop_local_supabase
echo.
echo 🛑 Stopping local Supabase...

npx supabase stop
if %errorlevel%==0 (
    echo ✅ Local Supabase stopped
) else (
    echo ❌ Failed to stop local Supabase
)

goto pause_return

:connect_remote
echo.
echo 🔗 Connecting to remote Supabase project...

set /p project_ref="Enter your Supabase project reference (e.g., pcrukmbtjyuuzwszsdsl): "
set /p database_password="Enter your database password: "

npx supabase login
if %errorlevel%==0 (
    npx supabase link --project-ref %project_ref% --password %database_password%
    if %errorlevel%==0 (
        echo ✅ Connected to remote Supabase project
    ) else (
        echo ❌ Failed to link to remote project
    )
) else (
    echo ❌ Failed to login to Supabase
)

goto pause_return

:deploy_schema
echo.
echo 📊 Deploying database schema...

if not exist "supabase\schema.sql" (
    echo ❌ Schema file not found: supabase\schema.sql
    goto pause_return
)

npx supabase db push
if %errorlevel%==0 (
    echo ✅ Schema deployed successfully
) else (
    echo ❌ Failed to deploy schema
)

goto pause_return

:run_query
echo.
set /p query="Enter SQL query: "

echo 🔍 Executing query...
npx supabase db query "%query%"

goto pause_return

:show_status
echo.
echo 📊 Project Status:

echo.
echo 🔧 Supabase Status:
npx supabase status 2>nul
if not %errorlevel%==0 (
    echo ⚠️  Supabase not running or not initialized
)

echo.
echo 🐳 Docker Containers:
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>nul
if not %errorlevel%==0 (
    echo ⚠️  Docker not running
)

echo.
echo 📁 Project Structure:
if exist "supabase" (echo ✅ supabase\ directory exists) else (echo ❌ supabase\ directory missing)
if exist "supabase\schema.sql" (echo ✅ schema.sql exists) else (echo ❌ schema.sql missing)
if exist ".env.local" (echo ✅ .env.local exists) else (echo ❌ .env.local missing)
if exist "package.json" (echo ✅ package.json exists) else (echo ❌ package.json missing)

goto pause_return

:full_setup
echo.
echo 🚀 Running Full Setup...

echo Step 1: Checking Prerequisites...
call :check_prerequisites_silent
if not %errorlevel%==0 (
    echo ❌ Prerequisites check failed. Please install required software.
    goto pause_return
)

echo Step 2: Installing Supabase CLI...
call :install_supabase_cli_silent
if not %errorlevel%==0 (
    echo ❌ Supabase CLI installation failed.
    goto pause_return
)

echo Step 3: Checking Docker...
docker info >nul 2>&1
if not %errorlevel%==0 (
    echo ❌ Docker services check failed.
    goto pause_return
)

echo Step 4: Initializing Supabase project...
call :initialize_project_silent
if not %errorlevel%==0 (
    echo ❌ Supabase project initialization failed.
    goto pause_return
)

echo Step 5: Starting local Supabase...
npx supabase start >nul 2>&1
if not %errorlevel%==0 (
    echo ❌ Local Supabase startup failed.
    goto pause_return
)

echo.
echo 🎉 Full setup completed successfully!
echo 📋 Next steps:
echo    • Your local Supabase is running
echo    • Check status with option 9
echo    • Deploy schema with option 7
echo    • Connect to remote with option 6

goto pause_return

:check_prerequisites_silent
docker --version >nul 2>&1
if not %errorlevel%==0 exit /b 1
node --version >nul 2>&1
if not %errorlevel%==0 exit /b 1
exit /b 0

:install_supabase_cli_silent
npx supabase --version >nul 2>&1
exit /b %errorlevel%

:initialize_project_silent
if exist "supabase" exit /b 0
npx supabase init >nul 2>&1
exit /b %errorlevel%

:pause_return
echo.
pause
goto header

:exit_script
echo 👋 Goodbye!
exit /b 0