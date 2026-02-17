const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetLanguage: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  goals: String, // optional
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);
