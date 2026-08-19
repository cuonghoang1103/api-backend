/**
 * Lọc lệnh gạch chéo. Cái bẫy chính: gõ `/cl` rồi Enter mà bảng không chặn
 * thì chuỗi đó được GỬI cho model như một câu hỏi — tốn một lượt để model
 * trả lời rằng nó không hiểu. Phần chặn nằm ở component; ở đây kiểm phần lọc.
 */
import { describe, expect, it } from 'vitest';

import { locLenh } from './GoiYLenh';

describe('lọc lệnh', () => {
  it('gõ `/` hiện tất cả', () => {
    expect(locLenh('/').length).toBeGreaterThan(0);
  });

  it('khớp theo tiền tố', () => {
    expect(locLenh('/cl').map((l) => l.ten)).toEqual(['/clear']);
  });

  it('khớp cả TÊN KHÁC nhưng vẫn hiện tên chính', () => {
    // Gõ `/mo` phải ra `/clear`, không phải `/moi` — tài liệu và mọi chỗ khác
    // gọi nó là `/clear`, hiện tên khác là dạy người dùng một cái tên phụ.
    expect(locLenh('/mo').map((l) => l.ten)).toEqual(['/clear']);
  });

  it('không phải lệnh thì không gợi ý gì', () => {
    expect(locLenh('sửa giúp tôi file này')).toEqual([]);
    expect(locLenh('')).toEqual([]);
  });

  it('đã có khoảng trắng ⇒ đang gõ THAM SỐ, đừng chen vào', () => {
    expect(locLenh('/clear ')).toEqual([]);
  });

  it('gõ sai thì im, không đoán bừa', () => {
    expect(locLenh('/xyz')).toEqual([]);
  });
});
