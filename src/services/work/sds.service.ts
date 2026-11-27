/**
 * CT Work — dm5 G2 (27/11/2026): Report 4 (SDS) — phần có DB. Dựng nội dung ở sdsFill.ts (thuần).
 *
 *   B16  dbDesign       mô hình CSDL ⇒ bảng 7 cột mỗi bảng. Nguồn: sơ đồ SQL (Database designer — chọn số D-n, không chọn thì
 *                       sơ đồ SQL đã duyệt mới nhất, rồi sơ đồ SQL mới nhất) HOẶC Flyway `V*__*.sql` của repo đã nối (fromRepo).
 *   B16  fillDbDesign   đặt vào "1.3 Database Design" của trang Report 4 — MỘT phiên bản trang mới (hoàn tác bằng History).
 *   B17  fillReport4    gom: 1.3 (B16) + sơ đồ đã duyệt (kiến trúc, ERD, class/sequence — diagramFill) + khung "3. Class
 *                       Specifications" theo package Spring Boot đọc từ repo. Phần nào không có nguồn ⇒ bỏ qua + ghi lý do.
 * Quyền: đọc = đội dự án + giảng viên (diagramCtx); ghi trang = quyền sửa trang Docs. Agent đi như người theo rào chắn chung
 * (điền tài liệu từ dữ liệu, như report3_fill_page) — KHÔNG ghi gì ngoài trang Report 4.
 */

import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { applyDiagramFill } from './diagramFill.js';
import { findSqlMigrations, readMany, repoFor } from './diagramRepo.js';
import type { PmNode } from './docMarkdown.js';
import { getPage, updatePage } from './pages.service.js';
import { dbDesigns, fillClassSpecs, fillDbDesign, parseJavaClass, type DbTableDesign, type JavaClassLite } from './sdsFill.js';
import { analyzeSql } from './sqlDesign/index.js';
import { findReportPage } from './srs.service.js';

export interface DbDesignSource { kind: 'DIAGRAM' | 'REPO'; label: string; diagram?: number; files?: string[]; problems: string[] }

/** Mô hình CSDL + bảng thiết kế. Không có nguồn ⇒ 404 có hướng dẫn. */
export async function dbDesign(userId: number, projectId: number, input: { diagram?: number | null; fromRepo?: boolean } = {}): Promise<{ source: DbDesignSource; tables: DbTableDesign[] }> {
  const { diagramCtx } = await import('./diagrams.service.js');
  await diagramCtx(userId, projectId, 'view');
  let sql = '';
  let source: DbDesignSource;
  if (input.fromRepo) {
    const { handle, error } = await repoFor(projectId);
    if (!handle) throw new BadRequestError(error ?? 'No repository connected', 'WORK_NO_REPO');
    const paths = findSqlMigrations(handle.paths);
    if (!paths.length) throw new NotFoundError(`No SQL migrations found in ${handle.repo} (Flyway V1__init.sql… or db/migrations/*.sql)`);
    const files = await readMany(handle, paths, 80);
    sql = files.map((f) => `-- ${f.path}\n${f.text}`).join('\n\n');
    source = { kind: 'REPO', label: `${handle.repo}@${handle.branch} — ${files.length} migration file(s)`, files: files.map((f) => f.path), problems: [] };
  } else {
    const where = { projectId, deletedAt: null, format: 'SQL' } as const;
    const d = input.diagram
      ? await prisma.workDiagram.findFirst({ where: { ...where, number: input.diagram }, select: { id: true, number: true, title: true, currentVersion: true, approvedVersion: true, status: true } })
      : (await prisma.workDiagram.findFirst({ where: { ...where, status: 'APPROVED' }, orderBy: { number: 'desc' }, select: { id: true, number: true, title: true, currentVersion: true, approvedVersion: true, status: true } }))
        ?? (await prisma.workDiagram.findFirst({ where, orderBy: { number: 'desc' }, select: { id: true, number: true, title: true, currentVersion: true, approvedVersion: true, status: true } }));
    if (!d) throw new NotFoundError(input.diagram ? `D-${input.diagram} is not a SQL (Database designer) diagram` : 'This project has no SQL diagram yet — create one in Diagrams › Database designer, import a .sql file, or use fromRepo with a connected repository');
    // Sơ đồ đã duyệt ⇒ đúng bản đã duyệt; chưa duyệt ⇒ bản hiện tại.
    const vNum = d.status === 'APPROVED' && d.approvedVersion ? d.approvedVersion : d.currentVersion;
    const v = await prisma.workDiagramVersion.findFirst({ where: { diagramId: d.id, number: vNum }, select: { source: true } });
    sql = v?.source ?? '';
    source = { kind: 'DIAGRAM', label: `D-${d.number} ${d.title} (v${vNum}${d.status === 'APPROVED' ? ', approved' : ''})`, diagram: d.number, problems: [] };
  }
  const a = analyzeSql(sql);
  if (!a.parse.model.tables.length) throw new BadRequestError('No CREATE TABLE found in the SQL source', 'WORK_NO_TABLES');
  source.problems = a.parse.errors.slice(0, 20).map((e) => `line ${e.span?.line ?? '?'}: ${e.message.en}`);
  return { source, tables: dbDesigns(a.parse.model) };
}

