'use client';

/**
 * /settings/security — password, email verification, last sign-in.
 *
 * Changing the password was previously only reachable from a modal buried
 * in the avatar dropdown, with no indication that the backend logs you out
 * afterwards (`res.clearCookie('backend_token')` in auth.routes.ts) or
 * that the minimum is 12 characters — users hit both as surprises.
 */

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  KeyRound, ShieldCheck, MailCheck, MailWarning, Monitor,
  Eye, EyeOff, Loader2, LogIn, Globe,
} from 'lucide-react';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import {
  SettingsPage, SettingsCard, SettingsRow, Field, TextInput, Button, StatusPill,
} from '@/components/settings/primitives';

const MIN_PASSWORD = 12; // must match the express-validator rule on the server

interface SecurityInfo {
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  provider: string | null;
  lastLoginAt: string | null;
  lastLoginIp: string | null;
  lastLoginUserAgent: string | null;
  createdAt: string | null;
}

/** Turn a raw UA string into something a human can recognise. Deliberately
 *  crude — this only needs to answer "was that my laptop or not?". */
function describeDevice(ua: string | null): string {
  if (!ua) return 'Không rõ thiết bị';
  const os =
    /Windows NT/i.test(ua) ? 'Windows' :
    /Mac OS X|Macintosh/i.test(ua) ? 'macOS' :
    /Android/i.test(ua) ? 'Android' :
    /iPhone|iPad|iOS/i.test(ua) ? 'iOS' :
    /Linux/i.test(ua) ? 'Linux' : 'Hệ điều hành khác';
  // Order matters: Edge/Cốc Cốc/Chrome all contain "Chrome" in their UA.
  const browser =
    /Coc ?Coc/i.test(ua) ? 'Cốc Cốc' :
    /Edg\//i.test(ua) ? 'Edge' :
    /OPR\//i.test(ua) ? 'Opera' :
    /Firefox\//i.test(ua) ? 'Firefox' :
    /Chrome\//i.test(ua) ? 'Chrome' :
    /Safari\//i.test(ua) ? 'Safari' : 'Trình duyệt khác';
  return `${browser} trên ${os}`;
}

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return '—';
  return d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' });
}

/** Cheap strength meter. Not a security control — it's feedback, so the
 *  user isn't guessing what "strong enough" means. */
function scorePassword(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= MIN_PASSWORD) score++;
  if (pw.length >= 16) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: 'Rất yếu', color: '#f43f5e' };
  if (score === 2) return { score, label: 'Yếu', color: '#fb923c' };
  if (score === 3) return { score, label: 'Khá', color: '#fbbf24' };
  if (score === 4) return { score, label: 'Mạnh', color: '#4ade80' };
  return { score, label: 'Rất mạnh', color: '#10b981' };
}

