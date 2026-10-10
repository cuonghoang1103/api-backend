/**
 * CTW đợt 9a (13/10/2026) — LỊCH LỚP + ĐIỂM DANH (tab Calendar).
 *
 *   Buổi học định kỳ: luật lặp `Recurrence` dùng chung với việc/họp định kỳ (teachingRules + meetingSeries.ts) — sinh
 *   trọn các buổi tới ngày kết thúc (không có ⇒ 20 tuần; trần 120 buổi), giờ theo múi giờ lớp. Thêm buổi lẻ, huỷ buổi.
 *   Lịch gộp: buổi học + mục do mô-đun khác đẩy vào (`addCalendarItem` — hạn bài 9b, quiz 9c). Xuất .ics cho lớp.
 *
 *   Điểm danh theo buổi: GV mở phiên ⇒ mã 6 số + QR (link `/work/classes?id=…&tab=calendar&checkin=<mã>`), hạn mặc định
 *   5 phút; bấm lại = MÃ MỚI (mã cũ chết ngay). SV nhập mã/quét QR ⇒ PRESENT, hoặc LATE nếu sau giờ bắt đầu quá
 *   `lateAfterMin` phút. Chặn điểm danh hộ ở mức hợp lý: mỗi ghế một dòng/buổi (UNIQUE), sai 5 lần / 10 phút ⇒ khoá tới
 *   hết cửa sổ (kể cả mã đúng), mã sống ngắn và đổi được. GV sửa tay: PRESENT / LATE / EXCUSED / ABSENT.
 *   Thống kê vắng theo SV (buổi đã điểm danh mà không có dòng ⇒ vắng), cờ vượt ngưỡng (mặc định 20%), xuất xlsx.
 *
 * Quyền: GV/OWNER quản lý + xem thống kê cả lớp; SV chỉ thấy điểm danh CỦA MÌNH; agent 403 (classCtx).
 */

import { randomInt } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { config } from '../../config/env.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { PUBLIC_USER, cutText, frontendUrl } from './common.js';
import { assertWritable, classCtx, linkUrl, type ClassCtx } from './classStream.service.js';
import {
  ATTENDANCE_STATUSES, CHECKIN_DEFAULT_MIN, CHECKIN_MAX_MIN, DEFAULT_SERIES_WEEKS, MAX_SESSIONS_PER_SERIES, attendanceSummary,
  checkinStatusAt, cleanCheckinCode, isCheckinCode, isLocked, newCheckinCode, noteFail, parseIdList, visibleToStudent, type AttendanceStatus,
} from './classStreamRules.js';
import { icsDocument, icsEscape, icsStamp } from './ics.js';
import { addDay, occurrencesBetween, occurrenceTimes } from './meetingSeries.js';
import { zonedMidnight } from './projectTime.js';
import { RecurrenceError, normalizeRecurrence, toRrule, type Recurrence } from './teachingRules.js';
import { writeXlsx, XSheet, type XStyle } from './xlsxStyled.js';

const MAX_SESSIONS_PER_CLASS = 400;
const MAX_SERIES_PER_CLASS = 20;

// ─── Mục lịch từ mô-đun khác (điểm cắm cho 9b/9c) ─────────────────

export interface CalendarItemInput {
  classId: number;
  /** 'DUE' (hạn nộp) | 'EVENT' (mốc khác, vd. quiz mở). */
  kind?: 'DUE' | 'EVENT';
  /** Nguồn — 'ASSIGNMENT' | 'QUIZ' … (≤ 16 ký tự). (lớp, refType, refId) là khoá: gọi lại = cập nhật. */
  refType: string;
  refId: number;
  title: string;
  startsAt: Date;
  endsAt?: Date | null;
  /** Link mở mục (vd. `/work/classes?id=1&tab=classwork&a=5`). */
  url?: string | null;
  /** Rỗng = cả lớp. */
  audienceGroupIds?: number[];
}

/** 9b/9c gọi khi tạo/sửa bài có hạn (upsert). */
export async function addCalendarItem(i: CalendarItemInput): Promise<{ id: number }> {
  const data = {
    kind: i.kind === 'EVENT' ? 'EVENT' : 'DUE', title: cutText(i.title.trim() || 'Untitled', 255), startsAt: i.startsAt, endsAt: i.endsAt ?? null,
    url: i.url ?? null, audienceGroupIds: parseIdList(i.audienceGroupIds),
  };
  const refType = i.refType.slice(0, 16);
  return prisma.workClassCalendarItem.upsert({
    where: { classId_refType_refId: { classId: i.classId, refType, refId: i.refId } },
    create: { classId: i.classId, refType, refId: i.refId, ...data },
    update: data,
    select: { id: true },
  });
}

