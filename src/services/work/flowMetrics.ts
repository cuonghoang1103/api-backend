/**
 * CT Work — số liệu DÒNG CHẢY (UX-B, 10/10/2026): CFD, cycle/lead time, throughput, aging WIP, release burnup,
 * velocity có đường trung bình. HÀM THUẦN (không DB) ⇒ test bằng dữ liệu dựng tay có đáp án (flowMetrics.test.ts).
 *
 * Nguồn sự thật là LỊCH SỬ thẻ (`work_history`, field `statusId` / `fixVersionId`), không phải bảng chụp:
 *   - trạng thái của thẻ tại một thời điểm = trạng thái ban đầu (vế `from` của lần đổi đầu tiên, không có lần đổi
 *     nào ⇒ trạng thái hiện tại) rồi phát lại từng lần đổi tới thời điểm đó;
 *   - nên CFD dựng lại được cho bất kỳ khoảng nào, kể cả trước khi có cron chụp, và không lệch khi cron tắt.
 *
 * Phạm vi "việc" (FLOW_SCOPE_TEXT): thẻ tầng 0 (story, task, bug, requirement…), không tính epic (sống dài, làm méo
 * cycle time), sub-task (mảnh của thẻ cha — đếm đôi) và test case (vòng đời riêng của Xray).
 *
 * Ngày là ngày lịch theo múi giờ dự án (mặc định giờ VN). "Cuối ngày D" = 00:00 ngày D+1.
 */

import { addDays, dayDiff, dayKey, startOfDay } from './contribRules.js';

export const FLOW_TZ = 'Asia/Ho_Chi_Minh';
const DAY_MS = 86_400_000;
/** Làm tròn 1 chữ số, khử sai số dấu phẩy động (8.65 không thành 8.6 vì 8.6499999…). */
const round1 = (n: number) => Math.round(Number((n * 10).toPrecision(12))) / 10;

export const FLOW_SCOPE_TEXT =
  'Counts stories, tasks, bugs and requirements (top-level work). Epics, sub-tasks and test cases are left out.';

export type Category = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface FlowStatus { id: number; name: string; category: string; position: number; color?: string | null; isDefaultWorkflow?: boolean }
export interface FlowIssue {
  id: number;
  number: number;
  title?: string;
  createdAt: Date;
  resolvedAt: Date | null;
  statusId: number;
  /** Điểm/giờ ước lượng theo đơn vị dự án (0 nếu chưa ước lượng). */
  estimate?: number;
  assigneeId?: number | null;
  fixVersionId?: number | null;
}
/** Một lần đổi field (statusId hoặc fixVersionId) — fromValue/toValue dạng chuỗi như trong work_history. */
export interface FieldChange { issueId: number; from: string | null; to: string | null; at: Date }

// ─── Phân vị ─────────────────────────────────────────────────────

/**
 * Phân vị kiểu nội suy tuyến tính (giống Excel PERCENTILE.INC / numpy mặc định):
 * vị trí h = (n−1)·p, lấy x[⌊h⌋] + (h−⌊h⌋)·(x[⌊h⌋+1] − x[⌊h⌋]). Mảng rỗng ⇒ null.
 */
export function percentile(values: number[], p: number): number | null {
  if (!values.length) return null;
  const x = [...values].sort((a, b) => a - b);
  const h = (x.length - 1) * Math.min(1, Math.max(0, p));
  const lo = Math.floor(h);
  const hi = Math.min(x.length - 1, lo + 1);
  return x[lo] + (h - lo) * (x[hi] - x[lo]);
}

// ─── Dòng thời gian của một field ────────────────────────────────

/** Nhóm thay đổi theo thẻ, sắp theo thời gian (ổn định). */
export function groupChanges(changes: FieldChange[]): Map<number, FieldChange[]> {
  const m = new Map<number, FieldChange[]>();
  for (const c of changes) {
    const a = m.get(c.issueId);
    if (a) a.push(c); else m.set(c.issueId, [c]);
  }
  for (const a of m.values()) a.sort((x, y) => x.at.getTime() - y.at.getTime());
  return m;
}

/**
 * Các đoạn giá trị của một field cho một thẻ: [{ value, from }] theo thời gian, đoạn đầu bắt đầu lúc tạo thẻ.
 * Giá trị ban đầu = `from` của lần đổi đầu tiên; không có lần đổi nào ⇒ `current`.
 */
