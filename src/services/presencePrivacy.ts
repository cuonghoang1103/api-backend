/**
 * Trạng thái hoạt động (chấm xanh + "hoạt động N phút trước") — MỘT luật cho mọi chỗ trả presence (21/10/2026).
 *
 * Trước đây mỗi chỗ tự quyết: hồ sơ công khai trả `isOnline` + `lastActiveAt` cho cả khách CHƯA đăng nhập, danh sách
 * người theo dõi/bạn bè bỏ qua công tắc "Hiển thị trạng thái hoạt động", "Đang online" liệt kê MỌI người đang nối
 * cho bất kỳ ai đã đăng nhập, socket rơi về phát TOÀN CỤC khi lỗi. Duyệt App Store (CT Work iOS) đọc chính sách bảo
 * mật rồi đối chiếu — nên luật phải nằm ở MỘT chỗ và mọi đường đọc/phát đều đi qua nó.
 *
 * Luật (người XEM ↔ người ĐƯỢC XEM), chỉ hiện khi TẤT CẢ đúng:
 *   1. người xem đã đăng nhập;
 *   2. người được xem BẬT `showActiveStatus` (thiếu cờ ⇒ coi như tắt — fail-closed);
 *   3. người xem cũng BẬT (luật đối ứng kiểu Messenger: tắt của mình thì không thấy của ai);
 *   4. không ai chặn ai (bất kỳ chiều);
 *   5. không phải AI agent;
 *   6. hai người có QUAN HỆ: bạn bè (đã chấp nhận), đã có cuộc trò chuyện riêng, hoặc cùng một không gian CT Work
 *      (không tính vai khách cổng — GUEST). Người lạ không thấy trạng thái của nhau.
 * Xem chính mình thì luôn thấy.
 */

import { prisma } from '../config/database.js';

/** Khớp nhịp ping Socket.IO (~25 s) + `NGUONG_TRUC_TUYEN_GIAY` (work/people.service.ts) + app iOS. */
export const ONLINE_THRESHOLD_SECONDS = 60;

export function hoatDongGanDay(lastActiveAt: Date | null | undefined, now: Date = new Date()): boolean {
  if (!lastActiveAt) return false;
  return (now.getTime() - lastActiveAt.getTime()) / 1000 <= ONLINE_THRESHOLD_SECONDS;
}

/** Bối cảnh của MỘT người xem, nạp một lần cho cả danh sách. `null` = khách chưa đăng nhập. */
export interface PresenceViewer {
  viewerId: number;
  /** Công tắc của chính người xem (luật đối ứng). */
  viewerShows: boolean;
  /** Người đã chặn người xem hoặc bị người xem chặn. */
  blocked: Set<number>;
  /** Người có quan hệ với người xem. `null` = bên gọi khẳng định mọi người trong danh sách đều có (vd. người cùng cuộc trò chuyện). */
  circle: Set<number> | null;
}

export interface PresenceTarget {
  id: number;
  showActiveStatus?: boolean | null;
  lastActiveAt: Date | null;
  kind?: string | null;
}

export interface Presence {
  /** false ⇒ client KHÔNG vẽ chấm, KHÔNG viết "hoạt động … trước". */
  visible: boolean;
  isOnline: boolean;
  lastActiveAt: Date | null;
}

const AN: Presence = Object.freeze({ visible: false, isOnline: false, lastActiveAt: null }) as Presence;

/** Phần thuần — test không cần DB. `connected` = đang có socket mở (nguồn chính xác hơn mốc `lastActiveAt`). */
export function presenceFor(
  viewer: PresenceViewer | null,
  target: PresenceTarget,
  opts: { connected?: boolean; now?: Date } = {},
): Presence {
  if (!viewer) return AN;
  const online = !!opts.connected || hoatDongGanDay(target.lastActiveAt, opts.now);
  if (target.id === viewer.viewerId) return { visible: true, isOnline: online, lastActiveAt: target.lastActiveAt };
  if (target.showActiveStatus !== true) return AN;
  if (!viewer.viewerShows) return AN;
  if (viewer.blocked.has(target.id)) return AN;
  if (target.kind === 'AGENT') return AN;
  if (viewer.circle && !viewer.circle.has(target.id)) return AN;
  return { visible: true, isOnline: online, lastActiveAt: target.lastActiveAt };
}

/**
 * Ai trong `targetIds` có quan hệ với `viewerId`: bạn bè đã chấp nhận ∪ người đã có cuộc trò chuyện (USER hoặc ADMIN)
 * ∪ người cùng không gian CT Work (cả hai không phải GUEST, không gian chưa xoá). Ba truy vấn cho cả danh sách.
 */
