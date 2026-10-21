/**
 * CT Work — YÊU CẦU XOÁ chờ trưởng nhóm duyệt (22/10/2026).
 *
 * Sự cố gốc (22/10, dự án SWT301): một thành viên bấm "Nhập Excel → Thay thế" ⇒ cả bảng 5.1 (24 hàm) bị xoá cứng; năm
 * phút sau hàm còn lại cũng bị xoá. Chủ web: "dùng AI xoá tất khi không hỏi hay chờ trưởng nhóm duyệt… nguy hiểm quá".
 *
 * LUẬT (một chỗ — `gateDelete`, các service phá huỷ gọi vào đây):
 *   • AI (MCP / CuongMini / Ask AI / agent dựng sẵn) hoặc token ctw_ qua REST ⇒ KHÔNG BAO GIỜ xoá ngay: tạo yêu cầu, kể cả
 *     khi người cầm token là trưởng nhóm (AI có thể hiểu sai — người phải bấm Duyệt trên web).
 *   • Thao tác HÀNG LOẠT (nhập thay thế, xoá nhiều…) của người KHÔNG phải ADMIN dự án ⇒ yêu cầu.
 *   • ADMIN tự làm hàng loạt ⇒ phải xác nhận rõ (`confirm` = số mục sẽ xoá), rồi chạy — và vẫn vào thùng rác.
 *   • Xoá đơn lẻ của người trên web ⇒ chạy ngay, vào thùng rác + nút Hoàn tác.
 *
 * Duyệt ⇒ chạy ĐÚNG thao tác dưới quyền NGƯỜI GỬI (duyệt không mở thêm quyền nào) trong ngữ cảnh "đã duyệt" — cửa chặn
 * thấy ngữ cảnh đó thì cho qua, thùng rác ghi `requestId`. Từ chối / huỷ / hết hạn (7 ngày) ⇒ không chạy gì.
 * Duyệt CHỈ trên web (phiên đăng nhập) — token API (AI) không duyệt được, kể cả token của trưởng nhóm.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { AppError, BadRequestError, ForbiddenError, NotFoundError } from '../../middleware/errorHandler.js';
import { logger } from '../../utils/logger.js';
import { currentAiClient } from './aiUsage.service.js';
import { auditProject } from './audit.js';
import { PUBLIC_USER } from './common.js';
import { emitWorkEvent } from './events.js';
import { notifyWork } from './notify.js';
import { can, loadProjectAccess, requireProject } from './permissions.js';

export const REQUEST_DAYS = 7;
export const MAX_PENDING_PER_USER = 30;

// ─── Ngữ cảnh lời gọi ────────────────────────────────────────────

interface Ctx { approvedRequestId?: number; token?: boolean }
const als = new AsyncLocalStorage<Ctx>();

/** Middleware REST: request này đến từ token ctw_ của NGƯỜI (không phải phiên web) ⇒ xoá phải qua duyệt. */
export function markTokenCall(): void {
  als.enterWith({ ...(als.getStore() ?? {}), token: true });
}

/** Chạy `fn` như thao tác ĐÃ ĐƯỢC DUYỆT (cửa chặn cho qua, thùng rác ghi requestId). */
export function runApproved<T>(requestId: number, fn: () => Promise<T>): Promise<T> {
  return als.run({ approvedRequestId: requestId }, fn);
}

export type DeleteVia = 'approved' | 'ai' | 'token' | 'web';
export function deleteContext(): { via: DeleteVia; requestId?: number; aiClient?: string } {
  const s = als.getStore();
  if (s?.approvedRequestId) return { via: 'approved', requestId: s.approvedRequestId };
  const client = currentAiClient();
  if (client) return { via: 'ai', aiClient: client };
  if (s?.token) return { via: 'token' };
  return { via: 'web' };
}

/** AI / token và CHƯA được duyệt ⇒ không được làm mất dữ liệu trực tiếp. */
export function isUnapprovedMachineCall(): boolean {
  const v = deleteContext().via;
  return v === 'ai' || v === 'token';
}

