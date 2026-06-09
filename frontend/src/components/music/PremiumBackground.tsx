'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface PremiumBackgroundProps {
  mouseX?: number;
  mouseY?: number;
}

export default function PremiumBackground({ mouseX = 0, mouseY = 0 }: PremiumBackgroundProps) {
  const [transitioning, setTransitioning] = useState(false);
  const prevTimeRef = useRef<'day' | 'night'>('night');
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('night');

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

  const parallaxX = (mouseX - 0.5) * 25;
  const parallaxY = (mouseY - 0.5) * 15;

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Deep space gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: timeOfDay === 'night'
            ? 'linear-gradient(135deg, #0a0015 0%, #1a0535 40%, #0f0025 70%, #050010 100%)'
            : 'linear-gradient(135deg, #1a3a5c 0%, #2d5a7b 40%, #4a7a9b 70%, #87CEEB 100%)',
        }}
      />

      {/* Parallax scene */}
      <motion.div
        className="absolute inset-0 w-[130%] h-[130%] -left-[15%] -top-[15%]"
        animate={{ x: parallaxX, y: parallaxY }}
        transition={{ type: 'spring', stiffness: 25, damping: 20 }}
      >
        <SceneIllustration isNight={timeOfDay === 'night'} />
      </motion.div>

      {/* Transition overlay */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: transitioning ? 0 : 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(5,5,15,0.7)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />

        {/* Ambient glow blobs */}
        {timeOfDay === 'night' ? <NightGlows /> : <DayGlows />}
      </motion.div>

      {/* Scanlines for night */}
      {timeOfDay === 'night' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.04) 3px, rgba(255,255,255,0.04) 4px)',
          }}
        />
      )}

      {/* Film grain effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function NightGlows() {
  return (
    <>
      {/* Purple bloom top-left */}
      <div
        className="absolute transition-all duration-3000"
        style={{
          top: '-10%',
          left: '-5%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      {/* Cyan bloom right */}
      <div
        className="absolute transition-all duration-3000"
        style={{
          top: '20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
      {/* Pink bloom bottom */}
      <div
        className="absolute transition-all duration-3000"
        style={{
          bottom: '-5%',
          left: '30%',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 70%)',
          filter: 'blur(120px)',
        }}
      />
      {/* Window light reflection on floor */}
      <div
        className="absolute"
        style={{
          bottom: '15%',
          right: '5%',
          width: '400px',
          height: '200px',
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </>
  );
}

function DayGlows() {
  return (
    <>
      <div
        className="absolute"
        style={{
          top: '-5%',
          right: '20%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,220,150,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: '20%',
          left: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(135,206,235,0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />
    </>
  );
}

// Rich SVG scene: anime boy coding at window with city view
function SceneIllustration({ isNight }: { isNight: boolean }) {
  const n = {
    purple: '#a855f7',
    pink: '#ec4899',
    cyan: '#22d3ee',
    darkPurple: '#1a0535',
    midPurple: '#2d1b4e',
    windowFrame: '#1a0a2e',
    neonGlow: 'rgba(168,85,247,0.3)',
  };

  const d = {
    sky: '#87CEEB',
    cloud: '#ffffff',
    ground: '#90EE90',
    building: '#6B8E6B',
    window: '#FFD700',
    warmLight: 'rgba(255,220,150,0.3)',
  };

  return (
    <svg
      viewBox="0 0 1400 900"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="nSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f0025" />
          <stop offset="50%" stopColor="#1a0535" />
          <stop offset="100%" stopColor="#050010" />
        </linearGradient>
        <linearGradient id="nGroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={n.midPurple} />
          <stop offset="100%" stopColor={n.darkPurple} />
        </linearGradient>
        <radialGradient id="screenLightGrad">
          <stop offset="0%" stopColor={n.purple} stopOpacity="0.4" />
          <stop offset="100%" stopColor={n.purple} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="moonGrad">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </radialGradient>
        <filter id="neonBlur">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Window Frame - Right side */}
      <g transform="translate(750, 50)">
        {/* Outer frame */}
        <rect x="0" y="0" width="500" height="400" rx="16" fill={n.windowFrame} />
        <rect x="8" y="8" width="484" height="384" rx="12" fill={isNight ? '#0a0015' : '#E8F4FD'} />

        {/* Window sky */}
        {isNight ? (
          <>
            <rect x="8" y="8" width="484" height="240" rx="12" fill="url(#nSkyGrad)" />
            {/* Moon */}
            <circle cx="400" cy="80" r="40" fill="url(#moonGrad)" opacity="0.9" />
            <circle cx="385" cy="65" r="8" fill="#fde68a" opacity="0.3" />
            <circle cx="410" cy="90" r="5" fill="#fde68a" opacity="0.2" />
            {/* Stars */}
            {[[60, 40], [120, 80], [200, 30], [280, 70], [340, 45], [100, 120], [180, 150], [260, 100], [450, 60]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={1 + (i % 2)} fill="white" opacity={0.4 + (i % 3) * 0.2} />
            ))}
          </>
        ) : (
          <>
            <rect x="8" y="8" width="484" height="240" rx="12" fill={d.sky} />
            {/* Clouds */}
            <g opacity="0.9">
              <ellipse cx="80" cy="60" rx="50" ry="25" fill={d.cloud} />
              <ellipse cx="120" cy="50" rx="35" ry="22" fill={d.cloud} />
              <ellipse cx="50" cy="55" rx="30" ry="18" fill={d.cloud} />
            </g>
            <g opacity="0.8">
              <ellipse cx="320" cy="90" rx="40" ry="20" fill={d.cloud} />
              <ellipse cx="355" cy="80" rx="28" ry="18" fill={d.cloud} />
            </g>
          </>
        )}

        {/* City silhouette */}
        <g>
          <rect x="20" y="130" width="70" height="130" fill={isNight ? '#15052e' : d.building} rx="3" />
          <rect x="100" y="100" width="55" height="160" fill={isNight ? '#12042a' : d.building} rx="3" />
          <rect x="165" y="145" width="80" height="115" fill={isNight ? '#15052e' : d.building} rx="3" />
          <rect x="255" y="80" width="50" height="180" fill={isNight ? '#12042a' : d.building} rx="3" />
          <rect x="315" y="120" width="65" height="140" fill={isNight ? '#15052e' : d.building} rx="3" />
          <rect x="390" y="160" width="90" height="100" fill={isNight ? '#12042a' : d.building} rx="3" />

          {/* Building windows - night */}
          {isNight && (
            <>
              {/* Building 1 */}
              {[[35, 145], [55, 145], [35, 165], [55, 165], [35, 185], [55, 185], [35, 205], [55, 205]].map(([x, y], i) => (
                <rect key={`b1-${i}`} x={x} y={y} width="10" height="12" rx="1" fill={[n.purple, n.cyan, n.pink, n.cyan][i % 4]} opacity={0.7 + (i % 3) * 0.1} />
              ))}
              {/* Building 2 */}
              {[[112, 115], [132, 115], [112, 140], [132, 140], [112, 165], [132, 165], [112, 190], [132, 190]].map(([x, y], i) => (
                <rect key={`b2-${i}`} x={x} y={y} width="10" height="12" rx="1" fill={[n.cyan, n.purple, n.pink, n.purple][i % 4]} opacity={0.6 + (i % 3) * 0.1} />
              ))}
              {/* Building 3 */}
              {[[178, 160], [198, 160], [218, 160], [178, 185], [218, 185], [178, 210], [198, 210], [218, 210]].map(([x, y], i) => (
                <rect key={`b3-${i}`} x={x} y={y} width="10" height="12" rx="1" fill={[n.pink, n.cyan, n.purple, n.pink][i % 4]} opacity={0.7 + (i % 2) * 0.15} />
              ))}
              {/* Building 4 */}
              {[[268, 95], [288, 95], [268, 120], [288, 120], [268, 145], [288, 145], [268, 170], [288, 170]].map(([x, y], i) => (
                <rect key={`b4-${i}`} x={x} y={y} width="10" height="12" rx="1" fill={[n.purple, n.pink, n.cyan, n.pink][i % 4]} opacity={0.8} />
              ))}
              {/* Building 5 */}
              {[[328, 135], [348, 135], [328, 160], [348, 160], [328, 185], [348, 185], [328, 210], [348, 210]].map(([x, y], i) => (
                <rect key={`b5-${i}`} x={x} y={y} width="10" height="12" rx="1" fill={[n.cyan, n.purple, n.pink, n.cyan][i % 4]} opacity={0.65} />
              ))}
              {/* Building 6 */}
              {[[405, 175], [425, 175], [445, 175], [405, 200], [445, 200], [405, 225], [425, 225], [445, 225]].map(([x, y], i) => (
                <rect key={`b6-${i}`} x={x} y={y} width="10" height="12" rx="1" fill={[n.pink, n.purple, n.cyan, n.purple][i % 4]} opacity={0.7} />
              ))}
            </>
          )}

          {/* Building windows - day */}
          {!isNight && (
            <>
              {[35, 55, 112, 132, 178, 198, 218, 268, 288, 328, 348, 405, 425, 445].map((x, i) => (
                <rect key={`day-w-${i}`} x={x} y={i % 3 === 0 ? 145 : i % 3 === 1 ? 115 : 160} width="10" height="12" rx="1" fill={d.window} opacity="0.6" />
              ))}
            </>
          )}
        </g>

        {/* Ground/floor of window scene */}
        <rect x="8" y="248" width="484" height="144" fill={isNight ? '#0a0015' : d.ground} rx="0" />

        {/* Window dividers */}
        <line x1="250" y1="8" x2="250" y2="392" stroke={isNight ? '#3d1a6e' : '#DEB887'} strokeWidth="6" />
        <line x1="8" y1="200" x2="492" y2="200" stroke={isNight ? '#3d1a6e' : '#DEB887'} strokeWidth="6" />

        {/* Ambient glow from window onto room */}
        <ellipse cx="250" cy="410" rx="250" ry="80" fill={isNight ? 'url(#screenLightGrad)' : 'rgba(255,220,150,0.1)'} />

        {/* Rain drops on window glass */}
        {isNight && (
          <g opacity="0.4">
            {[30, 80, 140, 190, 280, 330, 400, 450].map((x, i) => (
              <line key={`rain-${i}`} x1={x} y1={8} x2={x - 2} y2={100 + (i * 20) % 100} stroke={n.cyan} strokeWidth={0.8} opacity={0.3 + (i % 3) * 0.15} />
            ))}
          </g>
        )}
      </g>

      {/* Room / Desk area - bottom left */}
      <g transform="translate(100, 500)">
        {/* Desk surface */}
        <rect x="0" y="80" width="600" height="25" rx="4" fill={isNight ? '#1a0a2e' : '#DEB887'} />
        <rect x="0" y="80" width="600" height="25" rx="4" fill={isNight ? 'rgba(168,85,247,0.08)' : 'rgba(0,0,0,0.05)'} />

        {/* Desk legs */}
        <rect x="30" y="105" width="18" height="180" rx="3" fill={isNight ? '#12042a' : '#8B7355'} />
        <rect x="552" y="105" width="18" height="180" rx="3" fill={isNight ? '#12042a' : '#8B7355'} />

        {/* Laptop screen glow */}
        <ellipse cx="300" cy="50" rx="150" ry="60" fill={isNight ? 'rgba(168,85,247,0.12)' : 'rgba(74,144,217,0.08)'} />

        {/* Laptop base */}
        <rect x="220" y="55" width="160" height="10" rx="3" fill={isNight ? '#2d1b4e' : '#2d2d2d'} />

        {/* Laptop screen */}
        <rect x="215" y="-30" width="170" height="85" rx="6" fill={isNight ? '#0a0015' : '#001a33'} stroke={isNight ? n.purple : '#4a90d9'} strokeWidth="2" />

        {/* Screen content - code */}
        <g transform="translate(222, -22)">
          {/* Line numbers */}
          <text x="0" y="8" fill={isNight ? 'rgba(168,85,247,0.3)' : 'rgba(100,100,100,0.5)'} fontSize="7" fontFamily="monospace">1</text>
          <text x="0" y="20" fill={isNight ? 'rgba(168,85,247,0.3)' : 'rgba(100,100,100,0.5)'} fontSize="7" fontFamily="monospace">2</text>
          <text x="0" y="32" fill={isNight ? 'rgba(168,85,247,0.3)' : 'rgba(100,100,100,0.5)'} fontSize="7" fontFamily="monospace">3</text>
          <text x="0" y="44" fill={isNight ? 'rgba(168,85,247,0.3)' : 'rgba(100,100,100,0.5)'} fontSize="7" fontFamily="monospace">4</text>
          <text x="0" y="56" fill={isNight ? 'rgba(168,85,247,0.3)' : 'rgba(100,100,100,0.5)'} fontSize="7" fontFamily="monospace">5</text>
          <text x="0" y="68" fill={isNight ? 'rgba(168,85,247,0.3)' : 'rgba(100,100,100,0.5)'} fontSize="7" fontFamily="monospace">6</text>

          {/* Code lines */}
          <rect x="18" y="2" width="50" height="5" rx="1" fill={isNight ? n.pink : '#4a90d9'} opacity="0.9" />
          <rect x="72" y="2" width="70" height="5" rx="1" fill={isNight ? n.purple : '#50C878'} opacity="0.8" />
          <rect x="18" y="14" width="35" height="5" rx="1" fill={isNight ? n.cyan : '#FFA500'} opacity="0.8" />
          <rect x="58" y="14" width="90" height="5" rx="1" fill={isNight ? n.pink : '#4a90d9'} opacity="0.7" />
          <rect x="28" y="26" width="25" height="5" rx="1" fill={isNight ? n.cyan : '#50C878'} opacity="0.9" />
          <rect x="58" y="26" width="55" height="5" rx="1" fill={isNight ? n.purple : '#FFA500'} opacity="0.7" />
          <rect x="18" y="38" width="45" height="5" rx="1" fill={isNight ? n.pink : '#4a90d9'} opacity="0.8" />
          <rect x="68" y="38" width="35" height="5" rx="1" fill={isNight ? n.cyan : '#50C878'} opacity="0.7" />
          <rect x="28" y="50" width="60" height="5" rx="1" fill={isNight ? n.purple : '#FFA500'} opacity="0.9" />
          <rect x="18" y="62" width="30" height="5" rx="1" fill={isNight ? n.cyan : '#4a90d9'} opacity="0.8" />
        </g>

        {/* Screen glow cast on desk */}
        <ellipse cx="300" cy="90" rx="100" ry="20" fill={isNight ? 'rgba(168,85,247,0.06)' : 'rgba(74,144,217,0.04)'} />

        {/* Coffee mug */}
        <g transform="translate(480, 40)">
          <rect x="0" y="0" width="30" height="38" rx="4" fill={isNight ? '#2d1b4e' : '#8B4513'} />
          <ellipse cx="15" cy="6" rx="15" ry="6" fill={isNight ? '#3d2266' : '#A0522D'} />
          {!isNight && (
            <>
              <path d="M8 0 Q4 -8 8 -15" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
              <path d="M20 0 Q24 -8 20 -15" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />
            </>
          )}
          {isNight && (
            <ellipse cx="15" cy="6" rx="10" ry="4" fill={n.purple} opacity="0.15" />
          )}
        </g>

        {/* Anime character - top half */}
        <g transform="translate(50, 50)">
          {/* Body / hoodie */}
          <ellipse cx="50" cy="130" rx="40" ry="55" fill={isNight ? '#1a0535' : '#3498db'} />
          <ellipse cx="50" cy="130" rx="40" ry="55" fill={isNight ? 'rgba(168,85,247,0.1)' : 'rgba(0,0,0,0.05)'} />

          {/* Head */}
          <circle cx="50" cy="55" r="45" fill="#FFDAB9" />

          {/* Hair - fluffy anime style */}
          <ellipse cx="50" cy="25" rx="48" ry="30" fill={isNight ? '#0f0025' : '#2c2c2c'} />
          <ellipse cx="20" cy="35" rx="15" ry="25" fill={isNight ? '#0f0025' : '#2c2c2c'} />
          <ellipse cx="80" cy="35" rx="15" ry="25" fill={isNight ? '#0f0025' : '#2c2c2c'} />
          <ellipse cx="30" cy="20" rx="12" ry="18" fill={isNight ? '#0f0025' : '#2c2c2c'} />
          <ellipse cx="70" cy="20" rx="12" ry="18" fill={isNight ? '#0f0025' : '#2c2c2c'} />

          {/* Face screen glow reflection */}
          {isNight && (
            <ellipse cx="50" cy="60" rx="35" ry="25" fill={n.purple} opacity="0.08" />
          )}

          {/* Eyes */}
          <ellipse cx="35" cy="58" rx="9" ry="11" fill={isNight ? n.purple : '#2c2c2c'} />
          <ellipse cx="65" cy="58" rx="9" ry="11" fill={isNight ? n.purple : '#2c2c2c'} />
          {/* Eye highlights */}
          <circle cx="38" cy="54" r="4" fill="white" opacity="0.9" />
          <circle cx="68" cy="54" r="4" fill="white" opacity="0.9" />
          <circle cx="33" cy="60" r="2" fill="white" opacity="0.5" />
          <circle cx="63" cy="60" r="2" fill="white" opacity="0.5" />

          {/* Mouth - small focused smile */}
          <path d="M42 75 Q50 80 58 75" stroke={isNight ? n.purple : '#c0392b'} strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Glasses */}
          <circle cx="35" cy="58" r="16" fill="none" stroke={isNight ? n.purple : '#333'} strokeWidth="2.5" opacity="0.8" />
          <circle cx="65" cy="58" r="16" fill="none" stroke={isNight ? n.purple : '#333'} strokeWidth="2.5" opacity="0.8" />
          <line x1="51" y1="58" x2="49" y2="58" stroke={isNight ? n.purple : '#333'} strokeWidth="2.5" opacity="0.8" />
          <line x1="19" y1="55" x2="14" y2="52" stroke={isNight ? n.purple : '#333'} strokeWidth="2" opacity="0.6" />
          <line x1="81" y1="55" x2="86" y2="52" stroke={isNight ? n.purple : '#333'} strokeWidth="2" opacity="0.6" />

          {/* Blush */}
          <ellipse cx="22" cy="68" rx="8" ry="4" fill="#ffb6c1" opacity="0.4" />
          <ellipse cx="78" cy="68" rx="8" ry="4" fill="#ffb6c1" opacity="0.4" />

          {/* Arms */}
          <path d="M10 130 Q-30 120 100 95" stroke="#FFDAB9" strokeWidth="18" fill="none" strokeLinecap="round" />
          <path d="M90 130 Q130 120 0 95" stroke="#FFDAB9" strokeWidth="18" fill="none" strokeLinecap="round" />
        </g>
      </g>

      {/* Floating code symbols */}
      {isNight && (
        <g opacity="0.08" fontFamily="monospace" fontSize="16" fill={n.purple}>
          {['const', 'let', 'fn', '=>', '()', '{}', '[]', 'API', '/>', '//'].map((sym, i) => (
            <text key={i} x={80 + (i * 130) % 1200} y={80 + (i * 70) % 400} opacity={0.5 + (i % 3) * 0.2}>
              {sym}
            </text>
          ))}
        </g>
      )}

      {/* Floating ambient particles for night */}
      {isNight && (
        <g opacity="0.25">
          {Array.from({ length: 30 }).map((_, i) => (
            <circle
              key={i}
              cx={50 + (i * 47) % 1300}
              cy={50 + (i * 31) % 800}
              r={0.5 + (i % 3)}
              fill={[n.purple, n.cyan, n.pink][i % 3]}
            />
          ))}
        </g>
      )}
    </svg>
  );
}
