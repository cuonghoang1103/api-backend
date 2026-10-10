/**
 * CT Work — CTW đợt 6b (11/10/2026) SWR-3 "SRS chuyên sâu" — phần có DB. Luật thuần ở srsModels.ts + swr6b.ts.
 *
 *   R14 Mô hình hoá: context (DFD 0), DFD 1, state của thực thể, activity (UC), feature tree ⇒ sơ đồ Diagram Studio (ĐỀ XUẤT,
 *       người duyệt; bản đã duyệt mới vào SRS/Report 3) + bảng event–response; thiếu nguồn ⇒ 422 WORK_DIAGRAM_NO_SOURCE song ngữ.
 *   R15 Prototype / wireframe gắn màn (ảnh đã tải lên hoặc link Figma/Excalidraw…) ⇒ gửi xác nhận ⇒ giảng viên / ADMIN dự án
 *       duyệt trong CT Work, hoặc KHÁCH duyệt qua link không cần tài khoản (`/work/mockup-review/<token>`).
 *   Checklist chất lượng 8 tiêu chí: chấm tự động phần đo được + người chấm phần còn lại + AI đề xuất cách sửa (chỉ gợi ý).
 *   R7  NFR có số đo (ISO/IEC 25010 + Planguage) gắn thẻ REQUIREMENT loại Quality attribute; mẫu NFR tạo thẻ một chạm.
 *   Xuất: `srsDeepData` cho bước điền SRS Wiegers (swr.service) — mô hình + NFR + stakeholder + prototype.
 */

import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { checkDiagram, diagramKey, isAssumedLabel, lintMermaid, markAssumed, type DiagramType } from './diagram.js';
import type { BuiltDiagram } from './diagramGen.js';
import type { PlacedDiagram } from './diagramFill.js';
import { emitWorkEvent } from './events.js';
import { can } from './permissions.js';
import { loadSrs, srsCtx } from './srs.service.js';
import { inDocument, refNumber, ucKey } from './srs.js';
import {
  contextDiagram, dfdLevel1, entityStateDiagram, EVENT_TYPE_LABEL, eventResponseTable, featureTree, isMissing, MODEL_DIAGRAM_TYPE, MODEL_KINDS, MODEL_LABEL,
  stateCandidates, stateSubject, type ModelKind,
} from './srsModels.js';
import {
  aiFixOut, aiFixPrompt, COMPARATORS, ISO_CHARACTERISTICS, ISO_LABEL, ISO_SUBS, ISO_TO_WIEGERS, MANUAL_CRITERIA, NFR_TEMPLATES, nfrMeasured, nfrStatement, QUALITY_CRITERIA,
  qualityCheck, VERIFICATIONS, WIEGERS_TO_ISO, type NfrSpecLite, type QualityCriterion, type SrsDeepData,
} from './swr6b.js';
import { jaccard } from './specFidelity.js';
import { XSheet, writeXlsx, type XStyle } from './xlsxStyled.js';

const touch = (projectId: number, userId: number) => emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
const clean = (s: string | null | undefined, n: number) => { const v = (s ?? '').trim(); return v ? v.slice(0, n) : null; };
async function projectInfo(projectId: number) {
  return prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });
}

// ═══ R14 Mô hình hoá ═════════════════════════════════════════════

function noSource(en: string, vi: string, fix: string): AppError {
  return new AppError(`${en} / ${vi}`, 422, 'WORK_DIAGRAM_NO_SOURCE', { en, vi, fix });
}

async function modelInputs(projectId: number) {
  const { loadDictionary } = await import('./swr.service.js');
  const [p, srs, dd, features, links] = await Promise.all([
    projectInfo(projectId), loadSrs(projectId), loadDictionary(projectId),
    prisma.workFeature.findMany({ where: { projectId }, orderBy: { number: 'asc' } }),
    prisma.workFeatureLink.findMany({ where: { feature: { projectId } }, select: { featureId: true, kind: true, targetId: true } }),
  ]);
  return {
    systemName: p.name.trim().slice(0, 60) || p.key, srs, dd, links,
    features: features.map((f) => ({ id: f.id, number: f.number, name: f.name, description: f.description, scope: f.scope, priority: f.priority, versionId: f.versionId, epicIssueId: f.epicIssueId, position: f.position })),
  };
}

function build(kind: Exclude<ModelKind, 'ACTIVITY'>, x: Awaited<ReturnType<typeof modelInputs>>, subject: string) {
  if (kind === 'CONTEXT') return contextDiagram({ systemName: x.systemName, actors: x.srs.actors, useCases: x.srs.useCases, dataElements: x.dd });
  if (kind === 'DFD1') return dfdLevel1({ systemName: x.systemName, actors: x.srs.actors, useCases: x.srs.useCases, features: x.features, featureLinks: x.links, dataElements: x.dd });
  if (kind === 'STATE') return entityStateDiagram({ element: subject, elements: x.dd, useCases: x.srs.useCases });
  return featureTree({ systemName: x.systemName, features: x.features, featureLinks: x.links, useCases: x.srs.useCases });
}

async function liveDiagram(projectId: number, diagramId: number) {
  return prisma.workDiagram.findFirst({ where: { id: diagramId, projectId, deletedAt: null }, select: { id: true, number: true, title: true, status: true, currentVersion: true, approvedVersion: true, diagramType: true, updatedAt: true } });
}

