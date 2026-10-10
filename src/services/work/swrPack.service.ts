/**
 * CT Work đợt 8c (12/10/2026) — SWR302 R13 / R24 / R26 — phần có DB. Phần thuần ở swrPack.ts.
 *
 *   GET  /projects/:pid/swr/estimation              số tự đếm + cấu hình đã lưu + kết quả 3 cách
 *   PUT  /projects/:pid/swr/estimation              { counts?, project?, factors?, minutes? } (null ⇒ bỏ ghi đè)
 *   GET  /projects/:pid/swr/export/estimation.xlsx  Summary + Assumptions (khung như tệp Wiegers)
 *   GET  /projects/:pid/swr/status-report?days=30   R24
 *   GET  /projects/:pid/swr/export/status-report.xlsx
 *   GET  /projects/:pid/swr/package.zip             R26 — 8 deliverable đúng tên tệp
 */

import JSZip from 'jszip';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { auditProject } from './audit.js';
import { displayName } from './common.js';
import { emitWorkEvent } from './events.js';
import { inDocument } from './srs.js';
import { loadSrs, srsCtx } from './srs.service.js';
import * as swr from './swr.service.js';
import { isLive } from './swr.js';
import {
  countMismatches, EST_COUNT_KEYS, EST_COUNT_LABEL, EST_FACTORS, estimate, PACKAGE_FILES, safeName, statusReport,
  type EstConfig, type EstCounts, type EstimateResult,
} from './swrPack.js';
import { writeXlsx, XSheet, type XStyle } from './xlsxStyled.js';

const projectInfo = (projectId: number) => prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });

// ─── R13 ─────────────────────────────────────────────────────────

/** Số tự đếm từ dữ liệu dự án (để "số đếm khớp tài liệu" — liên kết #6 người chấm dò). */
export async function autoCounts(projectId: number): Promise<EstCounts> {
  const [srs, reqReports, stakeholders, erds, ddCount] = await Promise.all([
    loadSrs(projectId),
    prisma.workRequirementInfo.findMany({ where: { projectId, reqType: 'DATA', subtype: 'REPORT', issue: { deletedAt: null } }, select: { lifecycle: true } }),
    prisma.workStakeholder.count({ where: { projectId } }),
    prisma.workDiagram.count({ where: { projectId, deletedAt: null, diagramType: 'ERD' } }),
    prisma.workDataElement.count({ where: { projectId } }).catch(() => 0),
  ]);
  return {
    existingDocPages: 0, existingSystems: 0, stakeholders,
    interfacesSmall: srs.actors.filter((a) => a.kind === 'SYSTEM').length, interfacesMedium: 0, interfacesLarge: 0,
    useCases: inDocument(srs.useCases).length, businessDataDiagrams: erds || (ddCount ? 1 : 0),
    screens: srs.screens.length, reports: reqReports.filter((r) => isLive(r.lifecycle)).length,
  };
}

async function developers(projectId: number) {
  return prisma.workProjectMember.count({ where: { projectId, role: { in: ['ADMIN', 'MEMBER'] }, user: { kind: { not: 'AGENT' } } } });
}

function configOf(raw: unknown): EstConfig {
  return raw && typeof raw === 'object' ? (raw as EstConfig) : {};
}

export async function getEstimation(userId: number, projectId: number) {
  const ctx = await srsCtx(userId, projectId, 'view');
  const [auto, s, devs] = await Promise.all([autoCounts(projectId), prisma.workSwrSettings.findUnique({ where: { projectId }, select: { estimation: true } }), developers(projectId)]);
  const cfg = configOf(s?.estimation);
  const merged: EstConfig = { ...cfg, project: { developers: devs, ...(cfg.project ?? {}) } };
  return { auto, config: cfg, result: estimate(auto, merged), mismatches: countMismatches(auto, cfg), labels: EST_COUNT_LABEL, defaults: { factors: EST_FACTORS }, canEdit: ctx.canEdit };
}

