/**
 * /compact chủ động (compactChuDong.ts, 03/10/2026). `fetch` giả — không gọi cổng thật.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { CompactLoi, chuanHoaTin, compactChuDong, diemCat } from './compactChuDong.js';
import type { AgentMessage } from './turn.js';

function luot(i: number): AgentMessage[] {
  return [
    { role: 'user', content: i === 0 ? 'ĐỀ BÀI: viết lệnh /compact, đừng đụng frontend/about' : `câu ${i}` },
    { role: 'assistant', content: null, tool_calls: [{ id: `k${i}`, type: 'function', function: { name: 'read_file', arguments: `{"path":"g${i}.ts"}` } }] },
    { role: 'tool', tool_call_id: `k${i}`, content: `nội dung g${i}` },
    { role: 'assistant', content: `xong câu ${i}` },
  ] as AgentMessage[];
}

const goc = fetch;
let soLanGoi = 0;
let thanCuoi = '';
function giaLap(traLoi: string | null): void {
  globalThis.fetch = (async (_u: unknown, init?: { body?: string }) => {
    soLanGoi++;
    thanCuoi = (JSON.parse(init?.body ?? '{}') as { messages: Array<{ content: string }> }).messages[1]!.content;
    if (traLoi === null) return new Response('lỗi', { status: 503 });
    return new Response(JSON.stringify({ choices: [{ message: { content: traLoi } }] }), { status: 200 });
  }) as typeof fetch;
}

test('diemCat: giữ N lượt cuối, cắt đúng ĐẦU lượt (không làm mồ côi tool_call)', () => {
  const ds = Array.from({ length: 5 }, (_, i) => luot(i)).flat();
  assert.equal(diemCat(ds, 2), 12); // 3 lượt đầu × 4 tin
  assert.equal(ds[12]!.role, 'user');
  assert.equal(diemCat(ds, 5), 0, 'không đủ lượt ⇒ không gộp gì');
});

test('gộp phần cũ, giữ 2 lượt cuối; lời dặn đi vào prompt', async () => {
  const ds = Array.from({ length: 6 }, (_, i) => luot(i + 100)).flat();
  giaLap('- Mục tiêu: viết /compact\n- Ràng buộc: đừng đụng frontend/about\n- Đã đọc g100..g103');
  soLanGoi = 0;
  const kq = await compactChuDong(ds, { ghiChu: 'giữ tên file đã sửa' });
  assert.equal(kq.soTinDaGop, 16);
  assert.equal(kq.soLuotDaGop, 4);
  assert.match(kq.tomTat ?? '', /compact/);
  assert.equal(soLanGoi, 1);
  assert.match(thanCuoi, /NGƯỜI DÙNG DẶN KHI TÓM TẮT.*giữ tên file đã sửa/);
  globalThis.fetch = goc;
});

test('hội thoại ngắn ⇒ không gọi model, soTinDaGop = 0', async () => {
  giaLap('không được gọi');
  soLanGoi = 0;
  const kq = await compactChuDong(luot(7), {});
  assert.equal(kq.soTinDaGop, 0);
  assert.equal(kq.tomTat, null);
  assert.equal(soLanGoi, 0);
  globalThis.fetch = goc;
});

test('cổng hỏng ⇒ CompactLoi 502, KHÔNG trả bản tóm tắt rỗng', async () => {
  const ds = Array.from({ length: 5 }, (_, i) => luot(i + 300)).flat();
  giaLap(null);
  await assert.rejects(compactChuDong(ds), (e: unknown) => e instanceof CompactLoi && e.status === 502);
  globalThis.fetch = goc;
});

test('chuanHoaTin: bỏ tin sai hình dạng, ảnh thành [ảnh], không ném', () => {
  const ra = chuanHoaTin([
    { role: 'user', content: [{ type: 'text', text: 'xem ảnh' }, { type: 'image_url', image_url: { url: 'data:x' } }] },
    { role: 'assistant', content: null, tool_calls: [{ id: 'a', function: { name: 'x' } }] },
    { role: 'tool', content: 'thiếu id' },
    'rác',
    { role: 'system', content: 'không nhận' },
  ]);
  assert.equal(ra.length, 2);
  assert.equal(ra[0]!.content, 'xem ảnh\n[ảnh]');
  assert.equal((ra[1] as { tool_calls?: unknown[] }).tool_calls, undefined);
  assert.throws(() => chuanHoaTin('không phải mảng'), CompactLoi);
});
