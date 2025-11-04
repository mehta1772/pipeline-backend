require('dotenv').config();
const { testEmailConnection, sendWelcomeEmail } = require('./services/emailService');

async function test() {
  console.log('🧪 Testing email configuration...\n');

  // Test connection
  console.log('1. Testing SMTP connection...');
  const connectionTest = await testEmailConnection();
  console.log(connectionTest);

  if (!connectionTest.success) {
    console.error('❌ Email configuration failed!');
    console.error('Check your SMTP settings in .env');
    return;
  }

  // Test sending email
  console.log('\n2. Sending test email...');
  try {
    const result = await sendWelcomeEmail({
      company_name: 'Test Company Pvt Ltd',
      contact_person: 'John Doe',
      email: 'purshottamkumar177@gmail.com', // ← Change to your email
      services: ['Test Service 1', 'Test Service 2'],
      crm_booking_id: 'TEST-123'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('\nCheck your inbox:', 'purshottamkumar177@gmail.com');
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
  }
}

test();