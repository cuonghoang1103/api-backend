/**
 * Model VIẾT lời gọi tool thành chữ (lỗi prod 22/10/2026 05:24 — rambo "claude-sonnet-5" trả DSML của DeepSeek ở vòng đã
 * gỡ tool, iPad hiện nguyên khối) — `npx tsx --test src/services/work/aiMarkupTool.test.ts`
 *
 * 1. Nhận diện + đọc thành tool call: đúng mẫu DSML prod, DSML chữ thường `|`, DeepSeek V3 token, Hermes/Qwen
 *    `<tool_call>`, XML `<function_calls><invoke>`, Mistral `[TOOL_CALLS]`, cả câu là JSON gọi tool; chữ thường có `<b>`,
 *    `[LFD-75](…)`, JSON trong code ⇒ KHÔNG phải markup.
 * 2. Stream: cắt luồng ở MỌI vị trí ⇒ không một mẩu markup nào ra client (đứng đầu hay sau chữ); chữ trước + markup sau
 *    ⇒ giữ chữ, cắt markup.
 * 3. Trọn đường askWithReads qua chuỗi cổng GIẢ: vòng cuối (đã gỡ tool) rambo trả DSML ⇒ cổng sau trả lời, lời dặn chặt
 *    hơn, không reset, không lộ; vòng có tool trả DSML ⇒ đọc thành tool call rồi đọc thật; markup sau đoạn chữ dài ⇒ giữ
 *    chữ; mọi cổng cứ trả markup ⇒ 502 sau 2 lần đổi, không lộ gì; modelapi (cổng cuối) trả markup ⇒ làm lại chính nó.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { _xoaDemMarkupTool, docMarkupTool, thongKeMarkupTool, viTriMarkupTool } from './aiMarkupTool.js';
import { docTraLoi, phanHien, readsTuToolCalls, TraLoiStreamer } from './aiTraLoi.js';
import { askWithReads, _boQuaHanMucChoTest, _setAskForTests } from './ai.service.js';
import { _datCongChoTest } from './aiCong.js';
import type { ProjectAccess } from './permissions.js';

/** Đúng khối iPad nhận ở prod (thanh dọc TOÀN KHỔ U+FF5C). */
const DSML = `<｜DSML｜function_calls>
<｜DSML｜invoke name="read_command">
<｜DSML｜parameter name="name" string="true">get_page</｜DSML｜parameter>
<｜DSML｜parameter name="args" string="false">{"page":1}</｜DSML｜parameter>
</｜DSML｜invoke>
<｜DSML｜invoke name="read_command">
<｜DSML｜parameter name="name" string="true">read_issue</｜DSML｜parameter>
<｜DSML｜parameter name="args" string="false">{"issue":7,"withPages":true}</｜DSML｜parameter>
</｜DSML｜invoke>
</｜DSML｜function_calls>`;

test('mẫu DSML của prod ⇒ nhận diện ở vị trí 0, đọc ra 2 tool call ⇒ 2 mục đọc', () => {
  assert.equal(viTriMarkupTool(DSML), 0);
  const goi = docMarkupTool(DSML);
  assert.deepEqual(goi, [
    { name: 'read_command', input: { name: 'get_page', args: { page: 1 } } },
    { name: 'read_command', input: { name: 'read_issue', args: { issue: 7, withPages: true } } },
  ]);
  assert.deepEqual(readsTuToolCalls(goi), [
    { tool: 'command', name: 'get_page', args: { page: 1 } },
    { tool: 'command', name: 'read_issue', args: { issue: 7, withPages: true } },
  ]);
  // Dạng màn hình iPad hiện (`< | DSML | calls>` — có dấu cách, thanh thường) cũng nhận.
  assert.ok(viTriMarkupTool('< | DSML | calls>\n< | DSML | invoke name="read_command">') >= 0);
  assert.equal(docTraLoi(DSML).reply, '');
  assert.equal(docTraLoi(DSML).markupTool, true);
});

