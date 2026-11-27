/**
 * CT Work — dm5 G2 (27/11/2026) B9: SỔ SYSTEM MESSAGES (SM-xx) — bảng "5.2 System Messages" của mẫu Report 3.
 *
 *   - Mỗi thông báo một mã SM-<n> tự tăng trong dự án (khoá advisory như UC/BR — hai người thêm cùng lúc không trùng số).
 *   - Trường: loại (Error/Warning/Information/Confirmation/Success), ngữ cảnh (màn/thao tác), nội dung, bản tiếng Anh tuỳ chọn,
 *     mã HTTP tuỳ chọn, UC dùng thông báo (UC-xx).
 *   - Quyền như Business Rule: xem = đội dự án + giảng viên; sửa = issue.edit; agent chỉ tạo/sửa ĐỀ XUẤT (PROPOSED — không vào
 *     tài liệu), không xoá cái người viết; duyệt (APPROVED) = người ADMIN/MEMBER/TEACHER.
 *   - Lint (swr.ts sixLinks, link 2): UC nhắc "SM-07" mà sổ không có ⇒ lỗi SM_UNKNOWN.
 */

import { z } from 'zod';
import { prisma } from '../../config/database.js';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { auditProject } from './audit.js';
import { emitWorkEvent } from './events.js';
import { srsCtx } from './srs.service.js';
import { refNumber, refsIn, SM_TYPES, smKey, ucKey, UC_STATUSES } from './srs.js';

const clean = (s: string | null | undefined, n: number) => { const v = (s ?? '').trim(); return v ? v.slice(0, n) : null; };
const touch = (projectId: number, userId: number) => emitWorkEvent({ type: 'project.updated', projectId, actor: { kind: 'USER', userId } });

/** "UC-03" | 3 ⇒ id UC trong dự án (bỏ đề xuất PROPOSED). Mã không tồn tại ⇒ 400. */
async function useCaseIds(projectId: number, refs: Array<number | string> | undefined): Promise<number[] | undefined> {
  if (refs === undefined) return undefined;
  const nums = [...new Set(refs.map((r) => refNumber(r, 'UC')))];
  if (nums.some((n) => n === null)) throw new BadRequestError('useCases: give use case codes like UC-03', 'VALIDATION_ERROR');
  if (!nums.length) return [];
  const rows = await prisma.workUseCase.findMany({ where: { projectId, number: { in: nums as number[] } }, select: { id: true, number: true } });
  const missing = (nums as number[]).filter((n) => !rows.some((r) => r.number === n));
  if (missing.length) throw new BadRequestError(`No such use case: ${missing.map(ucKey).join(', ')}`, 'WORK_BAD_USE_CASE');
  return rows.map((r) => r.id);
}

export const systemMessageInput = z.object({
  msgType: z.enum(SM_TYPES).optional(),
  context: z.string().max(2000).nullable().optional(),
  text: z.string().trim().min(1).max(4000),
  textEn: z.string().max(4000).nullable().optional(),
  httpStatus: z.number().int().min(100).max(599).nullable().optional(),
  /** UC dùng thông báo: "UC-03" / 3 — THAY trọn danh sách. */
  useCases: z.array(z.union([z.number().int().positive(), z.string().max(12)])).max(60).optional(),
  status: z.enum(UC_STATUSES).optional(),
});
export type SystemMessageInput = z.infer<typeof systemMessageInput>;

type Row = Awaited<ReturnType<typeof prisma.workSystemMessage.findFirstOrThrow>>;

async function out(projectId: number, rows: Row[]) {
  const ids = [...new Set(rows.flatMap((r) => r.useCaseIds))];
  const ucs = ids.length ? await prisma.workUseCase.findMany({ where: { projectId, id: { in: ids } }, select: { id: true, number: true, name: true } }) : [];
  const uc = new Map(ucs.map((u) => [u.id, u]));
  return rows.map((r) => ({
    id: r.id, number: r.number, key: smKey(r.number), msgType: r.msgType, context: r.context, text: r.text, textEn: r.textEn,
    httpStatus: r.httpStatus, status: r.status, aiModel: r.aiModel, version: r.version, updatedAt: r.updatedAt,
    useCases: r.useCaseIds.map((id) => uc.get(id)).filter((u): u is { id: number; number: number; name: string } => !!u).map((u) => ({ id: u.id, key: ucKey(u.number), name: u.name })),
  }));
}

