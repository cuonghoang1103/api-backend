/**
 * CT Work — THÙNG RÁC DỮ LIỆU 30 ngày (22/10/2026). Cạnh thùng rác thẻ (trash.service) và Docs (pageTrash.service), đây là
 * nơi giữ mọi thứ khác người dùng bỏ công tạo ra: hàm 5.1 + UTCID, module/workflow 5.2/5.3 + case, Record of change, lần
 * "Nhập Excel → Thay thế", test cycle/plan/design, retro (xoá CỨNG ⇒ ảnh chụp đầy đủ qua dataTrash.ts) và họp, RAID, sơ
 * đồ, CR, review (vốn xoá MỀM ⇒ chỉ ghi "ai xoá, lúc nào" để khôi phục được).
 *
 * Luật:
 *   • Xem + khôi phục: người SỬA được dự án (issue.edit — ADMIN/MEMBER). Khôi phục không phá gì: dựng lại đúng dữ liệu, giữ
 *     id gốc nếu còn trống; trùng tên với thứ đang có ⇒ thêm hậu tố " (restored)", KHÔNG ghi đè.
 *   • Xoá vĩnh viễn: CHỈ ADMIN dự án (project.settings), có audit.
 *   • Hết 30 ngày: cron dọn (`sweepTrash`). Mục xoá mềm hết hạn chỉ rời thùng rác (dòng gốc vẫn ẩn như trước).
 */

import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import { isSoftTable, purgeSoft, restoreGraph, restoreSoft, snapshotGraph, type GraphSnapshot, type SoftTable } from './dataTrash.js';
import { deleteContext } from './deleteRequests.service.js';
import { emitWorkEvent } from './events.js';
import { can, requireProject } from './permissions.js';

export const TRASH_DAYS = 30;
type Db = Prisma.TransactionClient | typeof prisma;

// ─── Ghi ─────────────────────────────────────────────────────────

export interface TrashRecord {
  projectId: number;
  userId: number;
  kind: string;
  label: string;
  itemCount?: number;
  payload: Record<string, unknown>;
}

/** Một dòng thùng rác. Nguồn (web / ai / token / approved) + requestId lấy từ ngữ cảnh lời gọi. */
export async function putInTrash(db: Db, r: TrashRecord): Promise<number> {
  const ctx = deleteContext();
  const row = await db.workTrashItem.create({
    data: {
      projectId: r.projectId, kind: r.kind.slice(0, 40), label: r.label.slice(0, 300), itemCount: Math.max(0, r.itemCount ?? 1),
      payload: r.payload as Prisma.InputJsonValue, source: ctx.via, requestId: ctx.requestId ?? null, deletedById: r.userId,
      expiresAt: new Date(Date.now() + TRASH_DAYS * 86_400_000),
    },
    select: { id: true },
  });
  return row.id;
}

/** Chụp dòng gốc + mọi thứ DELETE sẽ cuốn theo rồi cất vào thùng rác. Gọi TRONG transaction, NGAY TRƯỚC lệnh xoá. */
export async function trashGraph(
  tx: Db,
  r: Omit<TrashRecord, 'payload'> & { roots: Array<{ table: string; ids: unknown[] }>; extra?: Record<string, unknown> },
): Promise<{ trashId: number; graph: GraphSnapshot }> {
  const graph = await snapshotGraph(tx, r.roots);
  const trashId = await putInTrash(tx, { ...r, payload: { graph, ...(r.extra ? { extra: r.extra } : {}) } });
  return { trashId, graph };
}

/** Bảng xoá mềm: chỉ ghi lại để khôi phục (dòng vẫn còn, deleted_at đã đặt). Lỗi ghi ⇒ không chặn lệnh xoá đã xong. */
export async function trashSoft(r: { projectId: number; userId: number; table: SoftTable; id: number; label: string; kind?: string }): Promise<number | null> {
  try {
    return await putInTrash(prisma, { projectId: r.projectId, userId: r.userId, kind: r.kind ?? `soft.${r.table}`, label: r.label, payload: { soft: { table: r.table, id: r.id } } });
  } catch (err) {
    logger.warn('[work] ghi thùng rác (xoá mềm) lỗi', { table: r.table, id: r.id, err: (err as Error).message });
    return null;
  }
}

// ─── Đọc ─────────────────────────────────────────────────────────

