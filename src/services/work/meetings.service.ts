/**
 * CT Work — CUỘC HỌP (đợt S3b, mô-đun `meetings`): lịch họp, chương trình (agenda), biên bản,
 * quyết định, việc cần làm ⇒ thẻ, lời mời .ics, chia sẻ biên bản với khách.
 *
 * Nguyên tắc:
 *   - Chỉ LƯU link Meet/Zoom/Teams — không tự dựng cuộc gọi video, không gọi API của họ.
 *   - Việc cần làm ⇒ thẻ chỉ khi người dùng bấm "Create issues". Gợi ý AI (`meeting_notes`
 *     có sẵn) chỉ trả ĐỀ XUẤT — người dùng chọn rồi "Add to action items" mới lưu.
 *   - Lời mời .ics (ics.ts, RFC 5545): tệp đính kèm email + nút tải; cuộc họp còn vào lịch
 *     đăng ký cá nhân (calendar.service) của người được mời. ATTENDEE chỉ mang email của
 *     CHÍNH người nhận — người khác dùng URN + tên (không lộ email).
 *   - Khách (cổng khách bật) được mời ⇒ thấy cuộc họp CÓ MỜI họ qua /portal/meetings
 *     (đã nằm trong danh sách trắng `/portal/**` — không thêm tuyến khách nào khác). Chương
 *     trình + biên bản + quyết định + việc chỉ hiện khi đội bấm "Share notes with client".
 *     Phần nội bộ (/meetings/**) với khách ⇒ CLIENT_PORTAL_ONLY (chốt ở work.routes.ts).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { config } from '../../config/env.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { notifyWork as pushWork } from '../notification.service.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, frontendUrl, PUBLIC_USER, sendWorkEmail } from './common.js';
import type { MeetingStatus, MeetingType } from './constants.js';
import { clientPeopleIds, maskUser } from './clientPeople.js';
import { getTemplate } from './docTemplates.js';
import { emitWorkEvent } from './events.js';
import { MEETING_LABEL, meetingProvider, meetingTimeError, newJitsiUrl, splitKickoffTemplate, validTimezone } from './governance.js';
import { dayOf, govCtx, markdownDoc, nextNumber } from './governanceDb.js';
import { icsDocument, meetingEventLines } from './ics.js';
import { createIssueAs } from './issues.service.js';
import { can, canDeleteGovernance, governanceAccess, isClientScoped, loadProjectAccess } from './permissions.js';
import { portalCtx } from './portal.service.js';
import { portalPath, routeForClient } from './portalNotify.js';
import { tiptapToText } from './tiptapText.js';

const MAX_ATTENDEES = 100;
const MAX_ACTIONS = 100;

const MEETING_LIST_SELECT = {
  id: true, number: true, title: true, type: true, status: true, startsAt: true, endsAt: true, timezone: true, location: true, meetingUrl: true,
  minutesShared: true, createdAt: true, updatedAt: true,
  organizer: { select: PUBLIC_USER },
  attendees: { orderBy: { id: 'asc' }, select: { user: { select: PUBLIC_USER } } },
  actions: { select: { id: true, issueId: true } },
} satisfies Prisma.WorkMeetingSelect;

type ListRow = Prisma.WorkMeetingGetPayload<{ select: typeof MEETING_LIST_SELECT }>;

function listRow(m: ListRow) {
  const { attendees, actions, ...rest } = m;
  return {
    ...rest,
    key: `M-${m.number}`,
    typeLabel: MEETING_LABEL[m.type as MeetingType] ?? 'Meeting',
    provider: meetingProvider(m.meetingUrl),
    attendees: attendees.map((a) => a.user),
    actionCount: actions.length,
    actionsOpen: actions.filter((a) => !a.issueId).length,
  };
}

export async function listMeetings(userId: number, projectId: number, q: { scope?: 'upcoming' | 'past' | 'all' } = {}) {
  const ctx = await govCtx(userId, projectId, 'meetings');
  const now = new Date();
  const scope = q.scope ?? 'all';
  const rows = await prisma.workMeeting.findMany({
    where: {
      projectId, deletedAt: null,
      ...(scope === 'upcoming' ? { endsAt: { gte: now } } : scope === 'past' ? { endsAt: { lt: now } } : {}),
    },
    orderBy: { startsAt: scope === 'past' ? 'desc' : 'asc' },
    take: 500,
    select: MEETING_LIST_SELECT,
  });
  return { items: rows.map(listRow), canEdit: ctx.canEdit, portalOn: ctx.access.modules.clientPortal, now };
}

// ─── Người được mời ──────────────────────────────────────────────

/**
 * Người được mời phải vào được dự án: người của đội (governanceAccess.view), hoặc KHÁCH của cổng
 * (vai CLIENT + clientPortal bật). Khách ở dự án không bật cổng thì không có chỗ xem cuộc họp ⇒ từ chối.
 */
