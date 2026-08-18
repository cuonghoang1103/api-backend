import { describe, expect, it } from 'vitest';

import { chuChoMayDoc } from './loiNoi';

describe('chuChoMayDoc', () => {
  // Chữ THẬT model trả về 18/08/2026 — gạch đầu dòng nằm ĐẦU DÒNG, không phải
  // giữa dòng như bản kiểm đầu tiên tôi viết. Viết sai hình dạng đầu vào thì
  // phép kiểm ép mã phải bóc mọi dấu `-`, và cái giá là ca ngay dưới.
  it('bóc đậm và gạch đầu dòng mà KHÔNG nuốt chữ', () => {
    expect(chuChoMayDoc('Tôi giúp bạn:\n- **Lập trình & phát triển** web'))
      .toBe('Tôi giúp bạn: Lập trình & phát triển web');
  });

  it('KHÔNG đụng tới dấu gạch NGANG giữa câu', () => {
    expect(chuChoMayDoc('Dịch Việt - Anh giúp mình')).toBe('Dịch Việt - Anh giúp mình');
    expect(chuChoMayDoc('Khoảng 10-15 phút thôi')).toBe('Khoảng 10-15 phút thôi');
  });

  it('bóc gạch đầu dòng ở nhiều dòng', () => {
    expect(chuChoMayDoc('- một\n- hai\n- ba')).toBe('một hai ba');
  });

  it('đổi khối mã thành một câu, không đọc mã', () => {
    const ra = chuChoMayDoc('Làm thế này:\n```ts\nconst a = 1;\n```\nxong.');
    expect(ra).not.toContain('const');
    expect(ra).toContain('khung chat');
  });

  it('giữ nhãn của liên kết, bỏ đường dẫn', () => {
    expect(chuChoMayDoc('Xem [trang Phỏng vấn](https://cuongthai.com/interview) nhé'))
      .toBe('Xem trang Phỏng vấn nhé');
  });

  it('KHÔNG đụng tới dấu sao giữa từ (phép nhân)', () => {
    expect(chuChoMayDoc('2 * 3 = 6')).toBe('2 * 3 = 6');
  });

  it('bỏ tiêu đề và đường kẻ', () => {
    expect(chuChoMayDoc('## Tiêu đề\n---\nnội dung')).toBe('Tiêu đề nội dung');
  });

  it('chữ vốn đã sạch thì giữ nguyên', () => {
    const sach = 'Mình là Odin. Bạn cần gì cứ nói nhé.';
    expect(chuChoMayDoc(sach)).toBe(sach);
  });

  // Điều CẦN ở đây là máy đọc không phát ra ký tự `|` và không mất chữ trong ô.
  // Dấu phẩy rơi vào đâu giữa hai hàng là định dạng tôi tự nghĩ ra, không phải
  // yêu cầu — bắt mã chiều theo nó là kiểm một thứ chẳng ai cần.
  it('bảng: bỏ khung, giữ chữ, không đọc ký tự gạch dọc', () => {
    const ra = chuChoMayDoc('| a | b |\n| --- | --- |\n| 1 | 2 |');
    expect(ra).not.toContain('|');
    expect(ra).not.toContain('---');
    for (const o of ['a', 'b', '1', '2']) expect(ra).toContain(o);
  });
});
