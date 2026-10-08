/**
 * CT Work — báo cáo nộp trường theo mẫu FPT (đợt 3B, 09/10/2026): phần DB + quyền.
 *
 *   • A3  WBS: cây epic → story → sub-task đánh số 1.0/1.1/1.1.1, thuộc tính ước lượng từng thẻ (work_wbs_items),
 *         bảng quy đổi độ phức tạp → man-day ở settings.estimationMatrix (mặc định = mẫu SEP490 3/5/7).
 *   • A23 Dữ liệu cho Project Tracking SEP490 (Scope/WBS/Q&A/TimeLogs/Defects/Issues) — gọi từ projectTracking.service.
 *   • A21 Weekly Report: mỗi tuần một kỳ lưu được (work_weekly_reports), tự điền từ dữ liệu tuần, sửa rồi mới xuất.
 *   • A29 AI Usage Report: nhật ký dùng AI (work_ai_usage_logs) — tự ghi từ provenance (thẻ aiAssisted, lượt
 *         agent, hội thoại AI) + dòng nhập tay; xuất đúng SWP391 Template0.
 *   • Thông tin môn học/nhóm dùng chung (work_fpt_report_docs).
 *
 * Quyền: đọc = project.view (TEACHER/VIEWER xem để chấm) · ghi = issue.edit (ADMIN/MEMBER) · bảng quy đổi = project.settings.
 * Khách (CLIENT) bị chặn ở chốt cổng khách của work.routes.ts trước khi tới tuyến này.
 */

import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { displayName, frontendUrl } from './common.js';
import { emitWorkEvent } from './events.js';
import {
  activityOf, buildAiUsageSheets, buildSep490Sheets, buildWbs, buildWeeklySheets, COMPLEXITIES, ddmmyyyy, emptyWeekly, iterationLabel,
  mondayOf, normalizeMatrix, phaseOf, phasesOf, productOf, SDLC_PHASES, WBS_KINDS, weekNumber, workTypeOf,
  type AiUsageDocData, type AiUsageRow, type DefectRow, type EstimationMatrix, type IssueLogRow, type QaRow, type ScopeRow,
  type Sep490Input, type TimeLogRow, type WbsResult, type WbsSourceIssue, type WeeklyData,
} from './fptReports.js';
import { requireProject } from './permissions.js';
import { projectMembers } from './projects.service.js';
import { addDays, dayInZone, projectTimezone, zonedMidnight } from './projectTime.js';
import { writeXlsx } from './xlsxStyled.js';

const touch = (projectId: number, userId: number) => emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
const iso = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : null);
const toDate = (s: string | null | undefined) => (s ? new Date(`${s.slice(0, 10)}T00:00:00Z`) : null);
const dateStr = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const fileSafe = (s: string) => s.replace(/[^\p{L}\p{N}._-]+/gu, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'Project';
type Who = { username: string; fullName: string | null; displayName: string | null } | null;
const nameOf = (u: Who) => (u ? displayName(u) : '');
const MAX_WBS_ISSUES = 3000;

async function canWrite(userId: number, projectId: number): Promise<boolean> {
  const a = await requireProject(userId, projectId, 'project.view');
  return a.role === 'ADMIN' || a.role === 'MEMBER';
}

async function projectHead(projectId: number) {
  return prisma.workProject.findUniqueOrThrow({
    where: { id: projectId },
    select: { key: true, name: true, settings: true, workspace: { select: { slug: true } } },
  });
}
const issueUrl = (p: { key: string; workspace: { slug: string } }, n: number) => frontendUrl(`/work/${p.workspace.slug}/${p.key}/issue/${n}`);

// ─── Thông tin môn học / nhóm (dùng chung) ───────────────────────

export interface StudentRow { code: string; name: string; role: string; aiTools: string }

export async function loadReportDoc(projectId: number) {
  const [p, d] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } }),
    prisma.workFptReportDoc.findUnique({ where: { projectId } }),
  ]);
  const students = (Array.isArray(d?.students) ? d!.students : []) as unknown as StudentRow[];
  return {
    subjectCode: d?.subjectCode ?? null, subjectName: d?.subjectName ?? null, classCode: d?.classCode ?? null,
    semester: d?.semester ?? null, lecturer: d?.lecturer ?? null, groupCode: d?.groupCode ?? null,
    projectTitle: d?.projectTitle ?? null, week1Start: iso(d?.week1Start), students,
    /** Giá trị dùng khi trống: tên dự án / mã dự án. */
    fallback: { projectTitle: p.name, groupCode: p.key },
  };
}

/** Thành viên NGƯỜI có quyền ghi (ADMIN/MEMBER, kể cả thành viên ngầm của dự án mở cho không gian; không agent,
 *  không khách/giảng viên/người xem) — điền sẵn danh sách sinh viên / điểm cá nhân. */
async function teamMembers(projectId: number): Promise<Array<{ userId: number; name: string; role: string }>> {
  const people = (await projectMembers(projectId)).filter((p) => p.role === 'ADMIN' || p.role === 'MEMBER');
  const humans = new Set((await prisma.user.findMany({ where: { id: { in: people.map((p) => p.id) }, kind: 'HUMAN' }, select: { id: true } })).map((u) => u.id));
  return people
    .filter((p) => humans.has(p.id))
    .sort((a, b) => Number(b.role === 'ADMIN') - Number(a.role === 'ADMIN'))
    .map((p) => ({ userId: p.id, name: displayName(p), role: p.role === 'ADMIN' ? 'Leader' : 'Member' }));
}

export async function getReportDoc(userId: number, projectId: number) {
  const edit = await canWrite(userId, projectId);
  const [doc, members] = await Promise.all([loadReportDoc(projectId), teamMembers(projectId)]);
  return { ...doc, members, canEdit: edit };
}

const studentSchema = z.object({
  code: z.string().trim().max(40).default(''), name: z.string().trim().max(120).default(''),
  role: z.string().trim().max(60).default(''), aiTools: z.string().trim().max(200).default(''),
});
const optText = (max: number) => z.string().trim().max(max).nullable().optional();
export const reportDocInput = z.object({
  subjectCode: optText(20), subjectName: optText(120), classCode: optText(40), semester: optText(40), lecturer: optText(120),
  groupCode: optText(60), projectTitle: optText(200), week1Start: dateStr.nullable().optional(), students: z.array(studentSchema).max(30).optional(),
});

