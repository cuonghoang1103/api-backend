/**
 * CT Work — xuất "Project Tracking" theo mẫu SWP391 (25/09/2026).
 *
 * Lớp SWP391 nộp mỗi iteration một file `{Class}_{Group}_{System}_ProjectTracking.xlsx`
 * có sheet Product: mỗi dòng một màn hình/chức năng (Req) với PIC, iteration dự
 * kiến, tiến độ SRS/SDS/Coding/Test, Quality và LOC. Trước đây phải chép tay từ
 * board sang Excel mỗi tuần — dễ lệch với thực tế đúng lúc giảng viên chấm.
 *
 * Nguồn:
 *   • Req = thẻ có nhãn `Req`, hoặc có giá trị ở trường tuỳ chỉnh "Screen ID".
 *   • Trường đọc THEO TÊN (không phân biệt hoa thường): Screen ID, Complexity,
 *     Planned LOC, Quality, Graded LOC, Workstream, Evidence. Dự án không có
 *     trường nào thì cột đó để trống — không lỗi.
 *   • Tiến độ từng pha lấy từ việc con có tiêu đề bắt đầu bằng "Write SRS",
 *     "Write SDS", "Code", "Test cases", "Integrate" (đúng mẫu 5 việc/Req).
 *   • Iteration = Fix version; nhãn iter1/iter2/iter3 dùng khi thẻ chưa gắn version.
 *
 * Sheet Summary: mỗi PIC một dòng — số Req, LOC dự kiến theo iteration, LOC
 * đã chấm, số Req đạt Quality ≥ L2. Đây là con số GV nhìn để chấm từng người.
 *
 * Đợt 3B (09/10/2026, A23) — thêm `variant` đúng từng mẫu lớp:
 *   • SEP490    = Report2_Project Tracking.xlsx: Scope · WBS · Q&A · TimeLogs · Defects · Issues
 *                 (giai đoạn/thẻ/worklog/Bug/RAID — dữ liệu ở fptReports.service.loadSep490).
 *   • SWP391_T1 = Template1_Project Tracking.xlsx: Project · Iter1…Iter4 (Req + pha SRS/SDS theo việc con).
 *   • ISSUES    = Template4_Issues Report.xlsx: mỗi thẻ một dòng kiểu GitLab (State, Milestone, Labels…).
 *   • SWP391    = Product + Summary (bản 25/09, giữ nguyên làm mặc định).
 */

import { prisma } from '../../config/database.js';
import { displayName, frontendUrl } from './common.js';
import { xlsxWorkbook } from './exchange.service.js';
import { buildSep490Sheets, buildTemplate1Sheets, buildTemplate4Sheet, iterationLabel, type T1Row, type T4Row } from './fptReports.js';
import { loadSep490 } from './fptReports.service.js';
import { requireProject } from './permissions.js';
import { writeXlsx } from './xlsxStyled.js';

export const TRACKING_VARIANTS = ['SWP391', 'SEP490', 'SWP391_T1', 'ISSUES'] as const;
export type TrackingVariant = (typeof TRACKING_VARIANTS)[number];

const PHASES: Array<[label: string, prefix: RegExp]> = [
  ['SRS', /^write srs\b/i],
  ['SDS', /^write sds\b/i],
  ['Coding', /^code\b/i],
  ['Test', /^test cases?\b/i],
  ['Integrate', /^integrate\b/i],
];
const CATEGORY_TEXT: Record<string, string> = { TODO: 'To do', IN_PROGRESS: 'Doing', DONE: 'Done' };
const fmtDate = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : '');

type Field = { id: number; name: string; kind: string; options: unknown };

/** Giá trị trường tuỳ chỉnh ⇒ chữ/số hiển thị (SELECT lưu id lựa chọn ⇒ đổi sang nhãn). */
function display(field: Field | undefined, value: unknown): string | number | null {
  if (!field || value === undefined || value === null) return null;
  const opts = Array.isArray(field.options) ? (field.options as Array<{ id: string; label: string }>) : [];
  const label = (id: unknown) => opts.find((o) => o.id === id)?.label ?? String(id);
  if (field.kind === 'SELECT') return label(value);
  if (field.kind === 'MULTISELECT') return Array.isArray(value) ? value.map(label).join(', ') : null;
  if (field.kind === 'NUMBER') return typeof value === 'number' ? value : Number(value) || null;
  return String(value);
}

