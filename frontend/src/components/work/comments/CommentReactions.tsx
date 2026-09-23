'use client';

/**
 * Cảm xúc trên bình luận (kiểu GitHub): chip "🎉 2" dưới bình luận + nút mặt
 * cười mở bảng 8 emoji. Bấm là đổi NGAY (lạc quan), lỗi thì trả lại như cũ.
 *
 * - Gửi trạng thái MUỐN CÓ (active: true/false) chứ không "đảo" ⇒ bấm đúp hay
 *   mạng gửi lại không làm lệch; các lượt bấm của một thẻ xếp hàng (scope).
 * - Người khác bấm ⇒ server phát `work:comment-reaction` (KHÔNG qua work:event
 *   để khỏi làm tươi cả board) ⇒ ở đây tải lại bình luận của đúng thẻ này.
 */

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { SmilePlus } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { connectSocket } from '@/lib/socket';
import { cn } from '@/lib/utils';
import {
  REACTION_EMOJIS, REACTION_LABELS, workApi, workError,
  type CommentReaction, type ReactionEmoji, type WorkComment,
} from '@/lib/work-api';
import { wk } from '../hooks';
import { Popover } from '../ui';

// ─── Dữ liệu ─────────────────────────────────────────────────────

/** Áp một lượt bấm lên danh sách chip (giữ thứ tự cố định của REACTION_EMOJIS). */
function applyReaction(list: CommentReaction[], emoji: ReactionEmoji, active: boolean, me: { id: number; name: string }): CommentReaction[] {
  const map = new Map(list.map((r) => [r.emoji, r]));
  const cur = map.get(emoji);
  if (active && !cur?.mine) {
    map.set(emoji, {
      emoji,
      count: (cur?.count ?? 0) + 1,
      mine: true,
      users: [{ id: me.id, name: me.name }, ...(cur?.users ?? []).filter((u) => u.id !== me.id)].slice(0, 10),
    });
  } else if (!active && cur?.mine) {
    if (cur.count <= 1) map.delete(emoji);
    else map.set(emoji, { ...cur, count: cur.count - 1, mine: false, users: cur.users.filter((u) => u.id !== me.id) });
  }
  return REACTION_EMOJIS.map((e) => map.get(e)).filter((x): x is CommentReaction => !!x);
}

interface ToggleVars { cid: number; emoji: ReactionEmoji; active: boolean }

/** Bật/tắt cảm xúc có cập nhật lạc quan + hoàn tác khi lỗi. */
export function useToggleReaction(pid: number, num: number, me: { id: number; name: string } | null) {
  const qc = useQueryClient();
  const key = wk.comments(pid, num);
  const mutationKey = ['work', 'react', pid, num] as const;
  return useMutation({
    mutationKey,
    // Cùng một thẻ thì gửi lần lượt — hai yêu cầu không bao giờ tới server lộn thứ tự.
    scope: { id: `work-react-${pid}-${num}` },
    mutationFn: ({ cid, emoji, active }: ToggleVars) => workApi.reactToComment(pid, num, cid, emoji, active),
    onMutate: async ({ cid, emoji, active }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<WorkComment[]>(key);
      if (me) {
        qc.setQueryData<WorkComment[]>(key, (list) => list?.map((c) => (c.id === cid ? { ...c, reactions: applyReaction(c.reactions ?? [], emoji, active, me) } : c)));
      }
      return { prev };
    },
    onError: (err, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
      toast.error(workError(err, 'Could not update the reaction'));
    },
    onSuccess: (r) => {
      // Còn lượt bấm khác đang chờ thì giữ bản lạc quan — lấy số của server lúc này sẽ nháy ngược.
      if (qc.isMutating({ mutationKey }) > 1) return;
      qc.setQueryData<WorkComment[]>(key, (list) => list?.map((c) => (c.id === r.commentId ? { ...c, reactions: r.reactions } : c)));
    },
  });
}

/** Người khác bấm cảm xúc trên thẻ đang mở ⇒ tải lại bình luận của thẻ. */
export function useCommentReactionsRealtime(pid: number, num: number) {
  const qc = useQueryClient();
  const meId = useAuthStore((s) => s.user?.id);
  useEffect(() => {
    let alive = true;
    let socket: Awaited<ReturnType<typeof connectSocket>> | null = null;
    const handler = (e: { projectId: number; number: number; userId: number }) => {
      if (e.projectId !== pid || e.number !== num || e.userId === meId) return;
      // Đang có lượt bấm của mình chờ server ⇒ đừng đè bản lạc quan.
      if (qc.isMutating({ mutationKey: ['work', 'react', pid, num] })) return;
      qc.invalidateQueries({ queryKey: wk.comments(pid, num) });
    };
    connectSocket()
      .then((s) => {
        if (!alive) return;
        socket = s;
        s.on('work:comment-reaction', handler);
      })
      .catch(() => {});
    return () => {
      alive = false;
      socket?.off('work:comment-reaction', handler);
    };
  }, [pid, num, meId, qc]);
}

// ─── Chữ tooltip ─────────────────────────────────────────────────

