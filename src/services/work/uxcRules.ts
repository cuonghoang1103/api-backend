/**
 * CT Work UX-C (11/10/2026) — LUẬT THUẦN (không DB) cho:
 *   · "Kẹt" trên trang Team overview: số ngày một thẻ đã nằm ở TRẠNG THÁI hiện tại (không phải nhóm trạng thái) và
 *     ngưỡng coi là kẹt.
 *   · Baseline của Timeline (C5): chụp kế hoạch + so kế hoạch gốc với hiện tại.
 *   · WBS kéo-thả: kiểm cha hợp lệ theo tầng loại thẻ, chặn vòng, chọn hàng xóm để tính rank.
 *   · Tổng effort theo nhánh / iteration của WBS (dùng lại cho thanh Gantt nhỏ theo nhánh).
 * Có test đáp án tay: uxcRules.test.ts.
 */

import type { FieldChange } from './flowMetrics.js';

const DAY_MS = 86_400_000;
const round1 = (n: number) => Math.round(n * 10) / 10;

// ═══ Kẹt (time in status) ═════════════════════════════════════════

/** Trạng thái "chờ review": tên có review / QA / verify / approval (không phân biệt hoa thường, cả tiếng Việt "duyệt"). */
export function isReviewStatus(name: string): boolean {
  return /\b(review|reviewing|qa|verify|verification|approval|code ?review)\b|duyệt|kiểm tra/i.test(name);
}

export interface StuckStatus { id: number; name: string; category: string }
export interface StuckIssue { id: number; number: number; title: string; statusId: number; assigneeId: number | null; createdAt: Date; flaggedAt?: Date | null }
export interface StuckItem {
  issueId: number; number: number; title: string; statusId: number; statusName: string; assigneeId: number | null;
  /** Số ngày ở TRẠNG THÁI hiện tại (1 chữ số thập phân). */
  days: number;
  /** Ngưỡng đã áp (ngày). */
  threshold: number;
  reason: 'REVIEW' | 'IN_PROGRESS' | 'BLOCKED';
}

/**
 * Ngưỡng "kẹt":
 *   · trạng thái review: 2 ngày (review là hàng chờ — để lâu là nghẽn của cả nhóm);
 *   · trạng thái đang làm khác: max(3, P85 cycle time của dự án) — dự án chậm tự nhiên không bị báo động giả;
 *   · thẻ gắn cờ Blocked: luôn kẹt, kể từ lúc gắn cờ (≥ 0 ngày).
 * Chỉ xét thẻ ở nhóm IN_PROGRESS (thẻ To do nằm lâu là chuyện backlog, không phải kẹt).
 */
export function stuckThreshold(statusName: string, p85: number | null): { days: number; reason: 'REVIEW' | 'IN_PROGRESS' } {
  if (isReviewStatus(statusName)) return { days: 2, reason: 'REVIEW' };
  return { days: Math.max(3, Math.ceil(p85 ?? 0)), reason: 'IN_PROGRESS' };
}

/** Thời điểm thẻ vào trạng thái hiện tại: lần đổi statusId CUỐI có `to` = trạng thái hiện tại; không có ⇒ ngày tạo. */
export function enteredStatusAt(issue: Pick<StuckIssue, 'id' | 'statusId' | 'createdAt'>, changes: FieldChange[]): Date {
  let at: Date | null = null;
  for (const c of changes) {
    if (c.issueId !== issue.id) continue;
    if (c.to === String(issue.statusId) && (!at || c.at >= at)) at = c.at;
  }
  return at ?? issue.createdAt;
}

/** Số ngày ở trạng thái hiện tại của từng thẻ (1 chữ số thập phân). */
export function statusAges(issues: Array<Pick<StuckIssue, 'id' | 'statusId' | 'createdAt'>>, changes: FieldChange[], now: Date): Map<number, number> {
  const by = new Map<number, FieldChange[]>();
  for (const c of changes) {
    const arr = by.get(c.issueId) ?? [];
    arr.push(c);
    by.set(c.issueId, arr);
  }
  return new Map(issues.map((i) => [i.id, round1(Math.max(0, now.getTime() - enteredStatusAt(i, by.get(i.id) ?? []).getTime()) / DAY_MS)]));
}

