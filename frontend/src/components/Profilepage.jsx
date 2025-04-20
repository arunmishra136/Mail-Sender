import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', drafts: [] });
  const [selectedRole, setSelectedRole] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  axios.defaults.withCredentials = true;

  // ✅ Fetch logged-in user from session (server-side)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, { withCredentials: true });
        //console.log("res: ",res);
        setUser(res.data);
        setUserId(res.data._id);
      } catch (err) {
        //console.log("Error in profile");
        console.error(err);
        
        navigate('/login'); // Redirect to login if unauthenticated
      } finally {
        setLoading(false);
      }
    };
  
    fetchUser();
  }, []);


useEffect(() => {
  axios.get('https://mail-sender-backend-amkc.onrender.com/api/check-auth', {
    withCredentials: true, // This ensures cookies (like connect.sid) are sent
  })
  .then((res) => {
    console.log('✅ Check Auth:', res.data);
  })
  .catch((err) => {
    console.error('❌ Not authenticated:', err.response?.data || err.message);
  });
}, []);

  
  
  const handleGoHome = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, { withCredentials: true });
      
      if (!res.data.hashedAppPassword) {
        navigate('/enter-app-password');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      navigate('/login'); // fallback if user is not authenticated
    }
  };
  
  const handleSetPassword = () => {
    navigate('/enter-app-password');
  };
  

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    const found = user.drafts.find((d) => d.role === role);
    setDraftContent(found ? found.draftText : '');
  };

  const handleDraftChange = (e) => setDraftContent(e.target.value);

  const handleDeleteRole = async () => {
    if (!selectedRole || !userId) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/drafts/delete`, {
        data: { userId, role: selectedRole },
      });
      const updatedDrafts = user.drafts.filter((d) => d.role !== selectedRole);
      setUser({ ...user, drafts: updatedDrafts });
      setSelectedRole('');
      setDraftContent('');
      toast.success('Role Deleted');
    } catch (err) {
      console.error('Error deleting draft:', err);
      toast.error('Failed to delete role.');
    }
  };

  const handleSaveDraft = async () => {
    if (!selectedRole || !draftContent || !userId) return;
    const existing = user.drafts.find((d) => d.role === selectedRole);
    const endpoint = existing ? 'update' : 'create';
    const method = existing ? 'put' : 'post';
    // console.log('Saving Draft:', {
    //   userId,
    //   role: selectedRole,
    //   draftText: draftContent
    // });
    
    try {
      await axios[method](`${import.meta.env.VITE_API_URL}/drafts/${endpoint}`, {
        userId,
        role: selectedRole,
        draftText: draftContent,
      });
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/me`, {
        withCredentials: true,
      });
      setUser(res.data);
      toast.success('Draft saved!');
    } catch (err) {
      console.error('Error saving draft:', err);
      toast.error('Failed to save draft.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/logout`);
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-400 p-6">
      <div className="max-w-3xl mx-auto bg-stone-300 shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-zinc-800 mb-2">Profile</h1>

        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-lg font-semibold text-gray-700">Name: {user.name}</p>
            <p className="text-lg font-semibold text-gray-700 mt-2">Email: {user.email}</p>
          </div>
          <button
           onClick={handleGoHome}
           className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
         >
           Go Home
         </button>

         <button
          onClick={handleSetPassword}
          className="bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200"
        >
          Set App Password
        </button>
        </div>

        <h2 className="text-xl font-semibold text-zinc-800 mb-3">Select or Add Role</h2>
        <div className="flex flex-wrap gap-3 mb-4">
        {Array.isArray(user.drafts) && user.drafts.map((d) => (
            <button
              key={d.role}
              className={`px-4 py-2 rounded-full font-medium ${
                selectedRole === d.role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-blue-100'
              }`}
              onClick={() => handleRoleSelect(d.role)}
            >
              {d.role}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Enter new role or select existing"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        />

        <textarea
          rows="7"
          value={draftContent}
          onChange={handleDraftChange}
          placeholder="Write your draft here..."
          className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSaveDraft}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
        >
          Save Draft
        </button>

        <button
          onClick={handleDeleteRole}
          className="mt-4 ml-4 bg-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-600 transition"
        >
          Delete Role
        </button>

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