test('các khuôn khác ⇒ nhận diện + đọc thành tool call', () => {
  const cases: Array<[string, string, Array<{ name: string; input: Record<string, unknown> }>]> = [
    ['DSML thanh thường', '<|DSML|invoke name="read_page">\n<|DSML|parameter name="number" string="false">3</|DSML|parameter>\n</|DSML|invoke>', [{ name: 'read_page', input: { number: 3 } }]],
    ['DeepSeek V3 token', '<｜tool▁calls▁begin｜><｜tool▁call▁begin｜>function<｜tool▁sep｜>read_page\n```json\n{"number":4}\n```<｜tool▁call▁end｜><｜tool▁calls▁end｜>', [{ name: 'read_page', input: { number: 4 } }]],
    ['Hermes/Qwen', '<tool_call>\n{"name": "search_pages", "arguments": {"query": "git"}}\n</tool_call>', [{ name: 'search_pages', input: { query: 'git' } }]],
    ['XML function_calls', '<function_calls>\n<invoke name="read_command">\n<parameter name="name">read_issue</parameter>\n<parameter name="args">{"issue":5}</parameter>\n</invoke>\n</function_calls>', [{ name: 'read_command', input: { name: 'read_issue', args: { issue: 5 } } }]],
    ['Mistral', '[TOOL_CALLS] [{"name": "read_page", "arguments": {"number": 2}}]', [{ name: 'read_page', input: { number: 2 } }]],
    ['cả câu là JSON gọi tool', '{"name": "read_command", "arguments": "{\\"name\\":\\"read_issue\\",\\"args\\":{\\"issue\\":9}}"}', [{ name: 'read_command', input: { name: 'read_issue', args: { issue: 9 } } }]],
    ['mảng JSON kiểu OpenAI', '[{"type":"function","function":{"name":"read_page","arguments":"{\\"number\\":8}"}}]', [{ name: 'read_page', input: { number: 8 } }]],
  ];
  for (const [ten, raw, goi] of cases) {
    assert.ok(viTriMarkupTool(raw) >= 0, ten);
    assert.deepEqual(docMarkupTool(raw), goi, ten);
    assert.equal(docTraLoi(raw).reply, '', `${ten}: không bao giờ thành câu trả lời`);
  }
  // Nhận diện được nhưng không đọc được ⇒ [] (nơi gọi chuyển cổng).
  assert.deepEqual(docMarkupTool('<tool_call>{hỏng'), []);
});

test('chữ thường KHÔNG bị coi là markup: <b>, link [LFD-75](…), JSON trong code, object không phải gọi tool', () => {
  for (const t of [
    '**Việc gấp:** <b>LFD-75</b> quá hạn.',
    '[LFD-75 — Login](/work/x/LFD/issue/75) · In Progress',
    'Payload mẫu:\n```json\n{"name":"An","age":3}\n```',
    '{"name":"An","age":3}',
    'Dùng `invoke()` để gọi hàm.',
  ]) {
    assert.equal(viTriMarkupTool(t), -1, t);
    assert.equal(docTraLoi(t).markupTool, undefined, t);
  }
});

test('chữ trước + markup sau ⇒ giữ chữ, cắt markup (phanHien / docTraLoi)', () => {
  const chu = '### Sprint 1\n- Làm LFD-7 trước: **hạn 24/10**.';
  assert.equal(phanHien(`${chu}\n\n${DSML}`, true), chu);
  assert.equal(docTraLoi(`${chu}\n${DSML}`).reply, chu);
  assert.equal(docTraLoi(`${chu}\n<tool_call>{"name":"x","arguments":{}}</tool_call>`).reply, chu);
});

function chay(raw: string, cut: number, giu: number) {
  let draft = '';
  const ev: string[] = [];
  const s = new TraLoiStreamer((d) => { ev.push(d); draft += d; }, () => { ev.push('<RESET>'); draft = ''; }, giu);
  s.push(raw.slice(0, cut));
  s.push(raw.slice(cut));
  const truoc = draft;
  s.ketThuc();
  return { truoc, draft, ev };
}

test('stream: cắt ở MỌI vị trí ⇒ không một mẩu markup nào ra client (đứng đầu, sau chữ, thanh thường/toàn khổ)', () => {
  const chu = `### Việc hôm nay\n${'- Làm LFD-7: viết test biên cho đăng nhập.\n'.repeat(4)}`;
  for (const raw of [DSML, `${chu}${DSML}`, `${chu}<tool_call>{"name":"read_page","arguments":{"number":1}}</tool_call>`, `${chu}[TOOL_CALLS] [{"name":"a","arguments":{}}]`, '[{"name":"read_page","arguments":{"number":8}}]']) {
    for (const giu of [0, 120]) {
      for (let i = 0; i <= raw.length; i++) {
        const r = chay(raw, i, giu);
        assert.ok(!/DSML|tool_call|TOOL_CALLS|invoke|"arguments"|<｜|<\|/.test(r.ev.join('')), `lộ ở nhát ${i}: ${JSON.stringify(r.ev.join('').slice(-60))}`);
        assert.ok(!r.ev.includes('<RESET>'), `reset ở nhát ${i}`);
      }
    }
  }
});

