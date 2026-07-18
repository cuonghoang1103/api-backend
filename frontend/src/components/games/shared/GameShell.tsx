'use client';

/**
 * GameShell — the chrome every registered game plays inside.
 *
 * State machine: idle → playing ⇄ paused → ended → (replay) idle/playing.
 *
 * Contract split, deliberately:
 *   - The GAME only plays and calls `onScore(score, durationSec)` once when a
 *     run ends. It knows nothing about the network, leaderboards or the DB.
 *   - The SHELL owns start/pause/end chrome and remounts the game on replay
 *     (via `runKey`) so games don't need their own reset logic.
 *   - The PAGE owns score submission and the leaderboard, passed in as `extra`.
 *
 * Pausing on Escape and on tab blur is handled here so no game has to
 * reimplement it.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, Maximize2, Minimize2, X } from 'lucide-react';
import type { GameProps } from '../registry';
import ScorePanel from './ScorePanel';

type Phase = 'idle' | 'playing' | 'paused' | 'ended';

export interface GameShellLabels {
  start: string;
  howToPlay: string;
  paused: string;
  resume: string;
  yourScore: string;
  best: string;
  replay: string;
  fullscreen: string;
  exit: string;
}

export default function GameShell({
  title,
  howTo,
  locale,
  scored,
  render,
  onEnd,
  extra,
  labels,
}: {
  title: string;
  howTo?: string | null;
  locale: 'vi' | 'en';
  scored: boolean;
  /** Renders the actual game with the shell-provided GameProps. */
  render: (props: GameProps) => React.ReactNode;
  /** Fired once per run when the game reports its score. */
  onEnd?: (score: number, durationSec?: number) => void;
  /** Slot for the page's leaderboard / submission feedback on the end screen. */
  extra?: React.ReactNode;
  labels: GameShellLabels;
}) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [runKey, setRunKey] = useState(0);
  const [score, setScore] = useState(0);
  const [sessionBest, setSessionBest] = useState(0);
  const [isFs, setIsFs] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const start = useCallback(() => {
    setScore(0);
    setRunKey((k) => k + 1); // remount → the game resets itself
    setPhase('playing');
  }, []);

  // The game reports its final score exactly once per run.
  const handleScore = useCallback((s: number, dur?: number) => {
    const safe = Number.isFinite(s) ? Math.max(0, Math.floor(s)) : 0;
    setScore(safe);
    setSessionBest((b) => Math.max(b, safe));
    setPhase('ended');
    onEnd?.(safe, dur);
  }, [onEnd]);

  // Escape toggles pause; tab blur always pauses (never un-pauses — the player
  // should decide when to resume).
  useEffect(() => {
    if (phase !== 'playing' && phase !== 'paused') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setPhase((p) => (p === 'playing' ? 'paused' : p === 'paused' ? 'playing' : p));
      }
    };
    const onHide = () => { if (document.hidden) setPhase((p) => (p === 'playing' ? 'paused' : p)); };
    window.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [phase]);

  // Fullscreen with graceful fallback: if the API is unavailable or rejects
  // (iOS Safari on non-video elements), the button just doesn't render.
  const fsSupported = typeof document !== 'undefined'
    && (document.fullscreenEnabled ?? false);

  useEffect(() => {
    const onFs = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const toggleFs = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (containerRef.current) await containerRef.current.requestFullscreen();
    } catch {
      /* fullscreen refused — stay inline, nothing breaks */
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-darkborder bg-[#0a0a14] shadow-[0_0_0_1px_rgba(139,92,246,0.10),0_28px_80px_-32px_rgba(139,92,246,0.55)]"
      style={{ minHeight: 420 }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-darkborder bg-gradient-to-r from-darkcard/70 to-darkcard/30 px-3 py-2">
        <p className="text-xs font-semibold text-text-secondary truncate">{title}</p>
        <div className="flex items-center gap-1">
          {(phase === 'playing' || phase === 'paused') && (
            <button
              onClick={() => setPhase((p) => (p === 'playing' ? 'paused' : 'playing'))}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
              aria-label={phase === 'playing' ? labels.paused : labels.resume}
            >
              {phase === 'playing' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          )}
          {fsSupported && (
            <button
              onClick={toggleFs}
              className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
              aria-label={labels.fullscreen}
              title={labels.fullscreen}
            >
              {isFs ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
          {/* Exit — stop the current run and return to the idle screen (from
              there the page's breadcrumb leaves the game). Only while playing. */}
          {(phase === 'playing' || phase === 'paused') && (
            <button
              onClick={() => { if (isFs) document.exitFullscreen().catch(() => {}); setPhase('idle'); }}
              className="p-1.5 rounded-lg text-text-muted transition-colors hover:bg-white/[0.06] hover:text-neon-red"
              aria-label={labels.exit}
              title={labels.exit}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Stage */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        {phase === 'idle' && (
          <div className="text-center max-w-sm">
            <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-indigo/30 to-neon-violet/20 text-neon-violet shadow-[0_0_30px_-6px_rgba(139,92,246,0.6)]">
              <Play className="h-7 w-7" />
            </span>
            <h3 className="text-2xl font-heading font-bold text-text-primary">{title}</h3>
            {howTo && <p className="mt-2 text-xs text-text-muted leading-relaxed whitespace-pre-wrap">{howTo}</p>}
            <button
              onClick={start}
              className="mt-5 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold shadow-neon hover:opacity-90 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4" /> {labels.start}
            </button>
          </div>
        )}

        {(phase === 'playing' || phase === 'paused') && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* The game stays mounted while paused so its state survives. */}
            <div key={runKey} className={phase === 'paused' ? 'pointer-events-none opacity-40' : ''}>
              {render({ onScore: handleScore, onExit: () => setPhase('idle'), locale })}
            </div>
            {phase === 'paused' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                <p className="text-sm font-semibold text-text-primary">{labels.paused}</p>
                <button
                  onClick={() => setPhase('playing')}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-violet/20 text-neon-violet text-xs font-semibold hover:bg-neon-violet/30"
                >
                  <Play className="w-3.5 h-3.5" /> {labels.resume}
                </button>
              </div>
            )}
          </div>
        )}

        {phase === 'ended' && (
          <ScorePanel
            score={score}
            sessionBest={sessionBest}
            scored={scored}
            onReplay={start}
            labels={{ yourScore: labels.yourScore, best: labels.best, replay: labels.replay }}
            extra={extra}
          />
        )}
      </div>
    </div>
  );
}
