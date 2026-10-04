/**
 * CT Work — đợt S5a (04/10/2026): LUẬT THUẦN của Service desk & SLA (không chạm DB) — test bằng
 * bảng ở serviceDesk.test.ts. Mọi con số SLA trên giao diện, trong cảnh báo cron, báo cáo, portfolio
 * và báo cáo tuần cho khách đều đi qua đúng các hàm ở đây — không chỗ nào tự trừ ngày giờ.
 *
 * Chuẩn tham chiếu: ITIL 4 (Incident / Service request / Problem management; ưu tiên = Impact ×
 * Urgency) và Jira Service Management (request types, SLA goals theo lịch làm việc, pause conditions,
 * queues, CSAT).
 *
 * LUẬT TÍNH GIỜ (ghi rõ để giao diện/help nói cùng một điều):
 *   1. Đồng hồ bắt đầu lúc tạo thẻ (sự kiện START). Chỉ chạy trong GIỜ LÀM của dự án (ngày làm,
 *      khung giờ, trừ ngày lễ, theo MÚI GIỜ dự án) — trừ khi mục tiêu của mức P đó đặt lịch ALWAYS (24/7).
 *   2. Tạm dừng (PAUSE … RESUME): khi chờ khách ("Waiting for customer"). Khoảng dừng không tính.
 *      Tạm dừng/tiếp tục lặp nhiều lần được; PAUSE khi đang dừng / RESUME khi đang chạy bị bỏ qua.
 *   3. First response dừng ở FIRST_RESPONSE đầu tiên (bình luận PUBLIC đầu tiên của nhân viên, hoặc
 *      chuyển vào trạng thái được cấu hình) — hoặc RESOLVE nếu giải quyết trước khi trả lời.
 *      Resolution dừng ở RESOLVE; REOPEN chạy tiếp và CỘNG DỒN (không đếm lại từ 0).
 *   4. ĐỔI MỨC P giữa chừng: mục tiêu (và loại lịch) lấy theo mức P HIỆN TẠI, áp cho TOÀN BỘ thời gian
 *      đã chạy tính TỪ LÚC TẠO — không chia đoạn theo mức cũ. Lên P1 lúc đã chạy 3 giờ ⇒ có thể vi phạm
 *      ngay; hạ xuống P4 ⇒ có thể hết vi phạm. Đó là cách Jira Service Management tính lại (SLA goal
 *      chọn theo JQL tại thời điểm tính) và là cách duy nhất cho ra một con số ổn định khi tính lại.
 *   5. Trạng thái: thời gian đã chạy ≥ atRisk% mục tiêu ⇒ AT_RISK; > mục tiêu ⇒ BREACHED; mục tiêu đã
 *      dừng mà ≤ mục tiêu ⇒ MET. Mặc định atRisk = 75%.
 */

export const DESK_PRIORITIES = ['P1', 'P2', 'P3', 'P4'] as const;
export type DeskPriority = (typeof DESK_PRIORITIES)[number];
export const DESK_LEVELS = ['HIGH', 'MEDIUM', 'LOW'] as const;
export type DeskLevel = (typeof DESK_LEVELS)[number];
export const REQUEST_TYPE_KEYS = ['INCIDENT', 'SERVICE_REQUEST', 'QUESTION', 'CHANGE'] as const;
export type RequestTypeKey = (typeof REQUEST_TYPE_KEYS)[number];
export const SLA_EVENT_KINDS = ['START', 'PAUSE', 'RESUME', 'FIRST_RESPONSE', 'RESOLVE', 'REOPEN', 'PRIORITY'] as const;
export type SlaEventKind = (typeof SLA_EVENT_KINDS)[number];
export const PROBLEM_STATUSES = ['OPEN', 'INVESTIGATING', 'KNOWN_ERROR', 'RESOLVED', 'CLOSED'] as const;
export type ProblemStatus = (typeof PROBLEM_STATUSES)[number];
export type SlaCalendarKind = 'BUSINESS' | 'ALWAYS';
export type SlaStatus = 'ON_TRACK' | 'AT_RISK' | 'BREACHED' | 'MET';

const MIN = 60_000;
const DAY = 86_400_000;
/** Trần vòng lặp theo ngày (≈ 10 năm) — lịch hỏng (không ngày làm nào) không bao giờ treo máy. */
const MAX_DAYS = 3700;

