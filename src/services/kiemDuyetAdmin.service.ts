/**
 * Kiểm duyệt của QUẢN TRỊ SITE từ một báo cáo (App Store 1.2 — "xử lý báo cáo trong 24 giờ", 22/10/2026).
 * ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
 * Mọi báo cáo (Bảng tin, nội dung CT Work, bình luận thẻ, tin nhắn riêng) đã đổ về MỘT hộp thư: `admin_notifications`
 * loại BAO_CAO (/admin/thong-bao) + Telegram. Trước bản này admin chỉ ĐỌC được ở đó: gỡ bài trong không gian mình
 * không là thành viên thì không được (feed.moderatePost đòi quyền `moderate` của không gian), khoá người viết thì phải
 * sang /admin/users tìm tay. Module này cho hai nút ngay trên thông báo:
 *   · `goNoiDung`   — gỡ nội dung bị báo cáo (ẩn/xoá mềm — dòng còn lại để đối chiếu, người dùng không thấy nữa);
 *   · `khoaTacGia`  — khoá tài khoản người viết (`accountNonLocked = false`; mọi yêu cầu sau đó 403 "Account is locked").
 * Mục tiêu đọc từ `khoaChongTrung` mà các cửa báo cáo đã ghi sẵn — không thêm cột:
 *   `ctw-report:<kind>:<id>:<người báo cáo>`  (Bảng tin, /work/report, bình luận thẻ)
 *   `dm-report:<id báo cáo>`                  (tin nhắn riêng — tin cụ thể nếu báo cáo có messageId)
 * Báo cáo không có mục tiêu máy đọc được (hồ sơ, câu trả lời AI) ⇒ 400 `MODERATION_UNSUPPORTED`; admin mở liên kết
 * hoặc khoá người dùng ở /admin/users.
 */
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export type LoaiMucTieu =
  | 'feed_post' | 'feed_comment' | 'chat_message' | 'issue_comment' | 'page_comment' | 'diagram_comment'
  | 'class_post' | 'class_comment' | 'dm_message' | 'dm_thread';

export interface MucTieu { kind: LoaiMucTieu; id: number }

const GO_DUOC: LoaiMucTieu[] = [
  'feed_post', 'feed_comment', 'chat_message', 'issue_comment', 'page_comment', 'diagram_comment', 'class_post', 'class_comment', 'dm_message',
];

/** Đọc mục tiêu từ khoá chống trùng của thông báo. Null = không phải báo cáo có mục tiêu. */
export async function mucTieuCuaKhoa(khoa: string | null | undefined): Promise<MucTieu | null> {
  if (!khoa) return null;
  const ctw = /^ctw-report:([a-z_]+):(\d+):\d+$/.exec(khoa);
  if (ctw) return { kind: ctw[1] as LoaiMucTieu, id: Number(ctw[2]) };
  const dm = /^dm-report:(\d+)$/.exec(khoa);
  if (dm) {
    const r = await prisma.threadReport.findUnique({ where: { id: Number(dm[1]) }, select: { threadId: true, messageId: true } });
    if (!r) return null;
    return r.messageId ? { kind: 'dm_message', id: r.messageId } : { kind: 'dm_thread', id: r.threadId };
  }
  return null;
}

