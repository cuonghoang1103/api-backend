/**
 * CT Work — lịch đăng ký (iCalendar .ics, 30/09/2026).
 *
 * Người dùng dán MỘT link vào Google Calendar / Apple Calendar / Outlook ("From URL") là thấy hạn thẻ
 * được giao, sprint và mốc version ở lịch điện thoại. Một chiều (CT Work → lịch); ứng dụng lịch tự tải
 * lại vài giờ một lần (Google ~8–24h — không ép được).
 *
 * Ứng dụng lịch KHÔNG gửi được header đăng nhập ⇒ bí mật nằm trong URL: token `ctc_<prefix>_<bí mật>`
 * lưu cùng bảng WorkApiToken (chỉ giữ sha256, scopes ["calendar"]). Tiền tố `ctc_` khác `ctw_` nên
 * apiTokenAuth KHÔNG nhận nó làm token API — lộ link lịch chỉ lộ lịch, và thu hồi/đổi link được.
 * Mỗi người tối đa một link đang hoạt động; tạo link mới = thu hồi link cũ.
 * Quyền xem kiểm LẠI mỗi lần tải (visibleProjectIds) ⇒ rời dự án là lịch tự mất thẻ của dự án đó.
 */

import crypto from 'node:crypto';
import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../middleware/errorHandler.js';
import { frontendUrl } from './common.js';
import { visibleProjectIds } from './myWork.service.js';
import { vnDay } from './sprints.service.js';
import { icsEscape, icsFold, icsStamp, meetingEventLines } from './ics.js';
import { config } from '../../config/env.js';

const sha256 = (s: string) => crypto.createHash('sha256').update(s).digest('hex');
const SCOPE = 'calendar';
const TOKEN_RE = /^ctc_[0-9a-f]{8}_[A-Za-z0-9_-]{20,64}$/;
const PAST_DAYS = 60;
const FUTURE_DAYS = 400;

const isCalendarRow = { scopes: { array_contains: [SCOPE] } };

export async function calendarLinkStatus(userId: number) {
  const row = await prisma.workApiToken.findFirst({
    where: { userId, revokedAt: null, ...isCalendarRow },
    select: { createdAt: true, lastUsedAt: true, prefix: true },
    orderBy: { id: 'desc' },
  });
  return { active: !!row, createdAt: row?.createdAt ?? null, lastUsedAt: row?.lastUsedAt ?? null, prefix: row?.prefix ?? null };
}

/** Tạo link mới (thu hồi link cũ). Token nguyên văn chỉ trả về MỘT lần. */
export async function createCalendarLink(userId: number) {
  const prefix = crypto.randomBytes(4).toString('hex');
  const token = `ctc_${prefix}_${crypto.randomBytes(24).toString('base64url')}`;
  await prisma.$transaction([
    prisma.workApiToken.updateMany({ where: { userId, revokedAt: null, ...isCalendarRow }, data: { revokedAt: new Date() } }),
    prisma.workApiToken.create({ data: { userId, name: 'Calendar feed', prefix, tokenHash: sha256(token), scopes: [SCOPE] } }),
  ]);
  return { token, path: `/work/calendar/${token}.ics` };
}

export async function revokeCalendarLink(userId: number) {
  await prisma.workApiToken.updateMany({ where: { userId, revokedAt: null, ...isCalendarRow }, data: { revokedAt: new Date() } });
}

// ─── iCalendar ───────────────────────────────────────────────────

// Escape + gập dòng RFC 5545 dùng chung với lời mời họp (đợt S3b) — ics.ts.
const esc = icsEscape;
const fold = icsFold;

// Ngày theo giờ VIỆT NAM: sprint lưu mốc 0h VN (= 17:00Z hôm trước), hạn thẻ lưu 00:00Z — đổi thẳng
// toISOString() thì sprint lệch sớm một ngày (Sprint 1 hiện 04/10 thay vì thứ Hai 05/10).
const ymd = (d: Date) => vnDay(d).replace(/-/g, '');
/** Ngày VN KẾ TIẾP (DTEND của sự kiện cả ngày không tính ngày đó). */
const ymdNext = (d: Date) => {
  const t = new Date(`${vnDay(d)}T00:00:00Z`);
  t.setUTCDate(t.getUTCDate() + 1);
  return t.toISOString().slice(0, 10).replace(/-/g, '');
};
const stamp = icsStamp;

