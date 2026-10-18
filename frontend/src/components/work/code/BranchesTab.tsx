'use client';

/** Tab "Nhánh": nhánh của repo (theo webhook) — commit cuối, ai, lúc nào, thẻ liên quan (từ tên nhánh `NT-12-…`), PR đang mở. */

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, FolderGit2, Search } from 'lucide-react';
import { workError } from '@/lib/work-api';
import { Spinner } from '../ui';
import { wt, wfmt } from '../i18n';
import { codeApi, codeKeys } from './codeApi';
import { BranchName, IssueChips, PrState, Sha, WhoChip } from './parts';

export default function BranchesTab({ pid, projectKey, onIssue, onSource, onCommit, onPulls }: {
  pid: number; projectKey: string; onIssue: (n: number) => void; onSource: (ref: string) => void; onCommit: (sha: string) => void; onPulls: () => void;
}) {
  const q = useQuery({ queryKey: codeKeys.branches(pid), queryFn: () => codeApi.branches(pid), staleTime: 30_000 });
  const [term, setTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const items = useMemo(() => {
    const t = term.trim().toLowerCase();
    return (q.data?.items ?? []).filter((b) => (showDeleted || !b.deleted) && (!t || b.name.toLowerCase().includes(t)));
  }, [q.data, term, showDeleted]);
  const deletedCount = (q.data?.items ?? []).filter((b) => b.deleted).length;

  if (q.isLoading) return <div className="flex justify-center py-12"><Spinner /></div>;
  if (q.isError) return <p className="text-[13px] text-[var(--w-red-text)]">{workError(q.error, wt('code.loadFailed'))}</p>;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full max-w-[320px]">
          <Search size={14} aria-hidden="true" className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input className="w-input !h-8 w-full !pl-8" placeholder={wt('code.findBranch')} value={term} onChange={(e) => setTerm(e.target.value)} aria-label={wt('code.findBranch')} />
        </div>
        {deletedCount > 0 && (
          <label className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]">
            <input type="checkbox" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} />
            {wt('code.showDeleted', { n: deletedCount })}
          </label>
        )}
      </div>

      {!items.length ? (
        <div className="rounded-[10px] border border-dashed border-[var(--w-border-strong)] px-6 py-10 text-center">
          <FolderGit2 size={22} className="mx-auto text-[var(--w-text-3)]" aria-hidden="true" />
          <p className="mt-2 text-[14px] font-medium">{term ? wt('code.noMatch') : wt('code.noBranches')}</p>
          <p className="mt-1 text-[13px] text-[var(--w-text-2)]">{wt('code.noBranchesBody')}</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-[10px] border border-[var(--w-border)] bg-[var(--w-raised)]">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead>
              <tr className="border-b border-[var(--w-border)] text-left text-[12px] text-[var(--w-text-3)]">
                <th className="px-3 py-2 font-medium">{wt('code.branch')}</th>
                <th className="px-3 py-2 font-medium">{wt('code.lastCommit')}</th>
                <th className="px-3 py-2 font-medium">{wt('code.by')}</th>
                <th className="px-3 py-2 font-medium">{wt('code.updated')}</th>
                <th className="px-3 py-2 font-medium">{wt('code.issues')}</th>
                <th className="px-3 py-2 font-medium">{wt('code.pullRequest')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={`${b.provider}:${b.name}`} className="border-b border-[var(--w-border)] last:border-b-0 hover:bg-[var(--w-hover)]">
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <BranchName name={b.name} deleted={b.deleted} onClick={b.deleted ? undefined : () => onSource(b.name)} />
                      {b.deleted && <span className="rounded-full bg-[color-mix(in_srgb,var(--w-red)_12%,transparent)] px-1.5 text-[11px] font-medium text-[var(--w-red-text)]">{wt('code.deleted')}</span>}
                    </div>
                  </td>
                  <td className="max-w-[340px] px-3 py-2.5">
                    {b.lastCommit ? (
                      <div className="flex min-w-0 items-center gap-2">
                        {b.headSha && <Sha sha={b.headSha} onClick={() => onCommit(b.headSha!)} />}
                        <span className="min-w-0 truncate" title={b.lastCommit.title}>{b.lastCommit.title}</span>
                        {b.lastCommit.url && <a href={b.lastCommit.url} target="_blank" rel="noopener noreferrer" aria-label={wt('code.openOnHost')} className="shrink-0 text-[var(--w-text-3)] hover:text-[var(--w-accent-text)]"><ExternalLink size={12} /></a>}
                      </div>
                    ) : <span className="text-[var(--w-text-3)]">—</span>}
                  </td>
                  <td className="max-w-[180px] px-3 py-2.5"><WhoChip who={b.lastAuthor} size={18} muted /></td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[var(--w-text-2)]" title={b.lastPushAt ? wfmt.dateTime(b.lastPushAt) : undefined}>
                    {b.deleted && b.deletedAt ? wt('code.deletedAgo', { t: wfmt.relative(b.deletedAt) }) : b.lastPushAt ? wfmt.relative(b.lastPushAt) : '—'}
                  </td>
                  <td className="px-3 py-2.5"><IssueChips nums={b.issueNumbers} refs={q.data!.issues} projectKey={projectKey} onOpen={onIssue} max={3} /></td>
                  <td className="px-3 py-2.5">
                    {b.pr ? (
                      <button type="button" onClick={onPulls} className="inline-flex items-center gap-1.5 hover:underline" title={b.pr.title}>
                        <PrState state={b.pr.state} compact /> <span className="font-mono text-[12px]">#{b.pr.number}</span>
                      </button>
                    ) : <span className="text-[var(--w-text-3)]">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
