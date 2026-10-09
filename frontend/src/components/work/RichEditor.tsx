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
import { EditorContent, NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, useEditor, type Editor, type NodeViewProps } from '@tiptap/react';
import type { EditorView } from '@tiptap/pm/view';
import Image from '@tiptap/extension-image';
import { toast } from 'sonner';
import { Node, mergeAttributes } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { common, createLowlight } from 'lowlight';
import {
  Bold, Code, Heading2, Heading3, Italic, List, ListChecks, ListOrdered, Link2, Quote, SquareCode, Table2, Rows3, Columns3, Trash2,
  ImagePlus, Workflow,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, type TiptapDoc, type WorkUser } from '@/lib/work-api';
import { UserAvatar, WorkPortal, khungFixed } from './ui';
import { IMAGE_SRC_RE, MAX_IMAGE_BYTES, renderMermaidSvg, workDocs3aApi } from '@/lib/work-docs3a-api';

/** ~35 ngôn ngữ phổ biến (java, ts, sql, bash, yaml, json…) — tạo một lần cho cả trang. */
const LOWLIGHT = createLowlight(common);

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

/**
 * Bảng cho trang TÀI LIỆU (S2a). Bọc <table> trong một div cuộn ngang riêng — bảng
 * rộng (SRS, RTM…) cuộn trong khung của nó, trang không bị tràn ngang ở 390px.
 * Không bật resizable: nút kéo cột cần CSS riêng và đổi toDOM thành nodeView.
 */
const DocTable = Table.extend({
  renderHTML(props) {
    const spec = this.parent?.(props);
    // UX-E: chế độ CHỈ ĐỌC — khung cuộn ngang phải tới được bằng bàn phím (Tab rồi ←/→; axe
    // scrollable-region-focusable). Khi đang soạn thì KHÔNG: tabindex bên trong contenteditable
    // giành tiêu điểm khỏi editor lúc bấm vào ô. Đọc `options.editable` (view chưa có lúc dựng schema).
    const readOnly = this.editor?.options.editable === false;
    const attrs = readOnly ? { class: 'w-table-wrap', tabindex: '0', role: 'region', 'aria-label': 'Table — scroll sideways' } : { class: 'w-table-wrap' };
    return ['div', attrs, spec] as unknown as ReturnType<NonNullable<typeof this.parent>>;
  },
}).configure({ resizable: false, HTMLAttributes: { class: 'w-table' } });

// ─── CTW đợt 3A (A8 + C26): ảnh + sơ đồ Mermaid ───────────────────

/** Ảnh khối. Chỉ vẽ nguồn an toàn: ảnh đã tải lên dự án hoặc https — nút do JSON lạ đưa vào với src khác bị bỏ trống. */
const DocImage = Image.extend({
  renderHTML({ HTMLAttributes }) {
    const src = String(HTMLAttributes.src ?? '');
    const ok = IMAGE_SRC_RE.test(src) || /^https:\/\//i.test(src);
    return ['img', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { src: ok ? src : '', loading: 'lazy', draggable: 'false' })];
  },
}).configure({ inline: false, allowBase64: false, HTMLAttributes: { class: 'w-doc-img' } });

const isDark = () => typeof document !== 'undefined' && document.documentElement.classList.contains('theme-dark');

/** Sơ đồ vẽ từ mã nguồn (chờ 400 ms ngừng gõ). Lỗi cú pháp ⇒ dòng báo lỗi ngắn, mã nguồn vẫn còn ở dưới. */
function MermaidPreview({ source }: { source: string }) {
  const [svg, setSvg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => {
      if (!source.trim()) { setSvg(null); setErr(null); return; }
      renderMermaidSvg(source, isDark())
        .then((x) => { if (alive) { setSvg(x); setErr(null); } })
        .catch((e: unknown) => { if (alive) { setErr(String((e as Error)?.message ?? e).split('\n')[0].slice(0, 160)); } });
    }, 400);
    return () => { alive = false; clearTimeout(t); };
  }, [source]);
  if (err) return <p className="mb-1 text-[12px] text-[var(--w-red)]" contentEditable={false}>Diagram error: {err}</p>;
  if (!svg) return null;
  // SVG do mermaid sinh với securityLevel 'strict' (không HTML/script từ mã nguồn).
  return <div className="w-mermaid" contentEditable={false} data-testid="mermaid-diagram" dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** Khối code: ngôn ngữ "mermaid" ⇒ vẽ sơ đồ phía trên; khi chỉ xem thì ẩn mã nguồn (bấm "Show source" để xem). */
