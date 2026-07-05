'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Star, Shield, Bot } from 'lucide-react';
import { expToNextLevel } from './store';

/** Animated floating Robot SVG — Cyberpunk AI style */
const RobotSVG = ({ isHovered }: { isHovered: boolean }) => (
  <svg
    viewBox="0 0 120 120"
    className="w-full h-full"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Antenna */}
    <motion.line
      x1="60" y1="8" x2="60" y2="20"
      stroke={isHovered ? '#06b6d4' : '#8b5cf6'}
      strokeWidth={2.5}
      strokeLinecap="round"
      animate={{ stroke: isHovered ? '#06b6d4' : '#8b5cf6' }}
    />
    <motion.circle
      cx="60" cy="7" r="4"
      fill={isHovered ? '#06b6d4' : '#8b5cf6'}
      animate={{ fill: isHovered ? '#06b6d4' : '#8b5cf6', scale: isHovered ? [1, 1.3, 1] : 1 }}
      style={isHovered ? { filter: 'drop-shadow(0 0 6px #06b6d4)' } : {}}
    />

    {/* Head */}
    <motion.rect
      x="30" y="20" width="60" height="48" rx="10"
      fill="#1a1c2e"
      stroke={isHovered ? '#06b6d4' : '#8b5cf6'}
      strokeWidth={isHovered ? 2.5 : 1.5}
      animate={{ stroke: isHovered ? '#06b6d4' : '#8b5cf6' }}
      style={isHovered ? { filter: 'drop-shadow(0 0 10px rgba(6,182,212,0.5))' } : { filter: 'drop-shadow(0 0 5px rgba(139,92,246,0.3))' }}
    />

    {/* Visor / Eyes */}
    <motion.rect
      x="38" y="30" width="44" height="18" rx="6"
      fill="#0f111a"
      animate={{ fill: isHovered ? '#06b6d4' : '#8b5cf6', opacity: isHovered ? 0.3 : 0.15 }}
      style={{ filter: 'url(#visorGlow)' }}
    />
    {/* Left eye */}
    <motion.ellipse
      cx="50" cy="39" rx="6" ry="5"
      fill={isHovered ? '#06b6d4' : '#8b5cf6'}
      animate={{
        fill: isHovered ? '#06b6d4' : '#8b5cf6',
        scale: isHovered ? [1, 1.2, 1] : [0.9, 1.1, 0.9],
      }}
      style={isHovered ? { filter: 'drop-shadow(0 0 8px #06b6d4)' } : { filter: 'drop-shadow(0 0 4px #8b5cf6)' }}
    />
    {/* Right eye */}
    <motion.ellipse
      cx="70" cy="39" rx="6" ry="5"
      fill={isHovered ? '#06b6d4' : '#8b5cf6'}
      animate={{
        fill: isHovered ? '#06b6d4' : '#8b5cf6',
        scale: isHovered ? [1, 1.2, 1] : [1.1, 0.9, 1.1],
      }}
      style={isHovered ? { filter: 'drop-shadow(0 0 8px #06b6d4)' } : { filter: 'drop-shadow(0 0 4px #8b5cf6)' }}
    />
    {/* Smile / mouth */}
    <motion.path
      d="M48 55 Q60 62 72 55"
      stroke={isHovered ? '#06b6d4' : '#8b5cf6'}
      strokeWidth={2}
      strokeLinecap="round"
      fill="none"
      animate={{ stroke: isHovered ? '#06b6d4' : '#8b5cf6' }}
    />

    {/* Body */}
    <motion.rect
      x="38" y="72" width="44" height="32" rx="6"
      fill="#1a1c2e"
      stroke={isHovered ? '#06b6d4' : '#8b5cf6'}
      strokeWidth={1.5}
      animate={{ stroke: isHovered ? '#06b6d4' : '#8b5cf6' }}
    />
    {/* Chest panel */}
    <rect x="46" y="78" width="28" height="20" rx="4" fill="#0f111a" stroke={isHovered ? '#06b6d4' : '#8b5cf6'} strokeWidth="0.8" opacity="0.6" />

    {/* Chest progress bar (fills based on hover) */}
    <motion.rect
      x="48" y="82" width="24" height="4" rx="2"
      fill="#0f111a"
    />
    <motion.rect
      x="48" y="82"
      height="4" rx="2"
      fill={isHovered ? '#06b6d4' : '#8b5cf6'}
      // Explicit numeric `initial` — without it framer-motion's first frame
      // reads the (unset) DOM attribute and writes width="undefined",
      // spamming `<rect> attribute width: Expected length` in the console
      // (site audit 2026-07-05). Keyframe arrays don't seed an initial value.
      initial={{ width: 10 }}
      animate={{ width: isHovered ? [10, 20, 14] : [20, 14, 10], fill: isHovered ? '#06b6d4' : '#8b5cf6' }}
      style={{ filter: isHovered ? 'drop-shadow(0 0 4px #06b6d4)' : 'drop-shadow(0 0 4px #8b5cf6)' }}
    />

    {/* Chest dots */}
    {[0, 1, 2].map((i) => (
      <motion.circle
        key={i}
        cx={52 + i * 8} cy={91} r="2"
        fill={isHovered ? '#06b6d4' : '#8b5cf6'}
        animate={{
          opacity: isHovered ? [0.4, 1, 0.4] : [1, 0.4, 1],
          scale: isHovered ? [0.8, 1.2, 0.8] : [1.2, 0.8, 1.2],
        }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
        style={isHovered ? { filter: 'drop-shadow(0 0 3px #06b6d4)' } : {}}
      />
    ))}

    {/* Left arm */}
    <motion.rect x="24" y="75" width="12" height="24" rx="6"
      fill="#1a1c2e"
      stroke={isHovered ? '#06b6d4' : '#8b5cf6'}
      strokeWidth={1.5}
      animate={{ stroke: isHovered ? '#06b6d4' : '#8b5cf6', x: isHovered ? [0, -2, 0] : 0 }}
      style={{ originX: 36, originY: 87 }}
    />
    {/* Right arm */}
    <motion.rect x="84" y="75" width="12" height="24" rx="6"
      fill="#1a1c2e"
      stroke={isHovered ? '#06b6d4' : '#8b5cf6'}
      strokeWidth={1.5}
      animate={{ stroke: isHovered ? '#06b6d4' : '#8b5cf6', x: isHovered ? [0, 2, 0] : 0 }}
      style={{ originX: 84, originY: 87 }}
    />

    <defs>
      <filter id="visorGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  </svg>
);

