'use client';

// NoteCodeBlock — custom Tiptap node that renders a code block via
// the shared <CodeBlock /> component (Shiki, VSCode-grade colors) for
// the read-only "view" state, and switches to a plain contenteditable
// surface powered by Tiptap's <NodeViewContent /> when the user
// focuses the block to edit.
//
// Why we don't use a plain <NodeViewContent /> for everything:
// syntax highlighting via Shiki requires read-only HTML output
// (dangerouslySetInnerHTML of pre-highlighted spans). If the block
// is contenteditable, the user types into the underlying <pre><code>
// text node directly and Shiki can't intercept keystrokes — so the
// highlighted overlay would drift out of sync on every keystroke.
// The accepted pattern (Notion, Linear, GitHub) is two states:
//
//   • VIEW:  Shiki-highlighted HTML, read-only.
//   • EDIT:  Plain monospace surface, contenteditable. On blur or
//            Escape, we snap back to VIEW.
//
// Replaces StarterKit's bundled lowlight-backed code block so we
// never ship two highlighting libraries.

import { Node, mergeAttributes } from '@tiptap/core';
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
  type NodeViewProps,
} from '@tiptap/react';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
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
    // Match Tiptap's default `pre` parse so round-trips through
    // HTML work; `data-type="code-block"` is set by renderHTML so
    // we can disambiguate from regular <pre> blocks if needed.
    return [{ tag: 'pre', preserveWhitespace: 'full', getAttrs: (node) => {
      if (!(node instanceof HTMLElement)) return false;
      // Accept any <pre> as a code block — the editor previously
      // failed to round-trip when the data-type attr was missing.
      return {};
    } }];
  },

  renderHTML({ HTMLAttributes, node }) {
    const lang = (node.attrs as { language?: string }).language;
    return [
      'pre',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'code-block',
        ...(lang ? { 'data-language': lang } : {}),
      }),
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

