'use client';

/**
 * Projectile Challenge — hit the target by choosing angle + power.
 *
 * Real projectile motion, integrated per frame in world units (metres), not
 * pixels:
 *     x(t) = v·cosθ·t                    (+ wind acceleration from level 5)
 *     y(t) = v·sinθ·t − ½·g·t²
 * The canvas only ever scales metres → pixels at draw time, so the physics is
 * identical on a phone and a 4K monitor — sizing the maths in pixels would make
 * the game literally easier on a bigger screen.
 *
 * Teaching curve, per the prompt: the dotted trajectory preview shows on levels
 * 1–2 only. After that you're reading the arc yourself, which is the point.
 *
 * Contract: reports the total score once all 10 levels are cleared or shots run
 * out.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Crosshair, Wind, Target as TargetIcon } from 'lucide-react';
import type { GameProps } from './registry';
import { useGameLoop } from './shared/useGameLoop';

const G = 9.81;
const LEVELS = 10;
const SHOTS_PER_LEVEL = 3;
const WIND_FROM_LEVEL = 5; // wind only once the player can already read an arc
const PREVIEW_LEVELS = 2;

const ORIGIN = { x: 6, y: 2 }; // launcher position, metres

interface Level { distance: number; targetR: number; wind: number; obstacle: { x: number; h: number } | null }

/** Deterministic per level: same challenge for everyone, no unfair RNG. */
function makeLevel(n: number): Level {
  const distance = 28 + n * 7;                    // 35 → 98 m
  const targetR = Math.max(1.4, 3.2 - n * 0.18);  // shrinks as you improve
  const wind = n >= WIND_FROM_LEVEL ? ((n % 2 === 0 ? 1 : -1) * (1.5 + (n - WIND_FROM_LEVEL) * 0.8)) : 0;
  const obstacle = n >= 3 ? { x: distance * 0.55, h: 6 + (n - 3) * 1.6 } : null;
  return { distance, targetR, wind, obstacle };
}

