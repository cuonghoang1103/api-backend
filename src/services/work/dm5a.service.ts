/**
 * CT Work — dm5 G1 (27/11/2026): cổng quy trình & nhịp vận hành — PHẦN ĐỌC DB.
 *
 * 1) Cổng trong CỬA GHI CHUNG (issueChange.ts gọi; REST, sửa hàng loạt, MCP `transition`, AI "Apply" chịu như nhau; luật tự
 *    động / hệ thống KHÔNG bị chặn — cùng lý do Done rules):
 *      assertReadyGate      A14  Definition of Ready (trường DoR trống / prototype chưa duyệt) ⇒ 400 WORK_READY_REQUIREMENTS
 *      assertCiGate         A2   Done khi PR gắn thẻ CI đỏ/đang chạy ⇒ 400 WORK_DONE_CI
 *      assertCommentRule    A6   cần bình luận xác nhận của bộ phận X sau khi vào trạng thái nguồn ⇒ 400 WORK_TRANSITION_COMMENT
 *      assertCoolOff        A6   chưa đủ N giờ ở trạng thái nguồn ⇒ 400 WORK_TRANSITION_COOLOFF
 *      assertWipGuards      A4   cột canh đầy ⇒ không kéo thêm vào cột bị chặn ⇒ 400 WORK_WIP_LIMIT
 *      assertStageOpen      A23  thẻ của giai đoạn chưa mở (NOT_STARTED) không được bắt đầu ⇒ 400 WORK_STAGE_NOT_ACTIVE
 * 2) Số liệu cho màn hình (route `work.dm5a.routes.ts`): sprintGuards (A14/A15/A22), earlyWarnings (A18), projectRag (A19),
 *    moscowCheck (A22), boardAges (A18), normalizeProcessSettings (chuẩn hoá khoá settings — updateProject gọi).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, NotFoundError } from '../../middleware/errorHandler.js';
import { requireProject } from './permissions.js';
import type { TransitionRules } from './studio.js';
import {
  capacityOf, capacityVerdict, cleanCapacity, cleanMoscowCap, cleanRagRules, cleanReadyRequirements, cleanRetroActionCap,
  cleanWipGuards, daysBetween, doneCiFlagsOf, flatTailDays, moscowCapOf, moscowKeyOf, moscowShare, pct, ragLevel,
  ragRulesOf, statusWeights, weightedCompletion, wipGuardsOf, worstLevel, type Level, type ReadyRequirements,
} from './dm5Rules.js';

type Tx = Prisma.TransactionClient;
/** 400 kèm dữ liệu (client hiện chi tiết). */
const bad = (message: string, code: string, data?: Record<string, unknown>) => new AppError(message, 400, code, data);
type Db = Tx | typeof prisma;
const DAY = 86_400_000;
const round1 = (n: number) => Math.round(n * 10) / 10;

// ═══ 1. Cổng trong cửa ghi chung ═════════════════════════════════

const filled = (v: unknown) => v !== null && v !== undefined && v !== false && !(typeof v === 'string' && !v.trim()) && !(Array.isArray(v) && !v.length);

export function readyRequirementsOf(settings: unknown): ReadyRequirements | null {
  return cleanReadyRequirements((settings as { readyRequirements?: unknown } | null)?.readyRequirements);
}

/**
 * Thẻ có "Ready" chưa: trả danh sách lý do (rỗng = Ready). Dùng chung cho cổng chặn kéo thẻ (A14) và cảnh báo
 * "chưa Ready" khi lập kế hoạch sprint.
 */
