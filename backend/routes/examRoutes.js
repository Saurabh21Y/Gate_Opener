const express = require('express');
const { getExamQuestions, getAvailableSubjects, submitExam } = require('../controllers/examController');

const router = express.Router();

// GET /exam?subject=&difficulty=&type=MCQ|MSQ|NAT&limit=
router.get('/', getExamQuestions);

// GET /exam/subjects
router.get('/subjects', getAvailableSubjects);

// POST /exam/submit
router.post('/submit', submitExam);

module.exports = router;
