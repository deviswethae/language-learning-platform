import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Spinner,
  Row,
  Col,
  Alert,
  Form
} from 'react-bootstrap';
import {
  FaMicrophone,
  FaStop,
  FaVolumeUp,
  FaRobot,
  FaRegTrashAlt,
  FaUser,
  FaComment,
  FaExclamationTriangle,
  FaHistory,
  FaCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userSpeech, setUserSpeech] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [volume, setVolume] = useState(80);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // CSS styles directly in component
  const styles = {
    mainContainer: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '20px'
    },
    mainCard: {
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      borderRadius: '16px',
      border: 'none'
    },
    cardHeader: {
      background: 'linear-gradient(135deg, #30A197, #102D2A)',
      borderTopLeftRadius: '16px',
      borderTopRightRadius: '16px',
      color: 'white',
      padding: '20px'
    },
    cardTitle: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    robotIcon: {
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      padding: '8px',
      marginRight: '15px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
    },
    micButton: {
      padding: '15px 30px',
      borderRadius: '50px',
      fontWeight: 'bold',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontSize: '18px',
      transition: 'all 0.3s ease'
    },
    clearButton: {
      borderRadius: '50px',
      fontWeight: 'bold',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    },
    userCard: {
      borderRadius: '15px',
      border: 'none',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
      background: '#E7F3FF',
      marginBottom: '20px',
      position: 'relative',
      paddingLeft: '20px'
    },
    userCardBefore: {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      width: '6px',
      background: '#4A90E2',
      borderTopLeftRadius: '15px',
      borderBottomLeftRadius: '15px'
    },
    aiCard: {
      borderRadius: '15px',
      border: 'none',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
      background: '#F0FFF0',
      marginBottom: '20px',
      position: 'relative',
      paddingLeft: '20px'
    },
    aiCardBefore: {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      width: '6px',
      background: '#2ECC71',
      borderTopLeftRadius: '15px',
      borderBottomLeftRadius: '15px'
    },
    volumeSlider: {
      padding: '20px',
      background: '#f8f9fa',
      borderRadius: '10px',
      marginBottom: '20px'
    },
    statusIndicator: {
      display: 'inline-block',
      marginRight: '10px',
      animation: 'pulse 1.5s infinite'
    },
    pulseAnimation: {
      '@keyframes pulse': {
        '0%': { opacity: 0.5 },
        '50%': { opacity: 1 },
        '100%': { opacity: 0.5 }
      }
    },
    cardFooter: {
      borderTop: '1px solid #eaeaea',
      padding: '15px 20px',
      color: '#6c757d',
      fontSize: '14px',
      borderBottomLeftRadius: '16px',
      borderBottomRightRadius: '16px'
    },
    emptyState: {
      padding: '40px 0',
      textAlign: 'center',
      color: '#6c757d'
    }
  };

  // Start speech recognition
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech Recognition is not supported in your browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setUserSpeech(transcript);
      setIsListening(false);

      try {
        const res = await fetch('http://localhost:5000/api/voiceAssistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: transcript })
        });

        if (!res.ok) throw new Error('AI server error');

        const data = await res.json();
        const reply = data.reply || 'Sorry, I could not understand.';
        setAiResponse(reply);
        speak(reply);
      } catch (err) {
        console.error(err);
        setError('Failed to get AI response.');
      }
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      setError('Speech recognition error: ' + e.error);
    };

    recognition.onend = () => setIsListening(false);
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    window.speechSynthesis.cancel();
    setIsListening(false);
    setIsSpeaking(false);
  };

  // Speak the AI's response
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.volume = volume / 100;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError('Text-to-speech failed.');
    };
    window.speechSynthesis.speak(utterance);
  };

  // Replay the last AI response
  const replayResponse = () => {
    if (aiResponse) {
      speak(aiResponse);
    }
  };

  // Cleanup
  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const resetConversation = () => {
    setUserSpeech('');
    setAiResponse('');
    setError(null);
    stopListening();
  };

  // Get current status
  const getStatusText = () => {
    if (isListening) return { text: 'Listening...', color: '#28a745', icon: <FaMicrophone /> };
    if (isSpeaking) return { text: 'Speaking...', color: '#17a2b8', icon: <FaVolumeUp /> };
    return { text: 'Idle', color: '#6c757d', icon: <FaCircle size={10} /> };
  };

  const status = getStatusText();

  return (
    <div style={styles.mainContainer}>
      <Container className="py-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card style={styles.mainCard}>
            <Card.Header style={styles.cardHeader}>
              <div style={styles.cardTitle}>
                <div style={styles.robotIcon}>
                  <FaRobot size={24} />
                </div>
                AI Voice Assistant
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              {error && (
                <Alert variant="danger" className="d-flex align-items-center mb-4">
                  <FaExclamationTriangle className="me-2" /> {error}
                </Alert>
              )}

              <div className="d-flex justify-content-center mb-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={isListening ? stopListening : startListening}
                    variant={isListening ? 'danger' : 'success'}
                    size="lg"
                    style={styles.micButton}
                  >
                    {isListening ? (
                      <><FaStop className="me-2" /> Stop Listening</>
                    ) : (
                      <><FaMicrophone className="me-2" /> Start Speaking</>
                    )}
                  </Button>
                </motion.div>
              </div>

              <div style={styles.volumeSlider}>
                <div className="d-flex align-items-center mb-2">
                  <FaVolumeUp size={20} className="me-2 text-primary" />
                  <span className="fw-bold">Volume: {volume}%</span>
                </div>
                <Form.Range
                  min={0}
                  max={100}
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="mt-2"
                />
              </div>

              {!userSpeech && !aiResponse ? (
                <div style={styles.emptyState}>
                  <FaComment size={40} className="text-muted mb-3" />
                  <h5>No conversation yet</h5>
                  <p>Press the button above and start speaking to interact with the AI</p>
                </div>
              ) : (
                <div className="conversation-container">
                  {userSpeech && (
                    <div style={styles.userCard} className="p-3">
                      <div style={styles.userCardBefore}></div>
                      <div className="d-flex align-items-center mb-2">
                        <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle p-2 me-2">
                          <FaUser />
                        </div>
                        <strong className="text-primary">You said:</strong>
                      </div>
                      <p className="mb-0">{userSpeech}</p>
                    </div>
                  )}

                  {aiResponse && (
                    <div style={styles.aiCard} className="p-3">
                      <div style={styles.aiCardBefore}></div>
                      <div className="d-flex align-items-center mb-2">
                        <div className="d-flex align-items-center justify-content-center bg-success text-white rounded-circle p-2 me-2">
                          <FaRobot />
                        </div>
                        <strong className="text-success">AI replied:</strong>
                      </div>
                      <p className="mb-0">{aiResponse}</p>
                      
                      <div className="mt-3 d-flex justify-content-end">
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={replayResponse}
                          className="rounded-pill"
                        >
                          <FaVolumeUp className="me-1" /> Play again
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="d-flex justify-content-center mt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline-danger"
                    style={styles.clearButton}
                    onClick={resetConversation}
                    className="px-4 py-2"
                  >
                    <FaRegTrashAlt className="me-2" /> Clear Conversation
                  </Button>
                </motion.div>
              </div>
            </Card.Body>

            <Card.Footer style={styles.cardFooter}>
              <Row>
                <Col className="d-flex align-items-center">
                  <div style={{ ...styles.statusIndicator, color: status.color }}>
                    {status.icon}
                  </div>
                  <span>{status.text}</span>
                </Col>
                <Col className="text-end d-flex align-items-center justify-content-end">
                  <FaHistory className="me-2" />
                  <span>{new Date().toLocaleTimeString()}</span>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </motion.div>
      </Container>
      
      {/* Custom CSS using style tag for animations that can't be done with inline styles */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          
          .conversation-container {
            max-height: 400px;
            overflow-y: auto;
            padding-right: 5px;
          }
          
          .conversation-container::-webkit-scrollbar {
            width: 6px;
          }
          
          .conversation-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          
          .conversation-container::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
          }
          
          .conversation-container::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          
          /* Status indicator animation */
          [class*="FaCircle"], [class*="FaMicrophone"], [class*="FaVolumeUp"] {
            animation: pulse 1.5s infinite;
          }
          
          /* Button hover effects */
          button.btn {
            transition: all 0.3s ease;
          }
          
          button.btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          
          /* Card hover effects */
          ${styles.userCard}, ${styles.aiCard} {
            transition: all 0.3s ease;
          }
          
          ${styles.userCard}:hover, ${styles.aiCard}:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          
          /* Responsive adjustments */
          @media (max-width: 768px) {
            ${styles.cardTitle} {
              font-size: 20px;
            }
            
            ${styles.micButton} {
              padding: 10px 20px;
              font-size: 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default VoiceAssistant;