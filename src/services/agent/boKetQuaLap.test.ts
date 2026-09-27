import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boKetQuaLap } from './turn.js';

const dai = 'x'.repeat(1200);
test('kết quả tool giống hệt bản trước bị thay bằng dòng trỏ về', () => {
  const ra = boKetQuaLap([
    { role: 'user', content: 'đọc' },
    { role: 'tool', tool_call_id: 'a', content: dai },
    { role: 'tool', tool_call_id: 'b', content: 'ngắn' },
    { role: 'tool', tool_call_id: 'c', content: dai },
  ] as never);
  assert.equal((ra[1] as any).content, dai);
  assert.equal((ra[2] as any).content, 'ngắn');
  assert.match((ra[3] as any).content, /GIỐNG HỆT kết quả tool thứ 1/);
  assert.equal((ra[3] as any).tool_call_id, 'c', 'giữ nguyên tool_call_id để giao thức không vỡ');
});
test('kết quả ngắn, khác nhau hoặc có ảnh thì giữ nguyên', () => {
  const ra = boKetQuaLap([
    { role: 'tool', tool_call_id: 'a', content: dai },
    { role: 'tool', tool_call_id: 'b', content: dai + 'y' },
    { role: 'tool', tool_call_id: 'c', content: dai, anh: [{ media_type: 'image/png', data: 'AA' }] },
  ] as never);
  assert.equal((ra[1] as any).content, dai + 'y');
  assert.equal((ra[2] as any).content, dai);
});
