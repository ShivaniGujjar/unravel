import { initializeSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat ,renameChat } from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  deleteChat as deleteChatAction,
  updateLastMessage,
  setMessages,
  updateChatTitle
} from "../chat.slice";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

export const useChat = () => {
  const dispatch = useDispatch();

  // 💬 SEND MESSAGE
  const handleSendMessage = useCallback(async (message, chatId) => {
    dispatch(setLoading(true));

    try {
      // 1. Check if this is the start of a brand new conversation
      const isNewChat = !chatId || chatId === "null" || chatId.startsWith("temp-");
      const apiChatId = isNewChat ? null : chatId;
      
      // 2. Call the Backend API
      // Note: The backend will start streaming chunks via Socket.io IMMEDIATELY
      const data = await sendMessage(message, apiChatId);
      const { chat, aiMessage } = data;

      // 3. Handle NEW Chat Synchronization
      if (isNewChat && chat) {
        // Remove the temporary state if it existed
        if (chatId) {
          dispatch(deleteChatAction({ chatId })); 
        }

        // 🚀 CRITICAL FIX: Create the chat in Redux BEFORE setting messages
        dispatch(createNewChat({
          chatId: chat._id,
          title: chat.title
        }));

        // Initialize the message array so the 'chat-chunk' listener in Dashboard has a place to write
        dispatch(setMessages({ 
          chatId: chat._id, 
          messages: [
            { role: "user", content: message },
            { role: "ai", content: aiMessage.content } // Final content from API
          ] 
        }));

        dispatch(setCurrentChatId(chat._id));
        
        return { newId: chat._id }; 

      } else {
        // 4. Handle EXISTING Chat Update
        // We update the final content in Redux once the API call finishes
        dispatch(updateLastMessage({
          chatId,
          content: aiMessage.content
        }));
        
        return { newId: chatId };
      }

    } catch (error) {
      console.error("Hook Error:", error);
      dispatch(setError(error.message));
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // 📂 GET ALL CHATS (Used for the Sidebar)
  const handleGetChats = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await getChats();
      const { chats } = data;

      dispatch(setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            _id: chat._id,
            title: chat.title,
            messages: [], // We only load messages when a chat is clicked
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {})
      ));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // 📂 OPEN SPECIFIC CHAT (Used when clicking sidebar or reloading page)
  const handleOpenChat = useCallback(async (chatId) => {
  if (!chatId || chatId.startsWith("temp-")) return;

  // 🚀 Step A: ID set karo turant
  dispatch(setCurrentChatId(chatId));
  
  try {
    const data = await getMessages(chatId);
    // Step B: Messages dalo
    dispatch(setMessages({ chatId, messages: data.messages }));
  } catch (error) {
    console.error("Reload Fetch Error:", error);
  }
}, [dispatch]);


  // Inside useChat.js
const handleRenameChat = useCallback(async (chatId, newTitle) => {
  try {
    const data = await renameChat(chatId, newTitle);
    
    // 🚀 This makes the sidebar change the name immediately!
    if (data.success || data._id) { 
      dispatch(updateChatTitle({ chatId, title: newTitle })); 
    }
  } catch (err) {
    console.error("Rename Error in Hook:", err);
  }
}, [dispatch]);

  // 🗑️ DELETE CHAT
  const handleDeleteChat = useCallback(async (chatId) => {
    try {
      await deleteChat(chatId);
      dispatch(deleteChatAction({ chatId }));
    } catch (error) {
      dispatch(setError(error.message));
    }
  }, [dispatch]);

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
    handleDeleteChat,
    handleRenameChat,
    
  };
};