export async function updateReportDoc(userId: number, projectId: number, input: z.infer<typeof reportDocInput>) {
  await requireProject(userId, projectId, 'issue.edit');
  const s = (v: string | null | undefined) => (v === undefined ? undefined : v?.trim() ? v.trim() : null);
  const data: Prisma.WorkFptReportDocUncheckedUpdateInput = {
    ...(input.subjectCode !== undefined ? { subjectCode: s(input.subjectCode) } : {}),
    ...(input.subjectName !== undefined ? { subjectName: s(input.subjectName) } : {}),
    ...(input.classCode !== undefined ? { classCode: s(input.classCode) } : {}),
    ...(input.semester !== undefined ? { semester: s(input.semester) } : {}),
    ...(input.lecturer !== undefined ? { lecturer: s(input.lecturer) } : {}),
    ...(input.groupCode !== undefined ? { groupCode: s(input.groupCode) } : {}),
    ...(input.projectTitle !== undefined ? { projectTitle: s(input.projectTitle) } : {}),
    // Tuần 1 luôn neo về thứ Hai — "Week n" của Weekly Report và AI Usage tính từ đây.
    ...(input.week1Start !== undefined ? { week1Start: input.week1Start ? toDate(mondayOf(input.week1Start)) : null } : {}),
    ...(input.students !== undefined ? { students: input.students.filter((x) => x.code || x.name) as unknown as Prisma.InputJsonValue } : {}),
  };
  await prisma.workFptReportDoc.upsert({ where: { projectId }, create: { ...(data as Prisma.WorkFptReportDocUncheckedCreateInput), projectId }, update: data });
  touch(projectId, userId);
  return getReportDoc(userId, projectId);
}

// ─── A3: WBS ─────────────────────────────────────────────────────

export function matrixOf(settings: unknown): EstimationMatrix {
  return normalizeMatrix((settings as { estimationMatrix?: unknown } | null)?.estimationMatrix);
}

/** Đọc thẻ của dự án ⇒ nguồn WBS (KHÔNG kiểm quyền — nơi gọi kiểm). */
export async function loadWbsSource(projectId: number): Promise<{ key: string; matrix: EstimationMatrix; issues: WbsSourceIssue[]; truncated: boolean }> {
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, settings: true } });
  const cxField = await prisma.workCustomField.findFirst({
    where: { projectId, name: { equals: 'Complexity', mode: 'insensitive' } }, select: { id: true, kind: true, options: true },
  });
  const rows = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null },
    orderBy: { number: 'asc' },
    take: MAX_WBS_ISSUES + 1,
    select: {
      id: true, number: true, title: true, parentId: true, rank: true, descriptionText: true, resolution: true,
      originalEstimateMin: true, timeSpentMin: true,
      type: { select: { key: true } }, status: { select: { name: true, category: true } },
      assignee: { select: { username: true, fullName: true, displayName: true } },
      fixVersion: { select: { name: true } }, sprint: { select: { name: true } },
      labels: { select: { label: { select: { name: true } } } },
      customValues: cxField ? { where: { fieldId: cxField.id }, select: { value: true } } : false,
      children: { where: { deletedAt: null }, select: { title: true, status: { select: { category: true } } } },
      wbsItem: true,
    },
  });
  const opts = Array.isArray(cxField?.options) ? (cxField!.options as Array<{ id: string; label: string }>) : [];
  const cxValue = (v: unknown) => (v === undefined || v === null ? null : cxField?.kind === 'SELECT' ? opts.find((o) => o.id === v)?.label ?? String(v) : String(v));
  const truncated = rows.length > MAX_WBS_ISSUES;
  const issues: WbsSourceIssue[] = rows.slice(0, MAX_WBS_ISSUES).map((r) => {
    const labels = r.labels.map((l) => l.label.name);
    const w = r.wbsItem;
    return {
      id: r.id, number: r.number, key: `${p.key}-${r.number}`, title: r.title, typeKey: r.type.key, parentId: r.parentId, rank: r.rank,
      description: (r.descriptionText ?? '').split('\n').map((x) => x.trim()).find(Boolean)?.slice(0, 300) ?? '',
      category: r.status.category, statusName: r.status.name, resolution: r.resolution,
      assignee: r.assignee ? displayName(r.assignee) : '',
      iteration: r.fixVersion?.name ?? r.sprint?.name ?? labels.find((l) => /^iter\d+$/i.test(l)) ?? '',
      estimateMin: r.originalEstimateMin, spentMin: r.timeSpentMin,
      fieldComplexity: cxValue((r as { customValues?: Array<{ value: unknown }> }).customValues?.[0]?.value),
      phases: phasesOf(r.children.map((c) => ({ title: c.title, category: c.status.category }))),
      wbs: w ? { kind: w.kind, complexity: w.complexity, fields: w.fields, transactions: w.transactions, feature: w.feature, subFeature: w.subFeature, plannedDays: w.plannedDays, note: w.note } : null,
    };
  });
  return { key: p.key, matrix: matrixOf(p.settings), issues, truncated };
}

export async function loadWbs(projectId: number): Promise<{ matrix: EstimationMatrix; result: WbsResult; truncated: boolean }> {
  const src = await loadWbsSource(projectId);
  return { matrix: src.matrix, result: buildWbs(src.issues, src.matrix), truncated: src.truncated };
}

export async function getWbs(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const { matrix, result, truncated } = await loadWbs(projectId);
  return {
    matrix, ...result, truncated,
    canEdit: access.role === 'ADMIN' || access.role === 'MEMBER',
    canEditMatrix: access.role === 'ADMIN',
  };
}

const level = (name: (typeof COMPLEXITIES)[number]) => z.object({
  name: z.literal(name),
  maxFields: z.number().int().min(0).max(10_000).nullable(),
  maxTransactions: z.number().int().min(0).max(10_000).nullable(),
  manDays: z.number().min(0).max(1000),
});
export const matrixInput = z.object({
  levels: z.tuple([level('Simple'), level('Medium'), level('Complex')]),
  hoursPerDay: z.number().min(1).max(24),
}).superRefine((m, ctx) => {
  // Trần phải tăng dần (Simple ≤ Medium) — không thì "Medium" không bao giờ được chọn.
  const [s, md] = m.levels;
  if (s.maxFields !== null && md.maxFields !== null && md.maxFields < s.maxFields) ctx.addIssue({ code: 'custom', path: ['levels', 1, 'maxFields'], message: 'Medium must allow at least as many fields as Simple' });
  if (s.maxTransactions !== null && md.maxTransactions !== null && md.maxTransactions < s.maxTransactions) ctx.addIssue({ code: 'custom', path: ['levels', 1, 'maxTransactions'], message: 'Medium must allow at least as many transactions as Simple' });
});

