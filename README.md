# Venture Builders — Microservices Assessment

A suite of **3 independent microservices** built with Next.js 14, Express.js, PostgreSQL, and AI integrations.

---

## 🏗️ Architecture Overview

```
venture-builders/
├── service-1-booking/          # Consulting Service Booking
│   ├── backend/                # Express.js + Prisma (Port 4001)
│   └── frontend/               # Next.js 14 (Port 3001)
├── service-2-ai-assistant/     # AI Query Assistant
│   ├── backend/                # Express.js + Prisma + OpenAI SSE (Port 4002)
│   └── frontend/               # Next.js 14 (Port 3002)
└── service-3-resume-builder/   # Resume Builder
    ├── backend/                # Express.js + Prisma + OpenAI (Port 4003)
    └── frontend/               # Next.js 14 + Tiptap (Port 3003)
```

| Service | Frontend Port | Backend Port |
|---------|:---:|:---:|
| Service 1 — Consulting Booking | 3001 | 4001 |
| Service 2 — AI Chat Assistant | 3002 | 4002 |
| Service 3 — Resume Builder | 3003 | 4003 |

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| AI | OpenAI GPT-4o |
| Payments | Stripe |
| Calendar | Google Calendar API v3 |
| Email | Nodemailer (Gmail SMTP) |
| Editor | Tiptap v2 |
| Streaming | Server-Sent Events (SSE) |

---

## 🚀 Prerequisites

- **Node.js** >= 18.x
- **PostgreSQL** >= 14 (running locally or via Docker)
- **npm** >= 9.x

---

## ⚙️ Setup — All Services

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd venture-builders
```

### 2. Create PostgreSQL databases
```sql
CREATE DATABASE booking_db;
CREATE DATABASE ai_assistant_db;
CREATE DATABASE resume_builder_db;
```

### 3. Set up each service

For each service (`service-1-booking`, `service-2-ai-assistant`, `service-3-resume-builder`):

```bash
# Backend setup
cd service-X-name/backend
npm install
cp .env.example .env
# Fill in your .env values (see env guide below)
npx prisma migrate dev --name init
npm run dev

# Frontend setup (new terminal)
cd service-X-name/frontend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev
```

---

## 🔑 Environment Variables Summary

### Service 1 — Booking Backend (`service-1-booking/backend/.env`)
```env
PORT=4001
DATABASE_URL=postgresql://postgres:password@localhost:5432/booking_db
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
GOOGLE_CLIENT_EMAIL=service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
GOOGLE_CALENDAR_ID=primary
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=http://localhost:3001
```

### Service 1 — Booking Frontend (`service-1-booking/frontend/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4001
```

### Service 2 — AI Assistant Backend (`service-2-ai-assistant/backend/.env`)
```env
PORT=4002
DATABASE_URL=postgresql://postgres:password@localhost:5432/ai_assistant_db
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
FRONTEND_URL=http://localhost:3002
```

### Service 2 — AI Assistant Frontend (`service-2-ai-assistant/frontend/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4002
```

### Service 3 — Resume Builder Backend (`service-3-resume-builder/backend/.env`)
```env
PORT=4003
DATABASE_URL=postgresql://postgres:password@localhost:5432/resume_builder_db
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
FRONTEND_URL=http://localhost:3003
```

### Service 3 — Resume Builder Frontend (`service-3-resume-builder/frontend/.env`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4003
```

---

## 🌐 Service Details

### Service 1 — Consulting Service Booking
**Flow**: User → Booking Form → Stripe Checkout → Webhook → DB Save → Google Calendar Event → Confirmation Email

**Key Features**:
- Beautiful booking form (Name, Email, Phone, Agenda, Date/Time)
- Stripe Checkout integration ($99 consulting session)
- Google Calendar event created automatically
- HTML confirmation email via Nodemailer
- PostgreSQL booking records via Prisma

**API Endpoints**:
| Method | Path | Description |
|---|---|---|
| GET | /health | Health check |
| POST | /api/bookings | Create booking + Stripe session |
| GET | /api/bookings | List all bookings |
| GET | /api/bookings/:id | Get booking by ID |
| POST | /api/webhooks/stripe | Stripe webhook handler |

---

### Service 2 — AI Query Assistant
**Flow**: User → Chat Session → Enter Query → SSE Streaming Response → DB Persist

**Key Features**:
- ChatGPT-like chat interface
- Multiple independent chat sessions with sidebar
- Real-time token streaming via Server-Sent Events
- Persistent message history per session
- Auto-generated session titles from first message

**API Endpoints**:
| Method | Path | Description |
|---|---|---|
| GET | /health | Health check |
| GET | /api/sessions | List all sessions |
| POST | /api/sessions | Create new session |
| GET | /api/sessions/:id | Get session with messages |
| PUT | /api/sessions/:id | Update session title |
| DELETE | /api/sessions/:id | Delete session |
| POST | /api/sessions/:id/messages | Send message (SSE stream) |

---

### Service 3 — Resume Builder
**Flow**: User Form → LLM Processing → HTML Generation → Tiptap Editor → Template Switching

**Key Features**:
- 4-step resume form (Personal Info, Experience, Education, Skills)
- OpenAI GPT-4o generates ATS-optimized content
- 3 HTML resume templates: Modern, Classic, Minimal
- Tiptap rich text editor with formatting toolbar
- Template switching without losing edits
- Print/PDF export via browser print dialog

**API Endpoints**:
| Method | Path | Description |
|---|---|---|
| GET | /health | Health check |
| POST | /api/resumes/generate | Generate resume from form data |
| GET | /api/resumes | List all resumes |
| GET | /api/resumes/:id | Get resume by ID |
| PUT | /api/resumes/:id | Update resume content |
| DELETE | /api/resumes/:id | Delete resume |
| POST | /api/resumes/:id/change-template | Switch template |

---

## 🐳 Quick Start with Docker (Optional)

To spin up PostgreSQL quickly:
```bash
docker run --name venture-pg \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -d postgres:16
```

Then create the three databases:
```bash
docker exec -it venture-pg psql -U postgres -c "CREATE DATABASE booking_db;"
docker exec -it venture-pg psql -U postgres -c "CREATE DATABASE ai_assistant_db;"
docker exec -it venture-pg psql -U postgres -c "CREATE DATABASE resume_builder_db;"
```

---

## 📋 Development Notes

- Each service is **fully independent** — no shared code or databases
- All services follow: `Express Route → Service Layer → Prisma ORM → PostgreSQL`
- Stripe webhooks require a local tunnel (e.g., Stripe CLI or ngrok) in development
- SSE streaming in Service 2 requires the CORS `Access-Control-Allow-Origin` header to match your frontend URL

---

## 🏢 Built For

**Venture Builders Pvt Ltd** — Technical Assessment
