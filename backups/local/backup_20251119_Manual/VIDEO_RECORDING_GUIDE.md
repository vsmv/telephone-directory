# Video Recording Guide for ACTREC Telephone Directory Demos

This guide explains how to create actual video recordings of the application demos for client presentation.

## Prerequisites

1. Ensure the application is running (`npm run dev`)
2. Install screen recording software:
   - **Windows**: Use Xbox Game Bar (built-in) or OBS Studio
   - **Mac**: Use QuickTime Player or OBS Studio
   - **Linux**: Use OBS Studio or SimpleScreenRecorder

## Recording Process

### 1. Prepare the Application
```bash
# Start the development server
npm run dev

# Test the connection
npm run demo:test
```

### 2. Start Screen Recording
- **Windows (Xbox Game Bar)**:
  1. Press `Win + G` to open Xbox Game Bar
  2. Click the record button (circle icon)
  3. Select "Record audio" if you want to add narration
  4. Click "Start recording"

- **Mac (QuickTime Player)**:
  1. Open QuickTime Player
  2. File → New Screen Recording
  3. Click the record button
  4. Select recording area (full screen recommended)

- **Cross-platform (OBS Studio)**:
  1. Download and install OBS Studio
  2. Configure sources (display capture)
  3. Click "Start Recording"

### 3. Run the Demo Scripts
Open a new terminal and run one of the demo scripts:

```bash
# Run individual demos
npm run demo:admin     # Admin role demo
npm run demo:user      # User role demo
npm run demo:public    # Public search demo

# Or run all demos sequentially
npm run demo:full
```

### 4. Stop Recording
After the demo completes, stop the screen recording:
- **Windows/Xbox**: Press `Win + Alt + R` or click stop in Game Bar
- **Mac/QuickTime**: Click the stop button in menu bar
- **OBS**: Click "Stop Recording"

## Demo Script Details

### Admin Role Demo (`demo:admin`)
Covers:
- Login as administrator
- Navigate all dashboard tabs
- Contact Management (Add, Edit, Delete)
- Bulk Operations
- User Management
- Search with CSV export
- Learning Plans management
- Patentable Ideas management
- Settings (Password change)
- Logout

### User Role Demo (`demo:user`)
Covers:
- Login as regular user
- Search functionality
- Personal Learning Plans
- Personal Patentable Ideas
- Settings (Password change)
- Logout

### Public Search Demo (`demo:public`)
Covers:
- Access without login
- Various search patterns
- Search results display
- Return to home page

## Best Practices for Recording

1. **Screen Resolution**: Use 1920x1080 for consistent quality
2. **Browser Window**: Maximize the browser for full view
3. **Internet Connection**: Ensure stable connection for smooth demo
4. **Environment**: Minimize background noise and distractions
5. **Timing**: Allow extra time between actions for clarity
6. **Multiple Takes**: Record multiple versions if needed

## Post-Processing Tips

1. **Trimming**: Remove any dead space at beginning/end
2. **Annotations**: Add text overlays for important points
3. **Highlighting**: Use cursor highlighting tools if available
4. **Compression**: Export in MP4 format for compatibility
5. **Naming**: Use descriptive filenames:
   - `admin-demo-YYYY-MM-DD.mp4`
   - `user-demo-YYYY-MM-DD.mp4`
   - `public-search-demo-YYYY-MM-DD.mp4`

## Troubleshooting

### Common Issues
1. **Demo script fails**: 
   - Ensure app is running on port 3001
   - Verify credentials are correct
   - Check UI element selectors

2. **Recording quality issues**:
   - Close unnecessary applications
   - Ensure sufficient disk space
   - Use wired internet connection

3. **Performance lag**:
   - Reduce screen recording quality temporarily
   - Close background applications
   - Restart development server

### Contact Support
If you encounter issues with the demo scripts:
1. Check the console output for error messages
2. Verify all environment variables are set
3. Ensure database connectivity is working
4. Confirm demo user accounts exist in the database

## File Organization
Recordings should be saved in:
```
project-root/
├── recordings/
│   ├── admin/
│   ├── user/
│   └── public/
└── scripts/
    └── recordings/
```