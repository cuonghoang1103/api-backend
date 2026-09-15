/**
 * ============================================================
 * HỎI AI ĐANG CHẠY TRÊN MÁY — và dùng nó làm LƯỚI ĐỠ
 * ============================================================
 *
 * ⚠️ AI trên máy KHÔNG thay thế bản trên mạng, và không được phép giả vờ là
 * nó. Đo thật 15/09/2026: model 4B trả lời đúng khái niệm và giải đúng toán,
 * nhưng đọc sai một dấu tiếng Việt ("biên" thành "biến") — đúng loại sai làm
 * hỏng cả bài toán mà người học không nhận ra.
 *
 * Nên quy tắc là: **có mạng thì luôn đi máy chủ**. Chỉ khi máy chủ không với
 * tới được mới rơi xuống đây, và câu trả lời phải được GẮN NHÃN để người dùng
 * biết mình đang đọc cái gì.
 */
import { trangThai } from './chay';

export interface LuotNoi {
  vaiTro: 'nguoi' | 'may';
  chu: string;
}

/**
 * Lời dặn cho model cục bộ.
 *
 * Ngắn có chủ đích. Mỗi chữ trong lời dặn là chữ phải nạp lại mỗi lượt, mà
 * trên máy chỉ có CPU thì nạp đề chạy 33,8 chữ/giây — một lời dặn 300 chữ là
 * 9 giây cộng vào MỌI câu hỏi.
 *
 * Câu "nói thẳng khi không biết" là câu quan trọng nhất: model nhỏ bịa trôi
 * chảy hơn là nó nhận dốt, và ở đây không có máy chủ nào đỡ phía sau.
 */
const LOI_DAN = 'Bạn là trợ lý học tập chạy ngay trên máy của người dùng, không có mạng. '
  + 'Trả lời bằng tiếng Việt, ngắn gọn, đi thẳng vào việc. '
  + 'Không biết thì nói thẳng là không biết — đừng đoán.';

export interface YeuCauHoi {
  chu: string;
  lichSu?: LuotNoi[] | undefined;
  /** Một hai câu bối cảnh (tên bài đang học chẳng hạn). Để rỗng nếu không có. */
  boiCanh?: string | undefined;
  signal?: AbortSignal | undefined;
}

/** AI trên máy có đang bật không. */
export function dangSan(): boolean {
  return trangThai() !== null;
}

/**
 * Hỏi AI trên máy. Trả `null` khi chưa bật hoặc hỏi không được.
 *
 * `null` chứ không phải ném: chỗ gọi là đường LÙI, và một đường lùi mà ném ra
 * lỗi thì nó biến sự cố mạng thành sự cố app.
 */
export async function hoiMay(yc: YeuCauHoi): Promise<string | null> {
  const dang = trangThai();
  if (!dang) return null;

  const tin: Array<{ role: string; content: string }> = [
    { role: 'system', content: yc.boiCanh ? `${LOI_DAN}\n\n${yc.boiCanh}` : LOI_DAN },
    ...(yc.lichSu ?? []).map((t) => ({
      role: t.vaiTro === 'nguoi' ? 'user' : 'assistant',
      content: t.chu,
    })),
    { role: 'user', content: yc.chu },
  ];

  try {
    const r = await fetch(`${dang.goc}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: tin, max_tokens: 900, temperature: 0.7 }),
      /* 3 phút. Máy chỉ có CPU gõ 8 chữ/giây, nên một câu trả lời dài thật sự
         mất hơn một phút — trần ngắn hơn sẽ cắt ngang đúng những máy yếu mà
         tính năng này sinh ra để phục vụ. */
      signal: yc.signal ?? AbortSignal.timeout(180_000),
    });
    if (!r.ok) return null;
    const j = await r.json() as { choices?: { message?: { content?: string } }[] };
    const chu = j?.choices?.[0]?.message?.content?.trim();
    return chu || null;
  } catch {
    return null;
  }
}

/**
 * Câu mở đầu gắn vào mọi trả lời của AI trên máy.
 *
 * ⚠️ Dòng này KHÔNG phải trang trí. Không có nó, một câu trả lời yếu hơn hẳn
 * sẽ trông y như câu của bản trên mạng, và người học mang nó đi thi. Nói rõ
 * nguồn là điều kiện để tính năng này được phép tồn tại.
 */
export const NHAN_MAY = '_Trả lời bởi AI trên máy bạn (không có mạng) — '
  + 'ngắn và có thể sót. Có mạng lại thì hỏi lại để có câu đầy đủ hơn._';

/** Gắn nhãn vào một câu trả lời của AI trên máy. */
export function ganNhan(chu: string): string {
  return `${NHAN_MAY}\n\n${chu}`;
}
