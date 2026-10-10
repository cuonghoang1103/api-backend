/**
 * CT Work đợt 6 — RV: PHIÊN REVIEW / INSPECTION + BASELINE YÊU CẦU/TÀI LIỆU + CR ↔ YÊU CẦU (R18–R22, T2, T13).
 *
 *   - Phiên review cho tài liệu (trang Docs: SRS/SDD/test plan…) và cho code (link PR): vai moderator/author/reviewer/
 *     scribe/reader, checklist theo loại sản phẩm (reviewRules.ts), mỗi câu OK/NG/NA + dòng + ghi chú; câu NG ⇒ "Log
 *     defect" tạo thẻ Bug vào DEFECT LOG thống nhất của đợt 4 (activity Review, product theo tài liệu, reviewSessionId).
 *     Số đo trang/giờ, lỗi/trang, hiệu suất (lỗi/người-giờ); biên bản xuất docx/pdf.
 *   - Baseline: chụp REQ/UC/BR/Docs ⇒ hash ⇒ người ký phê duyệt (hash + IP) ⇒ APPROVED = đóng băng (locked). Sửa mục đã
 *     baseline ⇒ 409 WORK_BASELINED trừ khi có CR APPROVED liệt kê mục đó (work_cr_affected_refs). So sánh baseline ↔
 *     baseline / hiện tại (thêm/bỏ/đổi + độ biến động).
 *
 * Quyền: xem = người của ĐỘI (khách cổng ⇒ 403 WORK_INTERNAL_ONLY); sửa = issue.edit; ký baseline = người được mời ký
 * (người, không phải agent).
 */

import crypto from 'node:crypto';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { notifyWork } from '../notification.service.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { displayName, PUBLIC_USER } from './common.js';
import { PRODUCTS, productOf } from './fptReports.js';
import { assertHumanActor, isClientScoped, loadProjectAccess, requireProject, type ProjectAccess } from './permissions.js';
import { projectLanguage } from './projectLanguage.js';
import {
  checklistByKey, checklistItems, CHECKLISTS, closeBlockers, REVIEW_FLOW, reviewMetrics, reviewMinutesMarkdown, type ReviewStatus,
} from './reviewRules.js';
import { baselineHash, diffBaselines, itemHash, signoffOutcome, type BaselineItem, type BaselineKind } from './baselineRules.js';

type Tx = Prisma.TransactionClient;

async function teamCtx(userId: number, projectId: number, action: 'project.view' | 'issue.edit' | 'issue.create' = 'project.view'): Promise<ProjectAccess> {
  const access = await requireProject(userId, projectId, action);
  if (isClientScoped(access) || access.role === 'CLIENT') throw new AppError('This part of the project is only available to the project team', 403, 'WORK_INTERNAL_ONLY');
  return access;
}

async function nextNo(tx: Tx, table: 'review' | 'baseline', projectId: number): Promise<number> {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${table === 'review' ? 31061 : 31062}::int, ${projectId}::int)`;
  const agg = table === 'review'
    ? await tx.workReviewSession.aggregate({ where: { projectId }, _max: { number: true } })
    : await tx.workBaseline.aggregate({ where: { projectId }, _max: { number: true } });
  return (agg._max.number ?? 0) + 1;
}

async function assertMembers(projectId: number, ids: number[]) {
  for (const id of [...new Set(ids)]) {
    const a = await loadProjectAccess(id, projectId);
    if (!a || a.role === 'CLIENT' || isClientScoped(a)) throw new BadRequestError(`User #${id} is not a member of the project team`, 'WORK_BAD_PARTICIPANT');
  }
}

const usersById = async (ids: number[]) => new Map((await prisma.user.findMany({ where: { id: { in: [...new Set(ids)] } }, select: PUBLIC_USER })).map((u) => [u.id, u]));

// ═══ REVIEW / INSPECTION ═════════════════════════════════════════

export function listChecklists(language: 'vi' | 'en' = 'en') {
  const i = language === 'vi' ? 1 : 0;
  return CHECKLISTS.map((c) => ({ key: c.key, kind: c.kind, name: c.name[i], source: c.source, sizeUnit: c.sizeUnit, sections: c.sections.map((s) => ({ name: s.name[i], items: s.items.length })), items: checklistItems(c.key, language).length }));
}

export interface ReviewInput {
  title: string; kind: 'DOC' | 'CODE'; method: string; checklistKey: string;
  pageNumber?: number | null; workProduct?: string | null; prUrl?: string | null; size?: number | null;
  meetingAt?: Date | null; entryCriteria?: string | null; exitCriteria?: string | null;
  participants?: Array<{ userId: number; role: string }>; language?: 'vi' | 'en';
}

async function sessionOf(projectId: number, number: number) {
  const s = await prisma.workReviewSession.findFirst({ where: { projectId, number, deletedAt: null } });
  if (!s) throw new NotFoundError('Review not found');
  return s;
}

export async function listReviews(userId: number, projectId: number) {
  const access = await teamCtx(userId, projectId);
  const rows = await prisma.workReviewSession.findMany({
    where: { projectId, deletedAt: null }, orderBy: { number: 'desc' }, take: 500,
    include: { participants: true, items: { select: { result: true, severity: true } } },
  });
  return rows.map((s) => {
    const m = reviewMetrics({ size: s.size, sizeUnit: s.sizeUnit as 'PAGE' | 'LOC', meetingMinutes: s.meetingMinutes, reworkMinutes: s.reworkMinutes, participants: s.participants, items: s.items });
    return {
      number: s.number, key: `REV-${s.number}`, projectKey: access.key, title: s.title, kind: s.kind, method: s.method, checklistKey: s.checklistKey,
      status: s.status, decision: s.decision, workProduct: s.workProduct, meetingAt: s.meetingAt, createdAt: s.createdAt, closedAt: s.closedAt,
      participants: s.participants.length, defects: m.defects, progress: m.checklistProgress, rate: m.rate, density: m.density, efficiency: m.efficiency,
    };
  });
}

