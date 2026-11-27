/**
 * CT Work — CTW đợt 3A (09/10/2026): phần CÓ DB của tài liệu.
 *
 *   - A8  Ảnh trong RichEditor: tải lên (thân request = byte ảnh, giống nhập Excel 5.1 — tránh bẫy axios biến FormData
 *         thành JSON), kiểm bằng sharp (chỉ PNG/JPEG/WebP/GIF THẬT — SVG bị từ chối vì chạy được script), lưu vào kho
 *         (R2 trên production) dưới `work/<pid>/img/`, trùng nội dung trong dự án ⇒ dùng lại. Xem ảnh = quyền xem dự án.
 *   - A9  Xuất một trang ra .docx / PDF (docExport.ts), ảnh lấy từ kho đúng dự án.
 *   - A10 Record of Changes tự sinh từ lịch sử phiên bản.
 *   - A2  "Fill from project data": Record of Changes, Project Team, Project Risks (RAID), Cost & Time (giai đoạn + version),
 *         RACI (tên thành viên). Lưu thành MỘT phiên bản riêng có ghi chú — hoàn tác bằng History.
 */

import crypto from 'node:crypto';
import type { Readable } from 'node:stream';
import sharp from 'sharp';
import { prisma } from '../../config/database.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { getStorageProvider } from '../../storage/StorageProvider.js';
import { displayName } from './common.js';
import { DOC_IMAGE_SRC_RE, type PmNode } from './docMarkdown.js';
import { renderDocx, renderPdf, type ExportImage } from './docExport.js';
import {
  changesTable, crChangeRows, honestRaciNote, mergeChangeRows, raciReport2Table, raciTable, recordOfChanges, replaceTableAfterHeading, risksTable,
  RACI_MODES, scheduleTable, teamTable,
  type ChangeRow, type CrLite, type RaciMatrixLite, type RaciMode, type RaciPerson, type StageLite,
} from './docFill.js';
import { brKey, findHeading, sectionEnd, ucKey } from './srs.js';
import { docCtx, getPage, updatePage } from './pages.service.js';
import { docAccess, isClientScoped, requireProject } from './permissions.js';
import { tooLargeMessage, WORK_LIMITS } from './limits.js';

