import Link from 'next/link';
import { SELLER_INFO } from '@/lib/sellerInfo';

// Public policy pages — kept in one list so every legal page cross-links to
// the others (and the footer can reuse it).
export const LEGAL_PAGES: { href: string; label: string }[] = [
  { href: '/huong-dan-mua-hang', label: 'Hướng dẫn mua hàng' },
  { href: '/chinh-sach-thanh-toan', label: 'Chính sách thanh toán' },
  { href: '/chinh-sach-giao-hang', label: 'Chính sách giao hàng' },
  { href: '/chinh-sach-doi-tra', label: 'Chính sách đổi trả & hoàn tiền' },
  { href: '/chinh-sach-bao-mat', label: 'Chính sách bảo mật' },
];

export default function LegalShell({
  title,
  updated = '2026-07-13',
  activeHref,
  children,
}: {
  title: string;
  updated?: string;
  activeHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pt-16" style={{ background: 'var(--bg-primary)' }}>
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-12">
        <nav className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="mx-1.5">/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{title}</span>
        </nav>

        <h1 className="text-2xl font-bold sm:text-3xl" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h1>
        <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          Cập nhật lần cuối: {new Date(updated).toLocaleDateString('vi-VN')}
        </p>

        {/* Content — the `legal-prose` class gives headings/paragraphs/lists
            readable spacing without pulling in a Markdown lib. */}
        <article className="legal-prose mt-6 space-y-4 text-[15px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {children}
        </article>

        {/* Seller identity (Part 1 — MOIT). Shown on every policy page. */}
        <section
          className="mt-10 rounded-2xl border p-5 text-sm"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
        >
          <h2 className="mb-3 text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            Thông tin người bán
          </h2>
          <ul className="space-y-1.5" style={{ color: 'var(--text-secondary)' }}>
            <li><b>Chủ sở hữu:</b> {SELLER_INFO.legalName} ({SELLER_INFO.sellerType})</li>
            <li><b>Thương hiệu:</b> {SELLER_INFO.brand} — {' '}
              <a href="https://cuongthai.com" className="text-neon-violet hover:underline">cuongthai.com</a></li>
            <li><b>Địa chỉ:</b> {SELLER_INFO.address}</li>
            <li><b>Mã số thuế / ĐKKD:</b> {SELLER_INFO.taxCode}</li>
            <li><b>Điện thoại / Zalo:</b> <a href={`tel:${SELLER_INFO.phone}`} className="text-neon-violet hover:underline">{SELLER_INFO.phone}</a></li>
            <li><b>Email:</b> <a href={`mailto:${SELLER_INFO.email}`} className="text-neon-violet hover:underline">{SELLER_INFO.email}</a></li>
          </ul>
        </section>

        {/* Cross-links to the other policies */}
        <nav className="mt-8 border-t pt-6" style={{ borderColor: 'var(--border-color)' }}>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Các chính sách khác
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {LEGAL_PAGES.filter((p) => p.href !== activeHref).map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-sm text-neon-violet hover:underline">{p.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
