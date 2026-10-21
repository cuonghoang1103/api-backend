/**
 * Data-subject rights (Luật BVDLCN 91/2025/QH15 + Nghị định 356/2025/NĐ-CP, thay NĐ 13/2023 từ 01/01/2026) — self-service export + erasure.
 *
 * - exportUserData: returns a JSON copy of the requesting user's own data.
 * - anonymizeAccount: "delete my account" done as anonymisation, not a hard
 *   row delete. It strips PII from the user + their shop-order records and
 *   disables the account, while keeping the (now anonymous) order rows for
 *   accounting/legal. Bumping roleVersion invalidates all existing sessions.
 *   CourseOrder holds no PII (only a userId link), so nothing to strip there.
 *
 *   21/10/2026 (App Store, CT Work iOS) — xoá tài khoản giờ còn:
 *   · xoá MỌI thẻ thiết bị (device_tokens) ⇒ không còn thông báo đẩy nào tới máy của tài khoản đã xoá;
 *   · thu hồi mọi token API CT Work của người đó (token cá nhân, token lịch .ics) và xoá kết nối OAuth
 *     (Microsoft/Google…: token bên thứ ba mã hoá); ngắt mọi socket đang mở; xoá token đặt lại mật khẩu/xác thực email;
 *   · xoá hội thoại AI riêng của họ (AI Chat trên web + thư mục), và xoá mềm hội thoại AI CT Work ở chế độ
 *     "Riêng tư" do họ tạo. Hội thoại "Dự án" là nội dung chung của nhóm ⇒ GIỮ, như bình luận/thẻ — chỉ còn gắn với
 *     tài khoản đã ẩn danh (khớp trang /chinh-sach-bao-mat);
 *   · tắt trạng thái hoạt động + xoá mốc hoạt động;
 *   · xoá tệp ảnh đại diện / ảnh bìa đã tải lên khỏi kho lưu trữ (best-effort, chỉ khoá images/avatar|cover).
 *   KHÔNG xoá nội dung CT Work dùng chung (thẻ, bình luận, tài liệu) — đồng đội cần chúng; chỉ ẩn danh hoá người viết.
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';
import { getStorageProvider } from '../storage/StorageProvider.js';
import { logger } from '../utils/logger.js';

/** Khoá kho lưu trữ của ảnh đại diện/ảnh bìa người dùng TỰ tải lên — chỉ những khoá này mới được xoá. */
const KHOA_ANH_HO_SO = /^images\/(avatar|cover)\//;

export function khoaAnhHoSo(v: string | null | undefined, keyFromUrl: (u: string) => string | null): string | null {
  if (!v) return null;
  const k = /^https?:\/\//i.test(v) ? keyFromUrl(v) : v.replace(/^\/+/, '').replace(/^uploads\//, '');
  return k && KHOA_ANH_HO_SO.test(k) ? k : null;
}

export async function exportUserData(userId: number): Promise<unknown> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true, username: true, email: true, fullName: true, displayName: true,
      bio: true, avatarUrl: true, coverPhotoUrl: true, phone: true,
      provider: true, createdAt: true, lastLoginAt: true,
    },
  });
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

  const [shopOrders, courseOrders] = await Promise.all([
    prisma.shopOrder.findMany({
      where: { userId },
      select: {
        orderCode: true, status: true, buyerName: true, buyerEmail: true,
        buyerPhone: true, buyerAddress: true, createdAt: true,
      },
      orderBy: { id: 'desc' },
    }),
    prisma.courseOrder.findMany({
      where: { userId },
      select: { orderCode: true, courseId: true, status: true, paymentMethod: true, createdAt: true },
      orderBy: { id: 'desc' },
    }),
  ]);

  return {
    exportedAt: new Date().toISOString(),
    note: 'Bản sao dữ liệu cá nhân của bạn trên CuongThai (Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP).',
    profile: user,
    shopOrders,
    courseOrders,
  };
}

export async function anonymizeAccount(userId: number): Promise<{ anonymized: true }> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, avatarUrl: true, coverPhotoUrl: true } });
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  const now = new Date();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        // Deterministic + unique (keeps the email/username unique constraints).
        email: `deleted+${userId}@deleted.local`,
        username: `deleted_${userId}`,
        fullName: null,
        displayName: null,
        bio: null,
        avatarUrl: null,
        coverPhotoUrl: null,
        phone: null,
        lastLoginIp: null,
        lastLoginUserAgent: null,
        password: null,          // credentials login no longer possible
        enabled: false,          // account disabled
        roleVersion: { increment: 1 }, // invalidate all existing sessions/JWTs
        showActiveStatus: false,
        lastActiveAt: null,
      },
    }),
    // Không còn thông báo đẩy nào tới thiết bị của tài khoản đã xoá.
    prisma.deviceToken.deleteMany({ where: { userId } }),
    // Token API CT Work (cá nhân + lịch .ics). apiTokenAuth đã chặn tài khoản bị vô hiệu hoá; thu hồi để dù ai bật
    // lại tài khoản thì token cũ cũng không sống lại.
    prisma.workApiToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: now } }),
    prisma.workOAuthConnection.deleteMany({ where: { userId } }),
    prisma.passwordResetToken.deleteMany({ where: { userId } }),
    prisma.emailVerificationToken.deleteMany({ where: { userId } }),
    // Hội thoại AI riêng (AI Chat web): tin nhắn + thống kê xoá theo (onDelete: Cascade).
    prisma.chatSession.deleteMany({ where: { userId } }),
    prisma.chatFolder.deleteMany({ where: { userId } }),
    // Hội thoại AI CT Work "Riêng tư" do họ tạo — chỉ họ đọc được, nên xoá mềm (như nút Xoá hội thoại).
    prisma.workAiThread.updateMany({
      where: { createdById: userId, visibility: 'PRIVATE', deletedAt: null },
      data: { deletedAt: now },
    }),
    // Strip PII from the buyer's orders but keep the (now anonymous) records.
    prisma.shopOrder.updateMany({
      where: { userId },
      data: {
        buyerName: 'Đã xoá',
        buyerEmail: `deleted+${userId}@deleted.local`,
        buyerPhone: null,
        buyerAddress: null,
      },
    }),
  ]);

  // Sau khi CSDL đã xong (best-effort, không làm hỏng việc xoá): ngắt mọi socket đang mở và xoá ảnh hồ sơ đã tải lên.
  try {
    const { getIO } = await import('../socket/messaging.socket.js');
    getIO()?.in(`user:${userId}`).disconnectSockets(true);
  } catch (err) {
    logger.warn('anonymizeAccount: disconnect sockets failed', { userId, error: (err as Error).message });
  }
  try {
    const storage = getStorageProvider();
    const keys = [user.avatarUrl, user.coverPhotoUrl]
      .map((v) => khoaAnhHoSo(v, (u) => storage.keyFromUrl(u)))
      .filter((k): k is string => !!k);
    if (keys.length) await storage.deleteMany([...new Set(keys)]);
  } catch (err) {
    logger.warn('anonymizeAccount: delete profile images failed', { userId, error: (err as Error).message });
  }

  return { anonymized: true };
}
