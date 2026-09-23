'use client';

/**
 * "My work" — mọi việc đang mở giao cho tôi ở MỌI dự án, chia nhóm theo hạn:
 * quá hạn · hôm nay · sắp tới · sau này · không có hạn. Nhóm rỗng thì ẩn.
 */

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { workApi, workError, type MyWorkItem } from '@/lib/work-api';
import { EmptyState, formatDate, IssueTypeIcon, PriorityIcon, Spinner, StatusBadge } from '@/components/work/ui';
import { cn } from '@/lib/utils';

const GROUPS: Array<{ id: MyWorkItem['bucket']; label: string; tone?: string }> = [
  { id: 'overdue', label: 'Overdue', tone: 'text-[var(--w-red)]' },
  { id: 'today', label: 'Due today', tone: 'text-[var(--w-orange)]' },
  { id: 'soon', label: 'Due soon' },
  { id: 'later', label: 'Later' },
  { id: 'none', label: 'No due date' },
];

function Counter({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="min-w-0 rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2.5">
      <div className="truncate text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">{label}</div>
      <div className={cn('mt-1 text-[18px] font-semibold tabular-nums', value > 0 && tone)}>{value}</div>
    </div>
  );
}

export default function MyWork() {
  const q = useQuery({ queryKey: ['work', 'my-work'], queryFn: workApi.myWork, staleTime: 30_000 });

  if (q.isLoading) return <div className="flex justify-center py-16"><Spinner size={20} /></div>;
  if (q.error || !q.data) {
    return <EmptyState title="Couldn't load your work" body={q.error ? workError(q.error) : undefined} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>Try again</button>} />;
  }
  const { items, counts } = q.data;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Counter label="Overdue" value={counts.overdue} tone="text-[var(--w-red)]" />
        <Counter label="Due today" value={counts.dueToday} tone="text-[var(--w-orange)]" />
        <Counter label="In progress" value={counts.inProgress} tone="text-[var(--w-accent-text)]" />
        <Counter label="Open" value={counts.total} />
      </div>

      {!items.length ? (
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <CheckCircle2 size={28} className="text-[var(--w-green)]" />
          <div className="mt-3 text-[15px] font-semibold">You&apos;re all caught up</div>
          <p className="mt-1.5 max-w-[420px] text-[13px] leading-relaxed text-[var(--w-text-2)]">
            Nothing open is assigned to you across your projects. Issues assigned to you will show up here, grouped by due date.
          </p>
        </div>
      ) : (
        GROUPS.map((g) => {
          const rows = items.filter((i) => i.bucket === g.id);
          if (!rows.length) return null;
          return (
            <section key={g.id} aria-label={g.label}>
              <h2 className={cn('mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-[var(--w-text-2)]', g.tone)}>
                {g.label}
                <span className="font-normal tabular-nums text-[var(--w-text-3)]">{rows.length}</span>
              </h2>
              <ul className="overflow-hidden rounded-[var(--w-radius-lg)] border border-[var(--w-border)] bg-[var(--w-panel)]">
                {rows.map((it) => (
                  <li key={it.key} className="border-b border-[var(--w-border)] last:border-b-0">
                    <Link href={it.url} className="flex min-w-0 items-start gap-3 px-3 py-2.5 hover:bg-[var(--w-hover)] md:items-center">
                      <span className="mt-0.5 md:mt-0"><IssueTypeIcon type={it.type} /></span>
                      <div className="min-w-0 flex-1 md:flex md:items-center md:gap-3">
                        <div className="flex min-w-0 items-center gap-2 md:flex-1">
                          <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{it.key}</span>
                          <span className="truncate text-[13px] font-medium">{it.title}</span>
                        </div>
                        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[var(--w-text-2)] md:mt-0 md:shrink-0 md:flex-nowrap">
                          <span className="max-w-[160px] truncate" title={`${it.workspace.name} / ${it.project.name}`}>{it.project.name}</span>
                          <PriorityIcon priority={it.priority} size={14} />
                          <StatusBadge status={it.status} className="max-w-[140px] truncate" />
                          {it.dueDate && (
                            <span className={cn('whitespace-nowrap tabular-nums', it.bucket === 'overdue' && 'font-medium text-[var(--w-red)]', it.bucket === 'today' && 'font-medium text-[var(--w-orange)]')}>
                              {it.bucket === 'today' ? 'Today' : formatDate(it.dueDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
