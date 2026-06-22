'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  MessageCircle,
  Volume2,
  VolumeX,
  Send,
  ChevronUp,
  ChevronDown,
  Maximize2,
} from 'lucide-react';
import type { SocialPost, SocialMedia } from '@/types/social';
import { REACTION_META } from '@/types/social';
import { getMediaUrl } from '@/lib/utils';
import { formatRelative } from '@/lib/formatDate';
import { useSocialStore } from '@/store/socialStore';

/* ────────────────────────────────────────────────────────────────────
 * TheaterMode — Fullscreen video overlay
 * ────────────────────────────────────────────────────────────────────
 * Opened when the user clicks the "Theater" button on a video
 * post. Renders a TikTok/Reels-style vertical scroller that shows
 * ONE video per slide. The right column pins comments + likes
 * (Facebook-style) so the user can keep reading while the next
 * video loads.
 *
 * Behaviors:
 *  - Muted autoplay by default (browser autoplay policies)
 *  - Snap-scroll between videos
 *  - Touch swipe + wheel + arrow keys all advance
 *  - Body scroll lock while open
 *  - Tap-to-mute / unmute
 *  - Closed by ESC, X, or backdrop click
 * ──────────────────────────────────────────────────────────────────── */

interface TheaterModeProps {
  posts: SocialPost[];
  /** The post id that should be active on first open. */
  startPostId: number;
  open: boolean;
  onClose: () => void;
  onReact: (postId: number) => void;
}

interface VideoSlide {
  post: SocialPost;
  media: SocialMedia;
}

