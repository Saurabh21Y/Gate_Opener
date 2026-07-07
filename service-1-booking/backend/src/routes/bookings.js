const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { createCheckoutSession } = require('../services/stripe.service');

const prisma = new PrismaClient();

// POST /api/bookings - Create booking and Stripe session
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, agenda, meetingDate } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !agenda || !meetingDate) {
      return res.status(400).json({
        error: 'All fields are required: name, email, phone, agenda, meetingDate',
      });
    }

    // Create a temporary booking record
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        agenda,
        meetingDate: new Date(meetingDate),
        stripeSessionId: `pending_${Date.now()}`, // temporary placeholder
        paymentStatus: 'pending',
      },
    });

    // Create Stripe Checkout session
    const session = await createCheckoutSession({ bookingId: booking.id, name, email });

    // Update booking with real Stripe session ID
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    });

    res.json({ url: session.url, bookingId: booking.id });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings - List all bookings
router.get('/', async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings/:id - Get single booking by ID
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
