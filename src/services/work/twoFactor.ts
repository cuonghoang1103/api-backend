/**
 * CT Work đợt 7c (C17) — ÉP 2FA theo không gian làm việc.
 *
 * OWNER/ADMIN bật "Require two-factor authentication" (work_security_policies). Từ đó mọi thành viên NGƯỜI đăng nhập
 * bằng PHIÊN (JWT web/app) phải:
 *   1. đã bật 2FA (TOTP của site — /auth/mfa/*, dùng chung với step-up admin), VÀ
 *   2. phiên mang claim `mfaAt` còn hạn (xác minh mã trong ADMIN_MFA_TTL_HOURS giờ — cùng luật `mfaAtConHieuLuc`).
 * Hết thời gian ân hạn (`graceUntil`) mà chưa đạt ⇒ chặn MỌI đường vào không gian đó:
 *   - REST /api/v1/work/**: middleware `workTwoFactorGate` gắn NGỮ CẢNH (AsyncLocalStorage) cho request; hai cửa đọc quyền
 *     duy nhất (`loadProjectAccess` / `loadWorkspaceAccess` trong permissions.ts) hỏi `assertTwoFactorGate` ⇒ mọi
 *     route + mọi service (kể cả trợ lý AI chạy trong request) bị chặn cùng một luật; danh sách xuyên không gian
 *     (My work, tìm kiếm) loại không gian bị chặn qua `gatedWorkspaceIds`.
 *   - Socket phòng dự án / kênh chat: `withTwoFactorGate` bọc lần kiểm quyền lúc join.
 *   Lỗi: chưa bật ⇒ 403 `WORK_2FA_SETUP_REQUIRED` (giao diện đưa tới /work/security); đã bật nhưng phiên chưa xác minh
 *   ⇒ 403 `MFA_REQUIRED` (hộp nhập mã toàn cục có sẵn của site tự mở rồi thử lại request).
 *
 * KHÔNG bị ảnh hưởng (ghi rõ trong giao diện + docs/ctw-dot-7c-de-giao.md):
 *   - token API cá nhân `ctw_…` và token AI agent (máy gọi máy — không có người để nhập mã; bảo vệ bằng phạm vi, hạn
 *     dùng, thu hồi). Token ĐÃ CÓ vẫn chạy. Để token không thành lối vòng qua chính sách: người đang bị chặn ở ít nhất
 *     một không gian KHÔNG tạo được token mới (POST /me/api-tokens ⇒ cùng lỗi của cổng) — bật 2FA xong mới tạo.
 *   - link lịch .ics (bí mật nằm trong URL), link chia sẻ công khai chỉ đọc, cổng khảo sát/xác nhận mockup công khai.
 *   - việc nền (cron, luật tự động, agent BUILTIN) — không có phiên người.
 *
 * Phần THUẦN (`twoFactorState`) test bằng bảng; phần đọc DB nằm ở `loadGate`.
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import type { NextFunction, Request, Response } from 'express';
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { cauHinhMfa, mfaAtConHieuLuc, type MfaClaims } from '../mfa/adminMfa.js';

export type TwoFactorState = 'OK' | 'GRACE' | 'SETUP_REQUIRED' | 'VERIFY_REQUIRED';

/** Trang thiết lập 2FA dành cho thành viên CT Work (dùng API /auth/mfa/* sẵn có của site). */
export const WORK_2FA_SETUP_URL = '/work/security';
export const GRACE_DAYS_MAX = 30;

export interface PolicyLite { require2fa: boolean; graceUntil: Date | null }
export interface UserMfaLite { mfaEnabled: boolean | null; mfaEnabledAt: Date | null }

/**
 * Một người trong một không gian đang ở trạng thái nào. Thuần — không chạm DB.
 *   OK              — không ép, hoặc đã bật 2FA và phiên đã xác minh còn hạn.
 *   GRACE           — chưa đạt nhưng còn trong thời gian ân hạn (cho qua, giao diện nhắc).
 *   SETUP_REQUIRED  — hết ân hạn, chưa bật 2FA.
 *   VERIFY_REQUIRED — hết ân hạn, đã bật nhưng phiên chưa có mfaAt hợp lệ.
 */
export function twoFactorState(
  policy: PolicyLite | null,
  user: UserMfaLite,
  claims: MfaClaims | null | undefined,
  opts: { now?: Date; ttlHours?: number } = {},
): TwoFactorState {
  if (!policy?.require2fa) return 'OK';
  const now = opts.now ?? new Date();
  const verified = !!user.mfaEnabled && mfaAtConHieuLuc(claims?.mfaAt, {
    nowSec: Math.floor(now.getTime() / 1000),
    ttlHours: opts.ttlHours ?? cauHinhMfa().ttlHours,
    enabledAt: user.mfaEnabledAt,
  });
  if (verified) return 'OK';
  if (policy.graceUntil && now < policy.graceUntil) return 'GRACE';
  return user.mfaEnabled ? 'VERIFY_REQUIRED' : 'SETUP_REQUIRED';
}

/** Hạn ân hạn khi bật ép 2FA: now + graceDays (0 = chặn ngay). */
export function graceUntilFrom(now: Date, graceDays: number): Date {
  const d = Math.min(Math.max(Math.trunc(graceDays), 0), GRACE_DAYS_MAX);
  return new Date(now.getTime() + d * 86_400_000);
}

// ─── Ngữ cảnh theo request ───────────────────────────────────────

export interface GateEntry { state: Exclude<TwoFactorState, 'OK'>; workspaceName: string; graceUntil: Date | null }
interface GateCtx { userId: number; blocked: Map<number, GateEntry> }

const store = new AsyncLocalStorage<GateCtx>();

