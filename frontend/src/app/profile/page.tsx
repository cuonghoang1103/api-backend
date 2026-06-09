'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useSession } from 'next-auth/react';
import { api, coursesApi } from '@/lib/api';
import { toast } from 'sonner';
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
} from 'lucide-react';

interface ProfileData {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
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
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'activity' | 'courses'>('profile');
  const [editing, setEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    username: '',
    avatarUrl: '',
    bio: '',
  });

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/profile');
        const data = res.data?.data;
        setProfile(data);
        setForm({
          fullName: data?.fullName || '',
          email: data?.email || '',
          username: data?.username || '',
          avatarUrl: data?.avatarUrl || '',
          bio: data?.bio || '',
        });
      } catch {
        if (user) {
          setForm({
            fullName: (user as any).fullName || '',
            email: user.email || '',
            username: user.username || '',
            avatarUrl: '',
            bio: '',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, hasSocialAuth]);

  useEffect(() => {
    if (profile?.createdAt) {
      const created = new Date(profile.createdAt);
      const now = new Date();
      const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      setStats(s => ({ ...s, joinedDays: days }));
    }
  }, [profile?.createdAt]);

  useEffect(() => {
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
        console.error('Failed to fetch course stats:', err);
      } finally {
        setCourseLoading(false);
      }
    };
    fetchCourseStats();
  }, [isAuthenticated]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put('/profile', {
        fullName: form.fullName,
        email: form.email,
        bio: form.bio,
        avatarUrl: form.avatarUrl,
      });
      const updated = res.data?.data;
      setProfile((prev) => prev ? { ...prev, ...updated } : prev);
      updateProfile({ ...form });
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Error saving profile');
    } finally {
      setSaving(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-darkbg flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-neon-violet border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkbg">
      {/* Cover + Avatar */}
      <div className="relative">
        <div className="h-48 sm:h-64 bg-gradient-to-r from-neon-indigo via-purple-600 to-neon-violet relative overflow-hidden">
          <div className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }}
          />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-neon-fuchsia/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="relative -mt-16 sm:-mt-20 flex items-end gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative group shrink-0">
              {form.avatarUrl ? (
                <img
                  src={form.avatarUrl}
                  alt={form.username}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-darkbg shadow-2xl"
                />
              ) : (
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-neon-indigo to-neon-violet flex items-center justify-center text-white text-4xl sm:text-5xl font-bold border-4 border-darkbg shadow-2xl">
                  {form.username?.charAt(0).toUpperCase()}
                </div>
              )}
              {editing && (
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                  setUploadingAvatar(true);
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await api.post('/files/upload', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    const url = res.data?.data?.url || res.data?.data;
                    setForm(prev => ({ ...prev, avatarUrl: url }));
                    toast.success('Image uploaded successfully!');
                  } catch {
                    toast.error('Image upload failed');
                  } finally {
                    setUploadingAvatar(false);
                  }
                }}
              />
            </div>

            {/* Name + meta */}
            <div className="pb-3 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                  {form.fullName || form.username}
                </h1>
                {profile?.roles?.map((role) => (
                  <span key={role} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    role === 'ADMIN' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-neon-indigo/20 text-neon-indigo border border-neon-indigo/30'
                  }`}>
                    {role === 'ADMIN' ? 'Administrator' : 'User'}
                  </span>
                ))}
              </div>
              <p className="text-text-secondary text-sm mt-1">@{form.username}</p>
            </div>

            {/* Edit button */}
            <div className="pb-3 shrink-0">
              {editing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setForm({ fullName: profile?.fullName || '', email: profile?.email || '', username: profile?.username || '', avatarUrl: profile?.avatarUrl || '', bio: profile?.bio || '' }); }}
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
                {editing && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neon-violet/10 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-neon-violet" />
                    </div>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      placeholder="Full Name"
                      className="flex-1 min-w-0 px-2.5 py-1.5 bg-darkbg border border-darkborder rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-violet/50 transition-colors"
                    />
                  </div>
                )}
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

            {/* Stats */}
            <div className="bg-darkcard border border-darkborder rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Statistics</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-darkbg rounded-xl">
                  <p className="text-xl font-bold text-neon-indigo">{stats.joinedDays}</p>
                  <p className="text-xs text-text-muted mt-0.5">Days</p>
                </div>
                <div className="text-center p-3 bg-darkbg rounded-xl">
                  <p className="text-xl font-bold text-neon-violet">{profile?.roles?.length || 1}</p>
                  <p className="text-xs text-text-muted mt-0.5">Roles</p>
                </div>
                <div className="text-center p-3 bg-darkbg rounded-xl">
                  <p className="text-xl font-bold text-neon-emerald">v1</p>
                  <p className="text-xs text-text-muted mt-0.5">Version</p>
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
                        onClick={() => { setEditing(false); setForm({ fullName: profile?.fullName || '', email: profile?.email || '', username: profile?.username || '', avatarUrl: profile?.avatarUrl || '', bio: profile?.bio || '' }); }}
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
                      {profile?.roles?.map((role) => (
                        <span key={role} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          role === 'ADMIN' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30' : 'bg-neon-indigo/15 text-neon-indigo border border-neon-indigo/30'
                        }`}>
                          {role === 'ADMIN' ? 'Administrator' : 'User'}
                        </span>
                      ))}
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
