#!/bin/bash

# ACTREC Telephone Directory - Supabase Automation Script
# This script automates Docker setup, Supabase CLI installation, and project management

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

show_header() {
    clear
    print_color $CYAN "╔══════════════════════════════════════════════════════════════╗"
    print_color $CYAN "║                 ACTREC TELEPHONE DIRECTORY                   ║"
    print_color $CYAN "║              Supabase Automation Script v1.0                ║"
    print_color $CYAN "║                                                              ║"
    print_color $CYAN "║  🚀 Automates Docker, Supabase CLI, and Project Setup      ║"
    print_color $CYAN "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

test_prerequisites() {
    print_color $YELLOW "🔍 Checking Prerequisites..."
    
    # Check Docker
    if command -v docker &> /dev/null; then
        docker_version=$(docker --version)
        print_color $GREEN "✅ Docker: $docker_version"
    else
        print_color $RED "❌ Docker not installed or not running"
        print_color $YELLOW "📥 Please install Docker from: https://www.docker.com/get-started"
        return 1
    fi
    
    # Check Node.js
    if command -v node &> /dev/null; then
        node_version=$(node --version)
        print_color $GREEN "✅ Node.js: $node_version"
    else
        print_color $RED "❌ Node.js not installed"
        print_color $YELLOW "📥 Please install Node.js from: https://nodejs.org/"
        return 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        npm_version=$(npm --version)
        print_color $GREEN "✅ npm: v$npm_version"
    else
        print_color $YELLOW "⚠️  npm not found"
    fi
    
    return 0
}

install_supabase_cli() {
    print_color $YELLOW "📦 Installing Supabase CLI..."
    
    # Check if already installed
    if npx supabase --version &> /dev/null; then
        supabase_version=$(npx supabase --version)
        print_color $GREEN "✅ Supabase CLI already installed: $supabase_version"
        return 0
    fi
    
    print_color $BLUE "⬇️  Installing Supabase CLI via npx..."
    
    # Test npx supabase
    if npx supabase --version &> /dev/null; then
        result=$(npx supabase --version)
        print_color $GREEN "✅ Supabase CLI installed successfully: $result"
        return 0
    else
        print_color $RED "❌ Failed to install Supabase CLI"
        return 1
    fi
}

start_docker_services() {
    print_color $YELLOW "🐳 Starting Docker services..."
    
    if docker info &> /dev/null; then
        print_color $GREEN "✅ Docker is running"
        return 0
    else
        print_color $RED "❌ Docker is not running. Please start Docker."
        return 1
    fi
}

initialize_supabase_project() {
    print_color $YELLOW "🚀 Initializing Supabase project..."
    
    if [ -d "supabase" ]; then
        print_color $GREEN "✅ Supabase project already initialized"
        return 0
    fi
    
    if npx supabase init; then
        print_color $GREEN "✅ Supabase project initialized"
        return 0
    else
        print_color $RED "❌ Failed to initialize Supabase project"
        return 1
    fi
}

start_local_supabase() {
    print_color $YELLOW "🏃 Starting local Supabase..."
    
    if npx supabase start; then
        print_color $GREEN "✅ Local Supabase started successfully"
        
        # Show connection details
        print_color $CYAN "\n📋 Local Supabase Details:"
        npx supabase status
        
        return 0
    else
        print_color $RED "❌ Failed to start local Supabase"
        return 1
    fi
}

stop_local_supabase() {
    print_color $YELLOW "🛑 Stopping local Supabase..."
    
    if npx supabase stop; then
        print_color $GREEN "✅ Local Supabase stopped"
        return 0
    else
        print_color $RED "❌ Failed to stop local Supabase"
        return 1
    fi
}

connect_remote_supabase() {
    local project_ref=$1
    local database_password=$2
    
    if [ -z "$project_ref" ]; then
        read -p "Enter your Supabase project reference (e.g., pcrukmbtjyuuzwszsdsl): " project_ref
    fi
    
    if [ -z "$database_password" ]; then
        read -s -p "Enter your database password: " database_password
        echo ""
    fi
    
    print_color $YELLOW "🔗 Connecting to remote Supabase project..."
    
    if npx supabase login && npx supabase link --project-ref "$project_ref" --password "$database_password"; then
        print_color $GREEN "✅ Connected to remote Supabase project"
        return 0
    else
        print_color $RED "❌ Failed to connect to remote Supabase"
        return 1
    fi
}

deploy_schema() {
    print_color $YELLOW "📊 Deploying database schema..."
    
    if [ ! -f "supabase/schema.sql" ]; then
        print_color $RED "❌ Schema file not found: supabase/schema.sql"
        return 1
    fi
    
    if npx supabase db push; then
        print_color $GREEN "✅ Schema deployed successfully"
        return 0
    else
        print_color $RED "❌ Failed to deploy schema"
        return 1
    fi
}

run_database_query() {
    local query=$1
    
    if [ -z "$query" ]; then
        read -p "Enter SQL query: " query
    fi
    
    print_color $YELLOW "🔍 Executing query..."
    
    if npx supabase db query "$query"; then
        return 0
    else
        print_color $RED "❌ Failed to execute query"
        return 1
    fi
}

show_project_status() {
    print_color $CYAN "📊 Project Status:"
    
    # Supabase status
    print_color $BLUE "\n🔧 Supabase Status:"
    npx supabase status 2>/dev/null || print_color $YELLOW "⚠️  Supabase not running or not initialized"
    
    # Docker containers
    print_color $BLUE "\n🐳 Docker Containers:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || print_color $YELLOW "⚠️  Docker not running"
    
    # Project files
    print_color $BLUE "\n📁 Project Structure:"
    [ -d "supabase" ] && print_color $GREEN "✅ supabase/ directory exists" || print_color $RED "❌ supabase/ directory missing"
    [ -f "supabase/schema.sql" ] && print_color $GREEN "✅ schema.sql exists" || print_color $RED "❌ schema.sql missing"
    [ -f ".env.local" ] && print_color $GREEN "✅ .env.local exists" || print_color $RED "❌ .env.local missing"
    [ -f "package.json" ] && print_color $GREEN "✅ package.json exists" || print_color $RED "❌ package.json missing"
}

show_menu() {
    show_header
    print_color $WHITE "📋 Available Actions:"
    echo ""
    print_color $BLUE "1️⃣   Check Prerequisites"
    print_color $BLUE "2️⃣   Install Supabase CLI"
    print_color $BLUE "3️⃣   Initialize Local Project"
    print_color $BLUE "4️⃣   Start Local Supabase"
    print_color $BLUE "5️⃣   Stop Local Supabase"
    print_color $BLUE "6️⃣   Connect to Remote Supabase"
    print_color $BLUE "7️⃣   Deploy Schema"
    print_color $BLUE "8️⃣   Run SQL Query"
    print_color $BLUE "9️⃣   Show Project Status"
    print_color $MAGENTA "🔄   Full Setup (1-4)"
    print_color $RED "❌   Exit"
    echo ""
    
    read -p "Select an option: " choice
    
    case $choice in
        1) test_prerequisites; read -p "Press any key to continue..." ;;
        2) install_supabase_cli; read -p "Press any key to continue..." ;;
        3) initialize_supabase_project; read -p "Press any key to continue..." ;;
        4) start_local_supabase; read -p "Press any key to continue..." ;;
        5) stop_local_supabase; read -p "Press any key to continue..." ;;
        6) connect_remote_supabase; read -p "Press any key to continue..." ;;
        7) deploy_schema; read -p "Press any key to continue..." ;;
        8) run_database_query; read -p "Press any key to continue..." ;;
        9) show_project_status; read -p "Press any key to continue..." ;;
        "setup") full_setup; read -p "Press any key to continue..." ;;
        "exit") print_color $GREEN "👋 Goodbye!"; exit 0 ;;
        *) print_color $RED "❌ Invalid option. Please try again."; sleep 2 ;;
    esac
    
    show_menu
}

