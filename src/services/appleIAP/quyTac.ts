import { ngayChoThang } from '../billing.service.js';

// ════════════════════════════════════════════════════════════════
// LUẬT XÉT MỘT GIAO DỊCH APPLE — phần THUẦN, không đụng cơ sở dữ liệu
//
// Tách khỏi `capPro.ts` để kiểm được bằng phép kiểm thường: mọi quyết định
// "có cấp Pro hay không, cấp bao nhiêu ngày" nằm gọn ở đây, còn phần ghi
// bảng và gọi `grantProToUser` chỉ là tay chân.
//
// ⚠️ Chữ ký đã được `chuKyApple.ts` xác minh TRƯỚC khi tới đây. File này lo
// phần còn lại: đúng app không, đúng môi trường không, đã bị hoàn tiền chưa,
// sản phẩm này đáng mấy ngày.
// ════════════════════════════════════════════════════════════════

/// Payload giao dịch của StoreKit 2 (`JWSTransactionDecodedPayload`).
/// Chỉ khai những trường thực sự dùng — Apple thêm trường mới liên tục và
/// khai thừa chỉ tạo ra chỗ để sai.
export interface GiaoDichApple {
  transactionId?: string;
  originalTransactionId?: string;
  bundleId?: string;
  productId?: string;
  /// Mili-giây kể từ epoch.
  purchaseDate?: number;
  expiresDate?: number;
  /// "Auto-Renewable Subscription" · "Non-Renewing Subscription" ·
  /// "Non-Consumable" · "Consumable"
  type?: string;
  /// "Sandbox" hoặc "Production".
  environment?: string;
  /// Có giá trị ⇒ Apple đã hoàn tiền / thu hồi.
  revocationDate?: number;
  revocationReason?: number;
  /// UUID app gắn lúc mua để chỉ đúng tài khoản CuongThai.
  appAccountToken?: string;
  quantity?: number;
}

/// Mã sản phẩm trên App Store Connect → số THÁNG.
///
/// ⚠️ Chỉ khai số tháng, KHÔNG khai số ngày: quy đổi để `ngayChoThang()` của
/// `billing.service` làm, đúng hàm mà ví điểm / VietQR / PayOS đang dùng. Gõ
/// "30" lần nữa ở đây là mở đường cho hai con số lệch nhau về sau.
export const SAN_PHAM_PRO: Readonly<Record<string, number>> = Object.freeze({
  'com.cuongthai.app.pro.1m': 1,
  'com.cuongthai.app.pro.3m': 3,
  'com.cuongthai.app.pro.6m': 6,
  'com.cuongthai.app.pro.12m': 12,
});

export const BUNDLE_ID = 'com.cuongthai.app';

export type LyDoTuChoi =
  | 'thieu_ma_giao_dich'
  | 'sai_ung_dung'
  | 'sai_moi_truong'
  | 'da_hoan_tien'
  | 'san_pham_la';

export type KetQuaXet =
  | { nhan: true; maGiaoDich: string; maLuotMua: string; maSanPham: string;
      soNgay: number; luc: Date; hetHan: Date | null; moiTruong: string;
      theTaiKhoan: string | null }
  | { nhan: false; vi: LyDoTuChoi; noi: string };

export interface BoiCanhXet {
  /// Môi trường máy chủ chấp nhận. Production chỉ nhận "Production"; máy dev
  /// nhận cả hai để thử bằng tài khoản Sandbox.
  chapNhanSandbox: boolean;
}

/// Xét một giao dịch ĐÃ XÁC MINH CHỮ KÝ.
export function xetGiaoDich(gd: GiaoDichApple, bc: BoiCanhXet): KetQuaXet {
  if (!gd.transactionId || !gd.originalTransactionId) {
    return { nhan: false, vi: 'thieu_ma_giao_dich', noi: 'Giao dịch thiếu mã định danh.' };
  }

  // Chữ ký của Apple hợp lệ KHÔNG có nghĩa là giao dịch của app mình: Apple
  // ký cho mọi app trên App Store. Thiếu phép kiểm này thì một giao dịch thật
  // 0,99$ mua ở app bất kỳ cũng đổi được 12 tháng Pro ở đây.
  if (gd.bundleId !== BUNDLE_ID) {
    return { nhan: false, vi: 'sai_ung_dung', noi: `Giao dịch thuộc app khác (${gd.bundleId ?? 'không rõ'}).` };
  }

  // Tài khoản Sandbox mua được không mất đồng nào. Nhận nó trên production là
  // phát Pro miễn phí cho bất cứ ai biết bật chế độ thử của StoreKit.
  const laSandbox = gd.environment !== 'Production';
  if (laSandbox && !bc.chapNhanSandbox) {
    return { nhan: false, vi: 'sai_moi_truong', noi: 'Giao dịch Sandbox không được cấp Pro trên production.' };
  }

  if (gd.revocationDate) {
    return { nhan: false, vi: 'da_hoan_tien', noi: 'Giao dịch đã bị hoàn tiền hoặc thu hồi.' };
  }

  const thang = SAN_PHAM_PRO[gd.productId ?? ''];
  if (!thang) {
    return { nhan: false, vi: 'san_pham_la', noi: `Không biết sản phẩm "${gd.productId ?? ''}".` };
  }

  return {
    nhan: true,
    maGiaoDich: gd.transactionId,
    maLuotMua: gd.originalTransactionId,
    maSanPham: gd.productId!,
    soNgay: ngayChoThang(thang),
    // Thiếu `purchaseDate` thì lấy giờ máy chủ — thà lệch vài giây còn hơn
    // ghi `new Date(undefined)` = Invalid Date rồi Prisma ném lúc ghi.
    luc: gd.purchaseDate ? new Date(gd.purchaseDate) : new Date(),
    hetHan: gd.expiresDate ? new Date(gd.expiresDate) : null,
    moiTruong: laSandbox ? 'Sandbox' : 'Production',
    theTaiKhoan: gd.appAccountToken ?? null,
  };
}

/// Đọc ngược `appAccountToken` về `userId`.
///
/// App dựng token bằng `KhoPro.theTaiKhoan(userId)` ở
/// `CuongThaiApp/Shared/Pro/KhoPro.swift`: 12 hex cuối của một UUID là chính
/// `userId`. Không lưu bảng tra, không sinh ngẫu nhiên — cài lại app vẫn ra
/// cùng một giá trị.
///
/// Cần cho App Store Server Notifications: Apple gửi thẳng tới máy chủ, lúc
/// đó KHÔNG có phiên đăng nhập nào để hỏi "giao dịch này của ai".
///
/// ⚠️ Swift in `UUID.uuidString` bằng chữ HOA trong khi app dựng chuỗi bằng
/// `%012x` chữ thường. So chuỗi có phân biệt hoa thường ở đây là hỏng câm —
/// `parseInt(…, 16)` không phân biệt nên đường này an toàn, và phép kiểm bên
/// cạnh ghim cả hai dạng lại.
export function taiKhoanTuThe(token: string | null | undefined): number | null {
  if (!token) return null;
  const khuc = token.split('-');
  if (khuc.length !== 5 || khuc[4].length !== 12) return null;
  if (!/^[0-9a-fA-F]{12}$/.test(khuc[4])) return null;
  const id = parseInt(khuc[4], 16);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
