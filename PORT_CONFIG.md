# Port Configuration for Google OAuth

## Current Issue
Google OAuth client `69508411921-5hc06rgovomuvviik78lr7fdsiean84p.apps.googleusercontent.com` is not configured for `http://127.0.0.1:5500`.

## Solutions

### Option 1: Update Google OAuth Settings (Recommended)
1. Go to https://console.cloud.google.com/
2. Navigate to APIs & Services → Credentials
3. Find your OAuth 2.0 Client ID
4. Click edit and add these origins:
   - `http://127.0.0.1:5500`
   - `http://localhost:5500`
5. Save and wait 5-10 minutes for changes to propagate

### Option 2: Use Different Port
If you can't modify OAuth settings, try these ports:

**For Live Server (VS Code):**
- Use port 8080: `http://127.0.0.1:8080`
- Use port 3000: `http://127.0.0.1:3000`

**For Python HTTP Server:**
```bash
python -m http.server 8080
# Then open http://127.0.0.1:8080
```

**For Node.js HTTP Server:**
```bash
npx http-server -p 8080
# Then open http://127.0.0.1:8080
```

### Option 3: Use Localhost Instead
Try accessing via `http://localhost:5500` instead of `http://127.0.0.1:5500`

### Option 4: Temporary Workaround
The app will work with local storage fallback even without Google Drive.

## Testing
After making changes:
1. Clear browser cache
2. Refresh the page
3. Check browser console for Google Drive status
4. Look for green indicator in admin panel
