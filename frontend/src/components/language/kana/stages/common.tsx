'use client';
/**
 * Shared building blocks for the 9 kana stages: the answer/next banner and
 * the choice-option button. Kept theme-token only (never `dark:`).
 */
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';

export type OptionState = 'idle' | 'correct' | 'wrong' | 'muted';

const OPTION_CLS: Record<OptionState, string> = {
  idle: 'border-[var(--border-color)] bg-[var(--bg-surface)] text-text-primary hover:border-neon-violet/50 hover:text-neon-violet',
  correct: 'border-neon-green/60 bg-neon-green/15 text-neon-green',
  wrong: 'border-neon-red/60 bg-neon-red/15 text-neon-red',
  muted: 'border-[var(--border-color)] bg-[var(--bg-surface)] text-text-muted opacity-60',
};

export function OptionButton({
  children,
  state,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode;
  state: OptionState;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex min-h-[3.25rem] items-center justify-center rounded-xl border px-4 py-3 text-lg font-semibold transition disabled:cursor-default ${OPTION_CLS[state]} ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * Feedback banner shown after an answer is committed. Autofocuses its
 * "Tiếp theo" button so Enter advances without a global key listener.
 */
export function AnswerBar({
  status,
  solution,
  onNext,
  reduced,
}: {
  status: 'correct' | 'wrong';
  /** Correct answer to reveal (shown for wrong answers, optional otherwise). */
  solution?: string;
  onNext: () => void;
  reduced: boolean;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  const correct = status === 'correct';
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 ${
        correct
          ? 'border-neon-green/40 bg-neon-green/10'
          : 'border-neon-red/40 bg-neon-red/10'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            correct ? 'bg-neon-green/20 text-neon-green' : 'bg-neon-red/20 text-neon-red'
          }`}
        >
          {correct ? <Check size={18} /> : <X size={18} />}
        </span>
        <div className="leading-tight">
          <p className={`text-sm font-semibold ${correct ? 'text-neon-green' : 'text-neon-red'}`}>
            {correct ? 'Chính xác!' : 'Chưa đúng'}
          </p>
          {!correct && solution && (
            <p className="text-sm text-text-secondary">
              Đáp án: <span className="font-semibold text-text-primary">{solution}</span>
            </p>
          )}
        </div>
      </div>
      <button
        ref={btnRef}
        type="button"
        onClick={onNext}
        className="inline-flex items-center gap-1.5 rounded-xl bg-neon-violet px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-violet/50"
      >
        Tiếp theo
        <ArrowRight size={16} />
      </button>
    </motion.div>
  );
}

/** Big kana / romaji prompt tile shared by the display-heavy stages. */
export function PromptTile({
  children,
  hint,
  big = true,
}: {
  children: React.ReactNode;
  hint?: string;
  big?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-8 text-center">
      <div
        className={`font-heading font-bold leading-none text-text-primary ${
          big ? 'text-6xl sm:text-7xl' : 'text-3xl sm:text-4xl tracking-wide'
        }`}
      >
        {children}
      </div>
      {hint && <p className="mt-3 text-sm text-text-muted">{hint}</p>}
    </div>
  );
}
