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
import { DocBlocksView } from './DocBlocksView';

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
        <div className="border-t border-[var(--border-color)] px-4 py-4">
          <DocBlocksView blocks={blocks} />
        </div>
      )}
    </div>
  );
}
