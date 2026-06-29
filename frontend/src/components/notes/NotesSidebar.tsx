'use client';

// NotesSidebar — collapsible tree: Subjects → Chapters → Notes.
// Presentational + callback-driven; the page owns the data and
// mutations. Supports add / inline-rename (double-click) / delete /
// select / drag-reorder. Drag only within the same scope (subjects
// among subjects, chapters within a subject, notes within their
// subject-or-chapter parent) — moving a note across chapters is out
// of scope for Phase 2.5 to keep the contract small + idempotent.
//
// Calm-study styling: subject color dot for scanning, restrained
// teal accent for the active note, generous tap targets on mobile.

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
 ChevronRight, Plus, Trash2, FileText, FolderPlus, BookOpen, Pin, Clock, X, PanelRight, GripVertical,
 Star, Archive, AlertCircle, FolderTree, Share2, PinOff, Smile, Pencil,
} from 'lucide-react';
import {
 DndContext, DragOverlay,
 PointerSensor, KeyboardSensor,
 useSensor, useSensors,
 closestCenter,
 type DragEndEvent, type DragStartEvent,
} from '@dnd-kit/core';
import {
 SortableContext, useSortable, verticalListSortingStrategy,
 sortableKeyboardCoordinates, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { NoteSubjectTree, NoteRecent, NoteSummary } from '@/types';

export interface SidebarCallbacks {
 onSelectNote: (id: number) => void;
 onOpenSubject: (id: number) => void;
 onAddSubject: () => void;
 onAddChapter: (subjectId: number) => void;
 onAddNote: (subjectId: number, chapterId: number | null) => void;
 onRenameSubject: (id: number, name: string) => void;
 onRenameChapter: (id: number, title: string) => void;
 onRenameNote: (id: number, title: string) => void;
 onDeleteSubject: (id: number) => void;
 onDeleteChapter: (id: number) => void;
 onDeleteNote: (id: number) => void;
 // Phase 4 — share callbacks
 onShareSubject: (subject: NoteSubjectTree) => void;
 // Phase 5 — pin callbacks
 onPinSubject: (id: number, pinned: boolean) => void;
 onPinNote: (id: number, pinned: boolean) => void;
 // Phase 5 — icon callbacks
 onChangeSubjectIcon: (id: number, emoji: string) => void;
  // Phase 2.5 — drag-reorder callbacks. Each is given the full
  // ordered list of ids in the scope that was reordered. The page
  // forwards to the API and refreshes the tree. We keep the callback
  // shape small (just an id list) so the component does not need to
  // know about the API envelope.
  onReorderSubjects: (orderedIds: number[]) => void;
  onReorderChapters: (subjectId: number, orderedIds: number[]) => void;
  /** Reorder notes in a single scope (subject-root or chapter). */
  onReorderNotes: (orderedIds: number[]) => void;
  // Phase 3d — filter pill switcher. `'tree'` is the default
  // hierarchical view; the others flatten their matches.
  onChangeFilter: (filter: 'tree' | 'favorites' | 'archive' | 'needs-review') => void;
}

export type NoteSidebarFilter = 'tree' | 'favorites' | 'archive' | 'needs-review';

interface Props extends SidebarCallbacks {
  tree: NoteSubjectTree[];
  recent: NoteRecent[];
  selectedNoteId: number | null;
  /** Active filter pill. `'tree'` = hierarchical Subjects/Chapters/Notes. */
  filter: NoteSidebarFilter;
  /** Flat list when `filter !== 'tree'`. Empty when filter is 'tree'. */
  filteredNotes: NoteSummary[];
  /** When provided (mobile drawer), renders a close button in the header. */
  onClose?: () => void;
}

const SPRING = { type: 'spring' as const, stiffness: 380, damping: 32 };

// ─── Reduced-motion helper ──────────────────────────────────────
// Single source of truth for "should we animate?" Used by the
// dnd-kit transition AND the framer-motion expand/collapse so both
// honor the user's OS-level preference in one place.
function usePrefersReducedMotion(): boolean {
 const [reduced, setReduced] = useState(false);
 useEffect(() => {
 if (typeof window === 'undefined' || !window.matchMedia) return;
 const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
 const onChange = () => setReduced(mq.matches);
 onChange();
 mq.addEventListener('change', onChange);
 return () => mq.removeEventListener('change', onChange);
 }, []);
 return reduced;
}

// ─── Drag activation ─────────────────────────────────────────────
// 200ms delay on touch so vertical scrolling and tap-to-select keep
// working on phones. 5px tolerance so a slight finger jitter does
// not start a drag. Keyboard sensor is enabled for accessibility
// (Tab to row, Space to pick up, arrows to move, Space to drop).
function makeSensors(reduced: boolean) {
 return useSensors(
 useSensor(PointerSensor, {
 activationConstraint: reduced
 ? { distance: 4 }
 : { delay: 200, tolerance: 5 },
 }),
 useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
 );
}

export default function NotesSidebar({ tree, recent, selectedNoteId, filter, filteredNotes, onClose, ...cb }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const toggle = (id: number) => setExpanded((e) => ({ ...e, [id]: !e[id] }));
  const reduced = usePrefersReducedMotion();
  const sensors = makeSensors(reduced);
  // Track which scope is currently being dragged so we can render a
  // single DragOverlay across the 3 nested DndContexts. Without this,
  // the overlay would only follow the row inside the scope that owns
  // the draggable.
  const [activeId, setActiveId] = useState<{ scope: 'subject' | 'chapter' | 'note'; id: number } | null>(null);

  // ─── PART 2: Separate pinned items ───────────────────────────────
  const pinnedSubjects = tree.filter(s => s.isPinned);
  const unpinnedSubjects = tree.filter(s => !s.isPinned);
  const pinnedNotes = recent.filter(n => n.isPinned).slice(0, 5);

  // ─── PART 3: Emoji picker state ─────────────────────────────────
  const [emojiPickerSubject, setEmojiPickerSubject] = useState<{ id: number; emoji: string } | null>(null);

  const openEmojiPicker = (subjectId: number) => {
    const subject = tree.find(s => s.id === subjectId);
    if (subject) {
      setEmojiPickerSubject({ id: subjectId, emoji: subject.emoji || '📁' });
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (emojiPickerSubject) {
      cb.onChangeSubjectIcon(emojiPickerSubject.id, emoji);
      setEmojiPickerSubject(null);
    }
  };

  return (
   <div className="flex h-full flex-col text-sm">
       {/* Header */}
       <div className="flex items-center justify-between px-3 pt-3 pb-2">
         <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-500">Sổ tay</h2>
         <div className="flex items-center gap-1">
           <button
             onClick={cb.onAddSubject}
             className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-white/[0.05] hover:text-teal-600 dark:hover:text-teal-300 sm:h-7 sm:w-7"
             title="Thêm môn học"
             aria-label="Thêm môn học"
           >
             <Plus className="h-4 w-4" />
           </button>
           {onClose && (
             <button
               onClick={onClose}
               className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-white/[0.05] hover:text-slate-900 dark:hover:text-slate-200 md:hidden"
               title="Đóng"
               aria-label="Đóng"
             >
               <X className="h-4 w-4" />
             </button>
           )}
         </div>
       </div>

      {/* Phase 3d — filter pills. Each pill swaps the body below for
          a flat list view of the matching notes (favorites / archive
          / needs-review), or back to the default tree. */}
      <div className="mb-2 flex flex-wrap items-center gap-1 px-2">
        <FilterPill active={filter === 'tree'} icon={<FolderTree className="h-3 w-3" />} label="Môn học" onClick={() => cb.onChangeFilter('tree')} />
        <FilterPill active={filter === 'favorites'} icon={<Star className="h-3 w-3" />} label="Yêu thích" onClick={() => cb.onChangeFilter('favorites')} />
        <FilterPill active={filter === 'needs-review'} icon={<AlertCircle className="h-3 w-3" />} label="Cần ôn" onClick={() => cb.onChangeFilter('needs-review')} />
        <FilterPill active={filter === 'archive'} icon={<Archive className="h-3 w-3" />} label="Lưu trữ" onClick={() => cb.onChangeFilter('archive')} />
      </div>

      {/* PART 2: Pinned section */}
      {filter === 'tree' && (pinnedSubjects.length > 0 || pinnedNotes.length > 0) && (
        <div className="mb-2 px-1.5">
          <div className="mb-1 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-amber-500">
            <Pin className="h-3 w-3" /> Đã ghim
          </div>
          {/* Pinned subjects */}
          {pinnedSubjects.map((subject) => (
            <PinnedSubjectRow
              key={`pinned-subject-${subject.id}`}
              subject={subject}
              selectedNoteId={selectedNoteId}
              expanded={expanded}
              setExpanded={setExpanded}
              reduced={reduced}
              sensors={sensors}
              activeId={activeId}
              setActiveId={setActiveId}
              cb={cb}
            />
          ))}
          {/* Pinned notes */}
          {pinnedNotes.map((n) => (
            <button
              key={`pinned-note-${n.id}`}
              onClick={() => cb.onSelectNote(n.id)}
              className={`group flex w-full items-center gap-2 truncate rounded-md px-2 py-1.5 text-left text-[12.5px] min-h-[36px] ${
                selectedNoteId === n.id ? 'bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Pin className="h-3 w-3 shrink-0 text-amber-400" />
              <span className="truncate">{n.title || 'Không có tiêu đề'}</span>
            </button>
          ))}
          <div className="my-2 h-px bg-slate-100 dark:bg-white/[0.05]" />
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-6">
        {/* Recent rail */}
        {recent.length > 0 && (
          <div className="mb-2 px-1.5">
            <div className="mb-1 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 dark:text-slate-600">
              <Clock className="h-3 w-3" /> Gần đây
            </div>
            {recent.slice(0, 5).map((n) => (
              <button
                key={`r-${n.id}`}
                onClick={() => cb.onSelectNote(n.id)}
                className={`flex w-full items-center gap-2 truncate rounded-md px-2 py-1.5 text-left text-[12.5px] min-h-[36px] ${
                  selectedNoteId === n.id ? 'bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {n.isPinned ? <Pin className="h-3 w-3 shrink-0 text-amber-400" /> : <FileText className="h-3 w-3 shrink-0 opacity-60" />}
                <span className="truncate">{n.title || 'Không có tiêu đề'}</span>
              </button>
            ))}
            <div className="my-2 h-px bg-slate-100 dark:bg-white/[0.05]" />
          </div>
        )}

  {tree.length === 0 && filter === 'tree' && (
  <div className="px-3 py-10 text-center text-xs text-slate-500 dark:text-slate-500 dark:text-slate-600">
  <BookOpen className="mx-auto mb-2 h-6 w-6 opacity-40" />
  Chưa có môn học nào.<br />Nhấn <span className="text-teal-400">+</span> để tạo môn đầu tiên.
  </div>
  )}

  {/* Phase 3d — flat list shown when a filter pill is active.
      Replaces the hierarchical tree so the user sees just the
      matching notes in a single column. */}
  {filter !== 'tree' && (
    <div className="mb-2 px-1.5">
      <div className="mb-1 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 dark:text-slate-600">
        {filter === 'favorites' && (<><Star className="h-3 w-3" /> Yêu thích</>)}
        {filter === 'archive' && (<><Archive className="h-3 w-3" /> Lưu trữ</>)}
        {filter === 'needs-review' && (<><AlertCircle className="h-3 w-3" /> Cần ôn</>)}
        <span className="ml-auto text-slate-500 dark:text-slate-500">{filteredNotes.length}</span>
      </div>
      {filteredNotes.length === 0 ? (
        <div className="px-3 py-6 text-center text-[12px] text-slate-500 dark:text-slate-500 dark:text-slate-600">
          {filter === 'favorites' && 'Chưa đánh dấu ghi chú nào.'}
          {filter === 'archive' && 'Không có ghi chú trong lưu trữ.'}
          {filter === 'needs-review' && 'Không có ghi chú cần ôn.'}
        </div>
      ) : (
        filteredNotes.map((n) => (
          <button
            key={`f-${n.id}`}
            onClick={() => cb.onSelectNote(n.id)}
            className={`flex w-full items-center gap-2 truncate rounded-md px-2 py-1.5 text-left text-[12.5px] min-h-[36px] ${
              selectedNoteId === n.id ? 'bg-teal-100 dark:bg-teal-500/10 text-teal-700 dark:text-teal-200' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:bg-white/[0.04] hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {n.isPinned ? <Pin className="h-3 w-3 shrink-0 text-amber-400" /> : <FileText className="h-3 w-3 shrink-0 opacity-60" />}
            <span className="truncate">{n.title || 'Không có tiêu đề'}</span>
            {n.isFavorite && <Star className="ml-auto h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />}
            {n.needsReview && <AlertCircle className="ml-auto h-3 w-3 shrink-0 text-rose-400" />}
            {n.isArchived && <Archive className="ml-auto h-3 w-3 shrink-0 text-slate-500 dark:text-slate-500" />}
          </button>
        ))
      )}
      <div className="my-2 h-px bg-slate-100 dark:bg-white/[0.05]" />
    </div>
  )}

{/*
  * DndContext for SUBJECTS (root scope). Each subject is also a
  * SortableContext of its chapters and subject-level notes, but those
  * are nested with their own DndContext so dnd-kit can reason about
  * each scope independently (a chapter drag is distinct from a
  * subject drag from the user's perspective).
  * PART 2: Only show unpinned subjects in main tree; pinned show in Pinned section.
  */}
  {filter === 'tree' && (
  <DndContext
  sensors={sensors}
  collisionDetection={closestCenter}
  onDragStart={(e) => {
  const id = Number(e.active.id);
  if (tree.some((s) => s.id === id)) setActiveId({ scope: 'subject', id });
  }}
  onDragEnd={handleSubjectDragEnd}
  onDragCancel={() => setActiveId(null)}
  >
  <SortableContext items={unpinnedSubjects.map((s) => s.id)} strategy={verticalListSortingStrategy}>
  {unpinnedSubjects.map((subject) => {
  const isOpen = expanded[subject.id] ?? true;
  return (
   <SubjectBranch
   key={subject.id}
   subject={subject}
   isOpen={isOpen}
   selectedNoteId={selectedNoteId}
   expanded={expanded}
   setExpanded={setExpanded}
   reduced={reduced}
   sensors={sensors}
   activeId={activeId}
   setActiveId={setActiveId}
   cb={cb}
   onOpenEmojiPicker={openEmojiPicker}
   />
   );
  })}
  </SortableContext>
   <DragOverlay dropAnimation={reduced ? null : undefined}>
   {activeId ? <DragGhost scope={activeId.scope} activeId={activeId.id} tree={tree} /> : null}
   </DragOverlay>
   </DndContext>
   )}

   {/* PART 3: Emoji picker modal */}
   {emojiPickerSubject && (
     <EmojiPicker
       currentEmoji={emojiPickerSubject.emoji}
       onSelect={handleEmojiSelect}
       onClose={() => setEmojiPickerSubject(null)}
     />
   )}
  </div>
  </div>
  );

 // ─── Reorder handlers ────────────────────────────────────────
 // Each handler converts the dnd-kit event into the ordered id list
 // the API expects, then calls the matching callback. If the
 // drop was a no-op (same position) we still call the API — it is
 // idempotent (assigns the same sortOrder to the same row), so the
 // cost is one transaction with the same value, which is fine.
 function handleSubjectDragEnd(e: DragEndEvent) {
 setActiveId(null);
 const { active, over } = e;
 if (!over || active.id === over.id) return;
 const ids = tree.map((s) => s.id);
 const oldIndex = ids.indexOf(Number(active.id));
 const newIndex = ids.indexOf(Number(over.id));
 if (oldIndex < 0 || newIndex < 0) return;
 const next = arrayMove(ids, oldIndex, newIndex);
 cb.onReorderSubjects(next);
 }
}

// ─── SubjectBranch — owns the per-subject DndContexts ──────────
// Extracted to keep NotesSidebar readable. Each subject has:
// - 1 SortableContext of its subject-level notes (chapterId = null)
// - 1 SortableContext of its chapters (reorders chapter rows)
// - per-chapter SortableContext of chapter notes
function SubjectBranch({
 subject, isOpen, selectedNoteId, expanded, setExpanded, reduced, sensors, activeId, setActiveId, cb, onOpenEmojiPicker,
}: {
 subject: NoteSubjectTree;
 isOpen: boolean;
 selectedNoteId: number | null;
 expanded: Record<number, boolean>;
 setExpanded: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
 reduced: boolean;
 sensors: ReturnType<typeof makeSensors>;
 activeId: { scope: 'subject' | 'chapter' | 'note'; id: number } | null;
 setActiveId: (v: { scope: 'subject' | 'chapter' | 'note'; id: number } | null) => void;
 cb: SidebarCallbacks;
 onOpenEmojiPicker: (subjectId: number) => void;
}) {
 const handleNoteScopeDragEnd = (scopeNoteIds: number[], e: DragEndEvent) => {
 setActiveId(null);
 const { active, over } = e;
 if (!over || active.id === over.id) return;
 const oldIndex = scopeNoteIds.indexOf(Number(active.id));
 const newIndex = scopeNoteIds.indexOf(Number(over.id));
 if (oldIndex < 0 || newIndex < 0) return;
 const next = arrayMove(scopeNoteIds, oldIndex, newIndex);
 cb.onReorderNotes(next);
 };

 const handleChapterDragEnd = (e: DragEndEvent) => {
 setActiveId(null);
 const { active, over } = e;
 if (!over || active.id === over.id) return;
 const ids = subject.chapters.map((c) => c.id);
 const oldIndex = ids.indexOf(Number(active.id));
 const newIndex = ids.indexOf(Number(over.id));
 if (oldIndex < 0 || newIndex < 0) return;
 const next = arrayMove(ids, oldIndex, newIndex);
 cb.onReorderChapters(subject.id, next);
 };

 // The "subject root" notes (chapterId = null) share one scope
 // for drag-reorder. They are a flat list, siblings to chapters.
 const subjectRootNoteIds = subject.notes.map((n) => n.id);

  return (
  <div className="mb-0.5">
  {/* Subject row (draggable — handled by parent DndContext) */}
  <SortableRow id={subject.id}>
  {(handleProps) => (
  <Row
  depth={0}
  open={isOpen}
  onToggle={() => setExpanded((e) => ({ ...e, [subject.id]: !e[subject.id] }))}
  color={subject.color}
  emoji={subject.emoji}
   label={subject.name}
   active={false}
   onRename={(v) => cb.onRenameSubject(subject.id, v)}
   onDelete={() => cb.onDeleteSubject(subject.id)}
   onIconClick={() => onOpenEmojiPicker(subject.id)}
   actions={[
     { icon: Smile, title: 'Đổi biểu tượng', onClick: () => onOpenEmojiPicker(subject.id) },
     { icon: subject.isPinned ? PinOff : Pin, title: subject.isPinned ? 'Bỏ ghim' : 'Ghim', onClick: () => cb.onPinSubject(subject.id, !subject.isPinned) },
     { icon: PanelRight, title: 'Mở môn học (tệp & liên kết)', onClick: () => cb.onOpenSubject(subject.id) },
     { icon: Share2, title: 'Chia sẻ', onClick: () => cb.onShareSubject(subject) },
     { icon: FolderPlus, title: 'Thêm chương', onClick: () => cb.onAddChapter(subject.id) },
     { icon: Plus, title: 'Thêm ghi chú', onClick: () => cb.onAddNote(subject.id, null) },
    ]}
   dragHandleProps={handleProps}
   />
   )}
   </SortableRow>
 <AnimatePresence initial={false}>
 {isOpen && (
 <motion.div
 initial={reduced ? false : { height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
 transition={SPRING}
 className="overflow-hidden"
 >
 {/* Notes directly under subject (sortable) */}
 <DndContext
 sensors={sensors}
 collisionDetection={closestCenter}
 onDragStart={(e) => {
 const id = Number(e.active.id);
 if (subjectRootNoteIds.includes(id)) setActiveId({ scope: 'note', id });
 }}
 onDragEnd={(e) => handleNoteScopeDragEnd(subjectRootNoteIds, e)}
 onDragCancel={() => setActiveId(null)}
 >
 <SortableContext items={subjectRootNoteIds} strategy={verticalListSortingStrategy}>
 {subject.notes.map((note) => (
 <NoteRow key={note.id} note={note} depth={1} active={selectedNoteId === note.id} cb={cb} />
 ))}
 </SortableContext>
 </DndContext>

 {/* Chapters (sortable) */}
 <DndContext
 sensors={sensors}
 collisionDetection={closestCenter}
 onDragStart={(e) => {
 const id = Number(e.active.id);
 if (subject.chapters.some((c) => c.id === id)) setActiveId({ scope: 'chapter', id });
 }}
 onDragEnd={handleChapterDragEnd}
 onDragCancel={() => setActiveId(null)}
 >
 <SortableContext items={subject.chapters.map((c) => c.id)} strategy={verticalListSortingStrategy}>
 {subject.chapters.map((chapter) => {
 const cOpen = expanded[chapter.id * -1] ?? true;
 const chapterNoteIds = chapter.notes.map((n) => n.id);
 return (
 <div key={chapter.id}>
 <SortableRow id={chapter.id}>
 {(handleProps) => (
 <Row
 depth={1}
 open={cOpen}
 onToggle={() => setExpanded((e) => ({ ...e, [chapter.id * -1]: !(e[chapter.id * -1] ?? true) }))}
 label={chapter.title}
 icon={BookOpen}
 active={false}
 onRename={(v) => cb.onRenameChapter(chapter.id, v)}
 onDelete={() => cb.onDeleteChapter(chapter.id)}
 actions={[{ icon: Plus, title: 'Thêm ghi chú', onClick: () => cb.onAddNote(subject.id, chapter.id) }]}
 dragHandleProps={handleProps}
 />
 )}
 </SortableRow>
 <AnimatePresence initial={false}>
 {cOpen && (
 <motion.div
 initial={reduced ? false : { height: 0, opacity: 0 }}
 animate={{ height: 'auto', opacity: 1 }}
 exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
 transition={SPRING}
 className="overflow-hidden"
 >
 {/* Chapter notes (sortable) */}
 <DndContext
 sensors={sensors}
 collisionDetection={closestCenter}
 onDragStart={(e) => {
 const id = Number(e.active.id);
 if (chapterNoteIds.includes(id)) setActiveId({ scope: 'note', id });
 }}
 onDragEnd={(e) => handleNoteScopeDragEnd(chapterNoteIds, e)}
 onDragCancel={() => setActiveId(null)}
 >
 <SortableContext items={chapterNoteIds} strategy={verticalListSortingStrategy}>
 {chapter.notes.map((note) => (
 <NoteRow key={note.id} note={note} depth={2} active={selectedNoteId === note.id} cb={cb} />
 ))}
 </SortableContext>
 </DndContext>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
 })}
 </SortableContext>
 </DndContext>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}

// ─── PinnedSubjectRow — compact pinned subject for the Pinned section ─
function PinnedSubjectRow({
  subject, selectedNoteId, expanded, setExpanded, reduced, sensors, activeId, setActiveId, cb,
}: {
  subject: NoteSubjectTree;
  selectedNoteId: number | null;
  expanded: Record<number, boolean>;
  setExpanded: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
  reduced: boolean;
  sensors: ReturnType<typeof makeSensors>;
  activeId: { scope: 'subject' | 'chapter' | 'note'; id: number } | null;
  setActiveId: (v: { scope: 'subject' | 'chapter' | 'note'; id: number } | null) => void;
  cb: SidebarCallbacks;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-0.5">
      <div className="flex items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.05]"
        >
          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          <Pin className="h-3 w-3 shrink-0 text-amber-400" />
          {subject.emoji && <span className="text-[13px]">{subject.emoji}</span>}
          {subject.color && !subject.emoji && <span className="h-2 w-2 rounded-full shrink-0" style={{ background: subject.color }} />}
          {!subject.emoji && !subject.color && <span className="text-[13px]">📁</span>}
          <span className="truncate">{subject.name}</span>
        </button>
        <button
          onClick={() => cb.onPinSubject(subject.id, false)}
          className="ml-auto mr-2 flex h-6 w-6 items-center justify-center rounded text-amber-400 opacity-0 transition-opacity hover:bg-slate-100 group-hover:opacity-100 dark:hover:bg-white/10"
          title="Bỏ ghim"
        >
          <PinOff className="h-3 w-3" />
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={SPRING}
            className="overflow-hidden pl-6"
          >
            {/* Subject-level notes */}
            {subject.notes.map((note) => (
              <NoteRow key={note.id} note={note} depth={1} active={selectedNoteId === note.id} cb={cb} />
            ))}
            {/* Chapters with notes */}
            {subject.chapters.map((chapter) => (
              <div key={chapter.id}>
                <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-slate-500 dark:text-slate-500">
                  <ChevronRight className="h-3 w-3" />
                  <BookOpen className="h-3 w-3" />
                  <span className="truncate">{chapter.title}</span>
                </div>
                <div className="pl-6">
                  {chapter.notes.map((note) => (
                    <NoteRow key={note.id} note={note} depth={2} active={selectedNoteId === note.id} cb={cb} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── A note leaf row ─────────────────────────────────────────
function NoteRow({ note, depth, active, cb }: { note: NoteSummary; depth: number; active: boolean; cb: SidebarCallbacks }) {
 return (
 <SortableRow id={note.id}>
 {(handleProps) => (
 <Row
 depth={depth}
 leaf
 label={note.title || 'Không có tiêu đề'}
 icon={note.isPinned ? Pin : FileText}
 active={active}
 onClick={() => cb.onSelectNote(note.id)}
 onRename={(v) => cb.onRenameNote(note.id, v)}
 onDelete={() => cb.onDeleteNote(note.id)}
 actions={[
 { icon: note.isPinned ? PinOff : Pin, title: note.isPinned ? 'Bỏ ghim' : 'Ghim', onClick: () => cb.onPinNote(note.id, !note.isPinned) },
 ]}
 dragHandleProps={handleProps}
 />
 )}
 </SortableRow>
 );
}

// ─── SortableRow — wires dnd-kit to a Row via render prop ─────
// The grip handle is rendered by Row (so the user sees where to
// grab). We pass dnd-kit's listeners/attributes through to the
// handle so only the grip starts a drag, not the whole row. This
// means a normal click on the row still selects the note; the user
// has to grab the grip to drag.
function SortableRow({ id, children }: { id: number; children: (handleProps: DragHandleProps) => React.ReactNode }) {
 const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
 // transform is null when not dragging. We only translate Y so
 // the row never jitters horizontally mid-drag.
 const style: React.CSSProperties = {
 transform: CSS.Translate.toString(transform),
 transition,
 opacity: isDragging ? 0.35 : 1,
 };
 return (
 <div ref={setNodeRef} style={style} {...(attributes as unknown as Record<string, unknown>)}>
 {children({ listeners, attributes })}
 </div>
 );
}

// ─── DragGhost — visual stand-in for the row being dragged ───
// Rendered in the DragOverlay portal so it floats above everything
// else. Reuses Row's visual style so the user sees the same
// shape they grabbed, just at a higher z-index.
function DragGhost({ scope, activeId, tree }: { scope: 'subject' | 'chapter' | 'note'; activeId: number; tree: NoteSubjectTree[] }) {
 let row: React.ReactNode = null;
 if (scope === 'subject') {
 const s = tree.find((x) => x.id === activeId);
 if (s) row = <Row depth={0} label={s.name} color={s.color} emoji={s.emoji} active={false} onRename={() => {}} onDelete={() => {}} />;
 } else if (scope === 'chapter') {
 outer: for (const s of tree) {
 const c = s.chapters.find((x) => x.id === activeId);
 if (c) { row = <Row depth={1} label={c.title} icon={BookOpen} active={false} onRename={() => {}} onDelete={() => {}} />; break outer; }
 }
 } else {
 outer: for (const s of tree) {
 const n = s.notes.find((x) => x.id === activeId) ?? s.chapters.flatMap((c) => c.notes).find((x) => x.id === activeId);
 if (n) { row = <Row depth={1} leaf label={n.title || 'Không có tiêu đề'} icon={FileText} active={false} onRename={() => {}} onDelete={() => {}} />; break outer; }
 }
 }
 return (
 <div className="w-72 rounded-md border border-teal-500/30 bg-white dark:bg-[#10151c] shadow-2xl shadow-black/60">
 {row}
 </div>
 );
}

// ─── Generic tree row (handles inline rename + hover actions) ─
interface RowAction { icon: React.ComponentType<{ className?: string }>; title: string; onClick: () => void; }

// Phase 2.5: optional dragHandleProps turns the row into a
// draggable. Only the grip is wired to the pointer sensor, so the
// rest of the row keeps its click / double-click behaviour. When
// the prop is absent (e.g. inside DragGhost) the grip is hidden
// and the row is purely presentational.
interface DragHandleProps {
 // dnd-kit's `listeners` and `attributes` are typed loosely
 // (ListenerMap / DraggableAttributes). We expose them as `unknown`
 // here and let Row spread them — TypeScript will widen them to
 // `Record<string, unknown>` at the spread site, which is fine.
 listeners: unknown;
 attributes: unknown;
}
function Row({
 depth, label, color, emoji, icon: Icon, open, leaf, active,
 onToggle, onClick, onRename, onDelete, onIconClick, actions = [], dragHandleProps,
}: {
 depth: number; label: string; color?: string | null; emoji?: string | null;
 icon?: React.ComponentType<{ className?: string }>; open?: boolean; leaf?: boolean; active: boolean;
 onToggle?: () => void; onClick?: () => void; onRename: (v: string) => void; onDelete: () => void;
 onIconClick?: () => void; actions?: RowAction[];
 dragHandleProps?: DragHandleProps;
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);
  const pad = { paddingLeft: 8 + depth * 14 };

  // Focus + select the rename field when editing starts. autoFocus is
  // unreliable inside a dnd-kit sortable (the draggable wrapper competes for
  // focus), so we focus explicitly on the next frame.
  useEffect(() => {
    if (!editing) return;
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return () => cancelAnimationFrame(id);
  }, [editing]);

  const commit = () => { setEditing(false); const v = val.trim(); if (v && v !== label) onRename(v); else setVal(label); };

  return (
    <div
 className={`group relative flex items-center gap-1 rounded-md pr-1 min-h-[36px] ${
 active ? 'bg-teal-100 dark:bg-teal-500/10' : 'hover:bg-slate-100 dark:bg-white/[0.04]'
 }`}
 style={pad}
 >
 {/* Drag grip (Phase 2.5). Pointer listeners live here only;
 clicking anywhere else still triggers select / toggle /
 inline rename. cursor-grab hints that the row is grabbable. */}
 {dragHandleProps && (
 <button
 type="button"
 aria-label="Kéo để sắp xếp"
 title="Kéo để sắp xếp"
 className="flex h-6 w-4 shrink-0 cursor-grab touch-none items-center justify-center text-slate-500 dark:text-slate-500 dark:text-slate-600 hover:text-slate-800 dark:hover:text-slate-300 active:cursor-grabbing"
 {...((dragHandleProps.attributes ?? {}) as Record<string, unknown>)}
 {...((dragHandleProps.listeners ?? {}) as Record<string, unknown>)}
 onClick={(e) => e.preventDefault()}
 >
 <GripVertical className="h-3.5 w-3.5" />
 </button>
 )}
 {!leaf && (
 <button onClick={onToggle} className="flex h-6 w-5 shrink-0 items-center justify-center text-slate-500 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-300" aria-label="Mở/đóng">
 <ChevronRight className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-90' : ''}`} />
 </button>
 )}
      {/* Leading icon. When onIconClick is provided (subjects), clicking the
          icon opens the emoji picker so changing a folder's icon is obvious. */}
      {(() => {
        const iconEl = (
          <>
            {color && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />}
            {emoji && <span className="shrink-0 text-[13px] leading-none">{emoji}</span>}
            {Icon && !emoji && !color && <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-teal-600 dark:text-teal-300' : 'text-slate-500 dark:text-slate-500'}`} />}
            {!emoji && !color && !Icon && <span className="shrink-0 text-[13px] leading-none">📁</span>}
          </>
        );
        return onIconClick ? (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onIconClick(); }}
            title="Đổi biểu tượng"
            aria-label="Đổi biểu tượng"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-white/10"
          >
            {iconEl}
          </button>
        ) : iconEl;
      })()}

      {editing ? (
        <input
          ref={inputRef}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          // Keep pointer/key events from bubbling to the draggable wrapper
          // (dnd-kit) so focus, caret and typing are not hijacked.
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') { setEditing(false); setVal(label); }
          }}
          className="min-w-0 flex-1 rounded bg-white px-1 py-0.5 text-[13px] text-slate-900 ring-1 ring-slate-300 dark:bg-slate-800 dark:text-slate-100 dark:ring-white/15 focus:outline-none focus:ring-1 focus:ring-teal-500/50"
        />
      ) : (
        <button
          onClick={onClick ?? onToggle}
          onDoubleClick={() => { setVal(label); setEditing(true); }}
          className={`min-w-0 flex-1 truncate py-1.5 text-left text-[13px] ${active ? 'text-teal-800 dark:text-teal-100' : leaf ? 'text-slate-700 dark:text-slate-300' : 'font-medium text-slate-800 dark:text-slate-200'}`}
          title={`${label} — nhấp đúp để đổi tên`}
        >
          {label}
        </button>
      )}

      {/* Row actions — always visible on touch, hover-reveal on desktop */}
      {/* On desktop the actions are display:none until hover so they don't
          occupy layout width — otherwise 8 invisible buttons squeeze the
          flex-1 label to ~0 and the folder name disappears. Always shown on
          touch (mobile). */}
      <div className="flex shrink-0 items-center sm:hidden sm:group-hover:flex">
        {/* Rename — always present so it's discoverable (double-click still works) */}
        {!editing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Use a native prompt for rename — reliable everywhere. The
              // inline <input> inside the dnd-kit sortable row was fragile
              // (lost focus/keystrokes), so this guarantees rename works.
              const next = window.prompt('Đổi tên:', label);
              if (next === null) return;
              const v = next.trim();
              if (v && v !== label) onRename(v);
            }}
            title="Đổi tên"
            aria-label="Đổi tên"
            className="flex h-7 w-7 items-center justify-center rounded text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:bg-white/[0.06] hover:text-teal-600 dark:hover:text-teal-300"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
        {actions.map((a, i) => (
          <button key={i} onClick={a.onClick} title={a.title} aria-label={a.title} className="flex h-7 w-7 items-center justify-center rounded text-slate-500 dark:text-slate-500 hover:bg-slate-100 dark:bg-white/[0.06] hover:text-teal-600 dark:hover:text-teal-300">
            <a.icon className="h-3.5 w-3.5" />
          </button>
        ))}
        <button onClick={onDelete} title="Xoá" aria-label="Xoá" className="flex h-7 w-7 items-center justify-center rounded text-slate-500 dark:text-slate-500 hover:bg-red-500/10 hover:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}


function FilterPill({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
 return (
  <button
   type="button"
   onClick={onClick}
   className={`flex min-h-[28px] items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
    active
     ? 'border-teal-500/40 bg-teal-100 dark:bg-teal-500/15 text-teal-800 dark:text-teal-100'
     : 'border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/[0.02] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:border-white/20 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-slate-200'
   }`}
   aria-pressed={active}
  >
   {icon}
   <span>{label}</span>
  </button>
 );
}

// ─── PART 3: Emoji Picker for folder icons ─────────────────────────
const FOLDER_EMOJIS = [
 '📁', '📚', '📗', '📘', '📙', '📕',
 '📓', '📒', '📔', '📑', '🔖', '📌',
 '💻', '🖥️', '⌨️', '🖱️', '💾', '📀',
 '🔢', '🔣', '🔤', '📝', '✏️', '🖊️',
 '🖋️', '📖', '📃', '📄', '📰', '🗞️',
 '📋', '📌', '📎', '🗂️', '📁', '🗃️',
 '🗄️', '🗑️', '💰', '💵', '💴', '💶',
 '💷', '💸', '💳', '🧾', '💹', '📊',
 '📈', '📉', '📆', '📅', '🗓️', '📇',
 '🔗', '🌐', '🌍', '🌎', '🌏', '🗺️',
 '🏫', '🏢', '🏣', '🏤', '🏥', '🏦',
 '🏨', '🏩', '🏪', '🏬', '🏭', '🏯',
 '🏰', '💒', '🗼', '🗽', '⛪', '⛩️',
 '🔭', '🔬', '🧬', '🧪', '🧫', '🧬',
 '🧮', '🧲', '⚗️', '🔭', '🔬', '💡',
 '🎓', '🎒', '🎒', '🎨', '🎭', '🎪',
 '🎬', '🎤', '🎧', '🎹', '🎸', '🎷',
 '🎺', '🎻', '🥁', '🎷', '🎵', '🎶',
 '⭐', '🌟', '✨', '💫', '🌙', '🌞',
 '❤️', '🧡', '💛', '💚', '💙', '💜',
 '🖤', '🤍', '🤎', '💔', '❣️', '💕',
 '☮️', '✝️', '☯️', '🕉️', '☪️', '🔯',
 '🛐', '⛎', '♈', '♉', '♊', '♋',
 '♌', '♍', '♎', '♏', '♐', '♑',
 '♒', '♓', '🆔', '⚛️', '🉑', '☢️',
 '☣️', '📴', '📳', '🈶', '🈚', '🈸',
 '🈺', '🈷️', '✴️', '🆚', '💮', '🉐',
 '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲',
 '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘',
];

interface EmojiPickerProps {
  currentEmoji: string;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

function EmojiPicker({ currentEmoji, onSelect, onClose }: EmojiPickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-80 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-[#1a1f27]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">Chọn biểu tượng</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-8 gap-1">
          {FOLDER_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onSelect(emoji)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-lg transition-colors ${
                emoji === currentEmoji
                  ? 'bg-teal-100 ring-2 ring-teal-500 dark:bg-teal-500/20'
                  : 'hover:bg-slate-100 dark:hover:bg-white/10'
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