function CodeBlockView({ node, editor }: NodeViewProps) {
  const mermaid = String(node.attrs.language ?? '').toLowerCase() === 'mermaid';
  const [showSource, setShowSource] = useState(false);
  const editable = editor.isEditable;
  return (
    <NodeViewWrapper className={cn('w-codeblock', mermaid && 'w-codeblock-mermaid')}>
      {mermaid && <MermaidPreview source={node.textContent} />}
      {mermaid && !editable && (
        <button type="button" contentEditable={false} className="mb-1 text-[11.5px] text-[var(--w-text-3)] hover:text-[var(--w-text)]" onClick={() => setShowSource((v) => !v)}>
          {showSource ? 'Hide source' : 'Show source'}
        </button>
      )}
      <pre className={cn('w-code', mermaid && !editable && !showSource && 'hidden')}>
        <NodeViewContent as="code" className={node.attrs.language ? `language-${node.attrs.language}` : undefined} />
      </pre>
    </NodeViewWrapper>
  );
}

const CodeBlock = CodeBlockLowlight.extend({ addNodeView() { return ReactNodeViewRenderer(CodeBlockView); } });

const MERMAID_STARTER = 'flowchart TD\n  A[Start] --> B{Valid?}\n  B -- Yes --> C[Save]\n  B -- No --> D[Show error]';

function imageFiles(list: FileList | null | undefined): File[] {
  return Array.from(list ?? []).filter((f) => /^image\/(png|jpe?g|gif|webp)$/i.test(f.type));
}

/** Tải ảnh lên dự án rồi chèn tại `pos` (mặc định: chỗ con trỏ). Mỗi ảnh một toast. */
async function insertImages(view: EditorView, projectId: number, files: File[], pos?: number) {
  for (const f of files) {
    if (f.size > MAX_IMAGE_BYTES) { toast.error(`${f.name || 'Image'} is larger than 10 MB`); continue; }
    const id = toast.loading(`Uploading ${f.name || 'image'}…`);
    try {
      const up = await workDocs3aApi.uploadImage(projectId, f, f.name || 'pasted-image.png');
      const node = view.state.schema.nodes.image?.create({ src: up.url, alt: (f.name || '').replace(/\.[a-z0-9]+$/i, '') || null });
      if (!node) throw new Error('This editor cannot hold images');
      // Ảnh là KHỐI: chèn giữa một đoạn chữ sẽ cắt đôi đoạn đó ("Delet" | ảnh | "ed") ⇒ đặt ảnh SAU đoạn đang đứng;
      // đoạn trống thì thay luôn đoạn đó.
      const at = Math.min(pos ?? view.state.selection.from, view.state.doc.content.size);
      const $p = view.state.doc.resolve(at);
      const tr = view.state.tr;
      if ($p.depth > 0 && $p.parent.isTextblock && $p.parent.content.size === 0) tr.replaceWith($p.before(), $p.after(), node);
      else if ($p.depth > 0 && $p.parent.isTextblock) tr.insert($p.after(), node);
      else tr.insert(at, node);
      view.dispatch(tr);
      toast.success('Image added', { id });
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string; error?: { message?: string } } } })?.response?.data;
      toast.error(msg?.message ?? msg?.error?.message ?? (err as Error)?.message ?? 'Could not upload the image', { id });
    }
  }
}

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
  /**
   * Chế độ TÀI LIỆU (trang Docs, S2a): thêm bảng + tiêu đề mức 4 + nút H2/H3/bảng.
   * Nội dung tài liệu (kể cả 36 mẫu) dùng các nút này — mở trang tài liệu bằng
   * editor thường sẽ RƠI bảng. Chốt lúc tạo editor (không đổi giữa chừng).
   */
  docs?: boolean;
  /**
   * CTW đợt 3A: dự án để tải ảnh lên (dán / kéo-thả / nút ảnh). Không truyền ⇒ ảnh vẫn HIỂN THỊ được nhưng không chèn mới.
   */
  projectId?: number;
  /**
   * UX-E: kiểm tra chính tả của trình duyệt khi đang SOẠN (mặc định bật). Chế độ chỉ đọc
   * luôn tắt — chữ tiếng Việt/Anh trong tài liệu từng bị gạch chân chấm đỏ khi chỉ xem.
   */
  spellCheck?: boolean;
}

