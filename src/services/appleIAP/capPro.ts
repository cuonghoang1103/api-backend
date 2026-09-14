import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database.js';
import { BadRequestError } from '../../middleware/errorHandler.js';
import { grantProToUser } from '../pro.service.js';
import { xacMinhJWS, LoiChuKyApple } from './chuKyApple.js';
import { xetGiaoDich, type GiaoDichApple } from './quyTac.js';

// ════════════════════════════════════════════════════════════════
// GHI NHẬN MỘT LƯỢT MUA CỦA APPLE VÀ CẤP PRO
//
// Thứ tự các bước ở đây KHÔNG tuỳ tiện — đổi chỗ là hở tiền:
//
//   1. xác minh CHỮ KÝ  (chuKyApple)      — không có bước này thì ai cũng
//                                            tự ký một giao dịch giả
//   2. xét NỘI DUNG     (quyTac)          — đúng app, đúng môi trường, chưa
//                                            hoàn tiền, sản phẩm có thật
//   3. ràng CHỦ SỞ HỮU  (apple_iap_links) — một lượt mua ↔ một tài khoản
//   4. CHỐT giao dịch   (transaction_id)  — chỗ chống cấp hai lần
//   5. cấp Pro          (grantProToUser)  — dùng chung hàm với web
//
// ⚠️ Bước 4 phải đứng TRƯỚC bước 5. `grantProToUser` CỘNG ngày, nên gọi hai
// lần là cho không thêm một kỳ. Khoá duy nhất trên `transaction_id` là thứ
// duy nhất đảm bảo điều đó không xảy ra khi StoreKit phát lại giao dịch —
// mà nó phát lại thật: mỗi lần mở app với giao dịch chưa `finish()`, và qua
// `Transaction.updates`.
// ════════════════════════════════════════════════════════════════

/// Production chỉ nhận giao dịch Production. Đặt `APPLE_IAP_SANDBOX=true` ở
/// máy dev để thử bằng tài khoản Sandbox.
function chapNhanSandbox(): boolean {
  return process.env.APPLE_IAP_SANDBOX === 'true' || process.env.NODE_ENV !== 'production';
}

export interface KetQuaGhiNhan {
  /// `false` = giao dịch này đã ghi nhận trước đó, không cấp thêm lần nữa.
  moi: boolean;
  maGiaoDich: string;
  soNgay: number;
  /// ISO-8601, hoặc `null` khi Pro trọn đời. Giữ đúng kiểu mà `ProStatus`
  /// dùng để không phải đổi qua đổi lại giữa Date và chuỗi.
  proDenNgay: string | null;
  proTronDoi: boolean;
}

/// Mã lỗi Prisma cho vi phạm ràng buộc duy nhất.
const TRUNG_KHOA = 'P2002';

function laLoiTrungKhoa(e: unknown): boolean {
  return typeof e === 'object' && e !== null && (e as { code?: string }).code === TRUNG_KHOA;
}