async function assertAttendees(projectId: number, ids: number[]) {
  if (ids.length > MAX_ATTENDEES) throw new BadRequestError(`At most ${MAX_ATTENDEES} attendees`, 'WORK_LIMIT');
  for (const uid of ids) {
    const a = await loadProjectAccess(uid, projectId);
    if (!a) throw new BadRequestError('Every attendee must be a member of this project', 'WORK_BAD_ATTENDEE');
    if (isClientScoped(a)) continue;
    if (!governanceAccess(a.role, a.workspaceRole).view) {
      throw new BadRequestError('Clients can only be invited when the client portal is turned on for this project', 'WORK_BAD_ATTENDEE');
    }
  }
}

// ─── Tạo / sửa ───────────────────────────────────────────────────

export interface MeetingInput {
  title?: string;
  type?: MeetingType;
  status?: MeetingStatus;
  startsAt?: Date;
  endsAt?: Date;
  timezone?: string;
  location?: string | null;
  meetingUrl?: string | null;
  agendaJson?: Prisma.InputJsonValue | null;
  minutesJson?: Prisma.InputJsonValue | null;
  decisions?: string[];
}

function richFields(json: Prisma.InputJsonValue | null | undefined, k: 'agenda' | 'minutes') {
  if (json === undefined) return {};
  const text = json ? tiptapToText(json).slice(0, 100_000) || null : null;
  return k === 'agenda'
    ? { agendaJson: json === null ? Prisma.DbNull : json, agendaText: text }
    : { minutesJson: json === null ? Prisma.DbNull : json, minutesText: text };
}

/** CTW-24: `meetingUrl: "jitsi"` ⇒ máy chủ sinh phòng Jitsi mới (khó đoán). */
function resolveMeetingUrl<T extends { meetingUrl?: string | null }>(input: T): T {
  if (input.meetingUrl?.trim().toLowerCase() === 'jitsi') return { ...input, meetingUrl: newJitsiUrl() };
  return input;
}

function assertUrl(url: string | null | undefined) {
  if (!url) return;
  let u: URL;
  try { u = new URL(url); } catch { throw new BadRequestError('The meeting link must be a full URL (https://…)', 'VALIDATION_ERROR'); }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new BadRequestError('The meeting link must start with https://', 'VALIDATION_ERROR');
}

async function kickoffTemplate(): Promise<{ agenda: Prisma.InputJsonValue | null; minutes: Prisma.InputJsonValue | null }> {
  try {
    const t = await getTemplate('bien-ban-kick-off');
    const { agenda, minutes } = splitKickoffTemplate(t.markdown);
    return { agenda: agenda ? markdownDoc(agenda) : null, minutes: minutes ? markdownDoc(minutes) : null };
  } catch {
    return { agenda: null, minutes: null };
  }
}

export async function createMeeting(
  userId: number, projectId: number,
  rawInput: MeetingInput & { title: string; startsAt: Date; endsAt: Date; attendeeIds?: number[]; useTemplate?: boolean; sendInvites?: boolean },
) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const input = resolveMeetingUrl(rawInput);
  const title = input.title.trim();
  if (!title) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');
  const err = meetingTimeError(input.startsAt, input.endsAt);
  if (err) throw new BadRequestError(err, 'VALIDATION_ERROR');
  const tz = input.timezone ?? 'Asia/Ho_Chi_Minh';
  if (!validTimezone(tz)) throw new BadRequestError('Unknown time zone', 'VALIDATION_ERROR');
  assertUrl(input.meetingUrl);
  const attendeeIds = [...new Set(input.attendeeIds ?? [])];
  await assertAttendees(projectId, attendeeIds);
  // Kick-off: chương trình + khung biên bản từ mẫu bien-ban-kick-off.md (trừ khi người dùng đã viết).
  let agendaJson = input.agendaJson;
  let minutesJson = input.minutesJson;
  if ((input.type ?? 'OTHER') === 'KICKOFF' && input.useTemplate !== false) {
    const t = await kickoffTemplate();
    if (agendaJson === undefined) agendaJson = t.agenda;
    if (minutesJson === undefined) minutesJson = t.minutes;
  }
  const created = await prisma.$transaction(async (tx) => {
    const number = await nextNumber(tx, 'meeting', projectId);
    return tx.workMeeting.create({
      data: {
        projectId, number, title: title.slice(0, 255), type: input.type ?? 'OTHER', status: 'SCHEDULED',
        startsAt: input.startsAt, endsAt: input.endsAt, timezone: tz,
        location: input.location?.trim().slice(0, 255) || null, meetingUrl: input.meetingUrl?.trim() || null,
        ...richFields(agendaJson, 'agenda'), ...richFields(minutesJson, 'minutes'),
        decisions: (input.decisions ?? []).map((d) => d.trim()).filter(Boolean).slice(0, 50),
        organizerId: userId,
        attendees: { create: attendeeIds.map((uid) => ({ userId: uid })) },
      },
      select: { id: true, number: true },
    });
  });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number: created.number, action: 'created', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'meeting.create', targetType: 'meeting', targetId: created.id, summary: `Scheduled meeting M-${created.number}: ${title}`.slice(0, 300) });
  await notifyInvited(created.id, userId, attendeeIds, 'invited');
  if (input.sendInvites !== false && attendeeIds.length) await emailInvites(created.id, userId, attendeeIds).catch((e) => logger.warn('[work] gửi lời mời họp lỗi', { err: (e as Error).message }));
  return getMeeting(userId, projectId, created.number);
}

