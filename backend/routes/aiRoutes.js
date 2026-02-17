const express = require('express');
const router = express.Router();
const { generateLearningContent } = require('../controllers/aiController');

// POST /api/ai/generate
router.post('/generate', generateLearningContent);

module.exports = router;
