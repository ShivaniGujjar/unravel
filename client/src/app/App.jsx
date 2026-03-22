import { RouterProvider } from 'react-router-dom';
import routes from './app.routes'; // 👈 IMPORTANT (extension add karo)
import {useAuth}  from '../features/auth/hooks/useAuth';
import { useEffect } from 'react';


function App() {
  const auth = useAuth();

  useEffect(() => {
    auth.handleGetMe();
  }, [])

  return <RouterProvider router={routes} />;
}

export default App;