export async function readyProblems(db: Db, projectId: number, req: ReadyRequirements, issue: { id: number; typeKey: string }): Promise<string[]> {
  if (req.typeKeys?.length && !req.typeKeys.includes(issue.typeKey)) return [];
  const out: string[] = [];
  if (req.fieldIds.length) {
    const fields = await db.workCustomField.findMany({ where: { projectId, id: { in: req.fieldIds } }, select: { id: true, name: true, typeKeys: true } });
    const applicable = fields.filter((f) => !Array.isArray(f.typeKeys) || (f.typeKeys as string[]).includes(issue.typeKey));
    if (applicable.length) {
      const values = await db.workCustomValue.findMany({ where: { issueId: issue.id, fieldId: { in: applicable.map((f) => f.id) } }, select: { fieldId: true, value: true } });
      for (const f of applicable) if (!filled(values.find((x) => x.fieldId === f.id)?.value)) out.push(f.name);
    }
  }
  if (req.requireMockupApproved) {
    const screens = await db.workSrsScreen.findMany({ where: { issueId: issue.id }, select: { name: true, mockups: { where: { status: 'APPROVED' }, select: { id: true }, take: 1 } } });
    for (const s of screens) if (!s.mockups.length) out.push(`approved prototype of "${s.name}"`);
  }
  return out;
}

/** A14 — chặn bắt đầu thẻ chưa Ready. Mặc định: rời nhóm TODO sang nhóm khác; có toStatusIds ⇒ chỉ các trạng thái đó. */
export async function assertReadyGate(tx: Tx, a: {
  projectId: number; settings: unknown; issueId: number; typeKey: string; issueKey: string;
  fromCategory: string; toStatusId: number; toCategory: string;
}) {
  const req = readyRequirementsOf(a.settings);
  if (!req) return;
  const hit = req.toStatusIds?.length ? req.toStatusIds.includes(a.toStatusId) : a.fromCategory === 'TODO' && a.toCategory !== 'TODO';
  if (!hit) return;
  const missing = await readyProblems(tx, a.projectId, req, { id: a.issueId, typeKey: a.typeKey });
  if (missing.length) {
    throw bad(`${a.issueKey} is not Ready yet — fill in ${missing.join(', ')} first (Definition of Ready).`, 'WORK_READY_REQUIREMENTS', { missing });
  }
}

/** PR liên quan tới thẻ (mã thẻ trong tiêu đề/nhánh/commit ⇒ issueNumbers), bỏ PR đã đóng mà không merge. */
export async function pullsOfIssue(db: Db, projectId: number, number: number) {
  const rows = await db.workGitPull.findMany({
    where: { projectId, issueNumbers: { has: number } },
    select: { number: true, title: true, state: true, ciState: true, ciUrl: true, mergedAt: true, provider: true },
    orderBy: { openedAt: 'desc' }, take: 20,
  });
  return rows.filter((p) => !(p.state.toUpperCase() === 'CLOSED' && !p.mergedAt));
}

/**
 * A2 — `doneRequirements.requireCiGreen`: mọi PR gắn thẻ (mở hoặc đã merge) phải CI xanh. failure | pending ⇒ chặn;
 * success / neutral / chưa có CI ⇒ qua. Thẻ không có PR ⇒ chỉ chặn khi `requirePr`.
 */
export async function assertCiGate(tx: Tx, a: { projectId: number; settings: unknown; number: number; issueKey: string }) {
  const f = doneCiFlagsOf(a.settings);
  if (!f.requireCiGreen) return;
  const pulls = await pullsOfIssue(tx, a.projectId, a.number);
  if (!pulls.length) {
    if (f.requirePr) throw bad(`${a.issueKey} needs a pull request with green CI before it can be Done.`, 'WORK_DONE_CI', { pulls: [] });
    return;
  }
  const red = pulls.filter((p) => p.ciState === 'failure' || p.ciState === 'pending');
  if (red.length) {
    const list = red.map((p) => `#${p.number} (${p.ciState === 'failure' ? 'CI failed' : 'CI still running'})`).join(', ');
    throw bad(`${a.issueKey} cannot be Done while its pull request CI is not green: ${list}.`, 'WORK_DONE_CI', {
      pulls: red.map((p) => ({ number: p.number, ciState: p.ciState, ciUrl: p.ciUrl })),
    });
  }
}

/** Lúc thẻ vào trạng thái `statusId` lần gần nhất (lịch sử statusId); chưa từng đổi ⇒ lúc tạo thẻ. */
export async function enteredStatusAt(db: Db, issueId: number, statusId: number): Promise<Date> {
  const h = await db.workHistory.findFirst({
    where: { issueId, field: 'statusId', toValue: String(statusId) }, orderBy: { createdAt: 'desc' }, select: { createdAt: true },
  });
  if (h) return h.createdAt;
  const i = await db.workIssue.findUnique({ where: { id: issueId }, select: { createdAt: true } });
  return i?.createdAt ?? new Date(0);
}

/** A6 — `rules.requireComment` + `rules.minHoursInFrom` của luồng chuyển khớp. ADMIN cũng không vượt. */
export async function assertCommentAndCoolOff(tx: Tx, a: { issueId: number; fromStatusId: number; rules: TransitionRules; now?: Date }) {
  if (!a.rules.requireComment && !a.rules.minHoursInFrom) return;
  const since = await enteredStatusAt(tx, a.issueId, a.fromStatusId);
  const fromName = (await tx.workStatus.findUnique({ where: { id: a.fromStatusId }, select: { name: true } }))?.name ?? 'the current status';
  if (a.rules.minHoursInFrom) {
    const now = a.now ?? new Date();
    const hours = (now.getTime() - since.getTime()) / 3_600_000;
    if (hours < a.rules.minHoursInFrom) {
      const left = Math.ceil((a.rules.minHoursInFrom - hours) * 10) / 10;
      throw bad(
        `Cool-off: this issue must stay in "${fromName}" for ${a.rules.minHoursInFrom}h before it moves on (${left}h left).`,
        'WORK_TRANSITION_COOLOFF', { minHours: a.rules.minHoursInFrom, hoursLeft: left, since },
      );
    }
  }
  if (a.rules.requireComment) {
    const issue = await tx.workIssue.findUnique({ where: { id: a.issueId }, select: { assigneeId: true } });
    const teamIds = a.rules.requireComment.teamIds;
    const members = teamIds.length
      ? (await tx.workTeamMember.findMany({ where: { teamId: { in: teamIds } }, select: { userId: true } })).map((m) => m.userId)
      : null;
    const n = await tx.workComment.count({
      where: {
        issueId: a.issueId, deletedAt: null, isAi: false, createdAt: { gt: since },
        author: { kind: { not: 'AGENT' } },
        ...(members ? { authorId: { in: members.length ? members.filter((u) => u !== issue?.assigneeId) : [-1] } } : { authorId: { not: null, ...(issue?.assigneeId ? { notIn: [issue.assigneeId] } : {}) } }),
      },
    });
    if (!n) {
      const who = teamIds.length
        ? (await tx.workTeam.findMany({ where: { id: { in: teamIds } }, select: { name: true } })).map((t) => t.name).join(', ') || 'the reviewing team'
        : 'someone other than the assignee';
      throw bad(
        `A confirming comment from ${who} is needed after the issue entered "${fromName}" before this status change.`,
        'WORK_TRANSITION_COMMENT', { teamIds, since },
      );
    }
  }
}

/**
 * A4 — `settings.wipGuards`: khi cột `whenColumn` đã đủ giới hạn (limit riêng hoặc WIP của cột) thì không kéo thêm thẻ
 * vào `blocksColumn`. Kéo trong cùng cột đích không bị chặn. Không phụ thuộc `wipMode`.
 */
export async function assertWipGuards(tx: Tx, a: { projectId: number; settings: unknown; issueId: number; fromStatusId: number; toStatusId: number }) {
  const guards = wipGuardsOf(a.settings);
  if (!guards.length) return;
  const workflows = await tx.workWorkflow.findMany({
    where: { projectId: a.projectId },
    select: { id: true, isDefault: true, statuses: { orderBy: { position: 'asc' }, select: { id: true, name: true, category: true, wipLimit: true } } },
  });
  const { boardColumns } = await import('./projects.service.js');
  const cols = boardColumns(workflows, a.settings);
  const byName = (n: string) => cols.find((c) => c.name.toLowerCase() === n.toLowerCase() || c.key === n);
  const target = cols.find((c) => c.statusIds.includes(a.toStatusId));
  if (!target || target.statusIds.includes(a.fromStatusId)) return;
  for (const g of guards) {
    if (byName(g.blocksColumn)?.key !== target.key) continue;
    const when = byName(g.whenColumn);
    const limit = g.limit ?? when?.wipLimit ?? null;
    if (!when || limit == null) continue;
    const n = await tx.workIssue.count({ where: { projectId: a.projectId, deletedAt: null, statusId: { in: when.statusIds }, id: { not: a.issueId } } });
    if (n >= limit) {
      throw bad(
        `"${when.name}" is full (${n}/${limit}) — finish what is there before pulling more into "${target.name}"`,
        'WORK_WIP_LIMIT', { guard: g, count: n, limit },
      );
    }
  }
}

/** A23 — `settings.stageGateBlocksWork`: thẻ thuộc giai đoạn CHƯA mở (NOT_STARTED) không rời nhóm TODO. */
export async function assertStageOpen(tx: Tx, a: { settings: unknown; stageId: number | null; issueKey: string; fromCategory: string; toCategory: string }) {
  if ((a.settings as { stageGateBlocksWork?: unknown } | null)?.stageGateBlocksWork !== true) return;
  if (!a.stageId || a.toCategory === 'TODO' || a.fromCategory !== 'TODO') return;
  const st = await tx.workStage.findUnique({ where: { id: a.stageId }, select: { n: true, name: true, status: true } });
  if (st && st.status === 'NOT_STARTED') {
    throw bad(
      `${a.issueKey} belongs to stage "${st.n}. ${st.name}", which has not started — activate the stage (pass the previous gate) before starting its work.`,
      'WORK_STAGE_NOT_ACTIVE', { stage: st.name },
    );
  }
}

// ═══ 2. Chuẩn hoá settings (updateProject gọi) ═════════════════════

/** Khoá của G1 trong `input.settings` ⇒ giá trị sạch (sai ⇒ 400 với id ngoài dự án). Khoá không gửi thì không đụng. */
export async function normalizeProcessSettings(projectId: number, s: Record<string, unknown>): Promise<Record<string, unknown>> {
  const out = { ...s };
  if ('readyRequirements' in out) {
    const r = cleanReadyRequirements(out.readyRequirements);
    if (r?.fieldIds.length) {
      const own = await prisma.workCustomField.count({ where: { projectId, id: { in: r.fieldIds } } });
      if (own !== r.fieldIds.length) throw bad('Some Definition of Ready fields do not belong to this project', 'WORK_BAD_FIELD');
    }
    if (r?.toStatusIds?.length) {
      const own = await prisma.workStatus.count({ where: { id: { in: r.toStatusIds }, workflow: { projectId } } });
      if (own !== r.toStatusIds.length) throw bad('Some Definition of Ready statuses do not belong to this project', 'WORK_BAD_STATUS');
    }
    out.readyRequirements = r;
  }
  if ('wipGuards' in out) out.wipGuards = cleanWipGuards(out.wipGuards);
  if ('capacity' in out) out.capacity = cleanCapacity(out.capacity);
  if ('ragRules' in out) out.ragRules = cleanRagRules(out.ragRules);
  if ('moscowCapPct' in out) out.moscowCapPct = cleanMoscowCap(out.moscowCapPct);
  if ('stageGateBlocksWork' in out) out.stageGateBlocksWork = out.stageGateBlocksWork === true ? true : null;
  if ('retroActionCap' in out) out.retroActionCap = cleanRetroActionCap(out.retroActionCap);
  return out;
}

// ═══ 3. Số liệu cho màn hình ══════════════════════════════════════

async function projectSettings(projectId: number) {
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { settings: true, key: true } });
  if (!p) throw new NotFoundError('Project not found');
  return p;
}

/** Trường MoSCoW của dự án (SELECT tên "MoSCoW"). */
async function moscowField(projectId: number) {
  const f = await prisma.workCustomField.findFirst({ where: { projectId, kind: 'SELECT', name: { equals: 'MoSCoW', mode: 'insensitive' } }, select: { id: true, options: true } });
  return f ? { id: f.id, options: (Array.isArray(f.options) ? f.options : []) as Array<{ id: string; label: string }> } : null;
}

/** Effort một thẻ: giờ ước lượng (HOURS) hoặc điểm; thiếu ⇒ 1. */
function effortOf(i: { storyPoints: number | null; originalEstimateMin: number | null }, mode: string) {
  const v = mode === 'HOURS' ? (i.originalEstimateMin ?? 0) / 60 : (i.storyPoints ?? 0);
  return v > 0 ? v : 1;
}

/**
 * A22 — tỉ lệ Must trên effort (sprint / version / mọi thẻ mở). Cảnh báo khi > `moscowCapPct` (mặc định 60; 0 = tắt).
 */
export async function moscowCheck(userId: number, projectId: number, q: { sprintId?: number | null; versionId?: number | null } = {}) {
  await requireProject(userId, projectId, 'project.view');
  const p = await projectSettings(projectId);
  const cap = moscowCapOf(p.settings);
  const field = await moscowField(projectId);
  if (!field) return { enabled: false as const, reason: 'NO_FIELD' as const, cap };
  const { estimationOf } = await import('./sprints.service.js');
  const mode = await estimationOf(projectId);
  const issues = await prisma.workIssue.findMany({
    where: {
      projectId, deletedAt: null, type: { level: { gte: 0 } },
      ...(q.sprintId ? { sprintId: q.sprintId } : q.versionId ? { fixVersionId: q.versionId } : { resolvedAt: null }),
    },
    select: { id: true, storyPoints: true, originalEstimateMin: true },
    take: 3000,
  });
  const values = new Map((await prisma.workCustomValue.findMany({ where: { fieldId: field.id, issueId: { in: issues.map((i) => i.id) } }, select: { issueId: true, value: true } })).map((v) => [v.issueId, v.value]));
  const share = moscowShare(issues.map((i) => ({ key: moscowKeyOf(values.get(i.id), field.options), effort: effortOf(i, mode) })));
  const over = cap !== null && share.mustPct !== null && share.mustPct > cap;
  return { enabled: true as const, cap, unit: mode, scope: q.sprintId ? 'sprint' : q.versionId ? 'version' : 'open', ...share, over };
}

/**
 * Bảng kiểm khi lập / bắt đầu sprint: số thẻ chưa Ready (A14), ước lượng so với sức chứa × tập trung (A15), tỉ lệ Must (A22).
 */
export async function sprintGuards(userId: number, projectId: number, sprintId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const sp = await prisma.workSprint.findFirst({ where: { id: sprintId, projectId }, select: { id: true, name: true, startAt: true, endAt: true, state: true } });
  if (!sp) throw new NotFoundError('Sprint not found');
  const p = await projectSettings(projectId);
  const issues = await prisma.workIssue.findMany({
    where: { projectId, sprintId, deletedAt: null, type: { level: 0 } },
    select: { id: true, number: true, title: true, resolvedAt: true, originalEstimateMin: true, remainingEstimateMin: true, storyPoints: true, type: { select: { key: true } } },
    orderBy: [{ rank: 'asc' }, { id: 'asc' }], take: 500,
  });
  // A14: chưa Ready.
  const req = readyRequirementsOf(p.settings);
  const notReady: Array<{ number: number; key: string; title: string; missing: string[] }> = [];
  if (req) {
    for (const i of issues.filter((x) => !x.resolvedAt)) {
      const missing = await readyProblems(prisma, projectId, req, { id: i.id, typeKey: i.type.key });
      if (missing.length) notReady.push({ number: i.number, key: `${access.key}-${i.number}`, title: i.title, missing });
    }
  }
  // A15: sức chứa (giờ/ngày × ngày làm việc, trừ nghỉ) × tập trung.
  const { capacity } = await import('./planning.service.js');
  const cap = await capacity(userId, projectId, { sprintId });
  const capacityHours = cap.members.some((m) => m.capacityHours !== null) ? round1(cap.members.reduce((s, m) => s + (m.capacityHours ?? 0), 0)) : null;
  const estimateHours = issues.filter((i) => !i.resolvedAt).reduce((s, i) => s + (i.remainingEstimateMin ?? i.originalEstimateMin ?? 0), 0) / 60;
  const verdict = capacityVerdict({ estimateHours, capacityHours, settings: capacityOf(p.settings) });
  const unestimated = issues.filter((i) => !i.resolvedAt && !(i.remainingEstimateMin ?? i.originalEstimateMin)).length;
  const moscow = await moscowCheck(userId, projectId, { sprintId });
  return {
    sprint: { id: sp.id, name: sp.name, state: sp.state, from: cap.from, to: cap.to },
    readyRule: !!req,
    notReady,
    capacity: { ...verdict, unestimated, members: cap.members.length },
    moscow,
  };
}

/** Bậc tuổi thẻ (ngày ở cột hiện tại) cho board — A18. Chỉ thẻ chưa xong. */
export async function boardAges(userId: number, projectId: number): Promise<Record<number, number>> {
  await requireProject(userId, projectId, 'project.view');
  const rows = await prisma.$queryRaw<Array<{ number: number; since: Date }>>`
    SELECT i.number, COALESCE(MAX(h.created_at) FILTER (WHERE h.to_value = i.status_id::text), i.created_at) AS since
    FROM work_issues i
    LEFT JOIN work_history h ON h.issue_id = i.id AND h.field = 'statusId'
    WHERE i.project_id = ${projectId} AND i.deleted_at IS NULL AND i.resolved_at IS NULL
    GROUP BY i.id, i.number, i.created_at
    LIMIT 3000`;
  const now = new Date();
  return Object.fromEntries(rows.map((r) => [r.number, daysBetween(new Date(r.since), now)]));
}

/** Điểm thêm vào sprint đang chạy sau khi Start (A18) + điểm cam kết. */
async function scopeCreep(projectId: number, sprintId: number) {
  const { computeSprintReport } = await import('./sprints.service.js');
  const r = await computeSprintReport(projectId, sprintId);
  const all = [...r.completed, ...r.incomplete];
  const added = all.filter((i) => r.added.includes(i.number));
  return { committed: r.committedPoints, addedPoints: round1(added.reduce((s, i) => s + i.points, 0)), addedIssues: added.map((i) => i.number), unit: r.unit };
}

/** Số ngày CUỐI burndown đi ngang: snapshot (cron) nếu có ≥ 2 ngày, không thì từ lần cuối có thẻ xong. */
async function burndownFlat(sprint: { id: number; startAt: Date | null }, now: Date) {
  const snaps = await prisma.workSprintSnapshot.findMany({ where: { sprintId: sprint.id }, orderBy: { day: 'asc' }, select: { day: true, remainingPoints: true } });
  if (snaps.length >= 2) return { days: flatTailDays(snaps.map((s) => ({ day: s.day, remaining: s.remainingPoints }))), source: 'snapshots' as const };
  const last = await prisma.workIssue.findFirst({ where: { sprintId: sprint.id, deletedAt: null, resolvedAt: { not: null } }, orderBy: { resolvedAt: 'desc' }, select: { resolvedAt: true } });
  const since = last?.resolvedAt && sprint.startAt && last.resolvedAt > sprint.startAt ? last.resolvedAt : sprint.startAt;
  return { days: since ? daysBetween(since, now) : 0, source: 'resolved' as const };
}

/**
 * A18 — cảnh báo sớm: Blocked > 24h, thẻ ưu tiên cao (P1–P2) đứng yên > 48h, burndown đi ngang ≥ 3 ngày, thêm phạm vi
 * sau khi Start. Mỗi dòng có JQL để mở danh sách (flaggedSince là trường JQL mới của đợt này).
 */
export async function earlyWarnings(userId: number, projectId: number, now = new Date()) {
  const access = await requireProject(userId, projectId, 'project.view');
  const [blocked, idle, sprint] = await Promise.all([
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, resolvedAt: null, flaggedAt: { lt: new Date(now.getTime() - DAY) } },
      select: { number: true, title: true, flaggedAt: true }, orderBy: { flaggedAt: 'asc' }, take: 50,
    }),
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, resolvedAt: null, priority: { lte: 2 }, updatedAt: { lt: new Date(now.getTime() - 2 * DAY) }, type: { level: { gte: 0 } } },
      select: { number: true, title: true, updatedAt: true, priority: true }, orderBy: { updatedAt: 'asc' }, take: 50,
    }),
    prisma.workSprint.findFirst({ where: { projectId, state: 'ACTIVE' }, orderBy: { startAt: 'desc' }, select: { id: true, name: true, startAt: true } }),
  ]);
  const warnings: Array<{ code: string; level: Level; count: number; days?: number; points?: number; jql?: string; items?: Array<{ key: string; number: number; title: string; days: number }> }> = [];
  if (blocked.length) {
    warnings.push({
      code: 'BLOCKED_24H', level: 'RED', count: blocked.length, jql: 'flaggedSince < -24h AND statusCategory != Done ORDER BY flaggedSince',
      items: blocked.map((i) => ({ key: `${access.key}-${i.number}`, number: i.number, title: i.title, days: daysBetween(i.flaggedAt!, now) })),
    });
  }
  if (idle.length) {
    warnings.push({
      code: 'HIGH_IDLE_48H', level: 'AMBER', count: idle.length, jql: 'priority <= 2 AND updated < -2d AND statusCategory != Done ORDER BY updated',
      items: idle.map((i) => ({ key: `${access.key}-${i.number}`, number: i.number, title: i.title, days: daysBetween(i.updatedAt, now) })),
    });
  }
  let sprintInfo: { name: string; flatDays: number; flatSource: string; addedPoints: number; addedIssues: number[]; committed: number; unit: string } | null = null;
  if (sprint) {
    const [flat, creep] = await Promise.all([burndownFlat(sprint, now), scopeCreep(projectId, sprint.id)]);
    sprintInfo = { name: sprint.name, flatDays: flat.days, flatSource: flat.source, ...creep };
    if (flat.days >= 3) warnings.push({ code: 'BURNDOWN_FLAT', level: flat.days >= 5 ? 'RED' : 'AMBER', count: 1, days: flat.days });
    if (creep.addedIssues.length) {
      warnings.push({ code: 'SCOPE_ADDED', level: creep.committed && creep.addedPoints / creep.committed >= 0.2 ? 'RED' : 'AMBER', count: creep.addedIssues.length, points: creep.addedPoints });
    }
  }
  return { warnings, sprint: sprintInfo, at: now };
}

/**
 * A19 — RAG dự án 4 chiều (ngưỡng `settings.ragRules`, RAG tổng = chiều tệ nhất) + % hoàn thành có trọng số bậc trạng thái.
 *   schedule: % thẻ mở có hạn đã trễ (+ giai đoạn trễ ngày kế hoạch ⇒ ít nhất AMBER)
 *   scope:    % điểm thêm vào sprint đang chạy sau khi Start so với cam kết
 *   quality:  số Bug đang mở (P1–P2 tính 2)
 *   effort:   % giờ đã log vượt ước lượng gốc (thẻ có ước lượng)
 */