/** Một Req đã đọc xong — dùng chung cho file Project Tracking, soát Req và sức khoẻ nhóm. */
export interface ReqRow {
  number: number; key: string; screen: string; title: string; wf: string; iteration: string; pic: string;
  assignee: string; assigneeId: number | null; complexity: string | number; planned: string | number | null;
  quality: string | number; graded: string | number | null; status: string; category: string; done: boolean;
  phases: string[]; evidence: string | number; resolved: string; updated: string; updatedAt: Date; dueDate: Date | null;
  unhappyCount: number; descriptionLength: number;
  version: { name: string; startDate: Date | null; releaseDate: Date | null } | null;
}

/** Đọc mọi Req của dự án (nhãn Req hoặc có Screen ID) — KHÔNG kiểm quyền, nơi gọi phải kiểm. */
export async function loadRequirements(projectId: number): Promise<{ project: { key: string; name: string }; rows: ReqRow[] }> {
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, name: true } });
  const fields: Field[] = await prisma.workCustomField.findMany({ where: { projectId }, select: { id: true, name: true, kind: true, options: true } });
  const f = (name: string) => fields.find((x) => x.name.trim().toLowerCase() === name.toLowerCase());
  const F = { screen: f('Screen ID'), cx: f('Complexity'), planned: f('Planned LOC'), quality: f('Quality'), graded: f('Graded LOC'), ws: f('Workstream'), evidence: f('Evidence') };

  const issues = await prisma.workIssue.findMany({
    where: {
      projectId, deletedAt: null,
      OR: [
        { labels: { some: { label: { name: { equals: 'Req', mode: 'insensitive' } } } } },
        ...(F.screen ? [{ customValues: { some: { fieldId: F.screen.id } } }] : []),
      ],
    },
    orderBy: { number: 'asc' },
    select: {
      number: true, title: true, updatedAt: true, resolvedAt: true, dueDate: true, assigneeId: true, descriptionText: true,
      status: { select: { name: true, category: true } },
      assignee: { select: { username: true, fullName: true, displayName: true } },
      fixVersion: { select: { name: true, startDate: true, releaseDate: true } },
      labels: { select: { label: { select: { name: true } } } },
      customValues: { select: { fieldId: true, value: true } },
      children: { where: { deletedAt: null }, select: { title: true, status: { select: { category: true } } } },
    },
  });

  const val = (it: (typeof issues)[number], field: Field | undefined) => display(field, it.customValues.find((c) => c.fieldId === field?.id)?.value);
  const rows: ReqRow[] = issues.map((it) => {
    const labels = it.labels.map((l) => l.label.name);
    const iteration = it.fixVersion?.name ?? labels.find((l) => /^iter\d+$/i.test(l)) ?? '';
    const pic = (val(it, F.ws) as string | null) ?? (it.assignee ? displayName(it.assignee) : '');
    const phases = PHASES.map(([, re]) => {
      const sub = it.children.find((c) => re.test(c.title.trim()));
      return sub ? CATEGORY_TEXT[sub.status.category] ?? sub.status.category : '';
    });
    const desc = it.descriptionText ?? '';
    return {
      number: it.number,
      screen: (val(it, F.screen) as string | null) ?? (/^\s*([SN]\d{1,3})\s/.exec(it.title)?.[1] ?? ''),
      title: it.title.replace(/^\s*[SN]\d{1,3}\s+/, ''), key: `${project.key}-${it.number}`,
      wf: labels.find((l) => /^WF\d$/i.test(l)) ?? '',
      iteration, pic,
      assignee: it.assignee ? displayName(it.assignee) : '', assigneeId: it.assigneeId,
      complexity: val(it, F.cx) ?? '', planned: val(it, F.planned), quality: val(it, F.quality) ?? '', graded: val(it, F.graded),
      status: it.status.name, category: it.status.category, done: it.status.category === 'DONE',
      phases,
      evidence: val(it, F.evidence) ?? '',
      resolved: fmtDate(it.resolvedAt), updated: fmtDate(it.updatedAt), updatedAt: it.updatedAt, dueDate: it.dueDate,
      // Chỉ đếm DÒNG tiêu chí "Unhappy: …" (mẫu Req) — không đếm chữ unhappy trong câu giải thích Quality.
      unhappyCount: (desc.match(/(^|\n)\s*unhappy\s*:/gi) ?? []).length,
      descriptionLength: desc.trim().length,
      version: it.fixVersion ? { name: it.fixVersion.name, startDate: it.fixVersion.startDate, releaseDate: it.fixVersion.releaseDate } : null,
    };
  });
  return { project, rows };
}

export const PHASE_LABELS = PHASES.map(([l]) => l);

