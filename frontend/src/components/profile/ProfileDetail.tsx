'use client';

/**
 * ProfileDetail — Redesigned profile page (2026-06-28)
 *
 * Layout: 3-column grid like Facebook
 * - Left sidebar (280px): About, Stats, Friends
 * - Main (1fr, max 600px): Tabs + Posts feed
 * - Right sidebar (280px): empty / suggestions
 *
 * Features:
 * - Compact cover header with avatar, name, bio, follow button
 * - Tabs: Bài viết | Ảnh | Đã thích
 * - Posts tab shows vertical feed with full PostCard (not grid)
 * - Left sidebar widgets for profile info
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, X, Edit3, Globe, MapPin, Calendar,
  Link2, Users, Image as ImageIcon, Loader2, Check,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { socialUserApi, socialApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tab = 'posts' | 'media' | 'liked';

// Dynamic import PostCard for the feed (named export)
const PostCard = dynamic(
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  () => import('@/components/social/PostCard').then((m) => m.PostCard as ComponentType<{ post: any }>),
  { loading: () => <div className="h-48 animate-pulse rounded-2xl bg-darkcard/30" /> },
);

export function ProfileDetail({ userId: propUserId }: { userId?: number } = {}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = propUserId ?? Number(params?.id);
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  // --- Profile state ---
  type ProfileWithExtras = Awaited<ReturnType<typeof socialUserApi.getProfile>> extends { data: infer T } ? T : never;
  const [profile, setProfile] = useState<ProfileWithExtras | null>(null);
  const [loading, setLoading] = useState(true);

  // --- Tabs ---
  const [tab, setTab] = useState<Tab>('posts');

  // --- Posts (cursor-paginated) ---
  type Post = any;
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsCursor, setPostsCursor] = useState<number | null>(null);
  const [postsHasMore, setPostsHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const postsSentinelRef = useRef<HTMLDivElement | null>(null);

  // --- Media (cursor-paginated, 3-col grid) ---
  type Media = any;
  const [media, setMedia] = useState<Media[]>([]);
  const [mediaCursor, setMediaCursor] = useState<number | null>(null);
  const [mediaHasMore, setMediaHasMore] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const mediaSentinelRef = useRef<HTMLDivElement | null>(null);

  // --- Liked posts ---
  const [liked, setLiked] = useState<Post[]>([]);
  const [likedCursor, setLikedCursor] = useState<number | null>(null);
  const [likedHasMore, setLikedHasMore] = useState(true);
  const [loadingLiked, setLoadingLiked] = useState(false);
  const likedSentinelRef = useRef<HTMLDivElement | null>(null);

  // --- Bio edit modal ---
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  const isOwn = currentUser?.id === id;

  // --- Load profile ---
  useEffect(() => {
    if (!id || !Number.isFinite(id)) return;
    let cancelled = false;
    setLoading(true);
    socialUserApi
      .getProfile(id)
      .then((res: any) => {
        if (cancelled) return;
        setProfile(res.data?.data ?? res.data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        toast.error('Khong tai duoc profile');
      });
    return () => { cancelled = true; };
  }, [id]);

  // --- Load posts ---
  const loadPosts = useCallback(
    async (reset = false) => {
      if (!id || loadingPosts) return;
      if (!reset && !postsHasMore) return;
      setLoadingPosts(true);
      try {
        const res: any = await socialUserApi.getUserPosts(id, {
          cursor: reset ? undefined : postsCursor ?? undefined,
          limit: 20,
        });
        const { items, nextCursor, hasMore } = res.data?.data ?? {};
        setPosts((prev: any[]) => (reset ? items ?? [] : [...prev, ...(items ?? [])]));
        setPostsCursor(nextCursor);
        setPostsHasMore(hasMore);
      } catch {
        toast.error('Khong tai duoc bai viet');
      } finally {
        setLoadingPosts(false);
      }
    },
    [id, postsCursor, postsHasMore, loadingPosts],
  );

  useEffect(() => {
    if (tab !== 'posts') return;
    void loadPosts(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (tab !== 'posts') return;
    const node = postsSentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && postsHasMore && !loadingPosts) {
          void loadPosts(false);
        }
      },
      { rootMargin: '300px' },
    );
    obs.observe(node);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, postsHasMore, loadingPosts]);

  // --- Load media ---
  const loadMedia = useCallback(
    async (reset = false) => {
      if (!id || loadingMedia) return;
      if (!reset && !mediaHasMore) return;
      setLoadingMedia(true);
      try {
        const res: any = await socialUserApi.getUserMedia(id, {
          cursor: reset ? undefined : mediaCursor ?? undefined,
          limit: 30,
        });
        const { items, nextCursor, hasMore } = res.data?.data ?? {};
        setMedia((prev: any[]) => (reset ? items ?? [] : [...prev, ...(items ?? [])]));
        setMediaCursor(nextCursor);
        setMediaHasMore(hasMore);
      } catch {
        toast.error('Khong tai duoc media');
      } finally {
        setLoadingMedia(false);
      }
    },
    [id, mediaCursor, mediaHasMore, loadingMedia],
  );

  useEffect(() => {
    if (tab !== 'media') return;
    void loadMedia(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (tab !== 'media') return;
    const node = mediaSentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && mediaHasMore && !loadingMedia) {
          void loadMedia(false);
        }
      },
      { rootMargin: '300px' },
    );
    obs.observe(node);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, mediaHasMore, loadingMedia]);

  // --- Load liked posts ---
  const loadLiked = useCallback(
    async (reset = false) => {
      if (!id || loadingLiked) return;
      if (!reset && !likedHasMore) return;
      if (!isOwn) return;
      setLoadingLiked(true);
      try {
        const res: any = await socialUserApi.getUserLiked(id, {
          cursor: reset ? undefined : likedCursor ?? undefined,
          limit: 20,
        });
        const { items, nextCursor, hasMore } = res.data?.data ?? {};
        setLiked((prev: any[]) => (reset ? items ?? [] : [...prev, ...(items ?? [])]));
        setLikedCursor(nextCursor);
        setLikedHasMore(hasMore);
      } catch {
        toast.error('Khong tai duoc bai viet da thich');
      } finally {
        setLoadingLiked(false);
      }
    },
    [id, likedCursor, likedHasMore, loadingLiked, isOwn],
  );

  useEffect(() => {
    if (tab !== 'liked') return;
    void loadLiked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (tab !== 'liked') return;
    const node = likedSentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && likedHasMore && !loadingLiked) {
          void loadLiked(false);
        }
      },
      { rootMargin: '300px' },
    );
    obs.observe(node);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, likedHasMore, loadingLiked]);

  // --- Bio edit ---
  const openBioEdit = () => {
    if (!profile) return;
    setBioDraft(profile.bio ?? '');
    setEditingBio(true);
  };

  const saveBio = async () => {
    setSavingBio(true);
    try {
      await socialUserApi.updateOwnProfile({ bio: bioDraft });
      setProfile((prev: any) => prev ? { ...prev, bio: bioDraft } : prev);
      setEditingBio(false);
      toast.success('Da cap nhat tieu su');
    } catch {
      toast.error('Khong the cap nhat tieu su');
    } finally {
      setSavingBio(false);
    }
  };

  // --- Follow/unfollow ---
  const [following, setFollowing] = useState<boolean | null>(null);
  const [followBusy, setFollowBusy] = useState(false);
  useEffect(() => {
    if (profile) setFollowing((profile as any).isFollowing ?? null);
  }, [profile]);

  const toggleFollow = async () => {
    if (!id || followBusy) return;
    setFollowBusy(true);
    try {
      const res: any = await socialUserApi.toggleFollow(id);
      setFollowing(!!(res?.data?.following ?? !following));
      setProfile((prev: any) => prev ? {
        ...prev,
        isFollowing: !(prev as any).isFollowing,
        followerCount: ((prev as any).followerCount ?? 0) + (((prev as any).isFollowing) ? -1 : 1),
      } as any : prev);
    } catch {
      toast.error('Khong the theo doi');
    } finally {
      setFollowBusy(false);
    }
  };

  // ─── Loading skeleton ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto">
        {/* Cover skeleton */}
        <div className="h-48 animate-pulse rounded-2xl bg-darkcard/40 mb-4" />
        <div className="flex gap-6">
          {/* Sidebar skeleton */}
          <div className="w-72 shrink-0 space-y-4">
            <div className="h-64 animate-pulse rounded-2xl bg-darkcard/30" />
            <div className="h-32 animate-pulse rounded-2xl bg-darkcard/30" />
          </div>
          {/* Main skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-12 animate-pulse rounded-xl bg-darkcard/30" />
            <div className="h-48 animate-pulse rounded-2xl bg-darkcard/30" />
            <div className="h-48 animate-pulse rounded-2xl bg-darkcard/30" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-2xl border border-darkborder bg-darkcard/40 p-12 text-center text-text-muted">
        Không tìm thấy người dùng.
      </div>
    );
  }

  const p = profile as any;
  const cover = p.coverPhoto ?? p.coverPhotoUrl;

  return (
    <div className="max-w-5xl mx-auto">
      {/* ─── Cover Header ─────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden border border-darkborder bg-darkcard/40 mb-4">
        {/* Cover image */}
        <div
          className="relative h-48 sm:h-56"
          style={cover ? undefined : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-full w-full object-cover" />
          )}
        </div>

        {/* Avatar + Info row */}
        <div className="px-4 pb-4 sm:px-6">
          <div className="flex items-end justify-between -mt-12 sm:-mt-14 gap-4">
            {/* Avatar */}
            <div className="h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-full border-4 border-darkcard bg-darkcard overflow-hidden shadow-xl">
              {p.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neon-violet to-neon-pink text-3xl font-bold text-white">
                  {(p.displayName || p.username || '?').slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-1">
              {isOwn ? (
                <button
                  type="button"
                  onClick={openBioEdit}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-darkborder bg-darkcard/60 px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Sửa tiểu sử
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={toggleFollow}
                    disabled={followBusy || following === null}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors',
                      following
                        ? 'border border-darkborder bg-darkcard/60 text-text-secondary hover:bg-white/5'
                        : 'bg-gradient-to-r from-neon-violet to-neon-pink text-white hover:opacity-90',
                      followBusy && 'opacity-50',
                    )}
                  >
                    {following ? 'Đang theo dõi' : 'Theo dõi'}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-darkborder bg-darkcard/60 px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    Nhắn tin
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Name + stats */}
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-text-primary">
              {p.displayName || p.fullName || p.username}
            </h1>
            <p className="text-sm text-text-muted">@{p.username}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-text-muted">
              <span><strong className="text-text-primary">{p.followerCount ?? 0}</strong> người theo dõi</span>
              <span><strong className="text-text-primary">{p.followingCount ?? 0}</strong> đang theo dõi</span>
              {p.isOnline && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  online
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Main Layout: Sidebar + Main + Right ─────────────── */}
      <div className="flex gap-6 items-start">
        {/* ─── LEFT SIDEBAR ──────────────────────────────────── */}
        <div className="w-72 shrink-0 space-y-4">
          {/* About Card */}
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 p-4">
            <h2 className="text-base font-semibold text-text-primary mb-3">Giới thiệu</h2>
            {p.bio && (
              <p className="text-sm text-text-secondary mb-3 whitespace-pre-wrap">{p.bio}</p>
            )}
            <div className="space-y-2 text-sm text-text-muted">
              {p.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{p.location}</span>
                </div>
              )}
              {p.birthYear && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>Sinh năm {p.birthYear}</span>
                </div>
              )}
              {p.websiteUrl && (
                <div className="flex items-center gap-2">
                  <Link2 className="h-4 w-4 shrink-0" />
                  <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-neon-violet hover:underline truncate">
                    {p.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            {p.socialLinks && Object.keys(p.socialLinks).length > 0 && (
              <div className="mt-3 pt-3 border-t border-darkborder/40">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(p.socialLinks).map(([k, v]) => (
                    <a
                      key={k}
                      href={String(v)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors"
                    >
                      <Globe className="h-3 w-3" /> {k}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 p-4">
            <h2 className="text-base font-semibold text-text-primary mb-3">Thống kê</h2>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2 rounded-lg bg-white/[0.03]">
                <div className="text-xl font-bold text-text-primary">{p.followerCount ?? 0}</div>
                <div className="text-xs text-text-muted">Người theo dõi</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.03]">
                <div className="text-xl font-bold text-text-primary">{p.followingCount ?? 0}</div>
                <div className="text-xs text-text-muted">Đang theo dõi</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.03]">
                <div className="text-xl font-bold text-text-primary">{posts.length || 0}</div>
                <div className="text-xs text-text-muted">Bài viết</div>
              </div>
              <div className="p-2 rounded-lg bg-white/[0.03]">
                <div className="text-xl font-bold text-text-primary">{media.length || 0}</div>
                <div className="text-xs text-text-muted">Ảnh</div>
              </div>
            </div>
          </div>

          {/* Friends hint */}
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-text-primary">Bạn bè</h2>
              <button type="button" className="text-xs text-neon-violet hover:underline">Xem tất cả</button>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-1">
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-neon-violet/20 to-neon-pink/20 mb-1" />
                  <div className="h-2 rounded bg-white/[0.05]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── MAIN CONTENT ───────────────────────────────────── */}
        <div className="flex-1 min-w-0 max-w-[600px]">
          {/* Tabs */}
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 mb-4 overflow-hidden">
            <div className="flex">
              {([
                { id: 'posts' as Tab, label: 'Bài viết' },
                { id: 'media' as Tab, label: 'Ảnh' },
                ...(isOwn ? [{ id: 'liked' as Tab, label: 'Đã thích' }] : []),
              ]).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    'flex-1 py-3 text-sm font-medium transition-colors',
                    tab === t.id
                      ? 'text-text-primary border-b-2 border-neon-violet bg-white/[0.02]'
                      : 'text-text-muted hover:text-text-primary hover:bg-white/[0.02]',
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* ─── POSTS TAB ─────────────────────────────────── */}
          {tab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 && !loadingPosts ? (
                <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center text-text-muted">
                  Chưa có bài viết nào.
                </div>
              ) : (
                <>
                  {posts.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </>
              )}
              {postsHasMore && (
                <div ref={postsSentinelRef} className="flex items-center justify-center py-6">
                  {loadingPosts && <Loader2 className="h-5 w-5 animate-spin text-text-muted" />}
                </div>
              )}
            </div>
          )}

          {/* ─── MEDIA TAB ──────────────────────────────────── */}
          {tab === 'media' && (
            <div>
              {media.length === 0 && !loadingMedia ? (
                <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center text-text-muted">
                  Chưa có ảnh / video nào.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden border border-darkborder">
                  {media.map((m: any) => (
                    <a
                      key={m.id}
                      href={`/social/post/${m.postId}`}
                      className="group relative aspect-square overflow-hidden bg-darkbg"
                    >
                      {m.type === 'VIDEO' ? (
                        <video
                          src={m.url}
                          poster={m.thumbnail}
                          className="h-full w-full object-cover"
                          muted
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.url || m.thumbnail}
                          alt={m.alt || ''}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                      {m.type === 'VIDEO' && (
                        <div className="absolute right-1.5 top-1.5 rounded-full bg-black/60 px-1.5 text-[10px] font-bold text-white">
                          ▶
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
              {mediaHasMore && (
                <div ref={mediaSentinelRef} className="flex items-center justify-center py-6">
                  {loadingMedia && <Loader2 className="h-5 w-5 animate-spin text-text-muted" />}
                </div>
              )}
            </div>
          )}

          {/* ─── LIKED TAB ──────────────────────────────────── */}
          {tab === 'liked' && (
            <div className="space-y-4">
              {!isOwn ? (
                <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center text-text-muted">
                  Chỉ chủ sở hữu trang cá nhân mới xem được danh sách bài viết đã thích.
                </div>
              ) : liked.length === 0 && !loadingLiked ? (
                <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center text-text-muted">
                  Bạn chưa thích bài viết nào.
                </div>
              ) : (
                <>
                  {liked.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </>
              )}
              {isOwn && likedHasMore && (
                <div ref={likedSentinelRef} className="flex items-center justify-center py-6">
                  {loadingLiked && <Loader2 className="h-5 w-5 animate-spin text-text-muted" />}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── RIGHT SIDEBAR (empty / future suggestions) ─────── */}
        <div className="w-72 shrink-0">
          {/* Placeholder for future content */}
        </div>
      </div>

      {/* ─── Bio Edit Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {editingBio && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => !savingBio && setEditingBio(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-darkborder bg-[#0d0f18] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-darkborder/60 px-5 py-3.5">
                <h3 className="text-sm font-semibold text-text-primary">Sửa tiểu sử</h3>
                <button
                  type="button"
                  onClick={() => setEditingBio(false)}
                  className="rounded-lg p-1 text-text-muted hover:bg-white/5 hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <textarea
                  value={bioDraft}
                  onChange={(e) => setBioDraft(e.target.value)}
                  maxLength={2000}
                  rows={5}
                  className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none resize-none"
                  placeholder="Viết vài dòng về bạn..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBio(false)}
                    className="rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={saveBio}
                    disabled={savingBio}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-violet to-neon-pink px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    {savingBio ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Lưu
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}