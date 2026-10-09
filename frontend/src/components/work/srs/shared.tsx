'use client';

/**
 * CTW đợt 4 — mảnh dùng chung của trang Requirements (SRS có cấu trúc + RTM): chip trạng thái/ưu tiên/chỗ hở, ô chữ
 * nhiều dòng có nhãn, khung bảng có tiêu đề dính. Màu chữ dùng token AA (`--w-*-text`), nền pha nhạt từ màu tín hiệu.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { GapCode, UcPriority, UcStatus } from '@/lib/work-ctw4-api';
import { wt } from '@/components/work/i18n';

const tint = (c: string) => `color-mix(in srgb, var(${c}) 14%, transparent)`;

export function Chip({ tone, children, title }: { tone: 'green' | 'yellow' | 'red' | 'orange' | 'blue' | 'muted' | 'accent'; children: ReactNode; title?: string }) {
  const map = {
    green: ['--w-green', '--w-green-text'], yellow: ['--w-yellow', '--w-yellow-text'], red: ['--w-red', '--w-red-text'], orange: ['--w-orange', '--w-orange-text'],
    blue: ['--w-blue', '--w-blue-text'], accent: ['--w-accent', '--w-accent-text'], muted: ['--w-text-3', '--w-text-2'],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <span title={title} className="inline-flex h-5 shrink-0 items-center whitespace-nowrap rounded-[4px] px-1.5 text-[11.5px] font-medium" style={{ background: tint(bg), color: `var(${fg})` }}>
      {children}
    </span>
  );
}

export const STATUS_TEXT: Record<UcStatus, string> = { get PROPOSED() { return wt('srs.stProposed'); }, get DRAFT() { return wt('common.draft'); }, get APPROVED() { return wt('srs.stApproved'); } };
export function UcStatusChip({ status }: { status: UcStatus }) {
  return <Chip tone={status === 'APPROVED' ? 'green' : status === 'PROPOSED' ? 'accent' : 'muted'} title={status === 'PROPOSED' ? wt('srs.proposedHint') : undefined}>{STATUS_TEXT[status]}</Chip>;
}

export const PRIORITY_TEXT: Record<UcPriority, string> = { get HIGH() { return wt('status.prioHigh'); }, get MEDIUM() { return wt('status.prioMedium'); }, get LOW() { return wt('status.prioLow'); } };
export function PriorityChip({ p }: { p: UcPriority }) {
  return <Chip tone={p === 'HIGH' ? 'orange' : p === 'LOW' ? 'muted' : 'blue'}>{PRIORITY_TEXT[p]}</Chip>;
}

export const GAP_TONE: Record<GapCode, 'red' | 'orange' | 'yellow'> = {
  FAILING: 'red', OPEN_BUGS: 'red', NO_TEST: 'orange', NOT_RUN: 'yellow', NO_CODE: 'yellow', NO_SDS: 'yellow', NO_SRS: 'orange', UC_INCOMPLETE: 'orange', NO_ISSUE: 'yellow', NO_SEQUENCE: 'yellow',
};

/** Ô chữ nhiều dòng có nhãn thật (`<label htmlFor>`). */
export function TextArea({ id, label, value, onChange, rows = 3, placeholder, readOnly, hint, mono }: {
  id: string; label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; readOnly?: boolean; hint?: string; mono?: boolean;
}) {
  return (
    <div className="mb-3">
      <label className="w-label" htmlFor={id}>{label}</label>
      <textarea id={id} className={cn('w-input min-h-[60px] py-1.5 leading-[1.45]', mono && 'font-mono text-[12.5px]')} rows={rows} value={value} readOnly={readOnly} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{hint}</p>}
    </div>
  );
}

/** Khung bảng cuộn riêng + tiêu đề dính (chuẩn rà soát giao diện 09/10). */
export function TableFrame({ children, label, maxH = 'calc(100vh - 230px)' }: { children: ReactNode; label: string; maxH?: string }) {
  return (
    <div className="overflow-auto rounded-[8px] border border-[var(--w-border)] bg-[var(--w-panel)]" style={{ maxHeight: maxH }} role="region" aria-label={label} tabIndex={0}>
      {children}
    </div>
  );
}
export const TH = 'sticky top-0 z-[1] whitespace-nowrap border-b border-[var(--w-border)] bg-[var(--w-sunken)] px-3 py-2 text-left text-[12px] font-medium text-[var(--w-text-2)]';
export const TD = 'border-b border-[var(--w-border)] px-3 py-2 align-top text-[13px]';

/** Dòng chữ nhiều dòng rút gọn (tooltip đủ). */
export function Clip({ text, lines = 2 }: { text: string | null | undefined; lines?: number }) {
  if (!text) return <span className="text-[var(--w-text-3)]">—</span>;
  return <span title={text} className="block overflow-hidden text-[var(--w-text)]" style={{ display: '-webkit-box', WebkitLineClamp: lines, WebkitBoxOrient: 'vertical' }}>{text}</span>;
}
