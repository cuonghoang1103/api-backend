/**
 * CT Work — đợt S4: LUẬT THUẦN của tài chính dự án + báo cáo (không chạm DB ⇒ test bằng bảng ở
 * finance.test.ts). Đọc DB ở finance.service.ts / clientReports.service.ts.
 *
 * CHỈ THEO DÕI tiền — KHÔNG xuất hoá đơn. Hoá đơn điện tử ở Việt Nam phải phát hành qua nhà
 * cung cấp được cấp phép; CT Work chỉ ghi lại SỐ hoá đơn mà hệ thống bên ngoài đã cấp.
 *
 * CÔNG THỨC (ghi ra giao diện y như ở đây — không số nào là "đoán"):
 *   - Chi phí nhân công thực tế (AC lao động) = Σ giờ ĐÃ DUYỆT × đơn giá lúc duyệt
 *     (chụp lại ở work_timesheet_lines — đổi đơn giá sau đó không làm đổi số đã duyệt).
 *   - Chi phí thực tế (AC) = AC lao động + Σ chi phí khác nhập tay.
 *   - Ngân sách (BAC) = tổng ngân sách đặt tay; để trống ⇒ Σ các dòng ngân sách.
 *   - % hoàn thành = Σ ước lượng gốc của thẻ đã xong ÷ Σ ước lượng gốc mọi thẻ (thẻ tầng 0);
 *     không thẻ nào có ước lượng ⇒ theo SỐ thẻ.
 *   - EV = BAC × % hoàn thành · CPI = EV ÷ AC · EAC = BAC ÷ CPI (= AC ÷ % hoàn thành) — PMBOK.
 *     Chưa có % hoàn thành (0) ⇒ EAC = AC + tốc độ đốt × số tuần còn tới ngày kết thúc dự kiến
 *     (nếu có), không thì không dự báo (null) — không bịa số.
 *   - Tốc độ đốt (burn rate) = chi phí phát sinh trong 28 ngày gần nhất ÷ 4 (mỗi tuần).
 *   - Cảnh báo: AC ≥ 80% BAC ⇒ WARN · ≥ 100% ⇒ OVER; EAC > BAC ⇒ FORECAST_OVER.
 */

import type { ProjectRole, WorkspaceRole } from './constants.js';

const DAY = 86_400_000;
export const round2 = (n: number) => Math.round(n * 100) / 100;

// ─── Quyền ─────────────────────────────────────────────────────────

export interface FinanceAccess {
  /** Thấy chi phí, ngân sách, đơn giá, mốc thanh toán; sửa được tất cả + mở khoá tuần đã duyệt. */
  manage: boolean;
  /** Ghi giờ + nộp timesheet của CHÍNH mình. */
  ownTimesheet: boolean;
  /** Duyệt timesheet: ALL (ADMIN dự án) · TEAM (trưởng bộ phận — chỉ người trong bộ phận mình) · null. */
  review: 'ALL' | 'TEAM' | null;
}

/**
 * Ai thấy gì trong tài chính (một hàm — mọi tuyến hỏi ở đây):
 *   - Khách (vai CLIENT) và khách của không gian (GUEST) ⇒ KHÔNG GÌ (khách chỉ thấy mốc thanh toán
 *     đã chia sẻ, qua /portal/payments — đường khác hẳn).
 *   - ADMIN dự án (gồm OWNER/ADMIN không gian) ⇒ mọi thứ, kể cả đơn giá.
 *   - MEMBER ⇒ chỉ giờ của mình (nộp tuần); là trưởng bộ phận thì duyệt giờ người trong bộ phận
 *     (thấy GIỜ, không thấy đơn giá/chi phí).
 *   - VIEWER / TEACHER ⇒ không ghi giờ; trưởng bộ phận mang vai VIEWER vẫn duyệt được bộ phận mình.
 */
export function financeAccess(role: ProjectRole | null, workspaceRole: WorkspaceRole | null, isTeamLead: boolean): FinanceAccess {
  const none: FinanceAccess = { manage: false, ownTimesheet: false, review: null };
  if (!role || role === 'CLIENT' || workspaceRole === 'GUEST') return none;
  if (role === 'ADMIN') return { manage: true, ownTimesheet: true, review: 'ALL' };
  if (role === 'MEMBER') return { manage: false, ownTimesheet: true, review: isTeamLead ? 'TEAM' : null };
  if (role === 'VIEWER' && isTeamLead) return { manage: false, ownTimesheet: false, review: 'TEAM' };
  return none;
}

// ─── Tuần ──────────────────────────────────────────────────────────

/** "YYYY-MM-DD" (ngày VN) ⇒ thứ Hai của tuần đó (ISO: tuần bắt đầu thứ Hai). */
export function weekStartOf(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7; // 0 = thứ Hai
  return new Date(d.getTime() - dow * DAY).toISOString().slice(0, 10);
}

