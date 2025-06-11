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
    subject: 'New Contact Form Submission',
    text: `You received a message:\n\nName: ${name}\nEmail: ${email}\nMessage:\
