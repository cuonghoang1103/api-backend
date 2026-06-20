'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SafeAvatar from '@/components/ui/SafeAvatar';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Cake,
  Calendar,
  Github,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Globe,
  ExternalLink,
  Users,
  MessageSquare,
  UserPlus,
  UserMinus,
  Wifi,
  WifiOff,
  Image,
  Loader2,
} from 'lucide-react';
import { api, socialUserApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import SocialBackground from '@/components/social/SocialBackground';
import SocialSidebar from '@/components/social/SocialSidebar';
import SocialRightWidget from '@/components/social/SocialRightWidget';
import { cn } from '@/lib/utils';

interface PublicProfile {
  id: number;
  username: string;
  fullName?: string;
  displayName?: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  bio?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  birthYear?: number | null;
  phone?: string | null;
  socialLinks?: Record<string, string> | null;
  allowMessagesFromStrangers?: boolean;
  roles: string[];
  createdAt: string;
  isOnline: boolean;
  lastActiveAt?: string | null;
  followerCount: number;
  followingCount: number;
  isFollowing: boolean;
}

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { user: currentUser } = useAuthStore();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [followingLoading, setFollowingLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (currentUser && String(currentUser.id) === String(id)) {
      router.replace('/profile');
      return;
    }
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        // Try new enhanced endpoint first, fall back to legacy
        const candidates = [
          `/users/${id}`,
          `/social/users/${id}`,
        ];
        let resolved: PublicProfile | null = null;
        for (const path of candidates) {
          try {
            const res = await api.get(path);
            const body = res.data?.data ?? null;
            if (body && (body.id || body.username)) {
              resolved = body as PublicProfile;
              break;
            }
          } catch (e: any) {
            if (e?.response?.status && ![404, 401].includes(e.response.status)) {
              throw e;
            }
          }
        }
        if (resolved) {
          if (!cancelled) setProfile(resolved);
        } else {
          if (!cancelled) setError('Người dùng không tồn tại');
        }
      } catch {
        if (!cancelled) setError('Không thể tải hồ sơ. Vui lòng thử lại.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id, currentUser, router]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    setFollowingLoading(true);
    try {
      const res = await socialUserApi.toggleFollow(profile.id);
      const data = res.data?.data;
      setProfile(prev => prev ? {
        ...prev,
        isFollowing: data?.isFollowing ?? !prev.isFollowing,
        followerCount: data?.followerCount ?? prev.followerCount + (data?.isFollowing ? 1 : -1),
      } : prev);
      toast.success(data?.isFollowing ? `Đã theo dõi ${profile.displayName || profile.username}` : `Đã bỏ theo dõi ${profile.displayName || profile.username}`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Lỗi khi cập nhật');
    } finally {
      setFollowingLoading(false);
    }
  };

  return (
    <main className="min-h-screen" style={{ background: '#03020c' }}>
      <SocialBackground />
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 800px 600px at 50% 0%, rgba(139, 92, 246, 0.06) 0%, transparent 70%), radial-gradient(ellipse 600px 400px at 80% 50%, rgba(6, 182, 212, 0.04) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)_300px]">
          <div className="hidden lg:block">
            <SocialSidebar />
          </div>

          <div className="mx-auto w-full min-w-0">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-white/[0.04] hover:text-text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại feed
            </Link>

            {loading ? (
              <Skeleton />
            ) : error ? (
              <ErrorState message={error} />
            ) : profile ? (
              <ProfileCard
                profile={profile}
                onFollowToggle={handleFollowToggle}
                followingLoading={followingLoading}
              />
            ) : (
              <ErrorState message="Không tìm thấy người dùng" />
            )}
          </div>

          <div className="hidden lg:block">
            <SocialRightWidget />
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileCard({
  profile,
  onFollowToggle,
  followingLoading,
}: {
  profile: PublicProfile;
  onFollowToggle: () => void;
  followingLoading: boolean;
}) {
  const displayName = profile.displayName || profile.fullName || profile.username;
  const normalizedRoles = (profile.roles || []).map((r) =>
    (r || '').replace('ROLE_', '').toUpperCase()
  );
  const isAdmin = normalizedRoles.includes('ADMIN');
  const isAuthenticated = typeof window !== 'undefined';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {profile.coverPhotoUrl ? (
          <img
            src={profile.coverPhotoUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)',
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
          </div>
        )}
        {/* Online indicator */}
        {profile.isOnline && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-1 text-[11px] font-medium text-emerald-300 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Đang hoạt động
          </div>
        )}
      </div>

      {/* Avatar + name + stats */}
      <div className="relative px-4 pb-4 sm:px-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:gap-5">
          <div className="-mt-14 sm:-mt-16 z-10">
            <SafeAvatar
              src={profile.avatarUrl}
              alt={displayName || profile.username}
              seed={profile.username}
              size={112}
              rounded="2xl"
              className="border-4 shadow-2xl border-darkbg"
            />
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary">{displayName}</h1>
              {isAdmin && (
                <span className="rounded-full border border-yellow-500/30 bg-yellow-500/15 px-2.5 py-0.5 text-xs font-semibold text-yellow-400">
                  Administrator
                </span>
              )}
            </div>
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              @{profile.username}
            </p>
            {/* Follower / Following stats */}
            <div className="mt-2 flex items-center gap-4">
              <Link
                href={`/profile/${profile.id}/followers`}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <strong className="text-text-primary font-semibold">{profile.followerCount}</strong>
                <span>followers</span>
              </Link>
              <Link
                href={`/profile/${profile.id}/following`}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <strong className="text-text-primary font-semibold">{profile.followingCount}</strong>
                <span>following</span>
              </Link>
            </div>
          </div>
        </div>

        {profile.bio && (
          <p className="mt-4 text-sm leading-relaxed" style={{ color: '#cbd5e1' }}>
            {profile.bio}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs" style={{ color: '#94a3b8' }}>
          {profile.createdAt && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Tham gia {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
            </span>
          )}
          {profile.birthYear && (
            <span className="inline-flex items-center gap-1.5">
              <Cake className="h-3.5 w-3.5" />
              {new Date().getFullYear() - Number(profile.birthYear)} tuổi
            </span>
          )}
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid grid-cols-1 gap-3 border-t border-white/[0.04] p-4 sm:grid-cols-2 sm:p-6">
        {profile.gender && (
          <MetaRow
            icon={User}
            label="Giới tính"
            value={
              profile.gender === 'MALE'
                ? 'Nam'
                : profile.gender === 'FEMALE'
                ? 'Nữ'
                : 'Khác'
            }
          />
        )}
        {profile.socialLinks && Object.keys(profile.socialLinks).length > 0 && (
          <div className="sm:col-span-2">
            <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
              Liên kết
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(profile.socialLinks)
                .filter(([, v]) => !!v)
                .map(([k, v]) => {
                  const meta = SOCIAL_META[k] ?? SOCIAL_META.website;
                  const Icon = meta.icon;
                  return (
                    <a
                      key={k}
                      href={v as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        color: '#cbd5e1',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {meta.label}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Action row */}
      <ActionRow
        profile={profile}
        onFollowToggle={onFollowToggle}
        followingLoading={followingLoading}
      />
    </motion.div>
  );
}

function ActionRow({
  profile,
  onFollowToggle,
  followingLoading,
}: {
  profile: PublicProfile;
  onFollowToggle: () => void;
  followingLoading: boolean;
}) {
  const router = useRouter();
  const auth = useAuthStore();

  const handleMessageClick = () => {
    if (!auth.isAuthenticated) {
      router.push(`/login?next=/messages?peer=${profile.id}`);
      return;
    }
    router.push(`/messages?peer=${profile.id}`);
  };

  return (
    <div className="flex gap-2 border-t border-white/[0.04] p-4 sm:p-6">
      {/* Follow / Unfollow */}
      <button
        type="button"
        onClick={onFollowToggle}
        disabled={followingLoading}
        className={cn(
          'flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50',
          profile.isFollowing
            ? 'border border-white/10 bg-white/5 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300'
            : 'bg-gradient-to-r from-neon-indigo to-neon-violet hover:from-neon-violet hover:to-neon-fuchsia'
        )}
      >
        {followingLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : profile.isFollowing ? (
          <UserMinus className="h-4 w-4" />
        ) : (
          <UserPlus className="h-4 w-4" />
        )}
        {followingLoading ? 'Đang cập nhật...' : profile.isFollowing ? 'Bỏ theo dõi' : 'Theo dõi'}
      </button>

      {/* Message */}
      <button
        type="button"
        onClick={handleMessageClick}
        disabled={profile.allowMessagesFromStrangers === false}
        className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-40"
        style={{
          background: profile.allowMessagesFromStrangers === false
            ? 'rgba(255,255,255,0.05)'
            : 'linear-gradient(90deg, #8B5CF6, #6366F1)',
        }}
        title={profile.allowMessagesFromStrangers === false ? 'Người dùng này không nhận tin nhắn từ người lạ' : undefined}
      >
        <MessageSquare className="h-4 w-4" />
        {profile.allowMessagesFromStrangers === false ? 'Không nhận tin' : 'Nhắn tin'}
      </button>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: 'rgba(139,92,246,0.1)' }}
      >
        <Icon className="h-4 w-4" style={{ color: '#a78bfa' }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#64748b' }}>
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm" style={{ color: '#e2e8f0' }}>
          {value}
        </p>
      </div>
    </div>
  );
}

const SOCIAL_META: Record<string, { icon: any; label: string }> = {
  github: { icon: Github, label: 'GitHub' },
  twitter: { icon: Twitter, label: 'Twitter / X' },
  linkedin: { icon: Linkedin, label: 'LinkedIn' },
  website: { icon: Globe, label: 'Website' },
  youtube: { icon: Youtube, label: 'YouTube' },
  facebook: { icon: Facebook, label: 'Facebook' },
};

function Skeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="h-48 animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
      <div className="p-6 space-y-3">
        <div className="h-6 w-1/3 animate-pulse rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="h-4 w-1/2 animate-pulse rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
        <div className="h-4 w-2/3 animate-pulse rounded" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      className="rounded-2xl p-8 text-center"
      style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}
    >
      <p style={{ color: '#fca5a5' }}>{message}</p>
    </div>
  );
}
