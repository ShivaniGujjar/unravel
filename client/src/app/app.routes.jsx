import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Dashboard from '../features/chat/pages/Dashboard';
import LandingPage from '../features/auth/pages/LandingPage';
import { Protected } from '../features/auth/components/protected';
import { HomeSwitch } from '../features/auth/components/HomeSwitch'; 

const routes = createBrowserRouter([
  // 1️⃣ AUTH ROUTES FIRST (Completely independent)
  {
    path: '/login',
    element: <Login />, 
  },
  {
    path: '/register',
    element: <Register />,
  },

  // 2️⃣ THE SMART HOME
  {
    path: '/', 
    element: <HomeSwitch />, 
  },

  // 3️⃣ PROTECTED FEATURE ROUTES
  {
    path: '/chat/:chatId', 
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },

  // 4️⃣ CATCH-ALL (Must be last)
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

export default routes;