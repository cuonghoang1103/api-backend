'use client';

/**
 * Khung + mảnh giao diện dùng chung cho luồng 3 trang "Studio doanh nghiệp":
 *   1. /about/studio       — Giới thiệu
 *   2. /about/nhan-du-an   — Nhận dự án (form gửi yêu cầu)
 *   3. /about/quy-trinh    — Quy trình (+ /[slug], /to-chuc)
 *
 * Token màu ở `studio.module.css`. Không hook nào đứng sau return sớm.
 */
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import Footer from '@/components/home/Footer';
import s from './studio.module.css';

export type Lang = 'vi' | 'en';

/** Cùng địa chỉ với /about, Footer, ContactSection — đổi thì đổi cả các chỗ đó. */
export const STUDIO_EMAIL = 'cuongthaihnhe176322@gmail.com';

export const studioCss = s;

export function useStudioLang() {
  const { locale } = useTranslation();
  const lang: Lang = locale === 'en' ? 'en' : 'vi';
  const L = (vi: string, en: string): string => (lang === 'en' ? en : vi);
  return { lang, L };
}

// ─── Lớp chữ / nút dùng lại ────────────────────────────────────────────────
export const T = {
  /** Tiêu đề trang — chữ có chân Fraunces (đã nạp sẵn ở layout gốc). */
  display:
    'font-heading font-semibold tracking-[-0.04em] text-[color:var(--s-ink)] text-[2.35rem] leading-[1.08] sm:text-[3.1rem] lg:text-[3.75rem]',
  h2: 'font-heading font-semibold tracking-[-0.03em] text-[color:var(--s-ink)] text-[1.75rem] leading-[1.15] sm:text-[2.15rem]',
  h3: 'font-heading font-semibold text-[color:var(--s-ink)] text-[1.05rem] leading-snug',
  lead: 'text-[1.05rem] sm:text-[1.15rem] leading-[1.7] text-[color:var(--s-body)]',
  body: 'text-[0.95rem] leading-[1.7] text-[color:var(--s-body)]',
  small: 'text-[0.8rem] leading-[1.55] text-[color:var(--s-muted)]',
  label: 'text-[0.8rem] font-semibold text-[color:var(--s-accent)]',
  btnPrimary:
    'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold bg-[var(--s-ink)] text-[color:var(--s-on-ink)] hover:opacity-90 transition-opacity',
  btnGhost:
    'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold border border-[color:var(--s-line-strong)] text-[color:var(--s-ink)] hover:border-[color:var(--s-ink)] transition-colors',
  card: 'rounded-xl border border-[color:var(--s-line)] bg-[var(--s-raise)]',
} as const;

// ─── Thanh bước 1 → 2 → 3 ──────────────────────────────────────────────────
export const FLOW = [
  { n: 1, href: '/about/studio', label: ['Giới thiệu', 'About the studio'] as const },
  { n: 2, href: '/about/nhan-du-an', label: ['Nhận dự án', 'Start a project'] as const },
  { n: 3, href: '/about/quy-trinh', label: ['Quy trình', 'How we deliver'] as const },
];

