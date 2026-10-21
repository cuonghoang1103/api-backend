'use client';

/**
 * Thân bài / bình luận bảng tin: Markdown (GFM) như chat — KHÔNG rehype-raw (thẻ HTML hiện như chữ), `javascript:` bị gỡ,
 * ảnh Markdown không tự tải (thành link). @tên của người có trong `mentions` ⇒ chip; #thẻ ⇒ nút lọc bảng tin; link nội bộ
 * /work/… mở trong ứng dụng, link ngoài mở tab mới.
 */

import { memo, type ReactNode } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { wt } from '@/components/work/i18n';

/** Đoạn KHÔNG được đụng: khối code, code nội dòng, link Markdown, URL trần. */
const PROTECT = /(```[\s\S]*?```|`[^`\n]*`|\[[^\]\n]*\]\([^)\s]*\)|https?:\/\/\S+)/g;

/**
 * #thẻ TRƯỚC, @tên SAU (link `#mention-…` do bước @ sinh ra không được bị bước # đọc lại thành thẻ). Chip @ hiện TÊN người
 * (FB/LinkedIn) — `known`: username (chữ thường) ⇒ tên hiển thị; tên lạ giữ nguyên chữ.
 */
export function decorate(md: string, known: Map<string, string>): string {
  return md.split(PROTECT).map((part, i) => {
    if (i % 2 === 1) return part;
    let s = part.replace(/(^|[^\p{L}\p{N}_&/#[])#([\p{L}\p{N}_]{2,40})(?![\p{L}\p{N}_])/gu, (all, pre: string, tag: string) => (
      /^\d+$/.test(tag) ? all : `${pre}[#${tag}](#tag-${encodeURIComponent(tag.toLowerCase())})`
    ));
    // Đường dẫn CT Work trần (/work/ws/KEY/issue/12) ⇒ link trong ứng dụng, nhãn gọn (KEY-12) — thẻ xem trước nằm dưới bài.
    s = s.replace(/(^|[\s(])(\/work\/[^\s<>()[\]]+)/g, (_all, pre: string, path: string) => {
      const clean = path.replace(/[.,;:!?'"]+$/, '');
      const m = /^\/work\/[^/]+\/([A-Za-z][A-Za-z0-9_]*)\/(?:issue|tests)\/(\d+)/.exec(clean);
      return `${pre}[${m ? `${m[1].toUpperCase()}-${m[2]}` : clean}](${clean})${path.slice(clean.length)}`;
    });
    if (known.size) {
      s = s.replace(/(^|[^\w@./\-[])@([A-Za-z0-9_][A-Za-z0-9_.-]{0,39})/g, (all, pre: string, name: string) => {
        const n = name.replace(/[.-]+$/, '');
        const label = known.get(n.toLowerCase());
        if (!label) return all;
        return `${pre}[@${label.replace(/[[\]]/g, '')}](#mention-${n.toLowerCase()})${name.slice(n.length)}`;
      });
    }
    return s;
  }).join('');
}

function FeedMarkdownImpl({ text, known, meUsername, onTag, className }: {
  text: string; known: Map<string, string>; meUsername?: string; onTag?: (tag: string) => void; className?: string;
}) {
  return (
    <div className={cn('w-chat-md min-w-0 break-words text-[14px] leading-[1.6] text-[var(--w-text)]', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const h = href ?? '';
            if (h.startsWith('#mention-')) {
              const me = meUsername && h.slice(9) === meUsername.toLowerCase();
              return <span className={cn('rounded-[4px] px-1 font-medium', me ? 'bg-[color-mix(in_srgb,var(--w-yellow)_28%,transparent)] text-[var(--w-text)]' : 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]')}>{children}</span>;
            }
            if (h.startsWith('#tag-')) {
              const tag = decodeURIComponent(h.slice(5));
              return onTag
                ? <button type="button" className="inline p-0 font-medium text-[var(--w-accent-text)] hover:underline" onClick={(e) => { e.stopPropagation(); onTag(tag); }}>{children}</button>
                : <span className="font-medium text-[var(--w-accent-text)]">{children}</span>;
            }
            if (h.startsWith('/work/')) return <Link href={h} className="text-[var(--w-accent-text)] underline-offset-2 hover:underline">{children}</Link>;
            return <a href={h} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--w-accent-text)] underline-offset-2 hover:underline">{children}</a>;
          },
          img: ({ src, alt }) => (
            <a href={typeof src === 'string' ? src : '#'} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--w-accent-text)] underline">{alt || wt('chat.imageLink')}</a>
          ),
          p: ({ children }) => <p className="my-1 first:mt-0 last:mb-0">{children as ReactNode}</p>,
          ul: ({ children }) => <ul className="my-1 list-disc pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-1 list-decimal pl-5">{children}</ol>,
          h1: ({ children }) => <p className="my-1 text-[16px] font-semibold">{children}</p>,
          h2: ({ children }) => <p className="my-1 text-[15px] font-semibold">{children}</p>,
          h3: ({ children }) => <p className="my-1 font-semibold">{children}</p>,
          blockquote: ({ children }) => <blockquote className="my-1 border-l-[3px] border-[var(--w-border-strong)] pl-2.5 text-[var(--w-text-2)]">{children}</blockquote>,
          code: ({ className: cls, children }) => (
            /language-/.test(cls ?? '')
              ? <code className={cls}>{children}</code>
              : <code className="rounded-[4px] bg-[var(--w-sunken)] px-1 py-px font-mono text-[12.5px] text-[var(--w-code-inline,var(--w-text))]">{children}</code>
          ),
          pre: ({ children }) => <pre className="my-1.5 max-w-full overflow-x-auto rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-2.5 font-mono text-[12.5px] leading-[1.5]">{children}</pre>,
          table: ({ children }) => (
            <div className="my-1 max-w-full overflow-x-auto">
              <table className="border-collapse text-[13px] [&_td]:border [&_td]:border-[var(--w-border)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--w-border)] [&_th]:px-2 [&_th]:py-1">{children}</table>
            </div>
          ),
        }}
      >
        {decorate(text, known)}
      </ReactMarkdown>
    </div>
  );
}

export const FeedMarkdown = memo(FeedMarkdownImpl);
