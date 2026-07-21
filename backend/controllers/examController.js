const { fetchQuestionsForExam, getSubjects, evaluateExam } = require('../services/questionService');

/**
 * GET /exam
 * Returns questions for the exam (correctAnswer hidden).
 * Query params: subject, difficulty, limit
 */
const getExamQuestions = async (req, res, next) => {
  try {
    const { subject, difficulty, type, limit } = req.query;
    const questions = await fetchQuestionsForExam({ subject, difficulty, type, limit });

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for the given filters. Please upload questions first.',
      });
    }

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /subjects
 * Returns all available subjects.
 */
const getAvailableSubjects = async (req, res, next) => {
  try {
    const subjects = await getSubjects();
    return res.status(200).json({ success: true, data: subjects });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /submit
 * Accepts user answers + time taken, returns full result.
 * Body: { answers: [{ questionId, selectedOption }], timeTaken: number }
 */
const submitExam = async (req, res, next) => {
  try {
    const { answers, timeTaken } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Request body must include a non-empty "answers" array.',
      });
    }

    const result = await evaluateExam(answers, timeTaken || 0);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getExamQuestions, getAvailableSubjects, submitExam };
