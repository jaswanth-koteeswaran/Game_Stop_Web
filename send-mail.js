// Direct MailerSend email sending function (imported logic from send-report.js)
async function sendMail(csvContent, today) {
    // MailerSend credentials
    const MAILERSEND_API_TOKEN = 'mlsn.0c6f1284618b67133e4b52375860f56c1e1bf37054124edd5148390e7450cd17';
    const REPORT_EMAIL_ADDRESS = 'gamestopchennai@gmail.com';
    const SENDER_EMAIL_ADDRESS = 'gamestopchennai@gmail.com';
    
    try {
        console.log('Sending email directly via MailerSend API...');
        
        // Convert the CSV text content to Base64, which is required by the MailerSend API for attachments
        const base64Csv = btoa(csvContent);
        
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

        // Make the API call to MailerSend directly
        const response = await fetch('https://api.mailersend.com/v1/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MAILERSEND_API_TOKEN}`
            },
            body: JSON.stringify(emailPayload)
        });

        console.log('Response status:', response.status);
        
        // If MailerSend reports an error, handle it
        if (!response.ok) {
            const errorData = await response.json();
            console.error('MailerSend API Error:', errorData);
            throw new Error(`Email failed: ${errorData.message || 'Unknown error'}`);
        }

        const result = await response.json();
        console.log('Email sent successfully!', result);
        return { success: true, message: "Email sent successfully!", data: result };
        
    } catch (error) {
        console.error('Email sending failed:', error);
        
        // If CORS error, show fallback
        if (error.message.includes('CORS') || error.message.includes('fetch') || error.message.includes('blocked')) {
            console.log('CORS error detected, showing fallback...');
            showEmailFallback(csvContent, today);
            return { success: true, message: "Email content prepared for manual sending" };
        }
        
        throw error;
    }
}

// Fallback function when CORS fails
function showEmailFallback(csvContent, today) {
    const emailSubject = `Game Stop Daily Report - ${today}`;
    const emailBody = `Dear Team,\n\nPlease find the daily activity report attached.\n\nReport Date: ${today}\nTotal Records: ${csvContent.split('\n').length - 2}\n\nBest regards,\nGame Stop Management System`;
    
    // Create modal for email content
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); display: flex; align-items: center;
        justify-content: center; z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div style="background: #1c1917; padding: 2rem; border-radius: 0.75rem; 
                    border: 1px solid #44403c; max-width: 600px; width: 90%;">
            <h3 style="color: #eab308; margin-bottom: 1rem;">📧 Email Content Ready</h3>
            <p style="color: #d1d5db; margin-bottom: 1rem;">
                Due to CORS restrictions, please copy the content below and send manually:
            </p>
            <div style="margin-bottom: 1rem;">
                <label style="color: #d1d5db; font-weight: bold;">Subject:</label>
                <input type="text" value="${emailSubject}" readonly 
                       style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; 
                              background: #374151; border: 1px solid #4b5563; 
                              color: #f3f4f6; border-radius: 0.25rem;">
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="color: #d1d5db; font-weight: bold;">Body:</label>
                <textarea readonly rows="6" 
                          style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; 
                                 background: #374151; border: 1px solid #4b5563; 
                                 color: #f3f4f6; border-radius: 0.25rem;">${emailBody}</textarea>
            </div>
            <div style="margin-bottom: 1rem;">
                <label style="color: #d1d5db; font-weight: bold;">CSV Data (for attachment):</label>
                <textarea readonly rows="4" 
                          style="width: 100%; padding: 0.5rem; margin-top: 0.25rem; 
                                 background: #1f2937; border: 1px solid #4b5563; 
                                 color: #9ca3af; border-radius: 0.25rem; font-family: monospace;">${csvContent}</textarea>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end; flex-wrap: wrap;">
                <button onclick="navigator.clipboard.writeText('${emailSubject}'); alert('Subject copied!');" 
                        style="background: #4f46e5; color: white; padding: 0.5rem 1rem; 
                               border: none; border-radius: 0.25rem; cursor: pointer;">Copy Subject</button>
                <button onclick="navigator.clipboard.writeText('${emailBody}'); alert('Body copied!');" 
                        style="background: #4f46e5; color: white; padding: 0.5rem 1rem; 
                               border: none; border-radius: 0.25rem; cursor: pointer;">Copy Body</button>
                <button onclick="navigator.clipboard.writeText('${csvContent}'); alert('CSV copied!');" 
                        style="background: #059669; color: white; padding: 0.5rem 1rem; 
                               border: none; border-radius: 0.25rem; cursor: pointer;">Copy CSV</button>
                <button onclick="window.open('mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}', '_blank');" 
                        style="background: #eab308; color: #1c1917; padding: 0.5rem 1rem; 
                               border: none; border-radius: 0.25rem; cursor: pointer; font-weight: bold;">Open Email Client</button>
                <button onclick="this.closest('div').parentElement.remove();" 
                        style="background: #dc2626; color: white; padding: 0.5rem 1rem; 
                               border: none; border-radius: 0.25rem; cursor: pointer;">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