/** Ảnh dán vào Docs/mô tả (limits.ts, env WORK_MAX_IMAGE_MB). */
export const MAX_IMAGE_BYTES = WORK_LIMITS.imageBytes;
const MAX_IMAGES_PER_PROJECT = 5000;
const IMAGE_FORMATS: Record<string, string> = { png: 'image/png', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' };

export const imageUrl = (projectId: number, id: number) => `/api/v1/work/projects/${projectId}/images/${id}`;

// Kho có thể thay trong test (không chạm R2 thật).
type Store = { put(key: string, body: Buffer, contentType: string): Promise<unknown>; read(key: string): Promise<Buffer> };
const realStore: Store = {
  put: (key, body, ct) => getStorageProvider().put(key, body, ct),
  async read(key) {
    const { stream } = await getStorageProvider().readStream(key);
    const chunks: Buffer[] = [];
    for await (const c of stream as Readable) chunks.push(Buffer.from(c as Buffer));
    return Buffer.concat(chunks);
  },
};
let store: Store = realStore;
export function _setImageStoreForTests(s: Store | null) { store = s ?? realStore; }

export async function uploadImage(userId: number, projectId: number, body: Buffer, fileName: string) {
  await requireProject(userId, projectId, 'attachment.add');
  if (!body.length) throw new BadRequestError('Send the image as the request body', 'WORK_IMAGE_EMPTY');
  if (body.length > MAX_IMAGE_BYTES) throw new BadRequestError(tooLargeMessage(MAX_IMAGE_BYTES, 'Images'), 'WORK_FILE_TOO_LARGE');
  let meta: Awaited<ReturnType<ReturnType<typeof sharp>['metadata']>>;
  try {
    meta = await sharp(body, { animated: false }).metadata();
  } catch {
    throw new BadRequestError('This file is not an image CT Work can show (use PNG, JPEG, WebP or GIF)', 'WORK_IMAGE_INVALID');
  }
  const mime = meta.format ? IMAGE_FORMATS[meta.format] : undefined;
  if (!mime) throw new BadRequestError('Only PNG, JPEG, WebP or GIF images can be inserted', 'WORK_IMAGE_INVALID');
  const sha256 = crypto.createHash('sha256').update(body).digest('hex');
  const same = await prisma.workDocImage.findFirst({ where: { projectId, sha256 }, select: { id: true, width: true, height: true } });
  if (same) return { id: same.id, url: imageUrl(projectId, same.id), width: same.width, height: same.height };
  if ((await prisma.workDocImage.count({ where: { projectId } })) >= MAX_IMAGES_PER_PROJECT) throw new BadRequestError('This project has too many images', 'WORK_LIMIT');
  const ext = meta.format === 'jpeg' ? 'jpg' : meta.format;
  const safe = (fileName || 'image').replace(/[^\w.\- ]+/g, '_').replace(/\.[a-z0-9]+$/i, '').slice(-80) || 'image';
  const key = `work/${projectId}/img/${crypto.randomUUID()}/${safe}.${ext}`;
  await store.put(key, body, mime);
  const row = await prisma.workDocImage.create({
    data: { projectId, uploaderId: userId, r2Key: key, fileName: `${safe}.${ext}`.slice(0, 255), mime, size: body.length, width: meta.width ?? null, height: meta.height ?? null, sha256 },
    select: { id: true, width: true, height: true },
  });
  return { id: row.id, url: imageUrl(projectId, row.id), width: row.width, height: row.height };
}

/**
 * Đợt 6a — xem ảnh theo ĐÚNG phạm vi đã chia sẻ (không mở rộng quyền):
 *   - nhân viên (đọc được mọi trang) ⇒ mọi ảnh của dự án như cũ;
 *   - khách bị cách ly (cổng khách) ⇒ chỉ ảnh nằm trong trang CLIENT, mô tả thẻ ĐÃ chia sẻ, hoặc bình luận
 *     PUBLIC trên thẻ đã chia sẻ — thu hồi chia sẻ là ảnh thôi hiện;
 *   - người đọc hạn chế khác (GUEST, CLIENT ở dự án tắt cổng) ⇒ trang CLIENT + mô tả/bình luận thẻ (họ đọc
 *     được mọi thẻ), KHÔNG ảnh chỉ nằm trong trang nội bộ.
 * Ảnh không được tham chiếu ở chỗ người xem đọc được ⇒ 404 (không cho biết ảnh tồn tại).
 */
export async function readImage(userId: number, projectId: number, imageId: number) {
  const access = await requireProject(userId, projectId, 'project.view');
  const img = await prisma.workDocImage.findFirst({ where: { id: imageId, projectId }, select: { r2Key: true, mime: true, fileName: true } });
  if (!img) throw new NotFoundError('Image not found');
  const scoped = isClientScoped(access);
  if (scoped || docAccess(access.role, access.workspaceRole).view !== 'ALL') {
    if (!(await imageReferenced(projectId, imageId, { pages: true, issues: scoped ? 'SHARED' : 'ALL', comments: scoped ? 'PUBLIC_SHARED' : 'ALL' }))) {
      throw new NotFoundError('Image not found');
    }
  }
  return { buffer: await store.read(img.r2Key), mime: img.mime, fileName: img.fileName };
}

/** Ảnh (của dự án `projectId`) có nằm trong nội dung theo phạm vi cho trước không — so chuỗi src đúng y trong JSON. */
export async function imageReferenced(
  projectId: number, imageId: number,
  scope: { pages: boolean; issues: 'SHARED' | 'ALL' | null; comments: 'PUBLIC_SHARED' | 'ALL' | null },
): Promise<boolean> {
  // jsonb::text in chuỗi kèm dấu nháy ⇒ `"…/images/12"` không khớp nhầm `…/images/123`. Không có % hay _ trong mẫu.
  const pat = `%"${imageUrl(projectId, imageId)}"%`;
  const checks: Array<Promise<Array<{ ok: number }>>> = [];
  if (scope.pages) {
    checks.push(prisma.$queryRaw`SELECT 1 AS ok FROM work_pages WHERE project_id = ${projectId} AND deleted_at IS NULL AND visibility = 'CLIENT' AND content_json::text LIKE ${pat} LIMIT 1`);
  }
  if (scope.issues) {
    const shared = scope.issues === 'SHARED';
    checks.push(prisma.$queryRaw`SELECT 1 AS ok FROM work_issues WHERE project_id = ${projectId} AND deleted_at IS NULL AND (${!shared} OR client_visible = true) AND description_json::text LIKE ${pat} LIMIT 1`);
  }
  if (scope.comments) {
    const pub = scope.comments === 'PUBLIC_SHARED';
    checks.push(prisma.$queryRaw`SELECT 1 AS ok FROM work_comments c JOIN work_issues i ON i.id = c.issue_id
      WHERE i.project_id = ${projectId} AND i.deleted_at IS NULL AND c.deleted_at IS NULL
        AND (${!pub} OR (i.client_visible = true AND c.visibility = 'PUBLIC')) AND c.body_json::text LIKE ${pat} LIMIT 1`);
  }
  return (await Promise.all(checks)).some((r) => r.length > 0);
}

/** Id ảnh của CHÍNH dự án trong một JSON TipTap (theo thứ tự, không trùng). */
export function imageIdsIn(doc: unknown, projectId: number): number[] {
  const out: number[] = [];
  const walk = (n: unknown) => {
    if (!n || typeof n !== 'object') return;
    const node = n as { type?: string; attrs?: { src?: unknown }; content?: unknown[] };
    if (node.type === 'image' && typeof node.attrs?.src === 'string') {
      const m = DOC_IMAGE_SRC_RE.exec(node.attrs.src.trim());
      if (m && Number(m[1]) === projectId && !out.includes(Number(m[2]))) out.push(Number(m[2]));
    }
    if (Array.isArray(node.content)) node.content.forEach(walk);
  };
  walk(doc);
  return out;
}

/** Đọc thẳng byte ảnh (người gọi đã tự kiểm quyền — link công khai, share.service). */
export async function readImageBytes(projectId: number, imageId: number) {
  const img = await prisma.workDocImage.findFirst({ where: { id: imageId, projectId }, select: { r2Key: true, mime: true, fileName: true } });
  if (!img) throw new NotFoundError('Image not found');
  return { buffer: await store.read(img.r2Key), mime: img.mime, fileName: img.fileName };
}

/** Ảnh cho bản xuất: CHỈ ảnh của chính dự án này (src lạ / dự án khác ⇒ null ⇒ in chữ thay thế). PNG/JPEG giữ nguyên, còn lại đổi PNG. */
async function exportImage(projectId: number, src: string): Promise<ExportImage | null> {
  const m = DOC_IMAGE_SRC_RE.exec(src);
  if (!m || Number(m[1]) !== projectId) return null;
  const img = await prisma.workDocImage.findFirst({ where: { id: Number(m[2]), projectId }, select: { r2Key: true, mime: true } });
  if (!img) return null;
  let buf = await store.read(img.r2Key);
  let type: 'png' | 'jpg' = img.mime === 'image/jpeg' ? 'jpg' : 'png';
  if (img.mime !== 'image/png' && img.mime !== 'image/jpeg') { buf = await sharp(buf, { animated: false }).png().toBuffer(); type = 'png'; }
  const meta = await sharp(buf).metadata();
  return { buffer: buf, type, width: meta.width ?? 600, height: meta.height ?? 400 };
}

/** Ảnh Mermaid client vẽ sẵn: data:image/png;base64,… — kiểm đúng là PNG, trần kích thước. */
export async function decodeDiagram(dataUrl: string | null): Promise<ExportImage | null> {
  if (!dataUrl) return null;
  const m = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!m) return null;
  const buf = Buffer.from(m[1], 'base64');
  if (buf.length > 4 * 1024 * 1024) return null;
  try {
    const meta = await sharp(buf).metadata();
    if (meta.format !== 'png') return null;
    return { buffer: buf, type: 'png', width: meta.width ?? 600, height: meta.height ?? 400 };
  } catch {
    return null;
  }
}

