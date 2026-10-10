/**
 * CT Work đợt 8c (12/10/2026) — HỌP ĐỊNH KỲ + MẪU CHƯƠNG TRÌNH — phần có DB. Luật lặp + mẫu ở meetingSeries.ts.
 *
 * Mô hình (giống Google Calendar/Outlook, nhưng mỗi buổi là một WorkMeeting THẬT để biên bản/điểm danh/ghi âm/việc gắn
 * vào từng buổi như cũ):
 *   - work_meeting_series giữ luật (RRULE) + khuôn (tiêu đề, loại, phút, link, người mời, agenda).
 *   - Buổi được SINH SẴN tới ~10 tuần tới (`generatedUntil`); mở danh sách họp hoặc cron hằng giờ nới tiếp.
 *     UNIQUE (series_id, occurrence_date) ⇒ hai tiến trình nới cùng lúc không bao giờ sinh trùng.
 *   - Sửa MỘT buổi = PATCH /meetings/:num như cũ ⇒ buổi đó thành NGOẠI LỆ (`seriesDetached`), sửa cả chuỗi không đè.
 *   - Xoá MỘT buổi ⇒ thêm EXDATE (không sinh lại).
 *   - Sửa/xoá "từ buổi này về sau" ⇒ cắt chuỗi cũ (UNTIL = hôm trước), chuỗi mới nhận các buổi từ ngày đó.
 *   - Sửa "cả chuỗi" chỉ đụng buổi CHƯA diễn ra, chưa huỷ, chưa sửa riêng. Buổi đã qua giữ nguyên (biên bản là lịch sử).
 *   - Đổi luật lặp/giờ ⇒ buổi tương lai CHƯA có nội dung (biên bản, việc, ghi âm) bị bỏ và sinh lại theo luật mới; buổi
 *     tương lai ĐÃ có nội dung được giữ và tách khỏi chuỗi (thành ngoại lệ) — không mất chữ của ai.
 * Lời mời: chuông cho người được mời MỘT lần khi tạo chuỗi (không mỗi buổi); email .ics của buổi đầu kèm câu mô tả lặp.
 * Mỗi buổi vẫn có UID riêng trong lịch đăng ký `.ics` (calendar.service) nên lịch của người dùng thấy đủ các buổi.
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import { MEETING_TYPES, type MeetingType } from './constants.js';
import { emitWorkEvent } from './events.js';
import { MEETING_LABEL, meetingProvider, newJitsiUrl, validTimezone } from './governance.js';
import { govCtx, markdownDoc, nextNumber } from './governanceDb.js';
import { agendaItemSchema, normalizeAgenda } from './meetingRules.js';
import {
  describeRecurrence, isDay, meetingTemplate, MEETING_TEMPLATES, normalizeRecurrence, occurrencesBetween, occurrenceTimes,
  parseExdates, SERIES_HORIZON_DAYS, SERIES_MAX_BATCH, SERIES_MAX_PER_PROJECT, splitRecurrence, templateAgendaItems, toRrule,
  type MeetingTemplate, type Recurrence,
} from './meetingSeries.js';
import { assertAttendees, emailInvites, getMeeting, notifyInvited } from './meetings.service.js';
import { canDeleteGovernance, isClientScoped, loadProjectAccess, governanceAccess } from './permissions.js';
import { dayInZone, zonedMidnight } from './projectTime.js';
import { RecurrenceError } from './teachingRules.js';
import { tiptapToText } from './tiptapText.js';

type Tx = Prisma.TransactionClient;
const mkId = () => Math.random().toString(36).slice(2, 10);

// ─── Đầu vào ─────────────────────────────────────────────────────

const recurrenceInput = z.object({
  freq: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
  interval: z.number().int().min(1).max(12).optional(),
  byWeekday: z.array(z.number().int().min(0).max(6)).max(7).optional(),
  byMonthDay: z.number().int().min(-1).max(31).nullable().optional(),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
});

export const seriesInput = z.object({
  title: z.string().trim().min(1).max(255),
  type: z.enum(MEETING_TYPES).optional(),
  templateKey: z.string().max(24).nullable().optional(),
  recurrence: recurrenceInput,
  durationMin: z.number().int().min(5).max(720).optional(),
  timezone: z.string().max(64).optional(),
  location: z.string().max(255).nullable().optional(),
  meetingUrl: z.string().max(500).nullable().optional(),
  attendeeIds: z.array(z.number().int().positive()).max(100).optional(),
  agendaItems: z.array(agendaItemSchema).max(50).optional(),
  sendInvites: z.boolean().optional(),
});
export type SeriesInput = z.infer<typeof seriesInput>;

export const seriesPatch = seriesInput.partial().omit({ sendInvites: true }).extend({
  scope: z.enum(['all', 'following']).default('all'),
  /** scope = following: số buổi (M-n) làm mốc. */
  fromMeeting: z.number().int().positive().optional(),
});
export type SeriesPatch = z.infer<typeof seriesPatch>;

