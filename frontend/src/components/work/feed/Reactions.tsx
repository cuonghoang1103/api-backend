'use client';

/**
 * Cảm xúc của bảng tin (cùng bộ với iOS: like/love/haha/wow/sad/celebrate).
 *   ReactionButton  bấm = Thích / bỏ cảm xúc đang có; rê chuột (máy tính) hoặc GIỮ (cảm ứng, 450 ms) ⇒ thanh 6 cảm xúc;
 *                   bàn phím: nút "Chọn cảm xúc" riêng (mũi tên ←/→ trong thanh, Esc đóng).
 *   ReactionSummary 3 biểu tượng nhiều nhất + tổng ⇒ bấm mở "ai đã bày tỏ".
 *   WhoReactedDialog danh sách theo từng cảm xúc (phân trang con trỏ).
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { SmilePlus, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName } from '@/lib/work-api';
import { FEED_REACTIONS, REACTION_EMOJI, feedApi, type FeedReaction, type ReactionCount } from '@/lib/work-feed-api';
import { Dialog, Spinner, UserAvatar } from '@/components/work/ui';
import { wt } from '@/components/work/i18n';

export const reactionName = (k: FeedReaction) => wt(`feed.r_${k}` as 'feed.r_like');

const REACT_TEXT: Record<FeedReaction, string> = {
  like: 'text-[var(--w-accent-text)]', love: 'text-[var(--w-red-text)]', haha: 'text-[var(--w-yellow-text)]',
  wow: 'text-[var(--w-yellow-text)]', sad: 'text-[var(--w-yellow-text)]', celebrate: 'text-[var(--w-orange-text)]',
};

function Picker({ onPick, onClose, current, size = 'md' }: { onPick: (k: FeedReaction) => void; onClose: () => void; current: FeedReaction | null; size?: 'md' | 'sm' }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const first = ref.current?.querySelector<HTMLButtonElement>('button[data-current="true"]') ?? ref.current?.querySelector<HTMLButtonElement>('button');
    first?.focus({ preventScroll: true });
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [onClose]);
  return (
    <div
      ref={ref}
      role="menu"
      aria-label={wt('feed.pickReaction')}
      className="absolute bottom-full left-0 z-30 mb-1.5 flex items-center gap-0.5 rounded-full border border-[var(--w-border)] bg-[var(--w-raised)] p-1"
      style={{ boxShadow: 'var(--w-shadow-pop)' }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const btns = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
        const i = btns.indexOf(document.activeElement as HTMLButtonElement);
        btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length]?.focus();
        e.preventDefault();
      }}
    >
      {FEED_REACTIONS.map((k) => (
        <button
          key={k}
          type="button"
          role="menuitem"
          data-current={current === k}
          title={reactionName(k)}
          aria-label={wt('feed.reactWith', { name: reactionName(k) })}
          onClick={() => onPick(k)}
          className={cn(
            'flex items-center justify-center rounded-full transition-transform duration-150 hover:-translate-y-1 hover:scale-125 focus-visible:scale-125 focus-visible:outline-none',
            size === 'sm' ? 'h-8 w-8 text-[20px]' : 'h-10 w-10 text-[26px]',
            current === k && 'bg-[var(--w-accent-soft)]',
          )}
        >
          <span aria-hidden="true">{REACTION_EMOJI[k]}</span>
        </button>
      ))}
    </div>
  );
}

/** Nút cảm xúc chính (Thích). `variant="text"` cho dòng hành động của bình luận. */
export function ReactionButton({ mine, onReact, disabled, variant = 'bar' }: {
  mine: FeedReaction | null; onReact: (k: FeedReaction | null) => void; disabled?: boolean; variant?: 'bar' | 'text';
}) {
  const [open, setOpen] = useState(false);
  const hoverT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressed = useRef(false);
  const clear = () => { if (hoverT.current) clearTimeout(hoverT.current); hoverT.current = null; };
  useEffect(() => () => { clear(); if (pressT.current) clearTimeout(pressT.current); }, []);
  const pick = (k: FeedReaction) => { setOpen(false); onReact(k === mine ? null : k); };
  const label = mine ? reactionName(mine) : wt('feed.r_like');
  const main = (
    <button
      type="button"
      disabled={disabled}
      aria-pressed={!!mine}
      aria-label={mine ? `${label} — ${wt('feed.removeReaction')}` : label}
      onClick={() => { if (longPressed.current) { longPressed.current = false; return; } onReact(mine ? null : 'like'); }}
      onTouchStart={() => { longPressed.current = false; pressT.current = setTimeout(() => { longPressed.current = true; setOpen(true); }, 450); }}
      onTouchEnd={() => { if (pressT.current) clearTimeout(pressT.current); }}
      onTouchMove={() => { if (pressT.current) clearTimeout(pressT.current); }}
      onContextMenu={(e) => { if (longPressed.current) e.preventDefault(); }}
      className={cn(
        variant === 'bar'
          ? 'flex h-9 flex-1 items-center justify-center gap-2 rounded-[8px] text-[13.5px] font-medium transition-colors hover:bg-[var(--w-hover)]'
          : 'text-[12px] font-semibold hover:underline',
        mine ? REACT_TEXT[mine] : 'text-[var(--w-text-2)]',
      )}
    >
      {variant === 'bar' && (mine ? <span aria-hidden="true" className="text-[17px] leading-none">{REACTION_EMOJI[mine]}</span> : <ThumbsUp size={16} aria-hidden="true" />)}
      <span>{label}</span>
    </button>
  );
  return (
    <div
      className={cn('relative flex items-center', variant === 'bar' && 'flex-1')}
      onMouseEnter={() => { if (disabled) return; clear(); hoverT.current = setTimeout(() => setOpen(true), 380); }}
      onMouseLeave={() => { clear(); hoverT.current = setTimeout(() => setOpen(false), 260); }}
    >
      {main}
      {variant === 'bar' && (
        <button type="button" className="sr-only focus:not-sr-only focus:ml-1 focus:inline-flex focus:h-9 focus:w-9 focus:items-center focus:justify-center focus:rounded-[8px] focus:bg-[var(--w-hover)]" aria-haspopup="menu" aria-expanded={open} aria-label={wt('feed.pickReaction')} onClick={() => setOpen((o) => !o)}>
          <SmilePlus size={16} />
        </button>
      )}
      {open && <Picker current={mine} onPick={pick} onClose={() => setOpen(false)} size={variant === 'text' ? 'sm' : 'md'} />}
    </div>
  );
}

