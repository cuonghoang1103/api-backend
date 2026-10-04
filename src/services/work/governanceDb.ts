/**
 * CT Work — mảnh dùng chung (đọc DB) của đợt S3b: kiểm mô-đun + quyền, cấp số theo dự án,
 * dựng TipTap từ chữ/Markdown. Luật thuần nằm ở governance.ts.
 */

import type { Prisma } from '@prisma/client';
import { AppError, ForbiddenError } from '../../middleware/errorHandler.js';
import type { StudioModule } from './constants.js';
import { markdownToTiptap } from './docMarkdown.js';
import { governanceAccess, requireProject, type ProjectAccess } from './permissions.js';
import { assertModule } from './studio.js';

type Tx = Prisma.TransactionClient;

export interface GovCtx {
  access: ProjectAccess;
  canEdit: boolean;
  canManage: boolean;
}

/**
 * Cổng của mọi tuyến CR / RAID / họp (phần nội bộ): dự án phải vào được (404), mô-đun phải
 * bật (403 MODULE_DISABLED — dự án cũ y nguyên), người xem phải là người của đội
 * (khách/GUEST ⇒ 403 WORK_INTERNAL_ONLY), lệnh ghi cần MEMBER+.
 */
export async function govCtx(userId: number, projectId: number, module: StudioModule, opts: { edit?: boolean } = {}): Promise<GovCtx> {
  const access = await requireProject(userId, projectId, 'project.view');
  assertModule(access, module);
  const g = governanceAccess(access.role, access.workspaceRole);
  if (!g.view) throw new AppError('This part of the project is only available to the project team', 403, 'WORK_INTERNAL_ONLY');
  if (opts.edit && !g.edit) throw new ForbiddenError('You can view but not change this in this project');
  return { access, canEdit: g.edit, canManage: g.manage };
}

/** Số kế tiếp theo dự án cho bảng `table` — khoá tư vấn theo (bảng, dự án) trong transaction. */
export async function nextNumber(tx: Tx, table: 'cr' | 'raid' | 'meeting', projectId: number): Promise<number> {
  const k = table === 'cr' ? 31001 : table === 'raid' ? 31002 : 31003;
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${k}::int, ${projectId}::int)`;
  const agg = table === 'cr'
    ? await tx.workChangeRequest.aggregate({ where: { projectId }, _max: { number: true } })
    : table === 'raid'
      ? await tx.workRaidItem.aggregate({ where: { projectId }, _max: { number: true } })
      : await tx.workMeeting.aggregate({ where: { projectId }, _max: { number: true } });
  return (agg._max.number ?? 0) + 1;
}

/** Chữ trơn ⇒ TipTap (đoạn cách nhau bằng dòng trống). */
export function textDoc(text: string) {
  return {
    type: 'doc',
    content: text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean).map((p) => ({ type: 'paragraph', content: [{ type: 'text', text: p }] })),
  };
}

/** Markdown (mẫu trong content/quy-trinh/mau) ⇒ TipTap. */
export function markdownDoc(md: string): Prisma.InputJsonValue {
  return markdownToTiptap(md, { dropTitle: false }).doc as unknown as Prisma.InputJsonValue;
}

/** "YYYY-MM-DD" của một cột @db.Date (hoặc null). */
export const dayOf = (d: Date | null | undefined) => (d ? d.toISOString().slice(0, 10) : null);