const KIND_GROUP: Array<[RegExp, string]> = [
  [/^fpt\./, 'tests'], [/work_test_|test_/, 'tests'], [/meeting/, 'meetings'], [/raid/, 'raid'], [/diagram/, 'diagrams'],
  [/change_request/, 'governance'], [/review/, 'tests'], [/retro/, 'agile'],
];
const groupOf = (kind: string) => KIND_GROUP.find(([re]) => re.test(kind))?.[1] ?? 'other';

export async function listTrash(userId: number, projectId: number) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  const rows = await prisma.workTrashItem.findMany({
    where: { projectId, restoredAt: null, expiresAt: { gt: new Date() } },
    orderBy: { deletedAt: 'desc' }, take: 300,
    select: { id: true, kind: true, label: true, itemCount: true, source: true, requestId: true, deletedAt: true, expiresAt: true, deletedBy: { select: PUBLIC_USER } },
  });
  return {
    canPurge: can(access.role, 'project.settings'),
    days: TRASH_DAYS,
    items: rows.map((r) => ({ ...r, group: groupOf(r.kind), deletedAt: r.deletedAt.toISOString(), expiresAt: r.expiresAt.toISOString() })),
  };
}

// ─── Khôi phục ───────────────────────────────────────────────────

const SUFFIX = ' (restored)';
const withSuffix = (s: string, max: number) => `${s.slice(0, max - SUFFIX.length)}${SUFFIX}`;

/** Trùng tên với thứ ĐANG có ⇒ thêm hậu tố, không ghi đè; tên sheet trùng ⇒ bỏ tên sheet (xuất Excel tự đặt). */
async function fptMutate(table: string, row: Record<string, unknown>, db: Db): Promise<string | null> {
  if (table === 'work_unit_functions') {
    const projectId = Number(row.project_id);
    const notes: string[] = [];
    const same = await db.workUnitFunction.count({ where: { projectId, moduleName: String(row.module_name), methodName: String(row.method_name) } });
    if (same) { const to = withSuffix(String(row.method_name), 120); notes.push(`${row.module_name}.${row.method_name} → ${to}`); row.method_name = to; }
    if (row.sheet_name && (await db.workUnitFunction.count({ where: { projectId, sheetName: String(row.sheet_name) } }))) row.sheet_name = null;
    return notes.join('; ') || null;
  }
  if (table === 'work_it_modules') {
    const projectId = Number(row.project_id);
    const kind = String(row.kind ?? 'INT');
    let note: string | null = null;
    if (await db.workItModule.count({ where: { projectId, kind, name: String(row.name) } })) { const to = withSuffix(String(row.name), 120); note = `${row.name} → ${to}`; row.name = to; }
    if (row.sheet_name && (await db.workItModule.count({ where: { projectId, kind, sheetName: String(row.sheet_name) } }))) row.sheet_name = null;
    return note;
  }
  return null;
}

export async function restoreTrash(userId: number, projectId: number, id: number) {
  await requireProject(userId, projectId, 'issue.edit');
  const item = await prisma.workTrashItem.findFirst({ where: { id, projectId }, select: { id: true, kind: true, label: true, payload: true, restoredAt: true, expiresAt: true } });
  if (!item) throw new NotFoundError('Trash item not found');
  if (item.restoredAt) throw new AppError('This item was already restored', 409, 'WORK_TRASH_ALREADY_RESTORED');
  const payload = (item.payload ?? {}) as { graph?: GraphSnapshot; soft?: { table: string; id: number }; extra?: Record<string, unknown> } & Record<string, unknown>;
  let notes: string[] = [];
  let rows = 0;
  try {
    await prisma.$transaction(async (tx) => {
      if (payload.graph) {
        const r = await restoreGraph(tx, payload.graph, { mutate: fptMutate });
        notes = r.notes; rows = r.rows;
        await checkFptLimits(tx, projectId);
      } else if (payload.soft && isSoftTable(payload.soft.table)) {
        if (!(await restoreSoft(tx, payload.soft.table, Number(payload.soft.id)))) throw new AppError('This item is no longer in the trash (it was restored or erased elsewhere)', 409, 'WORK_TRASH_GONE');
        rows = 1;
      } else if (item.kind === 'fpt.unit_cases' || item.kind === 'fpt.it_cases') {
        const fpt = await import('./fptTests.service.js');
        const r = item.kind === 'fpt.unit_cases' ? await fpt.restoreRemovedUnitCases(tx, projectId, payload) : await fpt.restoreRemovedItCases(tx, projectId, payload);
        rows = r.restored; notes = r.notes;
      } else {
        throw new AppError('This trash item cannot be restored (unknown kind)', 400, 'WORK_TRASH_BAD_PAYLOAD');
      }
      // Chốt: hai người bấm cùng lúc ⇒ người sau 409 (transaction của họ rollback hết).
      const won = await tx.workTrashItem.updateMany({
        where: { id, restoredAt: null },
        data: { restoredAt: new Date(), restoredById: userId, restoreNote: notes.join('; ').slice(0, 500) || null, payload: { restored: true } as Prisma.InputJsonValue },
      });
      if (!won.count) throw new AppError('This item was already restored', 409, 'WORK_TRASH_ALREADY_RESTORED');
    }, { timeout: 120_000 });
  } catch (err) {
    throw restoreError(err);
  }
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
  await auditProject(projectId, { actorId: userId, action: 'trash.restore', targetType: 'project', targetId: projectId, summary: `Restored from trash: ${item.label}${notes.length ? ` (${notes.join('; ')})` : ''}`.slice(0, 300) }).catch(() => undefined);
  return { restored: true, rows, notes };
}

