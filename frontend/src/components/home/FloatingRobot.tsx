'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, Sparkles } from 'lucide-react';

export default function FloatingRobot() {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Random blinking — only runs on client after mount
  useEffect(() => {
    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 2000;
      blinkTimerRef.current = setTimeout(() => {
        setIsBlinking(true);
        blinkTimerRef.current = setTimeout(() => {
          setIsBlinking(false);
          scheduleNext();
        }, 150);
      }, delay);
    };
    scheduleNext();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full right-0 mb-3 px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl shadow-xl whitespace-nowrap"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-violet" />
              <span className="text-sm font-medium text-text-primary">Chat with AI CuongMini</span>
            </div>
            {/* Arrow */}
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-darkcard border-r border-b border-darkborder rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot Button */}
      <motion.button
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative group"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-indigo to-neon-violet rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
        
        {/* Main circle */}
        <div className="relative w-16 h-16 bg-gradient-to-br from-neon-indigo via-neon-violet to-neon-fuchsia rounded-full flex items-center justify-center shadow-lg shadow-neon-violet/30 border-2 border-white/10">
          {/* Robot face */}
          <div className="relative">
            {/* Eyes */}
            <div className="flex gap-3 mb-1">
              <motion.div
                animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                transition={{ duration: 0.1 }}
                className="w-3 h-3 bg-white rounded-full"
              />
              <motion.div
                animate={{ scaleY: isBlinking ? 0.1 : 1 }}
                transition={{ duration: 0.1 }}
                className="w-3 h-3 bg-white rounded-full"
              />
            </div>
            {/* Smile */}
            <div className="w-6 h-3 border-b-2 border-white rounded-b-full mx-auto" />
          </div>
          
          {/* Antenna */}
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-neon-fuchsia rounded-full"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neon-fuchsia rounded-full" />
          </motion.div>
        </div>

        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 border-2 border-neon-violet rounded-full"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      </motion.button>

      {/* Chat link */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute -top-2 -left-2"
      >
        <Link
          href="/chat"
          className="flex items-center gap-2 px-3 py-1.5 bg-darkcard border border-darkborder rounded-full shadow-lg hover:border-neon-violet hover:bg-darkcard/90 transition-all"
        >
          <MessageCircle className="w-4 h-4 text-neon-violet" />
          <span className="text-xs font-medium text-text-primary">AI Chat</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
