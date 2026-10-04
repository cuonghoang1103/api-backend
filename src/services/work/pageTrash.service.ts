/**
 * CT Work — đợt S5c (05/10/2026): THÙNG RÁC CHO DOCS.
 *
 * Trang xoá mềm (S2a `deletePage`: trang + mọi con cháu cùng MỘT `deletedAt`) vào Trash của dự án, cạnh thẻ đã xoá
 * (Settings → Trash → tab "Docs"). Luật:
 *   - Xem: người SỬA được tài liệu (MEMBER+; khách/GUEST/VIEWER không — họ cũng không xoá được). Mô-đun docs tắt ⇒
 *     403 MODULE_DISABLED như mọi tuyến docs.
 *   - Liệt kê theo "lần xoá": gốc của mỗi lần xoá (trang mà cha không bị xoá CÙNG LÚC) + số trang con đi kèm.
 *   - Khôi phục: chủ trang hoặc ADMIN (= luật xoá). Đưa lại CẢ CÂY CON của đúng lần xoá đó (cùng `deletedAt`;
 *     con bị xoá riêng từ trước vẫn nằm trong thùng rác). Cha còn sống ⇒ giữ nguyên cha + vị trí; cha đã bị
 *     xoá / không còn ⇒ đưa về GỐC, cuối danh sách.
 *   - Xoá vĩnh viễn: CHỈ ADMIN dự án; xoá cả cây con của lần xoá đó (phiên bản, bình luận, liên kết thẻ đi theo
 *     cascade). Trang có phê duyệt ĐÃ KÝ (APPROVED/REJECTED) ⇒ 409 WORK_PAGE_HAS_SIGNOFF — chữ ký là bằng chứng,
 *     không xoá theo một cú bấm (xuất trọn dự án trước nếu thật sự cần).
 *   - Tự dọn sau N ngày: KHÔNG — thẻ đã xoá cũng không có cơ chế tự dọn (trash.service chỉ xoá tay), giữ một luật.
 */

import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import { emitWorkEvent } from './events.js';
import { canManagePage } from './permissions.js';
import { docCtx } from './pages.service.js';

const MAX_PAGES_PER_PROJECT = 2000;

type Row = { id: number; number: number; parentId: number | null; title: string; deletedAt: Date | null; ownerId: number | null; visibility: string };

/** Gốc của các lần xoá: cha null / còn sống / bị xoá vào thời điểm KHÁC. Hàm thuần (test ở s5c.test.ts). */
export function deletionRoots<T extends { id: number; parentId: number | null; deletedAt: Date | null }>(deleted: T[]): T[] {
  const byId = new Map(deleted.map((r) => [r.id, r]));
  return deleted.filter((r) => {
    if (r.parentId === null) return true;
    const p = byId.get(r.parentId);
    return !p || p.deletedAt?.getTime() !== r.deletedAt?.getTime();
  });
}

/** Cây con của `root` trong CÙNG lần xoá (cùng deletedAt). Hàm thuần. */
export function sameDeletionSubtree<T extends { id: number; parentId: number | null; deletedAt: Date | null }>(deleted: T[], root: T): T[] {
  const at = root.deletedAt?.getTime();
  const ids = new Set([root.id]);
  for (let grew = true; grew;) {
    grew = false;
    for (const r of deleted) {
      if (r.parentId !== null && ids.has(r.parentId) && !ids.has(r.id) && r.deletedAt?.getTime() === at) { ids.add(r.id); grew = true; }
    }
  }
  return deleted.filter((r) => ids.has(r.id));
}

async function trashCtx(userId: number, projectId: number) {
  const ctx = await docCtx(userId, projectId);
  if (!ctx.da.edit) throw new ForbiddenError('You need permission to edit documents to see deleted documents');
  return ctx;
}

async function deletedRows(projectId: number): Promise<Row[]> {
  return prisma.workPage.findMany({
    where: { projectId, deletedAt: { not: null } },
    select: { id: true, number: true, parentId: true, title: true, deletedAt: true, ownerId: true, visibility: true },
    orderBy: { deletedAt: 'desc' },
    take: 5000,
  });
}