function allDayEvent(e: { uid: string; start: Date; end?: Date; summary: string; description?: string; url?: string; categories?: string }, now: Date) {
  return [
    'BEGIN:VEVENT',
    `UID:${e.uid}@cuongthai.com`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART;VALUE=DATE:${ymd(e.start)}`,
    // DTEND của sự kiện cả ngày là ngày KẾ TIẾP (không tính) — thiếu cái này Google hiện lệch một ngày.
    `DTEND;VALUE=DATE:${ymdNext(e.end ?? e.start)}`,
    `SUMMARY:${esc(e.summary)}`,
    ...(e.description ? [`DESCRIPTION:${esc(e.description)}`] : []),
    ...(e.url ? [`URL:${e.url}`] : []),
    ...(e.categories ? [`CATEGORIES:${esc(e.categories)}`] : []),
    'TRANSP:TRANSPARENT',
    'END:VEVENT',
  ];
}

/** Nội dung .ics cho token lịch — token sai/đã thu hồi/tài khoản khoá ⇒ 404 (không tiết lộ gì). */
export async function renderCalendar(token: string): Promise<string> {
  if (!TOKEN_RE.test(token)) throw new NotFoundError('Calendar not found');
  const row = await prisma.workApiToken.findUnique({
    where: { tokenHash: sha256(token) },
    select: { id: true, userId: true, scopes: true, revokedAt: true, lastUsedAt: true, user: { select: { username: true, enabled: true, accountNonLocked: true } } },
  });
  const scopes = Array.isArray(row?.scopes) ? (row!.scopes as unknown[]) : [];
  if (!row || row.revokedAt || !scopes.includes(SCOPE) || !row.user.enabled || !row.user.accountNonLocked) throw new NotFoundError('Calendar not found');
  if (!row.lastUsedAt || Date.now() - row.lastUsedAt.getTime() > 60_000) {
    await prisma.workApiToken.update({ where: { id: row.id }, data: { lastUsedAt: new Date() } }).catch(() => undefined);
  }

  const now = new Date();
  const from = new Date(now.getTime() - PAST_DAYS * 86_400_000);
  const to = new Date(now.getTime() + FUTURE_DAYS * 86_400_000);
  const projectIds = await visibleProjectIds(row.userId);
  const lines: string[] = [];

  if (projectIds.length) {
    const issues = await prisma.workIssue.findMany({
      where: { assigneeId: row.userId, projectId: { in: projectIds }, deletedAt: null, resolvedAt: null, type: { level: { not: 1 } }, dueDate: { gte: from, lte: to } },
      orderBy: { dueDate: 'asc' },
      take: 1000,
      select: {
        id: true, number: true, title: true, dueDate: true, priority: true,
        status: { select: { name: true } },
        project: { select: { id: true, key: true, name: true, workspace: { select: { slug: true } } } },
      },
    });
    for (const i of issues) {
      const url = frontendUrl(`/work/${i.project.workspace.slug}/${i.project.key}/issue/${i.number}`);
      lines.push(...allDayEvent({
        uid: `ctwork-issue-${i.id}`, start: i.dueDate!,
        summary: `${i.project.key}-${i.number} ${i.title}`,
        description: `${i.project.name} · ${i.status.name} · priority ${i.priority}\n${url}`,
        url, categories: i.project.key,
      }, now));
    }

    // Sprint + mốc version: chỉ dự án người này THAM GIA (được giao thẻ hoặc là thành viên dự án),
    // không phải mọi dự án họ "nhìn thấy" trong không gian — tránh lịch ngập sprint của nhóm khác.
    const member = await prisma.workProjectMember.findMany({ where: { userId: row.userId, projectId: { in: projectIds } }, select: { projectId: true } });
    const assigned = await prisma.workIssue.findMany({ where: { assigneeId: row.userId, projectId: { in: projectIds }, deletedAt: null }, distinct: ['projectId'], select: { projectId: true } });
    const involved = [...new Set([...member, ...assigned].map((x) => x.projectId))];
    if (involved.length) {
      const [sprints, versions] = await Promise.all([
        prisma.workSprint.findMany({
          where: { projectId: { in: involved }, startAt: { not: null, lte: to }, endAt: { not: null, gte: from } },
          select: { id: true, name: true, goal: true, state: true, startAt: true, endAt: true, project: { select: { key: true, name: true, workspace: { select: { slug: true } } } } },
          take: 500,
        }),
        prisma.workVersion.findMany({
          where: { projectId: { in: involved }, releaseDate: { gte: from, lte: to } },
          select: { id: true, name: true, status: true, releaseDate: true, project: { select: { key: true, name: true, workspace: { select: { slug: true } } } } },
          take: 200,
        }),
      ]);
      for (const s of sprints) {
        lines.push(...allDayEvent({
          uid: `ctwork-sprint-${s.id}`, start: s.startAt!, end: s.endAt!,
          summary: `🏃 ${s.project.key} ${s.name}`,
          description: `${s.project.name} · ${s.state}${s.goal ? `\nGoal: ${s.goal}` : ''}`,
          url: frontendUrl(`/work/${s.project.workspace.slug}/${s.project.key}/board`), categories: s.project.key,
        }, now));
      }
      for (const v of versions) {
        lines.push(...allDayEvent({
          uid: `ctwork-version-${v.id}`, start: v.releaseDate!,
          summary: `🚀 ${v.project.key} ${v.name}`,
          description: `${v.project.name} · release ${v.status}`,
          url: frontendUrl(`/work/${v.project.workspace.slug}/${v.project.key}/releases`), categories: v.project.key,
        }, now));
      }
    }
  }

  // Đợt S3b: cuộc họp có MỜI người này (hoặc họ tổ chức) — kể cả dự án họ là khách cổng
  // (khách chỉ thấy họp mời họ). Mô-đun meetings tắt ⇒ không có. ATTENDEE chỉ ghi chính họ.
  lines.push(...(await meetingFeedLines(row.userId, projectIds, from, to, now)));

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//cuongthai.com//CT Work//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${esc(`CT Work — ${row.user.username}`)}`,
    'X-WR-TIMEZONE:Asia/Ho_Chi_Minh',
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
    'X-PUBLISHED-TTL:PT1H',
    ...lines,
    'END:VCALENDAR',
  ].map(fold).join('\r\n') + '\r\n';
}

