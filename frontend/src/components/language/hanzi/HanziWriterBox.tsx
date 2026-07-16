'use client';
/**
 * Han character writer — animate, trace, or quiz one character.
 *
 * hanzi-writer fetches each character's geometry itself. Its default loader
 * points at a public CDN, which our CSP refuses outright, so `charDataLoader`
 * is overridden to our own backend. Japanese and Chinese are different datasets
 * (気 vs 氣) and `lang` picks which.
 *
 * The library is loaded with a dynamic import inside an effect: it touches the
 * DOM on construction and would break SSR.
 */
import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import type { CharacterJson } from 'hanzi-writer';
import { api } from '@/lib/api';

export type WriterMode = 'animate' | 'trace' | 'quiz';

export interface HanziWriterHandle {
  animate: () => void;
  startQuiz: () => void;
  reset: () => void;
}

interface Props {
  char: string;
  lang?: 'ja' | 'zh';
  size?: number;
  mode: WriterMode;
  /** Show the character faintly underneath — the difference between tracing and
   *  writing from memory, which is the whole point of the last stage. */
  showOutline?: boolean;
  showGrid?: boolean;
  onQuizComplete?: (r: { mistakes: number }) => void;
  onStrokeWrong?: (strokeNum: number) => void;
  onReady?: (strokeCount: number) => void;
  onError?: (msg: string) => void;
}

// Data is immutable per character, so a character fetched once should never be
// fetched again — even across remounts of this component.
const dataCache = new Map<string, CharacterJson>();

/** Fetch one character's geometry from OUR backend. The library's default
 *  loader points at a CDN the CSP would refuse. */
async function loadChar(c: string, lang: 'ja' | 'zh', onError?: (m: string) => void): Promise<CharacterJson> {
  const key = `${lang}:${c}`;
  const hit = dataCache.get(key);
  if (hit) return hit;
  try {
    const r = await api.get(`/my-language/hanzi-stroke/${encodeURIComponent(c)}`, { params: { lang } });
    const data = r.data as CharacterJson;
    dataCache.set(key, data);
    return data;
  } catch (e) {
    onError?.(`Chưa có dữ liệu nét cho chữ "${c}".`);
    throw e;
  }
}

export const HanziWriterBox = forwardRef<HanziWriterHandle, Props>(function HanziWriterBox(
  { char, lang = 'ja', size = 260, mode, showOutline = true, showGrid = true, onQuizComplete, onStrokeWrong, onReady, onError },
  ref,
) {
  const holder = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writer = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  // Keep callbacks in refs: the writer is built once per char, and rebuilding it
  // whenever a parent re-renders would restart the animation mid-stroke.
  const cbs = useRef({ onQuizComplete, onStrokeWrong, onReady, onError });
  cbs.current = { onQuizComplete, onStrokeWrong, onReady, onError };

  useEffect(() => {
    let alive = true;
    let created: unknown = null;
    setLoading(true);

    (async () => {
      try {
        const mod = await import('hanzi-writer');
        const HanziWriter = mod.default;
        if (!alive || !holder.current) return;
        holder.current.innerHTML = '';

        const w = HanziWriter.create(holder.current, char, {
          width: size,
          height: size,
          padding: 8,
          showOutline,
          showCharacter: false,
          strokeAnimationSpeed: 1,
          delayBetweenStrokes: 180,
          strokeColor: '#a78bfa',
          radicalColor: '#22d3ee', // the radical in its own colour — it is the memory hook
          outlineColor: 'rgba(148,163,184,0.28)',
          drawingColor: '#22c55e',
          highlightColor: '#f59e0b',
          drawingWidth: 22,
          // Beginners' strokes are rough; the library's default is unforgiving
          // enough that a correct stroke often reads as wrong.
          leniency: 1.35,
          charDataLoader: (c: string) => loadChar(c, lang, cbs.current.onError),
        });
        if (!alive) return;
        created = w;
        writer.current = w;

        // strokeCount only exists once the data has actually landed.
        try {
          const data = await loadChar(char, lang);
          if (alive && data) cbs.current.onReady?.(data.strokes.length);
        } catch {
          /* the writer itself still works; only the stroke count is unknown */
        }

        if (alive) setLoading(false);
      } catch {
        if (alive) { setLoading(false); cbs.current.onError?.('Không tải được bộ vẽ chữ.'); }
      }
    })();

    return () => {
      alive = false;
      // The writer keeps SVG nodes and timers; dropping the ref alone leaks them.
      try { (created as { cancelQuiz?: () => void } | null)?.cancelQuiz?.(); } catch { /* not quizzing */ }
      writer.current = null;
    };
  }, [char, lang, size, showOutline]);

  const animate = useCallback(() => {
    writer.current?.animateCharacter?.();
  }, []);

  const startQuiz = useCallback(() => {
    const w = writer.current;
    if (!w) return;
    let mistakes = 0;
    try { w.cancelQuiz(); } catch { /* not quizzing yet */ }
    w.quiz({
      // Only nudge after the learner has genuinely tried — hinting on the first
      // slip turns writing from memory back into tracing.
      showHintAfterMisses: 3,
      onMistake: (s: { strokeNum: number }) => {
        mistakes++;
        cbs.current.onStrokeWrong?.(s.strokeNum);
      },
      onComplete: (r: { totalMistakes: number }) => {
        cbs.current.onQuizComplete?.({ mistakes: r?.totalMistakes ?? mistakes });
      },
    });
  }, []);

  const reset = useCallback(() => {
    const w = writer.current;
    if (!w) return;
    try { w.cancelQuiz(); } catch { /* not quizzing */ }
    w.hideCharacter();
  }, []);

  useImperativeHandle(ref, () => ({ animate, startQuiz, reset }), [animate, startQuiz, reset]);

  // Kick off whatever the mode implies, once the writer exists.
  useEffect(() => {
    if (loading) return;
    if (mode === 'animate') animate();
    if (mode === 'quiz' || mode === 'trace') startQuiz();
  }, [loading, mode, animate, startQuiz]);

  return (
    <div
      className="relative mx-auto rounded-2xl bg-[var(--bg-surface)] ring-1 ring-[var(--border-color)]"
      style={{ width: size, height: size }}
    >
      {showGrid && (
        // The 米 guide every Japanese practice sheet has — proportion is most of
        // what makes handwriting look right.
        <svg className="pointer-events-none absolute inset-0" width={size} height={size} aria-hidden>
          <rect x="0.5" y="0.5" width={size - 1} height={size - 1} fill="none" stroke="rgba(148,163,184,0.22)" />
          <line x1={size / 2} y1="0" x2={size / 2} y2={size} stroke="rgba(148,163,184,0.18)" strokeDasharray="5 5" />
          <line x1="0" y1={size / 2} x2={size} y2={size / 2} stroke="rgba(148,163,184,0.18)" strokeDasharray="5 5" />
          <line x1="0" y1="0" x2={size} y2={size} stroke="rgba(148,163,184,0.1)" strokeDasharray="4 6" />
          <line x1={size} y1="0" x2="0" y2={size} stroke="rgba(148,163,184,0.1)" strokeDasharray="4 6" />
        </svg>
      )}
      {/* touch-none stops the page scrolling under a finger mid-stroke */}
      <div ref={holder} className="absolute inset-0 touch-none" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-neon-violet border-t-transparent" />
        </div>
      )}
    </div>
  );
});
