/**
 * ============================================================
 * ĐẶT TÊN VIỆC — một dòng ngắn thay cho câu hỏi bị cắt cụt
 * ============================================================
 *
 * Người dùng đối chiếu với Claude Code 19/08/2026: bên đó tên việc là
 * "iOS app AppStore approval strategy", "Trang lập trình robot AI ESP32" —
 * đọc lướt là biết việc gì. Bên mình là câu hỏi đầu bị cắt ở 40 ký tự:
 * "Bạn xem dự án này của tôi đã có mobile app …", và ba việc khác nhau cùng
 * bắt đầu bằng "bạn kiểm tra dự án này của tôi xem…" thì không phân biệt nổi.
 *
 * ─── VÌ SAO CHẠY Ở MÁY CHỦ, KHÔNG Ở APP ───
 * App không có khoá cổng. Và tên việc nên dùng model RẺ — nó là một câu sáu
 * chữ, trả tiền cho model mạnh ở đây là lãng phí thuần.
 */
import { chatUrlOf, endpointFor, modelFor } from '../llm/gateway.js';

/** Trần chữ đưa vào. Câu hỏi dài hơn cũng không giúp đặt tên hay hơn. */
const TRAN_VAO = 1200;

const NHAC = `Đặt tên cho một việc lập trình, dựa vào câu hỏi của người dùng.

LUẬT:
- ĐÚNG một dòng, 3–7 từ, KHÔNG dấu chấm cuối.
- Nói việc đó LÀM GÌ, không chép lại câu hỏi.
- Giữ nguyên tên riêng kỹ thuật (React, ESP32, AppStore, PostgreSQL…).
- Tiếng Việt, trừ khi câu hỏi hoàn toàn bằng tiếng Anh.
- KHÔNG mở đầu bằng "Kiểm tra", "Xem", "Hỏi về" — nói thẳng chủ đề.
- CHỈ trả về cái tên. Không giải thích, không dấu ngoặc kép.

Ví dụ:
"bạn xem dự án này có mobile app chưa, tôi muốn build app iOS" → App iOS cho dự án hiện tại
"sửa giúp tôi lỗi CORS trả 500 thay vì 403" → Trả 403 thay vì 500 khi CORS từ chối
"kiểm tra xem con robot esp32 của tôi kết nối wifi được không" → Robot ESP32 kết nối WiFi`;

/**
 * Sinh tên việc. Hỏng thì trả `null` — chỗ gọi giữ tên cũ.
 *
 * KHÔNG BAO GIỜ ném: đặt tên là việc trang trí, và một lỗi ở đây không được
 * phép làm hỏng việc lưu phiên.
 */
export async function datTenViec(cauHoi: string): Promise<string | null> {
  const chu = cauHoi.trim().slice(0, TRAN_VAO);
  if (chu.length < 8) return null;

  try {
    const ep = endpointFor('cv_parse');           // việc máy đọc ⇒ model rẻ
    const res = await fetch(chatUrlOf(ep), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ep.key ?? ''}` },
      signal: AbortSignal.timeout(15_000),
      body: JSON.stringify({
        model: modelFor('cv_parse', ep),
        max_tokens: 40,
        messages: [{ role: 'system', content: NHAC }, { role: 'user', content: chu }],
      }),
    });
    if (!res.ok) return null;
    const j = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    return donDep(j.choices?.[0]?.message?.content ?? '');
  } catch {
    return null;
  }
}

/**
 * Dọn câu model trả về.
 *
 * Model hay kèm dấu ngoặc kép, dấu chấm cuối, hoặc cả một câu dẫn ("Tên việc:
 * …") dù đã dặn. Lọc ở đây thay vì tin vào lời dặn — lời dặn đúng 90% lần, và
 * 10% còn lại hiện ra ngay trên giao diện.
 */
export function donDep(tho: string): string | null {
  let t = tho.trim().split('\n')[0]?.trim() ?? '';
  t = t.replace(/^(tên việc|tiêu đề|title)\s*[:：]\s*/i, '');
  t = t.replace(/^["'“”«]+|["'“”».]+$/g, '').trim();
  if (!t || t.length < 3) return null;
  // Model đôi khi trả cả đoạn. Dài quá thì nó không còn là "tên" nữa.
  if (t.length > 60) return null;
  return t;
}
