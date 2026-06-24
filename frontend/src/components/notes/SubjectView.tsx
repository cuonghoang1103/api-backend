'use client';

// SubjectView — the "home" of a subject: header + its own
// attachments/links (subject-level resources) + a list of its
// notes for quick navigation. Shown in the main pane when a
// subject is opened from the sidebar.

import { FileText, Plus } from 'lucide-react';
import type { NoteSubjectFull, NoteSubjectTree } from '@/types';
import NoteResourcePanel from './NoteResourcePanel';

interface Props {
  subject: NoteSubjectFull;
  treeSubject?: NoteSubjectTree; // for the note list (from the loaded tree)
  onChanged: () => void;
  onSelectNote: (id: number) => void;
  onAddNote: (subjectId: number, chapterId: number | null) => void;
}

export default function SubjectView({ subject, treeSubject, onChanged, onSelectNote, onAddNote }: Props) {
  const directNotes = treeSubject?.notes ?? [];
  const chapters = treeSubject?.chapters ?? [];

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 sm:px-6 py-6">
      <div className="mb-5 flex items-center gap-3">
        {subject.color && <span className="h-3.5 w-3.5 rounded-full" style={{ background: subject.color }} />}
        {subject.emoji && <span className="text-2xl">{subject.emoji}</span>}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-100">{subject.name}</h1>
      </div>
      {subject.description && <p className="mb-6 text-sm leading-relaxed text-slate-400">{subject.description}</p>}

      {/* Notes list */}
      <section className="mb-7">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Ghi chú</h3>
          <button onClick={() => onAddNote(subject.id, null)} className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-teal-300 hover:bg-teal-500/10 min-h-[32px]">
            <Plus className="h-3.5 w-3.5" /> Ghi chú mới
          </button>
        </div>
        {directNotes.length === 0 && chapters.length === 0 ? (
          <p className="px-1 text-[12px] text-slate-600">Chưa có ghi chú nào trong môn này.</p>
        ) : (
          <ul className="space-y-1">
            {directNotes.map((n) => (
              <li key={n.id}>
                <button onClick={() => onSelectNote(n.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-white/[0.04] min-h-[40px]">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  <span className="truncate text-[13px] text-slate-200">{n.title || 'Không có tiêu đề'}</span>
                </button>
              </li>
            ))}
            {chapters.map((ch) => (
              <li key={`ch-${ch.id}`} className="pt-1">
                <div className="px-1 pb-1 text-[11px] font-medium text-slate-500">{ch.title}</div>
                <ul className="space-y-1">
                  {ch.notes.map((n) => (
                    <li key={n.id}>
                      <button onClick={() => onSelectNote(n.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 pl-4 text-left hover:bg-white/[0.04] min-h-[40px]">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                        <span className="truncate text-[13px] text-slate-200">{n.title || 'Không có tiêu đề'}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Subject-level resources */}
      <div className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-4">
        <NoteResourcePanel parent={{ subjectId: subject.id }} attachments={subject.attachments} links={subject.links} onChanged={onChanged} />
      </div>
    </div>
  );
}
