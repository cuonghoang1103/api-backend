'use client';

/**
 * Timeline (Gantt) của dự án: cây epic → thẻ bên trái, lưới ngày bên phải.
 * Kéo thanh để dời, kéo mép để đổi độ dài (bắt theo ngày). Cập nhật lạc quan
 * vào cache rồi mới gọi API — lỗi/409 thì trả cache cũ về.
 *
 * Toàn bộ lưới nằm trong MỘT khung cuộn (cả hai chiều): cột cây `sticky left`,
 * hàng tiêu đề `sticky top` ⇒ cuộn dọc tự đồng bộ, không phải nối hai khung.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, CalendarPlus, Camera, ChevronDown, ChevronRight, Crosshair, Filter, Flag, Layers, PanelLeft, Route, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  userName, workApi, workError, workErrorStatus,
  type ProjectConfig, type TimelineData, type TimelineItem,
} from '@/lib/work-api';
import { wk, type Lookups } from './hooks';
import { EmptyState, IssueTypeIcon, PickerList, Popover, UserAvatar, useToggle, type PickOption, PageLoading } from './ui';
import { wt } from '@/components/work/i18n';
import { statusName } from '@/components/work/i18n/names';
import { uxcApi, uxcKeys, type BaselineCompare } from '@/lib/work-uxc-api';
import { exportTimelinePng } from './timeline/exportTimeline';

const DAY = 86_400_000;
const ROW_H = 36;
const HEADER_H = 48;
/** Dải mốc (sprint / version / giai đoạn) dưới thang thời gian — UX-C. */
const MARK_H = 22;

type Zoom = 'days' | 'weeks' | 'months' | 'quarters';
const ZOOMS: Array<{ id: Zoom; label: string; dw: number }> = [
  { id: 'days', get label() { return wt('uxc.zDays'); }, dw: 56 },
  { id: 'weeks', get label() { return wt('timeline.weeks'); }, dw: 32 },
  { id: 'months', get label() { return wt('timeline.months'); }, dw: 10 },
  { id: 'quarters', get label() { return wt('timeline.quarters'); }, dw: 3.5 },
];
/** Tên tháng ngắn theo ngôn ngữ CT Work (gọi lúc vẽ). */
const months = () => wt('timeline.monthsShort').split(',');

// Ngày quy về số nguyên "ngày kể từ epoch" (UTC) — cộng trừ không lệch múi giờ.
const toDay = (s: string) => Math.floor(Date.parse(`${s}T00:00:00Z`) / DAY);
const fromDay = (n: number) => new Date(n * DAY).toISOString().slice(0, 10);
const utc = (n: number) => new Date(n * DAY);
function todayStr(): string {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
}
const shortDate = (n: number) => wt('timeline.dayMonth', { m: months()[utc(n).getUTCMonth()], d: utc(n).getUTCDate() });

type Row =
  | { kind: 'epic'; item: TimelineItem; childCount: number }
  | { kind: 'group'; id: 'none'; label: string; childCount: number }
  | { kind: 'issue'; item: TimelineItem; nested: boolean };

interface Span { start: number; end: number }
type SpanX = Span & { derived?: boolean; open?: boolean; fallback?: 'sprint' | 'version' }
const zoomKey = (pid: number) => `ctwork:timeline:${pid}`;
interface Drag { id: number; mode: 'move' | 'start' | 'end'; x0: number; orig: Span; cur: Span; moved: boolean }