const nn = z.number().min(0).max(1e10);
export const estimationInput = z.object({
  counts: z.object(Object.fromEntries(EST_COUNT_KEYS.map((k) => [k, nn.int().max(100_000).nullable().optional()])) as Record<(typeof EST_COUNT_KEYS)[number], z.ZodOptional<z.ZodNullable<z.ZodNumber>>>).optional(),
  project: z.object({
    totalBudget: nn.nullable().optional(), baHourlyCost: nn.max(1e7).nullable().optional(), projectType: z.enum(['STANDARD', 'COTS']).nullable().optional(),
    developers: nn.int().max(10_000).nullable().optional(), remote: z.boolean().nullable().optional(), projectWeeks: nn.max(520).nullable().optional(),
    requirementsWeeks: nn.max(520).nullable().optional(), budgetPercent: z.number().min(0).max(100).nullable().optional(),
  }).optional(),
  factors: z.object(Object.fromEntries(Object.keys(EST_FACTORS).map((k) => [k, z.number().min(0).max(1000).nullable().optional()])) as Record<keyof typeof EST_FACTORS, z.ZodOptional<z.ZodNullable<z.ZodNumber>>>).optional(),
  minutes: z.record(z.string().max(40), z.number().min(0).max(100_000).nullable()).optional(),
});

/** Gộp: giá trị số ⇒ ghi đè, null ⇒ bỏ ghi đè (về số tự đếm / mặc định). */
function mergeSection<T extends Record<string, unknown>>(cur: T | undefined, patch: Record<string, unknown> | undefined): T | undefined {
  if (!patch) return cur;
  const out: Record<string, unknown> = { ...(cur ?? {}) };
  for (const [k, v] of Object.entries(patch)) { if (v === null) delete out[k]; else if (v !== undefined) out[k] = v; }
  return out as T;
}

export async function updateEstimation(userId: number, projectId: number, input: z.infer<typeof estimationInput>) {
  await srsCtx(userId, projectId, 'edit');
  const s = await prisma.workSwrSettings.findUnique({ where: { projectId }, select: { estimation: true } });
  const cur = configOf(s?.estimation);
  const next: EstConfig = {
    counts: mergeSection(cur.counts, input.counts),
    project: mergeSection(cur.project, input.project),
    factors: mergeSection(cur.factors, input.factors),
    minutes: mergeSection(cur.minutes, input.minutes),
  };
  await prisma.workSwrSettings.upsert({ where: { projectId }, create: { projectId, estimation: next as Prisma.InputJsonValue }, update: { estimation: next as Prisma.InputJsonValue } });
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  return getEstimation(userId, projectId);
}

const H: XStyle = { font: { b: true, color: 'FFFFFF' }, fill: '1F4E79', border: 'thin', align: { v: 'center', wrap: true } };
const Y: XStyle = { fill: 'FFF2CC', border: 'thin' };
const G: XStyle = { fill: 'D9D9D9', border: 'thin' };
const B: XStyle = { border: 'thin' };
const TOT: XStyle = { font: { b: true }, fill: 'BDD7EE', border: 'thin' };
const r2 = (n: number | null) => (n === null ? '—' : Math.round(n * 100) / 100);