export function computeStuck(input: {
  issues: StuckIssue[]; statusChanges: FieldChange[]; statuses: StuckStatus[]; now: Date; p85: number | null;
}): StuckItem[] {
  const byId = new Map(input.statuses.map((s) => [s.id, s]));
  const changesBy = new Map<number, FieldChange[]>();
  for (const c of input.statusChanges) {
    const arr = changesBy.get(c.issueId) ?? [];
    arr.push(c);
    changesBy.set(c.issueId, arr);
  }
  const out: StuckItem[] = [];
  for (const i of input.issues) {
    const st = byId.get(i.statusId);
    if (!st || st.category !== 'IN_PROGRESS') continue;
    const since = enteredStatusAt(i, changesBy.get(i.id) ?? []);
    const days = round1(Math.max(0, input.now.getTime() - since.getTime()) / DAY_MS);
    if (i.flaggedAt) {
      out.push({ issueId: i.id, number: i.number, title: i.title, statusId: i.statusId, statusName: st.name, assigneeId: i.assigneeId, days, threshold: 0, reason: 'BLOCKED' });
      continue;
    }
    const th = stuckThreshold(st.name, input.p85);
    if (days >= th.days) {
      out.push({ issueId: i.id, number: i.number, title: i.title, statusId: i.statusId, statusName: st.name, assigneeId: i.assigneeId, days, threshold: th.days, reason: th.reason });
    }
  }
  const order = { BLOCKED: 0, REVIEW: 1, IN_PROGRESS: 2 } as const;
  return out.sort((a, b) => order[a.reason] - order[b.reason] || b.days - a.days || a.number - b.number);
}

// ═══ Baseline (C5) ════════════════════════════════════════════════

export interface PlanItem { id: number; number: number; start: string | null; due: string | null }
export interface BaselineRow { id: number; number: number; start: string | null; due: string | null }

/** Chụp kế hoạch: chỉ thẻ CÓ ngày (thẻ chưa lên lịch không có gì để so). Ngày dạng YYYY-MM-DD. */
export function snapshotPlan(items: PlanItem[], max = 1500): BaselineRow[] {
  return items.filter((i) => i.start || i.due).slice(0, max).map((i) => ({ id: i.id, number: i.number, start: i.start, due: i.due }));
}

export type BaselineState = 'SLIPPED' | 'AHEAD' | 'ON_PLAN' | 'ADDED' | 'REMOVED' | 'UNSCHEDULED';
export interface BaselineDiff {
  id: number; number: number; baseStart: string | null; baseDue: string | null; start: string | null; due: string | null;
  /** Hạn hiện tại − hạn gốc (ngày; dương = trễ). null khi một bên thiếu hạn. */
  slipDays: number | null;
  state: BaselineState;
}
export interface BaselineSummary { slipped: number; ahead: number; onPlan: number; added: number; removed: number; unscheduled: number; maxSlip: number; avgSlip: number | null }

const dayNum = (s: string) => Math.round(Date.parse(`${s.slice(0, 10)}T00:00:00Z`) / DAY_MS);

/**
 * So kế hoạch gốc với hiện tại. "Mốc" của một thẻ là hạn (due); thiếu hạn thì dùng ngày bắt đầu.
 *   ADDED       — thẻ có lịch bây giờ mà gốc không có (phạm vi/kế hoạch mới thêm);
 *   REMOVED     — thẻ có trong gốc nhưng đã xoá hoặc không còn trên timeline;
 *   UNSCHEDULED — vẫn còn nhưng đã bị gỡ hết ngày;
 *   SLIPPED/AHEAD/ON_PLAN theo dấu của slipDays.
 */