// ═══ Lịch làm việc ═════════════════════════════════════════════════

export interface WorkCalendar {
  /** Múi giờ IANA của dự án (Asia/Ho_Chi_Minh). */
  timezone: string;
  /** Ngày làm theo ISO: 1 = Thứ Hai … 7 = Chủ nhật. */
  workDays: number[];
  /** Giờ bắt đầu / kết thúc trong ngày, tính bằng phút từ 00:00 (giờ địa phương). start < end — không hỗ trợ ca qua đêm. */
  startMin: number;
  endMin: number;
  /** Ngày lễ "YYYY-MM-DD" theo giờ địa phương — cả ngày không tính. */
  holidays: string[];
}

export const DEFAULT_CALENDAR: WorkCalendar = {
  timezone: 'Asia/Ho_Chi_Minh', workDays: [1, 2, 3, 4, 5], startMin: 8 * 60, endMin: 17 * 60, holidays: [],
};

/**
 * Ngày lễ CỐ ĐỊNH theo dương lịch của Việt Nam (Bộ luật Lao động 2019, Điều 112): 1/1, 30/4, 1/5, 2/9.
 * Tết Nguyên đán, Giỗ Tổ Hùng Vương (âm lịch) và ngày nghỉ liền kề 2/9 đổi theo năm và theo thông báo
 * của Chính phủ ⇒ admin tự thêm — giao diện nói rõ điều này, không tự đoán ngày âm lịch.
 */
export function vnFixedHolidays(year: number): string[] {
  return ['01-01', '04-30', '05-01', '09-02'].map((md) => `${year}-${md}`);
}

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function fmt(tz: string): Intl.DateTimeFormat {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    fmtCache.set(tz, f);
  }
  return f;
}

/** Múi giờ IANA hợp lệ không. */
export function validTimezone(tz: string): boolean {
  try {
    fmt(tz).format(0);
    return true;
  } catch {
    return false;
  }
}

interface LocalParts { y: number; m: number; d: number; h: number; mi: number; s: number }

function localParts(t: number, tz: string): LocalParts {
  const p: Record<string, number> = {};
  for (const x of fmt(tz).formatToParts(new Date(t))) if (x.type !== 'literal') p[x.type] = Number(x.value);
  return { y: p.year, m: p.month, d: p.day, h: p.hour % 24, mi: p.minute, s: p.second };
}

/** Lệch giờ (ms) của múi `tz` tại thời điểm `t`: giờ địa phương − UTC. */
function offsetAt(t: number, tz: string): number {
  const p = localParts(t, tz);
  const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s);
  return asUtc - (t - (t % 1000 + 1000) % 1000);
}

/** Giờ địa phương (y-m-d + phút trong ngày) ⇒ thời điểm UTC (ms). Hai lượt để đúng cả quanh đổi giờ mùa hè. */
export function zonedToUtc(y: number, m: number, d: number, minuteOfDay: number, tz: string): number {
  const guess = Date.UTC(y, m - 1, d, 0, minuteOfDay);
  const first = guess - offsetAt(guess, tz);
  const second = guess - offsetAt(first, tz);
  return second;
}

const ymd = (y: number, m: number, d: number) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/** Thứ ISO (1 = Thứ Hai … 7 = Chủ nhật) của một ngày lịch. */
function isoWeekday(y: number, m: number, d: number): number {
  const w = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return w === 0 ? 7 : w;
}

/** Ngày lịch kế tiếp (cộng `n` ngày) — số học trên ngày, không phụ thuộc múi giờ. */
function addDaysYmd(y: number, m: number, d: number, n: number): [number, number, number] {
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return [t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate()];
}

/** Khung giờ làm (UTC ms) của một ngày địa phương, hoặc null (ngày nghỉ / ngày lễ). */
function workWindow(y: number, m: number, d: number, cal: WorkCalendar): [number, number] | null {
  if (!cal.workDays.includes(isoWeekday(y, m, d))) return null;
  if (cal.holidays.includes(ymd(y, m, d))) return null;
  return [zonedToUtc(y, m, d, cal.startMin, cal.timezone), zonedToUtc(y, m, d, cal.endMin, cal.timezone)];
}

