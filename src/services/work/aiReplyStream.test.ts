/**
 * Trợ lý dự án — bản STREAM (20/10/2026), phần THUẦN (không cần CSDL):
 *   npx tsx --test src/services/work/aiReplyStream.test.ts
 *
 * 1. `ReplyStreamer` rút đúng chuỗi `reply` từ JSON model đang viết: escape (\n \" \\ \/ \uXXXX, cặp surrogate), cắt mẩu
 *    ở MỌI vị trí, rào ```json, chữ thừa trước `{`, `reply` lồng trong actions không tính, `reads` trước `reply` ⇒ im,
 *    luồng bị cụt ⇒ chỉ phát phần chắc chắn (không nửa escape, không nửa surrogate).
 * 2. `reconcileReply` — nháp khớp / thiếu đuôi / lệch.
 * 3. `askWithReads` với hooks: model giả CÓ stream ⇒ delta nối lại đúng bằng reply; model giả KHÔNG stream ⇒ một delta
 *    duy nhất = cả câu; lượt trả lời rỗng đã lỡ phát chữ ⇒ reset; client ngắt ⇒ WORK_AI_CANCELLED, không gọi model.
 * 4. (22/10/2026) TRỌN đường askWithReads → goiAiCtWork với các bậc cổng GIẢ (`_datCongChoTest`, không gọi mạng): bậc
 *    đầu chết trước chữ đầu ⇒ không ai thấy; chết GIỮA CHỪNG ⇒ bậc sau viết tiếp, nháp nối liền (không reset), phần lặp
 *    bị cắt; chạm trần độ dài ⇒ tự viết tiếp; trả rỗng ⇒ bậc sau; lượt tool đọc ⇒ đọc rồi trả lời; cổng thử lại ⇒ reset
 *    rồi nháp đúng; Markdown có code `{` (lỗi WORK_AI_BAD_OUTPUT thật) ⇒ trả lời được.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { ReplyStreamer, reconcileReply } from './aiReplyStream.js';
import { askWithReads, _boQuaHanMucChoTest, _setAskForTests, type AskProgress } from './ai.service.js';
import { _datCongChoTest } from './aiCong.js';
import type { ProjectAccess } from './permissions.js';

function run(raw: string, cuts: number[] = []): { out: string; deltas: string[]; s: ReplyStreamer } {
  const deltas: string[] = [];
  const s = new ReplyStreamer((d) => deltas.push(d));
  let prev = 0;
  for (const c of [...cuts, raw.length]) { s.push(raw.slice(prev, c)); prev = c; }
  return { out: deltas.join(''), deltas, s };
}

const CASES: Array<{ name: string; raw: string; reply: string }> = [
  { name: 'đơn giản', raw: '{"reply":"Xin chào","actions":[]}', reply: 'Xin chào' },
  {
    name: 'escape đủ loại',
    raw: JSON.stringify({ reply: 'Dòng 1\nDòng 2\t"trích" \\ đường/dẫn \r\b\f ✓ 😀 tiếng Việt có dấu', actions: [{ type: 'x', reply: 'lồng' }] }),
    reply: 'Dòng 1\nDòng 2\t"trích" \\ đường/dẫn \r\b\f ✓ 😀 tiếng Việt có dấu',
  },
  { name: '\\u escape + cặp surrogate', raw: '{"reply":"A\\u00e9B\\uD83D\\uDE00C\\/D"}', reply: 'AéB😀C/D' },
  { name: 'rào ```json + chữ trước', raw: 'Here you go:\n```json\n{ "reply" : "### Việc\\n- [LFD-75](/work/x)" , "actions": [ ] }\n```', reply: '### Việc\n- [LFD-75](/work/x)' },
  { name: 'actions trước reply, reply lồng trong actions bị bỏ', raw: '{"actions":[{"reply":"SAI","args":{"reply":"SAI2"}}],"reply":"ĐÚNG"}', reply: 'ĐÚNG' },
  { name: 'khoá khác có escape \\" trước reply', raw: '{"note":"a\\"reply\\":\\"x","reply":"ok"}', reply: 'ok' },
];

for (const c of CASES) {
  test(`ReplyStreamer: ${c.name} — một mẩu và cắt ở MỌI vị trí`, () => {
    assert.equal(run(c.raw).out, c.reply);
    for (let i = 0; i <= c.raw.length; i++) {
      const r = run(c.raw, [i]);
      assert.equal(r.out, c.reply, `cắt tại ${i}`);
      // Không mẩu nào chứa nửa surrogate lẻ.
      for (const d of r.deltas) assert.ok(!/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(d), `nửa surrogate tại ${i}: ${JSON.stringify(d)}`);
    }
    // Từng ký tự một.
    const each = run(c.raw, Array.from({ length: c.raw.length }, (_, i) => i));
    assert.equal(each.out, c.reply);
  });
}

test('ReplyStreamer: cắt đôi MỌI cặp vị trí (2 nhát) trên chuỗi có escape', () => {
  const raw = '{"reply":"x\\n\\"y\\u00e9\\uD83D\\uDE00z","actions":[]}';
  for (let i = 0; i <= raw.length; i++) for (let j = i; j <= raw.length; j++) assert.equal(run(raw, [i, j]).out, 'x\n"yé😀z', `${i},${j}`);
});

test('ReplyStreamer: luồng CỤT giữa chừng ⇒ chỉ phát phần chắc chắn, không phát nửa escape', () => {
  assert.equal(run('{"reply":"Bắt đầu\\').out, 'Bắt đầu');
  assert.equal(run('{"reply":"Bắt đầu\\u00').out, 'Bắt đầu');
  assert.equal(run('{"reply":"Bắt đầu\\uD83D').out, 'Bắt đầu');
  assert.equal(run('{"reply":"ab').out, 'ab');
  assert.equal(run('{"rep').out, '');
  assert.equal(run('').out, '');
  const s = run('{"reply":"ab').s;
  assert.equal(s.complete, false);
  assert.equal(run('{"reply":"ab"}').s.complete, true);
});

test('ReplyStreamer: lượt XIN ĐỌC (reads trước reply) ⇒ không phát; reply rỗng ⇒ không phát', () => {
  const a = run('{"reads":[{"tool":"command","name":"read_issue","args":{"issue":75}}],"reply":"Để mình đọc"}');
  assert.equal(a.out, '');
  assert.equal(a.s.readsFirst, true);
  assert.equal(run('{"reply":"","reads":[{"tool":"read_page","number":3}]}').out, '');
});

test('ReplyStreamer: reply không phải chuỗi / không có reply ⇒ im lặng (route lùi về câu chuẩn)', () => {
  assert.equal(run('{"reply":null,"actions":[]}').out, '');
  assert.equal(run('{"reply":["a","b"]}').out, '');
  assert.equal(run('chỉ là chữ thường, không JSON').out, '');
});

test('reconcileReply: khớp / thiếu đuôi / lệch', () => {
  assert.deepEqual(reconcileReply('abc', 'abc'), { kind: 'none', text: '' });
  assert.deepEqual(reconcileReply('ab', 'abc'), { kind: 'append', text: 'c' });
  assert.deepEqual(reconcileReply('', 'abc'), { kind: 'append', text: 'abc' });
  assert.deepEqual(reconcileReply('xyz', 'abc'), { kind: 'reset', text: 'abc' });
});

// ─── askWithReads + hooks (model giả, không CSDL: không có vòng đọc) ───

const NO_ACCESS = { projectId: 1, key: 'LFD' } as ProjectAccess;

function hooksLog() {
  const ev: Array<{ t: string; v?: unknown }> = [];
  const ctrl = new AbortController();
  return {
    ev, ctrl,
    hooks: {
      signal: ctrl.signal,
      onProgress: (p: AskProgress) => ev.push({ t: 'progress', v: p }),
      onDelta: (text: string) => ev.push({ t: 'delta', v: text }),
      onReset: () => ev.push({ t: 'reset' }),
    },
    draft() {
      let d = '';
      for (const e of ev) { if (e.t === 'reset') d = ''; if (e.t === 'delta') d += e.v as string; }
      return d;
    },
  };
}

test('askWithReads stream: model giả CÓ stream ⇒ nhiều delta, nối lại = reply; có thinking', async (t) => {
  // 22/10/2026: lượt có tool đọc giữ ~320 ký tự đầu (chống nháy đoạn "để tôi đọc…") ⇒ câu thử phải dài hơn thế.
  const reply = '### Việc gấp\n1. [LFD-75](/w/LFD/issue/75) — **hạn 21/10**\n"trích" 😀\n'.repeat(8);
  const raw = JSON.stringify({ reply, actions: [] });
  _setAskForTests(async (_s, _u, onToken) => {
    for (let i = 0; i < raw.length; i += 7) onToken?.(raw.slice(i, i + 7));
    return raw;
  });
  t.after(() => _setAskForTests(null));
  const h = hooksLog();
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'user', 4000, false, undefined, h.hooks);
  assert.equal(out.reply, reply);
  assert.ok(h.ev.filter((e) => e.t === 'delta').length > 3);
  assert.equal(h.draft(), reply);
  assert.deepEqual(h.ev[0], { t: 'progress', v: { phase: 'thinking', round: 0 } });
});

test('askWithReads stream: model KHÔNG stream ⇒ đúng MỘT delta = cả câu', async (t) => {
  _setAskForTests(async () => '```json\n{"reply":"Câu trả lời đầy đủ","actions":[]}\n```');
  t.after(() => _setAskForTests(null));
  const h = hooksLog();
  await askWithReads(1, NO_ACCESS, 'sys', 'user', 4000, false, undefined, h.hooks);
  assert.deepEqual(h.ev.filter((e) => e.t === 'delta').map((e) => e.v), ['Câu trả lời đầy đủ']);
});

test('askWithReads stream: JSON hỏng phải cứu ⇒ nháp lệch ⇒ reset + câu chuẩn', async (t) => {
  // Model "thử lại" giữa chừng (llmComplete retry): hai lượt chữ dồn vào cùng một luồng.
  const second = '{"reply":"Bản đúng","actions":[]}';
  _setAskForTests(async (_s, _u, onToken) => { onToken?.(`{"reply":"Bản hỏ${'ng '.repeat(150)}`); onToken?.(second); return second; });
  t.after(() => _setAskForTests(null));
  const h = hooksLog();
  await askWithReads(1, NO_ACCESS, 'sys', 'user', 4000, false, undefined, h.hooks);
  assert.ok(h.ev.some((e) => e.t === 'reset'));
  assert.equal(h.draft(), 'Bản đúng');
});

test('askWithReads stream: client đã ngắt ⇒ WORK_AI_CANCELLED, không gọi model', async (t) => {
  let calls = 0;
  _setAskForTests(async () => { calls++; return '{"reply":"x"}'; });
  t.after(() => _setAskForTests(null));
  const h = hooksLog();
  h.ctrl.abort();
  await assert.rejects(askWithReads(1, NO_ACCESS, 'sys', 'user', 4000, false, undefined, h.hooks), (e: { code?: string; statusCode?: number }) => e.code === 'WORK_AI_CANCELLED' && e.statusCode === 499);
  assert.equal(calls, 0);
});

test('askWithReads stream: lượt rỗng ⇒ hỏi lại một lần; hooks KHÔNG truyền ⇒ hành vi cũ', async (t) => {
  const replies = ['{"reply":""}', '{"reply":"Có rồi"}'];
  _setAskForTests(async (_s, _u, onToken) => { const r = replies.shift()!; onToken?.(r); return r; });
  t.after(() => _setAskForTests(null));
  const h = hooksLog();
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'user', 4000, false, undefined, h.hooks);
  assert.equal(out.reply, 'Có rồi');
  assert.equal(out.stats.calls, 2);
  assert.equal(h.draft(), 'Có rồi');
  // Không hooks: vẫn đọc đúng câu (22/10/2026: lượt luôn nhận onToken để gom chữ thô — cần cho "viết tiếp" — nhưng không
  // có sự kiện nào ra ngoài).
  _setAskForTests(async (_s, _u, onToken) => { onToken?.('{"reply":"x"}'); return '{"reply":"x"}'; });
  assert.equal((await askWithReads(1, NO_ACCESS, 'sys', 'user', 4000, false)).reply, 'x');
});

// ─── 4. Trọn đường qua chuỗi cổng GIẢ (22/10/2026) ───

const EP = { root: 'http://rambo.test', key: 'k', local: false, label: 'cong-agent', giaoThuc: 'anthropic' as const };
const kq = (cong: 'rambo' | 'chinh_hang' | 'modelapi', text: string, extra: Record<string, unknown> = {}) => ({ text, model: `m-${cong}`, inputTokens: 1, outputTokens: 1, cong, ...extra });
const tungMau = (o: { onToken?: (d: string) => void }, text: string) => { for (let i = 0; i < text.length; i += 6) o.onToken?.(text.slice(i, i + 6)); };
const PHAN1 = '## Phần 1 — hàm `approve()`\n```java\nboolean approve(Reservation r) {\n  if (r.slot == null) { return false; }\n```\nHàm kiểm tra slot còn trống, rồi ghi';
const PHAN2 = ' bản ghi vào bảng reservation.\n## Phần 2 — test\n- Biên: slot = 0, slot đầy.';
const CAU = PHAN1 + PHAN2;

function chuoiGia(t: { after: (fn: () => void) => void }, p: Parameters<typeof _datCongChoTest>[0]) {
  _setAskForTests(null);
  _boQuaHanMucChoTest(true);
  _datCongChoTest({ chinhHangSanSang: async () => true, baoChinhHangHong: () => {}, ...p });
  t.after(() => { _datCongChoTest(null); _boQuaHanMucChoTest(false); });
}
const resets = (h: ReturnType<typeof hooksLog>) => h.ev.filter((e) => e.t === 'reset').length;

test('chuỗi giả: rambo chết TRƯỚC chữ đầu ⇒ chính hãng trả lời, không reset, nháp = câu (có code `{`)', async (t) => {
  chuoiGia(t, {
    rambo: () => EP, ramboDangNghi: () => false,
    goiRambo: async () => { throw new Error('anthropic stream produced no text'); },
    goiChinhHang: async (o) => { tungMau(o, CAU); return kq('chinh_hang', CAU); },
  });
  const h = hooksLog();
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'Giải thích hàm, code, luồng, test', 16_000, false, undefined, h.hooks);
  assert.equal(out.reply, CAU);
  assert.equal(h.draft(), CAU);
  assert.equal(resets(h), 0);
});

test('chuỗi giả: rambo chết GIỮA CHỪNG ⇒ chính hãng VIẾT TIẾP (lỡ lặp vài chữ) ⇒ nháp nối liền, không reset', async (t) => {
  let tinCH: Array<{ role: string; content: unknown }> = [];
  chuoiGia(t, {
    rambo: () => EP, ramboDangNghi: () => false,
    goiRambo: async (o) => { tungMau(o, PHAN1); throw Object.assign(new Error('anthropic HTTP 502'), { httpStatus: 502 }); },
    goiChinhHang: async (o) => {
      tinCH = o.messages as typeof tinCH;
      const tiep = `slot còn trống, rồi ghi${PHAN2}`; // model lặp lại đuôi phần đã viết
      tungMau(o, tiep);
      return kq('chinh_hang', tiep);
    },
  });
  const h = hooksLog();
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'Câu hỏi gốc', 16_000, false, undefined, h.hooks);
  assert.equal(out.reply, CAU);
  assert.equal(h.draft(), CAU);
  assert.equal(resets(h), 0, 'không reset — chữ đã hiện giữ nguyên');
  assert.deepEqual(tinCH.map((m) => m.role), ['user', 'assistant', 'user']);
  assert.match(String(tinCH[0].content), /Câu hỏi gốc/);
  assert.equal(tinCH[1].content, PHAN1.trimEnd());
  assert.match(String(tinCH[2].content), /Continue it EXACTLY/);
});

test('chuỗi giả: chạm trần độ dài (biCat) ⇒ tự viết tiếp trên cùng cổng, câu đầy đủ, không reset', async (t) => {
  const goi: number[] = [];
  chuoiGia(t, {
    rambo: () => null,
    goiChinhHang: async (o) => {
      goi.push(o.messages.length);
      if (o.messages.length === 1) { tungMau(o, PHAN1); return kq('chinh_hang', PHAN1, { biCat: true }); }
      tungMau(o, PHAN2);
      return kq('chinh_hang', PHAN2);
    },
  });
  const h = hooksLog();
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'hỏi', 16_000, false, undefined, h.hooks);
  assert.deepEqual(goi, [1, 3]);
  assert.equal(out.reply, CAU);
  assert.equal(h.draft(), CAU);
  assert.equal(resets(h), 0);
});

test('chuỗi giả: chạm trần MÃI ⇒ viết tiếp tối đa 3 lần rồi trả phần đã có (không lặp vô hạn, không lỗi)', async (t) => {
  let n = 0;
  chuoiGia(t, { rambo: () => null, goiChinhHang: async (o) => { n++; const x = `đoạn ${n}. `; tungMau(o, x); return kq('chinh_hang', x, { biCat: true }); } });
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'hỏi', 16_000, false, undefined, hooksLog().hooks);
  assert.equal(n, 4);
  assert.equal(out.reply, 'đoạn 1. đoạn 2. đoạn 3. đoạn 4.');
});

test('chuỗi giả: modelapi THỬ LẠI giữa đoạn (onRestart) ⇒ reset rồi nháp đúng bản cuối', async (t) => {
  chuoiGia(t, {
    rambo: () => null, chinhHangSanSang: async () => false,
    goiModelapi: async (o) => { tungMau(o, 'Bản hỏng bị cắt ngang. '.repeat(30)); o.onRestart?.(); tungMau(o, CAU); return kq('modelapi', CAU); },
  });
  const h = hooksLog();
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'hỏi', 16_000, false, undefined, h.hooks);
  assert.equal(out.reply, CAU);
  assert.equal(h.draft(), CAU);
  assert.equal(resets(h), 1);
});

test('chuỗi giả: lượt TOOL đọc (gốc) ⇒ không lộ chữ "để tôi đọc", đọc rồi trả lời; tool không còn ở vòng cuối', async (t) => {
  const thayTools: boolean[] = [];
  const prompts: string[] = [];
  chuoiGia(t, {
    rambo: () => EP, ramboDangNghi: () => false,
    goiRambo: async (o) => {
      thayTools.push(!!o.tools?.length);
      prompts.push(String(o.messages[0].content));
      if (thayTools.length === 1) {
        tungMau(o, 'Tôi cần đọc thêm tài liệu để trả lời chính xác:');
        return kq('rambo', 'Tôi cần đọc thêm tài liệu để trả lời chính xác:', { toolCalls: [{ name: 'read_page', input: { number: 3 } }] });
      }
      tungMau(o, CAU);
      return kq('rambo', `${CAU}\n<ctw-actions>[{"type":"add_comment","number":1,"text":"ok"}]</ctw-actions>`);
    },
  });
  const ev: string[] = [];
  let draft = '';
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'hỏi', 16_000, false, undefined, {
    onDelta: (d) => { ev.push('delta'); draft += d; }, onReset: () => { ev.push('reset'); draft = ''; },
  });
  assert.deepEqual(thayTools, [true, true]);
  assert.match(prompts[1], /project documents are not available here/);
  assert.equal(out.reply, CAU);
  assert.deepEqual(out.actions, [{ type: 'add_comment', number: 1, text: 'ok' }]);
  assert.equal(draft, CAU);
  assert.ok(!ev.includes('reset'), 'đoạn dẫn trước tool call bị giữ lại, không nháy rồi xoá');
});

test('chuỗi giả: trả lời cũ kiểu "Markdown + {reply: above}" ⇒ giữ câu trả lời thật', async (t) => {
  const raw = `${CAU}\n\n\`\`\`json\n{"reply":"above","actions":[]}\n\`\`\``;
  chuoiGia(t, { rambo: () => null, goiChinhHang: async (o) => { tungMau(o, raw); return kq('chinh_hang', raw); } });
  const h = hooksLog();
  const out = await askWithReads(1, NO_ACCESS, 'sys', 'hỏi', 16_000, false, undefined, h.hooks);
  assert.equal(out.reply, CAU);
  assert.equal(h.draft(), CAU);
  assert.ok(!/above/.test(h.ev.map((e) => String(e.v ?? '')).join('')));
});

test('chuỗi giả: mọi bậc đều chết ⇒ lỗi của bậc cuối (không nuốt lỗi, không lưu câu rỗng)', async (t) => {
  chuoiGia(t, {
    rambo: () => EP, ramboDangNghi: () => false,
    goiRambo: async () => { throw new Error('rambo chết'); },
    goiChinhHang: async () => { throw new Error('chính hãng chết'); },
    goiModelapi: async () => { throw new Error('modelapi chết'); },
  });
  await assert.rejects(askWithReads(1, NO_ACCESS, 'sys', 'hỏi', 16_000, false, undefined, hooksLog().hooks), /modelapi chết/);
});