/** Ngày cuối (Chủ nhật) của tuần bắt đầu `weekStart`. */
export function weekEndOf(weekStart: string): string {
  return new Date(Date.parse(`${weekStart}T00:00:00Z`) + 6 * DAY).toISOString().slice(0, 10);
}

/**
 * CTW-38 (08/10/2026): tuần đã KẾT THÚC chưa (theo ngày VN `today`)? Duyệt tuần chụp giá TỪNG dòng giờ của
 * cả tuần rồi khoá cả tuần ⇒ duyệt khi tuần còn dở sẽ khoá luôn những ngày chưa tới (thứ Ba ghi giờ ⇒ 423).
 * Chọn CHẶN DUYỆT tới khi hết Chủ nhật — không chọn "chỉ khoá tới hôm nay", vì bản chụp chi phí đã duyệt sẽ
 * không còn khớp tổng giờ của tuần (ngân sách/EAC/xuất số liệu đều dựa trên bản chụp). Nộp sớm vẫn được;
 * người duyệt có thể Trả lại; tuần đã duyệt nhầm thì ADMIN mở lại (reopen) như cũ.
 */
export function weekIsOver(weekStart: string, today: string): boolean {
  return weekEndOf(weekStart) < today;
}

/** Khoảng UTC [since, until) của một tuần theo giờ VN (+07, không đổi giờ mùa hè). */
export function vnWeekRange(weekStart: string): { since: Date; until: Date } {
  const since = new Date(Date.parse(`${weekStart}T00:00:00+07:00`));
  return { since, until: new Date(since.getTime() + 7 * DAY) };
}

export function isWeekStart(day: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(day) && weekStartOf(day) === day;
}

/** Tuần ISO "2026-W40" của một ngày — khoá chống gửi báo cáo tự động hai lần một tuần. */
export function isoWeekKey(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;
  const thu = new Date(d.getTime() + (3 - dow) * DAY); // thứ Năm của tuần quyết định năm ISO
  const year = thu.getUTCFullYear();
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const firstThu = jan4.getTime() + (3 - ((jan4.getUTCDay() + 6) % 7)) * DAY; // thứ Năm của tuần chứa 4/1 = tuần 1
  const week = 1 + Math.round((thu.getTime() - firstThu) / (7 * DAY));
  return `${year}-W${String(week).padStart(2, '0')}`;
}

/** Timesheet ở trạng thái này thì giờ của tuần bị KHOÁ (không ghi/xoá được). */
export function weekLocked(status: string | null | undefined): boolean {
  return status === 'SUBMITTED' || status === 'APPROVED';
}

/** Chuyển trạng thái timesheet hợp lệ. */
export function timesheetTransitionOk(from: string | null, action: 'submit' | 'withdraw' | 'approve' | 'return' | 'reopen'): boolean {
  switch (action) {
    case 'submit': return from === null || from === 'RETURNED' || from === 'REOPENED';
    case 'withdraw': return from === 'SUBMITTED';
    case 'approve': return from === 'SUBMITTED';
    case 'return': return from === 'SUBMITTED';
    case 'reopen': return from === 'APPROVED';
  }
}

// ─── Đơn giá ───────────────────────────────────────────────────────

export interface RateRow {
  id: number;
  scope: string;
  projectRole: string | null;
  teamId: number | null;
  userId: number | null;
  hourlyRate: number;
  /** "YYYY-MM-DD" hoặc null. */
  effectiveFrom: string | null;
}

export interface RateContext {
  userId: number;
  /** Bộ phận của thẻ (WorkIssue.teamId). */
  issueTeamId: number | null;
  /** Bộ phận người đó thuộc về (id tăng dần — lấy cái đầu khi thẻ không gắn bộ phận). */
  userTeamIds: number[];
  projectRole: string | null;
  /** Ngày làm "YYYY-MM-DD". */
  day: string;
}

export type RateSource = 'USER' | 'TEAM' | 'ROLE' | 'DEFAULT';

/** Dòng hiệu lực mới nhất của một nhóm (effectiveFrom ≤ ngày; null coi như từ đầu). */
function latest(rows: RateRow[], day: string): RateRow | null {
  const ok = rows.filter((r) => !r.effectiveFrom || r.effectiveFrom <= day);
  ok.sort((a, b) => (b.effectiveFrom ?? '').localeCompare(a.effectiveFrom ?? '') || b.id - a.id);
  return ok[0] ?? null;
}

/**
 * Đơn giá áp cho một dòng giờ. Ưu tiên: USER → TEAM của thẻ → TEAM của người (bộ phận id nhỏ
 * nhất có giá) → ROLE (vai trong dự án) → DEFAULT. Không có giá nào ⇒ null ("unpriced").
 */
