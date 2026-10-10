/**
 * CT Work — CTW Diagram (10/10/2026): DIAGRAM STUDIO — phần có DB. Phần thuần: diagram.ts (kiểm/rút tên/nhúng),
 * diagramGen.ts (dựng từ dữ liệu), diagramAi.ts (lời nhắc + JSON ⇒ Mermaid), diagramImport.ts (nhập tệp),
 * diagramFill.ts (đặt vào Report 3/4 + đồng bộ khối nhúng), diagramRepo.ts (đọc repo đã nối).
 *
 * Quyền (giống SRS đợt 4): xem = đội dự án + giảng viên (khách CLIENT/GUEST/khách cách ly ⇒ 403); sửa = issue.edit
 * (ADMIN/MEMBER; agent theo rào chắn chung); bình luận = comment.create (ADMIN/MEMBER/TEACHER); duyệt = NGƯỜI ADMIN/MEMBER/
 * TEACHER. Agent (MCP/BUILTIN) chỉ tạo ĐỀ XUẤT: sơ đồ mới ⇒ PROPOSED; sửa sơ đồ người đã làm ⇒ phiên bản PROPOSED chờ nhận.
 *
 * AI vẽ (generate): dựng từ dữ liệu khi dữ liệu đã đủ (UC/actor/màn/workflow/repo) — KHÔNG gọi model; chỉ gọi model khi
 * cần diễn giải chữ (lời thông điệp sequence, ERD/kiến trúc từ Docs, chuyển trạng thái có bằng chứng). Model trả JSON ⇒ mã
 * dựng Mermaid ⇒ KIỂM (cú pháp, đúng loại, đủ khối alt/opt, mọi thực thể có nguồn, mã UC/BR có thật) ⇒ hỏng thì gửi lỗi
 * cho model sửa ĐÚNG MỘT lần ⇒ còn hỏng thì báo lỗi. Thứ không có nguồn ⇒ gắn "(assumed)" ngay trên sơ đồ + origin.assumptions.
 */

import { Prisma } from '@prisma/client';
import type { z } from 'zod';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { checkTokenQuota, extractJson, isAiAvailable, llmComplete, type LLMMessage } from '../interview/llm/index.js';
import { auditProject } from './audit.js';
import { displayName } from './common.js';
import {
  checkDiagram, DIAGRAM_TYPE_LABEL, diagramKey, isAssumedLabel, lintMermaid, markAssumed, MAX_MERMAID, normalizeExcalidraw,
  typeFromMermaid, type CheckResult, type DiagramFormat, type DiagramType, type GeneratableType,
} from './diagram.js';
import {
  erdOut, erdPrompt, graphOut, graphPrompt, renderErdFromOut, renderGraph, renderSequence, renderState, repairMessage,
  seqOut, sequencePrompt, stateOut, statePrompt,
} from './diagramAi.js';
import { applyDiagramFill, headingsOf, insertEmbed, syncEmbedsInDoc, type FillPart, type PlacedDiagram, FILL_LABEL } from './diagramFill.js';
import {
  activityFromUc, branchCount, classDiagram, deploymentFromCompose, erdFromModel, parseClasses, parseCompose, parseJpaEntities,
  parsePrismaSchema, parseSqlDdl, screenFlowDiagram, sequenceFromUc, stateFromWorkflow, stateSkeleton, useCaseDiagram,
  type BuiltDiagram, type DataModel,
} from './diagramGen.js';
import { importFile, ImportError } from './diagramImport.js';
import { findClassCandidates, findCompose, findEntityCandidates, findPrisma, findSqlMigrations, readMany, repoFor } from './diagramRepo.js';
import { plainText } from './docExport.js';
import type { PmNode } from './docMarkdown.js';
import { emitWorkEvent } from './events.js';
import { getPage, updatePage } from './pages.service.js';
import { can, canViewPage, isClientScoped, requireProject, type ProjectAccess } from './permissions.js';
import { findReportPage, loadSrs } from './srs.service.js';
import { refNumber, ucKey } from './srs.js';

// ─── Quyền ───────────────────────────────────────────────────────

export interface DiagramCtx { access: ProjectAccess; canEdit: boolean; canApprove: boolean; canComment: boolean; isAgent: boolean }

function restricted(a: ProjectAccess): boolean {
  return a.role === 'CLIENT' || isClientScoped(a) || (a.workspaceRole === 'GUEST' && a.role !== 'TEACHER');
}

export async function diagramCtx(userId: number, projectId: number, mode: 'view' | 'edit' | 'approve' | 'comment' = 'view'): Promise<DiagramCtx> {
  const access = await requireProject(userId, projectId, 'project.view');
  if (restricted(access)) throw new AppError('Diagrams are only available to the project team and lecturers', 403, 'WORK_INTERNAL_ONLY');
  const isAgent = access.principal === 'AGENT';
  const canEdit = can(access.role, 'issue.edit', access.options, access.principal);
  const canApprove = !isAgent && (access.role === 'ADMIN' || access.role === 'MEMBER' || access.role === 'TEACHER');
  const canComment = can(access.role, 'comment.create', access.options, access.principal);
  if (mode === 'edit' && !canEdit) throw new ForbiddenError('You can view the diagrams but not change them');
  if (mode === 'approve' && !canApprove) throw new ForbiddenError(isAgent ? 'An AI agent cannot approve diagrams — a person reviews the proposal' : 'Only project members and lecturers can approve diagrams');
  if (mode === 'comment' && !canComment) throw new ForbiddenError('You cannot comment in this project');
  return { access, canEdit, canApprove, canComment, isAgent };
}

const touch = (projectId: number, userId: number) => emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });

// ─── Đọc ─────────────────────────────────────────────────────────

const ROW = {
  id: true, projectId: true, number: true, format: true, diagramType: true, title: true, description: true, feature: true, status: true,
  currentVersion: true, approvedVersion: true, issueId: true, useCaseId: true, pageNumber: true, aiModel: true, createdById: true,
  updatedById: true, rev: true, createdAt: true, updatedAt: true,
} satisfies Prisma.WorkDiagramSelect;
type Row = Prisma.WorkDiagramGetPayload<{ select: typeof ROW }>;

async function findDiagram(projectId: number, number: number): Promise<Row> {
  const d = await prisma.workDiagram.findFirst({ where: { projectId, number, deletedAt: null }, select: ROW });
  if (!d) throw new NotFoundError('Diagram not found');
  return d;
}

async function people(ids: Array<number | null | undefined>) {
  const uniq = [...new Set(ids.filter((x): x is number => !!x))];
  if (!uniq.length) return new Map<number, { id: number; name: string; username: string; isAgent: boolean }>();
  const rows = await prisma.user.findMany({ where: { id: { in: uniq } }, select: { id: true, username: true, fullName: true, displayName: true, kind: true } });
  return new Map(rows.map((u) => [u.id, { id: u.id, name: displayName(u), username: u.username, isAgent: u.kind === 'AGENT' }]));
}

async function linksOf(projectId: number, rows: Row[]) {
  const issueIds = [...new Set(rows.map((r) => r.issueId).filter((x): x is number => !!x))];
  const ucIds = [...new Set(rows.map((r) => r.useCaseId).filter((x): x is number => !!x))];
  const pageNums = [...new Set(rows.map((r) => r.pageNumber).filter((x): x is number => !!x))];
  const [project, issues, ucs, pages] = await Promise.all([
    prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { key: true } }),
    issueIds.length ? prisma.workIssue.findMany({ where: { id: { in: issueIds }, projectId, deletedAt: null }, select: { id: true, number: true, title: true } }) : [],
    ucIds.length ? prisma.workUseCase.findMany({ where: { id: { in: ucIds }, projectId }, select: { id: true, number: true, name: true, feature: true } }) : [],
    pageNums.length ? prisma.workPage.findMany({ where: { projectId, number: { in: pageNums }, deletedAt: null }, select: { number: true, title: true } }) : [],
  ]);
  return {
    issue: (id: number | null) => { const i = issues.find((x) => x.id === id); return i ? { number: i.number, key: `${project.key}-${i.number}`, title: i.title } : null; },
    useCase: (id: number | null) => { const u = ucs.find((x) => x.id === id); return u ? { number: u.number, key: ucKey(u.number), name: u.name, feature: u.feature } : null; },
    page: (n: number | null) => { const p = pages.find((x) => x.number === n); return p ? { number: p.number, title: p.title } : null; },
  };
}

type Origin = {
  generator?: string; model?: string | null; type?: string; sources?: Array<{ kind: string; label: string; ref?: string | null }>;
  assumptions?: string[]; notes?: string[]; checks?: Record<string, unknown>; fidelity?: unknown; at?: string;
};
const originOf = (v: unknown): Origin | null => (v && typeof v === 'object' ? (v as Origin) : null);

