'use client';

/**
 * Cài đặt dự án → Trash: thẻ đã xoá (xoá mềm). Khôi phục cần quyền xoá thẻ;
 * xoá vĩnh viễn chỉ admin dự án (khớp trash.service.ts ở backend).
 */

import { useState, type ReactNode } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { RotateCcw, Trash2 } from 'lucide-react';
import { workApi, workError, userName, type ProjectConfig, type TrashIssue } from '@/lib/work-api';
import { EmptyState, IssueTypeIcon, relativeTime, Spinner, UserAvatar } from '../ui';
import { ConfirmDialog, ReadOnlyNotice, Section } from './shared';
import { useProjectInvalidate } from './useProjectInvalidate';
import DocsTrash from './DocsTrash';
import DataTrash from './DataTrash';
import DeleteRequests from './DeleteRequests';
import { useSearchParams } from 'next/navigation';
import { studioOn } from '../studio/shared';
import { wt } from '@/components/work/i18n';

/**
 * Đợt S5c: Trash có tab Issues · Docs. 22/10/2026 (sự cố SWT301 mất bảng 5.1): thêm "Kiểm thử & dữ liệu khác" (thùng rác
 * dữ liệu 30 ngày — DataTrash) và "Yêu cầu xoá" (chờ trưởng nhóm duyệt — DeleteRequests). Thành viên (sửa được dự án) thấy
 * hai tab mới; tab Issues vẫn cần quyền xoá thẻ. `?bin=data|requests|docs|issues` mở thẳng một tab (lối tắt, thông báo).
 */
type BinTab = 'issues' | 'docs' | 'data' | 'requests';
export default function ProjectTrash({ config, slug }: { config: ProjectConfig; slug: string }) {
  const search = useSearchParams();
  const issuesOn = !!config.permissions.deleteIssues;
  const docsOn = studioOn(config, 'docs') && !!config.permissions.editDocs;
  const dataOn = !!config.permissions.editIssues || issuesOn;
  const avail: BinTab[] = [...(issuesOn ? ['issues' as const] : []), ...(docsOn ? ['docs' as const] : []), ...(dataOn ? ['data' as const, 'requests' as const] : [])];
  const want = search?.get('bin') as BinTab | null;
  const [kind, setKind] = useState<BinTab>(want && avail.includes(want) ? want : avail[0] ?? 'issues');
  const label = (k: BinTab) => (k === 'issues' ? wt('common.issues') : k === 'docs' ? 'Docs' : k === 'data' ? wt('bin.tabData') : wt('bin.tabRequests'));
  const tabs = avail.length > 1 ? (
    <div role="tablist" aria-label={wt('trash.contents')} className="mb-3 inline-flex flex-wrap rounded-[8px] border border-[var(--w-border)] p-0.5">
      {avail.map((k) => (
        <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)}
          className={`rounded-[6px] px-3 py-1 text-[12.5px] font-medium ${kind === k ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]'}`}>
          {label(k)}
        </button>
      ))}
    </div>
  ) : null;
  if (kind === 'docs' && docsOn) {
    return (
      <Section title={wt('trash.trash')} description={wt('trash.docsDesc')}>
        {tabs}
        <DocsTrash config={config} />
      </Section>
    );
  }
  if ((kind === 'data' || kind === 'requests') && dataOn) {
    return (
      <Section title={wt('trash.trash')}>
        {tabs}
        {kind === 'data' ? <DataTrash config={config} /> : <DeleteRequests config={config} />}
      </Section>
    );
  }
  return <IssueTrash config={config} slug={slug} tabs={tabs} />;
}