export async function listModels(userId: number, projectId: number) {
  const ctx = await srsCtx(userId, projectId, 'view');
  const [x, maps] = await Promise.all([modelInputs(projectId), prisma.workSrsModel.findMany({ where: { projectId }, orderBy: [{ kind: 'asc' }, { subject: 'asc' }] })]);
  const models = [];
  for (const m of maps) {
    const d = await liveDiagram(projectId, m.diagramId);
    if (!d) continue;
    models.push({ kind: m.kind, subject: m.subject, diagram: { number: d.number, key: diagramKey(d.number), title: d.title, status: d.status, currentVersion: d.currentVersion, approvedVersion: d.approvedVersion, updatedAt: d.updatedAt } });
  }
  const readiness = Object.fromEntries((['CONTEXT', 'DFD1', 'FEATURE_TREE'] as const).map((k) => {
    const r = build(k, x, '');
    return [k, isMissing(r) ? { ready: false, en: r.missing.en, vi: r.missing.vi, fix: r.missing.fix } : { ready: true }];
  }));
  const ucs = inDocument(x.srs.useCases).sort((a, b) => a.number - b.number);
  return {
    kinds: MODEL_KINDS.map((k) => ({ kind: k, label: MODEL_LABEL[k], diagramType: MODEL_DIAGRAM_TYPE[k] })),
    models, readiness,
    stateCandidates: stateCandidates(x.dd).map((c) => ({ name: c.name, values: c.values })),
    useCases: ucs.map((u) => ({ number: u.number, key: ucKey(u.number), name: u.name })),
    events: eventResponseTable({ actors: x.srs.actors, useCases: x.srs.useCases }).map((e) => ({ ...e, typeLabel: EVENT_TYPE_LABEL[e.type] })),
    canEdit: ctx.canEdit,
  };
}

/**
 * Dựng mô hình từ dữ liệu ⇒ sơ đồ ĐỀ XUẤT trong Diagram Studio (lần đầu) hoặc phiên bản mới của sơ đồ đã gắn (lần sau — người
 * gọi là agent ⇒ phiên bản PROPOSED). Kiểm như Diagram Studio: cú pháp, đúng loại, mọi thực thể có nguồn (không thì gắn "(assumed)").
 */
export async function generateModel(userId: number, projectId: number, kind: ModelKind, input: { subject?: string | null; useCase?: number | string | null } = {}) {
  await srsCtx(userId, projectId, 'edit');
  const diagrams = await import('./diagrams.service.js');
  if (kind === 'ACTIVITY') {
    const n = refNumber(input.useCase ?? input.subject, 'UC');
    if (!n) throw new BadRequestError('Choose a use case (e.g. "UC-05") for the activity diagram', 'VALIDATION_ERROR');
    const subject = ucKey(n);
    const existing = await prisma.workSrsModel.findUnique({ where: { uk_work_srs_model: { projectId, kind, subject } } });
    const live = existing ? await liveDiagram(projectId, existing.diagramId) : null;
    const r = await diagrams.generateDiagram(userId, projectId, { type: 'ACTIVITY', useCase: n, ...(live ? { update: live.number } : {}) });
    const num = (r.diagram as { number: number }).number;
    const d = await prisma.workDiagram.findFirstOrThrow({ where: { projectId, number: num }, select: { id: true } });
    await prisma.workSrsModel.upsert({ where: { uk_work_srs_model: { projectId, kind, subject } }, create: { projectId, kind, subject, diagramId: d.id }, update: { diagramId: d.id } });
    touch(projectId, userId);
    return { kind, subject, diagram: { number: num, key: diagramKey(num) }, check: r.check, created: !live };
  }
  const x = await modelInputs(projectId);
  const subject = kind === 'STATE' ? stateSubject(input.subject ?? stateCandidates(x.dd)[0]?.name ?? '') : '';
  const built = build(kind, x, subject);
  if (isMissing(built)) throw noSource(built.missing.en, built.missing.vi, built.missing.fix);
  const b = built as BuiltDiagram;
  const c = checkDiagram({ type: b.type, mermaid: b.mermaid, allowed: b.allowed, structural: b.structural, ucNumbers: x.srs.useCases.map((u) => u.number), brNumbers: x.srs.rules.map((r) => r.number) });
  if (!c.ok) throw new AppError(`The model failed CT Work's checks: ${c.errors.slice(0, 4).join(' · ')}`, 422, 'WORK_DIAGRAM_CHECK_FAILED', { errors: c.errors });
  const flagged = c.unknown.filter((u) => !isAssumedLabel(u.label));
  const mermaid = flagged.length ? markAssumed(b.mermaid, flagged.map((u) => u.id)) : b.mermaid;
  const lint = lintMermaid(mermaid);
  if (!lint.ok) throw new AppError(`The model failed CT Work's checks: ${lint.errors.slice(0, 3).map((e) => `line ${e.line}: ${e.message}`).join(' · ')}`, 422, 'WORK_DIAGRAM_CHECK_FAILED', { errors: lint.errors });
  const assumptions = [...b.assumptions, ...flagged.map((u) => `"${u.label}" is not in the project data — marked "(assumed)"`)];
  const origin = {
    generator: 'data', model: null, type: b.type, sources: b.sources, assumptions, notes: b.notes,
    checks: { ok: true, checked: c.checked, unknown: flagged.map((u) => u.label), repaired: false, syntax: 'ok', srsModel: kind }, at: new Date().toISOString(),
  };
  const note = `CT Work drew this ${MODEL_LABEL[kind].toLowerCase()} from ${b.sources.map((s) => s.label).join('; ')}`.slice(0, 300);
  const existing = await prisma.workSrsModel.findUnique({ where: { uk_work_srs_model: { projectId, kind, subject } } });
  const live = existing ? await liveDiagram(projectId, existing.diagramId) : null;
  let number: number;
  let proposedVersion: number | null = null;
  if (live) {
    const r = await diagrams.updateDiagram(userId, projectId, live.number, { source: mermaid, note, origin, title: b.title });
    number = live.number;
    proposedVersion = (r as { proposedVersion?: number | null }).proposedVersion ?? null;
  } else {
    const r = await diagrams.createDiagram(userId, projectId, { format: 'MERMAID', type: MODEL_DIAGRAM_TYPE[kind] as DiagramType, title: b.title, source: mermaid, note, origin }, { propose: true, aiModel: 'ct-work' });
    number = (r as { number: number }).number;
    const d = await prisma.workDiagram.findFirstOrThrow({ where: { projectId, number }, select: { id: true } });
    await prisma.workSrsModel.upsert({ where: { uk_work_srs_model: { projectId, kind, subject } }, create: { projectId, kind, subject, diagramId: d.id }, update: { diagramId: d.id } });
  }
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.model.generate', targetType: 'project', targetId: projectId, summary: `Generated the ${MODEL_LABEL[kind].toLowerCase()}${subject ? ` (${subject})` : ''} as ${diagramKey(number)}` });
  return { kind, subject, diagram: { number, key: diagramKey(number) }, created: !live, proposedVersion, check: { sources: b.sources, assumptions, notes: b.notes, unknown: flagged.map((u) => u.label) } };
}

