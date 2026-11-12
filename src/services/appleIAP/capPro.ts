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
  return ghiNhanPayload(userId, payload);
}

/// Bước 2–5 trên một payload ĐÃ XÁC MINH CHỮ KÝ — dùng chung cho app gửi lên (`ghiNhanGiaoDich`) và thông báo máy chủ
/// của Apple (`thongBaoApple.ts`, nơi giao dịch nằm lồng trong `signedTransactionInfo`).
export async function ghiNhanPayload(userId: number, payload: GiaoDichApple): Promise<KetQuaGhiNhan> {
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
  // Kỳ thuê bao đã hết (khôi phục phát lại lịch sử) ⇒ 0 ngày: chốt sổ, KHÔNG gọi grantProToUser (nó bật lại isPro).
  if (xet.soNgay === 0) {
    await prisma.appleIapTransaction.update({ where: { transactionId: xet.maGiaoDich }, data: { grantedAt: new Date() } });
    const u = await prisma.user.findUnique({ where: { id: userId }, select: { proExpiresAt: true, isPro: true } });
    return { moi: false, maGiaoDich: xet.maGiaoDich, soNgay: 0, proDenNgay: u?.proExpiresAt?.toISOString() ?? null, proTronDoi: !!u?.isPro && !u?.proExpiresAt };
  }
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

/// Apple hoàn tiền / thu hồi một giao dịch (thông báo REFUND · REVOKE) ⇒ gỡ phần Pro mà CHÍNH giao dịch đó đã cấp.
///
/// Trừ ngày khỏi hạn hiện tại (không tắt hẳn Pro — người đó có thể còn gói mua trên web). Pro vĩnh viễn ⇒ không đụng.
/// Thuê bao: chỉ trừ phần kỳ CHƯA dùng tính từ lúc hoàn tiền. Chạy lại an toàn: `revokedAt` là chốt chặn.
export async function thuHoiGiaoDich(transactionId: string, luc: Date, lyDo: number | null): Promise<boolean> {
  const g = await prisma.appleIapTransaction.findUnique({ where: { transactionId } });
  if (!g || g.revokedAt) return false;
  await prisma.appleIapTransaction.update({ where: { transactionId }, data: { revokedAt: luc, revocationReason: lyDo } });
  if (!g.grantedAt || g.grantedDays <= 0) return true;
  const conLai = g.expiresDate
    ? Math.min(g.grantedDays, Math.max(0, Math.ceil((g.expiresDate.getTime() - luc.getTime()) / 86_400_000)))
    : g.grantedDays;
  if (conLai <= 0) return true;
  const u = await prisma.user.findUnique({ where: { id: g.userId }, select: { proExpiresAt: true, isPro: true } });
  if (!u?.isPro || !u.proExpiresAt) return true;
  await prisma.user.update({
    where: { id: g.userId },
    data: { proExpiresAt: new Date(u.proExpiresAt.getTime() - conLai * 86_400_000) },
  });
  return true;
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
