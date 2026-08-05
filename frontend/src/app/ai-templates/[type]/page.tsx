import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TYPES, getTypeBySlug } from '@/lib/ai-templates/catalog';
import {
  getCategories,
  getCounts,
  getRecords,
  getTotalCount,
  toListItems,
} from '@/lib/ai-templates/data.server';
import ComponentBrowser from '@/components/ai-templates/ComponentBrowser';
import TypeNav from '@/components/ai-templates/TypeNav';
import TypeIcon from '@/components/ai-templates/TypeIcon';
import QuickStart from '@/components/ai-templates/QuickStart';

const SITE_URL = 'https://cuongthai.com';

/**
 * Danh sách component của MỘT loại.
 *
 * Trang được dựng sẵn lúc build cho cả 10 loại (`generateStaticParams`): dữ
 * liệu là JSON tĩnh, không có gì phụ thuộc vào người dùng hay thời điểm, nên
 * render lúc chạy chỉ tốn CPU mà không thêm được thông tin nào.
 *
 * Server làm đúng hai việc: đọc JSON và RÚT GỌN (`toListItems`). Toàn bộ tìm –
 * lọc – sắp xếp nằm ở `ComponentBrowser` phía trình duyệt.
 */

export function generateStaticParams() {
  return TYPES.map((t) => ({ type: t.slug }));
}

/**
 * Chỉ 10 slug ở trên là hợp lệ, không có slug nào sinh ra về sau.
 *
 * `dynamicParams = false` cho Next trả 404 THẬT ngay ở tầng định tuyến với mọi
 * slug lạ, thay vì dựng trang rồi mới gọi `notFound()`. Vừa nhanh hơn (không
 * render gì), vừa tránh được chỗ khó chịu: `notFound()` trong route động trả
 * mã 200 kèm nội dung 404 ở chế độ dev — trông như trang lỗi nhưng bot lại đọc
 * ra "trang này ổn".
 */
export const dynamicParams = false;

interface PageProps {
  params: { type: string };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const meta = getTypeBySlug(params.type);
  if (!meta) return { title: 'Không tìm thấy' };

  const count = getRecords(meta.slug).length;
  const title = `${meta.label} cho Claude Code — ${count} component dựng sẵn`;
  const description = `${meta.tagline}. Duyệt ${count} ${meta.label} theo danh mục, tìm bằng tiếng Việt, gom vào Stack rồi cài bằng một lệnh.`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/ai-templates/${meta.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/ai-templates/${meta.slug}`,
      type: 'website',
    },
  };
}

export default function TypeListPage({ params }: PageProps) {
  const meta = getTypeBySlug(params.type);
  if (!meta) notFound();

  const records = getRecords(meta.slug);
  const items = toListItems(records);
  const categories = getCategories(meta.slug);
  const counts = getCounts();
  const total = getTotalCount();
  const described = records.filter((r) => r.description).length;

  return (
    <>
      {/* ── Đầu trang ────────────────────────────────────────────────────── */}
      <header className="mb-5">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Kho AI Templates · {total.toLocaleString('vi-VN')} component
        </p>

        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
            style={{
              borderColor: `${meta.color}55`,
              background: `${meta.color}14`,
              color: meta.color,
            }}
          >
            <TypeIcon name={meta.icon} size={26} />
          </span>

          <div className="min-w-0">
            <h1 className="font-heading text-[26px] font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-[32px]">
              {meta.label}
            </h1>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{meta.tagline}</p>
          </div>
        </div>

        <p className="mt-3.5 max-w-3xl text-[13.5px] leading-relaxed text-[var(--text-muted)]">
          {meta.blurb}
        </p>

        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-baseline gap-1.5">
            <dt className="text-[12px] text-[var(--text-muted)]">Tổng cộng</dt>
            <dd className="font-mono text-[14px] font-semibold text-[var(--text-primary)]">
              {records.length.toLocaleString('vi-VN')}
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-[12px] text-[var(--text-muted)]">Danh mục</dt>
            <dd className="font-mono text-[14px] font-semibold text-[var(--text-primary)]">
              {categories.length}
            </dd>
          </div>
          <div className="flex items-baseline gap-1.5">
            <dt className="text-[12px] text-[var(--text-muted)]">Có mô tả</dt>
            <dd className="font-mono text-[14px] font-semibold text-[var(--text-primary)]">
              {records.length ? Math.round((described / records.length) * 100) : 0}%
            </dd>
          </div>
          {meta.flag && (
            <div className="flex items-baseline gap-1.5">
              <dt className="text-[12px] text-[var(--text-muted)]">Cờ CLI</dt>
              <dd className="font-mono text-[13px] font-semibold" style={{ color: meta.color }}>
                {meta.flag}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div className="mb-5">
        <TypeNav active={meta.slug} counts={counts} />
      </div>

      <QuickStart />

      <ComponentBrowser items={items} categories={categories} meta={meta} />
    </>
  );
}