export async function updateMatrix(userId: number, projectId: number, input: z.infer<typeof matrixInput>) {
  await requireProject(userId, projectId, 'project.settings');
  const cur = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { settings: true } });
  const settings = { ...((cur.settings as object) ?? {}), estimationMatrix: { levels: input.levels, hoursPerDay: input.hoursPerDay } };
  await prisma.workProject.update({ where: { id: projectId }, data: { settings: settings as Prisma.InputJsonValue } });
  touch(projectId, userId);
  return getWbs(userId, projectId);
}

export const wbsItemInput = z.object({
  kind: z.enum(WBS_KINDS).nullable().optional(),
  complexity: z.enum(COMPLEXITIES).nullable().optional(),
  fields: z.number().int().min(0).max(10_000).nullable().optional(),
  transactions: z.number().int().min(0).max(10_000).nullable().optional(),
  feature: z.string().trim().max(120).nullable().optional(),
  subFeature: z.string().trim().max(120).nullable().optional(),
  plannedDays: z.number().min(0).max(10_000).nullable().optional(),
  note: z.string().trim().max(1000).nullable().optional(),
});

export async function updateWbsItem(userId: number, projectId: number, number: number, input: z.infer<typeof wbsItemInput>) {
  await requireProject(userId, projectId, 'issue.edit');
  const issue = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!issue) throw new NotFoundError('Issue not found');
  const t = (v: string | null | undefined) => (v === undefined ? undefined : v?.trim() ? v.trim() : null);
  const data = {
    ...(input.kind !== undefined ? { kind: input.kind } : {}),
    ...(input.complexity !== undefined ? { complexity: input.complexity } : {}),
    ...(input.fields !== undefined ? { fields: input.fields } : {}),
    ...(input.transactions !== undefined ? { transactions: input.transactions } : {}),
    ...(input.feature !== undefined ? { feature: t(input.feature) } : {}),
    ...(input.subFeature !== undefined ? { subFeature: t(input.subFeature) } : {}),
    ...(input.plannedDays !== undefined ? { plannedDays: input.plannedDays } : {}),
    ...(input.note !== undefined ? { note: t(input.note) } : {}),
  };
  await prisma.workWbsItem.upsert({ where: { issueId: issue.id }, create: { issueId: issue.id, projectId, ...data }, update: data });
  touch(projectId, userId);
  const { matrix, result } = await loadWbs(projectId);
  return { matrix, row: result.rows.find((r) => r.issueId === issue.id) ?? null, totals: result.totals };
}

export async function exportWbs(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const p = await projectHead(projectId);
  const { matrix, result } = await loadWbs(projectId);
  const sheets = buildSep490Sheets({ matrix, scope: [], wbs: result.rows, qa: [], timelogs: [], defects: [], issues: [] });
  return { file: `${fileSafe(p.key)}_WBS_${new Date().toISOString().slice(0, 10)}.xlsx`, buffer: writeXlsx([sheets[1]], { title: `${p.key} — WBS` }) };
}

// ─── A23: dữ liệu Project Tracking SEP490 ────────────────────────

const weekLabelOf = (day: string | null, week1: string | null) => {
  if (!day) return '';
  const n = weekNumber(day, week1);
  return n && n > 0 ? `Week${n}` : ddmmyyyy(day);
};