/** Sổ SM + chỗ dùng: UC nào nhắc mã SM trong luồng (kể cả chưa gắn) và mã được nhắc mà không tồn tại. */
export async function listSystemMessages(userId: number, projectId: number) {
  const ctx = await srsCtx(userId, projectId, 'view');
  const [rows, ucs] = await Promise.all([
    prisma.workSystemMessage.findMany({ where: { projectId }, orderBy: { number: 'asc' } }),
    prisma.workUseCase.findMany({ where: { projectId, status: { not: 'PROPOSED' } }, select: { number: true, normalFlow: true, alternativeFlows: true, exceptionFlows: true, preconditions: true, postconditions: true, description: true } }),
  ]);
  const have = new Set(rows.map((r) => r.number));
  const mentions = new Map<number, string[]>();
  for (const u of ucs) {
    const text = [u.description, u.preconditions, u.normalFlow, u.alternativeFlows, u.exceptionFlows, u.postconditions].filter(Boolean).join('\n');
    for (const n of refsIn(text, 'SM')) mentions.set(n, [...(mentions.get(n) ?? []), ucKey(u.number)]);
  }
  const items = (await out(projectId, rows)).map((m) => ({ ...m, mentionedIn: mentions.get(m.number) ?? [] }));
  const unknown = [...mentions.entries()].filter(([n]) => !have.has(n)).sort((a, b) => a[0] - b[0]).map(([n, where]) => ({ key: smKey(n), mentionedIn: where }));
  return { items, unknown, types: SM_TYPES, canEdit: ctx.canEdit, canApprove: ctx.canApprove };
}

async function byRef(projectId: number, ref: number | string) {
  const n = refNumber(ref, 'SM');
  if (n === null) throw new BadRequestError('Give a system message code like SM-03', 'VALIDATION_ERROR');
  const cur = await prisma.workSystemMessage.findFirst({ where: { projectId, number: n } });
  if (!cur) throw new NotFoundError(`${smKey(n)} not found`);
  return cur;
}

export async function createSystemMessage(userId: number, projectId: number, input: SystemMessageInput, opts: { propose?: boolean; aiModel?: string | null } = {}) {
  const ctx = await srsCtx(userId, projectId, 'edit');
  const propose = opts.propose || ctx.isAgent;
  const status = propose ? 'PROPOSED' : input.status ?? 'DRAFT';
  if (status === 'APPROVED' && !ctx.canApprove) throw new ForbiddenError('Only project members and lecturers can approve requirements');
  const ucIds = (await useCaseIds(projectId, input.useCases)) ?? [];
  const row = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(${31043}::int, ${projectId}::int)`;
    const number = ((await tx.workSystemMessage.aggregate({ where: { projectId }, _max: { number: true } }))._max.number ?? 0) + 1;
    return tx.workSystemMessage.create({
      data: {
        projectId, number, msgType: input.msgType ?? 'ERROR', context: clean(input.context, 2000), text: input.text.trim().slice(0, 4000),
        textEn: clean(input.textEn, 4000), httpStatus: input.httpStatus ?? null, useCaseIds: ucIds, status,
        aiModel: propose ? (opts.aiModel ?? 'agent').slice(0, 80) : null, createdById: userId,
      },
    });
  });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'srs.message.create', targetType: 'system_message', targetId: row.id, summary: `Added ${smKey(row.number)}: ${row.text}`.slice(0, 300) });
  return (await out(projectId, [row]))[0];
}

export async function updateSystemMessage(userId: number, projectId: number, ref: number | string, input: Partial<SystemMessageInput> & { version?: number }) {
  const ctx = await srsCtx(userId, projectId, 'edit');
  const cur = await byRef(projectId, ref);
  if (ctx.isAgent && cur.status !== 'PROPOSED') throw new ForbiddenError('An AI agent can only change its own proposals');
  if (input.status !== undefined && input.status !== cur.status && (ctx.isAgent || !ctx.canApprove)) throw new ForbiddenError('Only project members and lecturers can approve requirements');
  const ucIds = await useCaseIds(projectId, input.useCases);
  const r = await prisma.workSystemMessage.updateMany({
    where: { id: cur.id, ...(input.version !== undefined ? { version: input.version } : {}) },
    data: {
      ...(input.msgType !== undefined ? { msgType: input.msgType } : {}),
      ...(input.context !== undefined ? { context: clean(input.context, 2000) } : {}),
      ...(input.text !== undefined ? { text: input.text.trim().slice(0, 4000) } : {}),
      ...(input.textEn !== undefined ? { textEn: clean(input.textEn, 4000) } : {}),
      ...(input.httpStatus !== undefined ? { httpStatus: input.httpStatus } : {}),
      ...(ucIds !== undefined ? { useCaseIds: ucIds } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
      version: { increment: 1 },
    },
  });
  if (!r.count) throw new ConflictError('Someone else changed this message — reload to see their version');
  touch(projectId, userId);
  return (await out(projectId, [await prisma.workSystemMessage.findUniqueOrThrow({ where: { id: cur.id } })]))[0];
}

export async function deleteSystemMessage(userId: number, projectId: number, ref: number | string) {
  const ctx = await srsCtx(userId, projectId, 'edit');
  const cur = await byRef(projectId, ref);
  if (ctx.isAgent && cur.status !== 'PROPOSED') throw new ForbiddenError('An AI agent cannot delete a message a person wrote');
  await prisma.workSystemMessage.delete({ where: { id: cur.id } });
  touch(projectId, userId);
  await auditProject(projectId, { actorId: userId, action: 'srs.message.delete', targetType: 'system_message', targetId: cur.id, summary: `Deleted ${smKey(cur.number)}: ${cur.text}`.slice(0, 300) });
  return { deleted: true, key: smKey(cur.number) };
}
