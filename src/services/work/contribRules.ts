/**
 * CT Work — ĐÓNG GÓP & HIỆU SUẤT THÀNH VIÊN (10/10/2026): phần HÀM THUẦN (không chạm DB) — test bằng bảng ở
 * contribRules.test.ts. Phần đọc DB ở contrib.service.ts.
 *
 *   - Khoảng thời gian theo MÚI GIỜ DỰ ÁN: hôm nay / 7 ngày / tuần này / sprint / giai đoạn / cả dự án / tuỳ chọn, và
 *     kỳ trước cùng độ dài để so ▲▼%.
 *   - Đúng hạn: so NGÀY địa phương lúc xong với ngày hạn (dueDate là cột DATE — không giờ).
 *   - Chuỗi ngày hoạt động / số ngày im lặng.
 *   - Tín hiệu cần chú ý: CÓ LÝ DO CỤ THỂ, không bao giờ gắn nhãn người ("lười", "kém"…).
 *   - Quyền xem: ADMIN + TEACHER thấy tất; MEMBER/VIEWER chỉ mình + tổng nhóm (trừ khi dự án bật "cả nhóm xem");
 *     CLIENT / GUEST (trừ TEACHER) / AI agent: không.
 *   - Đánh giá chéo: kiểm điểm, tổng hợp ẩn danh (không bao giờ trả người chấm).
 *   - Khớp danh tính git / tên người kiểm thử trong mẫu FPT ⇒ người trong dự án.
 */

import type { ProjectRole, WorkspaceRole } from './constants.js';
import type { Principal } from './permissions.js';

export const DEFAULT_TZ = 'Asia/Ho_Chi_Minh';
const DAY_MS = 86_400_000;

// ─── Ngày & múi giờ ──────────────────────────────────────────────

/** Múi giờ IANA hợp lệ, sai ⇒ giờ VN. */
export function safeTz(tz: unknown): string {
  if (typeof tz !== 'string' || !tz.trim()) return DEFAULT_TZ;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return tz;
  } catch {
    return DEFAULT_TZ;
  }
}

const dayFmt = new Map<string, Intl.DateTimeFormat>();
/** YYYY-MM-DD của một thời điểm theo múi giờ `tz`. */
export function dayKey(d: Date, tz: string): string {
  let f = dayFmt.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' });
    dayFmt.set(tz, f);
  }
  return f.format(d);
}

/** Độ lệch (phút) của `tz` so với UTC tại thời điểm `at` (VN = +420). */
export function tzOffsetMin(at: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(at);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
  return Math.round((asUtc - Math.floor(at.getTime() / 1000) * 1000) / 60_000);
}

/** Thời điểm 00:00 của ngày `day` (YYYY-MM-DD) theo `tz`. Đúng cả qua đổi giờ mùa hè (thử hai lần). */
export function startOfDay(day: string, tz: string): Date {
  const [y, m, d] = day.split('-').map(Number);
  const guess = Date.UTC(y, m - 1, d);
  let t = guess - tzOffsetMin(new Date(guess), tz) * 60_000;
  t = guess - tzOffsetMin(new Date(t), tz) * 60_000;
  return new Date(t);
}

/** Cộng `n` ngày lịch vào YYYY-MM-DD. */
export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * DAY_MS).toISOString().slice(0, 10);
}

/** Số ngày lịch từ a tới b (b − a). */
export function dayDiff(a: string, b: string): number {
  const p = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
  return Math.round((p(b) - p(a)) / DAY_MS);
}

/**
 * Số ngày im lặng tới hôm nay (UX-B 10/10/2026). Mốc sàn = max(ngày tham gia dự án, ngày tạo dự án, đầu kỳ):
 * nhóm mới lập KHÔNG bị báo "182 days without activity" chỉ vì heatmap tải 182 ngày.
 *   · có hoạt động từ mốc sàn trở đi ⇒ số ngày SAU ngày hoạt động cuối (hôm nay có hoạt động ⇒ 0);
 *   · không ⇒ số ngày từ mốc sàn tới hôm nay, tính cả hai đầu (tham gia hôm nay, chưa làm gì ⇒ 1).
 * Các mốc là YYYY-MM-DD (so sánh chuỗi được); null ⇒ bỏ qua.
 */
