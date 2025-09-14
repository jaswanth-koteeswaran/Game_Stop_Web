// Client-side email service (WARNING: API keys will be exposed!)
// This is NOT recommended for production use

class EmailService {
    constructor() {
        // WARNING: These should be environment variables, not hardcoded!
        this.MAILERSEND_API_TOKEN = 'your-api-token-here';
        this.REPORT_EMAIL_ADDRESS = 'your-report-email@example.com';
        this.SENDER_EMAIL_ADDRESS = 'your-sender-email@example.com';
    }

    async sendDailyReport(csvContent, today) {
        try {
            console.log('Sending email directly from client...');
            
            // Convert CSV to Base64
            const base64Csv = btoa(csvContent);
            
            // Prepare email payload
            const emailPayload = {
                from: { email: this.SENDER_EMAIL_ADDRESS, name: "Game Stop Daily Report" },
                to: [{ email: this.REPORT_EMAIL_ADDRESS }],
                subject: `Game Stop Daily Report - ${today}`,
                text: "Please find the daily activity report attached.",
                html: "<p>Please find the daily activity report attached.</p>",
                attachments: [{
                    filename: `gamestop_history_${today}.csv`,
                    content: base64Csv
                }]
            };

            // Make API call
            const response = await fetch('https://api.mailersend.com/v1/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.MAILERSEND_API_TOKEN}`
                },
                body: JSON.stringify(emailPayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Email failed: ${errorData.message || 'Unknown error'}`);
            }

            return { success: true, message: "Email sent successfully!" };
            
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
} else {
    window.EmailService = EmailService;
}