export function pickRate(rates: RateRow[], ctx: RateContext): { rate: number; source: RateSource } | null {
  const user = latest(rates.filter((r) => r.scope === 'USER' && r.userId === ctx.userId), ctx.day);
  if (user) return { rate: user.hourlyRate, source: 'USER' };
  const teamIds = [...(ctx.issueTeamId ? [ctx.issueTeamId] : []), ...[...ctx.userTeamIds].sort((a, b) => a - b)];
  for (const t of teamIds) {
    const r = latest(rates.filter((x) => x.scope === 'TEAM' && x.teamId === t), ctx.day);
    if (r) return { rate: r.hourlyRate, source: 'TEAM' };
  }
  if (ctx.projectRole) {
    const r = latest(rates.filter((x) => x.scope === 'ROLE' && x.projectRole === ctx.projectRole), ctx.day);
    if (r) return { rate: r.hourlyRate, source: 'ROLE' };
  }
  const d = latest(rates.filter((x) => x.scope === 'DEFAULT'), ctx.day);
  return d ? { rate: d.hourlyRate, source: 'DEFAULT' } : null;
}

/** Chi phí một dòng = giờ × đơn giá (làm tròn 2 số lẻ). */
export function lineCost(minutes: number, rate: number | null): number | null {
  return rate === null ? null : round2((minutes / 60) * rate);
}

// ─── Mốc thanh toán ────────────────────────────────────────────────

/** Số tiền của mốc: `amount` nếu có, không thì `percent` × giá trị hợp đồng; thiếu cả hai ⇒ null. */
export function milestoneAmount(m: { amount: number | null; percent: number | null }, contractValue: number | null): number | null {
  if (m.amount !== null && m.amount !== undefined) return round2(m.amount);
  if (m.percent !== null && m.percent !== undefined && contractValue !== null && contractValue !== undefined) return round2((m.percent / 100) * contractValue);
  return null;
}

/** Chuyển trạng thái mốc bằng tay. INVOICED bắt buộc số hoá đơn (kiểm ở service). */
export function paymentTransitionOk(from: string, to: string): boolean {
  const order = ['PLANNED', 'DUE', 'INVOICED', 'PAID'];
  const a = order.indexOf(from);
  const b = order.indexOf(to);
  if (a < 0 || b < 0) return false;
  // Tiến bao nhiêu bước cũng được; lùi đúng một bước (sửa ghi nhầm); PAID là cuối — không đổi nữa.
  return from !== 'PAID' && a !== b && (b > a || b === a - 1);
}

/**
 * Mốc nào chuyển DUE khi một phê duyệt được DUYỆT. UAT: mốc trigger UAT gắn đúng version hoặc
 * đúng giai đoạn của UAT. Cổng giai đoạn: mốc trigger STAGE_GATE gắn đúng giai đoạn. Chỉ mốc PLANNED.
 */
export function milestonesTriggeredBy(
  approval: { targetType: string; stageId: number | null; uat: { versionId: number | null; stageId: number | null } | null },
  milestones: Array<{ id: number; status: string; trigger: string; versionId: number | null; stageId: number | null }>,
): number[] {
  return milestones.filter((m) => {
    if (m.status !== 'PLANNED') return false;
    if (approval.targetType === 'UAT' && m.trigger === 'UAT' && approval.uat) {
      return (m.versionId !== null && m.versionId === approval.uat.versionId) || (m.stageId !== null && m.stageId === approval.uat.stageId);
    }
    if (approval.targetType === 'STAGE_GATE' && m.trigger === 'STAGE_GATE') return m.stageId !== null && m.stageId === approval.stageId;
    return false;
  }).map((m) => m.id);
}

// ─── Ngân sách vs thực tế ──────────────────────────────────────────

export interface BudgetInput {
  /** Tổng ngân sách đặt tay (null ⇒ Σ dòng). */
  budgetTotal: number | null;
  budgetLinesSum: number;
  laborCost: number;
  expenseCost: number;
  /** Chi phí phát sinh trong 28 ngày gần nhất (lao động theo NGÀY làm + chi phí theo ngày chi). */
  last28Cost: number;
  /** 0..1 */
  percentComplete: number | null;
  /** Hôm nay và ngày kết thúc dự kiến ("YYYY-MM-DD"). */
  today: string;
  plannedEnd: string | null;
}

export type BudgetAlert = 'WARN' | 'OVER' | 'FORECAST_OVER';

export interface BudgetSummary {
  bac: number | null;
  actual: number;
  laborCost: number;
  expenseCost: number;
  remaining: number | null;
  percentUsed: number | null;
  burnRatePerWeek: number;
  percentComplete: number | null;
  ev: number | null;
  cpi: number | null;
  eac: number | null;
  eacMethod: 'CPI' | 'BURN_RATE' | null;
  vac: number | null;
  alerts: BudgetAlert[];
  /** Ngưỡng cảnh báo vừa chạm (0 | 80 | 100) — để báo một lần mỗi ngưỡng. */
  alertLevel: 0 | 80 | 100;
}

