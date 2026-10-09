/**
 * CT Work K-2 (10/10/2026) — HỌP: agenda có cấu trúc · RSVP · điểm danh · ghi âm có đồng ý → phiên âm Groq theo đoạn →
 * AI viết biên bản dạng ĐỀ XUẤT (có bằng chứng) → chủ trì duyệt → đổ vào biên bản có sẵn → action thành thẻ (luồng S3b).
 *
 * Quyền (mọi hàm qua govCtx: mô-đun meetings bật + người của ĐỘI — khách cổng ⇒ 403 WORK_INTERNAL_ONLY, và tuyến
 * /meetings/** với khách đã bị chặn CLIENT_PORTAL_ONLY ở work.routes.ts; khách chỉ thấy biên bản ĐÃ CHIA SẺ qua
 * /portal/meetings — không bao giờ thấy audio/transcript nội bộ):
 *   - RSVP: chính người được mời. Vào/rời họp: ai xem được cuộc họp (điểm danh AUTO).
 *   - Điểm danh tay, áp/bỏ đề xuất biên bản, xoá audio: chủ trì (người tạo) hoặc ADMIN dự án.
 *   - Ghi âm: MEMBER+ (người); chỉ bắt đầu khi mọi người đang ở phòng CT Work đã đồng ý; tải đoạn: chính người ghi.
 *   - Agent: chỉ đọc transcript + đề xuất biên bản (registry); mọi tuyến ghi âm/điểm danh/áp dụng bị chặn
 *     (AGENT_DENIED_ROUTES + assertHumanActor).
 *
 * Quyền riêng tư: audio chỉ nằm trong RAM khi phiên âm; transcript KHÔNG ghi vào log; audio có hạn lưu (mặc định 30 ngày)
 * — `purgeExpiredMeetingAudio` xoá object R2 nhưng giữ bản chép lời.
 */

import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { getSignedDownloadUrl } from '../../config/r2.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { notifyWork as pushWork } from '../notification.service.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, PUBLIC_USER } from './common.js';
import { assertCommentStorage, commentStore, runStt, sttReady, trackBackground } from './commentFiles.service.js';
import { vnDayStart } from './commentThreads.js';
import { emitWorkEvent } from './events.js';
import { MEETING_LABEL } from './governance.js';
import { govCtx, markdownDoc } from './governanceDb.js';
import {
  agendaRef, agendaTotalMinutes, appliedMinutesMarkdown, attendanceStats, autoAttendance, checkChunk, checkMinutes, chunkExt, chunkProgress,
  clampRetention, consentState, CHUNK_MAX_ATTEMPTS, expiresAtFor, fmtTs, MAX_CHUNKS_PER_RECORDING, MEETING_STT_DAILY_DEFAULT,
  mergeTranscript, minutesMarkdown, minutesOut, minutesPrompt, normalizeAgenda, parseAgenda, parseMinutesContent, parseSegments,
  presentIds, transcriptForPrompt, type AgendaItemInput, type Attendance, type MinutesContent, type Rsvp, type Segment, type TranscriptLine,
} from './meetingRules.js';
import { assertHumanActor, can, canDeleteGovernance, isClientScoped, loadProjectAccess } from './permissions.js';
import type { MeetingType } from './constants.js';
import { dayInZone } from './projectTime.js';

// ─── chung ───────────────────────────────────────────────────────

async function meetingOf(projectId: number, number: number) {
  const m = await prisma.workMeeting.findFirst({
    where: { projectId, number, deletedAt: null },
    select: { id: true, number: true, title: true, type: true, status: true, startsAt: true, endsAt: true, timezone: true, location: true, meetingUrl: true, organizerId: true, agendaItems: true, recordingUrl: true, minutesJson: true, decisions: true, version: true },
  });
  if (!m) throw new NotFoundError('Meeting not found');
  return m;
}
type MeetingRow = Awaited<ReturnType<typeof meetingOf>>;

const isChair = (ctx: Awaited<ReturnType<typeof govCtx>>, userId: number, m: { organizerId: number | null }) =>
  canDeleteGovernance(ctx.access.role, ctx.access.workspaceRole, userId, m.organizerId);

function changed(projectId: number, number: number, userId: number, action: string) {
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number, action, actor: { kind: 'USER', userId } });
}

// ─── Cấu hình họp của dự án ──────────────────────────────────────

export function envSttDaily(): number {
  const n = Number(process.env.WORK_MEETING_STT_DAILY);
  return Number.isFinite(n) && n >= 0 ? n : MEETING_STT_DAILY_DEFAULT;
}

export async function settingsOf(projectId: number) {
  const s = await prisma.workMeetingSettings.findUnique({ where: { projectId } });
  return {
    audioRetentionDays: s?.audioRetentionDays ?? 30,
    sttDailyLimit: s?.sttDailyLimit ?? null,
    effectiveSttDailyLimit: s?.sttDailyLimit ?? envSttDaily(),
    reminderMinutes: s?.reminderMinutes ?? 10,
    remindInChat: s?.remindInChat ?? true,
  };
}

export async function getMeetingSettings(userId: number, projectId: number) {
  const ctx = await govCtx(userId, projectId, 'meetings');
  return { ...(await settingsOf(projectId)), canManage: ctx.canManage, sttConfigured: sttReady() };
}

export async function updateMeetingSettings(userId: number, projectId: number, input: { audioRetentionDays?: number; sttDailyLimit?: number | null; reminderMinutes?: number; remindInChat?: boolean }) {
  await assertHumanActor(userId, 'change meeting settings');
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  if (!ctx.canManage) throw new ForbiddenError('Only a project admin can change meeting settings');
  const data = {
    ...(input.audioRetentionDays !== undefined ? { audioRetentionDays: clampRetention(input.audioRetentionDays) } : {}),
    ...(input.sttDailyLimit !== undefined ? { sttDailyLimit: input.sttDailyLimit === null ? null : Math.max(0, Math.min(5000, Math.round(input.sttDailyLimit))) } : {}),
    ...(input.reminderMinutes !== undefined ? { reminderMinutes: Math.max(0, Math.min(1440, Math.round(input.reminderMinutes))) } : {}),
    ...(input.remindInChat !== undefined ? { remindInChat: input.remindInChat } : {}),
  };
  await prisma.workMeetingSettings.upsert({ where: { projectId }, create: { projectId, ...data }, update: data });
  // Hạn lưu đổi ⇒ tính lại hạn của mọi bản ghi còn audio.
  if (data.audioRetentionDays !== undefined) {
    const recs = await prisma.workMeetingRecording.findMany({ where: { meeting: { projectId }, audioDeletedAt: null }, select: { id: true, endedAt: true, createdAt: true } });
    for (const r of recs) await prisma.workMeetingRecording.update({ where: { id: r.id }, data: { expiresAt: expiresAtFor(r.endedAt ?? r.createdAt, data.audioRetentionDays) } });
  }
  await auditProject(projectId, { actorId: userId, action: 'meeting.settings', targetType: 'project', targetId: projectId, summary: `Meeting settings: ${JSON.stringify(data)}`.slice(0, 300) });
  return getMeetingSettings(userId, projectId);
}

// ─── Agenda có cấu trúc + link bản ghi hình ngoài ─────────────────

export async function setAgendaItems(userId: number, projectId: number, number: number, items: AgendaItemInput[]) {
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await meetingOf(projectId, number);
  for (const it of items) {
    if (it.presenterId && !(await loadProjectAccess(it.presenterId, projectId))) throw new BadRequestError('The presenter must be a project member', 'WORK_BAD_USER');
  }
  const norm = normalizeAgenda(items, () => crypto.randomUUID().slice(0, 8));
  await prisma.workMeeting.update({ where: { id: m.id }, data: { agendaItems: norm as unknown as Prisma.InputJsonValue, version: { increment: 1 } } });
  changed(projectId, number, userId, 'agenda');
  void ctx;
  return getRoom(userId, projectId, number);
}