export async function presenceCircle(viewerId: number, targetIds: number[]): Promise<Set<number>> {
  const ids = [...new Set(targetIds.filter((id) => id !== viewerId))];
  if (!ids.length) return new Set();
  const [ban, chuyen, cungKg] = await Promise.all([
    prisma.friendship.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [
          { requesterId: viewerId, addresseeId: { in: ids } },
          { addresseeId: viewerId, requesterId: { in: ids } },
        ],
      },
      select: { requesterId: true, addresseeId: true },
    }),
    prisma.messageThread.findMany({
      where: {
        OR: [
          { type: 'USER', userAId: viewerId, userBId: { in: ids } },
          { type: 'USER', userBId: viewerId, userAId: { in: ids } },
          { type: 'ADMIN', userId: viewerId, adminUserId: { in: ids } },
          { type: 'ADMIN', adminUserId: viewerId, userId: { in: ids } },
        ],
      },
      select: { userId: true, adminUserId: true, userAId: true, userBId: true },
    }),
    prisma.workMember.findMany({
      where: {
        userId: { in: ids },
        role: { not: 'GUEST' },
        workspace: { deletedAt: null, members: { some: { userId: viewerId, role: { not: 'GUEST' } } } },
      },
      select: { userId: true },
    }),
  ]);
  const out = new Set<number>();
  for (const f of ban) out.add(f.requesterId === viewerId ? f.addresseeId : f.requesterId);
  for (const t of chuyen) {
    for (const p of [t.userId, t.adminUserId, t.userAId, t.userBId]) if (typeof p === 'number' && p !== viewerId) out.add(p);
  }
  for (const m of cungKg) out.add(m.userId);
  return out;
}

/** Ai đã chặn `viewerId` hoặc bị `viewerId` chặn, trong `targetIds`. */
export async function blockedBetween(viewerId: number, targetIds: number[]): Promise<Set<number>> {
  const ids = [...new Set(targetIds.filter((id) => id !== viewerId))];
  if (!ids.length) return new Set();
  const rows = await prisma.userBlock.findMany({
    where: {
      OR: [
        { blockerId: viewerId, blockedId: { in: ids } },
        { blockedId: viewerId, blockerId: { in: ids } },
      ],
    },
    select: { blockerId: true, blockedId: true },
  });
  return new Set(rows.map((r) => (r.blockerId === viewerId ? r.blockedId : r.blockerId)));
}

/**
 * Nạp bối cảnh người xem cho một danh sách. `viewerId` rỗng ⇒ `null` (khách: không thấy gì).
 * `circleKnown` ⇒ bỏ truy vấn quan hệ (bên gọi biết chắc mọi người trong danh sách là người cùng cuộc trò chuyện).
 */
export async function loadPresenceViewer(
  viewerId: number | null | undefined,
  targetIds: number[],
  opts: { circleKnown?: boolean } = {},
): Promise<PresenceViewer | null> {
  if (!viewerId) return null;
  const [me, blocked, circle] = await Promise.all([
    prisma.user.findUnique({ where: { id: viewerId }, select: { showActiveStatus: true } }),
    blockedBetween(viewerId, targetIds),
    opts.circleKnown ? Promise.resolve(null) : presenceCircle(viewerId, targetIds),
  ]);
  return { viewerId, viewerShows: me?.showActiveStatus === true, blocked, circle };
}

/**
 * Lọc tập id ĐANG NỐI socket thành những người `viewerId` được phép thấy online (danh sách "Đang online",
 * `GET /messages/online`). Người xem tắt công tắc ⇒ rỗng.
 */
export async function visibleOnlineIds(viewerId: number, onlineIds: number[]): Promise<number[]> {
  const ids = [...new Set(onlineIds.filter((id) => id !== viewerId))];
  if (!ids.length) return [];
  const viewer = await loadPresenceViewer(viewerId, ids);
  if (!viewer || !viewer.viewerShows) return [];
  const candidates = ids.filter((id) => viewer.circle?.has(id) && !viewer.blocked.has(id));
  if (!candidates.length) return [];
  const rows = await prisma.user.findMany({
    where: { id: { in: candidates }, enabled: true, showActiveStatus: true },
    select: { id: true, showActiveStatus: true, lastActiveAt: true, kind: true },
  });
  const ok = new Set(rows.filter((u) => presenceFor(viewer, u, { connected: true }).visible).map((u) => u.id));
  return candidates.filter((id) => ok.has(id));
}

/**
 * Ai được NHẬN sự kiện socket `presence:update` của `userId`: lấy tập ứng viên (bạn bè ∪ người cùng cuộc trò chuyện),
 * bỏ người chặn/bị chặn, người đã tắt công tắc của chính họ (đối ứng — họ cũng không được thấy qua API), tài khoản
 * bị vô hiệu hoá. Không bao giờ trả "mọi người".
 */
export async function presenceAudience(userId: number, candidateIds: number[]): Promise<number[]> {
  const ids = [...new Set(candidateIds.filter((id) => id !== userId))];
  if (!ids.length) return [];
  const [blocked, rows] = await Promise.all([
    blockedBetween(userId, ids),
    prisma.user.findMany({ where: { id: { in: ids }, enabled: true, showActiveStatus: true }, select: { id: true } }),
  ]);
  const ok = new Set(rows.map((r) => r.id));
  return ids.filter((id) => ok.has(id) && !blocked.has(id));
}
