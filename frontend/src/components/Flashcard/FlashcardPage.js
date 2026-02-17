import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Form, Spinner, Button, Badge } from 'react-bootstrap';
import { FaGlobeAmericas, FaVolumeUp, FaSyncAlt, FaInfoCircle, FaArrowRight, FaCheck } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const FlashcardPage = () => {
  const [language, setLanguage] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState({});
  const [mastered, setMastered] = useState({});
  const [theme, setTheme] = useState('blue');
  const [showInfo, setShowInfo] = useState(false);

  const langCodeMap = {
    Spanish: 'es-ES', English: 'en-US', Mandarin: 'zh-CN', Hindi: 'hi-IN',
    Arabic: 'ar-SA', Kannada: 'kn-IN', Bengali: 'bn-IN', Portuguese: 'pt-PT', Russian: 'ru-RU',
    Japanese: 'ja-JP', Punjabi: 'pa-IN', German: 'de-DE', Javanese: 'jv-ID',
    'Wu Chinese': 'zh-CN', Telugu: 'te-IN', French: 'fr-FR', Marathi: 'mr-IN', Tamil: 'ta-IN'
  };

  const languages = Object.keys(langCodeMap);

  // Themes for cards
  const themes = {
    blue: {
      gradient: 'linear-gradient(135deg, #30A197, #102D2A)',
      bgLight: '#e6f7ff',
      accent: '#0099ff',
      text: '#003366'
    },
    purple: {
      gradient: 'linear-gradient(135deg, #30A197, #102D2A)',
      bgLight: '#f5f3ff',
      accent: '#0b5953ff',
      text: '#0b5953ff'
    },
    green: {
      gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
      bgLight: '#ecfdf5',
      accent: '#10b981',
      text: '#064e3b'
    },
    orange: {
      gradient: 'linear-gradient(135deg, #fda085 0%, #f6d365 100%)',
      bgLight: '#fff7ed',
      accent: '#f97316',
      text: '#7c2d12'
    }
  };

  useEffect(() => {
    // Cycle through themes based on selected language
    if (language) {
      const themeKeys = Object.keys(themes);
      const themeIndex = languages.indexOf(language) % themeKeys.length;
      setTheme(themeKeys[themeIndex]);
    }
  }, [language]);

  const fetchFlashcards = async (selectedLanguage) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/flashcards', { language: selectedLanguage });
      setFlashcards(response.data);
      setFlippedCards({});
      setMastered({});
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    if (selectedLang) fetchFlashcards(selectedLang);
    else setFlashcards([]);
  };

  const toggleFlip = (index) => {
    setFlippedCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleMastered = (e, index) => {
    e.stopPropagation();
    setMastered((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const speakText = (text, lang = 'en-US') => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    synth.cancel();
    synth.speak(utterance);
  };

  const refreshCards = () => {
    if (language) fetchFlashcards(language);
  };

  const currentTheme = themes[theme];
  const masteredCount = Object.values(mastered).filter(Boolean).length;

  return (
    <Container fluid className="py-5 min-vh-100" style={{ 
      background: `linear-gradient(180deg, ${currentTheme.bgLight} 0%, #ffffff 100%)`,
      backgroundAttachment: 'fixed' 
    }}>
      <style>{`
        @keyframes floatIn {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .language-card {
          animation: floatIn 0.6s ease-out;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
          border-radius: 16px;
          border: none;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .language-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.12);
        }
        
        .flashcard {
          perspective: 1000px;
          cursor: pointer;
          height: 220px;
          animation: floatIn 0.6s ease-out;
          animation-fill-mode: both;
        }
        
        .flashcard-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          transform-style: preserve-3d;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .flipped .flashcard-inner {
          transform: rotateY(180deg);
        }
        
        .flashcard-front, .flashcard-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 1.5rem;
          border-radius: 1rem;
        }
        
        .flashcard-front {
          background-color: #fff;
          border: 2px solid rgba(0, 0, 0, 0.05);
        }
        
        .flashcard-back {
          transform: rotateY(180deg);
          border: 2px solid rgba(0, 0, 0, 0.05);
        }
        
        .flashcard:hover .flashcard-inner {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        
        .speak-btn {
          transition: all 0.3s ease;
          opacity: 0.85;
        }
        
        .speak-btn:hover {
          transform: scale(1.1);
          opacity: 1;
        }
        
        .refresh-btn {
          transition: all 0.3s ease;
        }
        
        .refresh-btn:hover {
          transform: rotate(180deg);
        }
        
        .mastered {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
        }
        
        .mastered-card .flashcard-inner {
          box-shadow: 0 0 0 3px ${currentTheme.accent}, 0 10px 20px rgba(0, 0, 0, 0.1);
        }
        
        .language-selector {
          background-size: 200% 100%;
          background-image: linear-gradient(to right, #f8f9fa 0%, ${currentTheme.bgLight} 50%, #f8f9fa 100%);
          animation: shimmer 3s infinite;
          transition: all 0.3s ease;
        }
        
        .language-selector:focus {
          background-image: linear-gradient(to right, #f8f9fa 0%, ${currentTheme.bgLight} 50%, #f8f9fa 100%);
          border-color: ${currentTheme.accent};
          box-shadow: 0 0 0 0.25rem rgba(${currentTheme.accent.replace(/[^\d,]/g, '')}, 0.25);
        }
        
        .progress-wrapper {
          height: 8px;
          background-color: rgba(0,0,0,0.05);
          border-radius: 4px;
          overflow: hidden;
          margin: 1rem 0;
        }
        
        .progress-bar {
          height: 100%;
          background: ${currentTheme.gradient};
          transition: width 0.6s ease;
        }
        
        .info-box {
          background-color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border-left: 4px solid ${currentTheme.accent};
          padding: 15px;
          margin-bottom: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          animation: floatIn 0.5s ease-out;
        }
        
        .bounce-in {
          animation: bounceIn 0.5s;
        }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .card-count {
          font-size: 0.9rem;
          background: ${currentTheme.bgLight};
          color: ${currentTheme.text};
          border-radius: 20px;
          padding: 5px 12px;
          margin-top: 10px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }
      `}</style>

      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <Card className="language-card mb-4 p-4">
            <div className="text-center mb-4">
              <div className="icon-wrapper mb-3" style={{ 
                background: currentTheme.gradient,
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                boxShadow: `0 10px 20px rgba(${currentTheme.accent.replace(/[^\d,]/g, '')}, 0.3)`
              }}>
                <FaGlobeAmericas size={40} className="text-white" />
              </div>
              <h2 className="fw-bold mb-1" style={{ color: currentTheme.text }}>Language Flashcards</h2>
              <p className="text-muted mb-0">Improve your vocabulary with interactive flashcards</p>
              
              <div className="d-flex align-items-center justify-content-center mt-2">
                <Button 
                  variant="link" 
                  className="p-0 text-muted"
                  onClick={() => setShowInfo(!showInfo)}
                >
                  <FaInfoCircle className="me-1" /> {showInfo ? 'Hide tips' : 'How to use'}
                </Button>
              </div>
            </div>
            
            {showInfo && (
              <div className="info-box mb-4">
                <h6 className="fw-bold" style={{ color: currentTheme.text }}>How to use flashcards:</h6>
                <ul className="mb-0 ps-3">
                  <li>Click on a card to see the translation</li>
                  <li>Use the speaker button to hear pronunciation</li>
                  <li>Mark cards as mastered when you've learned them</li>
                  <li>Click the refresh button to get new flashcards</li>
                </ul>
              </div>
            )}

            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold" style={{ color: currentTheme.text }}>
                  Select a language to learn
                </Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={language}
                    onChange={handleLanguageChange}
                    className="py-3 language-selector shadow-sm rounded-3"
                    style={{ paddingRight: '40px' }}
                  >
                    <option value="">-- Choose Language --</option>
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </Form.Select>
                  <div 
                    className="position-absolute" 
                    style={{ right: '15px', top: '50%', transform: 'translateY(-50%)' }}
                  >
                    <FaArrowRight 
                      style={{ color: language ? currentTheme.accent : '#adb5bd' }}
                    />
                  </div>
                </div>
              </Form.Group>
            </Form>
            
            {language && flashcards.length > 0 && (
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">
                    Mastered: {masteredCount} of {flashcards.length}
                  </small>
                  <div className="d-flex align-items-center">
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="refresh-btn border-0"
                      onClick={refreshCards}
                      title="Get new flashcards"
                    >
                      <FaSyncAlt />
                    </Button>
                  </div>
                </div>
                <div className="progress-wrapper">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(masteredCount / flashcards.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center mt-5">
          <div style={{ 
            background: 'white',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <Spinner animation="border" style={{ color: currentTheme.accent }} />
          </div>
          <p className="mt-3" style={{ color: currentTheme.text }}>
            Preparing your flashcards...
          </p>
        </div>
      ) : (
        <Row className="mt-4 justify-content-center g-4">
          {flashcards.length > 0 ? (
            <>
              {language && (
                <Col xs={12} className="text-center mb-2">
                  <div className="card-count">
                    <span>{flashcards.length}</span> flashcards for <span className="fw-bold">{language}</span>
                  </div>
                </Col>
              )}
              
              {flashcards.map((card, index) => (
                <Col key={index} xs={12} sm={6} md={4} lg={3} 
                  style={{ 
                    animationDelay: `${index * 0.05}s`,
                    opacity: mastered[index] ? 0.85 : 1
                  }}
                >
                  <div 
                    className={`flashcard ${flippedCards[index] ? 'flipped' : ''} ${mastered[index] ? 'mastered-card' : ''}`} 
                    onClick={() => toggleFlip(index)}
                  >
                    <div className="mastered">
                      {mastered[index] ? (
                        <Badge 
                          bg="success"
                          className="bounce-in"
                          onClick={(e) => toggleMastered(e, index)}
                          style={{ cursor: 'pointer' }}
                        >
                          <FaCheck className="me-1" /> Mastered
                        </Badge>
                      ) : (
                        <Badge 
                          bg="light" 
                          text="dark"
                          className="border"
                          onClick={(e) => toggleMastered(e, index)}
                          style={{ cursor: 'pointer' }}
                        >
                          Mark as mastered
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flashcard-inner rounded-4">
                      <div className="flashcard-front">
                        <h3 className="fw-bold mb-4" style={{ color: currentTheme.text }}>
                          {card.englishWord}
                        </h3>
                        <div className="d-flex align-items-center">
                          <Button
                            style={{ 
                              background: currentTheme.gradient,
                              border: 'none'
                            }}
                            className="rounded-circle speak-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(card.englishWord, 'en-US');
                            }}
                          >
                            <FaVolumeUp />
                          </Button>
                          <span className="ms-2 text-muted small">Tap to flip</span>
                        </div>
                      </div>
                      <div className="flashcard-back" style={{ background: currentTheme.gradient }}>
                        <h3 className="fw-bold mb-4 text-white">
                          {card.translatedWord}
                        </h3>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="light"
                            className="rounded-circle speak-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakText(card.translatedWord, langCodeMap[language] || 'en-US');
                            }}
                          >
                            <FaVolumeUp style={{ color: currentTheme.accent }} />
                          </Button>
                          <span className="ms-2 text-white small">Tap to flip back</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))
            }
            </>
          ) : (
            language && (
              <Col xs={12} className="text-center mt-4">
                <div className="info-box">
                  <FaInfoCircle className="me-2 text-primary" />
                  <span>No flashcards found for this language. Please try another language.</span>
                </div>
              </Col>
            )
          )}
        </Row>
      )}
    </Container>
  );
};

export default FlashcardPage;