// src/components/Progress/AchievementsPage.js

import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await axios.get('/api/user/achievements');
        setAchievements(res.data);
      } catch (err) {
        console.error('Error loading achievements:', err);
      }
      setLoading(false);
    };

    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!achievements) {
    return (
      <Container className="text-center mt-5">
        <p>⚠️ Could not load achievements.</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3 className="mb-4">🏆 Achievements & Badges</h3>

      <Row>
        {achievements.badges.map((badge, index) => (
          <Col xs={6} md={4} key={index} className="mb-3">
            <Card className="text-center h-100">
              <Card.Body>
                <h1>{badge.icon}</h1>
                <Card.Title>{badge.title}</Card.Title>
                <Card.Text>{badge.description}</Card.Text>
                <Badge bg={badge.unlocked ? 'success' : 'secondary'}>
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </Badge>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AchievementsPage;