export const EAC_FORMULA = 'EAC = BAC ÷ CPI, where CPI = EV ÷ AC and EV = BAC × % complete (PMBOK). Before any work is complete: EAC = AC + burn rate × weeks left to the planned end date.';

export function budgetSummary(i: BudgetInput): BudgetSummary {
  const bac = i.budgetTotal !== null && i.budgetTotal !== undefined ? i.budgetTotal : (i.budgetLinesSum > 0 ? i.budgetLinesSum : null);
  const actual = round2(i.laborCost + i.expenseCost);
  const burn = round2(i.last28Cost / 4);
  const pc = i.percentComplete !== null && i.percentComplete !== undefined ? Math.max(0, Math.min(1, i.percentComplete)) : null;
  let ev: number | null = null;
  let cpi: number | null = null;
  let eac: number | null = null;
  let method: BudgetSummary['eacMethod'] = null;
  if (bac !== null && pc !== null && pc > 0) {
    ev = round2(bac * pc);
    if (actual > 0) {
      cpi = Math.round((ev / actual) * 1000) / 1000;
      eac = round2(bac / cpi);
      method = 'CPI';
    }
  }
  if (eac === null && i.plannedEnd && i.plannedEnd >= i.today) {
    const weeksLeft = (Date.parse(`${i.plannedEnd}T00:00:00Z`) - Date.parse(`${i.today}T00:00:00Z`)) / (7 * DAY);
    eac = round2(actual + burn * weeksLeft);
    method = 'BURN_RATE';
  }
  const percentUsed = bac ? Math.round((actual / bac) * 1000) / 10 : null;
  const alerts: BudgetAlert[] = [];
  let level: 0 | 80 | 100 = 0;
  if (percentUsed !== null) {
    if (percentUsed >= 100) { alerts.push('OVER'); level = 100; } else if (percentUsed >= 80) { alerts.push('WARN'); level = 80; }
  }
  if (bac !== null && eac !== null && eac > bac) alerts.push('FORECAST_OVER');
  return {
    bac, actual, laborCost: round2(i.laborCost), expenseCost: round2(i.expenseCost),
    remaining: bac !== null ? round2(bac - actual) : null,
    percentUsed, burnRatePerWeek: burn, percentComplete: pc, ev, cpi, eac, eacMethod: method,
    vac: bac !== null && eac !== null ? round2(bac - eac) : null,
    alerts, alertLevel: level,
  };
}

/** % hoàn thành theo ước lượng gốc (phút) của thẻ tầng 0; không ai ước lượng ⇒ theo số thẻ. */
export function percentComplete(issues: Array<{ originalEstimateMin: number | null; done: boolean }>): number | null {
  if (!issues.length) return null;
  const est = issues.filter((x) => (x.originalEstimateMin ?? 0) > 0);
  if (est.length) {
    const total = est.reduce((s, x) => s + (x.originalEstimateMin ?? 0), 0);
    const done = est.filter((x) => x.done).reduce((s, x) => s + (x.originalEstimateMin ?? 0), 0);
    return total ? done / total : null;
  }
  return issues.filter((x) => x.done).length / issues.length;
}

/** Ngưỡng mới cần báo: chỉ khi vượt LÊN ngưỡng cao hơn ngưỡng đã báo. */
export function alertToSend(previous: number, current: 0 | 80 | 100): 80 | 100 | null {
  return current > previous && current > 0 ? (current as 80 | 100) : null;
}

// ─── Lịch báo cáo ──────────────────────────────────────────────────

/** Thứ (1 = T2 … 7 = CN) và giờ địa phương của một thời điểm theo múi giờ IANA. */
export function localWeekdayHour(now: Date, timezone: string): { weekday: number; hour: number; day: string } {
  let tz = timezone;
  try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); } catch { tz = 'Asia/Ho_Chi_Minh'; }
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', hour: 'numeric', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const wd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday')) + 1;
  return { weekday: wd, hour: Number(get('hour')) % 24, day: `${get('year')}-${get('month')}-${get('day')}` };
}

/**
 * Tới giờ gửi báo cáo tuần chưa: đúng thứ đã hẹn và đã qua giờ hẹn (lỡ vài giờ vẫn gửi bù trong
 * ngày đó). Chống gửi hai lần nằm ở khoá autoKey (tuần ISO) trong DB, không ở đây.
 */
export function reportDue(s: { enabled: boolean; weekday: number; hour: number; timezone: string }, now: Date): { due: boolean; day: string } {
  const l = localWeekdayHour(now, s.timezone);
  return { due: s.enabled && l.weekday === s.weekday && l.hour >= s.hour, day: l.day };
}