export async function listDiagrams(userId: number, projectId: number, q: { type?: string | null; status?: string | null; useCase?: number | null; issue?: number | null; text?: string | null } = {}) {
  const ctx = await diagramCtx(userId, projectId);
  let ucId: number | null | undefined;
  if (q.useCase) ucId = (await prisma.workUseCase.findFirst({ where: { projectId, number: q.useCase }, select: { id: true } }))?.id ?? -1;
  let issueId: number | null | undefined;
  if (q.issue) issueId = (await prisma.workIssue.findFirst({ where: { projectId, number: q.issue, deletedAt: null }, select: { id: true } }))?.id ?? -1;
  const rows = await prisma.workDiagram.findMany({
    where: {
      projectId, deletedAt: null, ...(q.type ? { diagramType: q.type } : {}), ...(q.status ? { status: q.status } : {}),
      ...(ucId !== undefined ? { useCaseId: ucId } : {}), ...(issueId !== undefined ? { issueId } : {}),
      ...(q.text?.trim() ? { title: { contains: q.text.trim(), mode: 'insensitive' as const } } : {}),
    },
    orderBy: [{ updatedAt: 'desc' }], take: 500, select: ROW,
  });
  const [links, names, comments, proposals, current] = await Promise.all([
    linksOf(projectId, rows),
    people(rows.flatMap((r) => [r.updatedById, r.createdById])),
    prisma.workDiagramComment.groupBy({ by: ['diagramId'], where: { diagramId: { in: rows.map((r) => r.id) }, deletedAt: null, resolvedAt: null }, _count: true }),
    prisma.workDiagramVersion.groupBy({ by: ['diagramId'], where: { diagramId: { in: rows.map((r) => r.id) }, state: 'PROPOSED' }, _count: true }),
    prisma.workDiagramVersion.findMany({ where: { OR: rows.map((r) => ({ diagramId: r.id, number: r.currentVersion })) }, select: { diagramId: true, origin: true } }),
  ]);
  return {
    canEdit: ctx.canEdit, canApprove: ctx.canApprove, canComment: ctx.canComment,
    items: rows.map((r) => ({
      ...view(r), issue: links.issue(r.issueId), useCase: links.useCase(r.useCaseId), page: links.page(r.pageNumber),
      updatedBy: names.get(r.updatedById ?? r.createdById ?? 0) ?? null,
      openComments: comments.find((c) => c.diagramId === r.id)?._count ?? 0,
      pendingProposals: proposals.find((p) => p.diagramId === r.id)?._count ?? 0,
      assumptions: (originOf(current.find((c) => c.diagramId === r.id)?.origin)?.assumptions ?? []).length,
    })),
  };
}

function view(r: Row) {
  return {
    id: r.id, number: r.number, key: diagramKey(r.number), format: r.format as DiagramFormat, type: r.diagramType as DiagramType,
    typeLabel: DIAGRAM_TYPE_LABEL[r.diagramType as DiagramType] ?? r.diagramType, title: r.title, description: r.description, feature: r.feature,
    status: r.status, currentVersion: r.currentVersion, approvedVersion: r.approvedVersion, rev: r.rev, aiModel: r.aiModel,
    createdAt: r.createdAt, updatedAt: r.updatedAt,
  };
}

export async function getDiagram(userId: number, projectId: number, number: number) {
  const ctx = await diagramCtx(userId, projectId);
  const d = await findDiagram(projectId, number);
  const [versions, comments, links] = await Promise.all([
    prisma.workDiagramVersion.findMany({ where: { diagramId: d.id }, orderBy: { number: 'desc' }, take: 200, select: { id: true, number: true, note: true, state: true, authorId: true, aiModel: true, createdAt: true, origin: true, previewImageId: true, source: true } }),
    prisma.workDiagramComment.findMany({ where: { diagramId: d.id, deletedAt: null }, orderBy: { id: 'asc' }, take: 500 }),
    linksOf(projectId, [d]),
  ]);
  const names = await people([...versions.map((v) => v.authorId), ...comments.map((c) => c.authorId), d.createdById, d.updatedById]);
  const cur = versions.find((v) => v.number === d.currentVersion) ?? versions.find((v) => v.state === 'ACCEPTED');
  const pending = versions.filter((v) => v.state === 'PROPOSED');
  return {
    ...view(d), canEdit: ctx.canEdit, canApprove: ctx.canApprove, canComment: ctx.canComment, isAgent: ctx.isAgent,
    issue: links.issue(d.issueId), useCase: links.useCase(d.useCaseId), page: links.page(d.pageNumber),
    createdBy: names.get(d.createdById ?? 0) ?? null, updatedBy: names.get(d.updatedById ?? d.createdById ?? 0) ?? null,
    source: cur?.source ?? '', origin: originOf(cur?.origin), previewImageId: cur?.previewImageId ?? null,
    lint: d.format === 'MERMAID' ? lintMermaid(cur?.source ?? '') : null,
    versions: versions.map((v) => ({ number: v.number, note: v.note, state: v.state, author: names.get(v.authorId ?? 0) ?? null, aiModel: v.aiModel, createdAt: v.createdAt, generator: originOf(v.origin)?.generator ?? null, assumptions: originOf(v.origin)?.assumptions?.length ?? 0 })),
    proposals: pending.map((v) => ({ number: v.number, note: v.note, author: names.get(v.authorId ?? 0) ?? null, createdAt: v.createdAt, source: v.source, origin: originOf(v.origin) })),
    comments: comments.map((c) => ({ id: c.id, parentId: c.parentId, versionNumber: c.versionNumber, anchor: c.anchor, body: c.body, resolved: !!c.resolvedAt, createdAt: c.createdAt, author: names.get(c.authorId ?? 0) ?? null, mine: c.authorId === userId })),
  };
}

export async function getVersion(userId: number, projectId: number, number: number, v: number) {
  await diagramCtx(userId, projectId);
  const d = await findDiagram(projectId, number);
  const row = await prisma.workDiagramVersion.findFirst({ where: { diagramId: d.id, number: v } });
  if (!row) throw new NotFoundError('Version not found');
  return { number: row.number, note: row.note, state: row.state, source: row.source, origin: originOf(row.origin), previewImageId: row.previewImageId, createdAt: row.createdAt, format: d.format };
}

// ─── Ghi ─────────────────────────────────────────────────────────

export interface DiagramInput {
  format?: DiagramFormat;
  type?: DiagramType;
  title?: string;
  description?: string | null;
  feature?: string | null;
  source?: string;
  issueNumber?: number | null;
  useCase?: number | null;
  pageNumber?: number | null;
  note?: string | null;
  previewImageId?: number | null;
  origin?: Origin | null;
}

function checkSource(format: DiagramFormat, source: string): string {
  if (format === 'EXCALIDRAW') {
    const n = normalizeExcalidraw(source);
    if (!n.ok) throw new BadRequestError(n.error, 'WORK_DIAGRAM_BAD_SOURCE');
    return n.json;
  }
  const s = String(source ?? '').replace(/\r\n?/g, '\n').trim();
  if (!s) throw new BadRequestError('The diagram is empty', 'WORK_DIAGRAM_BAD_SOURCE');
  if (s.length > MAX_MERMAID) throw new BadRequestError(`The diagram is too long (max ${MAX_MERMAID} characters)`, 'WORK_DIAGRAM_BAD_SOURCE');
  if (/<\s*script|javascript:/i.test(s)) throw new BadRequestError('Scripts are not allowed in diagrams', 'WORK_DIAGRAM_BAD_SOURCE');
  return s;
}

async function issueIdFor(projectId: number, number: number | null | undefined): Promise<number | null | undefined> {
  if (number === undefined) return undefined;
  if (number === null) return null;
  const i = await prisma.workIssue.findFirst({ where: { projectId, number, deletedAt: null }, select: { id: true } });
  if (!i) throw new BadRequestError('Issue not found in this project', 'WORK_BAD_ISSUE');
  return i.id;
}
async function ucIdFor(projectId: number, number: number | null | undefined): Promise<number | null | undefined> {
  if (number === undefined) return undefined;
  if (number === null) return null;
  const u = await prisma.workUseCase.findFirst({ where: { projectId, number }, select: { id: true } });
  if (!u) throw new BadRequestError(`${ucKey(number)} does not exist in this project`, 'WORK_BAD_USE_CASE');
  return u.id;
}
async function pageFor(projectId: number, number: number | null | undefined): Promise<number | null | undefined> {
  if (number === undefined || number === null) return number;
  const p = await prisma.workPage.findFirst({ where: { projectId, number, deletedAt: null }, select: { number: true } });
  if (!p) throw new BadRequestError('Page not found in this project', 'WORK_BAD_PAGE');
  return p.number;
}
async function previewFor(projectId: number, id: number | null | undefined): Promise<number | null | undefined> {
  if (id === undefined || id === null) return id;
  const img = await prisma.workDocImage.findFirst({ where: { id, projectId }, select: { id: true } });
  if (!img) throw new BadRequestError('Preview image not found in this project', 'WORK_BAD_IMAGE');
  return img.id;
}

