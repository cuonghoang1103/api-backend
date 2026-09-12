// ─── Nắn yêu cầu cho vừa hai giới hạn NGẦM của rambo ─────────────────────
//
// Đo thật 13/09/2026 bằng mã đặt ở đầu/cuối văn bản, gọi thẳng rambo:
//
// 1. MỖI KHỐI nội dung bị cắt ở ~12.000 ký tự (~3.200 token), không báo lỗi.
//    Một tin nhắn 40k / 200k / 1,2 triệu ký tự → model đều chỉ nhận ~3.200
//    token và tự nói "file bị cắt ngang". Kết quả tool (cách OpenCode đưa nội
//    dung file vào) cũng bị cắt y hệt. Nhưng CÙNG nội dung đó chia thành nhiều
//    khối ≤ 8.000 ký tự thì nhận đủ: 400k ký tự trong 5 tin nhắn → 143.718
//    token, thấy cả mã đầu lẫn mã cuối. System prompt 40k ký tự không bị cắt.
//
// 2. Chỉ giữ ~58 TIN NHẮN CUỐI. 80 cặp user/assistant → model chỉ thấy cặp
//    52→80. Trong OpenCode mỗi lần gọi tool là 2 tin nhắn, nên chừng 30 lần
//    gọi tool là yêu cầu gốc của người dùng rơi mất — model làm tiếp mà quên
//    mình đang làm gì.
//
// Cách nắn: (1) chia khối dài thành nhiều khối ≤ TRAN_KHOI; (2) quá TRAN_SO_TIN
// tin nhắn thì gộp các lượt CŨ thành một tin nhắn văn bản duy nhất ở đầu.
// Ranh giới gộp nhảy theo bậc 20 tin nhắn chứ không trượt từng lượt, để phần
// đầu hội thoại đứng yên qua nhiều lượt liền — prompt cache còn ăn được.

export const TRAN_KHOI = 8000;
export const TRAN_SO_TIN = 56;
const BAC_GOP = 20;
const GIU_TOI_THIEU = 36;

function chiaChu(text) {
  const out = [];
  for (let i = 0; i < text.length; i += TRAN_KHOI) out.push({ type: 'text', text: text.slice(i, i + TRAN_KHOI) });
  return out;
}

/** Trả về [nội dung mới, số khối đã phải chia]. Giữ nguyên thứ không cần đụng. */
export function chiaKhoi(content) {
  let dem = 0;
  const lam = (c) => {
    if (typeof c === 'string') {
      if (c.length <= TRAN_KHOI) return c;
      dem++;
      return chiaChu(c);
    }
    if (!Array.isArray(c)) return c;
    const out = [];
    for (const b of c) {
      if (b?.type === 'text' && typeof b.text === 'string' && b.text.length > TRAN_KHOI) {
        dem++;
        const phan = chiaChu(b.text);
        // Dấu cache nằm ở khối cuối cùng của đoạn đã chia — prefix được cache vẫn y như cũ.
        if (b.cache_control) phan[phan.length - 1].cache_control = b.cache_control;
        out.push(...phan);
      } else if (b?.type === 'tool_result' && b.content != null) {
        out.push({ ...b, content: lam(b.content) });
      } else out.push(b);
    }
    return out;
  };
  const moi = lam(content);
  return [moi, dem];
}

function vanBanKhoi(b) {
  if (typeof b === 'string') return b;
  switch (b?.type) {
    case 'text':
      return b.text;
    case 'tool_use':
      return `[tool call: ${b.name}] ${JSON.stringify(b.input)}`;
    case 'tool_result': {
      const noi = typeof b.content === 'string' ? b.content : (b.content || []).map(vanBanKhoi).join('\n');
      return `[tool result${b.is_error ? ' (error)' : ''}]\n${noi}`;
    }
    case 'thinking':
    case 'redacted_thinking':
      return '';
    default:
      return `[${b?.type || 'block'} omitted]`;
  }
}

function vanBanTin(m) {
  const noi = typeof m.content === 'string' ? m.content : (m.content || []).map(vanBanKhoi).filter(Boolean).join('\n');
  return `=== ${m.role.toUpperCase()} ===\n${noi}`;
}

/** Trả về [messages mới, số tin nhắn cũ đã gộp]. */
export function gopTinCu(messages) {
  if (!Array.isArray(messages) || messages.length <= TRAN_SO_TIN) return [messages, 0];
  let b = Math.floor((messages.length - GIU_TOI_THIEU) / BAC_GOP) * BAC_GOP;
  // Phần giữ lại phải MỞ ĐẦU bằng tin của assistant: tin user ngay sau chỗ cắt
  // có thể chứa tool_result của một tool_use đã bị gộp — gửi lẻ nó là 400.
  while (b < messages.length && messages[b].role !== 'assistant') b++;
  if (b <= 0 || b >= messages.length - 1) return [messages, 0];
  const lichSu = messages.slice(0, b).map(vanBanTin).join('\n\n');
  const dau = {
    role: 'user',
    content: [
      { type: 'text', text: '<earlier_conversation>\nThe gateway condensed the earliest turns of this conversation into plain text because the upstream provider only keeps the most recent messages. Treat it as the real history, including the original request.\n' },
      ...chiaChu(lichSu),
      { type: 'text', text: '\n</earlier_conversation>' },
    ],
  };
  return [[dau, ...messages.slice(b)], b];
}

/** Nắn cả body /v1/messages. Trả về { body, ghiChu } — ghiChu rỗng nếu không đổi gì. */
export function nanYeuCau(body) {
  if (!body || !Array.isArray(body.messages)) return { body, ghiChu: '' };
  const [msgs, soGop] = gopTinCu(body.messages);
  let soChia = 0;
  const moi = msgs.map((m) => {
    const [c, d] = chiaKhoi(m.content);
    soChia += d;
    return d ? { ...m, content: c } : m;
  });
  const ghiChu = [soChia && `chia ${soChia} khối dài`, soGop && `gộp ${soGop} tin cũ`].filter(Boolean).join(', ');
  return { body: ghiChu ? { ...body, messages: moi } : body, ghiChu };
}
