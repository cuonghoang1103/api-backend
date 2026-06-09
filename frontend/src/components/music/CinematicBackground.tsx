'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface CinematicBackgroundProps {
  mouseX?: number;
  mouseY?: number;
}

export default function CinematicBackground({ mouseX = 0, mouseY = 0 }: CinematicBackgroundProps) {
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('night');
  const [transitioning, setTransitioning] = useState(false);
  const prevTimeRef = useRef<'day' | 'night'>('night');

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      const newTime: 'day' | 'night' = hour >= 6 && hour < 18 ? 'day' : 'night';
      if (newTime !== prevTimeRef.current) {
        setTransitioning(true);
        prevTimeRef.current = newTime;
        setTimeout(() => {
          setTimeOfDay(newTime);
          setTransitioning(false);
        }, 1500);
      } else {
        setTimeOfDay(newTime);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Parallax offsets based on mouse position
  const parallaxX = (mouseX - 0.5) * 30;
  const parallaxY = (mouseY - 0.5) * 20;

  const isNight = timeOfDay === 'night';

  // Anime boy coding scene - day version
  const dayBg = {
    background: `
      linear-gradient(180deg,
        #87CEEB 0%,
        #B4D7E8 30%,
        #E8F4FD 60%,
        #FFF8E7 100%
      )
    `,
    overlay: 'linear-gradient(180deg, transparent 40%, rgba(10,10,15,0.3) 70%, rgba(10,10,15,0.75) 100%)',
    windowGlow: 'rgba(255,220,150,0.3)',
    ambientColor: 'rgba(255,220,150,0.08)',
  };

  // Anime boy coding scene - night version with neon rain
  const nightBg = {
    background: `
      linear-gradient(180deg,
        #0f0a1e 0%,
        #1a1035 30%,
        #150d2e 60%,
        #0a0815 100%
      )
    `,
    overlay: 'linear-gradient(180deg, transparent 30%, rgba(5,5,15,0.4) 60%, rgba(5,5,15,0.85) 100%)',
    windowGlow: 'rgba(139,92,246,0.25)',
    ambientColor: 'rgba(139,92,246,0.06)',
  };

  const current = isNight ? nightBg : dayBg;

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden"
      style={{ background: current.background }}
    >
      {/* Parallax container */}
      <motion.div
        className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%]"
        animate={{
          x: parallaxX,
          y: parallaxY,
        }}
        transition={{ type: 'spring', stiffness: 30, damping: 20 }}
      >
        {/* Scene illustration - SVG based anime room */}
        <SceneIllustration isNight={isNight} />
      </motion.div>

      {/* Transition overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: transitioning ? 0 : 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/20 to-transparent" />

        {/* Window glow effect */}
        <div
          className="absolute transition-all duration-2000"
          style={{
            top: '15%',
            right: '8%',
            width: '320px',
            height: '240px',
            background: current.windowGlow,
            borderRadius: '16px',
            filter: 'blur(60px)',
          }}
        />

        {/* Ambient color blobs */}
        {isNight ? (
          <>
            <div
              className="absolute"
              style={{
                top: '20%',
                left: '5%',
                width: '400px',
                height: '400px',
                background: 'rgba(139,92,246,0.08)',
                borderRadius: '50%',
                filter: 'blur(100px)',
              }}
            />
            <div
              className="absolute"
              style={{
                bottom: '20%',
                right: '15%',
                width: '300px',
                height: '300px',
                background: 'rgba(34,211,238,0.06)',
                borderRadius: '50%',
                filter: 'blur(80px)',
              }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute"
              style={{
                top: '10%',
                left: '10%',
                width: '500px',
                height: '500px',
                background: 'rgba(255,220,150,0.12)',
                borderRadius: '50%',
                filter: 'blur(120px)',
              }}
            />
            <div
              className="absolute"
              style={{
                bottom: '30%',
                right: '20%',
                width: '400px',
                height: '400px',
                background: 'rgba(135,206,235,0.1)',
                borderRadius: '50%',
                filter: 'blur(100px)',
              }}
            />
          </>
        )}

        {/* Bottom overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{ background: current.overlay }}
        />

        {/* Vignette effect */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }}
        />
      </motion.div>

      {/* Scan lines effect for night mode */}
      {isNight && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
          }}
        />
      )}
    </div>
  );
}