export function estimationSheets(e: EstimateResult, projectName: string): XSheet[] {
  const s = new XSheet('Summary');
  s.width(1, 12).width(2, 46).width(3, 18).width(4, 18).width(5, 18).width(6, 10).width(7, 14).width(8, 34);
  s.set(1, 1, `Requirements Estimation — ${projectName}`, { font: { b: true, sz: 14 } });
  s.set(2, 1, 'Model: Wiegers & Beatty, Software Requirements 3rd ed., Ch.19 (Requirements Estimation Tool © 2013 Karl Wiegers and Seilevel). Yellow = inputs (counted from the project in CT Work; edited values marked).', { font: { i: true, sz: 9 } });
  s.set(4, 1, 'Input', { font: { b: true } });
  s.set(5, 1, 'Quantity', H).set(5, 2, 'Items', H).set(5, 4, 'Quantity', H).set(5, 5, 'Items', H).merge(5, 5, 5, 8, H);
  EST_COUNT_KEYS.forEach((k, i) => { s.set(6 + i, 1, e.counts[k], Y).set(6 + i, 2, EST_COUNT_LABEL[k], B); });
  const proj: Array<[string | number, string]> = [
    [e.project.totalBudget, 'Total project budget'], [e.project.baHourlyCost, 'BA blended hourly cost'],
    [e.project.projectType === 'COTS' ? 'COTS' : 'Standard', 'Type of project (Standard or COTS)'], [e.project.developers, 'Number of developers'],
    [e.project.remote ? 'Yes' : 'No', 'Is your team remote?'], [e.project.projectWeeks, 'Project duration? (weeks)'], [e.project.requirementsWeeks, 'Requirements work duration? (weeks)'],
  ];
  proj.forEach(([v, l], i) => { s.set(6 + i, 4, v, Y).set(6 + i, 5, l, B).merge(6 + i, 5, 6 + i, 8, B); });
  let r = 17;
  s.set(r, 1, 'Summary Total Effort Comparison', { font: { b: true } });
  r += 1;
  s.set(r, 3, '% of total project', H).set(r, 4, 'Ratio of dev to BAs', H).set(r, 5, 'Activity based', H);
  const m = e.methods;
  s.set(r + 1, 2, 'Number of business analysts (BAs)', B).set(r + 1, 3, r2(m.budgetPercent.bas), TOT).set(r + 1, 4, r2(m.devRatio.bas), TOT).set(r + 1, 5, r2(m.activity.bas), TOT).set(r + 1, 6, '*Excludes time off', { font: { i: true, sz: 9 } });
  s.set(r + 2, 2, 'BA budget for requirements work', B).set(r + 2, 3, Math.round(m.budgetPercent.requirementsCost), B).set(r + 2, 4, Math.round(m.devRatio.requirementsCost), B).set(r + 2, 5, Math.round(m.activity.requirementsCost), B);
  s.set(r + 3, 2, 'BA budget for project duration', B).set(r + 3, 3, m.budgetPercent.projectCost === null ? '—' : Math.round(m.budgetPercent.projectCost), B).set(r + 3, 4, Math.round(m.devRatio.projectCost), B).set(r + 3, 5, m.activity.projectCost === null ? '—' : Math.round(m.activity.projectCost), B);
  r += 5;
  s.set(r, 1, 'Estimates', { font: { b: true } });
  r += 1;
  ['Category', 'Activity', 'Hours by Category', 'Hours', 'Minutes per unit', 'Units', 'Minutes', 'Notes'].forEach((h, i) => s.set(r, i + 1, h, H));
  r += 1;
  for (const c of e.categories) {
    s.set(r, 1, c.category, { font: { b: true }, border: 'thin' }).merge(r, 1, r, 2, B).set(r, 3, r2(c.hours), TOT);
    r += 1;
    for (const row of e.rows.filter((x) => x.category === c.category)) {
      s.set(r, 2, row.label, B).set(r, 4, r2(row.hours), G).set(r, 5, row.minutesPerUnit, row.edited ? Y : G).set(r, 6, row.units ?? 'N/A', G).set(r, 7, Math.round(row.minutes), G).set(r, 8, row.note ?? (row.edited ? 'Edited minutes per unit' : ''), B);
      r += 1;
    }
  }
  r += 1;
  s.set(r, 1, 'Total Effort', { font: { b: true } });
  s.set(r + 1, 2, 'Requirements Work (hours)', B).set(r + 1, 3, r2(e.totals.workHours), TOT);
  s.set(r + 2, 2, 'Remote Team Buffer add-on (10%)', B).set(r + 2, 3, r2(e.totals.remoteBuffer), B);
  s.set(r + 3, 2, 'Hours of work with buffer', B).set(r + 3, 3, r2(e.totals.hours), TOT);
  s.set(r + 5, 2, `Developers per BA (${e.project.projectType === 'COTS' ? 'COTS' : 'Standard'})`, B).set(r + 5, 3, m.devRatio.ratio, B);
  s.set(r + 6, 2, 'Percent of budget allocated to requirements', B).set(r + 6, 3, `${e.project.budgetPercent}%`, B).set(r + 6, 4, '15% is industry standard', { font: { i: true, sz: 9 } });

  const a = new XSheet('Assumptions');
  a.width(1, 40).width(2, 14).width(3, 34);
  a.set(1, 1, 'Estimated model counts', { font: { b: true } });
  a.set(2, 1, 'Model', H).set(2, 2, 'Quantity', H).set(2, 3, 'Estimate based on', H);
  const d = e.derived;
  const rowsA: Array<[string, number, string]> = [
    ['User Stories', d.userStories, 'Process Flow / Use Case'], ['Decision Trees', d.decisionTrees, 'Process Flow / Use Case'], ['Data Flow Diagrams', d.dfds, 'BDDs'],
    ['Data Dictionaries', d.dataDictionaries, 'BDDs'], ['State Tables / Diagrams', d.stateTables, 'BDDs'], ['Requirements', d.requirements, 'Process Flow / Use Case'],
    ['Business Rules', d.businessRules, 'Process Flow / Use Case'], ['Number of traces', d.traces, 'Requirements'],
  ];
  rowsA.forEach(([l, v, b], i) => a.set(3 + i, 1, l, B).set(3 + i, 2, v, G).set(3 + i, 3, b, B));
  const f0 = 13;
  a.set(f0, 1, 'Assumption', H).set(f0, 2, 'Value', H).set(f0, 3, 'Default', H);
  Object.entries(e.factors).forEach(([k, v], i) => a.set(f0 + 1 + i, 1, k.replace(/([A-Z])/g, ' $1').toLowerCase(), B).set(f0 + 1 + i, 2, v, Y).set(f0 + 1 + i, 3, EST_FACTORS[k as keyof typeof EST_FACTORS], G));
  return [s, a];
}

