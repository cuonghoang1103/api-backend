'use client';

// NotesSidebar — collapsible tree: Subjects → Chapters → Notes.
// Presentational + callback-driven; the page owns the data and
// mutations. Supports add / inline-rename (double-click) / delete /
// select. Drag-reorder is wired on the API but kept out of this
// first pass to stay shippable; up/down is handled server-side.
//
// Calm-study styling: subject color dot for scanning, restrained
// teal accent for the active note, generous tap targets on mobile.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, Plus, Trash2, FileText, FolderPlus, BookOpen, Pin, Clock, X, PanelRight,
} from 'lucide-react';
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
}

interface Props extends SidebarCallbacks {
  tree: NoteSubjectTree[];
  recent: NoteRecent[];
  selectedNoteId: number | null;
  /** When provided (mobile drawer), renders a close button in the header. */
  onClose?: () => void;
}

const SPRING = { type: 'spring' as const, stiffness: 380, damping: 32 };

export default function NotesSidebar({ tree, recent, selectedNoteId, onClose, ...cb }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const toggle = (id: number) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  return (
    <div className="flex h-full flex-col text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Sổ tay</h2>
        <div className="flex items-center gap-1">
          <button
            onClick={cb.onAddSubject}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.05] hover:text-teal-300 sm:h-7 sm:w-7"
            title="Thêm môn học"
            aria-label="Thêm môn học"
          >
            <Plus className="h-4 w-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/[0.05] hover:text-slate-200 md:hidden"
              title="Đóng"
              aria-label="Đóng"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-6">
        {/* Recent rail */}
        {recent.length > 0 && (
          <div className="mb-2 px-1.5">
            <div className="mb-1 flex items-center gap-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              <Clock className="h-3 w-3" /> Gần đây
            </div>
            {recent.slice(0, 5).map((n) => (
              <button
                key={`r-${n.id}`}
                onClick={() => cb.onSelectNote(n.id)}
                className={`flex w-full items-center gap-2 truncate rounded-md px-2 py-1.5 text-left text-[12.5px] min-h-[36px] ${
                  selectedNoteId === n.id ? 'bg-teal-500/10 text-teal-200' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                }`}
              >
                {n.isPinned ? <Pin className="h-3 w-3 shrink-0 text-amber-400" /> : <FileText className="h-3 w-3 shrink-0 opacity-60" />}
                <span className="truncate">{n.title || 'Không có tiêu đề'}</span>
              </button>
            ))}
            <div className="my-2 h-px bg-white/[0.05]" />
          </div>
        )}

        {tree.length === 0 && (
          <div className="px-3 py-10 text-center text-xs text-slate-600">
            <BookOpen className="mx-auto mb-2 h-6 w-6 opacity-40" />
            Chưa có môn học nào.<br />Nhấn <span className="text-teal-400">+</span> để tạo môn đầu tiên.
          </div>
        )}

        {tree.map((subject) => {
          const isOpen = expanded[subject.id] ?? true;
          return (
            <div key={subject.id} className="mb-0.5">
              {/* Subject row */}
              <Row
                depth={0}
                open={isOpen}
                onToggle={() => toggle(subject.id)}
                color={subject.color}
                emoji={subject.emoji}
                label={subject.name}
                active={false}
                onRename={(v) => cb.onRenameSubject(subject.id, v)}
                onDelete={() => cb.onDeleteSubject(subject.id)}
                actions={[
                  { icon: PanelRight, title: 'Mở môn học (tệp & liên kết)', onClick: () => cb.onOpenSubject(subject.id) },
                  { icon: FolderPlus, title: 'Thêm chương', onClick: () => cb.onAddChapter(subject.id) },
                  { icon: Plus, title: 'Thêm ghi chú', onClick: () => cb.onAddNote(subject.id, null) },
                ]}
              />
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={SPRING}
                    className="overflow-hidden"
                  >
                    {/* Notes directly under the subject */}
                    {subject.notes.map((note) => (
                      <NoteRow key={note.id} note={note} depth={1} active={selectedNoteId === note.id} cb={cb} />
                    ))}
                    {/* Chapters */}
                    {subject.chapters.map((chapter) => {
                      const cOpen = expanded[chapter.id * -1] ?? true;
                      return (
                        <div key={chapter.id}>
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
                          />
                          <AnimatePresence initial={false}>
                            {cOpen && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={SPRING} className="overflow-hidden">
                                {chapter.notes.map((note) => (
                                  <NoteRow key={note.id} note={note} depth={2} active={selectedNoteId === note.id} cb={cb} />
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── A note leaf row ─────────────────────────────────────────
function NoteRow({ note, depth, active, cb }: { note: NoteSummary; depth: number; active: boolean; cb: SidebarCallbacks }) {
  return (
    <Row
      depth={depth}
      leaf
      label={note.title || 'Không có tiêu đề'}
      icon={note.isPinned ? Pin : FileText}
      active={active}
      onClick={() => cb.onSelectNote(note.id)}
      onRename={(v) => cb.onRenameNote(note.id, v)}
      onDelete={() => cb.onDeleteNote(note.id)}
    />
  );
}

// ─── Generic tree row (handles inline rename + hover actions) ─
interface RowAction { icon: React.ComponentType<{ className?: string }>; title: string; onClick: () => void; }
function Row({
  depth, label, color, emoji, icon: Icon, open, leaf, active,
  onToggle, onClick, onRename, onDelete, actions = [],
}: {
  depth: number; label: string; color?: string | null; emoji?: string | null;
  icon?: React.ComponentType<{ className?: string }>; open?: boolean; leaf?: boolean; active: boolean;
  onToggle?: () => void; onClick?: () => void; onRename: (v: string) => void; onDelete: () => void; actions?: RowAction[];
}) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(label);
  const pad = { paddingLeft: 8 + depth * 14 };

  const commit = () => { setEditing(false); const v = val.trim(); if (v && v !== label) onRename(v); else setVal(label); };

  return (
    <div
      className={`group relative flex items-center gap-1 rounded-md pr-1 min-h-[36px] ${
        active ? 'bg-teal-500/10' : 'hover:bg-white/[0.04]'
      }`}
      style={pad}
    >
      {!leaf && (
        <button onClick={onToggle} className="flex h-6 w-5 shrink-0 items-center justify-center text-slate-500 hover:text-slate-300" aria-label="Mở/đóng">
          <ChevronRight className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-90' : ''}`} />
        </button>
      )}
      {color && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />}
      {emoji && <span className="shrink-0 text-[13px] leading-none">{emoji}</span>}
      {Icon && !emoji && !color && <Icon className={`h-3.5 w-3.5 shrink-0 ${active ? 'text-teal-300' : 'text-slate-500'}`} />}

      {editing ? (
        <input
          autoFocus
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setEditing(false); setVal(label); } }}
          className="min-w-0 flex-1 rounded bg-slate-800 px-1 py-0.5 text-[13px] text-slate-100 focus:outline-none focus:ring-1 focus:ring-teal-500/50"
        />
      ) : (
        <button
          onClick={onClick ?? onToggle}
          onDoubleClick={() => { setVal(label); setEditing(true); }}
          className={`min-w-0 flex-1 truncate py-1.5 text-left text-[13px] ${active ? 'text-teal-100' : leaf ? 'text-slate-300' : 'font-medium text-slate-200'}`}
          title={`${label} — nhấp đúp để đổi tên`}
        >
          {label}
        </button>
      )}

      {/* Row actions — always visible on touch, hover-reveal on desktop */}
      <div className="flex shrink-0 items-center opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
        {actions.map((a, i) => (
          <button key={i} onClick={a.onClick} title={a.title} aria-label={a.title} className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-white/[0.06] hover:text-teal-300">
            <a.icon className="h-3.5 w-3.5" />
          </button>
        ))}
        <button onClick={onDelete} title="Xoá" aria-label="Xoá" className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-red-500/10 hover:text-red-400">
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
