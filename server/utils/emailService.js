const nodemailer = require('nodemailer');

// Create transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // Your Gmail app password
    }
  });
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, adminName) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: 'SecureDrop.AI',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Password Reset Request - SecureDrop.AI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
            .footer { background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
            .btn { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .btn:hover { background-color: #0056b3; }
            .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #333;">
                <span style="background-color: #000; color: white; padding: 8px 12px; border-radius: 4px; margin-right: 10px;">S</span>
                SecureDrop.AI
              </h1>
            </div>
            
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>Hello ${adminName || 'Admin'},</p>
              
              <p>We received a request to reset your password for your SecureDrop.AI admin account. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="btn">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>Important:</strong>
                <ul>
                  <li>This link will expire in 1 hour for security reasons</li>
                  <li>If you didn't request this password reset, please ignore this email</li>
                  <li>Your password will remain unchanged until you create a new one</li>
                </ul>
              </div>
              
              <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
              
              <p>Best regards,<br>The SecureDrop.AI Team</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message from SecureDrop.AI. Please do not reply to this email.</p>
              <p>If you need help, please contact your system administrator.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error: error.message };
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('Email configuration is valid');
    return true;
  } catch (error) {
    console.error('Email configuration error:', error);
    return false;
  }
};

// Send OTP email for registration
const sendOtpEmail = async (email, otp, adminName) => {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: {
        name: 'SecureDrop.AI',
        address: process.env.EMAIL_USER
      },
      to: email,
      subject: 'Your SecureDrop.AI Registration OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:0 auto; padding: 20px;">
          <h2 style="color: #333;">SecureDrop.AI Registration</h2>
          <p>Hello ${adminName || 'Admin'},</p>
          <p>Your OTP for SecureDrop.AI registration is:</p>
          <div style="font-size: 2em; font-weight: bold; color: #007bff; margin: 20px 0;">${otp}</div>
          <p>This OTP is valid for a few minutes. Please enter it to complete your registration.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p style="margin-top: 30px; color: #888; font-size: 12px;">- The SecureDrop.AI Team</p>
        </div>
      `
    };
    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendPasswordResetEmail,
  testEmailConfig,
  sendOtpEmail
};
