import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Homepage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [draftText, setDraftText] = useState('');
  const [email, setEmail] = useState('');
  const [firm, setFirm] = useState('');
  const [userDrafts, setUserDrafts] = useState([]);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          setIsLoggedIn(true);
          const extractedRoles = Array.isArray(data.drafts)
            ? data.drafts.map((d) => d.role)
            : [];
          setRoles(extractedRoles);
          setUserDrafts(data.drafts || []);

          if (data.drafts.length > 0) {
            setSelectedRole(data.drafts[0].role);
            setDraftText(data.drafts[0].draftText);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Error checking login", err);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  useEffect(() => {
    const draftObj = userDrafts.find((d) => d.role === selectedRole);
    if (draftObj) setDraftText(draftObj.draftText);
  }, [selectedRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("draft text in home: ",draftText);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/send`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          selectedRole,
          firmName: firm,
          draftText,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Email sent successfully');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Check your 16 digit app password');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div className="w-full h-16 bg-zinc-800 flex justify-end items-center px-10 shadow-md">
        <a href="/profile" className="text-white font-semibold hover:text-gray-300 transition duration-200 mr-6">
          Profile
        </a>
        {isLoggedIn ? (
          <a href="/logout" className="text-red-500 font-semibold hover:text-red-300 transition duration-200">
            Logout
          </a>
        ) : (
          <a href="/login" className="text-red-500 font-semibold hover:text-red-300 transition duration-200">
            Login
          </a>
        )}
      </div>

      {/* Form Section */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-zinc-400 shadow-lg rounded-2xl p-8 w-full max-w-md min-h-[500px] flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center text-zinc-800 mb-6">Send Application</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Recruiter's Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recruiter's Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Role Selection */}
            {isLoggedIn && roles.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Firm's Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firm's Name</label>
              <input
                type="text"
                value={firm}
                onChange={(e) => setFirm(e.target.value)}
                placeholder="Company Inc."
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {selectedRole && (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Draft for "{selectedRole}"</label>
    <textarea
      value={draftText}
      onChange={(e) => setDraftText(e.target.value)}
      placeholder="Draft text will appear here..."
      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      rows={6}
      required
    />
  </div>
)}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
