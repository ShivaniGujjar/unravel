import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const chat = useChat();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState(false);

  // 🔌 Socket init
  useEffect(() => {
    chat.initializeSocketConnection();
  }, [chat]);

  // 🆕 New Chat
  const handleNewChat = () => {
    setMessages([]);
    setActiveChat(true);
  };

  // 💬 Send Message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await chat.sendMessage(input);

      const botMessage = {
        sender: "bot",
        text: response || "No response",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.log(err);
    }

    setInput("");
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      
      {/* 🔹 Sidebar */}
      <div className="w-64 bg-[#020617] p-4 flex flex-col justify-between">
        
        {/* Top */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-cyan-400">
            Perplexity
          </h2>

          <button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 py-2 rounded-lg mb-6"
          >
            + New Chat
          </button>

          <p className="text-sm text-gray-400 mb-2">CHAT HISTORY</p>
          <div className="text-gray-500 text-sm">
            No chats yet
          </div>
        </div>

        {/* Bottom */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
              {user?.name?.charAt(0) || "U"}
            </div>
            <p>{user?.name || "User"}</p>
          </div>

          <div className="flex justify-between text-sm text-gray-400">
            <button>Settings</button>
            <button className="text-red-400">Logout</button>
          </div>
        </div>
      </div>

      {/* 🔹 Main Section */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-900 to-black">

        {!activeChat ? (
          // 🏠 Welcome Screen
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              
              <div className="text-5xl mb-6">💬</div>

              <h1 className="text-3xl font-semibold mb-2 text-cyan-300">
                Welcome, {user?.name} 👋
              </h1>

              <p className="text-gray-300 mb-6">
                Start a new chat to begin exploring. Ask anything!
              </p>

              <button
                onClick={handleNewChat}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3 rounded-lg"
              >
                + Start New Chat
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 💬 Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-xl p-3 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-cyan-500 ml-auto"
                      : "bg-gray-700 mr-auto"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* ✍️ Input */}
            <div className="p-4 border-t border-gray-700 flex gap-2">
              
              <input
                type="text"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-3 rounded-lg bg-gray-800 outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <button
                onClick={handleSend}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 px-6 rounded-lg"
              >
                Send
              </button>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Dashboard;