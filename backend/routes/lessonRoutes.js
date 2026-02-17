const express = require('express');
const router = express.Router();
const {
  getLessonsByLanguageAndLevel,
  markLessonCompleted,
  getNextLesson,
} = require('../controllers/lessonController');
const { protect } = require('../middleware/authMiddleware');

// Get lessons by language and level
// Now accepts query parameters 'language' and 'level' to fetch lessons from MongoDB
// Example: /api/lessons?language=French&level=Beginner
router.get('/', getLessonsByLanguageAndLevel);

// Mark a lesson as completed
// Protect route to ensure that only authenticated users can mark a lesson as completed
// Example: POST /api/lessons/complete with JSON body { "lessonId": "lesson123" }
router.post('/complete', protect, markLessonCompleted);

// Get the next lesson for the user based on their progress
// Example: /api/lessons/next?language=French&level=Beginner
router.get('/next', protect, getNextLesson);

module.exports = router;
