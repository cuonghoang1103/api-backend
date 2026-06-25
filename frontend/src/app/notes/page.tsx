'use client';

// Notes — personal study workspace (per-user).
// Phase 1: load the Subjects→Chapters→Notes tree, full CRUD from
// the sidebar, and a TipTap editor with debounced auto-save +
// image paste. Two-pane on desktop; the sidebar becomes a drawer
// on mobile. Calm, low-distraction design — no animated bg.

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, NotebookPen, Loader2, Search, Paperclip, X, GraduationCap, FileDown } from 'lucide-react';
import { notesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { NoteSubjectTree, NoteRecent, NoteFull, NoteSubjectFull } from '@/types';
import NotesSidebar from '@/components/notes/NotesSidebar';
import NoteEditor from '@/components/notes/NoteEditor';
import NoteResourcePanel from '@/components/notes/NoteResourcePanel';
import VocabTable from '@/components/notes/VocabTable';
import FlashcardReview from '@/components/notes/FlashcardReview';
import SubjectView from '@/components/notes/SubjectView';
import NotesSearch from '@/components/notes/NotesSearch';
import { exportNoteAsPdf } from '@/lib/notesPdf';

export default function NotesPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [tree, setTree] = useState<NoteSubjectTree[]>([]);
  const [recent, setRecent] = useState<NoteRecent[]>([]);
  const [selected, setSelected] = useState<NoteFull | null>(null);
  const [subjectView, setSubjectView] = useState<NoteSubjectFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  // Phase 3d: sidebar filter pills. `tree` is the default hierarchical
  // view; the other three flatten the matching notes into a single
  // list (favorites / archive / needs-review) so the user can act
  // on them in bulk without drilling into each subject.
  const [filter, setFilter] = useState<'tree' | 'favorites' | 'archive' | 'needs-review'>('tree');
  const [filteredNotes, setFilteredNotes] = useState<import('@/types').NoteSummary[]>([]);

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
    try {
      const res = await notesApi.getNote(id);
      setSelected(res.data.data);
    } catch { /* note may have been deleted; ignore */ }
  }, []);

  const openSubject = useCallback(async (id: number) => {
    setDrawerOpen(false);
    setSelected(null);
    try {
      const res = await notesApi.getSubject(id);
      setSubjectView(res.data.data);
    } catch { /* ignore */ }
  }, []);

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
    <NotesSidebar
      tree={tree}
      recent={recent}
      selectedNoteId={selected?.id ?? null}
      filter={filter}
      filteredNotes={filteredNotes}
      {...callbacks}
    />
  );

  return (
    <div className="h-[100dvh] bg-[#0c0f14] pt-16 text-slate-200">
      <div className="flex h-full">
        {/* Desktop sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-white/[0.06] bg-[#0e1218] md:block">
          {sidebar}
        </aside>

        {/* Editor pane */}
        <main className="relative min-w-0 flex-1 overflow-y-auto pb-24 sm:pb-0">
          {/* Toolbar (search always; menu + resources contextual) */}
          <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-white/[0.06] bg-[#0c0f14]/90 px-3 py-2 backdrop-blur">
            <button onClick={() => setDrawerOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-white/[0.05] md:hidden" aria-label="Mở danh sách">
              <Menu className="h-5 w-5" />
            </button>
            <button onClick={() => setSearchOpen(true)} className="flex min-h-[36px] items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[13px] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200">
              <Search className="h-4 w-4" /> <span className="hidden sm:inline">Tìm kiếm</span>
              <kbd className="ml-1 hidden rounded bg-white/[0.06] px-1.5 text-[10px] text-slate-500 md:inline">⌘K</kbd>
            </button>
            <div className="flex-1" />
            {selected && (
              <>
                <button
                  onClick={exportPdf}
                  disabled={pdfBusy}
                  title="Xuất PDF"
                  aria-label="Xuất PDF"
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-white/[0.05] disabled:opacity-50"
                >
                  <FileDown className="h-[18px] w-[18px]" />
                </button>
                <button onClick={() => setResourceOpen(true)} title="Tệp & liên kết" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-white/[0.05]" aria-label="Tệp & liên kết">
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

          {loading ? (
            <div className="flex h-[60vh] items-center justify-center text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /></div>
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
              className="fixed inset-y-0 right-0 z-50 w-[88%] max-w-sm overflow-y-auto border-l border-white/[0.06] bg-[#0e1218] pt-16"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Tài nguyên</h2>
                <button onClick={() => setResourceOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.05]" aria-label="Đóng"><X className="h-4 w-4" /></button>
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
                      className="flex items-center gap-1.5 rounded-md border border-teal-500/30 bg-teal-500/10 px-2 py-1 text-[11px] font-medium text-teal-200 hover:bg-teal-500/20"
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
            className="fixed inset-0 z-[60] flex flex-col bg-[#0a0e14]"
            role="dialog" aria-modal="true" aria-label="Ôn tập thẻ"
          >
            <FlashcardReview noteId={selected.id} onClose={() => setReviewOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

 <NotesSearch open={searchOpen} onClose={() => setSearchOpen(false)} subjects={tree} onJump={selectNote} />

 {/* Mobile drawer */}
 <AnimatePresence>
 {drawerOpen && (
 <>
 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 z-40 bg-black/55 md:hidden" />
 <motion.aside
 initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
 transition={{ type: 'spring', stiffness: 380, damping: 36 }}
 className="fixed inset-y-0 left-0 z-50 w-[82%] max-w-xs border-r border-white/[0.06] bg-[#0e1218] pt-16 md:hidden"
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
