/**
 * "Lời mời nhắn tin" — tin từ NGƯỜI LẠ không vào thẳng hộp thư chính (15/11/2026, app CT Language › Tin nhắn).
 *
 * Apple 1.2 + thói quen của các app nhắn tin lớn: người chưa quen nhắn tới thì hội thoại nằm ở tab "Lời mời"; người nhận
 * chọn Chấp nhận (vào hộp chính) · Từ chối (xoá-cho-riêng-tôi, người gửi không được báo) · Chặn. Không cần bảng mới:
 * mốc chấp nhận nằm trong cột JSONB `message_threads.preferences[<userId>].acceptedAt` như ghim/tắt tiếng.
 *
 * Luật (góc nhìn NGƯỜI XEM V, hội thoại USER với người kia P) — là lời mời khi TẤT CẢ đúng:
 *   1. hội thoại loại USER (hội thoại hỗ trợ ADMIN không bao giờ là lời mời);
 *   2. đã có tin, và V CHƯA từng gửi tin nào trong hội thoại (V trả lời ⇒ coi như chấp nhận);
 *   3. V chưa bấm Chấp nhận (`acceptedAt`);
 *   4. V và P KHÔNG quen: không là bạn bè (ACCEPTED), V không theo dõi P (mạng xã hội hoặc cộng đồng CT Language),
 *      không cùng không gian CT Work.
 * Web chưa đọc cờ này ⇒ trên web hội thoại vẫn hiện như cũ (cờ chỉ THÊM, không đổi hành vi cũ).
 */
import { prisma } from '../config/database.js';

export interface DuKienLoiMoi {
  type: string;
  coTin: boolean;
  /** Người xem đã gửi ít nhất một tin trong hội thoại. */
  toiDaGui: boolean;
  daChapNhan: boolean;
  /** Người xem và người kia có quan hệ (bạn, mình theo dõi họ, cùng không gian). */
  quen: boolean;
}

/** Phần thuần — test không cần DB. */
export function laLoiMoi(d: DuKienLoiMoi): boolean {
  if (d.type !== 'USER') return false;
  if (!d.coTin) return false;
  if (d.toiDaGui || d.daChapNhan) return false;
  return !d.quen;
}

/**
 * Trong `peerIds`, ai là người QUEN với `viewerId` (theo nghĩa của luật 4). Bốn truy vấn cho cả danh sách.
 * ⚠️ "Mình theo dõi họ" — chiều MỘT phía là đủ: mình đã chủ động chọn người đó. Họ theo dõi mình thì không tính
 * (ai cũng theo dõi được người khác, không được dùng làm cửa sau để vào hộp chính).
 */
export async function nguoiQuen(viewerId: number, peerIds: number[]): Promise<Set<number>> {
  const ids = [...new Set(peerIds.filter((id) => id !== viewerId))];
  if (!ids.length) return new Set();
  const [ban, theoDoi, theoDoiCtl, cungKg] = await Promise.all([
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
    prisma.follow.findMany({ where: { followerId: viewerId, followingId: { in: ids } }, select: { followingId: true } }),
    prisma.ctlTheoDoi.findMany({ where: { nguoiId: viewerId, duocId: { in: ids } }, select: { duocId: true } }),
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
  for (const f of theoDoi) out.add(f.followingId);
  for (const f of theoDoiCtl) out.add(f.duocId);
  for (const m of cungKg) out.add(m.userId);
  return out;
}

/** Hội thoại nào (trong `threadIds`) người xem đã gửi ít nhất một tin. */
export async function hoiThoaiToiDaGui(viewerId: number, threadIds: number[]): Promise<Set<number>> {
  if (!threadIds.length) return new Set();
  const rows = await prisma.message.groupBy({
    by: ['threadId'],
    where: { senderId: viewerId, threadId: { in: threadIds } },
    _count: { _all: true },
  });
  return new Set(rows.map((r) => r.threadId));
}

/**
 * Cờ lời mời cho cả một danh sách hội thoại của người xem (2 + 4 truy vấn, không N+1).
 * `peerOf(t)` = người kia của hội thoại; `acceptedOf(t)` = người xem đã chấp nhận chưa; `coTinOf(t)` = có tin chưa.
 */
export async function coLoiMoiCho<T extends { id: number; type: string }>(
  viewerId: number,
  threads: T[],
  peerOf: (t: T) => number | null | undefined,
  acceptedOf: (t: T) => boolean,
  coTinOf: (t: T) => boolean,
): Promise<Map<number, boolean>> {
  const ungVien = threads.filter((t) => t.type === 'USER' && coTinOf(t) && !acceptedOf(t));
  const out = new Map<number, boolean>(threads.map((t) => [t.id, false]));
  if (!ungVien.length) return out;
  const [daGui, quen] = await Promise.all([
    hoiThoaiToiDaGui(viewerId, ungVien.map((t) => t.id)),
    nguoiQuen(viewerId, ungVien.map(peerOf).filter((x): x is number => typeof x === 'number')),
  ]);
  for (const t of ungVien) {
    const p = peerOf(t);
    out.set(t.id, laLoiMoi({
      type: t.type, coTin: true, toiDaGui: daGui.has(t.id), daChapNhan: false, quen: typeof p === 'number' && quen.has(p),
    }));
  }
  return out;
}