// ─── Hình dạng trả về ────────────────────────────────────────────

const reqSelect = {
  id: true, projectId: true, classId: true, kind: true, label: true, itemCount: true, via: true, aiClient: true, status: true,
  createdAt: true, expiresAt: true, decidedAt: true, decisionNote: true, error: true, result: true,
  requestedBy: { select: PUBLIC_USER }, decidedBy: { select: PUBLIC_USER },
  project: { select: { key: true, name: true, workspace: { select: { slug: true } } } },
} satisfies Prisma.WorkDeleteRequestSelect;
type ReqRow = Prisma.WorkDeleteRequestGetPayload<{ select: typeof reqSelect }>;

export interface Approver { id: number; username: string; name: string }
export interface RequestView {
  id: number; projectId: number | null; classId: number | null; kind: string; label: string; itemCount: number;
  via: string; aiClient: string | null; status: string; createdAt: string; expiresAt: string; decidedAt: string | null;
  decisionNote: string | null; error: string | null; result: unknown;
  requestedBy: unknown; decidedBy: unknown; projectKey: string | null; projectName: string | null; url: string | null;
}

function view(r: ReqRow): RequestView {
  return {
    id: r.id, projectId: r.projectId, classId: r.classId, kind: r.kind, label: r.label, itemCount: r.itemCount, via: r.via, aiClient: r.aiClient,
    status: r.status, createdAt: r.createdAt.toISOString(), expiresAt: r.expiresAt.toISOString(), decidedAt: r.decidedAt?.toISOString() ?? null,
    decisionNote: r.decisionNote, error: r.error, result: r.result ?? null, requestedBy: r.requestedBy, decidedBy: r.decidedBy,
    projectKey: r.project?.key ?? null, projectName: r.project?.name ?? null,
    url: r.project ? requestsUrl(r.project.workspace.slug, r.project.key) : r.classId ? `/work/classes/${r.classId}` : null,
  };
}

const requestsUrl = (slug: string, key: string) => `/work/${slug}/${key}/settings?tab=trash&bin=requests`;
const nameOf = (u: { username: string; fullName?: string | null; displayName?: string | null }) => u.displayName || u.fullName || u.username;

// ─── Ai duyệt được ───────────────────────────────────────────────

/** Trưởng nhóm của dự án = người có vai ADMIN hiệu lực (ADMIN dự án, hoặc OWNER/ADMIN không gian). Không gồm agent. */
export async function projectApprovers(projectId: number): Promise<Approver[]> {
  const p = await prisma.workProject.findUnique({ where: { id: projectId }, select: { workspaceId: true } });
  if (!p) return [];
  const [ws, pm] = await Promise.all([
    prisma.workMember.findMany({ where: { workspaceId: p.workspaceId, role: { in: ['OWNER', 'ADMIN'] } }, select: { userId: true }, take: 50 }),
    prisma.workProjectMember.findMany({ where: { projectId, role: 'ADMIN' }, select: { userId: true }, take: 50 }),
  ]);
  const ids = [...new Set([...ws, ...pm].map((x) => x.userId))];
  const out: Approver[] = [];
  for (const id of ids) {
    const a = await loadProjectAccess(id, projectId);
    if (!a || a.principal !== 'HUMAN' || !can(a.role, 'project.settings')) continue;
    const u = await prisma.user.findUnique({ where: { id }, select: { id: true, username: true, fullName: true, displayName: true } });
    if (u) out.push({ id: u.id, username: u.username, name: nameOf(u) });
  }
  return out;
}

async function classApprovers(classId: number): Promise<Approver[]> {
  const c = await prisma.workClass.findUnique({ where: { id: classId }, select: { ownerId: true, teacherId: true } });
  if (!c) return [];
  const ids = [...new Set([c.ownerId, c.teacherId].filter((x): x is number => !!x))];
  const users = await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, username: true, fullName: true, displayName: true } });
  return users.map((u) => ({ id: u.id, username: u.username, name: nameOf(u) }));
}

