# AI Query Assistant — Backend

## Overview
The AI Query Assistant backend is a Node.js + Express microservice that powers a ChatGPT-like chat interface. It provides multi-session management, real-time GPT-4o streaming via Server-Sent Events (SSE), and persistent message history stored in PostgreSQL via Prisma ORM.

---

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Run Database Migrations
```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client
```bash
npm run prisma:generate
```

### 5. Start the Development Server
```bash
npm run dev
```

The server starts on **http://localhost:4002**

---

## Environment Variables

| Variable         | Description                              | Example                                              |
|-----------------|------------------------------------------|------------------------------------------------------|
| `PORT`           | Port the server listens on               | `4002`                                               |
| `DATABASE_URL`   | PostgreSQL connection string             | `postgresql://user:pass@localhost:5432/ai_assistant_db` |
| `OPENAI_API_KEY` | Your OpenAI API key                      | `sk-...`                                             |
| `OPENAI_MODEL`   | OpenAI model to use                      | `gpt-4o`                                             |
| `FRONTEND_URL`   | Allowed CORS origin                      | `http://localhost:3002`                              |

---

## API Endpoints

### Health
| Method | Path      | Description        |
|--------|-----------|--------------------|
| GET    | `/health` | Health check       |

### Sessions
| Method | Path                  | Description                        |
|--------|-----------------------|------------------------------------|
| GET    | `/api/sessions`       | List all chat sessions             |
| POST   | `/api/sessions`       | Create a new session               |
| GET    | `/api/sessions/:id`   | Get session with all messages      |
| PUT    | `/api/sessions/:id`   | Update session title               |
| DELETE | `/api/sessions/:id`   | Delete session (cascades messages) |

### Messages
| Method | Path                                  | Description                                    |
|--------|---------------------------------------|------------------------------------------------|
| POST   | `/api/sessions/:sessionId/messages`   | Send a message and receive streamed SSE reply  |
| GET    | `/api/sessions/:sessionId/messages`   | Get all messages for a session                 |

---

## SSE Streaming Protocol

When POSTing to `/api/sessions/:sessionId/messages`, the response is an SSE stream:

- Each token arrives as: `data: {"token": "..."}\n\n`
- Stream ends with: `data: [DONE]\n\n`
- Errors arrive as: `data: {"error": "..."}\n\n`

---

## Project Structure
```
backend/
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── index.js              # Express app entry point
│   ├── routes/
│   │   ├── sessions.js       # Session CRUD routes
│   │   └── messages.js       # Message + SSE streaming routes
│   ├── services/
│   │   └── openai.service.js # OpenAI streaming wrapper
│   └── middleware/
│       └── errorHandler.js   # Global error handler
├── .env.example
└── package.json
```
