'use client';

/**
 * Ô KPI dùng chung của CT Work (UX-A, 09/10/2026).
 *
 * Trước đây có BA kiểu: `StatCell` (reports), dải chữ HOA (tests/fpt `Stat`), ô
 * bấm-lọc (Portfolio). Giờ một thành phần, hai cỡ:
 *   · md — số 24px (reports, dashboard);
 *   · sm — số 18px, dùng cho dải KPI dày (Unit 5.1 / Integration 5.2).
 * Nhãn viết kiểu câu (sentence case), KHÔNG viết HOA. Màu tín hiệu chỉ tô khi có
 * nghĩa (vd "Passed 0" không xanh) — người gọi quyết `tone`, chữ dùng token chữ AA.
 * Có `onClick` ⇒ thành nút bật/tắt (`aria-pressed`) để lọc.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type KpiTone = 'green' | 'red' | 'yellow' | 'orange' | 'accent' | 'muted';

const TONE: Record<KpiTone, string> = {
  green: 'text-[var(--w-green-text)]',
  red: 'text-[var(--w-red-text)]',
  yellow: 'text-[var(--w-yellow-text)]',
  orange: 'text-[var(--w-orange-text)]',
  accent: 'text-[var(--w-accent-text)]',
  muted: 'text-[var(--w-text-2)]',
};

export interface KpiTileProps {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tone?: KpiTone;
  size?: 'sm' | 'md';
  /** Chấm màu trước nhãn (vd màu RAG). */
  dot?: string;
  /** Tooltip giải thích cách tính. */
  title?: string;
  onClick?: () => void;
  pressed?: boolean;
  className?: string;
  testId?: string;
}

export default function KpiTile({ label, value, hint, tone, size = 'md', dot, title, onClick, pressed, className, testId }: KpiTileProps) {
  const body = (
    <>
      <span className="flex min-w-0 items-center gap-1.5">
        {dot && <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: dot }} />}
        <span className="min-w-0 truncate text-[12px] font-medium text-[var(--w-text-2)]">{label}</span>
      </span>
      <span
        className={cn(
          'mt-1 block truncate font-semibold leading-tight tabular-nums tracking-[-0.02em] text-[var(--w-text)]',
          size === 'md' ? 'text-[24px]' : 'text-[18px]',
          tone && TONE[tone],
        )}
      >
        {value}
      </span>
      {hint && <span className="mt-0.5 block truncate text-[11px] text-[var(--w-text-3)]">{hint}</span>}
    </>
  );
  const box = cn(
    'flex min-w-0 flex-col rounded-[10px] border bg-[var(--w-raised)] text-left shadow-[var(--w-shadow-card)]',
    size === 'md' ? 'px-3.5 py-3' : 'px-3 py-2',
    pressed ? 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' : 'border-[var(--w-border)]',
    className,
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-pressed={!!pressed} title={title} data-testid={testId}
        className={cn(box, 'transition-colors hover:border-[var(--w-border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--w-accent-border)]')}>
        {body}
      </button>
    );
  }
  return <div className={box} title={title} data-testid={testId}>{body}</div>;
}

/** Hàng ô KPI tự xuống dòng; `min` = bề ngang tối thiểu mỗi ô. */
export function KpiRow({ children, min = 140, className, label }: { children: ReactNode; min?: number; className?: string; label?: string }) {
  return (
    <div role={label ? 'group' : undefined} aria-label={label} className={cn('grid gap-2', className)} style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))` }}>
      {children}
    </div>
  );
}
