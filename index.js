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

app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'lightningproteam@gmail.com',
    subject: 'New Submission Received From Lightning Pro Contact Page',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #ff0000; padding: 20px;">
        <h2 style="color: #0a47d1; text-align: center;">New Submission Received From<br><strong>LightningProContactPage</strong></h2>
        <div style="margin-top: 30px; font-size: 16px;">
          <p><strong>email</strong><br><a href="mailto:${email}">${email}</a></p>
          <p><strong>name</strong><br>${name}</p>
          <p><strong>message</strong><br>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <hr style="margin-top: 30px;"/>
        <p style="font-size: 12px; color: #999; text-align: center;">Powered by Lightning Pro Contact Form</p>
      </div>
    `
  };
