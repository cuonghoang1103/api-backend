'use client';

/**
 * ProfileDetail — Professional Facebook/Instagram Style Profile Page
 * Redesigned for enterprise quality
 * 
 * Features:
 * - Facebook-style avatar overlapping cover photo
 * - Professional cover/avatar upload with preview
 * - 90% width responsive layout (2-column)
 * - Contact section with view/edit functionality
 * - Personal/About section with tabbed navigation
 * - Smooth animations and transitions
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Edit3, Globe, MapPin, Calendar, Camera, Loader2, Check,
  Mail, Phone, Briefcase, GraduationCap, Heart, User, Shield,
  Link2, Users, Image as ImageIcon, Settings, ChevronRight,
  Facebook, Twitter, Github, Linkedin, Youtube, Instagram,
  Plus, Home, School, MapPinHouse, Flag, Language, CalendarDays,
  Gender, BookOpen, Star, Grid3X3, UserPlus, MoreHorizontal,
  Info, MapPinned, Building, BookText, Eye, EyeOff
} from 'lucide-react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { socialUserApi, socialApi } from '@/lib/api';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Dynamic import PostCard
const PostCard = dynamic(
  () => import('@/components/social/PostCard').then((m) => m.PostCard as ComponentType<{ post: any }>),
  { loading: () => <div className="h-48 animate-pulse rounded-2xl bg-darkcard/30" /> },
);

type ContentTab = 'posts' | 'media' | 'liked';
type AboutTab = 'overview' | 'work' | 'places' | 'contact' | 'details';

// Profile interface
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
  hometown?: string;
  work?: string;
  workplace?: string;
  jobTitle?: string;
  school?: string;
  college?: string;
  websiteUrl?: string;
  relationshipStatus?: string;
  languages?: string[];
  hobbies?: string;
  socialLinks?: Record<string, string>;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  isOnline?: boolean;
  relationship?: { id: number; name: string; avatarUrl?: string } | null;
  postCount?: number;
  mediaCount?: number;
}

// Social icons mapping
const socialIcons: Record<string, ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  youtube: Youtube,
  instagram: Instagram,
  website: Globe,
  web: Globe,
};

// About tab config
const aboutTabs: { id: AboutTab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Tổng quan', icon: Grid3X3 },
  { id: 'work', label: 'Công việc', icon: Briefcase },
  { id: 'places', label: 'Địa điểm', icon: MapPinned },
  { id: 'contact', label: 'Liên hệ', icon: Phone },
  { id: 'details', label: 'Chi tiết', icon: Info },
];

export function ProfileDetail({ userId: propUserId }: { userId?: number } = {}) {
  const params = useParams<{ id: string }>();
  const id = propUserId ?? Number(params?.id);
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  // ─── State ───────────────────────────────────────────────────
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [contentTab, setContentTab] = useState<ContentTab>('posts');
  const [aboutTab, setAboutTab] = useState<AboutTab>('overview');
  const [editingSection, setEditingSection] = useState<AboutTab | null>(null);

  // Posts state
  const [posts, setPosts] = useState<any[]>([]);
  const [postsCursor, setPostsCursor] = useState<number | null>(null);
  const [postsHasMore, setPostsHasMore] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const postsSentinelRef = useRef<HTMLDivElement | null>(null);

  // Media state
  const [media, setMedia] = useState<any[]>([]);
  const [mediaCursor, setMediaCursor] = useState<number | null>(null);
  const [mediaHasMore, setMediaHasMore] = useState(true);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const mediaSentinelRef = useRef<HTMLDivElement | null>(null);

  // Liked state
  const [liked, setLiked] = useState<any[]>([]);
  const [likedCursor, setLikedCursor] = useState<number | null>(null);
  const [likedHasMore, setLikedHasMore] = useState(true);
  const [loadingLiked, setLoadingLiked] = useState(false);
  const likedSentinelRef = useRef<HTMLDivElement | null>(null);

  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [showImageCropper, setShowImageCropper] = useState<'avatar' | 'cover' | null>(null);

  // Follow state
  const [following, setFollowing] = useState<boolean | null>(null);
  const [followBusy, setFollowBusy] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const isOwn = currentUser?.id === id;

  // ─── Load Profile ─────────────────────────────────────────────
  useEffect(() => {
    if (!id || !Number.isFinite(id)) return;
    let cancelled = false;
    setLoading(true);
    
    socialUserApi.getProfile(id)
      .then((res: any) => {
        if (cancelled) return;
        const data = res.data?.data ?? res.data;
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setLoading(false);
        toast.error('Không tải được profile');
      });
      
    return () => { cancelled = true; };
  }, [id]);

  // Update following state
  useEffect(() => {
    if (profile) setFollowing(profile.isFollowing ?? null);
  }, [profile]);

  // ─── Load Posts ───────────────────────────────────────────────
  const loadPosts = useCallback(async (reset = false) => {
    if (!id || loadingPosts || !reset && !postsHasMore) return;
    setLoadingPosts(true);
    try {
      const res: any = await socialUserApi.getUserPosts(id, {
        cursor: reset ? undefined : postsCursor ?? undefined,
        limit: 20,
      });
      const { items, nextCursor, hasMore } = res.data?.data ?? {};
      setPosts(prev => reset ? (items ?? []) : [...prev, ...(items ?? [])]);
      setPostsCursor(nextCursor);
      setPostsHasMore(hasMore);
    } catch {
      toast.error('Không tải được bài viết');
    } finally {
      setLoadingPosts(false);
    }
  }, [id, postsCursor, postsHasMore, loadingPosts]);

  useEffect(() => {
    if (contentTab !== 'posts') return;
    void loadPosts(true);
  }, [contentTab]);

  useEffect(() => {
    if (contentTab !== 'posts') return;
    const node = postsSentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && postsHasMore && !loadingPosts) {
          void loadPosts(false);
        }
      },
      { rootMargin: '300px' },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [contentTab, postsHasMore, loadingPosts]);

  // ─── Load Media ───────────────────────────────────────────────
  const loadMedia = useCallback(async (reset = false) => {
    if (!id || loadingMedia || !reset && !mediaHasMore) return;
    setLoadingMedia(true);
    try {
      const res: any = await socialUserApi.getUserMedia(id, {
        cursor: reset ? undefined : mediaCursor ?? undefined,
        limit: 30,
      });
      const { items, nextCursor, hasMore } = res.data?.data ?? {};
      setMedia(prev => reset ? (items ?? []) : [...prev, ...(items ?? [])]);
      setMediaCursor(nextCursor);
      setMediaHasMore(hasMore);
    } catch {
      toast.error('Không tải được media');
    } finally {
      setLoadingMedia(false);
    }
  }, [id, mediaCursor, mediaHasMore, loadingMedia]);

  useEffect(() => {
    if (contentTab !== 'media') return;
    void loadMedia(true);
  }, [contentTab]);

  useEffect(() => {
    if (contentTab !== 'media') return;
    const node = mediaSentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && mediaHasMore && !loadingMedia) {
          void loadMedia(false);
        }
      },
      { rootMargin: '300px' },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [contentTab, mediaHasMore, loadingMedia]);

  // ─── Load Liked ───────────────────────────────────────────────
  const loadLiked = useCallback(async (reset = false) => {
    if (!id || loadingLiked || !isOwn || !reset && !likedHasMore) return;
    setLoadingLiked(true);
    try {
      const res: any = await socialUserApi.getUserLiked(id, {
        cursor: reset ? undefined : likedCursor ?? undefined,
        limit: 20,
      });
      const { items, nextCursor, hasMore } = res.data?.data ?? {};
      setLiked(prev => reset ? (items ?? []) : [...prev, ...(items ?? [])]);
      setLikedCursor(nextCursor);
      setLikedHasMore(hasMore);
    } catch {
      toast.error('Không tải được bài viết đã thích');
    } finally {
      setLoadingLiked(false);
    }
  }, [id, likedCursor, likedHasMore, loadingLiked, isOwn]);

  useEffect(() => {
    if (contentTab !== 'liked') return;
    void loadLiked(true);
  }, [contentTab]);

  useEffect(() => {
    if (contentTab !== 'liked') return;
    const node = likedSentinelRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && likedHasMore && !loadingLiked) {
          void loadLiked(false);
        }
      },
      { rootMargin: '300px' },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [contentTab, likedHasMore, loadingLiked]);

  // ─── Image Upload ─────────────────────────────────────────────
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Kích thước file quá lớn (tối đa 5MB)');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
      setShowImageCropper(type);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleImageUpload = async () => {
    if (!imagePreview) return;
    
    setUploadingImage(true);
    try {
      // Convert data URL to blob
      const response = await fetch(imagePreview);
      const blob = await response.blob();
      const file = new File([blob], 'profile-image.jpg', { type: 'image/jpeg' });

      const signedRes = await socialApi.getSignedUploadUrl(file.name, 'IMAGE', file.size);
      if (!signedRes.success || !signedRes.data) {
        throw new Error(signedRes.message || 'Không lấy được URL upload');
      }

      const uploadRes = await fetch(signedRes.data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      if (!uploadRes.ok) throw new Error('Upload thất bại');

      const imageUrl = signedRes.data.publicUrl;

      if (showImageCropper === 'avatar') {
        await authApi.updateProfile({ avatarUrl: imageUrl });
        setProfile(prev => prev ? { ...prev, avatarUrl: imageUrl } : prev);
        toast.success('Cập nhật ảnh đại diện thành công');
      } else {
        await socialUserApi.updateCoverPhoto(imageUrl);
        setProfile(prev => prev ? { ...prev, coverPhoto: imageUrl, coverPhotoUrl: imageUrl } : prev);
        toast.success('Cập nhật ảnh bìa thành công');
      }

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setShowImageCropper(null);
      setImagePreview(null);
    } catch (err: any) {
      toast.error(err.message || 'Không thể tải lên hình ảnh');
    } finally {
      setUploadingImage(false);
    }
  };

  // ─── Follow/Unfollow ──────────────────────────────────────────
  const toggleFollow = async () => {
    if (!id || followBusy) return;
    setFollowBusy(true);
    try {
      const res: any = await socialUserApi.toggleFollow(id);
      setFollowing(!!(res?.data?.following ?? !following));
      setProfile(prev => prev ? {
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

  // ─── Save Profile Updates ─────────────────────────────────────
  const saveProfileUpdate = async () => {
    setSaving(true);
    try {
      // Split updates between auth and userProfile services
      const authFields = ['fullName', 'displayName', 'phone', 'gender', 'birthYear'];
      const profileFields = ['bio', 'location', 'work', 'education', 'websiteUrl', 'hometown', 'workplace', 'jobTitle', 'school', 'relationshipStatus'];
      
      const authUpdates: any = {};
      const profileUpdates: any = {};

      for (const [key, value] of Object.entries(editForm)) {
        if (authFields.includes(key)) {
          if (key === 'birthYear') {
            authUpdates[key] = value ? parseInt(value) : null;
          } else {
            authUpdates[key] = value || null;
          }
        } else if (profileFields.includes(key)) {
          profileUpdates[key] = value || null;
        }
      }

      if (Object.keys(authUpdates).length > 0) {
        await authApi.updateProfile(authUpdates);
      }
      if (Object.keys(profileUpdates).length > 0) {
        await socialUserApi.updateOwnProfile(profileUpdates);
      }

      // Update local state
      setProfile(prev => prev ? { ...prev, ...editForm } : prev);
      setEditingSection(null);
      setEditForm({});
      toast.success('Đã cập nhật thông tin');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch {
      toast.error('Không thể cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (section: AboutTab) => {
    if (!profile) return;
    
    const formData: Record<string, string> = {};
    switch (section) {
      case 'overview':
        formData.bio = profile.bio || '';
        formData.websiteUrl = profile.websiteUrl || '';
        formData.relationshipStatus = profile.relationshipStatus || '';
        break;
      case 'work':
        formData.work = profile.work || '';
        formData.workplace = profile.workplace || '';
        formData.jobTitle = profile.jobTitle || '';
        formData.school = profile.school || '';
        break;
      case 'places':
        formData.location = profile.location || '';
        formData.hometown = profile.hometown || '';
        break;
      case 'contact':
        formData.email = profile.email || '';
        formData.phone = profile.phone || '';
        formData.gender = profile.gender || '';
        formData.birthYear = profile.birthYear?.toString() || '';
        break;
      case 'details':
        formData.bio = profile.bio || '';
        formData.hobbies = profile.hobbies || '';
        formData.languages = (profile.languages || []).join(', ');
        break;
    }
    setEditForm(formData);
    setEditingSection(section);
  };

  // ─── Render About Section Content ────────────────────────────
  const renderAboutContent = () => {
    if (!profile) return null;
    const p = profile;

    switch (aboutTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            {p.bio ? (
              <p className="text-text-secondary whitespace-pre-wrap">{p.bio}</p>
            ) : (
              <p className="text-text-muted italic">Chưa có tiểu sử</p>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {p.work && (
                <InfoItem icon={Briefcase} label="Công việc" value={p.work} />
              )}
              {p.workplace && (
                <InfoItem icon={Building} label="Nơi làm việc" value={p.workplace} />
              )}
              {p.jobTitle && (
                <InfoItem icon={Star} label="Vị trí" value={p.jobTitle} />
              )}
              {p.location && (
                <InfoItem icon={MapPinHouse} label="Sống tại" value={p.location} />
              )}
              {p.hometown && (
                <InfoItem icon={Home} label="Đến từ" value={p.hometown} />
              )}
              {p.relationshipStatus && (
                <InfoItem icon={Heart} label="Tình trạng" value={p.relationshipStatus} />
              )}
              {p.websiteUrl && (
                <InfoItem icon={Globe} label="Website" value={p.websiteUrl} isLink />
              )}
            </div>
          </div>
        );

      case 'work':
        return (
          <div className="space-y-4">
            {p.work ? (
              <div className="p-4 rounded-xl bg-darkbg/50 border border-darkborder/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neon-violet/10">
                    <Briefcase className="h-5 w-5 text-neon-violet" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{p.work}</p>
                    {p.jobTitle && <p className="text-sm text-text-muted">{p.jobTitle}</p>}
                    {p.workplace && <p className="text-sm text-text-muted">{p.workplace}</p>}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-text-muted italic">Chưa cập nhật thông tin công việc</p>
            )}

            {p.school && (
              <div className="p-4 rounded-xl bg-darkbg/50 border border-darkborder/50">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <GraduationCap className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{p.school}</p>
                    {p.college && <p className="text-sm text-text-muted">{p.college}</p>}
                  </div>
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
                <div>
                  <p className="text-sm text-text-muted">Thành phố hiện tại</p>
                  <p className="font-medium text-text-primary">{p.location}</p>
                </div>
              </div>
            ) : (
              <p className="text-text-muted italic">Chưa cập nhật nơi ở</p>
            )}

            {p.hometown && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-darkbg/50 border border-darkborder/50">
                <Home className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm text-text-muted">Quê quán</p>
                  <p className="font-medium text-text-primary">{p.hometown}</p>
                </div>
              </div>
            )}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-muted mb-3">Liên hệ</h3>
            
            {p.email && (
              <InfoItem icon={Mail} label="Email" value={p.email} />
            )}
            {p.phone && (
              <InfoItem icon={Phone} label="Điện thoại" value={p.phone} />
            )}
            
            <h3 className="text-sm font-medium text-text-muted mt-6 mb-3">Cá nhân</h3>
            
            {p.gender && (
              <InfoItem 
                icon={Gender} 
                label="Giới tính" 
                value={p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'} 
              />
            )}
            {p.birthYear && (
              <InfoItem icon={CalendarDays} label="Ngày sinh" value={`Năm ${p.birthYear}`} />
            )}
            
            {p.websiteUrl && (
              <InfoItem icon={Globe} label="Website" value={p.websiteUrl} isLink />
            )}

            {/* Social Links */}
            {p.socialLinks && Object.keys(p.socialLinks).length > 0 && (
              <>
                <h3 className="text-sm font-medium text-text-muted mt-6 mb-3">Liên kết</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(p.socialLinks).map(([key, url]) => {
                    const Icon = socialIcons[key.toLowerCase()] || Link2;
                    return (
                      <a
                        key={key}
                        href={String(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-darkbg/50 border border-darkborder/50 text-sm text-text-secondary hover:text-neon-violet hover:border-neon-violet/50 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </a>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        );

      case 'details':
        return (
          <div className="space-y-4">
            {p.bio && (
              <div>
                <h3 className="text-sm font-medium text-text-muted mb-2">Giới thiệu</h3>
                <p className="text-text-secondary whitespace-pre-wrap">{p.bio}</p>
              </div>
            )}
            
            {p.hobbies && (
              <div>
                <h3 className="text-sm font-medium text-text-muted mb-2">Sở thích</h3>
                <p className="text-text-secondary">{p.hobbies}</p>
              </div>
            )}

            {p.languages && p.languages.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-text-muted mb-2">Ngôn ngữ</h3>
                <div className="flex flex-wrap gap-2">
                  {p.languages.map((lang, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-darkbg/50 border border-darkborder/50 text-sm text-text-secondary">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!p.bio && !p.hobbies && (!p.languages || p.languages.length === 0) && (
              <p className="text-text-muted italic">Chưa có thông tin chi tiết</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // ─── Loading Skeleton ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-[92vw] max-w-[1500px] mx-auto">
        {/* Cover skeleton */}
        <div className="h-80 animate-pulse rounded-2xl bg-darkcard/40 mb-4" />
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-[380px] shrink-0 space-y-4">
            <div className="h-[500px] animate-pulse rounded-2xl bg-darkcard/30" />
            <div className="h-48 animate-pulse rounded-2xl bg-darkcard/30" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-14 animate-pulse rounded-xl bg-darkcard/30" />
            <div className="h-64 animate-pulse rounded-2xl bg-darkcard/30" />
            <div className="h-64 animate-pulse rounded-2xl bg-darkcard/30" />
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

  // ─── Render ────────────────────────────────────────────────────
  return (
    <div className="w-[92vw] max-w-[1500px] mx-auto pb-8">
      {/* ─── Cover + Avatar Header ───────────────────────────── */}
      <div className="relative rounded-2xl overflow-visible bg-darkcard border border-darkborder mb-6">
        {/* Cover Photo - positioned to allow avatar overlap */}
        <div 
          className="h-72 sm:h-80 lg:h-[400px] w-full relative overflow-hidden rounded-t-2xl"
          style={!cover ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' } : undefined}
        >
          {cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cover} alt="" className="w-full h-full object-cover" />
          )}
          
          {/* Cover gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Cover actions */}
          {isOwn && (
            <label className="absolute bottom-4 right-4 cursor-pointer inline-flex items-center gap-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-white transition-all hover:scale-105 shadow-lg">
              {uploadingImage && showImageCropper === 'cover' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
              <span>Cập nhật ảnh bìa</span>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageSelect(e, 'cover')}
              />
            </label>
          )}
        </div>

        {/* Avatar - Overlapping cover photo (Facebook style) */}
        {/* Positioned to overlap cover by ~40% from top */}
        <div className="absolute left-6 sm:left-10 -mt-16 sm:-mt-20 z-10">
          <div className="relative group">
            {/* Avatar container with ring */}
            <div className={cn(
              "relative rounded-full overflow-hidden shadow-2xl transition-all duration-300",
              "ring-4 ring-darkcard",
              "group-hover:ring-neon-violet/30"
            )}>
              {/* Avatar size: 160px desktop, 120px mobile */}
              <div className="h-36 w-36 sm:h-44 sm:w-44 lg:h-52 lg:w-52">
                {p.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neon-violet via-neon-purple to-neon-pink">
                    <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg">
                      {(p.displayName || p.fullName || p.username || '?').slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Online indicator */}
              {p.isOnline && (
                <div className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 ring-2 ring-darkcard" />
              )}

              {/* Avatar camera button */}
              {isOwn && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors cursor-pointer rounded-full">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-11 w-11 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                      {uploadingImage && showImageCropper === 'avatar' ? (
                        <Loader2 className="h-5 w-5 animate-spin text-white" />
                      ) : (
                        <Camera className="h-5 w-5 text-white" />
                      )}
                    </div>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageSelect(e, 'avatar')}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profile Header Info - positioned below avatar */}
        <div className="px-6 sm:px-10 pb-6 pt-2 sm:pt-4">
          <div className="ml-36 sm:ml-48 lg:ml-56 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary">
                {p.displayName || p.fullName || p.username}
              </h1>
              <p className="text-text-muted mt-0.5">@{p.username}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-text-muted flex-wrap">
                <span>
                  <strong className="text-text-primary font-semibold">{p.followerCount ?? 0}</strong> người theo dõi
                </span>
                <span>
                  <strong className="text-text-primary font-semibold">{p.followingCount ?? 0}</strong> đang theo dõi
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              {isOwn ? (
                <>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-violet to-neon-purple text-white px-5 py-2.5 font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-neon-violet/20">
                    <Plus className="h-4 w-4" />
                    Thêm vào tin
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-darkcard/80 border border-darkborder text-text-primary px-5 py-2.5 font-medium hover:bg-darkcard transition-colors">
                    <Edit3 className="h-4 w-4" />
                    Chỉnh sửa trang cá nhân
                  </button>
                  <button className="inline-flex items-center justify-center rounded-xl bg-darkcard/60 border border-darkborder p-2.5 hover:bg-darkcard/80 transition-colors">
                    <Settings className="h-5 w-5 text-text-secondary" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleFollow}
                    disabled={followBusy || following === null}
                    className={cn(
                      'inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all shadow-lg',
                      following
                        ? 'bg-darkcard/80 border border-darkborder text-text-primary hover:bg-darkcard'
                        : 'bg-gradient-to-r from-neon-violet to-neon-purple text-white hover:opacity-90 shadow-neon-violet/20',
                      followBusy && 'opacity-50',
                    )}
                  >
                    {following ? (
                      <>
                        <Check className="h-4 w-4" />
                        Đang theo dõi
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Theo dõi
                      </>
                    )}
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-darkcard/80 border border-darkborder px-5 py-2.5 font-medium text-text-primary hover:bg-darkcard transition-colors">
                    <Mail className="h-4 w-4" />
                    Nhắn tin
                  </button>
                  <button className="inline-flex items-center justify-center rounded-xl bg-darkcard/60 border border-darkborder p-2.5 hover:bg-darkcard/80 transition-colors">
                    <MoreHorizontal className="h-5 w-5 text-text-secondary" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 sm:px-10 border-t border-darkborder/50">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {['posts', 'about', 'friends', 'photos', 'videos'].map(tab => (
              <button
                key={tab}
                className={cn(
                  'px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2',
                  tab === 'posts' || tab === 'about'
                    ? 'text-text-primary border-neon-violet'
                    : 'text-text-muted border-transparent hover:text-text-primary hover:bg-white/[0.02]'
                )}
                onClick={() => tab === 'about' && setAboutTab('overview')}
              >
                {tab === 'posts' ? 'Bài viết' : 
                 tab === 'about' ? 'Giới thiệu' :
                 tab === 'friends' ? 'Bạn bè' :
                 tab === 'photos' ? 'Ảnh' : 'Video'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Main Content Layout ──────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── Left Sidebar (About/Intro) ───────────────────── */}
        <div className="w-full lg:w-[380px] shrink-0 space-y-4">
          {/* About Card with Tabs */}
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 overflow-hidden">
            {/* About Header */}
            <div className="p-4 flex items-center justify-between border-b border-darkborder/50">
              <h2 className="text-lg font-semibold text-text-primary">Giới thiệu</h2>
              {isOwn && (
                <button 
                  onClick={() => startEditing(aboutTab)}
                  className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* About Tab Navigation */}
            <div className="flex gap-1 px-4 pt-2 overflow-x-auto scrollbar-hide">
              {aboutTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setAboutTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap',
                    aboutTab === tab.id
                      ? 'bg-neon-violet/10 text-neon-violet'
                      : 'text-text-muted hover:text-text-primary hover:bg-white/[0.02]'
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* About Content */}
            <div className="p-4">
              {renderAboutContent()}
            </div>
          </div>

          {/* Photos Card */}
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Ảnh</h2>
              <button className="text-sm text-neon-violet hover:underline">Xem tất cả</button>
            </div>
            <div className="grid grid-cols-3 gap-0.5">
              {media.slice(0, 9).map((m, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={m.id || i}
                  src={m.url || m.thumbnail}
                  alt=""
                  className="aspect-square object-cover hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
              {Array.from({ length: Math.max(0, 9 - media.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square bg-darkbg/50" />
              ))}
            </div>
          </div>

          {/* Friends Card */}
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Bạn bè</h2>
              <button className="text-sm text-neon-violet hover:underline">Xem tất cả</button>
            </div>
            <div className="grid grid-cols-3 gap-2 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-neon-violet/20 to-neon-pink/20">
                  <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">
                    Avatar
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right Content Area ─────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Tab Navigation */}
          <div className="rounded-2xl border border-darkborder bg-darkcard/40 overflow-hidden mb-4">
            <div className="flex">
              {([
                { id: 'posts' as ContentTab, label: 'Bài viết', icon: BookText },
                { id: 'media' as ContentTab, label: 'Ảnh', icon: Grid3X3 },
                ...(isOwn ? [{ id: 'liked' as ContentTab, label: 'Đã thích', icon: Heart }] : []),
              ]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setContentTab(tab.id)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors',
                    contentTab === tab.id
                      ? 'text-text-primary bg-white/[0.03] border-b-2 border-neon-violet'
                      : 'text-text-muted hover:text-text-primary hover:bg-white/[0.02]',
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {contentTab === 'posts' && (
            <div className="space-y-4">
              {posts.length === 0 && !loadingPosts ? (
                <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center">
                  <Edit3 className="h-12 w-12 mx-auto text-text-muted mb-3" />
                  <p className="text-text-muted">Chưa có bài viết nào</p>
                  {isOwn && (
                    <button className="mt-4 px-4 py-2 rounded-lg bg-neon-violet text-white text-sm font-medium hover:opacity-90 transition-opacity">
                      Tạo bài viết đầu tiên
                    </button>
                  )}
                </div>
              ) : (
                posts.map(post => <PostCard key={post.id} post={post} />)
              )}
              {postsHasMore && (
                <div ref={postsSentinelRef} className="flex justify-center py-4">
                  {loadingPosts && <Loader2 className="h-6 w-6 animate-spin text-text-muted" />}
                </div>
              )}
            </div>
          )}

          {contentTab === 'media' && (
            <div>
              {media.length === 0 && !loadingMedia ? (
                <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center">
                  <ImageIcon className="h-12 w-12 mx-auto text-text-muted mb-3" />
                  <p className="text-text-muted">Chưa có ảnh nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden border border-darkborder">
                  {media.map(m => (
                    <a key={m.id} href={`/social/post/${m.postId}`} className="group relative aspect-square bg-darkbg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.url || m.thumbnail}
                        alt=""
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                      {m.type === 'VIDEO' && (
                        <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1.5">
                          <ImageIcon className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}
              {mediaHasMore && (
                <div ref={mediaSentinelRef} className="flex justify-center py-4">
                  {loadingMedia && <Loader2 className="h-6 w-6 animate-spin text-text-muted" />}
                </div>
              )}
            </div>
          )}

          {contentTab === 'liked' && (
            <div className="space-y-4">
              {!isOwn ? (
                <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center text-text-muted">
                  Chỉ chủ sở hữu mới xem được
                </div>
              ) : liked.length === 0 && !loadingLiked ? (
                <div className="rounded-2xl border border-dashed border-darkborder bg-darkcard/20 p-12 text-center">
                  <Heart className="h-12 w-12 mx-auto text-text-muted mb-3" />
                  <p className="text-text-muted">Chưa thích bài viết nào</p>
                </div>
              ) : (
                liked.map(post => <PostCard key={post.id} post={post} />)
              )}
              {isOwn && likedHasMore && (
                <div ref={likedSentinelRef} className="flex justify-center py-4">
                  {loadingLiked && <Loader2 className="h-6 w-6 animate-spin text-text-muted" />}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Image Cropper Modal ──────────────────────────────── */}
      <AnimatePresence>
        {showImageCropper && imagePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-darkcard rounded-2xl border border-darkborder p-6 max-w-lg w-full mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">
                  {showImageCropper === 'avatar' ? 'Cập nhật ảnh đại diện' : 'Cập nhật ảnh bìa'}
                </h3>
                <button onClick={() => { setShowImageCropper(null); setImagePreview(null); }}>
                  <X className="h-5 w-5 text-text-muted hover:text-text-primary" />
                </button>
              </div>
              
              <div className={cn(
                'relative overflow-hidden mb-4 bg-darkbg/50',
                showImageCropper === 'avatar' ? 'aspect-square rounded-full max-w-[280px] mx-auto' : 'aspect-video rounded-xl'
              )}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreview} alt="" className="w-full h-full object-cover" />
              </div>
              
              <p className="text-sm text-text-muted mb-4 text-center">
                {showImageCropper === 'avatar' 
                  ? 'Ảnh đại diện sẽ hiển thị dạng tròn'
                  : 'Ảnh bìa sẽ hiển thị ở đầu trang cá nhân'
                }
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowImageCropper(null); setImagePreview(null); }}
                  className="flex-1 py-2.5 rounded-xl border border-darkborder text-text-secondary hover:bg-darkcard/50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleImageUpload}
                  disabled={uploadingImage}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-violet to-neon-purple text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-neon-violet/20"
                >
                  {uploadingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Lưu
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Edit Profile Modal ────────────────────────────────── */}
      <AnimatePresence>
        {editingSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => !saving && setEditingSection(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-darkcard rounded-2xl border border-darkborder w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-darkborder">
                <h3 className="text-lg font-semibold text-text-primary">
                  Chỉnh sửa {editingSection === 'overview' ? 'Tổng quan' : editingSection === 'work' ? 'Công việc & Học vấn' : editingSection === 'places' ? 'Địa điểm' : editingSection === 'contact' ? 'Thông tin liên hệ' : 'Chi tiết'}
                </h3>
                <button onClick={() => setEditingSection(null)}>
                  <X className="h-5 w-5 text-text-muted hover:text-text-primary" />
                </button>
              </div>

              <div className="p-5 space-y-4 overflow-y-auto flex-1">
                {editingSection === 'overview' && (
                  <>
                    <EditField
                      label="Tiểu sử"
                      value={editForm.bio || ''}
                      onChange={v => setEditForm(p => ({ ...p, bio: v }))}
                      type="textarea"
                      placeholder="Viết vài dòng về bạn..."
                    />
                    <EditField
                      label="Website"
                      value={editForm.websiteUrl || ''}
                      onChange={v => setEditForm(p => ({ ...p, websiteUrl: v }))}
                      type="url"
                      placeholder="https://yourwebsite.com"
                    />
                    <EditField
                      label="Tình trạng mối quan hệ"
                      value={editForm.relationshipStatus || ''}
                      onChange={v => setEditForm(p => ({ ...p, relationshipStatus: v }))}
                      type="select"
                      options={[
                        { value: '', label: 'Chọn...' },
                        { value: 'Độc thân', label: 'Độc thân' },
                        { value: 'Đang hẹn hò', label: 'Đang hẹn hò' },
                        { value: 'Đã kết hôn', label: 'Đã kết hôn' },
                        { value: 'Phức tạp', label: 'Phức tạp' },
                        { value: 'Đang có người yêu', label: 'Đang có người yêu' },
                      ]}
                    />
                  </>
                )}

                {editingSection === 'work' && (
                  <>
                    <EditField
                      label="Nghề nghiệp"
                      value={editForm.work || ''}
                      onChange={v => setEditForm(p => ({ ...p, work: v }))}
                      type="text"
                      placeholder="Ví dụ: Lập trình viên"
                    />
                    <EditField
                      label="Nơi làm việc"
                      value={editForm.workplace || ''}
                      onChange={v => setEditForm(p => ({ ...p, workplace: v }))}
                      type="text"
                      placeholder="Tên công ty"
                    />
                    <EditField
                      label="Vị trí công việc"
                      value={editForm.jobTitle || ''}
                      onChange={v => setEditForm(p => ({ ...p, jobTitle: v }))}
                      type="text"
                      placeholder="Chức danh"
                    />
                    <EditField
                      label="Trường học"
                      value={editForm.school || ''}
                      onChange={v => setEditForm(p => ({ ...p, school: v }))}
                      type="text"
                      placeholder="Tên trường"
                    />
                  </>
                )}

                {editingSection === 'places' && (
                  <>
                    <EditField
                      label="Thành phố hiện tại"
                      value={editForm.location || ''}
                      onChange={v => setEditForm(p => ({ ...p, location: v }))}
                      type="text"
                      placeholder="TP. Hồ Chí Minh"
                    />
                    <EditField
                      label="Quê quán"
                      value={editForm.hometown || ''}
                      onChange={v => setEditForm(p => ({ ...p, hometown: v }))}
                      type="text"
                      placeholder="Hà Nội"
                    />
                  </>
                )}

                {editingSection === 'contact' && (
                  <>
                    <EditField
                      label="Email"
                      value={editForm.email || ''}
                      onChange={v => setEditForm(p => ({ ...p, email: v }))}
                      type="email"
                      placeholder="email@example.com"
                    />
                    <EditField
                      label="Số điện thoại"
                      value={editForm.phone || ''}
                      onChange={v => setEditForm(p => ({ ...p, phone: v }))}
                      type="tel"
                      placeholder="0123456789"
                    />
                    <EditField
                      label="Giới tính"
                      value={editForm.gender || ''}
                      onChange={v => setEditForm(p => ({ ...p, gender: v }))}
                      type="select"
                      options={[
                        { value: '', label: 'Chọn...' },
                        { value: 'MALE', label: 'Nam' },
                        { value: 'FEMALE', label: 'Nữ' },
                        { value: 'OTHER', label: 'Khác' },
                      ]}
                    />
                    <EditField
                      label="Năm sinh"
                      value={editForm.birthYear || ''}
                      onChange={v => setEditForm(p => ({ ...p, birthYear: v }))}
                      type="number"
                      placeholder="1990"
                    />
                  </>
                )}

                {editingSection === 'details' && (
                  <>
                    <EditField
                      label="Giới thiệu"
                      value={editForm.bio || ''}
                      onChange={v => setEditForm(p => ({ ...p, bio: v }))}
                      type="textarea"
                      placeholder="Viết vài dòng về bạn..."
                    />
                    <EditField
                      label="Sở thích"
                      value={editForm.hobbies || ''}
                      onChange={v => setEditForm(p => ({ ...p, hobbies: v }))}
                      type="textarea"
                      placeholder="Sở thích của bạn..."
                    />
                    <EditField
                      label="Ngôn ngữ (phân cách bằng dấu phẩy)"
                      value={editForm.languages || ''}
                      onChange={v => setEditForm(p => ({ ...p, languages: v }))}
                      type="text"
                      placeholder="Tiếng Việt, English, Español"
                    />
                  </>
                )}
              </div>

              <div className="flex gap-3 p-4 border-t border-darkborder bg-darkcard/50">
                <button
                  onClick={() => setEditingSection(null)}
                  className="flex-1 py-2.5 rounded-xl border border-darkborder text-text-secondary hover:bg-darkcard/50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={saveProfileUpdate}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-neon-violet to-neon-purple text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-neon-violet/20"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Lưu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function InfoItem({ 
  icon: Icon, 
  label, 
  value, 
  isLink 
}: { 
  icon: ComponentType<{ className?: string }>; 
  label: string; 
  value: string; 
  isLink?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-darkbg/30 hover:bg-darkbg/50 transition-colors">
      <Icon className="h-4 w-4 text-neon-violet shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-text-muted">{label}</p>
        {isLink ? (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-neon-violet hover:underline truncate block"
          >
            {value.replace(/^https?:\/\//, '')}
          </a>
        ) : (
          <p className="text-sm text-text-primary truncate">{value}</p>
        )}
      </div>
    </div>
  );
}

function EditField({ 
  label, 
  value, 
  onChange, 
  type, 
  placeholder,
  options = []
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  type: string;
  placeholder: string;
  options?: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-xs text-text-muted mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none resize-none"
        />
      ) : type === 'select' ? (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary focus:border-neon-violet/50 focus:outline-none"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-darkborder bg-darkbg/60 px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-neon-violet/50 focus:outline-none"
        />
      )}
    </div>
  );
}
