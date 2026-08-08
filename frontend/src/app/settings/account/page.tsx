'use client';

/**
 * /settings/account — account facts, data export, and account erasure.
 *
 * Erasure changed on 2026-08-08: it is now a REQUEST that an admin must
 * approve, not an instant self-service wipe. `anonymizeAccount()` is
 * irreversible (it nulls the password, rotates the email/username and
 * bumps roleVersion to kill every session), so a misclick or a hijacked
 * session used to be able to destroy an account with no way back.
 *
 * Export is untouched and still instant — the right to a copy of your data
 * doesn't need anyone's permission.
 */

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Download, Trash2, Loader2, ShieldAlert, Database, Crown, Mail,
  CalendarDays, AtSign, Clock, CheckCircle2, XCircle, Undo2, KeyRound,
} from 'lucide-react';
import { authApi, type AccountDeletionRequest } from '@/lib/api';
import {
  SettingsPage, SettingsCard, SettingsRow, TextArea, TextInput,
  Button, StatusPill,
} from '@/components/settings/primitives';

interface AccountInfo {
  username: string;
  email: string;
  fullName: string | null;
  isPro: boolean;
  proLifetime: boolean;
  proExpiresAt: string | null;
  provider: string | null;
  emailVerified: boolean;
  createdAt: string | null;
  role: string | null;
}

function formatDate(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isFinite(d.getTime())
    ? d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';
}

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isFinite(d.getTime())
    ? d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';
}

const STATUS_META: Record<
  AccountDeletionRequest['status'],
  { label: string; color: string; icon: React.ReactNode }
> = {
  PENDING: { label: 'Đang chờ duyệt', color: '#f59e0b', icon: <Clock className="h-3 w-3" /> },
  APPROVED: { label: 'Đã duyệt — tài khoản đã xoá', color: '#10b981', icon: <CheckCircle2 className="h-3 w-3" /> },
  REJECTED: { label: 'Đã từ chối', color: '#f43f5e', icon: <XCircle className="h-3 w-3" /> },
  CANCELLED: { label: 'Bạn đã huỷ yêu cầu', color: '#8a8d91', icon: <Undo2 className="h-3 w-3" /> },
};

