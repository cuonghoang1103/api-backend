/**
 * CT Language — GỌI THOẠI CUONGMINI (bước 6, 13/11/2026).
 *
 * KHÔNG viết lại phòng trò chuyện: dùng nguyên `chayLuot` của web (`ielts/troChuyen/troChuyenLuong.service.ts` —
 * Whisper nghe ⇒ model chảy chữ ⇒ cắt câu ⇒ TTS từng câu, ba thứ tiếng, lùi cổng dự phòng, trần $/người/ngày). Chỗ này
 * chỉ thêm luật của app (docs mục 4 — user chốt 12/11): **AI là của Pro, bản miễn phí "vài lượt/ngày"**.
 *   · Free: `LUOT_FREE_NGAY` lượt NÓI mỗi ngày (giờ VN). Câu mở đầu (không audio) không tính — nó không gọi model.
 *   · Pro: không đếm ở đây (vẫn chịu trần 400 lượt/ngày + trần $ của `chayLuot`).
 *   · Chấm cả buổi (band/điểm): chỉ Pro.
 * Đếm trong RAM theo ngày — một tiến trình backend; khởi động lại thì đếm lại từ 0 (chấp nhận: lệch có lợi cho người dùng).
 */
import { AppError } from '../../middleware/errorHandler.js';
import { isProEffective } from '../pro.service.js';
import { dauNgayVn } from '../agent/anthropicChinhHang/hanMuc.js';
import { chamBuoi, chayLuot, type SuKienTC, type VaoLuot } from '../ielts/troChuyen/troChuyenLuong.service.js';

export const LUOT_FREE_NGAY = 10;
const dem = new Map<string, number>();
const khoa = (userId: number) => `${userId}:${dauNgayVn().toISOString().slice(0, 10)}`;
const daDung = (userId: number) => dem.get(khoa(userId)) ?? 0;

export async function luotGoi(userId: number) {
  const laPro = await isProEffective(userId);
  return { laPro, conLai: laPro ? null : Math.max(0, LUOT_FREE_NGAY - daDung(userId)), tran: laPro ? null : LUOT_FREE_NGAY };
}

type SuKienGoi = SuKienTC | { type: 'luot'; conLai: number | null; laPro: boolean };

export async function chayLuotGoi(userId: number, v: VaoLuot & { nn?: unknown }, gui: (e: SuKienGoi) => void, signal?: AbortSignal) {
  const laPro = await isProEffective(userId);
  const coNoi = !!v.audio?.length;
  if (!laPro && coNoi) {
    if (daDung(userId) >= LUOT_FREE_NGAY) {
      gui({ type: 'loi', lyDo: 'can_pro', message: `Hôm nay bạn đã dùng hết ${LUOT_FREE_NGAY} lượt nói miễn phí. Nâng cấp Pro để gọi CuongMini thoải mái.` });
      return;
    }
    const k = khoa(userId);
    dem.set(k, (dem.get(k) ?? 0) + 1);
    if (dem.size > 20_000) dem.clear();
  }
  gui({ type: 'luot', laPro, conLai: laPro ? null : Math.max(0, LUOT_FREE_NGAY - daDung(userId)) });
  // App gửi `nn`; phòng của web đọc `ngonNgu`.
  await chayLuot(userId, { ...v, ngonNgu: v.ngonNgu ?? v.nn }, gui, signal);
}

export async function chamBuoiGoi(userId: number, b: { nn?: unknown; ngonNgu?: unknown; chuDeId?: unknown; tenBai?: unknown; luot?: unknown }) {
  if (!(await isProEffective(userId))) throw new AppError('Chấm điểm cả buổi nói là tính năng Pro.', 403, 'CTL_CAN_PRO');
  return chamBuoi(userId, { ...b, ngonNgu: b.ngonNgu ?? b.nn });
}
