/**
 * Kiểm thang dB của đồng hồ mức.
 *
 * Chỉ kiểm phần TÍNH. Phần vẽ là một vòng `requestAnimationFrame` ghi thẳng
 * vào `style` — kiểm nó bằng jsdom là kiểm một cái đồng hồ giả trong một trình
 * duyệt giả, tốn công mà không nói lên điều gì về thứ người dùng nhìn thấy.
 * Thang đo thì khác: sai ở đây là mọi con số trên đồng hồ đều sai.
 */
import { describe, expect, it } from 'vitest';
import { viTriDb } from './DongHoMuc';

describe('thang dB', () => {
  it('toàn thang là 1, im lặng là 0', () => {
    expect(viTriDb(1)).toBe(1);
    expect(viTriDb(0)).toBe(0);
  });

  it('⭐ −6 dB nằm ở 7/8 dải, không phải ở giữa', () => {
    /* Đây là cả lý do dùng thang lô-ga. Trên thang tuyến tính thì −6 dBFS
       (biên độ 0,5) rơi đúng giữa dải, và cả một bài đã master — vốn sống
       trong khoảng −6…0 dB — nằm chen chúc ở nửa trên. */
    expect(viTriDb(0.5)).toBeCloseTo(1 - 6 / 48, 3);
    expect(viTriDb(0.5)).toBeGreaterThan(0.85);
  });

  it('−24 dB nằm đúng nửa dải', () => {
    expect(viTriDb(10 ** (-24 / 20))).toBeCloseTo(0.5, 6);
  });

  it('dưới đáy thang thì về 0 chứ không âm', () => {
    /* Không kẹp thì `scaleY()` nhận số âm và dải LẬT NGƯỢC — mọc xuống dưới. */
    expect(viTriDb(10 ** (-60 / 20))).toBe(0);
    expect(viTriDb(1e-12)).toBe(0);
  });

  it('vượt toàn thang vẫn kẹp ở 1', () => {
    /* Bản trộn chưa qua hạn biên có thể vượt ±1. Không kẹp thì dải tràn ra
       ngoài khung của nó. */
    expect(viTriDb(2)).toBe(1);
  });

  it('đơn điệu tăng — to hơn thì kim cao hơn, không có ngoại lệ', () => {
    let truoc = -1;
    for (let db = -60; db <= 6; db += 1) {
      const v = viTriDb(10 ** (db / 20));
      expect(v).toBeGreaterThanOrEqual(truoc);
      truoc = v;
    }
  });
});
