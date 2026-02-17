const mongoose = require('mongoose');

const userLanguagePreferenceSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    language: { type: String, required: true },
});

const UserLanguagePreference = mongoose.model('UserLanguagePreference', userLanguagePreferenceSchema);

module.exports = UserLanguagePreference;