export async function setRecordingLink(userId: number, projectId: number, number: number, url: string | null) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await meetingOf(projectId, number);
  if (url) {
    let u: URL;
    try { u = new URL(url); } catch { throw new BadRequestError('Paste a full https:// link to the recording', 'VALIDATION_ERROR'); }
    if (u.protocol !== 'https:') throw new BadRequestError('Paste a full https:// link to the recording', 'VALIDATION_ERROR');
  }
  await prisma.workMeeting.update({ where: { id: m.id }, data: { recordingUrl: url?.trim().slice(0, 500) || null } });
  changed(projectId, number, userId, 'recording-link');
  return getRoom(userId, projectId, number);
}

// ─── RSVP · vào/rời họp · điểm danh ──────────────────────────────

export async function rsvp(userId: number, projectId: number, number: number, input: { rsvp: Rsvp; note?: string | null }) {
  await govCtx(userId, projectId, 'meetings');
  const m = await meetingOf(projectId, number);
  const row = await prisma.workMeetingAttendee.findUnique({ where: { uk_work_meeting_attendee: { meetingId: m.id, userId } } });
  if (!row) throw new ForbiddenError('Only people invited to this meeting can reply');
  if (m.status === 'CANCELLED') throw new BadRequestError('This meeting was cancelled', 'WORK_MEETING_CANCELLED');
  const note = input.note?.trim().slice(0, 300) || null;
  if ((input.rsvp === 'NO' || input.rsvp === 'MAYBE') && !note) {
    // Lý do không bắt buộc, nhưng ghi rõ ở UI; giữ cho phép trống.
  }
  await prisma.workMeetingAttendee.update({ where: { id: row.id }, data: { rsvp: input.rsvp, rsvpNote: note, rsvpAt: new Date() } });
  changed(projectId, number, userId, 'rsvp');
  // Báo chủ trì khi có người từ chối / chưa chắc.
  if (m.organizerId && m.organizerId !== userId && input.rsvp !== 'YES') {
    const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, workspace: { select: { slug: true } } } });
    const u = await prisma.user.findUnique({ where: { id: userId }, select: PUBLIC_USER });
    await pushWork({
      receiverId: m.organizerId, senderId: userId, type: 'WORK_ALERT', entityId: m.id,
      payload: { issueKey: `${p.key} · M-${m.number}`, title: m.title, message: `${u ? displayName(u) : 'Someone'} replied ${input.rsvp === 'NO' ? 'No' : 'Maybe'}${note ? `: ${note}` : ''}`.slice(0, 200), url: `/work/${p.workspace.slug}/${p.key}/meetings/${m.number}` },
    }).catch(() => {});
  }
  return getRoom(userId, projectId, number);
}

/** "Vào họp" từ CT Work: ghi giờ vào + điểm danh AUTO (người không có lời mời ⇒ thêm dòng walk-in). */
export async function joinMeeting(userId: number, projectId: number, number: number, now = new Date()) {
  const ctx = await govCtx(userId, projectId, 'meetings');
  if (ctx.access.principal === 'AGENT') throw new ForbiddenError('AI agents do not attend meetings');
  const m = await meetingOf(projectId, number);
  if (m.status === 'CANCELLED') throw new BadRequestError('This meeting was cancelled', 'WORK_MEETING_CANCELLED');
  const row = await prisma.workMeetingAttendee.findUnique({ where: { uk_work_meeting_attendee: { meetingId: m.id, userId } } });
  const auto = autoAttendance(m.startsAt, now, { attendance: row?.attendance ?? null, source: row?.attendanceSource ?? null });
  if (row) {
    await prisma.workMeetingAttendee.update({
      where: { id: row.id },
      data: { joinedAt: row.joinedAt ?? now, leftAt: null, attendance: auto.attendance, attendanceSource: auto.source },
    });
  } else {
    await prisma.workMeetingAttendee.create({ data: { meetingId: m.id, userId, invited: false, joinedAt: now, attendance: auto.attendance, attendanceSource: 'AUTO' } });
  }
  changed(projectId, number, userId, 'attendance');
  return { url: m.meetingUrl, attendance: auto.attendance, room: await getRoom(userId, projectId, number) };
}

export async function leaveMeeting(userId: number, projectId: number, number: number, now = new Date()) {
  await govCtx(userId, projectId, 'meetings');
  const m = await meetingOf(projectId, number);
  const row = await prisma.workMeetingAttendee.findUnique({ where: { uk_work_meeting_attendee: { meetingId: m.id, userId } } });
  if (row?.joinedAt) await prisma.workMeetingAttendee.update({ where: { id: row.id }, data: { leftAt: now } });
  changed(projectId, number, userId, 'attendance');
  return getRoom(userId, projectId, number);
}

/** Chủ trì đánh dấu tay (MANUAL — AUTO không ghi đè). `attendance: null` ⇒ xoá dấu. */
export async function markAttendance(userId: number, projectId: number, number: number, items: Array<{ userId: number; attendance: Attendance | null; note?: string | null }>) {
  await assertHumanActor(userId, 'take attendance');
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await meetingOf(projectId, number);
  if (!isChair(ctx, userId, m)) throw new ForbiddenError('Only the organizer or a project admin can take attendance');
  for (const it of items.slice(0, 200)) {
    const acc = await loadProjectAccess(it.userId, projectId);
    if (!acc) throw new BadRequestError('Everyone on the attendance list must be a project member', 'WORK_BAD_USER');
    const data = { attendance: it.attendance, attendanceSource: it.attendance ? 'MANUAL' : null, markedById: userId };
    await prisma.workMeetingAttendee.upsert({
      where: { uk_work_meeting_attendee: { meetingId: m.id, userId: it.userId } },
      create: { meetingId: m.id, userId: it.userId, invited: false, ...data },
      update: data,
    });
  }
  changed(projectId, number, userId, 'attendance');
  await auditProject(projectId, { actorId: userId, action: 'meeting.attendance', targetType: 'meeting', targetId: m.id, summary: `Took attendance for M-${number} (${items.length})` });
  return getRoom(userId, projectId, number);
}

/** Báo cáo chuyên cần theo người trong một khoảng ngày (mặc định 30 ngày gần nhất). */
export async function attendanceReport(userId: number, projectId: number, q: { from?: Date; to?: Date } = {}) {
  await govCtx(userId, projectId, 'meetings');
  const to = q.to ?? new Date();
  const from = q.from ?? new Date(to.getTime() - 30 * 86_400_000);
  const meetings = await prisma.workMeeting.findMany({
    where: { projectId, deletedAt: null, startsAt: { gte: from, lte: to } },
    orderBy: { startsAt: 'asc' },
    select: { id: true, number: true, title: true, status: true, startsAt: true, attendees: { select: { userId: true, attendance: true, rsvp: true, invited: true, user: { select: PUBLIC_USER } } } },
  });
  const rows = meetings.flatMap((m) => {
    const tracked = m.attendees.some((a) => a.attendance);
    return m.attendees.map((a) => ({ userId: a.userId, meetingId: m.id, attendance: a.attendance, rsvp: a.rsvp, tracked, status: m.status }));
  });
  const users = new Map(meetings.flatMap((m) => m.attendees.map((a) => [a.userId, a.user] as const)));
  const people = attendanceStats(rows).map((s) => ({ ...s, user: users.get(s.userId) ?? null })).sort((a, b) => (b.rate ?? -1) - (a.rate ?? -1));
  return {
    from: from.toISOString(), to: to.toISOString(),
    meetings: meetings.map((m) => ({
      number: m.number, title: m.title, status: m.status, startsAt: m.startsAt, tracked: m.attendees.some((a) => a.attendance),
      cells: Object.fromEntries(m.attendees.map((a) => [a.userId, a.attendance])),
    })),
    people,
  };
}

// ─── Phòng họp: dữ liệu K-2 của một cuộc họp ─────────────────────

