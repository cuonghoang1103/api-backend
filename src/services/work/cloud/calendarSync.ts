/**
 * CT Work đợt 8a — lịch HAI CHIỀU: hạn thẻ + cuộc họp CT Work ↔ Outlook Calendar (Graph) / Google Calendar.
 *
 * Phạm vi mỗi người (giống link .ics): thẻ ĐƯỢC GIAO có hạn, chưa xong (sự kiện cả ngày) + cuộc họp họ tổ chức/được mời
 * (không huỷ, dự án không phải cổng khách, mô-đun họp bật). Người dùng chọn lịch đích + bật/tắt trên /work/connections.
 *
 *   ĐẨY  — bus sự kiện (thẻ tạo/sửa/xoá, họp tạo/sửa/xoá/đổi người mời) ⇒ reconcile thực thể đó; cron 5 phút reconcile
 *          toàn bộ. pushedHash = dấu nội dung đã đẩy: trùng ⇒ không gọi API (đây là chốt chống vòng lặp phía đẩy).
 *   KÉO  — Graph calendarView/delta (deltaLink) · Google events.list (syncToken), mỗi 5 phút (và nút "Sync now").
 *          Sự kiện nhận diện bằng bảng liên kết (eventId) + id CT Work trong extendedProperties.
 *          Giờ bên lịch TRÙNG giờ mình đã đẩy ⇒ chỉ là tiếng vọng ⇒ bỏ qua (chốt chống vòng lặp phía kéo).
 *          Khác ⇒ sửa hạn thẻ / giờ họp CT Work THAY người dùng (đúng quyền của họ, có lịch sử thẻ + audit + nhật ký).
 *   XUNG ĐỘT — hai bên cùng đổi giờ kể từ lần đẩy cuối ⇒ bản sửa MỚI NHẤT thắng (updatedAt CT Work vs `updated` /
 *          `lastModifiedDateTime` của lịch), ghi một dòng `conflict` vào nhật ký.
 *   XOÁ BÊN LỊCH — KHÔNG xoá thẻ/họp: liên kết "tách" (detachedAt), thôi đẩy thực thể đó; "Resync all" gắn lại.
 */

import crypto from 'node:crypto';
import { prisma } from '../../../config/database.js';
import { AppError, BadRequestError } from '../../../middleware/errorHandler.js';
import { logger } from '../../../utils/logger.js';
import { frontendUrl } from '../common.js';
import { onWorkEvent, type WorkEvent } from '../events.js';
import { vnDay } from '../sprints.service.js';
import { liveConnection, logOAuth, markConnectionError, clearConnectionError, toUserError, type LiveConnection } from '../oauth/connections.js';
import { getProvider } from '../oauth/registry.js';
import { adapterFor, CLOUD_PROVIDERS, type DesiredEvent, type RemoteEvent } from './adapters.js';

export type EntityType = 'ISSUE' | 'MEETING';

export interface CalendarSettings {
  enabled: boolean;
  calendarId: string | null;
  calendarName: string | null;
  syncIssues: boolean;
  syncMeetings: boolean;
}

export function readSettings(raw: unknown): CalendarSettings {
  const s = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  return {
    enabled: s.enabled === true,
    calendarId: typeof s.calendarId === 'string' && s.calendarId ? s.calendarId : null,
    calendarName: typeof s.calendarName === 'string' ? s.calendarName : null,
    syncIssues: s.syncIssues !== false,
    syncMeetings: s.syncMeetings !== false,
  };
}

const DAY = 86_400_000;
const label = (provider: string) => getProvider(provider)?.label ?? provider;
const calName = (provider: string) => (provider === 'microsoft' ? 'Outlook' : 'Google Calendar');

// ─── Thực thể → sự kiện mong muốn ────────────────────────────────

interface Desired { ev: DesiredEvent; projectId: number; updatedAt: Date; ref: string }

