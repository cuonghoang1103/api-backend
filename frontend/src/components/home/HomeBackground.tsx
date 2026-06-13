'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  pulsePhase: number;
  pulseSpeed: number;
}

interface Pulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  hue: number;
}

interface FloatingShape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  sides: number;
  hue: number;
  opacity: number;
}

export default function HomeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const shapesRef = useRef<FloatingShape[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COLORS = ['#8b5cf6', '#06b6d4', '#ec4899', '#a855f7', '#22d3ee', '#6366f1'];
    const NODE_COUNT = 55;
    const SHAPE_COUNT = 8;
    const MAX_DIST = 180;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    function initNodes() {
      const w = canvas.width;
      const h = canvas.height;
      nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2.5 + 1,
        hue: Math.random() * 360,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.015 + 0.005,
      }));

      shapesRef.current = Array.from({ length: SHAPE_COUNT }, (_, i) => ({
        x: (i / SHAPE_COUNT) * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.003,
        size: Math.random() * 40 + 20,
        sides: Math.floor(Math.random() * 3) + 3,
        hue: [260, 280, 190, 320, 220][i % 5],
        opacity: Math.random() * 0.06 + 0.02,
      }));
    }

    function spawnPulse(x: number, y: number) {
      if (pulsesRef.current.length > 5) return;
      pulsesRef.current.push({
        x, y,
        radius: 0,
        maxRadius: Math.random() * 150 + 80,
        opacity: 0.4,
        hue: 260 + Math.random() * 40,
      });
    }

    function drawHexagon(cx: number, cy: number, radius: number, rotation: number) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 + rotation;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    function drawPolygon(cx: number, cy: number, radius: number, rotation: number, sides: number) {
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + rotation;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    }

    function drawGrid() {
      const w = canvas.width;
      const h = canvas.height;
      const CELL = 50;
      ctx.save();
      ctx.strokeStyle = `rgba(139, 92, 246, 0.025)`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= w; x += CELL) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += CELL) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    function draw() {
      const w = canvas.width;
      const h = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      timeRef.current += 0.005;

      ctx.clearRect(0, 0, w, h);

      // Background radial gradient
      const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, Math.max(w, h) * 0.8);
      bgGrad.addColorStop(0, 'rgba(15, 10, 35, 0.95)');
      bgGrad.addColorStop(0.5, 'rgba(8, 5, 20, 0.98)');
      bgGrad.addColorStop(1, 'rgba(3, 2, 8, 1)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      drawGrid();

      // Draw floating geometric shapes (background layer)
      ctx.save();
      for (const shape of shapesRef.current) {
        ctx.save();
        ctx.globalAlpha = shape.opacity;
        const grad = ctx.createLinearGradient(
          shape.x - shape.size, shape.y - shape.size,
          shape.x + shape.size, shape.y + shape.size
        );
        grad.addColorStop(0, `hsla(${shape.hue}, 70%, 50%, 0.8)`);
        grad.addColorStop(1, `hsla(${shape.hue + 30}, 80%, 40%, 0.4)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        drawPolygon(shape.x, shape.y, shape.size, shape.rotation, shape.sides);

        // Inner glow
        ctx.shadowColor = `hsla(${shape.hue}, 70%, 50%, 0.3)`;
        ctx.shadowBlur = 20;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.restore();

        // Update
        shape.x += shape.vx;
        shape.y += shape.vy;
        shape.rotation += shape.rotationSpeed;
        if (shape.x < -shape.size * 2) shape.x = w + shape.size;
        if (shape.x > w + shape.size * 2) shape.x = -shape.size;
        if (shape.y < -shape.size * 2) shape.y = h + shape.size;
        if (shape.y > h + shape.size * 2) shape.y = -shape.size;
      }
      ctx.restore();

      // Aurora wave 1
      ctx.save();
      ctx.globalAlpha = 0.04;
      const aurora1 = ctx.createLinearGradient(0, h * 0.2, 0, h * 0.7);
      aurora1.addColorStop(0, 'transparent');
      aurora1.addColorStop(0.3, `hsla(270, 70%, 50%, ${0.3 + Math.sin(timeRef.current) * 0.1})`);
      aurora1.addColorStop(0.6, `hsla(200, 80%, 40%, ${0.2 + Math.cos(timeRef.current * 0.7) * 0.1})`);
      aurora1.addColorStop(1, 'transparent');
      ctx.fillStyle = aurora1;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.7);
      for (let x = 0; x <= w; x += 10) {
        const wave = Math.sin((x / w) * 4 + timeRef.current * 1.5) * 40
          + Math.sin((x / w) * 8 + timeRef.current * 0.8) * 20;
        ctx.lineTo(x, h * 0.35 + wave);
      }
      ctx.lineTo(w, h * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Aurora wave 2
      ctx.save();
      ctx.globalAlpha = 0.03;
      const aurora2 = ctx.createLinearGradient(0, h * 0.3, 0, h * 0.8);
      aurora2.addColorStop(0, 'transparent');
      aurora2.addColorStop(0.4, `hsla(320, 70%, 45%, ${0.3 + Math.sin(timeRef.current * 1.2 + 1) * 0.15})`);
      aurora2.addColorStop(1, 'transparent');
      ctx.fillStyle = aurora2;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.8);
      for (let x = 0; x <= w; x += 10) {
        const wave = Math.sin((x / w) * 3 + timeRef.current * 0.9 + 2) * 50
          + Math.sin((x / w) * 6 + timeRef.current * 1.3) * 25;
        ctx.lineTo(x, h * 0.45 + wave);
      }
      ctx.lineTo(w, h * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Draw pulses
      ctx.save();
      for (let i = pulsesRef.current.length - 1; i >= 0; i--) {
        const p = pulsesRef.current[i];
        p.radius += 2.5;
        p.opacity -= 0.006;
        if (p.opacity <= 0 || p.radius > p.maxRadius) {
          pulsesRef.current.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.opacity;
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, `hsla(${p.hue}, 70%, 55%, 0)`);
        grad.addColorStop(0.5, `hsla(${p.hue}, 70%, 55%, ${p.opacity * 0.3})`);
        grad.addColorStop(1, `hsla(${p.hue}, 70%, 55%, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Draw constellation connections
      ctx.save();
      const nodes = nodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const mouseDx = mx - (a.x + b.x) / 2;
          const mouseDy = my - (a.y + b.y) / 2;
          const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
          const mouseInfluence = mouseDist < 200 ? 1 - mouseDist / 200 : 0;

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.15 * (1 + mouseInfluence * 2);
            ctx.globalAlpha = Math.min(alpha + mouseInfluence * 0.15, 0.5);
            ctx.strokeStyle = `hsl(${260 + mouseInfluence * 40}, 70%, ${50 + mouseInfluence * 20}%)`;
            ctx.lineWidth = 0.5 + mouseInfluence;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      // Draw nodes
      ctx.save();
      for (const node of nodes) {
        node.pulsePhase += node.pulseSpeed;
        const pulse = (Math.sin(node.pulsePhase) + 1) / 2;
        const mouseDx = mx - node.x;
        const mouseDy = my - node.y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        const isNearMouse = mouseDist < 120;

        // Node glow
        const glowRadius = node.radius * (isNearMouse ? 6 : 3) * (1 + pulse * 0.5);
        const glowGrad = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, glowRadius
        );
        glowGrad.addColorStop(0, `hsla(270, 80%, 65%, ${(isNearMouse ? 0.4 : 0.2) * (1 + pulse * 0.3)})`);
        glowGrad.addColorStop(1, 'transparent');
        ctx.globalAlpha = 1;
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.globalAlpha = 0.8 + pulse * 0.2;
        ctx.fillStyle = isNearMouse ? '#c084fc' : '#8b5cf6';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (isNearMouse ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fill();

        // Spawn pulse when mouse is near
        if (isNearMouse && Math.random() < 0.02) {
          spawnPulse(node.x, node.y);
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0) node.x = w;
        if (node.x > w) node.x = 0;
        if (node.y < 0) node.y = h;
        if (node.y > h) node.y = 0;
      }
      ctx.restore();

      // Scanline overlay
      ctx.save();
      ctx.globalAlpha = 0.015;
      ctx.fillStyle = '#8b5cf6';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    resize();
    initNodes();
    rafRef.current = requestAnimationFrame(draw);

    window.addEventListener('resize', () => { resize(); initNodes(); });
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}