const REC_SELECT = {
  id: true, source: true, status: true, fileName: true, startedById: true, startedAt: true, endedAt: true, durationMs: true, expiresAt: true, audioDeletedAt: true, createdAt: true,
  consents: { select: { userId: true, decision: true, at: true } },
  chunks: { orderBy: { seq: 'asc' }, select: { seq: true, status: true, startMs: true, durationMs: true, size: true, r2Key: true, error: true, attempts: true } },
} satisfies Prisma.WorkMeetingRecordingSelect;

export async function getRoom(userId: number, projectId: number, number: number) {
  const ctx = await govCtx(userId, projectId, 'meetings');
  const m = await meetingOf(projectId, number);
  const [attendees, recs, drafts, settings, project] = await Promise.all([
    prisma.workMeetingAttendee.findMany({ where: { meetingId: m.id }, orderBy: { id: 'asc' }, select: { userId: true, invited: true, rsvp: true, rsvpNote: true, rsvpAt: true, attendance: true, attendanceSource: true, joinedAt: true, leftAt: true, user: { select: PUBLIC_USER } } }),
    prisma.workMeetingRecording.findMany({ where: { meetingId: m.id }, orderBy: { id: 'asc' }, select: REC_SELECT }),
    prisma.workMeetingMinutesDraft.findMany({ where: { meetingId: m.id }, orderBy: { id: 'desc' }, take: 10, select: { id: true, status: true, language: true, content: true, model: true, createdById: true, createdAt: true, decidedAt: true, decidedById: true } }),
    settingsOf(projectId),
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true } }),
  ]);
  const present = presentIds(attendees);
  const agenda = parseAgenda(m.agendaItems).map((a) => ({ ...a, refInfo: agendaRef(a.ref, project.key) }));
  const me = attendees.find((a) => a.userId === userId) ?? null;
  const chair = isChair(ctx, userId, m);
  return {
    number: m.number,
    meId: userId,
    agenda, agendaMinutes: agendaTotalMinutes(agenda),
    recordingUrl: m.recordingUrl,
    attendees: attendees.map((a) => ({ ...a, present: present.includes(a.userId) })),
    tracked: attendees.some((a) => a.attendance),
    me: me ? { rsvp: me.rsvp, rsvpNote: me.rsvpNote, attendance: me.attendance, joinedAt: me.joinedAt, leftAt: me.leftAt, invited: me.invited, present: present.includes(userId) } : null,
    recordings: recs.map((r) => {
      const cs = consentState(present, r.startedById ?? 0, r.consents);
      return {
        id: r.id, source: r.source, status: r.status, fileName: r.fileName, startedById: r.startedById, startedAt: r.startedAt, endedAt: r.endedAt,
        durationMs: r.durationMs, expiresAt: r.expiresAt, audioDeleted: !!r.audioDeletedAt, createdAt: r.createdAt,
        consents: r.consents,
        consent: { waiting: cs.waiting, declined: cs.declined, agreed: cs.agreed, canBegin: cs.canBegin },
        progress: chunkProgress(r.chunks),
        chunks: r.chunks.map((c) => ({ seq: c.seq, status: c.status, startMs: c.startMs, durationMs: c.durationMs, hasAudio: !!c.r2Key, error: c.error, attempts: c.attempts })),
        mine: r.startedById === userId,
      };
    }),
    drafts: drafts.map((d) => ({ ...d, content: parseMinutesContent(d.content) })),
    settings,
    sttConfigured: sttReady(),
    can: {
      edit: ctx.canEdit,
      chair,
      record: ctx.canEdit && ctx.access.principal !== 'AGENT',
      ai: ctx.canEdit && can(ctx.access.role, 'ai.use', ctx.access.options, ctx.access.principal),
      manageSettings: ctx.canManage,
    },
  };
}

// ─── Ghi âm: đồng ý · bắt đầu · đoạn · kết thúc ──────────────────

async function recordingOf(meetingId: number, recordingId: number) {
  const r = await prisma.workMeetingRecording.findFirst({ where: { id: recordingId, meetingId }, select: { id: true, status: true, startedById: true, source: true, startedAt: true, endedAt: true, audioDeletedAt: true, createdAt: true } });
  if (!r) throw new NotFoundError('Recording not found');
  return r;
}

/** Mở lượt ghi: LIVE ⇒ hỏi đồng ý mọi người đang ở phòng; UPLOAD (tệp có sẵn) ⇒ người tải lên xác nhận đã có đồng ý. */
export async function startRecording(userId: number, projectId: number, number: number, input: { source: 'LIVE' | 'UPLOAD'; fileName?: string | null; confirmConsent?: boolean }) {
  await assertHumanActor(userId, 'record meetings');
  await govCtx(userId, projectId, 'meetings', { edit: true });
  assertCommentStorage();
  const m = await meetingOf(projectId, number);
  if (m.status === 'CANCELLED') throw new BadRequestError('This meeting was cancelled', 'WORK_MEETING_CANCELLED');
  if (input.source === 'UPLOAD' && !input.confirmConsent) throw new BadRequestError('Confirm that everyone in the recording agreed to be recorded', 'WORK_CONSENT_REQUIRED');
  const busy = await prisma.workMeetingRecording.findFirst({ where: { meetingId: m.id, source: 'LIVE', status: { in: ['CONSENT', 'RECORDING'] } }, select: { id: true } });
  if (input.source === 'LIVE' && busy) throw new ConflictError('A recording is already in progress for this meeting');
  const r = await prisma.workMeetingRecording.create({
    data: {
      meetingId: m.id, startedById: userId, source: input.source,
      status: input.source === 'UPLOAD' ? 'RECORDING' : 'CONSENT',
      startedAt: input.source === 'UPLOAD' ? new Date() : null,
      fileName: input.fileName?.trim().slice(0, 255) || null,
      consents: { create: { userId, decision: 'AGREED' } },
    },
    select: { id: true },
  });
  changed(projectId, number, userId, 'recording');
  if (input.source === 'LIVE') await notifyRoom(projectId, m, userId, 'consent').catch(() => {});
  await auditProject(projectId, { actorId: userId, action: 'meeting.recording', targetType: 'meeting', targetId: m.id, summary: `${input.source === 'LIVE' ? 'Asked to record' : 'Uploaded a recording of'} meeting M-${number}` });
  return { recordingId: r.id, room: await getRoom(userId, projectId, number) };
}

/** Đồng ý / từ chối. Từ chối khi đang ghi ⇒ dừng ghi (STOPPED). */
export async function consent(userId: number, projectId: number, number: number, recordingId: number, agree: boolean) {
  await govCtx(userId, projectId, 'meetings');
  const m = await meetingOf(projectId, number);
  const r = await recordingOf(m.id, recordingId);
  if (r.status !== 'CONSENT' && r.status !== 'RECORDING') throw new BadRequestError('This recording is no longer active', 'WORK_RECORDING_CLOSED');
  if (r.startedById === userId && !agree) {
    // Người ghi tự huỷ.
    await prisma.workMeetingRecording.update({ where: { id: r.id }, data: { status: 'STOPPED', endedAt: new Date() } });
  } else {
    await prisma.workMeetingConsent.upsert({
      where: { uk_work_meeting_consent: { recordingId: r.id, userId } },
      create: { recordingId: r.id, userId, decision: agree ? 'AGREED' : 'DECLINED' },
      update: { decision: agree ? 'AGREED' : 'DECLINED', at: new Date() },
    });
    if (!agree && r.status === 'RECORDING') {
      await prisma.workMeetingRecording.update({ where: { id: r.id }, data: { status: 'STOPPED', endedAt: new Date() } });
      await finalizeExpiry(projectId, r.id);
    }
  }
  changed(projectId, number, userId, 'recording');
  return getRoom(userId, projectId, number);
}

