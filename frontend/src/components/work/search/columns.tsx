'use client';

/**
 * Cột của danh sách Issues (kiểu "issue navigator" của Jira): định nghĩa ô,
 * cách sắp xếp, trường ORDER BY tương ứng trong JQL, và menu "Columns" để
 * ẩn/hiện (lưu localStorage theo dự án).
 */

import { useRef, type ReactNode } from 'react';
import { Check, Columns3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { userName, type IssueCard, type ProjectConfig, type StatusCategory } from '@/lib/work-api';
import type { Lookups } from '../hooks';
import { formatDate, IssueTypeIcon, LabelChip, Popover, relativeTime, StatusBadge, UserAvatar, useToggle } from '../ui';
import { PriorityWithTip } from '../board/BoardCard';

export type ColId =
  | 'key' | 'type' | 'title' | 'status' | 'priority' | 'assignee' | 'reporter' | 'sprint'
  | 'points' | 'due' | 'created' | 'updated' | 'labels' | 'fixVersion';

export interface ListCtx {
  lk: Lookups;
  config: ProjectConfig;
  today: string;
  versionName: (id: number | null) => string;
  parentNum: (i: IssueCard) => number | undefined;
}

interface ColDef {
  label: string;
  /** Rãnh lưới (grid track). */
  track: string;
  /** Độ rộng tối thiểu để tính cuộn ngang. */
  min: number;
  /** Trường ORDER BY của JQL (backend ORDERABLE); không có = chỉ sắp xếp trên trang. */
  jql?: string;
  align?: 'right';
  /** Còn hiện trên điện thoại (< md). */
  mobile?: boolean;
  /** Không cho ẩn. */
  fixed?: boolean;
  cell: (i: IssueCard, c: ListCtx) => ReactNode;
  cmp: (a: IssueCard, b: IssueCard, c: ListCtx) => number;
}

const CAT: Record<StatusCategory, number> = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };
const nullsLast = (a: number | string | null | undefined, b: number | string | null | undefined) => {
  if (a === null || a === undefined || a === '') return b === null || b === undefined || b === '' ? 0 : 1;
  if (b === null || b === undefined || b === '') return -1;
  return a < b ? -1 : a > b ? 1 : 0;
};
const personName = (id: number | null, lk: Lookups) => (id ? userName(lk.members.get(id)) : '');

