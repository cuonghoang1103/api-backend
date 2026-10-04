'use client';

/**
 * Mảnh dùng chung của /admin/crm (CT Work đợt S5b). Giao diện kiểu công cụ của
 * khung admin (admin.css, token --a-*): viền mảnh, số thẳng cột, màu chỉ báo trạng thái.
 */
import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { DealStage, Money } from '@/lib/crm-api';

export const STAGE_LABEL: Record<DealStage, readonly [en: string, vi: string]> = {
  LEAD: ['Lead', 'Lead'],
  QUALIFIED: ['Qualified', 'Đã sàng lọc'],
  DISCOVERY: ['Discovery', 'Khám phá'],
  PROPOSAL: ['Proposal', 'Đề xuất'],
  NEGOTIATION: ['Negotiation', 'Đàm phán'],
  WON: ['Won', 'Thắng'],
  LOST: ['Lost', 'Thua'],
};

export const STAGE_TONE: Record<DealStage, string> = {
  LEAD: 'var(--a-text-3)',
  QUALIFIED: 'var(--a-blue)',
  DISCOVERY: 'var(--c-6)',
  PROPOSAL: 'var(--a-yellow)',
  NEGOTIATION: 'var(--a-orange)',
  WON: 'var(--a-green)',
  LOST: 'var(--a-red)',
};

export const PACKAGE_LABEL: Record<string, readonly [en: string, vi: string]> = {
  landing: ['Company website', 'Trang giới thiệu'],
  'ban-hang-dat-lich': ['Sales & booking', 'Bán hàng & đặt lịch'],
  lms: ['LMS / training', 'Học trực tuyến (LMS)'],
  'quan-ly-noi-bo': ['Internal tool', 'Quản lý nội bộ'],
  'quan-ly-du-an': ['Project management', 'Quản lý dự án'],
  'tro-ly-ai-rag': ['AI assistant (RAG)', 'Trợ lý AI (RAG)'],
  'app-di-dong': ['Mobile app', 'App di động'],
  'app-desktop': ['Desktop app', 'App desktop'],
  'tu-dong-hoa-api': ['Automation & API', 'Tự động hoá & API'],
};

export const ACTIVITY_LABEL: Record<string, readonly [en: string, vi: string]> = {
  CALL: ['Call', 'Gọi'], EMAIL: ['Email', 'Email'], MEETING: ['Meeting', 'Họp'], NOTE: ['Note', 'Ghi chú'], TASK: ['Task', 'Việc cần làm'],
};

export const CHANNEL_LABEL: Record<string, readonly [en: string, vi: string]> = {
  EMAIL: ['Email', 'Email'], PHONE: ['Phone', 'Điện thoại'], ZALO: ['Zalo', 'Zalo'], MEETING: ['In person', 'Gặp trực tiếp'], OTHER: ['Other', 'Khác'],
};

export function fmtMoney(v: number | null | undefined, currency = 'VND', compact = false): string {
  if (v === null || v === undefined) return '—';
  try {
    return new Intl.NumberFormat(currency === 'VND' ? 'vi-VN' : 'en-US', {
      style: 'currency', currency, maximumFractionDigits: currency === 'VND' ? 0 : 2,
      ...(compact ? { notation: 'compact', maximumFractionDigits: 1 } : {}),
    }).format(v);
  } catch {
    return `${v.toLocaleString('vi-VN')} ${currency}`;
  }
}

/** Nhiều tiền tệ ⇒ nối bằng " · " (không tự quy đổi). Rỗng ⇒ "—". */
export function fmtMoneyMap(m: Money | undefined, compact = true): string {
  const e = Object.entries(m ?? {}).filter(([, v]) => v);
  return e.length ? e.map(([c, v]) => fmtMoney(v, c, compact)).join(' · ') : '—';
}

export function fmtDate(iso: string | null | undefined, withTime = false): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return '—';
  return withTime
    ? d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function errMsg(err: unknown, fallback: string): { message: string; code?: string } {
  const data = (err as { response?: { data?: { message?: string; code?: string; error?: { code?: string } } } })?.response?.data;
  return { message: data?.message || fallback, code: data?.code ?? data?.error?.code };
}

