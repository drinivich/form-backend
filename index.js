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
