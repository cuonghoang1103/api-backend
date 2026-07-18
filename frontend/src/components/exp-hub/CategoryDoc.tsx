'use client';

// CategoryDoc — renders a technology's AI reference doc (Overview / What it's
// used for / Install / Usage / Combines with) below the CategoryHeader. The
// block array is fetched ON DEMAND (kept out of the nav tree) whenever the
// selected category changes. Reuses CodeViewer (code + mermaid) and the shared
// sanitizeHtml for prose, so it stays consistent with the snippet detail page.

import { useEffect, useState } from 'react';
import { BookText, ChevronDown, Loader2 } from 'lucide-react';
import type { DocBlock } from '@/types/exp-hub';
import { snippetCategoriesApi } from '@/lib/exp-hub-api';
import { sanitizeHtml } from '@/lib/sanitizeHtml';
import { CodeViewer } from './CodeViewer';

export function CategoryDoc({ categoryId, hasDoc }: { categoryId: number; hasDoc?: boolean }) {
  const [blocks, setBlocks] = useState<DocBlock[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    // Skip the request entirely when the tree already told us there's no doc.
    if (hasDoc === false) { setBlocks([]); return; }
    let alive = true;
    setLoading(true);
    setBlocks(null);
    snippetCategoriesApi
      .getDoc(categoryId)
      .then((res) => { if (alive) setBlocks(res.data.data.blocks || []); })
      .catch(() => { if (alive) setBlocks([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [categoryId, hasDoc]);

  if (loading) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-secondary)]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading documentation…
      </div>
    );
  }
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left"
      >
        <BookText className="h-4 w-4 text-[var(--accent-color)]" />
        <span className="text-sm font-semibold text-[var(--text-primary)]">Documentation</span>
        <ChevronDown className={`ml-auto h-4 w-4 text-[var(--text-secondary)] transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-[var(--border-color)] px-4 py-4">
          {blocks.map((b, i) => (
            <DocBlockView key={i} block={b} />
          ))}
        </div>
      )}
    </div>
  );
}

function DocBlockView({ block }: { block: DocBlock }) {
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
    default:
      return null;
  }
}
