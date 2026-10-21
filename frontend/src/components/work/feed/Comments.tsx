'use client';

/**
 * Bình luận của một bài: xem trước 2 bình luận gốc mới nhất (đi kèm bài) ⇒ "Xem thêm" nạp cả luồng (cũ → mới, phân trang),
 * mỗi bình luận gốc kèm 2 trả lời đầu + "Xem N trả lời". Trả lời đúng MỘT cấp (trả lời một trả lời ⇒ máy chủ gắn vào gốc,
 * ô trả lời điền sẵn @tên). Cảm xúc, sửa, xoá, báo cáo, gỡ (quản trị) ngay trên dòng.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MoreHorizontal, SendHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError } from '@/lib/work-api';
import { FEED_COMMENT_MAX, feedApi, feedKeys, type FeedComment, type FeedPost, type FeedReaction } from '@/lib/work-feed-api';
import { useAuthStore } from '@/store/authStore';
import { Popover, Spinner, UserAvatar } from '@/components/work/ui';
import { wfmt, wt } from '@/components/work/i18n';
import { refreshPost } from './feedCache';
import { FeedMarkdown } from './FeedMarkdown';
import { MentionTextarea, type MentionTextareaHandle } from './MentionTextarea';
import { ReactionButton, ReactionSummary } from './Reactions';

type Scope = { workspaceId: number; projectId: number | null };
const newKey = () => `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export function CommentComposer({ post, parentId, prefill, autoFocus, onSent, onCancel, compact }: {
  post: FeedPost; parentId?: number | null; prefill?: string; autoFocus?: boolean; onSent?: () => void; onCancel?: () => void; compact?: boolean;
}) {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user);
  const [text, setText] = useState(prefill ?? '');
  const [busy, setBusy] = useState(false);
  const key = useRef(newKey());
  const scope: Scope = { workspaceId: post.workspace.id, projectId: post.project?.id ?? null };
  useEffect(() => { if (prefill) setText(prefill); }, [prefill]);
  const send = async () => {
    const body = text.trim();
    if (!body || busy) return;
    setBusy(true);
    try {
      await feedApi.addComment(post.id, { body, parentId: parentId ?? null, clientKey: key.current });
      key.current = newKey();
      setText('');
      await Promise.all([qc.invalidateQueries({ queryKey: ['work', 'feed', 'comments', post.id] }), refreshPost(qc, post.id)]);
      onSent?.();
    } catch (err) {
      toast.error(workError(err, wt('feed.commentFailed')));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className={cn('flex items-start gap-2', compact && 'pl-9')}>
      <UserAvatar user={me ? { id: me.id, username: me.username ?? '', displayName: me.displayName ?? null, fullName: (me as { fullName?: string | null }).fullName ?? null, avatarUrl: me.avatarUrl ?? null } : null} size={compact ? 24 : 32} className="mt-0.5 shrink-0" />
      <div className="flex min-w-0 flex-1 items-end gap-1 rounded-[18px] border border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-1 focus-within:border-[var(--w-accent-border)] focus-within:bg-[var(--w-panel)]">
        <MentionTextarea
          value={text}
          onChange={setText}
          scope={scope}
          ariaLabel={parentId ? wt('feed.reply') : wt('feed.writeComment')}
          placeholder={parentId ? wt('feed.writeReply', { name: prefill?.replace(/^@/, '').trim() || '' }) : wt('feed.writeComment')}
          submitOnEnter
          onSubmit={send}
          onEscape={onCancel}
          autoFocus={autoFocus}
          maxLength={FEED_COMMENT_MAX + 50}
          maxRows={8}
          className="py-1.5"
        />
        <button type="button" className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--w-accent-text)] hover:bg-[var(--w-hover)] disabled:opacity-40" disabled={!text.trim() || busy} onClick={send} aria-label={wt('feed.send')}>
          {busy ? <Spinner size={12} /> : <SendHorizontal size={15} />}
        </button>
      </div>
    </div>
  );
}

function CommentItem({ c, post, onReply, onReport, highlight, isReply }: {
  c: FeedComment; post: FeedPost; onReply: (c: FeedComment) => void; onReport: (id: number) => void; highlight?: number | null; isReply?: boolean;
}) {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(c.body);
  const [show, setShow] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mine, setMine] = useState<{ my: FeedReaction | null; count: number; reactions: FeedComment['reactions'] }>({ my: c.myReaction, count: c.reactionCount, reactions: c.reactions });
  const menuBtn = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { setMine({ my: c.myReaction, count: c.reactionCount, reactions: c.reactions }); }, [c.myReaction, c.reactionCount, c.reactions]);
  useEffect(() => { if (highlight === c.id) ref.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, [highlight, c.id]);
  const known = useMemo(() => new Map(c.mentions.map((m) => [m.username.toLowerCase(), m.name] as [string, string])), [c.mentions]);
  const refresh = () => Promise.all([qc.invalidateQueries({ queryKey: ['work', 'feed', 'comments', post.id] }), refreshPost(qc, post.id)]);
  const run = async (fn: () => Promise<unknown>, ok?: string) => {
    try { await fn(); if (ok) toast.success(ok); await refresh(); } catch (err) { toast.error(workError(err)); }
  };
  const react = async (k: FeedReaction | null) => {
    try {
      const r = await feedApi.reactComment(c.id, k);
      setMine({ my: r.myReaction, count: r.reactionCount, reactions: r.reactions });
    } catch (err) { toast.error(workError(err)); }
  };

  if (c.hiddenForMe && !show) {
    return (
      <div className={cn('flex items-center gap-2 rounded-[10px] bg-[var(--w-sunken)] px-3 py-2 text-[12.5px] text-[var(--w-text-3)]', isReply && 'ml-9')}>
        <span className="min-w-0 flex-1">{wt('feed.hiddenComment')}</span>
        <button type="button" className="shrink-0 font-medium text-[var(--w-text-2)] hover:underline" onClick={() => setShow(true)}>{wt('feed.showAnyway')}</button>
      </div>
    );
  }
  return (
    <div ref={ref} className={cn('group flex items-start gap-2', isReply && 'ml-9')} id={`feed-comment-${c.id}`}>
      <UserAvatar user={c.author} size={isReply ? 24 : 32} className="mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="rounded-[14px] border border-[var(--w-accent-border)] bg-[var(--w-panel)] px-3 py-1.5">
            <MentionTextarea value={draft} onChange={setDraft} scope={{ workspaceId: post.workspace.id, projectId: post.project?.id ?? null }} ariaLabel={wt('feed.editComment')} autoFocus maxRows={8}
              submitOnEnter onSubmit={() => run(() => feedApi.editComment(c.id, draft)).then(() => setEditing(false))} onEscape={() => { setEditing(false); setDraft(c.body); }} />
            <div className="mt-1 flex justify-end gap-1.5">
              <button type="button" className="w-btn w-btn-sm" onClick={() => { setEditing(false); setDraft(c.body); }}>{wt('feed.cancel')}</button>
              <button type="button" className="w-btn w-btn-primary w-btn-sm" disabled={!draft.trim()} onClick={() => run(() => feedApi.editComment(c.id, draft)).then(() => setEditing(false))}>{wt('feed.saveChanges')}</button>
            </div>
          </div>
        ) : (
          <div className="relative inline-block max-w-full">
            <div className={cn('rounded-[14px] px-3 py-1.5', highlight === c.id ? 'bg-[var(--w-accent-soft)] ring-1 ring-[var(--w-accent-border)]' : 'bg-[var(--w-sunken)]', c.hidden && 'opacity-70')}>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold">
                <span className="truncate">{userName(c.author)}</span>
                {c.hidden && <span className="rounded-[4px] bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] px-1.5 text-[11px] font-medium text-[var(--w-red-text)]">{wt('feed.commentRemoved')}</span>}
              </div>
              <FeedMarkdown text={c.body} known={known} meUsername={me?.username} className="text-[13.5px] leading-[1.5]" />
            </div>
            {mine.count > 0 && (
              <span className="absolute -bottom-2.5 right-1 rounded-full border border-[var(--w-border)] bg-[var(--w-panel)] px-1.5 py-px shadow-[var(--w-shadow-card)]">
                <ReactionSummary reactions={mine.reactions} total={mine.count} />
              </span>
            )}
          </div>
        )}
        {!editing && (
          <div className="mt-0.5 flex items-center gap-3 pl-3 text-[12px] text-[var(--w-text-3)]">
            <time dateTime={c.createdAt} title={wfmt.dateTime(c.createdAt)}>{wfmt.relative(c.createdAt)}</time>
            <ReactionButton variant="text" mine={mine.my} onReact={react} />
            {c.can.reply && <button type="button" className="font-semibold text-[var(--w-text-2)] hover:underline" onClick={() => onReply(c)}>{wt('feed.reply')}</button>}
            {c.editedAt && <span>{wt('feed.edited')}</span>}
            {(c.can.edit || c.can.delete || c.can.report || c.can.moderate) && (
              <>
                <button ref={menuBtn} type="button" className="flex h-6 w-6 items-center justify-center rounded-full opacity-0 hover:bg-[var(--w-hover)] focus-visible:opacity-100 group-hover:opacity-100 max-md:opacity-100" aria-label={wt('feed.more')} aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu((o) => !o)}>
                  <MoreHorizontal size={14} />
                </button>
                <Popover open={menu} onClose={() => setMenu(false)} anchorRef={menuBtn} width={200}>
                  <div role="menu" className="p-1 text-[13px]">
                    {c.can.edit && <MenuItem onClick={() => { setMenu(false); setDraft(c.body); setEditing(true); }}>{wt('feed.editComment')}</MenuItem>}
                    {c.can.report && <MenuItem onClick={() => { setMenu(false); onReport(c.id); }}>{wt('feed.reportComment')}</MenuItem>}
                    {c.can.moderate && <MenuItem onClick={() => { setMenu(false); void run(() => feedApi.moderateComment(c.id, !c.hidden), c.hidden ? wt('feed.restoredToast') : wt('feed.removedToast')); }}>{c.hidden ? wt('feed.restoreAdmin') : wt('feed.removeAdmin')}</MenuItem>}
                    {c.can.delete && <MenuItem danger onClick={() => { setMenu(false); if (window.confirm(wt('feed.deleteCommentConfirm'))) void run(() => feedApi.removeComment(c.id)); }}>{wt('feed.deleteComment')}</MenuItem>}
                  </div>
                </Popover>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function MenuItem({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button type="button" role="menuitem" onClick={onClick} className={cn('flex h-8 w-full items-center gap-2 rounded-[6px] px-2.5 text-left hover:bg-[var(--w-hover)]', danger && 'text-[var(--w-red-text)]')}>
      {children}
    </button>
  );
}

function Replies({ post, parent, onReply, onReport, highlight }: { post: FeedPost; parent: FeedComment; onReply: (c: FeedComment) => void; onReport: (id: number) => void; highlight?: number | null }) {
  const [open, setOpen] = useState(false);
  const q = useInfiniteQuery({
    queryKey: feedKeys.comments(post.id, parent.id),
    queryFn: ({ pageParam }) => feedApi.comments(post.id, { parentId: parent.id, cursor: pageParam as string | null, limit: 50 }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    enabled: open,
  });
  const list = open ? q.data?.pages.flatMap((p) => p.comments) ?? parent.replies : parent.replies;
  const hiddenCount = Math.max(0, parent.replyCount - list.length);
  return (
    <div className="mt-2 grid gap-2">
      {list.map((r) => <CommentItem key={r.id} c={r} post={post} onReply={() => onReply(parent)} onReport={onReport} highlight={highlight} isReply />)}
      {(hiddenCount > 0 || q.hasNextPage) && (
        <button type="button" className="ml-9 w-fit text-[12.5px] font-semibold text-[var(--w-text-2)] hover:underline" onClick={() => (open ? q.fetchNextPage() : setOpen(true))}>
          {q.isFetching ? <Spinner size={11} /> : wt('feed.viewReplies', { count: hiddenCount || parent.replyCount })}
        </button>
      )}
    </div>
  );
}

/** Khối bình luận dưới bài. `full` = trang chi tiết (nạp luồng ngay). */
export function CommentsSection({ post, full: fullInit, composerSignal, highlight, onReport }: {
  post: FeedPost; full?: boolean; composerSignal?: number; highlight?: number | null; onReport: (target: { kind: 'comment'; id: number }) => void;
}) {
  const [full, setFull] = useState(!!fullInit);
  const [replyTo, setReplyTo] = useState<FeedComment | null>(null);
  const [showComposer, setShowComposer] = useState(!!fullInit);
  useEffect(() => { if (composerSignal) setShowComposer(true); }, [composerSignal]);
  const q = useInfiniteQuery({
    queryKey: feedKeys.comments(post.id),
    queryFn: ({ pageParam }) => feedApi.comments(post.id, { cursor: pageParam as string | null, limit: 30 }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
    enabled: full,
  });
  const list = full ? q.data?.pages.flatMap((p) => p.comments) ?? [] : post.comments;
  const shownTotal = list.reduce((n, c) => n + 1 + (full ? c.replies.length : 0), 0);
  const more = !full && post.commentCount > shownTotal;
  const onReply = (c: FeedComment) => { setReplyTo(c); setShowComposer(true); };
  const report = (id: number) => onReport({ kind: 'comment', id });
  if (!post.commentCount && !showComposer) return null;
  return (
    <div className="grid gap-2.5 border-t border-[var(--w-border)] px-4 pb-3 pt-2.5">
      {more && (
        <button type="button" className="w-fit text-[13px] font-semibold text-[var(--w-text-2)] hover:underline" onClick={() => setFull(true)}>
          {post.commentCount > 3 ? wt('feed.viewAll', { count: post.commentCount }) : wt('feed.viewMore')}
        </button>
      )}
      {full && q.isLoading && <div className="flex justify-center py-2"><Spinner size={14} /></div>}
      {list.map((c) => (
        <div key={c.id}>
          <CommentItem c={c} post={post} onReply={onReply} onReport={report} highlight={highlight} />
          {(c.replyCount > 0 || c.replies.length > 0) && <Replies post={post} parent={c} onReply={onReply} onReport={report} highlight={highlight} />}
          {replyTo?.id === c.id && post.can.comment && (
            <div className="mt-2">
              <CommentComposer post={post} parentId={c.id} prefill={`@${replyTo.author.username} `} autoFocus compact onSent={() => setReplyTo(null)} onCancel={() => setReplyTo(null)} />
            </div>
          )}
        </div>
      ))}
      {full && q.hasNextPage && (
        <button type="button" className="w-fit text-[13px] font-semibold text-[var(--w-text-2)] hover:underline" onClick={() => q.fetchNextPage()}>
          {q.isFetchingNextPage ? <Spinner size={12} /> : wt('feed.viewMore')}
        </button>
      )}
      {post.can.comment
        ? (showComposer || post.commentCount > 0) && <CommentComposer post={post} autoFocus={showComposer && !!composerSignal} onSent={() => setFull((f) => f || post.commentCount >= 2)} />
        : <p className="text-[12.5px] text-[var(--w-text-3)]">{wt('feed.commentsOff')}</p>}
    </div>
  );
}