export function segments<T>(createdAt: Date, current: T, changes: FieldChange[] | undefined, parse: (s: string | null) => T): Array<{ value: T; from: Date }> {
  if (!changes?.length) return [{ value: current, from: createdAt }];
  const out: Array<{ value: T; from: Date }> = [{ value: parse(changes[0].from), from: createdAt }];
  for (const c of changes) out.push({ value: parse(c.to), from: c.at < createdAt ? createdAt : c.at });
  return out;
}

/** Giá trị tại thời điểm t (đoạn cuối cùng bắt đầu ≤ t). t trước lúc tạo ⇒ undefined. */
export function valueAt<T>(segs: Array<{ value: T; from: Date }>, t: Date): T | undefined {
  let v: T | undefined;
  for (const s of segs) {
    if (s.from.getTime() <= t.getTime()) v = s.value;
    else break;
  }
  return v;
}

const parseId = (s: string | null) => (s === null || s === '' ? null : Number(s));

// ─── Ngày ────────────────────────────────────────────────────────

/** Mọi ngày từ a tới b (gồm hai đầu), trần `max` ngày tính từ cuối (giữ phần gần đây). */
export function dayRange(a: string, b: string, max = 400): string[] {
  const n = dayDiff(a, b);
  if (n < 0) return [];
  const start = n + 1 > max ? addDays(b, -(max - 1)) : a;
  const out: string[] = [];
  for (let i = 0; i <= dayDiff(start, b); i++) out.push(addDays(start, i));
  return out;
}

/** Thời điểm cuối ngày D (= 00:00 ngày D+1 theo tz), cắt ở `now` cho hôm nay. */
export function endOfDay(day: string, tz: string, now?: Date): Date {
  const e = startOfDay(addDays(day, 1), tz);
  return now && e > now ? now : e;
}

/** Thứ Hai của tuần chứa ngày D (YYYY-MM-DD). */
export function mondayOfDay(d: string): string {
  const [y, m, dd] = d.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, dd)).getUTCDay(); // 0 = CN
  return addDays(d, -((wd + 6) % 7));
}

// ─── CFD ─────────────────────────────────────────────────────────

export interface CfdBand { key: string; name: string; category: Category; color: string | null; statusIds: number[] }

/**
 * Dải của CFD: gộp trạng thái CÙNG TÊN (quy trình Bug riêng cũng có "In Progress"), sắp theo nhóm
 * (TODO → IN_PROGRESS → DONE) rồi vị trí trong quy trình mặc định. Biểu đồ vẽ DONE ở dưới cùng.
 */
export function cfdBands(statuses: FlowStatus[]): CfdBand[] {
  const order: Record<string, number> = { TODO: 0, IN_PROGRESS: 1, DONE: 2 };
  const byName = new Map<string, CfdBand & { pos: number }>();
  const sorted = [...statuses].sort((a, b) => Number(!!b.isDefaultWorkflow) - Number(!!a.isDefaultWorkflow) || a.position - b.position || a.id - b.id);
  for (const s of sorted) {
    const k = s.name.trim().toLowerCase();
    const b = byName.get(k);
    if (b) { b.statusIds.push(s.id); continue; }
    byName.set(k, { key: `s${s.id}`, name: s.name, category: (s.category as Category) ?? 'TODO', color: s.color ?? null, statusIds: [s.id], pos: s.position });
  }
  return [...byName.values()]
    .sort((a, b) => (order[a.category] ?? 0) - (order[b.category] ?? 0) || a.pos - b.pos)
    .map(({ pos: _pos, ...b }) => b);
}

export interface CfdPoint { day: string; [bandKey: string]: number | string }

/**
 * CFD: mỗi ngày, số thẻ (đã tạo trước cuối ngày) đang ở từng dải trạng thái lúc CUỐI ngày.
 * Thẻ đã xoá không có trong `issues` (đúng như Jira: xoá là biến khỏi báo cáo).
 */
export function computeCfd(input: {
  days: string[]; tz: string; now?: Date; statuses: FlowStatus[]; issues: FlowIssue[]; statusChanges: FieldChange[];
}): { bands: CfdBand[]; points: CfdPoint[] } {
  const bands = cfdBands(input.statuses);
  const bandOf = new Map<number, string>();
  for (const b of bands) for (const id of b.statusIds) bandOf.set(id, b.key);
  const hist = groupChanges(input.statusChanges);
  const segs = input.issues.map((i) => segments<number | null>(i.createdAt, i.statusId, hist.get(i.id), parseId));
  const points = input.days.map((day) => {
    const t = endOfDay(day, input.tz, input.now);
    const p: CfdPoint = { day };
    for (const b of bands) p[b.key] = 0;
    segs.forEach((sg) => {
      const st = valueAt(sg, t);
      if (st === undefined || st === null) return;
      const k = bandOf.get(st);
      if (k) p[k] = (p[k] as number) + 1;
    });
    return p;
  });
  return { bands, points };
}

