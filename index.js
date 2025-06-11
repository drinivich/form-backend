const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow requests from GitHub Pages frontend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Moved to environment variable
    pass: process.env.EMAIL_PASS  // Moved to environment variable
  }
});

function generateEmailTemplate(name, email, message) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #f9f9f9;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(255, 0, 0, 0.1);
      overflow: hidden;
      border: 1px solid #ff0000cc;
    }
    .header {
      background-color: #cc0000; /* Dark red */
      color: white;
      padding: 20px 30px;
      text-align: center;
      font-weight: 700;
      font-size: 24px;
      letter-spacing: 1px;
    }
    .content {
      padding: 30px;
      font-size: 16px;
      line-height: 1.5;
      color: #222;
    }
    .field {
      margin-bottom: 20px;
    }
    .field-label {
      display: block;
      font-weight: 600;
      margin-bottom: 6px;
      color: #cc0000; /* Red label */
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .field-value {
      background: #feeaea;
      border-radius: 4px;
      padding: 10px 15px;
      color: #990000;
      word-break: break-word;
      font-size: 15px;
    }
    .message-value {
      white-space: pre-wrap;
    }
    .footer {
      background-color: #ffeeee;
      color: #990000;
      text-align: center;
      padding: 20px 30px;
      font-size: 13px;
      border-top: 1px solid #cc0000;
    }
    .timestamp {
      color: #aa0000;
      font-size: 12px;
      margin-top: 15px;
      text-align: right;
      font-style: italic;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      New Submission Received from LightningPro Website
    </div>
    <div class="content">
      <div class="field">
        <span class="field-label">Email</span>
        <div class="field-value">${email}</div>
      </div>
      <div class="field">
        <span class="field-label">Name</span>
        <div class="field-value">${name}</div>
      </div>
      <div class="field">
        <span class="field-label">Message</span>
        <div class="field-value message-value">${message}</div>
      </div>
      <div class="timestamp">
        Received on ${new Date().toLocaleString()}
      </div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} LightningPro. All rights reserved.<br />
      Powered by <strong>LightningPro Contact System</strong>
    </div>
  </div>
</body>
</html>
`;
}

// POST route to handle form submission
app.post('/submit', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    const htmlContent = generateEmailTemplate(name, email, message);

    const mailOptions = {
      from: '"LightningPro Contact" <lightningproteam@gmail.com>',
      to: 'lightningproteam@gmail.com',
      replyTo: `"${name}" <${email}>`,
      subject: `New Submission Received From LightningProContactPage`,
      html: htmlContent,
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
