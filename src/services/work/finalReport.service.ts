/**
 * CT Work — CTW đợt 4 (09/10/2026): REPORT 7 FINAL (A18) — phần có DB. Ghép thuần ở finalReport.ts.
 *
 *   - "Assemble final report" trên trang Report 7: ghép bản MỚI NHẤT của các trang Report 1–6 của dự án vào trang Report 7
 *     = MỘT phiên bản mới có ghi chú (Report nào, phiên bản nào) — hoàn tác bằng History; Acknowledgement giữ chữ người viết.
 *   - Xuất Final (.docx/PDF) bằng đường của đợt 3A (renderDocx/renderPdf): bìa như tệp gốc (FPT University · Capstone
 *     Project Document · mã nhóm · thành viên · giảng viên), mục lục tự sinh (trường TOC thật của Word / trang mục lục có số
 *     trang trong PDF), rồi nội dung đã ghép. Không ghi gì vào trang khi chỉ xuất.
 * Quyền: đọc từng trang Report qua getPage (quyền Docs như mở trang); ghép ⇒ phải sửa được trang Report 7.
 */

import { prisma } from '../../config/database.js';
import { ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { displayName } from './common.js';
import { renderDocx, renderPdf, type ExportMeta, type FinalCover } from './docExport.js';
import { decodeDiagram } from './docs3a.service.js';
import { getTemplate } from './docTemplates.js';
import { assembleFinal, FINAL_PARTS, type FinalSource } from './finalReport.js';
import { docCtx, getPage, updatePage } from './pages.service.js';
import { findReportPage, projectImage, srsCtx } from './srs.service.js';

async function sources(userId: number, projectId: number): Promise<FinalSource[]> {
  const out: FinalSource[] = [];
  for (const part of FINAL_PARTS) {
    const pg = await findReportPage(projectId, part.n as 1 | 2 | 3 | 4 | 5 | 6);
    if (!pg) continue;
    const page = await getPage(userId, projectId, pg.number).catch(() => null);
    if (!page) continue;
    out.push({ n: part.n, doc: page.contentJson, label: `Doc ${page.number}${page.currentVersion ? ` v${page.currentVersion}` : ''}` });
  }
  return out;
}

/** Bản Final trong bộ nhớ: nội dung trang Report 7 (hoặc mẫu) đã ghép Report 1–6. */
export async function finalDoc(userId: number, projectId: number) {
  await srsCtx(userId, projectId, 'view');
  await docCtx(userId, projectId);
  const r7 = await findReportPage(projectId, 7);
  const page = r7 ? await getPage(userId, projectId, r7.number) : null;
  const current = page?.contentJson ?? (await getTemplate('fpt-report7-final-report')).doc;
  const r = assembleFinal(current, await sources(userId, projectId));
  return { ...r, title: page?.title ?? 'Report 7 – Final Project Report', page: page ? { number: page.number, title: page.title, version: page.currentVersion || null } : null };
}

export async function assembleFinalPage(userId: number, projectId: number, input: { version?: number } = {}) {
  await srsCtx(userId, projectId, 'view');
  await docCtx(userId, projectId);
  const r7 = await findReportPage(projectId, 7);
  if (!r7) throw new NotFoundError('This project has no Report 7 page — create it from the "FPT Capstone" template first');
  const page = await getPage(userId, projectId, r7.number);
  if (!page.canEdit) throw new ForbiddenError('You can read this page but not edit it');
  const r = assembleFinal(page.contentJson, await sources(userId, projectId));
  if (!r.merged.length) return { ...r, page, changed: false };
  const updated = await updatePage(userId, projectId, r7.number, {
    contentJson: r.doc, version: input.version ?? page.version,
    versionNote: `Assembled final report from ${r.notes.join(', ')}`.slice(0, 500),
  });
  await auditProject(projectId, { actorId: userId, action: 'docs.assemble', targetType: 'page', targetId: page.id, summary: `Assembled Report 7 from ${r.merged.map((n) => `Report ${n}`).join(', ')}` });
  return { ...r, page: updated, changed: true };
}

/** Bìa Final: thông tin môn học/nhóm (tab Course & group của đợt 3B), thiếu thì lấy thành viên dự án. */
async function coverOf(projectId: number): Promise<FinalCover> {
  const [project, doc, members] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, leadId: true } }),
    prisma.workFptReportDoc.findUnique({ where: { projectId } }),
    prisma.workProjectMember.findMany({
      where: { projectId, role: { in: ['ADMIN', 'MEMBER', 'TEACHER'] }, user: { kind: { not: 'AGENT' } } }, orderBy: { id: 'asc' },
      select: { role: true, userId: true, user: { select: { username: true, fullName: true, displayName: true } } },
    }),
  ]);
  const students = Array.isArray(doc?.students) ? (doc!.students as Array<{ code?: string; name?: string }>) : [];
  const team = students.length
    ? students.filter((s) => s.name?.trim()).map((s) => `${s.name!.trim()}${s.code ? ` – ${s.code}` : ''}`)
    : members.filter((m) => m.role !== 'TEACHER').sort((a, b) => Number(b.userId === project.leadId) - Number(a.userId === project.leadId)).map((m) => displayName(m.user));
  const teachers = members.filter((m) => m.role === 'TEACHER').map((m) => displayName(m.user));
  return { projectTitle: doc?.projectTitle?.trim() || project.name, groupCode: doc?.groupCode?.trim() || null, members: team, supervisor: doc?.lecturer?.trim() || teachers[0] || null, extSupervisor: null, place: 'Hanoi' };
}

export async function exportFinal(userId: number, projectId: number, input: { format: 'docx' | 'pdf'; diagrams?: Array<string | null> }) {
  const r = await finalDoc(userId, projectId);
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });
  const diagrams = await Promise.all((input.diagrams ?? []).slice(0, 60).map((d) => decodeDiagram(d)));
  const meta: ExportMeta = {
    title: r.title, projectName: project.name, projectKey: project.key, docLabel: r.page ? `DOC-${r.page.number}` : 'Final',
    version: r.page?.version ?? null, date: new Date(), capstone: true, finalCover: await coverOf(projectId),
  };
  const opts = { stripGuides: true, toc: true, cover: true, diagrams, resolveImage: (src: string) => projectImage(projectId, src) };
  const buffer = input.format === 'docx' ? await renderDocx(r.doc, meta, opts) : await renderPdf(r.doc, meta, opts);
  await auditProject(projectId, { actorId: userId, action: 'docs.export', targetType: 'project', targetId: projectId, summary: `Exported Report 7 Final (${input.format}) — merged ${r.merged.map((n) => `R${n}`).join(', ') || 'none'}` });
  return { buffer, file: `${project.key}_Report7_Final_Project_Report.${input.format}`, merged: r.merged, missing: r.missing };
}
