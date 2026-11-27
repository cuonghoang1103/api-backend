/**
 * CT Work — CTW đợt 4 (09/10/2026): TIMELOGS THEO ACTIVITY (A24).
 *
 * Mỗi lần ghi giờ có `activity` (đúng danh sách thả xuống của sheet TimeLogs trong Report2_Project Tracking: Training ·
 * Analyzing · Designing · Coding · Testing · Deploying) và `workProduct` (Report1 (Intro)…Report7 (Final), Software
 * Package, hoặc tên mô-đun / gói việc). Ghi mới: POST …/worklogs nhận hai trường này (work.routes.ts). Ở đây: sửa lại cho
 * lần ghi đã có (tác giả hoặc ADMIN dự án), gợi ý mặc định theo tiêu đề thẻ, và bảng giờ theo activity.
 */

import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { displayName } from './common.js';
import { emitWorkEvent } from './events.js';
import { activityOf, PRODUCTS, productOf, TL_ACTIVITIES } from './fptReports.js';
import { requireProject } from './permissions.js';

export const worklogMetaInput = z.object({
  activity: z.enum(TL_ACTIVITIES).nullable().optional(),
  workProduct: z.string().max(120).nullable().optional(),
  /** dm5 G4 (C5): mũ vai C1–C5 (null = suy từ activity + nhãn). */
  hat: z.enum(['C1', 'C2', 'C3', 'C4', 'C5']).nullable().optional(),
});

/** Gợi ý mặc định cho ô Activity / Work Product khi mở form ghi giờ của một thẻ. */
export async function worklogDefaults(userId: number, projectId: number, number: number) {
  await requireProject(userId, projectId, 'project.view');
  const i = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null },
    select: { title: true, type: { select: { key: true } }, stage: { select: { name: true } }, parent: { select: { title: true } } },
  });
  if (!i) throw new NotFoundError('Issue not found');
  const activity = activityOf(i.title, i.type.key);
  let product = productOf(`${i.title} ${i.stage?.name ?? ''} ${i.parent?.title ?? ''}`);
  // Tiêu đề không nhắc Report nào ⇒ đoán theo hoạt động: phân tích ⇒ SRS, thiết kế ⇒ SDS, kiểm thử ⇒ tài liệu test.
  if (product === PRODUCTS[0]) product = activity === 'Analyzing' ? PRODUCTS[3] : activity === 'Designing' ? PRODUCTS[4] : activity === 'Testing' ? PRODUCTS[5] : product;
  return { activity, workProduct: product, activities: TL_ACTIVITIES, products: PRODUCTS };
}

export async function setWorklogMeta(userId: number, projectId: number, number: number, logId: number, input: z.infer<typeof worklogMetaInput>) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  const log = await prisma.workWorklog.findFirst({ where: { id: logId, issue: { projectId, number, deletedAt: null } }, select: { id: true, userId: true, issueId: true } });
  if (!log) throw new NotFoundError('Worklog not found');
  if (log.userId !== userId && access.role !== 'ADMIN') throw new ForbiddenError('Only the person who logged the time or a project admin can change it');
  const row = await prisma.workWorklog.update({
    where: { id: log.id },
    data: {
      ...(input.activity !== undefined ? { activity: input.activity } : {}),
      ...(input.workProduct !== undefined ? { workProduct: input.workProduct?.trim().slice(0, 120) || null } : {}),
      ...(input.hat !== undefined ? { hat: input.hat } : {}),
    },
    select: { id: true, minutes: true, startedAt: true, note: true, activity: true, workProduct: true, hat: true },
  });
  emitWorkEvent({ type: 'issue.updated', projectId, issueId: log.issueId, actor: { kind: 'USER', userId }, changes: [] });
  return row;
}

