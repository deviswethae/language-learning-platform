const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    englishWord: { type: String, required: true },
    translations: { type: Map, of: String, required: true },
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

module.exports = Flashcard;