const slug = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_').slice(0, 80) || 'document';

export async function exportPage(
  userId: number, projectId: number, num: number,
  input: { format: 'docx' | 'pdf'; diagrams?: Array<string | null>; stripGuides?: boolean; toc?: boolean; cover?: boolean },
) {
  const page = await getPage(userId, projectId, num);
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });
  const diagrams = await Promise.all((input.diagrams ?? []).slice(0, 60).map((d) => decodeDiagram(d)));
  const meta = {
    title: page.title, projectName: project.name, projectKey: project.key, docLabel: `DOC-${page.number}`,
    version: page.currentVersion || null, date: new Date(), capstone: !!page.templateKey?.startsWith('fpt-'),
  };
  const opts = { stripGuides: input.stripGuides ?? true, toc: input.toc ?? true, cover: input.cover ?? true, diagrams, resolveImage: (src: string) => exportImage(projectId, src) };
  const buffer = input.format === 'docx' ? await renderDocx(page.contentJson, meta, opts) : await renderPdf(page.contentJson, meta, opts);
  // Tên tệp kiểu FPT: "<KEY>_Report2_Project_Management_Plan.docx".
  return { buffer, file: `${project.key}_${slug(page.title)}.${input.format}` };
}

// ─── Record of Changes + điền từ dữ liệu ─────────────────────────