/** Lịch dùng được không (có ít nhất một ngày làm, giờ hợp lệ) — tránh vòng lặp vô ích. */
export function calendarUsable(cal: WorkCalendar): boolean {
  return cal.workDays.some((w) => w >= 1 && w <= 7) && cal.startMin >= 0 && cal.endMin <= 24 * 60 && cal.startMin < cal.endMin && validTimezone(cal.timezone);
}

/** Số PHÚT (thập phân) trong giờ làm giữa hai thời điểm. ALWAYS ⇒ phút đồng hồ. */
export function workingMinutesBetween(a: number, b: number, cal: WorkCalendar, kind: SlaCalendarKind = 'BUSINESS'): number {
  if (b <= a) return 0;
  if (kind === 'ALWAYS') return (b - a) / MIN;
  if (!calendarUsable(cal)) return 0;
  const start = localParts(a, cal.timezone);
  let [y, m, d] = [start.y, start.m, start.d];
  const days = Math.min(MAX_DAYS, Math.ceil((b - a) / DAY) + 2);
  let ms = 0;
  for (let i = 0; i <= days; i++) {
    const w = workWindow(y, m, d, cal);
    if (w) {
      if (w[0] >= b) break;
      const s = Math.max(a, w[0]);
      const e = Math.min(b, w[1]);
      if (e > s) ms += e - s;
    }
    [y, m, d] = addDaysYmd(y, m, d, 1);
  }
  return ms / MIN;
}

/**
 * Thời điểm đạt đủ `minutes` phút giờ làm tính từ `a` (hạn chót). ALWAYS ⇒ cộng thẳng. Lịch hỏng ⇒ null.
 * minutes = 0 ⇒ chính `a`.
 */
export function addWorkingMinutes(a: number, minutes: number, cal: WorkCalendar, kind: SlaCalendarKind = 'BUSINESS'): number | null {
  if (minutes <= 0) return a;
  if (kind === 'ALWAYS') return a + minutes * MIN;
  if (!calendarUsable(cal)) return null;
  let left = minutes * MIN;
  const start = localParts(a, cal.timezone);
  let [y, m, d] = [start.y, start.m, start.d];
  for (let i = 0; i < MAX_DAYS; i++) {
    const w = workWindow(y, m, d, cal);
    if (w) {
      const s = Math.max(a, w[0]);
      if (w[1] > s) {
        const avail = w[1] - s;
        if (left <= avail) return s + left;
        left -= avail;
      }
    }
    [y, m, d] = addDaysYmd(y, m, d, 1);
  }
  return null;
}

/** Số phút giờ làm của một ngày làm chuẩn (để đổi "phút" ⇒ "ngày làm"). */
export function minutesPerDay(cal: WorkCalendar): number {
  return Math.max(1, cal.endMin - cal.startMin);
}

// ═══ Ưu tiên: Impact × Urgency ⇒ P1–P4 ═════════════════════════════

export type PriorityMatrix = Record<DeskLevel, Record<DeskLevel, DeskPriority>>;

/**
 * Bảng mặc định (ITIL 4 rút còn 4 mức): hàng = tác động (impact), cột = mức khẩn (urgency).
 *   Impact HIGH   : P1 · P2 · P3
 *   Impact MEDIUM : P2 · P3 · P4
 *   Impact LOW    : P3 · P4 · P4
 */
export const DEFAULT_MATRIX: PriorityMatrix = {
  HIGH: { HIGH: 'P1', MEDIUM: 'P2', LOW: 'P3' },
  MEDIUM: { HIGH: 'P2', MEDIUM: 'P3', LOW: 'P4' },
  LOW: { HIGH: 'P3', MEDIUM: 'P4', LOW: 'P4' },
};

export function priorityOf(impact: DeskLevel, urgency: DeskLevel, matrix: PriorityMatrix = DEFAULT_MATRIX): DeskPriority {
  const p = matrix[impact]?.[urgency];
  return (DESK_PRIORITIES as readonly string[]).includes(p ?? '') ? (p as DeskPriority) : DEFAULT_MATRIX[impact][urgency];
}

/** Đọc bảng từ JSON — ô thiếu/sai ⇒ ô mặc định. */
export function matrixOf(raw: unknown): PriorityMatrix {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, Record<string, unknown>>;
  const out = {} as PriorityMatrix;
  for (const i of DESK_LEVELS) {
    out[i] = {} as Record<DeskLevel, DeskPriority>;
    for (const u of DESK_LEVELS) {
      const v = r[i]?.[u];
      out[i][u] = typeof v === 'string' && (DESK_PRIORITIES as readonly string[]).includes(v) ? (v as DeskPriority) : DEFAULT_MATRIX[i][u];
    }
  }
  return out;
}

