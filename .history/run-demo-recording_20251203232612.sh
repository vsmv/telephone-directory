#!/bin/bash
# ACTREC Telephone Directory - Automated Demo with Recording
# Duration: 10 minutes
# For Linux/Mac systems

RECORDER_TYPE="${1:-simplescreenrecorder}"  # Options: simplescreenrecorder, obs, kazam, quicktime

echo "========================================"
echo "  ACTREC TELEPHONE DIRECTORY"
echo "  Automated 10-Minute Demo"
echo "========================================"

# Check if dev server is running
echo -e "\nChecking dev server..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✓ Dev server is running"
else
    echo "❌ ERROR: Dev server not running on port 3000"
    echo "Please start: npm run dev"
    exit 1
fi

# Display configuration
echo -e "\nDemo Configuration:"
echo "  Duration: 10 minutes"
echo "  URL: http://localhost:3000"
echo "  Admin: jeyarish.venki@gmail.com / Welcome123$"
echo "  Test Cases: 10 comprehensive scenarios"
echo "  Recorder: $RECORDER_TYPE"

# Recording instructions
echo -e "\n========================================"
echo "  RECORDING SETUP"
echo "========================================"

case "$RECORDER_TYPE" in
    "simplescreenrecorder")
        echo -e "\nSimpleScreenRecorder (Linux):"
        echo "  1. Open SimpleScreenRecorder"
        echo "  2. Select recording area"
        echo "  3. Click 'Start Recording'"
        echo -e "\n⚠️  Start recording NOW..."
        sleep 7
        ;;
    "obs")
        echo -e "\nOBS Studio:"
        echo "  1. Open OBS Studio"
        echo "  2. Set Scene: Display Capture"
        echo "  3. Click 'Start Recording'"
        echo -e "\n⚠️  Start OBS Recording NOW..."
        sleep 7
        ;;
    "kazam")
        echo -e "\nKazam (Linux):"
        echo "  1. Open Kazam"
        echo "  2. Select 'Screencast'"
        echo "  3. Click capture button"
        echo -e "\n⚠️  Start Kazam recording NOW..."
        sleep 5
        ;;
    "quicktime")
        echo -e "\nQuickTime (Mac):"
        echo "  1. Open QuickTime Player"
        echo "  2. File > New Screen Recording"
        echo "  3. Click record button"
        echo -e "\n⚠️  Start QuickTime recording NOW..."
        sleep 5
        ;;
esac

echo -e "\n✓ Opening browser in 3 seconds..."
sleep 3

# Open browser (works on Linux and Mac)
if command -v xdg-open > /dev/null; then
    xdg-open "http://localhost:3000" &
elif command -v open > /dev/null; then
    open "http://localhost:3000" &
else
    echo "Please open http://localhost:3000 in your browser"
fi

sleep 2

# Display demo script
echo -e "\n========================================"
echo "  DEMO SCRIPT - FOLLOW THESE STEPS"
echo "========================================"

echo -e "\n⏱️  MINUTE 1: Landing & Public Search (0:00-1:00)"
echo "   Actions:"
echo "   • Show landing page with ACTREC branding"
echo "   • Click 'Search Directory'"
echo "   • Search: 'Medical'"
echo "   • Show results, click 'Back to Home'"
read -p $'\n   Press ENTER for next section...'

echo -e "\n⏱️  MINUTE 2: Admin Login (1:00-2:00)"
echo "   • Click 'Login'"
echo "   • Email: jeyarish.venki@gmail.com"
echo "   • Password: Welcome123$"
echo "   • Show all admin tabs"
read -p $'\n   Press ENTER for next section...'

echo -e "\n⏱️  MINUTE 3-4: Contact Management (2:00-4:00)"
echo "   • Create contact: DR. DEMO TEST"
echo "   • Edit contact"
echo "   • Delete contact"
read -p $'\n   Press ENTER for next section...'

echo -e "\n⏱️  MINUTE 5: Bulk Upload (4:00-5:00)"
echo "   • Bulk Operations tab"
echo "   • Upload sample-contacts.csv"
echo "   • Show 5 contacts imported"
read -p $'\n   Press ENTER for next section...'

echo -e "\n⏱️  MINUTE 6: User Management (5:00-6:00)"
echo "   • Create user: demo.user@actrec.gov.in"
echo "   • Change role to Admin"
read -p $'\n   Press ENTER for next section...'

echo -e "\n⏱️  MINUTE 7: Bulk Operations (6:00-7:00)"
echo "   • Bulk role change"
echo "   • Bulk password reset"
read -p $'\n   Press ENTER for next section...'

echo -e "\n⏱️  MINUTE 8: Learning Plans (7:00-8:00)"
echo "   • Create plan: Advanced NGS Analysis"
echo "   • Edit and update status"
read -p $'\n   Press ENTER for next section...'

echo -e "\n⏱️  MINUTE 9: Patentable Ideas (8:00-9:00)"
echo "   • Create idea: AI-Based Cancer Diagnosis"
echo "   • Edit and approve"
read -p $'\n   Press ENTER for next section...'

echo -e "\n⏱️  MINUTE 10: Reports & Summary (9:00-10:00)"
echo "   • Settings tab - show statistics"
echo "   • Click counts for drill-down"
echo "   • User View demonstration"
echo "   • Logout"

echo -e "\n========================================"
echo "  DEMO COMPLETE!"
echo "========================================"

echo -e "\n📹 Remember to STOP your recording!"
echo "✅ Next Steps:"
echo "   1. Review video quality"
echo "   2. Rename to: ACTREC_Demo_10min_[date].mp4"
echo "   3. Share with ACTREC management"

echo -e "\n========================================\n"
