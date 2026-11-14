/**
 * CT Language — ✍️ AI SỬA BÀI VIẾT (Đợt D "Dịch đủ đường", 14/11/2026 — docs/ct-language-khao-sat-hanzii.md mục 3).
 *
 * Người học dán một đoạn văn bằng ngôn ngữ đang học (Anh/Nhật/Trung) ⇒ máy chủ trả:
 *   · danh sách LỖI (câu gốc, câu sửa, giải thích tiếng Việt, mức độ nhẹ/vừa/nặng, loại lỗi, vị trí trong bài),
 *   · BẢN VIẾT LẠI tự nhiên, một câu NHẬN XÉT,
 *   · ƯỚC LƯỢNG TRÌNH ĐỘ theo hệ của ngôn ngữ: HSK (zh) · JLPT (ja) · CEFR + band IELTS (en).
 *
 * Model: cổng LLM chung (`llmComplete`, purpose `language_tutor` — "chấm câu người học viết", cùng purpose với các tính
 * năng AI khác của CT Language; KHÔNG dùng `exam_grade` vì đó là chấm bài thi dài 4 phút). Trần $/ngày + bảo trì
 * CuongMini áp sẵn ở cổng. Output ÉP JSON rồi KIỂM lại từng trường ở đây (model nói gì thì cũng không lọt kiểu sai về app).
 *
 * Lượt/ngày (giờ VN): free `LUOT_SUA_FREE`, Pro `LUOT_SUA_PRO` — đếm trong RAM như `goiCuongMini.ts` (một tiến trình;
 * khởi động lại thì đếm lại — lệch có lợi cho người dùng). Trừ TRƯỚC khi gọi (hai yêu cầu song song không lách được),
 * HOÀN nếu AI lỗi / trả JSON hỏng.
 *
 * Báo cáo câu trả lời AI (App Store 4.7): `baoCaoSuaBai` — kết quả giữ trong RAM 24 giờ theo `id` để admin thấy ĐÚNG thứ
 * AI đã trả; quá hạn thì dùng đoạn trích app gửi kèm. Không bảng mới (đợt này không được đụng `schema.prisma`).
 *
 * App: đường có `/ai/` ⇒ app gọi `DongYChiaSeAI.batBuoc()` trước khi gửi (App Store 5.1.2(i)).
 */
import { randomUUID } from 'node:crypto';
import { AppError, BadRequestError } from '../../middleware/errorHandler.js';
import { isProEffective } from '../pro.service.js';
import { dauNgayVn } from '../agent/anthropicChinhHang/hanMuc.js';
import { kiemNoiDung } from '../locNoiDung.js';
import { docJsonCham } from '../ielts/thiMay.service.js';
import { logger } from '../../utils/logger.js';

export const LUOT_SUA_FREE = 3;
export const LUOT_SUA_PRO = 30;
export const TRAN_KY_TU = 2000;
export const TOI_THIEU_KY_TU = 4;

export type NnSua = 'en' | 'ja' | 'zh';
export type MucDoLoi = 'nhe' | 'vua' | 'nang';
export const LOAI_LOI = ['ngu-phap', 'tu-vung', 'chinh-ta', 'dau-cau', 'trat-tu', 'van-phong', 'khac'] as const;
export type LoaiLoi = (typeof LOAI_LOI)[number];
export const KIEU_VIET = ['tu-nhien', 'trang-trong', 'bai-thi'] as const;
export type KieuViet = (typeof KIEU_VIET)[number];

export interface LoiSua { goc: string; sua: string; giaiThich: string; mucDo: MucDoLoi; loai: LoaiLoi; viTri: number }
export interface TrinhDoUoc { he: 'HSK' | 'JLPT' | 'CEFR'; muc: string | null; ielts: string | null; lyDo: string }
export interface KetQuaSua {
  id: string;
  nn: NnSua;
  loi: LoiSua[];
  vietLai: string;
  nhanXet: string;
  trinhDo: TrinhDoUoc;
  luot: { laPro: boolean; tran: number; conLai: number };
}

