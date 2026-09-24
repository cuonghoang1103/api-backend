/**
 * Account deletion requests (added 2026-08-08)
 * ============================================
 *
 * Erasure used to be self-service: `POST /profile/delete-account` called
 * `anonymizeAccount()` straight away. That call is IRREVERSIBLE — it nulls
 * the password, rotates the email + username to `deleted+<id>@deleted.local`,
 * disables the account and bumps `roleVersion` to invalidate every session.
 * A misclick, or one hijacked session, destroyed the account with no recourse.
 *
 * Now the user FILES a request and an admin reviews it. `anonymizeAccount()`
 * runs from exactly one place: `approve()` below.
 *
 * Nghị định 13/2023 note: the law gives the data subject a right to erasure,
 * not a right to instant erasure — a review step (and the 72h grace window
 * the UI advertises) is compatible with it, and the export-my-data path is
 * untouched and still instant.
 *
 * ⚠️ 24/09/2026 — TỰ XOÁ sau 72 giờ. App Store 5.1.1(v) chỉ chấp nhận bước
 * duyệt tay với ngành bị quản lý chặt; với app thường, yêu cầu xoá phải
 * dẫn tới xoá THẬT trong một thời hạn nói rõ. Trước đây yêu cầu có thể nằm
 * PENDING vô thời hạn nếu admin không bấm. Nay `tuXoaQuaHan()` (cron mỗi
 * giờ) xoá mọi yêu cầu PENDING đã quá 72 giờ. Admin vẫn duyệt sớm được;
 * người dùng vẫn huỷ được trong 72 giờ đó.
 *
 * State machine:
 *
 *     (none) ──request()──► PENDING ──approve()──► APPROVED  (account erased)
 *                             │
 *                             ├────reject()────► REJECTED
 *                             └────cancel()────► CANCELLED   (user withdrew)
 *
 * Only PENDING is "open". A user may hold at most one open request; filing
 * again while one is open returns the existing row rather than erroring, so
 * a double-tap on a phone is idempotent instead of a 409.
 */

import { prisma } from '../config/database.js';
import { baoAdmin } from './thongBaoAdmin.service.js';
import { AppError } from '../middleware/errorHandler.js';
import { anonymizeAccount } from './dataRights.service.js';
import { emailService } from './email.service.js';
import { logger } from '../utils/logger.js';

export type DeletionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

/** Where admin alerts about new erasure requests go. Same inbox the other
 *  notifyAdmin* helpers in notification.service.ts use. */
const ADMIN_INBOX = 'cuongthaihnhe176322@gmail.com';

const PUBLIC_SELECT = {
  id: true,
  userId: true,
  reason: true,
  status: true,
  usernameAtRequest: true,
  emailAtRequest: true,
  reviewedById: true,
  reviewedAt: true,
  adminNote: true,
  createdAt: true,
  updatedAt: true,
} as const;

function cleanReason(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const t = v.replace(/\s+/g, ' ').trim().slice(0, 500);
  return t.length > 0 ? t : null;
}

/* ─── User-facing ────────────────────────────────────────────────── */

/** The user's most recent request, whatever its status. The settings page
 *  needs the latest row (not just open ones) so it can show "your last
 *  request was rejected on <date> — reason: ...". */
export async function getMyRequest(userId: number) {
  return prisma.accountDeletionRequest.findFirst({
    where: { userId },
    orderBy: { id: 'desc' },
    select: PUBLIC_SELECT,
  });
}

export async function requestDeletion(userId: number, reason: unknown) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, email: true, enabled: true },
  });
  if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  if (!user.enabled) {
    throw new AppError('Tài khoản này đã bị vô hiệu hoá.', 400, 'ACCOUNT_DISABLED');
  }

  // Idempotent: an open request means the user already asked. Return it
  // rather than creating a second row (double-tap, or two tabs open).
  const open = await prisma.accountDeletionRequest.findFirst({
    where: { userId, status: 'PENDING' },
    select: PUBLIC_SELECT,
  });
  if (open) return { request: open, created: false };

  const row = await prisma.accountDeletionRequest.create({
    data: {
      userId,
      reason: cleanReason(reason),
      status: 'PENDING',
      // Snapshot: after APPROVED the user row is anonymised, so without
      // this the audit trail would lose track of whose account was erased.
      usernameAtRequest: user.username,
      emailAtRequest: user.email,
    },
    select: PUBLIC_SELECT,
  });

  void baoAdmin({
    loai: 'XOA_TAI_KHOAN',
    mucDo: 'can_xu_ly',
    tieuDe: 'Có yêu cầu xoá tài khoản',
    duongDan: '/admin/deletion-requests',
    entityId: row.id,
    khoaChongTrung: `XOA_TAI_KHOAN:${row.id}`,
  });

  // Best-effort admin alert — never let a mail failure block the request.
  emailService
    .send({
      to: ADMIN_INBOX,
      subject: `[CuongThai] Yêu cầu xoá tài khoản: ${user.username}`,
      html:
        `<p>Người dùng <b>${user.username}</b> (${user.email}) đã yêu cầu xoá tài khoản.</p>` +
        `<p>Lý do: ${row.reason ? row.reason : '<i>(không ghi)</i>'}</p>` +
        `<p>Duyệt hoặc từ chối tại trang quản trị: /admin/deletion-requests</p>`,
    })
    .catch((err: unknown) => {
      logger.warn('deletion request admin email failed', { error: (err as Error).message });
    });

  return { request: row, created: true };
}

