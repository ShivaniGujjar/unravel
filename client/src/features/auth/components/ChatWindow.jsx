import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const ChatWindow = ({ messages, isLoading }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-20 py-10 custom-scrollbar">
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        
        {messages.map((msg, index) => {
          const isLastMessage = index === messages.length - 1;
          const isAssistant = msg.role === 'assistant' || msg.role === 'bot' || msg.role === 'ai';

          return (
            <div key={index} className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}>
              
              {/* 🧑‍💻 USER MESSAGE */}
              {!isAssistant && (
                <div className="flex flex-col items-end max-w-[85%]">
                  <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-2 mr-2">You</span>
                  <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl rounded-tr-none shadow-lg shadow-blue-600/10 font-medium leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              )}

              {/* 🤖 UNRAVEL (AI) MESSAGE */}
              {isAssistant && (
                <div className="flex flex-col items-start w-full max-w-[95%]">
                  <span className="text-[10px] font-black tracking-widest text-cyan-500 uppercase mb-3 ml-1">Unravel</span>

                  {/* 🚀 1. SYNCING BAR: Show only while loading AND when no content has arrived yet */}
                  {isLoading && isLastMessage && (!msg.content || msg.content === "" || msg.content === "...") && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 px-4 py-2.5 bg-blue-500/5 border border-blue-500/10 rounded-xl mb-4 w-fit"
                    >
                      <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase italic">
                        Unraveling Context...
                      </span>
                    </motion.div>
                  )}

                  {/* 🚀 2. AI RESPONSE BUBBLE: Only show if there is ACTUAL text content */}
                  {msg.content && msg.content !== "..." && msg.content !== "" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full bg-slate-900/40 border border-white/5 p-6 rounded-2xl rounded-tl-none text-slate-200 shadow-xl backdrop-blur-sm"
                    >
                      <div className="prose prose-invert max-w-none text-[15.5px] leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        <div ref={scrollRef} className="h-4" />
      </div>
    </div>
  );
};

export default ChatWindow;