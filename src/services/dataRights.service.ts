/**
 * Data-subject rights (Nghị định 13/2023/NĐ-CP) — self-service export + erasure.
 *
 * - exportUserData: returns a JSON copy of the requesting user's own data.
 * - anonymizeAccount: "delete my account" done as anonymisation, not a hard
 *   row delete. It strips PII from the user + their shop-order records and
 *   disables the account, while keeping the (now anonymous) order rows for
 *   accounting/legal. Bumping roleVersion invalidates all existing sessions.
 *   CourseOrder holds no PII (only a userId link), so nothing to strip there.
 */

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

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
    note: 'Bản sao dữ liệu cá nhân của bạn trên CuongThai (Nghị định 13/2023/NĐ-CP).',
    profile: user,
    shopOrders,
    courseOrders,
  };
}

export async function anonymizeAccount(userId: number): Promise<{ anonymized: true }> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');

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
      },
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

  return { anonymized: true };
}
