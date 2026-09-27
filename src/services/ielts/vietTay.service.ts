/**
 * Viết TAY (Apple Pencil / chuột) — AI nhìn ảnh nét chữ của người học.
 * ─────────────────────────────────────────────────────────────────────────
 * Hai việc, cùng một cửa `visionComplete` (đã có sẵn cầu dao ngân sách, trần
 * token/ngày và ghi log chi phí; model là `doc_ocr` = gpt-5.6-sol — model
 * DUY NHẤT của cổng thật sự nhìn được ảnh, các model khác nhận ảnh rồi bịa):
 *
 *  1. `xemChuViet` — tập viết kana/kanji: đọc ra chữ gì, có nhận ra không,
 *     sai nét/hình/tỉ lệ ở đâu, dễ nhầm với chữ nào, 1–2 mẹo. Kết thúc bằng
 *     dòng `ĐIỂM: NN` để web báo điểm vào tiến độ.
 *  2. `chamVietTay` — bài IELTS viết tay: chép NGUYÊN VĂN (giữ lỗi của người
 *     học — sửa hộ là xoá mất đúng thứ cần chấm) rồi chấm bằng CÙNG bộ tiêu
 *     chí với bài gõ phím (`IELTS_WRITING_RUBRIC`), qua model chữ thường.
 *
 * Ảnh KHÔNG được lưu: nhận base64 trong thân JSON, gửi thẳng cho cổng, xong.
 */
