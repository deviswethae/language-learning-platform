# 🌍 Language Learning Platform

An AI-powered MERN stack application for immersive, gamified language learning. It integrates speech recognition, flashcards, AI chatbot interaction, and structured lessons with quizzes. Authentication is handled via **Google OAuth**, and users can track progress and personalize their experience.

# 📑 Table of Contents

1. [🌍 Project Overview](#-language-learning-platform)  
2. [🧠 Tech Stack](#-tech-stack)  
3. [🚀 Key Features](#-key-features)  
4. [🖼️ System Architecture](#️-system-architecture)  
5. [📁 Project Structure](#-project-structure)  
6. [🗂️ Backend API Modules](#️-backend-api-modules)  
7. [🧩 Frontend Page Routing](#-frontend-page-routing)  
8. [🌐 OAuth + Environment Variables](#-oauth--environment-variables)  
9. [🔧 Installation & Running the App](#-installation--running-the-app)
10. [📸 Screenshots](#-screenshots)  
11. [🚦 Usage & Features Explained](#-usage--features-explained)  
12. [📜 License](#-license)

---

## 🧠 Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React, Bootstrap, Web Speech API    |
| Backend     | Node.js, Express.js, MongoDB        |
| AI Modules  | OpenAI / Hugging Face               |
| Auth        | Google OAuth 2.0, JWT               |

---

## 🚀 Key Features

- 📚 Structured lessons and quizzes to learn progressively  
- 🧠 Flashcards with spaced repetition for efficient memorization  
- 🗣️ Voice-based pronunciation practice using Web Speech API  
- 🤖 AI chatbot for conversational practice and language help  
- 📈 Gamification with XP, streaks, and progress tracking  
- 🔐 Secure Google OAuth login and session management  

---

## 🖼️ System Architecture


![System Architecture](https://github.com/user-attachments/assets/2d7e3d4b-7278-4064-b37e-e6dbae6db69f)


---

## 📁 Project Structure

```

Language-Learning-Platform/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── chatbotController.js
│   │   ├── flashcardController.js
│   │   ├── lessonController.js
│   │   ├── profileController.js
│   │   ├── quizController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Flashcard.js
│   │   ├── Lesson.js
│   │   ├── Profile.js
│   │   ├── Progress.js
│   │   ├── Question.js
│   │   ├── quizResult.js
│   │   ├── User.js
│   │   └── UserLanguagePreference.js
│   ├── routes/
│   │   ├── aiRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── flashcardRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── quizRoutes.js
│   │   └── userRoutes.js
│   ├── utils/
│   │   ├── cache.js
│   │   └── scoringUtils.js
│   ├── uploads/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── data/
│       │   │   └── lessons.json
│       │   ├── Flashcard/
│       │   │   └── FlashcardPage.js
│       │   ├── Learning/
│       │   │   ├── LessonDetail.js
│       │   │   └── LessonList.js
│       │   ├── Practice/
│       │   │   ├── ChatbotPage.js
│       │   │   └── VoiceAssistant.js
│       │   ├── Quizzes/
│       │   │   └── QuizPage.js
│       │   ├── Progress/
│       │   ├── Dashboard.js
│       │   ├── ForgotPassword.js
│       │   ├── GoogleRedirectHandler.js
│       │   ├── Home.js
│       │   ├── Loader.js
│       │   ├── Login.js
│       │   ├── Register.js
│       │   ├── ResetPassword.js
│       │   └── SelectLanguage.js
│       ├── App.js
│       ├── App.css
│       └── index.js
└── .env (frontend/backend)


```

## 🗂️ Backend API Modules

| Route Prefix         | Purpose                             |
|----------------------|--------------------------------------|
| `/api/user`          | User registration, profile, preferences  |
| `/api/lessons`       | Fetch and complete lessons            |
| `/api/quizzes`       | Quiz generation and result handling           |
| `/api/flashcards`    | Flashcard management                |
| `/api/chatbot`       | AI chatbot conversation             |
| `/api/ai`            | Additional AI services (e.g., summaries)  |
| `/api/profile`       | XP, progress, and streak tracking               |

---

## 🧩 Frontend Page Routing

| Route Path         | Component                     | Description                          |
|--------------------|-------------------------------|--------------------------------------|
| `/`                | `Home.js`                     | Login / Welcome screen               |
| `/dashboard`       | `Dashboard.js`                | User progress overview               |
| `/lessons`         | `LessonList.js`               | Browse lessons                       |
| `/lessons/:id`     | `LessonDetail.js`             | View detailed lesson content         |
| `/quizzes/:id`     | `QuizPage.js`                 | Take quizzes                         |
| `/flashcards/:id`  | `FlashcardPage.js`            | Study flashcards                     |
| `/chatbot`         | `ChatbotPage.js`              | Chat with AI assistant               |
| `/speech`          | `VoiceAssistant.js`           | Practice speaking                    |
| `/login`           | `Login.js`                    | Login with Google                    |
| `/register`        | `Register.js`                 | Account registration                 |
| `/profile`         | `SelectLanguage.js`           | Set user preferences                 |

---


## 🌐 OAuth + Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/languagelearning
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

CLIENT_URL=http://localhost:3000
SESSION_SECRET=your_session_secret

OPENROUTER_API_KEY=your_openrouter_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
OPENROUTER_QUIZ_KEY=your_openrouter_quiz_key
FLASHCARD_API_KEY=your_flashcard_api_key
````

---

### Frontend `.env`

```env
REACT_APP_API_URL=http://localhost:5000
```

---

## 🔧 Installation & Running the App

### Prerequisites

* **Node.js** (v14+ recommended)
* **MongoDB** installed and running locally or remotely accessible
* **Google OAuth credentials** (Client ID and Client Secret) — set up in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### Steps

```bash
# Clone the repository
git clone https://github.com/your-username/Language-Learning-Platform.git
cd Language-Learning-Platform

# Backend setup
cd backend
npm install

# Create and configure backend .env file as described above

# Start backend server (with nodemon for development)
npm run dev
```

Open a **new terminal window** and run frontend:

```bash
# Frontend setup
cd frontend
npm install

# Create and configure frontend .env file as described above

# Start frontend app
npm start
```

### Accessing the Application

* Backend API server: [http://localhost:5000](http://localhost:5000)
* Frontend app: [http://localhost:3000](http://localhost:3000)

Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to use the platform.

---

# 🖼️ Screenshots

### 1. Home Page
![Home Page](https://github.com/user-attachments/assets/510d52fb-cbbd-4d77-85ae-a54933d6a060)

### 2. Registration Page
![Registration Page](https://github.com/user-attachments/assets/eaf14fba-10a6-4250-bd0c-ed84ce370c6a)

### 3. Login Page
![Login Page](https://github.com/user-attachments/assets/13ca6e7d-d5e3-45e5-8b27-e3ce9afc77e0)

### 4. Language Selection Page
![Language Selection Page](https://github.com/user-attachments/assets/9e7c0ea0-5e64-4f6a-8fef-422334486d26)

### 5. Lesson List Page
![Lesson List Page](https://github.com/user-attachments/assets/11032f3a-26ad-4205-b36a-a5a8e0928af9)

### 6. Lesson Page
![Lesson Page](https://github.com/user-attachments/assets/e8798970-5568-494d-bd94-65ac971f74a0)

### 7. AI Voice Assistant Page
![AI Voice Assistant Page](https://github.com/user-attachments/assets/723531ec-8ad1-461e-bbdc-9d495fdeb8b7)

### 8. AI ChatBot Page
![AI ChatBot Page](https://github.com/user-attachments/assets/1b47eea0-a5e5-4613-a614-a97b9e52f520)

### 9. Quiz Page
![Quiz Page](https://github.com/user-attachments/assets/4fe83639-43bb-413b-9f50-c043d58c0986)

### 10. Flashcard Page
![FlashCard Page](https://github.com/user-attachments/assets/65da5db1-c8f4-4199-b65b-c7a0112ff979)



## 🚦 Usage & Features Explained

### User Registration and Login

* Sign in securely using **Google OAuth**.
* New users have their profiles and language preferences initialized automatically.

### Learning Lessons & Quizzes

* Browse structured lessons organized by difficulty and topics.
* Complete lessons to unlock quizzes for comprehension checks.
* Quiz results award XP and help maintain learning streaks.

### Flashcards

* Study using flashcards with **spaced repetition** for effective memorization.
* Flashcards adapt dynamically based on your performance.

### Voice Pronunciation Practice

* Use the Web Speech API to practice speaking skills.
* Real-time voice recognition evaluates and gives feedback on your pronunciation.

### AI Chatbot

* Practice natural conversations with an AI-powered chatbot.
* Receive instant assistance with vocabulary, grammar, and sentence construction.

### Progress Tracking & Gamification

* Earn experience points (XP) for completing lessons, quizzes, and flashcards.
* Maintain streaks for consecutive days of learning to motivate consistency.
* Monitor your progress and achievements via a personalized dashboard.

---

## 📜 License

MIT © 2025 Jeevan







