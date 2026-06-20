'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { api, coursesApi, fileApi, socialUserApi } from '@/lib/api';
import { toast } from 'sonner';
import SafeAvatar from '@/components/ui/SafeAvatar';
import {
  User,
  Mail,
  KeyRound,
  Camera,
  Save,
  Shield,
  MessageSquare,
  FileText,
  Edit3,
  Check,
  X,
  Calendar,
  BookOpen,
  Code2,
  Award,
  ExternalLink,
  Github,
  Globe,
  TrendingUp,
  PlayCircle,
  CheckCircle,
  Clock,
  Phone,
  Cake,
  Link2,
  Twitter,
  Linkedin,
  Youtube,
  Facebook,
  Image,
  Loader2,
} from 'lucide-react';

interface ProfileData {
  id: number;
  username: string;
  email: string;
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
  followerCount?: number;
  followingCount?: number;
  roles: string[];
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated: isBackendAuth, updateProfile } = useAuthStore();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Social login users can view profile but can't edit
  const hasBackendAuth = mounted && isBackendAuth;
  const hasSocialAuth = mounted && status === 'authenticated';
  const isAuthenticated = hasBackendAuth || hasSocialAuth;
  const canEdit = hasBackendAuth; // Only backend auth users can edit
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'activity' | 'courses' | 'settings'>('profile');
  const [editing, setEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: '',
    displayName: '',
    email: '',
    username: '',
    avatarUrl: '',
    coverPhotoUrl: '',
    bio: '',
    gender: '' as '' | 'MALE' | 'FEMALE' | 'OTHER',
    birthYear: '' as number | '',
    phone: '',
    socialLinks: {
      github: '',
      twitter: '',
      linkedin: '',
      website: '',
      youtube: '',
      facebook: '',
    } as Record<string, string>,
  });

  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [stats, setStats] = useState({
    posts: 0,
    projects: 0,
    joinedDays: 0,
  });

  const [courseStats, setCourseStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    hoursLearned: 0,
  });
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [courseLoading, setCourseLoading] = useState(false);

  const [allowMessagesFromStrangers, setAllowMessagesFromStrangers] = useState(true);
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/profile');
        const data = res.data?.data;
        setProfile(data);
        setForm({
          fullName: data?.fullName || '',
          displayName: data?.displayName || '',
          email: data?.email || '',
          username: data?.username || '',
          avatarUrl: data?.avatarUrl || '',
          coverPhotoUrl: data?.coverPhotoUrl || '',
          bio: data?.bio || '',
          gender: (data?.gender as any) || '',
          birthYear: data?.birthYear || '',
          phone: data?.phone || '',
          socialLinks: {
            github: data?.socialLinks?.github || '',
            twitter: data?.socialLinks?.twitter || '',
            linkedin: data?.socialLinks?.linkedin || '',
            website: data?.socialLinks?.website || '',
            youtube: data?.socialLinks?.youtube || '',
            facebook: data?.socialLinks?.facebook || '',
          },
        });
        setAllowMessagesFromStrangers(data?.allowMessagesFromStrangers ?? true);
      } catch {
        if (user) {
          setForm({
            fullName: (user as any).fullName || '',
            displayName: (user as any).displayName || user.username || '',
            email: user.email || '',
            username: user.username || '',
            avatarUrl: (user as any).avatarUrl || '',
            coverPhotoUrl: (user as any).coverPhotoUrl || '',
            bio: '',
            gender: '',
            birthYear: '',
            phone: '',
            socialLinks: { github: '', twitter: '', linkedin: '', website: '', youtube: '', facebook: '' },
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, hasSocialAuth]);

  // Fetch follow stats for own profile
  useEffect(() => {
    if (!profile?.id || !hasBackendAuth) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await socialUserApi.getProfile(profile.id);
        const data = res.data?.data;
        if (!cancelled && data) {
          setFollowStats({ followers: data.followerCount ?? 0, following: data.followingCount ?? 0 });
        }
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, [profile?.id, hasBackendAuth]);

  useEffect(() => {
    if (profile?.createdAt) {
      const created = new Date(profile.createdAt);
      const now = new Date();
      const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      setStats(s => ({ ...s, joinedDays: days }));
    }
  }, [profile?.createdAt]);

  useEffect(() => {
    // Only fetch course stats for backend-authenticated users. Social
    // login users have no backend_token cookie so the proxy would
    // 401 and spam the console.
    if (!hasBackendAuth) return;
    const fetchCourseStats = async () => {
      try {
        setCourseLoading(true);
        const res = await coursesApi.getMyCourses({ size: 100 });
        const enrollments: any[] = res.data?.data || [];
        const completed = enrollments.filter((e: any) => e.status === 'COMPLETED' || e.progressPercent === 100);
        const inProgress = enrollments.filter((e: any) => e.status === 'IN_PROGRESS' && e.progressPercent > 0 && e.progressPercent < 100);
        setMyCourses(enrollments.slice(0, 6));
        setCourseStats({
          total: enrollments.length,
          completed: completed.length,
          inProgress: inProgress.length,
          hoursLearned: Math.round(enrollments.length * 4.5),
        });
      } catch (err) {
        // Silently log; the UI gracefully shows 0 stats when the
        // request fails.
        console.error('Failed to fetch course stats:', err);
      } finally {
        setCourseLoading(false);
      }
    };
    fetchCourseStats();
  }, [hasBackendAuth]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Build payload — convert blank strings to null so the backend
      // can clear optional fields. socialLinks is sent as a partial
      // object (whitelisted by the backend) so blank fields are
      // pruned instead of overwriting saved values with empty.
      const socialLinksPayload: Record<string, string> = {};
      for (const [k, v] of Object.entries(form.socialLinks)) {
        if (v && v.trim()) socialLinksPayload[k] = v.trim();
      }

      const payload: any = {
        fullName: form.fullName.trim() || null,
        displayName: form.displayName.trim() || null,
        email: form.email.trim(),
        bio: form.bio,
        avatarUrl: form.avatarUrl.trim() || null,
        coverPhotoUrl: form.coverPhotoUrl.trim() || null,
        gender: form.gender || null,
        birthYear: form.birthYear === '' ? null : Number(form.birthYear),
        phone: form.phone.trim() || null,
        socialLinks: Object.keys(socialLinksPayload).length > 0 ? socialLinksPayload : null,
      };

      const res = await api.put('/profile', payload);
      const updated = res.data?.data;
      setProfile((prev) => prev ? { ...prev, ...updated } : prev);
      updateProfile({
        fullName: form.fullName,
        displayName: form.displayName || form.username,
        email: form.email,
        bio: form.bio,
        avatarUrl: form.avatarUrl,
        gender: form.gender || null,
        birthYear: form.birthYear === '' ? null : Number(form.birthYear),
        phone: form.phone || null,
        socialLinks: socialLinksPayload,
      });
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setSavingPrivacy(true);
    try {
      const res = await api.put('/profile', { allowMessagesFromStrangers });
      const updated = res.data?.data;
      setProfile((prev) => prev ? { ...prev, ...updated, allowMessagesFromStrangers } : prev);
      toast.success(allowMessagesFromStrangers ? 'Đã bật nhận tin nhắn từ người lạ' : 'Đã tắt nhận tin nhắn từ người lạ');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Lỗi khi cập nhật');
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Password confirmation does not match');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error changing password');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUrlBlur = () => {
    if (editing) handleSaveProfile();
  };

  const handleCoverPhotoUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ảnh bìa phải nhỏ hơn 10MB');
      return;
    }
    setUploadingCover(true);
    try {
      const res = await fileApi.upload(file, 'images');
      const url = res.data?.data?.url;
      if (!url) throw new Error('Upload response missing url');
      setForm(prev => ({ ...prev, coverPhotoUrl: url }));
      await api.put('/profile', { coverPhotoUrl: url });
      toast.success('Đã cập nhật ảnh bìa!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || 'Lỗi upload ảnh bìa');
    } finally {
      setUploadingCover(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-neon-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg">
      {/* Cover Photo */}
      <div className="relative h-48 sm:h-64 overflow-hidden group">
        {form.coverPhotoUrl ? (
          <img src={form.coverPhotoUrl} alt="Cover" className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-neon-indigo via-purple-600 to-neon-violet">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-darkbg/80 to-transparent" />
        {/* Edit cover button */}
        {mounted && canEdit && (
          <label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:border-white/30">
            {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Image className="h-3.5 w-3.5" />}
            <span>{uploadingCover ? 'Đang tải...' : 'Đổi ảnh bìa'}</span>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                e.target.value = '';
                await handleCoverPhotoUpload(file);
              }}
            />
          </label>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-16 sm:-mt-20 flex items-end gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="relative group shrink-0">
            <SafeAvatar
              src={form.avatarUrl}
              alt={form.username || 'avatar'}
              seed={form.username}
              size={144}
              rounded="2xl"
              className="border-4 border-darkbg shadow-2xl"
            />
            {uploadingAvatar && (
              <div className="absolute inset-0 rounded-2xl bg-black/70 flex items-center justify-center z-10">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {/* Always allow avatar upload on hover — no need to enter
                edit mode for the picture. Saves to server immediately. */}
            {!uploadingAvatar && canEdit && (
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Đổi ảnh đại diện"
              >
                <Camera className="w-8 h-8 text-white" />
              </button>
            )}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 5 * 1024 * 1024) {
                  toast.error('Ảnh đại diện phải nhỏ hơn 5MB');
                  e.target.value = '';
                  return;
                }
                setUploadingAvatar(true);
                try {
                  // fileApi.upload sends the right multipart headers AND
                  // the correct `category=images` so the backend accepts
                  // image/* mime types. Calling /files/upload directly
                  // without a category would default to "documents" and
                  // reject image uploads.
                  const res = await fileApi.upload(file, 'images');
                  const url = res.data?.data?.url;
                  if (!url) {
                    throw new Error('Upload response missing url');
                  }
                  setForm(prev => ({ ...prev, avatarUrl: url }));
                  // Persist the avatar URL immediately so the user sees
                  // the new picture even if they cancel the edit.
                  try {
                    await api.put('/profile', { avatarUrl: url });
                  } catch (persistErr) {
                    console.warn('Avatar uploaded but profile not saved yet', persistErr);
                  }
                  toast.success('Image uploaded successfully!');
                } catch (err: any) {
                  const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'Image upload failed';
                  toast.error(msg);
                } finally {
                  setUploadingAvatar(false);
                  e.target.value = '';
                }
              }}
            />
          </div>

          {/* Name + meta */}
          <div className="pb-3 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                {form.displayName || form.fullName || form.username}
              </h1>
              {profile?.roles?.map((role) => {
                // Backend returns role names with a ROLE_ prefix
                // (e.g. "ROLE_ADMIN"). Normalise so the badge matches
                // admins without forcing the UI to know the prefix.
                const normalized = (role || '').replace('ROLE_', '').toUpperCase();
                const isAdmin = normalized === 'ADMIN';
                return (
                  <span key={role} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isAdmin
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      : 'bg-neon-indigo/20 text-neon-indigo border border-neon-indigo/30'
                  }`}>
                    {isAdmin ? 'Administrator' : 'User'}
                  </span>
                );
              })}
            </div>
            <p className="text-text-secondary text-sm mt-1">@{form.username}</p>
          </div>

          {/* Edit button */}
          <div className="pb-3 shrink-0">
            {editing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(false);
                    setForm({
                      fullName: profile?.fullName || '',
                      displayName: profile?.displayName || profile?.username || '',
                      email: profile?.email || '',
                      username: profile?.username || '',
                      avatarUrl: profile?.avatarUrl || '',
                      coverPhotoUrl: profile?.coverPhotoUrl || '',
                      bio: profile?.bio || '',
                      gender: (profile?.gender as any) || '',
                      birthYear: profile?.birthYear || '',
                      phone: profile?.phone || '',
                      socialLinks: {
                        github: profile?.socialLinks?.github || '',
                        twitter: profile?.socialLinks?.twitter || '',
                        linkedin: profile?.socialLinks?.linkedin || '',
                        website: profile?.socialLinks?.website || '',
                        youtube: profile?.socialLinks?.youtube || '',
                        facebook: profile?.socialLinks?.facebook || '',
                      },
                    });
                  }}
                  className="p-2.5 bg-darkcard border border-darkborder rounded-xl text-text-muted hover:text-red-400 hover:border-red-400/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-darkcard border border-darkborder rounded-xl text-sm text-text-secondary hover:text-text-primary hover:border-neon-violet/50 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                {canEdit ? 'Edit' : 'View Profile'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Sidebar */}
          <div className="space-y-6">
            {/* Bio */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">About</h3>
              {editing ? (
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Write a few lines about yourself..."
                  rows={4}
                  className="w-full px-3 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors resize-none"
                />
              ) : (
                <p className="text-sm text-text-secondary leading-relaxed">
                  {form.bio || 'No bio yet'}
                </p>
              )}
            </div>

            {/* Contact */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Contact</h3>
              <div className="space-y-3">
                {/* Display name (editable; also shown on user dropdown) */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-indigo/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-neon-indigo" />
                  </div>
                  {editing ? (
                    <input
                      type="text"
                      value={form.displayName}
                      onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                      placeholder="Tên hiển thị (vd: Cuong Hoang)"
                      maxLength={100}
                      className="flex-1 min-w-0 px-2.5 py-1.5 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                    />
                  ) : (
                    <span className="text-sm text-text-secondary truncate">{form.displayName || form.username}</span>
                  )}
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-indigo/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-neon-indigo" />
                  </div>
                  {editing ? (
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="flex-1 min-w-0 px-2.5 py-1.5 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors"
                    />
                  ) : (
                    <span className="text-sm text-text-secondary truncate">{form.email}</span>
                  )}
                </div>

                {/* Full name (legal name — separate from displayName) */}
                {editing && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neon-violet/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-neon-violet" />
                    </div>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Họ tên thật"
                      maxLength={100}
                      className="flex-1 min-w-0 px-2.5 py-1.5 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                    />
                  </div>
                )}

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-neon-emerald/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-neon-emerald" />
                  </div>
                  {editing ? (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Số điện thoại"
                      maxLength={20}
                      className="flex-1 min-w-0 px-2.5 py-1.5 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                    />
                  ) : (
                    <span className="text-sm text-text-secondary truncate">{form.phone || 'Chưa cập nhật'}</span>
                  )}
                </div>

                {/* Gender + birth year side by side when editing, single line when viewing */}
                {editing ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-neon-cyan" />
                      </div>
                      <select
                        value={form.gender}
                        onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                        className="flex-1 min-w-0 px-2.5 py-1.5 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors cursor-pointer"
                      >
                        <option value="">Giới tính</option>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Khác</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-neon-fuchsia/10 flex items-center justify-center shrink-0">
                        <Cake className="w-4 h-4 text-neon-fuchsia" />
                      </div>
                      <input
                        type="number"
                        value={form.birthYear}
                        onChange={(e) => setForm({ ...form, birthYear: e.target.value ? Number(e.target.value) : '' })}
                        placeholder="Năm sinh"
                        min={1900}
                        max={new Date().getFullYear()}
                        className="flex-1 min-w-0 px-2.5 py-1.5 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-text-secondary">
                        {form.gender === 'MALE' ? 'Nam' : form.gender === 'FEMALE' ? 'Nữ' : form.gender === 'OTHER' ? 'Khác' : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cake className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-text-secondary">
                        {form.birthYear ? `${form.birthYear} (${new Date().getFullYear() - Number(form.birthYear)} tuổi)` : '—'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Avatar URL (only when editing) */}
                {editing && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-neon-emerald/10 flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4 text-neon-emerald" />
                      </div>
                      <input
                        type="url"
                        value={form.avatarUrl}
                        onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                        onBlur={handleAvatarUrlBlur}
                        placeholder="URL Avatar (https://...)"
                        className="flex-1 min-w-0 px-2.5 py-1.5 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                      />
                    </div>
                    <p className="text-xs text-text-muted pl-11">Paste image link or upload image at avatar</p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Liên kết</h3>
              <div className="space-y-2.5">
                {[
                  { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/...' },
                  { key: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'https://twitter.com/...' },
                  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/...' },
                  { key: 'website', label: 'Website', icon: Globe, placeholder: 'https://...' },
                  { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/...' },
                  { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/...' },
                ].map(({ key, label, icon: Icon, placeholder }) => {
                  const value = form.socialLinks[key] || '';
                  if (!editing && !value) return null;
                  return (
                    <div key={key} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 text-text-muted" />
                      </div>
                      {editing ? (
                        <input
                          type="url"
                          value={value}
                          onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: e.target.value } })}
                          placeholder={placeholder}
                          className="flex-1 min-w-0 px-2.5 py-1.5 bg-darkbg border border-darkborder rounded-lg text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                        />
                      ) : (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-0 text-xs text-text-secondary hover:text-neon-violet transition-colors truncate flex items-center gap-1.5"
                        >
                          <span>{label}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      )}
                    </div>
                  );
                })}
                {!editing && Object.values(form.socialLinks).every((v) => !v) && (
                  <p className="text-xs text-text-muted">Chưa có liên kết nào</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Statistics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-darkbg rounded-xl">
                  <p className="text-xl font-bold text-neon-indigo">{stats.joinedDays}</p>
                  <p className="text-xs text-text-muted mt-0.5">Days</p>
                </div>
                <div className="text-center p-3 bg-darkbg rounded-xl">
                  <p className="text-xl font-bold text-neon-violet">{followStats.followers}</p>
                  <p className="text-xs text-text-muted mt-0.5">Followers</p>
                </div>
                <div className="text-center p-3 bg-darkbg rounded-xl">
                  <p className="text-xl font-bold text-neon-emerald">{followStats.following}</p>
                  <p className="text-xs text-text-muted mt-0.5">Following</p>
                </div>
                <div className="text-center p-3 bg-darkbg rounded-xl">
                  <p className="text-xl font-bold text-neon-cyan">{profile?.roles?.length || 1}</p>
                  <p className="text-xs text-text-muted mt-0.5">Roles</p>
                </div>
              </div>
            </div>

            {/* Joined */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Activity</h3>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Calendar className="w-4 h-4 text-text-muted shrink-0" />
                <span>Joined {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'recently'}</span>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-1 bg-darkcard border border-darkborder rounded-2xl p-1.5 overflow-x-auto">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'courses', label: 'My Courses', icon: BookOpen },
                ...(canEdit ? [{ id: 'password', label: 'Password', icon: KeyRound }] : []),
                { id: 'settings', label: 'Settings', icon: MessageSquare },
                { id: 'activity', label: 'Activity', icon: Shield },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-neon-indigo to-neon-violet text-white'
                      : 'text-text-muted hover:text-text-primary hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-heading font-bold text-text-primary">Personal Information</h2>
                    <p className="text-sm text-text-muted mt-1">Manage your profile information</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">Username</label>
                      <div className="px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-sm text-text-secondary">
                        @{form.username}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">Full Name</label>
                      {editing ? (
                        <input
                          type="text"
                          value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                          className="w-full px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors"
                          placeholder="Enter full name"
                        />
                      ) : (
                        <div className="px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-sm text-text-secondary">
                          {form.fullName || 'Not updated'}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">Email</label>
                    {editing ? (
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors"
                        placeholder="Enter email"
                      />
                    ) : (
                      <div className="px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-sm text-text-secondary">
                        {form.email}
                      </div>
                    )}
                  </div>

                  {editing && (
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        onClick={() => {
                          setEditing(false);
                          setForm({
                            fullName: profile?.fullName || '',
                            displayName: profile?.displayName || profile?.username || '',
                            email: profile?.email || '',
                            username: profile?.username || '',
                            avatarUrl: profile?.avatarUrl || '',
                            coverPhotoUrl: profile?.coverPhotoUrl || '',
                            bio: profile?.bio || '',
                            gender: (profile?.gender as any) || '',
                            birthYear: profile?.birthYear || '',
                            phone: profile?.phone || '',
                            socialLinks: {
                              github: profile?.socialLinks?.github || '',
                              twitter: profile?.socialLinks?.twitter || '',
                              linkedin: profile?.socialLinks?.linkedin || '',
                              website: profile?.socialLinks?.website || '',
                              youtube: profile?.socialLinks?.youtube || '',
                              facebook: profile?.socialLinks?.facebook || '',
                            },
                          });
                        }}
                        className="px-5 py-2.5 bg-darkbg border border-darkborder rounded-xl text-sm text-text-secondary hover:text-text-primary transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {saving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-heading font-bold text-text-primary">Change Password</h2>
                    <p className="text-sm text-text-muted mt-1">Update your password to protect your account</p>
                  </div>

                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors"
                        placeholder="At least 8 characters"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-text-muted uppercase tracking-wider">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-darkbg border border-darkborder rounded-xl text-sm text-text-primary focus:outline-none focus:border-neon-violet/50 transition-colors"
                        placeholder="Re-enter new password"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleChangePassword}
                        disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {saving ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <KeyRound className="w-4 h-4" />
                        )}
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-heading font-bold text-text-primary">Activity & Security</h2>
                    <p className="text-sm text-text-muted mt-1">Manage account activities</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-darkbg rounded-xl border border-darkborder">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neon-indigo/10 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-neon-indigo" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">Two-Factor Authentication (2FA)</p>
                          <p className="text-xs text-text-muted mt-0.5">Protect your account with 2FA</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-darkcard border border-darkborder rounded-xl text-sm text-text-muted hover:text-text-primary hover:border-neon-violet/50 transition-colors">
                        Setup
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-darkbg rounded-xl border border-darkborder">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neon-emerald/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-neon-emerald" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">Active Sessions</p>
                          <p className="text-xs text-text-muted mt-0.5">Manage logged-in devices</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-darkcard border border-darkborder rounded-xl text-sm text-text-muted hover:text-text-primary hover:border-neon-violet/50 transition-colors">
                        View
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-darkbg rounded-xl border border-darkborder">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neon-violet/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-neon-violet" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">Activity Log</p>
                          <p className="text-xs text-text-muted mt-0.5">Login history and changes</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-darkcard border border-darkborder rounded-xl text-sm text-text-muted hover:text-text-primary hover:border-neon-violet/50 transition-colors">
                        View
                      </button>
                    </div>
                  </div>

                  {/* Roles */}
                  <div>
                    <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Roles</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.roles?.map((role) => {
                        const normalized = (role || '').replace('ROLE_', '').toUpperCase();
                        const isAdmin = normalized === 'ADMIN';
                        return (
                          <span key={role} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            isAdmin
                              ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                              : 'bg-neon-indigo/15 text-neon-indigo border border-neon-indigo/30'
                          }`}>
                            {isAdmin ? 'Administrator' : 'User'}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <div
                    className="rounded-2xl p-6"
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <h3 className="mb-1 text-sm font-semibold text-text-primary">Quyền riêng tư tin nhắn</h3>
                    <p className="mb-4 text-xs text-text-muted">
                      Khi bật, người lạ có thể bắt đầu cuộc trò chuyện mới với bạn. Khi tắt, chỉ những người đã từng nhắn tin với bạn
                      mới có thể tiếp tục gửi tin nhắn.
                    </p>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:border-cyan-500/30">
                      <input
                        type="checkbox"
                        checked={allowMessagesFromStrangers}
                        onChange={(e) => setAllowMessagesFromStrangers(e.target.checked)}
                        className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/40"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">
                          Cho phép người lạ nhắn tin cho tôi
                        </p>
                        <p className="mt-0.5 text-[11px] text-text-muted">
                          {allowMessagesFromStrangers
                            ? 'Bất kỳ ai cũng có thể bắt đầu cuộc trò chuyện mới với bạn.'
                            : 'Người lạ sẽ thấy nút Nhắn tin bị vô hiệu hoá trên hồ sơ của bạn.'}
                        </p>
                      </div>
                    </label>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleSavePrivacy}
                        disabled={savingPrivacy || (allowMessagesFromStrangers === (profile?.allowMessagesFromStrangers ?? true))}
                        className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ background: 'linear-gradient(90deg, #06B6D4, #6366F1)' }}
                      >
                        <Save className="h-3.5 w-3.5" />
                        {savingPrivacy ? 'Đang lưu...' : 'Lưu cài đặt'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'courses' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-heading font-bold text-text-primary">Learning Dashboard</h2>
                      <p className="text-sm text-text-muted mt-1">Track your learning progress</p>
                    </div>
                    <Link
                      href="/my-courses"
                      className="text-sm text-neon-violet hover:text-neon-indigo transition-colors"
                    >
                      View All
                    </Link>
                  </div>

                  {/* Learning stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Enrolled', value: courseStats.total, icon: BookOpen, color: 'from-neon-indigo to-neon-violet' },
                      { label: 'In Progress', value: courseStats.inProgress, icon: PlayCircle, color: 'from-yellow-400 to-orange-500' },
                      { label: 'Completed', value: courseStats.completed, icon: CheckCircle, color: 'from-green-400 to-emerald-500' },
                      { label: 'Hours Learned', value: `${courseStats.hoursLearned}h`, icon: Clock, color: 'from-neon-cyan to-blue-500' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-darkbg rounded-xl p-4 border border-darkborder text-center">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                          <stat.icon className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-xl font-bold text-text-primary">{courseLoading ? '...' : stat.value}</p>
                        <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* My courses */}
                  {courseLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-darkcard rounded-xl overflow-hidden border border-darkborder/50">
                            <div className="aspect-video bg-darkbg" />
                            <div className="p-3 space-y-2">
                              <div className="h-4 bg-darkbg rounded w-3/4" />
                              <div className="h-2 bg-darkbg rounded w-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : myCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {myCourses.map((enrollment: any, i: number) => (
                        <Link
                          key={enrollment.id}
                          href={`/courses/${enrollment.courseSlug}`}
                          className="bg-darkcard border border-darkborder rounded-xl overflow-hidden hover:border-neon-violet/40 transition-all group"
                        >
                          <div className="aspect-video bg-darkbg relative overflow-hidden">
                            {enrollment.courseThumbnail ? (
                              <img src={enrollment.courseThumbnail} alt={enrollment.courseTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-neon-indigo/20 to-neon-violet/20 flex items-center justify-center">
                                <BookOpen className="w-8 h-8 text-neon-violet/40" />
                              </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                              <div
                                className="h-full bg-gradient-to-r from-neon-indigo to-neon-violet"
                                style={{ width: `${enrollment.progressPercent || 0}%` }}
                              />
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-neon-violet transition-colors">
                              {enrollment.courseTitle}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-neon-violet font-medium">{enrollment.progressPercent || 0}% done</span>
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                enrollment.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {enrollment.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-darkcard rounded-2xl border border-darkborder">
                      <BookOpen className="w-12 h-12 text-text-muted/30 mx-auto mb-3" />
                      <p className="text-text-muted mb-3">No courses yet</p>
                      <Link
                        href="/academy"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-neon-indigo to-neon-violet text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                      >
                        Browse Academy
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