test('stream: giữ đầu 120 ký tự ⇒ chữ thật vẫn chảy ngay sau ngưỡng (TTFT nhỏ)', () => {
  const ev: string[] = [];
  const s = new TraLoiStreamer((d) => ev.push(d), undefined, 120);
  const raw = 'Bạn nên tập trung vào LFD-7 hôm nay vì nó chặn LFD-9 và hạn là 24/10. '.repeat(6);
  for (const ch of raw) s.push(ch);
  assert.ok(ev.length > 100, 'sau ngưỡng thì phát từng mẩu');
  assert.ok(ev[0].length >= 120 && ev[0].length < 130);
});

// ─── 3. Trọn đường qua chuỗi cổng GIẢ ───

const NO_ACCESS = { projectId: 1, key: 'LFD' } as ProjectAccess;
const EP = { root: 'http://rambo.test', key: 'k', local: false, label: 'cong-agent', giaoThuc: 'anthropic' as const };
const kq = (cong: 'rambo' | 'chinh_hang' | 'modelapi', text: string, extra: Record<string, unknown> = {}) => ({ text, model: `m-${cong}`, inputTokens: 1, outputTokens: 1, cong, ...extra });
const tungMau = (o: { onToken?: (d: string) => void }, text: string) => { for (let i = 0; i < text.length; i += 5) o.onToken?.(text.slice(i, i + 5)); };
const TRA_LOI = '### Hôm nay tập trung vào\n1. **LFD-7** — đăng nhập (hạn 24/10).\n2. **LFD-9** — giỏ hàng.\n\nCòn thiếu: biên bản họp sprint chưa có trong CT Work.';

function chuoiGia(t: { after: (fn: () => void) => void }, p: Parameters<typeof _datCongChoTest>[0]) {
  _setAskForTests(null);
  _boQuaHanMucChoTest(true);
  _xoaDemMarkupTool();
  _datCongChoTest({ chinhHangSanSang: async () => true, baoChinhHangHong: () => {}, ...p });
  t.after(() => { _datCongChoTest(null); _boQuaHanMucChoTest(false); });
}
function nghe() {
  const ev: string[] = [];
  let draft = '';
  return {
    ev, get draft() { return draft; },
    hooks: { onDelta: (d: string) => { ev.push(d); draft += d; }, onReset: () => { ev.push('<RESET>'); draft = ''; } },
  };
}
const khongLo = (ev: string[]) => !/DSML|tool_call|invoke|function_calls/.test(ev.join(''));

test('LỖI PROD: vòng 0–2 rambo gọi tool gốc, vòng 3 (đã gỡ tool) trả DSML ⇒ cổng sau trả lời, không lộ, không reset', async (t) => {
  let ramboLan = 0;
  let promptCH = '';
  chuoiGia(t, {
    rambo: () => EP, ramboDangNghi: () => false,
    goiRambo: async (o) => {
      ramboLan++;
      if (o.tools?.length) return kq('rambo', '', { toolCalls: [{ name: 'read_page', input: { number: ramboLan } }] });
      tungMau(o, DSML);
      return kq('rambo', DSML);
    },
    goiChinhHang: async (o) => {
      assert.ok(!o.tools?.length, 'vòng cuối vẫn không có tool');
      promptCH = String(o.messages[0].content);
      tungMau(o, TRA_LOI);
      return kq('chinh_hang', TRA_LOI);
    },
  });
  const h = nghe();
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'Hôm nay tôi nên tập trung vào việc gì để kịp xong Sprint 1?', 16_000, false, undefined, h.hooks);
  assert.equal(out.reply, TRA_LOI);
  assert.equal(h.draft, TRA_LOI);
  assert.ok(khongLo(h.ev));
  assert.ok(!h.ev.includes('<RESET>'));
  assert.equal(ramboLan, 4, '3 vòng tool + 1 vòng cuối ra DSML; lần làm lại KHÔNG gõ rambo nữa');
  assert.match(promptCH, /read tools are NOT available now/);
  assert.deepEqual(thongKeMarkupTool().map((x) => [x.cong, x.model, x.lan]), [['rambo', 'm-rambo', 1]]);
});