/** Bài bị xoá / bỏ hạn ⇒ gỡ khỏi lịch. */
export async function removeCalendarItem(classId: number, refType: string, refId: number): Promise<void> {
  await prisma.workClassCalendarItem.deleteMany({ where: { classId, refType: refType.slice(0, 16), refId } });
}

/**
 * Hạn bài KÉO từ mô-đun 9b/9c (`assignmentDeadlines` / `quizDeadlines` — chúng tự lọc quyền: SV chỉ thấy bài được giao).
 * Nạp lười + bọc lỗi: mô-đun thiếu / đổi tên ⇒ lịch vẫn chạy với phần còn lại. Mục đẩy qua addCalendarItem cùng khoá
 * (refType, refId) thắng — không hiện hai lần.
 */
type Pulled = { kind: string; refId: number; title: string; at: Date; link?: string | Record<string, string> | null };
async function pulledDeadlines(userId: number, classId: number, range: { from: Date; to: Date }) {
  const out: Array<{ refType: string; refId: number; title: string; startsAt: Date; url: string | null }> = [];
  const sources: Array<[string, string]> = [['./classwork.service.js', 'assignmentDeadlines'], ['./quiz.service.js', 'quizDeadlines']];
  for (const [mod, fn] of sources) {
    try {
      const m = (await import(mod)) as Record<string, unknown>;
      const f = m[fn] as undefined | ((u: number, c: number, r: { from: Date; to: Date }) => Promise<Pulled[]>);
      if (typeof f !== 'function') continue;
      for (const d of await f(userId, classId, range)) {
        if (!d?.at) continue;
        out.push({ refType: String(d.kind).slice(0, 16), refId: d.refId, title: d.title, startsAt: new Date(d.at), url: linkUrl(classId, d.link ?? null) });
      }
    } catch { /* mô-đun chưa có / lỗi quyền ⇒ bỏ qua nguồn này */ }
  }
  return out;
}

// ─── Buổi học ─────────────────────────────────────────────────────

export interface SeriesInput { title: string; recurrence: unknown; durationMin?: number; location?: string | null; meetingUrl?: string | null }
export interface SessionInput { title?: string; startsAt?: string; durationMin?: number; location?: string | null; meetingUrl?: string | null; status?: 'SCHEDULED' | 'CANCELLED' }

const cleanUrl = (u: string | null | undefined) => {
  const s = u?.trim();
  if (!s) return null;
  if (!/^https?:\/\//i.test(s)) throw new BadRequestError('The meeting link must start with http(s)://', 'WORK_CLASS_BAD');
  return s.slice(0, 500);
};
const clampDur = (n: number | undefined, d: number) => Math.min(Math.max(Math.round(n ?? d), 5), 600);

function recurrenceOf(raw: unknown): Recurrence {
  try { return normalizeRecurrence(raw); } catch (err) {
    if (err instanceof RecurrenceError) throw new BadRequestError(err.message, 'WORK_BAD_RECURRENCE');
    throw err;
  }
}

/** Các buổi của một luật lặp (thuần — export để test). */
export function seriesOccurrences(rec: Recurrence, tz: string, durationMin: number): Array<{ day: string; startsAt: Date; endsAt: Date }> {
  const end = rec.endDate ?? addDay(rec.startDate, DEFAULT_SERIES_WEEKS * 7 - 1);
  return occurrencesBetween(rec, rec.startDate, end, [], MAX_SESSIONS_PER_SERIES).map((day) => ({ day, ...occurrenceTimes(rec, day, durationMin, (d) => zonedMidnight(d, tz)) }));
}

export async function createSeries(userId: number, classId: number, input: SeriesInput) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  if (await prisma.workClassSessionSeries.count({ where: { classId } }) >= MAX_SERIES_PER_CLASS) throw new BadRequestError(`At most ${MAX_SERIES_PER_CLASS} schedules per class`, 'WORK_LIMIT');
  const rec = recurrenceOf(input.recurrence);
  const durationMin = clampDur(input.durationMin, 90);
  const occ = seriesOccurrences(rec, ctx.cls.timezone, durationMin);
  if (!occ.length) throw new BadRequestError('This schedule has no sessions', 'WORK_BAD_RECURRENCE');
  const existing = await prisma.workClassSession.count({ where: { classId } });
  if (existing + occ.length > MAX_SESSIONS_PER_CLASS) throw new BadRequestError(`A class can have at most ${MAX_SESSIONS_PER_CLASS} sessions`, 'WORK_LIMIT');
  const title = cutText((input.title ?? '').trim() || 'Class session', 120);
  const location = input.location?.trim().slice(0, 255) || null;
  const meetingUrl = cleanUrl(input.meetingUrl);
  const s = await prisma.workClassSessionSeries.create({
    data: { classId, title, recurrence: rec as unknown as Prisma.InputJsonValue, rrule: toRrule(rec), durationMin, location, meetingUrl },
    select: { id: true },
  });
  await prisma.workClassSession.createMany({
    data: occ.map((o) => ({ classId, seriesId: s.id, occurrenceDay: o.day, title, startsAt: o.startsAt, endsAt: o.endsAt, location, meetingUrl })),
    skipDuplicates: true,
  });
  return { id: s.id, sessions: occ.length, rrule: toRrule(rec) };
}