/** Đủ 6 sheet của Report2_Project Tracking (KHÔNG kiểm quyền — projectTracking.service kiểm). */
export async function loadSep490(projectId: number): Promise<Sep490Input> {
  const tz = await projectTimezone(projectId);
  const doc = await loadReportDoc(projectId);
  const { matrix, result } = await loadWbs(projectId);
  const p = await projectHead(projectId);
  const rowById = new Map(result.rows.map((r) => [r.issueId, r]));
  const hpd = matrix.hoursPerDay;
  const pds = (min: number) => Math.round((min / 60 / hpd) * 100) / 100;

  // Scope: giai đoạn ⇒ gói việc (thẻ cấp cao nhất trong giai đoạn) ⇒ việc con cùng giai đoạn.
  const [stages, issues] = await Promise.all([
    prisma.workStage.findMany({ where: { projectId }, orderBy: { n: 'asc' }, select: { id: true, n: true, name: true, status: true } }),
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, type: { key: { notIn: ['BUG', 'TEST'] } } },
      orderBy: [{ rank: 'asc' }, { number: 'asc' }],
      take: MAX_WBS_ISSUES,
      select: {
        id: true, number: true, title: true, parentId: true, stageId: true, dueDate: true, resolution: true, originalEstimateMin: true, timeSpentMin: true,
        type: { select: { key: true } }, status: { select: { category: true } }, assignee: { select: { username: true, fullName: true, displayName: true } },
      },
    }),
  ]);
  type Iss = (typeof issues)[number];
  const scopeStatus = (i: Pick<Iss, 'resolution' | 'status'>) => (i.resolution && /won.?t|cancel|duplicate|reject/i.test(i.resolution) ? 'Cancelled'
    : i.status.category === 'DONE' ? 'Completed' : i.status.category === 'IN_PROGRESS' ? 'In Progress' : 'Pending');
  const scope: ScopeRow[] = [];
  const pushTree = (list: Iss[], all: Iss[], prefix: number[], depth: number) => {
    list.forEach((it, k) => {
      const num = [...prefix, k + 1];
      const w = rowById.get(it.id);
      scope.push({
        wbs: num.join('.'), title: it.title, bold: false,
        estDays: w ? (w.plannedTotal || null) : it.originalEstimateMin ? pds(it.originalEstimateMin) : null,
        inCharge: nameOf(it.assignee), deadline: weekLabelOf(iso(it.dueDate), doc.week1Start), status: scopeStatus(it),
        actualDays: w ? (w.actualTotal || null) : it.timeSpentMin ? pds(it.timeSpentMin) : null, notes: `${p.key}-${it.number}`,
      });
      if (depth < 2) pushTree(all.filter((c) => c.parentId === it.id), all, num, depth + 1);
    });
  };
  if (stages.length) {
    for (const st of stages) {
      const inStage = issues.filter((i) => i.stageId === st.id);
      const ids = new Set(inStage.map((i) => i.id));
      const tops = inStage.filter((i) => !i.parentId || !ids.has(i.parentId));
      const statusText = st.status === 'DONE' ? 'Completed' : st.status === 'NOT_STARTED' ? 'Pending' : 'In Progress';
      scope.push({ wbs: `${st.n}.0`, title: `Stage ${st.n}: ${st.name}`, bold: true, estDays: null, inCharge: '', deadline: '', status: statusText, actualDays: null, notes: '' });
      pushTree(tops, inStage, [st.n], 1);
    }
  } else {
    // Chưa dùng giai đoạn ⇒ epic là gói việc cấp 1 (đúng tinh thần sheet Scope: gói việc → việc).
    const epics = issues.filter((i) => i.type.key === 'EPIC');
    const tops = epics.length ? epics : issues.filter((i) => !i.parentId);
    tops.slice(0, 200).forEach((e, k) => {
      const w = rowById.get(e.id);
      scope.push({ wbs: `${k + 1}.0`, title: e.title, bold: true, estDays: w?.plannedTotal || null, inCharge: nameOf(e.assignee), deadline: weekLabelOf(iso(e.dueDate), doc.week1Start), status: scopeStatus(e), actualDays: w?.actualTotal || null, notes: `${p.key}-${e.number}` });
      if (epics.length) pushTree(issues.filter((c) => c.parentId === e.id), issues, [k + 1], 1);
    });
  }

  // Q&A: dòng RAID nhóm "Q&A"/"Question" (chưa có loại RAID riêng — A22).
  const raid = await prisma.workRaidItem.findMany({
    where: { projectId, deletedAt: null },
    orderBy: { number: 'asc' },
    select: {
      number: true, type: true, title: true, description: true, category: true, status: true, probability: true, impact: true,
      mitigation: true, reviewDate: true, createdAt: true, updatedAt: true, closedAt: true,
      owner: { select: { username: true, fullName: true, displayName: true } }, createdBy: { select: { username: true, fullName: true, displayName: true } },
    },
  });
  const prio = (r: { probability: number | null; impact: number | null }) => {
    const s = Math.max(r.impact ?? 0, r.probability ?? 0);
    return s >= 4 ? 'High' : s > 0 && s <= 2 ? 'Low' : 'Medium';
  };
  const closed = (s: string) => s === 'CLOSED' || s === 'VALIDATED' || s === 'INVALID';
  const isQa = (r: { category: string | null }) => !!r.category && /^(q\s*&\s*a|qa|question)/i.test(r.category.trim());
  const qa: QaRow[] = raid.filter(isQa).map((r) => ({
    date: dayInZone(r.createdAt, tz), question: r.title, by: nameOf(r.createdBy), to: nameOf(r.owner), priority: prio(r),
    due: iso(r.reviewDate), status: r.status === 'INVALID' ? 'Cancelled' : closed(r.status) ? 'Closed' : 'Open', notes: r.mitigation ?? r.description ?? '',
  }));
  const issuesLog: IssueLogRow[] = raid.filter((r) => r.type === 'ISSUE' && !isQa(r)).map((r) => ({
    date: dayInZone(r.createdAt, tz), issue: r.title, type: r.category ?? '', priority: prio(r), created: nameOf(r.createdBy), owner: nameOf(r.owner),
    due: iso(r.reviewDate), status: r.status === 'INVALID' ? 'Cancelled' : closed(r.status) ? 'Closed' : r.status === 'MONITORING' ? 'In Progress' : 'Open',
    notes: [r.mitigation, r.description].filter(Boolean).join('\n').slice(0, 2000),
  }));

  // TimeLogs: mọi worklog; trạng thái theo timesheet tuần của người đó (mô-đun finance) — chưa có ⇒ Submitted.
  const [logs, sheets] = await Promise.all([
    prisma.workWorklog.findMany({
      where: { issue: { projectId, deletedAt: null } },
      orderBy: { startedAt: 'asc' },
      take: 10_000,
      select: {
        minutes: true, startedAt: true, note: true, createdAt: true, userId: true,
        user: { select: { username: true, fullName: true, displayName: true } },
        issue: { select: { number: true, title: true, type: { select: { key: true } }, stage: { select: { name: true } }, parent: { select: { title: true } } } },
      },
    }),
    prisma.workTimesheet.findMany({ where: { projectId }, select: { userId: true, weekStart: true, status: true } }),
  ]);
  const sheetStatus = new Map(sheets.map((s) => [`${s.userId}|${iso(s.weekStart)}`, s.status]));
  const timelogs: TimeLogRow[] = logs.map((l) => {
    const day = dayInZone(l.startedAt, tz);
    const st = sheetStatus.get(`${l.userId}|${mondayOf(day)}`);
    const text = `${l.issue.title} ${l.issue.stage?.name ?? ''} ${l.issue.parent?.title ?? ''}`;
    return {
      date: day, reporter: nameOf(l.user), task: `${p.key}-${l.issue.number} ${l.issue.title}`, hours: Math.round((l.minutes / 60) * 100) / 100,
      activity: activityOf(l.issue.title, l.issue.type.key), type: workTypeOf(l.issue.title), product: productOf(text),
      workProduct: l.issue.stage?.name ?? l.issue.parent?.title ?? '', status: st === 'APPROVED' ? 'Approved' : st === 'RETURNED' ? 'Rejected' : 'Submitted',
      updated: dayInZone(l.createdAt, tz), notes: l.note ?? '',
    };
  });

  // Defects: thẻ loại Bug.
  const bugs = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { key: 'BUG' } },
    orderBy: { number: 'asc' },
    take: 5000,
    select: {
      number: true, title: true, createdAt: true, updatedAt: true, resolution: true, assigneeId: true,
      status: { select: { name: true, category: true } },
      reporter: { select: { username: true, fullName: true, displayName: true } }, assignee: { select: { username: true, fullName: true, displayName: true } },
      labels: { select: { label: { select: { name: true } } } }, components: { select: { component: { select: { name: true } } } },
      defectOf: { select: { runId: true }, take: 1 },
    },
  });
  const defects: DefectRow[] = bugs.map((b) => {
    const labels = b.labels.map((l) => l.label.name.toLowerCase());
    const has = (re: RegExp) => labels.some((l) => re.test(l));
    const activity = has(/^review|doc/) ? 'Review' : has(/^(ut|unit)/) ? 'UT' : has(/^(it|integration)/) ? 'IT' : has(/^(at|uat|acceptance)/) ? 'AT' : 'ST';
    const comps = b.components.map((c) => c.component.name);
    const status = b.resolution && /won.?t|cancel|duplicate|reject|not a bug/i.test(b.resolution) ? 'Cancelled'
      : b.status.category === 'DONE' ? 'Closed'
      : /fixed|resolved|verify|review|qa/i.test(b.status.name) ? 'Fixed'
      : b.status.category === 'IN_PROGRESS' ? 'Fixing' : b.assigneeId ? 'Assigned' : 'Pending';
    return {
      date: dayInZone(b.createdAt, tz), description: `${p.key}-${b.number} ${b.title}`, activity, product: productOf(`${b.title} ${labels.join(' ')} ${comps.join(' ')}`),
      productDetails: comps.join(', '), assigner: nameOf(b.reporter), assignee: nameOf(b.assignee), status, updated: dayInZone(b.updatedAt, tz),
      notes: b.defectOf.length ? 'Found in a test run' : '',
    };
  });

  return { matrix, scope, wbs: result.rows, qa, timelogs, defects, issues: issuesLog };
}