export const COLUMNS: Record<ColId, ColDef> = {
  type: {
    label: 'Type', track: '44px', min: 44, mobile: true,
    cell: (i, c) => <IssueTypeIcon type={c.lk.types.get(i.typeId)} size={14} />,
    cmp: (a, b, c) => (c.lk.types.get(a.typeId)?.name ?? '').localeCompare(c.lk.types.get(b.typeId)?.name ?? ''),
  },
  key: {
    label: 'Key', track: '84px', min: 84, jql: 'key', mobile: true,
    cell: (i, c) => <span className="truncate font-mono text-[11.5px] text-[var(--w-text-3)]">{c.lk.issueKey(i.number)}</span>,
    cmp: (a, b) => a.number - b.number,
  },
  title: {
    label: 'Title', track: 'minmax(220px,1fr)', min: 240, jql: 'summary', mobile: true, fixed: true,
    cell: (i, c) => {
      const pn = c.parentNum(i);
      const done = c.lk.statuses.get(i.statusId)?.category === 'DONE';
      return (
        <span className="flex min-w-0 items-center gap-2">
          <span className={cn('truncate', done && 'text-[var(--w-text-2)]')}>{i.title}</span>
          {pn !== undefined && <span className="hidden shrink-0 font-mono text-[10.5px] text-[var(--w-text-3)] sm:inline" title="Parent">↑ {c.lk.issueKey(pn)}</span>}
        </span>
      );
    },
    cmp: (a, b) => a.title.localeCompare(b.title),
  },
  status: {
    label: 'Status', track: '140px', min: 120, jql: 'status', mobile: true,
    cell: (i, c) => <span className="min-w-0"><StatusBadge status={c.lk.statuses.get(i.statusId)} /></span>,
    cmp: (a, b, c) => {
      const sa = c.lk.statuses.get(a.statusId);
      const sb = c.lk.statuses.get(b.statusId);
      return (sa ? CAT[sa.category] * 1000 + sa.position : 9999) - (sb ? CAT[sb.category] * 1000 + sb.position : 9999);
    },
  },
  priority: {
    label: 'Priority', track: '64px', min: 64, jql: 'priority',
    cell: (i) => <PriorityWithTip priority={i.priority} size={15} />,
    cmp: (a, b) => a.priority - b.priority,
  },
  assignee: {
    label: 'Assignee', track: '150px', min: 130, jql: 'assignee', mobile: true,
    cell: (i, c) => {
      const u = i.assigneeId ? c.lk.members.get(i.assigneeId) ?? null : null;
      return (
        <span className="flex min-w-0 items-center gap-1.5">
          <UserAvatar user={u} size={20} />
          <span className={cn('hidden truncate text-[12.5px] md:inline', !u && 'text-[var(--w-text-3)]')}>{u ? userName(u) : 'Unassigned'}</span>
        </span>
      );
    },
    cmp: (a, b, c) => nullsLast(personName(a.assigneeId, c.lk).toLowerCase(), personName(b.assigneeId, c.lk).toLowerCase()),
  },
  reporter: {
    label: 'Reporter', track: '150px', min: 130,
    cell: (i, c) => {
      const u = i.reporterId ? c.lk.members.get(i.reporterId) ?? null : null;
      return (
        <span className="flex min-w-0 items-center gap-1.5">
          <UserAvatar user={u} size={20} />
          <span className="truncate text-[12.5px]">{u ? userName(u) : '—'}</span>
        </span>
      );
    },
    cmp: (a, b, c) => nullsLast(personName(a.reporterId, c.lk).toLowerCase(), personName(b.reporterId, c.lk).toLowerCase()),
  },
  sprint: {
    label: 'Sprint', track: '120px', min: 110,
    cell: (i, c) => {
      if (!i.sprintId) return <span className="text-[12px] text-[var(--w-text-3)]">Backlog</span>;
      const s = c.config.sprints.find((x) => x.id === i.sprintId);
      return <span className="truncate text-[12.5px]" title={s?.state === 'ACTIVE' ? 'Active sprint' : undefined}>{s ? s.name : 'Closed sprint'}{s?.state === 'ACTIVE' && ' •'}</span>;
    },
    cmp: (a, b, c) => nullsLast(
      a.sprintId ? c.config.sprints.find((s) => s.id === a.sprintId)?.name ?? '~' : null,
      b.sprintId ? c.config.sprints.find((s) => s.id === b.sprintId)?.name ?? '~' : null,
    ),
  },
  points: {
    label: 'Points', track: '64px', min: 64, jql: 'points', align: 'right',
    cell: (i) => <span className="tabular text-[12px] text-[var(--w-text-2)]">{i.storyPoints ?? ''}</span>,
    cmp: (a, b) => nullsLast(a.storyPoints, b.storyPoints),
  },
  due: {
    label: 'Due', track: '104px', min: 100, jql: 'due',
    cell: (i, c) => {
      const due = i.dueDate?.slice(0, 10);
      const overdue = !!due && due < c.today && c.lk.statuses.get(i.statusId)?.category !== 'DONE';
      return (
        <span className={cn('tabular truncate text-[12px]', overdue ? 'font-medium text-[var(--w-red)]' : 'text-[var(--w-text-2)]')} title={overdue ? 'Overdue' : undefined}>
          {due ? formatDate(due) : ''}
        </span>
      );
    },
    cmp: (a, b) => nullsLast(a.dueDate?.slice(0, 10), b.dueDate?.slice(0, 10)),
  },
  created: {
    label: 'Created', track: '96px', min: 90, jql: 'created', align: 'right',
    cell: (i) => <span className="tabular truncate text-[12px] text-[var(--w-text-3)]" title={new Date(i.createdAt).toLocaleString('en-US')}>{relativeTime(i.createdAt)}</span>,
    cmp: (a, b) => a.createdAt.localeCompare(b.createdAt),
  },
  updated: {
    label: 'Updated', track: '96px', min: 90, jql: 'updated', align: 'right',
    cell: (i) => <span className="tabular truncate text-[12px] text-[var(--w-text-3)]" title={new Date(i.updatedAt).toLocaleString('en-US')}>{relativeTime(i.updatedAt)}</span>,
    cmp: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
  },
  labels: {
    label: 'Labels', track: '180px', min: 160,
    cell: (i, c) => {
      const ls = i.labelIds.map((id) => c.lk.labels.get(id)).filter((l): l is NonNullable<typeof l> => !!l);
      return (
        <span className="flex min-w-0 items-center gap-1 overflow-hidden" title={ls.map((l) => l.name).join(', ')}>
          {ls.slice(0, 2).map((l) => <LabelChip key={l.id} label={l} />)}
          {ls.length > 2 && <span className="text-[11px] text-[var(--w-text-3)]">+{ls.length - 2}</span>}
        </span>
      );
    },
    cmp: (a, b, c) => nullsLast(c.lk.labels.get(a.labelIds[0])?.name, c.lk.labels.get(b.labelIds[0])?.name),
  },
  fixVersion: {
    label: 'Fix version', track: '120px', min: 110,
    cell: (i, c) => <span className="truncate text-[12.5px]">{c.versionName(i.fixVersionId)}</span>,
    cmp: (a, b, c) => nullsLast(c.versionName(a.fixVersionId) || null, c.versionName(b.fixVersionId) || null),
  },
};

