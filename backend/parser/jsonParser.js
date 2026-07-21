/**
 * JSON Parser – Parses and validates uploaded GATE question files.
 *
 * Supported question types:
 *   MCQ  – 4 options, correctAnswer: Number (0-3)
 *   MSQ  – 4 options, correctAnswer: Number[] (e.g. [0, 2])
 *   NAT  – no options, answer range accepted in TWO formats:
 *            Format A (GATE paper style):  answer: { min: X, max: Y }
 *            Format B (explicit fields):   natAnswerFrom: X, natAnswerTo: Y
 *
 * Contract: returns { subject, questions[] } or throws an Error.
 */

const fs = require('fs');

const parseJSON = (filePath) => {
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch (err) {
    throw new Error(`Failed to read file: ${err.message}`);
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Invalid JSON format: ${err.message}`);
  }

  // Validate top-level structure
  if (!parsed.subject || typeof parsed.subject !== 'string') {
    throw new Error('JSON must contain a top-level "subject" string field.');
  }
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('JSON must contain a non-empty "questions" array.');
  }

  const validatedQuestions = parsed.questions.map((q, index) => {
    const errors = [];
    const label = `Question at index ${index} (id: ${q.id ?? 'unknown'})`;

    // ── Common fields ────────────────────────────────────────────────
    if (q.id === undefined || q.id === null) errors.push('Missing "id"');
    if (!q.question || typeof q.question !== 'string') errors.push('Missing or invalid "question"');

    const type = (q.type || 'MCQ').toUpperCase();
    if (!['MCQ', 'MSQ', 'NAT'].includes(type)) {
      errors.push(`"type" must be MCQ, MSQ, or NAT. Got: "${q.type}"`);
    }

    // ── Type-specific validation ─────────────────────────────────────
    if (type === 'MCQ') {
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push('"options" must be an array of exactly 4 strings for MCQ');
      }
      if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        errors.push('"correctAnswer" must be a number 0-3 for MCQ');
      }
    }

    if (type === 'MSQ') {
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        errors.push('"options" must be an array of exactly 4 strings for MSQ');
      }
      if (
        !Array.isArray(q.correctAnswer) ||
        q.correctAnswer.length === 0 ||
        !q.correctAnswer.every((c) => typeof c === 'number' && c >= 0 && c <= 3)
      ) {
        errors.push('"correctAnswer" must be a non-empty array of indices (0-3) for MSQ');
      }
    }

    if (type === 'NAT') {
      if (Array.isArray(q.options) && q.options.length > 0) {
        errors.push('NAT questions must not have "options"');
      }

      // Resolve NAT answer range from either format:
      //   Format A (GATE paper style): answer: { min, max }
      //   Format B (explicit fields):  natAnswerFrom / natAnswerTo
      const natFrom = (q.answer && typeof q.answer.min === 'number')
        ? q.answer.min
        : q.natAnswerFrom;
      const natTo = (q.answer && typeof q.answer.max === 'number')
        ? q.answer.max
        : q.natAnswerTo;

      if (typeof natFrom !== 'number') {
        errors.push('NAT requires either "answer.min" or "natAnswerFrom" (number)');
      }
      if (typeof natTo !== 'number') {
        errors.push('NAT requires either "answer.max" or "natAnswerTo" (number)');
      }
      if (typeof natFrom === 'number' && typeof natTo === 'number' && natFrom > natTo) {
        errors.push('NAT answer min must be <= max');
      }

      // Attach resolved values so the normalise step can use them
      q._natFrom = natFrom;
      q._natTo   = natTo;
    }

    if (errors.length > 0) {
      throw new Error(`${label} is invalid: ${errors.join('; ')}`);
    }

    // ── Normalise ─────────────────────────────────────────────────────
    // MSQ: GATE has no negative marking for MSQ / NAT — enforce 0
    const negativeMarks =
      type === 'MSQ' || type === 'NAT' ? 0 : (q.negativeMarks ?? 0);

    return {
      id: q.id,
      type,
      subject: parsed.subject,
      question: q.question,
      options: type === 'NAT' ? [] : q.options.map(String),
      correctAnswer: type === 'NAT' ? null : q.correctAnswer,
      natAnswerFrom: type === 'NAT' ? q._natFrom : null,
      natAnswerTo:   type === 'NAT' ? q._natTo   : null,
      difficulty: q.difficulty || 'Medium',
      concept: q.concept || '',
      explanation: q.explanation || '',
      marks: q.marks ?? 1,
      negativeMarks,
    };
  });

  return {
    subject: parsed.subject,
    questions: validatedQuestions,
  };
};

module.exports = { parseJSON };
