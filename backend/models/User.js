import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  hashedAppPassword: { type: String },
  drafts: [
    {
      role: String,
      draftText: String,
    },
  ],
});


const User = mongoose.model('User', userSchema);
export default User;
