/**
 * CT Work — ĐÓNG GÓP & HIỆU SUẤT THÀNH VIÊN (10/10/2026, gộp A26 + A27 + yêu cầu trưởng nhóm đồ án).
 *
 * Một lần đọc ⇒ mọi chỉ số: tải các bảng sự kiện của dự án trong KHOẢNG GỘP [kỳ trước ∪ kỳ này ∪ 182 ngày cho heatmap]
 * bằng ~15 truy vấn song song (mỗi truy vấn lọc theo dự án + thời gian, đi index sẵn có), rồi tính từng kỳ bằng JS
 * (`metricsFor`). Không có bảng chụp ngày: đo trên dự án ~400 thẻ dưới 1 giây (xem báo cáo gói), khi nào chậm mới cần.
 *
 * Luật công bằng (đọc kỹ trước khi thêm chỉ số):
 *   - Tính công theo NGƯỜI THẬT: thao tác của trợ lý AI (actorKind AI) / luật tự động / hệ thống không cộng cho ai.
 *     AI agent thành viên (users.kind AGENT) được tính RIÊNG, gắn nhãn agent, không gộp vào tổng của người.
 *   - "Hoàn thành" ghi cho NGƯỜI ĐANG ĐƯỢC GIAO thẻ lúc đọc (như báo cáo cũ) — tooltip nói rõ.
 *   - Tín hiệu cần chú ý có LÝ DO cụ thể (contribRules.attentionSignals), không có nhãn người.
 *   - Quyền: contribRules.contribAccess (ADMIN/TEACHER thấy tất; MEMBER chỉ mình + tổng nhóm; khách/agent không).
 */

import { prisma } from '../../config/database.js';
import { projectCached } from './projectCache.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { PUBLIC_USER, displayName, type PublicUser } from './common.js';
import { chatMessages, chatVoiceNotes, type ChatMessageRow } from './contribChat.js';
import {
  addDays, attentionSignals, contribAccess, dayDiff, dayKey, daysInclusive, identityResolver, isOverdue, lateDays, mean, median,
  pctChange, previousWindow, resolveWindow, round1, safeTz, silentDaysSince, startOfDay, streaks, weekStart, fold, FAIRNESS_NOTE, METRIC_DEFINITIONS,
  type ContribAccess, type ContribWindow, type RangePreset, type Signal,
} from './contribRules.js';
import type { ProjectRole } from './constants.js';
import { attendedForContrib } from './meetingRules.js';

/** CTW K-2: "đã dự họp" — điểm danh thật khi cuộc họp đã điểm danh, không thì ước lượng cũ (DONE + được mời). */
const didAttend = (m: { status: string; tracked: boolean; att: Record<number, string | null> }, userId: number) =>
  attendedForContrib({ status: m.status, tracked: m.tracked, attendance: m.att[userId] }).attended;
import { mentionedUserIds } from './notify.js';
import { agentForbidden, loadProjectAccess, type ProjectAccess } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { estimateOf, estimationOf, type EstimationMode } from './sprints.service.js';

const HOUR = 3_600_000;
const HEATMAP_DAYS = 182;
const MENTION_WINDOW_H = 48;

// ─── Cài đặt ─────────────────────────────────────────────────────

export interface ContribSettings {
  /** Cả nhóm (MEMBER) xem được bảng chi tiết từng người. Mặc định TẮT. */
  teamVisible: boolean;
  /** Múi giờ chia ngày. Mặc định giờ VN. */
  timezone: string;
  /** Ngưỡng "N ngày không hoạt động" để hiện tín hiệu. 2–30, mặc định 5. */
  silentDays: number;
}

export function contribSettingsOf(settings: unknown): ContribSettings {
  const s = (settings ?? {}) as Record<string, unknown>;
  const c = (s.contrib ?? {}) as Record<string, unknown>;
  const n = Number(c.silentDays);
  return {
    teamVisible: c.teamVisible === true,
    timezone: safeTz(c.timezone ?? s.timezone),
    silentDays: Number.isInteger(n) && n >= 2 && n <= 30 ? n : 5,
  };
}

interface Gate { access: ProjectAccess; ca: ContribAccess; settings: ContribSettings; project: { id: number; key: string; name: string; createdAt: Date; settings: unknown } }

/** Chốt quyền DUY NHẤT của mọi tuyến Đóng góp. Agent ⇒ 403 WORK_AGENT_FORBIDDEN; khách/GUEST ⇒ 403. */
export async function contribGate(userId: number, projectId: number): Promise<Gate> {
  const access = await loadProjectAccess(userId, projectId);
  if (!access) throw new NotFoundError('Project not found');
  if (access.principal === 'AGENT') throw await agentForbidden(userId, 'view contribution reports');
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { id: true, key: true, name: true, createdAt: true, settings: true } });
  const settings = contribSettingsOf(project.settings);
  const ca = contribAccess(access.role, access.workspaceRole, access.principal, { teamVisible: settings.teamVisible });
  if (!ca.view) throw new AppError('Contribution reports are only visible to the project team', 403, 'WORK_CONTRIB_FORBIDDEN');
  return { access, ca, settings, project };
}

export async function updateContribSettings(userId: number, projectId: number, patch: Partial<ContribSettings>): Promise<ContribSettings> {
  const g = await contribGate(userId, projectId);
  if (!g.ca.manage) throw new AppError('Only project admins can change contribution settings', 403, 'FORBIDDEN');
  const cur = g.settings;
  const next: ContribSettings = {
    teamVisible: patch.teamVisible ?? cur.teamVisible,
    timezone: patch.timezone !== undefined ? safeTz(patch.timezone) : cur.timezone,
    silentDays: patch.silentDays ?? cur.silentDays,
  };
  if (patch.timezone !== undefined && safeTz(patch.timezone) !== patch.timezone) throw new BadRequestError('Unknown time zone', 'WORK_BAD_TIMEZONE');
  // Ghi trong transaction đọc-lại: settings là JSON chung của dự án — không đè khoá của tính năng khác.
  await prisma.$transaction(async (tx) => {
    const p = await tx.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
    const s = { ...((p.settings ?? {}) as Record<string, unknown>), contrib: next };
    await tx.workProject.update({ where: { id: projectId }, data: { settings: s as object } });
  });
  return next;
}

// ─── Khoảng thời gian ────────────────────────────────────────────

export interface ContribQuery { preset?: RangePreset; from?: string; to?: string; sprintId?: number; stageId?: number; compare?: boolean }

async function windowsFor(projectId: number, q: ContribQuery, tz: string, now: Date, projectCreatedAt: Date): Promise<{ cur: ContribWindow; prev: ContribWindow | null }> {
  const preset: RangePreset = q.preset ?? '30d';
  const wrap = (fn: () => ContribWindow) => {
    try { return fn(); } catch (e) { throw new BadRequestError((e as Error).message, 'WORK_BAD_RANGE'); }
  };
  if (preset === 'sprint') {
    if (!q.sprintId) throw new BadRequestError('Pick a sprint', 'WORK_BAD_RANGE');
    const sprints = await prisma.workSprint.findMany({ where: { projectId, startAt: { not: null } }, orderBy: [{ startAt: 'asc' }, { id: 'asc' }], select: { id: true, name: true, startAt: true, completedAt: true, endAt: true, state: true } });
    const i = sprints.findIndex((s) => s.id === q.sprintId);
    if (i < 0) {
      if (await prisma.workSprint.count({ where: { id: q.sprintId, projectId } })) throw new BadRequestError('This sprint has not started yet', 'WORK_BAD_RANGE');
      throw new NotFoundError('Sprint not found');
    }
    const span = (s: (typeof sprints)[number]) => ({ start: s.startAt, end: s.completedAt ?? (s.state === 'CLOSED' ? s.endAt : null), name: s.name });
    const cur = wrap(() => resolveWindow({ preset, tz, now, span: span(sprints[i]) }));
    const prev = i > 0 ? wrap(() => resolveWindow({ preset, tz, now, span: span(sprints[i - 1]) })) : null;
    return { cur, prev: prev ? { ...prev, label: prev.label } : null };
  }
  if (preset === 'stage') {
    if (!q.stageId) throw new BadRequestError('Pick a stage', 'WORK_BAD_RANGE');
    const stages = await prisma.workStage.findMany({ where: { projectId }, orderBy: { n: 'asc' }, select: { id: true, n: true, name: true, startedAt: true, completedAt: true } });
    const i = stages.findIndex((s) => s.id === q.stageId);
    if (i < 0) throw new NotFoundError('Stage not found');
    const span = (s: (typeof stages)[number]) => ({ start: s.startedAt, end: s.completedAt, name: `${s.n}. ${s.name}` });
    const cur = wrap(() => resolveWindow({ preset, tz, now, span: span(stages[i]) }));
    const before = stages.slice(0, i).reverse().find((s) => s.startedAt);
    return { cur, prev: before ? wrap(() => resolveWindow({ preset, tz, now, span: span(before) })) : null };
  }
  if (preset === 'project') {
    return { cur: wrap(() => resolveWindow({ preset, tz, now, span: { start: projectCreatedAt, end: null, name: 'Whole project' } })), prev: null };
  }
  const cur = wrap(() => resolveWindow({ preset, tz, now, fromDay: q.from, toDay: q.to }));
  return { cur, prev: previousWindow(cur, tz) };
}