export function silentDaysSince(p: { today: string; lastActiveDay: string | null; floors: Array<string | null | undefined> }): number {
  const floor = p.floors.filter((d): d is string => !!d).reduce<string | null>((a, d) => (a === null || d > a ? d : a), null);
  if (floor && floor > p.today) return 0;
  if (p.lastActiveDay && (!floor || p.lastActiveDay >= floor)) return Math.max(0, dayDiff(p.lastActiveDay, p.today));
  if (!floor) return 0;
  return dayDiff(floor, p.today) + 1;
}

/** Mọi ngày từ a tới b, gồm cả hai đầu (trần 800 ngày). */
export function daysInclusive(a: string, b: string): string[] {
  const out: string[] = [];
  const n = Math.min(800, dayDiff(a, b));
  for (let i = 0; i <= n; i++) out.push(addDays(a, i));
  return out;
}

/** Thứ Hai của tuần chứa `day` (tuần ISO). */
export function weekStart(day: string): string {
  const [y, m, d] = day.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = CN
  return addDays(day, -((wd + 6) % 7));
}

// ─── Khoảng thời gian ────────────────────────────────────────────

export const RANGE_PRESETS = ['today', '7d', '30d', 'week', 'sprint', 'stage', 'project', 'custom'] as const;
export type RangePreset = (typeof RANGE_PRESETS)[number];

export interface ContribWindow {
  preset: RangePreset;
  label: string;
  /** Thời điểm bắt đầu (gồm) và kết thúc (gồm) — `to` không vượt quá "bây giờ". */
  from: Date;
  to: Date;
  fromDay: string;
  toDay: string;
  /** Số ngày lịch trong khoảng. */
  days: number;
  /** Khoảng có chứa hôm nay ⇒ "im lặng" tính tới hôm nay. */
  includesToday: boolean;
}

export interface WindowInput {
  preset: RangePreset;
  tz: string;
  now: Date;
  /** custom: YYYY-MM-DD theo múi giờ dự án. */
  fromDay?: string;
  toDay?: string;
  /** sprint/stage/project: mốc thời gian đã đọc từ DB. */
  span?: { start: Date | null; end: Date | null; name: string } | null;
}

/** Dựng khoảng từ lựa chọn. Lỗi người dùng (custom ngược, sprint chưa bắt đầu…) ⇒ ném Error có `message` tiếng Anh. */
export function resolveWindow(i: WindowInput): ContribWindow {
  const tz = safeTz(i.tz);
  const today = dayKey(i.now, tz);
  const mk = (fromDay: string, toDay: string, label: string, end?: Date): ContribWindow => {
    if (dayDiff(fromDay, toDay) < 0) throw new Error('The start date is after the end date');
    if (fromDay > today) throw new Error('The range starts in the future');
    // Khoảng chưa trôi hết (tuần này, sprint đang chạy) cắt tại hôm nay ⇒ kỳ trước so CÙNG số ngày đã trôi.
    const lastDay = toDay > today ? today : toDay;
    const from = startOfDay(fromDay, tz);
    let to = end ?? new Date(startOfDay(addDays(lastDay, 1), tz).getTime() - 1);
    if (to > i.now) to = i.now;
    if (to < from) to = from;
    return { preset: i.preset, label, from, to, fromDay, toDay: lastDay, days: dayDiff(fromDay, lastDay) + 1, includesToday: lastDay === today };
  };
  switch (i.preset) {
    case 'today': return mk(today, today, 'Today');
    case '7d': return mk(addDays(today, -6), today, 'Last 7 days');
    case '30d': return mk(addDays(today, -29), today, 'Last 30 days');
    case 'week': return mk(weekStart(today), addDays(weekStart(today), 6), 'This week');
    case 'custom': {
      const re = /^\d{4}-\d{2}-\d{2}$/;
      if (!i.fromDay || !i.toDay || !re.test(i.fromDay) || !re.test(i.toDay)) throw new Error('Pick a start and an end date');
      if (dayDiff(i.fromDay, i.toDay) > 730) throw new Error('A custom range can be at most two years');
      return mk(i.fromDay, i.toDay, `${i.fromDay} – ${i.toDay}`);
    }
    case 'sprint':
    case 'stage':
    case 'project': {
      const s = i.span;
      if (!s?.start) throw new Error(i.preset === 'sprint' ? 'This sprint has not started yet' : i.preset === 'stage' ? 'This stage has not started yet' : 'The project has no start date');
      const end = s.end && s.end < i.now ? s.end : i.now;
      const fromDay = dayKey(s.start, tz);
      const toDay = dayKey(end, tz);
      const w = mk(fromDay, toDay, s.name);
      return { ...w, from: s.start, to: end < s.start ? s.start : end };
    }
  }
}

