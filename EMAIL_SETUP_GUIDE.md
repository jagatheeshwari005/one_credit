# Email Setup Guide

## Overview
This application now includes email notifications for admin when bookings are made. Follow this guide to set up email functionality.

## Email Configuration

### 1. Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

### 2. Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_16_character_app_password
ADMIN_EMAIL=admin@yourdomain.com
```

### 3. Email Features

#### Admin Notifications
- **Trigger**: When a user books an event
- **Recipient**: Admin email (ADMIN_EMAIL)
- **Content**: Booking details, customer info, special requests

#### Customer Confirmations
- **Trigger**: When a user books an event
- **Recipient**: Customer email
- **Content**: Booking confirmation, event details

### 4. Email Templates

The system includes HTML email templates with:
- Professional styling
- Booking details
- Customer information
- Special requests (if any)
- Admin dashboard links

### 5. Production Email Services

For production, consider these alternatives to Gmail:

#### SendGrid
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
```

#### Mailgun
```env
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
```

#### AWS SES
```env
EMAIL_SERVICE=ses
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
```

### 6. Testing Email Setup

1. **Start the server**:
   ```bash
   npm run server
   ```

2. **Create a test booking** through the frontend

3. **Check logs** for email sending status:
   ```
   Booking notification email sent: <message-id>
   Booking confirmation email sent: <message-id>
   ```

### 7. Troubleshooting

#### Common Issues

**"Invalid login" error**:
- Check EMAIL_USER and EMAIL_PASS
- Ensure 2FA is enabled and app password is correct

**"Less secure app access" error**:
- Use App Passwords instead of regular password
- Enable 2-Factor Authentication

**Emails not sending**:
- Check server logs for error messages
- Verify email credentials
- Check spam folder

#### Debug Mode

Add to your `.env` file for detailed logging:
```env
EMAIL_DEBUG=true
```

### 8. Email Customization

To customize email templates, edit:
- `server/services/emailService.js`
- Modify the HTML templates in the functions

### 9. Security Notes

- Never commit `.env` file to version control
- Use environment-specific email accounts
- Consider rate limiting for production
- Implement email verification for user registration

## Quick Start

1. Add email variables to `.env`:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ADMIN_EMAIL=admin@yourdomain.com
   ```

2. Restart the server:
   ```bash
   npm run server
   ```

3. Test by creating a booking - you should receive emails!

## Support

If you encounter issues:
1. Check server logs for error messages
2. Verify email credentials
3. Test with a simple email first
4. Check firewall/network restrictions