/** Bảng event–response dạng .xlsx. */
export async function exportEvents(userId: number, projectId: number) {
  await srsCtx(userId, projectId, 'view');
  const [p, srs] = await Promise.all([projectInfo(projectId), loadSrs(projectId)]);
  const rows = eventResponseTable({ actors: srs.actors, useCases: srs.useCases });
  const sh = new XSheet('Event-Response');
  [40, 16, 36, 46, 10].forEach((w, i) => sh.width(i + 1, w));
  sh.set(1, 1, `Event-response table — ${p.name}`, { font: { name: 'Arial', sz: 12, b: true } });
  ['Event', 'Event type', 'System state', 'Response', 'Source'].forEach((h, i) => sh.set(3, i + 1, h, HEAD));
  rows.forEach((r, k) => [r.event, EVENT_TYPE_LABEL[r.type], r.state, r.response, r.ref].forEach((v, i) => sh.set(4 + k, i + 1, v, CELL)));
  sh.freeze = { col: 1, row: 3 };
  return { buffer: writeXlsx([sh], { title: `Event-response table — ${p.name}`, creator: 'CT Work' }), file: `${p.key}_Event_Response_Table.xlsx` };
}

// ═══ R15 Prototype / wireframe ═══════════════════════════════════

const HTTP_URL = /^https?:\/\/[^\s<>"']{3,990}$/i;
export function providerOf(url: string): 'FIGMA' | 'EXCALIDRAW' | 'PENPOT' | 'MIRO' | 'OTHER' {
  try {
    const h = new URL(url).hostname.toLowerCase();
    if (h === 'figma.com' || h.endsWith('.figma.com')) return 'FIGMA';
    if (h === 'excalidraw.com' || h.endsWith('.excalidraw.com')) return 'EXCALIDRAW';
    if (h.endsWith('penpot.app')) return 'PENPOT';
    if (h.endsWith('miro.com')) return 'MIRO';
  } catch { /* URL lạ ⇒ OTHER */ }
  return 'OTHER';
}

export const mockupInput = z.object({
  screenId: z.number().int().positive(),
  kind: z.enum(['IMAGE', 'LINK']),
  imageId: z.number().int().positive().nullable().optional(),
  url: z.string().trim().max(1000).nullable().optional(),
  title: z.string().max(200).nullable().optional(),
});

const imgSrc = (projectId: number, id: number) => `/api/v1/work/projects/${projectId}/images/${id}`;

async function mockupOf(projectId: number, id: number) {
  const m = await prisma.workScreenMockup.findFirst({ where: { id, projectId }, include: { screen: { select: { id: true, name: true, projectId: true } } } });
  if (!m) throw new NotFoundError('Prototype not found');
  return m;
}

function mockupView(projectId: number, m: Prisma.WorkScreenMockupGetPayload<{ include: { screen: { select: { id: true; name: true } } } }>) {
  return {
    id: m.id, screenId: m.screenId, screen: m.screen.name, kind: m.kind, url: m.url, provider: m.provider, title: m.title,
    image: m.imageId ? imgSrc(projectId, m.imageId) : null, status: m.status, reviewerName: m.reviewerName, reviewerRole: m.reviewerRole,
    reviewNote: m.reviewNote, reviewedAt: m.reviewedAt, shared: !!m.reviewToken, reviewPath: m.reviewToken ? `/work/mockup-review/${m.reviewToken}` : null,
    createdAt: m.createdAt, updatedAt: m.updatedAt,
  };
}

/** Người duyệt prototype trong CT Work: giảng viên (TEACHER) hoặc ADMIN dự án — không phải agent. */
function canReview(access: { role: string; principal: string }) {
  return access.principal !== 'AGENT' && (access.role === 'TEACHER' || access.role === 'ADMIN');
}

export async function listMockups(userId: number, projectId: number) {
  const ctx = await srsCtx(userId, projectId, 'view');
  const [screens, rows] = await Promise.all([
    prisma.workSrsScreen.findMany({ where: { projectId }, orderBy: [{ position: 'asc' }, { id: 'asc' }], select: { id: true, name: true, feature: true } }),
    prisma.workScreenMockup.findMany({ where: { projectId }, orderBy: [{ screenId: 'asc' }, { id: 'asc' }], include: { screen: { select: { id: true, name: true } } } }),
  ]);
  const list = rows.map((m) => mockupView(projectId, m));
  return {
    screens: screens.map((s) => ({ ...s, mockups: list.filter((m) => m.screenId === s.id), approved: list.some((m) => m.screenId === s.id && m.status === 'APPROVED') })),
    counts: { screens: screens.length, withPrototype: screens.filter((s) => list.some((m) => m.screenId === s.id)).length, approved: screens.filter((s) => list.some((m) => m.screenId === s.id && m.status === 'APPROVED')).length },
    canEdit: ctx.canEdit, canReview: canReview(ctx.access), canShare: ctx.canEdit && !ctx.isAgent,
  };
}

export async function addMockup(userId: number, projectId: number, input: z.infer<typeof mockupInput>) {
  await srsCtx(userId, projectId, 'edit');
  const screen = await prisma.workSrsScreen.findFirst({ where: { id: input.screenId, projectId }, select: { id: true, name: true } });
  if (!screen) throw new BadRequestError('Screen not found in this project', 'WORK_BAD_SCREEN');
  if ((await prisma.workScreenMockup.count({ where: { screenId: screen.id } })) >= 20) throw new BadRequestError('A screen can have at most 20 prototypes', 'WORK_LIMIT');
  let imageId: number | null = null;
  let url: string | null = null;
  if (input.kind === 'IMAGE') {
    if (!input.imageId) throw new BadRequestError('Upload the image first (imageId)', 'VALIDATION_ERROR');
    if (!(await prisma.workDocImage.count({ where: { id: input.imageId, projectId } }))) throw new BadRequestError('Image not found in this project', 'WORK_BAD_IMAGE');
    imageId = input.imageId;
  } else {
    if (!input.url || !HTTP_URL.test(input.url)) throw new BadRequestError('Give a full http(s) link to the design (Figma, Excalidraw…)', 'VALIDATION_ERROR');
    url = input.url;
  }
  const m = await prisma.workScreenMockup.create({
    data: { projectId, screenId: screen.id, kind: input.kind, imageId, url, provider: url ? providerOf(url) : null, title: clean(input.title, 200), createdById: userId },
    include: { screen: { select: { id: true, name: true } } },
  });
  touch(projectId, userId);
  return mockupView(projectId, m);
}

export async function updateMockup(userId: number, projectId: number, id: number, input: { title?: string | null; url?: string | null; imageId?: number | null }) {
  await srsCtx(userId, projectId, 'edit');
  const cur = await mockupOf(projectId, id);
  const data: Prisma.WorkScreenMockupUncheckedUpdateInput = {};
  if (input.title !== undefined) data.title = clean(input.title, 200);
  let contentChanged = false;
  if (input.url !== undefined && cur.kind === 'LINK') {
    if (!input.url || !HTTP_URL.test(input.url)) throw new BadRequestError('Give a full http(s) link to the design', 'VALIDATION_ERROR');
    if (input.url !== cur.url) { data.url = input.url; data.provider = providerOf(input.url); contentChanged = true; }
  }
  if (input.imageId !== undefined && input.imageId !== null && cur.kind === 'IMAGE' && input.imageId !== cur.imageId) {
    if (!(await prisma.workDocImage.count({ where: { id: input.imageId, projectId } }))) throw new BadRequestError('Image not found in this project', 'WORK_BAD_IMAGE');
    data.imageId = input.imageId;
    contentChanged = true;
  }
  // Đổi thiết kế ⇒ xác nhận cũ hết giá trị: về nháp, link khách cũ chết.
  if (contentChanged) Object.assign(data, { status: 'DRAFT', reviewToken: null, reviewerName: null, reviewerRole: null, reviewedById: null, reviewNote: null, reviewedAt: null });
  const m = await prisma.workScreenMockup.update({ where: { id: cur.id }, data, include: { screen: { select: { id: true, name: true } } } });
  touch(projectId, userId);
  return mockupView(projectId, m);
}

export async function deleteMockup(userId: number, projectId: number, id: number) {
  const ctx = await srsCtx(userId, projectId, 'edit');
  if (ctx.isAgent) throw new ForbiddenError('An AI agent cannot delete prototypes');
  const cur = await mockupOf(projectId, id);
  await prisma.workScreenMockup.delete({ where: { id: cur.id } });
  touch(projectId, userId);
  return { deleted: true };
}

/** Gửi xác nhận (SUBMITTED). `share` ⇒ thêm link cho khách (không cần tài khoản) — đối ngoại, chỉ người. */
export async function submitMockup(userId: number, projectId: number, id: number, input: { share?: boolean } = {}) {
  const ctx = await srsCtx(userId, projectId, 'edit');
  if (input.share && ctx.isAgent) throw new ForbiddenError('An AI agent cannot send a review link outside the team');
  const cur = await mockupOf(projectId, id);
  const token = input.share ? cur.reviewToken ?? crypto.randomBytes(18).toString('base64url') : cur.reviewToken;
  const m = await prisma.workScreenMockup.update({
    where: { id: cur.id },
    data: { status: 'SUBMITTED', reviewToken: token, reviewerName: null, reviewerRole: null, reviewedById: null, reviewNote: null, reviewedAt: null },
    include: { screen: { select: { id: true, name: true } } },
  });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.mockup.submit', targetType: 'mockup', targetId: cur.id, summary: `Sent the prototype of "${cur.screen.name}" for confirmation${input.share ? ' (client link)' : ''}` });
  return mockupView(projectId, m);
}

export const reviewInput = z.object({ decision: z.enum(['APPROVED', 'CHANGES']), note: z.string().max(4000).nullable().optional() });

export async function reviewMockup(userId: number, projectId: number, id: number, input: z.infer<typeof reviewInput>) {
  const ctx = await srsCtx(userId, projectId, 'view');
  if (!canReview(ctx.access)) throw new ForbiddenError(ctx.isAgent ? 'An AI agent cannot confirm a prototype — the lecturer or client does' : 'Only the lecturer or a project admin confirms prototypes (clients use the review link)');
  const cur = await mockupOf(projectId, id);
  if (cur.status === 'DRAFT') throw new AppError('Send the prototype for confirmation first', 409, 'WORK_MOCKUP_DRAFT');
  if (input.decision === 'CHANGES' && !input.note?.trim()) throw new BadRequestError('Say what should change', 'VALIDATION_ERROR');
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { username: true, fullName: true, displayName: true } });
  const m = await prisma.workScreenMockup.update({
    where: { id: cur.id },
    data: { status: input.decision, reviewedById: userId, reviewerName: (u?.displayName || u?.fullName || u?.username || 'Reviewer').slice(0, 120), reviewerRole: ctx.access.role === 'TEACHER' ? 'LECTURER' : 'ADMIN', reviewNote: clean(input.note, 4000), reviewedAt: new Date() },
    include: { screen: { select: { id: true, name: true } } },
  });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'swr.mockup.review', targetType: 'mockup', targetId: cur.id, summary: `${input.decision === 'APPROVED' ? 'Approved' : 'Asked for changes to'} the prototype of "${cur.screen.name}"` });
  return mockupView(projectId, m);
}

