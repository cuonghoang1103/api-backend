'use client';

// NoteCallout — a simple block-level admonition (tip / note / warning).
// Uses a custom Tiptap node so it serialises to stable JSON across
// re-opens and round-trips cleanly through the existing
// contentJson / contentHtml pipeline.
//
// Storage shape: { type: "callout", attrs: { kind: "tip"|"note"|"warning" }, content: [...] }

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewContent, type NodeViewProps } from '@tiptap/react';
import { Lightbulb, Info, AlertTriangle, Trash2 } from 'lucide-react';

export type CalloutKind = 'tip' | 'note' | 'warning';

const KIND_META: Record<CalloutKind, { label: string; Icon: typeof Info; ring: string; bg: string; text: string }> = {
  tip:     { label: 'Mẹo',      Icon: Lightbulb,     ring: 'border-teal-500/40',     bg: 'bg-teal-100 dark:bg-teal-500/10',     text: 'text-teal-700 dark:text-teal-200' },
  note:    { label: 'Ghi chú',  Icon: Info,          ring: 'border-sky-500/40',      bg: 'bg-sky-500/10',      text: 'text-sky-200' },
  warning: { label: 'Cảnh báo', Icon: AlertTriangle, ring: 'border-amber-500/50',    bg: 'bg-amber-500/10',    text: 'text-amber-200' },
};

export const NoteCallout = Node.create({
  name: 'callout',
  group: 'block',
  defining: true,
  content: 'block+',

  addAttributes() {
    return {
      kind: {
        default: 'note',
        parseHTML: (el) => (el.getAttribute('data-kind') as CalloutKind | null) ?? 'note',
        renderHTML: (attrs) => ({ 'data-kind': attrs.kind }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'aside[data-type="callout"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['aside', mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CalloutView);
  },

  addCommands() {
    return {
      setCallout:
        (attrs?: { kind?: CalloutKind }) =>
        ({ commands }: { commands: any }) =>
          commands.wrapIn(this.name, attrs),
      toggleCallout:
        (attrs?: { kind?: CalloutKind }) =>
        ({ chain, state }: { chain: any; state: any }) => {
          // toggleWrap(typeOrName, attrs?) only takes 2 args — it can't
          // fall back to a paragraph on the second click. Implement the
          // toggle by hand: if we're already inside a callout of the
          // requested kind, lift it; otherwise wrap with the new kind.
          const { $from } = state.selection;
          const inCallout = $from.node(-1)?.type?.name === 'callout';
          if (inCallout) {
            return chain().focus().lift(this.name).run();
          }
          return chain().focus().wrapIn(this.name, attrs ?? {}).run();
        },
      deleteCallout:
        () =>
        ({ commands }: { commands: any }) =>
          commands.deleteNode(this.name),
    } as Partial<Record<string, (...args: any[]) => any>>;
  },
});

export default NoteCallout;

// Module augmentation omitted — Tiptap auto-infers from addCommands().

function CalloutView({ node, updateAttributes, editor }: NodeViewProps) {
  const kind = ((node.attrs as { kind?: CalloutKind }).kind ?? 'note') as CalloutKind;
  const meta = KIND_META[kind] ?? KIND_META.note;
  const isEditable = editor.isEditable;

  return (
    <NodeViewWrapper as="aside" data-type="callout" data-kind={kind} className={`my-3 flex gap-3 rounded-lg border ${meta.ring} ${meta.bg} p-3`}>
      <div className={`mt-0.5 shrink-0 ${meta.text}`} aria-hidden="true">
        <meta.Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className={`mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider ${meta.text}`}>
          {isEditable ? (
            <select
              value={kind}
              onChange={(e) => updateAttributes({ kind: e.target.value as CalloutKind })}
              className="bg-transparent text-current focus:outline-none"
              aria-label="Loại callout"
            >
              {(Object.keys(KIND_META) as CalloutKind[]).map((k) => (
                <option key={k} value={k} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                  {KIND_META[k].label}
                </option>
              ))}
            </select>
          ) : (
            meta.label
          )}
          {isEditable && (
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteNode('callout').run()}
              aria-label="Xóa callout"
              title="Xóa callout"
              className="ml-auto flex items-center gap-1 rounded px-1.5 py-0.5 text-current opacity-60 hover:bg-red-500/20 hover:text-red-200 hover:opacity-100"
            >
              <Trash2 className="h-3 w-3" />
              <span>Xóa</span>
            </button>
          )}
        </div>
        <NodeViewContent className="note-prose-callout" />
      </div>
    </NodeViewWrapper>
  );
}