export async function getReview(userId: number, projectId: number, number: number) {
  const access = await teamCtx(userId, projectId);
  const s = await prisma.workReviewSession.findFirst({
    where: { projectId, number, deletedAt: null },
    include: { participants: { orderBy: { id: 'asc' } }, items: { orderBy: { position: 'asc' } } },
  });
  if (!s) throw new NotFoundError('Review not found');
  const users = await usersById(s.participants.map((p) => p.userId));
  const bugIds = s.items.map((i) => i.defectIssueId).filter((x): x is number => !!x);
  const bugs = new Map((await prisma.workIssue.findMany({ where: { id: { in: bugIds } }, select: { id: true, number: true, title: true, resolvedAt: true, deletedAt: true } })).map((b) => [b.id, b]));
  const page = s.pageId ? await prisma.workPage.findFirst({ where: { id: s.pageId, projectId }, select: { number: true, title: true, deletedAt: true } }) : null;
  const metrics = reviewMetrics({ size: s.size, sizeUnit: s.sizeUnit as 'PAGE' | 'LOC', meetingMinutes: s.meetingMinutes, reworkMinutes: s.reworkMinutes, participants: s.participants, items: s.items });
  const c = checklistByKey(s.checklistKey);
  return {
    number: s.number, key: `REV-${s.number}`, projectKey: access.key, title: s.title, kind: s.kind, method: s.method,
    checklistKey: s.checklistKey, checklistName: c ? c.name[0] : s.checklistKey, checklistSource: c?.source ?? null,
    page: page && !page.deletedAt ? { number: page.number, title: page.title } : null,
    workProduct: s.workProduct, prUrl: s.prUrl, size: s.size, sizeUnit: s.sizeUnit, status: s.status, decision: s.decision,
    meetingAt: s.meetingAt, meetingMinutes: s.meetingMinutes, reworkMinutes: s.reworkMinutes,
    entryCriteria: s.entryCriteria, exitCriteria: s.exitCriteria, notes: s.notes, createdAt: s.createdAt, updatedAt: s.updatedAt, closedAt: s.closedAt,
    participants: s.participants.map((p) => ({ id: p.id, userId: p.userId, role: p.role, prepMinutes: p.prepMinutes, user: users.get(p.userId) ?? null })),
    items: s.items.map((i) => {
      const b = i.defectIssueId ? bugs.get(i.defectIssueId) : null;
      return { id: i.id, position: i.position, section: i.section, question: i.question, result: i.result, line: i.line, note: i.note, severity: i.severity, defect: b && !b.deletedAt ? { number: b.number, key: `${access.key}-${b.number}`, title: b.title, done: !!b.resolvedAt } : null };
    }),
    metrics, next: REVIEW_FLOW[s.status as ReviewStatus] ?? [],
    closeBlockers: closeBlockers({ decision: s.decision, items: s.items, participants: s.participants }),
    canEdit: access.role === 'ADMIN' || access.role === 'MEMBER',
  };
}

