import express from 'express';
import './passport.js';
import mongoose from 'mongoose';
import passport from 'passport';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import draftRoutes from './routes/draftRoutes.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';


dotenv.config();
const app = express();
app.use(cookieParser());

app.use(cors({
  origin: ['https://mail-sender-frontt.onrender.com'],
  credentials: true,
}));


app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true, // set to true in production with https
    httpOnly: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


app.use('/', authRoutes);
app.use('/drafts', draftRoutes);


// Example route
app.get('/api/current-user', (req, res) => {
  res.send(req.user);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));