async function report4Page(userId: number, projectId: number, num?: number | null) {
  const pg = num ? { number: num } : await findReportPage(projectId, 4);
  if (!pg) throw new NotFoundError('This project has no Report 4 page — create it from the "FPT Capstone" template in Docs');
  const page = await getPage(userId, projectId, pg.number);
  if (!page.canEdit) throw new ForbiddenError('You can read this page but not edit it');
  return page;
}

/** B16: đặt bảng thiết kế CSDL vào §1.3 của trang Report 4. */
export async function fillDbDesignPage(userId: number, projectId: number, input: { diagram?: number | null; fromRepo?: boolean; page?: number | null; version?: number }) {
  const { source, tables } = await dbDesign(userId, projectId, input);
  const page = await report4Page(userId, projectId, input.page);
  const doc = JSON.parse(JSON.stringify(page.contentJson ?? { type: 'doc', content: [] })) as PmNode;
  const n = fillDbDesign(doc, tables);
  if (!n) throw new BadRequestError(`Page DOC-${page.number} has no "Database Design" heading — use the Report 4 template`, 'WORK_NO_SECTION');
  const updated = await updatePage(userId, projectId, page.number, { contentJson: doc, version: input.version ?? page.version, versionNote: `Database design tables from ${source.label} (${n} table${n === 1 ? '' : 's'})` });
  return { page: { number: page.number, title: page.title, version: (updated as { currentVersion?: number }).currentVersion ?? null }, tables: n, source };
}

/** Lớp Java/Kotlin của repo (src/main/java|kotlin) — tối đa 80 tệp, ưu tiên controller/service/repository/entity. */
export async function repoClasses(projectId: number): Promise<{ classes: JavaClassLite[]; repo: string | null; error: string | null }> {
  const { handle, error } = await repoFor(projectId);
  if (!handle) return { classes: [], repo: null, error };
  const RANK = /(controller|service|repository|entity|model|domain|dto|config)/i;
  const paths = handle.paths.filter((p) => /src\/main\/(java|kotlin)\/.+\.(java|kt)$/.test(p) && !/(^|\/)(test|tests)\//.test(p))
    .sort((a, b) => Number(RANK.test(b)) - Number(RANK.test(a)) || a.localeCompare(b));
  if (!paths.length) return { classes: [], repo: handle.repo, error: `No Java/Kotlin sources under src/main/java in ${handle.repo}` };
  const files = await readMany(handle, paths, 80);
  const classes = files.map((f) => parseJavaClass(f.path, f.text)).filter((c): c is JavaClassLite => !!c);
  return { classes, repo: handle.repo, error: paths.length > 80 ? `Read the first 80 of ${paths.length} source files` : null };
}

export const REPORT4_PARTS = ['database', 'diagrams', 'classes'] as const;
export type Report4Part = (typeof REPORT4_PARTS)[number];

/** B17: điền nháp Report 4 — MỘT phiên bản trang. Trả phần đã điền + phần bỏ qua kèm lý do. */
export async function fillReport4(userId: number, projectId: number, input: { parts?: Report4Part[]; diagram?: number | null; fromRepo?: boolean; page?: number | null; version?: number } = {}) {
  const want = (p: Report4Part) => !input.parts?.length || input.parts.includes(p);
  const page = await report4Page(userId, projectId, input.page);
  const { diagramCtx, approvedDiagrams } = await import('./diagrams.service.js');
  await diagramCtx(userId, projectId, 'view');
  const doc = JSON.parse(JSON.stringify(page.contentJson ?? { type: 'doc', content: [] })) as PmNode;
  const filled: string[] = [];
  const skipped: Array<{ part: Report4Part; reason: string }> = [];
  if (want('database')) {
    try {
      const { source, tables } = await dbDesign(userId, projectId, { diagram: input.diagram, fromRepo: input.fromRepo });
      const n = fillDbDesign(doc, tables);
      if (n) filled.push(`database (${n} tables from ${source.label})`); else skipped.push({ part: 'database', reason: 'No "Database Design" heading on the page' });
    } catch (err) {
      skipped.push({ part: 'database', reason: (err as Error).message });
    }
  }
  if (want('diagrams')) {
    const parts = applyDiagramFill(doc, 4, await approvedDiagrams(projectId), projectId);
    if (parts.length) filled.push(`diagrams (${parts.join(', ')})`); else skipped.push({ part: 'diagrams', reason: 'No approved architecture / ERD / class / sequence diagram yet' });
  }
  if (want('classes')) {
    const r = await repoClasses(projectId);
    const n = r.classes.length ? fillClassSpecs(doc, r.classes) : 0;
    if (n) filled.push(`class specifications (${n} classes from ${r.repo})`);
    else skipped.push({ part: 'classes', reason: r.error ?? (r.classes.length ? 'No "Class Specifications" heading on the page' : 'No classes found') });
  }
  if (!filled.length) return { filled, skipped, page: { number: page.number, title: page.title, version: page.currentVersion ?? null } };
  const updated = await updatePage(userId, projectId, page.number, { contentJson: doc, version: input.version ?? page.version, versionNote: `Filled from project data: ${filled.join('; ')}`.slice(0, 480) });
  return { filled, skipped, page: { number: page.number, title: page.title, version: (updated as { currentVersion?: number }).currentVersion ?? null } };
}
