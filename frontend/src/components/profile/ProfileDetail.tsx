'use client';

/**
 * ProfileDetail — Professional Facebook/Instagram Style Profile Page
 *
 * Features:
 * - ~1050px centered layout (FB-style), cover 16:6 with avatar overlap
 * - Avatar circular crop + cover reposition via react-easy-crop → R2 upload
 * - Sticky top tab bar: Posts | About | Friends | Photos | Videos
 * - Two-column Posts view: Intro/Photos/Friends sidebar + composer & feed
 * - About section with sub-tabs + inline edit (correct User/UserProfile routing)
 * - Functional settings menu, real followers in the Friends card
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Edit3, Globe, Camera, Loader2, Check,
  Mail, Phone, Briefcase, GraduationCap, Heart, User,
  Link2, Image as ImageIcon, Settings, Grid3X3, UserPlus, UserCheck, MoreHorizontal,
  Facebook, Twitter, Github, Linkedin, Youtube, Instagram,
  Home, Star, Building, MapPinned, MapPinHouse, Info,
  CalendarDays, Briefcase as WorkIcon, Link as LinkIcon, Copy, Lock, Crown,
  LayoutGrid, List, Play, MessageCircle, Search, UserMinus, UserX, Eye, ChevronDown, Ban, SquarePen,
  Rss, Clock3, School, Users,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import Cropper from 'react-easy-crop';
import { socialUserApi, fileApi, friendApi, type FriendStatus } from '@/lib/api';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useSocialStore } from '@/store/socialStore';
import { useMessagingStore } from '@/store/messagingStore';
import { moChatNho } from '@/lib/miniChat';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getBot } from '@/lib/botRegistry';
import { BotProfileBanner } from '@/components/profile/BotProfileBanner';
import { getCroppedImg, type PixelCrop } from './cropImage';

// Dynamic imports — heavy client components
const PostCard = dynamic(
  () => import('@/components/social/PostCard').then((m) => m.PostCard as ComponentType<{ post: any }>),
  { loading: () => <div className="h-48 animate-pulse rounded-2xl bg-[var(--bg-glass)]" /> },
);
const PostComposer = dynamic(
  () => import('@/components/social/PostComposer').then((m) => m.PostComposer as ComponentType),
  { ssr: false, loading: () => <div className="h-32 animate-pulse rounded-2xl bg-[var(--bg-glass)]" /> },
);

type MainTab = 'posts' | 'about' | 'friends' | 'photos' | 'videos';
type AboutTab = 'overview' | 'work' | 'places' | 'contact' | 'details';

interface ExtendedProfile {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  gender?: string;
  birthYear?: number;
  phone?: string;
  location?: string;
  hometown?: string;
  work?: string;
  workplace?: string;
  jobTitle?: string;
  school?: string;
  college?: string;
  education?: string;
  websiteUrl?: string;
  relationshipStatus?: string;
  languages?: string[];
  hobbies?: string;
  socialLinks?: Record<string, string>;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  isOnline?: boolean;
  lastActiveAt?: string | null;
  createdAt?: string;
  isPro?: boolean;
}

const socialIcons: Record<string, ComponentType<{ className?: string }>> = {
  facebook: Facebook, twitter: Twitter, github: Github, linkedin: Linkedin,
  youtube: Youtube, instagram: Instagram, website: Globe, web: Globe,
};

const aboutTabs: { id: AboutTab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Tổng quan', icon: Grid3X3 },
  { id: 'work', label: 'Công việc và học vấn', icon: Briefcase },
  { id: 'places', label: 'Nơi từng sống', icon: MapPinned },
  { id: 'contact', label: 'Thông tin liên hệ và cơ bản', icon: Phone },
  { id: 'details', label: 'Chi tiết về bạn', icon: Info },
];

const mainTabs: { id: MainTab; label: string }[] = [
  { id: 'posts', label: 'Bài viết' },
  { id: 'about', label: 'Giới thiệu' },
  { id: 'friends', label: 'Bạn bè' },
  { id: 'photos', label: 'Ảnh' },
  { id: 'videos', label: 'Video' },
];

export function ProfileDetail({ userId: propUserId }: { userId?: number } = {}) {
  const params = useParams<{ id: string }>();
  const id = propUserId ?? Number(params?.id);
  const { user: currentUser, updateProfile: updateAuthProfile } = useAuthStore();
  const queryClient = useQueryClient();

  // ─── State ───────────────────────────────────────────────────
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState<MainTab>('posts');
  const [aboutTab, setAboutTab] = useState<AboutTab>('overview');
  const [editingSection, setEditingSection] = useState<AboutTab | null>(null);

  // Posts
  // Profile posts are rendered THROUGH the shared social store so the
  // full PostCard (which optimistically mutates useSocialStore.posts on
  // like/react/comment/save) reflects those interactions here too. We
  // seed the store from getUserPosts in loadPosts below. The home feed
  // refetches into the store on its own mount, so replacing it here is
  // safe.
  const storePosts = useSocialStore((s) => s.posts);
  const [postsCursor, setPostsCursor] = useState<number | null>(null);
  const [postsHasMore, setPostsHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const postsSentinelRef = useRef<HTMLDivElement | null>(null);
  /** 401 khi chưa đăng nhập ⇒ dừng hẳn (trước đây lỗi giữ hasMore=true ⇒ ô canh cuộn gọi lại vô tận, 11/11/2026). */
  const [postsLocked, setPostsLocked] = useState(false);

  // Media (photos + videos)
  const [media, setMedia] = useState<any[]>([]);
  const [mediaCursor, setMediaCursor] = useState<number | null>(null);
  const [mediaHasMore, setMediaHasMore] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const mediaSentinelRef = useRef<HTMLDivElement | null>(null);

  // Friends tab — người theo dõi / đang theo dõi / bạn bè (chỉ chủ trang có danh sách bạn bè)
  const [friends, setFriends] = useState<any[]>([]);
  const [friendsCursor, setFriendsCursor] = useState<number | null>(null);
  const [followingList, setFollowingList] = useState<any[] | null>(null);
  const [followingCursor, setFollowingCursor] = useState<number | null>(null);
  const [myFriends, setMyFriends] = useState<any[] | null>(null);
  const [myFriendsCursor, setMyFriendsCursor] = useState<number | null>(null);
  const [friendsSub, setFriendsSub] = useState<'followers' | 'following' | 'friends'>('followers');
  const [friendsQuery, setFriendsQuery] = useState('');
  const [loadingList, setLoadingList] = useState(false);

  // Upload + crop
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  /** URL ảnh đại diện vừa tải lỗi ⇒ hiện chữ cái đầu thay vì một vòng tròn trống. Đổi ảnh (URL khác) là thử lại. */
  const [anhLoi, setAnhLoi] = useState<string | null>(null);
  const [showImageCropper, setShowImageCropper] = useState<'avatar' | 'cover' | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);

  // Follow
  const [following, setFollowing] = useState<boolean | null>(null);
  const [followBusy, setFollowBusy] = useState(false);
  // Two-way friend relationship (independent of follow). Comes from
  // the enhanced profile payload (getEnhancedPublicProfile).
  const [friendStatus, setFriendStatus] = useState<FriendStatus | null>(null);
  const [friendBusy, setFriendBusy] = useState(false);

  // Settings menu
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // Edit form
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const isOwn = currentUser?.id === id;
  const router = useRouter();

  // ─── Kiểu Facebook (11/11/2026) ──────────────────────────────
  /** "Xem với tư cách người khác": chủ trang thấy trang như khách (ẩn mọi nút sửa). */
  const [previewPublic, setPreviewPublic] = useState(false);
  const own = isOwn && !previewPublic;
  const [postView, setPostView] = useState<'list' | 'grid'>('list');
  const [showFriendMenu, setShowFriendMenu] = useState(false);
  const friendMenuRef = useRef<HTMLDivElement | null>(null);
  /** Thanh tab dính: khi tên đã cuộn khuất thì hiện ảnh + tên thu nhỏ ở đầu thanh. */
  const [compact, setCompact] = useState(false);
  const nameRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  /** Cột trái dính kiểu Facebook: cột dài hơn màn hình thì dính theo ĐÁY, không bị cắt. */
  const leftRef = useRef<HTMLDivElement | null>(null);
  const [leftTop, setLeftTop] = useState(132);
  const peerOnline = useMessagingStore((s) => s.presence.byUserId[id]?.online ?? false);
  const realtimeOn = useMessagingStore((s) => s.isConnected);

  const navH = () => {
    if (typeof window === 'undefined') return 64;
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-nav-h'));
    // --app-nav-h tính bằng rem (4rem) ⇒ đổi ra px.
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return Number.isFinite(v) && v > 0 ? (v < 20 ? v * rem : v) : 64;
  };

  useEffect(() => {
    const onScroll = () => {
      const el = nameRef.current;
      if (!el) return;
      setCompact(el.getBoundingClientRect().bottom < navH() + 56);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    const el = leftRef.current;
    if (!el) return;
    const place = () => {
      const top = navH() + 52 + 16;
      setLeftTop(Math.min(top, window.innerHeight - el.offsetHeight - 16));
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    window.addEventListener('resize', place);
    return () => { ro.disconnect(); window.removeEventListener('resize', place); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, mainTab]);

  useEffect(() => {
    if (!showFriendMenu) return;
    const onClick = (e: MouseEvent) => {
      if (friendMenuRef.current && !friendMenuRef.current.contains(e.target as Node)) setShowFriendMenu(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowFriendMenu(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [showFriendMenu]);

  // Đổi trang cá nhân khác ⇒ đặt lại các danh sách phụ.
  useEffect(() => {
    setFollowingList(null); setMyFriends(null); setFriendsSub('followers'); setFriendsQuery('');
    setPreviewPublic(false); setMainTab('posts');
  }, [id]);

  const loadMoreFollowers = useCallback(async () => {
    if (!id || !friendsCursor || loadingList) return;
    setLoadingList(true);
    try {
      const res: any = await socialUserApi.getFollowers(id, friendsCursor, 24);
      setFriends((prev) => [...prev, ...(res.data?.data?.users ?? [])]);
      setFriendsCursor(res.data?.data?.nextCursor ?? null);
    } catch { toast.error('Không tải thêm được'); } finally { setLoadingList(false); }
  }, [id, friendsCursor, loadingList]);

  const loadFollowing = useCallback(async (reset: boolean) => {
    if (!id || loadingList) return;
    setLoadingList(true);
    try {
      const res: any = await socialUserApi.getFollowing(id, reset ? undefined : followingCursor ?? undefined, 24);
      const list = res.data?.data?.users ?? [];
      setFollowingList((prev) => (reset || !prev ? list : [...prev, ...list]));
      setFollowingCursor(res.data?.data?.nextCursor ?? null);
    } catch { toast.error('Không tải được danh sách đang theo dõi'); setFollowingList((p) => p ?? []); } finally { setLoadingList(false); }
  }, [id, followingCursor, loadingList]);

  const loadMyFriends = useCallback(async (reset: boolean) => {
    if (loadingList) return;
    setLoadingList(true);
    try {
      const res: any = await friendApi.listFriends(reset ? undefined : myFriendsCursor ?? undefined, 24);
      const list = res.data?.data?.users ?? [];
      setMyFriends((prev) => (reset || !prev ? list : [...prev, ...list]));
      setMyFriendsCursor(res.data?.data?.nextCursor ?? null);
    } catch { toast.error('Không tải được danh sách bạn bè'); setMyFriends((p) => p ?? []); } finally { setLoadingList(false); }
  }, [myFriendsCursor, loadingList]);

  useEffect(() => {
    if (mainTab !== 'friends') return;
    if (friendsSub === 'following' && followingList === null) void loadFollowing(true);
    if (friendsSub === 'friends' && myFriends === null) void loadMyFriends(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainTab, friendsSub]);

  /** Đổi tab; nếu đang cuộn sâu thì đưa thanh tab về sát đầu trang để thấy nội dung mới. */
  const goTab = (t: MainTab) => {
    setMainTab(t);
    const el = tabsRef.current;
    if (el && compact) {
      const y = el.getBoundingClientRect().top + window.scrollY - navH();
      window.scrollTo({ top: Math.max(0, y - 1), behavior: 'smooth' });
    }
  };

  const requireLogin = () => {
    if (previewPublic) {
      toast.info('Đang xem trước với tư cách người khác — các nút này chỉ để xem.');
      return true;
    }
    if (currentUser) return false;
    router.push('/login');
    return true;
  };

  const openMessage = () => {
    if (requireLogin() || !profile) return;
    const ok = moChatNho({
      id,
      username: profile.username,
      displayName: profile.displayName || profile.fullName || profile.username,
      avatarUrl: profile.avatarUrl ?? null,
    });
    if (!ok) router.push(`/messages?peer=${id}`);
  };

  const declineFriend = async () => {
    setShowFriendMenu(false);
    setFriendBusy(true);
    try { await friendApi.respond(id, false); setFriendStatus('none'); toast.success('Đã xoá lời mời'); }
    catch { toast.error('Không thể thực hiện'); } finally { setFriendBusy(false); }
  };

  const blockUser = async () => {
    setShowSettings(false);
    if (requireLogin()) return;
    const ten = profile?.displayName || profile?.fullName || profile?.username || 'người này';
    if (!window.confirm(`Chặn ${ten}? Hai bạn sẽ không nhắn tin được cho nhau. Bỏ chặn ở Cài đặt › Quyền riêng tư.`)) return;
    try { await useMessagingStore.getState().blockUser(id); toast.success(`Đã chặn ${ten}`); }
    catch { toast.error('Không chặn được, thử lại sau'); }
  };

  // ─── Load profile ─────────────────────────────────────────────
  const loadProfile = useCallback(async () => {
    if (!id || !Number.isFinite(id)) return;
    try {
      const res: any = await socialUserApi.getProfile(id);
      const data = res.data?.data ?? res.data;
      const normalized: ExtendedProfile = {
        ...data,
        languages: typeof data.languages === 'string'
          ? data.languages.split(',').map((s: string) => s.trim()).filter(Boolean)
          : (data.languages ?? []),
      };
      setProfile(normalized);
      setFollowing(normalized.isFollowing ?? null);
      setFriendStatus((data.friendStatus as FriendStatus) ?? 'none');
    } catch {
      toast.error('Không tải được profile');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    void loadProfile();
  }, [loadProfile]);

  // ─── Loaders ──────────────────────────────────────────────────
  const loadPosts = useCallback(async (reset = false) => {
    if (!id || loadingPosts || (!reset && !postsHasMore)) return;
    setLoadingPosts(true);
    // On a fresh load, clear the store first so we never briefly show the
    // home feed's posts (which may still be in the store from a prior
    // page) before this profile's posts arrive.
    if (reset) useSocialStore.setState({ posts: [] });
    try {
      const res: any = await socialUserApi.getUserPosts(id, {
        cursor: reset ? undefined : postsCursor ?? undefined, limit: 20,
      });
      const { items, nextCursor, hasMore } = res.data?.data ?? {};
      // Render THROUGH the store so PostCard's optimistic interaction
      // updates (like/react/comment/save) land where the profile reads.
      useSocialStore.setState((s) => ({
        posts: reset ? (items ?? []) : [...s.posts, ...(items ?? [])],
      }));
      setPostsCursor(nextCursor);
      setPostsHasMore(hasMore);
      setPostsLocked(false);
    } catch (err: any) {
      setPostsHasMore(false);
      if (err?.response?.status === 401) setPostsLocked(true);
      else toast.error('Không tải được bài viết');
    } finally {
      setLoadingPosts(false);
    }
  }, [id, postsCursor, postsHasMore, loadingPosts]);

  const loadMedia = useCallback(async (reset = false) => {
    if (!id || loadingMedia || (!reset && !mediaHasMore)) return;
    setLoadingMedia(true);
    try {
      const res: any = await socialUserApi.getUserMedia(id, {
        cursor: reset ? undefined : mediaCursor ?? undefined, limit: 30,
      });
      const { items, nextCursor, hasMore } = res.data?.data ?? {};
      setMedia((prev) => (reset ? (items ?? []) : [...prev, ...(items ?? [])]));
      setMediaCursor(nextCursor);
      setMediaHasMore(hasMore);
    } catch (err: any) {
      setMediaHasMore(false);
      if (err?.response?.status !== 401) toast.error('Không tải được ảnh/video');
    } finally {
      setLoadingMedia(false);
    }
  }, [id, mediaCursor, mediaHasMore, loadingMedia]);

  const loadFriends = useCallback(async () => {
    if (!id) return;
    try {
      const res: any = await socialUserApi.getFollowers(id, undefined, 24);
      const list = res.data?.data?.users ?? res.data?.data?.items ?? res.data?.data ?? [];
      setFriends(Array.isArray(list) ? list : []);
      setFriendsCursor(res.data?.data?.nextCursor ?? null);
    } catch {
      /* non-fatal — Friends card just stays empty */
    }
  }, [id]);

  // Initial content load once we have an id (so sidebar cards populate too)
  useEffect(() => {
    if (!id || !Number.isFinite(id)) return;
    void loadPosts(true);
    void loadMedia(true);
    void loadFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Infinite scroll — posts
  useEffect(() => {
    if (mainTab !== 'posts') return;
    const node = postsSentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && postsHasMore && !loadingPosts) void loadPosts(false);
    }, { rootMargin: '300px' });
    obs.observe(node);
    return () => obs.disconnect();
  }, [mainTab, postsHasMore, loadingPosts, loadPosts]);

  // Infinite scroll — media
  useEffect(() => {
    if (mainTab !== 'photos' && mainTab !== 'videos') return;
    const node = mediaSentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && mediaHasMore && !loadingMedia) void loadMedia(false);
    }, { rootMargin: '300px' });
    obs.observe(node);
    return () => obs.disconnect();
  }, [mainTab, mediaHasMore, loadingMedia, loadMedia]);

  // Close settings menu on outside click / Esc
  useEffect(() => {
    if (!showSettings) return;
    const onClick = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) setShowSettings(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowSettings(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [showSettings]);

  // ─── Image upload (crop → R2) ─────────────────────────────────
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Vui lòng chọn file hình ảnh'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Kích thước file quá lớn (tối đa 5MB)'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setShowImageCropper(type);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleImageUpload = async () => {
    if (!imagePreview) return;
    setUploadingImage(true);
    try {
      const blob = croppedAreaPixels
        ? await getCroppedImg(imagePreview, croppedAreaPixels)
        : await (await fetch(imagePreview)).blob();
      const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });

      const uploadRes: any = await fileApi.upload(file, 'images');
      const imageUrl = uploadRes.data?.data?.url;
      if (!imageUrl) throw new Error('Upload thất bại');

      if (showImageCropper === 'avatar') {
        await authApi.updateProfile({ avatarUrl: imageUrl });
        setProfile((prev) => (prev ? { ...prev, avatarUrl: imageUrl } : prev));
        // Sync the auth store so the navbar/composer show the new photo immediately.
        updateAuthProfile({ avatarUrl: imageUrl });
        toast.success('Cập nhật ảnh đại diện thành công');
      } else {
        await socialUserApi.updateCoverPhoto(imageUrl);
        setProfile((prev) => (prev ? { ...prev, coverPhotoUrl: imageUrl } : prev));
        toast.success('Cập nhật ảnh bìa thành công');
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setShowImageCropper(null);
      setImagePreview(null);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải lên hình ảnh');
    } finally {
      setUploadingImage(false);
    }
  };

  // ─── Follow ───────────────────────────────────────────────────
  const toggleFollow = async () => {
    if (!id || followBusy) return;
    setFollowBusy(true);
    try {
      const res: any = await socialUserApi.toggleFollow(id);
      setFollowing(!!(res?.data?.data?.isFollowing ?? !following));
      setProfile((prev) => prev ? {
        ...prev,
        isFollowing: !prev.isFollowing,
        followerCount: (prev.followerCount ?? 0) + (prev.isFollowing ? -1 : 1),
      } : prev);
    } catch {
      toast.error('Không thể thực hiện');
    } finally {
      setFollowBusy(false);
    }
  };

  // ─── Friend (two-way, independent of follow) ──────────────────
  const toggleFriend = async () => {
    if (!id || friendBusy || friendStatus === null) return;
    setFriendBusy(true);
    try {
      if (friendStatus === 'none') {
        const res = await friendApi.sendRequest(id);
        setFriendStatus(res.data.data.status);
      } else if (friendStatus === 'pending_outgoing') {
        await friendApi.cancel(id);
        setFriendStatus('none');
      } else if (friendStatus === 'pending_incoming') {
        await friendApi.respond(id, true);
        setFriendStatus('friends');
      } else if (friendStatus === 'friends') {
        await friendApi.unfriend(id);
        setFriendStatus('none');
      }
    } catch {
      toast.error('Không thể thực hiện');
    } finally {
      setFriendBusy(false);
    }
  };

  // ─── Save About edits (correct field routing) ─────────────────
  const saveProfileUpdate = async () => {
    setSaving(true);
    try {
      // User-table fields (read back by getEnhancedPublicProfile).
      const authFields = ['fullName', 'displayName', 'bio', 'phone', 'gender', 'birthYear'];
      // UserProfile-table fields.
      const profileFields = ['location', 'work', 'education', 'websiteUrl', 'hometown',
        'jobTitle', 'workplace', 'school', 'college', 'relationshipStatus', 'hobbies', 'languages'];

      const authUpdates: any = {};
      const profileUpdates: any = {};
      for (const [key, value] of Object.entries(editForm)) {
        if (authFields.includes(key)) {
          authUpdates[key] = key === 'birthYear' ? (value ? parseInt(value, 10) : null) : (value || null);
        } else if (profileFields.includes(key)) {
          profileUpdates[key] = value || null;
        }
      }
      if (Object.keys(authUpdates).length > 0) await authApi.updateProfile(authUpdates);
      if (Object.keys(profileUpdates).length > 0) await socialUserApi.updateOwnProfile(profileUpdates);

      setEditingSection(null);
      setEditForm({});
      toast.success('Đã cập nhật thông tin');
      await loadProfile(); // re-fetch so values display (proves read-path unification)
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch {
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (section: AboutTab) => {
    if (!profile) return;
    const p = profile;
    const f: Record<string, string> = {};
    switch (section) {
      case 'overview':
        f.bio = p.bio || ''; f.websiteUrl = p.websiteUrl || ''; f.relationshipStatus = p.relationshipStatus || '';
        break;
      case 'work':
        f.work = p.work || ''; f.workplace = p.workplace || ''; f.jobTitle = p.jobTitle || '';
        f.school = p.school || ''; f.college = p.college || '';
        break;
      case 'places':
        f.location = p.location || ''; f.hometown = p.hometown || '';
        break;
      case 'contact':
        f.phone = p.phone || ''; f.gender = p.gender || ''; f.birthYear = p.birthYear?.toString() || '';
        f.websiteUrl = p.websiteUrl || '';
        break;
      case 'details':
        f.bio = p.bio || ''; f.hobbies = p.hobbies || ''; f.languages = (p.languages || []).join(', ');
        break;
    }
    setEditForm(f);
    setEditingSection(section);
  };

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/profile/${id}/v2`);
      toast.success('Đã sao chép liên kết trang cá nhân');
    } catch {
      toast.error('Không sao chép được liên kết');
    }
    setShowSettings(false);
  };

  // ─── About content ────────────────────────────────────────────
  const renderAboutContent = () => {
    if (!profile) return null;
    const p = profile;
    switch (aboutTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            {p.bio ? <p className="text-text-secondary whitespace-pre-wrap">{p.bio}</p>
              : <p className="text-text-muted italic">Chưa có tiểu sử</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {p.work && <InfoItem icon={Briefcase} label="Công việc" value={p.work} />}
              {p.workplace && <InfoItem icon={Building} label="Nơi làm việc" value={p.workplace} />}
              {p.jobTitle && <InfoItem icon={Star} label="Vị trí" value={p.jobTitle} />}
              {p.location && <InfoItem icon={MapPinHouse} label="Sống tại" value={p.location} />}
              {p.hometown && <InfoItem icon={Home} label="Đến từ" value={p.hometown} />}
              {p.relationshipStatus && <InfoItem icon={Heart} label="Tình trạng" value={p.relationshipStatus} />}
              {p.websiteUrl && <InfoItem icon={Globe} label="Website" value={p.websiteUrl} isLink />}
            </div>
          </div>
        );
      case 'work':
        return (
          <div className="space-y-4">
            {p.work || p.workplace || p.jobTitle ? (
              <div className="p-4 rounded-xl bg-[var(--bg-surface)] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neon-violet/10"><Briefcase className="h-5 w-5 text-tone-violet" /></div>
                <div>
                  {p.jobTitle && <p className="font-medium text-text-primary">{p.jobTitle}</p>}
                  {p.work && <p className="text-sm text-text-secondary">{p.work}</p>}
                  {p.workplace && <p className="text-sm text-text-muted">{p.workplace}</p>}
                </div>
              </div>
            ) : <p className="text-text-muted italic">Chưa cập nhật thông tin công việc</p>}
            {(p.school || p.college) && (
              <div className="p-4 rounded-xl bg-[var(--bg-surface)] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10"><GraduationCap className="h-5 w-5 text-emerald-500" /></div>
                <div>
                  {p.school && <p className="font-medium text-text-primary">{p.school}</p>}
                  {p.college && <p className="text-sm text-text-muted">{p.college}</p>}
                </div>
              </div>
            )}
          </div>
        );
      case 'places':
        return (
          <div className="space-y-4">
            {p.location ? (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-surface)]">
                <MapPinHouse className="h-5 w-5 text-tone-violet" />
                <div><p className="text-sm text-text-muted">Thành phố hiện tại</p><p className="font-medium text-text-primary">{p.location}</p></div>
              </div>
            ) : <p className="text-text-muted italic">Chưa cập nhật nơi ở</p>}
            {p.hometown && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-surface)]">
                <Home className="h-5 w-5 text-emerald-500" />
                <div><p className="text-sm text-text-muted">Quê quán</p><p className="font-medium text-text-primary">{p.hometown}</p></div>
              </div>
            )}
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-3">
            {p.email && <InfoItem icon={Mail} label="Email" value={p.email} />}
            {p.phone && <InfoItem icon={Phone} label="Điện thoại" value={p.phone} />}
            {p.gender && <InfoItem icon={User} label="Giới tính" value={p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'} />}
            {p.birthYear && <InfoItem icon={CalendarDays} label="Năm sinh" value={`${p.birthYear}`} />}
            {p.websiteUrl && <InfoItem icon={Globe} label="Website" value={p.websiteUrl} isLink />}
            {p.socialLinks && Object.keys(p.socialLinks).length > 0 && (
              <div className="pt-2">
                <h3 className="text-sm font-medium text-text-muted mb-2">Liên kết</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(p.socialLinks).map(([key, url]) => {
                    const Icon = socialIcons[key.toLowerCase()] || Link2;
                    return (
                      <a key={key} href={String(url)} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-glass)] border border-[var(--border-color)] text-sm text-text-secondary hover:text-tone-violet hover:border-neon-violet/50 transition-colors">
                        <Icon className="h-4 w-4" />{key.charAt(0).toUpperCase() + key.slice(1)}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      case 'details':
        return (
          <div className="space-y-4">
            {p.bio && <div><h3 className="text-sm font-medium text-text-muted mb-2">Giới thiệu</h3><p className="text-text-secondary whitespace-pre-wrap">{p.bio}</p></div>}
            {p.hobbies && <div><h3 className="text-sm font-medium text-text-muted mb-2">Sở thích</h3><p className="text-text-secondary">{p.hobbies}</p></div>}
            {p.languages && p.languages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-text-muted mb-2">Ngôn ngữ</h3>
                <div className="flex flex-wrap gap-2">
                  {p.languages.map((lang, i) => <span key={i} className="px-3 py-1 rounded-full bg-[var(--bg-glass)] border border-[var(--border-color)] text-sm text-text-secondary">{lang}</span>)}
                </div>
              </div>
            )}
            {!p.bio && !p.hobbies && (!p.languages || p.languages.length === 0) && <p className="text-text-muted italic">Chưa có thông tin chi tiết</p>}
          </div>
        );
      default: return null;
    }
  };

  // ─── Loading skeleton ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full pb-10">
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-color)]">
          <div className="mx-auto max-w-[1250px]">
            <div className="h-[200px] sm:h-[300px] lg:h-[420px] animate-pulse lg:rounded-b-xl bg-[var(--bg-surface)]" />
          </div>
          <div className="mx-auto max-w-[1100px] px-4 lg:px-8 pb-6 flex flex-col items-center lg:flex-row lg:items-end gap-4">
            <div className="-mt-[70px] lg:-mt-[84px] h-[140px] w-[140px] lg:h-[176px] lg:w-[176px] rounded-full animate-pulse bg-[var(--bg-surface)] ring-4 ring-[var(--bg-card)]" />
            <div className="space-y-2 lg:pb-4"><div className="h-7 w-56 rounded animate-pulse bg-[var(--bg-surface)]" /><div className="h-4 w-40 rounded animate-pulse bg-[var(--bg-surface)]" /></div>
          </div>
        </div>
        <div className="mx-auto max-w-[1100px] px-4 lg:px-8 mt-4 flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-[42%] space-y-4"><div className="h-[360px] animate-pulse rounded-xl bg-[var(--bg-card)]" /></div>
          <div className="flex-1 space-y-4"><div className="h-28 animate-pulse rounded-xl bg-[var(--bg-card)]" /><div className="h-64 animate-pulse rounded-xl bg-[var(--bg-card)]" /></div>
        </div>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="mx-auto max-w-[680px] px-4 py-16">
        <div className={cn(CARD, 'p-12 text-center')}>
          <UserX className="h-12 w-12 mx-auto text-text-muted mb-3" />
          <p className="text-lg font-semibold text-text-primary">Không tìm thấy người dùng</p>
          <p className="text-sm text-text-muted mt-1">Liên kết có thể đã hỏng hoặc trang đã bị gỡ.</p>
        </div>
      </div>
    );
  }

  const p = profile;
  const cover = p.coverPhotoUrl;
  const ten = p.displayName || p.fullName || p.username;
  // Guard against empty/null media URLs so they never render as black tiles.
  const videos = media.filter((m) => m.type === 'VIDEO' && (m.url || m.thumbnail));
  const photos = media.filter((m) => m.type !== 'VIDEO' && (m.url || m.thumbnail));
  /** Chủ trang luôn "đang hoạt động" khi đang kết nối realtime; người khác: server + socket. */
  const online = isOwn ? realtimeOn || !!p.isOnline : peerOnline || !!p.isOnline;
  const hoatDongLuc = !online && p.lastActiveAt ? thoiGianTruoc(p.lastActiveAt) : null;

  // Automated news-bot account? → polished bot hero instead of the normal
  // cover/avatar header. The tab bar + posts list below are unchanged.
  const bot = getBot(p.username);

  const followerList = friends;
  const listForSub = friendsSub === 'followers' ? followerList : friendsSub === 'following' ? (followingList ?? []) : (myFriends ?? []);
  const kw = friendsQuery.trim().toLowerCase();
  const listShown = kw
    ? listForSub.filter((f: any) => `${f.displayName ?? ''} ${f.fullName ?? ''} ${f.username ?? ''}`.toLowerCase().includes(kw))
    : listForSub;
  const subHasMore = friendsSub === 'followers' ? !!friendsCursor : friendsSub === 'following' ? !!followingCursor : !!myFriendsCursor;
  const subLoading = loadingList && (friendsSub !== 'following' || followingList !== null) && (friendsSub !== 'friends' || myFriends !== null);

  const btnPrimary = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[var(--accent-color)] px-4 h-9 text-[15px] font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60';
  const btnGrey = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[color-mix(in_srgb,var(--text-primary)_9%,var(--bg-card))] px-4 h-9 text-[15px] font-semibold text-text-primary hover:bg-[color-mix(in_srgb,var(--text-primary)_15%,var(--bg-card))] transition-colors disabled:opacity-60';
  const menuItem = 'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-[15px] font-medium text-text-primary hover:bg-[var(--bg-surface-hover)] transition-colors text-left';

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="w-full pb-10">
      {previewPublic && (
        <div className="sticky top-[var(--app-nav-h)] z-[31] bg-[var(--accent-color)] text-white text-sm">
          <div className="mx-auto max-w-[1100px] px-4 h-10 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2"><Eye className="h-4 w-4" />Bạn đang xem trang cá nhân của mình với tư cách người khác.</span>
            <button onClick={() => setPreviewPublic(false)} className="rounded-md bg-white/20 hover:bg-white/30 px-3 py-1 font-semibold">Thoát chế độ xem</button>
          </div>
        </div>
      )}

      {/* ══ Dải đầu trang: ảnh bìa rộng + ảnh đại diện đè mép + tên + nút ══ */}
      <section className="bg-[var(--bg-card)] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        {bot ? (
          <div className="mx-auto max-w-[1100px] px-4 lg:px-8 pt-4 pb-2">
            <BotProfileBanner bot={bot} displayName={ten} followerCount={p.followerCount ?? 0} />
          </div>
        ) : (
          <>
            {/* Ảnh bìa — gần tràn khung như Facebook (tối đa 1250px), bo góc dưới trên màn lớn */}
            <div className="mx-auto max-w-[1250px]">
              <div
                className="relative h-[200px] sm:h-[300px] md:h-[360px] lg:h-[420px] xl:h-[460px] w-full overflow-hidden lg:rounded-b-xl"
                style={!cover ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' } : undefined}
              >
                {cover && (/* eslint-disable-next-line @next/next/no-img-element */ <img src={cover} alt="Ảnh bìa" className="w-full h-full object-cover" />)}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
                {own && (
                  <label className="absolute bottom-4 right-4 cursor-pointer inline-flex items-center gap-2 rounded-lg bg-[var(--bg-card)] px-3 h-9 text-[15px] font-semibold text-text-primary shadow-md hover:bg-[var(--bg-surface)] transition-colors" aria-label="Chỉnh sửa ảnh bìa">
                    {uploadingImage && showImageCropper === 'cover' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    <span className="hidden sm:inline">{cover ? 'Chỉnh sửa ảnh bìa' : 'Thêm ảnh bìa'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, 'cover')} />
                  </label>
                )}
              </div>
            </div>

            <div className="mx-auto max-w-[1100px] px-4 lg:px-8">
              <div className="flex flex-col items-center lg:flex-row lg:items-end gap-3 lg:gap-5 pb-4">
                {/* Ảnh đại diện: khung tròn cắt ảnh nằm TRONG, chấm xanh + nút máy ảnh nằm NGOÀI để không bị che */}
                <div className="relative z-10 -mt-[76px] lg:-mt-[88px] shrink-0">
                  <div className={cn('group relative h-[152px] w-[152px] lg:h-[176px] lg:w-[176px] rounded-full p-1 shadow-lg', p.isPro ? 'bg-gradient-to-br from-amber-300 via-amber-500 to-violet-500' : 'bg-[var(--bg-card)]')}>
                    <div className="h-full w-full rounded-full overflow-hidden ring-4 ring-[var(--bg-card)] bg-[var(--bg-surface)]">
                      {p.avatarUrl && anhLoi !== p.avatarUrl ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={p.avatarUrl} alt={`Ảnh đại diện của ${ten}`} className="w-full h-full object-cover" onError={() => setAnhLoi(p.avatarUrl ?? null)} />) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-violet via-neon-purple to-neon-pink">
                          <span className="text-6xl font-bold text-white drop-shadow-lg">{ten.slice(0, 1).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    {own && (
                      /* ⚠️ Lớp phủ PHẢI trong suốt: nó nằm đè lên ảnh. Commit 562f6379d từng đổi sang nền ĐẶC
                         ⇒ chủ trang thấy vòng tròn trống (09/11/2026). */
                      <label className="absolute inset-1 rounded-full cursor-pointer bg-transparent hover:bg-black/25 transition-colors" aria-label="Đổi ảnh đại diện">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, 'avatar')} />
                      </label>
                    )}
                  </div>
                  {/* Chấm "đang hoạt động": góc dưới-phải, trên đường tròn (45°), viền màu nền ⇒ luôn nhìn rõ */}
                  {online && (
                    <span
                      title="Đang hoạt động"
                      aria-label="Đang hoạt động"
                      className="absolute z-20 h-6 w-6 lg:h-7 lg:w-7 rounded-full bg-[#31a24c] ring-[5px] ring-[var(--bg-card)] right-[14px] bottom-[14px] lg:right-[17px] lg:bottom-[17px]"
                    />
                  )}
                  {/* Nút đổi ảnh đại diện (chủ trang): góc dưới-trái, đối xứng với chấm xanh */}
                  {own && (
                    <label className="absolute z-20 left-[6px] bottom-[10px] lg:left-[10px] lg:bottom-[12px] h-9 w-9 rounded-full bg-[color-mix(in_srgb,var(--text-primary)_9%,var(--bg-card))] ring-2 ring-[var(--bg-card)] flex items-center justify-center cursor-pointer hover:bg-[color-mix(in_srgb,var(--text-primary)_15%,var(--bg-card))] shadow" aria-label="Cập nhật ảnh đại diện" title="Cập nhật ảnh đại diện">
                      {uploadingImage && showImageCropper === 'avatar' ? <Loader2 className="h-[18px] w-[18px] animate-spin text-text-primary" /> : <Camera className="h-[18px] w-[18px] text-text-primary" />}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, 'avatar')} />
                    </label>
                  )}
                  {p.isPro && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white bg-gradient-to-r from-amber-400 to-violet-500 shadow ring-2 ring-[var(--bg-card)]">
                      <Crown className="w-3 h-3" /> PRO
                    </span>
                  )}
                </div>

                {/* Tên + số người theo dõi + mặt người theo dõi */}
                <div ref={nameRef} className="flex-1 min-w-0 w-full text-center lg:text-left lg:pb-3">
                  <h1 className="text-[28px] lg:text-[32px] leading-tight font-bold text-text-primary break-words">{ten}</h1>
                  <p className="text-[15px] text-text-secondary">
                    @{p.username}
                    {online && !isOwn && <span className="ml-2 inline-flex items-center gap-1 text-[#31a24c] font-medium"><span className="h-2 w-2 rounded-full bg-[#31a24c]" />Đang hoạt động</span>}
                    {hoatDongLuc && <span className="ml-2 text-text-muted">· Hoạt động {hoatDongLuc}</span>}
                  </p>
                  <div className="mt-1 flex items-center justify-center lg:justify-start gap-1.5 text-[15px] text-text-secondary flex-wrap">
                    <button onClick={() => { setFriendsSub('followers'); goTab('friends'); }} className="hover:underline"><strong className="text-text-primary font-semibold">{p.followerCount ?? 0}</strong> người theo dõi</button>
                    <span aria-hidden>•</span>
                    <button onClick={() => { setFriendsSub('following'); goTab('friends'); }} className="hover:underline"><strong className="text-text-primary font-semibold">{p.followingCount ?? 0}</strong> đang theo dõi</button>
                  </div>
                  {friends.length > 0 && (
                    <div className="mt-2 flex justify-center lg:justify-start -space-x-2">
                      {friends.slice(0, 8).map((f) => (
                        <a key={f.id} href={`/profile/${f.id}/v2`} title={f.displayName || f.username} className="relative inline-block h-8 w-8 rounded-full ring-2 ring-[var(--bg-card)] overflow-hidden bg-gradient-to-br from-neon-violet/40 to-neon-pink/40 hover:z-10">
                          {f.avatarUrl ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={f.avatarUrl} alt={f.displayName || f.username} className="h-full w-full object-cover" />) : <span className="flex h-full w-full items-center justify-center text-xs font-bold text-text-primary">{(f.displayName || f.username || '?').slice(0, 1).toUpperCase()}</span>}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Nút hành động */}
                <div className="flex gap-2 flex-wrap justify-center lg:justify-end lg:pb-4 w-full lg:w-auto">
                  {own ? (
                    <>
                      <button onClick={() => { goTab('posts'); window.setTimeout(() => document.getElementById('profile-composer')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50); }} className={cn(btnPrimary, 'max-sm:flex-1')}>
                        <SquarePen className="h-4 w-4" />Tạo bài viết
                      </button>
                      <button onClick={() => { goTab('about'); startEditing('overview'); }} className={cn(btnGrey, 'max-sm:flex-1')}>
                        <Edit3 className="h-4 w-4 shrink-0" /><span className="sm:hidden">Chỉnh sửa</span><span className="max-sm:hidden">Chỉnh sửa trang cá nhân</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Kết bạn (hai chiều, độc lập với theo dõi) */}
                      <div className="relative" ref={friendMenuRef}>
                        <button
                          onClick={() => {
                            if (requireLogin()) return;
                            if (friendStatus === 'friends' || friendStatus === 'pending_incoming') setShowFriendMenu((v) => !v);
                            else void toggleFriend();
                          }}
                          disabled={friendBusy || (!!currentUser && friendStatus === null)}
                          aria-haspopup={friendStatus === 'friends' || friendStatus === 'pending_incoming' ? 'menu' : undefined}
                          className={friendStatus === 'none' || friendStatus === 'pending_incoming' || !currentUser ? btnPrimary : btnGrey}
                        >
                          {friendBusy ? <Loader2 className="h-4 w-4 animate-spin" />
                            : friendStatus === 'friends' ? <UserCheck className="h-4 w-4" />
                            : friendStatus === 'pending_outgoing' ? <UserMinus className="h-4 w-4" />
                            : friendStatus === 'pending_incoming' ? <UserCheck className="h-4 w-4" />
                            : <UserPlus className="h-4 w-4" />}
                          {friendStatus === 'friends' ? 'Bạn bè' : friendStatus === 'pending_outgoing' ? 'Huỷ lời mời' : friendStatus === 'pending_incoming' ? 'Phản hồi' : 'Thêm bạn bè'}
                          {(friendStatus === 'friends' || friendStatus === 'pending_incoming') && <ChevronDown className="h-4 w-4 -mr-1" />}
                        </button>
                        <AnimatePresence>
                          {showFriendMenu && (
                            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} role="menu"
                              className="absolute left-0 lg:left-auto lg:right-0 mt-2 w-60 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5 shadow-2xl z-50">
                              {friendStatus === 'pending_incoming' ? (
                                <>
                                  <button role="menuitem" className={menuItem} onClick={() => { setShowFriendMenu(false); void toggleFriend(); }}><Check className="h-5 w-5" />Xác nhận</button>
                                  <button role="menuitem" className={menuItem} onClick={declineFriend}><X className="h-5 w-5" />Xoá lời mời</button>
                                </>
                              ) : (
                                <>
                                  <button role="menuitem" className={menuItem} onClick={() => { setShowFriendMenu(false); void toggleFollow(); }}>
                                    {following ? <><UserMinus className="h-5 w-5" />Bỏ theo dõi</> : <><Rss className="h-5 w-5" />Theo dõi</>}
                                  </button>
                                  <button role="menuitem" className={menuItem} onClick={() => { setShowFriendMenu(false); if (window.confirm(`Huỷ kết bạn với ${ten}?`)) void toggleFriend(); }}><UserX className="h-5 w-5" />Huỷ kết bạn</button>
                                </>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <button onClick={openMessage} className={friendStatus === 'friends' ? btnPrimary : btnGrey}>
                        <MessageCircle className="h-4 w-4" />Nhắn tin
                      </button>
                      {friendStatus !== 'friends' && (
                        <button onClick={() => { if (!requireLogin()) void toggleFollow(); }} disabled={followBusy || (!!currentUser && following === null)} className={btnGrey}>
                          {followBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : following ? <Check className="h-4 w-4" /> : <Rss className="h-4 w-4" />}
                          {following ? 'Đang theo dõi' : 'Theo dõi'}
                        </button>
                      )}
                    </>
                  )}
                  {/* Menu ⌄ / ⋯ */}
                  <div className="relative" ref={settingsRef}>
                    <button onClick={() => setShowSettings((v) => !v)} aria-label="Tuỳ chọn khác" aria-haspopup="menu" aria-expanded={showSettings} className={cn(btnGrey, 'px-3')}>
                      {own ? <ChevronDown className="h-5 w-5" /> : <MoreHorizontal className="h-5 w-5" />}
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          role="menu" className="absolute right-0 mt-2 w-72 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-1.5 shadow-2xl z-50">
                          {isOwn && (
                            <button role="menuitem" className={menuItem} onClick={() => { setShowSettings(false); setPreviewPublic((v) => !v); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                              <Eye className="h-5 w-5" />{previewPublic ? 'Thoát chế độ xem với tư cách người khác' : 'Xem với tư cách người khác'}
                            </button>
                          )}
                          {own && (
                            <button role="menuitem" className={menuItem} onClick={() => { setShowSettings(false); goTab('about'); startEditing('overview'); }}><Edit3 className="h-5 w-5" />Chỉnh sửa trang cá nhân</button>
                          )}
                          <button role="menuitem" className={menuItem} onClick={copyProfileLink}><Copy className="h-5 w-5" />Sao chép liên kết trang cá nhân</button>
                          <button role="menuitem" className={menuItem} onClick={() => { setShowSettings(false); setFriendsSub('followers'); goTab('friends'); }}><Users className="h-5 w-5" />Xem người theo dõi</button>
                          {own ? (
                            <a role="menuitem" className={menuItem} href="/settings/privacy" onClick={() => setShowSettings(false)}><Lock className="h-5 w-5" />Quyền riêng tư</a>
                          ) : !isOwn && (
                            <button role="menuitem" className={menuItem} onClick={blockUser}><Ban className="h-5 w-5" />Chặn nhắn tin</button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* ══ Thanh tab dính — cuộn qua tên thì hiện ảnh + tên thu nhỏ (như Facebook) ══
          --app-nav-h là chiều cao thật của thanh điều hướng (kể cả tai thỏ PWA). z-30 < navbar z-40. */}
      <div ref={tabsRef} style={previewPublic ? { top: 'calc(var(--app-nav-h) + 40px)' } : undefined} className="sticky top-[var(--app-nav-h)] z-30 bg-[var(--bg-card)] border-t border-[var(--border-color)] shadow-[0_1px_2px_rgba(0,0,0,0.1)]">
        <div className="mx-auto max-w-[1100px] px-2 sm:px-4 lg:px-8 flex items-center gap-2">
          {compact && !bot && (
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hidden sm:flex items-center gap-2 pr-3 mr-1 border-r border-[var(--border-color)] min-w-0 max-w-[260px] py-1.5" title="Lên đầu trang">
              <span className="relative h-9 w-9 shrink-0">
                <span className="block h-full w-full rounded-full overflow-hidden bg-[var(--bg-surface)]">
                  {p.avatarUrl ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={p.avatarUrl} alt="" className="h-full w-full object-cover" />) : <span className="flex h-full w-full items-center justify-center font-bold text-text-primary">{ten.slice(0, 1).toUpperCase()}</span>}
                </span>
                {online && <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-[#31a24c] ring-2 ring-[var(--bg-card)]" />}
              </span>
              <span className="truncate text-[15px] font-semibold text-text-primary">{ten}</span>
            </button>
          )}
          <div className="flex flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Mục trang cá nhân">
            {mainTabs.map((tab) => {
              const count = tab.id === 'photos' ? photos.length : tab.id === 'videos' ? videos.length : 0;
              return (
                <button key={tab.id} role="tab" aria-selected={mainTab === tab.id} onClick={() => goTab(tab.id)}
                  className={cn('group relative shrink-0 px-3 sm:px-4 h-[52px] text-[15px] font-semibold whitespace-nowrap transition-colors',
                    mainTab === tab.id ? 'text-[var(--accent-color)]' : 'text-text-secondary hover:text-text-primary')}>
                  <span className={cn('inline-flex items-center gap-1.5 rounded-md px-1 py-1.5', mainTab !== tab.id && 'group-hover:bg-[var(--bg-surface-hover)]')}>
                    {tab.label}
                    {count > 0 && !mediaHasMore && <span className="text-xs font-medium text-text-muted">{count}</span>}
                  </span>
                  {mainTab === tab.id && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t bg-[var(--accent-color)]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ Thân trang ══ */}
      <div className="mx-auto max-w-[1100px] px-2 sm:px-4 lg:px-8 mt-4">
        {mainTab === 'posts' && (
          <div className="flex flex-col lg:flex-row items-start gap-4">
            {/* Cột trái — dính kiểu Facebook (cột dài hơn màn hình thì dính theo đáy) */}
            <div ref={leftRef} className="w-full lg:w-[42%] lg:sticky self-start space-y-4" style={{ top: leftTop }}>
              <IntroCard profile={p} own={own}
                onEditBio={() => startEditing('overview')}
                onEditDetails={() => { goTab('about'); setAboutTab('work'); startEditing('work'); }}
                onShowAbout={() => goTab('about')} />
              <PhotosCard photos={photos} onSeeAll={() => goTab('photos')} />
              <FriendsCard friends={friends} count={p.followerCount ?? 0} onSeeAll={() => { setFriendsSub('followers'); goTab('friends'); }} />
              <LinksCard profile={p} own={own} onEdit={() => startEditing('contact')} />
              <p className="px-2 text-xs text-text-muted leading-relaxed">
                <a href="/settings/privacy" className="hover:underline">Quyền riêng tư</a> · <a href="/settings" className="hover:underline">Cài đặt</a> · <a href="/feed" className="hover:underline">Bảng tin</a> · CuongThai © {new Date().getFullYear()}
              </p>
            </div>
            {/* Cột phải — đăng bài + bài viết */}
            <div className="flex-1 min-w-0 w-full space-y-4">
              {own && <div id="profile-composer"><PostComposer /></div>}
              <div className={cn(CARD, 'overflow-hidden')}>
                <div className="flex items-center justify-between px-4 pt-3 pb-2">
                  <h2 className="text-xl font-bold text-text-primary">Bài viết</h2>
                  {own && <a href="/settings/privacy" className={cn(btnGrey, 'h-8 px-3 text-sm')}><Settings className="h-4 w-4" />Quyền riêng tư</a>}
                </div>
                <div className="flex border-t border-[var(--border-color)] mx-4">
                  {([['list', 'Chế độ xem danh sách', List], ['grid', 'Chế độ xem lưới', LayoutGrid]] as const).map(([v, label, Icon]) => (
                    <button key={v} onClick={() => setPostView(v)} aria-pressed={postView === v}
                      className={cn('relative flex-1 flex items-center justify-center gap-2 h-11 text-[15px] font-semibold rounded-md my-1 transition-colors',
                        postView === v ? 'text-[var(--accent-color)]' : 'text-text-secondary hover:bg-[var(--bg-surface-hover)]')}>
                      <Icon className="h-4 w-4" /><span className="max-sm:hidden">{label}</span><span className="sm:hidden">{v === 'list' ? 'Danh sách' : 'Lưới'}</span>
                      {postView === v && <span className="absolute inset-x-2 -bottom-1 h-[3px] rounded-t bg-[var(--accent-color)]" />}
                    </button>
                  ))}
                </div>
              </div>
              {postsLocked && storePosts.length === 0 ? (
                <div className={cn(CARD, 'p-10 text-center')}>
                  <Lock className="h-10 w-10 mx-auto text-text-muted mb-3" />
                  <p className="text-text-primary font-semibold">Đăng nhập để xem bài viết của {ten}</p>
                  <a href="/login" className={cn(btnPrimary, 'mt-4')}>Đăng nhập</a>
                </div>
              ) : storePosts.length === 0 && !loadingPosts ? (
                <div className={cn(CARD, 'p-12 text-center')}>
                  <Edit3 className="h-12 w-12 mx-auto text-text-muted mb-3" />
                  <p className="text-text-muted">{own ? 'Bạn chưa đăng bài viết nào — hãy chia sẻ điều gì đó!' : 'Chưa có bài viết nào'}</p>
                </div>
              ) : postView === 'grid' ? (
                <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                  {storePosts.map((post: any) => <PostTile key={post.id} post={post} />)}
                </div>
              ) : storePosts.map((post) => <PostCard key={post.id} post={post} />)}
              {postsHasMore && <div ref={postsSentinelRef} className="flex justify-center py-4">{loadingPosts && <Loader2 className="h-6 w-6 animate-spin text-text-muted" />}</div>}
            </div>
          </div>
        )}

        {mainTab === 'about' && (
          <div className={cn(CARD, 'overflow-hidden')}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-72 md:border-r border-[var(--border-color)] p-2 md:p-3">
                <h2 className="hidden md:block text-xl font-bold text-text-primary px-2 pt-1 pb-3">Giới thiệu</h2>
                <div className="flex md:flex-col gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {aboutTabs.map((tab) => (
                    <button key={tab.id} onClick={() => setAboutTab(tab.id)}
                      className={cn('flex items-center gap-2 px-3 py-2.5 text-[15px] font-semibold rounded-md transition-colors whitespace-nowrap text-left',
                        aboutTab === tab.id ? 'bg-[color-mix(in_srgb,var(--accent-color)_12%,transparent)] text-[var(--accent-color)]' : 'text-text-secondary hover:bg-[var(--bg-surface-hover)]')}>
                      <tab.icon className="h-4 w-4 shrink-0" />{tab.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 p-5 min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[17px] font-bold text-text-primary">{aboutTabs.find((t) => t.id === aboutTab)?.label}</h3>
                  {own && <button onClick={() => startEditing(aboutTab)} className={cn(btnGrey, 'h-8 px-3 text-sm')}><Edit3 className="h-4 w-4" />Chỉnh sửa</button>}
                </div>
                {renderAboutContent()}
              </div>
            </div>
          </div>
        )}

        {mainTab === 'friends' && (
          <div className={cn(CARD, 'p-4')}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
              <h2 className="text-xl font-bold text-text-primary">Bạn bè</h2>
              <label className="flex items-center gap-2 rounded-full bg-[color-mix(in_srgb,var(--text-primary)_9%,var(--bg-card))] px-3 h-9 sm:w-64">
                <Search className="h-4 w-4 text-text-muted shrink-0" />
                <input value={friendsQuery} onChange={(e) => setFriendsQuery(e.target.value)} placeholder="Tìm kiếm" aria-label="Tìm trong danh sách" className="flex-1 min-w-0 bg-transparent text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none" />
              </label>
            </div>
            <div className="flex gap-1 border-b border-[var(--border-color)] mb-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {([
                ['followers', `Người theo dõi`, p.followerCount ?? 0],
                ['following', `Đang theo dõi`, p.followingCount ?? 0],
                ...(isOwn ? [['friends', 'Bạn bè của tôi', null] as const] : []),
              ] as const).map(([v, label, n]) => (
                <button key={v} onClick={() => setFriendsSub(v as typeof friendsSub)}
                  className={cn('relative px-3 h-11 text-[15px] font-semibold whitespace-nowrap transition-colors',
                    friendsSub === v ? 'text-[var(--accent-color)]' : 'text-text-secondary hover:text-text-primary')}>
                  {label}{n != null && <span className="ml-1 text-text-muted font-medium">{n}</span>}
                  {friendsSub === v && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t bg-[var(--accent-color)]" />}
                </button>
              ))}
            </div>
            {(friendsSub === 'following' && followingList === null) || (friendsSub === 'friends' && myFriends === null) ? (
              <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-text-muted" /></div>
            ) : listShown.length === 0 ? (
              <p className="text-text-muted text-center py-10">
                {kw ? 'Không có ai khớp tìm kiếm' : friendsSub === 'followers' ? 'Chưa có người theo dõi nào' : friendsSub === 'following' ? 'Chưa theo dõi ai' : 'Chưa có bạn bè nào'}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {listShown.map((f: any) => <PersonRow key={f.id} person={f} selfId={currentUser?.id ?? null} />)}
              </div>
            )}
            {subHasMore && !kw && (
              <div className="flex justify-center mt-4">
                <button disabled={subLoading} onClick={() => { if (friendsSub === 'followers') void loadMoreFollowers(); else if (friendsSub === 'following') void loadFollowing(false); else void loadMyFriends(false); }} className={btnGrey}>
                  {subLoading && <Loader2 className="h-4 w-4 animate-spin" />}Xem thêm
                </button>
              </div>
            )}
          </div>
        )}

        {(mainTab === 'photos' || mainTab === 'videos') && (
          <div className={cn(CARD, 'p-4')}>
            <h2 className="text-xl font-bold text-text-primary mb-3">{mainTab === 'photos' ? 'Ảnh' : 'Video'}</h2>
            {(() => {
              const items = mainTab === 'photos' ? photos : videos;
              if (items.length === 0 && !loadingMedia) {
                return (
                  <div className="py-12 text-center">
                    {mainTab === 'photos' ? <ImageIcon className="h-12 w-12 mx-auto text-text-muted mb-3" /> : <Play className="h-12 w-12 mx-auto text-text-muted mb-3" />}
                    <p className="text-text-muted">{mainTab === 'photos' ? 'Chưa có ảnh nào' : 'Chưa có video nào'}</p>
                  </div>
                );
              }
              return (
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-1.5">
                  {items.map((m) => (
                    <a key={m.id} href={`/?post=${m.postId}`} className="group relative aspect-square overflow-hidden rounded-lg bg-[var(--bg-surface)]">
                      <MediaThumb url={m.type === 'VIDEO' ? (m.thumbnail || m.url) : (m.url || m.thumbnail)} video={m.type === 'VIDEO' && !m.thumbnail} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      {m.type === 'VIDEO' && <div className="absolute inset-0 flex items-center justify-center"><span className="rounded-full bg-black/55 p-2.5"><Play className="h-5 w-5 text-white fill-white" /></span></div>}
                    </a>
                  ))}
                </div>
              );
            })()}
            {mediaHasMore && <div ref={mediaSentinelRef} className="flex justify-center py-4">{loadingMedia && <Loader2 className="h-6 w-6 animate-spin text-text-muted" />}</div>}
          </div>
        )}
      </div>

      {/* Crop modal */}
      <AnimatePresence>
        {showImageCropper && imagePreview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] p-6 max-w-lg w-full shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">{showImageCropper === 'avatar' ? 'Cập nhật ảnh đại diện' : 'Cập nhật ảnh bìa'}</h3>
                <button onClick={() => { setShowImageCropper(null); setImagePreview(null); }} aria-label="Đóng"><X className="h-5 w-5 text-text-muted hover:text-text-primary" /></button>
              </div>
              <div className="relative w-full h-[300px] bg-[var(--bg-glass)] rounded-xl overflow-hidden mb-4">
                <Cropper
                  image={imagePreview}
                  crop={crop}
                  zoom={zoom}
                  aspect={showImageCropper === 'avatar' ? 1 : 16 / 6}
                  cropShape={showImageCropper === 'avatar' ? 'round' : 'rect'}
                  showGrid={showImageCropper === 'cover'}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
                />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-text-muted">Thu phóng</span>
                <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} aria-label="Thu phóng" className="flex-1 accent-neon-violet" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setShowImageCropper(null); setImagePreview(null); }} className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-text-secondary hover:bg-[var(--bg-glass)] transition-colors">Hủy</button>
                <button onClick={handleImageUpload} disabled={uploadingImage} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-violet to-neon-purple text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-neon-violet/20">
                  {uploadingImage ? <><Loader2 className="h-4 w-4 animate-spin" />Đang tải lên...</> : <><Check className="h-4 w-4" />Lưu</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit About modal */}
      <AnimatePresence>
        {editingSection && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={() => !saving && setEditingSection(null)}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                <h3 className="text-lg font-semibold text-text-primary">Chỉnh sửa {editingSection === 'overview' ? 'Tổng quan' : editingSection === 'work' ? 'Công việc & Học vấn' : editingSection === 'places' ? 'Địa điểm' : editingSection === 'contact' ? 'Thông tin liên hệ' : 'Chi tiết'}</h3>
                <button onClick={() => setEditingSection(null)} aria-label="Đóng"><X className="h-5 w-5 text-text-muted hover:text-text-primary" /></button>
              </div>
              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                {editingSection === 'overview' && (<>
                  <EditField label="Tiểu sử" value={editForm.bio || ''} onChange={(v) => setEditForm((p) => ({ ...p, bio: v }))} type="textarea" placeholder="Write a few lines about yourself..." />
                  <EditField label="Website" value={editForm.websiteUrl || ''} onChange={(v) => setEditForm((p) => ({ ...p, websiteUrl: v }))} type="url" placeholder="https://yourwebsite.com" />
                  <EditField label="Tình trạng mối quan hệ" value={editForm.relationshipStatus || ''} onChange={(v) => setEditForm((p) => ({ ...p, relationshipStatus: v }))} type="select" options={[{ value: '', label: 'Chọn...' }, { value: 'Độc thân', label: 'Độc thân' }, { value: 'Đang hẹn hò', label: 'Đang hẹn hò' }, { value: 'Đã kết hôn', label: 'Đã kết hôn' }, { value: 'Phức tạp', label: 'Phức tạp' }]} />
                </>)}
                {editingSection === 'work' && (<>
                  <EditField label="Nghề nghiệp" value={editForm.work || ''} onChange={(v) => setEditForm((p) => ({ ...p, work: v }))} type="text" placeholder="e.g. Software developer" />
                  <EditField label="Nơi làm việc" value={editForm.workplace || ''} onChange={(v) => setEditForm((p) => ({ ...p, workplace: v }))} type="text" placeholder="Company name" />
                  <EditField label="Vị trí công việc" value={editForm.jobTitle || ''} onChange={(v) => setEditForm((p) => ({ ...p, jobTitle: v }))} type="text" placeholder="Job title" />
                  <EditField label="Trường học" value={editForm.school || ''} onChange={(v) => setEditForm((p) => ({ ...p, school: v }))} type="text" placeholder="School name" />
                  <EditField label="Đại học" value={editForm.college || ''} onChange={(v) => setEditForm((p) => ({ ...p, college: v }))} type="text" placeholder="University name" />
                </>)}
                {editingSection === 'places' && (<>
                  <EditField label="Thành phố hiện tại" value={editForm.location || ''} onChange={(v) => setEditForm((p) => ({ ...p, location: v }))} type="text" placeholder="Ho Chi Minh City" />
                  <EditField label="Quê quán" value={editForm.hometown || ''} onChange={(v) => setEditForm((p) => ({ ...p, hometown: v }))} type="text" placeholder="Hanoi" />
                </>)}
                {editingSection === 'contact' && (<>
                  <EditField label="Số điện thoại" value={editForm.phone || ''} onChange={(v) => setEditForm((p) => ({ ...p, phone: v }))} type="tel" placeholder="0123456789" />
                  <EditField label="Giới tính" value={editForm.gender || ''} onChange={(v) => setEditForm((p) => ({ ...p, gender: v }))} type="select" options={[{ value: '', label: 'Chọn...' }, { value: 'MALE', label: 'Nam' }, { value: 'FEMALE', label: 'Nữ' }, { value: 'OTHER', label: 'Khác' }]} />
                  <EditField label="Năm sinh" value={editForm.birthYear || ''} onChange={(v) => setEditForm((p) => ({ ...p, birthYear: v }))} type="number" placeholder="1990" />
                  <EditField label="Website" value={editForm.websiteUrl || ''} onChange={(v) => setEditForm((p) => ({ ...p, websiteUrl: v }))} type="url" placeholder="https://yourwebsite.com" />
                </>)}
                {editingSection === 'details' && (<>
                  <EditField label="Giới thiệu" value={editForm.bio || ''} onChange={(v) => setEditForm((p) => ({ ...p, bio: v }))} type="textarea" placeholder="Write a few lines about yourself..." />
                  <EditField label="Sở thích" value={editForm.hobbies || ''} onChange={(v) => setEditForm((p) => ({ ...p, hobbies: v }))} type="textarea" placeholder="Your interests..." />
                  <EditField label="Ngôn ngữ (phân cách bằng dấu phẩy)" value={editForm.languages || ''} onChange={(v) => setEditForm((p) => ({ ...p, languages: v }))} type="text" placeholder="Vietnamese, English" />
                </>)}
              </div>
              <div className="flex gap-3 p-4 border-t border-[var(--border-color)] bg-[var(--bg-glass)]">
                <button onClick={() => setEditingSection(null)} className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-text-secondary hover:bg-[var(--bg-glass)] transition-colors">Hủy</button>
                <button onClick={saveProfileUpdate} disabled={saving} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-violet to-neon-purple text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-neon-violet/20">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Lưu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Kiểu thẻ chung (giống thẻ Facebook: nền thẻ, bo 12px, bóng nhẹ) ──────
const CARD = 'rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-[0_1px_2px_rgba(0,0,0,0.08)]';

/** "5 phút trước" · "3 giờ trước" — cho dòng "Hoạt động … trước". */
function thoiGianTruoc(iso: string): string | null {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return 'vừa xong';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  return null; // quá lâu — không hiện
}

// ─── Sidebar cards ────────────────────────────────────────────
function IntroCard({ profile: p, own, onEditBio, onEditDetails, onShowAbout }: {
  profile: ExtendedProfile; own: boolean; onEditBio: () => void; onEditDetails: () => void; onShowAbout: () => void;
}) {
  const congViec = p.jobTitle && p.workplace ? `${p.jobTitle} tại ${p.workplace}` : p.jobTitle || p.workplace || p.work;
  const hoc = p.college || p.school || p.education;
  const thamGia = p.createdAt ? new Date(p.createdAt) : null;
  return (
    <div className={cn(CARD, 'p-4')}>
      <h2 className="text-xl font-bold text-text-primary mb-3">Giới thiệu</h2>
      {p.bio && <p className="text-[15px] text-text-primary whitespace-pre-wrap text-center mb-3">{p.bio}</p>}
      {own && (
        <button onClick={onEditBio} className="mb-3 w-full h-9 rounded-lg bg-[color-mix(in_srgb,var(--text-primary)_9%,var(--bg-card))] hover:bg-[color-mix(in_srgb,var(--text-primary)_15%,var(--bg-card))] text-[15px] font-semibold text-text-primary transition-colors">
          {p.bio ? 'Chỉnh sửa tiểu sử' : 'Thêm tiểu sử'}
        </button>
      )}
      <div className="space-y-3">
        {congViec && <SidebarRow icon={WorkIcon} text={congViec} />}
        {p.work && congViec !== p.work && <SidebarRow icon={Briefcase} text={p.work} />}
        {hoc && <SidebarRow icon={School} text={`Học tại ${hoc}`} />}
        {p.location && <SidebarRow icon={MapPinHouse} text={`Sống tại ${p.location}`} />}
        {p.hometown && <SidebarRow icon={Home} text={`Đến từ ${p.hometown}`} />}
        {p.relationshipStatus && <SidebarRow icon={Heart} text={p.relationshipStatus} />}
        {p.birthYear && <SidebarRow icon={CalendarDays} text={`Sinh năm ${p.birthYear}`} />}
        {p.websiteUrl && <SidebarRow icon={LinkIcon} text={p.websiteUrl.replace(/^https?:\/\//, '')} href={p.websiteUrl} />}
        <SidebarRow icon={Rss} text={`Có ${p.followerCount ?? 0} người theo dõi`} />
        {thamGia && !Number.isNaN(thamGia.getTime()) && (
          <SidebarRow icon={Clock3} text={`Tham gia vào tháng ${thamGia.getMonth() + 1} năm ${thamGia.getFullYear()}`} />
        )}
      </div>
      {own ? (
        <button onClick={onEditDetails} className="mt-4 w-full h-9 rounded-lg bg-[color-mix(in_srgb,var(--text-primary)_9%,var(--bg-card))] hover:bg-[color-mix(in_srgb,var(--text-primary)_15%,var(--bg-card))] text-[15px] font-semibold text-text-primary transition-colors">Chỉnh sửa chi tiết</button>
      ) : (
        <button onClick={onShowAbout} className="mt-4 w-full h-9 rounded-lg bg-[color-mix(in_srgb,var(--text-primary)_9%,var(--bg-card))] hover:bg-[color-mix(in_srgb,var(--text-primary)_15%,var(--bg-card))] text-[15px] font-semibold text-text-primary transition-colors">Xem thông tin giới thiệu</button>
      )}
    </div>
  );
}

function SidebarRow({ icon: Icon, text, href }: { icon: ComponentType<{ className?: string }>; text: string; href?: string }) {
  const inner = (<><Icon className="h-5 w-5 text-text-muted shrink-0" /><span className="text-[15px] text-text-primary break-words min-w-0">{text}</span></>);
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 [&>span]:text-[var(--accent-color)] hover:underline">{inner}</a>
    : <div className="flex items-center gap-3">{inner}</div>;
}

function PhotosCard({ photos, onSeeAll }: { photos: any[]; onSeeAll: () => void }) {
  return (
    <div className={cn(CARD, 'p-4')}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-text-primary">Ảnh</h2>
        <button onClick={onSeeAll} className="rounded-md px-2 py-1 text-[15px] text-[var(--accent-color)] hover:bg-[var(--bg-surface-hover)]">Xem tất cả ảnh</button>
      </div>
      {photos.length === 0 ? (
        <div className="py-4 flex flex-col items-center text-center text-text-muted">
          <ImageIcon className="h-9 w-9 mb-2 opacity-50" />
          <p className="text-sm">Chưa có ảnh nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
          {photos.slice(0, 9).map((m, i) => (
            <a key={m.id || i} href={`/?post=${m.postId}`} className="block aspect-square overflow-hidden bg-[var(--bg-surface)]">
              <MediaThumb url={m.url || m.thumbnail} className="h-full w-full object-cover hover:opacity-85 transition-opacity" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/** Ảnh/video thu nhỏ. Video không có ảnh bìa ⇒ dùng chính khung đầu của video thay vì ô đen. */
function MediaThumb({ url, className, video }: { url?: string | null; className?: string; video?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!url || failed) {
    return (
      <div className={cn('flex items-center justify-center bg-[var(--bg-surface)]', className)}>
        <ImageIcon className="h-6 w-6 text-text-muted/50" />
      </div>
    );
  }
  if (video) {
    return <video src={`${url}#t=0.1`} muted playsInline preload="metadata" onError={() => setFailed(true)} className={className} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" loading="lazy" onError={() => setFailed(true)} className={className} />;
}

function FriendsCard({ friends, count, onSeeAll }: { friends: any[]; count: number; onSeeAll: () => void }) {
  return (
    <div className={cn(CARD, 'p-4')}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h2 className="text-xl font-bold text-text-primary">Bạn bè</h2>
          <p className="text-[15px] text-text-secondary">{count} người theo dõi</p>
        </div>
        <button onClick={onSeeAll} className="rounded-md px-2 py-1 text-[15px] text-[var(--accent-color)] hover:bg-[var(--bg-surface-hover)]">Xem tất cả</button>
      </div>
      {friends.length === 0 ? (
        <p className="py-3 text-center text-sm text-text-muted">Chưa có người theo dõi nào</p>
      ) : (
        <div className="grid grid-cols-3 gap-x-2 gap-y-3">
          {friends.slice(0, 9).map((f) => (
            <a key={f.id} href={`/profile/${f.id}/v2`} className="group min-w-0">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gradient-to-br from-neon-violet/20 to-neon-pink/20 flex items-center justify-center">
                {f.avatarUrl ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={f.avatarUrl} alt={f.displayName || f.username} className="w-full h-full object-cover group-hover:opacity-90" />) : <span className="text-2xl font-bold text-text-primary">{(f.displayName || f.username || '?').slice(0, 1).toUpperCase()}</span>}
                {f.isOnline && <span className="absolute right-1.5 bottom-1.5 h-3 w-3 rounded-full bg-[#31a24c] ring-2 ring-[var(--bg-card)]" title="Đang hoạt động" />}
              </div>
              <span className="mt-1 block text-[13px] font-semibold leading-tight text-text-primary truncate group-hover:underline">{f.displayName || f.username}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/** Thẻ "Liên kết" (như mục Links của Facebook): website + mạng xã hội. */
function LinksCard({ profile: p, own, onEdit }: { profile: ExtendedProfile; own: boolean; onEdit: () => void }) {
  const links = Object.entries(p.socialLinks ?? {}).filter(([, url]) => typeof url === 'string' && url.trim());
  if (!p.websiteUrl && links.length === 0 && !own) return null;
  return (
    <div className={cn(CARD, 'p-4')}>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-text-primary">Liên kết</h2>
        {own && <button onClick={onEdit} aria-label="Sửa liên kết" className="rounded-full p-2 text-text-secondary hover:bg-[var(--bg-surface-hover)]"><Edit3 className="h-4 w-4" /></button>}
      </div>
      <div className="space-y-3">
        {p.websiteUrl && <SidebarRow icon={Globe} text={p.websiteUrl.replace(/^https?:\/\//, '')} href={p.websiteUrl} />}
        {links.map(([key, url]) => (
          <SidebarRow key={key} icon={socialIcons[key.toLowerCase()] || Link2} text={String(url).replace(/^https?:\/\//, '')} href={String(url)} />
        ))}
        {!p.websiteUrl && links.length === 0 && (
          <button onClick={onEdit} className="w-full h-9 rounded-lg bg-[color-mix(in_srgb,var(--text-primary)_9%,var(--bg-card))] hover:bg-[color-mix(in_srgb,var(--text-primary)_15%,var(--bg-card))] text-[15px] font-semibold text-text-primary transition-colors">Thêm liên kết</button>
        )}
      </div>
    </div>
  );
}

/** Ô bài viết ở "Chế độ xem lưới": ảnh/video đầu tiên, hoặc đoạn chữ nếu bài không có ảnh. */
function PostTile({ post }: { post: any }) {
  const m = (post.media ?? []).find((x: any) => x.type === 'IMAGE' || x.type === 'VIDEO');
  const soAnh = (post.media ?? []).filter((x: any) => x.type === 'IMAGE' || x.type === 'VIDEO').length;
  return (
    <a href={`/?post=${post.id}`} className="group relative block aspect-square overflow-hidden rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]" title={(post.content ?? '').slice(0, 120)}>
      {m ? (
        <>
          <MediaThumb url={m.type === 'VIDEO' ? (m.thumbnail || m.url) : (m.thumbnail || m.url)} video={m.type === 'VIDEO' && !m.thumbnail} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          {m.type === 'VIDEO' && <span className="absolute right-1.5 top-1.5 rounded-full bg-black/55 p-1"><Play className="h-3.5 w-3.5 text-white fill-white" /></span>}
          {soAnh > 1 && <span className="absolute left-1.5 top-1.5 rounded-md bg-black/55 px-1.5 text-[11px] font-semibold text-white">+{soAnh - 1}</span>}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center p-2.5 bg-gradient-to-br from-[color-mix(in_srgb,var(--accent-color)_14%,transparent)] to-transparent">
          <p className="line-clamp-6 text-center text-[12px] sm:text-[13px] font-medium text-text-primary break-words">{(post.content ?? '').replace(/[#*_`>]/g, '').trim() || 'Bài viết'}</p>
        </div>
      )}
    </a>
  );
}

/** Một người trong tab Bạn bè: ảnh + chấm hoạt động + tên + nút nhắn tin nhanh. */
function PersonRow({ person: f, selfId }: { person: any; selfId: number | null }) {
  const router = useRouter();
  const ten = f.displayName || f.fullName || f.username;
  const nhan = () => {
    if (!selfId) { router.push('/login'); return; }
    const ok = moChatNho({ id: f.id, username: f.username, displayName: ten, avatarUrl: f.avatarUrl ?? null });
    if (!ok) router.push(`/messages?peer=${f.id}`);
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--border-color)] p-3">
      <a href={`/profile/${f.id}/v2`} className="relative h-20 w-20 shrink-0">
        <span className="block h-full w-full overflow-hidden rounded-lg bg-[var(--bg-surface)]">
          {f.avatarUrl ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={f.avatarUrl} alt={ten} className="h-full w-full object-cover" />) : <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-text-primary">{ten.slice(0, 1).toUpperCase()}</span>}
        </span>
        {f.isOnline && <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-[#31a24c] ring-[3px] ring-[var(--bg-card)]" title="Đang hoạt động" />}
      </a>
      <div className="min-w-0 flex-1">
        <a href={`/profile/${f.id}/v2`} className="block truncate text-[17px] font-semibold text-text-primary hover:underline">{ten}</a>
        <p className="truncate text-[13px] text-text-muted">@{f.username}{f.isOnline ? ' · Đang hoạt động' : ''}</p>
      </div>
      {f.id !== selfId && (
        <button onClick={nhan} aria-label={`Nhắn tin cho ${ten}`} title="Nhắn tin" className="h-9 w-9 shrink-0 rounded-full bg-[color-mix(in_srgb,var(--text-primary)_9%,var(--bg-card))] hover:bg-[color-mix(in_srgb,var(--text-primary)_15%,var(--bg-card))] flex items-center justify-center text-text-primary">
          <MessageCircle className="h-[18px] w-[18px]" />
        </button>
      )}
    </div>
  );
}

// ─── Shared sub-components ─────────────────────────────────────
function InfoItem({ icon: Icon, label, value, isLink }: { icon: ComponentType<{ className?: string }>; label: string; value: string; isLink?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-glass)] hover:bg-[var(--bg-glass)] transition-colors">
      <Icon className="h-4 w-4 text-tone-violet shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-muted">{label}</p>
        {isLink ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-tone-violet hover:underline truncate block">{value.replace(/^https?:\/\//, '')}</a> : <p className="text-sm text-text-primary truncate">{value}</p>}
      </div>
    </div>
  );
}

function EditField({ label, value, onChange, type, placeholder, options = [] }: { label: string; value: string; onChange: (v: string) => void; type: string; placeholder?: string; options?: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-xs text-text-muted mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-glass)] px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none resize-none" />
      ) : type === 'select' ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-glass)] px-3 py-2.5 text-sm text-text-primary focus:border-neon-violet/50 focus:outline-none">
          {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-glass)] px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none" />
      )}
    </div>
  );
}
