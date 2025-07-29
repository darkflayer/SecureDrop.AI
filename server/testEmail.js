require('dotenv').config();
const { sendPasswordResetEmail, testEmailConfig } = require('./utils/emailService');

async function testEmailSetup() {
  console.log('🧪 Testing Email Configuration...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configured***' : 'NOT SET');
  
  // Test email configuration
  console.log('\n1. Testing email transporter configuration...');
  const configValid = await testEmailConfig();
  
  if (!configValid) {
    console.log('❌ Email configuration failed. Please check:');
    console.log('   - Gmail 2-factor authentication is enabled');
    console.log('   - App password is generated and correct');
    console.log('   - EMAIL_USER and EMAIL_PASS are set in .env');
    return;
  }
  
  console.log('✅ Email configuration is valid!');
  
  // Test sending actual email
  console.log('\n2. Testing password reset email...');
  const testToken = 'test-token-123';
  const result = await sendPasswordResetEmail(process.env.EMAIL_USER, testToken, 'Test Admin');
  
  if (result.success) {
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Check your inbox:', process.env.EMAIL_USER);
  } else {
    console.log('❌ Failed to send test email:');
    console.log('Error:', result.error);
    
    // Common troubleshooting tips
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure 2-factor authentication is enabled on your Gmail account');
    console.log('2. Generate a new App Password from Google Account settings');
    console.log('3. Use the 16-character app password (no spaces) in EMAIL_PASS');
    console.log('4. Check if "Less secure app access" is disabled (it should be)');
  }
}

// Run the test
testEmailSetup().catch(console.error);