// ─── Tải dữ liệu thô của khoảng gộp ──────────────────────────────

type IssueLite = {
  id: number; number: number; title: string; assigneeId: number | null; reporterId: number | null; createdAt: Date; resolvedAt: Date | null;
  dueDate: Date | null; storyPoints: number | null; originalEstimateMin: number | null; statusId: number; sprintId: number | null;
  type: { level: number; key: string }; testCase: { id: number } | null;
};

interface Raw {
  tz: string;
  now: Date;
  today: string;
  mode: EstimationMode;
  span: { from: Date; to: Date };
  issues: IssueLite[];
  issueById: Map<number, IssueLite>;
  statusCat: Map<number, string>;
  /** statusId history của thẻ đã xong (cycle time). */
  statusHist: Map<number, Array<{ to: number; at: Date }>>;
  history: Array<{ actorId: number; issueId: number; field: string; at: Date }>;
  comments: Array<{ id: number; authorId: number; issueId: number; at: Date; mentions: number[]; text: string }>;
  voice: Array<{ userId: number; at: Date; source: 'comment' | 'chat' }>;
  worklogs: Array<{ userId: number; issueId: number; minutes: number; activity: string | null; startedAt: Date; createdAt: Date }>;
  pageVersions: Array<{ authorId: number; pageId: number; pageNumber: number; title: string; kind: string; at: Date }>;
  runs: Array<{ id: number; userId: number; status: string; at: Date; issueId: number }>;
  defects: Array<{ userId: number; issueId: number; at: Date }>;
  steps: Array<{ userId: number; decision: string; at: Date; approvalId: number; title: string; issueId: number | null }>;
  approvalsCreated: Array<{ userId: number; at: Date; title: string; issueId: number | null }>;
  dev: Array<{ userId: number | null; kind: string; title: string; url: string | null; additions: number | null; deletions: number | null; at: Date; issueNumbers: number[]; login: string | null; name: string | null; email: string | null; state: string | null }>;
  /** CTW K-2: `tracked` = cuộc họp đã điểm danh thật ⇒ "đã dự" theo `att`; chưa ⇒ ước lượng cũ (DONE + được mời). */
  meetings: Array<{ id: number; number: number; title: string; status: string; startsAt: Date; people: number[]; tracked: boolean; att: Record<number, string | null> }>;
  chat: ChatMessageRow[] | null;
  fpt: Array<{ userId: number; kind: 'UTC_CREATED' | 'UTC_RUN' | 'IT_RUN'; at: Date }>;
  /** userId ⇒ ngày ⇒ số hành động (heatmap, chuỗi ngày, sparkline). */
  daily: Map<number, Map<string, number>>;
  /** UX-B: ngày tạo dự án + ngày từng người vào dự án (mốc sàn của "N days without activity"). */
  projectCreatedDay: string | null;
  joinedDay: Map<number, string>;
}

/**
 * Đợt 6 (D3): thẻ của dự án bằng SQL thô + bảng loại thẻ — giữ NGUYÊN hình dạng cũ (`type: {level, key}`, `testCase`)
 * nhưng bỏ hai truy vấn con kèm 10k tham số của Prisma (10k thẻ: ~125 ms ⇒ ~35 ms).
 */
async function contribIssues(projectId: number) {
  type R = { id: number; number: number; title: string; assigneeId: number | null; reporterId: number | null; createdAt: Date; resolvedAt: Date | null; dueDate: Date | null; storyPoints: number | null; originalEstimateMin: number | null; statusId: number; sprintId: number | null; typeId: number; testCaseId: number | null };
  const [rows, types] = await Promise.all([
    prisma.$queryRaw<R[]>`
      SELECT i.id, i.number, i.title, i.assignee_id AS "assigneeId", i.reporter_id AS "reporterId", i.created_at AS "createdAt", i.resolved_at AS "resolvedAt",
             i.due_date AS "dueDate", i.story_points AS "storyPoints", i.original_estimate_min AS "originalEstimateMin", i.status_id AS "statusId",
             i.sprint_id AS "sprintId", i.type_id AS "typeId", c.id AS "testCaseId"
      FROM work_issues i LEFT JOIN work_test_cases c ON c.issue_id = i.id
      WHERE i.project_id = ${projectId} AND i.deleted_at IS NULL`,
    prisma.workIssueType.findMany({ where: { projectId }, select: { id: true, level: true, key: true } }),
  ]);
  const typeOf = new Map(types.map((t) => [t.id, { level: t.level, key: t.key }]));
  return rows.map(({ typeId, testCaseId, ...r }) => ({ ...r, type: typeOf.get(typeId) ?? { level: 0, key: 'TASK' }, testCase: testCaseId ? { id: testCaseId } : null }));
}

