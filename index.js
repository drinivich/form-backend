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
  <meta charset="UTF-8">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; padding: 20px; margin: 0;">
  <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">

    <div style="background: rgb(255, 0, 0); color: white; padding: 30px 20px; text-align: center;">
      <div style="width: 64px; height: 64px; background: rgba(255, 193, 7, 0.9); border-radius: 8px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; padding: 8px;">
        <img src="https://raw.githubusercontent.com/drinivich/form-backend/main/fundo-escuro.png" alt="LightningPro Logo" style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px;" />
      </div>
      <h1 style="margin: 0; font-size: 20px; font-weight: 600;">New Submission Received From<br>Lightning Website Contact Page</h1>
    </div>

    <div style="padding: 30px;">
      <div style="margin-bottom: 25px;">
        <div style="font-size: 12px; color: #7f1d1d; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; font-weight: 600;">Email</div>
        <div style="font-size: 16px; color: #333; word-wrap: break-word; font-weight: 500;">${email}</div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="font-size: 12px; color: #7f1d1d; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; font-weight: 600;">Name</div>
        <div style="font-size: 16px; color: #333; word-wrap: break-word;">${name}</div>
      </div>

      <div style="margin-bottom: 25px;">
        <div style="font-size: 12px; color: #7f1d1d; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; font-weight: 600;">Message</div>
        <div style="background-color: #faf8f8; border-left: 4px solid #ffee00; padding: 15px; border-radius: 0 4px 4px 0;">
          <div style="font-size: 16px; color: #333; white-space: pre-wrap;">${message}</div>
        </div>
      </div>

      <div style="font-size: 11px; color: #7f1d1d; margin-top: 10px;">
        Received on ${new Date().toLocaleString()}
      </div>
    </div>

    <div style="background-color: #fef2f2; padding: 20px; text-align: center; border-top: 1px solid #fecaca;">
      <p style="margin: 0; font-size: 12px; color: #7f1d1d;">Copyright © ${new Date().getFullYear()} LightningPro. All rights reserved.</p>
      <p style="margin-top: 10px; font-size: 11px; color: #7f1d1d;">
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