export default function Timeline({ config, pid, lk, onOpen }: { config: ProjectConfig; pid: number; lk: Lookups; onOpen: (num: number) => void }) {
  const qc = useQueryClient();
  const canEdit = config.permissions.editIssues;
  const q = useQuery({ queryKey: wk.timeline(pid), queryFn: () => workApi.timeline(pid) });
  const versions = useQuery({ queryKey: wk.versions(pid), queryFn: () => workApi.versions(pid), staleTime: 60_000 });

  const [zoom, setZoom] = useState<Zoom>('weeks');
  const dw = ZOOMS.find((z) => z.id === zoom)!.dw;
  const [showCritical, setShowCritical] = useState(true);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [people, setPeople] = useState<number[]>([]); // 0 = chưa giao
  const [versionId, setVersionId] = useState<number | null>(null);
  const [narrowTree, setNarrowTree] = useState(false);
  const [small, setSmall] = useState(false);
  const [drag, setDrag] = useState<Drag | null>(null);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  // UX-C: mốc trên trục, baseline (C5), ẩn thẻ chưa lên lịch, tập trung đường găng, nổi phụ thuộc khi rê chuột.
  const markers = useQuery({ queryKey: uxcKeys.markers(pid), queryFn: () => uxcApi.markers(pid), staleTime: 60_000 });
  const baselines = useQuery({ queryKey: uxcKeys.baselines(pid), queryFn: () => uxcApi.baselines(pid), staleTime: 60_000 });
  const [baselineId, setBaselineId] = useState<number | null>(null);
  const cmp = useQuery({ queryKey: uxcKeys.compare(pid, baselineId ?? 0), queryFn: () => uxcApi.compare(pid, baselineId!), enabled: !!baselineId });
  const [hideUnscheduled, setHideUnscheduled] = useState(false);
  const [critFocus, setCritFocus] = useState(false);
  const [hoverBar, setHoverBar] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  // Nhớ mức zoom + baseline đang so theo dự án (localStorage, bọc try/catch).
  useEffect(() => {
    try {
      const v = JSON.parse(window.localStorage.getItem(zoomKey(pid)) ?? 'null') as { zoom?: Zoom; baselineId?: number | null } | null;
      if (v?.zoom && ZOOMS.some((z) => z.id === v.zoom)) setZoom(v.zoom);
      if (typeof v?.baselineId === 'number') setBaselineId(v.baselineId);
    } catch { /* riêng tư */ }
  }, [pid]);
  const remember = useCallback((patch: { zoom?: Zoom; baselineId?: number | null }) => {
    try {
      const cur = JSON.parse(window.localStorage.getItem(zoomKey(pid)) ?? '{}') as object;
      window.localStorage.setItem(zoomKey(pid), JSON.stringify({ ...cur, ...patch }));
    } catch { /* bỏ qua */ }
  }, [pid]);
  // Baseline đã bị xoá ⇒ bỏ chọn.
  useEffect(() => {
    if (baselineId && baselines.data && !baselines.data.some((b) => b.id === baselineId)) { setBaselineId(null); remember({ baselineId: null }); }
  }, [baselineId, baselines.data, remember]);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const on = () => setSmall(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const treeW = narrowTree ? 92 : small ? 150 : 300;

  const data = q.data;
  const today = toDay(todayStr());

  // UX-C: thẻ chưa có ngày nhưng thuộc sprint / version có ngày ⇒ thanh "lùi" theo sprint/version (nét đứt).
  const fallback = useMemo(() => {
    const m = new Map<number, Span & { fallback: 'sprint' | 'version'; label: string }>();
    const mk = markers.data;
    if (!data || !mk) return m;
    const sprint = new Map(mk.sprints.filter((x) => x.start && x.end).map((x) => [x.id, x]));
    const version = new Map(mk.versions.filter((x) => x.release).map((x) => [x.id, x]));
    for (const i of data.items) {
      if (i.start || i.due || i.level >= 1) continue;
      const sp = i.sprintId ? sprint.get(i.sprintId) : undefined;
      if (sp) { m.set(i.id, { start: toDay(sp.start!), end: Math.max(toDay(sp.start!), toDay(sp.end!)), fallback: 'sprint', label: sp.name }); continue; }
      const v = i.fixVersionId ? version.get(i.fixVersionId) : undefined;
      if (v) {
        const end = toDay(v.release!);
        m.set(i.id, { start: v.start ? Math.min(toDay(v.start), end) : end - 13, end, fallback: 'version', label: v.name });
      }
    }
    return m;
  }, [data, markers.data]);
  const isTest = useCallback((i: TimelineItem) => lk.types.get(i.typeId)?.key === 'TEST', [lk]);

  // ── Cây hàng ────────────────────────────────────────────────
  const { rows, visibleIds } = useMemo(() => {
    const out: Row[] = [];
    if (!data) return { rows: out, visibleIds: new Set<number>() };
    const match = (i: TimelineItem) =>
      !isTest(i)
      && (!hideUnscheduled || !!(i.start || i.due || fallback.has(i.id)))
      && (!people.length || people.includes(i.assigneeId ?? 0)) && (versionId === null || i.fixVersionId === versionId);
    const filtering = people.length > 0 || versionId !== null || hideUnscheduled;
    const epics = data.items.filter((i) => i.level >= 1);
    const epicIds = new Set(epics.map((e) => e.id));
    const children = new Map<number, TimelineItem[]>();
    const orphans: TimelineItem[] = [];
    for (const i of data.items) {
      if (i.level >= 1) continue;
      if (i.parentId && epicIds.has(i.parentId)) {
        const arr = children.get(i.parentId) ?? [];
        arr.push(i);
        children.set(i.parentId, arr);
      } else orphans.push(i);
    }
    for (const e of epics) {
      const kids = (children.get(e.id) ?? []).filter(match);
      if (filtering && !kids.length && !match(e)) continue;
      out.push({ kind: 'epic', item: e, childCount: kids.length });
      if (!collapsed.has(`e${e.id}`)) kids.forEach((k) => out.push({ kind: 'issue', item: k, nested: true }));
    }
    const loose = orphans.filter(match);
    if (loose.length) {
      out.push({ kind: 'group', id: 'none', label: wt('board.noEpic'), childCount: loose.length });
      if (!collapsed.has('none')) loose.forEach((k) => out.push({ kind: 'issue', item: k, nested: false }));
    }
    const ids = new Set<number>();
    out.forEach((r) => r.kind !== 'group' && ids.add(r.item.id));
    return { rows: out, visibleIds: ids };
  }, [data, people, versionId, collapsed, isTest, hideUnscheduled, fallback]);

  // Khoảng ngày của từng thẻ (đã tính cả thanh đang kéo + epic suy từ con).
  const spans = useMemo(() => {
    const m = new Map<number, SpanX>();
    if (!data) return m;
    for (const i of data.items) {
      if (drag && drag.id === i.id) { m.set(i.id, drag.cur); continue; }
      if (i.start && i.due) m.set(i.id, { start: toDay(i.start), end: Math.max(toDay(i.start), toDay(i.due)) });
      else if (i.due) m.set(i.id, { start: toDay(i.due), end: toDay(i.due) });
      else if (i.start) m.set(i.id, { start: toDay(i.start), end: toDay(i.start), open: true });
      else if (fallback.has(i.id)) { const f = fallback.get(i.id)!; m.set(i.id, { start: f.start, end: f.end, fallback: f.fallback }); }
    }
    // Epic không có ngày: thanh phủ min(start)..max(due) của con — chỉ để nhìn.
    for (const e of data.items) {
      if (e.level < 1 || m.has(e.id)) continue;
      const kids = data.items.filter((c) => c.parentId === e.id).map((c) => m.get(c.id)).filter((s): s is Span => !!s);
      if (kids.length) m.set(e.id, { start: Math.min(...kids.map((k) => k.start)), end: Math.max(...kids.map((k) => k.end)), derived: true });
    }
    return m;
  }, [data, drag, fallback]);

  // ── Khoảng hiển thị: bao mọi thanh + hôm nay, căn về thứ Hai ─────
  const range = useMemo(() => {
    let lo = today - 30, hi = today + 90;
    for (const s of spans.values()) { lo = Math.min(lo, s.start - 14); hi = Math.max(hi, s.end + 30); }
    for (const v of markers.data?.versions ?? []) if (v.release) hi = Math.max(hi, toDay(v.release) + 7);
    const pad = zoom === 'quarters' ? 60 : zoom === 'months' ? 21 : 7;
    lo -= pad; hi += pad;
    lo -= (utc(lo).getUTCDay() + 6) % 7; // về thứ Hai
    return { start: lo, days: hi - lo + 1 };
    // Không phụ thuộc drag: kéo thanh ra mép không được làm cả lưới nhảy.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, today, zoom, markers.data, fallback]);
  const gridW = range.days * dw;
  const xOf = useCallback((day: number) => (day - range.start) * dw, [range.start, dw]);

  // Cuộn tới hôm nay khi mở / đổi mức zoom.
  const didScroll = useRef<string>('');
  useEffect(() => {
    if (!data || !scroller.current) return;
    const sig = `${zoom}`;
    if (didScroll.current === sig) return;
    didScroll.current = sig;
    const el = scroller.current;
    el.scrollLeft = Math.max(0, xOf(today) - (el.clientWidth - treeW) * 0.3);
  }, [data, zoom, xOf, today, treeW]);
  const scrollToday = () => {
    const el = scroller.current;
    if (el) el.scrollTo({ left: Math.max(0, xOf(today) - (el.clientWidth - treeW) * 0.3), behavior: 'smooth' });
  };

  // ── Thang thời gian (hai tầng) ────────────────────────────────
  const scale = useMemo(() => {
    const top: Array<{ x: number; w: number; label: string }> = [];
    const bottom: Array<{ x: number; w: number; label: string; dim?: boolean }> = [];
    const lines: number[] = [];
    const push = (arr: Array<{ x: number; w: number; label: string; dim?: boolean }>, key: string, day: number, label: string, dim?: boolean) => {
      const last = arr[arr.length - 1] as (typeof arr)[number] & { key?: string };
      if (last && last.key === key) last.w += dw;
      else arr.push(Object.assign({ x: xOf(day), w: dw, label, dim }, { key }));
    };
    for (let i = 0; i < range.days; i++) {
      const n = range.start + i;
      const d = utc(n);
      const y = d.getUTCFullYear(), mo = d.getUTCMonth(), dd = d.getUTCDate(), dow = d.getUTCDay();
      if (zoom === 'quarters') {
        push(top, `${y}q${Math.floor(mo / 3)}`, n, `Q${Math.floor(mo / 3) + 1} ${y}`);
        push(bottom, `${y}-${mo}`, n, months()[mo]);
        if (dd === 1) lines.push(xOf(n));
      } else if (zoom === 'months') {
        push(top, `${y}-${mo}`, n, `${months()[mo]} ${y}`);
        const wkStart = n - ((dow + 6) % 7);
        push(bottom, `w${wkStart}`, n, String(utc(wkStart).getUTCDate()));
        if (dow === 1) lines.push(xOf(n));
      } else if (zoom === 'days') {
        push(top, `${y}-${mo}`, n, `${months()[mo]} ${y}`);
        bottom.push({ x: xOf(n), w: dw, label: `${wt('uxc.weekdays').split(',')[dow]} ${dd}`, dim: dow === 0 || dow === 6 });
        lines.push(xOf(n));
      } else {
        push(top, `${y}-${mo}`, n, `${months()[mo]} ${y}`);
        bottom.push({ x: xOf(n), w: dw, label: String(dd), dim: dow === 0 || dow === 6 });
        if (dow === 1) lines.push(xOf(n));
      }
    }
    return { top, bottom, lines };
  }, [range, zoom, dw, xOf]);

  // ── Lưu lịch: lạc quan vào cache, lỗi thì trả về ─────────────────
  const schedule = useCallback(async (item: TimelineItem, span: Span) => {
    const key = wk.timeline(pid);
    await qc.cancelQueries({ queryKey: key });
    const prev = qc.getQueryData<TimelineData>(key);
    const start = fromDay(span.start), due = fromDay(span.end);
    qc.setQueryData<TimelineData>(key, (old) => old && { ...old, items: old.items.map((i) => (i.id === item.id ? { ...i, start, due } : i)) });
    try {
      await workApi.scheduleIssue(pid, item.number, { startDate: start, dueDate: due });
      qc.invalidateQueries({ queryKey: key });
    } catch (err) {
      if (prev) qc.setQueryData(key, prev);
      toast.error(workErrorStatus(err) === 409
        ? wt('timeline.changedBy', { key: lk.issueKey(item.number) })
        : workError(err, wt('timeline.datesFailed')));
      qc.invalidateQueries({ queryKey: key });
    }
  }, [pid, qc, lk]);

  // ── Kéo thanh ─────────────────────────────────────────────────
  const itemById = useMemo(() => new Map((data?.items ?? []).map((i) => [i.id, i])), [data]);
  const startDrag = (e: ReactPointerEvent, item: TimelineItem, mode: Drag['mode']) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const s = spans.get(item.id);
    if (!s || !canEdit) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const orig = { start: s.start, end: s.end };
    setDrag({ id: item.id, mode, x0: e.clientX, orig, cur: orig, moved: false });
  };
  const moveDrag = (e: ReactPointerEvent) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0;
    const delta = Math.round(dx / dw);
    const { orig } = drag;
    let cur: Span = orig;
    if (drag.mode === 'move') cur = { start: orig.start + delta, end: orig.end + delta };
    else if (drag.mode === 'start') cur = { start: Math.min(orig.start + delta, orig.end), end: orig.end };
    else cur = { start: orig.start, end: Math.max(orig.end + delta, orig.start) };
    const moved = drag.moved || Math.abs(dx) > 3;
    if (moved !== drag.moved || cur.start !== drag.cur.start || cur.end !== drag.cur.end) setDrag({ ...drag, cur, moved });
  };
  const endDrag = (e: ReactPointerEvent) => {
    if (!drag) return;
    const d = drag;
    setDrag(null);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* đã nhả */ }
    const item = itemById.get(d.id);
    if (!item) return;
    if (!d.moved) { onOpen(item.number); return; }
    if (d.cur.start === d.orig.start && d.cur.end === d.orig.end) return;
    void schedule(item, d.cur);
  };

  // Bấm vào lưới ở hàng chưa có ngày ⇒ đặt lịch 5 ngày từ ngày bấm.
  const clickEmptyRow = (e: ReactMouseEvent<HTMLDivElement>, item: TimelineItem) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const day = range.start + Math.floor((e.clientX - rect.left) / dw);
    void schedule(item, { start: day, end: day + 4 });
  };

  // ── Đường găng + xung đột ────────────────────────────────────
  const critical = useMemo(() => {
    // Không có phụ thuộc ⇒ không tô thanh nào là "găng".
    const p = data?.dependencies.length ? data.criticalPath : [];
    const ids = new Set(p);
    const edges = new Set<string>();
    for (let i = 1; i < p.length; i++) edges.add(`${p[i - 1]}>${p[i]}`);
    return { ids, edges };
  }, [data]);
  const conflictEdges = useMemo(() => new Set((data?.conflicts ?? []).map((c) => `${c.from}>${c.to}`)), [data]);
  const conflictIds = useMemo(() => new Set((data?.conflicts ?? []).flatMap((c) => [c.from, c.to])), [data]);

  const rowIndex = useMemo(() => {
    const m = new Map<number, number>();
    rows.forEach((r, i) => r.kind !== 'group' && m.set(r.item.id, i));
    return m;
  }, [rows]);

  const arrows = useMemo(() => {
    if (!data) return [];
    return data.dependencies.flatMap((d) => {
      const ra = rowIndex.get(d.from), rb = rowIndex.get(d.to);
      const sa = spans.get(d.from), sb = spans.get(d.to);
      if (ra === undefined || rb === undefined || !sa || !sb || !visibleIds.has(d.from) || !visibleIds.has(d.to)) return [];
      const x1 = xOf(sa.end + 1), y1 = ra * ROW_H + ROW_H / 2;
      const x2 = xOf(sb.start), y2 = rb * ROW_H + ROW_H / 2;
      const gap = 8;
      let path: string;
      if (x2 - gap >= x1 + gap) {
        const mx = x1 + gap;
        path = `M${x1},${y1} H${mx} V${y2} H${x2 - 2}`;
      } else {
        const my = y2 > y1 ? rb * ROW_H : (rb + 1) * ROW_H;
        path = `M${x1},${y1} H${x1 + gap} V${my} H${x2 - gap} V${y2} H${x2 - 2}`;
      }
      const key = `${d.from}>${d.to}`;
      return [{ key, path, conflict: conflictEdges.has(key), critical: showCritical && critical.edges.has(key), from: d.from, to: d.to, hot: hoverBar !== null && (d.from === hoverBar || d.to === hoverBar) }];
    });
  }, [data, rowIndex, spans, visibleIds, xOf, conflictEdges, critical, showCritical, hoverBar]);

  // ── Baseline (C5): thanh mờ "kế hoạch gốc" dưới thanh hiện tại + số ngày trễ ──
  const base = useMemo(() => {
    const m = new Map<number, Span & { slip: number | null; state: BaselineCompare['rows'][number]['state'] }>();
    const c = cmp.data;
    if (!c) return m;
    const st = new Map(c.rows.map((r) => [r.id, r]));
    for (const i of c.items) {
      const a = i.start ?? i.due;
      const b = i.due ?? i.start;
      if (!a || !b) continue;
      const r = st.get(i.id);
      m.set(i.id, { start: toDay(a), end: Math.max(toDay(a), toDay(b)), slip: r?.slipDays ?? null, state: r?.state ?? 'ON_PLAN' });
    }
    return m;
  }, [cmp.data]);
  const saveBaseline = async (name: string) => {
    try {
      const b = await uxcApi.createBaseline(pid, { name });
      toast.success(wt('uxc.baselineSaved', { name: b.name, count: b.itemCount }));
      await qc.invalidateQueries({ queryKey: uxcKeys.baselines(pid) });
      setBaselineId(b.id);
      remember({ baselineId: b.id });
    } catch (err) { toast.error(workError(err, wt('uxc.baselineFailed'))); }
  };
  const deleteBaseline = async (id: number) => {
    if (!window.confirm(wt('uxc.baselineDeleteQ'))) return;
    try {
      await uxcApi.deleteBaseline(pid, id);
      if (baselineId === id) { setBaselineId(null); remember({ baselineId: null }); }
      qc.invalidateQueries({ queryKey: uxcKeys.baselines(pid) });
    } catch (err) { toast.error(workError(err)); }
  };
  const baselineBtn = useRef<HTMLButtonElement>(null);
  const baselinePop = useToggle();
  const [baselineName, setBaselineName] = useState('');
  const unscheduledCount = useMemo(() => (data?.items ?? []).filter((i) => i.level < 1 && !isTest(i) && !i.start && !i.due && !fallback.has(i.id)).length, [data, isTest, fallback]);
  const doExport = async () => {
    if (!data) return;
    setExporting(true);
    try {
      await exportTimelinePng({
        root: scroller.current ?? document.body,
        title: `${config.key} — ${wt('timeline.title')}`,
        rows: rows.map((r) => (r.kind === 'group'
          ? { kind: 'group' as const, label: r.label }
          : { kind: r.kind, id: r.item.id, key: lk.issueKey(r.item.number), title: r.item.title, color: lk.types.get(r.item.typeId)?.color ?? null, done: r.item.done })),
        spans, base, deps: arrows.map((a) => ({ from: a.from, to: a.to, critical: a.critical, conflict: a.conflict })),
        critical: showCritical ? critical.ids : new Set<number>(),
        today, range, zoom, months: months(),
        markers: markers.data ?? null,
        fileName: `${config.key}-timeline`,
      });
    } catch (err) {
      toast.error(wt('charts.exportFailed'), { description: (err as Error).message });
    } finally { setExporting(false); }
  };

  // ── Bộ lọc ───────────────────────────────────────────────────
  const peopleBtn = useRef<HTMLButtonElement>(null);
  const versionBtn = useRef<HTMLButtonElement>(null);
  const peoplePop = useToggle();
  const versionPop = useToggle();
  const peopleOptions: PickOption<number>[] = useMemo(() => [
    { value: 0, label: wt('common.unassigned'), icon: <UserAvatar user={null} size={16} /> },
    ...config.members.map((m) => ({ value: m.id, label: userName(m), icon: <UserAvatar user={m} size={16} />, keywords: m.username })),
  ], [config.members]);
  const versionOptions: PickOption<number>[] = useMemo(
    () => (versions.data ?? []).filter((v) => v.status !== 'ARCHIVED').map((v) => ({ value: v.id, label: v.name, hint: v.status === 'RELEASED' ? wt('timeline.released') : undefined })),
    [versions.data],
  );
  const versionName = versionId !== null ? versions.data?.find((v) => v.id === versionId)?.name ?? wt('common.version') : null;
  const filtered = people.length > 0 || versionId !== null;

  const toggleCollapse = (k: string) => setCollapsed((s) => {
    const n = new Set(s);
    if (n.has(k)) n.delete(k); else n.add(k);
    return n;
  });

  if (q.isLoading) return <PageLoading />;
  if (q.error || !data) {
    return <EmptyState title={wt('timeline.loadFailed')} body={workError(q.error)} action={<button type="button" className="w-btn" onClick={() => q.refetch()}>{wt('common.tryAgain')}</button>} />;
  }

  const bodyH = Math.max(rows.length * ROW_H, 120);
  const mk = markers.data;
  const hasMarks = !!mk && (mk.sprints.some((x) => x.start && x.end) || mk.versions.some((x) => x.release) || mk.stages.some((x) => x.start));
  const headH = HEADER_H + (hasMarks ? MARK_H : 0);
  const weekendBg = zoom === 'quarters'
    ? undefined
    : `repeating-linear-gradient(to right, transparent 0 ${5 * dw}px, var(--tl-weekend) ${5 * dw}px ${7 * dw}px)`;

  return (
    <div className="flex h-full min-h-0 flex-col" style={{ ['--tl-weekend' as string]: 'color-mix(in srgb, var(--w-text) 4%, transparent)' }}>
      {/* Thanh công cụ */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[var(--w-border)] px-4 py-2">
        <button type="button" onClick={() => setNarrowTree((v) => !v)} className={cn('w-btn w-btn-sm w-btn-icon', narrowTree && 'w-btn-on')} title={narrowTree ? wt('timeline.showTitles') : wt('timeline.collapseCol')} aria-label={wt('timeline.toggleCol')}>
          <PanelLeft size={13} />
        </button>
        <div className="inline-flex overflow-hidden rounded-[6px] border border-[var(--w-border-strong)]" role="group" aria-label={wt('timeline.zoom')}>
          {ZOOMS.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => { setZoom(z.id); remember({ zoom: z.id }); }}
              aria-pressed={zoom === z.id}
              className={cn('h-[26px] px-2.5 text-[12px] font-medium', zoom === z.id ? 'bg-[var(--w-active)] text-[var(--w-text)]' : 'text-[var(--w-text-2)] hover:bg-[var(--w-hover)]')}
            >
              {z.label}
            </button>
          ))}
        </div>
        <button type="button" className="w-btn w-btn-sm" onClick={scrollToday}><Crosshair size={13} /> {wt('common.today')}</button>

        <button ref={peopleBtn} type="button" onClick={peoplePop.toggle} className={cn('w-btn w-btn-sm', people.length > 0 && 'w-btn-on')}>
          <Filter size={12} /> {wt('common.assignee')}{people.length > 0 && ` · ${people.length}`}
        </button>
        <Popover open={peoplePop.on} onClose={peoplePop.close} anchorRef={peopleBtn} width={240}>
          <PickerList
            options={peopleOptions}
            selected={people}
            multi
            placeholder={wt('timeline.filterAssignee')}
            onPick={(v) => setPeople((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]))}
          />
        </Popover>
        {versionOptions.length > 0 && (
          <>
            <button ref={versionBtn} type="button" onClick={versionPop.toggle} className={cn('w-btn w-btn-sm max-w-[180px]', versionId !== null && 'w-btn-on')}>
              <span className="truncate">{versionName ? `${wt('common.version')}: ${versionName}` : wt('common.version')}</span> <ChevronDown size={12} className="shrink-0" />
            </button>
            <Popover open={versionPop.on} onClose={versionPop.close} anchorRef={versionBtn} width={240}>
              <PickerList
                options={versionOptions}
                selected={versionId !== null ? [versionId] : []}
                placeholder={wt('timeline.filterVersion')}
                onPick={(v) => { setVersionId((c) => (c === v ? null : v)); versionPop.close(); }}
              />
            </Popover>
          </>
        )}
        {filtered && (
          <button type="button" onClick={() => { setPeople([]); setVersionId(null); }} className="w-btn w-btn-ghost w-btn-sm"><X size={12} /> {wt('board.clear')}</button>
        )}

        {unscheduledCount > 0 && (
          <button type="button" onClick={() => setHideUnscheduled((v) => !v)} aria-pressed={hideUnscheduled} className={cn('w-btn w-btn-sm', hideUnscheduled && 'w-btn-on')} title={wt('uxc.unscheduledTip')} data-testid="tl-unscheduled">
            <CalendarPlus size={12} /> {hideUnscheduled ? wt('uxc.showUnscheduled', { count: unscheduledCount }) : wt('uxc.hideUnscheduled', { count: unscheduledCount })}
          </button>
        )}

        <div className="ml-auto flex flex-wrap items-center gap-2">
          {/* Baseline (C5): lưu kế hoạch gốc, so với hiện tại */}
          <button ref={baselineBtn} type="button" onClick={baselinePop.toggle} className={cn('w-btn w-btn-sm max-w-[260px]', baselineId && 'w-btn-on')} aria-haspopup="dialog" aria-expanded={baselinePop.on} data-testid="tl-baseline">
            <Layers size={13} />
            <span className="truncate">{baselineId && cmp.data ? wt('uxc.baselineVs', { name: cmp.data.baseline.name }) : wt('uxc.baseline')}</span>
            <ChevronDown size={12} className="shrink-0" />
          </button>
          <Popover open={baselinePop.on} onClose={baselinePop.close} anchorRef={baselineBtn} width={300} align="end">
            <div className="p-2" role="dialog" aria-label={wt('uxc.baseline')}>
              <p className="mb-2 px-1 text-[12px] text-[var(--w-text-2)]">{wt('uxc.baselineHelp')}</p>
              <div className="max-h-[220px] overflow-y-auto" role="radiogroup" aria-label={wt('uxc.baseline')}>
                <label className="flex cursor-pointer items-center gap-2 rounded-[5px] px-1.5 py-1 text-[13px] hover:bg-[var(--w-hover)]">
                  <input type="radio" name="tl-baseline" checked={!baselineId} onChange={() => { setBaselineId(null); remember({ baselineId: null }); }} />
                  {wt('uxc.noBaseline')}
                </label>
                {(baselines.data ?? []).map((b) => (
                  <div key={b.id} className="flex items-center gap-1 rounded-[5px] px-1.5 py-1 hover:bg-[var(--w-hover)]">
                    <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-[13px]">
                      <input type="radio" name="tl-baseline" checked={baselineId === b.id} onChange={() => { setBaselineId(b.id); remember({ baselineId: b.id }); }} />
                      <span className="min-w-0">
                        <span className="block truncate">{b.name}</span>
                        <span className="block truncate text-[11px] text-[var(--w-text-3)]">{shortDate(toDay(b.createdAt.slice(0, 10)))} · {wt('uxc.nItems', { count: b.itemCount })}</span>
                      </span>
                    </label>
                    {canEdit && <button type="button" className="w-btn w-btn-ghost w-btn-sm w-btn-icon" aria-label={wt('uxc.deleteBaseline', { name: b.name })} onClick={() => void deleteBaseline(b.id)}><Trash2 size={12} /></button>}
                  </div>
                ))}
              </div>
              {canEdit && (
                <form className="mt-2 flex gap-1.5 border-t border-[var(--w-border)] pt-2" onSubmit={(e) => { e.preventDefault(); if (baselineName.trim()) { void saveBaseline(baselineName.trim()); setBaselineName(''); } }}>
                  <input className="w-input !h-[28px] min-w-0 flex-1 !text-[12.5px]" placeholder={wt('uxc.baselineNamePh')} aria-label={wt('uxc.baselineName')} value={baselineName} maxLength={120} onChange={(e) => setBaselineName(e.target.value)} />
                  <button type="submit" className="w-btn w-btn-primary w-btn-sm" disabled={!baselineName.trim()}>{wt('uxc.saveBaseline')}</button>
                </form>
              )}
            </div>
          </Popover>
          {baselineId && cmp.data && (
            <span className={cn('inline-flex h-[24px] items-center gap-1 rounded-full border px-2 text-[12px]', cmp.data.summary.slipped ? 'border-[var(--w-red-text)] text-[var(--w-red-text)]' : 'border-[var(--w-border-strong)] text-[var(--w-text-2)]')} title={wt('uxc.baselineSummaryTip', { a: cmp.data.summary.ahead, o: cmp.data.summary.onPlan, n: cmp.data.summary.added, r: cmp.data.summary.removed + cmp.data.summary.unscheduled })} data-testid="tl-baseline-summary">
              {cmp.data.summary.slipped ? wt('uxc.slipped', { count: cmp.data.summary.slipped, d: cmp.data.summary.maxSlip }) : wt('uxc.onPlanAll')}
            </span>
          )}
          {data.conflicts.length > 0 && (
            <span className="inline-flex h-[24px] items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--w-red)_40%,transparent)] px-2 text-[12px] text-[var(--w-red)]" title={wt('timeline.conflictTitle')}>
              <AlertTriangle size={12} /> {wt('timeline.conflicts', { count: data.conflicts.length })}
            </span>
          )}
          {/* Không có phụ thuộc nào thì "đường găng" chỉ là một thẻ dài nhất — vô nghĩa, ẩn đi. */}
          {data.dependencies.length > 0 && data.criticalPath.length > 1 && (
            <>
              {showCritical && (
                <span className="inline-flex h-[24px] items-center rounded-full bg-[color-mix(in_srgb,var(--w-orange)_16%,transparent)] px-2 text-[12px] font-medium text-[var(--w-orange)]">
                  {wt('timeline.criticalPath', { count: data.criticalDays })}
                </span>
              )}
              <button type="button" onClick={() => setShowCritical((v) => !v)} aria-pressed={showCritical} className={cn('w-btn w-btn-sm', showCritical && 'w-btn-on')}>
                <Route size={13} /> <span className="hidden sm:inline">{wt('timeline.showCritical')}</span>
              </button>
              {showCritical && (
                <button type="button" onClick={() => setCritFocus((v) => !v)} aria-pressed={critFocus} className={cn('w-btn w-btn-sm', critFocus && 'w-btn-on')} title={wt('uxc.critFocusTip', { path: data.criticalPath.map((id) => lk.issueKey(itemById.get(id)?.number ?? 0)).join(' → ') })}>
                  {wt('uxc.critFocus')}
                </button>
              )}
            </>
          )}
          <button type="button" className="w-btn w-btn-sm w-btn-icon" onClick={() => void doExport()} disabled={exporting || !rows.length} aria-label={wt('uxc.exportPng')} title={wt('uxc.exportPng')} data-testid="tl-export">
            {exporting ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--w-text-3)] border-t-transparent" /> : <Camera size={13} />}
          </button>
        </div>
      </div>
      {/* Chú giải (UX-C): đọc được ngay mũi tên / viền đỏ / thanh mờ nghĩa là gì */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-[var(--w-border)] px-4 py-1 text-[11.5px] text-[var(--w-text-3)]" aria-label={wt('uxc.legend')}>
        <span className="inline-flex items-center gap-1.5"><svg width="22" height="8" aria-hidden="true"><path d="M0 4 H18" stroke="var(--w-text-3)" strokeWidth="1.5" /><path d="M16 1 L21 4 L16 7z" fill="var(--w-text-3)" /></svg>{wt('uxc.lgDep')}</span>
        {data.criticalPath.length > 1 && <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-[3px] shadow-[0_0_0_2px_var(--w-orange)]" aria-hidden="true" />{wt('uxc.lgCritical')}</span>}
        {data.conflicts.length > 0 && <span className="inline-flex items-center gap-1.5"><svg width="22" height="8" aria-hidden="true"><path d="M0 4 H20" stroke="var(--w-red)" strokeWidth="2" strokeDasharray="4 3" /></svg>{wt('uxc.lgConflict')}</span>}
        {fallback.size > 0 && <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-[3px] border border-dashed border-[var(--w-text-3)]" aria-hidden="true" />{wt('uxc.lgFallback')}</span>}
        {baselineId && <span className="inline-flex items-center gap-1.5"><span className="h-[4px] w-4 rounded-full bg-[var(--w-text-3)] opacity-60" aria-hidden="true" />{wt('uxc.lgBaseline')}</span>}
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-[2px] bg-[var(--w-accent)]" aria-hidden="true" />{wt('common.today')}</span>
        {(markers.data?.versions.length ?? 0) > 0 && <span className="inline-flex items-center gap-1.5"><Flag size={11} className="text-[var(--w-epic,var(--w-accent))]" aria-hidden="true" />{wt('uxc.lgRelease')}</span>}
      </div>

      {!rows.length ? (
        <EmptyState
          title={filtered ? wt('timeline.noMatch') : wt('timeline.nothing')}
          body={filtered ? wt('timeline.tryClear') : wt('timeline.nothingBody')}
        />
      ) : (
        <div ref={scroller} className="relative min-h-0 min-w-0 flex-1 overflow-auto overscroll-contain">
          <div className="relative" style={{ width: treeW + gridW, minHeight: '100%' }}>
            {/* Tiêu đề (dính trên) */}
            <div className="sticky top-0 z-20 flex border-b border-[var(--w-border)] bg-[var(--w-panel)]" style={{ height: headH }}>
              <div className="sticky left-0 z-30 flex shrink-0 items-end border-r border-[var(--w-border)] bg-[var(--w-panel)] px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wide text-[var(--w-text-3)]" style={{ width: treeW }}>
                {narrowTree ? wt('common.issue') : wt('timeline.work')}
              </div>
              <div className="relative shrink-0" style={{ width: gridW }}>
                {scale.top.map((s) => (
                  <div key={`t${s.x}`} className="absolute top-0 flex h-6 items-center overflow-hidden whitespace-nowrap border-l border-[var(--w-border)] px-1.5 text-[11px] font-semibold text-[var(--w-text-2)]" style={{ left: s.x, width: s.w }}>
                    <span className="truncate">{s.label}</span>
                  </div>
                ))}
                {scale.bottom.map((s) => (
                  <div
                    key={`b${s.x}`}
                    className={cn('absolute flex h-6 items-center justify-center overflow-hidden whitespace-nowrap text-[10.5px] tabular', s.dim ? 'text-[var(--w-text-3)]' : 'text-[var(--w-text-2)]', zoom !== 'weeks' && zoom !== 'days' && 'justify-start border-l border-[var(--w-border)] pl-1')}
                    style={{ left: s.x, width: s.w, top: 24 }}
                  >
                    {s.w >= 14 ? s.label : ''}
                  </div>
                ))}
                <div className="absolute h-6 w-[2px] -translate-x-1/2 rounded-full bg-[var(--w-accent)]" style={{ left: xOf(today) + dw / 2, top: 24 }} title={wt('common.today')} />
                {/* UX-C: dải mốc — sprint (dải), giai đoạn (dải viền), version (cờ ở ngày phát hành) */}
                {hasMarks && mk && (
                  <div className="absolute inset-x-0 bottom-0 border-t border-[var(--w-border)]" style={{ height: MARK_H }} aria-label={wt('uxc.markersLane')} role="group">
                    {mk.stages.filter((x) => x.start).map((st) => {
                      const a = toDay(st.start!), b = st.end ? toDay(st.end) : Math.max(a, today);
                      return <span key={`st${st.id}`} className="absolute top-[3px] flex h-[16px] items-center overflow-hidden whitespace-nowrap rounded-[4px] border border-[var(--w-border-strong)] px-1 text-[10.5px] text-[var(--w-text-2)]" style={{ left: xOf(a), width: Math.max(dw, (b - a + 1) * dw) }} title={`${wt('uxc.stage')} ${st.n}. ${st.name}`}>{st.n}. {st.name}</span>;
                    })}
                    {mk.sprints.filter((x) => x.start && x.end).map((sp) => {
                      const a = toDay(sp.start!), b = Math.max(a, toDay(sp.end!));
                      return <span key={`sp${sp.id}`} className={cn('absolute top-[3px] flex h-[16px] items-center overflow-hidden whitespace-nowrap rounded-[4px] px-1 text-[10.5px]', sp.status === 'ACTIVE' ? 'bg-[var(--w-accent-soft)] text-[var(--w-accent-text)]' : 'bg-[var(--w-sunken)] text-[var(--w-text-2)]')} style={{ left: xOf(a), width: Math.max(dw, (b - a + 1) * dw) }} title={`${sp.name} · ${shortDate(a)} – ${shortDate(b)}`}>{sp.name}</span>;
                    })}
                    {mk.versions.filter((x) => x.release).map((v) => (
                      <span key={`v${v.id}`} className="absolute top-[2px] z-[1] flex h-[18px] -translate-x-1/2 items-center gap-0.5 whitespace-nowrap rounded-[4px] bg-[var(--w-panel)] px-1 text-[10.5px] font-medium text-[var(--w-text)] shadow-[0_0_0_1px_var(--w-border-strong)]" style={{ left: xOf(toDay(v.release!)) + dw / 2 }} title={`${v.name} · ${shortDate(toDay(v.release!))}${v.status === 'RELEASED' ? ` · ${wt('timeline.released')}` : ''}`}>
                        <Flag size={10} aria-hidden="true" className={v.status === 'RELEASED' ? 'text-[var(--w-green-text)]' : 'text-[var(--w-epic,var(--w-accent))]'} />{zoom === 'quarters' ? '' : v.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex">
              {/* Cột cây (dính trái) */}
              <div className="sticky left-0 z-10 shrink-0 border-r border-[var(--w-border)] bg-[var(--w-panel)]" style={{ width: treeW, minHeight: bodyH }}>
                {rows.map((r, idx) => {
                  if (r.kind === 'group') {
                    const open = !collapsed.has('none');
                    return (
                      <button key="g-none" type="button" onClick={() => toggleCollapse('none')} className="flex w-full items-center gap-1.5 border-b border-[var(--w-border)] bg-[var(--w-sunken)] px-2 text-left text-[12px] font-medium text-[var(--w-text-2)]" style={{ height: ROW_H }}>
                        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        <span className="truncate">{r.label}</span>
                        <span className="ml-auto text-[11px] text-[var(--w-text-3)] tabular">{r.childCount}</span>
                      </button>
                    );
                  }
                  const it = r.item;
                  const type = lk.types.get(it.typeId);
                  const isEpic = r.kind === 'epic';
                  const open = isEpic && !collapsed.has(`e${it.id}`);
                  return (
                    <div
                      key={it.id}
                      onMouseEnter={() => setHoverRow(idx)}
                      onMouseLeave={() => setHoverRow((h) => (h === idx ? null : h))}
                      className={cn('group flex items-center gap-1.5 border-b border-[var(--w-border)] pr-2', hoverRow === idx && 'bg-[var(--w-hover)]', isEpic ? 'pl-1' : r.nested && !narrowTree ? 'pl-7' : 'pl-2')}
                      style={{ height: ROW_H }}
                    >
                      {isEpic && (
                        <button type="button" onClick={() => toggleCollapse(`e${it.id}`)} className="rounded p-0.5 text-[var(--w-text-3)] hover:bg-[var(--w-active)] hover:text-[var(--w-text)]" aria-label={open ? wt('timeline.collapseEpic') : wt('timeline.expandEpic')} aria-expanded={open}>
                          {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                        </button>
                      )}
                      <button type="button" onClick={() => onOpen(it.number)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left" title={`${lk.issueKey(it.number)} ${it.title}`}>
                        {!small || narrowTree ? <IssueTypeIcon type={type} size={13} /> : null}
                        <span className={cn('shrink-0 font-mono text-[11px] text-[var(--w-text-3)]', it.done && 'line-through')}>{lk.issueKey(it.number)}</span>
                        {!narrowTree && (
                          <span className={cn('min-w-0 flex-1 truncate text-[13px]', isEpic && 'font-medium', it.done && 'text-[var(--w-text-3)]')}>{it.title}</span>
                        )}
                      </button>
                      {isEpic && !narrowTree && <span className="text-[11px] text-[var(--w-text-3)] tabular">{r.childCount}</span>}
                    </div>
                  );
                })}
              </div>

              {/* Lưới ngày */}
              <div className="relative shrink-0" style={{ width: gridW, height: bodyH, backgroundImage: weekendBg, backgroundPosition: '0 0' }}>
                {scale.lines.map((x) => <div key={x} className="absolute inset-y-0 w-px bg-[var(--w-border)] opacity-60" style={{ left: x }} />)}
                {rows.map((r, idx) => (
                  <div
                    key={r.kind === 'group' ? 'g' : `r${r.item.id}`}
                    className={cn('absolute inset-x-0 border-b border-[var(--w-border)]', r.kind === 'group' && 'bg-[var(--w-sunken)] opacity-60', hoverRow === idx && r.kind !== 'group' && 'bg-[var(--w-hover)]')}
                    style={{ top: idx * ROW_H, height: ROW_H }}
                    onMouseEnter={() => setHoverRow(idx)}
                    onMouseLeave={() => setHoverRow((h) => (h === idx ? null : h))}
                  >
                    {r.kind !== 'group' && !spans.has(r.item.id) && canEdit && (
                      // UX-C: nhãn "Chưa lên lịch" chỉ hiện khi rê chuột (trước đây dòng nào cũng có ⇒ nhiễu); đếm chung ở nút trên thanh công cụ.
                      <div
                        role="button"
                        tabIndex={-1}
                        className="group/sch absolute inset-0 cursor-copy"
                        title={wt('timeline.clickDay')}
                        onClick={(e) => clickEmptyRow(e, r.item)}
                      >
                        {hoverRow === idx && (
                          <span
                            className="pointer-events-none sticky mt-[5px] inline-flex items-center gap-1 rounded-[5px] border border-dashed border-[var(--w-accent-border)] px-2 text-[11.5px] text-[var(--w-accent-text)]"
                            style={{ left: treeW + 8, height: ROW_H - 10 }}
                          >
                            <CalendarPlus size={12} /> {wt('timeline.clickStart')}
                          </span>
                        )}
                      </div>
                    )}
                    {r.kind !== 'group' && !spans.has(r.item.id) && !canEdit && hoverRow === idx && (
                      <span
                        className="pointer-events-none sticky mt-[5px] inline-flex items-center gap-1 rounded-[5px] border border-dashed border-[var(--w-border-strong)] px-2 text-[11.5px] text-[var(--w-text-3)]"
                        style={{ left: treeW + 8, height: ROW_H - 10 }}
                      >
                        {wt('timeline.notScheduled')}
                      </span>
                    )}
                  </div>
                ))}

                {/* Đường hôm nay */}
                <div className="pointer-events-none absolute inset-y-0 z-[3] w-[2px] -translate-x-1/2 bg-[var(--w-accent)] opacity-70" style={{ left: xOf(today) + dw / 2 }} />
                {/* Mốc version (UX-C): vạch đứt ở ngày phát hành */}
                {(mk?.versions ?? []).filter((v) => v.release).map((v) => (
                  <div key={`vl${v.id}`} className="pointer-events-none absolute inset-y-0 z-[2] w-0 border-l border-dashed border-[var(--w-epic,var(--w-accent))] opacity-60" style={{ left: xOf(toDay(v.release!)) + dw / 2 }} />
                ))}

                {/* Mũi tên phụ thuộc */}
                <svg className="pointer-events-none absolute left-0 top-0 z-[4]" width={gridW} height={bodyH} aria-hidden="true">
                  <defs>
                    {(['n', 'c', 'x', 'h'] as const).map((k) => (
                      <marker key={k} id={`tl-arrow-${k}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                        <path d="M0,0 L8,4 L0,8 z" fill={k === 'x' ? 'var(--w-red)' : k === 'c' ? 'var(--w-orange)' : k === 'h' ? 'var(--w-accent)' : 'var(--w-text-3)'} />
                      </marker>
                    ))}
                  </defs>
                  {arrows.map((a) => {
                    const color = a.hot ? 'var(--w-accent)' : a.conflict ? 'var(--w-red)' : a.critical ? 'var(--w-orange)' : 'var(--w-text-3)';
                    const dim = hoverBar !== null && !a.hot;
                    const tip = a.conflict
                      ? wt('timeline.blocksConflict', { a: lk.issueKey(itemById.get(a.from)?.number ?? 0), b: lk.issueKey(itemById.get(a.to)?.number ?? 0) })
                      : wt('timeline.blocks', { a: lk.issueKey(itemById.get(a.from)?.number ?? 0), b: lk.issueKey(itemById.get(a.to)?.number ?? 0) });
                    return (
                      <g key={a.key}>
                        <path d={a.path} fill="none" stroke={color} strokeWidth={a.hot ? 2.25 : a.critical || a.conflict ? 2 : 1.4} strokeDasharray={a.conflict ? '4 3' : undefined} markerEnd={`url(#tl-arrow-${a.hot ? 'h' : a.conflict ? 'x' : a.critical ? 'c' : 'n'})`} opacity={dim ? 0.25 : a.hot || a.critical || a.conflict ? 1 : 0.8} />
                        {/* Vùng bấm rộng để hiện tooltip (chỉ đường này nhận chuột) */}
                        <path d={a.path} fill="none" stroke="transparent" strokeWidth={10} style={{ pointerEvents: 'stroke' }}><title>{tip}</title></path>
                      </g>
                    );
                  })}
                </svg>

                {/* Thanh */}
                {rows.map((r, idx) => {
                  if (r.kind === 'group') return null;
                  const it = r.item;
                  const s = spans.get(it.id) as SpanX | undefined;
                  const bl = base.get(it.id);
                  const baseBar = bl && (
                    <div
                      key={`base${it.id}`}
                      className="pointer-events-none absolute z-[4] rounded-full"
                      style={{ left: xOf(bl.start), width: Math.max((bl.end - bl.start + 1) * dw, 4), top: idx * ROW_H + ROW_H - 7, height: 4, background: 'color-mix(in srgb, var(--w-text-3) 55%, transparent)' }}
                      title={wt('uxc.baselineBar', { a: shortDate(bl.start), b: shortDate(bl.end) })}
                    />
                  );
                  if (!s) return baseBar ?? null;
                  const isEpic = r.kind === 'epic';
                  const derived = !!s.derived;
                  const fb = s.fallback;
                  const draggable = canEdit && !derived;
                  const slip = bl?.slip ?? null;
                  const left = xOf(s.start);
                  const width = Math.max((s.end - s.start + 1) * dw, 6);
                  const type = lk.types.get(it.typeId);
                  const color = isEpic ? (type?.color ?? 'var(--w-epic)') : (type?.color ?? 'var(--w-accent)');
                  const isCrit = showCritical && critical.ids.has(it.id);
                  const isConflict = conflictIds.has(it.id);
                  const dragging = drag?.id === it.id;
                  const status = lk.statuses.get(it.statusId);
                  const preds = data.dependencies.filter((d2) => d2.to === it.id).length;
                  const succs = data.dependencies.filter((d2) => d2.from === it.id).length;
                  const label = `${lk.issueKey(it.number)} ${it.title}\n${shortDate(s.start)} – ${shortDate(s.end)}${derived ? wt('timeline.fromChildren') : ''}${fb ? ` ${wt(fb === 'sprint' ? 'uxc.fromSprint' : 'uxc.fromVersion', { n: fallback.get(it.id)?.label ?? '' })}` : ''}${status ? `\n${statusName(status.name)}` : ''}${it.progress > 0 && it.progress < 1 ? ` · ${wt('timeline.pctDone', { n: Math.round(it.progress * 100) })}` : ''}${preds || succs ? `\n${wt('uxc.depsLine', { a: preds, b: succs })}` : ''}${slip !== null && slip !== 0 ? `\n${slip > 0 ? wt('uxc.lateVsBaseline', { n: slip }) : wt('uxc.earlyVsBaseline', { n: -slip })}` : ''}`;
                  const dimmed = critFocus && showCritical && critical.ids.size > 0 && !isCrit;
                  return (
                    <div key={`barw${it.id}`}>
                    {baseBar}
                    {/* Trễ so với baseline — đặt NGOÀI thanh (thanh xong mờ 50% sẽ làm chữ đỏ thiếu tương phản). */}
                    {slip !== null && slip > 0 && (
                      <span
                        className="pointer-events-none absolute z-[5] whitespace-nowrap rounded-[3px] px-1 text-[10.5px] font-medium leading-[16px] tabular-nums text-[var(--w-red-text)]"
                        style={{ left: xOf(s.start) + Math.max((s.end - s.start + 1) * dw, 6) + 6, top: idx * ROW_H + 10, background: 'var(--w-panel)' }}
                      >+{slip}d</span>
                    )}
                    <div
                      key={`bar${it.id}`}
                      onMouseEnter={() => setHoverBar(it.id)}
                      onMouseLeave={() => setHoverBar((h) => (h === it.id ? null : h))}
                      className={cn(
                        'group/bar absolute z-[5] flex items-center overflow-visible rounded-[5px] text-[11.5px] font-medium select-none touch-none',
                        draggable ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-pointer',
                        it.done && 'opacity-50',
                        dimmed && 'opacity-30',
                        dragging && 'z-[6] shadow-lg',
                      )}
                      style={{
                        left, width,
                        top: idx * ROW_H + (isEpic ? 9 : 8),
                        height: ROW_H - (isEpic ? 18 : 16),
                        background: derived || fb ? `color-mix(in srgb, ${color} 12%, transparent)` : `color-mix(in srgb, ${color} 26%, var(--w-panel))`,
                        border: `1px ${derived || s.open || fb ? 'dashed' : 'solid'} ${isConflict ? 'var(--w-red)' : `color-mix(in srgb, ${color} 70%, transparent)`}`,
                        boxShadow: isCrit ? '0 0 0 2px var(--w-orange)' : hoverBar === it.id ? '0 0 0 2px var(--w-accent-border)' : undefined,
                      }}
                      title={label}
                      onPointerDown={(e) => (draggable ? startDrag(e, it, 'move') : undefined)}
                      onPointerMove={moveDrag}
                      onPointerUp={endDrag}
                      onPointerCancel={() => setDrag(null)}
                      onClick={() => { if (!draggable) onOpen(it.number); }}
                    >
                      {/* Tiến độ */}
                      {it.progress > 0 && !derived && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 rounded-l-[4px]" style={{ width: `${Math.round(it.progress * 100)}%`, background: `color-mix(in srgb, ${color} 55%, transparent)` }} />
                      )}
                      {derived && it.progress > 0 && (
                        <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] rounded-bl-[4px]" style={{ width: `${Math.round(it.progress * 100)}%`, background: color }} />
                      )}
                      {width > 48 && (
                        <span className={cn('pointer-events-none relative truncate px-1.5 text-[var(--w-text)]', fb && 'italic text-[var(--w-text-2)]')}>{it.title}</span>
                      )}
                      {width <= 48 && zoom !== 'quarters' && (
                        <span className="pointer-events-none absolute left-full ml-1.5 whitespace-nowrap text-[11px] text-[var(--w-text-2)]">{lk.issueKey(it.number)}</span>
                      )}
                      {draggable && (
                        <>
                          {/* Mép kéo đổi độ dài — move/up nổi bọt lên thanh cha, không gắn lại ở đây (gắn cả hai là lưu hai lần). */}
                          <span
                            className="absolute inset-y-0 left-0 w-[7px] cursor-ew-resize rounded-l-[5px] opacity-0 group-hover/bar:opacity-100"
                            style={{ background: `color-mix(in srgb, ${color} 80%, transparent)` }}
                            onPointerDown={(e) => startDrag(e, it, 'start')}
                          />
                          <span
                            className="absolute inset-y-0 right-0 w-[7px] cursor-ew-resize rounded-r-[5px] opacity-0 group-hover/bar:opacity-100"
                            style={{ background: `color-mix(in srgb, ${color} 80%, transparent)` }}
                            onPointerDown={(e) => startDrag(e, it, 'end')}
                          />
                        </>
                      )}
                      {dragging && drag.moved && (
                        <span className="pointer-events-none absolute -top-6 left-0 whitespace-nowrap rounded-[4px] bg-[var(--w-raised)] px-1.5 py-0.5 text-[11px] text-[var(--w-text)]" style={{ boxShadow: 'var(--w-shadow-pop)' }}>
                          {shortDate(drag.cur.start)} – {shortDate(drag.cur.end)}
                        </span>
                      )}
                    </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