async function findMeeting(projectId: number, number: number) {
  const m = await prisma.workMeeting.findFirst({ where: { projectId, number, deletedAt: null } });
  if (!m) throw new NotFoundError('Meeting not found');
  return m;
}

export async function getMeeting(userId: number, projectId: number, number: number) {
  const ctx = await govCtx(userId, projectId, 'meetings');
  const m = await prisma.workMeeting.findFirst({
    where: { projectId, number, deletedAt: null },
    select: {
      ...MEETING_LIST_SELECT,
      agendaJson: true, minutesJson: true, decisions: true, minutesSharedAt: true, sequence: true, version: true, organizerId: true,
      previous: { select: { number: true, title: true, startsAt: true, deletedAt: true } },
      next: { where: { deletedAt: null }, select: { number: true, title: true, startsAt: true }, take: 3 },
      actions: {
        orderBy: [{ position: 'asc' }, { id: 'asc' }],
        select: {
          id: true, position: true, text: true, dueDate: true, issueId: true,
          assignee: { select: PUBLIC_USER },
          issue: { select: { number: true, title: true, deletedAt: true, resolvedAt: true, status: { select: { name: true, category: true } } } },
        },
      },
    },
  });
  if (!m) throw new NotFoundError('Meeting not found');
  const clientIds = new Set((await prisma.workProjectMember.findMany({ where: { projectId, role: 'CLIENT' }, select: { userId: true } })).map((x) => x.userId));
  const { actions, previous, ...rest } = m;
  const base = listRow({ ...rest, actions: actions.map((a) => ({ id: a.id, issueId: a.issueId })) });
  return {
    ...base,
    agendaJson: m.agendaJson, minutesJson: m.minutesJson, minutesSharedAt: m.minutesSharedAt, sequence: m.sequence, version: m.version,
    decisions: Array.isArray(m.decisions) ? (m.decisions as string[]) : [],
    attendees: m.attendees.map((a) => ({ ...a.user, isClient: clientIds.has(a.user.id) })),
    hasClients: m.attendees.some((a) => clientIds.has(a.user.id)),
    actions: actions.map((a) => ({
      id: a.id, position: a.position, text: a.text, dueDate: dayOf(a.dueDate), assignee: a.assignee,
      issue: a.issue && !a.issue.deletedAt ? { number: a.issue.number, key: `${ctx.access.key}-${a.issue.number}`, title: a.issue.title, done: !!a.issue.resolvedAt, status: a.issue.status } : null,
    })),
    previous: previous && !previous.deletedAt ? { number: previous.number, title: previous.title, startsAt: previous.startsAt } : null,
    next: m.next,
    canEdit: ctx.canEdit,
    canDelete: canDeleteGovernance(ctx.access.role, ctx.access.workspaceRole, userId, m.organizerId),
    canCreateIssues: ctx.canEdit && can(ctx.access.role, 'issue.create'),
    canUseAi: can(ctx.access.role, 'ai.use'),
    portalOn: ctx.access.modules.clientPortal,
  };
}

