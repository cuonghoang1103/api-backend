'use client';

// NoteEditor — Notion-like rich editor (TipTap) for a single note.
// Phase 1: StarterKit blocks (headings, lists, blockquote, code, hr),
// placeholder, image paste + drag-drop upload, debounced auto-save.
//
// Phase 3c additions (all lazy-loaded so they don't bloat the
// initial bundle for users who never use them):
// • NoteCodeBlock  — Shiki-powered code blocks (replaces StarterKit's
//                    bundled lowlight). NodeView wraps the shared
//                    <CodeBlock /> component.
// • NoteCallout    — admonition blocks (tip / note / warning).
// • NoteMath       — KaTeX inline + block math.
// • TaskList       — checklist with nested items.
// • SlashMenu      — type "/" at line start to insert any block.
// • NoteTableOfContents — auto-built outline of h1/h2/h3.
// • MarkdownInput  — StarterKit already turns "# ", "> ", "- " into
//                    blocks; we keep that behaviour.
//
// All new deps are loaded either via dynamic import (CodeBlock) or
// only when their node is actually rendered (katex). The base
// `StarterKit` is still imported eagerly because every note uses it.

import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent, BubbleMenu, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration, { isChangeOrigin } from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import type { HocuspocusProvider, WebSocketStatus } from '@hocuspocus/provider';
import type * as Y from 'yjs';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { fileApi } from '@/lib/api';
import type { NoteFull, NoteSubjectTree } from '@/types';
import { Check, Loader2, CloudOff, Trash2, Plus, Minus, Star, Archive, AlertCircle, Undo2, Redo2, SlidersHorizontal, ChevronRight, Wifi, WifiOff } from 'lucide-react';
import NoteCodeBlock from '@/components/notes/extensions/NoteCodeBlock';
import NoteCallout from '@/components/notes/extensions/NoteCallout';
import NoteMath from '@/components/notes/extensions/NoteMath';
import TabIndent from '@/components/notes/extensions/TabIndent';
import SlashMenu, { type SlashMenuRef } from '@/components/notes/SlashMenu';
import NoteTableOfContents from '@/components/notes/NoteTableOfContents';
import NotePropertiesPanel from '@/components/notes/NotePropertiesPanel';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export type NoteSavePatch = Partial<Pick<
  NoteFull,
  | 'title'
  | 'contentJson'
  | 'contentHtml'
  | 'tags'
  | 'isFavorite'
  | 'isArchived'
  | 'needsReview'
  | 'reviewDate'
  | 'subjectId'
  | 'chapterId'
>>;

export interface NoteRealtimeParticipant {
  id: number;
  name: string;
  avatarUrl: string | null;
  color: string;
}

export interface NoteRealtimeEditorState {
  document: Y.Doc;
  provider: HocuspocusProvider;
  localUser: NoteRealtimeParticipant;
  users: NoteRealtimeParticipant[];
  status: WebSocketStatus;
}

interface NoteEditorProps {
  note: NoteFull;
  tree: NoteSubjectTree[];
  /** Persist a partial update. Should be idempotent on the server. */
  onSave: (patch: NoteSavePatch) => Promise<void>;
  onDuplicate?: () => Promise<void>;
  /** Shared editors may edit title/body but cannot move/archive/duplicate. */
  ownerControls?: boolean;
  contextLabel?: string;
  collaboration?: NoteRealtimeEditorState;
}

const AUTOSAVE_MS = 900;
/** Quá số ký tự này sau "/" thì coi như người dùng đang viết chữ, không gọi lệnh. */
const SLASH_MAX_QUERY = 24;