function wrapRec<T>(fn: () => T): T {
  try { return fn(); } catch (e) {
    if (e instanceof RecurrenceError) throw new BadRequestError(e.message, 'VALIDATION_ERROR');
    throw e;
  }
}
function assertUrl(url: string | null | undefined) {
  if (!url) return;
  let u: URL;
  try { u = new URL(url); } catch { throw new BadRequestError('The meeting link must be a full URL (https://…)', 'VALIDATION_ERROR'); }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new BadRequestError('The meeting link must start with https://', 'VALIDATION_ERROR');
}
const resolveUrl = (u: string | null | undefined) => (u?.trim().toLowerCase() === 'jitsi' ? newJitsiUrl() : u?.trim() || null);

type SeriesRow = Prisma.WorkMeetingSeriesGetPayload<object>;
const recOf = (s: Pick<SeriesRow, 'recurrence'>) => normalizeRecurrence(s.recurrence);

// ─── Sinh buổi ───────────────────────────────────────────────────

/** Khuôn của một buổi (tạo mới) từ chuỗi. */
function occurrenceData(s: SeriesRow, day: string, tpl: MeetingTemplate | null) {
  const rec = recOf(s);
  const { startsAt, endsAt } = occurrenceTimes(rec, day, s.durationMin, (d) => zonedMidnight(d, s.timezone));
  const agendaItems = Array.isArray(s.agendaItems) ? s.agendaItems : [];
  const minutesJson = tpl ? markdownDoc(tpl.minutes) : undefined;
  return {
    projectId: s.projectId, title: s.title, type: s.type, status: 'SCHEDULED', startsAt, endsAt, timezone: s.timezone,
    location: s.location, meetingUrl: s.meetingUrl, agendaItems: agendaItems as Prisma.InputJsonValue,
    ...(s.agendaJson ? { agendaJson: s.agendaJson as Prisma.InputJsonValue, agendaText: tiptapToText(s.agendaJson).slice(0, 100_000) || null } : {}),
    ...(minutesJson ? { minutesJson, minutesText: tiptapToText(minutesJson).slice(0, 100_000) || null } : {}),
    organizerId: s.organizerId, seriesId: s.id, occurrenceDate: day, templateKey: s.templateKey,
  };
}

/**
 * Sinh các buổi còn thiếu của chuỗi tới chân trời (hôm nay + SERIES_HORIZON_DAYS, không quá UNTIL). Trả số buổi tạo mới.
 * An toàn khi chạy song song: UNIQUE (series_id, occurrence_date) ⇒ buổi đã có bị bỏ qua (P2002).
 */
