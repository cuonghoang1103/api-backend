'use client';

import { useCallback, useEffect, useState } from 'react';
import { Clock3, Loader2, RotateCcw, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { notesApi } from '@/lib/api';
import type { NoteFull, NoteVersionAuthor, NoteVersionFull, NoteVersionOrigin, NoteVersionSummary } from '@/types';
import SharedNoteViewer from '@/components/notes/SharedNoteViewer';

const ORIGIN_LABEL: Record<NoteVersionOrigin, string> = {
  INITIAL: 'Bản đầu tiên',
  AUTO_SAVE: 'Tự động lưu',
  MANUAL: 'Lưu thủ công',
  BEFORE_RESTORE: 'Trước khi khôi phục',
  RESTORE: 'Đã khôi phục',
};

function authorName(user?: NoteVersionAuthor | null) {
  return user?.displayName || user?.fullName || user?.username || 'Không rõ';
}

interface Props {
  note: NoteFull;
  onClose: () => void;
  onRestored: (note: NoteFull) => void;
}

export default function NoteVersionHistory({ note, onClose, onRestored }: Props) {
  const [versions, setVersions] = useState<NoteVersionSummary[]>([]);
  const [preview, setPreview] = useState<NoteVersionFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadVersions = useCallback(async (preferVersion?: number) => {
    const res = await notesApi.getVersions(note.id);
    const rows = res.data.data;
    setVersions(rows);
    const version = preferVersion ?? rows[0]?.version;
    if (version) {
      const full = await notesApi.getVersion(note.id, version);
      setPreview(full.data.data);
    } else {
      setPreview(null);
    }
  }, [note.id]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    loadVersions().catch(() => {
      if (!cancelled) toast.error('Không tải được lịch sử phiên bản');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [loadVersions]);

  const choose = async (version: number) => {
    try {
      const res = await notesApi.getVersion(note.id, version);
      setPreview(res.data.data);
    } catch { toast.error('Không tải được bản lưu này'); }
  };

  const createSnapshot = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await notesApi.createVersion(note.id);
      await loadVersions(res.data.data.version);
      toast.success('Đã tạo một bản lưu thủ công');
    } catch { toast.error('Không thể tạo bản lưu'); }
    finally { setBusy(false); }
  };

  const restore = async () => {
    if (!preview || busy) return;
    if (!window.confirm(`Khôi phục phiên bản v${preview.version}? Trạng thái hiện tại vẫn được lưu để có thể hoàn tác.`)) return;
    setBusy(true);
    try {
      const res = await notesApi.restoreVersion(note.id, preview.version);
      onRestored(res.data.data);
      toast.success(`Đã khôi phục từ phiên bản v${preview.version}`);
      onClose();
    } catch { toast.error('Không thể khôi phục phiên bản'); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/55 p-0 backdrop-blur-[2px] sm:p-5" role="dialog" aria-modal="true" aria-label="Lịch sử phiên bản">
      <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden bg-white shadow-2xl dark:bg-[#0e1218] sm:flex-row sm:rounded-2xl sm:border sm:border-slate-200 sm:dark:border-white/[0.08]">
        <aside className="flex h-[38%] w-full shrink-0 flex-col border-b border-slate-200 dark:border-white/[0.07] sm:h-full sm:w-[300px] sm:border-b-0 sm:border-r">
          <header className="border-b border-slate-200 p-4 dark:border-white/[0.07]">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100"><Clock3 className="h-4 w-4" /> Lịch sử phiên bản</h2>
                <p className="mt-1 text-[11px] text-slate-500">Tự lưu được gom tối đa 1 bản / 5 phút.</p>
              </div>
              <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.06]" aria-label="Đóng"><X className="h-4 w-4" /></button>
            </div>
            <button
              onClick={createSnapshot}
              disabled={busy}
              className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 text-xs font-medium text-teal-700 hover:bg-teal-500/15 disabled:opacity-50 dark:text-teal-300"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Tạo bản lưu ngay
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {loading ? (
              <div className="flex h-32 items-center justify-center text-slate-500"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : versions.map((item) => (
              <button
                key={item.id}
                onClick={() => choose(item.version)}
                className={`mb-1 w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${preview?.version === item.version ? 'border-teal-500/30 bg-teal-50 dark:bg-teal-500/10' : 'border-transparent hover:bg-slate-100 dark:hover:bg-white/[0.04]'}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">v{item.version}</span>
                  <span className="text-[10px] text-slate-400">{new Date(item.createdAt).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
                <p className="mt-1 truncate text-[11px] text-slate-500">{ORIGIN_LABEL[item.origin] ?? item.origin} · {item.title}</p>
                {/* On a shared page the snapshot author is a collaborator,
                    not the owner — so name them. */}
                <p className="mt-0.5 truncate text-[10px] text-slate-400">bởi {authorName(item.user)}</p>
              </button>
            ))}
          </div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto">
          {preview ? (
            <>
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-white/[0.07] dark:bg-[#0e1218]/95">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">Xem trước v{preview.version} · {ORIGIN_LABEL[preview.origin] ?? preview.origin}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">Bản lưu gần nhất: v{versions[0]?.version ?? note.version}. Khôi phục không xóa lịch sử.</p>
                </div>
                <button onClick={restore} disabled={busy} className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg bg-teal-600 px-3 text-xs font-medium text-white hover:bg-teal-500 disabled:opacity-50">
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />} Khôi phục bản này
                </button>
              </div>
              <div className="grid min-h-0 xl:grid-cols-2 xl:divide-x xl:divide-slate-200 xl:dark:divide-white/[0.07]">
                <section className="min-w-0">
                  <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-white/[0.07] dark:bg-white/[0.02]">Trang hiện tại</div>
                  <SharedNoteViewer key={`${note.id}-current-${note.updatedAt}`} title={note.title} contentJson={note.contentJson} contentHtml={note.contentHtml} />
                </section>
                <section className="min-w-0 border-t border-slate-200 dark:border-white/[0.07] xl:border-t-0">
                  <div className="border-b border-slate-200 bg-teal-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-teal-700 dark:border-white/[0.07] dark:bg-teal-500/[0.06] dark:text-teal-300">Bản v{preview.version} được chọn</div>
                  <SharedNoteViewer key={`${note.id}-${preview.version}`} title={preview.title} contentJson={preview.contentJson} contentHtml={preview.contentHtml} />
                </section>
              </div>
            </>
          ) : !loading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">Chưa có phiên bản nào.</div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
