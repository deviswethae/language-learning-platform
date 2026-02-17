import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import { FaGlobeAmericas, FaChartLine, FaRocket } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const SelectLanguage = () => {
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (language && level) {
      navigate(`/lessons/${language}/${level}`);
    }
  };

  const languages = [
    "Spanish", "English", "Mandarin", "Hindi", "Arabic",
    "Bengali", "Portuguese", "Russian", "Japanese", "Punjabi",
    "German", "Javanese", "Wu Chinese", "Telugu",
    "French", "Marathi", "Tamil",
  ];

  return (
    <>
      <style>{`
        .fade-in {
          animation: fadeIn 0.8s ease-in-out;
        }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .form-select,
        .btn {
          transition: all 0.3s ease-in-out;
        }

        .form-select:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
          border-color: #86b7fe;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
        }

        .rocket-icon {
          animation: bounce 2s infinite ease-in-out;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-body-tertiary px-3">
        <Card className="fade-in shadow-lg border-0 rounded-5 p-4 p-md-5 w-100" style={{ maxWidth: '600px', backgroundColor: '#ffffff' }}>
          {/* Header */}
          <div className="text-center mb-4">
            <FaGlobeAmericas size={52} className="text-primary mb-3" />
            <h2 className="fw-bold text-dark">Start Your Language Journey</h2>
            <p className="text-secondary mb-0">Pick your language and level to begin learning!</p>
          </div>

          {/* Form */}
          <Form className="mt-4">
            <Row>
              <Col xs={12} className="mb-4">
                <Form.Label className="fw-semibold text-dark">
                  <FaGlobeAmericas className="me-2 text-secondary" />
                  Language
                </Form.Label>
                <Form.Select
                  size="lg"
                  className="rounded-4 shadow-sm"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="">Choose a language</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </Form.Select>
              </Col>

              <Col xs={12} className="mb-4">
                <Form.Label className="fw-semibold text-dark">
                  <FaChartLine className="me-2 text-secondary" />
                  Proficiency Level
                </Form.Label>
                <Form.Select
                  size="lg"
                  className="rounded-4 shadow-sm"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                >
                  <option value="">Choose a level</option>
                  <option value="Beginner">Beginner (A1–A2)</option>
                  <option value="Intermediate">Intermediate (B1–B2)</option>
                </Form.Select>
              </Col>
            </Row>

            <Button
              size="lg"
              variant="primary"
              className="w-100 py-3 rounded-4 fw-bold d-flex align-items-center justify-content-center gap-2 mt-1"
              onClick={handleStartLearning}
              disabled={!language || !level}
            >
              <FaRocket className="rocket-icon" />
              Start Learning
            </Button>
          </Form>
        </Card>
      </Container>
    </>
  );
};

export default SelectLanguage;