async function canDecide(userId: number, r: { projectId: number | null; classId: number | null }): Promise<boolean> {
  if (r.projectId) {
    const a = await loadProjectAccess(userId, r.projectId);
    return !!a && a.principal === 'HUMAN' && can(a.role, 'project.settings');
  }
  if (r.classId) return (await classApprovers(r.classId)).some((x) => x.id === userId);
  return false;
}

// ─── Tạo yêu cầu ─────────────────────────────────────────────────

export interface QueueSpec {
  projectId?: number | null;
  classId?: number | null;
  kind: string;
  label: string;
  itemCount?: number;
  params?: Record<string, unknown>;
  file?: Buffer | null;
}

export interface QueuedRequest extends RequestView {
  approvers: Approver[];
  /** Câu trả cho AI / người gửi — nói rõ CHƯA xoá gì và ai sẽ duyệt. */
  message: string;
}

export function queuedMessage(id: number, label: string, approvers: Approver[]): string {
  const who = approvers.length ? approvers.map((a) => `@${a.username}`).join(', ') : 'a project admin';
  return `Deletion request #${id} sent: "${label}". NOTHING was deleted yet — it waits for team lead ${who} to approve it on the CT Work web `
    + `(Project settings → Trash → Deletion requests). / Đã gửi yêu cầu xoá #${id}, CHƯA xoá gì — chờ trưởng nhóm ${who} duyệt trên web.`;
}

export async function createRequest(userId: number, spec: QueueSpec): Promise<QueuedRequest> {
  if (!spec.projectId && !spec.classId) throw new BadRequestError('A deletion request needs a project or a class', 'VALIDATION_ERROR');
  const ctx = deleteContext();
  const pending = await prisma.workDeleteRequest.count({
    where: { requestedById: userId, status: 'PENDING', ...(spec.projectId ? { projectId: spec.projectId } : { classId: spec.classId }) },
  });
  if (pending >= MAX_PENDING_PER_USER) {
    throw new AppError(`You already have ${pending} deletion requests waiting for approval. Ask your team lead to review them first.`, 429, 'WORK_DELETE_REQUESTS_FULL');
  }
  const r = await prisma.workDeleteRequest.create({
    data: {
      projectId: spec.projectId ?? null, classId: spec.classId ?? null, kind: spec.kind, label: spec.label.slice(0, 300),
      itemCount: Math.max(0, spec.itemCount ?? 1), params: (spec.params ?? {}) as Prisma.InputJsonValue,
      file: spec.file ?? null,
      via: ctx.via === 'approved' ? 'web' : ctx.via, aiClient: ctx.aiClient ?? null, requestedById: userId,
      expiresAt: new Date(Date.now() + REQUEST_DAYS * 86_400_000),
    },
    select: reqSelect,
  });
  const approvers = spec.projectId ? await projectApprovers(spec.projectId) : await classApprovers(spec.classId!);
  const v = view(r);
  void notifyApprovers(v, approvers, userId);
  if (spec.projectId) {
    emitWorkEvent({ type: 'project.updated', projectId: spec.projectId, actor: { kind: 'USER', userId } });
    await auditProject(spec.projectId, { actorId: userId, action: 'delete.request', targetType: 'project', targetId: spec.projectId, summary: `Asked to delete (${v.via}${v.aiClient ? `/${v.aiClient}` : ''}): ${v.label}`.slice(0, 300) }).catch(() => undefined);
  }
  return { ...v, approvers, message: queuedMessage(v.id, v.label, approvers) };
}

