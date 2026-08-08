'use client';

/**
 * /settings shell — sidebar on desktop, horizontal tab strip on mobile.
 *
 * Before this existed, /settings itself was a 404: the only routes were
 * /settings/notifications (linked from the avatar menu) and
 * /settings/account, which nothing linked to at all.
 *
 * Auth: every child page reads or writes the signed-in user's own data,
 * so the gate lives here rather than being re-implemented six times.
 * We wait for the auth store to finish hydrating before deciding — the
 * store restores from a cookie asynchronously, and gating on the first
 * render would bounce a legitimately signed-in user to /login on reload.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  User, Bell, Palette, Lock, ShieldCheck, Database,
  ArrowLeft, Settings as SettingsIcon, Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { SETTINGS_SECTIONS } from './SettingsNav';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  User, Bell, Palette, Lock, ShieldCheck, Database,
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  // Do NOT gate on `useAuthStore().isHydrated`. Zustand persist's
  // `onRehydrateStorage` callback does not reliably flip that flag in this
  // app — the dashboard store and /profile both hit it and both work
  // around it (see useDashboardStore.ts and profile/page.tsx), and gating
  // this layout on it left every settings page stuck on "Đang tải…"
  // forever for a signed-in user.
  //
  // Instead: trust the store if it already says we're authenticated, and
  // otherwise fall back to reading the persisted `auth-storage` key
  // directly. `mounted` keeps the first client render identical to the
  // server's (no localStorage on the server) so React doesn't throw a
  // hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const persistedUser = (() => {
    if (!mounted || typeof window === 'undefined') return false;
    try {
      const raw = window.localStorage.getItem('auth-storage');
      return !!raw && JSON.parse(raw)?.state?.user != null;
    } catch {
      return false;
    }
  })();

  const signedIn = (isAuthenticated && user != null) || persistedUser;
  const ready = mounted && signedIn;

  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10">
        {/* Back to profile — mirrors where the old notifications page linked. */}
        <Link
          href="/profile"
          className="mb-5 inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại trang cá nhân
        </Link>

        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)' }}
          >
            <SettingsIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Cài đặt
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Quản lý tài khoản, thông báo, quyền riêng tư và giao diện
            </p>
          </div>
        </div>

        {!ready ? (
          <div
            className="flex items-center justify-center gap-2 rounded-2xl border py-16 text-sm"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            {mounted ? (
              <span>
                Vui lòng{' '}
                <button
                  onClick={() => router.push('/login?next=/settings')}
                  className="font-medium text-neon-violet hover:underline"
                >
                  đăng nhập
                </button>{' '}
                để mở phần cài đặt.
              </span>
            ) : (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải…
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* ── Nav ─────────────────────────────────────────────
                Desktop: sticky sidebar. Mobile: a horizontally
                scrollable strip — a stacked list of 6 items would push
                the actual settings below the fold on every page. */}
            <nav
              className={cn(
                'shrink-0 lg:w-60',
                '-mx-4 overflow-x-auto px-4 lg:mx-0 lg:overflow-visible lg:px-0',
              )}
            >
              <ul
                className={cn(
                  'flex gap-1.5 lg:sticky lg:top-20 lg:flex-col',
                  'pb-2 lg:pb-0',
                )}
              >
                {SETTINGS_SECTIONS.map((s) => {
                  const Icon = ICONS[s.icon] ?? SettingsIcon;
                  const active = pathname === s.href;
                  return (
                    <li key={s.href} className="shrink-0">
                      <Link
                        href={s.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors lg:w-full',
                        )}
                        style={{
                          background: active ? 'var(--bg-card)' : 'transparent',
                          color: active ? '#8b5cf6' : 'var(--text-secondary)',
                          border: `1px solid ${active ? 'rgba(139,92,246,0.35)' : 'transparent'}`,
                        }}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {s.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <main className="min-w-0 flex-1">{children}</main>
          </div>
        )}
      </div>
    </div>
  );
}