// ─── Cycle / lead time ───────────────────────────────────────────

export interface CycleItem { issueId: number; number: number; title?: string; resolvedAt: string; day: string; cycleDays: number | null; leadDays: number }

/**
 * Lead time = resolvedAt − createdAt. Cycle time = resolvedAt − lần ĐẦU TIÊN thẻ vào một trạng thái nhóm
 * IN_PROGRESS (thẻ nhảy thẳng TODO → DONE ⇒ cycle null, vẫn có lead). Đơn vị: ngày (1 chữ số thập phân).
 */
export function computeCycleTimes(input: {
  issues: FlowIssue[]; statusChanges: FieldChange[]; statusCat: Map<number, string>; tz: string; from?: Date; to?: Date;
}): { items: CycleItem[]; cycle: Percentiles; lead: Percentiles } {
  const hist = groupChanges(input.statusChanges);
  const items: CycleItem[] = [];
  for (const i of input.issues) {
    if (!i.resolvedAt) continue;
    if (input.from && i.resolvedAt < input.from) continue;
    if (input.to && i.resolvedAt > input.to) continue;
    const first = (hist.get(i.id) ?? []).find((c) => input.statusCat.get(Number(c.to)) === 'IN_PROGRESS' && c.at <= i.resolvedAt!);
    const leadDays = round1(Math.max(0, i.resolvedAt.getTime() - i.createdAt.getTime()) / DAY_MS);
    const cycleDays = first ? round1(Math.max(0, i.resolvedAt.getTime() - first.at.getTime()) / DAY_MS) : null;
    items.push({ issueId: i.id, number: i.number, title: i.title, resolvedAt: i.resolvedAt.toISOString(), day: dayKey(i.resolvedAt, input.tz), cycleDays, leadDays });
  }
  items.sort((a, b) => a.resolvedAt.localeCompare(b.resolvedAt));
  return {
    items,
    cycle: percentiles(items.map((x) => x.cycleDays).filter((x): x is number => x !== null)),
    lead: percentiles(items.map((x) => x.leadDays)),
  };
}

export interface Percentiles { n: number; p50: number | null; p85: number | null; p95: number | null; mean: number | null }
export function percentiles(values: number[]): Percentiles {
  const r = (v: number | null) => (v === null ? null : round1(v));
  return {
    n: values.length,
    p50: r(percentile(values, 0.5)),
    p85: r(percentile(values, 0.85)),
    p95: r(percentile(values, 0.95)),
    mean: values.length ? round1(values.reduce((a, b) => a + b, 0) / values.length) : null,
  };
}

// ─── Throughput ──────────────────────────────────────────────────

export interface ThroughputWeek { week: string; end: string; count: number; points: number }

/** Số thẻ (và điểm) xong mỗi tuần (thứ Hai → Chủ nhật, theo tz), `weeks` tuần gần nhất tính tới tuần chứa `today`. */
export function computeThroughput(input: { issues: FlowIssue[]; tz: string; today: string; weeks: number }): { weeks: ThroughputWeek[]; average: number | null; averagePoints: number | null } {
  const last = mondayOfDay(input.today);
  const keys = Array.from({ length: input.weeks }, (_, k) => addDays(last, -7 * (input.weeks - 1 - k)));
  const idx = new Map(keys.map((k, i) => [k, i]));
  const out: ThroughputWeek[] = keys.map((k) => ({ week: k, end: addDays(k, 6), count: 0, points: 0 }));
  for (const i of input.issues) {
    if (!i.resolvedAt) continue;
    const w = idx.get(mondayOfDay(dayKey(i.resolvedAt, input.tz)));
    if (w === undefined) continue;
    out[w].count += 1;
    out[w].points = round1(out[w].points + (i.estimate ?? 0));
  }
  // Trung bình bỏ tuần hiện tại (chưa trọn) nếu có ≥ 2 tuần.
  const full = out.length > 1 ? out.slice(0, -1) : out;
  return {
    weeks: out,
    average: full.length ? round1(full.reduce((a, w) => a + w.count, 0) / full.length) : null,
    averagePoints: full.length ? round1(full.reduce((a, w) => a + w.points, 0) / full.length) : null,
  };
}

// ─── Aging WIP ───────────────────────────────────────────────────

