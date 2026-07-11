'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

/**
 * Renders product description / guidance markdown safely.
 * - single line breaks are preserved (remark-breaks) so admins can lay out
 *   features one-per-line;
 * - `![alt](url)` → responsive image (paste an image in the admin editor);
 * - `[tại đây](url)` → a clickable link showing the TEXT (not the raw URL),
 *   opening in a new tab.
 * react-markdown v9 does NOT render raw HTML, so this is XSS-safe by default.
 */
export default function ProductMarkdown({ content }: { content: string }) {
  if (!content?.trim()) return null;
  return (
    <div className="product-md text-sm leading-relaxed text-text-secondary space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-violet font-medium underline decoration-neon-violet/40 underline-offset-2 hover:decoration-neon-violet"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === 'string' ? src : ''} alt={alt || ''} className="rounded-xl max-w-full h-auto my-3 border border-darkborder" />
          ),
          h1: ({ children }) => <h3 className="text-base font-bold text-text-primary mt-5 mb-2">{children}</h3>,
          h2: ({ children }) => <h3 className="text-base font-bold text-text-primary mt-5 mb-2 flex items-center gap-2"><span className="w-1 h-5 rounded-full shrink-0" style={{ background: 'linear-gradient(180deg,#a855f7,#ec4899)' }} />{children}</h3>,
          h3: ({ children }) => <h4 className="text-sm font-semibold text-neon-violet mt-4 mb-1.5">{children}</h4>,
          p: ({ children }) => <p className="text-text-secondary leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="text-neon-violet font-semibold">{children}</strong>,
          code: ({ children }) => <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(139,92,246,0.12)', color: '#c4b5fd' }}>{children}</code>,
          ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 text-text-secondary">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 text-text-secondary">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          hr: () => <hr className="my-4 border-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(168,85,247,0.3),transparent)' }} />,
          blockquote: ({ children }) => <blockquote className="border-l-2 border-neon-violet/40 pl-3 text-text-muted italic">{children}</blockquote>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
