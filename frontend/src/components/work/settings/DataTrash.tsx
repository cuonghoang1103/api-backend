'use client';

/**
 * Cài đặt dự án → Trash → "Kiểm thử & dữ liệu khác" (22/10/2026): thùng rác dữ liệu 30 ngày — hàm 5.1, UTCID, module 5.2/5.3,
 * Record of change, lần "Nhập Excel → Thay thế", test cycle/plan/design, retro, họp, RAID, sơ đồ, CR, review.
 * Khôi phục: người sửa được dự án; xoá vĩnh viễn: ADMIN (khớp trashBin.service ở backend).
 */

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Bot, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError, type ProjectConfig } from '@/lib/work-api';
import { EmptyState, relativeTime, Spinner, UserAvatar } from '../ui';
import { ConfirmDialog } from './shared';
import { binApi, binKeys, type TrashItem } from './binApi';
import { wt, wfmt } from '@/components/work/i18n';

const GROUPS = ['tests', 'meetings', 'raid', 'diagrams', 'governance', 'agile', 'other'] as const;
const groupLabel = (g: TrashItem['group']) => ({
  tests: wt('bin.gTests'), meetings: wt('bin.gMeetings'), raid: wt('bin.gRaid'), diagrams: wt('bin.gDiagrams'),
  governance: wt('bin.gGovernance'), agile: wt('bin.gAgile'), other: wt('bin.gOther'),
})[g];

export default function DataTrash({ config }: { config: ProjectConfig }) {
  const qc = useQueryClient();
  const key = binKeys.data(config.id);
  const q = useQuery({ queryKey: key, queryFn: () => binApi.list(config.id) });
  const [filter, setFilter] = useState<TrashItem['group'] | 'all'>('all');
  const [purging, setPurging] = useState<TrashItem | null>(null);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: ['work', 'fpt', config.id] });
    qc.invalidateQueries({ queryKey: ['work', 'project', config.id] });
  };
  const restore = useMutation({
    mutationFn: (id: number) => binApi.restore(config.id, id),
    onSuccess: (r, id) => {
      const it = q.data?.items.find((x) => x.id === id);
      toast.success(r.notes?.length ? wt('bin.restoredNote', { note: r.notes.join('; ') }) : wt('bin.restored', { label: it?.label ?? '' }));
      refresh();
    },
    onError: (e) => toast.error(workError(e, wt('bin.restoreFailed'))),
  });
  const purge = useMutation({
    mutationFn: (id: number) => binApi.purge(config.id, id),
    onSuccess: () => { toast.success(wt('bin.purged')); setPurging(null); qc.invalidateQueries({ queryKey: key }); },
    onError: (e) => toast.error(workError(e)),
  });

  if (q.isLoading) return <div className="flex justify-center py-10"><Spinner size={18} /></div>;
  if (q.error) return <EmptyState title={wt('bin.loadFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />;
  const days = q.data?.days ?? 30;
  const all = q.data?.items ?? [];
  const present = GROUPS.filter((g) => all.some((x) => x.group === g));
  const rows = filter === 'all' ? all : all.filter((x) => x.group === filter);

  return (
    <div>
      <p className="mb-3 text-[12.5px] text-[var(--w-text-2)]">{wt('bin.dataDesc', { days })}</p>
      {present.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(['all', ...present] as const).map((g) => (
            <button key={g} type="button" aria-pressed={filter === g} onClick={() => setFilter(g)}
              className={cn('rounded-full border px-2.5 py-0.5 text-[12px]', filter === g ? 'border-[var(--w-accent)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'border-[var(--w-border)] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
              {g === 'all' ? wt('bin.all') : groupLabel(g)}
            </button>
          ))}
        </div>
      )}
      {!rows.length ? (
        <div className="flex flex-col items-center rounded-[8px] border border-dashed border-[var(--w-border)] px-6 py-10 text-center">
          <Trash2 size={20} className="mb-2 text-[var(--w-text-3)]" />
          <div className="text-[13px] font-medium">{wt('bin.empty')}</div>
          <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{wt('bin.emptyBody', { days })}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
          <table className="w-full min-w-[640px] text-[13px]">
            <thead>
              <tr className="border-b border-[var(--w-border)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
                <th className="px-3 py-2 font-medium">{wt('bin.item')}</th>
                <th className="px-3 py-2 font-medium">{wt('bin.deletedBy')}</th>
                <th className="px-3 py-2 font-medium">{wt('bin.deleted')}</th>
                <th className="px-3 py-2 font-medium">{wt('bin.expires')}</th>
                <th className="px-3 py-2" aria-label={wt('common.actions')} />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[var(--w-border)] last:border-0 align-top">
                  <td className="max-w-[380px] px-3 py-2">
                    <div className="break-words">{r.label}</div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11.5px] text-[var(--w-text-3)]">
                      <span>{groupLabel(r.group)}</span>
                      {r.itemCount > 1 && <span>· {wt('bin.items', { count: r.itemCount })}</span>}
                      {r.source === 'approved' && <span>· {wt('bin.viaApproved')} #{r.requestId}</span>}
                      {r.source === 'ai' && <span className="inline-flex items-center gap-0.5">· <Bot size={11} /> {wt('bin.viaAi')}</span>}
                      {r.source === 'token' && <span>· {wt('bin.viaToken')}</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {r.deletedBy ? <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><UserAvatar user={r.deletedBy} size={18} />{userName(r.deletedBy)}</span> : <span className="text-[var(--w-text-3)]">—</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-[var(--w-text-2)]" title={wfmt.dateTime(r.deletedAt)}>{relativeTime(r.deletedAt)}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-[var(--w-text-2)]">{wfmt.shortDate(r.expiresAt)}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" className="w-btn w-btn-sm" disabled={restore.isPending && restore.variables === r.id} onClick={() => restore.mutate(r.id)}>
                        {restore.isPending && restore.variables === r.id ? <Spinner size={11} /> : <RotateCcw size={13} />} {wt('bin.restore')}
                      </button>
                      {q.data?.canPurge && <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setPurging(r)}>{wt('bin.deletePerm')}</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={!!purging}
        onClose={() => setPurging(null)}
        title={wt('bin.purgeQ')}
        body={<><span className="font-medium text-[var(--w-text)]">{purging?.label}</span> {wt('bin.purgeBody')}</>}
        confirmLabel={wt('bin.deletePerm')}
        pending={purge.isPending}
        onConfirm={() => purging && purge.mutate(purging.id)}
      />
    </div>
  );
}
