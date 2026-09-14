/**
 * Quy đổi toạ độ khung cắt.
 *
 * Người dùng khoanh trên tấm ảnh ĐANG HIỂN THỊ (đã co cho vừa cửa sổ), nhưng
 * lệnh cắt phải tính theo điểm ảnh THẬT. Một tấm 4K vẽ trong khung 800px là tỉ
 * lệ 1:4,3 — quên nhân là cắt được đúng một góc trên-trái bé xíu của thứ người
 * dùng vừa khoanh, và không có lỗi nào để thấy.
 */
import { describe, expect, it } from 'vitest';
import { doiToaDo } from './ChupManHinh';

describe('doiToaDo', () => {
  it('ảnh 4K vẽ trong khung 800px thì nhân đúng tỉ lệ', () => {
    const k = doiToaDo({ x: 100, y: 50, w: 200, h: 100 }, 3456, 800);
    const ti = 3456 / 800;
    expect(k).toEqual({ x: 100 * ti, y: 50 * ti, w: 200 * ti, h: 100 * ti });
  });

  it('hiển thị đúng cỡ thật thì giữ nguyên', () => {
    expect(doiToaDo({ x: 10, y: 20, w: 30, h: 40 }, 800, 800))
      .toEqual({ x: 10, y: 20, w: 30, h: 40 });
  });

  it('bề rộng hiển thị bằng 0 thì không chia cho 0', () => {
    // Xảy ra khi ảnh chưa vẽ xong mà người dùng đã bấm. Phải ra số hữu hạn.
    const k = doiToaDo({ x: 1, y: 1, w: 1, h: 1 }, 800, 0);
    expect(Number.isFinite(k.x)).toBe(true);
    expect(Number.isFinite(k.w)).toBe(true);
  });
});
