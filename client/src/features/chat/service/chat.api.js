import axios from "axios";

// Ensure it looks like this in chat.api.js
const api = axios.create({
    baseURL: window.location.hostname === "localhost" 
        ? "http://localhost:3000" 
        : "https://unravel-bm4y.onrender.com", 
    withCredentials: true,
});


api.interceptors.request.use((config) => {
    try {
        const userData = localStorage.getItem("user");
        let token = localStorage.getItem("token"); // Check for a direct token first

        if (userData && userData !== "[object Object]") {
            const parsed = JSON.parse(userData);
            // 🚀 Check all possible paths where the token might be hiding
            token = token || parsed.token || (parsed.data && parsed.data.token) || (parsed.user && parsed.user.token);
        }

        if (token && token !== "undefined" && token !== "null") {
            // Clean up the token string (remove quotes if they exist)
            const cleanToken = token.toString().replace(/['"]+/g, '').trim();
            config.headers.Authorization = `Bearer ${cleanToken}`;
            // console.log("Header attached successfully!"); // Debug only
        } else {
            console.warn("Interceptor: No valid token found in LocalStorage");
        }
    } catch (error) {
        console.error("Interceptor Error:", error);
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 💬 SEND MESSAGE
export const sendMessage = async (message, chatId) => {
    const response = await api.post("/api/chat/message", { message, chatId }); 
    return response.data;
};

// 📂 GET ALL CHATS (Sidebar)
export const getChats = async () => {
    const response = await api.get("/api/chat/");
    return response.data;
}   

// 📂 GET MESSAGES (Chat History)
export const getMessages = async (chatId) => {
    // 🚀 FIX: Added '/messages' at the end to match your backend route
    const response = await api.get(`/api/chat/${chatId}/messages`); 
    return response.data;
}

// 🗑️ DELETE CHAT
export const deleteChat = async (chatId) => {
    // 🚀 FIX: Added '/delete' to match your backend route
    const response = await api.delete(`/api/chat/delete/${chatId}`);
    return response.data;
}


// Add this to chat.api.js
// client/src/features/chat/service/chat.api.js

export const renameChat = async (chatId, title) => {
  try {
    // 🚀 THE FIX: Added /api and kept 'chat' singular
    // Path must be: /api/chat/ID/rename
    const response = await api.patch(`/api/chat/${chatId}/rename`, { title });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};