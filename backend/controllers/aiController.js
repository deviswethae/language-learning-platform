const axios = require("axios");

const generateLearningContent = async (req, res) => {
  try {
    const { language, level } = req.body || {};
    console.log("📦 Received body:", req.body);

    if (!language || !level) {
      return res.status(400).json({ message: "Language and level are required." });
    }

    const prompt = `
You are a professional language tutor creating a complete 5-day course for learning "${language}" at the "${level}" level.

Assume the learner knows ZERO about the language. Create a full beginner-friendly experience.

🔹 For each day, include:
- 2-3 lessons
- each lesson must contain:
  - title
  - description
  - content (sections with heading, text explanation, examples, practice tip, audioUrl: "", imageUrl: "")

🔹 Also provide:
- 5 quizzes with options, correct answer, explanation
- 10 flashcards with term (in ${language}), definition (in English), and usage in a sentence
- 1 sample dialogue with 4-6 lines in ${language} and their English translations

⚠️ IMPORTANT: Return ONLY raw, valid JSON with this format (NO markdown or backticks):
{
  "days": [
    {
      "day": "Day 1",
      "lessons": [
        {
          "title": "Lesson Title",
          "description": "What the lesson covers",
          "content": [
            {
              "heading": "Topic Heading",
              "text": "Beginner-friendly explanation",
              "examples": ["Example sentence 1", "Example 2"],
              "practice": "Simple exercise suggestion",
              "audioUrl": "",
              "imageUrl": ""
            }
          ]
        }
      ]
    }
  ],
  "quizzes": [
    {
      "question": "Beginner-level question",
      "options": ["A", "B", "C", "D"],
      "answer": "Correct option",
      "explanation": "Short reason why it's correct"
    }
  ],
  "flashcards": [
    {
      "term": "Word in ${language}",
      "definition": "Meaning in English",
      "exampleUsage": "How it's used in a sentence"
    }
  ],
  "dialogue": {
    "title": "Basic Conversation Example",
    "lines": [
      {
        "speaker": "A",
        "text": "Sentence in ${language}",
        "translation": "English translation"
      }
    ]
  }
}
`.trim();

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a kind and patient language tutor who creates beginner-friendly language learning material in structured JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "LanguageLearningApp"
        }
      }
    );

    const aiContent = response?.data?.choices?.[0]?.message?.content?.trim();
    if (!aiContent) {
      return res.status(500).json({ message: "No response from AI." });
    }

    const cleaned = aiContent.replace(/^```json|```$/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON Parse Error:", err.message);
      console.log("📨 Raw AI response:", aiContent);
      return res.status(500).json({ message: "Invalid JSON format from AI." });
    }

    const { days, quizzes, flashcards, dialogue } = parsed;
    if (!Array.isArray(days) || !Array.isArray(quizzes) || !Array.isArray(flashcards) || !dialogue) {
      return res.status(500).json({ message: "Incomplete or invalid content structure." });
    }

    return res.status(200).json({ content: parsed });

  } catch (err) {
    console.error("❌ Error generating content:", err.message);
    if (err.response?.data) {
      console.log("📩 API Error:", err.response.data);
    }
    return res.status(500).json({ message: "Failed to generate learning content." });
  }
};

module.exports = {
  generateLearningContent
};
