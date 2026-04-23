import { RouterProvider } from 'react-router-dom';
import routes from './app.routes'; 
import { useAuth } from '../features/auth/hooks/useAuth';
import { useEffect, useState } from 'react';
import Loader from '../features/auth/components/Loader';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '../features/auth/auth.slice'; // Path check kar lena

function App() {
  const auth = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const userInStorage = localStorage.getItem("user");
      
      if (userInStorage) {
        try {
          // Token ya user confirm karne ke liye API call
          await auth.handleGetMe(); 
        } catch (err) {
          console.error("Auth initialization failed", err);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      }
      
      // Sab kuch set hone ke baad loading false karein
      setIsAppLoading(false);
    };

    initializeApp();
  }, []); 

  if (isAppLoading) {
    return <Loader />; // Jab tak ye dikhega, redirection nahi hoga
  }

  return <RouterProvider router={routes} />;
}

export default App;