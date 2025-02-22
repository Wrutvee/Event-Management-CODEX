const SibApiV3Sdk = require("sib-api-v3-sdk");

const sendPasswordResetMail = async (toEmail, otp) => {
  try {
    // Configure API key authorization
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.EMAIL_API_KEY;

    // Create TransactionalEmailsApi instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // Create SendSmtpEmail object
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Password Reset OTP";
    sendSmtpEmail.htmlContent = `
      <html>
        <body>
          <h1>Password Reset Request</h1>
          <p>Your OTP for password reset is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 5 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
        </body>
      </html>
    `;
    sendSmtpEmail.sender = { email: process.env.EMAIL, name: "Event Management" };
    sendSmtpEmail.to = [{ email: toEmail }];

    // Send email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  sendPasswordResetMail
};