import { BadRequestError } from '../../middleware/errorHandler.js';
import { isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { visionComplete, type VisionImage } from '../docTools/vision.js';
import { IELTS_WRITING_RUBRIC } from './hoiAI.service.js';

/** ~1,5MB ảnh thật ≈ 2MB base64. */
const MAX_B64 = 2_100_000;
export const MAX_TRANG = 4;

/** Nhận base64 (có hoặc không tiền tố data:) → ảnh cho visionComplete. */
function anh(raw: unknown, ten: string): VisionImage {
  let s = String(raw ?? '').trim();
  const pre = /^data:(image\/(?:png|jpeg|webp));base64,/.exec(s);
  if (pre) s = s.slice(pre[0].length);
  s = s.replace(/\s+/g, '');
  if (!s) throw new BadRequestError(`Thiếu ảnh ${ten}`);
  if (s.length > MAX_B64) throw new BadRequestError(`Ảnh ${ten} quá lớn (tối đa ~1,5MB)`);
  if (!/^[A-Za-z0-9+/]+=*$/.test(s)) throw new BadRequestError(`Ảnh ${ten} không phải base64 hợp lệ`);
  // Nhận dạng theo byte đầu, không tin tiền tố người gửi khai.
  const mediaType = s.startsWith('/9j/') ? 'image/jpeg' : s.startsWith('iVBOR') ? 'image/png' : s.startsWith('UklGR') ? 'image/webp' : '';
  if (!mediaType) throw new BadRequestError(`Ảnh ${ten} phải là PNG, JPEG hoặc WebP`);
  return { data: s, mediaType };
}

/* ── 1. Tập viết chữ Nhật ─────────────────────────────────────────────── */

const XEM_CHU_SYSTEM = [
  'Bạn là cô giáo dạy viết chữ Nhật cho người Việt MỚI BẮT ĐẦU. Trả lời bằng TIẾNG VIỆT, ngắn, ấm áp nhưng thẳng.',
  'Ảnh là trang tập viết tay: mỗi HÀNG đánh số ở bên trái, gồm 3 ô vuông (có đường kẻ chia ô mờ). Người học viết cùng một chữ trong cả 3 ô của hàng (ô trống thì bỏ qua).',
  'Bạn được cho biết chữ MỤC TIÊU của từng hàng. Với mỗi hàng:',
  '- Nói bạn ĐỌC RA chữ gì (nếu khác mục tiêu thì nói rõ).',
  '- Nhận ra được hay không: ✅ rõ ràng · ⚠️ đọc được nhưng lệch · ❌ không nhận ra / thành chữ khác.',
  '- Lỗi cụ thể về nét (thiếu/thừa nét, nét nối sai, hướng nét, móc), hình dáng và TỈ LỆ (to/nhỏ, lệch khỏi tâm ô, khoảng cách các bộ phận).',
  '- Nếu có nguy cơ nhầm với chữ gần giống (シ/ツ, ソ/ン, ぬ/め, ね/れ/わ, る/ろ, さ/ち, 土/士, 未/末…) thì chỉ ra điểm phân biệt.',
  'Không đoán thứ tự nét từ ảnh tĩnh — chỉ nói về hình dạng nhìn thấy được.',
  'Định dạng markdown: mỗi hàng một gạch đầu dòng bắt đầu bằng `**N. chữ**`; cuối cùng mục `### Mẹo` với 1–2 mẹo cụ thể nhất.',
  'Dòng CUỐI CÙNG phải đúng dạng `ĐIỂM: NN` (0–100, chấm độ đúng + dễ đọc của cả trang, người mới viết được rõ ràng là 70+).',
].join('\n');

export async function xemChuViet(userId: number, b: { image?: unknown; chars?: unknown; lang?: unknown }) {
  const img = anh(b.image, 'chữ viết');
  const chars = (Array.isArray(b.chars) ? b.chars : [])
    .map((c) => String(c ?? '').trim().slice(0, 4))
    .filter(Boolean)
    .slice(0, 20);
  if (!chars.length) throw new BadRequestError('Thiếu danh sách chữ mục tiêu');

  const kq = await visionComplete({
    system: XEM_CHU_SYSTEM,
    userText: `Ngôn ngữ: ${b.lang === 'ja' ? 'tiếng Nhật' : String(b.lang ?? 'tiếng Nhật').slice(0, 20)}.\nChữ mục tiêu theo hàng:\n`
      + chars.map((c, i) => `Hàng ${i + 1}: ${c}`).join('\n'),
    images: [img],
    maxTokens: 1500,
    userId,
  });

  const text = kq.text.trim();
  const m = /ĐIỂM\s*[:：]\s*(\d{1,3})\s*$/i.exec(text) ?? /ĐIỂM\s*[:：]\s*(\d{1,3})/i.exec(text);
  const diem = m ? Math.max(0, Math.min(100, Number(m[1]))) : null;
  // Bỏ dòng điểm khỏi thân — web hiện điểm thành huy hiệu riêng.
  const ketQua = m ? text.replace(/\n?\s*\**ĐIỂM\s*[:：]\s*\d{1,3}\**\s*$/i, '').trim() : text;
  return { ketQua, diem };
}

/* ── 2. IELTS viết tay ────────────────────────────────────────────────── */

const CHEP_SYSTEM = [
  'You transcribe HANDWRITTEN English essays for an IELTS examiner.',
  'Copy the text EXACTLY as written: keep every spelling, grammar and punctuation mistake, keep capitalisation, keep paragraph breaks (blank line between paragraphs).',
  'Do NOT correct, improve, summarise or complete anything. Crossed-out words are omitted.',
  'If a word is truly illegible write [?] in its place. Pages are given in order — join them as one essay.',
  'Ignore the ruled lines and the red margin. Output ONLY the transcription, no comments.',
  'If there is no handwriting at all, output exactly: (EMPTY)',
].join('\n');

export async function chamVietTay(userId: number, b: { pages?: unknown; de?: unknown; task?: unknown }) {
  const raw = Array.isArray(b.pages) ? b.pages : [];
  if (!raw.length) throw new BadRequestError('Chưa có trang nào');
  if (raw.length > MAX_TRANG) throw new BadRequestError(`Tối đa ${MAX_TRANG} trang`);
  const images = raw.map((p, i) => anh(p, `trang ${i + 1}`));
  const de = String(b.de ?? '').slice(0, 1500);
  const task = String(b.task ?? 'Task 2').slice(0, 20);

  const kq = await visionComplete({
    system: CHEP_SYSTEM,
    userText: `IELTS Writing ${task}. ${images.length} page(s). Transcribe.`,
    images,
    maxTokens: 3000,
    userId,
  });
  const chep = kq.text.trim();
  if (!chep || /^\(EMPTY\)$/i.test(chep)) return { chep: '', ketQua: null, lyDo: 'trong' as const };
  if (chep.split(/\s+/).length < 20) return { chep, ketQua: null, lyDo: 'qua_ngan' as const };
  if (!isAiAvailable()) return { chep, ketQua: null, lyDo: 'ai_unavailable' as const };

  const cham = await llmComplete({
    step: 'generation',
    purpose: 'language_tutor',
    feature: 'chat',
    userId,
    maxTokens: 1400,
    system: IELTS_WRITING_RUBRIC
      + '\nBài này học viên VIẾT TAY, máy đã chép lại nguyên văn (giữ lỗi). `[?]` = chữ máy không đọc được — '
      + 'đừng trừ điểm vì [?]; nếu có nhiều [?], nhắc học viên viết rõ hơn (giám khảo thật không đọc được thì cũng không chấm được).',
    messages: [{
      role: 'user',
      content: `Đề (${task}): ${de || '(không có đề)'}\n\nBài của học viên (chép từ bản viết tay):\n${chep.slice(0, 8000)}`,
    }],
  });

  return { chep, ketQua: cham?.text?.trim() || null };
}