function CodeBlockView({ node, updateAttributes, editor, getPos }: NodeViewProps) {
  const code: string = node.textContent;
  const language: string = (node.attrs as { language?: string }).language ?? '';
  const isEditable = editor.isEditable;

  // Two-mode UI: VIEW (Shiki highlighted, read-only) ↔ EDIT (plain
  // monospace contenteditable via Tiptap's NodeViewContent). We
  // default to VIEW so the highlighted HTML is the first thing the
  // user sees; switching to EDIT happens on click/Enter and back to
  // VIEW on Escape / blur / click outside. The previous version
  // rendered Shiki inside the contenteditable surface — the user
  // reported "I delete one character and the whole block is
  // removed", because Tiptap saw the uneditable DOM and treated
  // every keystroke as a block-level delete operation.
  const [isEditing, setIsEditing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // NOTE: An earlier version of this component had a useEffect
  // that called setIsEditing(false) whenever the node's text length
  // crossed zero or the language changed. That looked harmless
  // ("reset edit mode if the node becomes empty / switched lang")
  // but it had a nasty side effect: Tiptap re-renders the NodeView
  // on every transaction, and `code` changes on every keystroke.
  // `code.length === 0` flips between true and false as the user
  // types back and forth across a 1-character boundary, causing
  // edit mode to flip off in the middle of typing — the user would
  // lose focus mid-keystroke and see the Shiki-highlighted HTML
  // appear and disappear, sometimes only after a hard reload. The
  // fix is to NOT auto-exit edit mode based on content changes.
  // Edit mode should only flip on explicit user actions (click
  // outside, Escape, language switch, or delete-block).
  //
  // We intentionally call setIsEditing(false) on language change
  // because the user is selecting a new value from a dropdown and
  // is unlikely to want to keep typing in the old mode.
  useEffect(() => {
    setIsEditing(false);
  }, [language]);

  const enterEdit = useCallback(() => {
    if (!isEditable) return;
    setIsEditing(true);
  }, [isEditable]);

  const exitEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  // Native keydown listener on the wrapper DOM node. The
  // wrapper's React `onKeyDown` prop is bound to the wrapper's
  // DOM node, but React's synthetic events are attached at the
  // root and dispatched via delegation. In practice the events
  // DO bubble up, but ProseMirror (the Tiptap view underneath)
  // attaches its own listeners on the editable DOM tree and is
  // known to call stopPropagation in some cases — e.g. on Tab /
  // Arrow keys, on Escape inside certain node types — so the
  // wrapper-level React handler can miss the event entirely.
  // The user reported 'I press Escape and the code block won't
  // exit edit mode' — so we attach a NATIVE keydown listener
  // directly on the wrapper DOM node via ref + useEffect. This
  // bypasses both React's synthetic dispatch and ProseMirror's
  // capture phase. Same pattern Notion / Linear use for
  // editor-wide shortcuts.
  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (!isEditing) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        // stopPropagation so the editor's other listeners (e.g.
        // SlashMenu's window-level Esc listener on line 159)
        // don't also fire on this same Escape. The user is
        // exiting edit mode, not closing a popup menu.
        e.stopPropagation();
        exitEdit();
      }
    };
    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
    };
  }, [isEditing, exitEdit]);

  // Toggle on click. Click on the toolbar (language picker / delete
  // button) must NOT trigger edit mode — those stopPropagation so
  // the click handler doesn't see them.
  const onContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Only act on the background / pre area, not on toolbar
      // children that handle their own clicks.
      if (!isEditable) return;
      if (isEditing) return; // already editing; let selection work
      const target = e.target as HTMLElement;
      // The toolbar row has data-noedit; ignore clicks on it.
      if (target.closest('[data-noedit]')) return;
      enterEdit();
    },
    [isEditable, isEditing, enterEdit],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isEditing) return;
      // Escape exits edit mode (Tiptap preserves the content
      // because NodeViewContent owns the DOM).
      if (e.key === 'Escape') {
        e.preventDefault();
        exitEdit();
      }
    },
    [isEditing, exitEdit],
  );

  // Blur handler: when focus moves OUT of the NodeViewContent
  // contenteditable, drop back to VIEW mode. We detect this by
  // listening to focusout on the wrapper and only fire when the
  // new active element is genuinely outside this block (not just
  // moving to the toolbar / select inside the same wrapper).
  const onWrapperFocusOut = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!isEditing) return;
      // `e.relatedTarget` is a real DOM Node, but TypeScript resolves
      // the bare `Node` identifier in this file to Tiptap's @tiptap/core
      // Node (imported at the top of the file). Use the DOM type via
      // HTMLElement's prototype chain so the .contains() check below
      // typechecks correctly without renaming the Tiptap import.
      const next = e.relatedTarget as HTMLElement | null;
      if (next && wrapperRef.current?.contains(next)) {
        // Focus is still inside this block (toolbar, select, etc.).
        // Stay in edit mode.
        return;
      }
      exitEdit();
    },
    [isEditing, exitEdit],
  );

  // Delete-when-empty handling: if the user empties the code block
  // and then presses Backspace once more, Tiptap's default behaviour
  // is to remove the now-empty node. We let it — that's the
  // expected Notion / Linear behaviour.

  return (
    <NodeViewWrapper
      // Outer wrapper. Tabindex=0 makes the block focusable so the
      // user can click into it; the actual editable surface is
      // mounted by NodeViewContent below when isEditing.
      as="div"
      className="my-3"
      data-type="code-block"
      onClick={onContainerClick}
      onKeyDown={onKeyDown}
      onFocusOut={onWrapperFocusOut}
      // The wrapper itself is not contenteditable; NodeViewContent
      // mounts its own contentEditable tree inside.
      ref={wrapperRef}
    >
      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-slate-900/60">
        {isEditable && (
          <div
            data-noedit="1"
            className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-slate-900/40 px-2 py-1"
          >
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-500">
              <Code className="h-3 w-3" />
              <select
                value={language}
                onChange={(e) => updateAttributes({ language: e.target.value })}
                // The picker should be usable without entering edit
                // mode; clicking it would otherwise set isEditing and
                // steal focus. stopPropagation keeps the container
                // click handler from firing.
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="rounded border border-slate-300 dark:border-white/10 bg-transparent px-1 py-0.5 text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none"
                aria-label="Ngôn ngữ"
              >
                {NOTE_CODE_LANGS.map((l) => (
                  <option key={l.value} value={l.value} className="bg-white dark:bg-slate-900">{l.label}</option>
                ))}
              </select>
              {isEditing && (
                <span className="ml-1 italic text-[10px] text-slate-400 dark:text-slate-500">
                  đang sửa — Esc để thoát
                </span>
              )}
            </div>
            <button
              type="button"
              data-noedit="1"
              onClick={(e) => {
                e.stopPropagation();
                editor.chain().focus().deleteNode('codeBlock').run();
              }}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="Xóa code block"
              title="Xóa code block"
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] text-slate-500 dark:text-slate-500 hover:bg-red-500/15 hover:text-red-300"
            >
              <Trash2 className="h-3 w-3" />
              <span>Xóa</span>
            </button>
          </div>
        )}
        {isEditing ? (
          // EDIT mode — Tiptap owns the contenteditable <pre><code>.
          // We render NodeViewContent as `<pre>` so the editable tree
          // matches the schema, and let the global .note-prose styles
          // (set in globals.css) take over for monospace layout. The
          // user sees plain monospace text while typing — Shiki will
          // re-highlight on blur when we snap back to VIEW mode.
          <pre
            // The contenteditable surface is mounted by
            // NodeViewContent below; this <pre> is just a structural
            // shell that matches the schema so the document looks
            // the same in both modes.
            className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900/40"
          >
            <NodeViewContent as="code" className="block whitespace-pre-wrap break-words" />
          </pre>
        ) : (
          // VIEW mode — Shiki highlighted, read-only. Click on the
          // rendered surface enters EDIT mode (see onContainerClick).
          <CodeBlock code={code} language={language || undefined} />
        )}
      </div>
    </NodeViewWrapper>
  );
}
