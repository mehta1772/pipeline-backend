const Booking = require('../models/Booking');
const { sendWelcomeEmail, testEmailConnection } = require('../services/emailService');

// Send welcome email
const sendWelcome = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // ⭐ Check if email already sent
    if (booking.welcome_email_sent) {
      return res.status(400).json({ 
        message: 'Welcome email has already been sent to this customer',
        sentAt: booking.welcome_email_sent_at,
        sentBy: booking.welcome_email_sent_by
      });
    }

    // Validate email exists
    if (!booking.email || booking.email.trim() === '') {
      return res.status(400).json({ 
        message: 'No email address found for this booking' 
      });
    }

    console.log(`📧 Sending welcome email to: ${booking.email}`);

    // Send email
    const result = await sendWelcomeEmail({
      company_name: booking.company_name,
      contact_person: booking.contact_person,
      email: booking.email,
      services: booking.services,
      crm_booking_id: booking.crm_booking_id
    });

    // ⭐ Mark as sent
    booking.welcome_email_sent = true;
    booking.welcome_email_sent_at = new Date();
    booking.welcome_email_sent_by = req.session.username;

    // Log action
    booking.auditLogs.push({
      action: 'WELCOME_EMAIL_SENT',
      user: req.session.username,
      timestamp: new Date(),
      meta: {
        email: booking.email,
        messageId: result.messageId
      }
    });

    await booking.save();

    res.json({
      message: 'Welcome email sent successfully',
      sentTo: booking.email,
      sentAt: booking.welcome_email_sent_at,
      booking
    });

  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    res.status(500).json({ 
      message: 'Failed to send welcome email', 
      error: error.message 
    });
  }
};

// Test email configuration
const testEmail = async (req, res) => {
  try {
    const result = await testEmailConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  sendWelcome,
  testEmail
};