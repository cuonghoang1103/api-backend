import { logger } from '../../utils/logger.js';
import { xacMinhJWS } from './chuKyApple.js';
import { ghiNhanPayload, thuHoiGiaoDich } from './capPro.js';
import { SAN_PHAM_CUA_APP, taiKhoanTuThe, type GiaoDichApple } from './quyTac.js';
import { prisma } from '../../config/database.js';

// ════════════════════════════════════════════════════════════════
// APP STORE SERVER NOTIFICATIONS V2 — Apple gọi THẲNG máy chủ (12/11/2026, thuê bao CT Language)
//
// Thuê bao tự gia hạn sống ngoài app: gia hạn lúc app tắt, hoàn tiền qua Apple, tắt tự gia hạn trong Cài đặt iPhone.
// Không có thông báo này thì người đã gia hạn mất Pro tới khi mở app, còn người đã được hoàn tiền vẫn giữ Pro.
//
//   body = { signedPayload }  — JWS ký bởi Apple (CÙNG gốc Apple Root CA - G3 ⇒ dùng lại `xacMinhJWS`).
//   payload.data.signedTransactionInfo — JWS giao dịch lồng bên trong ⇒ xác minh LẦN NỮA (không tin vỏ ngoài thay).
//
// Ai là chủ: bảng `apple_iap_links` theo originalTransactionId (lần mua đầu đi qua app, đã đăng nhập) → nếu chưa có
// thì đọc ngược `appAccountToken` (app dựng từ userId). Không tìm được chủ ⇒ bỏ qua, ghi log — KHÔNG đoán.
//
// Trả lời: 200 cho mọi thông báo đã hiểu (kể cả loại không cần làm gì) — Apple gửi lại tới 5 lần nếu không phải 200.
// Chữ ký sai ⇒ 400 (Apple không bao giờ ký sai; đó là kẻ giả mạo, gửi lại cũng vô ích).
// ════════════════════════════════════════════════════════════════

interface ThongBao {
  notificationType?: string;
  subtype?: string;
  notificationUUID?: string;
  data?: { bundleId?: string; environment?: string; signedTransactionInfo?: string };
}

/// Loại thông báo mang một kỳ thuê bao MỚI cần cấp Pro.
const CAP = new Set(['SUBSCRIBED', 'DID_RENEW', 'OFFER_REDEEMED', 'ONE_TIME_CHARGE']);
/// Loại thông báo yêu cầu GỠ phần Pro của giao dịch.
const THU_HOI = new Set(['REFUND', 'REVOKE']);

export interface KetQuaThongBao { loai: string; viec: 'cap' | 'thu-hoi' | 'bo-qua'; ghiChu?: string }

/// Ném lỗi khi CHỮ KÝ sai (tuyến trả 400). Mọi thứ khác ⇒ trả kết quả để tuyến trả 200.
export async function xuLyThongBao(
  signedPayload: string,
  /** Tiêm để kiểm thử (JWS giả). Production LUÔN là `xacMinhJWS` — tuyến không truyền tham số này. */
  xacMinh: <T>(jws: string) => T = xacMinhJWS,
): Promise<KetQuaThongBao> {
  const tb = xacMinh<ThongBao>(signedPayload);
  const loai = `${tb.notificationType ?? '?'}${tb.subtype ? `/${tb.subtype}` : ''}`;
  if (tb.notificationType === 'TEST') return { loai, viec: 'bo-qua', ghiChu: 'thông báo thử của App Store Connect' };
  if (!SAN_PHAM_CUA_APP[tb.data?.bundleId ?? '']) return { loai, viec: 'bo-qua', ghiChu: `bundle lạ ${tb.data?.bundleId}` };
  const jwsGd = tb.data?.signedTransactionInfo;
  if (!jwsGd) return { loai, viec: 'bo-qua', ghiChu: 'không kèm giao dịch' };

  const gd = xacMinh<GiaoDichApple>(jwsGd);
  if (THU_HOI.has(tb.notificationType ?? '')) {
    const ok = await thuHoiGiaoDich(gd.transactionId ?? '', new Date(gd.revocationDate ?? Date.now()), gd.revocationReason ?? null);
    return { loai, viec: ok ? 'thu-hoi' : 'bo-qua', ghiChu: ok ? undefined : 'giao dịch chưa từng ghi nhận / đã thu hồi' };
  }
  if (!CAP.has(tb.notificationType ?? '')) return { loai, viec: 'bo-qua' }; // EXPIRED, DID_FAIL_TO_RENEW, DID_CHANGE_RENEWAL_STATUS…

  const lien = gd.originalTransactionId
    ? await prisma.appleIapLink.findUnique({ where: { originalTransactionId: gd.originalTransactionId }, select: { userId: true } })
    : null;
  const userId = lien?.userId ?? taiKhoanTuThe(gd.appAccountToken);
  if (!userId) {
    logger.warn('[apple-tb] không xác định được chủ giao dịch — bỏ qua', { loai, otid: gd.originalTransactionId });
    return { loai, viec: 'bo-qua', ghiChu: 'không rõ chủ' };
  }
  try {
    const kq = await ghiNhanPayload(userId, gd);
    return { loai, viec: 'cap', ghiChu: `${kq.soNgay} ngày` };
  } catch (e) {
    // Giao dịch hợp chữ ký nhưng luật từ chối (Sandbox trên prod, sản phẩm lạ…) — trả 200 để Apple thôi gửi lại.
    return { loai, viec: 'bo-qua', ghiChu: e instanceof Error ? e.message : String(e) };
  }
}
