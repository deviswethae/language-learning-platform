const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController'); // Import the controller

// Destructure needed exports from the controller
const { chatWithBot, upload, voiceAssistantReply } = chatbotController;

// POST route to handle chatbot messages with file upload
router.post('/chat', upload.single('file'), chatWithBot);

// POST route to handle voice assistant messages
router.post('/voiceAssistant', voiceAssistantReply);

module.exports = router;
