'use client';

/**
 * Hàng điều khiển riêng của board: Group by (swimlane) + bộ lọc nhanh kiểu
 * Jira (Recently updated / Due this week / Unassigned / Labels). Bộ lọc tìm,
 * người, loại, "Only my issues" vẫn nằm ở thanh của trang.
 */

import { useRef } from 'react';
import type React from 'react';
import { ChevronDown, Rows3, Tag, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectConfig, WorkTeam } from '@/lib/work-api';
import { PickerList, Popover, useToggle } from '../ui';
import { GROUP_OPTIONS, quickActive, EMPTY_QUICK, type GroupBy, type QuickFilters } from './grouping';
import { wt } from '@/components/work/i18n';

const chip = (on: boolean) =>
  cn('w-btn w-btn-sm', on && '!border-[var(--w-accent-border)] !bg-[var(--w-accent-soft)] !text-[var(--w-accent-text)]');

export default function BoardToolbar({ config, group, onGroup, quick, onQuick, shown, total, lanes, onCollapseAll, leading, teams }: {
  config: ProjectConfig;
  /** Bộ phận của không gian — chỉ truyền khi dự án bật mô-đun teams (S1). */
  teams?: WorkTeam[];
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
  const teamMenu = useToggle();
  const teamRef = useRef<HTMLButtonElement>(null);
  const cur = GROUP_OPTIONS.find((g) => g.value === group) ?? GROUP_OPTIONS[0];
  const set = (patch: Partial<QuickFilters>) => onQuick({ ...quick, ...patch });

  return (
    <div className="flex shrink-0 items-center gap-1.5 border-b border-[var(--w-border)] px-4 py-2 sm:flex-wrap max-sm:overflow-x-auto max-sm:[scrollbar-width:none] [&>*]:shrink-0">
      {leading}
      {leading && <span className="mx-1 hidden h-5 w-px bg-[var(--w-border)] sm:block" aria-hidden />}
      <button
        ref={groupRef}
        type="button"
        onClick={groupMenu.toggle}
        aria-haspopup="listbox"
        aria-expanded={groupMenu.on}
        className={chip(group !== 'none')}
        title={wt('board.groupTitle')}
      >
        <Rows3 size={12} /> {wt('board.groupBy')}: <span className="font-semibold">{cur.label}</span> <ChevronDown size={12} className="opacity-60" />
      </button>
      <Popover open={groupMenu.on} onClose={groupMenu.close} anchorRef={groupRef} width={280}>
        <div className="p-1" role="listbox" aria-label={wt('board.groupBy')}>
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
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onCollapseAll(true)}>{wt('board.collapseAll')}</button>
          <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onCollapseAll(false)}>{wt('board.expandAll')}</button>
        </>
      )}

      <span className="mx-1 h-4 w-px bg-[var(--w-border)]" aria-hidden />
      <span className="text-[12px] font-medium text-[var(--w-text-3)] max-lg:sr-only">{wt('board.quickFilters')}</span>
      <button type="button" aria-pressed={quick.recent} className={chip(quick.recent)} onClick={() => set({ recent: !quick.recent })} title={wt('board.recentTitle')}>
        {wt('board.recent')}
      </button>
      <button type="button" aria-pressed={quick.dueWeek} className={chip(quick.dueWeek)} onClick={() => set({ dueWeek: !quick.dueWeek })} title={wt('board.dueWeekTitle')}>
        {wt('board.dueWeek')}
      </button>
      <button type="button" aria-pressed={quick.unassigned} className={chip(quick.unassigned)} onClick={() => set({ unassigned: !quick.unassigned })}>
        {wt('board.unassigned')}
      </button>
      {config.labels.length > 0 && (
        <>
          <button ref={labelRef} type="button" className={chip(quick.labels.length > 0)} onClick={labelMenu.toggle} aria-haspopup="listbox" aria-expanded={labelMenu.on}>
            <Tag size={12} /> {wt('board.labels')}{quick.labels.length > 0 && ` · ${quick.labels.length}`} <ChevronDown size={12} className="opacity-60" />
          </button>
          <Popover open={labelMenu.on} onClose={labelMenu.close} anchorRef={labelRef} width={230}>
            <PickerList
              multi
              options={config.labels.map((l) => ({ value: l.id, label: l.name, icon: <span className="h-2 w-2 rounded-full" style={{ background: l.color }} /> }))}
              selected={quick.labels}
              onPick={(id) => set({ labels: quick.labels.includes(id) ? quick.labels.filter((x) => x !== id) : [...quick.labels, id] })}
              placeholder={wt('board.filterLabel')}
            />
          </Popover>
        </>
      )}
      {teams && teams.length > 0 && (
        <>
          <button ref={teamRef} type="button" className={chip(quick.teams.length > 0)} onClick={teamMenu.toggle} aria-haspopup="listbox" aria-expanded={teamMenu.on}>
            <Users size={12} /> {wt('board.team')}{quick.teams.length > 0 && ` · ${quick.teams.length === 1 ? (teams.find((t) => t.id === quick.teams[0])?.key ?? 'None') : quick.teams.length}`} <ChevronDown size={12} className="opacity-60" />
          </button>
          <Popover open={teamMenu.on} onClose={teamMenu.close} anchorRef={teamRef} width={240}>
            <PickerList
              multi
              options={[
                { value: 0, label: wt('board.noTeam') },
                ...teams.map((t) => ({ value: t.id, label: t.name, hint: t.key, keywords: t.key, icon: <span className="h-2 w-2 rounded-full" style={{ background: t.color }} /> })),
              ]}
              selected={quick.teams}
              onPick={(id) => set({ teams: quick.teams.includes(id) ? quick.teams.filter((x) => x !== id) : [...quick.teams, id] })}
              placeholder={wt('board.filterTeam')}
            />
          </Popover>
        </>
      )}
      {quickActive(quick) && (
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => onQuick(EMPTY_QUICK)}>
          <X size={12} /> {wt('board.clearQuick')}
        </button>
      )}
      <span className="ml-auto pl-2 text-[12px] tabular text-[var(--w-text-3)]" title={wt('board.countTitle')}>
        {shown === total ? wt('common.issueCount', { count: total }) : wt('board.shownOf', { shown, total })}
      </span>
    </div>
  );
}
