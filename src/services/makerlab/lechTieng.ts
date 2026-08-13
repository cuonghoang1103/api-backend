/**
 * ============================================================
 * Nói lệch tiếng — hỏi lại thay vì đọc bừa
 * ============================================================
 *
 * Robot đang ở chế độ tiếng Anh mà người ta nói tiếng Việt (hoặc ngược
 * lại) thì bản trước cứ thế trả lời và đọc lên. Kết quả: **giọng tiếng
 * Anh phát âm chữ tiếng Việt**, nghe không ra chữ nào — người dùng mô tả
 * đúng là "rất khó hiểu".
 *
 * Ở đây làm ba việc, theo đúng thứ tự đó:
 *
 *   1. NHẬN RA  người vừa nói tiếng gì
 *   2. HỎI LẠI  bằng ĐÚNG thứ tiếng đang bật ("bạn đang nói tiếng Việt à,
 *               có muốn tôi đổi không?") — hỏi bằng tiếng kia thì lại rơi
 *               vào chính cái lỗi đang chữa
 *   3. NHẮC     nếu người ta không trả lời có/không mà cứ nói tiếp bằng
 *               thứ tiếng kia
 *
 * ── Vì sao KHÔNG tự đổi luôn cho nhanh ──
 *
 * Vì đoán sai thì hậu quả lệch hẳn nhau. Đoán nhầm rồi HỎI: mất hai giây,
 * nói "không" là xong. Đoán nhầm rồi TỰ ĐỔI: robot đột ngột sang thứ
 * tiếng khác giữa cuộc trò chuyện, giọng đổi, và người dùng không hiểu vì
 * sao — đúng thứ đã làm mất cả buổi chiều nay để lần ra.
 *
 * Và có một ca không tự đổi được: người ta đang HỌC tiếng Anh, cố nói
 * tiếng Anh, thỉnh thoảng chêm tiếng Việt. Tự đổi là phá mất buổi học.
 *
 * ── Vì sao vài từ tiếng Anh trong câu tiếng Việt thì KHÔNG tính ──
 *
 * "Anh mở cái file này lên", "em deploy xong rồi" — đó là tiếng Việt có
 * chêm thuật ngữ, chuyện thường ngày của dân kỹ thuật. Bắt nhầm rồi hỏi
 * "có muốn đổi sang tiếng Anh không?" mỗi lần nhắc tới `deploy` thì tính
 * năng này thành thứ phải tắt đi. Mấy từ đó đã có `phienAm.ts` lo đọc cho
 * đúng rồi.
 */

import type { CheDo } from './cheDo.js';
import { coTheLaTiengViet } from './phienAm.js';

/** Ngưỡng: dưới bằng này TỪ thì không đủ căn cứ để kết luận gì. */
const TOI_THIEU_TU = 4;

/**
 * Bao nhiêu phần trăm số từ phải nghiêng hẳn về một tiếng thì mới tính.
 *
 * 0,7 chứ không 0,5: câu pha trộn là chuyện bình thường, và cái giá của
 * bắt nhầm (robot hỏi giữa chừng) đắt hơn cái giá của bỏ sót (người dùng
 * tự bấm nút).
 */
const NGUONG = 0.7;

