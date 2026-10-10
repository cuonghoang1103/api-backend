'use client';

/**
 * CT Work đợt 6 — mảnh giao diện dùng chung cho các màn chất lượng (Reviews, thiết kế test, giám sát, rủi ro, thăm dò):
 * khung thẻ có tiêu đề, bảng gọn có tiêu đề dính, nhãn màu theo nghĩa, nút phân đoạn, ô số. Màu chỉ qua token `--w-*`.
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type Tone = 'green' | 'red' | 'yellow' | 'orange' | 'blue' | 'accent' | 'muted';

const TONE: Record<Tone, string> = {
  green: 'text-[var(--w-green-text)] bg-[color-mix(in_srgb,var(--w-green)_14%,transparent)]',
  red: 'text-[var(--w-red-text)] bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)]',
  yellow: 'text-[var(--w-yellow-text)] bg-[color-mix(in_srgb,var(--w-yellow)_16%,transparent)]',
  orange: 'text-[var(--w-orange-text)] bg-[color-mix(in_srgb,var(--w-orange)_14%,transparent)]',
  blue: 'text-[var(--w-blue-text)] bg-[color-mix(in_srgb,var(--w-blue)_14%,transparent)]',
  accent: 'text-[var(--w-accent-text)] bg-[var(--w-accent-soft)]',
  muted: 'text-[var(--w-text-2)] bg-[var(--w-hover)]',
};

export function Badge({ tone = 'muted', children, className, title }: { tone?: Tone; children: ReactNode; className?: string; title?: string }) {
  return <span title={title} className={cn('inline-flex items-center whitespace-nowrap rounded-[4px] px-1.5 py-[1px] text-[11.5px] font-medium', TONE[tone], className)}>{children}</span>;
}

export function Card({ title, desc, actions, children, className, testId }: { title?: ReactNode; desc?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string; testId?: string }) {
  return (
    <section className={cn('w-card min-w-0 p-4', className)} data-testid={testId}>
      {(title || actions) && (
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0">
            {title && <h2 className="text-[14px] font-semibold text-[var(--w-text)]">{title}</h2>}
            {desc && <p className="mt-0.5 max-w-[760px] text-[12.5px] leading-relaxed text-[var(--w-text-2)]">{desc}</p>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-1.5">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Tbl({ children, minWidth = 640, maxHeight, label }: { children: ReactNode; minWidth?: number; maxHeight?: number; label?: string }) {
  return (
    <div className="overflow-auto rounded-[var(--w-radius)] border border-[var(--w-border)]" style={maxHeight ? { maxHeight } : undefined} role={label ? 'region' : undefined} aria-label={label} tabIndex={label ? 0 : undefined}>
      <table className="w-full border-separate border-spacing-0 text-[13px]" style={{ minWidth }}>{children}</table>
    </div>
  );
}
export function Th({ children, className, w }: { children?: ReactNode; className?: string; w?: number }) {
  return <th scope="col" style={w ? { width: w } : undefined} className={cn('sticky top-0 z-[1] border-b border-[var(--w-border)] bg-[var(--w-panel)] px-2.5 py-2 text-left text-[12px] font-medium text-[var(--w-text-2)]', className)}>{children}</th>;
}
export function Td({ children, className, colSpan }: { children?: ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={cn('border-b border-[var(--w-border)] px-2.5 py-2 align-top text-[var(--w-text)]', className)}>{children}</td>;
}

/** Nút phân đoạn (radio) — có nhãn cho trình đọc màn hình. */
export function Segmented<T extends string>({ value, options, onChange, label, size = 'sm', disabled, testId }: {
  value: T | null; options: Array<{ value: T; label: string; tone?: Tone }>; onChange: (v: T) => void; label: string; size?: 'sm' | 'xs'; disabled?: boolean; testId?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border)]" data-testid={testId}>
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value} type="button" role="radio" aria-checked={on} disabled={disabled} onClick={() => onChange(o.value)}
            className={cn(
              'border-r border-[var(--w-border)] font-medium transition-colors last:border-r-0 disabled:opacity-60',
              size === 'xs' ? 'px-2 py-[2px] text-[11.5px]' : 'px-2.5 py-1 text-[12.5px]',
              on ? (o.tone ? TONE[o.tone] : 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]') : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function NumberInput({ value, onChange, min, max, step, label, className, placeholder, disabled }: {
  value: number | null | undefined; onChange: (v: number | null) => void; min?: number; max?: number; step?: number; label: string; className?: string; placeholder?: string; disabled?: boolean;
}) {
  return (
    <input
      type="number" inputMode="decimal" aria-label={label} className={cn('w-input tabular-nums', className)} min={min} max={max} step={step} placeholder={placeholder} disabled={disabled}
      value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
    />
  );
}

export function Labeled({ label, children, hint, className }: { label: string; children: ReactNode; hint?: string; className?: string }) {
  return (
    <label className={cn('flex min-w-0 flex-col gap-1', className)}>
      <span className="text-[12px] font-medium text-[var(--w-text-2)]">{label}</span>
      {children}
      {hint && <span className="text-[11.5px] text-[var(--w-text-3)]">{hint}</span>}
    </label>
  );
}

export const splitList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);
export const pct = (n: number | null | undefined) => (n === null || n === undefined ? '—' : `${n}%`);
