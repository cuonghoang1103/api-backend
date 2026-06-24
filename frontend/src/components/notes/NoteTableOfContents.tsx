'use client';

// NoteTableOfContents — auto-generated outline from the note's
// heading nodes (h1/h2/h3). Re-computed on every editor update.
// Click → editor.commands.focus + scrollIntoView.

import { useEffect, useState } from 'react';
import type { Editor } from '@tiptap/react';
import { List } from 'lucide-react';

interface Heading { level: number; text: string; pos: number }

interface Props {
  editor: Editor | null;
}

export default function NoteTableOfContents({ editor }: Props) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    if (!editor) return;
    const refresh = () => {
      // Walk the doc JSON. TipTap doesn't index headings for us, so we
      // do a single recursive pass. For typical study-note sizes this
      // is O(N) where N = number of nodes, which is fine.
      const doc = editor.state.doc;
      const found: Heading[] = [];
      doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          const level = (node.attrs as { level?: number }).level ?? 1;
          if (level >= 1 && level <= 3) {
            found.push({ level, text: node.textContent || '(Không tiêu đề)', pos });
          }
        }
      });
      setHeadings(found);
    };
    refresh();
    editor.on('update', refresh);
    return () => { editor.off('update', refresh); };
  }, [editor]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Mục lục" className="my-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        <List className="h-3.5 w-3.5" /> Mục lục
      </div>
      <ol className="space-y-0.5">
        {headings.map((h, i) => (
          <li key={i} style={{ paddingLeft: `${(h.level - 1) * 0.75}rem` }}>
            <button
              onClick={() => {
                if (!editor) return;
                // Move selection to the heading node's position.
                editor.commands.focus();
                try {
                  const dom = editor.view.nodeDOM(h.pos);
                  if (dom instanceof HTMLElement) dom.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } catch { /* ignore */ }
              }}
              className="block w-full truncate text-left text-[12.5px] text-slate-300 hover:text-teal-300"
            >
              {h.text}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
