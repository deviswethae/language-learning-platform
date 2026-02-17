import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  Spinner,
  Badge,
  Alert,
  ProgressBar,
} from 'react-bootstrap';
import lessonsData from '../data/lessons.json';
import { FaSearch, FaBookOpen, FaLanguage, FaArrowRight, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const LessonList = () => {
  const { language, level } = useParams();
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);

  // Fetch lessons data and completed lessons from localStorage
  useEffect(() => {
    setTimeout(() => {
      const fetchedLessons = lessonsData[language]?.[level] || null;
      setLessons(fetchedLessons);
      setFilteredLessons(fetchedLessons);
      
      // Load completed lessons from localStorage
      const savedCompletedLessons = JSON.parse(localStorage.getItem(`completedLessons_${language}_${level}`)) || [];
      setCompletedLessons(savedCompletedLessons);
      
      // Calculate initial progress
      if (fetchedLessons) {
        const progressPercentage = (savedCompletedLessons.length / fetchedLessons.length) * 100;
        setProgress(progressPercentage);
      }
      
      setLoading(false);
    }, 800);
  }, [language, level]);

  // Filter lessons based on search term
  useEffect(() => {
    if (lessons && searchTerm.trim()) {
      const results = lessons.filter((lesson) =>
        lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLessons(results);
    } else {
      setFilteredLessons(lessons);
    }
  }, [searchTerm, lessons]);

  // Toggle lesson completion status
  const toggleLessonCompletion = (lessonId) => {
    let updatedCompletedLessons;
    
    if (completedLessons.includes(lessonId)) {
      // Remove from completed lessons
      updatedCompletedLessons = completedLessons.filter(id => id !== lessonId);
    } else {
      // Add to completed lessons
      updatedCompletedLessons = [...completedLessons, lessonId];
    }
    
    // Update state
    setCompletedLessons(updatedCompletedLessons);
    
    // Calculate new progress percentage
    const progressPercentage = (updatedCompletedLessons.length / lessons.length) * 100;
    setProgress(progressPercentage);
    
    // Save to localStorage
    localStorage.setItem(`completedLessons_${language}_${level}`, JSON.stringify(updatedCompletedLessons));
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!lessons) {
    return (
      <Container className="my-5">
        <h2 className="text-center mb-4 text-capitalize">{language} - {level} Lessons</h2>
        <Alert variant="danger" className="shadow-sm text-center">
          No lessons available for this language or level. Please check the URL or try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <style>{`
        .fade-in {
          animation: fadeInUp 0.6s ease-in-out;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hover-shadow {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.75rem 1.5rem rgba(0,0,0,0.1);
        }

        .lesson-card .btn {
          transition: all 0.25s ease-in-out;
        }
        .lesson-card .btn:hover {
          background-color: #063F3A1;
          color: white;
        }

        .badge-glow {
          animation: glow 2s infinite ease-in-out;
        }

        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(13, 110, 253, 0.3); }
          50% { box-shadow: 0 0 12px rgba(13, 110, 253, 0.6); }
          100% { box-shadow: 0 0 5px rgba(13, 110, 253, 0.3); }
        }

        .input-group-text {
          background-color: #f8f9fa;
          border: 1px solid #ced4da;
        }

        .form-control {
          border-radius: 0.5rem;
        }
        
        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .badge-info {
          font-size: 0.85rem;
        }
        
        .completed-badge {
          background-color: #198754;
          color: white;
          animation: pulse 1.5s ease-in-out;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        .completion-button {
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .completion-button:hover {
          transform: scale(1.1);
        }
        
        .progress-container {
          padding: 15px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.05);
          margin-bottom: 20px;
        }
        
        .progress-bar-custom {
          transition: width 0.5s ease;
        }
        
        .progress-label {
          font-weight: 600;
        }
      `}</style>

      <Container className="py-5 fade-in">
        {/* Language Banner */}
        <Card className="shadow-lg border-0 rounded-4 mb-4 bg-primary text-white">
          <Card.Body className="py-4 px-4">
            <div className="d-flex align-items-center gap-3">
              <FaLanguage size={36} />
              <div>
                <h2 className="fw-bold text-capitalize mb-0">{language} - {level}</h2>
                <p className="mb-0 text-white-50 small">Explore your lessons and start learning today</p>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Progress Tracking */}
        <div className="progress-container mb-4 fade-in">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="progress-label mb-0">Your Progress</h5>
            <Badge bg="primary">{completedLessons.length} of {lessons.length} lessons completed</Badge>
          </div>
          <ProgressBar 
            now={progress} 
            label={`${Math.round(progress)}%`}
            variant="success" 
            className="progress-bar-custom" 
            style={{ height: '12px' }}
          />
        </div>

        {/* Search Bar */}
        <InputGroup className="mb-4 shadow-sm rounded-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search lessons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-start-0"
          />
        </InputGroup>

        {/* No Results Alert */}
        {filteredLessons?.length === 0 && (
          <Alert variant="info" className="text-center shadow-sm">
            No lessons match your search. Try a different keyword.
          </Alert>
        )}

        {/* Lesson Grid */}
        <Row xs={1} sm={2} lg={3} className="g-4">
          {filteredLessons?.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            
            return (
              <Col key={lesson.id}>
                <Card className={`lesson-card h-100 shadow-sm border-0 rounded-4 hover-shadow ${isCompleted ? 'border-success' : ''}`}>
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="info" className="text-uppercase badge-glow">
                          {level}
                        </Badge>
                        {isCompleted && (
                          <Badge bg="success" className="completed-badge">
                            Completed
                          </Badge>
                        )}
                      </div>
                      <Card.Title className="fw-bold text-dark d-flex align-items-center">
                        <FaBookOpen className="me-2 text-primary" />
                        {lesson.title}
                      </Card.Title>
                      <Card.Text className="text-muted small">
                        {lesson.description}
                      </Card.Text>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div 
                        className="completion-button"
                        onClick={() => toggleLessonCompletion(lesson.id)}
                        title={isCompleted ? "Mark as incomplete" : "Mark as completed"}
                      >
                        {isCompleted ? (
                          <FaCheckCircle size={24} className="text-success" />
                        ) : (
                          <FaRegCircle size={24} className="text-secondary" />
                        )}
                      </div>
                      <Link to={`/lessons/${language}/${level}/${lesson.id}`}>
                        <Button variant="outline-primary" className="rounded-pill px-4 py-2">
                          {isCompleted ? "Review" : "Start"} <FaArrowRight className="ms-2" />
                        </Button>
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default LessonList;