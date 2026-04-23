import { RouterProvider } from 'react-router-dom';
import routes from './app.routes'; 
import { useAuth } from '../features/auth/hooks/useAuth';
import { useEffect, useState } from 'react';
import Loader from '../features/auth/components/Loader'; // 👈 Loader import karo

function App() {
  const auth = useAuth();
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    const userInStorage = localStorage.getItem("user");

    const initializeApp = async () => {
      if (userInStorage) {
        // Backend se user verify hone tak wait karo
        await auth.handleGetMe();
      }
      
      // Chota sa delay for professional feel (optional)
      setTimeout(() => {
        setIsAppLoading(false);
      }, 1500); 
    };

    initializeApp();
  }, []);

  // 🚀 THE FIX: Jab tak loading hai, sirf Loader dikhao
  if (isAppLoading) {
    return <Loader />;
  }

  return <RouterProvider router={routes} />;
}

export default App;