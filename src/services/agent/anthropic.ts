/**
 * ============================================================
 * DỊCH GIAO THỨC: OpenAI ↔ Anthropic
 * ============================================================
 *
 * Vì sao cần: cổng riêng của người dùng (`rambo.ai.vn`) CÓ mở tuyến
 * `/v1/chat/completions`, và nó chạy đúng — cho tới khi hội thoại có một lượt
 * gọi tool HOÀN CHỈNH. Đo thật 19/08/2026:
 *
 *   chỉ `user`                                   → 200
 *   `system` trong mảng messages                 → 200
 *   hai `assistant` liền nhau (prefill)          → 200
 *   `max_tokens: 16000`                          → 200
 *   assistant.tool_calls + role:'tool'           → 400 api_error
 *   ("Error from Anthropic Server please try again later or create a new
 *     conversation." — nghe như sự cố tạm thời, thật ra là vĩnh viễn)
 *
 * Bộ chuyển OpenAI→Anthropic của họ hỏng ở đúng chỗ agent luôn đi qua. Nhưng
 * tuyến Anthropic GỐC (`/v1/messages`) thì chạy trọn: đo 3 vòng liên tiếp —
 * model đòi tool, ta trả `tool_result`, model đọc và trả lời đúng, rồi hỏi
 * tiếp vẫn đúng. Nên ta tự dịch, thay vì nhờ họ dịch.
 *
 * ─── HAI LUẬT CỦA ANTHROPIC MÀ OPENAI KHÔNG CÓ ───
 *  1. `system` là THAM SỐ RIÊNG, không phải một tin nhắn trong mảng.
 *  2. Vai phải LUÂN PHIÊN user/assistant. Nhiều kết quả tool của cùng một
 *     lượt phải gộp vào MỘT tin nhắn `user`, không phải mỗi cái một tin.
 *     Đây là chỗ dễ sai nhất, và sai thì cổng trả 400 không nói rõ vì sao.
 */

/** Khối nội dung của Anthropic. */
type KhoiAnthropic =
  | { type: 'text'; text: string }
  | { type: 'image'; source: { type: 'base64'; media_type: string; data: string } }
  | { type: 'tool_use'; id: string; name: string; input: unknown }
  | { type: 'tool_result'; tool_use_id: string; content: string };

export interface TinAnthropic {
  role: 'user' | 'assistant';
  content: string | KhoiAnthropic[];
}

interface ToolOpenAI {
  type: 'function';
  function: { name: string; description?: string; parameters?: unknown };
}

export interface ToolAnthropic {
  name: string;
  description?: string;
  input_schema: unknown;
}

/** Tool OpenAI → Anthropic. Chỉ đổi tên trường, không đổi nội dung schema. */
export function toolSangAnthropic(tools: ToolOpenAI[]): ToolAnthropic[] {
  return tools.map((t) => ({
    name: t.function.name,
    ...(t.function.description ? { description: t.function.description } : {}),
    input_schema: t.function.parameters ?? { type: 'object', properties: {} },
  }));
}

/** Đọc `arguments` của tool — chuỗi JSON. Hỏng thì trả object rỗng chứ không ném. */
function docArgs(s: string): unknown {
  try {
    const j = JSON.parse(s || '{}');
    return j && typeof j === 'object' ? j : {};
  } catch {
    return {};
  }
}

type TinVao =
  | { role: 'system'; content: string }
  | { role: 'user'; content: unknown }
  | { role: 'assistant'; content: string | null; tool_calls?: Array<{ id: string; function: { name: string; arguments: string } }> }
  | { role: 'tool'; tool_call_id: string; content: string; anh?: Array<{ media_type: string; data: string }> };

/**
 * Hội thoại kiểu OpenAI → { system, messages } kiểu Anthropic.
 *
 * ⚠️ GỘP các tin cùng vai đứng liền nhau. Anthropic đòi luân phiên, và agent
 * sinh ra chuỗi `tool, tool, tool` rất thường xuyên (model gọi ba tool một
 * lượt). Không gộp là 400.
 */
/**
 * `image_url` (hình dạng OpenAI) → khối `image` của Anthropic.
 *
 * ⚠️⚠️ ĐÂY LÀ MỐI NỐI ĐÃ TỪNG ĐỨT CÂM, và nó làm hỏng ẢNH DÁN Ở AI CODE trên
 * mọi hệ điều hành. Cả app desktop lẫn `turn.ts` đều nói giao thức OpenAI, nên
 * ảnh đi tới đây dưới dạng `{type:'image_url', image_url:{url:'data:…'}}`.
 * Nhưng AI Code chạy qua cổng riêng (rambo) = tuyến ANTHROPIC, và bản cũ ở đây
 * chỉ nhận `{type:'image'}`. Khối ảnh bị bỏ IM LẶNG — không lỗi, không cảnh
 * báo — chữ vẫn qua, và model trả lời "tôi không nhận được ảnh nào", đúng như
 * nó thấy. Không có gì để lần, vì cả hai đầu đều tự thấy mình đúng.
 *
 * Phép kiểm cũ CÓ kiểm ảnh, và vẫn xanh: nó dựng sẵn khối `image` — hình dạng
 * mà KHÔNG chỗ nào trong đường thật sinh ra. Xem
 * [[feedback_phep_kiem_dat_vi_ly_do_sai]].
 *
 * CHỈ nhận data URI. Chuyển tiếp một `image_url` trỏ ra Internet là bắt cổng
 * đi tải thay mặt người dùng, mà chẳng ai duyệt lời gọi đó — cùng lý do
 * `sanitizeIncoming` trong `turn.ts` đã lọc.
 */