interface Props {
  level: number;
  exp: number;
  username?: string;
  isAuthenticated?: boolean;
}

export default function AvatarCard({ level, exp, username, isAuthenticated }: Props) {
  const needed = expToNextLevel(level);
  const pct = Math.min((exp / needed) * 100, 100);

  // Personalize: show real username if logged in, otherwise prompt to login
  const greeting = isAuthenticated && username
    ? `Chào ${username}!`
    : 'Đăng nhập để bắt đầu';
  const dashboardTitle = isAuthenticated && username
    ? `${username}'s Dashboard`
    : 'Mission Control — Guest';
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#1a1c2e]/95 via-[#161830] to-[#0f111a]/95 p-6 md:p-8 backdrop-blur-2xl">
      {/* Ambient background */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-fuchsia-600/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-600/5 blur-3xl pointer-events-none" />

      <div className="relative flex items-center gap-5 md:gap-8">
        {/* ── Robot Avatar ── */}
        <div
          className="shrink-0 relative group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Outer glow ring — pulses when hovered */}
          <motion.div
            animate={{
              opacity: isHovered ? [0.5, 0.9, 0.5] : [0.2, 0.35, 0.2],
              scale: isHovered ? [1, 1.05, 1] : [0.98, 1.02, 0.98],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -inset-4 rounded-full"
            style={{
              background: `radial-gradient(circle, ${isHovered ? 'rgba(6,182,212,0.3)' : 'rgba(139,92,246,0.2)'} 0%, transparent 70%)`,
              filter: 'blur(12px)',
            }}
          />

          {/* Neon border ring */}
          <motion.div
            className="relative w-28 h-28 md:w-32 md:h-32 rounded-full p-[3px]"
            animate={{
              background: isHovered
                ? 'linear-gradient(135deg, #06b6d4, #0891b2, #06b6d4)'
                : 'linear-gradient(135deg, #8b5cf6, #ec4899, #8b5cf6)',
            }}
            transition={{ duration: 0.5 }}
            style={{
              boxShadow: isHovered
                ? '0 0 30px rgba(6,182,212,0.5), 0 0 60px rgba(6,182,212,0.2)'
                : '0 0 25px rgba(139,92,246,0.4), 0 0 50px rgba(139,92,246,0.15)',
            }}
          >
            {/* Floating animation */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full rounded-full bg-gradient-to-br from-[#1a1c2e] to-[#0a0b14] p-2 overflow-hidden"
            >
              <RobotSVG isHovered={isHovered} />
            </motion.div>
          </motion.div>

          {/* Level badge */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{
              scale: 1,
              rotate: 0,
              background: isHovered
                ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                : 'linear-gradient(135deg, #7c3aed, #db2777)',
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.3 }}
            className="absolute -bottom-1 -right-1 flex items-center gap-1 px-2.5 py-1 rounded-full font-black text-[10px] text-white border border-white/20"
            style={{
              boxShadow: isHovered
                ? '0 0 15px rgba(6,182,212,0.6)'
                : '0 0 15px rgba(139,92,246,0.6)',
            }}
          >
            <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            Lv.{level}
          </motion.div>
        </div>

        {/* ── Info panel ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <Bot className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">
              {greeting}
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-cyan-200 via-violet-200 to-fuchsia-200 bg-clip-text text-transparent mb-5 truncate">
            {dashboardTitle}
          </h1>

          {/* ── EXP bar ── */}
          <div>
            <div className="flex justify-between items-center text-[11px] mb-2">
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <Zap className="w-3.5 h-3.5 text-violet-400" />
                EXP
              </span>
              <div className="flex items-center gap-2">
                <motion.span
                  key={exp}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono font-black text-white text-sm"
                >
                  {exp}
                </motion.span>
                <span className="text-slate-600 font-mono text-xs">/ {needed}</span>
              </div>
            </div>

            <div className="relative h-3.5 rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.06]">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                animate={{
                  width: `${pct}%`,
                  background: isHovered
                    ? 'linear-gradient(to right, #06b6d4, #0891b2, #06b6d4)'
                    : 'linear-gradient(to right, #8b5cf6, #ec4899, #a855f7)',
                }}
                initial={{ width: 0 }}
                transition={{ duration: 1.4, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  boxShadow: isHovered
                    ? '0 0 20px rgba(6,182,212,0.7), 0 0 40px rgba(6,182,212,0.3)'
                    : '0 0 20px rgba(139,92,246,0.7), 0 0 40px rgba(139,92,246,0.3)',
                }}
              />
              {/* Shimmer */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" />
              {/* Star particles */}
              {pct >= 25 && (
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60" style={{ boxShadow: '0 0 6px rgba(255,255,255,0.8)' }} />
              )}
              {pct >= 75 && (
                <div className="absolute top-1/2 left-2/3 -translate-y-1/2 w-1 h-1 rounded-full bg-yellow-200/70" style={{ boxShadow: '0 0 4px rgba(253,224,71,0.8)' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