export async function updateMeeting(userId: number, projectId: number, number: number, rawInput: MeetingInput, expectedVersion?: number) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const input = resolveMeetingUrl(rawInput);
  const cur = await findMeeting(projectId, number);
  if (input.title !== undefined && !input.title.trim()) throw new BadRequestError('Title is required', 'WORK_TITLE_REQUIRED');
  const startsAt = input.startsAt ?? cur.startsAt;
  const endsAt = input.endsAt ?? cur.endsAt;
  const err = meetingTimeError(startsAt, endsAt);
  if (err) throw new BadRequestError(err, 'VALIDATION_ERROR');
  if (input.timezone && !validTimezone(input.timezone)) throw new BadRequestError('Unknown time zone', 'VALIDATION_ERROR');
  assertUrl(input.meetingUrl);
  // Đổi giờ / địa điểm / link / tiêu đề / trạng thái ⇒ SEQUENCE của iCalendar tăng (lịch của người được mời cập nhật).
  const calChanged = (input.startsAt && input.startsAt.getTime() !== cur.startsAt.getTime())
    || (input.endsAt && input.endsAt.getTime() !== cur.endsAt.getTime())
    || (input.location !== undefined && (input.location?.trim() || null) !== cur.location)
    || (input.meetingUrl !== undefined && (input.meetingUrl?.trim() || null) !== cur.meetingUrl)
    || (input.title !== undefined && input.title.trim() !== cur.title)
    || (input.status !== undefined && input.status !== cur.status);
  const res = await prisma.workMeeting.updateMany({
    where: { id: cur.id, ...(expectedVersion !== undefined ? { version: expectedVersion } : {}) },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim().slice(0, 255) } : {}),
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.startsAt ? { startsAt: input.startsAt } : {}),
      ...(input.endsAt ? { endsAt: input.endsAt } : {}),
      ...(input.timezone ? { timezone: input.timezone } : {}),
      ...(input.location !== undefined ? { location: input.location?.trim().slice(0, 255) || null } : {}),
      ...(input.meetingUrl !== undefined ? { meetingUrl: input.meetingUrl?.trim() || null } : {}),
      ...richFields(input.agendaJson, 'agenda'),
      ...richFields(input.minutesJson, 'minutes'),
      ...(input.decisions !== undefined ? { decisions: input.decisions.map((d) => d.trim().slice(0, 500)).filter(Boolean).slice(0, 50) } : {}),
      ...(calChanged ? { sequence: { increment: 1 } } : {}),
      version: { increment: 1 },
    },
  });
  if (!res.count) throw new ConflictError('Someone else changed this meeting — reload to see their version');
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number, action: 'updated', actor: { kind: 'USER', userId } });
  return getMeeting(userId, projectId, number);
}

export async function setAttendees(userId: number, projectId: number, number: number, ids: number[]) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await findMeeting(projectId, number);
  const next = [...new Set(ids)];
  await assertAttendees(projectId, next);
  const before = new Set((await prisma.workMeetingAttendee.findMany({ where: { meetingId: m.id }, select: { userId: true } })).map((a) => a.userId));
  const added = next.filter((u) => !before.has(u));
  await prisma.$transaction([
    prisma.workMeetingAttendee.deleteMany({ where: { meetingId: m.id, userId: { notIn: next.length ? next : [-1] } } }),
    prisma.workMeetingAttendee.createMany({ data: added.map((uid) => ({ meetingId: m.id, userId: uid })), skipDuplicates: true }),
  ]);
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number, action: 'attendees', actor: { kind: 'USER', userId } });
  if (added.length) await notifyInvited(m.id, userId, added, 'invited');
  return getMeeting(userId, projectId, number);
}

/** Thay cả danh sách việc cần làm (giữ id + thẻ đã tạo của việc còn trong danh sách). */
export async function setActions(
  userId: number, projectId: number, number: number,
  items: Array<{ id?: number; text: string; assigneeId?: number | null; dueDate?: Date | null }>,
) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await findMeeting(projectId, number);
  if (items.length > MAX_ACTIONS) throw new BadRequestError(`At most ${MAX_ACTIONS} action items`, 'WORK_LIMIT');
  for (const it of items) {
    if (!it.text.trim()) throw new BadRequestError('An action item needs some text', 'VALIDATION_ERROR');
    if (it.assigneeId) {
      const a = await loadProjectAccess(it.assigneeId, projectId);
      if (!a) throw new BadRequestError('The owner of an action item must be a project member', 'WORK_BAD_USER');
    }
  }
  const existing = await prisma.workMeetingAction.findMany({ where: { meetingId: m.id }, select: { id: true } });
  const keep = new Set(items.filter((i) => i.id).map((i) => i.id!));
  const known = new Set(existing.map((e) => e.id));
  for (const id of keep) if (!known.has(id)) throw new BadRequestError('Unknown action item', 'VALIDATION_ERROR');
  await prisma.$transaction(async (tx) => {
    await tx.workMeetingAction.deleteMany({ where: { meetingId: m.id, id: { notIn: [...keep].length ? [...keep] : [-1] } } });
    for (const [position, it] of items.entries()) {
      const data = { text: it.text.trim().slice(0, 500), assigneeId: it.assigneeId ?? null, dueDate: it.dueDate ?? null, position };
      if (it.id) await tx.workMeetingAction.update({ where: { id: it.id }, data });
      else await tx.workMeetingAction.create({ data: { ...data, meetingId: m.id } });
    }
    await tx.workMeeting.update({ where: { id: m.id }, data: { version: { increment: 1 } } });
  });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number, action: 'actions', actor: { kind: 'USER', userId } });
  return getMeeting(userId, projectId, number);
}

/**
 * "Create issues": mỗi việc CHƯA có thẻ ⇒ một thẻ (loại TASK, hoặc loại tầng 0 đầu tiên), người
 * làm = người phụ trách nếu người đó được giao việc trong dự án, hạn = hạn của việc. Việc đã có
 * thẻ bị bỏ qua ⇒ bấm hai lần không nhân đôi.
 */
