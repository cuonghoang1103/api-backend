'use client';

// VideoCommentsSheet — bottom sheet of comments for the /feed/video
// reel. Reuses the existing socialStore comment plumbing (loadComments,
// addOptimisticComment) and socialApi.createComment, mirroring
// TheaterMode's comment column but as a mobile-first sheet.

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import type { SocialPost } from '@/types/social';
import { useSocialStore } from '@/store/socialStore';
import { formatRelative } from '@/lib/formatDate';
import { socialApi } from '@/lib/api';

export default function VideoCommentsSheet({
  post, onClose, onCommentAdded,
}: {
  post: SocialPost;
  onClose: () => void;
  onCommentAdded: () => void;
}) {
  const { commentsByPost, loadComments, isLoadingComments, addOptimisticComment } = useSocialStore((s) => ({
    commentsByPost: s.commentsByPost,
    loadComments: s.loadComments,
    isLoadingComments: s.isLoadingComments,
    addOptimisticComment: s.addOptimisticComment,
  }));
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const comments = commentsByPost[post.id] ?? [];
  const loading = isLoadingComments[post.id] ?? false;

  useEffect(() => {
    void loadComments(post.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || submitting) return;
    setSubmitting(true);
    const tempId = Date.now();
    addOptimisticComment(post.id, {
      id: tempId,
      postId: post.id,
      content: draft,
      likesCount: 0,
      repliesCount: 0,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: { id: 0, username: 'You', fullName: 'You', avatarUrl: null },
      isLiked: false,
      replies: [],
    });
    setDraft('');
    onCommentAdded();
    try {
      await socialApi.createComment({ postId: post.id, content: draft });
    } catch {
      /* optimistic — errors are non-fatal here */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="sheet-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[210] flex items-end bg-black/50"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          className="flex max-h-[75dvh] w-full flex-col rounded-t-2xl bg-[#0c0f14] ring-1 ring-white/10"
          role="dialog"
          aria-label="Bình luận"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-sm font-semibold text-white">
              Bình luận ({post.commentsCount ?? 0})
            </span>
            <button onClick={onClose} aria-label="Đóng" className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-3">
            {loading && comments.length === 0 && <p className="text-center text-sm text-white/40">Đang tải…</p>}
            {!loading && comments.length === 0 && (
              <p className="py-8 text-center text-sm text-white/40">Chưa có bình luận — hãy là người đầu tiên.</p>
            )}
            {comments.map((c) => {
              const u = (c as { user?: { displayName?: string; fullName?: string; username?: string; avatarUrl?: string | null } }).user ?? {};
              const display = u.displayName || u.fullName || u.username || 'Người dùng';
              return (
                <div key={c.id} className="flex items-start gap-2.5">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-xs font-bold text-white/70">
                    {u.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={u.avatarUrl} alt={display} className="h-full w-full object-cover" />
                    ) : (
                      display.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white/90">{display}</p>
                    <p className="break-words text-sm text-white/80">{c.content}</p>
                    <p className="mt-0.5 text-[10px] text-white/40">{formatRelative(c.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 p-3" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Viết bình luận…"
              // text-base (16px) avoids iOS focus zoom.
              className="flex-1 rounded-full bg-white/5 px-4 py-2 text-base text-white placeholder-white/40 outline-none focus:bg-white/10"
            />
            <button
              type="submit"
              disabled={!draft.trim() || submitting}
              aria-label="Gửi"
              className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-neon-violet text-white disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
