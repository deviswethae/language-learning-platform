// src/components/Progress/ProgressPage.js

import React, { useEffect, useState } from 'react';
import { Container, Card, ProgressBar, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const ProgressPage = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get('/api/user/progress');
        setProgress(res.data);
      } catch (err) {
        console.error('Error loading progress:', err);
      }
      setLoading(false);
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!progress) {
    return (
      <Container className="text-center mt-5">
        <p>⚠️ Could not load progress.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3 className="mb-4">📊 Your Progress</h3>

      <Card className="mb-3">
        <Card.Body>
          <Card.Title>XP & Level</Card.Title>
          <p>Level: <strong>{progress.level}</strong></p>
          <p>XP: <strong>{progress.xp}</strong> / {progress.nextLevelXP}</p>
          <ProgressBar now={(progress.xp / progress.nextLevelXP) * 100} />
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Completed Lessons</Card.Title>
          <Row>
            {progress.completedLessons.map((lesson, index) => (
              <Col key={index} xs={6} md={4} className="mb-2">
                <Card bg="light" text="dark" className="text-center p-2">
                  {lesson.title}
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProgressPage;
