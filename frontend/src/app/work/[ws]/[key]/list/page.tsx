'use client';

/**
 * CT Work — danh sách thẻ ("Issues").
 *
 * Bộ lọc sống trong query string (?q=&type=&status=&assignee=&label=&done=1)
 * để link một bộ lọc là chia sẻ được; thẻ đang mở là ?issue=NUM để Back đóng
 * được drawer. Trạng thái lọc THEO TÊN (gộp mọi quy trình): chọn "In Progress"
 * là chọn mọi statusId mang tên đó.
 *
 * Chế độ JQL: ?mode=jql&jql=<câu truy vấn>&filter=<id bộ lọc đã lưu>.
 *
 * Như "issue navigator" của Jira: bấm đầu cột để sắp xếp (JQL: viết lại
 * ORDER BY; Basic hoặc cột JQL không sắp được: sắp trên các thẻ đã tải,
 * ?sort=<cột>.<asc|desc>), menu Columns ẩn/hiện cột (localStorage), chọn
 * nhiều dòng ⇒ thanh sửa hàng loạt (cùng API với Backlog).
 */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, ChevronDown, Gauge, Plus, Search, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { workApi, workError, userName, type BulkPatch, type IssueCard, type IssueQuery, type SavedFilter, type StatusCategory } from '@/lib/work-api';
import { CREATE_ISSUE_EVENT, useLookups, useProject, useProjectRealtime, wk } from '@/components/work/hooks';
import {
  EmptyState, IssueTypeIcon, PickerList, Popover, Spinner, UserAvatar,
  isTyping, useToggle, type PickOption, PageLoading} from '@/components/work/ui';
import { ConfirmDialog } from '@/components/work/settings/shared';
import BulkBar from '@/components/work/board/BulkBar';
import { bulkSetStatusByName, type BulkResult } from '@/components/work/board/bulk';
import {
  COLUMN_ORDER, COLUMNS, DEFAULT_COLUMNS, jqlOrder, withOrder, type ColId, type ListCtx,
} from '@/components/work/search/columns';
import DataTable, { type DataColumn } from '@/components/work/table/DataTable';
import IssueDrawer from '@/components/work/IssueDrawer';
import CreateIssueDialog from '@/components/work/CreateIssueDialog';
import { JqlInput, type JqlInputHandle } from '@/components/work/search/JqlInput';
import SavedFilters from '@/components/work/search/SavedFilters';
import ExportMenu from '@/components/work/search/ExportMenu';
import ProjectHeader from '@/components/work/ProjectHeader';
import { basicToJql, jqlErrorOf } from '@/components/work/search/jql';
import { studioOn, useWorkspaceTeams } from '@/components/work/studio/shared';
import { workStudioApi, workStudioKeys } from '@/lib/work-api';
import { AgentLeasesProvider, AssigneeKindFilter, type AssigneeKind } from '@/components/work/agents/leases';
import { wt } from '@/components/work/i18n';
import { statusName } from '@/components/work/i18n/names';

const PAGE = 100;
const ME = -1; // giá trị "Me" trong picker; trên URL là chữ `me`
const CATEGORY_ORDER: Record<StatusCategory, number> = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };

// Lưới: mẫu cột nằm trong biến CSS (--cols-m điện thoại, --cols-d từ md) vì cột ẩn/hiện được.

/** Cột đang hiện — nhớ THEO NGƯỜI (UX-C), đọc lùi khoá cũ theo dự án để không mất lựa chọn đã có. */
function readCols(pid: number, uid: number | undefined): ColId[] {
  try {
    const raw = window.localStorage.getItem(`ctwork:list:${pid}:cols:u${uid ?? 'anon'}`) ?? window.localStorage.getItem(`ctwork:list:${pid}:cols`);
    const v = JSON.parse(raw ?? 'null') as ColId[] | null;
    if (Array.isArray(v)) {
      const ok = v.filter((c) => c in COLUMNS);
      if (ok.length) return ok.includes('title') ? ok : ['title', ...ok];
    }
  } catch { /* cửa sổ riêng tư */ }
  return DEFAULT_COLUMNS;
}

/** Rãnh lưới cũ ('84px' / 'minmax(220px,1fr)') ⇒ độ rộng + cột co giãn cho DataTable. */
function trackWidth(track: string): { width: number; grow: boolean } {
  const m = /minmax\((\d+)px/.exec(track);
  if (m) return { width: Number(m[1]), grow: true };
  return { width: Number.parseInt(track, 10) || 120, grow: false };
}

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
        <PickerList options={options} selected={selected} onPick={onToggle} multi placeholder={wt('issues.filterBy', { what: label.toLowerCase() })} />
      </Popover>
    </>
  );
}

