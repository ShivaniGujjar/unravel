import { createBrowserRouter } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import Dashboard from '../features/chat/pages/Dashboard';
import { Protected } from '../features/auth/components/protected';
import { Navigate } from 'react-router-dom';


const routes = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',   // ✅ ADD THIS
    element: 
    <Protected>
      <Dashboard />
    </Protected>
    ,
  },

  {
    path: '/dashboard',
    element: 
    <Navigate to="/" replace />
    ,
  }
  
]);

export default routes;