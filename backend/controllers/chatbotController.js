const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const textract = require('textract');
require('dotenv').config();

// ========== Multer Config ========== 
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  allowedTypes.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Unsupported file type'), false);
};

const upload = multer({ storage, fileFilter });

// ========== File Processor ========== 
const processFile = (filePath, fileType) => {
  return new Promise((resolve, reject) => {
    if (fileType === 'pdf') {
      pdfParse(fs.readFileSync(filePath))
        .then((data) => resolve(data.text))
        .catch(reject);
    } else if (fileType === 'docx' || fileType === 'doc') {
      mammoth.extractRawText({ path: filePath })
        .then((result) => resolve(result.value))
        .catch(() => {
          textract.fromFileWithPath(filePath, (err, text) =>
            err ? reject(err) : resolve(text)
          );
        });
    } else if (fileType === 'txt') {
      textract.fromFileWithPath(filePath, (err, text) =>
        err ? reject(err) : resolve(text)
      );
    } else {
      reject('Unsupported file type');
    }
  });
};

// ========== Response Formatter ========== 
const formatResponse = (text) => {
  if (!text) return 'No response from AI.';
  const lines = text.split('\n');
  let formatted = '';
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('###')) {
      formatted += `<h3>${trimmed.replace(/^#+/, '').trim()}</h3>`;
    } else if (/^\d+\./.test(trimmed)) {
      formatted += `<li>${trimmed}</li>`;
    } else if (/^[-*]/.test(trimmed)) {
      formatted += `<li>${trimmed.slice(1).trim()}</li>`;
    } else {
      formatted += `<p>${trimmed}</p>`;
    }
  });
  return formatted.replace(/(<li>[\s\S]*?<\/li>)+/g, (match) => `<ul>${match}</ul>`);
};

// ========== Existing Chatbot Logic ========== 
const chatWithBot = async (req, res) => {
  const file = req.file;
  let { messages } = req.body;
  let contentFromFile = null;

  try {
    if (file) {
      const ext = path.extname(file.originalname).toLowerCase().slice(1);
      contentFromFile = await processFile(file.path, ext);
    }

    if (!Array.isArray(messages)) {
      const fallback = req.body.message || contentFromFile;
      if (!fallback) {
        return res.status(400).json({ error: 'No valid message or file uploaded.' });
      }
      messages = [{ role: 'user', content: fallback }];
    }

    if (contentFromFile) {
      messages.push({ role: 'user', content: contentFromFile });
    }

    const systemMessage = {
      role: 'system',
      content: `
        You are an intelligent, helpful AI tutor.
        Maintain full context of previous messages.
        Do not ask the user to repeat; instead, reason based on history.
        Improve clarity, grammar, and explanation.
        Format replies in clean HTML using <p>, <ul>, <li>, <h3> where helpful.
      `,
    };

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...messages],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'AIChatTutor',
        },
      }
    );

    const botText = response.data?.choices?.[0]?.message?.content || 'No response from AI.';
    const formatted = formatResponse(botText);

    res.json({ reply: formatted });
  } catch (error) {
    console.error('❌ AI Error:', error?.response?.data || error.message);
    res.status(500).json({ reply: 'Something went wrong while processing your request.' });
  } finally {
    if (file && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
  }
};

// ========== Voice Assistant Logic (NEW) ========== 
const voiceAssistantReply = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: 'No voice input received.' });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
              You are a friendly and concise AI voice assistant.
              Keep answers clear and natural.
              Keep it short, spoken like a human.
            `,
          },
          { role: 'user', content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'VoiceTutor',
        },
      }
    );

    const botReply = response.data?.choices?.[0]?.message?.content || 'No reply.';
    res.json({ reply: botReply });
  } catch (error) {
    console.error('❌ Voice Assistant Error:', error.message);
    res.status(500).json({ reply: 'Error generating voice assistant response.' });
  }
};

module.exports = {
  chatWithBot,
  upload,
  voiceAssistantReply, // 🔥 Added new export
};
