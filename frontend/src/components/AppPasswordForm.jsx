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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Enter App Password</h2>
  
        <p className="text-gray-700 mb-4 text-sm">
          📌 Follow these steps to create a 16-digit App Password from your Gmail account:
        </p>
        <ol className="list-decimal list-inside text-gray-700 text-sm mb-6 space-y-1">
          <li>Go to <a href="https://myaccount.google.com/security" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Account Security</a>.</li>
          <li>Enable <strong>2-Step Verification</strong> if not already enabled.</li>
          <li>Scroll down or search and click on <strong>App Passwords</strong>.</li>
          <li>Select the app as <em>Mail</em> and the device as <em>Other</em> (give any name).</li>
          <li>Click <strong>Generate</strong>, and a 16-digit password will be shown.</li>
          <li>Copy that password and paste it below.</li>
        </ol>
  
        <input
          type="password"
          placeholder="16 Digit App Password"
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
  
        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Save App Password
        </button>
      </form>
    </div>
  );  
};

export default AppPasswordForm;