/** "You, Linh and 2 others reacted with 👍" */
export function reactionSummary(r: CommentReaction, meId: number | undefined): string {
  const names = r.users.map((u) => (u.id === meId ? 'You' : u.name));
  if (r.mine && !names.includes('You')) names.unshift('You');
  const ordered = [...names.filter((n) => n === 'You'), ...names.filter((n) => n !== 'You')];
  const shown = ordered.slice(0, 3);
  const others = Math.max(0, r.count - shown.length);
  let who: string;
  if (others > 0) who = `${shown.join(', ')} and ${others} other${others === 1 ? '' : 's'}`;
  else if (shown.length <= 1) who = shown[0] ?? 'Someone';
  else who = `${shown.slice(0, -1).join(', ')} and ${shown[shown.length - 1]}`;
  return `${who} reacted with ${r.emoji}`;
}

// ─── Bảng chọn emoji ─────────────────────────────────────────────

function EmojiGrid({ reactions, onPick }: { reactions: CommentReaction[]; onPick: (e: ReactionEmoji) => void }) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  useEffect(() => {
    // Mở bảng ⇒ đưa focus vào emoji đầu tiên (bàn phím dùng được ngay).
    const t = setTimeout(() => refs.current[0]?.focus(), 0);
    return () => clearTimeout(t);
  }, []);
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = refs.current.findIndex((b) => b === document.activeElement);
    const n = REACTION_EMOJIS.length;
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    if (next >= 0) { e.preventDefault(); refs.current[next]?.focus(); }
  };
  return (
    <div role="toolbar" aria-label="Pick a reaction" className="flex items-center gap-0.5 p-1.5" onKeyDown={onKey}>
      {REACTION_EMOJIS.map((emoji, i) => {
        const mine = reactions.some((r) => r.emoji === emoji && r.mine);
        return (
          <button
            key={emoji}
            ref={(el) => { refs.current[i] = el; }}
            type="button"
            title={REACTION_LABELS[emoji]}
            aria-label={REACTION_LABELS[emoji]}
            aria-pressed={mine}
            tabIndex={i === 0 ? 0 : -1}
            onClick={() => onPick(emoji)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-[6px] text-[18px] leading-none transition-transform',
              'hover:scale-110 hover:bg-[var(--w-hover)] focus-visible:bg-[var(--w-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--w-accent-border)]',
              mine && 'bg-[var(--w-accent-soft)]',
            )}
          >
            <span aria-hidden>{emoji}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Nút mặt cười + bảng chọn. `variant="chip"` = nút tròn cạnh các chip. */
export function ReactionPickerButton({ reactions, onPick, variant = 'icon', className }: {
  reactions: CommentReaction[];
  onPick: (e: ReactionEmoji) => void;
  variant?: 'icon' | 'chip';
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const anchor = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    anchor.current?.focus();
  }, []);
  return (
    <>
      <button
        ref={anchor}
        type="button"
        title="Add reaction"
        aria-label="Add reaction"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          variant === 'chip'
            ? 'inline-flex h-6 items-center justify-center rounded-full border border-[var(--w-border)] px-1.5 text-[var(--w-text-3)] hover:border-[var(--w-border-strong)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]'
            : 'w-btn w-btn-ghost w-btn-icon w-btn-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--w-accent-border)]',
          open && 'bg-[var(--w-hover)] text-[var(--w-text)]',
          className,
        )}
      >
        <SmilePlus size={variant === 'chip' ? 13 : 12} />
      </button>
      <Popover open={open} onClose={close} anchorRef={anchor} width={296} align="start">
        <EmojiGrid reactions={reactions} onPick={(e) => { onPick(e); close(); }} />
      </Popover>
    </>
  );
}

// ─── Hàng chip dưới bình luận ────────────────────────────────────

export function ReactionBar({ reactions, meId, canReact, onToggle }: {
  reactions: CommentReaction[];
  meId: number | undefined;
  canReact: boolean;
  onToggle: (emoji: ReactionEmoji, active: boolean) => void;
}) {
  if (!reactions.length) return null;
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5" aria-label="Reactions">
      {reactions.map((r) => {
        const summary = reactionSummary(r, meId);
        const cls = cn(
          'inline-flex h-6 select-none items-center gap-1 rounded-full border px-2 text-[12px] leading-none transition-colors',
          r.mine
            ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]'
            : 'border-[var(--w-border)] bg-[var(--w-sunken)] text-[var(--w-text-2)]',
        );
        const inner = (
          <>
            <span aria-hidden className="text-[14px]">{r.emoji}</span>
            <span className="font-medium tabular-nums">{r.count}</span>
          </>
        );
        return canReact ? (
          <button
            key={r.emoji}
            type="button"
            title={summary}
            aria-label={`${summary}. ${r.mine ? 'Remove your reaction' : 'Add your reaction'}`}
            aria-pressed={r.mine}
            onClick={() => onToggle(r.emoji, !r.mine)}
            className={cn(
              cls,
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--w-accent-border)]',
              r.mine ? 'hover:bg-[color-mix(in_srgb,var(--w-accent)_18%,transparent)]' : 'hover:border-[var(--w-border-strong)] hover:bg-[var(--w-hover)]',
            )}
          >
            {inner}
          </button>
        ) : (
          <span key={r.emoji} title={summary} aria-label={summary} className={cls}>{inner}</span>
        );
      })}
      {canReact && (
        <ReactionPickerButton variant="chip" reactions={reactions} onPick={(e) => onToggle(e, !reactions.some((r) => r.emoji === e && r.mine))} />
      )}
    </div>
  );
}
