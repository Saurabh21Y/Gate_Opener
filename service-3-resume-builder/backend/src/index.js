require('dotenv').config();
const express = require('express');
const cors = require('cors');
const resumesRouter = require('./routes/resumes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3003' }));
app.use(express.json({ limit: '10mb' }));

app.get('/health', (req, res) =>
  res.json({ status: 'ok', service: 'resume-builder-backend', timestamp: new Date().toISOString() })
);

app.use('/api/resumes', resumesRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`Resume Builder backend running on port ${PORT}`));
