import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// GOOGLE STRATEGY
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://mail-sender-backend-amkc.onrender.com/google/callback',
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('✅ Google Callback Hit');
      console.log('🌐 Profile:', profile);
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName
          });
          await user.save();
        }
        else {
          console.log('👤 User exists:', user.email);
        }
        return done(null, user);
      } catch (err) {
        console.error('❌ Error in Google Strategy:', err);
        return done(err, null);
      }
    }
  )
);

// SERIALIZE USER (store user id in session)
passport.serializeUser((user, done) => {
  console.log('🔐 Serializing user:', user._id);
  done(null, user._id);
});

// DESERIALIZE USER (get full user by id from DB)
passport.deserializeUser(async (id, done) => {
  console.log('🔓 Deserializing user by ID:', id);
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
