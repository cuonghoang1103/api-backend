'use client';

/**
 * Trình soạn thảo cho mô tả thẻ + bình luận (TipTap, lưu JSON).
 *
 * @nhắc tên tự viết: repo không có @tiptap/extension-mention, và cài thêm
 * gói vào node_modules dùng chung giữa các worktree là rủi ro. Node `mention`
 * lưu attrs { id: userId, label } — backend (services/work/notify.ts) đọc
 * đúng hai trường này để gửi thông báo WORK_MENTION.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Bold, Code, Italic, List, ListChecks, ListOrdered, Link2, Quote, SquareCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, type TiptapDoc, type WorkUser } from '@/lib/work-api';
import { UserAvatar, WorkPortal } from './ui';

const Mention = Node.create({
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

interface MentionState { query: string; from: number; to: number; left: number; top: number }

function findMention(editor: Editor): MentionState | null {
  const { state, view } = editor;
  const { selection } = state;
  if (!selection.empty) return null;
  const $from = selection.$from;
  const textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - 40), $from.parentOffset, undefined, '￼');
  const m = /(?:^|\s)@([\p{L}\p{N}_.-]{0,30})$/u.exec(textBefore);
  if (!m) return null;
  const from = selection.from - m[1].length - 1;
  const coords = view.coordsAtPos(selection.from);
  return { query: m[1], from, to: selection.from, left: coords.left, top: coords.bottom + 4 };
}

export interface RichEditorProps {
  value: TiptapDoc | null | undefined;
  onChange?: (doc: TiptapDoc, isEmpty: boolean) => void;
  editable?: boolean;
  placeholder?: string;
  members?: WorkUser[];
  autoFocus?: boolean;
  /** ⌘/Ctrl + Enter */
  onSubmit?: () => void;
  onEscape?: () => void;
  minHeight?: number;
  toolbar?: boolean;
  className?: string;
  editorRef?: (e: Editor | null) => void;
}

