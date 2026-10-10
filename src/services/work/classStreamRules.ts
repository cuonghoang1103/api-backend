/**
 * CTW đợt 9a (13/10/2026) — LUẬT THUẦN (không DB) của lớp học: bảng tin, tài liệu, điểm danh. Test: classStream.test.ts.
 *
 *   visibleToStudent   sinh viên thấy dòng Stream khi ĐÃ đăng + (cả lớp | đúng nhóm của mình)
 *   canComment         bình luận: GV/OWNER luôn được; SV khi lớp bật + bài không khoá
 *   normalizeLinks     link đính kèm ⇒ thẻ link của Resources (kind + favicon), bỏ trùng, tối đa 10
 *   newCheckinCode     mã điểm danh 6 số (crypto ở ngoài truyền vào ⇒ test được)
 *   checkinStatusAt    PRESENT / LATE theo giờ bắt đầu buổi + số phút cho phép
 *   attendanceSummary  thống kê vắng theo sinh viên + cờ vượt ngưỡng
 */

import { detectKind, faviconFor, normalizeUrl, titleFromUrl } from './resourceRules.js';

// ─── Bảng tin ─────────────────────────────────────────────────────

export const POST_KINDS = ['ANNOUNCEMENT', 'ASSIGNMENT', 'QUIZ', 'MATERIAL'] as const;
export type PostKind = (typeof POST_KINDS)[number];
export const POST_TEXT_MAX = 20_000;
export const COMMENT_MAX = 2_000;
export const MAX_POST_FILES = 10;
export const MAX_LINKS = 10;
/** Lên lịch đăng tối đa 180 ngày tới. */
export const SCHEDULE_MAX_DAYS = 180;

export function parseIdList(raw: unknown): number[] {
  return [...new Set((Array.isArray(raw) ? raw : []).map(Number).filter((n) => Number.isInteger(n) && n > 0))].slice(0, 200);
}

export interface PostVisibility { publishedAt: Date | null; deletedAt: Date | null; audienceGroupIds: unknown }

/** Sinh viên thấy dòng này? (GV/OWNER thấy mọi dòng chưa xoá, kể cả bản hẹn giờ.) */
export function visibleToStudent(p: PostVisibility, groupId: number | null): boolean {
  if (p.deletedAt || !p.publishedAt) return false;
  const aud = parseIdList(p.audienceGroupIds);
  return !aud.length || (groupId !== null && aud.includes(groupId));
}

export function canComment(o: { manage: boolean; classAllows: boolean; postCommentsOff: boolean }): boolean {
  if (o.manage) return true;
  return o.classAllows && !o.postCommentsOff;
}

export interface LinkCard { url: string; title: string; kind: string; faviconUrl: string | null }

/** Link đính kèm (thẻ link của Resources). Link không hợp lệ ⇒ bỏ qua (trả `rejected`). */
export function normalizeLinks(raw: unknown): { links: LinkCard[]; rejected: number } {
  const out: LinkCard[] = [];
  let rejected = 0;
  for (const item of Array.isArray(raw) ? raw : []) {
    const r = (typeof item === 'string' ? { url: item } : item) as { url?: unknown; title?: unknown };
    const url = typeof r.url === 'string' ? normalizeUrl(r.url) : null;
    if (!url || !/^https?:/i.test(url)) { rejected += 1; continue; }
    if (out.some((l) => l.url === url)) continue;
    const title = (typeof r.title === 'string' && r.title.trim() ? r.title.trim() : titleFromUrl(url)).slice(0, 200);
    out.push({ url, title, kind: detectKind(url), faviconUrl: faviconFor(url) });
    if (out.length >= MAX_LINKS) break;
  }
  return { links: out, rejected };
}

/** Giờ hẹn đăng hợp lệ: null/quá khứ ⇒ đăng ngay; quá xa ⇒ lỗi. */
export function scheduleOf(raw: string | Date | null | undefined, now: Date): { publishAt: Date; immediate: boolean } | 'BAD' | 'TOO_FAR' {
  if (raw === null || raw === undefined || raw === '') return { publishAt: now, immediate: true };
  const d = raw instanceof Date ? raw : new Date(raw);
  if (Number.isNaN(d.getTime())) return 'BAD';
  if (d.getTime() <= now.getTime() + 30_000) return { publishAt: now, immediate: true };
  if (d.getTime() > now.getTime() + SCHEDULE_MAX_DAYS * 86_400_000) return 'TOO_FAR';
  return { publishAt: d, immediate: false };
}

// ─── Tài liệu ─────────────────────────────────────────────────────

export const MATERIAL_KINDS = ['SLIDE', 'SYLLABUS', 'FILE', 'LINK', 'VIDEO'] as const;
export type MaterialKind = (typeof MATERIAL_KINDS)[number];

