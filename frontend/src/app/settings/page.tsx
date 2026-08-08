'use client';

/**
 * /settings — the hub. This route was a 404 until 2026-08-08; the avatar
 * menu deep-linked straight to /settings/notifications, so the rest of
 * the settings surface had no entry point at all.
 */

import Link from 'next/link';
import {
  User, Bell, Palette, Lock, ShieldCheck, Database,
  ChevronRight, Settings as SettingsIcon, Crown, Mail, CalendarDays,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { SETTINGS_SECTIONS } from './SettingsNav';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  User, Bell, Palette, Lock, ShieldCheck, Database,
};

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d.toLocaleDateString('vi-VN') : '—';
}

export default function SettingsIndexPage() {
  const user = useAuthStore((s) => s.user) as
    | (Record<string, unknown> & {
        username?: string;
        email?: string;
        displayName?: string | null;
        fullName?: string | null;
        avatarUrl?: string | null;
        isPro?: boolean;
        createdAt?: string;
      })
    | null;

  const displayName = user?.displayName || user?.fullName || user?.username || 'Người dùng';

  return (
    <div className="w-full">
      {/* Identity card — answers "which account am I changing?" before the
          user starts flipping switches. */}
      <section
        className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border p-5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        {user?.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="h-16 w-16 rounded-full object-cover"
            style={{ border: '1px solid var(--border-color)' }}
          />
        ) : (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' }}
          >
            {displayName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {displayName}
            </h2>
            {user?.isPro && (
              <span
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24' }}
              >
                <Crown className="h-3 w-3" /> PRO
              </span>
            )}
          </div>
          <div
            className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {user?.username && <span>@{user.username}</span>}
            {user?.email && (
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" /> {user.email}
              </span>
            )}
            {user?.createdAt && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3 w-3" /> Tham gia {formatDate(user.createdAt)}
              </span>
            )}
          </div>
        </div>

        <Link
          href="/settings/profile"
          className="rounded-xl px-4 py-2 text-sm font-medium text-white"
          style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' }}
        >
          Sửa hồ sơ
        </Link>
      </section>

      <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        Tất cả cài đặt
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {SETTINGS_SECTIONS.map((s) => {
          const Icon = ICONS[s.icon] ?? SettingsIcon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="group flex items-start gap-3 rounded-2xl border p-4 transition-colors"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {s.label}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {s.description}
                </p>
              </div>
              <ChevronRight
                className="mt-0.5 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                style={{ color: 'var(--text-muted)' }}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
