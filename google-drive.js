// Google Drive API integration for storing and retrieving history data
class GoogleDriveManager {
    constructor() {
        this.API_KEY = window.GOOGLE_DRIVE_CONFIG?.API_KEY || 'AIzaSyAK43PPW1QJybAl3WycU--D5RXFy2ij7OI';
        this.CLIENT_ID = window.GOOGLE_DRIVE_CONFIG?.CLIENT_ID || '69508411921-5hc06rgovomuvviik78lr7fdsiean84p.apps.googleusercontent.com';
        this.FOLDER_ID = window.GOOGLE_DRIVE_CONFIG?.FOLDER_ID || 'root';
        this.DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';
        this.SCOPES = 'https://www.googleapis.com/auth/drive.file';
        this.gapi = null;
        this.isInitialized = false;
    }

    // Initialize Google Drive API
    async initialize() {
        try {
            if (this.isInitialized) return true;

            // Check if credentials are configured
            if (this.API_KEY === 'YOUR_GOOGLE_API_KEY' || this.CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') {
                console.warn('⚠️ Google Drive credentials not configured. Please update config.js');
                return false;
            }

            // Load Google API script
            await this.loadGoogleAPI();
            
            // Initialize gapi
            await new Promise((resolve, reject) => {
                gapi.load('client:auth2', async () => {
                    try {
                        await gapi.client.init({
                            apiKey: this.API_KEY,
                            clientId: this.CLIENT_ID,
                            discoveryDocs: [this.DISCOVERY_DOC],
                            scope: this.SCOPES
                        });
                        this.gapi = gapi;
                        this.isInitialized = true;
                        console.log('✅ Google Drive API initialized successfully');
                        resolve();
                    } catch (error) {
                        console.error('❌ Google API initialization failed:', error);
                        
                        // Check if it's an origin error
                        if (error.error === 'idpiframe_initialization_failed') {
                            console.error('🔧 OAuth Origin Error: Please add your current origin to Google OAuth settings');
                            console.error('📋 Current origin:', window.location.origin);
                            console.error('🔗 Fix: Go to https://console.cloud.google.com/ and add this origin to your OAuth client');
                        }
                        
                        reject(error);
                    }
                });
            });

            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Google Drive API:', error);
            
            // Provide helpful error message for OAuth issues
            if (error.error === 'idpiframe_initialization_failed') {
                console.error('🔧 OAuth Origin Error: Please add your current origin to Google OAuth settings');
                console.error('📋 Current origin:', window.location.origin);
                console.error('🔗 Fix: Go to https://console.cloud.google.com/ and add this origin to your OAuth client');
            }
            
            return false;
        }
    }

    // Load Google API script dynamically
    loadGoogleAPI() {
        return new Promise((resolve, reject) => {
            if (window.gapi) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Authenticate user
    async authenticate() {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            const authInstance = this.gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn();
            
            console.log('✅ User authenticated:', user.getBasicProfile().getName());
            return true;
        } catch (error) {
            console.error('❌ Authentication failed:', error);
            return false;
        }
    }

    // Upload CSV file to Google Drive
    async uploadHistory(csvContent, filename) {
        try {
            if (!this.isInitialized) {
                const initialized = await this.initialize();
                if (!initialized) throw new Error('Failed to initialize Google Drive API');
            }

            // Check if user is authenticated
            const authInstance = this.gapi.auth2.getAuthInstance();
            if (!authInstance.isSignedIn.get()) {
                const authenticated = await this.authenticate();
                if (!authenticated) throw new Error('Authentication required');
            }

            // Convert CSV to Blob
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const metadata = {
                name: filename,
                parents: [this.FOLDER_ID], // Upload to specified folder
                mimeType: 'text/csv'
            };

            // Create form data for multipart upload
            const form = new FormData();
            form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
            form.append('file', blob);

            // Upload file
            const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authInstance.currentUser.get().getAuthResponse().access_token}`
                },
                body: form
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('✅ File uploaded to Google Drive:', result.id);
            return result.id;
        } catch (error) {
            console.error('❌ Upload failed:', error);
            throw error;
        }
    }

    // Download CSV file from Google Drive
    async downloadHistory(filename) {
        try {
            if (!this.isInitialized) {
                const initialized = await this.initialize();
                if (!initialized) throw new Error('Failed to initialize Google Drive API');
            }

            // Check if user is authenticated
            const authInstance = this.gapi.auth2.getAuthInstance();
            if (!authInstance.isSignedIn.get()) {
                const authenticated = await this.authenticate();
                if (!authenticated) throw new Error('Authentication required');
            }

            // Search for file by name
            const response = await this.gapi.client.drive.files.list({
                q: `name='${filename}' and trashed=false`,
                fields: 'files(id, name, modifiedTime)'
            });

            const files = response.result.files;
            if (files.length === 0) {
                console.log('📁 No file found:', filename);
                return null; // No file available
            }

            // Get the most recent file
            const file = files.sort((a, b) => new Date(b.modifiedTime) - new Date(a.modifiedTime))[0];

            // Download file content
            const downloadResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`, {
                headers: {
                    'Authorization': `Bearer ${authInstance.currentUser.get().getAuthResponse().access_token}`
                }
            });

            if (!downloadResponse.ok) {
                throw new Error(`Download failed: ${downloadResponse.statusText}`);
            }

            const csvContent = await downloadResponse.text();
            console.log('✅ File downloaded from Google Drive:', filename);
            return csvContent;
        } catch (error) {
            console.error('❌ Download failed:', error);
            return null; // Return null if file not available
        }
    }

    // List all history files
    async listHistoryFiles() {
        try {
            if (!this.isInitialized) {
                const initialized = await this.initialize();
                if (!initialized) throw new Error('Failed to initialize Google Drive API');
            }

            const authInstance = this.gapi.auth2.getAuthInstance();
            if (!authInstance.isSignedIn.get()) {
                const authenticated = await this.authenticate();
                if (!authenticated) throw new Error('Authentication required');
            }

            const response = await this.gapi.client.drive.files.list({
                q: "name contains 'gamestop_history' and trashed=false",
                fields: 'files(id, name, modifiedTime, size)',
                orderBy: 'modifiedTime desc'
            });

            return response.result.files;
        } catch (error) {
            console.error('❌ Failed to list files:', error);
            return [];
        }
    }

    // Delete old history files (keep only last 30 days)
    async cleanupOldFiles() {
        try {
            const files = await this.listHistoryFiles();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            for (const file of files) {
                const fileDate = new Date(file.modifiedTime);
                if (fileDate < thirtyDaysAgo) {
                    await this.gapi.client.drive.files.delete({
                        fileId: file.id
                    });
                    console.log('🗑️ Deleted old file:', file.name);
                }
            }
        } catch (error) {
            console.error('❌ Cleanup failed:', error);
        }
    }
}

// Create global instance
const googleDriveManager = new GoogleDriveManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleDriveManager;
} else {
    window.GoogleDriveManager = GoogleDriveManager;
    window.googleDriveManager = googleDriveManager;
}