async function loadRaw(projectId: number, people: Array<PublicUser & { email?: string | null }>, spanFrom: Date, spanTo: Date, tz: string, now: Date): Promise<Raw> {
  const mode = await estimationOf(projectId);
  const inSpan = { gte: spanFrom, lte: spanTo };
  const [issues, statuses, history, comments, voice, worklogs, pageVersions, runs, defects, steps, approvals, contribs, devActs, meetings, chat, chatVoice, units, its, identities, emails] = await Promise.all([
    contribIssues(projectId),
    prisma.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true, category: true } }),
    // Đợt 6 (D3): SQL thô (JOIN thay cho IN (SELECT…) + giải mã Prisma) — 28k dòng: ~88 ms ⇒ ~30 ms.
    prisma.$queryRaw<Array<{ actorId: number | null; issueId: number; field: string; createdAt: Date }>>`
      SELECT h.actor_id AS "actorId", h.issue_id AS "issueId", h.field, h.created_at AS "createdAt"
      FROM work_history h JOIN work_issues i ON i.id = h.issue_id
      WHERE i.project_id = ${projectId} AND i.deleted_at IS NULL AND h.actor_kind IN ('USER', 'AGENT') AND h.actor_id IS NOT NULL
        AND h.created_at >= ${spanFrom} AND h.created_at <= ${spanTo}`,
    prisma.workComment.findMany({
      where: { issue: { projectId, deletedAt: null }, isAi: false, deletedAt: null, authorId: { not: null }, createdAt: inSpan },
      select: { id: true, authorId: true, issueId: true, createdAt: true, bodyJson: true, bodyText: true },
    }),
    prisma.workVoiceNote.findMany({
      where: { createdAt: inSpan, attachment: { issue: { projectId }, uploaderId: { not: null }, commentId: { not: null } } },
      select: { createdAt: true, attachment: { select: { uploaderId: true } } },
    }),
    prisma.workWorklog.findMany({
      where: { issue: { projectId }, OR: [{ startedAt: inSpan }, { createdAt: inSpan }] },
      select: { userId: true, issueId: true, minutes: true, activity: true, startedAt: true, createdAt: true },
    }),
    prisma.workPageVersion.findMany({
      where: { page: { projectId, deletedAt: null }, authorId: { not: null }, createdAt: inSpan },
      select: { authorId: true, pageId: true, kind: true, createdAt: true, page: { select: { number: true, title: true } } },
    }),
    prisma.workTestRun.findMany({
      where: { cycle: { projectId }, executedById: { not: null }, executedAt: inSpan, status: { in: ['PASS', 'FAIL', 'BLOCKED'] } },
      select: { id: true, executedById: true, status: true, executedAt: true, testCase: { select: { issueId: true } } },
    }),
    prisma.workTestRunDefect.findMany({
      where: { run: { cycle: { projectId } }, createdAt: inSpan },
      select: { createdAt: true, issueId: true, run: { select: { executedById: true, assigneeId: true } } },
    }),
    prisma.workApprovalStep.findMany({
      where: { approval: { projectId }, decision: { in: ['APPROVED', 'REJECTED'] }, decidedAt: inSpan },
      select: { approverId: true, decision: true, decidedAt: true, approvalId: true, approval: { select: { title: true, issueId: true } } },
    }),
    prisma.workApproval.findMany({
      where: { projectId, createdById: { not: null }, createdAt: inSpan },
      select: { createdById: true, createdAt: true, title: true, issueId: true },
    }),
    prisma.workDevContribution.findMany({
      where: { projectId, occurredAt: inSpan },
      select: { kind: true, externalId: true, title: true, url: true, state: true, authorLogin: true, authorName: true, authorEmail: true, additions: true, deletions: true, occurredAt: true, issueNumbers: true },
    }),
    // Commit/PR cũ (trước khi có bảng trên) — chỉ commit nhắc mã thẻ, tác giả là một chuỗi.
    prisma.workDevActivity.findMany({
      where: { projectId, kind: { in: ['COMMIT', 'PR'] }, createdAt: inSpan },
      select: { kind: true, externalId: true, title: true, url: true, state: true, author: true, createdAt: true, issue: { select: { number: true } } },
    }),
    prisma.workMeeting.findMany({
      where: { projectId, deletedAt: null, status: { not: 'CANCELLED' }, startsAt: inSpan },
      select: { id: true, number: true, title: true, status: true, startsAt: true, organizerId: true, attendees: { select: { userId: true, attendance: true } } },
    }),
    chatMessages(projectId, spanFrom, spanTo),
    chatVoiceNotes(projectId, spanFrom, spanTo),
    prisma.workUnitFunction.findMany({
      where: { projectId },
      select: { createdBy: true, executedBy: true, createdAt: true, cases: { select: { result: true, executedAt: true } } },
    }),
    prisma.workItModule.findMany({ where: { projectId }, select: { cases: { select: { rounds: true } } } }),
    prisma.workGitIdentity.findMany({ where: { projectId }, select: { identity: true, userId: true } }),
    prisma.user.findMany({ where: { id: { in: people.map((p) => p.id) } }, select: { id: true, email: true } }),
  ]);

  const today = dayKey(now, tz);
  const issueById = new Map(issues.map((i) => [i.id, i]));
  const statusCat = new Map(statuses.map((s) => [s.id, s.category]));

  // Cycle time: cần lịch sử trạng thái của thẻ đã xong trong khoảng gộp (kể cả đổi trạng thái TRƯỚC khoảng).
  const doneIds = issues.filter((i) => i.resolvedAt && i.resolvedAt >= spanFrom && i.resolvedAt <= spanTo).map((i) => i.id);
  const sh = doneIds.length
    ? await prisma.$queryRaw<Array<{ issueId: number; toValue: string | null; createdAt: Date }>>`SELECT issue_id AS "issueId", to_value AS "toValue", created_at AS "createdAt" FROM work_history WHERE issue_id = ANY(${doneIds}::int[]) AND field = 'statusId' ORDER BY created_at ASC` // đợt 6 (D3): một tham số mảng thay 3k+ tham số IN
    : [];
  const statusHist = new Map<number, Array<{ to: number; at: Date }>>();
  for (const h of sh) {
    const arr = statusHist.get(h.issueId) ?? [];
    arr.push({ to: Number(h.toValue), at: h.createdAt });
    statusHist.set(h.issueId, arr);
  }

  const emailOf = new Map(emails.map((e) => [e.id, e.email]));
  const resolve = identityResolver(
    people.map((p) => ({ id: p.id, username: p.username, email: emailOf.get(p.id) ?? null, fullName: p.fullName, displayName: p.displayName })),
    new Map(identities.map((x) => [x.identity, x.userId])),
  );
  const seen = new Set<string>();
  const dev: Raw['dev'] = [];
  for (const c of contribs) {
    seen.add(`${c.kind}:${c.externalId}`);
    dev.push({ userId: resolve({ login: c.authorLogin, email: c.authorEmail, name: c.authorName }), kind: c.kind, title: c.title ?? '', url: c.url, additions: c.additions, deletions: c.deletions, at: c.occurredAt, issueNumbers: c.issueNumbers, login: c.authorLogin, name: c.authorName, email: c.authorEmail, state: c.state });
  }
  // Một commit nhắc 2 thẻ = 2 dòng work_dev_activity ⇒ gộp theo mã, chỉ đếm một lần.
  const legacy = new Map<string, Raw['dev'][number]>();
  for (const a of devActs) {
    const k = `${a.kind}:${a.externalId}`;
    if (seen.has(k)) continue;
    const prev = legacy.get(k);
    if (prev) { prev.issueNumbers.push(a.issue.number); continue; }
    legacy.set(k, { userId: resolve({ login: a.author, name: a.author }), kind: a.kind, title: a.title, url: a.url, additions: null, deletions: null, at: a.createdAt, issueNumbers: [a.issue.number], login: a.author, name: null, email: null, state: a.state });
  }
  dev.push(...legacy.values());

  // Mẫu FPT 5.1/5.2/5.3 ghi người tạo/chạy bằng CHỮ ⇒ khớp tên người (username / tên hiển thị / họ tên, bỏ dấu).
  const byName = identityResolver(people.map((p) => ({ id: p.id, username: p.username, fullName: p.fullName, displayName: p.displayName })), new Map());
  const who = (s: string | null | undefined) => (s && s.trim() ? byName({ login: s, name: s }) : null);
  const fpt: Raw['fpt'] = [];
  for (const f of units) {
    const c = who(f.createdBy);
    if (c && f.createdAt >= spanFrom && f.createdAt <= spanTo) for (let k = 0; k < f.cases.length; k++) fpt.push({ userId: c, kind: 'UTC_CREATED', at: f.createdAt });
    const e = who(f.executedBy);
    if (e) for (const cs of f.cases) if (cs.result && cs.executedAt) { const at = startOfDay(cs.executedAt.toISOString().slice(0, 10), tz); if (at >= spanFrom && at <= spanTo) fpt.push({ userId: e, kind: 'UTC_RUN', at }); }
  }
  for (const m of its) for (const cs of m.cases) {
    for (const r of Array.isArray(cs.rounds) ? (cs.rounds as Array<Record<string, unknown>>) : []) {
      const st = String(r?.status ?? '');
      if (st !== 'Passed' && st !== 'Failed') continue;
      const u = who(typeof r.tester === 'string' ? r.tester : null);
      const d = typeof r.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.date) ? startOfDay(r.date, tz) : null;
      if (u && d && d >= spanFrom && d <= spanTo) fpt.push({ userId: u, kind: 'IT_RUN', at: d });
    }
  }

  const raw: Raw = {
    tz, now, today, mode, span: { from: spanFrom, to: spanTo }, issues, issueById, statusCat, statusHist,
    history: history.map((h) => ({ actorId: h.actorId!, issueId: h.issueId, field: h.field, at: h.createdAt })),
    comments: comments.map((c) => ({ id: c.id, authorId: c.authorId!, issueId: c.issueId, at: c.createdAt, mentions: mentionedUserIds(c.bodyJson).filter((u) => u !== c.authorId), text: c.bodyText })),
    voice: [
      ...voice.map((v) => ({ userId: v.attachment.uploaderId!, at: v.createdAt, source: 'comment' as const })),
      ...chatVoice.map((v) => ({ userId: v.uploaderId, at: v.createdAt, source: 'chat' as const })),
    ],
    worklogs: worklogs.map((w) => ({ userId: w.userId, issueId: w.issueId, minutes: w.minutes, activity: w.activity, startedAt: w.startedAt, createdAt: w.createdAt })),
    pageVersions: pageVersions.map((v) => ({ authorId: v.authorId!, pageId: v.pageId, pageNumber: v.page.number, title: v.page.title, kind: v.kind, at: v.createdAt })),
    runs: runs.map((r) => ({ id: r.id, userId: r.executedById!, status: r.status, at: r.executedAt!, issueId: r.testCase.issueId })),
    defects: defects.flatMap((d) => { const u = d.run.executedById ?? d.run.assigneeId; return u ? [{ userId: u, issueId: d.issueId, at: d.createdAt }] : []; }),
    steps: steps.map((s) => ({ userId: s.approverId, decision: s.decision, at: s.decidedAt!, approvalId: s.approvalId, title: s.approval.title, issueId: s.approval.issueId })),
    approvalsCreated: approvals.map((a) => ({ userId: a.createdById!, at: a.createdAt, title: a.title, issueId: a.issueId })),
    dev,
    meetings: meetings.map((m) => ({ id: m.id, number: m.number, title: m.title, status: m.status, startsAt: m.startsAt, people: [...new Set([...m.attendees.map((a) => a.userId), ...(m.organizerId ? [m.organizerId] : [])])], tracked: m.attendees.some((a) => a.attendance), att: Object.fromEntries(m.attendees.map((a) => [a.userId, a.attendance])) })),
    chat,
    fpt,
    daily: new Map(),
    projectCreatedDay: null,
    joinedDay: new Map(),
  };

  // UX-B: mốc sàn của số ngày im lặng — ngày vào dự án (thành viên dự án, không có thì thành viên không gian).
  const proj = await prisma.workProject.findUnique({ where: { id: projectId }, select: { createdAt: true, workspaceId: true } });
  if (proj) {
    raw.projectCreatedDay = dayKey(proj.createdAt, tz);
    const ids = people.map((p) => p.id);
    const [pm, wm] = await Promise.all([
      prisma.workProjectMember.findMany({ where: { projectId, userId: { in: ids } }, select: { userId: true, createdAt: true } }),
      prisma.workMember.findMany({ where: { workspaceId: proj.workspaceId, userId: { in: ids } }, select: { userId: true, joinedAt: true } }),
    ]);
    for (const m of wm) raw.joinedDay.set(m.userId, dayKey(m.joinedAt, tz));
    for (const m of pm) raw.joinedDay.set(m.userId, dayKey(m.createdAt, tz));
  }

  // Hành động theo ngày: mọi thứ người đó TỰ làm (không tính được mời họp).
  const bump = (u: number | null | undefined, at: Date) => {
    if (!u) return;
    let m = raw.daily.get(u);
    if (!m) { m = new Map(); raw.daily.set(u, m); }
    const d = dayKey(at, tz);
    m.set(d, (m.get(d) ?? 0) + 1);
  };
  for (const h of raw.history) bump(h.actorId, h.at);
  for (const c of raw.comments) bump(c.authorId, c.at);
  for (const w of raw.worklogs) if (w.createdAt >= spanFrom) bump(w.userId, w.createdAt);
  for (const v of raw.pageVersions) bump(v.authorId, v.at);
  for (const r of raw.runs) bump(r.userId, r.at);
  for (const s of raw.steps) bump(s.userId, s.at);
  for (const d of raw.dev) bump(d.userId, d.at);
  for (const m of raw.chat ?? []) bump(m.authorId, m.createdAt);
  return raw;
}

