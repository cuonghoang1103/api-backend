'use client';

import { useEffect, useRef, useState } from 'react';

interface LaserStrikeProps {
  trigger: boolean;
  onComplete: () => void;
}

export function LaserStrike({ trigger, onComplete }: LaserStrikeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (trigger && !active) {
      setActive(true);
      fireLaser();
    }
  }, [trigger]);

  const fireLaser = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number; y: number;
      vx: number; vy: number;
      life: number; maxLife: number;
      color: string; size: number;
    }> = [];

    // Spawn particles from center
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const colors = ['#00ff66', '#00f0ff', '#ffb300', '#ffffff'];

    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.5;
      const speed = 3 + Math.random() * 8;
      particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1, maxLife: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
      });
    }

    let startTime: number | null = null;
    const duration = 1200;

    function draw(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Draw laser beam
      if (progress < 0.5) {
        const laserProgress = progress * 2;
        const laserX = laserProgress * canvas!.width;

        ctx!.save();
        ctx!.globalAlpha = 0.9 * (1 - laserProgress * 2);
        const gradient = ctx!.createLinearGradient(laserX - 100, 0, laserX + 100, 0);
        gradient.addColorStop(0, 'rgba(0,255,102,0)');
        gradient.addColorStop(0.5, 'rgba(0,255,102,0.8)');
        gradient.addColorStop(1, 'rgba(0,255,102,0)');
        ctx!.fillStyle = gradient;
        ctx!.fillRect(laserX - 100, cy - 2, 200, 4);
        // Glow
        ctx!.shadowColor = '#00ff66';
        ctx!.shadowBlur = 20;
        ctx!.fillRect(laserX - 2, cy - 2, 4, 4);
        ctx!.restore();
      }

      // Draw particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.life = 1 - elapsed / duration;

        if (p.life > 0) {
          ctx!.save();
          ctx!.globalAlpha = p.life;
          ctx!.fillStyle = p.color;
          ctx!.shadowColor = p.color;
          ctx!.shadowBlur = 8;
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.restore();
        }
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
        setActive(false);
        onComplete();
      }
    }

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  };

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-[200] pointer-events-none ${active ? 'visible' : 'invisible'}`}
    />
  );
}