async function nextNumber(tx: Prisma.TransactionClient, projectId: number): Promise<number> {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(31051::int, ${projectId}::int)`;
  const agg = await tx.workDiagram.aggregate({ where: { projectId }, _max: { number: true } });
  return (agg._max.number ?? 0) + 1;
}

export async function createDiagram(userId: number, projectId: number, input: DiagramInput, opts: { propose?: boolean; aiModel?: string | null } = {}) {
  const ctx = await diagramCtx(userId, projectId, 'edit');
  const format: DiagramFormat = input.format ?? 'MERMAID';
  const source = checkSource(format, input.source ?? '');
  const type: DiagramType = input.type ?? (format === 'EXCALIDRAW' ? 'WHITEBOARD' : typeFromMermaid(source));
  const title = (input.title ?? '').trim().slice(0, 200) || `${DIAGRAM_TYPE_LABEL[type]} diagram`;
  const [issueId, useCaseId, pageNumber, previewImageId] = await Promise.all([
    issueIdFor(projectId, input.issueNumber), ucIdFor(projectId, input.useCase), pageFor(projectId, input.pageNumber), previewFor(projectId, input.previewImageId),
  ]);
  const status = ctx.isAgent || opts.propose ? 'PROPOSED' : 'DRAFT';
  const d = await prisma.$transaction(async (tx) => {
    const number = await nextNumber(tx, projectId);
    const row = await tx.workDiagram.create({
      data: {
        projectId, number, format, diagramType: type, title, description: input.description?.trim().slice(0, 20_000) || null,
        feature: input.feature?.trim().slice(0, 120) || null, status, currentVersion: 1, issueId: issueId ?? null, useCaseId: useCaseId ?? null,
        pageNumber: pageNumber ?? null, aiModel: opts.aiModel ?? (ctx.isAgent ? 'agent' : null), createdById: userId, updatedById: userId,
      },
      select: ROW,
    });
    await tx.workDiagramVersion.create({
      data: {
        diagramId: row.id, number: 1, source, note: input.note?.trim().slice(0, 300) || (status === 'PROPOSED' ? 'AI proposal' : 'Created'),
        state: 'ACCEPTED', origin: (input.origin ?? undefined) as Prisma.InputJsonValue | undefined, previewImageId: previewImageId ?? null,
        authorId: userId, aiModel: opts.aiModel ?? null,
      },
    });
    return row;
  });
  await auditProject(projectId, { actorId: userId, action: 'diagram.create', targetType: 'project', targetId: projectId, summary: `${status === 'PROPOSED' ? 'Proposed' : 'Created'} diagram ${diagramKey(d.number)} "${title}"` });
  touch(projectId, userId);
  return getDiagram(userId, projectId, d.number);
}

/**
 * Sửa: thông tin (tiêu đề/mô tả/feature/liên kết) + nguồn. Nguồn đổi ⇒ phiên bản mới. Agent sửa sơ đồ KHÔNG phải đề xuất của
 * chính nó ⇒ phiên bản PROPOSED (bản hiện hành giữ nguyên tới khi người nhận). Sơ đồ đổi bản hiện hành ⇒ cập nhật khối nhúng
 * `@latest` trong Docs.
 */
export async function updateDiagram(userId: number, projectId: number, number: number, input: DiagramInput & { rev?: number }) {
  const ctx = await diagramCtx(userId, projectId, 'edit');
  const d = await findDiagram(projectId, number);
  if (input.rev !== undefined && input.rev !== d.rev) {
    const by = await people([d.updatedById]);
    throw new AppError('Someone else saved this diagram a moment ago. Reload to see their changes.', 409, 'WORK_DIAGRAM_CONFLICT', { rev: d.rev, by: by.get(d.updatedById ?? 0) ?? null });
  }
  const ownProposal = d.status === 'PROPOSED' && d.createdById === userId;
  const proposeOnly = ctx.isAgent && !ownProposal;
  if (input.format && input.format !== d.format) throw new BadRequestError('A diagram cannot change between Mermaid and Excalidraw — create a new one', 'WORK_DIAGRAM_BAD_SOURCE');
  const [issueId, useCaseId, pageNumber, previewImageId] = await Promise.all([
    issueIdFor(projectId, input.issueNumber), ucIdFor(projectId, input.useCase), pageFor(projectId, input.pageNumber), previewFor(projectId, input.previewImageId),
  ]);
  const cur = await prisma.workDiagramVersion.findFirst({ where: { diagramId: d.id, number: d.currentVersion }, select: { source: true, previewImageId: true } });
  const source = input.source !== undefined ? checkSource(d.format as DiagramFormat, input.source) : undefined;
  const sourceChanged = source !== undefined && source !== cur?.source;
  const meta: Prisma.WorkDiagramUncheckedUpdateInput = {};
  if (!proposeOnly) {
    if (input.title !== undefined) meta.title = input.title.trim().slice(0, 200) || d.title;
    if (input.description !== undefined) meta.description = input.description?.trim().slice(0, 20_000) || null;
    if (input.feature !== undefined) meta.feature = input.feature?.trim().slice(0, 120) || null;
    if (input.type !== undefined) meta.diagramType = input.type;
    if (issueId !== undefined) meta.issueId = issueId;
    if (useCaseId !== undefined) meta.useCaseId = useCaseId;
    if (pageNumber !== undefined) meta.pageNumber = pageNumber;
  }
  let newVersion: number | null = null;
  await prisma.$transaction(async (tx) => {
    if (sourceChanged || (previewImageId !== undefined && previewImageId !== cur?.previewImageId && !proposeOnly)) {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(31052::int, ${d.id}::int)`;
      const agg = await tx.workDiagramVersion.aggregate({ where: { diagramId: d.id }, _max: { number: true } });
      newVersion = (agg._max.number ?? 0) + 1;
      await tx.workDiagramVersion.create({
        data: {
          diagramId: d.id, number: newVersion, source: source ?? cur?.source ?? '', note: input.note?.trim().slice(0, 300) || (proposeOnly ? 'AI agent proposal' : null),
          state: proposeOnly ? 'PROPOSED' : 'ACCEPTED', origin: (input.origin ?? undefined) as Prisma.InputJsonValue | undefined,
          previewImageId: previewImageId === undefined ? cur?.previewImageId ?? null : previewImageId, authorId: userId,
          aiModel: ctx.isAgent ? 'agent' : null,
        },
      });
      if (!proposeOnly) meta.currentVersion = newVersion;
    }
    const u = await tx.workDiagram.updateMany({ where: { id: d.id, rev: d.rev }, data: { ...meta, rev: { increment: 1 }, updatedById: userId } });
    if (!u.count) throw new ConflictError('Someone else saved this diagram a moment ago. Reload to see their changes.');
  });
  if (newVersion && !proposeOnly) await syncEmbeds(userId, projectId, d.id).catch((err) => logger.warn('[work] diagrams: đồng bộ Docs lỗi', { err: (err as Error).message }));
  touch(projectId, userId);
  const out = await getDiagram(userId, projectId, number);
  return { ...out, proposedVersion: proposeOnly ? newVersion : null };
}

/** Duyệt / bỏ duyệt. Duyệt ghim `approvedVersion` = bản hiện hành (bản này vào Report 3/4). */
export async function setApproval(userId: number, projectId: number, number: number, input: { approve: boolean; parsedOk?: boolean }) {
  await diagramCtx(userId, projectId, 'approve');
  const d = await findDiagram(projectId, number);
  if (input.approve && d.format === 'MERMAID') {
    const cur = await prisma.workDiagramVersion.findFirst({ where: { diagramId: d.id, number: d.currentVersion }, select: { source: true } });
    const lint = lintMermaid(cur?.source ?? '');
    // Bộ kiểm của máy chủ chặt với ngữ pháp CT Work sinh; cú pháp lạ hợp lệ ⇒ trình duyệt đã parse thật (parsedOk).
    if (!lint.ok && !input.parsedOk) throw new AppError(`Fix the diagram before approving it: ${lint.errors.slice(0, 3).map((e) => `line ${e.line}: ${e.message}`).join('; ')}`, 422, 'WORK_DIAGRAM_INVALID', { errors: lint.errors });
  }
  await prisma.workDiagram.update({
    where: { id: d.id },
    data: input.approve ? { status: 'APPROVED', approvedVersion: d.currentVersion, updatedById: userId, rev: { increment: 1 } } : { status: 'DRAFT', approvedVersion: null, updatedById: userId, rev: { increment: 1 } },
  });
  await auditProject(projectId, { actorId: userId, action: input.approve ? 'diagram.approve' : 'diagram.unapprove', targetType: 'project', targetId: projectId, summary: `${input.approve ? 'Approved' : 'Unapproved'} diagram ${diagramKey(d.number)} v${d.currentVersion}` });
  touch(projectId, userId);
  return getDiagram(userId, projectId, number);
}

/** Nhận / bỏ một phiên bản AI đề xuất (người ADMIN/MEMBER/TEACHER). Bỏ đề xuất DUY NHẤT của sơ đồ PROPOSED ⇒ xoá sơ đồ. */
export async function resolveProposal(userId: number, projectId: number, number: number, version: number, accept: boolean) {
  await diagramCtx(userId, projectId, 'approve');
  const d = await findDiagram(projectId, number);
  if (d.status === 'PROPOSED' && version === d.currentVersion) {
    // Cả sơ đồ là đề xuất: nhận ⇒ DRAFT; bỏ ⇒ xoá mềm.
    if (accept) await prisma.workDiagram.update({ where: { id: d.id }, data: { status: 'DRAFT', updatedById: userId, rev: { increment: 1 } } });
    else await prisma.workDiagram.update({ where: { id: d.id }, data: { deletedAt: new Date(), updatedById: userId } });
    await auditProject(projectId, { actorId: userId, action: accept ? 'diagram.accept' : 'diagram.discard', targetType: 'project', targetId: projectId, summary: `${accept ? 'Accepted' : 'Discarded'} the AI-proposed diagram ${diagramKey(d.number)}` });
    touch(projectId, userId);
    return accept ? getDiagram(userId, projectId, number) : { discarded: true, key: diagramKey(d.number) };
  }
  const v = await prisma.workDiagramVersion.findFirst({ where: { diagramId: d.id, number: version, state: 'PROPOSED' } });
  if (!v) throw new NotFoundError('Proposal not found (already accepted or discarded)');
  if (accept) {
    await prisma.$transaction([
      prisma.workDiagramVersion.update({ where: { id: v.id }, data: { state: 'ACCEPTED' } }),
      prisma.workDiagram.update({ where: { id: d.id }, data: { currentVersion: v.number, status: d.status === 'PROPOSED' ? 'DRAFT' : d.status, updatedById: userId, rev: { increment: 1 } } }),
    ]);
    await syncEmbeds(userId, projectId, d.id).catch(() => undefined);
  } else {
    await prisma.workDiagramVersion.update({ where: { id: v.id }, data: { state: 'DISCARDED' } });
  }
  await auditProject(projectId, { actorId: userId, action: accept ? 'diagram.accept' : 'diagram.discard', targetType: 'project', targetId: projectId, summary: `${accept ? 'Accepted' : 'Discarded'} proposed v${version} of ${diagramKey(d.number)}` });
  touch(projectId, userId);
  return getDiagram(userId, projectId, number);
}

