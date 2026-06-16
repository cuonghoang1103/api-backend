'use client';

import { useRef, useEffect, useCallback } from 'react';
import { getAudioAnalyser } from '@/hooks/useAudioAnalyser';
import type { Track } from '@/types';

interface CyberAudioVisualizerProps {
  isPlaying: boolean;
  currentTrack: Track | null;
}

const BAR_COUNT = 80;
const BAR_GAP = 2;
const PRIMARY = '#8B5CF6';
const SECONDARY = '#06b6d4';
const ACCENT = '#ec4899';

export default function CyberAudioVisualizer({ isPlaying }: CyberAudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const phaseRef = useRef(0);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, freqData: Uint8Array | null) => {
    ctx.clearRect(0, 0, width, height);

    const BAR_W = (width - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT;
    const MIN_H = 3;

    for (let i = 0; i < BAR_COUNT; i++) {
      const x = i * (BAR_W + BAR_GAP);
      const norm = i / BAR_COUNT;

      let barH: number;
      if (isPlaying && freqData) {
        // Use real frequency data from the Web Audio API analyser.
        // Scale i to match the freqData array length.
        const freqIndex = Math.floor((i / BAR_COUNT) * freqData.length);
        const value = freqData[freqIndex] / 255; // 0..1
        barH = MIN_H + value * (height - MIN_H);
      } else if (isPlaying) {
        // Fallback: simulated waveform when analyser isn't available yet.
        const wave1 = Math.sin(phaseRef.current + norm * Math.PI * 6) * 0.5 + 0.5;
        const wave2 = Math.sin(phaseRef.current * 1.4 + norm * Math.PI * 8) * 0.3 + 0.5;
        const wave3 = Math.sin(phaseRef.current * 0.7 + norm * Math.PI * 3) * 0.2 + 0.5;
        const noise = Math.random() * 0.1;
        barH = MIN_H + (wave1 * 0.45 + wave2 * 0.35 + wave3 * 0.2 + noise) * (height - MIN_H);
      } else {
        // Idle: gentle sine wave at the bottom.
        barH = MIN_H + Math.sin(norm * Math.PI) * (height * 0.1);
      }

      const y = (height - barH) / 2;

      const grad = ctx.createLinearGradient(x, y, x, y + barH);
      grad.addColorStop(0, PRIMARY);
      grad.addColorStop(0.4, SECONDARY);
      grad.addColorStop(0.7, ACCENT);
      grad.addColorStop(1, PRIMARY);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, BAR_W, barH, 2);
      ctx.fill();

      // Reflection under each bar — only when playing
      if (isPlaying) {
        ctx.fillStyle = 'rgba(139,92,246,0.07)';
        ctx.beginPath();
        ctx.roundRect(x, height - y + 2, BAR_W, barH * 0.25, 2);
        ctx.fill();
      }
    }

    if (isPlaying) {
      phaseRef.current += 0.08;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    let freqData: Uint8Array | null = null;

    const loop = () => {
      const analyser = getAudioAnalyser();
      if (analyser) {
        if (!freqData || freqData.length !== analyser.frequencyBinCount) {
          freqData = new Uint8Array(analyser.frequencyBinCount);
        }
        analyser.getByteFrequencyData(freqData as Uint8Array<ArrayBuffer>);
      } else {
        freqData = null;
      }
      draw(ctx, width, height, freqData);
      rafRef.current = requestAnimationFrame(loop);
    };

    loop();

    const handleResize = () => { resize(); };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-16 rounded-xl"
      style={{ display: 'block', background: 'rgba(255,255,255,0.02)' }}
    />
  );
}
