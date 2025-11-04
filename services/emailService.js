// const nodemailer = require('nodemailer');

// // Create reusable transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT),
//   secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false // For self-signed certificates
//   }
// });

// // Verify connection configuration
// transporter.verify(function (error, success) {
//   if (error) {
//     console.error('❌ SMTP Configuration Error:', error);
//   } else {
//     console.log('✅ Email service is ready');
//   }
// });

// // Send welcome email
// const sendWelcomeEmail = async (bookingData) => {
//   try {
//     const { company_name, contact_person, email, services, crm_booking_id } = bookingData;

//     const mailOptions = {
//       from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
//       to: email,
//       subject: `Welcome to Enigoal - Booking Confirmation (${crm_booking_id})`,
//       html: `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       line-height: 1.6;
//       color: #333;
//       max-width: 600px;
//       margin: 0 auto;
//       padding: 20px;
//     }
//     .header {
//       background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//       color: white;
//       padding: 30px;
//       text-align: center;
//       border-radius: 10px 10px 0 0;
//     }
//     .content {
//       background: #f9f9f9;
//       padding: 30px;
//       border-radius: 0 0 10px 10px;
//     }
//     .booking-details {
//       background: white;
//       padding: 20px;
//       border-radius: 8px;
//       margin: 20px 0;
//       border-left: 4px solid #667eea;
//     }
//     .detail-row {
//       padding: 8px 0;
//       border-bottom: 1px solid #eee;
//     }
//     .detail-label {
//       font-weight: bold;
//       color: #667eea;
//     }
//     .services {
//       background: #667eea;
//       color: white;
//       padding: 8px 12px;
//       border-radius: 5px;
//       display: inline-block;
//       margin: 5px 5px 5px 0;
//       font-size: 14px;
//     }
//     .footer {
//       text-align: center;
//       padding: 20px;
//       color: #666;
//       font-size: 12px;
//     }
//     .button {
//       display: inline-block;
//       padding: 12px 30px;
//       background: #667eea;
//       color: white;
//       text-decoration: none;
//       border-radius: 5px;
//       margin: 20px 0;
//     }
//   </style>
// </head>
// <body>
//   <div class="header">
//     <h1>🎉 Welcome to Enigoal!</h1>
//     <p>Your booking has been confirmed</p>
//   </div>
  
//   <div class="content">
//     <p>Dear <strong>${contact_person}</strong>,</p>
    
//     <p>Thank you for choosing Enigoal! We're excited to have <strong>${company_name}</strong> on board.</p>
    
//     <div class="booking-details">
//       <h3 style="color: #667eea; margin-top: 0;">📋 Booking Details</h3>
      
//       <div class="detail-row">
//         <span class="detail-label">Booking ID:</span> ${crm_booking_id}
//       </div>
      
//       <div class="detail-row">
//         <span class="detail-label">Company:</span> ${company_name}
//       </div>
      
//       <div class="detail-row">
//         <span class="detail-label">Contact Person:</span> ${contact_person}
//       </div>
      
//       <div class="detail-row">
//         <span class="detail-label">Email:</span> ${email}
//       </div>
      
//       <div class="detail-row">
//         <span class="detail-label">Services:</span><br/>
//         ${services && services.length > 0 
//           ? services.map(service => `<span class="services">${service}</span>`).join(' ')
//           : '<span class="services">No services listed</span>'
//         }
//       </div>
//     </div>
    
//     <h3 style="color: #667eea;">📝 What's Next?</h3>
//     <ul>
//       <li>Our team will review your requirements</li>
//       <li>You'll receive updates at each stage of the process</li>
//       <li>We'll keep you informed of any document requirements</li>
//       <li>Feel free to reach out if you have any questions</li>
//     </ul>
    
//     <p>We're committed to providing you with excellent service and support throughout your journey with us.</p>
    
//     <p style="margin-top: 30px;">
//       <strong>Need Help?</strong><br/>
//       Feel free to contact our support team support@enigoal.co.in.
//     </p>
    
//     <p>
//       Best regards,<br/>
//       <strong>Team Enigoal</strong>
//     </p>
//   </div>
  
//   <div class="footer">
//     <p>This is an automated message from Enigoal Booking Management System.</p>
//     <p>© ${new Date().getFullYear()} Enigoal. All rights reserved.</p>
//   </div>
// </body>
// </html>
//       `,
//       text: `
// Welcome to Enigoal!

