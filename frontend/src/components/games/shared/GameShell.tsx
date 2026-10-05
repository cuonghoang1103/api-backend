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
import { Play, Pause, Maximize2, Minimize2, X, Volume2, VolumeX, Star } from 'lucide-react';
import type { GameProps } from '../registry';
import ScorePanel from './ScorePanel';
import { sfx, tatTieng, datTatTieng } from './amThanh';
import { phaoGiay } from './hieuUng';

/* 05/10/2026 (nâng cấp): thêm pha 'dem' (đếm ngược 3-2-1 có tiếng), ảnh bìa ở màn bắt đầu, nút
   bật/tắt tiếng, màn kết quả có 1–3 sao (theo scoreCap) + pháo giấy khi 3 sao hoặc kỷ lục phiên. */
type Phase = 'idle' | 'dem' | 'playing' | 'paused' | 'ended';

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
  cover,
  scoreCap,
}: {
  /** Ảnh bìa của game — hiện lớn ở màn bắt đầu. */
  cover?: string | null;
  /** Trần điểm (registry) — để chấm 1–3 sao ở màn kết quả. */
  scoreCap?: number;
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
  const [tat, setTat] = useState(false);
  const [demSo, setDemSo] = useState(3);
  const [kyLucMoi, setKyLucMoi] = useState(false);
  useEffect(() => {
    setTat(tatTieng());
    const h = (e: Event) => setTat(!!(e as CustomEvent<{ tat: boolean }>).detail?.tat);
    window.addEventListener('game:tieng', h);
    return () => window.removeEventListener('game:tieng', h);
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setKyLucMoi(false);
    setDemSo(3);
    setPhase('dem');
  }, []);
  // Đếm ngược 3-2-1 rồi mới dựng game (remount qua runKey ⇒ game tự reset).
  useEffect(() => {
    if (phase !== 'dem') return;
    if (demSo === 0) { sfx('batDau'); setRunKey((k) => k + 1); setPhase('playing'); return; }
    sfx('dem');
    const t = window.setTimeout(() => setDemSo((n) => n - 1), 620);
    return () => window.clearTimeout(t);
  }, [phase, demSo]);

  // The game reports its final score exactly once per run.
  const handleScore = useCallback((s: number, dur?: number) => {
    const safe = Number.isFinite(s) ? Math.max(0, Math.floor(s)) : 0;
    setScore(safe);
    setSessionBest((b) => { if (safe > 0 && safe > b && b > 0) setKyLucMoi(true); return Math.max(b, safe); });
    setPhase('ended');
    onEnd?.(safe, dur);
  }, [onEnd]);
  // Số sao theo tỉ lệ trần điểm (không có trần ⇒ có điểm là 1 sao).
  const sao = !scoreCap ? (score > 0 ? 1 : 0) : score >= scoreCap * 0.6 ? 3 : score >= scoreCap * 0.3 ? 2 : score > 0 ? 1 : 0;
  useEffect(() => {
    if (phase !== 'ended') return;
    if (sao === 0) { sfx('thua'); return; }
    sfx('thang');
    for (let i = 0; i < sao; i++) window.setTimeout(() => sfx('sao'), 420 + i * 260);
    if (sao === 3 || kyLucMoi) window.setTimeout(() => phaoGiay(containerRef.current), 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

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
  // Quyết định SAU khi gắn: đọc `document` lúc render làm HTML server (không có nút) lệch HTML
  // client (có nút) ⇒ React báo hydration failed và dựng lại cả cây (bắt được 05/10/2026).
  const [fsSupported, setFsSupported] = useState(false);
  useEffect(() => { setFsSupported(document.fullscreenEnabled ?? false); }, []);

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
      className="relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_90%_at_50%_0%,#1b1440_0%,#0b0a1a_55%,#07060f_100%)] shadow-[0_0_0_1px_rgba(139,92,246,0.14),0_30px_90px_-30px_rgba(139,92,246,0.6)]"
      style={{ minHeight: isFs ? '100vh' : 460 }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-darkborder bg-gradient-to-r from-darkcard/70 to-darkcard/30 px-3 py-2">
        <p className="text-xs font-semibold text-text-secondary truncate">{title}</p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => { datTatTieng(!tat); setTat(!tat); if (tat) sfx('bam'); }}
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
            aria-label={tat ? 'Bật tiếng' : 'Tắt tiếng'}
            title={tat ? 'Bật tiếng' : 'Tắt tiếng'}
          >
            {tat ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
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
          <div className="text-center max-w-md">
            {cover ? (
              <div className="relative mx-auto mb-5 w-[min(340px,80vw)] aspect-[16/9] [perspective:900px]">
                <div className="absolute -inset-6 rounded-[32px] bg-[radial-gradient(closest-side,rgba(139,92,246,0.45),transparent)] blur-xl" aria-hidden />
                <img src={cover} alt="" className="relative h-full w-full rounded-2xl object-cover ring-1 ring-white/15 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] transition-transform duration-700 [transform:rotateX(8deg)] hover:[transform:rotateX(0deg)_scale(1.02)]" />
              </div>
            ) : (
              <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-indigo/30 to-neon-violet/20 text-neon-violet shadow-[0_0_30px_-6px_rgba(139,92,246,0.6)]">
                <Play className="h-7 w-7" />
              </span>
            )}
            <h3 className="text-3xl font-heading font-extrabold text-text-primary tracking-tight">{title}</h3>
            {sessionBest > 0 && <p className="mt-1 text-xs font-semibold text-amber-300/90">🏆 {labels.best}: {sessionBest.toLocaleString()}</p>}
            {howTo && <p className="mt-2 text-xs text-text-muted leading-relaxed whitespace-pre-wrap">{howTo}</p>}
            <button
              onClick={start}
              className="relative mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-indigo-500 text-white text-base font-bold shadow-[0_14px_34px_-12px_rgba(168,85,247,0.9)] hover:brightness-110 active:scale-95 transition-all after:absolute after:inset-0 after:rounded-2xl after:ring-2 after:ring-fuchsia-400/50 after:animate-ping after:[animation-duration:2.2s]"
            >
              <Play className="w-5 h-5" fill="currentColor" /> {labels.start}
            </button>
          </div>
        )}

        {phase === 'dem' && (
          <div className="flex flex-col items-center justify-center gap-3" aria-live="assertive">
            <span key={demSo} className="text-[96px] font-black leading-none bg-gradient-to-b from-white to-violet-300 bg-clip-text text-transparent drop-shadow-[0_8px_30px_rgba(167,139,250,0.7)] animate-[ping_0.62s_cubic-bezier(0,0,0.2,1)_1_reverse]">
              {demSo || 'GO!'}
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-200/70">{title}</span>
          </div>
        )}

        {(phase === 'playing' || phase === 'paused') && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* The game stays mounted while paused so its state survives. */}
            {/* ⚠️ Vài game (DaySang/NBack/Schulte/Stroop…) còn dò class `pointer-events-none` để biết tạm dừng — giữ class này dù đã có prop `paused`. */}
            {/* `w-full` + căn giữa: game đo được bề rộng THẬT của khung (to ra khi toàn màn hình). */}
            <div key={runKey} className={`w-full flex justify-center ${phase === 'paused' ? 'pointer-events-none opacity-40' : ''}`}>
              {render({ onScore: handleScore, onExit: () => setPhase('idle'), locale, paused: phase === 'paused' })}
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

        {phase === 'ended' && scored && (
          <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-end gap-2" aria-label={`${sao}/3 sao`}>
            {[0, 1, 2].map((i) => (
              <Star
                key={i}
                className={`${i === 1 ? 'w-12 h-12 -translate-y-2' : 'w-9 h-9'} transition-all duration-500 ${i < sao ? 'text-amber-300 drop-shadow-[0_0_14px_rgba(252,211,77,0.85)] scale-100' : 'text-white/15 scale-90'}`}
                fill="currentColor"
                style={{ transitionDelay: `${420 + i * 260}ms` }}
              />
            ))}
            {kyLucMoi && <span className="ml-2 mb-1 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-2.5 py-0.5 text-[11px] font-black text-amber-950 shadow-[0_6px_16px_-6px_rgba(251,146,60,0.9)]">KỶ LỤC MỚI</span>}
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
