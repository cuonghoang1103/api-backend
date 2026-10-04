/**
 * CT Work — luật THUẦN (không chạm DB) cho Danh mục dự án (portfolio) và Khối
 * lượng việc (workload) nhiều dự án — đợt S3a (04/10/2026). Test bằng bảng ở
 * portfolio.test.ts.
 *
 * Nguyên tắc: KHÔNG AI, KHÔNG số bịa. Mọi màu RAG đều kèm lý do đọc được, mỗi
 * lý do trỏ đúng một con số đếm từ dữ liệu có sẵn (thẻ, sprint, version, phê
 * duyệt, liên kết BLOCKS). Đổi ngưỡng = đổi hằng số dưới đây (và bài trợ giúp
 * "Portfolio & workload" + RAG_RULE_TEXT phải nói cùng một điều).
 */

import type { PaceStatus } from './sprintPace.js';

// ═══ Sức khoẻ RAG ═════════════════════════════════════════════════

export type Rag = 'RED' | 'AMBER' | 'GREEN';

/** Ngưỡng — một chỗ duy nhất. */
export const RAG_RULES = {
  /** Đỏ khi số thẻ quá hạn ≥ con số này (bất kể tỉ lệ)… */
  RED_OVERDUE_ABS: 10,
  /** …hoặc ≥ RED_OVERDUE_MIN thẻ VÀ chiếm ≥ RED_OVERDUE_SHARE số thẻ đang mở. */
  RED_OVERDUE_MIN: 3,
  RED_OVERDUE_SHARE: 0.25,
  /** Sprint AT_RISK "nặng": tốc độ cần ≥ hệ số này × tốc độ gần đây (hoặc chưa đốt được gì). */
  RED_PACE_RATIO: 2,
  /** Vàng: mốc tới hạn trong ≤ N ngày mà mới xong < tỉ lệ này số thẻ của mốc. */
  AMBER_MILESTONE_DAYS: 7,
  AMBER_MILESTONE_DONE: 0.8,
  /** Vàng: có phê duyệt chờ lâu hơn N ngày. */
  AMBER_APPROVAL_DAYS: 3,
} as const;

/** Bản chữ của luật — trả kèm API để giao diện hiện "How is health computed?". */
export const RAG_RULE_TEXT: Array<{ level: Exclude<Rag, 'GREEN'>; text: string }> = [
  { level: 'RED', text: 'A milestone (unreleased version) is past its release date.' },
  { level: 'RED', text: 'The active sprint ended with work remaining.' },
  { level: 'RED', text: `The active sprint is at risk and needs ≥ ${RAG_RULES.RED_PACE_RATIO}× its recent pace (or nothing was burned yet).` },
  { level: 'RED', text: `${RAG_RULES.RED_OVERDUE_ABS}+ overdue issues, or ${RAG_RULES.RED_OVERDUE_MIN}+ overdue issues that are ≥ ${Math.round(RAG_RULES.RED_OVERDUE_SHARE * 100)}% of open issues.` },
  { level: 'AMBER', text: 'The active sprint is at risk (needs > 1.3× its recent pace).' },
  { level: 'AMBER', text: 'At least one overdue issue.' },
  { level: 'AMBER', text: `A milestone is due within ${RAG_RULES.AMBER_MILESTONE_DAYS} days with < ${Math.round(RAG_RULES.AMBER_MILESTONE_DONE * 100)}% of its issues done.` },
  { level: 'AMBER', text: 'An open issue is blocked by an unfinished issue in another project.' },
  { level: 'AMBER', text: `An approval has been waiting more than ${RAG_RULES.AMBER_APPROVAL_DAYS} days.` },
];

