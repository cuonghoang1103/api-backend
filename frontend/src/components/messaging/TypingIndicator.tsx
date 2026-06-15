'use client';

import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="my-1 flex justify-start"
    >
      <div
        className="flex items-center gap-1 rounded-2xl rounded-bl-sm px-3 py-2"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="mech-pulse-dot h-1.5 w-1.5 rounded-full bg-cyan-400" style={{ animationDelay: '0ms' }} />
        <span className="mech-pulse-dot h-1.5 w-1.5 rounded-full bg-cyan-400" style={{ animationDelay: '180ms' }} />
        <span className="mech-pulse-dot h-1.5 w-1.5 rounded-full bg-cyan-400" style={{ animationDelay: '360ms' }} />
      </div>
    </motion.div>
  );
}
