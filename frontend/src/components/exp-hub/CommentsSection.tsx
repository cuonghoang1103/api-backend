'use client';

// CommentsSection — threaded reader comments + emoji reactions for an EXP_Hub
// entry. Reading is public; posting/reacting requires login; edit/delete is
// owner-only (admins may delete, enforced server-side). Theme-aware.

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { MessageSquare, Loader2, Pencil, Trash2, Send, X, CornerDownRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useTranslation } from '@/hooks/useTranslation';
import { snippetCommentsApi } from '@/lib/exp-hub-api';
import type { SnippetComment, SnippetCommentAuthor } from '@/types/exp-hub';
import { ReactionBar } from './ReactionBar';

function authorName(a: SnippetCommentAuthor | null, fallback: string): string {
  return a?.displayName || a?.fullName || a?.username || fallback;
}

function initial(a: SnippetCommentAuthor | null): string {
  return (authorName(a, '?').trim()[0] || '?').toUpperCase();
}

function errMsg(err: unknown, fallback: string): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;
}

export function CommentsSection({ snippetId }: { snippetId: number }) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const myId = user?.id ? Number(user.id) : null;

  const [comments, setComments] = useState<SnippetComment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [draft, setDraft] = useState('');

  const timeAgo = useCallback((iso: string): string => {
    const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    if (s < 60) return t('expHub.justNow');
    if (s < 3600) return `${Math.floor(s / 60)} ${t('expHub.minutesAgo')}`;
    if (s < 86400) return `${Math.floor(s / 3600)} ${t('expHub.hoursAgo')}`;
    if (s < 604800) return `${Math.floor(s / 86400)} ${t('expHub.daysAgo')}`;
    try { return new Date(iso).toLocaleDateString(); } catch { return ''; }
  }, [t]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await snippetCommentsApi.list(snippetId);
      setComments(r.data.data.comments);
      setTotal(r.data.data.total);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [snippetId]);

  useEffect(() => { load(); }, [load]);

  const post = async (content: string, parentId: number | null, after?: () => void) => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      await snippetCommentsApi.add(snippetId, content.trim(), parentId);
      after?.();
      await load();
    } catch (err) {
      toast.error(errMsg(err, t('expHub.postFail')));
    } finally {
      setPosting(false);
    }
  };

  return (
    <section id="exp-hub-comments" className="mt-8 border-t border-[var(--border-color)] pt-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)]">
        <MessageSquare className="h-5 w-5 text-violet-500" /> {t('expHub.comments')}
        {total > 0 && <span className="text-sm font-normal text-[var(--text-muted)]">({total})</span>}
      </h3>

      {/* Composer */}
      {isAuthed ? (
        <div className="mb-6 flex gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder={t('expHub.commentPlaceholder')}
            className="flex-1 resize-y rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-violet-400/50 focus:outline-none focus:ring-2 focus:ring-violet-500/15"
          />
          <button
            onClick={() => post(draft, null, () => setDraft(''))}
            disabled={posting || !draft.trim()}
            className="inline-flex shrink-0 items-center gap-1.5 self-end rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
          >
            {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {t('expHub.send')}
          </button>
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          <Link href="/login" className="text-violet-500 hover:underline dark:text-violet-300">{t('expHub.login')}</Link> — {t('expHub.loginToComment')}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><Loader2 className="h-4 w-4 animate-spin" /> {t('expHub.loadingComments')}</div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">{t('expHub.noComments')}</p>
      ) : (
        <ul className="space-y-5">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} myId={myId} isAuthed={isAuthed} onChanged={load} onReply={post} posting={posting} timeAgo={timeAgo} t={t} />
          ))}
        </ul>
      )}
    </section>
  );
}

