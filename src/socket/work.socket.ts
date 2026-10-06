/**
 * CT Work — kênh thời gian thực cho board.
 *
 * Client mở một dự án thì gửi `work:join` với projectId; server kiểm quyền
 * xem (loadProjectAccess) rồi mới cho vào phòng `work:project:<id>`. Mọi sự
 * kiện của dự án (thẻ tạo/sửa/kéo, bình luận, sprint) đến từ emitWorkEvent()
 * trong services/work/events.ts — socket KHÔNG nhận lệnh ghi nào, mọi ghi
 * đi qua REST để có kiểm quyền + lịch sử.
 *
 * Mất quyền giữa chừng: service gọi evictFromProject() để đuổi khỏi phòng.
 */

import type { Server as IOServer, Socket } from 'socket.io';
import { clientRoom, projectRoom } from '../services/work/events.js';
import { isClientScoped, loadProjectAccess } from '../services/work/permissions.js';

/** Một tab mở vài dự án là cùng; trần để client lỗi không nhét socket vào hàng nghìn phòng. */
const MAX_PROJECT_ROOMS = 20;

type Ack = (res: { ok: boolean; role?: string; error?: string }) => void;

export function registerWorkRealtime(_io: IOServer, socket: Socket, user: { id: number }) {
  const joined = new Set<number>();

  socket.on('work:join', async (projectId: unknown, ack?: Ack) => {
    const reply: Ack = typeof ack === 'function' ? ack : () => {};
    const pid = Number(projectId);
    if (!Number.isInteger(pid) || pid <= 0) return reply({ ok: false, error: 'Invalid project' });
    if (!joined.has(pid) && joined.size >= MAX_PROJECT_ROOMS) return reply({ ok: false, error: 'Too many open projects' });
    try {
      const access = await loadProjectAccess(user.id, pid);
      // Không phân biệt "không tồn tại" với "không có quyền" — như REST trả 404.
      if (!access) return reply({ ok: false, error: 'Project not found' });
      // CTW-28: AI agent không vào phòng board (phòng mang giá trị thay đổi của mọi thẻ, kể cả ngoài phạm vi token) —
      // agent nhận sự kiện qua hộp thư riêng (SSE /agents/me/events, đã lọc theo agent).
      if (access.principal === 'AGENT') return reply({ ok: false, error: 'AI agents receive events from /agents/me/events' });
      // Khách bị cách ly (cổng khách S2b) vào phòng RIÊNG — chỉ nhận "portal.changed" không dữ liệu.
      await socket.join(isClientScoped(access) ? clientRoom(pid) : projectRoom(pid));
      joined.add(pid);
      reply({ ok: true, role: access.role });
    } catch {
      reply({ ok: false, error: 'Could not join project' });
    }
  });

  socket.on('work:leave', (projectId: unknown) => {
    const pid = Number(projectId);
    if (!Number.isInteger(pid)) return;
    void socket.leave(projectRoom(pid));
    void socket.leave(clientRoom(pid));
    joined.delete(pid);
  });
}
