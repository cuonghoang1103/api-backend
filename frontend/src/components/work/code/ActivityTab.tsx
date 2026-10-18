'use client';

/**
 * Tab "Hoạt động": dòng thời gian Git kiểu GitHub — push (người đẩy, nhánh, từng commit), tạo/xoá nhánh, PR mở/merge/
 * đóng, yêu cầu review — nhóm theo ngày, lọc theo người / nhánh / loại / khoảng ngày, tải thêm theo trang.
 */

import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ExternalLink, Filter, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Spinner } from '../ui';
import { Select } from '../settings/shared';
import { wt, wfmt } from '../i18n';
import { codeApi, codeKeys, type ActivityItem, type ActivityQuery, type IssueRef } from './codeApi';
import { BranchName, EventDot, IssueChips, LineDelta, Sha, WhoChip } from './parts';
import { localDay } from './codeText';

function dayLabel(day: string): string {
  const today = localDay(new Date().toISOString());
  const y = new Date(); y.setDate(y.getDate() - 1);
  if (day === today) return wt('code.today');
  if (day === localDay(y.toISOString())) return wt('code.yesterday');
  return wfmt.date(`${day}T12:00:00`, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function Headline({ it, onBranch }: { it: ActivityItem; onBranch: (b: string) => void }) {
  const pr = it.prNumber ? `#${it.prNumber}` : '';
  const branch = it.ref ? <BranchName name={it.ref} deleted={it.kind === 'BRANCH_DELETED'} onClick={() => onBranch(it.ref!)} /> : null;
  const who = <WhoChip who={it.actor} size={20} />;
  const d = it.data as { forced?: boolean; created?: boolean; reviewer?: string; baseRef?: string };
  switch (it.kind) {
    case 'PUSH':
      return <>{who}<span className="text-[var(--w-text-2)]">{wt(d.forced ? 'code.hForcePushed' : 'code.hPushed', { n: it.commitCount })}</span>{branch}{d.created && <span className="rounded-full bg-[var(--w-sunken)] px-1.5 text-[11px] text-[var(--w-text-2)]">{wt('code.newBranch')}</span>}</>;
    case 'COMMIT':
      return <>{who}<span className="text-[var(--w-text-2)]">{wt('code.hCommitted')}</span></>;
    case 'BRANCH_CREATED':
      return <>{who}<span className="text-[var(--w-text-2)]">{wt('code.hCreatedBranch')}</span>{branch}</>;
    case 'BRANCH_DELETED':
      return <>{who}<span className="text-[var(--w-text-2)]">{wt('code.hDeletedBranch')}</span>{branch}</>;
    case 'PR_OPENED':
      return <>{who}<span className="text-[var(--w-text-2)]">{wt('code.hOpenedPr', { n: pr })}</span></>;
    case 'PR_REOPENED':
      return <>{who}<span className="text-[var(--w-text-2)]">{wt('code.hReopenedPr', { n: pr })}</span></>;
    case 'PR_MERGED':
      return <>{who}<span className="text-[var(--w-text-2)]">{wt('code.hMergedPr', { n: pr })}</span>{d.baseRef && <><span className="text-[var(--w-text-3)]">→</span><BranchName name={d.baseRef} onClick={() => onBranch(d.baseRef!)} /></>}</>;
    case 'PR_CLOSED':
      return <>{who}<span className="text-[var(--w-text-2)]">{wt('code.hClosedPr', { n: pr })}</span></>;
    case 'REVIEW_REQUESTED':
      return <>{who}<span className="text-[var(--w-text-2)]">{wt('code.hReviewReq', { n: pr, x: d.reviewer ?? '' })}</span></>;
    default:
      return who;
  }
}

function ActivityRow({ it, refs, projectKey, onIssue, onCommit, onBranch, highlight }: {
  it: ActivityItem; refs: Record<number, IssueRef>; projectKey: string; onIssue: (n: number) => void; onCommit: (sha: string) => void; onBranch: (b: string) => void; highlight: boolean;
}) {
  const [all, setAll] = useState(false);
  const commits = all ? it.commits : it.commits.slice(-5).reverse();
  const isPr = it.kind.startsWith('PR_') || it.kind === 'REVIEW_REQUESTED';
  const d = it.data as { additions?: number | null; deletions?: number | null };
  return (
    <li id={it.id} className={cn('relative flex gap-3 pb-5', highlight && 'w-flash')}>
      <span aria-hidden="true" className="absolute bottom-0 left-4 top-9 w-px bg-[var(--w-border)]" />
      <EventDot kind={it.kind} />
      <div className="min-w-0 flex-1 pt-1">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13.5px]">
          <Headline it={it} onBranch={onBranch} />
          <span className="text-[12px] text-[var(--w-text-3)]" title={wfmt.dateTime(it.occurredAt)}>· {wfmt.relative(it.occurredAt)}</span>
          {it.url && (
            <a href={it.url} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-[12px] text-[var(--w-text-3)] hover:text-[var(--w-accent-text)]" title={wt('code.openOnHost')}>
              <ExternalLink size={12} /> <span className="hidden sm:inline">{it.provider === 'GITLAB' ? 'GitLab' : 'GitHub'}</span>
            </a>
          )}
        </div>

        {isPr && it.title && (
          <div className="mt-2 flex flex-wrap items-center gap-2 rounded-[8px] border border-[var(--w-border)] bg-[var(--w-raised)] px-3 py-2">
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{it.title}</span>
            <IssueChips nums={it.issueNumbers} refs={refs} projectKey={projectKey} onOpen={onIssue} />
            <LineDelta add={d.additions} del={d.deletions} />
          </div>
        )}

        {it.commits.length > 0 && (
          <ul className="mt-2 overflow-hidden rounded-[8px] border border-[var(--w-border)] bg-[var(--w-raised)]">
            {commits.map((c) => (
              <li key={c.sha} className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-b border-[var(--w-border)] px-3 py-2 last:border-b-0 hover:bg-[var(--w-hover)]">
                <Sha sha={c.sha} onClick={() => onCommit(c.sha)} />
                <span className="min-w-0 flex-1 truncate text-[13px]" title={c.message}>{c.message.split('\n')[0]}</span>
                <IssueChips nums={c.issueNumbers} refs={refs} projectKey={projectKey} onOpen={onIssue} />
                <WhoChip who={c.author} size={16} muted className="max-w-[160px] text-[12px]" />
                {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" aria-label={wt('code.openOnHost')} className="text-[var(--w-text-3)] hover:text-[var(--w-accent-text)]"><ExternalLink size={12} /></a>}
              </li>
            ))}
            {it.commits.length > 5 && (
              <li className="px-3 py-1.5">
                <button type="button" className="text-[12px] font-medium text-[var(--w-accent-text)] hover:underline" onClick={() => setAll((v) => !v)}>
                  {all ? wt('code.showFewer') : wt('code.showAllCommits', { n: it.commits.length })}
                </button>
              </li>
            )}
            {it.kind === 'PUSH' && it.commitCount > it.commits.length && (
              <li className="px-3 py-1.5 text-[12px] text-[var(--w-text-3)]">{wt('code.moreNotSent', { n: it.commitCount - it.commits.length })}</li>
            )}
          </ul>
        )}
        {!isPr && !it.commits.length && it.issueNumbers.length > 0 && (
          <div className="mt-1.5"><IssueChips nums={it.issueNumbers} refs={refs} projectKey={projectKey} onOpen={onIssue} /></div>
        )}
      </div>
    </li>
  );
}

export default function ActivityTab({ pid, projectKey, initialEvent, onIssue, onCommit, onBranchSource }: {
  pid: number; projectKey: string; initialEvent: string | null; onIssue: (n: number) => void; onCommit: (sha: string) => void; onBranchSource: (b: string) => void;
}) {
  const [f, setF] = useState<ActivityQuery>({});
  const filtered = !!(f.actor || f.branch || f.kind || f.from || f.to);
  const q = useInfiniteQuery({
    queryKey: codeKeys.activity(pid, f),
    queryFn: ({ pageParam }) => codeApi.activity(pid, { ...f, before: pageParam ?? undefined, limit: 30 }),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => last.nextBefore,
    staleTime: 20_000,
    refetchInterval: 60_000,
  });
  const pages = q.data?.pages ?? [];
  const items = pages.flatMap((p) => p.items);
  const refs = useMemo(() => Object.assign({}, ...pages.map((p) => p.issues)) as Record<number, IssueRef>, [pages]);
  const filters = pages[0]?.filters;
  const byDay = useMemo(() => {
    const m = new Map<string, ActivityItem[]>();
    for (const it of items) { const k = localDay(it.occurredAt); m.set(k, [...(m.get(k) ?? []), it]); }
    return [...m.entries()];
  }, [items]);

  useEffect(() => {
    if (!initialEvent || !items.length) return;
    document.getElementById(`e${initialEvent}`)?.scrollIntoView({ block: 'center' });
  }, [initialEvent, items.length]);

  const set = (patch: Partial<ActivityQuery>) => setF((cur) => {
    const next = { ...cur, ...patch };
    for (const k of Object.keys(next) as (keyof ActivityQuery)[]) if (next[k] === '' || next[k] === undefined) delete next[k];
    return next;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={wt('code.filters')}>
        <Filter size={14} className="text-[var(--w-text-3)]" aria-hidden="true" />
        <div className="inline-flex rounded-[8px] border border-[var(--w-border)] p-0.5" role="radiogroup" aria-label={wt('code.kind')}>
          {([['', wt('code.kAll')], ['push', wt('code.kPushes')], ['pr', wt('code.kPrs')], ['branch', wt('code.kBranches')]] as const).map(([v, label]) => (
            <button key={v || 'all'} type="button" role="radio" aria-checked={(f.kind ?? '') === v} onClick={() => set({ kind: (v || undefined) as ActivityQuery['kind'] })}
              className={cn('h-7 rounded-[6px] px-2.5 text-[12.5px] font-medium', (f.kind ?? '') === v ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
              {label}
            </button>
          ))}
        </div>
        <Select aria-label={wt('code.person')} value={f.actor ?? ''} onChange={(e) => set({ actor: e.target.value || undefined })} className="!h-8 w-[180px]">
          <option value="">{wt('code.anyone')}</option>
          {filters?.actors.map((a) => <option key={a.value} value={a.value}>{a.user ? a.label : `${a.label} (git)`}</option>)}
        </Select>
        <Select aria-label={wt('code.branch')} value={f.branch ?? ''} onChange={(e) => set({ branch: e.target.value || undefined })} className="!h-8 w-[180px]">
          <option value="">{wt('code.allBranches')}</option>
          {filters?.branches.map((b) => <option key={b.name} value={b.name}>{b.deleted ? `${b.name} ${wt('code.deletedTag')}` : b.name}</option>)}
        </Select>
        <label className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]">
          {wt('code.from')}
          <input type="date" className="w-input !h-8 w-[140px]" value={f.from ?? ''} onChange={(e) => set({ from: e.target.value || undefined })} />
        </label>
        <label className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]">
          {wt('code.to')}
          <input type="date" className="w-input !h-8 w-[140px]" value={f.to ?? ''} onChange={(e) => set({ to: e.target.value || undefined })} />
        </label>
        {filtered && (
          <button type="button" className="w-btn w-btn-sm" onClick={() => setF({})}><X size={13} /> {wt('code.clear')}</button>
        )}
        {q.isFetching && !q.isFetchingNextPage && <Spinner size={12} />}
      </div>

      {q.isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : q.isError ? (
        <p className="text-[13px] text-[var(--w-red-text)]">{workError(q.error, wt('code.loadFailed'))}</p>
      ) : !items.length ? (
        <div className="rounded-[10px] border border-dashed border-[var(--w-border-strong)] px-6 py-10 text-center">
          <p className="text-[14px] font-medium">{filtered ? wt('code.noMatch') : wt('code.noActivity')}</p>
          <p className="mt-1 text-[13px] text-[var(--w-text-2)]">{filtered ? wt('code.noMatchBody') : wt('code.noActivityBody')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {byDay.map(([day, list]) => (
            <section key={day} aria-label={dayLabel(day)}>
              <h3 className="sticky top-0 z-[1] mb-3 bg-[var(--w-panel)] py-1 text-[12px] font-semibold uppercase tracking-[0.04em] text-[var(--w-text-3)]">{dayLabel(day)}</h3>
              <ol>
                {list.map((it) => (
                  <ActivityRow key={it.id} it={it} refs={refs} projectKey={projectKey} onIssue={onIssue} onCommit={onCommit}
                    onBranch={(b) => (it.kind === 'BRANCH_DELETED' ? set({ branch: b }) : onBranchSource(b))} highlight={initialEvent !== null && it.id === `e${initialEvent}`} />
                ))}
              </ol>
            </section>
          ))}
          {q.hasNextPage && (
            <div className="flex justify-center pt-2">
              <button type="button" className="w-btn" disabled={q.isFetchingNextPage} onClick={() => void q.fetchNextPage()}>
                {q.isFetchingNextPage && <Spinner size={12} />} {wt('code.loadMore')}
              </button>
            </div>
          )}
        </div>
      )}

      <p className="flex items-start gap-1.5 border-t border-[var(--w-border)] pt-3 text-[12px] text-[var(--w-text-3)]">
        <Info size={13} className="mt-0.5 shrink-0" aria-hidden="true" />
        <span>{wt('code.pullNote')}</span>
      </p>
    </div>
  );
}