// ─── A21: Weekly Report ──────────────────────────────────────────

const weeklyRow = {
  status: z.object({ task: z.string().max(500), inCharge: z.string().max(200).default(''), status: z.string().max(40).default('Pending'), notes: z.string().max(2000).default('') }),
  issues: z.object({ issue: z.string().max(500), owner: z.string().max(200).default(''), status: z.string().max(40).default('Pending'), notes: z.string().max(2000).default('') }),
  plan: z.object({ task: z.string().max(500), inCharge: z.string().max(200).default(''), deadline: z.string().max(40).default(''), notes: z.string().max(2000).default('') }),
  matters: z.object({ matter: z.string().max(500), raisedBy: z.string().max(200).default(''), date: z.string().max(40).default(''), notes: z.string().max(2000).default('') }),
  grades: z.object({ name: z.string().max(120), grade: z.number().min(0).max(10).nullable().default(null) }),
};
export const weeklyDataSchema = z.object({
  status: z.array(weeklyRow.status).max(100).default([]),
  issues: z.array(weeklyRow.issues).max(100).default([]),
  plan: z.array(weeklyRow.plan).max(100).default([]),
  matters: z.array(weeklyRow.matters).max(100).default([]),
  grades: z.array(weeklyRow.grades).max(30).default([]),
});
const dataOf = (v: unknown): WeeklyData => {
  const r = weeklyDataSchema.safeParse(v);
  return r.success ? r.data : emptyWeekly();
};

/** Điền tự động một tuần từ dữ liệu thật (thứ Hai `weekStart` → Chủ nhật, theo múi giờ dự án). */
export async function composeWeekly(projectId: number, weekStartRaw: string): Promise<WeeklyData> {
  const weekStart = mondayOf(weekStartRaw);
  const tz = await projectTimezone(projectId);
  const from = zonedMidnight(weekStart, tz);
  const to = zonedMidnight(addDays(weekStart, 7), tz);
  const nextEnd = zonedMidnight(addDays(weekStart, 14), tz);
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true } });
  const person = { select: { username: true, fullName: true, displayName: true } } as const;

  const [logs, touched, raid, flagged, upcoming, members] = await Promise.all([
    prisma.workWorklog.findMany({
      where: { issue: { projectId, deletedAt: null }, startedAt: { gte: from, lt: to } },
      select: { minutes: true, issueId: true, user: person },
    }),
    prisma.workIssue.findMany({
      where: {
        projectId, deletedAt: null, type: { key: { not: 'TEST' } },
        OR: [
          { resolvedAt: { gte: from, lt: to } },
          { worklogs: { some: { startedAt: { gte: from, lt: to } } } },
          { status: { category: 'IN_PROGRESS' }, updatedAt: { gte: from, lt: to } },
        ],
      },
      orderBy: { number: 'asc' },
      take: 200,
      select: { id: true, number: true, title: true, resolvedAt: true, status: { select: { category: true } }, assignee: person },
    }),
    prisma.workRaidItem.findMany({
      where: { projectId, deletedAt: null, createdAt: { lt: to }, OR: [{ closedAt: null }, { closedAt: { gte: from } }] },
      orderBy: { number: 'asc' },
      select: { number: true, type: true, title: true, status: true, closedAt: true, createdAt: true, mitigation: true, description: true, owner: person, createdBy: person },
    }),
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, flaggedAt: { not: null, lt: to } },
      orderBy: { number: 'asc' }, take: 30,
      select: { number: true, title: true, flagReason: true, status: { select: { category: true } }, assignee: person },
    }),
    prisma.workIssue.findMany({
      where: {
        projectId, deletedAt: null, type: { key: { notIn: ['TEST', 'EPIC'] } }, status: { category: { not: 'DONE' } },
        OR: [
          { dueDate: { gte: toDate(addDays(weekStart, 7))!, lte: toDate(addDays(weekStart, 13))! } },
          { sprint: { state: { in: ['ACTIVE', 'PLANNED'] }, startAt: { lt: nextEnd }, endAt: { gte: to } }, assigneeId: { not: null } },
        ],
      },
      orderBy: [{ dueDate: 'asc' }, { number: 'asc' }],
      take: 30,
      select: { number: true, title: true, dueDate: true, sprint: { select: { endAt: true } }, assignee: person },
    }),
    teamMembers(projectId),
  ]);

  const hours = new Map<number, { min: number; who: Set<string> }>();
  for (const l of logs) {
    const h = hours.get(l.issueId) ?? { min: 0, who: new Set<string>() };
    h.min += l.minutes;
    h.who.add(nameOf(l.user));
    hours.set(l.issueId, h);
  }
  const status: WeeklyData['status'] = touched.map((i) => {
    const h = hours.get(i.id);
    const done = i.status.category === 'DONE' && i.resolvedAt && i.resolvedAt < to;
    return {
      task: i.title,
      inCharge: nameOf(i.assignee) || [...(h?.who ?? [])].join(', '),
      status: done ? 'Completed' : i.status.category === 'IN_PROGRESS' || h ? 'In Progress' : 'Pending',
      notes: [`${p.key}-${i.number}`, h ? `${Math.round((h.min / 60) * 10) / 10}h logged` : ''].filter(Boolean).join(' · '),
    };
  });
  const raidStatus = (r: { status: string; closedAt: Date | null }) => (r.closedAt && r.closedAt < to ? 'Completed' : r.status === 'MONITORING' ? 'In Progress' : 'Pending');
  const issues: WeeklyData['issues'] = [
    ...raid.filter((r) => r.type === 'ISSUE').map((r) => ({ issue: r.title, owner: nameOf(r.owner), status: raidStatus(r), notes: (r.mitigation ?? r.description ?? '').slice(0, 2000) })),
    ...flagged.map((i) => ({ issue: `${p.key}-${i.number} ${i.title} (blocked)`, owner: nameOf(i.assignee), status: i.status.category === 'DONE' ? 'Completed' : 'In Progress', notes: i.flagReason ?? '' })),
  ];
  const plan: WeeklyData['plan'] = upcoming.map((i) => ({
    task: i.title, inCharge: nameOf(i.assignee),
    deadline: iso(i.dueDate) ?? (i.sprint?.endAt ? dayInZone(i.sprint.endAt, tz) : ''),
    notes: `${p.key}-${i.number}`,
  }));
  const matters: WeeklyData['matters'] = raid
    .filter((r) => r.type !== 'ISSUE' && r.createdAt >= from)
    .map((r) => ({ matter: `${r.type[0]}${r.type.slice(1).toLowerCase()}: ${r.title}`, raisedBy: nameOf(r.createdBy), date: dayInZone(r.createdAt, tz), notes: (r.mitigation ?? r.description ?? '').slice(0, 2000) }));
  const grades = members.map((m) => ({ name: m.name, grade: null }));
  return { status, issues, plan, matters, grades };
}

