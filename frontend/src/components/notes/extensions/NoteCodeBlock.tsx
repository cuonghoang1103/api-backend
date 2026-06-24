'use client';

// NoteCodeBlock — custom Tiptap node that renders a code block via
// the shared <CodeBlock /> component (Shiki, VSCode-grade colors).
// Replaces StarterKit's bundled lowlight-backed code block so we
// never ship two highlighting libraries.
//
// Lazy-loading: CodeBlock pulls in shiki (≈ 1MB gz of grammars/themes
// once Shiki's own async JSON loads). We use a Next.js `dynamic()`
// import with `ssr: false` so the bundle only loads when the user
// actually opens a note. The server-rendered HTML (contentHtml) uses
// Shiki too via the same component when the page renders statically.

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import dynamic from 'next/dynamic';
import { Code } from 'lucide-react';

// Lazy-load Shiki + the styling so the notes page doesn't pull in
// ~1MB of grammars on first paint. `ssr: false` keeps it client-only
// — the server emits a plain <pre><code> which the client upgrades
// after mount.
const CodeBlock = dynamic(() => import('@/components/markdown/CodeBlock'), {
  ssr: false,
  loading: () => (
    <pre className="my-3 overflow-x-auto rounded-lg border border-white/[0.06] bg-slate-900/60 p-4 font-mono text-[13px] text-slate-300">
      <code>Đang tải trình highlight…</code>
    </pre>
  ),
});

/** Languages we expose in the picker. Kept short on purpose — the
 *  Markdown CodeBlock component supports more, but the editor picker
 *  only shows the ones a study-notes user is likely to write. */
export const NOTE_CODE_LANGS = [
  { value: '', label: 'Plain text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'tsx', label: 'TSX' },
  { value: 'jsx', label: 'JSX' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'css', label: 'CSS' },
  { value: 'html', label: 'HTML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'yaml', label: 'YAML' },
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
          commands.toggleNode(this.name, 'paragraph', attributes),
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
      <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-slate-900/60">
        {isEditable && (
          <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] bg-slate-900/40 px-2 py-1">
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <Code className="h-3 w-3" />
              <select
                value={language}
                onChange={(e) => updateAttributes({ language: e.target.value })}
                className="rounded border border-white/10 bg-transparent px-1 py-0.5 text-[11px] text-slate-300 focus:outline-none"
                aria-label="Ngôn ngữ"
              >
                {NOTE_CODE_LANGS.map((l) => (
                  <option key={l.value} value={l.value} className="bg-slate-900">{l.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
        <CodeBlock code={code} language={language || undefined} />
      </div>
    </NodeViewWrapper>
  );
}
