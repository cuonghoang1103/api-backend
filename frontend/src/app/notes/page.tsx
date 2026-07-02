'use client';

// Notes — personal study workspace (per-user).
// Phase 1: load the Subjects→Chapters→Notes tree, full CRUD from
// the sidebar, and a TipTap editor with debounced auto-save +
// image paste. Two-pane on desktop; the sidebar becomes a drawer
// on mobile. Calm, low-distraction design — no animated bg.

import { useCallback, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, NotebookPen, Loader2, Search, Paperclip, X, GraduationCap, FileDown, Sun, Moon, FileText, XCircle, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { notesApi, noteShareApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { NoteSubjectTree, NoteRecent, NoteFull, NoteSubjectFull, NoteTab } from '@/types';
import type { NoteSharedSubjectFull } from '@/lib/api';
import NotesSidebar from '@/components/notes/NotesSidebar';
import NoteEditor from '@/components/notes/NoteEditor';
import SharedNoteViewer from '@/components/notes/SharedNoteViewer';
import NoteResourcePanel from '@/components/notes/NoteResourcePanel';
import VocabTable from '@/components/notes/VocabTable';
import FlashcardReview from '@/components/notes/FlashcardReview';
import SubjectView from '@/components/notes/SubjectView';
import NotesSearch from '@/components/notes/NotesSearch';
import NotesShareManagerModal from '@/components/notes/NotesShareManagerModal';
import NotesSharedWithMe from '@/components/notes/NotesSharedWithMe';
import { exportNoteAsPdf } from '@/lib/notesPdf';
import { NotesThemeProvider, useNotesTheme } from '@/components/notes/NotesThemeProvider';
import { Sparkles } from 'lucide-react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function NotesPage() {
  // Wrap với theme provider để tất cả component con (sidebar,
  // editor, search, modal, ...) có thể đọc theme qua hook
  // useNotesTheme() và Tailwind utility `dark:` hoạt động
  // đúng nhờ class `dark` được thêm vào root wrapper.
  return (
    <NotesThemeProvider>
      <NotesPageInner />
    </NotesThemeProvider>
  );
}

// ─── Tab Persistence ──────────────────────────────────────────────
const TABS_STORAGE_KEY = 'notes-open-tabs';
const ACTIVE_TAB_KEY = 'notes-active-tab';

// Helper to generate unique tab id
function makeTabId(type: 'note' | 'subject', entityId: number): string {
  return `${type}-${entityId}`;
}

// Load persisted tabs from localStorage
function loadPersistedTabs(): { tabs: NoteTab[]; activeTabId: string | null } {
  if (typeof window === 'undefined') return { tabs: [], activeTabId: null };
  try {
    const raw = window.localStorage.getItem(TABS_STORAGE_KEY);
    const activeTabId = window.localStorage.getItem(ACTIVE_TAB_KEY);
    if (raw) {
      const tabs = JSON.parse(raw);
      if (Array.isArray(tabs) && tabs.length > 0) {
        return { tabs, activeTabId: activeTabId || tabs[0]?.id || null };
      }
    }
  } catch {
    // ignore
  }
  return { tabs: [], activeTabId: null };
}

// Save tabs to localStorage
function saveTabsToStorage(tabs: NoteTab[], activeTabId: string | null) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(TABS_STORAGE_KEY, JSON.stringify(tabs));
    if (activeTabId) {
      window.localStorage.setItem(ACTIVE_TAB_KEY, activeTabId);
    } else {
      window.localStorage.removeItem(ACTIVE_TAB_KEY);
    }
  } catch {
    // ignore
  }
}

// A single draggable tab in the tab bar. Only the drag handle (left side)
// receives the dnd-kit listeners to prevent keyboard characters like "_"
// from triggering drag activation. The close button and rest of the tab
// only receive click events.
function SortableTab({
  tab, active, onSwitch, onClose,
}: {
  tab: NoteTab; active: boolean; onSwitch: () => void; onClose: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSwitch}
      {...attributes}
      className={`group flex cursor-grab items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap min-w-0 ${
        active
          ? 'bg-teal-100 text-teal-800 dark:bg-teal-500/15 dark:text-teal-100'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.05]'
      }`}
    >
      {/* Drag handle — only this gets the dnd-kit keyboard listeners */}
      <div
        {...listeners}
        className="flex items-center gap-1 shrink-0"
      >
        {tab.type === 'subject' ? (
          tab.emoji ? (
            <span className="text-[13px]">{tab.emoji}</span>
          ) : tab.color ? (
            <span className="h-2 w-2 rounded-full" style={{ background: tab.color }} />
          ) : (
            <span className="text-[13px]">📁</span>
          )
        ) : (
          <FileText className="h-3.5 w-3.5" />
        )}
      </div>
      <span className="truncate max-w-[120px]">{tab.title || 'Không có tiêu đề'}</span>
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        onPointerDown={(e) => e.stopPropagation()}
        className="ml-1 flex h-5 w-5 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-white/10"
        aria-label="Đóng tab"
      >
        <XCircle className="h-3 w-3" />
      </button>
    </div>
  );
}

