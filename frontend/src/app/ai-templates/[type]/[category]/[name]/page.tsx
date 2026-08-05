import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Github, Package, Scale, Tag, User2, FileWarning } from 'lucide-react';
import {
  SOURCE_TREE,
  detailHref,
  getTypeBySlug,
  prettyName,
  sourceFilePath,
  toRef,
} from '@/lib/ai-templates/catalog';
import { categoryLabel } from '@/lib/ai-templates/labels';
import { installRecipe } from '@/lib/ai-templates/install';
import { findRecord, getRelated } from '@/lib/ai-templates/data.server';
import { fetchComponentContent } from '@/lib/ai-templates/content.server';
import { extractHeadings } from '@/lib/ai-templates/headings';
import TypeIcon from '@/components/ai-templates/TypeIcon';
import InstallBox from '@/components/ai-templates/InstallBox';
import ContentViewer from '@/components/ai-templates/ContentViewer';
import TableOfContents from '@/components/ai-templates/TableOfContents';
import { RecordVisit } from '@/components/ai-templates/RecentlyViewed';

const SITE_URL = 'https://cuongthai.com';

/**
 * Trang chi tiết một component.
 *
 * ─── VÌ SAO KHÔNG `generateStaticParams` ────────────────────────────────────
 * Có 1.877 component. Dựng sẵn từng trang nghĩa là build phải sinh 1.877 trang
 * VÀ gọi 1.877 lượt fetch ra GitHub — trên VPS 6 GB với `cpus: 1` (xem
 * next.config.js) thì đó là cách chắc chắn nhất để deploy chạy hàng chục phút
 * rồi chết. Nên: render lúc có người xem, còn nội dung thì cache 24 giờ ở tầng
 * fetch, nên lượt thứ hai trở đi gần như không tốn gì.
 */

interface PageProps {
  params: { type: string; category: string; name: string };
}

function resolve(params: PageProps['params']) {
  const meta = getTypeBySlug(params.type);
  if (!meta) return null;
  const category = decodeURIComponent(params.category);
  const name = decodeURIComponent(params.name);
  const record = findRecord(meta.slug, category, name);
  if (!record) return null;
  return { meta, record };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const hit = resolve(params);
  if (!hit) return { title: 'Không tìm thấy component' };

  const { meta, record } = hit;
  const title = `${prettyName(record.name)} — ${meta.label}`;
  const description =
    record.description ||
    `${prettyName(record.name)} là ${meta.label} thuộc danh mục ${categoryLabel(record.category)}, cài cho Claude Code bằng một lệnh.`;
  const url = `${SITE_URL}${detailHref(meta.slug, record.path, record.category)}`;

  return {
    title,
    description: description.slice(0, 300),
    alternates: { canonical: url },
    openGraph: { title, description: description.slice(0, 300), url, type: 'article' },
  };
}