/** Kỳ trước cùng độ dài, liền ngay trước (sprint/giai đoạn trước truyền vào `span` riêng ở service). */
export function previousWindow(w: ContribWindow, tz: string): ContribWindow {
  const fromDay = addDays(w.fromDay, -w.days);
  const toDay = addDays(w.fromDay, -1);
  const from = startOfDay(fromDay, tz);
  const to = new Date(w.from.getTime() - 1);
  return { preset: w.preset, label: 'Previous period', from, to, fromDay, toDay, days: w.days, includesToday: false };
}

/** % thay đổi so với kỳ trước; null khi không so được (kỳ trước = 0). */
export function pctChange(cur: number | null, prev: number | null): number | null {
  if (cur === null || prev === null || !Number.isFinite(cur) || !Number.isFinite(prev)) return null;
  if (prev === 0) return null;
  return Math.round(((cur - prev) / Math.abs(prev)) * 100);
}

// ─── Thời hạn ────────────────────────────────────────────────────

/**
 * Đúng hạn = ngày địa phương lúc xong ≤ ngày hạn. `due` là cột DATE (Prisma trả 00:00 UTC của ngày đó) ⇒ lấy
 * `toISOString().slice(0,10)`, KHÔNG đổi múi giờ (đổi sẽ lùi một ngày ở múi giờ âm).
 * Trả số ngày trễ (0 = đúng hạn).
 */
export function lateDays(resolvedAt: Date, due: Date, tz: string): number {
  const dueDay = due.toISOString().slice(0, 10);
  return Math.max(0, dayDiff(dueDay, dayKey(resolvedAt, tz)));
}

/** Thẻ đang mở đã quá hạn tính tới `today` (YYYY-MM-DD theo múi giờ dự án). */
export function isOverdue(due: Date | null, today: string): boolean {
  return !!due && due.toISOString().slice(0, 10) < today;
}

export const mean = (xs: number[]): number | null => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
export function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
export const round1 = (n: number) => Math.round(n * 10) / 10;

// ─── Chuỗi ngày hoạt động ────────────────────────────────────────

export interface Streaks {
  activeDays: number;
  /** Chuỗi ngày có hoạt động liền nhau kết thúc ở `toDay` (0 nếu `toDay` không hoạt động). */
  currentStreak: number;
  longestStreak: number;
  /** Số ngày liền nhau KHÔNG hoạt động kết thúc ở `toDay` (trong khoảng). */
  trailingSilence: number;
  longestSilence: number;
}

export function streaks(active: ReadonlySet<string>, fromDay: string, toDay: string): Streaks {
  const days = daysInclusive(fromDay, toDay);
  let run = 0, gap = 0, longestStreak = 0, longestSilence = 0, activeDays = 0;
  for (const d of days) {
    if (active.has(d)) { activeDays += 1; run += 1; gap = 0; longestStreak = Math.max(longestStreak, run); }
    else { gap += 1; run = 0; longestSilence = Math.max(longestSilence, gap); }
  }
  return { activeDays, currentStreak: run, longestStreak, trailingSilence: gap, longestSilence };
}