/** Khôi phục: chép nguồn của phiên bản v thành phiên bản MỚI (lịch sử không mất gì). */
export async function restoreVersion(userId: number, projectId: number, number: number, v: number) {
  await diagramCtx(userId, projectId, 'edit');
  const d = await findDiagram(projectId, number);
  const row = await prisma.workDiagramVersion.findFirst({ where: { diagramId: d.id, number: v } });
  if (!row) throw new NotFoundError('Version not found');
  return updateDiagram(userId, projectId, number, { source: row.source, previewImageId: row.previewImageId, note: `Restored from v${v}`, origin: originOf(row.origin) });
}

export async function deleteDiagram(userId: number, projectId: number, number: number) {
  const ctx = await diagramCtx(userId, projectId, 'edit');
  const d = await findDiagram(projectId, number);
  if (ctx.isAgent && !(d.status === 'PROPOSED' && d.createdById === userId)) throw new ForbiddenError('An AI agent can only delete its own proposals');
  await prisma.workDiagram.update({ where: { id: d.id }, data: { deletedAt: new Date(), updatedById: userId } });
  await auditProject(projectId, { actorId: userId, action: 'diagram.delete', targetType: 'project', targetId: projectId, summary: `Deleted diagram ${diagramKey(d.number)} "${d.title}"` });
  touch(projectId, userId);
  return { deleted: diagramKey(d.number) };
}

// ─── Bình luận ───────────────────────────────────────────────────

export async function addComment(userId: number, projectId: number, number: number, input: { body: string; parentId?: number | null; anchor?: string | null; versionNumber?: number | null }) {
  await diagramCtx(userId, projectId, 'comment');
  const d = await findDiagram(projectId, number);
  const body = input.body.trim().slice(0, 10_000);
  if (!body) throw new BadRequestError('Write something first', 'VALIDATION_ERROR');
  if (input.parentId) {
    const p = await prisma.workDiagramComment.findFirst({ where: { id: input.parentId, diagramId: d.id, deletedAt: null }, select: { id: true, parentId: true } });
    if (!p) throw new BadRequestError('The comment you reply to was deleted', 'VALIDATION_ERROR');
    input.parentId = p.parentId ?? p.id; // một tầng trả lời
  }
  const c = await prisma.workDiagramComment.create({ data: { diagramId: d.id, authorId: userId, parentId: input.parentId ?? null, anchor: input.anchor?.trim().slice(0, 160) || null, versionNumber: input.versionNumber ?? d.currentVersion, body } });
  touch(projectId, userId);
  return { id: c.id };
}

export async function updateComment(userId: number, projectId: number, number: number, commentId: number, input: { resolved?: boolean; body?: string }) {
  const ctx = await diagramCtx(userId, projectId, 'comment');
  const d = await findDiagram(projectId, number);
  const c = await prisma.workDiagramComment.findFirst({ where: { id: commentId, diagramId: d.id, deletedAt: null } });
  if (!c) throw new NotFoundError('Comment not found');
  if (input.body !== undefined && c.authorId !== userId) throw new ForbiddenError('You can only edit your own comments');
  if (input.resolved !== undefined && c.authorId !== userId && !ctx.canEdit && !ctx.canApprove) throw new ForbiddenError('You cannot resolve this comment');
  await prisma.workDiagramComment.update({ where: { id: c.id }, data: { ...(input.body !== undefined ? { body: input.body.trim().slice(0, 10_000) || c.body } : {}), ...(input.resolved !== undefined ? { resolvedAt: input.resolved ? new Date() : null } : {}) } });
  touch(projectId, userId);
  return { id: c.id };
}

export async function deleteComment(userId: number, projectId: number, number: number, commentId: number) {
  const ctx = await diagramCtx(userId, projectId, 'comment');
  const d = await findDiagram(projectId, number);
  const c = await prisma.workDiagramComment.findFirst({ where: { id: commentId, diagramId: d.id, deletedAt: null } });
  if (!c) throw new NotFoundError('Comment not found');
  if (c.authorId !== userId && ctx.access.role !== 'ADMIN') throw new ForbiddenError('You can only delete your own comments');
  await prisma.workDiagramComment.update({ where: { id: c.id }, data: { deletedAt: new Date() } });
  touch(projectId, userId);
  return { deleted: c.id };
}

// ─── Nhập tệp ────────────────────────────────────────────────────

export async function importDiagram(userId: number, projectId: number, input: { fileName: string; content: string; base64?: boolean; page?: number; to?: 'mermaid' | 'native'; title?: string | null }) {
  await diagramCtx(userId, projectId, 'edit');
  let r: ReturnType<typeof importFile>;
  try {
    r = importFile({ fileName: input.fileName, content: input.content, base64: input.base64, page: input.page, to: input.to });
  } catch (err) {
    if (err instanceof ImportError) throw new BadRequestError(err.message, 'WORK_DIAGRAM_IMPORT');
    throw new BadRequestError(`Could not read this file (${(err as Error).message})`, 'WORK_DIAGRAM_IMPORT');
  }
  const created = await createDiagram(userId, projectId, {
    format: r.format, type: r.type, title: input.title?.trim() || r.title, source: r.source, note: `Imported from ${input.fileName.slice(0, 200)}`,
    origin: { generator: 'import', sources: [{ kind: 'file', label: input.fileName.slice(0, 200) }], notes: r.fidelity.notes, fidelity: r.fidelity, at: new Date().toISOString() },
  });
  return { ...created, fidelity: r.fidelity, pages: r.pages ?? null };
}

// ─── Docs: nhúng + đồng bộ ───────────────────────────────────────

async function placedOf(d: Row, version: number | null): Promise<PlacedDiagram | null> {
  const v = await prisma.workDiagramVersion.findFirst({ where: { diagramId: d.id, number: version ?? d.currentVersion }, select: { number: true, source: true, previewImageId: true } });
  if (!v) return null;
  const uc = d.useCaseId ? await prisma.workUseCase.findUnique({ where: { id: d.useCaseId }, select: { number: true, name: true, feature: true } }) : null;
  return {
    id: d.id, number: d.number, title: d.title, type: d.diagramType as DiagramType, format: d.format as DiagramFormat, version: v.number, source: v.source,
    feature: d.feature ?? uc?.feature ?? null, useCase: uc ? { number: uc.number, name: uc.name } : null, previewImageId: v.previewImageId,
  };
}

/** Chèn khối sơ đồ vào một trang Docs (một phiên bản trang mới). `latest` ⇒ tự cập nhật khi sơ đồ đổi bản. */
export async function embedInPage(userId: number, projectId: number, number: number, input: { page: number; mode?: 'latest' | 'pinned'; heading?: string | null }) {
  await diagramCtx(userId, projectId);
  const d = await findDiagram(projectId, number);
  if (d.status === 'PROPOSED') throw new BadRequestError('Accept the AI proposal before inserting it into a document', 'WORK_DIAGRAM_PROPOSED');
  const placed = await placedOf(d, null);
  if (!placed) throw new NotFoundError('Diagram version not found');
  const page = await getPage(userId, projectId, input.page);
  if (!page.canEdit) throw new ForbiddenError('You can read this page but not edit it');
  const doc = JSON.parse(JSON.stringify(page.contentJson ?? { type: 'doc', content: [] })) as PmNode;
  const r = insertEmbed(doc, placed, projectId, { mode: input.mode ?? 'latest', heading: input.heading });
  const updated = await updatePage(userId, projectId, input.page, { contentJson: doc, version: page.version, versionNote: `Inserted diagram ${diagramKey(d.number)} v${placed.version}` });
  if (!d.pageNumber) await prisma.workDiagram.update({ where: { id: d.id }, data: { pageNumber: input.page } });
  return { page: { number: input.page, title: page.title, version: (updated as { currentVersion?: number }).currentVersion ?? null }, placed: r.placed };
}

export async function pageHeadings(userId: number, projectId: number, num: number) {
  const page = await getPage(userId, projectId, num);
  return { number: num, title: page.title, canEdit: page.canEdit, headings: headingsOf(page.contentJson as unknown as PmNode) };
}

/** Sau khi sơ đồ đổi bản hiện hành: mọi trang có khối `ctw-diagram:<id>@latest` ⇒ cập nhật (mỗi trang một phiên bản). */
export async function syncEmbeds(userId: number, projectId: number, diagramId: number): Promise<{ updated: number[]; skipped: Array<{ page: number; reason: string }> }> {
  const d = await prisma.workDiagram.findFirst({ where: { id: diagramId, deletedAt: null }, select: ROW });
  const out = { updated: [] as number[], skipped: [] as Array<{ page: number; reason: string }> };
  if (!d) return out;
  const placed = await placedOf(d, null);
  if (!placed) return out;
  const hits = await prisma.$queryRaw<Array<{ number: number }>>`SELECT number FROM work_pages WHERE project_id = ${projectId} AND deleted_at IS NULL AND content_json::text LIKE ${`%ctw-diagram:${diagramId}@latest%`} ORDER BY number LIMIT 50`;
  for (const h of hits) {
    try {
      const page = await getPage(userId, projectId, h.number);
      if (!page.canEdit) { out.skipped.push({ page: h.number, reason: 'no edit access' }); continue; }
      const doc = JSON.parse(JSON.stringify(page.contentJson ?? { type: 'doc', content: [] })) as PmNode;
      if (!syncEmbedsInDoc(doc, placed, projectId)) continue;
      await updatePage(userId, projectId, h.number, { contentJson: doc, version: page.version, versionNote: `Diagram ${diagramKey(d.number)} updated to v${placed.version}` });
      out.updated.push(h.number);
    } catch (err) {
      out.skipped.push({ page: h.number, reason: (err as Error).message.slice(0, 120) });
    }
  }
  return out;
}

