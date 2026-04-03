// client/src/features/chat/components/TypingIndicator.jsx
import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start mb-8"
    >
      <div className="bg-[#1e293b]/50 border border-cyan-500/20 px-5 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-xl shadow-lg shadow-cyan-500/5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
              className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            />
          ))}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400/80">
          Syncing Context...
        </span>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;