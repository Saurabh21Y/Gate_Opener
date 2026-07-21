const Question = require('../models/Question');

/**
 * Save questions to the database.
 * Replaces existing questions for the same subject to avoid duplicates on re-upload.
 */
const saveQuestions = async (subject, questions) => {
  await Question.deleteMany({ subject });
  const inserted = await Question.insertMany(questions);
  return { inserted: inserted.length };
};

/**
 * Fetch questions for the exam.
 * correctAnswer, natAnswerFrom, natAnswerTo and explanation are hidden from the client.
 * @param {{ subject?, difficulty?, type?, limit? }} filters
 */
const fetchQuestionsForExam = async ({ subject, difficulty, type, limit } = {}) => {
  const query = {};
  if (subject)    query.subject    = subject;
  if (difficulty) query.difficulty = difficulty;
  if (type)       query.type       = type.toUpperCase();

  let dbQuery = Question
    .find(query)
    .select('-correctAnswer -natAnswerFrom -natAnswerTo -explanation -__v');

  if (limit && !isNaN(limit)) {
    dbQuery = dbQuery.limit(parseInt(limit));
  }

  return dbQuery.lean();
};

/**
 * Get all available subjects.
 */
const getSubjects = async () => {
  return Question.distinct('subject');
};

/**
 * ─── Evaluate a submitted exam ───────────────────────────────────────────────
 *
 * userAnswers shape per question type:
 *
 *  MCQ  → { questionId, selectedOption: Number | null }
 *  MSQ  → { questionId, selectedOptions: Number[] | null }
 *  NAT  → { questionId, enteredValue: Number | null }
 *
 * Rules (per GATE):
 *  MCQ  – correct: +marks | wrong: -negativeMarks | skipped: 0
 *  MSQ  – ALL correct options selected: +marks | any wrong selected: 0 | skipped: 0
 *         (NO negative marking)
 *  NAT  – answer within [natAnswerFrom, natAnswerTo]: +marks | else: 0
 *         (NO negative marking)
 */
const evaluateExam = async (userAnswers, timeTaken) => {
  if (!Array.isArray(userAnswers) || userAnswers.length === 0) {
    throw new Error('userAnswers must be a non-empty array.');
  }

  const questionIds = userAnswers.map((a) => a.questionId);
  const questions   = await Question.find({ _id: { $in: questionIds } }).lean();

  const questionMap = {};
  questions.forEach((q) => {
    questionMap[q._id.toString()] = q;
  });

  let correct     = 0;
  let wrong       = 0;
  let unattempted = 0;
  let totalMarks  = 0;
  let earnedMarks = 0;

  const questionResults = userAnswers.map((ans) => {
    const q = questionMap[ans.questionId];
    if (!q) return null;

    const marks    = q.marks    ?? 1;
    const negMarks = q.negativeMarks ?? 0;
    totalMarks += marks;

    let status;
    let marksAwarded = 0;

    // ── MCQ ─────────────────────────────────────────────────────────
    if (q.type === 'MCQ') {
      if (ans.selectedOption === null || ans.selectedOption === undefined) {
        unattempted++;
        status = 'unattempted';
      } else if (ans.selectedOption === q.correctAnswer) {
        correct++;
        marksAwarded = marks;
        status = 'correct';
      } else {
        wrong++;
        marksAwarded = -negMarks;
        status = 'wrong';
      }
    }

    // ── MSQ ─────────────────────────────────────────────────────────
    else if (q.type === 'MSQ') {
      const selected = ans.selectedOptions;
      if (!Array.isArray(selected) || selected.length === 0) {
        unattempted++;
        status = 'unattempted';
      } else {
        const correctSet  = new Set(q.correctAnswer);
        const selectedSet = new Set(selected);
        const allCorrect  =
          correctSet.size === selectedSet.size &&
          [...correctSet].every((c) => selectedSet.has(c));

        if (allCorrect) {
          correct++;
          marksAwarded = marks;
          status = 'correct';
        } else {
          wrong++;
          marksAwarded = 0; // No negative marking for MSQ
          status = 'wrong';
        }
      }
    }

    // ── NAT ─────────────────────────────────────────────────────────
    else if (q.type === 'NAT') {
      const entered = ans.enteredValue;
      if (entered === null || entered === undefined || entered === '') {
        unattempted++;
        status = 'unattempted';
      } else {
        const val = parseFloat(entered);
        if (!isNaN(val) && val >= q.natAnswerFrom && val <= q.natAnswerTo) {
          correct++;
          marksAwarded = marks;
          status = 'correct';
        } else {
          wrong++;
          marksAwarded = 0; // No negative marking for NAT
          status = 'wrong';
        }
      }
    }

    earnedMarks += marksAwarded;

    return {
      questionId:    ans.questionId,
      type:          q.type,
      question:      q.question,
      options:       q.options,
      // Reveal correct answer after submission
      correctAnswer: q.correctAnswer,
      natAnswerFrom: q.natAnswerFrom,
      natAnswerTo:   q.natAnswerTo,
      // What user submitted
      selectedOption:  ans.selectedOption  ?? null,
      selectedOptions: ans.selectedOptions ?? null,
      enteredValue:    ans.enteredValue    ?? null,
      status,
      marksAwarded,
      explanation:   q.explanation || '',
      marks,
      negativeMarks: negMarks,
    };
  }).filter(Boolean);

  const totalQuestions = userAnswers.length;
  const attempted      = totalQuestions - unattempted;
  const score          = Math.max(0, earnedMarks);
  const accuracy       = attempted > 0
    ? parseFloat(((correct / attempted) * 100).toFixed(2))
    : 0;

  return {
    summary: {
      totalQuestions,
      attempted,
      correct,
      wrong,
      unattempted,
      score,
      totalMarks,
      accuracy,
      timeTaken,
    },
    questionResults,
  };
};

module.exports = { saveQuestions, fetchQuestionsForExam, getSubjects, evaluateExam };
