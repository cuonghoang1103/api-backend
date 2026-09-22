'use client';

/**
 * Mảnh giao diện dùng chung cho các trang admin viết theo khung mới.
 * Nguyên tắc (23/09/2026): phân vùng bằng VIỀN MẢNH và KHOẢNG TRẮNG, không
 * bằng thẻ nổi; số liệu thẳng cột (tabular-nums); màu chỉ để báo trạng thái.
 */
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[17px] font-semibold leading-6 tracking-[-0.012em] text-[var(--a-text)]">{title}</h1>
        {description && <p className="mt-0.5 text-[13px] text-[var(--a-text-3)]">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Vùng có tiêu đề nhỏ + đường kẻ — thay cho "card". */
export function Section({
  title,
  action,
  children,
  className = '',
}: {
  title: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="flex h-8 items-center justify-between border-b border-[var(--a-border)]">
        <h2 className="text-[12.5px] font-medium text-[var(--a-text-2)]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Tabs<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { value: T; label: string; count?: number }[];
}) {
  return (
    <div className="flex items-center gap-0.5" role="tablist">
      {items.map((it) => {
        const on = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(it.value)}
            className={`flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-[12.5px] font-medium ${
              on ? 'bg-[var(--a-active)] text-[var(--a-text)]' : 'text-[var(--a-text-3)] hover:bg-[var(--a-hover)] hover:text-[var(--a-text-2)]'
            }`}
          >
            {it.label}
            {typeof it.count === 'number' && it.count > 0 && (
              <span className="tabular-nums text-[11.5px] text-[var(--a-text-3)]">{it.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export type Tone = 'green' | 'yellow' | 'red' | 'blue' | 'orange' | 'gray' | 'accent';
const TONE: Record<Tone, string> = {
  green: 'var(--a-green)',
  yellow: 'var(--a-yellow)',
  red: 'var(--a-red)',
  blue: 'var(--a-blue)',
  orange: 'var(--a-orange)',
  gray: 'var(--a-text-3)',
  accent: 'var(--a-accent)',
};

/** Chấm màu + nhãn — trạng thái nói bằng một chấm, không bằng cả viên thuốc màu. */
export function Status({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--a-text-2)]">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: TONE[tone] }} />
      {children}
    </span>
  );
}

/** Một chỉ số trong dải chỉ số (không phải thẻ). */
export function Metric({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="min-w-0 py-3 pr-4 lg:pl-4 lg:first:pl-0">
      <p className="truncate text-[12px] text-[var(--a-text-3)]">{label}</p>
      <p className="mt-1 text-[20px] font-semibold leading-7 tracking-[-0.01em] tabular-nums text-[var(--a-text)]">{value}</p>
      {hint && <p className="mt-0.5 truncate text-[11.5px] text-[var(--a-text-3)]">{hint}</p>}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children }: { icon?: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {Icon && <Icon className="mb-3 h-5 w-5 text-[var(--a-text-3)]" strokeWidth={1.5} />}
      <p className="text-[13px] font-medium text-[var(--a-text-2)]">{title}</p>
      {children && <p className="mt-1 max-w-sm text-[12.5px] text-[var(--a-text-3)]">{children}</p>}
    </div>
  );
}

/** "vừa xong" / "5m" / "3h" / "2d" — đọc nhanh hơn một mốc ngày giờ đầy đủ. */
export function relTime(iso: string): string {
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'now';
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}
