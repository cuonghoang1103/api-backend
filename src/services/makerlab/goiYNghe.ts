/**
 * ============================================================
 * Gợi ý từ vựng cho bộ nghe — bảo Whisper trước nó sắp nghe gì
 * ============================================================
 *
 * Whisper nhận một trường `prompt`: vài dòng chữ để nghiêng bộ giải mã về
 * đúng vốn từ sắp gặp. Nó KHÔNG phải câu lệnh, nó là mồi ngữ cảnh — model
 * đọc nó như thể đó là phần văn bản đứng ngay trước đoạn tiếng.
 *
 * ⚠️ ĐANG BỎ KHÔNG. Hàm `transcribeWithGroq` nhận `hints` và gửi thành
 * `prompt` từ lâu; phòng thi có dùng (`buildHintForTurn`), nhưng robot thì
 * gọi mà không truyền gì. Tức là mỗi lượt nói đều vứt đi một khoản độ
 * chính xác không tốn thêm một đồng nào.
 *
 * Đây là thứ chữa đúng loại lỗi khó chịu nhất: TÊN RIÊNG và THUẬT NGỮ.
 * Whisper nghe "Cường" thành "Cường"/"Cương"/"Cường" tuỳ hôm, nghe
 * "deploy" thành "đi bơi", nghe "ESP32" thành "ét pê ba hai". Mồi sẵn
 * những chữ đó thì nó chọn đúng.
 *
 * ── Ba luật, học từ chỗ khác trong repo ──
 *
 * 1. **Đúng TIẾNG đang bật.** Mồi tiếng Việt cho lượt nghe tiếng Anh là
 *    kéo bộ giải mã về phía sai — Whisper coi `prompt` như văn cảnh, và
 *    văn cảnh sai tiếng thì nó đoán sai tiếng. Cùng họ với bài học
 *    "few-shot sai tiếng đè chết lệnh trả lời bằng tiếng X".
 *
 * 2. **NGẮN.** Whisper cắt `prompt` ở ~224 token; nhồi dài thì phần đuôi
 *    bị vứt lặng lẽ, và chữ quan trọng nhất thường nằm ở đuôi vì người ta
 *    hay thêm vào cuối. Ở đây trần 380 ký tự, cắt ở ranh giới từ.
 *
 * 3. **Chỉ TỪ, không câu.** Câu mẫu trong `prompt` bị Whisper chép thẳng
 *    ra khi nó nghe không rõ — thành một kiểu bịa mới, mà lần này là do
 *    chính ta mớm. Danh sách từ rời thì không có gì để chép nguyên.
 */

import type { CheDo } from './cheDo.js';
import { tuKhoaCongNghe } from './phienAm.js';

/** Trần ký tự — xem luật 2 ở đầu file. */
const TRAN = 380;

/** Tên lệnh và từ điều khiển hay nói với robot, tiếng Việt. */
const TU_DIEU_KHIEN_VI = [
  'đi tới', 'lùi lại', 'rẽ trái', 'rẽ phải', 'dừng lại', 'quay đầu',
  'to lên', 'nhỏ lại', 'âm lượng', 'bật nhạc', 'tắt nhạc',
  'nhìn tôi', 'gật đầu', 'lắc đầu', 'nhảy đi',
  'tiếng Anh', 'tiếng Việt', 'giọng robot', 'đổi model',
];

const TU_DIEU_KHIEN_EN = [
  'go forward', 'back up', 'turn left', 'turn right', 'stop', 'spin',
  'volume up', 'volume down', 'play music', 'stop music',
  'look at me', 'nod', 'shake', 'dance',
  'speak Vietnamese', 'robot voice',
];

