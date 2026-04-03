import { RouterProvider } from 'react-router-dom';
import routes from './app.routes'; 
import { useAuth } from '../features/auth/hooks/useAuth';
import { useEffect } from 'react';

function App() {
  const auth = useAuth();

  useEffect(() => {
    // 🚀 THE FIX: Check if user exists in localStorage first
    const userInStorage = localStorage.getItem("user");

    if (!userInStorage) {
      console.log("No user in storage, skipping auto-login.");
      return; // 👈 STOP: Don't call the API if user is logged out
    }

    // Only if user exists, we verify with the backend
    auth.handleGetMe();
  }, []); // Only run once on mount

  return <RouterProvider router={routes} />;
}

export default App;