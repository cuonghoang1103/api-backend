'use client';

/**
 * ArticleComments — reader comments on the article detail page.
 *
 * Read is public; posting/liking requires login. Flat list with one level of
 * replies. Likes toggle optimistically. Users can edit/delete their own
 * comments (the server also lets admins delete for moderation).
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Heart, MessageSquare, Loader2, Pencil, Trash2, Send, X } from 'lucide-react';
import { techTrendsApi, type TechTrendComment } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

function timeAgo(iso: string): string {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'vừa xong';
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`;
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`;
  if (s < 604800) return `${Math.floor(s / 86400)} ngày trước`;
  try { return new Date(iso).toLocaleDateString('vi-VN'); } catch { return ''; }
}

function name(a: TechTrendComment['author']): string {
  return a.displayName || a.fullName || a.username || 'Người dùng';
}

function errMsg(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

export default function ArticleComments({ articleId }: { articleId: number }) {
  const user = useAuthStore((s) => s.user);
  const isAuthed = useAuthStore((s) => s.isAuthenticated);
  const myId = user?.id ? Number(user.id) : null;

  const [comments, setComments] = useState<TechTrendComment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [draft, setDraft] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const r = await techTrendsApi.listComments(articleId);
      setComments(r.data.data.comments);
      setTotal(r.data.data.total);
    } catch {
      /* leave empty */
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => { load(); }, [load]);

  const post = async (content: string, parentId: number | null, after?: () => void) => {
    if (!content.trim()) return;
    setPosting(true);
    try {
      await techTrendsApi.addComment(articleId, content.trim(), parentId);
      after?.();
      await load();
    } catch (err) {
      toast.error(errMsg(err, 'Gửi bình luận thất bại'));
    } finally {
      setPosting(false);
    }
  };

  return (
    <section id="comments" className="mt-16 pt-10 border-t border-darkborder">
      <h2 className="text-xl font-heading font-semibold text-text-primary mb-5 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-neon-violet" /> Bình luận
        {total > 0 && <span className="text-sm text-text-muted font-normal">({total})</span>}
      </h2>

      {/* Composer */}
      {isAuthed ? (
        <div className="flex gap-3 mb-8">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={2}
            placeholder="Viết bình luận…"
            className="flex-1 px-3 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 focus:ring-2 focus:ring-neon-violet/15 resize-y transition-all"
          />
          <button
            onClick={() => post(draft, null, () => setDraft(''))}
            disabled={posting || !draft.trim()}
            className="self-end inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-semibold shadow-neon hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shrink-0"
          >
            {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Gửi
          </button>
        </div>
      ) : (
        <div className="mb-8 rounded-xl border border-darkborder bg-darkcard/60 px-4 py-3 text-sm text-text-secondary">
          <Link href="/login" className="text-neon-violet hover:underline">Đăng nhập</Link> để tham gia bình luận.
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 text-text-muted text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải bình luận…</div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-text-muted">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
      ) : (
        <ul className="space-y-6">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} myId={myId} isAuthed={isAuthed} onChanged={load} onReply={post} posting={posting} />
          ))}
        </ul>
      )}
    </section>
  );
}

