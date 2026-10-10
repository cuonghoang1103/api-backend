/**
 * CT Work đợt 8c (12/10/2026) — HỌP ĐỊNH KỲ (RRULE) + MẪU CHƯƠNG TRÌNH HỌP — phần THUẦN (không DB), test ở ctw8c.test.ts.
 * Phần có DB ở meetingSeries.service.ts.
 *
 * Luật lặp dùng lại `Recurrence` của việc định kỳ (teachingRules.ts: DAILY/WEEKLY/MONTHLY · INTERVAL · BYDAY ·
 * BYMONTHDAY · giờ:phút · ngày bắt đầu/kết thúc) — một bộ luật, một bộ test cho cả thẻ định kỳ lẫn họp định kỳ.
 *
 *   occurrencesBetween  các ngày GỐC của buổi trong [from, to], trừ EXDATE, tối đa N buổi
 *   occurrenceTimes     ngày gốc + giờ của chuỗi (múi giờ chuỗi) ⇒ startsAt/endsAt UTC
 *   splitRecurrence     "từ buổi này về sau": cắt chuỗi cũ tới hôm trước, chuỗi mới bắt đầu từ ngày đó
 *   MEETING_TEMPLATES   mẫu chương trình theo loại họp (daily, sprint planning, review, retro, họp giảng viên, họp khách)
 */

import { nextOccurrences, normalizeRecurrence, toRrule, weekdayOf, type Recurrence } from './teachingRules.js';

export { normalizeRecurrence, toRrule };
export type { Recurrence };

/** Cửa sổ sinh sẵn buổi họp (ngày) và trần số buổi sinh một lần. */
export const SERIES_HORIZON_DAYS = 70;
export const SERIES_MAX_BATCH = 60;
export const SERIES_MAX_PER_PROJECT = 30;

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const dayNum = (day: string) => Date.parse(`${day}T00:00:00Z`) / 86_400_000;
export const addDay = (day: string, n: number) => new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
export const isDay = (s: unknown): s is string => typeof s === 'string' && DAY_RE.test(s) && !Number.isNaN(dayNum(s));

export function parseExdates(raw: unknown): string[] {
  return [...new Set((Array.isArray(raw) ? raw : []).filter(isDay))].sort().slice(-500);
}

/** Ngày gốc của các buổi trong [from, to] (YYYY-MM-DD, tính cả hai đầu), bỏ EXDATE, tối đa `max`. */
export function occurrencesBetween(rec: Recurrence, from: string, to: string, exdates: string[] = [], max = SERIES_MAX_BATCH): string[] {
  if (dayNum(to) < dayNum(from)) return [];
  const ex = new Set(exdates);
  const out: string[] = [];
  let cursor = from;
  // nextOccurrences quét tối đa 3 năm/lần — gọi theo lô để bỏ qua EXDATE mà vẫn đủ `max`.
  for (let guard = 0; guard < 50 && out.length < max; guard++) {
    const batch = nextOccurrences(rec, cursor, max + ex.size + 1);
    if (!batch.length) break;
    for (const d of batch) {
      if (dayNum(d) > dayNum(to)) return out;
      if (!ex.has(d)) out.push(d);
      if (out.length >= max) return out;
    }
    cursor = addDay(batch[batch.length - 1], 1);
  }
  return out;
}

/**
 * Giờ bắt đầu/kết thúc (UTC) của buổi ngày `day` theo múi giờ `tz`. `midnightOf(day)` = 00:00 của ngày đó tại `tz`
 * (projectTime.zonedMidnight — truyền vào để phần này thuần). Đổi giờ mùa hè được tính lại theo từng ngày.
 */
export function occurrenceTimes(rec: Recurrence, day: string, durationMin: number, midnightOf: (day: string) => Date): { startsAt: Date; endsAt: Date } {
  const startsAt = new Date(midnightOf(day).getTime() + (rec.hour * 60 + rec.minute) * 60_000);
  return { startsAt, endsAt: new Date(startsAt.getTime() + Math.max(5, Math.min(durationMin, 24 * 60)) * 60_000) };
}

/** "Từ buổi này về sau": chuỗi cũ kết thúc hôm trước `fromDay`, chuỗi mới bắt đầu đúng `fromDay` (giữ thứ trong tuần). */
export function splitRecurrence(rec: Recurrence, fromDay: string, patch: Partial<Recurrence> = {}): { before: Recurrence | null; after: Recurrence } {
  const prevEnd = addDay(fromDay, -1);
  const before = dayNum(prevEnd) < dayNum(rec.startDate) ? null : { ...rec, endDate: prevEnd };
  const merged = { ...rec, ...patch, startDate: patch.startDate ?? fromDay };
  // WEEKLY không chọn thứ ⇒ thứ của ngày bắt đầu CŨ (đừng để chuỗi mới nhảy sang thứ của fromDay).
  if (merged.freq === 'WEEKLY' && !merged.byWeekday.length) merged.byWeekday = [weekdayOf(rec.startDate)];
  if (merged.freq === 'MONTHLY' && merged.byMonthDay === null) merged.byMonthDay = Number(rec.startDate.slice(8, 10));
  return { before, after: normalizeRecurrence(merged) };
}

