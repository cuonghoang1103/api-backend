'use client';

import { useEffect, useRef } from 'react';

interface ParticleRainProps {
  isNight?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
}

export default function ParticleRain({
  isNight = true,
  intensity = 'medium',
}: ParticleRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isNight) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle configuration
    const count = intensity === 'heavy' ? 150 : intensity === 'medium' ? 80 : 40;
    const speedMultiplier = intensity === 'heavy' ? 1.5 : intensity === 'medium' ? 1 : 0.6;

    const particles: Particle[] = [];
    const w = canvas.width;
    const h = canvas.height;

    class Particle {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      color: string;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.length = Math.random() * 20 + 10;
        this.speed = (Math.random() * 4 + 4) * speedMultiplier;
        this.opacity = Math.random() * 0.3 + 0.1;
        const colors = ['139, 92, 246', '34, 211, 238', '236, 72, 153'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speed;
        if (this.y > h) {
          this.y = -this.length;
          this.x = Math.random() * w;
        }
        this.x += Math.sin(this.y * 0.01) * 0.3;
      }

      draw() {
        ctx!.beginPath();
        ctx!.moveTo(this.x, this.y);
        ctx!.lineTo(this.x + 1, this.y + this.length);
        ctx!.strokeStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      }
    }

    // Initialize particles
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    // Light dust particles floating
    const dustParticles: DustParticle[] = [];
    class DustParticle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      color: string;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.15 + 0.05;
        const colors = ['139, 92, 246', '34, 211, 238', '236, 72, 153', '255, 255, 255'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx!.fill();
      }
    }

    // Initialize dust
    for (let i = 0; i < 30; i++) {
      dustParticles.push(new DustParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      // Draw rain
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // Draw floating dust
      dustParticles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isNight, intensity]);

  if (!isNight) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
