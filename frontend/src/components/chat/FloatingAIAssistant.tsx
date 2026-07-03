'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LottieClient from '@/components/ui/LottieClient';
import type { LottieRefCurrentProps } from 'lottie-react';
import { useChatStore } from '@/store/chatStore';
import { useMusicStore } from '@/store/musicStore';
import ChatModal from './ChatModal';

type RobotState = 'idle' | 'thinking' | 'typing';

const IDLE_MESSAGES = [
  'Bạn cần hỗ trợ gì không?',
  'Mình có thể giúp gì cho bạn?',
  'Chào bạn! Hỏi mình nhé',
  'Có gì mình có thể giúp?',
];

export default function FloatingAIAssistant() {
 // /creator is a full-screen workspace with its own topbar
 // and editor chrome. The floating AI bubble would cover
 // bottom-right of the editor's autosave indicator and
 // the platform-post publish toggles, so hide it there.
 const pathname = usePathname();
 if (pathname?.startsWith('/creator')) return null;

 const { isStreaming, robotEmotion } = useChatStore();
 // When a track is loaded the mobile music bar sits above the bottom nav;
 // lift the robot above the bar too so it never overlaps it (mobile only —
 // see `.ai-robot-fab` in globals.css). 84px ≈ the mini-bar's height.
 const musicActive = useMusicStore((s) => !!s.currentTrack);
 const lottieRef = useRef<LottieRefCurrentProps>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipMessage, setTooltipMessage] = useState('');
  const [robotData, setRobotData] = useState<object | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const robotState: RobotState = isStreaming
    ? 'thinking'
    : robotEmotion === 'typing'
    ? 'typing'
    : 'idle';

  // Load Lottie animation data from public folder
  useEffect(() => {
    fetch('/animations/robot.json')
      .then((res) => res.json())
      .then((data) => setRobotData(data))
      .catch(console.error);
  }, []);

  // Control Lottie playback based on state
  useEffect(() => {
    const lottie = lottieRef.current;
    if (!lottie || !robotData) return;

    if (robotState === 'thinking') {
      lottie.pause();
    } else if (robotState === 'typing') {
      lottie.setSpeed(1.5);
      lottie.play();
    } else {
      lottie.setSpeed(1);
      lottie.play();
    }
  }, [robotState, robotData]);

  const scheduleTooltip = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    setShowTooltip(false);

    idleTimerRef.current = setTimeout(() => {
      const msg = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
      setTooltipMessage(msg);
      setShowTooltip(true);
      tooltipTimerRef.current = setTimeout(() => setShowTooltip(false), 5000);
    }, 6000 + Math.random() * 2000);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
      return;
    }
    scheduleTooltip();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, [isOpen, scheduleTooltip]);

  const handleMouseEnter = () => {
    if (!isOpen) {
      setShowTooltip(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (!isOpen) scheduleTooltip();
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  // Note: the messaging widget sits above the AI robot (bottom-24 vs
  // bottom-6), so they don't overlap and the AI robot stays put.

  const handleClose = () => {
    setIsOpen(false);
    scheduleTooltip();
  };

  return (
    <>
      {/* Floating Robot */}
      <motion.div
        className="ai-robot-fab fixed bottom-6 right-6 z-[100]"
        style={{ ['--music-offset' as string]: musicActive ? '84px' : '0px' } as React.CSSProperties}
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Tooltip bubble */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10, x: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10, x: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute bottom-full right-0 mb-3 whitespace-nowrap"
            >
              <div className="relative bg-darkcard border border-neon-violet/30 rounded-2xl px-4 py-2.5 shadow-2xl shadow-neon-violet/10">
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-darkcard border-r border-b border-neon-violet/30 transform rotate-45" />
                <p className="text-sm text-text-secondary relative z-10">{tooltipMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Robot container */}
        <div className="relative flex flex-col items-end">
          {/* Thinking bubble */}
          <AnimatePresence>
            {robotState === 'thinking' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 8 }}
                className="absolute -top-14 right-0 mb-2"
              >
                <div className="bg-darkcard border border-neon-violet/30 rounded-2xl px-3 py-2 shadow-xl">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-neon-violet"
                        animate={{ y: [0, -3, 0], opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Lottie Robot Button */}
          <motion.button
            onClick={handleOpen}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            animate={
              robotState === 'thinking'
                ? { rotate: [-3, 3, -3], transition: { duration: 0.5, repeat: Infinity } }
                : { y: [0, -4, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }
            }
            className="relative w-20 h-20 cursor-pointer focus:outline-none"
            style={{ filter: 'drop-shadow(0 8px 32px rgba(139, 92, 246, 0.4))' }}
            aria-label="Open Ai CuongMini"
          >
            {/* Glow ring */}
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.5, 0.25] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-br from-neon-indigo via-neon-violet to-neon-fuchsia"
            />

            {/* Lottie Animation */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <LottieClient
                lottieRef={lottieRef}
                animationData={robotData ?? undefined}
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </motion.button>

          {/* Streaming dot */}
          {isStreaming && (
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-darkbg flex items-center justify-center"
            >
              <motion.div
                animate={{ opacity: [0.4, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-2 h-2 bg-white rounded-full"
              />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && <ChatModal onClose={handleClose} />}
      </AnimatePresence>
    </>
  );
}
