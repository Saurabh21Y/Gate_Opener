# Booking Backend — Service 1

A Node.js/Express microservice for **Consulting Session Booking** with Stripe payments, Google Calendar integration, and email confirmations.

---

## Overview

This service handles the full booking lifecycle:
1. Client submits a booking form (frontend)
2. Backend creates a Stripe Checkout session
3. Client completes payment via Stripe
4. Stripe sends a `checkout.session.completed` webhook
5. Backend marks the booking as **paid**, creates a Google Calendar event, and sends a confirmation email

---

## Prerequisites

- **Node.js** v18+
- **PostgreSQL** running locally or remotely
- **Stripe** account (test or live keys)
- **Google Cloud** service account with Calendar API enabled
- **Gmail** account with an App Password (2FA must be enabled)

---

## Setup

```bash
# 1. Clone and navigate to backend
cd service-1-booking/backend

# 2. Install dependencies
npm install

# 3. Copy environment file and fill in values
cp .env.example .env

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Generate Prisma client
npx prisma generate

# 6. Start development server
npm run dev
```

The server starts on **http://localhost:4001**

---

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port (default: `4001`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `STRIPE_PRICE_ID` | Optional — not used in dynamic pricing mode |
| `GOOGLE_CLIENT_EMAIL` | Service account email (`...@....iam.gserviceaccount.com`) |
| `GOOGLE_PRIVATE_KEY` | Service account private key (PEM format, `\n` escaped) |
| `GOOGLE_CALENDAR_ID` | Target calendar ID (`primary` or specific calendar ID) |
| `EMAIL_USER` | Gmail address for sending confirmation emails |
| `EMAIL_PASS` | Gmail App Password (16-character, not account password) |
| `EMAIL_FROM` | Sender display name + address |
| `FRONTEND_URL` | Frontend origin URL for CORS and Stripe redirect |

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check — returns service status |
| `POST` | `/api/bookings` | Create booking + Stripe session; returns `{ url, bookingId }` |
| `GET` | `/api/bookings` | List all bookings (newest first) |
| `GET` | `/api/bookings/:id` | Get a single booking by ID |
| `POST` | `/api/webhooks/stripe` | Stripe webhook receiver (raw body, signature verified) |

---

## How to Obtain Credentials

### Stripe
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys
2. Copy **Secret key** (`sk_test_...`) → `STRIPE_SECRET_KEY`
3. Go to Developers → Webhooks → Add endpoint
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Event: `checkout.session.completed`
4. Copy **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`
5. For local testing: `stripe listen --forward-to localhost:4001/api/webhooks/stripe`

### Google Calendar (Service Account)
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → Enable **Google Calendar API**
3. IAM & Admin → Service Accounts → Create Service Account
4. Create a JSON key → download the file
5. Copy `client_email` → `GOOGLE_CLIENT_EMAIL`
6. Copy `private_key` (the full PEM string) → `GOOGLE_PRIVATE_KEY`
7. Share your Google Calendar with the service account email (with "Make changes to events" permission)

### Gmail App Password
1. Go to your Google Account → Security → 2-Step Verification (must be ON)
2. App passwords → Select "Mail" and "Windows Computer" → Generate
3. Copy the 16-character password → `EMAIL_PASS`

---

## Database Schema

```
Booking {
  id              String   (cuid, primary key)
  name            String
  email           String
  phone           String
  agenda          String
  meetingDate     DateTime
  stripeSessionId String   (unique)
  paymentStatus   String   (pending | paid)
  calendarEventId String?  (nullable)
  createdAt       DateTime
  updatedAt       DateTime
}
```