export async function generateOccurrences(seriesId: number, now = new Date()): Promise<number[]> {
  const s = await prisma.workMeetingSeries.findUnique({ where: { id: seriesId } });
  if (!s || s.endedAt) return [];
  const rec = recOf(s);
  const today = dayInZone(now, s.timezone);
  const horizon = new Date(Date.parse(`${today}T00:00:00Z`) + SERIES_HORIZON_DAYS * 86_400_000).toISOString().slice(0, 10);
  const to = rec.endDate && rec.endDate < horizon ? rec.endDate : horizon;
  const from = [rec.startDate, today].sort()[1];
  const days = occurrencesBetween(rec, from, to, parseExdates(s.exdates), SERIES_MAX_BATCH);
  const have = new Set((await prisma.workMeeting.findMany({ where: { seriesId: s.id, occurrenceDate: { in: days } }, select: { occurrenceDate: true } })).map((m) => m.occurrenceDate));
  const attendeeIds = (Array.isArray(s.attendeeIds) ? s.attendeeIds : []).map(Number).filter((x) => Number.isInteger(x) && x > 0);
  // Người được mời còn hợp lệ (có thể đã rời dự án / cổng khách đã tắt).
  const valid: number[] = [];
  for (const uid of attendeeIds) {
    const a = await loadProjectAccess(uid, s.projectId);
    if (a && (isClientScoped(a) || governanceAccess(a.role, a.workspaceRole).view)) valid.push(uid);
  }
  const tpl = meetingTemplate(s.templateKey);
  const created: number[] = [];
  for (const day of days) {
    if (have.has(day)) continue;
    const { startsAt } = occurrenceTimes(rec, day, s.durationMin, (d) => zonedMidnight(d, s.timezone));
    if (startsAt.getTime() < now.getTime() - 60_000 && day === today) continue; // buổi hôm nay đã qua giờ ⇒ không tạo lùi
    try {
      const m = await prisma.$transaction(async (tx) => {
        const number = await nextNumber(tx, 'meeting', s.projectId);
        return tx.workMeeting.create({
          data: { ...occurrenceData(s, day, tpl), number, attendees: { create: valid.map((uid) => ({ userId: uid })) } },
          select: { id: true },
        });
      });
      created.push(m.id);
    } catch (e) {
      if ((e as { code?: string }).code !== 'P2002') throw e;
    }
  }
  await prisma.workMeetingSeries.update({ where: { id: s.id }, data: { generatedUntil: to } });
  return created;
}

/** Nới mọi chuỗi còn sống của dự án (mở danh sách họp) — rẻ: chỉ chuỗi có chân trời sắp hết. */
export async function extendProjectSeries(projectId: number, now = new Date()): Promise<number> {
  const soon = new Date(now.getTime() + (SERIES_HORIZON_DAYS - 7) * 86_400_000).toISOString().slice(0, 10);
  const rows = await prisma.workMeetingSeries.findMany({ where: { projectId, endedAt: null, OR: [{ generatedUntil: null }, { generatedUntil: { lt: soon } }] }, select: { id: true }, take: SERIES_MAX_PER_PROJECT });
  let n = 0;
  for (const r of rows) n += (await generateOccurrences(r.id, now).catch((e) => { logger.warn('[work] nới chuỗi họp lỗi', { seriesId: r.id, err: (e as Error).message }); return []; })).length;
  return n;
}

/** Cron hằng giờ: nới mọi chuỗi của mọi dự án. */
export async function extendAllSeries(now = new Date()): Promise<number> {
  const soon = new Date(now.getTime() + (SERIES_HORIZON_DAYS - 7) * 86_400_000).toISOString().slice(0, 10);
  const rows = await prisma.workMeetingSeries.findMany({ where: { endedAt: null, OR: [{ generatedUntil: null }, { generatedUntil: { lt: soon } }] }, select: { id: true }, take: 500 });
  let n = 0;
  for (const r of rows) n += (await generateOccurrences(r.id, now).catch(() => [])).length;
  return n;
}

// ─── Xem ─────────────────────────────────────────────────────────

