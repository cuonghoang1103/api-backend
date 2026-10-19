/**
 * ============================================================
 * TỰ CỨU KHI CỔNG BÁO "VƯỢT CỬA SỔ NGỮ CẢNH" (đợt 8A, 19/10/2026)
 * ============================================================
 *
 * Người dùng thật gặp trên CLI với model rambo (opus-5): `HTTP 400 invalid_request_error: This request is longer than
 * the model's context window`. Bản prod trước `633b1305` không có model rambo trong `bangModel` ⇒ trần ký tự 600K vượt
 * cửa sổ 200K token. Ngoài việc sửa cửa sổ, lượt agent nay TỰ CỨU cho MỌI cổng: gặp lỗi vượt cửa sổ ⇒ máy chủ tóm tắt
 * lượt cũ (đúng cơ chế nén sớm — ghim đề bài, giữ ≥ 2 lượt cuối), cắt bớt kết quả tool to, rồi gửi lại ĐÚNG MỘT lần.
 * Vẫn lỗi ⇒ câu báo rõ kèm gợi ý `/compact` hoặc `/clear` (mã `NGU_CANH_QUA_DAI` — app KHÔNG tự thử lại).
 *
 * File này THUẦN (không I/O) — `turn.ts` điều phối.
 */
import type { AgentMessage } from './turn.js';

/**
 * Câu lỗi của cổng có phải "yêu cầu dài hơn cửa sổ ngữ cảnh" không. Gom các cách nói của Anthropic (chính hãng, rambo),
 * OpenAI/New API (modelapi) và vài biến thể hay gặp.
 */
export function laLoiVuotCuaSo(thong: string): boolean {
  const s = thong || '';
  /* 429 "too many tokens per minute" là GIỚI HẠN NHỊP, không phải cửa sổ — để đường "cổng bận" lo. */
  if (/HTTP 429|rate.?limit|per minute/i.test(s)) return false;
  return /longer than the model'?s context window|prompt is too long|maximum context length|context_length_exceeded|context length exceeded|exceeds? (?:the )?(?:model'?s )?(?:maximum )?context (?:window|length)|input is too long for|reduce the length of the messages/i
    .test(s);
}

/** Dòng mờ app hiện (song ngữ) — đi qua khung `cong` mã `DOI_CONG_TU_DONG` để app CŨ cũng in đúng một dòng mờ. */
export const CAU_TU_TOM_TAT = {
  vi: 'Hội thoại dài — CuongMini đã tự tóm tắt phần cũ để làm tiếp',
  en: 'Long conversation — CuongMini summarised the older part to keep going',
};

/** Câu báo khi đã tự tóm tắt mà cổng VẪN báo vượt cửa sổ. */
export const CAU_VAN_QUA_DAI = 'Hội thoại vẫn quá dài so với cửa sổ ngữ cảnh của model dù CuongMini đã tự tóm tắt phần cũ. '
  + 'Gõ /compact để tóm tắt chủ động (có thể kèm ghi chú điều cần giữ), hoặc /clear để bắt đầu phiên mới; '
  + 'nếu một kết quả tool quá lớn (file/log rất dài), hãy đọc hẹp theo dòng. '
  + '/ The conversation is still longer than the model context window even after CuongMini summarised it. '
  + 'Run /compact (optionally with a note on what to keep) or /clear to start fresh; read huge files/logs in smaller ranges.';

/**
 * Cắt bớt kết quả tool TO. Không bao giờ xoá tin `role:'tool'` (mỗi `tool_call` phải có đúng một trả lời) — chỉ rút
 * `content`, gỡ ảnh ở kết quả cũ. `giuCuoi` kết quả tool gần nhất được trần rộng (`tranMoi`), phần còn lại `tranCu`.
 * Giữ ĐẦU + ĐUÔI (lỗi thường ở cuối log, khai báo ở đầu file).
 */
export function catKetQuaToolTo(
  messages: readonly AgentMessage[],
  o: { giuCuoi?: number; tranCu?: number; tranMoi?: number } = {},
): { messages: AgentMessage[]; soDaCat: number; kyTuDaCat: number } {
  const giuCuoi = o.giuCuoi ?? 4;
  const tranCu = o.tranCu ?? 4_000;
  const tranMoi = o.tranMoi ?? 20_000;
  const viTriTool: number[] = [];
  messages.forEach((m, i) => { if (m.role === 'tool') viTriTool.push(i); });
  const moi = new Set(viTriTool.slice(-giuCuoi));
  let soDaCat = 0;
  let kyTuDaCat = 0;
  const ra = messages.map((m, i): AgentMessage => {
    if (m.role !== 'tool') return m;
    const tran = moi.has(i) ? tranMoi : tranCu;
    const coAnhCu = !moi.has(i) && Array.isArray(m.anh) && m.anh.length > 0;
    if (m.content.length <= tran && !coAnhCu) return m;
    soDaCat++;
    let content = m.content;
    if (content.length > tran) {
      const dau = Math.floor(tran * 0.7);
      const duoi = tran - dau;
      kyTuDaCat += content.length - tran;
      content = `${content.slice(0, dau)}\n[… đã cắt ${(m.content.length - tran).toLocaleString('vi-VN')} ký tự giữa vì hội thoại vượt cửa sổ ngữ cảnh — đọc hẹp theo dòng nếu cần …]\n${content.slice(-duoi)}`;
    }
    if (coAnhCu) {
      const { anh: _bo, ...conLai } = m;
      void _bo;
      return { ...conLai, content: `${content}\n[… ảnh đã được gỡ để tiết kiệm ngữ cảnh.]` };
    }
    return { ...m, content };
  });
  return { messages: ra, soDaCat, kyTuDaCat };
}