full_setup() {
    print_color $MAGENTA "🚀 Running Full Setup..."
    
    if ! test_prerequisites; then
        print_color $RED "❌ Prerequisites check failed. Please install required software."
        return 1
    fi
    
    if ! install_supabase_cli; then
        print_color $RED "❌ Supabase CLI installation failed."
        return 1
    fi
    
    if ! start_docker_services; then
        print_color $RED "❌ Docker services check failed."
        return 1
    fi
    
    if ! initialize_supabase_project; then
        print_color $RED "❌ Supabase project initialization failed."
        return 1
    fi
    
    if ! start_local_supabase; then
        print_color $RED "❌ Local Supabase startup failed."
        return 1
    fi
    
    print_color $GREEN "\n🎉 Full setup completed successfully!"
    print_color $CYAN "📋 Next steps:"
    print_color $WHITE "   • Your local Supabase is running"
    print_color $WHITE "   • Check status with option 9"
    print_color $WHITE "   • Deploy schema with option 7"
    print_color $WHITE "   • Connect to remote with option 6"
    
    return 0
}

# Main execution
case "${1:-menu}" in
    "menu") show_menu ;;
    "setup") full_setup ;;
    "check") test_prerequisites ;;
    "install") install_supabase_cli ;;
    "init") initialize_supabase_project ;;
    "start") start_local_supabase ;;
    "stop") stop_local_supabase ;;
    "connect") connect_remote_supabase "$2" "$3" ;;
    "deploy") deploy_schema ;;
    "status") show_project_status ;;
    *) show_menu ;;
esac