// ─── Link xác nhận cho khách (không đăng nhập) ───────────────────

async function mockupByToken(token: string) {
  if (!/^[A-Za-z0-9_-]{16,48}$/.test(token)) throw new NotFoundError('Review link not found');
  const m = await prisma.workScreenMockup.findUnique({ where: { reviewToken: token }, include: { screen: { select: { name: true, description: true, project: { select: { name: true, deletedAt: true } } } } } });
  if (!m || m.screen.project.deletedAt) throw new NotFoundError('Review link not found');
  return m;
}

export async function publicMockup(token: string) {
  const m = await mockupByToken(token);
  return {
    project: m.screen.project.name, screen: m.screen.name, description: m.screen.description, title: m.title, kind: m.kind, url: m.url, provider: m.provider,
    image: m.imageId ? `/api/v1/work/public/mockup-review/${token}/image` : null, status: m.status, reviewerName: m.reviewerName, reviewNote: m.reviewNote, reviewedAt: m.reviewedAt,
  };
}

export async function publicMockupImage(token: string) {
  const m = await mockupByToken(token);
  if (!m.imageId) throw new NotFoundError('Image not found');
  const { readImageBytes } = await import('./docs3a.service.js');
  return readImageBytes(m.projectId, m.imageId);
}

export async function publicMockupDecision(token: string, body: { decision?: unknown; name?: unknown; note?: unknown }) {
  const m = await mockupByToken(token);
  const v = z.object({ decision: z.enum(['APPROVED', 'CHANGES']), name: z.string().trim().min(2).max(120), note: z.string().max(4000).nullable().optional() }).safeParse(body);
  if (!v.success) throw new BadRequestError('Give your name and a decision', 'VALIDATION_ERROR');
  if (v.data.decision === 'CHANGES' && !v.data.note?.trim()) throw new BadRequestError('Say what should change', 'VALIDATION_ERROR');
  if (m.status !== 'SUBMITTED') throw new AppError(m.status === 'DRAFT' ? 'This prototype is being edited — wait for a new link' : 'This prototype was already reviewed', 409, 'WORK_MOCKUP_DECIDED');
  const r = await prisma.workScreenMockup.updateMany({
    where: { id: m.id, status: 'SUBMITTED', reviewToken: token },
    data: { status: v.data.decision, reviewerName: v.data.name, reviewerRole: 'CLIENT', reviewNote: clean(v.data.note, 4000), reviewedAt: new Date(), reviewedById: null },
  });
  if (!r.count) throw new AppError('This prototype was already reviewed', 409, 'WORK_MOCKUP_DECIDED');
  emitWorkEvent({ type: 'project.updated', projectId: m.projectId, actor: { kind: 'SYSTEM', userId: null } });
  await auditProject(m.projectId, { actorId: null as unknown as number, action: 'swr.mockup.client-review', targetType: 'mockup', targetId: m.id, summary: `${v.data.name} (client) ${v.data.decision === 'APPROVED' ? 'approved' : 'asked for changes to'} the prototype of "${m.screen.name}"`.slice(0, 300) }).catch(() => undefined);
  return publicMockup(token);
}

