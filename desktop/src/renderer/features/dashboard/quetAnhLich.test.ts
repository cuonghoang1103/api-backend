import { describe, expect, it } from 'vitest';

import { tiLeThuNho } from './quetAnhLich';

describe('hệ số thu nhỏ ảnh', () => {
  it('ảnh nhỏ hơn trần thì GIỮ NGUYÊN, không phóng to', () => {
    // Phóng to ảnh chụp không làm model đọc rõ hơn, chỉ làm tệp nặng thêm.
    expect(tiLeThuNho(800, 600)).toBe(1);
    expect(tiLeThuNho(2000, 1200)).toBe(1);
  });

  it('thu theo CẠNH DÀI, không theo chiều rộng', () => {
    // Ảnh chụp dọc trên điện thoại có chiều cao mới là cạnh vượt trần; lấy
    // theo chiều rộng thì nó đi nguyên kích thước.
    expect(tiLeThuNho(1000, 4000)).toBe(0.5);
    expect(tiLeThuNho(4000, 1000)).toBe(0.5);
  });

  it('kích thước vô nghĩa ⇒ 1, không chia cho 0', () => {
    expect(tiLeThuNho(0, 0)).toBe(1);
    expect(tiLeThuNho(Number.NaN, 10)).toBe(1);
  });
});