export async function projectTrackingXlsx(userId: number, projectId: number, variant: TrackingVariant = 'SWP391'): Promise<{ file: string; buffer: Buffer; count: number }> {
  await requireProject(userId, projectId, 'project.view');
  const stamp = new Date().toISOString().slice(0, 10);
  if (variant === 'SEP490') {
    const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true } });
    const input = await loadSep490(projectId);
    const sheets = buildSep490Sheets(input);
    // CTW đợt 4 (A19): dự án có SRS có cấu trúc (use case) ⇒ thêm sheet RTM ở CUỐI tệp (hướng dẫn RTM: không chèn giữa 6 sheet mẫu).
    if (await prisma.workUseCase.count({ where: { projectId, status: { not: 'PROPOSED' } } })) {
      const { loadRtm } = await import('./rtm.service.js');
      const { rtmTrackingSheet } = await import('./rtm.js');
      const r = await loadRtm(projectId);
      sheets.push(rtmTrackingSheet(r.rows, r.projectName));
    }
    return { file: `${p.key}_Report2_Project_Tracking_${stamp}`, buffer: writeXlsx(sheets, { title: `${p.key} — Project Tracking` }), count: input.wbs.length };
  }
  if (variant === 'SWP391_T1') return template1Xlsx(projectId, stamp);
  if (variant === 'ISSUES') return issuesReportXlsx(projectId, stamp);
  const { project, rows } = await loadRequirements(projectId);

  const product = {
    name: 'Product',
    headers: ['No', 'Screen ID', 'Screen / Function', 'Issue', 'Workflow', 'Iteration', 'PIC', 'Assignee', 'Complexity', 'Planned LOC', 'Quality', 'Graded LOC', 'Status', ...PHASES.map(([l]) => l), 'Evidence', 'Done on', 'Updated'],
    widths: [5, 10, 48, 10, 9, 10, 30, 18, 11, 11, 10, 11, 12, 9, 9, 9, 9, 10, 40, 11, 11],
    pre: [
      [`${project.name} (${project.key}) — Project Tracking`],
      [`Exported ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC · ${rows.length} requirements · from CT Work`],
    ],
    data: rows.map((r, i) => [i + 1, r.screen, r.title, r.key, r.wf, r.iteration, r.pic, r.assignee, r.complexity, r.planned, r.quality, r.graded, r.status, ...r.phases, r.evidence, r.resolved, r.updated]),
  };

  // Summary theo PIC: đúng các con số GV dùng để chấm từng người.
  const iterations = [...new Set(rows.map((r) => r.iteration).filter(Boolean))].sort();
  const byPic = new Map<string, typeof rows>();
  for (const r of rows) byPic.set(r.pic || '(unassigned)', [...(byPic.get(r.pic || '(unassigned)') ?? []), r]);
  const num = (v: unknown) => (typeof v === 'number' ? v : Number(v) || 0);
  const goodQuality = (q: unknown) => /^L[23]\b/i.test(String(q ?? ''));
  const summaryData = [...byPic.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([pic, list]) => [
    pic, list.length, list.filter((r) => r.done).length,
    ...iterations.map((it) => list.filter((r) => r.iteration === it).reduce((s, r) => s + num(r.planned), 0)),
    list.reduce((s, r) => s + num(r.planned), 0),
    list.reduce((s, r) => s + num(r.graded), 0),
    list.filter((r) => goodQuality(r.quality)).length,
  ]);
  const summary = {
    name: 'Summary',
    headers: ['PIC', 'Requirements', 'Done', ...iterations.map((it) => `Planned LOC ${it}`), 'Planned LOC total', 'Graded LOC', 'Quality ≥ L2'],
    widths: [34, 13, 8, ...iterations.map(() => 16), 17, 12, 13],
    pre: [[`${project.name} (${project.key}) — LOC by person`], ['Quality L1 = happy path only (50%) · L2 = unhappy cases handled (75%) · L3 = complete (100%)']],
    data: summaryData,
  };

  const file = `${project.key}_ProjectTracking_${new Date().toISOString().slice(0, 10)}`;
  return { file, buffer: xlsxWorkbook([product, summary]), count: rows.length };
}

// ─── Đợt 3B: SWP391 Template1 (Project + Iter1…Iter4) ────────────