// ─── Chỉ số một kỳ ───────────────────────────────────────────────

export interface MemberMetrics {
  assigned: number; completed: number; subtasksDone: number; points: number;
  withDue: number; onTime: number; late: number; onTimeRate: number | null; avgLateDays: number | null; overdueOpen: number;
  cycleDays: number | null; leadDays: number | null; cycleMedianDays: number | null;
  hours: number; hoursByActivity: Record<string, number>; hoursThisWeek: number;
  comments: number; voiceNotes: number; chatMessages: number | null; updates: number;
  mentions: number; mentionsAnswered: number; mentionsUnanswered: number; responseHours: number | null;
  reviewsDone: number; reviewRequests: number;
  commits: number; prs: number; additions: number | null; deletions: number | null;
  docVersions: number; pagesCreated: number; pagesEdited: number;
  testCasesCreated: number; testRuns: number; defectsFound: number; bugsReported: number; utcidCreated: number; utcidExecuted: number; itExecuted: number;
  meetingsInvited: number; meetingsAttended: number;
  actions: number; activeDays: number; currentStreak: number; longestStreak: number; longestSilence: number;
  /** Ngày không hoạt động liên tiếp tới HÔM NAY (null khi khoảng không chứa hôm nay). */
  silentNow: number | null;
  lastActiveDay: string | null;
}

const inW = (at: Date | null | undefined, w: { from: Date; to: Date }) => !!at && at >= w.from && at <= w.to;

/** Mọi chỉ số của MỘT kỳ cho các người `ids` — tính thuần từ dữ liệu thô đã tải. */
function metricsFor(raw: Raw, w: ContribWindow, ids: number[]): Map<number, MemberMetrics> {
  const out = new Map<number, MemberMetrics>();
  const work = raw.issues.filter((i) => i.type.level !== 1 && !i.testCase);
  const weekFrom = startOfDay(weekStart(raw.today), raw.tz);
  const mentionDeadline = new Date(raw.now.getTime() - MENTION_WINDOW_H * HOUR);

  // Hành động của từng người theo thẻ / kênh (đo phản hồi khi được @nhắc).
  const actsOnIssue = new Map<string, Date[]>();
  const pushAct = (k: string, at: Date) => { const a = actsOnIssue.get(k); if (a) a.push(at); else actsOnIssue.set(k, [at]); };
  for (const c of raw.comments) pushAct(`${c.authorId}:i${c.issueId}`, c.at);
  for (const h of raw.history) pushAct(`${h.actorId}:i${h.issueId}`, h.at);
  for (const m of raw.chat ?? []) pushAct(`${m.authorId}:c${m.channelId}`, m.createdAt);
  const mentionEvents: Array<{ to: number; at: Date; key: string }> = [];
  for (const c of raw.comments) if (inW(c.at, w)) for (const u of c.mentions) mentionEvents.push({ to: u, at: c.at, key: `${u}:i${c.issueId}` });
  for (const m of raw.chat ?? []) if (inW(m.createdAt, w)) for (const u of m.mentions) if (u !== m.authorId) mentionEvents.push({ to: u, at: m.createdAt, key: `${u}:c${m.channelId}` });

  const testCaseIds = new Set(raw.issues.filter((i) => i.testCase).map((i) => i.id));
  for (const id of ids) {
    const mine = work.filter((i) => i.assigneeId === id);
    const assigned = mine.filter((i) => i.createdAt <= w.to && (!i.resolvedAt || i.resolvedAt >= w.from));
    const done = mine.filter((i) => inW(i.resolvedAt, w));
    const lvl0 = done.filter((i) => i.type.level === 0);
    const dated = done.filter((i) => i.dueDate);
    const lates = dated.map((i) => lateDays(i.resolvedAt!, i.dueDate!, raw.tz));
    const late = lates.filter((d) => d > 0);
    const cycles: number[] = [];
    const leads: number[] = [];
    for (const i of done) {
      leads.push((i.resolvedAt!.getTime() - i.createdAt.getTime()) / (24 * HOUR));
      const firstWip = raw.statusHist.get(i.id)?.find((h) => raw.statusCat.get(h.to) === 'IN_PROGRESS');
      if (firstWip && firstWip.at <= i.resolvedAt!) cycles.push((i.resolvedAt!.getTime() - firstWip.at.getTime()) / (24 * HOUR));
    }

    const logs = raw.worklogs.filter((l) => l.userId === id);
    const byAct: Record<string, number> = {};
    let minutes = 0;
    for (const l of logs) if (inW(l.startedAt, w)) { minutes += l.minutes; const k = l.activity ?? 'Unspecified'; byAct[k] = round1((byAct[k] ?? 0) + l.minutes / 60); }
    const weekMin = logs.filter((l) => l.startedAt >= weekFrom && l.startedAt <= raw.now).reduce((s, l) => s + l.minutes, 0);

    const ments = mentionEvents.filter((m) => m.to === id);
    let answered = 0, unanswered = 0;
    const resp: number[] = [];
    for (const m of ments) {
      const acts = actsOnIssue.get(m.key) ?? [];
      let best: number | null = null;
      for (const t of acts) { const h = (t.getTime() - m.at.getTime()) / HOUR; if (h > 0 && h <= MENTION_WINDOW_H && (best === null || h < best)) best = h; }
      if (best !== null) { answered += 1; resp.push(best); } else if (m.at <= mentionDeadline) unanswered += 1;
    }

    const devMine = raw.dev.filter((d) => d.userId === id && inW(d.at, w));
    const withLoc = devMine.filter((d) => d.additions !== null);
    const pv = raw.pageVersions.filter((v) => v.authorId === id && inW(v.at, w));
    const fptMine = raw.fpt.filter((f) => f.userId === id && inW(f.at, w));
    const meets = raw.meetings.filter((m) => inW(m.startsAt, w) && m.people.includes(id));
    const hist = raw.history.filter((h) => h.actorId === id && inW(h.at, w));
    const chatMine = raw.chat ? raw.chat.filter((m) => m.authorId === id && inW(m.createdAt, w)).length : null;

    const daily = raw.daily.get(id) ?? new Map<string, number>();
    const activeSet = new Set([...daily.keys()].filter((d) => d >= w.fromDay && d <= w.toDay));
    const st = streaks(activeSet, w.fromDay, w.toDay);
    const allDays = [...daily.keys()].filter((d) => d <= raw.today).sort();
    const lastActiveDay = allDays.length ? allDays[allDays.length - 1] : null;
    let actions = 0;
    for (const [d, n] of daily) if (d >= w.fromDay && d <= w.toDay) actions += n;

    out.set(id, {
      assigned: assigned.length,
      completed: lvl0.length,
      subtasksDone: done.length - lvl0.length,
      points: round1(lvl0.reduce((s, i) => s + estimateOf(i, raw.mode), 0)),
      withDue: dated.length,
      onTime: dated.length - late.length,
      late: late.length,
      onTimeRate: dated.length ? Math.round(((dated.length - late.length) / dated.length) * 100) : null,
      avgLateDays: late.length ? round1(mean(late)!) : null,
      overdueOpen: mine.filter((i) => !i.resolvedAt && isOverdue(i.dueDate, raw.today)).length,
      cycleDays: cycles.length ? round1(mean(cycles)!) : null,
      cycleMedianDays: cycles.length ? round1(median(cycles)!) : null,
      leadDays: leads.length ? round1(mean(leads)!) : null,
      hours: round1(minutes / 60),
      hoursByActivity: byAct,
      hoursThisWeek: round1(weekMin / 60),
      comments: raw.comments.filter((c) => c.authorId === id && inW(c.at, w)).length,
      voiceNotes: raw.voice.filter((v) => v.userId === id && inW(v.at, w)).length,
      chatMessages: chatMine,
      updates: hist.filter((h) => h.field !== 'created').length,
      mentions: ments.length,
      mentionsAnswered: answered,
      mentionsUnanswered: unanswered,
      responseHours: resp.length ? round1(median(resp)!) : null,
      reviewsDone: raw.steps.filter((s) => s.userId === id && inW(s.at, w)).length,
      reviewRequests: raw.approvalsCreated.filter((a) => a.userId === id && inW(a.at, w)).length,
      commits: devMine.filter((d) => d.kind === 'COMMIT').length,
      prs: devMine.filter((d) => d.kind === 'PR').length,
      additions: withLoc.length ? withLoc.reduce((s, d) => s + (d.additions ?? 0), 0) : null,
      deletions: withLoc.length ? withLoc.reduce((s, d) => s + (d.deletions ?? 0), 0) : null,
      docVersions: pv.length,
      pagesCreated: pv.filter((v) => v.kind === 'CREATE').length,
      pagesEdited: new Set(pv.map((v) => v.pageId)).size,
      testCasesCreated: hist.filter((h) => h.field === 'created' && testCaseIds.has(h.issueId)).length,
      testRuns: raw.runs.filter((r) => r.userId === id && inW(r.at, w)).length,
      defectsFound: new Set(raw.defects.filter((d) => d.userId === id && inW(d.at, w)).map((d) => d.issueId)).size,
      bugsReported: raw.issues.filter((i) => i.reporterId === id && i.type.key === 'BUG' && inW(i.createdAt, w)).length,
      utcidCreated: fptMine.filter((f) => f.kind === 'UTC_CREATED').length,
      utcidExecuted: fptMine.filter((f) => f.kind === 'UTC_RUN').length,
      itExecuted: fptMine.filter((f) => f.kind === 'IT_RUN').length,
      meetingsInvited: meets.length,
      meetingsAttended: meets.filter((m) => didAttend(m, id)).length,
      actions,
      activeDays: st.activeDays,
      currentStreak: st.currentStreak,
      longestStreak: st.longestStreak,
      longestSilence: st.longestSilence,
      silentNow: w.includesToday ? silentDaysSince({ today: raw.today, lastActiveDay, floors: [raw.joinedDay.get(id), raw.projectCreatedDay, w.fromDay] }) : null,
      lastActiveDay,
    });
  }
  return out;
}