export default function SecuritySettingsPage() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const [info, setInfo] = useState<SecurityInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authApi.getProfile();
        const p = ((res.data as any)?.data ?? {}) as Record<string, any>;
        if (cancelled) return;
        setInfo({
          email: p.email ?? '',
          emailVerified: !!p.emailVerified,
          emailVerifiedAt: p.emailVerifiedAt ?? null,
          provider: p.provider ?? null,
          lastLoginAt: p.lastLoginAt ?? null,
          lastLoginIp: p.lastLoginIp ?? null,
          lastLoginUserAgent: p.lastLoginUserAgent ?? null,
          createdAt: p.createdAt ?? null,
        });
      } catch {
        if (!cancelled) toast.error('Không tải được thông tin bảo mật.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const strength = useMemo(() => scorePassword(next), [next]);

  const mismatch = confirm.length > 0 && next !== confirm;
  const tooShort = next.length > 0 && next.length < MIN_PASSWORD;
  const canSubmit = current.length > 0 && next.length >= MIN_PASSWORD && next === confirm && !saving;

  const handleChangePassword = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      await authApi.changePassword({
        currentPassword: current,
        newPassword: next,
        confirmPassword: confirm,
      });
      toast.success('Đã đổi mật khẩu. Vui lòng đăng nhập lại.');
      // The server already cleared the auth cookie, so the client state is
      // stale the moment this resolves — clear it and send them to /login
      // rather than leaving a half-authenticated UI behind.
      await logout();
      router.replace('/login');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        'Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu hiện tại.';
      toast.error(msg);
      setSaving(false);
    }
  };

  const handleResendVerification = async () => {
    if (!info?.email) return;
    setResending(true);
    try {
      await authApi.resendVerification(info.email);
      toast.success('Đã gửi lại email xác thực. Kiểm tra hộp thư của bạn.');
    } catch {
      toast.error('Không gửi được email xác thực. Thử lại sau.');
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <Loader2 className="h-4 w-4 animate-spin" /> Đang tải…
      </div>
    );
  }

  // OAuth-only accounts have no password to change (the column is null).
  const isOAuthOnly = !!info?.provider && info.provider !== 'local';

  return (
    <SettingsPage
      title="Bảo mật"
      description="Mật khẩu, trạng thái xác thực email và lần đăng nhập gần nhất."
    >
      {/* ── Email verification ───────────────────────────────── */}
      <SettingsCard
        title="Xác thực email"
        icon={info?.emailVerified ? <MailCheck className="h-4 w-4" /> : <MailWarning className="h-4 w-4" />}
      >
        <SettingsRow
          label={info?.email || 'Chưa có email'}
          description={
            info?.emailVerified
              ? `Đã xác thực${info.emailVerifiedAt ? ` ngày ${formatDateTime(info.emailVerifiedAt)}` : ''}`
              : 'Email chưa được xác thực. Một số tính năng có thể bị hạn chế.'
          }
          control={
            info?.emailVerified ? (
              <StatusPill color="#10b981">Đã xác thực</StatusPill>
            ) : (
              <Button variant="secondary" onClick={handleResendVerification} loading={resending}>
                Gửi lại email
              </Button>
            )
          }
        />
      </SettingsCard>

      {/* ── Change password ──────────────────────────────────── */}
      <SettingsCard
        title="Đổi mật khẩu"
        description={
          isOAuthOnly
            ? `Tài khoản này đăng nhập qua ${info?.provider}. Không có mật khẩu để đổi.`
            : `Mật khẩu mới phải dài ít nhất ${MIN_PASSWORD} ký tự. Sau khi đổi, bạn sẽ bị đăng xuất và cần đăng nhập lại.`
        }
        icon={<KeyRound className="h-4 w-4" />}
      >
        {isOAuthOnly ? (
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Nếu muốn dùng mật khẩu, hãy đặt mật khẩu qua chức năng “Quên mật khẩu” ở trang đăng nhập.
          </p>
        ) : (
          <div className="grid max-w-lg gap-4">
            <Field label="Mật khẩu hiện tại">
              <TextInput
                type={show ? 'text' : 'password'}
                value={current}
                autoComplete="current-password"
                onChange={(e) => setCurrent(e.target.value)}
              />
            </Field>

            <Field
              label="Mật khẩu mới"
              error={tooShort ? `Cần ít nhất ${MIN_PASSWORD} ký tự` : null}
              hint={next.length === 0 ? `Tối thiểu ${MIN_PASSWORD} ký tự` : undefined}
            >
              <TextInput
                type={show ? 'text' : 'password'}
                value={next}
                autoComplete="new-password"
                onChange={(e) => setNext(e.target.value)}
              />
            </Field>

            {next.length > 0 && (
              <div className="-mt-2 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full" style={{ background: 'var(--bg-surface-active)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(strength.score / 5) * 100}%`, background: strength.color }}
                  />
                </div>
                <span className="text-[11px] font-medium" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}

            <Field label="Nhập lại mật khẩu mới" error={mismatch ? 'Hai mật khẩu không khớp' : null}>
              <TextInput
                type={show ? 'text' : 'password'}
                value={confirm}
                autoComplete="new-password"
                onChange={(e) => setConfirm(e.target.value)}
              />
            </Field>

            <div className="flex flex-wrap items-center gap-3">
              <Button onClick={handleChangePassword} disabled={!canSubmit} loading={saving}>
                <ShieldCheck className="h-4 w-4" /> Đổi mật khẩu
              </Button>
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                className="inline-flex items-center gap-1.5 text-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              </button>
            </div>
          </div>
        )}
      </SettingsCard>

      {/* ── Last sign-in ─────────────────────────────────────────
          LOCAL-DEV NOTE: on a dev machine these two fields show "node"
          and ::ffff:127.0.0.1. That is NOT a bug to chase — in dev the
          browser reaches the backend through the Next proxy at
          /api/v1/[[...path]], which does not forward User-Agent, and
          there is no nginx to set X-Forwarded-For.

          In PRODUCTION nginx routes /api/v1/ straight to the backend
          (nginx/nginx.conf: `location /api/v1/` → proxy_pass backend,
          with X-Real-IP and X-Forwarded-For set), so the real browser UA
          and the real client IP are what get recorded. Do not "fix" this
          by making the Next proxy forward X-Forwarded-For — the backend's
          trust-proxy chain is deliberately hardened against XFF spoofing
          (src/index.ts) after a past incident. */}
      <SettingsCard
        title="Lần đăng nhập gần nhất"
        description="Nếu bạn không nhận ra hoạt động này, hãy đổi mật khẩu ngay."
        icon={<Monitor className="h-4 w-4" />}
      >
        <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          <SettingsRow
            icon={<LogIn className="h-4 w-4" />}
            label="Thời gian"
            description={formatDateTime(info?.lastLoginAt ?? null)}
          />
          <SettingsRow
            icon={<Monitor className="h-4 w-4" />}
            label="Thiết bị"
            description={describeDevice(info?.lastLoginUserAgent ?? null)}
          />
          <SettingsRow
            icon={<Globe className="h-4 w-4" />}
            label="Địa chỉ IP"
            description={info?.lastLoginIp || 'Không ghi nhận'}
          />
        </div>
      </SettingsCard>
    </SettingsPage>
  );
}
