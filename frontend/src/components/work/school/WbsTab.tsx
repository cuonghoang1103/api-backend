'use client';

/**
 * A3 — WBS + ước lượng (đợt 3B), LÀM LẠI ở UX-C (11/10/2026).
 *
 * Cây epic → story → sub-task đánh số 1.0 / 1.1 / 1.1.1 như sheet WBS của Report2_Project Tracking. Rà soát 09/10 chấm
 * 2,5/5: bảng 12 cột mà ô nào cũng là ô nhập, cột Status bị cắt. Bản này:
 *   · XEM chỉ đọc mặc định, BẤM ô để sửa tại chỗ (Enter/rời ô = lưu, Esc = huỷ) — độ phức tạp ⇒ man-day theo bảng quy
 *     đổi, effort dự kiến ghi đè (theo NGÀY hoặc GIỜ), thực tế từ worklog (chỉ đọc);
 *   · cây gập/mở từng nhánh (nhớ theo dự án), "Mở hết / Gập hết";
 *   · kéo-thả đổi thứ tự hoặc đổi cha (thả lên nửa trên/dưới = trước/sau, giữa = vào trong) — và bằng bàn phím:
 *     Alt+↑/↓ đổi thứ tự, Alt+→ thụt vào (vào anh liền trên), Alt+← nhô ra; mọi lần đổi qua applyIssueChange (lịch sử);
 *   · tổng theo NHÁNH (Σ ở dòng cha) và theo ITERATION; cột Status không bị cắt;
 *   · chế độ Gantt nhỏ theo nhánh (thanh tóm tắt cho epic/story có con);
 *   · ≤ 640px: chế độ thẻ.
 * Xuất .xlsx đúng mẫu SEP490 như cũ (máy chủ dựng — không đổi).
 */

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type DragEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, ChevronsDownUp, ChevronsUpDown, Download, GanttChart, GripVertical, Settings2, Table2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { workError, workErrorStatus } from '@/lib/work-api';
import { Dialog, EmptyState, PageLoading, Spinner } from '../ui';
import KpiTile, { KpiRow } from '../KpiTile';
import { COMPLEXITIES, days, schoolApi, schoolKeys, WBS_KINDS, type Complexity, type EstimationMatrix, type WbsData, type WbsItemInput, type WbsRow } from './schoolApi';
import { branchSpans, planDrop, siblingsOf, visibleTree, type DropPos } from './wbsLogic';
import { wt, wfmt } from '@/components/work/i18n';

type Unit = 'days' | 'hours';
type View = 'table' | 'gantt';
type EditField = 'kind' | 'feature' | 'fields' | 'transactions' | 'complexity' | 'planned';
const DAY_MS = 86_400_000;
const toDay = (s: string) => Math.floor(Date.parse(`${s}T00:00:00Z`) / DAY_MS);

const STATUS_TONE: Record<string, string> = {
  Pending: 'var(--w-text-3)', Planned: 'var(--w-accent)', Analyzed: 'var(--w-yellow)', Coded: 'var(--w-orange)',
  Integrated: 'var(--w-chart-3, var(--w-accent))', Tested: 'var(--w-green)', Cancelled: 'var(--w-text-3)',
};

function readPref<T>(key: string, fallback: T): T {
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch { return fallback; }
}
function writePref(key: string, v: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(v)); } catch { /* riêng tư — bỏ qua */ }
}