/**
 * Dựng chuỗi gợi ý cho một lượt nghe.
 *
 * Lấy từ ba nguồn, theo đúng thứ tự ưu tiên đó — nguồn trước quan trọng
 * hơn vì nếu phải cắt thì phần đuôi mất trước:
 *
 *   1. TÊN RIÊNG trong kho kiến thức người dùng tự dạy — đây là chữ
 *      Whisper sai nhiều nhất và cũng là chữ người dùng khó chịu nhất khi
 *      nghe sai (tên mình, tên người thân).
 *   2. Từ điều khiển — nghe sai là robot làm sai việc, không chỉ chép sai.
 *   3. Thuật ngữ công nghệ — đã có sẵn danh sách bên `phienAm.ts`, dùng
 *      lại thay vì chép ra bản thứ hai rồi để hai bản trôi khỏi nhau.
 */
export function goiYNghe(
  cheDo: CheDo,
  kienThuc: Array<{ q: string; a: string }>,
  tenRobot?: string | null,
  tuDanhThuc?: string | null,
): string {
  const vi = cheDo === 'vi';
  const phan: string[] = [];

  if (tenRobot) phan.push(tenRobot);
  if (tuDanhThuc) phan.push(tuDanhThuc);

  /**
   * Tên riêng, lấy từ phần TRẢ LỜI của kho kiến thức — đó là chỗ người
   * dùng tự viết tên mình, tên người quen.
   *
   * ⚠️ HAI CÁI BẪY, DÍNH CẢ HAI Ở BẢN ĐẦU:
   *
   * 1. `[A-ZÀ-Ỹ]` KHÔNG phải "chữ hoa tiếng Việt". Dải `À-Ỹ` trong
   *    Unicode chạy từ U+00C0 tới U+1EF9 và chứa CẢ chữ thường có dấu
   *    (à, ậ, ó…). Nên nó khớp giữa chữ và moi ra `ậy đi`, `óng` từ
   *    "dậy đi", "bóng". Dùng `\p{Lu}` mới đúng nghĩa "chữ hoa".
   *
   * 2. `\b` không khớp ranh giới chữ Việt có dấu — xem
   *    [[feedback_regex_word_boundary_breaks_vietnamese]]. Thay bằng
   *    lookaround trên lớp `\p{L}`.
   *
   * Và đòi ÍT NHẤT HAI chữ hoa liền nhau: tên người Việt luôn từ hai
   * tiếng trở lên, còn một chữ hoa đơn lẻ hầu như luôn là chữ đầu câu
   * ("Tôi", "Sáng") — mồi mấy chữ đó vào thì vô ích mà lại chiếm chỗ của
   * tên thật.
   */
  const BO_QUA = new Set(['tôi', 'bạn', 'anh', 'em', 'chị', 'mình', 'nó', 'họ']);
  const ten = new Set<string>();
  for (const k of kienThuc) {
    for (const m of String(k.a || '').matchAll(
      /(?<!\p{L})\p{Lu}[\p{L}]*(?:\s+\p{Lu}[\p{L}]*){1,3}(?!\p{L})/gu,
    )) {
      const t = m[0].trim();
      if (t.length < 5 || t.length > 40) continue;
      if (BO_QUA.has(t.split(/\s+/)[0].toLowerCase())) continue;
      ten.add(t);
    }
    if (ten.size >= 12) break;
  }
  phan.push(...ten);

  phan.push(...(vi ? TU_DIEU_KHIEN_VI : TU_DIEU_KHIEN_EN));
  phan.push(...tuKhoaCongNghe());

  // Bỏ trùng, giữ nguyên thứ tự ưu tiên.
  const da = new Set<string>();
  const gon: string[] = [];
  for (const t of phan) {
    const k = t.toLowerCase();
    if (!t || da.has(k)) continue;
    da.add(k);
    gon.push(t);
  }

  // Cắt ở ranh giới TỪ, không cắt giữa chữ — nửa cái tên còn tệ hơn
  // không có tên.
  let ra = '';
  for (const t of gon) {
    const thu = ra ? `${ra}, ${t}` : t;
    if (thu.length > TRAN) break;
    ra = thu;
  }
  return ra;
}
