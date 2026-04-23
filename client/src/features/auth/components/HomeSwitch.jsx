// src/features/auth/components/HomeSwitch.jsx
import { useSelector } from 'react-redux';
import LandingPage from '../pages/LandingPage'; 
import Dashboard from '../../chat/pages/Dashboard';
import Loader from './Loader'; // 👈 Loader import karo

export const HomeSwitch = () => {
  const { user, loading } = useSelector((state) => state.auth);

  // 🚀 THE FIX: Jab tak authentication process (loading) chal rahi hai,
  // tab tak koi decision mat lo. User ko Loader dikhao.
  if (loading) {
    return <Loader />;
  }

  // Ab loading khatam ho chuki hai, ab decide karo:
  // User mil gaya (Backend verified) -> Dashboard
  // User nahi mila -> Landing Page
  if (user) {
    return <Dashboard />;
  }

  return <LandingPage />;
};