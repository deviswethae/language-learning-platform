const axios = require('axios');

// Sample word bank for flashcards
const wordBank = [
    'apple', 'banana', 'car', 'dog', 'elephant', 'flower', 'guitar', 'house', 'ice', 'jacket',
    'kite', 'lemon', 'monkey', 'notebook', 'orange', 'pear', 'quilt', 'rocket', 'sun', 'tree',
    'umbrella', 'vase', 'window', 'xylophone', 'yacht', 'zebra', 'ball', 'book', 'chair', 'desk',
    'ear', 'fish', 'goat', 'hat', 'ink', 'juice', 'key', 'lamp', 'milk', 'nest', 'owl', 'pen',
    'queen', 'rain', 'star', 'toy', 'van', 'water', 'x-ray', 'yarn', 'zip', 'bottle', 'cloud',
    'drum', 'egg', 'fan', 'glove', 'hill', 'island', 'jam', 'kangaroo', 'leaf', 'mountain',
    'net', 'ocean', 'pencil', 'question', 'ring', 'shoe', 'table', 'uniform', 'violin', 'whistle',
    'axe', 'yogurt', 'zoo', 'bubble', 'cake', 'doll', 'engine', 'flag', 'game', 'hammer',
    'idea', 'jungle', 'kettle', 'ladder', 'mirror', 'nail', 'oven', 'pillow', 'quiet', 'rope',
    'sock', 'television', 'unicorn', 'village', 'wheel'
];

// Function to translate a word using MyMemory Translation API
const translateWord = async (word, targetLanguage) => {
    try {
        const response = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
                q: word,
                langpair: `en|${targetLanguage}`
            }
        });
        return response.data.responseData.translatedText;  // Return the translated text
    } catch (error) {
        console.error(`Translation failed for "${word}":`, error.message);
        return word;  // Return the original word in case of error
    }
};

// Main function to generate flashcards
const getFlashcards = async (req, res) => {
    const { language } = req.body;

    if (!language) {
        return res.status(400).json({ message: 'Language is required' });
    }

    try {
        const selectedWords = wordBank.sort(() => 0.5 - Math.random()).slice(0, 15);

        const flashcards = await Promise.all(
            selectedWords.map(async (word) => ({
                englishWord: word,
                translatedWord: await translateWord(word, language),
            }))
        );

        res.json(flashcards);
    } catch (err) {
        console.error('Error generating flashcards:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getFlashcards
};
