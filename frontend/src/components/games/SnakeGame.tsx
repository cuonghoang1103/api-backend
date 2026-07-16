'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { RotateCcw, Pause, Play } from 'lucide-react';
import type { GameProps } from './registry';

type Cell = 'empty' | 'snake' | 'food';
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const CELL_SIZE = 20;
const GRID_W = 20;
const GRID_H = 20;
const INITIAL_SPEED = 150;

function getEmptyGrid(): Cell[][] {
  return Array.from({ length: GRID_H }, () =>
    Array.from({ length: GRID_W }, () => 'empty')
  );
}

function getRandomFood(snake: [number, number][]): [number, number] {
  const occupied = new Set(snake.map(([r, c]) => `${r},${c}`));
  const free: [number, number][] = [];
  for (let r = 0; r < GRID_H; r++)
    for (let c = 0; c < GRID_W; c++)
      if (!occupied.has(`${r},${c}`)) free.push([r, c]);
  return free[Math.floor(Math.random() * free.length)];
}

const FOOD_COLORS = ['#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6'];

/**
 * Snake. Grid-based canvas, speed ramps with score, arrows/WASD + swipe.
 *
 * Contract: when GameShell mounts this it passes `onScore`; the component then
 * auto-starts (the shell already showed the start screen) and reports its score
 * once on game over instead of rendering its own start/game-over chrome. Props
 * are optional so the component still runs standalone.
 */
