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
    // 🆕 Create a new chat entry in the sidebar
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      state.chats[chatId] = {
        id: chatId,
        _id: chatId,
        title: title || "New Chat",
        messages: [],
        lastUpdated: new Date().toISOString()
      };
    },

    // 📩 Add a complete message (User or AI)
    addNewMessage: (state, action) => {
      const { chatId, content, role } = action.payload;

      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          _id: chatId,
          title: "New Chat",
          messages: [],
          lastUpdated: new Date().toISOString()
        };
      }

      state.chats[chatId].messages.push({ content, role });
      state.chats[chatId].lastUpdated = new Date().toISOString();
    },

    // ⚡ THE STREAMING LOGIC: Appends chunks to the last AI message
    updateStreamingMessage: (state, action) => {
      const { chatId, content } = action.payload;
      const chat = state.chats[chatId];

      if (chat && chat.messages.length > 0) {
        const lastMsgIndex = chat.messages.length - 1;
        const lastMsg = chat.messages[lastMsgIndex];

        // 🛡️ Guard: Only update if the last message is from the AI
        if (lastMsg.role === "ai") {
          // If it's the very first chunk or a placeholder, replace it
          if (lastMsg.content === "..." || lastMsg.content === "") {
            lastMsg.content = content;
          } else {
            // 🚀 SUCCESS: Append the new word/chunk
            lastMsg.content += content; 
          }
          
          // Update timestamp to force the UI to recognize a change in the chat object
          chat.lastUpdated = new Date().toISOString();
        }
      }
    },

    // 🔄 Update the last message completely (Used for final sync when API finishes)
    updateLastMessage: (state, action) => {
      const { chatId, content } = action.payload;
      const chat = state.chats[chatId];
      
      if (chat && chat.messages.length > 0) {
        const lastMsg = chat.messages[chat.messages.length - 1];
        lastMsg.content = content;
        chat.lastUpdated = new Date().toISOString();
      }
    },

    // 📜 Set multiple messages (Used when loading an existing chat)
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (!chatId) return;

      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          id: chatId,
          _id: chatId,
          title: "Chat",
          messages: [],
          lastUpdated: new Date().toISOString()
        };
      }
      state.chats[chatId].messages = messages;
    },

    // 📂 Global State Setters
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    // ✕ Delete a chat
    deleteChat: (state, action) => {
      const { chatId } = action.payload;
      delete state.chats[chatId];
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    }
  }
});

// Export all actions
export const { 
  setChats, 
  setCurrentChatId, 
  setLoading, 
  setError, 
  createNewChat, 
  addNewMessage, 
  deleteChat, 
  updateLastMessage, 
  setMessages,
  updateStreamingMessage 
} = chatSlice.actions;

export default chatSlice.reducer;