export async function listDeletedPages(userId: number, projectId: number) {
  const ctx = await trashCtx(userId, projectId);
  const rows = await deletedRows(projectId);
  const roots = deletionRoots(rows).slice(0, 500);
  const [logs, parents, owners] = await Promise.all([
    // Ai đã xoá: dòng audit page.delete cuối cùng của trang gốc.
    prisma.workAuditLog.findMany({
      where: { projectId, action: 'page.delete', targetId: { in: roots.map((r) => r.id) } },
      orderBy: { id: 'desc' }, select: { targetId: true, actorId: true, actorName: true },
    }),
    prisma.workPage.findMany({ where: { id: { in: roots.map((r) => r.parentId).filter((x): x is number => x !== null) } }, select: { id: true, number: true, title: true, deletedAt: true } }),
    prisma.user.findMany({ where: { id: { in: roots.map((r) => r.ownerId).filter((x): x is number => x !== null) } }, select: PUBLIC_USER }),
  ]);
  const isAdmin = ctx.access.role === 'ADMIN' && ctx.access.workspaceRole !== 'GUEST';
  return {
    canPurge: isAdmin,
    items: roots.map((r) => {
      const parent = parents.find((p) => p.id === r.parentId) ?? null;
      const log = logs.find((l) => l.targetId === r.id);
      return {
        id: r.id, number: r.number, title: r.title, visibility: r.visibility, deletedAt: r.deletedAt,
        childCount: sameDeletionSubtree(rows, r).length - 1,
        deletedBy: log ? { id: log.actorId, name: log.actorName } : null,
        owner: owners.find((o) => o.id === r.ownerId) ?? null,
        // Khôi phục về đâu: cha còn sống ⇒ dưới cha; không thì về gốc.
        restoresTo: parent && !parent.deletedAt ? { number: parent.number, title: parent.title } : null,
        canRestore: canManagePage(ctx.access.role, ctx.access.workspaceRole, userId, r.ownerId),
      };
    }),
  };
}

async function findRoot(projectId: number, num: number) {
  const rows = await deletedRows(projectId);
  const root = deletionRoots(rows).find((r) => r.number === num);
  if (!root) throw new NotFoundError('Deleted document not found');
  return { root, subtree: sameDeletionSubtree(rows, root) };
}

export async function restorePage(userId: number, projectId: number, num: number) {
  const ctx = await trashCtx(userId, projectId);
  const { root, subtree } = await findRoot(projectId, num);
  if (!canManagePage(ctx.access.role, ctx.access.workspaceRole, userId, root.ownerId)) {
    throw new ForbiddenError('Only the document owner or a project admin can restore it');
  }
  const parent = root.parentId ? await prisma.workPage.findUnique({ where: { id: root.parentId }, select: { id: true, deletedAt: true, projectId: true } }) : null;
  const keepParent = !!parent && !parent.deletedAt && parent.projectId === projectId;
  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT id FROM work_projects WHERE id = ${projectId} FOR UPDATE`;
    const live = await tx.workPage.count({ where: { projectId, deletedAt: null } });
    if (live + subtree.length > MAX_PAGES_PER_PROJECT) throw new BadRequestError(`A project can have at most ${MAX_PAGES_PER_PROJECT} documents`, 'WORK_LIMIT');
    if (!keepParent) {
      const last = await tx.workPage.aggregate({ where: { projectId, parentId: null, deletedAt: null }, _max: { position: true } });
      await tx.workPage.update({ where: { id: root.id }, data: { parentId: null, position: (last._max.position ?? -1) + 1 } });
    }
    await tx.workPage.updateMany({ where: { id: { in: subtree.map((r) => r.id) } }, data: { deletedAt: null } });
  });
  emitWorkEvent({ type: 'page.updated', projectId, pageId: root.id, number: root.number, action: 'restored', actor: { kind: 'USER', userId } });
  await auditProject(projectId, {
    actorId: userId, action: 'page.restore', targetType: 'page', targetId: root.id,
    summary: `Restored document ${root.number} (${root.title}) from trash${subtree.length > 1 ? ` with ${subtree.length - 1} child document(s)` : ''}${keepParent ? '' : ' to the top level'}`,
  });
  return { restored: subtree.length, number: root.number, toTopLevel: !keepParent };
}

export async function purgePage(userId: number, projectId: number, num: number) {
  const ctx = await trashCtx(userId, projectId);
  if (ctx.access.role !== 'ADMIN' || ctx.access.workspaceRole === 'GUEST') throw new ForbiddenError('Only project admins can delete documents permanently');
  const { root, subtree } = await findRoot(projectId, num);
  const ids = subtree.map((r) => r.id);
  const signed = await prisma.workApproval.count({ where: { pageId: { in: ids }, status: { in: ['APPROVED', 'REJECTED'] } } });
  if (signed) {
    throw new AppError('This document has signed approvals. Signatures are evidence, so it stays in the trash — export the project first if you really need to remove it.', 409, 'WORK_PAGE_HAS_SIGNOFF', { signed });
  }
  await prisma.workPage.deleteMany({ where: { id: { in: ids }, deletedAt: { not: null } } });
  await auditProject(projectId, {
    actorId: userId, action: 'page.purge', targetType: 'page', targetId: root.id,
    summary: `Permanently deleted document ${root.number} (${root.title.slice(0, 120)})${ids.length > 1 ? ` and ${ids.length - 1} child document(s)` : ''}`,
  });
  return { deleted: ids.length };
}
