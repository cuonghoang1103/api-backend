'use client';

/**
 * Thẻ bài của bảng tin: đầu bài (ảnh đại diện, tên, chip vai, nhãn phạm vi, giờ tương đối, đã sửa, ghim) · nội dung Markdown
 * (@chip, #thẻ, "Xem thêm") · lưới ảnh/video + trình xem (xemTep, ←/→) · tệp · thẻ link · thẻ thẻ/Docs · bình chọn · dòng
 * đếm cảm xúc/bình luận · hàng nút (Thích + bảng cảm xúc, Bình luận, Lưu, Sao chép liên kết) · bình luận.
 * Menu "…": lưu, sao chép liên kết, ẩn bài, báo cáo, (tác giả) sửa/xoá/tắt bình luận, (quản trị) ghim/gỡ.
 */

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bookmark, BookmarkCheck, EyeOff, Link2, MessageCircle, MoreHorizontal, Pin, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError } from '@/lib/work-api';
import { FEED_BODY_MAX, feedApi, type FeedPost, type FeedReaction } from '@/lib/work-feed-api';
import { useAuthStore } from '@/store/authStore';
import { Popover, ProjectMark, UserAvatar, publicOrigin } from '@/components/work/ui';
import { tepBangTinNhom, useXemTep } from '@/components/work/xemTep/XemTep';
import { wfmt, wt } from '@/components/work/i18n';
import { CommentsSection, MenuItem } from './Comments';
import { dropPost, patchPost, refreshPost } from './feedCache';
import { FeedMarkdown } from './FeedMarkdown';
import { MentionTextarea } from './MentionTextarea';
import { FileList, LinkCard, MediaGrid, PollView, RefCards } from './PostParts';
import { ReactionButton, ReactionSummary, WhoReactedDialog } from './Reactions';

const LONG = 700;

export function roleLabel(role: string | null): string | null {
  if (!role) return null;
  const k = `feed.role${role}` as 'feed.roleMEMBER';
  const s = wt(k);
  return s === k ? role : s;
}

