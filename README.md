# GatePrep – GATE Exam Practice Platform

A full-stack GATE exam preparation platform built with **Node.js + Express + MongoDB** (backend) and **React + Vite + Tailwind CSS** (frontend).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gateprep
NODE_ENV=development
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000
```

### 3. Start MongoDB
```bash
# Windows (if MongoDB is installed locally)
mongod
```

### 4. Run Backend
```bash
cd backend
npm run dev
```

### 5. Run Frontend
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📋 Usage

1. **Upload Questions** — Click "Upload Questions" on the home page, then drag-and-drop a `.json` file (see `sample_questions.json` for the format)
2. **Configure Exam** — Select subject, difficulty, and number of questions
3. **Start Exam** — A timed GATE-style exam begins
4. **Submit** — Submit exam to see your score, accuracy, and per-question review

---

## 📁 Project Structure

```
Venture Builder/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── controllers/            # Request handlers
│   ├── middleware/errorHandler.js
│   ├── models/Question.js      # Mongoose schema
│   ├── parser/jsonParser.js    # Pluggable file parser
│   ├── routes/                 # Express routes
│   ├── services/questionService.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/         # Timer, QuestionCard, QuestionNav, ScoreCard, FileUpload
│   │   ├── context/ExamContext.jsx
│   │   ├── hooks/useTimer.js
│   │   ├── pages/              # HomePage, ExamPage, ResultPage
│   │   └── services/api.js
│   └── ...
└── sample_questions.json       # Test question bank (OS)
```

---

## 🔌 API Reference

| Method | Endpoint          | Description                      |
|--------|-------------------|----------------------------------|
| GET    | `/health`         | Health check                     |
| POST   | `/upload`         | Upload JSON question file        |
| GET    | `/exam`           | Fetch questions (answers hidden) |
| GET    | `/exam/subjects`  | List available subjects          |
| POST   | `/exam/submit`    | Submit answers, get result       |

---

## 🛣️ Roadmap

- **Phase 1** ✅ JSON Upload, Exam UI, Timer, Submit, Results
- **Phase 2** 📅 Markdown upload, Randomization, Analytics, Bookmarks
- **Phase 3** 🤖 AI-based Question Generation, PDF Parsing, Adaptive Tests
