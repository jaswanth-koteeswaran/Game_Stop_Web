// This is a Netlify Function that will run on a server, not in the browser.
// It keeps your API token secure.

exports.handler = async function(event, context) {
    console.log('Function called with method:', event.httpMethod);
    console.log('Event body:', event.body);
    
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        console.log('Method not allowed:', event.httpMethod);
        return { 
            statusCode: 405, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed', receivedMethod: event.httpMethod })
        };
    }

    try {
        const { csvContent, today } = JSON.parse(event.body);
        
        // Use your actual MailerSend credentials
        const MAILERSEND_API_TOKEN = 'mlsn.0c6f1284618b67133e4b52375860f56c1e1bf37054124edd5148390e7450cd17';
        const REPORT_EMAIL_ADDRESS = 'gamestopchennai@gmail.com';
        const SENDER_EMAIL_ADDRESS = 'gamestopchennai@gmail.com';

        // Validate credentials
        if (!MAILERSEND_API_TOKEN || !REPORT_EMAIL_ADDRESS || !SENDER_EMAIL_ADDRESS) {
             return { 
                 statusCode: 500, 
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ error: 'Server configuration error: Missing email credentials.' })
             };
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
            return { 
                statusCode: response.status, 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorData) 
            };
        }

        // If successful, send a success message back to the admin panel
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: "Email sent successfully!" })
        };

    } catch (error) {
        console.error('Function Error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: "An internal server error occurred." })
        };
    }
};