export default function SnakeGame({ onScore }: Partial<GameProps> = {}) {
  // In shell mode the shell owns start/end/replay; we only play and report.
  const inShell = typeof onScore === 'function';
  const startedAtRef = useRef<number>(0);
  const reportedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [foodColor, setFoodColor] = useState(FOOD_COLORS[0]);

  const snakeRef = useRef<[number, number][]>([[10, 10]]);
  const dirRef = useRef<Direction>('RIGHT');
  const nextDirRef = useRef<Direction>('RIGHT');
  const foodRef = useRef<[number, number]>([5, 5]);
  const speedRef = useRef(INITIAL_SPEED);
  const frameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const grid = getEmptyGrid();

    // Draw grid background
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 0.5;
    for (let r = 0; r <= GRID_H; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL_SIZE);
      ctx.lineTo(canvas.width, r * CELL_SIZE);
      ctx.stroke();
    }
    for (let c = 0; c <= GRID_W; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL_SIZE, 0);
      ctx.lineTo(c * CELL_SIZE, canvas.height);
      ctx.stroke();
    }

    const snake = snakeRef.current;
    // Draw snake body with gradient
    snake.forEach(([r, c], i) => {
      const isHead = i === 0;
      const alpha = isHead ? 1 : 0.85 - (i / snake.length) * 0.5;

      const x = c * CELL_SIZE;
      const y = r * CELL_SIZE;
      const pad = isHead ? 1 : 2;

      const gradient = ctx.createLinearGradient(x, y, x + CELL_SIZE, y + CELL_SIZE);
      gradient.addColorStop(0, `rgba(139,92,246,${alpha})`);
      gradient.addColorStop(1, `rgba(236,72,153,${alpha})`);
      ctx.fillStyle = gradient;

      ctx.beginPath();
      ctx.roundRect(x + pad, y + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2, isHead ? 4 : 3);
      ctx.fill();

      // Eyes on head
      if (isHead) {
        ctx.fillStyle = 'white';
        const dir = dirRef.current;
        const eyeOffsets = {
          RIGHT: [[4, 3], [4, 12]],
          LEFT: [[12, 3], [12, 12]],
          UP: [[3, 4], [12, 4]],
          DOWN: [[3, 12], [12, 12]],
        }[dir];
        eyeOffsets.forEach(([ey, ex]) => {
          ctx.beginPath();
          ctx.arc(x + ey, y + ex, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#0f0f1a';
          ctx.beginPath();
          ctx.arc(x + ey + (dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0), y + ex + (dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0), 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'white';
        });
      }
    });

    // Draw food
    const [fr, fc] = foodRef.current;
    const fx = fc * CELL_SIZE;
    const fy = fr * CELL_SIZE;
    ctx.shadowColor = foodColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = foodColor;
    ctx.beginPath();
    ctx.arc(fx + CELL_SIZE / 2, fy + CELL_SIZE / 2, CELL_SIZE / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [foodColor]);

  const step = useCallback(() => {
    const snake = snakeRef.current;
    dirRef.current = nextDirRef.current;
    const dir = dirRef.current;

    const head = [...snake[0]];
    switch (dir) {
      case 'UP': head[0]--; break;
      case 'DOWN': head[0]++; break;
      case 'LEFT': head[1]--; break;
      case 'RIGHT': head[1]++; break;
    }

    // Wall collision
    if (head[0] < 0 || head[0] >= GRID_H || head[1] < 0 || head[1] >= GRID_W) {
      setGameState('gameover');
      setHighScore((h) => Math.max(h, score));
      return;
    }

    // Self collision
    if (snake.some(([r, c]) => r === head[0] && c === head[1])) {
      setGameState('gameover');
      setHighScore((h) => Math.max(h, score));
      return;
    }

    snake.unshift(head as [number, number]);

    // Eat food
    if (head[0] === foodRef.current[0] && head[1] === foodRef.current[1]) {
      setScore((s) => s + 1);
      setFoodColor(FOOD_COLORS[Math.floor(Math.random() * FOOD_COLORS.length)]);
      foodRef.current = getRandomFood(snake);
      speedRef.current = Math.max(60, speedRef.current - 3);
    } else {
      snake.pop();
    }
  }, [score]);

  const gameLoop = useCallback((time: number) => {
    if (gameState !== 'playing') return;
    if (time - lastTimeRef.current >= speedRef.current) {
      step();
      lastTimeRef.current = time;
    }
    draw();
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, step, draw]);

  // Run game loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      return;
    }
    lastTimeRef.current = performance.now();
    frameRef.current = requestAnimationFrame(gameLoop);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [gameState, gameLoop]);

  // Always draw (for idle/gameover screens)
  useEffect(() => {
    if (gameState === 'idle' || gameState === 'gameover') draw();
  }, [gameState, draw]);

  const startGame = useCallback(() => {
    reportedRef.current = false;
    startedAtRef.current = performance.now();
    snakeRef.current = [[10, 10]];
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    foodRef.current = getRandomFood(snakeRef.current);
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setGameState('playing');
  }, []);

  // Shell mode: the shell already showed the start screen, so begin at once.
  useEffect(() => {
    if (inShell) startGame();
  }, [inShell, startGame]);

  // Report exactly once per run — the shell drives the end screen from this.
  useEffect(() => {
    if (!inShell || gameState !== 'gameover' || reportedRef.current) return;
    reportedRef.current = true;
    onScore!(score, Math.round((performance.now() - startedAtRef.current) / 1000));
  }, [inShell, gameState, score, onScore]);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (gameState === 'paused' || gameState === 'gameover') return;
    switch (e.key) {
      case 'ArrowUp': case 'w': case 'W':
        if (dirRef.current !== 'DOWN') nextDirRef.current = 'UP'; break;
      case 'ArrowDown': case 's': case 'S':
        if (dirRef.current !== 'UP') nextDirRef.current = 'DOWN'; break;
      case 'ArrowLeft': case 'a': case 'A':
        if (dirRef.current !== 'RIGHT') nextDirRef.current = 'LEFT'; break;
      case 'ArrowRight': case 'd': case 'D':
        if (dirRef.current !== 'LEFT') nextDirRef.current = 'RIGHT'; break;
      case 'p': case 'P':
        setGameState((s) => s === 'playing' ? 'paused' : 'playing'); break;
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const canvasW = GRID_W * CELL_SIZE;
  const canvasH = GRID_H * CELL_SIZE;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Score bar */}
      <div className="flex items-center gap-6 w-full max-w-[420px]">
        <div className="flex-1 bg-darkbg/80 border border-darkborder rounded-xl px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-text-muted">Score</span>
          <span className="font-heading font-bold text-xl text-neon-violet tabular-nums">{score}</span>
        </div>
        <div className="flex-1 bg-darkbg/80 border border-darkborder rounded-xl px-4 py-2 flex items-center justify-between">
          <span className="text-xs text-text-muted">Best</span>
          <span className="font-heading font-bold text-xl text-amber-400 tabular-nums">{highScore}</span>
        </div>
      </div>

      {/* Canvas wrapper */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={canvasW}
          height={canvasH}
          className="rounded-2xl border-2 border-darkborder shadow-[0_0_40px_rgba(139,92,246,0.15)]"
        />

        {/* Idle overlay */}
        {gameState === 'idle' && !inShell && (
          <div className="absolute inset-0 rounded-2xl bg-darkbg/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <h3 className="font-heading font-bold text-2xl text-text-primary">Snake Game</h3>
            <p className="text-sm text-text-muted text-center max-w-xs">
              Eat the food to grow. Avoid walls and your tail.
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-shadow"
            >
              Start Game
            </button>
          </div>
        )}

        {/* Paused overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 rounded-2xl bg-darkbg/85 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <h3 className="font-heading font-bold text-2xl text-text-primary">Paused</h3>
            <button
              onClick={() => setGameState('playing')}
              className="px-8 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-shadow"
            >
              Resume
            </button>
          </div>
        )}

        {/* Game over overlay */}
        {gameState === 'gameover' && !inShell && (
          <div className="absolute inset-0 rounded-2xl bg-darkbg/90 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <h3 className="font-heading font-bold text-2xl text-red-400">Game Over</h3>
            <p className="text-lg text-text-primary font-heading">
              Score: <span className="text-neon-violet">{score}</span>
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-neon-indigo to-neon-violet text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-shadow"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div className="flex items-center gap-3 text-xs text-text-muted">
        <span className="px-2 py-1 bg-darkbg border border-darkborder rounded">↑↓←→ / WASD</span>
        <span className="text-text-muted/50">to move</span>
        <span className="px-2 py-1 bg-darkbg border border-darkborder rounded">P</span>
        <span className="text-text-muted/50">to pause</span>
        <button
          onClick={startGame}
          className="flex items-center gap-1.5 ml-2 px-2 py-1 bg-darkbg border border-darkborder rounded hover:border-neon-violet/30 transition-colors"
          title="Restart"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