/** Chữ dễ hiểu cho KHÁCH (khách chọn mô tả, hệ thống ra P — khách không bao giờ chọn P). */
export const IMPACT_TEXT: Record<DeskLevel, { label: string; hint: string }> = {
  HIGH: { label: 'Many people or the whole business', hint: 'Everyone, a whole site, or customers of yours are affected' },
  MEDIUM: { label: 'A team or several people', hint: 'One department or a group of users is affected' },
  LOW: { label: 'Just me or one person', hint: 'Only one person is affected' },
};
export const URGENCY_TEXT: Record<DeskLevel, { label: string; hint: string }> = {
  HIGH: { label: 'Work has stopped', hint: 'There is no way around it' },
  MEDIUM: { label: 'Work is slowed down', hint: 'There is a workaround, but it hurts' },
  LOW: { label: 'It can wait', hint: 'Inconvenient, nothing is blocked' },
};

// ═══ Mục tiêu SLA ═══════════════════════════════════════════════════

export interface SlaGoal { firstResponseMin: number; resolutionMin: number; calendar: SlaCalendarKind }
export type SlaGoals = Record<DeskPriority, SlaGoal>;

/** Mặc định (giờ làm 08:00–17:00 = 540 phút/ngày): P1 30 phút / 4 giờ · P2 1 giờ / 1 ngày · P3 4 giờ / 3 ngày · P4 1 ngày / 5 ngày. */
export const DEFAULT_GOALS: SlaGoals = {
  P1: { firstResponseMin: 30, resolutionMin: 240, calendar: 'BUSINESS' },
  P2: { firstResponseMin: 60, resolutionMin: 540, calendar: 'BUSINESS' },
  P3: { firstResponseMin: 240, resolutionMin: 1620, calendar: 'BUSINESS' },
  P4: { firstResponseMin: 540, resolutionMin: 2700, calendar: 'BUSINESS' },
};

export function goalsOf(raw: unknown): SlaGoals {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, Record<string, unknown>>;
  const out = {} as SlaGoals;
  const pos = (v: unknown, dflt: number) => (typeof v === 'number' && Number.isFinite(v) && v >= 1 && v <= 525_600 ? Math.round(v) : dflt);
  for (const p of DESK_PRIORITIES) {
    const g = r[p] ?? {};
    out[p] = {
      firstResponseMin: pos(g.firstResponseMin, DEFAULT_GOALS[p].firstResponseMin),
      resolutionMin: pos(g.resolutionMin, DEFAULT_GOALS[p].resolutionMin),
      calendar: g.calendar === 'ALWAYS' ? 'ALWAYS' : 'BUSINESS',
    };
  }
  return out;
}

/** "30 minutes" · "4 business hours" · "2 business days" · "4 hours" (24/7). Dùng cho khách — chỉ mục tiêu, không lộ gì nội bộ. */
export function durationText(minutes: number, kind: SlaCalendarKind, cal: WorkCalendar = DEFAULT_CALENDAR): string {
  const biz = kind === 'BUSINESS' ? 'business ' : '';
  const plural = (n: number, w: string) => `${n} ${biz}${w}${n === 1 ? '' : 's'}`;
  const perDay = kind === 'BUSINESS' ? minutesPerDay(cal) : 1440;
  if (minutes >= perDay && minutes % perDay === 0) return plural(minutes / perDay, 'day');
  if (minutes >= 60 && minutes % 60 === 0) return plural(minutes / 60, 'hour');
  if (minutes >= 60) {
    const h = Math.round((minutes / 60) * 10) / 10;
    return `${h} ${biz}hours`;
  }
  return plural(minutes, 'minute');
}

/** Ngắn gọn cho đồng hồ: "45m", "3h 20m", "2d 1h" (theo phút đã cho, không quy ngày làm). */
export function compactMinutes(min: number): string {
  const m = Math.round(Math.abs(min));
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h < 24) return r ? `${h}h ${r}m` : `${h}h`;
  const d = Math.floor(h / 24);
  const hh = h % 24;
  return hh ? `${d}d ${hh}h` : `${d}d`;
}

