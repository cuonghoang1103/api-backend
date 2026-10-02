/**
 * Ghi nhớ lượt bị cắt (tomTatLuotCu.ts, 02/10/2026): ghim đề bài + tóm tắt có đệm.
 * `fetch` được giả lập — không gọi cổng thật.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { ghiNhoLuotDaBo } from './tomTatLuotCu.js';
import { loiNhacDaCat } from './catCu.js';
import type { AgentMessage } from './turn.js';

function luot(i: number): AgentMessage[] {
  return [
    { role: 'user', content: i === 0 ? 'ĐỀ BÀI: dựng trang studio, đừng sửa file globals.css' : `câu hỏi ${i}` },
    { role: 'assistant', content: null, tool_calls: [{ id: `c${i}`, type: 'function', function: { name: 'read_file', arguments: `{"path":"f${i}.ts"}` } }] },
    { role: 'tool', tool_call_id: `c${i}`, content: `kết quả ${i}` },
  ] as AgentMessage[];
}

const goc = fetch;
let soLanGoi = 0;
let dauVaoCuoi = '';
function giaLap(traLoi: string | null) {
  globalThis.fetch = (async (_u: unknown, init?: { body?: string }) => {
    soLanGoi++;
    const body = JSON.parse(init?.body ?? '{}') as { messages: Array<{ content: string }> };
    dauVaoCuoi = body.messages[1]!.content;
    if (traLoi === null) return new Response('lỗi', { status: 503 });
    return new Response(JSON.stringify({ choices: [{ message: { content: traLoi } }] }), { status: 200 });
  }) as typeof fetch;
}

test('ghim đề bài + tóm tắt; lần sau trúng đệm (0 lời gọi)', async () => {
  const ds = Array.from({ length: 6 }, (_, i) => luot(i)).flat();
  giaLap('- Mục tiêu: dựng trang studio\n- Ràng buộc: đừng sửa globals.css\n- Đã đọc f0..f2');
  soLanGoi = 0;
  const a = await ghiNhoLuotDaBo(ds, 9); // bỏ 3 lượt đầu (9 tin nhắn), giữ 3 lượt cuối
  assert.equal(a.deBai, 'ĐỀ BÀI: dựng trang studio, đừng sửa file globals.css');
  assert.match(a.tomTat ?? '', /globals\.css/);
  assert.equal(a.daGoiModel, true);
  assert.equal(soLanGoi, 1);

  const b = await ghiNhoLuotDaBo(ds, 9);
  assert.equal(b.daGoiModel, false, 'cùng phần bị bỏ ⇒ dùng đệm');
  assert.equal(soLanGoi, 1);
  globalThis.fetch = goc;
});

test('bỏ thêm lượt ⇒ chỉ tóm tắt PHẦN THÊM, kèm bản cũ', async () => {
  // Dữ liệu KHÁC test 1 — đệm dùng chung trong tiến trình, trùng nội dung là trúng đệm.
  const ds = Array.from({ length: 8 }, (_, i) => luot(i + 50)).flat();
  giaLap('- Mục tiêu: dựng trang studio (bản gộp đủ dài để qua ngưỡng tối thiểu)');
  soLanGoi = 0;
  await ghiNhoLuotDaBo(ds, ds.length - 9);          // bỏ 3 lượt
  await ghiNhoLuotDaBo(ds, ds.length - 12);         // bỏ 4 lượt
  assert.equal(soLanGoi, 2);
  assert.match(dauVaoCuoi, /BẢN TÓM TẮT ĐÃ CÓ/);
  assert.match(dauVaoCuoi, /câu hỏi 53/);
  assert.doesNotMatch(dauVaoCuoi, /câu hỏi 51\b/, 'không đọc lại lượt đã tóm tắt');
  globalThis.fetch = goc;
});

test('cổng hỏng ⇒ KHÔNG ném, vẫn ghim đề bài', async () => {
  const ds = Array.from({ length: 12 }, (_, i) => luot(i + 100)).flat();
  ds[0] = { role: 'user', content: 'đề bài khác' } as AgentMessage;
  giaLap(null);
  const r = await ghiNhoLuotDaBo(ds, 9);
  assert.equal(r.deBai, 'đề bài khác');
  assert.equal(r.tomTat, null);
  globalThis.fetch = goc;
});

test('lời nhắc chứa đề bài và tóm tắt; không có ghi nhớ vẫn như cũ', () => {
  const m = loiNhacDaCat(3, { deBai: 'ĐỀ X', tomTat: '- đã làm Y' });
  assert.match(String(m.content), /YÊU CẦU GỐC[\s\S]*ĐỀ X/);
  assert.match(String(m.content), /TÓM TẮT PHẦN ĐÃ BỎ[\s\S]*đã làm Y/);
  const cu = loiNhacDaCat(2);
  assert.match(String(cu.content), /2 lượt hỏi đáp cũ nhất/);
  assert.doesNotMatch(String(cu.content), /YÊU CẦU GỐC/);
});
