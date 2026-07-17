'use client';

// ReactionBar — GitHub-style emoji reactions, reused for both snippets and
// comments. Shows the active reactions (emoji + count, highlighted when the
// viewer reacted) plus a "+" picker to add any palette emoji. Presentational:
// the parent's `onToggle(emoji)` performs the API call + state update.

import { useState, useRef, useEffect } from 'react';
import { SmilePlus } from 'lucide-react';
import type { ReactionSummary } from '@/types/exp-hub';

export const REACTION_PALETTE = ['👍', '❤️', '😄', '🎉', '🚀', '👀'];

export function ReactionBar({
  reactions,
  onToggle,
  disabled = false,
  compact = false,
}: {
  reactions: ReactionSummary[];
  onToggle: (emoji: string) => void;
  disabled?: boolean;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the picker when clicking outside.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const chip = compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-sm';

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {reactions.map((r) => (
        <button
          key={r.emoji}
          type="button"
          onClick={() => onToggle(r.emoji)}
          className={`inline-flex items-center gap-1 rounded-full border transition-colors ${chip} ${
            r.mine
              ? 'border-violet-400/60 bg-violet-500/15 text-violet-600 dark:text-violet-200'
              : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
          title={r.mine ? 'Bỏ cảm xúc' : 'Thêm cảm xúc'}
        >
          <span className="leading-none">{r.emoji}</span>
          <span className="tabular-nums">{r.count}</span>
        </button>
      ))}

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className={`inline-flex items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] ${compact ? 'h-6 w-6' : 'h-7 w-7'}`}
          aria-label="Thêm cảm xúc"
        >
          <SmilePlus className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        </button>

        {open && (
          <div className="absolute bottom-full left-0 z-20 mb-1 flex gap-0.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-1 shadow-xl">
            {REACTION_PALETTE.map((e) => {
              const active = reactions.find((r) => r.emoji === e)?.mine;
              return (
                <button
                  key={e}
                  type="button"
                  onClick={() => { onToggle(e); setOpen(false); }}
                  disabled={disabled}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-transform hover:scale-125 ${active ? 'bg-violet-500/15' : 'hover:bg-[var(--bg-surface-hover)]'}`}
                  title={e}
                >
                  {e}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
