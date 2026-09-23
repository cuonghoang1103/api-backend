'use client';

/**
 * Thanh bộ lọc Basic của trang tìm thẻ mọi dự án: ô chữ + Project · Type ·
 * Status · Assignee (mỗi nút mở một PickerList chọn nhiều).
 */

import { forwardRef, useMemo, useRef, type RefObject } from 'react';
import { ChevronDown, FolderKanban, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { userName, type GlobalSearchFacets, type StatusCategory } from '@/lib/work-api';
import { CATEGORY_DOT, IssueTypeIcon, PickerList, Popover, UserAvatar, useToggle, type PickOption } from '../ui';
import { CATEGORY_LABEL, type BasicState } from './query';

const summaryOf = (xs: string[]) => (xs.length === 1 ? `: ${xs[0]}` : xs.length ? ` · ${xs.length}` : '');

function FilterMenu<T extends string>({ label, options, selected, onToggle, summary, width = 260 }: {
  label: string;
  options: PickOption<T>[];
  selected: T[];
  onToggle: (v: T) => void;
  summary: string;
  width?: number;
}) {
  const pop = useToggle();
  const ref = useRef<HTMLButtonElement>(null);
  const active = selected.length > 0;
  return (
    <>
      <button
        ref={ref}
        type="button"
        onClick={pop.toggle}
        aria-haspopup="listbox"
        aria-expanded={pop.on}
        className={cn(
          'w-btn w-btn-sm gap-1',
          active && 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)] hover:!bg-[var(--w-accent-soft)]',
        )}
      >
        <span>{label}</span>
        {active && <span className="max-w-[120px] truncate font-normal">{summary}</span>}
        <ChevronDown size={12} className="opacity-60" />
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={ref as RefObject<HTMLElement>} width={width}>
        <PickerList options={options} selected={selected} onPick={onToggle} multi placeholder={`Filter by ${label.toLowerCase()}…`} />
      </Popover>
    </>
  );
}

const toggleIn = <T,>(xs: T[], v: T) => (xs.includes(v) ? xs.filter((x) => x !== v) : [...xs, v]);

export const BasicFilters = forwardRef<HTMLInputElement, {
  facets: GlobalSearchFacets | undefined;
  state: BasicState;
  text: string;
  onText: (v: string) => void;
  onChange: (patch: Partial<BasicState>) => void;
  onClear: () => void;
}>(function BasicFilters({ facets, state, text, onText, onChange, onClear }, ref) {
  const projectOpts = useMemo<PickOption<string>[]>(() => {
    // Hai không gian có thể trùng khoá dự án ⇒ gộp theo khoá (JQL lọc theo khoá).
    const seen = new Map<string, NonNullable<GlobalSearchFacets>['projects'][number]>();
    for (const p of facets?.projects ?? []) if (!seen.has(p.key)) seen.set(p.key, p);
    return [...seen.values()].map((p) => ({
      value: p.key,
      label: p.name,
      keywords: `${p.key} ${p.workspace.name}`,
      hint: p.archived ? `${p.key} · archived` : p.key,
      icon: <FolderKanban size={13} className="text-[var(--w-text-3)]" />,
    }));
  }, [facets]);
  const typeOpts = useMemo<PickOption<string>[]>(
    () => (facets?.types ?? []).map((t) => ({ value: t.name, label: t.name, icon: <IssueTypeIcon type={t} size={12} /> })),
    [facets],
  );
  const catOpts: PickOption<StatusCategory>[] = (['TODO', 'IN_PROGRESS', 'DONE'] as const).map((c) => ({
    value: c,
    label: CATEGORY_LABEL[c],
    icon: <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_DOT[c] }} />,
  }));
  const me = useAuthStore((s) => s.user);
  const assigneeOpts = useMemo<PickOption<string>[]>(() => [
    {
      value: 'me', label: 'Me', keywords: 'current user mine',
      icon: <UserAvatar user={me ? { username: me.username, fullName: me.fullName ?? null, displayName: me.displayName ?? null, avatarUrl: me.avatarUrl ?? null } : null} size={16} />,
    },
    { value: 'none', label: 'Unassigned', keywords: 'empty nobody', icon: <UserAvatar user={null} size={16} /> },
    ...(facets?.assignees ?? []).map((u) => ({ value: u.username, label: userName(u), hint: `@${u.username}`, keywords: u.username, icon: <UserAvatar user={u} size={16} /> })),
  ], [facets, me]);

  const nameOf = (list: PickOption<string>[], v: string) => list.find((o) => o.value === v)?.label ?? v;
  const any = !!(text || state.projects.length || state.types.length || state.cats.length || state.assignees.length);

  return (
    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
      <div className="relative w-full sm:w-[260px]">
        <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
        <input
          ref={ref}
          value={text}
          onChange={(e) => onText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              if (text) onText('');
              else (e.target as HTMLInputElement).blur();
            }
          }}
          placeholder="Search by key, title or description…"
          aria-label="Search text"
          className="w-input !h-[28px] !pl-7 !pr-7 !text-[12.5px]"
        />
        {text ? (
          <button type="button" onClick={() => onText('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--w-text-3)] hover:text-[var(--w-text)]" aria-label="Clear search text">
            <X size={12} />
          </button>
        ) : (
          <kbd className="w-kbd pointer-events-none absolute right-1.5 top-1/2 hidden -translate-y-1/2 sm:inline-flex">/</kbd>
        )}
      </div>
      <FilterMenu
        label="Project"
        options={projectOpts}
        selected={state.projects}
        onToggle={(v) => onChange({ projects: toggleIn(state.projects, v) })}
        summary={summaryOf(state.projects)}
        width={300}
      />
      <FilterMenu label="Type" options={typeOpts} selected={state.types} onToggle={(v) => onChange({ types: toggleIn(state.types, v) })} summary={summaryOf(state.types)} />
      <FilterMenu
        label="Status"
        options={catOpts}
        selected={state.cats}
        onToggle={(v) => onChange({ cats: toggleIn(state.cats, v) })}
        summary={summaryOf(state.cats.map((c) => CATEGORY_LABEL[c]))}
        width={220}
      />
      <FilterMenu
        label="Assignee"
        options={assigneeOpts}
        selected={state.assignees}
        onToggle={(v) => onChange({ assignees: toggleIn(state.assignees, v) })}
        summary={summaryOf(state.assignees.map((a) => nameOf(assigneeOpts, a)))}
      />
      {any && (
        <button type="button" onClick={onClear} className="w-btn w-btn-ghost w-btn-sm">
          <X size={12} /> Clear
        </button>
      )}
    </div>
  );
});
