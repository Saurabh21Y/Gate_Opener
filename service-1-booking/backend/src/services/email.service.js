const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a booking confirmation email to the client.
 * @param {Object} booking - Prisma booking record
 */
async function sendConfirmationEmail(booking) {
  const meetingDate = new Date(booking.meetingDate).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f4f4f8; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #6366f1, #3b82f6); padding: 40px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Booking Confirmed! 🎉</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 10px 0 0;">Your consulting session has been scheduled.</p>
      </div>

      <!-- Body -->
      <div style="padding: 40px;">
        <p style="color: #374151; font-size: 16px;">Hi <strong>${booking.name}</strong>,</p>
        <p style="color: #6b7280;">Thank you for booking a consulting session with Venture Builders. Here are your booking details:</p>

        <!-- Details Card -->
        <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <div style="margin-bottom: 16px;">
            <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Meeting Date &amp; Time</span><br>
            <strong style="color: #111827; font-size: 16px;">${meetingDate} (UTC)</strong>
          </div>
          <div style="margin-bottom: 16px;">
            <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Meeting Agenda</span><br>
            <strong style="color: #111827;">${booking.agenda}</strong>
          </div>
          <div style="margin-bottom: 0;">
            <span style="color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Booking Reference</span><br>
            <strong style="color: #111827; font-family: monospace; font-size: 13px;">${booking.id}</strong>
          </div>
        </div>

        <p style="color: #6b7280; font-size: 14px;">A calendar invite has been sent to your email. If you need to reschedule, please contact us at least 24 hours in advance.</p>

        <div style="text-align: center; margin-top: 32px;">
          <a href="mailto:support@venturebuilders.com"
             style="background: linear-gradient(135deg, #6366f1, #3b82f6); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
            Contact Support
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 24px; text-align: center;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Venture Builders Pvt Ltd &bull; Built with ❤️
        </p>
      </div>
    </div>
  </body>
  </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Venture Builders <noreply@venturebuilders.com>',
    to: booking.email,
    subject: `Booking Confirmed — Your Consulting Session with Venture Builders`,
    html: htmlContent,
  });
}

module.exports = { sendConfirmationEmail };
