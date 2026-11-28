/**
 * "Nhờ CuongMini xem câu của mình" — chấm MỘT câu dịch của lộ trình 1000 câu nền (`/language/en/cau-nen`,
 * 28/11/2026). Web đã tự chấm khớp câu mẫu (sau chuẩn hoá); chỉ khi KHÔNG khớp người học mới bấm hỏi,
 * nên mỗi lượt là một câu ngắn ⇒ trần token nhỏ. Giới hạn dùng như mọi việc AI của khoá học: đi
 * `llmComplete` (purpose `language_tutor`) ⇒ trần token/ngày của người dùng + trần tiền chung (budget.ts).
 *
 * Trả JSON {dung, nhanXet, cauSua}: `dung` = câu người học ĐÚNG ngữ pháp, tự nhiên và cùng nghĩa (khác câu
 * mẫu vẫn được) ⇒ web tính là đúng.
 */
import { isAiAvailable, llmComplete } from '../interview/llm/index.js';
import { BadRequestError } from '../../middleware/errorHandler.js';

export type KetQuaChamDich = { dung: boolean; nhanXet: string; cauSua?: string };

const HE_THONG = [
  'Bạn là CuongMini, gia sư tiếng Anh cho người Việt mất gốc (trình độ A0–A2). Chấm MỘT câu dịch.',
  'Tiêu chí ĐÚNG: câu đúng ngữ pháp, tự nhiên với người Mỹ, và giữ đúng nghĩa câu gốc. Khác câu mẫu vẫn ĐÚNG nếu đạt cả ba. Lỗi chính tả làm đổi từ (work/works, a/an, thiếu mạo từ, sai thì) là SAI. Chỉ sai hoa/thường hay thiếu dấu chấm cuối thì vẫn ĐÚNG.',
  'Chiều Anh → Việt: người học gõ nghĩa tiếng Việt; ĐÚNG khi hiểu đúng ý chính của câu Anh (không cần trùng chữ, không bắt dấu thanh hoàn hảo).',
  'nhanXet: tiếng Việt, 1–3 câu ngắn, nói thẳng sai ở đâu và vì sao (nhất là lỗi dịch từng chữ theo trật tự tiếng Việt); đúng thì khen ngắn + nói điểm khác với câu mẫu nếu có. Dùng **đậm** cho từ cần chú ý.',
  'cauSua: câu đúng gần nhất với câu của người học (chiều Việt → Anh); bỏ trống nếu câu đã đúng hoặc chiều Anh → Việt.',
  'CHỈ trả về một object JSON, không markdown, không chữ nào ngoài JSON: {"dung": true|false, "nhanXet": "...", "cauSua": "..."}',
].join('\n');

/** Đọc JSON trong câu trả lời của model (có thể bọc ```json … ``` hoặc dính chữ thừa). */
export function docKetQua(text: string): KetQuaChamDich | null {
  const t = (text ?? '').trim();
  const a = t.indexOf('{');
  const b = t.lastIndexOf('}');
  if (a < 0 || b <= a) return null;
  try {
    const o = JSON.parse(t.slice(a, b + 1)) as { dung?: unknown; nhanXet?: unknown; cauSua?: unknown };
    if (typeof o.dung !== 'boolean') return null;
    const nhanXet = String(o.nhanXet ?? '').trim().slice(0, 800);
    const cauSua = typeof o.cauSua === 'string' && o.cauSua.trim() ? o.cauSua.trim().slice(0, 300) : undefined;
    return { dung: o.dung, nhanXet: nhanXet || (o.dung ? 'Câu của bạn đúng.' : 'Câu này chưa đúng.'), ...(cauSua ? { cauSua } : {}) };
  } catch {
    return null;
  }
}

export async function chamDich(
  userId: number,
  b: { huong?: unknown; vi?: unknown; mau?: unknown; bai?: unknown; khung?: unknown },
): Promise<{ ketQua: KetQuaChamDich | null; lyDo?: 'ai_unavailable' | 'khong_doc_duoc' }> {
  const huong = b.huong === 'en-vi' ? 'en-vi' : 'vi-en';
  const vi = String(b.vi ?? '').trim().slice(0, 300);
  const mau = (Array.isArray(b.mau) ? b.mau : []).map((x) => String(x ?? '').trim().slice(0, 300)).filter(Boolean).slice(0, 6);
  const bai = String(b.bai ?? '').trim().slice(0, 400);
  const khung = String(b.khung ?? '').trim().slice(0, 120);
  if (!vi || !mau.length) throw new BadRequestError('Thiếu câu gốc hoặc câu mẫu');
  if (!bai) throw new BadRequestError('Bạn chưa viết câu trả lời');

  if (!isAiAvailable()) return { ketQua: null, lyDo: 'ai_unavailable' };

  const de = huong === 'vi-en'
    ? `Chiều: Việt → Anh.\nCâu tiếng Việt: "${vi}"\nCâu mẫu (đúng): ${mau.map((m) => `"${m}"`).join(' | ')}${khung ? `\nKhung câu đang học: ${khung}` : ''}\nCâu người học viết: "${bai}"`
    : `Chiều: Anh → Việt.\nCâu tiếng Anh: "${mau[0]}"\nNghĩa mẫu: "${vi}"\nNghĩa người học gõ: "${bai}"`;

  const kq = await llmComplete({
    step: 'generation',
    purpose: 'language_tutor',
    feature: 'chat',
    userId,
    maxTokens: 400,
    system: HE_THONG,
    messages: [{ role: 'user', content: de }],
  });
  const ketQua = docKetQua(kq?.text ?? '');
  return ketQua ? { ketQua } : { ketQua: null, lyDo: 'khong_doc_duoc' };
}
