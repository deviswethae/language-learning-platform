const express = require("express");
const passport = require("passport");
const router = express.Router();

// Controller imports
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  googleAuth, // Updated to use googleAuth method
} = require("../controllers/userController");

// 🔐 Auth Routes

// Register User
router.post("/register", registerUser);

// Login User
router.post("/login", loginUser);

// Google OAuth Login/Register (Programmatic - fallback or mobile clients)
router.post("/google-auth", googleAuth);  // Directly use the googleAuth method from the controller

// 🔁 Google OAuth Flow for Web
// Step 1: Redirect to Google
router.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"],
}));

// Step 2: Handle Google Callback and issue token
router.get("/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const result = await googleAuth(req, res); // Use the updated googleAuth controller method
      // Redirect to frontend with JWT token
      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${result.token}`);
    } catch (error) {
      console.error("❌ Google Callback Error:", error.message);
      res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
    }
  }
);

// 🔁 Password Reset Routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
