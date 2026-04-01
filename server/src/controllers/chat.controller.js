import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js";

// 🛡️ Helper to ensure we always get the User ID correctly regardless of the DB driver
const getSafeUserId = (user) => {
  if (!user) return null;
  return user._id ? user._id.toString() : user.id?.toString();
};

export async function sendMessage(req, res) {
  try {
    const { message, chatId } = req.body; 
    const userId = getSafeUserId(req.user);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    let chat = null;

    // 1. Identify the Chat
    if (chatId && chatId !== "null" && !chatId.startsWith("temp-")) {
      chat = await chatModel.findOne({ _id: chatId, user: userId });
    }

    // 2. Create Chat if it doesn't exist
    if (!chat) {
      let title = "New Chat";
      try {
        title = await generateChatTitle(message);
      } catch (e) {
        console.error("Title generation failed, using default:", e.message);
      }

      chat = await chatModel.create({
        user: userId,
        title: title
      });
    }

    const finalChatId = chat._id;

    // 👤 3. Save User Message to Database
    await messageModel.create({
      chat: finalChatId,
      content: message,
      role: "user"
    });

    // 📜 4. Get Full History for AI Context
    const history = await messageModel.find({ chat: finalChatId }).sort({ createdAt: 1 });

    // 🤖 5. GENERATE STREAMING RESPONSE
    // This calls your Mistral service and pipes chunks to Socket.io
    const fullResult = await generateResponse(history, (chunk) => {
      if (req.io) {
        // 📡 Emit specifically to the User's private room
        req.io.to(userId).emit("chat-chunk", {
          chatId: finalChatId,
          content: chunk
        });
      }
    });

    // 💾 6. Save Final AI Message to Database
    const aiMessage = await messageModel.create({
      chat: finalChatId,
      content: fullResult || "I couldn't generate a response.",
      role: "ai"
    });

    // ⏱️ 7. Update Chat Timestamp for Sidebar Sorting
    chat.updatedAt = Date.now();
    await chat.save();

    // 8. Return final data to Frontend
    res.status(201).json({
      chat,
      aiMessage
    });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

export async function getChats(req, res) {
  try {
    const userId = getSafeUserId(req.user);
    const chats = await chatModel.find({ user: userId }).sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Chats retrieved successfully",
      chats
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching chats" });
  }
}

export async function getMessages(req, res) {
  try {
    const { chatId } = req.params;
    const userId = getSafeUserId(req.user);

    const chat = await chatModel.findOne({ _id: chatId, user: userId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

    res.status(200).json({
      message: "Messages retrieved successfully",
      messages
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages" });
  }
}

export async function deleteChat(req, res) {
  try {
    const { chatId } = req.params;
    const userId = getSafeUserId(req.user);

    const chat = await chatModel.findOneAndDelete({ _id: chatId, user: userId });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Clean up all messages belonging to this chat
    await messageModel.deleteMany({ chat: chatId });

    res.status(200).json({
      message: "Chat deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting chat" });
  }
}