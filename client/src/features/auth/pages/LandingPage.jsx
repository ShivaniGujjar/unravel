import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    // Main Container: Added pt-32 for margin and overflow-visible for smooth scroll
    <div className="w-full min-h-screen bg-[#020617] text-white flex flex-col items-center pt-32 px-6 relative font-sans overflow-visible">
      
      {/* ✨ Background Glows - Subtle for premium feel */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center z-10 max-w-4xl"
      >
       <h1 className="text-7xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tight bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent italic">
  Unravel The Web.
</h1>
        
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Stop searching. Start knowing. Unravel uses Mistral AI to untangle complex questions into clear, cited answers.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-24">
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

      {/* 🖼️ Premium Dashboard Preview Section */}
      <motion.div 
        initial={{ opacity: 0, y: 100, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-6xl relative z-10 mb-32 perspective-1000"
      >
        {/* Floating Glow effect behind the image */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4/5 h-40 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none opacity-50" />

        <div className="group border border-white/10 rounded-t-3xl bg-[#0f172a]/90 backdrop-blur-2xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8),0_0_20px_rgba(37,99,235,0.1)] transition-transform duration-500 hover:-translate-y-2">
          
          {/* Browser Header Bar - Apple Style */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
            <div className="flex gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E]" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F]" />
            </div>
            <div className="bg-black/40 border border-white/10 px-8 py-1.5 rounded-full text-[12px] text-gray-500 font-medium tracking-wide">
              unravel-ai.com/dashboard
            </div>
            <div className="w-16" />
          </div>

          {/* Actual Dashboard Image Container */}
          <div className="relative overflow-hidden">
            <img 
              src="/landingpage.png" 
              alt="Unravel Dashboard" 
              className="w-full h-auto block transform scale-[1.01] group-hover:scale-100 transition-transform duration-1000"
            />
            
            {/* Gradient Masking at the bottom for smooth blend */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
            
            {/* Subtle light reflection on hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>
        </div>

        {/* Reflection/Shadow under the card */}
        <div className="w-full h-24 bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl opacity-40 -mt-10" />
      </motion.div>
    </div>
  );
};

export default LandingPage;