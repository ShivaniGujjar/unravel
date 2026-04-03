// src/pages/LandingPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center px-6 overflow-hidden relative font-sans">
      
      {/* ✨ Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 max-w-4xl"
      >
        <h1 className="text-7xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent italic">
          Unravel the web.
        </h1>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Stop searching. Start knowing. Unravel uses Mistral AI to untangle complex questions into clear, cited answers.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* 🚀 FIXED: Links to /login directly */}
          <Link 
            to="/login"
            className="bg-blue-600 hover:bg-blue-500 px-10 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-blue-600/20 w-full md:w-auto text-center"
          >
            Get Started Free
          </Link>
          
          <button 
            onClick={() => window.open('https://github.com/yourusername', '_blank')}
            className="bg-white/5 border border-white/10 hover:bg-white/10 px-10 py-4 rounded-2xl font-bold text-lg transition-all w-full md:w-auto"
          >
            View on GitHub
          </button>
        </div>
      </motion.div>

      {/* Preview Section */}
      <motion.div 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 40 }}
        transition={{ delay: 0.4 }}
        className="mt-20 w-full max-w-5xl border border-white/10 rounded-t-3xl bg-[#0f172a] p-4 shadow-2xl opacity-50"
      >
        <div className="flex gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-500/20" />
        </div>
        <div className="h-64 bg-gray-900/50 rounded-xl flex items-center justify-center text-gray-700 font-bold uppercase tracking-widest text-xs">
          Dashboard Preview
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;