// ─── Report 3 / 4 ────────────────────────────────────────────────

/** Sơ đồ ĐÃ DUYỆT (bản đã duyệt) của dự án — cho Report 3/4. KHÔNG kiểm quyền (nơi gọi kiểm). */
export async function approvedDiagrams(projectId: number): Promise<PlacedDiagram[]> {
  const rows = await prisma.workDiagram.findMany({ where: { projectId, deletedAt: null, status: 'APPROVED', approvedVersion: { not: null } }, orderBy: { number: 'asc' }, take: 200, select: ROW });
  const out: PlacedDiagram[] = [];
  // CTW đợt 6b: đánh dấu sơ đồ là mô hình SRS (context ⇒ Report 3 §1.1; không vào kiến trúc Report 4).
  const models = rows.length ? await (await import('./srsDeep.service.js')).srsModelKinds(projectId) : new Map<number, string>();
  for (const r of rows) { const p = await placedOf(r, r.approvedVersion); if (p) out.push({ ...p, srsModel: models.get(r.id) ?? null }); }
  return out;
}

/** Đặt sơ đồ đã duyệt vào trang Report 3 hoặc 4 của dự án — MỘT phiên bản trang mới có ghi chú. */
export async function fillReport(userId: number, projectId: number, report: 3 | 4) {
  await diagramCtx(userId, projectId);
  const pg = await findReportPage(projectId, report);
  if (!pg) throw new NotFoundError(`This project has no Report ${report} page — create it from the "FPT Capstone" template in Docs`);
  const page = await getPage(userId, projectId, pg.number);
  if (!page.canEdit) throw new ForbiddenError('You can read this page but not edit it');
  const diagrams = await approvedDiagrams(projectId);
  const doc = JSON.parse(JSON.stringify(page.contentJson ?? { type: 'doc', content: [] })) as PmNode;
  const filled = applyDiagramFill(doc, report, diagrams, projectId);
  if (!filled.length) return { filled, page: { number: pg.number, title: pg.title }, diagrams: diagrams.length };
  const updated = await updatePage(userId, projectId, pg.number, { contentJson: doc, version: page.version, versionNote: `Inserted approved diagrams (${filled.map((f) => FILL_LABEL[f]).join(', ')})` });
  return { filled, page: { number: pg.number, title: pg.title, version: (updated as { currentVersion?: number }).currentVersion ?? null }, diagrams: diagrams.length };
}

/** Cho bản xuất Report 3 (đợt 4): đặt sơ đồ đã duyệt vào nội dung TRONG BỘ NHỚ. */
export async function fillReportDocInMemory(projectId: number, doc: PmNode, report: 3 | 4): Promise<FillPart[]> {
  return applyDiagramFill(doc, report, await approvedDiagrams(projectId), projectId);
}

// ─── AI vẽ từ dữ liệu dự án ──────────────────────────────────────

type Ask = (system: string, messages: LLMMessage[]) => Promise<{ text: string; model: string | null }>;
let askOverride: ((system: string, messages: LLMMessage[]) => Promise<string>) | null = null;
/** CHỈ cho test: thay lời gọi model (null = gọi thật). Trả chuỗi model sẽ trả. */
export function _setDiagramAskForTests(fn: ((system: string, messages: LLMMessage[]) => Promise<string>) | null): void { askOverride = fn; }

const aiReady = () => !!askOverride || isAiAvailable('work');

async function askerFor(userId: number, ctx: DiagramCtx): Promise<Ask> {
  if (askOverride) { const f = askOverride; return async (s, m) => ({ text: await f(s, m), model: 'test-model' }); }
  if (!isAiAvailable('work')) throw new AppError('The AI assistant is temporarily unavailable. Please try again later.', 503, 'WORK_AI_UNAVAILABLE');
  if (!(await checkTokenQuota(userId))) throw new AppError('You have reached today’s AI usage limit.', 429, 'WORK_AI_TOKEN_CAP');
  if (!ctx.isAgent) {
    if (!can(ctx.access.role, 'ai.use', ctx.access.options, ctx.access.principal)) throw new ForbiddenError('Drawing with AI needs a member or admin role');
    const { aiQuota } = await import('./ai.service.js');
    const q = await aiQuota(userId);
    if (q.limit !== null && (q.remaining ?? 0) <= 0) throw new AppError(`You have used all ${q.limit} free AI requests for today. Upgrade to Pro to keep using the AI assistant.`, 402, 'WORK_AI_QUOTA_EXCEEDED', { limit: q.limit, used: q.used, upgradeUrl: '/pro' });
  }
  // purpose work_assistant (sẵn có) — xem báo cáo: nên có purpose riêng `work_diagram` nếu muốn tách model/chi phí.
  return async (system, messages) => {
    const r = await llmComplete({ step: 'report', system, messages, maxTokens: 4000, userId, feature: 'work', purpose: 'work_assistant', timeoutMs: 120_000, maxRetries: 1 });
    return { text: r.text, model: r.model ?? null };
  };
}

/** Hỏi model ra JSON đúng khuôn; JSON hỏng ⇒ hỏi lại MỘT lần. `check` trả lỗi ngữ nghĩa ⇒ gửi lỗi cho model sửa MỘT lần. */
async function askJson<S extends z.ZodTypeAny, R>(ask: Ask, prompt: { system: string; user: string }, schema: S, build: (v: z.infer<S>) => { result: R; errors: string[] }): Promise<{ result: R; model: string | null; repaired: boolean }> {
  const messages: LLMMessage[] = [{ role: 'user', content: prompt.user }];
  let repaired = false;
  let lastErrors: string[] = [];
  for (let attempt = 0; attempt < 2; attempt++) {
    const r = await ask(prompt.system, messages);
    let parsed: z.infer<S> | null = null;
    try {
      const v = schema.safeParse(extractJson(r.text));
      if (v.success) parsed = v.data;
      else lastErrors = [`The JSON does not match the shape: ${v.error.issues.slice(0, 3).map((i) => `${i.path.join('.')} ${i.message}`).join('; ')}`];
    } catch { lastErrors = ['The answer was not a JSON object']; }
    if (parsed) {
      const b = build(parsed);
      if (!b.errors.length) return { result: b.result, model: r.model, repaired };
      lastErrors = b.errors;
    }
    if (attempt === 0) {
      repaired = true;
      logger.info('[work] diagrams: AI answer failed the checks — asking for one repair', { errors: lastErrors.slice(0, 5) });
      messages.push({ role: 'assistant', content: r.text.slice(0, 12_000) }, { role: 'user', content: repairMessage(lastErrors) });
    }
  }
  throw new AppError(`The AI diagram failed CT Work's checks after one repair: ${lastErrors.slice(0, 4).join(' · ')}`, 422, 'WORK_DIAGRAM_CHECK_FAILED', { errors: lastErrors });
}

export interface GenerateInput {
  type: GeneratableType;
  useCase?: number | string | null;
  feature?: string | null;
  entities?: string[] | null;
  source?: 'auto' | 'repo' | 'dictionary' | 'docs' | 'workflow' | null;
  instruction?: string | null;
  title?: string | null;
  issueNumber?: number | null;
  /** Đề xuất phiên bản mới cho sơ đồ D-n đã có (thay vì tạo sơ đồ mới). */
  update?: number | null;
}

interface Generated { built: BuiltDiagram; check: CheckResult; usedAi: boolean; model: string | null; repaired: boolean; useCaseId: number | null; issueId: number | null }

/** Chữ trong Docs liên quan (Report 3/4, trang thiết kế/CSDL/triển khai) mà người gọi đọc được — trần ~14k ký tự. */
async function docsCorpus(projectId: number, access: ProjectAccess, re: RegExp): Promise<{ text: string; pages: string[] }> {
  const pages = await prisma.workPage.findMany({ where: { projectId, deletedAt: null }, orderBy: { number: 'asc' }, take: 300, select: { number: true, title: true, templateKey: true, visibility: true, contentText: true } });
  const pick = pages.filter((p) => canViewPage(access.role, access.workspaceRole, p.visibility) && (re.test(p.title) || /^fpt-report[34]|^sdd$|^srs$/.test(p.templateKey ?? '')) && (p.contentText ?? '').trim().length > 40);
  let text = '';
  const used: string[] = [];
  for (const p of pick) {
    if (text.length > 14_000) break;
    text += `\n### Doc ${p.number} — ${p.title}\n${(p.contentText ?? '').slice(0, 14_000 - text.length)}`;
    used.push(`Doc ${p.number} ${p.title}`);
  }
  return { text: text.trim(), pages: used };
}

