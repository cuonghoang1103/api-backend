'use client';

/**
 * Bảng kết quả tìm thẻ mọi dự án. Từ md: bảng lưới có đầu cột bấm để sắp
 * xếp; điện thoại: mỗi dòng là một thẻ hai tầng. Dòng là <Link> nên ⌘/Ctrl+
 * click mở tab mới như link thường.
 */

import Link from 'next/link';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, type GlobalIssueHit } from '@/lib/work-api';
import { IssueTypeIcon, PriorityIcon, StatusBadge, UserAvatar, avatarColor, relativeTime } from '../ui';
import type { SortCol, SortState } from './query';

const GRID = 'md:grid md:grid-cols-[112px_minmax(120px,160px)_minmax(0,1fr)_minmax(110px,150px)_84px_minmax(120px,170px)_88px] md:items-center md:gap-x-3';

const COLS: Array<{ id: SortCol; label: string; align?: 'right' }> = [
  { id: 'key', label: 'Key' },
  { id: 'project', label: 'Project' },
  { id: 'title', label: 'Title' },
  { id: 'status', label: 'Status' },
  { id: 'priority', label: 'Priority' },
  { id: 'assignee', label: 'Assignee' },
  { id: 'updated', label: 'Updated', align: 'right' },
];

export function ProjectChip({ k, name, className }: { k: string; name?: string; className?: string }) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-1.5', className)} title={name ? `${name} (${k})` : k}>
      <span
        aria-hidden="true"
        style={{ background: avatarColor(k) }}
        className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[4px] text-[9.5px] font-bold leading-none text-white"
      >
        {k.slice(0, 1)}
      </span>
      {name && <span className="min-w-0 truncate">{name}</span>}
    </span>
  );
}

