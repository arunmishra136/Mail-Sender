import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Homepage from './components/Homepage'
import Logout from './components/Logout'
import axios from 'axios';
import ProfilePage from './components/Profilepage'
import AppPasswordForm from './components/AppPasswordForm';

function App() {
 

  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Homepage/>} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/enter-app-password" element={<AppPasswordForm />} />
      </Routes>
  )
}

export default App
