'use client';

import { useEffect, useState } from 'react';

/**
 * SummerShopBackground — a bright, animated tropical summer backdrop for the
 * shop (distinct from the beach-photo look: a painted gradient sky + sun,
 * rotating light rays, drifting clouds, rising bubbles, and a gentle animated
 * wave). All motion is CSS transform/opacity (cheap). Honours
 * prefers-reduced-motion and coarse pointers (renders a static frame).
 */
export default function SummerShopBackground() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia?.('(pointer: coarse)').matches;
    setAnimate(!reduce && !coarse);
  }, []);

  const clouds = [
    { top: '12%', size: 220, dur: 90, delay: 0, opacity: 0.85 },
    { top: '26%', size: 150, dur: 70, delay: -30, opacity: 0.6 },
    { top: '44%', size: 280, dur: 120, delay: -60, opacity: 0.5 },
    { top: '8%', size: 120, dur: 60, delay: -20, opacity: 0.4 },
  ];
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    left: `${(i * 8.3 + 4) % 100}%`,
    size: 6 + ((i * 7) % 16),
    dur: 12 + ((i * 5) % 14),
    delay: -((i * 3) % 18),
    opacity: 0.15 + ((i % 4) * 0.08),
  }));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #0b1b3f 0%, #10357e 18%, #1f6fd4 40%, #35a7e8 60%, #6fd0e6 78%, #bff0ea 100%)',
        }}
      />

      {/* Sun glow */}
      <div
        className="absolute rounded-full"
        style={{
          top: '-8%', right: '8%', width: 420, height: 420,
          background: 'radial-gradient(circle, rgba(255,241,183,0.95) 0%, rgba(255,214,120,0.45) 35%, rgba(255,190,90,0) 70%)',
          filter: 'blur(6px)',
          animation: animate ? 'summerSunPulse 7s ease-in-out infinite' : undefined,
        }}
      />
      {/* Sun core */}
      <div
        className="absolute rounded-full"
        style={{
          top: '4%', right: '15%', width: 130, height: 130,
          background: 'radial-gradient(circle, #fff7dd 0%, #ffe08a 55%, #ffca5a 100%)',
          boxShadow: '0 0 80px 20px rgba(255,220,130,0.55)',
        }}
      />
      {/* Rotating sun rays */}
      <div
        className="absolute"
        style={{
          top: 'calc(4% - 130px)', right: 'calc(15% - 130px)', width: 400, height: 400,
          background: 'conic-gradient(from 0deg, rgba(255,240,180,0.18) 0deg, transparent 12deg, rgba(255,240,180,0.14) 24deg, transparent 40deg, rgba(255,240,180,0.16) 60deg, transparent 78deg, rgba(255,240,180,0.14) 100deg, transparent 130deg, rgba(255,240,180,0.16) 170deg, transparent 210deg, rgba(255,240,180,0.14) 260deg, transparent 320deg)',
          borderRadius: '50%',
          filter: 'blur(3px)',
          animation: animate ? 'summerSpin 90s linear infinite' : undefined,
        }}
      />

      {/* Clouds */}
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: c.top, left: '-20%', width: c.size, height: c.size * 0.42,
            opacity: c.opacity,
            background: 'radial-gradient(60% 60% at 30% 60%, rgba(255,255,255,0.95), rgba(255,255,255,0) 70%), radial-gradient(55% 55% at 60% 45%, rgba(255,255,255,0.9), rgba(255,255,255,0) 72%), radial-gradient(50% 50% at 80% 65%, rgba(255,255,255,0.85), rgba(255,255,255,0) 74%)',
            filter: 'blur(2px)',
            animation: animate ? `summerDrift ${c.dur}s linear ${c.delay}s infinite` : undefined,
            transform: animate ? undefined : 'translateX(60vw)',
          }}
        />
      ))}

      {/* Water shimmer at the bottom */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '26%',
          background: 'linear-gradient(180deg, rgba(64,196,210,0) 0%, rgba(46,170,200,0.35) 50%, rgba(30,120,170,0.55) 100%)',
        }}
      />

      {/* Rising bubbles */}
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.left, bottom: '-40px', width: b.size, height: b.size,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.15) 60%, rgba(255,255,255,0) 75%)',
            border: '1px solid rgba(255,255,255,0.25)',
            opacity: b.opacity,
            animation: animate ? `summerRise ${b.dur}s ease-in ${b.delay}s infinite` : undefined,
            display: animate ? undefined : 'none',
          }}
        />
      ))}

      {/* Animated wave silhouette */}
      <svg className="absolute bottom-0 left-0 w-[200%] h-24" viewBox="0 0 1440 120" preserveAspectRatio="none"
        style={{ animation: animate ? 'summerWave 14s ease-in-out infinite alternate' : undefined }}>
        <path d="M0,64 C240,110 480,20 720,54 C960,88 1200,30 1440,60 L1440,120 L0,120 Z" fill="rgba(20,90,140,0.5)" />
        <path d="M0,80 C240,40 480,110 720,74 C960,38 1200,96 1440,70 L1440,120 L0,120 Z" fill="rgba(12,60,100,0.6)" />
      </svg>

      {/* Subtle top vignette so the navbar/text stays legible */}
      <div className="absolute inset-x-0 top-0 h-40" style={{ background: 'linear-gradient(180deg, rgba(5,8,24,0.5), rgba(5,8,24,0))' }} />

      <style>{`
        @keyframes summerDrift { from { transform: translateX(0); } to { transform: translateX(150vw); } }
        @keyframes summerRise { 0% { transform: translateY(0) translateX(0); opacity: 0; } 12% { opacity: 1; } 100% { transform: translateY(-108vh) translateX(24px); opacity: 0; } }
        @keyframes summerSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes summerSunPulse { 0%,100% { opacity: 0.85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
        @keyframes summerWave { from { transform: translateX(0); } to { transform: translateX(-25%); } }
      `}</style>
    </div>
  );
}
