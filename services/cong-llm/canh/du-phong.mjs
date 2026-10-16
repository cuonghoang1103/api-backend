// ─── Cổng DỰ PHÒNG: rambo đóng/sập ⇒ chạy gpt-6-sol trên modelapi (16/10/2026) ─
//
// Người dùng 16/10/2026: gõ `opencode` thì hiện chữ đỏ "Tạm dừng, chạy lại sau
// khoảng 194 phút… cổng dùng chung đang cao điểm". Cài không hỏng — canh cố ý
// khoá key con khi key rambo chính đã dùng ≥85% cửa sổ 5h (ưu tiên web), và
// lúc rambo bảo trì thì cũng chết theo. Người dùng hỏi: lúc đó dùng gpt-6-sol
// của modelapi thay được không. Được — đây là phần đó.
//
// ⚠️ VÌ SAO PHẢI TỰ DỊCH, không gửi thẳng `/v1/messages` của modelapi:
// đo thật 16/10/2026, modelapi NHẬN định dạng Anthropic với model gpt-6-sol
// và trả lời đúng chữ — nhưng LẶNG LẼ VỨT `tools` (input_tokens 14 cho một
// yêu cầu có tool; model đáp "mình không có công cụ đọc file"). OpenCode sống
// bằng tool, nên đường đó vô dụng. Tuyến OpenAI `/v1/chat/completions` thì
// giữ tool đầy đủ (đo cùng lúc: trả `tool_calls` đúng tên, đúng tham số).
// Nên canh dịch Anthropic Messages ⇄ OpenAI Chat, cả hai chiều, cả stream.
//
// Hàm dịch THUẦN (không mạng) để kiểm riêng — xem du-phong.test.mjs.

/** Ghép chữ của `system` (chuỗi hoặc mảng khối). */
function chuCuaSystem(sys) {
  if (!sys) return '';
  if (typeof sys === 'string') return sys;
  if (Array.isArray(sys)) return sys.filter((k) => k?.type === 'text').map((k) => k.text).join('\n\n');
  return '';
}

function anhSangOpenAI(k) {
  const src = k.source || {};
  if (src.type === 'base64') return { type: 'image_url', image_url: { url: `data:${src.media_type};base64,${src.data}` } };
  if (src.type === 'url') return { type: 'image_url', image_url: { url: src.url } };
  return null;
}

/** Nội dung của một khối tool_result → { chu, anh[] }. */
function moToolResult(k) {
  const c = k.content;
  if (typeof c === 'string') return { chu: c, anh: [] };
  const chu = [];
  const anh = [];
  for (const x of Array.isArray(c) ? c : []) {
    if (x?.type === 'text') chu.push(x.text);
    else if (x?.type === 'image') { const a = anhSangOpenAI(x); if (a) anh.push(a); }
  }
  return { chu: chu.join('\n'), anh };
}

/** Yêu cầu Anthropic Messages → yêu cầu OpenAI Chat Completions. */
export function anthropicSangOpenAI(j, model) {
  const messages = [];
  const sys = chuCuaSystem(j.system);
  if (sys) messages.push({ role: 'system', content: sys });

  for (const m of j.messages || []) {
    const ds = typeof m.content === 'string' ? [{ type: 'text', text: m.content }] : (m.content || []);
    if (m.role === 'assistant') {
      const chu = ds.filter((k) => k.type === 'text').map((k) => k.text).join('');
      const goi = ds.filter((k) => k.type === 'tool_use').map((k) => ({
        id: k.id, type: 'function', function: { name: k.name, arguments: JSON.stringify(k.input ?? {}) },
      }));
      const tin = { role: 'assistant', content: chu || null };
      if (goi.length) tin.tool_calls = goi;
      if (tin.content !== null || goi.length) messages.push(tin);
      continue;
    }
    // user: tool_result PHẢI đứng ngay sau tin assistant có tool_calls, trước
    // mọi chữ của người dùng — OpenAI báo lỗi nếu xen giữa.
    const phan = [];
    const anhPhu = [];
    for (const k of ds) {
      if (k.type === 'tool_result') {
        const { chu, anh } = moToolResult(k);
        messages.push({ role: 'tool', tool_call_id: k.tool_use_id, content: (k.is_error ? '[LỖI] ' : '') + (chu || '(trống)') });
        anhPhu.push(...anh);
      } else if (k.type === 'text') phan.push({ type: 'text', text: k.text });
      else if (k.type === 'image') { const a = anhSangOpenAI(k); if (a) phan.push(a); }
      else if (k.type === 'document') phan.push({ type: 'text', text: '[Tệp đính kèm không gửi được qua cổng dự phòng.]' });
    }
    // Tin `tool` không chứa ảnh được ⇒ ảnh của kết quả tool đi kèm một tin user.
    if (anhPhu.length) phan.unshift({ type: 'text', text: '(Ảnh từ kết quả công cụ ở trên:)' }, ...anhPhu);
    if (phan.length) {
      messages.push({ role: 'user', content: phan.every((p) => p.type === 'text') ? phan.map((p) => p.text).join('\n') : phan });
    }
  }

  const ra = { model, messages, stream: !!j.stream };
  if (j.stream) ra.stream_options = { include_usage: true };
  if (j.max_tokens) ra.max_tokens = j.max_tokens;
  if (typeof j.temperature === 'number') ra.temperature = j.temperature;
  if (typeof j.top_p === 'number') ra.top_p = j.top_p;
  if (Array.isArray(j.stop_sequences) && j.stop_sequences.length) ra.stop = j.stop_sequences.slice(0, 4);

  // Tool của Anthropic phía máy chủ (web_search_…) không có ở OpenAI ⇒ bỏ.
  const tools = (j.tools || []).filter((t) => t?.name && t.input_schema).map((t) => ({
    type: 'function', function: { name: t.name, description: t.description || '', parameters: t.input_schema },
  }));
  if (tools.length) {
    ra.tools = tools;
    const tc = j.tool_choice;
    if (tc?.type === 'any') ra.tool_choice = 'required';
    else if (tc?.type === 'none') ra.tool_choice = 'none';
    else if (tc?.type === 'tool' && tc.name) ra.tool_choice = { type: 'function', function: { name: tc.name } };
  }
  return ra;
}