/** Bắt đầu ghi thật: mọi người đang ở phòng CT Work đã đồng ý, không ai từ chối. */
export async function beginRecording(userId: number, projectId: number, number: number, recordingId: number) {
  await assertHumanActor(userId, 'record meetings');
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await meetingOf(projectId, number);
  const r = await recordingOf(m.id, recordingId);
  if (r.startedById !== userId) throw new ForbiddenError('Only the person who asked to record can start it');
  if (r.status === 'RECORDING') return getRoom(userId, projectId, number);
  if (r.status !== 'CONSENT') throw new BadRequestError('This recording is no longer active', 'WORK_RECORDING_CLOSED');
  const [attendees, consents] = await Promise.all([
    prisma.workMeetingAttendee.findMany({ where: { meetingId: m.id }, select: { userId: true, joinedAt: true, leftAt: true } }),
    prisma.workMeetingConsent.findMany({ where: { recordingId: r.id }, select: { userId: true, decision: true } }),
  ]);
  const cs = consentState(presentIds(attendees), userId, consents);
  if (cs.declined.length) throw new AppError('Someone in the room declined to be recorded', 409, 'WORK_CONSENT_DECLINED', { declined: cs.declined });
  if (cs.waiting.length) throw new AppError('Waiting for everyone in the room to agree', 409, 'WORK_CONSENT_PENDING', { waiting: cs.waiting });
  await prisma.workMeetingRecording.update({ where: { id: r.id }, data: { status: 'RECORDING', startedAt: new Date() } });
  changed(projectId, number, userId, 'recording');
  return getRoom(userId, projectId, number);
}

async function finalizeExpiry(projectId: number, recordingId: number) {
  const s = await settingsOf(projectId);
  const r = await prisma.workMeetingRecording.findUniqueOrThrow({ where: { id: recordingId }, select: { endedAt: true, createdAt: true } });
  await prisma.workMeetingRecording.update({ where: { id: recordingId }, data: { expiresAt: expiresAtFor(r.endedAt ?? r.createdAt, s.audioRetentionDays) } });
}

/** Tải MỘT đoạn (gửi lại cùng `seq` sau rớt mạng ⇒ trả lại đoạn đã lưu, không nhân đôi). Đoạn vào hàng phiên âm nền. */
export async function uploadChunk(
  userId: number, projectId: number, number: number, recordingId: number,
  input: { buffer: Buffer; mime: string; seq: number; startMs: number; durationMs: number; speakerId?: number | null },
) {
  await assertHumanActor(userId, 'record meetings');
  await govCtx(userId, projectId, 'meetings', { edit: true });
  assertCommentStorage();
  const m = await meetingOf(projectId, number);
  const r = await recordingOf(m.id, recordingId);
  if (r.startedById !== userId) throw new ForbiddenError('Only the person recording can upload audio');
  // Đoạn đang trên đường khi lượt ghi vừa kết thúc/dừng ⇒ vẫn nhận (không mất phần đã ghi), trừ khi audio đã xoá.
  if (r.status === 'CONSENT') throw new BadRequestError('Recording has not started yet', 'WORK_RECORDING_NOT_STARTED');
  if (r.audioDeletedAt) throw new BadRequestError('The audio of this recording was deleted', 'WORK_RECORDING_CLOSED');
  const dup = await prisma.workMeetingChunk.findUnique({ where: { uk_work_meeting_chunk: { recordingId: r.id, seq: input.seq } }, select: { seq: true, status: true } });
  if (dup) return { seq: dup.seq, status: dup.status, duplicate: true };
  const check = checkChunk({ size: input.buffer.length, mime: input.mime, durationMs: input.durationMs, startMs: input.startMs });
  if (!check.ok) throw new BadRequestError(check.message, check.code);
  if ((await prisma.workMeetingChunk.count({ where: { recordingId: r.id } })) >= MAX_CHUNKS_PER_RECORDING) throw new BadRequestError('This recording is too long', 'WORK_LIMIT');
  let speakerId = input.speakerId ?? userId;
  if (speakerId !== userId && !(await loadProjectAccess(speakerId, projectId))) speakerId = userId;
  const key = `work/${projectId}/meetings/${m.id}/rec-${r.id}/${String(input.seq).padStart(4, '0')}-${crypto.randomUUID().slice(0, 8)}.${chunkExt(check.mime)}`;
  await commentStore().put(key, input.buffer, check.mime);
  let row;
  try {
    row = await prisma.workMeetingChunk.create({
      data: { recordingId: r.id, seq: input.seq, r2Key: key, mime: check.mime, size: input.buffer.length, startMs: Math.round(input.startMs), durationMs: Math.round(input.durationMs), speakerId, uploaderId: userId },
      select: { id: true, seq: true, status: true },
    });
  } catch (err) {
    // Hai lượt gửi cùng seq chạy song song ⇒ một bên trúng khoá duy nhất: bỏ object thừa, trả đoạn đã có.
    void commentStore().del(key).catch(() => {});
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
      const d = await prisma.workMeetingChunk.findUniqueOrThrow({ where: { uk_work_meeting_chunk: { recordingId: r.id, seq: input.seq } }, select: { seq: true, status: true } });
      return { seq: d.seq, status: d.status, duplicate: true };
    }
    throw err;
  }
  const end = Math.round(input.startMs + input.durationMs);
  await prisma.workMeetingRecording.updateMany({ where: { id: r.id, durationMs: { lt: end } }, data: { durationMs: end } });
  queueChunks([row.id]);
  changed(projectId, number, userId, 'transcript');
  return { seq: row.seq, status: row.status, duplicate: false };
}

export async function endRecording(userId: number, projectId: number, number: number, recordingId: number) {
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await meetingOf(projectId, number);
  const r = await recordingOf(m.id, recordingId);
  if (r.startedById !== userId && !isChair(ctx, userId, m)) throw new ForbiddenError('Only the person recording or the organizer can stop it');
  if (r.status === 'CONSENT') {
    await prisma.workMeetingRecording.update({ where: { id: r.id }, data: { status: 'STOPPED', endedAt: new Date() } });
  } else if (r.status === 'RECORDING') {
    await prisma.workMeetingRecording.update({ where: { id: r.id }, data: { status: 'ENDED', endedAt: new Date() } });
  }
  await finalizeExpiry(projectId, r.id);
  changed(projectId, number, userId, 'recording');
  return getRoom(userId, projectId, number);
}

/** Xoá audio ngay (giữ transcript). Chủ trì / ADMIN. */
export async function deleteAudio(userId: number, projectId: number, number: number, recordingId: number) {
  await assertHumanActor(userId, 'delete meeting recordings');
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await meetingOf(projectId, number);
  const r = await recordingOf(m.id, recordingId);
  if (!isChair(ctx, userId, m) && r.startedById !== userId) throw new ForbiddenError('Only the organizer, the person who recorded or a project admin can delete the audio');
  const n = await purgeRecordingAudio(r.id, userId);
  changed(projectId, number, userId, 'recording');
  await auditProject(projectId, { actorId: userId, action: 'meeting.audio.delete', targetType: 'meeting', targetId: m.id, summary: `Deleted the audio of a recording of M-${number} (${n} chunks); transcript kept` });
  return getRoom(userId, projectId, number);
}

async function purgeRecordingAudio(recordingId: number, byUserId: number | null): Promise<number> {
  const chunks = await prisma.workMeetingChunk.findMany({ where: { recordingId, r2Key: { not: null } }, select: { id: true, r2Key: true } });
  for (const c of chunks) {
    await commentStore().del(c.r2Key!).catch((err) => logger.warn('[work] xoá audio họp lỗi', { chunkId: c.id, err: (err as Error).message }));
  }
  await prisma.workMeetingChunk.updateMany({ where: { recordingId }, data: { r2Key: null } });
  await prisma.workMeetingRecording.update({
    where: { id: recordingId },
    data: { audioDeletedAt: new Date(), deletedById: byUserId },
  });
  await prisma.workMeetingRecording.updateMany({ where: { id: recordingId, status: { in: ['CONSENT', 'RECORDING'] } }, data: { status: 'ENDED', endedAt: new Date() } });
  return chunks.length;
}

