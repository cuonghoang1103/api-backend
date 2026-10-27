'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  brightness: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: string;
}

interface Orbit {
  cx: number;
  cy: number;
  radius: number;
  angle: number;
  speed: number;
  hue: number;
  size: number;
  opacity: number;
}

export default function AcademyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const orbitsRef = useRef<Orbit[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    if (!ctx) return;

    const STAR_COUNT = 150;
    const ORBIT_COUNT = 5;

    // 27/10/2026 (đo: /academy đứng yên mà luồng vẽ bận ~60%): lớp TĨNH (nền, tinh vân, viền tối) vẽ MỘT lần vào
    // canvas phụ khi đổi cỡ; ánh sao dùng ảnh mẫu vẽ sẵn cho mỗi màu (trước: ~160 createRadialGradient MỖI khung);
    // trần 30 khung/giây. Hình ảnh y như cũ.
    const nen = document.createElement('canvas');
    const anhSao = new Map<string, HTMLCanvasElement>();
    const saoMau = (mau: string) => {
      let c = anhSao.get(mau);
      if (!c) {
        c = document.createElement('canvas'); c.width = c.height = 32;
        const x = c.getContext('2d')!;
        const g = x.createRadialGradient(16, 16, 0, 16, 16, 16);
        g.addColorStop(0, mau); g.addColorStop(1, 'transparent');
        x.fillStyle = g; x.beginPath(); x.arc(16, 16, 16, 0, Math.PI * 2); x.fill();
        anhSao.set(mau, c);
      }
      return c;
    };
    const veNen = () => {
      const w = canvas.width, h = canvas.height;
      nen.width = w; nen.height = h;
      const c = nen.getContext('2d')!;
      const bg = c.createRadialGradient(w * 0.3, h * 0.3, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.8);
      bg.addColorStop(0, 'rgba(5, 3, 20, 0.97)');
      bg.addColorStop(0.4, 'rgba(3, 2, 12, 0.99)');
      bg.addColorStop(1, 'rgba(1, 1, 5, 1)');
      c.fillStyle = bg; c.fillRect(0, 0, w, h);
      c.save(); c.globalAlpha = 0.035;
      const n1 = c.createRadialGradient(w * 0.2, h * 0.25, 0, w * 0.2, h * 0.25, 350);
      n1.addColorStop(0, '#8b5cf6'); n1.addColorStop(1, 'transparent'); c.fillStyle = n1; c.fillRect(0, 0, w, h);
      const n2 = c.createRadialGradient(w * 0.8, h * 0.65, 0, w * 0.8, h * 0.65, 280);
      n2.addColorStop(0, '#22d3ee'); n2.addColorStop(1, 'transparent'); c.fillStyle = n2; c.fillRect(0, 0, w, h);
      c.restore();
    };
    const vien = document.createElement('canvas');
    const veVien = () => {
      const w = canvas.width, h = canvas.height;
      vien.width = w; vien.height = h;
      const c = vien.getContext('2d')!;
      const vig = c.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, Math.max(w, h) * 0.8);
      vig.addColorStop(0, 'transparent'); vig.addColorStop(1, 'rgba(0,0,0,0.55)');
      c.fillStyle = vig; c.fillRect(0, 0, w, h);
    };
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      veNen(); veVien();
    };

    function init() {
      const w = canvas.width;
      const h = canvas.height;
      const hues = ['#a855f7', '#22d3ee', '#8b5cf6', '#06b6d4', '#ec4899'];

      starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.3,
        brightness: Math.random(),
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: hues[Math.floor(Math.random() * hues.length)],
      }));

      orbitsRef.current = Array.from({ length: ORBIT_COUNT }, (_, i) => ({
        cx: w * (0.2 + i * 0.15),
        cy: h * (0.3 + i * 0.1),
        radius: 60 + i * 50,
        angle: Math.random() * Math.PI * 2,
        speed: 0.002 - i * 0.0002,
        hue: [260, 190, 280, 200, 320][i],
        size: Math.random() * 3 + 2,
        opacity: 0.35 - i * 0.04,
      }));
    }

    let lastTime = 0;
    function draw(ts: number) {
      if (ts && ts - lastTime < 1000 / 30 - 2) { rafRef.current = requestAnimationFrame(draw); return; }
      const dt = Math.min(ts - lastTime, 50) * 2; // bù nửa số khung ⇒ tốc độ chuyển động như cũ
      lastTime = ts;
      timeRef.current += 0.008;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      // Nền sâu + tinh vân: đã vẽ sẵn
      ctx.drawImage(nen, 0, 0);

      // Stars
      for (const star of starsRef.current) {
        star.twinklePhase += star.twinkleSpeed * 2;
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2;
        const alpha = star.brightness * 0.3 + twinkle * star.brightness * 0.7;

        ctx.save();
        ctx.globalAlpha = alpha;

        const r4 = star.size * 4;
        ctx.drawImage(saoMau(star.color), star.x - r4, star.y - r4, r4 * 2, r4 * 2);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        star.y += 0.08;
        if (star.y > h + 10) {
          star.y = -10;
          star.x = Math.random() * w;
        }
      }

      // Orbital rings
      for (const orbit of orbitsRef.current) {
        orbit.angle += orbit.speed * (dt / 16);

        // Orbit path
        ctx.save();
        ctx.strokeStyle = `hsla(${orbit.hue}, 70%, 50%, ${orbit.opacity * 0.5})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.beginPath();
        ctx.arc(orbit.cx, orbit.cy, orbit.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        // Orbiting body
        const bx = orbit.cx + Math.cos(orbit.angle) * orbit.radius;
        const by = orbit.cy + Math.sin(orbit.angle) * orbit.radius;

        ctx.save();
        ctx.globalAlpha = orbit.opacity;
        const glowGrad = ctx.createRadialGradient(bx, by, 0, bx, by, orbit.size * 6);
        glowGrad.addColorStop(0, `hsla(${orbit.hue}, 80%, 60%, 1)`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(bx, by, orbit.size * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = 1;
        ctx.fillStyle = `hsl(${orbit.hue}, 80%, 75%)`;
        ctx.beginPath();
        ctx.arc(bx, by, orbit.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Floating geometric shapes (hexagons)
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const x = (i / 4) * w + Math.sin(timeRef.current * 0.25 + i) * 60;
        const y = h * 0.15 + i * (h * 0.18) + Math.cos(timeRef.current * 0.18 + i * 1.5) * 35;
        const rotation = timeRef.current * 0.15 + i;
        const size = 28 + i * 12;
        const hue = [260, 190, 280, 200][i];
        ctx.globalAlpha = 0.035 + i * 0.01;
        ctx.strokeStyle = `hsl(${hue}, 70%, 50%)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          const angle = (j / 6) * Math.PI * 2 + rotation;
          const px = x + Math.cos(angle) * size;
          const py = y + Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();

      // Vignette (vẽ sẵn)
      ctx.drawImage(vien, 0, 0);

      rafRef.current = requestAnimationFrame(draw);
    }

    // Touch / coarse-pointer devices (phones, most tablets): paint one static
    // frame and NEVER start the rAF loop — cuts heat/jank on mobile. Desktop
    // (fine pointer) is unaffected.
    const isCoarse =
      typeof window !== 'undefined' && !!window.matchMedia?.('(pointer: coarse)')?.matches;

    resize();
    init();

    const onResize = () => { resize(); init(); if (isCoarse) { draw(0); cancelAnimationFrame(rafRef.current); } };
    window.addEventListener('resize', onResize);

    if (isCoarse) {
      draw(0);                              // one static frame
      cancelAnimationFrame(rafRef.current); // ...but don't animate
      return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener('resize', onResize);
      };
    }

    rafRef.current = requestAnimationFrame(draw);

    // Desktop: pause the loop while the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (!rafRef.current) {
        lastTime = performance.now();
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