// ─── Tín hiệu cần chú ý ──────────────────────────────────────────

export interface SignalInput {
  isAgent: boolean;
  /** Ngày không hoạt động liên tiếp tính tới hôm nay (null = chưa từng hoạt động trong dự án). */
  silentNow: number | null;
  includesToday: boolean;
  overdueOpen: number;
  /** Giờ log tuần này (luôn tuần hiện tại, không theo khoảng). */
  hoursThisWeek: number;
  /** Đội có log giờ (ai đó trong 30 ngày) — dự án không dùng worklog thì không nhắc ai. */
  teamLogsTime: boolean;
  /** Hôm nay đã qua thứ Tư (nhắc log giờ đầu tuần là vô lý). */
  midWeek: boolean;
  unansweredMentions: number;
  withDue: number;
  onTime: number;
  assignedOpen: number;
  completed: number;
  windowDays: number;
  silentThreshold: number;
}

export interface Signal { code: string; level: 'info' | 'warn'; text: string }

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * Tín hiệu có LÝ DO, viết như một quan sát ("5 days without activity"), không bao giờ là nhãn người.
 * Agent: chỉ nhắc việc trễ hạn (agent không log giờ, không "im lặng" theo nghĩa người).
 */
export function attentionSignals(s: SignalInput): Signal[] {
  const out: Signal[] = [];
  if (!s.isAgent && s.includesToday) {
    if (s.silentNow === null) out.push({ code: 'never_active', level: 'info', text: 'No recorded activity in this project yet' });
    else if (s.silentNow >= s.silentThreshold) out.push({ code: 'silent', level: s.silentNow >= s.silentThreshold * 2 ? 'warn' : 'info', text: `${plural(s.silentNow, 'day')} without activity` });
  }
  if (s.overdueOpen > 0) out.push({ code: 'overdue', level: s.overdueOpen >= 3 ? 'warn' : 'info', text: `${plural(s.overdueOpen, 'overdue issue')} still open` });
  if (!s.isAgent && s.teamLogsTime && s.midWeek && s.hoursThisWeek === 0 && s.assignedOpen > 0) out.push({ code: 'no_time', level: 'info', text: 'No time logged this week' });
  if (s.unansweredMentions >= 2) out.push({ code: 'mentions', level: 'info', text: `${plural(s.unansweredMentions, '@mention')} not answered within 2 days` });
  if (s.withDue >= 3 && s.onTime / s.withDue < 0.5) out.push({ code: 'late', level: 'info', text: `Finished ${s.onTime} of ${s.withDue} dated issues by their due date` });
  if (s.windowDays >= 7 && s.assignedOpen > 0 && s.completed === 0) out.push({ code: 'no_done', level: 'info', text: `Nothing completed in this range (${plural(s.assignedOpen, 'open issue')} assigned)` });
  return out;
}

// ─── Quyền xem ───────────────────────────────────────────────────

export interface ContribAccess {
  /** ALL = thấy từng người · SELF = chỉ mình + tổng nhóm (người khác ẩn) · null = không thấy trang này. */
  view: 'ALL' | 'SELF' | null;
  /** Đổi cài đặt (cả nhóm xem, múi giờ, ngưỡng), gán danh tính git: ADMIN dự án. */
  manage: boolean;
  /** Mở/đóng đợt đánh giá chéo + xem tổng hợp: ADMIN + TEACHER. */
  peerAdmin: boolean;
  /** Được chấm và bị chấm: người (không phải agent) vai ADMIN/MEMBER, không phải khách. */
  peerParticipant: boolean;
  /** Xuất xlsx/PDF (cần thấy từng người). */
  export: boolean;
}

