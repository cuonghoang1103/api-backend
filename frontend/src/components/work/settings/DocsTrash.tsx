'use client';

/**
 * Cài đặt dự án → Trash → Docs (đợt S5c). Trang đã xoá (mỗi LẦN xoá một dòng, kèm số trang con đi cùng).
 * Khôi phục = chủ trang hoặc ADMIN (cả cây con; cha còn ⇒ về chỗ cũ, không thì lên gốc); xoá vĩnh viễn = chỉ ADMIN
 * (trang có phê duyệt đã ký ⇒ server từ chối). Khớp pageTrash.service.ts ở backend.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FileText, RotateCcw, Trash2 } from 'lucide-react';
import { workError, type ProjectConfig } from '@/lib/work-api';
import { workS5cApi, workS5cKeys, type TrashPage } from '@/lib/work-s5c-api';
import { EmptyState, relativeTime, Spinner } from '../ui';
import { ConfirmDialog } from './shared';

export default function DocsTrash({ config }: { config: ProjectConfig }) {
  const qc = useQueryClient();
  const key = workS5cKeys.trashPages(config.id);
  const q = useQuery({ queryKey: key, queryFn: () => workS5cApi.trashPages(config.id) });
  const [purging, setPurging] = useState<TrashPage | null>(null);
  const docsBase = `/work/${config.workspace.slug}/${config.key}/docs`;

  const refresh = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ predicate: (x) => x.queryKey[0] === 'work' && JSON.stringify(x.queryKey).includes('page') });
  };
  const restore = useMutation({
    mutationFn: (num: number) => workS5cApi.restorePage(config.id, num),
    onSuccess: (r) => {
      toast.success(`Restored ${r.restored} document${r.restored === 1 ? '' : 's'}${r.toTopLevel ? ' to the top level' : ''}`);
      refresh();
    },
    onError: (err) => toast.error(workError(err, 'Could not restore the document')),
  });
  const purge = useMutation({
    mutationFn: (num: number) => workS5cApi.purgePage(config.id, num),
    onSuccess: (r) => { toast.success(`Permanently deleted ${r.deleted} document${r.deleted === 1 ? '' : 's'}`); setPurging(null); qc.invalidateQueries({ queryKey: key }); },
    onError: (err) => { toast.error(workError(err, 'Could not delete the document')); setPurging(null); },
  });

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner size={18} /></div>;
  if (q.error) return <EmptyState title="Could not load deleted documents" body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />;
  const rows = q.data?.items ?? [];
  if (!rows.length) {
    return (
      <div className="flex flex-col items-center rounded-[8px] border border-dashed border-[var(--w-border)] px-6 py-10 text-center">
        <Trash2 size={20} className="mb-2 text-[var(--w-text-3)]" />
        <div className="text-[13px] font-medium">No deleted documents</div>
        <p className="mt-1 text-[12px] text-[var(--w-text-3)]">Documents you delete (with their child pages) will appear here.</p>
      </div>
    );
  }

  return (
    <>
      <ul className="divide-y divide-[var(--w-border)] overflow-hidden rounded-[8px] border border-[var(--w-border)]">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-3 py-2.5 text-[13px]">
            <FileText size={14} className="shrink-0 text-[var(--w-text-3)]" />
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <span className="shrink-0 font-mono text-[12px] text-[var(--w-text-3)]">#{r.number}</span>
                <span className="truncate font-medium">{r.title}</span>
                {r.visibility === 'CLIENT' && <span className="shrink-0 rounded-full bg-[var(--w-sunken)] px-1.5 text-[11px] text-[var(--w-text-3)]">Client</span>}
              </div>
              <div className="mt-0.5 text-[12px] text-[var(--w-text-3)]">
                {r.childCount > 0 && <>{r.childCount} child page{r.childCount === 1 ? '' : 's'} · </>}
                deleted {relativeTime(r.deletedAt)}{r.deletedBy?.name ? ` by ${r.deletedBy.name}` : ''} ·{' '}
                {r.restoresTo ? <>restores under <Link className="hover:underline" href={`${docsBase}/${r.restoresTo.number}`}>{r.restoresTo.title}</Link></> : 'restores to the top level'}
              </div>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <span title={r.canRestore ? undefined : 'Only the document owner or a project admin can restore it'}>
                <button type="button" className="w-btn w-btn-sm" disabled={!r.canRestore || (restore.isPending && restore.variables === r.number)} onClick={() => restore.mutate(r.number)}>
                  {restore.isPending && restore.variables === r.number ? <Spinner size={11} /> : <RotateCcw size={13} />} Restore
                </button>
              </span>
              {q.data?.canPurge && <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setPurging(r)}>Delete permanently</button>}
            </div>
          </li>
        ))}
      </ul>
      <ConfirmDialog
        open={!!purging}
        onClose={() => setPurging(null)}
        title="Delete document permanently?"
        body={
          <>
            <span className="font-medium text-[var(--w-text)]">#{purging?.number} {purging?.title}</span>
            {purging?.childCount ? ` and ${purging.childCount} child page${purging.childCount === 1 ? '' : 's'}` : ''} will be erased forever, with their versions,
            comments and issue links. Documents with signed approvals cannot be deleted. <span className="font-medium text-[var(--w-red)]">This cannot be undone.</span>
          </>
        }
        confirmLabel="Delete permanently"
        pending={purge.isPending}
        onConfirm={() => purging && purge.mutate(purging.number)}
      />
    </>
  );
}
