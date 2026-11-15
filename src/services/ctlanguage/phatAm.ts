/**
 * CT Language — 🎙 LUYỆN PHÁT ÂM CHẤM BẰNG AI (15/11/2026). docs/ct-language-app.md mục "Luyện phát âm".
 *
 * Người học nghe mẫu ⇒ đọc một từ / câu ví dụ ⇒ app gửi WAV 16 kHz mono ⇒ Azure Speech Pronunciation Assessment
 * (dùng lại lõi `chamAzure` của web — `src/services/ielts/phatAm.service.ts`) theo ngôn ngữ: en-US (mặc định, có tên âm
 * IPA + điểm ngữ điệu) / en-GB · ja-JP · zh-CN ⇒ điểm tổng, chính xác, trôi chảy, đầy đủ (+ ngữ điệu), điểm từng từ /
 * âm tiết / âm, tiếng Trung gắn thanh từng chữ, gợi ý sửa tiếng Việt bằng LUẬT TĨNH (`phatAmThuan.ts`, không gọi LLM).
 *
 * Giống các tính năng AI khác của CT Language (`hoiGau.ts`):
 *   · Lượt/ngày (giờ VN) đếm trong RAM: free `LUOT_FREE`, Pro `LUOT_PRO`. Chỉ trừ khi CHẤM ĐƯỢC (thiếu khoá, không nghe
 *     thấy, Azure lỗi/hết hạn mức tháng ⇒ không mất lượt).
 *   · Thiếu `AZURE_SPEECH_KEY` ⇒ `lyDo: 'chua_co_khoa'` + câu "Chấm phát âm đang tạm nghỉ…" — KHÔNG ném lỗi, app hiện trạng thái.
 * ⚠️ AUDIO KHÔNG ĐƯỢC LƯU: multer memoryStorage ⇒ RAM ⇒ Azure ⇒ bỏ (giọng nói là dữ liệu sinh trắc).
 * App: đường có `/ai/` ⇒ app gọi `DongYChiaSeAI.batBuoc()` trước khi gửi (App Store 5.1.2(i) — Azure đã có trong công bố).
 */
import { AppError, BadRequestError } from '../../middleware/errorHandler.js';
import { isProEffective } from '../pro.service.js';
import { dauNgayVn } from '../agent/anthropicChinhHang/hanMuc.js';
import { chamAzure, coKhoaPhatAm, giayCuaWav, ngonNguPhatAm, type LyDoPhatAm, type NgonNguPhatAm } from '../ielts/phatAm.service.js';
import { docNnPhatAm, ganThanh, giongAzure, goiYPhatAm, type ChuThanh, type KetQuaCham, type NnPhatAm } from './phatAmThuan.js';

export const LUOT_FREE = 10;
export const LUOT_PRO = 150;
export const TOI_DA_GIAY = 15;
export const TOI_DA_KY_TU = 120;
/** 15 s × 16 kHz × 2 byte = 480 KB + header — multer chặn sớm hơn mức này một chút cho dư. */
export const TOI_DA_BYTE = 600 * 1024;

export const THONG_BAO: Record<LyDoPhatAm, string> = {
  // Câu người dùng đọc (thắng câu của app) — không nói chuyện "máy chủ chưa bật" (15/11/2026). Thiếu AZURE_SPEECH_KEY/REGION.
  chua_co_khoa: 'Chấm phát âm đang tạm nghỉ, bạn thử lại sau nhé. Bạn vẫn nghe mẫu và tự ghi âm để so được.',
  het_luot_ngay: 'Hôm nay bạn đã dùng hết lượt chấm phát âm.',
  het_luot_thang: 'Máy chấm phát âm đã hết hạn mức của tháng này — thử lại sau nhé.',
  khong_nghe_thay: 'Chưa nghe rõ — đọc to, gần micro hơn và đọc đúng câu mẫu.',
  loi_may_cham: 'Máy chấm đang trục trặc, thử lại sau ít phút (lượt chưa bị trừ).',
};

export interface LuotPhatAm { laPro: boolean; tran: number; conLai: number; batChua: boolean }
export interface KetQuaLuyen {
  ketQua: (KetQuaCham & { nn: NnPhatAm; ngonNgu: NgonNguPhatAm; chuThanh: ChuThanh[] }) | null;
  lyDo?: LyDoPhatAm;
  thongBao?: string;
  goiY: string[];
  luot: LuotPhatAm;
}