/** Link nghe MỘT đoạn (ký sẵn, ngắn hạn). Chỉ người của đội — khách cổng không bao giờ tới được đây. */
export async function chunkAudioUrl(userId: number, projectId: number, number: number, recordingId: number, seq: number) {
  await govCtx(userId, projectId, 'meetings');
  const m = await meetingOf(projectId, number);
  const r = await recordingOf(m.id, recordingId);
  const c = await prisma.workMeetingChunk.findUnique({ where: { uk_work_meeting_chunk: { recordingId: r.id, seq } }, select: { r2Key: true, mime: true } });
  if (!c?.r2Key) throw new NotFoundError('Audio not found (it may have expired)');
  return { url: await getSignedDownloadUrl(c.r2Key, 600), mime: c.mime };
}

// ─── Phiên âm nền ────────────────────────────────────────────────

async function sttUsedTodayMeetings(projectId: number): Promise<number> {
  return prisma.workMeetingChunk.count({
    where: { status: { in: ['DONE', 'NO_SPEECH', 'FAILED'] }, transcribedAt: { gte: vnDayStart() }, recording: { meeting: { projectId } } },
  });
}

/** Lọc từng đoạn Whisper: bỏ đoạn "không có tiếng người" / câu phụ đề bịa. */
async function cleanSegments(segs: Segment[] | undefined, text: string, durationMs: number): Promise<{ segments: Segment[]; text: string } | null> {
  const { checkHeardSpeech } = await import('../makerlab/hallucination.js');
  if (segs?.length) {
    const kept = segs.filter((s) => checkHeardSpeech(s.text, { noSpeechProb: (s as Segment & { noSpeechProb?: number }).noSpeechProb }).ok)
      .map((s) => ({ start: s.start, end: s.end, text: s.text.trim().slice(0, 2000) }));
    if (!kept.length) return null;
    return { segments: kept, text: kept.map((s) => s.text).join(' ') };
  }
  const ok = checkHeardSpeech(text, { audioSec: durationMs / 1000 }).ok;
  return ok ? { segments: [], text: text.trim() } : null;
}

/** Phiên âm MỘT đoạn. Không ném ra ngoài — lỗi ⇒ FAILED (+ số lần thử). */
export async function transcribeChunk(chunkId: number): Promise<string> {
  const c = await prisma.workMeetingChunk.findUnique({
    where: { id: chunkId },
    select: { id: true, seq: true, r2Key: true, mime: true, durationMs: true, attempts: true, status: true, recording: { select: { id: true, meeting: { select: { projectId: true, number: true } } } } },
  });
  if (!c) return 'FAILED';
  const projectId = c.recording.meeting.projectId;
  let status = 'FAILED';
  try {
    if (!c.r2Key) {
      status = 'FAILED';
      await prisma.workMeetingChunk.update({ where: { id: c.id }, data: { status, error: 'Audio was deleted before it could be transcribed', transcribedAt: new Date() } });
    } else if (!sttReady()) {
      status = 'NO_KEY';
      await prisma.workMeetingChunk.update({ where: { id: c.id }, data: { status, error: null } });
    } else {
      const s = await settingsOf(projectId);
      if ((await sttUsedTodayMeetings(projectId)) >= s.effectiveSttDailyLimit) {
        status = 'LIMIT';
        await prisma.workMeetingChunk.update({ where: { id: c.id }, data: { status, error: null } });
      } else {
        const audio = await commentStore().read(c.r2Key);
        const r = await runStt(audio, `meeting-${c.seq}.${chunkExt(c.mime)}`, c.mime);
        const segs = (r as { segments?: Segment[] }).segments;
        const clean = await cleanSegments(segs, r.text ?? '', c.durationMs);
        status = clean ? 'DONE' : 'NO_SPEECH';
        await prisma.workMeetingChunk.update({
          where: { id: c.id },
          data: {
            status, error: null, attempts: { increment: 1 }, transcribedAt: new Date(),
            text: clean ? clean.text.slice(0, 100_000) : null,
            segments: clean?.segments.length ? (clean.segments as unknown as Prisma.InputJsonValue) : Prisma.DbNull,
            language: r.language?.slice(0, 12) ?? null,
          },
        });
      }
    }
  } catch (err) {
    // Chỉ lỗi kỹ thuật — KHÔNG ghi transcript/audio.
    logger.warn('[work] họp: phiên âm đoạn lỗi', { chunkId, err: (err as Error).message.slice(0, 300) });
    status = 'FAILED';
    await prisma.workMeetingChunk.update({ where: { id: c.id }, data: { status, attempts: { increment: 1 }, transcribedAt: new Date(), error: (err as Error).message.slice(0, 300) } }).catch(() => {});
  }
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number: c.recording.meeting.number, action: 'transcript', actor: { kind: 'SYSTEM', userId: null } });
  return status;
}

const queue: number[] = [];
let running = false;
/** Hàng phiên âm TUẦN TỰ trong tiến trình (không bắn chùm vào hạn mức Groq). Đoạn FAILED tự thử lại tới CHUNK_MAX_ATTEMPTS. */
export function queueChunks(ids: number[]): void {
  for (const id of ids) if (!queue.includes(id)) queue.push(id);
  if (running) return;
  running = true;
  const p = (async () => {
    try {
      while (queue.length) {
        const id = queue.shift()!;
        const st = await transcribeChunk(id);
        if (st === 'FAILED') {
          const c = await prisma.workMeetingChunk.findUnique({ where: { id }, select: { attempts: true, r2Key: true } });
          if (c?.r2Key && c.attempts < CHUNK_MAX_ATTEMPTS) {
            await new Promise((res) => setTimeout(res, Number(process.env.WORK_MEETING_STT_RETRY_MS ?? 2000)));
            queue.push(id);
          }
        }
      }
    } finally {
      running = false;
    }
  })().catch(() => { running = false; });
  trackBackground(p);
}

/** Thử lại các đoạn lỗi / hết trần / chưa có khoá của một lượt ghi. */
export async function retryTranscription(userId: number, projectId: number, number: number, recordingId: number) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await meetingOf(projectId, number);
  const r = await recordingOf(m.id, recordingId);
  const rows = await prisma.workMeetingChunk.findMany({ where: { recordingId: r.id, status: { in: ['FAILED', 'LIMIT', 'NO_KEY'] }, r2Key: { not: null } }, select: { id: true } });
  if (rows.length) {
    await prisma.workMeetingChunk.updateMany({ where: { id: { in: rows.map((x) => x.id) } }, data: { status: 'PENDING', attempts: 0, error: null } });
    queueChunks(rows.map((x) => x.id));
  }
  changed(projectId, number, userId, 'transcript');
  return { queued: rows.length };
}

/** Cron: đoạn PENDING bị kẹt (máy chủ khởi động lại) + LIMIT sang ngày mới ⇒ xếp lại. Lượt ghi treo > 6 giờ ⇒ đóng. */
export async function requeueStuckChunks(now = new Date()): Promise<number> {
  const stuck = await prisma.workMeetingChunk.findMany({
    where: {
      r2Key: { not: null },
      OR: [
        { status: 'PENDING', createdAt: { lt: new Date(now.getTime() - 2 * 60_000) } },
        { status: 'LIMIT', createdAt: { lt: vnDayStart(now) } },
        { status: 'FAILED', attempts: { lt: CHUNK_MAX_ATTEMPTS } },
      ],
    },
    select: { id: true }, take: 200,
  });
  const fresh = stuck.map((s) => s.id).filter((id) => !queue.includes(id));
  if (fresh.length) {
    await prisma.workMeetingChunk.updateMany({ where: { id: { in: fresh }, status: 'LIMIT' }, data: { status: 'PENDING' } });
    queueChunks(fresh);
  }
  const stale = await prisma.workMeetingRecording.findMany({ where: { status: { in: ['CONSENT', 'RECORDING'] }, createdAt: { lt: new Date(now.getTime() - 6 * 3600_000) } }, select: { id: true, status: true, meeting: { select: { projectId: true } } } });
  for (const s of stale) {
    await prisma.workMeetingRecording.update({ where: { id: s.id }, data: { status: s.status === 'CONSENT' ? 'STOPPED' : 'ENDED', endedAt: now } });
    await finalizeExpiry(s.meeting.projectId, s.id);
  }
  return fresh.length;
}

