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
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'lightningproteam@gmail.com',
    subject: 'New Contact Form Submission',
    text: `You received a message:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent!');
    res.redirect(302, 'https://drinivich.github.io/LightningProWebsite/thankyou.html');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Something went wrong.');
  }
});

app.get('/', (req, res) => {
  res.send('Form backend is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