// ═══ Checklist chất lượng ════════════════════════════════════════

const XF = (sz = 10, b = false): XStyle['font'] => ({ name: 'Arial', sz, b });
const HEAD: XStyle = { font: XF(10, true), fill: 'C0C0C0', border: 'thin', align: { h: 'center', v: 'center', wrap: true } };
const CELL: XStyle = { font: XF(), border: 'thin', align: { v: 'top', wrap: true } };
const PASS: XStyle = { ...CELL, font: { name: 'Arial', sz: 10, color: '006100' }, fill: 'C6EFCE', align: { h: 'center', v: 'top' } };
const FAIL: XStyle = { ...CELL, font: { name: 'Arial', sz: 10, color: '9C0006' }, fill: 'FFC7CE', align: { h: 'center', v: 'top' } };
const OPEN: XStyle = { ...CELL, font: { name: 'Arial', sz: 10, color: '7F6000' }, fill: 'FFEB9C', align: { h: 'center', v: 'top' } };

function taskItems(json: unknown): number {
  let n = 0;
  const walk = (x: unknown) => {
    if (!x || typeof x !== 'object') return;
    const o = x as { type?: string; content?: unknown[] };
    if (o.type === 'taskItem') n++;
    if (Array.isArray(o.content)) o.content.forEach(walk);
  };
  walk(json);
  return n;
}

async function qualityRows(projectId: number) {
  const { key } = await projectInfo(projectId);
  const [reqs, featureLinks, features, ucs, origins, traces, specs, manual] = await Promise.all([
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, type: { key: 'REQUIREMENT' } }, orderBy: { number: 'asc' }, take: 2000, select: { id: true, number: true, title: true, descriptionText: true, descriptionJson: true, parentId: true, requirementInfo: true } }),
    prisma.workFeatureLink.findMany({ where: { kind: 'ISSUE', feature: { projectId } }, select: { targetId: true } }),
    prisma.workFeature.findMany({ where: { projectId, epicIssueId: { not: null } }, select: { epicIssueId: true } }),
    prisma.workUseCase.findMany({ where: { projectId, issueId: { not: null } }, select: { issueId: true } }),
    prisma.workRequirementOrigin.findMany({ where: { projectId }, select: { issueId: true } }),
    prisma.workTraceLink.findMany({ where: { projectId, sourceKind: 'ISSUE' }, select: { sourceId: true } }),
    prisma.workNfrSpec.findMany({ where: { projectId } }),
    prisma.workReqQuality.findMany({ where: { projectId } }),
  ]);
  const linked = new Set([...featureLinks.map((l) => l.targetId), ...features.map((f) => f.epicIssueId!), ...ucs.map((u) => u.issueId!), ...traces.map((t) => t.sourceId)]);
  const hasOrigin = new Set(origins.map((o) => o.issueId));
  const spec = new Map(specs.map((s) => [s.issueId, s]));
  const man = new Map(manual.map((m) => [m.issueId, m]));
  return reqs.map((r) => {
    const info = r.requirementInfo;
    const others = reqs.filter((o) => o.id !== r.id && jaccard(o.title, r.title) >= 0.8).map((o) => `${key}-${o.number}`);
    const s = spec.get(r.id) ?? null;
    const m = man.get(r.id);
    const manualVals = (m?.manual && typeof m.manual === 'object' ? m.manual : {}) as Partial<Record<QualityCriterion, boolean | null>>;
    const result = qualityCheck({
      // NFR có thước đo: câu Planguage chính là nội dung của yêu cầu (mô tả thẻ có thể để trống).
      title: r.title, text: [r.descriptionText ?? '', s && nfrMeasured(s) ? nfrStatement(s) : ''].filter(Boolean).join('\n'), reqType: info?.reqType ?? null, priority: info?.priority ?? null, taskItems: taskItems(r.descriptionJson),
      nfr: s, traced: linked.has(r.id) || (!!r.parentId && linked.has(r.parentId)) || hasOrigin.has(r.id), hasSource: !!(info?.source?.trim() || info?.rationale?.trim()) || hasOrigin.has(r.id),
      duplicates: others, manual: manualVals,
    });
    return { issueId: r.id, number: r.number, key: `${key}-${r.number}`, title: r.title, reqType: info?.reqType ?? null, lifecycle: info?.lifecycle ?? 'PROPOSED', manual: manualVals, ai: m?.aiSuggestion ?? null, aiModel: m?.aiModel ?? null, ...result };
  });
}