export default function WbsTab({ pid, onOpenIssue }: { pid: number; onOpenIssue: (n: number) => void }) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: schoolKeys.wbs(pid), queryFn: () => schoolApi.wbs(pid) });
  const [matrixOpen, setMatrixOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [onlyLeaves, setOnlyLeaves] = useState(false);
  const prefKey = `ctwork:wbs:${pid}`;
  const [collapsed, setCollapsed] = useState<Set<number>>(new Set());
  const [view, setView] = useState<View>('table');
  const [unit, setUnit] = useState<Unit>('days');
  useEffect(() => {
    const p = readPref<{ collapsed?: number[]; view?: View; unit?: Unit }>(prefKey, {});
    setCollapsed(new Set(p.collapsed ?? []));
    if (p.view === 'gantt' || p.view === 'table') setView(p.view);
    if (p.unit === 'hours' || p.unit === 'days') setUnit(p.unit);
  }, [prefKey]);
  const savePrefs = useCallback((patch: { collapsed?: Set<number>; view?: View; unit?: Unit }) => {
    const cur = readPref<{ collapsed?: number[]; view?: View; unit?: Unit }>(prefKey, {});
    writePref(prefKey, { ...cur, ...patch, ...(patch.collapsed ? { collapsed: [...patch.collapsed] } : {}) });
  }, [prefKey]);
  const [editing, setEditing] = useState<{ id: number; field: EditField } | null>(null);
  const [drag, setDrag] = useState<{ num: number; over: { num: number; pos: DropPos; ok: boolean } | null } | null>(null);
  const [moving, setMoving] = useState(false);
  const [focusNum, setFocusNum] = useState<number | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(1200);
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBoxW(el.clientWidth));
    ro.observe(el);
    setBoxW(el.clientWidth);
    return () => ro.disconnect();
  }, [q.data]);

  const data = q.data;
  const allRows = useMemo(() => data?.rows ?? [], [data]);
  const rows = useMemo(() => (onlyLeaves ? allRows.filter((r) => !r.childCount) : visibleTree(allRows, collapsed)), [allRows, onlyLeaves, collapsed]);
  const spans = useMemo(() => branchSpans(allRows), [allRows]);
  const canDrag = !!data?.canEdit && !onlyLeaves && allRows.every((r) => r.level !== undefined);
  const hpd = data?.matrix.hoursPerDay ?? 8;
  const fmtEffort = useCallback((d: number | null | undefined) => {
    if (d === null || d === undefined) return '';
    return unit === 'hours' ? wfmt.number(Math.round(d * hpd * 10) / 10) : days(d);
  }, [unit, hpd]);

  const toggle = (id: number) => setCollapsed((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    savePrefs({ collapsed: n });
    return n;
  });
  const setAll = (open: boolean) => {
    const n = open ? new Set<number>() : new Set(allRows.filter((r) => r.childCount > 0).map((r) => r.issueId));
    setCollapsed(n);
    savePrefs({ collapsed: n });
  };

  const patch = async (r: WbsRow, body: WbsItemInput) => {
    try {
      const res = await schoolApi.setItem(pid, r.number, body);
      qc.setQueryData<WbsData>(schoolKeys.wbs(pid), (old) => old && res.row ? { ...old, totals: res.totals, rows: old.rows.map((x) => (x.issueId === res.row!.issueId ? res.row! : x)) } : old);
      // Cha cộng dồn effort của con ⇒ tải lại cả cây cho số ở dòng cha đúng.
      qc.invalidateQueries({ queryKey: schoolKeys.wbs(pid) });
    } catch (e) { toast.error(workError(e, wt('common.couldNotSave'))); }
  };

  const move = async (r: WbsRow, body: { parentNumber: number | null; beforeNumber?: number; afterNumber?: number }) => {
    setMoving(true);
    try {
      await schoolApi.moveItem(pid, r.number, body);
      await qc.invalidateQueries({ queryKey: schoolKeys.wbs(pid) });
      setFocusNum(r.number);
      // Thả vào trong một nhánh đang gập ⇒ mở nhánh đó để thấy kết quả.
      if (body.parentNumber !== null) {
        const parent = allRows.find((x) => x.number === body.parentNumber);
        if (parent && collapsed.has(parent.issueId)) toggle(parent.issueId);
      }
    } catch (e) {
      toast.error(workErrorStatus(e) === 409 ? wt('uxc.wbsChanged') : workError(e, wt('uxc.wbsMoveFailed')));
      qc.invalidateQueries({ queryKey: schoolKeys.wbs(pid) });
    } finally { setMoving(false); }
  };

  // Bàn phím trên dòng: ↑↓ di chuyển, ←→ gập/mở, Enter mở thẻ, Alt+mũi tên = đổi thứ tự / cấp.
  const rowKey = (e: ReactKeyboardEvent<HTMLDivElement>, r: WbsRow, idx: number) => {
    if (e.target !== e.currentTarget) return;
    const focusRow = (k: number) => boxRef.current?.querySelector<HTMLElement>(`[data-wbs-row="${rows[k]?.number}"]`)?.focus();
    if (e.altKey && canDrag && !moving) {
      const sib = siblingsOf(allRows, r);
      const k = sib.findIndex((x) => x.number === r.number);
      let plan: ReturnType<typeof planDrop> = null;
      if (e.key === 'ArrowUp' && k > 0) plan = planDrop(allRows, r, sib[k - 1], 'before');
      else if (e.key === 'ArrowDown' && k < sib.length - 1) plan = planDrop(allRows, r, sib[k + 1], 'after');
      else if (e.key === 'ArrowRight' && k > 0) plan = planDrop(allRows, r, sib[k - 1], 'into');
      else if (e.key === 'ArrowLeft' && r.parentNumber != null) {
        const parent = allRows.find((x) => x.number === r.parentNumber);
        if (parent) plan = planDrop(allRows, r, parent, 'after');
      }
      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        if (plan) void move(r, plan);
        else toast.message(wt('uxc.wbsCantMove'));
      }
      return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); focusRow(Math.min(rows.length - 1, idx + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusRow(Math.max(0, idx - 1)); }
    else if (e.key === 'ArrowRight' && r.childCount && collapsed.has(r.issueId)) { e.preventDefault(); toggle(r.issueId); }
    else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (r.childCount && !collapsed.has(r.issueId)) toggle(r.issueId);
      else if (r.parentNumber != null) boxRef.current?.querySelector<HTMLElement>(`[data-wbs-row="${r.parentNumber}"]`)?.focus();
    } else if (e.key === 'Enter') { e.preventDefault(); onOpenIssue(r.number); }
  };
  useEffect(() => {
    if (focusNum === null) return;
    const el = boxRef.current?.querySelector<HTMLElement>(`[data-wbs-row="${focusNum}"]`);
    if (el) { el.focus(); setFocusNum(null); }
  });

  // Kéo-thả chuột (HTML5): vị trí thả theo nửa trên / giữa / nửa dưới của dòng đích.
  const onDragOver = (e: DragEvent<HTMLDivElement>, target: WbsRow) => {
    if (!drag) return;
    const dragged = allRows.find((x) => x.number === drag.num);
    if (!dragged) return;
    const box = e.currentTarget.getBoundingClientRect();
    const y = (e.clientY - box.top) / box.height;
    const pos: DropPos = y < 0.3 ? 'before' : y > 0.7 ? 'after' : 'into';
    const ok = !!planDrop(allRows, dragged, target, pos);
    if (ok) e.preventDefault();
    if (drag.over?.num !== target.number || drag.over.pos !== pos || drag.over.ok !== ok) setDrag({ ...drag, over: { num: target.number, pos, ok } });
  };
  const onDrop = (e: DragEvent<HTMLDivElement>, target: WbsRow) => {
    e.preventDefault();
    const d = drag;
    setDrag(null);
    if (!d?.over?.ok) return;
    const dragged = allRows.find((x) => x.number === d.num);
    const plan = dragged ? planDrop(allRows, dragged, target, d.over.pos) : null;
    if (dragged && plan) void move(dragged, plan);
  };

  // Gantt: khoảng hiển thị bao mọi nhánh + hôm nay.
  const gantt = useMemo(() => {
    let lo = Infinity, hi = -Infinity;
    for (const s of spans.values()) { lo = Math.min(lo, toDay(s.start)); hi = Math.max(hi, toDay(s.end)); }
    const today = toDay(new Date().toISOString().slice(0, 10));
    if (!Number.isFinite(lo)) { lo = today - 7; hi = today + 21; }
    lo = Math.min(lo, today) - 2;
    hi = Math.max(hi, today) + 3;
    const months: Array<{ x: number; label: string }> = [];
    for (let d = lo; d <= hi; d++) {
      const dt = new Date(d * DAY_MS);
      if (dt.getUTCDate() === 1 || d === lo) months.push({ x: (d - lo) / (hi - lo + 1), label: dt.toLocaleDateString(wfmt.intl(), { month: 'short', year: '2-digit', timeZone: 'UTC' }) });
    }
    return { lo, hi, span: hi - lo + 1, today, months };
  }, [spans]);

  if (q.isLoading) return <PageLoading />;
  if (!data) return <EmptyState title={wt('school.wbsLoadFailed')} body={q.error ? workError(q.error) : undefined} />;

  const t = data.totals;
  const narrow = boxW < 640;
  const unitLabel = unit === 'hours' ? wt('uxc.unitHours') : wt('uxc.unitDays');
  // Cột: # · Hạng mục · (bảng) Loại · Feature · Fields · Trans · Mức · Dự kiến · Thực tế · Iteration · Trạng thái · Phụ trách
  //                     (Gantt) Dự kiến · Thực tế · Trạng thái · dòng thời gian
  const tableCols = view === 'table'
    // Trạng thái đứng NGAY sau tên (rà soát 09/10: cột Status cuối bảng bị cắt ở 1440).
    ? '28px 64px minmax(220px,1fr) 108px 88px 120px 84px 84px 104px 120px 56px 56px 120px'
    : '28px 64px minmax(220px,1fr) 108px 84px 84px minmax(320px,1.4fr)';
  const minW = view === 'table' ? 1240 : 1080;
  const unitShort = unit === 'hours' ? wt('uxc.unitHoursShort') : wt('uxc.unitDaysShort');

  return (
    <div className="flex min-h-0 flex-1 flex-col" ref={boxRef}>
      <div className="flex flex-wrap items-start gap-3 border-b border-[var(--w-border)] px-4 py-3">
        <KpiRow min={150} className="min-w-0 basis-full" label={wt('uxc.wbsTotals')}>
          <KpiTile size="sm" label={wt('school.planned')} value={unit === 'hours' ? `${fmtEffort(t.plannedDays)} h` : wt('school.pds', { n: days(t.plannedDays) })} />
          <KpiTile size="sm" label={wt('school.actual')} value={unit === 'hours' ? `${fmtEffort(t.actualDays)} h` : wt('school.pds', { n: days(t.actualDays) })}
            tone={t.actualDays > t.plannedDays && t.plannedDays > 0 ? 'red' : undefined}
            hint={t.plannedDays > 0 ? wt('uxc.ofPlanned', { p: Math.round((t.actualDays / t.plannedDays) * 100) }) : undefined} />
          <KpiTile size="sm" label={wt('school.estimated')} value={t.functions} />
          <KpiTile size="sm" label={wt('school.notEstimated')} value={t.unestimated} tone={t.unestimated ? 'yellow' : undefined} />
        </KpiRow>
        <div className="flex w-full flex-wrap items-center gap-2">
          <div className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border-strong)]" role="group" aria-label={wt('uxc.wbsView')}>
            {(['table', 'gantt'] as const).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => { setView(v); savePrefs({ view: v }); }}
                className={cn('inline-flex h-[26px] items-center gap-1 px-2.5 text-[12px] font-medium', view === v ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
                {v === 'table' ? <Table2 size={12} /> : <GanttChart size={12} />} {v === 'table' ? wt('uxc.wbsTable') : wt('uxc.wbsGantt')}
              </button>
            ))}
          </div>
          <div className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border-strong)]" role="group" aria-label={wt('uxc.unit')}>
            {(['days', 'hours'] as const).map((u) => (
              <button key={u} type="button" aria-pressed={unit === u} onClick={() => { setUnit(u); savePrefs({ unit: u }); }}
                className={cn('h-[26px] px-2.5 text-[12px] font-medium', unit === u ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}>
                {u === 'days' ? wt('uxc.unitDays') : wt('uxc.unitHours')}
              </button>
            ))}
          </div>
          <button type="button" className="w-btn w-btn-sm w-btn-ghost" onClick={() => setAll(collapsed.size > 0)} disabled={onlyLeaves} title={collapsed.size ? wt('uxc.expandAll') : wt('uxc.collapseAll')}>
            {collapsed.size ? <ChevronsUpDown size={13} /> : <ChevronsDownUp size={13} />} <span className="max-lg:!hidden">{collapsed.size ? wt('uxc.expandAll') : wt('uxc.collapseAll')}</span>
          </button>
          <label className="flex items-center gap-1.5 text-[12.5px] text-[var(--w-text-2)]"><input type="checkbox" checked={onlyLeaves} onChange={(e) => setOnlyLeaves(e.target.checked)} /> {wt('school.functionsOnly')}</label>
          <span className="flex-1" />
          <button type="button" className="w-btn w-btn-sm" onClick={() => setMatrixOpen(true)}><Settings2 size={13} /> {wt('school.complexityTable')}</button>
          <button type="button" className="w-btn w-btn-sm" disabled={busy} onClick={async () => {
            setBusy(true);
            try { toast.success(wt('fpt.exported', { name: await schoolApi.exportWbs(pid) })); } catch (e) { toast.error(workError(e, wt('fpt.exportFailed'))); } finally { setBusy(false); }
          }}>{busy ? <Spinner size={12} /> : <Download size={13} />} {wt('school.exportWbs')}</button>
        </div>
        {t.byIteration.length > 0 && (
          <div className="flex w-full flex-wrap items-center gap-1.5 text-[12px] text-[var(--w-text-2)]" aria-label={wt('uxc.byIteration')} role="group">
            <span className="text-[var(--w-text-3)]">{wt('uxc.byIteration')}:</span>
            {t.byIteration.map((it) => (
              <span key={it.iteration} className="rounded-full border border-[var(--w-border)] bg-[var(--w-sunken)] px-2 py-0.5" title={wt('uxc.iterTip', { f: it.functions })}>
                <b className="font-medium text-[var(--w-text)]">{it.iteration === '(no iteration)' ? wt('uxc.noIteration') : it.iteration}</b>
                {' · '}{fmtEffort(it.plannedDays)} / {fmtEffort(it.actualDays)} {unitLabel}
              </span>
            ))}
          </div>
        )}
      </div>
      {data.truncated && <div className="border-b border-[var(--w-border)] px-4 py-2 text-[12.5px] text-[var(--w-yellow-text)]">{wt('school.first3000')}</div>}
      {canDrag && !narrow && <p className="sr-only" id={`wbs-help-${pid}`}>{wt('uxc.wbsKeys')}</p>}
      {!allRows.length ? (
        <EmptyState title={wt('school.noItems')} body={wt('school.noItemsBody')} />
      ) : narrow ? (
        <ul className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3" aria-label={wt('uxc.wbsTitle')} data-testid="wbs-cards">
          {rows.map((r) => (
            <li key={r.issueId}>
              <button type="button" onClick={() => onOpenIssue(r.number)} className="w-card block w-full px-3 py-2.5 text-left" style={{ marginLeft: Math.min(r.depth, 3) * 10, width: `calc(100% - ${Math.min(r.depth, 3) * 10}px)` }}>
                <span className="flex items-center gap-2">
                  <span className="font-mono text-[11.5px] text-[var(--w-text-3)]">{r.wbs}</span>
                  <span className={cn('min-w-0 flex-1 truncate text-[13.5px]', r.childCount > 0 && 'font-semibold')}>{r.title}</span>
                  <WbsStatus s={r.status} title={r.statusName} />
                </span>
                <span className="mt-1 flex flex-wrap gap-x-3 text-[12px] text-[var(--w-text-3)]">
                  <span>{r.key}</span>
                  {r.complexity && <span>{r.complexity}</span>}
                  <span>{wt('school.planned')}: {fmtEffort(r.childCount ? r.plannedTotal : r.plannedDays) || '—'}</span>
                  <span>{wt('school.actual')}: {fmtEffort(r.childCount ? r.actualTotal : r.actualDays) || '—'}</span>
                  {r.iteration && <span>{r.iteration}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto" data-testid="wbs-tree">
          <div
            role="treegrid"
            aria-label={wt('uxc.wbsTitle')}
            aria-describedby={canDrag ? `wbs-help-${pid}` : undefined}
            aria-busy={moving || undefined}
            aria-rowcount={rows.length + 1}
            style={{ minWidth: minW, ['--wbs-cols' as string]: tableCols }}
            className="text-[12.5px]"
          >
            <div role="row" aria-rowindex={1} className="sticky top-0 z-[3] grid h-9 items-center border-b border-[var(--w-border)] bg-[var(--w-panel)] text-[11.5px] font-medium text-[var(--w-text-3)] shadow-[0_1px_0_var(--w-border)]" style={{ gridTemplateColumns: 'var(--wbs-cols)' }}>
              <span role="columnheader" aria-label={wt('uxc.dragHandle')} className="sticky left-0 h-full bg-[var(--w-panel)]" />
              <span role="columnheader" className="sticky left-[28px] flex h-full items-center bg-[var(--w-panel)] px-2">#</span>
              <span role="columnheader" className="sticky left-[98px] flex h-full items-center border-r border-[var(--w-border)] bg-[var(--w-panel)] px-2">{wt('school.hFunction')}</span>
              {view === 'table' ? (
                <>
                  <span role="columnheader" className="px-2">{wt('common.status')}</span>
                  <span role="columnheader" className="px-2">{wt('common.type')}</span>
                  <span role="columnheader" className="px-2">{wt('school.complexity')}</span>
                  <span role="columnheader" className="px-2 text-right" title={unitLabel}>{wt('uxc.plannedUnit', { u: unitShort })}</span>
                  <span role="columnheader" className="px-2 text-right" title={wt('uxc.actualTip')}>{wt('uxc.actualUnit', { u: unitShort })}</span>
                  <span role="columnheader" className="px-2">Iteration</span>
                  <span role="columnheader" className="px-2">{wt('school.hFeature')}</span>
                  <span role="columnheader" className="px-2 text-right" title={wt('school.hFields')}>{wt('school.hFields')}</span>
                  <span role="columnheader" className="px-2 text-right" title={wt('school.transactions')}>{wt('school.hTrans')}</span>
                  <span role="columnheader" className="px-2">{wt('school.hInCharge')}</span>
                </>
              ) : (
                <>
                  <span role="columnheader" className="px-2">{wt('common.status')}</span>
                  <span role="columnheader" className="px-2 text-right" title={unitLabel}>{wt('uxc.plannedUnit', { u: unitShort })}</span>
                  <span role="columnheader" className="px-2 text-right">{wt('uxc.actualUnit', { u: unitShort })}</span>
                  <span role="columnheader" className="relative h-full overflow-hidden" aria-label={wt('uxc.wbsGantt')}>
                    {gantt.months.map((m) => (
                      <span key={m.x} aria-hidden="true" className="absolute top-0 flex h-full items-center border-l border-[var(--w-border)] pl-1 text-[10.5px]" style={{ left: `${m.x * 100}%` }}>{m.label}</span>
                    ))}
                  </span>
                </>
              )}
            </div>
            <div role="rowgroup">
              {rows.map((r, idx) => (
                <WbsLine
                  key={r.issueId}
                  r={r} idx={idx} view={view} data={data} unit={unit} fmtEffort={fmtEffort} hpd={hpd}
                  collapsed={collapsed.has(r.issueId)} onToggle={() => toggle(r.issueId)} onOpen={() => onOpenIssue(r.number)}
                  editing={editing?.id === r.issueId ? editing.field : null}
                  onEdit={(field) => setEditing(field ? { id: r.issueId, field } : null)}
                  onPatch={(body) => { setEditing(null); void patch(r, body); }}
                  canDrag={canDrag && !moving}
                  dropHint={drag?.over?.num === r.number ? drag.over : null}
                  dragging={drag?.num === r.number}
                  onDragStart={() => setDrag({ num: r.number, over: null })}
                  onDragEnd={() => setDrag(null)}
                  onDragOver={(e) => onDragOver(e, r)}
                  onDrop={(e) => onDrop(e, r)}
                  onKeyDown={(e) => rowKey(e, r, idx)}
                  span={spans.get(r.issueId) ?? null}
                  gantt={gantt}
                  flat={onlyLeaves}
                />
              ))}
            </div>
            <div role="row" aria-rowindex={rows.length + 2} className="sticky bottom-0 z-[2] grid h-9 items-center border-t border-[var(--w-border-strong)] bg-[var(--w-panel)] font-semibold" style={{ gridTemplateColumns: 'var(--wbs-cols)' }}>
              <span role="gridcell" className="sticky left-0 h-full bg-[var(--w-panel)]" />
              <span role="gridcell" className="sticky left-[28px] h-full bg-[var(--w-panel)]" />
              <span role="gridcell" className="sticky left-[98px] flex h-full items-center border-r border-[var(--w-border)] bg-[var(--w-panel)] px-2">{wt('common.total')}</span>
              {view === 'table' ? (
                <>
                  <span role="gridcell" /><span role="gridcell" /><span role="gridcell" />
                  <span role="gridcell" className="px-2 text-right tabular-nums">{fmtEffort(t.plannedDays)}</span>
                  <span role="gridcell" className={cn('px-2 text-right tabular-nums', t.plannedDays > 0 && t.actualDays > t.plannedDays && 'text-[var(--w-red-text)]')}>{fmtEffort(t.actualDays)}</span>
                  <span role="gridcell" /><span role="gridcell" /><span role="gridcell" /><span role="gridcell" /><span role="gridcell" />
                </>
              ) : (
                <>
                  <span role="gridcell" />
                  <span role="gridcell" className="px-2 text-right tabular-nums">{fmtEffort(t.plannedDays)}</span>
                  <span role="gridcell" className="px-2 text-right tabular-nums">{fmtEffort(t.actualDays)}</span>
                  <span role="gridcell" />
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <MatrixDialog open={matrixOpen} onClose={() => setMatrixOpen(false)} pid={pid} matrix={data.matrix} canEdit={data.canEditMatrix} />
    </div>
  );
}

function WbsStatus({ s, title }: { s: string; title?: string }) {
  return (
    <span className="inline-flex h-[20px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--w-border)] px-2 text-[11.5px] text-[var(--w-text-2)]" title={title}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_TONE[s] ?? 'var(--w-text-3)' }} />
      {s}
    </span>
  );
}

interface LineProps {
  r: WbsRow; idx: number; view: View; data: WbsData; unit: Unit; hpd: number; fmtEffort: (d: number | null | undefined) => string;
  collapsed: boolean; onToggle: () => void; onOpen: () => void;
  editing: EditField | null; onEdit: (f: EditField | null) => void; onPatch: (b: WbsItemInput) => void;
  canDrag: boolean; dropHint: { pos: DropPos; ok: boolean } | null; dragging: boolean;
  onDragStart: () => void; onDragEnd: () => void; onDragOver: (e: DragEvent<HTMLDivElement>) => void; onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
  span: { start: string; end: string; own: boolean } | null;
  gantt: { lo: number; span: number; today: number };
  flat: boolean;
}

function WbsLine(p: LineProps) {
  const { r, view, data, fmtEffort, editing, onEdit, onPatch } = p;
  const ro = !data.canEdit;
  const planned = r.childCount ? r.plannedTotal : r.plannedDays;
  const actual = r.childCount ? r.actualTotal : r.actualDays;
  const over = (planned ?? 0) > 0 && actual > (planned ?? 0);
  const depth = p.flat ? 0 : r.depth;
  const cell = 'flex h-full min-w-0 items-center px-2';
  const hint = p.dropHint;
  return (
    <div
      role="row"
      aria-rowindex={p.idx + 2}
      aria-level={r.depth + 1}
      aria-expanded={r.childCount && !p.flat ? !p.collapsed : undefined}
      tabIndex={p.idx === 0 ? 0 : -1}
      data-wbs-row={r.number}
      onKeyDown={p.onKeyDown}
      onDragOver={p.onDragOver}
      onDrop={p.onDrop}
      className={cn(
        'group/w relative grid h-9 items-center border-b border-[var(--w-border)] outline-none hover:bg-[var(--w-hover)] focus-visible:bg-[var(--w-active)] focus-visible:shadow-[inset_2px_0_0_var(--w-accent)]',
        r.depth === 0 && !p.flat && 'font-medium',
        p.dragging && 'opacity-40',
        hint?.pos === 'into' && (hint.ok ? 'bg-[var(--w-accent-soft)] shadow-[inset_0_0_0_2px_var(--w-accent-border)]' : 'bg-[color-mix(in_srgb,var(--w-red)_8%,transparent)]'),
      )}
      style={{ gridTemplateColumns: 'var(--wbs-cols)' }}
    >
      {hint && hint.pos !== 'into' && (
        <span aria-hidden="true" className={cn('pointer-events-none absolute inset-x-0 z-[4] h-[2px]', hint.ok ? 'bg-[var(--w-accent)]' : 'bg-[var(--w-red)]', hint.pos === 'before' ? '-top-px' : '-bottom-px')} style={{ left: 98 + depth * 16 }} />
      )}
      <span role="gridcell" className="sticky left-0 z-[1] flex h-full items-center justify-center bg-[var(--w-panel)] group-hover/w:bg-[var(--w-hover)]">
        {p.canDrag && (
          <span
            draggable
            onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', r.key); p.onDragStart(); }}
            onDragEnd={p.onDragEnd}
            className="cursor-grab rounded p-0.5 text-[var(--w-text-3)] opacity-0 hover:text-[var(--w-text)] group-hover/w:opacity-100 group-focus-visible/w:opacity-100"
            title={wt('uxc.dragHandle')}
            aria-hidden="true"
          >
            <GripVertical size={13} />
          </span>
        )}
      </span>
      <span role="gridcell" className="sticky left-[28px] z-[1] flex h-full items-center bg-[var(--w-panel)] px-2 font-mono text-[11.5px] text-[var(--w-text-2)] group-hover/w:bg-[var(--w-hover)]">{r.wbs}</span>
      <span role="gridcell" className="sticky left-[98px] z-[1] flex h-full min-w-0 items-center gap-1 border-r border-[var(--w-border)] bg-[var(--w-panel)] pr-2 group-hover/w:bg-[var(--w-hover)]" style={{ paddingLeft: 4 + depth * 16 }}>
        {r.childCount > 0 && !p.flat ? (
          <button type="button" tabIndex={-1} onClick={p.onToggle} aria-label={p.collapsed ? wt('uxc.expand') : wt('uxc.collapse')} className="shrink-0 rounded p-0.5 text-[var(--w-text-3)] hover:bg-[var(--w-active)] hover:text-[var(--w-text)]">
            {p.collapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
          </button>
        ) : <span className="w-[18px] shrink-0" />}
        <button type="button" className="min-w-0 truncate text-left hover:underline" onClick={p.onOpen} title={`${r.key} ${r.title}${r.description ? `\n${r.description}` : ''}`}>
          <span className="mr-1.5 font-mono text-[11px] font-normal text-[var(--w-text-3)]">{r.key}</span>{r.title}
        </button>
        {r.childCount > 0 && p.collapsed && <span className="ml-auto shrink-0 rounded-full bg-[var(--w-sunken)] px-1.5 text-[10.5px] font-normal tabular-nums text-[var(--w-text-3)]">{r.childCount}</span>}
      </span>
      {view === 'table' ? (
        <>
          <span role="gridcell" className={cell}><WbsStatus s={r.status} title={r.statusName} /></span>
          <span role="gridcell" className={cell}>
            <EditCell ro={ro} label={wt('common.type')} active={editing === 'kind'} onStart={() => onEdit('kind')} onCancel={() => onEdit(null)} display={r.kind || '—'}
              editor={<select autoFocus className="w-input !h-[26px] w-full text-[12px]" defaultValue={r.kind} aria-label={wt('common.type')} onBlur={() => onEdit(null)} onKeyDown={(e) => e.key === 'Escape' && onEdit(null)} onChange={(e) => onPatch({ kind: e.target.value || null })}>
                <option value="">—</option>{WBS_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>} />
          </span>
          <span role="gridcell" className={cell}>
            <EditCell ro={ro} label={wt('school.complexity')} active={editing === 'complexity'} onStart={() => onEdit('complexity')} onCancel={() => onEdit(null)}
              display={r.complexity ? (r.complexitySource && r.complexitySource !== 'set' ? <span className="italic text-[var(--w-text-2)]" title={r.complexitySource === 'derived' ? wt('school.fromFT', { c: r.complexity }) : wt('school.fromField', { c: r.complexity })}>{wt('school.auto')} · {r.complexity}</span> : r.complexity) : '—'}
              editor={<select autoFocus className="w-input !h-[26px] w-full text-[12px]" defaultValue={r.complexitySource === 'set' ? r.complexity ?? '' : ''} aria-label={wt('school.complexity')} onBlur={() => onEdit(null)} onKeyDown={(e) => e.key === 'Escape' && onEdit(null)}
                onChange={(e) => onPatch({ complexity: (e.target.value || null) as Complexity | null })}>
                <option value="">{r.complexity && r.complexitySource !== 'set' ? `${wt('school.auto')} · ${r.complexity}` : '—'}</option>
                {COMPLEXITIES.map((c) => <option key={c} value={c}>{c} ({p.data.matrix.levels.find((l) => l.name === c)?.manDays ?? '?'} pd)</option>)}
              </select>} />
          </span>
          <span role="gridcell" className={cn(cell, 'justify-end')}>
            {r.childCount > 0 ? (
              <span className="tabular-nums text-[var(--w-text-2)]" title={wt('school.inclChildren')}>Σ {fmtEffort(r.plannedTotal) || '0'}</span>
            ) : (
              <EditCell ro={ro} label={wt('school.plannedOverride')} active={editing === 'planned'} onStart={() => onEdit('planned')} onCancel={() => onEdit(null)} align="right"
                display={r.plannedDays !== null ? <span className={cn('tabular-nums', r.plannedSource !== 'override' && 'text-[var(--w-text-2)]')} title={r.plannedSource === 'override' ? wt('uxc.srcOverride') : r.plannedSource === 'matrix' ? wt('uxc.srcMatrix') : wt('uxc.srcEstimate')}>{fmtEffort(r.plannedDays)}</span> : '—'}
                editor={<NumEditor step={p.unit === 'hours' ? 1 : 0.5} initial={r.plannedSource === 'override' && r.plannedDays !== null ? (p.unit === 'hours' ? Math.round(r.plannedDays * p.hpd * 10) / 10 : r.plannedDays) : null}
                  placeholder={r.plannedDays !== null && r.plannedSource !== 'override' ? fmtEffort(r.plannedDays) : ''} label={wt('school.plannedOverride')}
                  onCommit={(v) => {
                    const d = v === null ? null : p.unit === 'hours' ? Math.round((v / p.hpd) * 100) / 100 : v;
                    const cur = r.plannedSource === 'override' ? r.plannedDays : null;
                    if (d !== cur) onPatch({ plannedDays: d }); else onEdit(null);
                  }} onCancel={() => onEdit(null)} />} />
            )}
          </span>
          <span role="gridcell" className={cn(cell, 'justify-end tabular-nums', over && 'font-medium text-[var(--w-red-text)]')} title={over ? wt('uxc.overPlan') : undefined}>
            {r.childCount > 0 ? <span>Σ {fmtEffort(actual) || '0'}</span> : fmtEffort(actual) || <span className="text-[var(--w-text-3)]">—</span>}
          </span>
          <span role="gridcell" className={cn(cell, 'whitespace-nowrap text-[var(--w-text-2)]')}><span className="truncate" title={r.iteration}>{r.iteration || '—'}</span></span>
          <span role="gridcell" className={cell}>
            <EditCell ro={ro} label={wt('school.hFeature')} active={editing === 'feature'} onStart={() => onEdit('feature')} onCancel={() => onEdit(null)} display={r.feature || '—'} muted={!r.feature}
              editor={<TextEditor initial={r.feature} label={wt('school.hFeature')} onCommit={(v) => (v !== r.feature ? onPatch({ feature: v || null }) : onEdit(null))} onCancel={() => onEdit(null)} />} />
          </span>
          <span role="gridcell" className={cn(cell, 'justify-end')}>
            <EditCell ro={ro} label={wt('school.hFields')} active={editing === 'fields'} onStart={() => onEdit('fields')} onCancel={() => onEdit(null)} display={r.fields ?? '—'} align="right"
              editor={<NumEditor initial={r.fields} label={wt('school.hFields')} onCommit={(v) => (v !== r.fields ? onPatch({ fields: v === null ? null : Math.round(v) }) : onEdit(null))} onCancel={() => onEdit(null)} />} />
          </span>
          <span role="gridcell" className={cn(cell, 'justify-end')}>
            <EditCell ro={ro} label={wt('school.transactions')} active={editing === 'transactions'} onStart={() => onEdit('transactions')} onCancel={() => onEdit(null)} display={r.transactions ?? '—'} align="right"
              editor={<NumEditor initial={r.transactions} label={wt('school.transactions')} onCommit={(v) => (v !== r.transactions ? onPatch({ transactions: v === null ? null : Math.round(v) }) : onEdit(null))} onCancel={() => onEdit(null)} />} />
          </span>
          <span role="gridcell" className={cn(cell, 'text-[var(--w-text-2)]')}><span className="truncate" title={r.assignee}>{r.assignee || '—'}</span></span>

        </>
      ) : (
        <>
          <span role="gridcell" className={cell}><WbsStatus s={r.status} title={r.statusName} /></span>
          <span role="gridcell" className={cn(cell, 'justify-end tabular-nums')}>{r.childCount ? `Σ ${fmtEffort(planned) || '0'}` : fmtEffort(planned) || '—'}</span>
          <span role="gridcell" className={cn(cell, 'justify-end tabular-nums', over && 'font-medium text-[var(--w-red-text)]')}>{r.childCount ? `Σ ${fmtEffort(actual) || '0'}` : fmtEffort(actual) || '—'}</span>
          <span role="gridcell" className="relative h-full overflow-hidden">
            <span aria-hidden="true" className="absolute inset-y-0 w-px bg-[var(--w-accent)] opacity-60" style={{ left: `${((p.gantt.today - p.gantt.lo + 0.5) / p.gantt.span) * 100}%` }} />
            {p.span ? (() => {
              const a = (toDay(p.span.start) - p.gantt.lo) / p.gantt.span;
              const b = (toDay(p.span.end) - p.gantt.lo + 1) / p.gantt.span;
              const summary = r.childCount > 0;
              return (
                <span
                  className={cn('absolute rounded-[3px]', summary ? 'top-[14px] h-[8px]' : 'top-[9px] h-[18px]')}
                  style={{
                    left: `${a * 100}%`, width: `max(4px, ${(b - a) * 100}%)`,
                    background: summary ? 'color-mix(in srgb, var(--w-text) 45%, transparent)' : `color-mix(in srgb, ${STATUS_TONE[r.status] ?? 'var(--w-accent)'} 55%, var(--w-panel))`,
                    border: summary ? undefined : `1px solid color-mix(in srgb, ${STATUS_TONE[r.status] ?? 'var(--w-accent)'} 80%, transparent)`,
                  }}
                  title={`${r.wbs} ${r.title}\n${wfmt.shortDate(p.span.start)} – ${wfmt.shortDate(p.span.end)}${summary ? ` · ${wt('uxc.branchSpan')}` : ''}`}
                />
              );
            })() : <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] text-[var(--w-text-3)]">{wt('uxc.noDates')}</span>}
          </span>
        </>
      )}
    </div>
  );
}

/** Ô xem chỉ đọc; bấm (hoặc Enter) ⇒ trình sửa. Người chỉ xem thấy chữ thường. */
function EditCell({ ro, label, active, onStart, display, editor, align, muted }: {
  ro: boolean; label: string; active: boolean; onStart: () => void; onCancel: () => void; display: ReactNode; editor: ReactNode; align?: 'right'; muted?: boolean;
}) {
  if (active && !ro) return <>{editor}</>;
  if (ro) return <span className={cn('min-w-0 truncate', align === 'right' && 'w-full text-right tabular-nums', muted && 'text-[var(--w-text-3)]')}>{display}</span>;
  return (
    <button
      type="button"
      onClick={onStart}
      aria-label={wt('uxc.editCell', { f: label })}
      className={cn(
        'min-w-0 w-full truncate rounded-[4px] px-1 py-0.5 text-left outline-none hover:bg-[var(--w-sunken)] hover:shadow-[inset_0_0_0_1px_var(--w-border-strong)] focus-visible:shadow-[inset_0_0_0_2px_var(--w-accent-border)]',
        align === 'right' && 'text-right tabular-nums', muted && 'text-[var(--w-text-3)]',
      )}
    >
      {display}
    </button>
  );
}

function NumEditor({ initial, onCommit, onCancel, label, placeholder, step = 1 }: { initial: number | null; onCommit: (v: number | null) => void; onCancel: () => void; label: string; placeholder?: string; step?: number }) {
  const [v, setV] = useState(initial === null ? '' : String(initial));
  const done = useRef(false);
  const commit = () => {
    if (done.current) return;
    done.current = true;
    onCommit(v.trim() === '' ? null : Math.max(0, Number(v)) || 0);
  };
  return (
    <input type="number" min={0} step={step} autoFocus className="w-input !h-[26px] w-full text-right text-[12px] tabular-nums" aria-label={label} placeholder={placeholder}
      value={v} onChange={(e) => setV(e.target.value)} onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } else if (e.key === 'Escape') { done.current = true; onCancel(); } }} />
  );
}

function TextEditor({ initial, onCommit, onCancel, label }: { initial: string; onCommit: (v: string) => void; onCancel: () => void; label: string }) {
  const [v, setV] = useState(initial);
  const done = useRef(false);
  const commit = () => {
    if (done.current) return;
    done.current = true;
    onCommit(v.trim());
  };
  return (
    <input autoFocus className="w-input !h-[26px] w-full text-[12px]" aria-label={label} value={v} maxLength={120}
      onChange={(e) => setV(e.target.value)} onBlur={commit}
      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } else if (e.key === 'Escape') { done.current = true; onCancel(); } }} />
  );
}

function MatrixDialog({ open, onClose, pid, matrix, canEdit }: { open: boolean; onClose: () => void; pid: number; matrix: EstimationMatrix; canEdit: boolean }) {
  const qc = useQueryClient();
  const [m, setM] = useState<EstimationMatrix>(matrix);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (open) setM(matrix); }, [open, matrix]);
  const setLv = (i: number, k: 'maxFields' | 'maxTransactions' | 'manDays', v: string) =>
    setM((x) => ({ ...x, levels: x.levels.map((l, j) => (j === i ? { ...l, [k]: v.trim() === '' ? (k === 'manDays' ? 0 : null) : Number(v) } : l)) }));
  const save = async () => {
    setSaving(true);
    try {
      const res = await schoolApi.setMatrix(pid, m);
      qc.setQueryData(schoolKeys.wbs(pid), res);
      toast.success(wt('school.complexitySaved'));
      onClose();
    } catch (e) { toast.error(workError(e, wt('common.couldNotSave'))); } finally { setSaving(false); }
  };
  return (
    <Dialog open={open} onClose={() => !saving && onClose()} title={wt('school.complexityTitle')} width={620}
      footer={canEdit ? <><button type="button" className="w-btn" onClick={onClose}>{wt('common.cancel')}</button><button type="button" className="w-btn w-btn-primary" disabled={saving} onClick={save}>{saving && <Spinner size={12} />} {wt('common.save')}</button></> : <button type="button" className="w-btn" onClick={onClose}>{wt('common.close')}</button>}>
      <p className="mb-3 text-[12.5px] text-[var(--w-text-2)]">
        {wt('school.complexityHelp')}{!canEdit && ` ${wt('school.onlyAdmins')}`}
      </p>
      <table className="w-full text-[12.5px]">
        <thead className="text-left text-[11.5px] text-[var(--w-text-2)]"><tr><th className="py-1">{wt('school.hLevel')}</th><th>{wt('school.maxFields')}</th><th>{wt('school.maxTrans')}</th><th>{wt('school.manDays')}</th></tr></thead>
        <tbody>
          {m.levels.map((l, i) => (
            <tr key={l.name}>
              <td className="py-1 font-semibold">{l.name}</td>
              {(['maxFields', 'maxTransactions', 'manDays'] as const).map((k) => (
                <td key={k} className="pr-2">
                  <input type="number" min={0} step={k === 'manDays' ? 0.5 : 1} className="w-input h-[30px] w-[110px]" readOnly={!canEdit} aria-label={`${l.name} ${k}`}
                    value={l[k] ?? ''} placeholder={k === 'manDays' ? '' : wt('school.noLimit')} onChange={(e) => setLv(i, k, e.target.value)} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <label className="mt-3 flex items-center gap-2 text-[12.5px]">{wt('school.hoursPerDay')}
        <input type="number" min={1} max={24} className="w-input h-[30px] w-[80px]" readOnly={!canEdit} value={m.hoursPerDay} onChange={(e) => setM((x) => ({ ...x, hoursPerDay: Number(e.target.value) || 8 }))} />
        <span className="text-[var(--w-text-3)]">— {wt('school.hoursHelp')}</span>
      </label>
    </Dialog>
  );
}
