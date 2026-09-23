'use client';

/**
 * Hàng điều khiển riêng của board: Group by (swimlane) + bộ lọc nhanh kiểu
 * Jira (Recently updated / Due this week / Unassigned / Labels). Bộ lọc tìm,
 * người, loại, "Only my issues" vẫn nằm ở thanh của trang.
 */

import { useRef } from 'react';
import type React from 'react';
import { ChevronDown, Rows3, Tag, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectConfig } from '@/lib/work-api';
import { PickerList, Popover, useToggle } from '../ui';
import { GROUP_OPTIONS, quickActive, EMPTY_QUICK, type GroupBy, type QuickFilters } from './grouping';

const chip = (on: boolean) =>
  cn('w-btn w-btn-sm', on && '!border-[var(--w-accent-border)] !bg-[var(--w-accent-soft)] !text-[var(--w-accent-text)]');

export default function BoardToolbar({ config, group, onGroup, quick, onQuick, shown, total, lanes, onCollapseAll, leading }: {
  config: ProjectConfig;
  /** Bộ lọc của trang (tìm kiếm, avatar, Only my issues, Type) — gộp chung một hàng. */
  leading?: React.ReactNode;
  group: GroupBy;
  onGroup: (g: GroupBy) => void;
  quick: QuickFilters;
  onQuick: (q: QuickFilters) => void;
  /** Số thẻ đang hiện / tổng (tính cả việc con). */
  shown: number;
  total: number;
  lanes: number;
  onCollapseAll?: (collapse: boolean) => void;
}) {
  const groupMenu = useToggle();
  const groupRef = useRef<HTMLButtonElement>(null);
  const labelMenu = useToggle();
  const labelRef = useRef<HTMLButtonElement>(null);
  const cur = GROUP_OPTIONS.find((g) => g.value === group) ?? GROUP_OPTIONS[0];
  const set = (patch: Partial<QuickFilters>) => onQuick({ ...quick, ...patch });

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-[var(--w-border)] px-4 py-1.5">
      {leading}
      {leading && <span className="mx-1 hidden h-5 w-px bg-[var(--w-border)] sm:block" aria-hidden />}
      <button
        ref={groupRef}
        type="button"
        onClick={groupMenu.toggle}
        aria-haspopup="listbox"
        aria-expanded={groupMenu.on}
        className={chip(group !== 'none')}
        title="Group the board into swimlanes"
      >
        <Rows3 size={12} /> Group by: <span className="font-semibold">{cur.label}</span> <ChevronDown size={12} className="opacity-60" />
      </button>
      <Popover open={groupMenu.on} onClose={groupMenu.close} anchorRef={groupRef} width={280}>
        <div className="p-1" role="listbox" aria-label="Group by">
          {GROUP_OPTIONS.map((g) => (
            <button
              key={g.value}
              type="button"
              role="option"
              aria-selected={g.value === group}
              onClick={() => { onGroup(g.value); groupMenu.close(); }}
              className={cn('flex w-full flex-col items-start rounded-[5px] px-2 py-1.5 text-left hover:bg-[var(--w-hover)]', g.value === group && 'bg-[var(--w-active)]')}
            >
              <span className="text-[13px] font-medium">{g.label}</span>
              <span className="text-[11.5px] text-[var(--w-text-3)]">{g.hint}</span>
            </button>
          ))}
        </div>
      </Popover>
      {group !== 'none' && lanes > 1 && onCollapseAll && (
        <>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onCollapseAll(true)}>Collapse all</button>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onCollapseAll(false)}>Expand all</button>
        </>
      )}

      <span className="mx-1 h-4 w-px bg-[var(--w-border)]" aria-hidden />
      <span className="text-[11.5px] font-medium uppercase tracking-wide text-[var(--w-text-3)]">Quick filters</span>
      <button type="button" aria-pressed={quick.recent} className={chip(quick.recent)} onClick={() => set({ recent: !quick.recent })} title="Updated in the last 48 hours">
        Recently updated
      </button>
      <button type="button" aria-pressed={quick.dueWeek} className={chip(quick.dueWeek)} onClick={() => set({ dueWeek: !quick.dueWeek })} title="Open issues due by the end of this week (includes overdue)">
        Due this week
      </button>
      <button type="button" aria-pressed={quick.unassigned} className={chip(quick.unassigned)} onClick={() => set({ unassigned: !quick.unassigned })}>
        Unassigned
      </button>
      {config.labels.length > 0 && (
        <>
          <button ref={labelRef} type="button" className={chip(quick.labels.length > 0)} onClick={labelMenu.toggle} aria-haspopup="listbox" aria-expanded={labelMenu.on}>
            <Tag size={12} /> Labels{quick.labels.length > 0 && ` · ${quick.labels.length}`} <ChevronDown size={12} className="opacity-60" />
          </button>
          <Popover open={labelMenu.on} onClose={labelMenu.close} anchorRef={labelRef} width={230}>
            <PickerList
              multi
              options={config.labels.map((l) => ({ value: l.id, label: l.name, icon: <span className="h-2 w-2 rounded-full" style={{ background: l.color }} /> }))}
              selected={quick.labels}
              onPick={(id) => set({ labels: quick.labels.includes(id) ? quick.labels.filter((x) => x !== id) : [...quick.labels, id] })}
              placeholder="Filter by label…"
            />
          </Popover>
        </>
      )}
      {quickActive(quick) && (
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onQuick(EMPTY_QUICK)}>
          <X size={12} /> Clear quick filters
        </button>
      )}
      <span className="ml-auto text-[11.5px] tabular text-[var(--w-text-3)]" title="Issues on this board, sub-tasks included">
        {shown === total ? `${total} ${total === 1 ? 'issue' : 'issues'}` : `${shown} of ${total} issues`}
      </span>
    </div>
  );
}