export async function createIssuesFromActions(userId: number, projectId: number, number: number, actionIds?: number[]) {
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await findMeeting(projectId, number);
  const actions = await prisma.workMeetingAction.findMany({
    where: { meetingId: m.id, issueId: null, ...(actionIds?.length ? { id: { in: actionIds } } : {}) },
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
  });
  if (!actions.length) throw new BadRequestError('Every action item already has an issue', 'WORK_NOTHING_TO_DO');
  const types = await prisma.workIssueType.findMany({ where: { projectId, archived: false, level: 0 }, orderBy: { id: 'asc' }, select: { id: true, key: true } });
  const type = types.find((t) => t.key === 'TASK') ?? types[0];
  if (!type) throw new BadRequestError('This project has no issue type for action items', 'WORK_BAD_TYPE');
  const created: Array<{ actionId: number; number: number; key: string; title: string }> = [];
  for (const a of actions) {
    let assigneeId: number | undefined;
    if (a.assigneeId) {
      const acc = await loadProjectAccess(a.assigneeId, projectId);
      if (acc && can(acc.role, 'issue.edit')) assigneeId = a.assigneeId;
    }
    const issue = await createIssueAs(userId, projectId, {
      typeId: type.id, title: a.text.slice(0, 255),
      descriptionJson: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: `Action item from meeting M-${m.number}: ${m.title} (${dayOf(m.startsAt)}).` }] }] } as Prisma.InputJsonValue,
      assigneeId, dueDate: a.dueDate ?? undefined,
    });
    await prisma.workMeetingAction.update({ where: { id: a.id }, data: { issueId: issue.id } });
    created.push({ actionId: a.id, number: issue.number, key: `${ctx.access.key}-${issue.number}`, title: issue.title });
  }
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number, action: 'actions', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'meeting.issues', targetType: 'meeting', targetId: m.id, summary: `Created ${created.length} issue${created.length === 1 ? '' : 's'} from meeting M-${number}: ${created.map((c) => c.key).join(', ')}`.slice(0, 300) });
  return { created, meeting: await getMeeting(userId, projectId, number) };
}

/**
 * Gợi ý việc cần làm bằng AI — DÙNG LẠI việc nhanh `meeting_notes` có sẵn (ai.service quick).
 * Chỉ trả ĐỀ XUẤT (không lưu gì vào cuộc họp): người dùng chọn rồi "Add to action items".
 */
export async function suggestActions(userId: number, projectId: number, number: number) {
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await findMeeting(projectId, number);
  const decisions = Array.isArray(m.decisions) ? (m.decisions as string[]) : [];
  const text = [m.minutesText ?? '', decisions.length ? `Decisions:\n${decisions.map((d) => `- ${d}`).join('\n')}` : ''].filter(Boolean).join('\n\n').trim();
  if (!text) throw new BadRequestError('Write the minutes (or decisions) first, then ask AI for action items', 'WORK_AI_NEEDS_TEXT');
  const { quick } = await import('./ai.service.js');
  const out = await quick(userId, projectId, { task: 'meeting_notes', text: `Meeting M-${m.number} "${m.title}" (${dayOf(m.startsAt)})\n\n${text}`, label: `Action items · meeting M-${m.number}` });
  const members = await prisma.user.findMany({
    where: { username: { in: out.actions.flatMap((a) => (a.type === 'create_issue' && a.assignee ? [a.assignee.replace(/^@/, '')] : [])) } },
    select: { id: true, username: true },
  });
  const proposals = [];
  for (const a of out.actions) {
    if (a.type !== 'create_issue') continue;
    const u = a.assignee ? members.find((x) => x.username === a.assignee!.replace(/^@/, '')) : null;
    const ok = u ? !!(await loadProjectAccess(u.id, projectId)) : false;
    proposals.push({ text: a.title.slice(0, 500), assigneeId: ok ? u!.id : null, dueDate: null as string | null });
  }
  void ctx;
  return { reply: out.reply, proposals, quota: out.quota };
}

export async function shareMinutes(userId: number, projectId: number, number: number, shared: boolean) {
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  if (!ctx.access.modules.clientPortal) throw new BadRequestError('Turn on the client portal to share meeting notes with the client', 'WORK_PORTAL_OFF');
  const m = await findMeeting(projectId, number);
  await prisma.workMeeting.update({ where: { id: m.id }, data: { minutesShared: shared, minutesSharedAt: shared ? new Date() : null } });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number, action: 'shared', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'meeting.share', targetType: 'meeting', targetId: m.id, summary: `${shared ? 'Shared' : 'Unshared'} notes of meeting M-${number} ${shared ? 'with' : 'from'} the client` });
  if (shared) {
    const clients = await invitedClients(projectId, m.id);
    if (clients.length) await notifyInvited(m.id, userId, clients, 'notes');
  }
  return getMeeting(userId, projectId, number);
}

