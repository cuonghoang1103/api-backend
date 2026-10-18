'use client';

/**
 * Khối markdown cho chữ AI viết (retro, bản tin, giải thích kế hoạch sprint).
 * Cùng cấu hình với WeeklyReportTab: GFM, bảng cuộn ngang; link ngoài mở tab mới, link `/work/…` mở trong app.
 */

import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { inAppPath, isModifiedClick } from './links';

export default function AiMarkdown({ text, className }: { text: string; className?: string }) {
  const router = useRouter();
  return (
    <div className={cn('w-prose min-w-0 overflow-x-hidden', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          table: ({ children }) => (
            <div className="mb-2 max-w-full overflow-x-auto">
              <table className="w-full border-collapse text-[13px] [&_td]:border [&_td]:border-[var(--w-border)] [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-[var(--w-border)] [&_th]:px-2 [&_th]:py-1 [&_th]:text-left">{children}</table>
            </div>
          ),
          // Link tới CT Work (`/work/…`) mở trong app; link ngoài mở tab mới.
          a: ({ href, children }) => {
            const inApp = inAppPath(href);
            if (!inApp) return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
            return <a href={inApp} onClick={(e) => { if (isModifiedClick(e)) return; e.preventDefault(); router.push(inApp); }}>{children}</a>;
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