/** Phụ thuộc ra ngoài — test thay bằng bản giả (không gọi Azure, không CSDL). */
export interface PhuThuocPhatAm {
  laPro: (userId: number) => Promise<boolean>;
  cham: typeof chamAzure;
  coKhoa: () => boolean;
  bayGio: () => Date;
}
const THAT: PhuThuocPhatAm = { laPro: isProEffective, cham: chamAzure, coKhoa: coKhoaPhatAm, bayGio: () => new Date() };

const dem = new Map<string, number>();
const khoaDem = (userId: number, luc: Date) => `${userId}:${dauNgayVn(luc).toISOString().slice(0, 10)}`;

export async function luotPhatAm(userId: number, pt: PhuThuocPhatAm = THAT): Promise<LuotPhatAm> {
  const laPro = await pt.laPro(userId);
  const tran = laPro ? LUOT_PRO : LUOT_FREE;
  return { laPro, tran, conLai: Math.max(0, tran - (dem.get(khoaDem(userId, pt.bayGio())) ?? 0)), batChua: pt.coKhoa() };
}

const chuoi = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v)).replace(/\s+/g, ' ').trim();

export async function luyenPhatAm(
  userId: number,
  b: { audio?: Buffer; cau?: unknown; nn?: unknown; giong?: unknown; doc?: unknown },
  pt: PhuThuocPhatAm = THAT,
): Promise<KetQuaLuyen> {
  const nn = docNnPhatAm(b.nn);
  if (!nn) throw new BadRequestError('nn phải là en, ja hoặc zh', 'CTL_PHAT_AM_NN');
  const cau = chuoi(b.cau);
  if (!cau) throw new BadRequestError('Thiếu câu mẫu', 'CTL_PHAT_AM_CAU');
  if (cau.length > TOI_DA_KY_TU) throw new BadRequestError(`Câu mẫu tối đa ${TOI_DA_KY_TU} ký tự`, 'CTL_PHAT_AM_CAU');
  const audio = b.audio;
  if (!audio?.length) throw new BadRequestError('Thiếu bản ghi', 'CTL_PHAT_AM_AUDIO');
  const giay = giayCuaWav(audio);
  if (giay == null) throw new BadRequestError('Bản ghi phải là WAV PCM 16 kHz', 'CTL_PHAT_AM_AUDIO');
  if (giay > TOI_DA_GIAY + 0.5) throw new BadRequestError(`Bản ghi tối đa ${TOI_DA_GIAY} giây`, 'CTL_PHAT_AM_QUA_DAI');

  const luot = await luotPhatAm(userId, pt);
  if (!luot.batChua) return { ketQua: null, lyDo: 'chua_co_khoa', thongBao: THONG_BAO.chua_co_khoa, goiY: [], luot };
  if (luot.conLai <= 0) {
    throw new AppError(
      luot.laPro ? `Hôm nay bạn đã chấm đủ ${luot.tran} lượt — mai luyện tiếp nhé.`
        : `Hôm nay bạn đã dùng hết ${luot.tran} lượt chấm phát âm miễn phí. Nâng cấp Pro để chấm ${LUOT_PRO} lượt mỗi ngày.`,
      429, 'CTL_PHAT_AM_HET_LUOT', { laPro: luot.laPro, tran: luot.tran },
    );
  }

  const lang = ngonNguPhatAm(giongAzure(nn, b.giong));
  const r = await pt.cham({ audio, cau, lang, toiDaGiay: TOI_DA_GIAY + 0.5, ngonDieu: lang === 'en-US', toiDaKyTu: TOI_DA_KY_TU });
  if (!r.ketQua) {
    const lyDo = r.lyDo ?? 'loi_may_cham';
    return { ketQua: null, lyDo, thongBao: THONG_BAO[lyDo], goiY: [], luot };
  }
  const k = khoaDem(userId, pt.bayGio());
  if (dem.size > 20_000) dem.clear();
  dem.set(k, (dem.get(k) ?? 0) + 1);

  const doc = chuoi(b.doc).slice(0, 400) || null;
  const chuThanh = nn === 'zh' ? ganThanh(r.ketQua.tu, doc) : [];
  return {
    ketQua: { ...r.ketQua, nn, ngonNgu: lang, chuThanh },
    goiY: goiYPhatAm(nn, r.ketQua, chuThanh),
    luot: { ...luot, conLai: Math.max(0, luot.conLai - 1) },
  };
}

export function __datLaiPhatAm() { dem.clear(); }