export async function createReview(userId: number, projectId: number, input: ReviewInput) {
  await assertHumanActor(userId, 'run review meetings');
  const access = await teamCtx(userId, projectId, 'issue.edit');
  const c = checklistByKey(input.checklistKey);
  if (!c) throw new BadRequestError('Unknown checklist', 'VALIDATION_ERROR');
  if (input.kind === 'CODE' && input.prUrl && !/^https?:\/\//i.test(input.prUrl)) throw new BadRequestError('The pull request link must start with http(s)://', 'VALIDATION_ERROR');
  let pageId: number | null = null, workProduct = input.workProduct?.trim() || null;
  if (input.pageNumber) {
    const p = await prisma.workPage.findFirst({ where: { projectId, number: input.pageNumber, deletedAt: null }, select: { id: true, title: true, number: true } });
    if (!p) throw new NotFoundError('Document not found');
    pageId = p.id;
    workProduct ??= `Doc ${p.number}: ${p.title}`.slice(0, 200);
  }
  const participants = input.participants?.length ? input.participants : [{ userId, role: 'MODERATOR' }];
  await assertMembers(projectId, participants.map((p) => p.userId));
  const language = input.language ?? ((await projectLanguage(projectId)) === 'vi' ? 'vi' : 'en');
  const items = checklistItems(c.key, language);
  const number = await prisma.$transaction(async (tx) => {
    const n = await nextNo(tx, 'review', projectId);
    await tx.workReviewSession.create({
      data: {
        projectId, number: n, title: input.title.trim().slice(0, 200), kind: input.kind, method: input.method, checklistKey: c.key,
        pageId, workProduct, prUrl: input.prUrl?.trim() || null, size: input.size ?? null, sizeUnit: c.sizeUnit,
        meetingAt: input.meetingAt ?? null, entryCriteria: input.entryCriteria?.trim() || null, exitCriteria: input.exitCriteria?.trim() || null,
        createdById: userId,
        participants: { create: [...new Map(participants.map((p) => [`${p.userId}:${p.role}`, p])).values()].map((p) => ({ userId: p.userId, role: p.role })) },
        items: { create: items.map((q, position) => ({ position, section: q.section, question: q.question })) },
      },
    });
    return n;
  });
  await auditProject(projectId, { actorId: userId, action: 'review.create', targetType: 'review', targetId: number, summary: `Opened review REV-${number}: ${input.title}` });
  void access;
  return getReview(userId, projectId, number);
}

export interface ReviewPatch {
  title?: string; method?: string; workProduct?: string | null; prUrl?: string | null; size?: number | null;
  meetingAt?: Date | null; meetingMinutes?: number | null; reworkMinutes?: number | null;
  entryCriteria?: string | null; exitCriteria?: string | null; notes?: string | null; decision?: string | null;
}

export async function updateReview(userId: number, projectId: number, number: number, patch: ReviewPatch) {
  await teamCtx(userId, projectId, 'issue.edit');
  const s = await sessionOf(projectId, number);
  if (s.status === 'CLOSED' && Object.keys(patch).some((k) => k !== 'notes')) throw new ConflictError('This review is closed — reopen is not possible; start a re-inspection instead');
  const data: Prisma.WorkReviewSessionUpdateInput = {};
  if (patch.title !== undefined) data.title = patch.title.trim().slice(0, 200);
  for (const k of ['method', 'size', 'meetingAt', 'meetingMinutes', 'reworkMinutes', 'decision'] as const) if (patch[k] !== undefined) (data as Record<string, unknown>)[k] = patch[k];
  for (const k of ['workProduct', 'prUrl', 'entryCriteria', 'exitCriteria', 'notes'] as const) if (patch[k] !== undefined) (data as Record<string, unknown>)[k] = patch[k]?.trim() || null;
  if (patch.prUrl && !/^https?:\/\//i.test(patch.prUrl)) throw new BadRequestError('The pull request link must start with http(s)://', 'VALIDATION_ERROR');
  await prisma.workReviewSession.update({ where: { id: s.id }, data });
  return getReview(userId, projectId, number);
}

export async function setParticipants(userId: number, projectId: number, number: number, list: Array<{ userId: number; role: string; prepMinutes?: number | null }>) {
  await teamCtx(userId, projectId, 'issue.edit');
  const s = await sessionOf(projectId, number);
  if (s.status === 'CLOSED') throw new ConflictError('This review is closed');
  await assertMembers(projectId, list.map((p) => p.userId));
  const uniq = [...new Map(list.map((p) => [`${p.userId}:${p.role}`, p])).values()];
  await prisma.$transaction([
    prisma.workReviewParticipant.deleteMany({ where: { sessionId: s.id } }),
    prisma.workReviewParticipant.createMany({ data: uniq.map((p) => ({ sessionId: s.id, userId: p.userId, role: p.role, prepMinutes: p.prepMinutes ?? null })) }),
  ]);
  return getReview(userId, projectId, number);
}

export async function saveItems(
  userId: number, projectId: number, number: number,
  input: { items?: Array<{ id: number; result?: string | null; line?: string | null; note?: string | null; severity?: string | null }>; add?: Array<{ section: string; question: string }> },
) {
  await teamCtx(userId, projectId, 'issue.edit');
  const s = await sessionOf(projectId, number);
  if (s.status === 'CLOSED') throw new ConflictError('This review is closed');
  const own = new Set((await prisma.workReviewItem.findMany({ where: { sessionId: s.id }, select: { id: true } })).map((x) => x.id));
  await prisma.$transaction(async (tx) => {
    for (const it of input.items ?? []) {
      if (!own.has(it.id)) throw new NotFoundError('Checklist item not found');
      const data: Prisma.WorkReviewItemUpdateInput = {};
      if (it.result !== undefined) data.result = it.result;
      if (it.line !== undefined) data.line = it.line?.trim().slice(0, 60) || null;
      if (it.note !== undefined) data.note = it.note?.trim() || null;
      if (it.severity !== undefined) data.severity = it.severity;
      await tx.workReviewItem.update({ where: { id: it.id }, data });
    }
    if (input.add?.length) {
      const max = (await tx.workReviewItem.aggregate({ where: { sessionId: s.id }, _max: { position: true } }))._max.position ?? -1;
      await tx.workReviewItem.createMany({ data: input.add.map((a, i) => ({ sessionId: s.id, position: max + 1 + i, section: a.section.trim().slice(0, 120), question: a.question.trim() })) });
    }
    await tx.workReviewSession.update({ where: { id: s.id }, data: { updatedAt: new Date() } });
  });
  return getReview(userId, projectId, number);
}

export async function transitionReview(userId: number, projectId: number, number: number, to: ReviewStatus) {
  await teamCtx(userId, projectId, 'issue.edit');
  const s = await prisma.workReviewSession.findFirst({ where: { projectId, number, deletedAt: null }, include: { participants: true, items: true } });
  if (!s) throw new NotFoundError('Review not found');
  if (!(REVIEW_FLOW[s.status as ReviewStatus] ?? []).includes(to)) throw new ConflictError(`A review in ${s.status} cannot move to ${to}`);
  if (to === 'CLOSED') {
    const why = closeBlockers({ decision: s.decision, items: s.items, participants: s.participants });
    if (why.length) throw new AppError(`Cannot close the review yet: ${why.join(', ')}`, 409, 'WORK_REVIEW_NOT_READY', { blockers: why });
    if (s.decision === 'REINSPECT') throw new AppError('The decision is "re-inspect" — move it to Rework and hold the meeting again instead of closing', 409, 'WORK_REVIEW_REINSPECT');
  }
  await prisma.workReviewSession.update({ where: { id: s.id }, data: { status: to, ...(to === 'CLOSED' ? { closedAt: new Date() } : {}) } });
  await auditProject(projectId, { actorId: userId, action: 'review.status', targetType: 'review', targetId: s.id, summary: `REV-${number}: ${s.status} → ${to}` });
  return getReview(userId, projectId, number);
}

export async function deleteReview(userId: number, projectId: number, number: number) {
  const access = await teamCtx(userId, projectId, 'issue.edit');
  const s = await sessionOf(projectId, number);
  if (s.createdById !== userId && access.role !== 'ADMIN') throw new ForbiddenError('Only the person who opened the review or a project admin can delete it');
  await prisma.workReviewSession.update({ where: { id: s.id }, data: { deletedAt: new Date() } });
  return { ok: true };
}

/** Câu NG ⇒ thẻ Bug trong defect log (activity Review). Bấm lại ⇒ trả thẻ đã có. */
export async function logReviewDefect(userId: number, projectId: number, number: number, itemId: number, input: { severity?: string | null; title?: string | null } = {}) {
  const access = await teamCtx(userId, projectId, 'issue.create');
  const s = await sessionOf(projectId, number);
  const item = await prisma.workReviewItem.findFirst({ where: { id: itemId, sessionId: s.id } });
  if (!item) throw new NotFoundError('Checklist item not found');
  if (item.result !== 'NG') throw new BadRequestError('Only items marked NG become defects', 'WORK_REVIEW_NOT_NG');
  if (item.defectIssueId) {
    const b = await prisma.workIssue.findFirst({ where: { id: item.defectIssueId, deletedAt: null }, select: { number: true, title: true } });
    if (b) return { created: false, number: b.number, key: `${access.key}-${b.number}`, title: b.title };
  }
  const bugType = await prisma.workIssueType.findFirst({ where: { projectId, key: 'BUG', archived: false }, select: { id: true } });
  if (!bugType) throw new BadRequestError('This project has no Bug issue type — add one in the project settings', 'WORK_NO_BUG_TYPE');
  const page = s.pageId ? await prisma.workPage.findFirst({ where: { id: s.pageId }, select: { number: true, title: true, templateKey: true } }) : null;
  const severity = input.severity ?? item.severity ?? 'MINOR';
  const where = s.kind === 'CODE' ? (s.prUrl ?? s.workProduct ?? 'Code') : (page ? `Doc ${page.number}: ${page.title}` : s.workProduct ?? 'Document');
  const title = (input.title?.trim() || `[REV-${s.number}] ${item.question}`).replace(/\s+/g, ' ').slice(0, 250);
  const p = (text: string, bold = false) => ({ type: 'paragraph', content: text ? [bold ? { type: 'text', text, marks: [{ type: 'bold' }] } : { type: 'text', text }] : [] });
  const descriptionJson = {
    type: 'doc',
    content: [
      p(`Found in review REV-${s.number} (${s.method.toLowerCase()}) — ${s.title}`, true),
      p(`Where: ${where}${item.line ? ` · line/location ${item.line}` : ''}`),
      p('Checklist item:', true), p(`${item.section} — ${item.question}`),
      ...(item.note ? [p('Reviewer note:', true), p(item.note.slice(0, 2000))] : []),
    ],
  } as Prisma.InputJsonValue;
  const { createIssueAs } = await import('./issues.service.js');
  const issue = await createIssueAs(userId, projectId, { typeId: bugType.id, title, descriptionJson });
  const product = s.kind === 'CODE' ? PRODUCTS[0] : page ? productOf(`${page.templateKey ?? ''} ${page.title}`.replace(/fpt-report(\d)/, 'report $1')) : PRODUCTS[3];
  await prisma.$transaction([
    prisma.workDefectInfo.upsert({
      where: { issueId: issue.id },
      create: {
        issueId: issue.id, projectId, severity, activity: 'Review', product: s.kind === 'DOC' && product === PRODUCTS[0] ? PRODUCTS[3] : product,
        productDetails: `REV-${s.number} · ${where}${item.line ? ` · ${item.line}` : ''}`.slice(0, 300), reviewSessionId: s.id,
        injectedPhase: s.kind === 'CODE' ? 'CODING' : /sdd|design|report\s*4/i.test(`${page?.title ?? ''} ${s.checklistKey}`) ? 'DESIGN' : 'REQUIREMENT',
      },
      update: { severity, activity: 'Review', reviewSessionId: s.id },
    }),
    prisma.workReviewItem.update({ where: { id: item.id }, data: { defectIssueId: issue.id, severity } }),
  ]);
  await auditProject(projectId, { actorId: userId, action: 'review.defect', targetType: 'issue', targetId: issue.id, summary: `REV-${s.number} item ${item.position + 1} logged as ${access.key}-${issue.number}` });
  return { created: true, number: issue.number, key: `${access.key}-${issue.number}`, title };
}

export async function exportReviewMinutes(userId: number, projectId: number, number: number, format: 'docx' | 'pdf', language: 'vi' | 'en') {
  const access = await teamCtx(userId, projectId);
  const r = await getReview(userId, projectId, number);
  const project = await prisma.workProject.findUniqueOrThrow({ where: { id: projectId }, select: { name: true, key: true } });
  const c = checklistByKey(r.checklistKey);
  const md = reviewMinutesMarkdown({
    language, project,
    session: { key: r.key, title: r.title, kind: r.kind, method: r.method, checklistName: c ? c.name[language === 'vi' ? 1 : 0] : r.checklistKey, workProduct: r.workProduct, prUrl: r.prUrl, status: r.status, decision: r.decision, meetingAt: r.meetingAt, entryCriteria: r.entryCriteria, exitCriteria: r.exitCriteria, notes: r.notes },
    participants: r.participants.map((p) => ({ name: p.user ? displayName(p.user) : `#${p.userId}`, role: p.role, prepMinutes: p.prepMinutes })),
    items: r.items.map((i) => ({ section: i.section, question: i.question, result: i.result, line: i.line, note: i.note, severity: i.severity, defectKey: i.defect?.key ?? null })),
    metrics: r.metrics,
  });
  const { markdownToTiptap } = await import('./docMarkdown.js');
  const { renderDocx, renderPdf } = await import('./docExport.js');
  const doc = markdownToTiptap(md).doc;
  const meta = { title: `${language === 'vi' ? 'Biên bản rà soát' : 'Review record'} ${r.key} — ${r.title}`, projectName: project.name, projectKey: project.key, docLabel: r.key, version: null, date: r.meetingAt ?? r.createdAt, capstone: false };
  const opts = { stripGuides: true, toc: false, cover: false, resolveImage: async () => null };
  const buffer = format === 'docx' ? await renderDocx(doc, meta, opts) : await renderPdf(doc, meta, opts);
  void access;
  return { buffer, file: `${project.key}_${r.key}_Review_Record.${format}`, markdown: md };
}

// ═══ BASELINE ════════════════════════════════════════════════════

export interface BaselineScope { requirements?: boolean; useCases?: boolean; businessRules?: boolean; pageNumbers?: number[] }

/** Ảnh chụp hiện tại của các mục yêu cầu/tài liệu. */
export async function currentItems(projectId: number, scope: BaselineScope, key: string): Promise<BaselineItem[]> {
  const out: BaselineItem[] = [];
  if (scope.requirements !== false) {
    const reqs = await prisma.workIssue.findMany({
      where: { projectId, deletedAt: null, type: { key: 'REQUIREMENT' } }, orderBy: { number: 'asc' }, take: 5000,
      select: { id: true, number: true, title: true, descriptionText: true, priority: true, version: true, requirementInfo: { select: { reqType: true, subtype: true, priority: true, lifecycle: true, source: true, stability: true, reqVersion: true } } },
    });
    for (const r of reqs) {
      const ri = r.requirementInfo;
      out.push({ kind: 'REQ', refId: r.id, ref: `${key}-${r.number}`, title: r.title, version: ri ? `v${ri.reqVersion}` : `r${r.version}`, hash: itemHash({ t: r.title, d: r.descriptionText ?? '', p: r.priority, ri: ri ? { ...ri, reqVersion: undefined } : null }) });
    }
  }
  if (scope.useCases !== false) {
    const ucs = await prisma.workUseCase.findMany({ where: { projectId, status: { not: 'REJECTED' } }, orderBy: { number: 'asc' }, take: 2000 });
    for (const u of ucs) {
      out.push({ kind: 'UC', refId: u.id, ref: `UC-${String(u.number).padStart(2, '0')}`, title: u.name, version: `r${u.version}`, hash: itemHash({ n: u.name, f: u.feature, a: u.primaryActorId, s: u.secondaryActorIds, t: u.trigger, d: u.description, pre: u.preconditions, post: u.postconditions, nf: u.normalFlow, af: u.alternativeFlows, ef: u.exceptionFlows, p: u.priority }) });
    }
  }
  if (scope.businessRules !== false) {
    const brs = await prisma.workBusinessRule.findMany({ where: { projectId, status: { not: 'REJECTED' } }, orderBy: { number: 'asc' }, take: 2000 });
    for (const b of brs) out.push({ kind: 'BR', refId: b.id, ref: `BR-${String(b.number).padStart(2, '0')}`, title: b.name, version: `r${b.version}`, hash: itemHash({ n: b.name, d: b.definition, c: b.category }) });
  }
  if (scope.pageNumbers?.length) {
    const pages = await prisma.workPage.findMany({ where: { projectId, number: { in: scope.pageNumbers }, deletedAt: null }, orderBy: { number: 'asc' }, select: { id: true, number: true, title: true, contentText: true, version: true } });
    for (const p of pages) out.push({ kind: 'DOC', refId: p.id, ref: `DOC-${p.number}`, title: p.title, version: `v${p.version}`, hash: itemHash({ t: p.title, c: p.contentText ?? '' }) });
  }
  return out;
}

interface Snapshot { scope: BaselineScope; items: BaselineItem[] }
const snapOf = (v: unknown): Snapshot => (v && typeof v === 'object' ? (v as Snapshot) : { scope: {}, items: [] });

async function baselineOf(projectId: number, number: number) {
  const b = await prisma.workBaseline.findFirst({ where: { projectId, number }, include: { signoffs: { orderBy: { id: 'asc' } } } });
  if (!b) throw new NotFoundError('Baseline not found');
  return b;
}

async function baselineView(b: Awaited<ReturnType<typeof baselineOf>>, withItems: boolean) {
  const users = await usersById(b.signoffs.map((s) => s.userId).concat(b.createdById ? [b.createdById] : []));
  const snap = snapOf(b.snapshot);
  const counts = { REQ: 0, UC: 0, BR: 0, DOC: 0 } as Record<BaselineKind, number>;
  for (const i of snap.items) counts[i.kind]++;
  return {
    number: b.number, key: `BL-${b.number}`, name: b.name, description: b.description, status: b.status, locked: b.locked,
    hash: b.hash, itemCount: b.itemCount, counts, createdAt: b.createdAt, approvedAt: b.approvedAt,
    createdBy: b.createdById ? users.get(b.createdById) ?? null : null, scope: snap.scope,
    signoffs: b.signoffs.map((s) => ({ userId: s.userId, user: users.get(s.userId) ?? null, decision: s.decision, comment: s.comment, decidedAt: s.decidedAt, contentHash: s.contentHash, hashMatches: s.contentHash ? s.contentHash === b.hash : null })),
    ...(withItems ? { items: snap.items } : {}),
  };
}

export async function listBaselines(userId: number, projectId: number) {
  await teamCtx(userId, projectId);
  const rows = await prisma.workBaseline.findMany({ where: { projectId }, orderBy: { number: 'desc' }, take: 200, include: { signoffs: { orderBy: { id: 'asc' } } } });
  return Promise.all(rows.map((b) => baselineView(b, false)));
}

export async function getBaseline(userId: number, projectId: number, number: number) {
  await teamCtx(userId, projectId);
  return baselineView(await baselineOf(projectId, number), true);
}

export async function createBaseline(userId: number, projectId: number, input: { name: string; description?: string | null; scope: BaselineScope; approverIds?: number[] }) {
  await assertHumanActor(userId, 'create requirement baselines');
  const access = await teamCtx(userId, projectId, 'issue.edit');
  const items = await currentItems(projectId, input.scope, access.key);
  if (!items.length) throw new BadRequestError('Nothing to baseline — the project has no requirements, use cases, business rules or selected documents', 'WORK_BASELINE_EMPTY');
  const approverIds = [...new Set(input.approverIds ?? [])];
  for (const id of approverIds) {
    const a = await loadProjectAccess(id, projectId);
    if (!a || a.principal === 'AGENT' || isClientScoped(a)) throw new BadRequestError(`User #${id} cannot sign this baseline`, 'WORK_BAD_APPROVER');
  }
  const hash = baselineHash(items);
  const number = await prisma.$transaction(async (tx) => {
    const n = await nextNo(tx, 'baseline', projectId);
    await tx.workBaseline.create({
      data: {
        projectId, number: n, name: input.name.trim().slice(0, 160), description: input.description?.trim() || null,
        snapshot: { scope: input.scope, items } as unknown as Prisma.InputJsonValue, hash, itemCount: items.length,
        status: approverIds.length ? 'PENDING' : 'DRAFT', createdById: userId,
        signoffs: { create: approverIds.map((uid) => ({ userId: uid })) },
      },
    });
    return n;
  });
  await auditProject(projectId, { actorId: userId, action: 'baseline.create', targetType: 'baseline', targetId: number, summary: `Captured baseline BL-${number} "${input.name}" (${items.length} items, ${hash.slice(0, 12)})` });
  await notifySigners(projectId, number, userId);
  return getBaseline(userId, projectId, number);
}

async function notifySigners(projectId: number, number: number, senderId: number) {
  try {
    const b = await prisma.workBaseline.findFirst({ where: { projectId, number }, include: { signoffs: { where: { decision: 'PENDING' } }, project: { select: { key: true, workspace: { select: { slug: true } } } } } });
    if (!b) return;
    for (const s of b.signoffs) {
      if (s.userId === senderId) continue;
      await notifyWork({
        receiverId: s.userId, senderId, type: 'WORK_ALERT', entityId: b.id,
        payload: { issueKey: `BL-${b.number}`, title: b.name, message: 'Please review and sign this requirements baseline', url: `/work/${b.project.workspace.slug}/${b.project.key}/reviews?tab=baselines&baseline=${b.number}` },
      });
    }
  } catch (err) {
    logger.warn('[work] báo người ký baseline lỗi', { projectId, number, err: (err as Error).message });
  }
}

export async function requestSignoff(userId: number, projectId: number, number: number, approverIds: number[]) {
  await assertHumanActor(userId, 'request baseline sign-off');
  await teamCtx(userId, projectId, 'issue.edit');
  const b = await baselineOf(projectId, number);
  if (b.status !== 'DRAFT' && b.status !== 'REJECTED') throw new ConflictError(`This baseline is ${b.status.toLowerCase()}`);
  if (!approverIds.length) throw new BadRequestError('Choose at least one approver', 'VALIDATION_ERROR');
  for (const id of approverIds) {
    const a = await loadProjectAccess(id, projectId);
    if (!a || a.principal === 'AGENT' || isClientScoped(a)) throw new BadRequestError(`User #${id} cannot sign this baseline`, 'WORK_BAD_APPROVER');
  }
  await prisma.$transaction([
    prisma.workBaselineSignoff.deleteMany({ where: { baselineId: b.id } }),
    prisma.workBaselineSignoff.createMany({ data: [...new Set(approverIds)].map((uid) => ({ baselineId: b.id, userId: uid })) }),
    prisma.workBaseline.update({ where: { id: b.id }, data: { status: 'PENDING' } }),
  ]);
  await notifySigners(projectId, number, userId);
  return getBaseline(userId, projectId, number);
}

export async function signBaseline(userId: number, projectId: number, number: number, input: { decision: 'APPROVE' | 'REJECT'; comment?: string | null }, meta: { ip?: string | null } = {}) {
  await assertHumanActor(userId, 'sign baselines');
  await teamCtx(userId, projectId);
  const comment = input.comment?.trim() || null;
  if (input.decision === 'REJECT' && !comment) throw new BadRequestError('Say why you are rejecting', 'WORK_REJECT_REASON');
  const out = await prisma.$transaction(async (tx) => {
    const b = await tx.workBaseline.findFirst({ where: { projectId, number }, select: { id: true, status: true, hash: true } });
    if (!b) throw new NotFoundError('Baseline not found');
    await tx.$queryRaw`SELECT id FROM work_baselines WHERE id = ${b.id} FOR UPDATE`;
    if (b.status !== 'PENDING') throw new ConflictError(`This baseline is ${b.status.toLowerCase()}`);
    const steps = await tx.workBaselineSignoff.findMany({ where: { baselineId: b.id } });
    const mine = steps.find((s) => s.userId === userId);
    if (!mine) throw new ForbiddenError('You are not a signer of this baseline. Nobody can sign on behalf of someone else.');
    if (mine.decision !== 'PENDING') throw new ConflictError('You have already signed this baseline');
    const decision = input.decision === 'APPROVE' ? 'APPROVED' : 'REJECTED';
    await tx.workBaselineSignoff.update({ where: { id: mine.id }, data: { decision, comment, decidedAt: new Date(), contentHash: b.hash, ip: meta.ip?.slice(0, 64) ?? null } });
    const outcome = signoffOutcome(steps.map((s) => (s.id === mine.id ? decision : s.decision)));
    if (outcome === 'APPROVED') {
      // Baseline mới có hiệu lực ⇒ baseline đang khoá cũ chuyển SUPERSEDED (vẫn đọc/so sánh được).
      await tx.workBaseline.updateMany({ where: { projectId, status: 'APPROVED', id: { not: b.id } }, data: { status: 'SUPERSEDED', locked: false } });
      await tx.workBaseline.update({ where: { id: b.id }, data: { status: 'APPROVED', locked: true, approvedAt: new Date() } });
    } else if (outcome === 'REJECTED') {
      await tx.workBaseline.update({ where: { id: b.id }, data: { status: 'REJECTED' } });
    }
    return outcome;
  });
  await auditProject(projectId, { actorId: userId, action: input.decision === 'APPROVE' ? 'baseline.approve' : 'baseline.reject', targetType: 'baseline', targetId: number, summary: `${input.decision === 'APPROVE' ? 'Signed' : 'Rejected'} baseline BL-${number}${out !== 'PENDING' ? ` (baseline is now ${out})` : ''}`, detail: { ip: meta.ip ?? null, comment } });
  return getBaseline(userId, projectId, number);
}

/** So sánh BL-n với BL-m (`against` = số) hoặc với hiện tại (`against` = 'current'). */
export async function compareBaseline(userId: number, projectId: number, number: number, against: number | 'current') {
  const access = await teamCtx(userId, projectId);
  const b = await baselineOf(projectId, number);
  const from = snapOf(b.snapshot);
  const to = against === 'current'
    ? await currentItems(projectId, from.scope, access.key)
    : snapOf((await baselineOf(projectId, against)).snapshot).items;
  const d = diffBaselines(from.items, to);
  // Mục đổi có CR APPROVED/IMPLEMENTED phủ ⇒ "authorized"; không có ⇒ thay đổi trái phép (đổi trước khi khoá / dữ liệu cũ).
  const refs = await prisma.workCrAffectedRef.findMany({ where: { projectId }, select: { kind: true, refId: true, changeRequestId: true } });
  const crs = new Map((await prisma.workChangeRequest.findMany({ where: { id: { in: [...new Set(refs.map((r) => r.changeRequestId))] }, deletedAt: null }, select: { id: true, number: true, status: true } })).map((c) => [c.id, c]));
  const rows = d.rows.map((r) => {
    const covering = refs.filter((x) => x.kind === r.kind && x.refId === r.refId).map((x) => crs.get(x.changeRequestId)).filter((c): c is NonNullable<typeof c> => !!c);
    return { ...r, changeRequests: covering.map((c) => ({ number: c.number, key: `CR-${c.number}`, status: c.status })), authorized: covering.some((c) => c.status === 'APPROVED' || c.status === 'IMPLEMENTED') };
  });
  return { from: { number: b.number, key: `BL-${b.number}`, name: b.name }, to: against === 'current' ? { current: true } : { number: against, key: `BL-${against}` }, ...d, rows };
}

/** Mục (kind, refId) đang trong baseline APPROVED + khoá? Trả baseline đó. */
async function lockingBaseline(projectId: number, kind: BaselineKind, refId: number) {
  const locked = await prisma.workBaseline.findMany({ where: { projectId, status: 'APPROVED', locked: true }, select: { number: true, name: true, snapshot: true } });
  return locked.find((b) => snapOf(b.snapshot).items.some((i) => i.kind === kind && i.refId === refId)) ?? null;
}

/** Có CR APPROVED (chưa IMPLEMENTED) liệt kê mục này? */
async function approvedCrFor(projectId: number, kind: BaselineKind, refId: number) {
  const refs = await prisma.workCrAffectedRef.findMany({ where: { projectId, kind, refId }, select: { changeRequestId: true } });
  if (!refs.length) return null;
  return prisma.workChangeRequest.findFirst({ where: { id: { in: refs.map((r) => r.changeRequestId) }, status: 'APPROVED', deletedAt: null }, select: { number: true } });
}

/**
 * CHỐT baseline (R21): mục thuộc baseline APPROVED đang khoá chỉ sửa được khi có CR APPROVED liệt kê nó.
 * Gọi ở đầu mọi đường sửa REQ (issues), UC/BR (srs), trang Docs (pages + đồng soạn).
 */
export async function assertBaselineEditAllowed(projectId: number, kind: BaselineKind, refId: number, label?: string): Promise<void> {
  const hasLocked = await prisma.workBaseline.count({ where: { projectId, status: 'APPROVED', locked: true } });
  if (!hasLocked) return;
  const b = await lockingBaseline(projectId, kind, refId);
  if (!b) return;
  if (await approvedCrFor(projectId, kind, refId)) return;
  throw new AppError(
    `${label ?? 'This item'} is frozen in baseline BL-${b.number} "${b.name}". Raise a change request, list this item as affected, and get the CR approved before editing.`,
    409, 'WORK_BASELINED', { baseline: b.number, kind, refId },
  );
}

/** Nhẹ hơn (không ném) — cho collab chọn chế độ chỉ xem. */
export async function baselineLockReason(projectId: number, kind: BaselineKind, refId: number): Promise<string | null> {
  try { await assertBaselineEditAllowed(projectId, kind, refId); return null; } catch (e) { return e instanceof AppError ? e.message : null; }
}

/** Mục đang bị khoá (kind:refId) của dự án — giao diện hiện ổ khoá. */
export async function lockedRefs(userId: number, projectId: number) {
  await teamCtx(userId, projectId);
  const b = await prisma.workBaseline.findFirst({ where: { projectId, status: 'APPROVED', locked: true }, orderBy: { number: 'desc' }, select: { number: true, name: true, snapshot: true } });
  if (!b) return { baseline: null, refs: [] as string[] };
  return { baseline: { number: b.number, key: `BL-${b.number}`, name: b.name }, refs: snapOf(b.snapshot).items.map((i) => `${i.kind}:${i.refId}`) };
}

// ═══ CR ↔ MỤC YÊU CẦU (R22) ══════════════════════════════════════

async function crOf(projectId: number, crNumber: number) {
  const cr = await prisma.workChangeRequest.findFirst({ where: { projectId, number: crNumber, deletedAt: null }, select: { id: true, number: true, status: true, title: true } });
  if (!cr) throw new NotFoundError('Change request not found');
  return cr;
}

/** Mục bị ảnh hưởng + phân tích tác động (Wiegers Impact Analysis): test liên kết qua RTM, baseline chứa mục. */
export async function crImpact(userId: number, projectId: number, crNumber: number) {
  const access = await teamCtx(userId, projectId);
  const cr = await crOf(projectId, crNumber);
  const refs = await prisma.workCrAffectedRef.findMany({ where: { changeRequestId: cr.id }, orderBy: { id: 'asc' } });
  const ids = (k: BaselineKind) => refs.filter((r) => r.kind === k).map((r) => r.refId);
  const [reqs, ucs, brs, pages] = await Promise.all([
    prisma.workIssue.findMany({ where: { id: { in: ids('REQ') }, projectId }, select: { id: true, number: true, title: true, linksIn: { where: { type: 'TESTS', fromIssue: { deletedAt: null } }, select: { fromIssue: { select: { number: true, title: true } } } } } }),
    prisma.workUseCase.findMany({ where: { id: { in: ids('UC') }, projectId }, select: { id: true, number: true, name: true, issueId: true } }),
    prisma.workBusinessRule.findMany({ where: { id: { in: ids('BR') }, projectId }, select: { id: true, number: true, name: true } }),
    prisma.workPage.findMany({ where: { id: { in: ids('DOC') }, projectId }, select: { id: true, number: true, title: true } }),
  ]);
  // UC ⇒ thẻ đặc tả ⇒ test TESTS.
  const ucIssueIds = ucs.map((u) => u.issueId).filter((x): x is number => !!x);
  const ucTests = ucIssueIds.length ? await prisma.workIssueLink.findMany({ where: { type: 'TESTS', toIssueId: { in: ucIssueIds }, fromIssue: { deletedAt: null } }, select: { toIssueId: true, fromIssue: { select: { number: true, title: true } } } }) : [];
  const locked = await prisma.workBaseline.findMany({ where: { projectId, status: { in: ['APPROVED', 'SUPERSEDED'] } }, select: { number: true, status: true, snapshot: true } });
  const inBaselines = (k: BaselineKind, id: number) => locked.filter((b) => snapOf(b.snapshot).items.some((i) => i.kind === k && i.refId === id)).map((b) => `BL-${b.number}`);
  const items = [
    ...reqs.map((r) => ({ kind: 'REQ' as const, refId: r.id, ref: `${access.key}-${r.number}`, title: r.title, tests: r.linksIn.map((l) => `${access.key}-${l.fromIssue.number}`), baselines: inBaselines('REQ', r.id) })),
    ...ucs.map((u) => ({ kind: 'UC' as const, refId: u.id, ref: `UC-${String(u.number).padStart(2, '0')}`, title: u.name, tests: ucTests.filter((t) => t.toIssueId === u.issueId).map((t) => `${access.key}-${t.fromIssue.number}`), baselines: inBaselines('UC', u.id) })),
    ...brs.map((b) => ({ kind: 'BR' as const, refId: b.id, ref: `BR-${String(b.number).padStart(2, '0')}`, title: b.name, tests: [] as string[], baselines: inBaselines('BR', b.id) })),
    ...pages.map((p) => ({ kind: 'DOC' as const, refId: p.id, ref: `DOC-${p.number}`, title: p.title, tests: [] as string[], baselines: inBaselines('DOC', p.id) })),
  ];
  return {
    changeRequest: { number: cr.number, key: `CR-${cr.number}`, title: cr.title, status: cr.status, unlocksEditing: cr.status === 'APPROVED' },
    items, testsToRerun: [...new Set(items.flatMap((i) => i.tests))].sort(),
  };
}

export async function setCrRefs(userId: number, projectId: number, crNumber: number, refs: Array<{ kind: BaselineKind; ref: string }>) {
  const access = await teamCtx(userId, projectId, 'issue.edit');
  const cr = await crOf(projectId, crNumber);
  if (cr.status === 'IMPLEMENTED' || cr.status === 'REJECTED') throw new ConflictError(`This change request is ${cr.status.toLowerCase()} — its affected items can no longer change`);
  if (cr.status === 'APPROVED') throw new ConflictError('This change request is already approved — the affected items it was approved for cannot be widened; raise a new CR');
  // Nhận khoá người đọc: REQ "KEY-12" | "12" · UC "UC-3" · BR "BR-2" · DOC "DOC-5"/"5".
  const num = (s: string) => Number(/(\d+)\s*$/.exec(s)?.[1] ?? NaN);
  const resolved: Array<{ kind: BaselineKind; refId: number }> = [];
  for (const r of refs) {
    const n = num(r.ref);
    if (!Number.isFinite(n)) throw new BadRequestError(`Cannot read "${r.ref}"`, 'VALIDATION_ERROR');
    const row = r.kind === 'REQ' ? await prisma.workIssue.findFirst({ where: { projectId, number: n, deletedAt: null }, select: { id: true } })
      : r.kind === 'UC' ? await prisma.workUseCase.findFirst({ where: { projectId, number: n }, select: { id: true } })
        : r.kind === 'BR' ? await prisma.workBusinessRule.findFirst({ where: { projectId, number: n }, select: { id: true } })
          : await prisma.workPage.findFirst({ where: { projectId, number: n, deletedAt: null }, select: { id: true } });
    if (!row) throw new NotFoundError(`${r.kind === 'REQ' ? `${access.key}-${n}` : `${r.kind}-${n}`} not found`);
    resolved.push({ kind: r.kind, refId: row.id });
  }
  await prisma.$transaction([
    prisma.workCrAffectedRef.deleteMany({ where: { changeRequestId: cr.id } }),
    prisma.workCrAffectedRef.createMany({ data: resolved.map((r) => ({ projectId, changeRequestId: cr.id, kind: r.kind, refId: r.refId, createdById: userId })), skipDuplicates: true }),
  ]);
  await auditProject(projectId, { actorId: userId, action: 'cr.affected', targetType: 'cr', targetId: cr.id, summary: `CR-${cr.number}: ${resolved.length} affected requirement item(s)` });
  return crImpact(userId, projectId, crNumber);
}

/** Độ biến động yêu cầu theo baseline (Wiegers Ch27): mỗi baseline đã duyệt so với baseline trước. */
export async function volatility(userId: number, projectId: number) {
  await teamCtx(userId, projectId);
  const bs = await prisma.workBaseline.findMany({ where: { projectId, status: { in: ['APPROVED', 'SUPERSEDED'] } }, orderBy: { number: 'asc' }, select: { number: true, name: true, approvedAt: true, snapshot: true } });
  return bs.map((b, i) => {
    if (!i) return { key: `BL-${b.number}`, name: b.name, approvedAt: b.approvedAt, items: snapOf(b.snapshot).items.length, added: null, removed: null, changed: null, volatility: null };
    const d = diffBaselines(snapOf(bs[i - 1].snapshot).items, snapOf(b.snapshot).items);
    return { key: `BL-${b.number}`, name: b.name, approvedAt: b.approvedAt, items: snapOf(b.snapshot).items.length, ...d.counts, volatility: d.volatility };
  });
}

export const _hashForTests = (s: string) => crypto.createHash('sha256').update(s).digest('hex');
