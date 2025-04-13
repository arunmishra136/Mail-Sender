import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
          withCredentials: true, // send cookie
        });
        navigate('/login');
        toast.success("Logged Out Successfully");
      } catch (err) {
        console.error('Error during logout:', err);
        navigate('/login'); // redirect even if API fails
      }
    };

    logout();
  }, []);

  return (
    <div className="logout-page">
      <h2>Logging you out...</h2>
    </div>
  );
};

export default Logout;
