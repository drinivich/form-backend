const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'lightningproteam@gmail.com',
    pass: 'drkn sybw yezz xclv' // Use your app password here
  }
});

// Function to generate HTML email template
function generateEmailTemplate(name, email, message) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .logo {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .logo::before {
            content: "⚡";
            font-size: 20px;
        }
        .content {
            padding: 30px;
        }
        .field-group {
            margin-bottom: 25px;
        }
        .field-label {
            font-size: 12px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
            font-weight: 500;
        }
        .field-value {
            font-size: 16px;
            color: #333;
            word-wrap: break-word;
        }
        .field-value.email {
            color: #4285f4;
            text-decoration: none;
        }
        .message-field {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            border-radius: 0 4px 4px 0;
            margin-top: 10px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 0;
            font-size: 12px;
            color: #6c757d;
        }
        .timestamp {
            font-size: 11px;
            color: #999;
            margin-top: 10px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo"></div>
            <h1>New Submission Received From<br>LightningProContactPage</h1>
        </div>
        
        <div class="content">
            <div class="field-group">
                <div class="field-label">email</div>
                <div class="field-value email">${email}</div>
            </div>
            
            <div class="field-group">
                <div class="field-label">name</div>
                <div class="field-value">${name}</div>
            </div>
            
            <div class="field-group">
                <div class="field-label">message</div>
                <div class="message-field">
                    <div class="field-value">${message}</div>
                </div>
            </div>
            
            <div class="timestamp">
                Received on ${new Date().toLocaleString()}
            </div>
        </div>
        
        <div class="footer">
            <p>Copyright © ${new Date().getFullYear()} LightningPro. All rights reserved.</p>
            <p style="margin-top: 10px; font-size: 11px;">
                Powered by <strong>LightningPro Contact System</strong>
            </p>
        </div>
    </div>
</body>
</html>`;
}

app.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      });
    }
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    const htmlContent = generateEmailTemplate(name, email, message);
    
    const mailOptions = {
      from: 'lightningproteam@gmail.com', // Use your authenticated email
      to: 'lightningproteam@gmail.com',
      replyTo: email, // This allows you to reply directly to the sender
      subject: `New Submission Received From LightningProContactPage`,
      html: htmlContent,
      // Also include plain text version for better compatibility
      text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n\nReceived on ${new Date().toLocaleString()}`
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully!' 
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.' 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
