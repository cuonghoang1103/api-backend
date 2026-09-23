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
  | { type: 'project.updated'; projectId: number; actor: WorkActor };

type Listener = (event: WorkEvent) => void | Promise<void>;
const listeners = new Set<Listener>();

export function onWorkEvent(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function projectRoom(projectId: number): string {
  return `work:project:${projectId}`;
}

export function emitWorkEvent(event: WorkEvent): void {
  getIO()?.to(projectRoom(event.projectId)).emit('work:event', event);
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
}