function CommentItem({
  comment, myId, isAuthed, onChanged, onReply, posting, timeAgo, t, isReply = false,
}: {
  comment: SnippetComment;
  myId: number | null;
  isAuthed: boolean;
  onChanged: () => void;
  onReply: (content: string, parentId: number | null, after?: () => void) => void;
  posting: boolean;
  timeAgo: (iso: string) => string;
  t: (k: string) => string;
  isReply?: boolean;
}) {
  const [reactions, setReactions] = useState(comment.reactions);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  useEffect(() => { setReactions(comment.reactions); }, [comment.reactions]);

  const mine = myId != null && comment.author?.id === myId;

  const toggleReaction = async (emoji: string) => {
    if (!isAuthed) { toast.error(t('expHub.loginToReact')); return; }
    try {
      const r = await snippetCommentsApi.react(comment.id, emoji);
      setReactions(r.data.data.reactions);
    } catch (err) {
      toast.error(errMsg(err, t('expHub.reactFail')));
    }
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;
    try {
      await snippetCommentsApi.edit(comment.id, editText.trim());
      setEditing(false);
      onChanged();
    } catch (err) {
      toast.error(errMsg(err, t('expHub.editFail')));
    }
  };

  const remove = async () => {
    if (!window.confirm(t('expHub.deleteConfirm'))) return;
    try {
      await snippetCommentsApi.remove(comment.id);
      onChanged();
    } catch (err) {
      toast.error(errMsg(err, t('expHub.deleteFail')));
    }
  };

  return (
    <li className={isReply ? 'ml-6 border-l border-[var(--border-color)] pl-3' : ''}>
      <div className="flex gap-2.5">
        {/* Avatar */}
        {comment.author?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={comment.author.avatarUrl} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-600 dark:text-violet-300">
            {initial(comment.author)}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 text-sm">
            <span className="font-semibold text-[var(--text-primary)]">{authorName(comment.author, t('expHub.anonymous'))}</span>
            <span className="text-xs text-[var(--text-muted)]">{timeAgo(comment.createdAt)}</span>
            {comment.isEdited && <span className="text-xs text-[var(--text-muted)]">· {t('expHub.edited')}</span>}
          </div>

          {editing ? (
            <div className="mt-1.5">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="w-full resize-y rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-violet-400/50 focus:outline-none"
              />
              <div className="mt-1.5 flex gap-2">
                <button onClick={saveEdit} className="rounded-lg bg-violet-500 px-3 py-1 text-xs font-medium text-white hover:bg-violet-400">{t('expHub.commentSave')}</button>
                <button onClick={() => { setEditing(false); setEditText(comment.content); }} className="rounded-lg border border-[var(--border-color)] px-3 py-1 text-xs text-[var(--text-secondary)]">{t('expHub.cancel')}</button>
              </div>
            </div>
          ) : (
            <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-[var(--text-secondary)]">{comment.content}</p>
          )}

          {/* Actions row: reactions + reply/edit/delete */}
          {!editing && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <ReactionBar reactions={reactions} onToggle={toggleReaction} disabled={!isAuthed} compact />
              {!isReply && (
                <button onClick={() => { if (!isAuthed) { toast.error(t('expHub.loginToComment')); return; } setReplying((v) => !v); }} className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <CornerDownRight className="h-3.5 w-3.5" /> {t('expHub.reply')}
                </button>
              )}
              {mine && (
                <>
                  <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"><Pencil className="h-3.5 w-3.5" /> {t('expHub.editAction')}</button>
                  <button onClick={remove} className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /> {t('expHub.deleteAction')}</button>
                </>
              )}
            </div>
          )}

          {/* Reply composer */}
          {replying && (
            <div className="mt-2 flex gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={1}
                placeholder={t('expHub.commentPlaceholder')}
                className="flex-1 resize-y rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-sm text-[var(--text-primary)] focus:border-violet-400/50 focus:outline-none"
              />
              <button
                onClick={() => onReply(replyText, comment.id, () => { setReplyText(''); setReplying(false); })}
                disabled={posting || !replyText.trim()}
                className="inline-flex shrink-0 items-center gap-1 self-end rounded-lg bg-violet-500 px-3 py-2 text-xs font-medium text-white hover:bg-violet-400 disabled:opacity-50"
              >
                {posting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              </button>
              <button onClick={() => setReplying(false)} className="self-end rounded-lg border border-[var(--border-color)] p-2 text-[var(--text-muted)]"><X className="h-3.5 w-3.5" /></button>
            </div>
          )}

          {/* Replies */}
          {comment.replies?.length > 0 && (
            <ul className="mt-3 space-y-4">
              {comment.replies.map((r) => (
                <CommentItem key={r.id} comment={r} myId={myId} isAuthed={isAuthed} onChanged={onChanged} onReply={onReply} posting={posting} timeAgo={timeAgo} t={t} isReply />
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}
