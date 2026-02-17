const express = require('express');
const router = express.Router();
const { generateQuiz, submitQuizResult } = require('../controllers/quizController'); // Import the controller functions

// Route to generate quiz questions
router.post('/quizzes/generate', generateQuiz); // Route to generate quiz questions

// Route to submit quiz results after the user completes the quiz
router.post('/quizzes/submit', submitQuizResult);

module.exports = router;