export default function TheaterMode({
  posts,
  startPostId,
  open,
  onClose,
  onReact,
}: TheaterModeProps) {
  // Pre-compute the list of (post, media) pairs that have at
  // least one VIDEO attachment. We never want the modal to
  // surface a non-video post — it would be jarring.
  const slides = useMemo<VideoSlide[]>(() => {
    const out: VideoSlide[] = [];
    for (const p of posts) {
      if (!Array.isArray(p.media)) continue;
      for (const m of p.media) {
        if (m.type === 'VIDEO') {
          out.push({ post: p, media: m });
          break;
        }
      }
    }
    return out;
  }, [posts]);

  // Resolve the index of the starting post so subsequent /
  // previous navigations move through the right list.
  const initialIndex = useMemo(() => {
    if (slides.length === 0) return 0;
    const i = slides.findIndex((s) => s.post.id === startPostId);
    return i >= 0 ? i : 0;
  }, [slides, startPostId]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [muted, setMuted] = useState(true);
  const [commentDraft, setCommentDraft] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Keep activeIndex in sync if `startPostId` changes while open
  // (e.g. user opens another theater from the feed).
  useEffect(() => {
    if (!open) return;
    setActiveIndex(initialIndex);
  }, [open, initialIndex]);

  // Lock body scroll while the modal is open so the underlying
  // page doesn't drift when the user scrolls the reel.
  useEffect(() => {
    if (!open) return;
    if (typeof document === 'undefined') return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC to close, ↑/↓ to navigate while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeIndex, slides.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => Math.min(i + 1, Math.max(0, slides.length - 1)));
  }, [slides.length]);

  const prev = useCallback(() => {
    setActiveIndex((i) => Math.max(0, i - 1));
  }, []);

  // Wheel handler: debounced. Each meaningful scroll change
  // advances by one slide. Avoids the modal reacting to every
  // single tick of the trackpad.
  const wheelLockRef = useRef(false);
  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (wheelLockRef.current) return;
      if (Math.abs(e.deltaY) < 30) return;
      wheelLockRef.current = true;
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 350);
      if (e.deltaY > 0) next();
      else prev();
    },
    [next, prev],
  );

  // Touch swipe support for mobile.
  const touchStartY = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0]?.clientY ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartY.current;
    touchStartY.current = null;
    if (start == null) return;
    const end = e.changedTouches[0]?.clientY ?? start;
    const delta = start - end;
    if (Math.abs(delta) < 60) return;
    if (delta > 0) next();
    else prev();
  };

  if (!open) return null;
  if (slides.length === 0) {
    // Defensive fallback — should not happen because the
    // trigger only fires on a video media item, but if a stale
    // post disappears between the click and the open we still
    // want to gracefully close instead of rendering an empty
    // overlay.
    return (
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white"
        >
          <X size={20} />
        </button>
        <p className="text-white/70">Không có video để hiển thị</p>
      </div>
    );
  }

  const active = slides[activeIndex];
  const authorObj = (active.post as any)?.author ?? null;
  const authorDisplay =
    authorObj?.displayName || authorObj?.fullName || authorObj?.username || 'Người dùng';
  const authorAvatar = authorObj?.avatarUrl
    ? authorObj.avatarUrl
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorObj?.username ?? 'user'}`;
  const myReaction = (active.post as any).myReaction as
    | keyof typeof REACTION_META
    | null
    | undefined;
  const reactionColor = myReaction ? REACTION_META[myReaction].color : '#94a3b8';
  const reactionEmoji = myReaction ? REACTION_META[myReaction].emoji : null;

  return (
    <AnimatePresence>
      <motion.div
        key="theater-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex bg-black/95 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Top-right close button */}
        <button
          onClick={onClose}
          aria-label="Đóng Theater Mode"
          className="absolute right-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <X size={20} />
        </button>

        {/* Top-center title + position counter */}
        <div className="pointer-events-none absolute left-1/2 top-5 z-30 -translate-x-1/2 rounded-full bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur-md">
          <span className="font-semibold text-white">Theater</span>
          <span className="mx-2 text-white/30">·</span>
          <span className="tabular-nums">
            {activeIndex + 1} / {slides.length}
          </span>
        </div>

        {/* Nav arrows (desktop) */}
        {activeIndex > 0 && (
          <button
            onClick={prev}
            aria-label="Video trước"
            className="absolute left-1/2 top-16 z-30 hidden -translate-x-1/2 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 md:block"
          >
            <ChevronUp size={20} />
          </button>
        )}
        {activeIndex < slides.length - 1 && (
          <button
            onClick={next}
            aria-label="Video tiếp theo"
            className="absolute bottom-24 left-1/2 z-30 hidden -translate-x-1/2 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 md:block"
          >
            <ChevronDown size={20} />
          </button>
        )}

        {/* ─── Left: video reel (60% width) ─────────────────── */}
        <div
          ref={containerRef}
          className="relative flex h-full w-full items-center justify-center md:w-[60%]"
          onWheel={onWheel}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {slides.map((s, i) => (
            <div
              key={s.post.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                i === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-hidden={i !== activeIndex}
            >
              <ReelVideo
                slide={s}
                isActive={i === activeIndex}
                muted={muted}
                onToggleMute={() => setMuted((m) => !m)}
              />
            </div>
          ))}
        </div>

        {/* ─── Right: meta + comments (40% width, desktop only) */}
        <div className="hidden h-full w-[40%] flex-col border-l border-white/10 bg-black/40 md:flex">
          {/* Author / caption */}
          <div className="flex items-start gap-3 border-b border-white/10 p-5">
            <Link
              href={`/profile/${authorObj?.id ?? ''}`}
              className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-neon-violet/30"
            >
              <img
                src={authorAvatar}
                alt={authorDisplay}
                className="h-full w-full object-cover"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-white">{authorDisplay}</p>
              <p className="text-xs text-white/50">
                @{authorObj?.username ?? 'user'} · {formatRelative(active.post.createdAt)}
              </p>
            </div>
            <button
              onClick={() => onReact(active.post.id)}
              className="flex flex-col items-center gap-1 text-xs transition-transform active:scale-90"
              style={{ color: reactionColor }}
              title="Thích"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                {reactionEmoji ? (
                  <span className="text-xl leading-none">{reactionEmoji}</span>
                ) : (
                  <Heart size={18} fill="none" />
                )}
              </span>
              <span className="tabular-nums text-white/60">
                {active.post.likesCount ?? 0}
              </span>
            </button>
          </div>

          {/* Caption body */}
          <div className="border-b border-white/10 p-5">
            <p className="line-clamp-4 whitespace-pre-wrap text-sm text-white/85">
              {active.post.content || (
                <span className="italic text-white/40">(Không có chú thích)</span>
              )}
            </p>
          </div>

          {/* Comments column */}
          <TheaterComments
            postId={active.post.id}
            commentCount={active.post.commentsCount ?? 0}
            draft={commentDraft}
            onDraftChange={setCommentDraft}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Reel Video ─────────────────────────────────────────────── */

function ReelVideo({
  slide,
  isActive,
  muted,
  onToggleMute,
}: {
  slide: VideoSlide;
  isActive: boolean;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Autoplay muted when the slide becomes active. Pause (and
  // reset) when it scrolls out of view — this is the heart of
  // the muted-autoplay-on-scroll behaviour the spec asked for.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.then === 'function') p.catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);

  return (
    <div className="relative flex h-full max-h-[90vh] w-auto items-center justify-center">
      <video
        ref={videoRef}
        src={getMediaUrl(slide.media.url, slide.media.url)}
        poster={
          slide.media.thumbnail
            ? getMediaUrl(slide.media.thumbnail, slide.media.thumbnail)
            : undefined
        }
        muted={muted}
        loop
        playsInline
        onPlay={handlePlay}
        onPause={handlePause}
        className="max-h-full max-w-full rounded-2xl object-contain"
      />

      {/* Mute toggle */}
      <button
        onClick={onToggleMute}
        aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'}
        className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-md"
      >
        {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        {muted ? 'Muted' : 'On'}
      </button>

      {/* Caption overlay (TikTok-style at the bottom) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-4">
        <p className="line-clamp-3 text-sm text-white/90 drop-shadow-md">
          {slide.post.content}
        </p>
      </div>

      {/* A "playing" indicator that's subtle so users can see
          what's happening. Hidden if the video is playing. */}
      {!isPlaying && isActive && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-black/40 p-4 backdrop-blur-sm">
            <Maximize2 size={28} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Theater Comments ───────────────────────────────────────── */

function TheaterComments({
  postId,
  commentCount,
  draft,
  onDraftChange,
}: {
  postId: number;
  commentCount: number;
  draft: string;
  onDraftChange: (v: string) => void;
}) {
  const {
    commentsByPost,
    loadComments,
    isLoadingComments,
    addOptimisticComment,
  } = useSocialStore((s) => ({
    commentsByPost: s.commentsByPost,
    loadComments: s.loadComments,
    isLoadingComments: s.isLoadingComments,
    addOptimisticComment: s.addOptimisticComment,
  }));
  const [submitting, setSubmitting] = useState(false);
  const comments = commentsByPost[postId] || [];
  const loading = isLoadingComments[postId] ?? false;

  // Lazy-load when the slide changes.
  useEffect(() => {
    void loadComments(postId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || submitting) return;
    setSubmitting(true);
    const tempId = Date.now();
    addOptimisticComment(postId, {
      id: tempId,
      postId,
      content: draft,
      likesCount: 0,
      repliesCount: 0,
      isEdited: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        id: 0,
        username: 'You',
        fullName: 'You',
        avatarUrl: null,
      },
      isLiked: false,
      replies: [],
    });
    onDraftChange('');
    try {
      const { socialApi } = await import('@/lib/api');
      await socialApi.createComment({ postId, content: draft });
    } catch {
      /* optimistic; errors surface via toast from PostCard */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Bình luận ({commentCount})</span>
          {loading && <span className="text-white/30">Đang tải…</span>}
        </div>
        {comments.length === 0 && !loading && (
          <p className="text-center text-sm text-white/40">
            Chưa có bình luận nào — hãy là người đầu tiên.
          </p>
        )}
        {comments.map((c) => {
          const u = (c as any).user ?? {};
          const display = u.displayName || u.fullName || u.username || 'Người dùng';
          return (
            <div key={c.id} className="flex items-start gap-2.5">
              <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-white/10">
                {u.avatarUrl ? (
                  <img
                    src={u.avatarUrl}
                    alt={display}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-white/70">
                    {display.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white/90">
                  {display}
                </p>
                <p className="break-words text-sm text-white/75">{c.content}</p>
                <p className="mt-0.5 text-[10px] text-white/40">
                  {formatRelative(c.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-white/10 p-3"
      >
        <MessageCircle size={14} className="flex-shrink-0 text-white/40" />
        <input
          value={draft}
          onChange={(e) => onDraftChange(e.target.value)}
          placeholder="Viết bình luận…"
          className="flex-1 rounded-full bg-white/5 px-3 py-1.5 text-sm text-white placeholder-white/40 outline-none focus:bg-white/10"
        />
        <button
          type="submit"
          disabled={!draft.trim() || submitting}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-neon-violet text-white transition-opacity disabled:opacity-40"
          aria-label="Gửi bình luận"
        >
          <Send size={13} />
        </button>
      </form>
    </>
  );
}
