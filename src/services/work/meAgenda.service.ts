/**
 * CT Work — tổng hợp XUYÊN DỰ ÁN cho chính người gọi (18/10/2026, app iOS CT Work):
 *   - GET /work/me/agenda?from&to   — hạn thẻ của tôi, sprint, phát hành, giai đoạn, họp — MỌI dự án, một lượt gọi
 *     (trước đây app gọi /me/work + timeline/markers + meetings TỪNG dự án rồi tự gộp).
 *   - GET /work/me/timesheet?week=  — giờ tôi đã ghi trong tuần, mọi dự án (theo ngày VN).
 *
 * Phạm vi dự án = `visibleProjectIds` (như My work / lịch .ics): không gian chặn 2FA và dự án mà người này là khách cổng
 * bị loại; sprint/phát hành/giai đoạn chỉ của dự án họ THAM GIA (thành viên tường minh hoặc có thẻ được giao) — cùng
 * luật với lịch .ics (`calendar.service.ts`) để lịch không ngập sprint của nhóm khác. Họp: chỉ họp mời họ / họ tổ chức,
 * kể cả ở dự án họ là khách (khách thấy họp mời họ; đường dẫn vào cổng khách).
 */

import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { visibleProjectIds } from './myWork.service.js';
import { clientScopedProjectIds } from './permissions.js';
import { vnDay } from './sprints.service.js';
import { modulesOf } from './studio.js';

const DAY = 86_400_000;
const MAX_RANGE_DAYS = 120;

const dateOf = (ymd: string) => new Date(`${ymd}T00:00:00.000Z`);
/** Mốc 00:00 giờ VN của ngày `ymd` (UTC). */
const vnStart = (ymd: string) => new Date(Date.parse(`${ymd}T00:00:00.000Z`) - 7 * 3_600_000);
const addDays = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * DAY).toISOString().slice(0, 10);

type ProjectLite = { id: number; key: string; name: string; workspace: { slug: string } };
const PROJECT = { select: { id: true, key: true, name: true, workspace: { select: { slug: true } } } } as const;
const proj = (p: ProjectLite) => ({ id: p.id, key: p.key, name: p.name, workspaceSlug: p.workspace.slug });

async function involvedProjects(userId: number, projectIds: number[]): Promise<number[]> {
  if (!projectIds.length) return [];
  const [member, assigned] = await Promise.all([
    prisma.workProjectMember.findMany({ where: { userId, projectId: { in: projectIds } }, select: { projectId: true } }),
    prisma.workIssue.findMany({ where: { assigneeId: userId, projectId: { in: projectIds }, deletedAt: null }, distinct: ['projectId'], select: { projectId: true } }),
  ]);
  return [...new Set([...member, ...assigned].map((x) => x.projectId))];
}

