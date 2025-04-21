#  Mail-Sender

Mail-Sender is a secure full-stack web application that allows users to log in with Google, create drafts for different job roles, and send them via Gmail with a single click. Each user can store role-specific drafts, and all emails are sent using their own 16-digit Gmail App Password—safely encrypted in the database.

---

##  Tech Stack

- React.js (Vite)  
- Node.js & Express.js  
- MongoDB & Mongoose  
- Google OAuth 2.0 (Passport.js)  
- Nodemailer (for sending emails)   
- AES-256-CBC encryption  
- Tailwind CSS  
- dotenv for environment variables  
- Toast notifications

---

##  Features

- Google Login (OAuth 2.0)  
- Store and manage drafts per job role  
- Send emails directly via Gmail  
- AES encryption for Gmail App Password  
- Toast notifications for status updates  
- Clean UI with real-time state management  
- MongoDB Atlas for cloud-based storage

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder with the following keys:

MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret 
ENCRYPTION_KEY=your_32_byte_encryption_key

To use this app, each user must provide their **16-digit Gmail App Password**.

### Steps:
1. Visit [https://myaccount.google.com](https://myaccount.google.com)
2. Enable **2-Step Verification** (if not already done)
3. Navigate to **Security > App passwords**
4. Select **App: Mail** and **Device: Other**
5. Generate and copy the **16-digit App Password**
6. Use this in the app (your password will be encrypted and saved)
