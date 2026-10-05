/**
 * CT Work — bus sự kiện trong tiến trình.
 *
 * applyIssueChange() và các service khác gọi emitWorkEvent() SAU KHI
 * transaction đã commit. Từ đây sự kiện đi hai ngả:
 *   1. Socket.IO → phòng `work:project:<id>` (board của mọi người cập nhật).
 *   2. Các listener đăng ký bằng onWorkEvent(): thông báo, luật tự động,
 *      embedding cho AI… (đợt sau). Listener hỏng KHÔNG được làm hỏng lệnh
 *      của người dùng — lỗi chỉ ghi log.
 *
 * Phát sau commit chứ không trong transaction: phát trong transaction mà
 * transaction rollback thì mọi người thấy một thay đổi không hề tồn tại.
 */

import { getIO } from '../../socket/messaging.socket.js';
import { logger } from '../../utils/logger.js';
import type { ActorKind } from './constants.js';

export interface WorkActor {
  kind: ActorKind;
  /** Null khi kind là SYSTEM hoặc AUTOMATION không gắn với người nào. */
  userId: number | null;
  /** Chuỗi luật tự động đã dẫn tới thay đổi này — dùng để chặn vòng lặp vô hạn. */
  ruleChain?: number[];
  /** Đợt S6: kind AI — tên model của đề xuất (nguồn gốc AI). Thiếu ⇒ model đang phân cho trợ lý. */
  model?: string | null;
}

export interface FieldChange {
  field: string;
  from: string | null;
  to: string | null;
}

export type WorkEvent =
  | { type: 'issue.created'; projectId: number; issueId: number; actor: WorkActor }
  | { type: 'issue.updated'; projectId: number; issueId: number; actor: WorkActor; changes: FieldChange[] }
  | { type: 'issue.deleted'; projectId: number; issueId: number; actor: WorkActor }
  | { type: 'comment.created'; projectId: number; issueId: number; commentId: number; actor: WorkActor }
  | { type: 'sprint.updated'; projectId: number; sprintId: number; actor: WorkActor }
  | { type: 'project.updated'; projectId: number; actor: WorkActor }
  // Lớp studio (đợt S1). Cố ý KHÔNG có trường `issueId` ở approval/stage: các
  // listener cũ (chatHooks…) nhận diện sự kiện thẻ bằng `'issueId' in e`.
  | { type: 'stage.updated'; projectId: number; stageId: number; status: string; actor: WorkActor }
  | { type: 'approval.updated'; projectId: number; approvalId: number; status: string; targetType: string; targetIssueId: number | null; stageId: number | null; actor: WorkActor }
  | { type: 'handoff.updated'; projectId: number; handoffId: number; issueId: number; status: string; actor: WorkActor }
  // Tài liệu dự án (đợt S2a). Chỉ mang id/số trang — KHÔNG tiêu đề/nội dung: phòng
  // dự án có cả khách, mà khách không được thấy trang INTERNAL. Client tự tải lại
  // qua API (API lọc theo quyền). Không có `issueId` (xem ghi chú ở trên).
  | { type: 'page.updated'; projectId: number; pageId: number; number: number; action: PageEventAction; actor: WorkActor }
  // Quản trị dự án (đợt S3b): CR / dòng RAID / cuộc họp đổi. Chỉ số + loại — client tải lại
  // qua API (lọc quyền). KHÔNG vào phòng khách (visibleToClient trả false): khách không thấy
  // CR/RAID nội bộ; cổng khách tự tải lại khi mở.
  | { type: 'governance.updated'; projectId: number; entity: 'cr' | 'raid' | 'meeting'; number: number; action: string; actor: WorkActor };

export type PageEventAction = 'created' | 'updated' | 'status' | 'moved' | 'deleted' | 'restored' | 'comment' | 'links';

type Listener = (event: WorkEvent) => void | Promise<void>;
const listeners = new Set<Listener>();

export function onWorkEvent(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function projectRoom(projectId: number): string {
  return `work:project:${projectId}`;
}

/**
 * Phòng của KHÁCH bị cách ly (cổng khách S2b). Khách KHÔNG vào projectRoom (sự
 * kiện ở đó mang id thẻ + giá trị thay đổi của mọi thẻ, kể cả thẻ nội bộ). Phòng
 * này chỉ nhận `portal.changed` KHÔNG kèm dữ liệu, và chỉ khi thay đổi chạm tới thứ
 * khách thấy được (thẻ đã chia sẻ, bình luận PUBLIC, trang CLIENT, giai đoạn, phê duyệt).
 */
export function clientRoom(projectId: number): string {
  return `work:project:${projectId}:client`;
}

/** Sự kiện có chạm tới thứ khách thấy được không (đọc DB — chạy sau commit, ngoài lệnh người dùng). */
async function visibleToClient(event: WorkEvent): Promise<boolean> {
  const { prisma } = await import('../../config/database.js');
  switch (event.type) {
    case 'issue.created':
    case 'issue.updated':
    case 'issue.deleted':
    case 'handoff.updated': {
      const i = await prisma.workIssue.findUnique({ where: { id: event.issueId }, select: { clientVisible: true } });
      // Vừa BỎ chia sẻ cũng phải báo để cổng khách gỡ thẻ đi.
      const unshared = event.type === 'issue.updated' && event.changes.some((c) => c.field === 'clientVisible');
      return !!i?.clientVisible || unshared;
    }
    case 'comment.created': {
      const c = await prisma.workComment.findUnique({ where: { id: event.commentId }, select: { visibility: true, issue: { select: { clientVisible: true } } } });
      return c?.visibility === 'PUBLIC' && c.issue.clientVisible;
    }
    case 'page.updated': {
      const p = await prisma.workPage.findUnique({ where: { id: event.pageId }, select: { visibility: true } });
      return p?.visibility === 'CLIENT' || event.action === 'status' || event.action === 'deleted';
    }
    case 'stage.updated':
    case 'approval.updated':
      return true;
    default:
      return false;
  }
}

export function emitWorkEvent(event: WorkEvent): void {
  const io = getIO();
  io?.to(projectRoom(event.projectId)).emit('work:event', event);
  if (io) {
    void visibleToClient(event)
      .then((ok) => { if (ok) io.to(clientRoom(event.projectId)).emit('work:event', { type: 'portal.changed', projectId: event.projectId }); })
      .catch(() => undefined);
  }
  for (const fn of listeners) {
    Promise.resolve()
      .then(() => fn(event))
      .catch((err) => logger.error('[work] listener lỗi', { type: event.type, err }));
  }
}

/**
 * Đuổi một người khỏi phòng dự án ngay khi họ mất quyền (bị xoá khỏi dự án
 * hoặc khỏi không gian). Không có bước này, socket đã vào phòng vẫn nhận
 * sự kiện của dự án tới khi tải lại trang.
 */
export function evictFromProject(projectId: number, userId: number): void {
  getIO()?.in(`user:${userId}`).socketsLeave(projectRoom(projectId));
  getIO()?.in(`user:${userId}`).socketsLeave(clientRoom(projectId));
}
