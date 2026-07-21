const mongoose = require('mongoose');

/**
 * Unified Question schema supporting all GATE question types:
 *
 *  MCQ (Multiple Choice Question)
 *    – 4 options, exactly 1 correct answer (index 0-3)
 *    – Negative marking applies
 *
 *  MSQ (Multiple Select Question)
 *    – 4 options, 1 or more correct answers (array of indices)
 *    – NO negative marking (GATE rule)
 *    – Full marks only if ALL correct options are selected
 *
 *  NAT (Numerical Answer Type)
 *    – No options, answer is a decimal number
 *    – Accepted if within [natAnswerFrom, natAnswerTo] range
 *    – NO negative marking (GATE rule)
 */
const questionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    // ── Categorisation ──────────────────────────────────────────────
    type: {
      type: String,
      enum: ['MCQ', 'MSQ', 'NAT'],
      required: true,
      default: 'MCQ',
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },

    // ── Options (MCQ / MSQ only, empty for NAT) ────────────────────
    options: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          if (this.type === 'NAT') return v.length === 0;
          return v.length === 4;
        },
        message: 'MCQ/MSQ questions must have exactly 4 options; NAT questions must have none.',
      },
    },

    // ── Correct Answer ─────────────────────────────────────────────
    // MCQ  → single Number  (index 0-3)         e.g.  2
    // MSQ  → Array<Number>  (sorted indices)    e.g.  [0, 2]
    // NAT  → null (answer is defined by range below)
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // ── NAT answer range ───────────────────────────────────────────
    // Answer is accepted if natAnswerFrom <= userAnswer <= natAnswerTo
    natAnswerFrom: {
      type: Number,
      default: null,
    },
    natAnswerTo: {
      type: Number,
      default: null,
    },

    // ── Metadata ───────────────────────────────────────────────────
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    concept: {
      type: String,
      trim: true,
      default: '',
    },
    explanation: {
      type: String,
      trim: true,
      default: '',
    },
    marks: {
      type: Number,
      default: 1,
    },
    // MSQ and NAT have 0 negative marks per GATE rules
    negativeMarks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast queries
questionSchema.index({ subject: 1, difficulty: 1, type: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