function NotesPageInner() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { theme, setTheme } = useNotesTheme();

  // Resizable desktop sidebar (Notion-style). Persisted to localStorage.
  const [sidebarWidth, setSidebarWidth] = useState(288);
  useEffect(() => {
    const raw = window.localStorage.getItem('notes-sidebar-width');
    if (raw) { const n = parseInt(raw, 10); if (!Number.isNaN(n)) setSidebarWidth(Math.min(560, Math.max(240, n))); }
  }, []);
  useEffect(() => {
    try { window.localStorage.setItem('notes-sidebar-width', String(sidebarWidth)); } catch { /* ignore */ }
  }, [sidebarWidth]);
  const startSidebarResize = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    let startW = 288;
    setSidebarWidth((w) => { startW = w; return w; });
    const onMove = (ev: PointerEvent) => {
      const next = Math.min(560, Math.max(240, startW + (ev.clientX - startX)));
      setSidebarWidth(next);
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      document.body.style.userSelect = '';
    };
    document.body.style.userSelect = 'none';
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }, []);
  const [tree, setTree] = useState<NoteSubjectTree[]>([]);
  const [recent, setRecent] = useState<NoteRecent[]>([]);
  const [selected, setSelected] = useState<NoteFull | null>(null);
  const [subjectView, setSubjectView] = useState<NoteSubjectFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  // ─── PART 1: Multi-tab state ──────────────────────────────────
  const [openTabs, setOpenTabs] = useState<NoteTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const tabsRestoredRef = useRef(false);

  // Load persisted tabs on mount (only once)
  useEffect(() => {
    if (!isAuthenticated || tabsRestoredRef.current) return;
    const { tabs, activeTabId: savedActiveTabId } = loadPersistedTabs();
    if (tabs.length > 0) {
      setOpenTabs(tabs);
      setActiveTabId(savedActiveTabId);
      tabsRestoredRef.current = true;
    }
  }, [isAuthenticated]);

  // Persist tabs whenever they change
  useEffect(() => {
    if (!tabsRestoredRef.current || openTabs.length === 0) return;
    saveTabsToStorage(openTabs, activeTabId);
  }, [openTabs, activeTabId]);

  // ─── Tab actions ───────────────────────────────────────────────
  const openTab = useCallback((type: 'note' | 'subject', entityId: number, title: string, emoji?: string | null, color?: string | null) => {
    const tabId = makeTabId(type, entityId);
    setOpenTabs(prev => {
      const existing = prev.find(t => t.id === tabId);
      if (existing) {
        return prev; // Already open
      }
      const newTab: NoteTab = { id: tabId, type, entityId, title, emoji, color };
      const next = [...prev, newTab];
      saveTabsToStorage(next, tabId);
      return next;
    });
    setActiveTabId(tabId);
  }, []);

  const closeTab = useCallback((tabId: string) => {
    setOpenTabs(prev => {
      const idx = prev.findIndex(t => t.id === tabId);
      const next = prev.filter(t => t.id !== tabId);
      // If closing active tab, switch to adjacent tab
      if (activeTabId === tabId && next.length > 0) {
        const newActiveIdx = Math.min(idx, next.length - 1);
        const newActiveTab = next[newActiveIdx];
        setActiveTabId(newActiveTab.id);
        saveTabsToStorage(next, newActiveTab.id);
      } else {
        saveTabsToStorage(next, activeTabId);
      }
      return next;
    });
  }, [activeTabId]);

  const switchToTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
    saveTabsToStorage(openTabs, tabId);
  }, [openTabs]);

  // Drag-to-reorder the open tabs (dnd-kit, horizontal).
  const tabSensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const handleTabDragEnd = useCallback((e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setOpenTabs((prev) => {
      const oldIndex = prev.findIndex((t) => t.id === active.id);
      const newIndex = prev.findIndex((t) => t.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return prev;
      const next = arrayMove(prev, oldIndex, newIndex);
      saveTabsToStorage(next, activeTabId);
      return next;
    });
  }, [activeTabId]);

  // When a tab is activated by user, update the view
  const activateTabView = useCallback((tab: NoteTab) => {
    if (tab.type === 'note') {
      selectNote(tab.entityId);
    } else {
      openSubject(tab.entityId);
    }
  }, []);

  // Activate tab view when activeTabId changes
  useEffect(() => {
    if (!activeTabId) return;
    const tab = openTabs.find(t => t.id === activeTabId);
    if (tab) {
      activateTabView(tab);
    }
  }, [activeTabId, openTabs, activateTabView]);
  // Phase 3d: sidebar filter pills. `tree` is the default hierarchical
  // view; the other three flatten the matching notes into a single
  // list (favorites / archive / needs-review) so the user can act
  // on them in bulk without drilling into each subject.
  const [filter, setFilter] = useState<'tree' | 'favorites' | 'archive' | 'needs-review'>('tree');
  const [filteredNotes, setFilteredNotes] = useState<import('@/types').NoteSummary[]>([]);

  // Phase 4: Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharingSubject, setSharingSubject] = useState<NoteSubjectTree | null>(null);

  // Phase 4: Shared with me state
  const [sharedSubject, setSharedSubject] = useState<NoteSharedSubjectFull | null>(null);
  const [sharedSelectedNote, setSharedSelectedNote] = useState<any | null>(null);

  const handleOpenShare = useCallback((subject: NoteSubjectTree) => {
    setSharingSubject(subject);
    setShareModalOpen(true);
  }, []);

  // Handle opening a shared subject
  const handleOpenSharedSubject = useCallback(async (subjectId: number) => {
    try {
      const res = await noteShareApi.getReceivedSubject(subjectId);
      setSharedSubject(res.data.data);
      setSelected(null);
      setSubjectView(null);
      setSharedSelectedNote(null);
    } catch {
      toast.error('Không tải được nội dung chia sẻ');
    }
  }, []);

  // Handle opening a note from shared subject - fetch full content
  const handleOpenSharedNote = useCallback(async (subjectId: number, noteId: number) => {
    try {
      // Load full note content from API
      const res = await noteShareApi.getSharedNote(subjectId, noteId);
      setSharedSelectedNote(res.data.data);
    } catch {
      toast.error('Không tải được nội dung ghi chú');
    }
  }, []);

  const handleShareChanged = useCallback(() => {
    // Refresh will happen naturally when user interacts
  }, []);

  const refreshTree = useCallback(async () => {
    const res = await notesApi.getTree();
    const data = res.data.data;
    setTree(data.tree);
    setRecent(data.recent);
    return data.tree;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    refreshTree().finally(() => setLoading(false));
  }, [isAuthenticated, refreshTree]);

  // Phase 3d: when the user picks a filter pill, fetch the flat
  // list. Cached in state so toggling back to "tree" is instant.
  useEffect(() => {
    if (!isAuthenticated || filter === 'tree') return;
    let cancelled = false;
    (async () => {
      try {
        const res = await notesApi.getFilteredNotes(filter);
        if (!cancelled) setFilteredNotes(res.data.data.notes);
      } catch { if (!cancelled) setFilteredNotes([]); }
    })();
    return () => { cancelled = true; };
  }, [filter, isAuthenticated]);

  // ─── Selection ─────────────────────────────────────────────
  const selectNote = useCallback(async (id: number) => {
    setDrawerOpen(false);
    setSubjectView(null);
    setSharedSubject(null); // Close shared subject view
    setSharedSelectedNote(null);
    try {
      const res = await notesApi.getNote(id);
      setSelected(res.data.data);
      // Open in tab
      const note = res.data.data;
      openTab('note', id, note.title);
    } catch { /* note may have been deleted; ignore */ }
  }, [openTab]);

  const openSubject = useCallback(async (id: number) => {
    setDrawerOpen(false);
    setSelected(null);
    setSharedSubject(null); // Close shared subject view
    setSharedSelectedNote(null);
    try {
      const res = await notesApi.getSubject(id);
      setSubjectView(res.data.data);
      // Open in tab
      const subject = res.data.data;
      openTab('subject', id, subject.name, subject.emoji, subject.color);
    } catch { /* ignore */ }
  }, [openTab]);

  // Re-fetch the open note (after attachment/link changes) so the
  // resource panel reflects the latest without a full tree refresh.
  const refreshSelected = useCallback(async () => {
    if (!selected) return;
    try { const res = await notesApi.getNote(selected.id); setSelected(res.data.data); } catch { /* ignore */ }
  }, [selected]);

  const refreshSubject = useCallback(async () => {
    if (!subjectView) return;
    try { const res = await notesApi.getSubject(subjectView.id); setSubjectView(res.data.data); } catch { /* ignore */ }
  }, [subjectView]);

  // Cmd/Ctrl+K opens global search.
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // ─── Mutations (refresh tree after structural changes) ─────
  const addSubject = useCallback(async () => {
    await notesApi.createSubject({ name: 'Môn học mới', emoji: '📘' });
    await refreshTree();
  }, [refreshTree]);

  const addChapter = useCallback(async (subjectId: number) => {
    await notesApi.createChapter({ subjectId, title: 'Chương mới' });
    await refreshTree();
  }, [refreshTree]);

  const addNote = useCallback(async (subjectId: number, chapterId: number | null) => {
    const res = await notesApi.createNote({ subjectId, chapterId, title: 'Ghi chú mới' });
    await refreshTree();
    setSelected(res.data.data);
  }, [refreshTree]);

 const renameSubject = useCallback(async (id: number, name: string) => { await notesApi.updateSubject(id, { name }); await refreshTree(); }, [refreshTree]);
 const renameChapter = useCallback(async (id: number, title: string) => { await notesApi.updateChapter(id, { title }); await refreshTree(); }, [refreshTree]);
 const renameNote = useCallback(async (id: number, title: string) => {
 await notesApi.updateNote(id, { title });
 await refreshTree();
 setSelected((s) => (s && s.id === id ? { ...s, title } : s));
 }, [refreshTree]);

 const delSubject = useCallback(async (id: number) => {
 if (!confirm('Xoá môn học này và toàn bộ chương/ghi chú bên trong?')) return;
 await notesApi.deleteSubject(id); setSelected((s) => (s?.subjectId === id ? null : s)); await refreshTree();
 }, [refreshTree]);
 const delChapter = useCallback(async (id: number) => {
 if (!confirm('Xoá chương này? (ghi chú bên trong sẽ chuyển về môn học)')) return;
 await notesApi.deleteChapter(id); await refreshTree();
 }, [refreshTree]);
 const delNote = useCallback(async (id: number) => {
 if (!confirm('Xoá ghi chú này?')) return;
 await notesApi.deleteNote(id); setSelected((s) => (s?.id === id ? null : s)); await refreshTree();
 }, [refreshTree]);

 // ─── Reorder (Phase 2.5) ──────────────────────────────────
 // Each reorder callback optimistically applies the new order to
 // local state so the UI snaps to the drop position immediately,
 // then asks the server to persist it. If the server rejects (e.g.
 // 401, network error) we fall back to refreshTree() to restore
 // the canonical order from the DB — the user sees a brief jitter
 // but no data is lost. We do NOT block the UI on the API; the
 // server endpoint is idempotent so a duplicate click is safe.
 const reorderSubjectsCb = useCallback(async (orderedIds: number[]) => {
 setTree((prev) => subjectOrderFromIds(prev, orderedIds));
 try {
 await notesApi.reorderSubjects(orderedIds);
 } catch { await refreshTree(); }
 }, [refreshTree]);

 const reorderChaptersCb = useCallback(async (subjectId: number, orderedIds: number[]) => {
 setTree((prev) => prev.map((s) => s.id === subjectId
 ? { ...s, chapters: chapterOrderFromIds(s.chapters, orderedIds) }
 : s));
 try {
 await notesApi.reorderChapters(subjectId, orderedIds);
 } catch { await refreshTree(); }
 }, [refreshTree]);

 // Notes can be reordered either at subject-root scope (chapterId
 // null) or inside a chapter. The sidebar sends a flat list of the
 // row ids in the scope that was dragged; we cannot know here which
 // scope it was, so we look up each id in the current tree and
 // update sortOrder for the matching scope. If a note lives at
 // subject-root (chapterId null) it appears in subject.notes;
 // otherwise it appears in some chapter.notes of the same subject.
 // The server's `reorderNotes` updates sortOrder for whatever note
 // ids we send — we update BOTH the local state and the server in
 // the same shape so the optimistic write stays consistent.
 const reorderNotesCb = useCallback(async (orderedIds: number[]) => {
 setTree((prev) => prev.map((s) => {
 // Find which sub-list the orderedIds belong to
 const inSubjectRoot = orderedIds.every((id) => s.notes.some((n) => n.id === id));
 const inSomeChapter = orderedIds.every((id) => s.chapters.some((c) => c.notes.some((n) => n.id === id)));
 if (inSubjectRoot) {
 return { ...s, notes: noteOrderFromIds(s.notes, orderedIds) };
 }
 if (inSomeChapter) {
 return {
 ...s,
 chapters: s.chapters.map((c) => orderedIds.every((id) => c.notes.some((n) => n.id === id))
 ? { ...c, notes: noteOrderFromIds(c.notes, orderedIds) }
 : c),
 };
 }
 return s;
 }));
 try {
 await notesApi.reorderNotes(orderedIds);
 } catch { await refreshTree(); }
 }, [refreshTree]);

  // ─── Editor save ───────────────────────────────────────────
  const saveNote = useCallback(async (patch: Partial<{ title: string; contentJson: Record<string, unknown> | null; contentHtml: string | null; isFavorite: boolean; isArchived: boolean; needsReview: boolean }>) => {
    if (!selected) return;
    await notesApi.updateNote(selected.id, patch);
    if (patch.title !== undefined) {
      // Keep the sidebar + selected title in sync without a full refetch.
      const t = patch.title;
      setSelected((s) => (s && s.id === selected.id ? { ...s, title: t } : s));
      setTree((prev) => prev.map((subj) => ({
        ...subj,
        notes: subj.notes.map((n) => (n.id === selected.id ? { ...n, title: t } : n)),
        chapters: subj.chapters.map((ch) => ({ ...ch, notes: ch.notes.map((n) => (n.id === selected.id ? { ...n, title: t } : n)) })),
      })));
    }
  // Phase 3d — keep the open note + tree in sync after a flag toggle.
  // We mutate the local copies so the sidebar's flat list view
  // (favorites / archive / needs-review) updates without a refetch.
  const flagPatch: Partial<Pick<import('@/types').NoteFull, 'isFavorite' | 'isArchived' | 'needsReview'>> = {};
  if (patch.isFavorite !== undefined) flagPatch.isFavorite = patch.isFavorite;
  if (patch.isArchived !== undefined) flagPatch.isArchived = patch.isArchived;
  if (patch.needsReview !== undefined) flagPatch.needsReview = patch.needsReview;
  if (Object.keys(flagPatch).length > 0) {
    setSelected((s) => (s && s.id === selected.id ? { ...s, ...flagPatch } : s));
    setTree((prev) => prev.map((subj) => ({
      ...subj,
      notes: subj.notes.map((n) => (n.id === selected.id ? { ...n, ...flagPatch } : n)),
      chapters: subj.chapters.map((ch) => ({ ...ch, notes: ch.notes.map((n) => (n.id === selected.id ? { ...n, ...flagPatch } : n)) })),
    })));
    // If the active filter hides the newly-archived / un-favourited
    // note, refresh the flat list so the count stays accurate.
    if (filter !== 'tree') {
      try {
        const res = await notesApi.getFilteredNotes(filter);
        setFilteredNotes(res.data.data.notes);
      } catch { /* ignore */ }
    }
  }
  }, [selected, filter]);

  // Phase 3d — PDF export. Fetch the canonical HTML from the
  // server (so the editor's in-flight edits stay out of the
  // document) and feed it to the client-side jspdf pipeline.
  const [pdfBusy, setPdfBusy] = useState(false);
  const exportPdf = useCallback(async () => {
    if (!selected || pdfBusy) return;
    setPdfBusy(true);
    try {
      const res = await notesApi.exportNoteHtml(selected.id);
      await exportNoteAsPdf(res.data.data);
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert('Xuất PDF thất bại: ' + (e instanceof Error ? e.message : 'lỗi không xác định'));
    } finally {
      setPdfBusy(false);
    }
  }, [selected, pdfBusy]);

   // ─── PART 2: Pin callbacks ─────────────────────────────────────
   const togglePinSubject = useCallback(async (id: number, pinned: boolean) => {
     await notesApi.updateSubject(id, { isPinned: pinned });
     await refreshTree();
   }, [refreshTree]);

   const togglePinNote = useCallback(async (id: number, pinned: boolean) => {
     await notesApi.updateNote(id, { isPinned: pinned });
     await refreshTree();
   }, [refreshTree]);

   // ─── PART 3: Change subject icon ─────────────────────────────────
   const changeSubjectIcon = useCallback(async (id: number, emoji: string) => {
     await notesApi.updateSubject(id, { emoji });
     await refreshTree();
   }, [refreshTree]);

   // Emoji picker is managed in the sidebar component, not here
   const openEmojiPicker = useCallback(async (subjectId: number) => {
     // The emoji picker state is in the sidebar, but we need to get the current emoji
     // from the tree. For now, this is handled by the sidebar component directly.
     // This callback is just a placeholder for potential future use.
   }, []);

   const callbacks = {
    onSelectNote: selectNote,
    onOpenSubject: openSubject,
    onAddSubject: addSubject,
    onAddChapter: addChapter,
    onAddNote: addNote,
    onRenameSubject: renameSubject,
    onRenameChapter: renameChapter,
    onRenameNote: renameNote,
    onDeleteSubject: delSubject,
    onDeleteChapter: delChapter,
    onDeleteNote: delNote,
    onReorderSubjects: reorderSubjectsCb,
    onReorderChapters: reorderChaptersCb,
    onReorderNotes: reorderNotesCb,
    onChangeFilter: setFilter,
    onShareSubject: handleOpenShare,
    onPinSubject: togglePinSubject,
    onPinNote: togglePinNote,
    onChangeSubjectIcon: changeSubjectIcon,
    };

   const treeSubjectFor = (id: number) => tree.find((s) => s.id === id);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#0c0f14] px-6 text-center">
        <div>
          <NotebookPen className="mx-auto mb-3 h-8 w-8 text-teal-400/70" />
          <p className="text-slate-300">Đăng nhập để dùng Sổ tay học tập của bạn.</p>
          <a href="/login?next=/notes" className="mt-4 inline-block rounded-lg border border-teal-500/30 bg-teal-500/10 px-4 py-2 text-sm text-teal-200 hover:bg-teal-500/20">Đăng nhập</a>
        </div>
      </div>
    );
  }

  const sidebar = (
    <>
      <NotesSidebar
        tree={tree}
        recent={recent}
        selectedNoteId={selected?.id ?? null}
        filter={filter}
        filteredNotes={filteredNotes}
        {...callbacks}
      />
      <NotesSharedWithMe
        onOpenSharedSubject={handleOpenSharedSubject}
        onOpenSharedNote={handleOpenSharedNote}
        selectedNoteId={sharedSelectedNote?.id ?? null}
      />
    </>
  );

  return (
    <div className="notes-page h-[100dvh] pt-16
      bg-[var(--notes-bg,#ffffff)] text-[var(--notes-text,#1e293b)]
      dark:bg-[#0c0f14] dark:text-slate-200">
      <div className="flex h-full">
        {/* Desktop sidebar — resizable (drag the right edge, Notion-style) */}
        <aside
          style={{ width: sidebarWidth }}
          className="relative hidden shrink-0 border-r
          border-[var(--notes-border,#e2e8f0)] bg-[var(--notes-sidebar-bg,#ffffff)]
          md:block
          dark:border-white/[0.06] dark:bg-[#0e1218]">
          {sidebar}
          {/* Resize handle */}
          <div
            onPointerDown={startSidebarResize}
            onDoubleClick={() => setSidebarWidth(288)}
            title="Kéo để đổi rộng (nhấp đúp để về mặc định)"
            className="absolute -right-0.5 top-0 z-20 h-full w-1.5 cursor-col-resize hover:bg-teal-500/40 active:bg-teal-500/60"
          />
        </aside>

        {/* Editor pane */}
        <main className="relative min-w-0 flex-1 overflow-y-auto pb-24 sm:pb-0">
          {/* Toolbar (search always; menu + resources contextual) */}
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-[var(--notes-border,#e2e8f0)] bg-[var(--notes-toolbar-bg,#ffffff)]/90 px-3 py-2 backdrop-blur
            dark:border-white/[0.06] dark:bg-[#0c0f14]/90">
            <button onClick={() => setDrawerOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.05] md:hidden" aria-label="Mở danh sách">
              <Menu className="h-5 w-5" />
            </button>
            <button onClick={() => setSearchOpen(true)} className="flex min-h-[36px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[13px] text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-400 dark:hover:bg-white/[0.05] dark:hover:text-slate-200">
              <Search className="h-4 w-4" /> <span className="hidden sm:inline">Tìm kiếm</span>
              <kbd className="ml-1 hidden rounded bg-slate-200 px-1.5 text-[10px] text-slate-500 dark:bg-white/[0.06] md:inline">⌘K</kbd>
            </button>
            <div className="flex-1" />
            {/* Theme picker — chọn rõ ràng: Trắng / Tối / Nâu. Dùng nút
                riêng cho từng theme (thay vì 1 nút xoay vòng khó hiểu) để
                người dùng bấm thẳng vào "Trắng" là ra giao diện trắng. */}
            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 p-0.5 dark:border-white/[0.08]">
              {([
                { key: 'light', label: 'Trắng', Icon: Sun },
                { key: 'dark', label: 'Tối', Icon: Moon },
                { key: 'brown', label: 'Nâu', Icon: Sparkles },
              ] as const).map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  title={`Giao diện ${label}`}
                  aria-label={`Giao diện ${label}`}
                  aria-pressed={theme === key}
                  className={`flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors ${
                    theme === key
                      ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
            {selected && (
              <>
                <button
                  onClick={exportPdf}
                  disabled={pdfBusy}
                  title="Xuất PDF"
                  aria-label="Xuất PDF"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-white/[0.05]"
                >
                  <FileDown className="h-[18px] w-[18px]" />
                </button>
                <button onClick={() => setResourceOpen(true)} title="Tệp & liên kết" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.05]" aria-label="Tệp & liên kết">
                  <Paperclip className="h-[18px] w-[18px]" />
                  {(() => {
                    // Defence-in-depth: child collections should always be
                    // arrays on the server, but a future code path that
                    // forgets to include them would crash the whole page
                    // here. Treat missing as empty instead.
                    const att = selected.attachments?.length ?? 0;
                    const lnk = selected.links?.length ?? 0;
                    return att + lnk > 0 ? (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-teal-500 px-1 text-[9px] font-bold text-white">{att + lnk}</span>
                    ) : null;
                  })()}
                </button>
              </>
            )}
          </div>

          {/* PART 1: Tab Bar — drag to reorder (dnd-kit, horizontal) */}
          {openTabs.length > 0 && (
            <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-3 py-1.5 overflow-x-auto dark:border-white/[0.06] dark:bg-[#0e1218]">
              <DndContext sensors={tabSensors} collisionDetection={closestCenter} onDragEnd={handleTabDragEnd}>
                <SortableContext items={openTabs.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
                  <div className="flex items-center gap-1">
                    {openTabs.map((tab) => (
                      <SortableTab
                        key={tab.id}
                        tab={tab}
                        active={activeTabId === tab.id}
                        onSwitch={() => switchToTab(tab.id)}
                        onClose={() => closeTab(tab.id)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {loading ? (
            <div className="flex h-[60vh] items-center justify-center text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : sharedSelectedNote ? (
            // Read-only note view for shared notes - full TipTap rendering.
            // ── MUST be checked BEFORE sharedSubject: opening a note from
            // inside a shared-subject view sets sharedSelectedNote while
            // sharedSubject stays non-null (so "back" returns to the list).
            // With the old order the subject list kept rendering and the
            // note never appeared.
            <>
              <button
                onClick={() => setSharedSelectedNote(null)}
                className="sticky top-0 z-10 flex items-center gap-2 px-4 sm:px-6 py-2 text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors border-b border-slate-200 dark:border-white/[0.06] bg-[var(--notes-bg,#ffffff)] dark:bg-[#0c0f14]"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Quay lại danh sách
              </button>
              {/* key: remount the viewer per note — TipTap's useEditor only
                  loads `content` on mount, so switching note 1 → note 2
                  without a key kept showing note 1's body. */}
              <SharedNoteViewer
                key={sharedSelectedNote.id}
                title={sharedSelectedNote.title}
                contentJson={sharedSelectedNote.contentJson as Record<string, unknown> | null}
                contentHtml={sharedSelectedNote.contentHtml}
                isFavorite={sharedSelectedNote.isFavorite}
                needsReview={sharedSelectedNote.needsReview}
                isArchived={sharedSelectedNote.isArchived}
              />
            </>
          ) : sharedSubject ? (
            // Shared subject view - full width for better readability
            <div className="w-full px-4 sm:px-6 py-6">
              {/* Back button to close shared view */}
              <button
                onClick={() => { setSharedSubject(null); setSharedSelectedNote(null); }}
                className="mb-4 flex items-center gap-2 text-sm text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Quay lại Sổ tay của tôi
              </button>

              {/* Shared subject header - full width */}
              <div className="mb-6 flex items-center gap-3">
                {sharedSubject.emoji && <span className="text-2xl">{sharedSubject.emoji}</span>}
                {!sharedSubject.emoji && sharedSubject.color && (
                  <span className="h-4 w-4 rounded-full" style={{ background: sharedSubject.color }} />
                )}
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                  {sharedSubject.name}
                </h1>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                  sharedSubject.myPermission === 'edit'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300'
                }`}>
                  {sharedSubject.myPermission === 'edit' ? '✏️ Chỉnh sửa' : '👁️ Xem'}
                </span>
              </div>

              {/* Notes at root level */}
              {(sharedSubject.notes && sharedSubject.notes.length > 0) || (sharedSubject.chapters && sharedSubject.chapters.length > 0) ? (
                <section>
                  {/* Direct notes */}
                  {sharedSubject.notes && sharedSubject.notes.length > 0 && (
                    <div className="mb-7">
                      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                        Ghi chú
                      </h3>
                      <ul className="space-y-1">
                        {sharedSubject.notes.map((note) => (
                          <li key={note.id}>
                            <button
                              onClick={async () => {
                                await handleOpenSharedNote(sharedSubject.id, note.id);
                              }}
                              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-slate-100 dark:bg-white/[0.04] min-h-[40px]"
                            >
                              <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-500" />
                              <span className="truncate text-[13px] text-slate-800 dark:text-slate-200">
                                {note.title || 'Không có tiêu đề'}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Chapters with notes */}
                  {sharedSubject.chapters && sharedSubject.chapters.length > 0 && (
                    <div className="space-y-1">
                      {sharedSubject.chapters.map((chapter) => (
                        <div key={chapter.id} className="pt-1">
                          <div className="px-1 pb-1 text-[11px] font-medium text-slate-500 dark:text-slate-500">
                            {chapter.title}
                          </div>
                          {chapter.notes && chapter.notes.length > 0 ? (
                            <ul className="space-y-1">
                              {chapter.notes.map((note) => (
                                <li key={note.id}>
                                  <button
                                    onClick={async () => {
                                      await handleOpenSharedNote(sharedSubject.id, note.id);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 pl-4 text-left hover:bg-slate-100 dark:bg-white/[0.04] min-h-[40px]"
                                  >
                                    <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-500" />
                                    <span className="truncate text-[13px] text-slate-800 dark:text-slate-200">
                                      {note.title || 'Không có tiêu đề'}
                                    </span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="px-1 text-[12px] text-slate-500 dark:text-slate-500 pl-4">
                              Chưa có ghi chú trong chương này
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ) : (
                <div className="flex h-[40vh] flex-col items-center justify-center text-slate-500">
                  <FileText className="mb-3 h-9 w-9 text-slate-400/50" />
                  <p className="text-sm">Không có ghi chú nào trong mục này</p>
                </div>
              )}
            </div>
          ) : subjectView ? (
            <SubjectView subject={subjectView} treeSubject={treeSubjectFor(subjectView.id)} onChanged={refreshSubject} onSelectNote={selectNote} onAddNote={addNote} />
          ) : selected ? (
            <NoteEditor key={selected.id} note={selected} onSave={saveNote} />
          ) : (
            <div className="flex h-[60vh] flex-col items-center justify-center px-6 text-center text-slate-500">
              <NotebookPen className="mb-3 h-9 w-9 text-teal-400/50" />
              <p className="text-sm">Chọn một ghi chú để bắt đầu,<br />hoặc tạo môn học mới từ thanh bên.</p>
            </div>
          )}
        </main>
      </div>

      {/* Note resource drawer (right) — attachments + links */}
      <AnimatePresence>
        {resourceOpen && selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setResourceOpen(false)} className="fixed inset-0 z-40 bg-black/55" />
            <motion.aside
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 right-0 z-50 w-[88%] max-w-sm overflow-y-auto border-l border-slate-200 bg-white pt-16 dark:border-white/[0.06] dark:bg-[#0e1218]"
            >
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/[0.06]">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Tài nguyên</h2>
                <button onClick={() => setResourceOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/[0.05]" aria-label="Đóng"><X className="h-4 w-4" /></button>
              </div>
              <div className="space-y-6 p-4">
                <NoteResourcePanel parent={{ noteId: selected.id }} attachments={selected.attachments} links={selected.links} onChanged={refreshSelected} />
                <section>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <GraduationCap className="h-3.5 w-3.5" /> Từ vựng
                    </h3>
                    <button
                      onClick={() => { setResourceOpen(false); setReviewOpen(true); }}
                      className="flex items-center gap-1.5 rounded-md border border-teal-500/30 bg-teal-500/10 px-2 py-1 text-[11px] font-medium text-teal-700 hover:bg-teal-500/20 dark:text-teal-200"
                      aria-label="Ôn tập thẻ"
                    >
                      <GraduationCap className="h-3 w-3" /> Ôn tập
                    </button>
                  </div>
                  <VocabTable noteId={selected.id} />
                </section>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Flashcard review (Phase 3b) — full-screen modal */}
      <AnimatePresence>
        {reviewOpen && selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-slate-50 dark:bg-[#0a0e14]"
            role="dialog" aria-modal="true" aria-label="Ôn tập thẻ"
          >
            <FlashcardReview noteId={selected.id} onClose={() => setReviewOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

  <NotesSearch open={searchOpen} onClose={() => setSearchOpen(false)} subjects={tree} onJump={selectNote} />

  {/* Share Modal (Phase 4) */}
  <NotesShareManagerModal
    open={shareModalOpen}
    subject={sharingSubject}
    onClose={() => { setShareModalOpen(false); setSharingSubject(null); }}
    onChanged={handleShareChanged}
  />

  {/* Mobile drawer */}
  <AnimatePresence>
  {drawerOpen && (
  <>
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-40 bg-black/55 md:hidden" />
  <motion.aside
  initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
  transition={{ type: 'spring', stiffness: 380, damping: 36 }}
  className="fixed inset-y-0 left-0 z-50 w-[82%] max-w-xs border-r border-slate-200 bg-white pt-16 dark:border-white/[0.06] dark:bg-[#0e1218] md:hidden overflow-y-auto"
  >
   <NotesSidebar
    tree={tree}
    recent={recent}
    selectedNoteId={selected?.id ?? null}
    filter={filter}
    filteredNotes={filteredNotes}
    onClose={() => setDrawerOpen(false)}
    {...callbacks}
   />
   <NotesSharedWithMe
    onOpenSharedSubject={handleOpenSharedSubject}
    onOpenSharedNote={handleOpenSharedNote}
    selectedNoteId={sharedSelectedNote?.id ?? null}
   />
  </motion.aside>
  </>
  )}
  </AnimatePresence>
  </div>
 );
}

// ─── Optimistic reorder helpers (Phase 2.5) ──────────────────
// Each helper takes the current list and the desired id order, and
// returns a new list with the items reordered. The objects are
// shallow-cloned only when their position changed, so React's
// reconciliation can still see stable references for unchanged
// rows and avoid re-rendering the whole tree.

function subjectOrderFromIds<T extends { id: number }>(items: T[], order: number[]): T[] {
 const map = new Map(items.map((it) => [it.id, it]));
 return order.map((id) => map.get(id)).filter((x): x is T => Boolean(x));
}

function chapterOrderFromIds<T extends { id: number }>(items: T[], order: number[]): T[] {
 return subjectOrderFromIds(items, order);
}

function noteOrderFromIds<T extends { id: number }>(items: T[], order: number[]): T[] {
 return subjectOrderFromIds(items, order);
}