export async function exportEstimation(userId: number, projectId: number) {
  const est = await getEstimation(userId, projectId);
  const p = await projectInfo(projectId);
  return { buffer: writeXlsx(estimationSheets(est.result, p.name), { title: `Requirements Estimation — ${p.name}`, creator: 'CT Work' }), file: `${p.key}_Requirements_Estimation.xlsx` };
}

// ─── R24 ─────────────────────────────────────────────────────────

export async function getStatusReport(userId: number, projectId: number, q: { days?: number } = {}) {
  await srsCtx(userId, projectId, 'view');
  const days = Math.min(Math.max(q.days ?? 30, 7), 365);
  const now = new Date();
  const since = new Date(now.getTime() - Math.max(days, 8 * 7) * 86_400_000);
  const reqIssues = await prisma.workIssue.findMany({
    where: { projectId, type: { key: 'REQUIREMENT' } }, take: 5000,
    select: { id: true, createdAt: true, deletedAt: true, requirementInfo: { select: { lifecycle: true, reqType: true, reqVersion: true } } },
  });
  const ids = reqIssues.map((i) => i.id);
  const [changes, logs] = await Promise.all([
    ids.length ? prisma.workHistory.findMany({ where: { issueId: { in: ids }, field: { startsWith: 'Requirement' }, createdAt: { gte: since } }, select: { createdAt: true, field: true, fromValue: true, toValue: true }, take: 20_000 }) : [],
    prisma.workWorklog.findMany({
      where: { issue: { projectId }, startedAt: { gte: since }, OR: [{ activity: 'Analyzing' }, { issue: { type: { key: 'REQUIREMENT' } } }] },
      select: { startedAt: true, minutes: true, user: { select: { username: true, displayName: true, fullName: true } } }, take: 20_000,
    }),
  ]);
  const r = statusReport({
    reqs: reqIssues.map((i) => ({ lifecycle: i.requirementInfo?.lifecycle ?? 'PROPOSED', reqType: i.requirementInfo?.reqType ?? 'FUNCTIONAL', createdAt: i.createdAt, reqVersion: i.requirementInfo?.reqVersion ?? 1, deletedAt: i.deletedAt })),
    changes: changes.map((c) => ({ at: c.createdAt, field: c.field, from: c.fromValue, to: c.toValue })),
    effort: logs.map((l) => ({ at: l.startedAt, minutes: l.minutes, who: displayName(l.user) })),
    now, days,
  });
  return { ...r, generatedAt: now };
}