const weeklyOut = (w: { id: number; weekStart: Date; weekNo: number | null; data: unknown; version: number; updatedAt: Date; createdAt: Date }) => ({
  id: w.id, weekStart: iso(w.weekStart)!, weekNo: w.weekNo, data: dataOf(w.data), version: w.version, updatedAt: w.updatedAt.toISOString(), createdAt: w.createdAt.toISOString(),
});

export async function listWeekly(userId: number, projectId: number) {
  const edit = await canWrite(userId, projectId);
  const [rows, doc] = await Promise.all([
    prisma.workWeeklyReport.findMany({ where: { projectId }, orderBy: { weekStart: 'desc' } }),
    loadReportDoc(projectId),
  ]);
  return {
    reports: rows.map((w) => {
      const d = dataOf(w.data);
      return { id: w.id, weekStart: iso(w.weekStart)!, weekNo: w.weekNo, version: w.version, updatedAt: w.updatedAt.toISOString(), counts: { status: d.status.length, issues: d.issues.length, plan: d.plan.length, matters: d.matters.length } };
    }),
    week1Start: doc.week1Start, group: doc.groupCode ?? doc.fallback.projectTitle, canEdit: edit,
  };
}

export async function previewWeekly(userId: number, projectId: number, weekStart: string) {
  await requireProject(userId, projectId, 'project.view');
  const doc = await loadReportDoc(projectId);
  const ws = mondayOf(weekStart);
  return { weekStart: ws, weekNo: weekNumber(ws, doc.week1Start), data: await composeWeekly(projectId, ws) };
}

export async function createWeekly(userId: number, projectId: number, weekStartRaw: string) {
  await requireProject(userId, projectId, 'issue.edit');
  const weekStart = mondayOf(weekStartRaw);
  const exists = await prisma.workWeeklyReport.findUnique({ where: { uk_work_weekly_report: { projectId, weekStart: toDate(weekStart)! } } });
  if (exists) throw new AppError(`A weekly report for the week of ${ddmmyyyy(weekStart)} already exists`, 409, 'WORK_DUPLICATE', { id: exists.id });
  if ((await prisma.workWeeklyReport.count({ where: { projectId } })) >= 60) throw new BadRequestError('A project can keep at most 60 weekly reports', 'WORK_LIMIT');
  const doc = await loadReportDoc(projectId);
  const data = await composeWeekly(projectId, weekStart);
  const w = await prisma.workWeeklyReport.create({
    data: { projectId, weekStart: toDate(weekStart)!, weekNo: weekNumber(weekStart, doc.week1Start), data: data as unknown as Prisma.InputJsonValue, createdById: userId, updatedById: userId },
  });
  touch(projectId, userId);
  return weeklyOut(w);
}

async function findWeekly(projectId: number, id: number) {
  const w = await prisma.workWeeklyReport.findFirst({ where: { id, projectId } });
  if (!w) throw new NotFoundError('Weekly report not found');
  return w;
}

export async function getWeekly(userId: number, projectId: number, id: number) {
  await requireProject(userId, projectId, 'project.view');
  return weeklyOut(await findWeekly(projectId, id));
}

export const weeklyUpdateInput = z.object({
  version: z.number().int().min(0),
  weekNo: z.number().int().min(1).max(60).nullable().optional(),
  data: weeklyDataSchema,
});

export async function updateWeekly(userId: number, projectId: number, id: number, input: z.infer<typeof weeklyUpdateInput>) {
  await requireProject(userId, projectId, 'issue.edit');
  await findWeekly(projectId, id);
  // Khoá lạc quan: chỉ ghi khi version còn khớp — hai người sửa cùng kỳ thì người sau nhận 409.
  const r = await prisma.workWeeklyReport.updateMany({
    where: { id, projectId, version: input.version },
    data: { data: input.data as unknown as Prisma.InputJsonValue, ...(input.weekNo !== undefined ? { weekNo: input.weekNo } : {}), version: { increment: 1 }, updatedById: userId },
  });
  if (!r.count) throw new AppError('Someone else changed this weekly report a moment ago. Reload to see their changes.', 409, 'WORK_STALE');
  touch(projectId, userId);
  return getWeekly(userId, projectId, id);
}

/** Điền lại các mục tự động từ dữ liệu tuần; giữ điểm cá nhân đã nhập. */
export async function refreshWeekly(userId: number, projectId: number, id: number) {
  await requireProject(userId, projectId, 'issue.edit');
  const w = await findWeekly(projectId, id);
  const old = dataOf(w.data);
  const fresh = await composeWeekly(projectId, iso(w.weekStart)!);
  const grade = new Map(old.grades.map((g) => [g.name, g.grade]));
  fresh.grades = fresh.grades.map((g) => ({ ...g, grade: grade.get(g.name) ?? null }));
  for (const g of old.grades) if (!fresh.grades.some((x) => x.name === g.name)) fresh.grades.push(g);
  await prisma.workWeeklyReport.update({ where: { id }, data: { data: fresh as unknown as Prisma.InputJsonValue, version: { increment: 1 }, updatedById: userId } });
  touch(projectId, userId);
  return getWeekly(userId, projectId, id);
}

