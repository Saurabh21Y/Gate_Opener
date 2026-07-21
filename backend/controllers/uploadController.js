const fs = require('fs');
const path = require('path');
const { parseJSON } = require('../parser/jsonParser');
const { saveQuestions } = require('../services/questionService');

/**
 * POST /upload
 * Accepts a JSON file, parses it, and stores questions in MongoDB.
 */
const uploadQuestions = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded. Please attach a JSON file.' });
  }

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  try {
    let parsed;

    if (ext === '.json') {
      parsed = parseJSON(filePath);
    } else {
      // Future: plug in markdownParser, pdfParser, etc.
      return res.status(415).json({
        success: false,
        message: `Unsupported file type "${ext}". Only .json is supported in Phase 1.`,
      });
    }

    const { subject, questions } = parsed;
    const result = await saveQuestions(subject, questions);

    // Clean up uploaded file after processing
    fs.unlinkSync(filePath);

    return res.status(201).json({
      success: true,
      message: `Successfully uploaded ${result.inserted} questions for subject "${subject}".`,
      data: { subject, count: result.inserted },
    });
  } catch (error) {
    // Try to clean up file on error
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    next(error);
  }
};

module.exports = { uploadQuestions };