export function contribAccess(role: ProjectRole | null, workspaceRole: WorkspaceRole | null, principal: Principal, opts: { teamVisible: boolean }): ContribAccess {
  const none: ContribAccess = { view: null, manage: false, peerAdmin: false, peerParticipant: false, export: false };
  if (!role || principal === 'AGENT' || role === 'CLIENT') return none;
  if (workspaceRole === 'GUEST' && role !== 'TEACHER') return none;
  const lead = role === 'ADMIN' || role === 'TEACHER';
  const view = lead || opts.teamVisible ? 'ALL' : 'SELF';
  return {
    view,
    manage: role === 'ADMIN',
    peerAdmin: lead,
    peerParticipant: role === 'ADMIN' || role === 'MEMBER',
    export: view === 'ALL',
  };
}

// ─── Đánh giá chéo ───────────────────────────────────────────────

export interface Criterion { key: string; label: string; description: string }

export const DEFAULT_CRITERIA: Criterion[] = [
  { key: 'contribution', label: 'Contribution', description: 'Took a fair share of the work and delivered what they took on.' },
  { key: 'deadlines', label: 'Deadlines', description: 'Finished tasks on time or warned the team early when they could not.' },
  { key: 'collaboration', label: 'Collaboration', description: 'Answered messages, helped others, joined meetings and reviews.' },
  { key: 'quality', label: 'Quality', description: 'Work was correct, tested and needed little rework.' },
];

/** Chuẩn hoá tiêu chí do người mở đợt gửi (4–5 tiêu chí, khoá a-z0-9_ duy nhất). */
export function normalizeCriteria(raw: unknown): Criterion[] {
  if (!Array.isArray(raw) || !raw.length) return DEFAULT_CRITERIA;
  const out: Criterion[] = [];
  const seen = new Set<string>();
  for (const r of raw.slice(0, 6)) {
    const o = (r ?? {}) as Record<string, unknown>;
    const label = String(o.label ?? '').trim().slice(0, 60);
    if (!label) continue;
    let key = String(o.key ?? label).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 32) || `c${out.length + 1}`;
    while (seen.has(key)) key = `${key}_${out.length + 1}`;
    seen.add(key);
    out.push({ key, label, description: String(o.description ?? '').trim().slice(0, 300) });
  }
  if (out.length < 3 || out.length > 6) throw new Error('Use 3 to 6 criteria');
  return out;
}

/** Điểm hợp lệ: đủ mọi tiêu chí, số nguyên 1–5. */
export function validateScores(criteria: Criterion[], raw: unknown): Record<string, number> {
  const o = (raw ?? {}) as Record<string, unknown>;
  const out: Record<string, number> = {};
  for (const c of criteria) {
    const v = Number(o[c.key]);
    if (!Number.isInteger(v) || v < 1 || v > 5) throw new Error(`Score "${c.label}" from 1 to 5`);
    out[c.key] = v;
  }
  return out;
}

export interface PeerAggregate {
  revieweeId: number;
  count: number;
  /** Trung bình từng tiêu chí (1 chữ số thập phân). */
  byCriterion: Record<string, number>;
  overall: number | null;
  /** Nhận xét KHÔNG kèm người viết, xếp theo chữ cái (thứ tự nộp sẽ lộ ai viết). */
  comments: string[];
}

export function aggregatePeer(reviews: Array<{ revieweeId: number; scores: unknown; comment: string | null }>, criteria: Criterion[]): Map<number, PeerAggregate> {
  const acc = new Map<number, { n: number; sums: Record<string, number>; comments: string[] }>();
  for (const r of reviews) {
    let a = acc.get(r.revieweeId);
    if (!a) { a = { n: 0, sums: {}, comments: [] }; acc.set(r.revieweeId, a); }
    a.n += 1;
    const s = (r.scores ?? {}) as Record<string, unknown>;
    for (const c of criteria) a.sums[c.key] = (a.sums[c.key] ?? 0) + (Number(s[c.key]) || 0);
    const t = (r.comment ?? '').trim();
    if (t) a.comments.push(t);
  }
  const out = new Map<number, PeerAggregate>();
  for (const [id, a] of acc) {
    const byCriterion: Record<string, number> = {};
    for (const c of criteria) byCriterion[c.key] = round1((a.sums[c.key] ?? 0) / a.n);
    const vals = Object.values(byCriterion);
    out.set(id, { revieweeId: id, count: a.n, byCriterion, overall: vals.length ? round1(vals.reduce((x, y) => x + y, 0) / vals.length) : null, comments: [...a.comments].sort((x, y) => x.localeCompare(y)) });
  }
  return out;
}