/** Sự kiện họp trong lịch cá nhân (đợt S3b). */
async function meetingFeedLines(userId: number, visible: number[], from: Date, to: Date, now: Date): Promise<string[]> {
  const { clientScopedProjectIds } = await import('./permissions.js');
  const { modulesOf } = await import('./studio.js');
  const clientProjects = [...(await clientScopedProjectIds(userId))];
  const pids = [...new Set([...visible, ...clientProjects])];
  if (!pids.length) return [];
  const rows = await prisma.workMeeting.findMany({
    where: {
      projectId: { in: pids }, deletedAt: null, startsAt: { gte: from, lte: to },
      OR: [{ attendees: { some: { userId } } }, { organizerId: userId, projectId: { notIn: clientProjects.length ? clientProjects : [-1] } }],
    },
    orderBy: { startsAt: 'asc' },
    take: 500,
    select: {
      id: true, number: true, title: true, status: true, startsAt: true, endsAt: true, timezone: true, location: true, meetingUrl: true, sequence: true, updatedAt: true,
      organizer: { select: { username: true, displayName: true, fullName: true } },
      project: { select: { id: true, key: true, name: true, settings: true, workspace: { select: { slug: true } } } },
      attendees: { where: { userId }, select: { user: { select: { id: true, username: true, displayName: true, fullName: true, email: true } } } },
    },
  });
  const sender = /<([^>]+)>/.exec(config.resendFromEmail ?? '')?.[1] ?? config.resendFromEmail ?? 'no-reply@cuongthai.com';
  const out: string[] = [];
  for (const m of rows) {
    if (!modulesOf(m.project.settings).meetings) continue;
    const isClient = clientProjects.includes(m.project.id);
    const path = isClient
      ? `/work/${m.project.workspace.slug}/${m.project.key}/portal?tab=meetings&meeting=${m.number}`
      : `/work/${m.project.workspace.slug}/${m.project.key}/meetings/${m.number}`;
    const url = frontendUrl(path);
    const org = m.organizer ? (m.organizer.displayName || m.organizer.fullName || m.organizer.username) : m.project.name;
    out.push(...meetingEventLines({
      uid: `ctwork-meeting-${m.id}@cuongthai.com`, sequence: m.sequence, title: `${m.project.key} · ${m.title}`, status: m.status,
      startsAt: m.startsAt, endsAt: m.endsAt, timezone: m.timezone, location: m.location, meetingUrl: m.meetingUrl,
      description: `${m.project.name}${m.meetingUrl ? `\nJoin: ${m.meetingUrl}` : ''}\n${url}`, url, categories: m.project.key,
      organizer: { name: org, email: sender },
      attendees: m.attendees.map((a) => ({ id: a.user.id, name: a.user.displayName || a.user.fullName || a.user.username, email: a.user.email })),
      updatedAt: m.updatedAt,
    }, now));
  }
  return out;
}