/** Xoá lịch định kỳ: buổi TƯƠNG LAI chưa điểm danh bị xoá; buổi đã qua / đã có điểm danh giữ lại (tách khỏi chuỗi). */
export async function deleteSeries(userId: number, classId: number, seriesId: number, now = new Date()) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const s = await prisma.workClassSessionSeries.findFirst({ where: { id: seriesId, classId }, select: { id: true } });
  if (!s) throw new NotFoundError('Schedule not found');
  const del = await prisma.workClassSession.deleteMany({ where: { seriesId, startsAt: { gt: now }, attendance: { none: {} }, checkinOpenedAt: null } });
  await prisma.workClassSessionSeries.delete({ where: { id: seriesId } });
  return { removedSessions: del.count };
}

export async function createSession(userId: number, classId: number, input: SessionInput) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const startsAt = input.startsAt ? new Date(input.startsAt) : null;
  if (!startsAt || Number.isNaN(startsAt.getTime())) throw new BadRequestError('Pick the start time', 'WORK_BAD_DATE');
  if (await prisma.workClassSession.count({ where: { classId } }) >= MAX_SESSIONS_PER_CLASS) throw new BadRequestError(`A class can have at most ${MAX_SESSIONS_PER_CLASS} sessions`, 'WORK_LIMIT');
  const s = await prisma.workClassSession.create({
    data: {
      classId, title: cutText((input.title ?? '').trim() || 'Class session', 120), startsAt,
      endsAt: new Date(startsAt.getTime() + clampDur(input.durationMin, 90) * 60_000),
      location: input.location?.trim().slice(0, 255) || null, meetingUrl: cleanUrl(input.meetingUrl),
    },
    select: { id: true },
  });
  return { id: s.id };
}

async function sessionOf(ctx: ClassCtx, sessionId: number) {
  const s = await prisma.workClassSession.findFirst({ where: { id: sessionId, classId: ctx.classId } });
  if (!s) throw new NotFoundError('Session not found');
  return s;
}

export async function updateSession(userId: number, classId: number, sessionId: number, input: SessionInput) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const s = await sessionOf(ctx, sessionId);
  const data: Prisma.WorkClassSessionUpdateInput = {};
  if (input.title !== undefined) data.title = cutText(input.title.trim() || 'Class session', 120);
  if (input.location !== undefined) data.location = input.location?.trim().slice(0, 255) || null;
  if (input.meetingUrl !== undefined) data.meetingUrl = cleanUrl(input.meetingUrl);
  if (input.startsAt !== undefined || input.durationMin !== undefined) {
    const start = input.startsAt ? new Date(input.startsAt) : s.startsAt;
    if (Number.isNaN(start.getTime())) throw new BadRequestError('Pick the start time', 'WORK_BAD_DATE');
    const dur = input.durationMin ?? Math.round((s.endsAt.getTime() - s.startsAt.getTime()) / 60_000);
    data.startsAt = start;
    data.endsAt = new Date(start.getTime() + clampDur(dur, 90) * 60_000);
  }
  if (input.status !== undefined) {
    data.status = input.status;
    if (input.status === 'CANCELLED') { data.checkinCode = null; data.checkinExpiresAt = null; }
  }
  await prisma.workClassSession.update({ where: { id: sessionId }, data });
  return { ok: true };
}

