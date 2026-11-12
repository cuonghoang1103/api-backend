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

/** Phụ thuộc ra ngoài — test thay bằng bản giả (không gọi AI, không đọc CSDL). */
export interface PhuThuocGoi { laPro: (userId: number) => Promise<boolean>; chay: typeof chayLuot }
const THAT: PhuThuocGoi = { laPro: isProEffective, chay: chayLuot };

/**
 * Một lượt. Lượt free bị trừ TRƯỚC khi chạy (chặn hai yêu cầu song song lách trần), rồi HOÀN lại nếu lượt đó không
 * thành câu trả lời của AI: máy không nghe ra chữ (`nghe` rỗng — ồn, nói quá nhỏ) hoặc AI lỗi (`loi`).
 */
export async function chayLuotGoi(userId: number, v: VaoLuot & { nn?: unknown }, gui: (e: SuKienGoi) => void, signal?: AbortSignal, pt: PhuThuocGoi = THAT) {
  const laPro = await pt.laPro(userId);
  const coNoi = !!v.audio?.length;
  const k = khoa(userId);
  let daTru = false;
  if (!laPro && coNoi) {
    if (daDung(userId) >= LUOT_FREE_NGAY) {
      gui({ type: 'loi', lyDo: 'can_pro', message: `Hôm nay bạn đã dùng hết ${LUOT_FREE_NGAY} lượt nói miễn phí. Nâng cấp Pro để gọi CuongMini thoải mái.` });
      return;
    }
    if (dem.size > 20_000) dem.clear();
    dem.set(k, (dem.get(k) ?? 0) + 1);
    daTru = true;
  }
  gui({ type: 'luot', laPro, conLai: laPro ? null : Math.max(0, LUOT_FREE_NGAY - daDung(userId)) });
  let hoan = false;
  const guiBoc = (e: SuKienTC) => {
    if (daTru && !hoan && ((e.type === 'nghe' && !e.text.trim()) || e.type === 'loi')) {
      hoan = true;
      dem.set(k, Math.max(0, (dem.get(k) ?? 1) - 1));
    }
    gui(e);
  };
  // App gửi `nn`; phòng của web đọc `ngonNgu`.
  await pt.chay(userId, { ...v, ngonNgu: v.ngonNgu ?? v.nn }, guiBoc, signal);
}

export async function chamBuoiGoi(userId: number, b: { nn?: unknown; ngonNgu?: unknown; chuDeId?: unknown; tenBai?: unknown; luot?: unknown }) {
  if (!(await isProEffective(userId))) throw new AppError('Chấm điểm cả buổi nói là tính năng Pro.', 403, 'CTL_CAN_PRO');
  return chamBuoi(userId, { ...b, ngonNgu: b.ngonNgu ?? b.nn });
}
