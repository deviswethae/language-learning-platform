import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Form,
  Alert,
  Badge,
  ProgressBar,
} from 'react-bootstrap';
import axios from 'axios';

const QuizPage = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Load user info, language and level on mount
  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserId(parsedUserData.id);
    }
    setLanguage(localStorage.getItem('selectedLanguage') || 'English');
    setLevel(localStorage.getItem('selectedLevel') || 'Beginner');
  }, []);

  // Fetch quiz questions
  const fetchQuiz = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/quizzes/generate`,
        { language, level },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { questions, quizId } = response.data;

      if (questions?.length) {
        setQuizQuestions(questions);
        setUserAnswers(Array(questions.length).fill(''));
        setScore(null);
        setQuizStarted(true);
        setQuizSubmitted(false);
        setCurrentQuestion(0);
        if (quizId) localStorage.setItem('lastQuizId', quizId);
      } else {
        setErrorMessage('No questions received. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to load quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle answer change
  const handleAnswerChange = (e, index) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = e.target.value;
    setUserAnswers(updatedAnswers);
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Move to previous question
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Submit quiz
  const handleSubmitQuiz = async (e) => {
    e.preventDefault();

    if (!userId) {
      setErrorMessage('User not logged in.');
      return;
    }

    const quizId = quizQuestions[0]?.quizId || localStorage.getItem('lastQuizId');
    if (!quizId) {
      setErrorMessage('Quiz ID is missing.');
      return;
    }

    let calculatedScore = 0;
    const answers = quizQuestions.map((question, index) => {
      const answer = userAnswers[index];
      const isCorrect = answer === question.correctAnswer;
      if (isCorrect) calculatedScore++;

      return {
        questionId: question._id,
        answer,
        isCorrect,
      };
    });

    const payload = {
      userId,
      quizId,
      answers,
      score: calculatedScore,
    };

    setScore(calculatedScore);
    setQuizSubmitted(true);

    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/quizzes/submit`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Quiz submitted:', res.data);
    } catch (error) {
      console.error('Quiz submission error:', error);
      setErrorMessage(
        error?.response?.data?.message || 'Failed to submit quiz results.'
      );
    }
  };

  // Start new quiz
  const handleNewQuiz = () => {
    fetchQuiz();
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
  };

  const handleLevelChange = (e) => {
    const lvl = e.target.value;
    setLevel(lvl);
    localStorage.setItem('selectedLevel', lvl);
  };

  // Calculate how many questions have been answered
  const answeredQuestions = userAnswers.filter(answer => answer !== '').length;

  // Check if all questions are answered
  const allAnswered = answeredQuestions === quizQuestions.length;

  // Set gradients for different levels
  const getLevelColor = () => {
    switch (level) {
      case 'Beginner':
        return 'linear-gradient(45deg, #30A197, #102D2A)';
      case 'Intermediate':
        return 'linear-gradient(45deg,  #43cea2, #185a9d)';
      case 'Advanced':
        return 'linear-gradient(45deg, #c5acf3ff, #2a0845)';
      default:
        return 'linear-gradient(45deg, #30A197, #102D2A)';
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card 
            className="shadow-lg rounded-4 border-0 overflow-hidden"
            style={{ 
              background: quizStarted ? '#ffffff' : getLevelColor(),
              transition: 'all 0.3s ease-in-out'
            }}
          >
            {!quizStarted && (
              <div className="text-white p-4 text-center">
                <h2 className="display-6 mb-3 fw-bold">Language Quiz</h2>
                <p className="lead mb-0">Test your knowledge and improve your skills</p>
              </div>
            )}
            
            <Card.Body className={`p-4 ${quizStarted ? '' : 'bg-white rounded-top-0 rounded-bottom-3'}`}>
              <h3 className="text-center mb-4" style={{ 
                color: quizStarted ? '#333' : '#333',
                borderBottom: '2px solid #eee',
                paddingBottom: '15px'
              }}>
                {quizStarted ? (
                  <>
                    <span className="badge bg-primary me-2">{language}</span>
                    <span className="badge bg-secondary">{level}</span>
                  </>
                ) : (
                  'Choose Your Quiz'
                )}
              </h3>

              {errorMessage && (
                <Alert variant="danger" className="border-0 shadow-sm">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errorMessage}
                </Alert>
              )}

              {!quizStarted && (
                <Row className="mb-4 gy-3">
                  <Col md={6}>
                    <Form.Group controlId="languageSelect">
                      <Form.Label className="fw-bold text-secondary">Select Language</Form.Label>
                      <Form.Select 
                        value={language} 
                        onChange={handleLanguageChange} 
                        className="form-select-lg shadow-sm border-0"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                        <option>Kannada</option>
                        <option>Hindi</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="levelSelect">
                      <Form.Label className="fw-bold text-secondary">Select Level</Form.Label>
                      <Form.Select 
                        value={level} 
                        onChange={handleLevelChange} 
                        className="form-select-lg shadow-sm border-0"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {quizStarted && !quizSubmitted && (
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="text-secondary">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </div>
                    <div className="text-secondary">
                      {answeredQuestions} of {quizQuestions.length} answered
                    </div>
                  </div>
                  <ProgressBar 
                    now={(currentQuestion + 1) / quizQuestions.length * 100} 
                    variant="info" 
                    className="rounded-pill" 
                    style={{ height: '8px' }}
                  />
                </div>
              )}

              {quizStarted ? (
                <>
                  <Form onSubmit={handleSubmitQuiz}>
                    {quizQuestions.map((question, index) => {
                      const isCorrect = userAnswers[index] === question.correctAnswer;
                      const hasAnswered = userAnswers[index] !== '';

                      // Only show current question if not submitted yet
                      if (!quizSubmitted && index !== currentQuestion) return null;
                      
                      return (
                        <div 
                          key={index}
                          className={`question-container ${quizSubmitted ? 'mb-4 pb-3 border-bottom' : ''}`}
                          style={{ 
                            display: quizSubmitted || index === currentQuestion ? 'block' : 'none',
                            animation: 'fadeIn 0.5s ease'
                          }}
                        >
                          <Form.Group className="mb-4">
                            <div className="question-header d-flex align-items-center mb-2">
                              <div 
                                className="question-number me-3 d-flex align-items-center justify-content-center rounded-circle" 
                                style={{ 
                                  width: '36px', 
                                  height: '36px', 
                                  backgroundColor: '#f8f9fa',
                                  border: '2px solid #dee2e6'
                                }}
                              >
                                <span className="fw-bold">{index + 1}</span>
                              </div>
                              <Form.Label className="fw-bold mb-0 fs-5">
                                {question.question}
                                {quizSubmitted && hasAnswered && (
                                  <Badge
                                    bg={isCorrect ? 'success' : 'danger'}
                                    className="ms-2 align-middle"
                                  >
                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                  </Badge>
                                )}
                              </Form.Label>
                            </div>
                            
                            <div className="ps-5 mt-3">
                              {question.options.map((option, i) => (
                                <div key={i} className="mb-2">
                                  <Form.Check
                                    type="radio"
                                    id={`question-${index}-option-${i}`}
                                    name={`question-${index}`}
                                    label={option}
                                    value={option}
                                    checked={userAnswers[index] === option}
                                    onChange={(e) => handleAnswerChange(e, index)}
                                    disabled={quizSubmitted}
                                    className="option-radio fs-5"
                                    style={{ 
                                      padding: '10px 15px',
                                      borderRadius: '8px',
                                      backgroundColor: quizSubmitted 
                                        ? option === question.correctAnswer 
                                          ? '#d4edda' 
                                          : userAnswers[index] === option 
                                            ? '#f8d7da' 
                                            : '#f8f9fa'
                                        : '#f8f9fa',
                                      border: quizSubmitted 
                                        ? option === question.correctAnswer 
                                          ? '1px solid #c3e6cb' 
                                          : userAnswers[index] === option 
                                            ? '1px solid #f5c6cb' 
                                            : '1px solid #dee2e6'
                                        : '1px solid #dee2e6',
                                      transition: 'all 0.2s ease'
                                    }}
                                  />
                                </div>
                              ))}
                              
                              {quizSubmitted && (
                                <div className="mt-3 p-3 bg-light rounded">
                                  <div className="fw-bold text-success mb-1">Correct Answer:</div>
                                  <div>{question.correctAnswer}</div>
                                </div>
                              )}
                            </div>
                          </Form.Group>
                        </div>
                      );
                    })}

                    {quizStarted && !quizSubmitted && (
                      <div className="d-flex justify-content-between mt-4">
                        <Button 
                          variant="outline-secondary" 
                          onClick={handlePrevQuestion}
                          disabled={currentQuestion === 0}
                          className="px-4"
                        >
                          <i className="bi bi-arrow-left me-2"></i>
                          Previous
                        </Button>
                        
                        {currentQuestion < quizQuestions.length - 1 ? (
                          <Button 
                            variant="primary" 
                            onClick={handleNextQuestion}
                            className="px-4"
                          >
                            Next
                            <i className="bi bi-arrow-right ms-2"></i>
                          </Button>
                        ) : (
                          <Button 
                            variant="success" 
                            type="submit"
                            className="px-4"
                            disabled={!allAnswered}
                          >
                            Submit Quiz
                            <i className="bi bi-check2-all ms-2"></i>
                          </Button>
                        )}
                      </div>
                    )}
                  </Form>

                  {quizSubmitted && (
                    <div className="result-container mt-4 text-center p-4 rounded-3" style={{
                      background: `linear-gradient(to right, ${score / quizQuestions.length >= 0.7 ? '#43cea2, #185a9d' : '#ff9966, #ff5e62'})`,
                    }}>
                      <div className="score-circle mb-3 mx-auto d-flex align-items-center justify-content-center" style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: 'white',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                      }}>
                        <div>
                          <div className="display-4 fw-bold text-primary">{score}</div>
                          <div className="text-secondary">out of {quizQuestions.length}</div>
                        </div>
                      </div>
                      
                      <h4 className="text-white mt-3">
                        {score / quizQuestions.length >= 0.8 
                          ? '🎉 Excellent!' 
                          : score / quizQuestions.length >= 0.6 
                            ? '👍 Good job!' 
                            : '💪 Keep practicing!'}
                      </h4>
                      
                      <div className="mt-4">
                        <Button 
                          variant="light" 
                          onClick={handleNewQuiz} 
                          className="btn-lg px-4 fw-bold"
                        >
                          <i className="bi bi-arrow-repeat me-2"></i>
                          Try Another Quiz
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center mt-4 mb-2">
                  {loading ? (
                    <div>
                      <Spinner animation="border" variant="primary" className="mb-2" />
                      <p className="text-muted">Loading your questions...</p>
                    </div>
                  ) : (
                    <Button 
                      variant="primary" 
                      onClick={fetchQuiz} 
                      size="lg" 
                      className="btn-lg px-5 py-3 fw-bold shadow-sm"
                      style={{
                        background: getLevelColor(),
                        border: 'none',
                        borderRadius: '50px'
                      }}
                    >
                      <i className="bi bi-play-fill me-2"></i>
                      Start Quiz
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .option-radio:hover {
          background-color: #e9ecef !important;
          cursor: pointer;
        }
      `}</style>
    </Container>
  );
};

export default QuizPage;