/** Thành viên tự xem điểm của mình chỉ khi đợt đã đóng VÀ có ít nhất 2 người chấm (một người chấm = lộ ngay là ai). */
export const PEER_MIN_REVIEWERS_FOR_SELF = 2;

// ─── Khớp danh tính ──────────────────────────────────────────────

/** Chữ thường, bỏ dấu tiếng Việt, gộp khoảng trắng. */
export function fold(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase().replace(/\s+/g, ' ').trim();
}

export interface IdentityPerson { id: number; username: string; email?: string | null; fullName?: string | null; displayName?: string | null }

/**
 * Bộ khớp tác giả commit ⇒ người: ánh xạ tay (login / email / tên) trước, rồi username = login, email trùng,
 * email noreply của GitHub (`123+login@users.noreply.github.com`), cuối cùng tên hiển thị/họ tên trùng (bỏ dấu) —
 * tên chỉ khớp khi DUY NHẤT một người mang tên đó.
 */
export function identityResolver(people: IdentityPerson[], manual: ReadonlyMap<string, number>) {
  const byUser = new Map<string, number>();
  const byEmail = new Map<string, number>();
  const byName = new Map<string, number | -1>();
  for (const p of people) {
    byUser.set(p.username.toLowerCase(), p.id);
    if (p.email) byEmail.set(p.email.toLowerCase(), p.id);
    for (const n of [p.displayName, p.fullName]) {
      if (!n) continue;
      const k = fold(n);
      const prev = byName.get(k);
      byName.set(k, prev === undefined || prev === p.id ? p.id : -1);
    }
  }
  return (a: { login?: string | null; email?: string | null; name?: string | null }): number | null => {
    const login = a.login?.trim().toLowerCase() || null;
    const email = a.email?.trim().toLowerCase() || null;
    const name = a.name?.trim() ? fold(a.name) : null;
    for (const k of [login, email, name]) if (k && manual.has(k)) return manual.get(k)!;
    if (login && byUser.has(login)) return byUser.get(login)!;
    if (email && byEmail.has(email)) return byEmail.get(email)!;
    const noreply = email ? /^(?:\d+\+)?([^@]+)@users\.noreply\.github\.com$/.exec(email)?.[1] : null;
    if (noreply && byUser.has(noreply)) return byUser.get(noreply)!;
    if (name) {
      const n = byName.get(name);
      if (n !== undefined && n !== -1) return n;
      if (byUser.has(name.replace(/\s+/g, ''))) return byUser.get(name.replace(/\s+/g, ''))!;
    }
    return null;
  };
}

/** Khoá danh tính để lưu ánh xạ tay: chữ thường (tên thì bỏ dấu). */
export function identityKey(raw: string): string {
  const s = raw.trim();
  return s.includes('@') ? s.toLowerCase() : fold(s);
}

// ─── Nhắc tên (@mention) ─────────────────────────────────────────

/** Thời gian phản hồi một lần nhắc: giờ tới hành động đầu tiên của người được nhắc SAU lần nhắc (trần `maxHours`). */
export function responseHours(mentionAt: Date, actions: Date[], maxHours = 48): number | null {
  let best: number | null = null;
  for (const t of actions) {
    const h = (t.getTime() - mentionAt.getTime()) / 3_600_000;
    if (h > 0 && h <= maxHours && (best === null || h < best)) best = h;
  }
  return best;
}

// ─── Định nghĩa chỉ số (tooltip trên web + sheet "Definitions" của tệp xuất — MỘT nguồn) ──

