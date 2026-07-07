const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Creates a Stripe Checkout session for a consulting booking.
 * @param {Object} params
 * @param {string} params.bookingId - Internal booking ID (stored in session metadata)
 * @param {string} params.name - Customer name
 * @param {string} params.email - Customer email (pre-fills Stripe checkout)
 * @returns {Promise<Stripe.Checkout.Session>}
 */
async function createCheckoutSession({ bookingId, name, email }) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: 9900, // $99.00 in cents
          product_data: {
            name: 'Consulting Session',
            description: `1-hour consulting session for ${name}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId },
    success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/cancel`,
  });

  return session;
}

module.exports = { createCheckoutSession };
