'use client';

// NoteCodeBlock — custom Tiptap node that renders a code block via
// the shared <CodeBlock /> component (Shiki, VSCode-grade colors).
// Replaces StarterKit's bundled lowlight-backed code block so we
// never ship two highlighting libraries.
//
// Why this file exists:
// Before this rewrite the editor shipped a Next.js `dynamic()`
// import with `ssr: false` for the shared CodeBlock. That works
// for top-level client components but inside a Tiptap NodeView
// the dynamic chunk was kept in its loading state forever — the
// user reported "renders as plain monochrome white text". The fix
// is to drop `ssr: false` (the editor is already client-only via
// `immediatelyRender: false` in NoteEditor) and let CodeBlock mount
// normally on the client, then run its own Shiki async work in
// useEffect.
//
// Lazy-loading strategy: the Notes editor doesn't pull in Shiki's
// ~1MB of grammars until the user opens a note AND that note
// actually contains a code block. Notes without code blocks never
// touch Shiki.

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import dynamic from 'next/dynamic';
import { Code, Trash2 } from 'lucide-react';

// Lazy-load the shared CodeBlock so the initial /notes bundle stays
// small. We deliberately do NOT pass `ssr: false` here — the editor
// itself is a client-only component (`'use client'` + immediatelyRender:
// false), and inside a Tiptap NodeView the `ssr: false` flag would
// keep the dynamic component pinned to its `loading` placeholder
// forever. Without `ssr: false`, the chunk is still code-split (it's
// fetched on demand) but the component mounts normally once loaded,
// which lets CodeBlock's useEffect-driven Shiki work run.
const CodeBlock = dynamic(() => import('@/components/markdown/CodeBlock'), {
  loading: () => (
    <pre className="my-3 overflow-x-auto rounded-lg border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-900/60 p-4 font-mono text-[13px] text-slate-700 dark:text-slate-300">
      <code>Đang tải trình highlight…</code>
    </pre>
  ),
});

/** Languages we expose in the picker. Every value below maps to a
 *  grammar registered in CodeBlock's SUPPORTED_LANGS list — adding a
 *  new option here without adding the grammar there would silently
 *  fall back to plaintext. */
export const NOTE_CODE_LANGS = [
  { value: '', label: 'Plain text' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'tsx', label: 'TSX' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'jsx', label: 'JSX' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'prisma', label: 'Prisma' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'markdown', label: 'Markdown' },
];

export const NoteCodeBlock = Node.create({
  name: 'codeBlock',
  group: 'block',
  code: true,
  defining: true,
  marks: '',
  // Allow only inline marks so the block reads as raw code (no bold
  // inside code — keeps the JSON predictable).
  content: 'text*',

  addAttributes() {
    return {
      language: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'pre', preserveWhitespace: 'full' }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'pre',
      mergeAttributes(HTMLAttributes, { 'data-type': 'code-block' }),
      ['code', {}, 0],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  },

  addCommands() {
    return {
      setCodeBlock:
        (attributes?: { language?: string }) =>
        ({ commands }: { commands: any }) =>
          commands.setNode(this.name, attributes),
      toggleCodeBlock:
        (attributes?: { language?: string }) =>
        ({ commands }: { commands: any }) =>
          // toggleNode(typeOrName, toggleTypeOrName, attributes?) — 3 args.
          // 'paragraph' goes in slot 2 so the language attr is actually
          // applied (not dropped on the floor).
          commands.toggleNode(this.name, 'paragraph', attributes),
      deleteCodeBlock:
        () =>
        ({ commands }: { commands: any }) =>
          commands.deleteNode(this.name),
    } as Partial<Record<string, (...args: any[]) => any>>;
  },
});

export default NoteCodeBlock;

// Module augmentation intentionally omitted — Tiptap already infers
// the command type from addCommands(), and an explicit declaration
// conflicts with its stricter typing on the `language` attr.

function CodeBlockView({ node, updateAttributes, editor }: NodeViewProps) {
  const code: string = node.textContent;
  const language: string = (node.attrs as { language?: string }).language ?? '';
  const isEditable = editor.isEditable;

  return (
    <NodeViewWrapper className="my-3" data-type="code-block">
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-slate-900/60">
        {isEditable && (
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-900/40 px-2 py-1">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-500">
              <Code className="h-3 w-3" />
              <select
                value={language}
                onChange={(e) => updateAttributes({ language: e.target.value })}
                className="rounded border border-slate-300 dark:border-white/10 bg-transparent px-1 py-0.5 text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none"
                aria-label="Ngôn ngữ"
              >
                {NOTE_CODE_LANGS.map((l) => (
                  <option key={l.value} value={l.value} className="bg-white dark:bg-slate-900">{l.label}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteNode('codeBlock').run()}
              aria-label="Xóa code block"
              title="Xóa code block"
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-slate-500 dark:text-slate-500 hover:bg-red-500/15 hover:text-red-300"
            >
              <Trash2 className="h-3 w-3" />
              <span>Xóa</span>
            </button>
          </div>
        )}
        <CodeBlock code={code} language={language || undefined} />
      </div>
    </NodeViewWrapper>
  );
}