export async function duplicateMeeting(userId: number, projectId: number, number: number, weeks = 1) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await prisma.workMeeting.findFirst({ where: { projectId, number, deletedAt: null }, include: { attendees: { select: { userId: true } } } });
  if (!m) throw new NotFoundError('Meeting not found');
  const shift = Math.min(Math.max(weeks, 1), 52) * 7 * 86_400_000;
  // Người được mời còn hợp lệ (có thể đã rời dự án / cổng khách đã tắt).
  const ids: number[] = [];
  for (const a of m.attendees) {
    const acc = await loadProjectAccess(a.userId, projectId);
    if (acc && (isClientScoped(acc) || governanceAccess(acc.role, acc.workspaceRole).view)) ids.push(a.userId);
  }
  const created = await prisma.$transaction(async (tx) => {
    const n = await nextNumber(tx, 'meeting', projectId);
    return tx.workMeeting.create({
      data: {
        projectId, number: n, title: m.title, type: m.type, status: 'SCHEDULED',
        startsAt: new Date(m.startsAt.getTime() + shift), endsAt: new Date(m.endsAt.getTime() + shift), timezone: m.timezone,
        location: m.location, meetingUrl: m.meetingUrl,
        agendaJson: m.agendaJson ?? Prisma.DbNull, agendaText: m.agendaText,
        organizerId: userId, previousId: m.id,
        attendees: { create: ids.map((uid) => ({ userId: uid })) },
      },
      select: { id: true, number: true },
    });
  });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number: created.number, action: 'created', actor: { kind: 'USER', userId } });
  await notifyInvited(created.id, userId, ids, 'invited');
  return getMeeting(userId, projectId, created.number);
}

export async function deleteMeeting(userId: number, projectId: number, number: number) {
  const ctx = await govCtx(userId, projectId, 'meetings');
  const m = await findMeeting(projectId, number);
  if (!canDeleteGovernance(ctx.access.role, ctx.access.workspaceRole, userId, m.organizerId)) throw new ForbiddenError('Only the organizer or a project admin can delete this meeting');
  await prisma.workMeeting.update({ where: { id: m.id }, data: { deletedAt: new Date() } });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number, action: 'deleted', actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'meeting.delete', targetType: 'meeting', targetId: m.id, summary: `Deleted meeting M-${number}: ${m.title}`.slice(0, 300) });
  return { deleted: true };
}

// ─── .ics + lời mời ──────────────────────────────────────────────

const senderAddress = () => /<([^>]+)>/.exec(config.resendFromEmail ?? '')?.[1] ?? config.resendFromEmail ?? 'no-reply@cuongthai.com';

/** Tệp .ics của một cuộc họp cho người nhận `recipientId` (email của CHÍNH họ trong ATTENDEE; người khác dùng URN). */
async function buildIcs(meetingId: number, recipientId: number, opts: { clientView: boolean; people?: Set<number> | null }) {
  const m = await prisma.workMeeting.findUniqueOrThrow({
    where: { id: meetingId },
    select: {
      id: true, number: true, title: true, status: true, startsAt: true, endsAt: true, timezone: true, location: true, meetingUrl: true,
      sequence: true, updatedAt: true, agendaText: true, minutesShared: true,
      organizer: { select: { username: true, displayName: true, fullName: true } },
      attendees: { orderBy: { id: 'asc' }, select: { user: { select: { id: true, username: true, displayName: true, fullName: true, email: true } } } },
      project: { select: { key: true, name: true, workspace: { select: { slug: true } } } },
    },
  });
  const path = opts.clientView
    ? `${portalPath(m.project.workspace.slug, m.project.key, 'meetings')}&meeting=${m.number}`
    : `/work/${m.project.workspace.slug}/${m.project.key}/meetings/${m.number}`;
  const url = frontendUrl(path);
  // Khách: chương trình chỉ khi đội đã chia sẻ; người không được thấy tên ⇒ "Project team".
  const agenda = !opts.clientView || m.minutesShared ? (m.agendaText ?? '').slice(0, 2000) : '';
  const attendees = m.attendees
    .filter((a) => !opts.people || opts.people.has(a.user.id))
    .map((a) => ({ id: a.user.id, name: displayName(a.user), email: a.user.id === recipientId ? a.user.email : null }));
  const lines = meetingEventLines({
    uid: `ctwork-meeting-${m.id}@cuongthai.com`, sequence: m.sequence, title: `${m.project.key} · ${m.title}`, status: m.status,
    startsAt: m.startsAt, endsAt: m.endsAt, timezone: m.timezone, location: m.location, meetingUrl: m.meetingUrl,
    // CTW-24: "Join:" lên ĐẦU mô tả — Outlook/Google chỉ hiện vài dòng đầu.
    description: [m.meetingUrl ? `Join: ${m.meetingUrl}` : '', m.project.name, agenda ? `Agenda:\n${agenda}` : '', url].filter(Boolean).join('\n'),
    url, categories: m.project.key,
    organizer: { name: m.organizer ? displayName(m.organizer) : m.project.name, email: senderAddress() },
    attendees, updatedAt: m.updatedAt,
  }, new Date());
  return { body: icsDocument(lines), filename: `${m.project.key}-M${m.number}.ics`, meeting: m, url };
}

