/**
 * CT Work đợt 7a (11/10/2026) — BẤM GIỜ TRÊN THẺ (C11).
 *
 * Start / pause / resume / stop trên một thẻ; stop ⇒ tạo worklog qua `planning.addWorklog` (cùng đường với "Log time":
 * quyền issue.edit, khoá tuần timesheet, trừ remaining, lịch sử) kèm Activity của đợt 4 (mặc định đoán theo thẻ).
 * MỖI NGƯỜI MỘT TIMER — khoá duy nhất `work_timers.user_id`; bấm start ở thẻ khác khi đang chạy ⇒ 409 (hoặc `switch`
 * ⇒ dừng + ghi giờ timer cũ rồi chạy cái mới). Lưu máy chủ ⇒ web và app desktop thấy cùng một timer (phát `work:timer`
 * vào phòng `user:<id>`). Chạy quá ngưỡng (WORK_TIMER_REMIND_MIN, mặc định 240 phút) ⇒ giao diện cảnh báo + một
 * thông báo chuông (một lần mỗi timer) ở lần hỏi kế tiếp.
 * AI agent không dùng timer (agent có timesheet tự động từ lease — GĐ1 A12).
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { emitTimer } from './agileCommon.js';
import { timerElapsedSec, timerMinutes, timerOverdue } from './agileRules.js';
import { TL_ACTIVITIES } from './fptReports.js';
import { requireProject } from './permissions.js';

export const startInput = z.object({ activity: z.enum(TL_ACTIVITIES).nullable().optional(), note: z.string().max(1000).nullable().optional(), switch: z.boolean().optional() });
export const stopInput = z.object({
  activity: z.enum(TL_ACTIVITIES).nullable().optional(),
  note: z.string().max(1000).nullable().optional(),
  /** Sửa số phút trước khi ghi (quên dừng timer). */
  minutes: z.number().int().min(1).max(24 * 60).optional(),
});

export const remindAfterMin = () => {
  const n = Number(process.env.WORK_TIMER_REMIND_MIN ?? 240);
  return Number.isFinite(n) && n >= 0 ? n : 240;
};

const TIMER_SELECT = {
  id: true, userId: true, projectId: true, issueId: true, startedAt: true, runningSince: true, accumulatedSec: true, activity: true, note: true, remindedAt: true,
  issue: { select: { number: true, title: true, deletedAt: true, project: { select: { key: true, name: true, workspace: { select: { slug: true } } } } } },
} satisfies Prisma.WorkTimerSelect;
type TimerRow = Prisma.WorkTimerGetPayload<{ select: typeof TIMER_SELECT }>;

function view(t: TimerRow | null, now = new Date()) {
  if (!t) return null;
  const elapsedSec = timerElapsedSec(t, now);
  const remind = remindAfterMin();
  return {
    id: t.id, projectId: t.projectId, issueNumber: t.issue.number, issueKey: `${t.issue.project.key}-${t.issue.number}`, issueTitle: t.issue.title,
    projectKey: t.issue.project.key, projectName: t.issue.project.name, workspaceSlug: t.issue.project.workspace.slug,
    url: `/work/${t.issue.project.workspace.slug}/${t.issue.project.key}/issue/${t.issue.number}`,
    startedAt: t.startedAt, running: !!t.runningSince, runningSince: t.runningSince, elapsedSec, activity: t.activity, note: t.note,
    remindAfterMin: remind, overdue: timerOverdue(elapsedSec, remind), serverNow: now,
  };
}

async function humanOnly(userId: number, projectId: number) {
  const a = await requireProject(userId, projectId, 'issue.edit');
  if (a.principal === 'AGENT') throw new ForbiddenError('AI agents log time automatically from their leases — timers are for people');
  return a;
}

async function reminderSender(userId: number, projectId: number): Promise<number | null> {
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { workspace: { select: { ownerId: true } } } });
  if (p && p.workspace.ownerId !== userId) return p.workspace.ownerId;
  const other = await prisma.workProjectMember.findFirst({ where: { projectId, role: 'ADMIN', userId: { not: userId } }, select: { userId: true } });
  return other?.userId ?? null;
}

/** Timer của tôi (+ nhắc một lần khi chạy quá ngưỡng). Thẻ đã xoá ⇒ timer tự bỏ. */
export async function myTimer(userId: number) {
  const t = await prisma.workTimer.findUnique({ where: { userId }, select: TIMER_SELECT });
  if (!t) return { timer: null };
  if (t.issue.deletedAt) {
    await prisma.workTimer.deleteMany({ where: { id: t.id } });
    return { timer: null };
  }
  const v = view(t)!;
  if (v.overdue && !t.remindedAt) {
    const r = await prisma.workTimer.updateMany({ where: { id: t.id, remindedAt: null }, data: { remindedAt: new Date() } });
    // Chuông im với tin "tự gửi cho mình" (pushNotification) ⇒ người gửi = chủ không gian (như nhắc họp gửi dưới tên người
    // tổ chức); chính chủ không gian chạy timer ⇒ một ADMIN khác của dự án; không có ai ⇒ chỉ còn cảnh báo trên giao diện.
    const sender = r.count ? await reminderSender(userId, t.projectId) : null;
    if (sender) {
      const { notifyWork } = await import('./notify.js');
      await notifyWork({
        receiverId: userId, senderId: sender, type: 'WORK_ALERT', entityId: t.issueId,
        payload: { issueKey: v.issueKey, title: v.issueTitle, message: `⏱ Your timer on ${v.issueKey} has been running for over ${Math.round(v.remindAfterMin / 60 * 10) / 10}h — stop it if you are done`, url: v.url },
      }).catch((err) => logger.warn('[work] nhắc timer lỗi', { err: (err as Error).message }));
    }
  }
  return { timer: v };
}

