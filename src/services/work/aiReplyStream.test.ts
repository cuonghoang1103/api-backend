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
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { ReplyStreamer, reconcileReply } from './aiReplyStream.js';
import { askWithReads, _setAskForTests, type AskProgress } from './ai.service.js';
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
  const reply = '### Việc gấp\n1. [LFD-75](/w/LFD/issue/75) — **hạn 21/10**\n"trích" 😀';
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
  _setAskForTests(async (_s, _u, onToken) => { onToken?.('{"reply":"Bản hỏ'); onToken?.(second); return second; });
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
  // Không hooks: hàm giả nhận onToken = undefined.
  let got: unknown = 'chưa gọi';
  _setAskForTests(async (_s, _u, onToken) => { got = onToken; return '{"reply":"x"}'; });
  await askWithReads(1, NO_ACCESS, 'sys', 'user', 4000, false);
  assert.equal(got, undefined);
});
