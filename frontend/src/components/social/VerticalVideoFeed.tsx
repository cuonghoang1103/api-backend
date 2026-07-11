'use client';

// VerticalVideoFeed — the full-screen TikTok-style reel behind
// /feed/video. Built for performance:
//
//  • Native CSS scroll-snap vertical pager (one slide = 100dvh).
//  • A single IntersectionObserver marks the in-view slide active.
//  • ONLY the active slide mounts a real <video>/<iframe>; every other
//    slide renders a poster <img>. So at most ONE video decodes/plays
//    at a time — switching slides unmounts (and thus releases) the
//    previous player. This is the same guarantee TheaterMode relies on,
//    re-applied to a routed full-screen experience.
//  • No filter / backdrop-filter / transform on any video ancestor, so
//    the clip stays on the GPU-accelerated path (the cause of the
//    earlier ~10fps regression — see PostCard / page.tsx perf notes).
//
// Works with vertical swipe (mobile, native snap), mouse wheel, and
// ArrowUp/ArrowDown (desktop). Muted autoplay by default with an unmute
// toggle (browsers block unmuted autoplay).

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X, Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, Play, Loader2,
} from 'lucide-react';
import type { SocialPost } from '@/types/social';
import { socialApi } from '@/lib/api';
import { getMediaUrl } from '@/lib/utils';
import {
  getYouTubeId, isTikTokUrl, getTikTokId, firstVideoMedia, posterForPost,
} from '@/lib/videoEmbed';
import VideoCommentsSheet from '@/components/social/VideoCommentsSheet';

