'use client';

/**
 * CT Work — danh sách thẻ ("Issues").
 *
 * Bộ lọc sống trong query string (?q=&type=&status=&assignee=&label=&done=1)
 * để link một bộ lọc là chia sẻ được; thẻ đang mở là ?issue=NUM để Back đóng
 * được drawer. Trạng thái lọc THEO TÊN (gộp mọi quy trình): chọn "In Progress"
 * là chọn mọi statusId mang tên đó.
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ChevronDown, Plus, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { workApi, workError, userName, type IssueCard, type IssueQuery, type StatusCategory } from '@/lib/work-api';
import { CREATE_ISSUE_EVENT, useLookups, useProject, useProjectRealtime, wk } from '@/components/work/hooks';
import {
  EmptyState, IssueTypeIcon, PickerList, Popover, PriorityIcon, Spinner, StatusBadge, UserAvatar,
  formatDate, isTyping, relativeTime, useToggle, type PickOption,
} from '@/components/work/ui';
import IssueDrawer from '@/components/work/IssueDrawer';
import CreateIssueDialog from '@/components/work/CreateIssueDialog';

const PAGE = 100;
const ME = -1; // giá trị "Me" trong picker; trên URL là chữ `me`
const CATEGORY_ORDER: Record<StatusCategory, number> = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };

// Cột lưới: dưới md ẩn Points / Due / Updated.
const GRID =
  'grid items-center gap-x-2.5 grid-cols-[18px_60px_minmax(0,1fr)_88px_16px_22px] md:grid-cols-[18px_76px_minmax(0,1fr)_128px_18px_26px_44px_96px_76px]';

// ─── URL ⇄ bộ lọc ────────────────────────────────────────────────

function numList(v: string | null): number[] {
  if (!v) return [];
  return v.split(',').map((x) => Number(x)).filter((n) => Number.isInteger(n) && n > 0);
}

function assigneeList(v: string | null): number[] {
  if (!v) return [];
  return v.split(',').flatMap((x) => (x === 'me' ? [ME] : Number.isInteger(Number(x)) && Number(x) >= 0 && x !== '' ? [Number(x)] : []));
}

function strList(v: string | null): string[] {
  return v ? v.split(',').map((x) => x.trim()).filter(Boolean) : [];
}

function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// ─── Nút bộ lọc ──────────────────────────────────────────────────

function FilterButton<T>({
  label, options, selected, onToggle, summary,
}: {
  label: string;
  options: PickOption<T>[];
  selected: T[];
  onToggle: (v: T) => void;
  summary?: string;
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
        className={cn(
          'w-btn w-btn-sm gap-1',
          active && 'border-[var(--w-accent-border)] bg-[var(--w-accent-soft)] text-[var(--w-accent-text)] hover:!bg-[var(--w-accent-soft)]',
        )}
        aria-haspopup="listbox"
        aria-expanded={pop.on}
      >
        <span>{label}</span>
        {active && <span className="max-w-[110px] truncate font-normal">{summary ?? `· ${selected.length}`}</span>}
        <ChevronDown size={12} className="opacity-60" />
      </button>
      <Popover open={pop.on} onClose={pop.close} anchorRef={ref as RefObject<HTMLElement>} width={250}>
        <PickerList options={options} selected={selected} onPick={onToggle} multi placeholder={`Filter by ${label.toLowerCase()}…`} />
      </Popover>
    </>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function IssuesListPage({ params }: { params: { ws: string; key: string } }) {
  return (
    <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size={20} /></div>}>
      <IssuesList slug={decodeURIComponent(params.ws)} projectKey={decodeURIComponent(params.key).toUpperCase()} />
    </Suspense>
  );
}

function IssuesList({ slug, projectKey }: { slug: string; projectKey: string }) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const sp = useSearchParams();
  const meId = useAuthStore((s) => s.user?.id);

  const { pid, config, isLoading: projectLoading, error: projectError } = useProject(slug, projectKey);
  const lk = useLookups(config);
  useProjectRealtime(pid);

  // ── Bộ lọc từ URL ──
  const qParam = sp?.get('q')?.trim() ?? '';
  const typeSel = useMemo(() => numList(sp?.get('type') ?? null), [sp]);
  const statusSel = useMemo(() => strList(sp?.get('status') ?? null), [sp]);
  const assigneeSel = useMemo(() => assigneeList(sp?.get('assignee') ?? null), [sp]);
  const labelSel = useMemo(() => numList(sp?.get('label') ?? null), [sp]);
  const showDone = sp?.get('done') === '1';
  const issueParam = Number(sp?.get('issue'));
  const openNum = Number.isInteger(issueParam) && issueParam > 0 ? issueParam : null;

  const setParams = useCallback(
    (patch: Record<string, string | null>, mode: 'replace' | 'push' = 'replace') => {
      const next = new URLSearchParams(sp?.toString() ?? '');
      Object.entries(patch).forEach(([k, v]) => (v === null || v === '' ? next.delete(k) : next.set(k, v)));
      const s = next.toString();
      const url = s ? `${pathname}?${s}` : pathname;
      if (mode === 'push') router.push(url, { scroll: false });
      else router.replace(url, { scroll: false });
    },
    [sp, pathname, router],
  );

  // ── Ô tìm, trễ 250ms ──
  const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState(qParam);
  useEffect(() => {
    const t = setTimeout(() => {
      if (search.trim() !== qParam) setParams({ q: search.trim() || null });
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  // URL đổi từ ngoài (Back, link chia sẻ) ⇒ đồng bộ lại ô tìm, trừ lúc đang gõ.
  useEffect(() => {
    if (document.activeElement !== searchRef.current) setSearch(qParam);
  }, [qParam]);

  // ── Trạng thái gộp theo tên ──
  const statusGroups = useMemo(() => {
    const m = new Map<string, { name: string; ids: number[]; category: StatusCategory; color: string; order: number }>();
    config?.workflows.forEach((w) =>
      w.statuses.forEach((s) => {
        const g = m.get(s.name);
        if (g) g.ids.push(s.id);
        else m.set(s.name, { name: s.name, ids: [s.id], category: s.category, color: s.color, order: CATEGORY_ORDER[s.category] * 1000 + s.position });
      }),
    );
    return [...m.values()].sort((a, b) => a.order - b.order);
  }, [config]);

  const query = useMemo<IssueQuery>(() => {
    const statusIds = statusGroups.filter((g) => statusSel.includes(g.name)).flatMap((g) => g.ids);
    const pickedDone = statusGroups.some((g) => statusSel.includes(g.name) && g.category === 'DONE');
    const assignee = assigneeSel.map((a) => (a === ME ? meId ?? -1 : a)).filter((a) => a >= 0);
    return {
      q: qParam || undefined,
      type: typeSel.length ? typeSel : undefined,
      status: statusIds.length ? statusIds : undefined,
      assignee: assignee.length ? assignee : undefined,
      label: labelSel.length ? labelSel : undefined,
      includeDone: showDone || pickedDone,
      limit: PAGE,
    };
  }, [qParam, typeSel, statusSel, statusGroups, assigneeSel, meId, labelSel, showDone]);

  const hasFilters = !!(qParam || typeSel.length || statusSel.length || assigneeSel.length || labelSel.length);
  // Lọc theo trạng thái mà cấu hình chưa về thì chưa dựng được danh sách id — chờ.
  const ready = !!pid && !!config;

  const list = useInfiniteQuery({
    queryKey: [...wk.issues(pid ?? 0), query],
    queryFn: ({ pageParam }) => workApi.issues(pid!, { ...query, cursor: (pageParam as string | undefined) || undefined }),
    initialPageParam: '' as string,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: ready,
    staleTime: 15_000,
  });

  const items = useMemo(() => list.data?.pages.flatMap((p) => p.items) ?? [], [list.data]);
  // IssueCard chỉ có parentId — tra số của cha trong những thẻ đã tải.
  const numById = useMemo(() => new Map(items.map((i) => [i.id, i.number])), [items]);

  // ── Drawer ──
  const pushedIssue = useRef(false);
  const openIssue = useCallback(
    (num: number) => {
      pushedIssue.current = true;
      setParams({ issue: String(num) }, 'push');
    },
    [setParams],
  );
  const closeIssue = useCallback(() => {
    if (pushedIssue.current) {
      pushedIssue.current = false;
      router.back();
    } else {
      setParams({ issue: null });
    }
  }, [router, setParams]);

  // ── Tạo thẻ ──
  const [createOpen, setCreateOpen] = useState(false);
  const canCreate = !!config?.permissions.createIssues;
  useEffect(() => {
    const onCreate = () => canCreate && setCreateOpen(true);
    window.addEventListener(CREATE_ISSUE_EVENT, onCreate);
    return () => window.removeEventListener(CREATE_ISSUE_EVENT, onCreate);
  }, [canCreate]);

  // ── Bàn phím ──
  const [hi, setHi] = useState(-1);
  const rowsRef = useRef<HTMLDivElement>(null);
  useEffect(() => setHi(-1), [query]);
  useEffect(() => {
    if (hi < 0) return;
    rowsRef.current?.querySelector<HTMLElement>(`[data-row="${hi}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [hi]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTyping(e.target)) return;
      if (createOpen || openNum !== null || document.querySelector('#work-portal [role="dialog"]')) return;
      const k = e.key;
      if (k === 'j' || k === 'ArrowDown') {
        if (!items.length) return;
        e.preventDefault();
        setHi((h) => Math.min(h + 1, items.length - 1));
      } else if (k === 'k' || k === 'ArrowUp') {
        if (!items.length) return;
        e.preventDefault();
        setHi((h) => Math.max(h - 1, 0));
      } else if (k === 'Enter') {
        if (hi >= 0 && items[hi]) {
          e.preventDefault();
          openIssue(items[hi].number);
        }
      } else if (k === 'c') {
        if (!canCreate) return;
        e.preventDefault();
        setCreateOpen(true);
      } else if (k === '/') {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [items, hi, createOpen, openNum, canCreate, openIssue]);

  // ── Lựa chọn cho picker ──
  const typeOptions = useMemo<PickOption<number>[]>(
    () => (config?.issueTypes ?? []).map((t) => ({ value: t.id, label: t.name, icon: <IssueTypeIcon type={t} size={12} /> })),
    [config],
  );
  const statusOptions = useMemo<PickOption<string>[]>(
    () =>
      statusGroups.map((g) => ({
        value: g.name,
        label: g.name,
        icon: <span className="h-2 w-2 rounded-full" style={{ background: g.color }} />,
        hint: g.category === 'DONE' ? 'Done' : g.category === 'IN_PROGRESS' ? 'In progress' : 'To do',
      })),
    [statusGroups],
  );
  const assigneeOptions = useMemo<PickOption<number>[]>(
    () => [
      { value: ME, label: 'Me', icon: <UserAvatar user={config?.members.find((m) => m.id === meId)} size={16} />, keywords: 'myself current' },
      { value: 0, label: 'Unassigned', icon: <UserAvatar user={null} size={16} />, keywords: 'nobody none' },
      ...(config?.members ?? [])
        .filter((m) => m.id !== meId)
        .map((m) => ({ value: m.id, label: userName(m), icon: <UserAvatar user={m} size={16} />, keywords: m.username })),
    ],
    [config, meId],
  );
  const labelOptions = useMemo<PickOption<number>[]>(
    () => (config?.labels ?? []).map((l) => ({ value: l.id, label: l.name, icon: <span className="h-2 w-2 rounded-full" style={{ background: l.color }} /> })),
    [config],
  );

  const toggleIn = <T,>(arr: T[], v: T) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const joinOrNull = (arr: Array<string | number>) => (arr.length ? arr.join(',') : null);

  const clearFilters = () => {
    setSearch('');
    setParams({ q: null, type: null, status: null, assignee: null, label: null });
  };

  const summaryOf = (labels: string[]) => (labels.length === 1 ? `· ${labels[0]}` : `· ${labels.length}`);

  // ── Trạng thái tải trang ──
  if (projectError) {
    return (
      <div className="h-full overflow-y-auto">
        <EmptyState title="Project not found" body="It may have been deleted, or you no longer have access to it." />
      </div>
    );
  }
  if (projectLoading || !config) {
    return <div className="flex h-full items-center justify-center"><Spinner size={20} /></div>;
  }

  const countLabel = list.isLoading ? '' : `${items.length}${list.hasNextPage ? '+' : ''}`;
  const today = todayLocal();

  return (
    <div className="flex h-full min-w-0 flex-col">
      {/* Thanh đầu */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-3 md:px-4">
        <span className="hidden truncate text-[13px] text-[var(--w-text-3)] sm:inline">{config.name}</span>
        <span className="hidden text-[var(--w-text-3)] sm:inline">/</span>
        <h1 className="text-[14px] font-semibold">Issues</h1>
        {countLabel && <span className="tabular rounded-[4px] bg-[var(--w-sunken)] px-1.5 py-0.5 text-[11px] text-[var(--w-text-2)]">{countLabel}</span>}
        <div className="flex-1" />
        {canCreate && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setCreateOpen(true)}>
            <Plus size={14} /> <span>Create issue</span>
            <kbd className="ml-1 hidden rounded-[3px] bg-white/20 px-1 text-[10px] font-medium leading-[16px] md:inline">C</kbd>
          </button>
        )}
      </div>

      {/* Thanh lọc */}
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 border-b border-[var(--w-border)] px-3 py-2 md:px-4">
        <div className="relative w-full sm:w-[240px]">
          <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--w-text-3)]" />
          <input
            ref={searchRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                if (search) setSearch('');
                else (e.target as HTMLInputElement).blur();
              }
            }}
            placeholder="Search issues or keys…"
            aria-label="Search issues"
            className="w-input !h-[28px] !pl-7 !pr-7 !text-[12.5px]"
          />
          {search ? (
            <button type="button" onClick={() => setSearch('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--w-text-3)] hover:text-[var(--w-text)]" aria-label="Clear search">
              <X size={12} />
            </button>
          ) : (
            <kbd className="w-kbd pointer-events-none absolute right-1.5 top-1/2 hidden -translate-y-1/2 sm:inline-flex">/</kbd>
          )}
        </div>
        <FilterButton
          label="Type"
          options={typeOptions}
          selected={typeSel}
          onToggle={(v) => setParams({ type: joinOrNull(toggleIn(typeSel, v)) })}
          summary={summaryOf(typeSel.map((id) => lk.types.get(id)?.name ?? '?'))}
        />
        <FilterButton
          label="Status"
          options={statusOptions}
          selected={statusSel}
          onToggle={(v) => setParams({ status: joinOrNull(toggleIn(statusSel, v)) })}
          summary={summaryOf(statusSel)}
        />
        <FilterButton
          label="Assignee"
          options={assigneeOptions}
          selected={assigneeSel}
          onToggle={(v) => setParams({ assignee: joinOrNull(toggleIn(assigneeSel, v).map((a) => (a === ME ? 'me' : a))) })}
          summary={summaryOf(assigneeSel.map((a) => (a === ME ? 'Me' : a === 0 ? 'Unassigned' : userName(lk.members.get(a)))))}
        />
        {labelOptions.length > 0 && (
          <FilterButton
            label="Label"
            options={labelOptions}
            selected={labelSel}
            onToggle={(v) => setParams({ label: joinOrNull(toggleIn(labelSel, v)) })}
            summary={summaryOf(labelSel.map((id) => lk.labels.get(id)?.name ?? '?'))}
          />
        )}
        <label className="ml-1 flex h-[26px] cursor-pointer select-none items-center gap-1.5 rounded-[6px] px-1.5 text-[12px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]">
          <input
            type="checkbox"
            checked={showDone}
            onChange={(e) => setParams({ done: e.target.checked ? '1' : null })}
            className="h-3.5 w-3.5 accent-[var(--w-accent)]"
          />
          Show done
        </label>
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="w-btn w-btn-ghost w-btn-sm">
            <X size={12} /> Clear filters
          </button>
        )}
      </div>

      {/* Bảng */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
        <div
          role="row"
          className={cn(GRID, 'sticky top-0 z-[1] h-8 border-b border-[var(--w-border)] bg-[var(--w-panel)] px-3 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)] md:px-4')}
        >
          <span />
          <span>Key</span>
          <span>Title</span>
          <span>Status</span>
          {/* KHÔNG sr-only: nó là position:absolute, rút ô khỏi lưới và làm các cột sau lệch hai ô. */}
          <span aria-label="Priority" />
          <span aria-label="Assignee" />
          <span className="hidden text-right md:block">Pts</span>
          <span className="hidden md:block">Due</span>
          <span className="hidden text-right md:block">Updated</span>
        </div>

        {list.isLoading || !ready ? (
          <div aria-busy="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className={cn(GRID, 'h-9 border-b border-[var(--w-border)] px-3 md:px-4')}>
                <span className="h-4 w-4 rounded-[4px] bg-[var(--w-sunken)]" />
                <span className="h-3 w-12 rounded bg-[var(--w-sunken)]" />
                <span className="h-3 rounded bg-[var(--w-sunken)]" style={{ width: `${40 + ((i * 37) % 45)}%` }} />
                <span className="h-4 w-16 rounded bg-[var(--w-sunken)]" />
              </div>
            ))}
          </div>
        ) : list.isError ? (
          <EmptyState
            title="Couldn't load issues"
            body={workError(list.error)}
            action={<button type="button" className="w-btn" onClick={() => list.refetch()}>Try again</button>}
          />
        ) : !items.length ? (
          hasFilters ? (
            <EmptyState
              title="No issues match your filters"
              body={showDone ? 'Try a different search or remove some filters.' : 'Try a different search, remove some filters, or include done issues.'}
              action={
                <div className="flex gap-2">
                  <button type="button" className="w-btn" onClick={clearFilters}>Clear filters</button>
                  {!showDone && <button type="button" className="w-btn w-btn-ghost" onClick={() => setParams({ done: '1' })}>Show done</button>}
                </div>
              }
            />
          ) : (
            <EmptyState
              title={showDone ? 'No issues yet' : 'No open issues'}
              body={
                showDone
                  ? 'Issues track the work in this project: stories, tasks, bugs and more.'
                  : 'Everything open is cleared. Create a new issue, or include done issues to see completed work.'
              }
              action={
                <div className="flex gap-2">
                  {canCreate && (
                    <button type="button" className="w-btn w-btn-primary" onClick={() => setCreateOpen(true)}>
                      <Plus size={14} /> Create issue
                    </button>
                  )}
                  {!showDone && <button type="button" className="w-btn" onClick={() => setParams({ done: '1' })}>Show done</button>}
                </div>
              }
            />
          )
        ) : (
          <div ref={rowsRef} role="rowgroup">
            {items.map((it, i) => (
              <IssueRow
                key={it.id}
                issue={it}
                index={i}
                highlighted={i === hi || it.number === openNum}
                lk={lk}
                parentNum={it.parentId ? numById.get(it.parentId) : undefined}
                today={today}
                onOpen={() => {
                  setHi(i);
                  openIssue(it.number);
                }}
              />
            ))}
            {list.hasNextPage && (
              <div className="flex justify-center py-3">
                <button type="button" className="w-btn w-btn-sm" disabled={list.isFetchingNextPage} onClick={() => list.fetchNextPage()}>
                  {list.isFetchingNextPage ? <Spinner size={12} /> : null}
                  Load more
                </button>
              </div>
            )}
            <div className="hidden items-center gap-3 px-4 py-3 text-[11px] text-[var(--w-text-3)] md:flex">
              <span className="flex items-center gap-1"><kbd className="w-kbd">J</kbd><kbd className="w-kbd">K</kbd> move</span>
              <span className="flex items-center gap-1"><kbd className="w-kbd">↵</kbd> open</span>
              {canCreate && <span className="flex items-center gap-1"><kbd className="w-kbd">C</kbd> create</span>}
              <span className="flex items-center gap-1"><kbd className="w-kbd">/</kbd> search</span>
            </div>
          </div>
        )}
      </div>

      {pid && <IssueDrawer pid={pid} num={openNum} onClose={closeIssue} onOpenIssue={(n) => setParams({ issue: String(n) })} />}
      {createOpen && (
        <CreateIssueDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          config={config}
          defaults={typeSel.length === 1 ? { typeId: typeSel[0] } : undefined}
        />
      )}
    </div>
  );
}

