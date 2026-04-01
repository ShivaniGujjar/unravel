import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true, // ✅ Tokens are now always included
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