export async function qualityList(userId: number, projectId: number) {
  const ctx = await srsCtx(userId, projectId, 'view');
  const rows = await qualityRows(projectId);
  const byCriterion = Object.fromEntries(QUALITY_CRITERIA.map((c) => [c, { pass: rows.filter((r) => r.criteria.find((x) => x.key === c)?.status === 'pass').length, fail: rows.filter((r) => r.criteria.find((x) => x.key === c)?.status === 'fail').length, unchecked: rows.filter((r) => r.criteria.find((x) => x.key === c)?.status === 'unchecked').length }]));
  return {
    requirements: rows, criteria: QUALITY_CRITERIA, manualCriteria: MANUAL_CRITERIA, byCriterion,
    average: rows.length ? Math.round(rows.reduce((a, r) => a + r.score, 0) / rows.length) : null,
    canEdit: ctx.canEdit && !ctx.isAgent, canUseAi: ctx.canEdit,
  };
}

export const manualInput = z.object(Object.fromEntries(MANUAL_CRITERIA.map((k) => [k, z.boolean().nullable().optional()])) as Record<QualityCriterion, z.ZodOptional<z.ZodNullable<z.ZodBoolean>>>);

async function reqIssue(projectId: number, num: number) {
  const i = await prisma.workIssue.findFirst({ where: { projectId, number: num, deletedAt: null }, select: { id: true, number: true, title: true, descriptionText: true, type: { select: { key: true } }, requirementInfo: true } });
  if (!i) throw new NotFoundError('Issue not found');
  if (i.type.key !== 'REQUIREMENT') throw new BadRequestError('Only Requirement issues have a quality checklist', 'WORK_NOT_REQUIREMENT');
  return i;
}

/** Người chấm tiêu chí máy không đo được (khả thi, không mâu thuẫn, cần thiết). Agent không tự chấm. */
export async function setManualQuality(userId: number, projectId: number, num: number, input: z.infer<typeof manualInput>) {
  const ctx = await srsCtx(userId, projectId, 'edit');
  if (ctx.isAgent) throw new ForbiddenError('An AI agent cannot sign off a quality criterion — a person judges it');
  const i = await reqIssue(projectId, num);
  const cur = await prisma.workReqQuality.findUnique({ where: { issueId: i.id } });
  const next = { ...((cur?.manual && typeof cur.manual === 'object' ? cur.manual : {}) as Record<string, unknown>) };
  for (const k of MANUAL_CRITERIA) if (input[k] !== undefined) next[k] = input[k];
  await prisma.workReqQuality.upsert({ where: { issueId: i.id }, create: { issueId: i.id, projectId, manual: next as Prisma.InputJsonValue, checkedById: userId }, update: { manual: next as Prisma.InputJsonValue, checkedById: userId } });
  touch(projectId, userId);
  return (await qualityRows(projectId)).find((r) => r.issueId === i.id)!;
}

/** AI đề xuất cách sửa (viết lại + tiêu chí chấp nhận / thước đo). Chỉ GỢI Ý — lưu vào checklist, người tự áp vào thẻ. */
export async function aiFix(userId: number, projectId: number, num: number, input: { language?: 'vi' | 'en' } = {}) {
  const ctx = await srsCtx(userId, projectId, 'edit');
  const i = await reqIssue(projectId, num);
  const row = (await qualityRows(projectId)).find((r) => r.issueId === i.id)!;
  const failing = row.criteria.filter((c) => c.status === 'fail');
  if (!failing.length) throw new BadRequestError('This requirement already passes every automatic check', 'WORK_QUALITY_OK');
  const { askerFor } = await import('./swrElic.service.js');
  const ask = await askerFor(userId, ctx.isAgent, can(ctx.access.role, 'ai.use', ctx.access.options, ctx.access.principal));
  const p = aiFixPrompt({ language: input.language ?? 'en', key: row.key, title: i.title, text: i.descriptionText ?? '', reqType: i.requirementInfo?.reqType ?? null, failing, vague: row.vague });
  const { extractJson } = await import('../interview/llm/index.js');
  let out: z.infer<typeof aiFixOut> | null = null;
  let model: string | null = null;
  let user = p.user;
  for (let attempt = 0; attempt < 2 && !out; attempt++) {
    const r = await ask(p.system, user);
    model = r.model;
    try { const v = aiFixOut.safeParse(extractJson(r.text)); if (v.success) out = v.data; } catch { /* hỏi lại */ }
    if (!out) user = `${p.user}\n\nYour previous answer was not valid JSON of the requested shape. Answer with the JSON object only.`;
  }
  if (!out) throw new AppError('The AI answer could not be read — try again', 422, 'WORK_AI_BAD_ANSWER');
  const saved = { ...out, at: new Date().toISOString(), failing: failing.map((f) => f.key) };
  await prisma.workReqQuality.upsert({
    where: { issueId: i.id },
    create: { issueId: i.id, projectId, aiSuggestion: saved as unknown as Prisma.InputJsonValue, aiModel: model?.slice(0, 80) ?? null },
    update: { aiSuggestion: saved as unknown as Prisma.InputJsonValue, aiModel: model?.slice(0, 80) ?? null },
  });
  touch(projectId, userId);
  return { suggestion: saved, model };
}

