/**
 * CT Work — CTW đợt 4 (09/10/2026): DEFECT LOG THỐNG NHẤT (A16 + B5).
 *
 *   - Mọi thẻ Bug (mọi dự án — SWT301/SWP391/CAPSTONE và cả dự án cũ) có thêm phần defect log: Severity (mức nặng của
 *     LỖI, khác Priority = thứ tự xử lý; Critical · Major · Minor · Trivial theo slide SWT301 "severity levels: critical,
 *     major, minor"), Activity / Product / Product details đúng cột sheet Defects của Report2_Project Tracking
 *     (Activity ∈ Review · UT · IT · ST · AT; Product ∈ Software Package · Report1 (Intro) … Report7 (Final)).
 *   - Lỗi review tài liệu và lỗi code chung MỘT sổ: phát hiện của spec review (Spec Fidelity) ⇒ Bug bằng một chạm
 *     (Activity = Review, Product = Report theo trang, Product details = trang + mục / thẻ), bấm lại không tạo trùng.
 *   - Đổi trường ⇒ ghi lịch sử thẻ (WorkHistory) như mọi trường khác.
 */

import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { BadRequestError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { displayName } from './common.js';
import { emitWorkEvent } from './events.js';
import { DEFECT_ACTIVITIES, PRODUCTS, productOf } from './fptReports.js';
import { createIssueAs } from './issues.service.js';
import { requireProject } from './permissions.js';
import { SEVERITIES, SEVERITY_LABEL } from './srs.js';
import type { Finding } from './specFidelity.js';

export const defectInput = z.object({
  severity: z.enum(SEVERITIES).nullable().optional(),
  activity: z.enum(DEFECT_ACTIVITIES).nullable().optional(),
  product: z.enum(PRODUCTS).nullable().optional(),
  productDetails: z.string().max(300).nullable().optional(),
});
export type DefectInput = z.infer<typeof defectInput>;

const FIELD_LABEL: Record<keyof DefectInput, string> = { severity: 'severity', activity: 'defectActivity', product: 'defectProduct', productDetails: 'defectProductDetails' };

async function bugOf(projectId: number, number: number) {
  const i = await prisma.workIssue.findFirst({
    where: { projectId, number, deletedAt: null },
    select: { id: true, number: true, title: true, type: { select: { key: true } }, defectInfo: true },
  });
  if (!i) throw new NotFoundError('Issue not found');
  return i;
}

/** Phần defect log của một thẻ. Thẻ không phải Bug ⇒ `isBug: false` (giao diện ẩn khung). */
export async function getDefect(userId: number, projectId: number, number: number) {
  await requireProject(userId, projectId, 'project.view');
  const i = await bugOf(projectId, number);
  const d = i.defectInfo;
  return {
    isBug: i.type.key === 'BUG',
    severity: d?.severity ?? null, activity: d?.activity ?? null, product: d?.product ?? null, productDetails: d?.productDetails ?? null,
    source: d?.sourceReviewId ? { reviewId: d.sourceReviewId, findingId: d.sourceFindingId } : null,
    options: { severities: SEVERITIES, activities: DEFECT_ACTIVITIES, products: PRODUCTS },
  };
}

export async function setDefect(userId: number, projectId: number, number: number, input: DefectInput) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  const i = await bugOf(projectId, number);
  if (i.type.key !== 'BUG') throw new BadRequestError('Severity and defect fields are only for Bug issues', 'WORK_NOT_A_BUG');
  const cur = i.defectInfo;
  const next: Record<string, string | null> = {};
  for (const k of Object.keys(FIELD_LABEL) as Array<keyof DefectInput>) {
    if (input[k] === undefined) continue;
    const v = typeof input[k] === 'string' ? (input[k] as string).trim().slice(0, 300) || null : null;
    if ((cur?.[k] ?? null) !== v) next[k] = v;
  }
  if (Object.keys(next).length) {
    const actorKind = access.principal === 'AGENT' ? 'AGENT' : 'USER';
    await prisma.$transaction([
      prisma.workDefectInfo.upsert({ where: { issueId: i.id }, create: { issueId: i.id, projectId, ...next }, update: next }),
      prisma.workHistory.createMany({ data: Object.entries(next).map(([k, v]) => ({ issueId: i.id, actorId: userId, actorKind, field: FIELD_LABEL[k as keyof DefectInput], fromValue: (cur?.[k as keyof DefectInput] as string | null | undefined) ?? null, toValue: v })) }),
      prisma.workIssue.update({ where: { id: i.id }, data: { version: { increment: 1 } } }),
    ]);
    emitWorkEvent({ type: 'issue.updated', projectId, issueId: i.id, actor: { kind: 'USER', userId }, changes: [] });
  }
  return getDefect(userId, projectId, number);
}

/** Sổ defect của dự án (mọi Bug) — dùng chung giao diện, lệnh registry và sheet Defects. */
export async function defectLog(userId: number, projectId: number, q: { severity?: string; open?: boolean } = {}) {
  const access = await requireProject(userId, projectId, 'project.view');
  const rows = await prisma.workIssue.findMany({
    where: { projectId, deletedAt: null, type: { key: 'BUG' }, ...(q.open ? { resolvedAt: null } : {}), ...(q.severity ? { defectInfo: { severity: q.severity } } : {}) },
    orderBy: { number: 'desc' }, take: 2000,
    select: {
      number: true, title: true, priority: true, createdAt: true, resolvedAt: true,
      status: { select: { name: true, category: true } }, defectInfo: true,
      assignee: { select: { username: true, fullName: true, displayName: true } }, reporter: { select: { username: true, fullName: true, displayName: true } },
    },
  });
  return rows.map((r) => ({
    key: `${access.key}-${r.number}`, number: r.number, title: r.title, priority: r.priority, status: r.status.name, category: r.status.category,
    severity: r.defectInfo?.severity ?? null, severityLabel: r.defectInfo?.severity ? SEVERITY_LABEL[r.defectInfo.severity as keyof typeof SEVERITY_LABEL] : null,
    activity: r.defectInfo?.activity ?? null, product: r.defectInfo?.product ?? null, productDetails: r.defectInfo?.productDetails ?? null,
    fromReview: !!r.defectInfo?.sourceReviewId,
    assignee: r.assignee ? displayName(r.assignee) : null, reporter: r.reporter ? displayName(r.reporter) : null,
    createdAt: r.createdAt, resolvedAt: r.resolvedAt,
  }));
}

