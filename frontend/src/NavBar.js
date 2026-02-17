import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Dropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaLanguage, FaUserGraduate, FaBook, FaRobot,
  FaPen, FaSignOutAlt, FaHome, FaUserCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const NavBar = ({ authState }) => {
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        setLocalUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse userData:", err);
        setLocalUser(null);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        try {
          setLocalUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Failed to parse userData:", err);
          setLocalUser(null);
        }
      } else {
        setLocalUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const user = authState?.user || localUser;
  const displayName = user?.name || user?.given_name || 'User';

  return (
    <>
      <style>{`
        .nav-link {
          position: relative;
          transition: all 0.3s ease;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0%;
          height: 2px;
          background-color: #ffc107;
          transition: width 0.3s ease, left 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
          left: 0;
        }
        .nav-link:hover {
          color: #ffc107 !important;
        }
        .dropdown-menu-dark {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <Navbar expand="lg" sticky="top" variant="dark" className="py-3 shadow-sm" style={{
        background: 'linear-gradient(135deg, #30A197, #102D2A)',
        borderBottom: '2px solid rgba(255,193,7,0.2)'
      }}>
        <Container fluid>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fs-3 fw-bold d-flex align-items-center"
            style={{
              background: 'white',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            <motion.div whileHover={{ scale: 1.1 }}>
              <FaLanguage className="me-2" size={26} />
            </motion.div>
            Language Quest
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="mx-auto text-center my-2 my-lg-0">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Nav.Link as={Link} to="/" className="mx-3 text-light">
                  <FaHome className="me-1" /> Home
                </Nav.Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Nav.Link as={Link} to="/select-language" className="mx-3 text-light">
                  <FaBook className="me-1" /> Lessons
                </Nav.Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Nav.Link as={Link} to="/speech-practice" className="mx-3 text-light">
                  <FaUserGraduate className="me-1" /> Practice
                </Nav.Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Nav.Link as={Link} to="/chatbot" className="mx-3 text-light">
                  <FaRobot className="me-1" /> AI Tutor
                </Nav.Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Nav.Link as={Link} to="/quiz" className="mx-3 text-light">
                  <FaPen className="me-1" /> Quiz
                </Nav.Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Nav.Link as={Link} to="/flashcards" className="mx-3 text-light">
                  <FaBook className="me-1" /> Flashcards
                </Nav.Link>
              </motion.div>
            </Nav>

            <Nav className="ms-auto d-flex align-items-center">
              {user ? (
                <Dropdown align="end">
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Dropdown.Toggle
                      variant="outline-light"
                      className="d-flex align-items-center rounded-pill px-3"
                      id="user-dropdown"
                    >
                      <FaUserCircle className="me-2" size={18} />
                      {displayName}
                    </Dropdown.Toggle>
                  </motion.div>
                  <Dropdown.Menu className="dropdown-menu-dark mt-2 shadow">
                    <Dropdown.Item as={Link} to="/profile">
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings">
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                      <Dropdown.Item onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" />
                        Logout
                      </Dropdown.Item>
                    </motion.div>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Button as={Link} to="/login" variant="outline-warning" className="rounded-pill px-4" >
                    Login
                  </Button>
                </motion.div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
