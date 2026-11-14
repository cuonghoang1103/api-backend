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
import { loiGiamKhao } from './thiNoi.js';

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
export interface PhuThuocGoi {
  laPro: (userId: number) => Promise<boolean>;
  chay: typeof chayLuot;
  /** Thi nói: lời giám khảo của bước `buoc` (kiểm lượt thi đang mở của đúng người). Ném lỗi nếu không hợp lệ. */
  loiThi?: typeof loiGiamKhao;
}
const THAT: PhuThuocGoi = { laPro: isProEffective, chay: chayLuot, loiThi: loiGiamKhao };

/**
 * Một lượt. Lượt free bị trừ TRƯỚC khi chạy (chặn hai yêu cầu song song lách trần), rồi HOÀN lại nếu lượt đó không
 * thành câu trả lời của AI: máy không nghe ra chữ (`nghe` rỗng — ồn, nói quá nhỏ) hoặc AI lỗi (`loi`).
 */
export async function chayLuotGoi(userId: number, vTho: VaoLuot & { nn?: unknown; luotThi?: unknown; buoc?: unknown }, gui: (e: SuKienGoi) => void, signal?: AbortSignal, pt: PhuThuocGoi = THAT) {
  // `loiSan` chỉ máy chủ được đặt — xoá thứ app (có thể) gửi lên: không thì ai cũng mượn được máy đọc của web.
  const { loiSan: _bo, ...v } = vTho;
  // THI NÓI với giám khảo AI (15/11/2026): app gửi `luotThi` (lượt đã mở ở /thi/noi/de/:id/bat-dau) + `buoc` (bước kế của
  // kịch bản). Không gọi model ⇒ KHÔNG tính vào 10 lượt nói miễn phí/ngày (giới hạn của thi nói là 1 đề/cấp/tuần, đếm lúc mở lượt).
  if (v.luotThi !== undefined) {
    let loi: { loi: string; nn: string };
    try { loi = await (pt.loiThi ?? loiGiamKhao)(userId, v.luotThi, v.buoc); }
    catch (e) { gui({ type: 'loi', lyDo: 'thi_noi', message: (e as Error).message.slice(0, 200) }); return; }
    gui({ type: 'luot', laPro: await pt.laPro(userId), conLai: null });
    await pt.chay(userId, { ...v, ngonNgu: loi.nn, lichSu: Array.isArray(v.lichSu) ? v.lichSu.slice(-2) : [], tiepTuc: false, loiSan: `[en]${loi.loi}[/en]` }, gui, signal);
    return;
  }
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
