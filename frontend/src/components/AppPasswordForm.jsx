import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AppPasswordForm = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/app-password`,
        { appPassword: password },
        { withCredentials: true }
      );
      
      
      toast.success('App Password saved!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save App Password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Enter App Password</h2>
        <input
          type="password"
          placeholder="16 Digit App Password"
          className="w-full px-4 py-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save
        </button>
      </form>
    </div>
  );
};

export default AppPasswordForm;
