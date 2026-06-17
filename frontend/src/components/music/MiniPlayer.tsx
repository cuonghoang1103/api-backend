'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { useMusicStore } from '@/store/musicStore';

function isSafeCoverUrl(url: unknown): url is string {
  if (typeof url !== 'string' || !url.trim()) return false;
  return url.startsWith('http') || url.startsWith('/uploads/');
}

interface MiniPlayerProps {
  isNight?: boolean;
}

export default function MiniPlayer({ isNight = true }: MiniPlayerProps) {
  const { currentTrack, isPlaying, currentTime, duration, next, previous, togglePlay } = useMusicStore();
  const [imgError, setImgError] = useState(false);

  if (!currentTrack) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const c = {
    primary: '#a855f7',
    secondary: '#ec4899',
    glow: 'rgba(168,85,247,0.3)',
    text: '#f8fafc',
    textMuted: '#64748b',
    glassBg: 'rgba(10,5,20,0.92)',
    border: 'rgba(168,85,247,0.2)',
    progressBg: 'rgba(255,255,255,0.08)',
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: c.glassBg,
        backdropFilter: 'blur(32px) saturate(1.5)',
        borderTop: `1px solid ${c.border}`,
        boxShadow: `0 -20px 60px rgba(0,0,0,0.5), 0 0 40px ${c.glow}`,
      }}
    >
      {/* Progress bar */}
      <div
        className="absolute top-0 left-0 h-0.5 rounded-b-full"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${c.primary}, ${c.secondary})`,
          boxShadow: `0 0 8px ${c.primary}`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Cover */}
          <motion.button
            onClick={togglePlay}
            className="relative w-11 h-11 rounded-xl overflow-hidden shadow-lg shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSafeCoverUrl(currentTrack.coverImage) && !imgError ? (
              <Image
                src={currentTrack.coverImage}
                alt={currentTrack.title}
                width={44}
                height={44}
                className="object-cover w-full h-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                }}
              >
                <span className="text-white/60 text-lg font-bold">
                  {currentTrack.title.charAt(0)}
                </span>
              </div>
            )}

            {/* Pulse ring when playing */}
            {isPlaying && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ boxShadow: `0 0 0 2px ${c.primary}` }}
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-bold truncate"
              style={{
                color: isPlaying ? c.primary : c.text,
              }}
            >
              {currentTrack.title}
            </p>
            <p className="text-[11px] truncate" style={{ color: c.textMuted }}>
              {currentTrack.artist}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={previous}
              className="p-2 rounded-xl transition-colors"
              style={{ color: c.text }}
              title="Previous"
            >
              <SkipBack className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                boxShadow: `0 0 20px ${c.glow}`,
              }}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="p-2 rounded-xl transition-colors"
              style={{ color: c.text }}
              title="Next"
            >
              <SkipForward className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Visualizer hint */}
          <div className="hidden sm:flex items-end gap-0.5 h-5 w-12">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ background: c.primary }}
                animate={isPlaying ? { height: [4, 12 + (i % 3) * 4, 4] } : { height: 4 }}
                transition={{
                  duration: 0.4 + (i % 4) * 0.1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.07,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