async function dataDictionary(projectId: number, access: ProjectAccess): Promise<{ model: DataModel; page: string } | null> {
  // CTW đợt 4b (R16): Data Dictionary CÓ CẤU TRÚC (Requirements → Wiegers → Data dictionary) đi trước trang Docs.
  const structured = await (await import('./swr.service.js')).dictionaryModel(projectId);
  if (structured) return { model: structured, page: `structured Data Dictionary (${structured.tables.length} structure${structured.tables.length === 1 ? '' : 's'})` };
  const pages =await prisma.workPage.findMany({ where: { projectId, deletedAt: null, title: { contains: 'data dictionary', mode: 'insensitive' } }, take: 5, select: { number: true, title: true, visibility: true, contentJson: true } });
  for (const p of pages) {
    if (!canViewPage(access.role, access.workspaceRole, p.visibility)) continue;
    const blocks = ((p.contentJson as unknown as PmNode | null)?.content ?? []);
    const tables: DataModel['tables'] = [];
    let lastHeading = '';
    for (const b of blocks) {
      if (b.type === 'heading') { lastHeading = plainText(b).replace(/^(?:\d+(?:\.\d+)*\.?)\s+/, '').trim(); continue; }
      if (b.type !== 'table') continue;
      const rows = (b.content ?? []).map((r) => (r.content ?? []).map((c) => plainText(c).trim()));
      if (rows.length < 2) continue;
      const head = rows[0].map((h) => h.toLowerCase());
      const ci = head.findIndex((h) => /field|column|attribute|cột|thuộc tính|name/.test(h));
      const ti = head.findIndex((h) => /type|kiểu/.test(h));
      const ki = head.findIndex((h) => /key|khoá|khóa|pk|constraint/.test(h));
      if (ci < 0 || !lastHeading) continue;
      tables.push({
        name: lastHeading.replace(/\s+/g, '_').slice(0, 60),
        columns: rows.slice(1).filter((r) => r[ci]).map((r) => ({ name: r[ci], type: ti >= 0 ? r[ti] || 'string' : 'string', pk: ki >= 0 && /pk|primary/i.test(r[ki]), fk: ki >= 0 && /fk|foreign/i.test(r[ki]), uk: ki >= 0 && /uk|unique/i.test(r[ki]) })),
      });
    }
    if (!tables.length) continue;
    const names = new Set(tables.map((t) => t.name.toLowerCase()));
    const relations: DataModel['relations'] = [];
    for (const t of tables) for (const c of t.columns.filter((x) => x.fk)) {
      const target = [...names].find((n) => c.name.toLowerCase().replace(/_?id$/, '') === n.replace(/s$/, '') || c.name.toLowerCase().startsWith(n.replace(/s$/, '')));
      const real = tables.find((x) => x.name.toLowerCase() === target);
      if (real) relations.push({ from: t.name, to: real.name, fromMany: true, toMany: false, optional: false, label: c.name });
    }
    return { model: { tables, relations, enums: [], source: `Doc ${p.number} ${p.title}` }, page: `Doc ${p.number} ${p.title}` };
  }
  return null;
}

/**
 * QA 10/10 P2-4: thiếu dữ liệu nguồn để dựng sơ đồ ⇒ 422 + câu SONG NGỮ chỉ chỗ thêm dữ liệu, KHÔNG tạo sơ đồ rỗng
 * (trước đây USE_CASE trên dự án chưa có use case vẫn ra một khung SYSTEM trống gắn nhãn "AI đề xuất / Nhận").
 * `message` = "EN / VI" cho API/MCP/agent đọc thẳng; `data.en` / `data.vi` để giao diện chọn đúng một ngôn ngữ;
 * `data.fix` = tab/trang cần mở (requirements | workflow | repo | docs).
 */
export function noDiagramSource(en: string, vi: string, fix?: 'requirements' | 'workflow' | 'repo' | 'docs', code = 'WORK_DIAGRAM_NO_SOURCE'): AppError {
  return new AppError(`${en} / ${vi}`, 422, code, { en, vi, ...(fix ? { fix } : {}) });
}

async function systemNameOf(projectId: number) {
  const p = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });
  return p.name.trim().slice(0, 60) || p.key;
}

