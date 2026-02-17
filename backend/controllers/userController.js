const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');  // Added the Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);  // Initialize Google OAuth2 client

// 🔐 JWT Token Generator
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your_jwt_secret", {
    expiresIn: "2d", // Token expires in 2 days
  });
};

// 📌 Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Ensure all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if the user already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the user's password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      language: "", // Optional fields for future use
      level: "",
    });

    // Generate a JWT token for the user
    const token = generateToken(newUser._id);

    // Respond with success and user details
    return res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        language: newUser.language,
        level: newUser.level,
      },
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);  // More detailed error logging
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// 📌 Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Ensure email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token for the logged-in user
    const token = generateToken(user._id);

    // Respond with success and user details
    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        language: user.language,
        level: user.level,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);  // More detailed error logging
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// 📌 Google OAuth Register/Login
exports.googleAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: "Google ID token is required" });
  }

  try {
    // Verify Google ID token using Google's library
    const ticket = await googleClient.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Make sure this is your correct Google Client ID
    });

    const { name, email } = ticket.getPayload();  // Get name and email from the token's payload

    // Check if user already exists in the database
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        name,
        email,
        password: "",  // Passwordless login for Google authentication
        language: "",
        level: "",
      });
    }

    // Generate JWT for your app's login
    const token = generateToken(user._id);

    // Respond with success and user details
    return res.json({
      message: "Google login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        language: user.language,
        level: user.level,
      },
    });
  } catch (error) {
    console.error("❌ Google Auth Error:", error.message);
    return res.status(500).json({ message: "Google Authentication failed", error: error.message });
  }
};

// 📌 Forgot Password - Send Reset Link
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  // Ensure email is provided
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token that will expire in 1 hour
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    // Generate the password reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Set up the email transporter using Gmail service
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send the reset password email to the user
    await transporter.sendMail({
      from: `"Language Platform Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Password Reset Request",
      html: ` 
        <p>Hello ${user.name || "User"},</p>
        <p>You requested to reset your password.</p>
        <p><a href="${resetLink}" target="_blank">Click here to reset your password</a></p>
        <p>This link is valid for 1 hour.</p>
      `,
    });

    return res.status(200).json({ message: "Reset link sent to email!" });
  } catch (error) {
    console.error("❌ Forgot Password Error:", error.message);  // More detailed error logging
    return res.status(500).json({ message: "Failed to send reset email", error: error.message });
  }
};

// 📌 Reset Password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  // Ensure password is provided
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  try {
    // Verify the reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");

    // Find the user based on the token's decoded userId
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    // Hash the new password and save it to the database
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    console.error("❌ Reset Password Error:", error.message);  // More detailed error logging
    return res.status(400).json({ message: "Invalid or expired token", error: error.message });
  }
};
