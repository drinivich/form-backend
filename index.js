function generateEmailTemplate(name, email, message) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Submission</title>
  <style>
    body {
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 40px 0;
      color: #1f2937;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 0 0 1px #e5e7eb;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo img {
      width: 40px;
      height: 40px;
    }
    .title {
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 30px;
      color: #111827;
    }
    .field {
      margin-bottom: 20px;
    }
    .field label {
      font-size: 12px;
      text-transform: uppercase;
      color: #6b7280;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 4px;
    }
    .field-value {
      font-size: 16px;
      color: #111827;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://raw.githubusercontent.com/drinivich/form-backend/main/fundo-escuro-com-cor.png" alt="LightningPro Logo">
    </div>
    <div class="title">
      New Submission Received From<br>LightningProContactPage
    </div>
    <div class="field">
      <label>Email</label>
      <div class="field-value">${email}</div>
    </div>
    <div class="field">
      <label>Name</label>
      <div class="field-value">${name}</div>
    </div>
    <div class="field">
      <label>Message</label>
      <div class="field-value">${message}</div>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} LightningPro. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
}
