'use client';

/**
 * ProfileDetail — Enhanced profile page (2026-06-28)
 *
 * Layout: 3-column grid like Facebook (90% viewport width)
 * - Left sidebar (300px): About, Contact, Personal, Stats, Friends
 * - Main (1fr, max 700px): Tabs + Posts feed
 * - Right sidebar (300px): empty / suggestions
 *
 * Features:
 * - Expanded 90% viewport width for better visual experience
 * - Separate avatar from cover photo (classic profile header style)
 * - Avatar and cover photo upload/edit functionality
 * - Contact section: name, email, phone, gender, birth year, location, work, links
 * - Personal section: bio, website, education, interests
 * - Tabs: Bài viết | Ảnh | Đã thích
 * - Posts tab shows vertical feed with full PostCard (not grid)
 * - Left sidebar widgets for profile info
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, X, Edit3, Globe, MapPin, Calendar, Camera,
  Link2, Users, Image as ImageIcon, Loader2, Check,
  Mail, Phone, Briefcase, GraduationCap, Heart,
  Facebook, Twitter, Github, Linkedin, Youtube, Instagram,
  User, Shield, Plus, Trash2
} from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { socialUserApi, socialApi } from '@/lib/api';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Dynamic import PostCard for the feed (named export)
const PostCard = dynamic(
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  () => import('@/components/social/PostCard').then((m) => m.PostCard as ComponentType<{ post: any }>),
  { loading: () => <div className="h-48 animate-pulse rounded-2xl bg-darkcard/30" /> },
);

type Tab = 'posts' | 'media' | 'liked';

// Extended profile type
interface ExtendedProfile {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverPhoto?: string;
  coverPhotoUrl?: string;
  gender?: string;
  birthYear?: number;
  phone?: string;
  location?: string;
  work?: string;
  education?: string;
  websiteUrl?: string;
  socialLinks?: Record<string, string>;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  isOnline?: boolean;
}

export function ProfileDetail({ userId: propUserId }: { userId?: number } = {}) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = propUserId ?? Number(params?.id);
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  // --- Profile state ---
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
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

  // --- Modal states ---
  const [activeModal, setActiveModal] = useState<'bio' | 'contact' | 'personal' | 'avatar' | 'cover' | null>(null);
  const [savingModal, setSavingModal] = useState(false);

  // --- Bio/Personal form state ---
  const [bioDraft, setBioDraft] = useState('');
  const [personalDraft, setPersonalDraft] = useState({
    websiteUrl: '',
    education: '',
  });

  // --- Contact form state ---
  const [contactDraft, setContactDraft] = useState({
    fullName: '',
    displayName: '',
    phone: '',
    gender: '' as '' | 'MALE' | 'FEMALE' | 'OTHER',
    birthYear: '',
    location: '',
    work: '',
    email: '',
  });

  // --- Avatar/Cover upload state ---
  const [uploadingImage, setUploadingImage] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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
        const data = res.data?.data ?? res.data;
        setProfile(data);
        // Initialize drafts
        setBioDraft(data.bio ?? '');
        setPersonalDraft({
          websiteUrl: data.websiteUrl ?? '',
          education: data.education ?? '',
        });
        setContactDraft({
          fullName: data.fullName ?? '',
          displayName: data.displayName ?? '',
          phone: data.phone ?? '',
          gender: data.gender ?? '',
          birthYear: data.birthYear?.toString() ?? '',
          location: data.location ?? '',
          work: data.work ?? '',
          email: data.email ?? '',
        });
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

  // --- Image upload handler ---
  const handleImageUpload = async (file: File, type: 'avatar' | 'cover') => {
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Kích thước file quá lớn (tối đa 5MB)');
      return;
    }

    setUploadingImage(true);
    try {
      // Get signed URL
      const signedRes = await socialApi.getSignedUploadUrl(file.name, file.type === 'video/mp4' ? 'VIDEO' : 'IMAGE', file.size);
      if (!signedRes.success || !signedRes.data) {
        throw new Error(signedRes.message || 'Failed to get upload URL');
      }

      // Upload to signed URL
      const uploadRes = await fetch(signedRes.data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }

      const imageUrl = signedRes.data.publicUrl;

      // Update profile
      if (type === 'avatar') {
        await authApi.updateProfile({ avatarUrl: imageUrl });
        setProfile(prev => prev ? { ...prev, avatarUrl: imageUrl } : prev);
        toast.success('Cập nhật ảnh đại diện thành công');
      } else {
        await socialUserApi.updateCoverPhoto(imageUrl);
        setProfile(prev => prev ? { ...prev, coverPhoto: imageUrl, coverPhotoUrl: imageUrl } : prev);
        toast.success('Cập nhật ảnh bìa thành công');
      }

      // Refresh auth store
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải lên hình ảnh');
    } finally {
      setUploadingImage(false);
    }
  };

  // --- Bio save ---
  const saveBio = async () => {
    setSavingModal(true);
    try {
      await socialUserApi.updateOwnProfile({ bio: bioDraft });
      setProfile(prev => prev ? { ...prev, bio: bioDraft } : prev);
      setActiveModal(null);
      toast.success('Đã cập nhật tiểu sử');
    } catch {
      toast.error('Không thể cập nhật tiểu sử');
    } finally {
      setSavingModal(false);
    }
  };

  // --- Contact save ---
  const saveContact = async () => {
    setSavingModal(true);
    try {
      const updateData: any = {
        fullName: contactDraft.fullName || undefined,
        displayName: contactDraft.displayName || undefined,
        phone: contactDraft.phone || undefined,
        gender: contactDraft.gender || undefined,
        birthYear: contactDraft.birthYear ? parseInt(contactDraft.birthYear) : undefined,
      };
      await authApi.updateProfile(updateData);
      await socialUserApi.updateOwnProfile({
        location: contactDraft.location || undefined,
        work: contactDraft.work || undefined,
      });
      setProfile(prev => prev ? {
        ...prev,
        fullName: contactDraft.fullName,
        displayName: contactDraft.displayName,
        phone: contactDraft.phone,
        gender: contactDraft.gender,
        birthYear: contactDraft.birthYear ? parseInt(contactDraft.birthYear) : undefined,
        location: contactDraft.location,
        work: contactDraft.work,
      } : prev);
      setActiveModal(null);
      toast.success('Đã cập nhật thông tin liên hệ');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch {
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setSavingModal(false);
    }
  };

  // --- Personal save ---
  const savePersonal = async () => {
    setSavingModal(true);
    try {
      await socialUserApi.updateOwnProfile({
        websiteUrl: personalDraft.websiteUrl || undefined,
        education: personalDraft.education || undefined,
      });
      setProfile(prev => prev ? {
        ...prev,
        websiteUrl: personalDraft.websiteUrl,
        education: personalDraft.education,
      } : prev);
      setActiveModal(null);
      toast.success('Đã cập nhật thông tin cá nhân');
    } catch {
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setSavingModal(false);
    }
  };

  // --- Follow/unfollow ---
  const [following, setFollowing] = useState<boolean | null>(null);
  const [followBusy, setFollowBusy] = useState(false);
  useEffect(() => {
    if (profile) setFollowing(profile.isFollowing ?? null);
  }, [profile]);

  const toggleFollow = async () => {
    if (!id || followBusy) return;
    setFollowBusy(true);
    try {
      const res: any = await socialUserApi.toggleFollow(id);
      setFollowing(!!(res?.data?.following ?? !following));
      setProfile((prev) => prev ? {
        ...prev,
        isFollowing: !prev.isFollowing,
        followerCount: (prev.followerCount ?? 0) + (prev.isFollowing ? -1 : 1),
      } : prev);
    } catch {
      toast.error('Khong the theo doi');
    } finally {
      setFollowBusy(false);
    }
  };

  // --- Social link icons ---
  const getSocialIcon = (key: string) => {
    const icons: Record<string, any> = {
      facebook: Facebook,
      twitter: Twitter,
      github: Github,
      linkedin: Linkedin,
      youtube: Youtube,
      instagram: Instagram,
      website: Globe,
    };
    return icons[key.toLowerCase()] || Link2;
  };

  // ─── Loading skeleton ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-[90vw] max-w-7xl mx-auto">
        {/* Cover skeleton */}
        <div className="h-56 animate-pulse rounded-2xl bg-darkcard/40 mb-6" />
        <div className="flex gap-6">
          {/* Sidebar skeleton */}
          <div className="w-80 shrink-0 space-y-4">
            <div className="h-80 animate-pulse rounded-2xl bg-darkcard/30" />
            <div className="h-48 animate-pulse rounded-2xl bg-darkcard/30" />
          </div>
          {/* Main skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-14 animate-pulse rounded-xl bg-darkcard/30" />
            <div className="h-56 animate-pulse rounded-2xl bg-darkcard/30" />
            <div className="h-56 animate-pulse rounded-2xl bg-darkcard/30" />
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

  const p = profile;
  const cover = p.coverPhoto ?? p.coverPhotoUrl;
  const genderLabel = p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : p.gender === 'OTHER' ? 'Khác' : null;

  return (
    <div className="w-[90vw] max-w-7xl mx-auto">
      {/* ─── Cover Header ─────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden border border-darkborder bg-darkcard/40 mb-6">
        {/* Cover image - full width */}
        <div
          className="relative h-56"
          style={cover ? undefined : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="h-full w-full object-cover" />
          )}

          {/* Cover photo upload button */}
          {isOwn && (
            <label className="absolute bottom-3 right-3 cursor-pointer inline-flex items-center gap-2 rounded-lg bg-black/60 hover:bg-black/70 px-3 py-1.5 text-sm font-medium text-white transition-colors">
              {uploadingImage ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              <span>Đổi ảnh bìa</span>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'cover');
                  e.target.value = '';
                }}
              />
            </label>
          )}
        </div>

        {/* Avatar + Info row - positioned below cover */}
        <div className="px-6 pb-5">
          <div className="flex items-end justify-between -mt-16 gap-4">
            {/* Avatar - separated from cover */}
            <div className="relative">
              <div className="h-32 w-32 sm:h-36 sm:w-36 shrink-0 rounded-full border-4 border-darkcard bg-darkcard overflow-hidden shadow-2xl">
                {p.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neon-violet to-neon-pink text-4xl sm:text-5xl font-bold text-white">
                    {(p.displayName || p.fullName || p.username || '?').slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Avatar upload button */}
              {isOwn && (
                <label className="absolute bottom-1 right-1 cursor-pointer h-8 w-8 rounded-full bg-black/70 hover:bg-black/80 flex items-center justify-center border-2 border-darkcard transition-colors">
                  {uploadingImage ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                  ) : (
                    <Camera className="h-3.5 w-3.5 text-white" />
                  )}
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, 'avatar');
                      e.target.value = '';
                    }}
                  />
                </label>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-1">
              {isOwn ? (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveModal('contact')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-darkborder bg-darkcard/60 px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal('bio')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-darkborder bg-darkcard/60 px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 hover:text-text-primary"
                  >
                    <User className="h-3.5 w-3.5" />
                    Cá nhân
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={toggleFollow}
                    disabled={followBusy || following === null}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-lg px-5 py-1.5 text-sm font-semibold transition-colors',
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
          <div className="mt-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
              {p.displayName || p.fullName || p.username}
            </h1>
            <p className="text-sm text-text-muted">@{p.username}</p>
            <div className="mt-2 flex items-center gap-5 text-sm text-text-muted">
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
        <div className="w-80 shrink-0 space-y-4">
          {/* Contact Card */}
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Liên hệ
              </h2>
              {isOwn && (
                <button
                  type="button"
                  onClick={() => setActiveModal('contact')}
                  className="text-xs text-neon-violet hover:underline"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            <div className="space-y-2 text-sm">
              {p.fullName && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <User className="h-4 w-4 shrink-0 text-text-muted" />
                  <span>{p.fullName}</span>
                </div>
              )}
              {p.email && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Mail className="h-4 w-4 shrink-0 text-text-muted" />
                  <span className="truncate">{p.email}</span>
                </div>
              )}
              {p.phone && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Phone className="h-4 w-4 shrink-0 text-text-muted" />
                  <span>{p.phone}</span>
                </div>
              )}
              {genderLabel && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Heart className="h-4 w-4 shrink-0 text-text-muted" />
                  <span>{genderLabel}</span>
                </div>
              )}
              {p.birthYear && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="h-4 w-4 shrink-0 text-text-muted" />
                  <span>Sinh năm {p.birthYear}</span>
                </div>
              )}
              {p.location && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="h-4 w-4 shrink-0 text-text-muted" />
                  <span>{p.location}</span>
                </div>
              )}
              {p.work && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Briefcase className="h-4 w-4 shrink-0 text-text-muted" />
                  <span>{p.work}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {p.socialLinks && Object.keys(p.socialLinks).length > 0 && (
              <div className="mt-3 pt-3 border-t border-darkborder/40">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(p.socialLinks).map(([k, v]) => {
                    const Icon = getSocialIcon(k);
                    return (
                      <a
                        key={k}
                        href={String(v).startsWith('http') ? String(v) : `https://${v}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-neon-violet transition-colors bg-white/[0.03] px-2 py-1 rounded-lg"
                      >
                        <Icon className="h-3.5 w-3.5" /> {k}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Personal Card */}
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Cá nhân
              </h2>
              {isOwn && (
                <button
                  type="button"
                  onClick={() => setActiveModal('personal')}
                  className="text-xs text-neon-violet hover:underline"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
            <div className="space-y-2 text-sm">
              {p.bio && (
                <div className="text-text-secondary whitespace-pre-wrap">{p.bio}</div>
              )}
              {p.websiteUrl && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Link2 className="h-4 w-4 shrink-0 text-text-muted" />
                  <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-neon-violet hover:underline truncate">
                    {p.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {p.education && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <GraduationCap className="h-4 w-4 shrink-0 text-text-muted" />
                  <span>{p.education}</span>
                </div>
              )}
            </div>
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
        <div className="flex-1 min-w-0 max-w-[700px]">
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
        <div className="w-80 shrink-0">
          {/* Placeholder for future content */}
        </div>
      </div>

      {/* ─── Bio Edit Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'bio' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => !savingModal && setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-darkborder bg-[#0d0f18] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-darkborder/60 px-5 py-3.5">
                <h3 className="text-sm font-semibold text-text-primary">Sửa tiểu sử</h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
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
                  rows={6}
                  className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none resize-none"
                  placeholder="Viết vài dòng về bạn..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={saveBio}
                    disabled={savingModal}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-violet to-neon-pink px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    {savingModal ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Lưu
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Contact Edit Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'contact' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => !savingModal && setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-darkborder bg-[#0d0f18] shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-darkborder/60 px-5 py-3.5 sticky top-0 bg-[#0d0f18] z-10">
                <h3 className="text-sm font-semibold text-text-primary">Chỉnh sửa thông tin liên hệ</h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg p-1 text-text-muted hover:bg-white/5 hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Họ và tên</label>
                  <input
                    type="text"
                    value={contactDraft.fullName}
                    onChange={(e) => setContactDraft(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                {/* Display Name */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Tên hiển thị</label>
                  <input
                    type="text"
                    value={contactDraft.displayName}
                    onChange={(e) => setContactDraft(prev => ({ ...prev, displayName: e.target.value }))}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    placeholder="Tên bạn muốn hiển thị"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Email</label>
                  <input
                    type="email"
                    value={contactDraft.email}
                    onChange={(e) => setContactDraft(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Số điện thoại</label>
                  <input
                    type="tel"
                    value={contactDraft.phone}
                    onChange={(e) => setContactDraft(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    placeholder="0123456789"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Giới tính</label>
                  <select
                    value={contactDraft.gender}
                    onChange={(e) => setContactDraft(prev => ({ ...prev, gender: e.target.value as any }))}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary focus:border-neon-violet/50 focus:outline-none"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                {/* Birth Year */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Năm sinh</label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={contactDraft.birthYear}
                    onChange={(e) => setContactDraft(prev => ({ ...prev, birthYear: e.target.value }))}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    placeholder="1990"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Địa chỉ</label>
                  <input
                    type="text"
                    value={contactDraft.location}
                    onChange={(e) => setContactDraft(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    placeholder="TP. Hồ Chí Minh, Việt Nam"
                  />
                </div>

                {/* Work */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Nơi làm việc</label>
                  <input
                    type="text"
                    value={contactDraft.work}
                    onChange={(e) => setContactDraft(prev => ({ ...prev, work: e.target.value }))}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    placeholder="Công ty ABC"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={saveContact}
                    disabled={savingModal}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-violet to-neon-pink px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    {savingModal ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                    Lưu
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Personal Edit Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {activeModal === 'personal' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
            onClick={() => !savingModal && setActiveModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg overflow-hidden rounded-2xl border border-darkborder bg-[#0d0f18] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-darkborder/60 px-5 py-3.5">
                <h3 className="text-sm font-semibold text-text-primary">Chỉnh sửa thông tin cá nhân</h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg p-1 text-text-muted hover:bg-white/5 hover:text-text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-5 space-y-4">
                {/* Bio */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Tiểu sử</label>
                  <textarea
                    value={bioDraft}
                    onChange={(e) => setBioDraft(e.target.value)}
                    maxLength={2000}
                    rows={4}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none resize-none"
                    placeholder="Viết vài dòng về bạn..."
                  />
                </div>

                {/* Website */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Website</label>
                  <input
                    type="url"
                    value={personalDraft.websiteUrl}
                    onChange={(e) => setPersonalDraft(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Học vấn</label>
                  <input
                    type="text"
                    value={personalDraft.education}
                    onChange={(e) => setPersonalDraft(prev => ({ ...prev, education: e.target.value }))}
                    className="w-full rounded-lg border border-darkborder bg-darkbg/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
                    placeholder="Đại học XYZ"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-white/5"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={savePersonal}
                    disabled={savingModal}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-neon-violet to-neon-pink px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                  >
                    {savingModal ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
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