export default function VerticalVideoFeed({ startPostId, videoCategoryId }: { startPostId?: number; videoCategoryId?: number }) {
  const router = useRouter();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const [commentsForId, setCommentsForId] = useState<number | null>(null);

  const slideEls = useRef<Map<number, HTMLElement>>(new Map());
  const ioRef = useRef<IntersectionObserver | null>(null);
  const didInitialScroll = useRef(false);

  // ─── Initial load ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await socialApi.getFeed({ type: 'VIDEO', limit: 8, videoCategoryId });
        if (cancelled) return;
        let data = (res.data?.data ?? []) as SocialPost[];
        // Seed the reel on the requested post even when it isn't on the newest
        // page — e.g. opening a SAVED (older) video. Without this the viewer
        // fell back to data[0] (the newest video) and never showed the one the
        // user actually opened.
        if (startPostId && !data.some((p) => p.id === startPostId)) {
          try {
            const one = await socialApi.getPost(startPostId);
            if (cancelled) return;
            const post = ((one.data as { data?: SocialPost })?.data ?? one.data) as SocialPost;
            if (post?.id) data = [post, ...data.filter((p) => p.id !== post.id)];
          } catch {
            /* fall back to newest if the post can't be fetched */
          }
        }
        setPosts(data);
        setCursor(res.data?.pagination?.nextCursor ?? null);
        setHasMore(res.data?.pagination?.hasNextPage ?? false);
        const start = startPostId && data.some((p) => p.id === startPostId) ? startPostId : data[0]?.id ?? null;
        setActiveId(start);
      } catch {
        /* surfaced as the empty state below */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [startPostId, videoCategoryId]);

  // ─── Infinite load-more ──────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || cursor == null) return;
    setLoadingMore(true);
    try {
      const res = await socialApi.getFeed({ type: 'VIDEO', cursor, limit: 8, videoCategoryId });
      const data = (res.data?.data ?? []) as SocialPost[];
      setPosts((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        return [...prev, ...data.filter((p) => !seen.has(p.id))];
      });
      setCursor(res.data?.pagination?.nextCursor ?? null);
      setHasMore(res.data?.pagination?.hasNextPage ?? false);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, cursor, videoCategoryId]);

  // ─── IntersectionObserver: pick the single in-view slide ─────
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.6) {
            const id = Number((e.target as HTMLElement).dataset.postId);
            if (!Number.isNaN(id)) setActiveId(id);
          }
        }
      },
      { threshold: [0.6] },
    );
    ioRef.current = io;
    slideEls.current.forEach((el) => io.observe(el));
    return () => { io.disconnect(); ioRef.current = null; };
  }, [posts.length]);

  // Trigger load-more when the active slide is among the last two.
  useEffect(() => {
    if (activeId == null) return;
    const idx = posts.findIndex((p) => p.id === activeId);
    if (idx >= 0 && idx >= posts.length - 2) void loadMore();
  }, [activeId, posts, loadMore]);

  // Register a slide element with the observer + map.
  const registerSlide = useCallback((id: number, el: HTMLElement | null) => {
    const map = slideEls.current;
    const existing = map.get(id);
    if (existing && ioRef.current) ioRef.current.unobserve(existing);
    if (el) {
      map.set(id, el);
      ioRef.current?.observe(el);
    } else {
      map.delete(id);
    }
  }, []);

  // One-time scroll to the requested start post once it's mounted.
  useEffect(() => {
    if (didInitialScroll.current || activeId == null) return;
    const el = slideEls.current.get(activeId);
    if (el) {
      el.scrollIntoView({ block: 'start' });
      didInitialScroll.current = true;
    }
  }, [activeId, posts.length]);

  // Keyboard: ↑/↓ scroll to prev/next slide; Esc exits.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { exit(); return; }
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const idx = posts.findIndex((p) => p.id === activeId);
      const nextIdx = e.key === 'ArrowDown' ? idx + 1 : idx - 1;
      const target = posts[nextIdx];
      if (target) slideEls.current.get(target.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, posts]);

  const exit = useCallback(() => {
    // Prefer going back to the feed if we have history; else home.
    if (window.history.length > 1) router.back();
    else router.push('/?tab=video');
  }, [router]);

  // Optimistic like/save handled locally (the route owns its list).
  const patchPost = useCallback((id: number, patch: Partial<SocialPost>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  const onToggleLike = useCallback(async (post: SocialPost) => {
    const liked = !!post.isLiked;
    patchPost(post.id, { isLiked: !liked, likesCount: Math.max(0, (post.likesCount ?? 0) + (liked ? -1 : 1)) });
    try {
      await (liked ? socialApi.unlikePost(post.id) : socialApi.likePost(post.id));
    } catch {
      patchPost(post.id, { isLiked: liked, likesCount: post.likesCount });
    }
  }, [patchPost]);

  const onToggleSave = useCallback(async (post: SocialPost) => {
    const saved = !!post.isSaved;
    patchPost(post.id, { isSaved: !saved, savesCount: Math.max(0, (post.savesCount ?? 0) + (saved ? -1 : 1)) });
    try {
      await (saved ? socialApi.unsavePost(post.id) : socialApi.savePost(post.id));
    } catch {
      patchPost(post.id, { isSaved: saved, savesCount: post.savesCount });
    }
  }, [patchPost]);

  const onShare = useCallback(async (post: SocialPost) => {
    const url = `${window.location.origin}/?post=${post.id}`;
    try {
      if (navigator.share) await navigator.share({ url, title: 'Video' });
      else await navigator.clipboard.writeText(url);
      // Record the share server-side (best-effort; non-blocking).
      void socialApi.sharePost(post.id).catch(() => {});
    } catch { /* user cancelled */ }
  }, []);

  if (loading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-black text-white/60">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex h-[100dvh] flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white/70">
        <p>Chưa có video nào.</p>
        <Link href="/?tab=video" className="rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15">
          ← Quay lại feed
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      {/* Exit + global mute — fixed, outside the snap scroller */}
      <button
        onClick={exit}
        aria-label="Thoát"
        className="fixed left-4 top-[max(1rem,env(safe-area-inset-top,0px))] z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/15 hover:bg-black/60"
      >
        <X size={20} />
      </button>
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? 'Bật tiếng' : 'Tắt tiếng'}
        className="fixed right-4 top-[max(1rem,env(safe-area-inset-top,0px))] z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white ring-1 ring-white/15 hover:bg-black/60"
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Snap scroller */}
      <div className="h-[100dvh] snap-y snap-mandatory overflow-y-scroll overscroll-contain">
        {posts.map((post) => (
          <section
            key={post.id}
            data-post-id={post.id}
            ref={(el) => registerSlide(post.id, el)}
            className="relative flex h-[100dvh] snap-start items-center justify-center"
          >
            <VideoSlide
              post={post}
              active={post.id === activeId}
              muted={muted}
              onToggleMute={() => setMuted((m) => !m)}
              onLike={() => onToggleLike(post)}
              onSave={() => onToggleSave(post)}
              onShare={() => onShare(post)}
              onComments={() => setCommentsForId(post.id)}
            />
          </section>
        ))}
        {loadingMore && (
          <div className="flex h-16 items-center justify-center text-white/50">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </div>

      {/* Comments bottom sheet */}
      {commentsForId != null && (
        <VideoCommentsSheet
          post={posts.find((p) => p.id === commentsForId)!}
          onClose={() => setCommentsForId(null)}
          onCommentAdded={() =>
            patchPost(commentsForId, {
              commentsCount: (posts.find((p) => p.id === commentsForId)?.commentsCount ?? 0) + 1,
            })
          }
        />
      )}
    </div>
  );
}

/* ─── One slide: poster always; the real player only when active ─── */

function VideoSlide({
  post, active, muted, onToggleMute, onLike, onSave, onShare, onComments,
}: {
  post: SocialPost;
  active: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  onComments: () => void;
}) {
  const poster = posterForPost(post);
  const uploaded = firstVideoMedia(post);
  const ytId = getYouTubeId(post.youtubeUrl);
  const tkId = isTikTokUrl(post.youtubeUrl) ? getTikTokId(post.youtubeUrl) : null;
  const author = post.author?.displayName || post.author?.fullName || post.author?.username || 'Người dùng';
  const avatar = post.author?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username ?? 'user'}`;

  return (
    <>
      {/* Media layer — NO transform/filter ancestors to keep the GPU path */}
      <div className="absolute inset-0 bg-black">
        {/* Blurred backdrop fills the letterbox gaps of LANDSCAPE videos so
            they never show black bars (FB Reels / YouTube Shorts style).
            It's a SIBLING of the player — the blur/scale live only on this
            poster <img>, never on a <video> ancestor, so the clip stays on
            the GPU path (see the perf note above). Portrait 9:16 videos
            cover it entirely, so it's a no-op for them. */}
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
        {active && uploaded ? (
          <UploadedVideo url={uploaded.url} poster={poster} muted={muted} onToggleMute={onToggleMute} />
        ) : active && ytId ? (
          <iframe
            key={`yt-${post.id}`}
            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${ytId}&controls=1&playsinline=1&modestbranding=1`}
            title="YouTube"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="aspect-[9/16] h-full max-h-[100dvh] w-full border-0"
          />
        ) : active && tkId ? (
          <iframe
            key={`tk-${post.id}`}
            src={`https://www.tiktok.com/embed/v2/${tkId}`}
            title="TikTok"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="h-full max-h-[100dvh] w-full border-0"
          />
        ) : (
          // Inactive (or no player resolvable): poster only — no decode.
          <PosterFallback poster={poster} />
        )}
        </div>
      </div>

      {/* Right action rail — lifted by the home-indicator inset on iPhone */}
      <div className="absolute bottom-[calc(6rem+env(safe-area-inset-bottom,0px))] right-3 z-20 flex flex-col items-center gap-5 text-white">
        <Link href={`/profile/${post.author?.id ?? ''}`} className="mb-1 block h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={avatar} alt={author} className="h-full w-full object-cover" />
        </Link>
        <RailButton label={String(post.likesCount ?? 0)} onClick={onLike} active={!!post.isLiked} aria-label="Thích">
          <Heart size={28} className={post.isLiked ? 'fill-rose-500 text-rose-500' : ''} />
        </RailButton>
        <RailButton label={String(post.commentsCount ?? 0)} onClick={onComments} aria-label="Bình luận">
          <MessageCircle size={28} />
        </RailButton>
        <RailButton label={String(post.savesCount ?? 0)} onClick={onSave} active={!!post.isSaved} aria-label="Lưu">
          <Bookmark size={26} className={post.isSaved ? 'fill-amber-400 text-amber-400' : ''} />
        </RailButton>
        <RailButton label="Chia sẻ" onClick={onShare} aria-label="Chia sẻ">
          <Share2 size={26} />
        </RailButton>
      </div>

      {/* Caption + author footer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-4 pb-[max(2rem,calc(1rem+env(safe-area-inset-bottom,0px)))] pr-20">
        <p className="text-sm font-semibold text-white">@{post.author?.username ?? 'user'}</p>
        {post.content?.trim() && (
          <p className="mt-1 line-clamp-3 text-sm text-white/85">{post.content.trim()}</p>
        )}
      </div>
    </>
  );
}

function RailButton({
  children, label, onClick, active, ...rest
}: { children: React.ReactNode; label: string; onClick: () => void; active?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[44px] flex-col items-center gap-1 transition-transform active:scale-90"
      {...rest}
    >
      <span className={active ? '' : 'text-white drop-shadow'}>{children}</span>
      <span className="text-[11px] font-medium tabular-nums text-white/90 drop-shadow">{label}</span>
    </button>
  );
}

function PosterFallback({ poster }: { poster: string | null }) {
  if (!poster) {
    return <div className="h-full w-full bg-gradient-to-br from-violet-900/30 to-cyan-900/20" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={poster} alt="" className="h-full max-h-[100dvh] w-auto max-w-full object-contain" />;
}

/* ─── Active uploaded <video>: muted autoplay + loop + tap to pause ─── */

function UploadedVideo({
  url, poster, muted, onToggleMute,
}: { url: string; poster: string | null; muted: boolean; onToggleMute: () => void }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [paused, setPaused] = useState(false);

  // Autoplay on mount (this only renders when the slide is active).
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    const p = v.play();
    if (p && typeof p.then === 'function') p.catch(() => {});
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.muted = muted;
  }, [muted]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPaused(false); }
    else { v.pause(); setPaused(true); }
  };

  return (
    <div className="relative flex h-full w-full items-center justify-center" onClick={toggle}>
      <video
        ref={ref}
        src={getMediaUrl(url, url)}
        poster={poster ?? undefined}
        muted={muted}
        loop
        playsInline
        preload="auto"
        className="h-full max-h-[100dvh] w-auto max-w-full object-contain"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
      />
      {paused && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="rounded-full bg-black/40 p-5 backdrop-blur-sm">
            <Play size={34} className="fill-white text-white" />
          </span>
        </div>
      )}
    </div>
  );
}