const LY_DO_DUNG = { stop: 'end_turn', length: 'max_tokens', tool_calls: 'tool_use', function_call: 'tool_use', content_filter: 'end_turn' };

function docJson(s) {
  try { return JSON.parse(s || '{}'); } catch { return { _tho: s }; }
}

/** Trả lời OpenAI (không stream) → trả lời Anthropic. */
export function openAISangAnthropic(o, model) {
  const ch = o.choices?.[0] || {};
  const tin = ch.message || {};
  const content = [];
  if (tin.content) content.push({ type: 'text', text: tin.content });
  for (const g of tin.tool_calls || []) {
    content.push({ type: 'tool_use', id: g.id, name: g.function?.name, input: docJson(g.function?.arguments) });
  }
  return {
    id: o.id ? `msg_${o.id}` : `msg_duphong_${Date.now()}`,
    type: 'message', role: 'assistant', model, content,
    stop_reason: (tin.tool_calls?.length ? 'tool_use' : LY_DO_DUNG[ch.finish_reason]) || 'end_turn',
    stop_sequence: null,
    usage: { input_tokens: o.usage?.prompt_tokens ?? 0, output_tokens: o.usage?.completion_tokens ?? 0 },
  };
}

/**
 * Bộ dịch STREAM: nhận từng dòng SSE của OpenAI, nhả ra sự kiện SSE của
 * Anthropic (message_start → content_block_* → message_delta → message_stop).
 */
export function taoBoDichStream(model) {
  let daMo = false;
  let khoi = -1;          // chỉ số khối Anthropic đang mở
  let loaiKhoi = null;    // 'text' | 'tool'
  const toolTheoChiSo = new Map(); // chỉ số tool của OpenAI → chỉ số khối Anthropic
  let lyDo = null;
  let usage = { input_tokens: 0, output_tokens: 0 };
  let daDong = false;
  const sk = (type, d) => `event: ${type}\ndata: ${JSON.stringify({ type, ...d })}\n\n`;

  function moDau(id) {
    if (daMo) return '';
    daMo = true;
    return sk('message_start', {
      message: {
        id: `msg_${id || `duphong_${Date.now()}`}`, type: 'message', role: 'assistant', model, content: [],
        stop_reason: null, stop_sequence: null, usage: { input_tokens: 0, output_tokens: 0 },
      },
    });
  }
  function dongKhoi() {
    if (khoi < 0 || loaiKhoi === null) return '';
    const s = sk('content_block_stop', { index: khoi });
    loaiKhoi = null;
    return s;
  }

  function nhan(dong) {
    if (!dong.startsWith('data:')) return '';
    const du = dong.slice(5).trim();
    if (du === '[DONE]') return ketThuc();
    let o;
    try { o = JSON.parse(du); } catch { return ''; }
    let ra = moDau(o.id);
    if (o.usage) usage = { input_tokens: o.usage.prompt_tokens ?? 0, output_tokens: o.usage.completion_tokens ?? 0 };
    const ch = o.choices?.[0];
    if (!ch) return ra;
    const d = ch.delta || {};
    if (d.content) {
      if (loaiKhoi !== 'text') {
        ra += dongKhoi();
        khoi += 1; loaiKhoi = 'text';
        ra += sk('content_block_start', { index: khoi, content_block: { type: 'text', text: '' } });
      }
      ra += sk('content_block_delta', { index: khoi, delta: { type: 'text_delta', text: d.content } });
    }
    for (const g of d.tool_calls || []) {
      const ci = g.index ?? 0;
      if (!toolTheoChiSo.has(ci)) {
        ra += dongKhoi();
        khoi += 1; loaiKhoi = 'tool';
        toolTheoChiSo.set(ci, khoi);
        ra += sk('content_block_start', {
          index: khoi, content_block: { type: 'tool_use', id: g.id || `toolu_duphong_${khoi}`, name: g.function?.name || '', input: {} },
        });
      }
      const args = g.function?.arguments;
      if (args) ra += sk('content_block_delta', { index: toolTheoChiSo.get(ci), delta: { type: 'input_json_delta', partial_json: args } });
    }
    if (ch.finish_reason) lyDo = toolTheoChiSo.size ? 'tool_use' : (LY_DO_DUNG[ch.finish_reason] || 'end_turn');
    return ra;
  }

  function ketThuc() {
    if (daDong) return '';
    daDong = true;
    let ra = moDau();
    ra += dongKhoi();
    ra += sk('message_delta', { delta: { stop_reason: lyDo || (toolTheoChiSo.size ? 'tool_use' : 'end_turn'), stop_sequence: null }, usage });
    ra += sk('message_stop', {});
    return ra;
  }

  return { nhan, ketThuc };
}

/** Trạng thái của rambo mà nên CHUYỂN SANG dự phòng thay vì trả lỗi cho người dùng. */
export function nenChuyenDuPhong(status) {
  return status === 429 || status === 529 || status >= 500;
}