// ─── Transcript ──────────────────────────────────────────────────

async function linesOf(meetingId: number, recordingId?: number | null) {
  const recs = await prisma.workMeetingRecording.findMany({
    where: { meetingId, ...(recordingId ? { id: recordingId } : {}) },
    orderBy: { id: 'asc' },
    select: { id: true, source: true, fileName: true, startedAt: true, chunks: { select: { seq: true, startMs: true, durationMs: true, status: true, text: true, segments: true, speakerId: true } } },
  });
  return recs.map((r) => ({ id: r.id, source: r.source, fileName: r.fileName, startedAt: r.startedAt, lines: mergeTranscript(r.chunks), progress: chunkProgress(r.chunks) }));
}

export async function getTranscript(userId: number, projectId: number, number: number) {
  await govCtx(userId, projectId, 'meetings');
  const m = await meetingOf(projectId, number);
  const recs = await linesOf(m.id);
  const ids = [...new Set(recs.flatMap((r) => r.lines.map((l) => l.speakerId)).filter((x): x is number => !!x))];
  const users = await prisma.user.findMany({ where: { id: { in: ids } }, select: PUBLIC_USER });
  return {
    recordings: recs.map((r) => ({ ...r, lines: r.lines.map((l) => ({ ...l, at: fmtTs(l.startMs) })) })),
    speakers: users,
  };
}

/** Gán người nói cho từng dòng (Whisper không tách người nói). */
export async function assignSpeakers(userId: number, projectId: number, number: number, recordingId: number, items: Array<{ lineId: string; speakerId: number | null }>) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await meetingOf(projectId, number);
  const r = await recordingOf(m.id, recordingId);
  const bySeq = new Map<number, Array<{ i: number; speakerId: number | null }>>();
  for (const it of items.slice(0, 2000)) {
    const mm = /^(\d+)\.(\d+)$/.exec(it.lineId);
    if (!mm) throw new BadRequestError('Unknown transcript line', 'VALIDATION_ERROR');
    if (it.speakerId && !(await loadProjectAccess(it.speakerId, projectId))) throw new BadRequestError('The speaker must be a project member', 'WORK_BAD_USER');
    const list = bySeq.get(Number(mm[1])) ?? [];
    list.push({ i: Number(mm[2]), speakerId: it.speakerId });
    bySeq.set(Number(mm[1]), list);
  }
  for (const [seq, list] of bySeq) {
    const c = await prisma.workMeetingChunk.findUnique({ where: { uk_work_meeting_chunk: { recordingId: r.id, seq } }, select: { id: true, segments: true, text: true, durationMs: true } });
    if (!c) throw new BadRequestError('Unknown transcript line', 'VALIDATION_ERROR');
    let segs = parseSegments(c.segments);
    if (!segs.length && c.text) segs = [{ start: 0, end: c.durationMs / 1000, text: c.text }];
    for (const { i, speakerId } of list) if (segs[i]) segs[i] = { ...segs[i], speakerId };
    await prisma.workMeetingChunk.update({ where: { id: c.id }, data: { segments: segs as unknown as Prisma.InputJsonValue } });
  }
  changed(projectId, number, userId, 'transcript');
  return getTranscript(userId, projectId, number);
}

// ─── Biên bản AI (đề xuất có bằng chứng) ─────────────────────────

type MinutesAsk = (system: string, user: string) => Promise<{ text: string; model: string | null }>;
let askOverride: ((system: string, user: string) => Promise<string>) | null = null;
/** CHỈ cho test: thay model (null = gọi thật). */
export function _setMinutesAskForTests(fn: ((system: string, user: string) => Promise<string>) | null): void { askOverride = fn; }

async function askerFor(userId: number, ctx: Awaited<ReturnType<typeof govCtx>>): Promise<MinutesAsk> {
  if (askOverride) { const f = askOverride; return async (s, u) => ({ text: await f(s, u), model: 'test-model' }); }
  const { checkTokenQuota, isAiAvailable, llmComplete } = await import('../interview/llm/index.js');
  if (!isAiAvailable('work')) throw new AppError('The AI assistant is temporarily unavailable. Please try again later.', 503, 'WORK_AI_UNAVAILABLE');
  if (!(await checkTokenQuota(userId))) throw new AppError('You have reached today’s AI usage limit.', 429, 'WORK_AI_TOKEN_CAP');
  if (ctx.access.principal !== 'AGENT') {
    const { aiQuota } = await import('./ai.service.js');
    const q = await aiQuota(userId);
    if (q.limit !== null && (q.remaining ?? 0) <= 0) throw new AppError(`You have used all ${q.limit} free AI requests for today. Upgrade to Pro to keep using the AI assistant.`, 402, 'WORK_AI_QUOTA_EXCEEDED', { limit: q.limit, used: q.used, upgradeUrl: '/pro' });
  }
  // purpose `work_assistant` (sẵn có) — đề xuất purpose riêng `work_minutes` trong báo cáo (không đụng gateway.ts).
  return async (system, user) => {
    const r = await llmComplete({ step: 'report', system, messages: [{ role: 'user', content: user }], maxTokens: 4000, userId, feature: 'work', purpose: 'work_assistant', timeoutMs: 120_000, maxRetries: 1 });
    return { text: r.text, model: r.model ?? null };
  };
}

/** Đề xuất biên bản từ transcript + agenda. Chỉ LƯU đề xuất — không đụng biên bản thật tới khi chủ trì áp. */
export async function proposeMinutes(userId: number, projectId: number, number: number, input: { language?: 'vi' | 'en'; recordingId?: number | null } = {}) {
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  if (!can(ctx.access.role, 'ai.use', ctx.access.options, ctx.access.principal) && ctx.access.principal !== 'AGENT') throw new ForbiddenError('Writing minutes with AI needs a member or admin role');
  const m = await meetingOf(projectId, number);
  const recs = await linesOf(m.id, input.recordingId ?? null);
  // Nhiều lượt ghi ⇒ nối liền (lượt sau xếp sau lượt trước) với số dòng liên tục.
  const lines: TranscriptLine[] = [];
  let offset = 0;
  for (const r of recs) {
    if (!r.lines.length) continue;
    for (const l of r.lines) lines.push({ ...l, id: `${r.id}:${l.id}`, startMs: l.startMs + offset, endMs: l.endMs + offset });
    offset = lines[lines.length - 1].endMs + 1000;
  }
  lines.forEach((l, i) => { l.n = i + 1; });
  if (!lines.length) throw new BadRequestError('There is no transcript yet — record or upload the meeting audio first', 'WORK_NO_TRANSCRIPT');
  const memberRows = await prisma.user.findMany({ where: { id: { in: await projectMemberIds(projectId) } }, select: PUBLIC_USER });
  const members = memberRows.map((u) => ({ id: u.id, username: u.username, name: displayName(u) }));
  const nameOf = (id: number | null) => (id ? members.find((x) => x.id === id)?.name ?? 'Speaker' : 'Speaker');
  const agenda = parseAgenda(m.agendaItems);
  const attendees = await prisma.workMeetingAttendee.findMany({ where: { meetingId: m.id }, select: { user: { select: PUBLIC_USER } } });
  const language = input.language ?? 'vi';
  const t = transcriptForPrompt(lines, nameOf);
  const prompt = minutesPrompt({
    language, title: m.title, type: MEETING_LABEL[m.type as MeetingType] ?? m.type, date: `${dayInZone(m.startsAt, m.timezone)} (${m.timezone})`,
    agenda: agenda.map((a) => `${a.title}${a.presenterId ? ` — ${nameOf(a.presenterId)}` : ''}${a.minutes ? ` (${a.minutes} min)` : ''}`),
    attendees: attendees.map((a) => `${displayName(a.user)} (@${a.user.username})`),
    transcript: t.text,
  });
  const ask = await askerFor(userId, ctx);
  const { extractJson } = await import('../interview/llm/index.js');
  let content: MinutesContent | null = null;
  let model: string | null = null;
  let user = prompt.user;
  for (let attempt = 0; attempt < 2 && !content; attempt++) {
    const r = await ask(prompt.system, user);
    model = r.model;
    try {
      const v = minutesOut.safeParse(extractJson(r.text));
      if (v.success) content = checkMinutes(v.data, lines, members, { truncated: t.truncated });
    } catch { /* hỏi lại một lần */ }
    if (!content) user = `${prompt.user}\n\nYour previous answer was not valid JSON of the requested shape. Answer with the JSON object only.`;
  }
  if (!content) throw new AppError('The AI answer could not be read — try again', 422, 'WORK_AI_BAD_ANSWER');
  const d = await prisma.workMeetingMinutesDraft.create({
    data: { meetingId: m.id, recordingId: input.recordingId ?? null, createdById: userId, language, content: content as unknown as Prisma.InputJsonValue, model: model?.slice(0, 80) ?? null },
    select: { id: true },
  });
  changed(projectId, number, userId, 'minutes');
  return { draftId: d.id, content, model };
}

