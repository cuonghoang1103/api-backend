'use client';

/**
 * Lịch sử phiên bản của một trang (S2a): danh sách bên trái, bên phải so sánh
 * (với bản hiện tại hoặc bản ngay trước) theo DÒNG Markdown, hoặc xem nguyên văn.
 * Khôi phục = tạo bản mới mang nội dung cũ (không xoá lịch sử) — chỉ chủ trang
 * hoặc ADMIN (server cũng chặn).
 */

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { History, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workDocsApi, workDocsKeys, workError, type PageVersion, type WorkPageDetail } from '@/lib/work-api';
import { Dialog, EmptyState, PageLoading, UserAvatar, relativeTime } from '../ui';
import { ConfirmDialog } from '../settings/shared';
import { RichView } from '../RichEditor';
import { fmtDateTime } from '../studio/shared';

const KIND: Record<PageVersion['kind'], string> = { CREATE: 'Created', EDIT: 'Edited', RESTORE: 'Restored', MANUAL: 'Saved version' };

export default function DocHistory({ open, onClose, pid, page, canRestore, onRestored }: {
  open: boolean;
  onClose: () => void;
  pid: number;
  page: WorkPageDetail;
  canRestore: boolean;
  onRestored: (p: WorkPageDetail) => void;
}) {
  const versions = useQuery({ queryKey: workDocsKeys.versions(pid, page.number), queryFn: () => workDocsApi.versions(pid, page.number), enabled: open });
  const [sel, setSel] = useState<number | null>(null);
  const [against, setAgainst] = useState<'current' | 'previous'>('current');
  const [view, setView] = useState<'diff' | 'content'>('diff');
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (!open || !versions.data?.length) return;
    // Mặc định chọn bản ngay trước bản mới nhất (thứ người ta hay muốn so).
    setSel((cur) => cur ?? (versions.data[1]?.n ?? versions.data[0].n));
  }, [open, versions.data]);
  useEffect(() => { if (!open) { setSel(null); setView('diff'); setAgainst('current'); } }, [open]);

  const list = versions.data ?? [];
  const idx = list.findIndex((v) => v.n === sel);
  const prev = idx >= 0 ? list[idx + 1] : undefined;
  const from = against === 'current' ? sel : prev?.n ?? null;
  const to: number | 'current' = against === 'current' ? 'current' : (sel ?? 'current');
  const diff = useQuery({
    queryKey: [...workDocsKeys.versions(pid, page.number), 'diff', from, to, page.version],
    queryFn: () => workDocsApi.compare(pid, page.number, from!, to),
    enabled: open && view === 'diff' && from !== null,
  });
  const content = useQuery({
    queryKey: [...workDocsKeys.versions(pid, page.number), 'one', sel],
    queryFn: () => workDocsApi.version(pid, page.number, sel!),
    enabled: open && view === 'content' && sel !== null,
  });
  const restore = useMutation({
    mutationFn: () => workDocsApi.restore(pid, page.number, sel!),
    onSuccess: (p) => { toast.success(`Restored version ${sel} — saved as version ${p.currentVersion}`); setConfirm(false); onRestored(p); onClose(); },
    onError: (err) => toast.error(workError(err, 'Could not restore this version')),
  });

  const cur = list[idx];
  return (
    <Dialog open={open} onClose={onClose} title={<span className="flex items-center gap-2"><History size={15} /> Version history</span>} width={1080}>
      {versions.isLoading ? <PageLoading rows={6} /> : !list.length ? (
        <EmptyState title="No versions yet" />
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-[260px_minmax(0,1fr)]">
          <ol className="max-h-[30vh] overflow-y-auto rounded-[8px] border border-[var(--w-border)] md:max-h-[62vh]" aria-label="Versions">
            {list.map((v, i) => (
              <li key={v.id} className="border-b border-[var(--w-border)] last:border-b-0">
                <button
                  type="button"
                  onClick={() => setSel(v.n)}
                  aria-current={sel === v.n}
                  className={cn('flex w-full min-w-0 items-start gap-2.5 px-3 py-2 text-left', sel === v.n ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]')}
                  data-version={v.n}
                >
                  <UserAvatar user={v.author} size={20} className="mt-0.5" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-[13px] font-medium">
                      v{v.n}
                      <span className="font-normal text-[var(--w-text-2)]">{KIND[v.kind]}</span>
                      {i === 0 && <span className="rounded-[4px] bg-[var(--w-accent-soft)] px-1 text-[10.5px] font-semibold text-[var(--w-accent-text)]">LATEST</span>}
                    </span>
                    <span className="block truncate text-[12px] text-[var(--w-text-3)]">{userName(v.author)} · <span title={fmtDateTime(v.updatedAt)}>{relativeTime(v.updatedAt)}</span></span>
                    {v.note && <span className="mt-0.5 block truncate text-[12px] italic text-[var(--w-text-2)]">“{v.note}”</span>}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <div className="flex h-8 rounded-[6px] border border-[var(--w-border-strong)] p-0.5" role="radiogroup" aria-label="Show">
                {(['diff', 'content'] as const).map((m) => (
                  <button key={m} type="button" role="radio" aria-checked={view === m} onClick={() => setView(m)} className={cn('rounded-[4px] px-2.5 text-[12px] font-medium', view === m ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)]')}>
                    {m === 'diff' ? 'Compare' : 'Content'}
                  </button>
                ))}
              </div>
              {view === 'diff' && (
                <div className="flex h-8 rounded-[6px] border border-[var(--w-border-strong)] p-0.5" role="radiogroup" aria-label="Compare with">
                  {(['current', 'previous'] as const).map((m) => (
                    <button key={m} type="button" role="radio" aria-checked={against === m} disabled={m === 'previous' && !prev} onClick={() => setAgainst(m)} className={cn('rounded-[4px] px-2.5 text-[12px] font-medium disabled:opacity-40', against === m ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)]')}>
                      {m === 'current' ? `v${sel ?? '?'} → current` : prev ? `v${prev.n} → v${sel}` : 'Previous version'}
                    </button>
                  ))}
                </div>
              )}
              {canRestore && cur && idx > 0 && (
                <button type="button" className="w-btn w-btn-sm ml-auto" onClick={() => setConfirm(true)} data-testid="docs-restore">
                  <RotateCcw size={12} /> Restore v{cur.n}
                </button>
              )}
            </div>
            {view === 'diff' ? (
              diff.isLoading ? <PageLoading rows={6} /> : diff.data ? (
                <>
                  <p className="mb-2 text-[12px] text-[var(--w-text-3)]">
                    <span className="font-medium text-[var(--w-green)]">+{diff.data.added}</span> added · <span className="font-medium text-[var(--w-red)]">−{diff.data.removed}</span> removed lines
                    {diff.data.added + diff.data.removed === 0 && ' — no differences'}
                  </p>
                  <div className="w-diff max-h-[56vh] overflow-auto rounded-[8px] border border-[var(--w-border)] py-1" data-testid="docs-diff">
                    {collapse(diff.data.lines).map((l, i) => (l.op === 'gap'
                      ? <div key={i} className="w-diff-eq select-none text-center !pl-2 text-[11px] text-[var(--w-text-3)]">⋯ {l.n} unchanged lines</div>
                      : <div key={i} className={l.op === 'add' ? 'w-diff-add' : l.op === 'del' ? 'w-diff-del' : 'w-diff-eq'}>{l.text || ' '}</div>))}
                  </div>
                </>
              ) : <p className="text-[13px] text-[var(--w-text-3)]">{from === null ? 'This is the first version — nothing earlier to compare with.' : workError(diff.error, 'Could not compare')}</p>
            ) : content.isLoading ? <PageLoading rows={6} /> : content.data ? (
              <div className="w-doc max-h-[56vh] overflow-y-auto rounded-[8px] border border-[var(--w-border)] px-4 py-3">
                <h2 className="mb-2 text-[18px] font-semibold">{content.data.title}</h2>
                <RichView value={content.data.contentJson} docs />
              </div>
            ) : null}
          </div>
        </div>
      )}
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => restore.mutate()}
        pending={restore.isPending}
        danger={false}
        title={`Restore version ${sel}`}
        body="The page goes back to this version's title and content. Nothing is lost — the current text stays in the history as its own version."
        confirmLabel="Restore"
      />
    </Dialog>
  );
}

/** Gấp các khúc dòng giống nhau dài (> 6) — chỉ giữ 3 dòng ngữ cảnh mỗi bên. */
function collapse(lines: Array<{ op: 'eq' | 'add' | 'del'; text: string }>) {
  const out: Array<{ op: 'eq' | 'add' | 'del'; text: string } | { op: 'gap'; n: number; text?: undefined }> = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].op !== 'eq') { out.push(lines[i]); i++; continue; }
    let j = i;
    while (j < lines.length && lines[j].op === 'eq') j++;
    const run = lines.slice(i, j);
    const head = i === 0 ? 0 : 3;
    const tail = j === lines.length ? 0 : 3;
    if (run.length > head + tail + 2) {
      out.push(...run.slice(0, head), { op: 'gap', n: run.length - head - tail }, ...run.slice(run.length - tail));
    } else out.push(...run);
    i = j;
  }
  return out;
}
