import { Router } from 'express';
import { signup, login, logout,getMe,googleAuth, googleCallback,saveAppPassword } from '../controllers/authController.js';
import { sendMail } from '../controllers/mailController.js';

const router = Router();
  

router.post('/register', signup);
router.post('/login', login); 
router.get('/me', getMe); 
router.post('/logout', logout);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.post('/send', sendMail);
router.post('/app-password',saveAppPassword);


export default router;