// ─── Người tham gia ──────────────────────────────────────────────

export interface ContribPerson extends PublicUser { role: ProjectRole; isAgent: boolean }

/** Người được đo: ADMIN + MEMBER (+ VIEWER nếu có hoạt động) — giảng viên/khách không phải người làm đồ án. */
async function peopleOf(projectId: number): Promise<ContribPerson[]> {
  const all = await projectMembers(projectId);
  return all.filter((m) => m.role === 'ADMIN' || m.role === 'MEMBER' || m.role === 'VIEWER').map((m) => ({
    id: m.id, username: m.username, fullName: m.fullName, displayName: m.displayName, avatarUrl: m.avatarUrl, kind: m.kind, role: m.role, isAgent: m.kind === 'AGENT',
  }));
}

// ─── Tóm tắt dự án ───────────────────────────────────────────────

type Bucket = 'day' | 'week';
function buckets(w: ContribWindow): { kind: Bucket; keys: string[] } {
  const days = daysInclusive(w.fromDay, w.toDay);
  if (days.length <= 35) return { kind: 'day', keys: days };
  const keys = [...new Set(days.map(weekStart))];
  return { kind: 'week', keys };
}

function series(daily: Map<string, number> | undefined, b: { kind: Bucket; keys: string[] }, fromDay: string, toDay: string): number[] {
  const idx = new Map(b.keys.map((k, i) => [k, i]));
  const out = b.keys.map(() => 0);
  for (const [d, n] of daily ?? []) {
    if (d < fromDay || d > toDay) continue;
    const i = idx.get(b.kind === 'day' ? d : weekStart(d));
    if (i !== undefined) out[i] += n;
  }
  return out;
}

const DELTA_KEYS = ['completed', 'points', 'onTimeRate', 'hours', 'comments', 'commits', 'docVersions', 'testRuns', 'actions', 'activeDays', 'reviewsDone'] as const;
type DeltaKey = (typeof DELTA_KEYS)[number];

function deltas(cur: MemberMetrics, prev: MemberMetrics | undefined): Partial<Record<DeltaKey, number | null>> {
  if (!prev) return {};
  const out: Partial<Record<DeltaKey, number | null>> = {};
  for (const k of DELTA_KEYS) out[k] = pctChange(cur[k] as number | null, prev[k] as number | null);
  return out;
}

function sumMetrics(list: MemberMetrics[]) {
  const s = (k: keyof MemberMetrics) => list.reduce((a, m) => a + (Number(m[k]) || 0), 0);
  const withDue = s('withDue');
  const cyc = list.map((m) => m.cycleDays).filter((x): x is number => x !== null);
  const resp = list.map((m) => m.responseHours).filter((x): x is number => x !== null);
  const anyChat = list.some((m) => m.chatMessages !== null);
  const loc = list.filter((m) => m.additions !== null);
  return {
    people: list.length,
    assigned: s('assigned'), completed: s('completed'), subtasksDone: s('subtasksDone'), points: round1(s('points')),
    withDue, onTime: s('onTime'), onTimeRate: withDue ? Math.round((s('onTime') / withDue) * 100) : null, overdueOpen: s('overdueOpen'),
    cycleDays: cyc.length ? round1(mean(cyc)!) : null,
    hours: round1(s('hours')), comments: s('comments'), voiceNotes: s('voiceNotes'), chatMessages: anyChat ? s('chatMessages') : null,
    mentions: s('mentions'), mentionsAnswered: s('mentionsAnswered'), responseHours: resp.length ? round1(median(resp)!) : null,
    reviewsDone: s('reviewsDone'), reviewRequests: s('reviewRequests'),
    commits: s('commits'), prs: s('prs'), additions: loc.length ? s('additions') : null, deletions: loc.length ? s('deletions') : null,
    docVersions: s('docVersions'), pagesEdited: s('pagesEdited'),
    testCasesCreated: s('testCasesCreated'), testRuns: s('testRuns'), defectsFound: s('defectsFound'), bugsReported: s('bugsReported'),
    utcidCreated: s('utcidCreated'), utcidExecuted: s('utcidExecuted'), itExecuted: s('itExecuted'),
    meetingsInvited: s('meetingsInvited'), meetingsAttended: s('meetingsAttended'),
    actions: s('actions'), activeDaysAvg: list.length ? round1(s('activeDays') / list.length) : 0,
  };
}
export type TeamTotals = ReturnType<typeof sumMetrics>;

export interface MemberRow {
  user: ContribPerson;
  metrics: MemberMetrics;
  prev: MemberMetrics | null;
  delta: Partial<Record<DeltaKey, number | null>>;
  spark: number[];
  signals: Signal[];
  /** attention = có tín hiệu cảnh báo · watch = chỉ tín hiệu thông tin · ok = không có gì · idle = không có việc + không hoạt động. */
  status: 'attention' | 'watch' | 'ok' | 'idle';
  /** Việc được giao trong kỳ theo nhóm trạng thái HIỆN TẠI (cột chồng). */
  mix: { todo: number; inProgress: number; done: number; overdue: number };
}

function statusOf(m: MemberMetrics, sig: Signal[]): MemberRow['status'] {
  if (sig.some((s) => s.level === 'warn')) return 'attention';
  if (sig.length) return 'watch';
  if (!m.assigned && !m.actions) return 'idle';
  return 'ok';
}