export const COLUMN_ORDER: ColId[] = ['type', 'key', 'title', 'status', 'priority', 'assignee', 'reporter', 'sprint', 'points', 'due', 'created', 'updated', 'labels', 'fixVersion'];
export const DEFAULT_COLUMNS: ColId[] = ['type', 'key', 'title', 'status', 'priority', 'assignee', 'points', 'due', 'updated'];

/** Mẫu lưới cho desktop và điện thoại (ô chọn luôn đứng đầu). */
export function gridTemplates(cols: ColId[]) {
  const d = ['28px', ...cols.map((c) => COLUMNS[c].track)].join(' ');
  // Điện thoại: rãnh hẹp để tiêu đề còn chỗ (người chỉ còn avatar).
  const narrow: Partial<Record<ColId, string>> = { type: '18px', key: '60px', status: '88px', assignee: '22px' };
  const m = ['20px', ...cols.filter((c) => COLUMNS[c].mobile).map((c) => narrow[c] ?? COLUMNS[c].track)].join(' ');
  const minWidth = 28 + cols.reduce((s, c) => s + COLUMNS[c].min + 10, 0) + 32;
  return { d, m, minWidth };
}

export function ColumnsMenu({ value, onChange }: { value: ColId[]; onChange: (cols: ColId[]) => void }) {
  const t = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  const toggle = (id: ColId) => {
    const next = value.includes(id) ? value.filter((x) => x !== id) : [...value, id];
    onChange(COLUMN_ORDER.filter((c) => next.includes(c)));
  };
  return (
    <>
      <button ref={ref} type="button" onClick={t.toggle} className="w-btn w-btn-sm" aria-haspopup="menu" aria-expanded={t.on} title="Show or hide columns">
        <Columns3 size={13} /> <span className="max-sm:!hidden">Columns</span>
      </button>
      <Popover open={t.on} onClose={t.close} anchorRef={ref} width={210} align="end">
        <div className="max-h-[360px] overflow-y-auto p-1" role="menu" aria-label="Columns">
          {COLUMN_ORDER.map((id) => {
            const c = COLUMNS[id];
            const on = value.includes(id);
            return (
              <button
                key={id}
                type="button"
                role="menuitemcheckbox"
                aria-checked={on}
                disabled={c.fixed}
                onClick={() => toggle(id)}
                className="flex w-full items-center gap-2 rounded-[5px] px-2 py-1.5 text-left text-[13px] hover:bg-[var(--w-hover)] disabled:opacity-60"
              >
                <span className={cn('flex h-4 w-4 items-center justify-center rounded-[4px] border', on ? 'border-[var(--w-accent)] bg-[var(--w-accent)] text-white' : 'border-[var(--w-border-strong)]')}>
                  {on && <Check size={11} strokeWidth={3} />}
                </span>
                <span className="flex-1">{c.label}</span>
                {c.fixed && <span className="text-[11px] text-[var(--w-text-3)]">Always</span>}
              </button>
            );
          })}
          <div className="my-1 h-px bg-[var(--w-border)]" />
          <button type="button" onClick={() => onChange(DEFAULT_COLUMNS)} className="w-full rounded-[5px] px-2 py-1.5 text-left text-[12.5px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]">
            Reset to default
          </button>
        </div>
      </Popover>
    </>
  );
}

/** Tách/ghép mệnh đề ORDER BY của một câu JQL. */
export function jqlOrder(jql: string): { base: string; field: string | null; dir: 'asc' | 'desc' } {
  const m = /\s*\bORDER\s+BY\s+("?)([\w.]+)\1(?:\s+(ASC|DESC))?[\s\S]*$/i.exec(jql);
  if (!m) return { base: jql.trim(), field: null, dir: 'asc' };
  return { base: jql.slice(0, m.index).trim(), field: m[2].toLowerCase(), dir: (m[3] ?? 'ASC').toLowerCase() as 'asc' | 'desc' };
}

export function withOrder(jql: string, field: string, dir: 'asc' | 'desc'): string {
  const { base } = jqlOrder(jql);
  return `${base ? `${base} ` : ''}ORDER BY ${field} ${dir.toUpperCase()}`;
}