async function projectMemberIds(projectId: number): Promise<number[]> {
  const { projectMembers } = await import('./projects.service.js');
  return (await projectMembers(projectId)).map((x) => x.id);
}

/**
 * Chủ trì duyệt ⇒ đổ vào biên bản có sẵn: tóm tắt + vấn đề mở nối vào cuối biên bản (không ghi đè chữ đã gõ),
 * quyết định nối vào danh sách, việc cần làm (người + hạn) nối vào bảng việc ⇒ `createIssues` dùng đúng luồng S3b.
 * `skip`: chỉ số mục bỏ qua (người duyệt bỏ tick). Mục thiếu bằng chứng vẫn áp được — người duyệt đã thấy cờ.
 */
export async function applyMinutes(
  userId: number, projectId: number, number: number, draftId: number,
  input: { skipDecisions?: number[]; skipActions?: number[]; createIssues?: boolean } = {},
) {
  await assertHumanActor(userId, 'approve meeting minutes');
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await meetingOf(projectId, number);
  if (!isChair(ctx, userId, m)) throw new ForbiddenError('Only the organizer or a project admin can approve the minutes');
  const d = await prisma.workMeetingMinutesDraft.findFirst({ where: { id: draftId, meetingId: m.id } });
  if (!d) throw new NotFoundError('Draft not found');
  if (d.status !== 'PROPOSED') throw new BadRequestError('This draft was already handled', 'WORK_DRAFT_CLOSED');
  const c = parseMinutesContent(d.content);
  if (!c) throw new BadRequestError('This draft is unreadable', 'WORK_DRAFT_CLOSED');
  const lang = d.language === 'en' ? 'en' : 'vi';
  const skipD = new Set(input.skipDecisions ?? []);
  const skipA = new Set(input.skipActions ?? []);
  const { updateMeeting, setActions, getMeeting, createIssuesFromActions } = await import('./meetings.service.js');
  // Biên bản: nối tóm tắt vào sau phần đã có.
  const add = markdownDoc(appliedMinutesMarkdown(c, lang)) as unknown as { type: string; content?: unknown[] };
  const cur = (m.minutesJson as { type?: string; content?: unknown[] } | null);
  const minutesJson = { type: 'doc', content: [...(Array.isArray(cur?.content) ? cur!.content : []), ...(add.content ?? [])] };
  const decisions = [...(Array.isArray(m.decisions) ? (m.decisions as string[]) : []), ...c.decisions.filter((_, i) => !skipD.has(i)).map((x) => x.text)].slice(0, 50);
  await updateMeeting(userId, projectId, number, { minutesJson: minutesJson as Prisma.InputJsonValue, decisions });
  const meeting = await getMeeting(userId, projectId, number);
  const items = [
    ...meeting.actions.map((x) => ({ id: x.id, text: x.text, assigneeId: x.assignee?.id ?? null, dueDate: x.dueDate ? new Date(`${x.dueDate}T00:00:00Z`) : null })),
    ...c.actions.filter((_, i) => !skipA.has(i)).map((a) => ({ text: a.text, assigneeId: a.ownerId, dueDate: a.due ? new Date(`${a.due}T00:00:00Z`) : null })),
  ].slice(0, 100);
  await setActions(userId, projectId, number, items);
  let created: Array<{ key: string; title: string }> = [];
  if (input.createIssues && c.actions.some((_, i) => !skipA.has(i))) {
    const r = await createIssuesFromActions(userId, projectId, number).catch((err) => {
      if ((err as { code?: string }).code === 'WORK_NOTHING_TO_DO') return null;
      throw err;
    });
    created = r?.created.map((x) => ({ key: x.key, title: x.title })) ?? [];
  }
  await prisma.workMeetingMinutesDraft.update({ where: { id: d.id }, data: { status: 'APPLIED', decidedById: userId, decidedAt: new Date() } });
  // Đề xuất cũ hơn còn treo ⇒ đóng (một bản đã được duyệt).
  await prisma.workMeetingMinutesDraft.updateMany({ where: { meetingId: m.id, status: 'PROPOSED', id: { not: d.id } }, data: { status: 'DISMISSED', decidedById: userId, decidedAt: new Date() } });
  changed(projectId, number, userId, 'minutes');
  await auditProject(projectId, { actorId: userId, action: 'meeting.minutes.apply', targetType: 'meeting', targetId: m.id, summary: `Approved AI minutes for M-${number}${created.length ? ` — created ${created.map((x) => x.key).join(', ')}` : ''}`.slice(0, 300) });
  return { applied: true, created, room: await getRoom(userId, projectId, number) };
}

export async function dismissMinutes(userId: number, projectId: number, number: number, draftId: number) {
  await assertHumanActor(userId, 'dismiss meeting minutes');
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  const m = await meetingOf(projectId, number);
  const d = await prisma.workMeetingMinutesDraft.findFirst({ where: { id: draftId, meetingId: m.id } });
  if (!d) throw new NotFoundError('Draft not found');
  if (!isChair(ctx, userId, m) && d.createdById !== userId) throw new ForbiddenError('Only the organizer, a project admin or the author can dismiss this draft');
  await prisma.workMeetingMinutesDraft.update({ where: { id: d.id }, data: { status: 'DISMISSED', decidedById: userId, decidedAt: new Date() } });
  changed(projectId, number, userId, 'minutes');
  return getRoom(userId, projectId, number);
}

// ─── Xuất biên bản theo mẫu FPT (docx/pdf) ───────────────────────

