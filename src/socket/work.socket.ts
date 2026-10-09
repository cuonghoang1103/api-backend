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
import { prisma } from '../config/database.js';
import { clientRoom, projectRoom } from '../services/work/events.js';
import { isClientScoped, loadProjectAccess } from '../services/work/permissions.js';
import { parsePresence } from '../services/work/commentThreads.js';

/** Một tab mở vài dự án là cùng; trần để client lỗi không nhét socket vào hàng nghìn phòng. */
const MAX_PROJECT_ROOMS = 20;

type Ack = (res: { ok: boolean; role?: string; error?: string }) => void;

/** K16: trần tin hiện diện mỗi socket (10 giây) — client lỗi không spam phòng. */
const PRESENCE_BURST = 30;

export function registerWorkRealtime(_io: IOServer, socket: Socket, user: { id: number }) {
  const joined = new Set<number>();
  /** Phòng NHÂN VIÊN đã vào (khách cổng / agent không gửi-nhận hiện diện). */
  const staff = new Set<number>();
  /** Thẻ socket này đang báo có mặt — rời mạng thì báo "left" cho từng thẻ. */
  const present = new Map<string, { projectId: number; number: number }>();
  let who: { id: number; username: string; fullName: string | null; displayName: string | null; avatarUrl: string | null } | null = null;
  let burst = 0;
  let burstAt = Date.now();

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
      if (!isClientScoped(access)) staff.add(pid);
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
    staff.delete(pid);
    for (const [k, v] of present) if (v.projectId === pid) present.delete(k);
  });

  /**
   * K16 (CTW đợt 5b): HIỆN DIỆN trên thẻ — ai đang xem / gõ bình luận / sửa mô tả. Chỉ phát lại trong phòng nhân
   * viên `work:project:<id>` mà socket ĐÃ vào (đã kiểm quyền lúc join); không ghi DB, không qua REST. Client gửi
   * nhịp 20 giây và tự hết hạn sau 45 giây ⇒ mất tin "left" (đóng nắp máy) cũng không treo mãi.
   */
  socket.on('work:presence', async (raw: unknown) => {
    const m = parsePresence(raw);
    // socket.rooms (không phải biến cục bộ): người vừa bị đuổi khỏi dự án (evictFromProject) cũng mất quyền phát.
    if (!m || !staff.has(m.projectId) || !socket.rooms.has(projectRoom(m.projectId))) return;
    const now = Date.now();
    if (now - burstAt > 10_000) { burst = 0; burstAt = now; }
    if (++burst > PRESENCE_BURST) return;
    const k = `${m.projectId}:${m.number}`;
    if (m.state === 'left') present.delete(k);
    else present.set(k, { projectId: m.projectId, number: m.number });
    if (!who) {
      who = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, username: true, fullName: true, displayName: true, avatarUrl: true } }).catch(() => null);
      if (!who) return;
    }
    socket.to(projectRoom(m.projectId)).emit('work:presence', { ...m, user: who, at: now });
  });

  socket.on('disconnect', () => {
    if (!who) return;
    for (const v of present.values()) socket.to(projectRoom(v.projectId)).emit('work:presence', { ...v, state: 'left', user: who, at: Date.now() });
    present.clear();
  });
}