export async function summary(userId: number, projectId: number, q: ContribQuery) {
  const t0 = Date.now();
  const g = await contribGate(userId, projectId);
  const tz = g.settings.timezone;
  const now = new Date();
  const { cur, prev } = await windowsFor(projectId, q, tz, now, g.project.createdAt);
  const comparePrev = q.compare !== false ? prev : null;
  const people = await peopleOf(projectId);
  const heatFrom = startOfDay(addDays(cur.toDay, -(HEATMAP_DAYS - 1)), tz);
  const spanFrom = new Date(Math.min(cur.from.getTime(), heatFrom.getTime(), comparePrev?.from.getTime() ?? Infinity));
  const spanTo = new Date(Math.min(now.getTime(), cur.to.getTime() + MENTION_WINDOW_H * HOUR));
  // Đợt 6 (D3): dữ liệu thô không phụ thuộc người xem ⇒ đệm ngắn theo dự án (khoá làm tròn phút; xoá khi dự án đổi).
  const minute = (d: Date) => Math.floor(d.getTime() / 60_000);
  const raw = await projectCached(projectId, `contribRaw:${minute(spanFrom)}:${minute(spanTo)}:${tz}:${people.map((p) => p.id).join(',')}`, () => loadRaw(projectId, people, spanFrom, spanTo, tz, now));

  const ids = people.map((p) => p.id);
  const curM = metricsFor(raw, cur, ids);
  const prevM = comparePrev ? metricsFor(raw, comparePrev, ids) : null;
  const teamLogsTime = raw.worklogs.some((l) => l.startedAt >= new Date(now.getTime() - 30 * 24 * HOUR));
  const wd = new Date(startOfDay(raw.today, tz).getTime() + 12 * HOUR).getUTCDay();
  const midWeek = wd === 0 || wd >= 3;
  const b = buckets(cur);

  const rows: MemberRow[] = [];
  for (const p of people) {
    const m = curM.get(p.id)!;
    // VIEWER không có việc + không hoạt động trong kỳ ⇒ không đưa vào bảng (người xem thuần).
    if (p.role === 'VIEWER' && !m.assigned && !m.actions) continue;
    const sig = attentionSignals({
      isAgent: p.isAgent, silentNow: m.silentNow, includesToday: cur.includesToday, overdueOpen: m.overdueOpen, hoursThisWeek: m.hoursThisWeek,
      teamLogsTime, midWeek, unansweredMentions: m.mentionsUnanswered, withDue: m.withDue, onTime: m.onTime,
      assignedOpen: raw.issues.filter((i) => i.assigneeId === p.id && !i.resolvedAt && i.type.level !== 1 && !i.testCase).length,
      completed: m.completed + m.subtasksDone, windowDays: cur.days, silentThreshold: g.settings.silentDays,
    });
    const myIssues = raw.issues.filter((i) => i.assigneeId === p.id && i.type.level !== 1 && !i.testCase && i.createdAt <= cur.to && (!i.resolvedAt || i.resolvedAt >= cur.from));
    const mix = { todo: 0, inProgress: 0, done: 0, overdue: 0 };
    for (const i of myIssues) {
      if (i.resolvedAt && i.resolvedAt <= cur.to) mix.done += 1;
      else if (isOverdue(i.dueDate, raw.today)) mix.overdue += 1;
      else if (raw.statusCat.get(i.statusId) === 'IN_PROGRESS') mix.inProgress += 1;
      else mix.todo += 1;
    }
    const pm = prevM?.get(p.id);
    rows.push({ user: p, metrics: m, prev: pm ?? null, delta: deltas(m, pm), spark: series(raw.daily.get(p.id), b, cur.fromDay, cur.toDay), signals: sig, status: statusOf(m, sig), mix });
  }
  rows.sort((a, b2) => Number(a.user.isAgent) - Number(b2.user.isAgent) || b2.metrics.points - a.metrics.points || b2.metrics.completed - a.metrics.completed || b2.metrics.actions - a.metrics.actions);

  const humans = rows.filter((r) => !r.user.isAgent);
  const agents = rows.filter((r) => r.user.isAgent);
  const totals = sumMetrics(humans.map((r) => r.metrics));
  const prevTotals = prevM ? sumMetrics(humans.map((r) => prevM.get(r.user.id)!).filter(Boolean)) : null;
  const teamDaily = new Map<string, number>();
  for (const r of humans) for (const [d, n] of raw.daily.get(r.user.id) ?? []) teamDaily.set(d, (teamDaily.get(d) ?? 0) + n);
  const heatDays = daysInclusive(addDays(cur.toDay, -(HEATMAP_DAYS - 1)), cur.toDay);

  // Chỉ số "từng người" của người khác chỉ trả khi được thấy tất cả (SELF: chỉ dòng của mình + tổng nhóm).
  const visible = g.ca.view === 'ALL' ? rows : rows.filter((r) => r.user.id === userId);
  const completedSeries = b.keys.map(() => 0);
  const hoursSeries = b.keys.map(() => 0);
  const idx = new Map(b.keys.map((k, i) => [k, i]));
  const bkey = (d: string) => idx.get(b.kind === 'day' ? d : weekStart(d));
  const humanIds = new Set(humans.map((r) => r.user.id));
  for (const i of raw.issues) if (i.assigneeId && humanIds.has(i.assigneeId) && i.type.level === 0 && !i.testCase && inW(i.resolvedAt, cur)) { const k = bkey(dayKey(i.resolvedAt!, tz)); if (k !== undefined) completedSeries[k] += 1; }
  for (const l of raw.worklogs) if (humanIds.has(l.userId) && inW(l.startedAt, cur)) { const k = bkey(dayKey(l.startedAt, tz)); if (k !== undefined) hoursSeries[k] = round1(hoursSeries[k] + l.minutes / 60); }

  return {
    project: { id: g.project.id, key: g.project.key, name: g.project.name },
    window: { ...cur, tz },
    previous: comparePrev ? { label: comparePrev.label, fromDay: comparePrev.fromDay, toDay: comparePrev.toDay } : null,
    unit: raw.mode,
    access: { ...g.ca, teamVisible: g.settings.teamVisible },
    settings: g.ca.manage ? g.settings : { teamVisible: g.settings.teamVisible, timezone: g.settings.timezone, silentDays: g.settings.silentDays },
    chatConnected: raw.chat !== null,
    members: visible,
    hiddenMembers: rows.length - visible.length,
    team: {
      humans: humans.length, agents: agents.length, totals, prevTotals, delta: prevTotals ? Object.fromEntries(Object.entries(totals).map(([k, v]) => [k, typeof v === 'number' ? pctChange(v, (prevTotals as Record<string, unknown>)[k] as number | null) : null])) : null,
      agentTotals: agents.length ? sumMetrics(agents.map((r) => r.metrics)) : null,
      medians: {
        completed: median(humans.map((r) => r.metrics.completed)), points: median(humans.map((r) => r.metrics.points)),
        hours: median(humans.map((r) => r.metrics.hours)), actions: median(humans.map((r) => r.metrics.actions)),
        activeDays: median(humans.map((r) => r.metrics.activeDays)),
      },
      attention: humans.filter((r) => r.status === 'attention' || r.status === 'watch').length,
    },
    charts: {
      bucket: b.kind, keys: b.keys,
      completed: completedSeries, hours: hoursSeries,
      teamActivity: series(teamDaily, b, cur.fromDay, cur.toDay),
      heatmap: heatDays.map((d) => [d, teamDaily.get(d) ?? 0] as [string, number]),
    },
    definitions: METRIC_DEFINITIONS,
    note: FAIRNESS_NOTE,
    tookMs: Date.now() - t0,
  };
}

// ─── Chi tiết một người ──────────────────────────────────────────

export interface TimelineItem { at: string; kind: string; text: string; issue: { number: number; title: string } | null; url?: string | null }