export async function deleteSession(userId: number, classId: number, sessionId: number) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  await sessionOf(ctx, sessionId);
  if (await prisma.workClassAttendance.count({ where: { sessionId } })) throw new BadRequestError('This session has attendance — cancel it instead of deleting', 'WORK_CLASS_HAS_ATTENDANCE');
  await prisma.workClassSession.delete({ where: { id: sessionId } });
  return { deleted: true };
}

// ─── Lịch gộp ─────────────────────────────────────────────────────

const statusOfMine = async (seatId: number | null, sessionIds: number[]) => {
  if (!seatId || !sessionIds.length) return new Map<number, string>();
  const rows = await prisma.workClassAttendance.findMany({ where: { studentId: seatId, sessionId: { in: sessionIds } }, select: { sessionId: true, status: true } });
  return new Map(rows.map((r) => [r.sessionId, r.status]));
};

export async function listCalendar(userId: number, classId: number, range: { from?: string; to?: string } = {}, now = new Date()) {
  const ctx = await classCtx(userId, classId);
  const from = range.from ? new Date(`${range.from.slice(0, 10)}T00:00:00Z`) : new Date(now.getTime() - 120 * 86_400_000);
  const to = range.to ? new Date(`${range.to.slice(0, 10)}T23:59:59Z`) : new Date(now.getTime() + 240 * 86_400_000);
  const [sessions, items, series] = await Promise.all([
    prisma.workClassSession.findMany({
      where: { classId, startsAt: { gte: from, lte: to } }, orderBy: { startsAt: 'asc' }, take: 500,
      select: {
        id: true, seriesId: true, title: true, startsAt: true, endsAt: true, location: true, meetingUrl: true, status: true,
        checkinExpiresAt: true, checkinOpenedAt: true, ...(ctx.manage ? { _count: { select: { attendance: true } } } : {}),
      },
    }),
    prisma.workClassCalendarItem.findMany({ where: { classId, startsAt: { gte: from, lte: to } }, orderBy: { startsAt: 'asc' }, take: 500, select: { id: true, kind: true, refType: true, refId: true, title: true, startsAt: true, endsAt: true, url: true, audienceGroupIds: true } }),
    ctx.manage ? prisma.workClassSessionSeries.findMany({ where: { classId }, orderBy: { id: 'asc' }, select: { id: true, title: true, rrule: true, recurrence: true, durationMin: true, location: true, meetingUrl: true, _count: { select: { sessions: true } } } }) : [],
  ]);
  const mine = await statusOfMine(ctx.seat?.id ?? null, sessions.map((s) => s.id));
  const pulled = await pulledDeadlines(userId, classId, { from, to });
  const students = ctx.manage ? await prisma.workClassStudent.count({ where: { classId } }) : 0;
  return {
    manage: ctx.manage, timezone: ctx.cls.timezone, students, isStudent: !!ctx.seat,
    settings: { absenceThreshold: ctx.cls.absenceThreshold, lateAfterMin: ctx.cls.lateAfterMin },
    sessions: sessions.map((s) => ({
      id: s.id, seriesId: s.seriesId, title: s.title, startsAt: s.startsAt, endsAt: s.endsAt, location: s.location, meetingUrl: s.meetingUrl, status: s.status,
      checkinOpen: !!s.checkinExpiresAt && s.checkinExpiresAt > now && s.status !== 'CANCELLED',
      ...(ctx.manage ? { marked: (s as { _count?: { attendance: number } })._count?.attendance ?? 0, tracked: !!s.checkinOpenedAt } : { myStatus: mine.get(s.id) ?? null }),
    })),
    items: items
      .filter((i) => ctx.manage || visibleToStudent({ publishedAt: i.startsAt, deletedAt: null, audienceGroupIds: i.audienceGroupIds }, ctx.seat?.groupId ?? null))
      .map((i) => ({ id: i.id, kind: i.kind, refType: i.refType, refId: i.refId, title: i.title, startsAt: i.startsAt, endsAt: i.endsAt, url: i.url }))
      .concat(pulled.filter((d) => !items.some((i) => i.refType === d.refType && i.refId === d.refId))
        .map((d) => ({ id: -d.refId, kind: 'DUE', refType: d.refType, refId: d.refId, title: d.title, startsAt: d.startsAt, endsAt: null, url: d.url })))
      .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime()),
    series: (series as Array<{ id: number; title: string; rrule: string; recurrence: unknown; durationMin: number; location: string | null; meetingUrl: string | null; _count: { sessions: number } }>)
      .map((s) => ({ id: s.id, title: s.title, rrule: s.rrule, recurrence: s.recurrence, durationMin: s.durationMin, location: s.location, meetingUrl: s.meetingUrl, sessions: s._count.sessions })),
  };
}