/** Phụ thuộc ra ngoài — test thay bằng bản giả (không gọi AI, không đọc CSDL). */
export interface PhuThuocSua {
  laPro: (userId: number) => Promise<boolean>;
  coAI: () => boolean;
  /** Trả văn bản thô của model. Ném lỗi khi AI hỏng. */
  goi: (o: { system: string; user: string; userId: number }) => Promise<string>;
  baoAdmin: (tb: { tieuDe: string; noiDung: string; userId: number; khoaChongTrung: string }) => Promise<unknown>;
  bayGio: () => Date;
}

const THAT: PhuThuocSua = {
  laPro: isProEffective,
  coAI: () => true,
  goi: async ({ system, user, userId }) => {
    const { llmComplete, isAiAvailable } = await import('../interview/llm/index.js');
    if (!isAiAvailable('language')) throw new AppError('AI đang tạm nghỉ, bạn thử lại sau ít phút nhé.', 503, 'CTL_SUA_AI_NGHI');
    const r = await llmComplete({
      step: 'generation', purpose: 'language_tutor', feature: 'language', userId,
      // 3500: bài 2.000 ký tự + 15–20 lỗi giải thích tiếng Việt + bản viết lại ≈ 2.500 token; dư để không cắt giữa JSON.
      maxTokens: 3500, maxRetries: 1, timeoutMs: 90_000,
      system, messages: [{ role: 'user', content: user }],
    });
    return r.text ?? '';
  },
  baoAdmin: async (tb) => {
    const { baoAdmin } = await import('../thongBaoAdmin.service.js');
    return baoAdmin({ loai: 'BAO_CAO', mucDo: 'can_xu_ly', ...tb });
  },
  bayGio: () => new Date(),
};

// ─── Lượt/ngày ─────────────────────────────────────────────────────────────────────────────────────────────────────
const dem = new Map<string, number>();
const khoaDem = (userId: number, luc: Date) => `${userId}:${dauNgayVn(luc).toISOString().slice(0, 10)}`;

export async function luotSuaBai(userId: number, pt: PhuThuocSua = THAT) {
  const laPro = await pt.laPro(userId);
  const tran = laPro ? LUOT_SUA_PRO : LUOT_SUA_FREE;
  return { laPro, tran, conLai: Math.max(0, tran - (dem.get(khoaDem(userId, pt.bayGio())) ?? 0)) };
}

// ─── Nhắc model ────────────────────────────────────────────────────────────────────────────────────────────────────
const TEN_NN: Record<NnSua, string> = { en: 'tiếng Anh', ja: 'tiếng Nhật', zh: 'tiếng Trung (giản thể)' };
const HE: Record<NnSua, TrinhDoUoc['he']> = { zh: 'HSK', ja: 'JLPT', en: 'CEFR' };
const MUC_HOP_LE: Record<TrinhDoUoc['he'], string[]> = {
  HSK: ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7-9'],
  JLPT: ['N5', 'N4', 'N3', 'N2', 'N1'],
  CEFR: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
};
const MO_TA_KIEU: Record<KieuViet, string> = {
  'tu-nhien': 'tự nhiên như người bản xứ viết hằng ngày',
  'trang-trong': 'trang trọng, lịch sự (thư công việc, email gửi thầy cô/sếp)',
  'bai-thi': 'đúng chuẩn bài thi viết (HSK / JLPT / IELTS Writing tuỳ ngôn ngữ), mạch lạc, từ nối rõ',
};

