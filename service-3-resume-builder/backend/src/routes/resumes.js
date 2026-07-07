const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { generateResumeContent } = require('../services/openai.service');
const { renderTemplate } = require('../services/html.service');

const prisma = new PrismaClient();

// POST /api/resumes/generate
router.post('/generate', async (req, res, next) => {
  try {
    const { formData, template = 'modern' } = req.body;
    if (!formData || !formData.personalInfo?.name) {
      return res.status(400).json({ error: 'formData with personalInfo.name is required' });
    }

    console.log('Generating resume for:', formData.personalInfo.name);

    // Step 1: LLM generates structured content
    const generatedData = await generateResumeContent(formData);

    // Step 2: Render HTML template
    const htmlContent = renderTemplate(generatedData, template);

    // Step 3: Save to DB
    const resume = await prisma.resume.create({
      data: {
        title: `${formData.personalInfo.name} — Resume`,
        formData,
        generatedData,
        htmlContent,
        template,
      },
    });

    res.status(201).json({
      id: resume.id,
      htmlContent,
      generatedData,
      template,
      title: resume.title,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/resumes
router.get('/', async (req, res, next) => {
  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, template: true, createdAt: true, updatedAt: true },
    });
    res.json(resumes);
  } catch (error) {
    next(error);
  }
});

// GET /api/resumes/:id
router.get('/:id', async (req, res, next) => {
  try {
    const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (error) {
    next(error);
  }
});

// PUT /api/resumes/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { htmlContent, template } = req.body;
    const resume = await prisma.resume.update({
      where: { id: req.params.id },
      data: {
        ...(htmlContent !== undefined && { htmlContent }),
        ...(template && { template }),
      },
    });
    res.json(resume);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/resumes/:id
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.resume.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// POST /api/resumes/:id/change-template
router.post('/:id/change-template', async (req, res, next) => {
  try {
    const { template } = req.body;
    if (!['modern', 'classic', 'minimal'].includes(template)) {
      return res.status(400).json({ error: 'Invalid template. Use: modern, classic, minimal' });
    }

    const resume = await prisma.resume.findUnique({ where: { id: req.params.id } });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });

    const htmlContent = renderTemplate(resume.generatedData, template);

    const updated = await prisma.resume.update({
      where: { id: req.params.id },
      data: { template, htmlContent },
    });

    res.json({ htmlContent, template, id: updated.id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
