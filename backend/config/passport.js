const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || "http://localhost:5000"}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        // Create a new user if not found
        if (!user) {
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            photo: profile.photos?.[0]?.value,
          });
          await user.save();
        }

        // Build user payload to return (including token + simplified profile)
        const userWithToken = {
          _id: user._id,
          name: user.name,
          email: user.email,
          photo: user.photo,
          accessToken,
          profile: {
            id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
          },
        };

        return done(null, userWithToken);
      } catch (err) {
        console.error("GoogleStrategy error:", err);
        return done(err, null);
      }
    }
  )
);

// Save user to session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Restore user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});