/** Công tắc Basic | JQL. */
function ModeToggle({ mode, onChange }: { mode: 'basic' | 'jql'; onChange: (m: 'basic' | 'jql') => void }) {
  return (
    <div className="inline-flex shrink-0 rounded-[var(--w-radius)] border border-[var(--w-border-strong)] p-0.5" role="tablist" aria-label={wt('issues.searchMode')}>
      {(['basic', 'jql'] as const).map((m) => (
        <button
          key={m}
          type="button"
          role="tab"
          aria-selected={mode === m}
          onClick={() => mode !== m && onChange(m)}
          className={cn(
            'h-[22px] rounded-[4px] px-2 text-[12px] font-medium',
            mode === m ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'text-[var(--w-text-2)] hover:text-[var(--w-text)]',
          )}
        >
          {m === 'basic' ? wt('gs.basic') : 'JQL'}
        </button>
      ))}
    </div>
  );
}

// ─── Trang ───────────────────────────────────────────────────────

export default function IssuesListPage({ params }: { params: { ws: string; key: string } }) {
  return (
    <Suspense fallback={<PageLoading />}>
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
  // Lớp studio (S1): bộ phận (0 = chưa có bộ phận) + giai đoạn — chỉ khi mô-đun bật.
  const teamSel = useMemo(() => (sp?.get('team') ?? '').split(',').filter((x) => x !== '').map(Number).filter((n) => Number.isInteger(n) && n >= 0), [sp]);
  const stageParam = Number(sp?.get('stage'));
  const stageSel = Number.isInteger(stageParam) && stageParam > 0 ? stageParam : null;
  const showDone = sp?.get('done') === '1';
  // CTW-28: ?kind=AGENT|HUMAN — dịch thành danh sách người được giao (không cần tham số mới ở API).
  const kindParam = sp?.get('kind');
  const kindSel: AssigneeKind = kindParam === 'AGENT' || kindParam === 'HUMAN' ? kindParam : 'ALL';
  const jqlMode = sp?.get('mode') === 'jql';
  const jqlParam = sp?.get('jql') ?? '';
  const filterParam = Number(sp?.get('filter'));
  const activeFilterId = Number.isInteger(filterParam) && filterParam > 0 ? filterParam : null;
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
    let assignee = assigneeSel.map((a) => (a === ME ? meId ?? -1 : a)).filter((a) => a >= 0);
    if (kindSel !== 'ALL') {
      const kindIds = (config?.members ?? []).filter((m) => (m.kind === 'AGENT' ? 'AGENT' : 'HUMAN') === kindSel).map((m) => m.id);
      const both = assignee.length ? assignee.filter((a) => kindIds.includes(a)) : kindIds;
      // Giao rỗng ⇒ một id không tồn tại (mảng rỗng = "không lọc" ở API).
      assignee = both.length ? both : [2147483646];
    }
    return {
      q: qParam || undefined,
      type: typeSel.length ? typeSel : undefined,
      status: statusIds.length ? statusIds : undefined,
      assignee: assignee.length ? assignee : undefined,
      label: labelSel.length ? labelSel : undefined,
      team: teamSel.length ? teamSel : undefined,
      stage: stageSel ?? undefined,
      includeDone: showDone || pickedDone,
      limit: PAGE,
    };
  }, [qParam, typeSel, statusSel, statusGroups, assigneeSel, meId, labelSel, teamSel, stageSel, showDone, kindSel, config]);

  const hasFilters = !!(qParam || typeSel.length || statusSel.length || assigneeSel.length || labelSel.length || teamSel.length || stageSel || kindSel !== 'ALL');
  const teamsOn = studioOn(config, 'teams');
  const stagesOn = studioOn(config, 'stages');
  const teamsQ = useWorkspaceTeams(config?.workspace.id, teamsOn);
  const stagesQ = useQuery({ queryKey: workStudioKeys.stages(pid ?? 0), queryFn: () => workStudioApi.stages(pid!), enabled: !!pid && stagesOn, staleTime: 30_000 });
  // Lọc theo trạng thái mà cấu hình chưa về thì chưa dựng được danh sách id — chờ.
  const ready = !!pid && !!config;

  const basicList = useInfiniteQuery({
    queryKey: [...wk.issues(pid ?? 0), query],
    queryFn: ({ pageParam }) => workApi.issues(pid!, { ...query, cursor: (pageParam as string | undefined) || undefined }),
    initialPageParam: '' as string,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    enabled: ready && !jqlMode,
    staleTime: 15_000,
  });

  // ── JQL ──
  const jqlRef = useRef<JqlInputHandle>(null);
  const [jqlDraft, setJqlDraft] = useState(jqlParam);
  // URL đổi từ ngoài (Back, nạp bộ lọc đã lưu) ⇒ đồng bộ lại ô JQL.
  useEffect(() => setJqlDraft(jqlParam), [jqlParam]);
  const jqlList = useInfiniteQuery({
    queryKey: wk.search(pid ?? 0, jqlParam),
    queryFn: ({ pageParam }) => workApi.search(pid!, jqlParam, { limit: PAGE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (last) => (last.offset + last.items.length < last.total ? last.offset + last.items.length : undefined),
    enabled: ready && jqlMode,
    staleTime: 15_000,
    // Lỗi cú pháp thì thử lại cũng vô ích.
    retry: (n, err) => !jqlErrorOf(err) && n < 2,
  });
  const jqlError = jqlMode && jqlList.isError ? jqlErrorOf(jqlList.error) : null;

  // Hai nguồn, một bảng: gom về cùng một hình.
  const list = jqlMode
    ? { data: jqlList.data, isLoading: jqlList.isLoading, isError: jqlList.isError, error: jqlList.error, hasNextPage: jqlList.hasNextPage, isFetchingNextPage: jqlList.isFetchingNextPage, fetchNextPage: () => void jqlList.fetchNextPage(), refetch: () => void jqlList.refetch() }
    : { data: basicList.data, isLoading: basicList.isLoading, isError: basicList.isError, error: basicList.error, hasNextPage: basicList.hasNextPage, isFetchingNextPage: basicList.isFetchingNextPage, fetchNextPage: () => void basicList.fetchNextPage(), refetch: () => void basicList.refetch() };
  const jqlTotal = jqlList.data?.pages[0]?.total;

  const items = useMemo(
    () => (jqlMode ? jqlList.data?.pages.flatMap((p) => p.items) : basicList.data?.pages.flatMap((p) => p.items)) ?? [],
    [jqlMode, jqlList.data, basicList.data],
  );
  // IssueCard chỉ có parentId — tra số của cha trong những thẻ đã tải.
  const numById = useMemo(() => new Map(items.map((i) => [i.id, i.number])), [items]);

  // ── Cột (lưu theo dự án) ──
  const [cols, setColsState] = useState<ColId[]>(DEFAULT_COLUMNS);
  useEffect(() => { if (pid) setColsState(readCols(pid, meId)); }, [pid, meId]);
  const setCols = (c: ColId[]) => {
    const next = (c.includes('title') ? c : ['title', ...c]) as ColId[];
    setColsState(next);
    try { window.localStorage.setItem(`ctwork:list:${pid}:cols:u${meId ?? 'anon'}`, JSON.stringify(next)); } catch { /* bỏ qua */ }
  };
  const versionsQ = useQuery({
    queryKey: wk.versions(pid ?? 0),
    queryFn: () => workApi.versions(pid!),
    enabled: !!pid && cols.includes('fixVersion'),
    staleTime: 60_000,
  });
  const today = todayLocal();
  const ctx = useMemo<ListCtx | null>(() => (config ? {
    lk, config, today,
    versionName: (id) => (id ? versionsQ.data?.find((v) => v.id === id)?.name ?? '' : ''),
    parentNum: (i) => (i.parentId ? numById.get(i.parentId) ?? i.parentNumber ?? undefined : undefined),
  } : null), [lk, config, today, versionsQ.data, numById]);

  // ── Sắp xếp ──
  const sortParam = sp?.get('sort') ?? '';
  const clientSort = useMemo(() => {
    const [col, dir] = sortParam.split('.');
    return col && col in COLUMNS ? { col: col as ColId, dir: dir === 'desc' ? 'desc' as const : 'asc' as const } : null;
  }, [sortParam]);
  const jqlSort = useMemo(() => {
    if (!jqlMode) return null;
    const o = jqlOrder(jqlParam);
    const col = (Object.keys(COLUMNS) as ColId[]).find((c) => COLUMNS[c].jql === o.field);
    return o.field && col ? { col, dir: o.dir } : null;
  }, [jqlMode, jqlParam]);
  const sortState = clientSort ?? jqlSort;
  const onSort = (col: ColId) => {
    const cur = sortState?.col === col ? sortState.dir : null;
    const dir: 'asc' | 'desc' = cur === 'asc' ? 'desc' : 'asc';
    const field = COLUMNS[col].jql;
    if (jqlMode && field) {
      // JQL: sắp ở server — viết lại ORDER BY rồi chạy lại.
      setParams({ mode: 'jql', jql: withOrder(jqlParam, field, dir), sort: null });
    } else {
      setParams({ sort: `${col}.${dir}` });
    }
  };
  const rows = useMemo(() => {
    if (!clientSort || !ctx) return items;
    const def = COLUMNS[clientSort.col];
    const sorted = [...items].sort((a, b) => def.cmp(a, b, ctx) || a.number - b.number);
    return clientSort.dir === 'desc' ? sorted.reverse() : sorted;
  }, [items, clientSort, ctx]);

  // ── Cột cho bảng chung (UX-C) ──
  const tableColumns = useMemo<DataColumn<IssueCard>[]>(() => (ctx ? COLUMN_ORDER.map((c) => {
    const def = COLUMNS[c];
    const t = trackWidth(def.track);
    return {
      id: c,
      header: c === 'type' ? wt('common.type') : def.label,
      width: t.width,
      grow: t.grow,
      minWidth: Math.min(def.min, t.width),
      align: def.align,
      required: !!def.fixed,
      hideBelow: def.mobile ? undefined : 'md' as const,
      // Điện thoại: rãnh hẹp để tiêu đề còn chỗ (như gridTemplates cũ — người chỉ còn avatar).
      narrowWidth: ({ type: 28, key: 64, title: 140, status: 104, assignee: 36 } as Partial<Record<ColId, number>>)[c],
      sortable: true,
      export: false,
      headerTitle: `${wt('issues.sortBy', { col: def.label.toLowerCase() })}${jqlMode && def.jql ? wt('issues.sortJql') : jqlMode ? wt('issues.sortLoaded') : ''}`,
      cell: (i: IssueCard) => def.cell(i, ctx),
    };
  }) : []), [ctx, jqlMode]);
  const [controlsEl, setControlsEl] = useState<HTMLElement | null>(null);

  // ── Chọn nhiều + sửa hàng loạt ──
  const qc = useQueryClient();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const lastPicked = useRef<number | null>(null);
  // So theo NỘI DUNG truy vấn: mảng lọc có thể là object mới mỗi lần render, và
  // `new Set()` luôn là giá trị mới ⇒ so theo tham chiếu sẽ lặp render vô hạn
  // (bộ kiểm dựng trang trong app desktop treo đúng chỗ này).
  const queryKeyStr = JSON.stringify(query);
  useEffect(() => setSelected((s) => (s.size ? new Set() : s)), [queryKeyStr, jqlParam, jqlMode]);
  const toggleRow = (id: number, shift: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (shift && lastPicked.current !== null) {
        const a = rows.findIndex((r) => r.id === lastPicked.current);
        const b = rows.findIndex((r) => r.id === id);
        if (a !== -1 && b !== -1) {
          rows.slice(Math.min(a, b), Math.max(a, b) + 1).forEach((r) => next.add(r.id));
          return next;
        }
      }
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    lastPicked.current = id;
  };
  const [bulkDelete, setBulkDelete] = useState(false);
  const bulk = useMutation({
    mutationFn: async (v: { patch?: BulkPatch; status?: string; label: string }): Promise<BulkResult & { label: string }> => {
      const picked = items.filter((i) => selected.has(i.id));
      const r = v.status
        ? await bulkSetStatusByName(pid!, lk, picked, v.status)
        : await workApi.bulkUpdate(pid!, picked.map((i) => i.number), v.patch ?? {});
      return { ...r, label: v.label };
    },
    onSuccess: (r) => {
      if (r.updated.length) toast.success(wt('backlog.bulkDone', { count: r.updated.length, label: r.label }));
      if (r.failed.length) toast.error(wt('backlog.bulkFailed', { count: r.failed.length, list: r.failed.slice(0, 3).map((f) => `${lk.issueKey(f.number)} (${f.error})`).join(', ') }));
      const failedNums = new Set(r.failed.map((f) => f.number));
      setSelected(new Set(items.filter((i) => failedNums.has(i.number)).map((i) => i.id)));
      for (const k of [wk.issues(pid!), wk.board(pid!), wk.backlog(pid!)]) qc.invalidateQueries({ queryKey: k });
    },
    onError: (err) => toast.error(workError(err, wt('backlog.bulkFailedAll'))),
  });

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
  useEffect(() => setHi(-1), [queryKeyStr, jqlParam, jqlMode]);

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
        if (hi >= 0 && rows[hi]) {
          e.preventDefault();
          openIssue(rows[hi].number);
        }
      } else if (k === 'x') {
        if (hi >= 0 && rows[hi]) {
          e.preventDefault();
          toggleRow(rows[hi].id, false);
        }
      } else if (k === 'Escape' && selected.size) {
        setSelected(new Set());
      } else if (k === 'c') {
        if (!canCreate) return;
        e.preventDefault();
        setCreateOpen(true);
      } else if (k === '/') {
        e.preventDefault();
        if (jqlMode) {
          jqlRef.current?.focus();
        } else {
          searchRef.current?.focus();
          searchRef.current?.select();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- toggleRow đổi mỗi lần render
  }, [items, rows, hi, createOpen, openNum, canCreate, openIssue, jqlMode, selected.size]);

  // ── Lựa chọn cho picker ──
  const typeOptions = useMemo<PickOption<number>[]>(
    () => (config?.issueTypes ?? []).map((t) => ({ value: t.id, label: t.name, icon: <IssueTypeIcon type={t} size={12} /> })),
    [config],
  );
  const statusOptions = useMemo<PickOption<string>[]>(
    () =>
      statusGroups.map((g) => ({
        value: g.name,
        label: statusName(g.name),
        icon: <span className="h-2 w-2 rounded-full" style={{ background: g.color }} />,
        hint: g.category === 'DONE' ? wt('status.catDone') : g.category === 'IN_PROGRESS' ? wt('status.catInProgress') : wt('status.catTodo'),
      })),
    [statusGroups],
  );
  const assigneeOptions = useMemo<PickOption<number>[]>(
    () => [
      { value: ME, label: wt('common.me'), icon: <UserAvatar user={config?.members.find((m) => m.id === meId)} size={16} />, keywords: 'myself current' },
      { value: 0, label: wt('common.unassigned'), icon: <UserAvatar user={null} size={16} />, keywords: 'nobody none' },
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
    setParams({ q: null, type: null, status: null, assignee: null, label: null, team: null, stage: null, kind: null });
  };

  const summaryOf = (labels: string[]) => (labels.length === 1 ? `· ${labels[0]}` : `· ${labels.length}`);

  // Bộ lọc cơ bản đang chọn ⇒ JQL tương đương (sang JQL không mất bộ lọc).
  const currentBasicJql = () =>
    [basicToJql({
      q: qParam,
      typeNames: typeSel.map((id) => lk.types.get(id)?.name).filter((x): x is string => !!x),
      statusNames: statusSel,
      assignees: assigneeSel.map((a) => (a === ME ? 'me' : a === 0 ? 'none' : lk.members.get(a)?.username ?? '')).filter(Boolean),
      labelNames: labelSel.map((id) => lk.labels.get(id)?.name).filter((x): x is string => !!x),
      includeDone: showDone,
    }), studioJql()].filter(Boolean).join(' AND ');

  // JQL có `team` / `stage` (S1) — basicToJql chưa biết hai trường này.
  const studioJql = () => {
    const parts: string[] = [];
    const named = teamSel.filter((id) => id > 0).map((id) => teamsQ.data?.find((t) => t.id === id)?.key).filter((x): x is string => !!x);
    const one = named.length === 1 ? `team = ${named[0]}` : named.length ? `team IN (${named.join(', ')})` : '';
    if (teamSel.includes(0)) parts.push(one ? `(${one} OR team IS EMPTY)` : 'team IS EMPTY');
    else if (one) parts.push(one);
    const st = stagesQ.data?.find((x) => x.id === stageSel);
    if (st) parts.push(`stage = ${st.slug}`);
    if (kindSel !== 'ALL') parts.push(`assigneeKind = ${kindSel}`);
    return parts.join(' AND ');
  };

  const setMode = (m: 'basic' | 'jql') => {
    if (m === 'jql') setParams({ mode: 'jql', jql: jqlParam || currentBasicJql() || null });
    else setParams({ mode: null, jql: null, filter: null });
  };
  const runJql = (q: string) => setParams({ mode: 'jql', jql: q || null });
  const loadFilter = (f: SavedFilter) => setParams({ mode: 'jql', jql: f.query || null, filter: String(f.id) });

  // ── Trạng thái tải trang ──
  if (projectError) {
    return (
      <div className="h-full overflow-y-auto">
        <EmptyState title={wt('common.projectNotFound')} body={wt('common.notFoundBody')} />
      </div>
    );
  }
  if (projectLoading || !config) {
    return <PageLoading />;
  }

  const countLabel = list.isLoading || list.isError ? '' : jqlMode && jqlTotal !== undefined ? String(jqlTotal) : `${items.length}${list.hasNextPage ? '+' : ''}`;
  const canBulk = config.permissions.editIssues || config.permissions.transition || config.permissions.deleteIssues;

  return (
    <AgentLeasesProvider config={config}>
    <div className="flex h-full min-w-0 flex-col">
      {/* Thanh đầu — cùng khung ProjectHeader với mọi trang dự án */}
      <ProjectHeader
        config={config}
        title={wt('issues.title')}
        tools={false}
        extra={countLabel ? <span className="w-count">{countLabel}</span> : undefined}
      >
        <ModeToggle mode={jqlMode ? 'jql' : 'basic'} onChange={setMode} />
        <SavedFilters
          config={config}
          activeId={activeFilterId}
          query={jqlMode ? jqlDraft.trim() : currentBasicJql()}
          onLoad={loadFilter}
          onSaved={loadFilter}
        />
        <ExportMenu pid={config.id} getJql={() => (jqlMode ? jqlParam : currentBasicJql())} />
        {/* Đợt S6: chấm chất lượng đặc tả của thẻ Requirement/Story (trang Spec quality). */}
        {['ADMIN', 'MEMBER', 'TEACHER'].includes(config.role) && (
          <Link href={`/work/${config.workspace.slug}/${config.key}/spec`} className="w-btn w-btn-sm" title={wt('issues.specTitle')} data-testid="list-spec-check">
            <Gauge size={13} /> <span className="max-lg:!hidden">{wt('issues.spec')}</span>
          </Link>
        )}
        {canCreate && (
          <button type="button" className="w-btn w-btn-primary w-btn-sm" onClick={() => setCreateOpen(true)} title={wt('board.createIssue')}>
            <Plus size={14} /> <span className="max-sm:!hidden">{wt('board.createIssue')}</span>
            <kbd className="ml-1 hidden rounded-[3px] bg-white/20 px-1 text-[10px] font-medium leading-[16px] md:inline">C</kbd>
          </button>
        )}
      </ProjectHeader>

      {/* Thanh lọc */}
      {jqlMode ? (
        <div className="flex shrink-0 items-start gap-2 border-b border-[var(--w-border)] px-3 py-2 md:px-4">
          <div className="min-w-0 flex-1">
          <JqlInput
            ref={jqlRef}
            value={jqlDraft}
            onChange={setJqlDraft}
            onRun={runJql}
            config={config}
            error={jqlError}
            ranQuery={jqlParam}
          />
          </div>
          <span ref={setControlsEl} className="flex shrink-0 items-center pt-0.5" />
        </div>
      ) : (
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
            placeholder={wt('issues.searchPh')}
            aria-label={wt('issues.searchAria')}
            className="w-input !h-[28px] !pl-7 !pr-7 !text-[12.5px]"
          />
          {search ? (
            <button type="button" onClick={() => setSearch('')} className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--w-text-3)] hover:text-[var(--w-text)]" aria-label={wt('issues.clearSearch')}>
              <X size={12} />
            </button>
          ) : (
            <kbd className="w-kbd pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 max-sm:!hidden">/</kbd>
          )}
        </div>
        <FilterButton
          label={wt('common.type')}
          options={typeOptions}
          selected={typeSel}
          onToggle={(v) => setParams({ type: joinOrNull(toggleIn(typeSel, v)) })}
          summary={summaryOf(typeSel.map((id) => lk.types.get(id)?.name ?? '?'))}
        />
        <FilterButton
          label={wt('common.status')}
          options={statusOptions}
          selected={statusSel}
          onToggle={(v) => setParams({ status: joinOrNull(toggleIn(statusSel, v)) })}
          summary={summaryOf(statusSel.map(statusName))}
        />
        <FilterButton
          label={wt('common.assignee')}
          options={assigneeOptions}
          selected={assigneeSel}
          onToggle={(v) => setParams({ assignee: joinOrNull(toggleIn(assigneeSel, v).map((a) => (a === ME ? 'me' : a))) })}
          summary={summaryOf(assigneeSel.map((a) => (a === ME ? wt('common.me') : a === 0 ? wt('common.unassigned') : userName(lk.members.get(a)))))}
        />
        {labelOptions.length > 0 && (
          <FilterButton
            label={wt('issues.label')}
            options={labelOptions}
            selected={labelSel}
            onToggle={(v) => setParams({ label: joinOrNull(toggleIn(labelSel, v)) })}
            summary={summaryOf(labelSel.map((id) => lk.labels.get(id)?.name ?? '?'))}
          />
        )}
        {teamsOn && (teamsQ.data?.length ?? 0) > 0 && (
          <FilterButton
            label={wt('board.team')}
            options={[{ value: 0, label: wt('board.noTeam') }, ...(teamsQ.data ?? []).filter((t) => !t.archivedAt).map((t) => ({ value: t.id, label: t.name, hint: t.key, keywords: t.key, icon: <span className="h-2 w-2 rounded-full" style={{ background: t.color }} /> }))]}
            selected={teamSel}
            onToggle={(v) => setParams({ team: joinOrNull(toggleIn(teamSel, v)) })}
            summary={summaryOf(teamSel.map((id) => (id === 0 ? wt('board.noTeam') : teamsQ.data?.find((t) => t.id === id)?.key ?? '?')))}
          />
        )}
        {stagesOn && (stagesQ.data?.length ?? 0) > 0 && (
          <FilterButton
            label={wt('issues.stage')}
            options={(stagesQ.data ?? []).map((st) => ({ value: st.id, label: `${st.n}. ${st.name}`, keywords: st.slug }))}
            selected={stageSel ? [stageSel] : []}
            onToggle={(v) => setParams({ stage: v === stageSel ? null : String(v) })}
            summary={stageSel ? `· ${stagesQ.data?.find((x) => x.id === stageSel)?.n ?? '?'}` : undefined}
          />
        )}
        {config && <AssigneeKindFilter config={config} value={kindSel} onChange={(v) => setParams({ kind: v === 'ALL' ? null : v })} />}
        <label className="ml-1 flex h-[26px] cursor-pointer select-none items-center gap-1.5 rounded-[6px] px-1.5 text-[12px] text-[var(--w-text-2)] hover:bg-[var(--w-hover)]">
          <input
            type="checkbox"
            checked={showDone}
            onChange={(e) => setParams({ done: e.target.checked ? '1' : null })}
            className="h-3.5 w-3.5 accent-[var(--w-accent)]"
          />
          {wt('issues.showDone')}
        </label>
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="w-btn w-btn-ghost w-btn-sm">
            <X size={12} /> {wt('issues.clearFilters')}
          </button>
        )}
        <span ref={setControlsEl} className="ml-auto flex items-center" />
      </div>
      )}

      {/* Bảng — UX-C: DataTable chung (tiêu đề dính, cột ghim, đổi độ rộng, mật độ, cuộn ảo cho hàng nghìn dòng,
          ARIA grid + bàn phím). Sắp xếp vẫn do trang điều khiển: JQL ⇒ viết lại ORDER BY (máy chủ), Basic ⇒ trên thẻ đã tải. */}
      {jqlError ? (
        <div className="min-h-0 flex-1 overflow-auto"><EmptyState title={wt('issues.fixQuery')} body={wt('issues.fixQueryBody')} /></div>
      ) : list.isError ? (
        <div className="min-h-0 flex-1 overflow-auto">
          <EmptyState
            title={wt('issues.loadFailed')}
            body={workError(list.error)}
            action={<button type="button" className="w-btn" onClick={() => list.refetch()}>{wt('common.tryAgain')}</button>}
          />
        </div>
      ) : !(list.isLoading || !ready) && !items.length && jqlMode ? (
        <div className="min-h-0 flex-1 overflow-auto">
          <EmptyState title={wt('issues.noMatchQuery')} body={jqlParam ? wt('issues.widenQuery') : wt('issues.noIssuesProject')} />
        </div>
      ) : !(list.isLoading || !ready) && !items.length ? (
        <div className="min-h-0 flex-1 overflow-auto">
          {hasFilters ? (
            <EmptyState
              title={wt('issues.noMatchFilters')}
              body={showDone ? wt('issues.tryDifferent') : wt('issues.tryDifferentDone')}
              action={
                <div className="flex gap-2">
                  <button type="button" className="w-btn" onClick={clearFilters}>{wt('issues.clearFilters')}</button>
                  {!showDone && <button type="button" className="w-btn w-btn-ghost" onClick={() => setParams({ done: '1' })}>{wt('issues.showDone')}</button>}
                </div>
              }
            />
          ) : (
            <EmptyState
              title={showDone ? wt('issues.noIssuesYet') : wt('issues.noOpen')}
              body={showDone ? wt('issues.noIssuesBody') : wt('issues.noOpenBody')}
              action={
                <div className="flex gap-2">
                  {canCreate && (
                    <button type="button" className="w-btn w-btn-primary" onClick={() => setCreateOpen(true)}>
                      <Plus size={14} /> {wt('board.createIssue')}
                    </button>
                  )}
                  {!showDone && <button type="button" className="w-btn" onClick={() => setParams({ done: '1' })}>{wt('issues.showDone')}</button>}
                </div>
              }
            />
          )}
        </div>
      ) : (
        <DataTable
          id={`issues:${config.id}`}
          label={wt('issues.title')}
          rows={rows}
          columns={tableColumns}
          rowKey={(i) => i.id}
          loading={list.isLoading || !ready}
          sort={sortState ? { col: sortState.col, dir: sortState.dir } : null}
          onSortChange={(st) => onSort((st?.col ?? sortState?.col ?? 'key') as ColId)}
          quickFilter={false}
          toolbar={false}
          controlsTarget={controlsEl}
          showCount={false}
          exportable={false}
          pinColumns={2}
          selectable={canBulk}
          selected={selected}
          onSelectedChange={(k) => setSelected(new Set([...k].map(Number)))}
          onRowOpen={(i, idx) => { setHi(idx); openIssue(i.number); }}
          rowActive={(i) => i.number === openNum || rows[hi]?.id === i.id}
          scrollToIndex={hi}
          columnVisibility={{ visible: cols, onChange: (v) => setCols(v as ColId[]) }}
          onEndReached={() => { if (list.hasNextPage && !list.isFetchingNextPage) list.fetchNextPage(); }}
          description={wt('table.keysHint')}
          testId="issues-table"
          footer={(
            <>
              {list.hasNextPage && (
                <div className="flex justify-center py-3">
                  <button type="button" className="w-btn w-btn-sm" disabled={list.isFetchingNextPage} onClick={() => list.fetchNextPage()}>
                    {list.isFetchingNextPage ? <Spinner size={12} /> : null}
                    {wt('issues.loadMore')}
                  </button>
                </div>
              )}
              <div className="hidden items-center gap-3 px-4 py-3 text-[11px] text-[var(--w-text-3)] md:flex">
                <span className="flex items-center gap-1"><kbd className="w-kbd">J</kbd><kbd className="w-kbd">K</kbd> {wt('issues.kMove')}</span>
                <span className="flex items-center gap-1"><kbd className="w-kbd">↵</kbd> {wt('issues.kOpen')}</span>
                {canBulk && <span className="flex items-center gap-1"><kbd className="w-kbd">X</kbd> {wt('issues.kSelect')}</span>}
                {clientSort && list.hasNextPage && <span>{wt('issues.sortedLoaded')}</span>}
                {canCreate && <span className="flex items-center gap-1"><kbd className="w-kbd">C</kbd> {wt('issues.kCreate')}</span>}
                <span className="flex items-center gap-1"><kbd className="w-kbd">/</kbd> {wt('issues.kSearch')}</span>
              </div>
            </>
          )}
        />
      )}

      {selected.size > 0 && (
        <BulkBar
          count={selected.size}
          config={config}
          lk={lk}
          sprints={config.sprints}
          busy={bulk.isPending}
          onPatch={(patch, label) => bulk.mutate({ patch, label })}
          onStatus={(name) => bulk.mutate({ status: name, label: wt('board.movedTo', { name: statusName(name) }) })}
          onClear={() => setSelected(new Set())}
          onDelete={() => setBulkDelete(true)}
        />
      )}
      <ConfirmDialog
        open={bulkDelete}
        onClose={() => setBulkDelete(false)}
        onConfirm={() => { setBulkDelete(false); bulk.mutate({ patch: { delete: true }, label: wt('backlog.deletedLabel') }); }}
        title={wt('backlog.deleteN', { count: selected.size })}
        body={wt('issues.deleteBody')}
        confirmLabel={wt('common.delete')}
        pending={bulk.isPending}
      />

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
    </AgentLeasesProvider>
  );
}
