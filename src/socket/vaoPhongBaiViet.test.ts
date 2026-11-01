/**
 * Trần phòng `post:<id>` tính theo MỖI SOCKET (vá 01/11/2026).
 *   npx tsx --test src/socket/vaoPhongBaiViet.test.ts
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { vaoPhongBaiViet } from './messaging.socket.js';

const taoSocket = (...sanCo: string[]) => {
  const rooms = new Set<string>(sanCo);
  return { rooms, join: (r: string) => void rooms.add(r) };
};
const demPost = (s: { rooms: Set<string> }) => [...s.rooms].filter((r) => r.startsWith('post:')).length;

test('gọi lặp 10 lượt × 400 id không vượt trần 500 (trước bản vá: 4.000 phòng)', () => {
  const s = taoSocket('socket-id', 'user:1', 'thread:9');
  for (let lan = 0; lan < 10; lan++) {
    vaoPhongBaiViet(s, Array.from({ length: 400 }, (_, i) => lan * 400 + i + 1), 500);
  }
  assert.equal(demPost(s), 500);
  assert.ok(s.rooms.has('user:1') && s.rooms.has('thread:9'), 'phòng không phải post: giữ nguyên, không tính vào trần');
});

test('phòng đã vào không chiếm thêm suất; id rác bị bỏ qua', () => {
  const s = taoSocket('post:7');
  assert.equal(vaoPhongBaiViet(s, [7, 7, 8, 'x', -1, 1.5, 0], 2), 2);
  assert.deepEqual([...s.rooms].sort(), ['post:7', 'post:8']);
  assert.equal(vaoPhongBaiViet(s, 9, 2), 2, 'đã đủ trần thì id đơn lẻ cũng không vào');
});