async function buildFor(userId: number, projectId: number, ctx: DiagramCtx, input: GenerateInput): Promise<Generated> {
  const systemName = await systemNameOf(projectId);
  const srs = await loadSrs(projectId);
  const ucNos = srs.useCases.map((u) => u.number);
  const brNos = srs.rules.map((r) => r.number);
  const finalize = (built: BuiltDiagram, extra: { minBranches?: number } = {}) => checkDiagram({ type: built.type, mermaid: built.mermaid, allowed: built.allowed, structural: built.structural, ucNumbers: ucNos, brNumbers: brNos, minBranches: extra.minBranches });
  const plain = (built: BuiltDiagram, more: Partial<Generated> = {}): Generated => ({ built, check: finalize(built), usedAi: false, model: null, repaired: false, useCaseId: null, issueId: null, ...more });

  const needUc = () => {
    if (!srs.useCases.length) throw noDiagramSource('No use cases yet — add them on Requirements › Use cases first, then draw this diagram.', 'Chưa có use case — thêm ở Requirements › Use cases trước rồi hãy vẽ sơ đồ này.', 'requirements');
    const n = refNumber(input.useCase, 'UC');
    if (!n) throw new BadRequestError('Choose a use case (e.g. "UC-05") for this diagram', 'VALIDATION_ERROR');
    const uc = srs.useCases.find((u) => u.number === n);
    if (!uc) throw new BadRequestError(`${ucKey(n)} does not exist in this project — see the Requirements page`, 'WORK_BAD_USE_CASE');
    return uc;
  };

  switch (input.type) {
    case 'USE_CASE': {
      const live = srs.useCases.filter((u) => u.status !== 'PROPOSED');
      if (!live.length) {
        throw noDiagramSource(
          srs.useCases.length ? 'Every use case is still a proposal — accept at least one on Requirements › Use cases first.' : 'No use cases yet — add actors and use cases on Requirements › Use cases first.',
          srs.useCases.length ? 'Mọi use case vẫn đang là đề xuất — nhận ít nhất một cái ở Requirements › Use cases trước.' : 'Chưa có use case — thêm actor và use case ở Requirements › Use cases trước.',
          'requirements',
        );
      }
      if (input.feature && !live.some((u) => (u.feature ?? '') === input.feature)) {
        throw noDiagramSource(`No use case belongs to feature "${input.feature}" — pick another feature or tag use cases with it on Requirements.`, `Không có use case nào thuộc tính năng "${input.feature}" — chọn tính năng khác hoặc gắn tính năng cho use case ở Requirements.`, 'requirements');
      }
      return plain(useCaseDiagram({ actors: srs.actors, useCases: srs.useCases, systemName, feature: input.feature }));
    }
    case 'SCREEN_FLOW': {
      if (!srs.screens.length) throw noDiagramSource('No screens yet — add them on Requirements › Screens flow first.', 'Chưa có màn hình nào — thêm ở Requirements › Screens flow trước.', 'requirements');
      if (input.feature && !srs.screens.some((x) => (x.feature ?? '') === input.feature)) {
        throw noDiagramSource(`No screen belongs to feature "${input.feature}" — pick another feature or tag screens with it on Requirements.`, `Không có màn hình nào thuộc tính năng "${input.feature}" — chọn tính năng khác hoặc gắn tính năng cho màn hình ở Requirements.`, 'requirements');
      }
      return plain(screenFlowDiagram({ screens: srs.screens, links: srs.links, systemName, feature: input.feature }));
    }
    case 'ACTIVITY': {
      if (input.useCase) {
        const uc = needUc();
        const issueId = (await prisma.workUseCase.findUnique({ where: { id: uc.id }, select: { issueId: true } }))?.issueId ?? null;
        return plain(activityFromUc({ uc, actors: srs.actors, rules: srs.rules, systemName }), { useCaseId: uc.id, issueId });
      }
      const wf = await defaultWorkflow(projectId);
      const st = stateFromWorkflow(wf);
      const lines = st.mermaid.replace('stateDiagram-v2', 'flowchart LR').replace(/^\s*direction LR\n?/m, '').split('\n')
        .map((l) => l.replace(/^\s*state "([^"]+)" as (\S+)$/, '  $2["$1"]').replace(/^\s*\[\*\] --> (\S+)$/, '  START(( )) --> $1').replace(/^\s*(\S+) --> \[\*\]$/, '  $1 --> FINISH(((End)))').replace(/^\s*(\S+) --> (\S+) : (.+)$/, '  $1 -->|"$3"| $2'));
      return plain({ ...st, type: 'ACTIVITY', title: `Workflow activity — ${wf.name}`, mermaid: lines.join('\n'), structural: [/^(START|FINISH)$/] });
    }
    case 'STATE': {
      const entity = input.entities?.[0]?.trim();
      if (!entity || input.source === 'workflow') return plain(stateFromWorkflow(await defaultWorkflow(projectId)));
      const { handle, error } = await repoFor(projectId);
      if (!handle) throw noDiagramSource(`To draw the states of "${entity}", ${error}`, `Để vẽ trạng thái của "${entity}" cần kho mã của dự án (${error}) — kết nối GitHub/GitLab ở Cài đặt dự án, hoặc vẽ theo workflow.`, 'repo', 'WORK_DIAGRAM_NO_REPO');
      const prismaFiles = await readMany(handle, findPrisma(handle.paths), 3);
      const javaFiles = prismaFiles.length ? [] : await readMany(handle, findEntityCandidates(handle.paths), 80);
      const enums = [...prismaFiles.flatMap((f) => parsePrismaSchema(f.text, f.path).enums), ...parseJpaEntities(javaFiles).enums];
      const want = entity.toLowerCase().replace(/status$/, '');
      const en = enums.find((e) => e.name.toLowerCase() === entity.toLowerCase()) ?? enums.find((e) => e.name.toLowerCase() === `${want}status`) ?? enums.find((e) => e.name.toLowerCase().startsWith(want) && /status|state/i.test(e.name));
      if (!en) {
        const seen = enums.map((e) => e.name).slice(0, 10).join(', ');
        throw noDiagramSource(`No enum like "${entity}Status" found in ${handle.repo} (${seen || 'no enums'})`, `Không thấy enum kiểu "${entity}Status" trong ${handle.repo} (${seen || 'không có enum nào'}) — kiểm tra tên thực thể.`, 'repo');
      }
      const skeleton = stateSkeleton({ entity: en.name, values: en.values, file: `${en.file ?? handle.repo}` });
      if (!aiReady()) return plain({ ...skeleton, notes: ['AI is not available — only the states are drawn; add the transitions by hand.'] });
      const ask = await askerFor(userId, ctx);
      const corpus = srs.useCases.filter((u) => u.status !== 'PROPOSED').map((u) => `${ucKey(u.number)} ${u.name}\nNormal: ${u.normalFlow ?? ''}\nAlternative: ${u.alternativeFlows ?? ''}\nException: ${u.exceptionFlows ?? ''}`).join('\n\n').slice(0, 10_000)
        + `\n\nBusiness rules:\n${srs.rules.map((r) => `BR-${String(r.number).padStart(2, '0')} ${r.name}: ${r.definition ?? ''}`).join('\n').slice(0, 4000)}`;
      const r = await askJson(ask, statePrompt(en.name, en.values, corpus), stateOut, (o) => {
        const s = renderState(en.name, en.values, o, en.file ?? handle.repo);
        const built: BuiltDiagram = { ...skeleton, mermaid: s.mermaid, assumptions: [...(o.assumptions ?? []), ...s.assumed.map((x) => `Transition ${x} has no evidence in the use cases or rules`)], notes: s.dropped.length ? [`Dropped transitions to unknown states: ${s.dropped.join(', ')}`] : [] };
        const c = finalize(built);
        return { result: { built, c }, errors: c.errors };
      });
      return { built: r.result.built, check: r.result.c, usedAi: true, model: r.model, repaired: r.repaired, useCaseId: null, issueId: null };
    }
    case 'SEQUENCE': {
      const uc = needUc();
      const issueId = (await prisma.workUseCase.findUnique({ where: { id: uc.id }, select: { issueId: true } }))?.issueId ?? null;
      const baseline = sequenceFromUc({ uc, actors: srs.actors, rules: srs.rules, systemName });
      const minBranches = branchCount(uc);
      if (!aiReady()) {
        return { built: { ...baseline, notes: [...baseline.notes, 'AI is not available — this is a direct conversion of the use case flows.'] }, check: finalize(baseline, { minBranches }), usedAi: false, model: null, repaired: false, useCaseId: uc.id, issueId };
      }
      const ask = await askerFor(userId, ctx);
      const actorName = (id: number | null) => srs.actors.find((a) => a.id === id)?.name ?? null;
      const ucJson = JSON.stringify({
        id: ucKey(uc.number), name: uc.name, feature: uc.feature, primaryActor: actorName(uc.primaryActorId), secondaryActors: uc.secondaryActorIds.map(actorName).filter(Boolean),
        system: systemName, trigger: uc.trigger, preconditions: uc.preconditions, postconditions: uc.postconditions,
        normalFlow: uc.normalFlow, alternativeFlows: uc.alternativeFlows, exceptionFlows: uc.exceptionFlows,
        businessRules: uc.ruleNumbers.map((n) => srs.rules.find((r) => r.number === n)).filter(Boolean).map((r) => ({ id: `BR-${String(r!.number).padStart(2, '0')}`, name: r!.name, definition: r!.definition })),
      }, null, 1).slice(0, 14_000);
      const r = await askJson(ask, sequencePrompt({ ucJson, baseline: baseline.mermaid, branches: minBranches, systemName }), seqOut, (o) => {
        const s = renderSequence(o, baseline.title);
        const built: BuiltDiagram = { ...baseline, mermaid: s.mermaid, assumptions: [...(o.assumptions ?? []), ...s.assumedNames.map((n) => `"${n}" is not in the use case — marked as assumed`)], allowed: [...baseline.allowed] };
        const c = finalize(built, { minBranches });
        return { result: { built, c }, errors: c.errors };
      });
      return { built: r.result.built, check: r.result.c, usedAi: true, model: r.model, repaired: r.repaired, useCaseId: uc.id, issueId };
    }
    case 'ERD': {
      const order = input.source && input.source !== 'auto' ? [input.source] : ['repo', 'dictionary', 'docs'];
      const tried: string[] = [];
      for (const src of order) {
        if (src === 'repo') {
          const { handle, error } = await repoFor(projectId);
          if (!handle) { tried.push(`repository: ${error}`); continue; }
          const at = `${handle.repo}@${handle.branch}`;
          const pr = findPrisma(handle.paths);
          if (pr.length) {
            const [f] = await readMany(handle, pr.slice(0, 1), 1);
            if (f) {
              const dm = parsePrismaSchema(f.text, f.path);
              if (dm.tables.length) return plain(erdFromModel(dm, { title: input.title?.trim() || 'Entity relationship diagram', sourceLabel: `${f.path} @ ${at}`, entities: input.entities ?? undefined }));
            }
          }
          const sql = findSqlMigrations(handle.paths);
          if (sql.length) {
            const files = await readMany(handle, sql, 80);
            const dm = parseSqlDdl(files);
            if (dm.tables.length) return plain(erdFromModel(dm, { title: input.title?.trim() || 'Entity relationship diagram', sourceLabel: `${sql.length} SQL migration(s) (${sql[0].split('/').slice(0, -1).join('/')}) @ ${at}`, entities: input.entities ?? undefined }));
          }
          const ent = findEntityCandidates(handle.paths);
          if (ent.length) {
            const files = await readMany(handle, ent, 80);
            const dm = parseJpaEntities(files);
            if (dm.tables.length) return plain(erdFromModel(dm, { title: input.title?.trim() || 'Entity relationship diagram', sourceLabel: `JPA @Entity classes (${dm.tables.length}) @ ${at}`, entities: input.entities ?? undefined }));
          }
          tried.push(`repository ${at}: no schema.prisma, Flyway SQL or @Entity classes found`);
        } else if (src === 'dictionary') {
          const dd = await dataDictionary(projectId, ctx.access);
          if (dd) return plain(erdFromModel(dd.model, { title: input.title?.trim() || 'Entity relationship diagram', sourceLabel: `Data Dictionary — ${dd.page}`, entities: input.entities ?? undefined }));
          tried.push('Data Dictionary: no data structures in the Data Dictionary register and no page titled "Data Dictionary" with field tables');
        } else if (src === 'docs') {
          const corpus = await docsCorpus(projectId, ctx.access, /data|database|entity|erd|design|dictionary|report\s*[34]|sds|srs|csdl|cơ sở dữ liệu/i);
          if (!corpus.text) { tried.push('Docs: no document describes the data'); continue; }
          if (!aiReady()) throw new AppError('The AI assistant is temporarily unavailable — connect a repository or add a Data Dictionary page to draw the ERD without AI.', 503, 'WORK_AI_UNAVAILABLE');
          const ask = await askerFor(userId, ctx);
          const label = `Docs — ${corpus.pages.slice(0, 3).join(', ')}${corpus.pages.length > 3 ? ` +${corpus.pages.length - 3}` : ''}`;
          const r = await askJson(ask, erdPrompt(corpus.text, input.instruction), erdOut, (o) => {
            const b = renderErdFromOut(o, input.title?.trim() || 'Entity relationship diagram', label);
            const unknown = o.entities.filter((e) => !e.assumed && !corpus.text.toLowerCase().includes(e.name.toLowerCase().replace(/_/g, ' ')) && !corpus.text.toLowerCase().includes(e.name.toLowerCase()));
            const built: BuiltDiagram = { ...b, allowed: o.entities.filter((e) => !unknown.includes(e) && !e.assumed).map((e) => e.name), assumptions: [...(o.assumptions ?? []), ...o.entities.filter((e) => e.assumed).map((e) => `Entity "${e.name}" is assumed`)], sources: [{ kind: 'docs', label }] };
            const c = finalize(built);
            return { result: { built, c }, errors: c.errors };
          });
          return { built: r.result.built, check: r.result.c, usedAi: true, model: r.model, repaired: r.repaired, useCaseId: null, issueId: null };
        }
      }
      throw noDiagramSource(`No data model to draw from. Tried — ${tried.join(' · ')}`, 'Chưa có mô hình dữ liệu để vẽ ERD — kết nối kho mã (schema.prisma / SQL migration / @Entity), hoặc thêm Data Dictionary, hoặc viết trang Docs mô tả dữ liệu.', 'docs');
    }
    case 'CLASS': {
      const { handle, error } = await repoFor(projectId);
      if (!handle) throw noDiagramSource(`A class diagram is drawn from the code: ${error}`, `Sơ đồ lớp được dựng từ mã nguồn — chưa có kho mã (${error}). Kết nối GitHub/GitLab ở Cài đặt dự án trước.`, 'repo', 'WORK_DIAGRAM_NO_REPO');
      const filter = input.feature ?? input.entities?.[0] ?? null;
      const files = await readMany(handle, findClassCandidates(handle.paths, filter), 60);
      const classes = parseClasses(files);
      if (!classes.length) throw noDiagramSource(`No Java/TypeScript classes found in ${handle.repo}${filter ? ` matching "${filter}"` : ''}`, `Không thấy lớp Java/TypeScript nào trong ${handle.repo}${filter ? ` khớp "${filter}"` : ''}.`, 'repo');
      return plain({ ...classDiagram(classes, { title: input.title?.trim() || `Class diagram${filter ? ` — ${filter}` : ''}`, sourceLabel: `${files.length} file(s) @ ${handle.repo}@${handle.branch}`, filter }), feature: input.feature ?? null });
    }
    case 'DEPLOYMENT':
    case 'ARCHITECTURE':
    case 'DATA_FLOW': {
      const { handle } = await repoFor(projectId);
      let composeText = '';
      let composePath = '';
      if (handle) {
        const c = findCompose(handle.paths);
        if (c.length) { const [f] = await readMany(handle, c.slice(0, 1), 1); if (f) { composeText = f.text; composePath = f.path; } }
      }
      if (input.type === 'DEPLOYMENT' && composeText && !input.instruction) {
        const svc = parseCompose(composeText);
        if (svc.length) return plain(deploymentFromCompose(svc, { file: composePath, repo: `${handle!.repo}@${handle!.branch}` }));
      }
      const corpus = await docsCorpus(projectId, ctx.access, /architect|deploy|infra|design|system|report\s*[34]|sds|kiến trúc|triển khai/i);
      const facts = [
        composeText ? `docker-compose (${composePath}):\n${composeText.slice(0, 4000)}` : '',
        `Actors: ${srs.actors.map((a) => `${a.name} (${a.kind === 'SYSTEM' ? 'external system' : 'user'})`).join(', ') || 'none'}`,
        `System: ${systemName}`,
        corpus.text,
      ].filter(Boolean).join('\n\n');
      if (!corpus.text && !composeText) throw noDiagramSource('Nothing describes the architecture yet — write Report 4 §1.1 (Software Architecture) or connect a repository with a docker-compose file', 'Chưa có gì mô tả kiến trúc — viết Report 4 §1.1 (Software Architecture) trong Docs, hoặc kết nối kho mã có tệp docker-compose.', 'docs');
      if (!aiReady()) throw new AppError('The AI assistant is temporarily unavailable. Please try again later.', 503, 'WORK_AI_UNAVAILABLE');
      const ask = await askerFor(userId, ctx);
      const kind = input.type;
      const title = input.title?.trim() || `${DIAGRAM_TYPE_LABEL[kind]} diagram`;
      const label = [composePath && `${composePath} @ ${handle?.repo}`, ...corpus.pages.slice(0, 3)].filter(Boolean).join(', ');
      const svcNames = parseCompose(composeText).map((s) => s.name);
      const r = await askJson(ask, graphPrompt(kind, facts, input.instruction), graphOut, (o) => {
        const g = renderGraph(o, `${title} — source: ${label}`);
        const allowed = [systemName, ...srs.actors.map((a) => a.name), ...svcNames, ...o.nodes.filter((n) => !n.assumed && facts.toLowerCase().includes(n.label.toLowerCase())).map((n) => n.label)];
        const built: BuiltDiagram = { type: kind, title, mermaid: g.mermaid, sources: [{ kind: composeText ? 'repo+docs' : 'docs', label }], allowed, structural: [/^G_/], assumptions: [...(o.assumptions ?? []), ...g.assumedNames.map((n) => `"${n}" is assumed`)], notes: [] };
        const c = finalize(built);
        return { result: { built, c }, errors: c.errors };
      });
      return { built: r.result.built, check: r.result.c, usedAi: true, model: r.model, repaired: r.repaired, useCaseId: null, issueId: null };
    }
    default:
      throw new BadRequestError(`CT Work cannot draw ${String(input.type)} diagrams from project data yet`, 'VALIDATION_ERROR');
  }
}