export async function deleteWeekly(userId: number, projectId: number, id: number) {
  await requireProject(userId, projectId, 'issue.edit');
  const r = await prisma.workWeeklyReport.deleteMany({ where: { id, projectId } });
  if (!r.count) throw new NotFoundError('Weekly report not found');
  touch(projectId, userId);
}

export async function exportWeekly(userId: number, projectId: number, ids?: number[]) {
  await requireProject(userId, projectId, 'project.view');
  const [p, doc] = await Promise.all([projectHead(projectId), loadReportDoc(projectId)]);
  const rows = await prisma.workWeeklyReport.findMany({
    where: { projectId, ...(ids?.length ? { id: { in: ids } } : {}) }, orderBy: { weekStart: 'asc' },
  });
  if (!rows.length) throw new BadRequestError('Create a weekly report first', 'WORK_EMPTY');
  const sheets = buildWeeklySheets(doc.groupCode ?? p.name, rows.map((w) => ({ weekStart: iso(w.weekStart)!, weekNo: w.weekNo, data: dataOf(w.data) })));
  return { file: `${fileSafe(doc.groupCode ?? p.key)}_Weekly_Report.xlsx`, buffer: writeXlsx(sheets, { title: `${p.key} — Weekly Report` }), count: rows.length };
}

// ─── A29: AI Usage Report ────────────────────────────────────────

const aiOut = (r: Prisma.WorkAiUsageLogGetPayload<object>) => ({
  id: r.id, usedAt: iso(r.usedAt)!, phase: r.phase, task: r.task, tool: r.tool, output: r.output, validation: r.validation, evidence: r.evidence,
  measure: r.measure, value: r.value, risks: r.risks, source: r.source as 'AUTO' | 'MANUAL', issueId: r.issueId, userName: r.userName,
});

export async function listAiUsage(userId: number, projectId: number) {
  const edit = await canWrite(userId, projectId);
  const [rows, doc] = await Promise.all([
    prisma.workAiUsageLog.findMany({ where: { projectId }, orderBy: [{ usedAt: 'asc' }, { id: 'asc' }], take: 2000 }),
    loadReportDoc(projectId),
  ]);
  const logs = rows.map((r) => ({ ...aiOut(r), weekNo: weekNumber(iso(r.usedAt)!, doc.week1Start) }));
  return { logs, week1Start: doc.week1Start, canEdit: edit };
}

/** Dòng tự ghi từ provenance — KHÔNG ghi đè dòng đã có (người dùng có thể đã sửa phần kiểm chứng/đánh giá). */
export async function syncAiUsage(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'issue.edit');
  const tz = await projectTimezone(projectId);
  const p = await projectHead(projectId);
  const person = { select: { username: true, fullName: true, displayName: true } } as const;
  const [aiIssues, runs, threads] = await Promise.all([
    prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, aiAssisted: true },
      take: 1000,
      select: { id: true, number: true, title: true, aiModel: true, aiAssistedAt: true, updatedAt: true, aiAppliedById: true, type: { select: { key: true } } },
    }),
    prisma.workAgentRun.findMany({
      where: { projectId, finishedAt: { not: null }, error: null, status: { notIn: ['FAILED', 'CANCELLED', 'CANCELED'] } },
      take: 1000,
      select: { id: true, issueId: true, task: true, resultText: true, finishedAt: true, requestedById: true, agent: { select: { model: true, user: person } } },
    }),
    prisma.workAiThread.findMany({
      where: { projectId, deletedAt: null, messageCount: { gt: 0 } },
      take: 1000,
      select: { id: true, title: true, mode: true, issueNumber: true, messageCount: true, createdAt: true, createdById: true, createdBy: person },
    }),
  ]);
  const runIssues = await prisma.workIssue.findMany({ where: { id: { in: [...new Set(runs.map((r) => r.issueId))] } }, select: { id: true, number: true, title: true, type: { select: { key: true } } } });
  const runIssue = new Map(runIssues.map((i) => [i.id, i]));
  const userIds = [...new Set([...aiIssues.map((i) => i.aiAppliedById), ...runs.map((r) => r.requestedById)].filter((x): x is number => !!x))];
  const users = new Map((await prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, username: true, fullName: true, displayName: true } })).map((u) => [u.id, displayName(u)]));

  const data: Prisma.WorkAiUsageLogCreateManyInput[] = [
    ...aiIssues.map((i) => ({
      projectId, sourceKey: `issue:${i.id}`, source: 'AUTO', issueId: i.id,
      usedAt: toDate(dayInZone(i.aiAssistedAt ?? i.updatedAt, tz))!, phase: phaseOf(i.title, i.type.key),
      task: `${p.key}-${i.number} ${i.title}`.slice(0, 300), tool: (i.aiModel || 'CT Work AI assistant').slice(0, 120),
      output: 'Issue content drafted or edited with AI and applied in CT Work', evidence: issueUrl(p, i.number).slice(0, 1000),
      userId: i.aiAppliedById, userName: i.aiAppliedById ? users.get(i.aiAppliedById) ?? null : null,
    })),
    ...runs.map((r) => {
      const iss = runIssue.get(r.issueId);
      return {
        projectId, sourceKey: `agent:${r.id}`, source: 'AUTO', issueId: r.issueId,
        usedAt: toDate(dayInZone(r.finishedAt!, tz))!, phase: phaseOf(`${r.task} ${iss?.title ?? ''}`, iss?.type.key ?? ''),
        task: `AI agent ${r.task.replace(/_/g, ' ').toLowerCase()}${iss ? ` — ${p.key}-${iss.number} ${iss.title}` : ''}`.slice(0, 300),
        tool: `${nameOf(r.agent.user) || 'AI agent'} (${r.agent.model})`.slice(0, 120),
        output: (r.resultText ?? '').replace(/\s+/g, ' ').trim().slice(0, 500) || 'Agent run completed', evidence: iss ? issueUrl(p, iss.number).slice(0, 1000) : null,
        userId: r.requestedById, userName: users.get(r.requestedById) ?? null,
      };
    }),
    ...threads.map((t) => ({
      projectId, sourceKey: `thread:${t.id}`, source: 'AUTO',
      usedAt: toDate(dayInZone(t.createdAt, tz))!, phase: t.mode === 'DEFENSE' ? 'Project Management' : phaseOf(t.title, ''),
      task: (t.mode === 'DEFENSE' ? `Defence practice: ${t.title}` : t.title).slice(0, 300), tool: 'CT Work AI assistant',
      output: `Conversation with ${t.messageCount} message(s)${t.issueNumber ? ` about ${p.key}-${t.issueNumber}` : ''}`,
      evidence: t.issueNumber ? issueUrl(p, t.issueNumber).slice(0, 1000) : null,
      userId: t.createdById, userName: nameOf(t.createdBy) || null,
    })),
  ];
  const before = await prisma.workAiUsageLog.count({ where: { projectId } });
  if (before + data.length > 5000) throw new BadRequestError('The AI usage log is full (5000 rows)', 'WORK_LIMIT');
  const r = data.length ? await prisma.workAiUsageLog.createMany({ data, skipDuplicates: true }) : { count: 0 };
  if (r.count) touch(projectId, userId);
  return { added: r.count, scanned: data.length };
}

