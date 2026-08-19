/**
 * Chạy THẬT `runAgentTurn` với một cổng giả, để chứng minh nhánh "viết tiếp"
 * hoạt động — không phải chỉ đúng trên giấy.
 *
 * Cổng giả trả `finish_reason: "length"` ở lượt đầu rồi `"stop"` ở lượt sau,
 * đúng như đo được trên modelapi 19/08/2026. Nếu `runAgentTurn` không đọc
 * `finish_reason` (lỗi cũ), câu trả lời cuối sẽ CỤT và phép kiểm này đỏ.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { runAgentTurn, type AgentEvent } from './turn.js';

/** Dựng một thân SSE giống hệt cổng thật. */
function than(mau: Array<Record<string, unknown>>): ReadableStream<Uint8Array> {
  const enc = new TextEncoder();
  return new ReadableStream({
    start(c) {
      for (const m of mau) c.enqueue(enc.encode(`data: ${JSON.stringify(m)}\n\n`));
      c.enqueue(enc.encode('data: [DONE]\n\n'));
      c.close();
    },
  });
}

function goiCat(chu: string, ly: string) {
  return {
    choices: [{ delta: { content: chu }, finish_reason: ly }],
    usage: { prompt_tokens: 10, completion_tokens: 5 },
  };
}

test('chạm trần token thì VIẾT TIẾP, không trả về câu cụt', async (t) => {
  /*
   * ⚠️ TỰ DỰNG MÔI TRƯỜNG, ĐỪNG MƯỢN `.env`.
   *
   * `runAgentTurn` chặn ngay ở `gatewayConfigured()` khi chưa có khoá cổng.
   * Máy nhà có `.env` (`config/env.ts` gọi `dotenv.config()`, nạp từ ĐĨA nên
   * `env -i` cũng không che được) ⇒ xanh. CI không có `.env` ⇒ lượt chết bằng
   * `LLM_UNCONFIGURED` và phép kiểm chỉ thấy `["error"]`.
   *
   * Đây là LẦN THỨ HAI trong cùng một ngày tôi viết phép kiểm mượn `.env` —
   * lần đầu là `gateway.test.ts`. Xem
   * [[feedback_phep_kiem_dat_vi_ly_do_sai]] mục 3.
   */
  const luu = ['LLM_GATEWAY_API_KEY', 'LLM_GATEWAY_BASE_URL', 'AGENT_GATEWAY_BASE_URL', 'AGENT_GATEWAY_API_KEY']
    .map((k) => [k, process.env[k]] as const);
  process.env.LLM_GATEWAY_API_KEY = 'sk-gia-lap-cho-kiem-thu';
  process.env.LLM_GATEWAY_BASE_URL = 'https://vi-du.test/v1';
  // Cổng riêng của agent phải TẮT ở đây: bật thì `endpointFor` đi đường khác
  // và phép kiểm không còn đo cái nó định đo.
  delete process.env.AGENT_GATEWAY_BASE_URL;
  delete process.env.AGENT_GATEWAY_API_KEY;
  t.after(() => {
    for (const [k, v] of luu) { if (v === undefined) delete process.env[k]; else process.env[k] = v; }
  });

  const goc = globalThis.fetch;
  let lan = 0;
  const daGui: any[] = [];

  globalThis.fetch = (async (_url: any, init: any) => {
    lan += 1;
    daGui.push(JSON.parse(String(init.body)));
    // Lượt 1 bị cắt giữa mục "7"; lượt 2 viết lại mục đó rồi viết tiếp —
    // đúng hành vi đã đo được trên cổng thật.
    const mau = lan === 1
      ? [goiCat('1 - một\n2 - hai\n3 - ba\n4 - bốn\n5 - năm\n6 - sáu\n7 ', 'length')]
      : [goiCat('7 - bảy\n8 - tám. Xong.', 'stop')];
    return new Response(than(mau), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  }) as typeof fetch;
  t.after(() => { globalThis.fetch = goc; });

  const sk: AgentEvent[] = [];
  await runAgentTurn(
    {
      userId: 1,
      messages: [{ role: 'user', content: 'Đếm từ 1 đến 8.' }],
      capabilities: [],
      mucNoLuc: 'vua',
    } as any,
    (e) => sk.push(e),
    new AbortController().signal,
  );

  const xong = sk.find((e) => e.type === 'done') as any;
  assert.ok(xong, `không có khung 'done'. Sự kiện: ${JSON.stringify(sk.map((e) => e.type))}`);

  const cuoi = xong.append[xong.append.length - 1];
  assert.equal(cuoi.role, 'assistant');

  // 1. Đã gọi cổng HAI lần ⇒ có viết tiếp thật.
  assert.equal(lan, 2, 'chỉ gọi cổng một lần — `finish_reason` đang bị bỏ qua');

  // 2. Lượt hai gửi phần dở làm tin nhắn assistant CUỐI (prefill).
  const luot2 = daGui[1].messages;
  assert.equal(luot2[luot2.length - 1].role, 'assistant', 'lượt hai không prefill');

  // 3. Câu trả lời KHÔNG cụt, và không nhân đôi chỗ chồng lấn.
  assert.match(String(cuoi.content), /Xong\.$/, `câu trả lời vẫn cụt: ${cuoi.content}`);
  assert.ok(!String(cuoi.content).includes('7 7'), `chồng lấn chưa gộp: ${cuoi.content}`);

  // 4. Chỉ MỘT tin nhắn assistant trong `append` — không đẩy thêm bản sao.
  const soAssistant = xong.append.filter((m: any) => m.role === 'assistant').length;
  assert.equal(soAssistant, 1, `có ${soAssistant} tin assistant — mỗi lần viết tiếp lại đẩy thêm một bản`);
});