function seriesView(s: SeriesRow & { meetings?: Array<{ number: number; startsAt: Date; status: string; seriesDetached: boolean; occurrenceDate: string | null }> }) {
  const rec = recOf(s);
  return {
    id: s.id, title: s.title, type: s.type, typeLabel: MEETING_LABEL[s.type as MeetingType] ?? 'Meeting', timezone: s.timezone,
    recurrence: rec, rrule: s.rrule, summary: describeRecurrence(rec, 'en'), summaryVi: describeRecurrence(rec, 'vi'),
    durationMin: s.durationMin, location: s.location, meetingUrl: s.meetingUrl, provider: meetingProvider(s.meetingUrl),
    templateKey: s.templateKey, agendaItems: s.agendaItems, attendeeIds: s.attendeeIds, exdates: parseExdates(s.exdates),
    generatedUntil: s.generatedUntil, endedAt: s.endedAt, organizerId: s.organizerId, createdAt: s.createdAt,
    upcoming: (s.meetings ?? []).map((m) => ({ number: m.number, key: `M-${m.number}`, startsAt: m.startsAt, status: m.status, detached: m.seriesDetached, occurrenceDate: m.occurrenceDate })),
  };
}

export async function listSeries(userId: number, projectId: number) {
  const ctx = await govCtx(userId, projectId, 'meetings');
  const rows = await prisma.workMeetingSeries.findMany({
    where: { projectId }, orderBy: [{ endedAt: { sort: 'asc', nulls: 'first' } }, { id: 'desc' }], take: 100,
    include: { meetings: { where: { deletedAt: null, startsAt: { gte: new Date() } }, orderBy: { startsAt: 'asc' }, take: 3, select: { number: true, startsAt: true, status: true, seriesDetached: true, occurrenceDate: true } } },
  });
  return { items: rows.map(seriesView), canEdit: ctx.canEdit, templates: templatesView() };
}

export async function getSeries(userId: number, projectId: number, seriesId: number) {
  const ctx = await govCtx(userId, projectId, 'meetings');
  const s = await prisma.workMeetingSeries.findFirst({
    where: { id: seriesId, projectId },
    include: { meetings: { where: { deletedAt: null }, orderBy: { startsAt: 'asc' }, take: 200, select: { number: true, startsAt: true, status: true, seriesDetached: true, occurrenceDate: true } } },
  });
  if (!s) throw new NotFoundError('Recurring meeting not found');
  const organizer = s.organizerId ? await prisma.user.findUnique({ where: { id: s.organizerId }, select: PUBLIC_USER }) : null;
  return { ...seriesView(s), organizer, canEdit: ctx.canEdit, canDelete: canDeleteGovernance(ctx.access.role, ctx.access.workspaceRole, userId, s.organizerId) };
}

export function templatesView() {
  return MEETING_TEMPLATES.map((t) => ({
    key: t.key, type: t.type, name: t.name, description: t.description, durationMin: t.durationMin, suggest: t.suggest,
    agenda: t.agenda, totalMinutes: t.agenda.reduce((a, x) => a + x.minutes, 0),
  }));
}

// ─── Tạo ─────────────────────────────────────────────────────────