async function template1Xlsx(projectId: number, stamp: string) {
  const { project, rows } = await loadRequirements(projectId);
  // Feature = epic cha · Actor = trường "Actor" (đọc theo tên) — như cách loadRequirements đọc trường.
  const extra = await prisma.workIssue.findMany({
    where: { projectId, number: { in: rows.map((r) => r.number) } },
    select: {
      number: true, descriptionText: true, parent: { select: { title: true, type: { select: { key: true } } } }, wbsItem: { select: { feature: true } },
      customValues: { where: { field: { name: { equals: 'Actor', mode: 'insensitive' } } }, select: { value: true, field: { select: { kind: true, options: true } } } },
    },
  });
  const by = new Map(extra.map((e) => [e.number, e]));
  const phase = (t: string) => (t === 'Done' ? 'Done' : t === 'Doing' ? 'Doing' : t ? 'Pending' : '');
  const t1: T1Row[] = rows.map((r) => {
    const e = by.get(r.number);
    const cv = e?.customValues[0];
    const actor = cv ? display({ id: 0, name: 'Actor', kind: cv.field.kind, options: cv.field.options }, cv.value) : null;
    const status = r.done ? 'Done' : r.category === 'IN_PROGRESS' ? 'Doing' : 'To Do';
    return {
      screen: r.screen ? `${r.screen} ${r.title}` : r.title,
      feature: e?.wbsItem?.feature ?? (e?.parent?.type.key === 'EPIC' ? e.parent.title : r.wf),
      actor: actor ? String(actor) : '',
      description: (e?.descriptionText ?? '').split('\n').map((x) => x.trim()).find(Boolean)?.slice(0, 400) ?? '',
      inCharge: r.pic, status, actual: r.done ? r.iteration : '', updated: 'none', details: r.key,
      iteration: r.iteration, srs: phase(r.phases[0]), sds: phase(r.phases[1]), notes: `${r.key} · ${r.status}`,
    };
  });
  return { file: `${project.key}_ProjectTracking_T1_${stamp}`, buffer: writeXlsx(buildTemplate1Sheets(t1), { title: `${project.key} — Project Tracking` }), count: t1.length };
}

// ─── Đợt 3B: SWP391 Template4 Issues Report ──────────────────────

const CAT_LABEL: Record<string, string> = { TODO: '1_To Do', IN_PROGRESS: '2_Doing', DONE: '3_Done' };

async function issuesReportXlsx(projectId: number, stamp: string) {
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true, workspace: { select: { slug: true } } } });
  const issues = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null },
    orderBy: { number: 'asc' },
    take: 5000,
    select: {
      number: true, title: true, descriptionText: true, createdAt: true, dueDate: true,
      type: { select: { key: true, name: true } }, status: { select: { category: true } },
      assignee: { select: { username: true, fullName: true, displayName: true } },
      fixVersion: { select: { name: true } }, sprint: { select: { name: true } },
      labels: { select: { label: { select: { name: true } } } },
      parent: { select: { title: true, type: { select: { key: true } } } },
    },
  });
  const typeLabel = (k: string, name: string) => (k === 'BUG' ? 'Defect' : k === 'STORY' || k === 'REQUIREMENT' || k === 'EPIC' ? 'WP' : k === 'SUBTASK' ? 'Task' : name);
  const rows: T4Row[] = issues.map((i) => ({
    title: i.title,
    description: (i.descriptionText ?? '').replace(/\s+/g, ' ').trim().slice(0, 500),
    id: i.number,
    url: frontendUrl(`/work/${p.workspace.slug}/${p.key}/issue/${i.number}`),
    state: i.status.category === 'DONE' ? 'Closed' : 'Open',
    assignee: i.assignee ? displayName(i.assignee) : '',
    createdAt: i.createdAt,
    dueDate: i.dueDate ? i.dueDate.toISOString().slice(0, 10) : null,
    milestone: (i.fixVersion?.name ?? i.sprint?.name ?? '').replace(/^Iteration\s*(\d+)$/i, 'iter$1'),
    labels: [typeLabel(i.type.key, i.type.name), CAT_LABEL[i.status.category] ?? i.status.category, ...i.labels.map((l) => l.label.name)].join(', '),
    // Functions/Screens = Req cha (việc con của mẫu: Write SRS/SDS/Code… cho một màn hình).
    functions: i.parent && i.parent.type.key !== 'EPIC' ? i.parent.title.replace(/^\s*[SN]\d{1,3}\s+/, '') : i.type.key === 'STORY' || i.type.key === 'REQUIREMENT' ? i.title.replace(/^\s*[SN]\d{1,3}\s+/, '') : '',
  }));
  return { file: `${p.key}_Issues_Report_${stamp}`, buffer: writeXlsx([buildTemplate4Sheet(rows)], { title: `${p.key} — Issues Report` }), count: rows.length };
}

export { iterationLabel };
