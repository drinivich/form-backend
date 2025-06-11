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
    user: process.env.EMAIL_USER, // Environment variable
    pass: process.env.EMAIL_PASS  // Environment variable
  }
});

// Function to generate HTML email template
function generateEmailTemplate(name, email, message) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
      box-shadow: 0 4px 15px rgba(204, 0, 0, 0.1);
      border: 2px solid #cc0000;
    }
    .header {
      background-color: #cc0000;
      color: #fff;
      padding: 20px;
      text-align: center;
      font-weight: bold;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      font-size: 16px;
      color: #222;
    }
    .field {
      margin-bottom: 15px;
    }
    .field-label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
      color: #cc0000;
    }
    .field-value {
      background: #feeaea;
      padding: 10px;
      border-radius: 4px;
      color: #990000;
    }
    .footer {
      background-color: #ffeeee;
      color: #990000;
      text-align: center;
      padding: 15px;
      font-size: 13px;
      border-top: 2px solid #cc0000;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">New Message Received</div>
    <div class="content">
      <div class="field">
        <span class="field-label">Name:</span>
        <div class="field-value">${name}</div>
      </div>
      <div class="field">
        <span class="field-label">Email:</span>
        <div class="field-value">${email}</div>
      </div>
      <div class="field">
        <span class="field-label">Message:</span>
        <div class="field-value">${message}</div>
      </div>
    </div>
    <div class="footer">&copy; ${new Date().getFullYear()} LightningPro. All rights reserved.</div>
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
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format.' });
    }

    const htmlContent = generateEmailTemplate(name, email, message);

    const mailOptions = {
      from: '"LightningPro Contact" <lightningproteam@gmail.com>',
      to: 'lightningproteam@gmail.com',
      replyTo: `"${name}" <${email}>`,
      subject: `New Submission from ${name}`,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ success: false, message: 'Error sending message.' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