/** Thứ tự mới sau kéo-thả: danh sách id theo thứ tự hiển thị ⇒ position 0..n-1. Id lạ ⇒ lỗi. */
export function reorderPlan(current: number[], wanted: number[]): Array<{ id: number; position: number }> | null {
  const cur = new Set(current);
  if (wanted.length !== new Set(wanted).size || wanted.some((id) => !cur.has(id))) return null;
  // Id không gửi lên (vd. mục vừa tạo ở tab khác) ⇒ xếp sau cùng, giữ thứ tự cũ.
  const rest = current.filter((id) => !wanted.includes(id));
  return [...wanted, ...rest].map((id, position) => ({ id, position }));
}

export function viewRate(viewed: number, students: number): number | null {
  return students > 0 ? Math.round((Math.min(viewed, students) / students) * 1000) / 10 : null;
}

// ─── Điểm danh ────────────────────────────────────────────────────

export const ATTENDANCE_STATUSES = ['PRESENT', 'LATE', 'EXCUSED', 'ABSENT'] as const;
export type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number];
export const CHECKIN_DEFAULT_MIN = 5;
export const CHECKIN_MAX_MIN = 30;
/** Nhập sai quá số lần này trong cửa sổ ⇒ khoá tới hết cửa sổ (kể cả mã đúng). */
export const CHECKIN_MAX_FAILS = 5;
export const CHECKIN_FAIL_WINDOW_MS = 10 * 60_000;
export const MAX_SESSIONS_PER_SERIES = 120;
export const DEFAULT_SERIES_WEEKS = 20;

/** Mã 6 số; `randInt(max)` trả số nguyên [0, max). */
export function newCheckinCode(randInt: (max: number) => number): string {
  return String(randInt(1_000_000)).padStart(6, '0');
}
export const isCheckinCode = (s: unknown): s is string => typeof s === 'string' && /^\d{6}$/.test(s);
export const cleanCheckinCode = (s: string) => s.replace(/\D/g, '').slice(0, 6);

export function checkinStatusAt(startsAt: Date, at: Date, lateAfterMin: number): 'PRESENT' | 'LATE' {
  return at.getTime() > startsAt.getTime() + Math.max(0, lateAfterMin) * 60_000 ? 'LATE' : 'PRESENT';
}

export interface AttendanceCell { sessionId: number; studentId: number; status: string | null }
export interface StudentAttendance {
  studentId: number;
  present: number; late: number; excused: number; absent: number;
  /** Buổi đã điểm danh mà sinh viên không có dòng ⇒ tính là vắng (absent đã gồm cả số này). */
  unmarked: number;
  held: number;
  /** % vắng trên số buổi đã điểm danh (vắng có phép KHÔNG tính vắng). null khi chưa có buổi nào. */
  absentPct: number | null;
  over: boolean;
}

/**
 * Thống kê vắng. `heldSessionIds` = buổi ĐÃ điểm danh (đã mở mã hoặc có ít nhất một dòng) — buổi chưa điểm danh không
 * tính, để buổi tương lai / buổi GV quên mở không làm cả lớp "vắng".
 */
export function attendanceSummary(studentIds: number[], heldSessionIds: number[], cells: AttendanceCell[], thresholdPct: number): StudentAttendance[] {
  const held = new Set(heldSessionIds);
  const by = new Map<string, string>();
  for (const c of cells) if (held.has(c.sessionId) && c.status) by.set(`${c.sessionId}:${c.studentId}`, c.status);
  return studentIds.map((sid) => {
    const s: StudentAttendance = { studentId: sid, present: 0, late: 0, excused: 0, absent: 0, unmarked: 0, held: held.size, absentPct: null, over: false };
    for (const ses of held) {
      const st = by.get(`${ses}:${sid}`);
      if (st === 'PRESENT') s.present += 1;
      else if (st === 'LATE') s.late += 1;
      else if (st === 'EXCUSED') s.excused += 1;
      else if (st === 'ABSENT') s.absent += 1;
      else { s.unmarked += 1; s.absent += 1; }
    }
    if (s.held) {
      s.absentPct = Math.round((s.absent / s.held) * 1000) / 10;
      s.over = s.absentPct > thresholdPct;
    }
    return s;
  });
}

/** Cửa sổ đếm lần nhập sai (thuần — Map do service giữ). */
export function noteFail(m: Map<string, { n: number; until: number }>, key: string, now: number): number {
  const f = m.get(key);
  if (!f || f.until <= now) { m.set(key, { n: 1, until: now + CHECKIN_FAIL_WINDOW_MS }); return 1; }
  f.n += 1;
  return f.n;
}
export function isLocked(m: Map<string, { n: number; until: number }>, key: string, now: number): boolean {
  const f = m.get(key);
  return !!f && f.until > now && f.n >= CHECKIN_MAX_FAILS;
}