export interface AgingItem { issueId: number; number: number; title?: string; statusId: number; band: string; ageDays: number; assigneeId: number | null }

/**
 * Tuổi của việc ĐANG LÀM: từ lúc thẻ vào nhóm IN_PROGRESS lần gần nhất (đầu đoạn IN_PROGRESS liên tục hiện tại)
 * tới `now`. Thẻ đang ở IN_PROGRESS mà lịch sử không có lần vào ⇒ tính từ lúc tạo.
 */
export function computeAgingWip(input: { issues: FlowIssue[]; statusChanges: FieldChange[]; statusCat: Map<number, string>; bands: CfdBand[]; now: Date }): AgingItem[] {
  const hist = groupChanges(input.statusChanges);
  const bandOf = new Map<number, string>();
  for (const b of input.bands) for (const id of b.statusIds) bandOf.set(id, b.key);
  const out: AgingItem[] = [];
  for (const i of input.issues) {
    if (i.resolvedAt) continue;
    if (input.statusCat.get(i.statusId) !== 'IN_PROGRESS') continue;
    const segs = segments<number | null>(i.createdAt, i.statusId, hist.get(i.id), parseId);
    let since = i.createdAt;
    for (let k = segs.length - 1; k >= 0; k--) {
      if (input.statusCat.get(segs[k].value ?? -1) === 'IN_PROGRESS') since = segs[k].from;
      else break;
    }
    out.push({
      issueId: i.id, number: i.number, title: i.title, statusId: i.statusId, band: bandOf.get(i.statusId) ?? `s${i.statusId}`,
      ageDays: round1(Math.max(0, input.now.getTime() - since.getTime()) / DAY_MS), assigneeId: i.assigneeId ?? null,
    });
  }
  return out.sort((a, b) => b.ageDays - a.ageDays);
}

// ─── Release burnup / burndown ───────────────────────────────────

export interface ReleasePoint { day: string; scope: number; done: number; remaining: number; ideal: number | null }

/**
 * Burnup của một version: mỗi ngày, phạm vi = tổng ước lượng (hoặc số thẻ khi `byCount`) của thẻ ĐANG gắn version
 * lúc cuối ngày (phát lại lịch sử `fixVersionId`), xong = phần trong đó đã ở trạng thái nhóm DONE lúc cuối ngày.
 * Đường lý tưởng (burndown): từ phạm vi ngày đầu về 0 vào ngày phát hành dự kiến.
 */
export function computeReleaseBurnup(input: {
  versionId: number; days: string[]; tz: string; now?: Date; issues: FlowIssue[]; versionChanges: FieldChange[]; statusChanges: FieldChange[];
  statusCat: Map<number, string>; byCount: boolean; releaseDay?: string | null;
}): ReleasePoint[] {
  const vHist = groupChanges(input.versionChanges);
  const sHist = groupChanges(input.statusChanges);
  const rows = input.issues.map((i) => ({
    i,
    v: segments<number | null>(i.createdAt, i.fixVersionId ?? null, vHist.get(i.id), parseId),
    s: segments<number | null>(i.createdAt, i.statusId, sHist.get(i.id), parseId),
  }));
  const pts = input.days.map((day) => {
    const t = endOfDay(day, input.tz, input.now);
    let scope = 0;
    let done = 0;
    for (const r of rows) {
      if (valueAt(r.v, t) !== input.versionId) continue;
      const w = input.byCount ? 1 : r.i.estimate ?? 0;
      scope += w;
      const st = valueAt(r.s, t);
      if (st !== undefined && st !== null && input.statusCat.get(st) === 'DONE') done += w;
    }
    return { day, scope: round1(scope), done: round1(done), remaining: round1(scope - done), ideal: null as number | null };
  });
  if (pts.length && input.releaseDay) {
    const start = pts[0];
    const span = dayDiff(start.day, input.releaseDay);
    for (const p of pts) {
      const k = dayDiff(start.day, p.day);
      p.ideal = span > 0 ? round1(Math.max(0, start.remaining * (1 - k / span))) : null;
    }
  }
  return pts;
}

// ─── Velocity ────────────────────────────────────────────────────

/** Trung bình trượt `n` sprint (gồm sprint hiện tại): sprint thứ k ⇒ TB completed của sprint max(0,k−n+1)…k. */
export function rollingAverage(values: number[], n = 3): number[] {
  return values.map((_, k) => {
    const w = values.slice(Math.max(0, k - n + 1), k + 1);
    return round1(w.reduce((a, b) => a + b, 0) / w.length);
  });
}
