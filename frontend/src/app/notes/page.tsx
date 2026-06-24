'use client';

// Notes — personal study workspace (per-user).
// Phase 1: load the Subjects→Chapters→Notes tree, full CRUD from
// the sidebar, and a TipTap editor with debounced auto-save +
// image paste. Two-pane on desktop; the sidebar becomes a drawer
// on mobile. Calm, low-distraction design — no animated bg.

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, NotebookPen, Loader2, Search, Paperclip, X } from 'lucide-react';
import { notesApi } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { NoteSubjectTree, NoteRecent, NoteFull, NoteSubjectFull } from '@/types';
import NotesSidebar from '@/components/notes/NotesSidebar';
import NoteEditor from '@/components/notes/NoteEditor';
import NoteResourcePanel from '@/components/notes/NoteResourcePanel';
import SubjectView from '@/components/notes/SubjectView';
import NotesSearch from '@/components/notes/NotesSearch';

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

  // ─── Editor save ───────────────────────────────────────────
  const saveNote = useCallback(async (patch: Partial<{ title: string; contentJson: Record<string, unknown> | null; contentHtml: string | null }>) => {
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
  }, [selected]);

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
    <NotesSidebar tree={tree} recent={recent} selectedNoteId={selected?.id ?? null} {...callbacks} />
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
              <button onClick={() => setResourceOpen(true)} title="Tệp & liên kết" className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-white/[0.05]" aria-label="Tệp & liên kết">
                <Paperclip className="h-[18px] w-[18px]" />
                {(selected.attachments.length + selected.links.length) > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-teal-500 px-1 text-[9px] font-bold text-white">{selected.attachments.length + selected.links.length}</span>
                )}
              </button>
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
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Tệp & liên kết</h2>
                <button onClick={() => setResourceOpen(false)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.05]" aria-label="Đóng"><X className="h-4 w-4" /></button>
              </div>
              <div className="p-4">
                <NoteResourcePanel parent={{ noteId: selected.id }} attachments={selected.attachments} links={selected.links} onChanged={refreshSelected} />
              </div>
            </motion.aside>
          </>
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
              <NotesSidebar tree={tree} recent={recent} selectedNoteId={selected?.id ?? null} onClose={() => setDrawerOpen(false)} {...callbacks} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
