'use client';

/**
 * Thân tin chat: markdown (GFM) vẽ bằng react-markdown — KHÔNG rehype-raw ⇒ thẻ HTML trong tin hiện như chữ, link
 * `javascript:` bị urlTransform mặc định gỡ. Ảnh markdown KHÔNG tự tải (tránh ảnh theo dõi / tải URL lạ) ⇒ thành link.
 * @tên của người trong kênh được tô thành chip; link nội bộ /work/… mở trong ứng dụng, link ngoài mở tab mới.
 */

import { memo, type ReactNode } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

/** Đổi @tên (người thật trong kênh) thành link `#mention-<tên>` — bỏ qua khối code. */
function linkMentions(md: string, known: Set<string>): string {
  if (!known.size) return md;
  return md
    .split(/(```[\s\S]*?```|`[^`\n]*`)/g)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/(^|[^\w@./\-[])@([A-Za-z0-9_][A-Za-z0-9_.-]{0,39})/g, (all, pre: string, name: string) => {
      const n = name.replace(/[.-]+$/, '');
      if (!known.has(n.toLowerCase())) return all;
      return `${pre}[@${n}](#mention-${n.toLowerCase()})${name.slice(n.length)}`;
    })))
    .join('');
}

function ChatMarkdownImpl({ text, known, meUsername, className }: { text: string; known: Set<string>; meUsername?: string; className?: string }) {
  return (
    <div className={cn('w-chat-md min-w-0 break-words text-[14px] leading-[1.55] text-[var(--w-text)]', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const h = href ?? '';
            if (h.startsWith('#mention-')) {
              const me = meUsername && h.slice(9) === meUsername.toLowerCase();
              return <span className={cn('rounded-[4px] px-1 font-medium', me ? 'bg-[color-mix(in_srgb,var(--w-yellow)_28%,transparent)] text-[var(--w-text)]' : 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]')}>{children}</span>;
            }
            if (h.startsWith('/work/')) return <Link href={h} className="text-[var(--w-accent-text)] underline-offset-2 hover:underline">{children}</Link>;
            return <a href={h} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--w-accent-text)] underline-offset-2 hover:underline">{children}</a>;
          },
          img: ({ src, alt }) => (
            <a href={typeof src === 'string' ? src : '#'} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--w-accent-text)] underline">{alt || 'image link'}</a>
          ),
          p: ({ children }) => <p className="my-0.5">{children as ReactNode}</p>,
          ul: ({ children }) => <ul className="my-1 list-disc pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-1 list-decimal pl-5">{children}</ol>,
          blockquote: ({ children }) => <blockquote className="my-1 border-l-[3px] border-[var(--w-border-strong)] pl-2.5 text-[var(--w-text-2)]">{children}</blockquote>,
          code: ({ className: cls, children }) => (
            /language-/.test(cls ?? '')
              ? <code className={cls}>{children}</code>
              : <code className="rounded-[4px] bg-[var(--w-sunken)] px-1 py-px font-mono text-[12.5px] text-[var(--w-code-inline,var(--w-text))]">{children}</code>
          ),
          pre: ({ children }) => <pre className="my-1 max-w-full overflow-x-auto rounded-[6px] border border-[var(--w-border)] bg-[var(--w-sunken)] p-2.5 font-mono text-[12.5px] leading-[1.5]">{children}</pre>,
          table: ({ children }) => (
            <div className="my-1 max-w-full overflow-x-auto">
              <table className="border-collapse text-[13px] [&_td]:border [&_td]:border-[var(--w-border)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--w-border)] [&_th]:px-2 [&_th]:py-1">{children}</table>
            </div>
          ),
          h1: ({ children }) => <p className="my-1 text-[15px] font-semibold">{children}</p>,
          h2: ({ children }) => <p className="my-1 text-[15px] font-semibold">{children}</p>,
          h3: ({ children }) => <p className="my-1 font-semibold">{children}</p>,
        }}
      >
        {linkMentions(text, known)}
      </ReactMarkdown>
    </div>
  );
}

export const ChatMarkdown = memo(ChatMarkdownImpl);
