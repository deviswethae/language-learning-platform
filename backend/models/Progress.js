const mongoose = require('mongoose');
const { Schema } = mongoose;

const progressSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completedLessons: [{ type: String, ref: 'Lesson' }],
  lastCompletedLesson: { type: String, ref: 'Lesson' },
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
