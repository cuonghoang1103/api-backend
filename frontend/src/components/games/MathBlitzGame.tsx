'use client';

/**
 * Math Blitz — a 60-second mental-math sprint.
 *
 * Difficulty ramps with the number of questions answered, not with the clock:
 * a player who answers fast earns harder (higher-scoring) questions, so speed
 * is rewarded twice over. Consecutive correct answers build a streak
 * multiplier; one wrong answer resets it, which is what makes the last ten
 * seconds tense.
 *
 * Contract: reports its score once when the timer hits zero.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Delete, Check } from 'lucide-react';
import type { GameProps } from './registry';

const DURATION = 60;

type Op = '+' | '-' | '×' | '÷';
interface Question { a: number; b: number; op: Op; answer: number }

const rnd = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Question generator. `tier` grows every 5 answers.
 *   0-1: single-digit + / -
 *   2-3: two-digit + / -, small ×
 *   4+ : bigger ×, exact ÷ (built from its own product so it never gives a
 *        fraction — nothing kills a mental-math sprint like 7 ÷ 3)
 */
function makeQuestion(tier: number): Question {
  const pool: Op[] =
    tier <= 1 ? ['+', '-']
    : tier <= 3 ? ['+', '-', '×']
    : ['+', '-', '×', '÷'];
  const op = pool[rnd(0, pool.length - 1)];

  if (op === '+') {
    const hi = tier <= 1 ? 9 : tier <= 3 ? 49 : 99;
    const a = rnd(2, hi), b = rnd(2, hi);
    return { a, b, op, answer: a + b };
  }
  if (op === '-') {
    const hi = tier <= 1 ? 9 : tier <= 3 ? 49 : 99;
    const a = rnd(3, hi), b = rnd(2, a); // keep the answer non-negative
    return { a, b, op, answer: a - b };
  }
  if (op === '×') {
    const hi = tier <= 3 ? 9 : 12;
    const a = rnd(2, hi), b = rnd(2, hi);
    return { a, b, op, answer: a * b };
  }
  // ÷ — derive from a product so the division is always exact.
  const b = rnd(2, 9);
  const answer = rnd(2, 12);
  return { a: b * answer, b, op, answer };
}

/** 3 correct in a row → ×2, 6 → ×3, 10+ → ×4. */
function multiplierFor(streak: number): number {
  if (streak >= 10) return 4;
  if (streak >= 6) return 3;
  if (streak >= 3) return 2;
  return 1;
}