export default async function ComponentDetailPage({ params }: PageProps) {
  const hit = resolve(params);
  if (!hit) notFound();

  const { meta, record } = hit;
  const recipe = installRecipe(record);
  const content = await fetchComponentContent(meta, record.path);
  // Rút mục lục từ `body` (đã bỏ frontmatter), KHÔNG từ `text`: các khoá
  // frontmatter không phải đề mục và sẽ lọt vào mục lục dưới dạng mục chết.
  const headings = content?.format === 'md' ? extractHeadings(content.body) : [];
  const related = getRelated(meta.slug, record);
  const filePath = sourceFilePath(meta, record.path);

  /**
   * Chốt chặn ở tầng render: chỉ nhận giá trị SỐ.
   *
   * `contains` đến từ JSON ngoài, được nạp bằng `as ComponentRecord[]` — phép ép
   * kiểu đó nói dối trình biên dịch, nên kiểu `Record<string, number>` không hề
   * được kiểm ở đâu cả. 11/33 plugin từng khai lồng một tầng và React ném thẳng
   * "Objects are not valid as a React child", làm TRẮNG trang chi tiết của đúng
   * 11 plugin đó. `ai-templates-refresh.mjs` đã làm phẳng ở đầu vào; dòng lọc
   * này là lớp thứ hai, cho lần dữ liệu nguồn đổi hình mà không ai kịp biết.
   */
  const containsRows = Object.entries(record.contains ?? {}).filter(
    (e): e is [string, number] => typeof e[1] === 'number' && e[1] > 0,
  );

  return (
    <>
      <RecordVisit
        item={{ t: meta.slug, p: record.path, c: record.category, n: record.name }}
      />

      <Link
        href={`/ai-templates/${meta.slug}`}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:text-[var(--accent-color)]"
      >
        <ArrowLeft size={14} />
        Về danh sách {meta.label}
      </Link>

      {/* ── Đầu trang ────────────────────────────────────────────────────── */}
      <header className="mb-5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
            style={{
              borderColor: `${meta.color}55`,
              background: `${meta.color}14`,
              color: meta.color,
            }}
          >
            <TypeIcon name={meta.icon} size={22} />
          </span>

          <div className="min-w-0 flex-1">
            <h1 className="font-heading text-[24px] font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-[28px]">
              {prettyName(record.name)}
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <Link
                href={`/ai-templates/${meta.slug}`}
                className="rounded-md border px-2 py-0.5 text-[11.5px] font-medium transition-colors"
                style={{ borderColor: `${meta.color}55`, color: meta.color }}
              >
                {meta.label}
              </Link>
              <Link
                href={`/ai-templates/${meta.slug}?cat=${encodeURIComponent(record.category)}`}
                className="rounded-md border border-[var(--border-color)] px-2 py-0.5 text-[11.5px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)]"
              >
                {categoryLabel(record.category)}
              </Link>
              {record.author && (
                <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border-color)] px-2 py-0.5 text-[11.5px] text-[var(--text-muted)]">
                  <User2 size={11} />
                  {record.author}
                </span>
              )}
              {record.version && (
                <span className="rounded-md border border-[var(--border-color)] px-2 py-0.5 font-mono text-[11.5px] text-[var(--text-muted)]">
                  v{record.version}
                </span>
              )}
              {record.license && (
                <span className="inline-flex items-center gap-1 rounded-md border border-[var(--border-color)] px-2 py-0.5 text-[11.5px] text-[var(--text-muted)]">
                  <Scale size={11} />
                  {record.license}
                </span>
              )}
            </div>
          </div>
        </div>

        {record.description && (
          <p className="mt-4 max-w-4xl text-[14px] leading-relaxed text-[var(--text-secondary)]">
            {record.description}
          </p>
        )}

        {record.keywords.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {record.keywords.map((k) => (
              <li
                key={k}
                className="inline-flex items-center gap-1 rounded border border-[var(--border-color)] px-1.5 py-0.5 font-mono text-[10.5px] text-[var(--text-muted)]"
              >
                <Tag size={9} />
                {k}
              </li>
            ))}
          </ul>
        )}

        {/* Plugin gói sẵn nhiều component cùng chủ đề — con số này là thứ đầu
            tiên người ta muốn biết ("cài vào thì được những gì"), nên đưa lên
            trước cả phần mô tả dài. */}
        {containsRows.length > 0 && (
          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {containsRows.map(([k, n]) => (
              <div key={k} className="flex items-baseline gap-1.5">
                <dd className="font-mono text-[15px] font-semibold text-[var(--text-primary)]">{n}</dd>
                <dt className="text-[12px] text-[var(--text-muted)]">{categoryLabel(k)}</dt>
              </div>
            ))}
          </dl>
        )}

        {record.highlights && record.highlights.length > 0 && (
          <ul className="mt-4 space-y-1">
            {record.highlights.map((h) => (
              <li key={h} className="text-[13px] text-[var(--text-secondary)]">
                • {h}
              </li>
            ))}
          </ul>
        )}

        {record.files && record.files.length > 0 && (
          // `open`: với Template thì danh sách tệp CHÍNH LÀ nội dung — không có
          // tệp nguồn nào khác để đọc. Gấp lại là giấu mất thứ duy nhất đáng xem.
          <details open className="mt-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-3">
            <summary className="cursor-pointer text-[13px] font-medium text-[var(--text-primary)]">
              {record.files.length} tệp sẽ được tạo
            </summary>
            <ul className="mt-2 space-y-0.5">
              {record.files.map((f) => (
                <li key={f} className="font-mono text-[11.5px] text-[var(--text-muted)]">
                  {f}
                </li>
              ))}
            </ul>
          </details>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {filePath && (
            <a
              href={`${SOURCE_TREE}/${filePath}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]"
            >
              <Github size={13} />
              Xem trên GitHub
            </a>
          )}
          {record.repo && (
            <a
              href={record.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]"
            >
              <ExternalLink size={13} />
              Repo của tác giả
            </a>
          )}
          {record.website && (
            <a
              href={record.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]"
            >
              <ExternalLink size={13} />
              Trang giới thiệu
            </a>
          )}
        </div>
      </header>

      <div className="mb-5">
        <InstallBox
          recipe={recipe}
          type={record.type}
          refId={toRef(record.path)}
          name={record.name}
          category={record.category}
        />
      </div>

      {/* ── Nội dung + mục lục ───────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_200px]">
        <div className="min-w-0">
          {content ? (
            <ContentViewer
              text={content.text}
              body={content.body}
              frontmatter={content.frontmatter}
              format={content.format}
              url={content.url}
              truncated={content.truncated}
            />
          ) : (
            /* HAI trạng thái khác hẳn nhau, đừng gộp một lời:
               - `filePath === null` — Template và Plugin vốn KHÔNG có tệp nguồn
                 riêng. Đây là bình thường, nói "chưa lấy được" là vu oan cho hệ
                 thống và làm người dùng tưởng trang hỏng.
               - `filePath` có mà `content` rỗng — GitHub trục trặc thật. */
            <section className="rounded-xl border border-dashed border-[var(--border-color)] px-6 py-10 text-center">
              {filePath ? (
                <FileWarning size={24} className="mx-auto text-amber-500 opacity-70" />
              ) : (
                <Package size={24} className="mx-auto text-[var(--text-muted)] opacity-50" />
              )}
              <p className="mt-3 font-heading text-[14px] font-semibold text-[var(--text-primary)]">
                {filePath
                  ? 'Chưa lấy được nội dung tệp nguồn'
                  : `${meta.label} không có tệp nguồn riêng`}
              </p>
              <p className="mx-auto mt-1.5 max-w-md text-[13px] leading-relaxed text-[var(--text-muted)]">
                {filePath
                  ? 'Nội dung được tải trực tiếp từ repo gốc trên GitHub — có thể tệp vừa được đổi tên, hoặc kết nối tới GitHub đang trục trặc. Lệnh cài phía trên vẫn dùng được bình thường.'
                  : meta.type === 'plugin'
                    ? 'Plugin là bộ sưu tập do cộng đồng phát hành: nó gói sẵn nhiều component cùng chủ đề chứ không phải một tệp. Xem repo của tác giả để biết bên trong có gì.'
                    : 'Template là bộ khởi tạo cả thư mục `.claude/` chứ không phải một tệp — danh sách tệp sẽ tạo nằm ở phần trên.'}
              </p>
              {!filePath && record.repo && (
                <a
                  href={record.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)]"
                >
                  <Github size={13} />
                  Mở repo của tác giả
                </a>
              )}
              {filePath && (
                <a
                  href={`${SOURCE_TREE}/${filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-[13px] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)]"
                >
                  <Github size={13} />
                  Mở trên GitHub
                </a>
              )}
            </section>
          )}
        </div>

        <aside className="hidden lg:block">
          <TableOfContents headings={headings} />
        </aside>
      </div>

      {/* ── Cùng danh mục ────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 font-heading text-[15px] font-semibold text-[var(--text-primary)]">
            {meta.label} khác trong {categoryLabel(record.category)}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              // `min-w-0` — xem chú thích cùng chỗ trong ComponentBrowser.
              <li key={r.path} className="min-w-0">
                <Link
                  href={detailHref(meta.slug, r.path, r.category)}
                  className="flex h-full flex-col rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] p-3 transition-colors hover:border-[var(--accent-color)]"
                >
                  <span className="font-heading text-[13.5px] font-semibold text-[var(--text-primary)]">
                    {prettyName(r.name)}
                  </span>
                  {r.description && (
                    <span
                      className="mt-1 text-[12px] leading-relaxed text-[var(--text-muted)]"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {r.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