export function nhacSuaBai(nn: NnSua, kieu: KieuViet): string {
  const he = HE[nn];
  const thang = he === 'CEFR'
    ? '"he":"CEFR","muc":"A1|A2|B1|B2|C1|C2","ielts":"band IELTS Writing ước lượng, ví dụ 5.5 (chuỗi, bước 0.5)"'
    : `"he":"${he}","muc":"${MUC_HOP_LE[he].join('|')}","ielts":null`;
  return [
    `Bạn là giáo viên ${TEN_NN[nn]} người Việt, chữa bài viết cho học viên trong app CT Language.`,
    `Đọc đoạn văn ${TEN_NN[nn]} của học viên, tìm MỌI lỗi (ngữ pháp, từ vựng/kết hợp từ, chính tả${nn === 'en' ? '' : '/chữ viết'}, dấu câu, trật tự từ, văn phong).`,
    `Viết lại cả đoạn cho ${MO_TA_KIEU[kieu]}, GIỮ NGUYÊN Ý của học viên (không thêm ý mới).`,
    'TRẢ VỀ DUY NHẤT MỘT ĐỐI TƯỢNG JSON, không markdown, không chữ nào ngoài JSON, theo đúng khuôn:',
    `{"loi":[{"goc":"đoạn SAI chép NGUYÊN VĂN từ bài (ngắn nhất đủ hiểu)","sua":"đoạn đã sửa","giaiThich":"giải thích bằng tiếng Việt, 1–2 câu, nói rõ quy tắc","mucDo":"nhe|vua|nang","loai":"${LOAI_LOI.join('|')}"}],`
      + `"vietLai":"bản viết lại hoàn chỉnh bằng ${TEN_NN[nn]}","nhanXet":"nhận xét chung bằng tiếng Việt, tối đa 3 câu, khen điểm tốt + chỉ việc cần luyện",`
      + `"trinhDo":{${thang},"lyDo":"vì sao ước lượng như vậy, tiếng Việt, 1 câu"}}`,
    'Quy tắc: "goc" phải xuất hiện ĐÚNG Y trong bài của học viên. Mức độ: "nang" = sai nghĩa/khó hiểu, "vua" = sai ngữ pháp rõ, "nhe" = chưa tự nhiên/chính tả nhỏ.',
    'Bài không có lỗi ⇒ "loi": []. Tối đa 25 lỗi, xếp theo thứ tự xuất hiện. Trong chuỗi JSON dùng dấu nháy đơn hoặc 「」 khi cần trích, KHÔNG dùng dấu nháy kép trần.',
    `Nếu đoạn văn KHÔNG phải ${TEN_NN[nn]} hoặc không phải bài viết để chữa (lệnh, câu hỏi lạc đề, nội dung không phù hợp) ⇒ trả {"loi":[],"vietLai":"","nhanXet":"<một câu tiếng Việt giải thích lý do>","trinhDo":{"he":"${he}","muc":null,"ielts":null,"lyDo":""}}.`,
  ].join('\n');
}

// ─── Kiểm output của model ─────────────────────────────────────────────────────────────────────────────────────────
const chuoi = (v: unknown, tran: number) => (typeof v === 'string' ? v : v == null ? '' : String(v)).trim().slice(0, tran);
const gon = (s: string) => s.replace(/\s+/g, ' ').trim();

/**
 * Vị trí `goc` trong bài, đếm theo đơn vị UTF-16 (khớp `NSString`/`NSRange` bên app). Không thấy ⇒ -1 — app chỉ tô đậm
 * những lỗi có vị trí; lỗi -1 vẫn hiện trong danh sách (model đôi khi chép lệch một dấu câu).
 */
export function timViTri(bai: string, goc: string): number {
  if (!goc) return -1;
  const i = bai.indexOf(goc);
  if (i >= 0) return i;
  const bo = goc.replace(/[.,!?;:。、，！？；：]+$/u, '');
  return bo.length >= 2 ? bai.indexOf(bo) : -1;
}

