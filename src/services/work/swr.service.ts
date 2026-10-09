/**
 * CT Work — CTW đợt 4b (10/10/2026): SWR302 — phần có DB. Luật thuần + dựng nội dung/xlsx ở swr.ts.
 *
 *   R5  Sổ Feature FE-n (mã tự tăng) + liên kết tới UC / thẻ yêu cầu / epic.
 *   R6  Thẻ REQUIREMENT: loại (Business/User/Functional/Quality/Constraint/External interface/Data) + nhóm chất lượng /
 *       loại giao tiếp + thuộc tính (priority, source, owner, rationale, stability, version) + vòng đời — mỗi thay đổi một
 *       dòng work_history của thẻ ("changed the Requirement status from Proposed to Approved" trong Activity).
 *   R12 Bảng ưu tiên Wiegers (dòng = FE-n hoặc UC-nn đang có) + trọng số dự án; xuất xlsx đúng sheet Template.
 *   R16 Glossary + Data Dictionary; Diagram Studio đọc DD làm nguồn ERD ("dictionary").
 *   R23 Sáu liên kết người chấm dò — bảng kiểm tự động + chỗ đứt; có sheet trong RTM .xlsx.
 *   R4/R25 Năm mẫu Wiegers (V&S, Use Cases, Business Rules, SRS, Data Dictionary): điền trang Docs (một phiên bản mới) /
 *       xuất .docx/.pdf điền sẵn trong bộ nhớ.
 *
 * Quyền như SRS đợt 4 (`srsCtx`): xem = đội dự án + giảng viên; sửa = issue.edit; agent không xoá, không đổi vòng đời,
 * không đổi trọng số/cấu hình; duyệt vòng đời (Approved/Verified/Rejected/Deleted) = người ADMIN/MEMBER/TEACHER.
 */

import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { displayName } from './common.js';
import { erdFromModel } from './diagramGen.js';
import type { PmNode } from './docMarkdown.js';
import { renderDocx, renderPdf, type ExportMeta } from './docExport.js';
import { decodeDiagram } from './docs3a.service.js';
import { getTemplate } from './docTemplates.js';
import { emitWorkEvent } from './events.js';
import { parseIssueRef } from './issueRefs.js';
import { createPage, docCtx, getPage, updatePage } from './pages.service.js';
import { refNumber, ucKey, inDocument } from './srs.js';
import { loadSrs, projectImage, srsCtx } from './srs.service.js';
import {
  applyVisionScopeFill, applyWiegersFill, canMove, computePriorities, COUNT_KEYS, ddSheets, DEFAULT_WEIGHTS, ddToDataModel, featureSheet,
  DATA_KINDS, featureUseCases, feKey, feNumber, glossarySheet, INTERFACE_KINDS, isLive, LIFECYCLE, LIFECYCLE_LABEL, LIFECYCLE_NEXT, nounsWithoutDd,
  PRIORITY3, prioritySheets, QUALITY_ATTRS, REQ_TYPE_LABEL, REQ_TYPES, sixLinks, sixLinksSheet, sortReleases, undefinedComponents,
  WIEGERS_DOCS, type CountKey, type DataElementLite, type FeatureLinkLite, type FeatureLite, type Lifecycle, type RaidLite,
  type ReqType, type RevisionRow, type VsSection, type WiegersData, type WiegersDoc,
} from './swr.js';
import { writeXlsx } from './xlsxStyled.js';

type Tx = Prisma.TransactionClient;
const clean = (s: string | null | undefined, n: number) => { const v = (s ?? '').trim(); return v ? v.slice(0, n) : null; };
const touch = (projectId: number, userId: number) => emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
const view = (u: number, p: number) => srsCtx(u, p, 'view');
async function edit(u: number, p: number, opts: { noAgent?: string } = {}) {
  const ctx = await srsCtx(u, p, 'edit');
  if (opts.noAgent && ctx.isAgent) throw new ForbiddenError(opts.noAgent);
  return ctx;
}

async function projectInfo(projectId: number) {
  return prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true, workspace: { select: { slug: true } } } });
}

/** Số thẻ / "KEY-12" ⇒ thẻ của dự án (null = bỏ gắn). */
async function issueByRef(projectId: number, ref: unknown, field: string): Promise<{ id: number; number: number; typeKey: string } | null> {
  if (ref === null) return null;
  const p = parseIssueRef(ref);
  if (!p) throw new BadRequestError(`${field}: "${String(ref)}" is not an issue (use 12 or "KEY-12")`, 'VALIDATION_ERROR');
  const i = await prisma.workIssue.findFirst({ where: { projectId, number: p.number, deletedAt: null }, select: { id: true, number: true, type: { select: { key: true } } } });
  if (!i) throw new BadRequestError(`${field}: issue ${p.number} not found in this project`, 'WORK_BAD_ISSUE');
  return { id: i.id, number: i.number, typeKey: i.type.key };
}

// ─── R5 Feature ──────────────────────────────────────────────────

export const featureInput = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().max(8000).nullable().optional(),
  scope: z.enum(['IN', 'OUT']).optional(),
  priority: z.enum(PRIORITY3).nullable().optional(),
  /** Bản phát hành (WorkVersion.id) — null = chưa xếp. */
  versionId: z.number().int().positive().nullable().optional(),
  /** Epic hiện thực feature (số thẻ hoặc "KEY-12"). */
  epic: z.union([z.number().int().positive(), z.string().max(30)]).nullable().optional(),
  position: z.number().int().min(0).max(10_000).optional(),
});
export type FeatureInput = z.infer<typeof featureInput>;

async function loadFeatures(projectId: number) {
  const rows = await prisma.workFeature.findMany({ where: { projectId }, orderBy: [{ number: 'asc' }], include: { links: true } });
  const features: FeatureLite[] = rows.map((f) => ({ id: f.id, number: f.number, name: f.name, description: f.description, scope: f.scope, priority: f.priority, versionId: f.versionId, epicIssueId: f.epicIssueId, position: f.position }));
  const links: Array<FeatureLinkLite & { id: number }> = rows.flatMap((f) => f.links.map((l) => ({ id: l.id, featureId: f.id, kind: l.kind, targetId: l.targetId })));
  return { rows, features, links };
}

async function assertVersion(projectId: number, versionId: number | null | undefined) {
  if (!versionId) return;
  if (!(await prisma.workVersion.count({ where: { id: versionId, projectId } }))) throw new BadRequestError('Release (version) not found in this project', 'WORK_BAD_VERSION');
}

export async function listFeatures(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const [{ features, links }, srs, versions, issues] = await Promise.all([
    loadFeatures(projectId),
    loadSrs(projectId),
    prisma.workVersion.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, name: true, releaseDate: true, status: true, position: true } }),
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null }, select: { id: true, number: true, title: true, parentId: true, type: { select: { key: true } } }, take: 5000 }),
  ]);
  const ucs = inDocument(srs.useCases);
  const feUc = featureUseCases(features, links, srs.useCases);
  const issueById = new Map(issues.map((i) => [i.id, i]));
  const ver = new Map(versions.map((v) => [v.id, v]));
  return {
    key: srs.key,
    canEdit: ctx.canEdit,
    releases: versions,
    features: features.map((f) => {
      const ucIds = feUc.get(f.id) ?? [];
      const manual = new Set(links.filter((l) => l.featureId === f.id && l.kind === 'UC').map((l) => l.targetId));
      const epic = f.epicIssueId ? issueById.get(f.epicIssueId) ?? null : null;
      return {
        ...f, key: feKey(f.number), release: f.versionId ? ver.get(f.versionId)?.name ?? null : null,
        epic: epic ? { number: epic.number, key: `${srs.key}-${epic.number}`, title: epic.title } : null,
        useCases: ucIds.map((id) => srs.useCases.find((u) => u.id === id)!).filter(Boolean).map((u) => ({ number: u.number, key: ucKey(u.number), name: u.name, status: u.status, manual: manual.has(u.id), linkId: links.find((l) => l.featureId === f.id && l.kind === 'UC' && l.targetId === u.id)?.id ?? null })),
        issues: links.filter((l) => l.featureId === f.id && l.kind === 'ISSUE').map((l) => issueById.get(l.targetId) ? { linkId: l.id, number: issueById.get(l.targetId)!.number, key: `${srs.key}-${issueById.get(l.targetId)!.number}`, title: issueById.get(l.targetId)!.title, type: issueById.get(l.targetId)!.type.key } : null).filter(Boolean),
        realized: ucIds.some((id) => ucs.some((u) => u.id === id)),
      };
    }),
  };
}

