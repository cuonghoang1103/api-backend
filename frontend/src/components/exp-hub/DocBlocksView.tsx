'use client';

// DocBlocksView — the single source of truth for rendering a category's AI
// reference-doc blocks. Used BOTH on the public category page (CategoryDoc) and
// in the admin editor's live preview, so what an admin previews is exactly what
// visitors see. Reuses CodeViewer (code + mermaid) and the shared sanitizeHtml.

import { ExternalLink } from 'lucide-react';
import type { DocBlock } from '@/types/exp-hub';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { CodeViewer } from './CodeViewer';

export function DocBlocksView({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((b, i) => (
        <DocBlockView key={i} block={b} />
      ))}
    </div>
  );
}

export function DocBlockView({ block }: { block: DocBlock }) {
  switch (block.type) {
    case 'heading':
      return <h3 className="mt-1 text-base font-bold text-[var(--text-primary)]">{block.text}</h3>;
    case 'prose':
      return (
        <div
          className="exp-doc-prose text-sm leading-relaxed text-[var(--text-secondary)] [&_a]:text-[var(--accent-color)] [&_a]:underline [&_code]:rounded [&_code]:bg-[var(--bg-surface-active)] [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_li]:my-1 [&_li]:ml-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-2 [&_strong]:text-[var(--text-primary)] [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(block.html) }}
        />
      );
    case 'code':
      return <CodeViewer code={block.code} language={block.language} filename={block.title} showLineNumbers={false} maxHeight="440px" />;
    case 'mermaid':
      return <CodeViewer code={block.code} language="mermaid" />;
    case 'image':
      return (
        <figure className="my-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={block.url} alt={block.caption || ''} className="max-w-full rounded-lg border border-[var(--border-color)]" />
          {block.caption && <figcaption className="mt-1 text-center text-xs text-[var(--text-secondary)]">{block.caption}</figcaption>}
        </figure>
      );
    case 'links':
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          {block.items.map((it, j) => (
            <a
              key={j}
              href={it.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-2 transition-colors hover:border-[var(--accent-color)]"
            >
              <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-color)]" />
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-color)]">{it.label}</span>
                {it.note && <span className="block text-xs text-[var(--text-secondary)]">{it.note}</span>}
                <span className="block truncate text-[11px] text-[var(--text-secondary)] opacity-70">{it.url}</span>
              </span>
            </a>
          ))}
        </div>
      );
    default:
      return null;
  }
}
