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

// Generate HTML email template
function generateEmailTemplate(name, email, message) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 500px;
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
      background: rgb(255, 0, 0);
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
      width: 64px;
      height: 64px;
      background: rgba(255, 193, 7, 0.9);
      border-radius: 8px;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px;
    }
    .logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 4px;
    }
    .content {
      padding: 30px;
    }
    .field-group {
      margin-bottom: 25px;
    }
    .field-label {
      font-size: 12px;
      color: #faf8f8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
      font-weight: 600;
    }
    .field-value {
      font-size: 16px;
      color: #faf8f8;
      word-wrap: break-word;
    }
    .field-value.email {
      color: #faf8f8;
      font-weight: 500;
    }
    .message-field {
      background-color: #faf8f8;
      border-left: 4px solid #ffee00;
      padding: 15px;
      border-radius: 0 4px 4px 0;
      margin-top: 10px;
    }
    .footer {
      background-color: #fef2f2;
      padding: 20px;
      text-align: center;
      border-top: 1px solid #fecaca;
    }
    .footer p {
      margin: 0;
      font-size: 12px;
      color: #7f1d1d;
    }
    .timestamp {
      font-size: 11px;
      color: #7f1d1d;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">
        <img src="https://raw.githubusercontent.com/drinivich/form-backend/main/fundo-escuro.png" alt="LightningPro Logo" />
      </div>
      <h1>New Submission Received From<br>Lightning Website Contact Page</h1>
    </div>

    <div class="content">
      <div class="field-group">
        <div class="field-label" style="color: #7f1d1d">email</div>
        <div class="field-value email">${email}</div>
      </div>

      <div class="field-group">
        <div class="field-label" style="color: #7f1d1d">name</div>
        <div class="field-value">${name}</div>
      </div>

      <div class="field-group">
        <div class="field-label" style="color: #7f1d1d">message</div>
        <div class="message-field">
          <div class="field-value">${message}</div>
        </div>
      </div>

      <div class="timestamp" style="color: #7f1d1d">
        Received on ${new Date().toLocaleString()}
      </div>
    </div>

    <div class="footer">
      <p style="color: #7f1d1d" >Copyright © ${new Date().getFullYear()} LightningPro. All rights reserved.</p>
      <p style="margin-top: 10px; font-size: 11px;">
        Powered by <strong>LightningPro Contact System</strong>
      </p>
    </div>
  </div>
</body>
</html>`;
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
