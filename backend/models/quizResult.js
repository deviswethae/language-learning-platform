const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the structure of each answer object
const answerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, required: true, ref: 'Question' }, // Reference to Question model
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

// Define the main quiz result schema
const quizResultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' }, // Reference to User model
  quizId: { type: String, required: true }, // UUID as string for quiz identifier
  answers: { type: [answerSchema], required: true }, // Array of answer objects
  score: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});

// Create and export the model
const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
