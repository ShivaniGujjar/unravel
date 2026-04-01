import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux"; // 👈 Combined useDispatch here
import { useParams, useNavigate } from "react-router-dom";
import { useChat } from "../hooks/useChat";
import ReactMarkdown from "react-markdown";

// 🚀 FIXED IMPORTS: 
// 1. One path for the socket
// 2. One path for the slice (choosing the /service/ one since that's where your file is)
import { socket } from "../service/chat.socket"; 
import { updateStreamingMessage, addNewMessage, setCurrentChatId, setLoading } from "../chat.slice";

const Dashboard = () => {
  const { chatId: urlChatId } = useParams(); // 👈 Get ID from URL
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { chats, currentChatId, isLoading } = useSelector((state) => state.chat);
  const chat = useChat();



  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState(!!urlChatId);
  const [isComposingNewChat, setIsComposingNewChat] = useState(false);

  useEffect(() => {
    // 👂 Listen for the "chat-chunk" event coming from the backend pipe
    socket.on("chat-chunk", (data) => {
      // data is { chatId: "...", content: "word" }
      dispatch(updateStreamingMessage(data));
    });

    // 🧹 Clean up: Stop listening if the user leaves this page
    return () => {
      socket.off("chat-chunk");
    };
  }, [dispatch]);

  useEffect(() => {
    if (isComposingNewChat) {
      setActiveChat(true);
      return;
    }
    if (urlChatId || currentChatId) {
      setActiveChat(true);
    } else {
      if (!isLoading) {
        setActiveChat(false);
      }
    }
  }, [urlChatId, currentChatId, isLoading, isComposingNewChat]);

  // 1. Initial Load & Socket Connection
  useEffect(() => {
    chat.initializeSocketConnection();
    chat.handleGetChats();
  }, []);

  // 2. ⚡ FIX: Sync Redux State with URL
  useEffect(() => {
    if (urlChatId) {
      if (urlChatId !== currentChatId) {
        chat.handleOpenChat(urlChatId);
      }
      setActiveChat(true);
    } else {
      if (!isLoading && !isComposingNewChat) {
        setActiveChat(false);
      }
    }
  }, [urlChatId, currentChatId, chat, isLoading, isComposingNewChat]);

  const handleNewChat = useCallback(() => {
    navigate("/");
    setActiveChat(true);
    setIsComposingNewChat(true);
    dispatch(setCurrentChatId(null));
  }, [navigate, dispatch]);


  const handleSend = useCallback(async () => {
    if (!socket.connected) {
      chat.initializeSocketConnection();
    }
    if (!input.trim()) return;

    const userMessage = input;
    const targetChatId = urlChatId || currentChatId;

    setInput("");
    setActiveChat(true);

    if (targetChatId && !targetChatId.startsWith("temp-")) {
      dispatch(addNewMessage({ chatId: targetChatId, role: "user", content: userMessage }));
      dispatch(addNewMessage({ chatId: targetChatId, role: "ai", content: "..." }));
    }

    const result = await chat.handleSendMessage(userMessage, targetChatId);

    if (result?.newId && result.newId !== urlChatId) {
      setIsComposingNewChat(false);
      navigate(`/chat/${result.newId}`);
    } else if (targetChatId) {
      setIsComposingNewChat(false);
    }
  }, [input, urlChatId, currentChatId, chat, navigate, dispatch]);
  const handleOpenChat = useCallback((chatId) => {
    // 👈 Instead of calling chat.handleOpenChat directly, 
    // we change the URL. The useEffect above will handle the loading.
    navigate(`/chat/${chatId}`);
  }, [navigate]);

  const currentMessages = currentChatId
    ? chats[currentChatId]?.messages || []
    : [];


    const messagesEndRef = useRef(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [currentMessages]);



  return (
    <div className="flex h-screen bg-[#0f172a] text-white">

      {/* 🔹 Sidebar */}
      <div className="w-64 bg-[#020617] p-4 flex flex-col justify-between border-r border-gray-800">
        <div>
          <h2 className="text-xl font-bold mb-6 text-cyan-400 tracking-wide cursor-pointer" onClick={() => navigate('/')}>
            Perplexity
          </h2>

          <button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 py-2 rounded-lg mb-6 hover:opacity-90 transition shadow-lg font-medium"
          >
            + New Chat
          </button>

          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-1">
            Chat History
          </p>

          <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {Object.values(chats).length > 0 ? (
              Object.values(chats).sort((a,b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)).map((c) => (
                <div
                  key={c.id || c._id}
                  onClick={() => handleOpenChat(c.id || c._id)}
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    (urlChatId === c.id || urlChatId === c._id)
                      ? "bg-gray-800 text-cyan-400 border border-cyan-500/30 shadow-md"
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-sm truncate font-medium">
                      {c.title}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      chat.handleDeleteChat(c.id || c._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-xs text-red-400 hover:text-red-500 ml-2 transition"
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <div className="text-gray-600 text-sm px-1 italic">No threads found</div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-3">
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-full flex items-center justify-center font-bold text-white shadow-inner">
              {user?.name?.charAt(0) || "U"}
            </div>
            <p className="text-sm font-medium text-gray-300">{user?.name || "User"}</p>
          </div>
        </div>
      </div>

      {/* 🔹 Main Content */}
      <div className="flex-1 flex flex-col bg-[#0f172a]">
        {!(activeChat || isComposingNewChat) ? (
          <div className="flex-1 flex items-center justify-center text-center px-4 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent">
            <div className="max-w-md">
              <div className="text-6xl mb-6 animate-bounce">🌐</div>
              <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
                What do you want to know?
              </h1>
              <p className="text-gray-400 mb-8 text-lg">
                Ask anything. Perplexity will search across the internet for you.
              </p>
              <button
                onClick={handleNewChat}
                className="bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-cyan-50 transition-all transform hover:scale-105"
              >
                Start Searching
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 💬 Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {currentMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-3xl px-6 py-4 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-800/50 border border-gray-700 text-gray-200 rounded-bl-none"
                    }`}
                  >
                    <div className="prose prose-invert max-w-none text-[15px] leading-relaxed">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800/30 px-6 py-3 rounded-2xl text-cyan-400 text-sm flex items-center gap-2 border border-cyan-500/10">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
                    Gathering sources...
                  </div>
                </div>
              )}
            </div>

            {/* ✍️ Professional Input Bar */}
            <div className="max-w-4xl w-full mx-auto p-6">
              <div className="relative flex items-center bg-gray-800/50 border border-gray-700 rounded-2xl p-2 focus-within:border-cyan-500/50 transition-all shadow-2xl backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="Ask a follow-up..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 p-3 bg-transparent outline-none text-white placeholder-gray-500"
                />

                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`px-6 py-2 rounded-xl font-bold transition-all ${
                    input.trim() 
                      ? "bg-cyan-500 text-white hover:bg-cyan-400" 
                      : "bg-gray-700 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Send
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-600 mt-3 uppercase tracking-widest">
                AI can make mistakes. Verify important info.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;