export interface RagReason {
  level: Rag;
  /** Mã máy đọc (lọc/test), chữ cho người đọc. */
  code:
    | 'MILESTONE_LATE' | 'SPRINT_ENDED' | 'SPRINT_PACE_SEVERE' | 'OVERDUE_MANY'
    | 'SPRINT_AT_RISK' | 'OVERDUE_SOME' | 'MILESTONE_SOON' | 'BLOCKED_CROSS' | 'APPROVAL_WAITING'
    | 'ALL_CLEAR';
  text: string;
}

export interface RagInput {
  open: number;
  overdue: number;
  sprint: {
    name: string;
    status: PaceStatus;
    daysLeft: number;
    neededPerDay: number;
    recentPerDay: number;
    unit: 'POINTS' | 'HOURS';
  } | null;
  /** Mốc chưa phát hành CÓ ngày; daysUntil âm = đã trễ. */
  milestones: Array<{ name: string; date: string; daysUntil: number; total: number; done: number }>;
  /** Số thẻ đang mở của dự án bị chặn bởi thẻ chưa xong ở dự án KHÁC. */
  blockedBy: number;
  pendingApprovals: number;
  /** Tuổi (ngày) của phê duyệt chờ lâu nhất; null = không có. */
  oldestPendingApprovalDays: number | null;
}

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

export function ragOf(i: RagInput): { rag: Rag; reasons: RagReason[] } {
  const reasons: RagReason[] = [];
  const u = i.sprint?.unit === 'HOURS' ? 'h' : 'pts';

  // ── ĐỎ ──
  for (const m of i.milestones) {
    if (m.daysUntil < 0) {
      reasons.push({ level: 'RED', code: 'MILESTONE_LATE', text: `Milestone "${m.name}" was due ${m.date} (${plural(-m.daysUntil, 'day')} ago) and is not released.` });
    }
  }
  let sprintCounted = false;
  if (i.sprint && i.sprint.status === 'AT_RISK') {
    const s = i.sprint;
    if (s.daysLeft === 0) {
      reasons.push({ level: 'RED', code: 'SPRINT_ENDED', text: `Sprint "${s.name}" passed its end date with work remaining.` });
      sprintCounted = true;
    } else if (s.recentPerDay <= 0 || s.neededPerDay >= s.recentPerDay * RAG_RULES.RED_PACE_RATIO) {
      reasons.push({
        level: 'RED', code: 'SPRINT_PACE_SEVERE',
        text: `Sprint "${s.name}" needs ${s.neededPerDay} ${u}/day but recent pace is ${s.recentPerDay} ${u}/day (≥ ${RAG_RULES.RED_PACE_RATIO}× short).`,
      });
      sprintCounted = true;
    }
  }
  const overdueRed = i.overdue >= RAG_RULES.RED_OVERDUE_ABS
    || (i.overdue >= RAG_RULES.RED_OVERDUE_MIN && i.open > 0 && i.overdue / i.open >= RAG_RULES.RED_OVERDUE_SHARE);
  if (overdueRed) {
    reasons.push({ level: 'RED', code: 'OVERDUE_MANY', text: `${plural(i.overdue, 'issue')} overdue out of ${i.open} open (${Math.round((i.overdue / Math.max(1, i.open)) * 100)}%).` });
  }

  // ── VÀNG ──
  if (i.sprint && i.sprint.status === 'AT_RISK' && !sprintCounted) {
    const s = i.sprint;
    reasons.push({ level: 'AMBER', code: 'SPRINT_AT_RISK', text: `Sprint "${s.name}" needs ${s.neededPerDay} ${u}/day vs recent ${s.recentPerDay} ${u}/day, ${plural(s.daysLeft, 'day')} left.` });
  }
  if (!overdueRed && i.overdue > 0) {
    reasons.push({ level: 'AMBER', code: 'OVERDUE_SOME', text: `${plural(i.overdue, 'issue')} overdue out of ${i.open} open.` });
  }
  for (const m of i.milestones) {
    if (m.daysUntil < 0 || m.daysUntil > RAG_RULES.AMBER_MILESTONE_DAYS || m.total === 0) continue;
    const share = m.done / m.total;
    if (share < RAG_RULES.AMBER_MILESTONE_DONE) {
      const when = m.daysUntil === 0 ? 'today' : `in ${plural(m.daysUntil, 'day')}`;
      reasons.push({ level: 'AMBER', code: 'MILESTONE_SOON', text: `Milestone "${m.name}" is due ${when} with ${m.done}/${m.total} issues done (${Math.round(share * 100)}%).` });
    }
  }
  if (i.blockedBy > 0) {
    reasons.push({ level: 'AMBER', code: 'BLOCKED_CROSS', text: `${plural(i.blockedBy, 'open issue')} blocked by unfinished work in another project.` });
  }
  if (i.oldestPendingApprovalDays !== null && i.oldestPendingApprovalDays > RAG_RULES.AMBER_APPROVAL_DAYS) {
    reasons.push({
      level: 'AMBER', code: 'APPROVAL_WAITING',
      text: `${plural(i.pendingApprovals, 'approval')} pending; the oldest has waited ${plural(i.oldestPendingApprovalDays, 'day')}.`,
    });
  }

  const rag: Rag = reasons.some((r) => r.level === 'RED') ? 'RED' : reasons.length ? 'AMBER' : 'GREEN';
  if (rag === 'GREEN') {
    const bits = [
      i.overdue === 0 ? 'no overdue issues' : null,
      i.milestones.length ? 'milestones on schedule' : 'no dated milestones',
      i.sprint ? (i.sprint.status === 'ON_TRACK' ? 'sprint on track' : `sprint ${i.sprint.status.toLowerCase().replace('_', ' ')}`) : 'no active sprint',
      'nothing blocked from other projects',
    ].filter(Boolean);
    reasons.push({ level: 'GREEN', code: 'ALL_CLEAR', text: `${bits.join(', ')}.`.replace(/^./, (c) => c.toUpperCase()) });
  }
  // Đỏ trước, rồi vàng.
  const order: Record<Rag, number> = { RED: 0, AMBER: 1, GREEN: 2 };
  reasons.sort((a, b) => order[a.level] - order[b.level]);
  return { rag, reasons };
}

