'use client';

/** Hàng chờ kiểm duyệt của bảng tin (quản trị không gian/dự án): báo cáo đang mở ⇒ Gỡ nội dung / Bỏ qua / Mở bài. */

import Link from 'next/link';
import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, workError } from '@/lib/work-api';
import { feedApi, feedKeys } from '@/lib/work-feed-api';
import { EmptyState, Spinner, UserAvatar } from '@/components/work/ui';
import { wfmt, wt } from '@/components/work/i18n';

const STATUSES = ['OPEN', 'RESOLVED', 'DISMISSED', 'ALL'] as const;

export function ReportsPanel({ workspaceId }: { workspaceId?: number }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState<(typeof STATUSES)[number]>('OPEN');
  const [busy, setBusy] = useState<number | null>(null);
  const q = useInfiniteQuery({
    queryKey: feedKeys.reports(workspaceId, status),
    queryFn: ({ pageParam }) => feedApi.reports({ workspaceId, status, cursor: pageParam as string | null }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextCursor,
  });
  const rows = q.data?.pages.flatMap((p) => p.reports) ?? [];
  const resolve = async (id: number, action: 'remove' | 'dismiss') => {
    setBusy(id);
    try {
      await feedApi.resolveReport(id, action);
      toast.success(wt('feed.resolvedToast'));
      await Promise.all([qc.invalidateQueries({ queryKey: ['work', 'feed', 'reports'] }), qc.invalidateQueries({ queryKey: feedKeys.scopes }), qc.invalidateQueries({ queryKey: ['work', 'feed', 'list'] })]);
    } catch (err) { toast.error(workError(err)); } finally { setBusy(null); }
  };
  return (
    <section aria-labelledby="feed-reports-title">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="feed-reports-title" className="text-[16px] font-semibold">{wt('feed.reportsTitle')}</h2>
          <p className="text-[13px] text-[var(--w-text-2)]">{wt('feed.reportsSub')}</p>
        </div>
        <div className="flex gap-1" role="tablist">
          {STATUSES.map((s) => (
            <button key={s} type="button" role="tab" aria-selected={status === s} onClick={() => setStatus(s)}
              className={cn('h-8 rounded-full px-3 text-[13px] font-medium', status === s ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
              {wt(`feed.status${s}` as 'feed.statusOPEN')}{s === 'OPEN' && q.data?.pages[0]?.openCount ? ` · ${q.data.pages[0].openCount}` : ''}
            </button>
          ))}
        </div>
      </div>
      {q.isLoading ? <div className="flex justify-center py-10"><Spinner /></div>
        : !rows.length ? <EmptyState icon={<Flag size={20} />} title={wt('feed.reportsEmpty')} body={wt('feed.reportsEmptyBody')} />
        : (
          <ul className="grid gap-2">
            {rows.map((r) => (
              <li key={r.id} className="w-card p-3.5">
                <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-[var(--w-text-3)]">
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] px-2 font-medium leading-[20px] text-[var(--w-red-text)]">{wt(`feed.reason_${r.reason}` as 'feed.reason_spam')}</span>
                  <span>{r.target.type === 'post' ? wt('feed.targetPost') : wt('feed.targetComment')}</span>
                  <span>· {r.project ? r.project.name : r.workspace.name}</span>
                  <span>· {wt('feed.nReports', { count: r.reportCount })}</span>
                  <span>· {wfmt.relative(r.createdAt)}</span>
                  {r.status !== 'OPEN' && <span className="rounded-full bg-[var(--w-sunken)] px-2 leading-[20px]">{wt(`feed.status${r.status}` as 'feed.statusOPEN')}</span>}
                </div>
                <div className="mt-2 flex items-start gap-2.5">
                  <UserAvatar user={r.target.author} size={28} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold">{userName(r.target.author)}</div>
                    <p className={cn('mt-0.5 line-clamp-4 whitespace-pre-wrap text-[13.5px]', (r.target.deleted || r.target.hidden) && 'text-[var(--w-text-3)] line-through')}>{r.target.excerpt || '—'}</p>
                    {(r.target.deleted || r.target.hidden) && <p className="mt-0.5 text-[12px] text-[var(--w-text-3)]">{r.target.deleted ? wt('feed.targetDeleted') : wt('feed.targetHidden')}</p>}
                    {r.detail && <p className="mt-1.5 rounded-[6px] bg-[var(--w-sunken)] px-2 py-1 text-[12.5px] text-[var(--w-text-2)]">“{r.detail}”</p>}
                    <p className="mt-1 text-[12px] text-[var(--w-text-3)]">{wt('feed.reportedBy', { name: userName(r.reporter) })}</p>
                  </div>
                </div>
                <div className="mt-2.5 flex flex-wrap justify-end gap-1.5">
                  {!r.target.deleted && r.target.postId ? <Link className="w-btn w-btn-sm" href={r.url}>{wt('feed.openPost')}</Link> : null}
                  {r.status === 'OPEN' && (
                    <>
                      <button type="button" className="w-btn w-btn-sm" disabled={busy === r.id} onClick={() => resolve(r.id, 'dismiss')}>{wt('feed.dismiss')}</button>
                      <button type="button" className="w-btn w-btn-sm w-btn-danger-solid" disabled={busy === r.id || r.target.deleted} onClick={() => resolve(r.id, 'remove')}>{busy === r.id && <Spinner size={11} />}{wt('feed.removeContent')}</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      {q.hasNextPage && <div className="mt-3 flex justify-center"><button type="button" className="w-btn w-btn-sm" onClick={() => q.fetchNextPage()}>{wt('feed.loadMore')}</button></div>}
    </section>
  );
}
