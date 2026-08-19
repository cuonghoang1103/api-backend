/**
 * Hai chuyện khác nhau, người dùng gặp cùng lúc 19/08/2026 và dễ lẫn:
 *
 *  1. TẮT nút "Chạy lệnh" ⇒ `run_command` bị lọc BỎ HẲN khỏi danh sách tool.
 *     Agent nói "tôi không có công cụ đó" là ĐÚNG SỰ THẬT.
 *  2. BẬT nút rồi thì nó VẪN từ chối việc cần mạng — vì mô tả tool và prompt
 *     dặn thẳng "đừng tải gì từ Internet". Đó mới là lỗi: `curl`/`ssh` không
 *     hề bị cấm, chúng chỉ phải xin duyệt (`lenh.ts` xếp 'nguyhiem' =
 *     luôn hỏi + không được nhớ, KHÔNG phải chặn).
 *
 * Sửa (2) mà không kiểm thì lần sau ai đó thấy dòng "ra mạng được" trong
 * prompt sẽ tưởng là lỗ hổng và xoá đi.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import { buildSystemPrompt } from './prompt.js';
import { toolsForGateway } from './tools.js';

const tenTool = (caps: any[]) => toolsForGateway(caps).map((t) => t.function.name);

test('TẮT quyền shell ⇒ run_command KHÔNG được gửi cho model', () => {
  assert.ok(!tenTool(['fs_read']).includes('run_command'));
});

test('BẬT quyền shell ⇒ run_command có mặt', () => {
  assert.ok(tenTool(['fs_read', 'shell']).includes('run_command'));
});

test('mô tả run_command KHÔNG được cấm dùng mạng', () => {
  const mo = toolsForGateway(['fs_read', 'shell'] as any)
    .find((t) => t.function.name === 'run_command')!.function.description;
  assert.ok(
    !/tải gì từ Internet|không .{0,12}(ra )?mạng/i.test(mo),
    `mô tả đang cấm dùng mạng ⇒ model sẽ từ chối oan:\n${mo}`,
  );
  assert.match(mo, /curl/i, 'mô tả phải nói rõ curl chạy được, nếu không model tự cho là không');
});

test('prompt nói rõ agent RA ĐƯỢC MẠNG (khi đã bật shell)', () => {
  const p = buildSystemPrompt({ capabilities: ['fs_read', 'shell'] as never });
  assert.match(p, /RA ĐƯỢC MẠNG/);
  assert.ok(
    !/ĐỪNG chạy:[^\n]*Internet/.test(p),
    'prompt vẫn còn dòng cấm Internet trong danh sách ĐỪNG chạy',
  );
});