// SVG illustration of anime boy coding at window
function SceneIllustration({ isNight }: { isNight: boolean }) {
  const windowFill = isNight
    ? 'fill="#1a1035" stroke="#8b5cf6" strokeWidth="2"'
    : 'fill="#E8F4FD" stroke="#B4D7E8" strokeWidth="2"';

  const skyColor = isNight ? '#0f0a1e' : '#87CEEB';
  const cityColor = isNight ? '#1a1035' : '#90EE90';
  const deskColor = isNight ? '#2d1b4e' : '#DEB887';
  const screenColor = isNight ? '#0f0a1e' : '#001a33';

  // Neon colors for night
  const neonPink = '#ec4899';
  const neonPurple = '#8b5cf6';
  const neonCyan = '#22d3ee';

  return (
    <svg
      viewBox="0 0 1200 800"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Window gradient */}
        <linearGradient id="windowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isNight ? '#1a1035' : '#B4D7E8'} />
          <stop offset="100%" stopColor={isNight ? '#0f0a1e' : '#E8F4FD'} />
        </linearGradient>

        {/* Screen glow gradient */}
        <radialGradient id="screenGlow">
          <stop offset="0%" stopColor={isNight ? '#8b5cf6' : '#4a90d9'} stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* City gradient for night */}
        <linearGradient id="cityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isNight ? '#2d1b4e' : '#90C695'} />
          <stop offset="100%" stopColor={isNight ? '#1a1035' : '#70B88A'} />
        </linearGradient>

        {/* Laptop screen */}
        <linearGradient id="screenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isNight ? '#1a0a2e' : '#003366'} />
          <stop offset="100%" stopColor={isNight ? '#0f0a1e' : '#001a33'} />
        </linearGradient>

        {/* Rain gradient */}
        <linearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={neonCyan} stopOpacity="0.4" />
          <stop offset="100%" stopColor={neonCyan} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Window frame */}
      <g transform="translate(680, 80)">
        {/* Window border */}
        <rect x="0" y="0" width="420" height="340" rx="12" fill={isNight ? '#1a0a2e' : '#FFF8E7'} />

        {/* Window panes */}
        <rect x="12" y="12" width="396" height="316" rx="8" fill="url(#windowGrad)" />

        {/* Sky / city view through window */}
        <rect x="12" y="12" width="396" height="200" rx="8" fill={skyColor} />

        {/* City silhouette */}
        <g>
          {/* Buildings */}
          <rect x="30" y="100" width="50" height="120" fill={cityColor} rx="2" />
          <rect x="85" y="80" width="40" height="140" fill={cityColor} rx="2" />
          <rect x="130" y="120" width="60" height="100" fill={cityColor} rx="2" />
          <rect x="195" y="60" width="45" height="160" fill={cityColor} rx="2" />
          <rect x="245" y="90" width="55" height="130" fill={cityColor} rx="2" />
          <rect x="305" y="110" width="35" height="110" fill={cityColor} rx="2" />
          <rect x="345" y="75" width="50" height="145" fill={cityColor} rx="2" />

          {/* Building windows - day */}
          {!isNight && (
            <>
              <rect x="38" y="110" width="8" height="8" fill="#FFD700" rx="1" />
              <rect x="55" y="110" width="8" height="8" fill="#FFD700" rx="1" />
              <rect x="38" y="130" width="8" height="8" fill="#FFD700" rx="1" />
              <rect x="95" y="90" width="8" height="8" fill="#FFD700" rx="1" />
              <rect x="140" y="130" width="8" height="8" fill="#FFD700" rx="1" />
              <rect x="155" y="130" width="8" height="8" fill="#FFD700" rx="1" />
            </>
          )}

          {/* Building windows - night (neon) */}
          {isNight && (
            <>
              {/* Building 1 windows */}
              <rect x="38" y="110" width="8" height="8" fill={neonPink} rx="1" opacity="0.9" />
              <rect x="55" y="110" width="8" height="8" fill={neonPurple} rx="1" opacity="0.8" />
              <rect x="38" y="130" width="8" height="8" fill={neonCyan} rx="1" opacity="0.7" />
              <rect x="55" y="130" width="8" height="8" fill={neonPink} rx="1" opacity="0.6" />

              {/* Building 2 windows */}
              <rect x="95" y="90" width="8" height="8" fill={neonCyan} rx="1" opacity="0.9" />
              <rect x="95" y="110" width="8" height="8" fill={neonPurple} rx="1" opacity="0.8" />

              {/* Building 3 windows */}
              <rect x="140" y="130" width="8" height="8" fill={neonPink} rx="1" opacity="0.9" />
              <rect x="155" y="130" width="8" height="8" fill={neonPurple} rx="1" opacity="0.7" />
              <rect x="170" y="130" width="8" height="8" fill={neonCyan} rx="1" opacity="0.8" />
              <rect x="140" y="155" width="8" height="8" fill={neonCyan} rx="1" opacity="0.6" />

              {/* Building 4 windows */}
              <rect x="205" y="70" width="8" height="8" fill={neonPurple} rx="1" opacity="0.9" />
              <rect x="220" y="70" width="8" height="8" fill={neonPink} rx="1" opacity="0.7" />
              <rect x="205" y="90" width="8" height="8" fill={neonCyan} rx="1" opacity="0.8" />

              {/* Building 5 windows */}
              <rect x="255" y="100" width="8" height="8" fill={neonCyan} rx="1" opacity="0.9" />
              <rect x="275" y="100" width="8" height="8" fill={neonPurple} rx="1" opacity="0.8" />
              <rect x="255" y="120" width="8" height="8" fill={neonPink} rx="1" opacity="0.7" />

              {/* Building 6 windows */}
              <rect x="315" y="120" width="8" height="8" fill={neonPink} rx="1" opacity="0.8" />
              <rect x="315" y="140" width="8" height="8" fill={neonCyan} rx="1" opacity="0.7" />

              {/* Building 7 windows */}
              <rect x="355" y="85" width="8" height="8" fill={neonPurple} rx="1" opacity="0.9" />
              <rect x="370" y="85" width="8" height="8" fill={neonCyan} rx="1" opacity="0.8" />
              <rect x="355" y="105" width="8" height="8" fill={neonPink} rx="1" opacity="0.7" />
              <rect x="370" y="105" width="8" height="8" fill={neonPurple} rx="1" opacity="0.6" />
            </>
          )}

          {/* Ground line */}
          <rect x="20" y="218" width="380" height="110" fill={isNight ? '#0a0515' : '#90EE90'} rx="4" />
        </g>

        {/* Rain drops for night */}
        {isNight && (
          <g opacity="0.5">
            <line x1="50" y1="12" x2="45" y2="100" stroke={neonCyan} strokeWidth="1" opacity="0.4" />
            <line x1="120" y1="12" x2="115" y2="130" stroke={neonCyan} strokeWidth="1" opacity="0.3" />
            <line x1="200" y1="12" x2="195" y2="90" stroke={neonCyan} strokeWidth="1" opacity="0.5" />
            <line x1="280" y1="12" x2="275" y2="150" stroke={neonCyan} strokeWidth="1" opacity="0.3" />
            <line x1="350" y1="12" x2="345" y2="80" stroke={neonCyan} strokeWidth="1" opacity="0.4" />
            <line x1="380" y1="12" x2="375" y2="110" stroke={neonCyan} strokeWidth="1" opacity="0.3" />
          </g>
        )}

        {/* Moon for day → night transition hint */}
        {isNight && (
          <circle cx="360" cy="50" r="25" fill="#f0e68c" opacity="0.8" />
        )}

        {/* Sunny clouds for day */}
        {!isNight && (
          <>
            <ellipse cx="80" cy="50" rx="35" ry="20" fill="white" opacity="0.8" />
            <ellipse cx="110" cy="45" rx="25" ry="18" fill="white" opacity="0.8" />
            <ellipse cx="55" cy="48" rx="20" ry="15" fill="white" opacity="0.8" />
          </>
        )}

        {/* Window dividers */}
        <line x1="210" y1="12" x2="210" y2="212" stroke={isNight ? '#3d2266' : '#DEB887'} strokeWidth="4" />
        <line x1="12" y1="112" x2="412" y2="112" stroke={isNight ? '#3d2266' : '#DEB887'} strokeWidth="4" />

        {/* Ambient glow from window */}
        <ellipse cx="212" cy="230" rx="200" ry="80" fill="url(#screenGlow)" />
      </g>

      {/* Desk and laptop area */}
      <g transform="translate(200, 450)">
        {/* Desk surface */}
        <rect x="0" y="80" width="500" height="20" rx="4" fill={deskColor} />
        <rect x="0" y="80" width="500" height="20" rx="4" fill={isNight ? 'rgba(139,92,246,0.1)' : 'rgba(0,0,0,0.1)'} />

        {/* Desk legs */}
        <rect x="20" y="100" width="15" height="150" fill={deskColor} rx="2" />
        <rect x="465" y="100" width="15" height="150" fill={deskColor} rx="2" />

        {/* Laptop base */}
        <rect x="180" y="60" width="140" height="8" rx="2" fill={isNight ? '#3d2266' : '#2d2d2d'} />

        {/* Laptop screen */}
        <rect x="175" y="5" width="150" height="55" rx="4" fill={isNight ? '#1a0a2e' : '#001a33'} stroke={isNight ? '#8b5cf6' : '#4a90d9'} strokeWidth="2" />

        {/* Screen content - code lines */}
        <g transform="translate(180, 10)">
          <rect x="0" y="0" width="40" height="4" rx="1" fill={isNight ? '#ec4899' : '#4a90d9'} opacity="0.8" />
          <rect x="45" y="0" width="60" height="4" rx="1" fill={isNight ? '#8b5cf6' : '#50C878'} opacity="0.7" />
          <rect x="0" y="10" width="30" height="4" rx="1" fill={isNight ? '#22d3ee' : '#FFA500'} opacity="0.7" />
          <rect x="35" y="10" width="80" height="4" rx="1" fill={isNight ? '#ec4899' : '#4a90d9'} opacity="0.6" />
          <rect x="0" y="20" width="50" height="4" rx="1" fill={isNight ? '#8b5cf6' : '#50C878'} opacity="0.7" />
          <rect x="55" y="20" width="40" height="4" rx="1" fill={isNight ? '#22d3ee' : '#FFA500'} opacity="0.6" />
          <rect x="0" y="30" width="25" height="4" rx="1" fill={isNight ? '#ec4899' : '#4a90d9'} opacity="0.8" />
        </g>

        {/* Screen glow */}
        <ellipse cx="250" cy="80" rx="100" ry="30" fill={isNight ? 'rgba(139,92,246,0.15)' : 'rgba(74,144,217,0.1)'} />

        {/* Coffee mug */}
        <g transform="translate(400, 45)">
          <rect x="0" y="0" width="25" height="30" rx="3" fill={isNight ? '#3d2266' : '#8B4513'} />
          <ellipse cx="12.5" cy="5" rx="12.5" ry="5" fill={isNight ? '#2d1b4e' : '#A0522D'} />
          {/* Steam */}
          {!isNight && (
            <>
              <path d="M8 0 Q5 -5 8 -10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
              <path d="M15 0 Q18 -5 15 -10" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
            </>
          )}
        </g>

        {/* Anime character (simplified) */}
        <g transform="translate(50, -20)">
          {/* Body */}
          <ellipse cx="40" cy="85" rx="25" ry="35" fill={isNight ? '#2d1b4e' : '#3498db'} />

          {/* Head */}
          <circle cx="40" cy="30" r="28" fill="#FFDAB9" />

          {/* Hair */}
          <ellipse cx="40" cy="18" rx="30" ry="18" fill={isNight ? '#1a0a2e' : '#2c2c2c'} />
          <ellipse cx="25" cy="25" rx="8" ry="15" fill={isNight ? '#1a0a2e' : '#2c2c2c'} />
          <ellipse cx="55" cy="25" rx="8" ry="15" fill={isNight ? '#1a0a2e' : '#2c2c2c'} />

          {/* Eyes */}
          <ellipse cx="32" cy="32" rx="5" ry="6" fill={isNight ? '#8b5cf6' : '#2c2c2c'} />
          <ellipse cx="48" cy="32" rx="5" ry="6" fill={isNight ? '#8b5cf6' : '#2c2c2c'} />
          <circle cx="33" cy="30" r="2" fill="white" />
          <circle cx="49" cy="30" r="2" fill="white" />

          {/* Mouth (focused expression) */}
          <line x1="38" y1="42" x2="44" y2="42" stroke={isNight ? '#8b5cf6' : '#c0392b'} strokeWidth="1.5" />

          {/* Glasses */}
          <circle cx="32" cy="32" r="9" fill="none" stroke={isNight ? '#8b5cf6' : '#333'} strokeWidth="1.5" />
          <circle cx="48" cy="32" r="9" fill="none" stroke={isNight ? '#8b5cf6' : '#333'} strokeWidth="1.5" />
          <line x1="41" y1="32" x2="39" y2="32" stroke={isNight ? '#8b5cf6' : '#333'} strokeWidth="1.5" />

          {/* Arms reaching to keyboard */}
          <path d="M15 85 Q-10 100 80 70" stroke="#FFDAB9" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M65 85 Q90 100 20 70" stroke="#FFDAB9" strokeWidth="12" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* Floating code symbols for night */}
      {isNight && (
        <g opacity="0.15" fontFamily="monospace" fontSize="14" fill={neonPurple}>
          <text x="100" y="200">{'{ }'}</text>
          <text x="300" y="150">{'( )'}</text>
          <text x="500" y="300">{'[ ]'}</text>
          <text x="900" y="250">{'=>'}</text>
          <text x="1000" y="400">{'/ *'}</text>
          <text x="150" y="400">{'const'}</text>
          <text x="800" y="180">{'API'}</text>
        </g>
      )}

      {/* Ambient particles for night */}
      {isNight && (
        <g opacity="0.3">
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx={100 + (i * 60) % 1000}
              cy={100 + (i * 40) % 500}
              r="1"
              fill={i % 3 === 0 ? neonPink : i % 3 === 1 ? neonPurple : neonCyan}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