function anhTuImageUrl(c: Record<string, any>): KhoiAnthropic | null {
  const url: unknown = c.image_url?.url;
  if (typeof url !== 'string') return null;
  /* Cắt ở dấu phẩy ĐẦU TIÊN thay vì cho regex chạy trên cả chuỗi: thân ảnh
     lên tới 5,6MB, còn base64 thì không chứa dấu phẩy — phần đầu là đủ. */
  const phay = url.indexOf(',');
  if (phay < 0) return null;
  const dau = /^data:(image\/(?:png|jpeg|webp|gif));base64$/.exec(url.slice(0, phay));
  const than = url.slice(phay + 1);
  if (!dau || !than) return null;
  return { type: 'image', source: { type: 'base64', media_type: dau[1]!, data: than } };
}

export function sangAnthropic(messages: TinVao[]): { system: string; messages: TinAnthropic[] } {
  const heThong: string[] = [];
  const ra: TinAnthropic[] = [];

  const them = (role: 'user' | 'assistant', khoi: KhoiAnthropic[]): void => {
    if (khoi.length === 0) return;
    const cuoi = ra[ra.length - 1];
    if (cuoi && cuoi.role === role) {
      // Cùng vai với tin trước ⇒ nối vào, đừng đẩy tin mới.
      const cu = Array.isArray(cuoi.content)
        ? cuoi.content
        : [{ type: 'text' as const, text: cuoi.content }];
      cuoi.content = [...cu, ...khoi];
      return;
    }
    ra.push({ role, content: khoi });
  };

  for (const m of messages) {
    if (m.role === 'system') {
      if (typeof m.content === 'string' && m.content.trim()) heThong.push(m.content);
      continue;
    }

    if (m.role === 'tool') {
      // Kết quả tool đi vào tin `user` dưới dạng `tool_result`. Chuỗi rỗng là
      // hợp lệ với OpenAI nhưng Anthropic từ chối — thay bằng một dấu hiệu.
      const chu = m.content && m.content.length > 0 ? m.content : '(rỗng)';

      /*
       * ẢNH ĐI CẠNH `tool_result`, KHÔNG ĐI TRONG NÓ.
       *
       * Đo thật trên cổng rambo 19/08/2026, cùng một tấm PNG 2×2 có ô trên-
       * trái màu đỏ, hỏi "ô góc trên-trái màu gì":
       *
       *   ảnh trong tin `user` thường          → "Đỏ"      ✅ cổng NHÌN được
       *   ảnh NHÉT TRONG `tool_result.content` → "tôi không nhận được ảnh" ❌
       *   ảnh làm KHỐI ANH EM cạnh tool_result → "Đỏ."     ✅
       *
       * Nên cổng nhìn được ảnh, chỉ là nó lọc bỏ phần nằm BÊN TRONG
       * `tool_result`. Phép đối chứng (ảnh trong tin user) là thứ phân biệt
       * được "cổng mù" với "cổng lọc" — thiếu nó thì tôi đã kết luận sai và
       * bỏ hẳn tính năng.
       */
      const khoi: KhoiAnthropic[] = [
        { type: 'tool_result', tool_use_id: m.tool_call_id, content: chu },
      ];
      for (const a of m.anh ?? []) {
        khoi.push({ type: 'image', source: { type: 'base64', media_type: a.media_type, data: a.data } });
      }
      them('user', khoi);
      continue;
    }

    if (m.role === 'assistant') {
      const khoi: KhoiAnthropic[] = [];
      if (typeof m.content === 'string' && m.content.trim()) {
        khoi.push({ type: 'text', text: m.content });
      }
      for (const c of m.tool_calls ?? []) {
        khoi.push({ type: 'tool_use', id: c.id, name: c.function.name, input: docArgs(c.function.arguments) });
      }
      them('assistant', khoi);
      continue;
    }

    // user — có thể là chuỗi, hoặc mảng khối (chữ + ảnh).
    if (typeof m.content === 'string') {
      if (m.content.trim()) them('user', [{ type: 'text', text: m.content }]);
      continue;
    }
    const khoi: KhoiAnthropic[] = [];
    for (const c of (Array.isArray(m.content) ? m.content : []) as Array<Record<string, any>>) {
      if (c?.type === 'text' && typeof c.text === 'string') khoi.push({ type: 'text', text: c.text });
      else if (c?.type === 'image' && c.source) khoi.push({ type: 'image', source: c.source });
      else if (c?.type === 'image_url') {
        const a = anhTuImageUrl(c);
        if (a) khoi.push(a);
      }
    }
    them('user', khoi);
  }

  return { system: heThong.join('\n\n'), messages: ra };
}

/**
 * `stop_reason` của Anthropic → `finish_reason` của OpenAI.
 *
 * Phần còn lại của `turn.ts` chỉ hiểu tên OpenAI (`'length'` bật nhánh viết
 * tiếp). Dịch ở đây để không phải rải điều kiện khắp nơi.
 */
export function stopSangFinish(stop: string | null | undefined): string | null {
  if (!stop) return null;
  if (stop === 'tool_use') return 'tool_calls';
  if (stop === 'max_tokens') return 'length';
  if (stop === 'end_turn' || stop === 'stop_sequence') return 'stop';
  return stop;
}