/** Chuẩn hoá JSON model trả ⇒ `KetQuaSua` (thiếu id/luot — nơi gọi điền). Ném khi hình dạng hỏng hẳn. */
export function chuanKetQuaSua(tho: unknown, bai: string, nn: NnSua): Omit<KetQuaSua, 'id' | 'luot'> {
  if (!tho || typeof tho !== 'object' || Array.isArray(tho)) throw new Error('JSON không phải đối tượng');
  const o = tho as Record<string, unknown>;
  const loiTho = Array.isArray(o.loi) ? o.loi : [];
  const loi: LoiSua[] = [];
  for (const l of loiTho) {
    if (!l || typeof l !== 'object') continue;
    const r = l as Record<string, unknown>;
    const goc = chuoi(r.goc, 400), sua = chuoi(r.sua, 400), giaiThich = chuoi(r.giaiThich ?? r.giai_thich, 600);
    if (!goc || !sua || gon(goc) === gon(sua)) continue;
    const mucDo: MucDoLoi = r.mucDo === 'nhe' || r.mucDo === 'nang' ? r.mucDo : 'vua';
    const loai: LoaiLoi = (LOAI_LOI as readonly string[]).includes(String(r.loai)) ? (r.loai as LoaiLoi) : 'khac';
    loi.push({ goc, sua, giaiThich, mucDo, loai, viTri: timViTri(bai, goc) });
    if (loi.length >= 25) break;
  }
  // Xếp theo vị trí trong bài (lỗi không tìm thấy vị trí xuống cuối, giữ thứ tự model).
  loi.sort((a, b) => (a.viTri < 0 ? 1e9 : a.viTri) - (b.viTri < 0 ? 1e9 : b.viTri));

  const he = HE[nn];
  const td = (o.trinhDo && typeof o.trinhDo === 'object' ? o.trinhDo : {}) as Record<string, unknown>;
  const mucTho = chuoi(td.muc, 20).toUpperCase().replace(/^HSK\s*/, 'HSK ').replace(/\s*[-–]\s*/, '-');
  const muc = MUC_HOP_LE[he].find((m) => m.toUpperCase() === mucTho) ?? null;
  let ielts: string | null = null;
  if (nn === 'en') {
    const b = Number(String(td.ielts ?? '').replace(',', '.'));
    if (Number.isFinite(b) && b >= 1 && b <= 9) ielts = (Math.round(b * 2) / 2).toFixed(1);
  }
  return {
    nn,
    loi,
    vietLai: chuoi(o.vietLai ?? o.viet_lai, 4000),
    nhanXet: chuoi(o.nhanXet ?? o.nhan_xet, 800),
    trinhDo: { he, muc, ielts, lyDo: chuoi(td.lyDo, 300) },
  };
}

// ─── Kết quả gần đây (cho báo cáo) ─────────────────────────────────────────────────────────────────────────────────
interface DaTra { userId: number; luc: number; nn: NnSua; bai: string; ra: string }
const DA_TRA = new Map<string, DaTra>();
const DA_TRA_TTL = 24 * 3600_000;
function nhoKetQua(id: string, v: DaTra) {
  if (DA_TRA.size > 3000) {
    const han = Date.now() - DA_TRA_TTL;
    for (const [k, x] of DA_TRA) if (x.luc < han || DA_TRA.size > 2500) DA_TRA.delete(k);
  }
  DA_TRA.set(id, v);
}

// ─── Sửa bài ───────────────────────────────────────────────────────────────────────────────────────────────────────
export function docNnSua(v: unknown): NnSua {
  if (v === 'en' || v === 'ja' || v === 'zh') return v;
  throw new BadRequestError('Ngôn ngữ phải là en, ja hoặc zh.', 'CTL_SUA_NN');
}

