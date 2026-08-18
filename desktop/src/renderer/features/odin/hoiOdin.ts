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

/**
 * Cắt câu ĐẦU TIÊN ra khỏi phần chữ đang chảy về.
 *
 * Trả `null` khi chưa đủ một câu. Ngưỡng 12 ký tự để một câu cụt kiểu "Ừ."
 * không trở thành một lời gọi máy đọc riêng — đọc "Ừ" rồi ngắt, rồi đọc tiếp
 * nghe rời rạc hơn hẳn đọc liền.
 */
export function catCauDau(chu: string): string | null {
  const m = /[.!?…]["')\]]?\s/.exec(chu);
  if (!m) return null;
  // Cắt hết CẢ khớp (gồm dấu đóng ngoặc nếu có) rồi mới trim — cắt ở
  // `m.index + 1` là bỏ lại dấu ngoặc đóng cho câu sau, và máy đọc mở đầu câu
  // kế bằng một dấu nháy lạc lõng.
  const cau = chu.slice(0, m.index + m[0].length).trim();
  return cau.length >= 12 ? cau : null;
}

/**
 * ============================================================
 * PHIÊN TRÒ CHUYỆN BẰNG GIỌNG
 * ============================================================
 *
 * ⚠️ TRƯỚC 19/08/2026 CHỖ NÀY KHÔNG GỬI `sessionId`, VÀ MÁY CHỦ CHỈ LƯU KHI
 * CÓ NÓ (`if (sessionId)` trong `ai.service.ts`). Nghĩa là mọi câu hỏi bằng
 * giọng trong app đều bốc hơi ngay sau khi đọc xong: bong bóng cắt ở 220 ký
 * tự, phần còn lại KHÔNG CÒN Ở ĐÂU CẢ. Người dùng bấm vào bong bóng để "đọc
 * đầy đủ" thì chỉ có thể rơi vào một trang chat trống.
 *
 * Cửa sổ robot NỔI đã làm đúng từ trước (`main/ipc/robot.ts` giữ `phienNoi`),
 * nên hai đường đi cùng một tính năng lại cho hai kết quả khác nhau — đúng
 * loại chênh lệch không ai để ý cho tới lúc có người bấm thử.
 *
 * Giữ trong bộ nhớ, KHÔNG xuống đĩa: mở app một lần là một cuộc trò chuyện.
 */
let phienNoi: string | null = null;

/** Mã cuộc trò chuyện bằng giọng đang mở, để mở đúng nó trong trang /chat. */
export function phienNoiHienTai(): string | null {
  return phienNoi;
}

/** Quên phiên hiện tại — dùng khi đăng xuất hoặc người dùng muốn bắt đầu lại. */
export function quenPhienNoi(): void {
  phienNoi = null;
}

/**
 * Lấy phiên, tạo nếu chưa có.
 *
 * Hỏng thì trả `null` và ĐI TIẾP. Người dùng đang chờ NGHE câu trả lời, không
 * đang xem lịch sử — mất lịch sử còn hơn mất câu trả lời.
 */
async function baoDamPhien(api: Api): Promise<string | null> {
  if (phienNoi) return phienNoi;
  try {
    const r = await fetch(`${api.baseUrlForForms()}/api/v1/ai/chat/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...api.authHeaders() },
      credentials: 'omit',
      body: JSON.stringify({ title: 'Trò chuyện bằng giọng nói' }),
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { data?: { sessionId?: string } };
    phienNoi = j?.data?.sessionId ?? null;
  } catch {
    phienNoi = null;
  }
  return phienNoi;
}

export async function hoiOdin(
  api: Api,
  cauHoi: string,
  ngonNgu: 'vi' | 'en',
  tinHieu?: AbortSignal,
  /**
   * Gọi MỘT LẦN ngay khi câu đầu tiên đã đủ, trong lúc phần còn lại vẫn đang
   * chảy về.
   *
   * ⚠️ ĐÂY LÀ TOÀN BỘ LÝ DO GIỌNG RA NHANH ĐƯỢC. Trước đó ba việc chạy nối
   * đuôi: chờ trọn câu trả lời → gọi máy đọc → phát. Người dùng thấy chữ ở
   * cuối việc thứ nhất và nghe tiếng ở cuối việc thứ ba. Cho máy đọc chạy câu
   * đầu ngay khi có nó thì việc thứ hai nằm GỌN TRONG việc thứ nhất, và tiếng
   * gần như ra cùng lúc với chữ.
   */
  cauDauXong?: (cau: string) => void,
): Promise<string> {
  const phien = await baoDamPhien(api);
  const res = await fetch(`${api.baseUrlForForms()}/api/v1/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...api.authHeaders() },
    credentials: 'omit',
    ...(tinHieu ? { signal: tinHieu } : {}),
    body: JSON.stringify({
      message: cauHoi,
      /* Máy chủ CHỈ lưu lượt chat khi có `sessionId`. Thiếu nó thì câu trả
         lời chỉ tồn tại trong bong bóng đã bị cắt ngắn. */
      ...(phien ? { sessionId: phien } : {}),
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
  let daBaoCauDau = false;

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
          const o = JSON.parse(than) as {
            type?: string; content?: string; delta?: string; text?: string; error?: string;
          };
          if (o.error) throw new Error(o.error);
          /*
           * ⚠️ PHẢI KIỂM `type`. Bản trước cộng thẳng `o.text` bất kể khung
           * loại gì — nên bất cứ khung MỚI nào máy chủ thêm vào mà có trường
           * `text` đều bị robot ĐỌC THÀNH TIẾNG như một phần câu trả lời.
           * Ngày thêm khung "đang tìm web" là ngày robot đọc luôn cả dòng đó.
           */
          if (o.type && o.type !== 'chunk') continue;
          tra += o.content ?? o.delta ?? o.text ?? '';
          if (cauDauXong && !daBaoCauDau) {
            const cau = catCauDau(tra);
            if (cau) { daBaoCauDau = true; cauDauXong(cau); }
          }
        } catch {
          /* khung không phải JSON (ví dụ `connected`) — bỏ qua, không phải lỗi */
        }
      }
    }
  }
  return tra.trim();
}
