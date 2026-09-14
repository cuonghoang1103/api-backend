/**
 * Nén ngữ cảnh — thứ quyết định giá của một việc.
 *
 * Viết 15/09/2026 sau khi tìm ra một lỗ chảy tiền không có phép kiểm nào gác:
 * kết quả tool bị lược thì phần CHỮ co còn 180 ký tự, nhưng tấm ẢNH kèm theo
 * vẫn được gửi lại ở mọi lượt sau. Sổ `kyTuDaCat` chỉ đếm ký tự nên nó vẫn báo
 * "đã tiết kiệm" trong khi phần đắt nhất chưa hề bị đụng tới.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { nenNguCanh } from './compact.js';
import type { AgentMessage } from './turn.js';

/** Một lượt gọi tool đầy đủ: model gọi → kết quả trả về. */
function luot(i: number, dai = 4000, anh = false): AgentMessage[] {
  return [
    { role: 'assistant', content: null, tool_calls: [{ id: `c${i}`, type: 'function', function: { name: 'read_file', arguments: '{}' } }] },
    {
      role: 'tool',
      tool_call_id: `c${i}`,
      content: 'x'.repeat(dai),
      ...(anh ? { anh: [{ media_type: 'image/png', data: 'A'.repeat(200_000) }] } : {}),
    },
  ] as AgentMessage[];
}

test('ít lượt thì không nén gì', () => {
  const ds = [{ role: 'user', content: 'chào' } as AgentMessage, ...Array.from({ length: 3 }, (_, i) => luot(i)).flat()];
  const kq = nenNguCanh(ds);
  assert.equal(kq.soDaLuoc, 0);
  assert.equal(kq.kyTuDaCat, 0);
});

test('nhiều lượt thì kết quả CŨ bị lược, kết quả gần nhất giữ nguyên văn', () => {
  const ds = [{ role: 'user', content: 'chào' } as AgentMessage, ...Array.from({ length: 20 }, (_, i) => luot(i)).flat()];
  const kq = nenNguCanh(ds);
  assert.ok(kq.soDaLuoc > 0, 'phải lược được cái gì đó');

  const tool = kq.messages.filter((m) => m.role === 'tool') as Array<{ content: string }>;
  // Cái CUỐI là cái gần hiện tại nhất — nó phải còn nguyên.
  assert.equal(tool[tool.length - 1].content.length, 4000);
  // Cái ĐẦU là cũ nhất — phải bị lược.
  assert.ok(tool[0].content.includes('đã được lược bớt'));
});

test('KHÔNG bao giờ xoá hẳn một tin nhắn role:tool', () => {
  // Giao thức đòi mỗi tool_call có đúng một tin trả lời mang đúng id. Thiếu
  // một cái là cổng từ chối CẢ LƯỢT với lỗi không nói rõ thiếu ở đâu.
  const ds = [...Array.from({ length: 20 }, (_, i) => luot(i)).flat()];
  const kq = nenNguCanh(ds);
  const idVao = ds.filter((m) => m.role === 'tool').map((m) => (m as { tool_call_id: string }).tool_call_id);
  const idRa = kq.messages.filter((m) => m.role === 'tool').map((m) => (m as { tool_call_id: string }).tool_call_id);
  assert.deepEqual(idRa, idVao);
});

test('ẢNH kèm kết quả tool CŨ bị gỡ, không chỉ cắt chữ', () => {
  // Đây là lỗ đã chảy tiền: `...m` chở nguyên `anh` qua bước nén.
  const ds = [...Array.from({ length: 20 }, (_, i) => luot(i, 4000, i % 4 === 0)).flat()];
  const kq = nenNguCanh(ds);
  const tool = kq.messages.filter((m) => m.role === 'tool') as Array<{ content: string; anh?: unknown[] }>;

  const cuNhatCoAnh = tool[0];
  assert.equal(cuNhatCoAnh.anh, undefined, 'ảnh của kết quả cũ phải bị gỡ');
  assert.ok(cuNhatCoAnh.content.includes('ảnh đã được gỡ'), 'phải nói rõ với model là ảnh đã bị gỡ');

  // Tổng dung lượng ảnh còn lại phải nhỏ — chỉ những kết quả gần nhất.
  const conAnh = tool.filter((t) => Array.isArray(t.anh) && t.anh.length > 0).length;
  assert.ok(conAnh <= 2, `còn ${conAnh} kết quả mang ảnh — phải ≤ 2`);
});

test('ảnh của người dùng: chỉ giữ tấm của lượt GẦN NHẤT', () => {
  const anh = { type: 'image_url' as const, image_url: { url: 'data:image/png;base64,AAAA' } };
  const ds: AgentMessage[] = [
    { role: 'user', content: [{ type: 'text', text: 'ảnh 1' }, anh] },
    { role: 'assistant', content: 'đã xem' },
    { role: 'user', content: [{ type: 'text', text: 'ảnh 2' }, anh] },
  ];
  const kq = nenNguCanh(ds);
  const u = kq.messages.filter((m) => m.role === 'user') as Array<{ content: unknown[] }>;
  assert.ok(!JSON.stringify(u[0].content).includes('image_url'), 'ảnh cũ phải bị gỡ');
  assert.ok(JSON.stringify(u[1].content).includes('image_url'), 'ảnh mới nhất phải còn');
});
