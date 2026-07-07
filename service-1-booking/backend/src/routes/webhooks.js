const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const { createCalendarEvent } = require('../services/calendar.service');
const { sendConfirmationEmail } = require('../services/email.service');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

// POST /api/webhooks/stripe
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;

    try {
      // Update payment status to 'paid'
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: { paymentStatus: 'paid' },
      });

      // Create Google Calendar event (non-critical — failure won't fail webhook)
      let calendarEventId = null;
      try {
        const calendarEvent = await createCalendarEvent(booking);
        calendarEventId = calendarEvent.id;
        await prisma.booking.update({
          where: { id: bookingId },
          data: { calendarEventId },
        });
        console.log('Calendar event created:', calendarEventId);
      } catch (calErr) {
        console.error('Calendar event creation failed (non-critical):', calErr.message);
      }

      // Send confirmation email (non-critical)
      try {
        await sendConfirmationEmail(booking);
        console.log('Confirmation email sent to:', booking.email);
      } catch (emailErr) {
        console.error('Email sending failed (non-critical):', emailErr.message);
      }
    } catch (err) {
      console.error('Error processing webhook:', err);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  }

  res.json({ received: true });
});

module.exports = router;