export const aiUsageInput = z.object({
  usedAt: dateStr,
  phase: z.enum(SDLC_PHASES),
  task: z.string().trim().min(1, 'Describe the task').max(300),
  tool: z.string().trim().min(1, 'Name the AI tool').max(120),
  output: z.string().max(4000).nullable().optional(),
  validation: z.string().max(4000).nullable().optional(),
  evidence: z.string().trim().max(1000).nullable().optional(),
  measure: z.string().trim().max(300).nullable().optional(),
  value: z.number().int().min(1).max(5).nullable().optional(),
  risks: z.string().max(4000).nullable().optional(),
});
const blank = (v: string | null | undefined) => (v === undefined ? undefined : v?.trim() ? v.trim() : null);

export async function createAiUsage(userId: number, projectId: number, input: z.infer<typeof aiUsageInput>) {
  await requireProject(userId, projectId, 'issue.edit');
  if ((await prisma.workAiUsageLog.count({ where: { projectId } })) >= 5000) throw new BadRequestError('The AI usage log is full (5000 rows)', 'WORK_LIMIT');
  const me = await prisma.user.findUnique({ where: { id: userId }, select: { username: true, fullName: true, displayName: true } });
  const r = await prisma.workAiUsageLog.create({
    data: {
      projectId, source: 'MANUAL', usedAt: toDate(input.usedAt)!, phase: input.phase, task: input.task, tool: input.tool,
      output: blank(input.output) ?? null, validation: blank(input.validation) ?? null, evidence: blank(input.evidence) ?? null,
      measure: blank(input.measure) ?? null, value: input.value ?? null, risks: blank(input.risks) ?? null, userId, userName: me ? displayName(me) : null,
    },
  });
  touch(projectId, userId);
  return aiOut(r);
}

export async function updateAiUsage(userId: number, projectId: number, id: number, input: Partial<z.infer<typeof aiUsageInput>>) {
  await requireProject(userId, projectId, 'issue.edit');
  const found = await prisma.workAiUsageLog.findFirst({ where: { id, projectId }, select: { id: true } });
  if (!found) throw new NotFoundError('AI usage entry not found');
  const r = await prisma.workAiUsageLog.update({
    where: { id },
    data: {
      ...(input.usedAt ? { usedAt: toDate(input.usedAt)! } : {}),
      ...(input.phase ? { phase: input.phase } : {}),
      ...(input.task ? { task: input.task } : {}),
      ...(input.tool ? { tool: input.tool } : {}),
      ...(input.output !== undefined ? { output: blank(input.output) } : {}),
      ...(input.validation !== undefined ? { validation: blank(input.validation) } : {}),
      ...(input.evidence !== undefined ? { evidence: blank(input.evidence) } : {}),
      ...(input.measure !== undefined ? { measure: blank(input.measure) } : {}),
      ...(input.value !== undefined ? { value: input.value } : {}),
      ...(input.risks !== undefined ? { risks: blank(input.risks) } : {}),
    },
  });
  touch(projectId, userId);
  return aiOut(r);
}

export async function deleteAiUsage(userId: number, projectId: number, id: number) {
  await requireProject(userId, projectId, 'issue.edit');
  const r = await prisma.workAiUsageLog.deleteMany({ where: { id, projectId } });
  if (!r.count) throw new NotFoundError('AI usage entry not found');
  touch(projectId, userId);
}

export async function exportAiUsage(userId: number, projectId: number) {
  await requireProject(userId, projectId, 'project.view');
  const [p, doc, members, rows] = await Promise.all([
    projectHead(projectId), loadReportDoc(projectId), teamMembers(projectId),
    prisma.workAiUsageLog.findMany({ where: { projectId }, orderBy: [{ usedAt: 'asc' }, { id: 'asc' }], take: 5000 }),
  ]);
  // Gom theo tuần: có tuần 1 ⇒ "Week n"; chưa khai ⇒ theo thứ Hai của tuần.
  const groups = new Map<string, { weekNo: number | null; label: string; rows: AiUsageRow[] }>();
  for (const r of rows) {
    const day = iso(r.usedAt)!;
    const n = weekNumber(day, doc.week1Start);
    const key = n && n > 0 ? `n${String(n).padStart(3, '0')}` : `d${mondayOf(day)}`;
    if (!groups.has(key)) groups.set(key, { weekNo: n && n > 0 ? n : null, label: n && n > 0 ? `Week ${n}` : `Week ${ddmmyyyy(mondayOf(day)).slice(0, 5)}`, rows: [] });
    groups.get(key)!.rows.push({ usedAt: day, phase: r.phase, task: r.task, tool: r.tool, output: r.output, validation: r.validation, evidence: r.evidence, measure: r.measure, value: r.value, risks: r.risks });
  }
  const weeks = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
  const students = doc.students.length ? doc.students : members.map((m) => ({ code: '', name: m.name, role: m.role, aiTools: '' }));
  const d: AiUsageDocData = {
    subjectCode: doc.subjectCode ?? 'SWP391', subjectName: doc.subjectName ?? 'Software development project', classCode: doc.classCode, semester: doc.semester,
    lecturer: doc.lecturer, groupCode: doc.groupCode ?? p.key, projectTitle: doc.projectTitle ?? p.name, students,
  };
  const sheets = buildAiUsageSheets(d, weeks);
  return { file: `${fileSafe(doc.groupCode ?? p.key)}_SWP391_AI_Usage_Report.xlsx`, buffer: writeXlsx(sheets, { title: `${p.key} — AI Usage Report` }), count: rows.length };
}

export { iterationLabel };
