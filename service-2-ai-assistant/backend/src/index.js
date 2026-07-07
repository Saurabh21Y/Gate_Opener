require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sessionsRouter = require('./routes/sessions');
const messagesRouter = require('./routes/messages');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3002',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'ai-assistant-backend', timestamp: new Date().toISOString() }));

app.use('/api/sessions', sessionsRouter);
app.use('/api/sessions', messagesRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`AI Assistant backend running on port ${PORT}`));
