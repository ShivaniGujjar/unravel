import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";

// 🛠️ Custom Hooks & Services
import { useChat } from "../hooks/useChat";
import { socket, initializeSocketConnection } from "../service/chat.socket";

// 📦 Redux Actions
import {
  updateStreamingMessage,
  addNewMessage,
  setCurrentChatId,
} from "../chat.slice";
import { logout } from "../../auth/auth.slice";

// 🧩 Components
import Sidebar from "../../auth/components/Sidebar";
import ChatModals from "../../auth/components/ChatModals";
import { motion, AnimatePresence } from "framer-motion";
import TypingIndicator from "../../../features/auth/components/TypingIndicator";

// ✅ Import logoutUser from auth api
import { logoutUser } from "../../auth/services/auth.api";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { chatId: urlChatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { chats, currentChatId, isLoading } = useSelector(
    (state) => state.chat,
  );
  const chat = useChat();

  const [input, setInput] = useState("");
  const [activeChat, setActiveChat] = useState(!!urlChatId);
  const [isComposingNewChat, setIsComposingNewChat] = useState(false);

  // 🛠️ States for Modals
  const [editingChatId, setEditingChatId] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [deletingChatId, setDeletingChatId] = useState(null);

  const messagesEndRef = useRef(null);

  // 🚀 Rename Logic
  const handleRenameSubmit = async () => {
    if (!newTitle.trim()) return;
    try {
      await chat.handleRenameChat(editingChatId, newTitle);
      setEditingChatId(null);
      setNewTitle("");
    } catch (err) {
      console.error("Rename failed", err);
    }
  };

  // ✅ Fixed logout — no longer uses chat.api
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      dispatch(logout());
      window.location.replace("/login");
    }
  };

  const cleanTitle = (title) =>
    title ? title.replace(/\*\*/g, "") : "Untitled Chat";

  // ✅ Fixed — initializeSocketConnection called directly, not via chat hook
  useEffect(() => {
    initializeSocketConnection();
    chat.handleGetChats();
    socket.on("chat-chunk", (data) => {
      dispatch(updateStreamingMessage(data));
    });
    return () => {
      socket.off("chat-chunk");
    };
  }, [dispatch]);

  useEffect(() => {
    if (isComposingNewChat || urlChatId || currentChatId) {
      setActiveChat(true);
    } else if (!isLoading) {
      setActiveChat(false);
    }
  }, [urlChatId, currentChatId, isLoading, isComposingNewChat]);

  useEffect(() => {
    if (urlChatId) {
      chat.handleOpenChat(urlChatId);
    }
  }, [urlChatId]);

  const handleNewChat = useCallback(() => {
    navigate("/");
    setActiveChat(true);
    setIsComposingNewChat(true);
    dispatch(setCurrentChatId(null));
  }, [navigate, dispatch]);

  const handleSend = useCallback(async () => {
    // ✅ Fixed — call directly, not via chat hook
    if (!socket.connected) initializeSocketConnection();
    if (!input.trim()) return;

    const userMessage = input;
    const targetChatId = urlChatId || currentChatId;
    setInput("");
    setActiveChat(true);

    if (targetChatId && !targetChatId.startsWith("temp-")) {
      dispatch(
        addNewMessage({
          chatId: targetChatId,
          role: "user",
          content: userMessage,
        }),
      );
      dispatch(
        addNewMessage({ chatId: targetChatId, role: "ai", content: "..." }),
      );
    }

    const result = await chat.handleSendMessage(userMessage, targetChatId);
    if (result?.newId && result.newId !== urlChatId) {
      setIsComposingNewChat(false);
      navigate(`/chat/${result.newId}`);
    }
  }, [input, urlChatId, currentChatId, chat, navigate, dispatch]);

  const currentMessages =
    urlChatId && chats[urlChatId]
      ? chats[urlChatId].messages
      : currentChatId === "temp-new"
        ? chats["temp-new"]?.messages
        : [];

  const showChat = !!urlChatId || currentChatId === "temp-new" || isLoading;

  useEffect(() => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  }, [currentMessages]);

  return (
    <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden font-sans">

      {/* 📱 Mobile Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-xl text-white"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        chats={chats}
        urlChatId={urlChatId}
        navigate={navigate}
        handleNewChat={handleNewChat}
        user={user}
        handleLogout={handleLogout}
        setEditingChatId={setEditingChatId}
        setNewTitle={setNewTitle}
        setDeletingChatId={setDeletingChatId}
        cleanTitle={cleanTitle}
        setIsComposingNewChat={setIsComposingNewChat}
        setInput={setInput}
      />

      <div className="flex-1 flex flex-col bg-[#0f172a] relative">
        {!(activeChat || isComposingNewChat) ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden"
          >
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-3xl w-full text-center z-10">
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-black mb-4 bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent tracking-tight"
              >
                Hello, {user?.username?.split(" ")[0] || "User"}.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 font-medium mb-12"
              >
                Where knowledge begins.
              </motion.p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-18 text-left">
                {[
                  { title: "Understand an algorithm", desc: "Explain it to me like I'm five.", icon: "💡" },
                  { title: "Refactor my code", desc: "Clean up my MERN stack logic.", icon: "⚡" },
                  { title: "Write a cover letter", desc: "For a Junior Developer role.", icon: "📝" },
                  { title: "IPL Match Update", desc: "Who is playing tonight?", icon: "🏏" },
                ].map((item, i) => {
                  const isSelected = input === item.title;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => {
                        setInput(item.title);
                        document.querySelector("input")?.focus();
                      }}
                      className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 group border-2 ${
                        isSelected
                          ? "bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className={`text-2xl mb-2 transition-transform duration-300 ${isSelected ? "scale-110" : "group-hover:scale-110"}`}>
                        {item.icon}
                      </div>
                      <h3 className={`text-sm font-bold transition-colors ${isSelected ? "text-blue-400" : "text-white group-hover:text-blue-400"}`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                      {isSelected && (
                        <motion.div
                          layoutId="activeDot"
                          className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={handleNewChat}
                className="mt-12 text-gray-500 hover:text-white text-sm font-medium transition-colors border-b border-transparent hover:border-white"
              >
                Or just start a new thread →
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-12 custom-scrollbar relative">
              <div className="max-w-4xl mx-auto space-y-12">
                <AnimatePresence mode="popLayout">
                  {currentMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-2 px-2 opacity-30 uppercase tracking-[0.2em] text-[9px] font-black">
                        {msg.role === "user" ? "You" : "Assistant"}
                      </div>
                      <div
                        className={`max-w-[88%] px-7 py-5 rounded-[2rem] shadow-sm ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/20"
                            : "bg-[#1e293b]/50 border border-white/5 text-gray-200 rounded-bl-none backdrop-blur-xl"
                        }`}
                      >
                        <div className="prose prose-invert max-w-none text-[15.5px] font-medium leading-relaxed">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <TypingIndicator />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div ref={messagesEndRef} className="h-20" />
              </div>

              <button
                onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="sticky bottom-4 float-right mr-4 p-2.5 bg-[#1e293b]/90 border border-white/10 rounded-full hover:bg-blue-600 text-cyan-400 hover:text-white transition-all shadow-2xl z-50"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-4xl mx-auto p-8 sticky bottom-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent"
            >
              <div className="relative flex items-center bg-[#1e293b]/70 border border-white/10 rounded-3xl p-3 focus-within:border-blue-500/40 shadow-2xl backdrop-blur-2xl">
                <input
                  type="text"
                  placeholder="Ask anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 px-5 py-3 bg-transparent outline-none text-white text-[16px]"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className={`p-3.5 rounded-2xl transition-all ${input.trim() ? "bg-blue-600 text-white" : "text-gray-600"}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polyline points="22 2 15 22 11 13 2 9 22 2"></polyline>
                  </svg>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>

      <ChatModals
        editingChatId={editingChatId}
        setEditingChatId={setEditingChatId}
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        handleRenameSubmit={handleRenameSubmit}
        deletingChatId={deletingChatId}
        setDeletingChatId={setDeletingChatId}
        handleDeleteConfirm={() => {
          chat.handleDeleteChat(deletingChatId);
          setDeletingChatId(null);
        }}
      />
    </div>
  );
};

export default Dashboard;