export async function memberDetail(userId: number, projectId: number, memberId: number, q: ContribQuery) {
  const g = await contribGate(userId, projectId);
  if (g.ca.view !== 'ALL' && memberId !== userId) throw new AppError('You can only see your own contribution details in this project', 403, 'WORK_CONTRIB_FORBIDDEN');
  const tz = g.settings.timezone;
  const now = new Date();
  const people = await peopleOf(projectId);
  const person = people.find((p) => p.id === memberId);
  if (!person) throw new NotFoundError('Member not found in this project');
  const { cur, prev } = await windowsFor(projectId, q, tz, now, g.project.createdAt);
  const comparePrev = q.compare !== false ? prev : null;
  const heatFrom = startOfDay(addDays(cur.toDay, -(HEATMAP_DAYS - 1)), tz);
  const spanFrom = new Date(Math.min(cur.from.getTime(), heatFrom.getTime(), comparePrev?.from.getTime() ?? Infinity));
  const spanTo = new Date(Math.min(now.getTime(), cur.to.getTime() + MENTION_WINDOW_H * HOUR));
  const raw = await loadRaw(projectId, people, spanFrom, spanTo, tz, now);
  const m = metricsFor(raw, cur, [memberId]).get(memberId)!;
  const pm = comparePrev ? metricsFor(raw, comparePrev, [memberId]).get(memberId) : undefined;
  const iss = (id: number | null | undefined) => { const i = id ? raw.issueById.get(id) : undefined; return i ? { number: i.number, title: i.title } : null; };
  const byNumber = new Map(raw.issues.map((i) => [i.number, i]));

  const tl: TimelineItem[] = [];
  const FIELD: Record<string, string> = { created: 'Created', statusId: 'Moved', assigneeId: 'Reassigned', title: 'Renamed', description: 'Edited the description of', priority: 'Changed priority of', dueDate: 'Changed the due date of', storyPoints: 'Estimated' };
  for (const h of raw.history) if (h.actorId === memberId && inW(h.at, cur)) tl.push({ at: h.at.toISOString(), kind: h.field === 'created' ? 'created' : 'update', text: FIELD[h.field] ?? `Updated ${h.field} of`, issue: iss(h.issueId) });
  for (const c of raw.comments) if (c.authorId === memberId && inW(c.at, cur)) tl.push({ at: c.at.toISOString(), kind: 'comment', text: c.text.replace(/\s+/g, ' ').slice(0, 160) || 'Commented', issue: iss(c.issueId) });
  for (const l of raw.worklogs) if (l.userId === memberId && inW(l.startedAt, cur)) tl.push({ at: l.startedAt.toISOString(), kind: 'worklog', text: `Logged ${round1(l.minutes / 60)} h${l.activity ? ` · ${l.activity}` : ''}`, issue: iss(l.issueId) });
  for (const v of raw.pageVersions) if (v.authorId === memberId && inW(v.at, cur)) tl.push({ at: v.at.toISOString(), kind: 'doc', text: `${v.kind === 'CREATE' ? 'Created' : 'Edited'} page "${v.title}"`, issue: null, url: `docs/${v.pageNumber}` });
  for (const r of raw.runs) if (r.userId === memberId && inW(r.at, cur)) tl.push({ at: r.at.toISOString(), kind: 'test', text: `Ran a test — ${r.status}`, issue: iss(r.issueId) });
  for (const s of raw.steps) if (s.userId === memberId && inW(s.at, cur)) tl.push({ at: s.at.toISOString(), kind: 'review', text: `${s.decision === 'APPROVED' ? 'Approved' : 'Rejected'} "${s.title}"`, issue: iss(s.issueId) });
  for (const a of raw.approvalsCreated) if (a.userId === memberId && inW(a.at, cur)) tl.push({ at: a.at.toISOString(), kind: 'review', text: `Asked for review: "${a.title}"`, issue: iss(a.issueId) });
  for (const d of raw.dev) if (d.userId === memberId && inW(d.at, cur)) {
    const first = d.issueNumbers.map((n) => byNumber.get(n)).find(Boolean);
    tl.push({ at: d.at.toISOString(), kind: 'code', text: `${d.kind === 'PR' ? 'Pull request' : 'Commit'}: ${d.title}${d.additions !== null ? ` (+${d.additions} −${d.deletions ?? 0})` : ''}`, issue: first ? { number: first.number, title: first.title } : null, url: d.url });
  }
  for (const c of raw.chat ?? []) if (c.authorId === memberId && inW(c.createdAt, cur)) tl.push({ at: c.createdAt.toISOString(), kind: 'chat', text: 'Sent a chat message', issue: null });
  for (const mt of raw.meetings) if (inW(mt.startsAt, cur) && mt.people.includes(memberId)) tl.push({ at: mt.startsAt.toISOString(), kind: 'meeting', text: `${didAttend(mt, memberId) ? 'Attended' : 'Invited to'} "${mt.title}"`, issue: null, url: `meetings/${mt.number}` });
  tl.sort((a, b) => b.at.localeCompare(a.at));

  // Chat: chỉ đếm theo ngày, KHÔNG trả nội dung tin (kênh riêng tư có thể chứa thứ người xem không được đọc).
  const work = raw.issues.filter((i) => i.assigneeId === memberId && i.type.level !== 1 && !i.testCase);
  const overdue = work.filter((i) => !i.resolvedAt && isOverdue(i.dueDate, raw.today))
    .map((i) => ({ number: i.number, title: i.title, dueDate: i.dueDate!.toISOString().slice(0, 10), daysLate: dayDiff(i.dueDate!.toISOString().slice(0, 10), raw.today) }))
    .sort((a, b) => b.daysLate - a.daysLate);
  const lateDone = work.filter((i) => inW(i.resolvedAt, cur) && i.dueDate && lateDays(i.resolvedAt!, i.dueDate, tz) > 0)
    .map((i) => ({ number: i.number, title: i.title, dueDate: i.dueDate!.toISOString().slice(0, 10), resolvedDay: dayKey(i.resolvedAt!, tz), daysLate: lateDays(i.resolvedAt!, i.dueDate!, tz) }));
  const openNow = work.filter((i) => !i.resolvedAt).map((i) => ({ number: i.number, title: i.title, dueDate: i.dueDate ? i.dueDate.toISOString().slice(0, 10) : null, category: raw.statusCat.get(i.statusId) ?? 'TODO' }));
  const daily = raw.daily.get(memberId);
  const b = buckets(cur);
  const heatDays = daysInclusive(addDays(cur.toDay, -(HEATMAP_DAYS - 1)), cur.toDay);
  const pages = new Map<number, { number: number; title: string; versions: number }>();
  for (const v of raw.pageVersions) if (v.authorId === memberId && inW(v.at, cur)) {
    const p = pages.get(v.pageId) ?? { number: v.pageNumber, title: v.title, versions: 0 };
    p.versions += 1;
    pages.set(v.pageId, p);
  }
  return {
    user: person,
    self: memberId === userId,
    window: { ...cur, tz },
    previous: comparePrev ? { label: comparePrev.label, fromDay: comparePrev.fromDay, toDay: comparePrev.toDay } : null,
    unit: raw.mode,
    metrics: m,
    prev: pm ?? null,
    delta: deltas(m, pm),
    chatConnected: raw.chat !== null,
    signals: attentionSignals({
      isAgent: person.isAgent, silentNow: m.silentNow, includesToday: cur.includesToday, overdueOpen: m.overdueOpen, hoursThisWeek: m.hoursThisWeek,
      teamLogsTime: raw.worklogs.some((l) => l.startedAt >= new Date(now.getTime() - 30 * 24 * HOUR)),
      midWeek: (() => { const wd = new Date(startOfDay(raw.today, tz).getTime() + 12 * HOUR).getUTCDay(); return wd === 0 || wd >= 3; })(),
      unansweredMentions: m.mentionsUnanswered, withDue: m.withDue, onTime: m.onTime, assignedOpen: openNow.length,
      completed: m.completed + m.subtasksDone, windowDays: cur.days, silentThreshold: g.settings.silentDays,
    }),
    heatmap: heatDays.map((d) => [d, daily?.get(d) ?? 0] as [string, number]),
    trend: { bucket: b.kind, keys: b.keys, actions: series(daily, b, cur.fromDay, cur.toDay) },
    timeline: tl.slice(0, 120),
    timelineTotal: tl.length,
    overdue,
    lateDone,
    openNow: openNow.slice(0, 50),
    code: raw.dev.filter((d) => d.userId === memberId && inW(d.at, cur)).sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 30)
      .map((d) => ({ kind: d.kind, title: d.title, url: d.url, at: d.at.toISOString(), additions: d.additions, deletions: d.deletions, state: d.state, issueNumbers: d.issueNumbers })),
    docs: [...pages.values()].sort((a, b) => b.versions - a.versions),
    meetings: raw.meetings.filter((mt) => inW(mt.startsAt, cur) && mt.people.includes(memberId)).map((mt) => ({ number: mt.number, title: mt.title, startsAt: mt.startsAt.toISOString(), attended: didAttend(mt, memberId), attendanceTracked: mt.tracked, status: mt.status })),
  };
}

// ─── Xem theo task ───────────────────────────────────────────────

