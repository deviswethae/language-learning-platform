const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    index: true
  },
  level: {
    type: String, 
    required: true,
    index: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  // Additional fields based on the frontend
  duration: {
    type: Number,
    default: 0 // Duration in minutes
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound index for faster queries by language and level
lessonSchema.index({ language: 1, level: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);