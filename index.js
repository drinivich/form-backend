function generateEmailTemplate(name, email, message) {
  return `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f5;padding:20px 0;">
      <tr>
        <td align="center">
          <table width="500" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background-color:#ff0000;padding:30px 20px;color:#ffffff;">
                <div style="margin-bottom:15px;">
                  <img src="https://raw.githubusercontent.com/drinivich/form-backend/main/fundo-escuro.png" alt="LightningPro Logo" width="64" height="64" style="border-radius:8px;background-color:#ffc107;padding:8px;display:block;">
                </div>
                <h1 style="margin:0;font-size:20px;font-family:Arial,sans-serif;">New Submission Received From<br>Lightning Website Contact Page</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;font-family:Arial,sans-serif;color:#333;font-size:14px;line-height:1.5;">
                
                <p style="margin:0 0 10px;">
                  <strong style="color:#7f1d1d;text-transform:uppercase;font-size:12px;">Email</strong><br>
                  <span style="font-weight:500;">${email}</span>
                </p>
                
                <p style="margin:0 0 10px;">
                  <strong style="color:#7f1d1d;text-transform:uppercase;font-size:12px;">Name</strong><br>
                  <span>${name}</span>
                </p>

                <p style="margin:0 0 10px;">
                  <strong style="color:#7f1d1d;text-transform:uppercase;font-size:12px;">Message</strong><br>
                  <div style="background-color:#faf8f8;border-left:4px solid #ffee00;padding:15px;border-radius:4px 0 0 4px;margin-top:5px;">
                    <span style="white-space:pre-wrap;">${message}</span>
                  </div>
                </p>

                <p style="font-size:11px;color:#7f1d1d;margin-top:20px;">
                  Received on ${new Date().toLocaleString()}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background-color:#fef2f2;padding:20px;border-top:1px solid #fecaca;">
                <p style="margin:0;font-size:12px;color:#7f1d1d;">© ${new Date().getFullYear()} LightningPro. All rights reserved.</p>
                <p style="margin:10px 0 0;font-size:11px;color:#7f1d1d;">Powered by <strong>LightningPro Contact System</strong></p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
