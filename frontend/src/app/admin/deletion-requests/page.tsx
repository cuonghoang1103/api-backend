'use client';

/**
 * /admin/deletion-requests — review queue for account erasure.
 *
 * Approving here is the ONLY path in the app that erases a live account
 * (POST /admin/deletion-requests/:id/approve → anonymizeAccount). It is
 * irreversible, so the UI makes the admin type the username to confirm —
 * a bare "are you sure?" is too easy to click through when the queue has
 * several rows that look alike.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  Loader2, ShieldAlert, Clock, CheckCircle2, XCircle, Undo2,
  RefreshCw, Mail, CalendarDays, AlertTriangle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  adminDeletionRequestsApi,
  type AdminDeletionRequest,
  type DeletionRequestStatus,
} from '@/lib/api';
import { cn } from '@/lib/utils';

const TABS: Array<{ key: DeletionRequestStatus | 'ALL'; label: string }> = [
  { key: 'PENDING', label: 'Chờ duyệt' },
  { key: 'APPROVED', label: 'Đã duyệt' },
  { key: 'REJECTED', label: 'Đã từ chối' },
  { key: 'CANCELLED', label: 'Người dùng huỷ' },
  { key: 'ALL', label: 'Tất cả' },
];

const STATUS_META: Record<DeletionRequestStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  PENDING: { label: 'Chờ duyệt', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30', icon: <Clock className="h-3 w-3" /> },
  APPROVED: { label: 'Đã xoá', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', icon: <CheckCircle2 className="h-3 w-3" /> },
  REJECTED: { label: 'Từ chối', cls: 'bg-rose-500/15 text-rose-400 border-rose-500/30', icon: <XCircle className="h-3 w-3" /> },
  CANCELLED: { label: 'Đã huỷ', cls: 'bg-slate-500/15 text-slate-400 border-slate-500/30', icon: <Undo2 className="h-3 w-3" /> },
};

function formatDateTime(value: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isFinite(d.getTime())
    ? d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' })
    : '—';
}

export default function AdminDeletionRequestsPage() {
  const [tab, setTab] = useState<DeletionRequestStatus | 'ALL'>('PENDING');
  const [rows, setRows] = useState<AdminDeletionRequest[]>([]);
  const [stats, setStats] = useState<{ pending: number; approved: number; rejected: number; cancelled: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const [openId, setOpenId] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [confirmName, setConfirmName] = useState('');
  const [acting, setActing] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        adminDeletionRequestsApi.list(tab === 'ALL' ? {} : { status: tab }),
        adminDeletionRequestsApi.stats(),
      ]);
      setRows(listRes.data?.data?.items ?? []);
      setStats(statsRes.data?.data ?? null);
    } catch {
      toast.error('Không tải được danh sách yêu cầu.');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { void load(); }, [load]);

  const closePanel = () => { setOpenId(null); setNote(''); setConfirmName(''); };

  const handleApprove = async (r: AdminDeletionRequest) => {
    const expected = r.usernameAtRequest || r.user?.username || '';
    if (confirmName.trim() !== expected) {
      toast.error(`Gõ chính xác "${expected}" để xác nhận.`);
      return;
    }
    setActing(r.id);
    try {
      await adminDeletionRequestsApi.approve(r.id, note.trim() || undefined);
      toast.success(`Đã xoá (ẩn danh hoá) tài khoản ${expected}.`);
      closePanel();
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Duyệt thất bại.');
    } finally {
      setActing(null);
    }
  };

  const handleReject = async (r: AdminDeletionRequest) => {
    setActing(r.id);
    try {
      await adminDeletionRequestsApi.reject(r.id, note.trim() || undefined);
      toast.success('Đã từ chối yêu cầu.');
      closePanel();
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Từ chối thất bại.');
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-500/15">
              <ShieldAlert className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Yêu cầu xoá tài khoản
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Duyệt là <b>không thể hoàn tác</b> — tài khoản sẽ bị ẩn danh hoá vĩnh viễn
              </p>
            </div>
          </div>
          <button
            onClick={() => void load()}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm"
            style={{ background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} /> Tải lại
          </button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([
              ['Chờ duyệt', stats.pending, '#f59e0b'],
              ['Đã xoá', stats.approved, '#10b981'],
              ['Từ chối', stats.rejected, '#f43f5e'],
              ['Đã huỷ', stats.cancelled, '#8a8d91'],
            ] as const).map(([label, value, color]) => (
              <div
                key={label}
                className="rounded-2xl border p-4"
                style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
              >
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                <p className="mt-1 text-2xl font-bold" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); closePanel(); }}
              className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium"
              style={{
                background: tab === t.key ? 'rgba(139,92,246,0.14)' : 'var(--bg-card)',
                color: tab === t.key ? '#8b5cf6' : 'var(--text-secondary)',
                border: `1px solid ${tab === t.key ? 'rgba(139,92,246,0.4)' : 'var(--border-color)'}`,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div
            className="flex items-center justify-center gap-2 rounded-2xl border py-16 text-sm"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
          >
            <Loader2 className="h-4 w-4 animate-spin" /> Đang tải…
          </div>
        ) : rows.length === 0 ? (
          <div
            className="rounded-2xl border py-16 text-center text-sm"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}
          >
            Không có yêu cầu nào ở mục này.
          </div>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => {
              const meta = STATUS_META[r.status];
              const name = r.usernameAtRequest || r.user?.username || `#${r.userId}`;
              const isOpen = openId === r.id;
              return (
                <li
                  key={r.id}
                  className="rounded-2xl border p-4"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {name}
                        </span>
                        <span className={cn('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold', meta.cls)}>
                          {meta.icon} {meta.label}
                        </span>
                        {r.user && !r.user.enabled && (
                          <span className="rounded-full border border-slate-500/30 bg-slate-500/15 px-2 py-0.5 text-[11px] text-slate-400">
                            Đã vô hiệu hoá
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {r.emailAtRequest || r.user?.email || '—'}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" /> Gửi {formatDateTime(r.createdAt)}
                        </span>
                        {r.user?.createdAt && <span>Tham gia {formatDateTime(r.user.createdAt)}</span>}
                      </div>

                      {r.reason && (
                        <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                          <b>Lý do:</b> {r.reason}
                        </p>
                      )}

                      {r.status !== 'PENDING' && (
                        <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                          Xử lý bởi {r.reviewedBy?.displayName || r.reviewedBy?.username || '—'} lúc{' '}
                          {formatDateTime(r.reviewedAt)}
                          {r.adminNote ? ` · Ghi chú: ${r.adminNote}` : ''}
                        </p>
                      )}
                    </div>

                    {r.status === 'PENDING' && !isOpen && (
                      <button
                        onClick={() => { setOpenId(r.id); setNote(''); setConfirmName(''); }}
                        className="shrink-0 rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-700"
                      >
                        Xử lý
                      </button>
                    )}
                  </div>

                  {/* Decision panel */}
                  {isOpen && r.status === 'PENDING' && (
                    <div className="mt-4 space-y-3 rounded-xl border p-4" style={{ borderColor: 'rgba(244,63,94,0.35)', background: 'rgba(244,63,94,0.05)' }}>
                      <div className="flex items-start gap-2 text-xs text-rose-400">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          Duyệt sẽ ẩn danh hoá vĩnh viễn tài khoản này: email/username bị đổi thành
                          <code className="mx-1">deleted_{r.userId}</code>, mật khẩu bị xoá, mọi phiên đăng nhập bị vô hiệu.
                          Không thể hoàn tác.
                        </span>
                      </div>

                      <label className="block">
                        <span className="mb-1 block text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Ghi chú cho người dùng (hiện ở trang cài đặt của họ khi bị từ chối)
                        </span>
                        <textarea
                          rows={2}
                          maxLength={500}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="VD: Tài khoản còn đơn hàng đang xử lý…"
                          className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Để DUYỆT, gõ chính xác tên đăng nhập: <b>{name}</b>
                        </span>
                        <input
                          value={confirmName}
                          onChange={(e) => setConfirmName(e.target.value)}
                          placeholder={name}
                          className="w-full max-w-xs rounded-lg border px-3 py-2 text-sm outline-none"
                          style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                        />
                      </label>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => void handleApprove(r)}
                          disabled={acting === r.id || confirmName.trim() !== name}
                          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {acting === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          Duyệt & xoá tài khoản
                        </button>
                        <button
                          onClick={() => void handleReject(r)}
                          disabled={acting === r.id}
                          className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-50"
                          style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                        >
                          <XCircle className="h-4 w-4" /> Từ chối
                        </button>
                        <button
                          onClick={closePanel}
                          className="rounded-xl px-4 py-2 text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
