/**
 * CT Work — NỘI DUNG được phê duyệt của từng loại đối tượng, để băm thành
 * `contentHash` (SHA-256). Tách riêng khỏi approvals.service để issueChange.ts
 * (luật "transition cần phê duyệt") dùng được mà không vòng import.
 *
 * Chỉ đưa vào băm những gì người duyệt THẬT SỰ đã đọc và đồng ý:
 *   ISSUE      — tiêu đề, mô tả (chữ), trường tuỳ chỉnh. KHÔNG có trạng thái,
 *                người làm, rank… (kéo thẻ sang Done sau khi duyệt không được
 *                làm phê duyệt "lệch").
 *   STAGE_GATE — tên giai đoạn + danh sách thẻ của giai đoạn kèm đã xong chưa
 *                (một thẻ mở lại sau khi duyệt cổng ⇒ lệch).
 *   DOC        — (đợt S2a) tiêu đề + chữ trơn của trang tài liệu. KHÔNG có trạng
 *                thái/chủ sở hữu/vị trí trong cây (đổi chúng không làm lệch chữ ký).
 *   UAT        — (đợt S2b) mốc/version/giai đoạn + từng hạng mục (tiêu đề, mô tả,
 *                xong chưa) + tài liệu (tiêu đề + chữ) + tệp (tên, cỡ). Một hạng mục
 *                mở lại hay tài liệu sửa sau khi khách ký ⇒ lệch.
 *   CR         — (đợt S3b) tiêu đề, mô tả, lý do, mức khẩn + PHÂN TÍCH ẢNH HƯỞNG (phạm vi,
 *                +ngày, chi phí + đơn vị, rủi ro, phương án thay thế) + thẻ/giai đoạn/version
 *                BỊ ẢNH HƯỞNG. KHÔNG có trạng thái, người phụ trách, thẻ thực hiện (IMPLEMENTS
 *                thêm sau khi duyệt không được làm lệch chữ ký).
 */

import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { contentHash } from './studio.js';

type Db = Prisma.TransactionClient | typeof prisma;

export async function issueContent(db: Db, issueId: number) {
  const i = await db.workIssue.findFirst({
    where: { id: issueId, deletedAt: null },
    select: {
      number: true, title: true, descriptionText: true, project: { select: { key: true } },
      customValues: { orderBy: { fieldId: 'asc' }, select: { fieldId: true, value: true } },
    },
  });
  if (!i) return null;
  return {
    key: `${i.project.key}-${i.number}`,
    title: i.title,
    description: i.descriptionText ?? '',
    fields: i.customValues.map((v) => ({ fieldId: v.fieldId, value: v.value })),
  };
}

export async function stageContent(db: Db, stageId: number) {
  const s = await db.workStage.findUnique({
    where: { id: stageId },
    select: {
      n: true, slug: true, name: true,
      issues: { where: { deletedAt: null }, orderBy: { number: 'asc' }, select: { number: true, title: true, resolvedAt: true } },
    },
  });
  if (!s) return null;
  return { n: s.n, slug: s.slug, name: s.name, issues: s.issues.map((i) => ({ number: i.number, title: i.title, done: !!i.resolvedAt })) };
}

export async function pageContent(db: Db, pageId: number) {
  const p = await db.workPage.findFirst({
    where: { id: pageId, deletedAt: null },
    select: { number: true, title: true, contentText: true },
  });
  if (!p) return null;
  return { doc: p.number, title: p.title, text: p.contentText ?? '' };
}