// ═══ Tính đồng hồ từ dòng sự kiện ═════════════════════════════════

export interface SlaEvent {
  kind: SlaEventKind;
  at: number | Date;
  /** PRIORITY: mức mới ("P1"…). */
  value?: string | null;
}

export interface TargetResult {
  /** Mục tiêu (phút) theo mức P hiện tại. */
  goalMin: number;
  calendar: SlaCalendarKind;
  /** Phút đã chạy (trừ tạm dừng, theo lịch). */
  elapsedMin: number;
  /** Còn lại (âm = đã quá). */
  remainingMin: number;
  status: SlaStatus;
  /** Đồng hồ đã dừng hẳn (đã trả lời / đã giải quyết). */
  stopped: boolean;
  /** Đang tạm dừng (chờ khách) — chỉ khi chưa dừng hẳn. */
  paused: boolean;
  /** Hạn chót nếu đồng hồ cứ chạy từ bây giờ (null khi dừng/tạm dừng/lịch hỏng). */
  dueAt: number | null;
  /** Thời điểm vượt ngưỡng at-risk / vi phạm (null nếu chưa). */
  atRiskAt: number | null;
  breachedAt: number | null;
  /** Thời điểm dừng (trả lời / giải quyết) nếu đã dừng. */
  stoppedAt: number | null;
}

export interface SlaResult {
  priority: DeskPriority;
  paused: boolean;
  firstResponse: TargetResult;
  resolution: TargetResult;
}

const ts = (x: number | Date) => (typeof x === 'number' ? x : x.getTime());

/** Khoảng đồng hồ CHẠY của hai mục tiêu (trước khi áp lịch), cộng trạng thái tại `now`. */
export function runningIntervals(events: SlaEvent[], now: number): {
  fr: Array<[number, number]>; res: Array<[number, number]>; frStop: number | null; resStop: number | null; paused: boolean; resolved: boolean;
} {
  const evs = events.map((e, i) => ({ ...e, t: ts(e.at), i })).filter((e) => e.t <= now).sort((a, b) => a.t - b.t || a.i - b.i);
  const fr: Array<[number, number]> = [];
  const res: Array<[number, number]> = [];
  let started = false;
  let paused = false;
  let resolved = false;
  let frStop: number | null = null;
  let resStop: number | null = null;
  let frFrom: number | null = null;
  let resFrom: number | null = null;
  for (const e of evs) {
    switch (e.kind) {
      case 'START':
        if (started) break;
        started = true;
        frFrom = e.t;
        resFrom = e.t;
        break;
      case 'PAUSE':
        if (!started || paused) break;
        paused = true;
        if (frFrom !== null) { fr.push([frFrom, e.t]); frFrom = null; }
        if (resFrom !== null) { res.push([resFrom, e.t]); resFrom = null; }
        break;
      case 'RESUME':
        if (!started || !paused) break;
        paused = false;
        if (frStop === null) frFrom = e.t;
        if (!resolved) resFrom = e.t;
        break;
      case 'FIRST_RESPONSE':
        if (!started || frStop !== null) break;
        frStop = e.t;
        if (frFrom !== null) { fr.push([frFrom, e.t]); frFrom = null; }
        break;
      case 'RESOLVE':
        if (!started || resolved) break;
        resolved = true;
        resStop = e.t;
        if (resFrom !== null) { res.push([resFrom, e.t]); resFrom = null; }
        // Giải quyết trước khi trả lời ⇒ first response cũng dừng tại đây.
        if (frStop === null) {
          frStop = e.t;
          if (frFrom !== null) { fr.push([frFrom, e.t]); frFrom = null; }
        }
        break;
      case 'REOPEN':
        if (!started || !resolved) break;
        resolved = false;
        resStop = null;
        if (!paused) resFrom = e.t;
        break;
      default:
        break;
    }
  }
  if (frFrom !== null) fr.push([frFrom, now]);
  if (resFrom !== null) res.push([resFrom, now]);
  return { fr, res, frStop, resStop, paused, resolved };
}

