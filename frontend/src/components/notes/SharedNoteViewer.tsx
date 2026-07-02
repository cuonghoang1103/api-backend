'use client';

/**
 * SharedNoteViewer - Read-only viewer for shared notes
 *
 * Mirrors the NoteEditor layout and styling but is read-only.
 * Uses TipTap's EditorContent directly with the same extensions
 * so all rich content (headings, code blocks, tables, etc.) renders correctly.
 */

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import NoteCodeBlock from '@/components/notes/extensions/NoteCodeBlock';
import NoteCallout from '@/components/notes/extensions/NoteCallout';
import NoteMath from '@/components/notes/extensions/NoteMath';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import NoteTableOfContents from '@/components/notes/NoteTableOfContents';

interface SharedNoteViewerProps {
  title: string;
  contentJson: Record<string, unknown> | null;
  contentHtml: string | null;
  isFavorite?: boolean;
  needsReview?: boolean;
  isArchived?: boolean;
}

export default function SharedNoteViewer({
  title,
  contentJson,
  contentHtml,
  isFavorite = false,
  needsReview = false,
  isArchived = false,
}: SharedNoteViewerProps) {
  const editor = useEditor({
    editable: false, // Read-only
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      NoteCodeBlock,
      NoteCallout,
      NoteMath,
      TaskList.configure({ HTMLAttributes: { class: 'note-task-list' } }),
      TaskItem.configure({ nested: true, HTMLAttributes: { class: 'note-task-item' } }),
      Table.configure({ resizable: false, HTMLAttributes: { class: 'note-table' } }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: contentJson ?? '',
    editorProps: {
      attributes: {
        class: 'note-prose focus:outline-none',
        spellcheck: 'false',
      },
    },
  });

  return (
    <div className="w-full px-4 sm:px-6 py-6">
      {/* Title */}
      <h1 className="mb-4 text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
        {title || 'Không có tiêu đề'}
      </h1>

      {/* Flag badges */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {isFavorite && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-100 px-2.5 py-1 text-[11px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            Yêu thích
          </span>
        )}
        {needsReview && (
          <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/15 px-2.5 py-1 text-[11px] font-medium text-rose-100">
            Cần ôn
          </span>
        )}
        {isArchived && (
          <span className="inline-flex items-center gap-1 rounded-full border border-slate-400/40 bg-slate-400/15 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300">
            Lưu trữ
          </span>
        )}
      </div>

      <div className="mb-4 h-px w-full bg-slate-100 dark:bg-white/[0.06]" />

      {/* Table of contents */}
      {editor && <NoteTableOfContents editor={editor} />}

      {/* Body */}
      <EditorContent editor={editor} />
    </div>
  );
}
