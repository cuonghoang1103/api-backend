/**
 * Hội thoại RẤT DÀI phải được CẮT BỚT, không được chặn.
 *
 * Người dùng gặp thật 15/09/2026: AI Code đang làm dở một việc còn ~26 bước
 * thì dừng hẳn với `messages quá lớn (1001)`. Trớ trêu là `catCu.ts` được viết
 * ra đúng để tránh chuyện đó ("người dùng đang làm dở một việc 40 bước bỗng bị
 * chặn hẳn và mất luôn mạch") — nhưng một trần cứng ở `sanitizeIncoming` đứng
 * chặn TRƯỚC, nên cơ chế cắt không bao giờ chạy tới.
 *
 * ⚠️ Và trần đó cũng không chặn được thứ nó nói là chặn: kẻ xấu gửi 999 tin
 * nhắn mỗi cái 1MB vẫn lọt. Thứ chặn payload là giới hạn kích thước THÂN yêu
 * cầu, không phải số phần tử mảng.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { sanitizeIncoming } from './turn.js';

/** Một lượt đầy đủ: người hỏi → model gọi tool → kết quả tool. */
function luot(i: number) {
  return [
    { role: 'user', content: `câu hỏi ${i}` },
    { role: 'assistant', content: null, tool_calls: [{ id: `c${i}`, type: 'function', function: { name: 'read_file', arguments: '{}' } }] },
    { role: 'tool', tool_call_id: `c${i}`, content: `kết quả ${i}` },
  ];
}

test('1001 tin nhắn KHÔNG ném — cắt bớt rồi đi tiếp', () => {
  const ds = Array.from({ length: 400 }, (_, i) => luot(i)).flat();   // 1.200 tin nhắn
  assert.doesNotThrow(() => sanitizeIncoming(ds));
  const ra = sanitizeIncoming(ds);
  assert.ok(ra.length > 0, 'cắt sạch thành rỗng còn tệ hơn chặn');
});

test('giữ phần MỚI NHẤT, bỏ phần cũ', () => {
  const ds = Array.from({ length: 400 }, (_, i) => luot(i)).flat();
  const ra = sanitizeIncoming(ds);
  const chu = JSON.stringify(ra);
  // Lượt cuối phải còn; lượt đầu thì không.
  assert.ok(chu.includes('câu hỏi 399'), 'mất lượt mới nhất — agent quên việc đang làm');
  assert.ok(!chu.includes('câu hỏi 0"'), 'vẫn giữ lượt cũ nhất, tức chưa cắt gì');
});

test('KHÔNG để lại tin nhắn tool MỒ CÔI ở đầu', () => {
  /* ⛔ Giao thức đòi mỗi `tool_calls` có đúng một tin nhắn `tool` mang đúng
     `tool_call_id`. Cắt trúng giữa một lượt là để lại một `tool` không có ai
     gọi nó, và cổng từ chối CẢ LƯỢT bằng một lỗi không nói rõ thiếu ở đâu —
     tức người dùng đổi một lỗi rõ ràng lấy một lỗi khó hiểu hơn. */
  const ds = Array.from({ length: 400 }, (_, i) => luot(i)).flat();
  const ra = sanitizeIncoming(ds);
  assert.equal(ra[0]?.role, 'user', `bắt đầu bằng "${ra[0]?.role}" — phải là "user"`);
});

test('hội thoại ngắn thì không đụng gì', () => {
  const ds = [...luot(1), ...luot(2)];
  assert.equal(sanitizeIncoming(ds).length, ds.length);
});

test('mảng rỗng vẫn ném — đó là lỗi thật của client', () => {
  assert.throws(() => sanitizeIncoming([]));
  assert.throws(() => sanitizeIncoming('không phải mảng'));
});