/** Giờ theo Activity (và theo người) trong một khoảng ngày — bảng nhỏ trên trang ghi giờ + lệnh registry. */
export async function hoursByActivity(userId: number, projectId: number, q: { from?: string; to?: string } = {}) {
  await requireProject(userId, projectId, 'project.view');
  const range = {
    ...(q.from ? { gte: new Date(`${q.from}T00:00:00Z`) } : {}),
    ...(q.to ? { lt: new Date(new Date(`${q.to}T00:00:00Z`).getTime() + 86_400_000) } : {}),
  };
  const logs = await prisma.workWorklog.findMany({
    where: { issue: { projectId, deletedAt: null }, ...(q.from || q.to ? { startedAt: range } : {}) },
    take: 20_000,
    select: { minutes: true, activity: true, workProduct: true, user: { select: { username: true, fullName: true, displayName: true } }, issue: { select: { title: true, type: { select: { key: true } } } } },
  });
  const byActivity = new Map<string, number>();
  const byPerson = new Map<string, Map<string, number>>();
  let unset = 0;
  for (const l of logs) {
    const act = l.activity ?? activityOf(l.issue.title, l.issue.type.key);
    if (!l.activity) unset += l.minutes;
    byActivity.set(act, (byActivity.get(act) ?? 0) + l.minutes);
    const who = displayName(l.user);
    const m = byPerson.get(who) ?? new Map<string, number>();
    m.set(act, (m.get(act) ?? 0) + l.minutes);
    byPerson.set(who, m);
  }
  const h = (min: number) => Math.round((min / 60) * 100) / 100;
  return {
    activities: TL_ACTIVITIES,
    total: h(logs.reduce((a, l) => a + l.minutes, 0)),
    guessedHours: h(unset),
    byActivity: TL_ACTIVITIES.map((a) => ({ activity: a, hours: h(byActivity.get(a) ?? 0) })),
    byPerson: [...byPerson.entries()].map(([person, m]) => ({ person, hours: Object.fromEntries(TL_ACTIVITIES.map((a) => [a, h(m.get(a) ?? 0)])) })),
  };
}

/**
 * dm5 G4 (C5): GIỜ THEO VAI / TUẦN (một người đóng 5 vai C1–C5). Mũ mỗi lần ghi = chọn tay (worklog.hat) > nhãn C1…C5 /
 * PM·BA·BE·FE·QA của thẻ > activity (+ nhãn FE / chữ UI trong tiêu đề). Cảnh báo theo `settings.roleAlert`
 * (QA < qaMinPct% tuần, tổng > maxWeekHours giờ/tuần — mặc định 15% / 30 h). `userId` lọc một người (mặc định cả dự án).
 */
export async function hoursByRole(userId: number, projectId: number, q: { from?: string; to?: string; userId?: number } = {}) {
  await requireProject(userId, projectId, 'project.view');
  const { g4SettingsOf, hatOf, roleWeekly } = await import('./dm5g4Rules.js');
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
  const range = {
    ...(q.from ? { gte: new Date(`${q.from}T00:00:00+07:00`) } : {}),
    ...(q.to ? { lt: new Date(new Date(`${q.to}T00:00:00+07:00`).getTime() + 86_400_000) } : {}),
  };
  const logs = await prisma.workWorklog.findMany({
    where: { issue: { projectId, deletedAt: null }, ...(q.from || q.to ? { startedAt: range } : {}), ...(q.userId ? { userId: q.userId } : {}) },
    take: 20_000,
    select: { minutes: true, startedAt: true, hat: true, activity: true, issue: { select: { title: true, type: { select: { key: true } }, labels: { select: { label: { select: { name: true } } } } } } },
  });
  let guessed = 0;
  const rows = logs.map((l) => {
    const r = hatOf({ hat: l.hat, activity: l.activity ?? activityOf(l.issue.title, l.issue.type.key), labels: l.issue.labels.map((x) => x.label.name), title: l.issue.title, typeKey: l.issue.type.key });
    if (r.source !== 'set') guessed += l.minutes;
    return { minutes: l.minutes, startedAt: l.startedAt, hat: r.hat };
  });
  return { ...roleWeekly(rows, g4SettingsOf(p.settings).roleAlert), guessedHours: Math.round((guessed / 60) * 100) / 100 };
}
