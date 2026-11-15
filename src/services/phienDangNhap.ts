/**
 * Thu hồi phiên đăng nhập theo `roleVersion` (15/11/2026).
 *
 * JWT mang `roleVersion` lúc ký; mọi việc cần đá phiên cũ ra (đổi/đặt lại mật khẩu, "đăng xuất mọi thiết bị", admin đổi
 * vai trò, xoá dữ liệu, chuyển thành agent) đều TĂNG số này trong CSDL. `authenticate`, `requireAdmin` và
 * `/auth/refresh` so hai số — lệch ⇒ 401 `SESSION_REVOKED`. Trước ngày này không chỗ REST nào so (chỉ socket tin nhắn
 * và cộng tác Docs), nên token cũ trên máy khác vẫn chạy và được gia hạn tới 30 ngày sau khi chủ đã đổi mật khẩu.
 */
import { AppError } from '../middleware/errorHandler.js';

/**
 * Token còn hiệu lực theo phiên bản phiên: `roleVersion` trong JWT phải BẰNG bản trong CSDL. Thiếu claim / không phải số
 * ⇒ coi như đã thu hồi (token cổ trước khi có claim — chỉ phải đăng nhập lại một lần).
 */
export function phienConHieuLuc(trongToken: unknown, trongCsdl: bigint | number): boolean {
  const t = typeof trongToken === 'number' ? trongToken : typeof trongToken === 'string' && trongToken.trim() !== '' ? Number(trongToken) : NaN;
  return Number.isFinite(t) && t === Number(trongCsdl);
}

/** 401 dành riêng cho phiên đã bị thu hồi — app/web thấy mã này thì đăng xuất êm, không thử làm mới. */
export function loiPhienThuHoi(): AppError {
  return new AppError('Phiên đăng nhập đã kết thúc (mật khẩu vừa đổi hoặc đã đăng xuất mọi thiết bị). Vui lòng đăng nhập lại.', 401, 'SESSION_REVOKED');
}