/** User withdraws their own open request. */
export async function cancelRequest(userId: number) {
  const open = await prisma.accountDeletionRequest.findFirst({
    where: { userId, status: 'PENDING' },
    select: { id: true },
  });
  if (!open) {
    throw new AppError('Bạn không có yêu cầu xoá nào đang chờ duyệt.', 404, 'NO_OPEN_REQUEST');
  }
  return prisma.accountDeletionRequest.update({
    where: { id: open.id },
    data: { status: 'CANCELLED', reviewedAt: new Date() },
    select: PUBLIC_SELECT,
  });
}

/* ─── Admin-facing ───────────────────────────────────────────────── */

export async function listRequests(opts: {
  status?: string;
  cursor?: number;
  take?: number;
}) {
  const take = Math.min(Math.max(opts.take ?? 30, 1), 50);
  const status = (['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'] as string[]).includes(
    String(opts.status),
  )
    ? String(opts.status)
    : undefined;

  const rows = await prisma.accountDeletionRequest.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(opts.cursor ? { id: { lt: opts.cursor } } : {}),
    },
    // Open requests first, then newest — the admin's job queue is
    // "what still needs a decision", not "what happened most recently".
    orderBy: [{ status: 'asc' }, { id: 'desc' }],
    take: take + 1,
    select: {
      ...PUBLIC_SELECT,
      user: {
        select: {
          id: true, username: true, email: true, fullName: true,
          displayName: true, avatarUrl: true, createdAt: true, enabled: true,
        },
      },
      reviewedBy: { select: { id: true, username: true, displayName: true } },
    },
  });

  const hasNextPage = rows.length > take;
  const items = hasNextPage ? rows.slice(0, take) : rows;
  return {
    items,
    pagination: {
      nextCursor: hasNextPage ? (items[items.length - 1]?.id ?? null) : null,
      hasNextPage,
      limit: take,
    },
  };
}

export async function requestStats() {
  const [pending, approved, rejected, cancelled] = await Promise.all([
    prisma.accountDeletionRequest.count({ where: { status: 'PENDING' } }),
    prisma.accountDeletionRequest.count({ where: { status: 'APPROVED' } }),
    prisma.accountDeletionRequest.count({ where: { status: 'REJECTED' } }),
    prisma.accountDeletionRequest.count({ where: { status: 'CANCELLED' } }),
  ]);
  return { pending, approved, rejected, cancelled };
}

/** Load a PENDING request or explain precisely why it can't be acted on.
 *  Shared by approve/reject so both give the same error vocabulary. */
async function loadPending(id: number) {
  const row = await prisma.accountDeletionRequest.findUnique({
    where: { id },
    select: { id: true, userId: true, status: true, usernameAtRequest: true },
  });
  if (!row) throw new AppError('Không tìm thấy yêu cầu', 404, 'REQUEST_NOT_FOUND');
  if (row.status !== 'PENDING') {
    throw new AppError(
      `Yêu cầu này đã được xử lý (trạng thái: ${row.status}).`,
      409,
      'REQUEST_ALREADY_REVIEWED',
    );
  }
  return row;
}

/**
 * Approve → the account is anonymised. This is the ONLY caller of
 * `anonymizeAccount()` in the request flow.
 *
 * Order matters: we anonymise FIRST, then stamp the row APPROVED. If the
 * anonymisation throws, the request stays PENDING and the admin sees the
 * error — rather than a row marked APPROVED against an account that is
 * still fully live.
 */
export async function approve(id: number, adminId: number, note: unknown) {
  const row = await loadPending(id);

  await anonymizeAccount(row.userId);

  const updated = await prisma.accountDeletionRequest.update({
    where: { id: row.id },
    data: {
      status: 'APPROVED',
      reviewedById: adminId,
      reviewedAt: new Date(),
      adminNote: cleanReason(note),
    },
    select: PUBLIC_SELECT,
  });

  logger.warn('account erased via approved deletion request', {
    requestId: row.id,
    userId: row.userId,
    username: row.usernameAtRequest,
    adminId,
  });

  return updated;
}

export async function reject(id: number, adminId: number, note: unknown) {
  const row = await loadPending(id);
  return prisma.accountDeletionRequest.update({
    where: { id: row.id },
    data: {
      status: 'REJECTED',
      reviewedById: adminId,
      reviewedAt: new Date(),
      adminNote: cleanReason(note),
    },
    select: PUBLIC_SELECT,
  });
}

/** Thời hạn ân hạn trước khi yêu cầu xoá tự có hiệu lực (khớp chữ trong app/web). */
export const HAN_TU_XOA_GIO = 72;

/**
 * Xoá mọi yêu cầu PENDING đã quá `HAN_TU_XOA_GIO`. Gọi từ cron mỗi giờ.
 * Từng yêu cầu chạy riêng: một tài khoản xoá lỗi không chặn những cái khác,
 * và yêu cầu đó giữ PENDING để lượt sau thử lại (giống `approve()`).
 */
export async function tuXoaQuaHan(): Promise<number> {
  const moc = new Date(Date.now() - HAN_TU_XOA_GIO * 3600_000);
  const quaHan = await prisma.accountDeletionRequest.findMany({
    where: { status: 'PENDING', createdAt: { lte: moc } },
    select: { id: true, userId: true, usernameAtRequest: true },
    take: 50,
  });
  let n = 0;
  for (const row of quaHan) {
    try {
      await anonymizeAccount(row.userId);
      await prisma.accountDeletionRequest.update({
        where: { id: row.id },
        data: {
          status: 'APPROVED',
          reviewedAt: new Date(),
          adminNote: `Tự xoá sau ${HAN_TU_XOA_GIO} giờ`,
        },
      });
      n++;
      logger.warn('account erased automatically after grace window', {
        requestId: row.id, userId: row.userId, username: row.usernameAtRequest,
      });
    } catch (err) {
      logger.error('tự xoá tài khoản lỗi', { requestId: row.id, error: (err as Error).message });
    }
  }
  return n;
}