export function compareBaseline(current: PlanItem[], baseline: BaselineRow[]): { rows: BaselineDiff[]; summary: BaselineSummary } {
  const cur = new Map(current.map((i) => [i.id, i]));
  const base = new Map(baseline.map((b) => [b.id, b]));
  const rows: BaselineDiff[] = [];
  const mark = (x: { start: string | null; due: string | null }) => x.due ?? x.start;
  for (const b of baseline) {
    const c = cur.get(b.id);
    if (!c) { rows.push({ id: b.id, number: b.number, baseStart: b.start, baseDue: b.due, start: null, due: null, slipDays: null, state: 'REMOVED' }); continue; }
    const m0 = mark(b), m1 = mark(c);
    if (!m1) { rows.push({ id: b.id, number: c.number, baseStart: b.start, baseDue: b.due, start: c.start, due: c.due, slipDays: null, state: 'UNSCHEDULED' }); continue; }
    const slip = m0 ? dayNum(m1) - dayNum(m0) : null;
    rows.push({
      id: b.id, number: c.number, baseStart: b.start, baseDue: b.due, start: c.start, due: c.due, slipDays: slip,
      state: slip === null ? 'ADDED' : slip > 0 ? 'SLIPPED' : slip < 0 ? 'AHEAD' : 'ON_PLAN',
    });
  }
  for (const c of current) {
    if (base.has(c.id) || !mark(c)) continue;
    rows.push({ id: c.id, number: c.number, baseStart: null, baseDue: null, start: c.start, due: c.due, slipDays: null, state: 'ADDED' });
  }
  const slips = rows.filter((r) => r.state === 'SLIPPED').map((r) => r.slipDays!);
  const withSlip = rows.filter((r) => r.slipDays !== null).map((r) => r.slipDays!);
  const count = (s: BaselineState) => rows.filter((r) => r.state === s).length;
  return {
    rows: rows.sort((a, b) => (b.slipDays ?? -1e9) - (a.slipDays ?? -1e9) || a.number - b.number),
    summary: {
      slipped: count('SLIPPED'), ahead: count('AHEAD'), onPlan: count('ON_PLAN'), added: count('ADDED'), removed: count('REMOVED'), unscheduled: count('UNSCHEDULED'),
      maxSlip: slips.length ? Math.max(...slips) : 0,
      avgSlip: withSlip.length ? round1(withSlip.reduce((a, b) => a + b, 0) / withSlip.length) : null,
    },
  };
}

// ═══ WBS kéo-thả ═════════════════════════════════════════════════

export interface WbsNode { id: number; parentId: number | null; level: number; rank: string; typeKey?: string }
export interface WbsMoveInput { id: number; parentId: number | null; beforeId?: number | null; afterId?: number | null }
export type WbsMoveError = 'NOT_FOUND' | 'SELF' | 'CYCLE' | 'BAD_PARENT_LEVEL' | 'SUBTASK_NEEDS_PARENT' | 'EPIC_NO_PARENT' | 'BAD_NEIGHBOR';
export interface WbsMovePlan { parentId: number | null; prevRank: string | null; nextRank: string | null; parentChanged: boolean }

/**
 * Kiểm một lần thả trong cây WBS và trả hai rank kề để tính rank mới (rankBetween).
 *   · cha phải đúng tầng: con tầng L cần cha tầng L+1 (epic 1 ⊃ story/task/bug 0 ⊃ sub-task −1) — y luật assertParent;
 *   · sub-task không đứng gốc; epic không có cha;
 *   · không thả vào chính mình / con cháu của mình (vòng);
 *   · `beforeId`/`afterId` (nếu có) phải là anh em trong danh sách con của cha mới.
 * "Đổi cấp" trong WBS = đổi cha (thụt/nhô): kéo story sang epic khác, kéo sub-task sang story khác. Đổi TẦNG LOẠI
 * (story ⇒ sub-task) là đổi loại thẻ — không làm ở đây.
 */