/** Tệp .ics của lớp: buổi học (trừ buổi huỷ được đánh CANCELLED) + hạn bài người này thấy. */
export async function classIcs(userId: number, classId: number, now = new Date()) {
  const ctx = await classCtx(userId, classId);
  const [sessions, items] = await Promise.all([
    prisma.workClassSession.findMany({ where: { classId }, orderBy: { startsAt: 'asc' }, take: 500 }),
    prisma.workClassCalendarItem.findMany({ where: { classId }, orderBy: { startsAt: 'asc' }, take: 500 }),
  ]);
  const host = (() => { try { return new URL(config.frontendUrl ?? 'https://cuongthai.com').hostname; } catch { return 'cuongthai.com'; } })();
  const ev = (uid: string, title: string, start: Date, end: Date, extra: string[]) => [
    'BEGIN:VEVENT', `UID:${uid}@${host}`, `DTSTAMP:${icsStamp(now)}`, `DTSTART:${icsStamp(start)}`, `DTEND:${icsStamp(end > start ? end : new Date(start.getTime() + 15 * 60_000))}`,
    `SUMMARY:${icsEscape(title)}`, ...extra, `X-CTWORK-TZ:${icsEscape(ctx.cls.timezone)}`, 'END:VEVENT',
  ];
  const lines: string[] = [];
  for (const s of sessions) {
    const where = [s.location?.trim(), s.meetingUrl?.trim()].filter(Boolean).join(' · ');
    lines.push(...ev(`ctw-class-${classId}-session-${s.id}`, `${ctx.cls.classCode}: ${s.title}`, s.startsAt, s.endsAt, [
      ...(where ? [`LOCATION:${icsEscape(where)}`] : []), `STATUS:${s.status === 'CANCELLED' ? 'CANCELLED' : 'CONFIRMED'}`,
      `URL:${frontendUrl(`/work/classes?id=${classId}&tab=calendar`)}`,
    ]));
  }
  for (const i of items) {
    if (!ctx.manage && !visibleToStudent({ publishedAt: i.startsAt, deletedAt: null, audienceGroupIds: i.audienceGroupIds }, ctx.seat?.groupId ?? null)) continue;
    lines.push(...ev(`ctw-class-${classId}-${i.refType.toLowerCase()}-${i.refId}`, `${ctx.cls.classCode}: ${i.kind === 'DUE' ? 'Due — ' : ''}${i.title}`, i.startsAt, i.endsAt ?? i.startsAt, [
      ...(i.url ? [`URL:${i.url.startsWith('/') ? frontendUrl(i.url) : i.url}`] : []), 'TRANSP:TRANSPARENT',
    ]));
  }
  const pulled = await pulledDeadlines(userId, classId, { from: new Date(now.getTime() - 365 * 86_400_000), to: new Date(now.getTime() + 365 * 86_400_000) });
  for (const d of pulled) {
    if (items.some((i) => i.refType === d.refType && i.refId === d.refId)) continue;
    lines.push(...ev(`ctw-class-${classId}-${d.refType.toLowerCase()}-${d.refId}`, `${ctx.cls.classCode}: Due — ${d.title}`, d.startsAt, d.startsAt, [
      ...(d.url ? [`URL:${d.url.startsWith('/') ? frontendUrl(d.url) : d.url}`] : []), 'TRANSP:TRANSPARENT',
    ]));
  }
  return { body: icsDocument(lines, { name: `${ctx.cls.classCode} · ${ctx.cls.name}` }), fileName: `${ctx.cls.classCode}-calendar.ics` };
}

// ─── Điểm danh ────────────────────────────────────────────────────

const checkinFails = new Map<string, { n: number; until: number }>();
/** CHỈ cho test. */
export function _resetCheckinRate() { checkinFails.clear(); }

const checkinUrl = (classId: number, code: string) => frontendUrl(`/work/classes?id=${classId}&tab=calendar&checkin=${code}`);