export async function myAgenda(userId: number, q: { from?: string; to?: string }) {
  const from = q.from ?? vnDay();
  const to = q.to ?? addDays(from, 30);
  if (to < from) throw new BadRequestError('"to" must be on or after "from"', 'VALIDATION_ERROR');
  if ((Date.parse(to) - Date.parse(from)) / DAY > MAX_RANGE_DAYS) throw new BadRequestError(`Pick at most ${MAX_RANGE_DAYS} days`, 'VALIDATION_ERROR');
  const fromAt = vnStart(from);
  const toAt = vnStart(addDays(to, 1)); // hết ngày `to` theo giờ VN

  const projectIds = await visibleProjectIds(userId);
  const involved = await involvedProjects(userId, projectIds);
  const clientProjects = [...(await clientScopedProjectIds(userId))];
  const meetingPids = [...new Set([...projectIds, ...clientProjects])];

  const [issues, sprints, versions, stages, meetings] = await Promise.all([
    projectIds.length ? prisma.workIssue.findMany({
      where: { assigneeId: userId, projectId: { in: projectIds }, deletedAt: null, resolvedAt: null, type: { level: { not: 1 } }, dueDate: { gte: dateOf(from), lte: dateOf(to) } },
      orderBy: [{ dueDate: 'asc' }, { priority: 'asc' }], take: 500,
      select: { id: true, number: true, title: true, dueDate: true, priority: true, status: { select: { name: true, category: true } }, project: PROJECT },
    }) : [],
    involved.length ? prisma.workSprint.findMany({
      where: { projectId: { in: involved }, startAt: { not: null, lt: toAt }, endAt: { not: null, gte: fromAt } },
      orderBy: { startAt: 'asc' }, take: 300,
      select: { id: true, name: true, goal: true, state: true, startAt: true, endAt: true, completedAt: true, project: PROJECT },
    }) : [],
    involved.length ? prisma.workVersion.findMany({
      where: { projectId: { in: involved }, status: { not: 'ARCHIVED' }, releaseDate: { gte: dateOf(from), lte: dateOf(to) } },
      orderBy: { releaseDate: 'asc' }, take: 200,
      select: { id: true, name: true, status: true, releaseDate: true, project: PROJECT },
    }) : [],
    involved.length ? prisma.workStage.findMany({
      where: { projectId: { in: involved }, OR: [{ startedAt: { gte: fromAt, lt: toAt } }, { completedAt: { gte: fromAt, lt: toAt } }] },
      orderBy: [{ projectId: 'asc' }, { n: 'asc' }], take: 200,
      select: { id: true, n: true, name: true, status: true, startedAt: true, completedAt: true, project: { select: { ...PROJECT.select, settings: true } } },
    }) : [],
    meetingPids.length ? prisma.workMeeting.findMany({
      where: {
        projectId: { in: meetingPids }, deletedAt: null, startsAt: { gte: fromAt, lt: toAt },
        OR: [{ attendees: { some: { userId } } }, { organizerId: userId, projectId: { notIn: clientProjects.length ? clientProjects : [-1] } }],
      },
      orderBy: { startsAt: 'asc' }, take: 300,
      select: {
        id: true, number: true, title: true, type: true, status: true, startsAt: true, endsAt: true, timezone: true, location: true, meetingUrl: true,
        project: { select: { ...PROJECT.select, settings: true } },
        attendees: { where: { userId }, select: { rsvp: true } },
      },
    }) : [],
  ]);

  const items: Array<Record<string, unknown> & { type: string; date: string; sortAt: string }> = [];
  for (const i of issues) {
    const date = i.dueDate!.toISOString().slice(0, 10);
    items.push({
      type: 'due', date, sortAt: `${date}T00:00:00.000Z`, id: i.id, key: `${i.project.key}-${i.number}`, number: i.number, title: i.title, priority: i.priority,
      status: i.status, project: proj(i.project), url: `/work/${i.project.workspace.slug}/${i.project.key}/issue/${i.number}`,
    });
  }
  for (const s of sprints) {
    const date = vnDay(s.startAt!);
    items.push({
      type: 'sprint', date, end: vnDay(s.completedAt ?? s.endAt!), sortAt: s.startAt!.toISOString(), id: s.id, title: s.name, goal: s.goal, status: s.state,
      project: proj(s.project), url: `/work/${s.project.workspace.slug}/${s.project.key}/board`,
    });
  }
  for (const v of versions) {
    const date = v.releaseDate!.toISOString().slice(0, 10);
    items.push({ type: 'release', date, sortAt: `${date}T00:00:00.000Z`, id: v.id, title: v.name, status: v.status, project: proj(v.project), url: `/work/${v.project.workspace.slug}/${v.project.key}/releases` });
  }
  for (const s of stages) {
    if (!modulesOf(s.project.settings).stages) continue;
    const at = s.startedAt && s.startedAt >= fromAt && s.startedAt < toAt ? s.startedAt : s.completedAt!;
    items.push({
      type: 'stage', date: vnDay(at), sortAt: at.toISOString(), event: at === s.startedAt ? 'started' : 'completed', id: s.id, n: s.n, title: s.name, status: s.status,
      project: proj(s.project), url: `/work/${s.project.workspace.slug}/${s.project.key}/stages`,
    });
  }
  for (const m of meetings) {
    if (!modulesOf(m.project.settings).meetings) continue;
    const isClient = clientProjects.includes(m.project.id);
    items.push({
      type: 'meeting', date: vnDay(m.startsAt), sortAt: m.startsAt.toISOString(), id: m.id, number: m.number, title: m.title, meetingType: m.type, status: m.status,
      startsAt: m.startsAt, endsAt: m.endsAt, timezone: m.timezone, location: m.location, meetingUrl: m.meetingUrl, rsvp: m.attendees[0]?.rsvp ?? null,
      project: proj(m.project), client: isClient,
      url: isClient ? `/work/${m.project.workspace.slug}/${m.project.key}/portal?tab=meetings&meeting=${m.number}` : `/work/${m.project.workspace.slug}/${m.project.key}/meetings/${m.number}`,
    });
  }
  items.sort((a, b) => a.date.localeCompare(b.date) || a.sortAt.localeCompare(b.sortAt));
  return {
    from, to, timezone: 'Asia/Ho_Chi_Minh',
    items: items.map(({ sortAt: _s, ...rest }) => rest),
    counts: {
      due: issues.length, sprint: sprints.length, release: versions.length,
      stage: items.filter((i) => i.type === 'stage').length, meeting: items.filter((i) => i.type === 'meeting').length,
    },
  };
}