/** Mức P hiện tại: sự kiện PRIORITY cuối cùng (≤ now), không có ⇒ `fallback`. */
export function currentPriority(events: SlaEvent[], fallback: DeskPriority, now: number): DeskPriority {
  let p = fallback;
  let best = -Infinity;
  events.forEach((e) => {
    const t = ts(e.at);
    if (e.kind === 'PRIORITY' && t <= now && t >= best && (DESK_PRIORITIES as readonly string[]).includes(e.value ?? '')) {
      best = t;
      p = e.value as DeskPriority;
    }
  });
  return p;
}

function evalTarget(
  intervals: Array<[number, number]>, stop: number | null, pausedNow: boolean, goalMin: number, kind: SlaCalendarKind,
  cal: WorkCalendar, atRiskRatio: number, now: number,
): TargetResult {
  let elapsed = 0;
  let atRiskAt: number | null = null;
  let breachedAt: number | null = null;
  const riskMin = goalMin * atRiskRatio;
  for (const [s, e] of intervals) {
    const part = workingMinutesBetween(s, e, cal, kind);
    if (atRiskAt === null && elapsed + part >= riskMin) atRiskAt = addWorkingMinutes(s, Math.max(0, riskMin - elapsed), cal, kind);
    if (breachedAt === null && elapsed + part > goalMin) {
      // Thời điểm vượt: đúng lúc đủ goalMin (+ một khắc rất nhỏ để "> mục tiêu" khớp).
      breachedAt = addWorkingMinutes(s, Math.max(0, goalMin - elapsed), cal, kind);
    }
    elapsed += part;
  }
  const stopped = stop !== null;
  const remaining = goalMin - elapsed;
  let status: SlaStatus;
  if (elapsed > goalMin + 1e-9) status = 'BREACHED';
  else if (stopped) status = 'MET';
  else if (elapsed >= riskMin - 1e-9) status = 'AT_RISK';
  else status = 'ON_TRACK';
  const running = !stopped && !pausedNow;
  const dueAt = running ? addWorkingMinutes(now, Math.max(0, remaining), cal, kind) : null;
  return {
    goalMin, calendar: kind, elapsedMin: Math.round(elapsed * 100) / 100, remainingMin: Math.round(remaining * 100) / 100, status,
    stopped, paused: !stopped && pausedNow, dueAt: status === 'BREACHED' && running ? null : dueAt,
    atRiskAt: status === 'ON_TRACK' ? null : atRiskAt, breachedAt: status === 'BREACHED' ? breachedAt : null, stoppedAt: stop,
  };
}

/**
 * Tính trạng thái SLA của một yêu cầu tại thời điểm `now`, CHỈ từ dòng sự kiện + cấu hình — gọi lại
 * bao nhiêu lần cũng ra cùng một kết quả (cron, giao diện, báo cáo, test).
 */
export function computeSla(
  events: SlaEvent[], fallbackPriority: DeskPriority, goals: SlaGoals, cal: WorkCalendar, now: number, atRiskPercent = 75,
): SlaResult {
  const priority = currentPriority(events, fallbackPriority, now);
  const g = goals[priority] ?? DEFAULT_GOALS[priority];
  const r = runningIntervals(events, now);
  const ratio = Math.min(0.99, Math.max(0.1, atRiskPercent / 100));
  return {
    priority,
    paused: r.paused && !r.resolved,
    firstResponse: evalTarget(r.fr, r.frStop, r.paused, g.firstResponseMin, g.calendar, cal, ratio, now),
    resolution: evalTarget(r.res, r.resStop, r.paused, g.resolutionMin, g.calendar, cal, ratio, now),
  };
}

/** Mức cảnh báo của một mục tiêu: 0 không · 1 AT_RISK · 2 BREACHED (chỉ đồng hồ CHƯA dừng mới cảnh báo AT_RISK). */
export function alertLevelOf(t: TargetResult): 0 | 1 | 2 {
  if (t.status === 'BREACHED') return 2;
  if (t.status === 'AT_RISK' && !t.stopped) return 1;
  return 0;
}

/**
 * Cảnh báo cần gửi lần này: mức hiện tại cao hơn mức đã báo ⇒ báo mức hiện tại, lưu lại. Mức đã báo
 * KHÔNG giảm theo thời gian (mỗi mốc báo đúng một lần) — chỉ hạ khi đổi mức P làm trạng thái tụt xuống
 * (`lowerAlertOnPriorityChange`), để mục tiêu mới có cảnh báo của riêng nó.
 */
export function alertToSend(current: 0 | 1 | 2, alreadySent: number): 0 | 1 | 2 {
  return current > alreadySent ? current : 0;
}