function CommentItem({
  comment, myId, isAuthed, onChanged, onReply, posting,
}: {
  comment: TechTrendComment;
  myId: number | null;
  isAuthed: boolean;
  onChanged: () => void;
  onReply: (content: string, parentId: number | null, after?: () => void) => void;
  posting: boolean;
  isReply?: boolean;
}) {
  const [liked, setLiked] = useState(comment.likedByMe);
  const [likes, setLikes] = useState(comment.likesCount);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);

  const mine = myId != null && comment.author.id === myId;

  const toggleLike = async () => {
    if (!isAuthed) { toast.error('Đăng nhập để thích bình luận'); return; }
    // optimistic
    setLiked((v) => !v);
    setLikes((n) => n + (liked ? -1 : 1));
    try {
      const r = await techTrendsApi.likeComment(comment.id);
      setLiked(r.data.data.liked);
      setLikes(r.data.data.likesCount);
    } catch (err) {
      setLiked(comment.likedByMe);
      setLikes(comment.likesCount);
      toast.error(errMsg(err, 'Không thể thích'));
    }
  };

  const saveEdit = async () => {
    if (!editText.trim()) return;
    try {
      await techTrendsApi.editComment(comment.id, editText.trim());
      setEditing(false);
      onChanged();
    } catch (err) {
      toast.error(errMsg(err, 'Sửa thất bại'));
    }
  };

  const remove = async () => {
    if (!window.confirm('Xoá bình luận này?')) return;
    try {
      await techTrendsApi.deleteComment(comment.id);
      onChanged();
    } catch (err) {
      toast.error(errMsg(err, 'Xoá thất bại'));
    }
  };

  return (
    <li className="flex gap-3">
      {comment.author.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={comment.author.avatarUrl} alt={name(comment.author)} className="w-9 h-9 rounded-full object-cover shrink-0" />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center text-xs font-bold text-white shrink-0">
          {name(comment.author).slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-darkcard/60 border border-darkborder px-3.5 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-text-primary">{name(comment.author)}</span>
            <span className="text-[11px] text-text-muted">{timeAgo(comment.createdAt)}{comment.isEdited ? ' · đã sửa' : ''}</span>
          </div>
          {editing ? (
            <div className="mt-2 flex gap-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={2}
                className="flex-1 px-2.5 py-1.5 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 resize-y"
              />
              <div className="flex flex-col gap-1">
                <button onClick={saveEdit} className="p-1.5 rounded-lg bg-neon-violet/20 text-neon-violet hover:bg-neon-violet/30"><Send className="w-3.5 h-3.5" /></button>
                <button onClick={() => { setEditing(false); setEditText(comment.content); }} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap break-words">{comment.content}</p>
          )}
        </div>

        {/* actions */}
        <div className="flex items-center gap-3 mt-1.5 pl-1 text-[11px] text-text-muted">
          <button onClick={toggleLike} className={['inline-flex items-center gap-1 hover:text-neon-red transition-colors', liked ? 'text-neon-red' : ''].join(' ')}>
            <Heart className={['w-3.5 h-3.5', liked ? 'fill-current' : ''].join(' ')} /> {likes > 0 ? likes : ''} Thích
          </button>
          {isAuthed && !comment.parentId && (
            <button onClick={() => setReplying((v) => !v)} className="hover:text-neon-violet transition-colors">Trả lời</button>
          )}
          {mine && !editing && (
            <>
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1 hover:text-text-primary transition-colors"><Pencil className="w-3 h-3" /> Sửa</button>
              <button onClick={remove} className="inline-flex items-center gap-1 hover:text-neon-red transition-colors"><Trash2 className="w-3 h-3" /> Xoá</button>
            </>
          )}
        </div>

        {/* reply composer */}
        {replying && (
          <div className="flex gap-2 mt-2">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') onReply(replyText, comment.id, () => { setReplyText(''); setReplying(false); }); }}
              placeholder={`Trả lời ${name(comment.author)}…`}
              className="flex-1 min-w-0 px-3 py-2 bg-darkcard border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50"
            />
            <button
              onClick={() => onReply(replyText, comment.id, () => { setReplyText(''); setReplying(false); })}
              disabled={posting || !replyText.trim()}
              className="px-3 py-2 rounded-lg bg-neon-violet/20 text-neon-violet text-xs font-semibold hover:bg-neon-violet/30 disabled:opacity-50 shrink-0"
            >
              Gửi
            </button>
          </div>
        )}

        {/* replies */}
        {comment.replies.length > 0 && (
          <ul className="mt-3 space-y-4 pl-2 border-l border-darkborder">
            {comment.replies.map((r) => (
              <CommentItem key={r.id} comment={r} myId={myId} isAuthed={isAuthed} onChanged={onChanged} onReply={onReply} posting={posting} isReply />
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}
