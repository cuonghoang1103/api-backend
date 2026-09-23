'use client';

/**
 * CT Work — "Search issues" ở MỌI dự án (kiểu Jira issue navigator).
 *
 * Basic: ô chữ (xếp theo độ khớp) + Project · Type · Status · Assignee.
 * JQL: JqlInput dùng chung, có trường `project`. Trạng thái nằm hết trên URL
 * (xem query.ts) để link chia sẻ được. J/K di chuyển, Enter mở, / tìm.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Code2, Layers, ListFilter, Rows3, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { workError, workSearchApi, workSearchKeys, type GlobalIssueHit } from '@/lib/work-api';
import { PageHeader } from '../settings/shared';
import { EmptyState, Spinner, isTyping } from '../ui';
import { JqlInput, type JqlInputHandle } from '../search/JqlInput';
import { jqlErrorOf } from '../search/jql';
import HelpButton from '../help/HelpButton';
import { BasicFilters } from './Filters';
import { GroupHeading, ResultRow, ResultsHeader, SkeletonRows } from './ResultsTable';
import {
  applySuggestion, basicToJql, facetsConfig, hasBasicFilters, jqlSuggestionOf, jqlWithSort, nextSort, readBasic, readSort,
  sortOfJql, type BasicState, type SortCol,
} from './query';

const PAGE = 50;

function Segmented<T extends string>({ value, options, onChange, label }: {
  value: T;
  options: Array<{ value: T; label: string; icon: typeof Code2 }>;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex h-[28px] shrink-0 items-center rounded-[7px] border border-[var(--w-border-strong)] bg-[var(--w-sunken)] p-[2px]">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={cn(
              'flex h-full items-center gap-1.5 rounded-[5px] px-2.5 text-[12px] font-medium transition-colors',
              on ? 'bg-[var(--w-panel)] text-[var(--w-text)] shadow-[var(--w-shadow-card)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
            )}
          >
            <o.icon size={12} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export default function GlobalSearchPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() ?? '/work/search';
  const params = useMemo(() => new URLSearchParams(sp?.toString() ?? ''), [sp]);

  const mode: 'basic' | 'jql' = params.get('mode') === 'jql' || (params.has('jql') && params.get('mode') !== 'basic') ? 'jql' : 'basic';
  const basic = useMemo(() => readBasic(params), [params]);
  const basicSort = useMemo(() => readSort(params), [params]);
  const jqlParam = params.get('jql') ?? '';
  const grouped = params.get('group') === 'project';

  const setParams = useCallback((patch: Record<string, string | null>, push = false) => {
    const n = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(patch)) {
      if (v === null || v === '') n.delete(k);
      else n.set(k, v);
    }
    const s = n.toString();
    const href = s ? `${pathname}?${s}` : pathname;
    if (push) router.push(href, { scroll: false });
    else router.replace(href, { scroll: false });
  }, [params, pathname, router]);

  // ── Chữ tự do: gõ tại chỗ, ghi URL sau 250ms ──
  const [text, setText] = useState(basic.text);
  const textRef = useRef<HTMLInputElement>(null);
  // Giá trị chính mình vừa ghi lên URL — URL đổi vì nó thì KHÔNG ghi đè ô đang gõ.
  const pushed = useRef(basic.text);
  useEffect(() => {
    if (basic.text !== pushed.current) { pushed.current = basic.text; setText(basic.text); }
  }, [basic.text]);
  useEffect(() => {
    if (text === pushed.current) return;
    const t = setTimeout(() => { pushed.current = text; setParams({ q: text.trim() ? text : null }); }, 250);
    return () => clearTimeout(t);
  }, [text, setParams]);

  const setBasic = (patch: Partial<BasicState>) => {
    const next = { ...basic, ...patch };
    setParams({
      project: next.projects.join(',') || null,
      type: next.types.join(',') || null,
      cat: next.cats.join(',') || null,
      assignee: next.assignees.join(',') || null,
    });
  };
  const clearBasic = () => {
    setText('');
    pushed.current = '';
    setParams({ q: null, project: null, type: null, cat: null, assignee: null, sort: null });
  };

  // ── JQL ──
  const jqlRef = useRef<JqlInputHandle>(null);
  const [draft, setDraft] = useState(jqlParam);
  useEffect(() => setDraft(jqlParam), [jqlParam]);

  const facets = useQuery({ queryKey: workSearchKeys.facets, queryFn: workSearchApi.facets, staleTime: 60_000 });
  const config = useMemo(() => facetsConfig(facets.data), [facets.data]);

  // Yêu cầu thật gửi đi.
  const req = mode === 'jql'
    ? { jql: jqlParam, q: '' }
    : { jql: basicToJql(basic, basicSort), q: basic.text.trim() };
  const sort = mode === 'jql' ? sortOfJql(jqlParam) : basicSort;

  const results = useInfiniteQuery({
    queryKey: workSearchKeys.results(req.jql, req.q),
    queryFn: ({ pageParam }) => workSearchApi.search({ jql: req.jql, q: req.q, limit: PAGE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.hasMore ? last.offset + last.limit : undefined),
    staleTime: 15_000,
    retry: (n, err) => !jqlErrorOf(err) && n < 2,
  });
  const jqlError = results.isError ? jqlErrorOf(results.error) : null;
  const suggestion = results.isError ? jqlSuggestionOf(results.error) : null;
  const items = useMemo(() => results.data?.pages.flatMap((p) => p.items) ?? [], [results.data]);
  const first = results.data?.pages[0];

  // Nhóm theo dự án (trong những dòng đã tải), giữ thứ tự sắp xếp trong nhóm.
  const groups = useMemo(() => {
    if (!grouped) return null;
    const m = new Map<number, GlobalIssueHit[]>();
    for (const it of items) m.set(it.project.id, [...(m.get(it.project.id) ?? []), it]);
    return [...m.values()];
  }, [grouped, items]);
  const ordered = useMemo(() => (groups ? groups.flat() : items), [groups, items]);

  // ── Sắp xếp theo đầu cột ──
  const onSort = (col: SortCol) => {
    const s = nextSort(sort, col);
    if (mode === 'jql') {
      const q = jqlWithSort(jqlParam, s);
      setParams({ jql: q, mode: 'jql' });
    } else setParams({ sort: `${s.col}.${s.dir}` });
  };

  // ── Đổi chế độ: Basic → JQL mang theo bộ lọc; JQL → Basic giữ tham số Basic cũ ──
  const switchMode = (m: 'basic' | 'jql') => {
    if (m === mode) return;
    if (m === 'jql') setParams({ mode: 'jql', jql: basicToJql({ ...basic, text }, basicSort, true) || null }, true);
    else setParams({ mode: null, jql: null }, true);
  };

  // ── Bàn phím: J/K, Enter, / ──
  const [hi, setHi] = useState(-1);
  const rowsRef = useRef<HTMLDivElement>(null);
  useEffect(() => setHi(-1), [req.jql, req.q]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented || isTyping(e.target)) return;
      if (e.key === '/') {
        e.preventDefault();
        if (mode === 'jql') jqlRef.current?.focus();
        else textRef.current?.focus();
        return;
      }
      if (!ordered.length) return;
      if (e.key === 'j' || e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(h + 1, ordered.length - 1)); }
      else if (e.key === 'k' || e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(h - 1, 0)); }
      else if (e.key === 'Enter' && hi >= 0 && ordered[hi] && !(e.target as HTMLElement).closest?.('a,button')) { e.preventDefault(); router.push(ordered[hi].url); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [ordered, hi, mode, router]);
  useEffect(() => {
    if (hi < 0) return;
    rowsRef.current?.querySelector<HTMLElement>(`[data-row="${hi}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [hi]);

  const filtered = mode === 'jql' ? !!jqlParam.trim() : hasBasicFilters(basic);
  const total = first?.total ?? 0;
  const searchingText = mode === 'basic' && (text !== basic.text || (results.isFetching && !results.isFetchingNextPage));

  let rowIndex = 0;
  const renderRows = (list: GlobalIssueHit[]) => list.map((it) => {
    const i = rowIndex++;
    return <ResultRow key={it.id} it={it} index={i} highlighted={i === hi} onHover={() => hi !== i && setHi(i)} />;
  });

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PageHeader
        title="Search issues"
        sub="Across all your projects"
        actions={<HelpButton />}
      />

      {/* Thanh truy vấn */}
      <div className="flex shrink-0 flex-col gap-2 border-b border-[var(--w-border)] px-3 py-2.5 md:px-4">
        {/* Điện thoại: công tắc Basic|JQL lên đầu, ô truy vấn chiếm trọn bề ngang. */}
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start">
          {mode === 'jql' ? (
            <JqlInput
              ref={jqlRef}
              className="min-w-0 flex-1"
              value={draft}
              onChange={setDraft}
              onRun={(v) => setParams({ mode: 'jql', jql: v || null }, v !== jqlParam)}
              config={config}
              error={jqlError}
              ranQuery={jqlParam}
              placeholder='e.g. project IN (SHOP, QA) AND assignee = currentUser() ORDER BY updated DESC'
            />
          ) : (
            <BasicFilters
              ref={textRef}
              facets={facets.data}
              state={basic}
              text={text}
              onText={setText}
              onChange={setBasic}
              onClear={clearBasic}
            />
          )}
          <div className="order-first shrink-0 sm:order-none">
          <Segmented
            label="Search mode"
            value={mode}
            onChange={switchMode}
            options={[{ value: 'basic', label: 'Basic', icon: ListFilter }, { value: 'jql', label: 'JQL', icon: Code2 }]}
          />
          </div>
        </div>
        {mode === 'jql' && suggestion && jqlError && (
          <div className="flex items-center gap-2 text-[12px]">
            <button
              type="button"
              className="w-btn w-btn-sm"
              onClick={() => {
                const next = applySuggestion(jqlParam, jqlError.position, suggestion);
                setDraft(next);
                setParams({ mode: 'jql', jql: next });
              }}
            >
              <Wand2 size={12} /> Use {suggestion}
            </button>
            <span className="text-[var(--w-text-3)]">Replace the highlighted value and search again.</span>
          </div>
        )}
      </div>

      {/* Dòng tóm tắt */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-[var(--w-border)] px-3 text-[12.5px] text-[var(--w-text-2)] md:px-4">
        <span className="flex min-w-0 items-center gap-2 truncate" aria-live="polite">
          {results.isLoading ? (
            <span className="text-[var(--w-text-3)]">Searching…</span>
          ) : first ? (
            <>
              <span className="font-medium tabular-nums text-[var(--w-text)]">{total.toLocaleString('en-US')} {total === 1 ? 'issue' : 'issues'}</span>
              <span className="truncate text-[var(--w-text-3)]">
                {filtered ? 'matching' : 'recently updated'} · {first.projectsSearched} {first.projectsSearched === 1 ? 'project' : 'projects'}
                {first.ranked ? ' · best match first' : ''}
              </span>
            </>
          ) : null}
          {searchingText && !results.isLoading && <Spinner size={12} />}
        </span>
        <span className="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setParams({ group: grouped ? null : 'project' })}
            aria-pressed={grouped}
            className={cn('w-btn w-btn-ghost w-btn-sm', grouped && '!bg-[var(--w-accent-soft)] !text-[var(--w-accent-text)]')}
            title={grouped ? 'Show a flat list' : 'Group results by project'}
          >
            {grouped ? <Layers size={13} /> : <Rows3 size={13} />}
            <span className="max-sm:!hidden">{grouped ? 'Grouped by project' : 'Group by project'}</span>
          </button>
        </span>
      </div>
      {first?.truncated && (
        <div className="shrink-0 border-b border-[var(--w-border)] bg-[color-mix(in_srgb,var(--w-yellow)_10%,transparent)] px-4 py-1.5 text-[12px] text-[var(--w-text-2)]">
          You can see more than 200 projects — only the 200 most recently active were searched. Add <span className="font-mono">project = KEY</span> to narrow it down.
        </div>
      )}

      {/* Kết quả */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ResultsHeader sort={sort} onSort={onSort} />
        {results.isLoading ? (
          <SkeletonRows />
        ) : jqlError ? (
          <EmptyState
            title="Fix the query to see results"
            body={mode === 'jql' ? 'Check the highlighted part of your query, or open Syntax help for fields and examples.' : jqlError.message}
          />
        ) : results.isError ? (
          <EmptyState
            title="Couldn't search issues"
            body={workError(results.error)}
            action={<button type="button" className="w-btn" onClick={() => results.refetch()}>Try again</button>}
          />
        ) : !items.length ? (
          filtered ? (
            <EmptyState
              title="No issues match"
              body={mode === 'jql' ? 'Try widening the query: remove a clause, or check the project and status names.' : 'Try different words or remove some filters.'}
              action={mode === 'basic' ? <button type="button" className="w-btn" onClick={clearBasic}>Clear filters</button> : undefined}
            />
          ) : (
            <EmptyState title="No issues yet" body="Issues from every project you can see will show up here." />
          )
        ) : (
          <div ref={rowsRef} role="rowgroup">
            {groups
              ? groups.map((g) => (
                <section key={g[0].project.id} aria-label={g[0].project.name}>
                  <GroupHeading k={g[0].project.key} name={g[0].project.name} workspace={g[0].workspace.name} count={g.length} />
                  {renderRows(g)}
                </section>
              ))
              : renderRows(items)}
            {results.hasNextPage && (
              <div className="flex justify-center py-3">
                <button type="button" className="w-btn w-btn-sm" disabled={results.isFetchingNextPage} onClick={() => results.fetchNextPage()}>
                  {results.isFetchingNextPage && <Spinner size={12} />}
                  Load more
                  <span className="text-[var(--w-text-3)]">· {items.length} of {total.toLocaleString('en-US')}</span>
                </button>
              </div>
            )}
            {!results.hasNextPage && total > items.length && (
              <p className="px-4 py-3 text-center text-[12px] text-[var(--w-text-3)]">Showing the first {items.length.toLocaleString('en-US')} results. Narrow the search to see the rest.</p>
            )}
            <div className="hidden items-center gap-3 px-4 py-3 text-[11px] text-[var(--w-text-3)] md:flex">
              <span className="flex items-center gap-1"><kbd className="w-kbd">J</kbd><kbd className="w-kbd">K</kbd> move</span>
              <span className="flex items-center gap-1"><kbd className="w-kbd">↵</kbd> open</span>
              <span className="flex items-center gap-1"><kbd className="w-kbd">/</kbd> search</span>
              <span className="flex items-center gap-1"><kbd className="w-kbd">⌘</kbd><kbd className="w-kbd">K</kbd> jump anywhere</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
