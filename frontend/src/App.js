import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './App.css';

// 🧱 Layout
import NavBar from './NavBar';

// 🔐 Auth Pages
import RegisterPage from './components/Register';
import LoginPage from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import GoogleRedirectHandler from './components/GoogleRedirectHandler';

// 🏠 Core Pages
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import SelectLanguage from './components/SelectLanguage';

// 📘 Learning Module
import LessonList from './components/Learning/LessonList';
import LessonDetail from './components/Learning/LessonDetail';

// 🧠 Practice Tools
import QuizPage from './components/Quizzes/QuizPage';
import VoiceAssistant from './components/Practice/VoiceAssistant';
import ChatbotPage from './components/Practice/ChatbotPage';

// 📈 Progress
import ProgressPage from './components/Progress/ProgressPage';
import AchievementsPage from './components/Progress/AchievementsPage';

// 🃏 Flashcards Page
import FlashcardPage from './components/Flashcard/FlashcardPage';

const MainLayout = ({ authState, handleLogout }) => (
  <>
    <NavBar authState={authState} handleLogout={handleLogout} />
    <Container className="mt-4">
      <Outlet />
    </Container>
  </>
);

const NotFound = () => (
  <div className="text-center mt-5">
    <h2>Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
  </div>
);

// 🔐 Wraps any route that needs auth
const PrivateRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  const checkAuth = useCallback(() => {
    try {
      const token = localStorage.getItem("authToken");
      const rawUserData = localStorage.getItem("userData");
      const userName = localStorage.getItem("userName");

      let user = null;
      if (rawUserData) {
        try {
          user = JSON.parse(rawUserData);
        } catch (err) {
          console.error("Failed to parse userData:", err);
        }
      }

      if (user && !user.name && userName) {
        user.name = userName;
      }

      const isValidToken = token && token.length > 10 && user && user.email;

      setAuthState({
        isAuthenticated: isValidToken,
        user: isValidToken ? user : null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    }
  }, []);

  const handleLogout = () => {
    const gapi = window.gapi;
    const finishLogout = () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    };

    if (gapi?.auth2) {
      const auth2 = gapi.auth2.getAuthInstance();
      if (auth2) {
        auth2.signOut().then(finishLogout).catch(finishLogout);
      } else {
        finishLogout();
      }
    } else {
      finishLogout();
    }
  };

  useEffect(() => {
    checkAuth();

    const handleStorageChange = (event) => {
      if (event.key === 'authToken' || event.key === 'userData') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth]);

  if (authState.isLoading) return null;

  return (
    <Router>
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path="/" element={<><NavBar authState={authState} handleLogout={handleLogout} /><Home /></>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/auth/google/redirect" element={<GoogleRedirectHandler />} />

        {/* 🔐 Private Routes */}
        <Route element={<PrivateRoute isAuthenticated={authState.isAuthenticated} />}>
          <Route element={<MainLayout authState={authState} handleLogout={handleLogout} />}>
            <Route path="/select-language" element={<SelectLanguage />} />
            <Route path="/lessons/:language/:level" element={<LessonList />} />
            <Route path="/lessons/:language/:level/:lessonId" element={<LessonDetail />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/speech-practice" element={<VoiceAssistant />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/flashcards" element={<FlashcardPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
          </Route>
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
