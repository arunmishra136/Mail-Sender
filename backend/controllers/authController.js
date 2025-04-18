import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';


// For regular login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 3600000,
    });

    res.json({ user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Login failed', err });
  }
};

// Google logout (also clears session if needed)
export const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ msg: 'Logout error', err });

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ msg: 'Failed to destroy session' });

      res.clearCookie('connect.sid', {
        path: '/',
        httpOnly: true,
        secure: false,  // Set true in production with HTTPS
        sameSite: 'Lax'
      });
      res.status(200).json({ msg: 'Logged out successfully' });
    });
  });
};


// This works for both JWT and Google-authenticated users
export const getMe = async (req, res) => {
  //console.log("req.session:", req.session); 
  //console.log("User iswa: ",req.user);
  //console.log("req.session.passport:", req.session?.passport); 


  if (req.user) {
    return res.status(200).json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      drafts: req.user.drafts,
      hashedAppPassword: req.user.hashedAppPassword,
    });
  }
  // If not authenticated
  //return res.status(200).json({message: 'sc'});
  return res.status(401).json({ message: 'Not authenticated' });
};

export const googleAuth = passport.authenticate('google', {
  scope: [
    'profile', 
    'email',
  ],
});

export const googleCallback = passport.authenticate('google', {
  successRedirect: 'https://mail-sender-frontt.onrender.com/profile',
  failureRedirect: 'https://mail-sender-frontt.onrender.com/login',
  session: true // Ensure session is maintained
});

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes
const IV_LENGTH = 16; // For AES, this is always 16

export function encrypt(password) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export const saveAppPassword = async (req, res) => {
  const { appPassword } = req.body;
  const userId = req.user._id;

  try {
    const encryptedPassword = encrypt(appPassword);

    await User.findByIdAndUpdate(userId, { hashedAppPassword: encryptedPassword });

    res.status(200).json({ message: 'App password saved successfully' });
  } catch (error) {
    console.error('❌ Error saving app password:', error);
    res.status(500).json({ error: 'Failed to save app password' });
  }
};