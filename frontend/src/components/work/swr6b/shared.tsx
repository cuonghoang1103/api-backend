'use client';

/**
 * CTW đợt 6b — mảnh dùng chung của các tab SRS chuyên sâu + elicitation & stakeholder (trang Wiegers): làm mới cả cụm,
 * tải tệp, thanh chọn phân đoạn, ô thông báo nhỏ. Bảng + chip dùng lại từ srs/shared (token AA `--w-*-text`).
 */

import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { saveBlob } from '@/lib/work-docs3a-api';
import { workSwr6bKeys } from '@/lib/work-swr6b-api';
import { workSwrKeys } from '@/lib/work-swr-api';
import { workCtw4Keys } from '@/lib/work-ctw4-api';
import { wt } from '@/components/work/i18n';

export { Chip, Clip, TableFrame, TD, TextArea, TH } from '../srs/shared';
export { TabIntro, LifecycleChip, TYPE_KEY, P3_KEY } from '../swr/shared';

/** Stakeholder ⇒ phiên ⇒ yêu cầu ⇒ sáu liên kết/RTM phụ thuộc lẫn nhau ⇒ làm mới cả cụm Wiegers + Requirements. */
export function use6bRefresh(pid: number) {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: workSwr6bKeys.all(pid) });
    qc.invalidateQueries({ queryKey: workSwrKeys.all(pid) });
    qc.invalidateQueries({ queryKey: workCtw4Keys.rtm(pid) });
    qc.invalidateQueries({ queryKey: workCtw4Keys.srs(pid) });
  };
}

export async function downloadFile(get: () => Promise<{ blob: Blob; fileName: string }>) {
  try {
    const f = await get();
    saveBlob(f.blob, f.fileName);
    toast.success(wt('swr.downloaded', { name: f.fileName }));
  } catch (e) { toast.error(workError(e, wt('swr.exportFailed'))); }
}

/** Thanh chọn phân đoạn (role radiogroup) — dùng cho bộ lọc và chuyển chế độ xem. */
export function Seg<T extends string>({ value, options, onChange, label }: { value: T; options: Array<{ id: T; label: string; count?: number }>; onChange: (v: T) => void; label: string }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] p-0.5" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} type="button" role="radio" aria-checked={value === o.id} onClick={() => onChange(o.id)}
          className={cn('h-7 rounded-[6px] px-2.5 text-[12.5px] font-medium', value === o.id ? 'bg-[var(--w-sunken)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
          {o.label}{o.count !== undefined && <span className="ml-1 tabular-nums text-[var(--w-text-3)]">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Note({ tone = 'muted', children }: { tone?: 'muted' | 'warn' | 'ok'; children: ReactNode }) {
  return (
    <p role="status" className={cn('rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2 text-[12.5px] leading-relaxed',
      tone === 'warn' ? 'text-[var(--w-orange-text)]' : tone === 'ok' ? 'text-[var(--w-green-text)]' : 'text-[var(--w-text-2)]')}>
      {children}
    </p>
  );
}

/** Khối có tiêu đề nhỏ (một phần của tab). */
export function Section({ id, title, actions, children }: { id: string; title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id={id} className="flex-1 text-[13.5px] font-semibold text-[var(--w-text)]">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

export const fmtDay = (iso: string | null | undefined, locale: 'vi-VN' | 'en-US') => (iso ? new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—');
