'use client';

// ModuleLesson — the NTU-style long-form tutorial for a Code Lab module, shown
// (collapsible) at the top of the module's section on the roadmap page, above
// its exercises. The lesson block array is fetched ON DEMAND when expanded, and
// rendered with the SAME DocBlocksView used by Exp Hub docs (heading / prose /
// annotated code / mermaid / links).

import { useState } from 'react';
import { BookOpenText, ChevronDown, Loader2 } from 'lucide-react';
import type { DocBlock } from '@/types/exp-hub';
import { codeLabApi } from '@/lib/code-lab-api';
import { DocBlocksView } from '@/components/exp-hub/DocBlocksView';

export function ModuleLesson({ moduleId, hasLesson }: { moduleId: number; hasLesson?: boolean }) {
  const [open, setOpen] = useState(false);
  const [blocks, setBlocks] = useState<DocBlock[] | null>(null);
  const [loading, setLoading] = useState(false);

  if (!hasLesson) return null;

  const toggle = async () => {
    const next = !open;
    setOpen(next);
    if (next && blocks === null && !loading) {
      setLoading(true);
      try {
        const res = await codeLabApi.getLesson(moduleId);
        setBlocks((res.data.data.blocks as DocBlock[]) || []);
      } catch {
        setBlocks([]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="border-b" style={{ borderColor: 'var(--border-color)' }}>
      <button
        onClick={toggle}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors hover:bg-[var(--bg-surface-hover)]"
      >
        <BookOpenText size={16} className="text-[var(--accent-color,#8b5cf6)]" style={{ color: 'var(--accent-color)' }} />
        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Lesson</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>— read before the exercises</span>
        <ChevronDown size={16} className={`ml-auto transition-transform ${open ? '' : '-rotate-90'}`} style={{ color: 'var(--text-muted)' }} />
      </button>
      {open && (
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex items-center gap-2 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              <Loader2 size={16} className="animate-spin" /> Loading lesson…
            </div>
          ) : blocks && blocks.length ? (
            <div className="mx-auto min-w-0 max-w-3xl">
              <DocBlocksView blocks={blocks} />
            </div>
          ) : (
            <p className="py-3 text-sm" style={{ color: 'var(--text-muted)' }}>No lesson content yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