export async function pageRecordOfChanges(userId: number, projectId: number, num: number): Promise<ChangeRow[]> {
  const page = await getPage(userId, projectId, num);
  const versions = await prisma.workPageVersion.findMany({
    where: { pageId: page.id }, orderBy: { n: 'asc' },
    select: { n: true, kind: true, note: true, createdAt: true, contentJson: true, author: { select: { username: true, fullName: true, displayName: true } } },
  });
  const rows = recordOfChanges(versions.map((v) => ({ ...v, author: v.author ? displayName(v.author) : null })));
  // dm5 G2 (B21): CR đã IMPLEMENTED có liệt kê mục của tài liệu này (trang · UC/BR/thẻ yêu cầu với SRS) ⇒ thêm dòng A/M/D.
  return mergeChangeRows(rows, crChangeRows(await implementedCrsFor(projectId, { id: page.id, templateKey: page.templateKey ?? null, title: page.title })));
}

/** Trang này là SRS (Report 3 / mẫu srs / SWR SRS) ⇒ CR ảnh hưởng UC/BR/thẻ yêu cầu cũng tính cho nó. */
const isSrsPage = (p: { templateKey: string | null; title: string }) => /^(fpt-report3-srs|srs|swr-srs|swr-use-cases|swr-business-rules)$/.test(p.templateKey ?? '') || /report\s*3\b|software requirement spec/i.test(p.title);

/** CR trạng thái IMPLEMENTED ảnh hưởng tài liệu: ref DOC = trang này; SRS ⇒ thêm ref UC/BR/REQ. KHÔNG kiểm quyền. */
export async function implementedCrsFor(projectId: number, page: { id: number; templateKey: string | null; title: string }): Promise<CrLite[]> {
  const kinds = isSrsPage(page) ? ['DOC', 'UC', 'BR', 'REQ'] : ['DOC'];
  const refs = await prisma.workCrAffectedRef.findMany({ where: { projectId, kind: { in: kinds } }, select: { changeRequestId: true, kind: true, refId: true } });
  const relevant = refs.filter((r) => r.kind !== 'DOC' || r.refId === page.id);
  const crIds = [...new Set(relevant.map((r) => r.changeRequestId))];
  if (!crIds.length) return [];
  const crs = await prisma.workChangeRequest.findMany({
    where: { id: { in: crIds }, projectId, status: 'IMPLEMENTED', deletedAt: null },
    select: { id: true, number: true, title: true, reason: true, implementedAt: true, updatedAt: true, owner: { select: { username: true, fullName: true, displayName: true } }, requester: { select: { username: true, fullName: true, displayName: true } } },
  });
  // Mỗi CR phải có ÍT NHẤT một ref liên quan tới tài liệu này (DOC trỏ đúng trang, hoặc UC/BR/REQ khi là SRS).
  const touching = new Set(relevant.map((r) => r.changeRequestId));
  const ucIds = relevant.filter((r) => r.kind === 'UC').map((r) => r.refId);
  const brIds = relevant.filter((r) => r.kind === 'BR').map((r) => r.refId);
  const reqIds = relevant.filter((r) => r.kind === 'REQ').map((r) => r.refId);
  const [ucs, brs, reqs, proj] = await Promise.all([
    ucIds.length ? prisma.workUseCase.findMany({ where: { id: { in: ucIds } }, select: { id: true, number: true } }) : [],
    brIds.length ? prisma.workBusinessRule.findMany({ where: { id: { in: brIds } }, select: { id: true, number: true } }) : [],
    reqIds.length ? prisma.workIssue.findMany({ where: { id: { in: reqIds } }, select: { id: true, number: true } }) : [],
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true } }),
  ]);
  const label = (r: { kind: string; refId: number }) => r.kind === 'UC' ? (ucs.find((u) => u.id === r.refId) ? ucKey(ucs.find((u) => u.id === r.refId)!.number) : null)
    : r.kind === 'BR' ? (brs.find((b) => b.id === r.refId) ? brKey(brs.find((b) => b.id === r.refId)!.number) : null)
      : r.kind === 'REQ' ? (reqs.find((q) => q.id === r.refId) ? `${proj.key}-${reqs.find((q) => q.id === r.refId)!.number}` : null) : null;
  return crs.filter((c) => touching.has(c.id)).map((c) => ({
    number: c.number, title: c.title, reason: c.reason, implementedAt: c.implementedAt ?? c.updatedAt,
    inCharge: c.owner ? displayName(c.owner) : c.requester ? displayName(c.requester) : null,
    refs: relevant.filter((r) => r.changeRequestId === c.id).map(label).filter((x): x is string => !!x),
  }));
}

