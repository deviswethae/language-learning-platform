import React from 'react';
import { 
  Container, Row, Col, Button, Card, Nav, 
  ProgressBar, Badge
} from 'react-bootstrap';
import { 
  FaGlobe, FaBook, FaMicrophone, FaChartLine, 
  FaRobot, FaHeadphones, FaClipboardCheck, 
  FaUserCog, FaFire, FaLanguage, FaArrowRight
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HomePage = () => {
  // Mock user data (replace with real auth check)
  const isLoggedIn = false;
  const userProgress = {
    xp: 1250,
    streak: 7,
    level: 'Intermediate',
    nextLevel: 'Advanced'
  };

  return (
    <div className="home-page">
      {/* ===== 1. Hero Section ===== */}
      <section className="hero-section py-5 bg-primary bg-opacity-10">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6} className="order-lg-1 order-2">
              <h1 className="display-4 fw-bold mb-4">
                Learn Languages Smarter with AI
              </h1>
              <p className="lead mb-4 fs-5">
                Lessons, Quizzes, Flashcards, and AI Tutors — All in One Platform.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Button 
                  variant="primary" 
                  size="lg" 
                  as={Link} 
                  to="/select-language"
                  className="px-4 shadow-sm fw-semibold"
                  style={{background: 'linear-gradient(135deg, #30A197, #102D2A)'}}
                >
                  Get Started <FaArrowRight className="ms-2" />
                </Button>
                <Button 
                  variant="outline-primary" 
                  size="lg" 
                  as={Link} 
                  to="/login"
                  className="px-4 fw-semibold"
                >
                  Login
                </Button>
              </div>
            </Col>
            <Col lg={6} className="order-lg-2 order-1 text-center">
              <img
                src="https://illustrations.popsy.co/amber/digital-nomad.svg"
                alt="Language Learning"
                className="img-fluid animate-float"
                style={{ maxHeight: '400px' }}
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* ===== 2. Navigation Strip ===== */}
      <nav className="bg-white shadow-sm py-3 sticky-top">
        <Container>
          <Nav 
            className="justify-content-center flex-nowrap overflow-auto pb-2" 
            style={{ scrollbarWidth: 'none' }}
          >
            {[
              { icon: <FaBook className="me-2" />, text: "Lessons", link: "/select-language" },
              { icon: <FaMicrophone className="me-2" />, text: "Practice", link: "/speech-practice" },
              { icon: <FaClipboardCheck className="me-2" />, text: "Flashcards", link: "/flashcards" },
              { icon: <FaRobot className="me-2" />, text: "AI Tutor", link: "/chatbot" },
              { icon: <FaChartLine className="me-2" />, text: "Dashboard", link: "/dashboard" }
            ].map((item, idx) => (
              <Nav.Item key={idx} className="px-3">
                <Nav.Link 
                  as={Link} 
                  to={item.link} 
                  className="d-flex align-items-center text-nowrap px-3 py-2 rounded-pill"
                  activeClassName="bg-primary bg-opacity-10 text-primary"
                >
                  {item.icon} {item.text}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        </Container>
      </nav>

      {/* ===== 3. How It Works ===== */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="display-5 fw-bold mb-3">How It Works</h2>
              <p className="text-muted fs-5">
                Start speaking a new language in just 4 simple steps
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            {[
              { 
                icon: <FaGlobe className="display-5 text-primary" />, 
                title: "Choose a Language", 
                text: "Select from our supported languages",
                badge: "Step 1"
              },
              { 
                icon: <FaBook className="display-5 text-primary" />, 
                title: "Structured Lessons", 
                text: "Progress through guided curriculum",
                badge: "Step 2"
              },
              { 
                icon: <FaMicrophone className="display-5 text-primary" />, 
                title: "Practice with AI", 
                text: "Conversational speaking practice",
                badge: "Step 3"
              },
              { 
                icon: <FaChartLine className="display-5 text-primary" />, 
                title: "Track Progress", 
                text: "Monitor your learning journey",
                badge: "Step 4"
              }
            ].map((step, idx) => (
              <Col md={6} lg={3} key={idx}>
                <Card className="h-100 border-0 shadow-sm text-center p-4 hover-scale">
                  <Badge pill bg="light" text="primary" className="mb-3 align-self-center">
                    {step.badge}
                  </Badge>
                  <div className="mb-3">{step.icon}</div>
                  <h4 className="mb-3">{step.title}</h4>
                  <p className="text-muted mb-0">{step.text}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ===== 4. Feature Highlights ===== */}
      <section className="py-5 bg-light">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="display-5 fw-bold mb-3">Key Features</h2>
              <p className="text-muted fs-5">
                Everything you need to master a new language
              </p>
            </Col>
          </Row>
          
          <Row className="g-4">
            {[
              { 
                icon: <FaBook className="text-primary" size={32} />, 
                title: "Interactive Lessons", 
                text: "Bite-sized lessons with immediate feedback" 
              },
              { 
                icon: <FaClipboardCheck className="text-primary" size={32} />, 
                title: "Quizzes", 
                text: "Reinforce learning with spaced repetition" 
              },
              { 
                icon: <FaHeadphones className="text-primary" size={32} />, 
                title: "Speech Practice", 
                text: "Pronunciation training with voice analysis" 
              },
              { 
                icon: <FaRobot className="text-primary" size={32} />, 
                title: "AI Chat Tutor", 
                text: "24/7 conversational practice partner" 
              },
              { 
                icon: <FaChartLine className="text-primary" size={32} />, 
                title: "Progress Tracking", 
                text: "Visualize your learning journey" 
              },
              { 
                icon: <FaUserCog className="text-primary" size={32} />, 
                title: "Personalized Learning", 
                text: "Adaptive content based on your level" 
              }
            ].map((feature, idx) => (
              <Col md={6} lg={4} key={idx}>
                <Card className="h-100 border-0 shadow-sm hover-shadow">
                  <Card.Body className="p-4">
                    <div className="d-flex">
                      <div className="me-4">
                        <div className="icon-wrapper bg-primary bg-opacity-10 p-3 rounded-circle">
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h5 className="mb-2">{feature.title}</h5>
                        <p className="text-muted mb-0">{feature.text}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* ===== 5. Progress Preview ===== */}
      {isLoggedIn ? (
        <section className="py-5 bg-white">
          <Container>
            <Row className="justify-content-center">
              <Col lg={8}>
                <Card className="border-0 shadow-sm overflow-hidden">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h3 className="mb-0">Your Learning Progress</h3>
                      <Badge bg="light" text="primary" pill>
                        Level: {userProgress.level}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-2">
                        <span>XP Earned</span>
                        <span>
                          <strong>{userProgress.xp}</strong>/2000 XP
                        </span>
                      </div>
                      <ProgressBar 
                        now={(userProgress.xp / 2000) * 100} 
                        variant="primary" 
                        className="progress-lg"
                        label={`${Math.round((userProgress.xp / 2000) * 100)}%`}
                      />
                      <div className="text-end small text-muted mt-1">
                        Next level: {userProgress.nextLevel}
                      </div>
                    </div>
                    
                    <Row className="g-3">
                      <Col md={6}>
                        <Card bg="light" className="border-0">
                          <Card.Body className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-danger bg-opacity-10 p-2 rounded-circle me-3">
                                <FaFire className="text-danger" size={20} />
                              </div>
                              <div>
                                <h6 className="mb-0">Current Streak</h6>
                                <p className="mb-0 fw-bold">{userProgress.streak} days</p>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card bg="light" className="border-0">
                          <Card.Body className="py-3">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                                <FaLanguage className="text-primary" size={20} />
                              </div>
                              <div>
                                <h6 className="mb-0">Current Level</h6>
                                <p className="mb-0 fw-bold">{userProgress.level}</p>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </section>
      ) : (
        <section className="py-5 bg-white">
          <Container>
            <div className="p-4 p-md-5 bg-light rounded-3 text-center position-relative overflow-hidden">
              <div className="bg-primary bg-opacity-10 position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}></div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <FaChartLine className="display-4 text-primary mb-3" />
                <h3 className="mb-3">Track Your Growth</h3>
                <p className="lead mb-4">
                  Earn XP and build streaks as you learn!
                </p>
                <Button 
                  variant="primary" 
                  size="lg" 
                  as={Link} 
                  to="/select-language"
                  className="px-4 shadow-sm"
                  style={{background: 'linear-gradient(135deg, #30A197, #102D2A)',}}
                >
                  Start Learning Now
                </Button>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ===== 6. Final CTA ===== */}
      <section className="py-5 bg-primary text-white position-relative"   style={{background: 'linear-gradient(135deg, #30A197, #102D2A)',}}>
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" style={{
          background: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSI+PC9yZWN0Pjwvc3ZnPg==')"
        }}></div>
        <Container className="text-center py-4 position-relative">
          <h2 className="display-5 fw-bold mb-3" >Start Learning Smarter Today </h2>
          <Button 
            variant="light" 
            size="lg" 
            as={Link} 
            to="/select-language"
            className="px-5 fw-bold shadow-sm"
          >
            Begin Your Journey
          </Button>
        </Container>
      </section>

      {/* ===== 7. Footer ===== */}
      <footer className="py-5 bg-dark text-white">
        <Container>
          <Row className="g-4">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="d-flex align-items-center mb-3">
                <FaLanguage className="text-primary me-2" size={24} />
                <span className="h4 mb-0 fw-bold">Language Quest</span>
              </div>
              <p className="text-muted small">
                AI-powered language learning platform.
              </p>
            </Col>
            <Col lg={6}>
              <div className="d-flex justify-content-lg-end gap-4">
                <Link to="/select-language" className="text-white-50">Lessons</Link>
                <Link to="/speech-practice" className="text-white-50">Practice</Link>
                <Link to="/flashcards" className="text-white-50">Flashcards</Link>
                <Link to="/dashboard" className="text-white-50">Dashboard</Link>
              </div>
            </Col>
          </Row>
          <hr className="my-4" />
          <p className="mb-0 text-center text-lg-start small text-muted">
            © 2025 Language Quest. All rights reserved.
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage;