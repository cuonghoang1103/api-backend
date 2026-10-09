/**
 * CT Work — CTW đợt 5 (10/10/2026): HUB GIẢNG VIÊN (A28) + RUBRIC & ĐIỂM.
 *
 * Hub `/work/teaching` đọc XUYÊN KHÔNG GIAN mọi dự án mà người gọi mang vai TEACHER (hiệu lực — `loadProjectAccess`), kèm
 * sức khoẻ từng nhóm: tiến độ sprint / giai đoạn, việc trễ, tín hiệu đóng góp (contrib.service, 7 ngày), hồ sơ FPT đã nộp /
 * còn thiếu (Report 1–7, 5.1/5.2/5.3, Weekly, AI Usage), Q&A chưa trả lời, rủi ro mở, điểm đã chấm. Lọc theo môn / lớp /
 * kỳ, xuất xlsx / PDF, AI tóm tắt (purpose `work_digest` có sẵn — không đụng gateway.ts).
 *
 * Quyền: chỉ người là TEACHER ở ít nhất một dự án, hoặc giảng viên của một lớp (`work_classes.teacher_id`) — còn lại 403
 * WORK_TEACHING_ONLY. Agent: 403 (tuyến top-level không nằm trong danh sách trắng của token agent; service chặn lần hai).
 *
 * Điểm (`work_grades`): giảng viên (vai TEACHER của dự án) chấm theo rubric CỦA MÌNH cho cả nhóm hoặc từng thành viên,
 * theo mốc; sinh viên chỉ thấy khi đã công bố (`canSeeGrade`), điểm cá nhân chỉ chính người đó; mọi lần lưu / công bố /
 * thu hồi ghi `work_grade_history`.
 */

import PDFDocument from 'pdfkit';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { checkTokenQuota, isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { notoSansViBoldBuffer, notoSansViBuffer } from '../cv/export/font.js';
import { displayName, PUBLIC_USER } from './common.js';
import { summary as contribSummary } from './contrib.service.js';
import { notifyWork } from './notify.js';
import { countedIssueWhere } from './openIssues.js';
import { agentForbidden, loadProjectAccess, principalOf } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { activeSprintPace } from './sprintPace.js';
import { vnDay } from './sprints.service.js';
import {
  EXPECTED_DOCS, FPT_DOCS, RUBRIC_TEMPLATES, RubricError, canGrade, canSeeGrade, gradeSubjectKey, groupHealth, normalizeCriteria,
  rubricTemplate, subjectOfProject, validateScores, weightedTotal, type DocState, type FptDoc, type RubricCriterion,
} from './teachingRules.js';
import { writeXlsx, XSheet, type XStyle } from './xlsxStyled.js';

const DAY = 86_400_000;
const dbDate = (s: string) => new Date(`${s}T00:00:00Z`);

function wrapRubric<T>(fn: () => T): T {
  try { return fn(); } catch (e) {
    if (e instanceof RubricError) throw new BadRequestError(e.message, e.code === 'RUBRIC_WEIGHTS' ? 'WORK_RUBRIC_WEIGHTS' : 'WORK_RUBRIC_BAD');
    throw e;
  }
}

// ═══ Ai là giảng viên ══════════════════════════════════════════════

/** Id dự án mà `userId` mang vai TEACHER HIỆU LỰC (dòng dự án TEACHER, còn là thành viên không gian, không phải OWNER/ADMIN). */
export async function teachingProjectIds(userId: number): Promise<number[]> {
  const [rows, groups] = await Promise.all([
    prisma.workProjectMember.findMany({ where: { userId, role: 'TEACHER', project: { deletedAt: null, workspace: { deletedAt: null } } }, select: { projectId: true } }),
    prisma.workClassGroup.findMany({ where: { class: { teacherId: userId }, projectId: { not: null }, project: { deletedAt: null } }, select: { projectId: true } }),
  ]);
  const ids = [...new Set([...rows.map((r) => r.projectId), ...groups.map((g) => g.projectId!)])];
  const out: number[] = [];
  for (const id of ids) {
    const a = await loadProjectAccess(userId, id);
    if (a?.role === 'TEACHER') out.push(id);
  }
  return out;
}

export async function teachingAccess(userId: number) {
  if ((await principalOf(userId)) === 'AGENT') return { teaching: false, projects: 0, classes: 0 };
  const [ids, classes] = await Promise.all([teachingProjectIds(userId), prisma.workClass.count({ where: { teacherId: userId, archivedAt: null } })]);
  return { teaching: ids.length > 0 || classes > 0, projects: ids.length, classes };
}

async function requireTeaching(userId: number): Promise<number[]> {
  if ((await principalOf(userId)) === 'AGENT') throw await agentForbidden(userId, 'use the lecturer hub');
  const ids = await teachingProjectIds(userId);
  if (!ids.length && !(await prisma.workClass.count({ where: { teacherId: userId } }))) {
    throw new AppError('The lecturer hub is for people with the Teacher role in at least one project', 403, 'WORK_TEACHING_ONLY');
  }
  return ids;
}

// ═══ Tổng quan các nhóm ═══════════════════════════════════════════

export interface OverviewFilter { subject?: string; classCode?: string; term?: string; q?: string }

const REPORT_KEYS: Record<string, FptDoc> = {
  'fpt-report1-project-introduction': 'R1', 'fpt-report2-project-management-plan': 'R2', 'fpt-report3-srs': 'R3', 'fpt-report4-sds': 'R4',
  'fpt-report5-test-documentation': 'R5', 'fpt-report6-user-guides': 'R6', 'fpt-report7-final-report': 'R7',
};

/** Trạng thái hồ sơ FPT của nhiều dự án (một lượt truy vấn mỗi loại). */
async function docStates(ids: number[], weekStart: string): Promise<Map<number, Record<FptDoc, Exclude<DocState, 'NA'>>>> {
  const [pages, titled, testDocs, units, its, weekly, ai] = await Promise.all([
    prisma.workPage.findMany({ where: { projectId: { in: ids }, deletedAt: null, templateKey: { in: Object.keys(REPORT_KEYS) } }, select: { projectId: true, templateKey: true, status: true, contentText: true } }),
    prisma.workPage.findMany({ where: { projectId: { in: ids }, deletedAt: null, templateKey: null, title: { contains: 'report', mode: 'insensitive' } }, select: { projectId: true, title: true, status: true } }),
    prisma.workFptTestDoc.findMany({ where: { projectId: { in: ids } }, select: { projectId: true, unitIssueDate: true, intIssueDate: true, sysIssueDate: true } }),
    prisma.workUnitFunction.groupBy({ by: ['projectId'], where: { projectId: { in: ids } }, _count: { _all: true } }),
    prisma.workItModule.groupBy({ by: ['projectId', 'kind'], where: { projectId: { in: ids } }, _count: { _all: true } }),
    prisma.workWeeklyReport.findMany({ where: { projectId: { in: ids } }, orderBy: { weekStart: 'desc' }, select: { projectId: true, weekStart: true } }),
    prisma.workAiUsageLog.groupBy({ by: ['projectId'], where: { projectId: { in: ids } }, _count: { _all: true } }),
  ]);
  const out = new Map<number, Record<FptDoc, Exclude<DocState, 'NA'>>>();
  const lastWeek = dbDate(weekStart).getTime() - 7 * DAY;
  for (const id of ids) {
    const s = Object.fromEntries(FPT_DOCS.map((d) => [d, 'MISSING'])) as Record<FptDoc, Exclude<DocState, 'NA'>>;
    const rank = (x: string) => (x === 'SUBMITTED' ? 2 : x === 'DRAFT' ? 1 : 0);
    const set = (d: FptDoc, v: Exclude<DocState, 'NA'>) => { if (rank(v) > rank(s[d])) s[d] = v; };
    for (const p of pages.filter((x) => x.projectId === id)) {
      const d = REPORT_KEYS[p.templateKey!];
      set(d, p.status === 'IN_REVIEW' || p.status === 'APPROVED' ? 'SUBMITTED' : 'DRAFT');
    }
    for (const p of titled.filter((x) => x.projectId === id)) {
      const m = /report\s*([1-7])(?![.\d])/i.exec(p.title);
      if (m) set(`R${m[1]}` as FptDoc, p.status === 'IN_REVIEW' || p.status === 'APPROVED' ? 'SUBMITTED' : 'DRAFT');
    }
    const td = testDocs.find((t) => t.projectId === id);
    const u = units.find((x) => x.projectId === id)?._count._all ?? 0;
    const it = (k: string) => its.find((x) => x.projectId === id && x.kind === k)?._count._all ?? 0;
    if (u) set('T51', td?.unitIssueDate ? 'SUBMITTED' : 'DRAFT');
    if (it('INT')) set('T52', td?.intIssueDate ? 'SUBMITTED' : 'DRAFT');
    if (it('SYS')) set('T53', td?.sysIssueDate ? 'SUBMITTED' : 'DRAFT');
    const w = weekly.filter((x) => x.projectId === id);
    if (w.length) set('WEEKLY', w[0].weekStart.getTime() >= lastWeek ? 'SUBMITTED' : 'DRAFT');
    if (ai.find((x) => x.projectId === id)?._count._all) set('AI', 'SUBMITTED');
    out.set(id, s);
  }
  return out;
}

function mondayOf(day: string): string {
  const d = dbDate(day);
  return new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * DAY).toISOString().slice(0, 10);
}

export interface GroupRow {
  projectId: number; key: string; name: string; href: string; workspace: string; archived: boolean;
  subject: string; classCode: string | null; term: string | null; groupCode: string | null; classId: number | null; className: string | null;
  members: Array<{ id: number; name: string; username: string; role: string; status: string | null; signals: string[] }>;
  issues: { open: number; overdue: number; done14: number };
  sprint: { name: string; status: string; done: number; total: number; daysLeft: number; atRisk: boolean } | null;
  stage: { n: number; name: string; total: number; completed: number } | null;
  contrib: { completed: number; actions: number; attention: number; lastActiveDay: string | null; silentDays: number | null } | null;
  docs: Record<FptDoc, DocState>;
  docsExpected: number; docsSubmitted: number; docsMissing: number;
  qna: { open: number; oldestDays: number };
  risks: { open: number; high: number };
  grades: { total: number; published: number; latestMilestone: string | null };
  health: ReturnType<typeof groupHealth>;
}

async function buildRows(userId: number, ids: number[]): Promise<GroupRow[]> {
  if (!ids.length) return [];
  const today = vnDay();
  const now = new Date();
  const projects = await prisma.workProject.findMany({
    where: { id: { in: ids } },
    select: {
      id: true, key: true, name: true, template: true, archivedAt: true, createdAt: true, workspace: { select: { slug: true, name: true } },
      fptReportDoc: { select: { subjectCode: true, classCode: true, semester: true, groupCode: true } },
      classGroup: { select: { class: { select: { id: true, name: true, subject: true, classCode: true, term: true } } } },
    },
  });
  const base = { projectId: { in: ids }, ...countedIssueWhere() };
  const [openG, overdueG, doneG, stages, qna, risks, grades, docs] = await Promise.all([
    prisma.workIssue.groupBy({ by: ['projectId'], where: { ...base, resolvedAt: null }, _count: { _all: true } }),
    prisma.workIssue.groupBy({ by: ['projectId'], where: { ...base, resolvedAt: null, dueDate: { lt: dbDate(today) } }, _count: { _all: true } }),
    prisma.workIssue.groupBy({ by: ['projectId'], where: { ...base, resolvedAt: { gte: new Date(now.getTime() - 14 * DAY) } }, _count: { _all: true } }),
    prisma.workStage.findMany({ where: { projectId: { in: ids } }, orderBy: [{ projectId: 'asc' }, { n: 'asc' }], select: { projectId: true, n: true, name: true, status: true } }),
    prisma.workRaidItem.findMany({ where: { projectId: { in: ids }, deletedAt: null, type: 'QUESTION', status: 'OPEN' }, select: { projectId: true, createdAt: true } }),
    prisma.workRaidItem.findMany({ where: { projectId: { in: ids }, deletedAt: null, type: 'RISK', status: { in: ['OPEN', 'MONITORING'] } }, select: { projectId: true, probability: true, impact: true } }),
    prisma.workGrade.findMany({ where: { projectId: { in: ids } }, orderBy: { updatedAt: 'desc' }, select: { projectId: true, publishedAt: true, milestone: true } }),
    docStates(ids, mondayOf(today)),
  ]);
  const cnt = (g: Array<{ projectId: number; _count: { _all: number } }>, id: number) => g.find((x) => x.projectId === id)?._count._all ?? 0;

  const rows: GroupRow[] = [];
  // Mỗi dự án vài truy vấn (sprint pace, thành viên, đóng góp) — chạy 4 dự án một lượt để không dội DB.
  const queue = [...projects];
  const work = async () => {
    for (let p = queue.shift(); p; p = queue.shift()) {
      const id = p.id;
      const cls = p.classGroup?.class ?? null;
      const subject = cls?.subject ?? subjectOfProject({ template: p.template, subjectCode: p.fptReportDoc?.subjectCode });
      const [pace, people, contrib] = await Promise.all([
        activeSprintPace(id).catch(() => null),
        projectMembers(id),
        contribSummary(userId, id, { preset: '7d', compare: false }).catch((err) => { logger.warn('[work] teaching: contrib lỗi', { id, err: (err as Error).message }); return null; }),
      ]);
      const team = people.filter((m) => (m.role === 'ADMIN' || m.role === 'MEMBER') && m.kind !== 'AGENT');
      const ps = stages.filter((s) => s.projectId === id);
      const cur = ps.find((s) => s.status === 'ACTIVE' || s.status === 'GATE_REVIEW') ?? [...ps].reverse().find((s) => s.status === 'DONE') ?? ps[0];
      const heat = contrib?.charts.heatmap ?? [];
      const lastActive = [...heat].reverse().find(([, n]) => n > 0)?.[0] ?? null;
      // Chưa có hoạt động nào ⇒ tính từ ngày tạo dự án (nhóm vừa lập hôm qua không phải "im lặng 182 ngày").
      const silentDays = contrib ? Math.max(0, Math.round((dbDate(today).getTime() - (lastActive ? dbDate(lastActive).getTime() : dbDate(p.createdAt.toISOString().slice(0, 10)).getTime())) / DAY)) : null;
      const q = qna.filter((x) => x.projectId === id);
      const r = risks.filter((x) => x.projectId === id);
      const high = r.filter((x) => (x.probability ?? 0) * (x.impact ?? 0) >= 12 || (x.impact ?? 0) >= 4).length;
      const g = grades.filter((x) => x.projectId === id);
      const expectedSet = new Set(EXPECTED_DOCS[subject as keyof typeof EXPECTED_DOCS] ?? EXPECTED_DOCS.UNKNOWN);
      const raw = docs.get(id)!;
      const docMap = Object.fromEntries(FPT_DOCS.map((d) => [d, expectedSet.has(d) ? raw[d] : (raw[d] === 'MISSING' ? 'NA' : raw[d])])) as Record<FptDoc, DocState>;
      const docsSubmitted = [...expectedSet].filter((d) => raw[d] === 'SUBMITTED').length;
      const docsMissing = [...expectedSet].filter((d) => raw[d] === 'MISSING').length;
      const memberRows = team.map((m) => {
        const row = contrib?.members.find((x) => x.user.id === m.id);
        return { id: m.id, name: displayName(m), username: m.username, role: m.role, status: row?.status ?? null, signals: row?.signals.map((s) => s.text) ?? [] };
      });
      const issues = { open: cnt(openG, id), overdue: cnt(overdueG, id), done14: cnt(doneG, id) };
      const oldestDays = q.length ? Math.floor((now.getTime() - Math.min(...q.map((x) => x.createdAt.getTime()))) / DAY) : 0;
      rows.push({
        projectId: id, key: p.key, name: p.name, href: `/work/${p.workspace.slug}/${p.key}`, workspace: p.workspace.name, archived: !!p.archivedAt,
        subject: String(subject), classCode: cls?.classCode ?? p.fptReportDoc?.classCode ?? null, term: cls?.term ?? p.fptReportDoc?.semester ?? null,
        groupCode: p.fptReportDoc?.groupCode ?? null, classId: cls?.id ?? null, className: cls?.name ?? null,
        members: memberRows,
        issues,
        sprint: pace ? { name: pace.sprint, status: pace.status, done: pace.done, total: pace.total, daysLeft: pace.daysLeft, atRisk: pace.atRisk } : null,
        stage: cur ? { n: cur.n, name: cur.name, total: ps.length, completed: ps.filter((s) => s.status === 'DONE').length } : null,
        contrib: contrib ? { completed: contrib.team.totals.completed, actions: contrib.team.totals.actions, attention: contrib.team.attention, lastActiveDay: lastActive, silentDays } : null,
        docs: docMap, docsExpected: expectedSet.size, docsSubmitted, docsMissing,
        qna: { open: q.length, oldestDays },
        risks: { open: r.length, high },
        grades: { total: g.length, published: g.filter((x) => x.publishedAt).length, latestMilestone: g[0]?.milestone ?? null },
        health: groupHealth({
          overdue: issues.overdue, open: issues.open, sprintAtRisk: !!pace?.atRisk, unansweredQna: q.length, oldestQnaDays: oldestDays,
          openHighRisks: high, missingDocs: docsMissing, attentionMembers: contrib?.team.attention ?? 0, silentDays,
        }),
      });
    }
  };
  await Promise.all([work(), work(), work(), work()]);
  return rows.sort((a, b) => (a.classCode ?? '').localeCompare(b.classCode ?? '') || (a.groupCode ?? a.key).localeCompare(b.groupCode ?? b.key) || a.name.localeCompare(b.name));
}

const norm = (s: string | null | undefined) => (s ?? '').trim().toUpperCase();

export async function overview(userId: number, f: OverviewFilter = {}) {
  const t0 = Date.now();
  const ids = await requireTeaching(userId);
  const all = await buildRows(userId, ids);
  const facets = {
    subjects: [...new Set(all.map((r) => r.subject))].sort(),
    classes: [...new Set(all.map((r) => r.classCode).filter(Boolean) as string[])].sort(),
    terms: [...new Set(all.map((r) => r.term).filter(Boolean) as string[])].sort(),
  };
  const q = (f.q ?? '').trim().toLowerCase();
  const groups = all.filter((r) => (!f.subject || norm(r.subject) === norm(f.subject))
    && (!f.classCode || norm(r.classCode) === norm(f.classCode))
    && (!f.term || norm(r.term) === norm(f.term))
    && (!q || `${r.name} ${r.key} ${r.groupCode ?? ''} ${r.members.map((m) => `${m.name} ${m.username}`).join(' ')}`.toLowerCase().includes(q)));
  const totals = {
    groups: groups.length,
    red: groups.filter((g) => g.health.status === 'red').length,
    amber: groups.filter((g) => g.health.status === 'amber').length,
    green: groups.filter((g) => g.health.status === 'green').length,
    students: groups.reduce((a, g) => a + g.members.length, 0),
    overdue: groups.reduce((a, g) => a + g.issues.overdue, 0),
    qnaOpen: groups.reduce((a, g) => a + g.qna.open, 0),
    docsMissing: groups.reduce((a, g) => a + g.docsMissing, 0),
  };
  return { generatedAt: new Date().toISOString(), filter: f, facets, totals, groups, tookMs: Date.now() - t0 };
}

// ─── Xuất ───────────────────────────────────────────────────────

const H: XStyle = { font: { b: true, color: 'FFFFFF' }, fill: '1F3B57', border: 'thin', align: { v: 'center', wrap: true } };
const C: XStyle = { border: 'thin', align: { v: 'top', wrap: true } };
const N: XStyle = { border: 'thin', align: { h: 'right', v: 'top' } };
const DOC_LABEL: Record<FptDoc, string> = { R1: 'Report 1', R2: 'Report 2', R3: 'Report 3', R4: 'Report 4', R5: 'Report 5', R6: 'Report 6', R7: 'Report 7', T51: '5.1 Unit', T52: '5.2 Integration', T53: '5.3 System', WEEKLY: 'Weekly', AI: 'AI usage' };
const DOC_TEXT: Record<DocState, string> = { SUBMITTED: 'Submitted', DRAFT: 'Draft', MISSING: 'Missing', NA: 'n/a' };
const HEALTH_TEXT = { red: 'At risk', amber: 'Watch', green: 'On track' } as const;
export const REASON_TEXT: Record<string, (n: number) => string> = {
  OVERDUE: (n) => `${n} overdue issue${n === 1 ? '' : 's'}`,
  SPRINT_AT_RISK: () => 'Sprint behind pace',
  QNA_WAITING: (n) => `${n} question${n === 1 ? '' : 's'} to the lecturer waiting`,
  HIGH_RISKS: (n) => `${n} high risk${n === 1 ? '' : 's'} open`,
  DOCS_MISSING: (n) => `${n} required document${n === 1 ? '' : 's'} missing`,
  MEMBERS_ATTENTION: (n) => `${n} member${n === 1 ? '' : 's'} need attention`,
  TEAM_SILENT: (n) => `No activity for ${n} days`,
};
const reasonsText = (g: GroupRow) => g.health.reasons.map((r) => REASON_TEXT[r.code]?.(r.n) ?? r.code).join('; ') || '—';
const stamp = () => new Date().toISOString().slice(0, 10);

export async function exportOverviewXlsx(userId: number, f: OverviewFilter) {
  const o = await overview(userId, f);
  const g = new XSheet('Groups');
  const cols: Array<[string, number, (r: GroupRow) => string | number | null]> = [
    ['Class', 12, (r) => r.classCode], ['Term', 8, (r) => r.term], ['Subject', 10, (r) => r.subject], ['Group', 12, (r) => r.groupCode ?? r.key],
    ['Project', 30, (r) => r.name], ['Members', 8, (r) => r.members.length], ['Health', 10, (r) => HEALTH_TEXT[r.health.status]], ['Why', 44, reasonsText],
    ['Stage', 26, (r) => (r.stage ? `${r.stage.n}/${r.stage.total} ${r.stage.name}` : '—')],
    ['Sprint', 22, (r) => (r.sprint ? `${r.sprint.name}: ${r.sprint.done}/${r.sprint.total}${r.sprint.atRisk ? ' (behind)' : ''}` : '—')],
    ['Open', 8, (r) => r.issues.open], ['Overdue', 8, (r) => r.issues.overdue], ['Done 14d', 8, (r) => r.issues.done14],
    ['Activity 7d', 10, (r) => r.contrib?.actions ?? null], ['Members flagged', 10, (r) => r.contrib?.attention ?? null],
    ['Q&A open', 9, (r) => r.qna.open], ['Risks open', 9, (r) => r.risks.open], ['High risks', 9, (r) => r.risks.high],
    ['Docs submitted', 10, (r) => `${r.docsSubmitted}/${r.docsExpected}`],
    ...FPT_DOCS.map((d) => [DOC_LABEL[d], 10, (r: GroupRow) => DOC_TEXT[r.docs[d]]] as [string, number, (r: GroupRow) => string]),
    ['Grades (published/total)', 12, (r) => `${r.grades.published}/${r.grades.total}`],
  ];
  cols.forEach(([h, w], i) => g.set(1, i + 1, h, H).width(i + 1, w));
  g.height(1, 32);
  g.freeze = { col: 5, row: 1 };
  o.groups.forEach((r, ri) => cols.forEach(([, , fn], ci) => { const v = fn(r); g.set(ri + 2, ci + 1, v ?? '—', typeof v === 'number' ? N : C); }));

  const m = new XSheet('Members');
  ['Group', 'Project', 'Member', 'Username', 'Role', 'Status (7 days)', 'Signals'].forEach((h, i) => m.set(1, i + 1, h, H).width(i + 1, [12, 28, 24, 18, 10, 14, 60][i]));
  let row = 2;
  for (const r of o.groups) for (const p of r.members) {
    m.set(row, 1, r.groupCode ?? r.key, C).set(row, 2, r.name, C).set(row, 3, p.name, C).set(row, 4, p.username, C).set(row, 5, p.role, C).set(row, 6, p.status ?? '—', C).set(row, 7, p.signals.join('; ') || '—', C);
    row += 1;
  }
  const grades = await prisma.workGrade.findMany({
    where: { projectId: { in: o.groups.map((x) => x.projectId) } }, orderBy: [{ projectId: 'asc' }, { milestone: 'asc' }, { subjectKey: 'asc' }],
    select: { projectId: true, milestone: true, subjectUserId: true, total: true, publishedAt: true, rubric: { select: { name: true } } },
  });
  const gs = new XSheet('Grades');
  ['Group', 'Project', 'Milestone', 'Rubric', 'For', 'Total', 'Published'].forEach((h, i) => gs.set(1, i + 1, h, H).width(i + 1, [12, 28, 24, 30, 24, 8, 12][i]));
  grades.forEach((x, i) => {
    const grp = o.groups.find((y) => y.projectId === x.projectId)!;
    const who = x.subjectUserId ? grp.members.find((p) => p.id === x.subjectUserId)?.name ?? `#${x.subjectUserId}` : 'Whole team';
    gs.set(i + 2, 1, grp.groupCode ?? grp.key, C).set(i + 2, 2, grp.name, C).set(i + 2, 3, x.milestone, C).set(i + 2, 4, x.rubric.name, C).set(i + 2, 5, who, C).set(i + 2, 6, x.total ?? '—', N).set(i + 2, 7, x.publishedAt ? x.publishedAt.toISOString().slice(0, 10) : 'Draft', C);
  });
  return { buf: writeXlsx([g, m, gs], { title: 'Lecturer hub — groups', creator: 'CT Work' }), fileName: `ctwork-teaching-${stamp()}.xlsx` };
}

export async function exportOverviewPdf(userId: number, f: OverviewFilter) {
  const o = await overview(userId, f);
  const buf = await new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 30, info: { Title: 'Lecturer hub — groups', Creator: 'CT Work' } });
    const chunks: Buffer[] = [];
    doc.on('data', (c: Buffer) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.registerFont('vi', notoSansViBuffer());
    doc.registerFont('vi-bold', notoSansViBoldBuffer());
    const left = 30, width = doc.page.width - 60;
    const filt = [f.subject, f.classCode, f.term].filter(Boolean).join(' · ') || 'All groups';
    doc.font('vi-bold').fontSize(14).fillColor('#0f172a').text('Lecturer hub — group health', left, 30, { width });
    doc.font('vi').fontSize(8.5).fillColor('#64748b').text(`${filt} · ${o.totals.groups} groups · ${o.totals.students} students · generated ${stamp()}`, { width });
    doc.moveDown(0.5);
    const cols: Array<{ label: string; w: number; get: (r: GroupRow) => string }> = [
      { label: 'Group', w: 70, get: (r) => `${r.classCode ?? ''} ${r.groupCode ?? r.key}`.trim() },
      { label: 'Project', w: 140, get: (r) => r.name },
      { label: 'Health', w: 52, get: (r) => HEALTH_TEXT[r.health.status] },
      { label: 'Stage / sprint', w: 120, get: (r) => [r.stage ? `S${r.stage.n}/${r.stage.total}` : '', r.sprint ? `${r.sprint.done}/${r.sprint.total}${r.sprint.atRisk ? ' behind' : ''}` : ''].filter(Boolean).join(' · ') || '—' },
      { label: 'Overdue', w: 44, get: (r) => `${r.issues.overdue}/${r.issues.open}` },
      { label: 'Q&A', w: 32, get: (r) => `${r.qna.open}` },
      { label: 'Risks', w: 36, get: (r) => `${r.risks.high}/${r.risks.open}` },
      { label: 'Docs', w: 40, get: (r) => `${r.docsSubmitted}/${r.docsExpected}` },
      { label: 'Why', w: width - 534, get: reasonsText },
    ];
    let y = doc.y;
    let x = left;
    doc.font('vi-bold').fontSize(8).fillColor('#334155');
    for (const c of cols) { doc.text(c.label, x + 2, y, { width: c.w - 4 }); x += c.w; }
    doc.moveTo(left, y + 12).lineTo(left + width, y + 12).strokeColor('#cbd5e1').lineWidth(0.6).stroke();
    y += 16;
    doc.font('vi').fontSize(8).fillColor('#0f172a');
    const color = { red: '#b91c1c', amber: '#a16207', green: '#15803d' } as const;
    for (const r of o.groups) {
      if (y > doc.page.height - 50) { doc.addPage(); y = 30; }
      x = left;
      for (const c of cols) {
        doc.fillColor(c.label === 'Health' ? color[r.health.status] : '#0f172a').text(c.get(r), x + 2, y, { width: c.w - 4, height: 22, ellipsis: true });
        x += c.w;
      }
      y += 24;
    }
    if (!o.groups.length) doc.fillColor('#64748b').text('No groups match this filter.', left, y);
    doc.font('vi').fontSize(7.5).fillColor('#475569').text('Health is a starting point for a conversation, not a grade: red = overdue work piling up, a question waiting a week or more, several high risks, or two weeks without activity. Details per member: Excel export, sheet "Members".', left, doc.page.height - 44, { width });
    doc.end();
  });
  return { buf, fileName: `ctwork-teaching-${stamp()}.pdf` };
}

// ─── AI tóm tắt ─────────────────────────────────────────────────

let askOverride: ((system: string, user: string) => Promise<string>) | null = null;
/** CHỈ cho test. */
export function _setTeachingAskForTests(fn: ((system: string, user: string) => Promise<string>) | null) { askOverride = fn; }

/** Sự thật (không tên đầy đủ ngoài tên hiển thị trong dự án) mà AI được dùng — cũng là đầu ra của lệnh registry. */
export function factsOf(groups: GroupRow[]): string {
  return groups.map((g) => [
    `- ${g.classCode ?? ''} ${g.groupCode ?? g.key} "${g.name}" (${g.subject}, ${g.members.length} members): health ${HEALTH_TEXT[g.health.status]} — ${reasonsText(g)}.`,
    `  Stage ${g.stage ? `${g.stage.n}/${g.stage.total} ${g.stage.name}` : 'n/a'}; sprint ${g.sprint ? `${g.sprint.name} ${g.sprint.done}/${g.sprint.total} (${g.sprint.status})` : 'none'}; open ${g.issues.open}, overdue ${g.issues.overdue}, done in 14 days ${g.issues.done14}.`,
    `  Docs submitted ${g.docsSubmitted}/${g.docsExpected}; missing: ${FPT_DOCS.filter((d) => g.docs[d] === 'MISSING').map((d) => DOC_LABEL[d]).join(', ') || 'none'}. Q&A waiting ${g.qna.open}${g.qna.open ? ` (oldest ${g.qna.oldestDays} days)` : ''}. Risks open ${g.risks.open} (high ${g.risks.high}).`,
    `  Members flagged (last 7 days): ${g.members.filter((m) => m.signals.length).map((m) => `${m.name}: ${m.signals.join('; ')}`).join(' | ') || 'none'}.`,
  ].join('\n')).join('\n');
}

export async function aiSummary(userId: number, f: OverviewFilter & { language?: 'en' | 'vi' }) {
  const o = await overview(userId, f);
  if (!o.groups.length) return { summary: f.language === 'vi' ? 'Không có nhóm nào khớp bộ lọc.' : 'No groups match this filter.', facts: '', groups: 0 };
  const facts = factsOf(o.groups);
  const system = `You help a university lecturer supervise student project groups. Using ONLY the facts given, write a short briefing: 1) one-paragraph overall picture, 2) "Needs you this week" — the groups to contact first and why (cite the numbers), 3) "Going well", 4) suggested next actions for the lecturer (max 5 bullets). Never invent numbers, names or work. Counts are activity, not quality — never label a student. Markdown. ${f.language === 'vi' ? 'Write in Vietnamese.' : 'Write in English.'} Return ONLY JSON: {"summary":"markdown"}`;
  let text: string;
  if (askOverride) text = await askOverride(system, facts);
  else {
    if (!isAiAvailable('work')) throw new AppError('The AI assistant is temporarily unavailable. Please try again later.', 503, 'WORK_AI_UNAVAILABLE');
    if (!(await checkTokenQuota(userId))) throw new AppError('You have reached today’s AI usage limit.', 429, 'WORK_AI_TOKEN_CAP');
    const r = await llmComplete({ step: 'report', system, messages: [{ role: 'user', content: facts }], maxTokens: 1600, userId, feature: 'work', purpose: 'work_digest', timeoutMs: 90_000, maxRetries: 2 });
    text = r.text;
  }
  let summary = text;
  try {
    const m = /\{[\s\S]*\}/.exec(text);
    const j = m ? JSON.parse(m[0]) as { summary?: unknown } : null;
    if (j && typeof j.summary === 'string') summary = j.summary;
  } catch { /* trả nguyên văn */ }
  return { summary, facts, groups: o.groups.length };
}

// ═══ Rubric ═══════════════════════════════════════════════════════

const RUBRIC_SELECT = { id: true, name: true, subject: true, description: true, criteria: true, scaleMax: true, templateKey: true, archivedAt: true, createdAt: true, updatedAt: true, ownerId: true } as const;
const crit = (raw: unknown) => (Array.isArray(raw) ? raw : []) as RubricCriterion[];

export async function listRubrics(userId: number) {
  await requireTeaching(userId);
  const rows = await prisma.workRubric.findMany({ where: { ownerId: userId, archivedAt: null }, orderBy: { updatedAt: 'desc' }, select: { ...RUBRIC_SELECT, _count: { select: { grades: true } } } });
  return {
    rubrics: rows.map((r) => ({ ...r, criteria: crit(r.criteria), gradeCount: r._count.grades })),
    templates: RUBRIC_TEMPLATES.map((t) => ({ key: t.key, name: t.name, subject: t.subject, description: t.description, milestones: t.milestones, criteria: t.criteria, scaleMax: t.scaleMax })),
  };
}

export interface RubricInput { templateKey?: string; name?: string; subject?: string | null; description?: string | null; criteria?: unknown; scaleMax?: number }

export async function createRubric(userId: number, input: RubricInput) {
  await requireTeaching(userId);
  if ((await prisma.workRubric.count({ where: { ownerId: userId, archivedAt: null } })) >= 100) throw new BadRequestError('You can keep at most 100 rubrics', 'WORK_LIMIT');
  const tpl = input.templateKey ? rubricTemplate(input.templateKey) : undefined;
  if (input.templateKey && !tpl) throw new BadRequestError('Unknown rubric template', 'WORK_RUBRIC_BAD');
  const scaleMax = input.scaleMax ?? tpl?.scaleMax ?? 10;
  if (!(scaleMax > 0 && scaleMax <= 100)) throw new BadRequestError('Scale must be between 1 and 100', 'WORK_RUBRIC_BAD');
  const criteria = wrapRubric(() => normalizeCriteria(input.criteria ?? tpl?.criteria, scaleMax));
  const name = (input.name?.trim() || tpl?.name || '').slice(0, 120);
  if (!name) throw new BadRequestError('Name the rubric', 'WORK_RUBRIC_BAD');
  const r = await prisma.workRubric.create({
    data: {
      ownerId: userId, name, subject: (input.subject ?? tpl?.subject ?? null)?.slice(0, 16) || null,
      description: (input.description ?? tpl?.description ?? null)?.slice(0, 4000) || null,
      criteria: criteria as unknown as Prisma.InputJsonValue, scaleMax, templateKey: tpl?.key ?? null,
    },
    select: RUBRIC_SELECT,
  });
  return { ...r, criteria: crit(r.criteria) };
}

export async function updateRubric(userId: number, rubricId: number, input: RubricInput) {
  await requireTeaching(userId);
  const r = await prisma.workRubric.findFirst({ where: { id: rubricId, ownerId: userId }, select: { ...RUBRIC_SELECT, _count: { select: { grades: true } } } });
  if (!r) throw new NotFoundError('Rubric not found');
  const scaleMax = input.scaleMax ?? r.scaleMax;
  const criteria = input.criteria !== undefined ? wrapRubric(() => normalizeCriteria(input.criteria, scaleMax)) : crit(r.criteria);
  if (r._count.grades) {
    const before = crit(r.criteria).map((c) => c.key).sort().join('|');
    if (before !== criteria.map((c) => c.key).sort().join('|') || scaleMax !== r.scaleMax) {
      throw new ConflictError('This rubric already has grades — you can rename criteria and change weights, but not add, remove or rescale them. Duplicate it instead.');
    }
  }
  const updated = await prisma.workRubric.update({
    where: { id: r.id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim().slice(0, 120) || r.name } : {}),
      ...(input.subject !== undefined ? { subject: input.subject?.slice(0, 16) || null } : {}),
      ...(input.description !== undefined ? { description: input.description?.slice(0, 4000) || null } : {}),
      criteria: criteria as unknown as Prisma.InputJsonValue, scaleMax,
    },
    select: RUBRIC_SELECT,
  });
  // Trọng số đổi ⇒ tính lại tổng của mọi điểm dùng rubric này (lịch sử giữ nguyên số cũ).
  if (r._count.grades && input.criteria !== undefined) {
    const gs = await prisma.workGrade.findMany({ where: { rubricId: r.id }, select: { id: true, scores: true } });
    for (const g of gs) await prisma.workGrade.update({ where: { id: g.id }, data: { total: weightedTotal(criteria, g.scores as Record<string, number>) } });
  }
  return { ...updated, criteria: crit(updated.criteria) };
}

export async function archiveRubric(userId: number, rubricId: number) {
  await requireTeaching(userId);
  const r = await prisma.workRubric.updateMany({ where: { id: rubricId, ownerId: userId, archivedAt: null }, data: { archivedAt: new Date() } });
  if (!r.count) throw new NotFoundError('Rubric not found');
}

// ═══ Điểm theo mốc ════════════════════════════════════════════════

async function gradeGate(userId: number, projectId: number) {
  const access = await loadProjectAccess(userId, projectId);
  if (!access) throw new NotFoundError('Project not found');
  if (access.principal === 'AGENT') throw await agentForbidden(userId, 'see or give grades');
  return access;
}

const GRADE_SELECT = {
  id: true, projectId: true, rubricId: true, milestone: true, stageId: true, subjectKey: true, subjectUserId: true, scores: true, notes: true,
  comment: true, total: true, graderId: true, publishedAt: true, version: true, createdAt: true, updatedAt: true,
} as const;

async function teamOf(projectId: number) {
  return (await projectMembers(projectId)).filter((m) => (m.role === 'ADMIN' || m.role === 'MEMBER') && m.kind !== 'AGENT');
}

export async function gradesView(userId: number, projectId: number) {
  const access = await gradeGate(userId, projectId);
  const viewer = { userId, role: access.role };
  if (access.role !== 'TEACHER' && access.role !== 'ADMIN' && access.role !== 'MEMBER') {
    throw new AppError('Grades are visible to the project team and the lecturer', 403, 'WORK_GRADES_FORBIDDEN');
  }
  const [grades, team, stages, project] = await Promise.all([
    prisma.workGrade.findMany({ where: { projectId }, orderBy: [{ milestone: 'asc' }, { subjectKey: 'asc' }], select: { ...GRADE_SELECT, rubric: { select: RUBRIC_SELECT } } }),
    teamOf(projectId),
    prisma.workStage.findMany({ where: { projectId }, orderBy: { n: 'asc' }, select: { id: true, n: true, name: true } }),
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { template: true, fptReportDoc: { select: { subjectCode: true } }, classGroup: { select: { class: { select: { subject: true } } } } } }),
  ]);
  const graders = new Map((await prisma.user.findMany({ where: { id: { in: [...new Set(grades.map((g) => g.graderId))] } }, select: PUBLIC_USER })).map((u) => [u.id, u]));
  const visible = grades.filter((g) => canSeeGrade(viewer, g)).map((g) => ({
    ...g, rubric: { ...g.rubric, criteria: crit(g.rubric.criteria) }, grader: graders.get(g.graderId) ?? null,
    // Sinh viên không thấy số phiên bản / bản nháp; giảng viên thấy hết.
  }));
  const teacher = access.role === 'TEACHER';
  const subject = project.classGroup?.class.subject ?? subjectOfProject({ template: project.template, subjectCode: project.fptReportDoc?.subjectCode });
  const mine = teacher
    ? await prisma.workRubric.findMany({ where: { OR: [{ ownerId: userId, archivedAt: null }, { id: { in: [...new Set(grades.map((g) => g.rubricId))] } }] }, orderBy: { updatedAt: 'desc' }, select: RUBRIC_SELECT })
    : [];
  return {
    mode: teacher ? 'teacher' as const : 'student' as const,
    grades: visible,
    hiddenDrafts: teacher ? 0 : grades.filter((g) => !g.publishedAt && (g.subjectUserId === null || g.subjectUserId === userId)).length,
    team: team.map((m) => ({ id: m.id, name: displayName(m), username: m.username, avatarUrl: m.avatarUrl })),
    stages,
    rubrics: mine.map((r) => ({ ...r, criteria: crit(r.criteria) })),
    milestoneHints: RUBRIC_TEMPLATES.filter((t) => t.subject === subject || (subject === 'CAPSTONE' && t.subject === 'SEP490') || (subject === 'ISP490' && t.subject === 'SEP490')).flatMap((t) => t.milestones),
  };
}

export interface GradeInput {
  rubricId: number; milestone: string; stageId?: number | null; subjectUserId?: number | null;
  scores: Record<string, unknown>; notes?: Record<string, unknown>; comment?: string | null; publish?: boolean;
}

export async function saveGrade(userId: number, projectId: number, input: GradeInput) {
  const access = await gradeGate(userId, projectId);
  if (!canGrade(access.role)) throw new AppError('Only the lecturer (Teacher role) can grade this project', 403, 'WORK_GRADES_FORBIDDEN');
  const milestone = String(input.milestone ?? '').trim().slice(0, 80);
  if (!milestone) throw new BadRequestError('Name the milestone (e.g. SWP-M1 or Report 3)', 'WORK_GRADE_BAD');
  const rubric = await prisma.workRubric.findFirst({
    where: { id: input.rubricId, OR: [{ ownerId: userId }, { grades: { some: { projectId } } }] },
    select: { id: true, criteria: true, scaleMax: true, archivedAt: true, ownerId: true },
  });
  if (!rubric) throw new NotFoundError('Rubric not found');
  if (rubric.archivedAt && rubric.ownerId === userId && !(await prisma.workGrade.count({ where: { projectId, rubricId: rubric.id } }))) {
    throw new BadRequestError('This rubric is archived', 'WORK_RUBRIC_BAD');
  }
  const criteria = crit(rubric.criteria);
  const scores = wrapRubric(() => validateScores(criteria, input.scores, rubric.scaleMax));
  const keys = new Set(criteria.map((c) => c.key));
  const notes = Object.fromEntries(Object.entries(input.notes ?? {}).filter(([k, v]) => keys.has(k) && typeof v === 'string' && v.trim()).map(([k, v]) => [k, String(v).trim().slice(0, 2000)]));
  const subjectUserId = input.subjectUserId ?? null;
  if (subjectUserId && !(await teamOf(projectId)).some((m) => m.id === subjectUserId)) throw new BadRequestError('That person is not a student member of this project', 'WORK_GRADE_BAD');
  if (input.stageId && !(await prisma.workStage.count({ where: { id: input.stageId, projectId } }))) throw new BadRequestError('Stage not found in this project', 'WORK_GRADE_BAD');
  const total = weightedTotal(criteria, scores);
  const comment = input.comment?.trim().slice(0, 8000) || null;
  const subjectKey = gradeSubjectKey(subjectUserId);
  const now = new Date();
  const g = await prisma.$transaction(async (tx) => {
    const cur = await tx.workGrade.findFirst({ where: { projectId, rubricId: rubric.id, milestone, subjectKey }, select: { id: true, publishedAt: true, version: true } });
    const publishedAt = input.publish === true ? (cur?.publishedAt ?? now) : input.publish === false ? null : cur?.publishedAt ?? null;
    const data = { scores: scores as Prisma.InputJsonValue, notes: notes as Prisma.InputJsonValue, comment, total, graderId: userId, stageId: input.stageId ?? null, publishedAt };
    const saved = cur
      ? await tx.workGrade.update({ where: { id: cur.id }, data: { ...data, version: { increment: 1 } }, select: GRADE_SELECT })
      : await tx.workGrade.create({ data: { projectId, rubricId: rubric.id, milestone, subjectKey, subjectUserId, ...data }, select: GRADE_SELECT });
    await tx.workGradeHistory.create({ data: { gradeId: saved.id, action: cur ? 'EDIT' : 'CREATE', scores: scores as Prisma.InputJsonValue, total, comment, publishedAt, actorId: userId } });
    const becamePublished = !!publishedAt && !cur?.publishedAt;
    if (becamePublished) await tx.workGradeHistory.create({ data: { gradeId: saved.id, action: 'PUBLISH', scores: scores as Prisma.InputJsonValue, total, comment, publishedAt, actorId: userId } });
    return { saved, becamePublished };
  });
  if (g.becamePublished) await notifyPublished(userId, projectId, [g.saved]);
  return g.saved;
}

async function notifyPublished(userId: number, projectId: number, grades: Array<{ milestone: string; subjectUserId: number | null }>) {
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true, workspace: { select: { slug: true } } } });
  const team = await teamOf(projectId);
  const receivers = new Map<number, string>();
  for (const g of grades) {
    if (g.subjectUserId) receivers.set(g.subjectUserId, g.milestone);
    else for (const m of team) if (!receivers.has(m.id)) receivers.set(m.id, g.milestone);
  }
  for (const [uid, milestone] of receivers) {
    await notifyWork({
      receiverId: uid, senderId: userId, type: 'WORK_ALERT', entityId: projectId,
      payload: { issueKey: p.key, title: p.name, message: `Grades published: ${milestone}`, url: `/work/${p.workspace.slug}/${p.key}/school?tab=grades` },
    }).catch(() => undefined);
  }
}

export async function setPublished(userId: number, projectId: number, input: { ids: number[]; published: boolean }) {
  const access = await gradeGate(userId, projectId);
  if (!canGrade(access.role)) throw new AppError('Only the lecturer (Teacher role) can publish grades', 403, 'WORK_GRADES_FORBIDDEN');
  const ids = [...new Set(input.ids)].slice(0, 200);
  const rows = await prisma.workGrade.findMany({ where: { id: { in: ids }, projectId }, select: { id: true, scores: true, total: true, comment: true, publishedAt: true, milestone: true, subjectUserId: true } });
  if (rows.length !== ids.length) throw new NotFoundError('Grade not found');
  const now = new Date();
  const changed = rows.filter((r) => !!r.publishedAt !== input.published);
  await prisma.$transaction(async (tx) => {
    for (const r of changed) {
      const publishedAt = input.published ? now : null;
      await tx.workGrade.update({ where: { id: r.id }, data: { publishedAt } });
      await tx.workGradeHistory.create({ data: { gradeId: r.id, action: input.published ? 'PUBLISH' : 'UNPUBLISH', scores: r.scores as Prisma.InputJsonValue, total: r.total, comment: r.comment, publishedAt, actorId: userId } });
    }
  });
  if (input.published && changed.length) await notifyPublished(userId, projectId, changed);
  return { changed: changed.length };
}

export async function gradeHistory(userId: number, projectId: number, gradeId: number) {
  const access = await gradeGate(userId, projectId);
  if (access.role !== 'TEACHER') throw new AppError('Only the lecturer can see the grading history', 403, 'WORK_GRADES_FORBIDDEN');
  const g = await prisma.workGrade.findFirst({ where: { id: gradeId, projectId }, select: { id: true } });
  if (!g) throw new NotFoundError('Grade not found');
  const rows = await prisma.workGradeHistory.findMany({ where: { gradeId }, orderBy: { id: 'desc' }, take: 100 });
  const actors = new Map((await prisma.user.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.actorId))] } }, select: PUBLIC_USER })).map((u) => [u.id, u]));
  return rows.map((r) => ({ ...r, actor: actors.get(r.actorId) ?? null }));
}

export async function deleteGrade(userId: number, projectId: number, gradeId: number) {
  const access = await gradeGate(userId, projectId);
  if (!canGrade(access.role)) throw new AppError('Only the lecturer can delete grades', 403, 'WORK_GRADES_FORBIDDEN');
  const g = await prisma.workGrade.findFirst({ where: { id: gradeId, projectId }, select: { id: true, publishedAt: true } });
  if (!g) throw new NotFoundError('Grade not found');
  if (g.publishedAt) throw new ConflictError('Unpublish the grade before deleting it');
  await prisma.workGrade.delete({ where: { id: g.id } });
}

/** Một nhóm cho lệnh registry (giảng viên hỏi Ask AI trong dự án). */
export async function groupForTeacher(userId: number, projectId: number) {
  const access = await gradeGate(userId, projectId);
  if (access.role !== 'TEACHER') throw new ForbiddenError('Only the lecturer of this project can read the group health summary');
  const [row] = await buildRows(userId, [projectId]);
  return row;
}
