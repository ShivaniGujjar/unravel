// src/features/auth/components/HomeSwitch.jsx
import { useSelector } from 'react-redux';
import LandingPage from '../pages/LandingPage'; 
import Dashboard from '../../chat/pages/Dashboard';

export const HomeSwitch = () => {
  const { user, loading } = useSelector((state) => state.auth);

  // 🚀 INSTANT CHECK: Look at storage first
  const hasToken = localStorage.getItem("user");

  // If Redux is still "thinking", show a dark background to prevent white flashes
  if (loading) {
    return <div className="h-screen w-screen bg-[#020617]" />;
  }

  // If we have a user in Redux OR a session in storage, show Dashboard
  if (user || hasToken) {
    return <Dashboard />;
  }

  // Otherwise, stay on Landing Page
  return <LandingPage />;
};