async function notifyApprovers(v: RequestView, approvers: Approver[], senderId: number) {
  for (const a of approvers) {
    try {
      await notifyWork({
        receiverId: a.id, senderId, type: 'WORK_ALERT', entityId: v.id,
        payload: {
          issueKey: v.projectKey ?? 'CT Work', title: v.label,
          message: `${v.via === 'web' ? 'Deletion' : 'AI deletion'} waiting for your approval: ${v.label}`.slice(0, 240),
          url: v.url, deleteRequestId: v.id,
        },
      });
    } catch (err) {
      logger.warn('[work] báo trưởng nhóm yêu cầu xoá lỗi', { id: v.id, err: (err as Error).message });
    }
  }
}

/**
 * CỬA CHẶN của mọi thao tác phá huỷ. Trả `null` ⇒ được chạy ngay; trả yêu cầu ⇒ ĐÃ xếp hàng chờ duyệt, KHÔNG được xoá.
 *   bulk          — thao tác hàng loạt (nhập thay thế, xoá nhiều…).
 *   expectConfirm — ADMIN chạy hàng loạt phải gửi `confirm` đúng giá trị này (số mục sẽ xoá) ⇒ 400 WORK_CONFIRM_REQUIRED.
 */
export async function gateDelete(
  userId: number, projectId: number,
  spec: Omit<QueueSpec, 'projectId' | 'classId'> & { bulk: boolean; confirm?: unknown; expectConfirm?: string | number },
): Promise<QueuedRequest | null> {
  const ctx = deleteContext();
  if (ctx.via === 'approved') return null;
  if (ctx.via === 'ai' || ctx.via === 'token') return createRequest(userId, { ...spec, projectId });
  if (!spec.bulk) return null;
  const access = await loadProjectAccess(userId, projectId);
  if (access && can(access.role, 'project.settings')) {
    if (spec.expectConfirm !== undefined && String(spec.confirm ?? '').trim() !== String(spec.expectConfirm)) {
      throw new AppError(
        `This deletes ${spec.itemCount ?? spec.expectConfirm} item(s). Type ${spec.expectConfirm} to confirm.`, 400, 'WORK_CONFIRM_REQUIRED',
        { expected: spec.expectConfirm, itemCount: spec.itemCount ?? null },
      );
    }
    return null;
  }
  return createRequest(userId, { ...spec, projectId });
}

// ─── Đọc ─────────────────────────────────────────────────────────

export async function listProjectRequests(userId: number, projectId: number, status?: string) {
  const access = await requireProject(userId, projectId, 'issue.edit');
  const rows = await prisma.workDeleteRequest.findMany({
    where: { projectId, ...(status ? { status } : {}) },
    orderBy: [{ createdAt: 'desc' }], take: 100, select: reqSelect,
  });
  const decide = access.principal === 'HUMAN' && can(access.role, 'project.settings');
  return { canDecide: decide, requests: rows.map(view) };
}

/** Yêu cầu đang CHỜ TÔI duyệt (mọi dự án tôi là trưởng nhóm + lớp tôi dạy/sở hữu) — cho "Việc của tôi". */
export async function listMyPending(userId: number) {
  const rows = await prisma.workDeleteRequest.findMany({
    where: { status: 'PENDING', expiresAt: { gt: new Date() } }, orderBy: { createdAt: 'desc' }, take: 300, select: reqSelect,
  });
  const ok = new Map<string, boolean>();
  const out: RequestView[] = [];
  for (const r of rows) {
    const k = r.projectId ? `p${r.projectId}` : `c${r.classId}`;
    if (!ok.has(k)) ok.set(k, await canDecide(userId, r));
    if (ok.get(k)) out.push(view(r));
    if (out.length >= 50) break;
  }
  return out;
}

// ─── Quyết định ──────────────────────────────────────────────────

type Executor = (r: { id: number; projectId: number | null; classId: number | null; requestedById: number; params: Prisma.JsonValue; file: Buffer | null }) => Promise<unknown>;