export default function ProjectileGame({ onScore }: Partial<GameProps> = {}) {
  const inShell = typeof onScore === 'function';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [levelIdx, setLevelIdx] = useState(0);
  const [angle, setAngle] = useState(45);
  const [power, setPower] = useState(28);
  const [shotsLeft, setShotsLeft] = useState(SHOTS_PER_LEVEL);
  const [score, setScore] = useState(0);
  const [flying, setFlying] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const level = makeLevel(levelIdx);
  const reportedRef = useRef(false);
  const startedAtRef = useRef(performance.now());

  // Live projectile state (refs — the loop mutates these every frame and must
  // not re-render React to do it).
  const ballRef = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const sizeRef = useRef({ w: 800, h: 380, scale: 8 });

  // Canvas sizing: devicePixelRatio-aware so it's crisp on retina, and the
  // world-to-pixel scale is derived from the level's distance so every level
  // fits the frame.
  const resize = useCallback(() => {
    const cvs = canvasRef.current, wrap = wrapRef.current;
    if (!cvs || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = wrap.clientWidth;
    const h = Math.max(260, Math.min(420, w * 0.5));
    cvs.width = w * dpr;
    cvs.height = h * dpr;
    cvs.style.width = `${w}px`;
    cvs.style.height = `${h}px`;
    const ctx = cvs.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sizeRef.current = { w, h, scale: w / (level.distance + 18) };
  }, [level.distance]);

  useEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [resize]);

  // ── Drawing ──────────────────────────────────────────────
  const draw = useCallback(() => {
    const cvs = canvasRef.current;
    const ctx = cvs?.getContext('2d');
    if (!cvs || !ctx) return;
    const { w, h, scale } = sizeRef.current;
    // metres → pixels (y flipped: canvas grows downward, the world upward)
    const px = (m: number) => m * scale;
    const X = (m: number) => px(m);
    const Y = (m: number) => h - px(m) - 24;

    ctx.clearRect(0, 0, w, h);

    // Sky + ground
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#0b0a1a');
    sky.addColorStop(1, '#12102a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1b1740';
    ctx.fillRect(0, Y(0), w, h - Y(0));
    ctx.strokeStyle = '#8b5cf655';
    ctx.beginPath(); ctx.moveTo(0, Y(0)); ctx.lineTo(w, Y(0)); ctx.stroke();

    // Obstacle
    if (level.obstacle) {
      ctx.fillStyle = '#f43f5e33';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      const ox = X(level.obstacle.x), ow = px(1.6), oh = px(level.obstacle.h);
      ctx.fillRect(ox - ow / 2, Y(level.obstacle.h), ow, oh);
      ctx.strokeRect(ox - ow / 2, Y(level.obstacle.h), ow, oh);
    }

    // Target
    const tx = X(level.distance), tr = px(level.targetR);
    ctx.beginPath(); ctx.arc(tx, Y(0) - tr * 0.15, tr, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e33'; ctx.fill();
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(tx, Y(0) - tr * 0.15, tr * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e'; ctx.fill();

    // Launcher
    const lx = X(ORIGIN.x), ly = Y(ORIGIN.y);
    const rad = (angle * Math.PI) / 180;
    ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(lx, ly);
    ctx.lineTo(lx + Math.cos(rad) * px(4), ly - Math.sin(rad) * px(4));
    ctx.stroke();
    ctx.beginPath(); ctx.arc(lx, ly, px(1.1), 0, Math.PI * 2);
    ctx.fillStyle = '#8b5cf6'; ctx.fill();

    // Dotted preview — levels 1–2 only (prompt), and only while aiming.
    if (levelIdx < PREVIEW_LEVELS && !flying) {
      ctx.fillStyle = '#a78bfa88';
      const vx0 = power * Math.cos(rad), vy0 = power * Math.sin(rad);
      for (let i = 1; i <= 26; i++) {
        const t = i * 0.09;
        const x = ORIGIN.x + vx0 * t + 0.5 * level.wind * t * t;
        const y = ORIGIN.y + vy0 * t - 0.5 * G * t * t;
        if (y < 0) break;
        ctx.beginPath(); ctx.arc(X(x), Y(y), 2, 0, Math.PI * 2); ctx.fill();
      }
    }

    // Trail + ball
    if (trailRef.current.length > 1) {
      ctx.strokeStyle = '#f9706688'; ctx.lineWidth = 2;
      ctx.beginPath();
      trailRef.current.forEach((p, i) => (i ? ctx.lineTo(X(p.x), Y(p.y)) : ctx.moveTo(X(p.x), Y(p.y))));
      ctx.stroke();
    }
    const b = ballRef.current;
    if (b) {
      ctx.beginPath(); ctx.arc(X(b.x), Y(b.y), Math.max(3, px(0.7)), 0, Math.PI * 2);
      ctx.fillStyle = '#f97316'; ctx.fill();
    }
  }, [angle, power, level, levelIdx, flying]);

  useEffect(() => { draw(); }, [draw]);

  // ── Physics ──────────────────────────────────────────────
  const endShot = useCallback((hit: boolean) => {
    setFlying(false);
    ballRef.current = null;

    if (hit) {
      // Fewer shots used → more points. Clearing early is worth real value.
      const bonus = shotsLeft * 60;
      setScore((s) => s + 300 + bonus + levelIdx * 40);
      setMsg('🎯 Hit!');
      if (levelIdx + 1 >= LEVELS) { setDone(true); return; }
      setTimeout(() => {
        setLevelIdx((i) => i + 1);
        setShotsLeft(SHOTS_PER_LEVEL);
        setMsg(null);
        trailRef.current = [];
      }, 700);
      return;
    }

    const left = shotsLeft - 1;
    setShotsLeft(left);
    if (left <= 0) {
      setMsg('Out of shots');
      if (levelIdx + 1 >= LEVELS) { setDone(true); return; }
      setTimeout(() => {
        setLevelIdx((i) => i + 1);
        setShotsLeft(SHOTS_PER_LEVEL);
        setMsg(null);
        trailRef.current = [];
      }, 800);
    } else {
      setMsg('Miss');
      setTimeout(() => setMsg(null), 600);
    }
  }, [shotsLeft, levelIdx]);

  useGameLoop(
    useCallback((dt: number) => {
      const b = ballRef.current;
      if (!b) return;
      // Semi-implicit Euler: stable at these speeds and dt is already clamped
      // by useGameLoop, so no tunnelling.
      b.vx += level.wind * dt;
      b.vy -= G * dt;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      trailRef.current.push({ x: b.x, y: b.y });
      if (trailRef.current.length > 200) trailRef.current.shift();

      // Obstacle
      if (level.obstacle && Math.abs(b.x - level.obstacle.x) < 0.8 && b.y <= level.obstacle.h) {
        endShot(false); return;
      }
      // Target — a generous vertical band so a shot landing ON the target counts
      if (Math.abs(b.x - level.distance) <= level.targetR && b.y <= level.targetR) {
        endShot(true); return;
      }
      // Ground / out of bounds
      if (b.y <= 0 || b.x > level.distance + 20) { endShot(false); return; }
      draw();
    }, [level, endShot, draw]),
    flying,
  );

  const fire = () => {
    if (flying || done || shotsLeft <= 0) return;
    const rad = (angle * Math.PI) / 180;
    ballRef.current = { x: ORIGIN.x, y: ORIGIN.y, vx: power * Math.cos(rad), vy: power * Math.sin(rad) };
    trailRef.current = [];
    setMsg(null);
    setFlying(true);
  };

  // Report once when the run resolves.
  useEffect(() => {
    if (!done || !inShell || reportedRef.current) return;
    reportedRef.current = true;
    onScore!(score, Math.round((performance.now() - startedAtRef.current) / 1000));
  }, [done, inShell, score, onScore]);

  // Arrow keys aim, space fires — parity with the sliders for keyboard players.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done) return;
      if (e.key === 'ArrowUp') { e.preventDefault(); setAngle((a) => Math.min(89, a + 1)); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setAngle((a) => Math.max(1, a - 1)); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); setPower((p) => Math.min(60, p + 1)); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); setPower((p) => Math.max(5, p - 1)); }
      else if (e.key === ' ') { e.preventDefault(); fire(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3 select-none">
      {/* HUD */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-muted">
          Level <span className="font-heading font-bold text-text-primary">{levelIdx + 1}</span>/{LEVELS}
        </span>
        <span className="text-text-muted inline-flex items-center gap-1">
          <TargetIcon className="w-3 h-3" /> {level.distance}m
          {level.wind !== 0 && (
            <span className={['ml-2 inline-flex items-center gap-1', level.wind > 0 ? 'text-neon-cyan' : 'text-neon-orange'].join(' ')}>
              <Wind className="w-3 h-3" />
              {level.wind > 0 ? '→' : '←'} {Math.abs(level.wind).toFixed(1)}
            </span>
          )}
        </span>
        <span className="text-text-muted">
          Score <span className="font-heading font-bold text-neon-violet tabular-nums">{score}</span>
        </span>
      </div>

      {/* Canvas */}
      <div ref={wrapRef} className="relative w-full rounded-xl overflow-hidden border border-darkborder">
        <canvas ref={canvasRef} className="block w-full" />
        {msg && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="px-4 py-2 rounded-xl bg-black/70 text-text-primary font-heading font-bold text-lg backdrop-blur-sm">
              {msg}
            </span>
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1" aria-label={`${shotsLeft} shots left`}>
          {Array.from({ length: SHOTS_PER_LEVEL }).map((_, i) => (
            <span key={i} className={['w-2 h-2 rounded-full', i < shotsLeft ? 'bg-neon-orange' : 'bg-white/15'].join(' ')} />
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <Slider label="Angle" value={angle} min={1} max={89} unit="°" onChange={setAngle} disabled={flying || done} />
        <Slider label="Power" value={power} min={5} max={60} unit="" onChange={setPower} disabled={flying || done} />
        <button
          onClick={fire}
          disabled={flying || done || shotsLeft <= 0}
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-neon-orange to-neon-red text-white text-sm font-bold shadow-neon active:scale-95 disabled:opacity-40 transition-transform inline-flex items-center justify-center gap-2"
        >
          <Crosshair className="w-4 h-4" /> Fire
        </button>
      </div>
      <p className="text-[11px] text-text-muted text-center">
        ↑↓ angle · ←→ power · Space to fire
        {levelIdx < PREVIEW_LEVELS && ' · trajectory preview fades after level 2'}
      </p>
    </div>
  );
}

function Slider({ label, value, min, max, unit, onChange, disabled }: {
  label: string; value: number; min: number; max: number; unit: string;
  onChange: (v: number) => void; disabled: boolean;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-[11px] text-text-muted mb-1">
        {label}
        <span className="font-heading font-bold text-text-primary tabular-nums">{value}{unit}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full accent-neon-violet disabled:opacity-40 cursor-pointer"
      />
    </label>
  );
}