export function planWbsMove(nodes: WbsNode[], input: WbsMoveInput): WbsMovePlan | { error: WbsMoveError } {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const me = byId.get(input.id);
  if (!me) return { error: 'NOT_FOUND' };
  const pid = input.parentId ?? null;
  if (pid === me.id) return { error: 'SELF' };
  if (pid !== null) {
    const parent = byId.get(pid);
    if (!parent) return { error: 'NOT_FOUND' };
    if (me.level === 1) return { error: 'EPIC_NO_PARENT' };
    // Cha là con cháu của mình ⇒ vòng.
    const seen = new Set<number>();
    for (let c: WbsNode | undefined = parent; c; c = c.parentId !== null ? byId.get(c.parentId) : undefined) {
      if (c.id === me.id) return { error: 'CYCLE' };
      if (seen.has(c.id)) break;
      seen.add(c.id);
    }
    if (parent.level !== me.level + 1) return { error: 'BAD_PARENT_LEVEL' };
  } else if (me.level === -1) {
    return { error: 'SUBTASK_NEEDS_PARENT' };
  }
  const siblings = nodes
    .filter((n) => (n.parentId ?? null) === pid && n.id !== me.id)
    .sort((a, b) => (a.rank < b.rank ? -1 : a.rank > b.rank ? 1 : a.id - b.id));
  let prev: WbsNode | null = null;
  let next: WbsNode | null = null;
  if (input.beforeId != null) {
    // Đặt NGAY TRƯỚC beforeId.
    const k = siblings.findIndex((s) => s.id === input.beforeId);
    if (k < 0) return { error: 'BAD_NEIGHBOR' };
    next = siblings[k];
    prev = k > 0 ? siblings[k - 1] : null;
  } else if (input.afterId != null) {
    const k = siblings.findIndex((s) => s.id === input.afterId);
    if (k < 0) return { error: 'BAD_NEIGHBOR' };
    prev = siblings[k];
    next = siblings[k + 1] ?? null;
  } else {
    // Không nói vị trí ⇒ cuối danh sách con.
    prev = siblings[siblings.length - 1] ?? null;
  }
  return { parentId: pid, prevRank: prev?.rank ?? null, nextRank: next?.rank ?? null, parentChanged: (me.parentId ?? null) !== pid };
}

// ═══ Tổng theo nhánh (thanh Gantt nhỏ + cột Σ) ═════════════════════

export interface BranchInput { issueId: number; depth: number; plannedDays: number | null; actualDays: number; start: string | null; due: string | null; iteration: string }
export interface BranchTotal { issueId: number; planned: number; actual: number; start: string | null; end: string | null; leaves: number }

/**
 * Dòng WBS theo thứ tự cây (cha rồi tới con, `depth` tăng 1). Trả tổng effort dự kiến/thực tế của CẢ NHÁNH (gồm chính
 * nó) + khoảng ngày bao mọi thẻ trong nhánh (Gantt nhỏ). Một lượt từ dưới lên bằng ngăn xếp — O(n).
 */
export function branchTotals(rows: BranchInput[]): Map<number, BranchTotal> {
  const out = new Map<number, BranchTotal>();
  const stack: BranchTotal[] = [];
  const depthOf: number[] = [];
  const close = (toDepth: number) => {
    while (depthOf.length && depthOf[depthOf.length - 1] >= toDepth) {
      const done = stack.pop()!;
      depthOf.pop();
      done.planned = Math.round(done.planned * 100) / 100;
      done.actual = Math.round(done.actual * 100) / 100;
      out.set(done.issueId, done);
      const parent = stack[stack.length - 1];
      if (parent) {
        parent.planned += done.planned;
        parent.actual += done.actual;
        parent.leaves += done.leaves;
        if (done.start && (!parent.start || done.start < parent.start)) parent.start = done.start;
        if (done.end && (!parent.end || done.end > parent.end)) parent.end = done.end;
      }
    }
  };
  for (let k = 0; k < rows.length; k++) {
    const r = rows[k];
    close(r.depth);
    const isLeaf = !(rows[k + 1] && rows[k + 1].depth > r.depth);
    const start = r.start ?? r.due;
    const end = r.due ?? r.start;
    stack.push({ issueId: r.issueId, planned: r.plannedDays ?? 0, actual: r.actualDays, start, end, leaves: isLeaf ? 1 : 0 });
    depthOf.push(r.depth);
  }
  close(-1);
  return out;
}

/** Tổng theo iteration chỉ cộng effort RIÊNG từng dòng (không cộng dồn cha ⇒ không đếm trùng). */
export function iterationTotals(rows: BranchInput[]): Array<{ iteration: string; planned: number; actual: number; items: number }> {
  const m = new Map<string, { planned: number; actual: number; items: number }>();
  for (const r of rows) {
    const k = r.iteration || '';
    const cur = m.get(k) ?? { planned: 0, actual: 0, items: 0 };
    cur.planned += r.plannedDays ?? 0;
    cur.actual += r.actualDays;
    if (r.plannedDays !== null) cur.items += 1;
    m.set(k, cur);
  }
  return [...m.entries()]
    .sort(([a], [b]) => (a === '' ? 1 : b === '' ? -1 : a.localeCompare(b, undefined, { numeric: true })))
    .map(([iteration, v]) => ({ iteration, planned: Math.round(v.planned * 100) / 100, actual: Math.round(v.actual * 100) / 100, items: v.items }));
}