export async function uatContent(db: Db, approvalId: number) {
  const u = await db.workUatRequest.findUnique({
    where: { approvalId },
    select: {
      projectId: true, round: true, environment: true, build: true, itemIssueIds: true, pageNumbers: true, attachmentIds: true,
      version: { select: { name: true } }, stage: { select: { n: true, name: true } },
    },
  });
  if (!u) return null;
  const ids = (u.itemIssueIds as number[]) ?? [];
  const nums = (u.pageNumbers as number[]) ?? [];
  const att = (u.attachmentIds as number[]) ?? [];
  const [items, pages, files] = await Promise.all([
    db.workIssue.findMany({ where: { id: { in: ids } }, orderBy: { number: 'asc' }, select: { number: true, title: true, descriptionText: true, resolvedAt: true, deletedAt: true } }),
    db.workPage.findMany({ where: { projectId: u.projectId, number: { in: nums } }, orderBy: { number: 'asc' }, select: { number: true, title: true, contentText: true, deletedAt: true } }),
    db.workAttachment.findMany({ where: { id: { in: att } }, orderBy: { id: 'asc' }, select: { id: true, fileName: true, size: true } }),
  ]);
  return {
    round: u.round, version: u.version?.name ?? null, stage: u.stage ? `${u.stage.n}. ${u.stage.name}` : null,
    environment: u.environment ?? '', build: u.build ?? '',
    items: items.map((i) => ({ n: i.number, title: i.title, description: i.descriptionText ?? '', done: !!i.resolvedAt, removed: !!i.deletedAt })),
    docs: pages.map((p) => ({ doc: p.number, title: p.title, text: p.contentText ?? '', removed: !!p.deletedAt })),
    files: files.map((f) => ({ id: f.id, name: f.fileName, size: f.size })),
  };
}

export async function crContent(db: Db, crId: number) {
  const c = await db.workChangeRequest.findFirst({
    where: { id: crId, deletedAt: null },
    select: {
      number: true, title: true, descriptionText: true, reason: true, urgency: true, impactScope: true, scheduleDays: true,
      costAmount: true, costCurrency: true, impactRisk: true, alternatives: true,
      links: {
        where: { role: 'AFFECTED' },
        select: { issue: { select: { number: true } }, stage: { select: { n: true } }, version: { select: { name: true } } },
      },
    },
  });
  if (!c) return null;
  const affected = c.links
    .map((l) => (l.issue ? `issue:${l.issue.number}` : l.stage ? `stage:${l.stage.n}` : l.version ? `version:${l.version.name}` : null))
    .filter((x): x is string => !!x)
    .sort();
  return {
    cr: c.number, title: c.title, description: c.descriptionText ?? '', reason: c.reason ?? '', urgency: c.urgency,
    scope: c.impactScope ?? '', scheduleDays: c.scheduleDays, cost: c.costAmount, currency: (c.costCurrency ?? '').trim().toUpperCase(),
    risk: c.impactRisk ?? '', alternatives: c.alternatives ?? '', affected,
  };
}

/** Băm hiện tại của đối tượng (null = đối tượng đã mất / loại chưa hỗ trợ). */
export async function currentTargetHash(db: Db, t: { id?: number; targetType: string; issueId: number | null; stageId: number | null; pageId?: number | null; changeRequestId?: number | null }): Promise<string | null> {
  if (t.targetType === 'CR' && t.changeRequestId) {
    const c = await crContent(db, t.changeRequestId);
    return c ? contentHash(c) : null;
  }
  if (t.targetType === 'UAT' && t.id) {
    const c = await uatContent(db, t.id);
    return c ? contentHash(c) : null;
  }
  if (t.targetType === 'DOC' && t.pageId) {
    const c = await pageContent(db, t.pageId);
    return c ? contentHash(c) : null;
  }
  if (t.targetType === 'ISSUE' && t.issueId) {
    const c = await issueContent(db, t.issueId);
    return c ? contentHash(c) : null;
  }
  if (t.targetType === 'STAGE_GATE' && t.stageId) {
    const c = await stageContent(db, t.stageId);
    return c ? contentHash(c) : null;
  }
  return null;
}

/**
 * Băm "đã ký" của một phê duyệt đã xong: hash của bước quyết định CUỐI CÙNG
 * (lúc đó nội dung là thứ mọi người đã đồng ý). Chưa ai quyết ⇒ hash lúc tạo.
 */
export function signedHash(a: { contentHash: string | null; steps: Array<{ contentHash: string | null; decidedAt: Date | null }> }): string | null {
  const decided = a.steps.filter((s) => s.decidedAt && s.contentHash).sort((x, y) => x.decidedAt!.getTime() - y.decidedAt!.getTime());
  return decided.length ? decided[decided.length - 1].contentHash : a.contentHash;
}
