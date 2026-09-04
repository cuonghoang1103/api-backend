/**
 * KỸ NĂNG — canh chuỗi nối từ app tới prompt.
 *
 * Chốt cuối cùng trong file này canh đúng chỗ vừa hở khi làm tính năng: kiểu
 * `kyNang` đã khai trong `turn.ts` nhưng KHÔNG được truyền vào
 * `buildSystemPrompt`. TypeScript sạch, không lỗi ở tầng nào, và danh sách kỹ
 * năng đơn giản là không bao giờ tới model — đúng loại hỏng phải chạy mới biết.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSystemPrompt } from './prompt.js';
import { toolsForGateway, ALL_CAPABILITIES } from './tools.js';

test('prompt liệt kê tên + mô tả kỹ năng', () => {
  const p = buildSystemPrompt({
    capabilities: ['fs_read', 'ky_nang'],
    kyNang: [{ ten: 'ra-de', moTa: 'Soạn đề thi 50 câu song ngữ' }],
  });
  assert.match(p, /KỸ NĂNG CỦA DỰ ÁN/);
  assert.match(p, /ra-de/);
  assert.match(p, /Soạn đề thi 50 câu song ngữ/);
  assert.match(p, /dung_ky_nang/, 'phải nói cách LẤY thân, không chỉ liệt kê tên');
});

test('không có kỹ năng ⇒ KHÔNG có mục nào trong prompt', () => {
  const p = buildSystemPrompt({ capabilities: ['fs_read'] });
  assert.ok(!p.includes('KỸ NĂNG CỦA DỰ ÁN'),
    'mục rỗng vẫn tốn token ở mọi lượt của mọi dự án không dùng kỹ năng');
});

test('tool `dung_ky_nang` CHỈ xuất hiện khi có capability ky_nang', () => {
  const co = toolsForGateway(['fs_read', 'ky_nang'], []).map((t: any) => t.function.name);
  const khong = toolsForGateway(['fs_read'], []).map((t: any) => t.function.name);
  assert.ok(co.includes('dung_ky_nang'));
  assert.ok(!khong.includes('dung_ky_nang'),
    'app cũ không chạy được tool này — gửi xuống là model gọi rồi nhận lỗi ở mọi lần');
});

test('ky_nang có trong ALL_CAPABILITIES', () => {
  /* Thiếu ở đây thì `parseCapabilities` VỨT ÂM THẦM: app gửi đúng, máy chủ
     không gửi tool xuống, model lịch sự nói "tôi không có tool đó". Đã dính
     đúng vậy với `browser` ngày 19/08/2026. */
  assert.ok((ALL_CAPABILITIES as readonly string[]).includes('ky_nang'));
});

test('turn.ts THẬT SỰ truyền kyNang vào buildSystemPrompt', () => {
  const nguon = readFileSync(join(import.meta.dirname, 'turn.ts'), 'utf8');
  const i = nguon.indexOf('buildSystemPrompt({');
  const j = nguon.indexOf('});', i);
  assert.ok(i > 0 && j > i);
  assert.match(nguon.slice(i, j), /kyNang/,
    'khai kiểu mà quên truyền ⇒ tsc sạch, không lỗi, danh sách không tới model');
});
