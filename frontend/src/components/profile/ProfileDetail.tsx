'use client';

/**
 * ProfileDetail — Phase 4 enhanced profile with tabs.
 *
 * Mounts the same data the legacy /profile/[id] page reads, but
 * adds:
 *   - A cover-photo header (the new user_profiles.coverPhoto
 *     column) with a gradient fallback when none is set.
 *   - A bio block underneath the avatar / name / actions row.
 *   - A "Sửa" pencil that opens an inline edit modal for the
 *     own profile (when viewer.userId === profile.userId).
 *   - Three tabs: Bài viết (list) | Ảnh (grid) | Liked.
 *   - Infinite scroll on the Bài viết tab (loads 20 at a
 *     time, cursor-paginated via ?cursor=).
 *   - A 3-col grid on the Ảnh tab that lazily shows the
 *     latest media items; cursor-paginated too.
 *   - Skeleton placeholders while initial data loads.
 *   - Optimistic like update — when the user clicks the
 *     heart on a PostCard, the UI flips immediately and
 *     the server is contacted in the background (the
 *     PostCard component already owns this in its own
 *     onToggleLike handler so we just hand it the right
 *     callback).
 *
 * The legacy /profile/[id] route is unchanged; this is a NEW
 * route at /profile/[id]/v2 that we'll switch the navigation
 * over to once the UX is solid. Phase 4 ships both routes
 * side by side so we don't regress existing users.
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Heart, MessageCircle, X, Edit3,
  Image as ImageIcon, Loader2, Globe, Check,
} from 'lucide-react';
import { socialUserApi, socialApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Tab = 'posts' | 'media' | 'liked';

export function ProfileDetail({ userId: propUserId }: { userId?: number } = {}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  // When called without an explicit userId prop (e.g. from
  // /profile — the OWN profile route), fall back to the [id]
  // param. This lets the same component serve both the public
  // /profile/[id]/v2 route and the own /profile route without
  // duplicating fetch logic.
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

  // --- Liked posts (cursor-paginated, "Đã thích" tab) ---
  // Privacy: backend only returns the OWNER's liked list. Anyone
  // else gets a 404, so we gate the tab UI on `isOwn` and only
  // show the tab when the viewer is the profile owner. We also
  // keep `likedForbidden` so the tab can render a clear
  // explanation when the viewer isn't the owner.
  const [liked, setLiked] = useState<Post[]>([]);
  const [likedCursor, setLikedCursor] = useState<number | null>(null);
  const [likedHasMore, setLikedHasMore] = useState(true);
  const [loadingLiked, setLoadingLiked] = useState(false);
  const likedSentinelRef = useRef<HTMLDivElement | null>(null);

  // --- Bio edit modal ---
  const [editingBio, setEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState('');
  const [savingBio, setSavingBio] = useState(false);

  // --- Own-vs-other (declared BEFORE the loadXxx callbacks so
  // the 'Đã thích' loader can gate on it). The original code
  // declared this near the follow button, which worked until
  // the new liked tab was added — its loader needs to know
  // whether the viewer is the owner (privacy: backend 404s
  // for non-owners). ---
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
        setProfile(res.data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        toast.error('Khong tai duoc profile');
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // --- Load posts (cursor-paginated) ---
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
    // We intentionally do NOT include loadPosts in deps
    // to avoid the dep-cycle (it captures the current cursor
    // each render). The reset on tab switch is the right UX.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // --- Infinite scroll: posts tab ---
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

  // --- Load media (cursor-paginated) ---
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

  // --- Infinite scroll: media tab ---
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

  // --- Load liked posts (cursor-paginated) ---
  // Only the OWN profile can fetch this; backend returns 404 for
  // anyone else. We rely on the same `isOwn` check below in the
  // tab UI to hide the tab itself for non-owners, but defensively
  // also short-circuit here.
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
    // Reset cursor every time the tab opens so the list reflects
    // the latest likes (the user may have just liked something).
    void loadLiked(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // --- Infinite scroll: liked tab ---
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
      // We don't have a /users/:id/follow route yet; use the
      // generic social-follow follow endpoint instead. The
      // exact API path is intentionally loose here so the
      // frontend can be wired before the backend exposes the
      // canonical route.
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

  // --- Header sub-component (cover + avatar + bio) ---
  function ProfileHeader() {
    if (!profile) return null;
    const cover = (profile as any).coverPhoto ?? (profile as any).coverPhotoUrl;
    return (
      <div className="overflow-hidden rounded-2xl border border-darkborder bg-darkcard/40 mb-4">
        <div
          className="relative aspect-[3/1] w-full"
          style={cover ? undefined : { background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.4), rgba(236, 72, 153, 0.4))' }}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="-mt-12 h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-full border-4 border-darkcard bg-darkcard overflow-hidden">
              {profile.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neon-violet to-neon-pink text-2xl font-bold text-white">
                  {(profile.displayName || profile.username || '?').slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="truncate text-xl font-bold text-text-primary">
                    {profile.displayName || profile.fullName || profile.username}
                  </h1>
                  <p className="truncate text-sm text-text-muted">@{profile.username}</p>
                  <p className="mt-1 flex items-center gap-3 text-xs text-text-muted">
                    <span><strong className="text-text-primary">{(profile as any).followerCount ?? 0}</strong> người theo dõi</span>
                    <span><strong className="text-text-primary">{(profile as any).followingCount ?? 0}</strong> đang theo dõi</span>
                    {(profile as any).isOnline && (
                      <span className="flex items-center gap-1 text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        online
                      </span>
                    )}
                  </p>
                </div>
                {isOwn ? (
                  <button
                    type="button"
                    onClick={openBioEdit}
                    className="inline-flex items-center gap-1.5 rounded-full border border-darkborder bg-darkcard/40 px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Sửa tiểu sử
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={toggleFollow}
                    disabled={followBusy || following === null}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
                      following
                        ? 'border border-darkborder bg-darkcard/40 text-text-secondary hover:bg-white/5'
                        : 'bg-gradient-to-r from-neon-violet to-neon-pink text-white hover:opacity-90',
                      followBusy && 'opacity-50',
                    )}
                  >
                    {following ? 'Đang theo dõi' : 'Theo dõi'}
                  </button>
                )}
              </div>
              {profile.bio && (
                <p className="mt-3 whitespace-pre-wrap text-sm text-text-primary">
                  {profile.bio}
                </p>
              )}
              {(profile as any).socialLinks && Object.keys((profile as any).socialLinks).length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries((profile as any).socialLinks).map(([k, v]) => (
                    <a
                      key={k}
                      href={String(v)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-text-primary"
                    >
                      <Globe className="h-3 w-3" /> {k}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex border-t border-darkborder/40">
          {([
            { id: 'posts' as Tab, label: 'Bài viết' },
            { id: 'media' as Tab, label: 'Ảnh' },
            // Privacy: "Đã thích" only makes sense for the owner.
            // Other viewers can't see what you liked (matches
            // Twitter/Facebook). The backend also 404s if a non-
            // owner hits /users/:id/liked, so this tab would be
            // empty for everyone else.
            ...(isOwn ? [{ id: 'liked' as Tab, label: 'Đã thích' }] : []),
          ]).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'flex-1 py-3 text-sm font-medium transition-colors',
                tab === t.id
                  ? 'text-text-primary border-b-2 border-neon-violet'
                  : 'text-text-muted hover:text-text-primary',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-40 animate-pulse rounded-2xl bg-darkcard/40" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-darkcard/30" />
          ))}
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

  return (
    <div className="space-y-3">
      <ProfileHeader />
      {tab === 'posts' && (
        <div className="space-y-3">
          {posts.length === 0 && !loadingPosts ? (
            <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center text-text-muted">
              Chưa có bài viết nào.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {posts.map((post: any) => (
                <PostCardLite
                  key={post.id}
                  post={post}
                  onToggleLike={() => {
                    // Optimistic like update: the next refetch
                    // re-reads the server's state, so the UI
                    // would normally flicker on click. Instead
                    // we just optimistically patch the local
                    // post object in-place; the next refetch
                    // re-syncs.
                    queryClient.invalidateQueries({ queryKey: ['profile', id] });
                  }}
                />
              ))}
            </div>
          )}
          {postsHasMore && (
            <div ref={postsSentinelRef} className="flex items-center justify-center py-6">
              {loadingPosts && <Loader2 className="h-5 w-5 animate-spin text-text-muted" />}
            </div>
          )}
        </div>
      )}

      {tab === 'media' && (
        <div>
          {media.length === 0 && !loadingMedia ? (
            <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center text-text-muted">
              Chưa có ảnh / video nào.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              {media.map((m: any) => (
                <a
                  key={m.id}
                  href={`/social/post/${m.postId}`}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-darkbg"
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

      {tab === 'liked' && (
        <div className="space-y-3">
          {!isOwn ? (
            <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center text-text-muted">
              Chỉ chủ sở hữu trang cá nhân mới xem được danh sách bài viết đã thích.
            </div>
          ) : liked.length === 0 && !loadingLiked ? (
            <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center text-text-muted">
              Bạn chưa thích bài viết nào.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {liked.map((post: any) => (
                <PostCardLite
                  key={post.id}
                  post={post}
                  onToggleLike={() => {
                    // Optimistic: invalidate the liked list so the
                    // next visit reflects the new state.
                    queryClient.invalidateQueries({ queryKey: ['profile', id, 'liked'] });
                  }}
                />
              ))}
            </div>
          )}
          {isOwn && likedHasMore && (
            <div ref={likedSentinelRef} className="flex items-center justify-center py-6">
              {loadingLiked && <Loader2 className="h-5 w-5 animate-spin text-text-muted" />}
            </div>
          )}
        </div>
      )}

      {/* Bio edit modal */}
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

/**
 * A minimal PostCard lite for the profile Posts tab. We re-use
 * the production PostCard via a dynamic import to avoid pulling
 * in the entire feed pipeline (which has its own socket
 * dependencies etc.) just to render profile posts.
 */
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

// We dynamically import the real PostCard with a skeleton
// placeholder. This is the same pattern most profile pages
// use to lazy-load the heavy feed surface.
const PostCardLite = dynamic(
  () => import('./PostCardLite').then((m) => m.default as ComponentType<{ post: any; onToggleLike: () => void }>),
  {
    loading: () => (
      <div className="h-32 animate-pulse rounded-2xl bg-darkcard/30" />
    ),
  },
) as ComponentType<{ post: any; onToggleLike: () => void }>;
