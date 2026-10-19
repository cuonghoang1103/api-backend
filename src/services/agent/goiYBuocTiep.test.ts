/**
 * Đợt 8A — gợi ý bước tiếp (`goiYBuocTiep.ts` + `turn.ts`).
 *   npx tsx --test src/services/agent/goiYBuocTiep.test.ts
 */
import assert from 'node:assert/strict';
import test from 'node:test';

const { LocLuongGoiY, tachGoiY, LUAT_GOI_Y } = await import('./goiYBuocTiep.js');

test('tách khối gợi ý: 1–3 dòng sạch, chữ chính không còn khối', () => {
  const r = tachGoiY('Đã sửa xong lỗi đăng nhập.\n\n<goi-y>\n- Chạy npm test\n2. "Chuyển LF-18 sang Review"\nLog 1 giờ cho LF-18\nThừa dòng 4\n</goi-y>');
  assert.equal(r.chu, 'Đã sửa xong lỗi đăng nhập.');
  assert.deepEqual(r.goiY, ['Chạy npm test', 'Chuyển LF-18 sang Review', 'Log 1 giờ cho LF-18']);
  assert.deepEqual(tachGoiY('Chào bạn!'), { chu: 'Chào bạn!', goiY: [] });
  assert.deepEqual(tachGoiY('Xong.\n<goi-y>\nViết test').goiY, ['Viết test'], 'thiếu thẻ đóng vẫn nhận');
});

test('lọc luồng: thẻ bị chia nhiều mẩu không lọt ra; "<" thường vẫn hiện', () => {
  const l = new LocLuongGoiY();
  const manh = ['Xong rồi. a < b đúng.', '\n\n<go', 'i-', 'y>\nChạy test\n</goi-y>'];
  const ra = manh.map((m) => l.day(m)).join('') + l.xong();
  assert.equal(ra, 'Xong rồi. a < b đúng.');
  const l2 = new LocLuongGoiY();
  assert.equal(l2.day('x <g') + l2.xong(), 'x <g', 'đuôi giữ lại được nhả khi hết luồng');
  assert.match(LUAT_GOI_Y, /CT Work/);
});

test('runAgentTurn: chữ chảy không có khối, done mang goiY, hội thoại lưu không có khối', async (t) => {
  const { runAgentTurn } = await import('./turn.js');
  const luu = ['LLM_GATEWAY_API_KEY', 'LLM_GATEWAY_API_KEY_GPT', 'LLM_GATEWAY_BASE_URL', 'AGENT_GATEWAY_BASE_URL', 'AGENT_GATEWAY_API_KEY'].map((k) => [k, process.env[k]] as const);
  process.env.LLM_GATEWAY_API_KEY = 'sk-gia-lap-cho-kiem-thu';
  process.env.LLM_GATEWAY_API_KEY_GPT = 'sk-gia-lap-cho-kiem-thu';
  process.env.LLM_GATEWAY_BASE_URL = 'https://vi-du.test/v1';
  delete process.env.AGENT_GATEWAY_BASE_URL; delete process.env.AGENT_GATEWAY_API_KEY;
  const goc = globalThis.fetch;
  let system = '';
  globalThis.fetch = (async (_u: unknown, init: { body?: string }) => {
    const b = JSON.parse(String(init?.body ?? '{}'));
    system = JSON.stringify(b.messages?.[0] ?? '');
    const enc = new TextEncoder();
    const manh = ['Đã sửa file a.ts.', '\n\n<go', 'i-y>\nChạy npm test\nChuyển LF-18 sang Review\n</goi-y>'];
    return new Response(new ReadableStream({ start(c) {
      for (const m of manh) c.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: m } }] })}\n\n`));
      c.enqueue(enc.encode(`data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 20 } })}\n\n`));
      c.enqueue(enc.encode('data: [DONE]\n\n')); c.close();
    } }), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  }) as typeof fetch;
  t.after(() => { globalThis.fetch = goc; for (const [k, v] of luu) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } });
  const sk: any[] = [];
  await runAgentTurn({ userId: 1, messages: [{ role: 'user', content: 'sửa a.ts' }], capabilities: ['fs_read'], model: 'cm-solid' } as any, (e) => sk.push(e), new AbortController().signal);
  assert.match(system, /GỢI Ý BƯỚC TIẾP/, 'luật nằm trong prompt hệ thống');
  const chu = sk.filter((e) => e.type === 'text').map((e) => e.delta).join('');
  assert.equal(chu, 'Đã sửa file a.ts.');
  const done = sk.find((e) => e.type === 'done');
  assert.deepEqual(done.goiY, ['Chạy npm test', 'Chuyển LF-18 sang Review']);
  assert.equal(done.append.at(-1).content, 'Đã sửa file a.ts.');
});

test('QA 9.2: khối giữa câu, nhiều khối, thẻ trong mã — luồng và hội thoại lưu KHỚP nhau', () => {
  const ca: Array<[string, string, string[]]> = [
    ['Phần đầu.\n\n<goi-y>\nGiữa câu\n</goi-y>\n\nPhần SAU khối vẫn hiện.', 'Phần đầu.\n\nPhần SAU khối vẫn hiện.', ['Giữa câu']],
    ['Hai khối.\n<goi-y>\nKhối 1\n</goi-y>\nGiữa hai khối.\n<goi-y>\nKhối 2\n</goi-y>', 'Hai khối.\nGiữa hai khối.', ['Khối 2']],
    ["Mã:\n```ts\nconst THE_MO = '<goi-y>';\n<goi-y>\nconst x = 1;\n```\nHết mã.", "Mã:\n```ts\nconst THE_MO = '<goi-y>';\n<goi-y>\nconst x = 1;\n```\nHết mã.", []],
    ['Nhắc thẻ <goi-y> giữa câu thì giữ nguyên.', 'Nhắc thẻ <goi-y> giữa câu thì giữ nguyên.', []],
    ['Xong. <goi-y>\nCùng dòng nhưng xuống dòng sau thẻ\n</goi-y>', 'Xong.', ['Cùng dòng nhưng xuống dòng sau thẻ']],
    ['Trả lời 4.\n\n<goi-y>\nGợi ý không đóng 1\nGợi ý không đóng 2', 'Trả lời 4.', ['Gợi ý không đóng 1', 'Gợi ý không đóng 2']],
    ['Chỉ có chữ.', 'Chỉ có chữ.', []],
  ];
  for (const [vao, chu, goiY] of ca) {
    const r = tachGoiY(vao);
    assert.equal(r.chu, chu, vao);
    assert.deepEqual(r.goiY, goiY, vao);
    /* Luồng: chia mọi kiểu (từng ký tự, mẩu 3, mẩu 7) ⇒ đúng chữ của hội thoại lưu (bỏ khoảng trắng cuối). */
    for (const n of [1, 3, 7]) {
      const l = new LocLuongGoiY();
      let ra = '';
      for (let i = 0; i < vao.length; i += n) ra += l.day(vao.slice(i, i + n));
      ra += l.xong();
      assert.equal(ra.replace(/\s+$/, ''), chu.replace(/\s+$/, ''), `luồng mẩu ${n}: ${vao}`);
      if (!/^<goi-y>$/m.test(chu)) assert.doesNotMatch(ra, /^<goi-y>$/m, 'không lộ thẻ khối');
    }
  }
});
