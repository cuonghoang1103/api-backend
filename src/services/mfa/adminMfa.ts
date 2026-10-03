/**
 * MỘT chỗ duy nhất quyết định "hành động admin này có cần xác minh MFA không".
 *
 * Mô hình STEP-UP: đăng nhập giữ nguyên ở mọi đường (web, app desktop, iOS).
 * Token chỉ mang claim `mfaAt` (epoch GIÂY) sau khi người dùng nhập đúng mã
 * TOTP/mã khôi phục ở `/auth/mfa/verify|enable`. Claim đó sống
 * `ADMIN_MFA_TTL_HOURS` giờ (mặc định 12) tính từ `mfaAt` — refresh token mang
 * claim theo nhưng KHÔNG gia hạn nó.
 *
 * Luật (xem `quyetDinhMfaAdmin`):
 *   - Admin ĐÃ bật MFA, token không có `mfaAt` hợp lệ ⇒ 403 `MFA_REQUIRED`.
 *   - Admin CHƯA bật MFA ⇒ cho qua (opt-in), TRỪ KHI `ADMIN_MFA_ENFORCE=true`
 *     ⇒ 403 `MFA_SETUP_REQUIRED`. Các route thiết lập MFA dùng `authenticate`
 *     (không đi qua đây) nên luôn mở được.
 *   - `mfaAt` phải ≥ thời điểm bật MFA gần nhất: tắt rồi bật lại (secret mới)
 *     thì mọi token xác minh bằng secret CŨ hết hiệu lực ngay.
 *
 * Ai gọi: `requireAdmin`, `requireRole` (khi quyền tới từ vai trò ADMIN), và
 * mọi chỗ tự kiểm "admin được làm thay chủ sở hữu" (xoá bài/bình luận người
 * khác, sửa playlist người khác…). Chỗ chỉ HIỂN THỊ thì cố ý không gọi.
 */
import { prisma } from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';

export type LoiMfa = 'MFA_REQUIRED' | 'MFA_SETUP_REQUIRED';

/** Phần của JWT liên quan tới MFA — `req.user` thoả kiểu này. */
export interface MfaClaims {
  mfaAt?: number;
}

export interface CauHinhMfa {
  ttlHours: number;
  enforce: boolean;
}

/** Đọc env mỗi lần (rẻ) để test và đổi env không cần khởi động lại module. */
export function cauHinhMfa(): CauHinhMfa {
  const ttl = Number(process.env.ADMIN_MFA_TTL_HOURS);
  const enforce = ['1', 'true', 'yes', 'on'].includes(String(process.env.ADMIN_MFA_ENFORCE ?? '').trim().toLowerCase());
  return { ttlHours: Number.isFinite(ttl) && ttl > 0 ? ttl : 12, enforce };
}

/** Cho phép đồng hồ lệch nhẹ giữa các máy: `mfaAt` "ở tương lai" tối đa 60s. */
const LECH_TUONG_LAI_GIAY = 60;

/**
 * `mfaAt` còn hiệu lực không. Thuần — không đọc CSDL.
 * `enabledAt`: thời điểm bật MFA gần nhất (null = không ràng buộc).
 */
export function mfaAtConHieuLuc(
  mfaAt: unknown,
  opts: { nowSec?: number; ttlHours?: number; enabledAt?: Date | null } = {},
): boolean {
  if (typeof mfaAt !== 'number' || !Number.isFinite(mfaAt) || mfaAt <= 0) return false;
  const now = opts.nowSec ?? Math.floor(Date.now() / 1000);
  const ttl = opts.ttlHours ?? cauHinhMfa().ttlHours;
  if (mfaAt > now + LECH_TUONG_LAI_GIAY) return false;
  if (now - mfaAt >= ttl * 3600) return false;
  if (opts.enabledAt && mfaAt < Math.floor(opts.enabledAt.getTime() / 1000)) return false;
  return true;
}

/** Hạn của bước xác minh (epoch giây) — để giao diện hiện "còn hiệu lực tới…". */
export function hanMfaAt(mfaAt: number, ttlHours = cauHinhMfa().ttlHours): number {
  return mfaAt + Math.round(ttlHours * 3600);
}

/**
 * Quyết định cho MỘT user ĐÃ được xác định là admin. Thuần — test được.
 * Trả `null` = cho qua.
 */
export function quyetDinhMfaAdmin(
  user: { mfaEnabled?: boolean | null; mfaEnabledAt?: Date | null },
  claims: MfaClaims | undefined | null,
  opts: { nowSec?: number; cauHinh?: CauHinhMfa } = {},
): LoiMfa | null {
  const ch = opts.cauHinh ?? cauHinhMfa();
  if (!user.mfaEnabled) return ch.enforce ? 'MFA_SETUP_REQUIRED' : null;
  const ok = mfaAtConHieuLuc(claims?.mfaAt, {
    nowSec: opts.nowSec,
    ttlHours: ch.ttlHours,
    enabledAt: user.mfaEnabledAt ?? null,
  });
  return ok ? null : 'MFA_REQUIRED';
}

export function loiMfa(code: LoiMfa): AppError {
  return code === 'MFA_SETUP_REQUIRED'
    ? new AppError(
        'Tài khoản quản trị phải bật xác thực 2 lớp (MFA) trước. / Admin accounts must set up two-factor authentication first.',
        403,
        'MFA_SETUP_REQUIRED',
        { setupUrl: '/admin/bao-mat-tai-khoan' },
      )
    : new AppError(
        'Cần nhập mã xác thực 2 lớp để làm việc quản trị. / Two-factor verification required for admin actions.',
        403,
        'MFA_REQUIRED',
        { ttlHours: cauHinhMfa().ttlHours },
      );
}

async function taiTrangThaiMfa(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { mfaEnabled: true, mfaEnabledAt: true },
  });
}

/**
 * Cho các chỗ ĐÃ biết người gọi là admin và đang dùng quyền admin (vd xoá bài
 * của người khác). Ném 403 MFA_REQUIRED / MFA_SETUP_REQUIRED nếu chưa đủ.
 * `claims` = `req.user` (JWT đã giải). Thiếu claims ⇒ coi như chưa xác minh
 * (đóng an toàn).
 */
export async function damBaoMfaAdmin(userId: number, claims: MfaClaims | undefined | null): Promise<void> {
  const u = await taiTrangThaiMfa(userId);
  if (!u) return; // user không tồn tại — chỗ gọi tự xử lý quyền
  const loi = quyetDinhMfaAdmin(u, claims);
  if (loi) throw loiMfa(loi);
}

/** Bản không ném — cho chỗ muốn "bỏ qua tác dụng phụ quyền admin" thay vì chặn. */
export async function mfaAdminDat(userId: number, claims: MfaClaims | undefined | null): Promise<boolean> {
  const u = await taiTrangThaiMfa(userId);
  if (!u) return false;
  return quyetDinhMfaAdmin(u, claims) === null;
}
