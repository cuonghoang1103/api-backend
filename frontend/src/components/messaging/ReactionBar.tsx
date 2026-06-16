'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Smile } from 'lucide-react';
import type { MessagingReaction } from '@/lib/api';
import { cn } from '@/lib/utils';

/**
 * Reaction picker + summary row shown under a message bubble.
 *
 * - Quick-pick from a curated set of 6 emojis (the same set
 *   the admin can disable/enable if needed).
 * - Each emoji's pill shows the count and highlights with a
 *   cyan border if the current user has already reacted with it.
 * - The "+" button reveals a small emoji grid for less common
 *   reactions; clicking one toggles it (add-or-remove).
 */
const QUICK_EMOJI = ['👍', '❤️', '😂', '😮', '😢', '🔥'] as const;
const EXTRA_EMOJI = ['👏', '🎉', '🙏', '👀', '💯', '🤔', '🙄', '💪'] as const;
const ALL_EMOJI = [...QUICK_EMOJI, ...EXTRA_EMOJI] as readonly string[];

export default function ReactionBar({
  reactions = [],
  myUserId,
  onToggle,
  isOwn,
}: {
  reactions: MessagingReaction[];
  myUserId: number | undefined;
  onToggle: (emoji: string) => void;
  isOwn: boolean;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close the picker on outside click
  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [pickerOpen]);

  // Build a map of emoji -> reaction for quick lookup
  const byEmoji = new Map<string, MessagingReaction>();
  for (const r of reactions) byEmoji.set(r.emoji, r);

  return (
    <div
      ref={ref}
      className={cn('mt-1 flex flex-wrap items-center gap-1', isOwn ? 'justify-end' : 'justify-start')}
    >
      {Array.from(byEmoji.values()).map((r) => {
        const mine = myUserId !== undefined && r.userIds.includes(myUserId);
        return (
          <button
            key={r.emoji}
            onClick={() => onToggle(r.emoji)}
            className={cn(
              'flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[11px] transition-all',
              mine
                ? 'border-cyan-400/60 bg-cyan-500/20 text-cyan-200'
                : 'border-white/10 bg-white/[0.04] text-text-secondary hover:border-white/20 hover:bg-white/[0.08]',
            )}
            title={mine ? 'Bỏ reaction' : 'React'}
          >
            <span className="text-[12px] leading-none">{r.emoji}</span>
            <span className="font-medium">{r.count}</span>
          </button>
        );
      })}

      <div className="relative">
        <button
          onClick={() => setPickerOpen((s) => !s)}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-text-muted transition-colors hover:border-cyan-400/40 hover:bg-white/[0.08] hover:text-cyan-400"
          title="Thêm reaction"
          aria-label="Thêm reaction"
        >
          {pickerOpen ? <Smile className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </button>
        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 4 }}
              transition={{ duration: 0.12 }}
              className={cn(
                'absolute z-20 grid grid-cols-4 gap-1 rounded-xl border border-white/10 bg-[#0a0a14]/95 p-2 shadow-2xl backdrop-blur',
                isOwn ? 'right-0' : 'left-0',
              )}
              style={{ width: 168 }}
            >
              {ALL_EMOJI.map((emoji) => {
                const existing = byEmoji.get(emoji);
                const mine = myUserId !== undefined && existing?.userIds.includes(myUserId);
                return (
                  <button
                    key={emoji}
                    onClick={() => {
                      onToggle(emoji);
                      setPickerOpen(false);
                    }}
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-all',
                      mine
                        ? 'bg-cyan-500/30 ring-1 ring-cyan-400/60'
                        : 'hover:bg-white/10',
                    )}
                    title={mine ? 'Bỏ reaction' : 'React'}
                  >
                    {emoji}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
