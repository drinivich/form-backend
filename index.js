const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// (Optional) Trust proxy headers if deployed on Render or similar
app.set('trust proxy', 1);

// Allow only your GitHub Pages frontend
app.use(cors({
  origin: 'https://drinivich.github.io',
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Gmail address (from .env)
    pass: process.env.EMAIL_PASS  // Gmail App Password (not normal password)
  }
});

// Generates the HTML content for the email
function generateEmailTemplate(name, email, message) {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); padding: 30px;">
        <h2 style="color: #8B0000;">New Message from Lightning Pro Contact Form</h2>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>👤 Name:</strong> ${name}</p>
        <p><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #8B0000;">${email}</a></p>
        <p><strong>📝 Message:</strong></p>
        <div style="background-color: #fff5f5; padding: 15px; border-radius: 8px; border-left: 4px solid #B22222; white-space: pre-wrap;">
          ${message}
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 0.9em; color: #888;">Sent automatically from the <strong style="color:#B22222;">Lightning Pro</strong> website 🚀</p>
      </div>
    </div>
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

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