// Dear ${contact_person},

// Thank you for choosing Enigoal! We're excited to have ${company_name} on board.

// Booking Details:
// - Booking ID: ${crm_booking_id}
// - Company: ${company_name}
// - Contact Person: ${contact_person}
// - Email: ${email}
// - Services: ${services && services.length > 0 ? services.join(', ') : 'No services listed'}

// What's Next?
// - Our team will review your requirements
// - You'll receive updates at each stage of the process
// - We'll keep you informed of any document requirements

// Best regards,
// Team Enigoal

// ---
// This is an automated message from Enigoal .
//       `
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log('✅ Welcome email sent:', info.messageId);
    
//     return {
//       success: true,
//       messageId: info.messageId,
//       sentTo: email
//     };

//   } catch (error) {
//     console.error('❌ Email sending failed:', error);
//     throw error;
//   }
// };

// // Test email connection
// const testEmailConnection = async () => {
//   try {
//     await transporter.verify();
//     return { success: true, message: 'Email service is working' };
//   } catch (error) {
//     return { success: false, message: error.message };
//   }
// };

// module.exports = {
//   sendWelcomeEmail,
//   testEmailConnection
// };













const nodemailer = require('nodemailer');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ SMTP Configuration Error:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});

// Send Welcome Email (Simplified & Personalized)
const sendWelcomeEmail = async (bookingData) => {
  try {
    const { company_name, contact_person, email } = bookingData;

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: `Warm Welcome to ${company_name} from Enigoal Startup Advisory Private Limited`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 650px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9ff;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 25px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #fff;
      padding: 30px;
      border-radius: 0 0 10px 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .footer {
      text-align: center;
      margin-top: 25px;
      color: #777;
      font-size: 13px;
    }
    a {
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🤝 Welcome to Enigoal!</h1>
    <p>We’re thrilled to have ${company_name} onboard</p>
  </div>

  <div class="content">
    <p>Dear <strong>${contact_person }</strong>,</p>

    <p>
      We are pleased to extend a warm welcome to <b>${company_name}</b> as a valued client of 
      <b>Enigoal Startup Advisory Private Limited</b>. We sincerely appreciate the trust you’ve placed in us and are 
      excited about the opportunity to collaborate and contribute to your success.
    </p>

    <p>
      At <b>Enigoal Startup Advisory Private Limited</b>, we are dedicated to offering high-quality, tailored services 
      designed to meet your unique business needs. Our experienced team is committed to providing 
      expert support and guidance at every stage to ensure a smooth and successful experience.
    </p>

    <p>
      One of our dedicated representatives will be in touch shortly 
      to coordinate with you and gather any necessary information. Please don’t hesitate to reach out 
      with any questions or special requests your satisfaction is our top priority.
    </p>

    <p>
      Thank you once again for choosing <b>Enigoal Startup Advisory Private Limited</b>. We look forward to a long and 
      successful partnership with <b>${company_name}</b>.
    </p>

    <p>
      For any queries, kindly contact us at 
      <a href="mailto:support@enigoal.co.in">support@enigoal.co.in</a>.
    </p>

    <p style="color:#666; font-size:13px; margin-top:25px;">
      <i>This is a system-generated email. Please do not reply to this email.</i>
    </p>

    <p>Warm regards,</p>
    <p><b>Team Enigoal</b></p>
    <p><a href="https://enigoal.co.in">enigoal.co.in</a></p>
  </div>

  <div class="footer">
    <p>© ${new Date().getFullYear()} Enigoal Startup Advisory Private Limited. All rights reserved.</p>
  </div>
</body>
</html>
      `,
      text: `
Dear ${contact_person},

We are pleased to extend a warm welcome to ${company_name} as a valued client of Enigoal Startup Advisory Private Limited. 
We truly appreciate your trust and look forward to supporting your success.

Our team will be in touch shortly to coordinate the next steps. For any assistance, feel free to reach out at support@enigoal.co.in.

Warm regards,
Team Enigoal
enigoal.co.in

---
This is a system-generated email. Please do not reply.
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      sentTo: email
    };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

const testEmailConnection = async () => {
  try {
    await transporter.verify();
    return { success: true, message: 'Email service is working' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  testEmailConnection
};