export default function NoteEditor({ note, tree, onSave, onDuplicate, ownerControls = true, contextLabel, collaboration }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const slashRef = useRef<SlashMenuRef>(null);
  /** Vị trí dấu "/" mà người dùng đã bấm Esc để bỏ qua (xem handleSlashTrigger). */
  const slashDismissedAt = useRef<number | null>(null);
  // Track the note id so switching notes resets local state instead
  // of bleeding one note's title/content into another.
  const noteIdRef = useRef(note.id);

  // ─── Debounced save ────────────────────────────────────────
  const queueSave = useCallback(
    (patch: NoteSavePatch) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaveState('saving');
      saveTimer.current = setTimeout(async () => {
        try {
          await onSave(patch);
          setSaveState('saved');
        } catch {
          setSaveState('error');
        }
      }, AUTOSAVE_MS);
    },
    [onSave],
  );

  // ─── Image upload (paste + drop) ───────────────────────────
  const uploadAndInsert = useCallback(async (editor: Editor, file: File) => {
    try {
      const res = await fileApi.upload(file, 'images');
      const url = (res.data as { data?: { url?: string } })?.data?.url;
      if (url) {
        // Insert the image AND a trailing empty paragraph, then put
        // the caret in that paragraph. A bare block image left as the
        // last node traps the cursor on a NodeSelection — you can't
        // type or paste again. The paragraph gives the caret a home.
        editor
          .chain()
          .focus()
          .insertContent([
            { type: 'image', attrs: { src: url, alt: file.name } },
            { type: 'paragraph' },
          ])
          .focus()
          .run();
      }
    } catch {
      // Silent: a failed paste shouldn't break typing. The image
      // simply isn't inserted; the user can retry.
    }
  }, []);

  // ─── Slash menu (gõ "/" để chèn khối) ───────────────────────
  // Chạy sau mỗi transaction VÀ mỗi lần con trỏ dời chỗ. Bản cũ chỉ
  // nhận đúng một trạng thái ("/" là ký tự duy nhất của đoạn) nên gõ
  // thêm chữ là trigger tắt và bảng không bao giờ nhận được chuỗi lọc.
  // Giờ ta tìm dấu "/" gần con trỏ nhất, lấy phần chữ đứng sau nó làm
  // query, và trả về cả `range` để SlashMenu xoá sạch "/query" khi chèn.
  const handleSlashTrigger = useCallback((editorInstance: Editor) => {
    // Bỏ trigger hiện tại. `forget` xoá luôn ghi nhớ "đã bấm Esc" vì lúc
    // này con trỏ đã rời khỏi dấu "/" cũ — lần sau gõ "/" phải mở lại.
    const close = (forget = true) => {
      slashRef.current?.close();
      if (forget) slashDismissedAt.current = null;
    };
    const { selection, doc } = editorInstance.state;
    const { $from, empty } = selection;
    // Bôi đen hoặc đứng ngoài đoạn văn → không phải ngữ cảnh chèn khối.
    if (!empty || $from.parent.type.name !== 'paragraph') { close(); return; }

    const blockStart = $from.before() + 1;
    const before = doc.textBetween(blockStart, $from.pos, '\n', '\n');
    const slashIdx = before.lastIndexOf('/');
    if (slashIdx === -1) { close(); return; }
    // "/" phải mở đầu một token: đầu dòng hoặc ngay sau khoảng trắng.
    // Nhờ vậy "a/b", đường dẫn "src/lib" hay "và/hoặc" không bật bảng.
    if (slashIdx > 0 && !/\s/.test(before[slashIdx - 1])) { close(); return; }

    const query = before.slice(slashIdx + 1);
    // Gõ khoảng trắng ngay sau "/" là ý viết chữ, không phải chọn khối.
    // Và quá dài thì chắc chắn không còn là lệnh nữa.
    if (query.startsWith(' ') || query.length > SLASH_MAX_QUERY) { close(); return; }

    const from = blockStart + slashIdx;
    const to = $from.pos;
    // Đúng dấu "/" mà người dùng đã bấm Esc → im lặng, đừng bật lại.
    if (slashDismissedAt.current === from) { close(false); return; }
    // Neo bảng vào chính dấu "/" (không phải con trỏ) — kéo bảng hay
    // cuộn trang thì SlashMenu còn tính lại toạ độ từ `range.from`.
    const coords = editorInstance.view.coordsAtPos(from);
    const rect: DOMRect = {
      top: coords.top,
      bottom: coords.bottom,
      left: coords.left,
      right: coords.right,
      width: coords.right - coords.left,
      height: Math.max(20, coords.bottom - coords.top),
      x: coords.left,
      y: coords.top,
      toJSON: () => ({}),
    } as DOMRect;
    slashRef.current?.open(rect, query, { from, to });
  }, []);

  // ─── Chèn ảnh từ slash menu ─────────────────────────────────
  // Dùng lại đúng luồng upload R2 của paste/drop, chỉ khác đường vào.
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      // Override StarterKit's bundled CodeBlock with our Shiki-backed
      // version. We disable it explicitly so we don't register twice.
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
        // Yjs owns undo/redo in collaborative mode. Registering the regular
        // ProseMirror history plugin as well would create two competing stacks.
        history: collaboration ? false : {},
      }),
      Placeholder.configure({ placeholder: 'Bắt đầu viết… (dán ảnh trực tiếp như Notion, hoặc gõ "/" để chèn khối)' }),
      Image.configure({ inline: false, allowBase64: false, HTMLAttributes: { class: 'note-img', loading: 'lazy' } }),
      NoteCodeBlock,
      NoteCallout,
      NoteMath,
      TaskList.configure({ HTMLAttributes: { class: 'note-task-list' } }),
      TaskItem.configure({ nested: true, HTMLAttributes: { class: 'note-task-item' } }),
      Table.configure({ resizable: false, HTMLAttributes: { class: 'note-table' } }),
      TableRow,
      TableHeader,
      TableCell,
      // Notepad-style Tab: inserts an 8-space indent at the caret in
      // prose, while leaving list/task/table Tab behaviour untouched.
      TabIndent,
      ...(collaboration ? [
        Collaboration.configure({ document: collaboration.document }),
        CollaborationCursor.configure({
          provider: collaboration.provider,
          user: collaboration.localUser,
        }),
      ] : []),
    ],
    // The collaborative Y.Doc is already loaded before this component mounts.
    // Supplying static content here would seed it a second time for every user.
    content: collaboration ? undefined : note.contentJson ?? '',
    editorProps: {
      attributes: {
        class: 'note-prose focus:outline-none',
        spellcheck: 'false',
      },
      // Editor-level keyboard handler. Fires INSIDE ProseMirror
      // (before the contenteditable's native keydown reaches
      // React's synthetic dispatch). We use it for ONE shortcut:
      //
      //  • Escape inside an editable code block — the codeBlock
      //    NodeView sets data-allow-escape='true' on its wrapper
      //    when in EDIT mode. We dispatch a CustomEvent that the
      //    NodeView listens for to flip its React state. This
      //    bypasses both ProseMirror's internal capture AND React's
      //    synthetic dispatch, and is the only path that reliably
      //    gets through every browser / framework layer we tested.
      handleKeyDown(_view, event) {
        if (event.key !== 'Escape') return false;
        const target = event.target as HTMLElement | null;
        if (!target) return false;
        // Walk up the DOM to find a code-block wrapper that's
        // currently in EDIT mode (data-allow-escape='true').
        const editable = target.closest('[data-allow-escape="true"]');
        if (!editable) return false;
        event.preventDefault();
        event.stopPropagation();
        editable.dispatchEvent(new CustomEvent('notes:exit-code-edit'));
        return true;
      },
      handlePaste(view, event) {
        const files = Array.from(event.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'));
        if (files.length && editor) {
          event.preventDefault();
          files.forEach((f) => void uploadAndInsert(editor, f));
          return true;
        }
        return false;
      },
      handleDrop(view, event) {
        const dt = (event as DragEvent).dataTransfer;
        const files = dt?.files ? Array.from(dt.files).filter((f) => f.type.startsWith('image/')) : [];
        if (files.length && editor) {
          event.preventDefault();
          files.forEach((f) => void uploadAndInsert(editor, f));
          return true;
        }
        // Native drag-and-drop reordering of code blocks. The
        // handle inside the code-block toolbar sets the
        // dataTransfer payload as plain text in the form
        // 'codeBlock:<fromPos>'. We read that here, compute the
        // drop target from the event coords, and dispatch a
        // ProseMirror transaction that deletes the block at the
        // original position and re-inserts it at the new one.
        // Tiptap's dnd-kit integration (used by the slash menu
        // for block insertion) would be cleaner but adds a
        // dependency — this path uses only what the editor
        // already exposes and works for the single-block case.
        const payload = dt?.getData('text/plain') ?? '';
        if (payload.startsWith('codeBlock:')) {
          event.preventDefault();
          const fromPos = Number(payload.slice('codeBlock:'.length));
          if (!Number.isFinite(fromPos) || fromPos < 0) return false;
          // Translate the drop coordinates to a document position
          // via ProseMirror's posAtCoords. If the user dropped
          // outside the editor, bail.
          const targetPos = view.posAtCoords({
            left: (event as DragEvent).clientX,
            top: (event as DragEvent).clientY,
          })?.pos;
          if (targetPos == null) return false;
          // Avoid dropping the block onto itself.
          if (targetPos === fromPos || targetPos === fromPos + 1) return true;
          try {
            const { state } = view;
            // Capture the node at fromPos before we mutate.
            const node = state.doc.nodeAt(fromPos);
            if (!node || node.type.name !== 'codeBlock') return false;
            const tr = state.tr;
            // Delete the block first; tr.mapping shifts later
            // positions. We want to insert at the target pos
            // computed BEFORE the deletion, so adjust it
            // appropriately if the target is after the source.
            const insertPos = targetPos > fromPos ? targetPos - node.nodeSize : targetPos;
            tr.delete(fromPos, fromPos + node.nodeSize);
            tr.insert(insertPos, node.type.create({ language: node.attrs.language }, node.content, node.marks));
            view.dispatch(tr);
          } catch {
            /* best-effort */
          }
          return true;
        }
        return false;
      },
    },
    onUpdate({ editor, transaction }) {
      // Hocuspocus persists the shared Y.Doc and materializes JSON/HTML on the
      // backend. Local mode keeps the original REST autosave. In collaborative
      // mode we intentionally do not PATCH remote updates back from every tab.
      if (!collaboration && !isChangeOrigin(transaction)) {
        queueSave({ contentJson: editor.getJSON() as Record<string, unknown>, contentHtml: editor.getHTML() });
      }
      // Update undo/redo state
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
      // Slash menu trigger lives on every keystroke; the helper
      // checks both the trigger and whether the menu is already open.
      handleSlashTrigger(editor);
    },
    // Con trỏ dời chỗ (click, mũi tên, chọn khối khác) cũng phải xét
    // lại trigger — nếu không, bấm ra chỗ khác mà bảng vẫn treo lơ lửng
    // và Enter tiếp theo sẽ chèn nhầm khối.
    onSelectionUpdate({ editor }) { handleSlashTrigger(editor); },
    // Close slash menu when the user clicks outside the editor.
    onBlur() { slashRef.current?.close(); },
  });

  // When the selected note changes, reset title + editor content.
  useEffect(() => {
    if (noteIdRef.current !== note.id) {
      noteIdRef.current = note.id;
      setTitle(note.title);
      setSaveState('idle');
      if (!collaboration) editor?.commands.setContent(note.contentJson ?? '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id]);

  // Reflect an external rename (e.g. from the sidebar) in the title
  // input — but never while the user is editing the title here, so
  // we don't fight their caret.
  useEffect(() => {
    if (noteIdRef.current === note.id && document.activeElement !== titleRef.current) {
      setTitle(note.title);
      collaboration?.document.getMap('metadata').set('title', note.title);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.title]);

  // Title is a small Y.Map field next to the ProseMirror fragment. This keeps
  // heading edits live without forcing the title input into the document body.
  useEffect(() => {
    if (!collaboration) return;
    const metadata = collaboration.document.getMap<unknown>('metadata');
    const applyRemoteTitle = () => {
      const value = metadata.get('title');
      if (typeof value === 'string' && document.activeElement !== titleRef.current) {
        setTitle(value);
      }
    };
    metadata.observe(applyRemoteTitle);
    applyRemoteTitle();
    return () => metadata.unobserve(applyRemoteTitle);
  }, [collaboration]);

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current); }, []);

  const currentSubject = tree.find((item) => item.id === note.subjectId) ?? null;
  const currentChapter = currentSubject?.chapters.find((item) => item.id === note.chapterId) ?? null;

  // Undo/Redo bằng bàn phím do StarterKit History (local) hoặc Yjs
  // UndoManager (collaboration) xử lý: Mod-z / Shift-Mod-z đã có keymap.
  //
  // Ở đây TRƯỚC ĐÂY còn một listener trên `document` làm đúng việc đó
  // lần nữa. ProseMirror xử lý phím rồi để sự kiện nổi bọt tiếp, nên
  // listener kia chạy thêm một lần: MỖI Ctrl+Z hoàn tác HAI bước.
  // Đã gỡ. Hai nút Hoàn tác/Làm lại bên dưới vẫn gọi lệnh trực tiếp.

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 sm:px-6 py-6">
      {/* Save status + Undo/Redo toolbar */}
      <div className="mb-3 flex min-h-7 items-center justify-between gap-3 text-[11px] text-slate-500 dark:text-slate-500">
        {/* Left: save status */}
        <div className="flex min-h-5 items-center gap-1.5" aria-live="polite" aria-atomic="true">
          {collaboration ? (
            collaboration.status === 'connected'
              ? <><Wifi className="h-3 w-3 text-teal-500" aria-hidden="true" /> Đồng bộ thời gian thực</>
              : collaboration.status === 'connecting'
                ? <><Loader2 className="h-3 w-3 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Đang kết nối lại…</>
                : <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-300"><WifiOff className="h-3 w-3" aria-hidden="true" /> Mất kết nối — thay đổi đang chờ đồng bộ</span>
          ) : (
            <>
              {saveState === 'saving' && (<><Loader2 className="h-3 w-3 animate-spin motion-reduce:animate-none" /> Đang lưu…</>)}
              {saveState === 'saved' && (<><Check className="h-3 w-3 text-teal-400" /> Đã lưu</>)}
              {saveState === 'error' && (<span className="flex items-center gap-1.5 text-amber-400"><CloudOff className="h-3 w-3" /> Lưu thất bại — sẽ thử lại khi bạn gõ tiếp</span>)}
            </>
          )}
        </div>

        {/* Right: Undo/Redo buttons */}
        <div className="flex items-center gap-1">
          {collaboration && (
            <div className="mr-1 flex items-center -space-x-1.5" aria-label={`${collaboration.users.length} người đang mở ghi chú`}>
              {collaboration.users.slice(0, 5).map((user) => (
                <span
                  key={user.id}
                  className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border-2 border-white text-[9px] font-bold text-white shadow-sm dark:border-slate-950"
                  style={{ backgroundColor: user.color }}
                  title={`${user.name}${user.id === collaboration.localUser.id ? ' (bạn)' : ''}`}
                >
                  {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" /> : user.name.slice(0, 1).toUpperCase()}
                  <span className="sr-only">{user.name}{user.id === collaboration.localUser.id ? ' (bạn)' : ''}</span>
                </span>
              ))}
              {collaboration.users.length > 5 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-slate-600 px-1 text-[9px] font-bold text-white dark:border-slate-950">+{collaboration.users.length - 5}</span>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={!canUndo}
            title="Hoàn tác (Ctrl+Z)"
            className="flex items-center gap-1 rounded px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Undo2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Hoàn tác</span>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={!canRedo}
            title="Làm lại (Ctrl+Shift+Z)"
            className="flex items-center gap-1 rounded px-2 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Redo2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Làm lại</span>
          </button>
        </div>
      </div>

      {/* Location breadcrumb — establishes page context before the title. */}
      <nav aria-label="Vị trí ghi chú" className="mb-3 flex min-w-0 items-center gap-1 text-[12px] text-slate-500 dark:text-slate-400">
        <span className="truncate">{contextLabel ?? currentSubject?.name ?? 'Môn học'}</span>
        {currentChapter && (
          <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{currentChapter.title}</span>
          </>
        )}
      </nav>

      {/* Title */}
      <input
        ref={titleRef}
        value={title}
        onChange={(e) => {
          const value = e.target.value;
          setTitle(value);
          collaboration?.document.getMap('metadata').set('title', value);
          queueSave({ title: value });
        }}
        placeholder="Tiêu đề ghi chú"
        // text-base (16px) avoids iOS focus auto-zoom on mobile.
        className="w-full bg-transparent text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none"
      />

      {/* Phase 3d — flag toggles. Each is a one-click optimistic
          write: we patch the local note so the icon flips instantly,
          and queueSave fires the PATCH. The debounce timer is
          cleared first so the click isn't merged with a pending
          content save. */}
      {ownerControls && <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <FlagButton
          active={note.isFavorite}
          onClick={() => {
            const next = !note.isFavorite;
            onSave({ isFavorite: next });
          }}
          icon={<Star className="h-3.5 w-3.5" />}
          activeIcon={<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
          label="Yêu thích"
        />
        <FlagButton
          active={note.needsReview}
          onClick={() => {
            const next = !note.needsReview;
            onSave({ needsReview: next });
          }}
          icon={<AlertCircle className="h-3.5 w-3.5" />}
          activeIcon={<AlertCircle className="h-3.5 w-3.5 text-rose-400" />}
          label="Cần ôn"
          activeClass="border-rose-500/40 bg-rose-500/15 text-rose-100"
        />
        <FlagButton
          active={note.isArchived}
          onClick={() => {
            const next = !note.isArchived;
            onSave({ isArchived: next });
          }}
          icon={<Archive className="h-3.5 w-3.5" />}
          activeIcon={<Archive className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />}
          label="Lưu trữ"
          activeClass="border-slate-400/40 bg-slate-400/15 text-slate-900 dark:text-slate-100"
        />
        <button
          type="button"
          onClick={() => setPropertiesOpen((open) => !open)}
          aria-expanded={propertiesOpen}
          className={`ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-md border px-2.5 text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 sm:min-h-10 ${
            propertiesOpen
              ? 'border-teal-500/40 bg-teal-50 text-teal-800 dark:bg-teal-500/10 dark:text-teal-200'
              : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-white/[0.05]'
          }`}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Thuộc tính
        </button>
      </div>}

      {ownerControls && propertiesOpen && onDuplicate && (
        <NotePropertiesPanel
          note={note}
          tree={tree}
          onSave={onSave}
          onDuplicate={onDuplicate}
        />
      )}

      <div className="my-4 h-px w-full bg-slate-100 dark:bg-white/[0.06]" />

      {/* Auto-generated table of contents (only renders when headings exist). */}
      <NoteTableOfContents editor={editor} />

      {/* Body */}
      <EditorContent editor={editor} />

      {/* Table floating toolbar — shows when caret is inside a table,
          giving the user an obvious way to add/remove rows & columns
          or delete the entire table. Tiptap's table extension
          provides the commands but no UI for them. */}
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ placement: 'top', duration: 120 }}
          shouldShow={({ editor: ed }) => ed.isActive('table')}
          className="flex items-center gap-1 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900/95 p-1 shadow-2xl backdrop-blur"
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            aria-label="Thêm hàng"
            title="Thêm hàng"
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 hover:bg-white/10"
          >
            <Plus className="h-3 w-3" /> Hàng
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            aria-label="Thêm cột"
            title="Thêm cột"
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 hover:bg-white/10"
          >
            <Plus className="h-3 w-3" /> Cột
          </button>
          <span className="mx-1 h-4 w-px bg-white/10" />
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            aria-label="Xóa hàng"
            title="Xóa hàng"
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 hover:bg-white/10"
          >
            <Minus className="h-3 w-3" /> Hàng
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            aria-label="Xóa cột"
            title="Xóa cột"
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-slate-700 dark:text-slate-300 hover:bg-white/10"
          >
            <Minus className="h-3 w-3" /> Cột
          </button>
          <span className="mx-1 h-4 w-px bg-white/10" />
          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            aria-label="Xóa bảng"
            title="Xóa bảng"
            className="flex items-center gap-1 rounded px-2 py-1 text-[11px] text-red-300 hover:bg-red-500/20"
          >
            <Trash2 className="h-3 w-3" /> Xóa bảng
          </button>
        </BubbleMenu>
      )}

      {/* Slash menu — tự đặt chỗ (lật lên khi hết chỗ dưới) và kéo
          được; ref-driven nên không re-render mỗi phím gõ. */}
      <SlashMenu
        ref={slashRef}
        editor={editor}
        onPickImage={() => imageInputRef.current?.click()}
        onDismiss={(range) => { slashDismissedAt.current = range.from; }}
      />

      {/* Đầu vào ảnh cho mục "Ảnh" trong slash menu. Ẩn hoàn toàn —
          chỉ mở bằng .click() từ menu. */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (editor) files.forEach((f) => void uploadAndInsert(editor, f));
          // Xoá value để chọn lại đúng tệp vừa rồi vẫn kích hoạt onChange.
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ─── Flag toggle (Phase 3d) ─────────────────────────────────
// Small pill button used in the title row for one-click favourite /
// needs-review / archive toggles. Click is wired through onSave
// (no local state) so the parent owns the canonical value and
// the sidebar pill + flat list views stay in sync.
function FlagButton({
  active, onClick, icon, activeIcon, label, activeClass,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  activeIcon?: React.ReactNode;
  label: string;
  activeClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-[30px] items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
        active
          ? activeClass ?? 'border-amber-500/40 bg-amber-100 dark:bg-amber-500/15 text-amber-100'
          : 'border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:bg-white/[0.05] hover:text-slate-900 dark:hover:text-slate-200'
      }`}
      title={label}
    >
      {active && activeIcon ? activeIcon : icon}
      <span>{label}</span>
    </button>
  );
}