/** Chạy đúng thao tác của một yêu cầu (import động — tránh vòng import với service phá huỷ / registry lệnh). */
const EXECUTORS: Record<string, Executor> = {
  tool: async (r) => {
    const p = (r.params ?? {}) as { tool?: string; args?: Record<string, unknown> };
    const reg = await import('./toolRegistry/index.js');
    const t = p.tool ? reg.commandByName(p.tool) : undefined;
    if (!t) throw new BadRequestError(`Unknown command ${p.tool ?? ''}`, 'WORK_DELETE_BAD_REQUEST');
    const args = t.input.parse(p.args ?? {});
    return t.run(reg.personCtx(r.requestedById), args);
  },
  'fpt.import_replace': async (r) => {
    const fpt = await import('./fptTests.service.js');
    if (!r.file || !r.projectId) throw new BadRequestError('The Excel file of this request is gone', 'WORK_DELETE_BAD_REQUEST');
    const p = (r.params ?? {}) as { report?: 'unit' | 'integration' | 'system' };
    return fpt.importReport(r.requestedById, r.projectId, Buffer.from(r.file), { report: p.report ?? 'auto', mode: 'replace' });
  },
  'fpt.unit_delete': async (r) => (await import('./fptTests.service.js')).deleteFunction(r.requestedById, r.projectId!, Number((r.params as { id?: number }).id)),
  'fpt.it_delete': async (r) => (await import('./fptTests.service.js')).deleteModule(r.requestedById, r.projectId!, Number((r.params as { id?: number }).id)),
  'fpt.change_delete': async (r) => (await import('./fptTests.service.js')).deleteChange(r.requestedById, r.projectId!, Number((r.params as { id?: number }).id)),
};

async function loadForDecision(userId: number, id: number) {
  const r = await prisma.workDeleteRequest.findUnique({ where: { id }, select: { id: true, projectId: true, classId: true, status: true, expiresAt: true, requestedById: true, kind: true, label: true, params: true, file: true } });
  if (!r) throw new NotFoundError('Deletion request not found');
  // Người không thấy dự án / lớp ⇒ 404 (không lộ yêu cầu tồn tại).
  if (r.projectId) { if (!(await loadProjectAccess(userId, r.projectId))) throw new NotFoundError('Deletion request not found'); }
  else if (r.classId) {
    const { classRole } = await import('./classroom.service.js');
    if (!(await classRole(userId, r.classId))) throw new NotFoundError('Deletion request not found');
  }
  return r;
}

export async function approveRequest(userId: number, id: number, note?: string | null) {
  const r = await loadForDecision(userId, id);
  if (!(await canDecide(userId, r))) throw new ForbiddenError('Only a team lead (project admin) can approve deletions');
  if (r.status !== 'PENDING') throw new AppError(`This request is already ${r.status.toLowerCase()}`, 409, 'WORK_DELETE_REQUEST_DECIDED');
  if (r.expiresAt < new Date()) throw new AppError('This request has expired — ask for it again', 409, 'WORK_DELETE_REQUEST_EXPIRED');
  const exec = EXECUTORS[r.kind];
  if (!exec) throw new BadRequestError(`Unknown request kind ${r.kind}`, 'WORK_DELETE_BAD_REQUEST');
  // Chốt nguyên tử: hai trưởng nhóm bấm cùng lúc ⇒ chỉ một người chạy.
  const won = await prisma.workDeleteRequest.updateMany({ where: { id, status: 'PENDING' }, data: { status: 'APPROVED', decidedById: userId, decidedAt: new Date(), decisionNote: note?.trim() || null } });
  if (!won.count) throw new AppError('Someone else decided this request a moment ago', 409, 'WORK_DELETE_REQUEST_DECIDED');
  let status = 'APPROVED';
  let error: string | null = null;
  let output: unknown = null;
  try {
    output = await runApproved(id, () => exec(r));
  } catch (err) {
    status = 'FAILED';
    error = ((err as Error).message || 'failed').slice(0, 1000);
    logger.warn('[work] chạy yêu cầu xoá đã duyệt lỗi', { id, kind: r.kind, err: error });
  }
  const trash = await prisma.workTrashItem.findMany({ where: { requestId: id }, select: { id: true, label: true } });
  const result = { trash, output: summarize(output) } as Prisma.InputJsonValue;
  const row = await prisma.workDeleteRequest.update({ where: { id }, data: { status, error, result, file: null }, select: reqSelect });
  const v = view(row);
  if (r.projectId) {
    emitWorkEvent({ type: 'project.updated', projectId: r.projectId, actor: { kind: 'USER', userId } });
    await auditProject(r.projectId, { actorId: userId, action: status === 'APPROVED' ? 'delete.approve' : 'delete.approve_failed', targetType: 'project', targetId: r.projectId, summary: `Approved deletion #${id}: ${r.label}${error ? ` — failed: ${error}` : ''}`.slice(0, 300) }).catch(() => undefined);
  }
  void tellRequester(v, r.requestedById, userId, status === 'APPROVED' ? `Your deletion request was approved: ${r.label}` : `Your approved deletion failed: ${error}`);
  return v;
}