export async function projectRag(userId: number, projectId: number, now = new Date()) {
  await requireProject(userId, projectId, 'project.view');
  const p = await projectSettings(projectId);
  const rules = ragRulesOf(p.settings);
  const today = new Date(`${now.toISOString().slice(0, 10)}T00:00:00Z`);
  const { estimationOf } = await import('./sprints.service.js');
  const mode = await estimationOf(projectId);
  const [open, statuses, bugs, est, stages, sprint] = await Promise.all([
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, resolvedAt: null, type: { level: { gte: 0 } } }, select: { dueDate: true } }),
    prisma.workStatus.findMany({ where: { workflow: { projectId } }, select: { id: true, name: true, category: true, position: true, workflowId: true } }),
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, resolvedAt: null, type: { key: 'BUG' } }, select: { priority: true } }),
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, originalEstimateMin: { gt: 0 }, type: { level: { gte: 0 } } }, select: { originalEstimateMin: true, timeSpentMin: true } }),
    prisma.workStage.findMany({ where: { projectId }, select: { n: true, name: true, status: true, plannedEnd: true, completedAt: true } }),
    prisma.workSprint.findFirst({ where: { projectId, state: 'ACTIVE' }, select: { id: true } }),
  ]);
  const withDue = open.filter((i) => i.dueDate);
  const overdue = withDue.filter((i) => i.dueDate! < today).length;
  const lateStages = stages.filter((s) => s.plannedEnd && (s.status !== 'DONE' ? s.plannedEnd < today : !!s.completedAt && s.completedAt.getTime() > s.plannedEnd.getTime() + DAY));
  const schedulePct = pct(overdue, withDue.length);
  const scheduleLevel = worstLevel([ragLevel(schedulePct, rules.schedule), lateStages.some((s) => s.status !== 'DONE') ? 'AMBER' : 'GREEN']);
  const creep = sprint ? await scopeCreep(projectId, sprint.id) : null;
  const scopePct = creep && creep.committed > 0 ? pct(creep.addedPoints, creep.committed) : creep && creep.addedIssues.length ? 100 : null;
  const bugScore = bugs.reduce((s, b) => s + (b.priority <= 2 ? 2 : 1), 0);
  const estMin = est.reduce((s, i) => s + (i.originalEstimateMin ?? 0), 0);
  const spentMin = est.reduce((s, i) => s + (i.timeSpentMin ?? 0), 0);
  const effortPct = estMin ? round1(Math.max(0, ((spentMin - estMin) / estMin) * 100)) : null;
  const dims = [
    { key: 'schedule', value: schedulePct, level: scheduleLevel, detail: { overdue, withDue: withDue.length, lateStages: lateStages.map((s) => `${s.n}. ${s.name}`) } },
    { key: 'scope', value: scopePct, level: ragLevel(scopePct, rules.scope), detail: creep ? { addedPoints: creep.addedPoints, committed: creep.committed, addedIssues: creep.addedIssues.length } : null },
    { key: 'quality', value: bugScore, level: ragLevel(bugScore, rules.quality), detail: { openBugs: bugs.length, highBugs: bugs.filter((b) => b.priority <= 2).length } },
    { key: 'effort', value: effortPct, level: ragLevel(effortPct, rules.effort), detail: { estimatedHours: round1(estMin / 60), loggedHours: round1(spentMin / 60) } },
  ] as const;
  // % hoàn thành có trọng số: thẻ tầng 0 (kể cả đã xong), trọng số = điểm/giờ.
  const all = await prisma.workIssue.findMany({ where: { projectId, deletedAt: null, type: { level: 0 } }, select: { statusId: true, storyPoints: true, originalEstimateMin: true }, take: 5000 });
  const weights = statusWeights(statuses);
  const completion = weightedCompletion(all.map((i) => ({ statusId: i.statusId, weight: effortOf(i, mode) })), weights);
  return { overall: worstLevel(dims.map((d) => d.level)), dimensions: dims, rules, completionPct: completion, issues: all.length };
}

// ═══ 4. Timeline: giai đoạn theo ngày kế hoạch (A17) ════════════════

/** Giai đoạn có ngày kế hoạch cho timeline. late = chưa xong mà quá ngày kết thúc / xong sau ngày kết thúc. */
export async function timelineStages(projectId: number, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const rows = await prisma.workStage.findMany({
    where: { projectId }, orderBy: { n: 'asc' },
    select: { id: true, n: true, name: true, status: true, plannedStart: true, plannedEnd: true, startedAt: true, completedAt: true },
  });
  const d = (x: Date | null) => (x ? x.toISOString().slice(0, 10) : null);
  return rows.map((s) => {
    const end = d(s.plannedEnd);
    const doneDay = d(s.completedAt);
    const late = !!end && (s.status === 'DONE' ? !!doneDay && doneDay > end : today > end);
    return { id: s.id, n: s.n, name: s.name, status: s.status, plannedStart: d(s.plannedStart), plannedEnd: end, startedAt: s.startedAt, completedAt: s.completedAt, late };
  });
}