export async function exportQuality(userId: number, projectId: number) {
  await srsCtx(userId, projectId, 'view');
  const p = await projectInfo(projectId);
  const rows = await qualityRows(projectId);
  const sh = new XSheet('Quality checklist');
  const cols = ['ID', 'Requirement', 'Type', ...QUALITY_CRITERIA.map((c) => c.charAt(0).toUpperCase() + c.slice(1)), 'Score', 'Findings'];
  [12, 50, 14, ...QUALITY_CRITERIA.map(() => 12), 8, 60].forEach((w, i) => sh.width(i + 1, w));
  sh.set(1, 1, `Requirements quality checklist — ${p.name}`, { font: XF(12, true) });
  cols.forEach((h, i) => sh.set(3, i + 1, h, HEAD));
  rows.forEach((r, k) => {
    let c = 1;
    sh.set(4 + k, c++, r.key, CELL); sh.set(4 + k, c++, r.title, CELL); sh.set(4 + k, c++, r.reqType ?? '', CELL);
    for (const q of QUALITY_CRITERIA) {
      const x = r.criteria.find((y) => y.key === q)!;
      sh.set(4 + k, c++, x.status === 'pass' ? 'OK' : x.status === 'fail' ? 'NG' : '?', x.status === 'pass' ? PASS : x.status === 'fail' ? FAIL : OPEN);
    }
    sh.set(4 + k, c++, r.score, CELL);
    sh.set(4 + k, c++, r.criteria.filter((x) => x.status !== 'pass').map((x) => `${x.key}: ${x.reasons.map((y) => y.code + (y.params ? ` (${Object.values(y.params).join(', ')})` : '')).join('; ') || 'not checked'}`).join('\n'), CELL);
  });
  sh.freeze = { col: 2, row: 3 };
  return { buffer: writeXlsx([sh], { title: `Quality checklist — ${p.name}`, creator: 'CT Work' }), file: `${p.key}_Requirements_Quality_Checklist.xlsx` };
}

// ═══ R7 NFR có số đo ═════════════════════════════════════════════

export const nfrInput = z.object({
  characteristic: z.enum(ISO_CHARACTERISTICS),
  subCharacteristic: z.string().max(48).nullable().optional(),
  scale: z.string().trim().min(3).max(1000),
  meter: z.string().trim().min(3).max(1000),
  unit: z.string().max(24).nullable().optional(),
  comparator: z.enum(COMPARATORS).optional(),
  mustValue: z.number().finite().nullable().optional(),
  planValue: z.number().finite().nullable().optional(),
  wishValue: z.number().finite().nullable().optional(),
  conditions: z.string().max(2000).nullable().optional(),
  verification: z.enum(VERIFICATIONS).optional(),
});

const specLite = (s: Prisma.WorkNfrSpecGetPayload<object>): NfrSpecLite => ({
  characteristic: s.characteristic, subCharacteristic: s.subCharacteristic, scale: s.scale, meter: s.meter, unit: s.unit, comparator: s.comparator,
  mustValue: s.mustValue, planValue: s.planValue, wishValue: s.wishValue, conditions: s.conditions, verification: s.verification,
});

export async function nfrList(userId: number, projectId: number) {
  const ctx = await srsCtx(userId, projectId, 'view');
  const { key } = await projectInfo(projectId);
  const rows = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { key: 'REQUIREMENT' }, OR: [{ requirementInfo: { reqType: 'QUALITY' } }, { nfrSpec: { isNot: null } }] },
    orderBy: { number: 'asc' }, take: 1000, select: { id: true, number: true, title: true, descriptionText: true, requirementInfo: { select: { subtype: true, priority: true, lifecycle: true } }, nfrSpec: true },
  });
  return {
    requirements: rows.map((r) => ({
      number: r.number, key: `${key}-${r.number}`, title: r.title, text: (r.descriptionText ?? '').slice(0, 400), subtype: r.requirementInfo?.subtype ?? null, priority: r.requirementInfo?.priority ?? null,
      lifecycle: r.requirementInfo?.lifecycle ?? 'PROPOSED', spec: r.nfrSpec ? specLite(r.nfrSpec) : null, statement: r.nfrSpec ? nfrStatement(specLite(r.nfrSpec)) : null,
      suggestedCharacteristic: r.requirementInfo?.subtype ? WIEGERS_TO_ISO[r.requirementInfo.subtype] ?? null : null,
    })),
    characteristics: ISO_CHARACTERISTICS.map((c) => ({ key: c, label: ISO_LABEL[c], subs: ISO_SUBS[c] })),
    templates: NFR_TEMPLATES, comparators: COMPARATORS, verifications: VERIFICATIONS,
    measured: rows.filter((r) => r.nfrSpec?.mustValue !== null && r.nfrSpec?.mustValue !== undefined).length,
    canEdit: ctx.canEdit,
  };
}

