# Google Drive Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Google API Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create a New Project**
   - Click "Select a project" → "New Project"
   - Name: "Game Stop Management"
   - Click "Create"

3. **Enable Google Drive API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Drive API"
   - Click on it and press "Enable"

4. **Create Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API Key

5. **Create OAuth 2.0 Client ID**
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "Game Stop Web App"
   - **IMPORTANT**: Add these Authorized JavaScript origins:
     - `http://127.0.0.1:5500` (for Live Server)
     - `http://localhost:5500` (for localhost)
     - `https://yourdomain.com` (for production)
   - Click "Create"
   - Copy the Client ID

### Step 2: Update Configuration

Open `config.js` and replace the placeholder values:

```javascript
const GOOGLE_DRIVE_CONFIG = {
    API_KEY: 'your-actual-api-key-here',
    CLIENT_ID: 'your-actual-client-id-here',
    FOLDER_ID: '', // Leave empty for root folder
    FILE_PREFIX: 'gamestop_history_',
    FILE_EXTENSION: '.csv'
};
```

### Step 3: Test the Setup

1. Open your website
2. Go to Admin Panel
3. Check browser console for:
   - ✅ "Google Drive API initialized successfully"
   - ❌ "Google Drive credentials not configured"

## Troubleshooting

### "Google Drive not available" Error

**Cause**: API credentials not configured or invalid

**Solution**:
1. Check `config.js` has real credentials (not placeholders)
2. Verify API Key is correct
3. Verify Client ID is correct
4. Ensure Google Drive API is enabled

### "Authentication required" Error

**Cause**: User needs to sign in to Google

**Solution**:
1. Click "Sign in" when prompted
2. Grant permissions to access Google Drive
3. The app will remember your authentication

### "Failed to upload" Error

**Cause**: Permission issues or network problems

**Solution**:
1. Check internet connection
2. Verify Google Drive has space available
3. Try refreshing the page and signing in again

## Security Notes

- Keep your API credentials secure
- Don't share them publicly
- Consider using environment variables for production
- The app only accesses files it creates (scoped permissions)

## Fallback Mode

If Google Drive setup fails, the app automatically falls back to local storage:
- Data stored in browser's localStorage
- Works offline
- Data persists between sessions
- No cloud backup

## Need Help?

1. Check browser console for error messages
2. Verify all steps in this guide
3. Test with a simple file upload first
4. Ensure your Google account has Drive access