test('vòng CÓ tool mà model viết DSML thay vì gọi tool gốc ⇒ đọc thành tool call, đọc thật, rồi trả lời', async (t) => {
  const prompts: string[] = [];
  chuoiGia(t, {
    rambo: () => EP, ramboDangNghi: () => false,
    goiRambo: async (o) => {
      prompts.push(String(o.messages[0].content));
      if (prompts.length === 1) {
        const x = '<｜DSML｜function_calls>\n<｜DSML｜invoke name="read_page">\n<｜DSML｜parameter name="number" string="false">3</｜DSML｜parameter>\n</｜DSML｜invoke>\n</｜DSML｜function_calls>';
        tungMau(o, x);
        return kq('rambo', x);
      }
      tungMau(o, TRA_LOI);
      return kq('rambo', TRA_LOI);
    },
  });
  const h = nghe();
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'hỏi', 16_000, false, undefined, h.hooks);
  assert.equal(out.reply, TRA_LOI);
  assert.equal(out.stats.reads, 1);
  assert.match(prompts[1], /project documents are not available here/, 'đã chạy lượt đọc từ khối DSML');
  assert.ok(khongLo(h.ev));
});

test('lượt không có tool: đoạn chữ thật DÀI rồi mới tới markup ⇒ giữ chữ, cắt markup, không đổi cổng', async (t) => {
  const dai = `${TRA_LOI}\n\n${'- Ghi chú thêm về luồng đăng nhập và test biên.\n'.repeat(4)}`.trim();
  let lanCH = 0;
  chuoiGia(t, {
    rambo: () => EP, ramboDangNghi: () => false,
    goiRambo: async (o) => { const x = `${dai}\n${DSML}`; tungMau(o, x); return kq('rambo', x); },
    goiChinhHang: async () => { lanCH++; return kq('chinh_hang', 'không được gọi'); },
  });
  const h = nghe();
  // Prompt chạm trần ⇒ không có vòng đọc nào (không đưa tool) ngay từ vòng 0.
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'x'.repeat(130_000), 16_000, false, undefined, h.hooks);
  assert.equal(out.reply, dai);
  assert.equal(h.draft, dai);
  assert.equal(lanCH, 0);
  assert.ok(khongLo(h.ev));
});

test('mọi cổng cứ trả markup ⇒ 502 WORK_AI_BAD_OUTPUT sau 2 lần đổi, client không thấy gì', async (t) => {
  const goi: string[] = [];
  chuoiGia(t, {
    rambo: () => EP, ramboDangNghi: () => false,
    goiRambo: async (o) => { goi.push('rambo'); tungMau(o, DSML); return kq('rambo', DSML); },
    goiChinhHang: async (o) => { goi.push('ch'); tungMau(o, DSML); return kq('chinh_hang', DSML); },
    goiModelapi: async (o) => { goi.push('modelapi'); tungMau(o, DSML); return kq('modelapi', DSML); },
  });
  const h = nghe();
  await assert.rejects(askWithReads(1, NO_ACCESS, 'sys', 'x'.repeat(130_000), 16_000, false, undefined, h.hooks), (e: { code?: string }) => e.code === 'WORK_AI_BAD_OUTPUT');
  assert.deepEqual(goi, ['rambo', 'ch', 'modelapi']);
  assert.deepEqual(h.ev, []);
});

test('modelapi (cổng cuối) trả markup ⇒ làm lại CHÍNH nó với lời dặn chặt hơn', async (t) => {
  const prompts: string[] = [];
  chuoiGia(t, {
    rambo: () => null, chinhHangSanSang: async () => false,
    goiModelapi: async (o) => {
      prompts.push(String(o.messages[0].content));
      const x = prompts.length === 1 ? '<tool_call>{"name":"read_page","arguments":{"number":1}}</tool_call>' : TRA_LOI;
      tungMau(o, x);
      return kq('modelapi', x);
    },
  });
  const h = nghe();
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'x'.repeat(130_000), 16_000, false, undefined, h.hooks);
  assert.equal(out.reply, TRA_LOI);
  assert.equal(prompts.length, 2);
  assert.match(prompts[1], /read tools are NOT available now/);
  assert.ok(khongLo(h.ev));
});
