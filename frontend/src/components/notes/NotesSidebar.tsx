'use client';

/**
 * NotesSidebar — cây Môn › Chương › Trang của Sổ tay (bản 26/09/2026).
 *
 * Người dùng gửi ảnh và kể năm điều, bản này sửa đúng năm điều đó:
 *
 *  1. "Vào trang là mọi môn bung hết" ⇒ mặc định MỌI MÔN GẬP. Chỉ tự mở môn
 *     (và chương) chứa trang đang mở. Môn nào người dùng tự mở thì nhớ trong
 *     localStorage (khoá MỚI `notes-tree-open-v2` — khoá cũ `notes-expanded`
 *     mang ngữ nghĩa "không ghi gì = đang mở", đọc lại nó là bung hết như cũ).
 *  2. "Icon môn/chương/trang na ná nhau" ⇒ ba bậc khác nhau ở icon (ô emoji có
 *     màu riêng của môn · 📂 · 📄), cỡ chữ, độ đậm, và có đường dẫn dọc mảnh.
 *  3. "Nút tạo/sửa giống nhau nên lỡ tạo trùng" ⇒ MỘT nút "+ Mới" (menu Trang /
 *     Chương / Môn theo ngữ cảnh), tạo qua ô đặt tên (chưa có tên thì chưa có
 *     gì trong DB), cảnh báo trùng tên anh em. Sửa/xoá/ghim/đổi tên/di chuyển
 *     nằm trong menu ⋯ riêng của mỗi dòng.
 *  4. "Ở Đã ghim không bỏ ghim được" ⇒ mỗi dòng ghim có nút bỏ ghim + menu ⋯.
 *     Mục ghim là LỐI TẮT, môn được ghim vẫn nằm trong cây như mọi môn khác
 *     (bản cũ rút nó ra khỏi cây nên muốn sửa phải đi tìm).
 *  5. Tìm kiếm ⇒ ô "Lọc cây" ngay trên cây (bỏ dấu, tô đậm, tự bung), còn tìm
 *     trong NỘI DUNG thì là bảng lệnh ⌘K (`NotesCommandPalette`).
 *
 * "📥 Hộp thư" là một NoteSubject bình thường, nhận diện bằng clientId
 * `he-thong:hop-thu` (tính năng Ghi nhanh tạo nó). Ở đây nó được tách ra một
 * khối riêng, không trộn vào danh sách môn.
 *
 * Kéo-thả sắp xếp: kéo cả dòng (chuột: rê ≥ 6px; cảm ứng: giữ 250ms), trong
 * cùng một phạm vi như trước (môn giữa các môn, chương trong môn, trang trong
 * cha của nó). Chuyển trang sang môn/chương khác: menu ⋯ › "Di chuyển tới…".
 */
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ChevronRight, ChevronDown, Plus, Trash2, FileText, FolderPlus, Pin, X, PanelRight,
  Star, Archive, AlertCircle, FolderTree, Share2, PinOff, Smile, Pencil, MoreHorizontal,
  Search, ListFilter, Home, FilePlus2, Library, FolderInput, ExternalLink,
} from 'lucide-react';
import {
  DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors, closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { NoteSubjectTree, NoteChapterTree, NoteSummary } from '@/types';
import { NotesMenu, type MenuEntry } from './NotesMenu';
import NotesNameInput from './NotesNameInput';
import NoteMovePicker from './NoteMovePicker';
import { foldIncludes, Highlight, isInboxSubject, subjectName } from './notesText';

export type NoteSidebarFilter = 'tree' | 'favorites' | 'archive' | 'needs-review' | 'trash';

export interface SidebarCallbacks {
  onSelectNote: (id: number) => void;
  onOpenSubject: (id: number) => void;
  /** Về trang chủ Sổ tay (bỏ chọn trang). */
  onGoHome?: () => void;
  /** Mở bảng lệnh ⌘K. */
  onOpenSearch?: () => void;
  /** Tạo có TÊN — không còn "Ghi chú mới"/"Môn học mới" mặc định. Trả về id mới. */
  onCreateSubject: (name: string) => Promise<number | void>;
  onCreateChapter: (subjectId: number, title: string) => Promise<number | void>;
  onCreateNote: (subjectId: number, chapterId: number | null, title: string) => Promise<number | void>;
  onMoveNote: (noteId: number, subjectId: number, chapterId: number | null) => Promise<void> | void;
  onRenameSubject: (id: number, name: string) => void;
  onRenameChapter: (id: number, title: string) => void;
  onRenameNote: (id: number, title: string) => void;
  onDeleteSubject: (id: number) => void;
  onDeleteChapter: (id: number) => void;
  onDeleteNote: (id: number) => void;
  onShareSubject: (subject: NoteSubjectTree) => void;
  onPinSubject: (id: number, pinned: boolean) => void;
  onPinChapter: (id: number, pinned: boolean) => void;
  onPinNote: (id: number, pinned: boolean) => void;
  onChangeSubjectIcon: (id: number, emoji: string) => void;
  onReorderSubjects: (orderedIds: number[]) => void;
  onReorderChapters: (subjectId: number, orderedIds: number[]) => void;
  onReorderNotes: (orderedIds: number[]) => void;
  onChangeFilter: (filter: NoteSidebarFilter) => void;
}

/** Yêu cầu bung + cuộn tới một môn/chương (từ ⌘K, trang chủ). `nonce` đổi mỗi lần. */
export interface SidebarReveal { subjectId: number; chapterId?: number | null; nonce: number }

interface Props extends SidebarCallbacks {
  tree: NoteSubjectTree[];
  selectedNoteId: number | null;
  filter: NoteSidebarFilter;
  filteredNotes: NoteSummary[];
  onClose?: () => void;
  reveal?: SidebarReveal | null;
}

type CreateKind = { kind: 'note'; subjectId: number; chapterId: number | null }
  | { kind: 'chapter'; subjectId: number }
  | { kind: 'subject' };

const OPEN_KEY = 'notes-tree-open-v2';
const PINNED_OPEN_KEY = 'notes-pinned-open';
const sKey = (id: number) => `s:${id}`;
const cKey = (id: number) => `c:${id}`;
const UNTITLED = 'Không có tiêu đề';

// ─── Kích thước — một chỗ để cả cây thẳng hàng ─────────────────
const BASE_PAD = 6;
const STEP = 16;
const padFor = (depth: number) => BASE_PAD + depth * STEP;

function useTreeSensors() {
  return useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
  );
}

function countNotes(s: NoteSubjectTree): number {
  return s.notes.length + s.chapters.reduce((n, c) => n + c.notes.length, 0);
}

