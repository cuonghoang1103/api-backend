'use client';
/**
 * Stages 8–9: Stroke-order tracing and Draw-from-memory.
 * We have no stroke-path data, so stage 8 is honest tracing practice over a
 * faint kana guide, and stage 9 is a self-graded recall drawing.
 */
import React, { useRef, useState } from 'react';
import { Eraser, Eye, EyeOff, ArrowRight, Check, X, Volume2 } from 'lucide-react';
import { speakVocabEntry } from '@/lib/notesTts';
import type { StageProps } from '../types';
import { DrawingCanvas, type DrawingCanvasHandle } from '../DrawingCanvas';
import { AnswerBar } from './common';

function CanvasFrame({
  children,
  canvasRef,
}: {
  children?: React.ReactNode;
  canvasRef: React.Ref<DrawingCanvasHandle>;
}) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      {children}
      <DrawingCanvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}

function GuideKana({ kana, visible }: { kana: string; visible: boolean }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 flex select-none items-center justify-center transition-opacity duration-200"
      style={{ opacity: visible ? 0.16 : 0 }}
    >
      <span className="font-heading text-[11rem] font-bold leading-none text-text-primary sm:text-[13rem]">
        {kana}
      </span>
    </div>
  );
}

const TOOL_BTN =
  'inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3.5 py-2 text-sm font-medium text-text-secondary transition hover:text-text-primary';

// ─── Stage 8: Stroke order (tracing) ─────────────────────────────
export function StrokeOrderStage({ target, onResult, onNext }: StageProps) {
  const canvasRef = useRef<DrawingCanvasHandle | null>(null);
  const [guide, setGuide] = useState(true);

  return (
    <div>
      <p className="mb-3 text-center text-sm text-text-muted">
        Tô theo nét mẫu để luyện tay viết{' '}
        <span className="font-semibold text-text-secondary">{target.romaji}</span> — bài luyện, không chấm điểm
      </p>
      <CanvasFrame canvasRef={canvasRef}>
        <GuideKana kana={target.kana} visible={guide} />
      </CanvasFrame>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        <button type="button" className={TOOL_BTN} onClick={() => canvasRef.current?.clear()}>
          <Eraser size={16} /> Xoá
        </button>
        <button type="button" className={TOOL_BTN} onClick={() => setGuide((g) => !g)}>
          {guide ? <EyeOff size={16} /> : <Eye size={16} />} {guide ? 'Ẩn mẫu' : 'Hiện mẫu'}
        </button>
        <button
          type="button"
          onClick={() => {
            onResult(true);
            onNext();
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-neon-violet px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Tiếp <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─── Stage 9: Draw kana (from memory) ────────────────────────────
export function DrawKanaStage({ target, onResult, onNext, reduced }: StageProps) {
  const canvasRef = useRef<DrawingCanvasHandle | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [graded, setGraded] = useState<'correct' | 'wrong' | null>(null);

  const grade = (ok: boolean) => {
    if (graded !== null) return;
    setGraded(ok ? 'correct' : 'wrong');
    onResult(ok);
  };

  const speak = () => void speakVocabEntry({ term: target.kana }, { forceLang: 'ja-JP', rate: 0.7 });

  return (
    <div>
      <div className="mb-3 flex items-center justify-center gap-2 text-center">
        <p className="text-sm text-text-muted">
          Vẽ kana đọc là{' '}
          <span className="font-heading text-lg font-bold text-text-primary">{target.romaji}</span>
        </p>
        <button
          type="button"
          onClick={speak}
          aria-label="Phát âm"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-neon-violet transition hover:bg-neon-violet/15"
        >
          <Volume2 size={16} />
        </button>
      </div>
      <CanvasFrame canvasRef={canvasRef}>
        <GuideKana kana={target.kana} visible={revealed} />
      </CanvasFrame>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        <button type="button" className={TOOL_BTN} onClick={() => canvasRef.current?.clear()}>
          <Eraser size={16} /> Xoá
        </button>
        <button type="button" className={TOOL_BTN} onClick={() => setRevealed((r) => !r)}>
          {revealed ? <EyeOff size={16} /> : <Eye size={16} />} {revealed ? 'Ẩn đáp án' : 'Hiện đáp án'}
        </button>
      </div>

      {graded === null ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => grade(false)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neon-red/50 bg-neon-red/10 px-4 py-2.5 text-sm font-semibold text-neon-red transition hover:bg-neon-red/20"
          >
            <X size={16} /> Sai
          </button>
          <button
            type="button"
            onClick={() => grade(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-neon-green/50 bg-neon-green/10 px-4 py-2.5 text-sm font-semibold text-neon-green transition hover:bg-neon-green/20"
          >
            <Check size={16} /> Đúng
          </button>
        </div>
      ) : (
        <AnswerBar status={graded} solution={`${target.kana} = ${target.romaji}`} onNext={onNext} reduced={reduced} />
      )}
    </div>
  );
}
