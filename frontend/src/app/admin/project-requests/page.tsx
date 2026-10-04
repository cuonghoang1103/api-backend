'use client';

/**
 * /admin/project-requests — phiếu yêu cầu dự án từ khách (/about/quy-trinh).
 *
 * Luồng: NEW → QUALIFYING → ACCEPTED | DECLINED → (nút) PROJECT_CREATED.
 * Nút "Tạo dự án CT Work" dựng một dự án từ mẫu quy trình
 * (content/quy-trinh/client-project-template.json): mỗi giai đoạn một epic,
 * việc gắn nhãn `vai:<key>`, việc cổng chất lượng, kèm link chia sẻ cho khách.
 * Bấm lại không tạo trùng — server trả lại dự án cũ.
 *
 * "Tạo phiếu nhập vai" sinh một khách hàng GIẢ LẬP (rõ nhãn NHẬP VAI) để tự
 * luyện lần lượt các vai trên dự án CT Work.
 *
 * Mở thẳng một phiếu: /admin/project-requests?id=12 (link trong hộp thư admin).
 * Đọc `?id=` bằng window.location trong effect — không dùng useSearchParams
 * để khỏi phải bọc Suspense cả trang.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  ClipboardList, Loader2, RefreshCw, Drama, ExternalLink, Link2, Copy, Mail, Phone,
  Building2, CalendarDays, ShieldCheck, FolderKanban, Save, Search, X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  adminProjectRequestApi,
  type ProjectRequestDetail,
  type ProjectRequestListItem,
  type ProjectRequestStatus,
} from '@/lib/api';
import { cn } from '@/lib/utils';

type Tab = ProjectRequestStatus | 'ALL';
type ManualStatus = Exclude<ProjectRequestStatus, 'PROJECT_CREATED'>;

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'NEW', label: 'Mới' },
  { key: 'QUALIFYING', label: 'Đang đánh giá' },
  { key: 'ACCEPTED', label: 'Đã nhận' },
  { key: 'DECLINED', label: 'Từ chối' },
  { key: 'PROJECT_CREATED', label: 'Đã tạo dự án' },
];

const STATUS_META: Record<ProjectRequestStatus, { label: string; cls: string }> = {
  NEW: { label: 'Mới', cls: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
  QUALIFYING: { label: 'Đang đánh giá', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  ACCEPTED: { label: 'Đã nhận', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  DECLINED: { label: 'Từ chối', cls: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  PROJECT_CREATED: { label: 'Đã tạo dự án', cls: 'bg-violet-500/15 text-violet-400 border-violet-500/30' },
};

const MANUAL: ManualStatus[] = ['NEW', 'QUALIFYING', 'ACCEPTED', 'DECLINED'];

const SECURITY_LABEL: Record<string, string> = {
  NORMAL: 'Thông thường',
  PERSONAL_DATA: 'Có dữ liệu cá nhân',
  SENSITIVE: 'Dữ liệu cá nhân nhạy cảm (Luật BVDLCN 91/2025/QH15 + NĐ 356/2025/NĐ-CP)',
};

function fmt(value: string | null | undefined): string {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? d.toLocaleString('vi-VN', { dateStyle: 'medium', timeStyle: 'short' }) : '—';
}

function errMsg(err: unknown, fallback: string): string {
  const m = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
  return m || fallback;
}

const card = { background: 'var(--bg-card)', borderColor: 'var(--border-color)' } as const;
const inputStyle = { background: 'var(--bg-surface)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' } as const;

function StatusBadge({ status }: { status: ProjectRequestStatus }) {
  const m = STATUS_META[status];
  return <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold', m.cls)}>{m.label}</span>;
}

function RoleplayBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 text-[11px] font-bold text-amber-400">
      <Drama className="h-3 w-3" /> NHẬP VAI
    </span>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="mt-0.5 whitespace-pre-wrap break-words text-sm" style={{ color: 'var(--text-primary)' }}>{value}</p>
    </div>
  );
}

export default function AdminProjectRequestsPage() {
  const [tab, setTab] = useState<Tab>('ALL');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [rows, setRows] = useState<ProjectRequestListItem[]>([]);
  const [counts, setCounts] = useState<Partial<Record<ProjectRequestStatus, number>>>({});
  const [loading, setLoading] = useState(false);

  const [openId, setOpenId] = useState<number | null>(null);
  const [detail, setDetail] = useState<ProjectRequestDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [note, setNote] = useState('');
  const [clientNote, setClientNote] = useState('');
  const [busy, setBusy] = useState<'status' | 'note' | 'clientNote' | 'project' | 'roleplay' | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminProjectRequestApi.list({ ...(tab === 'ALL' ? {} : { status: tab }), ...(query ? { q: query } : {}), limit: 100 });
      setRows(res.data?.data?.items ?? []);
      setCounts(res.data?.data?.counts ?? {});
    } catch (err) {
      toast.error(errMsg(err, 'Không tải được danh sách phiếu.'));
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [tab, query]);

  useEffect(() => { void load(); }, [load]);

  // Mở thẳng phiếu từ hộp thư admin: ?id=12
  useEffect(() => {
    const id = Number(new URLSearchParams(window.location.search).get('id'));
    if (Number.isInteger(id) && id > 0) setOpenId(id);
  }, []);

  const loadDetail = useCallback(async (id: number) => {
    setDetailLoading(true);
    try {
      const res = await adminProjectRequestApi.get(id);
      setDetail(res.data.data);
      setNote(res.data.data.internalNote ?? '');
      setClientNote(res.data.data.clientNote ?? '');
    } catch (err) {
      toast.error(errMsg(err, 'Không tải được phiếu.'));
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    if (openId) void loadDetail(openId);
    else setDetail(null);
  }, [openId, loadDetail]);

  const applyDetail = (d: ProjectRequestDetail) => {
    setDetail(d);
    setRows((prev) => prev.map((r) => (r.id === d.id ? { ...r, status: d.status, workProjectId: d.workProjectId, statusChangedAt: d.statusChangedAt } : r)));
  };

  const changeStatus = async (status: ManualStatus) => {
    if (!detail || detail.status === status) return;
    setBusy('status');
    try {
      const res = await adminProjectRequestApi.update(detail.id, { status });
      applyDetail(res.data.data);
      toast.success(`Đã chuyển sang "${STATUS_META[status].label}".`);
      void load();
    } catch (err) {
      toast.error(errMsg(err, 'Đổi trạng thái thất bại.'));
    } finally {
      setBusy(null);
    }
  };

  const saveNote = async () => {
    if (!detail) return;
    setBusy('note');
    try {
      const res = await adminProjectRequestApi.update(detail.id, { internalNote: note.trim() || null });
      applyDetail(res.data.data);
      toast.success('Đã lưu ghi chú nội bộ.');
    } catch (err) {
      toast.error(errMsg(err, 'Lưu ghi chú thất bại.'));
    } finally {
      setBusy(null);
    }
  };

  const saveClientNote = async () => {
    if (!detail) return;
    setBusy('clientNote');
    try {
      const res = await adminProjectRequestApi.update(detail.id, { clientNote: clientNote.trim() || null });
      applyDetail(res.data.data);
      toast.success('Đã lưu lời nhắn — khách thấy ngay ở trang tra cứu.');
    } catch (err) {
      toast.error(errMsg(err, 'Lưu lời nhắn thất bại.'));
    } finally {
      setBusy(null);
    }
  };

  const createProject = async () => {
    if (!detail) return;
    setBusy('project');
    try {
      const res = await adminProjectRequestApi.createWorkProject(detail.id);
      const r = res.data.data;
      if (r.alreadyExisted) {
        toast.success(`Dự án ${r.key} đã có từ trước — mở lại.`);
      } else {
        toast.success(`Đã tạo dự án ${r.key}: ${r.counts.epics} giai đoạn, ${r.counts.tasks} việc (${r.counts.gates} cổng chất lượng).`);
        if (r.templateSource === 'minimal') toast('Chưa có file mẫu quy trình — đã dùng bản tối thiểu 3 giai đoạn.', { icon: '⚠️' });
      }
      window.open(r.url, '_blank', 'noopener');
      await loadDetail(detail.id);
      void load();
    } catch (err) {
      toast.error(errMsg(err, 'Tạo dự án CT Work thất bại.'));
    } finally {
      setBusy(null);
    }
  };

  const createRoleplay = async () => {
    setBusy('roleplay');
    try {
      const res = await adminProjectRequestApi.createRoleplay();
      toast.success(`Đã tạo phiếu nhập vai ${res.data.data.code}.`);
      setTab('ALL');
      setOpenId(res.data.data.id);
      void load();
    } catch (err) {
      toast.error(errMsg(err, 'Tạo phiếu nhập vai thất bại.'));
    } finally {
      setBusy(null);
    }
  };

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); toast.success('Đã chép link.'); } catch { toast.error('Không chép được.'); }
  };

  const total = Object.values(counts).reduce((a, b) => a + (b ?? 0), 0);

  return (
    <div className="min-h-screen p-4 sm:p-6" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15">
              <ClipboardList className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Phiếu yêu cầu dự án</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Duyệt phiếu → <b>Đã nhận</b> → một nút tạo dự án CT Work theo quy trình
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => void createRoleplay()}
              disabled={busy === 'roleplay'}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-500 disabled:opacity-50"
            >
              {busy === 'roleplay' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Drama className="h-4 w-4" />}
              Tạo phiếu nhập vai
            </button>
            <button
              onClick={() => void load()}
              className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
              style={{ ...card, color: 'var(--text-secondary)' }}
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} /> Tải lại
            </button>
          </div>
        </div>

        {/* Tabs + search */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
            {TABS.map((t) => {
              const n = t.key === 'ALL' ? total : counts[t.key] ?? 0;
              const on = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium"
                  style={{
                    background: on ? 'rgba(139,92,246,0.14)' : 'var(--bg-card)',
                    color: on ? '#8b5cf6' : 'var(--text-secondary)',
                    border: `1px solid ${on ? 'rgba(139,92,246,0.4)' : 'var(--border-color)'}`,
                  }}
                >
                  {t.label} <span className="opacity-70">{n}</span>
                </button>
              );
            })}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setQuery(q.trim()); }}
            className="flex w-full items-center gap-2 rounded-xl border px-3 py-1.5 sm:w-64"
            style={card}
          >
            <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Mã, tên, email, tổ chức…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            {query && (
              <button type="button" onClick={() => { setQ(''); setQuery(''); }} aria-label="Xoá tìm kiếm">
                <X className="h-4 w-4" style={{ color: 'var(--text-muted)' }} />
              </button>
            )}
          </form>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          {/* Danh sách */}
          <div className="min-w-0">
            {loading ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl border py-16 text-sm" style={{ ...card, color: 'var(--text-secondary)' }}>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang tải…
              </div>
            ) : rows.length === 0 ? (
              <div className="rounded-2xl border py-16 text-center text-sm" style={{ ...card, color: 'var(--text-muted)' }}>
                Chưa có phiếu nào ở mục này.
              </div>
            ) : (
              <ul className="space-y-2">
                {rows.map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => setOpenId(r.id)}
                      className="w-full rounded-2xl border p-3 text-left transition-colors"
                      style={{
                        ...card,
                        borderColor: openId === r.id ? 'rgba(139,92,246,0.55)' : 'var(--border-color)',
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>{r.code}</span>
                        <StatusBadge status={r.status} />
                        {r.isRoleplay && <RoleplayBadge />}
                      </div>
                      <p className="mt-1 truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {r.organization || r.name}
                      </p>
                      <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        <span className="truncate">{r.name} · {r.email}</span>
                        <span>{r.productTypes.join(', ')}</span>
                        <span>{fmt(r.createdAt)}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Chi tiết */}
          <div className="min-w-0">
            {!openId ? (
              <div className="rounded-2xl border py-16 text-center text-sm" style={{ ...card, color: 'var(--text-muted)' }}>
                Chọn một phiếu để xem chi tiết.
              </div>
            ) : detailLoading && !detail ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl border py-16 text-sm" style={{ ...card, color: 'var(--text-secondary)' }}>
                <Loader2 className="h-4 w-4 animate-spin" /> Đang tải phiếu…
              </div>
            ) : detail ? (
              <div className="space-y-4 rounded-2xl border p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto" style={card}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{detail.code}</span>
                      <StatusBadge status={detail.status} />
                      {detail.isRoleplay && <RoleplayBadge />}
                    </div>
                    <h2 className="mt-1 break-words text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {detail.organization || detail.name}
                    </h2>
                  </div>
                  <button onClick={() => setOpenId(null)} aria-label="Đóng" className="rounded-lg p-1" style={{ color: 'var(--text-muted)' }}>
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {detail.isRoleplay && (
                  <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-500">
                    Phiếu NHẬP VAI — khách hàng giả lập để tự luyện quy trình, không phải khách thật.
                  </p>
                )}

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {detail.email}</span>
                  {detail.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {detail.phone}</span>}
                  {detail.senderRole && <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> {detail.senderRole}</span>}
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Gửi {fmt(detail.createdAt)}</span>
                </div>

                {/* Deal CRM (đợt S5b) — liên kết ngược: phiếu ⇒ deal ở /admin/crm */}
                {(() => {
                  const deal = (detail as ProjectRequestDetail & { crmDeal?: { id: number; stage: string } | null }).crmDeal;
                  return deal ? (
                    <a href={`/admin/crm?deal=${deal.id}`} className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline" style={{ color: 'var(--text-secondary)' }}>
                      <Link2 className="h-3.5 w-3.5" /> Deal CRM #{deal.id} · {deal.stage}
                    </a>
                  ) : null;
                })()}

                {/* Dự án CT Work */}
                <div className="rounded-xl border p-3" style={{ borderColor: 'rgba(139,92,246,0.35)', background: 'rgba(139,92,246,0.05)' }}>
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    <FolderKanban className="h-4 w-4 text-violet-400" /> Dự án CT Work
                  </p>
                  {detail.workProject && !detail.workProject.deleted && detail.workProject.url ? (
                    <div className="space-y-2 text-sm">
                      <a href={detail.workProject.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-violet-400 hover:underline">
                        Mở dự án {detail.workProject.key} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      {detail.workProject.shareUrl && (
                        <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                          <Link2 className="h-3.5 w-3.5" /> Link cho khách theo dõi (chỉ đọc):
                          <button onClick={() => void copy(detail.workProject!.shareUrl!)} className="inline-flex items-center gap-1 rounded-lg border px-2 py-0.5" style={inputStyle}>
                            <Copy className="h-3 w-3" /> Chép link
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {detail.workProject?.deleted && (
                        <p className="mb-2 text-xs text-rose-400">Dự án cũ (#{detail.workProject.projectId}) đã bị xoá.</p>
                      )}
                      <button
                        onClick={() => void createProject()}
                        disabled={busy === 'project' || (detail.status !== 'ACCEPTED' && detail.status !== 'PROJECT_CREATED')}
                        className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {busy === 'project' ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderKanban className="h-4 w-4" />}
                        Tạo dự án CT Work
                      </button>
                      {detail.status !== 'ACCEPTED' && detail.status !== 'PROJECT_CREATED' && (
                        <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>Chuyển phiếu sang &quot;Đã nhận&quot; trước khi tạo dự án.</p>
                      )}
                    </>
                  )}
                </div>

                {/* Trạng thái */}
                {detail.status !== 'PROJECT_CREATED' && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>Trạng thái</p>
                    <div className="flex flex-wrap gap-2">
                      {MANUAL.map((s) => (
                        <button
                          key={s}
                          onClick={() => void changeStatus(s)}
                          disabled={busy === 'status'}
                          className={cn(
                            'rounded-full border px-3 py-1 text-xs font-medium disabled:opacity-50',
                            detail.status === s ? STATUS_META[s].cls : '',
                          )}
                          style={detail.status === s ? undefined : { ...inputStyle, color: 'var(--text-secondary)' }}
                        >
                          {STATUS_META[s].label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Nội dung phiếu */}
                <div className="space-y-3">
                  <Field label="Loại sản phẩm" value={detail.productTypes.join(', ')} />
                  <Field label="Mô tả nhu cầu" value={detail.needs} />
                  <Field label="Mục tiêu kinh doanh" value={detail.businessGoals} />
                  <Field label="Người dùng cuối" value={detail.endUsers} />
                  <Field label="Hệ thống hiện có" value={detail.existingSystems} />
                  <Field label="Ngân sách dự kiến" value={detail.budgetRange} />
                  <Field label="Thời hạn mong muốn" value={detail.desiredDeadline} />
                  <Field label="Mức bảo mật dữ liệu" value={SECURITY_LABEL[detail.securityLevel] ?? detail.securityLevel} />
                  <Field label="Ghi chú bảo mật" value={detail.securityNote} />
                </div>

                <div className="flex items-start gap-2 rounded-xl border p-3 text-xs" style={{ ...inputStyle, color: 'var(--text-secondary)' }}>
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <span>
                    Đồng ý xử lý dữ liệu lúc {fmt(detail.consentAt)} · thông báo phiên bản {detail.consentVersion ?? '—'}
                    {detail.source ? ` · nguồn: ${detail.source}` : ''}
                    {detail.ip ? ` · IP ${detail.ip}` : ''}
                  </span>
                </div>

                {/* Ghi chú nội bộ */}
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    Ghi chú nội bộ (khách không thấy)
                  </span>
                  <textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Kết quả gọi tìm hiểu, đánh giá go/no-go, câu hỏi cần làm rõ…"
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    style={inputStyle}
                  />
                </label>
                <button
                  onClick={() => void saveNote()}
                  disabled={busy === 'note' || note === (detail.internalNote ?? '')}
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium disabled:opacity-40"
                  style={{ ...inputStyle }}
                >
                  {busy === 'note' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu ghi chú
                </button>

                {/* Lời nhắn cho khách — CÔNG KHAI ở /about/nhan-du-an/tra-cuu (khách nhập mã + email) */}
                <label className="block">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    Lời nhắn cho khách (KHÁCH THẤY ở trang tra cứu phiếu)
                  </span>
                  <textarea
                    rows={3}
                    maxLength={5000}
                    value={clientNote}
                    onChange={(e) => setClientNote(e.target.value)}
                    placeholder="Vd: Đã nhận phiếu, sẽ gọi trao đổi trong tuần này. Đừng ghi đánh giá nội bộ ở đây."
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    style={inputStyle}
                  />
                </label>
                <button
                  onClick={() => void saveClientNote()}
                  disabled={busy === 'clientNote' || clientNote === (detail.clientNote ?? '')}
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium disabled:opacity-40"
                  style={{ ...inputStyle }}
                >
                  {busy === 'clientNote' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu lời nhắn cho khách
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border py-16 text-center text-sm" style={{ ...card, color: 'var(--text-muted)' }}>
                Không tìm thấy phiếu.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
