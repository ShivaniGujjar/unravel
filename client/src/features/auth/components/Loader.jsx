import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-[9999]">
      {/* Background Glow */}
      <div className="absolute w-80 h-80 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center"
      >
        {/* Brand Name with the new Inter font style */}
        <h2 className="text-5xl font-black tracking-tighter text-white italic mb-6">
          Unravel<span className="text-blue-600">.</span>
        </h2>

        {/* Professional Loading Bar */}
        <div className="w-40 h-[1.5px] bg-white/5 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </div>
        
        <p className="mt-6 text-[10px] font-bold text-gray-600 tracking-[0.3em] uppercase">
          Synthesizing Intelligence
        </p>
      </motion.div>
    </div>
  );
};

export default Loader;