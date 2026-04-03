import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

import { useDispatch } from "react-redux"; // Add this
import { setCurrentChatId } from "../../chat/chat.slice";


const handleGoHome = () => {
  navigate('/');
  dispatch(setCurrentChatId(null));
  setIsComposingNewChat(false); // Reset the "New Chat" state
  setInput(""); // Clear any selected cards
};


const Sidebar = ({ 
  isSidebarOpen, 
  setIsSidebarOpen,
  chats, 
  urlChatId, 
  navigate, 
  handleNewChat, 
  user, 
  handleLogout, 
  setEditingChatId, 
  setNewTitle, 
  setDeletingChatId, 
  cleanTitle ,
  setIsComposingNewChat,
  setInput
}) => {

    const dispatch = useDispatch();

  // 🏠 Move the function INSIDE so it can see the props
  const handleGoHome = () => {
    navigate('/');
    dispatch(setCurrentChatId(null));
    if (setIsComposingNewChat) setIsComposingNewChat(false); 
    if (setInput) setInput(""); 
    if (window.innerWidth < 768) setIsSidebarOpen(false); // Auto-close on mobile
  };
  return (

    
    <div className="w-72 bg-[#020617] p-5 flex flex-col justify-between border-r border-white/5 shrink-0 h-screen overflow-hidden">
      
      {/* 1. TOP SECTION (Title & Button) */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        
<div className="flex items-center gap-2 px-4 py-6">
  {/* 🧶 Abstract "U" Icon */}
  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
    <span className="text-white font-black text-xl italic">u</span>
  </div>
  <span className="text-2xl font-black tracking-tighter text-white">
    un<span className="text-blue-400">ravel</span>
  </span>
</div>

        <button onClick={handleNewChat} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl mb-8 transition-all shadow-lg shadow-blue-600/20 font-bold text-sm active:scale-[0.98] shrink-0">
          + New Chat
        </button>

        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mb-4 px-2 font-bold shrink-0">Recent Threads</p>

        {/* 2. MIDDLE SECTION (Animated Chat List) */}
        <div className="space-y-1 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
          <AnimatePresence mode="popLayout">
            {Object.values(chats)
              .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
              .map((c) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  key={c.id || c._id}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 mb-1 ${
                    (urlChatId === c.id || urlChatId === c._id)
                      ? "bg-gray-800/80 text-cyan-400 border border-white/5 shadow-md"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span 
  className="text-[13.5px] truncate font-medium flex-1 pr-2" 
  onClick={() => {
    // ✅ 1. Update Redux instantly
    dispatch(setCurrentChatId(c.id || c._id)); 
    // ✅ 2. Stop the "New Chat" mode
    if (setIsComposingNewChat) setIsComposingNewChat(false);
    // ✅ 3. Change the URL
    navigate(`/chat/${c.id || c._id}`);
  }}
>
                    {cleanTitle(c.title)}
                  </span>

                  {/* 🛠️ Action Icons Area */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    {/* Rename Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingChatId(c.id || c._id);
                        setNewTitle(cleanTitle(c.title));
                      }}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-cyan-400"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>

                    {/* Delete Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingChatId(c.id || c._id);
                      }}
                      className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400/70 hover:text-red-500"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>
      </div>

      {/* 3. BOTTOM SECTION (User Profile & Logout) */}
      <div className="border-t border-white/5 pt-5 mt-auto shrink-0">
        <div className="flex items-center justify-between px-2 py-2 rounded-2xl hover:bg-white/5 group transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg uppercase text-sm">
              {user?.username?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-bold text-gray-100 truncate w-32">{user?.username || "User"}</p>
              <p className="text-[10px] text-cyan-500/80 font-bold uppercase tracking-wider">Pro Tier</p>
            </div>
          </div>
          <button 
            onClick={handleLogout} 
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
            title="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;