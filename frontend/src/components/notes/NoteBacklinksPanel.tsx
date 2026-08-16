'use client';

import { useCallback, useEffect, useState } from 'react';
import { ChevronRight, CornerDownRight, FileText, Link2, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { notesApi, type NoteBacklinkBundle, type NoteChildSummary } from '@/lib/api';

interface Props {
  noteId: number;
  noteTitle: string;
  /** Pages in the same subject that could become the parent. */
  candidateParents: Array<{ id: number; title: string }>;
  onOpenNote: (noteId: number) => void;
  /** Refresh the sidebar tree after the page moves. */
  onMoved: () => void;
  onClose: () => void;
}

export default function NoteBacklinksPanel({
  noteId, noteTitle, candidateParents, onOpenNote, onMoved, onClose,
}: Props) {
  const [bundle, setBundle] = useState<NoteBacklinkBundle | null>(null);
  const [children, setChildren] = useState<NoteChildSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [moving, setMoving] = useState(false);

  const load = useCallback(async () => {
    const [links, kids] = await Promise.all([
      notesApi.getBacklinks(noteId),
      notesApi.getChildren(noteId),
    ]);
    setBundle(links.data.data);
    setChildren(kids.data.data);
  }, [noteId]);

  useEffect(() => {
    setLoading(true);
    load().catch(() => toast.error('Không tải được liên kết')).finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const open = (id: number) => { onOpenNote(id); onClose(); };

  const parentId = bundle && bundle.breadcrumb.length > 0
    ? bundle.breadcrumb[bundle.breadcrumb.length - 1].id
    : null;

  /**
   * The server is the authority on whether a move is legal — it rejects
   * cycles, cross-subject parents and over-deep nesting. Surfacing its
   * message verbatim is why the picker can offer every sibling page without
   * having to replicate the cycle walk in the browser.
   */
  const moveInto = async (nextParentId: number | null) => {
    if (moving) return;
    setMoving(true);
    try {
      await notesApi.setParent(noteId, nextParentId);
      await load();
      onMoved();
      toast.success(nextParentId === null ? 'Đã đưa ra ngoài cùng' : 'Đã chuyển vào trang cha');
    } catch (error) {
      const message = (error as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      toast.error(message || 'Không chuyển được trang');
    } finally { setMoving(false); }
  };

  return (
    <div
      className="fixed inset-0 z-[75] bg-black/50 backdrop-blur-[2px]"
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="note-links-title"
        className="ml-auto flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-[#0e1218]"
      >
        <header className="flex items-start justify-between gap-3 border-b border-slate-200 px-4 py-4 dark:border-white/[0.07]">
          <div className="min-w-0">
            <h2 id="note-links-title" className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Link2 className="h-4 w-4" aria-hidden="true" /> Liên kết trang
            </h2>
            <p className="mt-1 truncate text-xs text-slate-500">{noteTitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bảng liên kết"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:hover:bg-white/[0.06]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-4" aria-live="polite">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            </div>
          ) : (
            <div className="space-y-6">
              {bundle && bundle.breadcrumb.length > 0 && (
                <Section title="Nằm trong">
                  <nav className="flex flex-wrap items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                    {bundle.breadcrumb.map((crumb, index) => (
                      <span key={crumb.id} className="flex items-center gap-1">
                        {index > 0 && <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden="true" />}
                        <button
                          onClick={() => open(crumb.id)}
                          className="min-h-8 rounded px-1 hover:bg-slate-100 hover:text-teal-600 dark:hover:bg-white/[0.05]"
                        >
                          {crumb.title || 'Không có tiêu đề'}
                        </button>
                      </span>
                    ))}
                  </nav>
                </Section>
              )}

              <Section title="Lồng trang này vào">
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="note-parent-picker" className="sr-only">Chọn trang cha</label>
                  <select
                    id="note-parent-picker"
                    value={parentId ?? ''}
                    disabled={moving}
                    onChange={(event) => moveInto(event.target.value === '' ? null : Number(event.target.value))}
                    className="min-h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 text-[13px] text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 disabled:opacity-60 dark:border-white/[0.12] dark:bg-black/20 dark:text-slate-200"
                  >
                    <option value="">— Ngoài cùng (không lồng) —</option>
                    {candidateParents
                      .filter((candidate) => candidate.id !== noteId)
                      .map((candidate) => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.title || 'Không có tiêu đề'}
                        </option>
                      ))}
                  </select>
                  {moving && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-slate-400" aria-hidden="true" />}
                </div>
                <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                  Chỉ lồng được trong cùng môn học, tối đa 10 cấp. Chọn một trang con của
                  chính nó sẽ bị từ chối.
                </p>
              </Section>

              <Section title={`Trang con (${children.length})`}>
                {children.length === 0 ? (
                  <Empty>Chưa có trang con.</Empty>
                ) : (
                  <ul className="space-y-1">
                    {children.map((child) => (
                      <li key={child.id}>
                        <RefButton title={child.title} onClick={() => open(child.id)} icon={<CornerDownRight className="h-3.5 w-3.5" />} />
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title={`Được trỏ tới từ (${bundle?.backlinks.length ?? 0})`}>
                {!bundle || bundle.backlinks.length === 0 ? (
                  <Empty>Chưa trang nào trỏ tới trang này. Gõ <code className="rounded bg-slate-100 px-1 dark:bg-white/[0.08]">[[{noteTitle}]]</code> trong một trang khác để tạo liên kết.</Empty>
                ) : (
                  <ul className="space-y-1">
                    {bundle.backlinks.map((ref) => (
                      <li key={`${ref.id}-${ref.label}`}>
                        <RefButton title={ref.title} onClick={() => open(ref.id)} icon={<FileText className="h-3.5 w-3.5" />} />
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              <Section title={`Trang này trỏ ra (${bundle?.outgoing.length ?? 0})`}>
                {!bundle || bundle.outgoing.length === 0 ? (
                  <Empty>Chưa trỏ tới trang nào.</Empty>
                ) : (
                  <ul className="space-y-1">
                    {bundle.outgoing.map((ref) => (
                      <li key={`${ref.id}-${ref.label}`}>
                        <RefButton title={ref.title} onClick={() => open(ref.id)} icon={<Link2 className="h-3.5 w-3.5" />} />
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] leading-6 text-slate-500">{children}</p>;
}

function RefButton({ title, onClick, icon }: { title: string; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-9 w-full items-center gap-2 rounded-lg px-2 text-left text-[13px] text-slate-800 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-200 dark:hover:bg-white/[0.05]"
    >
      <span className="shrink-0 text-slate-400" aria-hidden="true">{icon}</span>
      <span className="truncate">{title || 'Không có tiêu đề'}</span>
    </button>
  );
}