/** Người viết nội dung. Hội thoại cả cụm ⇒ người KIA (không phải người báo cáo). */
export async function tacGiaCua(t: MucTieu, nguoiBaoCao: number | null): Promise<number | null> {
  const id = t.id;
  switch (t.kind) {
    case 'feed_post': return (await prisma.workFeedPost.findUnique({ where: { id }, select: { authorId: true } }))?.authorId ?? null;
    case 'feed_comment': return (await prisma.workFeedComment.findUnique({ where: { id }, select: { authorId: true } }))?.authorId ?? null;
    case 'chat_message': return (await prisma.workChannelMessage.findUnique({ where: { id }, select: { authorId: true } }))?.authorId ?? null;
    case 'issue_comment': return (await prisma.workComment.findUnique({ where: { id }, select: { authorId: true } }))?.authorId ?? null;
    case 'page_comment': return (await prisma.workPageComment.findUnique({ where: { id }, select: { authorId: true } }))?.authorId ?? null;
    case 'diagram_comment': return (await prisma.workDiagramComment.findUnique({ where: { id }, select: { authorId: true } }))?.authorId ?? null;
    case 'class_post': return (await prisma.workClassPost.findUnique({ where: { id }, select: { authorId: true } }))?.authorId ?? null;
    case 'class_comment': return (await prisma.workClassComment.findUnique({ where: { id }, select: { authorId: true } }))?.authorId ?? null;
    case 'dm_message': return (await prisma.message.findUnique({ where: { id }, select: { senderId: true } }))?.senderId ?? null;
    case 'dm_thread': {
      const th = await prisma.messageThread.findUnique({ where: { id }, select: { userId: true, adminUserId: true, userAId: true, userBId: true } });
      if (!th) return null;
      const peers = [th.userAId, th.userBId, th.userId, th.adminUserId].filter((x): x is number => typeof x === 'number' && x !== nguoiBaoCao);
      return peers[0] ?? null;
    }
    default: return null;
  }
}

/** Gỡ nội dung (ẩn/xoá mềm). Trả `false` nếu đã gỡ từ trước hoặc không còn. */
export async function goNoiDung(t: MucTieu, adminId: number): Promise<boolean> {
  const now = new Date();
  const id = t.id;
  switch (t.kind) {
    case 'feed_post': {
      const r = await prisma.workFeedPost.updateMany({ where: { id, hiddenAt: null }, data: { hiddenAt: now, hiddenById: adminId, pinnedAt: null } });
      await prisma.workFeedReport.updateMany({ where: { targetKey: `p:${id}`, status: 'OPEN' }, data: { status: 'RESOLVED', action: 'remove', resolvedById: adminId, resolvedAt: now } });
      return r.count > 0;
    }
    case 'feed_comment': {
      const r = await prisma.workFeedComment.updateMany({ where: { id, hiddenAt: null }, data: { hiddenAt: now, hiddenById: adminId } });
      await prisma.workFeedReport.updateMany({ where: { targetKey: `c:${id}`, status: 'OPEN' }, data: { status: 'RESOLVED', action: 'remove', resolvedById: adminId, resolvedAt: now } });
      return r.count > 0;
    }
    case 'chat_message': return (await prisma.workChannelMessage.updateMany({ where: { id, deletedAt: null }, data: { deletedAt: now } })).count > 0;
    case 'issue_comment': return (await prisma.workComment.updateMany({ where: { id, deletedAt: null }, data: { deletedAt: now } })).count > 0;
    case 'page_comment': return (await prisma.workPageComment.updateMany({ where: { id, deletedAt: null }, data: { deletedAt: now } })).count > 0;
    case 'diagram_comment': return (await prisma.workDiagramComment.updateMany({ where: { id, deletedAt: null }, data: { deletedAt: now } })).count > 0;
    case 'class_post': return (await prisma.workClassPost.updateMany({ where: { id, deletedAt: null }, data: { deletedAt: now } })).count > 0;
    case 'class_comment': return (await prisma.workClassComment.updateMany({ where: { id, deletedAt: null }, data: { deletedAt: now } })).count > 0;
    case 'dm_message': {
      // Đúng đường xoá tin của admin trong Messenger: ẩn với cả hai bên + phát sự kiện + gỡ tệp đính kèm.
      const { messagesService } = await import('./messages.service.js');
      const m = await prisma.message.findUnique({ where: { id }, select: { deletedAt: true, recalledAt: true } });
      if (!m || m.deletedAt || m.recalledAt) return false;
      await messagesService.adminRemoveMessage(id);
      return true;
    }
    default:
      throw new AppError('This report has no single item to remove — open it, or lock the user.', 400, 'MODERATION_UNSUPPORTED');
  }
}

