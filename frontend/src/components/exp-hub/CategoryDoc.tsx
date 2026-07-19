'use client';

// CategoryDoc — renders a technology's AI reference doc (a comprehensive,
// multi-section guide: Overview / Install / Getting started / Usage recipes /
// CLI reference / Plans & pricing / Troubleshooting / Resources) in the WIDE
// right panel. The block array is OWNED by the page (exp-hub/page.tsx) so the
// middle-column sub-section nav (TOC) and this view share ONE fetch. Reuses
// DocBlocksView (CodeViewer for code + mermaid, sanitizeHtml for prose).

import { BookText, Loader2 } from 'lucide-react';
import type { DocBlock } from '@/types/exp-hub';
import { DocBlocksView } from './DocBlocksView';

export function CategoryDoc({
  name,
  blocks,
  loading,
}: {
  name?: string;
  blocks: DocBlock[] | null;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-3 text-sm text-[var(--text-secondary)]">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading documentation…
      </div>
    );
  }
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      <div className="flex items-center gap-2 border-b border-[var(--border-color)] px-4 py-2.5">
        <BookText className="h-4 w-4 text-[var(--accent-color)]" />
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          {name ? `${name} — Documentation` : 'Documentation'}
        </span>
      </div>
      <div className="px-4 py-5 sm:px-6">
        <DocBlocksView blocks={blocks} />
      </div>
    </div>
  );
}
