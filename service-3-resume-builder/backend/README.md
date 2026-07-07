# Resume Builder Backend

AI-powered resume generation service using Express.js, Prisma, PostgreSQL, and OpenAI GPT-4o.

## Overview

This backend service accepts structured resume form data, uses OpenAI GPT-4o to generate professional ATS-optimized content, renders it into one of three HTML templates, and persists the result to PostgreSQL.

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Run Prisma Migration

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

The server starts on **http://localhost:4003**

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `4003` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/resume_builder_db` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` |
| `OPENAI_MODEL` | GPT model to use | `gpt-4o` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3003` |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/resumes/generate` | Generate resume from form data |
| `GET` | `/api/resumes` | List all resumes |
| `GET` | `/api/resumes/:id` | Get single resume |
| `PUT` | `/api/resumes/:id` | Update resume HTML or template |
| `DELETE` | `/api/resumes/:id` | Delete resume |
| `POST` | `/api/resumes/:id/change-template` | Re-render with new template |

### POST /api/resumes/generate

**Request Body:**
```json
{
  "formData": {
    "personalInfo": {
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "+1 555-000-0000",
      "location": "San Francisco, CA",
      "linkedin": "linkedin.com/in/janedoe",
      "portfolio": ""
    },
    "experience": [
      {
        "id": "1",
        "company": "Acme Corp",
        "position": "Software Engineer",
        "startDate": "Jan 2022",
        "endDate": "Present",
        "current": true,
        "description": "Built microservices and REST APIs"
      }
    ],
    "education": [
      {
        "id": "1",
        "institution": "MIT",
        "degree": "Bachelor of Science",
        "field": "Computer Science",
        "startDate": "2018",
        "endDate": "2022",
        "gpa": "3.8"
      }
    ],
    "skills": "React, Node.js, Python, PostgreSQL, Leadership",
    "summary": "Targeting senior engineering roles at startup companies"
  },
  "template": "modern"
}
```

**Response:**
```json
{
  "id": "clx...",
  "htmlContent": "<!DOCTYPE html>...",
  "generatedData": { ... },
  "template": "modern",
  "title": "Jane Doe — Resume"
}
```

---

## Templates

| Template | Style | Typography |
|---|---|---|
| `modern` | Two-column with indigo sidebar | System sans-serif |
| `classic` | Single-column centered header | Serif (Times New Roman) |
| `minimal` | Ultra-clean whitespace | Helvetica/Arial |

---

## Project Structure

```
backend/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── index.js               # Express app entry
│   ├── middleware/
│   │   └── errorHandler.js    # Global error handler
│   ├── routes/
│   │   └── resumes.js         # Resume CRUD + generate routes
│   ├── services/
│   │   ├── openai.service.js  # GPT-4o integration
│   │   └── html.service.js    # Template renderer
│   └── templates/
│       ├── modern.js          # Modern two-column template
│       ├── classic.js         # Classic single-column template
│       └── minimal.js         # Minimal clean template
├── .env.example
└── package.json
```