export async function createFeature(userId: number, projectId: number, input: FeatureInput) {
  await edit(userId, projectId);
  await assertVersion(projectId, input.versionId);
  const epic = input.epic !== undefined ? await issueByRef(projectId, input.epic, 'epic') : null;
  const f = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(31043::int, ${projectId}::int)`;
    if (await tx.workFeature.findFirst({ where: { projectId, name: { equals: input.name.trim(), mode: 'insensitive' } }, select: { id: true } })) throw new ConflictError(`A feature called "${input.name.trim()}" already exists`);
    const agg = await tx.workFeature.aggregate({ where: { projectId }, _max: { number: true, position: true } });
    return tx.workFeature.create({
      data: {
        projectId, number: (agg._max.number ?? 0) + 1, name: input.name.trim(), description: clean(input.description, 8000), scope: input.scope ?? 'IN',
        priority: input.priority ?? null, versionId: input.versionId ?? null, epicIssueId: epic?.id ?? null, position: input.position ?? (agg._max.position ?? -1) + 1, createdById: userId,
      },
    });
  });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.feature.create', targetType: 'feature', targetId: f.id, summary: `Added ${feKey(f.number)}: ${f.name}`.slice(0, 300) });
  return { ...f, key: feKey(f.number) };
}

async function featureByNo(projectId: number, ref: unknown) {
  const n = feNumber(ref);
  const f = n ? await prisma.workFeature.findFirst({ where: { projectId, number: n } }) : null;
  if (!f) throw new NotFoundError(`Feature ${String(ref)} not found`);
  return f;
}

export async function updateFeature(userId: number, projectId: number, ref: number | string, input: Partial<FeatureInput> & { rev?: number }) {
  await edit(userId, projectId);
  const cur = await featureByNo(projectId, ref);
  await assertVersion(projectId, input.versionId);
  const epic = input.epic !== undefined ? await issueByRef(projectId, input.epic, 'epic') : undefined;
  if (input.name && input.name.trim().toLowerCase() !== cur.name.toLowerCase()
    && await prisma.workFeature.findFirst({ where: { projectId, id: { not: cur.id }, name: { equals: input.name.trim(), mode: 'insensitive' } }, select: { id: true } })) {
    throw new ConflictError(`A feature called "${input.name.trim()}" already exists`);
  }
  const r = await prisma.workFeature.updateMany({
    where: { id: cur.id, ...(input.rev !== undefined ? { rev: input.rev } : {}) },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.description !== undefined ? { description: clean(input.description, 8000) } : {}),
      ...(input.scope !== undefined ? { scope: input.scope } : {}),
      ...(input.priority !== undefined ? { priority: input.priority } : {}),
      ...(input.versionId !== undefined ? { versionId: input.versionId } : {}),
      ...(epic !== undefined ? { epicIssueId: epic?.id ?? null } : {}),
      ...(input.position !== undefined ? { position: input.position } : {}),
      rev: { increment: 1 },
    },
  });
  if (!r.count) throw new ConflictError('Someone else changed this feature — reload to see their version');
  touch(projectId, userId);
  const f = await prisma.workFeature.findUniqueOrThrow({ where: { id: cur.id } });
  return { ...f, key: feKey(f.number) };
}

export async function deleteFeature(userId: number, projectId: number, ref: number | string) {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot delete features' });
  const cur = await featureByNo(projectId, ref);
  await prisma.$transaction([
    prisma.workPriorityRow.deleteMany({ where: { projectId, targetKind: 'FE', targetId: cur.id } }),
    prisma.workFeature.delete({ where: { id: cur.id } }),
  ]);
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.feature.delete', targetType: 'feature', targetId: cur.id, summary: `Deleted ${feKey(cur.number)}: ${cur.name}`.slice(0, 300) });
  return { deleted: true };
}

export const featureLinkInput = z.object({ kind: z.enum(['UC', 'ISSUE']), ref: z.union([z.number().int().positive(), z.string().min(1).max(30)]) });

export async function linkFeature(userId: number, projectId: number, ref: number | string, input: z.infer<typeof featureLinkInput>) {
  await edit(userId, projectId);
  const f = await featureByNo(projectId, ref);
  let targetId: number;
  if (input.kind === 'UC') {
    const n = refNumber(input.ref, 'UC');
    const uc = n ? await prisma.workUseCase.findFirst({ where: { projectId, number: n }, select: { id: true } }) : null;
    if (!uc) throw new BadRequestError(`Use case ${String(input.ref)} not found`, 'WORK_BAD_UC');
    targetId = uc.id;
  } else {
    targetId = (await issueByRef(projectId, input.ref, 'ref'))!.id;
  }
  const l = await prisma.workFeatureLink.upsert({
    where: { uk_work_feature_link: { featureId: f.id, kind: input.kind, targetId } },
    create: { featureId: f.id, kind: input.kind, targetId }, update: {},
  });
  touch(projectId, userId);
  return { id: l.id, feature: feKey(f.number), kind: l.kind, targetId };
}

export async function unlinkFeature(userId: number, projectId: number, ref: number | string, linkId: number) {
  await edit(userId, projectId);
  const f = await featureByNo(projectId, ref);
  const r = await prisma.workFeatureLink.deleteMany({ where: { id: linkId, featureId: f.id } });
  if (!r.count) throw new NotFoundError('Link not found');
  touch(projectId, userId);
  return { removed: true };
}

// ─── R6 Phân loại + thuộc tính + vòng đời ────────────────────────

export const requirementInput = z.object({
  reqType: z.enum(REQ_TYPES).optional(),
  subtype: z.string().max(24).nullable().optional(),
  priority: z.enum(PRIORITY3).nullable().optional(),
  source: z.string().max(300).nullable().optional(),
  ownerId: z.number().int().positive().nullable().optional(),
  rationale: z.string().max(8000).nullable().optional(),
  stability: z.enum(PRIORITY3).nullable().optional(),
  reqVersion: z.number().int().min(0).optional(),
});
export type RequirementInput = z.infer<typeof requirementInput>;

function checkSubtype(type: ReqType, subtype: string | null | undefined): string | null {
  if (!subtype) return null;
  const s = subtype.toUpperCase();
  if (type === 'QUALITY' && (QUALITY_ATTRS as readonly string[]).includes(s)) return s;
  if (type === 'EXTERNAL_INTERFACE' && (INTERFACE_KINDS as readonly string[]).includes(s)) return s;
  if (type === 'DATA' && (DATA_KINDS as readonly string[]).includes(s)) return s;
  if (type !== 'QUALITY' && type !== 'EXTERNAL_INTERFACE' && type !== 'DATA') return null;
  throw new BadRequestError(type === 'QUALITY' ? `Quality attribute must be one of ${QUALITY_ATTRS.join(', ')}` : type === 'DATA' ? `Data requirement kind must be one of ${DATA_KINDS.join(', ')}` : `Interface must be one of ${INTERFACE_KINDS.join(', ')}`, 'VALIDATION_ERROR');
}

async function requirementIssue(projectId: number, num: number) {
  const i = await prisma.workIssue.findFirst({ where: { projectId, number: num, deletedAt: null }, select: { id: true, number: true, title: true, type: { select: { key: true } }, requirementInfo: true } });
  if (!i) throw new NotFoundError('Issue not found');
  if (i.type.key !== 'REQUIREMENT') throw new BadRequestError('Only Requirement issues carry a requirement type and lifecycle', 'WORK_NOT_REQUIREMENT');
  return i;
}

const HIST: Record<string, string> = {
  reqType: 'Requirement type', subtype: 'Requirement category', priority: 'Requirement priority', source: 'Requirement source',
  ownerId: 'Requirement owner', rationale: 'Requirement rationale', stability: 'Requirement stability', lifecycle: 'Requirement status',
};
const labelOf = (field: string, v: unknown): string | null => {
  if (v === null || v === undefined || v === '') return null;
  if (field === 'reqType') return REQ_TYPE_LABEL[v as ReqType] ?? String(v);
  if (field === 'lifecycle') return LIFECYCLE_LABEL[v as Lifecycle] ?? String(v);
  if (field === 'rationale') return String(v).slice(0, 200);
  const s = String(v);
  return /^[A-Z_]+$/.test(s) ? s.charAt(0) + s.slice(1).toLowerCase().replace(/_/g, ' ') : s;
};

async function writeHistory(tx: Tx, issueId: number, userId: number, kind: string, changes: Array<[string, unknown, unknown]>) {
  const rows = changes.filter(([, a, b]) => (a ?? null) !== (b ?? null)).map(([f, a, b]) => ({
    issueId, actorId: userId, actorKind: kind, field: HIST[f] ?? f,
    fromValue: f === 'ownerId' ? (a ? String(a) : null) : labelOf(f, a), toValue: f === 'ownerId' ? (b ? String(b) : null) : labelOf(f, b),
  }));
  if (rows.length) await tx.workHistory.createMany({ data: rows });
  return rows.length;
}

/** Ghi thuộc tính (chưa có ⇒ tạo, mặc định FUNCTIONAL + PROPOSED). Khoá lạc quan bằng reqVersion. */
export async function setRequirementInfo(userId: number, projectId: number, num: number, input: RequirementInput) {
  const ctx = await edit(userId, projectId);
  const iss = await requirementIssue(projectId, num);
  const cur = iss.requirementInfo;
  const type = (input.reqType ?? cur?.reqType ?? 'FUNCTIONAL') as ReqType;
  const subtype = input.subtype !== undefined || input.reqType !== undefined ? checkSubtype(type, input.subtype !== undefined ? input.subtype : cur?.subtype) : cur?.subtype ?? null;
  if (input.ownerId) {
    const m = await prisma.workProjectMember.count({ where: { projectId, userId: input.ownerId } });
    if (!m) throw new BadRequestError('The owner must be a member of this project', 'VALIDATION_ERROR');
  }
  const next = {
    reqType: type, subtype,
    priority: input.priority !== undefined ? input.priority : cur?.priority ?? null,
    source: input.source !== undefined ? clean(input.source, 300) : cur?.source ?? null,
    ownerId: input.ownerId !== undefined ? input.ownerId : cur?.ownerId ?? null,
    rationale: input.rationale !== undefined ? clean(input.rationale, 8000) : cur?.rationale ?? null,
    stability: input.stability !== undefined ? input.stability : cur?.stability ?? null,
  };
  await prisma.$transaction(async (tx) => {
    if (!cur) {
      await tx.workRequirementInfo.create({ data: { issueId: iss.id, projectId, ...next, lifecycle: 'PROPOSED', reqVersion: 1 } });
      await writeHistory(tx, iss.id, userId, ctx.isAgent ? 'AGENT' : 'USER', [['reqType', null, next.reqType], ['lifecycle', null, 'PROPOSED']]);
      return;
    }
    const changes: Array<[string, unknown, unknown]> = (Object.keys(next) as Array<keyof typeof next>).map((k) => [k, cur[k], next[k]]);
    const n = changes.filter(([, a, b]) => (a ?? null) !== (b ?? null)).length;
    if (!n) return;
    const r = await tx.workRequirementInfo.updateMany({ where: { issueId: iss.id, ...(input.reqVersion !== undefined ? { reqVersion: input.reqVersion } : {}) }, data: { ...next, reqVersion: { increment: 1 } } });
    if (!r.count) throw new ConflictError('Someone else changed this requirement — reload to see their version');
    await writeHistory(tx, iss.id, userId, ctx.isAgent ? 'AGENT' : 'USER', changes);
  });
  touch(projectId, userId);
  return getRequirement(userId, projectId, num);
}

/** Chuyển vòng đời theo LIFECYCLE_NEXT. Approved/Verified/Rejected/Deleted cần người duyệt (không phải agent). */
export async function setLifecycle(userId: number, projectId: number, num: number, to: Lifecycle, note?: string | null) {
  // Duyệt / kiểm chứng / bác / bỏ = quyết định của NGƯỜI (ADMIN/MEMBER/TEACHER — giảng viên duyệt được dù không sửa thẻ);
  // đánh dấu đã hiện thực / mở lại = người sửa được. Agent không đổi vòng đời ở đường nào.
  const needsReview = to !== 'IMPLEMENTED' && to !== 'PROPOSED';
  const ctx = await srsCtx(userId, projectId, 'view');
  if (ctx.isAgent) throw new ForbiddenError('An AI agent cannot change the status of a requirement — a person reviews it');
  if (needsReview && !ctx.canApprove) throw new ForbiddenError('Only project members and lecturers can approve, verify, reject or delete requirements');
  if (!needsReview && !ctx.canEdit) throw new ForbiddenError('You can read the requirements but not change them');
  const iss = await requirementIssue(projectId, num);
  const from = (iss.requirementInfo?.lifecycle ?? 'PROPOSED') as Lifecycle;
  if (from === to) return getRequirement(userId, projectId, num);
  if (!canMove(from, to)) {
    throw new BadRequestError(`A requirement cannot go from ${LIFECYCLE_LABEL[from]} to ${LIFECYCLE_LABEL[to]} — next: ${LIFECYCLE_NEXT[from].map((x) => LIFECYCLE_LABEL[x]).join(', ')}`, 'WORK_REQ_LIFECYCLE');
  }
  await prisma.$transaction(async (tx) => {
    if (!iss.requirementInfo) await tx.workRequirementInfo.create({ data: { issueId: iss.id, projectId, lifecycle: to } });
    else await tx.workRequirementInfo.update({ where: { issueId: iss.id }, data: { lifecycle: to, reqVersion: { increment: 1 } } });
    await writeHistory(tx, iss.id, userId, 'USER', [['lifecycle', from, to]]);
    if (note?.trim()) await tx.workHistory.create({ data: { issueId: iss.id, actorId: userId, actorKind: 'USER', field: 'Requirement status note', toValue: note.trim().slice(0, 500) } });
  });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.req.lifecycle', targetType: 'issue', targetId: iss.id, summary: `${iss.title}: ${LIFECYCLE_LABEL[from]} → ${LIFECYCLE_LABEL[to]}`.slice(0, 300) });
  return getRequirement(userId, projectId, num);
}

const REQ_SELECT = {
  id: true, number: true, title: true, descriptionText: true, parentId: true, fixVersionId: true,
  status: { select: { name: true, category: true } }, requirementInfo: true,
} as const;

function reqView(key: string, i: { id: number; number: number; title: string; descriptionText: string | null; parentId: number | null; fixVersionId: number | null; status: { name: string; category: string }; requirementInfo: { reqType: string; subtype: string | null; priority: string | null; lifecycle: string; source: string | null; ownerId: number | null; rationale: string | null; stability: string | null; reqVersion: number; updatedAt: Date } | null }) {
  const r = i.requirementInfo;
  return {
    issueId: i.id, number: i.number, key: `${key}-${i.number}`, title: i.title, text: (i.descriptionText ?? '').slice(0, 600), parentId: i.parentId,
    status: i.status, classified: !!r,
    reqType: r?.reqType ?? null, subtype: r?.subtype ?? null, priority: r?.priority ?? null, lifecycle: r?.lifecycle ?? 'PROPOSED',
    source: r?.source ?? null, ownerId: r?.ownerId ?? null, rationale: r?.rationale ?? null, stability: r?.stability ?? null,
    reqVersion: r?.reqVersion ?? 0, updatedAt: r?.updatedAt ?? null, next: LIFECYCLE_NEXT[(r?.lifecycle ?? 'PROPOSED') as Lifecycle],
  };
}

export async function listRequirements(userId: number, projectId: number, q: { type?: string; lifecycle?: string; q?: string } = {}) {
  const ctx = await view(userId, projectId);
  const { key } = await projectInfo(projectId);
  const rows = await prisma.workIssue.findMany({ where: { projectId, deletedAt: null, type: { key: 'REQUIREMENT' } }, orderBy: { number: 'asc' }, take: 2000, select: REQ_SELECT });
  const all = rows.map((i) => reqView(key, i));
  const text = q.q?.trim().toLowerCase();
  const list = all.filter((r) => (!q.type || (q.type === 'UNCLASSIFIED' ? !r.classified : r.reqType === q.type)) && (!q.lifecycle || r.lifecycle === q.lifecycle) && (!text || `${r.key} ${r.title} ${r.text}`.toLowerCase().includes(text)));
  const members = await prisma.workProjectMember.findMany({ where: { projectId, user: { kind: { not: 'AGENT' } } }, select: { userId: true, user: { select: { username: true, fullName: true, displayName: true } } } });
  const byType = Object.fromEntries(REQ_TYPES.map((t) => [t, all.filter((r) => r.reqType === t).length])) as Record<ReqType, number>;
  const byLifecycle = Object.fromEntries(LIFECYCLE.map((t) => [t, all.filter((r) => r.lifecycle === t).length])) as Record<Lifecycle, number>;
  return {
    key, canEdit: ctx.canEdit, canApprove: ctx.canApprove, requirements: list,
    counts: { total: all.length, unclassified: all.filter((r) => !r.classified).length, byType, byLifecycle },
    owners: members.map((m) => ({ id: m.userId, name: displayName(m.user) })),
    qualityAttrs: QUALITY_ATTRS, interfaceKinds: INTERFACE_KINDS, dataKinds: DATA_KINDS,
  };
}

export async function getRequirement(userId: number, projectId: number, num: number) {
  await view(userId, projectId);
  const { key } = await projectInfo(projectId);
  const i = await prisma.workIssue.findFirst({ where: { projectId, number: num, deletedAt: null, type: { key: 'REQUIREMENT' } }, select: REQ_SELECT });
  if (!i) throw new NotFoundError('Requirement not found');
  return reqView(key, i);
}

/** Lịch sử thuộc tính/vòng đời của một yêu cầu (dòng work_history "Requirement …"). */
export async function requirementHistory(userId: number, projectId: number, num: number) {
  await view(userId, projectId);
  const i = await prisma.workIssue.findFirst({ where: { projectId, number: num, deletedAt: null }, select: { id: true } });
  if (!i) throw new NotFoundError('Issue not found');
  const rows = await prisma.workHistory.findMany({ where: { issueId: i.id, field: { startsWith: 'Requirement' } }, orderBy: { createdAt: 'desc' }, take: 200, include: { actor: { select: { username: true, fullName: true, displayName: true } } } });
  return rows.map((h) => ({ id: h.id, field: h.field, from: h.fromValue, to: h.toValue, at: h.createdAt, actor: h.actor ? displayName(h.actor) : null, actorKind: h.actorKind }));
}

// ─── Cấu hình SWR ────────────────────────────────────────────────

async function settingsOf(projectId: number) {
  const s = await prisma.workSwrSettings.findUnique({ where: { projectId } });
  return {
    weights: s ? { benefit: s.weightBenefit, penalty: s.weightPenalty, cost: s.weightCost, risk: s.weightRisk } : { ...DEFAULT_WEIGHTS },
    declaredCounts: (s?.declaredCounts ?? null) as Partial<Record<CountKey, number | null>> | null,
    ignoredNouns: s?.ignoredNouns ?? [],
  };
}

const weight = z.number().min(0).max(10);
export const settingsInput = z.object({
  weights: z.object({ benefit: weight, penalty: weight, cost: weight, risk: weight }).partial().optional(),
  declaredCounts: z.object(Object.fromEntries(COUNT_KEYS.map((k) => [k, z.number().int().min(0).max(100_000).nullable().optional()])) as Record<CountKey, z.ZodOptional<z.ZodNullable<z.ZodNumber>>>).optional(),
  ignoredNouns: z.array(z.string().trim().min(1).max(80)).max(500).optional(),
  ignoreNoun: z.string().trim().min(1).max(80).optional(),
});

export async function updateSettings(userId: number, projectId: number, input: z.infer<typeof settingsInput>) {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot change the prioritization weights or the declared counts' });
  const cur = await settingsOf(projectId);
  const w = { ...cur.weights, ...(input.weights ?? {}) };
  if (w.cost + w.risk <= 0) throw new BadRequestError('Cost and risk weights cannot both be zero', 'VALIDATION_ERROR');
  const counts = input.declaredCounts ? { ...(cur.declaredCounts ?? {}), ...input.declaredCounts } : cur.declaredCounts;
  const nouns = [...new Set([...(input.ignoredNouns ?? cur.ignoredNouns), ...(input.ignoreNoun ? [input.ignoreNoun] : [])])].slice(0, 500);
  const data = { weightBenefit: w.benefit, weightPenalty: w.penalty, weightCost: w.cost, weightRisk: w.risk, declaredCounts: (counts ?? undefined) as Prisma.InputJsonValue | undefined, ignoredNouns: nouns };
  await prisma.workSwrSettings.upsert({ where: { projectId }, create: { projectId, ...data }, update: data });
  touch(projectId, userId);
  return settingsOf(projectId);
}

// ─── R12 Bảng ưu tiên ────────────────────────────────────────────

const score = z.number().int().min(1).max(9);
export const priorityRowInput = z.object({
  target: z.object({ kind: z.enum(['FE', 'UC']), ref: z.union([z.number().int().positive(), z.string().min(1).max(20)]) }),
  benefit: score.optional(), penalty: score.optional(), cost: score.optional(), risk: score.optional(),
  note: z.string().max(300).nullable().optional(),
});
export const priorityPatch = z.object({ benefit: score, penalty: score, cost: score, risk: score, note: z.string().max(300).nullable(), position: z.number().int().min(0).max(10_000) }).partial();

async function priorityData(projectId: number) {
  const [rows, { features }, srs, settings] = await Promise.all([
    prisma.workPriorityRow.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }] }),
    loadFeatures(projectId), loadSrs(projectId), settingsOf(projectId),
  ]);
  const fe = new Map(features.map((f) => [f.id, f]));
  const uc = new Map(inDocument(srs.useCases).map((u) => [u.id, u]));
  const labelOf2 = (r: { targetKind: string; targetId: number }) => {
    if (r.targetKind === 'FE') { const f = fe.get(r.targetId); return f ? `${feKey(f.number)} ${f.name}` : null; }
    const u = uc.get(r.targetId);
    return u ? `${ucKey(u.number)} ${u.name}` : null;
  };
  const valid = rows.filter((r) => labelOf2(r));
  const computed = computePriorities(valid.map((r) => ({ id: r.id, label: labelOf2(r)!, benefit: r.benefit, penalty: r.penalty, cost: r.cost, risk: r.risk })), settings.weights);
  const byId = new Map(computed.map((c) => [c.id, c]));
  return {
    srs, features, settings,
    rows: rows.map((r) => ({ ...r, label: labelOf2(r), orphan: !labelOf2(r), computed: byId.get(r.id) ?? null })),
    computed,
    candidates: [
      ...features.filter((f) => f.scope !== 'OUT' && !rows.some((r) => r.targetKind === 'FE' && r.targetId === f.id)).map((f) => ({ kind: 'FE' as const, ref: feKey(f.number), label: f.name })),
      ...[...uc.values()].filter((u) => !rows.some((r) => r.targetKind === 'UC' && r.targetId === u.id)).map((u) => ({ kind: 'UC' as const, ref: ucKey(u.number), label: u.name })),
    ],
  };
}

export async function getPriority(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const d = await priorityData(projectId);
  return { weights: d.settings.weights, rows: d.rows, ranked: [...d.computed].sort((a, b) => a.rank - b.rank), candidates: d.candidates, canEdit: ctx.canEdit, canConfigure: ctx.canEdit && !ctx.isAgent };
}

async function targetId(projectId: number, t: z.infer<typeof priorityRowInput>['target']): Promise<number> {
  if (t.kind === 'FE') return (await featureByNo(projectId, t.ref)).id;
  const n = refNumber(t.ref, 'UC');
  const u = n ? await prisma.workUseCase.findFirst({ where: { projectId, number: n }, select: { id: true, status: true } }) : null;
  if (!u) throw new BadRequestError(`Use case ${String(t.ref)} not found`, 'WORK_BAD_UC');
  if (u.status === 'PROPOSED') throw new BadRequestError('Accept the proposed use case before prioritizing it', 'WORK_BAD_UC');
  return u.id;
}

/** Thêm hoặc cập nhật dòng của một FE/UC (một dòng mỗi đích). */
export async function upsertPriorityRow(userId: number, projectId: number, input: z.infer<typeof priorityRowInput>) {
  await edit(userId, projectId);
  const tid = await targetId(projectId, input.target);
  const scores = { ...(input.benefit ? { benefit: input.benefit } : {}), ...(input.penalty ? { penalty: input.penalty } : {}), ...(input.cost ? { cost: input.cost } : {}), ...(input.risk ? { risk: input.risk } : {}), ...(input.note !== undefined ? { note: clean(input.note, 300) } : {}) };
  const pos = ((await prisma.workPriorityRow.aggregate({ where: { projectId }, _max: { position: true } }))._max.position ?? -1) + 1;
  const r = await prisma.workPriorityRow.upsert({
    where: { uk_work_priority_row: { projectId, targetKind: input.target.kind, targetId: tid } },
    create: { projectId, targetKind: input.target.kind, targetId: tid, position: pos, ...scores }, update: scores,
  });
  touch(projectId, userId);
  return r;
}

export async function updatePriorityRow(userId: number, projectId: number, id: number, input: z.infer<typeof priorityPatch>) {
  await edit(userId, projectId);
  const r = await prisma.workPriorityRow.updateMany({ where: { id, projectId }, data: { ...input, ...(input.note !== undefined ? { note: clean(input.note, 300) } : {}) } });
  if (!r.count) throw new NotFoundError('Row not found');
  touch(projectId, userId);
  return prisma.workPriorityRow.findUniqueOrThrow({ where: { id } });
}

export async function removePriorityRow(userId: number, projectId: number, id: number) {
  await edit(userId, projectId);
  const r = await prisma.workPriorityRow.deleteMany({ where: { id, projectId } });
  if (!r.count) throw new NotFoundError('Row not found');
  touch(projectId, userId);
  return { removed: true };
}

/** Thêm một dòng (điểm mặc định 1) cho mọi FE trong phạm vi / mọi UC đã nhận chưa có trong bảng. */
export async function seedPriorityRows(userId: number, projectId: number, kind: 'FE' | 'UC') {
  await edit(userId, projectId);
  const d = await priorityData(projectId);
  const add = d.candidates.filter((c) => c.kind === kind);
  let pos = Math.max(-1, ...d.rows.map((r) => r.position)) + 1;
  for (const c of add) {
    const tid = await targetId(projectId, { kind: c.kind, ref: c.ref });
    await prisma.workPriorityRow.upsert({ where: { uk_work_priority_row: { projectId, targetKind: kind, targetId: tid } }, create: { projectId, targetKind: kind, targetId: tid, position: pos++ }, update: {} });
  }
  touch(projectId, userId);
  return { added: add.length };
}

export async function exportPriority(userId: number, projectId: number) {
  await view(userId, projectId);
  const d = await priorityData(projectId);
  const p = await projectInfo(projectId);
  const buffer = writeXlsx(prioritySheets(d.computed, d.settings.weights, p.name), { title: `Requirements Prioritization — ${p.name}`, creator: 'CT Work' });
  return { buffer, file: `${p.key}_Requirements_Prioritization.xlsx` };
}

// ─── R16 Glossary ────────────────────────────────────────────────

export const glossaryInput = z.object({
  term: z.string().trim().min(1).max(160),
  definition: z.string().trim().min(1).max(8000),
  aliases: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
  source: z.string().max(200).nullable().optional(),
});

export async function listGlossary(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const terms = await prisma.workGlossaryTerm.findMany({ where: { projectId }, orderBy: { term: 'asc' } });
  // Cùng một từ được dùng làm alias của hai thuật ngữ ⇒ "năm bộ từ vựng" (bài A.4) — báo ra.
  const aliasOwner = new Map<string, string[]>();
  for (const t of terms) for (const a of [t.term, ...t.aliases]) aliasOwner.set(a.toLowerCase(), [...(aliasOwner.get(a.toLowerCase()) ?? []), t.term]);
  const clashes = [...aliasOwner.entries()].filter(([, ts]) => new Set(ts).size > 1).map(([word, ts]) => ({ word, terms: [...new Set(ts)] }));
  return { terms, clashes, canEdit: ctx.canEdit };
}

export async function createTerm(userId: number, projectId: number, input: z.infer<typeof glossaryInput>) {
  await edit(userId, projectId);
  if (await prisma.workGlossaryTerm.findFirst({ where: { projectId, term: { equals: input.term, mode: 'insensitive' } }, select: { id: true } })) throw new ConflictError(`"${input.term}" is already in the glossary`);
  const t = await prisma.workGlossaryTerm.create({ data: { projectId, term: input.term, definition: input.definition, aliases: [...new Set(input.aliases ?? [])], source: clean(input.source, 200), createdById: userId } });
  touch(projectId, userId);
  return t;
}

export async function updateTerm(userId: number, projectId: number, id: number, input: Partial<z.infer<typeof glossaryInput>>) {
  await edit(userId, projectId);
  const cur = await prisma.workGlossaryTerm.findFirst({ where: { id, projectId }, select: { id: true } });
  if (!cur) throw new NotFoundError('Term not found');
  if (input.term && await prisma.workGlossaryTerm.findFirst({ where: { projectId, id: { not: id }, term: { equals: input.term, mode: 'insensitive' } }, select: { id: true } })) throw new ConflictError(`"${input.term}" is already in the glossary`);
  const t = await prisma.workGlossaryTerm.update({
    where: { id },
    data: {
      ...(input.term !== undefined ? { term: input.term } : {}), ...(input.definition !== undefined ? { definition: input.definition } : {}),
      ...(input.aliases !== undefined ? { aliases: [...new Set(input.aliases)] } : {}), ...(input.source !== undefined ? { source: clean(input.source, 200) } : {}),
    },
  });
  touch(projectId, userId);
  return t;
}

export async function deleteTerm(userId: number, projectId: number, id: number) {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot delete glossary terms' });
  const r = await prisma.workGlossaryTerm.deleteMany({ where: { id, projectId } });
  if (!r.count) throw new NotFoundError('Term not found');
  touch(projectId, userId);
  return { deleted: true };
}

export async function exportGlossary(userId: number, projectId: number) {
  await view(userId, projectId);
  const p = await projectInfo(projectId);
  const terms = await prisma.workGlossaryTerm.findMany({ where: { projectId }, orderBy: { term: 'asc' } });
  return { buffer: writeXlsx([glossarySheet(terms, p.name)], { title: `Glossary — ${p.name}`, creator: 'CT Work' }), file: `${p.key}_Glossary.xlsx` };
}

// ─── R16 Data Dictionary ─────────────────────────────────────────

export const dataElementInput = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().max(8000).nullable().optional(),
  kind: z.enum(['PRIMITIVE', 'STRUCTURE']).optional(),
  composition: z.string().max(4000).nullable().optional(),
  dataType: z.string().max(60).nullable().optional(),
  length: z.string().max(20).nullable().optional(),
  values: z.string().max(4000).nullable().optional(),
  isKey: z.boolean().optional(),
  position: z.number().int().min(0).max(10_000).optional(),
});
export type DataElementInput = z.infer<typeof dataElementInput>;

const toLite = (e: { id: number; name: string; description: string | null; kind: string; composition: string | null; dataType: string | null; length: string | null; values: string | null; isKey: boolean; position: number }): DataElementLite =>
  ({ id: e.id, name: e.name, description: e.description, kind: e.kind, composition: e.composition, dataType: e.dataType, length: e.length, values: e.values, isKey: e.isKey, position: e.position });

export async function loadDictionary(projectId: number): Promise<DataElementLite[]> {
  return (await prisma.workDataElement.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }] })).map(toLite);
}

/** Phần tử ⇒ UC có nhắc tên nó trong luồng (đúng cụm từ, không phân biệt hoa thường). */
function ddUsage(elements: DataElementLite[], ucs: Awaited<ReturnType<typeof loadSrs>>['useCases']): Map<string, string[]> {
  const out = new Map<string, string[]>();
  const live = inDocument(ucs);
  for (const e of elements) {
    const re = new RegExp(`(?<![\\p{L}\\p{N}])${e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:e?s)?(?![\\p{L}\\p{N}])`, 'iu');
    out.set(e.name, live.filter((u) => re.test([u.preconditions, u.normalFlow, u.alternativeFlows, u.exceptionFlows, u.postconditions, u.description].filter(Boolean).join('\n'))).map((u) => ucKey(u.number)));
  }
  return out;
}

export async function listDictionary(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const [elements, srs, glossary, settings, p] = await Promise.all([loadDictionary(projectId), loadSrs(projectId), prisma.workGlossaryTerm.findMany({ where: { projectId }, select: { term: true, aliases: true } }), settingsOf(projectId), projectInfo(projectId)]);
  const usage = ddUsage(elements, srs.useCases);
  return {
    elements: elements.map((e) => ({ ...e, usedIn: usage.get(e.name) ?? [] })),
    undefinedComponents: undefinedComponents(elements),
    missingNouns: nounsWithoutDd({ useCases: srs.useCases, dataElements: elements, glossary, ignore: settings.ignoredNouns, actors: srs.actors.map((a) => a.name), screens: srs.screens.map((s) => s.name), systemName: p.name }),
    ignoredNouns: settings.ignoredNouns,
    erd: ddToDataModel(elements).tables.length,
    canEdit: ctx.canEdit,
  };
}

function elementData(input: Partial<DataElementInput>) {
  return {
    ...(input.name !== undefined ? { name: input.name } : {}),
    ...(input.description !== undefined ? { description: clean(input.description, 8000) } : {}),
    ...(input.kind !== undefined ? { kind: input.kind } : {}),
    ...(input.composition !== undefined ? { composition: clean(input.composition, 4000) } : {}),
    ...(input.dataType !== undefined ? { dataType: clean(input.dataType, 60) } : {}),
    ...(input.length !== undefined ? { length: clean(input.length, 20) } : {}),
    ...(input.values !== undefined ? { values: clean(input.values, 4000) } : {}),
    ...(input.isKey !== undefined ? { isKey: input.isKey } : {}),
    ...(input.position !== undefined ? { position: input.position } : {}),
  };
}

function assertElementShape(kind: string, composition: string | null | undefined) {
  if (kind === 'STRUCTURE' && !composition?.trim()) throw new BadRequestError('A data structure needs a composition, e.g. "Request ID + Requester + 1:10{Requested Chemical}"', 'VALIDATION_ERROR');
}

export async function createElement(userId: number, projectId: number, input: DataElementInput) {
  await edit(userId, projectId);
  assertElementShape(input.kind ?? 'PRIMITIVE', input.composition);
  if (await prisma.workDataElement.findFirst({ where: { projectId, name: { equals: input.name, mode: 'insensitive' } }, select: { id: true } })) throw new ConflictError(`"${input.name}" is already in the data dictionary`);
  const pos = input.position ?? ((await prisma.workDataElement.aggregate({ where: { projectId }, _max: { position: true } }))._max.position ?? -1) + 1;
  const e = await prisma.workDataElement.create({ data: { projectId, kind: input.kind ?? 'PRIMITIVE', ...elementData(input), name: input.name, position: pos, createdById: userId } });
  touch(projectId, userId);
  return e;
}

export async function updateElement(userId: number, projectId: number, id: number, input: Partial<DataElementInput>) {
  await edit(userId, projectId);
  const cur = await prisma.workDataElement.findFirst({ where: { id, projectId } });
  if (!cur) throw new NotFoundError('Data element not found');
  assertElementShape(input.kind ?? cur.kind, input.composition !== undefined ? input.composition : cur.composition);
  if (input.name && await prisma.workDataElement.findFirst({ where: { projectId, id: { not: id }, name: { equals: input.name, mode: 'insensitive' } }, select: { id: true } })) throw new ConflictError(`"${input.name}" is already in the data dictionary`);
  const e = await prisma.workDataElement.update({ where: { id }, data: elementData(input) });
  touch(projectId, userId);
  return e;
}

export async function deleteElement(userId: number, projectId: number, id: number) {
  await edit(userId, projectId, { noAgent: 'An AI agent cannot delete data dictionary entries' });
  const r = await prisma.workDataElement.deleteMany({ where: { id, projectId } });
  if (!r.count) throw new NotFoundError('Data element not found');
  touch(projectId, userId);
  return { deleted: true };
}

export async function exportDictionary(userId: number, projectId: number) {
  await view(userId, projectId);
  const [p, elements, srs] = await Promise.all([projectInfo(projectId), loadDictionary(projectId), loadSrs(projectId)]);
  return { buffer: writeXlsx(ddSheets(elements, ddUsage(elements, srs.useCases), p.name), { title: `Data Dictionary — ${p.name}`, creator: 'CT Work' }), file: `${p.key}_Data_Dictionary.xlsx` };
}

/** Diagram Studio (nguồn "dictionary"): Data Dictionary có cấu trúc ⇒ DataModel; chưa có cấu trúc nào ⇒ null. */
export async function dictionaryModel(projectId: number) {
  const elements = await loadDictionary(projectId);
  const dm = ddToDataModel(elements);
  return dm.tables.length ? dm : null;
}

export async function exportFeatures(userId: number, projectId: number) {
  const d = await listFeatures(userId, projectId);
  const p = await projectInfo(projectId);
  const rows = d.features.map((f) => ({
    key: f.key, name: f.name, description: f.description, scope: f.scope, release: f.release ?? 'Not scheduled', priority: f.priority,
    useCases: f.useCases.map((u) => u.key), requirements: f.issues.map((i) => i!.key), epic: f.epic?.key ?? null,
  }));
  return { buffer: writeXlsx([featureSheet(rows, p.name)], { title: `Features — ${p.name}`, creator: 'CT Work' }), file: `${p.key}_Features.xlsx` };
}

// ─── R23 Sáu liên kết ────────────────────────────────────────────

async function requirementsLite(projectId: number, key: string) {
  const rows = await prisma.workIssue.findMany({ where: { projectId, deletedAt: null, type: { key: 'REQUIREMENT' } }, orderBy: { number: 'asc' }, take: 2000, select: REQ_SELECT });
  return rows.map((i) => ({
    issueId: i.id, key: `${key}-${i.number}`, number: i.number, title: i.title, text: i.descriptionText ?? '', reqType: i.requirementInfo?.reqType ?? '',
    lifecycle: i.requirementInfo?.lifecycle ?? 'PROPOSED', parentId: i.parentId, subtype: i.requirementInfo?.subtype ?? null, priority: i.requirementInfo?.priority ?? null,
    source: i.requirementInfo?.source ?? null, rationale: i.requirementInfo?.rationale ?? null,
  }));
}

/** Số thực tế cho liên kết #6 (deliverable 2 = UC, 6 = màn/mock-up, 4 = báo cáo/hệ thống giao tiếp trong SRS). */
export function actualCounts(srs: Awaited<ReturnType<typeof loadSrs>>, reqs: Array<{ reqType: string; lifecycle: string; subtype: string | null }>): Partial<Record<CountKey, number>> {
  return {
    useCases: inDocument(srs.useCases).length,
    screens: srs.screens.length,
    interfacingSystems: srs.actors.filter((a) => a.kind === 'SYSTEM').length,
    reports: reqs.filter((q) => q.reqType === 'DATA' && isLive(q.lifecycle) && q.subtype === 'REPORT').length,
  };
}

export async function sixLinksData(projectId: number) {
  const p = await projectInfo(projectId);
  const [srs, { features, links }, reqs, elements, glossary, rows, settings, issues] = await Promise.all([
    loadSrs(projectId), loadFeatures(projectId), requirementsLite(projectId, p.key), loadDictionary(projectId),
    prisma.workGlossaryTerm.findMany({ where: { projectId }, select: { term: true, aliases: true } }),
    prisma.workPriorityRow.findMany({ where: { projectId }, select: { id: true, targetKind: true, targetId: true } }),
    settingsOf(projectId),
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null }, select: { id: true, parentId: true }, take: 10_000 }),
  ]);
  const ucIssue = new Map((await prisma.workUseCase.findMany({ where: { projectId }, select: { id: true, issueId: true } })).map((u) => [u.id, u.issueId]));
  const result = sixLinks({
    features, featureLinks: links, useCases: srs.useCases.map((u) => ({ ...u, issueId: ucIssue.get(u.id) ?? null })), rules: srs.rules,
    requirements: reqs, dataElements: elements, glossary, priorityRows: rows, declared: settings.declaredCounts, actual: actualCounts(srs, reqs),
    actors: srs.actors, screens: srs.screens, systemName: p.name, ignoredNouns: settings.ignoredNouns, issueParent: new Map(issues.map((i) => [i.id, i.parentId])),
  });
  return { ...result, declared: settings.declaredCounts, actual: actualCounts(srs, reqs), projectName: p.name, key: p.key };
}

export async function getSixLinks(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const d = await sixLinksData(projectId);
  return { links: d.links, passed: d.passed, ok: d.ok, declared: d.declared, actual: d.actual, canEdit: ctx.canEdit, canConfigure: ctx.canEdit && !ctx.isAgent };
}

export async function exportSixLinks(userId: number, projectId: number) {
  await view(userId, projectId);
  const d = await sixLinksData(projectId);
  return { buffer: writeXlsx([sixLinksSheet(d, d.projectName)], { title: `Six links — ${d.projectName}`, creator: 'CT Work' }), file: `${d.key}_Six_Links.xlsx` };
}

// ─── R4 + R25 Các tài liệu Wiegers ───────────────────────────────

export const DOC_KINDS = ['vision-scope', 'use-cases', 'business-rules', 'srs', 'data-dictionary'] as const;
export type DocKind = (typeof DOC_KINDS)[number];
export const templateKeyOf = (k: DocKind) => `swr-${k}` as WiegersDoc;
export const DOC_FILE: Record<DocKind, string> = {
  'vision-scope': 'Vision_and_Scope', 'use-cases': 'Use_Cases', 'business-rules': 'Business_Rules', srs: 'Software_Requirements_Specification', 'data-dictionary': 'Data_Dictionary',
};

async function pageOf(projectId: number, kind: DocKind) {
  return prisma.workPage.findFirst({ where: { projectId, deletedAt: null, templateKey: templateKeyOf(kind) }, orderBy: { id: 'asc' }, select: { id: true, number: true, title: true } });
}

async function revisionsOf(pageId: number): Promise<RevisionRow[]> {
  const vs = await prisma.workPageVersion.findMany({ where: { pageId }, orderBy: { n: 'asc' }, take: 100, select: { n: true, kind: true, note: true, createdAt: true, author: { select: { username: true, fullName: true, displayName: true } } } });
  const d = (x: Date) => `${String(x.getDate()).padStart(2, '0')}/${String(x.getMonth() + 1).padStart(2, '0')}/${x.getFullYear()}`;
  return vs.map((v) => ({
    name: v.author ? displayName(v.author) : '', date: d(v.createdAt), version: `1.${v.n - 1}`,
    reason: (v.note?.replace(/^Created from template “.*”$/, 'First version') || (v.kind === 'CREATE' ? 'First version' : v.kind === 'RESTORE' ? 'Restored an earlier version' : 'Updated the document')).slice(0, 300),
  }));
}

async function wiegersData(projectId: number, pageId: number | null): Promise<WiegersData & { vs: Parameters<typeof applyVisionScopeFill>[1] }> {
  const p = await projectInfo(projectId);
  const [srs, { features, links }, reqs, elements, glossary, raid, versions, ucMeta, revisions] = await Promise.all([
    loadSrs(projectId), loadFeatures(projectId), requirementsLite(projectId, p.key), loadDictionary(projectId),
    prisma.workGlossaryTerm.findMany({ where: { projectId }, orderBy: { term: 'asc' }, select: { term: true, definition: true, aliases: true } }),
    prisma.workRaidItem.findMany({ where: { projectId, deletedAt: null, type: { in: ['RISK', 'ASSUMPTION', 'DEPENDENCY'] }, status: { not: 'CLOSED' } }, orderBy: { number: 'asc' }, take: 200, select: { number: true, type: true, title: true, description: true, probability: true, impact: true, mitigation: true } }),
    prisma.workVersion.findMany({ where: { projectId }, select: { id: true, name: true, releaseDate: true, status: true, position: true } }),
    prisma.workUseCase.findMany({ where: { projectId }, select: { id: true, issueId: true, createdAt: true, createdById: true } }),
    pageId ? revisionsOf(pageId) : Promise.resolve([] as RevisionRow[]),
  ]);
  const people = new Map((await prisma.user.findMany({ where: { id: { in: [...new Set(ucMeta.map((u) => u.createdById).filter((x): x is number => !!x))] } }, select: { id: true, username: true, fullName: true, displayName: true } })).map((u) => [u.id, displayName(u)]));
  const raidLite: RaidLite[] = raid.map((r) => ({ ...r }));
  const ucCount = featureUseCases(features, links, srs.useCases);
  return {
    projectName: p.name, actors: srs.actors, useCases: srs.useCases, rules: srs.rules, features, featureLinks: links, requirements: reqs,
    dataElements: elements, glossary, assumptions: raidLite.filter((r) => r.type !== 'RISK'), revisions,
    ucExtra: new Map(ucMeta.map((u) => [u.id, { createdBy: u.createdById ? people.get(u.createdById) ?? null : null, createdAt: u.createdAt }])),
    ucIssue: new Map(ucMeta.map((u) => [u.id, u.issueId])),
    vs: {
      features, releases: sortReleases(versions), risks: raidLite.filter((r) => r.type === 'RISK'), assumptions: raidLite.filter((r) => r.type !== 'RISK'),
      objectives: reqs.filter((q) => q.reqType === 'BUSINESS' && isLive(q.lifecycle)).map((q) => ({ key: q.key, title: q.title, source: q.source, rationale: q.rationale })),
      stakeholders: srs.actors.filter((a) => a.kind !== 'SYSTEM').map((a) => ({ name: a.name, description: a.description })),
      useCaseCount: new Map([...ucCount.entries()].map(([k, v]) => [k, v.length])),
    },
  };
}

const erdOf = (dm: Parameters<typeof erdFromModel>[0]) => erdFromModel(dm, { title: 'Logical data model', sourceLabel: 'Data Dictionary' }).mermaid;

function fillDoc(kind: DocKind, doc: PmNode, d: Awaited<ReturnType<typeof wiegersData>>, opts: { forExport?: boolean; sections?: VsSection[] } = {}): string[] {
  const filled: string[] = [];
  if (kind === 'vision-scope') filled.push(...applyVisionScopeFill(doc, d.vs, opts.sections));
  filled.push(...applyWiegersFill(templateKeyOf(kind), doc, d, { erd: erdOf, forExport: opts.forExport }));
  return filled;
}

/** Nội dung sẽ xuất (trang của dự án hoặc mẫu gốc) đã điền — client vẽ sẵn PNG Mermaid rồi gửi kèm khi xuất. */
export async function wiegersDoc(userId: number, projectId: number, kind: DocKind, opts: { forExport?: boolean } = { forExport: true }) {
  await view(userId, projectId);
  const pg = await pageOf(projectId, kind);
  let doc: PmNode;
  let title: string;
  let version: number | null = null;
  const tpl = await getTemplate(templateKeyOf(kind));
  if (pg) {
    const page = await getPage(userId, projectId, pg.number);
    doc = JSON.parse(JSON.stringify(page.contentJson ?? { type: 'doc', content: [] })) as PmNode;
    title = page.title;
    version = page.currentVersion || null;
  } else {
    doc = JSON.parse(JSON.stringify(tpl.doc)) as PmNode;
    title = tpl.pageTitle;
  }
  const d = await wiegersData(projectId, pg?.id ?? null);
  const filled = fillDoc(kind, doc, d, opts);
  return { doc, title: title.replace(/<Project>/g, d.projectName), version, page: pg ? { number: pg.number, title: pg.title } : null, filled };
}

/** Điền trang Docs của mẫu (chưa có ⇒ `create` thì tạo từ mẫu trước) = MỘT phiên bản mới có ghi chú. */
export async function fillWiegersPage(userId: number, projectId: number, kind: DocKind, input: { create?: boolean; version?: number; sections?: VsSection[] } = {}) {
  await view(userId, projectId);
  await docCtx(userId, projectId);
  let pg = await pageOf(projectId, kind);
  let created = false;
  if (!pg) {
    if (!input.create) throw new NotFoundError(`This project has no ${(await getTemplate(templateKeyOf(kind))).title.replace(/^SWR302 \(Wiegers\) — /, '')} page yet — create it from the template`);
    const made = await createPage(userId, projectId, { templateKey: templateKeyOf(kind) });
    pg = { id: made.id, number: made.number, title: made.title };
    created = true;
  }
  const page = await getPage(userId, projectId, pg.number);
  if (!page.canEdit) throw new ForbiddenError('You can read this page but not edit it');
  const doc = JSON.parse(JSON.stringify(page.contentJson ?? { type: 'doc', content: [] })) as PmNode;
  const d = await wiegersData(projectId, pg.id);
  const filled = fillDoc(kind, doc, d, { sections: input.sections });
  const title = page.title.includes('<Project>') ? page.title.replace(/<Project>/g, d.projectName) : undefined;
  if (!filled.length) return { filled, created, page };
  const updated = await updatePage(userId, projectId, pg.number, {
    contentJson: doc, version: input.version ?? page.version, ...(title ? { title } : {}),
    versionNote: `Filled from project data (${filled.join(', ')})`.slice(0, 300),
  });
  await auditProject(projectId, { actorId: userId, action: 'swr.doc.fill', targetType: 'page', targetId: pg.id, summary: `Filled ${pg.title}: ${filled.join(', ')}`.slice(0, 300) });
  return { filled, created, page: updated };
}

export async function exportWiegers(userId: number, projectId: number, kind: DocKind, input: { format: 'docx' | 'pdf'; diagrams?: Array<string | null> }) {
  const r = await wiegersDoc(userId, projectId, kind, { forExport: true });
  const p = await projectInfo(projectId);
  const diagrams = await Promise.all((input.diagrams ?? []).slice(0, 60).map((x) => decodeDiagram(x)));
  const meta: ExportMeta = { title: r.title, projectName: p.name, projectKey: p.key, docLabel: r.page ? `DOC-${r.page.number}` : 'SWR302', version: r.version, date: new Date(), capstone: false };
  const opts = { stripGuides: true, toc: true, cover: true, diagrams, resolveImage: (src: string) => projectImage(projectId, src) };
  const buffer = input.format === 'docx' ? await renderDocx(r.doc, meta, opts) : await renderPdf(r.doc, meta, opts);
  await auditProject(projectId, { actorId: userId, action: 'swr.doc.export', targetType: 'project', targetId: projectId, summary: `Exported ${r.title} (${input.format}) — ${r.filled.join(', ') || 'template only'}`.slice(0, 300) });
  return { buffer, file: `${p.key}_${DOC_FILE[kind]}.${input.format}`, filled: r.filled };
}

// ─── Tổng quan ───────────────────────────────────────────────────

export async function overview(userId: number, projectId: number) {
  const ctx = await view(userId, projectId);
  const [features, reqs, terms, elements, rows, pages, six, settings] = await Promise.all([
    prisma.workFeature.count({ where: { projectId } }),
    prisma.workIssue.count({ where: { projectId, deletedAt: null, type: { key: 'REQUIREMENT' } } }),
    prisma.workGlossaryTerm.count({ where: { projectId } }),
    prisma.workDataElement.count({ where: { projectId } }),
    prisma.workPriorityRow.count({ where: { projectId } }),
    Promise.all(DOC_KINDS.map(async (k) => ({ kind: k, templateKey: templateKeyOf(k), page: await pageOf(projectId, k) }))),
    sixLinksData(projectId),
    settingsOf(projectId),
  ]);
  return {
    counts: { features, requirements: reqs, glossary: terms, dataElements: elements, priorityRows: rows },
    docs: pages.map((x) => ({ kind: x.kind, templateKey: x.templateKey, page: x.page ? { number: x.page.number, title: x.page.title } : null })),
    sixLinks: { passed: six.passed, ok: six.ok, links: six.links.map((l) => ({ n: l.n, key: l.key, ok: l.ok, gaps: l.gaps.filter((g) => g.severity === 'error').length })) },
    declaredCounts: settings.declaredCounts, ignoredNouns: settings.ignoredNouns, weights: settings.weights,
    canEdit: ctx.canEdit, canApprove: ctx.canApprove, canConfigure: ctx.canEdit && !ctx.isAgent,
    templates: WIEGERS_DOCS,
  };
}
