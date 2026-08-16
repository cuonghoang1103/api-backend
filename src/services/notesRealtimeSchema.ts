import { Node, mergeAttributes, type Extensions } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

// Server-safe versions of the three custom Notes nodes. They deliberately
// contain only schema/serialization behavior: React NodeViews belong in the
// browser and must never be imported by the backend process.
const RealtimeCodeBlock = Node.create({
  name: 'codeBlock',
  group: 'block',
  code: true,
  defining: true,
  marks: '',
  content: 'text*',
  addAttributes() {
    return { language: { default: '' } };
  },
  parseHTML() {
    return [{ tag: 'pre', preserveWhitespace: 'full' }];
  },
  renderHTML({ HTMLAttributes, node }) {
    const language = String(node.attrs.language ?? '');
    return [
      'pre',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'code-block',
        ...(language ? { 'data-language': language } : {}),
      }),
      ['code', {}, 0],
    ];
  },
});

const RealtimeCallout = Node.create({
  name: 'callout',
  group: 'block',
  defining: true,
  content: 'block+',
  addAttributes() {
    return {
      kind: {
        default: 'note',
        parseHTML: (element) => element.getAttribute('data-kind') ?? 'note',
        renderHTML: (attributes) => ({ 'data-kind': attributes.kind }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'aside[data-type="callout"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['aside', mergeAttributes(HTMLAttributes, { 'data-type': 'callout' }), 0];
  },
});

const RealtimeMath = Node.create({
  name: 'math',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,
  content: 'text*',
  addAttributes() {
    return { mode: { default: 'inline' } };
  },
  parseHTML() {
    return [
      { tag: 'span[data-type="math-inline"]' },
      { tag: 'div[data-type="math-block"]' },
    ];
  },
  renderHTML({ HTMLAttributes, node }) {
    const block = node.attrs.mode === 'block';
    return [
      block ? 'div' : 'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': block ? 'math-block' : 'math-inline',
      }),
      0,
    ];
  },
});

/** The exact persisted schema used by the Notes editor. */
export const noteRealtimeExtensions: Extensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    codeBlock: false,
  }),
  Image.configure({ inline: false, allowBase64: false }),
  RealtimeCodeBlock,
  RealtimeCallout,
  RealtimeMath,
  TaskList,
  TaskItem.configure({ nested: true }),
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
];

