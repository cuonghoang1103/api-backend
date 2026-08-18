/**
 * Hỏi trợ lý một câu, nhận về MỘT câu trả lời đã gom đủ.
 *
 * `POST /api/v1/ai/chat` trả theo kiểu SSE (từng mẩu chữ một). Trang /chat cần
 * kiểu đó để chữ hiện dần; robot Odin thì KHÔNG — nó phải có trọn câu rồi mới
 * đưa cho máy đọc, vì đọc từng mẩu sẽ thành đọc ngắt quãng từng chữ một.
 *
 * ⚠️ SSE có thể chia mẩu ở GIỮA một khung dữ liệu. Phải giữ phần đuôi dang dở
 * lại cho lần đọc sau — ai `split('\n\n')` rồi vứt phần cuối sẽ mất chữ một
 * cách ngẫu nhiên, và lỗi đó chỉ hiện ra với câu trả lời dài.
 */
interface Api {
  baseUrlForForms(): string;
  authHeaders(): Record<string, string>;
}

export async function hoiOdin(
  api: Api,
  cauHoi: string,
  ngonNgu: 'vi' | 'en',
  tinHieu?: AbortSignal,
): Promise<string> {
  const res = await fetch(`${api.baseUrlForForms()}/api/v1/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...api.authHeaders() },
    credentials: 'omit',
    ...(tinHieu ? { signal: tinHieu } : {}),
    body: JSON.stringify({
      message: cauHoi,
      /*
       * ⚠️ TRƯỚC 18/08/2026 CHỖ NÀY GỬI `systemHint` — MỘT TRƯỜNG MÁY CHỦ
       * KHÔNG HỀ ĐỌC. Nó chứa nguyên câu "Answer in English, at most 3 short
       * sentences, no markdown", trông rất thuyết phục trong mã, và rơi thẳng
       * vào hư không. Triệu chứng: chọn English thì GIỌNG đổi (app tự chọn)
       * còn CHỮ vẫn ra tiếng Việt — vì prompt mặc định của máy chủ dặn "người
       * dùng viết tiếng nào thì trả lời tiếng đó".
       *
       * Bài học: gửi một trường lên máy chủ không có nghĩa là máy chủ dùng nó.
       * Hai trường dưới đây là hai trường máy chủ THẬT SỰ đọc (xem
       * `ChatContext` trong ai.service.ts).
       */

      /* Khoá ngôn ngữ trả lời. Máy chủ đối chiếu danh sách trắng rồi THAY câu
       * quy định ngôn ngữ trong prompt, chứ không nối thêm — nối thêm là đặt
       * hai luật ngược nhau. */
      ngonNgu,

      /* Câu trả lời sẽ được ĐỌC THÀNH TIẾNG. Cờ này bật `VOICE_RULES` ở máy
       * chủ: 2–4 câu, không markdown, không gạch đầu dòng, số viết thành chữ.
       * Thiếu nó thì máy đọc phải đọc cả dấu sao của chữ in đậm. */
      voice: true,
    }),
  });
  if (!res.ok || !res.body) {
    const than = await res.json().catch(() => null) as { message?: string } | null;
    throw new Error(than?.message ?? `Trợ lý không trả lời (${res.status})`);
  }

  const doc = res.body.getReader();
  const giaiMa = new TextDecoder();
  let dem = '';
  let tra = '';

  for (;;) {
    const { done, value } = await doc.read();
    if (done) break;
    dem += giaiMa.decode(value, { stream: true });

    const khung = dem.split('\n\n');
    dem = khung.pop() ?? '';        // giữ lại phần dang dở
    for (const k of khung) {
      for (const dong of k.split('\n')) {
        if (!dong.startsWith('data:')) continue;
        const than = dong.slice(5).trim();
        if (!than || than === '[DONE]') continue;
        try {
          const o = JSON.parse(than) as { content?: string; delta?: string; text?: string; error?: string };
          if (o.error) throw new Error(o.error);
          tra += o.content ?? o.delta ?? o.text ?? '';
        } catch {
          /* khung không phải JSON (ví dụ `connected`) — bỏ qua, không phải lỗi */
        }
      }
    }
  }
  return tra.trim();
}