/** Lỗi trả cho một không gian bị chặn. */
export function gateError(workspaceId: number, e: GateEntry): AppError {
  if (e.state === 'VERIFY_REQUIRED') {
    return new AppError(
      `"${e.workspaceName}" requires two-factor authentication. Enter a code from your authenticator app to continue.`,
      403, 'MFA_REQUIRED', { ttlHours: cauHinhMfa().ttlHours, workspaceId, reason: 'WORKSPACE_REQUIRES_2FA' },
    );
  }
  return new AppError(
    `"${e.workspaceName}" requires two-factor authentication. Turn it on for your account to continue.`,
    403, 'WORK_2FA_SETUP_REQUIRED', { workspaceId, workspaceName: e.workspaceName, setupUrl: WORK_2FA_SETUP_URL },
  );
}

/**
 * Gọi từ hai cửa đọc quyền (permissions.ts) SAU khi đã biết `userId` là thành viên của `workspaceId`
 * (người lạ vẫn nhận 404 như cũ — không lộ chính sách của không gian họ không thuộc về).
 * Chỉ áp cho ĐÚNG người của request: listener chạy trong ngữ cảnh của A mà hỏi quyền của B thì bỏ qua.
 */
export function assertTwoFactorGate(userId: number, workspaceId: number): void {
  const ctx = store.getStore();
  if (!ctx || ctx.userId !== userId) return;
  const e = ctx.blocked.get(workspaceId);
  if (e) throw gateError(workspaceId, e);
}

/** Không gian người gọi đang bị chặn (cho danh sách xuyên không gian). Ngoài request / người khác ⇒ []. */
export function gatedWorkspaceIds(userId: number): number[] {
  const ctx = store.getStore();
  return ctx && ctx.userId === userId ? [...ctx.blocked.keys()] : [];
}

/** Trạng thái 2FA của người gọi ở mọi không gian đang ép (đọc DB một lượt). Không có không gian nào ép ⇒ Map rỗng. */
export async function loadGate(userId: number, claims: MfaClaims | null | undefined, now = new Date()): Promise<Map<number, GateEntry>> {
  const policies = await prisma.workSecurityPolicy.findMany({
    where: { require2fa: true, workspace: { deletedAt: null, members: { some: { userId } } } },
    select: { workspaceId: true, graceUntil: true, require2fa: true, workspace: { select: { name: true } } },
  });
  const out = new Map<number, GateEntry>();
  if (!policies.length) return out;
  const u = await prisma.user.findUnique({ where: { id: userId }, select: { mfaEnabled: true, mfaEnabledAt: true, kind: true } });
  // Agent không đăng nhập bằng phiên (buildAuthResponse chặn) — phòng xa: agent không bao giờ bị cổng này chặn.
  if (!u || u.kind === 'AGENT') return out;
  for (const p of policies) {
    const state = twoFactorState(p, u, claims, { now });
    if (state !== 'OK') out.set(p.workspaceId, { state, workspaceName: p.workspace.name, graceUntil: p.graceUntil });
  }
  return out;
}

const blockedOnly = (m: Map<number, GateEntry>) => new Map([...m].filter(([, e]) => e.state !== 'GRACE'));

/** Chạy `fn` trong ngữ cảnh cổng 2FA của `userId` (socket, việc ngoài router REST). */
export async function withTwoFactorGate<T>(userId: number, claims: MfaClaims | null | undefined, fn: () => Promise<T>): Promise<T> {
  const blocked = blockedOnly(await loadGate(userId, claims));
  if (!blocked.size) return fn();
  return store.run({ userId, blocked }, fn);
}

/**
 * Middleware cho router /api/v1/work — đặt SAU apiTokenAuth + authenticate.
 * Token (`req.workToken`, gồm token agent) ⇒ đi thẳng (miễn trừ có chủ ý, xem đầu tệp).
 * Header `X-CTWork-2FA-Grace: <wsId>=<ISO>,…` cho giao diện hiện băng nhắc khi đang ân hạn.
 */
export async function workTwoFactorGate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.workToken || req.agent) return next();
    const uid = req.userId ?? req.user?.userId;
    if (!uid) return next();
    const all = await loadGate(uid, req.user as MfaClaims | undefined);
    if (!all.size) return next();
    const grace = [...all].filter(([, e]) => e.state === 'GRACE' && e.graceUntil).map(([id, e]) => `${id}=${e.graceUntil!.toISOString()}`);
    if (grace.length) res.setHeader('X-CTWork-2FA-Grace', grace.join(','));
    const blocked = blockedOnly(all);
    if (!blocked.size) return next();
    // Tuyến cấp không gian theo id — chặn sớm (service cũng sẽ chặn qua loadWorkspaceAccess).
    const m = /^\/workspaces\/(\d+)(\/|$)/.exec(req.path);
    if (m) {
      const e = blocked.get(Number(m[1]));
      if (e) return next(gateError(Number(m[1]), e));
    }
    store.run({ userId: uid, blocked }, () => next());
  } catch (err) {
    next(err);
  }
}

/**
 * Tạo "chìa khoá không cần người" mới (token API, link lịch .ics) khi đang bị cổng 2FA chặn ở BẤT KỲ không gian nào
 * ⇒ cùng lỗi của cổng. Token/link đã có vẫn chạy (miễn trừ có chủ ý). Đang ân hạn ⇒ cho tạo.
 */
export async function assertNoGateForNewCredential(userId: number, claims: MfaClaims | null | undefined): Promise<void> {
  const blocked = blockedOnly(await loadGate(userId, claims));
  const first = [...blocked][0];
  if (first) throw gateError(first[0], first[1]);
}
