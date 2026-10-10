'use client';

/**
 * CTW đợt 9c — chữ của câu hỏi / phương án / giải thích: Markdown (GFM) + công thức KaTeX ($…$ nội dòng, $$…$$ khối).
 * Không bật HTML thô (react-markdown mặc định thoát HTML) ⇒ chữ do giảng viên / AI viết không chèn được script.
 */

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { cn } from '@/lib/utils';

export default function QuizText({ text, inline, className }: { text: string; inline?: boolean; className?: string }) {
  return (
    <div className={cn('w-prose min-w-0 overflow-x-auto [&_.katex-display]:my-2 [&_p:last-child]:mb-0 [&_p]:mb-1.5', inline && '[&_p]:inline [&_p]:m-0', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[[rehypeKatex, { throwOnError: false, strict: 'ignore' }]]}
        components={{
          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
          // eslint-disable-next-line @next/next/no-img-element
          img: ({ src, alt }) => <img src={typeof src === 'string' ? src : undefined} alt={alt ?? ''} className="max-h-[320px] max-w-full rounded-[6px]" />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
