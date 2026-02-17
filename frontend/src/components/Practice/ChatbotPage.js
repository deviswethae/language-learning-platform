import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
  Badge,
  InputGroup,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';
import axios from 'axios';
import { 
  FiSend, 
  FiTrash2, 
  FiPaperclip,
  FiMessageCircle,
  FiUser,
  FiCpu,
  FiInfo,
  FiMoon,
  FiSun,
  FiX,
  FiFileText,
  FiUploadCloud
} from 'react-icons/fi';

const ChatbotPage = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showFileName, setShowFileName] = useState(false);
  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize dark mode from localStorage if available
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(savedMode === 'true');
    }
  }, []);

  // Apply dark mode to body
  useEffect(() => {
    document.body.className = darkMode ? 'bg-dark text-light' : 'bg-light text-dark';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle file input
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setShowFileName(true);
    }
  };

  // Clear selected file
  const clearFile = () => {
    setFile(null);
    setShowFileName(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Open file dialog
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Send message to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userMessage.trim() && !file) return;

    setLoading(true);

    setChatHistory((prev) => [
      ...prev,
      { 
        role: 'user', 
        message: userMessage || '📎 File uploaded', 
        fileName: file ? file.name : null,
        timestamp: new Date()
      },
    ]);

    try {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      if (userMessage) formData.append('message', userMessage);
      if (file) formData.append('file', file);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/chat`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setChatHistory((prev) => [
        ...prev,
        { 
          role: 'bot', 
          message: response.data.reply,
          timestamp: new Date()
        },
      ]);
    } catch (error) {
      console.error('❌ Error fetching chatbot response:', error);
      setChatHistory((prev) => [
        ...prev,
        { 
          role: 'bot', 
          message: '⚠️ Something went wrong. Please try again.',
          timestamp: new Date()
        },
      ]);
    } finally {
      setLoading(false);
      setUserMessage('');
      setFile(null);
      setShowFileName(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Reset chat
  const clearChat = () => {
    setChatHistory([]);
    setUserMessage('');
    setFile(null);
    setShowFileName(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // CSS variables based on theme
  const theme = {
    cardBg: darkMode ? '#2d3748' : 'white',
    chatboxBg: darkMode ? '#1a202c' : '#f8f9fa',
    userBubbleBg: darkMode ? '#3182ce' : '#0d6efd',
    botBubbleBg: darkMode ? '#4a5568' : '#f0f0f0',
    botTextColor: darkMode ? '#e2e8f0' : '#212529',
    inputBg: darkMode ? '#4a5568' : 'white',
    inputText: darkMode ? 'white' : 'black',
    hoverColor: darkMode ? '#2c5282' : '#0b5ed7',
    boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card 
            className="border-0 rounded-4"
            style={{ 
              backgroundColor: theme.cardBg, 
              boxShadow: theme.boxShadow,
              transition: 'all 0.3s ease'
            }}
          >
            <Card.Header 
              className="d-flex justify-content-between align-items-center py-3 rounded-top-4" 
              style={{ 
                background: 'linear-gradient(135deg, #30A197, #102D2A)',
                color: 'white',
                borderBottom: 'none'
              }}
            >
              <div className="d-flex align-items-center"  >
                <div 
                  className="rounded-circle p-2 me-2" 
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <FiMessageCircle size={24} />
                </div>
                <h3 className="mb-0 fw-bold" >AI Tutor Assistant</h3>
              </div>
              
              <Button 
                variant={darkMode ? "outline-light" : "outline-dark"}
                size="sm"
                className="rounded-circle p-2"
                onClick={() => setDarkMode(!darkMode)}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </Button>
            </Card.Header>

            <Card.Body className="p-4">
              {/* Chat Box */}
              <div
                ref={chatBoxRef}
                className="chat-box mb-4 p-3 rounded-4"
                style={{
                  height: '500px',
                  overflowY: 'auto',
                  backgroundColor: theme.chatboxBg,
                  transition: 'background-color 0.3s ease',
                  scrollbarWidth: 'thin',
                  scrollbarColor: `${theme.userBubbleBg} ${theme.chatboxBg}`
                }}
              >
                {chatHistory.length === 0 && !loading && (
                  <div className="empty-state text-center py-5">
                    <div 
                      className="icon-container mx-auto mb-3 rounded-circle d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        color: theme.userBubbleBg
                      }}
                    >
                      <FiMessageCircle size={40} />
                    </div>
                    <h5 style={{ color: darkMode ? '#a0aec0' : '#6c757d' }}>Welcome to AI Tutor</h5>
                    <p style={{ color: darkMode ? '#718096' : '#6c757d' }}>
                      Ask a question to get started ✨
                    </p>
                  </div>
                )}

                {chatHistory.map((entry, index) => (
                  <div
                    key={index}
                    className={`d-flex mb-4 ${
                      entry.role === 'user' ? 'justify-content-end' : 'justify-content-start'
                    }`}
                  >
                    {/* Bot Avatar (only for bot messages) */}
                    {entry.role === 'bot' && (
                      <div 
                        className="avatar rounded-circle d-flex justify-content-center align-items-center me-2"
                        style={{ 
                          minWidth: '38px', 
                          height: '38px', 
                          backgroundColor: theme.userBubbleBg,
                          color: 'white'
                        }}
                      >
                        <FiCpu size={18} />
                      </div>
                    )}
                    
                    <div
                      className={`message-bubble p-3 rounded-4`}
                      style={{ 
                        maxWidth: '75%',
                        backgroundColor: entry.role === 'user' ? theme.userBubbleBg : theme.botBubbleBg,
                        color: entry.role === 'user' ? 'white' : theme.botTextColor,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        position: 'relative',
                        borderTopRightRadius: entry.role === 'user' ? '0' : '1rem',
                        borderTopLeftRadius: entry.role === 'bot' ? '0' : '1rem'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="fw-bold">
                          {entry.role === 'user' ? 'You' : 'AI Tutor'}
                        </div>
                        <small style={{ opacity: 0.7 }}>
                          {formatTime(entry.timestamp)}
                        </small>
                      </div>
                      
                      {entry.role === 'bot' ? (
                        <div
                          className="message-content"
                          dangerouslySetInnerHTML={{ __html: entry.message }}
                        />
                      ) : (
                        <div className="message-content">
                          {entry.message}
                          {entry.fileName && (
                            <div className="file-attachment mt-2 p-2 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                              <FiFileText className="me-2" />
                              {entry.fileName}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* User Avatar (only for user messages) */}
                    {entry.role === 'user' && (
                      <div 
                        className="avatar rounded-circle d-flex justify-content-center align-items-center ms-2"
                        style={{ 
                          minWidth: '38px', 
                          height: '38px', 
                          backgroundColor: '#6c757d',
                          color: 'white'
                        }}
                      >
                        <FiUser size={18} />
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="d-flex justify-content-start mb-4">
                    <div 
                      className="avatar rounded-circle d-flex justify-content-center align-items-center me-2"
                      style={{ 
                        minWidth: '38px', 
                        height: '38px', 
                        backgroundColor: theme.userBubbleBg,
                        color: 'white'
                      }}
                    >
                      <FiCpu size={18} />
                    </div>
                    <div 
                      className="message-bubble p-3 rounded-4"
                      style={{ 
                        backgroundColor: theme.botBubbleBg,
                        color: theme.botTextColor,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        maxWidth: '75%',
                        borderTopLeftRadius: '0'
                      }}
                    >
                      <div className="fw-bold mb-2">AI Tutor</div>
                      <div className="typing-indicator d-flex align-items-center">
                        <span className="dot" style={{ backgroundColor: darkMode ? '#a0aec0' : '#6c757d' }}></span>
                        <span className="dot" style={{ backgroundColor: darkMode ? '#a0aec0' : '#6c757d' }}></span>
                        <span className="dot" style={{ backgroundColor: darkMode ? '#a0aec0' : '#6c757d' }}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* File preview */}
              {showFileName && file && (
                <div 
                  className="file-preview mb-3 p-3 rounded-3 d-flex justify-content-between align-items-center"
                  style={{ 
                    backgroundColor: darkMode ? '#2d3748' : '#e9ecef',
                    color: darkMode ? '#e2e8f0' : '#212529',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <FiFileText size={20} className="me-2" />
                    <span className="text-truncate" style={{ maxWidth: '250px' }}>{file.name}</span>
                    <Badge 
                      bg={darkMode ? "info" : "primary"} 
                      pill
                      className="ms-2"
                    >
                      {(file.size / 1024).toFixed(0)} KB
                    </Badge>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-decoration-none p-0 ms-2"
                    onClick={clearFile}
                    style={{ color: darkMode ? '#e2e8f0' : '#dc3545' }}
                  >
                    <FiX size={20} />
                  </Button>
                </div>
              )}

              {/* Message Form */}
              <Form onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    className="py-2"
                    style={{ 
                      backgroundColor: theme.inputBg, 
                      color: theme.inputText,
                      borderRadius: '20px 0 0 20px',
                      border: darkMode ? '1px solid #4a5568' : '1px solid #ced4da',
                      fontSize: '16px',
                      height: '50px'
                    }}
                  />
                  
                  {/* Hidden file input */}
                  <Form.Control
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    style={{ display: 'none' }}
                  />
                  
                  {/* File attachment button */}
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Attach File</Tooltip>}
                  >
                    <Button
                      variant={darkMode ? "outline-light" : "outline-secondary"}
                      onClick={triggerFileInput}
                      style={{ 
                        borderRadius: '0',
                        height: '50px',
                        borderLeft: 'none',
                        borderRight: 'none'
                      }}
                    >
                      <FiPaperclip size={20} />
                    </Button>
                  </OverlayTrigger>
                  
                  {/* Send message button */}
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading}
                    className="d-flex align-items-center justify-content-center px-4"
                    style={{ 
                      borderRadius: '0 20px 20px 0', 
                      height: '50px',
                      transition: 'all 0.2s ease',
                      background: 'linear-gradient(135deg, #30A197, #102D2A)',
                      borderColor: theme.userBubbleBg
                    }}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <FiSend className="me-2" />
                        Send
                      </>
                    )}
                  </Button>
                </InputGroup>

                {/* Action buttons row */}
                <div className="d-flex justify-content-between">
                  <Button
                    variant="danger"
                    onClick={clearChat}
                    className="d-flex align-items-center justify-content-center px-4"
                    style={{ 
                      borderRadius: '20px', 
                      transition: 'all 0.2s ease',
                      opacity: chatHistory.length ? '1' : '0.6'
                    }}
                    disabled={chatHistory.length === 0}
                  >
                    <FiTrash2 className="me-2" />
                    Clear Chat
                  </Button>
                  
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Upload documents to analyze or ask questions about them</Tooltip>}
                  >
                    <Button
                      variant="info"
                      className="d-flex align-items-center justify-content-center px-4 text-white"
                      onClick={triggerFileInput}
                      style={{ borderRadius: '20px', transition: 'all 0.2s ease' }}
                    >
                      <FiUploadCloud className="me-2" />
                      Upload Document
                    </Button>
                  </OverlayTrigger>
                </div>
              </Form>
            </Card.Body>
            
            <Card.Footer
              className="text-muted py-3 text-center"
              style={{ 
                backgroundColor: darkMode ? '#2d3748' : '#f8f9fa',
                color: darkMode ? '#a0aec0' : '#6c757d',
                borderTop: darkMode ? '1px solid #4a5568' : '1px solid #ced4da'
              }}
            >
              <div className="d-flex justify-content-center align-items-center">
                <FiInfo size={18} className="me-2" />
                <span>Ask questions or upload documents for the AI to analyze</span>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* Custom CSS for animations and effects */}
      <style>
        {`
          /* Custom scrollbar styles */
          .chat-box::-webkit-scrollbar {
            width: 6px;
          }
          
          .chat-box::-webkit-scrollbar-track {
            background: ${darkMode ? '#1a202c' : '#f1f1f1'};
          }
          
          .chat-box::-webkit-scrollbar-thumb {
            background: ${darkMode ? '#4a5568' : '#c1c1c1'};
            border-radius: 10px;
          }
          
          .chat-box::-webkit-scrollbar-thumb:hover {
            background: ${darkMode ? '#718096' : '#a1a1a1'};
          }
          
          /* Typing indicator animation */
          .typing-indicator {
            display: flex;
            align-items: center;
          }
          
          .dot {
            height: 8px;
            width: 8px;
            border-radius: 50%;
            margin: 0 3px;
            display: inline-block;
            animation: typing 1.5s infinite ease-in-out;
          }
          
          .dot:nth-child(1) {
            animation-delay: 0s;
          }
          
          .dot:nth-child(2) {
            animation-delay: 0.2s;
          }
          
          .dot:nth-child(3) {
            animation-delay: 0.4s;
          }
          
          @keyframes typing {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-8px);
            }
            100% {
              transform: translateY(0px);
            }
          }
          
          /* Button hover effects */
          button:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          
          /* Message appear animation */
          .message-bubble {
            animation: appear 0.3s ease-out;
          }
          
          @keyframes appear {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Improve focus styles for accessibility */
          .form-control:focus, .btn:focus {
            box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
            outline: none;
          }
          
          /* Transitions for theme change */
          body, div, button, input {
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
          }
          
          /* Make text more readable in dark mode */
          ${darkMode ? `
            .message-content {
              line-height: 1.6;
            }
          ` : ''}
          
          /* Responsive adjustments */
          @media (max-width: 576px) {
            .message-bubble {
              max-width: 85%;
            }
            
            .chat-box {
              height: 400px;
            }
          }
        `}
      </style>
    </Container>
  );
};

export default ChatbotPage;