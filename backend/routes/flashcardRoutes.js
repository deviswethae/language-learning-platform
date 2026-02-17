const express = require('express');
const router = express.Router();

// ✅ Fixed the import path: no 's' in flashcardController
const { getFlashcards } = require('../controllers/flashcardController');

router.post('/flashcards', getFlashcards);

module.exports = router;