/** "YYYY-MM-DD" ⇒ thứ Hai của tuần (tuần ISO). */
function mondayOf(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  const dow = (d.getUTCDay() + 6) % 7;
  return new Date(d.getTime() - dow * DAY).toISOString().slice(0, 10);
}

export async function myTimesheet(userId: number, q: { week?: string }) {
  const weekStart = mondayOf(q.week ?? vnDay());
  const weekEnd = addDays(weekStart, 6);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  // Giờ đã ghi thì luôn là của mình — kể cả dự án đã lưu trữ/khách cổng? Không: chỉ dự án còn thấy (như My work).
  const projectIds = await visibleProjectIds(userId);
  const logs = projectIds.length ? await prisma.workWorklog.findMany({
    where: { userId, startedAt: { gte: vnStart(weekStart), lt: vnStart(addDays(weekEnd, 1)) }, issue: { projectId: { in: projectIds }, deletedAt: null } },
    orderBy: { startedAt: 'asc' }, take: 2000,
    select: { id: true, minutes: true, startedAt: true, note: true, source: true, activity: true, issue: { select: { id: true, number: true, title: true, project: PROJECT } } },
  }) : [];
  const touched = [...new Set(logs.map((l) => l.issue.project.id))];
  const sheets = touched.length ? await prisma.workTimesheet.findMany({
    where: { userId, projectId: { in: touched }, weekStart: dateOf(weekStart) }, select: { projectId: true, status: true },
  }) : [];
  const sheetOf = new Map(sheets.map((s) => [s.projectId, s.status]));

  type IssueRow = { key: string; number: number; title: string; totalMin: number; byDay: Record<string, number>; url: string };
  type ProjectRow = { project: ReturnType<typeof proj>; totalMin: number; byDay: Record<string, number>; timesheetStatus: string | null; issues: Map<number, IssueRow> };
  const byProject = new Map<number, ProjectRow>();
  const byDay = Object.fromEntries(days.map((d) => [d, 0])) as Record<string, number>;
  for (const l of logs) {
    const d = vnDay(l.startedAt);
    const p = l.issue.project;
    const row: ProjectRow = byProject.get(p.id) ?? { project: proj(p), totalMin: 0, byDay: {}, timesheetStatus: sheetOf.get(p.id) ?? null, issues: new Map() };
    row.totalMin += l.minutes;
    row.byDay[d] = (row.byDay[d] ?? 0) + l.minutes;
    const it: IssueRow = row.issues.get(l.issue.id) ?? { key: `${p.key}-${l.issue.number}`, number: l.issue.number, title: l.issue.title, totalMin: 0, byDay: {}, url: `/work/${p.workspace.slug}/${p.key}/issue/${l.issue.number}` };
    it.totalMin += l.minutes;
    it.byDay[d] = (it.byDay[d] ?? 0) + l.minutes;
    row.issues.set(l.issue.id, it);
    byProject.set(p.id, row);
    if (d in byDay) byDay[d] += l.minutes;
  }
  return {
    weekStart, weekEnd, days, timezone: 'Asia/Ho_Chi_Minh',
    totalMin: logs.reduce((s, l) => s + l.minutes, 0),
    byDay,
    projects: [...byProject.values()].map((r) => ({ ...r, issues: [...r.issues.values()] })),
    logs: logs.map((l) => ({
      id: l.id, minutes: l.minutes, startedAt: l.startedAt, day: vnDay(l.startedAt), note: l.note, source: l.source, activity: l.activity,
      issueKey: `${l.issue.project.key}-${l.issue.number}`, issueNumber: l.issue.number, issueTitle: l.issue.title, project: proj(l.issue.project),
    })),
  };
}