export default function NotesSidebar({
  tree, selectedNoteId, filter, filteredNotes, onClose, reveal, ...cb
}: Props) {
  const sensors = useTreeSensors();
  const scrollRef = useRef<HTMLDivElement>(null);

  // ─── Trạng thái mở/gập — mặc định GẬP ────────────────────────
  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>({});
  const loadedRef = useRef(false);
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(OPEN_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === 'object') {
        setOpenKeys((cur) => ({ ...(parsed as Record<string, boolean>), ...cur }));
      }
    } catch { /* localStorage hỏng / bị chặn — mặc định gập */ }
    loadedRef.current = true;
  }, []);
  useEffect(() => {
    if (!loadedRef.current) return;
    try {
      // Chỉ lưu khoá đang mở: gọn, và "không có" luôn nghĩa là gập.
      const slim: Record<string, true> = {};
      Object.entries(openKeys).forEach(([k, v]) => { if (v) slim[k] = true; });
      window.localStorage.setItem(OPEN_KEY, JSON.stringify(slim));
    } catch { /* ignore */ }
  }, [openKeys]);
  const isOpen = (k: string) => Boolean(openKeys[k]);
  const setOpen = useCallback((k: string, v: boolean) => setOpenKeys((o) => ({ ...o, [k]: v })), []);
  const openMany = useCallback((keys: string[]) => setOpenKeys((o) => {
    if (keys.every((k) => o[k])) return o;
    const n = { ...o };
    keys.forEach((k) => { n[k] = true; });
    return n;
  }), []);

  const [pinnedOpen, setPinnedOpen] = useState(true);
  useEffect(() => {
    try { if (window.localStorage.getItem(PINNED_OPEN_KEY) === '0') setPinnedOpen(false); } catch { /* ignore */ }
  }, []);
  const togglePinnedOpen = () => setPinnedOpen((v) => {
    try { window.localStorage.setItem(PINNED_OPEN_KEY, v ? '0' : '1'); } catch { /* ignore */ }
    return !v;
  });

  // ─── Phân loại ───────────────────────────────────────────────
  const inbox = useMemo(() => tree.find((s) => isInboxSubject(s)) ?? null, [tree]);
  const subjects = useMemo(() => tree.filter((s) => !isInboxSubject(s)), [tree]);

  /** noteId → vị trí trong cây. */
  const noteLoc = useMemo(() => {
    const m = new Map<number, { subjectId: number; chapterId: number | null; note: NoteSummary }>();
    tree.forEach((s) => {
      s.notes.forEach((n) => m.set(n.id, { subjectId: s.id, chapterId: null, note: n }));
      s.chapters.forEach((c) => c.notes.forEach((n) => m.set(n.id, { subjectId: s.id, chapterId: c.id, note: n })));
    });
    return m;
  }, [tree]);

  // ─── Ngữ cảnh cho "+ Mới" ────────────────────────────────────
  const [ctx, setCtx] = useState<{ subjectId: number; chapterId: number | null } | null>(null);

  // Trang đang mở ⇒ tự mở môn + chương chứa nó, và cuộn tới dòng đó.
  useEffect(() => {
    if (!selectedNoteId) return;
    const loc = noteLoc.get(selectedNoteId);
    if (!loc) return;
    setCtx({ subjectId: loc.subjectId, chapterId: loc.chapterId });
    openMany(loc.chapterId ? [sKey(loc.subjectId), cKey(loc.chapterId)] : [sKey(loc.subjectId)]);
    const raf = requestAnimationFrame(() => {
      scrollRef.current?.querySelector(`[data-note-row="${selectedNoteId}"]`)?.scrollIntoView({ block: 'nearest' });
    });
    return () => cancelAnimationFrame(raf);
    // Chỉ chạy khi ĐỔI trang, không phải mỗi lần cây vẽ lại (người dùng có thể
    // vừa tự gập môn đó).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNoteId, noteLoc.size]);

  // Yêu cầu bung + cuộn từ ngoài (⌘K chọn môn/chương, trang chủ).
  useEffect(() => {
    if (!reveal) return;
    const keys = [sKey(reveal.subjectId)];
    if (reveal.chapterId) keys.push(cKey(reveal.chapterId));
    openMany(keys);
    setCtx({ subjectId: reveal.subjectId, chapterId: reveal.chapterId ?? null });
    const target = reveal.chapterId ? cKey(reveal.chapterId) : sKey(reveal.subjectId);
    const t = setTimeout(() => {
      const el = scrollRef.current?.querySelector(`[data-tree-key="${target}"]`) as HTMLElement | null;
      if (el) {
        el.scrollIntoView({ block: 'center' });
        el.classList.add('ring-2', 'ring-teal-500/50');
        setTimeout(() => el.classList.remove('ring-2', 'ring-teal-500/50'), 1200);
      }
    }, 60);
    return () => clearTimeout(t);
  }, [reveal, openMany]);

  const ctxResolved = useMemo(() => {
    const valid = ctx && tree.some((s) => s.id === ctx.subjectId) ? ctx : null;
    if (valid) {
      const s = tree.find((x) => x.id === valid.subjectId)!;
      const c = valid.chapterId ? s.chapters.find((x) => x.id === valid.chapterId) ?? null : null;
      return { subject: s, chapter: c };
    }
    const s = subjects[0] ?? inbox;
    return s ? { subject: s, chapter: null } : null;
  }, [ctx, tree, subjects, inbox]);

  // ─── Tạo / đổi tên / menu / di chuyển ────────────────────────
  const [creating, setCreating] = useState<CreateKind | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ anchor: HTMLElement; items: MenuEntry[]; key: string; align?: 'start' | 'end' } | null>(null);
  const [moving, setMoving] = useState<{ id: number; title: string; subjectId: number; chapterId: number | null } | null>(null);
  const [emojiFor, setEmojiFor] = useState<{ id: number; emoji: string } | null>(null);
  const closeMenu = useCallback(() => setMenu(null), []);

  const startCreate = useCallback((c: CreateKind) => {
    if (c.kind === 'note') openMany(c.chapterId ? [sKey(c.subjectId), cKey(c.chapterId)] : [sKey(c.subjectId)]);
    if (c.kind === 'chapter') openMany([sKey(c.subjectId)]);
    cb.onChangeFilter('tree');
    setCreating(c);
  }, [openMany, cb]);

  const submitCreate = useCallback(async (name: string) => {
    if (!creating) return;
    try {
      if (creating.kind === 'subject') {
        const id = await cb.onCreateSubject(name);
        if (typeof id === 'number') { openMany([sKey(id)]); setCtx({ subjectId: id, chapterId: null }); }
      } else if (creating.kind === 'chapter') {
        const id = await cb.onCreateChapter(creating.subjectId, name);
        if (typeof id === 'number') { openMany([sKey(creating.subjectId), cKey(id)]); setCtx({ subjectId: creating.subjectId, chapterId: id }); }
      } else {
        await cb.onCreateNote(creating.subjectId, creating.chapterId, name);
      }
      setCreating(null);
    } catch { /* trang đã báo lỗi; giữ ô để người dùng thử lại */ }
  }, [creating, cb, openMany]);

  const openNewMenu = (anchor: HTMLElement) => {
    const r = ctxResolved;
    const where = r ? `${r.subject.emoji || '📚'} ${r.subject.name}${r.chapter ? ` › ${r.chapter.title}` : ''}` : '';
    setMenu({
      key: 'new',
      anchor,
      align: 'end',
      items: [
        ...(r ? [{ heading: `Tạo trong ${where}` }] : []),
        {
          key: 'note', label: 'Trang mới', icon: <FilePlus2 className="h-4 w-4" />,
          hint: r ? (r.chapter ? 'trong chương' : 'trong môn') : 'tạo môn trước',
          disabled: !r,
          onSelect: () => r && startCreate({ kind: 'note', subjectId: r.subject.id, chapterId: r.chapter?.id ?? null }),
        },
        {
          key: 'chapter', label: 'Chương mới', icon: <FolderPlus className="h-4 w-4" />,
          hint: r ? 'trong môn' : 'tạo môn trước',
          disabled: !r || (inbox !== null && r.subject.id === inbox.id),
          onSelect: () => r && startCreate({ kind: 'chapter', subjectId: r.subject.id }),
        },
        'divider',
        { key: 'subject', label: 'Môn mới', icon: <Library className="h-4 w-4" />, onSelect: () => startCreate({ kind: 'subject' }) },
      ],
    });
  };

  const subjectMenu = (s: NoteSubjectTree): MenuEntry[] => {
    const isInbox = inbox?.id === s.id;
    return [
      { key: 'open', label: 'Mở trang môn', hint: 'tệp · bảng', icon: <PanelRight className="h-4 w-4" />, onSelect: () => cb.onOpenSubject(s.id) },
      { key: 'new-note', label: 'Tạo trang trong môn', icon: <FilePlus2 className="h-4 w-4" />, onSelect: () => startCreate({ kind: 'note', subjectId: s.id, chapterId: null }) },
      ...(!isInbox ? [{ key: 'new-ch', label: 'Tạo chương', icon: <FolderPlus className="h-4 w-4" />, onSelect: () => startCreate({ kind: 'chapter', subjectId: s.id }) }] : []),
      'divider',
      ...(!isInbox ? [
        { key: 'rename', label: 'Đổi tên', icon: <Pencil className="h-4 w-4" />, onSelect: () => setRenaming(sKey(s.id)) },
        { key: 'emoji', label: 'Đổi biểu tượng', icon: <Smile className="h-4 w-4" />, onSelect: () => setEmojiFor({ id: s.id, emoji: s.emoji || '📚' }) },
        { key: 'pin', label: s.isPinned ? 'Bỏ ghim' : 'Ghim lên đầu', icon: s.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />, onSelect: () => cb.onPinSubject(s.id, !s.isPinned) },
        { key: 'share', label: 'Chia sẻ…', icon: <Share2 className="h-4 w-4" />, onSelect: () => cb.onShareSubject(s) },
        'divider' as const,
        { key: 'del', label: 'Xoá môn', danger: true, icon: <Trash2 className="h-4 w-4" />, onSelect: () => cb.onDeleteSubject(s.id) },
      ] : [
        { key: 'share', label: 'Chia sẻ…', icon: <Share2 className="h-4 w-4" />, onSelect: () => cb.onShareSubject(s) },
      ]),
    ];
  };

  const chapterMenu = (s: NoteSubjectTree, c: NoteChapterTree): MenuEntry[] => [
    { key: 'new-note', label: 'Tạo trang trong chương', icon: <FilePlus2 className="h-4 w-4" />, onSelect: () => startCreate({ kind: 'note', subjectId: s.id, chapterId: c.id }) },
    'divider',
    { key: 'rename', label: 'Đổi tên', icon: <Pencil className="h-4 w-4" />, onSelect: () => setRenaming(cKey(c.id)) },
    { key: 'pin', label: c.isPinned ? 'Bỏ ghim' : 'Ghim', icon: c.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />, onSelect: () => cb.onPinChapter(c.id, !c.isPinned) },
    'divider',
    { key: 'del', label: 'Xoá chương', danger: true, icon: <Trash2 className="h-4 w-4" />, onSelect: () => cb.onDeleteChapter(c.id) },
  ];

  const noteMenu = (n: NoteSummary, subjectId: number, chapterId: number | null): MenuEntry[] => [
    { key: 'open', label: 'Mở', icon: <ExternalLink className="h-4 w-4" />, onSelect: () => cb.onSelectNote(n.id) },
    { key: 'rename', label: 'Đổi tên', icon: <Pencil className="h-4 w-4" />, onSelect: () => { openMany(chapterId ? [sKey(subjectId), cKey(chapterId)] : [sKey(subjectId)]); setRenaming(`n:${n.id}`); } },
    { key: 'pin', label: n.isPinned ? 'Bỏ ghim' : 'Ghim', icon: n.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />, onSelect: () => cb.onPinNote(n.id, !n.isPinned) },
    { key: 'move', label: 'Di chuyển tới…', icon: <FolderInput className="h-4 w-4" />, onSelect: () => setMoving({ id: n.id, title: n.title, subjectId, chapterId }) },
    'divider',
    { key: 'del', label: 'Chuyển vào Thùng rác', danger: true, icon: <Trash2 className="h-4 w-4" />, onSelect: () => cb.onDeleteNote(n.id) },
  ];

  const showMenu = (key: string, anchor: HTMLElement, items: MenuEntry[]) => {
    setMenu((m) => (m?.key === key ? null : { key, anchor, items }));
  };

  // ─── Lọc cây ─────────────────────────────────────────────────
  const [treeQ, setTreeQ] = useState('');
  const filtering = treeQ.trim().length > 0;
  const noteMatch = (n: NoteSummary) => foldIncludes(n.title || UNTITLED, treeQ);

  // ─── Kéo-thả ─────────────────────────────────────────────────
  const [dragging, setDragging] = useState<{ label: string; icon: ReactNode } | null>(null);
  const onSubjectDragEnd = (e: DragEndEvent) => {
    setDragging(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = subjects.map((s) => s.id);
    const a = ids.indexOf(Number(active.id));
    const b = ids.indexOf(Number(over.id));
    if (a < 0 || b < 0) return;
    const next = arrayMove(ids, a, b);
    cb.onReorderSubjects(inbox ? [...next, inbox.id] : next);
  };
  const scopeDragEnd = (ids: number[], apply: (next: number[]) => void) => (e: DragEndEvent) => {
    setDragging(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const a = ids.indexOf(Number(active.id));
    const b = ids.indexOf(Number(over.id));
    if (a < 0 || b < 0) return;
    apply(arrayMove(ids, a, b));
  };

  // ─── Dựng một trang ──────────────────────────────────────────
  const renderNote = (n: NoteSummary, depth: number, subjectId: number, chapterId: number | null) => {
    const key = `n:${n.id}`;
    return (
      <SortableRow key={n.id} id={n.id} disabled={filtering || renaming === key}>
        {(drag) => (
          <TreeRow
            kind="note"
            depth={depth}
            treeKey={key}
            noteId={n.id}
            label={n.title || UNTITLED}
            q={treeQ}
            icon={<span className="text-[12.5px] leading-none opacity-90">📄</span>}
            active={selectedNoteId === n.id}
            pinned={n.isPinned}
            menuOpen={menu?.key === key}
            editing={renaming === key}
            drag={drag}
            onClick={() => { setCtx({ subjectId, chapterId }); cb.onSelectNote(n.id); }}
            onStartRename={() => setRenaming(key)}
            onRename={(v) => { setRenaming(null); if (v !== n.title) cb.onRenameNote(n.id, v); }}
            onCancelRename={() => setRenaming(null)}
            onMenu={(el) => showMenu(key, el, noteMenu(n, subjectId, chapterId))}
            onDragLabel={() => setDragging({ label: n.title || UNTITLED, icon: '📄' })}
          />
        )}
      </SortableRow>
    );
  };

  const renderCreateInput = (c: CreateKind, depth: number) => {
    let siblings: { id: number; name: string }[] = [];
    let placeholder = '';
    let kindLabel = '';
    let icon: ReactNode = null;
    if (c.kind === 'subject') {
      siblings = tree.map((s) => ({ id: s.id, name: s.name }));
      placeholder = 'Tên môn mới…'; kindLabel = 'môn'; icon = '📚';
    } else if (c.kind === 'chapter') {
      const s = tree.find((x) => x.id === c.subjectId);
      siblings = (s?.chapters ?? []).map((x) => ({ id: x.id, name: x.title }));
      placeholder = 'Tên chương mới…'; kindLabel = 'chương'; icon = '📂';
    } else {
      const s = tree.find((x) => x.id === c.subjectId);
      const list = c.chapterId ? s?.chapters.find((x) => x.id === c.chapterId)?.notes ?? [] : s?.notes ?? [];
      siblings = list.map((x) => ({ id: x.id, name: x.title || UNTITLED }));
      placeholder = 'Tên trang mới…'; kindLabel = 'trang'; icon = '📄';
    }
    return (
      <NotesNameInput
        key={`create-${c.kind}`}
        placeholder={placeholder}
        kindLabel={kindLabel}
        siblings={siblings}
        indent={padFor(depth)}
        icon={icon}
        onSubmit={submitCreate}
        onCancel={() => setCreating(null)}
        onOpenExisting={(id) => {
          setCreating(null);
          if (c.kind === 'note') cb.onSelectNote(id);
          else if (c.kind === 'chapter') openMany([sKey(c.subjectId), cKey(id)]);
          else openMany([sKey(id)]);
        }}
      />
    );
  };

  const renderChapter = (s: NoteSubjectTree, c: NoteChapterTree, forcedFilter: boolean) => {
    const key = cKey(c.id);
    const selfMatch = filtering && foldIncludes(c.title, treeQ);
    const matchedNotes = filtering && !forcedFilter ? c.notes.filter(noteMatch) : c.notes;
    const hasDesc = filtering && !forcedFilter && matchedNotes.length > 0;
    if (filtering && !forcedFilter && !selfMatch && !hasDesc) return null;
    const open = hasDesc || isOpen(key) || (creating?.kind === 'note' && creating.chapterId === c.id);
    const shownNotes = hasDesc ? matchedNotes : c.notes;
    const ids = shownNotes.map((n) => n.id);
    return (
      <div key={c.id}>
        <SortableRow id={c.id} disabled={filtering || renaming === key}>
          {(drag) => (
            <TreeRow
              kind="chapter"
              depth={1}
              treeKey={key}
              label={c.title}
              q={treeQ}
              icon={<span className="text-[13px] leading-none">{open ? '📂' : '📁'}</span>}
              open={open}
              count={c.notes.length}
              pinned={c.isPinned}
              active={false}
              menuOpen={menu?.key === key}
              editing={renaming === key}
              drag={drag}
              onClick={() => { setCtx({ subjectId: s.id, chapterId: c.id }); setOpen(key, !open); }}
              onToggle={() => setOpen(key, !open)}
              onStartRename={() => setRenaming(key)}
              onRename={(v) => { setRenaming(null); if (v !== c.title) cb.onRenameChapter(c.id, v); }}
              onCancelRename={() => setRenaming(null)}
              onMenu={(el) => showMenu(key, el, chapterMenu(s, c))}
              onDragLabel={() => setDragging({ label: c.title, icon: '📂' })}
            />
          )}
        </SortableRow>
        {open && (
          <Guide depth={1}>
            {creating?.kind === 'note' && creating.chapterId === c.id && renderCreateInput(creating, 2)}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={scopeDragEnd(ids, cb.onReorderNotes)}
              onDragCancel={() => setDragging(null)}
            >
              <SortableContext items={ids} strategy={verticalListSortingStrategy}>
                {shownNotes.map((n) => renderNote(n, 2, s.id, c.id))}
              </SortableContext>
            </DndContext>
            {shownNotes.length === 0 && !(creating?.kind === 'note' && creating.chapterId === c.id) && (
              <EmptyHint depth={2} onClick={() => startCreate({ kind: 'note', subjectId: s.id, chapterId: c.id })}>Chương trống — thêm trang</EmptyHint>
            )}
          </Guide>
        )}
      </div>
    );
  };

  /** Dựng một môn. `standalone` = không nằm trong DndContext của danh sách môn (Hộp thư). */
  const renderSubject = (s: NoteSubjectTree, opts: { standalone?: boolean } = {}) => {
    const key = sKey(s.id);
    const selfMatch = filtering && foldIncludes(s.name, treeQ);
    const matchedRoot = filtering ? s.notes.filter(noteMatch) : s.notes;
    const matchedChapters = filtering
      ? s.chapters.filter((c) => foldIncludes(c.title, treeQ) || c.notes.some(noteMatch))
      : s.chapters;
    const hasDesc = filtering && (matchedRoot.length > 0 || matchedChapters.length > 0);
    if (filtering && !selfMatch && !hasDesc) return null;
    // Môn chỉ khớp TÊN (con không khớp) thì bung ra là thấy đủ con như thường.
    const forcedFilter = filtering && !hasDesc;
    const creatingHere = creating && creating.kind !== 'subject' && creating.subjectId === s.id;
    const open = hasDesc || isOpen(key) || Boolean(creatingHere);
    const rootNotes = hasDesc ? matchedRoot : s.notes;
    const chapters = hasDesc ? matchedChapters : s.chapters;
    const rootIds = rootNotes.map((n) => n.id);
    const chapterIds = chapters.map((c) => c.id);
    const isInbox = inbox?.id === s.id;

    const row = (drag?: DragBits) => (
      <TreeRow
        kind="subject"
        depth={0}
        treeKey={key}
        label={subjectName(s)}
        q={treeQ}
        icon={<SubjectIcon emoji={isInbox ? '📥' : s.emoji} color={s.color} onClick={isInbox ? undefined : () => setEmojiFor({ id: s.id, emoji: s.emoji || '📚' })} />}
        open={open}
        count={countNotes(s)}
        pinned={s.isPinned && !isInbox}
        active={false}
        menuOpen={menu?.key === key}
        editing={renaming === key}
        drag={drag}
        onClick={() => { setCtx({ subjectId: s.id, chapterId: null }); setOpen(key, !open); }}
        onToggle={() => setOpen(key, !open)}
        onStartRename={isInbox ? undefined : () => setRenaming(key)}
        onRename={(v) => { setRenaming(null); if (v !== s.name) cb.onRenameSubject(s.id, v); }}
        onCancelRename={() => setRenaming(null)}
        onMenu={(el) => showMenu(key, el, subjectMenu(s))}
        onDragLabel={() => setDragging({ label: s.name, icon: s.emoji || '📚' })}
      />
    );

    return (
      <div key={s.id} className="mb-px">
        {opts.standalone ? row() : (
          <SortableRow id={s.id} disabled={filtering || renaming === key}>{(drag) => row(drag)}</SortableRow>
        )}
        {open && (
          <Guide depth={0}>
            {creating?.kind === 'note' && creating.subjectId === s.id && creating.chapterId === null && renderCreateInput(creating, 1)}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={scopeDragEnd(rootIds, cb.onReorderNotes)} onDragCancel={() => setDragging(null)}>
              <SortableContext items={rootIds} strategy={verticalListSortingStrategy}>
                {rootNotes.map((n) => renderNote(n, 1, s.id, null))}
              </SortableContext>
            </DndContext>
            {creating?.kind === 'chapter' && creating.subjectId === s.id && renderCreateInput(creating, 1)}
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={scopeDragEnd(chapterIds, (next) => cb.onReorderChapters(s.id, next))} onDragCancel={() => setDragging(null)}>
              <SortableContext items={chapterIds} strategy={verticalListSortingStrategy}>
                {chapters.map((c) => renderChapter(s, c, forcedFilter))}
              </SortableContext>
            </DndContext>
            {rootNotes.length === 0 && chapters.length === 0 && !creatingHere && (
              <EmptyHint depth={1} onClick={() => startCreate({ kind: 'note', subjectId: s.id, chapterId: null })}>
                {isInbox ? 'Hộp thư trống — Ghi nhanh sẽ vào đây' : 'Môn trống — thêm trang'}
              </EmptyHint>
            )}
          </Guide>
        )}
      </div>
    );
  };

  // ─── Mục đã ghim (lối tắt) ───────────────────────────────────
  const pinnedItems = useMemo(() => {
    const out: { key: string; kind: 'subject' | 'chapter' | 'note'; label: string; sub: string; icon: ReactNode; subjectId: number; chapterId: number | null; note?: NoteSummary; chapter?: NoteChapterTree; subject: NoteSubjectTree }[] = [];
    tree.forEach((s) => {
      if (s.isPinned && !isInboxSubject(s)) out.push({ key: sKey(s.id), kind: 'subject', label: s.name, sub: 'Môn', icon: s.emoji || '📚', subjectId: s.id, chapterId: null, subject: s });
      s.chapters.forEach((c) => {
        if (c.isPinned) out.push({ key: cKey(c.id), kind: 'chapter', label: c.title, sub: s.name, icon: '📂', subjectId: s.id, chapterId: c.id, chapter: c, subject: s });
      });
    });
    tree.forEach((s) => {
      const push = (n: NoteSummary, c: NoteChapterTree | null) => {
        if (n.isPinned) out.push({ key: `n:${n.id}`, kind: 'note', label: n.title || UNTITLED, sub: c ? `${s.name} › ${c.title}` : s.name, icon: '📄', subjectId: s.id, chapterId: c?.id ?? null, note: n, subject: s });
      };
      s.notes.forEach((n) => push(n, null));
      s.chapters.forEach((c) => c.notes.forEach((n) => push(n, c)));
    });
    return out;
  }, [tree]);

  const revealLocal = (subjectId: number, chapterId: number | null) => {
    openMany(chapterId ? [sKey(subjectId), cKey(chapterId)] : [sKey(subjectId)]);
    setTreeQ('');
    const target = chapterId ? cKey(chapterId) : sKey(subjectId);
    setTimeout(() => {
      const el = scrollRef.current?.querySelector(`[data-tree-key="${target}"]`) as HTMLElement | null;
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 60);
  };

  return (
    <div className="flex h-full flex-col text-sm">
      {/* ── Đầu cột ── */}
      <div className="flex items-center gap-1 px-2 pb-2 pt-3">
        <button
          type="button"
          onClick={cb.onGoHome}
          title="Trang chủ Sổ tay"
          className="flex min-h-[32px] min-w-0 flex-1 items-center gap-1.5 rounded-md px-1.5 text-left hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
        >
          <Home className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span className="truncate text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-600 dark:text-slate-400">Sổ tay</span>
        </button>
        {cb.onOpenSearch && (
          <button
            type="button"
            onClick={cb.onOpenSearch}
            title="Tìm mọi nơi (⌘K / Ctrl+K)"
            aria-label="Tìm kiếm"
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-black/[0.05] hover:text-slate-800 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-slate-200 sm:h-8 sm:w-8"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => openNewMenu(e.currentTarget)}
          aria-haspopup="menu"
          aria-expanded={menu?.key === 'new'}
          className="flex h-9 items-center gap-1 rounded-md bg-teal-600 pl-2 pr-1.5 text-[12.5px] font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 sm:h-8"
        >
          <Plus className="h-4 w-4" /> Mới <ChevronDown className="h-3.5 w-3.5 opacity-80" />
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-md text-slate-500 hover:bg-black/[0.05] dark:text-slate-400 dark:hover:bg-white/[0.06] md:hidden"
            title="Đóng"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Bộ lọc nhanh: một dòng, cuộn ngang khi hẹp ── */}
      <div className="mb-1.5 flex items-center gap-1 overflow-x-auto px-2 pb-0.5 [scrollbar-width:none]">
        <FilterPill active={filter === 'tree'} icon={<FolderTree className="h-3 w-3" />} label="Cây" onClick={() => cb.onChangeFilter('tree')} />
        <FilterPill active={filter === 'favorites'} icon={<Star className="h-3 w-3" />} label="Yêu thích" onClick={() => cb.onChangeFilter('favorites')} />
        <FilterPill active={filter === 'needs-review'} icon={<AlertCircle className="h-3 w-3" />} label="Cần ôn" onClick={() => cb.onChangeFilter('needs-review')} />
        <FilterPill active={filter === 'archive'} icon={<Archive className="h-3 w-3" />} label="Lưu trữ" onClick={() => cb.onChangeFilter('archive')} />
        <FilterPill active={filter === 'trash'} icon={<Trash2 className="h-3 w-3" />} label="Thùng rác" onClick={() => cb.onChangeFilter('trash')} />
      </div>

      {/* ── Lọc cây ── */}
      {filter === 'tree' && tree.length > 0 && (
        <div className="px-2 pb-1.5">
          <div className="flex items-center gap-1.5 rounded-md border border-black/[0.08] bg-black/[0.02] px-2 focus-within:border-teal-500/60 focus-within:bg-transparent dark:border-white/[0.08] dark:bg-white/[0.02]">
            <ListFilter className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <input
              value={treeQ}
              onChange={(e) => setTreeQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === 'Escape') { e.preventDefault(); setTreeQ(''); }
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const first = scrollRef.current?.querySelector('[data-note-row]') as HTMLElement | null;
                  const id = Number(first?.dataset.noteRow);
                  if (id) cb.onSelectNote(id);
                }
              }}
              placeholder="Lọc cây…"
              aria-label="Lọc cây theo tên môn, chương, trang"
              className="min-h-[30px] min-w-0 flex-1 bg-transparent text-[12.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
            />
            {treeQ && (
              <button type="button" onClick={() => setTreeQ('')} aria-label="Xoá lọc" className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-8">
        {filter === 'tree' && (
          <>
            {/* ── 📥 Hộp thư — khối riêng ── */}
            {inbox && !filtering && (
              <div className="mb-2 rounded-lg bg-sky-500/[0.05] py-0.5 dark:bg-sky-400/[0.05]">
                {renderSubject(inbox, { standalone: true })}
              </div>
            )}
            {inbox && filtering && renderSubject(inbox, { standalone: true })}

            {/* ── Đã ghim ── */}
            {!filtering && pinnedItems.length > 0 && (
              <section className="mb-2">
                <SectionHeader onClick={togglePinnedOpen} open={pinnedOpen} icon={<Pin className="h-3 w-3 text-amber-500" />} label="Đã ghim" count={pinnedItems.length} />
                {pinnedOpen && pinnedItems.map((p) => (
                  <PinnedRow
                    key={`p-${p.key}`}
                    label={p.label}
                    sub={p.sub}
                    icon={p.icon}
                    active={p.kind === 'note' && selectedNoteId === p.note?.id}
                    menuOpen={menu?.key === `pin-${p.key}`}
                    onClick={() => {
                      if (p.kind === 'note' && p.note) cb.onSelectNote(p.note.id);
                      else revealLocal(p.subjectId, p.chapterId);
                    }}
                    onUnpin={() => {
                      if (p.kind === 'subject') cb.onPinSubject(p.subjectId, false);
                      else if (p.kind === 'chapter' && p.chapter) cb.onPinChapter(p.chapter.id, false);
                      else if (p.note) cb.onPinNote(p.note.id, false);
                    }}
                    onMenu={(el) => showMenu(`pin-${p.key}`, el, p.kind === 'subject'
                      ? subjectMenu(p.subject)
                      : p.kind === 'chapter' && p.chapter ? chapterMenu(p.subject, p.chapter)
                        : noteMenu(p.note!, p.subjectId, p.chapterId))}
                  />
                ))}
              </section>
            )}

            {/* ── Môn học ── */}
            <SectionHeader icon={<span className="text-[11px] leading-none">📚</span>} label="Môn học" count={subjects.length} />
            {creating?.kind === 'subject' && renderCreateInput(creating, 0)}

            {subjects.length === 0 && creating?.kind !== 'subject' && (
              <div className="px-3 py-8 text-center text-[12.5px] leading-relaxed text-slate-500">
                <div className="mb-2 text-2xl">📚</div>
                Chưa có môn học nào.
                <button type="button" onClick={() => startCreate({ kind: 'subject' })} className="mt-2 block w-full rounded-md border border-dashed border-teal-500/40 px-3 py-1.5 text-teal-700 hover:bg-teal-500/10 dark:text-teal-300">
                  + Tạo môn đầu tiên
                </button>
              </div>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onSubjectDragEnd}
              onDragCancel={() => setDragging(null)}
            >
              <SortableContext items={subjects.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                {subjects.map((s) => renderSubject(s))}
              </SortableContext>
              <DragOverlay dropAnimation={null}>
                {dragging ? (
                  <div className="flex w-64 items-center gap-2 rounded-md border border-teal-500/30 bg-[var(--notes-surface,#fff)] px-2 py-1.5 text-[13px] shadow-xl dark:bg-[#161b23]">
                    <span>{dragging.icon}</span><span className="truncate">{dragging.label}</span>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {filtering && subjects.every((s) => !foldIncludes(s.name, treeQ) && !s.notes.some(noteMatch) && !s.chapters.some((c) => foldIncludes(c.title, treeQ) || c.notes.some(noteMatch)))
              && !(inbox && (inbox.notes.some(noteMatch) || inbox.chapters.some((c) => c.notes.some(noteMatch)))) && (
              <div className="px-3 py-6 text-center text-[12px] text-slate-500">
                Không có gì trong cây khớp “{treeQ}”.
                {cb.onOpenSearch && (
                  <button type="button" onClick={cb.onOpenSearch} className="mt-2 block w-full text-teal-700 hover:underline dark:text-teal-300">
                    Tìm trong nội dung (⌘K)
                  </button>
                )}
              </div>
            )}

          </>
        )}

        {/* ── Danh sách phẳng cho bộ lọc nhanh ── */}
        {filter !== 'tree' && (
          <div className="mb-2 px-0.5">
            <div className="mb-1 flex items-center gap-1.5 px-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
              {filter === 'favorites' && (<><Star className="h-3 w-3" /> Yêu thích</>)}
              {filter === 'archive' && (<><Archive className="h-3 w-3" /> Lưu trữ</>)}
              {filter === 'needs-review' && (<><AlertCircle className="h-3 w-3" /> Cần ôn</>)}
              {filter === 'trash' && (<><Trash2 className="h-3 w-3" /> Thùng rác · tự xoá sau 30 ngày</>)}
              <span className="ml-auto tabular-nums">{filteredNotes.length}</span>
            </div>
            {filteredNotes.length === 0 ? (
              <div className="px-3 py-6 text-center text-[12px] text-slate-500">
                {filter === 'favorites' && 'Chưa đánh dấu ghi chú nào.'}
                {filter === 'archive' && 'Không có ghi chú trong lưu trữ.'}
                {filter === 'needs-review' && 'Không có ghi chú cần ôn.'}
                {filter === 'trash' && 'Thùng rác đang trống.'}
              </div>
            ) : (
              filteredNotes.map((n) => (
                <button
                  key={`f-${n.id}`}
                  onClick={() => cb.onSelectNote(n.id)}
                  className={`flex min-h-[34px] w-full items-center gap-2 truncate rounded-md px-2 text-left text-[13px] ${
                    selectedNoteId === n.id ? 'bg-teal-500/[0.12] text-teal-800 dark:text-teal-200' : 'text-slate-700 hover:bg-black/[0.04] dark:text-slate-300 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  {filter === 'trash' ? <Trash2 className="h-3.5 w-3.5 shrink-0 text-rose-400" /> : <FileText className="h-3.5 w-3.5 shrink-0 opacity-60" />}
                  <span className="min-w-0 flex-1 truncate">{n.title || UNTITLED}</span>
                  {filter === 'trash' && n.deletedAt && <span className="shrink-0 text-[10.5px] text-slate-400">{trashDaysRemaining(n.deletedAt)} ngày</span>}
                  {n.isFavorite && filter !== 'favorites' && <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />}
                  {n.needsReview && filter !== 'needs-review' && <AlertCircle className="h-3 w-3 shrink-0 text-rose-400" />}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {menu && <NotesMenu anchor={menu.anchor} items={menu.items} onClose={closeMenu} align={menu.align ?? 'end'} width={248} />}
      {moving && (
        <NoteMovePicker
          tree={tree}
          noteTitle={moving.title}
          current={{ subjectId: moving.subjectId, chapterId: moving.chapterId }}
          onClose={() => setMoving(null)}
          onPick={async (subjectId, chapterId) => {
            setMoving(null);
            await cb.onMoveNote(moving.id, subjectId, chapterId);
            openMany(chapterId ? [sKey(subjectId), cKey(chapterId)] : [sKey(subjectId)]);
          }}
        />
      )}
      {emojiFor && (
        <EmojiPicker
          currentEmoji={emojiFor.emoji}
          onSelect={(emoji) => { cb.onChangeSubjectIcon(emojiFor.id, emoji); setEmojiFor(null); }}
          onClose={() => setEmojiFor(null)}
        />
      )}
    </div>
  );
}

/** Nhánh con có đường dẫn dọc mảnh canh giữa chevron của cha.
 *  ⚠️ Phải là component CẤP TỆP: khai báo bên trong NotesSidebar thì mỗi lần vẽ
 *  lại là một "loại" component mới ⇒ React gỡ và dựng lại cả nhánh con (mất ô
 *  đổi tên đang gõ, mất trạng thái kéo-thả). */
function Guide({ depth, children }: { depth: number; children: ReactNode }) {
  return (
    <div className="relative">
      <span aria-hidden className="pointer-events-none absolute bottom-1 top-0 w-px bg-black/[0.08] dark:bg-white/[0.08]" style={{ left: padFor(depth) + 8 }} />
      {children}
    </div>
  );
}

function trashDaysRemaining(deletedAt: string): number {
  const expires = new Date(deletedAt).getTime() + 30 * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((expires - Date.now()) / (24 * 60 * 60 * 1000)));
}

// ─── Kéo-thả: mỗi dòng là một sortable, nghe chuột/cảm ứng trên CẢ dòng ──
interface DragBits { listeners: Record<string, unknown> | undefined; isDragging: boolean }

function SortableRow({ id, disabled, children }: { id: number; disabled?: boolean; children: (d: DragBits) => ReactNode }) {
  const { listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };
  // CỐ Ý không rải `attributes` (role/tabIndex) và không dùng KeyboardSensor:
  // Enter/Space trên nút tên bên trong sẽ nổi bọt lên và bắt đầu một lượt kéo.
  return (
    <div ref={setNodeRef} style={style}>
      {children({ listeners: disabled ? undefined : (listeners as Record<string, unknown> | undefined), isDragging })}
    </div>
  );
}

// ─── Một dòng của cây ─────────────────────────────────────────
function TreeRow({
  kind, depth, treeKey, noteId, label, q, icon, open, count, pinned, active, menuOpen, editing, drag,
  onClick, onToggle, onStartRename, onRename, onCancelRename, onMenu, onDragLabel,
}: {
  kind: 'subject' | 'chapter' | 'note';
  depth: number;
  treeKey: string;
  noteId?: number;
  label: string;
  q: string;
  icon: ReactNode;
  open?: boolean;
  count?: number;
  pinned?: boolean;
  active: boolean;
  menuOpen: boolean;
  editing: boolean;
  drag?: DragBits;
  onClick: () => void;
  onToggle?: () => void;
  onStartRename?: () => void;
  onRename: (v: string) => void;
  onCancelRename: () => void;
  onMenu: (anchor: HTMLElement) => void;
  onDragLabel: () => void;
}) {
  const [val, setVal] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (!editing) setVal(label); }, [label, editing]);
  useEffect(() => {
    if (!editing) return;
    const id = requestAnimationFrame(() => { inputRef.current?.focus(); inputRef.current?.select(); });
    return () => cancelAnimationFrame(id);
  }, [editing]);
  // Hàm gọi lại đổi danh tính mỗi lần vẽ; phụ thuộc vào nó sẽ thành vòng lặp
  // (setDragging → vẽ lại → hàm mới → effect → setDragging…). Giữ qua ref.
  const dragLabelRef = useRef(onDragLabel);
  dragLabelRef.current = onDragLabel;
  useEffect(() => { if (drag?.isDragging) dragLabelRef.current(); }, [drag?.isDragging]);

  const commit = () => {
    const v = val.trim().replace(/\s+/g, ' ');
    if (v && v !== label) onRename(v); else onCancelRename();
  };

  const text = kind === 'subject'
    ? 'text-[13.5px] font-semibold tracking-tight text-slate-900 dark:text-slate-100'
    : kind === 'chapter'
      ? 'text-[13px] font-medium text-slate-700 dark:text-slate-300'
      : active ? 'text-[13px] font-medium text-teal-800 dark:text-teal-100' : 'text-[13px] text-slate-600 dark:text-slate-400';

  return (
    <div
      data-tree-key={treeKey}
      {...(noteId ? { 'data-note-row': noteId } : {})}
      {...(drag?.listeners ?? {})}
      onContextMenu={(e) => { e.preventDefault(); onMenu((e.currentTarget.querySelector('[data-row-menu]') as HTMLElement | null) ?? e.currentTarget); }}
      className={`group relative flex select-none items-center gap-1 rounded-md pr-1 transition-colors ${
        kind === 'subject' ? 'min-h-[34px] sm:min-h-[30px]' : 'min-h-[34px] sm:min-h-[28px]'
      } ${
        active
          ? 'bg-teal-500/[0.12] dark:bg-teal-400/[0.12]'
          : menuOpen ? 'bg-black/[0.05] dark:bg-white/[0.06]' : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
      }`}
      style={{ paddingLeft: padFor(depth) }}
    >
      {active && <span aria-hidden className="absolute bottom-1 left-0 top-1 w-[2.5px] rounded-full bg-teal-500" />}
      {kind !== 'note' ? (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
          className="flex h-6 w-4 shrink-0 items-center justify-center text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200"
          aria-label={open ? 'Gập' : 'Mở'}
          aria-expanded={open}
        >
          <ChevronRight className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? 'rotate-90' : ''}`} />
        </button>
      ) : (
        <span className="w-4 shrink-0" aria-hidden />
      )}
      <span className="flex w-5 shrink-0 items-center justify-center">{icon}</span>

      {editing ? (
        <input
          ref={inputRef}
          value={val}
          maxLength={200}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter') { e.preventDefault(); commit(); }
            if (e.key === 'Escape') { e.preventDefault(); onCancelRename(); }
          }}
          aria-label="Đổi tên"
          className="min-w-0 flex-1 rounded bg-[var(--notes-surface,#fff)] px-1 py-0.5 text-[13px] text-slate-900 ring-1 ring-teal-500/60 focus:outline-none dark:bg-slate-800 dark:text-slate-100"
        />
      ) : (
        <button
          type="button"
          onClick={onClick}
          onDoubleClick={onStartRename ? (e) => { e.preventDefault(); onStartRename(); } : undefined}
          title={onStartRename ? `${label} — nhấp đúp để đổi tên` : label}
          className={`min-w-0 flex-1 truncate py-1 pl-0.5 text-left ${text}`}
        >
          <Highlight text={label} q={q} />
        </button>
      )}

      {!editing && pinned && <Pin className="h-3 w-3 shrink-0 text-amber-500/80" aria-label="Đã ghim" />}
      {!editing && typeof count === 'number' && count > 0 && (
        <span className="shrink-0 px-0.5 text-[11px] tabular-nums text-slate-400 group-hover:hidden dark:text-slate-500 [@media(hover:none)]:hidden">{count}</span>
      )}
      {!editing && (
        <button
          type="button"
          data-row-menu
          onClick={(e) => { e.stopPropagation(); onMenu(e.currentTarget); }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          title="Tuỳ chọn"
          aria-label={`Tuỳ chọn cho ${label}`}
          aria-haspopup="menu"
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-500 hover:bg-black/[0.07] hover:text-slate-900 focus-visible:opacity-100 dark:text-slate-400 dark:hover:bg-white/[0.1] dark:hover:text-slate-100 [@media(hover:none)]:opacity-100 ${
            menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function SubjectIcon({ emoji, color, onClick }: { emoji: string | null; color: string | null; onClick?: () => void }) {
  const tint = color && /^#[0-9a-f]{6}$/i.test(color) ? `${color}2e` : undefined;
  const inner = (
    <span
      className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-black/[0.05] text-[12.5px] leading-none dark:bg-white/[0.07]"
      style={tint ? { background: tint, boxShadow: `inset 0 0 0 1px ${color}55` } : undefined}
    >
      {emoji || '📚'}
    </span>
  );
  if (!onClick) return inner;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onMouseDown={(e) => e.stopPropagation()}
      title="Đổi biểu tượng"
      aria-label="Đổi biểu tượng"
      className="rounded-[6px] hover:ring-1 hover:ring-black/10 dark:hover:ring-white/15"
    >
      {inner}
    </button>
  );
}

function SectionHeader({ icon, label, count, open, onClick }: { icon: ReactNode; label: string; count?: number; open?: boolean; onClick?: () => void }) {
  const content = (
    <>
      {onClick && <ChevronRight className={`h-3 w-3 transition-transform ${open ? 'rotate-90' : ''}`} />}
      {icon}
      <span>{label}</span>
      {typeof count === 'number' && <span className="ml-auto pr-1 tabular-nums font-normal">{count}</span>}
    </>
  );
  const cls = 'mb-0.5 mt-1 flex w-full items-center gap-1.5 px-1.5 py-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500';
  return onClick
    ? <button type="button" onClick={onClick} aria-expanded={open} className={`${cls} rounded hover:text-slate-800 dark:hover:text-slate-300`}>{content}</button>
    : <div className={cls}>{content}</div>;
}

function PinnedRow({ label, sub, icon, active, menuOpen, onClick, onUnpin, onMenu }: {
  label: string; sub: string; icon: ReactNode; active: boolean; menuOpen: boolean;
  onClick: () => void; onUnpin: () => void; onMenu: (el: HTMLElement) => void;
}) {
  return (
    <div className={`group flex min-h-[34px] items-center gap-1 rounded-md pl-2 pr-1 sm:min-h-[30px] ${
      active ? 'bg-teal-500/[0.12]' : menuOpen ? 'bg-black/[0.05] dark:bg-white/[0.06]' : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
    }`}>
      <button type="button" onClick={onClick} className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left" title={`${label} — ${sub}`}>
        <span className="w-5 shrink-0 text-center text-[12.5px] leading-none">{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] text-slate-700 dark:text-slate-200">{label}</span>
        </span>
        <span className="hidden max-w-[40%] shrink truncate text-[10.5px] text-slate-400 sm:block">{sub}</span>
      </button>
      <button
        type="button"
        onClick={onUnpin}
        title="Bỏ ghim"
        aria-label={`Bỏ ghim ${label}`}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-amber-600 opacity-0 hover:bg-amber-500/15 focus-visible:opacity-100 group-hover:opacity-100 dark:text-amber-400 [@media(hover:none)]:opacity-100"
      >
        <PinOff className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={(e) => onMenu(e.currentTarget)}
        title="Tuỳ chọn"
        aria-label={`Tuỳ chọn cho ${label}`}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-slate-500 hover:bg-black/[0.07] focus-visible:opacity-100 dark:text-slate-400 dark:hover:bg-white/[0.1] [@media(hover:none)]:opacity-100 ${menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
}

function EmptyHint({ depth, onClick, children }: { depth: number; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[28px] w-full items-center gap-1.5 rounded-md pr-2 text-left text-[12px] italic text-slate-400 hover:bg-black/[0.03] hover:text-teal-700 dark:text-slate-500 dark:hover:bg-white/[0.04] dark:hover:text-teal-300"
      style={{ paddingLeft: padFor(depth) + 20 }}
    >
      {children}
    </button>
  );
}

function FilterPill({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[26px] shrink-0 items-center gap-1 rounded-full px-2.5 text-[11.5px] font-medium transition-colors ${
        active
          ? 'bg-teal-600/[0.12] text-teal-800 ring-1 ring-teal-600/30 dark:bg-teal-400/[0.14] dark:text-teal-100 dark:ring-teal-400/30'
          : 'text-slate-600 hover:bg-black/[0.05] hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.06] dark:hover:text-slate-200'
      }`}
      aria-pressed={active}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ─── Bảng chọn biểu tượng môn ─────────────────────────────────
const FOLDER_EMOJIS = [
  '📚', '📘', '📗', '📙', '📕', '📓', '📒', '📔', '📑', '🔖', '📌', '📝',
  '💻', '🖥️', '⌨️', '💾', '🧮', '🔢', '🔤', '✏️', '🖊️', '📖', '📄', '📰',
  '📋', '📎', '🗂️', '🗃️', '🗄️', '💰', '💵', '💳', '🧾', '💹', '📊', '📈',
  '📉', '📆', '🗓️', '🔗', '🌐', '🌍', '🗺️', '🏫', '🏢', '🏦', '🏥', '🔭',
  '🔬', '🧬', '🧪', '🧲', '⚗️', '💡', '🎓', '🎒', '🎨', '🎭', '🎬', '🎤',
  '🎧', '🎹', '🎸', '🎵', '⭐', '🌟', '✨', '🌙', '🌞', '❤️', '🧡', '💛',
  '💚', '💙', '💜', '🖤', '⚛️', '🧠', '🗣️', '🇬🇧', '🇯🇵', '🇨🇳', '🇰🇷', '🇻🇳',
];

function EmojiPicker({ currentEmoji, onSelect, onClose }: { currentEmoji: string; onSelect: (emoji: string) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[96] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 max-h-80 w-80 overflow-y-auto rounded-xl border border-black/[0.08] bg-[var(--notes-surface,#fff)] p-3 shadow-2xl dark:border-white/10 dark:bg-[#161b23]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Chọn biểu tượng môn</h3>
          <button onClick={onClose} aria-label="Đóng" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="h-4 w-4" /></button>
        </div>
        <div className="grid grid-cols-8 gap-1">
          {FOLDER_EMOJIS.map((emoji, i) => (
            <button
              key={`${emoji}-${i}`}
              onClick={() => onSelect(emoji)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-lg transition-colors ${
                emoji === currentEmoji ? 'bg-teal-100 ring-2 ring-teal-500 dark:bg-teal-500/20' : 'hover:bg-black/[0.05] dark:hover:bg-white/10'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