export async function suaBai(userId: number, b: { nn?: unknown; chu?: unknown; kieu?: unknown }, pt: PhuThuocSua = THAT): Promise<KetQuaSua> {
  const nn = docNnSua(b.nn);
  const kieu: KieuViet = (KIEU_VIET as readonly string[]).includes(String(b.kieu)) ? (b.kieu as KieuViet) : 'tu-nhien';
  const bai = String(b.chu ?? '').replace(/\r\n?/g, '\n').trim();
  if (bai.length < TOI_THIEU_KY_TU) throw new BadRequestError('Đoạn văn ngắn quá — viết ít nhất một câu nhé.', 'CTL_SUA_NGAN');
  if (bai.length > TRAN_KY_TU) {
    throw new BadRequestError(`Mỗi lượt sửa tối đa ${TRAN_KY_TU.toLocaleString('vi-VN')} ký tự — bạn chia đoạn ra nhé.`, 'CTL_SUA_DAI');
  }
  if (!pt.coAI()) throw new AppError('AI đang tạm nghỉ, bạn thử lại sau ít phút nhé.', 503, 'CTL_SUA_AI_NGHI');

  const luot = await luotSuaBai(userId, pt);
  if (luot.conLai <= 0) {
    throw new AppError(
      luot.laPro ? `Hôm nay bạn đã nhờ AI sửa đủ ${luot.tran} bài — mai sửa tiếp nhé.`
        : `Hôm nay bạn đã dùng hết ${luot.tran} lượt AI sửa bài miễn phí. Nâng cấp Pro để sửa ${LUOT_SUA_PRO} bài mỗi ngày.`,
      429, 'CTL_SUA_HET_LUOT', { laPro: luot.laPro, tran: luot.tran },
    );
  }
  const k = khoaDem(userId, pt.bayGio());
  if (dem.size > 20_000) dem.clear();
  dem.set(k, (dem.get(k) ?? 0) + 1);
  const hoan = () => dem.set(k, Math.max(0, (dem.get(k) ?? 1) - 1));

  let ra: Omit<KetQuaSua, 'id' | 'luot'>;
  let tho = '';
  try {
    tho = await pt.goi({ system: nhacSuaBai(nn, kieu), user: `Bài của học viên:\n${bai}`, userId });
    ra = chuanKetQuaSua(docJsonCham(tho), bai, nn);
    if (!ra.vietLai && !ra.loi.length && !ra.nhanXet) throw new Error('AI trả rỗng');
  } catch (e) {
    hoan();
    if (e instanceof AppError) throw e;
    logger.warn('[ctl-sua-bai] AI lỗi / JSON hỏng — hoàn lượt', { userId, nn, dai: tho.length, duoi: tho.slice(-160), loi: (e as Error)?.message });
    throw new AppError('AI chưa sửa được bài này. Bạn thử lại sau ít phút nhé (lượt chưa bị trừ).', 503, 'CTL_SUA_AI_LOI');
  }
  // 4.7: câu AI viết đi qua bộ lọc như mọi nội dung hiện cho người dùng.
  const toanBo = [ra.vietLai, ra.nhanXet, ...ra.loi.map((l) => `${l.sua} ${l.giaiThich}`)].join('\n');
  if (kiemNoiDung(toanBo).chan) {
    hoan();
    throw new AppError('Bài viết có nội dung không phù hợp nên AI không chữa được.', 422, 'CTL_SUA_NOI_DUNG');
  }
  const id = randomUUID();
  nhoKetQua(id, { userId, luc: Date.now(), nn, bai, ra: JSON.stringify(ra).slice(0, 3000) });
  return { id, ...ra, luot: { ...luot, conLai: Math.max(0, luot.conLai - 1) } };
}

// ─── Báo cáo câu trả lời AI ────────────────────────────────────────────────────────────────────────────────────────
export const LY_DO_BAO_CAO = ['sai', 'khong-phu-hop', 'bia', 'khac'] as const;
const TEN_LY_DO: Record<(typeof LY_DO_BAO_CAO)[number], string> = {
  sai: 'Sửa sai / giải thích sai', 'khong-phu-hop': 'Nội dung không phù hợp', bia: 'AI bịa (lỗi không có trong bài)', khac: 'Khác',
};

export async function baoCaoSuaBai(userId: number, b: { id?: unknown; lyDo?: unknown; chiTiet?: unknown; trich?: unknown }, pt: PhuThuocSua = THAT) {
  const id = chuoi(b.id, 64);
  if (!id) throw new BadRequestError('Thiếu câu trả lời cần báo cáo.', 'CTL_SUA_BAO_CAO');
  const lyDo = (LY_DO_BAO_CAO as readonly string[]).includes(String(b.lyDo)) ? (b.lyDo as (typeof LY_DO_BAO_CAO)[number]) : 'khac';
  const chiTiet = chuoi(b.chiTiet, 500);
  const v = DA_TRA.get(id);
  const noiDung = [
    `Lý do: ${TEN_LY_DO[lyDo]}`,
    chiTiet && `Chi tiết: ${chiTiet}`,
    v ? `Ngôn ngữ: ${v.nn}` : null,
    v ? `Bài của học viên:\n${v.bai.slice(0, 1500)}` : null,
    v ? `AI trả (JSON):\n${v.ra.slice(0, 2000)}` : `Kết quả đã quá 24 giờ — đoạn trích app gửi:\n${chuoi(b.trich, 1500) || '(trống)'}`,
  ].filter(Boolean).join('\n');
  await pt.baoAdmin({
    tieuDe: `Báo cáo câu trả lời AI "Sửa bài viết" — CT Language (${id.slice(0, 8)})`,
    noiDung, userId, khoaChongTrung: `ctl-sua-bai:${id}:${userId}`,
  });
  return { daBao: true };
}

/** Chỉ cho test: xoá bộ đếm + kết quả đã nhớ. */
export function __datLaiSuaBai() { dem.clear(); DA_TRA.clear(); }