export default function RichEditor({
  value, onChange, editable = true, placeholder = 'Write something…', members = [], autoFocus, onSubmit, onEscape,
  minHeight = 80, toolbar = true, className, editorRef, docs = false, projectId, spellCheck = true,
}: RichEditorProps) {
  const pidRef = useRef(projectId);
  pidRef.current = projectId;
  const fileRef = useRef<HTMLInputElement>(null);
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
      // Khối code tô màu cú pháp (decoration của ProseMirror ⇒ đúng cả lúc xem lẫn lúc sửa).
      // Không khai ngôn ngữ thì lowlight tự đoán.
      StarterKit.configure({ heading: { levels: docs ? [1, 2, 3, 4] : [1, 2, 3] }, codeBlock: false }),
      CodeBlock.configure({ lowlight: LOWLIGHT, HTMLAttributes: { class: 'w-code' } }),
      // CTW đợt 3A: ảnh có ở MỌI chế độ (mô tả thẻ, bình luận, Docs) — nội dung đã có ảnh vẫn hiện ở chỗ chỉ xem.
      DocImage,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: !editable, autolink: true, HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' } }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Mention,
      ...(docs ? [DocTable, TableRow, TableHeader, TableCell] : []),
    ],
    editorProps: {
      // `spellcheck` ở đây chỉ là giá trị LÚC TẠO (tránh nháy gạch chân). TipTap trải (spread) object này
      // nên không dùng hàm được; đổi sau đó (bật/tắt, sửa ↔ xem) do effect bên dưới đặt thẳng lên DOM.
      attributes: { class: cn('w-prose', editable && 'px-3 py-2.5'), spellcheck: editable && spellCheck ? 'true' : 'false' },
      // CTW đợt 3A: dán / thả ảnh ⇒ tải lên dự án (R2) rồi chèn nút ảnh. Không có dự án ⇒ để trình duyệt xử lý như cũ.
      handlePaste: (view, event) => {
        const files = imageFiles(event.clipboardData?.files);
        if (!files.length || !pidRef.current || !view.editable) return false;
        event.preventDefault();
        void insertImages(view, pidRef.current, files);
        return true;
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false;
        const files = imageFiles((event as DragEvent).dataTransfer?.files);
        if (!files.length || !pidRef.current || !view.editable) return false;
        event.preventDefault();
        const at = view.posAtCoords({ left: (event as DragEvent).clientX, top: (event as DragEvent).clientY })?.pos;
        void insertImages(view, pidRef.current, files, at);
        return true;
      },
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

  // emitUpdate = false: setEditable() của TipTap mặc định BẮN 'update' ⇒ onChange chạy
  // ngay lúc mở dù không ai gõ gì (trang tài liệu tự lưu sinh phiên bản rỗng — bắt được
  // bằng E2E S2a). Chỉ gọi khi thật sự đổi.
  useEffect(() => {
    if (editor && editor.isEditable !== editable) editor.setEditable(editable, false);
  }, [editor, editable]);

  // UX-E: chính tả chỉ khi ĐANG SOẠN và người dùng bật; chỉ đọc luôn tắt (không còn gạch chân chấm đỏ
  // dưới chữ tiếng Việt/Anh khi xem tài liệu). ProseMirror chỉ ghi lại thuộc tính khi giá trị khai trong
  // `attributes` đổi — mà giá trị đó chốt lúc tạo editor — nên đặt thẳng lên DOM là bền.
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    editor.view.dom.setAttribute('spellcheck', editable && spellCheck ? 'true' : 'false');
  }, [editor, editable, spellCheck]);

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
        // UX-E: trang tài liệu dài ⇒ thanh công cụ DÍNH đầu vùng cuộn; luôn xuống dòng khi hẹp (không bị cắt).
        <div className={cn('flex flex-wrap items-center gap-0.5 border-b border-[var(--w-border)] px-1.5 py-1', docs && 'sticky top-0 z-[2] rounded-t-[8px] bg-[var(--w-panel)]')} role="toolbar" aria-label="Formatting">
          {docs && (
            <>
              {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), Heading2, 'Heading')}
              {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), Heading3, 'Subheading')}
              <span className="mx-1 h-4 w-px bg-[var(--w-border)]" />
            </>
          )}
          {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), Bold, 'Bold (⌘B)')}
          {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), Italic, 'Italic (⌘I)')}
          {btn(editor.isActive('code'), () => editor.chain().focus().toggleCode().run(), Code, 'Inline code')}
          <span className="mx-1 h-4 w-px bg-[var(--w-border)]" />
          {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), List, 'Bulleted list')}
          {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), ListOrdered, 'Numbered list')}
          {btn(editor.isActive('taskList'), () => editor.chain().focus().toggleTaskList().run(), ListChecks, 'Checklist')}
          <span className="mx-1 h-4 w-px bg-[var(--w-border)]" />
          {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), Quote, 'Quote')}
          {btn(editor.isActive('codeBlock') && editor.getAttributes('codeBlock').language !== 'mermaid', () => editor.chain().focus().toggleCodeBlock().run(), SquareCode, 'Code block')}
          {/* CTW đợt 3A: sơ đồ Mermaid (UC, ERD, class, sequence…) — khối code ngôn ngữ "mermaid", vẽ ngay trên trang. */}
          {btn(editor.isActive('codeBlock', { language: 'mermaid' }), () => {
            if (editor.isActive('codeBlock', { language: 'mermaid' })) return;
            // Như ảnh: khối sơ đồ đặt SAU đoạn đang đứng (không cắt đôi chữ); đoạn trống thì thay luôn.
            const $f = editor.state.selection.$from;
            const block = { type: 'codeBlock', attrs: { language: 'mermaid' }, content: [{ type: 'text', text: MERMAID_STARTER }] };
            if ($f.depth > 0 && $f.parent.isTextblock && $f.parent.content.size === 0) editor.chain().focus().insertContentAt({ from: $f.before(), to: $f.after() }, block).run();
            else if ($f.depth > 0 && $f.parent.isTextblock) editor.chain().focus().insertContentAt($f.after(), block).run();
            else editor.chain().focus().insertContent(block).run();
          }, Workflow, 'Diagram (Mermaid)')}
          {projectId && btn(false, () => fileRef.current?.click(), ImagePlus, 'Image (or paste / drop one)')}
          {btn(editor.isActive('link'), () => {
            if (editor.isActive('link')) { editor.chain().focus().unsetLink().run(); return; }
            const url = window.prompt('Link URL');
            if (url && (/^https?:\/\//i.test(url) || (docs && url.startsWith('/')))) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
          }, Link2, 'Link')}
          {docs && (
            <>
              <span className="mx-1 h-4 w-px bg-[var(--w-border)]" />
              {btn(false, () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), Table2, 'Insert table')}
              {editor.isActive('table') && (
                <>
                  {btn(false, () => editor.chain().focus().addRowAfter().run(), Rows3, 'Add row below')}
                  {btn(false, () => editor.chain().focus().addColumnAfter().run(), Columns3, 'Add column right')}
                  {btn(false, () => editor.chain().focus().deleteRow().run(), Trash2, 'Delete row')}
                  <button type="button" className="ml-0.5 h-6 rounded-[4px] px-1.5 text-[11px] text-[var(--w-text-3)] hover:bg-[var(--w-hover)] hover:text-[var(--w-red)]" onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().deleteTable().run(); }}>Delete table</button>
                </>
              )}
            </>
          )}
        </div>
      )}
      {projectId && editable && (
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          multiple
          hidden
          data-testid="rich-editor-image-input"
          onChange={(e) => {
            const files = imageFiles(e.target.files);
            e.target.value = '';
            if (editor && files.length) void insertImages(editor.view, projectId, files);
          }}
        />
      )}
      <div style={editable ? { minHeight } : undefined}>
        <EditorContent editor={editor} />
      </div>

      {mention && matches.length > 0 && editor && (
        <WorkPortal>
          <div
            style={(() => {
              const k = khungFixed();
              return { position: 'fixed', left: Math.min(mention.left - k.left, k.width - 248), top: mention.top - k.top, width: 240, boxShadow: 'var(--w-shadow-pop)' } as const;
            })()}
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
export function RichView({ value, className, docs }: { value: TiptapDoc | null | undefined; className?: string; docs?: boolean }) {
  return <RichEditor value={value} editable={false} toolbar={false} className={className} docs={docs} />;
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
