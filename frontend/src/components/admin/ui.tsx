'use client';

/**
 * Mảnh giao diện dùng chung cho các trang admin.
 * 27/10/2026 — phong cách aidev.edu.vn (chủ web chọn): THẺ bo 16px nền xanh than nổi nhẹ, viền mảnh, tiêu đề to đậm,
 * nhãn nhỏ viết hoa màu xanh; số liệu thẳng cột (tabular-nums); màu chỉ để báo trạng thái.
 */
import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  /** Nhãn nhỏ viết hoa màu xanh phía trên tiêu đề (vd "QUẢN TRỊ"). */
  eyebrow?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <p className="a-eyebrow mb-1.5">{eyebrow}</p>}
        <h1 className="text-[26px] font-bold leading-8 tracking-[-0.02em] text-[var(--a-text)]">{title}</h1>
        {description && <p className="mt-1 text-[14px] text-[var(--a-text-2)]">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Vùng có tiêu đề nhỏ + đường kẻ — thay cho "card".
 *  `icon` + `tone`: một biểu tượng nhỏ mang màu của mảng việc. Màu nằm ở
 *  BIỂU TƯỢNG chứ không ở chữ, nên trang có màu mà không thành cầu vồng. */
export function Section({
  title,
  action,
  icon: Icon,
  tone,
  children,
  className = '',
}: {
  title: ReactNode;
  action?: ReactNode;
  icon?: LucideIcon;
  tone?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-[var(--a-border)] bg-[var(--a-raised)] p-4 ${className}`}>
      <div className="mb-2 flex min-h-8 items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[15px] font-bold text-[var(--a-text)]">
          {Icon && (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: `color-mix(in srgb, ${tone ?? 'var(--a-accent)'} 18%, transparent)` }}>
              <Icon className="h-4 w-4" strokeWidth={2} style={{ color: tone ?? 'var(--a-accent-text)' }} />
            </span>
          )}
          {title}
        </h2>
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
            className={`flex h-8 items-center gap-1.5 rounded-[10px] px-3 text-[13px] font-semibold ${
              on ? 'bg-[var(--a-accent-soft)] text-[var(--a-accent-text)]' : 'text-[var(--a-text-3)] hover:bg-[var(--a-hover)] hover:text-[var(--a-text-2)]'
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

/** Một chỉ số trong dải chỉ số (không phải thẻ).
 *  `tone` vẽ một chấm màu cạnh nhãn — đủ để mắt nhóm các chỉ số cùng mảng,
 *  không tô màu con số (số vẫn phải là thứ dễ đọc nhất). */
export function Metric({
  label, value, hint, tone, up,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: string;
  /** true/false: chú thích là mức tăng/giảm → tô màu trạng thái. */
  up?: boolean;
}) {
  const hintColor = up === undefined ? 'var(--a-text-3)' : up ? 'var(--a-green)' : 'var(--a-red)';
  return (
    <div className="min-w-0 rounded-2xl border border-[var(--a-border)] bg-[var(--a-raised)] px-4 py-3.5">
      <p className="flex items-center gap-1.5 text-[12.5px] font-medium leading-4 text-[var(--a-text-2)]">
        {tone && <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: tone }} />}
        {label}
      </p>
      <p className="mt-2 text-[24px] font-bold leading-8 tracking-[-0.02em] tabular-nums text-[var(--a-text)]">{value}</p>
      {hint && <p className="mt-0.5 truncate text-[12px]" style={{ color: hintColor }}>{hint}</p>}
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
