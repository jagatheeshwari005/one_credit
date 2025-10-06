const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  // If SMTP credentials are not provided, fall back to a harmless JSON transport
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email credentials (EMAIL_USER/EMAIL_PASS) missing. Emails will not be sent; using jsonTransport for development.');
    return nodemailer.createTransport({ jsonTransport: true });
  }

  // Use explicit SMTP configuration if provided (works for Gmail, SendGrid, etc.)
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true; // true for 465, false for other ports

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Use App Password for Gmail or a dedicated SMTP password
    }
  });
};

// Send booking notification to admin
const sendBookingNotification = async (bookingData) => {
  try {
    const transporter = createTransporter();
    
    const { user, event, attendees, totalAmount, bookingId } = bookingData;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Event Booking - ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">New Event Booking Notification</h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
            <p><strong>Booking ID:</strong> #${bookingId.slice(-8)}</p>
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Attendees:</strong> ${attendees}</p>
            <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${bookingData.contactInfo?.phone || 'Not provided'}</p>
          </div>
          
          ${bookingData.specialRequests ? `
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Special Requests</h3>
            <p>${bookingData.specialRequests}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #065f46; margin-top: 0;">Next Steps</h3>
            <p>Please review this booking in your admin dashboard and contact the customer if needed.</p>
            <p><a href="${process.env.CLIENT_URL}/admin" style="color: #4f46e5; text-decoration: none;">View Admin Dashboard</a></p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated notification from your Event Management System.
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Booking notification email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending booking notification email:', error);
    throw error;
  }
};

// Send booking confirmation to customer
const sendBookingConfirmation = async (bookingData) => {
  try {
    const transporter = createTransporter();
    
    const { user, event, attendees, totalAmount, bookingId } = bookingData;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: user.email,
      subject: `Booking Confirmation - ${event.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Booking Confirmation</h2>
          
          <p>Dear ${user.name},</p>
          <p>Thank you for booking with us! Your event booking has been confirmed.</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin-top: 0;">Booking Details</h3>
            <p><strong>Booking ID:</strong> #${bookingId.slice(-8)}</p>
            <p><strong>Event:</strong> ${event.title}</p>
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Attendees:</strong> ${attendees}</p>
            <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
          </div>
          
          <div style="background-color: #d1fae5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #065f46; margin-top: 0;">What's Next?</h3>
            <p>We'll send you a reminder closer to the event date. If you have any questions, please don't hesitate to contact us.</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Thank you for choosing our event management platform!
          </p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendBookingNotification,
  sendBookingConfirmation
};