// ─── Spec review ⇒ Bug (một chạm) ────────────────────────────────

/** Mức nặng của phát hiện rà soát ⇒ Severity của lỗi tài liệu. */
export const severityOfFinding = (s: string) => (s === 'high' ? 'MAJOR' : s === 'medium' ? 'MINOR' : 'TRIVIAL');

const p = (text: string, bold = false): Prisma.InputJsonValue => ({ type: 'paragraph', content: text ? [bold ? { type: 'text', text, marks: [{ type: 'bold' }] } : { type: 'text', text }] : [] });

/** Mô tả Bug theo khuôn bug report (bước tái hiện · mong đợi · thực tế) — cho phát hiện của rà soát tài liệu. */
export function findingBugDoc(f: Pick<Finding, 'ref' | 'excerpt' | 'why' | 'suggestion' | 'dimension' | 'rule'>, where: string): Prisma.InputJsonValue {
  return {
    type: 'doc',
    content: [
      p('Found by a spec review (Spec Fidelity).', true),
      p(`Where: ${where}${f.ref && f.ref !== 'Document' ? ` — ${f.ref}` : ''}`),
      ...(f.excerpt ? [p('Text:', true), { type: 'blockquote', content: [p(f.excerpt.slice(0, 2000))] }] : []),
      p('Problem:', true), p(f.why.slice(0, 2000)),
      p('Expected:', true), p(f.suggestion.slice(0, 2000)),
      p(`Rule: ${f.rule} · ${f.dimension}`),
    ],
  } as Prisma.InputJsonValue;
}

export async function bugFromFinding(userId: number, projectId: number, reviewId: number, findingId: string) {
  const access = await requireProject(userId, projectId, 'issue.create');
  const review = await prisma.workSpecReview.findFirst({
    where: { id: reviewId, projectId },
    select: { id: true, scope: true, scopeLabel: true, findings: true, page: { select: { number: true, title: true, templateKey: true } } },
  });
  if (!review) throw new NotFoundError('Spec review not found');
  const findings = review.findings as unknown as Array<Finding & { bugNumber?: number }>;
  const f = findings.find((x) => x.id === findingId);
  if (!f) throw new NotFoundError('Finding not found');
  // Bấm lại / hai người cùng bấm ⇒ trả Bug đã có, không tạo trùng.
  const existing = await prisma.workDefectInfo.findFirst({ where: { projectId, sourceReviewId: reviewId, sourceFindingId: findingId, issue: { deletedAt: null } }, select: { issue: { select: { number: true, title: true } } } });
  if (existing) return { created: false, number: existing.issue.number, key: `${access.key}-${existing.issue.number}`, title: existing.issue.title };
  const bugType = await prisma.workIssueType.findFirst({ where: { projectId, key: 'BUG', archived: false }, select: { id: true } });
  if (!bugType) throw new BadRequestError('This project has no Bug issue type — add one in the project settings', 'WORK_NO_BUG_TYPE');

  const where = review.page ? `Doc ${review.page.number}: ${review.page.title}` : review.scopeLabel;
  const target = f.target?.issueNumber ? `${access.key}-${f.target.issueNumber}` : null;
  const product = review.page ? productOf(`${review.page.templateKey ?? ''} ${review.page.title}`.replace(/fpt-report(\d)/, 'report $1')) : PRODUCTS[3];
  const title = `[Review] ${f.why.replace(/\s+/g, ' ')}`.slice(0, 250);
  const issue = await createIssueAs(userId, projectId, { typeId: bugType.id, title, descriptionJson: findingBugDoc(f, where) });
  await prisma.workDefectInfo.create({
    data: {
      issueId: issue.id, projectId, severity: severityOfFinding(f.severity), activity: 'Review',
      product: product === PRODUCTS[0] ? PRODUCTS[3] : product,
      productDetails: (review.page ? `Doc ${review.page.number} ${review.page.title}${f.ref && f.ref !== 'Document' ? ` · ${f.ref}` : ''}` : target ?? review.scopeLabel).slice(0, 300),
      sourceReviewId: reviewId, sourceFindingId: findingId.slice(0, 20),
    },
  });
  // Ghi số Bug lên phát hiện (giao diện hiện "Bug CTW-12") — khoá dòng như patchFinding của specReview.
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_spec_reviews WHERE id = ${reviewId} FOR UPDATE`;
    const r = await tx.workSpecReview.findUniqueOrThrow({ where: { id: reviewId }, select: { findings: true } });
    const list = (r.findings as unknown as Array<Finding & { bugNumber?: number }>).map((x) => (x.id === findingId ? { ...x, bugNumber: issue.number } : x));
    await tx.workSpecReview.update({ where: { id: reviewId }, data: { findings: list as unknown as Prisma.InputJsonValue } });
  });
  await auditProject(projectId, { actorId: userId, action: 'spec.bug', targetType: 'issue', targetId: issue.id, summary: `Logged spec review finding ${findingId} as ${access.key}-${issue.number}` });
  return { created: true, number: issue.number, key: `${access.key}-${issue.number}`, title };
}