export async function exportMinutes(userId: number, projectId: number, number: number, format: 'docx' | 'pdf', language: 'vi' | 'en' = 'vi') {
  await govCtx(userId, projectId, 'meetings');
  const m = await meetingOf(projectId, number);
  const { getMeeting } = await import('./meetings.service.js');
  const full = await getMeeting(userId, projectId, number);
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });
  const att = await prisma.workMeetingAttendee.findMany({ where: { meetingId: m.id }, orderBy: { id: 'asc' }, select: { userId: true, attendance: true, rsvp: true, rsvpNote: true, invited: true, user: { select: PUBLIC_USER } } });
  const roles = new Map((await prisma.workProjectMember.findMany({ where: { projectId }, select: { userId: true, role: true } })).map((x) => [x.userId, x.role]));
  const userName = (id: number | null) => (id ? att.find((a) => a.userId === id)?.user : null);
  const recorder = await prisma.workMeetingRecording.findFirst({ where: { meetingId: m.id }, orderBy: { id: 'asc' }, select: { startedById: true } });
  const secretaryUser = recorder?.startedById ? (userName(recorder.startedById) ?? (await prisma.user.findUnique({ where: { id: recorder.startedById }, select: PUBLIC_USER }))) : null;
  const applied = await prisma.workMeetingMinutesDraft.findFirst({ where: { meetingId: m.id, status: 'APPLIED' }, orderBy: { id: 'desc' }, select: { content: true } });
  const ac = parseMinutesContent(applied?.content);
  const { tiptapToText } = await import('./tiptapText.js');
  const minutesText = tiptapToText(full.minutesJson).trim();
  const next = full.next[0];
  const when = new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-GB', { timeZone: m.timezone, dateStyle: 'full', timeStyle: 'short' }).format(m.startsAt);
  const md = minutesMarkdown({
    language, projectName: project.name, projectKey: project.key, meetingKey: `M-${m.number}`, title: m.title,
    typeLabel: MEETING_LABEL[m.type as MeetingType] ?? m.type, when: `${when} (${m.timezone})`, place: [m.location, m.meetingUrl].filter(Boolean).join(' · ') || null,
    chair: full.organizer ? displayName(full.organizer) : null, secretary: secretaryUser ? displayName(secretaryUser) : null,
    attendees: att.map((a) => ({ name: displayName(a.user), role: roles.get(a.userId) ?? '', attendance: a.attendance, note: a.rsvp === 'NO' || a.rsvp === 'MAYBE' ? [a.rsvp, a.rsvpNote].filter(Boolean).join(': ') : (a.invited ? null : (language === 'vi' ? 'Không có lời mời' : 'Walk-in')) })),
    agenda: parseAgenda(m.agendaItems).map((a) => ({ title: a.title, presenter: a.presenterId ? (userName(a.presenterId) ? displayName(userName(a.presenterId)!) : null) : null, minutes: a.minutes })),
    summary: minutesText || ac?.summary || '',
    decisions: full.decisions.map((x) => ({ text: x })),
    actions: full.actions.map((a) => ({ text: a.text, owner: a.assignee ? displayName(a.assignee) : null, due: a.dueDate })),
    openIssues: ac?.openIssues ?? [],
    next: next ? `M-${next.number} · ${next.title} — ${new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-GB', { timeZone: m.timezone, dateStyle: 'medium', timeStyle: 'short' }).format(next.startsAt)}` : null,
    recordingUrl: m.recordingUrl,
  });
  const { markdownToTiptap } = await import('./docMarkdown.js');
  const { renderDocx, renderPdf } = await import('./docExport.js');
  const doc = markdownToTiptap(md).doc;
  const meta = { title: `${language === 'vi' ? 'Biên bản họp' : 'Meeting minutes'} — ${m.title}`, projectName: project.name, projectKey: project.key, docLabel: `M-${m.number}`, version: null, date: m.startsAt, capstone: false };
  const opts = { stripGuides: true, toc: false, cover: false, resolveImage: async () => null };
  const buffer = format === 'docx' ? await renderDocx(doc, meta, opts) : await renderPdf(doc, meta, opts);
  return { buffer, file: `${project.key}_M${m.number}_Meeting_Minutes.${format}`, markdown: md };
}

// ─── Nhắc họp (cron mỗi phút) + dọn audio hết hạn (cron hằng giờ) ─

/** Nhắc người được mời (RSVP ≠ Không) trước giờ họp N phút — chuông + (tuỳ dự án) tin hệ thống ở #general. */
export async function runMeetingReminders(now = new Date()): Promise<number> {
  const rows = await prisma.workMeeting.findMany({
    where: { deletedAt: null, status: 'SCHEDULED', startsAt: { gt: now, lte: new Date(now.getTime() + 1441 * 60_000) }, project: { deletedAt: null } },
    select: {
      id: true, number: true, title: true, startsAt: true, remindedAt: true, organizerId: true, meetingUrl: true, projectId: true,
      project: { select: { key: true, name: true, workspace: { select: { slug: true } } } },
      attendees: { select: { userId: true, rsvp: true } },
    },
    take: 500,
  });
  let sent = 0;
  const settingsCache = new Map<number, Awaited<ReturnType<typeof settingsOf>>>();
  for (const m of rows) {
    if (!settingsCache.has(m.projectId)) settingsCache.set(m.projectId, await settingsOf(m.projectId));
    const s = settingsCache.get(m.projectId)!;
    if (!s.reminderMinutes) continue;
    const windowStart = m.startsAt.getTime() - s.reminderMinutes * 60_000;
    if (now.getTime() < windowStart) continue;
    if (m.remindedAt && m.remindedAt.getTime() >= windowStart - 60_000) continue;
    // Đánh dấu TRƯỚC khi gửi (hai tiến trình cùng chạy ⇒ chỉ một bên thắng).
    const claim = await prisma.workMeeting.updateMany({ where: { id: m.id, OR: [{ remindedAt: null }, { remindedAt: { lt: new Date(windowStart - 60_000) } }] }, data: { remindedAt: now } });
    if (!claim.count) continue;
    const mins = Math.max(1, Math.round((m.startsAt.getTime() - now.getTime()) / 60_000));
    const url = `/work/${m.project.workspace.slug}/${m.project.key}/meetings/${m.number}`;
    const { clientMemberIds, routeForClient, portalPath } = await import('./portalNotify.js');
    const clients = new Set(await clientMemberIds(m.projectId));
    for (const a of m.attendees) {
      if (a.rsvp === 'NO') continue;
      const isClient = clients.has(a.userId);
      const message = `Meeting starts in ${mins} min`;
      const args = {
        receiverId: a.userId, senderId: m.organizerId ?? a.userId, type: 'WORK_ALERT' as const, entityId: m.id,
        payload: isClient
          ? { portal: true, portalKind: 'meeting', projectName: m.project.name, issueKey: m.project.key, title: m.title, message, url: `${portalPath(m.project.workspace.slug, m.project.key, 'meetings')}&meeting=${m.number}` }
          : { issueKey: `${m.project.key} · M-${m.number}`, title: m.title, message: `${message}: ${m.title}`.slice(0, 200), url, reminder: true },
      };
      const routed = await routeForClient(args).catch(() => null);
      if (routed) { await pushWork(routed).catch(() => {}); sent += 1; }
    }
    if (s.remindInChat && m.organizerId) {
      const { postSystemNotice } = await import('./chat.service.js');
      await postSystemNotice(m.projectId, m.organizerId, `⏰ M-${m.number} "${m.title}" starts in ${mins} min`, { type: 'meeting-reminder', meeting: m.number, url, join: m.meetingUrl }).catch((err) => logger.warn('[work] nhắc họp vào chat lỗi', { err: (err as Error).message }));
    }
  }
  return sent;
}

/** Xoá audio đã quá hạn lưu (transcript giữ nguyên). */
export async function purgeExpiredMeetingAudio(now = new Date()): Promise<number> {
  const recs = await prisma.workMeetingRecording.findMany({ where: { audioDeletedAt: null, expiresAt: { lt: now } }, select: { id: true }, take: 200 });
  let chunks = 0;
  for (const r of recs) chunks += await purgeRecordingAudio(r.id, null);
  return chunks;
}

// ─── Báo mọi người đang ở phòng: cần đồng ý ghi âm ──────────────

async function notifyRoom(projectId: number, m: MeetingRow, senderId: number, kind: 'consent') {
  const rows = await prisma.workMeetingAttendee.findMany({ where: { meetingId: m.id }, select: { userId: true, joinedAt: true, leftAt: true } });
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, workspace: { select: { slug: true } } } });
  for (const uid of presentIds(rows)) {
    if (uid === senderId) continue;
    const acc = await loadProjectAccess(uid, projectId);
    if (!acc || isClientScoped(acc)) continue;
    await pushWork({
      receiverId: uid, senderId, type: 'WORK_ALERT', entityId: m.id,
      payload: { issueKey: `${p.key} · M-${m.number}`, title: m.title, message: kind === 'consent' ? 'Recording requested — please agree or decline' : '', url: `/work/${p.workspace.slug}/${p.key}/meetings/${m.number}` },
    }).catch(() => {});
  }
}
