'use client';

/**
 * Hiển thị nội dung tệp nguồn của một component.
 *
 * Hai chế độ, đúng như trang gốc: đọc đã định dạng, hoặc xem mã thô để chép về.
 * Mặc định là bản đã định dạng — người vào đây chủ yếu muốn HIỂU component làm
 * gì trước khi cài, chứ chưa cần từng dấu cách.
 *
 * ─── ID CHO ĐỀ MỤC ──────────────────────────────────────────────────────────
 * Mục lục bên phải nhảy tới đề mục bằng `#id`, nên `h2`/`h3` phải mang đúng id
 * mà `extractHeadings` đã tính. Cả hai cùng gọi `slugify` và cùng đếm trùng lặp
 * theo một thứ tự — lệch một chỗ là mục lục trỏ vào hư không. Vì thế bộ đếm ở
 * đây được nạp lại mỗi lần `md` đổi (xem `useMemo`), không phải biến toàn cục.
 *
 * `rehype-highlight` chạy ĐỒNG BỘ nên hợp với react-markdown (Shiki thì bất
 * đồng bộ và sẽ ném "runSync finished async" — xem chú thích ở
 * `components/markdown/Markdown.tsx`).
 */

import { useMemo, useRef, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Code2, FileText, ExternalLink } from 'lucide-react';
import { slugify } from '@/lib/ai-templates/headings';
import type { FrontmatterEntry } from '@/lib/ai-templates/frontmatter';
import CopyButton from './CopyButton';
import FrontmatterPanel from './FrontmatterPanel';
import ContentSearch from './ContentSearch';

export default function ContentViewer({
  text,
  body,
  frontmatter,
  format,
  url,
  truncated,
}: {
  /** Nguyên văn tệp — chế độ "Mã thô" và nút chép dùng cái này. */
  text: string;
  /** Markdown đã bỏ frontmatter — chế độ "Đọc" dùng cái này. */
  body: string;
  frontmatter: FrontmatterEntry[];
  format: 'md' | 'json';
  url: string;
  truncated: boolean;
}) {
  const [mode, setMode] = useState<'read' | 'raw'>(format === 'md' ? 'read' : 'raw');
  // Vùng để ContentSearch tô sáng và cuộn tới. Bọc CẢ bảng khai báo lẫn thân
  // bài: người tìm "WCAG" không quan tâm chữ đó nằm ở frontmatter hay ở thân.
  const bodyRef = useRef<HTMLDivElement>(null);

  const components = useMemo<Components>(() => {
    // Bộ đếm phải sống cùng vòng đời với `text`: dựng lại ở đây thì mỗi lần đổi
    // component là đếm lại từ 0, khớp với `extractHeadings`.
    const seen = new Map<string, number>();
    const idFor = (children: React.ReactNode) => {
      const raw = String(children);
      const base = slugify(raw);
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      return n ? `${base}-${n}` : base;
    };

    return {
      h1: ({ children }) => (
        <h1 className="mb-3 mt-8 font-heading text-[22px] font-bold leading-tight text-[var(--text-primary)] first:mt-0">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2
          id={idFor(children)}
          className="mb-2.5 mt-8 scroll-mt-20 border-b border-[var(--border-color)] pb-1.5 font-heading text-[18px] font-semibold text-[var(--text-primary)]"
        >
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3
          id={idFor(children)}
          className="mb-2 mt-6 scroll-mt-20 font-heading text-[15px] font-semibold text-[var(--text-primary)]"
        >
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="mb-1.5 mt-5 font-heading text-[14px] font-semibold text-[var(--text-secondary)]">
          {children}
        </h4>
      ),
      p: ({ children }) => (
        <p className="my-3 text-[13.5px] leading-[1.75] text-[var(--text-secondary)]">{children}</p>
      ),
      ul: ({ children }) => (
        <ul className="my-3 list-disc space-y-1.5 pl-5 text-[13.5px] leading-relaxed text-[var(--text-secondary)] marker:text-[var(--text-muted)]">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="my-3 list-decimal space-y-1.5 pl-5 text-[13.5px] leading-relaxed text-[var(--text-secondary)] marker:text-[var(--text-muted)]">
          {children}
        </ol>
      ),
      li: ({ children }) => <li className="pl-1">{children}</li>,
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent-color)] underline underline-offset-2 hover:text-[var(--accent-hover)]"
        >
          {children}
        </a>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-4 border-l-2 border-[var(--accent-color)] bg-[var(--bg-surface)] px-4 py-2 text-[13.5px] italic text-[var(--text-secondary)]">
          {children}
        </blockquote>
      ),
      hr: () => <hr className="my-6 border-[var(--border-color)]" />,
      strong: ({ children }) => (
        <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>
      ),
      table: ({ children }) => (
        // Bảng trong tài liệu hay rộng hơn cột chữ — cho nó tự cuộn ngang thay
        // vì để cả TRANG cuộn ngang.
        <div className="my-4 overflow-x-auto rounded-lg border border-[var(--border-color)]">
          <table className="w-full border-collapse text-[13px]">{children}</table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border-b border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 text-left font-semibold text-[var(--text-primary)]">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border-b border-[var(--border-color)] px-3 py-2 align-top text-[var(--text-secondary)]">
          {children}
        </td>
      ),
      code: ({ className, children, ...props }) => {
        const isBlock = /language-/.test(className ?? '');
        if (!isBlock) {
          return (
            <code
              className="rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-1 py-0.5 font-mono text-[12px] text-[var(--text-primary)]"
              {...props}
            >
              {children}
            </code>
          );
        }
        return (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      pre: ({ children }) => (
        <pre className="hljs my-4 overflow-x-auto rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-3.5 font-mono text-[12.5px] leading-relaxed">
          {children}
        </pre>
      ),
    };
  }, []);

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h2 className="mr-auto font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          Nội dung tệp nguồn
        </h2>

        {format === 'md' && (
          <div className="flex items-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-0.5">
            {([
              { v: 'read', label: 'Đọc', Icon: FileText },
              { v: 'raw', label: 'Mã thô', Icon: Code2 },
            ] as const).map(({ v, label, Icon }) => (
              <button
                key={v}
                type="button"
                onClick={() => setMode(v)}
                aria-pressed={mode === v}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] transition-colors ${
                  mode === v
                    ? 'bg-[var(--bg-surface-active)] text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>
        )}

        <ContentSearch source={text} containerRef={bodyRef} />

        <CopyButton value={text} label="Chép toàn bộ" />

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-color)] hover:text-[var(--text-primary)]"
        >
          <ExternalLink size={12} />
          Tệp gốc
        </a>
      </div>

      <div ref={bodyRef}>
        {mode === 'read' && <FrontmatterPanel entries={frontmatter} />}

        <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
          {mode === 'read' && format === 'md' ? (
            <div className="ai-tmpl-prose">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={components}
              >
                {body}
              </ReactMarkdown>
            </div>
          ) : (
            <pre className="overflow-x-auto font-mono text-[12.5px] leading-relaxed text-[var(--text-secondary)]">
              {text}
            </pre>
          )}

          {truncated && (
            <p className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[12.5px] text-amber-600">
              Tệp quá dài nên đã cắt bớt phần cuối.{' '}
              <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
                Xem đầy đủ trên GitHub
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