export function PostCard({ post, onTag, detail, highlightComment, onReport, onOpenDetail }: {
  post: FeedPost;
  onTag?: (tag: string) => void;
  /** Trang/khung chi tiết: mở cả luồng bình luận. */
  detail?: boolean;
  highlightComment?: number | null;
  onReport: (t: { kind: 'post' | 'comment'; id: number }) => void;
  onOpenDetail?: (id: number) => void;
}) {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user);
  const xem = useXemTep();
  const [expanded, setExpanded] = useState(!!detail);
  const [menu, setMenu] = useState(false);
  const [who, setWho] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.body);
  const [composerSignal, setComposerSignal] = useState(0);
  const [voteBusy, setVoteBusy] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const known = useMemo(() => new Map(post.mentions.map((m) => [m.username.toLowerCase(), m.name] as [string, string])), [post.mentions]);
  const media = post.attachments.filter((a) => a.kind !== 'FILE');
  const files = post.attachments.filter((a) => a.kind === 'FILE');
  const long = post.body.length > LONG || post.body.split('\n').length > 10;
  useEffect(() => { if (!editing) setDraft(post.body); }, [post.body, editing]);

  const scopeHref = post.project ? `/work/${post.workspace.slug}/${post.project.key}/feed` : `/work/${post.workspace.slug}/feed`;
  const postHref = post.url;
  const absUrl = () => `${typeof window !== 'undefined' ? publicOrigin() : ''}${postHref}`;

  const act = async (fn: () => Promise<unknown>, ok?: string, after: 'refresh' | 'drop' | 'none' = 'refresh') => {
    try {
      await fn();
      if (ok) toast.success(ok);
      if (after === 'refresh') await refreshPost(qc, post.id);
      if (after === 'drop') dropPost(qc, post.id);
    } catch (err) { toast.error(workError(err)); }
  };
  const react = async (k: FeedReaction | null) => {
    const prev = { myReaction: post.myReaction, reactionCount: post.reactionCount, reactions: post.reactions };
    // Lạc quan: đổi ngay, sai thì trả lại.
    patchPost(qc, post.id, (p) => {
      const had = !!p.myReaction;
      const count = p.reactionCount + (k && !had ? 1 : !k && had ? -1 : 0);
      const map = new Map(p.reactions.map((r) => [r.kind, r.count]));
      if (p.myReaction) map.set(p.myReaction, Math.max(0, (map.get(p.myReaction) ?? 1) - 1));
      if (k) map.set(k, (map.get(k) ?? 0) + 1);
      return { ...p, myReaction: k, reactionCount: count, reactions: [...map].filter(([, n]) => n > 0).map(([kind, n]) => ({ kind, count: n })).sort((a, b) => b.count - a.count) };
    });
    try {
      const r = await feedApi.react(post.id, k);
      patchPost(qc, post.id, (p) => ({ ...p, ...r }));
    } catch (err) {
      patchPost(qc, post.id, (p) => ({ ...p, ...prev }));
      toast.error(workError(err));
    }
  };
  const vote = async (ids: string[]) => {
    setVoteBusy(true);
    try {
      const poll = await feedApi.vote(post.id, ids);
      patchPost(qc, post.id, (p) => ({ ...p, poll }));
    } catch (err) { toast.error(workError(err, wt('feed.voteFailed'))); } finally { setVoteBusy(false); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(absUrl()); toast.success(wt('feed.linkCopied')); } catch { toast.error(absUrl()); }
  };
  const save = () => act(async () => {
    const r = await feedApi.save(post.id, !post.saved);
    patchPost(qc, post.id, (p) => ({ ...p, saved: r.saved }));
    toast.success(r.saved ? wt('feed.savedToast') : wt('feed.unsavedToast'));
  }, undefined, 'none');
  const saveEdit = () => act(async () => { await feedApi.update(post.id, { body: draft }); setEditing(false); }, wt('feed.updated'));
  const files4viewer = (list: typeof post.attachments) => list.map((a) => tepBangTinNhom({ id: a.id, fileName: a.fileName, mime: a.mime, size: a.size, createdAt: post.createdAt, uploader: post.author }));

  return (
    <article className={cn('w-card overflow-visible p-0', post.hidden && 'ring-1 ring-[color-mix(in_srgb,var(--w-red)_40%,transparent)]')} aria-labelledby={`feed-post-${post.id}-author`} data-testid="feed-post">
      {post.hidden && (
        <div className="flex items-center gap-2 rounded-t-[inherit] bg-[color-mix(in_srgb,var(--w-red)_10%,transparent)] px-4 py-2 text-[12.5px] text-[var(--w-red-text)]">
          <ShieldAlert size={14} className="shrink-0" /> {wt('feed.removedByAdmin')}
        </div>
      )}
      {post.hiddenForMe && (
        <div className="flex items-center gap-2 bg-[var(--w-sunken)] px-4 py-2 text-[12.5px] text-[var(--w-text-2)]">
          <EyeOff size={14} className="shrink-0" /> <span className="min-w-0 flex-1">{wt('feed.hiddenByYou')}</span>
          <button type="button" className="font-semibold hover:underline" onClick={() => act(() => feedApi.hide(post.id, false))}>{wt('feed.unhide')}</button>
        </div>
      )}
      <header className="flex items-start gap-3 px-4 pb-2 pt-3.5">
        <UserAvatar user={post.author} size={40} className="shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <span id={`feed-post-${post.id}-author`} className="truncate text-[14.5px] font-semibold">{userName(post.author)}</span>
            {roleLabel(post.authorRole) && <span className="rounded-full border border-[var(--w-border-strong)] px-1.5 text-[11px] leading-[17px] text-[var(--w-text-2)]">{roleLabel(post.authorRole)}</span>}
            {post.pinned && <span className="inline-flex items-center gap-0.5 rounded-full bg-[var(--w-accent-soft)] px-1.5 text-[11px] font-medium leading-[18px] text-[var(--w-accent-text)]"><Pin size={10} />{wt('feed.pinned')}</span>}
          </div>
          <div className="mt-0.5 flex min-w-0 flex-wrap items-center gap-x-1.5 text-[12.5px] text-[var(--w-text-3)]">
            <Link href={scopeHref} className="inline-flex min-w-0 items-center gap-1 font-medium text-[var(--w-text-2)] hover:underline">
              {post.project ? <ProjectMark k={post.project.key} size={14} /> : null}
              <span className="truncate">{post.project ? post.project.name : `${post.workspace.name}`}</span>
            </Link>
            {!post.project && <span className="rounded-[4px] bg-[var(--w-sunken)] px-1 text-[10.5px] font-medium uppercase tracking-wide">{wt('feed.workspaceBadge')}</span>}
            <span aria-hidden="true">·</span>
            <Link href={postHref} onClick={(e) => { if (onOpenDetail && !e.metaKey && !e.ctrlKey) { e.preventDefault(); onOpenDetail(post.id); } }} className="hover:underline">
              <time dateTime={post.createdAt} title={wfmt.dateTime(post.createdAt)}>{wfmt.relative(post.createdAt)}</time>
            </Link>
            {post.editedAt && <><span aria-hidden="true">·</span><span title={wfmt.dateTime(post.editedAt)}>{wt('feed.edited')}</span></>}
          </div>
        </div>
        <button ref={menuBtn} type="button" className="w-btn w-btn-ghost w-btn-icon -mr-1.5 shrink-0" aria-label={wt('feed.more')} aria-haspopup="menu" aria-expanded={menu} onClick={() => setMenu((o) => !o)}>
          <MoreHorizontal size={17} />
        </button>
        <Popover open={menu} onClose={() => setMenu(false)} anchorRef={menuBtn} width={230} align="end">
          <div role="menu" className="p-1 text-[13px]">
            <MenuItem onClick={() => { setMenu(false); void save(); }}>{post.saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}{post.saved ? wt('feed.saved') : wt('feed.save')}</MenuItem>
            <MenuItem onClick={() => { setMenu(false); void copy(); }}><Link2 size={14} />{wt('feed.copyLink')}</MenuItem>
            {post.can.edit && <MenuItem onClick={() => { setMenu(false); setEditing(true); }}>{wt('feed.editPost')}</MenuItem>}
            {(post.can.edit || post.can.moderate) && (
              <MenuItem onClick={() => { setMenu(false); void act(() => feedApi.update(post.id, { commentsOff: !post.commentsOff })); }}>
                {post.commentsOff ? wt('feed.commentsOnToggle') : wt('feed.commentsOffToggle')}
              </MenuItem>
            )}
            {post.can.pin && <MenuItem onClick={() => { setMenu(false); void act(() => feedApi.pin(post.id, !post.pinned), post.pinned ? wt('feed.unpinnedToast') : wt('feed.pinnedToast')).then(() => qc.invalidateQueries({ queryKey: ['work', 'feed', 'list'] })); }}><Pin size={14} />{post.pinned ? wt('feed.unpin') : wt('feed.pin')}</MenuItem>}
            {!post.hiddenForMe && post.can.report && <MenuItem onClick={() => { setMenu(false); void act(() => feedApi.hide(post.id, true), wt('feed.hiddenToast'), 'drop'); }}><EyeOff size={14} />{wt('feed.hidePost')}</MenuItem>}
            {post.can.report && <MenuItem onClick={() => { setMenu(false); onReport({ kind: 'post', id: post.id }); }}>{wt('feed.reportPost')}</MenuItem>}
            {post.can.moderate && !post.can.edit && <MenuItem onClick={() => { setMenu(false); void act(() => feedApi.moderate(post.id, !post.hidden), post.hidden ? wt('feed.restoredToast') : wt('feed.removedToast')); }}>{post.hidden ? wt('feed.restoreAdmin') : wt('feed.removeAdmin')}</MenuItem>}
            {post.can.delete && <MenuItem danger onClick={() => { setMenu(false); if (window.confirm(wt('feed.deleteConfirm'))) void act(() => feedApi.remove(post.id), wt('feed.deleted'), 'drop'); }}>{wt('feed.deletePost')}</MenuItem>}
          </div>
        </Popover>
      </header>

      {editing ? (
        <div className="mx-4 mb-3 rounded-[10px] border border-[var(--w-accent-border)] p-2.5">
          <MentionTextarea value={draft} onChange={setDraft} scope={{ workspaceId: post.workspace.id, projectId: post.project?.id ?? null }} ariaLabel={wt('feed.editingPost')} autoFocus minRows={3} maxRows={18} maxLength={FEED_BODY_MAX + 100}
            onSubmit={saveEdit} onEscape={() => setEditing(false)} />
          <div className="mt-2 flex justify-end gap-1.5">
            <button type="button" className="w-btn w-btn-sm" onClick={() => setEditing(false)}>{wt('feed.cancel')}</button>
            <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={saveEdit}>{wt('feed.saveChanges')}</button>
          </div>
        </div>
      ) : post.body ? (
        <div className="px-4 pb-3">
          <div className={cn(!expanded && long && 'relative max-h-[220px] overflow-hidden')}>
            <FeedMarkdown text={post.body} known={known} meUsername={me?.username} onTag={onTag} className="text-[14.5px]" />
            {!expanded && long && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--w-raised)] to-transparent" />}
          </div>
          {long && <button type="button" className="mt-1 text-[13px] font-semibold text-[var(--w-text-2)] hover:underline" onClick={() => setExpanded((e) => !e)}>{expanded ? wt('feed.seeLess') : wt('feed.seeMore')}</button>}
        </div>
      ) : null}

      <div className="grid gap-2.5 pb-3 empty:hidden">
        {media.length > 0 && <MediaGrid media={media} onOpen={(i) => xem.mo(files4viewer(media), i)} />}
        {files.length > 0 && <FileList files={files} onOpen={(i) => xem.mo(files4viewer(files), i)} />}
        {post.poll && <PollView poll={post.poll} onVote={vote} busy={voteBusy} />}
        {post.linkPreview && <LinkCard p={post.linkPreview} />}
        {post.refs.length > 0 && <RefCards refs={post.refs} />}
      </div>

      {(post.reactionCount > 0 || post.commentCount > 0) && (
        <div className="flex items-center gap-3 px-4 pb-2 text-[13px] text-[var(--w-text-2)]">
          <ReactionSummary reactions={post.reactions} total={post.reactionCount} onOpen={() => setWho(true)} />
          {post.commentCount > 0 && (
            <button type="button" className="ml-auto hover:underline" onClick={() => (onOpenDetail && !detail ? onOpenDetail(post.id) : setComposerSignal((n) => n + 1))}>
              {wt('feed.nComments', { count: post.commentCount })}
            </button>
          )}
        </div>
      )}

      <div className="mx-2 flex items-center gap-1 border-t border-[var(--w-border)] py-1">
        <ReactionButton mine={post.myReaction} onReact={react} disabled={!post.can.react} />
        <button type="button" className="flex h-9 flex-1 items-center justify-center gap-2 rounded-[8px] text-[13.5px] font-medium text-[var(--w-text-2)] hover:bg-[var(--w-hover)] disabled:opacity-50" disabled={!post.can.comment} onClick={() => setComposerSignal((n) => n + 1)}>
          <MessageCircle size={16} /> <span>{wt('feed.comment')}</span>
        </button>
        <button type="button" aria-pressed={post.saved} className={cn('flex h-9 flex-1 items-center justify-center gap-2 rounded-[8px] text-[13.5px] font-medium hover:bg-[var(--w-hover)]', post.saved ? 'text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)]')} onClick={() => void save()}>
          {post.saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />} <span className="max-[420px]:hidden">{post.saved ? wt('feed.saved') : wt('feed.save')}</span>
        </button>
        <button type="button" className="flex h-9 flex-1 items-center justify-center gap-2 rounded-[8px] text-[13.5px] font-medium text-[var(--w-text-2)] hover:bg-[var(--w-hover)]" onClick={() => void copy()}>
          <Link2 size={16} /> <span className="max-[420px]:hidden">{wt('feed.share')}</span>
        </button>
      </div>

      <CommentsSection post={post} full={detail} composerSignal={composerSignal} highlight={highlightComment} onReport={onReport} />
      <WhoReactedDialog postId={post.id} open={who} onClose={() => setWho(false)} reactions={post.reactions} />
      {xem.khung}
    </article>
  );
}

/** Khung xương lúc tải. */
export function PostSkeleton() {
  return (
    <div className="w-card animate-pulse p-4" aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-[var(--w-sunken)]" />
        <div className="flex-1 space-y-2"><div className="h-3 w-40 rounded bg-[var(--w-sunken)]" /><div className="h-2.5 w-28 rounded bg-[var(--w-sunken)]" /></div>
      </div>
      <div className="mt-4 space-y-2"><div className="h-3 w-full rounded bg-[var(--w-sunken)]" /><div className="h-3 w-5/6 rounded bg-[var(--w-sunken)]" /><div className="h-3 w-2/3 rounded bg-[var(--w-sunken)]" /></div>
      <div className="mt-4 h-48 rounded-[8px] bg-[var(--w-sunken)]" />
    </div>
  );
}
