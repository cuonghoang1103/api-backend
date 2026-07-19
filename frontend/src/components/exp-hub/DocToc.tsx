'use client';

// DocToc — the sub-section navigation ("mục con") for a technology's reference
// doc, shown in the middle column. Lists the doc's section headings; clicking
// one smooth-scrolls the right-hand doc panel to that section. Fills what used
// to be an empty "0 results" column for technologies that have a doc.

import { useState } from 'react';
import { ListTree, ChevronDown } from 'lucide-react';
import type { DocBlock } from '@/types/exp-hub';
import { docHeadings } from './DocBlocksView';

export function DocToc({ blocks }: { blocks: DocBlock[] }) {
  const [open, setOpen] = useState(true);
  const headings = docHeadings(blocks);
  if (headings.length === 0) return null;

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="border-b border-[var(--border-color)] p-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 text-left"
      >
        <ListTree className="h-4 w-4 text-violet-500" />
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          On this page
        </span>
        <span className="ml-1 rounded-full bg-[var(--bg-surface-active)] px-1.5 text-[11px] text-[var(--text-muted)]">
          {headings.length}
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-[var(--text-secondary)] transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>

      {open && (
        <nav className="mt-2 flex flex-col gap-0.5">
          {headings.map((h, i) => (
            <button
              key={h.id}
              type="button"
              onClick={() => jump(h.id)}
              className="group flex items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
            >
              <span className="mt-0.5 w-5 shrink-0 text-right text-[11px] tabular-nums text-[var(--text-muted)]">
                {i + 1}
              </span>
              <span className="min-w-0 flex-1 leading-snug group-hover:text-violet-500 dark:group-hover:text-violet-300">
                {h.text}
              </span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
