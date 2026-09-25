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
 */

import { prisma } from '../../config/database.js';
import { displayName } from './common.js';
import { xlsxWorkbook } from './exchange.service.js';
import { requireProject } from './permissions.js';

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

export async function projectTrackingXlsx(userId: number, projectId: number): Promise<{ file: string; buffer: Buffer; count: number }> {
  await requireProject(userId, projectId, 'project.view');
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
      number: true, title: true, updatedAt: true, resolvedAt: true,
      status: { select: { name: true, category: true } },
      assignee: { select: { username: true, fullName: true, displayName: true } },
      fixVersion: { select: { name: true } },
      labels: { select: { label: { select: { name: true } } } },
      customValues: { select: { fieldId: true, value: true } },
      children: { where: { deletedAt: null }, select: { title: true, status: { select: { category: true } } } },
    },
  });

  const val = (it: (typeof issues)[number], field: Field | undefined) => display(field, it.customValues.find((c) => c.fieldId === field?.id)?.value);
  const rows = issues.map((it) => {
    const labels = it.labels.map((l) => l.label.name);
    const iteration = it.fixVersion?.name ?? labels.find((l) => /^iter\d+$/i.test(l)) ?? '';
    const pic = (val(it, F.ws) as string | null) ?? (it.assignee ? displayName(it.assignee) : '');
    const phases = PHASES.map(([, re]) => {
      const sub = it.children.find((c) => re.test(c.title.trim()));
      return sub ? CATEGORY_TEXT[sub.status.category] ?? sub.status.category : '';
    });
    const title = it.title.replace(/^\s*[SN]\d{1,3}\s+/, ''); // "S22 Create reservation…" ⇒ bỏ mã màn ở đầu (đã có cột Screen ID)
    return {
      screen: (val(it, F.screen) as string | null) ?? (/^\s*([SN]\d{1,3})\s/.exec(it.title)?.[1] ?? ''),
      title, key: `${project.key}-${it.number}`,
      wf: labels.find((l) => /^WF\d$/i.test(l)) ?? '',
      iteration, pic,
      assignee: it.assignee ? displayName(it.assignee) : '',
      complexity: val(it, F.cx) ?? '', planned: val(it, F.planned), quality: val(it, F.quality) ?? '', graded: val(it, F.graded),
      status: it.status.name, done: it.status.category === 'DONE',
      phases,
      evidence: val(it, F.evidence) ?? '',
      resolved: fmtDate(it.resolvedAt), updated: fmtDate(it.updatedAt),
    };
  });

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