/** Số ngày lịch từ `today` tới `day` (YYYY-MM-DD, âm = đã qua). */
export function daysBetween(today: string, day: string): number {
  return Math.round((Date.parse(`${day}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86_400_000);
}

// ═══ Khối lượng việc ══════════════════════════════════════════════

/**
 * QUY ĐỔI giờ (ghi rõ để người đọc báo cáo biết con số từ đâu ra):
 *   1. `remainingEstimateMin` nếu có (giờ còn lại người làm tự cập nhật / worklog trừ dần);
 *   2. không có ⇒ `originalEstimateMin − timeSpentMin` (không âm);
 *   3. không có ước lượng giờ ⇒ `storyPoints × hoursPerPoint` (mặc định 4 h/điểm, đổi qua ?hoursPerPoint=);
 *   4. không có gì ⇒ 0 giờ, đếm vào "unestimated" (không đoán).
 * Thẻ CHA có việc con mang ước lượng ⇒ bỏ giờ của chính thẻ cha (việc con là phần chia nhỏ — tránh đếm đôi).
 * Epic (tầng 1) không tính.
 *
 * NĂNG LỰC (giờ/ngày): tổng `capacityHours` người đó đã đặt ở các dự án trong phạm vi;
 * chưa đặt ở dự án nào ⇒ mặc định 8 h/ngày (cờ capacitySource = 'default'); trần 24.
 * Năng lực tuần = giờ/ngày × số ngày T2–T6 trong tuần (trong khoảng xem, từ HÔM NAY trở đi) − ngày nghỉ (WorkTimeOff).
 *
 * PHÂN BỔ theo ngày: giờ của thẻ rải đều lên các ngày làm việc từ max(ngày bắt đầu, hôm nay)
 * tới hạn (bỏ ngày nghỉ của người đó); không còn ngày nào ⇒ dồn vào ngày hạn. Thẻ đã QUÁ HẠN ⇒
 * toàn bộ giờ dồn vào NGÀY LÀM VIỆC GẦN NHẤT kể từ hôm nay (việc vẫn phải làm; hôm nay CN ⇒ T2). Thẻ không có hạn ⇒ không vào lưới, đếm "unscheduled".
 * Quá tải = một tuần có giờ > năng lực (100%), hoặc có giờ mà năng lực = 0 (nghỉ cả tuần).
 */
export const WORKLOAD_RULES = {
  DEFAULT_HOURS_PER_DAY: 8,
  DEFAULT_HOURS_PER_POINT: 4,
  MAX_HOURS_PER_DAY: 24,
  OVERLOAD_PCT: 100,
  HIGH_PCT: 85,
  MAX_WEEKS: 26,
} as const;

export type HoursSource = 'remaining' | 'original' | 'points' | 'none' | 'children';

export function issueHours(
  i: { remainingEstimateMin: number | null; originalEstimateMin: number | null; timeSpentMin?: number | null; storyPoints: number | null; hasEstimatedChildren?: boolean },
  hoursPerPoint: number = WORKLOAD_RULES.DEFAULT_HOURS_PER_POINT,
): { hours: number; source: HoursSource } {
  if (i.hasEstimatedChildren) return { hours: 0, source: 'children' };
  if (i.remainingEstimateMin !== null && i.remainingEstimateMin !== undefined) return { hours: r1(i.remainingEstimateMin / 60), source: 'remaining' };
  if (i.originalEstimateMin) return { hours: r1(Math.max(0, i.originalEstimateMin - (i.timeSpentMin ?? 0)) / 60), source: 'original' };
  if (i.storyPoints) return { hours: r1(i.storyPoints * hoursPerPoint), source: 'points' };
  return { hours: 0, source: 'none' };
}

const DAY = 86_400_000;
const r1 = (n: number) => Math.round(n * 10) / 10;
const toDay = (t: number) => new Date(t).toISOString().slice(0, 10);
const parse = (d: string) => Date.parse(`${d}T00:00:00Z`);

export const isWeekday = (d: string) => {
  const w = new Date(parse(d)).getUTCDay();
  return w !== 0 && w !== 6;
};

export const offOn = (d: string, off: Array<{ start: string; end: string }>) => off.some((o) => d >= o.start && d <= o.end);

/** Thứ Hai của tuần chứa `d`. */
export function mondayOf(d: string): string {
  const t = parse(d);
  const w = new Date(t).getUTCDay(); // 0 = CN
  return toDay(t - ((w + 6) % 7) * DAY);
}

export function addDays(d: string, n: number): string {
  return toDay(parse(d) + n * DAY);
}

/** Các tuần (T2 → CN) phủ [from, to]; from/to nên đã chuẩn hoá về T2 / CN. */
export function weeksOf(from: string, to: string): Array<{ start: string; end: string }> {
  const out: Array<{ start: string; end: string }> = [];
  for (let s = mondayOf(from); s <= to && out.length < WORKLOAD_RULES.MAX_WEEKS; s = addDays(s, 7)) {
    out.push({ start: s, end: addDays(s, 6) });
  }
  return out;
}

/** Ngày làm việc (T2–T6, không nghỉ) trong [a, b]. */
export function workDays(a: string, b: string, off: Array<{ start: string; end: string }> = []): string[] {
  const out: string[] = [];
  for (let t = parse(a); t <= parse(b); t += DAY) {
    const d = toDay(t);
    if (isWeekday(d) && !offOn(d, off)) out.push(d);
  }
  return out;
}

/** Ngày làm việc đầu tiên ≥ `d` (bỏ cuối tuần + ngày nghỉ; tìm tối đa 30 ngày, không thấy ⇒ chính `d`). */
export function nextWorkDay(d: string, off: Array<{ start: string; end: string }> = []): string {
  for (let i = 0; i < 30; i++) {
    const x = addDays(d, i);
    if (isWeekday(x) && !offOn(x, off)) return x;
  }
  return d;
}

/** Rải giờ của một thẻ theo ngày (xem chú thích WORKLOAD_RULES). */
export function allocate(
  hours: number,
  dates: { start: string | null; due: string },
  today: string,
  off: Array<{ start: string; end: string }> = [],
): Array<{ day: string; hours: number }> {
  if (hours <= 0) return [];
  if (dates.due < today) return [{ day: nextWorkDay(today, off), hours }];
  const from = dates.start && dates.start > today ? dates.start : today;
  const days = from <= dates.due ? workDays(from, dates.due, off) : [];
  if (!days.length) return [{ day: dates.due, hours }];
  const each = hours / days.length;
  return days.map((day) => ({ day, hours: each }));
}

export function loadTone(hours: number, capacity: number): { pct: number | null; overloaded: boolean; level: 'none' | 'low' | 'ok' | 'high' | 'over' } {
  if (capacity <= 0) return hours > 0 ? { pct: null, overloaded: true, level: 'over' } : { pct: null, overloaded: false, level: 'none' };
  const pct = r1((hours / capacity) * 100);
  const overloaded = pct > WORKLOAD_RULES.OVERLOAD_PCT;
  const level = overloaded ? 'over' : pct >= WORKLOAD_RULES.HIGH_PCT ? 'high' : pct >= 50 ? 'ok' : hours > 0 ? 'low' : 'none';
  return { pct, overloaded, level };
}

export interface WlIssueIn {
  id: number;
  hours: number;
  start: string | null;
  due: string | null;
}

/**
 * Tải theo tuần của MỘT người: cộng giờ đã rải vào từng tuần, so với năng lực
 * tuần (giờ/ngày × ngày làm việc trong tuần ∩ [from, to] − ngày nghỉ).
 */
export function personWeeks(input: {
  weeks: Array<{ start: string; end: string }>;
  from: string;
  to: string;
  today: string;
  hoursPerDay: number;
  off: Array<{ start: string; end: string }>;
  issues: WlIssueIn[];
}) {
  const perWeek = input.weeks.map((w) => {
    // Năng lực chỉ tính từ HÔM NAY trở đi: ngày đã qua không còn làm được gì (giờ cũng không bao giờ rải về quá khứ).
    const a = [w.start, input.from, input.today].sort().pop()!;
    const b = w.end > input.to ? input.to : w.end;
    const days = a <= b ? workDays(a, b, input.off).length : 0;
    return { start: w.start, end: w.end, workingDays: days, capacity: r1(days * input.hoursPerDay), hours: 0, issueIds: new Set<number>() };
  });
  for (const i of input.issues) {
    if (!i.due) continue;
    for (const piece of allocate(i.hours, { start: i.start, due: i.due }, input.today, input.off)) {
      if (piece.day < input.from || piece.day > input.to) continue;
      const w = perWeek.find((x) => piece.day >= x.start && piece.day <= x.end);
      if (!w) continue;
      w.hours += piece.hours;
      w.issueIds.add(i.id);
    }
    // Thẻ 0 giờ có hạn trong tuần vẫn hiện trong danh sách thẻ của tuần đó.
    if (i.hours <= 0) {
      const day = i.due < input.today ? nextWorkDay(input.today, input.off) : i.due;
      const w = perWeek.find((x) => day >= x.start && day <= x.end && day >= input.from && day <= input.to);
      w?.issueIds.add(i.id);
    }
  }
  return perWeek.map((w) => {
    const hours = r1(w.hours);
    return { start: w.start, end: w.end, workingDays: w.workingDays, capacity: w.capacity, hours, ...loadTone(hours, w.capacity), issueIds: [...w.issueIds] };
  });
}