/** Câu mô tả ngắn ("Every 2 weeks on Mon, Thu at 09:00") — để hiện cạnh tên chuỗi và trong email. */
export function describeRecurrence(rec: Recurrence, lang: 'en' | 'vi' = 'en'): string {
  const hh = `${String(rec.hour).padStart(2, '0')}:${String(rec.minute).padStart(2, '0')}`;
  const EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const VI = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const days = (rec.byWeekday.length ? rec.byWeekday : [weekdayOf(rec.startDate)]).map((d) => (lang === 'vi' ? VI : EN)[d]).join(', ');
  const md = rec.byMonthDay ?? Number(rec.startDate.slice(8, 10));
  const n = rec.interval;
  let s: string;
  if (lang === 'vi') {
    s = rec.freq === 'DAILY' ? (n === 1 ? 'Hằng ngày' : `Mỗi ${n} ngày`)
      : rec.freq === 'WEEKLY' ? `${n === 1 ? 'Hằng tuần' : `Mỗi ${n} tuần`} vào ${days}`
        : `${n === 1 ? 'Hằng tháng' : `Mỗi ${n} tháng`} ngày ${md === -1 ? 'cuối tháng' : md}`;
    return `${s} lúc ${hh}${rec.endDate ? ` đến ${rec.endDate}` : ''}`;
  }
  s = rec.freq === 'DAILY' ? (n === 1 ? 'Daily' : `Every ${n} days`)
    : rec.freq === 'WEEKLY' ? `${n === 1 ? 'Weekly' : `Every ${n} weeks`} on ${days}`
      : `${n === 1 ? 'Monthly' : `Every ${n} months`} on day ${md === -1 ? 'last' : md}`;
  return `${s} at ${hh}${rec.endDate ? ` until ${rec.endDate}` : ''}`;
}

/** Phạm vi sửa/xoá buổi thuộc chuỗi — như Google Calendar/Outlook. */
export const SERIES_SCOPES = ['one', 'following', 'all'] as const;
export type SeriesScope = (typeof SERIES_SCOPES)[number];

/** Trường của buổi mà sửa CẢ CHUỖI được phép ghi đè (buổi chưa sửa riêng, chưa diễn ra, chưa huỷ). */
export const SERIES_FIELDS = ['title', 'type', 'location', 'meetingUrl', 'durationMin', 'timezone', 'agendaItems'] as const;

// ─── Mẫu chương trình họp ────────────────────────────────────────

export interface MeetingTemplate {
  key: string;
  type: 'DAILY' | 'PLANNING' | 'DEMO' | 'RETRO' | 'MENTOR' | 'CLIENT';
  name: string;
  durationMin: number;
  /** Lặp gợi ý khi tạo chuỗi từ mẫu. */
  suggest: { freq: 'DAILY' | 'WEEKLY' | 'MONTHLY'; interval: number; byWeekday?: number[] };
  agenda: Array<{ title: string; minutes: number }>;
  /** Khung biên bản (markdown) — đổ vào minutesJson khi tạo buổi, người viết tiếp. */
  minutes: string;
  description: string;
}

