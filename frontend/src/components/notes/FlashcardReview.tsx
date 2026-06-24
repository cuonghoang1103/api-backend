'use client';

// FlashcardReview — full-screen vocab review mode for one note.
// One card at a time. Tap (or press Space) to flip; mark known/unknown
// to advance. Persists outcomes via notesApi.gradeFlashcard.
//
// Design notes:
// • No external animation lib — CSS perspective + transform does the
//   3D flip cheaply and disables itself under prefers-reduced-motion.
// • State is local; progress survives a tab refresh because we re-load
//   the deck on mount and seed the index from the first un-reviewed
//   card so the user picks up where they left off (best-effort).
// • Reading aloud uses the browser SpeechSynthesis API (already wired
//   in VocabTable); we just expose a speaker button per face.
// • Mobile-friendly: large tap targets, swipe / arrow keys for nav.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, RotateCw, Check, X, Volume2, Loader2, GraduationCap, RefreshCcw,
} from 'lucide-react';
import { notesApi } from '@/lib/api';
import type { Flashcard, FlashcardDeck } from '@/types';

interface Props {
  noteId: number;
  onClose: () => void;
}

export default function FlashcardReview({ noteId, onClose }: Props) {
  const [deck, setDeck] = useState<FlashcardDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);

  // Load deck on mount / noteId change.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true); setError(null);
      try {
        const r = await notesApi.listFlashcards(noteId);
        if (cancelled) return;
        setDeck(r.data.data);
        // Resume on the first not-yet-known card so the user can
        // re-review what they haven't internalised yet.
        const firstUnreviewed = r.data.data.cards.findIndex(
          (c) => !c.isKnown && (c.reviewCount ?? 0) === 0,
        );
        setIndex(firstUnreviewed >= 0 ? firstUnreviewed : 0);
      } catch (e) {
        if (!cancelled) setError('Không tải được bộ thẻ.');
      } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [noteId]);

  const cards = deck?.cards ?? [];
  const current = cards[index];
  const total = cards.length;
  const done = deck ? deck.summary.known : 0;

  const speak = useCallback((text?: string | null) => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = guessLang(text);
      u.rate = 0.95;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch { /* ignore */ }
  }, []);

  // Keyboard: Space flip, ←/→ nav, 1 known, 2 unknown.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (loading || !current || busy) return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped((f) => !f); }
      else if (e.key === 'ArrowLeft') { goPrev(); }
      else if (e.key === 'ArrowRight') { goNext(); }
      else if (e.key === '1') { void grade(true); }
      else if (e.key === '2') { void grade(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, loading, busy, index]);

  const goNext = useCallback(() => {
    setFlipped(false);
    setIndex((i) => (total === 0 ? 0 : Math.min(total - 1, i + 1)));
  }, [total]);
  const goPrev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const grade = useCallback(async (known: boolean) => {
    if (!current || busy) return;
    setBusy(true);
    // Optimistic local update so the UI doesn't wait on the network.
    setDeck((d) => {
      if (!d) return d;
      const nextCards = d.cards.map((c, i) => i === index
        ? {
          ...c,
          isKnown: known,
          reviewCount: (c.reviewCount ?? 0) + 1,
          knownStreak: known ? Math.min(9999, (c.knownStreak ?? 0) + 1) : 0,
          lastReviewedAt: new Date().toISOString(),
        }
        : c,
      );
      const summary = {
        total: nextCards.length,
        known: nextCards.filter((c) => c.isKnown).length,
        reviewed: nextCards.filter((c) => (c.reviewCount ?? 0) > 0).length,
      };
      return { cards: nextCards, summary };
    });
    try {
      await notesApi.gradeFlashcard(current.id, known);
    } catch { /* will reconcile on next reload */ }
    setBusy(false);
    goNext();
  }, [current, busy, index, goNext]);

  const resetAll = useCallback(async () => {
    if (!deck || busy) return;
    if (typeof window !== 'undefined' && !window.confirm('Đặt lại toàn bộ thẻ về "chưa thuộc"?')) return;
    setBusy(true);
    try {
      await Promise.all(deck.cards.map((c) => notesApi.resetFlashcard(c.id).catch(() => null)));
      // Reload to reflect server truth.
      const r = await notesApi.listFlashcards(noteId);
      setDeck(r.data.data);
      setIndex(0);
      setFlipped(false);
    } finally { setBusy(false); }
  }, [deck, busy, noteId]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang tải bộ thẻ…
      </div>
    );
  }
  if (error) {
    return <div className="p-6 text-sm text-rose-400">{error}</div>;
  }
  if (!deck || total === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <GraduationCap className="h-8 w-8 text-slate-500" />
        <p className="text-sm text-slate-400">Chưa có từ vựng nào trong ghi chú này.</p>
        <button onClick={onClose} className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/5">Đóng</button>
      </div>
    );
  }

  const progressPct = Math.round(((index + 1) / total) * 100);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <GraduationCap className="h-4 w-4 text-teal-400" />
          <span className="font-semibold">Ôn tập thẻ</span>
          <span className="text-xs text-slate-500">· {done}/{total} đã thuộc</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={resetAll}
            disabled={busy}
            className="flex h-9 items-center gap-1 rounded-lg px-2 text-xs text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 disabled:opacity-50"
            aria-label="Đặt lại toàn bộ"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Đặt lại
          </button>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.05]"
            aria-label="Đóng"
          >×</button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1 w-full bg-white/[0.04]">
        <div className="h-full bg-teal-500/70 transition-all" style={{ width: `${progressPct}%` }} />
      </div>

      {/* Card area */}
      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div
          className={`flashcard ${flipped ? 'flashcard--flipped' : ''}`}
          onClick={() => setFlipped((f) => !f)}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={flipped ? 'Mặt sau' : 'Mặt trước — nhấn để lật'}
        >
          <div className="flashcard__inner">
            {/* Front */}
            <div className="flashcard__face flashcard__face--front">
              <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Mặt trước</div>
              <div className="mt-3 text-3xl font-semibold leading-tight text-slate-100 sm:text-4xl">
                {current.term}
              </div>
              {current.reading && (
                <button
                  onClick={(e) => { e.stopPropagation(); speak(current.term); }}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/5"
                  aria-label="Phát âm"
                >
                  <Volume2 className="h-3.5 w-3.5" /> {current.reading}
                </button>
              )}
              <div className="mt-auto text-xs text-slate-500">Nhấn để lật · phím cách</div>
            </div>
            {/* Back */}
            <div className="flashcard__face flashcard__face--back">
              <div className="text-[11px] uppercase tracking-[0.18em] text-teal-300">Mặt sau</div>
              <div className="mt-3 text-2xl font-semibold text-slate-100 sm:text-3xl">
                {current.meaning || <span className="italic text-slate-500">(chưa có nghĩa)</span>}
              </div>
              {current.reading && (
                <div className="mt-2 text-sm text-slate-400">{current.reading}</div>
              )}
              {current.example && (
                <div className="mt-3 max-w-md rounded-lg border border-white/10 bg-white/[0.03] p-3 text-left text-sm italic text-slate-300">
                  {current.example}
                </div>
              )}
              <div className="mt-auto text-xs text-slate-500">Đánh dấu bên dưới · phím 1 / 2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <footer className="border-t border-white/[0.06] px-4 py-3">
        <div className="mx-auto flex max-w-md items-center justify-between gap-2">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-40"
            aria-label="Thẻ trước"
          ><ArrowLeft className="h-5 w-5" /></button>

          <button
            onClick={() => setFlipped((f) => !f)}
            className="flex h-11 items-center gap-2 rounded-lg border border-white/10 px-4 text-sm text-slate-200 hover:bg-white/5"
            aria-label="Lật thẻ"
          >
            <RotateCw className="h-4 w-4" /> Lật
          </button>

          <button
            onClick={() => void grade(false)}
            disabled={busy}
            className="flex h-11 items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 text-sm text-rose-200 hover:bg-rose-500/20 disabled:opacity-50"
            aria-label="Chưa thuộc"
          >
            <X className="h-4 w-4" /> Chưa thuộc
          </button>

          <button
            onClick={() => void grade(true)}
            disabled={busy}
            className="flex h-11 items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 text-sm text-teal-200 hover:bg-teal-500/20 disabled:opacity-50"
            aria-label="Đã thuộc"
          >
            <Check className="h-4 w-4" /> Đã thuộc
          </button>

          <button
            onClick={goNext}
            disabled={index >= total - 1}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-40"
            aria-label="Thẻ tiếp"
          ><ArrowRight className="h-5 w-5" /></button>
        </div>
        <p className="mt-2 text-center text-[11px] text-slate-500">
          {index + 1} / {total} · đã thuộc {done}
        </p>
      </footer>
    </div>
  );
}

// Crude language guess from script: CJK → ja (best effort), Latin → en,
// Cyrillic → ru, else unset so the browser picks.
function guessLang(text: string): string {
  if (/[\u3040-\u30ff\u4e00-\u9fff]/.test(text)) return 'ja-JP';
  if (/[\u0400-\u04ff]/.test(text)) return 'ru-RU';
  if (/[\u0e00-\u0e7f]/.test(text)) return 'th-TH';
  return 'en-US';
}
