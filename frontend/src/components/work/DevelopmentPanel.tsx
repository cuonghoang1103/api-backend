'use client';

/**
 * Khối "Development" ở cột thuộc tính của thẻ: nhánh / commit / PR đã nhắc
 * mã thẻ (nhận qua webhook GitHub). Chỉ hiện khi dự án đã nối GitHub HOẶC
 * thẻ đã có hoạt động (ngắt kết nối rồi thì dữ liệu cũ vẫn còn).
 */

import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, GitBranch, GitCommitHorizontal, GitPullRequest } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workApi, type DevItem } from '@/lib/work-api';
import { wk } from './hooks';
import { relativeTime, Spinner } from './ui';

const PR_STATE: Record<string, { label: string; cls: string }> = {
  open: { label: 'Open', cls: 'text-[var(--w-green)] border-[color-mix(in_srgb,var(--w-green)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-green)_12%,transparent)]' },
  draft: { label: 'Draft', cls: 'text-[var(--w-text-2)] border-[var(--w-border-strong)] bg-[var(--w-sunken)]' },
  merged: { label: 'Merged', cls: 'text-[var(--w-accent-text)] border-[var(--w-accent-border)] bg-[var(--w-accent-soft)]' },
  closed: { label: 'Closed', cls: 'text-[var(--w-red)] border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] bg-[color-mix(in_srgb,var(--w-red)_10%,transparent)]' },
};

export function PrStateChip({ state }: { state: string | null }) {
  const s = PR_STATE[state ?? ''] ?? PR_STATE.open;
  return <span className={cn('inline-flex h-[18px] shrink-0 items-center rounded-[4px] border px-1.5 text-[10.5px] font-semibold uppercase tracking-[0.02em]', s.cls)}>{s.label}</span>;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function Group({ icon, title, items, render }: { icon: ReactNode; title: string; items: DevItem[]; render: (d: DevItem) => ReactNode }) {
  const [open, setOpen] = useState(false);
  if (!items.length) return null;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 rounded-[5px] px-1.5 py-1 text-left text-[12.5px] hover:bg-[var(--w-hover)]"
      >
        {open ? <ChevronDown size={12} className="text-[var(--w-text-3)]" /> : <ChevronRight size={12} className="text-[var(--w-text-3)]" />}
        <span className="text-[var(--w-text-3)]">{icon}</span>
        <span className="flex-1">{title}</span>
      </button>
      {open && <ul className="mb-1 ml-[18px] space-y-0.5 border-l border-[var(--w-border)] pl-2">{items.map((d) => <li key={d.id}>{render(d)}</li>)}</ul>}
    </div>
  );
}

function ItemLink({ d, children }: { d: DevItem; children: ReactNode }) {
  return (
    <a
      href={d.url}
      target="_blank"
      rel="noopener noreferrer"
      title={d.title}
      className="block rounded-[5px] px-1.5 py-1 hover:bg-[var(--w-hover)]"
    >
      {children}
    </a>
  );
}

function Meta({ d }: { d: DevItem }) {
  return (
    <span className="block truncate text-[11px] text-[var(--w-text-3)]">
      {[d.author, d.repo, relativeTime(d.updatedAt)].filter(Boolean).join(' · ')}
    </span>
  );
}

export default function DevelopmentPanel({ pid, num, issueKey }: { pid: number; num: number; issueKey: string }) {
  // Kết nối dùng chung cache với tab GitHub; đọc lười — không chặn phần còn lại của thẻ.
  const conn = useQuery({ queryKey: wk.github(pid), queryFn: () => workApi.github(pid), staleTime: 5 * 60_000 });
  const dev = useQuery({ queryKey: wk.devActivity(pid, num), queryFn: () => workApi.devActivity(pid, num), enabled: !conn.isLoading, staleTime: 30_000 });

  const d = dev.data;
  const total = d ? d.branches.length + d.commits.length + d.pullRequests.length : 0;
  if (!conn.data?.connected && !total) return null;

  const counts = d
    ? [
        d.branches.length && plural(d.branches.length, 'branch', 'branches'),
        d.commits.length && plural(d.commits.length, 'commit', 'commits'),
        d.pullRequests.length && plural(d.pullRequests.length, 'pull request', 'pull requests'),
      ].filter(Boolean).join(' · ')
    : '';

  return (
    <div className="mt-4 border-t border-[var(--w-border)] pt-3">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[12px] font-medium text-[var(--w-text-2)]">Development</span>
        {dev.isFetching && <Spinner size={10} />}
      </div>
      {dev.isLoading ? null : dev.isError ? (
        <p className="text-[12px] text-[var(--w-text-3)]">Could not load development activity.</p>
      ) : !total ? (
        <p className="text-[12px] leading-relaxed text-[var(--w-text-3)]">
          Include <span className="font-mono text-[var(--w-text-2)]">{issueKey}</span> in a branch, commit or PR to link it here.
        </p>
      ) : (
        <>
          <p className="mb-1 px-1.5 text-[12px] text-[var(--w-text-2)]">{counts}</p>
          <Group
            icon={<GitPullRequest size={13} />}
            title={plural(d!.pullRequests.length, 'pull request', 'pull requests')}
            items={d!.pullRequests}
            render={(p) => (
              <ItemLink d={p}>
                <span className="flex items-center gap-1.5">
                  <span className="min-w-0 flex-1 truncate text-[12.5px]">{p.title}</span>
                  <PrStateChip state={p.state} />
                </span>
                <Meta d={p} />
              </ItemLink>
            )}
          />
          <Group
            icon={<GitBranch size={13} />}
            title={plural(d!.branches.length, 'branch', 'branches')}
            items={d!.branches}
            render={(b) => (
              <ItemLink d={b}>
                <span className="block truncate font-mono text-[12px]">{b.title}</span>
                <Meta d={b} />
              </ItemLink>
            )}
          />
          <Group
            icon={<GitCommitHorizontal size={13} />}
            title={plural(d!.commits.length, 'commit', 'commits')}
            items={d!.commits}
            render={(c) => (
              <ItemLink d={c}>
                <span className="flex items-center gap-1.5">
                  <span className="shrink-0 font-mono text-[11px] text-[var(--w-accent-text)]">{c.externalId.slice(0, 7)}</span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px]">{c.title}</span>
                </span>
                <Meta d={c} />
              </ItemLink>
            )}
          />
        </>
      )}
    </div>
  );
}
