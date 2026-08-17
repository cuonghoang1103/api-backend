/**
 * ============================================================
 * CẮT LƯỢT CŨ — thay vì từ chối cả hội thoại
 * ============================================================
 *
 * Trước file này, hội thoại chạm trần (600k ký tự hoặc 200 tin nhắn) thì máy
 * chủ NÉM: `CONVERSATION_TOO_LARGE`, "hãy bắt đầu phiên mới". Người dùng đang
 * làm dở một việc 40 bước bỗng bị chặn hẳn và mất luôn mạch — thứ họ đã trả
 * tiền để dựng lên.
 *
 * ─── VÌ SAO KHÔNG CHỈ DỰA VÀO NÉN NGỮ CẢNH ───
 * `compact.ts` rút gọn KẾT QUẢ TOOL, và nó gánh phần lớn. Nhưng nó cố ý không
 * đụng vào câu của người dùng và câu của model — đó là mạch suy nghĩ. Một hội
 * thoại rất dài với nhiều lượt hỏi đáp vẫn có thể vượt trần sau khi nén, và
 * lúc đó chỉ còn một cách: BỎ những lượt cũ nhất.
 *
 * ─── CẮT THEO LƯỢT, KHÔNG CẮT THEO TIN NHẮN ───
 * ⛔ Giao thức gọi tool đòi mỗi `tool_calls` phải có đúng một tin nhắn `tool`
 * mang đúng `tool_call_id`. Bỏ lẻ một tin nhắn là làm mồ côi cái còn lại, và
 * cổng từ chối CẢ LƯỢT với một lỗi không nói rõ thiếu ở đâu.
 *
 * Nên đơn vị cắt là LƯỢT: một tin nhắn `user` cùng mọi thứ theo sau nó cho tới
 * tin nhắn `user` kế tiếp. Cắt trọn lượt thì mọi cặp gọi/trả đều đi cùng nhau.
 */
import type { AgentMessage } from './turn.js';

/** Luôn giữ lại ít nhất ngần này lượt gần nhất — cắt sâu hơn là agent quên việc đang làm. */
const GIU_IT_NHAT = 2;

export interface KetQuaCat {
  messages: AgentMessage[];
  /** Số lượt đã bỏ. 0 = không phải cắt gì. */
  soLuotDaBo: number;
}

function doDai(m: AgentMessage): number {
  // Ảnh KHÔNG tính: một tấm 2MB là ~2,7 triệu ký tự base64, tự nó vượt mọi
  // trần. Ảnh có đường quản lý riêng (nén ngữ cảnh gỡ ảnh cũ).
  if (typeof m.content === 'string') return m.content.length;
  if (Array.isArray(m.content)) {
    return m.content.reduce((n, k) => n + (k.type === 'text' ? k.text.length : 0), 0);
  }
  return 0;
}

export function tongKyTu(messages: readonly AgentMessage[]): number {
  return messages.reduce((n, m) => n + doDai(m), 0);
}

/** Vị trí mở đầu của từng lượt (mỗi tin nhắn `user` là một mốc). */
function mocLuot(messages: readonly AgentMessage[]): number[] {
  const ra: number[] = [];
  messages.forEach((m, i) => { if (m.role === 'user') ra.push(i); });
  return ra;
}

/**
 * Bỏ bớt lượt cũ cho tới khi lọt trần.
 *
 * Trả về hội thoại mới; KHÔNG sửa mảng gốc — bản gốc vẫn là thứ app giữ để
 * người dùng cuộn lại đọc. Đây là bản chỉ dành cho cổng, cùng nguyên tắc với
 * `nenNguCanh`.
 */
export function catLuotCu(
  messages: readonly AgentMessage[],
  tranChu: number,
  tranTin: number,
): KetQuaCat {
  const moc = mocLuot(messages);
  // Ít hơn `GIU_IT_NHAT` lượt thì không cắt được gì mà vẫn giữ được mạch. Trả
  // nguyên và để tầng trên quyết định — cắt tiếp là xoá đúng câu hỏi hiện tại.
  if (moc.length <= GIU_IT_NHAT) return { messages: [...messages], soLuotDaBo: 0 };

  let boTu = 0;
  for (;;) {
    const conLai = messages.slice(moc[boTu]!);
    if (tongKyTu(conLai) <= tranChu && conLai.length <= tranTin) break;
    if (moc.length - boTu <= GIU_IT_NHAT) break;
    boTu++;
  }

  return boTu === 0
    ? { messages: [...messages], soLuotDaBo: 0 }
    : { messages: messages.slice(moc[boTu]!), soLuotDaBo: boTu };
}

/**
 * Câu nhắc chèn vào đầu hội thoại đã bị cắt.
 *
 * Không có nó thì model tưởng cuộc trò chuyện bắt đầu từ đúng chỗ này, và nó sẽ
 * trả lời như chưa từng biết gì trước đó — trong khi người dùng vẫn nhìn thấy
 * phần cũ trên màn hình và tưởng agent còn nhớ. Nói thẳng ra thì nó biết mình
 * mất gì và biết hỏi lại.
 */
export function loiNhacDaCat(soLuot: number): AgentMessage {
  return {
    role: 'user',
    content:
      `[Hệ thống: ${soLuot} lượt hỏi đáp cũ nhất đã được bỏ khỏi ngữ cảnh vì hội thoại quá dài. `
      + 'Người dùng VẪN nhìn thấy chúng trên màn hình, còn bạn thì không. '
      + 'Nếu câu hỏi hiện tại nhắc tới thứ gì bạn không thấy, hãy nói thẳng là phần đó đã ngoài tầm nhớ '
      + 'và hỏi lại — đừng đoán.]',
  };
}