export default function MathBlitzGame({ onScore }: Partial<GameProps> = {}) {
  const inShell = typeof onScore === 'function';

  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [q, setQ] = useState<Question>(() => makeQuestion(0));
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null);
  const [done, setDone] = useState(false);

  const reportedRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Countdown. setInterval is fine here — a 1s tick doesn't need rAF, and the
  // score is committed at zero regardless of tab visibility.
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(id); setDone(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [done]);

  // Report exactly once when the run ends.
  useEffect(() => {
    if (!done || !inShell || reportedRef.current) return;
    reportedRef.current = true;
    onScore!(score, DURATION);
  }, [done, inShell, score, onScore]);

  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);

  const showFlash = (kind: 'ok' | 'bad') => {
    setFlash(kind);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 220);
  };

  const submit = useCallback(() => {
    if (done || input === '') return;
    const val = Number(input);
    const correct = val === q.answer;

    if (correct) {
      const nextStreak = streak + 1;
      // Harder questions pay more; the streak multiplier stacks on top.
      const base = 10 + Math.min(4, Math.floor(answered / 5)) * 5;
      setScore((s) => s + base * multiplierFor(nextStreak));
      setStreak(nextStreak);
      showFlash('ok');
    } else {
      setStreak(0); // one mistake wipes the multiplier
      showFlash('bad');
    }

    const nextAnswered = answered + 1;
    setAnswered(nextAnswered);
    setQ(makeQuestion(Math.floor(nextAnswered / 5)));
    setInput('');
  }, [done, input, q.answer, streak, answered]);

  const press = (key: string) => {
    if (done) return;
    if (key === 'del') setInput((v) => v.slice(0, -1));
    else if (key === 'ok') submit();
    else if (input.length < 5) setInput((v) => v + key);
  };

  const mult = multiplierFor(streak);
  const urgent = timeLeft <= 10;

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4 select-none">
      {/* HUD */}
      <div className="w-full flex items-center justify-between text-xs">
        <span className="text-text-muted">
          Score <span className="ml-1 font-heading font-bold text-base text-neon-violet tabular-nums">{score}</span>
        </span>
        {mult > 1 && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-neon-orange/15 text-neon-orange border border-neon-orange/30">
            ×{mult} streak {streak}
          </span>
        )}
        <span className={['font-heading font-bold text-base tabular-nums', urgent ? 'text-neon-red animate-pulse motion-reduce:animate-none' : 'text-text-secondary'].join(' ')}>
          {timeLeft}s
        </span>
      </div>

      {/* Timer bar */}
      <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden" role="progressbar" aria-valuenow={timeLeft} aria-valuemin={0} aria-valuemax={DURATION}>
        <div
          className={['h-full transition-[width] duration-1000 ease-linear', urgent ? 'bg-neon-red' : 'bg-gradient-to-r from-neon-indigo to-neon-violet'].join(' ')}
          style={{ width: `${(timeLeft / DURATION) * 100}%` }}
        />
      </div>

      {/* Question — deliberately huge; this is the whole game's focal point. */}
      <div
        className={[
          'w-full rounded-2xl border py-8 text-center transition-colors duration-200',
          flash === 'ok' ? 'border-neon-emerald/60 bg-neon-emerald/10'
            : flash === 'bad' ? 'border-neon-red/60 bg-neon-red/10'
            : 'border-darkborder bg-black/30',
        ].join(' ')}
        aria-live="polite"
      >
        <p className="font-heading font-bold text-4xl sm:text-5xl text-text-primary tabular-nums tracking-tight">
          {q.a} {q.op} {q.b}
        </p>
        <p className="mt-3 font-heading font-bold text-3xl sm:text-4xl text-neon-violet tabular-nums min-h-[1.2em]">
          {input || <span className="text-text-muted/40">?</span>}
        </p>
      </div>

      {/* Desktop: type + Enter. Hidden on touch, where the pad below is better. */}
      <input
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value.replace(/[^0-9-]/g, '').slice(0, 5))}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
        inputMode="none"
        autoFocus
        disabled={done}
        aria-label="Answer"
        className="sr-only sm:not-sr-only sm:w-full sm:px-4 sm:py-2.5 sm:bg-darkcard sm:border sm:border-darkborder sm:rounded-xl sm:text-center sm:text-lg sm:text-text-primary sm:focus:outline-none sm:focus:border-neon-violet/50"
        placeholder="Type the answer, press Enter"
      />

      {/* Number pad — the only sane input on a phone. */}
      <div className="grid grid-cols-3 gap-2 w-full sm:hidden">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'].map((k) => (
          <button
            key={k}
            onClick={() => press(k)}
            disabled={done}
            aria-label={k === 'del' ? 'Delete' : k === 'ok' ? 'Submit' : k}
            className={[
              'h-14 rounded-xl font-heading font-bold text-xl active:scale-95 transition-transform disabled:opacity-40',
              k === 'ok' ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white'
                : k === 'del' ? 'bg-white/[0.04] text-text-muted border border-darkborder'
                : 'bg-darkcard text-text-primary border border-darkborder',
            ].join(' ')}
          >
            {k === 'del' ? <Delete className="w-5 h-5 mx-auto" /> : k === 'ok' ? <Check className="w-5 h-5 mx-auto" /> : k}
          </button>
        ))}
      </div>

      <p className="text-[11px] text-text-muted hidden sm:block">
        {answered} answered · 3 in a row = ×2, 6 = ×3, 10 = ×4
      </p>
    </div>
  );
}