export async function exportStatusReport(userId: number, projectId: number, q: { days?: number } = {}) {
  const r = await getStatusReport(userId, projectId, q);
  const p = await projectInfo(projectId);
  const s = new XSheet('Status');
  s.width(1, 34).width(2, 14).width(3, 14).width(4, 14).width(5, 14);
  s.set(1, 1, `Requirements status report — ${p.name}`, { font: { b: true, sz: 14 } });
  s.set(2, 1, `Last ${r.window.days} days (from ${r.window.from}) · generated ${r.generatedAt.toISOString().slice(0, 10)}`, { font: { i: true } });
  let row = 4;
  s.set(row, 1, 'Requirements by status', H).set(row, 2, 'Count', H); row += 1;
  for (const [k, v] of Object.entries(r.byLifecycle)) { s.set(row, 1, k.charAt(0) + k.slice(1).toLowerCase(), B).set(row, 2, v, B); row += 1; }
  s.set(row, 1, 'Total', TOT).set(row, 2, r.total, TOT); row += 2;
  s.set(row, 1, 'Requirements by type', H).set(row, 2, 'Count', H); row += 1;
  for (const [k, v] of Object.entries(r.byType)) { s.set(row, 1, k.replace(/_/g, ' ').toLowerCase(), B).set(row, 2, v, B); row += 1; }
  row += 1;
  s.set(row, 1, 'Volatility (period)', H).set(row, 2, 'Value', H); row += 1;
  for (const [l, v] of [['Added', r.window.added], ['Modified', r.window.modified], ['Deleted / rejected', r.window.deleted], ['Volatility % = changes ÷ baseline', `${r.window.volatility}%`], ['Requirements changed after first version', r.versionedMoreThanOnce]] as Array<[string, string | number]>) { s.set(row, 1, l, B).set(row, 2, v, B); row += 1; }
  row += 1;
  s.set(row, 1, 'Requirements management effort', H).set(row, 2, 'Hours', H); row += 1;
  for (const e of r.effort.byPerson) { s.set(row, 1, e.who, B).set(row, 2, e.hours, B); row += 1; }
  s.set(row, 1, 'Total', TOT).set(row, 2, r.effort.hours, TOT); row += 2;
  s.set(row, 1, 'Week (Mon)', H).set(row, 2, 'Added', H).set(row, 3, 'Changed', H).set(row, 4, 'Deleted', H).set(row, 5, 'RM hours', H); row += 1;
  for (const t of r.trend) { s.set(row, 1, t.week, B).set(row, 2, t.added, B).set(row, 3, t.changed, B).set(row, 4, t.deleted, B).set(row, 5, t.effortHours, B); row += 1; }
  s.set(row + 1, 1, 'RM effort = work logs with activity "Analyzing" or logged on Requirement issues. Changes = requirement attribute/lifecycle history.', { font: { i: true, sz: 9 } });
  return { buffer: writeXlsx([s], { title: `Requirements status — ${p.name}`, creator: 'CT Work' }), file: `${p.key}_Requirements_Status.xlsx` };
}

// ─── R26 ─────────────────────────────────────────────────────────

/**
 * Gói nộp Assignment SWR302: 8 deliverable, tên tệp đánh số đúng thứ tự đề. Tệp nào dựng hỏng (vd chưa có dữ liệu) vẫn
 * có mặt dạng `_MISSING.txt` nói lý do — nộp thiếu mà không biết là tệ nhất. Kèm README liệt kê + sáu liên kết đạt/chưa.
 */