export function lowerAlertOnPriorityChange(alreadySent: number, nowLevel: 0 | 1 | 2): number {
  return Math.min(alreadySent, nowLevel);
}

// ═══ Báo cáo ═══════════════════════════════════════════════════════

export interface ReportRow {
  priority: DeskPriority;
  /** Tháng tạo "YYYY-MM" (theo múi giờ dự án). */
  month: string;
  firstResponse: { stopped: boolean; status: SlaStatus };
  resolution: { stopped: boolean; status: SlaStatus };
  /** Phút đồng hồ từ lúc tạo tới lúc giải quyết (null = chưa giải quyết). */
  resolveWallMin: number | null;
  csat: number | null;
}

export interface ReportCell {
  tickets: number;
  frDone: number; frMet: number; frPercent: number | null;
  resDone: number; resMet: number; resPercent: number | null;
  breaches: number;
  mttrMin: number | null;
  csatCount: number; csatAvg: number | null;
}

const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 : null);

export function reportCell(rows: ReportRow[]): ReportCell {
  // Chỉ mục tiêu ĐÃ CÓ KẾT QUẢ mới tính % đạt: đã dừng (MET/BREACHED) hoặc đang chạy mà đã vi phạm.
  const frDone = rows.filter((r) => r.firstResponse.stopped || r.firstResponse.status === 'BREACHED');
  const resDone = rows.filter((r) => r.resolution.stopped || r.resolution.status === 'BREACHED');
  const frMet = frDone.filter((r) => r.firstResponse.status === 'MET').length;
  const resMet = resDone.filter((r) => r.resolution.status === 'MET').length;
  const breaches = rows.reduce((n, r) => n + (r.firstResponse.status === 'BREACHED' ? 1 : 0) + (r.resolution.status === 'BREACHED' ? 1 : 0), 0);
  const resolved = rows.filter((r) => r.resolveWallMin !== null);
  const csats = rows.filter((r) => r.csat !== null);
  return {
    tickets: rows.length,
    frDone: frDone.length, frMet, frPercent: pct(frMet, frDone.length),
    resDone: resDone.length, resMet, resPercent: pct(resMet, resDone.length),
    breaches,
    mttrMin: resolved.length ? Math.round(resolved.reduce((n, r) => n + (r.resolveWallMin ?? 0), 0) / resolved.length) : null,
    csatCount: csats.length,
    csatAvg: csats.length ? Math.round((csats.reduce((n, r) => n + (r.csat ?? 0), 0) / csats.length) * 100) / 100 : null,
  };
}

/** % đạt chung (first response + resolution gộp) — dùng cho Portfolio RAG ("< 90% tháng này ⇒ vàng"). */
export function overallMetPercent(c: ReportCell): number | null {
  return pct(c.frMet + c.resMet, c.frDone + c.resDone);
}

/** Tháng "YYYY-MM" theo múi giờ. */
export function monthOf(t: number | Date, tz: string): string {
  const p = localParts(ts(t), tz);
  return `${p.y}-${String(p.m).padStart(2, '0')}`;
}

/** Ngày "YYYY-MM-DD HH:mm" theo múi giờ (dòng thời gian postmortem). */
export function localStamp(t: number | Date, tz: string): string {
  const p = localParts(ts(t), tz);
  return `${ymd(p.y, p.m, p.d)} ${String(p.h).padStart(2, '0')}:${String(p.mi).padStart(2, '0')}`;
}

// ═══ Loại yêu cầu ══════════════════════════════════════════════════

export interface RequestField { key: string; label: string; kind: 'text' | 'textarea' | 'date'; required: boolean }
export interface RequestTypeConfig {
  key: RequestTypeKey;
  enabled: boolean;
  name: string;
  description: string;
  defaultImpact: DeskLevel;
  defaultUrgency: DeskLevel;
  /** Khách tự chọn tác động/khẩn cấp được không (Incident: có; Question: không — dùng mặc định). */
  askImpact: boolean;
  fields: RequestField[];
  /** Change: tạo luôn một CR nháp (mô-đun changeRequests) gắn với thẻ. */
  useChangeRequest?: boolean;
}