async function issueDesired(issueId: number, userId: number, override?: { start: Date }): Promise<Desired | null> {
  const i = await prisma.workIssue.findFirst({
    where: { id: issueId, deletedAt: null },
    select: {
      id: true, number: true, title: true, dueDate: true, resolvedAt: true, assigneeId: true, updatedAt: true, projectId: true,
      type: { select: { level: true } },
      project: { select: { key: true, name: true, deletedAt: true, archivedAt: true, workspace: { select: { slug: true, deletedAt: true } } } },
    },
  });
  if (!i || i.assigneeId !== userId || i.resolvedAt || i.type.level === 1 || i.project.deletedAt || i.project.workspace.deletedAt) return null;
  const due = override?.start ?? i.dueDate;
  if (!due) return null;
  const { loadProjectAccess, isClientScoped } = await import('../permissions.js');
  const access = await loadProjectAccess(userId, i.projectId);
  if (!access || isClientScoped(access)) return null;
  const start = new Date(`${due.toISOString().slice(0, 10)}T00:00:00Z`);
  const ref = `${i.project.key}-${i.number}`;
  return {
    projectId: i.projectId, updatedAt: i.updatedAt, ref,
    ev: {
      title: `${ref} ${i.title}`, description: `Due date · ${i.project.name} (CT Work)`,
      url: frontendUrl(`/work/${i.project.workspace.slug}/${i.project.key}/issue/${i.number}`),
      allDay: true, start, end: new Date(start.getTime() + DAY), timezone: 'UTC', ctworkId: `issue:${i.id}`,
    },
  };
}

async function meetingDesired(meetingId: number, userId: number, override?: { start: Date; end: Date }): Promise<Desired | null> {
  const m = await prisma.workMeeting.findFirst({
    where: { id: meetingId, deletedAt: null },
    select: {
      id: true, number: true, title: true, status: true, startsAt: true, endsAt: true, timezone: true, location: true, meetingUrl: true,
      organizerId: true, updatedAt: true, projectId: true,
      attendees: { where: { userId }, select: { userId: true } },
      project: { select: { key: true, name: true, settings: true, deletedAt: true, workspace: { select: { slug: true, deletedAt: true } } } },
    },
  });
  if (!m || m.status === 'CANCELLED' || m.project.deletedAt || m.project.workspace.deletedAt) return null;
  if (m.organizerId !== userId && !m.attendees.length) return null;
  if (m.endsAt.getTime() < Date.now() - 30 * DAY) return null;
  const { modulesOf } = await import('../studio.js');
  if (!modulesOf(m.project.settings).meetings) return null;
  const { loadProjectAccess, isClientScoped } = await import('../permissions.js');
  const access = await loadProjectAccess(userId, m.projectId);
  if (!access || isClientScoped(access)) return null;
  const ref = `${m.project.key} M-${m.number}`;
  return {
    projectId: m.projectId, updatedAt: m.updatedAt, ref,
    ev: {
      title: `${m.project.key} · ${m.title}`,
      description: [m.meetingUrl ? `Join: ${m.meetingUrl}` : '', `${m.project.name} (CT Work)`].filter(Boolean).join('\n'),
      url: frontendUrl(`/work/${m.project.workspace.slug}/${m.project.key}/meetings/${m.number}`),
      location: m.meetingUrl || m.location || null,
      allDay: false, start: override?.start ?? m.startsAt, end: override?.end ?? m.endsAt, timezone: m.timezone || 'Asia/Ho_Chi_Minh',
      ctworkId: `meeting:${m.id}`,
    },
  };
}

function desiredFor(type: EntityType, id: number, userId: number) {
  return type === 'ISSUE' ? issueDesired(id, userId) : meetingDesired(id, userId);
}

export function eventHash(ev: DesiredEvent): string {
  return crypto.createHash('sha256').update(JSON.stringify([ev.title, ev.description, ev.url, ev.location ?? '', ev.allDay, ev.start.toISOString(), ev.end.toISOString(), ev.timezone])).digest('hex');
}

// ─── Khoá theo thực thể (listener + cron không đẩy trùng) ─────────

