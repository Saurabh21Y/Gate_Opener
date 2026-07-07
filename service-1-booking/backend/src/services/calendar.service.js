const { google } = require('googleapis');

/**
 * Creates a Google Calendar event for the booking.
 * Uses Service Account (JWT) authentication — no OAuth user interaction required.
 * @param {Object} booking - Prisma booking record
 * @returns {Promise<Object>} Created calendar event data
 */
async function createCalendarEvent(booking) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const calendar = google.calendar({ version: 'v3', auth });

  const startTime = new Date(booking.meetingDate);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour

  const event = {
    summary: `Consulting Session — ${booking.name}`,
    description: [
      `Booking ID: ${booking.id}`,
      '',
      `Agenda: ${booking.agenda}`,
      '',
      'Client Contact:',
      `Phone: ${booking.phone}`,
      `Email: ${booking.email}`,
    ].join('\n'),
    start: { dateTime: startTime.toISOString(), timeZone: 'UTC' },
    end: { dateTime: endTime.toISOString(), timeZone: 'UTC' },
    attendees: [{ email: booking.email, displayName: booking.name }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 24-hour email reminder
        { method: 'popup', minutes: 30 },       // 30-minute popup reminder
      ],
    },
  };

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
    resource: event,
    sendUpdates: 'all', // sends calendar invites to all attendees
  });

  return response.data;
}

module.exports = { createCalendarEvent };