export async function createSeries(userId: number, projectId: number, input: SeriesInput) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const tz = input.timezone ?? 'Asia/Ho_Chi_Minh';
  if (!validTimezone(tz)) throw new BadRequestError('Unknown time zone', 'VALIDATION_ERROR');
  const count = await prisma.workMeetingSeries.count({ where: { projectId, endedAt: null } });
  if (count >= SERIES_MAX_PER_PROJECT) throw new BadRequestError(`At most ${SERIES_MAX_PER_PROJECT} active recurring meetings per project`, 'WORK_LIMIT');
  const tpl = input.templateKey ? meetingTemplate(input.templateKey) : null;
  if (input.templateKey && !tpl) throw new BadRequestError('Unknown meeting template', 'VALIDATION_ERROR');
  const rec = wrapRec(() => normalizeRecurrence({ ...input.recurrence, startDate: input.recurrence.startDate ?? dayInZone(new Date(), tz) }));
  const meetingUrl = resolveUrl(input.meetingUrl);
  assertUrl(meetingUrl);
  const attendeeIds = [...new Set(input.attendeeIds ?? [])];
  await assertAttendees(projectId, attendeeIds);
  const agendaItems = input.agendaItems ? normalizeAgenda(input.agendaItems, mkId) : tpl ? templateAgendaItems(tpl) : [];
  // Phải có ít nhất một buổi trong tương lai (luật lặp không bao giờ trúng ngày nào ⇒ báo ngay).
  const probe = occurrencesBetween(rec, [rec.startDate, dayInZone(new Date(), tz)].sort()[1], rec.endDate ?? '2999-12-31', [], 1);
  if (!probe.length) throw new BadRequestError('This repeat rule has no upcoming meetings — check the dates', 'VALIDATION_ERROR');
  const s = await prisma.workMeetingSeries.create({
    data: {
      projectId, title: input.title.trim().slice(0, 255), type: input.type ?? tpl?.type ?? 'OTHER', timezone: tz,
      recurrence: rec as unknown as Prisma.InputJsonValue, rrule: toRrule(rec), durationMin: input.durationMin ?? tpl?.durationMin ?? 60,
      location: input.location?.trim().slice(0, 255) || null, meetingUrl, templateKey: tpl?.key ?? null,
      agendaItems: agendaItems as unknown as Prisma.InputJsonValue, attendeeIds, organizerId: userId,
    },
  });
  const created = await generateOccurrences(s.id);
  await auditProject(projectId, { actorId: userId, action: 'meeting.series_create', targetType: 'meeting_series', targetId: s.id, summary: `Scheduled recurring meeting "${s.title}" (${describeRecurrence(rec)})`.slice(0, 300) });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number: 0, action: 'created', actor: { kind: 'USER', userId } });
  if (created.length && attendeeIds.length) {
    // MỘT chuông + MỘT email (.ics của buổi đầu) cho cả chuỗi — không xả 20 email.
    await notifyInvited(created[0], userId, attendeeIds, 'invited');
    if (input.sendInvites !== false) await emailInvites(created[0], userId, attendeeIds).catch((e) => logger.warn('[work] gửi lời mời chuỗi họp lỗi', { err: (e as Error).message }));
  }
  return getSeries(userId, projectId, s.id);
}

// ─── Sửa ─────────────────────────────────────────────────────────

/** Buổi tương lai còn đi theo chuỗi: chưa diễn ra, chưa huỷ/xong, chưa sửa riêng. */
const followingWhere = (seriesId: number, now: Date, fromDay?: string): Prisma.WorkMeetingWhereInput => ({
  seriesId, deletedAt: null, status: 'SCHEDULED', seriesDetached: false, startsAt: { gt: now },
  ...(fromDay ? { occurrenceDate: { gte: fromDay } } : {}),
});

/** Buổi có nội dung (biên bản, việc, ghi âm, điểm danh) — đổi luật lặp thì GIỮ, tách thành ngoại lệ. */
async function hasContent(meetingId: number): Promise<boolean> {
  const m = await prisma.workMeeting.findUnique({
    where: { id: meetingId },
    select: { minutesText: true, decisions: true, _count: { select: { actions: true, recordings: true } }, attendees: { where: { OR: [{ attendance: { not: null } }, { rsvp: { not: null } }] }, select: { id: true }, take: 1 } },
  });
  if (!m) return false;
  const tpl = MEETING_TEMPLATES.map((t) => tiptapToText(markdownDoc(t.minutes)).trim());
  const minutes = (m.minutesText ?? '').trim();
  return (!!minutes && !tpl.includes(minutes)) || (Array.isArray(m.decisions) && m.decisions.length > 0) || m._count.actions > 0 || m._count.recordings > 0 || m.attendees.length > 0;
}

