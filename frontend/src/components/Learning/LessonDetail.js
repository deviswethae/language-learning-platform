import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Button,
  Alert,
  Spinner,
  Badge,
  Row,
  Col,
  Card,
  ProgressBar,
  Form,
  Collapse,
  ListGroup,
  Tooltip,
  OverlayTrigger,
  Toast,
  ToastContainer
} from 'react-bootstrap';
import lessonsData from '../data/lessons.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { 
  FaBookmark, 
  FaCheck, 
  FaChevronLeft, 
  FaChevronRight, 
  FaEdit, 
  FaEye, 
  FaList, 
  FaNotesMedical, 
  FaPlay, 
  FaSave, 
  FaTimes, 
  FaBookOpen,
  FaLightbulb
} from 'react-icons/fa';

const LessonDetail = () => {
  const { language, level, lessonId } = useParams();
  const navigate = useNavigate();
  const notesRef = useRef(null);

  // State management
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [showLessonList, setShowLessonList] = useState(false);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showNotes, setShowNotes] = useState(false);

  // Load lesson data and completion status
  useEffect(() => {
    const lessonList = lessonsData[language]?.[level];
    
    if (lessonList) {
      setAllLessons(lessonList);
      const index = lessonList.findIndex((l) => l.id === lessonId);
      
      if (index !== -1) {
        setLesson(lessonList[index]);
        setCurrentIndex(index);
        setTotalLessons(lessonList.length);
        
        // Load completed lessons from localStorage
        const savedCompletedLessons = JSON.parse(
          localStorage.getItem(`completedLessons_${language}_${level}`)
        ) || [];
        setCompletedLessons(savedCompletedLessons);
        
        // Check if current lesson is completed
        setCompleted(savedCompletedLessons.includes(lessonId));
        
        // Load saved notes for this lesson
        const savedNotes = localStorage.getItem(`notes_${language}_${level}_${lessonId}`);
        if (savedNotes) {
          setNotes(savedNotes);
        }
        
        setIsLoading(false);
      }
    }
  }, [language, level, lessonId]);

  const handleIframeLoad = () => {
    setTimeout(() => {
      const iframe = document.getElementById('lessonVideo');
      if (!iframe?.contentWindow) {
        setVideoError(true);
      }
    }, 2500);
  };

  const navigateToLesson = (id) => {
    navigate(`/lessons/${language}/${level}/${id}`);
    setShowLessonList(false);
  };

  const handleNextLesson = () => {
    if (currentIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentIndex + 1];
      navigateToLesson(nextLesson.id);
    }
  };

  const handlePreviousLesson = () => {
    if (currentIndex > 0) {
      const prevLesson = allLessons[currentIndex - 1];
      navigateToLesson(prevLesson.id);
    }
  };

  const handleBack = () => {
    navigate(`/lessons/${language}/${level}`);
  };

  // Mark lesson as completed
  const handleComplete = async () => {
    let updatedCompletedLessons;
    
    if (completedLessons.includes(lessonId)) {
      // Remove from completed lessons
      updatedCompletedLessons = completedLessons.filter(id => id !== lessonId);
      setCompleted(false);
      setToastMessage('Lesson marked as incomplete');
    } else {
      // Add to completed lessons
      updatedCompletedLessons = [...completedLessons, lessonId];
      setCompleted(true);
      setToastMessage('Lesson marked as completed');
    }
    
    // Update state
    setCompletedLessons(updatedCompletedLessons);
    
    // Save to localStorage
    localStorage.setItem(
      `completedLessons_${language}_${level}`, 
      JSON.stringify(updatedCompletedLessons)
    );
    
    // Show toast notification
    setShowToast(true);
    
    // API call (if backend is ready)
    try {
      await axios.post(
        '/api/lessons/complete',
        { 
          lessonId, 
          language, 
          level, 
          completed: !completedLessons.includes(lessonId) 
        },
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Error updating lesson completion status:', error);
    }
  };

  // Save notes
  const handleSaveNotes = () => {
    setIsSaving(true);
    
    // Save to localStorage
    localStorage.setItem(`notes_${language}_${level}_${lessonId}`, notes);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('Notes saved successfully');
      setShowToast(true);
    }, 600);
  };

  const toggleNotes = () => {
    setShowNotes(!showNotes);
    // Focus on notes textarea when opened
    if (!showNotes) {
      setTimeout(() => {
        notesRef.current?.focus();
      }, 300);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // Error state
  if (!lesson) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Alert variant="danger">Lesson not found</Alert>
      </div>
    );
  }

  // Calculate overall progress
  const overallProgress = (completedLessons.length / totalLessons) * 100;

  return (
    <>
      <style>{`
        :root {
          --primary-color: #063F3A;
          --primary-dark: #063F3A;
          --primary-light: #eef2ff;
          --primary-hover: #3a56d4;
          --secondary-color: #4cc9f0;
          --success-color: #4CAF50;
          --warning-color: #ff9800;
          --danger-color: #f44336;
          --light-bg: #f8fafc;
          --dark-bg: #1a202c;
          --card-bg: #ffffff;
          --text-primary: #2d3748;
          --text-secondary: #4a5568;
          --text-muted: #718096;
          --border-color: #e2e8f0;
          --gradient-primary: linear-gradient(135deg, #4361ee 0%, #3a56d4 100%);
          --gradient-secondary: linear-gradient(135deg, #4cc9f0 0%, #4895ef 100%);
          --shadow-sm: 0 2px 4px rgba(0,0,0,0.05);
          --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
          --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
          --shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
          --transition-fast: all 0.2s ease;
          --transition-normal: all 0.3s ease;
        }
        
        body {
          background-color: var(--light-bg);
          color: var(--text-primary);
        }
        
        .sidebar {
          height: calc(100vh - 100px);
          overflow-y: auto;
          position: sticky;
          top: 20px;
          scrollbar-width: thin;
          scrollbar-color: var(--primary-color) var(--light-bg);
        }
        
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }
        
        .sidebar::-webkit-scrollbar-track {
          background: var(--light-bg);
        }
        
        .sidebar::-webkit-scrollbar-thumb {
          background-color: var(--primary-color);
          border-radius: 20px;
        }
        
        .video-container {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
        }
        
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 12px;
        }
        
        .lesson-nav {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: var(--card-bg);
          box-shadow: var(--shadow-sm);
          border-radius: 12px;
        }
        
        .lesson-list-item {
          transition: var(--transition-fast);
          border-left: 3px solid transparent;
          color: var(--text-primary);
        }
        
        .lesson-list-item:hover {
          background-color: var(--primary-light);
          color: var(--primary-dark);
          transform: translateX(2px);
        }
        
        .lesson-list-item.active {
          border-left: 3px solid var(--primary-color);
          background-color: var(--primary-light);
          color: var(--primary-dark);
          font-weight: 500;
        }
        
        .lesson-list-item.completed {
          border-left: 3px solid var(--success-color);
        }
        
        .btn-prev-next {
          transition: var(--transition-normal);
          box-shadow: var(--shadow-sm);
        }
        
        .btn-prev-next:hover:not(:disabled) {
          transform: translateX(0) scale(1.05);
          box-shadow: var(--shadow-md);
        }
        
        .btn-prev:hover:not(:disabled) {
          transform: translateX(-5px);
        }
        
        .btn-next:hover:not(:disabled) {
          transform: translateX(5px);
        }
        
        .btn-primary {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }
        
        .btn-primary:hover, .btn-primary:focus {
          background: var(--primary-dark);
          border-color: var(--primary-dark);
        }
        
        .btn-outline-primary {
          color: var(--primary-color);
          border-color: var(--primary-color);
        }
        
        .btn-outline-primary:hover {
          background-color: var(--primary-color);
          color: white;
        }
        
        .notes-container {
          transition: var(--transition-normal);
        }
        
        .card {
          border: none;
          box-shadow: var(--shadow-md);
          transition: var(--transition-normal);
        }
        
        .card:hover {
          box-shadow: var(--shadow-lg);
        }
        
        .bg-primary {
          background: var(--gradient-primary) !important;
        }
        
        .text-primary {
          color: var(--primary-color) !important;
        }
        
        .progress-bar {
          background: var(--gradient-primary);
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .pulse {
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .completion-icon {
          transition: var(--transition-normal);
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background-color: var(--primary-light);
        }
        
        .completion-icon:hover {
          transform: scale(1.2);
          background-color: var(--primary-color);
          color: white !important;
        }
        
        .completion-icon:hover svg {
          color: white !important;
        }
        
        .toast-custom {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 9999;
        }
        
        .card-header {
          background: transparent;
          border-bottom: 1px solid var(--border-color);
        }
        
        .card-header.bg-primary {
          border-bottom: none;
        }
        
        .lesson-title {
          position: relative;
          display: inline-block;
        }
        
        .lesson-title:after {
          content: '';
          position: absolute;
          width: 50%;
          height: 3px;
          bottom: -6px;
          left: 0;
          background: var(--gradient-primary);
          border-radius: 10px;
        }
        
        .tip-card {
          border-left: 4px solid var(--secondary-color);
        }
        
        .form-control:focus {
          box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
          border-color: var(--primary-color);
        }
        
        .list-group-item {
          border-left: 0;
          border-right: 0;
          border-color: var(--border-color);
        }
        
        .badge-pill {
          padding: 0.4em 0.8em;
          font-weight: 500;
          font-size: 0.75rem;
        }
        
        .up-next-card {
          transition: var(--transition-normal);
          cursor: pointer;
        }
        
        .up-next-card:hover {
          transform: translateY(-5px);
        }
        
        .up-next-icon {
          width: 50px;
          height: 50px;
          background: var(--primary-light);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          font-size: 1.2rem;
          transition: var(--transition-normal);
        }
        
        .up-next-card:hover .up-next-icon {
          background: var(--primary-color);
          color: white;
        }
        
        .mobile-lesson-toggle {
          border-radius: 10px;
          box-shadow: var(--shadow-sm);
        }
        
        .notes-textarea {
          border-radius: 10px;
          border-color: var(--border-color);
          resize: vertical;
          min-height: 150px;
          transition: var(--transition-fast);
        }
        
        .notes-textarea:focus {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 0.25rem rgba(67, 97, 238, 0.25);
        }
        
        /* Fix for hover color contrast issue */
        .lesson-list-item:hover a,
        .lesson-list-item:hover small,
        .lesson-list-item:hover div {
          color: var(--primary-dark) !important;
        }
        
        .lesson-list-item.active a,
        .lesson-list-item.active small,
        .lesson-list-item.active div {
          color: var(--primary-dark) !important;
        }
        
        /* Progress indicators */
        .progress {
          height: 8px;
          border-radius: 10px;
          background-color: var(--primary-light);
          overflow: hidden;
        }
        
        .progress-bar.bg-info {
          background: var(--gradient-secondary) !important;
        }
        
        .progress-bar.bg-success {
          background: linear-gradient(135deg, var(--success-color) 0%, #2e7d32 100%) !important;
        }
        
        /* Tips section styling */
        .tips-list {
          padding-left: 1.2rem;
        }
        
        .tips-list li {
          margin-bottom: 0.5rem;
          position: relative;
        }
        
        .tips-list li:before {
          content: "•";
          color: var(--secondary-color);
          font-weight: bold;
          position: absolute;
          left: -1.2rem;
          font-size: 1.2rem;
        }
        
        .tips-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        
        .tip-icon {
          color: var(--secondary-color);
        }
      `}</style>

      {/* Toast Notifications */}
      <ToastContainer position="bottom-end" className="p-3 toast-custom">
        <Toast 
          show={showToast} 
          onClose={() => setShowToast(false)} 
          delay={3000} 
          autohide 
          bg={completed ? "success" : "primary"}
          className="shadow-lg"
        >
          <Toast.Header closeButton className="bg-white">
            <strong className="me-auto">{completed ? 'Success' : 'Notification'}</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="container-fluid py-4 min-vh-100" style={{ backgroundColor: 'var(--light-bg)' }}>
        <Row>
          {/* Left Sidebar - Lesson List */}
          <Col lg={3} className="d-none d-lg-block">
            <div className="sidebar pr-2">
              <Card className="border-0 rounded-4 mb-4">
                <Card.Header className="bg-primary text-white py-3 d-flex justify-content-between align-items-center rounded-top-4">
                  <div className="d-flex align-items-center">
                    <FaBookOpen className="me-2" />
                    <h5 className="m-0 fw-bold">{language} - {level}</h5>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  {/* Overall progress */}
                  <div className="px-3 pt-3 pb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="fw-medium">Course Progress</small>
                      <small className="text-primary fw-bold">{Math.round(overallProgress)}%</small>
                    </div>
                    <ProgressBar 
                      now={overallProgress} 
                      variant="success" 
                      className="rounded-pill" 
                      style={{ height: '8px' }}
                    />
                    <div className="text-center mt-2">
                      <small className="text-muted">
                        {completedLessons.length} of {totalLessons} completed
                      </small>
                    </div>
                  </div>

                  <ListGroup variant="flush" className="lesson-list">
                    {allLessons.map((item, index) => {
                      const isCompleted = completedLessons.includes(item.id);
                      const isActive = item.id === lessonId;
                      
                      return (
                        <ListGroup.Item 
                          key={item.id}
                          action
                          onClick={() => navigateToLesson(item.id)}
                          className={`lesson-list-item border-0 py-3 ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                {isCompleted ? (
                                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                                    <FaCheck size={12} />
                                  </div>
                                ) : (
                                  <div className={`rounded-circle d-flex align-items-center justify-content-center ${isActive ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: '24px', height: '24px' }}>
                                    <small>{index + 1}</small>
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className={`${isActive ? 'fw-medium' : ''}`}>
                                  {item.title}
                                </div>
                                <small className={`d-block ${isActive ? 'text-primary' : isCompleted ? 'text-success' : 'text-muted'}`}>
                                  {isCompleted ? 'Completed' : isActive ? 'In progress' : 'Not started'}
                                </small>
                              </div>
                            </div>
                            {isActive && (
                              <FaPlay className="text-primary" size={12} />
                            )}
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* Main Content */}
          <Col lg={9} className="px-lg-4">
            {/* Top Navigation - Mobile Lesson Toggle */}
            <div className="d-lg-none mb-3">
              <Button 
                variant="primary" 
                className="w-100 d-flex justify-content-between align-items-center mobile-lesson-toggle"
                onClick={() => setShowLessonList(!showLessonList)}
              >
                <span><FaList className="me-2" />Lesson List</span>
                {showLessonList ? <FaTimes /> : <FaChevronRight />}
              </Button>
              
              <Collapse in={showLessonList}>
                <div className="mt-2">
                  <Card className="rounded-4">
                    <Card.Body className="p-0">
                      <ListGroup variant="flush">
                        {allLessons.map((item, index) => {
                          const isCompleted = completedLessons.includes(item.id);
                          const isActive = item.id === lessonId;
                          
                          return (
                            <ListGroup.Item 
                              key={item.id}
                              action
                              onClick={() => navigateToLesson(item.id)}
                              className={`lesson-list-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                            >
                              <div className="d-flex align-items-center">
                                <div className="me-2">
                                  {isCompleted ? (
                                    <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                                      <FaCheck size={12} />
                                    </div>
                                  ) : (
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center ${isActive ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: '24px', height: '24px' }}>
                                      <small>{index + 1}</small>
                                    </div>
                                  )}
                                </div>
                                <div>{item.title}</div>
                              </div>
                            </ListGroup.Item>
                          );
                        })}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </div>
              </Collapse>
            </div>

            {/* Lesson Navigation */}
            <div className="lesson-nav mb-4 p-3 rounded-4 shadow-sm d-flex justify-content-between align-items-center">
              <Button 
                variant="outline-secondary" 
                onClick={handleBack}
                className="d-flex align-items-center shadow-sm"
              >
                <FaChevronLeft className="me-2" /> Back to Lessons
              </Button>
              
              <div className="d-flex gap-2">
                <Button
                  variant="outline-primary"
                  className="btn-prev-next btn-prev"
                  onClick={handlePreviousLesson}
                  disabled={currentIndex === 0}
                >
                  <FaChevronLeft className="me-1" /> Previous
                </Button>
                <Button
                  variant="primary"
                  className="btn-prev-next btn-next"
                  onClick={handleNextLesson}
                  disabled={currentIndex >= totalLessons - 1}
                >
                  Next <FaChevronRight className="ms-1" />
                </Button>
              </div>
            </div>

            {/* Main Content Area */}
            <Row className="gx-4 gy-4">
              {/* Video Section */}
              <Col lg={8}>
                {/* Header */}
                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="fw-bold mb-1 d-flex align-items-center lesson-title">
                      {lesson.title}
                      <Badge 
                        bg={completed ? 'success' : 'primary'}
                        className="ms-3 py-1 px-2 rounded-pill badge-pill"
                      >
                        {completed ? '✓ Completed' : 'In Progress'}
                      </Badge>
                    </h2>
                    <p className="text-muted mb-0">{lesson.description}</p>
                  </div>
                  <div>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>{completed ? 'Mark as incomplete' : 'Mark as completed'}</Tooltip>}
                    >
                      <div 
                        className={`completion-icon ${!completed ? 'pulse' : ''}`}
                        onClick={handleComplete}
                      >
                        {completed ? (
                          <FaCheck size={22} className="text-success" />
                        ) : (
                          <FaBookmark size={22} className="text-primary" />
                        )}
                      </div>
                    </OverlayTrigger>
                  </div>
                </div>

                {/* Video Player */}
                <Card className="border-0 rounded-4 mb-4 fade-in">
                  <Card.Body className="p-0">
                    <div className="video-container">
                      {!videoError ? (
                        <iframe
                          id="lessonVideo"
                          src={lesson.videoUrl}
                          title={lesson.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onLoad={handleIframeLoad}
                        ></iframe>
                      ) : (
                        <div className="d-flex justify-content-center align-items-center p-5 text-center text-danger fw-medium h-100">
                          🚫 Oops! The video failed to load. Please try again later.
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>

                {/* Notes Section */}
                <Card className="border-0 rounded-4 mb-4">
                  <Card.Header className="pt-3 pb-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">
                        <FaNotesMedical className="me-2 text-primary" /> Lesson Notes
                      </h5>
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none"
                        onClick={toggleNotes}
                      >
                        {showNotes ? (
                          <span className="text-primary"><FaEye className="me-1" /> Hide Notes</span>
                        ) : (
                          <span className="text-primary"><FaEdit className="me-1" /> Take Notes</span>
                        )}
                      </Button>
                    </div>
                  </Card.Header>
                  <Collapse in={showNotes}>
                    <div>
                      <Card.Body className="pt-3 notes-container">
                        <Form.Group className="mb-3">
                          <Form.Control
                            as="textarea"
                            rows={6}
                            placeholder="Type your notes here..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="mb-2"
                            ref={notesRef}
                          />
                          <Button 
                            variant="primary" 
                            onClick={handleSaveNotes}
                            disabled={isSaving}
                            className="d-flex align-items-center"
                          >
                            {isSaving ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                Saving...
                              </>
                            ) : (
                              <>
                                <FaSave className="me-2" /> Save Notes
                              </>
                            )}
                          </Button>
                        </Form.Group>
                      </Card.Body>
                    </div>
                  </Collapse>
                </Card>

                {/* Tips Section */}
                <Card className="border-0 shadow-sm rounded-4 slide-in">
                  <Card.Body>
                    <h5 className="fw-bold text-dark mb-3">Learning Tips</h5>
                    <p className="text-muted mb-2">
                      Use these tips to get the most out of your lesson:
                    </p>
                    <ul className="text-muted">
                      <li>Repeat words aloud to reinforce pronunciation.</li>
                      <li>Pause and rewind to catch anything you missed.</li>
                      <li>Enable subtitles for better understanding.</li>
                      <li>Take notes on important phrases.</li>
                      <li>Try to use new vocabulary in sentences.</li>
                      <li>Practice with the chatbot after completing the lesson.</li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>

              {/* Right Sidebar - Progress & Navigation */}
              <Col lg={4}>
                <Card className="shadow-sm border-0 rounded-4 mb-4">
                  <Card.Header className="bg-white border-bottom-0 pt-3">
                    <h5 className="fw-bold mb-0">Your Progress</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small>Current Lesson</small>
                        <small>{currentIndex + 1} of {totalLessons}</small>
                      </div>
                      <ProgressBar
                        now={((currentIndex + 1) / totalLessons) * 100}
                        variant="info"
                        className="rounded-pill"
                        style={{ height: '8px' }}
                      />
                    </div>
                    
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <small>Overall Progress</small>
                        <small>{completedLessons.length} of {totalLessons} completed</small>
                      </div>
                      <ProgressBar
                        now={overallProgress}
                        variant="success"
                        className="rounded-pill"
                        style={{ height: '8px' }}
                      />
                    </div>
                  </Card.Body>
                </Card>
                
                {/* Navigation Controls */}
                <Card className="shadow-sm border-0 rounded-4 mb-4">
                  <Card.Header className="bg-white border-bottom-0 pt-3">
                    <h5 className="fw-bold mb-0">Lesson Navigation</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-grid gap-2">
                      <Button
                        variant={completed ? 'success' : 'outline-success'}
                        onClick={handleComplete}
                        className="d-flex justify-content-center align-items-center"
                      >
                        {completed ? (
                          <>
                            <FaCheck className="me-2" /> Completed
                          </>
                        ) : (
                          <>
                            <FaBookmark className="me-2" /> Mark as Completed
                          </>
                        )}
                      </Button>

                      {currentIndex > 0 && (
                        <Button
                          variant="outline-secondary"
                          onClick={handlePreviousLesson}
                          className="d-flex justify-content-center align-items-center"
                        >
                          <FaChevronLeft className="me-2" /> Previous Lesson
                        </Button>
                      )}

                      {currentIndex < totalLessons - 1 && (
                        <Button
                          variant="primary"
                          onClick={handleNextLesson}
                          className="d-flex justify-content-center align-items-center"
                        >
                          Next Lesson <FaChevronRight className="ms-2" />
                        </Button>
                      )}

                      <Button
                        variant="outline-primary"
                        onClick={handleBack}
                        className="d-flex justify-content-center align-items-center"
                      >
                        Back to All Lessons
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
                
                {/* Up Next */}
                {currentIndex < totalLessons - 1 && (
                  <Card className="shadow-sm border-0 rounded-4">
                    <Card.Header className="bg-white border-bottom-0 pt-3">
                      <h5 className="fw-bold mb-0">Up Next</h5>
                    </Card.Header>
                    <Card.Body className="pt-2">
                      <div className="d-flex align-items-center">
                        <div 
                          className="me-3 rounded-circle bg-light d-flex justify-content-center align-items-center"
                          style={{ width: '40px', height: '40px' }}
                        >
                          <FaPlay className="text-primary" />
                        </div>
                        <div>
                          <div className="fw-semibold">
                            {allLessons[currentIndex + 1]?.title}
                          </div>
                          <small className="text-muted">
                            Lesson {currentIndex + 2}
                          </small>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default LessonDetail;