import React, { useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [language, setLanguage] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [loading, setLoading] = useState(false);
  const [aiContent, setAiContent] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAiContent(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/ai/generate",
        { language, level },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setAiContent(response.data.content);
    } catch (err) {
      console.error("❌ Error fetching AI content:", err);
      setError("Failed to fetch content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Language Learning Dashboard</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Enter Language (e.g. Spanish)"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          required
          style={styles.input}
        />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={styles.select}
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Generating..." : "Generate Content"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {aiContent && (
        <div style={styles.results}>
          <h2>📚 Lessons</h2>
          {Array.isArray(aiContent.lessons) && aiContent.lessons.map((lesson, idx) => (
            <div key={idx} style={styles.card}>
              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>
              {Array.isArray(lesson.content) && lesson.content.map((section, i) => (
                <div key={i}>
                  <h4>{section.heading}</h4>
                  <p>{section.text}</p>
                  {section.audioUrl && (
                    <audio controls src={section.audioUrl}></audio>
                  )}
                  {section.practice && (
                    <p><strong>Practice:</strong> {section.practice}</p>
                  )}
                </div>
              ))}
            </div>
          ))}

          <h2>🧠 Quizzes</h2>
          {Array.isArray(aiContent.quizzes) && aiContent.quizzes.map((quiz, idx) => (
            <div key={idx} style={styles.card}>
              <p><strong>Q:</strong> {quiz.question}</p>
              <ul>
                {quiz.options?.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
              <p><strong>Answer:</strong> {quiz.answer}</p>
              {quiz.explanation && <p><em>{quiz.explanation}</em></p>}
            </div>
          ))}

          <h2>📇 Flashcards</h2>
          {Array.isArray(aiContent.flashcards) && aiContent.flashcards.map((card, idx) => (
            <div key={idx} style={styles.card}>
              <p><strong>{card.term}</strong>: {card.definition}</p>
              {card.exampleUsage && <p><em>Usage:</em> {card.exampleUsage}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple styles
const styles = {
  container: {
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  form: {
    marginBottom: "2rem",
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    flexWrap: "wrap",
  },
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    minWidth: "200px",
  },
  select: {
    padding: "0.5rem",
    fontSize: "1rem",
  },
  button: {
    padding: "0.6rem 1.2rem",
    fontSize: "1rem",
    backgroundColor: "#30A197",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  results: {
    marginTop: "2rem",
  },
  card: {
    border: "1px solid #ddd",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    backgroundColor: "#f9f9f9",
  },
};

export default Dashboard;