/** GV mở phiên điểm danh (hoặc bấm lại để ĐỔI MÃ — mã cũ chết ngay). */
export async function openCheckin(userId: number, classId: number, sessionId: number, input: { minutes?: number } = {}, now = new Date()) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  const s = await sessionOf(ctx, sessionId);
  if (s.status === 'CANCELLED') throw new BadRequestError('This session is cancelled', 'WORK_CLASS_CANCELLED');
  const minutes = Math.min(Math.max(Math.round(input.minutes ?? CHECKIN_DEFAULT_MIN), 1), CHECKIN_MAX_MIN);
  let code = newCheckinCode(randomInt);
  // Không trùng mã đang mở của buổi KHÁC cùng lớp (SV nhập mã không chọn buổi).
  for (let i = 0; i < 5 && (code === s.checkinCode || await prisma.workClassSession.count({ where: { classId, checkinCode: code, checkinExpiresAt: { gt: now }, id: { not: sessionId } } })); i++) code = newCheckinCode(randomInt);
  const expiresAt = new Date(now.getTime() + minutes * 60_000);
  await prisma.workClassSession.update({ where: { id: sessionId }, data: { checkinCode: code, checkinOpenedAt: s.checkinOpenedAt ?? now, checkinExpiresAt: expiresAt } });
  return { sessionId, code, expiresAt, url: checkinUrl(classId, code), minutes };
}

export async function closeCheckin(userId: number, classId: number, sessionId: number) {
  const ctx = await classCtx(userId, classId, true);
  await sessionOf(ctx, sessionId);
  await prisma.workClassSession.update({ where: { id: sessionId }, data: { checkinCode: null, checkinExpiresAt: null } });
  return { closed: true };
}

/** Bảng điểm danh của một buổi (GV): mọi ghế + trạng thái + mã đang mở. */
export async function sessionSheet(userId: number, classId: number, sessionId: number, now = new Date()) {
  const ctx = await classCtx(userId, classId, true);
  const s = await sessionOf(ctx, sessionId);
  const [seats, rows, groups] = await Promise.all([
    prisma.workClassStudent.findMany({ where: { classId }, orderBy: [{ studentCode: 'asc' }, { id: 'asc' }], select: { id: true, studentCode: true, fullName: true, email: true, groupId: true, user: { select: PUBLIC_USER } } }),
    prisma.workClassAttendance.findMany({ where: { sessionId }, select: { studentId: true, status: true, source: true, checkedInAt: true, note: true, updatedAt: true } }),
    prisma.workClassGroup.findMany({ where: { classId }, select: { id: true, name: true } }),
  ]);
  const by = new Map(rows.map((r) => [r.studentId, r]));
  const open = !!s.checkinExpiresAt && s.checkinExpiresAt > now && s.status !== 'CANCELLED';
  return {
    session: { id: s.id, title: s.title, startsAt: s.startsAt, endsAt: s.endsAt, status: s.status, location: s.location },
    checkin: open ? { code: s.checkinCode, expiresAt: s.checkinExpiresAt, url: checkinUrl(classId, s.checkinCode!) } : null,
    groups,
    rows: seats.map((st) => {
      const r = by.get(st.id);
      return {
        studentId: st.id, studentCode: st.studentCode, fullName: st.fullName, email: st.email, groupId: st.groupId, user: st.user,
        status: r?.status ?? null, source: r?.source ?? null, checkedInAt: r?.checkedInAt ?? null, note: r?.note ?? null, updatedAt: r?.updatedAt ?? null,
      };
    }),
    counts: ATTENDANCE_STATUSES.reduce((a, k) => ({ ...a, [k]: rows.filter((r) => r.status === k).length }), {} as Record<AttendanceStatus, number>),
  };
}