/** Khoá tài khoản (không đảo chiều như toggle-locked). Từ chối khoá chính mình / tài khoản quản trị tối cao. */
export async function khoaNguoiDung(userId: number, adminId: number): Promise<{ id: number; username: string; locked: true }> {
  if (userId === adminId) throw new AppError('Bạn không thể tự khóa tài khoản của mình', 400, 'SELF_MODIFY_FORBIDDEN');
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, email: true } });
  if (!u) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  const { laTaiKhoanToiCao } = await import('./kiemDuyetAdmin.rules.js');
  if (laTaiKhoanToiCao(u)) throw new AppError('Không thể khóa tài khoản super admin', 400, 'SUPER_ADMIN_PROTECTED');
  await prisma.user.update({ where: { id: userId }, data: { accountNonLocked: false } });
  // Ngắt socket đang mở — phiên HTTP đã bị chặn ngay ở middleware auth (accountNonLocked).
  try {
    const { getIO } = await import('../socket/messaging.socket.js');
    getIO()?.in(`user:${userId}`).disconnectSockets(true);
  } catch { /* không có socket */ }
  return { id: u.id, username: u.username, locked: true };
}

async function taiThongBao(id: number) {
  const n = await prisma.adminNotification.findUnique({ where: { id }, select: { id: true, loai: true, khoaChongTrung: true, userId: true } });
  if (!n) throw new AppError('Notification not found', 404, 'NOT_FOUND');
  if (n.loai !== 'BAO_CAO') throw new AppError('Not a report', 400, 'MODERATION_UNSUPPORTED');
  return n;
}

const xongThongBao = (id: number) => prisma.adminNotification.update({ where: { id }, data: { daXuLy: true, daDoc: true, docLuc: new Date() } });

/** Nút "Gỡ nội dung" trên một thông báo BAO_CAO. */
export async function goNoiDungTuThongBao(notificationId: number, adminId: number) {
  const n = await taiThongBao(notificationId);
  const t = await mucTieuCuaKhoa(n.khoaChongTrung);
  if (!t || !GO_DUOC.includes(t.kind)) {
    throw new AppError('This report has no single item to remove — open it, or lock the user.', 400, 'MODERATION_UNSUPPORTED');
  }
  const removed = await goNoiDung(t, adminId);
  await xongThongBao(n.id);
  logger.info('[kiem-duyet] admin gỡ nội dung bị báo cáo', { adminId, notificationId, kind: t.kind, id: t.id, removed });
  return { target: t, removed };
}

/** Nút "Khoá người viết" trên một thông báo BAO_CAO. */
export async function khoaTacGiaTuThongBao(notificationId: number, adminId: number) {
  const n = await taiThongBao(notificationId);
  const t = await mucTieuCuaKhoa(n.khoaChongTrung);
  if (!t) throw new AppError('Could not tell who wrote this — lock the user from /admin/users.', 400, 'MODERATION_UNSUPPORTED');
  const tacGia = await tacGiaCua(t, n.userId);
  if (!tacGia) throw new AppError('Could not tell who wrote this — lock the user from /admin/users.', 400, 'MODERATION_UNSUPPORTED');
  const kq = await khoaNguoiDung(tacGia, adminId);
  await xongThongBao(n.id);
  logger.info('[kiem-duyet] admin khoá người viết nội dung bị báo cáo', { adminId, notificationId, userId: tacGia });
  return { target: t, user: kq };
}

/** /admin/reports: gỡ ĐÚNG tin bị báo cáo (báo cáo có messageId). Báo cáo cả hội thoại ⇒ 400. */
export async function goTinCuaBaoCao(reportId: number, adminId: number) {
  const t = await mucTieuCuaKhoa(`dm-report:${reportId}`);
  if (!t) throw new AppError('Report not found', 404, 'NOT_FOUND');
  if (t.kind !== 'dm_message') throw new AppError('This report is about the whole conversation — open it and delete the messages, or lock the user.', 400, 'MODERATION_UNSUPPORTED');
  return { target: t, removed: await goNoiDung(t, adminId) };
}

/** Cho trang /admin/reports (báo cáo tin nhắn riêng): ai bị báo cáo trong báo cáo này. */
export async function nguoiBiBaoCaoCuaBaoCaoTin(reportId: number): Promise<number | null> {
  const t = await mucTieuCuaKhoa(`dm-report:${reportId}`);
  const r = await prisma.threadReport.findUnique({ where: { id: reportId }, select: { reporterId: true } });
  return t && r ? tacGiaCua(t, r.reporterId) : null;
}