async function defaultWorkflow(projectId: number) {
  const wf = await prisma.workWorkflow.findFirst({ where: { projectId }, orderBy: [{ isDefault: 'desc' }, { id: 'asc' }], select: { name: true, statuses: { select: { id: true, name: true, category: true, position: true } }, transitions: { select: { fromStatusId: true, toStatusId: true, name: true } } } });
  if (!wf) throw noDiagramSource('This project has no workflow — set one up in Project settings › Workflow first.', 'Dự án chưa có workflow — tạo ở Cài đặt dự án › Workflow trước.', 'workflow');
  return wf;
}

/**
 * AI vẽ từ dữ liệu dự án ⇒ sơ đồ PROPOSED (hoặc phiên bản PROPOSED của D-n khi `update`). Trả kết quả kiểm để người duyệt
 * thấy: nguồn đã dùng, giả định, thực thể không có nguồn (đã gắn "(assumed)").
 */
export async function generateDiagram(userId: number, projectId: number, input: GenerateInput) {
  const ctx = await diagramCtx(userId, projectId, 'edit');
  const g = await buildFor(userId, projectId, ctx, input);
  if (!g.check.ok) throw new AppError(`The diagram failed CT Work's checks: ${g.check.errors.slice(0, 4).join(' · ')}`, 422, 'WORK_DIAGRAM_CHECK_FAILED', { errors: g.check.errors });
  let mermaid = g.built.mermaid;
  const flagged = g.check.unknown.filter((u) => !isAssumedLabel(u.label));
  if (flagged.length) mermaid = markAssumed(mermaid, flagged.map((u) => u.id));
  const after = lintMermaid(mermaid);
  if (!after.ok) throw new AppError(`The diagram failed CT Work's checks: ${after.errors.slice(0, 3).map((e) => `line ${e.line}: ${e.message}`).join(' · ')}`, 422, 'WORK_DIAGRAM_CHECK_FAILED', { errors: after.errors });
  const assumptions = [...g.built.assumptions, ...flagged.map((u) => `"${u.label}" is not in the project data — marked "(assumed)"`)];
  const origin: Origin = {
    generator: g.usedAi ? 'ai' : 'data', model: g.model, type: g.built.type, sources: g.built.sources, assumptions, notes: g.built.notes,
    checks: { ok: true, checked: g.check.checked, unknown: flagged.map((u) => u.label), repaired: g.repaired, syntax: 'ok' }, at: new Date().toISOString(),
  };
  const issueNumber = input.issueNumber ?? (g.issueId ? (await prisma.workIssue.findUnique({ where: { id: g.issueId }, select: { number: true, deletedAt: true } }).then((i) => (i && !i.deletedAt ? i.number : null))) : null);
  const ucNumber = g.useCaseId ? (await prisma.workUseCase.findUnique({ where: { id: g.useCaseId }, select: { number: true } }))?.number ?? null : null;
  const note = `${g.usedAi ? 'AI' : 'CT Work'} drew this from ${g.built.sources.map((s) => s.label).join('; ').slice(0, 220)}`;
  let result;
  if (input.update) {
    const d = await findDiagram(projectId, input.update);
    if (d.format !== 'MERMAID') throw new BadRequestError('Only Mermaid diagrams can be redrawn by AI', 'WORK_DIAGRAM_BAD_SOURCE');
    // Người gọi là NGƯỜI ⇒ vẫn là ĐỀ XUẤT (phiên bản PROPOSED) để người duyệt so sánh rồi nhận.
    const v = await proposeVersion(userId, d, mermaid, note, origin, g.model);
    result = { ...(await getDiagram(userId, projectId, d.number)), proposedVersion: v };
  } else {
    result = await createDiagram(userId, projectId, {
      format: 'MERMAID', type: g.built.type, title: input.title?.trim() || g.built.title, feature: input.feature ?? g.built.feature ?? null,
      source: mermaid, useCase: ucNumber, issueNumber, note, origin,
    }, { propose: true, aiModel: g.model ?? (g.usedAi ? 'ai' : 'ct-work') });
  }
  await auditProject(projectId, { actorId: userId, action: 'diagram.generate', targetType: 'project', targetId: projectId, summary: `Generated a ${DIAGRAM_TYPE_LABEL[g.built.type].toLowerCase()} diagram (${g.usedAi ? 'AI' : 'from data'})` });
  return {
    diagram: result,
    check: { ok: true, sources: g.built.sources, assumptions, notes: g.built.notes, unknown: flagged.map((u) => u.label), usedAi: g.usedAi, repaired: g.repaired, model: g.model },
  };
}

async function proposeVersion(userId: number, d: Row, source: string, note: string, origin: Origin, model: string | null): Promise<number> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(31052::int, ${d.id}::int)`;
    const agg = await tx.workDiagramVersion.aggregate({ where: { diagramId: d.id }, _max: { number: true } });
    const n = (agg._max.number ?? 0) + 1;
    await tx.workDiagramVersion.create({ data: { diagramId: d.id, number: n, source, note: note.slice(0, 300), state: 'PROPOSED', origin: origin as Prisma.InputJsonValue, authorId: userId, aiModel: model } });
    await tx.workDiagram.update({ where: { id: d.id }, data: { rev: { increment: 1 } } });
    return n;
  });
}

/** Tóm tắt cho MCP/Ask AI/agent: sơ đồ + nguồn hiện hành + kết quả kiểm. */
export async function diagramForAi(userId: number, projectId: number, number: number) {
  const d = await getDiagram(userId, projectId, number);
  return {
    key: d.key, title: d.title, type: d.type, format: d.format, status: d.status, version: d.currentVersion, approvedVersion: d.approvedVersion,
    feature: d.feature, useCase: d.useCase?.key ?? null, issue: d.issue?.key ?? null, page: d.page ? `Doc ${d.page.number}` : null,
    source: d.format === 'MERMAID' ? d.source : `(Excalidraw drawing, ${d.source.length} characters of JSON — not shown)`,
    lint: d.lint ? { ok: d.lint.ok, errors: d.lint.errors.slice(0, 5) } : null,
    origin: d.origin ? { generator: d.origin.generator, sources: d.origin.sources, assumptions: d.origin.assumptions } : null,
    pendingProposals: d.proposals.map((p) => p.number), openComments: d.comments.filter((c) => !c.resolved).map((c) => ({ by: c.author?.name ?? null, anchor: c.anchor, body: c.body.slice(0, 300) })),
  };
}

export { aiReady as _aiReadyForTests };
