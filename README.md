# Game Stop Management System

A real-time gaming cafe management system with Google Drive integration for data storage.

## Features

- 🎮 **Game Session Management** - Track PS4, PS5, VR, Racing Wheel, and Snooker sessions
- 🍕 **Food Order Management** - Handle food orders and payments
- 📊 **Real-time Dashboard** - Live updates for admin panel
- ☁️ **Google Drive Integration** - Store history data in Google Drive
- 📧 **Email Reports** - Send daily reports via SendPulse
- 📱 **Responsive Design** - Works on all devices

## Setup Instructions

### 1. Google Drive API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Drive API
4. Create credentials (API Key and OAuth 2.0 Client ID)
5. Update `config.js` with your credentials:

```javascript
const GOOGLE_DRIVE_CONFIG = {
    API_KEY: 'your-google-api-key',
    CLIENT_ID: 'your-google-client-id',
    FOLDER_ID: 'optional-folder-id', // Leave empty for root folder
    FILE_PREFIX: 'gamestop_history_',
    FILE_EXTENSION: '.csv'
};
```

### 2. SendPulse Email Setup

1. Sign up at [SendPulse](https://sendpulse.com/)
2. Get your API credentials
3. Update `send-mail.js` with your credentials:

```javascript
const SENDPULSE_CLIENT_ID = 'your-sendpulse-client-id';
const SENDPULSE_CLIENT_SECRET = 'your-sendpulse-client-secret';
```

### 3. File Structure

```
Game_Stop_Web/
├── index.html              # Main application
├── google-drive.js         # Google Drive integration
├── send-mail.js           # Email sending functionality
├── config.js              # Configuration file
├── images/                # Game and food images
└── README.md              # This file
```

## How It Works

### Data Storage
- **History Data**: Stored in Google Drive as CSV files
- **File Naming**: `gamestop_history_YYYY-MM-DD.csv`
- **Auto Cleanup**: Old files (30+ days) are automatically deleted
- **No Data**: If no file exists, shows "No customer data available"

### Real-time Updates
- All data changes are immediately saved to Google Drive
- Admin panel loads latest data from Google Drive on startup
- Email reports use data directly from Google Drive

### Email Reports
- Daily reports sent via SendPulse API
- CSV attachment with complete history
- Professional HTML email template

## Usage

### For Customers
1. Visit the website
2. Browse games and food menu
3. Fill out booking form
4. Wait for confirmation call

### For Admin
1. Login with admin credentials
2. View pending bookings
3. Start game sessions
4. Manage food orders
5. Send daily reports

## Admin Credentials
- Username: `gamestop`
- Password: `gs@123`

## API Endpoints

The system uses Google Drive API and SendPulse API:
- **Google Drive**: For file storage and retrieval
- **SendPulse**: For email delivery

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Notes

- Google Drive requires user authentication
- API keys should be kept secure
- Consider using environment variables for production

## Troubleshooting

### Google Drive Issues
- Check API credentials in `config.js`
- Ensure Google Drive API is enabled
- Verify OAuth consent screen is configured

### Email Issues
- Verify SendPulse credentials
- Check email quotas
- Ensure sender email is verified

### No Data Display
- Check Google Drive authentication
- Verify file exists in Google Drive
- Check browser console for errors

## Support

For issues or questions, check the browser console for error messages and ensure all API credentials are correctly configured.