function IssueTrash({ config, slug, tabs }: { config: ProjectConfig; slug: string; tabs: ReactNode }) {
  const canRestore = config.permissions.deleteIssues;
  const canPurge = config.permissions.settings;
  const qc = useQueryClient();
  const invalidate = useProjectInvalidate(config.id, slug);
  const key = ['work', 'project', config.id, 'trash'] as const;
  const [purging, setPurging] = useState<TrashIssue | null>(null);

  const q = useQuery({ queryKey: key, queryFn: () => workApi.trash(config.id), enabled: canRestore });
  const types = new Map(config.issueTypes.map((t) => [t.id, t]));

  const refresh = () => {
    qc.invalidateQueries({ queryKey: key });
    qc.invalidateQueries({ queryKey: ['work', 'issues', config.id] });
    qc.invalidateQueries({ queryKey: ['work', 'board', config.id] });
    qc.invalidateQueries({ queryKey: ['work', 'backlog', config.id] });
    invalidate();
  };

  const restore = useMutation({
    mutationFn: (num: number) => workApi.restoreIssue(config.id, num),
    onSuccess: (_d, num) => { toast.success(wt('trash.restored', { k: `${config.key}-${num}` })); refresh(); },
    onError: (err) => toast.error(workError(err, wt('trash.restoreFailed'))),
  });
  const purge = useMutation({
    mutationFn: (num: number) => workApi.purgeIssue(config.id, num),
    onSuccess: (_d, num) => { toast.success(wt('trash.purged', { k: `${config.key}-${num}` })); setPurging(null); qc.invalidateQueries({ queryKey: key }); },
    onError: (err) => toast.error(workError(err, wt('trash.deleteFailed'))),
  });

  const description = wt('trash.issuesDesc');

  if (!canRestore) {
    return (
      <Section title={wt('trash.trash')} description={description}>
        {tabs}
        <ReadOnlyNotice>{wt('trash.needPerm')}</ReadOnlyNotice>
      </Section>
    );
  }

  const rows = q.data ?? [];

  return (
    <Section title={wt('trash.trash')} description={description}>
      {tabs}
      {q.isLoading ? (
        <div className="flex justify-center py-10"><Spinner size={18} /></div>
      ) : q.error ? (
        <EmptyState title={wt('trash.loadFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />
      ) : !rows.length ? (
        <div className="flex flex-col items-center rounded-[8px] border border-dashed border-[var(--w-border)] px-6 py-10 text-center">
          <Trash2 size={20} className="mb-2 text-[var(--w-text-3)]" />
          <div className="text-[13px] font-medium">{wt('trash.empty')}</div>
          <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{wt('trash.issuesAppear')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[8px] border border-[var(--w-border)]">
          <table className="w-full min-w-[560px] text-[13px]">
            <thead>
              <tr className="border-b border-[var(--w-border)] text-left text-[11px] uppercase tracking-wide text-[var(--w-text-3)]">
                <th className="px-3 py-2 font-medium">{wt('common.issue')}</th>
                <th className="px-3 py-2 font-medium">{wt('trash.deletedBy')}</th>
                <th className="px-3 py-2 font-medium">{wt('trash.deleted')}</th>
                <th className="px-3 py-2" aria-label={wt('common.actions')} />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[var(--w-border)] last:border-0">
                  <td className="max-w-[320px] px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <IssueTypeIcon type={types.get(r.typeId)} size={13} />
                      <span className="shrink-0 font-mono text-[12px] text-[var(--w-text-3)]">{config.key}-{r.number}</span>
                      <span className="truncate">{r.title}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    {r.deletedBy ? (
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><UserAvatar user={r.deletedBy} size={18} />{userName(r.deletedBy)}</span>
                    ) : <span className="text-[var(--w-text-3)]">—</span>}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2 text-[var(--w-text-2)]" title={new Date(r.deletedAt).toLocaleString('en-US')}>{relativeTime(r.deletedAt)}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1.5">
                      <button type="button" className="w-btn w-btn-sm" disabled={restore.isPending && restore.variables === r.number} onClick={() => restore.mutate(r.number)}>
                        {restore.isPending && restore.variables === r.number ? <Spinner size={11} /> : <RotateCcw size={13} />} {wt('common.restore')}
                      </button>
                      {canPurge && (
                        <button type="button" className="w-btn w-btn-sm w-btn-danger" onClick={() => setPurging(r)}>{wt('trash.deletePerm')}</button>
                      )}
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
        title={wt('trash.purgeQ')}
        body={
          <>
            <span className="font-medium text-[var(--w-text)]">{config.key}-{purging?.number} {purging?.title}</span> {wt('trash.purgeBody')} <span className="font-medium text-[var(--w-red)]">{wt('trash.noUndo')}</span>
          </>
        }
        confirmLabel={wt('trash.deletePerm')}
        pending={purge.isPending}
        onConfirm={() => purging && purge.mutate(purging.number)}
      />
    </Section>
  );
}