export function ResultsHeader({ sort, onSort }: { sort: SortState | null; onSort: (c: SortCol) => void }) {
  return (
    <div
      role="row"
      className={cn(GRID, 'sticky top-0 z-[1] hidden h-8 border-b border-[var(--w-border)] bg-[var(--w-panel)] px-4 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)] md:grid')}
    >
      {COLS.map((c) => {
        const active = sort?.col === c.id;
        return (
          <button
            key={c.id}
            type="button"
            role="columnheader"
            aria-sort={active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : 'none'}
            onClick={() => onSort(c.id)}
            title={`Sort by ${c.label.toLowerCase()}`}
            className={cn(
              'flex h-full min-w-0 items-center gap-1 uppercase tracking-wide transition-colors hover:text-[var(--w-text)]',
              c.align === 'right' && 'justify-end',
              active && 'text-[var(--w-text)]',
            )}
          >
            <span className="truncate">{c.label}</span>
            {active && (sort!.dir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
          </button>
        );
      })}
    </div>
  );
}

export function GroupHeading({ k, name, workspace, count }: { k: string; name: string; workspace: string; count: number }) {
  return (
    <div className="sticky top-0 z-[1] flex h-9 items-center gap-2 border-b border-[var(--w-border)] bg-[var(--w-sunken)] px-4 text-[12.5px] md:top-8">
      <ProjectChip k={k} />
      <span className="min-w-0 truncate font-semibold text-[var(--w-text)]">{name}</span>
      <span className="font-mono text-[11.5px] text-[var(--w-text-3)]">{k}</span>
      <span className="hidden truncate text-[var(--w-text-3)] sm:inline">· {workspace}</span>
      <span className="ml-auto rounded-full bg-[var(--w-panel)] px-2 text-[11.5px] leading-[20px] tabular-nums text-[var(--w-text-2)]">{count}</span>
    </div>
  );
}

export function ResultRow({ it, index, highlighted, onHover, showProject = true }: {
  it: GlobalIssueHit;
  index: number;
  highlighted: boolean;
  onHover: () => void;
  showProject?: boolean;
}) {
  const done = it.status.category === 'DONE';
  return (
    <Link
      href={it.url}
      role="row"
      data-row={index}
      aria-selected={highlighted}
      onMouseMove={onHover}
      className={cn(
        GRID,
        'block border-b border-[var(--w-border)] px-4 py-2.5 text-[13px] outline-none transition-colors md:h-10 md:py-0',
        highlighted ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]',
      )}
    >
      {/* Từ md: các ô của lưới. */}
      <span role="cell" className="hidden min-w-0 items-center gap-2 md:flex">
        <IssueTypeIcon type={it.type} size={13} />
        <span className={cn('truncate font-mono text-[12px] text-[var(--w-text-2)]', done && 'line-through decoration-[var(--w-text-3)]')}>{it.key}</span>
      </span>
      <span role="cell" className="hidden min-w-0 items-center text-[12.5px] text-[var(--w-text-2)] md:flex">
        {showProject ? <ProjectChip k={it.project.key} name={it.project.name} /> : <span className="text-[var(--w-text-3)]">—</span>}
      </span>
      <span role="cell" className="hidden min-w-0 items-center gap-2 md:flex">
        <span className="truncate font-medium text-[var(--w-text)]">{it.title}</span>
        {it.match === 'description' && <span className="shrink-0 rounded-[4px] bg-[var(--w-sunken)] px-1.5 text-[11px] leading-[18px] text-[var(--w-text-3)]">in description</span>}
      </span>
      <span role="cell" className="hidden min-w-0 items-center md:flex"><StatusBadge status={it.status} /></span>
      <span role="cell" className="hidden min-w-0 items-center md:flex"><PriorityIcon priority={it.priority} size={14} showLabel className="[&>span]:!text-[12.5px] [&>span]:!text-[var(--w-text-2)]" /></span>
      <span role="cell" className="hidden min-w-0 items-center gap-2 md:flex">
        <UserAvatar user={it.assignee} size={20} />
        <span className={cn('truncate text-[12.5px]', it.assignee ? 'text-[var(--w-text-2)]' : 'text-[var(--w-text-3)]')}>{it.assignee ? userName(it.assignee) : 'Unassigned'}</span>
      </span>
      <span role="cell" className="hidden items-center justify-end whitespace-nowrap text-[12px] tabular-nums text-[var(--w-text-3)] md:flex" title={new Date(it.updatedAt).toLocaleString()}>
        {relativeTime(it.updatedAt)}
      </span>

      {/* Điện thoại: thẻ hai tầng. */}
      <span className="flex min-w-0 flex-col gap-1.5 md:hidden">
        <span className="flex min-w-0 items-center gap-2">
          <IssueTypeIcon type={it.type} size={13} />
          <span className="shrink-0 font-mono text-[12px] text-[var(--w-accent-text)]">{it.key}</span>
          {showProject && <ProjectChip k={it.project.key} name={it.project.name} className="text-[12px] text-[var(--w-text-3)]" />}
          <span className="ml-auto shrink-0 text-[12px] tabular-nums text-[var(--w-text-3)]">{relativeTime(it.updatedAt)}</span>
        </span>
        <span className="line-clamp-2 text-[14px] font-medium leading-snug text-[var(--w-text)]">{it.title}</span>
        <span className="flex min-w-0 items-center gap-2.5">
          <StatusBadge status={it.status} className="max-w-[55%]" />
          <PriorityIcon priority={it.priority} size={14} />
          <span className="ml-auto flex min-w-0 items-center gap-1.5 text-[12px] text-[var(--w-text-2)]">
            <span className="truncate">{it.assignee ? userName(it.assignee) : 'Unassigned'}</span>
            <UserAvatar user={it.assignee} size={20} />
          </span>
        </span>
      </span>
    </Link>
  );
}

export function SkeletonRows({ n = 10 }: { n?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading results">
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="flex h-14 items-center gap-3 border-b border-[var(--w-border)] px-4 md:h-10">
          <span className="h-4 w-4 shrink-0 rounded-[4px] bg-[var(--w-sunken)]" />
          <span className="h-3 w-14 shrink-0 rounded bg-[var(--w-sunken)]" />
          <span className="hidden h-3 w-24 shrink-0 rounded bg-[var(--w-sunken)] md:block" />
          <span className="h-3 rounded bg-[var(--w-sunken)]" style={{ width: `${28 + ((i * 37) % 38)}%` }} />
          <span className="ml-auto hidden h-5 w-20 rounded-full bg-[var(--w-sunken)] md:block" />
          <span className="hidden h-5 w-5 rounded-full bg-[var(--w-sunken)] md:block" />
        </div>
      ))}
    </div>
  );
}
