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
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Edit3, Globe, Camera, Loader2, Check,
  Mail, Phone, Briefcase, GraduationCap, Heart, User,
  Link2, Image as ImageIcon, Settings, Grid3X3, UserPlus, MoreHorizontal,
  Facebook, Twitter, Github, Linkedin, Youtube, Instagram,
  Plus, Home, Star, Building, MapPinned, MapPinHouse, Info,
  BookText, CalendarDays, Briefcase as WorkIcon, Link as LinkIcon, Copy, Lock,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import Cropper from 'react-easy-crop';
import { socialUserApi, fileApi } from '@/lib/api';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getCroppedImg, type PixelCrop } from './cropImage';

// Dynamic imports — heavy client components
const PostCard = dynamic(
  () => import('@/components/social/PostCard').then((m) => m.PostCard as ComponentType<{ post: any }>),
  { loading: () => <div className="h-48 animate-pulse rounded-2xl bg-darkcard/30" /> },
);
const PostComposer = dynamic(
  () => import('@/components/social/PostComposer').then((m) => m.PostComposer as ComponentType),
  { ssr: false, loading: () => <div className="h-32 animate-pulse rounded-2xl bg-darkcard/30" /> },
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
}

const socialIcons: Record<string, ComponentType<{ className?: string }>> = {
  facebook: Facebook, twitter: Twitter, github: Github, linkedin: Linkedin,
  youtube: Youtube, instagram: Instagram, website: Globe, web: Globe,
};