export const METRIC_DEFINITIONS: Record<string, { label: string; how: string }> = {
  assigned: { label: 'Assigned', how: 'Issues (not epics, not test cases) currently assigned to the member that were open at some point in the range.' },
  completed: { label: 'Completed', how: 'Stories, tasks, bugs and requirements resolved in the range, credited to whoever is assigned now. Sub-tasks are counted separately.' },
  points: { label: 'Points done', how: 'Story points (or original estimate in hours, if the project estimates in hours) of the completed issues.' },
  onTimeRate: { label: 'On time', how: 'Of the completed issues that had a due date: share finished on or before that date (project time zone).' },
  avgLateDays: { label: 'Avg days late', how: 'Average number of calendar days past the due date, over issues finished late in the range.' },
  overdueOpen: { label: 'Overdue now', how: 'Open issues assigned to the member whose due date has already passed (as of today).' },
  cycleDays: { label: 'Cycle time', how: 'Average days from the first move into an "In progress" status until done, for issues completed in the range.' },
  leadDays: { label: 'Lead time', how: 'Average days from creation until done, for issues completed in the range.' },
  hours: { label: 'Hours logged', how: 'Sum of work logs whose work date falls in the range, split by activity (Coding, Testing…).' },
  comments: { label: 'Comments', how: 'Comments written by the member on issues. Comments drafted by the AI assistant are not counted.' },
  voiceNotes: { label: 'Voice notes', how: 'Voice notes recorded in issue comments and project chat.' },
  chatMessages: { label: 'Chat messages', how: 'Messages the member posted in the project chat channels (system messages excluded). Shown as — until project chat is set up.' },
  responseHours: { label: 'Reply time', how: 'Median hours between being @mentioned and the member\'s next comment, change or chat message in the same place (within 48 h).' },
  reviewsDone: { label: 'Reviews done', how: 'Approval steps the member approved or rejected in the range.' },
  reviewRequests: { label: 'Review requests', how: 'Approval / review requests the member created in the range.' },
  commits: { label: 'Commits', how: 'Commits pushed to the connected GitHub/GitLab repository, matched to the member by login, email or name (admins can map unknown authors).' },
  prs: { label: 'Pull requests', how: 'Pull / merge requests opened by the member in the range.' },
  lines: { label: 'Lines + / −', how: 'Lines added and removed, from pull request events (GitHub sends line counts only for pull requests). — means the repository did not report them.' },
  docVersions: { label: 'Doc versions', how: 'Saved versions of Docs pages authored by the member (quick successive saves are merged into one version).' },
  pagesEdited: { label: 'Pages edited', how: 'Distinct Docs pages the member created or edited in the range.' },
  testRuns: { label: 'Test runs', how: 'Test case executions (pass/fail/blocked) recorded by the member in test cycles.' },
  testCasesCreated: { label: 'Test cases', how: 'Test cases (Xray style) created by the member.' },
  utcid: { label: 'UTCID (5.1)', how: 'Unit test cases in Report 5.1, credited by the "Created by" / "Executed by" name of the function.' },
  itExecuted: { label: '5.2 / 5.3 runs', how: 'Integration / system test rounds marked Passed or Failed with the member as tester.' },
  defectsFound: { label: 'Defects found', how: 'Bugs linked to failed test runs executed by the member.' },
  bugsReported: { label: 'Bugs reported', how: 'Bug issues the member reported in the range.' },
  meetings: { label: 'Meetings', how: 'Meetings the member attended (Present or Late in the attendance register) out of all non-cancelled meetings they were invited to. Meetings without attendance fall back to the estimate: marked Done and the member was invited (or organised).' },
  activeDays: { label: 'Active days', how: 'Days in the range with at least one action: an issue change, comment, chat message, work log, doc edit, test run, review or commit.' },
  streak: { label: 'Streak', how: 'Longest run of consecutive active days in the range.' },
  silent: { label: 'Days silent', how: 'Consecutive days without any recorded action up to today.' },
};

/** Ghi chú công bằng — in trên trang và trong tệp xuất. */
export const FAIRNESS_NOTE = 'Counts show activity, not quality or effort. Pair programming, research, design on paper and helping teammates leave no trace here. Use these numbers to start a conversation, never as a grade on their own.';
