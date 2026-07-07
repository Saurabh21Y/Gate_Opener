const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { streamChatCompletion } = require('../services/openai.service');
const prisma = new PrismaClient();

// POST /api/sessions/:sessionId/messages - Send message with streaming
router.post('/:sessionId/messages', async (req, res, next) => {
  const { sessionId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Message content is required' });
  }

  try {
    // Verify session exists
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Save user message
    await prisma.message.create({ data: { sessionId, role: 'user', content: content.trim() } });

    // Update session title from first user message
    if (session.title === 'New Chat' && session.messages.length === 0) {
      const newTitle = content.trim().substring(0, 50) + (content.length > 50 ? '...' : '');
      await prisma.session.update({ where: { id: sessionId }, data: { title: newTitle } });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3002');
    res.flushHeaders();

    // Build messages array for OpenAI
    const openaiMessages = [
      {
        role: 'system',
        content: 'You are a helpful, knowledgeable AI assistant. Provide clear, concise, and accurate responses. Format responses with markdown when appropriate.',
      },
      ...session.messages.map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: content.trim() },
    ];

    let fullResponse = '';

    await streamChatCompletion({
      messages: openaiMessages,
      onToken: (token) => {
        fullResponse += token;
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      },
      onComplete: async (fullText) => {
        // Save assistant response
        await prisma.message.create({ data: { sessionId, role: 'assistant', content: fullText } });
        // Update session updatedAt
        await prisma.session.update({ where: { id: sessionId }, data: { updatedAt: new Date() } });
        res.write(`data: [DONE]\n\n`);
        res.end();
      },
    });

  } catch (error) {
    console.error('Streaming error:', error);
    if (!res.headersSent) return next(error);
    res.write(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`);
    res.end();
  }
});

// GET /api/sessions/:sessionId/messages - Get all messages in a session
router.get('/:sessionId/messages', async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({
      where: { sessionId: req.params.sessionId },
      orderBy: { createdAt: 'asc' },
    });
    res.json(messages);
  } catch (error) { next(error); }
});

module.exports = router;
