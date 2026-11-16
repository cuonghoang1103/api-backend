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
  /** Đổi bản ghi bất kỳ (WAV lạ, m4a…) về WAV PCM 16 kHz mono 16-bit; null = không đọc được. Test thay được. */
  doiWav16k?: (buf: Buffer) => Promise<Buffer | null>;
}
const THAT: PhuThuocPhatAm = { laPro: isProEffective, cham: chamAzure, coKhoa: coKhoaPhatAm, bayGio: () => new Date(), doiWav16k };

/** WAV PCM 16 kHz mono 16-bit, khối `fmt ` ngay sau header (đúng dạng `giayCuaWav`/Azure đọc). THUẦN. */
export function laWav16kChuan(buf: Buffer): boolean {
  if (buf.length < 44 || buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') return false;
  if (buf.toString('ascii', 12, 16) !== 'fmt ' || buf.toString('ascii', 36, 40) !== 'data') return false;
  return buf.readUInt16LE(20) === 1 && buf.readUInt16LE(22) === 1 && buf.readUInt32LE(24) === 16_000 && buf.readUInt16LE(34) === 16;
}

/** ffmpeg (có sẵn trong ảnh backend) đổi qua ống: vào bất kỳ ⇒ ra WAV PCM s16le 16 kHz mono. Trần 20 s. */
export async function doiWav16k(buf: Buffer): Promise<Buffer | null> {
  if (!buf.length) return null;
  const { spawn } = await import('node:child_process');
  return new Promise((ok) => {
    const p = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', 'pipe:0', '-ac', '1', '-ar', '16000', '-acodec', 'pcm_s16le', '-f', 'wav', '-bitexact', 'pipe:1']);
    const ra: Buffer[] = [];
    const hen = setTimeout(() => { p.kill('SIGKILL'); ok(null); }, 20_000);
    p.stdout.on('data', (d: Buffer) => ra.push(d));
    p.on('error', () => { clearTimeout(hen); ok(null); });
    p.on('close', (ma) => {
      clearTimeout(hen);
      const out = Buffer.concat(ra);
      ok(ma === 0 && laWav16kChuan(out) && out.length > 44 ? out : null);
    });
    p.stdin.on('error', () => { /* ffmpeg đóng sớm ⇒ close lo */ });
    p.stdin.end(buf);
  });
}

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
  // 16/11/2026: bản ghi từ màn "Học qua video" (trình phát YouTube đang giữ phiên âm thanh) có thể ra WAV có khối phụ /
  // tần số khác / m4a — trước đây báo cứng "phải là WAV PCM 16 kHz" và người học kẹt. Nay: không đúng chuẩn ⇒ ffmpeg đổi
  // về WAV PCM 16 kHz mono 16-bit rồi chấm; rỗng/hỏng hẳn ⇒ câu dễ hiểu.
  const wav = laWav16kChuan(audio) ? audio : await (pt.doiWav16k ?? doiWav16k)(audio);
  if (!wav) throw new BadRequestError('Bản ghi bị rỗng hoặc hỏng — dừng video rồi bấm micro đọc lại nhé', 'CTL_PHAT_AM_AUDIO');
  const giay = giayCuaWav(wav);
  if (giay == null) throw new BadRequestError('Bản ghi bị rỗng hoặc hỏng — dừng video rồi bấm micro đọc lại nhé', 'CTL_PHAT_AM_AUDIO');
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
  const r = await pt.cham({ audio: wav, cau, lang, toiDaGiay: TOI_DA_GIAY + 0.5, ngonDieu: lang === 'en-US', toiDaKyTu: TOI_DA_KY_TU });
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
