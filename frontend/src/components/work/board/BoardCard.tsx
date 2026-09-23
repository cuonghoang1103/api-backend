'use client';

/**
 * Thẻ trên board. Thứ bậc: tiêu đề (14px) → nhãn → hàng dưới (loại + mã,
 * hạn, điểm, ưu tiên, người). Việc con lồng trong thẻ cha thành một hàng gập
 * được "3 sub-tasks" với thanh tiến độ nhỏ.
 */

import { useState } from 'react';
import { AlertTriangle, CalendarClock, ChevronDown, ChevronRight, MessageSquare, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IssueCard } from '@/lib/work-api';
import type { Lookups } from '../hooks';
import { IssueTypeIcon, LabelChip, PriorityIcon, UserAvatar } from '../ui';
import type { SubtaskInfo } from './grouping';

export function isOverdue(i: Pick<IssueCard, 'dueDate' | 'statusId'>, lk: Lookups) {
  if (!i.dueDate || lk.statuses.get(i.statusId)?.category === 'DONE') return false;
  return new Date(`${i.dueDate.slice(0, 10)}T23:59:59`).getTime() < Date.now();
}

const fmtDue = (d: string) => new Date(`${d.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

/** Ưu tiên kèm chú thích khi rê chuột (PriorityIcon của ui.tsx đã tự có title "High priority"). */
export function PriorityWithTip({ priority, size = 13 }: { priority: number; size?: number }) {
  return <PriorityIcon priority={priority} size={size} />;
}

export function PointsBadge({ points, unit = 'pts' }: { points: number | null; unit?: string }) {
  if (points === null || points === undefined) return null;
  return (
    <span
      className="inline-flex h-[18px] shrink-0 items-center rounded-full bg-[var(--w-sunken)] px-1.5 text-[11px] font-medium tabular text-[var(--w-text-2)]"
      title={`Estimate: ${points} ${unit === 'pts' ? (points === 1 ? 'story point' : 'story points') : unit}`}
    >
      {points} {unit === 'pts' && points === 1 ? 'pt' : unit}
    </span>
  );
}

export function DueChip({ issue, lk }: { issue: Pick<IssueCard, 'dueDate' | 'statusId'>; lk: Lookups }) {
  if (!issue.dueDate) return null;
  const overdue = isOverdue(issue, lk);
  return (
    <span
      title={overdue ? `Overdue — was due ${fmtDue(issue.dueDate)}` : `Due ${fmtDue(issue.dueDate)}`}
      className={cn(
        'inline-flex h-[18px] shrink-0 items-center gap-0.5 rounded-[4px] px-1 text-[11px] tabular',
        overdue
          ? 'bg-[color-mix(in_srgb,var(--w-red)_14%,transparent)] font-medium text-[var(--w-red)]'
          : 'bg-[var(--w-sunken)] text-[var(--w-text-2)]',
      )}
    >
      <CalendarClock size={11} />
      {fmtDue(issue.dueDate)}
    </span>
  );
}

function MiniProgress({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <span className="flex items-center gap-1.5" title={`${done} of ${total} sub-tasks done`}>
      <span className="h-1 w-12 overflow-hidden rounded-full bg-[var(--w-sunken)]">
        <span className="block h-full rounded-full bg-[var(--w-green)]" style={{ width: `${pct}%` }} />
      </span>
      <span className="tabular">{done}/{total}</span>
    </span>
  );
}

export function CardBody({ issue, lk, dragging, subtasks, inDoneColumn, onOpen, showParent }: {
  issue: IssueCard;
  lk: Lookups;
  dragging?: boolean;
  /** Việc con lồng trong thẻ (null = không lồng). */
  subtasks?: SubtaskInfo | null;
  /** Thẻ đang nằm ở cột Done — dùng để cảnh báo việc con còn mở. */
  inDoneColumn?: boolean;
  onOpen?: (n: number) => void;
  /** Hiện mã thẻ cha (việc con đứng riêng). */
  showParent?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const allLabels = issue.labelIds.map((id) => lk.labels.get(id)).filter((l): l is NonNullable<typeof l> => !!l);
  const labels = allLabels.slice(0, 3);
  const done = lk.statuses.get(issue.statusId)?.category === 'DONE';
  const openKids = subtasks?.open ?? 0;
  const warn = !!inDoneColumn && openKids > 0;
  const assignee = issue.assigneeId ? lk.members.get(issue.assigneeId) : null;
  return (
    <div
      className={cn(
        'rounded-[7px] border border-[var(--w-border)] bg-[var(--w-panel)] px-3 py-2.5 transition-[border-color,box-shadow]',
        'hover:border-[var(--w-border-strong)]',
        warn && 'border-[color-mix(in_srgb,var(--w-orange)_55%,transparent)]',
        dragging && 'rotate-[1.5deg] border-[var(--w-accent-border)] shadow-[var(--w-shadow-pop)]',
      )}
    >
      {warn && (
        <div
          className="mb-1.5 inline-flex items-center gap-1 rounded-[4px] bg-[color-mix(in_srgb,var(--w-orange)_14%,transparent)] px-1.5 py-px text-[11px] font-medium text-[var(--w-orange)]"
          title="This issue is in a Done column but some of its sub-tasks are still open"
        >
          <AlertTriangle size={11} /> {openKids} open {openKids === 1 ? 'sub-task' : 'sub-tasks'}
        </div>
      )}
      <p className={cn('mb-2 line-clamp-3 text-[14px] leading-snug text-[var(--w-text)]', done && 'text-[var(--w-text-3)] line-through decoration-[var(--w-text-3)]')}>
        {issue.title}
      </p>
      {labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {labels.map((l) => <LabelChip key={l.id} label={l} />)}
          {allLabels.length > labels.length && (
            <span className="inline-flex h-[20px] items-center px-1 text-[11px] text-[var(--w-text-3)]" title={allLabels.slice(3).map((l) => l.name).join(', ')}>
              +{allLabels.length - labels.length}
            </span>
          )}
        </div>
      )}
      <div className="flex items-center gap-1.5 text-[11px] text-[var(--w-text-3)]">
        <IssueTypeIcon type={lk.types.get(issue.typeId)} size={12} />
        <span className={cn('shrink-0 font-mono text-[var(--w-text-2)]', done && 'line-through')}>{lk.issueKey(issue.number)}</span>
        {showParent && issue.parentNumber && (
          <span className="truncate font-mono" title="Parent issue">↑ {lk.issueKey(issue.parentNumber)}</span>
        )}
        {issue.commentCount > 0 && <span className="flex shrink-0 items-center gap-0.5" title={`${issue.commentCount} comments`}><MessageSquare size={11} />{issue.commentCount}</span>}
        {issue.attachmentCount > 0 && <span className="flex shrink-0 items-center gap-0.5" title={`${issue.attachmentCount} attachments`}><Paperclip size={11} />{issue.attachmentCount}</span>}
        <span className="ml-auto flex min-w-0 items-center gap-1.5">
          <DueChip issue={issue} lk={lk} />
          <PointsBadge points={issue.storyPoints} />
          <PriorityWithTip priority={issue.priority} />
          <UserAvatar user={assignee} size={20} />
        </span>
      </div>

      {subtasks && subtasks.total > 0 && (
        <div className="-mx-3 -mb-2.5 mt-2 border-t border-[var(--w-border)]">
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
            onKeyDown={(e) => e.stopPropagation()}
            aria-expanded={expanded}
            className="flex h-7 w-full items-center gap-1.5 rounded-b-[7px] px-3 text-[11.5px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]"
          >
            {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            <span>{subtasks.total} {subtasks.total === 1 ? 'sub-task' : 'sub-tasks'}</span>
            <span className="ml-auto text-[var(--w-text-3)]"><MiniProgress done={subtasks.done} total={subtasks.total} /></span>
          </button>
          {expanded && (
            <div className="border-t border-[var(--w-border)] pb-1">
              {subtasks.kids.map((k) => {
                const st = lk.statuses.get(k.statusId);
                return (
                  <button
                    key={k.id}
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    onClick={(e) => { e.stopPropagation(); onOpen?.(k.number); }}
                    className="flex h-7 w-full items-center gap-1.5 px-3 text-left text-[12px] hover:bg-[var(--w-hover)]"
                  >
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: st?.color ?? 'var(--w-text-3)' }} title={st?.name} />
                    <span className="shrink-0 font-mono text-[10.5px] text-[var(--w-text-3)]">{lk.issueKey(k.number)}</span>
                    <span className={cn('min-w-0 flex-1 truncate', st?.category === 'DONE' && 'text-[var(--w-text-3)] line-through')}>{k.title}</span>
                    <span className="shrink-0 text-[10.5px] text-[var(--w-text-3)]">{st?.name}</span>
                    <UserAvatar user={k.assigneeId ? lk.members.get(k.assigneeId) : null} size={16} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
