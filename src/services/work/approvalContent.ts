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

/** Băm hiện tại của đối tượng (null = đối tượng đã mất / loại chưa hỗ trợ). */
export async function currentTargetHash(db: Db, t: { targetType: string; issueId: number | null; stageId: number | null; pageId?: number | null }): Promise<string | null> {
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
