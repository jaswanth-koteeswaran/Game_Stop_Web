// This is a Netlify Function that will run on a server, not in the browser.
// It keeps your API token secure.

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { csvContent, today } = JSON.parse(event.body);
        
        // Securely get the API token and email addresses from environment variables set in your Netlify dashboard
        const MAILERSEND_API_TOKEN = process.env.MAILERSEND_API_TOKEN;
        const REPORT_EMAIL_ADDRESS = process.env.REPORT_EMAIL_ADDRESS;
        const SENDER_EMAIL_ADDRESS = process.env.SENDER_EMAIL_ADDRESS;

        // Check if the necessary secrets are configured in Netlify
        if (!MAILERSEND_API_TOKEN || !REPORT_EMAIL_ADDRESS || !SENDER_EMAIL_ADDRESS) {
             return { statusCode: 500, body: 'Server configuration error: Missing environment variables in Netlify.' };
        }

        // Convert the CSV text content to Base64, which is required by the MailerSend API for attachments
        const base64Csv = Buffer.from(csvContent).toString('base64');

        // Prepare the email payload in the format MailerSend expects
        const emailPayload = {
            from: { email: SENDER_EMAIL_ADDRESS, name: "Game Stop Daily Report" },
            to: [{ email: REPORT_EMAIL_ADDRESS }],
            subject: `Game Stop Daily Report - ${today}`,
            text: "Please find the daily activity report attached.",
            html: "<p>Please find the daily activity report attached.</p>",
            attachments: [{
                filename: `gamestop_history_${today}.csv`,
                content: base64Csv
            }]
        };

        // Make the API call to MailerSend from the secure server environment
        const response = await fetch('https://api.mailersend.com/v1/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERSEND_API_TOKEN}`
            },
            body: JSON.stringify(emailPayload)
        });

        // If MailerSend reports an error, forward that information back
        if (!response.ok) {
            const errorData = await response.json();
            console.error('MailerSend API Error:', errorData);
            return { statusCode: response.status, body: JSON.stringify(errorData) };
        }

        // If successful, send a success message back to the admin panel
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email sent successfully!" })
        };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "An internal server error occurred." })
        };
    }
};

