'use client';

/**
 * /settings/profile — edit your own profile.
 *
 * This route was referenced in the docblock of app/profile/page.tsx ("the
 * legacy editing features have been preserved at /settings/profile") but
 * never actually existed, so that link 404'd. It exists now.
 *
 * Backend: GET/PUT /api/v1/profile — already validated every field
 * server-side (authService.updateProfile). We mirror those rules in the
 * client so the user gets the error next to the field instead of a toast
 * after a round-trip.
 */

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { User, Link2, Save, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { authApi, fileApi } from '@/lib/api';
import { TheTenDangNhap } from '@/components/settings/TheTenDangNhap';
import { useAuthStore } from '@/store/authStore';
import {
  SettingsPage, SettingsCard, Field, TextInput, TextArea, Button,
} from '@/components/settings/primitives';

/** Keys the backend whitelists in `socialLinks`. Anything else is
 *  rejected by authService.updateProfile, so don't offer it here. */
const SOCIAL_KEYS = [
  { key: 'github', label: 'GitHub', placeholder: 'https://github.com/ten-cua-ban' },
  { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/ten-cua-ban' },
  { key: 'facebook', label: 'Facebook', placeholder: 'https://facebook.com/ten-cua-ban' },
  { key: 'twitter', label: 'X (Twitter)', placeholder: 'https://x.com/ten-cua-ban' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://youtube.com/@ten-cua-ban' },
  { key: 'website', label: 'Website', placeholder: 'https://trang-cua-ban.com' },
] as const;

interface ProfileForm {
  displayName: string;
  fullName: string;
  email: string;
  bio: string;
  gender: '' | 'MALE' | 'FEMALE' | 'OTHER';
  birthYear: string;
  phone: string;
  avatarUrl: string;
  coverPhotoUrl: string;
  socialLinks: Record<string, string>;
}

const EMPTY: ProfileForm = {
  displayName: '', fullName: '', email: '', bio: '', gender: '',
  birthYear: '', phone: '', avatarUrl: '', coverPhotoUrl: '', socialLinks: {},
};

const CURRENT_YEAR = new Date().getFullYear();

export default function ProfileSettingsPage() {
  const updateUser = useAuthStore((s) => s.updateUser);
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [taiKhoan, setTaiKhoan] = useState<{ username: string; provider: string | null }>({ username: '', provider: null });
  const [dangTaiAnh, setDangTaiAnh] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authApi.getProfile();
        const p = ((res.data as any)?.data ?? {}) as Record<string, any>;
        if (cancelled) return;
        setTaiKhoan({ username: String(p.username ?? ''), provider: (p.provider as string | null) ?? null });
        setForm({
          displayName: p.displayName ?? '',
          fullName: p.fullName ?? '',
          email: p.email ?? '',
          bio: p.bio ?? '',
          gender: (p.gender as ProfileForm['gender']) ?? '',
          birthYear: p.birthYear ? String(p.birthYear) : '',
          phone: p.phone ?? '',
          avatarUrl: p.avatarUrl ?? '',
          coverPhotoUrl: p.coverPhotoUrl ?? '',
          socialLinks:
            p.socialLinks && typeof p.socialLinks === 'object' ? (p.socialLinks as Record<string, string>) : {},
        });
      } catch {
        if (!cancelled) toast.error('Không tải được hồ sơ. Vui lòng thử lại.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const set = useCallback(<K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => (e[k as string] ? { ...e, [k as string]: '' } : e));
  }, []);

  /** Mirror of the server-side rules in authService.updateProfile, so an
   *  invalid value is caught next to the field rather than as a toast. */
  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (form.displayName.trim().length > 100) e.displayName = 'Tối đa 100 ký tự';
    if (form.birthYear) {
      const y = Number(form.birthYear);
      if (!Number.isInteger(y) || y < 1900 || y > CURRENT_YEAR) {
        e.birthYear = `Năm sinh phải trong khoảng 1900–${CURRENT_YEAR}`;
      }
    }
    if (form.phone && !/^[\d\s+\-()]{10,20}$/.test(form.phone.trim())) {
      e.phone = 'Số điện thoại 10–20 ký tự (chỉ số, khoảng trắng, + - )';
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = 'Email không hợp lệ';
    }
    for (const { key, label } of SOCIAL_KEYS) {
      const v = form.socialLinks[key]?.trim();
      if (!v) continue;
      try {
        const u = new URL(v);
        if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error('scheme');
      } catch {
        e[`social_${key}`] = `Link ${label} phải là URL đầy đủ (bắt đầu bằng https://)`;
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error('Vui lòng sửa các trường được đánh dấu.');
      return;
    }
    setSaving(true);
    try {
      // Empty string means "clear this field" — send null, since the
      // backend treats '' as "no change" for the optional columns.
      const socialLinks: Record<string, string> = {};
      for (const { key } of SOCIAL_KEYS) {
        const v = form.socialLinks[key]?.trim();
        if (v) socialLinks[key] = v;
      }

      const res = await authApi.updateProfile({
        displayName: form.displayName.trim() || undefined,
        fullName: form.fullName.trim() || undefined,
        email: form.email.trim() || undefined,
        bio: form.bio.trim(),
        gender: form.gender || null,
        birthYear: form.birthYear ? Number(form.birthYear) : null,
        phone: form.phone.trim() || null,
        avatarUrl: form.avatarUrl.trim() || undefined,
        socialLinks,
      });

      // Keep the navbar avatar / name in step without a page reload.
      const updated = (res.data as any)?.data;
      if (updated) updateUser(updated);
      toast.success('Đã lưu hồ sơ.');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Lưu hồ sơ thất bại. Vui lòng thử lại.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  /** Tải ảnh lên R2 rồi lưu NGAY vào hồ sơ — không bắt bấm "Lưu thay đổi" thêm lần nữa. */
  const taiAnh = async (file: File) => {
    if (file.size > 8 * 1024 * 1024) { toast.error('Ảnh tối đa 8 MB.'); return; }
    setDangTaiAnh(true);
    try {
      const up = (await fileApi.upload(file, 'images')) as { data?: { data?: { url?: string } } };
      const url = up.data?.data?.url;
      if (!url) throw new Error('no url');
      const res = await authApi.updateProfile({ avatarUrl: url });
      set('avatarUrl', url);
      const updated = (res.data as { data?: unknown })?.data;
      if (updated) updateUser(updated as never);
      toast.success('Đã đổi ảnh đại diện.');
    } catch {
      toast.error('Tải ảnh lên thất bại. Vui lòng thử lại.');
    } finally {
      setDangTaiAnh(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <Loader2 className="h-4 w-4 animate-spin" /> Đang tải hồ sơ…
      </div>
    );
  }

  return (
    <SettingsPage
      title="Hồ sơ"
      description="Thông tin hiển thị công khai trên trang cá nhân, bài viết và bình luận của bạn."
      action={
        <Button onClick={handleSave} loading={saving}>
          <Save className="h-4 w-4" /> Lưu thay đổi
        </Button>
      }
    >
      {taiKhoan.username && (
        <TheTenDangNhap
          username={taiKhoan.username}
          provider={taiKhoan.provider}
          onDoi={(p) => {
            setTaiKhoan((t) => ({ ...t, username: String(p.username ?? t.username) }));
            if (typeof p.displayName === 'string') set('displayName', p.displayName);
            updateUser(p as never);
          }}
        />
      )}

      <SettingsCard title="Thông tin cơ bản" icon={<User className="h-4 w-4" />}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tên hiển thị" hint="Tên mọi người thấy trên feed và bình luận" error={errors.displayName}>
            <TextInput
              value={form.displayName}
              maxLength={100}
              onChange={(e) => set('displayName', e.target.value)}
              placeholder="e.g. Cuong Hoang"
            />
          </Field>

          <Field label="Họ và tên" error={errors.fullName}>
            <TextInput
              value={form.fullName}
              maxLength={100}
              onChange={(e) => set('fullName', e.target.value)}
              placeholder="e.g. Hoang Nghia Cuong"
            />
          </Field>

          <Field label="Email" error={errors.email}>
            <TextInput
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="ban@example.com"
            />
          </Field>

          <Field label="Số điện thoại" hint="Không bắt buộc" error={errors.phone}>
            <TextInput
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="0912 345 678"
            />
          </Field>

          <Field label="Giới tính">
            <select
              value={form.gender}
              onChange={(e) => set('gender', e.target.value as ProfileForm['gender'])}
              className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">Không tiết lộ</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </Field>

          <Field label="Năm sinh" hint="Chỉ lưu năm, không lưu ngày/tháng" error={errors.birthYear}>
            <TextInput
              type="number"
              min={1900}
              max={CURRENT_YEAR}
              value={form.birthYear}
              onChange={(e) => set('birthYear', e.target.value)}
              placeholder="2003"
            />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Tiểu sử" hint={`${form.bio.length} ký tự`}>
            <TextArea
              rows={4}
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              placeholder="A few lines about you…"
            />
          </Field>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Ảnh đại diện"
        description="Tải ảnh từ máy lên (lưu ngay, đồng bộ cả web và app) hoặc dán link ảnh."
        icon={<ImageIcon className="h-4 w-4" />}
      >
        <div className="flex flex-wrap items-center gap-4">
          {form.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.avatarUrl}
              alt="Ảnh đại diện"
              className="h-16 w-16 rounded-full object-cover"
              style={{ border: '1px solid var(--border-color)' }}
            />
          ) : (
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}
            >
              <User className="h-6 w-6" />
            </div>
          )}
          <label
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
          >
            {dangTaiAnh ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {dangTaiAnh ? 'Đang tải lên…' : 'Tải ảnh lên'}
            <input type="file" accept="image/*" className="hidden" disabled={dangTaiAnh} onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ''; if (f) void taiAnh(f); }} />
          </label>
          <div className="min-w-[240px] flex-1">
            <Field label="Link ảnh đại diện">
              <TextInput
                value={form.avatarUrl}
                onChange={(e) => set('avatarUrl', e.target.value)}
                placeholder="https://…"
              />
            </Field>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Liên kết mạng xã hội"
        description="Hiện ở trang cá nhân. Phải là URL đầy đủ, bắt đầu bằng https://"
        icon={<Link2 className="h-4 w-4" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {SOCIAL_KEYS.map(({ key, label, placeholder }) => (
            <Field key={key} label={label} error={errors[`social_${key}`]}>
              <TextInput
                value={form.socialLinks[key] ?? ''}
                onChange={(e) =>
                  set('socialLinks', { ...form.socialLinks, [key]: e.target.value })
                }
                placeholder={placeholder}
              />
            </Field>
          ))}
        </div>
      </SettingsCard>

      <div className="flex justify-end pb-4">
        <Button onClick={handleSave} loading={saving}>
          <Save className="h-4 w-4" /> Lưu thay đổi
        </Button>
      </div>
    </SettingsPage>
  );
}
