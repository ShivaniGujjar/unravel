import { useDispatch, useSelector } from "react-redux";
import { register, login, getMe } from "../services/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true));
            const data = await register({ email, username, password });
            return data; // ✅ Return data to the component
        } catch (error) {
            const msg = error.response?.data?.message || "Registration failed";
            dispatch(setError(msg));
            throw error; // ✅ Throw error so App.jsx knows it failed
        } finally {
            dispatch(setLoading(false));
        }
    }

    // features/auth/hooks/useAuth.js

async function handleLogin({ email, password }) {
    try {
        dispatch(setLoading(true));
        const data = await login({ email, password });
        
        // 🚀 THE FIX: Pura 'data' bhejo (jisme user AND token dono honge)
        dispatch(setUser(data)); 
        
        return data;
    } catch (err) {
        // ... rest same
    }
}

    // features/auth/hooks/useAuth.js

async function handleGetMe() {
    try {
        dispatch(setLoading(true));
        const data = await getMe(); 
        
        // 🚀 THE FIX: Yahan bhi 'data.user' ki jagah pura 'data' bhejo
        // Taaki refresh hone par token dubara localStorage mein refresh ho jaye
        dispatch(setUser(data)); 
        
        return data; 
    } catch (err) {
        dispatch(setUser(null)); 
        const msg = err.response?.data?.message || "Failed to fetch user data";
        dispatch(setError(msg));
        throw err; 
    } finally {
        dispatch(setLoading(false));
    }
}
    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        user,
        loading,
        error    
    };
}