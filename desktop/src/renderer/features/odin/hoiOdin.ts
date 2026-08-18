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
      /* Nói ra thì phải NGẮN. Câu trả lời dạng chữ đọc nhanh bằng mắt, còn đọc
       * thành tiếng thì ba đoạn văn là gần một phút — không ai đứng nghe hết,
       * mà cũng không tua lại được. */
      systemHint: ngonNgu === 'en'
        ? 'You are Odin, a desktop voice assistant. Answer in English, at most 3 short sentences, plain speech — no markdown, no lists, no code blocks.'
        : 'Bạn là Odin, trợ lý giọng nói trên máy tính. Trả lời bằng tiếng Việt, tối đa 3 câu ngắn, lời nói thường — không markdown, không gạch đầu dòng, không khối mã.',
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