export const MEETING_TEMPLATES: readonly MeetingTemplate[] = [
  {
    key: 'daily', type: 'DAILY', name: 'Daily stand-up', durationMin: 15,
    suggest: { freq: 'WEEKLY', interval: 1, byWeekday: [1, 2, 3, 4, 5] },
    description: 'Three questions per person, 15 minutes, problems taken offline.',
    agenda: [
      { title: 'What did I finish since the last stand-up?', minutes: 5 },
      { title: 'What will I do before the next one?', minutes: 5 },
      { title: 'What is blocking me? (owner + next step, solved after the meeting)', minutes: 5 },
    ],
    minutes: '## Round\n\n| Member | Done | Next | Blocker |\n|---|---|---|---|\n|  |  |  |  |\n\n## Blockers to follow up\n\n- \n',
  },
  {
    key: 'sprint-planning', type: 'PLANNING', name: 'Sprint planning', durationMin: 90,
    suggest: { freq: 'WEEKLY', interval: 2, byWeekday: [1] },
    description: 'Sprint goal, capacity, pick and size backlog items, split into tasks.',
    agenda: [
      { title: 'Sprint goal (Product Owner proposes, team agrees)', minutes: 10 },
      { title: 'Team capacity — days off, meetings, carry-over', minutes: 10 },
      { title: 'Walk the ordered backlog: clarify, estimate, accept items', minutes: 45 },
      { title: 'Break accepted items into tasks + owners', minutes: 20 },
      { title: 'Confirm commitment and risks', minutes: 5 },
    ],
    minutes: '## Sprint goal\n\n\n## Capacity\n\n| Member | Available days | Notes |\n|---|---|---|\n|  |  |  |\n\n## Committed items\n\n- \n\n## Risks / dependencies\n\n- \n',
  },
  {
    key: 'sprint-review', type: 'DEMO', name: 'Sprint review (demo)', durationMin: 60,
    suggest: { freq: 'WEEKLY', interval: 2, byWeekday: [5] },
    description: 'Demo the increment to stakeholders and adapt the backlog.',
    agenda: [
      { title: 'Sprint goal recap — what was done, what was not and why', minutes: 10 },
      { title: 'Live demo of finished items (Definition of Done met)', minutes: 30 },
      { title: 'Stakeholder feedback → new or changed backlog items', minutes: 15 },
      { title: 'Release / next sprint outlook', minutes: 5 },
    ],
    minutes: '## Demoed\n\n| Item | Demo by | Accepted? | Feedback |\n|---|---|---|---|\n|  |  |  |  |\n\n## Not done\n\n- \n\n## Backlog changes\n\n- \n',
  },
  {
    key: 'retro', type: 'RETRO', name: 'Sprint retrospective', durationMin: 60,
    suggest: { freq: 'WEEKLY', interval: 2, byWeekday: [5] },
    description: 'Set the stage, gather data, generate insights, decide 1–3 actions (Derby & Larsen).',
    agenda: [
      { title: 'Set the stage — check-in, review last retro actions', minutes: 5 },
      { title: 'Gather data — went well / to improve / ideas', minutes: 20 },
      { title: 'Generate insights — group, vote, discuss top items', minutes: 20 },
      { title: 'Decide what to do — 1–3 actions with owner + due date', minutes: 10 },
      { title: 'Close — one word each', minutes: 5 },
    ],
    minutes: '## Last retro actions\n\n- \n\n## Went well\n\n- \n\n## To improve\n\n- \n\n## Actions (owner, due)\n\n- \n',
  },
  {
    key: 'lecturer', type: 'MENTOR', name: 'Lecturer / mentor meeting', durationMin: 45,
    suggest: { freq: 'WEEKLY', interval: 1 },
    description: 'Weekly check-in with the lecturer (SEP490/SWP391): progress vs plan, issues, feedback on documents.',
    agenda: [
      { title: 'Progress since last meeting vs the plan (tasks done, % complete)', minutes: 10 },
      { title: 'Deliverables for review (Report n, demo, test results)', minutes: 15 },
      { title: 'Problems and questions for the lecturer', minutes: 10 },
      { title: 'Lecturer feedback and requests', minutes: 5 },
      { title: 'Plan until next meeting (owner + due date)', minutes: 5 },
    ],
    minutes: '## Attendance\n\n(see attendance list)\n\n## Progress\n\n- \n\n## Lecturer feedback\n\n- \n\n## Decisions\n\n- \n\n## Next steps (owner, due)\n\n- \n',
  },
  {
    key: 'client', type: 'CLIENT', name: 'Client meeting', durationMin: 60,
    suggest: { freq: 'WEEKLY', interval: 1 },
    description: 'Status for the client: delivered, upcoming, decisions needed, open change requests.',
    agenda: [
      { title: 'Status since last meeting — delivered items, milestones', minutes: 10 },
      { title: 'Demo / review of deliverables', minutes: 20 },
      { title: 'Decisions needed from the client', minutes: 15 },
      { title: 'Change requests, risks and issues', minutes: 10 },
      { title: 'Next steps and next meeting date', minutes: 5 },
    ],
    minutes: '## Delivered\n\n- \n\n## Client decisions\n\n- \n\n## Change requests / risks\n\n- \n\n## Next steps (owner, due)\n\n- \n',
  },
];

export const MEETING_TEMPLATE_KEYS = MEETING_TEMPLATES.map((t) => t.key);
export function meetingTemplate(key: string | null | undefined): MeetingTemplate | null {
  return MEETING_TEMPLATES.find((t) => t.key === key) ?? null;
}
/** Agenda có cấu trúc (K-2 `agendaItems`) từ một mẫu — id ổn định theo vị trí để sửa lại không nhân đôi. */
export function templateAgendaItems(t: MeetingTemplate): Array<{ id: string; title: string; presenterId: null; minutes: number; ref: null }> {
  return t.agenda.map((a, i) => ({ id: `${t.key}-${i + 1}`, title: a.title, presenterId: null, minutes: a.minutes, ref: null }));
}
