const express = require("express");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const chatbotRoutes = require("./routes/chatbotRoutes");
const quizRoutes = require("./routes/quizRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
require("./config/passport"); // Google OAuth strategy

const app = express();

// 🌐 Connect to MongoDB
connectDB();

// 🛡️ Enable CORS for frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Make sure CLIENT_URL is correctly set
    credentials: true,
  })
);

// 🧠 Parse incoming JSON
app.use(express.json());

// 🧾 Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// 🛂 Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// === ROUTES ===

// 📌 Authentication Routes
app.use("/api", userRoutes);

// 📌 Google OAuth
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// 📌 Google OAuth Callback with Token and User Info Redirect
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=failed_oauth`,
    session: true,
  }),
  (req, res) => {
    const token = req.user?.accessToken;
    const user = req.user?.profile;

    if (!token || !user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=missing_data`);
    }

    const encodedUser = encodeURIComponent(JSON.stringify(user));
    // Redirecting back to client with token and user data
    res.redirect(`${process.env.CLIENT_URL}/login?token=${token}&user=${encodedUser}`);
  }
);

// 📌 Session Check
app.get("/auth/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// 📌 Logout
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error during logout", error: err });
    }
    res.redirect(`${process.env.CLIENT_URL}/login`);
  });
});

// ✅ Feature Routes
app.use("/api/lessons", lessonRoutes);
app.use("/api", flashcardRoutes);
app.use("/api", chatbotRoutes);
app.use("/api", quizRoutes);

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