/// Nhận một JWS giao dịch từ app, xác minh, và cấp Pro nếu hợp lệ.
///
/// Ném `BadRequestError` với câu nói rõ lý do khi không hợp lệ — app hiện
/// thẳng câu đó, không tự chế câu khác.
export async function ghiNhanGiaoDich(userId: number, jws: string): Promise<KetQuaGhiNhan> {
  // ── 1. Chữ ký ──────────────────────────────────────────────────
  let payload: GiaoDichApple;
  try {
    payload = xacMinhJWS<GiaoDichApple>(jws);
  } catch (e) {
    if (e instanceof LoiChuKyApple) throw new BadRequestError(e.message);
    throw e;
  }

  // ── 2. Nội dung ────────────────────────────────────────────────
  const xet = xetGiaoDich(payload, { chapNhanSandbox: chapNhanSandbox() });
  if (!xet.nhan) throw new BadRequestError(xet.noi);

  // ── 3. Chủ sở hữu ──────────────────────────────────────────────
  //
  // Tạo trước, bắt lỗi trùng sau — KHÔNG đọc-rồi-ghi. Hai yêu cầu song song
  // từ hai tài khoản cùng nhắm một lượt mua sẽ cùng đọc thấy "chưa có ai"
  // rồi cùng ghi; chỉ ràng buộc của cơ sở dữ liệu mới phân xử được.
  try {
    await prisma.appleIapLink.create({
      data: {
        originalTransactionId: xet.maLuotMua,
        userId,
        appAccountToken: xet.theTaiKhoan,
      },
    });
  } catch (e) {
    if (!laLoiTrungKhoa(e)) throw e;
    const cu = await prisma.appleIapLink.findUnique({
      where: { originalTransactionId: xet.maLuotMua },
      select: { userId: true },
    });
    if (cu && cu.userId !== userId) {
      // Cố ý KHÔNG nói tài khoản nào đang giữ — đó là dữ liệu của người khác.
      throw new BadRequestError(
        'Lượt mua này đã gắn với một tài khoản CuongThai khác. '
        + 'Hãy đăng nhập đúng tài khoản đã mua, hoặc liên hệ hỗ trợ.',
      );
    }
  }

  // ── 4. Chốt giao dịch ──────────────────────────────────────────
  let daCo = false;
  try {
    await prisma.appleIapTransaction.create({
      data: {
        transactionId: xet.maGiaoDich,
        originalTransactionId: xet.maLuotMua,
        userId,
        productId: xet.maSanPham,
        grantedDays: xet.soNgay,
        purchaseDate: xet.luc,
        expiresDate: xet.hetHan,
        environment: xet.moiTruong,
        rawPayload: payload as unknown as Prisma.InputJsonValue,
      },
    });
  } catch (e) {
    if (!laLoiTrungKhoa(e)) throw e;
    daCo = true;
  }

  if (daCo) {
    // Đã ghi nhận trước đó. Nhưng có thể lần trước chốt xong rồi chết trước
    // khi cấp — nên vẫn phải nhìn `grantedAt` chứ không trả về ngay.
    const cu = await prisma.appleIapTransaction.findUnique({
      where: { transactionId: xet.maGiaoDich },
      select: { grantedAt: true, userId: true },
    });
    if (cu?.grantedAt) {
      const u = await prisma.user.findUnique({
        where: { id: userId },
        select: { proExpiresAt: true, isPro: true },
      });
      return {
        moi: false,
        maGiaoDich: xet.maGiaoDich,
        soNgay: xet.soNgay,
        proDenNgay: u?.proExpiresAt?.toISOString() ?? null,
        proTronDoi: !!u?.isPro && !u?.proExpiresAt,
      };
    }
    // Chưa cấp ⇒ rơi xuống dưới cấp nốt. Đây chính là lưới cứu.
  }

  // ── 5. Cấp Pro — cùng hàm mà web dùng ─────────────────────────
  const tt = await grantProToUser(userId, xet.soNgay, 'APPLE_IAP');
  await prisma.appleIapTransaction.update({
    where: { transactionId: xet.maGiaoDich },
    data: { grantedAt: new Date() },
  });

  return {
    moi: true,
    maGiaoDich: xet.maGiaoDich,
    soNgay: xet.soNgay,
    proDenNgay: tt.expiresAt,
    proTronDoi: tt.lifetime,
  };
}

/// Lưới cứu: giao dịch đã chốt mà chưa cấp Pro. Chạy được nhiều lần —
/// `grantedAt` là chốt chặn.
export async function capNotNhungGiaoDichConSot(tran = 50): Promise<number> {
  const sot = await prisma.appleIapTransaction.findMany({
    where: { grantedAt: null, revokedAt: null },
    select: { transactionId: true, userId: true, grantedDays: true },
    take: tran,
  });
  let xong = 0;
  for (const g of sot) {
    await grantProToUser(g.userId, g.grantedDays, 'APPLE_IAP');
    await prisma.appleIapTransaction.update({
      where: { transactionId: g.transactionId },
      data: { grantedAt: new Date() },
    });
    xong++;
  }
  return xong;
}
