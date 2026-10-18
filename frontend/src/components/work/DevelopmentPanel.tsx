'use client';

/**
 * Khối "Development" ở cột thuộc tính của thẻ: PR / nhánh / commit đã nhắc mã thẻ (webhook GitHub · GitLab).
 * Bản 18/10/2026 (trang Code): commit NHÓM theo PR / nhánh (PR có nhánh nguồn ⇒ commit của nhánh đó nằm dưới PR),
 * bấm commit ⇒ xem diff ngay trong trang Code; link "Xem trong Code". Chỉ hiện khi dự án đã nối repo HOẶC thẻ đã có
 * hoạt động (ngắt kết nối rồi thì dữ liệu cũ vẫn còn). Khách (403) ⇒ ẩn hẳn.
 */

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, ChevronDown, ChevronRight, GitBranch, GitCommitHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { codeApi, codeKeys, type IssueDevGroup } from './code/codeApi';
import { PrState, WhoChip } from './code/parts';
import { relativeTime, Spinner } from './ui';
import { wt } from '@/components/work/i18n';

/** Giữ cho nơi khác còn dùng (chip trạng thái PR cỡ nhỏ). */
export function PrStateChip({ state }: { state: string | null }) {
  return <PrState state={state} />;
}

function GroupBlock({ g, codeHref, defaultOpen }: { g: IssueDevGroup; codeHref: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const head = g.kind === 'PR' ? (
    <>
      <PrState state={g.state} compact />
      <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium" title={g.title}>{g.number ? <span className="mr-1 font-mono text-[11.5px] text-[var(--w-text-3)]">#{g.number}</span> : null}{g.title}</span>
    </>
  ) : g.kind === 'BRANCH' ? (
    <>
      <GitBranch size={13} className="shrink-0 text-[var(--w-blue)]" aria-hidden="true" />
      <span className={cn('min-w-0 flex-1 truncate font-mono text-[12px]', g.deleted && 'line-through text-[var(--w-text-3)]')} title={g.title}>{g.title}</span>
    </>
  ) : (
    <>
      <GitCommitHorizontal size={13} className="shrink-0 text-[var(--w-text-3)]" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--w-text-2)]">{wt('code.otherCommits')}</span>
    </>
  );
  return (
    <li className="rounded-[8px] border border-[var(--w-border)] bg-[var(--w-raised)]">
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex min-w-0 flex-1 items-center gap-1.5 text-left" disabled={!g.commits.length}>
          {g.commits.length ? (open ? <ChevronDown size={12} className="shrink-0 text-[var(--w-text-3)]" /> : <ChevronRight size={12} className="shrink-0 text-[var(--w-text-3)]" />) : <span className="w-3 shrink-0" />}
          {head}
        </button>
        {g.commits.length > 0 && <span className="shrink-0 text-[11px] tabular-nums text-[var(--w-text-3)]">{g.commits.length}</span>}
        {g.url && (
          <a href={g.url} target="_blank" rel="noopener noreferrer" aria-label={wt('code.openOnHost')} className="shrink-0 text-[var(--w-text-3)] hover:text-[var(--w-accent-text)]">
            <ArrowUpRight size={13} />
          </a>
        )}
      </div>
      {g.kind === 'PR' && g.ref && !open && (
        <div className="-mt-1 truncate px-2 pb-1.5 pl-[26px] font-mono text-[11px] text-[var(--w-text-3)]" title={g.ref}>{g.ref}</div>
      )}
      {open && g.commits.length > 0 && (
        <ul className="border-t border-[var(--w-border)] py-1">
          {g.commits.slice(0, 20).map((c) => (
            <li key={c.sha}>
              <Link href={`${codeHref}?tab=source&commit=${c.sha}`} className="flex items-center gap-1.5 px-2 py-1 hover:bg-[var(--w-hover)]" title={c.title}>
                <span className="shrink-0 font-mono text-[11px] text-[var(--w-accent-text)]">{c.sha.slice(0, 7)}</span>
                <span className="min-w-0 flex-1 truncate text-[12px]">{c.title}</span>
                <WhoChip who={c.author} size={14} className="max-w-[70px] text-[11px] [&>span:last-child]:hidden" />
                {c.at && <span className="shrink-0 text-[10.5px] text-[var(--w-text-3)]">{relativeTime(c.at)}</span>}
              </Link>
            </li>
          ))}
          {g.commits.length > 20 && <li className="px-2 py-1 text-[11px] text-[var(--w-text-3)]">+{g.commits.length - 20}</li>}
        </ul>
      )}
    </li>
  );
}

export default function DevelopmentPanel({ pid, num, issueKey }: { pid: number; num: number; issueKey: string }) {
  const dev = useQuery({ queryKey: codeKeys.issueDev(pid, num), queryFn: () => codeApi.issueDev(pid, num), staleTime: 30_000, retry: false });
  const d = dev.data;
  if (dev.isError || !d) return null;
  const total = d.counts.prs + d.counts.branches + d.counts.commits;
  if (!d.connected && !total) return null;

  const counts = [
    d.counts.prs && wt('dev.nPrs', { count: d.counts.prs }),
    d.counts.branches && wt('dev.nBranches', { count: d.counts.branches }),
    d.counts.commits && wt('dev.nCommits', { count: d.counts.commits }),
  ].filter(Boolean).join(' · ');

  return (
    <div className="mt-4 border-t border-[var(--w-border)] pt-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[12px] font-medium text-[var(--w-text-2)]">{wt('dev.development')}</span>
        {dev.isFetching && <Spinner size={10} />}
        {d.connected && (
          <Link href={d.codeHref} className="ml-auto inline-flex items-center gap-0.5 text-[11.5px] font-medium text-[var(--w-accent-text)] hover:underline">
            {wt('code.viewInCode')} <ArrowUpRight size={11} />
          </Link>
        )}
      </div>
      {!total ? (
        <p className="text-[12px] leading-relaxed text-[var(--w-text-3)]">{wt('dev.includeKey', { k: issueKey })}</p>
      ) : (
        <>
          <p className="mb-1.5 text-[12px] text-[var(--w-text-2)]">{counts}</p>
          <ul className="space-y-1.5">
            {d.groups.map((g, i) => <GroupBlock key={g.key} g={g} codeHref={d.codeHref} defaultOpen={i === 0} />)}
          </ul>
        </>
      )}
    </div>
  );
}