export async function setNfr(userId: number, projectId: number, num: number, input: z.infer<typeof nfrInput>) {
  await srsCtx(userId, projectId, 'edit');
  const i = await reqIssue(projectId, num);
  if (input.subCharacteristic && !ISO_SUBS[input.characteristic].includes(input.subCharacteristic)) throw new BadRequestError(`"${input.subCharacteristic}" is not a sub-characteristic of ${ISO_LABEL[input.characteristic]} (${ISO_SUBS[input.characteristic].join(', ')})`, 'VALIDATION_ERROR');
  const { setRequirementInfo } = await import('./swr.service.js');
  if (!i.requirementInfo) await setRequirementInfo(userId, projectId, num, { reqType: 'QUALITY', subtype: ISO_TO_WIEGERS[input.characteristic] });
  else if (i.requirementInfo.reqType !== 'QUALITY') throw new BadRequestError(`${i.title} is classified as ${i.requirementInfo.reqType.toLowerCase().replace('_', ' ')} — change its type to Quality attribute first`, 'WORK_NOT_QUALITY');
  const data = {
    characteristic: input.characteristic, subCharacteristic: input.subCharacteristic ?? null, scale: input.scale.trim(), meter: input.meter.trim(), unit: clean(input.unit, 24),
    comparator: input.comparator ?? '<=', mustValue: input.mustValue ?? null, planValue: input.planValue ?? null, wishValue: input.wishValue ?? null,
    conditions: clean(input.conditions, 2000), verification: input.verification ?? 'TEST', updatedById: userId,
  };
  const s = await prisma.workNfrSpec.upsert({ where: { issueId: i.id }, create: { issueId: i.id, projectId, ...data }, update: data });
  touch(projectId, userId);
  return { spec: specLite(s), statement: nfrStatement(specLite(s)) };
}

export async function deleteNfr(userId: number, projectId: number, num: number) {
  const ctx = await srsCtx(userId, projectId, 'edit');
  if (ctx.isAgent) throw new ForbiddenError('An AI agent cannot remove a quality metric');
  const i = await reqIssue(projectId, num);
  await prisma.workNfrSpec.deleteMany({ where: { issueId: i.id } });
  touch(projectId, userId);
  return { deleted: true };
}

/** Mẫu NFR ⇒ thẻ REQUIREMENT (Quality attribute) + thước đo, một chạm. Người sửa số cho dự án mình. */
export async function createNfrFromTemplate(userId: number, projectId: number, input: { template: string; title?: string | null }) {
  await srsCtx(userId, projectId, 'edit');
  const t = NFR_TEMPLATES.find((x) => x.id === input.template);
  if (!t) throw new BadRequestError(`Unknown template "${input.template}"`, 'VALIDATION_ERROR');
  const { typeIdFromKey } = await import('./issueRefs.js');
  const { createIssueAs } = await import('./issues.service.js');
  const typeId = await typeIdFromKey(projectId, 'REQUIREMENT');
  const issue = await createIssueAs(userId, projectId, { typeId, title: (input.title?.trim() || t.title).slice(0, 255) });
  await setNfr(userId, projectId, issue.number, { characteristic: t.characteristic, subCharacteristic: t.sub, scale: t.scale, meter: t.meter, unit: t.unit, comparator: t.comparator, mustValue: t.must, planValue: t.plan, conditions: t.conditions, verification: t.verification });
  const { key } = await projectInfo(projectId);
  return { number: issue.number, key: `${key}-${issue.number}` };
}

// ═══ Dữ liệu cho SRS Wiegers ═════════════════════════════════════

/** Mô hình đã duyệt + sự kiện + NFR + stakeholder + prototype đã xác nhận. KHÔNG kiểm quyền (nơi gọi kiểm). */
export async function srsDeepData(projectId: number): Promise<SrsDeepData> {
  const { loadStakeholders } = await import('./swrElic.service.js');
  const { approvedDiagrams } = await import('./diagrams.service.js');
  const [{ key }, stakeholders, maps, approved, srs, nfrRows, mockups] = await Promise.all([
    projectInfo(projectId), loadStakeholders(projectId), prisma.workSrsModel.findMany({ where: { projectId } }), approvedDiagrams(projectId), loadSrs(projectId),
    prisma.workIssue.findMany({ where: { projectId, deletedAt: null, type: { key: 'REQUIREMENT' }, nfrSpec: { isNot: null } }, orderBy: { number: 'asc' }, select: { number: true, title: true, requirementInfo: { select: { subtype: true, priority: true, lifecycle: true } }, nfrSpec: true } }),
    prisma.workScreenMockup.findMany({ where: { projectId, status: 'APPROVED' }, orderBy: [{ screenId: 'asc' }, { id: 'asc' }], include: { screen: { select: { name: true, position: true } } } }),
  ]);
  const byId = new Map<number, PlacedDiagram>(approved.map((d) => [d.id, d]));
  const models = maps.filter((m) => byId.has(m.diagramId)).sort((a, b) => a.kind.localeCompare(b.kind) || a.subject.localeCompare(b.subject)).map((m) => ({ kind: m.kind, subject: m.subject, diagram: byId.get(m.diagramId)! }));
  return {
    projectId, stakeholders, models,
    events: eventResponseTable({ actors: srs.actors, useCases: srs.useCases }),
    nfr: nfrRows.filter((r) => r.requirementInfo?.lifecycle !== 'DELETED' && r.requirementInfo?.lifecycle !== 'REJECTED').map((r) => ({ key: `${key}-${r.number}`, title: r.title, subtype: r.requirementInfo?.subtype ?? null, priority: r.requirementInfo?.priority ?? null, spec: specLite(r.nfrSpec!) })),
    mockups: mockups.sort((a, b) => a.screen.position - b.screen.position || a.id - b.id).map((m) => ({ screen: m.screen.name, title: m.title, kind: m.kind, src: m.imageId ? imgSrc(projectId, m.imageId) : null, url: m.url, status: m.status, reviewer: m.reviewerName ? `${m.reviewerName}${m.reviewerRole === 'CLIENT' ? ' (client)' : m.reviewerRole === 'LECTURER' ? ' (lecturer)' : ''}` : null })),
  };
}

/** Diagram id ⇒ loại mô hình SRS (cho Report 3 §1.1 Context Diagram — diagrams.service.approvedDiagrams). */
export async function srsModelKinds(projectId: number): Promise<Map<number, string>> {
  const rows = await prisma.workSrsModel.findMany({ where: { projectId }, select: { diagramId: true, kind: true } });
  return new Map(rows.map((r) => [r.diagramId, r.kind]));
}