export async function updateSeries(userId: number, projectId: number, seriesId: number, patch: SeriesPatch, now = new Date()) {
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  let s = await prisma.workMeetingSeries.findFirst({ where: { id: seriesId, projectId } });
  if (!s) throw new NotFoundError('Recurring meeting not found');
  if (s.endedAt) throw new ConflictError('This recurring meeting has ended');
  void ctx;
  const tz = patch.timezone ?? s.timezone;
  if (!validTimezone(tz)) throw new BadRequestError('Unknown time zone', 'VALIDATION_ERROR');
  const meetingUrl = patch.meetingUrl === undefined ? undefined : resolveUrl(patch.meetingUrl);
  assertUrl(meetingUrl);
  if (patch.attendeeIds) await assertAttendees(projectId, [...new Set(patch.attendeeIds)]);
  const tpl = patch.templateKey ? meetingTemplate(patch.templateKey) : undefined;
  if (patch.templateKey && !tpl) throw new BadRequestError('Unknown meeting template', 'VALIDATION_ERROR');

  // "Từ buổi này về sau" ⇒ tách chuỗi, rồi áp như "cả chuỗi" lên chuỗi mới.
  if (patch.scope === 'following') {
    if (!patch.fromMeeting) throw new BadRequestError('Pick the meeting to change from', 'VALIDATION_ERROR');
    const pivot = await prisma.workMeeting.findFirst({ where: { projectId, number: patch.fromMeeting, seriesId: s.id, deletedAt: null }, select: { occurrenceDate: true } });
    if (!pivot?.occurrenceDate) throw new BadRequestError('That meeting is not part of this recurring meeting', 'VALIDATION_ERROR');
    const cur = recOf(s);
    const { before, after } = wrapRec(() => splitRecurrence(cur, pivot.occurrenceDate!));
    if (before) {
      const old = s;
      const fresh = await prisma.$transaction(async (tx: Tx) => {
        await tx.workMeetingSeries.update({ where: { id: old.id }, data: { recurrence: before as unknown as Prisma.InputJsonValue, rrule: toRrule(before) } });
        const n = await tx.workMeetingSeries.create({
          data: {
            projectId, title: old.title, type: old.type, timezone: old.timezone, recurrence: after as unknown as Prisma.InputJsonValue, rrule: toRrule(after),
            durationMin: old.durationMin, location: old.location, meetingUrl: old.meetingUrl, templateKey: old.templateKey,
            agendaItems: old.agendaItems as Prisma.InputJsonValue, ...(old.agendaJson ? { agendaJson: old.agendaJson as Prisma.InputJsonValue } : {}),
            attendeeIds: old.attendeeIds as Prisma.InputJsonValue, exdates: parseExdates(old.exdates).filter((d) => d >= pivot.occurrenceDate!),
            generatedUntil: old.generatedUntil, organizerId: old.organizerId, splitFromId: old.id,
          },
        });
        await tx.workMeeting.updateMany({ where: { seriesId: old.id, occurrenceDate: { gte: pivot.occurrenceDate! } }, data: { seriesId: n.id } });
        return n;
      });
      s = fresh;
    }
  }

  // Luật mới (nếu có).
  const curRec = recOf(s);
  let nextRec: Recurrence = curRec;
  if (patch.recurrence) {
    nextRec = wrapRec(() => normalizeRecurrence({ ...patch.recurrence, startDate: patch.recurrence!.startDate ?? curRec.startDate }));
  }
  const ruleChanged = toRrule(nextRec) !== toRrule(curRec) || nextRec.startDate !== curRec.startDate || tz !== s.timezone || (patch.durationMin !== undefined && patch.durationMin !== s.durationMin);
  const agendaItems = patch.agendaItems ? normalizeAgenda(patch.agendaItems, mkId) : tpl ? templateAgendaItems(tpl) : undefined;
  const data: Prisma.WorkMeetingSeriesUpdateInput = {
    ...(patch.title !== undefined ? { title: patch.title.trim().slice(0, 255) } : {}),
    ...(patch.type !== undefined ? { type: patch.type } : tpl ? { type: tpl.type } : {}),
    ...(patch.location !== undefined ? { location: patch.location?.trim().slice(0, 255) || null } : {}),
    ...(meetingUrl !== undefined ? { meetingUrl } : {}),
    ...(patch.durationMin !== undefined ? { durationMin: patch.durationMin } : {}),
    ...(patch.timezone !== undefined ? { timezone: tz } : {}),
    ...(tpl ? { templateKey: tpl.key } : {}),
    ...(agendaItems ? { agendaItems: agendaItems as unknown as Prisma.InputJsonValue } : {}),
    ...(patch.attendeeIds ? { attendeeIds: [...new Set(patch.attendeeIds)] } : {}),
    ...(patch.recurrence ? { recurrence: nextRec as unknown as Prisma.InputJsonValue, rrule: toRrule(nextRec) } : {}),
  };
  const updated = await prisma.workMeetingSeries.update({ where: { id: s.id }, data });

  const future = await prisma.workMeeting.findMany({ where: followingWhere(s.id, now), select: { id: true, number: true, occurrenceDate: true } });
  let removed = 0, kept = 0;
  if (ruleChanged) {
    // Buổi tương lai: không nội dung ⇒ bỏ (nhả chỗ occurrence_date để sinh lại); có nội dung ⇒ giữ, tách thành ngoại lệ.
    for (const m of future) {
      if (await hasContent(m.id)) {
        await prisma.workMeeting.update({ where: { id: m.id }, data: { seriesDetached: true } });
        kept += 1;
      } else {
        await prisma.workMeeting.update({ where: { id: m.id }, data: { deletedAt: now, occurrenceDate: null, seriesId: null } });
        removed += 1;
      }
    }
    await prisma.workMeetingSeries.update({ where: { id: s.id }, data: { generatedUntil: null } });
    await generateOccurrences(s.id, now);
  } else if (future.length) {
    const fields: Prisma.WorkMeetingUpdateManyMutationInput = {
      ...(data.title !== undefined ? { title: updated.title } : {}),
      ...(data.type !== undefined ? { type: updated.type } : {}),
      ...(data.location !== undefined ? { location: updated.location } : {}),
      ...(data.meetingUrl !== undefined ? { meetingUrl: updated.meetingUrl } : {}),
      ...(agendaItems ? { agendaItems: agendaItems as unknown as Prisma.InputJsonValue } : {}),
      ...(tpl ? { templateKey: tpl.key } : {}),
    };
    if (Object.keys(fields).length) {
      await prisma.workMeeting.updateMany({ where: { id: { in: future.map((m) => m.id) } }, data: { ...fields, sequence: { increment: 1 }, version: { increment: 1 } } });
    }
    if (patch.attendeeIds) {
      const ids = [...new Set(patch.attendeeIds)];
      for (const m of future) {
        await prisma.$transaction([
          prisma.workMeetingAttendee.deleteMany({ where: { meetingId: m.id, userId: { notIn: ids.length ? ids : [-1] } } }),
          prisma.workMeetingAttendee.createMany({ data: ids.map((uid) => ({ meetingId: m.id, userId: uid })), skipDuplicates: true }),
        ]);
      }
    }
  }
  await auditProject(projectId, { actorId: userId, action: 'meeting.series_update', targetType: 'meeting_series', targetId: s.id, summary: `Changed recurring meeting "${updated.title}"${patch.scope === 'following' ? ' from this meeting on' : ''}${ruleChanged ? ` — ${describeRecurrence(recOf(updated))}` : ''}`.slice(0, 300) });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number: 0, action: 'updated', actor: { kind: 'USER', userId } });
  return { ...(await getSeries(userId, projectId, s.id)), removed, kept };
}