// ─── Một dòng ────────────────────────────────────────────────────

function IssueRow({
  issue, index, highlighted, lk, parentNum, today, onOpen,
}: {
  issue: IssueCard;
  index: number;
  highlighted: boolean;
  lk: ReturnType<typeof useLookups>;
  parentNum: number | undefined;
  today: string;
  onOpen: () => void;
}) {
  const status = lk.statuses.get(issue.statusId);
  const type = lk.types.get(issue.typeId);
  const assignee = issue.assigneeId ? lk.members.get(issue.assigneeId) ?? null : null;
  const due = issue.dueDate?.slice(0, 10);
  const overdue = !!due && due < today && status?.category !== 'DONE';
  return (
    <div
      role="row"
      data-row={index}
      tabIndex={-1}
      onClick={onOpen}
      className={cn(
        GRID,
        'h-9 cursor-pointer border-b border-[var(--w-border)] px-3 text-[13px] md:px-4',
        highlighted ? 'bg-[var(--w-active)]' : 'hover:bg-[var(--w-hover)]',
      )}
    >
      <IssueTypeIcon type={type} size={14} />
      <span className="truncate font-mono text-[11.5px] text-[var(--w-text-3)]">{lk.issueKey(issue.number)}</span>
      <span className="flex min-w-0 items-center gap-2">
        <span className={cn('truncate', status?.category === 'DONE' && 'text-[var(--w-text-2)]')}>{issue.title}</span>
        {parentNum !== undefined && (
          <span className="hidden shrink-0 font-mono text-[10.5px] text-[var(--w-text-3)] sm:inline">{lk.issueKey(parentNum)}</span>
        )}
      </span>
      <span className="min-w-0">
        <StatusBadge status={status} className="!block max-w-full truncate leading-[20px]" />
      </span>
      <PriorityIcon priority={issue.priority} size={15} />
      <UserAvatar user={assignee} size={20} />
      <span className="tabular hidden text-right text-[12px] text-[var(--w-text-2)] md:block">{issue.storyPoints ?? ''}</span>
      <span className={cn('tabular hidden truncate text-[12px] md:block', overdue ? 'font-medium text-[var(--w-red)]' : 'text-[var(--w-text-2)]')} title={overdue ? 'Overdue' : undefined}>
        {due ? formatDate(due) : ''}
      </span>
      <span className="tabular hidden truncate text-right text-[12px] text-[var(--w-text-3)] md:block" title={new Date(issue.updatedAt).toLocaleString('en-US')}>
        {relativeTime(issue.updatedAt)}
      </span>
    </div>
  );
}
