# Service 3 — AI Resume Builder

**Venture Builders Pvt Ltd · Microservices Assessment**

An AI-powered resume builder that guides users through a 4-step form, uses **GPT-4o** to generate ATS-optimized content, renders it into beautiful HTML templates, and provides a **Tiptap** rich-text editor for refinement.

---

## Architecture

```
service-3-resume-builder/
├── backend/          Node.js + Express + Prisma + OpenAI
└── frontend/         Next.js 14 + TypeScript + Tailwind + Tiptap
```

**Flow**: Form → POST /api/resumes/generate → GPT-4o → HTML template → iframe preview → Tiptap edit → Save

---

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # Fill in DATABASE_URL and OPENAI_API_KEY
npx prisma migrate dev --name init
npm run dev                 # Starts on http://localhost:4003
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local  # NEXT_PUBLIC_API_URL=http://localhost:4003
npm run dev                 # Starts on http://localhost:3003
```

---

## Features

| Feature | Description |
|---|---|
| 4-Step Form | Personal Info → Experience → Education → Skills & Template |
| AI Generation | GPT-4o creates bullet points, summary, and skill categories |
| 3 Templates | Modern (two-column), Classic (serif), Minimal (whitespace) |
| Template Switching | Live re-render without re-entering data |
| Tiptap Editor | Rich-text editing with full toolbar |
| Preview Mode | iframe-rendered HTML preview |
| Persistence | PostgreSQL via Prisma |
| Resume Library | `/resumes` page with all past resumes |

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/resumes/generate` | Generate resume from form data |
| GET | `/api/resumes` | List all resumes |
| GET | `/api/resumes/:id` | Get single resume |
| PUT | `/api/resumes/:id` | Save edited HTML |
| DELETE | `/api/resumes/:id` | Delete resume |
| POST | `/api/resumes/:id/change-template` | Switch template |

---

## Tech Stack

- **Frontend**: Next.js 14 (App Router) · TypeScript · Tailwind CSS · Tiptap v2 · Axios
- **Backend**: Express.js · Prisma · PostgreSQL · OpenAI Node SDK
- **AI**: GPT-4o with JSON mode for structured output

---

## Environment Variables

### Backend (`.env`)
| Variable | Description |
|---|---|
| `PORT` | `4003` |
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENAI_MODEL` | `gpt-4o` |
| `FRONTEND_URL` | `http://localhost:3003` |

### Frontend (`.env.local`)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4003` |
