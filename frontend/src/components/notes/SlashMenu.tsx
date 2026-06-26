'use client';

// SlashMenu — type "/" at the start of an empty line to pick a block.
// Lightweight, keyboard-driven, and only mounts while the trigger is
// active. Picks dispatch straight into the editor's command chain.
//
// We deliberately avoid pulling a third-party suggestion library —
// the picker is a single column of buttons and matches the rest of
// the notes UI in style.

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import type { Editor } from '@tiptap/react';

export interface SlashMenuRef {
  /** Show the menu at the given screen position. */
  open: (rect: DOMRect) => void;
  /** Hide the menu (called on Escape, blur, or successful pick). */
  close: () => void;
  /** True while the menu is currently shown. */
  isOpen: () => boolean;
}

interface Props {
  editor: Editor | null;
}

interface Item {
  label: string;
  hint: string;
  // Each pick is responsible for inserting the right block. We pass
  // the editor so we can dispatch commands + chain a focus afterwards.
  // The Editor type is intentionally widened to `any` here so the
  // menu can call commands we extend (setCallout, setCodeBlock, etc.)
  // without TS complaining — strict command types live on the editor.
  run: (editor: Editor) => void;
  keywords?: string[];
}

function buildItems(editor: Editor): Item[] {
  // The editor carries extensions we registered; cast to `any` so the
  // chain below can call our custom commands (setCallout, etc.)
  // without losing to Tiptap's narrow `ChainedCommands` type.
  const e = editor as unknown as { chain: () => any };
  return [
    {
      label: 'Heading 1', hint: '# Tiêu đề lớn',
      keywords: ['h1', 'tieude', 'heading', 'tieu de lon'],
      run: (ed) => e.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: 'Heading 2', hint: '## Tiêu đề vừa',
      keywords: ['h2', 'tieudevua', 'heading'],
      run: (ed) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: 'Heading 3', hint: '### Tiêu đề nhỏ',
      keywords: ['h3', 'tieudenho', 'heading'],
      run: (ed) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      label: 'Bulleted list', hint: '• Danh sách',
      keywords: ['ul', 'bullet', 'list', 'danh sach'],
      run: (ed) => e.chain().focus().toggleBulletList().run(),
    },
    {
      label: 'Numbered list', hint: '1. Danh sách có số',
      keywords: ['ol', 'number', 'numbered', 'list'],
      run: (ed) => e.chain().focus().toggleOrderedList().run(),
    },
    {
      label: 'Checklist', hint: '☑ Việc cần làm',
      keywords: ['todo', 'task', 'check', 'checklist'],
      run: (ed) => e.chain().focus().toggleTaskList().run(),
    },
    {
      label: 'Code block', hint: '``` ngôn ngữ',
      keywords: ['code', 'snippet'],
      run: (ed) => e.chain().focus().toggleCodeBlock().run(),
    },
    {
      label: 'Callout — Mẹo', hint: 'Mẹo hữu ích',
      keywords: ['callout', 'tip', 'meo'],
      run: (ed) => e.chain().focus().toggleCallout({ kind: 'tip' }).run(),
    },
    {
      label: 'Callout — Ghi chú', hint: 'Ghi chú phụ',
      keywords: ['callout', 'note', 'ghichu'],
      run: (ed) => e.chain().focus().toggleCallout({ kind: 'note' }).run(),
    },
    {
      label: 'Callout — Cảnh báo', hint: 'Cảnh báo / chú ý',
      keywords: ['callout', 'warning', 'canh bao'],
      run: (ed) => e.chain().focus().toggleCallout({ kind: 'warning' }).run(),
    },
    {
      label: 'Math (inline)', hint: '$E = mc^2$',
      keywords: ['math', 'katex', 'latex', 'cong thuc'],
      run: (ed) => e.chain().focus().insertContent({ type: 'math', attrs: { mode: 'inline' }, content: [{ type: 'text', text: 'E = mc^2' }] }).run(),
    },
    {
      label: 'Math (block)', hint: '$$\\sum_{i=0}^n i$$',
      keywords: ['math', 'katex', 'block', 'latex'],
      run: (ed) => e.chain().focus().insertContent({ type: 'math', attrs: { mode: 'block' }, content: [{ type: 'text', text: '\\sum_{i=0}^n i' }] }).run(),
    },
    {
      label: 'Horizontal rule', hint: '— đường kẻ ngang —',
      keywords: ['hr', 'rule', 'duong ke'],
      run: (ed) => e.chain().focus().setHorizontalRule().run(),
    },
    {
      label: 'Table 3×3', hint: 'Bảng',
      keywords: ['table', 'bang'],
      run: (ed) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
    },
    {
      label: 'Quote', hint: '"trích dẫn"',
      keywords: ['quote', 'blockquote', 'trich dan'],
      run: (ed) => e.chain().focus().toggleBlockquote().run(),
    },
  ];
}

const SlashMenu = forwardRef<SlashMenuRef, Props>(({ editor }, ref) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const ref_div = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    open: (rect) => {
      setPos({ top: rect.bottom + window.scrollY + 4, left: rect.left + window.scrollX });
      setQuery('');
      setActive(0);
      setOpen(true);
    },
    close: () => setOpen(false),
    isOpen: () => open,
  }), [open]);

  const items = (() => {
    if (!editor) return [];
    const q = query.trim().toLowerCase();
    const all = buildItems(editor);
    if (!q) return all;
    return all.filter((it) =>
      it.label.toLowerCase().includes(q) ||
      (it.keywords ?? []).some((k) => k.includes(q)),
    );
  })();

  // Reset active when the list changes so arrow keys always point at something valid.
  useEffect(() => { setActive(0); }, [query]);

  // Keyboard navigation: ArrowUp/Down/Enter/Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
      if (items.length === 0) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % items.length); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + items.length) % items.length); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const item = items[active];
        if (item && editor) { item.run(editor); setOpen(false); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, items, active, editor]);

  if (!open || !editor || items.length === 0) return null;

  return (
    <div
      ref={ref_div}
      role="listbox"
      style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 60 }}
      className="w-64 max-h-72 overflow-y-auto rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/95 p-1 shadow-2xl backdrop-blur"
    >
      {items.map((it, i) => (
        <button
          key={it.label}
          role="option"
          aria-selected={i === active}
          onMouseDown={(e) => { e.preventDefault(); it.run(editor); setOpen(false); }}
          onMouseEnter={() => setActive(i)}
          className={`flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-left text-[13px] ${i === active ? 'bg-teal-100 dark:bg-teal-500/15 text-teal-800 dark:text-teal-100' : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:bg-white/5'}`}
        >
          <span className="font-medium">{it.label}</span>
          <span className="truncate text-[11px] text-slate-500 dark:text-slate-500">{it.hint}</span>
        </button>
      ))}
    </div>
  );
});

SlashMenu.displayName = 'SlashMenu';
export default SlashMenu;
