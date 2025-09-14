# Game Stop Management System

A gaming cafe management system with Google Drive integration and email reporting.

## Features

- 🎮 **Game Session Management** - Track PS4, PS5, VR, Racing Wheel, and Snooker sessions
- 🍕 **Food Order Management** - Handle food orders and payments
- 📊 **Admin Dashboard** - Manage bookings and view history
- ☁️ **Google Drive Integration** - Store history data in Google Drive (with local storage fallback)
- 📧 **Email Reports** - Send daily reports via SendPulse
- 📱 **Responsive Design** - Works on all devices

## Quick Start

1. **Open `index.html`** in your browser
2. **For Google Drive**: Follow `GOOGLE_DRIVE_SETUP.md`
3. **For Email**: Update credentials in `send-mail.js`

## File Structure

```
Game_Stop_Web/
├── index.html              # Main application
├── google-drive.js         # Google Drive integration
├── send-mail.js           # Email sending functionality
├── config.js              # Configuration file
├── images/                # Game and food images
├── GOOGLE_DRIVE_SETUP.md  # Google Drive setup guide
└── README.md              # This file
```

## Admin Access

- **Username**: `gamestop`
- **Password**: `gs@123`

## Data Storage

- **Primary**: Google Drive (when configured)
- **Fallback**: Local Storage (when Google Drive unavailable)
- **Format**: CSV files with daily history

## Email Reports

- **Service**: SendPulse API
- **Trigger**: End of Day button
- **Content**: Daily history as CSV attachment

## Browser Support

- Chrome, Firefox, Safari, Edge (modern versions)
- Requires JavaScript enabled