export async function buildPackage(userId: number, projectId: number) {
  await srsCtx(userId, projectId, 'view');
  const p = await projectInfo(projectId);
  const zip = new JSZip();
  const root = zip.folder(`${p.key}_SWR302_Assignment`)!;
  const report: Array<{ n: number; file: string; ok: boolean; note: string }> = [];
  const add = async (n: number, file: string, fn: () => Promise<Buffer | null>, note = '') => {
    try {
      const b = await fn();
      if (b) { root.file(file, b); report.push({ n, file, ok: true, note }); return; }
      root.file(`${file}_MISSING.txt`, `Deliverable ${n} could not be produced: ${note || 'no data yet'}.\n`);
      report.push({ n, file, ok: false, note: note || 'no data yet' });
    } catch (err) {
      root.file(`${file}_MISSING.txt`, `Deliverable ${n} could not be produced: ${(err as Error).message}\n`);
      report.push({ n, file, ok: false, note: (err as Error).message.slice(0, 200) });
    }
  };
  for (const d of PACKAGE_FILES) {
    if (d.key === 'mockups') continue;
    if (d.key === 'prioritization') { await add(d.n, d.file, async () => (await swr.exportPriority(userId, projectId)).buffer); continue; }
    if (d.key === 'estimation') { await add(d.n, d.file, async () => (await exportEstimation(userId, projectId)).buffer); continue; }
    await add(d.n, d.file, async () => (await swr.exportWiegers(userId, projectId, d.key as swr.DocKind, { format: 'docx' })).buffer);
  }
  // 6 — mock-up: ảnh tải lên (theo màn hình) + danh sách link Figma/… + trạng thái duyệt.
  try {
    const { readImageBytes } = await import('./docs3a.service.js');
    const rows = await prisma.workScreenMockup.findMany({ where: { projectId }, orderBy: [{ screenId: 'asc' }, { id: 'asc' }], select: { id: true, title: true, kind: true, url: true, imageId: true, status: true, screen: { select: { name: true } } } });
    const folder = root.folder('6_Mockups')!;
    const lines = ['Deliverable 6 — Mock-ups', '', 'Screen | Prototype | Status | Link / file'];
    let files = 0;
    for (const mk of rows) {
      const s = { name: mk.screen.name };
      {
        let ref = mk.url ?? '';
        if (mk.imageId) {
          try {
            const img = await readImageBytes(projectId, mk.imageId);
            const ext = img.mime === 'image/jpeg' ? 'jpg' : img.mime === 'image/png' ? 'png' : img.mime === 'image/webp' ? 'webp' : 'img';
            const name = `${safeName(s.name)}_${mk.id}.${ext}`;
            folder.file(name, img.buffer);
            ref = name;
            files += 1;
          } catch { ref = '(image could not be read)'; }
        }
        lines.push(`${s.name} | ${mk.title ?? mk.kind} | ${mk.status} | ${ref}`);
      }
    }
    folder.file('MOCKUPS.txt', `${lines.join('\n')}\n`);
    report.push({ n: 6, file: '6_Mockups/', ok: files > 0 || lines.length > 3, note: `${files} image(s), ${lines.length - 3} prototype(s)` });
  } catch (err) {
    report.push({ n: 6, file: '6_Mockups/', ok: false, note: (err as Error).message.slice(0, 200) });
  }
  let six = '';
  try {
    const s = await swr.getSixLinks(userId, projectId);
    six = `\nSix traceability links a grader checks: ${s.passed}/${s.links.length} passed.\n${s.links.map((l: { label?: string; key: string; ok: boolean }) => `  ${l.ok ? '✓' : '✗'} ${l.label ?? l.key}`).join('\n')}\n`;
  } catch { /* bỏ qua */ }
  report.sort((a, b) => a.n - b.n);
  root.file('README.txt', [
    `SWR302 Assignment package — ${p.name} (${p.key})`, `Generated by CT Work on ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC.`, '',
    ...report.map((r) => `${r.ok ? '✓' : '✗'} ${r.n}. ${r.file}${r.note ? ` — ${r.note}` : ''}`), six,
    'Before submitting: open each file, check the counts in deliverable 8 match deliverables 2, 4 and 6, and re-read the sanity checks in the course guide.',
  ].join('\n'));
  const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  await auditProject(projectId, { actorId: userId, action: 'swr.package.export', targetType: 'project', targetId: projectId, summary: `Exported the SWR302 assignment package (${report.filter((r) => r.ok).length}/8 deliverables)` });
  return { buffer, file: `${p.key}_SWR302_Assignment.zip`, report };
}