const aboutTabs: { id: AboutTab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Tổng quan', icon: Grid3X3 },
  { id: 'work', label: 'Công việc', icon: Briefcase },
  { id: 'places', label: 'Địa điểm', icon: MapPinned },
  { id: 'contact', label: 'Liên hệ', icon: Phone },
  { id: 'details', label: 'Chi tiết', icon: Info },
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
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  // ─── State ───────────────────────────────────────────────────
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainTab, setMainTab] = useState<MainTab>('posts');
  const [aboutTab, setAboutTab] = useState<AboutTab>('overview');
  const [editingSection, setEditingSection] = useState<AboutTab | null>(null);

  // Posts
  const [posts, setPosts] = useState<any[]>([]);
  const [postsCursor, setPostsCursor] = useState<number | null>(null);
  const [postsHasMore, setPostsHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const postsSentinelRef = useRef<HTMLDivElement | null>(null);

  // Media (photos + videos)
  const [media, setMedia] = useState<any[]>([]);
  const [mediaCursor, setMediaCursor] = useState<number | null>(null);
  const [mediaHasMore, setMediaHasMore] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const mediaSentinelRef = useRef<HTMLDivElement | null>(null);

  // Friends (followers)
  const [friends, setFriends] = useState<any[]>([]);

  // Upload + crop
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showImageCropper, setShowImageCropper] = useState<'avatar' | 'cover' | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);

  // Follow
  const [following, setFollowing] = useState<boolean | null>(null);
  const [followBusy, setFollowBusy] = useState(false);

  // Settings menu
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  // Edit form
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const isOwn = currentUser?.id === id;

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
    try {
      const res: any = await socialUserApi.getUserPosts(id, {
        cursor: reset ? undefined : postsCursor ?? undefined, limit: 20,
      });
      const { items, nextCursor, hasMore } = res.data?.data ?? {};
      setPosts((prev) => (reset ? (items ?? []) : [...prev, ...(items ?? [])]));
      setPostsCursor(nextCursor);
      setPostsHasMore(hasMore);
    } catch {
      toast.error('Không tải được bài viết');
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
    } catch {
      toast.error('Không tải được ảnh/video');
    } finally {
      setLoadingMedia(false);
    }
  }, [id, mediaCursor, mediaHasMore, loadingMedia]);

  const loadFriends = useCallback(async () => {
    if (!id) return;
    try {
      const res: any = await socialUserApi.getFollowers(id, undefined, 12);
      const list = res.data?.data?.users ?? res.data?.data?.items ?? res.data?.data ?? [];
      setFriends(Array.isArray(list) ? list : []);
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
              <div className="p-4 rounded-xl bg-darkbg/50 border border-darkborder/50 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-neon-violet/10"><Briefcase className="h-5 w-5 text-neon-violet" /></div>
                <div>
                  {p.jobTitle && <p className="font-medium text-text-primary">{p.jobTitle}</p>}
                  {p.work && <p className="text-sm text-text-secondary">{p.work}</p>}
                  {p.workplace && <p className="text-sm text-text-muted">{p.workplace}</p>}
                </div>
              </div>
            ) : <p className="text-text-muted italic">Chưa cập nhật thông tin công việc</p>}
            {(p.school || p.college) && (
              <div className="p-4 rounded-xl bg-darkbg/50 border border-darkborder/50 flex items-start gap-3">
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
              <div className="flex items-center gap-3 p-4 rounded-xl bg-darkbg/50 border border-darkborder/50">
                <MapPinHouse className="h-5 w-5 text-neon-violet" />
                <div><p className="text-sm text-text-muted">Thành phố hiện tại</p><p className="font-medium text-text-primary">{p.location}</p></div>
              </div>
            ) : <p className="text-text-muted italic">Chưa cập nhật nơi ở</p>}
            {p.hometown && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-darkbg/50 border border-darkborder/50">
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
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-darkbg/50 border border-darkborder/50 text-sm text-text-secondary hover:text-neon-violet hover:border-neon-violet/50 transition-colors">
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
                  {p.languages.map((lang, i) => <span key={i} className="px-3 py-1 rounded-full bg-darkbg/50 border border-darkborder/50 text-sm text-text-secondary">{lang}</span>)}
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
      <div className="mx-auto w-full max-w-[1050px] px-4">
        <div className="h-[220px] sm:h-[300px] lg:h-[350px] animate-pulse rounded-2xl bg-darkcard/40 mb-16" />
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="w-full lg:w-2/5 space-y-4"><div className="h-[420px] animate-pulse rounded-2xl bg-darkcard/30" /></div>
          <div className="flex-1 space-y-4"><div className="h-32 animate-pulse rounded-2xl bg-darkcard/30" /><div className="h-64 animate-pulse rounded-2xl bg-darkcard/30" /></div>
        </div>
      </div>
    );
  }
  if (!profile) {
    return <div className="rounded-2xl border border-darkborder bg-darkcard/40 p-12 text-center text-text-muted">Không tìm thấy người dùng.</div>;
  }

  const p = profile;
  const cover = p.coverPhotoUrl;
  const videos = media.filter((m) => m.type === 'VIDEO');
  const photos = media.filter((m) => m.type !== 'VIDEO');

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className="mx-auto w-full max-w-[1050px] px-4 pb-10">
      {/* Cover + avatar header */}
      <div className="relative rounded-2xl overflow-visible bg-darkcard border border-darkborder">
        <div
          className="h-[220px] sm:h-[300px] lg:h-[350px] w-full relative overflow-hidden rounded-t-2xl"
          style={!cover ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' } : undefined}
        >
          {cover && (/* eslint-disable-next-line @next/next/no-img-element */ <img src={cover} alt="Ảnh bìa" className="w-full h-full object-cover" />)}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {isOwn && (
            <label className="absolute bottom-4 right-4 cursor-pointer inline-flex items-center gap-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-white transition-all hover:scale-105 shadow-lg" aria-label="Cập nhật ảnh bìa">
              {uploadingImage && showImageCropper === 'cover' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              <span>Cập nhật ảnh bìa</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, 'cover')} />
            </label>
          )}
        </div>

        {/* Avatar — 168px, overlaps cover bottom-left */}
        <div className="absolute left-5 sm:left-8 -bottom-14 sm:-bottom-16 z-10">
          <div className="relative group">
            <div className="relative rounded-full overflow-hidden shadow-2xl ring-4 ring-darkcard transition-all duration-300 group-hover:ring-neon-violet/30">
              <div className="h-[120px] w-[120px] sm:h-[168px] sm:w-[168px]">
                {p.avatarUrl ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={p.avatarUrl} alt="Ảnh đại diện" className="w-full h-full object-cover" />) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-violet via-neon-purple to-neon-pink">
                    <span className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg">{(p.displayName || p.fullName || p.username || '?').slice(0, 1).toUpperCase()}</span>
                  </div>
                )}
              </div>
              {p.isOnline && <div className="absolute bottom-3 right-3 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-darkcard" />}
              {isOwn && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors cursor-pointer rounded-full" aria-label="Đổi ảnh đại diện">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity h-11 w-11 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                    {uploadingImage && showImageCropper === 'avatar' ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Camera className="h-5 w-5 text-white" />}
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageSelect(e, 'avatar')} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Header info */}
        <div className="px-5 sm:px-8 pb-5 pt-20 sm:pt-6">
          <div className="sm:ml-[200px] flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">{p.displayName || p.fullName || p.username}</h1>
              <p className="text-text-muted mt-0.5">@{p.username}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-text-muted flex-wrap">
                <span><strong className="text-text-primary font-semibold">{p.followerCount ?? 0}</strong> người theo dõi</span>
                <span><strong className="text-text-primary font-semibold">{p.followingCount ?? 0}</strong> đang theo dõi</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {isOwn ? (
                <>
                  <button onClick={() => { setMainTab('about'); startEditing(aboutTab); }} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-violet to-neon-purple text-white px-5 py-2.5 font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-neon-violet/20">
                    <Edit3 className="h-4 w-4" />Chỉnh sửa trang cá nhân
                  </button>
                  <div className="relative" ref={settingsRef}>
                    <button onClick={() => setShowSettings((s) => !s)} aria-label="Tùy chọn" aria-haspopup="menu" aria-expanded={showSettings}
                      className="inline-flex items-center justify-center rounded-xl bg-darkcard/60 border border-darkborder p-2.5 hover:bg-darkcard/80 transition-colors">
                      <Settings className="h-5 w-5 text-text-secondary" />
                    </button>
                    <AnimatePresence>
                      {showSettings && (
                        <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          role="menu" className="absolute right-0 mt-2 w-56 rounded-xl border border-darkborder bg-darkcard shadow-2xl overflow-hidden z-30">
                          <button role="menuitem" onClick={() => { setShowSettings(false); setMainTab('about'); startEditing('overview'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"><Edit3 className="h-4 w-4" />Chỉnh sửa trang cá nhân</button>
                          <button role="menuitem" onClick={copyProfileLink} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"><Copy className="h-4 w-4" />Sao chép liên kết</button>
                          <button role="menuitem" onClick={() => { setShowSettings(false); toast.info('Cài đặt quyền riêng tư sẽ sớm ra mắt'); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary transition-colors"><Lock className="h-4 w-4" />Quyền riêng tư</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={toggleFollow} disabled={followBusy || following === null}
                    className={cn('inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all shadow-lg',
                      following ? 'bg-darkcard/80 border border-darkborder text-text-primary hover:bg-darkcard' : 'bg-gradient-to-r from-neon-violet to-neon-purple text-white hover:opacity-90 shadow-neon-violet/20',
                      followBusy && 'opacity-50')}>
                    {following ? <><Check className="h-4 w-4" />Đang theo dõi</> : <><UserPlus className="h-4 w-4" />Theo dõi</>}
                  </button>
                  <a href={`/chat?user=${id}`} className="inline-flex items-center gap-2 rounded-xl bg-darkcard/80 border border-darkborder px-5 py-2.5 font-medium text-text-primary hover:bg-darkcard transition-colors"><Mail className="h-4 w-4" />Nhắn tin</a>
                  <button aria-label="Thêm" className="inline-flex items-center justify-center rounded-xl bg-darkcard/60 border border-darkborder p-2.5 hover:bg-darkcard/80 transition-colors"><MoreHorizontal className="h-5 w-5 text-text-secondary" /></button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sticky tab bar */}
        <div className="sticky top-0 z-20 px-3 sm:px-6 border-t border-darkborder/50 bg-darkcard/80 backdrop-blur rounded-b-2xl">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide" role="tablist">
            {mainTabs.map((tab) => (
              <button key={tab.id} role="tab" aria-selected={mainTab === tab.id} onClick={() => setMainTab(tab.id)}
                className={cn('px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                  mainTab === tab.id ? 'text-text-primary border-neon-violet' : 'text-text-muted border-transparent hover:text-text-primary hover:bg-white/[0.02]')}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mt-5">
        {mainTab === 'posts' && (
          <div className="flex flex-col lg:flex-row gap-5">
            {/* Left sidebar */}
            <div className="w-full lg:w-2/5 space-y-4">
              <IntroCard profile={p} isOwn={isOwn} onEdit={() => { setMainTab('about'); startEditing('overview'); }} onShowAbout={() => setMainTab('about')} />
              <PhotosCard photos={photos} onSeeAll={() => setMainTab('photos')} />
              <FriendsCard friends={friends} count={p.followerCount ?? 0} onSeeAll={() => setMainTab('friends')} />
            </div>
            {/* Right feed */}
            <div className="flex-1 min-w-0 space-y-4">
              {isOwn && <PostComposer />}
              {posts.length === 0 && !loadingPosts ? (
                <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center">
                  <Edit3 className="h-12 w-12 mx-auto text-text-muted mb-3" />
                  <p className="text-text-muted">Chưa có bài viết nào</p>
                </div>
              ) : posts.map((post) => <PostCard key={post.id} post={post} />)}
              {postsHasMore && <div ref={postsSentinelRef} className="flex justify-center py-4">{loadingPosts && <Loader2 className="h-6 w-6 animate-spin text-text-muted" />}</div>}
            </div>
          </div>
        )}

        {mainTab === 'about' && (
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-darkborder/50">
              <h2 className="text-lg font-semibold text-text-primary">Giới thiệu</h2>
              {isOwn && <button onClick={() => startEditing(aboutTab)} aria-label="Chỉnh sửa" className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"><Edit3 className="h-4 w-4" /></button>}
            </div>
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-56 sm:border-r border-darkborder/50 p-2 flex sm:flex-col gap-1 overflow-x-auto">
                {aboutTabs.map((tab) => (
                  <button key={tab.id} onClick={() => setAboutTab(tab.id)}
                    className={cn('flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap text-left',
                      aboutTab === tab.id ? 'bg-neon-violet/10 text-neon-violet' : 'text-text-muted hover:text-text-primary hover:bg-white/[0.02]')}>
                    <tab.icon className="h-4 w-4" />{tab.label}
                  </button>
                ))}
              </div>
              <div className="flex-1 p-5">{renderAboutContent()}</div>
            </div>
          </div>
        )}

        {mainTab === 'friends' && (
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 p-5">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Bạn bè · {p.followerCount ?? 0}</h2>
            {friends.length === 0 ? <p className="text-text-muted italic">Chưa có người theo dõi nào</p> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {friends.map((f) => (
                  <a key={f.id} href={`/profile/${f.id}/v2`} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-darkbg/40 border border-darkborder/40 hover:border-neon-violet/40 transition-colors">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-neon-violet/30 to-neon-pink/30 flex items-center justify-center">
                      {f.avatarUrl ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={f.avatarUrl} alt={f.displayName || f.username} className="w-full h-full object-cover" />) : <span className="text-xl font-bold text-white">{(f.displayName || f.username || '?').slice(0, 1).toUpperCase()}</span>}
                    </div>
                    <span className="text-sm text-text-primary truncate max-w-full">{f.displayName || f.username}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {(mainTab === 'photos' || mainTab === 'videos') && (
          <div>
            {(() => {
              const items = mainTab === 'photos' ? photos : videos;
              if (items.length === 0 && !loadingMedia) {
                return (
                  <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center">
                    <ImageIcon className="h-12 w-12 mx-auto text-text-muted mb-3" />
                    <p className="text-text-muted">{mainTab === 'photos' ? 'Chưa có ảnh nào' : 'Chưa có video nào'}</p>
                  </div>
                );
              }
              return (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 rounded-2xl overflow-hidden border border-darkborder">
                  {items.map((m) => (
                    <a key={m.id} href={`/social/post/${m.postId}`} className="group relative aspect-square bg-darkbg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url || m.thumbnail} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      {m.type === 'VIDEO' && <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5"><ImageIcon className="h-4 w-4 text-white" /></div>}
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
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-darkcard rounded-2xl border border-darkborder p-6 max-w-lg w-full shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">{showImageCropper === 'avatar' ? 'Cập nhật ảnh đại diện' : 'Cập nhật ảnh bìa'}</h3>
                <button onClick={() => { setShowImageCropper(null); setImagePreview(null); }} aria-label="Đóng"><X className="h-5 w-5 text-text-muted hover:text-text-primary" /></button>
              </div>
              <div className="relative w-full h-[300px] bg-darkbg/60 rounded-xl overflow-hidden mb-4">
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
                <button onClick={() => { setShowImageCropper(null); setImagePreview(null); }} className="flex-1 py-2.5 rounded-xl border border-darkborder text-text-secondary hover:bg-darkcard/50 transition-colors">Hủy</button>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-darkcard rounded-2xl border border-darkborder w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-darkborder">
                <h3 className="text-lg font-semibold text-text-primary">Chỉnh sửa {editingSection === 'overview' ? 'Tổng quan' : editingSection === 'work' ? 'Công việc & Học vấn' : editingSection === 'places' ? 'Địa điểm' : editingSection === 'contact' ? 'Thông tin liên hệ' : 'Chi tiết'}</h3>
                <button onClick={() => setEditingSection(null)} aria-label="Đóng"><X className="h-5 w-5 text-text-muted hover:text-text-primary" /></button>
              </div>
              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                {editingSection === 'overview' && (<>
                  <EditField label="Tiểu sử" value={editForm.bio || ''} onChange={(v) => setEditForm((p) => ({ ...p, bio: v }))} type="textarea" placeholder="Viết vài dòng về bạn..." />
                  <EditField label="Website" value={editForm.websiteUrl || ''} onChange={(v) => setEditForm((p) => ({ ...p, websiteUrl: v }))} type="url" placeholder="https://yourwebsite.com" />
                  <EditField label="Tình trạng mối quan hệ" value={editForm.relationshipStatus || ''} onChange={(v) => setEditForm((p) => ({ ...p, relationshipStatus: v }))} type="select" options={[{ value: '', label: 'Chọn...' }, { value: 'Độc thân', label: 'Độc thân' }, { value: 'Đang hẹn hò', label: 'Đang hẹn hò' }, { value: 'Đã kết hôn', label: 'Đã kết hôn' }, { value: 'Phức tạp', label: 'Phức tạp' }]} />
                </>)}
                {editingSection === 'work' && (<>
                  <EditField label="Nghề nghiệp" value={editForm.work || ''} onChange={(v) => setEditForm((p) => ({ ...p, work: v }))} type="text" placeholder="Ví dụ: Lập trình viên" />
                  <EditField label="Nơi làm việc" value={editForm.workplace || ''} onChange={(v) => setEditForm((p) => ({ ...p, workplace: v }))} type="text" placeholder="Tên công ty" />
                  <EditField label="Vị trí công việc" value={editForm.jobTitle || ''} onChange={(v) => setEditForm((p) => ({ ...p, jobTitle: v }))} type="text" placeholder="Chức danh" />
                  <EditField label="Trường học" value={editForm.school || ''} onChange={(v) => setEditForm((p) => ({ ...p, school: v }))} type="text" placeholder="Tên trường" />
                  <EditField label="Đại học" value={editForm.college || ''} onChange={(v) => setEditForm((p) => ({ ...p, college: v }))} type="text" placeholder="Tên trường đại học" />
                </>)}
                {editingSection === 'places' && (<>
                  <EditField label="Thành phố hiện tại" value={editForm.location || ''} onChange={(v) => setEditForm((p) => ({ ...p, location: v }))} type="text" placeholder="TP. Hồ Chí Minh" />
                  <EditField label="Quê quán" value={editForm.hometown || ''} onChange={(v) => setEditForm((p) => ({ ...p, hometown: v }))} type="text" placeholder="Hà Nội" />
                </>)}
                {editingSection === 'contact' && (<>
                  <EditField label="Số điện thoại" value={editForm.phone || ''} onChange={(v) => setEditForm((p) => ({ ...p, phone: v }))} type="tel" placeholder="0123456789" />
                  <EditField label="Giới tính" value={editForm.gender || ''} onChange={(v) => setEditForm((p) => ({ ...p, gender: v }))} type="select" options={[{ value: '', label: 'Chọn...' }, { value: 'MALE', label: 'Nam' }, { value: 'FEMALE', label: 'Nữ' }, { value: 'OTHER', label: 'Khác' }]} />
                  <EditField label="Năm sinh" value={editForm.birthYear || ''} onChange={(v) => setEditForm((p) => ({ ...p, birthYear: v }))} type="number" placeholder="1990" />
                  <EditField label="Website" value={editForm.websiteUrl || ''} onChange={(v) => setEditForm((p) => ({ ...p, websiteUrl: v }))} type="url" placeholder="https://yourwebsite.com" />
                </>)}
                {editingSection === 'details' && (<>
                  <EditField label="Giới thiệu" value={editForm.bio || ''} onChange={(v) => setEditForm((p) => ({ ...p, bio: v }))} type="textarea" placeholder="Viết vài dòng về bạn..." />
                  <EditField label="Sở thích" value={editForm.hobbies || ''} onChange={(v) => setEditForm((p) => ({ ...p, hobbies: v }))} type="textarea" placeholder="Sở thích của bạn..." />
                  <EditField label="Ngôn ngữ (phân cách bằng dấu phẩy)" value={editForm.languages || ''} onChange={(v) => setEditForm((p) => ({ ...p, languages: v }))} type="text" placeholder="Tiếng Việt, English" />
                </>)}
              </div>
              <div className="flex gap-3 p-4 border-t border-darkborder bg-darkcard/50">
                <button onClick={() => setEditingSection(null)} className="flex-1 py-2.5 rounded-xl border border-darkborder text-text-secondary hover:bg-darkcard/50 transition-colors">Hủy</button>
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

// ─── Sidebar cards ────────────────────────────────────────────
function IntroCard({ profile: p, isOwn, onEdit, onShowAbout }: { profile: ExtendedProfile; isOwn: boolean; onEdit: () => void; onShowAbout: () => void }) {
  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard/40 p-4">
      <h2 className="text-lg font-semibold text-text-primary mb-3">Giới thiệu</h2>
      {p.bio && <p className="text-sm text-text-secondary whitespace-pre-wrap mb-3 text-center">{p.bio}</p>}
      <div className="space-y-2">
        {p.work && <SidebarRow icon={WorkIcon} text={p.work} />}
        {p.location && <SidebarRow icon={MapPinHouse} text={`Sống tại ${p.location}`} />}
        {p.hometown && <SidebarRow icon={Home} text={`Đến từ ${p.hometown}`} />}
        {p.websiteUrl && <SidebarRow icon={LinkIcon} text={p.websiteUrl.replace(/^https?:\/\//, '')} href={p.websiteUrl} />}
      </div>
      {isOwn ? (
        <button onClick={onEdit} className="mt-3 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-text-primary transition-colors">Chỉnh sửa chi tiết</button>
      ) : (
        <button onClick={onShowAbout} className="mt-3 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-text-primary transition-colors">Xem thông tin</button>
      )}
    </div>
  );
}

function SidebarRow({ icon: Icon, text, href }: { icon: ComponentType<{ className?: string }>; text: string; href?: string }) {
  const inner = (<><Icon className="h-4 w-4 text-text-muted shrink-0" /><span className="text-sm text-text-secondary truncate">{text}</span></>);
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-neon-violet">{inner}</a>
    : <div className="flex items-center gap-3">{inner}</div>;
}

function PhotosCard({ photos, onSeeAll }: { photos: any[]; onSeeAll: () => void }) {
  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard/40 overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">Ảnh</h2>
        <button onClick={onSeeAll} className="text-sm text-neon-violet hover:underline">Xem tất cả</button>
      </div>
      <div className="grid grid-cols-3 gap-0.5 px-1 pb-1">
        {photos.slice(0, 9).map((m, i) => (/* eslint-disable-next-line @next/next/no-img-element */ <img key={m.id || i} src={m.url || m.thumbnail} alt="" className="aspect-square object-cover hover:opacity-80 transition-opacity cursor-pointer rounded" />))}
        {Array.from({ length: Math.max(0, 9 - photos.length) }).map((_, i) => <div key={`e-${i}`} className="aspect-square bg-darkbg/50 rounded" />)}
      </div>
    </div>
  );
}

function FriendsCard({ friends, count, onSeeAll }: { friends: any[]; count: number; onSeeAll: () => void }) {
  return (
    <div className="rounded-2xl border border-darkborder bg-darkcard/40 overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div><h2 className="text-lg font-semibold text-text-primary">Bạn bè</h2><p className="text-xs text-text-muted">{count} người theo dõi</p></div>
        <button onClick={onSeeAll} className="text-sm text-neon-violet hover:underline">Xem tất cả</button>
      </div>
      <div className="grid grid-cols-3 gap-2 p-2">
        {friends.slice(0, 6).map((f) => (
          <a key={f.id} href={`/profile/${f.id}/v2`} className="flex flex-col items-center gap-1">
            <div className="aspect-square w-full rounded-lg overflow-hidden bg-gradient-to-br from-neon-violet/20 to-neon-pink/20 flex items-center justify-center">
              {f.avatarUrl ? (/* eslint-disable-next-line @next/next/no-img-element */ <img src={f.avatarUrl} alt={f.displayName || f.username} className="w-full h-full object-cover" />) : <span className="text-lg font-bold text-white">{(f.displayName || f.username || '?').slice(0, 1).toUpperCase()}</span>}
            </div>
            <span className="text-[11px] text-text-muted truncate max-w-full">{f.displayName || f.username}</span>
          </a>
        ))}
        {friends.length === 0 && Array.from({ length: 6 }).map((_, i) => <div key={`fe-${i}`} className="aspect-square rounded-lg bg-darkbg/50" />)}
      </div>
    </div>
  );
}

// ─── Shared sub-components ─────────────────────────────────────
function InfoItem({ icon: Icon, label, value, isLink }: { icon: ComponentType<{ className?: string }>; label: string; value: string; isLink?: boolean }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-darkbg/30 hover:bg-darkbg/50 transition-colors">
      <Icon className="h-4 w-4 text-neon-violet shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-muted">{label}</p>
        {isLink ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-sm text-neon-violet hover:underline truncate block">{value.replace(/^https?:\/\//, '')}</a> : <p className="text-sm text-text-primary truncate">{value}</p>}
      </div>
    </div>
  );
}

function EditField({ label, value, onChange, type, placeholder, options = [] }: { label: string; value: string; onChange: (v: string) => void; type: string; placeholder?: string; options?: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-xs text-text-muted mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none resize-none" />
      ) : type === 'select' ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary focus:border-neon-violet/50 focus:outline-none">
          {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none" />
      )}
    </div>
  );
}