export const inputCls =
  'h-8 w-full rounded-[7px] border border-[var(--a-border)] bg-[var(--a-raised)] px-2.5 text-[13px] text-[var(--a-text)] placeholder:text-[var(--a-text-3)] outline-none focus:border-[var(--a-accent-border)]';
export const areaCls =
  'w-full rounded-[7px] border border-[var(--a-border)] bg-[var(--a-raised)] px-2.5 py-2 text-[13px] leading-5 text-[var(--a-text)] placeholder:text-[var(--a-text-3)] outline-none focus:border-[var(--a-accent-border)]';
export const btn =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-[7px] border border-[var(--a-border)] bg-[var(--a-raised)] px-3 text-[12.5px] font-medium text-[var(--a-text-2)] hover:border-[var(--a-border-strong)] hover:text-[var(--a-text)] disabled:opacity-50 disabled:pointer-events-none';
export const btnPrimary =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-[7px] bg-[var(--a-accent)] px-3 text-[12.5px] font-semibold text-white hover:bg-[var(--a-accent-hover)] disabled:opacity-50 disabled:pointer-events-none';
export const btnDanger =
  'inline-flex h-8 items-center justify-center gap-1.5 rounded-[7px] border border-[color:var(--a-red)] px-3 text-[12.5px] font-medium text-[color:var(--a-red)] hover:bg-[rgba(255,69,58,0.1)] disabled:opacity-50 disabled:pointer-events-none';

export function Label({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <span className="mb-1 flex items-baseline justify-between gap-2 text-[11.5px] font-medium text-[var(--a-text-3)]">
      <span>{children}</span>
      {hint && <span className="font-normal">{hint}</span>}
    </span>
  );
}

export function StageDot({ stage, label }: { stage: DealStage; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--a-text-2)]">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: STAGE_TONE[stage] }} />
      {label}
    </span>
  );
}

export function Chip({ children, tone }: { children: ReactNode; tone?: string }) {
  return (
    <span
      className="inline-flex h-[18px] items-center rounded-[5px] border px-1.5 text-[10.5px] font-semibold uppercase tracking-[0.02em]"
      style={{ borderColor: tone ?? 'var(--a-border-strong)', color: tone ?? 'var(--a-text-2)' }}
    >
      {children}
    </span>
  );
}

/** Ngăn kéo bên phải (toàn màn hình ở điện thoại). Esc để đóng. */
export function Drawer({ open, onClose, title, children, width = 'max-w-[760px]' }: {
  open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; width?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true">
      <button aria-label="Close" className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className={`relative flex h-full w-full ${width} flex-col border-l border-[var(--a-border)] bg-[var(--a-panel)] shadow-2xl`}>
        <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-[var(--a-border)] px-4">
          <div className="min-w-0 truncate text-[14px] font-semibold text-[var(--a-text)]">{title}</div>
          <button onClick={onClose} className="rounded-md p-1.5 text-[var(--a-text-3)] hover:bg-[var(--a-hover)] hover:text-[var(--a-text)]" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/** Hộp thoại nhỏ giữa màn hình. */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: ReactNode; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button aria-label="Close" className="absolute inset-0 bg-black/55" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-[520px] overflow-y-auto rounded-[12px] border border-[var(--a-border)] bg-[var(--a-panel)] p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="text-[14px] font-semibold text-[var(--a-text)]">{title}</h3>
          <button onClick={onClose} className="rounded-md p-1 text-[var(--a-text-3)] hover:bg-[var(--a-hover)]" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Bảng có khung cuộn ngang riêng — trang không bao giờ cuộn ngang ở 390px. */
export function TableWrap({ children }: { children: ReactNode }) {
  return <div className="-mx-1 overflow-x-auto px-1">{children}</div>;
}
export const thCls = 'h-8 whitespace-nowrap border-b border-[var(--a-border)] px-2 text-left text-[11.5px] font-medium text-[var(--a-text-3)]';
export const tdCls = 'h-10 border-b border-[var(--a-border)] px-2 text-[12.5px] text-[var(--a-text-2)]';