function restoreError(err: unknown): unknown {
  if (err instanceof AppError) return err;
  const msg = (err as Error)?.message ?? '';
  if (/duplicate key|unique constraint/i.test(msg)) return new AppError('Cannot restore: something with the same identity already exists. Rename or remove it first.', 409, 'WORK_TRASH_CONFLICT');
  if (/foreign key/i.test(msg)) return new AppError('Cannot restore: something it belongs to no longer exists.', 409, 'WORK_TRASH_MISSING_PARENT');
  return err;
}

async function checkFptLimits(tx: Db, projectId: number) {
  const { MAX_FUNCTIONS, MAX_IT_MODULES } = await import('./fptTests.service.js');
  if ((await tx.workUnitFunction.count({ where: { projectId } })) > MAX_FUNCTIONS) {
    throw new AppError(`Restoring would exceed ${MAX_FUNCTIONS} unit-tested functions. Delete some first.`, 409, 'WORK_LIMIT');
  }
  for (const kind of ['INT', 'SYS']) {
    if ((await tx.workItModule.count({ where: { projectId, kind } })) > MAX_IT_MODULES) {
      throw new AppError(`Restoring would exceed ${MAX_IT_MODULES} modules. Delete some first.`, 409, 'WORK_LIMIT');
    }
  }
}

// ─── Xoá vĩnh viễn + dọn ─────────────────────────────────────────

export async function purgeTrash(userId: number, projectId: number, id: number) {
  await requireProject(userId, projectId, 'project.settings');
  const item = await prisma.workTrashItem.findFirst({ where: { id, projectId, restoredAt: null }, select: { id: true, label: true, payload: true } });
  if (!item) throw new NotFoundError('Trash item not found');
  await dropItem(item);
  await auditProject(projectId, { actorId: userId, action: 'trash.purge', targetType: 'project', targetId: projectId, summary: `Permanently deleted from trash: ${item.label}`.slice(0, 300) }).catch(() => undefined);
  emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });
}

/** Xoá vĩnh viễn: mục xoá mềm ⇒ xoá hẳn dòng gốc; mục ảnh chụp ⇒ bỏ ảnh chụp. */
async function dropItem(item: { id: number; payload: Prisma.JsonValue }, opts: { erase: boolean } = { erase: true }) {
  const p = (item.payload ?? {}) as { soft?: { table: string; id: number } };
  await prisma.$transaction(async (tx) => {
    if (opts.erase && p.soft && isSoftTable(p.soft.table)) await purgeSoft(tx, p.soft.table, Number(p.soft.id));
    await tx.workTrashItem.delete({ where: { id: item.id } });
  });
}

/**
 * Cron (mỗi giờ): mục quá 30 ngày rời thùng rác. Ảnh chụp bị bỏ (dữ liệu đã xoá từ trước); mục xoá MỀM thì dòng gốc
 * GIỮ NGUYÊN trạng thái ẩn như trước khi có thùng rác (không tự xoá cứng thứ hệ thống vốn không xoá). Mục đã khôi phục
 * giữ thêm 30 ngày làm dấu vết rồi cũng đi.
 */
export async function sweepTrash(now = new Date()): Promise<number> {
  const expired = await prisma.workTrashItem.findMany({ where: { expiresAt: { lte: now } }, select: { id: true, payload: true }, take: 500 });
  for (const it of expired) await dropItem(it, { erase: false }).catch((err) => logger.warn('[work] dọn thùng rác lỗi', { id: it.id, err: (err as Error).message }));
  return expired.length;
}