// ─── Xoá / bỏ buổi ───────────────────────────────────────────────

export async function deleteSeries(userId: number, projectId: number, seriesId: number, opts: { scope: 'all' | 'following'; fromMeeting?: number }, now = new Date()) {
  const ctx = await govCtx(userId, projectId, 'meetings', { edit: true });
  const s = await prisma.workMeetingSeries.findFirst({ where: { id: seriesId, projectId } });
  if (!s) throw new NotFoundError('Recurring meeting not found');
  if (!canDeleteGovernance(ctx.access.role, ctx.access.workspaceRole, userId, s.organizerId)) throw new ForbiddenError('Only the organizer or a project admin can delete this recurring meeting');
  let fromDay: string | undefined;
  if (opts.scope === 'following') {
    if (!opts.fromMeeting) throw new BadRequestError('Pick the meeting to stop from', 'VALIDATION_ERROR');
    const pivot = await prisma.workMeeting.findFirst({ where: { projectId, number: opts.fromMeeting, seriesId: s.id }, select: { occurrenceDate: true } });
    if (!pivot?.occurrenceDate) throw new BadRequestError('That meeting is not part of this recurring meeting', 'VALIDATION_ERROR');
    fromDay = pivot.occurrenceDate;
  }
  // Chỉ bỏ buổi CHƯA diễn ra, còn SCHEDULED và chưa có nội dung; buổi đã qua giữ (biên bản là lịch sử).
  const future = await prisma.workMeeting.findMany({ where: { seriesId: s.id, deletedAt: null, status: 'SCHEDULED', startsAt: { gt: now }, ...(fromDay ? { occurrenceDate: { gte: fromDay } } : {}) }, select: { id: true } });
  let removed = 0, kept = 0;
  for (const m of future) {
    if (await hasContent(m.id)) { await prisma.workMeeting.update({ where: { id: m.id }, data: { seriesDetached: true } }); kept += 1; continue; }
    await prisma.workMeeting.update({ where: { id: m.id }, data: { deletedAt: now } });
    removed += 1;
  }
  const rec = recOf(s);
  const lastDay = fromDay ? new Date(Date.parse(`${fromDay}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10) : dayInZone(now, s.timezone);
  const ended = { ...rec, endDate: lastDay < rec.startDate ? rec.startDate : lastDay };
  await prisma.workMeetingSeries.update({
    where: { id: s.id },
    data: { recurrence: ended as unknown as Prisma.InputJsonValue, rrule: toRrule(ended), endedAt: opts.scope === 'all' || (fromDay && fromDay <= rec.startDate) ? now : null },
  });
  await auditProject(projectId, { actorId: userId, action: 'meeting.series_delete', targetType: 'meeting_series', targetId: s.id, summary: `Stopped recurring meeting "${s.title}"${fromDay ? ` from ${fromDay}` : ''} — ${removed} upcoming meeting(s) removed${kept ? `, ${kept} kept (have notes)` : ''}`.slice(0, 300) });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number: 0, action: 'deleted', actor: { kind: 'USER', userId } });
  return { removed, kept };
}

/** Gọi từ meetings.deleteMeeting: buổi thuộc chuỗi bị xoá ⇒ thêm EXDATE để không sinh lại. */
export async function addExdate(seriesId: number, day: string | null): Promise<void> {
  if (!isDay(day)) return;
  const s = await prisma.workMeetingSeries.findUnique({ where: { id: seriesId }, select: { exdates: true } });
  if (!s) return;
  await prisma.workMeetingSeries.update({ where: { id: seriesId }, data: { exdates: parseExdates([...parseExdates(s.exdates), day]) } });
}

// ─── Mẫu chương trình cho MỘT buổi ───────────────────────────────

/**
 * Áp mẫu vào một buổi họp: agenda có cấu trúc (thay nếu trống, hoặc `replace`), loại họp, khung biên bản (chỉ khi biên
 * bản còn trống — không bao giờ đè chữ người đã viết).
 */
export async function applyTemplate(userId: number, projectId: number, number: number, input: { key: string; replace?: boolean }) {
  await govCtx(userId, projectId, 'meetings', { edit: true });
  const tpl = meetingTemplate(input.key);
  if (!tpl) throw new BadRequestError('Unknown meeting template', 'VALIDATION_ERROR');
  const m = await prisma.workMeeting.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, agendaItems: true, minutesText: true } });
  if (!m) throw new NotFoundError('Meeting not found');
  const hasAgenda = Array.isArray(m.agendaItems) && m.agendaItems.length > 0;
  const minutesJson = markdownDoc(tpl.minutes);
  await prisma.workMeeting.update({
    where: { id: m.id },
    data: {
      type: tpl.type, templateKey: tpl.key,
      ...(!hasAgenda || input.replace ? { agendaItems: templateAgendaItems(tpl) as unknown as Prisma.InputJsonValue } : {}),
      ...(!(m.minutesText ?? '').trim() ? { minutesJson, minutesText: tiptapToText(minutesJson).slice(0, 100_000) || null } : {}),
      version: { increment: 1 },
    },
  });
  emitWorkEvent({ type: 'governance.updated', projectId, entity: 'meeting', number, action: 'updated', actor: { kind: 'USER', userId } });
  return getMeeting(userId, projectId, number);
}
