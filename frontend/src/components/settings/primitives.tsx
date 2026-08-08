'use client';

/**
 * Shared building blocks for /settings (added 2026-08-08).
 *
 * Every control here is theme-aware via CSS variables (`--bg-card`,
 * `--text-primary`, …). The page this replaced hardcoded `#0a0a14` and
 * `rgba(15,23,42,.6)`, which meant the settings screen stayed pitch black
 * in light mode while the rest of the site turned white.
 *
 * Per CLAUDE.md: the global dark class is `theme-dark`, never `dark` —
 * Tailwind's `dark:` variant is reserved for the Notes wrapper. Nothing in
 * this file uses a `dark:` utility; it reads the CSS variables instead, so
 * it follows whichever theme is active without a second code path.
 */

import { forwardRef, type ReactNode } from 'react';
import { Loader2, Check, CloudOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SyncStatus } from '@/store/preferencesStore';

/* ─── Page scaffolding ───────────────────────────────────────────── */

export function SettingsPage({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="w-full">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h1>
          {description && (
            <p className="mt-1 max-w-2xl text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {description}
            </p>
          )}
        </div>
        {action}
      </header>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

export function SettingsCard({
  title,
  description,
  icon,
  children,
  footer,
  tone = 'default',
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  /** `danger` tints the card red — reserved for irreversible actions. */
  tone?: 'default' | 'danger';
}) {
  const danger = tone === 'danger';
  return (
    <section
      className="rounded-2xl border"
      style={{
        background: danger ? 'rgba(244,63,94,0.05)' : 'var(--bg-card)',
        borderColor: danger ? 'rgba(244,63,94,0.35)' : 'var(--border-color)',
      }}
    >
      {(title || description) && (
        <div className="flex items-start gap-3 px-5 pt-5">
          {icon && (
            <div
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: danger ? 'rgba(244,63,94,0.12)' : 'var(--bg-surface)',
                color: danger ? '#f43f5e' : 'var(--text-secondary)',
              }}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h2
                className="text-base font-semibold"
                style={{ color: danger ? '#f43f5e' : 'var(--text-primary)' }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      {children && <div className="px-5 py-5">{children}</div>}
      {footer && (
        <div className="border-t px-5 py-3" style={{ borderColor: 'var(--border-color)' }}>
          {footer}
        </div>
      )}
    </section>
  );
}

/** A labelled row with the control on the right. Stacks on narrow screens
 *  so a long Vietnamese label never squeezes the control to nothing. */
export function SettingsRow({
  label,
  description,
  control,
  icon,
  children,
}: {
  label: string;
  description?: string;
  control?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {icon && (
            <div
              className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {label}
            </p>
            {description && (
              <p className="mt-0.5 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {description}
              </p>
            )}
          </div>
        </div>
        {control && <div className="shrink-0">{control}</div>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function SettingsDivider() {
  return <div className="my-1 h-px" style={{ background: 'var(--border-color)' }} />;
}

/* ─── Controls ───────────────────────────────────────────────────── */

/**
 * Accessible switch. The version this replaces used a bare `<div>` with a
 * visually-hidden checkbox and no label association, so screen readers
 * announced an unlabelled checkbox and the toggle had no visible focus
 * ring — it was unreachable by keyboard in practice.
 */
export function Toggle({
  checked,
  onChange,
  disabled,
  label,
  size = 'md',
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  /** Accessible name. Required — a switch with no name is a dead control
   *  for anyone not looking at the screen. */
  label: string;
  size?: 'sm' | 'md';
}) {
  const w = size === 'sm' ? 36 : 44;
  const h = size === 'sm' ? 20 : 24;
  const knob = h - 6;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative shrink-0 rounded-full outline-none transition-colors',
        'focus-visible:ring-2 focus-visible:ring-offset-2',
        disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer',
      )}
      style={{
        width: w,
        height: h,
        background: checked ? '#8b5cf6' : 'var(--bg-surface-active)',
        // @ts-expect-error — CSS custom property for the focus ring colour
        '--tw-ring-color': '#8b5cf6',
        '--tw-ring-offset-color': 'var(--bg-card)',
      }}
    >
      <span
        className="absolute rounded-full bg-white shadow-sm transition-transform"
        style={{
          width: knob,
          height: knob,
          top: 3,
          left: 3,
          transform: checked ? `translateX(${w - knob - 6}px)` : 'translateX(0)',
        }}
      />
    </button>
  );
}

export const TextInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function TextInput({ className, style, ...props }, ref) {
    return (
      <input
        ref={ref}
        {...props}
        className={cn(
          'w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors',
          'focus:border-violet-500',
          className,
        )}
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)',
          ...style,
        }}
      />
    );
  },
);

export function TextArea({ className, style, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full resize-y rounded-xl border px-3 py-2 text-sm outline-none transition-colors',
        'focus:border-violet-500',
        className,
      )}
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
        ...style,
      }}
    />
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1 block text-xs text-rose-500">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function Button({
  variant = 'primary',
  loading,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: 'linear-gradient(135deg,#8b5cf6,#06b6d4)', color: '#fff' },
    secondary: {
      background: 'var(--bg-surface)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-color)',
    },
    danger: { background: '#e11d48', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--text-secondary)' },
  };
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(base, className)}
      style={{ ...styles[variant], ...props.style }}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

/* ─── Sync status pill ───────────────────────────────────────────── */

/**
 * Tells the user WHERE their settings live. Without this, "synced to my
 * account" and "saved in this browser only" look identical — and the
 * difference matters the moment they open the site on a second device.
 */
export function SyncBadge({ status }: { status: SyncStatus }) {
  const map: Record<SyncStatus, { icon: ReactNode; text: string; color: string }> = {
    idle: { icon: <Check className="h-3 w-3" />, text: 'Đã đồng bộ với tài khoản', color: '#10b981' },
    saved: { icon: <Check className="h-3 w-3" />, text: 'Đã lưu vào tài khoản', color: '#10b981' },
    loading: { icon: <Loader2 className="h-3 w-3 animate-spin" />, text: 'Đang tải cài đặt…', color: '#8b5cf6' },
    saving: { icon: <Loader2 className="h-3 w-3 animate-spin" />, text: 'Đang lưu…', color: '#8b5cf6' },
    offline: {
      icon: <CloudOff className="h-3 w-3" />,
      text: 'Chỉ lưu trên trình duyệt này',
      color: '#f59e0b',
    },
    error: { icon: <AlertCircle className="h-3 w-3" />, text: 'Lỗi đồng bộ', color: '#f43f5e' },
  };
  const s = map[status] ?? map.idle;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
      style={{ background: `${s.color}1a`, color: s.color }}
    >
      {s.icon}
      {s.text}
    </span>
  );
}

/* ─── Misc ───────────────────────────────────────────────────────── */

export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      {icon && <div className="mb-3" style={{ color: 'var(--text-muted)' }}>{icon}</div>}
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs" style={{ color: 'var(--text-muted)' }}>{description}</p>
      )}
    </div>
  );
}

export function StatusPill({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ background: `${color}1a`, color }}
    >
      {children}
    </span>
  );
}
