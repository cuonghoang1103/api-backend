'use client';

// SubjectView — the "home" of a subject: header + its own
// attachments/links (subject-level resources) + a list of its
// notes for quick navigation. Shown in the main pane when a
// subject is opened from the sidebar.

import { useCallback, useEffect, useState } from 'react';
import { FileText, Plus, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import type { NoteSubjectFull, NoteSubjectTree } from '@/types';
import { noteDatabaseApi, type NoteDatabaseSummary } from '@/lib/api';
import NoteResourcePanel from './NoteResourcePanel';
import NoteDatabaseTable from './NoteDatabaseTable';
import MyTasksPanel from './MyTasksPanel';

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
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{subject.name}</h1>
      </div>
      {subject.description && <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{subject.description}</p>}

      {/* Notes list */}
      <section className="mb-7">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">Ghi chú</h3>
          <button onClick={() => onAddNote(subject.id, null)} className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-teal-600 dark:text-teal-300 hover:bg-teal-100 dark:bg-teal-500/10 min-h-[32px]">
            <Plus className="h-3.5 w-3.5" /> Ghi chú mới
          </button>
        </div>
        {directNotes.length === 0 && chapters.length === 0 ? (
          <p className="px-1 text-[12px] text-slate-500 dark:text-slate-500 dark:text-slate-600">Chưa có ghi chú nào trong môn này.</p>
        ) : (
          <ul className="space-y-1">
            {directNotes.map((n) => (
              <li key={n.id}>
                <button onClick={() => onSelectNote(n.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-slate-100 dark:bg-white/[0.04] min-h-[40px]">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-500" />
                  <span className="truncate text-[13px] text-slate-800 dark:text-slate-200">{n.title || 'Không có tiêu đề'}</span>
                </button>
              </li>
            ))}
            {chapters.map((ch) => (
              <li key={`ch-${ch.id}`} className="pt-1">
                <div className="px-1 pb-1 text-[11px] font-medium text-slate-500 dark:text-slate-500">{ch.title}</div>
                <ul className="space-y-1">
                  {ch.notes.map((n) => (
                    <li key={n.id}>
                      <button onClick={() => onSelectNote(n.id)} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 pl-4 text-left hover:bg-slate-100 dark:bg-white/[0.04] min-h-[40px]">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-500" />
                        <span className="truncate text-[13px] text-slate-800 dark:text-slate-200">{n.title || 'Không có tiêu đề'}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Typed databases (Phase 5) */}
      <SubjectDatabases subjectId={subject.id} />

      {/* Subject-level resources */}
      <div className="rounded-xl border border-slate-200 dark:border-white/[0.05] bg-slate-100 dark:bg-white/[0.015] p-4">
        <NoteResourcePanel parent={{ subjectId: subject.id }} attachments={subject.attachments} links={subject.links} onChanged={onChanged} />
      </div>
    </div>
  );
}

/**
 * Databases attached to this subject. They inherit the subject's share, so
 * the backend decides who may write; `canEdit` here only controls whether the
 * editing affordances are rendered.
 */
function SubjectDatabases({ subjectId }: { subjectId: number }) {
  const [databases, setDatabases] = useState<NoteDatabaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    const res = await noteDatabaseApi.listBySubject(subjectId);
    setDatabases(res.data.data);
  }, [subjectId]);

  useEffect(() => {
    setLoading(true);
    load().catch(() => { /* a subject with no access simply shows nothing */ })
      .finally(() => setLoading(false));
  }, [load]);

  const create = async () => {
    if (creating) return;
    setCreating(true);
    try {
      await noteDatabaseApi.create({ subjectId, title: 'Bảng mới' });
      await load();
      toast.success('Đã tạo bảng mới');
    } catch { toast.error('Không tạo được bảng'); }
    finally { setCreating(false); }
  };

  /**
   * Dựng cặp bảng Dự án ↔ Công việc.
   *
   * Toàn bộ việc nối cột nằm ở BACKEND (`createTaskWorkspace`): mười mấy bước
   * và thứ tự giữa chúng là bắt buộc — quan hệ cần bảng đích có trước, tổng
   * hợp cần quan hệ có trước, công thức cần tổng hợp có trước. Làm ở client
   * nghĩa là mười mấy lượt gọi mạng, và đứt giữa chừng thì để lại một bộ khung
   * dựng dở mà người dùng không biết thiếu gì.
   */
  const createWorkspace = async () => {
    setCreating(true);
    try {
      await noteDatabaseApi.createTaskWorkspace(subjectId);
      await load();
    } catch {
      toast.error('Không dựng được bộ quản lý công việc');
    } finally { setCreating(false); }
  };

  return (
    <section className="mb-8">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cơ sở dữ liệu</h2>
        <button
          onClick={create}
          disabled={creating}
          className="flex min-h-8 items-center gap-1 rounded-md px-2 py-1 text-[11px] text-teal-600 hover:bg-teal-100 disabled:opacity-50 dark:bg-teal-500/10 dark:text-teal-300"
        >
          <Plus className="h-3 w-3" aria-hidden="true" /> Bảng mới
        </button>
      </div>

      {/* Bộ khung dựng sẵn — chỉ mời khi môn CHƯA có bảng nào. Sau đó ẩn đi:
          bấm hai lần sẽ ra hai cặp bảng trùng tên và người dùng không biết
          cặp nào là cặp thật. */}
      {!loading && databases.length === 0 && (
        <button
          type="button"
          onClick={createWorkspace}
          disabled={creating}
          className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-teal-400/60 px-3 py-3 text-[12.5px] text-teal-700 hover:bg-teal-50 disabled:opacity-50 dark:text-teal-300 dark:hover:bg-teal-500/10"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Dựng sẵn bộ quản lý công việc (Dự án ↔ Công việc, đã nối tiến độ và cảnh báo trễ hạn)
        </button>
      )}
      {loading ? (
        <p className="text-[13px] text-slate-500">Đang tải…</p>
      ) : databases.length === 0 ? (
        <p className="text-[13px] text-slate-500">Chưa có bảng nào trong môn này.</p>
      ) : (
        <div className="space-y-4">
          {databases.map((database) => (
            <NoteDatabaseTable
              key={database.id}
              databaseId={database.id}
              canEdit
              onDeleted={() => { void load(); }}
            />
          ))}
        </div>
      )}

      <div className="mt-4">
        <MyTasksPanel />
      </div>
    </section>
  );
}
