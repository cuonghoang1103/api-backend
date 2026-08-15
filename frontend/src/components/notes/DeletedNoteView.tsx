'use client';

import { RotateCcw, Trash2, Clock3 } from 'lucide-react';
import type { NoteFull } from '@/types';
import SharedNoteViewer from '@/components/notes/SharedNoteViewer';

interface Props {
  note: NoteFull;
  restoring: boolean;
  deleting: boolean;
  onRestore: () => void;
  onDeletePermanently: () => void;
}

export default function DeletedNoteView({ note, restoring, deleting, onRestore, onDeletePermanently }: Props) {
  const deletedAt = note.deletedAt ? new Date(note.deletedAt) : null;
  const expiresAt = deletedAt ? new Date(deletedAt.getTime() + 30 * 24 * 60 * 60 * 1000) : null;
  const days = expiresAt ? Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 86_400_000)) : 30;

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <section className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/[0.07] sm:m-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="mt-0.5 rounded-lg bg-rose-100 p-2 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
              <Trash2 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ghi chú đang ở trong Thùng rác</h2>
              <p className="mt-1 flex flex-wrap items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                <Clock3 className="h-3.5 w-3.5" />
                Còn khoảng {days} ngày trước khi tự động xóa vĩnh viễn
                {expiresAt && <> · {expiresAt.toLocaleDateString('vi-VN')}</>}.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={restoring || deleting}
              onClick={onRestore}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-teal-600 px-3 text-sm font-medium text-white hover:bg-teal-500 disabled:opacity-50 sm:flex-none"
            >
              <RotateCcw className="h-4 w-4" /> {restoring ? 'Đang khôi phục…' : 'Khôi phục'}
            </button>
            <button
              type="button"
              disabled={restoring || deleting}
              onClick={onDeletePermanently}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-rose-300 px-3 text-sm font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10 sm:flex-none"
            >
              <Trash2 className="h-4 w-4" /> {deleting ? 'Đang xóa…' : 'Xóa vĩnh viễn'}
            </button>
          </div>
        </div>
      </section>

      <div className="pointer-events-none opacity-75" aria-label="Bản xem trước chỉ đọc">
        <SharedNoteViewer
          key={note.id}
          title={note.title}
          contentJson={note.contentJson}
          contentHtml={note.contentHtml}
          isFavorite={note.isFavorite}
          needsReview={note.needsReview}
          isArchived={note.isArchived}
        />
      </div>
    </div>
  );
}
