import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';
import User from '../models/User.js';

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 bytes
const IV_LENGTH = 16;

function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(':');
  if (!ivHex || ivHex.length !== 32) {
    throw new Error('Invalid IV length, must be 16 bytes (32 hex characters)');
  }
  const iv = Buffer.from(ivHex, 'hex');
  if (!encrypted) {
    throw new Error('Encrypted data is missing');
  }
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}


export const sendMail = async (req, res) => {
  const { to, selectedRole, firmName, draftText } = req.body;
  //console.log(req.body);
  
  const user = req.user;
  //console.log("userR:",user);

  const subject = `Application for ${selectedRole} at ${firmName}`;
  const text = draftText;

  try {
    const dbUser = await User.findById(user._id);
    //console.log(dbUser);

    if (!dbUser || !dbUser.hashedAppPassword) {
      return res.status(400).json({ error: 'App password not set in the database' });
    }

    const decryptedAppPassword = decrypt(dbUser.hashedAppPassword);
    //console.log("pass:",decryptedAppPassword);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: user.email,
        pass: decryptedAppPassword,
      },
    });

    const mailOptions = {
      from: `"${user.name}" <${user.email}>`,
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent!');
    res.status(200).json({ message: 'Email sent successfully', result });
    

  } catch (error) {
    console.error('❌ Failed to send email:', error);
    res.status(500).json({ error: 'Email sending failed, Check your 16 digit app password', details: error.message });
    
  }
};