export function FlowSteps({ current }: { current: 1 | 2 | 3 }) {
  const { lang, L } = useStudioLang();
  return (
    <nav
      aria-label={L('Các bước tìm hiểu', 'Steps')}
      className="border-b border-[color:var(--s-line)] bg-[var(--s-paper)]"
    >
      <ol className="max-w-6xl mx-auto px-4 flex items-stretch gap-0 overflow-x-auto [scrollbar-width:none]">
        {FLOW.map((f, i) => {
          const done = f.n < current;
          const on = f.n === current;
          return (
            <li key={f.n} className="flex items-center min-w-0 shrink-0">
              {i > 0 && <span aria-hidden className="mx-2 sm:mx-4 h-px w-5 sm:w-10 bg-[var(--s-line-strong)]" />}
              <Link
                href={f.href}
                aria-current={on ? 'step' : undefined}
                className={`group relative flex items-center gap-2.5 py-3.5 text-sm whitespace-nowrap ${
                  on ? 'text-[color:var(--s-ink)] font-semibold' : 'text-[color:var(--s-muted)] hover:text-[color:var(--s-ink)]'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-full text-[0.75rem] font-semibold tabular-nums border ${
                    on
                      ? 'bg-[var(--s-ink)] text-[color:var(--s-on-ink)] border-[color:var(--s-ink)]'
                      : done
                        ? 'border-[color:var(--s-accent)] text-[color:var(--s-accent)]'
                        : 'border-[color:var(--s-line-strong)]'
                  }`}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : f.n}
                </span>
                <span className={on ? '' : 'hidden min-[420px]:inline'}>{f.label[lang === 'en' ? 1 : 0]}</span>
                {on && <span aria-hidden className="absolute left-0 right-0 -bottom-px h-0.5 bg-[var(--s-accent)]" />}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─── Khung trang ───────────────────────────────────────────────────────────
/**
 * `className` (tuỳ chọn) gắn THÊM vào gốc — để một trang đè bộ token `--s-*`
 * của riêng nó (vd /about/studio bản giấy ngà). Không truyền thì y như cũ.
 */
export function StudioShell({
  step,
  children,
  className,
}: {
  step: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className ? `${s.root} ${className}` : s.root}>
      {/* Thanh điều hướng cố định của site cao 4rem. */}
      <div className="pt-16">
        <FlowSteps current={step} />
      </div>
      {children}
      <Footer />
    </div>
  );
}

export function Section({
  id,
  band,
  className = '',
  children,
}: {
  id?: string;
  band?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 py-16 sm:py-20 ${band ? 'bg-[var(--s-band)] border-y border-[color:var(--s-line)]' : ''} ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4">{children}</div>
    </section>
  );
}

/** Tiêu đề mục kiểu tài liệu tư vấn: tên mục bên trái, phần dẫn bên phải (desktop). */
export function SectionHeader({ title, lead, label }: { title: string; lead?: React.ReactNode; label?: string }) {
  return (
    <header className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 mb-10 sm:mb-12">
      <div className="min-w-0">
        {label && <p className={`${T.label} mb-3`}>{label}</p>}
        <h2 className={T.h2}>{title}</h2>
      </div>
      {lead && <div className={`${T.lead} min-w-0 lg:pt-1 max-w-[62ch]`}>{lead}</div>}
    </header>
  );
}

/**
 * Khối chuyển sang trang kế trong luồng.
 * `variant="plain"`: chỉ dựng khung ngữ nghĩa (không lớp Tailwind), mỗi mảnh có
 * `data-part` để trang gọi tự tạo kiểu — /about/studio dùng cách này. Mặc định
 * `card` giữ nguyên giao diện cho hai trang còn lại.
 */
export function NextStep({
  href,
  step,
  title,
  desc,
  cta,
  variant = 'card',
  className,
}: {
  href: string;
  step: string;
  title: string;
  desc: string;
  cta: string;
  variant?: 'card' | 'plain';
  className?: string;
}) {
  if (variant === 'plain') {
    return (
      <Link href={href} className={className} data-part="root">
        <span data-part="step">{step}</span>
        <span data-part="title">{title}</span>
        <span data-part="desc">{desc}</span>
        <span data-part="cta">
          {cta}
          <ArrowRight aria-hidden className="w-4 h-4" />
        </span>
      </Link>
    );
  }
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href={href}
          className="group grid gap-6 rounded-2xl bg-[var(--s-ink)] text-[color:var(--s-on-ink)] p-7 sm:p-10 md:grid-cols-[1fr_auto] md:items-end"
        >
          <div className="min-w-0">
            <p className="text-sm opacity-70">{step}</p>
            <p className="mt-2 font-editorial text-[1.9rem] sm:text-[2.4rem] leading-[1.1] tracking-[-0.01em]">{title}</p>
            <p className="mt-3 max-w-[58ch] text-[0.95rem] leading-relaxed opacity-80">{desc}</p>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold whitespace-nowrap">
            {cta}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </section>
  );
}

/** Danh sách gạch đầu dòng vuông nhỏ màu nhấn. */
export function Bullets({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((it) => (
        <li key={it} className={`flex gap-3 ${T.body}`}>
          <span aria-hidden className="mt-[0.62rem] w-1.5 h-1.5 shrink-0 bg-[var(--s-accent)]" />
          <span className="min-w-0">{it}</span>
        </li>
      ))}
    </ul>
  );
}