const locks = new Map<string, Promise<unknown>>();
async function withLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(key) ?? Promise.resolve();
  const run = prev.catch(() => undefined).then(fn);
  locks.set(key, run);
  try { return await run; } finally { if (locks.get(key) === run) locks.delete(key); }
}

// ─── Đẩy ─────────────────────────────────────────────────────────

export type PushResult = 'created' | 'updated' | 'deleted' | 'unchanged' | 'skipped';

/** Đưa MỘT thực thể về đúng trạng thái trên lịch của MỘT kết nối. Không ném (trừ lỗi lập trình) — lỗi ghi nhật ký. */
export async function reconcileEntity(conn: LiveConnection, type: EntityType, entityId: number): Promise<PushResult> {
  return withLock(`${conn.id}:${type}:${entityId}`, async () => {
    const s = readSettings(conn.settings);
    const link = await prisma.workCalendarLink.findFirst({ where: { connectionId: conn.id, entityType: type, entityId } });
    const wanted = (type === 'ISSUE' ? s.syncIssues : s.syncMeetings) && s.enabled && !!s.calendarId;
    const d = await desiredFor(type, entityId, conn.userId);
    const adapter = adapterFor(conn.provider);
    try {
      if (!d || (!wanted && !link)) {
        if (link && !link.detachedAt) {
          await adapter.deleteEvent(conn, link.calendarId, link.eventId);
          await prisma.workCalendarLink.delete({ where: { id: link.id } });
          await logOAuth({ userId: conn.userId, provider: conn.provider, connectionId: conn.id, kind: 'push', entityType: type, entityId, summary: `Removed the ${type === 'ISSUE' ? 'due date' : 'meeting'} event from ${calName(conn.provider)} (no longer yours or no longer open)` });
          return 'deleted';
        }
        if (link?.detachedAt && !d) await prisma.workCalendarLink.delete({ where: { id: link.id } });
        return 'skipped';
      }
      if (link?.detachedAt) return 'skipped';
      const hash = eventHash(d.ev);
      // Đổi lịch đích ⇒ chuyển sự kiện sang lịch mới.
      if (link && wanted && s.calendarId && link.calendarId !== s.calendarId) {
        await adapter.deleteEvent(conn, link.calendarId, link.eventId);
        await prisma.workCalendarLink.delete({ where: { id: link.id } });
        return reconcileCreate(conn, type, entityId, d, s.calendarId, hash);
      }
      if (link) {
        if (link.pushedHash === hash) return 'unchanged';
        const r = await adapter.updateEvent(conn, link.calendarId, link.eventId, d.ev);
        await prisma.workCalendarLink.update({ where: { id: link.id }, data: { pushedHash: hash, pushedStart: d.ev.start, pushedEnd: d.ev.end, pushedAt: new Date(), remoteUpdatedAt: r.updatedAt } });
        return 'updated';
      }
      if (!wanted || !s.calendarId) return 'skipped';
      return reconcileCreate(conn, type, entityId, d, s.calendarId, hash);
    } catch (err) {
      const e = toUserError(err, label(conn.provider));
      // Sự kiện bị xoá bên lịch trong lúc mình định sửa ⇒ tách liên kết thay vì báo lỗi mãi.
      if (link && e.statusCode === 404) {
        await prisma.workCalendarLink.update({ where: { id: link.id }, data: { detachedAt: new Date() } }).catch(() => undefined);
        return 'skipped';
      }
      await markConnectionError(conn.id, e.message);
      await logOAuth({ userId: conn.userId, provider: conn.provider, connectionId: conn.id, kind: 'error', entityType: type, entityId, projectId: d?.projectId ?? null, summary: `Could not update ${calName(conn.provider)} for ${d?.ref ?? `${type} #${entityId}`}: ${e.message}` });
      return 'skipped';
    }
  });
}

async function reconcileCreate(conn: LiveConnection, type: EntityType, entityId: number, d: Desired, calendarId: string, hash: string): Promise<PushResult> {
  const r = await adapterFor(conn.provider).createEvent(conn, calendarId, d.ev);
  await prisma.workCalendarLink.create({
    data: { connectionId: conn.id, entityType: type, entityId, calendarId, eventId: r.id, pushedHash: hash, pushedStart: d.ev.start, pushedEnd: d.ev.end, pushedAt: new Date(), remoteUpdatedAt: r.updatedAt },
  });
  await logOAuth({ userId: conn.userId, provider: conn.provider, connectionId: conn.id, kind: 'push', entityType: type, entityId, projectId: d.projectId, summary: `Added ${d.ref} to ${calName(conn.provider)}` });
  return 'created';
}

/** Ghi nhận một sự kiện lịch do CT Work tạo ngoài luồng đồng bộ (phòng Google Meet) — để đồng bộ không tạo trùng. */
export async function adoptEvent(conn: LiveConnection, type: EntityType, entityId: number, calendarId: string, eventId: string, updatedAt: Date | null) {
  const d = await desiredFor(type, entityId, conn.userId);
  const data = {
    calendarId, eventId, pushedHash: null as string | null, pushedStart: d?.ev.start ?? null, pushedEnd: d?.ev.end ?? null,
    pushedAt: new Date(), remoteUpdatedAt: updatedAt, detachedAt: null,
  };
  const old = await prisma.workCalendarLink.findFirst({ where: { connectionId: conn.id, entityType: type, entityId } });
  if (old && old.eventId !== eventId && !old.detachedAt) await adapterFor(conn.provider).deleteEvent(conn, old.calendarId, old.eventId).catch(() => undefined);
  if (old) await prisma.workCalendarLink.update({ where: { id: old.id }, data });
  else await prisma.workCalendarLink.create({ data: { connectionId: conn.id, entityType: type, entityId, ...data } });
}

/** Mọi thực thể thuộc phạm vi của người này (để reconcile toàn bộ). */
async function scopeOf(userId: number, s: CalendarSettings): Promise<Array<[EntityType, number]>> {
  const out: Array<[EntityType, number]> = [];
  if (s.syncIssues) {
    const issues = await prisma.workIssue.findMany({
      where: { assigneeId: userId, deletedAt: null, resolvedAt: null, dueDate: { gte: new Date(Date.now() - 60 * DAY) }, project: { deletedAt: null } },
      select: { id: true }, take: 1000, orderBy: { dueDate: 'asc' },
    });
    out.push(...issues.map((i): [EntityType, number] => ['ISSUE', i.id]));
  }
  if (s.syncMeetings) {
    const meetings = await prisma.workMeeting.findMany({
      where: { deletedAt: null, status: { not: 'CANCELLED' }, endsAt: { gte: new Date(Date.now() - 30 * DAY) }, OR: [{ organizerId: userId }, { attendees: { some: { userId } } }] },
      select: { id: true }, take: 500, orderBy: { startsAt: 'asc' },
    });
    out.push(...meetings.map((m): [EntityType, number] => ['MEETING', m.id]));
  }
  return out;
}

export async function pushAll(conn: LiveConnection) {
  const s = readSettings(conn.settings);
  const counts: Record<PushResult, number> = { created: 0, updated: 0, deleted: 0, unchanged: 0, skipped: 0 };
  const seen = new Set<string>();
  if (s.enabled && s.calendarId) {
    for (const [t, id] of await scopeOf(conn.userId, s)) {
      seen.add(`${t}:${id}`);
      counts[await reconcileEntity(conn, t, id)]++;
    }
  }
  const links = await prisma.workCalendarLink.findMany({ where: { connectionId: conn.id }, select: { entityType: true, entityId: true } });
  for (const l of links) {
    if (seen.has(`${l.entityType}:${l.entityId}`)) continue;
    counts[await reconcileEntity(conn, l.entityType as EntityType, l.entityId)]++;
  }
  return counts;
}

// ─── Kéo ─────────────────────────────────────────────────────────

const sameTime = (a: Date | null, b: Date | null) => (a?.getTime() ?? -1) === (b?.getTime() ?? -1);

export interface PullResult { applied: number; echoes: number; conflicts: number; detached: number; ignored: number }

export async function pullChanges(conn: LiveConnection): Promise<PullResult> {
  const s = readSettings(conn.settings);
  const out: PullResult = { applied: 0, echoes: 0, conflicts: 0, detached: 0, ignored: 0 };
  if (!s.enabled || !s.calendarId) return out;
  const { events, cursor } = await adapterFor(conn.provider).changes(conn, s.calendarId, conn.syncCursor);
  for (const ev of events) {
    try {
      await applyRemote(conn, ev, out);
    } catch (err) {
      logger.warn('[work] calendar pull: một sự kiện lỗi', { err: (err as Error).message });
    }
  }
  await prisma.workOAuthConnection.update({ where: { id: conn.id }, data: { syncCursor: cursor, lastSyncAt: new Date() } });
  conn.syncCursor = cursor;
  return out;
}

async function applyRemote(conn: LiveConnection, ev: RemoteEvent, out: PullResult) {
  const link = await prisma.workCalendarLink.findFirst({ where: { connectionId: conn.id, eventId: ev.id } });
  if (!link || link.detachedAt) { out.ignored++; return; }
  // Sự kiện mang id CT Work KHÁC liên kết ⇒ không tin.
  const expect = `${link.entityType === 'ISSUE' ? 'issue' : 'meeting'}:${link.entityId}`;
  if (ev.ctworkId && ev.ctworkId !== expect) { out.ignored++; return; }
  const type = link.entityType as EntityType;
  await withLock(`${conn.id}:${type}:${link.entityId}`, async () => {
    if (ev.deleted) {
      await prisma.workCalendarLink.update({ where: { id: link.id }, data: { detachedAt: new Date() } });
      await logOAuth({ userId: conn.userId, provider: conn.provider, connectionId: conn.id, kind: 'pull', entityType: type, entityId: link.entityId, summary: `The event was deleted in ${calName(conn.provider)} — CT Work kept it and stopped syncing it (use "Resync all" to add it back)` });
      out.detached++;
      return;
    }
    if (!ev.start) { out.ignored++; return; }
    // Thẻ: sự kiện bị kéo thành có giờ ⇒ lấy NGÀY theo giờ Việt Nam.
    const remoteStart = type === 'ISSUE' && !ev.allDay ? new Date(`${vnDay(ev.start)}T00:00:00Z`) : ev.start;
    const remoteEnd = type === 'ISSUE' ? new Date(remoteStart.getTime() + DAY) : (ev.end ?? new Date(ev.start.getTime() + 30 * 60_000));
    if (sameTime(remoteStart, link.pushedStart) && (type === 'ISSUE' || sameTime(remoteEnd, link.pushedEnd))) {
      // Tiếng vọng của chính lần đẩy của mình (hoặc chỉ đổi thứ không đồng bộ) — không làm gì.
      await prisma.workCalendarLink.update({ where: { id: link.id }, data: { remoteUpdatedAt: ev.updatedAt } });
      out.echoes++;
      return;
    }
    const cur = await desiredFor(type, link.entityId, conn.userId);
    if (!cur) { out.ignored++; return; }
    const remoteAt = ev.updatedAt ?? new Date();
    const ctworkMoved = !sameTime(cur.ev.start, link.pushedStart) || (type === 'MEETING' && !sameTime(cur.ev.end, link.pushedEnd));
    if (ctworkMoved) {
      out.conflicts++;
      if (cur.updatedAt.getTime() >= remoteAt.getTime()) {
        await logOAuth({ userId: conn.userId, provider: conn.provider, connectionId: conn.id, kind: 'conflict', entityType: type, entityId: link.entityId, projectId: cur.projectId, summary: `${cur.ref} was changed in both CT Work and ${calName(conn.provider)} — the CT Work edit is newer and was kept` });
        return; // lần đẩy kế tiếp ghi đè bên lịch
      }
      await logOAuth({ userId: conn.userId, provider: conn.provider, connectionId: conn.id, kind: 'conflict', entityType: type, entityId: link.entityId, projectId: cur.projectId, summary: `${cur.ref} was changed in both CT Work and ${calName(conn.provider)} — the calendar edit is newer and was applied` });
    }
    // Ghi liên kết TRƯỚC khi sửa CT Work: sự kiện bus do lần sửa này sinh ra sẽ thấy hash trùng ⇒ không đẩy ngược.
    const next = type === 'ISSUE'
      ? await issueDesired(link.entityId, conn.userId, { start: remoteStart })
      : await meetingDesired(link.entityId, conn.userId, { start: remoteStart, end: remoteEnd });
    if (!next) { out.ignored++; return; }
    const before = { pushedHash: link.pushedHash, pushedStart: link.pushedStart, pushedEnd: link.pushedEnd };
    await prisma.workCalendarLink.update({ where: { id: link.id }, data: { pushedHash: eventHash(next.ev), pushedStart: next.ev.start, pushedEnd: next.ev.end, remoteUpdatedAt: ev.updatedAt } });
    try {
      if (type === 'ISSUE') {
        const i = await prisma.workIssue.findUniqueOrThrow({ where: { id: link.entityId }, select: { number: true, projectId: true } });
        const { updateIssueAs } = await import('../issues.service.js');
        await updateIssueAs(conn.userId, i.projectId, i.number, { dueDate: remoteStart });
        await logOAuth({ userId: conn.userId, provider: conn.provider, connectionId: conn.id, kind: 'pull', entityType: type, entityId: link.entityId, projectId: i.projectId, summary: `Due date of ${cur.ref} moved in ${calName(conn.provider)}: ${cur.ev.start.toISOString().slice(0, 10)} → ${remoteStart.toISOString().slice(0, 10)}` });
      } else {
        const m = await prisma.workMeeting.findUniqueOrThrow({ where: { id: link.entityId }, select: { number: true, projectId: true } });
        const { updateMeeting } = await import('../meetings.service.js');
        await updateMeeting(conn.userId, m.projectId, m.number, { startsAt: remoteStart, endsAt: remoteEnd });
        const { auditProject } = await import('../audit.js');
        await auditProject(m.projectId, { actorId: conn.userId, action: 'meeting.calendar_sync', targetType: 'meeting', targetId: link.entityId, summary: `Meeting M-${m.number} time changed from ${calName(conn.provider)} (calendar sync)` });
        await logOAuth({ userId: conn.userId, provider: conn.provider, connectionId: conn.id, kind: 'pull', entityType: type, entityId: link.entityId, projectId: m.projectId, summary: `${cur.ref} moved in ${calName(conn.provider)}: ${cur.ev.start.toISOString()} → ${remoteStart.toISOString()}` });
      }
      out.applied++;
    } catch (err) {
      // Không có quyền / dữ liệu sai ⇒ trả liên kết về cũ: lần đẩy kế tiếp đặt lại giờ của CT Work bên lịch.
      await prisma.workCalendarLink.update({ where: { id: link.id }, data: before });
      await logOAuth({ userId: conn.userId, provider: conn.provider, connectionId: conn.id, kind: 'error', entityType: type, entityId: link.entityId, projectId: cur.projectId, summary: `Could not apply the ${calName(conn.provider)} change to ${cur.ref}: ${(err as Error).message} — CT Work's time will be restored` });
    }
  });
}

// ─── Đồng bộ một kết nối ─────────────────────────────────────────

export async function syncConnection(userId: number, provider: string) {
  const conn = await liveConnection(userId, provider);
  const s = readSettings(conn.settings);
  if (!s.enabled || !s.calendarId) {
    const pushed = await pushAll(conn); // vẫn dọn liên kết cũ
    return { pulled: null, pushed };
  }
  try {
    const pulled = await pullChanges(conn);
    const pushed = await pushAll(conn);
    await clearConnectionError(conn.id);
    return { pulled, pushed };
  } catch (err) {
    const e = toUserError(err, label(provider));
    await markConnectionError(conn.id, e.message);
    throw e;
  }
}

// ─── Cài đặt lịch ────────────────────────────────────────────────

export async function listCalendars(userId: number, provider: string) {
  assertCloud(provider);
  const conn = await liveConnection(userId, provider);
  try {
    return { items: await adapterFor(provider).listCalendars(conn), settings: readSettings(conn.settings) };
  } catch (err) {
    throw toUserError(err, label(provider));
  }
}

export function assertCloud(provider: string) {
  if (!(CLOUD_PROVIDERS as readonly string[]).includes(provider)) throw new BadRequestError('Calendar sync is available for Microsoft 365 and Google only', 'VALIDATION_ERROR');
}

export async function saveCalendarSettings(userId: number, provider: string, input: Partial<CalendarSettings> & { resync?: boolean }) {
  assertCloud(provider);
  const conn = await liveConnection(userId, provider);
  const cur = readSettings(conn.settings);
  const next: CalendarSettings = {
    enabled: input.enabled ?? cur.enabled,
    calendarId: input.calendarId !== undefined ? (input.calendarId?.trim() || null) : cur.calendarId,
    calendarName: input.calendarName !== undefined ? (input.calendarName?.trim().slice(0, 200) || null) : cur.calendarName,
    syncIssues: input.syncIssues ?? cur.syncIssues,
    syncMeetings: input.syncMeetings ?? cur.syncMeetings,
  };
  if (next.enabled && !next.calendarId) throw new BadRequestError('Pick a calendar first', 'VALIDATION_ERROR');
  const calendarChanged = next.calendarId !== cur.calendarId;
  await prisma.workOAuthConnection.update({
    where: { id: conn.id },
    data: { settings: { ...next } as object, ...(calendarChanged ? { syncCursor: null } : {}) },
  });
  if (input.resync) await prisma.workCalendarLink.updateMany({ where: { connectionId: conn.id, detachedAt: { not: null } }, data: { detachedAt: null, pushedHash: null } });
  await logOAuth({ userId, provider, connectionId: conn.id, kind: 'settings', summary: next.enabled ? `Calendar sync on → "${next.calendarName ?? next.calendarId}" (${[next.syncIssues && 'due dates', next.syncMeetings && 'meetings'].filter(Boolean).join(' + ') || 'nothing'})` : 'Calendar sync turned off' });
  // Đồng bộ ngay (không chặn phản hồi quá lâu — lỗi chỉ ghi lại).
  const result = await syncConnection(userId, provider).catch((err) => ({ error: (err as AppError).message }));
  return { settings: next, result };
}

/** Ngắt kết nối: tuỳ chọn xoá luôn các sự kiện CT Work đã tạo bên lịch. */
export async function removePushedEvents(connectionId: number) {
  const conn = await prisma.workOAuthConnection.findUnique({ where: { id: connectionId }, select: { userId: true, provider: true } });
  if (!conn || !(CLOUD_PROVIDERS as readonly string[]).includes(conn.provider)) return 0;
  const live = await liveConnection(conn.userId, conn.provider);
  const links = await prisma.workCalendarLink.findMany({ where: { connectionId, detachedAt: null }, take: 1000 });
  let n = 0;
  for (const l of links) {
    await adapterFor(conn.provider).deleteEvent(live, l.calendarId, l.eventId).then(() => { n++; }).catch(() => undefined);
  }
  return n;
}

// ─── Bus sự kiện + cron ──────────────────────────────────────────

const pending = new Map<string, ReturnType<typeof setTimeout>>();
const debounceMs = () => Number(process.env.CTW_CAL_DEBOUNCE_MS ?? 1500);

async function usersForEntity(type: EntityType, id: number): Promise<number[]> {
  const linked = await prisma.workCalendarLink.findMany({ where: { entityType: type, entityId: id }, select: { connection: { select: { userId: true } } } });
  const ids = new Set(linked.map((l) => l.connection.userId));
  if (type === 'ISSUE') {
    const i = await prisma.workIssue.findUnique({ where: { id }, select: { assigneeId: true } });
    if (i?.assigneeId) ids.add(i.assigneeId);
  } else {
    const m = await prisma.workMeeting.findUnique({ where: { id }, select: { organizerId: true, attendees: { select: { userId: true } } } });
    if (m?.organizerId) ids.add(m.organizerId);
    for (const a of m?.attendees ?? []) ids.add(a.userId);
  }
  return [...ids];
}

/** Đẩy một thực thể cho mọi kết nối liên quan (sau khi debounce). Trả promise — test chờ được. */
export async function pushEntityForAll(type: EntityType, id: number): Promise<number> {
  const users = await usersForEntity(type, id);
  if (!users.length) return 0;
  const conns = await prisma.workOAuthConnection.findMany({ where: { userId: { in: users }, provider: { in: [...CLOUD_PROVIDERS] }, status: 'ACTIVE' }, select: { userId: true, provider: true, id: true } });
  let n = 0;
  for (const c of conns) {
    const hasLink = await prisma.workCalendarLink.count({ where: { connectionId: c.id, entityType: type, entityId: id } });
    const raw = await prisma.workOAuthConnection.findUnique({ where: { id: c.id }, select: { settings: true } });
    const s = readSettings(raw?.settings);
    if (!hasLink && !(s.enabled && s.calendarId)) continue;
    try {
      const live = await liveConnection(c.userId, c.provider);
      await reconcileEntity(live, type, id);
      n++;
    } catch (err) {
      logger.warn('[work] calendar push lỗi', { provider: c.provider, err: (err as Error).message });
    }
  }
  return n;
}

function schedule(type: EntityType, id: number) {
  const key = `${type}:${id}`;
  const old = pending.get(key);
  if (old) clearTimeout(old);
  pending.set(key, setTimeout(() => {
    pending.delete(key);
    void pushEntityForAll(type, id).catch((err) => logger.warn('[work] calendar push lỗi', { err: (err as Error).message }));
  }, debounceMs()));
}

async function onEvent(e: WorkEvent) {
  if (e.type === 'issue.created' || e.type === 'issue.deleted') return schedule('ISSUE', e.issueId);
  if (e.type === 'issue.updated') {
    const relevant = e.changes.some((c) => ['dueDate', 'assigneeId', 'title', 'status', 'statusId', 'resolution'].includes(c.field)) || !e.changes.length;
    if (relevant) schedule('ISSUE', e.issueId);
    return;
  }
  if (e.type === 'governance.updated' && e.entity === 'meeting') {
    const m = await prisma.workMeeting.findFirst({ where: { projectId: e.projectId, number: e.number }, select: { id: true } });
    if (m) schedule('MEETING', m.id);
  }
}

let registered = false;
export function registerCalendarSync(): void {
  if (registered) return;
  registered = true;
  onWorkEvent((e) => onEvent(e).catch((err) => logger.warn('[work] calendar listener lỗi', { err: (err as Error).message })));
}

let cronStarted = false;
/** Cron 5 phút: kéo thay đổi bên lịch rồi reconcile — mỗi kết nối bật đồng bộ. Tắt trong test / CRON_DISABLED=1. */
export function startCalendarJobs(): void {
  if (cronStarted) return;
  if (process.env.CRON_DISABLED === '1' || process.env.NODE_ENV === 'test' || process.env.WORK_DB_TEST === '1' || process.env.CTW_CALENDAR_SYNC === 'off') return;
  cronStarted = true;
  let running = false;
  setInterval(() => {
    if (running) return;
    running = true;
    runCalendarCron().catch((err) => logger.warn('[work] calendar cron lỗi', { err: (err as Error).message })).finally(() => { running = false; });
  }, 5 * 60_000).unref();
}

export async function runCalendarCron(): Promise<number> {
  const rows = await prisma.workOAuthConnection.findMany({ where: { provider: { in: [...CLOUD_PROVIDERS] }, status: 'ACTIVE' }, select: { userId: true, provider: true, settings: true } });
  let n = 0;
  for (const r of rows) {
    const s = readSettings(r.settings);
    if (!s.enabled || !s.calendarId) continue;
    await syncConnection(r.userId, r.provider).then(() => { n++; }).catch((err) => logger.warn('[work] calendar sync lỗi', { provider: r.provider, err: (err as Error).message }));
  }
  return n;
}
