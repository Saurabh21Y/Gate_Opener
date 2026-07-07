require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bookingsRouter = require('./routes/bookings');
const webhooksRouter = require('./routes/webhooks');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3001' }));

// Stripe webhooks need raw body - mount BEFORE express.json()
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// JSON parser for all other routes
app.use(express.json());

// Health check
app.get('/health', (req, res) =>
  res.json({ status: 'ok', service: 'booking-backend', timestamp: new Date().toISOString() })
);

// Routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/webhooks', webhooksRouter);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Booking backend running on port ${PORT}`));