export async function taskView(userId: number, projectId: number, number: number) {
  const g = await contribGate(userId, projectId);
  const issue = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null },
    select: {
      id: true, number: true, title: true, createdAt: true, resolvedAt: true, dueDate: true, storyPoints: true, timeSpentMin: true,
      status: { select: { name: true, category: true } }, type: { select: { key: true, name: true } },
      assignee: { select: PUBLIC_USER }, reporter: { select: PUBLIC_USER },
    },
  });
  if (!issue) throw new NotFoundError('Issue not found');
  const [history, comments, worklogs, dev, legacyDev, runs, steps] = await Promise.all([
    prisma.workHistory.findMany({ where: { issueId: issue.id }, orderBy: { createdAt: 'asc' }, select: { field: true, fromValue: true, toValue: true, createdAt: true, actorKind: true, actor: { select: PUBLIC_USER } } }),
    prisma.workComment.findMany({ where: { issueId: issue.id, deletedAt: null }, orderBy: { createdAt: 'asc' }, select: { id: true, bodyText: true, createdAt: true, isAi: true, author: { select: PUBLIC_USER }, attachments: { select: { voice: { select: { durationMs: true } } } } } }),
    prisma.workWorklog.findMany({ where: { issueId: issue.id }, orderBy: { startedAt: 'asc' }, select: { minutes: true, startedAt: true, activity: true, user: { select: PUBLIC_USER } } }),
    prisma.workDevContribution.findMany({ where: { projectId, issueNumbers: { has: number } }, orderBy: { occurredAt: 'asc' }, select: { kind: true, externalId: true, title: true, url: true, additions: true, deletions: true, occurredAt: true, authorLogin: true, authorName: true, authorEmail: true, state: true } }),
    prisma.workDevActivity.findMany({ where: { issueId: issue.id, kind: { in: ['COMMIT', 'PR'] } }, select: { kind: true, externalId: true, title: true, url: true, author: true, createdAt: true, state: true } }),
    prisma.workTestRun.findMany({ where: { testCase: { issueId: issue.id }, executedAt: { not: null } }, select: { status: true, executedAt: true, executedBy: { select: PUBLIC_USER } } }),
    prisma.workApprovalStep.findMany({ where: { approval: { issueId: issue.id }, decidedAt: { not: null } }, select: { decision: true, decidedAt: true, approver: { select: PUBLIC_USER } } }),
  ]);
  const people = await peopleOf(projectId);
  const [identities, emails] = await Promise.all([
    prisma.workGitIdentity.findMany({ where: { projectId }, select: { identity: true, userId: true } }),
    prisma.user.findMany({ where: { id: { in: people.map((p) => p.id) } }, select: { id: true, email: true } }),
  ]);
  const emailOf = new Map(emails.map((e) => [e.id, e.email]));
  const resolve = identityResolver(people.map((p) => ({ ...p, email: emailOf.get(p.id) ?? null })), new Map(identities.map((x) => [x.identity, x.userId])));
  const userById = new Map<number, PublicUser>(people.map((p) => [p.id, p]));

  type Who = { user: PublicUser | null; label: string };
  const per = new Map<string, { who: Who; actions: number; comments: number; minutes: number; commits: number; firstAt: string; lastAt: string }>();
  const touch = (who: Who, at: Date, k: 'actions' | 'comments' | 'commits', minutes = 0) => {
    const key = who.user ? `u${who.user.id}` : `g${who.label}`;
    const r = per.get(key) ?? { who, actions: 0, comments: 0, minutes: 0, commits: 0, firstAt: at.toISOString(), lastAt: at.toISOString() };
    r[k] += 1;
    r.minutes += minutes;
    if (at.toISOString() < r.firstAt) r.firstAt = at.toISOString();
    if (at.toISOString() > r.lastAt) r.lastAt = at.toISOString();
    per.set(key, r);
  };
  const events: Array<{ at: string; kind: string; who: Who; text: string; url?: string | null }> = [];
  for (const h of history) {
    if (h.actorKind !== 'USER' && h.actorKind !== 'AGENT') continue;
    const who: Who = { user: h.actor, label: h.actor ? displayName(h.actor) : 'Someone' };
    touch(who, h.createdAt, 'actions');
    events.push({ at: h.createdAt.toISOString(), kind: h.field === 'created' ? 'created' : 'update', who, text: h.field === 'created' ? 'created the issue' : `changed ${h.field}` });
  }
  for (const c of comments) {
    if (c.isAi || !c.author) continue;
    const who: Who = { user: c.author, label: displayName(c.author) };
    touch(who, c.createdAt, 'comments');
    const voice = c.attachments.some((a) => a.voice);
    events.push({ at: c.createdAt.toISOString(), kind: voice ? 'voice' : 'comment', who, text: (c.bodyText || (voice ? 'Voice note' : '')).replace(/\s+/g, ' ').slice(0, 200) });
  }
  for (const l of worklogs) {
    const who: Who = { user: l.user, label: displayName(l.user) };
    touch(who, l.startedAt, 'actions', l.minutes);
    events.push({ at: l.startedAt.toISOString(), kind: 'worklog', who, text: `logged ${round1(l.minutes / 60)} h${l.activity ? ` (${l.activity})` : ''}` });
  }
  const seen = new Set(dev.map((d) => `${d.kind}:${d.externalId}`));
  const allDev = [
    ...dev.map((d) => ({ kind: d.kind, title: d.title ?? '', url: d.url, at: d.occurredAt, additions: d.additions, deletions: d.deletions, uid: resolve({ login: d.authorLogin, email: d.authorEmail, name: d.authorName }), label: d.authorLogin ?? d.authorName ?? d.authorEmail ?? 'unknown' })),
    ...legacyDev.filter((d) => !seen.has(`${d.kind}:${d.externalId}`)).map((d) => ({ kind: d.kind, title: d.title, url: d.url, at: d.createdAt, additions: null as number | null, deletions: null as number | null, uid: resolve({ login: d.author, name: d.author }), label: d.author ?? 'unknown' })),
  ];
  for (const d of allDev) {
    const u = d.uid ? userById.get(d.uid) ?? null : null;
    const who: Who = { user: u, label: u ? displayName(u) : d.label };
    touch(who, d.at, 'commits');
    events.push({ at: d.at.toISOString(), kind: 'code', who, text: `${d.kind === 'PR' ? 'pull request' : 'commit'} ${d.title}${d.additions !== null ? ` (+${d.additions} −${d.deletions ?? 0})` : ''}`, url: d.url });
  }
  for (const r of runs) {
    const who: Who = { user: r.executedBy, label: r.executedBy ? displayName(r.executedBy) : 'Someone' };
    touch(who, r.executedAt!, 'actions');
    events.push({ at: r.executedAt!.toISOString(), kind: 'test', who, text: `ran the test — ${r.status}` });
  }
  for (const s of steps) {
    const who: Who = { user: s.approver, label: displayName(s.approver) };
    touch(who, s.decidedAt!, 'actions');
    events.push({ at: s.decidedAt!.toISOString(), kind: 'review', who, text: s.decision === 'APPROVED' ? 'approved the review' : s.decision === 'REJECTED' ? 'rejected the review' : `review: ${s.decision.toLowerCase()}` });
  }
  events.sort((a, b) => a.at.localeCompare(b.at));
  return {
    issue: {
      number: issue.number, key: `${g.project.key}-${issue.number}`, title: issue.title, status: issue.status, type: issue.type,
      assignee: issue.assignee, reporter: issue.reporter, createdAt: issue.createdAt, resolvedAt: issue.resolvedAt,
      dueDate: issue.dueDate ? issue.dueDate.toISOString().slice(0, 10) : null, storyPoints: issue.storyPoints,
      onTime: issue.resolvedAt && issue.dueDate ? lateDays(issue.resolvedAt, issue.dueDate, g.settings.timezone) === 0 : null,
      leadDays: issue.resolvedAt ? round1((issue.resolvedAt.getTime() - issue.createdAt.getTime()) / (24 * HOUR)) : null,
    },
    people: [...per.values()].map((r) => ({ ...r, hours: round1(r.minutes / 60) })).sort((a, b) => b.actions + b.comments + b.commits - (a.actions + a.comments + a.commits)),
    events: events.slice(-300),
  };
}

// ─── Danh tính git ───────────────────────────────────────────────

/** Tác giả commit/PR trong dự án + người khớp được (tự động hoặc tay). Chỉ ADMIN dự án. */
export async function gitAuthors(userId: number, projectId: number) {
  const g = await contribGate(userId, projectId);
  if (!g.ca.manage) throw new AppError('Only project admins can map git authors', 403, 'FORBIDDEN');
  const people = await peopleOf(projectId);
  const [contribs, legacy, identities, emails] = await Promise.all([
    prisma.workDevContribution.groupBy({ by: ['authorLogin', 'authorName', 'authorEmail'], where: { projectId }, _count: { _all: true } }),
    prisma.workDevActivity.groupBy({ by: ['author'], where: { projectId, kind: { in: ['COMMIT', 'PR'] } }, _count: { _all: true } }),
    prisma.workGitIdentity.findMany({ where: { projectId }, select: { identity: true, userId: true } }),
    prisma.user.findMany({ where: { id: { in: people.map((p) => p.id) } }, select: { id: true, email: true } }),
  ]);
  const emailOf = new Map(emails.map((e) => [e.id, e.email]));
  const manual = new Map(identities.map((x) => [x.identity, x.userId]));
  const resolve = identityResolver(people.map((p) => ({ ...p, email: emailOf.get(p.id) ?? null })), manual);
  const rows = new Map<string, { identity: string; login: string | null; name: string | null; email: string | null; count: number; userId: number | null; manual: boolean }>();
  const add = (login: string | null, name: string | null, email: string | null, n: number) => {
    const label = login ?? email ?? name;
    if (!label) return;
    const key = label.includes('@') ? label.toLowerCase() : fold(label);
    const r = rows.get(key) ?? { identity: key, login, name, email, count: 0, userId: resolve({ login, email, name }), manual: [login, email, name].some((x) => x && manual.has(x.includes('@') ? x.toLowerCase() : fold(x))) };
    r.count += n;
    rows.set(key, r);
  };
  for (const c of contribs) add(c.authorLogin, c.authorName, c.authorEmail, c._count._all);
  for (const c of legacy) add(c.author, c.author, null, c._count._all);
  return { authors: [...rows.values()].sort((a, b) => Number(!!a.userId) - Number(!!b.userId) || b.count - a.count), people: people.map((p) => ({ id: p.id, username: p.username, displayName: p.displayName, fullName: p.fullName, avatarUrl: p.avatarUrl, kind: p.kind })) };
}

export async function setGitIdentity(userId: number, projectId: number, identity: string, memberId: number | null) {
  const g = await contribGate(userId, projectId);
  if (!g.ca.manage) throw new AppError('Only project admins can map git authors', 403, 'FORBIDDEN');
  const key = identity.includes('@') ? identity.trim().toLowerCase() : fold(identity);
  if (!key || key.length > 200) throw new BadRequestError('Invalid git identity', 'VALIDATION_ERROR');
  if (memberId === null) {
    await prisma.workGitIdentity.deleteMany({ where: { projectId, identity: key } });
    return { identity: key, userId: null };
  }
  const people = await peopleOf(projectId);
  if (!people.some((p) => p.id === memberId)) throw new BadRequestError('Pick a member of this project', 'WORK_BAD_MEMBER');
  await prisma.workGitIdentity.upsert({
    where: { projectId_identity: { projectId, identity: key } },
    create: { projectId, identity: key, userId: memberId, createdById: userId },
    update: { userId: memberId, createdById: userId },
  });
  return { identity: key, userId: memberId };
}

export const _test = { metricsFor, sumMetrics, buckets, series };