const ROLE_LABEL: Record<string, string> = { TEACHER: 'Lecturer', ADMIN: 'Member', MEMBER: 'Member' };

async function projectFacts(projectId: number) {
  const [project, members, risks, stages, versions, raciActs, stakeholders] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { leadId: true } }),
    prisma.workProjectMember.findMany({
      where: { projectId, role: { in: ['ADMIN', 'MEMBER', 'TEACHER'] }, user: { kind: { not: 'AGENT' } } },
      orderBy: { id: 'asc' },
      select: { role: true, userId: true, user: { select: { username: true, fullName: true, displayName: true } } },
    }),
    prisma.workRaidItem.findMany({
      where: { projectId, type: 'RISK', deletedAt: null, status: { not: 'CLOSED' } },
      orderBy: [{ number: 'asc' }], take: 50,
      select: { title: true, description: true, probability: true, impact: true, mitigation: true, response: true },
    }),
    prisma.workStage.findMany({
      where: { projectId }, orderBy: { n: 'asc' },
      select: { n: true, name: true, issues: { where: { deletedAt: null }, orderBy: { id: 'asc' }, take: 200, select: { title: true, dueDate: true, originalEstimateMin: true, type: { select: { key: true } } } } },
    }),
    prisma.workVersion.findMany({ where: { projectId }, orderBy: [{ releaseDate: { sort: 'asc', nulls: 'last' } }, { position: 'asc' }], select: { name: true, releaseDate: true, status: true } }),
    // dm5 G2 (B2): ma trận RACI (SWR) + stakeholder (kể cả mũ ROLE C1–C5) cho Report 2 §3.
    prisma.workRaciActivity.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], include: { cells: true } }),
    prisma.workStakeholder.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { number: 'asc' }], select: { id: true, name: true, kind: true, userId: true, role: true } }),
  ]);
  // Trưởng nhóm lên đầu, giảng viên cuối — đúng thứ tự bảng Project Team của mẫu.
  const order = (m: { role: string; userId: number }) => (m.userId === project.leadId ? 0 : m.role === 'TEACHER' ? 2 : 1);
  const team = [...members].sort((a, b) => order(a) - order(b)).map((m) => ({
    name: displayName(m.user), role: m.userId === project.leadId ? 'Leader' : ROLE_LABEL[m.role] ?? 'Member',
  }));
  const stageRows: StageLite[] = stages.map((s) => ({
    n: s.n, name: s.name,
    issues: s.issues.map((i) => ({ title: i.title, isEpic: i.type.key === 'EPIC', effortDays: i.originalEstimateMin ? i.originalEstimateMin / 60 / 8 : null, due: i.dueDate })),
  }));
  const raci: { matrix: RaciMatrixLite; people: RaciPerson[] } = {
    matrix: {
      activities: raciActs.map((a) => ({ id: a.id, name: a.name })), stakeholders,
      cells: raciActs.flatMap((a) => a.cells.map((c) => ({ activityId: a.id, stakeholderId: c.stakeholderId, role: c.role }))),
    },
    people: [...members].sort((a, b) => order(a) - order(b)).map((m) => ({ userId: m.userId, name: displayName(m.user), lecturer: m.role === 'TEACHER' })),
  };
  return { team, risks, stages: stageRows, versions, raci };
}

/** Chế độ RACI mặc định: có mũ ROLE + đúng một sinh viên ⇒ "honest" (bản nộp); có mũ ROLE ⇒ people; không ⇒ people. */
export function defaultRaciMode(raci: { matrix: RaciMatrixLite; people: RaciPerson[] }): RaciMode {
  const hats = raci.matrix.stakeholders.some((s) => s.kind === 'ROLE');
  return hats && raci.people.filter((p) => !p.lecturer).length === 1 ? 'honest' : 'people';
}

