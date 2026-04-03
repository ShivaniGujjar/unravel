import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null
  },
  reducers: {
    // 🆕 Helper to ensure chat object structure is ALWAYS consistent
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      const id = chatId.toString(); // Ensure string ID
      state.chats[id] = {
        _id: id,
        id: id,
        title: title || "New Chat",
        messages: [],
        lastUpdated: new Date().toISOString()
      };
    },

    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;
      const id = chatId.toString();

      if (!state.chats[id]) {
        state.chats[id] = {
          _id: id, id: id, title: "New Chat", messages: [], lastUpdated: new Date().toISOString()
        };
      }

      state.chats[id].messages.push({ content, role });
      state.chats[id].lastUpdated = new Date().toISOString();
    },

    // ⚡ STREAMING FIX: We only update the content, 
    // avoiding the forced timestamp update on every single chunk to prevent UI lag.
    updateStreamingMessage: (state, action) => {
      const { chatId, content } = action.payload;
      const chat = state.chats[chatId];

      if (chat && chat.messages.length > 0) {
        const lastMsg = chat.messages[chat.messages.length - 1];

        if (lastMsg.role === "ai") {
          // If first chunk, replace placeholder
          if (lastMsg.content === "..." || lastMsg.content === "") {
            lastMsg.content = content;
          } else {
            lastMsg.content += content; 
          }
        }
      }
    },

    // 🔄 FINAL SYNC: Update timestamp only when the message is fully finished
    updateLastMessage: (state, action) => {
      const { chatId, content } = action.payload;
      const chat = state.chats[chatId];
      
      if (chat && chat.messages.length > 0) {
        const lastMsg = chat.messages[chat.messages.length - 1];
        lastMsg.content = content;
        chat.lastUpdated = new Date().toISOString(); // Update order only at the end
      }
    },

    setMessages: (state, action) => {
  const { chatId, messages } = action.payload;
  if (!chatId) return;

  // 🚀 FIX: Agar reload pe chat object nahi hai, toh usey create karo
  if (!state.chats[chatId]) {
    state.chats[chatId] = {
      id: chatId,
      _id: chatId,
      title: "Loading...", // API se title aane tak
      messages: [],
      lastUpdated: new Date().toISOString()
    };
  }
  state.chats[chatId].messages = messages;
},

    setChats: (state, action) => {
      // Normalize incoming chats from backend to ensure they have both id and _id
      const normalized = {};
      Object.values(action.payload).forEach(chat => {
        const id = chat._id || chat.id;
        normalized[id] = { ...chat, id: id, _id: id };
      });
      state.chats = normalized;
    },

    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload ? action.payload.toString() : null;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    updateChatTitle: (state, action) => {
      const { chatId, title } = action.payload;
      const id = chatId.toString();
      if (state.chats[id]) {
        state.chats[id].title = title;
      }
    },

    deleteChat: (state, action) => {
      const { chatId } = action.payload;
      const id = chatId.toString();
      delete state.chats[id];
      if (state.currentChatId === id) {
        state.currentChatId = null;
      }
    }
  }
});

export const { 
  setChats, setCurrentChatId, setLoading, setError, 
  createNewChat, addNewMessage, deleteChat, updateLastMessage, 
  setMessages, updateStreamingMessage, updateChatTitle
} = chatSlice.actions;

export default chatSlice.reducer;