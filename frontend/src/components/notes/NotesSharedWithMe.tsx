'use client';

/**
 * NotesSharedWithMe — Sidebar section showing subjects shared with the current user.
 *
 * Features:
 * - Shows list of subjects shared by other users
 * - Displays owner avatar and name
 * - Shows permission level (view/edit)
 * - Click to expand and see chapters/notes
 * - Click on a note to view it in the editor
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight, ChevronDown, Loader2,
  FolderOpen, FileText, Eye, Edit3, Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { noteShareApi, type NoteSharedSummary } from '@/lib/api';
import { cn } from '@/lib/utils';

interface NotesSharedWithMeProps {
  onOpenSharedNote: (subjectId: number, noteId: number) => void;
  onOpenSharedSubject: (subjectId: number) => void;
  selectedNoteId?: number | null;
}

export default function NotesSharedWithMe({
  onOpenSharedNote,
  onOpenSharedSubject,
  selectedNoteId,
}: NotesSharedWithMeProps) {
  const [sharedSubjects, setSharedSubjects] = useState<NoteSharedSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [loadingSubjects, setLoadingSubjects] = useState<Set<number>>(new Set());
  const [loadedFullDataIds, setLoadedFullDataIds] = useState<Set<number>>(new Set());

  const loadShared = async () => {
    setLoading(true);
    try {
      const res = await noteShareApi.listReceived();
      setSharedSubjects(res.data.data ?? []);
    } catch {
      toast.error('Không tải được danh sách chia sẻ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadShared();
  }, []);

  const toggleExpand = async (subjectId: number) => {
    if (expandedIds.has(subjectId)) {
      setExpandedIds(prev => {
        const next = new Set(prev);
        next.delete(subjectId);
        return next;
      });
      return;
    }

    // Load full subject data if not already loaded
    if (!loadedFullDataIds.has(subjectId)) {
      setLoadingSubjects(prev => new Set(prev).add(subjectId));
      try {
        const res = await noteShareApi.getReceivedSubject(subjectId);
        const fullData = res.data.data;
        // Cast to any to allow mixing summary + full data shapes
        setSharedSubjects(prev => prev.map(s => {
          if (s.subjectId === subjectId) {
            return {
              ...s,
              subject: {
                ...s.subject,
                // Update with full data from API
                chapters: fullData.chapters ?? s.subject.chapters,
                notes: fullData.notes ?? s.subject.notes,
              },
            } as any;
          }
          return s;
        }));
        setLoadedFullDataIds(prev => new Set(prev).add(subjectId));
      } catch {
        toast.error('Không tải được nội dung');
      } finally {
        setLoadingSubjects(prev => {
          const next = new Set(prev);
          next.delete(subjectId);
          return next;
        });
      }
    }

    setExpandedIds(prev => new Set(prev).add(subjectId));
  };

  const handleOpenSubject = (subjectId: number) => {
    onOpenSharedSubject(subjectId);
  };

  const handleOpenNote = (subjectId: number, noteId: number) => {
    onOpenSharedNote(subjectId, noteId);
  };

  if (loading) {
    return (
      <div className="shrink-0 border-b border-slate-200 px-3 pt-3 pb-3 dark:border-white/[0.06]">
        <div className="flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-500">
          <Users className="h-3.5 w-3.5" />
          Được chia sẻ với tôi
        </div>
        <div className="flex items-center justify-center py-3">
          <Loader2 className="h-4 w-4 animate-spin text-text-muted" />
        </div>
      </div>
    );
  }

  if (sharedSubjects.length === 0) {
    return null; // Don't show section if no shared subjects
  }

  return (
    <section className="shrink-0 border-b border-slate-200 dark:border-white/[0.06]">
      {/* Section header — mirrors the "Sổ tay" header style, click to
          collapse. Count badge on the right for a professional feel. */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center gap-2 px-3 pt-3 pb-2 text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
      >
        <Users className="h-3.5 w-3.5 shrink-0" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
          Được chia sẻ với tôi
        </span>
        <span className="rounded-full bg-neon-violet/15 px-1.5 py-0.5 text-[10px] font-semibold text-neon-violet">
          {sharedSubjects.length}
        </span>
        <ChevronDown
          className={cn(
            'ml-auto h-3.5 w-3.5 shrink-0 transition-transform',
            collapsed && '-rotate-90',
          )}
        />
      </button>

      {/* Shared subjects list — capped so it never crowds the notebook
          below; scrolls internally when there are many shares. */}
      {!collapsed && (
      <div className="max-h-[40vh] space-y-1 overflow-y-auto px-2 pb-3">
        {sharedSubjects.map((share) => {
          const isExpanded = expandedIds.has(share.subjectId);
          const isLoadingSubject = loadingSubjects.has(share.subjectId);
          const chapters = share.subject?.chapters ?? [];
          const notes = share.subject?.notes ?? [];

          return (
            <div key={share.id} className="text-sm">
              {/* Subject row */}
              <div className="group flex items-center gap-1 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-white/[0.05] transition-colors">
                <button
                  onClick={() => toggleExpand(share.subjectId)}
                  className="flex-shrink-0 text-text-muted"
                >
                  {isLoadingSubject ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </button>

                <button
                  onClick={() => handleOpenSubject(share.subjectId)}
                  className="flex items-center gap-2 flex-1 min-w-0"
                >
                  <FolderOpen className="h-4 w-4 shrink-0" style={{ color: share.subject.color ?? undefined }}>
                    {share.subject.emoji && (
                      <title>{share.subject.emoji}</title>
                    )}
                  </FolderOpen>
                  <span className="truncate text-text-primary">
                    {share.subject.emoji && <span className="mr-1">{share.subject.emoji}</span>}
                    {share.subject.name}
                  </span>
                </button>

                {/* Permission badge */}
                <span className={cn(
                  'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium',
                  share.permission === 'edit'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-slate-500/10 text-slate-400'
                )}>
                  {share.permission === 'edit' ? (
                    <span className="flex items-center gap-0.5">
                      <Edit3 className="h-2.5 w-2.5" /> Sửa
                    </span>
                  ) : (
                    <span className="flex items-center gap-0.5">
                      <Eye className="h-2.5 w-2.5" /> Xem
                    </span>
                  )}
                </span>
              </div>

              {/* Owner info */}
              <div className="ml-7 flex items-center gap-1.5 text-[10px] text-text-muted mb-1">
                <span>Từ</span>
                <div className="h-4 w-4 rounded-full overflow-hidden bg-gradient-to-br from-neon-violet to-neon-pink flex items-center justify-center shrink-0">
                  {share.owner.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={share.owner.avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[6px] font-bold text-white">
                      {(share.owner.displayName || share.owner.username || '?').slice(0, 1).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="truncate">@{share.owner.username}</span>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-7 space-y-0.5 pb-1">
                      {/* Notes at root level */}
                      {notes.map((note) => (
                        <button
                          key={note.id}
                          onClick={() => handleOpenNote(share.subjectId, note.id)}
                          className={cn(
                            'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
                            selectedNoteId === note.id
                              ? 'bg-teal-500/10 text-teal-400'
                              : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-white/[0.03]'
                          )}
                        >
                          <FileText className="h-3 w-3 shrink-0" />
                          <span className="truncate">{note.title}</span>
                        </button>
                      ))}

                      {/* Chapters — render each chapter's notes too, so the
                          recipient can open every note (not just the title). */}
                      {chapters.map((chapter) => {
                        const chapterNotes = (chapter as any).notes ?? [];
                        return (
                          <div key={chapter.id} className="mt-1">
                            <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-text-muted">
                              <ChevronRight className="h-3 w-3" />
                              <span className="truncate">{chapter.title}</span>
                            </div>
                            {chapterNotes.map((note: { id: number; title: string }) => (
                              <button
                                key={note.id}
                                onClick={() => handleOpenNote(share.subjectId, note.id)}
                                className={cn(
                                  'ml-4 flex w-[calc(100%-1rem)] items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
                                  selectedNoteId === note.id
                                    ? 'bg-teal-500/10 text-teal-400'
                                    : 'text-text-secondary hover:bg-slate-100 dark:hover:bg-white/[0.03]'
                                )}
                              >
                                <FileText className="h-3 w-3 shrink-0" />
                                <span className="truncate">{note.title}</span>
                              </button>
                            ))}
                          </div>
                        );
                      })}

                      {chapters.length === 0 && notes.length === 0 && (
                        <p className="px-2 py-1 text-[11px] text-text-muted italic">
                          Không có ghi chú nào
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
}