export async function meetingIcs(userId: number, projectId: number, number: number) {
  await govCtx(userId, projectId, 'meetings');
  const m = await findMeeting(projectId, number);
  const r = await buildIcs(m.id, userId, { clientView: false });
  return { body: r.body, filename: r.filename };
}

/** Email lời mời kèm .ics cho người được mời (mặc định: mọi người được mời trừ người gửi). Tôn trọng WORK_EMAIL_NOTIFICATIONS + email OFF. */
async function emailInvites(meetingId: number, senderId: number, ids: number[]) {
  if (process.env.WORK_EMAIL_NOTIFICATIONS === 'false') return 0;
  const m = await prisma.workMeeting.findUniqueOrThrow({ where: { id: meetingId }, select: { projectId: true, title: true, startsAt: true, timezone: true, meetingUrl: true, location: true, project: { select: { name: true } } } });
  const { getNotifySettings } = await import('./notify.js');
  const clients = new Set(await invitedClients(m.projectId, meetingId));
  let sent = 0;
  for (const uid of ids) {
    if (uid === senderId) continue;
    const u = await prisma.user.findUnique({ where: { id: uid }, select: { email: true, enabled: true } });
    if (!u?.enabled || !u.email) continue;
    if ((await getNotifySettings(uid)).emailMode === 'OFF') continue;
    const isClient = clients.has(uid);
    const people = isClient ? await clientPeopleIds(m.projectId, uid) : null;
    const ics = await buildIcs(meetingId, uid, { clientView: isClient, people });
    const when = new Intl.DateTimeFormat('en-GB', { timeZone: m.timezone, dateStyle: 'full', timeStyle: 'short' }).format(m.startsAt);
    await sendWorkEmail({
      to: u.email,
      subject: `${isClient ? `${m.project.name}: ` : 'CT Work: '}Invitation — ${m.title}`.slice(0, 240),
      heading: `You are invited: ${m.title}`,
      lines: [`${when} (${m.timezone})`, m.location ? `Where: ${m.location}` : '', m.meetingUrl ? `Join: ${m.meetingUrl}` : '', 'The calendar invitation (.ics) is attached — open it to add the meeting to your calendar.'].filter(Boolean),
      cta: { label: 'Open meeting', url: ics.url },
      ...(isClient ? { brand: `${m.project.name} · Client portal`, footer: 'You received this email because you are a client on this project.' } : {}),
      attachments: [{ filename: ics.filename, content: Buffer.from(ics.body, 'utf8').toString('base64'), contentType: 'text/calendar; charset=utf-8' }],
    });
    sent += 1;
  }
  return sent;
}

export async function sendInvites(userId: number, projectId: number, number: number) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await findMeeting(projectId, number);
  const ids = (await prisma.workMeetingAttendee.findMany({ where: { meetingId: m.id }, select: { userId: true } })).map((a) => a.userId);
  if (!ids.length) throw new BadRequestError('Invite someone first', 'WORK_NO_ATTENDEES');
  const sent = await emailInvites(m.id, userId, ids);
  return { sent };
}

async function invitedClients(projectId: number, meetingId: number): Promise<number[]> {
  const { clientMemberIds } = await import('./portalNotify.js');
  const clients = await clientMemberIds(projectId);
  if (!clients.length) return [];
  const rows = await prisma.workMeetingAttendee.findMany({ where: { meetingId, userId: { in: clients } }, select: { userId: true } });
  return rows.map((r) => r.userId);
}

/**
 * Chuông cho người được mời (KHÔNG email — lời mời đã có email riêng kèm .ics). Khách nhận bản
 * cổng khách (payload.portal) đi qua routeForClient — cửa cuối của S2b.
 */
