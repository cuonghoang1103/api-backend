'use client';

import { useRef, useEffect } from 'react';
import { useMusicStore } from '@/store/musicStore';
import type { Track } from '@/types';

interface CyberAudioVisualizerProps {
  isPlaying: boolean;
  currentTrack: Track | null;
}

export default function CyberAudioVisualizer({ isPlaying, currentTrack }: CyberAudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);
  const prevTrackRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const BAR_COUNT = 80;
    const BAR_GAP = 2;
    const dpr = window.devicePixelRatio || 1;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    const BAR_W = (width - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT;
    const MIN_H = 3;

    const PRIMARY = '#8B5CF6';
    const SECONDARY = '#06b6d4';
    const ACCENT = '#ec4899';

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < BAR_COUNT; i++) {
        const x = i * (BAR_W + BAR_GAP);
        const norm = i / BAR_COUNT;

        let barH: number;
        if (isPlaying) {
          const wave1 = Math.sin(phaseRef.current + norm * Math.PI * 6) * 0.5 + 0.5;
          const wave2 = Math.sin(phaseRef.current * 1.4 + norm * Math.PI * 8) * 0.3 + 0.5;
          const wave3 = Math.sin(phaseRef.current * 0.7 + norm * Math.PI * 3) * 0.2 + 0.5;
          const noise = Math.random() * 0.1;
          barH = MIN_H + (wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2 + noise) * (height - MIN_H);
        } else {
          barH = MIN_H + Math.sin(norm * Math.PI) * (height * 0.1);
        }

        const y = (height - barH) / 2;

        // Glow
        ctx.shadowColor = PRIMARY;
        ctx.shadowBlur = isPlaying ? 12 : 0;

        // Gradient fill
        const grad = ctx.createLinearGradient(x, y, x, y + barH);
        grad.addColorStop(0, PRIMARY);
        grad.addColorStop(0.4, SECONDARY);
        grad.addColorStop(0.7, ACCENT);
        grad.addColorStop(1, PRIMARY);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, BAR_W, barH, 2);
        ctx.fill();

        // Reflection
        if (isPlaying) {
          ctx.fillStyle = 'rgba(139,92,246,0.08)';
          ctx.beginPath();
          ctx.roundRect(x, height - y + 2, BAR_W, barH * 0.25, 2);
          ctx.fill();
        }

        ctx.shadowBlur = 0;
      }

      if (isPlaying) {
        phaseRef.current += 0.08;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => { resize(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying]);

  // Reset phase on track change
  useEffect(() => {
    if (currentTrack?.id !== prevTrackRef.current) {
      phaseRef.current = 0;
      prevTrackRef.current = currentTrack?.id ?? null;
    }
  }, [currentTrack?.id]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-16 rounded-xl"
      style={{ display: 'block', background: 'rgba(255,255,255,0.02)' }}
    />
  );
}
