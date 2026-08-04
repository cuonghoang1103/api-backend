'use client';

import { useState } from 'react';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { blogApi } from '@/lib/api';
import type { BlogComment } from '@/types';
import SafeAvatar from '@/components/ui/SafeAvatar';

/**
 * Comment thread for a resource post.
 *
 * Seeded from the server render (`initial`), so the existing thread is in
 * the HTML — it is real content and crawlers should see it. Only posting a
 * new comment needs the client.
 *
 * The old terminal-window UI called this "TECHNICAL EXCHANGE" and pinned it
 * to a narrow right-hand rail. It is a comment thread; it now looks like one.
 */
export default function PostComments({
  postId,
  initial,
}: {
  postId: number;
  initial: BlogComment[];
}) {
  const [comments, setComments] = useState<BlogComment[]>(initial);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await blogApi.addComment(postId, {
        userName: name.trim() || 'Anonymous',
        commentText: text.trim(),
      });
      if (res.data?.success && res.data.data) {
        setComments((prev) => [res.data.data as BlogComment, ...prev]);
        setText('');
        setName('');
      }
    } catch {
      setError('Không gửi được bình luận. Thử lại nhé.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-14 border-t border-darkborder pt-10">
      <div className="mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-neon-violet" />
        <h2 className="font-heading text-xl font-semibold text-text-primary">
          Thảo luận
        </h2>
        <span className="rounded-md bg-white/[0.06] px-2 py-0.5 text-xs tabular-nums text-text-muted">
          {comments.length}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-darkborder bg-darkcard/60 p-4 sm:p-5">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tên của bạn (không bắt buộc)"
          className="mb-3 w-full rounded-xl border border-darkborder bg-white/[0.04] px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none focus:ring-2 focus:ring-neon-violet/20"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Góp ý, hỏi thêm, hoặc báo lỗi trong bài…"
          className="w-full resize-y rounded-xl border border-darkborder bg-white/[0.04] px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none focus:ring-2 focus:ring-neon-violet/20"
        />
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!text.trim() || submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-indigo to-neon-violet px-4 py-2 text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-40"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Gửi bình luận
          </button>
        </div>
      </form>

      {comments.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-darkborder py-10 text-center text-sm text-text-muted">
          Chưa có bình luận nào. Mở màn nhé.
        </p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-3 rounded-2xl border border-darkborder bg-darkcard/50 p-4">
              <SafeAvatar src={c.userAvatar} alt={c.userName} seed={c.userName} size={36} rounded="full" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-sm font-semibold text-text-primary">{c.userName}</span>
                  <span className="text-[11px] text-text-muted">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                  {c.commentText}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' });
}