async function notifyInvited(meetingId: number, senderId: number, ids: number[], kind: 'invited' | 'notes') {
  try {
    const m = await prisma.workMeeting.findUniqueOrThrow({ where: { id: meetingId }, select: { id: true, number: true, title: true, projectId: true, project: { select: { key: true, name: true, workspace: { select: { slug: true } } } } } });
    const clients = new Set(await invitedClients(m.projectId, meetingId));
    for (const uid of ids) {
      if (uid === senderId) continue;
      const isClient = clients.has(uid);
      const message = kind === 'notes' ? 'Meeting notes were shared with you' : 'You are invited to a meeting';
      const args = {
        receiverId: uid, senderId, type: 'WORK_ALERT' as const, entityId: m.id,
        payload: isClient
          ? { portal: true, portalKind: 'meeting', projectName: m.project.name, issueKey: m.project.key, title: m.title, message, url: `${portalPath(m.project.workspace.slug, m.project.key, 'meetings')}&meeting=${m.number}` }
          : { issueKey: `${m.project.key} · M-${m.number}`, title: m.title, message: `${message}: ${m.title}`.slice(0, 200), url: `/work/${m.project.workspace.slug}/${m.project.key}/meetings/${m.number}` },
      };
      const routed = await routeForClient(args);
      if (routed) await pushWork(routed);
    }
  } catch (err) {
    logger.warn('[work] báo người được mời họp lỗi', { meetingId, err: (err as Error).message });
  }
}

// ─── Cổng khách: cuộc họp CÓ MỜI khách ───────────────────────────

/**
 * Khách (hoặc nhân viên "Preview as client") thấy cuộc họp có mời (một) khách. Khách thật:
 * chỉ cuộc họp có mời CHÍNH họ. Chương trình / biên bản / quyết định / việc chỉ khi đã chia sẻ.
 * Mô-đun meetings tắt ⇒ danh sách rỗng (`enabled: false`), không lỗi.
 */
export async function portalMeetings(userId: number, projectId: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  if (!ctx.access.modules.meetings) return { enabled: false, items: [] };
  const where = portalMeetingWhere(ctx);
  if (!where) return { enabled: true, items: [] };
  const rows = await prisma.workMeeting.findMany({ where, orderBy: { startsAt: 'desc' }, take: 200, select: MEETING_LIST_SELECT });
  return {
    enabled: true,
    staffView: !ctx.clientView,
    items: rows.map((m) => {
      const r = listRow(m);
      return { ...r, organizer: maskUser(r.organizer, ctx.people), attendees: r.attendees.map((a) => maskUser(a, ctx.people)).filter((a, i, arr) => arr.findIndex((x) => x?.id === a?.id) === i) };
    }),
  };
}

function portalMeetingWhere(ctx: Awaited<ReturnType<typeof portalCtx>>): Prisma.WorkMeetingWhereInput | null {
  const base = { projectId: ctx.access.projectId, deletedAt: null };
  if (ctx.clientView && !ctx.preview) return { ...base, attendees: { some: { userId: ctx.userId } } };
  // Nhân viên (quản lý hoặc xem trước): cuộc họp có mời ít nhất một khách.
  if (!ctx.clientIds.length) return null;
  return { ...base, attendees: { some: { userId: { in: ctx.clientIds } } } };
}

export async function portalMeeting(userId: number, projectId: number, number: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  if (!ctx.access.modules.meetings) throw new NotFoundError('Meeting not found');
  const where = portalMeetingWhere(ctx);
  if (!where) throw new NotFoundError('Meeting not found');
  const m = await prisma.workMeeting.findFirst({
    where: { ...where, number },
    select: {
      ...MEETING_LIST_SELECT, agendaJson: true, minutesJson: true, decisions: true, minutesSharedAt: true,
      actions: { orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, text: true, dueDate: true, issueId: true, assignee: { select: PUBLIC_USER } } },
    },
  });
  if (!m) throw new NotFoundError('Meeting not found');
  const r = listRow({ ...m, actions: m.actions.map((a) => ({ id: a.id, issueId: a.issueId })) });
  const shared = m.minutesShared;
  return {
    ...r,
    organizer: maskUser(r.organizer, ctx.people),
    attendees: r.attendees.map((a) => maskUser(a, ctx.people)),
    shared,
    agendaJson: shared ? m.agendaJson : null,
    minutesJson: shared ? m.minutesJson : null,
    decisions: shared && Array.isArray(m.decisions) ? (m.decisions as string[]) : [],
    // Việc: chỉ chữ + hạn + người (đã che) — KHÔNG mã thẻ nội bộ.
    actions: shared ? m.actions.map((a) => ({ id: a.id, text: a.text, dueDate: dayOf(a.dueDate), assignee: maskUser(a.assignee, ctx.people) })) : [],
    minutesSharedAt: shared ? m.minutesSharedAt : null,
  };
}

export async function portalMeetingIcs(userId: number, projectId: number, number: number, opts: { asClient?: boolean } = {}) {
  const ctx = await portalCtx(userId, projectId, opts);
  if (!ctx.access.modules.meetings) throw new NotFoundError('Meeting not found');
  const where = portalMeetingWhere(ctx);
  if (!where) throw new NotFoundError('Meeting not found');
  const m = await prisma.workMeeting.findFirst({ where: { ...where, number }, select: { id: true } });
  if (!m) throw new NotFoundError('Meeting not found');
  const r = await buildIcs(m.id, userId, { clientView: ctx.clientView, people: ctx.people });
  return { body: r.body, filename: r.filename };
}
