'use client';

/** Tab "Pull request": mở / merge / đóng, người tạo, reviewer, nhánh, thẻ liên quan, số dòng. */

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, GitPullRequest } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError } from '@/lib/work-api';
import { Spinner } from '../ui';
import { wt, wfmt } from '../i18n';
import { codeApi, codeKeys, type PullItem } from './codeApi';
import { BranchName, IssueChips, LineDelta, prIcon, WhoChip } from './parts';

type St = 'open' | 'merged' | 'closed' | 'all';

function when(p: PullItem): string {
  if (p.state === 'merged') return wt('code.mergedAgo', { t: wfmt.relative(p.mergedAt ?? p.openedAt) });
  if (p.state === 'closed') return wt('code.closedAgo', { t: wfmt.relative(p.closedAt ?? p.openedAt) });
  return wt('code.openedAgo', { t: wfmt.relative(p.openedAt) });
}

export default function PullsTab({ pid, projectKey, state, onState, focus, onIssue, onSource }: {
  pid: number; projectKey: string; state: St; onState: (s: St) => void; focus: number | null; onIssue: (n: number) => void; onSource: (ref: string) => void;
}) {
  const q = useQuery({ queryKey: codeKeys.pulls(pid, state), queryFn: () => codeApi.pulls(pid, state), staleTime: 30_000 });
  useEffect(() => {
    if (focus && q.data) document.getElementById(`pr-${focus}`)?.scrollIntoView({ block: 'center' });
  }, [focus, q.data]);
  const c = q.data?.counts;
  const seg: Array<[St, string, number | undefined]> = [
    ['open', wt('code.stOpen'), c?.open], ['merged', wt('code.stMerged'), c?.merged], ['closed', wt('code.stClosed'), c?.closed], ['all', wt('code.kAll'), c ? c.open + c.merged + c.closed : undefined],
  ];

  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-[8px] border border-[var(--w-border)] p-0.5" role="radiogroup" aria-label={wt('code.prState')}>
        {seg.map(([v, label, n]) => (
          <button key={v} type="button" role="radio" aria-checked={state === v} onClick={() => onState(v)}
            className={cn('inline-flex h-7 items-center gap-1.5 rounded-[6px] px-2.5 text-[12.5px] font-medium', state === v ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]')}>
            {label}{n !== undefined && <span className="tabular-nums text-[var(--w-text-3)]">{n}</span>}
          </button>
        ))}
      </div>

      {q.isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : q.isError ? (
        <p className="text-[13px] text-[var(--w-red-text)]">{workError(q.error, wt('code.loadFailed'))}</p>
      ) : !q.data!.items.length ? (
        <div className="rounded-[10px] border border-dashed border-[var(--w-border-strong)] px-6 py-10 text-center">
          <GitPullRequest size={22} className="mx-auto text-[var(--w-text-3)]" aria-hidden="true" />
          <p className="mt-2 text-[14px] font-medium">{wt('code.noPrs')}</p>
          <p className="mt-1 text-[13px] text-[var(--w-text-2)]">{wt('code.noPrsBody')}</p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)]">
          {q.data!.items.map((p) => {
            const { icon: Icon, color } = prIcon(p.state);
            return (
              <li key={`${p.provider}:${p.number}`} id={`pr-${p.number}`} className={cn('flex gap-3 border-b border-[var(--w-border)] px-4 py-3 last:border-b-0 hover:bg-[var(--w-hover)]', focus === p.number && 'w-flash')}>
                <Icon size={17} className="mt-0.5 shrink-0" style={{ color }} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {p.url ? (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className="min-w-0 text-[14px] font-semibold hover:text-[var(--w-accent-text)] hover:underline">{p.title}</a>
                    ) : <span className="min-w-0 text-[14px] font-semibold">{p.title}</span>}
                    {p.state === 'draft' && <span className="rounded-full border border-[var(--w-border-strong)] px-1.5 text-[11px] text-[var(--w-text-2)]">{wt('code.stDraft')}</span>}
                    <IssueChips nums={p.issueNumbers} refs={q.data!.issues} projectKey={projectKey} onOpen={onIssue} />
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-[var(--w-text-2)]">
                    <span className="font-mono text-[12px] text-[var(--w-text-3)]">{p.provider === 'GITLAB' ? '!' : '#'}{p.number}</span>
                    <span title={wfmt.dateTime(p.mergedAt ?? p.closedAt ?? p.openedAt)}>{when(p)}</span>
                    {p.author && <><span className="text-[var(--w-text-3)]">·</span><WhoChip who={p.author} size={16} muted /></>}
                    {p.headRef && (
                      <span className="inline-flex items-center gap-1">
                        <BranchName name={p.headRef} onClick={p.state === 'open' || p.state === 'draft' ? () => onSource(p.headRef!) : undefined} />
                        {p.baseRef && <><span className="text-[var(--w-text-3)]">→</span><BranchName name={p.baseRef} /></>}
                      </span>
                    )}
                    {p.mergedBy && p.state === 'merged' && <span>{wt('code.mergedBy')} <WhoChip who={p.mergedBy} size={16} muted /></span>}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <LineDelta add={p.additions} del={p.deletions} />
                  {p.reviewers.length > 0 && (
                    <span className="flex items-center gap-1 text-[11.5px] text-[var(--w-text-3)]" title={p.reviewers.map((r) => r.label).join(', ')}>
                      {wt('code.reviewers')}
                      <span className="flex -space-x-1">{p.reviewers.slice(0, 4).map((r) => <WhoChip key={r.label} who={r} size={18} className="[&>span:last-child]:hidden" />)}</span>
                    </span>
                  )}
                  {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11.5px] text-[var(--w-text-3)] hover:text-[var(--w-accent-text)]"><ExternalLink size={11} /> {p.provider === 'GITLAB' ? 'GitLab' : 'GitHub'}</a>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
