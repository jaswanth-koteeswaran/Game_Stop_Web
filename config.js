// Google Drive API Configuration
// Replace these with your actual Google API credentials

const GOOGLE_DRIVE_CONFIG = {
    // Get these from Google Cloud Console
    API_KEY: 'AIzaSyAK43PPW1QJybAl3WycU--D5RXFy2ij7OI',
    CLIENT_ID: '69508411921-5hc06rgovomuvviik78lr7fdsiean84p.apps.googleusercontent.com',
    
    // Optional: Specify a folder ID to store files in a specific folder
    // Leave empty to store in root folder
    FOLDER_ID: '',
    
    // File naming pattern
    FILE_PREFIX: 'gamestop_history_',
    FILE_EXTENSION: '.csv'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GOOGLE_DRIVE_CONFIG;
} else {
    window.GOOGLE_DRIVE_CONFIG = GOOGLE_DRIVE_CONFIG;
}
