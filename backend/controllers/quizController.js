const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const Question = require('../models/Question');
const QuizResult = require('../models/QuizResult');

// Generate a quiz
const generateQuiz = async (req, res) => {
  const { language, level } = req.body;

  console.log("🔍 Received request to generate quiz:", { language, level });

  // Crafting the prompt for OpenAI to generate a quiz
  const prompt = `Generate 5 multiple-choice quiz questions for ${language} learners at the ${level} level.
Each question should focus on language skills such as:
- Vocabulary
- Grammar
- Sentence construction
- (Optional) Common phrases

Ensure each question:
- Uses clear language
- Has 4 options
- Has a 'correctAnswer' that exactly matches one of the options

Format: JSON array of objects with:
1. "question"
2. "options": [4 options]
3. "correctAnswer"
`;

  try {
    // Make the API request to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_QUIZ_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5000',
        'X-Title': 'quiz-generator',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a quiz generator bot for language learners.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content || '';
    
    console.log("🧠 Model reply:", reply);

    // Match the quiz JSON from the model's response
    const jsonMatch = reply.match(/\[.*\]/s);  // Matches the JSON array part of the response

    if (!jsonMatch) {
      return res.status(500).json({ message: 'Failed to extract quiz JSON from model response.' });
    }

    // Parse the JSON and validate the quiz format
    const questions = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(500).json({ message: 'Invalid or empty quiz format.' });
    }

    const quizId = uuidv4();  // Generate a unique quiz ID

    // Save the generated questions in the database
    const savedQuestions = await Question.insertMany(
      questions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        language,
        level,
        quizId,
      }))
    );

    console.log("📝 Stored questions:", savedQuestions.length);

    // Return the saved questions along with their quiz ID
    res.json({
      quizId,
      questions: savedQuestions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        quizId: q.quizId,
      })),
    });

  } catch (error) {
    console.error('💥 Error generating quiz:', error);
    res.status(500).json({ message: 'Error generating quiz questions.' });
  }
};

// Submit quiz result
const submitQuizResult = async (req, res) => {
  const { userId, quizId, answers, score } = req.body;

  // Validate the request body
  if (!userId || !quizId || !Array.isArray(answers) || typeof score !== 'number') {
    return res.status(400).json({ message: 'Invalid request. Include userId, quizId, answers, and score.' });
  }

  // Ensure the answers are in the correct format (array of objects)
  const isValidAnswers = answers.every(answer => 
    answer.hasOwnProperty('questionId') && 
    typeof answer.answer === 'string' &&
    typeof answer.isCorrect === 'boolean'
  );

  if (!isValidAnswers) {
    return res.status(400).json({ message: 'Answers should be an array of objects with questionId, answer, and isCorrect fields.' });
  }

  try {
    // Create a new quiz result document
    const newResult = new QuizResult({
      userId,
      quizId,
      answers,
      score,
      submittedAt: new Date(),
    });

    // Save the quiz result to the database
    await newResult.save();
    console.log("✅ Quiz result saved for user:", userId);

    // Respond with a success message
    res.status(200).json({ message: 'Quiz results submitted successfully.' });

  } catch (error) {
    console.error('💥 Error saving quiz result:', error);
    res.status(500).json({ message: 'Failed to save quiz result.' });
  }
};

module.exports = { generateQuiz, submitQuizResult };
