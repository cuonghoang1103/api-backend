/**
 * CTW K-3b — lược đồ TipTap PHÍA MÁY CHỦ cho đồng soạn thảo Docs.
 *
 * Phải khớp TỪNG THUỘC TÍNH với RichEditor chế độ `docs` (frontend/src/components/work/RichEditor.tsx): Yjs chỉ giữ thuộc
 * tính mà lược đồ khai báo, nên một attr thiếu ở đây sẽ RƠI khi nội dung đi qua JSON → Yjs → JSON (vd `alt` của ảnh
 * sơ đồ `ctw-diagram:…`, `language` của khối Mermaid, `colspan/colwidth` của ô bảng). Chỉ có lược đồ/serialize, không
 * NodeView (React thuộc về trình duyệt).
 *
 * Kiểm bằng test: src/services/work/collab.test.ts ("giữ nguyên ảnh, Mermaid, sơ đồ nhúng, bảng").
 */

import { Mark, Node, getSchema, mergeAttributes, type Extensions } from '@tiptap/core';
import type { Schema } from '@tiptap/pm/model';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';

/** @nhắc tên — y hệt node `mention` của RichEditor (backend notify.ts đọc attrs.id / attrs.label). */
export const CollabMention = Node.create({
  name: 'mention',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,
  addAttributes() {
    return {
      id: { default: null, parseHTML: (el) => el.getAttribute('data-id'), renderHTML: (a) => ({ 'data-id': a.id }) },
      label: { default: '', parseHTML: (el) => el.getAttribute('data-label'), renderHTML: (a) => ({ 'data-label': a.label }) },
    };
  },
  parseHTML: () => [{ tag: 'span[data-mention]' }],
  renderHTML({ node, HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-mention': '', class: 'w-mention' }), `@${node.attrs.label}`];
  },
  renderText: ({ node }) => `@${node.attrs.label}`,
});

/**
 * K19/K7: neo bình luận vào đoạn chữ. Mark thường (không chồng nhau — `excludes` mặc định): neo mới đè lên đúng vùng
 * đó thay neo cũ. `id` = anchorId của work_page_anchors. Xuất docx/pdf/markdown bỏ qua mark lạ ⇒ không lộ ra tài liệu.
 */
export const CommentAnchor = Mark.create({
  name: 'commentAnchor',
  inclusive: false,
  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-comment-anchor'),
        renderHTML: (a) => (a.id ? { 'data-comment-anchor': a.id } : {}),
      },
    };
  },
  parseHTML: () => [{ tag: 'span[data-comment-anchor]' }],
  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'w-anchor' }), 0];
  },
});

export const collabExtensions: Extensions = [
  StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
  Image.configure({ inline: false, allowBase64: false }),
  Link.configure({ openOnClick: false, autolink: false }),
  TaskList,
  TaskItem.configure({ nested: true }),
  CollabMention,
  CommentAnchor,
  Table.configure({ resizable: false }),
  TableRow,
  TableHeader,
  TableCell,
];

let cached: Schema | null = null;
export function collabSchema(): Schema {
  cached ??= getSchema(collabExtensions);
  return cached;
}