/** Chữ CHỈ tiếng Việt mới có — thấy là chắc chắn tiếng Việt. */
const CO_DAU = /[àáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i;

/**
 * Từ chức năng tiếng Anh — thấy nhiều là câu tiếng Anh thật, không phải
 * tiếng Việt chêm thuật ngữ.
 *
 * Đây mới là thứ phân biệt được hai ca:
 *   "em deploy xong rồi"              → 1 từ kỹ thuật, KHÔNG có từ chức năng
 *   "I already deployed it yesterday" → đầy từ chức năng
 *
 * Thuật ngữ thì mượn được; `the`, `is`, `you` thì không ai mượn cả.
 */
const TU_CHUC_NANG_EN = new Set([
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their',
  'a', 'an', 'the', 'this', 'that', 'these', 'those',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'do', 'does', 'did', 'have', 'has', 'had',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'and', 'or', 'but', 'if', 'so', 'because', 'when', 'while', 'than', 'then',
  'of', 'to', 'in', 'on', 'at', 'for', 'with', 'from', 'by', 'about', 'into',
  'not', "don't", "doesn't", "can't", "won't", "isn't", "it's", "i'm",
  'what', 'who', 'where', 'why', 'how', 'which',
  'very', 'just', 'now', 'here', 'there', 'some', 'any', 'all', 'more', 'most',
]);

export interface KetQuaDo {
  /** Tiếng người vừa nói, hoặc `null` nếu không đủ căn cứ. */
  tieng: 'vi' | 'en' | null;
  /** Số từ đã xét — để log, và để biết vì sao kết luận yếu. */
  soTu: number;
  /** Tỉ lệ nghiêng về `tieng`, 0..1. */
  tiLe: number;
}

/**
 * Người vừa nói tiếng gì?
 *
 * Ưu tiên `whisperTieng` nếu có — Whisper nghe cả ngữ âm, chắc hơn nhiều
 * so với đoán từ chính tả. Nhưng chế độ `vi` ÉP Whisper nghe tiếng Việt
 * nên nó không bao giờ báo `en`, và ở đó phải tự đo bằng chữ.
 */
export function doTieng(heard: string, whisperTieng?: string | null): KetQuaDo {
  const tu = (heard.match(/[A-Za-zÀ-ỹ']+/g) || []).filter((t) => t.length >= 1);
  const soTu = tu.length;
  if (soTu < TOI_THIEU_TU) return { tieng: null, soTu, tiLe: 0 };

  // Whisper nói chắc thì nghe Whisper — nhưng chỉ khi nó nói một trong
  // hai thứ tiếng robot biết. Nghe ra tiếng Thái thì đã bị chặn ở tầng
  // trên rồi.
  const wl = String(whisperTieng || '').toLowerCase();
  if (wl === 'vi' || wl === 'vietnamese') return { tieng: 'vi', soTu, tiLe: 1 };
  if (wl === 'en' || wl === 'english') return { tieng: 'en', soTu, tiLe: 1 };

  let viet = 0;
  let anh = 0;
  let chucNang = 0;
  for (const t of tu) {
    const s = t.toLowerCase();
    if (CO_DAU.test(t)) {
      viet++;
      continue;
    }
    if (TU_CHUC_NANG_EN.has(s)) {
      chucNang++;
      anh++;
      continue;
    }
    // ⚠️ ÂM TIẾT TIẾNG VIỆT KHÔNG DÀI QUÁ 7 CHỮ CÁI.
    //
    // Dài nhất là "nghiêng"/"nghiệng" — bỏ dấu còn 7. Nên từ 8 chữ trở
    // lên, không dấu, thì chắc chắn không phải một âm tiết tiếng Việt.
    //
    // Cần thêm dấu hiệu này vì `coTheLaTiengViet` cố ý KHOAN DUNG: nó
    // phục vụ việc phiên âm, nơi bắt nhầm thì phá chữ, nên nó chỉ trả
    // `false` khi chắc chắn. Hậu quả đo được: "I already deployed it
    // yesterday afternoon" chỉ ra 0,67 tiếng Anh vì `already`,
    // `yesterday`, `afternoon` đều lọt qua — cả ba đều hợp âm vị tiếng
    // Việt trên giấy, và cả ba đều dài hơn mọi âm tiết tiếng Việt có
    // thật.
    if (s.length >= 8 || !coTheLaTiengViet(s)) anh++;
    else viet++;
  }

  // ⚠️ TỪ CHỨC NĂNG LÀ ĐIỀU KIỆN CẦN CHO KẾT LUẬN "TIẾNG ANH".
  //
  // Không có nó thì "anh mở cái file config này lên" bị tính thành tiếng
  // Anh vì `file` và `config` đều không hợp âm vị tiếng Việt. Người ta
  // đang nói tiếng Việt và chêm thuật ngữ — đúng ca người dùng dặn PHẢI
  // đọc bình thường, đừng hỏi.
  const tiLeAnh = anh / soTu;
  const tiLeViet = viet / soTu;
  if (tiLeAnh >= NGUONG && chucNang >= 2) return { tieng: 'en', soTu, tiLe: tiLeAnh };
  if (tiLeViet >= NGUONG) return { tieng: 'vi', soTu, tiLe: tiLeViet };
  return { tieng: null, soTu, tiLe: Math.max(tiLeAnh, tiLeViet) };
}

/** Chế độ này đang nghe/nói thứ tiếng nào. */
export function tiengCuaCheDo(cheDo: CheDo): 'vi' | 'en' {
  return cheDo === 'vi' ? 'vi' : 'en';
}

/** Bỏ dấu, gọn về chữ thường — để khớp câu trả lời có/không. */
function gon(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export type TraLoi = 'co' | 'khong' | null;

/**
 * Người ta vừa trả lời có hay không cho câu hỏi đổi tiếng?
 *
 * Nhận CẢ HAI thứ tiếng, vì đây đúng là lúc người ta hay lẫn: robot vừa
 * hỏi bằng tiếng Anh, người ta trả lời "có" bằng tiếng Việt. Bắt buộc
 * đúng tiếng ở đây là dựng thêm một cái bẫy ngay giữa lối thoát.
 *
 * Chỉ nhận câu NGẮN. "Có chứ, mà trước đó tôi muốn hỏi thêm về…" thì
 * không phải một tiếng "có" gọn — để nó đi đường thường.
 */
export function khopCoKhong(heard: string): TraLoi {
  const s = gon(heard);
  if (!s || s.length > 28) return null;
  if (/^(co|co chu|co a|dung|dung roi|vang|u|um|ok|okay|okie|yes|yeah|yep|sure|please|di)\b/.test(s))
    return 'co';
  if (/^(khong|ko|thoi|khoi|dung doi|no|nope|nah|stay|keep)\b/.test(s)) return 'khong';
  return null;
}

/**
 * Câu robot nói ra, viết sẵn theo TIẾNG ĐANG BẬT.
 *
 * ⚠️ Hỏi bằng thứ tiếng người ta vừa nói thì tiện hơn cho họ — nhưng nó
 * đòi giọng của thứ tiếng đó, và ở chế độ tiếng Anh thì giọng đang bật là
 * giọng Anh. Cho giọng Anh đọc câu tiếng Việt chính là lỗi đang chữa.
 *
 * Nên MỌI câu ở đây đều bằng tiếng đang bật, không ngoại lệ.
 */
export const CAU = {
  /** Nghe thấy tiếng kia lần đầu → hỏi có đổi không. */
  hoiDoi: {
    vi: 'Hình như bạn đang nói tiếng Anh. Bạn có muốn tôi chuyển sang tiếng Anh không?',
    en: 'It sounds like you are speaking Vietnamese. Do you want me to switch to Vietnamese?',
  },
  /** Người ta không trả lời có/không mà cứ nói tiếp bằng tiếng kia. */
  nhacNoiLai: {
    vi: 'Tôi vẫn đang ở chế độ tiếng Việt. Bạn nói tiếng Việt giúp tôi, hoặc bảo tôi chuyển sang tiếng Anh nhé.',
    en: 'I am still in English mode. Please speak English so I can understand you, or just say yes and I will switch.',
  },
  /** Trả lời "không" → ở lại. */
  oLai: {
    vi: 'Được, tôi cứ ở tiếng Việt nhé.',
    en: 'Okay, I will stay in English.',
  },
} as const;

/**
 * Lời hỏi/nhắc còn hiệu lực bao lâu.
 *
 * Quá hạn thì coi như chưa hỏi. Không có hạn thì một tiếng "có" buột
 * miệng nửa tiếng sau vẫn làm robot đổi tiếng, và không ai nối được hai
 * việc đó với nhau.
 */
export const HAN_HOI_MS = 90_000;

export interface ChoXacNhan {
  /** Tiếng mà người ta đang nói và robot đề nghị đổi sang. */
  sang: 'vi' | 'en';
  /** Lúc hỏi, milli-giây. */
  luc: number;
  /** Đã nhắc mấy lần rồi — để không nhắc mãi. */
  nhac: number;
}

export function conHan(c: ChoXacNhan | null | undefined, bayGio: number): c is ChoXacNhan {
  return !!c && typeof c.luc === 'number' && bayGio - c.luc < HAN_HOI_MS;
}

/**
 * Bao nhiêu lần nói lệch tiếng thì nhắc một lần.
 *
 * Nhắc MỖI lượt thì robot thành cái máy cằn nhằn, và người đang tập nói
 * tiếng Anh — đúng đối tượng hay nói lệch nhất — sẽ là người bị cằn nhằn
 * nhiều nhất. Nhắc rồi thì im hai lượt, để họ có chỗ mà thử.
 */
export const NHAC_MOI = 3;