/** SV nhập mã / quét QR. */
export async function checkin(userId: number, classId: number, rawCode: string, now = new Date()) {
  const ctx = await classCtx(userId, classId);
  assertWritable(ctx);
  if (!ctx.seat) throw new ForbiddenError('Only students of this class check in');
  const key = `${classId}:${userId}`;
  if (isLocked(checkinFails, key, now.getTime())) throw new AppError('Too many wrong codes. Ask your lecturer to mark you, or try again in a few minutes.', 429, 'WORK_CHECKIN_RATE');
  const code = cleanCheckinCode(rawCode ?? '');
  const fail = (status: number, codeName: string, msg: string): never => {
    noteFail(checkinFails, key, now.getTime());
    throw new AppError(msg, status, codeName);
  };
  if (!isCheckinCode(code)) fail(400, 'WORK_CHECKIN_INVALID', 'Enter the 6-digit code shown by your lecturer');
  const s = await prisma.workClassSession.findFirst({ where: { classId, checkinCode: code, status: { not: 'CANCELLED' } }, orderBy: { checkinExpiresAt: 'desc' }, select: { id: true, title: true, startsAt: true, checkinExpiresAt: true } });
  if (!s) fail(400, 'WORK_CHECKIN_INVALID', 'This code is not valid');
  if (!s!.checkinExpiresAt || s!.checkinExpiresAt <= now) fail(410, 'WORK_CHECKIN_EXPIRED', 'This code has expired — ask your lecturer for a new one');
  const existing = await prisma.workClassAttendance.findUnique({ where: { sessionId_studentId: { sessionId: s!.id, studentId: ctx.seat.id } }, select: { status: true, source: true } });
  if (existing) throw new ConflictError(existing.source === 'CODE' ? 'You already checked in to this session' : 'Your lecturer already marked your attendance for this session');
  const status = checkinStatusAt(s!.startsAt, now, ctx.cls.lateAfterMin);
  try {
    await prisma.workClassAttendance.create({ data: { sessionId: s!.id, studentId: ctx.seat.id, status, source: 'CODE', checkedInAt: now } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new ConflictError('You already checked in to this session');
    throw err;
  }
  return { sessionId: s!.id, title: s!.title, status, checkedInAt: now };
}

/** GV sửa tay (một hoặc nhiều ghế). status null ⇒ xoá dòng (về "chưa điểm danh"). */
export async function setAttendance(userId: number, classId: number, sessionId: number, input: { rows: Array<{ studentId: number; status: AttendanceStatus | null; note?: string | null }> }) {
  const ctx = await classCtx(userId, classId, true);
  assertWritable(ctx);
  await sessionOf(ctx, sessionId);
  const ids = parseIdList(input.rows.map((r) => r.studentId));
  const seats = await prisma.workClassStudent.findMany({ where: { classId, id: { in: ids } }, select: { id: true } });
  if (seats.length !== ids.length) throw new BadRequestError('Pick students of this class', 'WORK_CLASS_BAD');
  await prisma.$transaction(input.rows.map((r) => (r.status === null
    ? prisma.workClassAttendance.deleteMany({ where: { sessionId, studentId: r.studentId } })
    : prisma.workClassAttendance.upsert({
      where: { sessionId_studentId: { sessionId, studentId: r.studentId } },
      create: { sessionId, studentId: r.studentId, status: r.status, source: 'MANUAL', markedById: userId, note: r.note?.trim().slice(0, 255) || null },
      update: { status: r.status, source: 'MANUAL', markedById: userId, ...(r.note !== undefined ? { note: r.note?.trim().slice(0, 255) || null } : {}) },
    }))));
  // Có người được điểm danh tay ⇒ buổi tính là "đã điểm danh" cho thống kê.
  await prisma.workClassSession.updateMany({ where: { id: sessionId, checkinOpenedAt: null }, data: { checkinOpenedAt: new Date() } });
  return { updated: input.rows.length };
}

async function heldSessions(classId: number, now: Date) {
  return prisma.workClassSession.findMany({
    where: { classId, status: { not: 'CANCELLED' }, OR: [{ checkinOpenedAt: { not: null } }, { attendance: { some: {} } }], startsAt: { lte: new Date(now.getTime() + 86_400_000) } },
    orderBy: { startsAt: 'asc' }, select: { id: true, title: true, startsAt: true },
  });
}

/** Thống kê vắng cả lớp — CHỈ GV/OWNER (SV dùng myAttendance). */
export async function attendanceStats(userId: number, classId: number, now = new Date()) {
  const ctx = await classCtx(userId, classId, true);
  const [held, seats] = await Promise.all([
    heldSessions(classId, now),
    prisma.workClassStudent.findMany({ where: { classId }, orderBy: [{ studentCode: 'asc' }, { id: 'asc' }], select: { id: true, studentCode: true, fullName: true, email: true, groupId: true, user: { select: PUBLIC_USER } } }),
  ]);
  const cells = held.length ? await prisma.workClassAttendance.findMany({ where: { sessionId: { in: held.map((h) => h.id) } }, select: { sessionId: true, studentId: true, status: true } }) : [];
  const sum = attendanceSummary(seats.map((s) => s.id), held.map((h) => h.id), cells, ctx.cls.absenceThreshold);
  const byId = new Map(sum.map((s) => [s.studentId, s]));
  return {
    threshold: ctx.cls.absenceThreshold, lateAfterMin: ctx.cls.lateAfterMin,
    sessions: held,
    students: seats.map((s) => ({ ...s, ...byId.get(s.id)! })),
    flagged: sum.filter((s) => s.over).length,
    cells,
  };
}

/** Điểm danh của CHÍNH sinh viên. */
export async function myAttendance(userId: number, classId: number, now = new Date()) {
  const ctx = await classCtx(userId, classId);
  if (!ctx.seat) return { threshold: ctx.cls.absenceThreshold, summary: null, sessions: [] };
  const held = await heldSessions(classId, now);
  const cells = held.length ? await prisma.workClassAttendance.findMany({ where: { sessionId: { in: held.map((h) => h.id) }, studentId: ctx.seat.id }, select: { sessionId: true, studentId: true, status: true, checkedInAt: true } }) : [];
  const [summary] = attendanceSummary([ctx.seat.id], held.map((h) => h.id), cells, ctx.cls.absenceThreshold);
  const st = new Map(cells.map((c) => [c.sessionId, c]));
  return { threshold: ctx.cls.absenceThreshold, summary, sessions: held.map((h) => ({ ...h, status: st.get(h.id)?.status ?? 'ABSENT', checkedInAt: st.get(h.id)?.checkedInAt ?? null })) };
}

// ─── Xuất xlsx ────────────────────────────────────────────────────

const H: XStyle = { font: { b: true, color: 'FFFFFF' }, fill: '1F3B57', border: 'thin', align: { v: 'center', h: 'center', wrap: true } };
const C: XStyle = { border: 'thin', align: { v: 'center' } };
const CC: XStyle = { border: 'thin', align: { v: 'center', h: 'center' } };
const RED: XStyle = { border: 'thin', align: { v: 'center', h: 'center' }, fill: 'FDE2E1', font: { b: true, color: '9B1C1C' } };
const LETTER: Record<string, string> = { PRESENT: 'P', LATE: 'L', EXCUSED: 'E', ABSENT: 'A' };

export async function exportAttendanceXlsx(userId: number, classId: number, now = new Date()) {
  const ctx = await classCtx(userId, classId, true);
  const st = await attendanceStats(userId, classId, now);
  const fmt = (d: Date) => new Intl.DateTimeFormat('en-GB', { timeZone: ctx.cls.timezone, day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(d);
  const sh = new XSheet('Attendance');
  const fixed = ['#', 'Student ID', 'Full name', 'Email'];
  fixed.forEach((h, i) => sh.set(1, i + 1, h, H).width(i + 1, [5, 14, 28, 30][i]));
  st.sessions.forEach((s, j) => sh.set(1, fixed.length + j + 1, fmt(s.startsAt), H).width(fixed.length + j + 1, 9));
  const tail = ['Present', 'Late', 'Excused', 'Absent', 'Absent %', `Over ${st.threshold}%`];
  const t0 = fixed.length + st.sessions.length;
  tail.forEach((h, k) => sh.set(1, t0 + k + 1, h, H).width(t0 + k + 1, 10));
  sh.height(1, 32);
  const cell = new Map(st.cells.map((c) => [`${c.sessionId}:${c.studentId}`, c.status]));
  st.students.forEach((s, i) => {
    const r = i + 2;
    sh.set(r, 1, i + 1, CC).set(r, 2, s.studentCode ?? '', C).set(r, 3, s.fullName ?? s.user?.displayName ?? '', C).set(r, 4, s.email ?? '', C);
    st.sessions.forEach((ses, j) => {
      const v = cell.get(`${ses.id}:${s.id}`);
      sh.set(r, fixed.length + j + 1, v ? LETTER[v] : 'A', v === 'ABSENT' || !v ? RED : CC);
    });
    sh.set(r, t0 + 1, s.present, CC).set(r, t0 + 2, s.late, CC).set(r, t0 + 3, s.excused, CC).set(r, t0 + 4, s.absent, CC)
      .set(r, t0 + 5, s.absentPct ?? '', CC).set(r, t0 + 6, s.over ? 'YES' : '', s.over ? RED : CC);
  });
  sh.freeze = { col: 4, row: 1 };
  const legend = new XSheet('Legend');
  [['P', 'Present'], ['L', `Late (checked in more than ${st.lateAfterMin} min after start)`], ['E', 'Excused absence (not counted as absent)'], ['A', 'Absent (includes not checked in)']]
    .forEach(([k, v], i) => legend.set(i + 1, 1, k, CC).set(i + 1, 2, v, C));
  legend.width(1, 6).width(2, 60);
  const stamp = now.toISOString().slice(0, 10);
  return { buf: writeXlsx([sh, legend], { title: `${ctx.cls.classCode} attendance`, creator: 'CT Work' }), fileName: `${ctx.cls.classCode}-attendance-${stamp}.xlsx` };
}
