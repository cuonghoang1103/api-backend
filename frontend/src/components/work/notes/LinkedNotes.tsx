'use client';

/**
 * "Ghi chú liên kết" trên chi tiết thẻ CT Work — chiều B của chip "@CT Work issue"
 * trong Ghi chú. Ghi chú là RIÊNG TƯ: backend chỉ trả ghi chú CỦA NGƯỜI ĐANG XEM
 * tham chiếu tới thẻ này (người khác mở cùng thẻ không thấy ghi chú của ta).
 * THAM CHIẾU, không sao chép: chỉ hiện tiêu đề + mở trang ghi chú.
 */

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { NotebookPen, Link2, X, Search, Loader2 } from 'lucide-react';
import { workIssueNotesApi, workIssueNotesKeys, workError } from '@/lib/work-api';
import { notesApi } from '@/lib/api';
import { Popover } from '../ui';

interface NoteHit { id: number; title: string; snippet: string }

export function LinkedNotes({ pid, issueNumber }: { pid: number; issueNumber: number }) {
  const qc = useQueryClient();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const key = workIssueNotesKeys.list(pid, issueNumber);
  const q = useQuery({ queryKey: key, queryFn: () => workIssueNotesApi.list(pid, issueNumber) });
  const notes = q.data?.notes ?? [];
  const refresh = () => qc.invalidateQueries({ queryKey: key });

  const link = useMutation({
    mutationFn: (noteId: number) => workIssueNotesApi.link(pid, issueNumber, noteId),
    onSuccess: (data) => { qc.setQueryData(key, data); setOpen(false); },
    onError: (err) => toast.error(workError(err, 'Không liên kết được ghi chú')),
  });
  const unlink = useMutation({
    mutationFn: (noteId: number) => workIssueNotesApi.unlink(pid, issueNumber, noteId),
    onSuccess: (data) => qc.setQueryData(key, data),
    onError: (err) => toast.error(workError(err, 'Không gỡ được liên kết')),
  });

  // Tìm ghi chú CỦA NGƯỜI DÙNG để liên kết (dùng notesApi — ghi chú cá nhân).
  const [term, setTerm] = useState('');
  const [hits, setHits] = useState<NoteHit[]>([]);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    if (!open) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await notesApi.search({ q: term.trim() || undefined });
        setHits(res.data.data.map((n) => ({ id: n.id, title: n.title, snippet: n.snippet })));
      } catch { /* bỏ qua */ }
      finally { if (!ctrl.signal.aborted) setSearching(false); }
    }, 220);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [term, open]);

  const linked = new Set(notes.map((n) => n.id));

  return (
    <section>
      <div className="mb-2 flex items-center">
        <h3 className="w-section-title">Ghi chú liên kết</h3>
        <button ref={btnRef} type="button" className="w-btn w-btn-ghost w-btn-sm ml-auto" onClick={() => setOpen(true)}>
          <Link2 size={13} /> Liên kết ghi chú
        </button>
      </div>
      {notes.length ? (
        <ul className="overflow-hidden rounded-[6px] border border-[var(--w-border)]">
          {notes.map((n) => (
            <li key={n.linkId} className="group flex min-w-0 items-center gap-2 border-b border-[var(--w-border)] px-2.5 py-1.5 last:border-b-0 hover:bg-[var(--w-hover)]">
              <Link href={n.url} className="flex min-w-0 flex-1 items-center gap-2 text-[13px]">
                <NotebookPen size={13} className="shrink-0 text-[var(--w-text-3)]" />
                <span className="min-w-0 truncate">{n.title || 'Không có tiêu đề'}</span>
                {n.subject && (
                  <span className="shrink-0 rounded px-1.5 py-0.5 text-[11px]" style={{ backgroundColor: `${n.subject.color ?? '#64748b'}22`, color: n.subject.color ?? 'var(--w-text-3)' }}>
                    {n.subject.name}
                  </span>
                )}
              </Link>
              <button
                type="button"
                className="w-btn w-btn-ghost w-btn-icon w-btn-sm opacity-0 focus:opacity-100 group-hover:opacity-100 max-md:opacity-100"
                aria-label={`Gỡ liên kết ${n.title}`}
                onClick={() => unlink.mutate(n.id)}
              >
                <X size={12} />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-[var(--w-text-3)]">Liên kết ghi chú cá nhân của bạn với thẻ này để tiện tra cứu.</p>
      )}

      <Popover open={open} onClose={() => setOpen(false)} anchorRef={btnRef} width={320} align="end">
        <div className="flex items-center gap-2 border-b border-[var(--w-border)] px-2.5 py-2">
          <Search size={13} className="text-[var(--w-text-3)]" />
          <input
            autoFocus
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Tìm ghi chú của bạn…"
            className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-[var(--w-text-3)]"
          />
          {searching && <Loader2 size={13} className="animate-spin text-[var(--w-text-3)]" />}
        </div>
        <ul className="max-h-[280px] overflow-y-auto py-1">
          {hits.filter((h) => !linked.has(h.id)).length === 0 && !searching && (
            <li className="px-3 py-4 text-center text-[12px] text-[var(--w-text-3)]">
              {term.trim() ? 'Không tìm thấy ghi chú.' : 'Gõ để tìm ghi chú của bạn.'}
            </li>
          )}
          {hits.filter((h) => !linked.has(h.id)).map((h) => (
            <li key={h.id}>
              <button
                type="button"
                className="flex w-full items-start gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)]"
                onClick={() => link.mutate(h.id)}
              >
                <NotebookPen size={13} className="mt-0.5 shrink-0 text-[var(--w-text-3)]" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate">{h.title || 'Không có tiêu đề'}</span>
                  {h.snippet && <span className="block truncate text-[11px] text-[var(--w-text-3)]">{h.snippet}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Popover>
    </section>
  );
}