export const DEFAULT_REQUEST_TYPES: RequestTypeConfig[] = [
  {
    key: 'INCIDENT', enabled: true, name: 'Report an incident', description: 'Something is broken, down or behaving wrongly',
    defaultImpact: 'MEDIUM', defaultUrgency: 'MEDIUM', askImpact: true,
    fields: [
      { key: 'affected', label: 'What is affected (page, feature, system)?', kind: 'text', required: true },
      { key: 'since', label: 'When did it start?', kind: 'text', required: false },
      { key: 'steps', label: 'Steps to reproduce', kind: 'textarea', required: false },
    ],
  },
  {
    key: 'SERVICE_REQUEST', enabled: true, name: 'Request a service', description: 'Access, an account, data export, a routine task',
    defaultImpact: 'LOW', defaultUrgency: 'MEDIUM', askImpact: true,
    fields: [
      { key: 'need', label: 'What do you need?', kind: 'textarea', required: true },
      { key: 'by', label: 'Needed by', kind: 'date', required: false },
    ],
  },
  {
    key: 'QUESTION', enabled: true, name: 'Ask a question', description: 'How something works, or anything you want clarified',
    defaultImpact: 'LOW', defaultUrgency: 'LOW', askImpact: false, fields: [],
  },
  {
    key: 'CHANGE', enabled: true, name: 'Request a change', description: 'A new feature or a change to what was agreed',
    defaultImpact: 'LOW', defaultUrgency: 'LOW', askImpact: false, useChangeRequest: true,
    fields: [
      { key: 'change', label: 'What should change?', kind: 'textarea', required: true },
      { key: 'why', label: 'Why is it needed?', kind: 'textarea', required: false },
    ],
  },
];

const FIELD_KEY_RE = /^[a-z][a-z0-9_]{0,31}$/;

/** Đọc cấu hình loại yêu cầu (thiếu ⇒ mặc định; loại lạ bị bỏ; luôn đủ 4 loại theo thứ tự). */
export function requestTypesOf(raw: unknown): RequestTypeConfig[] {
  const list = Array.isArray(raw) ? (raw as Array<Record<string, unknown>>) : [];
  return DEFAULT_REQUEST_TYPES.map((d) => {
    const r = list.find((x) => x && x.key === d.key);
    if (!r) return { ...d, fields: d.fields.map((f) => ({ ...f })) };
    const lvl = (v: unknown, dflt: DeskLevel) => ((DESK_LEVELS as readonly string[]).includes(v as string) ? (v as DeskLevel) : dflt);
    const fields = Array.isArray(r.fields)
      ? (r.fields as Array<Record<string, unknown>>)
        .filter((f) => f && typeof f.key === 'string' && FIELD_KEY_RE.test(f.key) && typeof f.label === 'string' && f.label.trim())
        .slice(0, 8)
        .map((f) => ({ key: f.key as string, label: String(f.label).trim().slice(0, 120), kind: (['text', 'textarea', 'date'].includes(f.kind as string) ? f.kind : 'text') as RequestField['kind'], required: f.required === true }))
      : d.fields;
    return {
      key: d.key,
      enabled: r.enabled !== false,
      name: typeof r.name === 'string' && r.name.trim() ? r.name.trim().slice(0, 60) : d.name,
      description: typeof r.description === 'string' ? r.description.trim().slice(0, 200) : d.description,
      defaultImpact: lvl(r.defaultImpact, d.defaultImpact),
      defaultUrgency: lvl(r.defaultUrgency, d.defaultUrgency),
      askImpact: typeof r.askImpact === 'boolean' ? r.askImpact : d.askImpact,
      fields,
      ...(d.key === 'CHANGE' ? { useChangeRequest: r.useChangeRequest !== false } : {}),
    };
  });
}

/** Kiểm câu trả lời form của khách: thiếu trường bắt buộc ⇒ tên trường; ngoài danh sách ⇒ bỏ. */
export function cleanFieldAnswers(t: RequestTypeConfig, answers: Record<string, unknown> | null | undefined): { values: Record<string, string>; missing: string[] } {
  const values: Record<string, string> = {};
  const missing: string[] = [];
  for (const f of t.fields) {
    const v = answers?.[f.key];
    const s = typeof v === 'string' ? v.trim().slice(0, f.kind === 'textarea' ? 5000 : 500) : '';
    if (s) values[f.key] = s;
    else if (f.required) missing.push(f.label);
  }
  return { values, missing };
}