export default function RichEditor({
  value, onChange, editable = true, placeholder = 'Write something…', members = [], autoFocus, onSubmit, onEscape,
  minHeight = 80, toolbar = true, className, editorRef,
}: RichEditorProps) {
  const [mention, setMention] = useState<MentionState | null>(null);
  const [hi, setHi] = useState(0);
  const mentionRef = useRef<MentionState | null>(null);
  mentionRef.current = mention;

  const matches = useMemo(() => {
    if (!mention) return [];
    const q = mention.query.toLowerCase();
    return members.filter((m) => `${m.username} ${m.fullName ?? ''} ${m.displayName ?? ''}`.toLowerCase().includes(q)).slice(0, 8);
  }, [mention, members]);
  const matchesRef = useRef(matches);
  matchesRef.current = matches;
  const hiRef = useRef(hi);
  hiRef.current = hi;
  const submitRef = useRef(onSubmit);
  submitRef.current = onSubmit;
  const escapeRef = useRef(onEscape);
  escapeRef.current = onEscape;
  // Callback của TipTap bị chốt lúc tạo editor — đọc props mới qua ref.
  const membersRef = useRef(members);
  membersRef.current = members;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editorInstance = useRef<Editor | null>(null);
  const pick = (ed: Editor, user: WorkUser) => {
    const m = mentionRef.current;
    if (!m) return;
    ed.chain().focus().insertContentAt({ from: m.from, to: m.to }, [
      { type: 'mention', attrs: { id: String(user.id), label: userName(user) } },
      { type: 'text', text: ' ' },
    ]).run();
    setMention(null);
  };

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    content: (value as object) ?? '',
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: !editable, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' } }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Mention,
    ],
    editorProps: {
      attributes: { class: cn('w-prose', editable && 'px-3 py-2.5') },
      handleKeyDown: (_view, event) => {
        const list = matchesRef.current;
        if (mentionRef.current && list.length) {
          if (event.key === 'ArrowDown') { setHi((h) => (h + 1) % list.length); return true; }
          if (event.key === 'ArrowUp') { setHi((h) => (h - 1 + list.length) % list.length); return true; }
          if (event.key === 'Enter' || event.key === 'Tab') {
            if (editorInstance.current) pick(editorInstance.current, list[hiRef.current] ?? list[0]);
            return true;
          }
          if (event.key === 'Escape') { setMention(null); return true; }
        }
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && submitRef.current) { submitRef.current(); return true; }
        if (event.key === 'Escape' && escapeRef.current) { escapeRef.current(); return true; }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChangeRef.current?.(ed.getJSON() as TiptapDoc, ed.isEmpty);
      const m = membersRef.current.length ? findMention(ed) : null;
      setMention(m);
      if (m?.query !== mentionRef.current?.query) setHi(0);
    },
    onSelectionUpdate: ({ editor: ed }) => {
      if (!mentionRef.current) return;
      setMention(membersRef.current.length ? findMention(ed) : null);
    },
    onBlur: () => setTimeout(() => setMention(null), 150),
  });

  editorInstance.current = editor;

  useEffect(() => {
    editorRef?.(editor ?? null);
    return () => editorRef?.(null);
  }, [editor, editorRef]);

  useEffect(() => {
    if (editor && autoFocus) editor.commands.focus('end');
  }, [editor, autoFocus]);

  // Nội dung đổi từ bên ngoài (thẻ khác, người khác vừa sửa) khi KHÔNG đang gõ.
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const cur = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(value ?? { type: 'doc', content: [] });
    if (cur !== next) editor.commands.setContent((value as object) ?? '', false);
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  const btn = (active: boolean, onClick: () => void, Icon: typeof Bold, title: string) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className={cn('flex h-6 w-6 items-center justify-center rounded-[4px] text-[var(--w-text-3)] hover:bg-[var(--w-hover)] hover:text-[var(--w-text)]', active && 'bg-[var(--w-active)] text-[var(--w-text)]')}
    >
      <Icon size={13} />
    </button>
  );

  return (
    <div className={cn(editable && 'rounded-[6px] border border-[var(--w-border-strong)] bg-[var(--w-panel)] focus-within:border-[var(--w-accent-border)] focus-within:shadow-[0_0_0_3px_var(--w-accent-soft)]', className)}>
      {editable && toolbar && editor && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--w-border)] px-1.5 py-1">
          {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), Bold, 'Bold (⌘B)')}
          {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), Italic, 'Italic (⌘I)')}
          {btn(editor.isActive('code'), () => editor.chain().focus().toggleCode().run(), Code, 'Inline code')}
          <span className="mx-1 h-4 w-px bg-[var(--w-border)]" />
          {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), List, 'Bulleted list')}
          {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), ListOrdered, 'Numbered list')}
          {btn(editor.isActive('taskList'), () => editor.chain().focus().toggleTaskList().run(), ListChecks, 'Checklist')}
          <span className="mx-1 h-4 w-px bg-[var(--w-border)]" />
          {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), Quote, 'Quote')}
          {btn(editor.isActive('codeBlock'), () => editor.chain().focus().toggleCodeBlock().run(), SquareCode, 'Code block')}
          {btn(editor.isActive('link'), () => {
            if (editor.isActive('link')) { editor.chain().focus().unsetLink().run(); return; }
            const url = window.prompt('Link URL');
            if (url && /^https?:\/\//i.test(url)) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }, Link2, 'Link')}
        </div>
      )}
      <div style={editable ? { minHeight } : undefined}>
        <EditorContent editor={editor} />
      </div>

      {mention && matches.length > 0 && editor && (
        <WorkPortal>
          <div
            style={{ position: 'fixed', left: Math.min(mention.left, window.innerWidth - 248), top: mention.top, width: 240, boxShadow: 'var(--w-shadow-pop)' }}
            className="z-[90] rounded-[8px] bg-[var(--w-raised)] p-1"
          >
            {matches.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(editor, m); }}
                onMouseEnter={() => setHi(i)}
                className={cn('flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px]', i === hi && 'bg-[var(--w-hover)]')}
              >
                <UserAvatar user={m} size={18} />
                <span className="truncate">{userName(m)}</span>
                <span className="ml-auto truncate text-[11px] text-[var(--w-text-3)]">@{m.username}</span>
              </button>
            ))}
          </div>
        </WorkPortal>
      )}
    </div>
  );
}

/** Chỉ đọc — hiển thị mô tả/bình luận đã lưu. */
export function RichView({ value, className }: { value: TiptapDoc | null | undefined; className?: string }) {
  return <RichEditor value={value} editable={false} toolbar={false} className={className} />;
}

export function isDocEmpty(doc: TiptapDoc | null | undefined): boolean {
  if (!doc?.content?.length) return true;
  const walk = (n: unknown): boolean => {
    const node = n as { type?: string; text?: string; content?: unknown[] };
    if (node.type === 'mention') return false;
    if (typeof node.text === 'string' && node.text.trim()) return false;
    return !(node.content ?? []).some((c) => !walk(c));
  };
  return walk(doc);
}