export default function AccountDataPage() {
  const [info, setInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [request, setRequest] = useState<AccountDeletionRequest | null>(null);
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const loadRequest = useCallback(async () => {
    try {
      const res = await authApi.getDeletionRequest();
      setRequest(res.data?.data?.request ?? null);
    } catch {
      setRequest(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [profileRes] = await Promise.all([authApi.getProfile(), loadRequest()]);
        const p = ((profileRes.data as any)?.data ?? {}) as Record<string, any>;
        if (cancelled) return;
        setInfo({
          username: p.username ?? '',
          email: p.email ?? '',
          fullName: p.fullName ?? null,
          isPro: !!p.isPro,
          proLifetime: !!p.proLifetime,
          proExpiresAt: p.proExpiresAt ?? null,
          provider: p.provider ?? null,
          emailVerified: !!p.emailVerified,
          createdAt: p.createdAt ?? null,
          role: p.role ?? null,
        });
      } catch {
        if (!cancelled) toast.error('Không tải được thông tin tài khoản.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [loadRequest]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await authApi.exportData();
      const data = (res.data as { data?: unknown })?.data ?? res.data;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cuongthai-du-lieu-cua-toi-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Đã tải bản sao dữ liệu của bạn.');
    } catch {
      toast.error('Không tải được dữ liệu. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (confirmText.trim().toUpperCase() !== 'XOA') return;
    setSubmitting(true);
    try {
      const res = await authApi.requestDeletion(reason.trim() || undefined);
      setRequest(res.data?.data?.request ?? null);
      setConfirmText('');
      setReason('');
      toast.success('Đã gửi yêu cầu xoá tài khoản. Quản trị viên sẽ xem xét.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async () => {
    setCancelling(true);
    try {
      const res = await authApi.cancelDeletionRequest();
      setRequest(res.data?.data?.request ?? null);
      toast.success('Đã huỷ yêu cầu xoá tài khoản.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Huỷ yêu cầu thất bại.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-sm" style={{ color: 'var(--text-secondary)' }}>
        <Loader2 className="h-4 w-4 animate-spin" /> Đang tải…
      </div>
    );
  }

  const pending = request?.status === 'PENDING';

  return (
    <SettingsPage
      title="Tài khoản & Dữ liệu"
      description={
        'Thông tin tài khoản và quyền của bạn theo Nghị định 13/2023/NĐ-CP.'
      }
    >
      {/* ── Account facts ────────────────────────────────────── */}
      <SettingsCard title="Thông tin tài khoản" icon={<Database className="h-4 w-4" />}>
        <div className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
          <SettingsRow
            icon={<AtSign className="h-4 w-4" />}
            label="Tên đăng nhập"
            description={info?.username || '—'}
          />
          <SettingsRow
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            description={info?.email || '—'}
            control={
              info?.emailVerified
                ? <StatusPill color="#10b981">Đã xác thực</StatusPill>
                : <StatusPill color="#f59e0b">Chưa xác thực</StatusPill>
            }
          />
          <SettingsRow
            icon={<KeyRound className="h-4 w-4" />}
            label="Phương thức đăng nhập"
            description={
              info?.provider && info.provider !== 'local'
                ? `Đăng nhập qua ${info.provider}`
                : 'Tên đăng nhập và mật khẩu'
            }
          />
          <SettingsRow
            icon={<Crown className="h-4 w-4" />}
            label="Gói thành viên"
            description={
              info?.isPro
                ? info.proLifetime
                  ? 'PRO — trọn đời'
                  : `PRO — đến ${formatDate(info.proExpiresAt)}`
                : 'Miễn phí'
            }
            control={info?.isPro ? <StatusPill color="#fbbf24">PRO</StatusPill> : undefined}
          />
          <SettingsRow
            icon={<CalendarDays className="h-4 w-4" />}
            label="Ngày tham gia"
            description={formatDate(info?.createdAt ?? null)}
          />
        </div>
      </SettingsCard>

      {/* ── Export ───────────────────────────────────────────── */}
      <SettingsCard
        title="Tải dữ liệu của tôi"
        description="Tải về bản sao (JSON) thông tin cá nhân và đơn hàng của bạn. Không cần ai duyệt."
        icon={<Download className="h-4 w-4" />}
      >
        <Button onClick={handleExport} loading={exporting}>
          <Download className="h-4 w-4" /> Tải xuống (.json)
        </Button>
      </SettingsCard>

      {/* ── Current request status ───────────────────────────── */}
      {request && request.status !== 'CANCELLED' && (
        <SettingsCard
          title="Yêu cầu xoá tài khoản"
          icon={STATUS_META[request.status].icon}
          tone={pending ? 'default' : 'default'}
        >
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill color={STATUS_META[request.status].color}>
                {STATUS_META[request.status].icon}
                {STATUS_META[request.status].label}
              </StatusPill>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Gửi lúc {formatDateTime(request.createdAt)}
              </span>
            </div>

            {request.reason && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <b>Lý do bạn ghi:</b> {request.reason}
              </p>
            )}

            {request.status === 'REJECTED' && (
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                <b>Phản hồi của quản trị viên:</b>{' '}
                {request.adminNote || 'Không có ghi chú.'}{' '}
                <span style={{ color: 'var(--text-muted)' }}>
                  ({formatDateTime(request.reviewedAt)})
                </span>
              </p>
            )}

            {pending && (
              <>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Tài khoản của bạn <b>vẫn hoạt động bình thường</b> trong lúc chờ.
                  Bạn có thể huỷ yêu cầu bất cứ lúc nào trước khi được duyệt.
                </p>
                <Button variant="secondary" onClick={handleCancelRequest} loading={cancelling}>
                  <Undo2 className="h-4 w-4" /> Huỷ yêu cầu xoá
                </Button>
              </>
            )}
          </div>
        </SettingsCard>
      )}

      {/* ── Request deletion ─────────────────────────────────── */}
      {!pending && request?.status !== 'APPROVED' && (
        <SettingsCard
          title="Yêu cầu xoá tài khoản"
          icon={<ShieldAlert className="h-4 w-4" />}
          tone="danger"
        >
          <div className="space-y-4">
            <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <p>
                Việc xoá tài khoản <b>cần quản trị viên duyệt</b>. Sau khi bạn gửi yêu cầu,
                tài khoản vẫn hoạt động bình thường cho tới khi được duyệt — và bạn có thể huỷ yêu cầu bất cứ lúc nào.
              </p>
              <p>
                Khi được duyệt, thao tác này <b>không thể hoàn tác</b>: thông tin cá nhân của bạn
                (tên, email, số điện thoại, địa chỉ, ảnh) sẽ được <b>ẩn danh hoá</b> và tài khoản bị vô hiệu hoá.
                Bản ghi đơn hàng được giữ ở dạng ẩn danh cho mục đích kế toán/pháp lý.
              </p>
              <p style={{ color: 'var(--text-muted)' }}>
                Gợi ý: hãy bấm <b>Tải xuống (.json)</b> ở trên trước khi gửi yêu cầu — sau khi xoá bạn sẽ không lấy lại được dữ liệu.
              </p>
            </div>

            <div className="max-w-lg space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  Lý do (không bắt buộc — giúp quản trị viên xử lý nhanh hơn)
                </span>
                <TextArea
                  rows={3}
                  maxLength={500}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="VD: Tôi không dùng dịch vụ nữa…"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs" style={{ color: 'var(--text-muted)' }}>
                  Gõ <b>XOA</b> để xác nhận
                </span>
                <TextInput
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="XOA"
                  className="max-w-[200px]"
                />
              </label>

              <Button
                variant="danger"
                onClick={handleSubmitRequest}
                disabled={confirmText.trim().toUpperCase() !== 'XOA'}
                loading={submitting}
              >
                <Trash2 className="h-4 w-4" /> Gửi yêu cầu xoá tài khoản
              </Button>
            </div>
          </div>
        </SettingsCard>
      )}
    </SettingsPage>
  );
}
