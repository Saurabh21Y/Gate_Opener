const express = require('express');
const { getExamQuestions, getAvailableSubjects, submitExam, deleteSubjectController } = require('../controllers/examController');

const router = express.Router();

// GET /exam?subject=&difficulty=&type=MCQ|MSQ|NAT&limit=
router.get('/', getExamQuestions);

// GET /exam/subjects
router.get('/subjects', getAvailableSubjects);

// POST /exam/submit
router.post('/submit', submitExam);

// DELETE /exam/subject/:subject  — deletes all questions for a subject
router.delete('/subject/:subject', deleteSubjectController);

module.exports = router;
