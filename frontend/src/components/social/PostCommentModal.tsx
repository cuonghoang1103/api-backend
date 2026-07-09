'use client';

// PostCommentModal — Facebook-style comment experience.
//
// Mounted ONCE in the root layout. It is fully store-driven: it
// reads `commentModalPostId` from the social store and renders
// itself whenever a post's "Bình luận" button (or a ?comment=N
// deep-link) opens it. When the post isn't already in the feed
// (deep-links, shared links) it fetches it via socialApi.getPost.
//
// Layout is responsive from ONE component:
//   • mobile (<md): full-screen sheet, header with a back arrow,
//     comment list scrolls, composer pinned to the bottom (lifted
//     by the keyboard inset while typing).
//   • desktop (md+): centered dialog over a dimmed backdrop, header
//     with a centered title + X, composer pinned inside the panel.
//
// The whole post body (author, text, media, reactions, action row,
// comment LIST) is reused from <PostCard detailMode /> so we never
// duplicate rendering logic — the modal only adds the chrome + the
// pinned composer.

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { useSocialStore } from '@/store/socialStore';
import { socialApi } from '@/lib/api';
import { PostCard } from '@/components/social/PostCard';
import CommentComposer from '@/components/social/CommentComposer';
import { useKeyboardInset } from '@/hooks/useKeyboardInset';
import type { SocialPost } from '@/types/social';

export default function PostCommentModal() {
  const postId = useSocialStore((s) => s.commentModalPostId);
  return (
    <AnimatePresence>
      {postId != null && <ModalContent key={postId} postId={postId} />}
    </AnimatePresence>
  );
}

function ModalContent({ postId }: { postId: number }) {
  const closeCommentModal = useSocialStore((s) => s.closeCommentModal);
  const loadComments = useSocialStore((s) => s.loadComments);
  const focusCommentId = useSocialStore((s) => s.commentModalFocusCommentId);
  // The post from the live feed store (kept reactive so reactions /
  // comment counts update while the modal is open).
  const storedPost = useSocialStore((s) => s.posts.find((p) => p.id === postId));

  // Fallback copy fetched from the API when the post isn't in the
  // feed (deep-link / shared post link).
  const [fetchedPost, setFetchedPost] = useState<SocialPost | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);

  const post = storedPost ?? fetchedPost;

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const keyboardInset = useKeyboardInset();

  // ── Load comments (+ post if missing) on open ────────────────
  useEffect(() => {
    void loadComments(postId, true);
    if (!storedPost) {
      setLoadingPost(true);
      socialApi
        .getPost(postId)
        .then((res) => {
          // The backend wraps the post in an envelope { success,
          // data }, but some paths return it bare — accept both.
          const env: any = res.data;
          const p: SocialPost = env && env.data ? env.data : env;
          setFetchedPost(p ?? null);
        })
        .catch(() => setFetchedPost(null))
        .finally(() => setLoadingPost(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // ── Scroll-lock the body while open (mirror TheaterMode) ─────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ── Escape closes ────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCommentModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeCommentModal]);

  // ── Scroll to the focused comment (deep-link) once mounted ───
  useEffect(() => {
    if (!focusCommentId || !post) return;
    // Wait two frames for the comment list to mount inside PostCard.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = scrollRef.current?.querySelector<HTMLElement>(
          `[data-comment-id="${focusCommentId}"]`,
        );
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.classList.add('ring-2', 'ring-violet-500/60', 'rounded-2xl', 'transition');
          window.setTimeout(() => {
            target.classList.remove('ring-2', 'ring-violet-500/60', 'rounded-2xl');
          }, 2400);
        }
      });
    });
    return () => cancelAnimationFrame(raf);
    // Re-run when comments arrive (post reference changes) so a
    // late-loading list still gets scrolled.
  }, [focusCommentId, post, post?.commentsCount]);

  const authorName =
    post?.author?.displayName || post?.author?.fullName || post?.author?.username || 'Người dùng';

  const body = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      // MOBILE: opaque full-screen (bg-primary), so it can NEVER look blank.
      // DESKTOP (md+): dimmed backdrop + centered dialog. ONE plain fading
      // layer — no slide/scale that could get "stuck" off-screen on mobile.
      className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-[var(--bg-primary)] md:items-center md:justify-center md:bg-black/60 md:p-4 md:backdrop-blur-sm"
      style={keyboardInset > 0 ? { bottom: keyboardInset } : undefined}
      onMouseDown={(e) => {
        // Only the dimmed desktop backdrop closes on click; the panel
        // stops propagation so taps inside never close it.
        if (e.target === e.currentTarget) closeCommentModal();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Bình luận — ${authorName}`}
        onMouseDown={(e) => e.stopPropagation()}
        className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[var(--bg-primary)] md:h-auto md:max-h-[90vh] md:max-w-[600px] md:rounded-2xl md:shadow-2xl"
      >
        {/* ── Header ──────────────────────────────────────────── */}
        <div
          className="sticky top-0 z-10 flex items-center gap-2 border-b px-3 py-3"
          style={{
            borderColor: 'var(--border-color)',
            background: 'var(--bg-surface)',
            paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          }}
        >
          {/* Mobile: back arrow (left). Desktop: hidden. */}
          <button
            type="button"
            onClick={closeCommentModal}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full hover:bg-[var(--bg-surface-hover)] md:hidden"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Quay lại"
          >
            <ArrowLeft size={20} />
          </button>

          <h2
            className="flex-1 truncate text-center text-sm font-semibold md:text-base"
            style={{ color: 'var(--text-primary)' }}
          >
            <span className="md:hidden">Bình luận</span>
            <span className="hidden md:inline">Bài viết của {authorName}</span>
          </h2>

          {/* Desktop: X (right). Mobile: spacer to keep title centered. */}
          <button
            type="button"
            onClick={closeCommentModal}
            className="hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-full hover:bg-[var(--bg-surface-hover)] md:flex"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
          <span className="h-9 w-9 flex-shrink-0 md:hidden" aria-hidden="true" />
        </div>

        {/* ── Scrollable body: the whole post + comment list ──── */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
          {post ? (
            <PostCard post={post} detailMode />
          ) : (
            <div className="flex h-40 items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>
              {loadingPost ? 'Đang tải bài viết…' : 'Không tìm thấy bài viết.'}
            </div>
          )}
        </div>

        {/* ── Pinned composer (never auto-focuses → no phantom keyboard) ── */}
        {post && <CommentComposer postId={post.id} autoFocus={false} />}
      </div>
    </motion.div>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(body, document.body);
}
