const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /api/sessions - List all sessions
router.get('/', async (req, res, next) => {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { messages: true } } },
    });
    res.json(sessions);
  } catch (error) { next(error); }
});

// POST /api/sessions - Create new session
router.post('/', async (req, res, next) => {
  try {
    const { title } = req.body;
    const session = await prisma.session.create({ data: { title: title || 'New Chat' } });
    res.status(201).json(session);
  } catch (error) { next(error); }
});

// GET /api/sessions/:id - Get session with messages
router.get('/:id', async (req, res, next) => {
  try {
    const session = await prisma.session.findUnique({
      where: { id: req.params.id },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (error) { next(error); }
});

// PUT /api/sessions/:id - Update session title
router.put('/:id', async (req, res, next) => {
  try {
    const session = await prisma.session.update({
      where: { id: req.params.id },
      data: { title: req.body.title },
    });
    res.json(session);
  } catch (error) { next(error); }
});

// DELETE /api/sessions/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.session.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) { next(error); }
});

module.exports = router;