/** Kết quả gọn để lưu (bỏ ma trận/nội dung dài). */
function summarize(out: unknown): unknown {
  if (out === null || out === undefined) return null;
  const s = JSON.stringify(out);
  if (s.length <= 50_000) return JSON.parse(s);
  return { note: 'output truncated', head: s.slice(0, 1500) };
}

export async function rejectRequest(userId: number, id: number, note?: string | null) {
  const r = await loadForDecision(userId, id);
  if (!(await canDecide(userId, r))) throw new ForbiddenError('Only a team lead (project admin) can reject deletions');
  const won = await prisma.workDeleteRequest.updateMany({ where: { id, status: 'PENDING' }, data: { status: 'REJECTED', decidedById: userId, decidedAt: new Date(), decisionNote: note?.trim() || null, file: null } });
  if (!won.count) throw new AppError(`This request is already ${r.status.toLowerCase()}`, 409, 'WORK_DELETE_REQUEST_DECIDED');
  const v = view(await prisma.workDeleteRequest.findUniqueOrThrow({ where: { id }, select: reqSelect }));
  if (r.projectId) emitWorkEvent({ type: 'project.updated', projectId: r.projectId, actor: { kind: 'USER', userId } });
  void tellRequester(v, r.requestedById, userId, `Your deletion request was rejected: ${r.label}${note?.trim() ? ` — ${note.trim()}` : ''}`);
  return v;
}

export async function cancelRequest(userId: number, id: number) {
  const r = await loadForDecision(userId, id);
  if (r.requestedById !== userId) throw new ForbiddenError('Only the person who asked can cancel this request');
  const won = await prisma.workDeleteRequest.updateMany({ where: { id, status: 'PENDING' }, data: { status: 'CANCELLED', decidedById: userId, decidedAt: new Date(), file: null } });
  if (!won.count) throw new AppError(`This request is already ${r.status.toLowerCase()}`, 409, 'WORK_DELETE_REQUEST_DECIDED');
  if (r.projectId) emitWorkEvent({ type: 'project.updated', projectId: r.projectId, actor: { kind: 'USER', userId } });
  return view(await prisma.workDeleteRequest.findUniqueOrThrow({ where: { id }, select: reqSelect }));
}

async function tellRequester(v: RequestView, receiverId: number, senderId: number, message: string) {
  try {
    await notifyWork({ receiverId, senderId, type: 'WORK_ALERT', entityId: v.id, payload: { issueKey: v.projectKey ?? 'CT Work', title: v.label, message: message.slice(0, 240), url: v.url, deleteRequestId: v.id } });
  } catch { /* chuông lỗi không chặn quyết định */ }
}

/** Cron: yêu cầu quá hạn ⇒ EXPIRED (bỏ tệp kèm). */
export async function expireRequests(now = new Date()): Promise<number> {
  const r = await prisma.workDeleteRequest.updateMany({ where: { status: 'PENDING', expiresAt: { lte: now } }, data: { status: 'EXPIRED', file: null } });
  return r.count;
}
