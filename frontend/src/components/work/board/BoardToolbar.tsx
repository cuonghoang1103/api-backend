'use client';

/**
 * Hàng điều khiển riêng của board: Group by (swimlane) + bộ lọc nhanh kiểu
 * Jira (Recently updated / Due this week / Unassigned / Labels). Bộ lọc tìm,
 * người, loại, "Only my issues" vẫn nằm ở thanh của trang.
 *
 * Đợt 8D (19/10/2026): hàng chỉ còn [tìm · avatar · Chỉ của tôi] (của trang) + Nhóm theo + MỘT nút "Bộ lọc"
 * (bong bóng chứa loại thẻ, People/Agents, lọc nhanh, nhãn, bộ phận) + Xoá bộ lọc + số thẻ.
 */

import { useRef } from 'react';
import type React from 'react';
import { ChevronDown, Rows3, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectConfig, WorkTeam } from '@/lib/work-api';
import { Popover, useToggle } from '../ui';
import { GROUP_OPTIONS, EMPTY_QUICK, type GroupBy, type QuickFilters } from './grouping';
import { FilterSection, useBoardPageFilters } from './extraFilters';
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
  const filterMenu = useToggle();
  const filterRef = useRef<HTMLButtonElement>(null);
  const page = useBoardPageFilters();
  const activeCount = (page?.count ?? 0) + Number(quick.recent) + Number(quick.dueWeek) + Number(quick.unassigned) + quick.labels.length + quick.teams.length;
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

      {/* Đợt 8D: lọc nhanh / nhãn / bộ phận (+ loại thẻ, People/Agents của trang) gộp vào MỘT nút "Bộ lọc" — hàng
          công cụ không còn 10+ nút tràn sang dòng hai ở cửa sổ hẹp. Số trên nút = số bộ lọc đang bật. */}
      <button
        ref={filterRef}
        type="button"
        onClick={filterMenu.toggle}
        aria-haspopup="dialog"
        aria-expanded={filterMenu.on}
        className={chip(activeCount > 0)}
        title={wt('g8d.filtersTitle')}
        data-testid="board-filters"
      >
        <SlidersHorizontal size={12} /> {wt('g8d.filters')}
        {activeCount > 0 && <span className="ml-0.5 rounded-full bg-[var(--w-accent)] px-1.5 text-[10.5px] font-semibold leading-[16px] text-white tabular-nums">{activeCount}</span>}
        <ChevronDown size={12} className="opacity-60" />
      </button>
      <Popover open={filterMenu.on} onClose={filterMenu.close} anchorRef={filterRef} width={320}>
        <div role="dialog" aria-label={wt('g8d.filters')} className="max-h-[min(70vh,520px)] divide-y divide-[var(--w-border)] overflow-y-auto">
          {page?.content}
          <FilterSection title={wt('g8d.fQuick')}>
            <button type="button" aria-pressed={quick.recent} className={chip(quick.recent)} onClick={() => set({ recent: !quick.recent })} title={wt('board.recentTitle')}>
              {wt('board.recent')}
            </button>
            <button type="button" aria-pressed={quick.dueWeek} className={chip(quick.dueWeek)} onClick={() => set({ dueWeek: !quick.dueWeek })} title={wt('board.dueWeekTitle')}>
              {wt('board.dueWeek')}
            </button>
            <button type="button" aria-pressed={quick.unassigned} className={chip(quick.unassigned)} onClick={() => set({ unassigned: !quick.unassigned })}>
              {wt('board.unassigned')}
            </button>
          </FilterSection>
          {config.labels.length > 0 && (
            <FilterSection title={wt('g8d.fLabels')}>
              {config.labels.map((l) => {
                const on = quick.labels.includes(l.id);
                return (
                  <button key={l.id} type="button" aria-pressed={on} className={chip(on)} onClick={() => set({ labels: on ? quick.labels.filter((x) => x !== l.id) : [...quick.labels, l.id] })}>
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: l.color }} /> {l.name}
                  </button>
                );
              })}
            </FilterSection>
          )}
          {teams && teams.length > 0 && (
            <FilterSection title={wt('g8d.fTeam')}>
              {[{ id: 0, name: wt('board.noTeam'), color: 'transparent', key: '' }, ...teams].map((t) => {
                const on = quick.teams.includes(t.id);
                return (
                  <button key={t.id} type="button" aria-pressed={on} title={t.key || undefined} className={chip(on)} onClick={() => set({ teams: on ? quick.teams.filter((x) => x !== t.id) : [...quick.teams, t.id] })}>
                    {t.id !== 0 && <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ background: t.color }} />} {t.name}
                  </button>
                );
              })}
            </FilterSection>
          )}
        </div>
      </Popover>
      {(activeCount > 0 || page?.rowActive) && (
        <button type="button" className="w-btn w-btn-ghost w-btn-sm" onClick={() => { onQuick(EMPTY_QUICK); page?.clear(); }} data-testid="board-filters-clear">
          <X size={12} /> {wt('g8d.clearAll')}
        </button>
      )}
      <span className="ml-auto pl-2 text-[12px] tabular text-[var(--w-text-3)]" title={wt('board.countTitle')}>
        {shown === total ? wt('common.issueCount', { count: total }) : wt('board.shownOf', { shown, total })}
      </span>
    </div>
  );
}