export async function issueTimer(userId: number, projectId: number, number: number) {
  const { timer } = await myTimer(userId);
  return { timer, onThisIssue: !!timer && timer.projectId === projectId && timer.issueNumber === number };
}

export async function start(userId: number, projectId: number, number: number, input: z.infer<typeof startInput>) {
  await humanOnly(userId, projectId);
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true, title: true, type: { select: { key: true } } } });
  if (!issue) throw new NotFoundError('Issue not found');
  const cur = await prisma.workTimer.findUnique({ where: { userId }, select: TIMER_SELECT });
  if (cur) {
    if (cur.issueId === issue.id) {
      if (!cur.runningSince) return resume(userId);
      return { timer: view(cur), switched: null };
    }
    if (!input.switch) {
      throw new AppError(`A timer is already running on ${cur.issue.project.key}-${cur.issue.number}. Stop it first or switch.`, 409, 'WORK_TIMER_RUNNING', { issueKey: `${cur.issue.project.key}-${cur.issue.number}` });
    }
  }
  const switched = cur ? await stop(userId, {}) : null;
  let activity: string | null = input.activity ?? null;
  if (activity === null) {
    const { activityOf } = await import('./fptReports.js');
    activity = activityOf(issue.title, issue.type.key);
  }
  const now = new Date();
  try {
    await prisma.workTimer.create({ data: { userId, projectId, issueId: issue.id, startedAt: now, runningSince: now, activity, note: input.note?.trim() || null } });
  } catch (err) {
    // Hai tab bấm cùng lúc ⇒ khoá duy nhất user_id chặn timer thứ hai.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') throw new AppError('A timer is already running', 409, 'WORK_TIMER_RUNNING');
    throw err;
  }
  emitTimer(userId);
  return { timer: (await myTimer(userId)).timer, switched };
}

export async function pause(userId: number) {
  const t = await prisma.workTimer.findUnique({ where: { userId }, select: { id: true, runningSince: true, accumulatedSec: true } });
  if (!t) throw new NotFoundError('No timer is running');
  if (t.runningSince) {
    await prisma.workTimer.update({ where: { id: t.id }, data: { accumulatedSec: timerElapsedSec(t, new Date()), runningSince: null } });
    emitTimer(userId);
  }
  return myTimer(userId);
}

export async function resume(userId: number) {
  const t = await prisma.workTimer.findUnique({ where: { userId }, select: { id: true, runningSince: true } });
  if (!t) throw new NotFoundError('No timer is running');
  if (!t.runningSince) {
    await prisma.workTimer.update({ where: { id: t.id }, data: { runningSince: new Date() } });
    emitTimer(userId);
  }
  return { ...(await myTimer(userId)), switched: null };
}

/**
 * Dừng ⇒ ghi worklog (addWorklog). Dưới 30 giây ⇒ không ghi gì (bấm nhầm). Ghi lỗi (vd tuần đã khoá — 423) ⇒ timer
 * GIỮ NGUYÊN để người dùng sửa rồi dừng lại, không mất giờ.
 */
export async function stop(userId: number, input: z.infer<typeof stopInput>) {
  const t = await prisma.workTimer.findUnique({ where: { userId }, select: TIMER_SELECT });
  if (!t) throw new NotFoundError('No timer is running');
  const sec = timerElapsedSec(t, new Date());
  const auto = timerMinutes(sec);
  const minutes = input.minutes ?? auto.minutes;
  let worklog: { id: number; minutes: number } | null = null;
  if (minutes >= 1 && !t.issue.deletedAt) {
    await humanOnly(userId, t.projectId);
    const { addWorklog } = await import('./planning.service.js');
    const note = (input.note ?? t.note)?.trim() || 'Logged with the timer';
    const log = await addWorklog(userId, t.projectId, t.issue.number, {
      minutes, startedAt: t.startedAt.toISOString(), note, activity: input.activity ?? t.activity ?? null,
    });
    worklog = { id: log.id, minutes: log.minutes };
  }
  await prisma.workTimer.deleteMany({ where: { id: t.id } });
  emitTimer(userId);
  return { stopped: true, issueKey: `${t.issue.project.key}-${t.issue.number}`, elapsedSec: sec, minutes: worklog ? minutes : 0, capped: input.minutes === undefined && auto.capped, worklog };
}

export async function discard(userId: number) {
  const r = await prisma.workTimer.deleteMany({ where: { userId } });
  if (!r.count) throw new NotFoundError('No timer is running');
  emitTimer(userId);
  return { discarded: true };
}

/** Sửa activity / ghi chú của timer đang chạy. */
export async function patch(userId: number, input: { activity?: string | null; note?: string | null }) {
  const t = await prisma.workTimer.findUnique({ where: { userId }, select: { id: true } });
  if (!t) throw new NotFoundError('No timer is running');
  if (input.activity && !(TL_ACTIVITIES as readonly string[]).includes(input.activity)) throw new BadRequestError('Unknown activity', 'WORK_BAD_WORKLOG');
  await prisma.workTimer.update({ where: { id: t.id }, data: { activity: input.activity, note: input.note === undefined ? undefined : input.note?.trim() || null } });
  emitTimer(userId);
  return myTimer(userId);
}