/** Thêm/thay đoạn ghi chú ngay sau bảng RACI (chế độ honest). */
function putRaciNote(doc: PmNode, note: string) {
  const blocks = doc.content ?? [];
  const i = findHeading(blocks, /^Responsibility Assignments$/i);
  if (i < 0) return;
  const end = sectionEnd(blocks, i);
  const ti = blocks.slice(i + 1, end).findIndex((b) => b.type === 'table');
  if (ti < 0) return;
  const at = i + 1 + ti + 1;
  const isNote = (b: PmNode | undefined) => b?.type === 'paragraph' && /^Note: this is a one-person project/.test(((b.content ?? [])[0] as { text?: string } | undefined)?.text ?? '');
  const para: PmNode = { type: 'paragraph', content: [{ type: 'text', text: note, marks: [{ type: 'italic' }] }] };
  if (isNote(blocks[at])) blocks[at] = para; else blocks.splice(at, 0, para);
  doc.content = blocks;
}
export { RACI_MODES };

export const FILL_SECTIONS = ['recordOfChanges', 'team', 'risks', 'schedule', 'raci'] as const;
export type FillSection = (typeof FILL_SECTIONS)[number];

/** Áp các phần điền vào một bản sao nội dung. THUẦN phần biến đổi — tách ra để test không cần DB. */
export function applyFill(
  doc: PmNode,
  facts: {
    changes: ChangeRow[]; team: Array<{ name: string; role: string }>; risks: Parameters<typeof risksTable>[0]; stages: StageLite[]; versions: Parameters<typeof scheduleTable>[1];
    /** dm5 G2 (B2): có ⇒ RACI theo ma trận (vai/người/trung thực); không ⇒ như cũ (cột = người, giữ ô). */
    raci?: { matrix: RaciMatrixLite; people: RaciPerson[]; mode?: RaciMode };
  },
  only?: FillSection[],
): FillSection[] {
  const want = (s: FillSection) => !only?.length || only.includes(s);
  const filled: FillSection[] = [];
  if (want('recordOfChanges') && facts.changes.length && replaceTableAfterHeading(doc, /^Record of Changes$/i, () => changesTable(facts.changes))) filled.push('recordOfChanges');
  if (want('team') && facts.team.length && replaceTableAfterHeading(doc, /^Project Team$/i, () => teamTable(facts.team))) filled.push('team');
  if (want('risks') && facts.risks.length && replaceTableAfterHeading(doc, /^Project Risks$/i, () => risksTable(facts.risks))) filled.push('risks');
  if (want('schedule') && (facts.stages.length || facts.versions.length) && replaceTableAfterHeading(doc, /^(Cost & Time Estimations?|Scope & Estimation)$/i, () => scheduleTable(facts.stages, facts.versions))) filled.push('schedule');
  const people = facts.team.filter((m) => m.role !== 'Lecturer').map((m) => m.name);
  if (want('raci') && facts.raci && (facts.raci.matrix.activities.length || facts.raci.matrix.stakeholders.some((s) => s.kind === 'ROLE'))) {
    const mode = facts.raci.mode ?? defaultRaciMode(facts.raci);
    if (replaceTableAfterHeading(doc, /^Responsibility Assignments$/i, (old) => raciReport2Table(old, { mode, people: facts.raci!.people, matrix: facts.raci!.matrix }))) {
      filled.push('raci');
      if (mode === 'honest') putRaciNote(doc, honestRaciNote(facts.raci.matrix.stakeholders.filter((s) => s.kind === 'ROLE').map((s) => s.name)));
    }
  } else if (want('raci') && people.length && replaceTableAfterHeading(doc, /^Responsibility Assignments$/i, (old) => raciTable(old, people))) filled.push('raci');
  return filled;
}

export async function autofillPage(userId: number, projectId: number, num: number, input: { version?: number; sections?: FillSection[]; raciMode?: RaciMode }) {
  await docCtx(userId, projectId);
  const page = await getPage(userId, projectId, num);
  if (!page.canEdit) throw new ForbiddenError('You can read this page but not edit it');
  const [changes, facts] = await Promise.all([pageRecordOfChanges(userId, projectId, num), projectFacts(projectId)]);
  const doc = JSON.parse(JSON.stringify(page.contentJson ?? { type: 'doc', content: [] })) as PmNode;
  const filled = applyFill(doc, { changes, ...facts, raci: { ...facts.raci, mode: input.raciMode } }, input.sections);
  if (!filled.length) return { filled, page };
  const updated = await updatePage(userId, projectId, num, {
    contentJson: doc, version: input.version ?? page.version,
    versionNote: `Filled from project data (${filled.join(', ')})`,
  });
  return { filled, page: updated };
}