/** 👍❤️🎉 12 — bấm mở danh sách. */
export function ReactionSummary({ reactions, total, onOpen, className }: { reactions: ReactionCount[]; total: number; onOpen?: () => void; className?: string }) {
  if (!total) return null;
  const inner: ReactNode = (
    <>
      <span className="flex -space-x-1" aria-hidden="true">
        {reactions.slice(0, 3).map((r) => (
          <span key={r.kind} className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--w-panel)] text-[12px] ring-2 ring-[var(--w-panel)]">{REACTION_EMOJI[r.kind]}</span>
        ))}
      </span>
      <span className="tabular-nums">{total}</span>
    </>
  );
  return onOpen
    ? <button type="button" className={cn('flex items-center gap-1.5 text-[13px] text-[var(--w-text-2)] hover:underline', className)} onClick={onOpen} aria-label={wt('feed.nReactions', { count: total })}>{inner}</button>
    : <span className={cn('flex items-center gap-1.5 text-[12px] text-[var(--w-text-2)]', className)}>{inner}</span>;
}

export function WhoReactedDialog({ postId, open, onClose, reactions }: { postId: number; open: boolean; onClose: () => void; reactions: ReactionCount[] }) {
  const [kind, setKind] = useState<FeedReaction | null>(null);
  const q = useInfiniteQuery({
    queryKey: ['work', 'feed', 'reactions', postId, kind ?? 'all'],
    queryFn: ({ pageParam }) => feedApi.reactions(postId, kind, pageParam as string | null),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    enabled: open,
  });
  const items = q.data?.pages.flatMap((p) => p.items) ?? [];
  const total = reactions.reduce((n, r) => n + r.count, 0);
  return (
    <Dialog open={open} onClose={onClose} title={wt('feed.whoReacted')} width={420}>
      <div className="-mx-1 mb-3 flex gap-1 overflow-x-auto pb-1" role="tablist">
        <button type="button" role="tab" aria-selected={kind === null} onClick={() => setKind(null)} className={cn('h-8 shrink-0 rounded-full px-3 text-[13px] font-medium', kind === null ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
          {wt('feed.reactAll')} <span className="tabular-nums">{total}</span>
        </button>
        {reactions.map((r) => (
          <button key={r.kind} type="button" role="tab" aria-selected={kind === r.kind} onClick={() => setKind(r.kind)} aria-label={`${reactionName(r.kind)} ${r.count}`}
            className={cn('flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-[13px]', kind === r.kind ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
            <span aria-hidden="true">{REACTION_EMOJI[r.kind]}</span><span className="tabular-nums">{r.count}</span>
          </button>
        ))}
      </div>
      <ul className="max-h-[50vh] overflow-y-auto">
        {items.map((it) => (
          <li key={`${it.user.id}`} className="flex items-center gap-3 py-1.5">
            <span className="relative">
              <UserAvatar user={it.user} size={32} />
              <span className="absolute -bottom-1 -right-1 text-[13px]" aria-hidden="true">{REACTION_EMOJI[it.kind]}</span>
            </span>
            <span className="min-w-0 flex-1 truncate text-[14px]">{userName(it.user)}</span>
          </li>
        ))}
      </ul>
      {q.isLoading && <div className="flex justify-center py-4"><Spinner /></div>}
      {q.hasNextPage && <button type="button" className="w-btn w-btn-sm mt-2" onClick={() => q.fetchNextPage()}>{wt('feed.loadMore')}</button>}
    </Dialog>
  );
}
